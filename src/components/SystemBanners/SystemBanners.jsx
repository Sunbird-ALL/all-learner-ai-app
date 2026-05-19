import React, { useEffect, useState } from "react";
import { Alert, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DOWNTIME_START = parseInt(
  process.env.REACT_APP_DOWNTIME_START_HOUR ?? "20",
  10
);
const DOWNTIME_END = parseInt(
  process.env.REACT_APP_DOWNTIME_END_HOUR ?? "8",
  10
);
const MIN_WIDTH = parseInt(
  process.env.REACT_APP_MIN_SCREEN_WIDTH ?? "1600",
  10
);
const MIN_HEIGHT = parseInt(
  process.env.REACT_APP_MIN_SCREEN_HEIGHT ?? "810",
  10
);
// 10% tolerance: ignores minor pixel differences from OS taskbar/browser chrome.
// Only triggers when the user has zoomed in enough to meaningfully crop the UI.
const ZOOM_THRESHOLD = Math.round(MIN_WIDTH * 0.9);

function getISTHour() {
  const istDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  return istDate.getHours();
}

function isDowntime() {
  const hour = getISTHour();
  if (DOWNTIME_START > DOWNTIME_END) {
    // e.g. 20 → 8: wraps midnight
    return hour >= DOWNTIME_START || hour < DOWNTIME_END;
  }
  // e.g. 2 → 6: same-day window
  return hour >= DOWNTIME_START && hour < DOWNTIME_END;
}

// Detects phones and tablets via user agent — screen.width alone is unreliable
// because some tablets report > 1024 CSS px, and some small laptops report < 768.
function detectMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

const IS_MOBILE = detectMobile();

const SystemBanners = () => {
  const [downtimeDismissed, setDowntimeDismissed] = useState(false);
  const [showDowntime, setShowDowntime] = useState(isDowntime);

  const [mobileDismissed, setMobileDismissed] = useState(false);

  // window.innerWidth reflects the true usable space — it shrinks when the user zooms
  // in OR when the physical screen is small. Both cases have the same fix: zoom out.
  // We only check width; height would false-trigger because browser chrome (tabs,
  // address bar) consumes ~130–150 px even on a fully maximised window.
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [viewportDismissed, setViewportDismissed] = useState(false);

  const showMobileBanner = IS_MOBILE && !mobileDismissed;
  // Covers both "small screen" and "zoomed in" — solution is the same: zoom out.
  const showViewportWarning =
    !IS_MOBILE && !viewportDismissed && viewportWidth < ZOOM_THRESHOLD;

  // Re-check downtime every minute
  useEffect(() => {
    const id = setInterval(() => setShowDowntime(isDowntime()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Track viewport width changes: zoom in/out, window resize, monitor change
  useEffect(() => {
    if (IS_MOBILE) return;
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (
    (!showDowntime || downtimeDismissed) &&
    !showMobileBanner &&
    !showViewportWarning
  )
    return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1400,
      }}
    >
      {showDowntime && !downtimeDismissed && (
        <Alert
          severity="warning"
          icon={false}
          sx={{ borderRadius: 0, justifyContent: "center", fontWeight: 500 }}
          action={
            <IconButton
              size="small"
              aria-label="close downtime banner"
              onClick={() => setDowntimeDismissed(true)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          The server is offline from {DOWNTIME_START}:00 – {DOWNTIME_END}:00 IST
          for scheduled maintenance. Please come back after {DOWNTIME_END}
          :00.
        </Alert>
      )}

      {showMobileBanner && (
        <Alert
          severity="error"
          icon={false}
          sx={{ borderRadius: 0, justifyContent: "center", fontWeight: 500 }}
          action={
            <IconButton
              size="small"
              aria-label="close mobile banner"
              onClick={() => setMobileDismissed(true)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          This app is designed for desktop use. Please open it on a laptop or
          desktop computer with a screen of at least {MIN_WIDTH}×{MIN_HEIGHT}.
        </Alert>
      )}

      {showViewportWarning && (
        <Alert
          severity="info"
          icon={false}
          sx={{ borderRadius: 0, justifyContent: "center", fontWeight: 500 }}
          action={
            <IconButton
              size="small"
              aria-label="close viewport banner"
              onClick={() => setViewportDismissed(true)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          The UI may be cropped. Please zoom out your browser (
          <strong>Ctrl&nbsp;−</strong> on Windows / <strong>Cmd&nbsp;−</strong>{" "}
          on Mac) or maximise the window.
        </Alert>
      )}
    </Box>
  );
};

export default SystemBanners;
