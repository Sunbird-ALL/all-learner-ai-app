import React, { useState, useEffect, useRef } from "react";
import RecordRTC from "recordrtc";
import { Box } from "@mui/material";
import { ListenButton, RetryIcon, SpeakButton, StopButton } from "./constants";
import RecordVoiceVisualizer from "./RecordVoiceVisualizer";
import playButton from "../../src/assets/listen.png";
import pauseButton from "../../src/assets/pause.png";
import PropTypes from "prop-types";

const AudioRecorder = (props) => {
  const [status, setStatus] = useState("");
  const recorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

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
    setStatus("recording");
    if (props.setEnableNext) {
      props.setEnableNext(false);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

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
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = () => {
    setStatus("inactive");
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();

        if (blob) {
          saveBlob(blob); // Persist the blob
        } else {
          console.error("Failed to retrieve audio blob.");
        }

        // Stop the media stream
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }
      });
    }
    if (props.setEnableNext) {
      props.setEnableNext(true);
    }
  };

  const saveBlob = (blob) => {
    const url = window.URL.createObjectURL(blob);
    if (props.setRecordedAudio) {
      props?.setRecordedAudio(url);
    }
  };

  const renderActionButton = () => (
    <Box
      marginLeft={!props.dontShowListen || props.recordedAudio ? "32px" : "0px"}
      sx={{ cursor: "pointer" }}
      onClick={startRecording}
    >
      {props.recordedAudio ? <RetryIcon /> : <SpeakButton />}
    </Box>
  );

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
                  sx={{ cursor: "pointer", height: "38px" }}
                  onClick={stopRecording}
                >
                  <StopButton />
                </Box>
                <Box style={{ marginTop: "50px", marginBottom: "50px" }}>
                  <RecordVoiceVisualizer />
                </Box>
              </div>
            );
          } else {
            return (
              <div
                style={{
                  display: !props.showOnlyListen ? "flex" : "",
                  justifyContent: "space-between",
                  margin: "0 auto",
                }}
                className="game-action-button"
              >
                {props?.originalText &&
                  (!props.dontShowListen || props.recordedAudio) && (
                    <>
                      {!props.isShowCase && (
                        <Box>
                          {!props.pauseAudio ? (
                            <button
                              onClick={() => props.playAudio(true)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                              }}
                              aria-label="Play audio" // Accessibility improvement
                            >
                              <ListenButton />
                            </button>
                          ) : (
                            <button
                              onClick={() => props.playAudio(false)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                              }}
                              aria-label="Stop audio" // Accessibility improvement
                            >
                              <StopButton />
                            </button>
                          )}
                        </Box>
                      )}

                      <Box
                        sx={{
                          marginLeft: props.isShowCase ? "" : "35px",
                          cursor: "pointer",
                        }}
                      >
                        {props.recordedAudio ? (
                          <button
                            onClick={() =>
                              props.playRecordedAudio(
                                !props.isStudentAudioPlaying
                              )
                            }
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                            aria-label={
                              props.isStudentAudioPlaying
                                ? "Pause audio"
                                : "Play audio"
                            } // Accessibility improvement
                          >
                            <img
                              style={{ height: "70px" }}
                              src={
                                props.isStudentAudioPlaying
                                  ? pauseButton
                                  : playButton
                              }
                              alt={
                                props.isStudentAudioPlaying ? "Pause" : "Play"
                              }
                            />
                          </button>
                        ) : null}
                      </Box>
                    </>
                  )}
                <div>
                  {props.originalText &&
                    !props.showOnlyListen &&
                    renderActionButton()}
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
  setEnableNext: PropTypes.func,
  recordedAudio: PropTypes.string,
  setRecordedAudio: PropTypes.func,
  originalText: PropTypes.string,
  showOnlyListen: PropTypes.bool,
  dontShowListen: PropTypes.bool,
  isShowCase: PropTypes.bool,
  pauseAudio: PropTypes.bool,
  playAudio: PropTypes.func.isRequired,
  isStudentAudioPlaying: PropTypes.bool,
  playRecordedAudio: PropTypes.func.isRequired,
};

export default AudioRecorder;
