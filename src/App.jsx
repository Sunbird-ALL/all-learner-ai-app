import React, { useEffect, useRef } from "react";
import { ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import routes from "./routes";
import { AppContent } from "./views";
import theme from "./assets/styles/theme";
import { initialize, end } from "./services/telementryService";
import { startEvent } from "./services/callTelemetryIntract";
//import "@tekdi/all-telemetry-sdk/index.js";
import axios from "axios";

const App = () => {
  const navigate = useNavigate();
  const ranonce = useRef(false);

  console.log("App loaded");

  useEffect(() => {
    const initService = async (visitorId) => {
      await initialize({
        context: {
          mode: import.meta.env.VITE_MODE, // To identify preview used by the user to play/edit/preview
          authToken: localStorage.getItem("token"), // Auth key to make  api calls
          did: localStorage.getItem("deviceId") || visitorId, // Unique id to identify the device or browser
          uid: "anonymous",
          channel: import.meta.env.VITE_CHANNEL, // Unique id of the channel(Channel ID)
          env: import.meta.env.VITE_ENV,

          pdata: {
            // optional
            id: import.meta.env.VITE_ID, // Producer ID. For ex: For sunbird it would be "portal" or "genie"
            ver: import.meta.env.VITE_VER, // Version of the App
            pid: import.meta.env.VITE_PID, // Optional. In case the component is distributed, then which instance of that component
          },
          tags: [
            // Defines the tags data
            "",
          ],
          timeDiff: 0, // Defines the time difference// Defines the object roll up data
          host: import.meta.env.VITE_HOST, // Defines the from which domain content should be load
          endpoint: import.meta.env.VITE_ENDPOINT,
          apislug: import.meta.env.VITE_APISLUG,
        },
        config: {},
        // tslint:disable-next-line:max-line-length
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
      // //if (!localStorage.getItem("did")) {
      //   localStorage.setItem("did", visitorId);
      // //}
      initService(visitorId);
    };

    setFp();
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
