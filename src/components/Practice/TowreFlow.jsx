import React, { useState, useEffect, useRef } from "react";
import clockImg from "../../assets/clocck.svg";
import handImg from "../../assets/hand.svg";
import boxImg from "../../assets/box.svg";
import pauseImg from "../../assets/pauuse.svg";
import arrowImg from "../../assets/arrow.svg";
import pandaImg from "../../assets/panda.svg";
import nextImg from "../../assets/next.svg";
import activeboxImg from "../../assets/activeBox.svg";
import startImg from "../../assets/start.svg";
import pandaTimerImg from "../../assets/pandaTimer1.svg";
import timerBoxImg from "../../assets/timerBox.svg";
import initialMessageBoxImg from "../../assets/initialMessageBox.svg";
import { doubleMetaphone } from "double-metaphone";
import { pipeline, env } from "@xenova/transformers";
import { Box, useMediaQuery, createTheme } from "@mui/material";
import reportBoyImg from "../../assets/monkeyReport.svg";
import reportStarsandcloudsImg from "../../assets/starsandclouds.png";
import speedometerImg from "../../assets/speedTimer.png";
import bookImg from "../../assets/newWord.svg";
import booksStackImg from "../../assets/totalWord.svg";
import reportPandaImg from "../../assets/pandaa.svg";
import reportImg from "../../assets/reportImg.svg";
import { setLocalData, getLocalData } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts.jsx/MainLayout";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { addTowreRecord } from "../../services/learnerAi/learnerAiService";
import * as Assets from "../../utils/imageAudioLinks";

env.localModelPath = "https://huggingface.co/Xenova/whisper-tiny/resolve/main/";

const allWords = [
  { title: "is", isCorrect: false },
  { title: "up", isCorrect: false },
  { title: "cat", isCorrect: false },
  { title: "red", isCorrect: false },
  { title: "me", isCorrect: false },
  { title: "to", isCorrect: false },
  { title: "no", isCorrect: false },
  { title: "we", isCorrect: false },
  { title: "he", isCorrect: false },
  { title: "the", isCorrect: false },
  { title: "and", isCorrect: false },
  { title: "yes", isCorrect: false },
  { title: "of", isCorrect: false },
  { title: "him", isCorrect: false },
  { title: "as", isCorrect: false },
  { title: "book", isCorrect: false },
  { title: "was", isCorrect: false },
  { title: "help", isCorrect: false },
  { title: "then", isCorrect: false },
  { title: "time", isCorrect: false },
  { title: "wood", isCorrect: false },
  { title: "let", isCorrect: false },
  { title: "men", isCorrect: false },
  { title: "baby", isCorrect: false },
  { title: "new", isCorrect: false },
  { title: "stop", isCorrect: false },
  { title: "work", isCorrect: false },
  { title: "jump", isCorrect: false },
  { title: "part", isCorrect: false },
  { title: "fast", isCorrect: false },
  { title: "fine", isCorrect: false },
  { title: "milk", isCorrect: false },
  { title: "back", isCorrect: false },
  { title: "lost", isCorrect: false },
  { title: "find", isCorrect: false },
  { title: "paper", isCorrect: false },
  { title: "open", isCorrect: false },
  { title: "kind", isCorrect: false },
  { title: "able", isCorrect: false },
  { title: "shoes", isCorrect: false },
  { title: "money", isCorrect: false },
  { title: "great", isCorrect: false },
  { title: "father", isCorrect: false },
  { title: "river", isCorrect: false },
  { title: "space", isCorrect: false },
  { title: "short", isCorrect: false },
  { title: "left", isCorrect: false },
  { title: "people", isCorrect: false },
  { title: "almost", isCorrect: false },
  { title: "waves", isCorrect: false },
  { title: "child", isCorrect: false },
  { title: "strong", isCorrect: false },
  { title: "crowd", isCorrect: false },
  { title: "better", isCorrect: false },
  { title: "inside", isCorrect: false },
  { title: "plane", isCorrect: false },
  { title: "pretty", isCorrect: false },
  { title: "famous", isCorrect: false },
  { title: "children", isCorrect: false },
  { title: "without", isCorrect: false },
  { title: "finally", isCorrect: false },
  { title: "strange", isCorrect: false },
  { title: "budget", isCorrect: false },
  { title: "repress", isCorrect: false },
  { title: "contain", isCorrect: false },
  { title: "justice", isCorrect: false },
  { title: "morning", isCorrect: false },
  { title: "resolve", isCorrect: false },
  { title: "describe", isCorrect: false },
  { title: "garment", isCorrect: false },
  { title: "business", isCorrect: false },
  { title: "qualify", isCorrect: false },
  { title: "potent", isCorrect: false },
  { title: "collapse", isCorrect: false },
  { title: "elements", isCorrect: false },
  { title: "pioneer", isCorrect: false },
  { title: "remember", isCorrect: false },
  { title: "dangerous", isCorrect: false },
  { title: "uniform", isCorrect: false },
  { title: "necessary", isCorrect: false },
  { title: "problems", isCorrect: false },
  { title: "absentee", isCorrect: false },
  { title: "advertise", isCorrect: false },
  { title: "pleasant", isCorrect: false },
  { title: "property", isCorrect: false },
  { title: "distress", isCorrect: false },
  { title: "information", isCorrect: false },
  { title: "recession", isCorrect: false },
  { title: "understand", isCorrect: false },
  { title: "emphasis", isCorrect: false },
  { title: "confident", isCorrect: false },
  { title: "intuition", isCorrect: false },
  { title: "boisterous", isCorrect: false },
  { title: "plausible", isCorrect: false },
  { title: "courageous", isCorrect: false },
  { title: "alienate", isCorrect: false },
  { title: "extinguish", isCorrect: false },
  { title: "prairie", isCorrect: false },
  { title: "limousine", isCorrect: false },
  { title: "valentine", isCorrect: false },
  { title: "detective", isCorrect: false },
  { title: "recently", isCorrect: false },
  { title: "instruction", isCorrect: false },
  { title: "transient", isCorrect: false },
  { title: "phenomenon", isCorrect: false },
  { title: "calculated", isCorrect: false },
  { title: "alternative", isCorrect: false },
  { title: "collective", isCorrect: false },
];

const wordsData = allWords?.map((word, idx) => ({
  id: idx + 1,
  word,
}));

const theme = createTheme();

const createWordSets = (words) => {
  const sets = [];
  const wordsPerSet = 12;
  const totalSets = Math.ceil(words.length / wordsPerSet);

  for (let i = 0; i < totalSets; i++) {
    const startIdx = i * wordsPerSet;
    const endIdx = startIdx + wordsPerSet;
    const setWords = words.slice(startIdx, endIdx);

    const rows = [];
    for (let j = 0; j < setWords.length; j += 4) {
      rows.push(setWords.slice(j, j + 4));
    }

    sets.push(rows);
  }

  return sets;
};

const allWordSets = createWordSets(allWords);

const CombinedReportPage = ({
  currentWordSetIndex,
  wordsAttempted,
  onReset,
  allWords,
  transcript,
  totalSec,
  wpm,
}) => {
  const [showWordList, setShowWordList] = useState(false);
  const theme = createTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const wordCount = transcript.trim().split(/\s+/).length;
  //const wordsPerMinute = Math.round((wordCount / totalSec) * 60);
  const totalWordsInCurrentSets = (currentWordSetIndex + 1) * 12;

  //console.log("transcript", wordCount);

  const attemptedWordsCount = wordCount;
  const correctWordsCount = allWords.filter((word) => word.isCorrect).length;
  const wordsPerMinute = Math.round((correctWordsCount / totalSec) * 60);
  const unattemptedWordsCount = allWords.length - wordCount;
  const newWordsLearnt = correctWordsCount;
  const totalWordsLearnt = correctWordsCount + wpm;
  const renderResults = () => (
    <div
      style={{
        backgroundColor: "#fff",
        backgroundImage: `url(${reportStarsandcloudsImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "20px",
        width: "100%",
        //maxWidth: "1100px",
        //height: "470px",
        position: "relative",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={reportPandaImg}
        alt="Panda"
        style={{ width: isMobile ? "80px" : "100px", marginBottom: "10px" }}
      />

      <h2
        style={{
          color: "#FF7F36",
          textAlign: "center",
          margin: "0 0 5px 0",
          fontSize: isMobile ? "22px" : "28px",
          fontFamily: "Quicksand",
          fontWeight: "700",
        }}
      >
        Well done!
      </h2>
      <p
        style={{
          color: "#333F61",
          textAlign: "center",
          fontSize: isMobile ? "20px" : "26px",
          fontFamily: "Quicksand",
          marginBottom: "25px",
        }}
      >
        You're reading faster.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "50px",
          marginBottom: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={speedometerImg}
            alt="speed"
            style={{ width: isMobile ? "65px" : "80px", marginBottom: "8px" }}
          />
          <div
            style={{
              color: "#1CB0F6",
              fontSize: isMobile ? "20px" : "22px",
              fontWeight: "700",
            }}
          >
            {wordsPerMinute}
          </div>
          <div
            style={{ color: "#333F61", fontSize: isMobile ? "18px" : "20px" }}
          >
            Words Per Minute
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <img
            src={bookImg}
            alt="book"
            style={{ width: isMobile ? "65px" : "80px", marginBottom: "8px" }}
          />
          <div
            style={{
              color: "#9D4EDD",
              fontSize: isMobile ? "20px" : "22px",
              fontWeight: "700",
            }}
          >
            {newWordsLearnt}
          </div>
          <div
            style={{ color: "#333F61", fontSize: isMobile ? "18px" : "20px" }}
          >
            New Words Learnt
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <img
            src={booksStackImg}
            alt="books"
            style={{ width: isMobile ? "65px" : "80px", marginBottom: "8px" }}
          />
          <div
            style={{
              color: "#F72585",
              fontSize: isMobile ? "20px" : "22px",
              fontWeight: "700",
            }}
          >
            {totalWordsLearnt}
          </div>
          <div
            style={{ color: "#333F61", fontSize: isMobile ? "18px" : "20px" }}
          >
            Total Words Learnt
          </div>
        </div>
      </div>

      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <button
            onClick={() => setShowWordList(true)}
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "12px",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <img
              src={reportImg}
              alt="Check Report"
              style={{ width: "110px" }}
            />
          </button>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <button
          style={{
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "12px",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            //boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
          }}
          onClick={() => {
            setLocalData("tFlow", false);
            //window.location.reload();
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
          }}
        >
          <img src={nextImg} alt="Next" style={{ width: 50, height: 50 }} />
        </button>
      </Box>

      <div
        style={{
          position: "absolute",
          bottom: "-4px",
          right: "-30px",
          width: "230px",
          height: "auto",
        }}
      >
        {!isMobile && (
          <>
            <img
              src={reportBoyImg}
              alt="boy character"
              style={{ width: "200px", position: "relative", zIndex: 1 }}
            />

            <button
              onClick={() => setShowWordList(true)}
              style={{
                position: "absolute",
                bottom: "35px",
                right: "45px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              <img
                src={reportImg}
                alt="Check Report"
                style={{ width: "110px" }}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderWordList = () => {
    const getWordStyle = (item) => {
      let color = "#002B52";
      let background = "#F3F4F8";
      let borderColor = "#002B52";

      if (item.isCorrect) {
        color = "#2DB200";
        background = "#F5FFF4";
        borderColor = "#2DB200";
      } else if (item.isAttempted && !item.isCorrect) {
        color = "#C27BFF";
        background = "#FCF7FF";
        borderColor = "#C27BFF";
      } else if (!item.isAttempted) {
        color = "#002B52";
        background = "#F3F4F8";
        borderColor = "#002B52";
      }

      return {
        color,
        background,
        border: `1px solid ${borderColor}`,
        borderRadius: "13px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "18px 9px",
        fontSize: isMobile ? "14px" : "17px",
        fontWeight: 500,
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
      };
    };

    const statBoxCommon = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: isMobile ? 2 : 4,
      py: isMobile ? 1 : 2,
      borderRadius: "16px",
      backgroundColor: "#FFFFFF",
      fontWeight: 600,
      fontSize: isMobile ? 14 : 18,
      textAlign: "center",
      minWidth: isMobile ? "auto" : "170px",
    };

    const statStyles = {
      attempted: {
        ...statBoxCommon,
        color: "#A856FF",
        border: "1px solid #A856FF",
        boxShadow: "0 4px 0 #A856FF",
      },
      correct: {
        ...statBoxCommon,
        color: "#6CC227",
        border: "1px solid #6CC227",
        boxShadow: "0 4px 0 #6CC227",
      },
      unattempted: {
        ...statBoxCommon,
        color: "#002B52",
        border: "1px solid #002B52",
        boxShadow: "0 4px 0 #333F61",
      },
    };

    return (
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          p: isMobile ? 2 : 4,
          width: isMobile ? "95%" : "90%",
          //maxWidth: "1200px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          position: "relative",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? 1 : 3,
            flexWrap: "wrap",
            mb: isMobile ? 2 : 4,
          }}
        >
          <Box sx={statStyles.attempted}>
            Attempted Words: {attemptedWordsCount}
          </Box>
          <Box sx={statStyles.correct}>Correct Words: {correctWordsCount}</Box>
          <Box sx={statStyles.unattempted}>
            Unattempted Words: {unattemptedWordsCount}
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
            gap: "18px",
            mb: 4,
          }}
        >
          {allWords.map((item, index) => (
            <Box
              key={index}
              sx={{
                ...getWordStyle(item),
                width: isMobile ? "90px" : "150px",
                margin: "0 auto",
              }}
            >
              {item.title}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <button
            style={{
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "12px",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              //boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
            }}
            onClick={() => setShowWordList(false)}
          >
            <img src={nextImg} alt="Next" style={{ width: 50, height: 50 }} />
          </button>
        </Box>
      </Box>
    );
  };

  return (
    <div
      style={{
        backgroundColor: showWordList ? "#C6EDFF" : "#d8f0fc",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "0px" : "0px",
        alignContent: "center",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      {showWordList ? renderWordList() : renderResults()}
    </div>
  );
};

const TowreFlow = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  //handleNext,
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
  //loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  fluency,
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  gameOverData,
  highlightWords,
  matchedChar,
  isNextButtonCalled,
  setIsNextButtonCalled,
  vocabCount,
  wordCount,
}) => {
  const [activeSet, setActiveSet] = useState(0);
  const [currentWordSetIndex, setCurrentWordSetIndex] = useState(0);
  const [message, setMessage] = useState(
    "Look at the words.\nYou'll read them soon — left to right, top to bottom"
  );
  const [showCountdown, setShowCountdown] = useState(false);
  const [count, setCount] = useState(3);
  const [showFinalWords, setShowFinalWords] = useState(false);
  const [completedAllSets, setCompletedAllSets] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(45);
  const [wordsAttempted, setWordsAttempted] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [transcripts, setTranscripts] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [totalSec, setTotalSec] = useState(null);
  const [finalTranscript, setFinalTranscript] = useState("");
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const currentWordSet = allWordSets[currentWordSetIndex];
  const transcriptRef = useRef("");
  const lang = getLocalData("lang");

  useEffect(() => {
    transcriptRef.current = transcript;
    //console.log("Live Transcript:", transcript);
  }, [transcript]);

  useEffect(() => {
    let interval;
    if (showFinalWords && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (showResults) {
            clearInterval(interval);
            return prevTimer;
          }

          if (prevTimer <= 1) {
            const endTime = Date.now();
            const elapsedSeconds = (endTime - startTime) / 1000;
            //console.log("testingg");
            setTotalSec(elapsedSeconds);
            stopAudioRecording();
            setLoading(true);
            clearInterval(interval);
            setShowResults(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showFinalWords, timer]);

  useEffect(() => {
    if (!showFinalWords && !showCountdown && !showResults) {
      const interval = setInterval(() => {
        setHandPosition((prev) => ({
          x: prev.x === 10 ? -10 : 10,
          y: 0,
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showFinalWords, showCountdown, showResults]);

  const handleNext = () => {
    if (activeSet === 0) {
      setMessage("Here come your next words!");
      setActiveSet(1);
    } else if (activeSet === 1) {
      setMessage("Great job! Here come your next words.");
      setActiveSet(2);
    } else if (activeSet === 2) {
      setMessage(
        "You'll go to the next set of words, when you click the button below."
      );
      setActiveSet(3);
    } else if (activeSet === 3) {
      setMessage(
        "If you are not able to speak a word, You can move to the next word."
      );
      setActiveSet(4);
    } else if (activeSet === 4) {
      isMobile
        ? setMessage("Are You Ready? You'll have 45 seconds.")
        : setMessage("Are You Ready?⏱️ You'll have 45 seconds.");
      setActiveSet(5);
    } else if (activeSet === 5) {
      startCountdown();
    }
  };

  const handleNextWordSet = () => {
    if (currentWordSetIndex < allWordSets.length - 1) {
      setCurrentWordSetIndex(currentWordSetIndex + 1);
      setActiveSet(0);
      setMessage("Read the words out\nloud one by one!\nStart from top left");
    } else {
      const endTime = Date.now();
      const elapsedSeconds = (endTime - startTime) / 1000;
      setTotalSec(elapsedSeconds);
      stopAudioRecording();
      setLoading(true);
      setCompletedAllSets(true);
      setShowResults(true);
    }
  };

  const startCountdown = () => {
    setShowCountdown(true);
    startAudioRecording();
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
      language: "en-US",
    });
    let counter = 3;
    setCount(counter);
    const interval = setInterval(() => {
      if (counter > 1) {
        counter--;
        setCount(counter);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowCountdown(false);
          setShowFinalWords(true);
          setTimer(45);
          setStartTime(Date.now());

          const wpm = Math.round((wordsAttempted / 45) * 60);
          setWordsPerMinute(wpm);
        }, 500);
      }
    }, 1000);
  };

  const resetActivity = () => {
    setCurrentWordSetIndex(0);
    setShowFinalWords(false);
    setActiveSet(0);
    setMessage("Read the words out\nloud one by one!\nStart from top left");
    setCompletedAllSets(false);
    setShowResults(false);
    setTimer(45);
    setWordsAttempted(0);
    setWordsPerMinute(0);
  };

  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .split(/\s+/);

  const getPhonetic = (word) => doubleMetaphone(word)[0];

  const startAudioRecording = async () => {
    try {
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        //console.log("Recording stopped.");
        if (chunksRef.current.length === 0) {
          console.warn("No data to create blob.");
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedAudioBlob(audioBlob);
        chunksRef.current = [];

        streamRef.current?.getTracks().forEach((track) => track.stop());

        try {
          setLoading(true);
          const transcriber = await pipeline(
            "automatic-speech-recognition",
            ""
          );

          const audioUrl = URL.createObjectURL(audioBlob);

          const output = await transcriber(audioUrl, {
            chunk_length_s: 20,
            stride_length_s: 5,
          });

          //console.log("Transcription result:", output.text);

          const transcripts = output.text;
          setTranscripts(transcripts);
          const transcriptWords = normalize(transcripts);
          const transcriptPhonetics = new Set(transcriptWords.map(getPhonetic));

          allWords.forEach((word) => {
            const lower = word?.title?.toLowerCase();
            const isSpoken =
              transcriptWords.includes(lower) ||
              transcriptPhonetics.has(getPhonetic(lower));

            word.isCorrect = isSpoken;
          });

          await addTowreRecord(audioBlob, allWords);

          setLoading(false);
          setCompleted(true);
        } catch (error) {
          console.error("Error during transcription:", error);
          //console.log("transcriptok", transcriptRef.current);
          setTranscripts(transcriptRef.current);
          const transcriptWords = normalize(transcriptRef.current);
          const transcriptPhonetics = new Set(transcriptWords.map(getPhonetic));

          allWords.forEach((word) => {
            const lower = word?.title?.toLowerCase();
            const isSpoken =
              transcriptWords.includes(lower) ||
              transcriptPhonetics.has(getPhonetic(lower));

            word.isCorrect = isSpoken;
          });

          try {
            await addTowreRecord(audioBlob, allWords);
          } catch (apiErr) {
            console.error("Error sending TOWRE record:", apiErr);
            setLoading(false);
            setCompleted(true);
          }

          setLoading(false);
          setCompleted(true);
        }
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("🚨 Error starting audio recording:", error);
    }
  };

  const stopAudioRecording = () => {
    SpeechRecognition.stopListening();
    setFinalTranscript(transcriptRef.current);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    } else {
      console.warn("Recorder already inactive or null.");
    }
  };

  if (showResults && !loading) {
    return (
      <CombinedReportPage
        currentWordSetIndex={currentWordSetIndex}
        wordsAttempted={wordsAttempted}
        onReset={resetActivity}
        allWords={allWords}
        transcript={transcripts}
        totalSec={totalSec}
        wpm={vocabCount}
      />
    );
  }

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m8"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      fluency={false}
      lang={lang}
      //={recAudio}
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
          //backgroundColor: "#dff3fc",
          //minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!loading && isStarted && (
          <div
            style={{
              width: "95%",
              maxWidth: 1150,
              background: "#fff",
              borderRadius: 20,
              padding: "0 20px",
              position: "relative",
              overflow: "hidden",
              height: "530px",
            }}
          >
            {showCountdown && !loading ? (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "20px 0",
                }}
              >
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: "bold",
                      color: "#1d3557",
                    }}
                  >
                    Get ready to read the words!
                  </div>
                  <div style={{ fontSize: 16, color: "#444", marginTop: 6 }}>
                    Read the words out loud as fast as you can in 45 seconds.
                  </div>
                </div>

                <div style={{ flex: 1 }}></div>

                <div style={{ position: "relative", height: 180 }}>
                  <div
                    style={{
                      position: "absolute",
                      bottom: isMobile ? 150 : 116,
                      right: isMobile ? 140 : 237,
                      width: isMobile ? 150 : 183,
                      height: isMobile ? 100 : 120,
                    }}
                  >
                    <img
                      src={timerBoxImg}
                      alt="timerBox"
                      style={{ width: "100%", height: "100%" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "35%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: isMobile ? 12 : 14,
                          fontWeight: "bold",
                        }}
                      >
                        Starts In
                      </div>
                      <div
                        style={{
                          fontSize: isMobile ? 24 : 28,
                          fontWeight: "bold",
                          color: "#ff6e00",
                        }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>

                  <img
                    src={pandaTimerImg}
                    alt="panda"
                    style={{
                      height: isMobile ? 150 : 180,
                      position: "absolute",
                      right: 100,
                      bottom: 20,
                    }}
                  />
                </div>
              </div>
            ) : completedAllSets && !loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{ fontSize: 28, color: "#1d3557", marginBottom: 20 }}
                >
                  Activity Completed!
                </h2>
                <p style={{ fontSize: 18, marginBottom: 30 }}>
                  You've gone through all the word sets.
                </p>
                <button
                  onClick={() => setShowResults(true)}
                  style={{
                    backgroundColor: "#ff6e00",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 20,
                    fontSize: 16,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  View Results
                </button>
              </div>
            ) : showFinalWords && !loading ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={clockImg}
                      alt="clock"
                      style={{ width: isMobile ? 50 : 60 }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      {timer}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#FFDBDB",
                    borderRadius: 30,
                    padding: isMobile ? "6px 18px" : "6px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    position: "absolute",
                    right: 10,
                    top: 10,
                  }}
                >
                  <img
                    src={pauseImg}
                    alt="pause"
                    style={{
                      width: isMobile ? 12 : 14,
                      height: isMobile ? 12 : 14,
                    }}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#d00",
                      fontSize: isMobile ? 12 : 14,
                    }}
                  >
                    Recording
                  </span>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {currentWordSet.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: isMobile ? 7 : 5,
                        marginLeft: isMobile ? "2px" : "40px",
                        marginRight: isMobile ? "2px" : "40px",
                      }}
                    >
                      {row.map((wordObj, colIndex) => (
                        <div
                          key={colIndex}
                          style={{
                            position: "relative",
                            width: 180,
                            height: 110,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 10,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={boxImg}
                            alt="box"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              opacity: 1,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              fontWeight: 700,
                              fontSize: isMobile ? 12 : 20,
                            }}
                          >
                            {wordObj.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={handleNextWordSet}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <img src={nextImg} alt="next" style={{ width: 60 }} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    backgroundColor: "#FFDBDB",
                    borderRadius: 30,
                    padding: "6px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? 2 : 10,
                    position: "absolute",
                    right: isMobile ? 4 : 20,
                    top: 20,
                  }}
                >
                  <img
                    src={pauseImg}
                    alt="pause"
                    style={{ width: 14, height: 14 }}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#d00",
                      fontSize: isMobile ? 11 : 14,
                    }}
                  >
                    Recording
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 20,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={clockImg}
                      alt="clock"
                      style={{ width: isMobile ? 50 : 60 }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      45
                    </div>
                  </div>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {currentWordSet.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 6,
                        marginLeft: "40px",
                        marginRight: "40px",
                        position: "relative",
                      }}
                    >
                      {row.map((wordObj, colIndex) => {
                        const isActive =
                          activeSet < currentWordSet.length &&
                          rowIndex === activeSet;
                        const boxImage = isActive ? activeboxImg : boxImg;

                        return (
                          <div
                            key={colIndex}
                            style={{
                              position: "relative",
                              width: isMobile ? 200 : 180,
                              height: 110,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 10,
                            }}
                          >
                            {isActive && colIndex === 0 && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: -20,
                                  left: "29%",
                                  transform: `translateX(-50%) translate(${handPosition.x}px, ${handPosition.y}px)`,
                                  transition: "transform 0.3s ease",
                                  zIndex: 10,
                                }}
                              >
                                <img
                                  src={handImg}
                                  alt="hand"
                                  style={{
                                    width: 40,
                                    height: 40,
                                    filter:
                                      "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))",
                                  }}
                                />
                              </div>
                            )}
                            <img
                              src={boxImage}
                              alt="box"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                opacity: 1,
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                color: isActive ? "#000" : "#aaa",
                                fontWeight: 600,
                                fontSize: isMobile ? 11 : 20,
                              }}
                            >
                              {wordObj.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: 30,
                    right: 20,
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  {/* Message Bubble */}
                  <div
                    style={{
                      position: "relative",
                      width: isMobile ? "220px" : "250px",
                      height: isMobile ? "220px" : "180px",
                      marginRight: 10,
                      transform: "translateY(-40%)",
                    }}
                  >
                    <img
                      src={initialMessageBoxImg}
                      alt="message box"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        position: "absolute",
                      }}
                    />

                    {/* Hide arrow for this specific message */}
                    {message !==
                      "You'll go to the next set of words when you click the button below." &&
                      message !==
                        "If you are not able to speak a word, You can move to the next word." && (
                        <img
                          src={arrowImg}
                          alt="arrow"
                          style={{
                            width: isMobile ? "50px" : "80px",
                            position: "absolute",
                            top: "15px",
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                        />
                      )}

                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: "pre-line",
                          fontSize: isMobile ? "11px" : "14px",
                          marginBottom: "15px",
                          lineHeight: "1.5",
                          color: "#333F61",
                          fontFamily: "Quicksand",
                          fontWeight: 600,
                        }}
                      >
                        {message}
                      </div>

                      {message ===
                      "You'll go to the next set of words\nwhen you click the button below." ? (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -30,
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          {/* <img
            src={handImg}
            alt="hand"
            style={{
              width: 40,
              height: 40,
              filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))",
              transform: "rotate(-30deg)",
            }}
          /> */}
                          <button
                            onClick={handleNext}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src={Assets.startNewButtonImg}
                              alt="next"
                              style={{ width: isMobile ? "30px" : 60 }}
                            />
                          </button>
                        </div>
                      ) : message ===
                        "Are You Ready?⏱️ You'll have 45 seconds." ? (
                        <img
                          src={Assets.startNewButtonImg}
                          alt="start"
                          style={{
                            width: isMobile ? "30px" : "60px",
                            cursor: "pointer",
                          }}
                          onClick={startCountdown}
                        />
                      ) : (
                        <img
                          src={Assets.startNewButtonImg}
                          alt="next"
                          style={{
                            height: isMobile ? "30px" : "45px",
                            cursor: "pointer",
                          }}
                          onClick={handleNext}
                        />
                      )}
                    </div>
                  </div>

                  {/* Panda (stays in original position) */}
                  <img
                    src={pandaImg}
                    alt="panda"
                    style={{
                      height: isMobile ? 120 : 150,
                      marginBottom: "-15px",
                    }}
                  />
                </div>
                {message ===
                  "You'll go to the next set of words\nwhen you click the button below." && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 5,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      zIndex: 10,
                    }}
                  >
                    <img
                      src={handImg}
                      alt="hand"
                      style={{
                        width: 30,
                        height: 30,
                        filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))",
                        transform: "rotate(0deg)",
                      }}
                    />
                    <button
                      onClick={handleNext}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      <img src={nextImg} alt="next" style={{ width: 40 }} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {!isStarted && (
          <div
            style={{
              width: "95%",
              maxWidth: 1150,
              backgroundImage: `url(${Assets.yellowLightImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 20,
              padding: "0 20px",
              position: "relative",
              overflow: "hidden",
              height: "530px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={Assets.confettiImg}
              alt="Confetti"
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                maxWidth: 500,
                pointerEvents: "none",
              }}
            />

            <div style={{ textAlign: "center", zIndex: 1 }}>
              <h2
                style={{
                  fontFamily: "Quicksand",
                  fontWeight: 1200,
                  fontSize: "56px",
                  lineHeight: "60px",
                  textAlign: "center",
                  color: "#FF9050",
                  marginBottom: "20px",
                }}
              >
                Bonus Round!
              </h2>
              <img
                src={Assets.birthdayBoxImg}
                alt="Birthday Box"
                style={{
                  maxWidth: "200px",
                  width: "100%",
                  marginBottom: "20px",
                }}
              />
              <img
                src={Assets.startButtonImg}
                alt="Start Button"
                style={{ maxWidth: "180px", width: "100%", cursor: "pointer" }}
                onClick={() => {
                  setIsStarted(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TowreFlow;
