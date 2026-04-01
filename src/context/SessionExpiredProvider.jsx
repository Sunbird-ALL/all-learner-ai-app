import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { MessageDialog } from "../components/Assesment/Assesment";
import {
  registerAuthSessionExpiredHandler,
  unregisterAuthSessionExpiredHandler,
} from "./sessionExpiredBridge";

const SessionExpiredContext = createContext(null);

const DEFAULT_AUTH_MESSAGE = "Your session has ended. Please sign in again.";
const DEFAULT_MISSING_TOKEN_MESSAGE = "You need to sign in to continue.";

export function SessionExpiredProvider({ children }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  /** Avoid stacking duplicate modals (parallel 401s or re-renders). */
  const activeRef = useRef(false);

  const closeModal = useCallback(() => {
    setModal(null);
    activeRef.current = false;
  }, []);

  const runAuthLogout = useCallback(
    (notifyParent) => {
      if (notifyParent) {
        window.parent.postMessage(
          { message: "Logged out!" },
          window?.location?.ancestorOrigins?.[0] ||
            window.parent.location.origin
        );
      }
      localStorage.clear();
      sessionStorage.clear();
      if (!notifyParent) {
        navigate("/login");
      }
    },
    [navigate]
  );

  const handleConfirm = useCallback(() => {
    if (!modal) return;
    const { variant, notifyParent } = modal;
    closeModal();
    if (variant === "auth") {
      runAuthLogout(!!notifyParent);
    } else {
      navigate("/login");
    }
  }, [modal, closeModal, navigate, runAuthLogout]);

  useEffect(() => {
    registerAuthSessionExpiredHandler(({ message, notifyParent }) => {
      if (activeRef.current) return;
      activeRef.current = true;
      const text =
        typeof message === "string" && message.trim()
          ? message.trim()
          : DEFAULT_AUTH_MESSAGE;
      setModal({
        variant: "auth",
        message: text,
        notifyParent: !!notifyParent,
      });
    });
    return () => unregisterAuthSessionExpiredHandler();
  }, []);

  const notifyMissingToken = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;
    setModal({
      variant: "missing-token",
      message: DEFAULT_MISSING_TOKEN_MESSAGE,
      notifyParent: false,
    });
  }, []);

  const value = useMemo(() => ({ notifyMissingToken }), [notifyMissingToken]);

  return (
    <SessionExpiredContext.Provider value={value}>
      {children}
      {modal && (
        <MessageDialog
          message={modal.message}
          closeDialog={handleConfirm}
          isError
          dontShowHeader={false}
        />
      )}
    </SessionExpiredContext.Provider>
  );
}

export function useSessionExpired() {
  const ctx = useContext(SessionExpiredContext);
  if (!ctx) {
    throw new Error(
      "useSessionExpired must be used within SessionExpiredProvider"
    );
  }
  return ctx;
}
