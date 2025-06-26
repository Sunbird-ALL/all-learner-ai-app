import React, { useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";
import routes from "./routes";
import { AppContent } from "./views";
import theme from "./assets/styles/theme";
// import "@tekdi/all-telemetry-sdk/index.js";
import axios from "axios";

const App = () => {
  const navigate = useNavigate();
  const ranonce = useRef(false);

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
        if (
          error?.response?.data?.error === "Unauthorized" ||
          error?.response?.data?.error === "Invalid token" ||
          error?.response?.data?.error === "Token expired"
        ) {
          if (
            localStorage.getItem("contentSessionId") &&
            import.meta.env.VITE_IS_APP_IFRAME === "true"
          ) {
            window.parent.postMessage(
              {
                message: "Unauthorized",
              },
              window?.location?.ancestorOrigins?.[0] ||
                window.parent.location.origin
            );
          } else {
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
