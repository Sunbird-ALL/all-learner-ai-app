import React, { useEffect, Fragment, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import CustomizedSnackbars from "../../views/Snackbar/CustomSnackbar";
import LoadingFallback from "../../components/LoadingFallback";
import { useSessionExpired } from "../../context/SessionExpiredProvider";

const PrivateRoute = (props) => {
  const TOKEN = localStorage.getItem("apiToken");
  const { notifyMissingToken } = useSessionExpired();

  useEffect(() => {
    if (!TOKEN && props.requiresAuth) {
      notifyMissingToken();
    }
  }, [TOKEN, props.requiresAuth, notifyMissingToken]);

  if (!TOKEN && props.requiresAuth) {
    return null;
  }

  return <>{props.children}</>;
};

const AppContent = ({ routes }) => {
  return (
    <Fragment>
      <CustomizedSnackbars />
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
    </Fragment>
  );
};

export default AppContent;
