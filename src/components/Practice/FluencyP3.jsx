import React, { useEffect, useState } from "react";
import headerImg from "../../assets/headerImg.svg";
import beardanceImg from "../../assets/beardance.svg";
import Confetti from "react-confetti";
import rabbitImg from "../../assets/rabbit.svg";
import cheetahImg from "../../assets/cheetah.svg";
import tortoiseImg from "../../assets/tortoise.svg";
import meterImg from "../../assets/meterimg.svg";
import MainLayout from "../Layout/MainLayout";
import SafeYouTubePlayer from "../SafeYouTubePlayer";
import SpeedSelector from "../../utils/SpeedSelector";
import { tickImg, nextimg as nextImg } from "../../utils/imageAudioLinks";
import {
  practiceSteps,
  StopButton,
  SpeakButton,
  ListenButton,
  NextButtonRound,
  getLocalData,
  setLocalData,
} from "../../utils/constants";
import { WordRedCircle, RetryIcon } from "../Icons/SvgIcons";
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
import { doubleMetaphone } from "double-metaphone";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import { Log } from "../../services/telemetryService";
import hintimg from "../../assets/hintsicon.svg";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

function CircularTimer({ duration = 3, onComplete, paused }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (paused) return;

    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, paused]);

  return (
    <div
      style={{
        fontWeight: "700",
        fontSize: "36px",
        color: "#FF6600",
        textAlign: "center",
      }}
    >
      {timeLeft > 0 ? timeLeft : null}
    </div>
  );
}
const theme = createTheme();

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
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [yesClicked, setYesClicked] = useState(false);
  const [noClicked, setNoClicked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [randomFinalWord, setRandomFinalWord] = useState({});
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [showWordAfterYes, setShowWordAfterYes] = useState(false);
  const [questionStage, setQuestionStage] = useState(0); // 0 = first question, 1 = second question
  const [currentQuestionWord, setCurrentQuestionWord] = useState("");
  const [open, setOpen] = useState(false);
  const [parentModalOpen, setParentModalOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const wordList = [
    "write",
    "them",
    "they",
    "let",
    "these",
    "words",
    "from",
    "one",
    "which",
    "class",
    "there",
    "water",
    "friend",
    "food",
    "how",
    "like",
    "tree",
    "give",
    "help",
    "very",
    "unit",
    "picture",
    "animal",
    "teacher",
    "house",
    "day",
    "make",
    "said",
    "read",
    "use",
    "activity",
    "after",
    "follow",
    "school",
    "bird",
    "many",
    "question",
    "below",
    "play",
    "why",
    "here",
    "should",
    "sentence",
    "answer",
    "into",
    "observe",
    "plant",
    "small",
    "boy",
    "teeth",
    "new",
    "more",
    "story",
    "lesson",
    "name",
    "game",
    "get",
    "poem",
    "sea",
    "eat",
    "people",
    "down",
    "put",
    "thing",
    "then",
    "place",
  ];

  const [selected, setSelected] = useState(() => {
    const savedSpeed = getLocalData("speed");
    return savedSpeed || "Slow";
  });
  const [showContent, setShowContent] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState("Slow");
  const [startTime, setStartTime] = useState(null);
  const userResponsesRef = React.useRef({ q1: null, q2: null });
  const currentSentenceTextRef = React.useRef("");

  const allSentences = contentSourceData?.map((item) => {
    const sentence = item?.contentSourceData[0]?.text || "";
    const words = sentence?.replace(/[.,!?]/g, "").split(" ");

    return words.map((word, index) => ({
      id: index + 1,
      word,
    }));
  });

  const currentSentence = allSentences[currentSentenceIndex];

  const getSpeedBackground = () => {
    switch (selected) {
      case "Fast":
        return "linear-gradient(to bottom, #e8f4fd, #c2e6ff)";
      case "Medium":
        return "linear-gradient(to bottom, #fff0e6, #ffd9b3)";
      case "Slow":
      default:
        return "linear-gradient(to bottom, #fff7ef, #ffeede)";
    }
  };
  let progressDatas = getLocalData("practiceProgress");
  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  let currentLevel = practiceSteps?.[currentPracticeStep]?.titleNew || "L1";
  let apiLevel = `M${level}-${currentLevel}`;

  if (level >= 4 && level <= 9) {
    currentLevel = practiceSteps?.[currentPracticeStep]?.name;
    apiLevel = `M${level}-${currentLevel}`;
  }

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    const base64Data = "";
    const sentenceText = currentSentenceTextRef.current;

    const { q1, q2 } = userResponsesRef.current;
    const responseText = [
      q1 ? `${q1.word}:${q1.answer}` : "",
      q2 ? `${q2.word}:${q2.answer}` : "",
    ]
      .filter(Boolean)
      .join("|");

    await callTelemetryApi(
      sentenceText,
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      responseText,
      apiLevel
    );
  };
  const startReadingFlow = () => {
    setShowContent(false);
    setCurrentWordIndex(0);
    setShowFinalScreen(false);
    setShowWordAfterYes(false);
    setYesClicked(false);
    setNoClicked(false);
    setQuestionStage(0); // Reset to first question
    setResetTimer(true);
  };
  useEffect(() => {
    let isMounted = true;

    const observer = new MutationObserver(() => {
      if (!isMounted) return;

      const modal =
        document.querySelector(".successHeader") ||
        document.querySelector('img[alt="gameWon"]') ||
        document.querySelector('img[alt="gameLost"]');

      if (modal) {
        setParentModalOpen(true); // Modal OPEN → Timer Must NOT Run
      } else {
        setParentModalOpen(false); // Modal CLOSED → Timer can run
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (showContent) {
      if (currentWordIndex < currentSentence.length - 1) {
        const timer = setTimeout(() => {
          setCurrentWordIndex((prev) => prev + 1);
        }, getWordSpeed());
        return () => clearTimeout(timer);
      } else if (currentWordIndex === currentSentence.length - 1) {
        const lastWordTimer = setTimeout(() => {
          setShowFinalScreen(true);
          // Set the word for first question
          setCurrentQuestionWord(randomFinalWord[currentSentenceIndex]);
        }, getWordSpeed());
        return () => clearTimeout(lastWordTimer);
      }
    }
  }, [showContent, currentWordIndex, currentSentence]);

  const getWordSpeed = () => {
    switch (selected) {
      case "Fast":
        return 500;
      case "Medium":
        return 1000;
      case "Slow":
      default:
        return 1500;
    }
  };

  const handleStop = () => {
    //if (!startTime) return;
    const duration = (Date.now() - startTime) / 1000;
    console.log("time taken........", duration);

    if (duration <= 10) {
      setReadingSpeed("Fast");
    } else if (duration <= 20) {
      setReadingSpeed("Medium");
    } else {
      setReadingSpeed("Slow");
    }
  };

  useEffect(() => {
    if (currentSentence && currentSentence.length > 0) {
      setRandomFinalWord((prev) => {
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

  useEffect(() => {
    if (getLocalData("speed")) {
      startReadingFlow();
    }
  }, []);

  const handleSpeedSelect = (speedValue) => {
    setSelected(speedValue);
    setLocalData("speed", speedValue);
    startReadingFlow();
  };

  // YES click - FIXED: Always show word with tick for both questions
  const handleYesClick = () => {
    setYesClicked(true);
    setNoClicked(false);

    if (questionStage === 0) {
      userResponsesRef.current.q1 = {
        word: currentQuestionWord,
        answer: "yes",
      };
    } else {
      userResponsesRef.current.q2 = {
        word: currentQuestionWord,
        answer: "yes",
      };
    }

    if (questionStage === 0) {
      // ✅ First question YES = Correct
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setShowWordAfterYes(true); // show tick + next
        setYesClicked(false);
      }, 1500);
    } else {
      // ❌ Second question YES = Wrong
      const audio = new Audio(wrongSound);
      audio.play();

      // FIX: Still show the word with tick even for wrong answer
      setTimeout(() => {
        setShowWordAfterYes(true); // show tick + next
        setYesClicked(false);
      }, 1000);
    }
  };

  // NO click - FIXED: Always show word with tick for both questions
  const handleNoClick = () => {
    setNoClicked(true);
    setYesClicked(false);

    if (questionStage === 0) {
      userResponsesRef.current.q1 = { word: currentQuestionWord, answer: "no" };
    } else {
      userResponsesRef.current.q2 = { word: currentQuestionWord, answer: "no" };
    }

    if (questionStage === 0) {
      // ❌ First question NO = Wrong
      const audio = new Audio(wrongSound);
      audio.play();

      // FIX: Still show the word with tick even for wrong answer
      setTimeout(() => {
        setShowWordAfterYes(true); // show tick + next
        setNoClicked(false);
      }, 1000);
    } else {
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setShowWordAfterYes(true);
        setNoClicked(false);
      }, 1500);
    }
  };

  const handleNextWord = () => {
    setShowWordAfterYes(false);
    setYesClicked(false);
    setNoClicked(false);

    if (questionStage === 0) {
      // Move directly to 2nd question
      setQuestionStage(1);
      setShowContent(false);
      const wordIndex = currentSentenceIndex % wordList.length;
      setCurrentQuestionWord(wordList[wordIndex]);
    } else {
      // Move to next sentence or show results
      currentSentenceTextRef.current =
        currentSentence?.map((wordObj) => wordObj.word).join(" ") || "";
      setShowFinalScreen(false);
      setShowWordAfterYes(false);
      setIsTransitioning(true);
      setShowResultScreen(true);

      if (currentSentenceIndex + 1 < allSentences.length) {
        handleStop();
        setCurrentSentenceIndex((prev) => prev + 1);
        setQuestionStage(0);

        setTimeout(() => {
          startReadingFlow();
          setIsTransitioning(false);
        }, 800);
      } else {
        currentSentenceTextRef.current =
          currentSentence?.map((wordObj) => wordObj.word).join(" ") || "";
        setShowResultScreen(true);
        setIsTransitioning(false);
      }
    }
  };

  const handleRetry = () => {
    startReadingFlow();
  };

  // Helper function to render bear animation with correct positioning
  const renderBearAnimation = () => {
    // First question: Bear appears for YES (centered)
    if (yesClicked && questionStage === 0) {
      return (
        <img
          src={beardanceImg}
          alt="Beardance"
          style={{
            position: "absolute",
            bottom: isMobile ? "0px" : "-42px",
            left: "50%",
            transform: "translateX(-50%)",
            height: isMobile ? "100px" : "200px",
            animation: "jump 1.3s ease-in-out infinite",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1000,
          }}
          draggable={false}
        />
      );
    }

    // Second question: Bear appears for NO (centered)
    if (noClicked && questionStage === 1) {
      return (
        <img
          src={beardanceImg}
          alt="Beardance"
          style={{
            position: "absolute",
            bottom: isMobile ? "0px" : "-42px",
            left: "50%",
            transform: "translateX(-50%)",
            height: isMobile ? "100px" : "200px",
            animation: "jump 1.3s ease-in-out infinite",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 1000,
          }}
          draggable={false}
        />
      );
    }

    return null;
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "12px 0 16px" : "20px 0 28px",
          boxSizing: "border-box",
        }}
      >
        {/* Modal */}
        {open && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 11000,
            }}
          >
            <div
              style={{
                position: "relative",
                background: "#000",
                padding: "10px",
                borderRadius: "12px",
                maxWidth: "90%",
                width: "900px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

              <SafeYouTubePlayer
                videoId="GHwG9fOChYU"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>
        )}
        <div
          style={{
            width: isMobile ? "calc(100% - 20px)" : "95%",
            minHeight: isMobile ? "unset" : "70vh",
            height: isMobile ? "calc(100dvh - 280px)" : "auto",
            maxHeight: isMobile ? "calc(100dvh - 280px)" : "none",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: isMobile ? "0 10px 16px 10px" : "0 0 10px 0",
            marginBottom: isMobile ? "30px" : undefined,
            marginLeft: isMobile ? "10px" : "auto",
            marginRight: isMobile ? "10px" : "auto",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <img
            src={hintimg}
            alt="hint"
            style={{
              width: isMobile ? "40px" : "50px",
              height: isMobile ? "40px" : "50px",
              position: "absolute",
              top: isMobile ? "30px" : "20px",
              left: "10px",
              cursor: "pointer",
              zIndex: 1000,
            }}
            onClick={() => setOpen(true)}
          />

          <img
            src={headerImg}
            alt="header"
            style={{
              width: isMobile ? "calc(100% + 20px)" : "100%",
              // marginLeft: isMobile ? "-10px" : "0",
              // marginRight: isMobile ? "-10px" : "0",
              display: "block",
              borderRadius: "12px 12px 0 0",
            }}
          />

          {showResultScreen ? (
            <div
              style={{
                marginTop: isMobile ? "40px" : "8px",
                marginBottom: isMobile ? "5px" : "8px",
                textAlign: "center",
                flex: 1,
                position: "relative",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 0,
                maxHeight: "100%",
              }}
            >
              {/* Top Title Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isMobile ? "4px" : "8px",
                  marginBottom: isMobile ? "2px" : "8px",
                }}
              >
                <img
                  src={meterImg}
                  alt="speed meter"
                  style={{
                    width: isMobile ? "30px" : isTablet ? "35px" : "40px",
                  }}
                />

                <h2
                  style={{
                    fontSize: isMobile ? "14px" : isTablet ? "18px" : "20px",
                    fontWeight: "600",
                    color: "#333F61",
                    margin: 0,
                  }}
                >
                  Your overall reading speed
                </h2>
              </div>

              {/* Meter Items */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "stretch",
                  gap: isMobile ? "6px" : "15px",
                  flexWrap: isMobile ? "wrap" : "nowrap",
                  marginBottom: isMobile ? "5px" : "8px",
                }}
              >
                {[
                  { label: "Slow", img: tortoiseImg, alt: "tortoise" },
                  { label: "Medium", img: rabbitImg, alt: "rabbit" },
                  { label: "Fast", img: cheetahImg, alt: "cheetah" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: isMobile ? "6px" : "10px",
                      borderRadius: "10px",
                      background:
                        readingSpeed === item.label ? "#fff7e6" : "#f9f9f9",
                      border:
                        readingSpeed === item.label
                          ? "1px solid #ff9900"
                          : "1px solid #ddd",
                      opacity: readingSpeed === item.label ? 1 : 0.5,
                      width: isMobile ? "115px" : "150px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? "90px" : "120px",
                        height: isMobile ? "70px" : "95px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.alt}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        marginTop: "4px",
                        fontWeight: "600",
                        fontSize: isMobile ? "13px" : "14px",
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <img
                src={nextImg}
                alt="next"
                role="button"
                tabIndex={0}
                onClick={() => {
                  callTelemetry();
                  handleNext();
                  setReadingSpeed("Slow");
                  setStartTime(null);
                  setShowResultScreen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    e.currentTarget.click();
                }}
                style={{
                  marginTop: isMobile ? "5px" : "8px",
                  marginBottom: isMobile ? "5px" : "8px",
                  width: isMobile ? "38px" : "42px",
                  cursor: "pointer",
                  alignSelf: "center",
                }}
              />
            </div>
          ) : showWordAfterYes ? (
            <div
              style={{
                marginTop: isMobile ? "20px" : "10px",
                textAlign: "center",
                flex: 1,
                position: "relative",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: isMobile ? "20px" : "40px",
              }}
            >
              <div
                style={{
                  flex: isMobile ? 1 : undefined,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  marginBottom: isMobile ? "0px" : "60px",
                }}
              >
                <img
                  src={tickImg}
                  alt="Correct"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                />

                <div
                  style={{
                    fontWeight: "700",
                    fontSize: isMobile ? "28px" : isTablet ? "36px" : "42px",
                    color: "rgba(51, 63, 97, 1)",
                    textAlign: "center",
                  }}
                >
                  {currentQuestionWord}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "40px",
                  marginTop: "20px",
                }}
              >
                <div
                  onClick={handleRetry}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <RetryIcon
                    height={50}
                    width={50}
                    style={{ cursor: "pointer" }}
                    onClick={handleRetry}
                  />
                </div>

                <div
                  onClick={handleNextWord}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      e.currentTarget.click();
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src={nextImg}
                    alt="Next"
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : !showFinalScreen && !showContent ? (
            <div
              style={{
                flex: isMobile ? 1 : undefined,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  marginTop: isMobile ? "0px" : "40px",
                  width: isMobile ? "92%" : "80%",
                  maxWidth: isMobile ? "none" : "500px",
                  minHeight: isMobile ? "72px" : "100px",
                  height: "auto",
                  border: "1px dashed rgba(241, 153, 32, 1)",
                  borderRadius: "18px",
                  background: "rgba(255, 102, 0, 0.05)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: isMobile ? "10px 12px" : "20px",
                  overflow: "hidden",
                }}
              >
                <CircularTimer
                  key={resetTimer ? `timer-${Date.now()}` : "timer"}
                  duration={3}
                  paused={parentModalOpen}
                  onComplete={() => {
                    if (parentModalOpen) return;
                    userResponsesRef.current = { q1: null, q2: null };
                    setReadingSpeed("Slow");
                    setStartTime(Date.now());
                    setShowContent(true);
                    setResetTimer(false);
                  }}
                />
              </div>
            </div>
          ) : !showFinalScreen ? (
            <div
              style={{
                flex: isMobile ? 1 : undefined,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: isMobile ? "92%" : "90%",
                  maxWidth: isMobile ? "none" : "720px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: isMobile ? 0 : "24px",
                  marginTop: isMobile ? "0px" : "40px",
                  marginBottom: isMobile ? "10px" : "20px",
                }}
              >
                <div
                  style={{
                    flex: isMobile ? undefined : 1,
                    width: isMobile ? "100%" : undefined,
                    minHeight: isMobile ? "72px" : "100px",
                    height: "auto",
                    marginTop: "0px",
                    border: "1px dashed rgba(241, 153, 32, 1)",
                    borderRadius: "18px",
                    background: "rgba(255, 102, 0, 0.05)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: isMobile ? "10px 12px" : "20px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: isMobile ? "22px" : "28px",
                      color: "rgba(51, 63, 97, 1)",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentSentence[currentWordIndex]?.word}
                  </div>
                </div>
                {!isMobile && (
                  <div style={{ flexShrink: 0, paddingTop: "8px" }}>
                    <SpeedSelector
                      onSelect={handleSpeedSelect}
                      selected={selected}
                    />
                  </div>
                )}
              </div>
              {isMobile && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <SpeedSelector
                    onSelect={handleSpeedSelect}
                    selected={selected}
                    horizontal
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                flex: isMobile ? 1 : undefined,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: isMobile ? "0px" : "40px",
                paddingBottom: isMobile ? "16px" : "40px",
                textAlign: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "18px" : isTablet ? "24px" : "32px",
                  fontWeight: "600",
                  color: "#333F61",
                  marginBottom: "20px",
                }}
              >
                Did you see the word?
              </div>

              <div
                style={{
                  fontSize: isMobile ? "28px" : isTablet ? "34px" : "40px",
                  fontWeight: "700",
                  color: "#FF6600",
                  marginBottom: isMobile ? "30px" : "64px",
                }}
              >
                {currentQuestionWord}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: isMobile ? "20px" : "40px",
                  marginTop: isMobile ? "15px" : isTablet ? "30px" : "50px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <button
                  onClick={handleNoClick}
                  disabled={yesClicked || noClicked}
                  style={{
                    padding: isMobile
                      ? "10px 20px"
                      : isTablet
                      ? "12px 40px"
                      : "14px 54px",
                    fontSize: isMobile ? "18px" : isTablet ? "22px" : "26px",

                    borderRadius: "12px",
                    border:
                      noClicked && questionStage === 1
                        ? "1px solid rgba(88, 204, 2, 1)"
                        : noClicked && questionStage === 0
                        ? "1px solid rgba(255, 127, 54, 1)"
                        : "1px solid #ccc",
                    background: "#fff",
                    cursor: yesClicked || noClicked ? "not-allowed" : "pointer",
                    color:
                      noClicked && questionStage === 1
                        ? "rgba(88, 204, 2, 1)"
                        : noClicked && questionStage === 0
                        ? "rgba(255, 127, 54, 1)"
                        : "inherit",
                    fontWeight: noClicked ? "700" : "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                    opacity: (yesClicked || noClicked) && !noClicked ? 0.5 : 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color:
                        noClicked && questionStage === 1
                          ? "rgba(88, 204, 2, 1)"
                          : noClicked && questionStage === 0
                          ? "rgba(255, 127, 54, 1)"
                          : "#888",
                    }}
                  >
                    ✖
                  </span>
                  No
                </button>

                <button
                  onClick={handleYesClick}
                  disabled={yesClicked || noClicked}
                  style={{
                    padding: isMobile
                      ? "10px 20px"
                      : isTablet
                      ? "12px 40px"
                      : "14px 54px",
                    fontSize: isMobile ? "18px" : isTablet ? "22px" : "26px",

                    borderRadius: "12px",
                    border:
                      yesClicked && questionStage === 0
                        ? "1px solid rgba(88, 204, 2, 1)"
                        : yesClicked && questionStage === 1
                        ? "1px solid rgba(255, 127, 54, 1)"
                        : "1px solid #ccc",
                    background: "#fff",
                    cursor: yesClicked || noClicked ? "not-allowed" : "pointer",
                    color:
                      yesClicked && questionStage === 0
                        ? "rgba(88, 204, 2, 1)"
                        : yesClicked && questionStage === 1
                        ? "rgba(255, 127, 54, 1)"
                        : "inherit",
                    fontWeight: yesClicked ? "700" : "normal",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                    opacity: (yesClicked || noClicked) && !yesClicked ? 0.5 : 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color:
                        yesClicked && questionStage === 0
                          ? "rgba(88, 204, 2, 1)"
                          : yesClicked && questionStage === 1
                          ? "rgba(255, 127, 54, 1)"
                          : "#888",
                    }}
                  >
                    ✔
                  </span>
                  Yes
                </button>
              </div>
            </div>
          )}

          {/* Bear anchored to white container so it never overlaps the buttons */}
          {renderBearAnimation()}
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
