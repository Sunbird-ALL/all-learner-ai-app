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
import { initialize } from "./services/telemetryService";
import { startEvent } from "./services/callTelemetryIntract";
import { error as logTelemetryError } from "./services/telemetryService";
import { useNavigate } from "react-router-dom";
import GetSetResultLoadingOverlay from "./components/GetSetResultLoadingOverlay";

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

  useEffect(() => {
    if (ranonce.current) return;
    ranonce.current = true;

    const RETRY_MAX = 3;
    const RETRY_BASE_DELAY_MS = 1000; // 1s, 2s, 4s (exponential backoff)

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

            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              // Save reason before clearing so parent can read it
              const logoutReason = displayMessage || errorMessage || "";
              localStorage.setItem("logout_reason", logoutReason);
              localStorage.setItem("logout_status", "complete");
              // localStorage.clear();
              sessionStorage.clear();
            } else {
              openAuthSessionExpiredModal({ message: displayMessage });
            }
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
    } else {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        localStorage.setItem("logout_reason", "");
        localStorage.setItem("logout_status", "complete");
      } else {
        navigate("/login");
      }
    }
  }, [navigate]);

  // Step 2: Initialize telemetry
  useEffect(() => {
    if (!appInitialized) return;

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

  // Step 3: Sync telemetry before unload
  useEffect(() => {
    if (!appInitialized) return;

    const handleBeforeUnload = () => {
      window.telemetry?.syncEvents?.();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [appInitialized]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SessionExpiredProvider>
          <GetSetResultLoadingOverlay />
          <AppContent routes={routes} />
        </SessionExpiredProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
