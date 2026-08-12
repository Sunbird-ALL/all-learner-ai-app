import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import Confetti from "react-confetti";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
  setLocalData,
  getBrowserLanguage,
} from "../../utils/constants";
// import Play from "../../assets/playButton.svg";
import { getUiStrings } from "../../constants/strings";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MainLayout from "../Layout/MainLayout";
import SafeYouTubePlayer from "../SafeYouTubePlayer";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  fetchASROutput,
  handleTextEvaluation,
  callTelemetryApi,
} from "../../utils/apiUtil";
import { filterBadWords } from "@tekdi/multilingual-profanity-filter";
import AudioTooltipModal from "./AudioTooltipModal";
import { doubleMetaphone } from "double-metaphone";
import Lottie from "lottie-react";
import {
  transliterateKannadaToLatin,
  compareWords,
} from "../../utils/textUtils";
import VoiceAnalyser from "../../utils/VoiceAnalyser";

import bearimg from "../../assets/bearspek.svg";
import iconimg from "../../assets/icon.svg";
import listeenimg from "../../assets/listeen.svg";
import wordheadingimg from "../../assets/wordhead.svg";
import emptyimg from "../../assets/Empty.svg";
import starimg from "../../assets/star.svg";
import beariconimg from "../../assets/bearicon.svg";
import bearclapimg from "../../assets/bearclap.svg";
import starbackgroundimg from "../../assets/starsandclouds.png";
import bearrdanceimg from "../../assets/bearrdance.svg";
import hintimg from "../../assets/hintsicon.svg";

const isChrome = true;
const theme = createTheme();

const useBreakpoints = () => ({
  isMobile: useMediaQuery(theme.breakpoints.down("sm")),
  isTablet: useMediaQuery(theme.breakpoints.between("sm", "md")),
});

const BingoPage = React.memo(
  ({
    transformed,
    setVoiceText,
    setRecordedAudio,
    setVoiceAnimate,
    storyLine,
    enableNext,
    isShowCase,
    isDiscover,
    contentId,
    contentType,
    currentStep,
    playTeacherAudio,
    callUpdateLearner,
    setOpenMessageDialog,
    setEnableNext,
    vocabCount,
    wordCount,
    handleNext,
  }) => {
    const { isMobile, isTablet } = useBreakpoints();

    const firstWord = transformed?.arrM?.[0];
    const [localShowConfetti, setLocalShowConfetti] = useState(false);
    const [localCurrent, setLocalCurrent] = useState(0);
    const [localIsNextButtonCalled, setLocalIsNextButtonCalled] =
      useState(false);
    const [localIsRecordingComplete, setLocalIsRecordingComplete] =
      useState(false);
    const [localRecAudio, setLocalRecAudio] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0); // Track current word index
    const [isRecordingDone, setIsRecordingDone] = useState(false); // Track if recording is completed
    const correctPracticeWords = getLocalData("correctPracticeWords");
    const [currentText, setCurrentText] = useState("");
    const sessionId = getLocalData("sessionId");

    let progressDatas = getLocalData("practiceProgress");
    //const virtualId = String(getLocalData("virtualId"));

    if (typeof progressDatas === "string") {
      progressDatas = JSON.parse(progressDatas);
    }

    let currentPracticeStep;
    if (progressDatas) {
      currentPracticeStep = progressDatas?.currentPracticeStep;
    }

    let currentLevel = practiceSteps?.[currentPracticeStep]?.title || "L1";

    const currentWord = useMemo(() => {
      return transformed?.arrM?.[currentWordIndex];
    }, [transformed, currentWordIndex]);

    const updateStoredData = useCallback((audio, isCorrect) => {}, []);

    const handleRecordingComplete = useCallback((base64Data) => {
      if (base64Data) {
        setLocalIsRecordingComplete(true);
        setLocalRecAudio(base64Data);
        setIsRecordingDone(true);
      } else {
        setLocalIsRecordingComplete(false);
        setLocalRecAudio(null);
        setIsRecordingDone(false);
      }
    }, []);

    const handleStartRecording = useCallback(() => {
      setLocalRecAudio(null);
      setIsRecordingDone(false);
    }, []);

    const handleStopRecording = useCallback(() => {}, []);

    const handleNextWord = useCallback(() => {
      handleNext();
      // const newWordData = {
      //   original_text: currentWord,
      //   content_id: contentId,
      //   milestone_level: "m2",
      //   practice_level: currentLevel,
      //   session_id: sessionId,
      //   practiced: true,
      //   learned: true,
      //   subsession_id: "session_123",
      // };

      // setLocalData("correctPracticeWords", [
      //   ...(correctPracticeWords || []),
      //   newWordData,
      // ]);
      if (currentWordIndex < transformed?.arrM?.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
        setIsRecordingDone(false);
        setLocalIsRecordingComplete(false);
        setLocalRecAudio(null);
        setLocalShowConfetti(false);
      }
    }, [currentWordIndex, transformed]);

    useEffect(() => {
      if (localIsRecordingComplete) {
        setLocalShowConfetti(true);
        setTimeout(() => {
          setLocalShowConfetti(false);
        }, 3000);
      }
    }, [localIsRecordingComplete]);

    return (
      <div
        style={{
          borderRadius: "20px",
          padding: isMobile ? "20px 0px" : isTablet ? "32px 40px" : "40px 60px",
          textAlign: "center",
          width: "100%",
          maxWidth: "1130px",
          flex: isMobile ? 1 : undefined,
          minHeight: isMobile ? undefined : isTablet ? "380px" : "450px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {localShowConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: isMobile ? "28px" : isTablet ? "38px" : "50px",
                fontWeight: "700",
                color: "rgba(51,63,97,1)",
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {currentWord}
            </span>
          </div>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <VoiceAnalyser
              key={`voice-${currentWordIndex}`}
              pageName={"wordsorimage"}
              setVoiceText={setVoiceText}
              updateStoredData={updateStoredData}
              setRecordedAudio={setRecordedAudio}
              setVoiceAnimate={setVoiceAnimate}
              storyLine={storyLine}
              originalText={currentWord}
              handleNext={handleNextWord}
              enableNext={enableNext}
              isShowCase={isShowCase || isDiscover}
              handleRecordingComplete={handleRecordingComplete}
              handleStartRecording={handleStartRecording}
              handleStopRecording={handleStopRecording}
              audioLink={transformed?.imageAudioMap?.[currentWord]?.audio}
              noOffline={true}
              isNextButtonCalled={localIsNextButtonCalled}
              setIsNextButtonCalled={setLocalIsNextButtonCalled}
              setEnableNext={setEnableNext}
              autoStart={false}
              showAnimation={false}
              contentId={contentId}
              contentType={contentType}
              currentLine={currentStep - 1}
              playTeacherAudio={playTeacherAudio}
              callUpdateLearner={callUpdateLearner}
              setOpenMessageDialog={setOpenMessageDialog}
            />

            {/* Next Button - Only show after recording is completed */}
            {/* {isRecordingDone && (
            <div 
              style={{
                marginTop: "20px",
                cursor: "pointer",
                transition: "transform 0.2s ease"
              }}
              onClick={handleNextWord}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <img 
                src={nextimg} 
                alt="next" 
                style={{ 
                  width: "80px", 
                  height: "40px",
                }} 
              />
              <div style={{
                fontSize: "12px",
                color: "rgba(51,63,97,0.7)",
                marginTop: "5px"
              }}>
                Next Word
              </div>
            </div>
          )} */}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "65px" : isTablet ? "-20px" : "30px",
            left: isMobile ? "-10px" : isTablet ? "-20px" : "25px",
          }}
        >
          <img
            src={bearimg}
            alt="bear"
            style={{
              width: isMobile ? "100px" : isTablet ? "120px" : "150px",
              height: isMobile ? "130px" : isTablet ? "160px" : "200px",
            }}
          />
        </div>

        {localShowConfetti && (
          <img
            src={bearrdanceimg}
            alt="bear dancing"
            style={{
              position: "absolute",
              bottom: "-42px",
              left: "25%",
              transform: "translateX(-50%)",
              height: isMobile ? "140px" : isTablet ? "170px" : "200px",
              animation: "jump 1.3s ease-in-out infinite",
              userSelect: "none",
              pointerEvents: "none",
              zIndex: 1000,
            }}
            draggable={false}
          />
        )}
      </div>
    );
  }
);

const SuccessPage = React.memo(({ score, completedPairs, onNext }) => {
  const { isMobile, isTablet } = useBreakpoints();
  const ui = getUiStrings(getLocalData("lang"));

  return (
    <div
      style={{
        backgroundColor: "#fff",
        marginTop: isMobile ? undefined : "5%",
        borderRadius: "20px",
        padding: isMobile ? "10px 16px" : isTablet ? "32px 40px" : "40px 60px",
        textAlign: "center",
        position: "relative",
        width: "100%",
        maxWidth: "1130px",
        boxShadow: "0px 0px 16.9px 0px rgba(219,242,254,1)",
        border: "2px solid rgba(231,232,236,1)",
        backgroundImage: `url(${starbackgroundimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        flex: isMobile ? 1 : undefined,
        minHeight: isMobile ? undefined : isTablet ? "400px" : "450px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: isMobile ? "12px" : isTablet ? "14px" : "16px",
        boxSizing: "border-box",
      }}
    >
      <img
        src={beariconimg}
        alt="bear icon"
        style={{
          width: isMobile ? "40px" : isTablet ? "60px" : "80px",
          height: isMobile ? "40px" : isTablet ? "60px" : "80px",
        }}
      />

      <h1
        style={{
          fontSize: isMobile ? "24px" : isTablet ? "28px" : "32px",
          fontWeight: "700",
          color: "rgba(255, 127, 54, 1)",
          margin: 0,
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        {ui.BINGO_WELL_DONE}
      </h1>

      <div
        style={{
          position: "relative",
          width: isMobile ? "80px" : isTablet ? "90px" : "100px",
          height: isMobile ? "80px" : isTablet ? "90px" : "100px",
          zIndex: 5,
        }}
      >
        <img
          src={starimg}
          alt="star"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: isMobile ? "20px" : isTablet ? "22px" : "26px",
            fontWeight: "700",
            color: "#181414ff",
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          {score}
        </span>
      </div>

      <p
        style={{
          fontSize: isMobile ? "15px" : isTablet ? "16px" : "18px",
          fontWeight: "600",
          color: "rgba(51, 63, 97, 1)",
          margin: 0,
        }}
      >
        {ui.BINGO_WORDS_FOUND.replace("{count}", completedPairs.length)}
      </p>

      <img
        src={Assets.nextimg}
        alt="next"
        role="button"
        tabIndex={0}
        style={{
          width: isMobile ? "80px" : isTablet ? "90px" : "100px",
          height: isMobile ? "36px" : isTablet ? "40px" : "45px",
          cursor: "pointer",
          marginTop: "4px",
        }}
        onClick={onNext}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") e.currentTarget.click();
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: isMobile ? "10px" : "-37px",
          left: isMobile ? "-10px" : "-20px",
        }}
      >
        <img
          src={bearclapimg}
          alt="bear clapping"
          style={{
            width: isMobile ? "100px" : isTablet ? "120px" : "150px",
            height: isMobile ? "100px" : isTablet ? "130px" : "160px",
          }}
        />
      </div>
    </div>
  );
});

const BingoCard = ({
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
}) => {
  const [showHint, setShowHint] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const [winEffect, setWinEffect] = useState(false);
  const [coins, setCoins] = useState(0);
  const [showWrongWord, setShowWrongWord] = useState(false);
  const [highlightCorrectWords, setHighlightCorrectWords] = useState(false);
  const [highlightedButtonIndex, setHighlightedButtonIndex] = useState(-1);
  const [showCoinsImg, setShowCoinsImg] = useState(false);
  const [showEmptyImg, setShowEmptyImg] = useState(false);
  const [hideCoinsImg, setHideCoinsImg] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showInitialEffect, setShowInitialEffect] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [showRecording, setShowRecording] = useState(false);
  const [abusiveFound, setAbusiveFound] = useState(false);
  const [detectedWord, setDetectedWord] = useState("");
  const [language, setLanguage] = useState(getLocalData("lang") || "en");
  const [showWrongTick, setShowWrongTick] = useState(true);
  const { isMobile, isTablet } = useBreakpoints();
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [transformed, setTransformed] = useState(null);

  // New UI states
  const [selected, setSelected] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [completedPairs, setCompletedPairs] = useState([]);
  const [wrongPair, setWrongPair] = useState([]);
  const [score, setScore] = useState(0);
  const [matchedPair, setMatchedPair] = useState(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [currentHintPair, setCurrentHintPair] = useState(null);
  const [showFlyingStar, setShowFlyingStar] = useState(false);
  const [disabledWords, setDisabledWords] = useState([]);
  const [showBingoPage, setShowBingoPage] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);

  const validPairs = {
    sun: ["su", "n"],
    zoo: ["zo", "o"],
    zip: ["zi", "p"],
    leg: ["le", "g"],
    day: ["da", "y"],
    railway: ["rail", "way"],
    cow: ["c", "ow"],
    out: ["ou", "t"],
    joy: ["jo", "y"],
    saw: ["sa", "w"],
    water: ["wat", "er"],
    brother: ["brot", "her"],
    ear: ["ea", "r"],
    hair: ["ha", "ir"],
    sunset: ["sun", "set"],
    lazy: ["la", "zy"],
    onion: ["oni", "on"],
    ray: ["ra", "y"],
    lemon: ["le", "mon"],
    coffee: ["cof", "fee"],
    ಅಂಗಡಿ: ["ಅಂಗ", "ಡಿ"],
    ಕಿಟಕಿ: ["ಕಿ", "ಟಕಿ"],
    ದಿನಾಂಕ: ["ದಿನಾಂ", "ಕ"],
    ಮೂಸಂಬಿ: ["ಮೂ", "ಸಂಬಿ"],
    ಮಹಾರಾಜ: ["ಮಹಾ", "ರಾಜ"],
    ಅಜ್ಜ: ["ಅ", "ಜ್ಜ"],
    ಜಾತ್ರೆ: ["ಜಾ", "ತ್ರೆ"],
    ಸೂರ್ಯ: ["ಸೂ", "ರ್ಯ"],
    ಧಾನ್ಯ: ["ಧಾ", "ನ್ಯ"],
    ಅಕ್ಷರ: ["ಅ", "ಕ್ಷರ"],
    ಶಿಕ್ಷಕಿ: ["ಶಿ", "ಕ್ಷಕಿ"],
    ಕಬ್ಬಿಣ: ["ಕ", "ಬ್ಬಿಣ"],
    ಗುದ್ದಲಿ: ["ಗು", "ದ್ದಲಿ"],
    ತುತ್ತೂರಿ: ["ತುತ್ತೂ", "ರಿ"],
    ಆಕಾಶ: ["ಆ", "ಕಾಶ"],
    ಕೋಗಿಲೆ: ["ಕೋ", "ಗಿಲೆ"],
    ನೇಗಿಲು: ["ನೇ", "ಗಿಲು"],
    ರೂಪಾಯಿ: ["ರೂ", "ಪಾಯಿ"],
    ಜೋಕಾಲಿ: ["ಜೋ", "ಕಾಲಿ"],
    ಪಾರಿವಾಳ: ["ಪಾ", "ರಿವಾಳ"],
    ಮೃಗಾಲಯ: ["ಮೃಗಾ", "ಲಯ"],
    ಬೆಂಗಳೂರು: ["ಬೆಂಗ", "ಳೂರು"],
    ಗಡಿಯಾರ: ["ಗಡಿ", "ಯಾರ"],
    ದಾಸವಾಳ: ["ದಾಸ", "ವಾಳ"],
    ನಾಲ್ಕು: ["ನಾ", "ಲ್ಕು"],
    ವಾಕ್ಯ: ["ವಾ", "ಕ್ಯ"],
    ಶಬ್ದ: ["ಶ", "ಬ್ದ"],
    ಪುಸ್ತಕ: ["ಪು", "ಸ್ತಕ"],
    ಖಡ್ಗ: ["ಖ", "ಡ್ಗ"],
    ಪಕ್ಷಿ: ["ಪ", "ಕ್ಷಿ"],
    ಸನ್ಮಾನ: ["ಸ", "ನ್ಮಾನ"],
    ಉತ್ಸವ: ["ಉ", "ತ್ಸವ"],
    ಶಿಲ್ಪಿ: ["ಶಿ", "ಲ್ಪಿ"],
    ಸ್ನೇಹಿತ: ["ಸ್ನೇ", "ಹಿತ"],

    సంతోషం: ["సం", "తోషం"],
    పసుపు: ["ప", "సుపు"],
    బంగారం: ["బం", "గారం"],
    గులాబీ: ["గులా", "బీ"],
    కాగితం: ["కా", "గితం"],
    మైదాకు: ["మై", "దాకు"],
    ఉంగరం: ["ఉంగ", "రం"],
    తంగేడు: ["తం", "గేడు"],
    కుందేలు: ["కుం", "దేలు"],
    చెరువు: ["చెరు", "వు"],
    పాఠశాల: ["పాఠ", "శాల"],
    లేగదూడ: ["లేగ", "దూడ"],
    గడ్డి: ["గ", "డ్డి"],
    చామంతి: ["చా", "మంతి"],
    బాలుడు: ["బా", "లుడు"],
    చదరంగం: ["చద", "రంగం"],
    తేనెటీగ: ["తేనె", "టీగ"],
    పెదవులు: ["పెద", "వులు"],
    చక్రం: ["చ", "క్రం"],
    చుక్క: ["చు", "క్క"],
    పండ్లు: ["పం", "డ్లు"],
    అమ్మ: ["అ", "మ్మ"],
    కాళ్ళు: ["కా", "ళ్ళు"],
    పుష్పం: ["పు", "ష్పం"],
    నవ్వు: ["న", "వ్వు"],
    కొబ్బరి: ["కొబ్బ", "రి"],
    కట్టడం: ["కట్ట", "డం"],
    ఉయ్యాల: ["ఉయ్యా", "ల"],
    యుద్ధం: ["యు", "ద్ధం"],
    ఇచ్ఛ: ["ఇ", "చ్ఛ"],
    దుర్భిణి: ["దుర్భి", "ణి"],
    శబ్దం: ["శ", "బ్దం"],
    నిష్ఠ: ["ని", "ష్ఠ"],
    స్ఫటిక: ["స్ఫ", "టిక"],
    దర్శనం: ["దర్శ", "నం"],

    गुलाबी: ["गु", "लाबी"],
    तितली: ["तित", "ली"],
    मैदान: ["मै", "दान"],
    साइकिल: ["साइ", "किल"],
    बाज़ार: ["बाज़ा", "र"],
    मिठाई: ["मि", "ठाई"],
    खिलौने: ["खिलौ", "ने"],
    चिड़िया: ["चिड़ि", "या"],
    चमेली: ["च", "मेली"],
    परिवार: ["परि", "वार"],
    दरवाज़ा: ["दर", "वाज़ा"],
    रेलगाड़ी: ["रेल", "गाड़ी"],
    लहसुन: ["लह", "सुन"],
    नारियल: ["नारि", "यल"],
    गुड़िया: ["गु", "ड़िया"],
    मछलियाँ: ["मछ", "लियाँ"],
    आसमान: ["आस", "मान"],
    केतकी: ["केत", "की"],
    फिरकनी: ["फिर", "कनी"],
    बारिश: ["बा", "रिश"],

    नेपाली: ["ने", "पाली"],
    बिरालो: ["बि", "रालो"],
    माझी: ["मा", "झी"],
    बेलुका: ["बे", "लुका"],
    चौबीस: ["चौ", "बीस"],
    झोला: ["झो", "ला"],
    बटुका: ["बटु", "का"],
    गाड़ी: ["गा", "ड़ी"],
    लुगाफाटा: ["लुगा", "फाटा"],
    खानेकुरा: ["खाने", "कुरा"],
    बोटबिरुवा: ["बोट", "बिरुवा"],
    बत्ती: ["ब", "त्ती"],
    पक्षी: ["प", "क्षी"],
    नदीनाला: ["नदी", "नाला"],
    विद्यालय: ["विद्या", "लय"],
    परिवार: ["परि", "वार"],
    पुस्तकालय: ["पुस्त", "कालय"],
    फूलबारी: ["फूल", "बारी"],
    बातचित: ["बात", "चित"],
    छात्रा: ["छा", "त्रा"],
  };

  useEffect(() => {
    if (parentWords && parentWords.imageAudioMap) {
      const newTransformed = {
        words: parentWords.words,
        imageAudioMap: parentWords.imageAudioMap.reduce((acc, item) => {
          acc[item.text] = {
            image: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${item?.image_url}`,
            audio: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${item?.audio_url}`,
          };
          return acc;
        }, {}),
        arrM: parentWords.imageAudioMap.map((item) => item.text),
      };
      setTransformed(newTransformed);
    }
  }, [parentWords]);

  let progressDatas = getLocalData("practiceProgress");
  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.titleNew || "L1";
  let apiLevel = `M${level}-${currentLevel}`;

  const transcriptRef = useRef("");
  useEffect(() => {
    transcriptRef.current = transcript;

    if (transcript) {
      const filteredText = filterBadWords(transcript, language);
      if (filteredText.includes("*")) {
        const count = parseInt(getLocalData("profanityCheck") || "0");
        if (count > 2) {
          setOpenMessageDialog({
            open: true,
            message: `Please speak appropriately.`,
            severity: "warning",
            isError: true,
          });
        }
        stopRecording();
        setLocalData("profanityCheck", (count + 1).toString());
      }
    }
  }, [transcript]);

  const [wordsAfterSplit, setWordsAfterSplit] = useState([]);
  const [recAudio, setRecAudio] = useState("");
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentIsSelected, setCurrentIsSelected] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedWordsNew, setSelectedWordsNew] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState({});
  const [isMicOn, setIsMicOn] = useState(false);
  const [syllAudios, setSyllAudios] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [selectedWord, setSelectedWord] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [isWordCorrect, setIsWordCorrect] = useState(false);
  const sessionId = getLocalData("sessionId");
  const [open, setOpen] = useState(false);

  function sanitize(text) {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"\[\]'']/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function phoneticMatch(a, b) {
    const [a1, a2] = doubleMetaphone(a);
    const [b1, b2] = doubleMetaphone(b);
    return a1 === b1 || a1 === b2 || a2 === b1 || a2 === b2;
  }

  const mimeType = "audio/webm;codecs=opus";

  const startAudioRecording = useCallback(
    async (word) => {
      setRecordedBlob(null);
      recordedChunksRef.current = [];

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          console.error("MIME type not supported:", mimeType);
          return;
        }

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          if (recordedChunksRef.current.length === 0) {
            setRecordedBlob(null);
            return;
          }

          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          setRecordedBlob(blob);
          recordedChunksRef.current = [];

          try {
            setIsLoading(true);

            // Use browser speech recognition transcript (already captured during recording)
            const transcripts = sanitize(transcriptRef.current || "");
            const isCorrect =
              transcripts.includes(word) || phoneticMatch(transcripts, word);

            if (language === "kn") {
              const knLatin = transliterateKannadaToLatin(word);
              const comparison = compareWords(transcripts, knLatin);
              setIsWordCorrect(comparison?.isFine);
            } else {
              setIsWordCorrect(isCorrect);
            }
            setIsLoading(false);
          } catch (error) {
            console.error("Transcription error:", error);
            setIsLoading(false);
            setIsWordCorrect(false);
          }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(100);
        setIsRecording(true);
      } catch (err) {
        console.error("Error starting audio recording:", err);
      }
    },
    [language]
  );

  const stopAudioRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.requestData();
      recorder.stop();
      setIsRecording(false);
    }
  }, []);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const callTelemetry = async () => {
    const sessionId = getLocalData("sessionId");
    const responseStartTime = new Date().getTime();
    let responseText = "";
    const base64Data = await blobToBase64(recordedBlob);

    await callTelemetryApi(
      transformed?.arrM?.[currentWordIndex],
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      transcriptRef.current || "",
      apiLevel
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (showWrongWord) {
      setShowWrongTick(true);
      timer = setTimeout(() => {
        setShowWrongTick(false);
      }, 2000);
    } else {
      setShowWrongTick(true);
    }
    return () => clearTimeout(timer);
  }, [showWrongWord]);

  const startRecording = (word, isSelected) => {
    if (isChrome) {
      resetTranscript();
      startAudioRecording(word);
      setAbusiveFound(false);
      setDetectedWord("");
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
        language: getBrowserLanguage(language),
      });
    }
    setIsRecording(true);
    setCurrentWord(word);
    setCurrentIsSelected(isSelected);
  };

  const stopRecording = () => {
    if (isChrome) {
      SpeechRecognition.stopListening();
      stopAudioRecording();
      const finalTranscript = transcriptRef.current;
      setIsMicOn(false);
      setIsRecording(false);
      setIsProcessing(false);
      setAbusiveFound(false);
    } else {
      setIsProcessing(true);
    }
    setIsRecording(false);
    setShowRecording(false);
    const audio = new Audio(correctSound);
    audio.play();
    setShowHint(false);
    setWinEffect(true);
    setShowConfetti(true);
    setCoins((prevCoins) => prevCoins + 100);
    setShowWrongWord(false);
    setHighlightCorrectWords(false);

    setTimeout(() => {
      setShowCoinsImg(true);
      setTimeout(() => {
        setShowEmptyImg(true);
        setShowNextButton(true);
        setShowCoinsImg(false);
      }, 1000);
    }, 2000);

    setTimeout(() => {
      setSelectedWords([]);
      setWinEffect(false);
      setShowEmptyImg(false);
    }, 3000);

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  useEffect(() => {
    if (currentLevel) {
      setCurrentWordIndex(0);
      setScore(0);
      setShowBingoPage(false);
      setShowSuccessPage(false);
    }
  }, [currentLevel]);

  const updateStoredData = useCallback((audio, isCorrect) => {}, []);

  const handleRecordingComplete = useCallback((base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio(null);
    }
  }, []);

  const handleStartRecording = useCallback(() => {
    setRecAudio(null);
  }, []);

  const handleStopRecording = useCallback(() => {
    setRecAudio(true);
  }, []);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentData =
    transformed?.imageAudioMap?.[transformed?.arrM?.[currentWordIndex]];
  const currentImage = currentData?.image;

  const startAudio = useCallback(
    (index) => {
      const currentWord = transformed?.arrM?.[index];
      const currentData = transformed?.imageAudioMap?.[currentWord];
      if (currentData?.audio) {
        const audio = new Audio(currentData.audio);
        audio
          .play()
          .then(() => {
            setShowInitialEffect(true);
            audio.onended = () => {
              setShowInitialEffect(false);
            };
          })
          .catch((error) => console.error("Audio play failed:", error));
        setStartGame(false);
        setShowInitialEffect(true);
      }
    },
    [transformed]
  );

  const getCurrentWordParts = useCallback(() => {
    const currentWord = transformed?.arrM?.[currentWordIndex];
    return validPairs[currentWord] || [];
  }, [transformed, currentWordIndex]);

  const correctPairs = useMemo(() => {
    return (
      transformed?.arrM
        ?.map((fullWord) => {
          const parts = validPairs[fullWord];
          return parts
            ? {
                fullWord,
                parts,
                hintImage: transformed?.imageAudioMap[fullWord]?.image,
              }
            : null;
        })
        .filter(Boolean) || []
    );
  }, [transformed]);

  const handleHintClick = useCallback(() => {
    const currentWord = transformed?.arrM?.[currentWordIndex];
    if (currentWord) {
      setCurrentHintPair({
        fullWord: currentWord,
        parts: validPairs[currentWord],
        hintImage: transformed?.imageAudioMap[currentWord]?.image,
      });
    }

    setShowHint(true);
    setTimeout(() => {
      setShowHint(false);
    }, 2000);
  }, [transformed, currentWordIndex]);

  const handleWordClick = useCallback(
    (word) => {
      if (correct.includes(word) || showNextButton || showSuccessPage) return;
      if (selected.includes(word)) return;

      const newSelected = [...selected, word];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        const currentWord = transformed?.arrM?.[currentWordIndex];
        const requiredParts = validPairs[currentWord] || [];

        const isCorrectPair =
          newSelected.length === requiredParts.length &&
          requiredParts.every((part, index) => newSelected[index] === part);

        if (isCorrectPair) {
          setMatchedPair({ fullWord: currentWord, parts: requiredParts });

          // Play success sound when correct pair is matched
          const audio = new Audio(correctSound);
          audio.play().catch((error) => {
            console.error("Error playing success sound:", error);
          });

          setTimeout(() => setShowConfetti(true), 500);

          setTimeout(() => {
            setShowConfetti(false);
            setShowFlyingStar(true);

            setTimeout(() => {
              setShowFlyingStar(false);
              const newScore = score + 1;
              setScore(newScore);

              if (newScore === correctPairs.length) {
                setShowNextButton(true);
              }
            }, 2000);
          }, 3500);

          setTimeout(() => {
            setShowNextButton(true);
            setCorrect((prev) => [...prev, ...newSelected]);
            setCompletedPairs((prev) => [...prev, currentWord]);
            setCurrentHintPair(null);
          }, 3500);
        } else {
          // Play wrong sound when incorrect pair is selected
          const audio = new Audio(wrongSound);
          audio.play().catch((error) => {
            console.error("Error playing wrong sound:", error);
          });

          setWrongPair(newSelected);
          setTimeout(() => {
            setWrongPair([]);
            setSelected([]);
          }, 2000);
        }
      }
    },
    [
      correct,
      showNextButton,
      showSuccessPage,
      selected,
      transformed,
      currentWordIndex,
      score,
      correctPairs.length,
    ]
  );

  const handleNextClick = useCallback(() => {
    if (currentWordIndex < transformed?.arrM.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowNextButton(false);
      setShowHint(false);
      setSelected([]);
      setWrongPair([]);
      setMatchedPair(null);
      setCurrentHintPair(null);
      setShowConfetti(false);
      setShowFlyingStar(false);

      //startAudio(currentWordIndex + 1);

      if (score >= 5) {
        setShowSuccessPage(true);
      }
    } else {
      if (score >= 5) {
        setShowSuccessPage(true);
      }
    }
  }, [currentWordIndex, transformed, score, startAudio]);

  const handleSuccessNextClick = useCallback(() => {
    setCorrect([]);
    setShowBingoPage(true);
    setShowSuccessPage(false);
  }, []);

  useEffect(() => {
    if (score >= 5) {
      setShowSuccessPage(true);
    }
  }, [score]);

  const getButtonStyle = useCallback(
    (word) => {
      if (correct.includes(word))
        return {
          backgroundColor: "#F8FBFF",
          color: "rgba(51,63,97,0.3)",
          opacity: 0.9,
          pointerEvents: "none",
          boxShadow: "0px 0px 10px rgba(219,242,254,1)",
        };
      if (wrongPair.includes(word))
        return { backgroundColor: "rgba(255,127,54,1)", color: "#fff" };
      if (selected.includes(word)) {
        const currentWord = transformed?.arrM?.[currentWordIndex];
        const requiredParts = validPairs[currentWord] || [];
        if (requiredParts.includes(word))
          return { backgroundColor: "rgba(76,175,80,1)", color: "#fff" };
        return { backgroundColor: "rgba(28,176,246,1)", color: "#fff" };
      }
      return { backgroundColor: "#F8FBFF", color: "rgba(51,63,97,1)" };
    },
    [correct, wrongPair, selected, transformed, currentWordIndex]
  );

  const getHintImage = useCallback(() => {
    const currentWord = transformed?.arrM?.[currentWordIndex];
    return transformed?.imageAudioMap?.[currentWord]?.image;
  }, [transformed, currentWordIndex]);

  const handleReset = useCallback(() => {
    setShowHint(false);
    setHideButtons(false);
    setSelectedWords([]);
    setWinEffect(false);
    setShowWrongWord(false);
    setHighlightCorrectWords(false);
    setShowCoinsImg(false);
    setShowEmptyImg(false);
    setHideCoinsImg(false);
    setShowConfetti(false);
    setShowNextButton(false);
    setShowInitialEffect(true);

    setSelected([]);
    setCorrect([]);
    setWrongPair([]);
    setMatchedPair(null);
    setCurrentHintPair(null);

    //startAudio(currentWordIndex);
  }, [currentWordIndex, startAudio]);

  const retry = useCallback(() => {
    setShowHint(false);
    setHideButtons(false);
    setSelectedWords([]);
    setWinEffect(false);
    setShowWrongWord(false);
    setHighlightCorrectWords(false);
    setShowCoinsImg(false);
    setShowEmptyImg(false);
    setHideCoinsImg(false);
    setShowConfetti(false);
    setShowNextButton(false);
    setShowInitialEffect(true);

    setSelected([]);
    setWrongPair([]);
    setMatchedPair(null);
    setCurrentHintPair(null);
  }, []);

  useEffect(() => {
    if (showEmptyImg) {
      const timer = setTimeout(() => {
        setHideCoinsImg(true);
      });
      return () => clearTimeout(timer);
    }
  }, [showEmptyImg]);

  useEffect(() => {
    if (
      transformed?.arrM &&
      currentWordIndex < transformed.arrM.length &&
      !showBingoPage
    ) {
      setSelected([]);
      setShowNextButton(false);
      setShowSuccessPage(false);
      setShowHint(false);
      setShowConfetti(false);
      setShowFlyingStar(false);
      setMatchedPair(null);
      setCurrentHintPair(null);
      setWrongPair([]);
      setStartGame(true);

      const timer = setTimeout(() => {
        //startAudio(currentWordIndex);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentWordIndex, transformed, showBingoPage, startAudio]);

  const GamePage = useMemo(() => {
    return () => (
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          marginTop: 0,
          padding: isMobile
            ? "12px 16px"
            : isTablet
            ? "32px 40px"
            : "40px 60px",
          // textAlign: "center",
          position: "relative",
          width: "100%",
          maxWidth: "1130px",
          boxShadow: "0px 0px 16.9px 0px rgba(219,242,254,1)",
          border: "2px solid rgba(231,232,236,1)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "10px",
            marginBottom: isMobile ? "20px" : isTablet ? "28px" : "40px",
          }}
        >
          <div
            style={{
              width: isMobile ? "50px" : isTablet ? "60px" : "70px",
              height: isMobile ? "50px" : isTablet ? "60px" : "70px",
              flexShrink: 0,
            }}
          />

          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={wordheadingimg}
              alt="Bingo Puzzle"
              style={{
                height: isMobile ? "20px" : isTablet ? "26px" : "30px",
                objectFit: "contain",
                maxWidth: "100%",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              width: isMobile ? "50px" : isTablet ? "60px" : "70px",
              height: isMobile ? "50px" : isTablet ? "60px" : "70px",
              flexShrink: 0,
            }}
          >
            <img
              src={starimg}
              alt="star"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <span
              style={{
                position: "absolute",
                top: "55%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: isMobile ? "14px" : isTablet ? "16px" : "19px",
                fontWeight: "700",
                color: "#181414ff",
                textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              {score}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${
              isMobile ? 2 : isTablet ? 3 : 4
            }, 1fr)`,
            gap: isMobile ? "12px" : isTablet ? "18px" : "25px",
            justifyItems: "center",
          }}
        >
          {transformed?.words?.map((word, index) => (
            <div
              key={index}
              role="button"
              tabIndex={correct.includes(word) ? -1 : 0}
              aria-pressed={selected.includes(word)}
              onClick={() => handleWordClick(word)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleWordClick(word);
              }}
              style={{
                ...getButtonStyle(word),
                borderRadius: "12px",
                padding: isMobile
                  ? "12px 16px"
                  : isTablet
                  ? "14px 22px"
                  : "16px 33px",
                textAlign: "center",
                fontSize: isMobile ? "16px" : isTablet ? "17px" : "19px",
                fontWeight: "600",
                width: "100%",
                minWidth: 0,
                border: "1px solid rgba(231,232,236,1)",
                cursor: correct.includes(word) ? "default" : "pointer",
                userSelect: "none",
                transition: "all 0.3s ease",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                boxSizing: "border-box",
                outline: "none",
              }}
              onFocus={(e) => {
                if (!correct.includes(word)) {
                  e.currentTarget.style.outline =
                    "2px solid rgba(28,176,246,0.7)";
                  e.currentTarget.style.outlineOffset = "2px";
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
            >
              {word}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? "24px" : isTablet ? "32px" : "40px",
            marginTop: isMobile ? "16px" : isTablet ? "10px" : "5px",
            position: "relative",
            minHeight: "64px",
            alignItems: "center",
          }}
        >
          {!showNextButton ? (
            <>
              <img
                src={iconimg}
                alt="hint"
                role="button"
                tabIndex={0}
                style={{ width: "55px", height: "55px", cursor: "pointer" }}
                onClick={handleHintClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleHintClick();
                }}
              />
              <img
                src={listeenimg}
                alt="listen"
                role="button"
                tabIndex={0}
                style={{ width: "55px", height: "55px", cursor: "pointer" }}
                onClick={() => startAudio(currentWordIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    startAudio(currentWordIndex);
                }}
              />
            </>
          ) : (
            <img
              src={Assets.nextimg}
              alt="next"
              role="button"
              tabIndex={0}
              style={{ width: "100px", height: "45px", cursor: "pointer" }}
              onClick={handleNextClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") e.currentTarget.click();
              }}
            />
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "-28px" : "-100px",
            left: isMobile ? "-15px" : "-20px",
          }}
        >
          <img
            src={bearimg}
            alt="bear"
            style={{
              width: isMobile ? "100px" : isTablet ? "130px" : "150px",
              height: isMobile ? "130px" : isTablet ? "170px" : "200px",
              position: "relative",
            }}
          />
          {showHint && (
            <div
              style={{
                position: "absolute",
                top: "-160px",
                left: isMobile ? "140px" : isTablet ? "230px" : "210px",
                transform: "translateX(-50%)",
                width: isMobile ? "280px" : isTablet ? "360px" : "400px",
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={emptyimg}
                alt="empty"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  objectFit: "contain",
                  top: 0,
                  left: 0,
                }}
              />
              <img
                src={getHintImage()}
                alt="hint"
                style={{
                  width: "110px",
                  height: "110px",
                  objectFit: "contain",
                  position: "relative",
                  zIndex: 2,
                  margin: "auto",
                  display: "block",
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }, [
    transformed,
    score,
    showNextButton,
    showHint,
    currentWordIndex,
    handleWordClick,
    getButtonStyle,
    correct,
    selected,
    handleHintClick,
    startAudio,
    handleNextClick,
    getHintImage,
    isMobile,
    isTablet,
  ]);

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      parentWords={parentWords}
      lang={language}
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
      <ThemeProvider theme={theme}>
        <div
          style={{
            width: "100%",
            flex: isMobile ? "1 1 0%" : undefined,
            minHeight: isMobile ? 0 : isTablet ? "60vh" : "70vh",
            position: "relative",
            overflowX: "hidden",
            // backgroundColor: "#DDF3FF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: isMobile ? "16px" : isTablet ? "20px" : "24px",
            paddingBottom: isMobile ? "40px" : isTablet ? "60px" : "70px",
            paddingLeft: isMobile ? "16px" : isTablet ? "20px" : "24px",
            paddingRight: isMobile ? "16px" : isTablet ? "20px" : "24px",
            fontFamily: "'Quicksand', sans-serif",
            color: "rgba(51,63,97,1)",
          }}
        >
          {showConfetti && (
            <Confetti
              width={screenWidth}
              height={window.innerHeight}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 9999,
              }}
            />
          )}
          {/* Hint Icon */}
          <img
            src={hintimg}
            alt="hint video"
            role="button"
            tabIndex={0}
            aria-label="Show hint video"
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
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen(true);
            }}
          />

          {/* Modal */}
          {open && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
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
                  aria-label="Close video"
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    background: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "44px",
                    height: "44px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>

                <SafeYouTubePlayer
                  videoId="_WrOsvEWpbg"
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </div>
          )}

          {showFlyingStar && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "30px",
                animation: "flyStarToCenterOpposite 2s ease-in-out forwards",
                zIndex: 1000,
              }}
            >
              <div
                style={{ position: "relative", width: "50px", height: "50px" }}
              >
                <img
                  src={starimg}
                  alt="star"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0px 0px 8px rgba(255, 215, 0, 0.8))",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "55%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "17px",
                    fontWeight: "700",
                    color: "#181414ff",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  +1
                </span>
              </div>
            </div>
          )}

          {showBingoPage ? (
            <BingoPage
              transformed={transformed}
              setVoiceText={setVoiceText}
              setRecordedAudio={setRecordedAudio}
              setVoiceAnimate={setVoiceAnimate}
              storyLine={storyLine}
              enableNext={enableNext}
              isShowCase={isShowCase}
              isDiscover={isDiscover}
              contentId={contentId}
              contentType={contentType}
              currentStep={currentStep}
              playTeacherAudio={playTeacherAudio}
              callUpdateLearner={callUpdateLearner}
              setOpenMessageDialog={setOpenMessageDialog}
              setEnableNext={setEnableNext}
              handleNext={handleNext}
            />
          ) : showSuccessPage || score >= 5 ? (
            <SuccessPage
              score={score}
              completedPairs={completedPairs}
              onNext={handleSuccessNextClick}
            />
          ) : (
            <GamePage />
          )}

          <style>{`
            @keyframes flyStarToCenterOpposite {
              0% {
                transform: translate(0, 0);
                opacity: 1;
                width: 50px;
                height: 50px;
              }
              50% {
                transform: translate(calc(50vw - 60px), calc(-50vh + 60px));
                opacity: 0.8;
                width: 60px;
                height: 60px;
              }
              100% {
                transform: translate(calc(50vw - 60px), calc(-50vh + 60px));
                opacity: 0;
                width: 70px;
                height: 70px;
              }
            }

            @keyframes jump {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-20px);
              }
            }
          `}</style>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default React.memo(BingoCard);
