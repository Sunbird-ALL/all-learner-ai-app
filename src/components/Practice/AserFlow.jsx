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
  callTelemetryApi,
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
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/en/${currentItem?.contentId}.wav`
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

  const handleNextClick = async () => {
    setSelectedLetter("");
    setIsCorrect(null);
    setShowNext(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      await handleCompletion();
      handleNext?.();
    }
  };

  const handleSelect = (letter) => {
    setSelectedLetter(letter);
    const correct = letter === correctLetter;
    setIsCorrect(correct);
    setShowNext(true);
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
          background: "linear-gradient(to bottom, #fff7ef, #ffeede)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* --- Audio Button --- */}
        <div style={{ marginBottom: "20px" }}>
          <img
            src={speakButton}
            alt="Speak"
            onClick={handlePlayAudio}
            style={{
              width: 60,
              height: 60,
              cursor: "pointer",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            }}
          />
        </div>

        {/* --- Letter Grid --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 80px)",
            gridGap: "20px",
            background: "#fff",
            padding: "15px",
            borderRadius: "20px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
            marginBottom: "20px",
          }}
        >
          {questionLetters?.map((char, index) => (
            <div
              key={index}
              onClick={() => handleSelect(char)}
              style={{
                width: 60,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "12px",
                background:
                  selectedLetter === char
                    ? isCorrect
                      ? "linear-gradient(135deg,#A7F3D0,#34D399)"
                      : "linear-gradient(135deg,#FCA5A5,#EF4444)"
                    : "#f8f8f8",
                color: "#333",
                fontSize: "28px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {char}
            </div>
          ))}
        </div>

        {/* --- Next Button ---
        {showNext && (
          <div style={{ marginBottom: "30px" }}>
            <img
              src={nextImg}
              alt="Next"
              onClick={handleNextClick}
              style={{
                width: 60,
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        )} */}
      </div>
    </MainLayout>
  );
};

export default AserFlow;
