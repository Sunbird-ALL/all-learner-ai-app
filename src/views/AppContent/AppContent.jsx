import React, { useEffect, Fragment, Suspense, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../views/Snackbar/CustomSnackbar";
import LoadingFallback from "../../components/LoadingFallback";
import { AudioDiagnosticModal } from "../../components/AudioDiagnostic";
import { getLocalData, setLocalData } from "../../utils/constants";

const PrivateRoute = (props) => {
  const TOKEN = localStorage.getItem("apiToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!TOKEN && props.requiresAuth) {
      navigate("/login");
    }
  }, [TOKEN, props.requiresAuth, navigate]);

  if (!TOKEN && props.requiresAuth) {
    return null;
  }

  return <>{props.children}</>;
};

const AppContent = ({ routes }) => {
  const [showDiagnostic, setShowDiagnostic] = useState(
    process.env.REACT_APP_IS_APP_IFRAME === "true" &&
      !!localStorage.getItem("apiToken") &&
      !getLocalData("audioDiagnosticShown")
  );

  return (
    <Fragment>
      <CustomizedSnackbars />
      {showDiagnostic ? (
        <AudioDiagnosticModal
          show={showDiagnostic}
          onClose={() => {
            setShowDiagnostic(false);
            setLocalData("audioDiagnosticShown", "true");
          }}
        />
      ) : (
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.id}
                path={route.path}
                element={
                  <PrivateRoute requiresAuth={route.requiresAuth}>
                    <route.component />
                  </PrivateRoute>
                }
              />
            ))}
          </Routes>
        </Suspense>
      )}
    </Fragment>
  );
};

export default AppContent;
