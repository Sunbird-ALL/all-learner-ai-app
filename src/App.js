import React, { useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";
import routes from "./routes";
import AppContent from "./views/AppContent/AppContent";
import theme from "./assets/styles/theme";
import axios from "axios";
// @tekdi/all-telemetry-sdk is loaded lazily after mount (192 KB — kept out of initial bundle)

const App = () => {
  const navigate = useNavigate();
  const ranonce = useRef(false);

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

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
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
          if (
            localStorage.getItem("contentSessionId") &&
            process.env.REACT_APP_IS_APP_IFRAME === "true"
          ) {
            window.parent.postMessage(
              {
                message: "Logged out!",
              },
              window?.location?.ancestorOrigins?.[0] ||
                window.parent.location.origin
            );
            console.log("if logout!");
            localStorage.clear();
            sessionStorage.clear();
          } else {
            console.log("else logout!");
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AppContent routes={routes} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
