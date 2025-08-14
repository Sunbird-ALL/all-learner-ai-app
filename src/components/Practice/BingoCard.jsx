import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "../../utils/constants";
import r3WrongTick from "../../assets/r3WrongTick.svg";
import bingoReset from "../../assets/bingoReset.svg";
import Mic from "../../assets/mikee.svg";
import Stop from "../../assets/pausse.svg";
import Play from "../../assets/playButton.svg";
import RecordVisualizer from "../../assets/recordVisualizer.svg";
import { phoneticMatch } from "../../utils/phoneticUtils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MainLayout from "../Layouts.jsx/MainLayout";
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
import { loadTranscriber } from "../../utils/transcriber";
import { doubleMetaphone } from "double-metaphone";
import loadingJson from "../../assets/loadingJson.json";
import Lottie from "lottie-react";
import {
  transliterateKannadaToLatin,
  compareWords,
} from "../../utils/textUtils";

// const isChrome =
//   /Chrome/.test(navigator.userAgent) &&
//   /Google Inc/.test(navigator.vendor) &&
//   !/Edg/.test(navigator.userAgent);

const isChrome = true;

const theme = createTheme();

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
  const [startGame, setStartGame] = useState(true);
  const [showRecording, setShowRecording] = useState(false);
  const [abusiveFound, setAbusiveFound] = useState(false);
  const [detectedWord, setDetectedWord] = useState("");
  const [language, setLanguage] = useState(getLocalData("lang") || "en");
  const [showWrongTick, setShowWrongTick] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [transformed, setTransformed] = useState(null);
  const correctPracticeWords = getLocalData("correctPracticeWords");

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

  //console.log(transformed);

  //console.log('words', transformed);

  let progressDatas = getLocalData("practiceProgress");
  //const virtualId = String(getLocalData("virtualId"));

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
    //console.log("Live Transcript:", transcript);

    if (transcript) {
      const filteredText = filterBadWords(transcript, language);
      //console.log("filteredText", filteredText);

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

  function sanitize(text) {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"\[\]'’]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function phoneticMatch(a, b) {
    const [a1, a2] = doubleMetaphone(a);
    const [b1, b2] = doubleMetaphone(b);
    return a1 === b1 || a1 === b2 || a2 === b1 || a2 === b2;
  }

  const mimeType = "audio/webm;codecs=opus";

  const startAudioRecording = useCallback(async (word) => {
    setRecordedBlob(null);
    recordedChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
          console.warn("No audio data captured.");
          setRecordedBlob(null);
          return;
        }

        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        recordedChunksRef.current = [];

        try {
          setIsLoading(true);
          const transcriber = await loadTranscriber();
          console.log("Transcriber is:", transcriber);
          const audioUrl = URL.createObjectURL(blob);
          const output = await transcriber(audioUrl, {
            chunk_length_s: 20,
            stride_length_s: 5,
            task: "transcribe",
            language: "en",
          });

          const transcripts = sanitize(output.text);

          console.log("Transcribsss", transcripts, word);

          const isCorrect =
            transcripts.includes(word) || phoneticMatch(transcripts, word);

          console.log("Transcription resultss 1:", transcripts);
          console.log("Transcription resultss 2:", word, isCorrect);

          if (language === "kn") {
            const knLatin = transliterateKannadaToLatin(word);
            const comparison = compareWords(transcripts, knLatin);
            setIsWordCorrect(comparison?.isFine);
          } else {
            setIsWordCorrect(isCorrect);
          }

          setIsLoading(false);
          // setStatus("inactive");
        } catch (error) {
          console.error("Transcription error:", error);
          setIsLoading(false);
          setIsWordCorrect(false);
          // setStatus("inactive");
          // props.setIsCorrect?.(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Emit data every 100ms
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting audio recording:", err);
    }
  }, []);

  const stopAudioRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.requestData(); // Flush remaining data
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
    //console.log("bvlobss", recordedBlob);

    await callTelemetryApi(
      transformed?.arrM?.[currentWordIndex],
      sessionId,
      currentStep - 1,
      base64Data,
      responseStartTime,
      transformed?.arrM?.[currentWordIndex],
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
    //console.log('recs', recognition);
    if (isChrome) {
      // if (!browserSupportsSpeechRecognition) {
      //   //alert("Speech recognition is not supported in your browser.");
      //   return;
      // }
      resetTranscript();
      startAudioRecording(word);
      setAbusiveFound(false);
      setDetectedWord("");
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
        language: language || "en-US",
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
      // if (recognition) {
      //   recognition.stop();
      // }
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

  // useEffect(() => {
  //   if (isRecording && recognition && recognition.state !== "recording") {
  //     recognition.start();
  //   }
  // }, [isRecording, recognition]);

  // useEffect(() => {
  //   if (!isChrome) {
  //     initializeRecognition();
  //   }
  // }, []);

  //console.log("loggslevel", currentLevel, currentPracticeStep);

  useEffect(() => {
    setShowHint(false);
    setHideButtons(false);
    setSelectedWords([]);
    setWinEffect(false);
    setCoins(0);
    setShowWrongWord(false);
    setHighlightCorrectWords(false);
    setHighlightedButtonIndex(-1);
    setShowCoinsImg(false);
    setShowEmptyImg(false);
    setHideCoinsImg(false);
    setShowConfetti(false);
    setShowNextButton(false);
    setCurrentWordIndex(0);
    setShowInitialEffect(false);
    setStartGame(true);
    setShowRecording(false);
    setShowWrongTick(true);
    setWordsAfterSplit([]);
    setRecAudio("");
    setIsRecordingComplete(false);
    setIsRecording(false);
    setIsProcessing(false);
    setCurrentWord("");
    setCurrentIsSelected(false);
    setRecognition(null);
    setSelectedWordsNew([]);
    setIncorrectWords({});
    setIsMicOn(false);
    setSyllAudios([]);
    setIsPlaying(false);
    setScale(1);
  }, [currentLevel]);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const currentData =
  //   transformed?.imageAudioMap[
  //     transformed?.arrM[currentWordIndex]
  //   ];

  const currentData =
    transformed?.imageAudioMap?.[transformed?.arrM?.[currentWordIndex]];

  const currentImage = currentData?.image;

  const startAudio = (index) => {
    const currentData = transformed?.imageAudioMap[transformed?.arrM[index]];
    const audio = new Audio(currentData?.audio);
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
  };

  const handleHintClick = () => {
    setShowHint(true);
    setHideButtons(true);
    setTimeout(() => {
      setShowHint(false);
      setHideButtons(false);
    }, 2500);
  };

  useEffect(() => {
    transformed?.words?.forEach((_, index) => {
      setTimeout(() => {
        setHighlightedButtonIndex(index);
      }, index * 500);
    });

    setTimeout(() => {
      setHighlightedButtonIndex(-1);
    }, transformed?.words?.length * 500);
  }, []);

  const getSize = () =>
    screenWidth < 480 ? "40px" : screenWidth < 768 ? "50px" : "60px";

  const handleWordClick = (word) => {
    // if (!selectedWords.includes(word)) {
    //   const updatedWords = [...selectedWords, word];
    //   setSelectedWords(updatedWords);
    // }

    let updatedWords;

    if (selectedWords.includes(word)) {
      updatedWords = selectedWords.filter((w) => w !== word);
      setSelectedWords(updatedWords);
    } else {
      updatedWords = [...selectedWords, word];
      setSelectedWords(updatedWords);
    }

    const validPairs = {
      MANGO: ["MAN", "GO"],
      WATER: ["WA", "TER"],
      MOTHER: ["MO", "THER"],
      FATHER: ["FA", "THER"],
      PENCIL: ["PEN", "CIL"],
      DOCTOR: ["DOC", "TOR"],
      MARKET: ["MAR", "KET"],
      BASKET: ["BAS", "KET"],
      TABLE: ["TA", "BLE"],
      WINDOW: ["WIN", "DOW"],
      POCKET: ["POCK", "ET"],
      WINDOW: ["WIN", "DOW"],
      CRICKET: ["CRICK", "ET"],
      BALLOON: ["BAL", "LOON"],
      GARDEN: ["GAR", "DEN"],
      CANDLE: ["CAN", "DLE"],
      SCOOTER: ["SCOO", "TER"],
      CYCLE: ["CY", "CLE"],
      FLOWER: ["FLOW", "ER"],
      MUSIC: ["MUS", "IC"],
      PUPPY: ["PUP", "PY"],
      STUDENT: ["STU", "DENT"],
      PAPER: ["PA", "PER"],
      कद: ["क", "द"],
      गगन: ["ग", "गन"],
      गायक: ["गाय", "क"],
      औरत: ["औ", "रत"],
      टायर: ["टा", "यर"],
      मटर: ["म", "टर"],
      पलंग: ["प", "लंग"],
      मटका: ["मट", "का"],
      मंदिर: ["मं", "दिर"],
      कददू: ["क", "ददू"],
      TEACHER: ["TEA", "CHER"],
      CHERRY: ["CHE", "RRY"],
      DRAGONFLY: ["DRAG", "ONFLY"],
      WOOLLEN: ["WOO", "LLEN"],
      FOOTPATH: ["FOOT", "PATH"],
      CHOCOLATE: ["CHOCO", "LATE"],
      SPROUT: ["SPR", "OUT"],
      CLOWN: ["CL", "OWN"],
      UTENSILS: ["UTEN", "SILS"],
      HANDKERCHIEF: ["HANDKE", "RCHIEF"],
      FLOWERS: ["FLO", "WERS"],
      MOUNTAINS: ["MOUN", "TAINS"],
      THINKING: ["THIN", "KING"],
      SUGAR: ["SU", "GAR"],
      CHAIR: ["CH", "AIR"],
      TEETH: ["TE", "ETH"],
      CLOUDS: ["CLO", "UDS"],
      BOOK: ["BO", "OK"],
      KITCHEN: ["KIT", "CHEN"],
      MOUTH: ["MO", "UTH"],
      मोबाइल: ["मो", "बाइल"],
      बंदगोभी: ["बंद", "गोभी"],
      मिर्च: ["मि", "र्च"],
      मस्जिद: ["मस", "जिद"],
      मूँगफली: ["मूँग", "फली"],
      मच्छर: ["मच्छ", "र"],
      डॉक्टर: ["डॉ", "क्टर"],
      खेलकूद: ["खेल", "कूद"],
      पुष्प: ["पु", "ष्प"],
      स्कूटर: ["स्कू", "टर"],
      सर्कस: ["सर्क", "स"],
      हेलमेट: ["हेल", "मेट"],
      गुब्बारा: ["गुब्बा", "रा"],
      कृष्ण: ["कृ", "ष्ण"],
      टोकरी: ["बास", "केट"],
      गुलाब: ["गु", "लाब"],
      शरबत: ["शर", "बत"],
      மூன்று: ["மூன", "்று"],
      தொப்பி: ["தொப", "்பி"],
      சீப்பு: ["சீப", "்பு"],
      பேருந்து: ["பேரு", "ந்து"],
      சட்டை: ["சட", "்டை"],
      உப்பு: ["உப", "்பு"],
      நாற்காலி: ["நாற்", "காலி"],
      ரொட்டி: ["ரொட", "்டி"],
      கொய்யா: ["கொய", "்யா"],
      வெள்ளாடு: ["வெள்", "ளாடு"],
      முட்டை: ["முட", "்டை"],
      பாம்பு: ["பாம", "்பு"],
      நண்டு: ["நண", "்டு"],
      கத்தி: ["கத", "்தி"],
      நாக்கு: ["நாக", "்கு"],
      பொம்மை: ["பொம", "்மை"],
      செருப்பு: ["செரு", "ப்பு"],
      ஆந்தை: ["ஆந", "்தை"],
      மூக்கு: ["மூக", "்கு"],
      தட்டு: ["தட", "்டு"],
      ಗಡಿಯಾರ: ["ಗಡಿ", "ಯಾರ"],
      ತರಕಾರಿ: ["ತರ", "ಕಾರಿ"],
      ಚಳಿಗಾಲ: ["ಚಳಿ", "ಗಾಲ"],
      ಗಾಳಿಪಟ: ["ಗಾಳಿ", "ಪಟ"],
      ಗುಡಿಸಲು: ["ಗುಡಿ", "ಸಲು"],
      ಕಂಠಹಾರ: ["ಕಂಠ", "ಹಾರ"],
      ದಾಸವಾಳ: ["ದಾಸ", "ವಾಳ"],
      ಪಾರಿವಾಳ: ["ಪಾರಿ", "ವಾಳ"],
      ಅನಾನಸ್: ["ಅನಾ", "ನಸ್"],
      ಸಿಹಿತಿಂಡಿ: ["ಸಿಹಿ", "ತಿಂಡಿ"],
      ಕತ್ತರಿ: ["ಕತ್ತ", "ರಿ"],
      ಕತ್ತೆ: ["ಕ", "ತ್ತೆ"],
      ಈರುಳ್ಳಿ: ["ಈರು", "ಳ್ಳಿ"],
      ಪಪ್ಪಾಯಿ: ["ಪ", "ಪ್ಪಾಯಿ"],
      ಉಣ್ಣೆ: ["ಉ", "ಣ್ಣೆ"],
      ಚಾಕೋಲೇಟು: ["ಚಾಕೋ", "ಲೇಟು"],
      ಚಿಟ್ಟೆ: ["ಚಿ", "ಟ್ಟೆ"],
      ರೊಟ್ಟಿ: ["ರೊ", "ಟ್ಟಿ"],
      ಬೆಕ್ಕು: ["ಬೆ", "ಕ್ಕು"],
      ಬಾತುಕೋಳಿ: ["ಬಾತು", "ಕೋಳಿ"],
      రచయిత: ["రచ", "యిత"],
      గాలిపటం: ["గాలి", "పటం"],
      చలికాలం: ["చలి", "కాలం"],
      ఊరగాయ: ["ఊర", "గాయ"],
      గడియారం: ["గడి", "యారం"],
      పాలకూర: ["పాల", "కూర"],
      బటానీలు: ["బటా", "నీలు"],
      కనుబొమ: ["కను", "బొమ"],
      దోసకాయ: ["దోస", "కాయ"],
      మానవుడు: ["మాన", "వుడు"],
      సైనికుడు: ["సై", "నికుడు"],
      తాళంచెవి: ["తాళం", "చెవి"],
      ముగ్గు: ["ము", "గ్గు"],
      కన్ను: ["క", "న్ను"],
      జుట్టు: ["జుట్", "టు"],
      చెట్టు: ["చెట్", "టు"],
      తేనెటీగ: ["తేనె", "టీగ"],
      పన్ను: ["పన్", "ను"],
      ముక్కు: ["ముక్", "కు"],
      చొక్కా: ["చోక్", "కా"],
    };

    const currentWord = transformed?.arrM[currentWordIndex];

    // const isCorrectPair = validPairs[currentWord]?.every((part) =>
    //   updatedWords.includes(part)
    // );

    const requiredParts = validPairs[currentWord] || [];

    const isCorrectPair =
      updatedWords.length === requiredParts.length &&
      requiredParts.every((part) => updatedWords.includes(part));

    if (isCorrectPair) {
      setShowRecording(true);
    } else if (updatedWords.length >= requiredParts.length && !winEffect) {
      setShowHint(false);
      setShowWrongWord(true);
      const audio = new Audio(wrongSound);
      audio.play();
    }
  };

  const handleReset = () => {
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
    startAudio(currentWordIndex);
  };

  const retry = () => {
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
  };

  useEffect(() => {
    if (showEmptyImg) {
      const timer = setTimeout(() => {
        setHideCoinsImg(true);
      });

      return () => clearTimeout(timer);
    }
  }, [showEmptyImg]);

  const handleNextButton = () => {
    const newWordData = {
      original_text: transformed?.arrM?.[currentWordIndex],
      content_id: contentId,
      milestone_level: "m1",
      practice_level: currentLevel,
      session_id: sessionId,
      practiced: true,
      learned: isWordCorrect ? true : false,
      subsession_id: "session_123",
    };

    setLocalData("correctPracticeWords", [
      ...(correctPracticeWords || []),
      newWordData,
    ]);

    if (currentWordIndex < transformed?.arrM.length - 1) {
      callTelemetry();
      setCurrentWordIndex(currentWordIndex + 1);
      setShowNextButton(false);
      setShowHint(false);
      setSelectedWords([]);
      setShowEmptyImg(false);
      setShowCoinsImg(false);
      startAudio(currentWordIndex + 1);
      handleNext();
    } else {
      callTelemetry();
      handleNext();
    }
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      lang={language}
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
      <ThemeProvider theme={theme}>
        <div
          style={{
            width: "100%",
            height: "85vh",
            position: "relative",
            overflowX: "hidden",
            backgroundColor: "#1CB0F6",
            filter: "brightness(1.1)",
            overflowY: "hidden",
          }}
        >
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}

          <style>
            {`
          .focusHint {
            animation: hintPulse 1s ease-in-out;
          }
          @keyframes hintPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0px rgba(188, 182, 66, 0.8);
            }
            50% {
              transform: scale(1.2);
              box-shadow: 0 0 0px rgb(236, 204, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0px rgba(255, 208, 0, 0.8);
            }
          }
        `}
          </style>
          <div
            style={{
              position: "absolute",
              width: "95%",
              height: "83%",
              backgroundColor: "#FFFFFF40",
              zIndex: 1,
              top: "10%",
              left: "2.5%",
              borderRadius: "33px",
            }}
          ></div>

          {showEmptyImg && (
            <div
              style={{
                position: "absolute",
                left: screenWidth < 768 ? "30%" : "280px",
                bottom: screenWidth < 768 ? "220px" : "318px",
                width: screenWidth < 768 ? "140px" : "240px",
                height: screenWidth < 768 ? "90px" : "130px",
                zIndex: 1000,
              }}
            >
              <img
                src={Assets.emptyImg}
                alt="Empty Placeholder"
                style={{
                  transform: "translateX(-50%)",
                  //width: screenWidth < 768 ? "120px" : "170px",
                  height: screenWidth < 768 ? "90px" : "165px",
                  zIndex: 100,
                  cursor: "pointer",
                }}
              />
              <div style={{ display: "flex", marginTop: "10px", gap: "15px" }}>
                <button
                  style={{
                    position: "absolute",
                    right: "90%",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    zIndex: "5",
                  }}
                  onClick={handleReset}
                >
                  <RetryIcon
                    height={screenWidth < 768 ? 40 : 50}
                    width={screenWidth < 768 ? 40 : 50}
                  />
                </button>

                {showNextButton && (
                  <button
                    style={{
                      position: "absolute",
                      right: "55%",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      zIndex: "5",
                    }}
                    onClick={handleNextButton}
                  >
                    <NextButtonRound
                      height={screenWidth < 768 ? 40 : 50}
                      width={screenWidth < 768 ? 40 : 50}
                    />
                  </button>
                )}
              </div>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              left: screenWidth < 768 ? "20%" : "10px",
              bottom: screenWidth < 768 ? "13%" : "0%",
              height: screenWidth < 768 ? "200px" : "390px",
              width: screenWidth < 768 ? "200px" : "390px",
              zIndex: "2",
              transform: screenWidth < 768 ? "translateX(-50%)" : "none",
            }}
          >
            <img
              src={showWrongWord ? Assets.sadBear : Assets.monkeyImg}
              alt="Monkey"
              style={{
                width: screenWidth < 768 ? "150px" : "250px",
                height: screenWidth < 768 ? "250px" : "450px",
                cursor: "pointer",
              }}
            />
            {!hideButtons &&
              !showWrongWord &&
              !winEffect &&
              !showCoinsImg &&
              !showEmptyImg &&
              !showInitialEffect &&
              !showInitialEffect &&
              startGame && (
                <img
                  onClick={() => {
                    startAudio(currentWordIndex);
                  }}
                  src={Assets.play}
                  alt="Start"
                  style={{
                    width: screenWidth < 768 ? "40px" : "50px",
                    height: screenWidth < 768 ? "40px" : "50px",
                    position: "absolute",
                    left: screenWidth < 768 ? "72%" : "51%",
                    top: screenWidth < 768 ? "10%" : "5%",
                    //transform: "translateX(-50%)",
                    transform: `scale(${scale})`,
                    transition: "transform 0.5s ease-in-out",
                    zIndex: 100,
                    padding: screenWidth < 768 ? "8px 16px" : "10px 20px",
                    cursor: "pointer",
                  }}
                />
              )}
            {!hideButtons &&
              !showWrongWord &&
              !winEffect &&
              !showCoinsImg &&
              !showEmptyImg &&
              showInitialEffect &&
              !startGame && (
                <img
                  src={Assets.emptyImg}
                  alt="Empty Placeholder"
                  style={{
                    position: "absolute",
                    left: screenWidth < 768 ? "85%" : "72%",
                    top: screenWidth < 768 ? "-19%" : "-20%",
                    transform: "translateX(-50%)",
                    //width: screenWidth < 768 ? "120px" : "170px",
                    height: screenWidth < 768 ? "90px" : "175px",
                    zIndex: 10,
                  }}
                />
              )}
            {!hideButtons &&
              !showWrongWord &&
              !winEffect &&
              !showCoinsImg &&
              !showEmptyImg &&
              !showInitialEffect &&
              !startGame &&
              !showRecording && (
                <>
                  <button
                    style={{
                      position: "absolute",
                      left: "55%",
                      top: screenWidth < 768 ? "10%" : "5%",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={handleHintClick}
                  >
                    <img
                      src={Assets.hintImg}
                      alt="Hint"
                      style={{
                        width: screenWidth < 768 ? "40px" : "50px",
                        height: screenWidth < 768 ? "40px" : "70px",
                      }}
                    />
                  </button>
                  <button
                    style={{
                      position: "absolute",
                      left: screenWidth < 768 ? "80%" : "55%",
                      top: screenWidth < 768 ? "10%" : "25%",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={handleReset}
                  >
                    <RetryIcon
                      height={screenWidth < 768 ? 40 : 50}
                      width={screenWidth < 768 ? 40 : 50}
                    />
                  </button>
                </>
              )}
          </div>

          {showWrongWord && (
            <div
              style={{
                position: "absolute",
                left: screenWidth < 768 ? "30%" : "280px",
                bottom: screenWidth < 768 ? "220px" : "318px",
                width: screenWidth < 768 ? "140px" : "240px",
                height: screenWidth < 768 ? "90px" : "130px",
                zIndex: 1000,
              }}
            >
              <img
                src={Assets.emptyImg}
                alt="Empty Placeholder"
                style={{
                  transform: "translateX(-50%)",
                  //width: screenWidth < 768 ? "120px" : "170px",
                  height: screenWidth < 768 ? "90px" : "165px",
                  zIndex: 100,
                  cursor: "pointer",
                }}
              />
              <div style={{ display: "flex", marginTop: "10px", gap: "15px" }}>
                <button
                  style={{
                    position: "absolute",
                    right: "90%",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    zIndex: "5",
                  }}
                  onClick={handleReset}
                >
                  <RetryIcon
                    height={screenWidth < 768 ? 40 : 50}
                    width={screenWidth < 768 ? 40 : 50}
                  />
                </button>

                {/* {showNextButton && ( */}
                <button
                  style={{
                    position: "absolute",
                    right: "55%",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    zIndex: "5",
                  }}
                  onClick={() => {
                    retry();
                    handleNextButton();
                  }}
                >
                  <NextButtonRound
                    height={screenWidth < 768 ? 40 : 50}
                    width={screenWidth < 768 ? 40 : 50}
                  />
                </button>
                {/* )} */}
              </div>
            </div>
          )}

          {showHint && !winEffect && (
            <div
              style={{
                position: "absolute",
                left: screenWidth < 768 ? "20%" : "15%",
                bottom: screenWidth < 768 ? "220px" : "330px",
                width: screenWidth < 768 ? "140px" : "240px",
                height: screenWidth < 768 ? "90px" : "130px",
                zIndex: 1000,
              }}
            >
              <img
                src={Assets.cloudText}
                alt="Cloud"
                style={{
                  //width: screenWidth < 768 ? "170px" : "230px",
                  height: screenWidth < 768 ? "100px" : "185px",
                  zIndex: 21,
                  cursor: "pointer",
                }}
              />
              <img
                src={currentImage}
                alt={transformed?.arrM[currentWordIndex]}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  height: screenWidth < 768 ? "40px" : "100px",
                  zIndex: 22,
                  cursor: "pointer",
                }}
              />
            </div>
          )}

          {showRecording &&
            (!isRecording && !isProcessing ? (
              <div
                style={{
                  position: "absolute",
                  left: screenWidth < 768 ? "20%" : "15%",
                  bottom: screenWidth < 768 ? "220px" : "320px",
                  //width: screenWidth < 768 ? "140px" : "240px",
                  //height: screenWidth < 768 ? "90px" : "130px",
                  zIndex: 1000,
                }}
              >
                <img
                  src={Assets.cloudText}
                  alt="Cloud"
                  style={{
                    width: screenWidth < 768 ? "170px" : "230px",
                    //height: screenWidth < 768 ? "85px" : "160px",
                    zIndex: 21,
                    cursor: "pointer",
                  }}
                />
                <img
                  src={Assets.mic}
                  alt={"Start Recording"}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "45%",
                    transform: "translate(-50%, -50%)",
                    height: screenWidth < 786 ? "40px" : "50px",
                    zIndex: 22,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    startRecording(transformed?.arrM[currentWordIndex])
                  }
                />
              </div>
            ) : (
              <div
                style={{
                  position: "absolute",
                  left: screenWidth < 768 ? "20%" : "15%",
                  bottom: screenWidth < 768 ? "220px" : "320px",
                  //width: screenWidth < 768 ? "140px" : "240px",
                  //height: screenWidth < 768 ? "90px" : "130px",
                  zIndex: 1000,
                }}
              >
                <img
                  src={Assets.cloudText}
                  alt="Cloud"
                  style={{
                    width: screenWidth < 768 ? "170px" : "230px",
                    //height: screenWidth < 768 ? "85px" : "160px",
                    zIndex: 21,
                    cursor: "pointer",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <img
                    src={Assets.graph}
                    alt={"Start Visualizer"}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "30%",
                      transform: "translate(-50%, -50%)",
                      height: screenWidth < 786 ? "15px" : "30px",
                      zIndex: 22,
                      cursor: "pointer",
                    }}
                  />
                  <img
                    src={Assets.pause}
                    alt={"Start Recording"}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "60%",
                      transform: "translate(-50%, -50%)",
                      height: screenWidth < 786 ? "40px" : "50px",
                      zIndex: 22,
                      cursor: "pointer",
                    }}
                    onClick={() => stopRecording()}
                  />
                </div>
              </div>
            ))}

          {winEffect && (
            <>
              {showConfetti && (
                <Confetti
                  width={200}
                  height={100}
                  numberOfPieces={50}
                  recycle={false}
                  particleSize={10}
                  gravity={0.3}
                  style={{
                    position: "absolute",
                    left: "180px",
                    bottom: "420px",
                    zIndex: 25,
                  }}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  left: screenWidth < 768 ? "30%" : "170px",
                  bottom: screenWidth < 768 ? "220px" : "310px",
                  display: "flex",
                  gap: screenWidth < 768 ? "10px" : "20px",
                  zIndex: 20,
                  transform: screenWidth < 768 ? "translateX(-50%)" : "none",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={Assets.rockImg}
                    alt="Rock Word"
                    style={{
                      width: screenWidth < 768 ? "130px" : "220px",
                      height: screenWidth < 768 ? "90px" : "140px",
                      zIndex: 21,
                    }}
                  />
                  <p
                    style={{
                      position: "absolute",
                      top: "42%",
                      left: "52%",
                      transform: "translate(-50%, -50%)",
                      color: "#333F61",
                      fontWeight: "700",
                      fontSize: screenWidth < 768 ? "12px" : "18px",
                    }}
                  >
                    {transformed?.arrM[currentWordIndex]}
                  </p>
                </div>

                <img
                  src={Assets.etImg}
                  alt="Et Word"
                  style={{
                    width: screenWidth < 768 ? "80px" : "100px",
                    height: screenWidth < 768 ? "90px" : "120px",
                    zIndex: 22,
                    marginLeft: screenWidth < 768 ? "-120px" : "-160px",
                  }}
                />
              </div>
            </>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : "repeat(3, 1fr)",
              gap: screenWidth < 768 ? "10px 30px" : "20px 50px",
              position: "absolute",
              right: screenWidth < 768 ? "10%" : "10%",
              top: screenWidth < 768 ? "15%" : "17%",
              //transform: screenWidth < 768 ? "translateX(50%)" : "none",
              zIndex: 1,
            }}
          >
            {transformed?.words?.map((word, index) => {
              const validPairs = {
                MANGO: ["MAN", "GO"],
                WATER: ["WA", "TER"],
                MOTHER: ["MO", "THER"],
                FATHER: ["FA", "THER"],
                PENCIL: ["PEN", "CIL"],
                DOCTOR: ["DOC", "TOR"],
                MARKET: ["MAR", "KET"],
                BASKET: ["BAS", "KET"],
                TABLE: ["TA", "BLE"],
                WINDOW: ["WIN", "DOW"],
                CRICKET: ["CRICK", "ET"],
                BALLOON: ["BAL", "LOON"],
                GARDEN: ["GAR", "DEN"],
                CANDLE: ["CAN", "DLE"],
                SCOOTER: ["SCOO", "TER"],
                CYCLE: ["CY", "CLE"],
                FLOWER: ["FLOW", "ER"],
                MUSIC: ["MUS", "IC"],
                PUPPY: ["PUP", "PY"],
                STUDENT: ["STU", "DENT"],
                PAPER: ["PA", "PER"],
              };

              const isCorrectWord =
                highlightCorrectWords &&
                validPairs[
                  transformed?.transformed?.arrM[currentWordIndex]
                ].includes(word);

              return (
                <div
                  key={index}
                  style={{
                    width: getSize(),
                    height: getSize(),
                    backgroundColor: isCorrectWord
                      ? "#58CC02"
                      : selectedWords.includes(word)
                      ? showConfetti
                        ? "#58CC02"
                        : showWrongWord
                        ? "#FF7F36"
                        : "#58CC02"
                      : "#ffffff",
                    color:
                      selectedWords.includes(word) || isCorrectWord
                        ? "#ffffff"
                        : "#1CB0F6",
                    borderRadius: "30% 70% 30% 70% / 70% 30% 70% 30%",
                    boxShadow:
                      "0 6px 8px rgba(0, 0, 0, 0.2), 0 -4px 6px rgba(255, 255, 255, 0.5) inset",
                    transform: "rotate(-12deg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize:
                      screenWidth < 480
                        ? "14px"
                        : screenWidth < 768
                        ? "16px"
                        : "18px",
                    fontWeight: "bold",
                    border:
                      highlightedButtonIndex === index
                        ? "0.3px solid #4DBD25"
                        : "0.3px solid #000000",
                    fontFamily: "Quicksand",
                    cursor:
                      showRecording ||
                      startGame ||
                      isCorrectWord ||
                      showWrongWord ||
                      showInitialEffect ||
                      showCoinsImg ||
                      winEffect ||
                      showNextButton
                        ? "not-allowed"
                        : "pointer",
                    zIndex: 2,
                  }}
                  onClick={() => {
                    if (
                      !(
                        showRecording ||
                        startGame ||
                        isCorrectWord ||
                        showWrongWord ||
                        showInitialEffect ||
                        showCoinsImg ||
                        winEffect ||
                        showNextButton
                      )
                    ) {
                      handleWordClick(word);
                    }
                  }}
                >
                  <p
                    style={{
                      transform: "rotate(12deg)",
                      fontSize:
                        screenWidth < 480
                          ? "10px"
                          : screenWidth < 768
                          ? "12px"
                          : "15px",
                    }}
                  >
                    {word}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
};

export default BingoCard;
