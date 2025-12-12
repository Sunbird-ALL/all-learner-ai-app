import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  LinearProgress,
  Fade,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import MicIcon from "@mui/icons-material/Mic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ProfileHeader } from "../../components/Assesment/Assesment";
import { getLocalData } from "../../utils/constants";
import desktopLevel1 from "../../assets/images/desktopLevel1.png";
import desktopLevel1Mobile from "../../assets/images/mobilebglevel1.png";
import textureImage from "../../assets/images/textureImage.png";
import panda from "../../assets/images/panda.svg";
import { impression, interact, Log } from "../../services/telementryService";
import "./AudioDiagnosticPage.css";

const AudioDiagnosticPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [micStatus, setMicStatus] = useState("pending");
  const [speakerStatus, setSpeakerStatus] = useState("pending");
  const [micError, setMicError] = useState("");
  const [speakerError, setSpeakerError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [testMessage, setTestMessage] = useState("");
  const [lang, setLang] = useState(getLocalData("lang") || "en");

  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const testAudioRef = useRef(null);
  const playbackAudioRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const speakerTestPassedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const audioDetectedRef = useRef(false);
  const audioLevelsRef = useRef([]);
  const micTestStartTimeRef = useRef(null);
  const speakerTestStartTimeRef = useRef(null);

  useEffect(() => {
    // Impression event when diagnostic page is displayed
    impression("audio-diagnostic", "ET");

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isRecording && analyserRef.current) {
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          // Use getByteTimeDomainData for more accurate audio level detection
          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount
          );
          analyserRef.current.getByteTimeDomainData(dataArray);

          // Calculate RMS (Root Mean Square) for audio level
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
          }
          const rms = Math.sqrt(sum / dataArray.length);

          // Store audio level for analysis
          audioLevelsRef.current.push(rms);

          // Keep only last 50 samples (about 1 second at 50fps)
          if (audioLevelsRef.current.length > 50) {
            audioLevelsRef.current.shift();
          }

          // Check if audio is detected (threshold: 0.01 for actual sound, not just noise)
          const SILENCE_THRESHOLD = 0.01;
          if (rms > SILENCE_THRESHOLD) {
            audioDetectedRef.current = true;
          }

          // For visualization, use a normalized value
          setAudioLevel(Math.min(rms * 10, 1));
        }
        if (isRecording) {
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();
    } else {
      setAudioLevel(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

  const cleanup = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      testAudioRef.current = null;
    }
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current = null;
    }
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const testMicrophone = async () => {
    setMicStatus("testing");
    setMicError("");
    setRecordingProgress(0);
    recordedChunksRef.current = [];
    audioDetectedRef.current = false;
    audioLevelsRef.current = [];
    micTestStartTimeRef.current = Date.now();

    // Interact event for button click
    interact("ET", "Test Microphone", "audio-diagnostic");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        throw new Error("Audio recording is not supported in this browser");
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Analyze the recorded audio to check if actual sound was detected
        const hasAudioData = recordedChunksRef.current.length > 0;
        const blob = hasAudioData
          ? new Blob(recordedChunksRef.current, { type: "audio/webm" })
          : null;

        // Check multiple conditions:
        // 1. Audio data was recorded
        // 2. Audio was actually detected (not just silence)
        // 3. Average audio level was above threshold
        const averageLevel =
          audioLevelsRef.current.length > 0
            ? audioLevelsRef.current.reduce((a, b) => a + b, 0) /
              audioLevelsRef.current.length
            : 0;

        const SILENCE_THRESHOLD = 0.01;
        const hasActualAudio =
          audioDetectedRef.current && averageLevel > SILENCE_THRESHOLD;

        setIsRecording(false);
        setRecordingProgress(0);

        const testDuration = micTestStartTimeRef.current
          ? ((Date.now() - micTestStartTimeRef.current) / 1000).toFixed(2)
          : 0;

        if (hasAudioData && blob && blob.size > 0 && hasActualAudio) {
          // Create audio URL for playback
          const audioUrl = URL.createObjectURL(blob);
          setRecordedAudioUrl(audioUrl);

          // Set fun message
          setTestMessage("Great! Now listen to your recording...");

          // Log test result - recording successful, waiting for playback
          Log(
            `Microphone test - Recording successful. Duration: ${testDuration}s, Audio detected: true, Average level: ${averageLevel.toFixed(
              4
            )}, Blob size: ${blob.size} bytes`,
            "audio-diagnostic",
            "ET"
          );

          // Automatically play back the recorded audio
          setTimeout(() => {
            playRecordedAudio(audioUrl);
          }, 500);
        } else if (!hasAudioData || !blob || blob.size === 0) {
          setMicStatus("failed");
          setMicError(
            "No audio data was recorded. Please check your microphone connection."
          );
          // Log test result - failed
          Log(
            `Microphone test - FAILED. Duration: ${testDuration}s, Reason: No audio data recorded`,
            "audio-diagnostic",
            "ET"
          );
          audioContext.close();
        } else if (!hasActualAudio) {
          setMicStatus("failed");
          setMicError(
            "Microphone is muted or not detecting sound. Please unmute your microphone and speak into it."
          );
          // Log test result - failed (muted)
          Log(
            `Microphone test - FAILED. Duration: ${testDuration}s, Reason: Microphone muted or no sound detected, Average level: ${averageLevel.toFixed(
              4
            )}`,
            "audio-diagnostic",
            "ET"
          );
          audioContext.close();
        } else {
          setMicStatus("failed");
          setMicError(
            "Microphone test failed. Please check your microphone settings."
          );
          // Log test result - failed (unknown)
          Log(
            `Microphone test - FAILED. Duration: ${testDuration}s, Reason: Unknown error`,
            "audio-diagnostic",
            "ET"
          );
          audioContext.close();
        }
      };

      mediaRecorder.onerror = (event) => {
        setMicStatus("failed");
        setMicError("Recording error occurred");
        setIsRecording(false);
        setRecordingProgress(0);
        audioContext.close();
      };

      setIsRecording(true);
      mediaRecorder.start(100);

      let progress = 0;
      recordingTimerRef.current = setInterval(() => {
        progress += 33.33;
        setRecordingProgress(Math.min(progress, 100));
      }, 1000);

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      }, 3000);
    } catch (error) {
      setMicStatus("failed");
      setMicError(
        error.message ||
          "Failed to access microphone. Please check permissions."
      );
      setIsRecording(false);
      setRecordingProgress(0);
    }
  };

  const testSpeaker = async () => {
    setSpeakerStatus("testing");
    setSpeakerError("");
    setIsPlaying(true);
    speakerTestPassedRef.current = false;
    speakerTestStartTimeRef.current = Date.now();

    // Interact event for button click
    interact("ET", "Test Speaker", "audio-diagnostic");

    try {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = 440;
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 1);

      oscillator.onended = () => {
        if (!speakerTestPassedRef.current) {
          speakerTestPassedRef.current = true;
          setSpeakerStatus("passed");

          const testDuration = speakerTestStartTimeRef.current
            ? ((Date.now() - speakerTestStartTimeRef.current) / 1000).toFixed(2)
            : 0;

          // Log test result - passed
          Log(
            `Speaker test - PASSED. Duration: ${testDuration}s, Method: Web Audio API`,
            "audio-diagnostic",
            "ET"
          );
        }
        setIsPlaying(false);
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      };

      oscillator.onerror = () => {
        if (!speakerTestPassedRef.current) {
          tryHTML5AudioTest();
        }
      };

      setTimeout(() => {
        if (!speakerTestPassedRef.current) {
          tryHTML5AudioTest();
        }
      }, 1200);
    } catch (error) {
      tryHTML5AudioTest();
    }
  };

  const tryHTML5AudioTest = () => {
    try {
      const testAudio = new Audio();
      testAudioRef.current = testAudio;

      const audioData = generateBeepSound();
      testAudio.src = audioData;
      testAudio.volume = 0.5;

      testAudio.oncanplaythrough = () => {
        testAudio.play().catch((err) => {
          console.error("Audio play error:", err);
          if (!speakerTestPassedRef.current) {
            setSpeakerStatus("failed");
            setSpeakerError("Failed to play test audio");
            setIsPlaying(false);
          }
        });
      };

      testAudio.onended = () => {
        if (!speakerTestPassedRef.current) {
          speakerTestPassedRef.current = true;
          setSpeakerStatus("passed");

          const testDuration = speakerTestStartTimeRef.current
            ? ((Date.now() - speakerTestStartTimeRef.current) / 1000).toFixed(2)
            : 0;

          // Log test result - passed (HTML5 fallback)
          Log(
            `Speaker test - PASSED. Duration: ${testDuration}s, Method: HTML5 Audio`,
            "audio-diagnostic",
            "ET"
          );
        }
        setIsPlaying(false);
      };

      testAudio.onerror = () => {
        if (!speakerTestPassedRef.current) {
          setSpeakerStatus("failed");
          setSpeakerError("Audio playback failed");

          const testDuration = speakerTestStartTimeRef.current
            ? ((Date.now() - speakerTestStartTimeRef.current) / 1000).toFixed(2)
            : 0;

          // Log test result - failed
          Log(
            `Speaker test - FAILED. Duration: ${testDuration}s, Reason: Audio playback error`,
            "audio-diagnostic",
            "ET"
          );

          setIsPlaying(false);
        }
      };
    } catch (error) {
      if (!speakerTestPassedRef.current) {
        setSpeakerStatus("failed");
        setSpeakerError(error.message || "Failed to test speaker");

        const testDuration = speakerTestStartTimeRef.current
          ? ((Date.now() - speakerTestStartTimeRef.current) / 1000).toFixed(2)
          : 0;

        // Log test result - failed
        Log(
          `Speaker test - FAILED. Duration: ${testDuration}s, Reason: ${
            error.message || "Unknown error"
          }`,
          "audio-diagnostic",
          "ET"
        );

        setIsPlaying(false);
      }
    }
  };

  const playRecordedAudio = (audioUrl) => {
    if (!audioUrl) return;

    setIsPlayingBack(true);
    setTestMessage("🎵 Playing your recording... Listen carefully!");

    // Clean up any existing playback
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current = null;
    }

    const audio = new Audio(audioUrl);
    playbackAudioRef.current = audio;

    audio.onended = () => {
      setIsPlayingBack(false);
      setTestMessage("🎉 Perfect! Your microphone is working great!");

      const totalTestDuration = micTestStartTimeRef.current
        ? ((Date.now() - micTestStartTimeRef.current) / 1000).toFixed(2)
        : 0;

      // Log test result - passed (after playback)
      Log(
        `Microphone test - PASSED. Total duration: ${totalTestDuration}s, Playback: successful`,
        "audio-diagnostic",
        "ET"
      );

      // Mark microphone test as passed after successful playback
      setTimeout(() => {
        setMicStatus("passed");
        setTestMessage("");
      }, 1000);
    };

    audio.onerror = () => {
      setIsPlayingBack(false);
      setMicStatus("failed");
      setMicError("Failed to play back recording. Please try again.");
      setTestMessage("");

      const totalTestDuration = micTestStartTimeRef.current
        ? ((Date.now() - micTestStartTimeRef.current) / 1000).toFixed(2)
        : 0;

      // Log test result - failed (playback error)
      Log(
        `Microphone test - FAILED. Total duration: ${totalTestDuration}s, Reason: Playback failed`,
        "audio-diagnostic",
        "ET"
      );
    };

    audio.play().catch((err) => {
      console.error("Playback error:", err);
      setIsPlayingBack(false);
      setMicStatus("failed");
      setMicError("Failed to play back recording. Please check your speaker.");
      setTestMessage("");

      const totalTestDuration = micTestStartTimeRef.current
        ? ((Date.now() - micTestStartTimeRef.current) / 1000).toFixed(2)
        : 0;

      // Log test result - failed (playback error)
      Log(
        `Microphone test - FAILED. Total duration: ${totalTestDuration}s, Reason: Playback error - ${
          err.message || "Unknown"
        }`,
        "audio-diagnostic",
        "ET"
      );
    });
  };

  const generateBeepSound = () => {
    const sampleRate = 44100;
    const duration = 0.5;
    const frequency = 440;
    const samples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);

    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, samples * 2, true);

    for (let i = 0; i < samples; i++) {
      const sample = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
      view.setInt16(44 + i * 2, sample * 0x7fff, true);
    }

    const blob = new Blob([buffer], { type: "audio/wav" });
    return URL.createObjectURL(blob);
  };

  const handleStartTests = () => {
    // Interact event for button click
    interact("ET", "Start All Tests", "audio-diagnostic");

    testMicrophone();
    setTimeout(() => {
      testSpeaker();
    }, 500);
  };

  const handleContinue = () => {
    // Interact event for button click
    interact("ET", "Continue to Application", "audio-diagnostic");

    cleanup();
    navigate("/discover-start");
  };

  const handleRetry = () => {
    // Interact event for button click
    interact("ET", "Retry Tests", "audio-diagnostic");

    setMicStatus("pending");
    setSpeakerStatus("pending");
    setMicError("");
    setSpeakerError("");
    setRecordingProgress(0);
    setAudioLevel(0);
    setIsPlayingBack(false);
    setTestMessage("");
    audioDetectedRef.current = false;
    audioLevelsRef.current = [];
    micTestStartTimeRef.current = null;
    speakerTestStartTimeRef.current = null;
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl(null);
    cleanup();
  };

  const allTestsPassed = micStatus === "passed" && speakerStatus === "passed";
  const allTestsCompleted =
    (micStatus === "passed" || micStatus === "failed") &&
    (speakerStatus === "passed" || speakerStatus === "failed");

  const getStatusIcon = (status, type) => {
    const iconSize = isMobile ? 50 : 70;

    // Show playback state for microphone
    if (type === "mic" && isPlayingBack) {
      return (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={iconSize}
            thickness={4}
            sx={{ color: "#ff9800" }}
          />
          <Box
            sx={{
              position: "absolute",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            <VolumeUpIcon sx={{ fontSize: iconSize * 0.5, color: "#ff9800" }} />
          </Box>
        </Box>
      );
    }

    switch (status) {
      case "passed":
        return (
          <CheckCircleIcon
            sx={{
              fontSize: iconSize,
              color: "#4caf50",
              filter: "drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))",
            }}
          />
        );
      case "failed":
        return (
          <ErrorIcon
            sx={{
              fontSize: iconSize,
              color: "#f44336",
              filter: "drop-shadow(0 4px 8px rgba(244, 67, 54, 0.3))",
            }}
          />
        );
      case "testing":
        return (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              size={iconSize}
              thickness={4}
              sx={{ color: "#6DAF19" }}
            />
            {(type === "mic" && isRecording) ||
            (type === "speaker" && isPlaying) ? (
              <Box
                sx={{
                  position: "absolute",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              >
                {type === "mic" ? (
                  <MicIcon
                    sx={{ fontSize: iconSize * 0.5, color: "#6DAF19" }}
                  />
                ) : (
                  <VolumeUpIcon
                    sx={{ fontSize: iconSize * 0.5, color: "#6DAF19" }}
                  />
                )}
              </Box>
            ) : null}
          </Box>
        );
      default:
        return type === "mic" ? (
          <MicIcon
            sx={{ fontSize: iconSize, color: "#9e9e9e", opacity: 0.5 }}
          />
        ) : (
          <VolumeUpIcon
            sx={{ fontSize: iconSize, color: "#9e9e9e", opacity: 0.5 }}
          />
        );
    }
  };

  const backgroundImage = isMobile ? desktopLevel1Mobile : desktopLevel1;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "auto",
      }}
    >
      <ProfileHeader
        level={1}
        lang={lang}
        setOpenLangModal={() => {}}
        profileName={getLocalData("profileName")}
        points={0}
        vocabCount={0}
        wordCount={0}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 65px)",
          padding: { xs: "20px", sm: "40px" },
          mt: { xs: "75px", sm: "65px" },
        }}
      >
        <Card
          sx={{
            width: { xs: "100%", sm: "90%", md: "800px" },
            maxWidth: "900px",
            borderRadius: "20px",
            backgroundImage: `url(${textureImage})`,
            backgroundRepeat: "round",
            backgroundSize: "contain",
            boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(25px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 10,
              bottom: 0,
              pointerEvents: "none",
              opacity: 0.3,
            }}
          >
            <img
              src={panda}
              alt="panda"
              style={{ width: isMobile ? "80px" : "120px" }}
            />
          </Box>

          <CardContent
            sx={{ p: { xs: 3, sm: 4, md: 5 }, position: "relative", zIndex: 1 }}
          >
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand",
                  fontWeight: 700,
                  fontSize: { xs: "28px", sm: "36px", md: "42px" },
                  color: "#000000",
                  mb: 1,
                }}
              >
                Audio Device Diagnostic
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Lato",
                  fontSize: { xs: "14px", sm: "16px" },
                  color: "#666666",
                }}
              >
                Test your microphone and speaker to ensure optimal learning
                experience
              </Typography>
            </Box>

            {/* Test Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Microphone Test */}
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "16px",
                    border: `2px solid ${
                      micStatus === "passed"
                        ? "#4caf50"
                        : micStatus === "failed"
                        ? "#f44336"
                        : micStatus === "testing"
                        ? "#6DAF19"
                        : "#e0e0e0"
                    }`,
                    background: micStatus === "passed" ? "#f1f8f4" : "#ffffff",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "50px", sm: "60px" },
                          height: { xs: "50px", sm: "60px" },
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(109, 175, 25, 0.3)",
                        }}
                      >
                        <MicIcon
                          sx={{
                            fontSize: { xs: "28px", sm: "32px" },
                            color: "white",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Quicksand",
                          fontWeight: 600,
                          fontSize: { xs: "18px", sm: "20px" },
                        }}
                      >
                        Microphone
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "120px",
                        mb: 2,
                      }}
                    >
                      {getStatusIcon(micStatus, "mic")}
                    </Box>

                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Lato",
                          fontWeight: 600,
                          color:
                            micStatus === "passed"
                              ? "#4caf50"
                              : micStatus === "failed"
                              ? "#f44336"
                              : micStatus === "testing" || isPlayingBack
                              ? "#6DAF19"
                              : "#9e9e9e",
                        }}
                      >
                        {isPlayingBack
                          ? "Playing Back..."
                          : micStatus === "passed"
                          ? "Working"
                          : micStatus === "failed"
                          ? "Not Working"
                          : micStatus === "testing"
                          ? "Recording..."
                          : "Not Tested"}
                      </Typography>
                    </Box>

                    {isRecording && (
                      <Fade in={isRecording}>
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            background:
                              "linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)",
                            borderRadius: "12px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Lato",
                              color: "#6DAF19",
                              fontWeight: 500,
                              textAlign: "center",
                              mb: 1,
                            }}
                          >
                            🎤 Recording... Say something fun!
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={recordingProgress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "rgba(109, 175, 25, 0.1)",
                              "& .MuiLinearProgress-bar": {
                                background:
                                  "linear-gradient(90deg, #6DAF19, #4caf50)",
                                borderRadius: 4,
                              },
                            }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              gap: "4px",
                              height: "50px",
                              mt: 2,
                            }}
                          >
                            {[...Array(20)].map((_, i) => (
                              <Box
                                key={i}
                                sx={{
                                  width: "4px",
                                  height: `${Math.max(
                                    10,
                                    audioLevel *
                                      100 *
                                      (0.5 + Math.random() * 0.5)
                                  )}%`,
                                  background:
                                    "linear-gradient(180deg, #6DAF19, #4caf50)",
                                  borderRadius: "2px",
                                  transition: "height 0.1s",
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Fade>
                    )}

                    {isPlayingBack && (
                      <Fade in={isPlayingBack}>
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            background:
                              "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                            borderRadius: "12px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Lato",
                              color: "#f57c00",
                              fontWeight: 500,
                              textAlign: "center",
                              mb: 2,
                              fontSize: "16px",
                            }}
                          >
                            {testMessage ||
                              "🎵 Playing your recording... Listen carefully!"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              height: "50px",
                            }}
                          >
                            {[...Array(5)].map((_, i) => (
                              <Box
                                key={i}
                                sx={{
                                  width: "6px",
                                  height: "100%",
                                  background:
                                    "linear-gradient(180deg, #ff9800, #ff5722)",
                                  borderRadius: "3px",
                                  animation:
                                    "soundWave 1.2s ease-in-out infinite",
                                  animationDelay: `${i * 0.2}s`,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Fade>
                    )}

                    {testMessage && !isRecording && !isPlayingBack && (
                      <Fade in={!!testMessage}>
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            background:
                              "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                            borderRadius: "12px",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Lato",
                              color: "#4caf50",
                              fontWeight: 600,
                              fontSize: "16px",
                            }}
                          >
                            {testMessage}
                          </Typography>
                        </Box>
                      </Fade>
                    )}

                    {micError && (
                      <Alert
                        severity="error"
                        sx={{ mt: 2, borderRadius: "12px" }}
                      >
                        {micError}
                      </Alert>
                    )}

                    {micStatus === "pending" &&
                      !isRecording &&
                      !isPlayingBack && (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={testMicrophone}
                          startIcon={<PlayArrowIcon />}
                          sx={{
                            mt: 2,
                            background: "#6DAF19",
                            color: "white",
                            fontFamily: "Lato",
                            fontWeight: 600,
                            borderRadius: "10px",
                            padding: "12px 24px",
                            textTransform: "none",
                            "&:hover": {
                              background: "#5a9a15",
                            },
                          }}
                        >
                          Test Microphone
                        </Button>
                      )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Speaker Test */}
              <Grid item xs={12} md={6}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "16px",
                    border: `2px solid ${
                      speakerStatus === "passed"
                        ? "#4caf50"
                        : speakerStatus === "failed"
                        ? "#f44336"
                        : speakerStatus === "testing"
                        ? "#6DAF19"
                        : "#e0e0e0"
                    }`,
                    background:
                      speakerStatus === "passed" ? "#f1f8f4" : "#ffffff",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "50px", sm: "60px" },
                          height: { xs: "50px", sm: "60px" },
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(109, 175, 25, 0.3)",
                        }}
                      >
                        <VolumeUpIcon
                          sx={{
                            fontSize: { xs: "28px", sm: "32px" },
                            color: "white",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Quicksand",
                          fontWeight: 600,
                          fontSize: { xs: "18px", sm: "20px" },
                        }}
                      >
                        Speaker
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "120px",
                        mb: 2,
                      }}
                    >
                      {getStatusIcon(speakerStatus, "speaker")}
                    </Box>

                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Lato",
                          fontWeight: 600,
                          color:
                            speakerStatus === "passed"
                              ? "#4caf50"
                              : speakerStatus === "failed"
                              ? "#f44336"
                              : speakerStatus === "testing"
                              ? "#6DAF19"
                              : "#9e9e9e",
                        }}
                      >
                        {speakerStatus === "passed"
                          ? "Working"
                          : speakerStatus === "failed"
                          ? "Not Working"
                          : speakerStatus === "testing"
                          ? "Testing..."
                          : "Not Tested"}
                      </Typography>
                    </Box>

                    {isPlaying && (
                      <Fade in={isPlaying}>
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            background:
                              "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                            borderRadius: "12px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "Lato",
                              color: "#f57c00",
                              fontWeight: 500,
                              textAlign: "center",
                              mb: 2,
                            }}
                          >
                            Playing test sound...
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              height: "40px",
                            }}
                          >
                            {[...Array(5)].map((_, i) => (
                              <Box
                                key={i}
                                sx={{
                                  width: "4px",
                                  height: "100%",
                                  background:
                                    "linear-gradient(180deg, #ff9800, #ff5722)",
                                  borderRadius: "2px",
                                  animation:
                                    "soundWave 1.2s ease-in-out infinite",
                                  animationDelay: `${i * 0.2}s`,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Fade>
                    )}

                    {speakerError && (
                      <Alert
                        severity="error"
                        sx={{ mt: 2, borderRadius: "12px" }}
                      >
                        {speakerError}
                      </Alert>
                    )}

                    {speakerStatus === "pending" && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={testSpeaker}
                        startIcon={<PlayArrowIcon />}
                        sx={{
                          mt: 2,
                          background: "#6DAF19",
                          color: "white",
                          fontFamily: "Lato",
                          fontWeight: 600,
                          borderRadius: "10px",
                          padding: "12px 24px",
                          textTransform: "none",
                          "&:hover": {
                            background: "#5a9a15",
                          },
                        }}
                      >
                        Test Speaker
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {!allTestsCompleted && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStartTests}
                  disabled={
                    micStatus === "testing" || speakerStatus === "testing"
                  }
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    background: "#6DAF19",
                    color: "white",
                    fontFamily: "Lato",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "14px 32px",
                    minWidth: "200px",
                    textTransform: "none",
                    fontSize: "18px",
                    "&:hover": {
                      background: "#5a9a15",
                    },
                    "&:disabled": {
                      background: "#cccccc",
                    },
                  }}
                >
                  Start All Tests
                </Button>
              )}

              {allTestsCompleted && (
                <>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleRetry}
                    startIcon={<RefreshIcon />}
                    sx={{
                      borderColor: "#6DAF19",
                      color: "#6DAF19",
                      fontFamily: "Lato",
                      fontWeight: 600,
                      borderRadius: "10px",
                      padding: "14px 32px",
                      minWidth: "200px",
                      textTransform: "none",
                      fontSize: "18px",
                      borderWidth: "2px",
                      "&:hover": {
                        borderWidth: "2px",
                        background: "rgba(109, 175, 25, 0.1)",
                      },
                    }}
                  >
                    Retry Tests
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleContinue}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: allTestsPassed ? "#6DAF19" : "#ff9800",
                      color: "white",
                      fontFamily: "Lato",
                      fontWeight: 600,
                      borderRadius: "10px",
                      padding: "14px 32px",
                      minWidth: "200px",
                      textTransform: "none",
                      fontSize: "18px",
                      "&:hover": {
                        background: allTestsPassed ? "#5a9a15" : "#f57c00",
                      },
                    }}
                  >
                    {allTestsPassed
                      ? "Continue to Application"
                      : "Continue Anyway"}
                  </Button>
                </>
              )}
            </Box>

            {allTestsCompleted && !allTestsPassed && (
              <Alert
                severity="warning"
                sx={{
                  mt: 3,
                  borderRadius: "12px",
                  borderLeft: "4px solid #ff9800",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "Lato",
                    fontWeight: 500,
                  }}
                >
                  <strong>Warning:</strong> Some audio devices are not working
                  properly. You may experience issues during learning
                  activities. Please check your device settings or contact your
                  teacher for assistance.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AudioDiagnosticPage;
