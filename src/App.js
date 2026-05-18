/* global globalThis */
import React, { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { StyledEngineProvider } from "@mui/material/styles";
import routes from "./routes";
import AppContent from "./views/AppContent/AppContent";
import { SessionExpiredProvider } from "./context/SessionExpiredProvider";
import { openAuthSessionExpiredModal } from "./context/sessionExpiredBridge";
import theme from "./assets/styles/theme";
import axios from "axios";
import { getFontFamily } from "./utils/fontUtils";
import { getLocalData } from "./utils/constants";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { startEvent } from "./services/callTelemetryIntract";
import {
  end,
  error as logTelemetryError,
  initialize,
} from "./services/telemetryService";
import { logoutUser } from "./services/orchestration/orchestrationService";
import { reportError } from "./utils/errorReporter";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import GetSetResultLoadingOverlay from "./components/GetSetResultLoadingOverlay";
import { RESILIENCE_CONFIG } from "./config/config";

const App = () => {
  const ranonce = useRef(false);

  const navigate = useNavigate();
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    const updateThemeFont = () => {
      const lang = getLocalData("lang");
      const fontFamily = getFontFamily(lang);
      document.documentElement.style.setProperty("--theme-font", fontFamily);
    };

    // Update on mount
    updateThemeFont();

    // Listen for language changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === "lang") {
        updateThemeFont();
      }
    };

    // Listen for storage events (when language changes in other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for language changes (for same-tab changes)
    const interval = setInterval(() => {
      updateThemeFont();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Minimal jQuery stub — the telemetry SDK calls jQuery.ajax() for syncEvents.
    // We removed the real jQuery <script> tag (saves ~87 KB). This stub satisfies
    // the one usage (POST telemetry events) using native fetch instead.
    if (!window.jQuery) {
      const jQueryStub = {
        ajax: ({
          url,
          type,
          data,
          contentType,
          headers,
          success,
          error,
        } = {}) => {
          // Declare promise first so jqXHR closures can reference it
          let promise;

          // Build a jqXHR-compatible shim so callers can chain .done()/.fail()
          const jqXHR = {
            done: (cb) => {
              promise.then(cb);
              return jqXHR;
            },
            fail: (cb) => {
              promise.catch(cb);
              return jqXHR;
            },
            always: (cb) => {
              promise.finally(cb);
              return jqXHR;
            },
            then: (res, rej) => promise.then(res, rej),
          };

          promise = fetch(url, {
            method: type || "POST",
            headers: {
              "Content-Type": contentType || "application/json",
              // Forward any extra headers the SDK passes (e.g. Authorization token)
              ...(headers || {}),
            },
            body:
              data != null
                ? typeof data === "string"
                  ? data
                  : JSON.stringify(data)
                : undefined,
            // keepalive lets the request survive iframe unmount / tab close
            // so logout telemetry isn't canceled when AXL navigates away.
            keepalive: true,
          })
            .then((r) => {
              if (r.ok) return r.json();
              // Non-2xx (e.g. 401): call error callback if provided — never throw
              if (typeof error === "function") error(r, r.status, r.statusText);
              return undefined;
            })
            .then((json) => {
              if (json !== undefined && typeof success === "function")
                success(json);
            })
            .catch((fetchErr) => {
              // Network-level failure — telemetry is non-critical, swallow silently
              if (typeof error === "function")
                error(fetchErr, 0, "Network Error");
            });

          return jqXHR;
        },
      };
      window.jQuery = jQueryStub;
      window.$ = jQueryStub;
    }

    // Load telemetry SDK asynchronously — all window.telemetry usages use optional
    // chaining (?.) so the app is fully functional before this resolves
    import("@tekdi/all-telemetry-sdk/index.js").catch((err) =>
      console.error("Telemetry SDK failed to load:", err)
    );

    const handleBeforeUnload = (event) => {
      window.telemetry &&
        window.telemetry.syncEvents &&
        window.telemetry.syncEvents();
    };

    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Re-initialize telemetry on page refresh: if a session exists in localStorage,
  // initialize() must be called on every mount — not just after login — otherwise
  // telemetry events (e.g. response() in VoiceAnalyser) crash with
  // "Cannot read properties of undefined (reading 'get')".
  // initialize() is idempotent (guarded by CsTelemetryModule.instance.isInitialised),
  // so calling it here is a no-op when the user just logged in normally.
  useEffect(() => {
    if (process.env.REACT_APP_IS_APP_IFRAME === "true") return;
    const apiToken = localStorage.getItem("apiToken");
    if (!apiToken) return;

    initialize({
      context: {
        mode: process.env.REACT_APP_MODE,
        authToken: apiToken,
        did: localStorage.getItem("deviceId") || "",
        uid: localStorage.getItem("virtualId") || apiToken || "anonymous",
        channel: process.env.REACT_APP_CHANNEL,
        env: process.env.REACT_APP_ENV,
        pdata: {
          id: process.env.REACT_APP_ID,
          ver: process.env.REACT_APP_VER,
          pid: process.env.REACT_APP_PID,
        },
        tags: [""],
        timeDiff: 0,
        host: process.env.REACT_APP_HOST,
        endpoint: process.env.REACT_APP_ENDPOINT,
        apislug: process.env.REACT_APP_APISLUG,
      },
      config: {},
      metadata: {},
    });
  }, []);

  useEffect(() => {
    if (ranonce.current) return;
    ranonce.current = true;

    // Apply global request timeout so no spinner/overlay hangs indefinitely
    // when the backend is slow or unreachable. Value is configured in config.js.
    axios.defaults.timeout = RESILIENCE_CONFIG.API_TIMEOUT_MS;

    const RETRY_MAX = RESILIENCE_CONFIG.RETRY_MAX;
    const RETRY_BASE_DELAY_MS = RESILIENCE_CONFIG.RETRY_BASE_DELAY_MS;

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const config = error?.config || {};
        const statusCode = error?.response?.status;

        // --- Telemetry logging (fires on every failure, including retries) ---
        const responseData = error?.response?.data;
        const endpoint = config.url || error?.request?.responseURL || "unknown";
        const retryAttempt = config.__retryCount || 0;
        const errCode =
          responseData?.params?.err ||
          responseData?.err ||
          `API_${statusCode || "UNKNOWN"}`;
        const errType =
          responseData?.responseCode ||
          responseData?.errtype ||
          (statusCode ? `HTTP_${statusCode}` : "SYSTEM");

        logTelemetryError(
          error,
          {
            err: errCode,
            errtype: errType,
            pageid: window?.location?.pathname || "",
            plugin: {
              id: endpoint,
              ver: "1.0",
            },
            retryAttempt,
          },
          "ET"
        );

        // --- Retry logic: only for 5xx or network errors ---
        const isServerError = statusCode >= 500;
        const isNetworkError = !error.response; // no response at all
        const isRetryable = isServerError || isNetworkError;

        if (isRetryable) {
          config.__retryCount = retryAttempt || 0;

          if (config.__retryCount < RETRY_MAX) {
            config.__retryCount += 1;
            const delay =
              RETRY_BASE_DELAY_MS * Math.pow(2, config.__retryCount - 1);

            console.warn(
              `[axios-retry] Attempt ${config.__retryCount}/${RETRY_MAX} for ${config.url} (delay ${delay}ms)`
            );

            return new Promise((resolve) => setTimeout(resolve, delay)).then(
              () => axios(config)
            );
          }
          // All retries exhausted — fall through to auth check + reject
        }

        // Report to error system after all retries are exhausted
        if (isRetryable && config.__retryCount >= RETRY_MAX) {
          reportError({
            type: "api_error_exhausted",
            endpoint: config.url || "unknown",
            status: statusCode,
            retryCount: config.__retryCount,
            message: error?.response?.data?.message || error?.message,
            stack: error?.stack,
          });
        }

        // --- Auth error handling (401 / 400) ---
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 400)
        ) {
          const errorMessage = error?.response?.data?.message
            ?.trim()
            ?.toLowerCase();
          if (
            errorMessage?.includes("unauthorized") ||
            errorMessage?.includes("token") ||
            errorMessage?.includes("logged")
          ) {
            const raw =
              error?.response?.data?.message ??
              error?.response?.data?.error ??
              error?.response?.data?.msg;
            const displayMessage =
              typeof raw === "string" && raw.trim() ? raw.trim() : undefined;
            const notifyParent = process.env.REACT_APP_IS_APP_IFRAME === "true";
            openAuthSessionExpiredModal({
              message: displayMessage,
              notifyParent,
            });
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  // Step 1: Check token/profile
  useEffect(() => {
    const token = localStorage.getItem("apiToken");
    const profileName = getLocalData("profileName");

    if (token && profileName) {
      setAppInitialized(true);
    } else if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
      const trustedParentOrigin = process.env.REACT_APP_AXL_HOST;
      if (trustedParentOrigin) {
        try {
          globalThis.parent?.postMessage(
            { type: "SESSION_EXPIRED" },
            trustedParentOrigin
          );
        } catch (error) {
          console.error("Parent SESSION_EXPIRED postMessage failed:", error);
        }
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Step 2: Initialize telemetry
  useEffect(() => {
    if (!appInitialized) return;
    if (process.env.REACT_APP_IS_APP_IFRAME !== "true") return;

    const initService = async (visitorId) => {
      await initialize({
        context: {
          mode: process.env.REACT_APP_MODE,
          authToken: localStorage.getItem("apiToken"),
          did: localStorage.getItem("deviceId") || visitorId,
          uid: getLocalData("profileName") || "anonymous",
          channel: process.env.REACT_APP_CHANNEL,
          env: process.env.REACT_APP_ENV,
          pdata: {
            id: process.env.REACT_APP_ID,
            ver: process.env.REACT_APP_VER,
            pid: process.env.REACT_APP_PID,
          },
          tags: [""],
          timeDiff: 0,
          host: process.env.REACT_APP_HOST,
          endpoint: process.env.REACT_APP_ENDPOINT,
          apislug: process.env.REACT_APP_APISLUG,
        },
        config: {},
        metadata: {},
      });

      if (localStorage.getItem("contentSessionId") === null) {
        startEvent();
      }
    };

    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      await initService(visitorId);
    };

    setFp().catch((err) => console.error("Telemetry init failed:", err));
  }, [appInitialized]);

  // AXL appbar logout: invalidate the token and flush telemetry here,
  // then ack so the parent can safely unmount this iframe.
  useEffect(() => {
    if (process.env.REACT_APP_IS_APP_IFRAME !== "true") return;

    const handleParentMessage = async (event) => {
      // Only accept LOGOUT from the trusted AXL parent origin.
      const trustedParentOrigin = process.env.REACT_APP_AXL_HOST;
      if (!trustedParentOrigin || event.origin !== trustedParentOrigin) return;
      if (event?.data?.type !== "LOGOUT") return;
      // Reply on the parent's MessagePort instead of window.parent.postMessage.
      const replyPort = event.ports?.[0];
      if (!replyPort) {
        console.warn("LOGOUT received without reply port; ack will be skipped");
      }
      try {
        // Queue END + force SDK flush while the token is still valid; wait
        // gives the XHR time to start before logoutUser() invalidates it.
        end({ summary: { reason: "user_initiated_logout" } });
        globalThis.telemetry?.syncEvents?.();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Telemetry end event failed:", error);
      }
      try {
        await logoutUser();
      } catch (error) {
        console.error("Logout API failed:", error);
      }
      // Clear local + session storage BEFORE acking — prevents the iframe
      // from re-authenticating with stale token if AXL remounts it.
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.error("Storage clear failed:", error);
      }
      try {
        replyPort?.postMessage({ type: "LOGOUT_COMPLETE" });
        replyPort?.close();
      } catch (error) {
        console.error("LOGOUT_COMPLETE port message failed:", error);
      }
    };

    window.addEventListener("message", handleParentMessage);
    return () => window.removeEventListener("message", handleParentMessage);
  }, []);

  return (
    <ErrorBoundary>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <SessionExpiredProvider>
            <GetSetResultLoadingOverlay />
            <AppContent routes={routes} />
          </SessionExpiredProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </ErrorBoundary>
  );
};

export default App;
