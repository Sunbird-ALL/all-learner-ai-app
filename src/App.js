import React, { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, ThemeProvider } from "@mui/material";
import { useNavigate } from "../node_modules/react-router-dom/dist/index";
import { StyledEngineProvider } from "@mui/material/styles";
import routes from "./routes";
import { AppContent } from "./views";
import theme from "./assets/styles/theme";
import "@tekdi/all-telemetry-sdk/index.js";
import axios from "axios";
import { getFontFamily } from "./utils/fontUtils";
import { getLocalData } from "./utils/constants";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { initialize } from "./services/telementryService";
import { startEvent } from "./services/callTelemetryIntract";

const App = () => {
  const navigate = useNavigate();
  const ranonce = useRef(false);

  const [checkingAuth, setCheckingAuth] = useState(true);
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

  // Step 1: Check token/profile
  useEffect(() => {
    const token = localStorage.getItem("apiToken");
    const profileName = getLocalData("profileName");

    if (token && profileName) {
      setAppInitialized(true);
    } else {
      navigate("/login");
    }
    setCheckingAuth(false); // stop loader after check
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
          uid: "anonymous",
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

      if (!ranonce.current) {
        if (localStorage.getItem("contentSessionId") === null) {
          startEvent();
        }
        ranonce.current = true;
      }
    };

    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      initService(visitorId);
    };

    setFp();
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

  // Step 4: Axios interceptor for auth errors
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
          localStorage.setItem("logout_reason", errorMessage);
          localStorage.setItem("logout_status", "complete");
        }
      }
      return Promise.reject(error);
    }
  );

  // Show loader during auth check
  if (checkingAuth) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AppContent routes={routes} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
