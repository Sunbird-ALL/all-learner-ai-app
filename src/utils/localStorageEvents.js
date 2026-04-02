/**
 * Custom event-driven localStorage bridge.
 *
 * Problem: window.storage only fires in OTHER tabs/windows, not the same tab.
 * Previously solved with setInterval polling (50–100ms). This module replaces
 * that pattern with a zero-polling, event-driven approach.
 *
 * Usage:
 *   import { setLocalDataAndNotify, onLocalData } from "../utils/localStorageEvents";
 *
 *   // Write + notify:
 *   setLocalDataAndNotify("f1FlowIndex", 3);
 *
 *   // Listen (in useEffect):
 *   const off = onLocalData("f1FlowIndex", (value) => setState(value));
 *   return off; // cleanup
 */

import { setLocalData } from "./constants";

const EVENT_NAME = "localdata:change";

/** Write to localStorage AND dispatch a synchronous custom event. */
export const setLocalDataAndNotify = (key, value) => {
  setLocalData(key, value);
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, { detail: { key, value: String(value) } })
  );
};

/** Subscribe to changes for a specific key. Returns an unsubscribe function. */
export const onLocalData = (key, callback) => {
  const handler = (e) => {
    if (e.detail.key === key) callback(e.detail.value);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};
