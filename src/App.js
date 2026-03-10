import React, { useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material";
import { useNavigate } from "../node_modules/react-router-dom/dist/index";
import { StyledEngineProvider } from "@mui/material/styles";
import routes from "./routes";
import { AppContent } from "./views";
import theme from "./assets/styles/theme";
import "@tekdi/all-telemetry-sdk/index.js";
import axios from "axios";
import { getFontFamily } from "./utils/fontUtils";
import { getLocalData } from "./utils/constants";

const App = () => {
  const navigate = useNavigate();
  const ranonce = useRef(false);

  // Update CSS variable --theme-font based on language
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
