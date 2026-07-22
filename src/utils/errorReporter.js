import { getConfig } from "../config/runtimeConfig";

/**
 * Safely parse a JSON string without throwing.
 * Returns `fallback` (default: null) if parsing fails.
 * @param {string|null} str
 * @param {*} [fallback=null]
 */
export function safeParseJSON(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Standard error payload shape sent to /api/client-errors.
 * `ts` and `url` are added automatically by reportError().
 *
 * @typedef {Object} ErrorPayload
 * @property {string}  type         - Error category:
 *                                    "api_error" | "api_error_exhausted" |
 *                                    "audio_error" | "react_error" |
 *                                    "login_error" | "js_error" |
 *                                    "promise_rejection" | "telemetry_init_failure"
 * @property {string}  [endpoint]   - API function name or URL (api_error types)
 * @property {number}  [status]     - HTTP status code
 * @property {string}  [action]     - System action that triggered the error (audio_error types)
 * @property {string}  [message]    - Human-readable error description
 * @property {string}  [stack]      - Error stack trace
 * @property {string}  [componentStack] - React component stack (react_error)
 * @property {number}  [retryCount] - Retries attempted before giving up (api_error_exhausted)
 * @property {number}  [ts]         - Unix timestamp in ms (auto-added)
 * @property {string}  [url]        - Page URL at time of error (auto-added)
 */

// Read lazily (not at module scope) so this still works if an error fires
// before the runtime config fetch in src/index.js has resolved.
function getErrorEndpoint() {
  return (
    (getConfig("REACT_APP_LEARNER_AI_ORCHESTRATION_HOST") || "") +
    "/api/client-errors"
  );
}

const QUEUE_KEY = "all_error_queue";
const MAX_QUEUE_SIZE = 50;

function bufferError(payload) {
  try {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    queue.push(payload);
    localStorage.setItem(
      QUEUE_KEY,
      JSON.stringify(queue.slice(-MAX_QUEUE_SIZE))
    );
  } catch {
    // localStorage unavailable (private mode, storage full) — silently skip
  }
}

export async function reportError(payload) {
  const enriched = {
    ...payload,
    ts: Date.now(),
    url: window.location.href,
  };
  try {
    await fetch(getErrorEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enriched),
      keepalive: true, // survives page unload
    });
  } catch {
    // Backend unreachable — buffer locally for next session
    bufferError(enriched);
  }
}

export async function flushErrorQueue() {
  let queue;
  try {
    queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return;
  }
  if (!queue.length) return;

  const flushed = [];
  for (const item of queue) {
    try {
      await fetch(getErrorEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      flushed.push(item);
    } catch {
      break; // still unreachable — stop and keep remaining items
    }
  }

  const remaining = queue.slice(flushed.length);
  if (remaining.length) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  } else {
    localStorage.removeItem(QUEUE_KEY);
  }
}
