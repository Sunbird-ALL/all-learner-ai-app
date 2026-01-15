import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import * as s3Assets from "../utils/s3Links";
import { getAssetUrl } from "../utils/s3Links";
import { getAssetAudioUrl } from "../utils/s3Links";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../components/Layouts.jsx/MainLayout";
import listenImg from "../assets/listen.png";
import correctSound from "../assets/correct.wav";
import wrongSound from "../assets/audio/wrong.wav";
import RecordVoiceVisualizer from "../utils/RecordVoiceVisualizer";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
  setLocalData,
} from "../utils/constants";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const content = {
  L1: [
    {
      word: "Star",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.starRAudio) || Assets.starRAudio,
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.AppleAudio) || Assets.AppleAudio,
          isCorrect: false,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.jugR1OneAudio) || Assets.jugR1OneAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
    {
      word: "Spin",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.spinRAudio) || Assets.spinRAudio,
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.sunsetAudio) || Assets.sunsetAudio,
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.basketAudio) || Assets.basketAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
    {
      word: "Sky",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.skyRAudio) || Assets.skyRAudio,
          isCorrect: true,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.bagR1TwoAudio) || Assets.bagR1TwoAudio,
          isCorrect: false,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.bagR1ThreeAudio) ||
            Assets.bagR1ThreeAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
    {
      word: "Tree",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.treeRAudio) || Assets.treeRAudio,
          isCorrect: true,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.capR1TwoAudio) || Assets.capR1TwoAudio,
          isCorrect: false,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.capR1ThreeAudio) ||
            Assets.capR1ThreeAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
    {
      word: "Dragon",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.dragonRAudio) || Assets.dragonRAudio,
          isCorrect: true,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.dogR1TwoAudio) || Assets.dogR1TwoAudio,
          isCorrect: false,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.dogR1ThreeAudio) ||
            Assets.dogR1ThreeAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
    {
      word: "Oil",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.oilRAudio) || Assets.oilRAudio,
          isCorrect: true,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.eggR1TwoAudio) || Assets.eggR1TwoAudio,
          isCorrect: false,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.eggR1ThreeAudio) ||
            Assets.eggR1ThreeAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
    {
      word: "Street",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.streetRAudio) || Assets.streetRAudio,
          isCorrect: true,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.fanR1TwoAudio) || Assets.fanR1TwoAudio,
          isCorrect: false,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.fanR1ThreeAudio) ||
            Assets.fanR1ThreeAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
    {
      word: "Panther",
      audioOptions: [
        {
          audio:
            getAssetAudioUrl(s3Assets.pantherRAudio) || Assets.pantherRAudio,
          isCorrect: true,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.hatR1TwoAudio) || Assets.hatR1TwoAudio,
          isCorrect: false,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.hatR1ThreeAudio) ||
            Assets.hatR1ThreeAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
    {
      word: "Listen",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.listenRAudio) || Assets.listenRAudio,
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.shopAudio) || Assets.shopAudio,
          isCorrect: false,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.pillowR1ThreeAudio) ||
            Assets.pillowR1ThreeAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
    {
      word: "Three",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.threeRAudio) || Assets.threeRAudio,
          isCorrect: true,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.ropeR1OneAudio) || Assets.ropeR1OneAudio,
          isCorrect: false,
        },
        {
          audio:
            getAssetAudioUrl(s3Assets.ropeR1ThreeAudio) ||
            Assets.ropeR1ThreeAudio,
          isCorrect: false,
        },
      ],
      flowName: "S1",
    },
  ],
};

const WordHuntS1 = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
  enableNext,
  showTimer,
  points,
  steps,
  currentStep,
  contentId,
  contentType,
  level,
  isDiscover,
  progressData,
  showProgress,
  playTeacherAudio = () => {},
  callUpdateLearner,
  disableScreen,
  isShowCase,
  handleBack,
  setEnableNext,
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  rStep,
  vocabCount,
  wordCount,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongAudioIndex, setWrongAudioIndex] = useState(null);
  const [recording, setRecording] = useState("no");
  const navigate = useNavigate();
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const [scale, setScale] = useState(1);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  steps = 1;

  const handleAudioClick = (audioIndex) => {
    setSelectedAudioIndex(audioIndex);
    const currentQuestion = content.L1[currentQuestionIndex];
    const selectedAudio = currentQuestion.audioOptions[audioIndex];

    if (selectedAudio.isCorrect) {
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);
      setWrongAudioIndex(null);
      setTimeout(() => {
        setShowConfetti(false);
        setSelectedAudioIndex(null);
        setRecording("recording");
      }, 3000);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setWrongAudioIndex(audioIndex);
      setTimeout(() => setWrongAudioIndex(null), 2000);
    }
  };

  const handlePlayAudio = (audioIndex) => {
    const currentQuestion = content.L1[currentQuestionIndex];
    const audioOption = currentQuestion.audioOptions[audioIndex];

    const audio = new Audio(audioOption.audio);
    setPlayingAudioIndex(audioIndex);

    audio.play();

    audio.onended = () => {
      setPlayingAudioIndex(null);
    };
  };

  const currentQuestion = content.L1[currentQuestionIndex];

  const flowNames = [...new Set(content.L1.map((item) => item.flowName))];
  const activeFlow = content.L1[currentQuestionIndex]?.flowName || flowNames[0];

  let currentAudio = null;

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m1"}
      parentWords={parentWords}
      flowNames={flowNames}
      activeFlow={activeFlow}
      rStep={rStep}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        playTeacherAudio,
        handleBack,
        disableScreen,
        loading,
        vocabCount,
        wordCount,
      }}
    >
      {currentQuestion ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
            background: "linear-gradient(180deg, #91E7EF 0%, #42C6FF 100%)",
            padding: "16px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {recording === "no" && (
            <>
              {showConfetti && <Confetti />}

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                {[
                  { top: "10%", left: "5%" },
                  { top: "25%", left: "30%" },
                  { top: "10%", left: "55%" },
                  { top: "25%", left: "80%" },
                ].map((pos, index) => (
                  <img
                    key={index}
                    src={Assets.cloudNewImg}
                    alt={`Cloud ${index + 1}`}
                    style={{
                      position: "absolute",
                      width: "150px",
                      height: "auto",
                      ...pos,
                    }}
                  />
                ))}
              </div>

              {/* Display the word */}
              <div
                style={{
                  backgroundColor: "#1897DE",
                  padding: isMobile ? "16px 24px" : "20px 32px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "5px solid #10618E",
                  marginBottom: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: isMobile ? "150px" : "200px",
                }}
              >
                <span
                  style={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: isMobile ? "32px" : "48px",
                    fontFamily: "Quicksand",
                    textAlign: "center",
                  }}
                >
                  {currentQuestion.word}
                </span>
              </div>

              {selectedAudioIndex !== null &&
              currentQuestion.audioOptions[selectedAudioIndex]?.isCorrect ? (
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    marginBottom: "40px",
                  }}
                >
                  <img
                    src={Assets.tickImg}
                    alt="Tick"
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              ) : wrongAudioIndex !== null ? (
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "60%",
                    backgroundColor: "rgba(255, 127, 54, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    border: "4px solid #FFFFFF",
                    marginBottom: "40px",
                  }}
                >
                  <img
                    src={Assets.xImg}
                    alt="Wrong"
                    style={{ width: "25px", height: "25px" }}
                  />
                </div>
              ) : null}

              {/* Audio options */}
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginTop: "24px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {currentQuestion?.audioOptions.map((audioOption, index) => {
                  const isCorrect =
                    selectedAudioIndex === index && audioOption.isCorrect;
                  const isWrong = wrongAudioIndex === index;
                  const isPlaying = playingAudioIndex === index;

                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: isCorrect
                          ? "rgba(117, 209, 0, 0.6)"
                          : isWrong
                          ? "rgba(255, 127, 54, 0.8)"
                          : "#FFFFFF",
                        padding: "16px",
                        borderRadius: "24px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        border:
                          isCorrect || isWrong
                            ? "2px solid rgba(255, 255, 255, 0.5)"
                            : "2px solid rgba(255, 255, 255, 0.5)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(56px)",
                        WebkitBackdropFilter: "blur(56px)",
                        cursor: "pointer",
                        opacity: 1,
                        transition: "background-color 0.3s ease-in-out",
                        minWidth: isMobile ? "100px" : "140px",
                        minHeight: isMobile ? "100px" : "140px",
                      }}
                      onClick={() => {
                        handleAudioClick(index);
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio(index);
                        }}
                        disabled={isPlaying}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          marginBottom: "8px",
                        }}
                      >
                        <img
                          src={
                            isPlaying
                              ? Assets.pauseButtonImg
                              : Assets.playButtonImg
                          }
                          alt="Play Audio"
                          style={{
                            width: isMobile ? "40px" : "50px",
                            height: isMobile ? "40px" : "50px",
                            transform: isPlaying
                              ? `scale(${scale})`
                              : "scale(1)",
                            transition: "transform 0.5s ease-in-out",
                          }}
                        />
                      </button>
                      <span
                        style={{
                          color: isCorrect || isWrong ? "#FFFFFF" : "#666666",
                          fontWeight: 500,
                          fontSize: isMobile ? "12px" : "14px",
                          fontFamily: "Quicksand",
                          textAlign: "center",
                        }}
                      >
                        Sound {index + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {recording === "recording" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "80px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#1897DE",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "5px solid #10618E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "200px",
                }}
              >
                <span
                  style={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "48px",
                    fontFamily: "Quicksand",
                    textAlign: "center",
                  }}
                >
                  {currentQuestion.word}
                </span>
              </div>
              <img
                onClick={() => {
                  setRecording("startRec");
                }}
                src={Assets.pzMic}
                alt="mic"
                style={{ width: "70px", height: "70px", cursor: "pointer" }}
              />
            </div>
          )}
          {recording === "startRec" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "80px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#1897DE",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "5px solid #10618E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "200px",
                }}
              >
                <span
                  style={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    fontSize: "48px",
                    fontFamily: "Quicksand",
                    textAlign: "center",
                  }}
                >
                  {currentQuestion.word}
                </span>
              </div>
              <Box style={{ marginTop: "10px", marginBottom: "10px" }}>
                <RecordVoiceVisualizer />
              </Box>
              <img
                onClick={async () => {
                  const audio = new Audio(correctSound);
                  audio.play();
                  setRecording("no");
                  setPlayingAudioIndex(null);
                  if (currentQuestionIndex === content.L1.length - 1) {
                    // If handleNext prop is provided (e.g., from Practice flow), use it to update progress
                    if (handleNext && typeof handleNext === "function") {
                      // Call handleNext(true) to indicate mechanism is complete and trigger progress update
                      await handleNext(true);
                      return;
                    } else {
                      // Standalone mode - navigate to discover-start
                      setLocalData("rFlow", false);
                      setLocalData("mFail", false);
                      setLocalData("rStep", 0);
                      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                        navigate("/");
                      } else {
                        navigate("/discover-start");
                      }
                    }
                  } else {
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    setSelectedAudioIndex(null);
                  }
                }}
                src={Assets.pause}
                alt="Stop"
                style={{ width: "60px", height: "60px", cursor: "pointer" }}
              />
            </div>
          )}
        </div>
      ) : null}
    </MainLayout>
  );
};

export default WordHuntS1;
