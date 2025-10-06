import React, { useEffect, useState } from "react";
import headerImg from "../../assets/headerImg.svg";
import beardanceImg from "../../assets/beardance.svg";
import Confetti from "react-confetti";
import rabbitImg from "../../assets/rabbit.svg";
import cheetahImg from "../../assets/cheetah.svg";
import tortoiseImg from "../../assets/tortoise.svg";
import meterImg from "../../assets/meterimg.svg";
import MainLayout from "../Layouts.jsx/MainLayout";
import {
  practiceSteps,
  WordRedCircle,
  StopButton,
  SpeakButton,
  ListenButton,
  NextButtonRound,
  RetryIcon,
  getLocalData,
  setLocalData,
} from "../../utils/constants";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import RecordVoiceVisualizer from "../../utils/RecordVoiceVisualizer";
import Joyride from "react-joyride";
import LanguageModalNew from "../../utils/LanguageModal";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";
import AudioTooltipModal from "./AudioTooltipModal";
import { loadTranscriber } from "../../utils/transcriber";
import { doubleMetaphone } from "double-metaphone";
import nextImg from "../../assets/nextImg.svg";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";

const FluencyP3 = ({
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
  vocabCount,
  wordCount,
  multilingual,
  contentSourceData,
}) => {
  steps = 1;

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [yesClicked, setYesClicked] = useState(false);
  const [noClicked, setNoClicked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [randomFinalWord, setRandomFinalWord] = useState({});
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);

  const allSentences = contentSourceData?.map((item) => {
    const sentence = item?.contentSourceData[0]?.text || "";
    const words = sentence?.replace(/[.,!?]/g, "").split(" ");

    return words.map((word, index) => ({
      id: index + 1,
      word,
    }));
  });

  const currentSentence = allSentences[currentSentenceIndex];

  // word cycle
  useEffect(() => {
    if (
      !showFinalScreen &&
      !showResultScreen &&
      currentWordIndex < currentSentence.length - 1
    ) {
      const timer = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (
      !showFinalScreen &&
      !showResultScreen &&
      currentWordIndex === currentSentence.length - 1
    ) {
      const lastWordTimer = setTimeout(() => {
        setShowFinalScreen(true);
      }, 1000);
      return () => clearTimeout(lastWordTimer);
    }
  }, [
    currentWordIndex,
    showFinalScreen,
    showResultScreen,
    currentSentence.length,
  ]);

  useEffect(() => {
    if (currentSentence && currentSentence.length > 0) {
      setRandomFinalWord((prev) => {
        // if already set for this index, return as is
        if (prev[currentSentenceIndex]) {
          return prev;
        }

        const randomIndex = Math.floor(Math.random() * currentSentence.length);
        const randomWord = currentSentence[randomIndex]?.word;

        return {
          ...prev,
          [currentSentenceIndex]: randomWord,
        };
      });
    }
  }, [currentSentence, currentSentenceIndex]);

  console.log("randomFinalWord:", randomFinalWord, currentSentence);

  const handleYesClick = () => {
    setYesClicked(true);
    setNoClicked(false);
    setShowConfetti(true);
    const audio = new Audio(correctSound);
    audio.play();

    setTimeout(() => {
      if (currentSentenceIndex + 1 < allSentences.length) {
        setCurrentSentenceIndex((prev) => prev + 1);
      } else {
        setShowResultScreen(true);
      }
      if (currentSentenceIndex > 0) {
        handleNext();
      }
      setShowConfetti(false);
      setYesClicked(false);
      setShowFinalScreen(false);
      setCurrentWordIndex(0);
      //setRandomFinalWord("");
    }, 2000);
  };

  const handleNoClick = () => {
    setNoClicked(true);
    setYesClicked(false);
    const audio = new Audio(wrongSound);
    audio.play();

    setTimeout(() => {
      setNoClicked(false);
    }, 2000);
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m7"}
      answer={"answer"}
      isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      recAudio={"recAudio"}
      isCorrect={true}
      lang={"language"}
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
      <div
        style={{
          width: "100%",
          //height: "100vh",
          background: "linear-gradient(to bottom, #fff7ef, #ffeede)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "1200px",
            //height: "500px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0px 20px 20px 20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ width: "103.2%" }}>
            <img
              src={headerImg}
              alt="header"
              style={{ width: "100%", borderRadius: "12px 12px 0 0" }}
            />
          </div>

          {showResultScreen ? (
            <div
              style={{
                marginTop: "40px",
                textAlign: "center",
                flex: 1,
                position: "relative",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  marginBottom: "40px",
                }}
              >
                <img
                  src={meterImg}
                  alt="speed meter"
                  style={{ width: "50px" }}
                />
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "600",
                    color: "#333F61",
                    margin: 0,
                  }}
                >
                  Your overall reading speed
                </h2>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "40px",
                }}
              >
                <div
                  style={{
                    padding: "30px",
                    borderRadius: "12px",
                    background: "#f9f9f9",
                    border: "1px solid #ddd",
                    opacity: 0.5,
                  }}
                >
                  <img src={tortoiseImg} alt="tortoise" height={80} />
                  <div style={{ marginTop: "10px", fontWeight: "600" }}>
                    Slow
                  </div>
                </div>

                <div
                  style={{
                    padding: "30px",
                    borderRadius: "12px",
                    background: "#fff7e6",
                    border: "1px solid #ff9900",
                  }}
                >
                  <img src={rabbitImg} alt="rabbit" height={80} />
                  <div style={{ marginTop: "10px", fontWeight: "600" }}>
                    Medium
                  </div>
                </div>

                <div
                  style={{
                    padding: "30px",
                    borderRadius: "12px",
                    background: "#f9f9f9",
                    border: "1px solid #ddd",
                    opacity: 0.5,
                  }}
                >
                  <img src={cheetahImg} alt="cheetah" height={80} />
                  <div style={{ marginTop: "10px", fontWeight: "600" }}>
                    Fast
                  </div>
                </div>
              </div>

              <img
                src={nextImg}
                alt="next"
                onClick={() => {
                  handleNext();
                }}
                style={{
                  marginTop: "20px",
                  width: "50px",
                  cursor: "pointer",
                }}
              />
            </div>
          ) : !showFinalScreen ? (
            <div
              style={{
                marginTop: "40px",
                width: "80%",
                maxWidth: "500px",
                height: "100px",
                border: "1px dashed rgba(241, 153, 32, 1)",
                borderRadius: "18px",
                background: "rgba(255, 102, 0, 0.05)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "28px",
                  color: "rgba(51, 63, 97, 1)",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {currentSentence[currentWordIndex]?.word}
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: "40px",
                textAlign: "center",
                flex: 1,
                position: "relative",
                width: "100%",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "600",
                  color: "#333F61",
                  marginBottom: "20px",
                }}
              >
                Did you see the word ?
              </div>

              <div
                style={{
                  fontSize: "40px",
                  fontWeight: "700",
                  color: "#FF6600",
                  marginBottom: "64px",
                }}
              >
                {randomFinalWord[currentSentenceIndex]}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "40px",
                  marginTop: "120px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <button
                  onClick={handleNoClick}
                  style={{
                    padding: "14px 54px",
                    fontSize: "26px",
                    borderRadius: "12px",
                    border: noClicked
                      ? "1px solid rgba(255, 127, 54, 1)"
                      : "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                    color: noClicked ? "rgba(255, 127, 54, 1)" : "inherit",
                    fontWeight: noClicked ? "700" : "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: noClicked ? "rgba(255, 127, 54, 1)" : "#888",
                    }}
                  >
                    ✖
                  </span>
                  No
                </button>

                <button
                  onClick={handleYesClick}
                  style={{
                    padding: "14px 54px",
                    fontSize: "26px",
                    borderRadius: "12px",
                    border: yesClicked
                      ? "1px solid rgba(88, 204, 2, 1)"
                      : "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                    color: yesClicked ? "rgba(88, 204, 2, 1)" : "inherit",
                    fontWeight: yesClicked ? "700" : "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: yesClicked ? "rgba(88, 204, 2, 1)" : "#888",
                    }}
                  >
                    ✔
                  </span>
                  Yes
                </button>
              </div>

              {yesClicked && (
                <img
                  src={beardanceImg}
                  alt="Beardance"
                  style={{
                    position: "absolute",
                    bottom: -42,
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: "200px",
                    animation: "jump 1.3s ease-in-out infinite",
                    userSelect: "none",
                    pointerEvents: "none",
                    zIndex: 1000,
                  }}
                  draggable={false}
                />
              )}

              {noClicked && (
                <img
                  src={beardanceImg}
                  alt="Beardance"
                  style={{
                    position: "absolute",
                    bottom: -42,
                    left: "10%",
                    transform: "translateX(-50%)",
                    height: "200px",
                    animation: "jump 1.3s ease-in-out infinite",
                    userSelect: "none",
                    pointerEvents: "none",
                    zIndex: 1000,
                  }}
                  draggable={false}
                />
              )}
            </div>
          )}
        </div>

        {showConfetti && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}

        <style>{`
        @keyframes jump {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-20px);
          }
        }
      `}</style>
      </div>
    </MainLayout>
  );
};

export default FluencyP3;
