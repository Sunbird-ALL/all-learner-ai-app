import React from "react";
import { Box } from "@mui/material";
import serverDowntimeImg from "../../assets/server-downtime.png";

const ServerErrorScreen = ({ onRetry }) => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      px: 3,
      textAlign: "center",
      background: "#ffffff",
    }}
  >
    <Box
      component="h2"
      sx={{
        margin: 0,
        fontSize: "24px",
        fontWeight: 600,
        color: "#1a1a2e",
        fontFamily: "Quicksand",
      }}
    >
      Couldn't connect right now
    </Box>
    <Box
      component="p"
      sx={{
        margin: 0,
        fontSize: "15px",
        color: "#6b7280",
        maxWidth: "400px",
        lineHeight: 1.6,
        fontFamily: "Quicksand",
      }}
    >
      Please check your internet connection and try again.
    </Box>
    <img
      src={serverDowntimeImg}
      alt="Server unreachable"
      style={{ width: "min(400px, 80vw)", margin: "8px 0" }}
    />
    <Box
      component="button"
      onClick={onRetry}
      sx={{
        background: "#3AB44A",
        color: "#fff",
        border: "none",
        borderRadius: "24px",
        padding: "12px 40px",
        fontSize: "15px",
        fontWeight: 700,
        fontFamily: "Quicksand",
        cursor: "pointer",
        "&:hover": { background: "#2e9e3c" },
      }}
    >
      Try Again
    </Box>
  </Box>
);

export default ServerErrorScreen;
