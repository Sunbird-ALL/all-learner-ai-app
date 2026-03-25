import React, { useEffect, Fragment, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../views/Snackbar/CustomSnackbar";
import LoadingFallback from "../../components/LoadingFallback";

const PrivateRoute = (props) => {
  const TOKEN = localStorage.getItem("apiToken");

  const navigate = useNavigate();
  useEffect(() => {
    if (!TOKEN && props.requiresAuth) {
      navigate("/login");
    }
  }, [TOKEN]);

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
