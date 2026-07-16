import React, { useState, useEffect, useRef } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { ListenButton } from "../../utils/constants";
import * as Assets from "../../utils/imageAudioLinks";

const AudioTooltipModal = ({ audioSrc, description, children }) => {
  const [showModal, setShowModal] = useState(false);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const isTouchDevice = useMediaQuery("(any-pointer: coarse)");

  // Dismiss on click-outside for touch devices
  useEffect(() => {
    if (!isTouchDevice || !showModal) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isTouchDevice, showModal]);

  useEffect(() => {
    if (showModal && audioSrc) {
      const audio = new Audio(
        `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/multilingual_audios/${audioSrc}`
      );
      audioRef.current = audio;
      audio.onended = () => setShowModal(false);
      audio.play().catch((err) => console.log("Audio play error:", err));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [showModal, audioSrc]);

  const handleClick = (e) => {
    if (isTouchDevice) {
      e.stopPropagation();
      setShowModal((prev) => !prev);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-block",
        marginBottom: showModal ? "4.06rem" : "0px",
        transition: "margin-bottom 0.40s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => !isTouchDevice && setShowModal(true)}
      onMouseLeave={() => !isTouchDevice && setShowModal(false)}
      onClick={handleClick}
    >
      {children}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: showModal
            ? "translateX(-50%) translateY(0) scale(1)"
            : "translateX(-50%) translateY(4px) scale(0.97)",
          opacity: showModal ? 1 : 0,
          pointerEvents: showModal ? "auto" : "none",
          visibility: showModal ? "visible" : "hidden",
          transition:
            "opacity 0.40s cubic-bezier(0.16, 1, 0.3, 1), transform 0.40s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.40s",
          background: "#fff",
          border: "2px solid #2B72B9",
          borderRadius: "16px",
          boxShadow: "0px 4px 20px 2px rgba(43, 114, 185, 0.4)",
          animation: showModal
            ? "glow-pulsate 1.8s infinite ease-in-out"
            : "none",
          padding: "10px 0px",
          marginTop: "12px",
          zIndex: 1000,
          textAlign: "center",
          width: "180px",
          height: "50px",
        }}
      >
        <style>{`
          @keyframes soundwave-bounce { 0%,100%{transform:scaleY(0.25)} 50%{transform:scaleY(1)} }
          @keyframes glow-pulsate { 0%,100%{box-shadow:0px 4px 15px 1px rgba(43,114,185,0.4)} 50%{box-shadow:0px 6px 22px 4px rgba(43,114,185,0.7)} }
          @keyframes float-note-left { 0%{transform:translate(-35px,15px) scale(0.5);opacity:0} 30%{opacity:0.8} 100%{transform:translate(-55px,-15px) scale(1.1) rotate(-20deg);opacity:0} }
          @keyframes float-note-right { 0%{transform:translate(35px,15px) scale(0.5);opacity:0} 30%{opacity:0.8} 100%{transform:translate(55px,-15px) scale(1.1) rotate(20deg);opacity:0} }
        `}</style>
        {/* Speech bubble arrow */}
        {/* Speech bubble arrow */}
        <div
          style={{
            position: "absolute",
            top: "-8px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "14px",
            height: "14px",
            backgroundColor: "#fff",
            borderLeft: "2px solid #2B72B9",
            borderTop: "2px solid #2B72B9",
            zIndex: 999,
          }}
        />
        {/* Floating music notes */}
        {showModal && (
          <>
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "0px",
                fontSize: "14px",
                animation: "float-note-left 2s infinite ease-in-out",
                pointerEvents: "none",
              }}
            >
              🎵
            </span>
            <span
              style={{
                position: "absolute",
                right: "50%",
                top: "0px",
                fontSize: "14px",
                animation: "float-note-right 2.4s infinite ease-in-out",
                pointerEvents: "none",
              }}
            >
              🎶
            </span>
          </>
        )}
        {/* Soundwave bars */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "30px",
          }}
        >
          {[
            ["12px", "0.1s", "0.6s"],
            ["18px", "0.3s", "0.8s"],
            ["24px", "0.0s", "0.5s"],
            ["30px", "0.4s", "0.7s"],
            ["26px", "0.2s", "0.65s"],
            ["34px", "0.5s", "0.9s"],
            ["32px", "0.15s", "0.75s"],
            ["22px", "0.35s", "0.85s"],
            ["28px", "0.05s", "0.55s"],
            ["18px", "0.45s", "0.7s"],
            ["14px", "0.25s", "0.6s"],
            ["10px", "0.55s", "0.8s"],
          ].map(([h, d, du], i) => (
            <span
              key={i}
              style={{
                width: "3px",
                height: h,
                background: "linear-gradient(180deg,#71AEEA,#2B72B9)",
                borderRadius: "3px",
                display: "inline-block",
                margin: "0 2px",
                transformOrigin: "center",
                animation: showModal
                  ? `soundwave-bounce ${du} ease-in-out infinite alternate`
                  : "none",
                animationDelay: d,
              }}
            />
          ))}
        </Box>
      </div>
    </div>
  );
};

export default AudioTooltipModal;
