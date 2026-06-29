import React, { useEffect, useState, useRef } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import MainLayout from "../Layout/MainLayout";
import backgroundImg from "../../assets/backgrounds.svg";
import clickbubbleImg from "../../assets/clickbubble.svg";
import wrongBoxImg from "../../assets/wrongBox.svg";
import correctBoxImg from "../../assets/correctBox.svg";
import wrongSignImg from "../../assets/wrongsign.svg";
import correctSignImg from "../../assets/correctsign.svg";
import bubbleDropsImg from "../../assets/bubbleDropImg.svg";
import giftboxImg from "../../assets/giftbox.svg";
import giftopenImg from "../../assets/giftopen.svg";
import Confetti from "react-confetti";
import nexttImg from "../../assets/nextt.svg";
import listenblueImg from "../../assets/listenblue.svg";
import listenvioletImg from "../../assets/listenviolet.svg";
import Lottie from "lottie-react";
import Giftbox from "../../assets/Giftbox.json";
import { getCorrectPracticeWords } from "../../services/orchestration/orchestrationService";
import {
  getLocalData,
  setLocalData,
  randomizeArray as shuffle,
} from "../../utils/constants";
import { getFontFamily } from "../../utils/fontUtils";
import { getUiStrings } from "../../constants/strings";
import giftscoreImg from "../../assets/giftscore.svg";
import redboxImg from "../../assets/redbox.svg";
import greenboxImg from "../../assets/greenbox.svg";
import nextimg from "../../assets/nxxt.svg";
import redsmileImg from "../../assets/redsmile.svg";
import greenstarImg from "../../assets/greenstar.svg";
import { useNavigate } from "react-router-dom";
import { splitGraphemes } from "split-graphemes";

const GiftBox = () => {
  return (
    <Lottie
      animationData={Giftbox}
      loop={true}
      style={{ width: "min(500px, 90vw)", height: "min(500px, 90vw)" }}
    />
  );
};

const WordWall = ({
  handleNext,
  enableNext,
  background,
  steps,
  currentStep,
  level,
  progressData,
  showProgress,
  handleBack,
  disableScreen,
  loading,
  vocabCount,
  wordCount,
  multilingual,
}) => {
  const [dropText, setDropText] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showGiftBoxes, setShowGiftBoxes] = useState(false);
  const [showGiftAnimation, setShowGiftAnimation] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [wrongAnswersAllQuestions, setWrongAnswersAllQuestions] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [openedGifts, setOpenedGifts] = useState([]);
  const [showGiftImage, setShowGiftImage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [giftsOpened, setGiftsOpened] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(min-width: 601px) and (max-width: 1024px)");

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scoreAnimation, setScoreAnimation] = useState({
    show: false,
    value: "",
    color: "",
    startPos: { x: 0, y: 0 },
    endPos: { x: 0, y: 0 },
  });
  const [lastAnswerResult, setLastAnswerResult] = useState(null);
  const [pendingScoreUpdate, setPendingScoreUpdate] = useState({
    value: 0,
    isCorrect: false,
  });
  const [boxAnimation, setBoxAnimation] = useState({
    correct: false,
    wrong: false,
  });

  const [gameData, setGameData] = useState([]);
  const correctBoxRef = useRef(null);
  const wrongBoxRef = useRef(null);
  const animationRef = useRef(null);
  const username = getLocalData("profileName") || "User";
  const ui = getUiStrings(getLocalData("lang"));

  console.log("counts", wrongAnswersAllQuestions);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await getCorrectPracticeWords("false");
        const correctWords = response?.data || [];
        const selectedLang = getLocalData("lang") || "en";

        // First, filter items by top-level language field to only include items matching selected language
        const filteredWords = correctWords.filter((item) => {
          // Check if item's top-level language matches
          if (item?.language === selectedLang) {
            return true;
          }
          // Also check if contentSourceData has an entry for the selected language
          return item?.contentSourceData?.some(
            (data) => data?.language === selectedLang
          );
        });

        const formattedItems = filteredWords?.map((item) => {
          // Filter contentSourceData to find the entry matching the selected language
          const contentData =
            item?.contentSourceData?.find(
              (data) => data?.language === selectedLang
            ) || item?.contentSourceData?.[0]; // Fallback to first entry if language not found

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

          return {
            image_url: item?.imagePath || item.mechanics_data?.[0].image_url,
            text: contentData?.text,
            audio_en: `${item?.contentId}.wav`,
            audio_hi: item?.multilingual?.[multilingualLangCode]?.audio_url,
          };
        });

        if (formattedItems?.length < 3) {
          setLocalData("wordWall", false);
          navigate("/practice");
        }

        const shuffledItems = shuffle([...formattedItems]);

        const correctItems = shuffledItems;

        const finalGameData = correctItems.map((correctItem) => {
          let pool = shuffledItems.filter(
            (item) => item.text !== correctItem.text
          );

          if (pool.length < 2) {
            pool = [...pool, ...shuffledItems].filter(
              (item) => item.text !== correctItem.text
            );
          }

          const incorrectOptions = shuffle(pool).slice(0, 2);

          const options = shuffle([
            {
              ...correctItem,
              isCorrect: true,
            },
            ...incorrectOptions.map((item) => ({
              ...item,
              isCorrect: false,
            })),
          ]);

          return { images: options };
        });

        console.log(
          "dataGame",
          finalGameData,
          getLocalData("wordWall"),
          getLocalData("readMatch")
        );

        setGameData(finalGameData);
      } catch (err) {
        console.error("Failed to generate game data:", err);
      }
    };

    fetchGameData();
  }, []);

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    if (styleSheet) {
      styleSheet.insertRule(
        `@keyframes dropFromTop {
          0% { top: 80px; opacity: 0; }
          30% { opacity: 1; }
          100% { top: 300px; opacity: 1; }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes dropFromTopMobile {
          0% { top: 50px; opacity: 0; }
          30% { opacity: 1; }
          100% { top: 220px; opacity: 1; }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes scoreFlyToBox {
          0% { 
          transform: translate(90%, -70%) scale(1);

            opacity: 1.2; 
          }
          70% { 
            opacity: 1.5;
          }
          100% { 
            transform: translate(
              calc(var(--target-x) - 55vw + 70%),
              calc(var(--target-y) - 52vh + 80%)
            ) scale(1); 
            opacity: 0; 
          }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes boxBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }`,
        styleSheet.cssRules.length
      );

      styleSheet.insertRule(
        `@keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
     }`,
        styleSheet.cssRules.length
      );
    }

    console.log("dataGameData", dropText);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (gameData?.length > 0) {
      loadQuestion(currentQuestionIndex);
    }
  }, [gameData, currentQuestionIndex]);

  useEffect(() => {
    if (lastAnswerResult && currentQuestionIndex > 0) {
      const startPos = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      const endPos = lastAnswerResult.correct
        ? {
            x: window.innerWidth - 90,
            y: 100,
          }
        : {
            x: 110,
            y: 100,
          };

      setScoreAnimation({
        show: true,
        value: lastAnswerResult.correct ? "+1" : "-1",
        color: lastAnswerResult.correct ? "#1F9D55" : "#F37052",
        startPos,
        endPos,
      });

      setPendingScoreUpdate({
        value: lastAnswerResult.correct ? 1 : -1,
        isCorrect: lastAnswerResult.correct,
      });

      setTimeout(() => {
        setScoreAnimation({ show: false });
      }, 1500);

      setTimeout(() => {
        if (lastAnswerResult.correct) {
          setBoxAnimation((prev) => ({ ...prev, correct: true }));
          setTimeout(() => {
            setCorrectCount((prev) => prev + 1);
            setBoxAnimation((prev) => ({ ...prev, correct: false }));
          }, 300);
        } else {
          setBoxAnimation((prev) => ({ ...prev, wrong: true }));
          setTimeout(() => {
            setWrongCount((prev) => prev + 1);
            setBoxAnimation((prev) => ({ ...prev, wrong: false }));
          }, 300);
        }
        setLastAnswerResult(null);
      }, 1600);
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (showConfetti) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showConfetti]);

  const loadQuestion = (questionIndex) => {
    const correct = gameData?.[questionIndex]?.images?.find(
      (img) => img.isCorrect
    );
    if (correct) {
      setDropText(correct?.text);
    }
    setShowQuiz(false);
    setSelectedId(null);
  };

  const playAudio = (src) => {
    console.log("src", src);

    if (!src) return;
    const audio = new Audio(src);
    audio.play();
  };

  const handleImageClick = (item, id) => {
    if (selectedId !== null) return;

    setSelectedId(id);
    const isLastQuestion = currentQuestionIndex === gameData?.length - 1;

    if (item.isCorrect) {
      setShowConfetti(true);
      setLastAnswerResult({ correct: true });

      setTimeout(() => {
        setShowConfetti(false);

        if (isLastQuestion) {
          setShowResults(true);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }, 2000);
    } else {
      setLastAnswerResult({ correct: false });
      const correctAnswer = gameData?.[currentQuestionIndex]?.images.find(
        (img) => img.isCorrect
      );
      setWrongAnswersAllQuestions((prev) => [
        ...prev,
        {
          questionIndex: currentQuestionIndex,
          item: correctAnswer,
        },
      ]);

      setTimeout(() => {
        if (isLastQuestion) {
          setShowResults(true);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }, 1000);
    }
  };
  const handleGiftClick = (index) => {
    if (openedGifts.includes(index)) return;

    setOpenedGifts((prev) => [...prev, index]);

    setCurrentReviewIndex(index);
    setShowGiftAnimation(true);
    setShowConfetti(true);
    setShowGiftBoxes(false);
    setShowGiftImage(false);

    setTimeout(() => {
      setShowGiftImage(true);
    }, 1000);

    animationRef.current = setTimeout(() => {
      setShowGiftAnimation(false);
      setShowGiftImage(false);
      setShowConfetti(false);
      setShowReview(true);

      setGiftsOpened((prev) => {
        const newCount = prev + 1;
        const newProgress = Math.min(
          100,
          Math.round((newCount / wrongAnswersAllQuestions.length) * 100)
        );
        setProgress(newProgress);
        return newCount;
      });
    }, 3000);
  };
  const handleReviewComplete = () => {
    setShowReview(false);

    const allGiftsReviewed =
      openedGifts.length >= wrongAnswersAllQuestions.length;

    if (allGiftsReviewed) {
      //setShowResults(true);
      setLocalData("wordWall", false);
      navigate("/practice");
    } else {
      setShowGiftBoxes(true);
    }
  };

  const ResultsView = ({ onNext }) => (
    <div
      style={{
        backgroundColor: "#FDFEFF",
        height: isMobile ? "calc(100dvh - 280px)" : "auto",
        maxHeight: isMobile ? "calc(100dvh - 280px)" : "none",
        margin: 0,
        padding: 0,
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: isMobile ? "auto" : "visible",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "#2DAEF5",
          color: "#fff",
          fontSize: isMobile ? "18px" : "24px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "16px 0",
          width: "100%",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          position: "relative",
        }}
      >
        {ui.WORD_WALL_YOU_DID_IT}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: isMobile ? "24px" : "60px",
          marginTop: isMobile ? "14px" : "40px",
          flexWrap: "wrap",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            width: isMobile ? "150px" : "230px",
            height: isMobile ? "150px" : "230px",
            backgroundImage: `url(${greenboxImg})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={greenstarImg}
            alt="Star"
            style={{
              position: "absolute",
              top: isMobile ? "5px" : "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: isMobile ? "24px" : "32px",
            }}
          />
          <div
            style={{
              backgroundColor: "#fff",
              width: isMobile ? "42px" : "50px",
              height: isMobile ? "42px" : "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "22px" : "28px",
              fontWeight: "bold",
              color: "#2F2F2F",
              marginBottom: "6px",
            }}
          >
            {Math.max(
              0,
              (gameData?.length || 0) - wrongAnswersAllQuestions?.length
            )}
          </div>
          <div
            style={{
              fontSize: isMobile ? "14px" : "18px",
              textAlign: "center",
              lineHeight: "22px",
              color: "#2F2F2F",
              maxWidth: isMobile ? "110px" : "170px",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {ui.WORD_WALL_WORDS_YOU_KNOW}
          </div>
        </div>

        <div
          style={{
            width: isMobile ? "150px" : "230px",
            height: isMobile ? "150px" : "230px",
            backgroundImage: `url(${redboxImg})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: isMobile ? "5px" : "0px",
          }}
        >
          <img
            src={redsmileImg}
            alt="Smile"
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: isMobile ? "20px" : "40px",
            }}
          />
          <div
            style={{
              backgroundColor: "#fff",
              width: isMobile ? "42px" : "50px",
              height: isMobile ? "42px" : "50px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "22px" : "28px",
              fontWeight: "bold",
              color: "#2F2F2F",
              marginBottom: "6px",
            }}
          >
            {wrongAnswersAllQuestions?.length}
          </div>
          <div
            style={{
              fontSize: isMobile ? "14px" : "18px",
              textAlign: "center",
              lineHeight: "22px",
              color: "#2F2F2F",
              maxWidth: isMobile ? "110px" : "170px",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            {ui.WORD_WALL_WORDS_TRY_AGAIN}
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: isMobile ? "40px" : "140px",
          marginTop: isMobile ? "14px" : "40px",
        }}
      >
        <img
          src={nextimg}
          alt="Next"
          style={{
            width: "50px",
            height: "50px",
            cursor: "pointer",
          }}
          onClick={() => {
            setShowResults(false);
            setShowGiftBoxes(true);
            if (wrongAnswersAllQuestions?.length === 0) {
              setLocalData("wordWall", false);
              navigate("/practice");
            }
          }}
        />
      </div>
    </div>
  );
  const getImageBackground = (item, id) => {
    if (selectedId !== id) return "#fff";
    return item.isCorrect ? "#DEF5CC" : "#FEE4D5";
  };

  const getBubbleFontSize = (text) => {
    const len = splitGraphemes(text).length;
    if (isMobile) {
      if (len <= 4) return "22px";
      if (len <= 6) return "18px";
      if (len <= 8) return "15px";
      return "13px";
    } else {
      if (len <= 4) return "28px";
      if (len <= 6) return "22px";
      if (len <= 8) return "18px";
      if (len <= 10) return "14px";
      return "16px";
    }
  };

  const renderGameView = () => (
    <>
      {!showQuiz ? (
        <>
          <div
            style={{
              position: "absolute",
              top: isMobile ? "50px" : "80px",
              left: "50%",
              transform: "translateX(-50%)",
              height: isMobile ? "120px" : "170px",
              animation: isMobile
                ? "dropFromTopMobile 1.3s ease-out forwards"
                : "dropFromTop 1.3s ease-out forwards",
              zIndex: 2,
              cursor: "pointer",
            }}
            onClick={() => setShowQuiz(true)}
          >
            <img
              src={bubbleDropsImg}
              alt="Bubble Drop"
              style={{ height: "100%", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: getBubbleFontSize(dropText),
                fontWeight: "bold",
                color: "#333F61",
                textAlign: "center",
                maxWidth: "80%",
                whiteSpace: "nowrap",
              }}
            >
              {dropText}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: isMobile ? "center" : "space-between",
              alignItems: "center",
              marginTop: "40px",
              padding: isMobile ? "0 16px" : "0 40px",
              gap: isMobile ? "12px" : "0",
            }}
          >
            <div
              ref={wrongBoxRef}
              style={{
                position: "relative",
                transform: `translateX(${
                  pendingScoreUpdate.isCorrect === false && scoreAnimation.show
                    ? "-10px"
                    : isMobile
                    ? "0px"
                    : "-10px"
                })`,
                transition: "transform 0.3s ease",
                flexShrink: 0,
              }}
            >
              <img
                src={wrongBoxImg}
                alt="Wrong Count"
                style={{ height: isMobile ? "40px" : "60px" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: isMobile ? "12px" : "18px",
                  fontWeight: "bold",
                  color: "#F37052",
                }}
              >
                {-wrongCount}
              </div>
              <img
                src={wrongSignImg}
                alt="Wrong Icon"
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  height: isMobile ? "16px" : "22px",
                }}
              />
            </div>

            <div
              style={{
                backgroundColor: "#ffe9f9",
                borderRadius: "20px",
                padding: isMobile
                  ? "10px 14px"
                  : isTablet
                  ? "14px 60px"
                  : "16px 100px",
                fontSize: isMobile ? "16px" : "30px",
                fontWeight: 700,
                color: "#333F61",
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "6px" : "10px",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                fontFamily: "Quicksand",
                justifyContent: "center",
                flexShrink: 1,
                minWidth: 0,
              }}
              onClick={() => setShowQuiz(true)}
            >
              <img
                src={clickbubbleImg}
                alt="Click Bubble"
                style={{ height: isMobile ? "18px" : "28px", flexShrink: 0 }}
              />
              <span style={{ lineHeight: "1", whiteSpace: "nowrap" }}>
                {ui.WORD_WALL_CLICK_BUBBLE}
              </span>
            </div>

            <div
              ref={correctBoxRef}
              style={{
                position: "relative",
                transform: `translateX(${
                  pendingScoreUpdate.isCorrect === true && scoreAnimation.show
                    ? "10px"
                    : isMobile
                    ? "0px"
                    : "10px"
                })`,
                transition: "transform 0.3s ease",
                flexShrink: 0,
              }}
            >
              <img
                src={correctBoxImg}
                alt="Correct Count"
                style={{ height: isMobile ? "40px" : "60px" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: isMobile ? "12px" : "18px",
                  fontWeight: "bold",
                  color: "#1F9D55",
                }}
              >
                {correctCount}
              </div>
              <img
                src={correctSignImg}
                alt="Correct Icon"
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  height: isMobile ? "16px" : "22px",
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            marginTop: "5px",
            textAlign: "center",
            padding: "0px",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FF4BC21A",
              padding: isMobile ? "12px 20px" : "20px 60px",
              borderRadius: "16px",
              display: "inline-block",
              fontSize: isMobile ? "20px" : "30px",
              color: "#333F61",
              fontWeight: 800,
              marginBottom: "10px",
            }}
          >
            {ui.WORD_WALL_CAN_YOU_FIND}
          </div>
          <div
            style={{
              fontSize: isMobile ? "28px" : "40px",
              fontWeight: "bold",
              color: "#333F61",
              marginBottom: "20px",
              padding: "0 16px",
              wordBreak: "break-word",
            }}
          >
            {dropText}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: isMobile ? "16px" : "60px",
              flexWrap: "wrap",
              padding: "0 16px",
            }}
          >
            {gameData?.[currentQuestionIndex]?.images?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: `1px solid ${
                    selectedId === idx
                      ? item.isCorrect
                        ? "#1F9D55"
                        : "#F37052"
                      : "#ddd"
                  }`,
                  borderRadius: "16px",
                  padding: "10px",
                  width: isMobile ? "100px" : "140px",
                  height: isMobile ? "100px" : "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: getImageBackground(item, idx),
                  cursor: "pointer",
                  transform: selectedId === idx ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleImageClick(item, idx)}
              >
                <img
                  src={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${item?.image_url}`}
                  alt={item?.text}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderGiftBoxesView = () => (
    <div style={{ textAlign: "center", marginTop: isMobile ? "32px" : "60px" }}>
      <div
        style={{
          backgroundColor: "#FF4BC21A",
          borderRadius: "20px",
          padding: isMobile
            ? "14px 24px"
            : isTablet
            ? "19px 60px"
            : "19px 80px",
          fontSize: isMobile ? "20px" : "30px",
          fontWeight: 700,
          color: "#333F61",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: isMobile ? "24px" : "40px",
          fontFamily: "Quicksand",
          maxWidth: "calc(100% - 32px)",
        }}
      >
        <span style={{ lineHeight: "1" }}>{ui.WORD_WALL_OPEN_GIFTS}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: isMobile ? "24px" : "40px",
          flexWrap: "wrap",
          padding: "0 20px",
        }}
      >
        {wrongAnswersAllQuestions?.map((wrongAnswer, idx) => {
          const isOpened = openedGifts.includes(idx);
          const isAnimating = showGiftAnimation && currentReviewIndex === idx;

          return (
            <div
              key={idx}
              style={{
                width: isMobile ? "90px" : "120px",
                height: isMobile ? "90px" : "120px",
                position: "relative",
                animationDelay: `${idx * 0.1}s`,
                cursor: isOpened || isAnimating ? "default" : "pointer",
                opacity: isOpened ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => !isOpened && !isAnimating && handleGiftClick(idx)}
            >
              {isAnimating ? (
                <GiftBox />
              ) : (
                <>
                  <img
                    src={isOpened ? giftopenImg : giftboxImg}
                    alt={isOpened ? "Opened Gift" : "Gift Box"}
                    style={{
                      width: "100%",
                      height: "100%",
                      transition: "transform 0.2s",
                    }}
                  />
                  {isOpened && (
                    <div
                      style={{
                        position: "absolute",
                        top: "70%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        fontSize: isMobile ? "11px" : "14px",
                        fontWeight: "bold",
                        color: "#000",
                        padding: "4px 6px",
                        background: "rgba(255,255,255,0.8)",
                        borderRadius: "6px",
                        maxWidth: "90%",
                        wordWrap: "break-word",
                      }}
                    >
                      {wrongAnswer?.item?.text}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGiftAnimation = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "400px",
          animation: "popIn 0.5s ease-out",
        }}
      >
        {!showGiftImage && (
          <img
            src={giftboxImg}
            alt="Gift Box"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        )}

        {showGiftImage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <GiftBox />
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewView = () => {
    const currentAnswer = wrongAnswersAllQuestions?.[currentReviewIndex]?.item;
    const lang = getLocalData("lang");

    if (!currentAnswer) return null;

    return (
      <div style={{ textAlign: "center", padding: isMobile ? "16px" : "20px" }}>
        <div
          style={{
            backgroundColor: "#FF4BC21A",
            padding: isMobile
              ? "8px 14px"
              : isTablet
              ? "14px 60px"
              : "14px 80px",
            borderRadius: "16px",
            fontSize: isMobile ? "18px" : "40px",
            color: "#333F61",
            marginBottom: isMobile ? "12px" : "20px",
            marginTop: isMobile ? "9vh" : "1px",
            display: "inline-block",
            fontFamily: "Quicksand",
            fontWeight: 900,
            maxWidth: "calc(100% - 32px)",
          }}
        >
          {ui.WORD_WALL_REVIEW_THIS_IS_CALLED}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? "12px" : "10%",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "0 16px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${currentAnswer?.image_url}`}
              alt={currentAnswer?.text}
              style={{
                width: isMobile ? "100px" : "200px",
                height: isMobile ? "100px" : "200px",
                borderRadius: "10px",
                border: "2px solid #eee",
                backgroundColor: "#fff",
                padding: isMobile ? "8px" : "20px",
                objectFit: "contain",
              }}
            />
            <div
              style={{
                marginTop: isMobile ? "8px" : "15px",
                display: "flex",
                gap: isMobile ? "6px" : "15px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "4px" : "8px",
                  cursor: "pointer",
                  color: "#31356E",
                  padding: isMobile ? "6px 8px" : "8px 12px",
                  borderRadius: "20px",
                  fontFamily: "Quicksand",
                  fontWeight: 800,
                  minHeight: isMobile ? "36px" : "44px",
                  fontSize: isMobile ? "13px" : "inherit",
                }}
                onClick={() =>
                  playAudio(
                    `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${currentAnswer?.audio_en}`
                  )
                }
              >
                <img
                  src={listenblueImg}
                  alt="Listen"
                  style={{ height: isMobile ? "26px" : "40px" }}
                />
                <span>{ui.WORD_WALL_LISTEN_ENGLISH}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "4px" : "8px",
                  cursor: "pointer",
                  color: "#333F61",
                  padding: isMobile ? "6px 8px" : "8px 12px",
                  borderRadius: "20px",
                  fontFamily: "Quicksand",
                  fontWeight: 800,
                  minHeight: isMobile ? "36px" : "44px",
                  fontSize: isMobile ? "13px" : "inherit",
                }}
                onClick={() =>
                  playAudio(
                    `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/multilingual_audios/${currentAnswer?.audio_hi}`
                  )
                }
              >
                <img
                  src={listenvioletImg}
                  alt="Listen"
                  style={{ height: isMobile ? "26px" : "40px" }}
                />
                <span>ಕನ್ನಡ</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#1CB0F60F",
                border: "2px solid #1CB0F633",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: isMobile ? "8px 16px" : "10px 40px",
                marginBottom: isMobile ? "10px" : "16px",
                maxWidth: "calc(100vw - 64px)",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#333F61",
                    fontWeight: 600,
                    fontSize: isMobile
                      ? lang === "te"
                        ? "28px"
                        : "24px"
                      : lang === "te"
                      ? "56px"
                      : "50px",
                    lineHeight: isMobile ? "1.3" : "60px",
                    letterSpacing: "1%",
                    fontFamily: getFontFamily(lang),
                    wordBreak: "break-word",
                  }}
                >
                  {currentAnswer?.text}
                </span>
              </Box>
            </Box>

            <button
              onClick={handleReviewComplete}
              style={{
                marginTop: isMobile ? "10px" : "50px",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                minHeight: "44px",
                minWidth: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={nexttImg}
                alt="Back to Gifts"
                style={{
                  height: isMobile ? "40px" : "50px",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const showProgressBar = showGiftBoxes || showGiftAnimation || showReview;
  const progressBarWidth = isMobile ? 140 : 240;
  const progressBarRight = isMobile ? 10 : 50;

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={false}
      pageName={"m7"}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress: false,
        showMilestone: false,
        handleBack,
        disableScreen,
        loading,
        vocabCount,
        wordCount,
      }}
    >
      {showResults ? (
        <ResultsView
          onNext={() => {
            setShowGiftBoxes(true);
          }}
        />
      ) : (
        <div
          style={{
            position: "relative",
            height: isMobile ? "calc(100dvh - 250px)" : "65vh",
            maxHeight: isMobile ? "calc(100dvh - 250px)" : "none",
            width: isMobile ? "calc(100% - 20px)" : "100%",
            backgroundColor: "#ffffff",
            overflow: isMobile ? "auto" : "visible",
            borderRadius: "16px",
            marginLeft: isMobile ? "10px" : "auto",
            marginRight: isMobile ? "10px" : "auto",
            boxSizing: "border-box",
          }}
        >
          {showConfetti && (
            <Confetti
              width={document.documentElement.clientWidth}
              height={document.documentElement.clientHeight}
              recycle={false}
              numberOfPieces={500}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 9999,
              }}
            />
          )}

          {scoreAnimation.show && (
            <div
              style={{
                position: "fixed",
                left: `${scoreAnimation.startPos.x}px`,
                top: `${scoreAnimation.startPos.y}px`,
                color: scoreAnimation.color,
                fontSize: "47px",
                fontWeight: "bold",
                animation: "scoreFlyToBox 2s ease-in-out forwards",
                zIndex: 100,
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                "--target-x": `${scoreAnimation.endPos.x}px`,
                "--target-y": `${scoreAnimation.endPos.y}px`,
              }}
            >
              {scoreAnimation.value}
            </div>
          )}

          <div
            style={{
              backgroundImage: `url(${backgroundImg})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "cover",
              width: "100%",
              padding: isMobile ? "12px 16px" : "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: isMobile ? "20px" : "40px",
              fontWeight: 700,
              color: "#ffffff",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              marginBottom: isMobile ? "5px" : "40px",
              fontFamily: "Quicksand",
              position: "relative",
              minHeight: "60px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                textAlign: "center",
                flex: 1,
                paddingRight: showProgressBar
                  ? `${progressBarWidth + progressBarRight + 16}px`
                  : "0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {ui.WORD_WALL_TITLE.replace("{name}", username)}
            </div>

            {showProgressBar && (
              <div
                style={{
                  width: progressBarWidth,
                  height: 35,
                  backgroundColor: "#fff",
                  borderRadius: 40,
                  position: "absolute",
                  right: `${progressBarRight}px`,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  overflow: "visible",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f0f0f0",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: 40,
                  }}
                />

                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background:
                      "linear-gradient(0deg, #F19920 0%, #F39F27 23%, #F7B03B 58%, #FECC5C 100%)",
                    transition: "width 0.5s ease-out",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: 40,
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                    height: "100%",
                    paddingRight: "12px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <img
                      src={giftscoreImg}
                      alt="Gift"
                      style={{
                        width: isMobile ? "44px" : "60px",
                        height: isMobile ? "44px" : "60px",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: isMobile ? 13 : 16,
                      fontWeight: "600",
                      color: "#2C2C4A",
                    }}
                  >
                    {giftsOpened}/{wrongAnswersAllQuestions.length}
                  </div>
                </div>
              </div>
            )}
          </div>

          {!showGiftBoxes &&
            !showGiftAnimation &&
            !showReview &&
            renderGameView()}
          {showGiftBoxes && renderGiftBoxesView()}
          {showGiftAnimation && renderGiftAnimation()}
          {showReview && renderReviewView()}
        </div>
      )}
    </MainLayout>
  );
};

export default WordWall;
