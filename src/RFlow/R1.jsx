import React, { useState, useEffect, useRef } from "react";
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
  sendTestRigScore,
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
import { updateLearnerProfile } from "../services/learnerAi/learnerAiService";
import {
  addLesson,
  addPointer,
  fetchUserPoints,
  createLearnerProgress,
} from "../services/orchestration/orchestrationService";
import { fetchGetSetResult } from "../services/learnerAi/learnerAiService";
import {
  fetchAssessmentData,
  fetchPaginatedContent,
} from "../services/content/contentService";

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
    phonemeAudio: getAssetAudioUrl(s3Assets.FPhonemeAudio),
  },
  {
    id: 4,
    title: "Consonant Sounds",
    letter: "g",
    word: "grapes",
    image: getAssetUrl(s3Assets.grapes),
    audio: getAssetAudioUrl(s3Assets.grapesPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.GPhonemeAudio),
  },
  {
    id: 5,
    title: "Consonant Sounds",
    letter: "h",
    word: "hand",
    image: getAssetUrl(s3Assets.handEightImg),
    audio: getAssetAudioUrl(s3Assets.handPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.HPhonemeAudio),
  },
  {
    id: 6,
    title: "Consonant Sounds",
    letter: "j",
    word: "jam",
    image: getAssetUrl(s3Assets.jam),
    audio: getAssetAudioUrl(s3Assets.jamPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.JPhonemeAudio),
  },
  {
    id: 7,
    title: "Consonant Sounds",
    letter: "k",
    word: "car",
    image: getAssetUrl(s3Assets.carEighteenImg),
    audio: getAssetAudioUrl(s3Assets.carPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.KPhonemeAudio),
  },
  {
    id: 8,
    title: "Consonant Sounds",
    letter: "l",
    word: "lollipop",
    image: getAssetUrl(s3Assets.lolipop),
    audio: getAssetAudioUrl(s3Assets.lollipopPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.LPhonemeAudio),
  },
  {
    id: 9,
    title: "Consonant Sounds",
    letter: "m",
    word: "monkey",
    image: getAssetUrl(s3Assets.monkey),
    audio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.MPhonemeAudio),
  },
  {
    id: 10,
    title: "Consonant Sounds",
    letter: "n",
    word: "nest",
    image: getAssetUrl(s3Assets.nest),
    audio: getAssetAudioUrl(s3Assets.nestPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.NPhonemeAudio),
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
    phonemeAudio: getAssetAudioUrl(s3Assets.RPhonemeAudio),
  },
  {
    id: 13,
    title: "Consonant Sounds",
    letter: "s",
    word: "sun",
    image: getAssetUrl(s3Assets.sun),
    audio: getAssetAudioUrl(s3Assets.sunPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.SPhonemeAudio),
  },
  {
    id: 14,
    title: "Consonant Sounds",
    letter: "zh",
    word: "treasure",
    image: getAssetUrl(s3Assets.treasure),
    audio: getAssetAudioUrl(s3Assets.treasurePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.TPhonemeAudio),
  },
  {
    id: 15,
    title: "Consonant Sounds",
    letter: "t",
    word: "tree",
    image: getAssetUrl(s3Assets.tree),
    audio: getAssetAudioUrl(s3Assets.treePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.TPhonemeAudio),
  },
  {
    id: 16,
    title: "Consonant Sounds",
    letter: "v",
    word: "van",
    image: getAssetUrl(s3Assets.van),
    audio: getAssetAudioUrl(s3Assets.vanPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.VPhonemeAudio),
  },
  {
    id: 17,
    title: "Consonant Sounds",
    letter: "w",
    word: "window",
    image: getAssetUrl(s3Assets.window),
    audio: getAssetAudioUrl(s3Assets.windowPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.WPhonemeAudio),
  },
  {
    id: 18,
    title: "Consonant Sounds",
    letter: "y",
    word: "yak",
    image: getAssetUrl(s3Assets.yak),
    audio: getAssetAudioUrl(s3Assets.yakPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.YPhonemeAudio),
  },
  {
    id: 19,
    title: "Consonant Sounds",
    letter: "z",
    word: "zip",
    image: getAssetUrl(s3Assets.zip),
    audio: getAssetAudioUrl(s3Assets.zipPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.ZPhonemeAudio),
  },
  {
    id: 20,
    title: "Consonant Sounds",
    letter: "x",
    word: "fox",
    image: getAssetUrl(s3Assets.fox),
    audio: getAssetAudioUrl(s3Assets.foxPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.XPhonemeAudio),
  },
  {
    id: 21,
    title: "Consonant Sounds",
    letter: "qu",
    word: "queen",
    image: getAssetUrl(s3Assets.queenSixteenImg),
    audio: getAssetAudioUrl(s3Assets.queenAud),
    phonemeAudio: getAssetAudioUrl(s3Assets.QPhonemeAudio),
  },
  {
    id: 22,
    title: "Consonant Sounds",
    letter: "ch",
    word: "chain",
    image: getAssetUrl(s3Assets.chain),
    audio: getAssetAudioUrl(s3Assets.chainPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.CPhonemeAudio),
  },
  {
    id: 23,
    title: "Consonant Sounds",
    letter: "sh",
    word: "sheep",
    image: getAssetUrl(s3Assets.sheep),
    audio: getAssetAudioUrl(s3Assets.sheepPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.SPhonemeAudio),
  },
  {
    id: 24,
    title: "Consonant Sounds",
    letter: "th",
    word: "mother",
    image: getAssetUrl(s3Assets.motherGif),
    audio: getAssetAudioUrl(s3Assets.motherPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.HPhonemeAudio),
  },
  {
    id: 25,
    title: "Consonant Sounds",
    letter: "ng",
    word: "sing",
    image: getAssetUrl(s3Assets.sing),
    audio: getAssetAudioUrl(s3Assets.singPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.NPhonemeAudio),
  },
  {
    id: 26,
    title: "Consonant Sounds",
    letter: "a",
    word: "apple",
    image: getAssetUrl(s3Assets.apple),
    audio: getAssetAudioUrl(s3Assets.appleAud),
    phonemeAudio: getAssetAudioUrl(s3Assets.APhonemeAudio),
  },
  {
    id: 27,
    title: "Consonant Sounds",
    letter: "e",
    word: "egg",
    image: getAssetUrl(s3Assets.egg),
    audio: getAssetAudioUrl(s3Assets.eggPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.EPhonemeAudio),
  },
  {
    id: 28,
    title: "Consonant Sounds",
    letter: "i",
    word: "igloo",
    image: getAssetUrl(s3Assets.igloo),
    audio: getAssetAudioUrl(s3Assets.iglooPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.IPhonemeAudio),
  },
  {
    id: 29,
    title: "Consonant Sounds",
    letter: "o",
    word: "orange",
    image: getAssetUrl(s3Assets.orange),
    audio: getAssetAudioUrl(s3Assets.orangePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.OPhonemeAudio),
  },
  {
    id: 30,
    title: "Consonant Sounds",
    letter: "u",
    word: "umbrella",
    image: getAssetUrl(s3Assets.umbrella),
    audio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.UPhonemeAudio),
  },
  {
    id: 31,
    title: "Consonant Sounds",
    letter: "ai",
    word: "rain",
    image: getAssetUrl(s3Assets.rain),
    audio: getAssetAudioUrl(s3Assets.rainPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.APhonemeAudio),
  },
  {
    id: 32,
    title: "Consonant Sounds",
    letter: "ee",
    word: "bee",
    image: getAssetUrl(s3Assets.bee),
    audio: getAssetAudioUrl(s3Assets.beePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.EPhonemeAudio),
  },
  {
    id: 33,
    title: "Consonant Sounds",
    letter: "ie",
    word: "pie",
    image: getAssetUrl(s3Assets.pie),
    audio: getAssetAudioUrl(s3Assets.piePhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.IPhonemeAudio),
  },
  {
    id: 34,
    title: "Consonant Sounds",
    letter: "oa",
    word: "boat",
    image: getAssetUrl(s3Assets.boat),
    audio: getAssetAudioUrl(s3Assets.boatPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.APhonemeAudio),
  },
  {
    id: 35,
    title: "Consonant Sounds",
    letter: "oo",
    word: "moon",
    image: getAssetUrl(s3Assets.moon),
    audio: getAssetAudioUrl(s3Assets.moonPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.OPhonemeAudio),
  },
  {
    id: 36,
    title: "Consonant Sounds",
    letter: "oo",
    word: "book",
    image: getAssetUrl(s3Assets.book),
    audio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
    phonemeAudio: getAssetAudioUrl(s3Assets.OPhonemeAudio),
  },
  {
    id: 37,
    title: "Consonant Sounds",
    letter: "ou",
    word: "cloud",
    image: getAssetUrl(s3Assets.cloud),
    audio: getAssetAudioUrl(s3Assets.cloudPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.UPhonemeAudio),
  },
  {
    id: 38,
    title: "Consonant Sounds",
    letter: "oi",
    word: "coin",
    image: getAssetUrl(s3Assets.coin),
    audio: getAssetAudioUrl(s3Assets.coinPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.OPhonemeAudio),
  },
  {
    id: 39,
    title: "Consonant Sounds",
    letter: "aw",
    word: "saw",
    image: getAssetUrl(s3Assets.saw),
    audio: getAssetAudioUrl(s3Assets.sawPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.WPhonemeAudio),
  },
  {
    id: 40,
    title: "Consonant Sounds",
    letter: "ar",
    word: "star",
    image: getAssetUrl(s3Assets.star),
    audio: getAssetAudioUrl(s3Assets.starPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.RPhonemeAudio),
  },
  {
    id: 41,
    title: "Consonant Sounds",
    letter: "er",
    word: "sister",
    image: getAssetUrl(s3Assets.sister),
    audio: getAssetAudioUrl(s3Assets.sisterPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.EPhonemeAudio),
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
    phonemeAudio: getAssetAudioUrl(s3Assets.APhonemeAudio),
  },
  {
    id: 45,
    title: "Consonant Sounds",
    letter: "ear",
    word: "hear",
    image: getAssetUrl(s3Assets.hear),
    audio: getAssetAudioUrl(s3Assets.hearPhonemeAudioYT),
    phonemeAudio: getAssetAudioUrl(s3Assets.RPhonemeAudio),
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
  const inBlockStep = stepIndex % (blockSize * 2); // position inside block's 2 phases
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

  const audioRef = useRef(null);

  const sessionId = getLocalData("sessionId");
  const virtualId = getLocalData("virtualId");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");

  const langWiseAnswers = {
    en: {
      c: true,
      j: true,
      x: true,
      k: true,
      h: true,
      n: true,
      p: true,
      u: true,
      s: true,
      o: true,
    },
    ta: {
      அ: true,
      ஆ: true,
      இ: true,
      ஈ: true,
      உ: true,
      ஊ: true,
      எ: true,
      ஏ: true,
      ஐ: true,
      ஒ: true,
    },
    te: {
      అ: true,
      ఆ: true,
      ఇ: true,
      ఈ: true,
      ఉ: true,
      ఊ: true,
      ఎ: true,
      ఏ: true,
      ఐ: true,
      ఒ: true,
    },
    kn: {
      ಅ: true,
      ಆ: true,
      ಇ: true,
      ಈ: true,
      ಉ: true,
      ಊ: true,
      ಎ: true,
      ಏ: true,
      ಐ: true,
      ಒ: true,
    },
    hi: {
      अ: true,
      आ: true,
      इ: true,
      ई: true,
      उ: true,
      ऊ: true,
      ए: true,
      ऐ: true,
      ओ: true,
      औ: true,
    },
  };

  const currentAudio =
    isUI1 && (lang === "en" ? item?.audio : currentItem?.audios?.[imgIndex]);

  const singleAudio = item?.phonemeAudio;
  console.log("audios", currentAudio);

  const playAudio = (src) => {
    if (!src) return;

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create new audio and play
    audioRef.current = new Audio(src);
    audioRef.current.play().catch((err) => {
      console.log("Audio play error:", err);
    });
  };

  // Play on flow start / index change
  useEffect(() => {
    if (currentAudio) {
      playAudio(currentAudio);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stepIndex]);

  // Back functionality for English flow
  const handlePreviousWord = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      setRecAudio(null);
      setIsNextButtonCalled(false);
      setEnableNext(false);
    }
  };

  // Back functionality for non-English (UI3) flow
  const handlePreviousImage = () => {
    if (imgIndex > 0) {
      setImgIndex((i) => i - 1);
    } else if (itemIndexUi > 0) {
      setItemIndexUi((i) => i - 1);
      setImgIndex(dataKn[itemIndexUi - 1]?.images?.length - 1 || 0);
    }
    setRecAudio(null);
    setIsNextButtonCalled(false);
    setEnableNext(false);
  };

  const handleNextImage = async () => {
    if (imgIndex < currentItem.images.length - 1) {
      setImgIndex((i) => i + 1);
    } else {
      if (itemIndexUi < dataKn.length - 1) {
        setItemIndexUi((i) => i + 1);
        setImgIndex(0);
      } else {
        setLocalData("rFlow", false);
        await handleCompletion();
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
      }
    }
    setRecAudio(null);
    setIsNextButtonCalled(true);
    setEnableNext(false);
  };

  useEffect(() => {
    (async () => {
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

        setTotalSyllableCount(resPagination?.totalSyllableCount);
        setCurrentCollectionId(sentences?.collectionId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  const handleCompletion = async () => {
    const sub_session_id = getLocalData("sub_session_id");
    let currentContentType = "Char";

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
        ansSelectionStatus: langWiseAnswers[lang],
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
      } catch (error) {
        console.error("Error adding points:", error);
      }
    } else {
      sendTestRigScore(5);
    }
    navigate("/discover-start");
  };

  const handleNextWord = async () => {
    console.log("datas", stepIndex, totalSteps, blockSize);

    if (stepIndex < totalSteps * blockSize - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setLocalData("rFlow", false);
      if (level === "B") {
        await handleCompletion();
        navigate("/discover-end");
        return;
      }
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    }
    setRecAudio(null);
    setIsNextButtonCalled(true);
    setEnableNext(false);
  };

  const handleBackNavigation = () => {
    if (lang !== "en") {
      if (imgIndex > 0 || itemIndexUi > 0) {
        handlePreviousImage();
      } else {
        if (handleBack) {
          handleBack();
        } else {
          navigate(-1);
        }
      }
    } else {
      if (stepIndex > 0) {
        handlePreviousWord();
      } else {
        if (handleBack) {
          handleBack();
        } else {
          navigate(-1);
        }
      }
    }
  };

  const handleRetry = () => {
    console.log("audio playing!");
    playAudio(currentAudio);
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

      //  const TOTAL_ITEMS = dataEn.length;

      const TOTAL_ITEMS = lang === "en" ? dataEn.length : dataKn.length;
      const currentProgress = itemIndex + 1;
      const completionPercentage = Math.round(
        (currentProgress / TOTAL_ITEMS) * 100
      );

      return (
        <Box>
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              width: "min(100%, 900px)",
              borderRadius: 2,
              backgroundImage:
                "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 44px, #e6e9ef 46px)",
              backgroundColor: "#fff",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              pt: { xs: 2, md: 3 },
              pb: { xs: 1, md: 2 },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "20px",
                padding: "12px 16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "2px solid #1CB0F6",
                zIndex: 10,
                backdropFilter: "blur(5px)",
                minWidth: "100px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Quicksand",
                  fontWeight: 800,
                  fontSize: "16px",
                  color: navy,
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {currentProgress} / {TOTAL_ITEMS}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Quicksand",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "#1CB0F6",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  mt: 0.5,
                }}
              >
                Progress
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "2px",
                  mt: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${completionPercentage}%`,
                    height: "100%",
                    backgroundColor: "#58CC02",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                position: "relative",
                mb: 1,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <img
                  src={trainImg}
                  alt="train"
                  style={{ width: "100%", maxWidth: "400px" }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    top: "28%",
                    left: "63%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "auto",
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
                            minWidth: 64,
                            minHeight: 64,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            background: COLORS[i % COLORS.length],
                            boxShadow: 1,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Quicksand",
                              color: "#FFFFFF",
                              fontSize: "25px",
                            }}
                          >
                            {ch}
                          </span>
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                width: "100%",
                ml: "20%",
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
                  fontSize: { xs: 120, md: 160 },
                  lineHeight: 1,
                  ml: { xs: 1, md: 2 },
                  fontFamily: "Quicksand",
                }}
              >
                {item.letter}
              </Typography>

              <Box
                sx={{
                  mt: { xs: 1, md: 1 },
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
                    width: { xs: 160, md: 180 },
                    height: { xs: 160, md: 180 },
                    objectFit: "contain",
                    mr: { xs: 1, md: 2 },
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: 22, md: 32 },
                    mr: 2,
                    letterSpacing: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "Quicksand",
                    gap: 0.3,
                    mt: 1,
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

            <Stack
              direction="row"
              spacing={2}
              sx={{
                position: "absolute",
                bottom: 15,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
            >
              <IconButton
                onClick={handleRetry}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: pink,
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 4px 10px rgba(234,76,137,0.35)",
                  "&:hover": { bgcolor: pink },
                }}
              >
                <RotateCcw size={22} />
              </IconButton>

              <IconButton
                onClick={handleNextWord}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: orange,
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 4px 10px rgba(242,139,29,0.35)",
                  "&:hover": { bgcolor: orange },
                }}
              >
                <ArrowRight size={22} />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      );
    };
    const UI2 = () => {
      console.log("ui2");
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            height: "70vh",
          }}
        >
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              width: "min(100%, 1024px)",
              borderRadius: 2,
              backgroundColor: "#fff",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 0px",
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
                padding: "0px 40px",
                marginBottom: "40px",
                maxWidth: "75%",
                height: "140px",
                width: recAudio ? "auto" : "200px",
                minWidth: "200px",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                  gap: recAudio ? 2 : 0,
                }}
              >
                <span
                  style={{
                    color: "#333F61",
                    fontWeight: 700,
                    fontSize: recAudio ? "75px" : "110px",
                    lineHeight: "1",
                    letterSpacing: "2%",
                    fontFamily: "Quicksand",
                    transition: "font-size 0.2s ease",
                  }}
                >
                  {item.letter}
                </span>

                {recAudio && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span
                      style={{
                        color: "#333F61",
                        fontWeight: 600,
                        fontSize: "24px",
                        fontFamily: "Quicksand",
                      }}
                    >
                      -
                    </span>
                    <span
                      style={{
                        color: "#333F61",
                        fontWeight: 600,
                        fontSize: "28px",
                        fontFamily: "Quicksand",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.word}
                    </span>
                  </Box>
                )}
              </Box>

              {recAudio && (
                <Box
                  sx={{
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "4px",
                    width: "100%",
                  }}
                >
                  <img
                    src={Assets.graph}
                    alt="graph"
                    style={{
                      height: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box
              sx={{
                width: "100%",
                maxWidth: "380px",
                height: "110px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "20px",
                padding: "14px 22px",
              }}
            >
              <VoiceAnalyser
                key={`voice-analyser-${currentIndex}`}
                pageName={"wordsorimage"}
                setVoiceText={setVoiceText}
                updateStoredData={updateStoredData}
                setRecordedAudio={setRecordedAudio}
                setVoiceAnimate={setVoiceAnimate}
                storyLine={storyLine}
                dontShowListen={type === "image" || isDiscover}
                originalText={`R0-${item?.letter}`}
                handleNext={handleNextWord}
                enableNext={enableNext}
                isShowCase={isShowCase || isDiscover}
                handleRecordingComplete={handleRecordingComplete}
                handleStartRecording={handleStartRecording}
                handleStopRecording={handleStopRecording}
                audioLink={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${singleAudio}`}
                noOffline={true}
                isNextButtonCalled={isNextButtonCalled}
                setIsNextButtonCalled={setIsNextButtonCalled}
                setEnableNext={setEnableNext}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "110px",
                  maxHeight: "110px",
                  borderRadius: "12px",
                }}
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
                originalText={"R1"}
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
      parentWords={parentWords}
      flowNames={flowNames}
      handleBack={handleBackNavigation} // Pass the unified back handler
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        playTeacherAudio,
        handleBack: handleBackNavigation,
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
