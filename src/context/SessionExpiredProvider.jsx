/* global globalThis */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageDialog } from "../components/Assesment/Assesment";
import {
  registerAuthSessionExpiredHandler,
  unregisterAuthSessionExpiredHandler,
} from "./sessionExpiredBridge";
import { getUiStrings } from "../constants/strings";
import { getLocalData } from "../utils/constants";

export function SessionExpiredProvider({ children }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const ui = getUiStrings(getLocalData("lang") || "en");
  /** Avoid stacking duplicate modals (parallel 401s or re-renders). */
  const activeRef = useRef(false);

  const closeModal = useCallback(() => {
    setModal(null);
    activeRef.current = false;
  }, []);

  const runAuthLogout = useCallback(
    (notifyParent) => {
      if (notifyParent) {
        globalThis.parent.postMessage(
          { type: "SESSION_EXPIRED" },
          globalThis?.location?.ancestorOrigins?.[0] ||
            globalThis.parent.location.origin
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
    const { notifyParent } = modal;
    closeModal();
    runAuthLogout(!!notifyParent);
  }, [modal, closeModal, runAuthLogout]);

  useEffect(() => {
    registerAuthSessionExpiredHandler(({ message, notifyParent }) => {
      if (activeRef.current) return;
      activeRef.current = true;
      const text =
        typeof message === "string" && message.trim()
          ? message.trim()
          : ui.SESSION_EXPIRED_DEFAULT;
      setModal({
        message: text,
        notifyParent: !!notifyParent,
      });
    });
    return () => unregisterAuthSessionExpiredHandler();
  }, []);

  return (
    <>
      {children}
      {modal && (
        <MessageDialog
          message={modal.message}
          closeDialog={handleConfirm}
          isError
          dontShowHeader={false}
        />
      )}
    </>
  );
}
