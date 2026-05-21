import React, { useState, useEffect, useRef } from "react";
import { reportError } from "./errorReporter";
import RecordRTC from "recordrtc";
import { Box, CircularProgress } from "@mui/material";
import {
  ListenButton,
  SpeakButton,
  StopButton,
  getLocalData,
  getBrowserLanguage,
} from "./constants";
import { RetryIcon } from "../components/Icons/SvgIcons";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";
import playButton from "../../src/assets/listen.png";
import pauseButton from "../../src/assets/pause.png";
import PropTypes from "prop-types";
import SpeechRecognition from "react-speech-recognition";
import { doubleMetaphone } from "double-metaphone";
import { transliterateKannadaToLatin, compareWords } from "../utils/textUtils";
import { getTextSimilarity } from "./VoiceAnalyser";

function sanitize(text) {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"\[\]'’]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function phoneticMatch(a, b) {
  const [a1, a2] = doubleMetaphone(a);
  const [b1, b2] = doubleMetaphone(b);
  return a1 === b1 || a1 === b2 || a2 === b1 || a2 === b2;
}

function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 100;

  const words1 = str1.trim().split(/\s+/);
  const words2 = str2.trim().split(/\s+/);

  if (words1.length === 1 && words2.length === 1) {
    return phoneticMatch(words1[0], words2[0]) ? 85 : 0;
  }

  let matchedWords = 0;
  const minLength = Math.min(words1.length, words2.length);
  const maxLength = Math.max(words1.length, words2.length);

  for (let i = 0; i < minLength; i++) {
    if (words1[i] === words2[i] || phoneticMatch(words1[i], words2[i])) {
      matchedWords++;
    }
  }

  return (matchedWords / maxLength) * 100;
}

/** Offline transcript vs target correctness (browser ASR path). */
function getOfflineCorrectnessResult(rawTranscript, rawTarget, language) {
  const transcripts = sanitize(rawTranscript);
  const target = sanitize(rawTarget);
  if (!transcripts || transcripts.trim().length === 0) {
    return false;
  }

  const exactMatch = transcripts === target;
  const similarity = getTextSimilarity(transcripts, target);
  const isCorrect = exactMatch || similarity >= 80;

  console.log("final answer", similarity, isCorrect);
  return isCorrect;
}

const AudioRecorder = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [showLoader, setShowLoader] = useState(false);
  const [language, setLanguage] = useState(getLocalData("lang") || "en");
  const transcriptRef = useRef("");

  // Map language codes to browser speech recognition format

  //console.log("pageName", props.pageName);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (props.setEnableNext) {
        props.setEnableNext(false);
      }
      setStatus("recording");
      mediaStreamRef.current = stream;

      // Reset transcript
      transcriptRef.current = "";
      props.setOfflineResponseText?.("");

      // Start browser speech recognition
      try {
        SpeechRecognition.startListening({
          continuous: true,
          interimResults: true,
          language: getBrowserLanguage(language),
        });

        // Listen for results
        const recognition = SpeechRecognition.getRecognition();
        if (recognition) {
          recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
              .map((result) => result[0].transcript)
              .join(" ");
            transcriptRef.current = transcript;
            props.setOfflineResponseText?.(transcript);
          };

          recognition.onerror = (event) => {
            // Speech recognition error - handled gracefully
          };
        }
      } catch (srError) {
        // Browser speech recognition not available - handled gracefully
      }

      // Use RecordRTC with specific configurations to match the blob structure
      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav", // Ensuring the same MIME type as AudioRecorderCompair
        recorderType: RecordRTC.StereoAudioRecorder, // Use StereoAudioRecorder for better compatibility
        numberOfAudioChannels: 1, // Match the same number of audio channels
        desiredSampRate: 16000, // Adjust the sample rate if necessary to match
        disableLogs: true,
      });

      recorderRef.current.startRecording();

      setIsRecording(true);

      props.handleStartRecording?.();
    } catch (err) {
      console.error("Failed to start recording:", err);
      reportError({
        type: "audio_error",
        action: "start_recording",
        message: err?.message,
        stack: err?.stack,
      });
    }
  };

  const stopRecording = () => {
    setShowLoader(true);
    const timeoutId = setTimeout(() => {
      // setShowLoader(false);
      // setStatus("inactive");
      if (recorderRef.current) {
        recorderRef.current.stopRecording(() => {
          const blob = recorderRef.current.getBlob();
          const finalizeRecordingUi = () => {
            setShowLoader(false);
            setStatus("inactive");
          };

          if (!blob) {
            console.error("Failed to retrieve audio blob.");
            finalizeRecordingUi();
            props.setIsCorrect?.(false);
            if (mediaStreamRef.current) {
              mediaStreamRef.current
                .getTracks()
                .forEach((track) => track.stop());
            }
            setIsRecording(false);
            props.setEnableNext?.(true);
            props.handleStopRecording?.();
            return;
          }

          setAudioBlob(blob);
          saveBlob(blob);

          try {
            SpeechRecognition.stopListening();
          } catch {
            // Non-critical
          }

          const useOfflineAsr = props.noOffline !== true && !props.isShowCase;
          if (useOfflineAsr) {
            try {
              const rawTranscript = transcriptRef.current || "";
              const rawTarget = props.originalText || "";
              props.setOfflineResponseText?.(rawTranscript);
              console.log("[Offline ASR] original_text:", rawTarget);
              console.log("[Offline ASR] response_text:", rawTranscript);
              props.setIsCorrect?.(
                getOfflineCorrectnessResult(rawTranscript, rawTarget, language)
              );
            } catch (error) {
              console.error("Transcription error:", error);
              reportError({
                type: "audio_error",
                action: "transcription",
                message: error?.message,
                stack: error?.stack,
              });
              props.setIsCorrect?.(false);
            }
          } else {
            props.setIsCorrect?.(false);
          }

          finalizeRecordingUi();

          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          }
          setIsRecording(false);
          props.setEnableNext?.(true);

          props.handleStopRecording?.();
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const saveBlob = (blob) => {
    const url = window.URL.createObjectURL(blob);
    props?.setRecordedAudio(url);
  };

  const getPulseAnimationStyle = (color) => ({
    position: "absolute",
    width: "90px",
    height: "90px",
    backgroundColor: color,
    borderRadius: "50%",
    animation: "pulse 1.2s linear infinite",
    "@keyframes pulse": {
      "0%": {
        transform: "scale(0.6)",
        opacity: 0,
      },
      "50%": {
        opacity: 1,
      },
      "100%": {
        transform: "scale(1.4)",
        opacity: 0,
      },
    },
  });

  return (
    <div>
      <div>
        {(() => {
          if (status === "recording") {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                    ...((props.pageName === "m7" ||
                      props.pageName === "m8") && {
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }),
                  }}
                  onClick={stopRecording}
                >
                  <Box
                    sx={
                      props.pageName === "m7" ||
                      (props.pageName === "m8" && props.buttonAnimation)
                        ? getPulseAnimationStyle("#FF4B4B33")
                        : {}
                    }
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <StopButton
                      height={
                        props.pageName == "m7" || props.pageName === "m8"
                          ? 45
                          : 70
                      }
                      width={
                        props.pageName == "m7" || props.pageName === "m8"
                          ? 45
                          : 70
                      }
                    />
                  </Box>
                </Box>
                {showLoader ? (
                  <div className="loader"></div>
                ) : (
                  <Box style={{ marginTop: "10px", marginBottom: "50px" }}>
                    {props.pageName !== "m8" && <RecordVoiceVisualizer />}
                  </Box>
                )}
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: !props.showOnlyListen ? "flex" : "",
                  margin: "0 auto",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="game-action-button"
              >
                {props.enableAfterLoad &&
                  props?.originalText &&
                  (!props.dontShowListen ||
                    props.recordedAudio ||
                    !props.pageName === "m8") && (
                    <>
                      {!props.isShowCase && !(props.pageName === "m8") && (
                        <Box>
                          {!props.pauseAudio ? (
                            <div
                              onClick={() => {
                                props.playAudio(true);
                              }}
                            >
                              <Box sx={{ cursor: "pointer" }}>
                                <ListenButton
                                  height={
                                    props.pageName == "m7" ||
                                    props.pageName === "m8"
                                      ? 45
                                      : 70
                                  }
                                  width={
                                    props.pageName == "m7" ||
                                    props.pageName === "m8"
                                      ? 45
                                      : 70
                                  }
                                />
                              </Box>
                            </div>
                          ) : (
                            <Box
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                props.playAudio(false);
                              }}
                            >
                              <StopButton
                                height={
                                  props.pageName == "m7" ||
                                  props.pageName === "m8"
                                    ? 45
                                    : 70
                                }
                                width={
                                  props.pageName == "m7" ||
                                  props.pageName === "m8"
                                    ? 45
                                    : 70
                                }
                              />
                            </Box>
                          )}
                        </Box>
                      )}
                      <Box
                        sx={{
                          marginLeft: props.isShowCase ? "" : "30px",
                          cursor: "pointer",
                        }}
                      >
                        {props.recordedAudio ? (
                          <img
                            onClick={() =>
                              props.playRecordedAudio(
                                !props.isStudentAudioPlaying
                              )
                            }
                            style={{
                              height:
                                props.pageName == "m7" ||
                                props.pageName === "m8"
                                  ? 45
                                  : 70,
                            }}
                            src={
                              props.isStudentAudioPlaying
                                ? pauseButton
                                : playButton
                            }
                            alt={props.isStudentAudioPlaying ? "Pause" : "Play"}
                          />
                        ) : (
                          <Box></Box>
                        )}
                      </Box>
                    </>
                  )}

                <div>
                  {props.enableAfterLoad ? (
                    props?.originalText &&
                    !props.showOnlyListen && (
                      <Box
                        marginLeft={props.recordedAudio ? "32px" : "0px"}
                        sx={{ cursor: "pointer" }}
                        onClick={startRecording}
                      >
                        {!props.recordedAudio ? (
                          <Box
                            sx={{
                              ...((props.pageName == "m7" ||
                                props.pageName === "m8") && {
                                width: "90px",
                                height: "90px",
                                borderRadius: "50%",
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }),
                            }}
                          >
                            <Box
                              sx={
                                props.pageName == "m7" ||
                                (props.pageName === "m8" &&
                                  props.buttonAnimation)
                                  ? getPulseAnimationStyle("#58CC0233")
                                  : {}
                              }
                            />
                            <Box
                              sx={{
                                position: "relative",
                                zIndex: 1,
                              }}
                            >
                              <SpeakButton
                                height={
                                  props.pageName == "m7" ||
                                  props.pageName === "m8"
                                    ? 45
                                    : 70
                                }
                                width={
                                  props.pageName == "m7" ||
                                  props.pageName === "m8"
                                    ? 45
                                    : 70
                                }
                              />
                            </Box>
                          </Box>
                        ) : (
                          <RetryIcon
                            height={
                              props.pageName == "m7" || props.pageName === "m8"
                                ? 45
                                : 70
                            }
                            width={
                              props.pageName == "m7" || props.pageName === "m8"
                                ? 45
                                : 70
                            }
                          />
                        )}
                      </Box>
                    )
                  ) : (
                    <Box sx={{ display: "flex" }}>
                      <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
                    </Box>
                  )}
                </div>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
};

AudioRecorder.propTypes = {
  enableAfterLoad: PropTypes.bool,
  showOnlyListen: PropTypes.bool,
  recordedAudio: PropTypes.string,
  originalText: PropTypes.string,
};

export default AudioRecorder;
