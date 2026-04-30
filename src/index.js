import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./assets/styles/index.scss";
import store from "./store/configureStore";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { getCSP } from "./csp";
import { reportError, flushErrorQueue } from "./utils/errorReporter";

// Catch all unhandled JS errors
window.onerror = (message, source, lineno, colno, error) => {
  reportError({
    type: "js_error",
    message,
    source,
    lineno,
    colno,
    stack: error?.stack,
  });
};

// Catch all unhandled Promise rejections
window.onunhandledrejection = (event) => {
  reportError({
    type: "promise_rejection",
    message: String(event.reason),
    stack: event.reason?.stack,
  });
};

// Flush errors buffered in previous sessions when backend was down
(async () => {
  await flushErrorQueue();
})();

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

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
