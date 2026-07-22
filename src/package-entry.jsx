import "regenerator-runtime/runtime";
import telemetrySdkUrl from "@tekdi/all-telemetry-sdk/index.js?url";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { setConfig } from "./config/runtimeConfig";
import "./assets/styles/index.scss";
import "./index.css";

// App.js loads the telemetry SDK from this URL via a classic <script> tag.
window.__ALL_TELEMETRY_SDK_URL__ = telemetrySdkUrl;

export function MyApplication({ config, basename }) {
  const [bundle, setBundle] = useState(null);

  // Config must be set before App/routes are imported (routes read it at
  // module-load time), so import them dynamically after setConfig.
  useEffect(() => {
    setConfig(config || {});
    Promise.all([import("./store/configureStore"), import("./App")])
      .then(([store, app]) =>
        setBundle({ store: store.default, App: app.default })
      )
      .catch((err) => console.error("Failed to load app bundle:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!bundle) return null;

  const { store, App } = bundle;
  return (
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
}

export default MyApplication;
