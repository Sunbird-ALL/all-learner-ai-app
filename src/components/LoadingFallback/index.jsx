import React from "react";

/**
 * Lightweight route-level loading fallback for React.lazy() Suspense boundaries.
 * Intentionally uses no external dependencies so it renders immediately.
 */
const LoadingFallback = () => (
  <div
    data-testid="loading-wrapper"
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#fafafa",
    }}
  >
    <div
      data-testid="loading-spinner"
      style={{
        width: "48px",
        height: "48px",
        border: "4px solid #e0e0e0",
        borderTop: "4px solid #5C52D5",
        borderRadius: "50%",
        animation: "allSpin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes allSpin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingFallback;
