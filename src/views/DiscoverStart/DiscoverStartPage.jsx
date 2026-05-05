import React, { useState, useEffect } from "react";
import Assesment from "../../components/Assesment/Assesment";
import { AudioDiagnosticModal } from "../../components/AudioDiagnostic";

const DiscoverStart = () => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_IS_APP_IFRAME !== "true") return;
    if (!localStorage.getItem("audioDiagnosticShown")) {
      setShowDiagnostic(true);
    }
  }, []);

  return (
    <>
      <Assesment discoverStart />
      <AudioDiagnosticModal
        show={showDiagnostic}
        onClose={() => {
          setShowDiagnostic(false);
          localStorage.setItem("audioDiagnosticShown", "true");
        }}
      />
    </>
  );
};

export default DiscoverStart;
