import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// A styled bulb indicator that changes color based on status.
const Bulb = styled(Box)(({ status }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor:
    status === "loading" ? "red" : status === "loaded" ? "green" : "#bbb",
  margin: "3px",
  transition: "background-color 0.5s ease",
  boxShadow: status === "loading" ? "0 0 10px red" : "none",
}));

const ModelLoaderIndicator = () => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(window.modelLoaded);

  // Listen for custom events.
  useEffect(() => {
    const handleLoading = () => {
      console.log("Event: loadingModel received");
      setLoading(true);
      setModelLoaded(false);
      setProgress(0);
    };

    const handleProgress = (e) => {
      console.log("Event: modelProgress received with progress:", e.detail.progress);
      setProgress(e.detail.progress);
    };

    const handleLoaded = () => {
      console.log("Event: modelLoaded received");
      setModelLoaded(true);
      setLoading(false);
    };

    window.addEventListener("loadingModel", handleLoading);
    window.addEventListener("modelProgress", handleProgress);
    window.addEventListener("modelLoaded", handleLoaded);

    return () => {
      window.removeEventListener("loadingModel", handleLoading);
      window.removeEventListener("modelProgress", handleProgress);
      window.removeEventListener("modelLoaded", handleLoaded);
    };
  }, []);

  // Determine current status for the bulb.
  const status = modelLoaded ? "loaded" : loading ? "loading" : "idle";

  return (
    <>
      {/* For testing, a button to simulate model load */}
      {/* <Button
        variant="contained"
        onClick={() => {
          // For testing, call the loadPackage with dummy metadata.
          // In your app, loadPackage will be called elsewhere.
          loadPackage({ remote_package_size: 1000 });
        }}
        sx={{ mb: 2 }}
      >
        Start Model Loading
      </Button> */}
      {!modelLoaded && loading && (
        <>
          <Bulb status={status} />
          <Typography variant="body1" color="error">
            Offline Model is loading... {progress}%
          </Typography>
          <Box
            sx={{
              height: "10px",
              backgroundColor: "#ddd",
              borderRadius: "5px",
              mt: 1,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#ff4d4d",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </>
      )}
      {modelLoaded && (
        <><Bulb status={status} />
        <Typography variant="body1" color="success.main">
          Offline Model Activated!
        </Typography></>
      )}
    </>
  );
};

export default ModelLoaderIndicator;
