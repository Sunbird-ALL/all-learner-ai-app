import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import headerImg from "../../assets/headerImg.svg";
import pauseImg from "../../assets/pauseImg.svg";
import graphImg from "../../assets/graphImg.svg";
import beardanceImg from "../../assets/beardance.svg";
import { nextimg as nextImg } from "../../utils/imageAudioLinks";
import listenImg from "../../assets/listenImg.svg";
import LanguageHint from "../../assets/laguagehint.svg";
import paraudio from "../../assets/parrotR1KanAudio.wav";
import SpeedSelector from "../../utils/SpeedSelector";
import MainLayout from "../Layout/MainLayout";
import SafeYouTubePlayer from "../SafeYouTubePlayer";
import hintimg from "../../assets/hintsicon.svg";

import {
  practiceSteps,
  StopButton,
  SpeakButton,
  ListenButton,
  NextButtonRound,
  getLocalData,
  setLocalData,
  getBrowserLanguage,
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
import { doubleMetaphone } from "double-metaphone";
import correctSound from "../../assets/correct.wav";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
const sentencesData = [
  {
    id: 1,
    sentence: "The cow eats grass",
    underlinedWords: ["cow", "grass"],
    hints: {
      cow: paraudio,
      grass: paraudio,
    },
  },
];

function CircularTimer({ duration = 3, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onComplete]);

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

const FluencyP2 = ({
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
  const whiteContainerRef = useRef(null);
  const sentenceRef = useRef(null);
  const audioRef = useRef(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showBearDance, setShowBearDance] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFinalState, setShowFinalState] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [hintPosition, setHintPosition] = useState({ x: 0, y: 0 });
  const [showReadingSpeed, setShowReadingSpeed] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const audioRefs = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selected, setSelected] = useState("Slow");
  const [speed, setSpeed] = useState(getLocalData("speed"));
  const [resetTimer, setResetTimer] = useState(false);
  const [hasSpeedBeenSelected, setHasSpeedBeenSelected] = useState(
    !!getLocalData("speed")
  );
  const [animationKey, setAnimationKey] = useState(0);
  const lang = getLocalData("lang");
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const transcriptRef = useRef("");
  const recordingStartTimeRef = useRef(null);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const startRecording = () => {
    resetTranscript();
    recordingStartTimeRef.current = new Date().getTime();
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: getBrowserLanguage(lang),
    });
  };

  // Debug log to check data structure
  console.log("FluencyP2 - contentSourceData:", contentSourceData);

  // Get multilingual language code for audio (maps nativeLang to multilingual object keys)
  const getMultilingualLangCode = () => {
    const nativeLang = getLocalData("nativeLang");
    const langCodeMap = {
      ka: "kn", // Kannada (from LanguageModal -> multilingual key)
      kn: "kn", // Kannada (from AllLanguages)
      tn: "ta", // Tamil (from LanguageModal -> multilingual key)
      ta: "ta", // Tamil (from AllLanguages)
      te: "te", // Telugu
      hi: "hi", // Hindi
      gu: "gu", // Gujarati
      or: "or", // Odia
    };
    return langCodeMap[nativeLang] || "kn"; // Default to Kannada if not found
  };
  const multilingualLangCode = getMultilingualLangCode();

  const sentencesData = [
    {
      id: 1,
      sentence: contentSourceData?.text || "",
      audio: contentSourceData?.audioUrl || "",
      underlinedWords: parentWords ? Object.keys(parentWords) : [],
      hints: parentWords
        ? Object.fromEntries(
            Object.entries(parentWords).map(([word, data]) => [
              word,
              data?.[multilingualLangCode]?.audio_url || "",
            ])
          )
        : {},
    },
  ];

  const currentSentence = sentencesData[currentSentenceIndex];

  useEffect(() => {
    if (getLocalData("speed")) {
      startReadingFlow();
    }
  }, []);

  const startReadingFlow = () => {
    setShowContent(false);
    setShowSentence(false);
    setAnimationCompleted(false);
    setPaused(false);
    setShowBearDance(false);
    setShowConfetti(false);
    setShowFinalState(false);
    setHoveredWord(null);
    setAnimationKey((prev) => prev + 1); // Reset animation key

    setResetTimer(true);
  };

  useEffect(() => {
    if (showContent) {
      setTimeout(() => {
        setShowSentence(true);
      }, 200);
    }
  }, [showContent]);

  const handleAnimationComplete = () => {
    SpeechRecognition.stopListening();
    setAnimationCompleted(true);
    setShowBearDance(true);
    setShowConfetti(false);

    setTimeout(() => {
      setShowConfetti(false);
      setShowFinalState(true);
      setShowBearDance(false);
    }, 3000);
  };

  const handlePauseClick = () => {
    SpeechRecognition.stopListening();
    setPaused(true);
    setAnimationCompleted(true);
    setShowBearDance(true);
    setShowConfetti(true);
    const audio = new Audio(correctSound);
    audio.play();

    setTimeout(() => {
      setShowConfetti(false);
      setShowFinalState(true);
      setShowBearDance(false);
    }, 3000);
  };

  const handleNextClick = (e) => {
    e.stopPropagation();
    handleReadingSpeedNext();
  };

  const handleRetryClick = (e) => {
    e.stopPropagation();
    SpeechRecognition.stopListening();
    resetTranscript();
    startReadingFlow();
  };

  const playWordAudio = (audio) => {
    console.log("playWordAudio called with:", audio, audioRefs.current);

    if (!audio || !audioRefs.current) return;

    if (!audioRefs.current.paused) {
      console.log("Already playing, skipping...");
      return;
    }

    audioRefs.current.src = audio;
    audioRefs.current.currentTime = 0;
    audioRefs.current
      .play()
      .then(() => {
        setIsPlaying(true);
        console.log("Playing word audio once:", audio);
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
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
    const responseStartTime =
      recordingStartTimeRef.current || new Date().getTime();
    const base64Data = "";

    await callTelemetryApi(
      currentSentence?.sentence,
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      transcriptRef.current || "",
      apiLevel
    );
  };
  const handleAudioEnd = () => {
    if (audioRefs.current) {
      audioRefs.current.pause();
      audioRefs.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleReadingSpeedNext = () => {
    setLocalData("speed", selected);
    SpeechRecognition.stopListening();
    callTelemetry();
    handleNext();
    setShowReadingSpeed(false);
    setShowContent(false);
    setShowSentence(false);
    setAnimationCompleted(false);
    setPaused(false);
    setShowBearDance(false);
    setShowConfetti(false);
    setShowFinalState(false);
    setHoveredWord(null);

    setCurrentSentenceIndex(
      (prevIndex) => (prevIndex + 1) % sentencesData.length
    );
  };

  const handleSpeedSelect = (speedValue) => {
    setSelected(speedValue);
    setHasSpeedBeenSelected(true);
    setLocalData("speed", speedValue);

    startReadingFlow();
  };

  const handleWordHover = (word, event) => {
    if (
      event.target.classList.contains("underlined-word") &&
      currentSentence.underlinedWords.includes(word)
    ) {
      // only update if hovered word changed
      if (hoveredWord !== word) {
        setHoveredWord(word);

        const rect = event.target.getBoundingClientRect();
        const containerRect = whiteContainerRef.current.getBoundingClientRect();

        setHintPosition({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.bottom - containerRect.top + 5,
        });

        if (showFinalState && currentSentence.hints[word]) {
          playWordAudio(
            `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/multilingual_audios/${currentSentence.hints[word]}`
          );
        }
      }
    }
  };

  const handleWordClick = (word, event) => {
    if (
      event.target.classList.contains("underlined-word") &&
      currentSentence.underlinedWords.includes(word) &&
      currentSentence.hints[word]
    ) {
      playWordAudio(
        `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/multilingual_audios/${currentSentence.hints[word]}`
      );
    }
  };

  const handleWordLeave = () => {
    setHoveredWord(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const renderUnderlinedText = (text, underlinedWords) => {
    const words = text.split(" ");
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:"]/g, "");
      const isUnderlined = underlinedWords.includes(cleanWord);

      if (isUnderlined) {
        return (
          <span
            key={index}
            className="underlined-word"
            style={{
              textDecoration: "underline",
              textDecorationColor: "rgba(255, 127, 54, 0.5)",
              textUnderlineOffset: "3px",
              marginRight: "6px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => handleWordHover(cleanWord, e)}
            onMouseLeave={handleWordLeave}
            onClick={(e) => handleWordClick(cleanWord, e)}
          >
            {word}
          </span>
        );
      } else {
        return (
          <span key={index} style={{ marginRight: "6px" }}>
            {word}
          </span>
        );
      }
    });
  };

  // Get animation duration based on selected speed
  const getAnimationDuration = () => {
    if (selected === "Fast") return "5s";
    if (selected === "Medium") return "10s";
    return "15s";
  };

  const renderReadingScreen = () => (
    <div
      className="whiteContainer"
      style={{
        width: "90%",
        minHeight: isMobile ? "450px" : "560px",
        height: "auto",
        maxWidth: "1200px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0",
        position: "relative",
        overflow: "visible",
      }}
    >
      <img
        src={hintimg}
        alt="hint"
        style={{
          width: "50px",
          height: "50px",
          position: "absolute",
          top: "20px",
          left: "20px",
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      />

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
              videoId="cA_ktIQzHkU"
              style={{ borderRadius: "8px" }}
            />
          </div>
        </div>
      )}
      <audio ref={audioRefs} onEnded={handleAudioEnd} hidden />

      <img
        src={headerImg}
        alt="header"
        style={{
          width: "100%",
          display: "block",
          borderRadius: "12px 12px 0 0",
        }}
      />

      <div
        ref={whiteContainerRef}
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Row wrapper: on desktop/tablet the sentence box and SpeedSelector sit side-by-side
          so the selector always aligns with the box regardless of what is rendered below */}
        <div
          style={{
            width: isMobile ? "92%" : "90%",
            maxWidth: isMobile ? "none" : "720px",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: isMobile ? 0 : "24px",
            marginTop: isMobile ? "60px" : "48px",
            marginBottom: isMobile ? "10px" : "20px",
          }}
        >
          {/* Sentence box */}
          <div
            style={{
              flex: isMobile ? undefined : 1,
              width: isMobile ? "100%" : undefined,
              minHeight: isMobile ? "72px" : "112px",
              height: "auto",
              border: "2px dashed #FF6600",
              borderRadius: "18px",
              background: "rgba(255, 102, 0, 0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: isMobile ? "10px 12px" : "10px 20px",
              position: "relative",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {!showContent ? (
              <CircularTimer
                key={resetTimer ? `timer-${Date.now()}` : "timer"}
                duration={3}
                onComplete={() => {
                  setShowContent(true);
                  setResetTimer(false);
                  startRecording();
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  minHeight: isMobile ? "44px" : "72px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems:
                    showFinalState || showBearDance ? "center" : "center",
                  position: "relative",
                  overflow:
                    showFinalState || showBearDance ? "visible" : "hidden",
                  padding: showFinalState || showBearDance ? "8px 0" : "0",
                }}
              >
                <div
                  ref={sentenceRef}
                  key={animationKey}
                  style={{
                    fontWeight: "700",
                    fontSize: isMobile
                      ? showFinalState || showBearDance
                        ? "16px"
                        : "18px"
                      : showFinalState || showBearDance
                      ? "26px"
                      : "30px",
                    lineHeight: 1.45,
                    color: "rgba(51, 63, 97, 1)",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap:
                      showFinalState || showBearDance ? "wrap" : "nowrap",
                    position:
                      showFinalState || showBearDance ? "relative" : "absolute",
                    left:
                      showFinalState || showBearDance
                        ? "0"
                        : paused
                        ? "50%"
                        : "100%",
                    transform:
                      showFinalState || showBearDance || paused
                        ? "none"
                        : "translateX(-50%)",
                    animation:
                      showSentence && !paused && !showFinalState
                        ? `scrollText ${getAnimationDuration()} linear infinite`
                        : "none",
                    whiteSpace:
                      showFinalState || showBearDance ? "normal" : "nowrap",
                    wordBreak: "break-word",
                    width: showFinalState || showBearDance ? "100%" : "auto",
                  }}
                >
                  {showFinalState && (
                    <img
                      src={listenImg}
                      onClick={() => {
                        playWordAudio(
                          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
                        );
                      }}
                      alt="listen"
                      style={{
                        width: "35px",
                        height: "35px",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                  {showFinalState
                    ? renderUnderlinedText(
                        currentSentence.sentence,
                        currentSentence.underlinedWords
                      )
                    : currentSentence.sentence}
                </div>

                {/* CSS Animation */}
                <style>
                  {`
                @keyframes scrollText {
                  0% {
                    left: 100%;
                  }
                  100% {
                    left: -100%;
                  }
                }
              `}
                </style>
              </div>
            )}
          </div>
          {/* end sentence box */}

          {/* Desktop / tablet: SpeedSelector flows inline as flex sibling of sentence box */}
          {!showFinalState && !isMobile && (
            <div style={{ flexShrink: 0, paddingTop: "8px" }}>
              <SpeedSelector onSelect={handleSpeedSelect} selected={selected} />
            </div>
          )}
        </div>
        {/* end row wrapper */}

        {/* Mobile: SpeedSelector as horizontal row below the sentence box */}
        {!showFinalState && isMobile && (
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

        {showFinalState &&
          hoveredWord &&
          currentSentence?.hints[hoveredWord] && (
            <div
              style={{
                position: "absolute",
                left: hintPosition.x,
                top: hintPosition.y,
                transform: "translateX(-50%)",
                zIndex: 1000,
                pointerEvents: "none",
              }}
            >
              <img
                src={LanguageHint}
                alt="language hint"
                style={{
                  width: "190px",
                  height: "140px",
                  userSelect: "none",
                }}
              />
            </div>
          )}

        {showConfetti && showBearDance && whiteContainerRef.current && (
          <Confetti
            width={whiteContainerRef.current.offsetWidth}
            height={whiteContainerRef.current.offsetHeight}
            recycle={false}
          />
        )}

        <div
          style={{
            marginTop: "10px",
            minHeight: isMobile ? "180px" : "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {showContent && !animationCompleted && !paused && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isMobile ? "10px" : "15px",
              }}
            >
              <img
                src={graphImg}
                alt="graph"
                style={{
                  width: isMobile ? "220px" : "350px",
                  maxWidth: "100%",
                }}
              />

              <img
                src={pauseImg}
                alt="pause"
                style={{
                  width: isMobile ? "35px" : "50px",
                  cursor: "pointer",
                }}
                onClick={handlePauseClick}
              />
            </div>
          )}

          {showBearDance && !showFinalState && (
            <img
              src={beardanceImg}
              alt="bear dance"
              style={{
                width: "160px",
                height: "160px",
              }}
            />
          )}

          {showFinalState && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "30px",
                marginTop: "20px",
              }}
            >
              <RetryIcon
                height={50}
                width={50}
                style={{ cursor: "pointer" }}
                onClick={handleRetryClick}
              />
              <img
                src={nextImg}
                alt="next"
                role="button"
                tabIndex={0}
                style={{ width: "50px", cursor: "pointer" }}
                onClick={(e) => handleNextClick(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    e.currentTarget.click();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
        {renderReadingScreen()}
      </div>
    </MainLayout>
  );
};

export default FluencyP2;
