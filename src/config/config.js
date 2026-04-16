/* Constants to be used across the app */

export const APP_CONSTANTS = {
  APP_TITLE: "Consuli",
  PAGE_NOT_FOUND: "Page Not found",
};

export const API_CONSTANTS = {
  API_URL: "http://localhost:3001/",
};

/**
 * Resilience / availability config.
 * Tweak these values without touching any component or service file.
 */
export const RESILIENCE_CONFIG = {
  /** Axios request timeout in milliseconds. Applies to every API call. */
  API_TIMEOUT_MS: 15000,
  /** Maximum number of retries for 5xx / network errors (set in App.js interceptor). */
  RETRY_MAX: 3,
  /** Base delay (ms) for exponential back-off between retries. */
  RETRY_BASE_DELAY_MS: 1000,
};
