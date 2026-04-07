import React, { useRef, useEffect, useState, useCallback } from "react";

const NOCOOKIE_ORIGIN = "https://www.youtube-nocookie.com";

const SafeYouTubePlayer = ({ videoId, width = "100%", style = {} }) => {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sendCommand = useCallback((func, args = []) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args }),
      NOCOOKIE_ORIGIN
    );
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== NOCOOKIE_ORIGIN) return;
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (
          (data.event === "onStateChange" && data.info === 0) ||
          data.info?.playerState === 0
        ) {
          setEnded(true);
        }
      } catch {
        // non-JSON messages from YouTube — safe to ignore
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "listening", id: videoId }),
      NOCOOKIE_ORIGIN
    );
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: "addEventListener",
        args: ["onStateChange"],
      }),
      NOCOOKIE_ORIGIN
    );
  }, [videoId]);

  const handleReplay = useCallback(() => {
    setEnded(false);
    sendCommand("seekTo", [0, true]);
    sendCommand("playVideo");
  }, [sendCommand]);

  const toggleMute = useCallback(
    (e) => {
      e.stopPropagation();
      if (muted) {
        sendCommand("unMute");
        sendCommand("setVolume", [volume || 50]);
        setMuted(false);
        if (volume === 0) setVolume(50);
      } else {
        sendCommand("mute");
        setMuted(true);
      }
    },
    [muted, volume, sendCommand]
  );

  const handleVolumeChange = useCallback(
    (e) => {
      e.stopPropagation();
      const val = parseInt(e.target.value, 10);
      setVolume(val);
      sendCommand("setVolume", [val]);
      if (val === 0 && !muted) {
        sendCommand("mute");
        setMuted(true);
      } else if (val > 0 && muted) {
        sendCommand("unMute");
        setMuted(false);
      }
    },
    [muted, sendCommand]
  );

  const toggleFullscreen = useCallback((e) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }, []);

  const controlBtnStyle = {
    background: "rgba(0, 0, 0, 0.55)",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    fontSize: "16px",
    padding: 0,
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width,
        aspectRatio: "16 / 9",
        maxHeight: "80vh",
        overflow: "hidden",
        borderRadius: "8px",
        background: "#000",
      }}
    >
      <iframe
        ref={iframeRef}
        width="100%"
        height="100%"
        src={`${NOCOOKIE_ORIGIN}/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&controls=0&iv_load_policy=3&disablekb=0`}
        title="YouTube video player"
        allow="accelerometer; autoplay; encrypted-media; gyroscope"
        onLoad={handleIframeLoad}
        style={{ border: "none", display: "block", ...style }}
      />

      {/* Blocks the top title bar that links to YouTube */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50px",
          background: "linear-gradient(rgba(0,0,0,0.45), transparent)",
          zIndex: 5,
          pointerEvents: "auto",
        }}
      />

      {/* Custom controls: volume + fullscreen */}
      {!ended && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            padding: "10px 14px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 5,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button
              onClick={toggleMute}
              style={controlBtnStyle}
              title={muted ? "Unmute" : "Mute"}
            >
              {muted || volume === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="white" />
                  <line
                    x1="22"
                    y1="9"
                    x2="16"
                    y2="15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="16"
                    y1="9"
                    x2="22"
                    y2="15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : volume < 50 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="white" />
                  <path
                    d="M15.54 8.46a5 5 0 010 7.07"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="white" />
                  <path
                    d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              onClick={(e) => e.stopPropagation()}
              title={`Volume: ${muted ? 0 : volume}%`}
              style={{
                width: "80px",
                height: "4px",
                cursor: "pointer",
                accentColor: "#fff",
              }}
            />
          </div>

          <button
            onClick={toggleFullscreen}
            style={controlBtnStyle}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline
                  points="4 14 10 14 10 20"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <polyline
                  points="20 10 14 10 14 4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <line
                  x1="14"
                  y1="10"
                  x2="21"
                  y2="3"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="21"
                  x2="10"
                  y2="14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polyline
                  points="15 3 21 3 21 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <polyline
                  points="9 21 3 21 3 15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <line
                  x1="21"
                  y1="3"
                  x2="14"
                  y2="10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="21"
                  x2="10"
                  y2="14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* End-of-video overlay — blocks recommendations */}
      {ended && (
        <div
          onClick={handleReplay}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{ fontSize: "24px", marginLeft: "4px", color: "#333" }}
            >
              ▶
            </span>
          </div>
          <span
            style={{
              color: "#fff",
              marginTop: "12px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Replay Video
          </span>
        </div>
      )}
    </div>
  );
};

export default SafeYouTubePlayer;
