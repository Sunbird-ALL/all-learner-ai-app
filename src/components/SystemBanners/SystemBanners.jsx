import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import serverDowntimeImg from "../../assets/server-downtime.png";

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

// Edge and Opera both include "Chrome/" in their UA, so exclude them explicitly.
function detectChrome() {
  const ua = navigator.userAgent;
  return (
    /Chrome\//.test(ua) &&
    !/Edg\//.test(ua) && // Microsoft Edge
    !/OPR\//.test(ua) // Opera
  );
}

const IS_MOBILE = detectMobile();
const IS_CHROME = detectChrome();

// --- Icons ---

const ChromeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="12" fill="#fff" />
    <path
      d="M12 4a8 8 0 0 1 6.928 4H12a4 4 0 0 0-3.464 6l-3.464 6A12 12 0 0 1 12 0a12 12 0 0 1 6.928 4Z"
      fill="#EA4335"
    />
    <path
      d="M4.072 14A12 12 0 0 0 12 24a12 12 0 0 0 10.392-6l-3.464-6A4 4 0 0 1 12 16a4 4 0 0 1-3.464-2Z"
      fill="#34A853"
    />
    <path d="M8 12a4 4 0 0 1 4-4h6.928A8 8 0 0 1 4 12Z" fill="#FBBC05" />
    <circle cx="12" cy="12" r="4" fill="#4285F4" />
  </svg>
);

const MonitorIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#92400E"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const MobileIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#92400E"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <circle cx="12" cy="18" r="1" fill="#92400E" stroke="none" />
  </svg>
);

// --- Shared card style (Figma tokens) ---
const CARD_SX = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "16px 20px",
  background: "#FFF8E0",
  border: "0.8px solid #FBBC05",
  borderRadius: "16px",
  fontSize: "14px",
  lineHeight: 1.5,
  color: "#1A1A1A",
  width: "100%",
  boxSizing: "border-box",
};

// Wraps each banner with slide-down entry and slide-up exit animations.
// onDismiss is called after the exit animation completes.
const BannerWrapper = ({ children, onDismiss }) => {
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onDismiss, 220);
  };

  return (
    <Box
      sx={{
        animation: exiting
          ? "bannerExit 0.22s ease forwards"
          : "bannerEnter 0.25s ease",
        "@keyframes bannerEnter": {
          from: { opacity: 0, transform: "translateY(-10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes bannerExit": {
          from: { opacity: 1, transform: "translateY(0)" },
          to: { opacity: 0, transform: "translateY(-10px)" },
        },
      }}
    >
      {children(handleClose)}
    </Box>
  );
};

const CloseButton = ({ onClick }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      marginLeft: "auto",
      flexShrink: 0,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "2px",
      display: "flex",
      alignItems: "center",
      color: "#92400E",
      opacity: 0.6,
      "&:hover": { opacity: 1 },
    }}
    aria-label="Close"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  </Box>
);

const SystemBanners = () => {
  const [showDowntime, setShowDowntime] = useState(isDowntime);
  const [browserDismissed, setBrowserDismissed] = useState(false);
  const [mobileDismissed, setMobileDismissed] = useState(false);
  const [viewportDismissed, setViewportDismissed] = useState(false);

  const showBrowserWarning = !IS_CHROME && !browserDismissed;

  // window.innerWidth reflects the true usable space — it shrinks when the user zooms
  // in OR when the physical screen is small. Both cases have the same fix: zoom out.
  // We only check width; height would false-trigger because browser chrome (tabs,
  // address bar) consumes ~130–150 px even on a fully maximised window.
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

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
    const handleResize = () =>
      requestAnimationFrame(() => setViewportWidth(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Full-page downtime screen takes priority — renders instead of (not alongside) other banners
  if (showDowntime) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <Box
          component="h2"
          sx={{
            margin: 0,
            fontSize: "24px",
            fontWeight: 600,
            color: "#1a1a2e",
          }}
        >
          Available during school hours
        </Box>
        <Box
          component="p"
          sx={{
            margin: 0,
            fontSize: "15px",
            color: "#6b7280",
            maxWidth: "400px",
            lineHeight: 1.6,
          }}
        >
          This system is up and running when schools are operational (
          {DOWNTIME_END}:00 AM – {DOWNTIME_START}:00 PM IST). Please come back
          during school hours.
        </Box>
        <img
          src={serverDowntimeImg}
          alt="Server resting"
          style={{ width: "min(400px, 80vw)", margin: "8px 0" }}
        />
        <Box
          component="button"
          onClick={() => window.location.reload()}
          sx={{
            background: "#3AB44A",
            color: "#fff",
            border: "none",
            borderRadius: "24px",
            padding: "12px 40px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": { background: "#2e9e3c" },
          }}
        >
          Try Again
        </Box>
      </Box>
    );
  }

  const hasAny = showBrowserWarning || showMobileBanner || showViewportWarning;
  if (!hasAny) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(884px, calc(100vw - 32px))",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {showBrowserWarning && (
        <BannerWrapper onDismiss={() => setBrowserDismissed(true)}>
          {(handleClose) => (
            <Box sx={CARD_SX}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexWrap: "wrap",
                }}
              >
                This app is supported on&nbsp;
                <ChromeIcon />
                &nbsp;<strong>Google Chrome</strong> only. Please switch your
                browser for the best experience.
              </span>
              <CloseButton onClick={handleClose} />
            </Box>
          )}
        </BannerWrapper>
      )}

      {showMobileBanner && (
        <BannerWrapper onDismiss={() => setMobileDismissed(true)}>
          {(handleClose) => (
            <Box sx={CARD_SX}>
              <MobileIcon />
              <span>
                This app is designed for desktop use. Please open it on a laptop
                or desktop with a screen of at least{" "}
                <strong>
                  {MIN_WIDTH}×{MIN_HEIGHT}
                </strong>
                .
              </span>
              <CloseButton onClick={handleClose} />
            </Box>
          )}
        </BannerWrapper>
      )}

      {showViewportWarning && (
        <BannerWrapper onDismiss={() => setViewportDismissed(true)}>
          {(handleClose) => (
            <Box sx={CARD_SX}>
              <MonitorIcon />
              <span>
                The UI may be cropped. <strong>Zoom Out</strong> (
                <strong>Ctrl&nbsp;−</strong> Windows /{" "}
                <strong>Cmd&nbsp;−</strong> Mac) or <strong>Maximise</strong>{" "}
                the window.
              </span>
              <CloseButton onClick={handleClose} />
            </Box>
          )}
        </BannerWrapper>
      )}
    </Box>
  );
};

export default SystemBanners;
