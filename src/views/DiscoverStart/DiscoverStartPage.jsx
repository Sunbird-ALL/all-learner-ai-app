import React, { useState } from "react";
import Assesment from "../../components/Assesment/Assesment";
import { AudioDiagnosticModal } from "../../components/AudioDiagnostic";
import { getLocalData, setLocalData } from "../../utils/constants";

const DiscoverStart = () => {
  const [showDiagnostic, setShowDiagnostic] = useState(
    process.env.REACT_APP_IS_APP_IFRAME === "true" &&
      !getLocalData("audioDiagnosticShown")
  );

  return (
    <>
      <Assesment discoverStart />
      <AudioDiagnosticModal
        show={showDiagnostic}
        onClose={() => {
          setShowDiagnostic(false);
          setLocalData("audioDiagnosticShown", "true");
        }}
      />
    </>
  );
};
export default DiscoverStart;
