let authSessionExpiredHandler = null;

export function registerAuthSessionExpiredHandler(fn) {
  authSessionExpiredHandler = fn;
}

export function unregisterAuthSessionExpiredHandler() {
  authSessionExpiredHandler = null;
}

/**
 * Open session-expired modal from non-React code (e.g. axios interceptor).
 * @param {{ message: string, notifyParent: boolean }} payload
 */
export function openAuthSessionExpiredModal(payload) {
  if (authSessionExpiredHandler) {
    authSessionExpiredHandler(payload);
  }
}
