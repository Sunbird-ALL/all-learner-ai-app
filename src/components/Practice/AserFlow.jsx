import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import headerImg from "../../assets/headerImg.svg";
import speakButton from "../../assets/speakButton.svg";
import listenBear from "../../assets/bearlisten.svg";
import graphImg from "../../assets/graphImg.svg";
import pauseImg from "../../assets/pauseImg.svg";
import bearImg from "../../assets/bearImg.svg";
import listenImg from "../../assets/listenImg.svg";
import nextImg from "../../assets/nextImg.svg";
import backgroundImg from "../../assets/starsandclouds.png";
import meterImg from "../../assets/meterimg.svg";
import tortoiseImg from "../../assets/tortoiseImg.svg";
import dogImg from "../../assets/dogimg.svg";
import langhint from "../../assets/laguagehint.svg";
import paraudio from "../../assets/parrotR1KanAudio.wav";
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
  sendTestRigScore,
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
  callTelemetryDiscovery,
} from "../../utils/apiUtil";
import AudioTooltipModal from "./AudioTooltipModal";
import { loadTranscriber } from "../../utils/transcriber";
import { doubleMetaphone } from "double-metaphone";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import {
  addLesson,
  addPointer,
  fetchUserPoints,
  createLearnerProgress,
} from "../../services/orchestration/orchestrationService";
import { fetchGetSetResult } from "../../services/learnerAi/learnerAiService";
import {
  fetchAssessmentData,
  fetchPaginatedContent,
} from "../../services/content/contentService";
import { useNavigate } from "react-router-dom";
import { uniqueId } from "../../services/utilService";
import { updateLearnerProfile } from "../../services/learnerAi/learnerAiService";
import bubbleImg from "../../assets/bubble.png";
import magnifier from "../../assets/magnifier.png";
import { Box } from "@mui/material";

const AserFlow = ({
  // setVoiceText,
  // setRecordedAudio,
  // setVoiceAnimate,
  // storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
  // enableNext,
  showTimer,
  // points,
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
  // disableScreen,
  isShowCase,
  handleBack,
  // setEnableNext,
  loading,
  // setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
  multilingual,
  contentSourceData,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const audioRef = useRef(null);
  const correctAudio = new Audio(correctSound);
  const wrongAudio = new Audio(wrongSound);
  const sessionId = getLocalData("sessionId");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [points, setPoints] = useState(0);
  const [enableNext, setEnableNext] = useState(false);
  const [sentencePassedCounter, setSentencePassedCounter] = useState(0);
  const [assesmentCount, setAssesmentcount] = useState(0);
  const [initialAssesment, setInitialAssesment] = useState(true);
  const [disableScreen, setDisableScreen] = useState(false);
  // const [play] = useSound(LevelCompleteAudio);
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [ansSelectionStatus, setAnsSelectionStatus] = useState({});
  const lang = getLocalData("lang");
  const virtualId = getLocalData("virtualId");
  const [clickedIndex, setClickedIndex] = useState(null);

  background = "linear-gradient(45deg, #FF730E 30%, #FFB951 90%)";
  showTimer = false;
  level = "B";

  useEffect(() => {
    (async () => {
      let quesArr = [];
      try {
        const lang = getLocalData("lang");
        // Fetch assessment data
        const resAssessment = await fetchAssessmentData(lang);
        const sentences = resAssessment?.data?.find(
          (elem) => elem.category === "Char"
        );

        if (!sentences?.collectionId) {
          console.error("No collection ID found for sentences.");
          return;
        }

        const resPagination = await fetchPaginatedContent(
          sentences.collectionId,
          10
        );

        await addLesson({
          sessionId,
          milestone: `practice`,
          lesson: "0",
          progress: 0,
          language: lang,
          milestoneLevel: "B",
        });

        // Update state
        setCurrentContentType("Char");
        setTotalSyllableCount(resPagination?.totalSyllableCount);
        setCurrentCollectionId(sentences?.collectionId);
        setAssessmentResponse(resAssessment);
        setLocalData("storyTitle", sentences?.name);
        quesArr = [...quesArr, ...(resPagination?.data || [])];
        setQuestions(quesArr);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (questions?.length) {
      setLocalData("sub_session_id", uniqueId());
    }
  }, [questions]);

  const currentItem = questions?.[currentIndex];
  const correctLetter = currentItem?.contentSourceData[0].text;

  console.log("audio", currentItem?.contentId);

  const questionLetters = questions.map((q) => q.contentSourceData[0].text);

  const handlePlayAudio = () => {
    const audio = new Audio(
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${currentItem?.contentId}.wav`
    );
    audio.play();
  };

  const handleCompletion = async () => {
    const sub_session_id = getLocalData("sub_session_id");

    try {
      const milestoneLevel = "B";

      let requestBody = {
        original_text: "Char",
        audio: "",
        user_id: virtualId,
        session_id: sessionId,
        language: lang,
        date: new Date(),
        sub_session_id,
        contentId: contentId,
        contentType: "Char",
        mechanics_id: getLocalData("mechanism_id") || "",
        milestone: milestoneLevel,
        ansSelectionStatus: ansSelectionStatus,
      };

      const result = await updateLearnerProfile(lang, requestBody);
      console.log("Learner progress result:", result);
    } catch (error) {
      console.error("Error creating learner progress:", error);
    }

    try {
      const getSetResultRes = await fetchGetSetResult(
        sub_session_id,
        currentContentType,
        currentCollectionId,
        totalSyllableCount
      );
      console.log("GetSet result:", getSetResultRes);
    } catch (error) {
      console.error("Error fetching set result:", error);
    }

    if (!(localStorage.getItem("contentSessionId") !== null)) {
      let point = 1;
      let milestone = "B";

      if (point !== 1) {
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        return;
      }

      try {
        const result = await addPointer(point, milestone);
        const awardedPoints = result?.result?.points;
        if (awardedPoints !== 1) {
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            navigate("/");
          } else {
            navigate("/discover-start");
          }
          return;
        }
        setPoints(result?.result?.totalLanguagePoints || 0);
      } catch (error) {
        setPoints(0);
        console.error("Error adding points:", error);
      }
    } else {
      sendTestRigScore(5);
      // setPoints(localStorage.getItem("currentLessonScoreCount"));
    }
    navigate("/discover-start");
  };

  const handleBubbleClick = (letter, index) => {
    setClickedIndex(index);
    setTimeout(() => setClickedIndex(null), 1000);

    setSelectedLetter(letter);
    const correct = letter === correctLetter;
    setIsCorrect(correct);
    setShowNext(true);

    const characterSets = {
      en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      hi: "अआइईउऊएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह".split(""),
      ta: "அஆஇஈஉஊஎஏஐஒஓஔகஙசஞடணதநபமயரலவழளறன".split(""),
      te: "అఆఇఈఉఊఎఏఐఒఓఔకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరలవశషసహ".split(""),
      kn: "ಅಆಇಈಉಊಎಏಐಒಓಔಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವಶಷಸಹಳ".split(""),
    };

    const currentLang = lang || "en";
    const alphabets = characterSets[currentLang] || characterSets.en;

    setQuestions((prev) => {
      const existingLetters = prev.map((q) => q.contentSourceData?.[0]?.text);

      let newLetter;
      const availableLetters = alphabets.filter(
        (char) => !existingLetters.includes(char)
      );

      if (availableLetters.length === 0) {
        newLetter = alphabets[Math.floor(Math.random() * alphabets.length)];
      } else {
        newLetter =
          availableLetters[Math.floor(Math.random() * availableLetters.length)];
      }

      return prev.map((q, i) => {
        if (i === index) {
          return {
            ...q,
            contentSourceData: [{ ...q.contentSourceData[0], text: newLetter }],
          };
        }
        return q;
      });
    });

    setAnsSelectionStatus((prev) => ({
      ...prev,
      [letter]: correct,
    }));

    if (correct) correctAudio.play();
    else wrongAudio.play();

    setTimeout(() => {
      handleNextClick();
    }, 1000);
  };

  const handleNextClick = async () => {
    setSelectedLetter("");
    setIsCorrect(null);
    setShowNext(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // await handleCompletion();
      callTelemetryDiscovery("Discovery-AserFlow");
      handleNext?.();
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    }
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
      isRecordingComplete={false}
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
          margin: "10px 0",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* --- Title --- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          <img
            src={magnifier}
            alt="Magnifier"
            style={{
              width: 40,
              height: 40,
              cursor: "pointer",
            }}
          />
          <span
            style={{
              marginLeft: 10,
              fontSize: "45px",
              fontWeight: "800",
              color: "#1a1a1a",
              fontFamily: "Quicksand",
              pointerEvents: "none",
            }}
          >
            {"Letter Hunt"}
          </span>
        </div>

        {/* --- Bubble Area --- */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            //background: "#fff",
            borderRadius: "20px",
            //boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          {questionLetters?.map((char, index) => {
            const positions = [
              { top: "20%", left: "20%" },
              { top: "70%", left: "15%" },
              { top: "55%", left: "30%" },
              { top: "48%", left: "53%" },
              { top: "18%", left: "62%" },
              { top: "56%", left: "70%" },
              { top: "20%", left: "80%" },
              { top: "73%", left: "85%" },
              { top: "20%", left: "40%" },
              { top: "75%", left: "43%" },
            ];

            const pos = positions[index % positions.length];

            return (
              <div
                key={index}
                onClick={() => handleBubbleClick(char, index)}
                style={{
                  position: "absolute",
                  top: pos.top,
                  left: pos.left,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {/* Bubble image */}
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={bubbleImg}
                    alt="bubble"
                    style={{
                      width: "100px",
                      height: "100px",
                      filter:
                        selectedLetter === char
                          ? isCorrect
                            ? "drop-shadow(0 0 10px #34D399)"
                            : "drop-shadow(0 0 10px #EF4444)"
                          : "drop-shadow(0 3px 8px rgba(0,0,0,0.3))",
                      transition: "filter 0.3s ease",
                    }}
                  />

                  {clickedIndex === index && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(31, 155, 222, 0.48)",
                        borderRadius: "50%",
                        transition: "opacity 0.3s ease",
                      }}
                    />
                  )}

                  {/* Letter inside bubble */}
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "68px",
                      fontWeight: "800",
                      fontFamily: "Quicksand",
                      color: "#333F61",
                      pointerEvents: "none",
                      userSelect: "none",
                      textTransform: "uppercase",
                    }}
                  >
                    {char}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Audio Button --- */}
        <div>
          <Box
            sx={{
              position: "relative",
              width: "90px",
              height: "90px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "7px",
              cursor: "pointer",
            }}
            onClick={() => {
              handlePlayAudio();
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "90px",
                height: "90px",
                backgroundColor: "#A856FF",
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
              }}
            />
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <ListenButton height={50} width={50} />
            </Box>
          </Box>
        </div>
      </div>
    </MainLayout>
  );
};

export default AserFlow;
