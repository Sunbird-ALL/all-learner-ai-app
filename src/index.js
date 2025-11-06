import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import "./assets/styles/index.scss";
import store from "./store/configureStore";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { getCSP } from "./csp";
import * as serviceWorkerRegistration from "./utils/serviceWorkerRegistration";

const injectCSP = () => {
  try {
    const cspContent = getCSP(process.env); // Pass environment variables
    const metaTag = document.createElement("meta");
    metaTag.httpEquiv = "Content-Security-Policy";
    metaTag.content = cspContent.trim();
    document.head.appendChild(metaTag);
  } catch (error) {
    console.error("Failed to inject CSP:", error);
  }
};

injectCSP();

render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// Register service worker for PWA functionality
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

// TEMPORARY: Set to true to disable service worker for testing
const DISABLE_SERVICE_WORKER = false; // Re-enabled for PWA testing

if (DISABLE_SERVICE_WORKER) {
  console.log("[Service Worker] Service worker disabled for testing");
  serviceWorkerRegistration.unregister();
} else {
  serviceWorkerRegistration.register({
    onSuccess: () => {
      console.log("Service Worker registered successfully");
    },
    onUpdate: (registration) => {
      console.log(
        "New service worker available. Update will be applied when all tabs are closed."
      );
      // Optional: Show update notification to user
      if (window.confirm("New version available! Reload to update?")) {
        registration.waiting?.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }
    },
  });
}
