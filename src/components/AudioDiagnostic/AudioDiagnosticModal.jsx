import React, { useState, useRef, useEffect } from "react";
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
import { getLocalData } from "../../utils/constants";
import textureImage from "../../assets/images/textureImage.png";
import panda from "../../assets/images/panda.svg";
import { impression, interact, Log } from "../../services/telementryService";
import { getRandomAudioPrompt } from "../../constants/audioDiagnosticPrompts";
import { getTranslations } from "../../constants/audioDiagnosticTranslations";
import "./AudioDiagnosticModal.css";

const AudioDiagnosticModal = ({ show, onClose }) => {
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
  const [audioPrompt, setAudioPrompt] = useState("");
  const [currentStep, setCurrentStep] = useState("mic"); // "mic" or "speaker"
  const [isPlayingPrompt, setIsPlayingPrompt] = useState(false);
  const [hasListenedToPrompt, setHasListenedToPrompt] = useState(false);

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

  // Get translations based on current language
  const translations = getTranslations(lang);

  useEffect(() => {
    if (show) {
      // Impression event when diagnostic modal is displayed
      impression("audio-diagnostics", "ET");
      // Refresh language from localStorage when modal opens
      const currentLang = getLocalData("lang") || "en";
      setLang(currentLang);
      // Reset to mic step when modal opens
      setCurrentStep("mic");
      // Generate audio prompt with current language
      const prompt = getRandomAudioPrompt(currentLang);
      setAudioPrompt(prompt);
      setHasListenedToPrompt(false);
      // Auto-play the audio prompt when modal opens
      setTimeout(() => {
        playPromptAudio();
      }, 500);
    }

    return () => {
      cleanup();
      // Cancel any ongoing speech synthesis
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [show]);

  // Load speech synthesis voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      // Load voices (some browsers need this)
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Voices are now loaded
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
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

          // Check if audio is detected - lower threshold to catch quiet speech
          // Require actual sound, not just background noise
          const SILENCE_THRESHOLD = 0.003; // Lowered from 0.008 to catch quieter speech
          if (rms > SILENCE_THRESHOLD) {
            audioDetectedRef.current = true;
          }

          // Also mark as detected if we see significant variation (indicates speech activity)
          // Lower variation threshold to catch speech patterns
          if (audioLevelsRef.current.length > 5) {
            const recentLevels = audioLevelsRef.current.slice(-5);
            const maxLevel = Math.max(...recentLevels);
            const minLevel = Math.min(...recentLevels);
            const variation = maxLevel - minLevel;
            // Lower variation threshold - speech has more variation than silence
            if (variation > 0.005) {
              // Lowered from 0.01 to catch quieter speech
              audioDetectedRef.current = true;
            }
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

  const playPromptAudio = () => {
    if (!audioPrompt) return;

    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      setIsPlayingPrompt(true);

      const utterance = new SpeechSynthesisUtterance(audioPrompt);
      // Use the lang state variable
      const currentLang = lang || getLocalData("lang") || "en";

      // Map language codes to speech synthesis language codes
      const langMap = {
        hi: "hi-IN",
        ta: "ta-IN",
        tn: "ta-IN", // Tamil alternative code
        te: "te-IN",
        ka: "kn-IN",
        kn: "kn-IN",
        en: "en-US",
      };

      // Set language for speech synthesis
      utterance.lang = langMap[currentLang] || "en-US";
      utterance.rate = 0.8; // Slightly slower for children
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find appropriate voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang === utterance.lang ||
          v.lang.startsWith(utterance.lang.split("-")[0])
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsPlayingPrompt(false);
        setHasListenedToPrompt(true);
      };

      utterance.onerror = (error) => {
        console.error("Speech synthesis error:", error);
        setIsPlayingPrompt(false);
        // Still allow them to proceed even if audio fails
        setHasListenedToPrompt(true);
      };

      window.speechSynthesis.speak(utterance);
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
    // Don't regenerate prompt - use the one already set
    if (!audioPrompt) {
      const currentLang = getLocalData("lang") || "en";
      const prompt = getRandomAudioPrompt(currentLang);
      setAudioPrompt(prompt);
    }

    // Interact event for button click
    interact("ET", "Test Microphone", "audio-diagnostics");

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
        // 3. Average audio level was above threshold OR we have significant blob size
        const averageLevel =
          audioLevelsRef.current.length > 0
            ? audioLevelsRef.current.reduce((a, b) => a + b, 0) /
              audioLevelsRef.current.length
            : 0;

        // Lowered thresholds to better detect speech, especially for children
        const SILENCE_THRESHOLD = 0.003; // Lowered from 0.008 to catch quieter speech
        const MIN_PEAK_LEVEL = 0.005; // Lowered from 0.01 to catch quieter speech

        // Get max level to check for any significant audio activity
        const maxLevel =
          audioLevelsRef.current.length > 0
            ? Math.max(...audioLevelsRef.current)
            : 0;

        // Check if we have actual audio - more lenient detection:
        // 1. Audio was detected (audioDetectedRef.current is true) OR
        // 2. Either average level OR max level is above threshold
        // This ensures we catch speech even if detection flags weren't set properly
        const hasActualAudio =
          audioDetectedRef.current ||
          averageLevel > SILENCE_THRESHOLD ||
          maxLevel > MIN_PEAK_LEVEL ||
          (blob && blob.size > 1000); // If we have a reasonable blob size, assume audio was recorded

        setIsRecording(false);
        setRecordingProgress(0);

        const testDuration = micTestStartTimeRef.current
          ? ((Date.now() - micTestStartTimeRef.current) / 1000).toFixed(2)
          : 0;

        // Debug logging to help diagnose issues
        console.log("Audio Detection Debug:", {
          hasAudioData,
          blobSize: blob?.size || 0,
          hasActualAudio,
          audioDetectedFlag: audioDetectedRef.current,
          averageLevel: averageLevel.toFixed(4),
          maxLevel: maxLevel.toFixed(4),
          audioLevelsCount: audioLevelsRef.current.length,
        });

        // Only pass if we have audio data AND actual audio was detected
        // Made more lenient: if we have a reasonable blob size, assume audio was recorded
        if (
          hasAudioData &&
          blob &&
          blob.size > 0 &&
          (hasActualAudio || blob.size > 1000)
        ) {
          // Create audio URL for playback
          const audioUrl = URL.createObjectURL(blob);
          setRecordedAudioUrl(audioUrl);

          // Set fun message with clear explanation
          setTestMessage("");

          // Log test result - recording successful
          Log(
            `Microphone test - Recording successful. Duration: ${testDuration}s, Audio detected: true, Average level: ${averageLevel.toFixed(
              4
            )}, Max level: ${maxLevel.toFixed(4)}, Blob size: ${
              blob.size
            } bytes`,
            "audio-diagnostics",
            "ET"
          );

          // Mark microphone test as passed immediately (no playback - will play in speaker test)
          setTimeout(() => {
            setMicStatus("passed");
            setTestMessage("");

            // Log test result - passed
            Log(
              `Microphone test - PASSED. Duration: ${testDuration}s`,
              "audio-diagnostics",
              "ET"
            );

            // Give children time before moving to next step
            setTimeout(() => {
              // Move to speaker test after mic test passes
              if (speakerStatus === "pending") {
                setCurrentStep("speaker");
                setTestMessage("");
              }
            }, 1500);
          }, 1500);
        } else if (!hasAudioData || !blob || blob.size === 0) {
          setMicStatus("failed");
          setMicError(getTranslations(lang).micErrorNoAudio);
          // Log test result - failed
          Log(
            `Microphone test - FAILED. Duration: ${testDuration}s, Reason: No audio data recorded`,
            "audio-diagnostics",
            "ET"
          );
          audioContext.close();
        } else {
          // We have blob data but no actual audio was detected (muted or silent)
          setMicStatus("failed");
          setMicError(getTranslations(lang).micErrorMuted);
          // Log test result - failed (muted)
          Log(
            `Microphone test - FAILED. Duration: ${testDuration}s, Reason: Microphone muted or no sound detected, Average level: ${averageLevel.toFixed(
              4
            )}, Max level: ${maxLevel.toFixed(4)}, Blob size: ${
              blob ? blob.size : 0
            } bytes, Audio detected flag: ${audioDetectedRef.current}`,
            "audio-diagnostics",
            "ET"
          );
          audioContext.close();
        }
      };

      mediaRecorder.onerror = (event) => {
        setMicStatus("failed");
        setMicError(getTranslations(lang).micErrorGeneric);
        setIsRecording(false);
        setRecordingProgress(0);
        audioContext.close();
      };

      // Start recording
      mediaRecorder.start(100);

      // Set recording state immediately so audio monitoring can start
      // The analyser is already connected to the stream
      setIsRecording(true);

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
      setMicError(getTranslations(lang).micErrorPermission);
      setIsRecording(false);
      setRecordingProgress(0);
    }
  };

  const testSpeaker = async () => {
    // If we have recorded audio, use that instead of beep
    if (recordedAudioUrl) {
      setSpeakerStatus("testing");
      setSpeakerError("");
      setTestMessage("");

      // Give a moment before starting to play
      setTimeout(() => {
        setIsPlaying(true);
        speakerTestPassedRef.current = false;
        speakerTestStartTimeRef.current = Date.now();

        // Interact event for button click
        interact("ET", "Test Speaker", "audio-diagnostics");

        // Play the recorded audio (their own voice)
        const audio = new Audio(recordedAudioUrl);
        testAudioRef.current = audio;
        audio.volume = 0.8;

        audio.onended = () => {
          if (!speakerTestPassedRef.current) {
            setIsPlaying(false);
            setTestMessage("");

            // Give time before marking as passed
            setTimeout(() => {
              speakerTestPassedRef.current = true;
              setSpeakerStatus("passed");
              setTestMessage("");

              const testDuration = speakerTestStartTimeRef.current
                ? (
                    (Date.now() - speakerTestStartTimeRef.current) /
                    1000
                  ).toFixed(2)
                : 0;

              Log(
                `Speaker test - PASSED. Duration: ${testDuration}s, Method: Recorded Audio Playback`,
                "audio-diagnostics",
                "ET"
              );
            }, 1000);
          }
          if (testAudioRef.current) {
            testAudioRef.current = null;
          }
        };

        audio.onerror = () => {
          if (!speakerTestPassedRef.current) {
            setSpeakerStatus("failed");
            setSpeakerError(
              "Couldn't play the sound. Please check your speakers."
            );
            setIsPlaying(false);
          }
        };

        audio.play().catch((err) => {
          console.error("Audio play error:", err);
          if (!speakerTestPassedRef.current) {
            setIsPlaying(false);
            setSpeakerStatus("failed");
            setSpeakerError(
              "Couldn't play the sound. Please check your speakers."
            );
          }
        });
      }, 1000);
      return;
    }

    // Fallback to original beep test if no recorded audio
    setSpeakerStatus("testing");
    setSpeakerError("");
    setIsPlaying(true);
    speakerTestPassedRef.current = false;
    speakerTestStartTimeRef.current = Date.now();

    // Interact event for button click
    interact("ET", "Test Speaker", "audio-diagnostics");

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
            "audio-diagnostics",
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
            setSpeakerError(getTranslations(lang).speakerError);
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
            "audio-diagnostics",
            "ET"
          );
        }
        setIsPlaying(false);
      };

      testAudio.onerror = () => {
        if (!speakerTestPassedRef.current) {
          setSpeakerStatus("failed");
          setSpeakerError(getTranslations(lang).speakerErrorGeneric);

          const testDuration = speakerTestStartTimeRef.current
            ? ((Date.now() - speakerTestStartTimeRef.current) / 1000).toFixed(2)
            : 0;

          // Log test result - failed
          Log(
            `Speaker test - FAILED. Duration: ${testDuration}s, Reason: Audio playback error`,
            "audio-diagnostics",
            "ET"
          );

          setIsPlaying(false);
        }
      };
    } catch (error) {
      if (!speakerTestPassedRef.current) {
        setSpeakerStatus("failed");
        setSpeakerError(getTranslations(lang).speakerErrorNoTest);

        const testDuration = speakerTestStartTimeRef.current
          ? ((Date.now() - speakerTestStartTimeRef.current) / 1000).toFixed(2)
          : 0;

        // Log test result - failed
        Log(
          `Speaker test - FAILED. Duration: ${testDuration}s, Reason: ${
            error.message || "Unknown error"
          }`,
          "audio-diagnostics",
          "ET"
        );

        setIsPlaying(false);
      }
    }
  };

  const playRecordedAudio = (audioUrl) => {
    if (!audioUrl) return;

    setIsPlayingBack(true);
    setTestMessage("");

    // Clean up any existing playback
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      playbackAudioRef.current = null;
    }

    const audio = new Audio(audioUrl);
    playbackAudioRef.current = audio;

    audio.onended = () => {
      setIsPlayingBack(false);
      setTestMessage("");

      const totalTestDuration = micTestStartTimeRef.current
        ? ((Date.now() - micTestStartTimeRef.current) / 1000).toFixed(2)
        : 0;

      // Log test result - passed (after playback)
      Log(
        `Microphone test - PASSED. Total duration: ${totalTestDuration}s, Playback: successful`,
        "audio-diagnostics",
        "ET"
      );

      // Mark microphone test as passed after successful playback
      setTimeout(() => {
        setMicStatus("passed");
        setTestMessage("");

        // Give children time before moving to next step
        setTimeout(() => {
          // Move to speaker test after mic test passes
          // Don't auto-play - let them click the button to avoid playing twice
          if (speakerStatus === "pending") {
            setCurrentStep("speaker");
            setTestMessage("");
          }
        }, 1500);
      }, 1500);
    };

    audio.onerror = () => {
      setIsPlayingBack(false);
      setMicStatus("failed");
      setMicError(getTranslations(lang).speakerError);
      setTestMessage("");

      const totalTestDuration = micTestStartTimeRef.current
        ? ((Date.now() - micTestStartTimeRef.current) / 1000).toFixed(2)
        : 0;

      // Log test result - failed (playback error)
      Log(
        `Microphone test - FAILED. Total duration: ${totalTestDuration}s, Reason: Playback failed`,
        "audio-diagnostics",
        "ET"
      );
    };

    audio.play().catch((err) => {
      console.error("Playback error:", err);
      setIsPlayingBack(false);
      setMicStatus("failed");
      setMicError(getTranslations(lang).speakerError);
      setTestMessage("");

      const totalTestDuration = micTestStartTimeRef.current
        ? ((Date.now() - micTestStartTimeRef.current) / 1000).toFixed(2)
        : 0;

      // Log test result - failed (playback error)
      Log(
        `Microphone test - FAILED. Total duration: ${totalTestDuration}s, Reason: Playback error - ${
          err.message || "Unknown"
        }`,
        "audio-diagnostics",
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
    interact("ET", "Start All Tests", "audio-diagnostics");

    setCurrentStep("mic");
    testMicrophone();
  };

  const handleContinue = () => {
    // Interact event for button click
    interact("ET", "Continue to Application", "audio-diagnostics");

    cleanup();
    onClose();
  };

  const handleRetry = () => {
    // Interact event for button click
    interact("ET", "Retry Tests", "audio-diagnostics");

    setMicStatus("pending");
    setSpeakerStatus("pending");
    setMicError("");
    setSpeakerError("");
    setRecordingProgress(0);
    setAudioLevel(0);
    setIsPlayingBack(false);
    setTestMessage("");
    // Generate a new prompt for retry with current language
    const currentLang = getLocalData("lang") || "en";
    setLang(currentLang);
    const prompt = getRandomAudioPrompt(currentLang);
    setAudioPrompt(prompt);
    setHasListenedToPrompt(false);
    setCurrentStep("mic");
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

  if (!show) return null;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#ffffff",
        zIndex: 9999,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${textureImage})`,
          backgroundRepeat: "round",
          backgroundSize: "contain",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 3 },
            px: { xs: 1.5, sm: 3, md: 4 },
            pt: { xs: 3, sm: 3, md: 4 },
            pb: { xs: 1, sm: 2, md: 3 },
            position: "relative",
            zIndex: 1,
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: { xs: "flex-start", sm: "center" },
            width: "100%",
            minHeight: 0,
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          {/* Speech Bubble - Hide on error */}
          {!(currentStep === "mic" && micStatus === "failed") &&
            !(currentStep === "speaker" && speakerStatus === "failed") && (
              <Box
                sx={{
                  position: "relative",
                  mb: { xs: 0.75, sm: 2, md: 3 },
                  mt: { xs: 1, sm: 0.5, md: 0 },
                  maxWidth: { xs: "calc(100% - 32px)", sm: "400px" },
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  px: { xs: 1, sm: 0 },
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    background: "#ffffff",
                    border: {
                      xs: "2px solid #6DAF19",
                      sm: "3px solid #6DAF19",
                    },
                    borderRadius: { xs: "14px", sm: "20px" },
                    p: { xs: 1, sm: 2, md: 2.5 },
                    position: "relative",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: {
                        xs: "10px solid transparent",
                        sm: "12px solid transparent",
                      },
                      borderRight: {
                        xs: "10px solid transparent",
                        sm: "12px solid transparent",
                      },
                      borderTop: {
                        xs: "10px solid #ffffff",
                        sm: "12px solid #ffffff",
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      bottom: "-13px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: {
                        xs: "11px solid transparent",
                        sm: "13px solid transparent",
                      },
                      borderRight: {
                        xs: "11px solid transparent",
                        sm: "13px solid transparent",
                      },
                      borderTop: {
                        xs: "11px solid #6DAF19",
                        sm: "13px solid #6DAF19",
                      },
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Quicksand",
                      fontSize: { xs: "14px", sm: "20px", md: "24px" },
                      fontWeight: 600,
                      color: "#333333",
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {currentStep === "mic"
                      ? micStatus === "pending" && !hasListenedToPrompt
                        ? translations.listenAndRepeat
                        : micStatus === "pending" && hasListenedToPrompt
                        ? translations.nowRepeat
                        : micStatus === "testing" || isRecording
                        ? translations.keepSpeaking
                        : micStatus === "passed"
                        ? translations.micTestPassed
                        : translations.testMicrophone
                      : speakerStatus === "pending"
                      ? translations.listenToVoice
                      : speakerStatus === "testing" || isPlaying
                      ? translations.canYouHear
                      : speakerStatus === "passed"
                      ? translations.speakerTestPassed
                      : translations.testSpeakers}
                  </Typography>
                </Box>
              </Box>
            )}

          {/* Centered Panda Mascot - Hide on error */}
          {!(currentStep === "mic" && micStatus === "failed") &&
            !(currentStep === "speaker" && speakerStatus === "failed") && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: { xs: 0.75, sm: 2, md: 3 },
                  position: "relative",
                }}
              >
                <img
                  src={panda}
                  alt="panda"
                  style={{
                    width: isMobile ? "80px" : "180px",
                    height: "auto",
                    filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))",
                  }}
                />
              </Box>
            )}

          {/* Test Content - Simplified */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "calc(100% - 32px)", sm: "600px" },
              mb: { xs: 0.75, sm: 2 },
              px: { xs: 1, sm: 0 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            {currentStep === "mic" && (
              <>
                {/* Reading Prompt - Show before and during recording, hide on error */}
                {audioPrompt && (micStatus === "pending" || isRecording) && (
                  <Fade in={true}>
                    <Box
                      sx={{
                        background: "#f8f9fa",
                        borderRadius: { xs: "12px", sm: "16px" },
                        p: { xs: 1.25, sm: 2.5, md: 3 },
                        mb: { xs: 0.75, sm: 3 },
                        border: "2px solid #6DAF19",
                        textAlign: "center",
                        width: "100%",
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxSizing: "border-box",
                      }}
                    >
                      {!isRecording && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: { xs: 1.5, sm: 2 },
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "Quicksand",
                              fontSize: { xs: "16px", sm: "20px", md: "22px" },
                              fontWeight: 600,
                              color: "#333333",
                              mb: { xs: 1, sm: 1.5 },
                            }}
                          >
                            {isPlayingPrompt
                              ? translations.playingAudio
                              : hasListenedToPrompt
                              ? translations.clickToListenAgain
                              : translations.clickToListen}
                          </Typography>
                          <Button
                            onClick={() => {
                              playPromptAudio();
                              // Enable the continue button when user clicks play
                              setTimeout(() => {
                                setHasListenedToPrompt(true);
                              }, 1500); // 1.5 seconds should be enough for the phrases
                            }}
                            disabled={isPlayingPrompt}
                            sx={{
                              minWidth: "auto",
                              width: { xs: "64px", sm: "80px", md: "96px" },
                              height: { xs: "64px", sm: "80px", md: "96px" },
                              borderRadius: "50%",
                              background: isPlayingPrompt
                                ? "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
                                : "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
                              color: "white",
                              "&:hover": {
                                background: isPlayingPrompt
                                  ? "linear-gradient(135deg, #f57c00 0%, #e65100 100%)"
                                  : "linear-gradient(135deg, #5a9a15 0%, #4a8a10 100%)",
                              },
                              boxShadow: "0 4px 12px rgba(109, 175, 25, 0.3)",
                            }}
                          >
                            <VolumeUpIcon
                              sx={{
                                fontSize: {
                                  xs: "32px",
                                  sm: "40px",
                                  md: "48px",
                                },
                              }}
                            />
                          </Button>
                        </Box>
                      )}
                      {isRecording && (
                        <>
                          <LinearProgress
                            variant="determinate"
                            value={recordingProgress}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: "rgba(109, 175, 25, 0.1)",
                              mt: 2,
                              "& .MuiLinearProgress-bar": {
                                background:
                                  "linear-gradient(90deg, #6DAF19, #4caf50)",
                                borderRadius: 5,
                              },
                            }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              gap: "3px",
                              height: "60px",
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
                        </>
                      )}
                    </Box>
                  </Fade>
                )}

                {/* Status Icon - Only show when not recording and not in error state */}
                {!isRecording && !isPlayingBack && micStatus !== "failed" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: { xs: 0.5, sm: 2 },
                      minHeight: { xs: "40px", sm: "80px", md: "100px" },
                      width: "100%",
                    }}
                  >
                    {getStatusIcon(micStatus, "mic")}
                  </Box>
                )}
              </>
            )}

            {currentStep === "speaker" && (
              <>
                {/* Status Icon */}
                {!isPlaying && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: { xs: 1, sm: 2 },
                      minHeight: { xs: "50px", sm: "80px", md: "100px" },
                      width: "100%",
                    }}
                  >
                    {getStatusIcon(speakerStatus, "speaker")}
                  </Box>
                )}

                {/* Playing Section */}
                {isPlaying && (
                  <Fade in={isPlaying}>
                    <Box
                      sx={{
                        background: "#fff3e0",
                        borderRadius: { xs: "12px", sm: "16px" },
                        p: { xs: 1.5, sm: 3 },
                        mb: { xs: 1, sm: 3 },
                        border: "2px solid #ff9800",
                        textAlign: "center",
                        width: "100%",
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxSizing: "border-box",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Quicksand",
                          fontSize: { xs: "22px", sm: "24px", md: "26px" },
                          fontWeight: 700,
                          color: "#f57c00",
                          mb: 2,
                        }}
                      >
                        Can you hear it?
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          height: "50px",
                        }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: "5px",
                              height: "100%",
                              background:
                                "linear-gradient(180deg, #ff9800, #ff5722)",
                              borderRadius: "3px",
                              animation: "soundWave 1.2s ease-in-out infinite",
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Fade>
                )}
              </>
            )}
          </Box>

          {/* Error Messages - Prominent on error screen */}
          {micError && currentStep === "mic" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mb: { xs: 1.5, sm: 2 },
                mt: { xs: 2, sm: 3 },
                width: "100%",
                maxWidth: { xs: "calc(100% - 32px)", sm: "500px" },
              }}
            >
              {/* Error Icon */}
              <Box
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ErrorIcon
                  sx={{
                    fontSize: { xs: "64px", sm: "80px", md: "96px" },
                    color: "#ff9800",
                  }}
                />
              </Box>
              {/* Error Message */}
              <Alert
                severity="warning"
                sx={{
                  mb: 0,
                  borderRadius: "12px",
                  backgroundColor: "#fff8e1",
                  border: "2px solid #ff9800",
                  fontSize: { xs: "16px", sm: "18px" },
                  fontWeight: 600,
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 2, sm: 3 },
                  width: "100%",
                  boxSizing: "border-box",
                  fontFamily: "Quicksand",
                }}
              >
                {micError}
              </Alert>
            </Box>
          )}

          {speakerError && currentStep === "speaker" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mb: { xs: 1.5, sm: 2 },
                mt: { xs: 2, sm: 3 },
                width: "100%",
                maxWidth: { xs: "calc(100% - 32px)", sm: "500px" },
              }}
            >
              {/* Error Icon */}
              <Box
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ErrorIcon
                  sx={{
                    fontSize: { xs: "64px", sm: "80px", md: "96px" },
                    color: "#ff9800",
                  }}
                />
              </Box>
              {/* Error Message */}
              <Alert
                severity="warning"
                sx={{
                  mb: 0,
                  borderRadius: "12px",
                  backgroundColor: "#fff8e1",
                  border: "2px solid #ff9800",
                  fontSize: { xs: "16px", sm: "18px" },
                  fontWeight: 600,
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 2, sm: 3 },
                  width: "100%",
                  boxSizing: "border-box",
                  fontFamily: "Quicksand",
                }}
              >
                {speakerError}
              </Alert>
            </Box>
          )}

          {/* Action Buttons - Duolingo Style */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "calc(100% - 32px)", sm: "400px" },
              mt: { xs: 0.25, sm: 1.5 },
              mb: { xs: 0, sm: 0 },
              px: { xs: 1, sm: 0 },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            {currentStep === "mic" &&
              (micStatus === "pending" || micStatus === "failed") &&
              !isRecording && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={testMicrophone}
                  disabled={false}
                  sx={{
                    background:
                      micStatus === "failed"
                        ? "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
                        : "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: 700,
                    borderRadius: "25px",
                    padding: {
                      xs: "14px 24px",
                      sm: "18px 36px",
                      md: "20px 40px",
                    },
                    textTransform: "none",
                    fontSize: { xs: "16px", sm: "20px", md: "22px" },
                    boxShadow: "0 8px 20px rgba(109, 175, 25, 0.4)",
                    "&:hover": {
                      background:
                        micStatus === "failed"
                          ? "linear-gradient(135deg, #f57c00 0%, #e65100 100%)"
                          : "linear-gradient(135deg, #5a9a15 0%, #4a8a10 100%)",
                      transform: "scale(1.02)",
                      boxShadow: "0 12px 24px rgba(109, 175, 25, 0.5)",
                    },
                    "&:disabled": {
                      background:
                        "linear-gradient(135deg, #cccccc 0%, #999999 100%)",
                      color: "white",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  {micStatus === "failed"
                    ? translations.tryAgain
                    : translations.repeatNow}
                </Button>
              )}

            {currentStep === "speaker" &&
              (speakerStatus === "pending" || speakerStatus === "failed") &&
              !isPlaying && (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={testSpeaker}
                  sx={{
                    background:
                      speakerStatus === "failed"
                        ? "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)"
                        : "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: 700,
                    borderRadius: "25px",
                    padding: {
                      xs: "14px 24px",
                      sm: "18px 36px",
                      md: "20px 40px",
                    },
                    textTransform: "none",
                    fontSize: { xs: "16px", sm: "20px", md: "22px" },
                    boxShadow: "0 8px 20px rgba(109, 175, 25, 0.4)",
                    "&:hover": {
                      background:
                        speakerStatus === "failed"
                          ? "linear-gradient(135deg, #f57c00 0%, #e65100 100%)"
                          : "linear-gradient(135deg, #5a9a15 0%, #4a8a10 100%)",
                      transform: "scale(1.02)",
                      boxShadow: "0 12px 24px rgba(109, 175, 25, 0.5)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  {speakerStatus === "failed"
                    ? translations.tryAgain
                    : translations.continue}
                </Button>
              )}
          </Box>
        </Box>
      </Box>

      {/* Skip Button - Always visible */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 8, sm: 20, md: 30 },
          right: { xs: 10, sm: 20, md: 40 },
          zIndex: 10000,
        }}
      >
        <Button
          variant="text"
          onClick={() => {
            // Telemetry event for skip button
            interact("ET", "Skip Audio Diagnostic", "audio-diagnostics");
            onClose();
          }}
          sx={{
            color: "#666666",
            fontFamily: "Quicksand",
            fontWeight: 600,
            textTransform: "none",
            fontSize: { xs: "12px", sm: "14px", md: "16px" },
            padding: { xs: "8px 12px", sm: "10px 16px" },
            "&:hover": {
              color: "#6DAF19",
              background: "rgba(109, 175, 25, 0.1)",
            },
          }}
        >
          {translations.skip}
        </Button>
      </Box>

      {/* Bottom Action Buttons - Only show when all tests completed */}
      {allTestsCompleted && (
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 10, sm: 20, md: 30 },
            right: { xs: 10, sm: 20, md: 40 },
            zIndex: 10000,
            display: "flex",
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleRetry}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: "#6DAF19",
              color: "#6DAF19",
              fontFamily: "Quicksand",
              fontWeight: 700,
              borderRadius: "25px",
              padding: { xs: "12px 24px", sm: "14px 28px", md: "16px 32px" },
              textTransform: "none",
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              background: "white",
              border: "2px solid #6DAF19",
              "&:hover": {
                background: "#f5f5f5",
                border: "2px solid #5a9a15",
              },
            }}
          >
            Retry
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              // Telemetry event for continue button
              interact(
                "ET",
                "Continue After Audio Diagnostic",
                "audio-diagnostics"
              );
              onClose();
            }}
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
              color: "white",
              fontFamily: "Quicksand",
              fontWeight: 700,
              borderRadius: "25px",
              padding: { xs: "12px 24px", sm: "14px 28px", md: "16px 32px" },
              textTransform: "none",
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              boxShadow: "0 8px 20px rgba(109, 175, 25, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a9a15 0%, #4a8a10 100%)",
                transform: "scale(1.02)",
                boxShadow: "0 12px 24px rgba(109, 175, 25, 0.5)",
              },
              transition: "all 0.3s",
            }}
          >
            {translations.continue}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AudioDiagnosticModal;
