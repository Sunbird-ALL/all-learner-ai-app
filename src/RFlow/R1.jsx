import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../components/Layouts.jsx/MainLayout";
import listenImg from "../assets/listen.svg";
// import Mic from "../assets/mikee.svg";
// import Stop from "../assets/pausse.svg";
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
import { response } from "../services/telementryService";
import { Typography, Stack, IconButton } from "@mui/material";
import { ArrowRight, RotateCcw } from "lucide-react";
import trainImg from "../assets/trainImg.svg";
import { motion, AnimatePresence } from "framer-motion";
import VoiceAnalyser from "../utils/VoiceAnalyser";
import * as s3Assets from "../utils/rFlowS3Links";
import { getAssetUrl } from "../utils/rFlowS3Links";
import { getAssetAudioUrl } from "../utils/rFlowS3Links";

const theme = createTheme();

const dataEn = [
  {
    id: 1,
    title: "Consonant Sounds",
    letter: "b",
    word: "ball",
    image: getAssetUrl(s3Assets.ballGif),
    audio: getAssetAudioUrl(s3Assets.ballPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.BPhonemeAudio),
  },
  {
    id: 2,
    title: "Consonant Sounds",
    letter: "d",
    word: "drum",
    image: getAssetUrl(s3Assets.drums),
    audio: getAssetAudioUrl(s3Assets.drumPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.DPhonemeAudio),
  },
  {
    id: 3,
    title: "Consonant Sounds",
    letter: "f",
    word: "fish",
    image: getAssetUrl(s3Assets.fishSixImg),
    audio: getAssetAudioUrl(s3Assets.fishPhonemeAudioYT),
    phonemeAudio: s3Assets.FPhonemeAudio,
  },
  {
    id: 4,
    title: "Consonant Sounds",
    letter: "g",
    word: "grapes",
    image: getAssetUrl(s3Assets.grapes),
    audio: getAssetAudioUrl(s3Assets.grapesPhonemeAudioYT),
    phonemeAudio: s3Assets.GPhonemeAudio,
  },
  {
    id: 5,
    title: "Consonant Sounds",
    letter: "h",
    word: "hand",
    image: getAssetUrl(s3Assets.handEightImg),
    audio: getAssetAudioUrl(s3Assets.handPhonemeAudioYT),
    phonemeAudio: s3Assets.HPhonemeAudio,
  },
  {
    id: 6,
    title: "Consonant Sounds",
    letter: "j",
    word: "jam",
    image: getAssetUrl(s3Assets.jam),
    audio: getAssetAudioUrl(s3Assets.jamPhonemeAudioYT),
    phonemeAudio: s3Assets.JPhonemeAudio,
  },
  {
    id: 7,
    title: "Consonant Sounds",
    letter: "k",
    word: "car",
    image: getAssetUrl(s3Assets.carEighteenImg),
    audio: getAssetAudioUrl(s3Assets.carPhonemeAudioYT),
    phonemeAudio: s3Assets.KPhonemeAudio,
  },
  {
    id: 8,
    title: "Consonant Sounds",
    letter: "l",
    word: "lollipop",
    image: getAssetUrl(s3Assets.lolipop),
    audio: getAssetAudioUrl(s3Assets.lollipopPhonemeAudioYT),
    phonemeAudio: s3Assets.LPhonemeAudio,
  },
  {
    id: 9,
    title: "Consonant Sounds",
    letter: "m",
    word: "monkey",
    image: getAssetUrl(s3Assets.monkey),
    audio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudioYT),
    phonemeAudio: s3Assets.MPhonemeAudio,
  },
  {
    id: 10,
    title: "Consonant Sounds",
    letter: "n",
    word: "nest",
    image: getAssetUrl(s3Assets.nest),
    audio: getAssetAudioUrl(s3Assets.nestPhonemeAudioYT),
    phonemeAudio: s3Assets.NPhonemeAudio,
  },
  {
    id: 11,
    title: "Consonant Sounds",
    letter: "p",
    word: "pumpkin",
    image: getAssetUrl(s3Assets.pumpkin),
    audio: getAssetAudioUrl(s3Assets.pumpkinPhonemeAudioYT),
  },
  {
    id: 12,
    title: "Consonant Sounds",
    letter: "r",
    word: "rainbow",
    image: getAssetUrl(s3Assets.rainbow),
    audio: getAssetAudioUrl(s3Assets.rainbowPhonemeAudioYT),
    phonemeAudio: s3Assets.RPhonemeAudio,
  },
  {
    id: 13,
    title: "Consonant Sounds",
    letter: "s",
    word: "sun",
    image: getAssetUrl(s3Assets.sun),
    audio: getAssetAudioUrl(s3Assets.sunPhonemeAudioYT),
    phonemeAudio: s3Assets.SPhonemeAudio,
  },
  {
    id: 14,
    title: "Consonant Sounds",
    letter: "zh",
    word: "treasure",
    image: getAssetUrl(s3Assets.treasure),
    audio: getAssetAudioUrl(s3Assets.treasurePhonemeAudioYT),
    phonemeAudio: s3Assets.TPhonemeAudio,
  },
  {
    id: 15,
    title: "Consonant Sounds",
    letter: "t",
    word: "tree",
    image: getAssetUrl(s3Assets.tree),
    audio: getAssetAudioUrl(s3Assets.treePhonemeAudioYT),
    phonemeAudio: s3Assets.TPhonemeAudio,
  },
  {
    id: 16,
    title: "Consonant Sounds",
    letter: "v",
    word: "van",
    image: getAssetUrl(s3Assets.van),
    audio: getAssetAudioUrl(s3Assets.vanPhonemeAudioYT),
    phonemeAudio: s3Assets.VPhonemeAudio,
  },
  {
    id: 17,
    title: "Consonant Sounds",
    letter: "w",
    word: "window",
    image: getAssetUrl(s3Assets.window),
    audio: getAssetAudioUrl(s3Assets.windowPhonemeAudioYT),
    phonemeAudio: s3Assets.WPhonemeAudio,
  },
  {
    id: 18,
    title: "Consonant Sounds",
    letter: "y",
    word: "yak",
    image: getAssetUrl(s3Assets.yak),
    audio: getAssetAudioUrl(s3Assets.yakPhonemeAudioYT),
    phonemeAudio: s3Assets.YPhonemeAudio,
  },
  {
    id: 19,
    title: "Consonant Sounds",
    letter: "z",
    word: "zip",
    image: getAssetUrl(s3Assets.zip),
    audio: getAssetAudioUrl(s3Assets.zipPhonemeAudioYT),
    phonemeAudio: s3Assets.ZPhonemeAudio,
  },
  {
    id: 20,
    title: "Consonant Sounds",
    letter: "x",
    word: "fox",
    image: getAssetUrl(s3Assets.fox),
    audio: getAssetAudioUrl(s3Assets.foxPhonemeAudioYT),
    phonemeAudio: s3Assets.XPhonemeAudio,
  },
  {
    id: 21,
    title: "Consonant Sounds",
    letter: "qu",
    word: "quit",
    image: getAssetUrl(s3Assets.quilt),
    audio: getAssetAudioUrl(s3Assets.quiltPhonemeAudioYT),
    phonemeAudio: s3Assets.QPhonemeAudio,
  },
  {
    id: 22,
    title: "Consonant Sounds",
    letter: "ch",
    word: "chain",
    image: getAssetUrl(s3Assets.chain),
    audio: getAssetAudioUrl(s3Assets.chainPhonemeAudioYT),
    phonemeAudio: s3Assets.CPhonemeAudio,
  },
  {
    id: 23,
    title: "Consonant Sounds",
    letter: "sh",
    word: "sheep",
    image: getAssetUrl(s3Assets.sheep),
    audio: getAssetAudioUrl(s3Assets.sheepPhonemeAudioYT),
    phonemeAudio: s3Assets.SPhonemeAudio,
  },
  {
    id: 24,
    title: "Consonant Sounds",
    letter: "th",
    word: "mother",
    image: getAssetUrl(s3Assets.motherGif),
    audio: getAssetAudioUrl(s3Assets.motherPhonemeAudioYT),
    phonemeAudio: s3Assets.HPhonemeAudio,
  },
  {
    id: 25,
    title: "Consonant Sounds",
    letter: "ng",
    word: "sing",
    image: getAssetUrl(s3Assets.sing),
    audio: getAssetAudioUrl(s3Assets.singPhonemeAudioYT),
    phonemeAudio: s3Assets.NPhonemeAudio,
  },
  {
    id: 26,
    title: "Consonant Sounds",
    letter: "a",
    word: "apple",
    image: getAssetUrl(s3Assets.apple),
    audio: getAssetAudioUrl(s3Assets.applePhonemeAudioYT),
    phonemeAudio: s3Assets.APhonemeAudio,
  },
  {
    id: 27,
    title: "Consonant Sounds",
    letter: "e",
    word: "egg",
    image: getAssetUrl(s3Assets.egg),
    audio: getAssetAudioUrl(s3Assets.eggPhonemeAudioYT),
    phonemeAudio: s3Assets.EPhonemeAudio,
  },
  {
    id: 28,
    title: "Consonant Sounds",
    letter: "i",
    word: "igloo",
    image: getAssetUrl(s3Assets.igloo),
    audio: getAssetAudioUrl(s3Assets.iglooPhonemeAudioYT),
    phonemeAudio: s3Assets.IPhonemeAudio,
  },
  {
    id: 29,
    title: "Consonant Sounds",
    letter: "o",
    word: "orange",
    image: getAssetUrl(s3Assets.orange),
    audio: getAssetAudioUrl(s3Assets.orangePhonemeAudioYT),
    phonemeAudio: s3Assets.OPhonemeAudio,
  },
  {
    id: 30,
    title: "Consonant Sounds",
    letter: "u",
    word: "umbrella",
    image: getAssetUrl(s3Assets.umbrella),
    audio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudioYT),
    phonemeAudio: s3Assets.UPhonemeAudio,
  },
  {
    id: 31,
    title: "Consonant Sounds",
    letter: "ai",
    word: "rain",
    image: getAssetUrl(s3Assets.rain),
    audio: getAssetAudioUrl(s3Assets.rainPhonemeAudioYT),
    phonemeAudio: s3Assets.APhonemeAudio,
  },
  {
    id: 32,
    title: "Consonant Sounds",
    letter: "ee",
    word: "bee",
    image: getAssetUrl(s3Assets.bee),
    audio: getAssetAudioUrl(s3Assets.beePhonemeAudioYT),
    phonemeAudio: s3Assets.EPhonemeAudio,
  },
  {
    id: 33,
    title: "Consonant Sounds",
    letter: "ie",
    word: "pie",
    image: getAssetUrl(s3Assets.pie),
    audio: getAssetAudioUrl(s3Assets.piePhonemeAudioYT),
    phonemeAudio: s3Assets.IPhonemeAudio,
  },
  {
    id: 34,
    title: "Consonant Sounds",
    letter: "oa",
    word: "boat",
    image: getAssetUrl(s3Assets.boat),
    audio: getAssetAudioUrl(s3Assets.boatPhonemeAudioYT),
    phonemeAudio: s3Assets.APhonemeAudio,
  },
  {
    id: 35,
    title: "Consonant Sounds",
    letter: "oo",
    word: "moon",
    image: getAssetUrl(s3Assets.moon),
    audio: getAssetAudioUrl(s3Assets.moonPhonemeAudioYT),
    phonemeAudio: s3Assets.OPhonemeAudio,
  },
  {
    id: 36,
    title: "Consonant Sounds",
    letter: "oo",
    word: "book",
    image: getAssetUrl(s3Assets.book),
    audio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
    phonemeAudio: s3Assets.OPhonemeAudio,
  },
  {
    id: 37,
    title: "Consonant Sounds",
    letter: "ou",
    word: "cloud",
    image: getAssetUrl(s3Assets.cloud),
    audio: getAssetAudioUrl(s3Assets.cloudPhonemeAudioYT),
    phonemeAudio: s3Assets.UPhonemeAudio,
  },
  {
    id: 38,
    title: "Consonant Sounds",
    letter: "oi",
    word: "coin",
    image: getAssetUrl(s3Assets.coin),
    audio: getAssetAudioUrl(s3Assets.coinPhonemeAudioYT),
    phonemeAudio: s3Assets.OPhonemeAudio,
  },
  {
    id: 39,
    title: "Consonant Sounds",
    letter: "aw",
    word: "saw",
    image: getAssetUrl(s3Assets.saw),
    audio: getAssetAudioUrl(s3Assets.sawPhonemeAudioYT),
    phonemeAudio: s3Assets.WPhonemeAudio,
  },
  {
    id: 40,
    title: "Consonant Sounds",
    letter: "ar",
    word: "star",
    image: getAssetUrl(s3Assets.star),
    audio: getAssetAudioUrl(s3Assets.starPhonemeAudioYT),
    phonemeAudio: s3Assets.RPhonemeAudio,
  },
  {
    id: 41,
    title: "Consonant Sounds",
    letter: "er",
    word: "sister",
    image: getAssetUrl(s3Assets.sister),
    audio: getAssetAudioUrl(s3Assets.sisterPhonemeAudioYT),
    phonemeAudio: s3Assets.EPhonemeAudio,
  },
  {
    id: 42,
    title: "Consonant Sounds",
    letter: "or",
    word: "corn",
    image: getAssetUrl(s3Assets.corn),
    audio: getAssetAudioUrl(s3Assets.cornPhonemeAudioYT),
  },
  {
    id: 43,
    title: "Consonant Sounds",
    letter: "air",
    word: "chair",
    image: getAssetUrl(s3Assets.chair),
    audio: getAssetAudioUrl(s3Assets.chairPhonemeAudioYT),
    phonemeAudio: s3Assets.APhonemeAudio,
  },
  {
    id: 45,
    title: "Consonant Sounds",
    letter: "ear",
    word: "hear",
    image: getAssetUrl(s3Assets.hear),
    audio: getAssetAudioUrl(s3Assets.hearPhonemeAudioYT),
    phonemeAudio: s3Assets.RPhonemeAudio,
  },
];

const dataKn = [
  {
    id: 1,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R1_1),
      getAssetUrl(s3Assets.R1_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA1b),
      getAssetAudioUrl(s3Assets.RA1c),
    ],
  },
  {
    id: 2,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R2_1),
      getAssetUrl(s3Assets.R2_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA2b),
      getAssetAudioUrl(s3Assets.RA2c),
    ],
  },
  {
    id: 3,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R3_1),
      getAssetUrl(s3Assets.R3_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA3b),
      getAssetAudioUrl(s3Assets.RA3c),
    ],
  },
  {
    id: 4,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R4_1),
      getAssetUrl(s3Assets.R4_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA4b),
      getAssetAudioUrl(s3Assets.RA4c),
    ],
  },
  {
    id: 5,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R5_1),
      getAssetUrl(s3Assets.R5_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA5b),
      getAssetAudioUrl(s3Assets.RA5c),
    ],
  },
  {
    id: 6,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R6_1),
      getAssetUrl(s3Assets.R6_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA6b),
      getAssetAudioUrl(s3Assets.RA6c),
    ],
  },
  {
    id: 7,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R7_1),
      getAssetUrl(s3Assets.R7_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA7b),
      getAssetAudioUrl(s3Assets.RA7c),
    ],
  },
  {
    id: 8,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R8_1),
      getAssetUrl(s3Assets.R8_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA8b),
      getAssetAudioUrl(s3Assets.RA8c),
    ],
  },
  {
    id: 9,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R9_1),
      getAssetUrl(s3Assets.R9_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA9b),
      getAssetAudioUrl(s3Assets.RA9c),
    ],
  },
  {
    id: 10,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R10_1),
      getAssetUrl(s3Assets.R10_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA10b),
      getAssetAudioUrl(s3Assets.RA10c),
    ],
  },
  {
    id: 11,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R11_1),
      getAssetUrl(s3Assets.R11_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA11b),
      getAssetAudioUrl(s3Assets.RA11c),
    ],
  },
  {
    id: 12,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R12_1),
      getAssetUrl(s3Assets.R12_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA12b),
      getAssetAudioUrl(s3Assets.RA12c),
    ],
  },
  {
    id: 13,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R13_1),
      getAssetUrl(s3Assets.R13_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA13b),
      getAssetAudioUrl(s3Assets.RA13c),
    ],
  },
  {
    id: 14,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R14_1),
      getAssetUrl(s3Assets.R14_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA14b),
      getAssetAudioUrl(s3Assets.RA14c),
    ],
  },
  {
    id: 15,
    images: [
      getAssetUrl(s3Assets.R1),
      getAssetUrl(s3Assets.R15_1),
      getAssetUrl(s3Assets.R15_2),
    ],
    audios: [
      getAssetAudioUrl(s3Assets.RA1ato15a),
      getAssetAudioUrl(s3Assets.RA15b),
      getAssetAudioUrl(s3Assets.RA15c),
    ],
  },
];

const R1 = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
  //enableNext,
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
  //setEnableNext,
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
  //isNextButtonCalled,
  //setIsNextButtonCalled,
}) => {
  steps = 1;
  const lang = getLocalData("lang");
  let data;

  if (lang === "en") {
    data = dataEn;
  } else {
    data = dataKn;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("UI1");
  const batchIndex = Math.floor(currentIndex / 10);
  const stepInBatch = Math.floor((currentIndex % 10) / 5);
  const navigate = useNavigate();
  const blockSize = 5;
  const totalItems = data.length;
  const totalSteps = Math.ceil(totalItems / blockSize) * 2;

  const [stepIndex, setStepIndex] = useState(0);
  // const itemIndex = batchIndex * 5 + (currentIndex % 5);
  //const item = data[itemIndex];
  // Figure out block and phase
  const blockIndex = Math.floor(stepIndex / (blockSize * 2)); // which block
  const inBlockStep = stepIndex % (blockSize * 2); // position inside block’s 2 phases
  const blockStart = blockIndex * blockSize;
  const blockEnd = Math.min(blockStart + blockSize, totalItems);

  // Determine if we're in UI1 or UI2
  const isUI1 = inBlockStep < blockEnd - blockStart;

  // Current item
  const itemIndex = blockStart + (inBlockStep % (blockEnd - blockStart));
  const item = data[itemIndex];
  const prevItem = itemIndex > 0 ? data[itemIndex - 1] : null;
  //const blockStart = Math.floor(itemIndex / 5) * 5;
  const letters = data
    .slice(blockStart, itemIndex)
    .flatMap((item) => item.letter || []);
  const COLORS = ["#8BC34A", "#9C27B0", "#E91E63", "#03A9F4", "#FF9800"];
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [recAudio, setRecAudio] = useState(null);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [enableNext, setEnableNext] = useState(false);
  const [itemIndexUi, setItemIndexUi] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);

  const currentItem = dataKn[itemIndexUi];

  const currentAudio =
    lang === "en" ? item?.audio : currentItem?.audios?.[imgIndex];
  console.log("audios", currentAudio);

  const handleNextImage = () => {
    if (imgIndex < currentItem.images.length - 1) {
      setImgIndex((i) => i + 1);
    } else {
      if (itemIndexUi < dataKn.length - 1) {
        setItemIndexUi((i) => i + 1);
        setImgIndex(0);
      } else {
        setLocalData("rFlow", false);
        navigate("/practice");
      }
    }
    setRecAudio(null);
    setIsNextButtonCalled(true);
    setEnableNext(false);
  };

  const handleNextWord = () => {
    console.log("datas", stepIndex, totalSteps, blockSize);

    if (stepIndex < totalSteps * blockSize - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setLocalData("rFlow", false);
      navigate("/practice");
    }
    setRecAudio(null);
    setIsNextButtonCalled(true);
    setEnableNext(false);
  };

  const handleRetry = () => {
    console.log("audio playing!");
  };

  const updateStoredData = (audio, isCorrect) => {};

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio(null);
    }
  };

  const handleStartRecording = () => {
    setRecAudio(null);
  };

  const handleStopRecording = () => {
    setRecAudio(true);
  };

  const navy = "#1c2752";
  const red = "#C93128";
  const pink = "#ea4c89";
  const orange = "#f28b1d";

  const flowNames = [...new Set(data.map((item) => item.id))];

  const renderUI = () => {
    // const block = Math.floor(currentIndex / 5);
    // const isUI1 = block % 2 === 0;

    //console.log('ui?', currentIndex, block, isUI1, letters);

    const UI1 = () => {
      console.log("ui1");

      return (
        <Box>
          {/* BOARD with notebook background */}
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              width: "min(100%, 1024px)",
              //aspectRatio: "16/9",
              borderRadius: 2,
              // notebook lines
              backgroundImage:
                "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 44px, #e6e9ef 46px)",
              backgroundColor: "#fff",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              //px: { xs: 2.5, md: 5 },
              pt: { xs: 3, md: 4 },
              pb: { xs: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: { xs: 18, md: 22 },
                left: { xs: 18, md: 24 },
                width: { xs: 60, md: 72 },
                height: { xs: 60, md: 72 },
                bgcolor: red,
                color: "#fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: { xs: 30, md: 40 },
                lineHeight: 1,
                fontFamily: "Quicksand",
              }}
            >
              {item.id}
            </Box>

            {/* Title centered */}
            <Box sx={{ textAlign: "center", position: "relative", mb: 2 }}>
              {/* Train Image */}
              <img
                src={trainImg}
                alt="train"
                style={{ width: "100%", maxWidth: "400px" }}
              />

              {/* Letters mapped over the train */}
              <Box
                sx={{
                  position: "absolute",
                  top: "15%",
                  left: "60%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <AnimatePresence>
                  {letters?.map((ch, i) => (
                    <motion.div
                      key={ch + i}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 1.0, ease: "easeOut" }}
                    >
                      <Box
                        sx={{
                          minWidth: 40,
                          minHeight: 40,
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          background: COLORS[i % COLORS.length],
                          boxShadow: 2,
                        }}
                      >
                        <span
                          style={{ fontFamily: "Quicksand", color: "#FFFFFF" }}
                        >
                          {ch}
                        </span>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </Box>

            {/* Middle row: big letter + image */}
            <Box
              sx={{
                //mt: { xs: 2, md: 2 },
                width: "100%",
                ml: "25%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: red,
                  fontWeight: 500,
                  fontSize: { xs: 160, md: 200 },
                  lineHeight: 1,
                  ml: { xs: 2, md: 4 },
                  fontFamily: "Quicksand",
                }}
              >
                {item.letter}
              </Typography>

              <Box
                sx={{
                  mt: { xs: 2, md: 2 },
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.word}
                  sx={{
                    width: { xs: 200, md: 220 },
                    height: { xs: 200, md: 220 },
                    objectFit: "contain",
                    mr: { xs: 2, md: 4 },
                  }}
                />
                <Typography
                  sx={{
                    //mt: { xs: 1, md: 1.5 },
                    fontWeight: 800,
                    fontSize: { xs: 28, md: 40 },
                    mr: 4,
                    letterSpacing: 1,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "Quicksand",
                    gap: 0.5,
                  }}
                >
                  {item?.word?.split("").map((ch, idx) => (
                    <Box
                      key={idx}
                      component="span"
                      sx={{
                        color:
                          ch.toLowerCase() === item.letter.toLowerCase()
                            ? red
                            : navy,
                      }}
                    >
                      {ch}
                    </Box>
                  ))}
                </Typography>
              </Box>
            </Box>

            {/* Buttons */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
            >
              <IconButton
                onClick={handleRetry}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: pink,
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 6px 14px rgba(234,76,137,0.35)",
                  "&:hover": { bgcolor: pink },
                }}
              >
                <RotateCcw size={26} />
              </IconButton>

              <IconButton
                onClick={handleNextWord}
                //disabled={itemIndex === data.length - 1}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: orange,
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 6px 14px rgba(242,139,29,0.35)",
                  "&:hover": { bgcolor: orange },
                  //opacity: itemIndex === data.length - 1 ? 0.5 : 1,
                }}
              >
                <ArrowRight size={26} />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      );
    };

    const UI2 = () => {
      console.log("ui2");
      return (
        <Box>
          {/* BOARD with notebook background */}
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              width: "min(100%, 1024px)",
              //aspectRatio: "16/9",
              borderRadius: 2,
              // notebook lines
              // backgroundImage:
              //   "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 44px, #e6e9ef 46px)",
              backgroundColor: "#fff",
              overflow: "hidden",
              //boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              //px: { xs: 2.5, md: 5 },
              pt: { xs: 3, md: 4 },
              pb: { xs: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                backgroundColor: recAudio ? "#1CB0F60F" : "#fff",
                border: recAudio ? "2px solid #58CC02" : "none",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 70px",
                marginBottom: "26px",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {recAudio && (
                  <img
                    //src={!isIncorrectWord ? Assets.tick : Assets.wrongTick}
                    src={Assets.tick}
                    alt="tick"
                    style={{
                      marginRight: "16px",
                      width: "56px",
                      height: "56px",
                    }}
                  />
                )}
                <span
                  style={{
                    color: "#333F61",
                    //color: isRecorded ? "#58CC02" : "#333F61",
                    fontWeight: 700,
                    fontSize: recAudio ? "72px" : "96px",
                    lineHeight: "87px",
                    letterSpacing: "2%",
                    fontFamily: "Quicksand",
                    //textTransform: "uppercase",
                  }}
                >
                  {item.letter}
                </span>
              </Box>
              {recAudio && (
                <img
                  src={Assets.graph}
                  alt="graph"
                  style={{ height: "40px", margin: "10px" }}
                />
              )}
            </Box>

            <VoiceAnalyser
              key={currentIndex}
              pageName={"wordsorimage"}
              setVoiceText={setVoiceText}
              updateStoredData={updateStoredData}
              setRecordedAudio={setRecordedAudio}
              setVoiceAnimate={setVoiceAnimate}
              storyLine={storyLine}
              dontShowListen={type === "image" || isDiscover}
              originalText={"text"}
              handleNext={handleNextWord}
              enableNext={enableNext}
              isShowCase={isShowCase || isDiscover}
              handleRecordingComplete={handleRecordingComplete}
              handleStartRecording={handleStartRecording}
              handleStopRecording={handleStopRecording}
              audioLink={currentAudio}
              noOffline={true}
              isNextButtonCalled={isNextButtonCalled}
              setIsNextButtonCalled={setIsNextButtonCalled}
              setEnableNext={setEnableNext}
              //setIsCorrect={setIsTranscriptCorrect}
              {...{
                contentId,
                contentType,
                currentLine: currentStep - 1,
                playTeacherAudio,
                callUpdateLearner,
                //setEnableNext,
                setOpenMessageDialog,
                //isNextButtonCalled,
                //setIsNextButtonCalled,
              }}
            />
          </Box>
        </Box>
      );
    };

    const UI3 = () => {
      console.log("ui3");
      return (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              //alignItems: "center",
              //width: "100%",
              mt: 3,
              gap: 2,
            }}
          >
            {/* LEFT SIDE (all images with opacity logic) */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                ml: 8,
              }}
            >
              {currentItem?.images?.map((img, index) => (
                <React.Fragment key={index}>
                  <img
                    src={img}
                    alt={`img-${index}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "contain",
                      opacity: index === imgIndex ? 1 : 0.3, // current full opacity
                      transition: "opacity 0.3s",
                    }}
                  />
                  {index < currentItem.images.length - 1 && (
                    <span
                      style={{
                        fontSize: "72px",
                        fontWeight: "500",
                        margin: "0 8px",
                        fontFamily: "Quicksand",
                      }}
                    >
                      {index === currentItem.images.length - 2 ? "=" : "+"}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </Box>

            {/* DIVIDER */}
            <Box sx={{ width: "2px", backgroundColor: "#ccc", ml: 20 }} />

            {/* RIGHT SIDE (current big image) */}
            <Box
              sx={{
                flex: 2,
                gap: 5,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentItem?.images[imgIndex]} // key ensures animation on image change
                  src={currentItem?.images[imgIndex]}
                  alt="current"
                  initial={{ x: -400, opacity: 0 }} // start left
                  animate={{ x: 0, opacity: 1 }} // move to center
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  style={{
                    maxWidth: "180px",
                    maxHeight: "180px",
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                  onClick={handleNextImage}
                />
              </AnimatePresence>

              {/* BELOW → VoiceAnalyser (as you already have) */}
              <VoiceAnalyser
                key={`${itemIndex}-${imgIndex}`}
                pageName={"wordsorimage"}
                setVoiceText={setVoiceText}
                updateStoredData={updateStoredData}
                setRecordedAudio={setRecordedAudio}
                setVoiceAnimate={setVoiceAnimate}
                storyLine={storyLine}
                dontShowListen={type === "image" || isDiscover}
                originalText={"text"}
                handleNext={handleNextImage} // clicking next audio also advances image
                enableNext={enableNext}
                isShowCase={isShowCase || isDiscover}
                handleRecordingComplete={handleRecordingComplete}
                handleStartRecording={handleStartRecording}
                handleStopRecording={handleStopRecording}
                audioLink={currentAudio}
                noOffline={true}
                isNextButtonCalled={isNextButtonCalled}
                setIsNextButtonCalled={setIsNextButtonCalled}
                setEnableNext={setEnableNext}
                {...{
                  contentId,
                  contentType,
                  currentLine: currentStep - 1,
                  playTeacherAudio,
                  callUpdateLearner,
                  setOpenMessageDialog,
                }}
              />
            </Box>
          </Box>
        </Box>
      );
    };

    if (lang !== "en") {
      return UI3(item);
    }

    return isUI1 ? UI1(item) : UI2(item);
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
      flowNames={flowNames} // Pass all flows
      //   activeFlow={activeFlow} // Pass current active flow
      //   lang={lang}
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
      {renderUI()}
    </MainLayout>
  );
};

export default R1;
