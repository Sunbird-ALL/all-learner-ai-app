import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { ArrowLeft } from "lucide-react"; // or your icon library

const theme = createTheme();

const dataEn = [
  {
    letter: "E",
    items: [
      {
        id: 1,
        title: "Consonant",
        letters: "Ee",
        letter: "e",
        word: "Egg",
        image: getAssetUrl(s3Assets.eggFiveImg),
        audio: getAssetAudioUrl(s3Assets.eggPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.eggPhonemeAudio),
      },
      {
        id: 2,
        title: "Consonant",
        letters: "Ee",
        letter: "e",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFourteenImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
      },
      {
        id: 3,
        title: "Consonant",
        letters: "Ee",
        letter: "e",
        word: "Kite",
        image: getAssetUrl(s3Assets.kiteFiveImg),
        audio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
      },
    ],
  },
  {
    letter: "A",
    items: [
      {
        id: 4,
        title: "Consonant",
        letters: "Aa",
        letter: "a",
        word: "Apple",
        image: getAssetUrl(s3Assets.appleOneImg),
        audio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
      },
      {
        id: 5,
        title: "Consonant",
        letters: "Aa",
        letter: "a",
        word: "Cat",
        image: getAssetUrl(s3Assets.catOneImg),
        audio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
      },
      {
        id: 6,
        title: "Consonant",
        letters: "Aa",
        letter: "a",
        word: "Pea",
        image: getAssetUrl(s3Assets.peaOneImg),
        audio: getAssetAudioUrl(s3Assets.peaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.peaPhonemeAudio),
      },
    ],
  },
  {
    letter: "O",
    items: [
      {
        id: 7,
        title: "Consonant",
        letters: "Oo",
        letter: "o",
        word: "Orange",
        image: getAssetUrl(s3Assets.orangeFifteenImg),
        audio: getAssetAudioUrl(s3Assets.orangePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.orangePhonemeAudio),
      },
      {
        id: 8,
        title: "Consonant",
        letters: "Oo",
        letter: "o",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogSevenImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
      },
      {
        id: 9,
        title: "Consonant",
        letters: "Oo",
        letter: "o",
        word: "Mango",
        image: getAssetUrl(s3Assets.mangoThirteenImg),
        audio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
      },
    ],
  },
  {
    letter: "I",
    items: [
      {
        id: 10,
        title: "Consonant",
        letters: "Ii",
        letter: "i",
        word: "Ice",
        image: getAssetUrl(s3Assets.iceThreeImg),
        audio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
      },
      {
        id: 11,
        title: "Consonant",
        letters: "Ii",
        letter: "i",
        word: "Pig",
        image: getAssetUrl(s3Assets.pigNineImg),
        audio: getAssetAudioUrl(s3Assets.pigPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.pigPhonemeAudio),
      },
      {
        id: 12,
        title: "Consonant",
        letters: "Ii",
        letter: "i",
        word: "Chilly",
        image: getAssetUrl(s3Assets.chilliImg),
        audio: getAssetAudioUrl(s3Assets.chillyAud),
        singleAudio: getAssetAudioUrl(s3Assets.chillyAud),
      },
    ],
  },
  {
    letter: "U",
    items: [
      {
        id: 13,
        title: "Consonant",
        letters: "Uu",
        letter: "u",
        word: "Umbrella",
        image: getAssetUrl(s3Assets.umbrellaTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudio),
      },
      {
        id: 14,
        title: "Consonant",
        letters: "Uu",
        letter: "u",
        word: "Dustbin",
        image: getAssetUrl(s3Assets.DustbinTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.dustbinPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dustbinPhonemeAudio),
      },
      {
        id: 15,
        title: "Consonant",
        letters: "Uu",
        letter: "u",
        word: "Laddu",
        image: getAssetUrl(s3Assets.LadduTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.ladduPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ladduPhonemeAudio),
      },
    ],
  },
  {
    letter: "T",
    items: [
      {
        id: 16,
        title: "Consonant",
        letters: "Tt",
        letter: "t",
        word: "Tiger",
        image: getAssetUrl(s3Assets.tigerSevenImg),
        audio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
      },
      {
        id: 17,
        title: "Consonant",
        letters: "Tt",
        letter: "t",
        word: "Watch",
        image: getAssetUrl(s3Assets.watchTwentyImg),
        audio: getAssetAudioUrl(s3Assets.watchPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.watchPhonemeAudio),
      },
      {
        id: 18,
        title: "Consonant",
        letters: "Tt",
        letter: "t",
        word: "Plant",
        image: getAssetUrl(s3Assets.plantTwentyImg),
        audio: getAssetAudioUrl(s3Assets.plantPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.plantPhonemeAudio),
      },
    ],
  },
  {
    letter: "N",
    items: [
      {
        id: 19,
        title: "Consonant",
        letters: "Nn",
        letter: "n",
        word: "Nest",
        image: getAssetUrl(s3Assets.NestFourteenImg),
        audio: getAssetAudioUrl(s3Assets.nestPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.nestPhonemeAudio),
      },
      {
        id: 20,
        title: "Consonant",
        letters: "Nn",
        letter: "n",
        word: "Honey",
        image: getAssetUrl(s3Assets.HoneyFourteenImg),
        audio: getAssetAudioUrl(s3Assets.honeyPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.honeyPhonemeAudio),
      },
      {
        id: 21,
        title: "Consonant",
        letters: "Nn",
        letter: "n",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFiveImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
      },
    ],
  },
  {
    letter: "S",
    items: [
      {
        id: 22,
        title: "Consonant",
        letters: "Ss",
        letter: "s",
        word: "Sun",
        image: getAssetUrl(s3Assets.sunNineteenImg),
        audio: getAssetAudioUrl(s3Assets.sunPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.sunPhonemeAudio),
      },
      {
        id: 23,
        title: "Consonant",
        letters: "Ss",
        letter: "s",
        word: "Horse",
        image: getAssetUrl(s3Assets.horseNineteenImg),
        audio: getAssetAudioUrl(s3Assets.horsePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.horsePhonemeAudio),
      },
      {
        id: 24,
        title: "Consonant",
        letters: "Ss",
        letter: "s",
        word: "Bus",
        image: getAssetUrl(s3Assets.busNineteenImg),
        audio: getAssetAudioUrl(s3Assets.busPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.busPhonemeAudio),
      },
    ],
  },
  {
    letter: "R",
    items: [
      {
        id: 25,
        title: "Consonant",
        letters: "Rr",
        letter: "r",
        word: "Rat",
        image: getAssetUrl(s3Assets.ratEighteenImg),
        audio: getAssetAudioUrl(s3Assets.ratPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ratPhonemeAudio),
      },
      {
        id: 26,
        title: "Consonant",
        letters: "Rr",
        letter: "r",
        word: "Carrot",
        image: getAssetUrl(s3Assets.carrotEighteenImg),
        audio: getAssetAudioUrl(s3Assets.carrotPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.carrotPhonemeAudio),
      },
      {
        id: 27,
        title: "Consonant",
        letters: "Rr",
        letter: "r",
        word: "Car",
        image: getAssetUrl(s3Assets.carEighteenImg),
        audio: getAssetAudioUrl(s3Assets.carPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.carPhonemeAudio),
      },
    ],
  },
  {
    letter: "H",
    items: [
      {
        id: 28,
        title: "Consonant",
        letters: "Hh",
        letter: "h",
        word: "Hand",
        image: getAssetUrl(s3Assets.handEightImg),
        audio: getAssetAudioUrl(s3Assets.handPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.handPhonemeAudio),
      },
      {
        id: 29,
        title: "Consonant",
        letters: "Hh",
        letter: "h",
        word: "Teacher",
        image: getAssetUrl(s3Assets.teacherEightImg),
        audio: getAssetAudioUrl(s3Assets.teacherPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.teacherPhonemeAudio),
      },
      {
        id: 30,
        title: "Consonant",
        letters: "Hh",
        letter: "h",
        word: "Earth",
        image: getAssetUrl(s3Assets.earthEightImg),
        audio: getAssetAudioUrl(s3Assets.earthPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.earthPhonemeAudio),
      },
    ],
  },
  {
    letter: "L",
    items: [
      {
        id: 31,
        title: "Consonant",
        letters: "Ll",
        letter: "l",
        word: "Lion",
        image: getAssetUrl(s3Assets.LionTwelveImg),
        audio: getAssetAudioUrl(s3Assets.lionPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.lionPhonemeAudio),
      },
      {
        id: 32,
        title: "Consonant",
        letters: "Ll",
        letter: "l",
        word: "Balloon",
        image: getAssetUrl(s3Assets.ballTwoImg),
        audio: getAssetAudioUrl(s3Assets.balloonPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.balloonPhonemeAudio),
      },
      {
        id: 33,
        title: "Consonant",
        letters: "Ll",
        letter: "l",
        word: "Bell",
        image: getAssetUrl(s3Assets.bellTwelveImg),
        audio: getAssetAudioUrl(s3Assets.bellPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bellPhonemeAudio),
      },
    ],
  },
  {
    letter: "D",
    items: [
      {
        id: 34,
        title: "Consonant",
        letters: "Dd",
        letter: "d",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogFourImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
      },
      {
        id: 35,
        title: "Consonant",
        letters: "Dd",
        letter: "d",
        word: "Window",
        image: getAssetUrl(s3Assets.windowFourImg),
        audio: getAssetAudioUrl(s3Assets.windowPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.windowPhonemeAudio),
      },
      {
        id: 36,
        title: "Consonant",
        letters: "Dd",
        letter: "d",
        word: "Sword",
        image: getAssetUrl(s3Assets.swordFourImg),
        audio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
      },
    ],
  },
  {
    letter: "C",
    items: [
      {
        id: 37,
        title: "Consonant",
        letters: "Cc",
        letter: "c",
        word: "Cat",
        image: getAssetUrl(s3Assets.catOneImg),
        audio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
      },
      {
        id: 38,
        title: "Consonant",
        letters: "Cc",
        letter: "c",
        word: "Ice",
        image: getAssetUrl(s3Assets.iceThreeImg),
        audio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
      },
      {
        id: 39,
        title: "Consonant",
        letters: "Cc",
        letter: "c",
        word: "Garlic",
        image: getAssetUrl(s3Assets.garlicThreeImg),
        audio: getAssetAudioUrl(s3Assets.garlicPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.garlicPhonemeAudio),
      },
    ],
  },
  {
    letter: "M",
    items: [
      {
        id: 40,
        title: "Consonant",
        letters: "Mm",
        letter: "m",
        word: "Mango",
        image: getAssetUrl(s3Assets.mangoThirteenImg),
        audio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
      },
      {
        id: 41,
        title: "Consonant",
        letters: "Mm",
        letter: "m",
        word: "Lemon",
        image: getAssetUrl(s3Assets.lemonThirteenImg),
        audio: getAssetAudioUrl(s3Assets.lemonPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.lemonPhonemeAudio),
      },
      {
        id: 42,
        title: "Consonant",
        letters: "Mm",
        letter: "m",
        word: "Jam",
        image: getAssetUrl(s3Assets.jamTenImg),
        audio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
      },
    ],
  },
  {
    letter: "F",
    items: [
      {
        id: 43,
        title: "Consonant",
        letters: "Ff",
        letter: "f",
        word: "Fish",
        image: getAssetUrl(s3Assets.fishSixImg),
        audio: getAssetAudioUrl(s3Assets.fishPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fishPhonemeAudio),
      },
      {
        id: 44,
        title: "Consonant",
        letters: "Ff",
        letter: "f",
        word: "Giraffe",
        image: getAssetUrl(s3Assets.girraffeSixImg),
        audio: getAssetAudioUrl(s3Assets.giraffePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.giraffePhonemeAudio),
      },
      {
        id: 45,
        title: "Consonant",
        letters: "Ff",
        letter: "f",
        word: "Leaf",
        image: getAssetUrl(s3Assets.LeafSixImg),
        audio: getAssetAudioUrl(s3Assets.leafPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.leafPhonemeAudio),
      },
    ],
  },
  {
    letter: "Y",
    items: [
      {
        id: 46,
        title: "Consonant",
        letters: "Yy",
        letter: "y",
        word: "Yak",
        image: getAssetUrl(s3Assets.yakTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.yakPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.yakPhonemeAudio),
      },
      {
        id: 47,
        title: "Consonant",
        letters: "Yy",
        letter: "y",
        word: "Papaya",
        image: getAssetUrl(s3Assets.papayaTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.papayaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.papayaPhonemeAudio),
      },
      {
        id: 48,
        title: "Consonant",
        letters: "Yy",
        letter: "y",
        word: "Key",
        image: getAssetUrl(s3Assets.KeyTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.keyPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.keyPhonemeAudio),
      },
    ],
  },
  {
    letter: "W",
    items: [
      {
        id: 49,
        title: "Consonant",
        letters: "Ww",
        letter: "w",
        word: "Window",
        image: getAssetUrl(s3Assets.windowFourImg),
        audio: getAssetAudioUrl(s3Assets.windowPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.windowPhonemeAudio),
      },
      {
        id: 50,
        title: "Consonant",
        letters: "Ww",
        letter: "w",
        word: "Sword",
        image: getAssetUrl(s3Assets.swordFourImg),
        audio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
      },
      {
        id: 51,
        title: "Consonant",
        letters: "Ww",
        letter: "w",
        word: "Crow",
        image: getAssetUrl(s3Assets.CrowTwentyThreeImg),
        audio: getAssetAudioUrl(s3Assets.crowPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.crowPhonemeAudio),
      },
    ],
  },
  {
    letter: "G",
    items: [
      {
        id: 52,
        title: "Consonant",
        letters: "Gg",
        letter: "g",
        word: "Goat",
        image: getAssetUrl(s3Assets.goatSevenImg),
        audio: getAssetAudioUrl(s3Assets.goatPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.goatPhonemeAudio),
      },
      {
        id: 53,
        title: "Consonant",
        letters: "Gg",
        letter: "g",
        word: "Tiger",
        image: getAssetUrl(s3Assets.tigerSevenImg),
        audio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
      },
      {
        id: 54,
        title: "Consonant",
        letters: "Gg",
        letter: "g",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogFourImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
      },
    ],
  },
  {
    letter: "P",
    items: [
      {
        id: 55,
        title: "Consonant",
        letters: "Pp",
        letter: "p",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFiveImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
      },
      {
        id: 56,
        title: "Consonant",
        letters: "Pp",
        letter: "p",
        word: "Apple",
        image: getAssetUrl(s3Assets.appleOneImg),
        audio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
      },
      {
        id: 57,
        title: "Consonant",
        letters: "Pp",
        letter: "p",
        word: "Cap",
        image: getAssetUrl(s3Assets.capSixteenImg),
        audio: getAssetAudioUrl(s3Assets.capPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.capPhonemeAudio),
      },
    ],
  },
  {
    letter: "B",
    items: [
      {
        id: 58,
        title: "Consonant",
        letters: "Bb",
        letter: "b",
        word: "Ball",
        image: getAssetUrl(s3Assets.ballGif),
        audio: getAssetAudioUrl(s3Assets.ballPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ballPhonemeAudio),
      },
      {
        id: 59,
        title: "Consonant",
        letters: "Bb",
        letter: "b",
        word: "Zebra",
        image: getAssetUrl(s3Assets.zebraTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
      },
      {
        id: 60,
        title: "Consonant",
        letters: "Bb",
        letter: "b",
        word: "Cub",
        image: getAssetUrl(s3Assets.cubTwoImg),
        audio: getAssetAudioUrl(s3Assets.cubPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.cubPhonemeAudio),
      },
    ],
  },
  {
    letter: "V",
    items: [
      {
        id: 61,
        title: "Consonant",
        letters: "Vv",
        letter: "v",
        word: "Van",
        image: getAssetUrl(s3Assets.VanTwentyTwoImg),
        audio: getAssetAudioUrl(s3Assets.vanPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.vanPhonemeAudio),
      },
      {
        id: 62,
        title: "Consonant",
        letters: "Vv",
        letter: "v",
        word: "Guava",
        image: getAssetUrl(s3Assets.GuavaTwentyTwoImg),
        audio: getAssetAudioUrl(s3Assets.guavaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.guavaPhonemeAudio),
      },
    ],
  },
  {
    letter: "K",
    items: [
      {
        id: 64,
        title: "Consonant",
        letters: "Kk",
        letter: "k",
        word: "Kite",
        image: getAssetUrl(s3Assets.kiteFiveImg),
        audio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
      },
      {
        id: 65,
        title: "Consonant",
        letters: "Kk",
        letter: "k",
        word: "Monkey",
        image: getAssetUrl(s3Assets.monkeyElevenImg),
        audio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudio),
      },
      {
        id: 66,
        title: "Consonant",
        letters: "Kk",
        letter: "k",
        word: "Book",
        image: getAssetUrl(s3Assets.bookElevenImg),
        audio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
      },
    ],
  },
  {
    letter: "J",
    items: [
      {
        id: 67,
        title: "Consonant",
        letters: "Jj",
        letter: "j",
        word: "Jam",
        image: getAssetUrl(s3Assets.jamTenImg),
        audio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
      },
      {
        id: 68,
        title: "Consonant",
        letters: "Jj",
        letter: "j",
        word: "brinjal",
        image: getAssetUrl(s3Assets.brinjalTenImg),
        audio: getAssetAudioUrl(s3Assets.brinjalPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.brinjalPhonemeAudio),
      },
    ],
  },
  {
    letter: "X",
    items: [
      {
        id: 70,
        title: "Consonant",
        letters: "Xx",
        letter: "x",
        word: "Xray",
        image: getAssetUrl(s3Assets.xrayTwentyFourImg),
        audio: getAssetAudioUrl(s3Assets.xrayPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.xrayPhonemeAudio),
      },
      {
        id: 71,
        title: "Consonant",
        letters: "Xx",
        letter: "x",
        word: "Textbook",
        image: getAssetUrl(s3Assets.bookElevenImg),
        audio: getAssetAudioUrl(s3Assets.textbookPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.textbookPhonemeAudio),
      },
      {
        id: 72,
        title: "Consonant",
        letters: "Xx",
        letter: "x",
        word: "Fox",
        image: getAssetUrl(s3Assets.foxTwentyFourImg),
        audio: getAssetAudioUrl(s3Assets.foxPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.foxPhonemeAudio),
      },
    ],
  },
  {
    letter: "Q",
    items: [
      {
        id: 73,
        title: "Consonant",
        letters: "Qq",
        letter: "q",
        word: "Queen",
        image: getAssetUrl(s3Assets.queenSixteenImg),
        audio: getAssetAudioUrl(s3Assets.queenPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.queenPhonemeAudio),
      },
      {
        id: 74,
        title: "Consonant",
        letters: "Qq",
        letter: "q",
        word: "Mosquito",
        image: getAssetUrl(s3Assets.mosquitoSeventeenImg),
        audio: getAssetAudioUrl(s3Assets.mosquitoPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mosquitoPhonemeAudio),
      },
    ],
  },
  {
    letter: "Z",
    items: [
      {
        id: 76,
        title: "Consonant",
        letters: "Zz",
        letter: "z",
        word: "Zebra",
        image: getAssetUrl(s3Assets.zebraTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
      },
      {
        id: 77,
        title: "Consonant",
        letters: "Zz",
        letter: "z",
        word: "Puzzle",
        image: getAssetUrl(s3Assets.PuzzleTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.puzzlePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.puzzlePhonemeAudio),
      },
      {
        id: 78,
        title: "Consonant",
        letters: "Zz",
        letter: "z",
        word: "Quiz",
        image: getAssetUrl(s3Assets.PuzzleTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.quizPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.quizPhonemeAudio),
      },
    ],
  },
];

const dataKn = [
  {
    letter: "ಅ",
    items: [
      {
        id: 1,
        title: "Consonant",
        letters: "ಅ",
        letter: "ಅ",
        word: "ಅರಸ",
        image: getAssetUrl(s3Assets.kingAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.kingAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kingAlpAudio),
      },
    ],
  },
  {
    letter: "ಆ",
    items: [
      {
        id: 2,
        title: "Consonant",
        letters: "ಆ",
        letter: "ಆ",
        word: "ಆನೆ",
        image: getAssetUrl(s3Assets.elephentAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.elephantAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.elephantAlpAudio),
      },
    ],
  },
  {
    letter: "ಇ",
    items: [
      {
        id: 3,
        title: "Consonant",
        letters: "ಇ",
        letter: "ಇ",
        word: "ಇಲಿ",
        image: getAssetUrl(s3Assets.ratAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.mouseAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mouseAlpAudio),
      },
    ],
  },
  {
    letter: "ಈ",
    items: [
      {
        id: 4,
        title: "Consonant",
        letters: "ಈ",
        letter: "ಈ",
        word: "ಈಜು",
        image: getAssetUrl(s3Assets.swimAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.swimAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.swimAlpAudio),
      },
    ],
  },
  {
    letter: "ಉ",
    items: [
      {
        id: 5,
        title: "Consonant",
        letters: "ಉ",
        letter: "ಉ",
        word: "ಉದರ",
        image: getAssetUrl(s3Assets.bellyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.bellyAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bellyAlpAudio),
      },
    ],
  },
  {
    letter: "ಊ",
    items: [
      {
        id: 6,
        title: "Consonant",
        letters: "ಊ",
        letter: "ಊ",
        word: "ಊಟ",
        image: getAssetUrl(s3Assets.foodAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.mealAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mealAlpAudio),
      },
    ],
  },
  {
    letter: "ಋ",
    items: [
      {
        id: 7,
        title: "Consonant",
        letters: "ಋ",
        letter: "ಋ",
        word: "ಋಷಿ",
        image: getAssetUrl(s3Assets.monkAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.sageAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.sageAlpAudio),
      },
    ],
  },
  {
    letter: "ಎ",
    items: [
      {
        id: 8,
        title: "Consonant",
        letters: "ಎ",
        letter: "ಎ",
        word: "ಎಲೆ",
        image: getAssetUrl(s3Assets.leafAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.leafAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.leafAlpAudio),
      },
    ],
  },
  {
    letter: "ಏ",
    items: [
      {
        id: 9,
        title: "Consonant",
        letters: "ಏ",
        letter: "ಏ",
        word: "ಏಣಿ",
        image: getAssetUrl(s3Assets.stairAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.ladderAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ladderAlpAudio),
      },
    ],
  },
  {
    letter: "ಐ",
    items: [
      {
        id: 10,
        title: "Consonant",
        letters: "ಐ",
        letter: "ಐ",
        word: "ಐದು",
        image: getAssetUrl(s3Assets.fiveAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fiveAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fiveAlpAudio),
      },
    ],
  },
  {
    letter: "ಒ",
    items: [
      {
        id: 11,
        title: "Consonant",
        letters: "ಒ",
        letter: "ಒ",
        word: "ಒಂಟೆ",
        image: getAssetUrl(s3Assets.camelAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.camelAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.camelAlpAudio),
      },
    ],
  },
  {
    letter: "ಓ",
    items: [
      {
        id: 12,
        title: "Consonant",
        letters: "ಓ",
        letter: "ಓ",
        word: "ಓಡು",
        image: getAssetUrl(s3Assets.runAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.runningAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.runningAlpAudio),
      },
    ],
  },
  {
    letter: "ಔ",
    items: [
      {
        id: 13,
        title: "Consonant",
        letters: "ಔ",
        letter: "ಔ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.medicineAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medicineAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.medicineAlpAudio),
      },
    ],
  },
  {
    letter: "ಕ",
    items: [
      {
        id: 14,
        title: "Consonant",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಕಮಲ",
        image: getAssetUrl(s3Assets.lotusAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.lotusAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.lotusAlpAudio),
      },
      {
        id: 15,
        title: "Consonant",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಏಕದಳ",
        image: getAssetUrl(s3Assets.cerealAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.seedCornGrainAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.seedCornGrainAlpAudio),
      },
      {
        id: 16,
        title: "Consonant",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಪದಕ",
        image: getAssetUrl(s3Assets.medalAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medalAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.medalAlpAudio),
      },
    ],
  },
  {
    letter: "ಖ",
    items: [
      {
        id: 17,
        title: "Consonant",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಖಡ್ಗ",
        image: getAssetUrl(s3Assets.swordAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.swordAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.swordAlpAudio),
      },
      {
        id: 18,
        title: "Consonant",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಲೇಖನಿ",
        image: getAssetUrl(s3Assets.penAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.penAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penAlpAudio),
      },
      {
        id: 19,
        title: "Consonant",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಪಂಖ",
        image: getAssetUrl(s3Assets.fanAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fanAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fanAlpAudio),
      },
    ],
  },
  {
    letter: "ಗ",
    items: [
      {
        id: 20,
        title: "Consonant",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಗರಿ",
        image: getAssetUrl(s3Assets.featherAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.featherAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.featherAlpAudio),
      },
      {
        id: 21,
        title: "Consonant",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಆಗಸ",
        image: getAssetUrl(s3Assets.skyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.skyAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.skyAlpAudio),
      },
      {
        id: 22,
        title: "Consonant",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಉರಗ",
        image: getAssetUrl(s3Assets.snakeAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.snakeAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.snakeAlpAudio),
      },
    ],
  },
  {
    letter: "ಘ",
    items: [
      {
        id: 23,
        title: "Consonant",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಘಂಟೆ",
        image: getAssetUrl(s3Assets.drumAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.bellAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bellAlpAudio),
      },
      {
        id: 24,
        title: "Consonant",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಘಮಘಮ",
        image: getAssetUrl(s3Assets.fragranceAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fragranceAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fragranceAlpAudio),
      },
      {
        id: 25,
        title: "Consonant",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಸಂಘ",
        image: getAssetUrl(s3Assets.childrenassociationAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.associationAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.associationAlpAudio),
      },
    ],
  },
  {
    letter: "ಚ",
    items: [
      {
        id: 26,
        title: "Consonant",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಚಮಚ",
        image: getAssetUrl(s3Assets.spoonAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.spoonAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.spoonAlpAudio),
      },
      {
        id: 27,
        title: "Consonant",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಈಚಲ",
        image: getAssetUrl(s3Assets.treeAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.palmAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.palmAlpAudio),
      },
      {
        id: 28,
        title: "Consonant",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಮಂಚ",
        image: getAssetUrl(s3Assets.couchAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.cotAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.cotAlpAudio),
      },
    ],
  },
  {
    letter: "ಜ",
    items: [
      {
        id: 29,
        title: "Consonant",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಜನ",
        image: getAssetUrl(s3Assets.peopleAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.peopleAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.peopleAlpAudio),
      },
      {
        id: 30,
        title: "Consonant",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಗೀಜಗ",
        image: getAssetUrl(s3Assets.birdAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.weaverbirdAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.weaverbirdAlpAudio),
      },
      {
        id: 31,
        title: "Consonant",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಭುಜ",
        image: getAssetUrl(s3Assets.shoulderAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.shoulderAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.shoulderAlpAudio),
      },
    ],
  },
  {
    letter: "ಟ",
    items: [
      {
        id: 32,
        title: "Consonant",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಟಗರು",
        image: getAssetUrl(s3Assets.sheepAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.maleSheepAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.maleSheepAlpAudio),
      },
      {
        id: 33,
        title: "Consonant",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಕಿಟಕಿ",
        image: getAssetUrl(s3Assets.windowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.windowAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.windowAlpAudio),
      },
      {
        id: 34,
        title: "Consonant",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಆಟ",
        image: getAssetUrl(s3Assets.weplayAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.playAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.playAlpAudio),
      },
    ],
  },
  {
    letter: "ಠ",
    items: [
      {
        id: 35,
        title: "Consonant",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಕೊಠಡಿ",
        image: getAssetUrl(s3Assets.bedroomAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.roomAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.roomAlpAudio),
      },
      {
        id: 36,
        title: "Consonant",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಕಂಠ",
        image: getAssetUrl(s3Assets.neckAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.frontPartOfTheNeckAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.frontPartOfTheNeckAlpAudio),
      },
    ],
  },
  {
    letter: "ಡ",
    items: [
      {
        id: 37,
        title: "Consonant",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಡಬ್ಬಿ",
        image: getAssetUrl(s3Assets.boxAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.smallBoxOrChestAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.smallBoxOrChestAlpAudio),
      },
      {
        id: 38,
        title: "Consonant",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಕಡಲು",
        image: getAssetUrl(s3Assets.beachAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.oceanAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.oceanAlpAudio),
      },
      {
        id: 39,
        title: "Consonant",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಗಿಡ",
        image: getAssetUrl(s3Assets.plantAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.plantAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.plantAlpAudio),
      },
    ],
  },
  {
    letter: "ಢ",
    items: [
      {
        id: 40,
        title: "Consonant",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಢಣಢಣ",
        image: getAssetUrl(s3Assets.drumAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.manRingingTheBellAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.manRingingTheBellAlpAudio),
      },
      {
        id: 41,
        title: "Consonant",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಪ್ರೌಢಶಾಲೆ",
        image: getAssetUrl(s3Assets.schoolAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.highschoolAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.highschoolAlpAudio),
      },
      {
        id: 42,
        title: "Consonant",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಗಾಢ",
        image: getAssetUrl(s3Assets.eggFiveImg),
        audio: getAssetAudioUrl(s3Assets.gaadhaNoImagAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.gaadhaNoImagAlpAudio),
      },
    ],
  },
  {
    letter: "ಣ",
    items: [
      {
        id: 43,
        title: "Consonant",
        letters: "ಣ",
        letter: "ಣ",
        word: "ಹಣತೆ",
        image: getAssetUrl(s3Assets.candleAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.earthenLampDiyaAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.earthenLampDiyaAlpAudio),
      },
      {
        id: 44,
        title: "Consonant",
        letters: "ಣ",
        letter: "ಣ",
        word: "ಹಣ",
        image: getAssetUrl(s3Assets.coinAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.moneyAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.moneyAlpAudio),
      },
    ],
  },
  {
    letter: "ತ",
    items: [
      {
        id: 45,
        title: "Consonant",
        letters: "ತ",
        letter: "ತ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.tabalaAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.tabalaAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tabalaAlpAudio),
      },
      {
        id: 46,
        title: "Consonant",
        letters: "ತ",
        letter: "ತ",
        word: "ಸಂತಸ",
        image: getAssetUrl(s3Assets.happyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.joyHappyAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.joyHappyAlpAudio),
      },
      {
        id: 47,
        title: "Consonant",
        letters: "ತ",
        letter: "ತ",
        word: "ಗಣಿತ",
        image: getAssetUrl(s3Assets.mathematicsAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.mathAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mathAlpAudio),
      },
    ],
  },
  {
    letter: "ಥ",
    items: [
      {
        id: 48,
        title: "Consonant",
        letters: "ಥ",
        letter: "ಥ",
        word: "ಥಳಥಳ",
        image: getAssetUrl(s3Assets.necklaceAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.shiningNecklaceAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.shiningNecklaceAlpAudio),
      },
      {
        id: 49,
        title: "Consonant",
        letters: "ಥ",
        letter: "ಥ",
        word: "ಥರಥರ",
        image: getAssetUrl(s3Assets.fearAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.shakingWithFearAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.shakingWithFearAlpAudio),
      },
      {
        id: 50,
        title: "Consonant",
        letters: "ಥ",
        letter: "ಥ",
        word: "ರಥ",
        image: getAssetUrl(s3Assets.horsechariotAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.chariotAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.chariotAlpAudio),
      },
    ],
  },
  {
    letter: "ದ",
    items: [
      {
        id: 51,
        title: "Consonant",
        letters: "ದ",
        letter: "ದ",
        word: "ದನ",
        image: getAssetUrl(s3Assets.cowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.cowAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.cowAlpAudio),
      },
      {
        id: 52,
        title: "Consonant",
        letters: "ದ",
        letter: "ದ",
        word: "ಕೂದಲು",
        image: getAssetUrl(s3Assets.hairAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.hairAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.hairAlpAudio),
      },
      {
        id: 53,
        title: "Consonant",
        letters: "ದ",
        letter: "ದ",
        word: "ಕಾಗದ",
        image: getAssetUrl(s3Assets.paperAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.paperAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.paperAlpAudio),
      },
    ],
  },
  {
    letter: "ಧ",
    items: [
      {
        id: 54,
        title: "Consonant",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಧನ",
        image: getAssetUrl(s3Assets.treasureAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.assetMoneyAndJewelsAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.assetMoneyAndJewelsAlpAudio),
      },
      {
        id: 55,
        title: "Consonant",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಬುಧವಾರ",
        image: getAssetUrl(s3Assets.wednesdayAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.wednesdayAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.wednesdayAlpAudio),
      },
      {
        id: 56,
        title: "Consonant",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.medicineAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medicineAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.medicineAlpAudio),
      },
    ],
  },
  {
    letter: "ನ",
    items: [
      {
        id: 57,
        title: "Consonant",
        letters: "ನ",
        letter: "ನ",
        word: "ನರಿ",
        image: getAssetUrl(s3Assets.foxAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.foxAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.foxAlpAudio),
      },
      {
        id: 58,
        title: "Consonant",
        letters: "ನ",
        letter: "ನ",
        word: "ಕನಸು",
        image: getAssetUrl(s3Assets.dreamAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.dreamAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dreamAlpAudio),
      },
      {
        id: 59,
        title: "Consonant",
        letters: "ನ",
        letter: "ನ",
        word: "ನಮನ",
        image: getAssetUrl(s3Assets.pranamAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.namasteAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.namasteAlpAudio),
      },
    ],
  },
  {
    letter: "ಪ",
    items: [
      {
        id: 60,
        title: "Consonant",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಪದಕ",
        image: getAssetUrl(s3Assets.medalAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medalAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.medalAlpAudio),
      },
      {
        id: 61,
        title: "Consonant",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಗಾಳಿಪಟ",
        image: getAssetUrl(s3Assets.kiteAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.kiteAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kiteAlpAudio),
      },
      {
        id: 62,
        title: "Consonant",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಕೋಪ",
        image: getAssetUrl(s3Assets.angerAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.angryBoyAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.angryBoyAlpAudio),
      },
    ],
  },
  {
    letter: "ಫ",
    items: [
      {
        id: 63,
        title: "Consonant",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಫಲ",
        image: getAssetUrl(s3Assets.fruitAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fruitsAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fruitsAlpAudio),
      },
      {
        id: 64,
        title: "Consonant",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಸೌರಫಲಕ",
        image: getAssetUrl(s3Assets.solarAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.solarPanelAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.solarPanelAlpAudio),
      },
      {
        id: 65,
        title: "Consonant",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಕಫ",
        image: getAssetUrl(s3Assets.coughAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.phlegmAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.phlegmAlpAudio),
      },
    ],
  },
  {
    letter: "ಬ",
    items: [
      {
        id: 66,
        title: "Consonant",
        letters: "ಬ",
        letter: "ಬ",
        word: "ಬಟಾಣಿ",
        image: getAssetUrl(s3Assets.peasAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.greenPeasAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.greenPeasAlpAudio),
      },
      {
        id: 67,
        title: "Consonant",
        letters: "ಬ",
        letter: "ಬ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.tabalaAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.tabalaaAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tabalaaAlpAudio),
      },
      {
        id: 68,
        title: "Consonant",
        letters: "ಬ",
        letter: "ಬ",
        word: "ಕುಟುಂಬ",
        image: getAssetUrl(s3Assets.familyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.familyAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.familyAlpAudio),
      },
    ],
  },
  {
    letter: "ಭ",
    items: [
      {
        id: 69,
        title: "Consonant",
        letters: "ಭ",
        letter: "ಭ",
        word: "ಭರಣಿ",
        image: getAssetUrl(s3Assets.boxAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.smallBoxOrChestAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.smallBoxOrChestAlpAudio),
      },
      {
        id: 70,
        title: "Consonant",
        letters: "ಭ",
        letter: "ಭ",
        word: "ಆಭರಣ",
        image: getAssetUrl(s3Assets.jewelleryAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.jewelariesAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.jewelariesAlpAudio),
      },
      {
        id: 71,
        title: "Consonant",
        letters: "ಭ",
        letter: "ಭ",
        word: "ವೃಷಭ",
        image: getAssetUrl(s3Assets.bullAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.anOxOrBullAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.anOxOrBullAlpAudio),
      },
    ],
  },
  {
    letter: "ಮ",
    items: [
      {
        id: 72,
        title: "Consonant",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಮರ",
        image: getAssetUrl(s3Assets.treeAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.treeAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.treeAlpAudio),
      },
      {
        id: 73,
        title: "Consonant",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಕಮಲ",
        image: getAssetUrl(s3Assets.lotusAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.lotusAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.lotusAlpAudio),
      },
      {
        id: 74,
        title: "Consonant",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಹಿಮ",
        image: getAssetUrl(s3Assets.snowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.snowAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.snowAlpAudio),
      },
    ],
  },
  {
    letter: "ಯ",
    items: [
      {
        id: 75,
        title: "Consonant",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಯಮ",
        image: getAssetUrl(s3Assets.yamrajAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.yamaAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.yamaAlpAudio),
      },
      {
        id: 76,
        title: "Consonant",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಪಾಯಸ",
        image: getAssetUrl(s3Assets.stewAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.kheerAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kheerAlpAudio),
      },
      {
        id: 77,
        title: "Consonant",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಭಯ",
        image: getAssetUrl(s3Assets.fearAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fearAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fearAlpAudio),
      },
    ],
  },
  {
    letter: "ರ",
    items: [
      {
        id: 78,
        title: "Consonant",
        letters: "ರ",
        letter: "ರ",
        word: "ರಥ",
        image: getAssetUrl(s3Assets.horsechariotAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.chariot1AlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.chariot1AlpAudio),
      },
      {
        id: 79,
        title: "Consonant",
        letters: "ರ",
        letter: "ರ",
        word: "ಬೆರಳು",
        image: getAssetUrl(s3Assets.fingerAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fingerAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fingerAlpAudio),
      },
      {
        id: 80,
        title: "Consonant",
        letters: "ರ",
        letter: "ರ",
        word: "ಉದರ",
        image: getAssetUrl(s3Assets.bellyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.bellyAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bellyAlpAudio),
      },
    ],
  },
  {
    letter: "ಲ",
    items: [
      {
        id: 81,
        title: "Consonant",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಲತೆ",
        image: getAssetUrl(s3Assets.leafAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.creeperAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.creeperAlpAudio),
      },
      {
        id: 82,
        title: "Consonant",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಚಿಲಕ",
        image: getAssetUrl(s3Assets.colorpencilAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.boltAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.boltAlpAudio),
      },
      {
        id: 83,
        title: "Consonant",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಮೊಲ",
        image: getAssetUrl(s3Assets.rabbitAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.rabbitAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.rabbitAlpAudio),
      },
    ],
  },
  {
    letter: "ವ",
    items: [
      {
        id: 84,
        title: "Consonant",
        letters: "ವ",
        letter: "ವ",
        word: "ವನ",
        image: getAssetUrl(s3Assets.forestAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.jungleAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.jungleAlpAudio),
      },
      {
        id: 85,
        title: "Consonant",
        letters: "ವ",
        letter: "ವ",
        word: "ಲವಣ",
        image: getAssetUrl(s3Assets.saltAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.rockSaltAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.rockSaltAlpAudio),
      },
      {
        id: 86,
        title: "Consonant",
        letters: "ವ",
        letter: "ವ",
        word: "ಶಿವ",
        image: getAssetUrl(s3Assets.shivAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.shivaGodAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.shivaGodAlpAudio),
      },
    ],
  },
  {
    letter: "ಶ",
    items: [
      {
        id: 87,
        title: "Consonant",
        letters: "ಶ",
        letter: "ಶ",
        word: "ಶಶಿ",
        image: getAssetUrl(s3Assets.moonAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.moonAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.moonAlpAudio),
      },
      {
        id: 88,
        title: "Consonant",
        letters: "ಶ",
        letter: "ಶ",
        word: "ದಶಕ",
        image: getAssetUrl(s3Assets.fiveAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.tenInASetAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tenInASetAlpAudio),
      },
      {
        id: 89,
        title: "Consonant",
        letters: "ಶ",
        letter: "ಶ",
        word: "ದೇಶ",
        image: getAssetUrl(s3Assets.countryAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.countryAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.countryAlpAudio),
      },
    ],
  },
  {
    letter: "ಷ",
    items: [
      {
        id: 90,
        title: "Consonant",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಷಡ್ಭುಜ",
        image: getAssetUrl(s3Assets.hexagonAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.hexagoneAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.hexagoneAlpAudio),
      },
      {
        id: 91,
        title: "Consonant",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.medicineAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medicine2AlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.medicine2AlpAudio),
      },
      {
        id: 92,
        title: "Consonant",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಪುರುಷ",
        image: getAssetUrl(s3Assets.manAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.purushaManAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.purushaManAlpAudio),
      },
    ],
  },
  {
    letter: "ಸ",
    items: [
      {
        id: 93,
        title: "Consonant",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಸರ",
        image: getAssetUrl(s3Assets.tinklechainAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.goldChainAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.goldChainAlpAudio),
      },
      {
        id: 94,
        title: "Consonant",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಮೊಸಳೆ",
        image: getAssetUrl(s3Assets.crocodileAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.crocodileAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.crocodileAlpAudio),
      },
      {
        id: 95,
        title: "Consonant",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಹಂಸ",
        image: getAssetUrl(s3Assets.swanAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.swanAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.swanAlpAudio),
      },
    ],
  },
  {
    letter: "ಹ",
    items: [
      {
        id: 96,
        title: "Consonant",
        letters: "ಹ",
        letter: "ಹ",
        word: "ಹಸು",
        image: getAssetUrl(s3Assets.cowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.cow2AlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.cow2AlpAudio),
      },
      {
        id: 97,
        title: "Consonant",
        letters: "ಹ",
        letter: "ಹ",
        word: "ವಾಹನ",
        image: getAssetUrl(s3Assets.carAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.vehicleAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.vehicleAlpAudio),
      },
      {
        id: 98,
        title: "Consonant",
        letters: "ಹ",
        letter: "ಹ",
        word: "ಸಿಂಹ",
        image: getAssetUrl(s3Assets.lionAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.lionAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.lionAlpAudio),
      },
    ],
  },
  {
    letter: "ಳ",
    items: [
      {
        id: 99,
        title: "Consonant",
        letters: "ಳ",
        letter: "ಳ",
        word: "ಹಳದಿ",
        image: getAssetUrl(s3Assets.yellowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.yellowAlpAudio),
        singleAudio: getAssetAudioUrl(s3Assets.yellowAlpAudio),
      },
    ],
  },
];

const R0 = ({
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
  handleBack, // This might be going to homepage
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

  const generatePlaylist = (data) => {
    const playlist = [];

    for (let i = 0; i < data.length; i += 5) {
      const block = data.slice(i, i + 5);

      block.forEach((letterObj) => {
        letterObj.items.forEach((item) => {
          playlist.push({
            type: "UI1",
            item,
            letter: letterObj.letter,
          });
        });
      });

      block.forEach((letterObj) => {
        if (letterObj.items.length > 0) {
          const firstItem = letterObj.items[0];
          playlist.push({
            type: "UI2",
            item: firstItem,
            letter: letterObj.letter,
          });
        }
      });
    }

    return playlist;
  };

  const playlist = generatePlaylist(data);

  const [currentIndex, setCurrentIndex] = useState(0);
  const batchIndex = Math.floor(currentIndex / 10);
  const stepInBatch = Math.floor((currentIndex % 10) / 5);
  const itemIndex = batchIndex * 5 + (currentIndex % 5);
  const item = playlist[currentIndex]?.item;
  const prevItem = itemIndex > 0 ? data[itemIndex - 1] : null;
  const blockStart = Math.floor(itemIndex / 5) * 5;
  const currentLetter = item?.letter || "";
  const [letters, setLetters] = useState([]);
  const COLORS = ["#8BC34A", "#9C27B0", "#E91E63", "#03A9F4", "#FF9800"];
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [recAudio, setRecAudio] = useState(null);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [enableNext, setEnableNext] = useState(false);
  const current = playlist[currentIndex];
  const navigate = useNavigate();

  const audioRef = useRef(null);

  const currentAudio =
    playlist[currentIndex]?.type === "UI2"
      ? null
      : playlist[currentIndex]?.item?.audio || null;

  const singleAudio = playlist[currentIndex]?.item?.singleAudio || null;

  //console.log("letters", singleAudio);

  const playAudio = (src) => {
    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current = new Audio(src);
    audioRef.current.play().catch((err) => {
      console.log("Audio play error:", err);
    });
  };

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
  }, [currentIndex]);

  const currentUI = useMemo(() => {
    return playlist[currentIndex]?.type;
  }, [currentIndex, playlist]);

  const handleNextWord = () => {
    const currentLetter = playlist[currentIndex]?.item?.letter || "";

    if (currentLetter && current.type === "UI1") {
      setLetters((prev) =>
        prev.includes(currentLetter) ? prev : [...prev, currentLetter]
      );
    }

    console.log("datas", currentIndex, playlist.length);

    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setLocalData("rStepZero", 1);
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
      console.log("finished r0");
    }
    setRecAudio(null);
    setIsNextButtonCalled(true);
    setEnableNext(false);
  };

  const handlePreviousWord = () => {
    if (currentIndex > 0) {
      const currentLetter = playlist[currentIndex]?.item?.letter || "";
      if (currentLetter && current.type === "UI1") {
        setLetters((prev) => prev.filter((letter) => letter !== currentLetter));
      }

      setCurrentIndex((i) => i - 1);
      setRecAudio(null);
      setIsNextButtonCalled(false);
      setEnableNext(false);
    }
  };

  const handleBackNavigation = () => {
    if (currentIndex > 0) {
      handlePreviousWord();
    } else {
      if (handleBack) {
        handleBack();
      } else {
        navigate(-1);
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
    setLetters([]);
  };

  const navy = "#1c2752";
  const red = "#C93128";
  const pink = "#ea4c89";
  const orange = "#f28b1d";
  const blue = "#f28b1d";

  const flowNames = [...new Set(data.map((item) => item.id))];

  const renderUI = () => {
    const cycleIndex = Math.floor(currentIndex / 20);
    const positionInCycle = currentIndex % 20;

    const current = playlist[currentIndex];
    if (!current) return null;

    //console.log('ui?', currentIndex, block, isUI1, letters);

    const totalLetters = data.length;
    const completedLetters = letters.length;

    // Calculate total items in playlist
    const totalItemsInPlaylist = playlist.length;

    const completionPercentage =
      totalLetters > 0
        ? Math.round((completedLetters / totalLetters) * 100)
        : 0;
    const UI1 = () => {
      //console.log("ui1", item, current);

      const TOTAL_ITEMS = lang === "en" ? 101 : 142;

      // FIXED: Use currentIndex + 1 instead of item?.id
      const currentItemNumber = currentIndex + 1;
      const completionPercentage = Math.round(
        (currentItemNumber / TOTAL_ITEMS) * 100
      );

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
            height: "60vh",
          }}
        >
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              width: "min(100%, 1024px)",
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
              paddingTop: 4,
              minHeight: "50vh",
            }}
          >
            {/* Progress container - right side */}
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "120px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  border: "2px solid #1CB0F6",
                  borderRadius: "50%",
                  padding: "6px 12px",
                  fontFamily: "Quicksand",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#000",
                  position: "relative",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  marginBottom: "-8px",
                }}
              >
                {currentItemNumber}/{TOTAL_ITEMS}
              </Box>

              <Box
                sx={{
                  width: "100%",
                  height: "18px",
                  backgroundColor: "#E3F2FD",
                  borderRadius: "20px",
                  overflow: "hidden",
                  position: "relative",
                  zIndex: 1,
                  border: "2px solid #BBDEFB",
                }}
              >
                <Box
                  sx={{
                    width: `${completionPercentage}%`,
                    height: "100%",
                    backgroundColor: "#1CB0F6",
                    borderRadius: "20px",
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>
            </Box>

            {/* Title container - left side */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "24px",
                padding: "14px 18px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "2px solid #FF9800",
                zIndex: 10,
                backdropFilter: "blur(5px)",
                minWidth: "140px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Quicksand",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "#FF9800",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </Typography>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                position: "relative",
                mb: 0,
                mt: 0.5,
              }}
            >
              <img
                src={trainImg}
                alt="train"
                style={{
                  width: "100%",
                  maxWidth: "480px",
                  maxHeight: "70px",
                  objectFit: "contain",
                  marginTop: "2px",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: "-11%",
                  left: "68%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 0.6,
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
                          minWidth: 60,
                          minHeight: 60,
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          background: COLORS[i % COLORS.length],
                          boxShadow: 2,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Quicksand",
                            color: "#FFFFFF",
                            fontSize: "28px",
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

            <Box
              sx={{
                width: "75%",
                maxWidth: 380,
                height: "auto",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #1CB0F6",
                borderRadius: "14px",
                backgroundColor: "#F1FAFE",
                mb: 0.5,
                padding: "4px",
                marginTop: 1,
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: red,
                  fontWeight: 500,
                  fontSize: { xs: 50, md: 75 },
                  lineHeight: 1,
                  fontFamily: "Quicksand",
                  flex: 1,
                  textAlign: "center",
                  p: 0.2,
                }}
              >
                {item.letters.length > 1 ? (
                  <>
                    <span style={{ color: "#C93128" }}>{item.letters[0]}</span>
                    <span style={{ color: "#1c2752" }}>{item.letters[1]}</span>
                    {item.letters.slice(2)}
                  </>
                ) : (
                  <span style={{ color: "red" }}>{item.letters}</span>
                )}
              </Typography>

              <Box
                sx={{
                  width: "1px",
                  backgroundColor: "#1CB0F6",
                  alignSelf: "stretch",
                }}
              />

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0.2,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.word}
                  sx={{
                    width: { xs: 60, md: 85 },
                    height: { xs: 60, md: 85 },
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: 24, md: 34 },
                letterSpacing: 1,
                display: "flex",
                alignItems: "center",
                fontFamily: "Quicksand",
                gap: 0.4,
                textAlign: "center",
                flexWrap: "wrap",
                justifyContent: "center",
                mb: 0.3,
                mt: 0.3,
              }}
            >
              {item?.word?.split("").map((ch, idx) => (
                <Box
                  key={idx}
                  component="span"
                  sx={{
                    color:
                      ch.toLowerCase() === item?.letter?.toLowerCase()
                        ? red
                        : navy,
                  }}
                >
                  {ch}
                </Box>
              ))}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                zIndex: 10,
                justifyContent: "center",
                alignItems: "center",
                mb: 1,
                mt: 1,
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
                  boxShadow: "0 6px 14px rgba(234,76,137,0.35)",
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
                  boxShadow: "0 6px 14px rgba(242,139,29,0.35)",
                  "&:hover": { bgcolor: orange },
                }}
              >
                <ArrowRight size={22} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      );
    };
    const UI2 = () => {
      //console.log("ui2");

      const TOTAL_ITEMS = lang === "en" ? 101 : 142;

      const currentItemNumber = currentIndex + 1;
      const completionPercentage = Math.round(
        (currentItemNumber / TOTAL_ITEMS) * 100
      );

      const renderHighlightedWord = (word, targetLetter) => {
        if (!word || !targetLetter) return word;

        const lowerWord = word.toLowerCase();
        const lowerTarget = targetLetter.toLowerCase();

        const letterIndex = lowerWord.indexOf(lowerTarget);

        if (letterIndex === -1) {
          return word;
        }

        const before = word.substring(0, letterIndex);
        const letter = word.substring(
          letterIndex,
          letterIndex + targetLetter.length
        );
        const after = word.substring(letterIndex + targetLetter.length);

        return (
          <>
            {before}
            <span style={{ color: "#FF0000", fontWeight: "bold" }}>
              {letter}
            </span>
            {after}
          </>
        );
      };

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
              padding: "20px 0",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "120px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  border: "2px solid #1CB0F6",
                  borderRadius: "50%",
                  padding: "6px 12px",
                  fontFamily: "Quicksand",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#000",
                  position: "relative",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  marginBottom: "-8px",
                }}
              >
                {currentItemNumber}/{TOTAL_ITEMS}
              </Box>

              <Box
                sx={{
                  width: "100%",
                  height: "18px",
                  backgroundColor: "#E3F2FD",
                  borderRadius: "20px",
                  overflow: "hidden",
                  position: "relative",
                  zIndex: 1,
                  border: "2px solid #BBDEFB",
                }}
              >
                <Box
                  sx={{
                    width: `${completionPercentage}%`,
                    height: "100%",
                    backgroundColor: "#1CB0F6",
                    borderRadius: "20px",
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>
            </Box>

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
                width: "200px",
                minWidth: "200px",
                flexShrink: 0,
                marginTop: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    color: "#333F61",
                    fontWeight: 700,
                    fontSize: "50px",
                    lineHeight: "1",
                    letterSpacing: "2%",
                    fontFamily: "Quicksand",
                  }}
                >
                  {renderHighlightedWord(item.word, item.letter)}
                </span>
              </Box>

              {recAudio && (
                <Box
                  sx={{
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "8px",
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
                marginTop: "0px",
                padding: "10px 10px",
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
                audioLink={singleAudio}
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
    if (current.type === "UI1") {
      return UI1(current.item);
    } else {
      return UI2(current.item);
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
      parentWords={parentWords}
      flowNames={flowNames}
      handleBack={handleBackNavigation}
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
      <Box
        sx={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {renderUI()}
      </Box>
    </MainLayout>
  );
};

export default R0;
