// @tekdi/all-telemetry-sdk is a legacy global script — it attaches
// window.telemetry via sloppy-mode `this`/implicit globals, which breaks under
// strict ESM. Load it as a classic <script> so it runs in sloppy mode.
export function loadTelemetrySdkViaScript(src) {
  return new Promise((resolve, reject) => {
    if (window.telemetry) {
      resolve(window.telemetry);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(window.telemetry);
    script.onerror = () =>
      reject(new Error(`Failed to load telemetry SDK from ${src}`));
    document.head.appendChild(script);
  });
}
