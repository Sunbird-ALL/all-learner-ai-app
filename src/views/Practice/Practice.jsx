import React, { useEffect, useState } from "react";
import Mechanics2 from "../../components/Practice/Mechanics2";
import Mechanics3 from "../../components/Practice/Mechanics3";
import Mechanics4 from "../../components/Practice/Mechanics4";
import Mechanics5 from "../../components/Practice/Mechanics5";
import BingoCard from "../../components/Practice/BingoCard";
import SyllablePuzzle from "../../components/Practice/SyllablePuzzle";
import ReadAloud from "../../components/Practice/ReadAloud";
import R3 from "../../components/Practice/R3";
import R1 from "../../RFlow/R1";
import R2 from "../../RFlow/R2";
import R3Flow from "../../RFlow/R3";
import R4 from "../../RFlow/R4";
import TowreFlow from "../../components/Practice/TowreFlow";
import McqFlow from "../../components/Practice/McqFlow";
import JumbledWord from "../../components/Practice/JumbledWord";
import AskMoreM14 from "../../components/Practice/AskMoreM14";
import ActOutM13 from "../../components/Practice/ActOutM13";
import PhoneConversation from "../../components/Practice/PhoneConversation";
import PhrasesInAction from "../../components/Practice/PhrasesInAction";
import WhatsMissing from "../../components/Practice/WhatsMissing";
import ArrangePicture from "../../components/Practice/ArrangePicture";
import AnouncementFlow from "../../components/Practice/AnouncementFlow";
import { useNavigate } from "react-router-dom";
import {
  callConfetti,
  getLocalData,
  levelGetContent,
  practiceSteps,
  sendTestRigScore,
  setLocalData,
} from "../../utils/constants";
import axios from "axios";
import WordsOrImage from "../../components/Mechanism/WordsOrImage";
import { uniqueId } from "../../services/utilService";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import { splitGraphemes } from "split-graphemes";
import { Typography } from "@mui/material";
import config from "../../utils/urlConstants.json";
import { MessageDialog } from "../../components/Assesment/Assesment";
import { Log } from "../../services/telementryService";
import Mechanics6 from "../../components/Practice/Mechanics6";
import Mechanics7 from "../../components/Practice/Mechanics7";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import { PutBucketInventoryConfigurationRequestFilterSensitiveLog } from "@aws-sdk/client-s3";
import usePreloadAudio from "../../hooks/usePreloadAudio";
import { levelMapping } from "../../utils/levelData";
import { jwtDecode } from "jwt-decode";

import {
  addLesson,
  addPointer,
  fetchUserPoints,
  createLearnerProgress,
  getLessonProgressByID,
} from "../../services/orchestration/orchestrationService";
import {
  getContent,
  getContentNew,
  getFetchMilestoneDetails,
  getSetResultPractice,
} from "../../services/learnerAi/learnerAiService";

const Practice = () => {
  const [page, setPage] = useState("");
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [points, setPoints] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [enableNext, setEnableNext] = useState(false);
  const [progressData, setProgressData] = useState({});
  const [currentImage, setCurrentImage] = useState({});
  const [parentWords, setParentWords] = useState({});
  const [levelOneWord, setLevelOneWord] = useState("");
  const [level, setLevel] = useState(0);
  const [vocabCount, setVocabCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isShowCase, setIsShowCase] = useState(false);
  const [startShowCase, setStartShowCase] = useState(false);
  const limit = 5;
  const [disableScreen, setDisableScreen] = useState(false);
  const [mechanism, setMechanism] = useState("");
  const [refAudio, setRefAudio] = useState("");
  const [livesData, setLivesData] = useState();
  const [gameOverData, setGameOverData] = useState();
  const [loading, setLoading] = useState();
  const LIVES = 5;
  const TARGETS_PERCENTAGE = 0.3;
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const lang = getLocalData("lang");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [fluency, setFluency] = useState(false);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [rStep, setRStep] = useState(() => {
    return Number(getLocalData("rStep")) || 2;
  });

  const levels = {
    en: {
      L1: [
        {
          completeWord: "Basket",
          syllable: ["Bas", "ket"],
          img: getAssetUrl(s3Assets.basketM1),
          syllablesAudio: [
            { name: "Bas", audio: getAssetAudioUrl(s3Assets.basM1Eng) },
            { name: "ket", audio: getAssetAudioUrl(s3Assets.ketM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.basketM1Eng),
        },
        {
          completeWord: "Puzzle",
          syllable: ["Puz", "zle"],
          img: getAssetUrl(s3Assets.puzzleM1),
          syllablesAudio: [
            { name: "Puz", audio: getAssetAudioUrl(s3Assets.puzM1Eng) },
            { name: "zle", audio: getAssetAudioUrl(s3Assets.zleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.puzzleM1Eng),
        },
        {
          completeWord: "Happy",
          syllable: ["Hap", "py"],
          img: getAssetUrl(s3Assets.happyM1),
          syllablesAudio: [
            { name: "Hap", audio: getAssetAudioUrl(s3Assets.hapM1Eng) },
            { name: "py", audio: getAssetAudioUrl(s3Assets.pyM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.happyM1Eng),
        },
        {
          completeWord: "Pencil",
          syllable: ["Pen", "cil"],
          img: getAssetUrl(s3Assets.pencilM1),
          syllablesAudio: [
            { name: "Pen", audio: getAssetAudioUrl(s3Assets.penM1Eng) },
            { name: "cil", audio: getAssetAudioUrl(s3Assets.cilM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.pencilM1Eng),
        },
        {
          completeWord: "Tiger",
          syllable: ["Ti", "ger"],
          img: getAssetUrl(s3Assets.tigerM1),
          syllablesAudio: [
            { name: "Ti", audio: getAssetAudioUrl(s3Assets.tiM1Eng) },
            { name: "ger", audio: getAssetAudioUrl(s3Assets.gerM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tigerM1Eng),
        },
      ],
      L2: [
        {
          completeWord: "Spider",
          syllable: ["Spi", "der"],
          img: getAssetUrl(s3Assets.spiderM1),
          syllablesAudio: [
            { name: "Spi", audio: getAssetAudioUrl(s3Assets.spiM1Eng) },
            { name: "der", audio: getAssetAudioUrl(s3Assets.derM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.spiderM1Eng),
        },
        {
          completeWord: "Banana",
          syllable: ["Ba", "na", "na"],
          img: getAssetUrl(s3Assets.bananaM1),
          syllablesAudio: [
            { name: "Ba", audio: getAssetAudioUrl(s3Assets.baM1Eng) },
            { name: "na", audio: getAssetAudioUrl(s3Assets.naM1Eng) },
            { name: "na", audio: getAssetAudioUrl(s3Assets.naM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bananaM1Eng),
        },
        {
          completeWord: "Orange",
          syllable: ["Or", "ange"],
          img: getAssetUrl(s3Assets.orangeM1),
          syllablesAudio: [
            { name: "Or", audio: getAssetAudioUrl(s3Assets.orM1Eng) },
            { name: "ange", audio: getAssetAudioUrl(s3Assets.angeM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.orangeM1Eng),
        },
        {
          completeWord: "Table",
          syllable: ["Ta", "ble"],
          img: getAssetUrl(s3Assets.tableM1),
          syllablesAudio: [
            { name: "Ta", audio: getAssetAudioUrl(s3Assets.taM1Eng) },
            { name: "ble", audio: getAssetAudioUrl(s3Assets.bleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tableM1Eng),
        },
        {
          completeWord: "Window",
          syllable: ["Win", "dow"],
          img: getAssetUrl(s3Assets.windowM1),
          syllablesAudio: [
            { name: "Win", audio: getAssetAudioUrl(s3Assets.winM1Eng) },
            { name: "dow", audio: getAssetAudioUrl(s3Assets.dowM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.windowM1Eng),
        },
      ],
      P1: [
        {
          completeWord: "Coconut",
          syllable: ["Coco", "nut"],
          audio: "coconutM1Eng",
        },
        {
          completeWord: "Peacock",
          syllable: ["Pea", "cock"],
          audio: "peacockM1Eng",
        },
        { completeWord: "Puppy", syllable: ["Pup", "py"], audio: "puppyM1Eng" },
        { completeWord: "Clock", syllable: ["clo", "ck"], audio: "clockM1Eng" },
        {
          completeWord: "Grapes",
          syllable: ["grape", "s"],
          audio: "grapesM1Eng",
        },
      ],
      P2: [
        {
          completeWord: "Tongue",
          syllable: ["Tong", "ue"],
          audio: "tongueM1Eng",
        },
        { completeWord: "Money", syllable: ["Mon", "ey"], audio: "moneyM1Eng" },
        { completeWord: "Phone", syllable: ["Pho", "ne"], audio: "phoneM1Eng" },
        {
          completeWord: "Vegetables",
          syllable: ["Vege", "tables"],
          audio: "vegetablesM1Eng",
        },
        { completeWord: "Cards", syllable: ["Car", "ds"], audio: "cardsM1Eng" },
      ],
      S1: [
        { completeWord: "Tiger", syllable: ["Ti", "ger"] },
        { completeWord: "Rocket", syllable: ["Rock", "et"] },
        { completeWord: "Lemon", syllable: ["Le", "mon"] },
        { completeWord: "Tomato", syllable: ["To", "ma", "to"] },
        { completeWord: "Mango", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "Apple",
          syllable: ["Ap", "ple"],
          img: getAssetUrl(s3Assets.appleM1),
          syllablesAudio: [
            { name: "Ap", audio: getAssetAudioUrl(s3Assets.apM1Eng) },
            { name: "ple", audio: getAssetAudioUrl(s3Assets.pleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.appleM1Eng),
        },
        {
          completeWord: "Coconut",
          syllable: ["Co", "co", "nut"],
          img: getAssetUrl(s3Assets.coconutM1),
          syllablesAudio: [
            { name: "Co", audio: getAssetAudioUrl(s3Assets.coM1Eng) },
            { name: "Co", audio: getAssetAudioUrl(s3Assets.coM1Eng) },
            { name: "nut", audio: getAssetAudioUrl(s3Assets.nutM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.coconutM1Eng),
        },
        {
          completeWord: "Turtle",
          syllable: ["Tur", "tle"],
          img: getAssetUrl(s3Assets.turtleM1),
          syllablesAudio: [
            { name: "Tur", audio: getAssetAudioUrl(s3Assets.turM1Eng) },
            { name: "tle", audio: getAssetAudioUrl(s3Assets.tleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.turtleM1Eng),
        },
        {
          completeWord: "Number",
          syllable: ["Num", "ber"],
          img: getAssetUrl(s3Assets.numberM1),
          syllablesAudio: [
            { name: "Num", audio: getAssetAudioUrl(s3Assets.numM1Eng) },
            { name: "ber", audio: getAssetAudioUrl(s3Assets.berM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.numberM1Eng),
        },
        {
          completeWord: "Money",
          syllable: ["Mon", "ey"],
          img: getAssetUrl(s3Assets.moneyM1),
          syllablesAudio: [
            { name: "Mon", audio: getAssetAudioUrl(s3Assets.monM1Eng) },
            { name: "ey", audio: getAssetAudioUrl(s3Assets.eyM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.moneyM1Eng),
        },
      ],
      L4: [
        {
          completeWord: "Happy",
          syllable: ["Hap", "py"],
          img: getAssetUrl(s3Assets.happyM1),
          syllablesAudio: [
            { name: "Hap", audio: getAssetAudioUrl(s3Assets.hapM1Eng) },
            { name: "py", audio: getAssetAudioUrl(s3Assets.pyM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.happyM1Eng),
        },
        {
          completeWord: "Puzzle",
          syllable: ["Puz", "zle"],
          img: getAssetUrl(s3Assets.puzzleM1),
          syllablesAudio: [
            { name: "Puz", audio: getAssetAudioUrl(s3Assets.puzM1Eng) },
            { name: "zle", audio: getAssetAudioUrl(s3Assets.zleM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.puzzleM1Eng),
        },
        {
          completeWord: "Balloon",
          syllable: ["Bal", "loon"],
          img: getAssetUrl(s3Assets.balloonM1),
          syllablesAudio: [
            { name: "Bal", audio: getAssetAudioUrl(s3Assets.balM1Eng) },
            { name: "loon", audio: getAssetAudioUrl(s3Assets.loonM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.balloonM1Eng),
        },
        {
          completeWord: "Doctor",
          syllable: ["Doc", "tor"],
          img: getAssetUrl(s3Assets.doctorM1),
          syllablesAudio: [
            { name: "Doc", audio: getAssetAudioUrl(s3Assets.docM1Eng) },
            { name: "tor", audio: getAssetAudioUrl(s3Assets.torM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.doctorM1Eng),
        },
        {
          completeWord: "Dustbin",
          syllable: ["Dust", "bin"],
          img: getAssetUrl(s3Assets.dustbinM1),
          syllablesAudio: [
            { name: "Dust", audio: getAssetAudioUrl(s3Assets.dustM1Eng) },
            { name: "bin", audio: getAssetAudioUrl(s3Assets.binM1Eng) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.dustbinM1Eng),
        },
      ],
      P3: [
        {
          completeWord: "Stones",
          syllable: ["Stone", "s"],
          audio: "stonesM1Eng",
        },
        {
          completeWord: "Turtle",
          syllable: ["Tur", "tle"],
          audio: "turtleM1Eng",
        },
        { completeWord: "Key", syllable: ["K", "ey"], audio: "keyM1Eng" },
        { completeWord: "Hands", syllable: ["Han", "ds"], audio: "handsM1Eng" },
        {
          completeWord: "Fruits",
          syllable: ["Fruit", "s"],
          audio: "fruitsM1Eng",
        },
      ],
      P4: [
        {
          completeWord: "Spider",
          syllable: ["Spi", "der"],
          audio: "spiderM1Eng",
        },
        { completeWord: "Happy", syllable: ["Hap", "py"], audio: "happyM1Eng" },
        {
          completeWord: "Plants",
          syllable: ["Plant", "s"],
          audio: "plantsM1Eng",
        },
        {
          completeWord: "Family",
          syllable: ["Fa", "mily"],
          audio: "familyM1Eng",
        },
        {
          completeWord: "Dustbin",
          syllable: ["Dust", "bin"],
          audio: "dustbinM1Eng",
        },
      ],
      S2: [
        { completeWord: "Basket", syllable: ["Bas", "ket"] },
        { completeWord: "Tablet", syllable: ["Tab", "let"] },
        { completeWord: "Sunset", syllable: ["Sun", "set"] },
        { completeWord: "Button", syllable: ["But", "ton"] },
        { completeWord: "Window", syllable: ["Win", "dow"] },
      ],
    },
    hi: {
      L1: [
        {
          completeWord: "बादल",
          syllable: ["बा", "दल"],
          img: getAssetUrl(s3Assets.badalM1Hin),
          syllablesAudio: [
            { name: "बा", audio: getAssetAudioUrl(s3Assets.baaM1Hin) },
            { name: "दल", audio: getAssetAudioUrl(s3Assets.dalM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.baadalM1Hin),
        },
        {
          completeWord: "संतरा",
          syllable: ["सं", "तरा"],
          img: getAssetUrl(s3Assets.santraM1HinI),
          syllablesAudio: [
            { name: "सं", audio: getAssetAudioUrl(s3Assets.sanM1Hin) },
            { name: "तरा", audio: getAssetAudioUrl(s3Assets.traM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.santraM1Hin),
        },
        {
          completeWord: "चावल",
          syllable: ["चा", "वल"],
          img: getAssetUrl(s3Assets.chawalM1Hin),
          syllablesAudio: [
            { name: "चा", audio: getAssetAudioUrl(s3Assets.chaaM1Hin) },
            { name: "वल", audio: getAssetAudioUrl(s3Assets.valM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.chaavalM1Hin),
        },
        {
          completeWord: "कोयल",
          syllable: ["को", "यल"],
          img: getAssetUrl(s3Assets.koyalM1Hin),
          syllablesAudio: [
            { name: "को", audio: getAssetAudioUrl(s3Assets.koM1Hin) },
            { name: "यल", audio: getAssetAudioUrl(s3Assets.elM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.koelM1Hin),
        },
        {
          completeWord: "कलम",
          syllable: ["क", "लम"],
          img: getAssetUrl(s3Assets.kalamM1HinI),
          syllablesAudio: [
            { name: "क", audio: getAssetAudioUrl(s3Assets.kaM1Hin) },
            { name: "लम", audio: getAssetAudioUrl(s3Assets.lamM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kalamM1Hin),
        },
      ],
      L2: [
        {
          completeWord: "मटर",
          syllable: ["म", "टर"],
          img: getAssetUrl(s3Assets.matarM2Hin),
          syllablesAudio: [
            { name: "म", audio: getAssetAudioUrl(s3Assets.maM1Hin) },
            { name: "टर", audio: getAssetAudioUrl(s3Assets.tarM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.matarM1Hin),
        },
        {
          completeWord: "पलंग",
          syllable: ["प", "लंग"],
          img: getAssetUrl(s3Assets.palangM2Hin),
          syllablesAudio: [
            { name: "प", audio: getAssetAudioUrl(s3Assets.paM1Hin) },
            { name: "लंग", audio: getAssetAudioUrl(s3Assets.langM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.palangM1Hin),
        },
        {
          completeWord: "मटका",
          syllable: ["मट", "का"],
          img: getAssetUrl(s3Assets.matkaM2Hin),
          syllablesAudio: [
            { name: "मट", audio: getAssetAudioUrl(s3Assets.matM1Hin) },
            { name: "का", audio: getAssetAudioUrl(s3Assets.kaM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.matkaM1Hin),
        },
        {
          completeWord: "मंदिर",
          syllable: ["मं", "दिर"],
          img: getAssetUrl(s3Assets.mandirM2Hin),
          syllablesAudio: [
            { name: "मं", audio: getAssetAudioUrl(s3Assets.manM1Hin) },
            { name: "दिर", audio: getAssetAudioUrl(s3Assets.dirM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.mandirM1Hin),
        },
        {
          completeWord: "गाजर",
          syllable: ["गा", "जर"],
          img: getAssetUrl(s3Assets.gajarM1Hin),
          syllablesAudio: [
            { name: "गा", audio: getAssetAudioUrl(s3Assets.gaaM1Hin) },
            { name: "जर", audio: getAssetAudioUrl(s3Assets.jarM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.gaajarM1Hin),
        },
      ],
      P1: [
        { completeWord: "मूँछ", syllable: ["मूँ", "छ"], audio: "moochM1Hin" },
        { completeWord: "लौकी", syllable: ["लौ", "की"], audio: "laukiM1Hin" },
        { completeWord: "टॉवर", syllable: ["टॉ", "वर"], audio: "towerM1Hin" },
        { completeWord: "नानी", syllable: ["ना", "नी"], audio: "naniM1Hin" },
        { completeWord: "मटर", syllable: ["म", "टर"], audio: "matarM1Hin" },
      ],
      P2: [
        { completeWord: "केला", syllable: ["के", "ला"], audio: "kelaM1Hin" },
        { completeWord: "भालू", syllable: ["भा", "लू"], audio: "bhaluM1Hin" },
        { completeWord: "गोभी", syllable: ["गो", "भी"], audio: "gobhiM1Hin" },
        { completeWord: "चूहा", syllable: ["चू", "हा"], audio: "chuhaM1Hin" },
        { completeWord: "घोड़ा", syllable: ["घो", "ड़ा"], audio: "ghodaM1Hin" },
      ],
      S1: [
        { completeWord: "मटर", syllable: ["Ti", "ger"] },
        { completeWord: "पलंग", syllable: ["Rock", "et"] },
        { completeWord: "लौकी", syllable: ["Le", "mon"] },
        { completeWord: "संतरा", syllable: ["To", "ma", "to"] },
        { completeWord: "चूहा", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "तबला",
          syllable: ["तब", "ला"],
          img: getAssetUrl(s3Assets.tablaM1HinI),
          syllablesAudio: [
            { name: "तब", audio: getAssetAudioUrl(s3Assets.tabM1Hin) },
            { name: "ला", audio: getAssetAudioUrl(s3Assets.laM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tablaM1Hin),
        },
        {
          completeWord: "बोतल",
          syllable: ["बो", "तल"],
          img: getAssetUrl(s3Assets.glassM1),
          syllablesAudio: [
            { name: "बो", audio: getAssetAudioUrl(s3Assets.botM1Hin) },
            { name: "तल", audio: getAssetAudioUrl(s3Assets.tleM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bottleM1Hin),
        },
        {
          completeWord: "बकरा",
          syllable: ["बक", "रा"],
          img: getAssetUrl(s3Assets.bakraM1HinI),
          syllablesAudio: [
            { name: "बक", audio: getAssetAudioUrl(s3Assets.bakM1Hin) },
            { name: "रा", audio: getAssetAudioUrl(s3Assets.raM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bakraM1Hin),
        },
        {
          completeWord: "अचार",
          syllable: ["अ", "चार"],
          img: getAssetUrl(s3Assets.acharM1Hin),
          syllablesAudio: [
            { name: "अ", audio: getAssetAudioUrl(s3Assets.aM1Hin) },
            { name: "चार", audio: getAssetAudioUrl(s3Assets.chaarM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.achaarM1Hin),
        },
        {
          completeWord: "डमरू",
          syllable: ["डम", "रू"],
          img: getAssetUrl(s3Assets.damruM1Hin),
          syllablesAudio: [
            { name: "डम", audio: getAssetAudioUrl(s3Assets.dumM1Hin) },
            { name: "रू", audio: getAssetAudioUrl(s3Assets.rooM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.dumrooM1Hin),
        },
      ],
      L4: [
        {
          completeWord: "तकिया",
          syllable: ["त", "किया"],
          img: getAssetUrl(s3Assets.takiyaM1Hin),
          syllablesAudio: [
            { name: "त", audio: getAssetAudioUrl(s3Assets.taM1Hin) },
            { name: "किया", audio: getAssetAudioUrl(s3Assets.kiaM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.takiaM1Hin),
        },
        {
          completeWord: "टीचर",
          syllable: ["टी", "चर"],
          img: getAssetUrl(s3Assets.teacherM1HinI),
          syllablesAudio: [
            { name: "टी", audio: getAssetAudioUrl(s3Assets.teaM1Hin) },
            { name: "चर", audio: getAssetAudioUrl(s3Assets.cherM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.teacherM1Hin),
        },
        {
          completeWord: "बंदर",
          syllable: ["बं", "दर"],
          img: getAssetUrl(s3Assets.banarM1Hin),
          syllablesAudio: [
            { name: "बं", audio: getAssetAudioUrl(s3Assets.banM1Hin) },
            { name: "दर", audio: getAssetAudioUrl(s3Assets.darM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bandarM1Hin),
        },
        {
          completeWord: "लंगूर",
          syllable: ["लं", "गूर"],
          img: getAssetUrl(s3Assets.langurM1Hin),
          syllablesAudio: [
            { name: "लं", audio: getAssetAudioUrl(s3Assets.lanM1Hin) },
            { name: "गूर", audio: getAssetAudioUrl(s3Assets.goorM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.langoorM1Hin),
        },
        {
          completeWord: "कद्दू",
          syllable: ["कद्", "दू"],
          img: getAssetUrl(s3Assets.kadduM2Hin),
          syllablesAudio: [
            { name: "कद्", audio: getAssetAudioUrl(s3Assets.kadM1Hin) },
            { name: "दू", audio: getAssetAudioUrl(s3Assets.duM1Hin) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kadduM1Hin),
        },
      ],
      P3: [
        { completeWord: "रोटी", syllable: ["रो", "टी"], audio: "rotiM1Hin" },
        { completeWord: "मूली", syllable: ["मू", "ली"], audio: "mooliM1Hin" },
        { completeWord: "लीची", syllable: ["ली", "ची"], audio: "lichiM1Hin" },
        {
          completeWord: "नींबू",
          syllable: ["नीं", "बू"],
          audio: "neembuM1Hin",
        },
        { completeWord: "होली", syllable: ["हो", "ली"], audio: "holiM1Hin" },
      ],
      P4: [
        { completeWord: "पैसा", syllable: ["पै", "सा"], audio: "paisaM1Hin" },
        {
          completeWord: "चींटी",
          syllable: ["चीन", "टी"],
          audio: "cheentiM1Hin",
        },
        { completeWord: "खीरा", syllable: ["खी", "रा"], audio: "kheeraM1Hin" },
        { completeWord: "भेड़", syllable: ["भे", "ड़"], audio: "bheD_M1Hin" },
        { completeWord: "चाबी", syllable: ["चा", "बी"], audio: "chabiM1Hin" },
      ],
      S2: [
        { completeWord: "बोतल", syllable: ["Bas", "ket"] },
        { completeWord: "मूली", syllable: ["Tab", "let"] },
        { completeWord: "टीचर", syllable: ["Sun", "set"] },
        { completeWord: "डमरू", syllable: ["But", "ton"] },
        { completeWord: "पैसा", syllable: ["Win", "dow"] },
      ],
    },
    ta: {
      L1: [
        {
          completeWord: "யுவ",
          syllable: ["யு", "வ"],
          img: getAssetUrl(s3Assets.youngM1Tam),
          syllablesAudio: [
            { name: "யு", audio: getAssetAudioUrl(s3Assets.youth1M1SylTam) },
            { name: "வ", audio: getAssetAudioUrl(s3Assets.youth2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.youngAudio),
        },
        {
          completeWord: "குருடன்",
          syllable: ["கு", "று", "டன்"],
          img: getAssetUrl(s3Assets.blindM1TamI),
          syllablesAudio: [
            {
              name: "கு",
              audio: getAssetAudioUrl(s3Assets.kurudanWord1Audio),
            },
            {
              name: "று",
              audio: getAssetAudioUrl(s3Assets.kurudanWord2Audio),
            },
            {
              name: "டன்",
              audio: getAssetAudioUrl(s3Assets.kurudanAudio),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kurudanWord3Audio),
        },
        {
          completeWord: "விவசாயி",
          syllable: ["வி", "வ", "சாயி"],
          img: getAssetUrl(s3Assets.farmerM1),
          syllablesAudio: [
            { name: "வி", audio: getAssetAudioUrl(s3Assets.farmerWord1Audio) },
            { name: "வ", audio: getAssetAudioUrl(s3Assets.farmerWord2Audio) },
            {
              name: "சாயி",
              audio: getAssetAudioUrl(s3Assets.farmerWord3Audio),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.farmerAudio),
        },
        {
          completeWord: "கிண்ணம்",
          syllable: ["கி", "ண்", "ணம்"],
          img: getAssetUrl(s3Assets.glassBowl),
          syllablesAudio: [
            { name: "கி", audio: getAssetAudioUrl(s3Assets.bowlWord1Audio) },
            { name: "ண்", audio: getAssetAudioUrl(s3Assets.bowlWord2Audio) },
            { name: "ணம்", audio: getAssetAudioUrl(s3Assets.bowlWord3Audio) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bowlAudio),
        },
        {
          completeWord: "காளான்",
          syllable: ["கா", "ளான்"],
          img: getAssetUrl(s3Assets.mushroomM1TamI),
          syllablesAudio: [
            { name: "கா", audio: getAssetAudioUrl(s3Assets.mushroom1M1SylTam) },
            {
              name: "ளான்",
              audio: getAssetAudioUrl(s3Assets.mushroom2M1SylTam),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.mushroomM1Tam),
        },
      ],
      L2: [
        {
          completeWord: "உணவு",
          syllable: ["உ", "ண", "வு"],
          img: getAssetUrl(s3Assets.foodM1Tam),
          syllablesAudio: [
            { name: "உ", audio: getAssetAudioUrl(s3Assets.food1M1SylTam) },
            { name: "ண", audio: getAssetAudioUrl(s3Assets.food2M1SylTam) },
            { name: "வு", audio: getAssetAudioUrl(s3Assets.food3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.FoodM1Tam),
        },
        {
          completeWord: "அரிசி",
          syllable: ["அ", "ரி", "சி"],
          img: getAssetUrl(s3Assets.riceM1Tam),
          syllablesAudio: [
            { name: "அ", audio: getAssetAudioUrl(s3Assets.rice1M1SylTam) },
            { name: "ரி", audio: getAssetAudioUrl(s3Assets.rice2M1SylTam) },
            { name: "சி", audio: getAssetAudioUrl(s3Assets.rice3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.RiceM1Tam),
        },
        {
          completeWord: "குதிரை",
          syllable: ["கு", "தி", "ரை"],
          img: getAssetUrl(s3Assets.horseM1Tam),
          syllablesAudio: [
            { name: "கு", audio: getAssetAudioUrl(s3Assets.horse1M1SylTam) },
            { name: "தி", audio: getAssetAudioUrl(s3Assets.horse2M1SylTam) },
            { name: "ரை", audio: getAssetAudioUrl(s3Assets.horse3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.HorseM1Tam),
        },
        {
          completeWord: "கோப்பை",
          syllable: ["கோ", "ப்பை"],
          img: getAssetUrl(s3Assets.mugM1Tam),
          syllablesAudio: [
            { name: "கோ", audio: getAssetAudioUrl(s3Assets.mug1M1SylTam) },
            { name: "ப்பை", audio: getAssetAudioUrl(s3Assets.mug2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.koppaiAudio),
        },
        {
          completeWord: "கேரட்",
          syllable: ["கே", "ரட்"],
          img: getAssetUrl(s3Assets.carrotM1Tam),
          syllablesAudio: [
            { name: "கே", audio: getAssetAudioUrl(s3Assets.carrot1M1SylTam) },
            { name: "ரட்", audio: getAssetAudioUrl(s3Assets.carrot2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.CarrotM1Tam),
        },
      ],
      P1: [
        { completeWord: "முகம்", syllable: ["மு", "கம்"], audio: "FaceM1Tam" },
        { completeWord: "புயல்", syllable: ["பு", "யல்"], audio: "stormM1Tam" },
        {
          completeWord: "எருமை",
          syllable: ["எ", "ருமை"],
          audio: "BuffaloM1Tam",
        },
        {
          completeWord: "புதினா",
          syllable: ["பு", "தினா"],
          audio: "MintM1Tam",
        },
        {
          completeWord: "பாலம்",
          syllable: ["பா", "லம்"],
          audio: "bridgeM1Tam",
        },
      ],
      P2: [
        {
          completeWord: "ரூபாய்",
          syllable: ["ரூ", "பாய்"],
          audio: "RupeesM1Tam",
        },
        {
          completeWord: "தாகம்",
          syllable: ["தா", "கம்"],
          audio: "thirstM1Tam",
        },
        { completeWord: "மாதம்", syllable: ["மா", "தம்"], audio: "MONTHM1Tam" },
        { completeWord: "குழாய்", syllable: ["கு", "ழாய்"], audio: "TapM1Tam" },
        { completeWord: "கடல்", syllable: ["க", "டல்"], audio: "oceanM1Tam" },
      ],
      S1: [
        { completeWord: "யுவ", syllable: ["Ti", "ger"] },
        { completeWord: "அரிசி", syllable: ["Rock", "et"] },
        { completeWord: "பாலம்", syllable: ["Le", "mon"] },
        { completeWord: "ரூபாய்", syllable: ["To", "ma", "to"] },
        { completeWord: "காளான்", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "அணில்",
          syllable: ["அ", "ணில்"],
          img: getAssetUrl(s3Assets.squirrelMTam),
          syllablesAudio: [
            { name: "அ", audio: getAssetAudioUrl(s3Assets.squirrel1M1SylTam) },
            {
              name: "ணில்",
              audio: getAssetAudioUrl(s3Assets.squirrel2M1SylTam),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.SquirrelM1Tam),
        },
        {
          completeWord: "மாதுளை",
          syllable: ["மா", "து", "ளை"],
          img: getAssetUrl(s3Assets.pomegranateM1Tam),
          syllablesAudio: [
            {
              name: "மா",
              audio: getAssetAudioUrl(s3Assets.pomegranateWord1Audio),
            },
            {
              name: "து",
              audio: getAssetAudioUrl(s3Assets.pomegranateWord2Audio),
            },
            {
              name: "ளை",
              audio: getAssetAudioUrl(s3Assets.pomegranateWord3Audio),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.pomegranateAudio),
        },
        {
          completeWord: "மரம்",
          syllable: ["ம", "ரம்"],
          img: getAssetUrl(s3Assets.treeM1Tam),
          syllablesAudio: [
            { name: "ம", audio: getAssetAudioUrl(s3Assets.tree1M1SylTam) },
            { name: "ரம்", audio: getAssetAudioUrl(s3Assets.tree2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.TREEM1Tam),
        },
        {
          completeWord: "மயில்",
          syllable: ["ம", "யில்"],
          img: getAssetUrl(s3Assets.peacockM1Tam),
          syllablesAudio: [
            { name: "ம", audio: getAssetAudioUrl(s3Assets.peacock1M1SylTam) },
            {
              name: "யில்",
              audio: getAssetAudioUrl(s3Assets.peacock2M1SylTam),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.peacockTamAudio),
        },
        {
          completeWord: "தாமரை",
          syllable: ["தா", "ம", "ரை"],
          img: getAssetUrl(s3Assets.lotusM1Tam),
          syllablesAudio: [
            { name: "தா", audio: getAssetAudioUrl(s3Assets.lotus1M1SylTam) },
            { name: "ம", audio: getAssetAudioUrl(s3Assets.lotus2M1SylTam) },
            { name: "ரை", audio: getAssetAudioUrl(s3Assets.lotus3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.LotusM1Tam),
        },
      ],
      L4: [
        {
          completeWord: "காலுறை",
          syllable: ["கா", "லு", "றை"],
          img: getAssetUrl(s3Assets.socksM1Tam),
          syllablesAudio: [
            { name: "கா", audio: getAssetAudioUrl(s3Assets.socks1) },
            { name: "லு", audio: getAssetAudioUrl(s3Assets.socks2) },
            { name: "றை", audio: getAssetAudioUrl(s3Assets.socks3) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.socksAudio),
        },
        {
          completeWord: "ஆகாயம்",
          syllable: ["ஆ", "கா", "யம்"],
          img: getAssetUrl(s3Assets.skyM1Tam),
          syllablesAudio: [
            { name: "ஆ", audio: getAssetAudioUrl(s3Assets.sky1M1SylTam) },
            { name: "கா", audio: getAssetAudioUrl(s3Assets.sky2M1SylTam) },
            { name: "யம்", audio: getAssetAudioUrl(s3Assets.sky3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.SkyM1Tam),
        },
        {
          completeWord: "நேரம்",
          syllable: ["நே", "ரம்"],
          img: getAssetUrl(s3Assets.timeM1TamI),
          syllablesAudio: [
            { name: "நே", audio: getAssetAudioUrl(s3Assets.time1M1SylTam) },
            { name: "ரம்", audio: getAssetAudioUrl(s3Assets.time2M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.timeM1Tam),
        },
        {
          completeWord: "கதவு",
          syllable: ["க", "த", "வு"],
          img: getAssetUrl(s3Assets.doorM1Tam),
          syllablesAudio: [
            { name: "க", audio: getAssetAudioUrl(s3Assets.door1M1SylTam) },
            { name: "த", audio: getAssetAudioUrl(s3Assets.door2M1SylTam) },
            { name: "வு", audio: getAssetAudioUrl(s3Assets.door3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.DoorM1Tam),
        },
        {
          completeWord: "கோதுமை",
          syllable: ["கோ", "து", "மை"],
          img: getAssetUrl(s3Assets.wheatM1Tam),
          syllablesAudio: [
            { name: "கோ", audio: getAssetAudioUrl(s3Assets.wheat1M1SylTam) },
            { name: "து", audio: getAssetAudioUrl(s3Assets.wheat2M1SylTam) },
            { name: "மை", audio: getAssetAudioUrl(s3Assets.wheat3M1SylTam) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.WheatM1Tam),
        },
      ],
      P3: [
        { completeWord: "தயிர்", syllable: ["த", "யிர்"], audio: "CurdM1Tam" },
        {
          completeWord: "மேகம்",
          syllable: ["மே", "கம்"],
          audio: "cloudTamAudio",
        },
        {
          completeWord: "குடில்",
          syllable: ["கு", "டில்"],
          audio: "hutTamAudio",
        },
        {
          completeWord: "மாலை",
          syllable: ["மா", "லை"],
          audio: "necklaceM1Tam",
        },
        {
          completeWord: "கொடரி",
          syllable: ["கொ", "டரி"],
          audio: "axeTamAudio",
        },
      ],
      P4: [
        {
          completeWord: "முரலி",
          syllable: ["மு", "ரலி"],
          audio: "muraliTamAudio",
        },
        { completeWord: "சிறகு", syllable: ["சி", "றகு"], audio: "wingM1Tam" },
        {
          completeWord: "கோபம்",
          syllable: ["கோ", "பம்"],
          audio: "anngryAudio",
        },
        {
          completeWord: "நிழல்",
          syllable: ["நி", "ழல்"],
          audio: "shadowM1Tam",
        },
        {
          completeWord: "கோலம்",
          syllable: ["கோ", "லம்"],
          audio: "rangoliM1Tam",
        },
      ],
      S2: [
        { completeWord: "அணில்", syllable: ["Bas", "ket"] },
        { completeWord: "சிறகு", syllable: ["Tab", "let"] },
        { completeWord: "குடில்", syllable: ["Sun", "set"] },
        { completeWord: "நேரம்", syllable: ["But", "ton"] },
        { completeWord: "மரம்", syllable: ["Win", "dow"] },
      ],
    },
    kn: {
      L1: [
        {
          completeWord: "ಕಮಲ",
          syllable: ["ಕ", "ಮ", "ಲ"],
          img: getAssetUrl(s3Assets.lotusM1KanI),
          syllablesAudio: [
            { name: "ಕ", audio: getAssetAudioUrl(s3Assets.lotus1M1SylKan) },
            { name: "ಮ", audio: getAssetAudioUrl(s3Assets.lotus2M1SylKan) },
            { name: "ಲ", audio: getAssetAudioUrl(s3Assets.lotus3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.lotusM1Kan),
        },
        {
          completeWord: "ಚಮಚ",
          syllable: ["ಚ", "ಮ", "ಚ"],
          img: getAssetUrl(s3Assets.spoonM1KanI),
          syllablesAudio: [
            { name: "ಚ", audio: getAssetAudioUrl(s3Assets.spoon1M1SylKan) },
            { name: "ಮ", audio: getAssetAudioUrl(s3Assets.spoon2M1SylKan) },
            { name: "ಚ", audio: getAssetAudioUrl(s3Assets.spoon3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.spoonM1Kan),
        },
        {
          completeWord: "ಕರಡಿ",
          syllable: ["ಕ", "ರ", "ಡಿ"],
          img: getAssetUrl(s3Assets.bearM1KanI),
          syllablesAudio: [
            { name: "ಕ", audio: getAssetAudioUrl(s3Assets.bear1Kan) },
            { name: "ರ", audio: getAssetAudioUrl(s3Assets.bear2Kan) },
            { name: "ಡಿ", audio: getAssetAudioUrl(s3Assets.bear3Kan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bearM1Kan),
        },
        {
          completeWord: "ಹಡಗು",
          syllable: ["ಹ", "ಡ", "ಗು"],
          img: getAssetUrl(s3Assets.shipM1KanI),
          syllablesAudio: [
            { name: "ಹ", audio: getAssetAudioUrl(s3Assets.ship1M1SylKan) },
            { name: "ಡ", audio: getAssetAudioUrl(s3Assets.ship2M1SylKan) },
            { name: "ಗು", audio: getAssetAudioUrl(s3Assets.ship3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.shipM1Kan),
        },
        {
          completeWord: "ತಬಲಾ",
          syllable: ["ತ", "ಬ", "ಲಾ"],
          img: getAssetUrl(s3Assets.tabalaM1KanI),
          syllablesAudio: [
            { name: "ತ", audio: getAssetAudioUrl(s3Assets.tabala1M1SylKan) },
            { name: "ಬ", audio: getAssetAudioUrl(s3Assets.tabala2M1SylKan) },
            { name: "ಲಾ", audio: getAssetAudioUrl(s3Assets.tabala3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tabalaM1Kan),
        },
      ],
      L2: [
        {
          completeWord: "ಗಾಯಕ",
          syllable: ["ಗಾ", "ಯ", "ಕ"],
          img: getAssetUrl(s3Assets.singerM1KanI),
          syllablesAudio: [
            { name: "ಗಾ", audio: getAssetAudioUrl(s3Assets.singer1M1SylKan) },
            { name: "ಯ", audio: getAssetAudioUrl(s3Assets.singer2M1SylKan) },
            { name: "ಕ", audio: getAssetAudioUrl(s3Assets.singer3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.singerM1Kan),
        },
        {
          completeWord: "ಅಗಸ",
          syllable: ["ಅ", "ಗ", "ಸ"],
          img: getAssetUrl(s3Assets.dhobiM1KanI),
          syllablesAudio: [
            { name: "ಅ", audio: getAssetAudioUrl(s3Assets.washerman1M1SylKan) },
            { name: "ಗ", audio: getAssetAudioUrl(s3Assets.washerman2M1SylKan) },
            { name: "ಸ", audio: getAssetAudioUrl(s3Assets.washerman3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.dhobiM1Kan),
        },
        {
          completeWord: "ಅರಸ",
          syllable: ["ಅ", "ರ", "ಸ"],
          img: getAssetUrl(s3Assets.kingM1KanI),
          syllablesAudio: [
            { name: "ಅ", audio: getAssetAudioUrl(s3Assets.king1M1SylKan) },
            { name: "ರ", audio: getAssetAudioUrl(s3Assets.king2M1SylKan) },
            { name: "ಸ", audio: getAssetAudioUrl(s3Assets.king3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kingM1Kan),
        },
        {
          completeWord: "ಗಣಿತ",
          syllable: ["ಗ", "ಣಿ", "ತ"],
          img: getAssetUrl(s3Assets.mathematicsM1KanI),
          syllablesAudio: [
            {
              name: "ಗ",
              audio: getAssetAudioUrl(s3Assets.Math1Kan),
            },
            {
              name: "ಣಿ",
              audio: getAssetAudioUrl(s3Assets.Math2Kan),
            },
            {
              name: "ತ",
              audio: getAssetAudioUrl(s3Assets.Math3Kan),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.MathKan),
        },
        {
          completeWord: "ಹಲಸು",
          syllable: ["ಹ", "ಲ", "ಸು"],
          img: getAssetUrl(s3Assets.jackfruitM1KanI),
          syllablesAudio: [
            { name: "ಹ", audio: getAssetAudioUrl(s3Assets.jackfruit1M1SylKan) },
            { name: "ಲ", audio: getAssetAudioUrl(s3Assets.jackfruit2M2SylKan) },
            {
              name: "ಸು",
              audio: getAssetAudioUrl(s3Assets.jackfruit3M1SylKan),
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.jackfruitM1Kan),
        },
      ],
      P1: [
        { completeWord: "ಆಕಾಶ", syllable: ["ಆ", "ಕಾಶ"], audio: "skyM1Kan" },
        { completeWord: "ಬೀಗ", syllable: ["ಬೀ", "ಗ"], audio: "lockM1KanA" },
        { completeWord: "ಚರಕ", syllable: ["ಚರಕ", "ಕ"], audio: "spindleM1KanA" },
        {
          completeWord: "ಕೊಡೆ",
          syllable: ["ಕೊ", "ಡೆ"],
          audio: "umbrellaKan",
        },
        {
          completeWord: "ಹೂವು",
          syllable: ["ಹೂ", "ವು"],
          audio: "FlowerKan",
        },
      ],
      P2: [
        { completeWord: "ಸೀರೆ", syllable: ["ಸೀ", "ರೆ"], audio: "sareeM1Kan" },
        { completeWord: "ಸೀಬೆ", syllable: ["ಸೀ", "ಬೆ"], audio: "guavaM1Kan" },
        { completeWord: "ಗೋಧಿ", syllable: ["ಗೋ", "ಧಿ"], audio: "wheatKan" },
        {
          completeWord: "ಚೇಳು",
          syllable: ["ಚೇ", "ಳು"],
          audio: "scorpionKan",
        },
        { completeWord: "ಆಹಾರ", syllable: ["ಆ", "ಹಾರ"], audio: "foodM1Kan" },
      ],
      S1: [
        { completeWord: "ಕಮಲ", syllable: ["Ti", "ger"] },
        { completeWord: "ಗೋಧಿ", syllable: ["Rock", "et"] },
        { completeWord: "ಊಟ", syllable: ["Me", "al"] },
        { completeWord: "ಅಗಸ", syllable: ["To", "ma", "to"] },
        { completeWord: "ಹಡಗು", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "ಹುಡುಗ",
          syllable: ["ಹು", "ಡು", "ಗ"],
          img: getAssetUrl(s3Assets.boyM1KanI),
          syllablesAudio: [
            { name: "ಹು", audio: getAssetAudioUrl(s3Assets.Boy1Kan) },
            { name: "ಡು", audio: getAssetAudioUrl(s3Assets.Boy2Kan) },
            { name: "ಗ", audio: getAssetAudioUrl(s3Assets.Boy3Kan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.BoyKan),
        },
        {
          completeWord: "ಬಟಾಣಿ",
          syllable: ["ಬ", "ಟಾ", "ಣಿ"],
          img: getAssetUrl(s3Assets.peasM1KanI),
          syllablesAudio: [
            { name: "ಬ", audio: getAssetAudioUrl(s3Assets.Peas1) },
            { name: "ಟಾ", audio: getAssetAudioUrl(s3Assets.Peas2) },
            { name: "ಣಿ", audio: getAssetAudioUrl(s3Assets.Peas3) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.Peas),
        },
        {
          completeWord: "ಮೀನು",
          syllable: ["ಮೀ", "ನು"],
          img: getAssetUrl(s3Assets.fishM1KanI),
          syllablesAudio: [
            { name: "ಮೀ", audio: getAssetAudioUrl(s3Assets.fish1M1SylKan) },
            { name: "ನು", audio: getAssetAudioUrl(s3Assets.fish2M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.fishM1Kan),
        },
        {
          completeWord: "ನಿಂಬೆ",
          syllable: ["ನಿಂ", "ಬೆ"],
          img: getAssetUrl(s3Assets.lemonM1KanI),
          syllablesAudio: [
            { name: "ನಿಂ", audio: getAssetAudioUrl(s3Assets.lemon1M1SylKan) },
            { name: "ಬೆ", audio: getAssetAudioUrl(s3Assets.lemon2M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.lemonM1Kan),
        },
        {
          completeWord: "ಕುಟುಂಬ",
          syllable: ["ಕು", "ಟುಂ", "ಬ"],
          img: getAssetUrl(s3Assets.familyM1KanI),
          syllablesAudio: [
            { name: "ಕು", audio: getAssetAudioUrl(s3Assets.family1M1SylKan) },
            { name: "ಟುಂ", audio: getAssetAudioUrl(s3Assets.family2M1SylKan) },
            { name: "ಬ", audio: getAssetAudioUrl(s3Assets.family3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.familyM1Kan),
        },
      ],
      L4: [
        {
          completeWord: "ಮಾನವ",
          syllable: ["ಮಾ", "ನ", "ವ"],
          img: getAssetUrl(s3Assets.humanM1KanI),
          syllablesAudio: [
            { name: "ಮಾ", audio: getAssetAudioUrl(s3Assets.human1M1SylKan) },
            { name: "ನ", audio: getAssetAudioUrl(s3Assets.human2M1SylKan) },
            { name: "ವ", audio: getAssetAudioUrl(s3Assets.human3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.humanM1Kan),
        },
        {
          completeWord: "ವಾಹನ",
          syllable: ["ವಾ", "ಹ", "ನ"],
          img: getAssetUrl(s3Assets.vehicleM1KanI),
          syllablesAudio: [
            { name: "ವಾ", audio: getAssetAudioUrl(s3Assets.vehicle1M1SylKan) },
            { name: "ಹ", audio: getAssetAudioUrl(s3Assets.vehicle2M1SylKan) },
            { name: "ನ", audio: getAssetAudioUrl(s3Assets.vehicle3M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.vehicleM1Kan),
        },
        {
          completeWord: "ಹೂಕೋಸು",
          syllable: ["ಹೂ", "ಕೋ", "ಸು"],
          img: getAssetUrl(s3Assets.cabbageM1KanI),
          syllablesAudio: [
            { name: "ಹೂ", audio: getAssetAudioUrl(s3Assets.Cauliflower_1) },
            { name: "ಕೋ", audio: getAssetAudioUrl(s3Assets.Cauliflower_2) },
            { name: "ಸು", audio: getAssetAudioUrl(s3Assets.Cauliflower_3) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.Cauliflower),
        },
        {
          completeWord: "ಭೂಮಿ",
          syllable: ["ಭೂ", "ಮಿ"],
          img: getAssetUrl(s3Assets.earthM1KanI),
          syllablesAudio: [
            { name: "ಭೂ", audio: getAssetAudioUrl(s3Assets.earth1M1SylKan) },
            { name: "ಮಿ", audio: getAssetAudioUrl(s3Assets.earth2M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.earthM1Kan),
        },
        {
          completeWord: "ಕಾಫಿ",
          syllable: ["ಕಾ", "ಫಿ"],
          img: getAssetUrl(s3Assets.coffeeM1KanI),
          syllablesAudio: [
            { name: "ಕಾ", audio: getAssetAudioUrl(s3Assets.coffee1M1SylKan) },
            { name: "ಫಿ", audio: getAssetAudioUrl(s3Assets.coffee2M1SylKan) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.coffeeM1Kan),
        },
      ],
      P3: [
        { completeWord: "ಒಂದು", syllable: ["ಒಂ", "ದು"], audio: "oneM1KanA" },
        {
          completeWord: "ಆರು",
          syllable: ["ಆರು", "ರು"],
          audio: "sixM1KanA",
        },
        { completeWord: "ಓಡು", syllable: ["ಓಡು", "ಡು"], audio: "runM1KanA" },
        { completeWord: "ಈಜು", syllable: ["ಈಜು", "ಜು"], audio: "swimM1KanA" },
        {
          completeWord: "ಜನ",
          syllable: ["ಜನ", "ನ"],
          audio: "peopleM1KanA",
        },
      ],
      P4: [
        {
          completeWord: "ಸೌತೆ",
          syllable: ["ಸೌ", "ತೆ"],
          audio: "cucumberM1Kan",
        },
        {
          completeWord: "ಮೀಸೆ",
          syllable: ["ಮೀ", "ಸೆ"],
          audio: "moustacheM1Kan",
        },
        {
          completeWord: "ಮಂಚ",
          syllable: ["ಮಂ", "ಚ"],
          audio: "cotKan",
        },
        {
          completeWord: "ಸರ",
          syllable: ["ಸರ", "ರ"],
          audio: "necklaceKan",
        },
        { completeWord: "ಐದು", syllable: ["ಐದು", "ದು"], audio: "fiveM1KanA" },
      ],
      S2: [
        { completeWord: "ಹುಡುಗ", syllable: ["Bas", "ket"] },
        { completeWord: "ಕಾಗೆ", syllable: ["Cr", "ow"] },
        { completeWord: "ವಾಹನ", syllable: ["Sun", "set"] },
        { completeWord: "ನಿಂಬೆ", syllable: ["But", "ton"] },
        { completeWord: "ತೋಳ", syllable: ["Wo", "lf"] },
      ],
    },
    te: {
      L1: [
        {
          completeWord: "పనస",
          syllable: ["ప", "న", "స"],
          img: getAssetUrl(s3Assets.jackfruitM1TelI),
          syllablesAudio: [
            { name: "ప", audio: getAssetAudioUrl(s3Assets.jackfruit1M3Tel) },
            { name: "న", audio: getAssetAudioUrl(s3Assets.jackfruit2M3Tel) },
            { name: "స", audio: getAssetAudioUrl(s3Assets.jackfrui31M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.jackfruitM1Tel),
        },
        {
          completeWord: "ఉడత",
          syllable: ["ఉ", "డ", "త"],
          img: getAssetUrl(s3Assets.squirrelM1TelI),
          syllablesAudio: [
            { name: "ఉ", audio: getAssetAudioUrl(s3Assets.squirrel1M3Tel) },
            { name: "డ", audio: getAssetAudioUrl(s3Assets.squirrel2M3Tel) },
            { name: "త", audio: getAssetAudioUrl(s3Assets.squirrel3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.squirrelM1Tel),
        },
        {
          completeWord: "ఎలుక",
          syllable: ["ఎ", "లు", "క"],
          img: getAssetUrl(s3Assets.ratM1TelI),
          syllablesAudio: [
            { name: "ఎ", audio: getAssetAudioUrl(s3Assets.rat1M3Tel) },
            { name: "లు", audio: getAssetAudioUrl(s3Assets.rat2M3Tel) },
            { name: "క", audio: getAssetAudioUrl(s3Assets.rat3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.ratM1Tel),
        },
        {
          completeWord: "పడవ",
          syllable: ["ప", "డ", "వ"],
          img: getAssetUrl(s3Assets.boatM1TelI),
          syllablesAudio: [
            { name: "ప", audio: getAssetAudioUrl(s3Assets.boat1M3Tel) },
            { name: "డ", audio: getAssetAudioUrl(s3Assets.boat2M3Tel) },
            { name: "వ", audio: getAssetAudioUrl(s3Assets.boat3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.boatM1Tel),
        },
        {
          completeWord: "ఉంగరం",
          syllable: ["ఉం", "గ", "రం"],
          img: getAssetUrl(s3Assets.ringM1TelI),
          syllablesAudio: [
            { name: "ఉం", audio: getAssetAudioUrl(s3Assets.ring1M3Tel) },
            { name: "గ", audio: getAssetAudioUrl(s3Assets.ring2M3Tel) },
            { name: "రం", audio: getAssetAudioUrl(s3Assets.ring3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.ringM1Tel),
        },
      ],
      L2: [
        {
          completeWord: "అరటి",
          syllable: ["అ", "ర", "టి"],
          img: getAssetUrl(s3Assets.bananaM1TelI),
          syllablesAudio: [
            { name: "అ", audio: getAssetAudioUrl(s3Assets.banana1M3Tel) },
            { name: "ర", audio: getAssetAudioUrl(s3Assets.banana2M3Tel) },
            { name: "టి", audio: getAssetAudioUrl(s3Assets.banana3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bananaM1Tel),
        },
        {
          completeWord: "గాడిద",
          syllable: ["గా", "డి", "ద"],
          img: getAssetUrl(s3Assets.donkeyM1TelI),
          syllablesAudio: [
            { name: "గా", audio: getAssetAudioUrl(s3Assets.donkey1M3Tel) },
            { name: "డి", audio: getAssetAudioUrl(s3Assets.donkey2M3Tel) },
            { name: "ద", audio: getAssetAudioUrl(s3Assets.donkey3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.donkeyM1Tel),
        },
        {
          completeWord: "తలుపు",
          syllable: ["త", "లు", "పు"],
          img: getAssetUrl(s3Assets.doorM1TelI),
          syllablesAudio: [
            { name: "త", audio: getAssetAudioUrl(s3Assets.door1M3Tel) },
            { name: "లు", audio: getAssetAudioUrl(s3Assets.door2M3Tel) },
            { name: "పు", audio: getAssetAudioUrl(s3Assets.door3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.doorM1Tel),
        },
        {
          completeWord: "చిలుక",
          syllable: ["చి", "లు", "క"],
          img: getAssetUrl(s3Assets.parrotM1TelI),
          syllablesAudio: [
            { name: "చి", audio: getAssetAudioUrl(s3Assets.parrot1M3Tel) },
            { name: "లు", audio: getAssetAudioUrl(s3Assets.parrot2M3Tel) },
            { name: "క", audio: getAssetAudioUrl(s3Assets.parrot3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.parrotM1Tel),
        },
        {
          completeWord: "పిచుక",
          syllable: ["పి", "చు", "క"],
          img: getAssetUrl(s3Assets.sparrowM1TelI),
          syllablesAudio: [
            { name: "పి", audio: getAssetAudioUrl(s3Assets.sparrow1M3Tel) },
            { name: "చు", audio: getAssetAudioUrl(s3Assets.sparrow2M3Tel) },
            { name: "క", audio: getAssetAudioUrl(s3Assets.sparrow3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.sparrowM1Tel),
        },
      ],
      P1: [
        {
          completeWord: "కాఫీ",
          syllable: ["కా", "ఫీ"],
          audio: "coffee_M1Audio",
        },
        {
          completeWord: "వీధి",
          syllable: ["వీ", "ధి"],
          audio: "street_M1Audio",
        },
        {
          completeWord: "నలుపు",
          syllable: ["న", "లుపు"],
          audio: "black_M1Audio",
        },
        {
          completeWord: "అరటి",
          syllable: ["అ", "రటి"],
          audio: "banana_M1Audio",
        },
        {
          completeWord: "నగరం",
          syllable: ["న", "గరం"],
          audio: "city_M1Audio",
        },
      ],
      P2: [
        {
          completeWord: "దారం",
          syllable: ["దా", "రం"],
          audio: "thread_M1Audio",
        },
        {
          completeWord: "ఎరుపు",
          syllable: ["ఎ", "రుపు"],
          audio: "red_M1Audio",
        },
        {
          completeWord: "కుంచె",
          syllable: ["కు", "ంచె"],
          audio: "brush_M1Audio",
        },
        { completeWord: "గీయు", syllable: ["గీ", "యు"], audio: "drawM1Tel" },
        { completeWord: "ఎముక", syllable: ["ఎ", "ముక"], audio: "boneM1Tel" },
      ],
      S1: [
        {
          completeWord: "నగ",
          syllable: ["నగ"],
        },
        {
          completeWord: "బడి",
          syllable: ["బ", "డి"],
        },
        {
          completeWord: "కల",
          syllable: ["కల"],
        },
        {
          completeWord: "ఈత",
          syllable: ["ఈ", "త"],
        },
        {
          completeWord: "దండ",
          syllable: ["దం", "డ"],
        },
      ],
      L3: [
        {
          completeWord: "తామర",
          syllable: ["తా", "మ", "ర"],
          img: getAssetUrl(s3Assets.lotusM1TelI),
          syllablesAudio: [
            { name: "తా", audio: getAssetAudioUrl(s3Assets.lotus1M3Tel) },
            { name: "మ", audio: getAssetAudioUrl(s3Assets.lotus2M3Tel) },
            { name: "ర", audio: getAssetAudioUrl(s3Assets.lotus3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.lotusM1Tel),
        },
        {
          completeWord: "నాలుక",
          syllable: ["నా", "లు", "క"],
          img: getAssetUrl(s3Assets.tongueM1TelI),
          syllablesAudio: [
            { name: "నా", audio: getAssetAudioUrl(s3Assets.tongue1M3Tel) },
            { name: "లు", audio: getAssetAudioUrl(s3Assets.tongue2M3Tel) },
            { name: "క", audio: getAssetAudioUrl(s3Assets.tongue3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.tongueM1Tel),
        },
        {
          completeWord: "కంగారు",
          syllable: ["కం", "గా", "రు"],
          img: getAssetUrl(s3Assets.kangarooM1TelI),
          syllablesAudio: [
            { name: "కం", audio: getAssetAudioUrl(s3Assets.kangaroo1M3Tel) },
            { name: "గా", audio: getAssetAudioUrl(s3Assets.kangaroo2M3Tel) },
            { name: "రు", audio: getAssetAudioUrl(s3Assets.kangaroo3M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.kangarooM1Tel),
        },
        {
          completeWord: "చెంచా",
          syllable: ["చెం", "చా"],
          img: getAssetUrl(s3Assets.spoonM1TelI),
          syllablesAudio: [
            { name: "చెం", audio: getAssetAudioUrl(s3Assets.spoon1M3Tel) },
            { name: "చా", audio: getAssetAudioUrl(s3Assets.spoon2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.spoonM1Tel),
        },
        {
          completeWord: "చెవి",
          syllable: ["చె", "వి"],
          img: getAssetUrl(s3Assets.earM1TelI),
          syllablesAudio: [
            { name: "చె", audio: getAssetAudioUrl(s3Assets.ear1M3Tel) },
            { name: "వి", audio: getAssetAudioUrl(s3Assets.ear2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.earM1Tel),
        },
      ],
      L4: [
        {
          completeWord: "చేయి",
          syllable: ["చె", "యి"],
          img: getAssetUrl(s3Assets.handM1TelI),
          syllablesAudio: [
            { name: "చె", audio: getAssetAudioUrl(s3Assets.hand1M3Tel) },
            { name: "యి", audio: getAssetAudioUrl(s3Assets.hand2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.handM1Tel),
        },
        {
          completeWord: "జాడీ",
          syllable: ["జా", "డీ"],
          img: getAssetUrl(s3Assets.jarM1TelI),
          syllablesAudio: [
            { name: "జా", audio: getAssetAudioUrl(s3Assets.jar1M3Tel) },
            { name: "డీ", audio: getAssetAudioUrl(s3Assets.jar2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.jarM1Tel),
        },
        {
          completeWord: "సీసా",
          syllable: ["సీ", "సా"],
          img: getAssetUrl(s3Assets.bottleM1TelI),
          syllablesAudio: [
            { name: "సీ", audio: getAssetAudioUrl(s3Assets.bottle1M3Tel) },
            { name: "సా", audio: getAssetAudioUrl(s3Assets.bottle2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.bottleM1Tel),
        },
        {
          completeWord: "రోటీ",
          syllable: ["రో", "టీ"],
          img: getAssetUrl(s3Assets.rotiM1TelI),
          syllablesAudio: [
            { name: "రో", audio: getAssetAudioUrl(s3Assets.roti1M3Tel) },
            { name: "టీ", audio: getAssetAudioUrl(s3Assets.roti2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.rotiM1Tel),
        },
        {
          completeWord: "భూమి",
          syllable: ["భూ", "మి"],
          img: getAssetUrl(s3Assets.earthM1TelI),
          syllablesAudio: [
            { name: "భూ", audio: getAssetAudioUrl(s3Assets.earth1M3Tel) },
            { name: "మి", audio: getAssetAudioUrl(s3Assets.earth2M3Tel) },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.earthM1Tel),
        },
      ],
      P3: [
        { completeWord: "ఇటుక", syllable: ["ఇ", "టుక"], audio: "brickM1Tel" },
        {
          completeWord: "పండుగ",
          syllable: ["పం", "డుగ"],
          audio: "festivalM1Tel",
        },
        {
          completeWord: "కంబళి",
          syllable: ["కం", "బళి"],
          audio: "blanketM1Tel",
        },
        { completeWord: "గడియ", syllable: ["గ", "డియ"], audio: "boltM1Tel" },
        { completeWord: "చాకలి", syllable: ["చా", "కలి"], audio: "dhobiM1Tel" },
      ],
      P4: [
        {
          completeWord: "మిడత",
          syllable: ["మి", "డత"],
          audio: "grasshopperM1Tel",
        },
        { completeWord: "టోపీ", syllable: ["టో", "పీ"], audio: "capM1Tel" },
        {
          completeWord: "గది",
          syllable: ["గ", "ది"],
          audio: "room_M1Audio",
        },
        {
          completeWord: "తల",
          syllable: ["త", "ల"],
          audio: "head_M1Audio",
        },
        {
          completeWord: "నేల",
          syllable: ["నే", "ల"],
          audio: "floor_M1Audio",
        },
      ],
      S2: [
        {
          completeWord: "గోడ",
          syllable: ["గో", "డ"],
        },
        {
          completeWord: "తోట",
          syllable: ["తో", "ట"],
        },
        {
          completeWord: "దీపం",
          syllable: ["దీ", "పం"],
        },
        {
          completeWord: "నది",
          syllable: ["న", "ది"],
        },
        {
          completeWord: "కల",
          syllable: ["కల"],
        },
      ],
    },
    gu: {
      L1: [
        {
          completeWord: "Apple",
          syllable: ["Ap", "ple"],
          img: getAssetUrl(s3Assets.Apple) || Assets.Apple,
          syllablesAudio: [
            {
              name: "Ap",
              audio: getAssetAudioUrl(s3Assets.apAudio) || Assets.apAudio,
            },
            {
              name: "ple",
              audio: getAssetAudioUrl(s3Assets.pleAudio) || Assets.pleAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.appleAudio) || Assets.appleAudio,
        },
        {
          completeWord: "Tiger",
          syllable: ["Ti", "ger"],
          img: getAssetUrl(s3Assets.TigerNewImg) || Assets.TigerNewImg,
          syllablesAudio: [
            {
              name: "Ti",
              audio: getAssetAudioUrl(s3Assets.tiAudio) || Assets.tiAudio,
            },
            {
              name: "ger",
              audio: getAssetAudioUrl(s3Assets.gerAudio) || Assets.gerAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.tigerAudio) || Assets.tigerAudio,
        },
        {
          completeWord: "Happy",
          syllable: ["Hap", "py"],
          img: getAssetUrl(s3Assets.happyImg) || Assets.happyImg,
          syllablesAudio: [
            {
              name: "Hap",
              audio: getAssetAudioUrl(s3Assets.hapAudio) || Assets.hapAudio,
            },
            {
              name: "py",
              audio: getAssetAudioUrl(s3Assets.pyAudio) || Assets.pyAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.happyAudio) || Assets.happyAudio,
        },
        {
          completeWord: "Pencil",
          syllable: ["Pen", "cil"],
          img: getAssetUrl(s3Assets.pencilImg) || Assets.pencilImg,
          syllablesAudio: [
            {
              name: "Pen",
              audio: Assets.penAudio,
            },
            {
              name: "cil",
              audio: getAssetAudioUrl(s3Assets.cilAudio) || Assets.cilAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.pencilAudio) || Assets.pencilAudio,
        },
        {
          completeWord: "Rocket",
          syllable: ["Rock", "et"],
          img: getAssetUrl(s3Assets.RocketNewImg) || Assets.RocketNewImg,
          syllablesAudio: [
            {
              name: "Rock",
              audio: getAssetAudioUrl(s3Assets.Rock) || Assets.Rock,
            },
            { name: "Et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.RocketS) || Assets.RocketS,
        },
      ],
      L2: [
        {
          completeWord: "Basket",
          syllable: ["Bas", "ket"],
          img: getAssetUrl(s3Assets.Basket) || Assets.Basket,
          syllablesAudio: [
            {
              name: "Bas",
              audio: getAssetAudioUrl(s3Assets.Bas) || Assets.Bas,
            },
            { name: "Ket", audio: Assets.Ket },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.BasketS) || Assets.BasketS,
        },
        {
          completeWord: "Dinner",
          syllable: ["Din", "ner"],
          img: getAssetUrl(s3Assets.DinnerNewImg) || Assets.DinnerNewImg,
          syllablesAudio: [
            {
              name: "Din",
              audio: getAssetAudioUrl(s3Assets.dinAudio) || Assets.dinAudio,
            },
            {
              name: "ner",
              audio: getAssetAudioUrl(s3Assets.nerAudio) || Assets.nerAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.dinnerAudio) || Assets.dinnerAudio,
        },
        {
          completeWord: "Window",
          syllable: ["Win", "dow"],
          img: getAssetUrl(s3Assets.WindowNewImg) || Assets.WindowNewImg,
          syllablesAudio: [
            {
              name: "Win",
              audio: getAssetAudioUrl(s3Assets.winAudio) || Assets.winAudio,
            },
            {
              name: "dow",
              audio: getAssetAudioUrl(s3Assets.dowAudio) || Assets.dowAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.windowAudio) || Assets.windowAudio,
        },
        {
          completeWord: "Magnet",
          syllable: ["Mag", "net"],
          img: getAssetUrl(s3Assets.MagnetNewImg) || Assets.MagnetNewImg,
          syllablesAudio: [
            {
              name: "Mag",
              audio: getAssetAudioUrl(s3Assets.magAudio) || Assets.magAudio,
            },
            {
              name: "net",
              audio: getAssetAudioUrl(s3Assets.netAudio) || Assets.netAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.magnetAudio) || Assets.magnetAudio,
        },
        {
          completeWord: "Tennis",
          syllable: ["Ten", "nis"],
          img: getAssetUrl(s3Assets.TennisNewImg) || Assets.TennisNewImg,
          syllablesAudio: [
            {
              name: "Ten",
              audio: getAssetAudioUrl(s3Assets.tenAudio) || Assets.tenAudio,
            },
            {
              name: "nis",
              audio: getAssetAudioUrl(s3Assets.nisAudio) || Assets.nisAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.tennisAudio) || Assets.tennisAudio,
        },
      ],
      P1: [
        { completeWord: "ಆಕಾಶ", syllable: ["ಆ", "ಕಾಶ"], audio: "skyM1Kan" },
        { completeWord: "ಹಲ್ಲು", syllable: ["ಹಲ್", "ಲು"], audio: "teethM1Kan" },
        { completeWord: "ಕೋಪ", syllable: ["코", "ಪ"], audio: "angerM1Kan" },
        { completeWord: "ಕಪ್ಪೆ", syllable: ["ಕಪ್", "ಪೆ"], audio: "frogM1Kan" },
        { completeWord: "ಉಪ್ಪು", syllable: ["ಉಪ್", "ಪು"], audio: "saltM1Kan" },
      ],
      P2: [
        { completeWord: "ಸೀರೆ", syllable: ["ಸೀ", "ರೆ"], audio: "sareeM1Kan" },
        { completeWord: "ಸೀಬೆ", syllable: ["ಸೀ", "ಬೆ"], audio: "guavaM1Kan" },
        { completeWord: "ಗೋಧಿ", syllable: ["ಗೋ", "ಧಿ"], audio: "wheatM1Kan" },
        {
          completeWord: "ಕೊಡೆ",
          syllable: ["ಕೊ", "ಡೆ"],
          audio: "umbrellaM1Kan",
        },
        { completeWord: "ಆಹಾರ", syllable: ["ಆ", "ಹಾರ"], audio: "foodM1Kan" },
      ],
      S1: [
        { completeWord: "Tiger", syllable: ["Ti", "ger"] },
        { completeWord: "Rocket", syllable: ["Rock", "et"] },
        { completeWord: "Lemon", syllable: ["Le", "mon"] },
        { completeWord: "Tomato", syllable: ["To", "ma", "to"] },
        { completeWord: "Mango", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "Picture",
          syllable: ["Pic", "ture"],
          img: getAssetUrl(s3Assets.PictureNewImg) || Assets.PictureNewImg,
          syllablesAudio: [
            {
              name: "Pic",
              audio: getAssetAudioUrl(s3Assets.picAudio) || Assets.picAudio,
            },
            {
              name: "ture",
              audio: getAssetAudioUrl(s3Assets.tureAudio) || Assets.tureAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.pictureAudio) || Assets.pictureAudio,
        },
        {
          completeWord: "Number",
          syllable: ["Num", "ber"],
          img: getAssetUrl(s3Assets.NumberNewImg) || Assets.NumberNewImg,
          syllablesAudio: [
            {
              name: "Num",
              audio: getAssetAudioUrl(s3Assets.numAudio) || Assets.numAudio,
            },
            {
              name: "ber",
              audio: getAssetAudioUrl(s3Assets.berAudio) || Assets.berAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.numberAudio) || Assets.numberAudio,
        },
        {
          completeWord: "Doctor",
          syllable: ["Doc", "tor"],
          img: getAssetUrl(s3Assets.DoctorNewImg) || Assets.DoctorNewImg,
          syllablesAudio: [
            {
              name: "Doc",
              audio: getAssetAudioUrl(s3Assets.docAudio) || Assets.docAudio,
            },
            {
              name: "tor",
              audio: getAssetAudioUrl(s3Assets.torAudio) || Assets.torAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.doctorAudio) || Assets.doctorAudio,
        },
        {
          completeWord: "Paper",
          syllable: ["Pa", "per"],
          img:
            getAssetUrl(s3Assets.questionPaperImg) || Assets.questionPaperImg,
          syllablesAudio: [
            {
              name: "Pa",
              audio: getAssetAudioUrl(s3Assets.paAudio) || Assets.paAudio,
            },
            {
              name: "per",
              audio: getAssetAudioUrl(s3Assets.perAudio) || Assets.perAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.paperAudio) || Assets.paperAudio,
        },
        {
          completeWord: "Monkey",
          syllable: ["Mon", "key"],
          img: getAssetUrl(s3Assets.MonkeyNewImg) || Assets.MonkeyNewImg,
          syllablesAudio: [
            {
              name: "Mon",
              audio: getAssetAudioUrl(s3Assets.monAudio) || Assets.monAudio,
            },
            {
              name: "key",
              audio: getAssetAudioUrl(s3Assets.keyAudio) || Assets.keyAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.monkeyAudio) || Assets.monkeyAudio,
        },
      ],
      L4: [
        {
          completeWord: "Garden",
          syllable: ["Gar", "den"],
          img: getAssetUrl(s3Assets.gardenImg) || Assets.GardenNewImg,
          syllablesAudio: [
            {
              name: "Gar",
              audio: getAssetAudioUrl(s3Assets.garAudio) || Assets.garAudio,
            },
            {
              name: "den",
              audio: getAssetAudioUrl(s3Assets.denAudio) || Assets.denAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.GardenAudio) || Assets.GardenAudio,
        },
        {
          completeWord: "Helmet",
          syllable: ["Hel", "met"],
          img: getAssetUrl(s3Assets.helmetImg) || Assets.helmetImg,
          syllablesAudio: [
            {
              name: "Hel",
              audio: getAssetAudioUrl(s3Assets.helAudio) || Assets.helAudio,
            },
            {
              name: "met",
              audio: getAssetAudioUrl(s3Assets.metAudio) || Assets.metAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.helmetAudio) || Assets.helmetAudio,
        },
        {
          completeWord: "Kitten",
          syllable: ["Kit", "ten"],
          img: getAssetUrl(s3Assets.catImage) || Assets.catImage,
          syllablesAudio: [
            {
              name: "Kit",
              audio: getAssetAudioUrl(s3Assets.Kit) || Assets.Kit,
            },
            {
              name: "ten",
              audio: getAssetAudioUrl(s3Assets.Ten) || Assets.Ten,
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.KittenS) || Assets.KittenS,
        },
        {
          completeWord: "Jacket",
          syllable: ["Jack", "et"],
          img: getAssetUrl(s3Assets.Jacket) || Assets.Jacket,
          syllablesAudio: [
            {
              name: "Jack",
              audio: getAssetAudioUrl(s3Assets.Jack) || Assets.Jack,
            },
            { name: "et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.JacketS) || Assets.JacketS,
        },
        {
          completeWord: "Pocket",
          syllable: ["Pock", "et"],
          img: getAssetUrl(s3Assets.pocketImage) || Assets.pocketImage,
          syllablesAudio: [
            {
              name: "Pock",
              audio: getAssetAudioUrl(s3Assets.Pock) || Assets.Pock,
            },
            { name: "et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.PocketS) || Assets.PocketS,
        },
      ],
      P3: [
        { completeWord: "ಹಕ್ಕಿ", syllable: ["ಹಕ್", "ಕಿ"], audio: "birdM1Kan" },
        {
          completeWord: "ಗುಬ್ಬಿ",
          syllable: ["ಗುಬ್", "ಬಿ"],
          audio: "sparrowM1Kan",
        },
        { completeWord: "ಹಣ್ಣು", syllable: ["ಹಣ್", "ಣು"], audio: "fruitM1Kan" },
        { completeWord: "ಸುಣ್ಣ", syllable: ["ಸುಣ್", "ಣ"], audio: "limeM1Kan" },
        {
          completeWord: "ಬುಟ್ಟಿ",
          syllable: ["ಬುಟ್", "ಟಿ"],
          audio: "basketM1Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಸೌತೆ",
          syllable: ["ಸೌ", "ತೆ"],
          audio: "cucumberM1Kan",
        },
        {
          completeWord: "ಮೀಸೆ",
          syllable: ["ಮೀ", "ಸೆ"],
          audio: "moustacheM1Kan",
        },
        {
          completeWord: "ಹಬ್ಬ",
          syllable: ["ಹಬ್", "ಬ"],
          audio: "festivalM1Kan",
        },
        { completeWord: "ಲಡ್ಡು", syllable: ["ಲಡ್", "ಡು"], audio: "ladduM1Kan" },
        { completeWord: "ಹದ್ದು", syllable: ["ಹದ್", "ದು"], audio: "eagleM1Kan" },
      ],
      S2: [
        { completeWord: "Basket", syllable: ["Bas", "ket"] },
        { completeWord: "Tablet", syllable: ["Tab", "let"] },
        { completeWord: "Sunset", syllable: ["Sun", "set"] },
        { completeWord: "Button", syllable: ["But", "ton"] },
        { completeWord: "Window", syllable: ["Win", "dow"] },
      ],
    },
    or: {
      L1: [
        {
          completeWord: "Apple",
          syllable: ["Ap", "ple"],
          img: getAssetUrl(s3Assets.Apple) || Assets.Apple,
          syllablesAudio: [
            {
              name: "Ap",
              audio: getAssetAudioUrl(s3Assets.apAudio) || Assets.apAudio,
            },
            {
              name: "ple",
              audio: getAssetAudioUrl(s3Assets.pleAudio) || Assets.pleAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.appleAudio) || Assets.appleAudio,
        },
        {
          completeWord: "Tiger",
          syllable: ["Ti", "ger"],
          img: getAssetUrl(s3Assets.TigerNewImg) || Assets.TigerNewImg,
          syllablesAudio: [
            {
              name: "Ti",
              audio: getAssetAudioUrl(s3Assets.tiAudio) || Assets.tiAudio,
            },
            {
              name: "ger",
              audio: getAssetAudioUrl(s3Assets.gerAudio) || Assets.gerAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.tigerAudio) || Assets.tigerAudio,
        },
        {
          completeWord: "Happy",
          syllable: ["Hap", "py"],
          img: getAssetUrl(s3Assets.happyImg) || Assets.happyImg,
          syllablesAudio: [
            {
              name: "Hap",
              audio: getAssetAudioUrl(s3Assets.hapAudio) || Assets.hapAudio,
            },
            {
              name: "py",
              audio: getAssetAudioUrl(s3Assets.pyAudio) || Assets.pyAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.happyAudio) || Assets.happyAudio,
        },
        {
          completeWord: "Pencil",
          syllable: ["Pen", "cil"],
          img: getAssetUrl(s3Assets.pencilImg) || Assets.pencilImg,
          syllablesAudio: [
            {
              name: "Pen",
              audio: Assets.penAudio,
            },
            {
              name: "cil",
              audio: getAssetAudioUrl(s3Assets.cilAudio) || Assets.cilAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.pencilAudio) || Assets.pencilAudio,
        },
        {
          completeWord: "Rocket",
          syllable: ["Rock", "et"],
          img: getAssetUrl(s3Assets.RocketNewImg) || Assets.RocketNewImg,
          syllablesAudio: [
            {
              name: "Rock",
              audio: getAssetAudioUrl(s3Assets.Rock) || Assets.Rock,
            },
            { name: "Et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.RocketS) || Assets.RocketS,
        },
      ],
      L2: [
        {
          completeWord: "Basket",
          syllable: ["Bas", "ket"],
          img: getAssetUrl(s3Assets.Basket) || Assets.Basket,
          syllablesAudio: [
            {
              name: "Bas",
              audio: getAssetAudioUrl(s3Assets.Bas) || Assets.Bas,
            },
            { name: "Ket", audio: Assets.Ket },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.BasketS) || Assets.BasketS,
        },
        {
          completeWord: "Dinner",
          syllable: ["Din", "ner"],
          img: getAssetUrl(s3Assets.DinnerNewImg) || Assets.DinnerNewImg,
          syllablesAudio: [
            {
              name: "Din",
              audio: getAssetAudioUrl(s3Assets.dinAudio) || Assets.dinAudio,
            },
            {
              name: "ner",
              audio: getAssetAudioUrl(s3Assets.nerAudio) || Assets.nerAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.dinnerAudio) || Assets.dinnerAudio,
        },
        {
          completeWord: "Window",
          syllable: ["Win", "dow"],
          img: getAssetUrl(s3Assets.WindowNewImg) || Assets.WindowNewImg,
          syllablesAudio: [
            {
              name: "Win",
              audio: getAssetAudioUrl(s3Assets.winAudio) || Assets.winAudio,
            },
            {
              name: "dow",
              audio: getAssetAudioUrl(s3Assets.dowAudio) || Assets.dowAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.windowAudio) || Assets.windowAudio,
        },
        {
          completeWord: "Magnet",
          syllable: ["Mag", "net"],
          img: getAssetUrl(s3Assets.MagnetNewImg) || Assets.MagnetNewImg,
          syllablesAudio: [
            {
              name: "Mag",
              audio: getAssetAudioUrl(s3Assets.magAudio) || Assets.magAudio,
            },
            {
              name: "net",
              audio: getAssetAudioUrl(s3Assets.netAudio) || Assets.netAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.magnetAudio) || Assets.magnetAudio,
        },
        {
          completeWord: "Tennis",
          syllable: ["Ten", "nis"],
          img: getAssetUrl(s3Assets.TennisNewImg) || Assets.TennisNewImg,
          syllablesAudio: [
            {
              name: "Ten",
              audio: getAssetAudioUrl(s3Assets.tenAudio) || Assets.tenAudio,
            },
            {
              name: "nis",
              audio: getAssetAudioUrl(s3Assets.nisAudio) || Assets.nisAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.tennisAudio) || Assets.tennisAudio,
        },
      ],
      P1: [
        { completeWord: "ಆಕಾಶ", syllable: ["ಆ", "ಕಾಶ"], audio: "skyM1Kan" },
        { completeWord: "ಹಲ್ಲು", syllable: ["ಹಲ್", "ಲು"], audio: "teethM1Kan" },
        { completeWord: "ಕೋಪ", syllable: ["코", "ಪ"], audio: "angerM1Kan" },
        { completeWord: "ಕಪ್ಪೆ", syllable: ["ಕಪ್", "ಪೆ"], audio: "frogM1Kan" },
        { completeWord: "ಉಪ್ಪು", syllable: ["ಉಪ್", "ಪು"], audio: "saltM1Kan" },
      ],
      P2: [
        { completeWord: "ಸೀರೆ", syllable: ["ಸೀ", "ರೆ"], audio: "sareeM1Kan" },
        { completeWord: "ಸೀಬೆ", syllable: ["ಸೀ", "ಬೆ"], audio: "guavaM1Kan" },
        { completeWord: "ಗೋಧಿ", syllable: ["ಗೋ", "ಧಿ"], audio: "wheatM1Kan" },
        {
          completeWord: "ಕೊಡೆ",
          syllable: ["ಕೊ", "ಡೆ"],
          audio: "umbrellaM1Kan",
        },
        { completeWord: "ಆಹಾರ", syllable: ["ಆ", "ಹಾರ"], audio: "foodM1Kan" },
      ],
      S1: [
        { completeWord: "Tiger", syllable: ["Ti", "ger"] },
        { completeWord: "Rocket", syllable: ["Rock", "et"] },
        { completeWord: "Lemon", syllable: ["Le", "mon"] },
        { completeWord: "Tomato", syllable: ["To", "ma", "to"] },
        { completeWord: "Mango", syllable: ["Man", "go"] },
      ],
      L3: [
        {
          completeWord: "Picture",
          syllable: ["Pic", "ture"],
          img: getAssetUrl(s3Assets.PictureNewImg) || Assets.PictureNewImg,
          syllablesAudio: [
            {
              name: "Pic",
              audio: getAssetAudioUrl(s3Assets.picAudio) || Assets.picAudio,
            },
            {
              name: "ture",
              audio: getAssetAudioUrl(s3Assets.tureAudio) || Assets.tureAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.pictureAudio) || Assets.pictureAudio,
        },
        {
          completeWord: "Number",
          syllable: ["Num", "ber"],
          img: getAssetUrl(s3Assets.NumberNewImg) || Assets.NumberNewImg,
          syllablesAudio: [
            {
              name: "Num",
              audio: getAssetAudioUrl(s3Assets.numAudio) || Assets.numAudio,
            },
            {
              name: "ber",
              audio: getAssetAudioUrl(s3Assets.berAudio) || Assets.berAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.numberAudio) || Assets.numberAudio,
        },
        {
          completeWord: "Doctor",
          syllable: ["Doc", "tor"],
          img: getAssetUrl(s3Assets.DoctorNewImg) || Assets.DoctorNewImg,
          syllablesAudio: [
            {
              name: "Doc",
              audio: getAssetAudioUrl(s3Assets.docAudio) || Assets.docAudio,
            },
            {
              name: "tor",
              audio: getAssetAudioUrl(s3Assets.torAudio) || Assets.torAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.doctorAudio) || Assets.doctorAudio,
        },
        {
          completeWord: "Paper",
          syllable: ["Pa", "per"],
          img:
            getAssetUrl(s3Assets.questionPaperImg) || Assets.questionPaperImg,
          syllablesAudio: [
            {
              name: "Pa",
              audio: getAssetAudioUrl(s3Assets.paAudio) || Assets.paAudio,
            },
            {
              name: "per",
              audio: getAssetAudioUrl(s3Assets.perAudio) || Assets.perAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.paperAudio) || Assets.paperAudio,
        },
        {
          completeWord: "Monkey",
          syllable: ["Mon", "key"],
          img: getAssetUrl(s3Assets.MonkeyNewImg) || Assets.MonkeyNewImg,
          syllablesAudio: [
            {
              name: "Mon",
              audio: getAssetAudioUrl(s3Assets.monAudio) || Assets.monAudio,
            },
            {
              name: "key",
              audio: getAssetAudioUrl(s3Assets.keyAudio) || Assets.keyAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.monkeyAudio) || Assets.monkeyAudio,
        },
      ],
      L4: [
        {
          completeWord: "Garden",
          syllable: ["Gar", "den"],
          img: getAssetUrl(s3Assets.gardenImg) || Assets.GardenNewImg,
          syllablesAudio: [
            {
              name: "Gar",
              audio: getAssetAudioUrl(s3Assets.garAudio) || Assets.garAudio,
            },
            {
              name: "den",
              audio: getAssetAudioUrl(s3Assets.denAudio) || Assets.denAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.GardenAudio) || Assets.GardenAudio,
        },
        {
          completeWord: "Helmet",
          syllable: ["Hel", "met"],
          img: getAssetUrl(s3Assets.helmetImg) || Assets.helmetImg,
          syllablesAudio: [
            {
              name: "Hel",
              audio: getAssetAudioUrl(s3Assets.helAudio) || Assets.helAudio,
            },
            {
              name: "met",
              audio: getAssetAudioUrl(s3Assets.metAudio) || Assets.metAudio,
            },
          ],
          completeAudio:
            getAssetAudioUrl(s3Assets.helmetAudio) || Assets.helmetAudio,
        },
        {
          completeWord: "Kitten",
          syllable: ["Kit", "ten"],
          img: getAssetUrl(s3Assets.catImage) || Assets.catImage,
          syllablesAudio: [
            {
              name: "Kit",
              audio: getAssetAudioUrl(s3Assets.Kit) || Assets.Kit,
            },
            {
              name: "ten",
              audio: getAssetAudioUrl(s3Assets.Ten) || Assets.Ten,
            },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.KittenS) || Assets.KittenS,
        },
        {
          completeWord: "Jacket",
          syllable: ["Jack", "et"],
          img: getAssetUrl(s3Assets.Jacket) || Assets.Jacket,
          syllablesAudio: [
            {
              name: "Jack",
              audio: getAssetAudioUrl(s3Assets.Jack) || Assets.Jack,
            },
            { name: "et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.JacketS) || Assets.JacketS,
        },
        {
          completeWord: "Pocket",
          syllable: ["Pock", "et"],
          img: getAssetUrl(s3Assets.pocketImage) || Assets.pocketImage,
          syllablesAudio: [
            {
              name: "Pock",
              audio: getAssetAudioUrl(s3Assets.Pock) || Assets.Pock,
            },
            { name: "et", audio: getAssetAudioUrl(s3Assets.Et) || Assets.Et },
          ],
          completeAudio: getAssetAudioUrl(s3Assets.PocketS) || Assets.PocketS,
        },
      ],
      P3: [
        { completeWord: "ಹಕ್ಕಿ", syllable: ["ಹಕ್", "ಕಿ"], audio: "birdM1Kan" },
        {
          completeWord: "ಗುಬ್ಬಿ",
          syllable: ["ಗುಬ್", "ಬಿ"],
          audio: "sparrowM1Kan",
        },
        { completeWord: "ಹಣ್ಣು", syllable: ["ಹಣ್", "ಣು"], audio: "fruitM1Kan" },
        { completeWord: "ಸುಣ್ಣ", syllable: ["ಸುಣ್", "ಣ"], audio: "limeM1Kan" },
        {
          completeWord: "ಬುಟ್ಟಿ",
          syllable: ["ಬುಟ್", "ಟಿ"],
          audio: "basketM1Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಸೌತೆ",
          syllable: ["ಸೌ", "ತೆ"],
          audio: "cucumberM1Kan",
        },
        {
          completeWord: "ಮೀಸೆ",
          syllable: ["ಮೀ", "ಸೆ"],
          audio: "moustacheM1Kan",
        },
        {
          completeWord: "ಹಬ್ಬ",
          syllable: ["ಹಬ್", "ಬ"],
          audio: "festivalM1Kan",
        },
        { completeWord: "ಲಡ್ಡು", syllable: ["ಲಡ್", "ಡು"], audio: "ladduM1Kan" },
        { completeWord: "ಹದ್ದು", syllable: ["ಹದ್", "ದು"], audio: "eagleM1Kan" },
      ],
      S2: [
        { completeWord: "Basket", syllable: ["Bas", "ket"] },
        { completeWord: "Tablet", syllable: ["Tab", "let"] },
        { completeWord: "Sunset", syllable: ["Sun", "set"] },
        { completeWord: "Button", syllable: ["But", "ton"] },
        { completeWord: "Window", syllable: ["Win", "dow"] },
      ],
    },
  };

  const levelTwo = {
    en: {
      P1: [
        {
          completeWord: "Joyful",
          syllable: ["Joy", "ful"],
          audio: "joyfulM2Eng",
        },
        {
          completeWord: "Brothers",
          syllable: ["Bro", "thers"],
          audio: "brothersM2Eng",
        },
        { completeWord: "Cheer", syllable: ["Che", "er"], audio: "cheerM2Eng" },
        {
          completeWord: "Stitch",
          syllable: ["Sti", "tch"],
          audio: "stichM2Eng",
        },
        {
          completeWord: "Monument",
          syllable: ["Monu", "ment"],
          audio: "monumentM2Eng",
        },
      ],
      P2: [
        {
          completeWord: "Lecturer",
          syllable: ["Lec", "turer"],
          audio: "lecturerM2Eng",
        },
        {
          completeWord: "Curious",
          syllable: ["Cu", "rious"],
          audio: "curiousM2Eng",
        },
        {
          completeWord: "Notebook",
          syllable: ["Note", "book"],
          audio: "notebookM2Eng",
        },
        {
          completeWord: "Grandfather",
          syllable: ["Grand", "father"],
          audio: "grandfatherM2Eng",
        },
        { completeWord: "House", syllable: ["Hou", "se"], audio: "houseM2Eng" },
      ],
      S1: [
        { completeWord: "Rainy", syllable: ["Rai", "ny"] },
        { completeWord: "Picture", syllable: ["Pic", "ture"] },
        { completeWord: "Sunday", syllable: ["Sun", "day"] },
        { completeWord: "Morning", syllable: ["Mor", "ning"] },
        { completeWord: "Evening", syllable: ["Eve", "ning"] },
      ],
      P3: [
        { completeWord: "Sound", syllable: ["Sou", "nd"], audio: "soundM2Eng" },
        { completeWord: "Women", syllable: ["Wo", "men"], audio: "womenM2Eng" },
        { completeWord: "Beach", syllable: ["Bea", "ch"], audio: "beachM2Eng" },
        {
          completeWord: "Jackfruit",
          syllable: ["Jack", "fruit"],
          audio: "jackfruitM2Eng",
        },
        {
          completeWord: "Branch",
          syllable: ["Bra", "nch"],
          audio: "branchM2Eng",
        },
      ],
      P4: [
        {
          completeWord: "Mathematics",
          syllable: ["Mathe", "matics"],
          audio: "mathematicsM2Eng",
        },
        {
          completeWord: "Warriors",
          syllable: ["War", "riors"],
          audio: "warriorsM2Eng",
        },
        {
          completeWord: "Sandcastle",
          syllable: ["Sand", "castle"],
          audio: "sandcastleM2Eng",
        },
        {
          completeWord: "Cooking",
          syllable: ["Cook", "ing"],
          audio: "cookingM2Eng",
        },
        {
          completeWord: "Champion",
          syllable: ["Cham", "pion"],
          audio: "championM2Eng",
        },
      ],
      S2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    hi: {
      P1: [
        {
          completeWord: "पृथ्वी",
          syllable: ["पृथ्", "वी"],
          audio: "prithviM2Hin",
        },
        {
          completeWord: "शिक्षक",
          syllable: ["शिक्ष", "क"],
          audio: "shikshakM2Hin",
        },
        { completeWord: "सर्दी", syllable: ["सर", "दी"], audio: "sardiM2Hin" },
        {
          completeWord: "चिकित्सा",
          syllable: ["चि", "कित्सा"],
          audio: "chikitsaM2Hin",
        },
        {
          completeWord: "मुर्गा",
          syllable: ["मुर", "गा"],
          audio: "murgaM2Hin",
        },
      ],
      P2: [
        {
          completeWord: "बत्तख",
          syllable: ["बत्", "तख"],
          audio: "battakhM2Hin",
        },
        {
          completeWord: "पत्थर",
          syllable: ["पत्", "थर"],
          audio: "pattharM2Hin",
        },
        {
          completeWord: "बिस्किट",
          syllable: ["बिस्", "किट"],
          audio: "biscuitM2Hin",
        },
        {
          completeWord: "कुल्फी",
          syllable: ["कुल", "फी"],
          audio: "kulfiM2Hin",
        },
        {
          completeWord: "बिस्तर",
          syllable: ["बिस्", "तर"],
          audio: "bistarM2Hin",
        },
      ],
      S1: [
        { completeWord: "शिक्षक", syllable: ["Rai", "ny"] },
        { completeWord: "मोबाइल", syllable: ["Pic", "ture"] },
        { completeWord: "बत्तख", syllable: ["Sun", "day"] },
        { completeWord: "पुष्प", syllable: ["Mor", "ning"] },
        { completeWord: "डॉक्टर", syllable: ["Eve", "ning"] },
      ],
      P3: [
        {
          completeWord: "खरगोश",
          syllable: ["खर", "गोश"],
          audio: "khargoshM2Hin",
        },
        {
          completeWord: "फूलदान",
          syllable: ["फूल", "दान"],
          audio: "phooldanM2Hin",
        },
        {
          completeWord: "गिलहरी",
          syllable: ["गिल", "हरी"],
          audio: "gilhariM2Hin",
        },
        {
          completeWord: "इलायची",
          syllable: ["इला", "इची"],
          audio: "elaichiM2Hin",
        },
        {
          completeWord: "खरबूज़ा",
          syllable: ["खर", "बूज़ा"],
          audio: "kharboozaM2Hin",
        },
      ],
      P4: [
        {
          completeWord: "नारियल",
          syllable: ["ना", "रियल"],
          audio: "nariyalM2Hin",
        },
        {
          completeWord: "चॉकलेट",
          syllable: ["चॉक", "लेट"],
          audio: "chocolateM2Hin",
        },
        {
          completeWord: "साइकिल",
          syllable: ["साइ", "किल"],
          audio: "cycleM2Hin",
        },
        {
          completeWord: "फुटबॉल",
          syllable: ["फुट", "बॉल"],
          audio: "footballM2Hin",
        },
        {
          completeWord: "लहसुन",
          syllable: ["लह", "सुन"],
          audio: "lahsunM2Hin",
        },
      ],
      S2: [
        { completeWord: "फूलदान", syllable: ["Cow", "ard"] },
        { completeWord: "चॉकलेट", syllable: ["Lad", "der"] },
        { completeWord: "कृष्ण", syllable: ["Ri", "ver"] },
        { completeWord: "सर्कस", syllable: ["Peo", "ple"] },
        { completeWord: "मिर्च", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    ta: {
      P1: [
        {
          completeWord: "கொட்டை",
          syllable: ["கொ", "ட்டை"],
          audio: "castleM2Tam",
        },
        { completeWord: "தங்கு", syllable: ["தங்", "கு"], audio: "bearM2Tam" },
        { completeWord: "நர்ஸ்", syllable: ["நர்", "ஸ்"], audio: "nurseM2Tam" },
        { completeWord: "லட்டு", syllable: ["லட்", "டு"], audio: "ladduM2Tam" },
        {
          completeWord: "பாட்டு",
          syllable: ["பா", "ட்டு"],
          audio: "songM2Tam",
        },
      ],
      P2: [
        {
          completeWord: "சைக்கிள்",
          syllable: ["சை", "க்கிள்"],
          audio: "cycleM2Tam",
        },
        {
          completeWord: "புட்டி",
          syllable: ["பு", "ட்டி"],
          audio: "bottleM2Tam",
        },
        {
          completeWord: "மிட்டாய்",
          syllable: ["மிட்", "டாய்"],
          audio: "sweetsM2Tam",
        },
        {
          completeWord: "காத்தாடி",
          syllable: ["காத்", "தாடி"],
          audio: "kiteM2Tam",
        },
        {
          completeWord: "வேப்பிலை",
          syllable: ["வேப்", "பிலை"],
          audio: "neemM2Tam",
        },
      ],
      S1: [
        { completeWord: "தங்கு", syllable: ["Rai", "ny"] },
        { completeWord: "புட்டி", syllable: ["Pic", "ture"] },
        { completeWord: "மூன்று", syllable: ["Sun", "day"] },
        { completeWord: "சீப்பு", syllable: ["Mor", "ning"] },
        { completeWord: "உப்பு", syllable: ["Eve", "ning"] },
      ],
      P3: [
        { completeWord: "தொப்பி", syllable: ["தொப்", "பி"], audio: "capM2Tam" },
        {
          completeWord: "பல்லி",
          syllable: ["பல்", "லி"],
          audio: "lizardM2Tam",
        },
        {
          completeWord: "பூண்டு",
          syllable: ["பூண்", "டு"],
          audio: "garlicM2Tam",
        },
        { completeWord: "பெட்டி", syllable: ["பெட்", "டி"], audio: "boxM2Tam" },
        {
          completeWord: "போர்வை",
          syllable: ["போர்", "வை"],
          audio: "blanketM2Tam",
        },
      ],
      P4: [
        {
          completeWord: "குர்தா",
          syllable: ["குர்", "தா"],
          audio: "kurtaM2Tam",
        },
        {
          completeWord: "நெற்றி",
          syllable: ["நெ", "ற்றி"],
          audio: "foreheadM2Tam",
        },
        { completeWord: "பந்து", syllable: ["பன்", "து"], audio: "ballM2Tam" },
        {
          completeWord: "பூட்டு",
          syllable: ["பூ", "ட்டு"],
          audio: "lockM2Tam",
        },
        {
          completeWord: "குச்சி",
          syllable: ["கு", "ச்சி"],
          audio: "stickM2Tam",
        },
      ],
      S2: [
        { completeWord: "பூண்டு", syllable: ["Cow", "ard"] },
        { completeWord: "பந்து", syllable: ["Lad", "der"] },
        { completeWord: "கத்தி", syllable: ["Ri", "ver"] },
        { completeWord: "பாம்பு", syllable: ["Peo", "ple"] },
        { completeWord: "தட்டு", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    kn: {
      P1: [
        { completeWord: "ರವಿ", syllable: ["ರ", "ವಿ"], audio: "Ravi_Sun" },
        {
          completeWord: "ಸಹೋದರ",
          syllable: ["ಸ", "ಹೋದರ"],
          audio: "brotherM2Kan",
        },
        {
          completeWord: "ಬಹುಮಾನ",
          syllable: ["ಬಹು", "ಮಾನ"],
          audio: "prizeM2Kan",
        },
        {
          completeWord: "ಅಲಮಾರು",
          syllable: ["ಅಲ", "ಮಾರು"],
          audio: "almirahM2Kan",
        },
        {
          completeWord: "ಬಾಳೆಕಾಯಿ",
          syllable: ["ಬಾ", "ಳೆಕಾಯಿ"],
          audio: "rawbananaM2Kan",
        },
      ],
      P2: [
        {
          completeWord: "ಕುರ್ಚಿ",
          syllable: ["ಕುರ್", "ಚಿ"],
          audio: "chairM2Kan",
        },
        {
          completeWord: "ವಿಜ್ಞಾನಿ",
          syllable: ["ವಿಜ್", "್ಞಾನಿ"],
          audio: "scientistM2Kan",
        },
        { completeWord: "ಹಸಿರು", syllable: ["ಹಸಿ", "ರು"], audio: "greenKan" },
        {
          completeWord: "ಕ್ಯಾರೆಟ್",
          syllable: ["ಕ್ಯಾ", "ರೆಟ್"],
          audio: "carrotM2Kan",
        },
        {
          completeWord: "ಬೆಳ್ಳುಳ್ಳಿ",
          syllable: ["ಬೆಳ್ಳು", "ಳ್ಳಿ"],
          audio: "garlicM2Kan",
        },
      ],
      S1: [
        { completeWord: "ಸೂರ್ಯ", syllable: ["Rai", "ny"] },
        { completeWord: "ವಾಚ್", syllable: ["Pic", "ture"] },
        { completeWord: "ತರಕಾರಿ", syllable: ["Sun", "day"] },
        { completeWord: "ಗಾಳಿಪಟ", syllable: ["Mor", "ning"] },
        { completeWord: "ದಾಸವಾಳ", syllable: ["Eve", "ning"] },
      ],
      P3: [
        {
          completeWord: "ಸ್ಕೂಟರು",
          syllable: ["ಸ್ಕೂ", "ಟರು"],
          audio: "scooterM2Kan",
        },
        {
          completeWord: "ಪುಸ್ತಕ",
          syllable: ["ಪುಸ್", "ತಕ"],
          audio: "bookM2Kan",
        },
        {
          completeWord: "ಸ್ನಾಯು",
          syllable: ["ಸ್ನಾ", "ಯು"],
          audio: "muscleM2Kan",
        },
        {
          completeWord: "ಶಿಕ್ಷಕ",
          syllable: ["ಶಿಕ್", "ಷಕ"],
          audio: "teacherM2Kan",
        },
        {
          completeWord: "ಪ್ರಾಣಿ",
          syllable: ["ಪ್ರಾ", "ಣಿ"],
          audio: "animalM2Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಪರ್ವತ",
          syllable: ["ಪರ್", "ವತ"],
          audio: "mountainM2Kan",
        },
        { completeWord: "ನೃತ್ಯ", syllable: ["ನೃ", "ತ್ಯ"], audio: "danceM2Kan" },
        { completeWord: "ಮನುಷ್ಯ", syllable: ["ಮನು", "ಷ್ಯ"], audio: "manM2Kan" },
        {
          completeWord: "ಕ್ಷೌರಿಕ",
          syllable: ["ಕ್ಷೌ", "ರಿಕ"],
          audio: "barberM2Kan",
        },
        {
          completeWord: "ಜೀಬ್ರಾ",
          syllable: ["ಜೀ", "ಬ್ರಾ"],
          audio: "zebraM2Kan",
        },
      ],
      S2: [
        { completeWord: "ಉಣ್ಣೆ", syllable: ["Cow", "ard"] },
        { completeWord: "ಕತ್ತೆ", syllable: ["Lad", "der"] },
        { completeWord: "ಪುಸ್ತಕ", syllable: ["Ri", "ver"] },
        { completeWord: "ಬೆಕ್ಕು", syllable: ["Peo", "ple"] },
        { completeWord: "ಜೀಬ್ರಾ", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    te: {
      P1: [
        { completeWord: "పక్షి", syllable: ["ప", "క్షి"], audio: "birdM2Tel" },
        {
          completeWord: "బొప్పాయి",
          syllable: ["బొ", "ప్పాయి"],
          audio: "papayaM2Tel",
        },
        {
          completeWord: "కుమ్మరి",
          syllable: ["కుమ్", "మరి"],
          audio: "potterM2Tel",
        },
        {
          completeWord: "చాకలెట్టు",
          syllable: ["చా", "కలెట్టు"],
          audio: "chocolateM2Tel",
        },
        {
          completeWord: "ఉల్లిపాయ",
          syllable: ["ఉల్లి", "పాయ"],
          audio: "onionM2Tel",
        },
      ],
      P2: [
        {
          completeWord: "జీబ్రా",
          syllable: ["జీ", "బ్రా"],
          audio: "zebraM2Tel",
        },
        {
          completeWord: "దానిమ్మ",
          syllable: ["దా", "నిమ్మ"],
          audio: "pomegranateM2Tel",
        },
        { completeWord: "అంగడి", syllable: ["అం", "గడి"], audio: "shopM2Tel" },
        {
          completeWord: "నొప్పి",
          syllable: ["నొ", "ప్పి"],
          audio: "painM2Tel",
        },
        {
          completeWord: "బియ్యం",
          syllable: ["బియ్", "యం"],
          audio: "riceM2Tel",
        },
      ],
      S1: [
        { completeWord: "తేనెటీగ", syllable: ["తేనె", "టీగ"] },
        { completeWord: "పన్ను", syllable: ["పన్", "ను"] },
        { completeWord: "ముక్కు", syllable: ["ముక్", "కు"] },
        { completeWord: "చొక్కా", syllable: ["చొ", "క్కా"] },
        { completeWord: "పిల్లి", syllable: ["పిల్", "లి"] },
      ],
      P3: [
        {
          completeWord: "దువ్వెన",
          syllable: ["దు", "వ్వెన"],
          audio: "combM2Tel",
        },
        {
          completeWord: "జీలకర్ర",
          syllable: ["జీ", "లకర్ర"],
          audio: "cuminjeeraM2Tel",
        },
        {
          completeWord: "ఉయ్యాల",
          syllable: ["ఉ", "య్యాల"],
          audio: "swingM2Tel",
        },
        {
          completeWord: "గొర్రె",
          syllable: ["గొ", "ర్రె"],
          audio: "sheepM2Tel",
        },
        {
          completeWord: "గిన్నె",
          syllable: ["గి", "న్నె"],
          audio: "vesselM2Tel",
        },
      ],
      P4: [
        {
          completeWord: "కత్తెర",
          syllable: ["కత్", "తెర"],
          audio: "scissorsM2Tel",
        },
        {
          completeWord: "అబ్బాయి",
          syllable: ["అబ్", "బాయి"],
          audio: "boyM2Tel",
        },
        {
          completeWord: "మల్లె",
          syllable: ["మల్", "లె"],
          audio: "jasmineM2Tel",
        },
        { completeWord: "ఖడ్గం", syllable: ["ఖడ్", "గం"], audio: "swordM2Tel" },
        { completeWord: "పెట్టె", syllable: ["పె", "ట్టె"], audio: "boxM2Tel" },
      ],
      S2: [
        { completeWord: "గొడ్డలి", syllable: ["గొడ్", "డలి"] },
        { completeWord: "అత్తి", syllable: ["అత్", "తి"] },
        { completeWord: "కొబ్బరి", syllable: ["కొబ్", "బరి"] },
        { completeWord: "సున్నం", syllable: ["సున్", "నం"] },
        { completeWord: "సుత్తి", syllable: ["సుత్", "తి"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    gu: {
      P1: [
        { completeWord: "ಸೂರ್ಯ", syllable: ["ಸೂ", "ರ್ಯ"], audio: "sunM2Kan" },
        {
          completeWord: "ಸಹೋದರ",
          syllable: ["ಸ", "ಹೋದರ"],
          audio: "brotherM2Kan",
        },
        {
          completeWord: "ಬಹುಮಾನ",
          syllable: ["ಬಹು", "ಮಾನ"],
          audio: "prizeM2Kan",
        },
        {
          completeWord: "ಅಲಮಾರು",
          syllable: ["ಅಲ", "ಮಾರು"],
          audio: "almirahM2Kan",
        },
        {
          completeWord: "ಬಾಳೆಕಾಯಿ",
          syllable: ["ಬಾ", "ಳೆಕಾಯಿ"],
          audio: "rawbananaM2Kan",
        },
      ],
      P2: [
        {
          completeWord: "ಕುರ್ಚಿ",
          syllable: ["ಕುರ್", "ಚಿ"],
          audio: "chairM2Kan",
        },
        {
          completeWord: "ವಿಜ್ಞಾನಿ",
          syllable: ["ವಿಜ್", "್ಞಾನಿ"],
          audio: "scientistM2Kan",
        },
        { completeWord: "ವಾಚ್", syllable: ["ವಾ", "ಚ್"], audio: "watchM2Kan" },
        {
          completeWord: "ಕ್ಯಾರೆಟ್",
          syllable: ["ಕ್ಯಾ", "ರೆಟ್"],
          audio: "carrotM2Kan",
        },
        {
          completeWord: "ಬೆಳ್ಳುಳ್ಳಿ",
          syllable: ["ಬೆಳ್ಳು", "ಳ್ಳಿ"],
          audio: "garlicM2Kan",
        },
      ],
      S1: [
        { completeWord: "Rainy", syllable: ["Rai", "ny"] },
        { completeWord: "Picture", syllable: ["Pic", "ture"] },
        { completeWord: "Sunday", syllable: ["Sun", "day"] },
        { completeWord: "Morning", syllable: ["Mor", "ning"] },
        { completeWord: "Evening", syllable: ["Eve", "ning"] },
      ],
      P3: [
        {
          completeWord: "ಸ್ಕೂಟರು",
          syllable: ["ಸ್ಕೂ", "ಟರು"],
          audio: "scooterM2Kan",
        },
        {
          completeWord: "ಪುಸ್ತಕ",
          syllable: ["ಪುಸ್", "ತಕ"],
          audio: "bookM2Kan",
        },
        {
          completeWord: "ಸ್ನಾಯು",
          syllable: ["ಸ್ನಾ", "ಯು"],
          audio: "muscleM2Kan",
        },
        {
          completeWord: "ಶಿಕ್ಷಕ",
          syllable: ["ಶಿಕ್", "ಷಕ"],
          audio: "teacherM2Kan",
        },
        {
          completeWord: "ಪ್ರಾಣಿ",
          syllable: ["ಪ್ರಾ", "ಣಿ"],
          audio: "animalM2Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಪರ್ವತ",
          syllable: ["ಪರ್", "ವತ"],
          audio: "mountainM2Kan",
        },
        { completeWord: "ನೃತ್ಯ", syllable: ["ನೃ", "ತ್ಯ"], audio: "danceM2Kan" },
        { completeWord: "ಮನುಷ್ಯ", syllable: ["ಮನು", "ಷ್ಯ"], audio: "manM2Kan" },
        {
          completeWord: "ಕ್ಷೌರಿಕ",
          syllable: ["ಕ್ಷೌ", "ರಿಕ"],
          audio: "barberM2Kan",
        },
        {
          completeWord: "ಜೀಬ್ರಾ",
          syllable: ["ಜೀ", "ಬ್ರಾ"],
          audio: "zebraM2Kan",
        },
      ],
      S2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
    or: {
      P1: [
        { completeWord: "ಸೂರ್ಯ", syllable: ["ಸೂ", "ರ್ಯ"], audio: "sunM2Kan" },
        {
          completeWord: "ಸಹೋದರ",
          syllable: ["ಸ", "ಹೋದರ"],
          audio: "brotherM2Kan",
        },
        {
          completeWord: "ಬಹುಮಾನ",
          syllable: ["ಬಹು", "ಮಾನ"],
          audio: "prizeM2Kan",
        },
        {
          completeWord: "ಅಲಮಾರು",
          syllable: ["ಅಲ", "ಮಾರು"],
          audio: "almirahM2Kan",
        },
        {
          completeWord: "ಬಾಳೆಕಾಯಿ",
          syllable: ["ಬಾ", "ಳೆಕಾಯಿ"],
          audio: "rawbananaM2Kan",
        },
      ],
      P2: [
        {
          completeWord: "ಕುರ್ಚಿ",
          syllable: ["ಕುರ್", "ಚಿ"],
          audio: "chairM2Kan",
        },
        {
          completeWord: "ವಿಜ್ಞಾನಿ",
          syllable: ["ವಿಜ್", "್ಞಾನಿ"],
          audio: "scientistM2Kan",
        },
        { completeWord: "ವಾಚ್", syllable: ["ವಾ", "ಚ್"], audio: "watchM2Kan" },
        {
          completeWord: "ಕ್ಯಾರೆಟ್",
          syllable: ["ಕ್ಯಾ", "ರೆಟ್"],
          audio: "carrotM2Kan",
        },
        {
          completeWord: "ಬೆಳ್ಳುಳ್ಳಿ",
          syllable: ["ಬೆಳ್ಳು", "ಳ್ಳಿ"],
          audio: "garlicM2Kan",
        },
      ],
      S1: [
        { completeWord: "Rainy", syllable: ["Rai", "ny"] },
        { completeWord: "Picture", syllable: ["Pic", "ture"] },
        { completeWord: "Sunday", syllable: ["Sun", "day"] },
        { completeWord: "Morning", syllable: ["Mor", "ning"] },
        { completeWord: "Evening", syllable: ["Eve", "ning"] },
      ],
      P3: [
        {
          completeWord: "ಸ್ಕೂಟರು",
          syllable: ["ಸ್ಕೂ", "ಟರು"],
          audio: "scooterM2Kan",
        },
        {
          completeWord: "ಪುಸ್ತಕ",
          syllable: ["ಪುಸ್", "ತಕ"],
          audio: "bookM2Kan",
        },
        {
          completeWord: "ಸ್ನಾಯು",
          syllable: ["ಸ್ನಾ", "ಯು"],
          audio: "muscleM2Kan",
        },
        {
          completeWord: "ಶಿಕ್ಷಕ",
          syllable: ["ಶಿಕ್", "ಷಕ"],
          audio: "teacherM2Kan",
        },
        {
          completeWord: "ಪ್ರಾಣಿ",
          syllable: ["ಪ್ರಾ", "ಣಿ"],
          audio: "animalM2Kan",
        },
      ],
      P4: [
        {
          completeWord: "ಪರ್ವತ",
          syllable: ["ಪರ್", "ವತ"],
          audio: "mountainM2Kan",
        },
        { completeWord: "ನೃತ್ಯ", syllable: ["ನೃ", "ತ್ಯ"], audio: "danceM2Kan" },
        { completeWord: "ಮನುಷ್ಯ", syllable: ["ಮನು", "ಷ್ಯ"], audio: "manM2Kan" },
        {
          completeWord: "ಕ್ಷೌರಿಕ",
          syllable: ["ಕ್ಷೌ", "ರಿಕ"],
          audio: "barberM2Kan",
        },
        {
          completeWord: "ಜೀಬ್ರಾ",
          syllable: ["ಜೀ", "ಬ್ರಾ"],
          audio: "zebraM2Kan",
        },
      ],
      S2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L1: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L2: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L3: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
      L4: [
        { completeWord: "Coward", syllable: ["Cow", "ard"] },
        { completeWord: "Ladder", syllable: ["Lad", "der"] },
        { completeWord: "River", syllable: ["Ri", "ver"] },
        { completeWord: "People", syllable: ["Peo", "ple"] },
        { completeWord: "Silver", syllable: ["Sil", "ver"] },
      ],
    },
  };

  const levelThree = {
    en: {
      P1: [
        { completeWord: "I run.", syllable: ["I", "run."], audio: "iRun" },
        {
          completeWord: "We play.",
          syllable: ["We", "play."],
          audio: "wePlay",
        },
        {
          completeWord: "She reads.",
          syllable: ["She", "reads."],
          audio: "sheReads",
        },
        {
          completeWord: "He eats.",
          syllable: ["He", "eats."],
          audio: "heEats",
        },
        {
          completeWord: "They jump.",
          syllable: ["They", "jump."],
          audio: "theyJump",
        },
      ],
      P2: [
        {
          completeWord: "We walk.",
          syllable: ["We", "walk."],
          audio: "weWalk",
        },
        {
          completeWord: "I sleep.",
          syllable: ["I", "sleep."],
          audio: "iSleep",
        },
        {
          completeWord: "You swim.",
          syllable: ["You", "swim."],
          audio: "youSwim",
        },
        {
          completeWord: "She sings.",
          syllable: ["She", "sings."],
          audio: "sheSings",
        },
        {
          completeWord: "He dances.",
          syllable: ["He", "dances."],
          audio: "heDances",
        },
      ],
      P3: [
        {
          completeWord: "It rains.",
          syllable: ["It", "rains."],
          audio: "itRains",
        },
        { completeWord: "We win.", syllable: ["We", "win."], audio: "weWin" },
        {
          completeWord: "You cook.",
          syllable: ["You", "cook."],
          audio: "youCook",
        },
        {
          completeWord: "They laugh.",
          syllable: ["They", "laugh."],
          audio: "theyLaugh",
        },
        {
          completeWord: "I dream.",
          syllable: ["I", "dream."],
          audio: "iDream",
        },
      ],
      P4: [
        {
          completeWord: "You learn.",
          syllable: ["You", "learn."],
          audio: "youLearn",
        },
        {
          completeWord: "We talk.",
          syllable: ["We", "talk."],
          audio: "weTalks",
        },
        {
          completeWord: "He listens.",
          syllable: ["He", "listens."],
          audio: "heListens",
        },
        {
          completeWord: "She smiles.",
          syllable: ["She", "smiles."],
          audio: "sheSmiles",
        },
        {
          completeWord: "Birds fly.",
          syllable: ["Birds", "fly."],
          audio: "birdsFly",
        },
      ],
      S1: [
        { completeWord: "Cats meow.", syllable: ["Cats", "meow."] },
        { completeWord: "Dogs bark.", syllable: ["Dogs", "bark."] },
        { completeWord: "Fish swims.", syllable: ["Fish", "swims."] },
        { completeWord: "The sun shines.", syllable: ["Sun", "shines."] },
        { completeWord: "Stars twinkle.", syllable: ["Stars", "twinkle."] },
      ],
      S2: [
        { completeWord: "Baby cries.", syllable: ["Baby", "cries."] },
        { completeWord: "Fire burns.", syllable: ["Fire", "burns."] },
        { completeWord: "Flowers bloom.", syllable: ["Flowers", "bloom."] },
        { completeWord: "Wind blows.", syllable: ["Wind", "blows."] },
        { completeWord: "Bells ring.", syllable: ["Bells", "ring."] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
    hi: {
      P1: [
        {
          completeWord: "शहर का बग़ीचा",
          syllable: ["शहर का", "बग़ीचा"],
          audio: "shaharkabageechaM3Hin",
        },
        {
          completeWord: "खेतों की सैर",
          syllable: ["खेतों की", "सैर"],
          audio: "khetonkisairM3Hin",
        },
        {
          completeWord: "इकट्ठा करना",
          syllable: ["इकट्ठा", "करना"],
          audio: "ikathhakarnaM3Hin",
        },
        {
          completeWord: "हवाई अड्डा",
          syllable: ["हवाई", "अड्डा"],
          audio: "hawaiaddaM3Hin",
        },
        {
          completeWord: "ऑटो रिक्शा",
          syllable: ["ऑटो", "रिक्शा"],
          audio: "autorickshawM3Hin",
        },
      ],
      P2: [
        {
          completeWord: "शयन कक्ष",
          syllable: ["शयन", "कक्ष"],
          audio: "shayankakshM3Hin",
        },
        {
          completeWord: "ब्रश करना",
          syllable: ["ब्रश", "करना"],
          audio: "brushkarnaM3Hin",
        },
        {
          completeWord: "माचिस की डिब्बी",
          syllable: ["माचिस की", "डिब्बी"],
          audio: "machiskidibbiM3Hin",
        },
        {
          completeWord: "लोहे का बक्सा",
          syllable: ["लोहे का", "बक्सा"],
          audio: "lohekabaksaM3Hin",
        },
        {
          completeWord: "बड़ों को प्रणाम",
          syllable: ["बड़ों को", "प्रणाम"],
          audio: "badonkopranamM3Hin",
        },
      ],
      P3: [
        {
          completeWord: "आधी रात",
          syllable: ["आधी", "रात"],
          audio: "aadhiraatM3Hin",
        },
        {
          completeWord: "उदास करना",
          syllable: ["उदास", "करना"],
          audio: "udaaskarnaM3Hin",
        },
        {
          completeWord: "सूख जाना",
          syllable: ["सूख", "जाना"],
          audio: "sookhjanaM3Hin",
        },
        {
          completeWord: "तैयार करना",
          syllable: ["तैयार", "करना"],
          audio: "taiyarkarnaM3Hin",
        },
        {
          completeWord: "कितने बजे हैं?",
          syllable: ["कितने", "बजे हैं?"],
          audio: "kitnebajehainM3Hin",
        },
      ],
      P4: [
        {
          completeWord: "चिड़िया छोटी है",
          syllable: ["चिड़िया", "छोटी है"],
          audio: "chidiyachhotihaiM3Hin",
        },
        {
          completeWord: "प्रतीक्षा करना",
          syllable: ["प्रतीक्षा", "करना"],
          audio: "prateekshakarnaM3Hin",
        },
        {
          completeWord: "तुम्हारा मित्र",
          syllable: ["तुम्हारा", "मित्र"],
          audio: "tumharamitraM3Hin",
        },
        {
          completeWord: "स्कूल की छुट्टी",
          syllable: ["स्कूल की", "छुट्टी"],
          audio: "schoolkichhuttiM3Hin",
        },
        {
          completeWord: "आशीर्वाद देना",
          syllable: ["आशीर्वाद", "देना"],
          audio: "aashirvaaddenaM3Hin",
        },
      ],
      S1: [
        { completeWord: "गपशप", syllable: ["गप", "शप"] },
        { completeWord: "गरम करना", syllable: ["गरम", "करना"] },
        { completeWord: "वजन करना", syllable: ["वजन", "करना"] },
        { completeWord: "बंद करना", syllable: ["बंद", "करना"] },
        { completeWord: "चोट लगना", syllable: ["चोट", "लगना"] },
      ],
      S2: [
        { completeWord: "आनंद करना", syllable: ["आनंद", "करना"] },
        { completeWord: "पीछा करना", syllable: ["पीछा", "करना"] },
        { completeWord: "परिचय करना", syllable: ["परिचय", "करना"] },
        { completeWord: "पशु चराना", syllable: ["पशु", "चराना"] },
        { completeWord: "मोटर गाड़ी", syllable: ["मोटर", "गाड़ी"] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
    ta: {
      P1: [
        {
          completeWord: "ஈர மண்",
          syllable: ["ஈர", "மண்"],
          audio: "wetsoilM3Tam",
        },
        {
          completeWord: "உடல்நிலை குறைவு",
          syllable: ["உடல்நிலை", "குறைவு"],
          audio: "poorhealthM3Tam",
        },
        {
          completeWord: "சுவையான உணவு",
          syllable: ["சுவையான", "உணவு"],
          audio: "adeliciousmealM3Tam",
        },
        {
          completeWord: "அவன் பால் குடித்தான்",
          syllable: ["அவன் பால்", "குடித்தான்"],
          audio: "hedrankmilkM3Tam",
        },
        {
          completeWord: "அவள் பூக்களைப் பறித்தாள்",
          syllable: ["அவள் பூக்களைப்", "பறித்தாள்"],
          audio: "shepickedflowersM3Tam",
        },
      ],
      P2: [
        {
          completeWord: "நாய் குரைக்கிறது",
          syllable: ["நாய்", "குரைக்கிறது"],
          audio: "thedogisbarkingM3Tam",
        },
        {
          completeWord: "நன்றி நண்பா",
          syllable: ["நன்றி", "நண்பா"],
          audio: "thankyoufriendM3Tam",
        },
        {
          completeWord: "நான் வருகிறேன்",
          syllable: ["நான்", "வருகிறேன்"],
          audio: "iamcomingM3Tam",
        },
        {
          completeWord: "தவளை வந்தது",
          syllable: ["தவளை", "வந்தது"],
          audio: "thefrogcameM3Tam",
        },
        {
          completeWord: "ஒரு கழுதை வந்தது",
          syllable: ["ஒரு கழுதை", "வந்தது"],
          audio: "adonkeycameM3Tam",
        },
      ],
      P3: [
        {
          completeWord: "நெய் தோசை",
          syllable: ["நெய்", "தோசை"],
          audio: "gheedosaM3Tam",
        },
        {
          completeWord: "அவன் தண்ணீர் குடித்தான்",
          syllable: ["அவன் தண்ணீர்", "குடித்தான்"],
          audio: "hedrankwaterM3Tam",
        },
        {
          completeWord: "யானை பிளிறும்",
          syllable: ["யானை", "பிளிறும்"],
          audio: "elephantroarsM3Tam",
        },
        {
          completeWord: "அவர் அதை ஏழைகளுக்கு கொடுத்தார்",
          syllable: ["அவர் அதை", "ஏழைகளுக்கு கொடுத்தார்"],
          audio: "hegaveittothepoorM3Tam",
        },
        {
          completeWord: "பாடல் பாடுதல்",
          syllable: ["பாடல்", "பாடுதல்"],
          audio: "singingasongM3Tam",
        },
      ],
      P4: [
        {
          completeWord: "ஆமை வந்தது",
          syllable: ["ஆமை", "வந்தது"],
          audio: "theturtlecameM3Tam",
        },
        {
          completeWord: "புழு வந்தது",
          syllable: ["புழு", "வந்தது"],
          audio: "thewormcameM3Tam",
        },
        {
          completeWord: "முத்துச் சிப்பிபோல",
          syllable: ["முத்துச்", "சிப்பிபோல"],
          audio: "likeapearlM3Tam",
        },
        {
          completeWord: "தேனீ",
          syllable: ["தே", "னீ"],
          audio: "honeybeeM3Tam",
        },
        {
          completeWord: "சக்கரமும் சுழன்றோட",
          syllable: ["சக்கரமும்", "சுழன்றோட"],
          audio: "thewheelisspinningM3Tam",
        },
      ],
      S1: [
        { completeWord: "ஊஞ்சலிலே ஆடலாம்", syllable: ["ஊஞ்சலிலே", "ஆடலாம்"] },
        {
          completeWord: "ஆற்றில் நீந்தும் ஆமை",
          syllable: ["ஆற்றில்", "நீந்தும் ஆமை"],
        },
        { completeWord: "எஃகு வாள்", syllable: ["எஃகு", "வாள்"] },
        {
          completeWord: "அண்ணன் கையில் அலைபேசி",
          syllable: ["அண்ணன் கையில்", "அலைபேசி"],
        },
        {
          completeWord: "ஓரம் நிற்கும் ஓடம்",
          syllable: ["ஓரம்", "நிற்கும் ஓடம்"],
        },
      ],
      S2: [
        {
          completeWord: "அம்மா இங்கே வா வா",
          syllable: ["அம்மா", "இங்கே வா வா"],
        },
        {
          completeWord: "ஓதும் செயலே நலமாம்",
          syllable: ["ஓதும்", "செயலே நலமாம்"],
        },
        {
          completeWord: "ஏதும் இங்கே இல்லை",
          syllable: ["ஏதும்", "இங்கே இல்லை"],
        },
        {
          completeWord: "இலையில் சோறு போட்டு",
          syllable: ["இலையில்", "சோறு போட்டு"],
        },
        { completeWord: "பச்சை நிற மொச்சை", syllable: ["பச்சை நிற", "மொச்சை"] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
    kn: {
      P1: [
        {
          completeWord: "ರಾಜನ ಕಿರೀಟ",
          syllable: ["ರಾಜನ", "ಕಿರೀಟ"],
          audio: "kingsCrown",
        },
        {
          completeWord: "ಕೊತ್ತುಂಬರಿ ಸೊಪ್ಪು",
          syllable: ["ಕೊತ್ತುಂಬರಿ", "ಸೊಪ್ಪು"],
          audio: "coriander",
        },
        {
          completeWord: "ಅದು ಎರೆಹುಳು",
          syllable: ["ಅದು", "ಎರೆಹುಳು"],
          audio: "thatIsEarthworm",
        },
        {
          completeWord: "ಮಲಗುವ ಕೋಣೆ",
          syllable: ["ಮಲಗುವ", "ಕೋಣೆ"],
          audio: "bedRoom",
        },
        {
          completeWord: "ಕಸದ ಬುಟ್ಟಿ",
          syllable: ["ಕಸದ", "ಬುಟ್ಟಿ"],
          audio: "theDustbin",
        },
      ],
      P2: [
        {
          completeWord: "ನಾಯಿ ಓಡುತಿದೆ",
          syllable: ["ನಾಯಿ", "ಓಡುತಿದೆ"],
          audio: "dogIsRunning1",
        },
        {
          completeWord: "ಆಮೆ ಈಜುವುದು",
          syllable: ["ಆಮೆ", "ಈಜುವುದು"],
          audio: "turtleSwims",
        },
        {
          completeWord: "ಚೆಂಡು ಎಸೆದನು",
          syllable: ["ಚೆಂಡು", "ಎಸೆದನು"],
          audio: "throwedballKan",
        },
        {
          completeWord: "ಫೌಂಟನ್ ಪೆನ್ನು",
          syllable: ["ಫೌಂಟನ್", "ಪೆನ್ನು"],
          audio: "aFountainPen",
        },
        {
          completeWord: "ವಿಮಾನ ನಿಲ್ದಾಣ",
          syllable: ["ವಿಮಾನ", "ನಿಲ್ದಾಣ"],
          audio: "airport",
        },
      ],
      P3: [
        {
          completeWord: "ಮಂಗನ ಬಾಲ",
          syllable: ["ಮಂಗನ", "ಬಾಲ"],
          audio: "monkeysTail",
        },
        {
          completeWord: "ಐದು ಬಳೆಗಳು",
          syllable: ["ಐದು", "ಬಳೆಗಳು"],
          audio: "fiveBangles",
        },
        {
          completeWord: "ಕಮಲ ಈಜಿದಳು",
          syllable: ["ಕಮಲ", "ಈಜಿದಳು"],
          audio: "kamalaIsSwimming",
        },
        {
          completeWord: "ಹುಲಿ ಬಂತು, ಹುಲಿ!",
          syllable: ["ಹುಲಿ ಬಂತು", "ಹುಲಿ!"],
          audio: "tigerCameTiger",
        },
        {
          completeWord: "ಹರಳಿನ ಉಂಗುರ",
          syllable: ["ಹರಳಿನ", "ಉಂಗುರ"],
          audio: "stoneFingerRing",
        },
      ],
      P4: [
        {
          completeWord: "ಆಗಸದ ತಾರೆ",
          syllable: ["ಆಗಸದ", "ತಾರೆ"],
          audio: "starsInTheSky",
        },
        {
          completeWord: "ಹೂವಿನ ತೋಟ",
          syllable: ["ಹೂವಿನ", "ತೋಟ"],
          audio: "flowerArcade",
        },
        {
          completeWord: "ನೀಲಿಯ ಆಕಾಶ",
          syllable: ["ನೀಲಿಯ", "ಆಕಾಶ"],
          audio: "blueSky",
        },
        {
          completeWord: "ಹೂವಿನ ಎಸಳು",
          syllable: ["ಹೂವಿನ", "ಎಸಳು"],
          audio: "petalsOfAFlower",
        },
        {
          completeWord: "ಅರಸನ ಅರಮನೆ",
          syllable: ["ಅರಸನ", "ಅರಮನೆ"],
          audio: "kingsPalace",
        },
      ],
      S1: [
        { completeWord: "ಅಂದದ ಸರ", syllable: ["ಅಂದದ", "ಸರ"] },
        { completeWord: "ಚಂದಿರ ಬಂದ", syllable: ["ಚಂದಿರ", "ಬಂದ"] },
        { completeWord: "ಮರ ಒಣಗಿದೆ", syllable: ["ಮರ", "ಒಣಗಿದೆ"] },
        { completeWord: "ಅದು ಗುಡಿ", syllable: ["ಅದು", "ಗುಡಿ"] },
        { completeWord: "ಚೆಂಡು ಹೂ", syllable: ["ಚೆಂಡು", "ಹೂ"] },
      ],
      S2: [
        { completeWord: "ಮಾವಿನ ಮರ", syllable: ["ಮಾವಿನ", "ಮರ"] },
        { completeWord: "ಗೆಳೆಯರ ಮಾತುಕತೆ", syllable: ["ಗೆಳೆಯರ", "ಮಾತುಕತೆ"] },
        { completeWord: "ಇದು ಮಸೀದಿ", syllable: ["ಇದು", "ಮಸೀದಿ"] },
        { completeWord: "ಉದಯನ ಮನೆ", syllable: ["ಉದಯನ", "ಮನೆ"] },
        { completeWord: "ಖೋ ಖೋ ಆಟ", syllable: ["ಖೋ ಖೋ", "ಆಟ"] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
    te: {
      P1: [
        {
          completeWord: "పసుపురంగు పూవు",
          syllable: ["పసుపురంగు", "పూవు"],
          audio: "yellowFlower",
        },
        {
          completeWord: "అన్నం తినడం",
          syllable: ["అన్నం", "తినడం"],
          audio: "eatingRice",
        },
        {
          completeWord: "గూడు కట్టింది",
          syllable: ["గూడు", "కట్టింది"],
          audio: "birdsMadeNest",
        },
        {
          completeWord: "పచ్చి గడ్డి",
          syllable: ["పచ్చి", "గడ్డి"],
          audio: "greenGrass",
        },
        {
          completeWord: "అందమైన ఇల్లు",
          syllable: ["అందమైన", "ఇల్లు"],
          audio: "beautifulHouse",
        },
      ],
      P2: [
        {
          completeWord: "మీసాల తాతయ్య",
          syllable: ["మీసాల", "తాతయ్య"],
          audio: "mustacheGrandfather",
        },
        {
          completeWord: "మామిడి చెట్టు",
          syllable: ["మామిడి", "చెట్టు"],
          audio: "mangoTree",
        },
        {
          completeWord: "నువ్వు ఆలోచించు",
          syllable: ["నువ్వు", "ఆలోచించు"],
          audio: "youThink",
        },
        {
          completeWord: "అటవీ చెట్లు",
          syllable: ["అటవీ", "చెట్లు"],
          audio: "forestTrees",
        },
        {
          completeWord: "ఇస్త్రీ పెట్టె",
          syllable: ["ఇస్త్రీ", "పెట్టె"],
          audio: "ironingBox",
        },
      ],
      P3: [
        {
          completeWord: "నీలిరంగు చీర",
          syllable: ["నీలిరంగు", "చీర"],
          audio: "blueSaree",
        },
        {
          completeWord: "పరుగు తీసింది",
          syllable: ["పరుగు", "తీసింది"],
          audio: "runningTookIt",
        },
        {
          completeWord: "గాజు కప్పు",
          syllable: ["గాజు", "కప్పు"],
          audio: "glassCup",
        },
        {
          completeWord: "రంగోలి వేయండి",
          syllable: ["రంగోలి", "వేయండి"],
          audio: "rangoliPutIt",
        },
        {
          completeWord: "పతంగి చేసింది",
          syllable: ["పతంగి", "చేసింది"],
          audio: "makingKite",
        },
      ],
      P4: [
        {
          completeWord: "చెత్త కుండీ",
          syllable: ["చెత్త", "కుండీ"],
          audio: "garbagePot",
        },
        {
          completeWord: "అది బొప్పాయి",
          syllable: ["అది", "బొప్పాయి"],
          audio: "thatPapaya",
        },
        {
          completeWord: "తల దువ్వుకోవడం",
          syllable: ["తల", "దువ్వుకోవడం"],
          audio: "headCombing",
        },
        {
          completeWord: "ఎర్రనైన టమాట",
          syllable: ["ఎర్రనైన", "టమాట"],
          audio: "redTomato",
        },
        {
          completeWord: "పులి వచ్చింది, పులి",
          syllable: ["పులి వచ్చింది", "పులి"],
          audio: "tigerHereItComes",
        },
      ],
      S1: [
        { completeWord: "ఒక చీమ", syllable: ["ఒక", "చీమ"] },
        { completeWord: "మొండి బండ", syllable: ["మొండి", "బండ"] },
        { completeWord: "గీతల అంగి", syllable: ["గీతల", "అంగి"] },
        { completeWord: "నెమలి ఈక", syllable: ["నెమలి", "ఈక"] },
        { completeWord: "పాప ఆడింది", syllable: ["పాప", "ఆడింది"] },
      ],
      S2: [
        { completeWord: "పాట వినండి", syllable: ["పాట", "వినండి"] },
        { completeWord: "రతనాల ఉంగరం", syllable: ["రతనాల", "ఉంగరం"] },
        { completeWord: "మిరప పొడి", syllable: ["మిరప", "పొడి"] },
        { completeWord: "ఇది మసీదు", syllable: ["ఇది", "మసీదు"] },
        { completeWord: "ఏనుగు తోక", syllable: ["ఏనుగు", "తోక"] },
      ],
      L1: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L2: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L3: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
      L4: [
        { completeWord: "I run.", syllable: ["I", "run."] },
        { completeWord: "We play.", syllable: ["We", "play."] },
        { completeWord: "She reads.", syllable: ["She", "reads."] },
        { completeWord: "He eats.", syllable: ["He", "eats."] },
        { completeWord: "They jump.", syllable: ["They", "jump."] },
      ],
    },
  };

  const handleComplete = (nextStep) => {
    setRStep(nextStep);
    setLocalData("rStep", nextStep);
  };

  let progressDatas = getLocalData("practiceProgress");
  const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.title || "P1";

  //console.log("prog", progressDatas);

  const rFlow = String(getLocalData("rFlow"));
  const tFlow = String(getLocalData("tFlow"));

  // useEffect(() => {
  //   if (lang !== "en") {
  //     setLocalData("rFlow", false);
  //   }
  // }, [lang]);

  // useEffect(() => {
  //   setLocalData("rFlow", true)
  // }, []);

  useEffect(() => {
    //console.log("levelsssss", level, rFlow, rStep);

    let currentLevelMap;
    let currentImageMap;

    if (level === 2) {
      currentLevelMap = practiceSteps?.[currentPracticeStep]?.titleNew || "P1";
      currentImageMap =
        practiceSteps[progressData.currentPracticeStep]?.titleNew || "P1";
    } else if (level === 3) {
      currentLevelMap =
        practiceSteps?.[currentPracticeStep]?.titleThree || "P1";
      currentImageMap =
        practiceSteps[progressData.currentPracticeStep]?.titleThree || "P1";
    } else {
      currentLevelMap = practiceSteps?.[currentPracticeStep]?.title || "P1";
      currentImageMap =
        practiceSteps[progressData.currentPracticeStep]?.title || "P1";
    }

    if (
      progressData?.currentPracticeStep !== undefined &&
      progressData?.currentPracticeStep !== null
    ) {
      const selectedLevels =
        level === 2
          ? levelTwo[lang]
          : level === 3
          ? levelThree[lang]
          : levels[lang];

      const levelData = selectedLevels[currentLevelMap];
      const levelImage = selectedLevels[currentImageMap];
      //console.log("levelsNew", level, levelData);
      const currentWord = levelData[currentQuestion];

      setCurrentImage(levelImage[currentQuestion]);
      setParentWords(currentWord?.syllable?.join(" "));
      setLevelOneWord(levelImage[currentQuestion]?.completeWord);
      setRefAudio(levelImage[currentQuestion]?.audio);
    }
  }, [progressData]);

  const gameOver = (data, isUserPass) => {
    const userWon = isUserPass;
    const meetsFluencyCriteria = livesData?.meetsFluencyCriteria;
    setGameOverData({ gameOver: true, userWon, ...data, meetsFluencyCriteria });
  };

  useEffect(() => {
    if (startShowCase) {
      setLivesData({ ...livesData, lives: LIVES });
    }
  }, [startShowCase]);

  const levelCompleteAudioSrc = usePreloadAudio(LevelCompleteAudio);

  const callConfettiAndPlay = () => {
    const audio = new Audio(levelCompleteAudioSrc);
    audio.play();
    callConfetti();
    window.telemetry?.syncEvents && window.telemetry.syncEvents();
  };

  useEffect(() => {
    let currentPracticeStep = progressData.currentPracticeStep;
    let fromBack = progressData.fromBack;
    if (
      questions?.length &&
      Number(currentPracticeStep + 1) > 0 &&
      currentQuestion === 0 &&
      !fromBack
    ) {
      setDisableScreen(true);
      callConfettiAndPlay();

      setTimeout(() => {
        const step = practiceSteps[currentPracticeStep];
        let stepName;

        if (level === 1) {
          stepName = step.fullNameMOne;
        } else if (level === 2) {
          stepName = step.fullNameMTwo;
        } else if (level === 3) {
          stepName = step.fullNameMThree;
        } else {
          stepName = step.fullName;
        }
        setOpenMessageDialog({
          message: `You have successfully completed ${stepName} `,
        });
      }, 1200);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isShowCase) {
      setLocalData("sub_session_id", uniqueId());
    }
  }, [isShowCase]);

  useEffect(() => {
    if (voiceText === "error") {
      setOpenMessageDialog({
        message: "Sorry I couldn't hear a voice. Could you please speak again?",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText === "profanity") {
      setOpenMessageDialog({
        message: `Please speak appropriately.`,
        severity: "warning",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText == "success") {
      setVoiceText("");
    }
  }, [voiceText]);

  const checkFluency = (contentType, fluencyScore) => {
    switch (contentType.toLowerCase()) {
      case "word":
        setFluency(fluencyScore < 2);
        break;
      case "sentence":
        setFluency(fluencyScore < 6);
        break;
      case "paragraph":
        setFluency(fluencyScore < 10);
        break;
      default:
        setFluency(true);
    }
  };

  const handleNext = async (isGameOver) => {
    setIsNextButtonCalled(true);
    setEnableNext(false);
    try {
      const lang = getLocalData("lang");

      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");

      let practiceProgress = getLocalData("practiceProgress");

      if (levelMapping[virtualId] !== undefined) {
        setLevel(levelMapping[virtualId]);
      } else {
        const token = getLocalData("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const emisUsername = String(decoded.emis_username);
            //console.log("emu", emisUsername);

            if (levelMapping[emisUsername] !== undefined) {
              setLevel(levelMapping[emisUsername]);
            }
          } catch (error) {
            console.error("Error decoding JWT token:", error);
          }
        }
      }

      //console.log("Assigned LEVEL:", level);
      const token = getLocalData("token");
      let emisUsername = null;

      if (token) {
        try {
          const decoded = jwtDecode(token);
          emisUsername = String(decoded.emis_username);
          //console.log("emu", emisUsername);
        } catch (error) {
          console.error("Error decoding JWT token:", error);
        }
      }

      let updatedLevel;

      if (levelMapping[virtualId] || levelMapping[emisUsername]) {
        updatedLevel = levelMapping[virtualId] || levelMapping[emisUsername];

        setLevel(updatedLevel);
      }

      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      let currentPracticeStep = "";
      let currentPracticeProgress = "";

      if (practiceProgress) {
        currentPracticeStep = practiceProgress.currentPracticeStep;
        currentPracticeProgress = Math.round(
          ((currentQuestion + 1 + currentPracticeStep * limit) /
            (practiceSteps.length * limit)) *
            100
        );
      }

      let showcasePercentage = ((currentQuestion + 1) * 100) / questions.length;

      let newPracticeStep =
        currentQuestion === questions.length - 1 || isGameOver
          ? currentPracticeStep + 1
          : currentPracticeStep;
      newPracticeStep = Number(newPracticeStep);
      let newQuestionIndex =
        currentQuestion === questions.length - 1 ? 0 : currentQuestion + 1;

      const currentGetContent = getCurrentContent(newPracticeStep);

      const getContentFn = currentGetContent?.mechanism
        ? getContent
        : process.env.REACT_APP_USE_RECOMMENDATION_API === "true"
        ? getContentNew
        : getContent;

      //console.log("cqer", currentQuestion, questions, level);

      // if(updatedLevel === 14){
      //   setCurrentQuestion(currentQuestion + 1);
      // }else{

      if (currentQuestion === questions.length - 1 || isGameOver) {
        let currentPracticeStep = practiceProgress.currentPracticeStep;
        let isShowCase = currentPracticeStep === 4 || currentPracticeStep === 9; // P4 or P8

        if (localStorage.getItem("contentSessionId") !== null) {
          setPoints(1);
          if (isShowCase) {
            sendTestRigScore(5);
          }
        } else {
          let points = 1;
          let milestone = `m${level}`;

          if (points !== 1) {
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
            return;
          }

          const result = await addPointer(points, milestone);
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
        }

        if (isShowCase || isGameOver) {
          const sub_session_id = getLocalData("sub_session_id");
          const getSetResultRes = await getSetResultPractice({
            subSessionId: sub_session_id,
            currentContentType,
            sessionId,
            totalSyllableCount,
            mechanism,
          });
          const { data: getSetData } = getSetResultRes;

          const data = JSON.stringify(getSetData);
          Log(data, "practice", "ET");
          setPercentage(getSetData?.percentage);
          checkFluency(currentContentType, getSetData?.fluency);
          if (process.env.REACT_APP_POST_LEARNER_PROGRESS === "true") {
            await createLearnerProgress(
              sub_session_id,
              getSetData?.currentLevel,
              totalSyllableCount
            );
          }
          //setLocalData("previous_level", getSetData.data.previous_level);
          setLocalData("previous_level", getSetData.previous_level);

          try {
            const lang = getLocalData("lang");
            const getMilestoneDetails = await getFetchMilestoneDetails(lang);
            setVocabCount(
              getMilestoneDetails?.data?.extra?.vocabulary_count || 0
            );
            setWordCount(
              getMilestoneDetails?.data?.extra?.latest_towre_data
                ?.wordsPerMinute || 0
            );
          } catch (e) {
            // catch error
          }

          if (getSetData.sessionResult === "pass") {
            if (
              level === 15 &&
              (currentLevel === "S1" || currentLevel === "S2")
            ) {
              setLocalData("allCompleted", true);
              gameOver({ link: "/assesment-end" }, true);
              return;
            }
            if (lang === "en" && (level === 3 || level === 6 || level === 9)) {
              gameOver({ link: "/assesment-end" }, true);
              setLocalData("tFlow", true);
            }

            try {
              await addLesson({
                sessionId,
                milestone: `practice`,
                lesson: "0",
                progress: 0,
                language: lang,
                milestoneLevel: getSetData.currentLevel,
              });
              gameOver({ link: "/assesment-end" }, true);
              return;
            } catch (e) {
              // catch error
            }
          } else if (currentLevel === "S2" && (level === 1 || level === 2)) {
            setLocalData("mFail", true);
            setTimeout(() => {
              setLocalData("rFlow", true);
            }, 7000);
          }
        }

        let quesArr = [];

        if (newPracticeStep === 10) {
          newPracticeStep = 0;
          currentPracticeProgress = 0;
        }
        await addLesson({
          sessionId: sessionId,
          milestone: `practice`,
          lesson: newPracticeStep,
          progress: currentPracticeProgress,
          language: lang,
          milestoneLevel: `m${level}`,
        });

        if (newPracticeStep === 0 || newPracticeStep === 5 || isGameOver) {
          gameOver();
          return;
        }

        if (![10, 11, 12, 13, 14, 15].includes(level)) {
          const resGetContent = await getContentFn(
            currentGetContent.criteria,
            lang,
            limit,
            {
              mechanismId: currentGetContent?.mechanism?.id,
              competency: currentGetContent?.competency,
              tags: currentGetContent?.tags,
              storyMode: currentGetContent?.storyMode,
              CEFR_level: currentGetContent?.CEFR_level,
            },
            level
          );

          setTotalSyllableCount(resGetContent?.totalSyllableCount);
          setLivesData({
            ...livesData,
            totalTargets: resGetContent?.totalSyllableCount,
            targetsForLives:
              resGetContent?.subsessionTargetsCount * TARGETS_PERCENTAGE,
            targetPerLive:
              (resGetContent?.subsessionTargetsCount * TARGETS_PERCENTAGE) /
              LIVES,
          });

          let showcaseLevel =
            currentPracticeStep === 3 || currentPracticeStep === 8;
          setIsShowCase(showcaseLevel);
          // TODO: API returns contents if 200 status
          quesArr = [...quesArr, ...(resGetContent?.content || [])];
          setCurrentContentType(resGetContent?.content?.[0]?.contentType);
          setCurrentCollectionId(resGetContent?.content?.[0]?.collectionId);

          // // TODO: API returns contents if 200 status
          // quesArr = [...quesArr, ...(resGetContent?.data?.content || [])];
          // setCurrentContentType(resGetContent?.data?.content?.[0]?.contentType);
          // setCurrentCollectionId(
          //   resGetContent?.data?.content?.[0]?.collectionId
          // );

          // TODO: not required - not using this anywhere
          setAssessmentResponse(resGetContent);

          setCurrentQuestion(0);
          // TODO: not required - we are geting this data from API
          practiceProgress = {
            currentQuestion: newQuestionIndex,
            currentPracticeProgress,
            currentPracticeStep: newPracticeStep,
          };
          setLocalData("practiceProgress", JSON.stringify(practiceProgress));
          setProgressData(practiceProgress);
          setLocalData("storyTitle", resGetContent?.name);

          // // TODO: not required - we are geting this data from API
          // practiceProgress = {
          //   currentQuestion: newQuestionIndex,
          //   currentPracticeProgress,
          //   currentPracticeStep: newPracticeStep,
          // };
          // setLocalData("practiceProgress", JSON.stringify(practiceProgress));
          // setProgressData(practiceProgress);
          // localStorage.setItem("storyTitle", resGetContent?.name);

          setQuestions(quesArr);
        }

        if ([10, 11, 12, 13, 14, 15].includes(level)) {
          let showcaseLevel =
            currentPracticeStep === 3 || currentPracticeStep === 8;
          setIsShowCase(showcaseLevel);
          setCurrentQuestion(0);

          practiceProgress = {
            currentQuestion: newQuestionIndex,
            currentPracticeProgress,
            currentPracticeStep: newPracticeStep,
          };
          setLocalData("practiceProgress", JSON.stringify(practiceProgress));
          setProgressData(practiceProgress);

          const dummyQuestions = Array.from({ length: 5 }, (_, i) => ({
            id: `dummy-${i + 1}`,
          }));

          setQuestions(dummyQuestions);
        }

        // TODO: needs to revisit this logic
        setTimeout(() => {
          setMechanism(currentGetContent.mechanism);
        }, 1000);

        // if(virtualId === "6760800019"){
        //   setLevel(12);
        //   //setMechanism({ id: "read_aloud", name: "readAloud" });
        // }

        // if(virtualId === "1621936833"){
        //   setLevel(13);
        //   setMechanism({ id: "r3", name: "r3" });
        // }
        // if(virtualId === "9526496994"){
        //   setLevel(14);
        // }
        // if(virtualId === "7656513916"){
        //   setLevel(4);
        // }
        // if(virtualId === "3464419415"){
        //   setLevel(5);
        // }
        // if(virtualId === "6131132191"){
        //   setLevel(6);
        // }
        // if(virtualId === "8909322850"){
        //   setLevel(7);
        // }

        if (levelMapping[virtualId] !== undefined) {
          setLevel(levelMapping[virtualId]);
        } else {
          const token = getLocalData("token");
          if (token) {
            try {
              const decoded = jwtDecode(token);
              const emisUsername = String(decoded.emis_username);
              //console.log("emu", emisUsername);

              if (levelMapping[emisUsername] !== undefined) {
                setLevel(levelMapping[emisUsername]);
              }
            } catch (error) {
              console.error("Error decoding JWT token:", error);
            }
          }
        }

        //console.log("Assigned LEVEL:", level);
      } else if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);

        practiceProgress = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [temp_audio, set_temp_audio] = useState(null);
  const [audioPlayFlag, setAudioPlayFlag] = useState(true); // base64url of teachertext

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setAudioPlayFlag(!audioPlayFlag);
      temp_audio.addEventListener("ended", () => setAudioPlayFlag(true));
    }
  };

  useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playTeacherAudio = () => {
    const contentId = questions[currentQuestion]?.contentId;
    let audio = new Audio(
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
    );
    audio.addEventListener("canplaythrough", () => {
      set_temp_audio(
        new Audio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
        )
      );
    });
  };

  const fetchDetails = async () => {
    let quesArr = [];
    try {
      setLoading(true);
      const lang = getLocalData("lang");
      const virtualId = getLocalData("virtualId");
      let sessionId = getLocalData("sessionId");

      if (!sessionId) {
        sessionId = uniqueId();
        setLocalData("sessionId", sessionId);
      }
      const getMilestoneDetails = await getFetchMilestoneDetails(lang);

      // TODO: validate the getMilestoneDetails API return
      setLocalData("getMilestone", JSON.stringify({ ...getMilestoneDetails }));
      setVocabCount(getMilestoneDetails?.data?.extra?.vocabulary_count || 0);
      setWordCount(
        getMilestoneDetails?.data?.extra?.latest_towre_data?.wordsPerMinute || 0
      );
      let level =
        Number(getMilestoneDetails?.data?.milestone_level?.replace("m", "")) ||
        1;

      //console.log("curGetCont3", level, getMilestoneDetails);

      setLevel(level);

      const resLessons = await getLessonProgressByID(lang);

      // TODO: Handle Error for lessons - no lesson progress - starting point should be P1

      if (
        process.env.REACT_APP_IS_APP_IFRAME !== "true" &&
        (localStorage.getItem("contentSessionId") !== null ||
          process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true")
      ) {
        fetchUserPoints()
          .then((points) => {
            setPoints(points);
          })
          .catch((error) => {
            console.error("Error fetching user points:", error);
            setPoints(0);
          });
      }

      let userState = Number.isInteger(Number(resLessons?.result?.lesson))
        ? Number(resLessons.result?.lesson)
        : 0;

      // TODO: revisit this - looks like not required
      let practiceProgress = getLocalData("practiceProgress");
      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      practiceProgress = {
        currentQuestion: 0,
        currentPracticeProgress: (userState / practiceSteps.length) * 100,
        currentPracticeStep: userState || 0,
      };

      const getCurrentContent = (stepKey) => {
        const lang = getLocalData("lang") || "en";
        //console.log("curGetCont2", lang, level);
        return levelGetContent[lang]?.[level]?.find(
          (elem) => elem.title === practiceSteps?.[stepKey]?.name
        );
      };

      const currentGetContent = getCurrentContent(userState);

      const getContentFn = currentGetContent?.mechanism
        ? getContent
        : process.env.REACT_APP_USE_RECOMMENDATION_API === "true"
        ? getContentNew
        : getContent;

      //console.log("curGetCont", userState, currentGetContent);

      if (![10, 11, 12, 13, 14, 15].includes(level)) {
        const resWord = await getContentFn(
          currentGetContent.criteria,
          lang,
          limit,
          {
            mechanismId: currentGetContent?.mechanism?.id,
            competency: currentGetContent?.competency,
            tags: currentGetContent?.tags,
            storyMode: currentGetContent?.storyMode,
            CEFR_level: currentGetContent?.CEFR_level,
          },
          level
        );
        // TODO: handle error if resWord is empty

        setTotalSyllableCount(resWord?.totalSyllableCount);
        setLivesData({
          ...livesData,
          totalTargets: resWord?.totalSyllableCount,
          targetsForLives: resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE,
          targetPerLive:
            (resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
        });
        quesArr = [...quesArr, ...(resWord?.content || [])];
        setCurrentContentType(currentGetContent.criteria);

        setCurrentCollectionId(resWord?.content?.[0]?.collectionId);
        setAssessmentResponse(resWord);

        setLocalData("storyTitle", resWord?.name);

        localStorage.setItem("storyTitle", resWord?.name);

        setQuestions(quesArr);
      }

      if ([10, 11, 12, 13, 14, 15].includes(level)) {
        const dummyQuestions = Array.from({ length: 5 }, (_, i) => ({
          id: `dummy-${i + 1}`,
        }));

        setQuestions(dummyQuestions);
      }
      setMechanism(currentGetContent.mechanism);

      // if (virtualId === "6760800019" || level == 12) {
      //   //setMechanism({ id: "read_aloud", name: "readAloud" });
      // }

      // if (virtualId === "1621936833" || level == 13) {
      //   setMechanism({ id: "r3", name: "r3" });
      // }

      let showcaseLevel = userState === 4 || userState === 9;
      setIsShowCase(showcaseLevel);
      if (showcaseLevel) {
        await addLesson({
          sessionId: sessionId,
          milestone: "showcase",
          lesson: userState,
          progress: 0,
          language: lang,
          milestoneLevel: `m${level}`,
        });
      }
      setCurrentQuestion(practiceProgress?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
      setProgressData(practiceProgress);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("err", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    setLocalData("mechanism_id", (mechanism && mechanism.id) || "");
  }, [mechanism]);

  const getCurrentContent = (stepKey) => {
    const lang = getLocalData("lang") || "en";
    //console.log("curGetCont2", lang, level);
    return levelGetContent[lang]?.[level]?.find(
      (elem) => elem.title === practiceSteps?.[stepKey]?.name
    );
  };

  const handleBack = async () => {
    if (progressData.currentPracticeStep > 0) {
      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");
      const lang = getLocalData("lang");
      let practiceProgress = {};
      let newCurrentPracticeStep =
        progressData.currentPracticeStep === 5
          ? 3
          : progressData.currentPracticeStep - 1;
      practiceProgress = {
        currentQuestion: 0,
        currentPracticeProgress:
          (newCurrentPracticeStep / practiceSteps.length) * 100,
        currentPracticeStep: newCurrentPracticeStep,
        fromBack: true,
      };
      await addLesson({
        sessionId: sessionId,
        milestone: "practice",
        lesson: newCurrentPracticeStep,
        progress: (newCurrentPracticeStep / practiceSteps.length) * 100,
        language: lang,
        milestoneLevel: `m${level}`,
      });

      setProgressData(practiceProgress);

      const currentGetContent = getCurrentContent(newCurrentPracticeStep);

      const getContentFn = currentGetContent?.mechanism
        ? getContent
        : process.env.REACT_APP_USE_RECOMMENDATION_API === "true"
        ? getContentNew
        : getContent;

      let quesArr = [];

      if (![10, 11, 12, 13, 14, 15].includes(level)) {
        const resWord = await getContentFn(
          currentGetContent.criteria,
          lang,
          limit,
          {
            mechanismId: currentGetContent?.mechanism?.id,
            competency: currentGetContent?.competency,
            tags: currentGetContent?.tags,
            storyMode: currentGetContent?.storyMode,
            CEFR_level: currentGetContent?.CEFR_level,
          },
          level
        );
        setTotalSyllableCount(resWord?.totalSyllableCount);
        setLivesData({
          ...livesData,
          totalTargets: resWord?.totalSyllableCount,
          targetsForLives: resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE,
          targetPerLive:
            (resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
        });
        quesArr = [...quesArr, ...(resWord?.content || [])];
        setCurrentContentType(currentGetContent.criteria);
        setCurrentCollectionId(resWord?.content?.[0]?.collectionId);
        setAssessmentResponse(resWord);

        setLocalData("storyTitle", resWord?.name);
        setQuestions(quesArr);
      }

      if ([10, 11, 12, 13, 14, 15].includes(level)) {
        const dummyQuestions = Array.from({ length: 5 }, (_, i) => ({
          id: `dummy-${i + 1}`,
        }));

        setQuestions(dummyQuestions);
      }

      setTimeout(() => {
        setMechanism(currentGetContent.mechanism);
      }, 1000);
      setCurrentQuestion(practiceProgress?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
    } else {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    }
  };

  useEffect(() => {
    if (livesData?.scoreData) {
      if (livesData?.redLivesToShow <= 0) {
        handleNext(true);
      }
    }
  }, [livesData]);

  function highlightWords(sentence, matchedChar, color) {
    const words = sentence.split(" ");
    matchedChar.sort(function (str1, str2) {
      return str2.length - str1.length;
    });

    let type = currentContentType?.toLowerCase();
    if (type === "char" || type === "word") {
      const word = splitGraphemes(words[0].toLowerCase()).filter(
        (item) => item !== "‌" && item !== "" && item !== " "
      );
      let highlightedString = [];
      for (let i = 0; i < word.length; i++) {
        let matchFound = false;
        for (let j = 0; j < matchedChar.length; j++) {
          let length = splitGraphemes(matchedChar[j]).filter(
            (item) => item !== "‌" && item !== "" && item !== " "
          ).length;
          const substr = word.slice(i, i + length).join("");
          if (substr.includes(matchedChar[j])) {
            highlightedString.push(
              <React.Fragment key={i}>
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                    fontWeight: 700,
                    fontFamily: "Quicksand",
                    lineHeight: "50px",
                    background: "#FFF0BD",
                    color: color,
                  }}
                >
                  {i === 0 ? substr.toUpperCase() : substr}
                </Typography>
              </React.Fragment>
            );
            i += length - 1;
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          highlightedString.push(
            <React.Fragment key={i}>
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  color: color,
                  fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                }}
              >
                {i === 0 ? word[i].toUpperCase() : word[i]}
              </Typography>
            </React.Fragment>
          );
        }
      }
      return highlightedString;
    } else {
      const highlightedSentence = words.map((word, index) => {
        const isMatched = matchedChar.some((char) =>
          word.toLowerCase().includes(char)
        );
        if (isMatched) {
          return (
            <React.Fragment key={index}>
              <Typography
                variant="h5"
                component="h4"
                ml={1}
                sx={{
                  fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                  background: "#FFF0BD",
                }}
              >
                {word}
              </Typography>{" "}
            </React.Fragment>
          );
        } else {
          return (
            <Typography
              variant="h5"
              component="h4"
              ml={1}
              sx={{
                color: "#333F61",
                fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                fontWeight: 700,
                fontFamily: "Quicksand",
                lineHeight: "50px",
              }}
              key={index}
            >
              {word + " "}
            </Typography>
          );
        }
      });
      return highlightedSentence;
    }
  }

  useEffect(() => {
    if (questions[currentQuestion]?.contentSourceData) {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        const contentSourceData =
          questions[currentQuestion]?.contentSourceData || [];
        const stringLengths = contentSourceData.map((item) => item.text.length);
        const length =
          questions[currentQuestion]?.mechanics_data &&
          (questions[currentQuestion]?.mechanics_data[0]?.mechanics_id ===
            "mechanic_2" ||
            questions[currentQuestion]?.mechanics_data[0]?.mechanics_id ===
              "mechanic_1")
            ? 500
            : stringLengths[0];
        window.parent.postMessage(
          { type: "stringLengths", length },
          window?.location?.ancestorOrigins?.[0] ||
            window.parent.location.origin
        );
      }
    }
  }, [questions[currentQuestion]]);

  //console.log("mec", mechanism, level, rFlow, currentLevel);

  const renderMechanics = () => {
    if (
      (!mechanism && rFlow !== "true" && tFlow !== "true") ||
      (mechanism?.id === "mechanic_15" && rFlow !== "true" && tFlow !== "true")
    ) {
      const mechanics_data = questions[currentQuestion]?.mechanics_data;

      return (
        <WordsOrImage
          {...{
            level: level,
            audioLink:
              level === 1 || level === 2 || level === 3
                ? getAssetAudioUrl(s3Assets[refAudio])
                : mechanism?.id === "mechanic_15"
                ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${mechanics_data?.[0]?.audio_url}`
                : null,
            mechanism_id: mechanism?.id,
            header:
              mechanism?.id &&
              (mechanism?.id === "mechanic_15"
                ? "Read the question and record your response"
                : questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`),
            words:
              process.env.REACT_APP_USE_RECOMMENDATION_API === "true"
                ? mechanism?.id === "mechanic_15"
                  ? questions[currentQuestion]?.mechanics_data?.[0]?.text
                  : questions[currentQuestion]?.contentSourceData?.[0]?.text
                : level === 1 || level === 2 || level === 3
                ? levelOneWord
                : mechanism?.id === "mechanic_15"
                ? questions[currentQuestion]?.mechanics_data?.[0]?.text
                : questions[currentQuestion]?.contentSourceData?.[0]?.text,
            hints: questions[currentQuestion]?.mechanics_data?.[0]?.hints?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: questions[currentQuestion]?.contentType,
            image:
              mechanism?.id === "mechanic_15"
                ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${questions[currentQuestion]?.mechanics_data[0]?.image_url}`
                : "",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            startShowCase,
            setStartShowCase,
            handleBack: !isShowCase && handleBack,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            loading,
            percentage,
            fluency,
            setOpenMessageDialog,
            setEnableNext,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (tFlow === "true") {
      return (
        <TowreFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (rFlow === "true" && level === 1) {
      return (
        <R1
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (rFlow === "true" && level === 2 && [2, 3, 4].includes(rStep)) {
      return (
        <R2
          page={page}
          setPage={setPage}
          rStep={rStep}
          //onComplete={() => handleComplete(3)}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "fillInTheBlank" && mechanism.id !== "") {
      return (
        <Mechanics3
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism.name === "fillInTheBlank"
                ? "Fill in the blank"
                : questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords: questions[currentQuestion]?.mechanics_data?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            image: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                questions[currentQuestion]?.mechanics_data[0]?.image_url
              : null,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            options: questions[currentQuestion]?.mechanics_data
              ? questions[currentQuestion]?.mechanics_data[0]?.options
              : [],
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "formAWord") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "formAWord2") {
      return (
        <Mechanics7
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "bingoCard") {
      return (
        <BingoCard
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "syllablePuzzle") {
      return (
        <SyllablePuzzle
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "readTheImage") {
      const options = questions[currentQuestion]?.mechanics_data
        ? questions[currentQuestion]?.mechanics_data[0]?.options
        : [];
      const audioLink =
        options && options.length > 0
          ? options.find((option) => option.isAns === true)?.audio_url || null
          : null;

      const mechanics_data = questions[currentQuestion]?.mechanics_data;
      return (
        <Mechanics5
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism?.id === "mechanic_16"
                ? "Read the question and select correct answer"
                : "Look at the picture and speak the correct answer from below",
            parentWords: mechanics_data
              ? mechanics_data[0].text
              : questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            question_audio: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                mechanics_data[0].audio_url
              : questions[currentQuestion]?.contentSourceData?.[0]?.audio_url,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            options: options,
            correctness: mechanics_data ? mechanics_data[0]?.correctness : null,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            mechanism: mechanism?.id,
            image: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                mechanics_data[0]?.image_url
              : null,

            audio: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                audioLink
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "formASentence") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header: "Form a sentence using the words and speak",
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            jumbled_text:
              questions[currentQuestion]?.mechanics_data?.[0]?.jumbled_text,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            // image: elephant,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "readAloud") {
      return (
        <ReadAloud
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "jumbledWord") {
      return (
        <JumbledWord
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "r3") {
      return (
        <R3
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "askMore") {
      return (
        <AskMoreM14
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "actOut") {
      return (
        <ActOutM13
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (mechanism.name === "ReadAloudMcqM10") {
      return (
        <PhoneConversation
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "WhatsMissing") {
      return (
        <WhatsMissing
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "arrangePicture") {
      return (
        <ArrangePicture
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "AnouncementFlow") {
      return (
        <AnouncementFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "PhrasesInAction") {
      return (
        <PhrasesInAction
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase: true,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism.name === "McqFlow") {
      return (
        <McqFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below word`,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase: true,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      mechanism.name === "audio" ||
      (mechanism.name === "fillInTheBlank" && mechanism.id === "")
    ) {
      return (
        <Mechanics6
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism.name === "fillInTheBlank"
                ? "Fill in the blank"
                : questions[currentQuestion]?.contentType === "image"
                ? `Guess the below image`
                : `Speak the below ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            image: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                questions[currentQuestion]?.mechanics_data[0]?.image_url
              : null,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            options: questions[currentQuestion]?.mechanics_data
              ? questions[currentQuestion]?.mechanics_data[0]?.options
              : [],
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (page === 1) {
      return <Mechanics2 page={page} setPage={setPage} />;
    }
  };

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
            setDisableScreen(false);
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      {renderMechanics()}
    </>
  );
};

export default Practice;
