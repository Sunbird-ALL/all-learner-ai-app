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
    letter: "E",
    items: [
      {
        id: 1,
        title: "Consonant Sounds",
        letters: "Ee",
        letter: "e",
        word: "Egg",
        image: getAssetUrl(s3Assets.eggFiveImg),
        audio: getAssetAudioUrl(s3Assets.eggPhonemeAudio),
        singleAudio: s3Assets.EPhonemeAudio,
      },
      {
        id: 2,
        title: "Consonant Sounds",
        letters: "Ee",
        letter: "e",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFourteenImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: s3Assets.EPhonemeAudio,
      },
      {
        id: 3,
        title: "Consonant Sounds",
        letters: "Ee",
        letter: "e",
        word: "Kite",
        image: getAssetUrl(s3Assets.kiteFiveImg),
        audio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        singleAudio: s3Assets.EPhonemeAudio,
      },
    ],
  },
  {
    letter: "A",
    items: [
      {
        id: 4,
        title: "Consonant Sounds",
        letters: "Aa",
        letter: "a",
        word: "Apple",
        image: getAssetUrl(s3Assets.appleOneImg),
        audio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        singleAudio: s3Assets.APhonemeAudio,
      },
      {
        id: 5,
        title: "Consonant Sounds",
        letters: "Aa",
        letter: "a",
        word: "Cat",
        image: getAssetUrl(s3Assets.catOneImg),
        audio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        singleAudio: s3Assets.APhonemeAudio,
      },
      {
        id: 6,
        title: "Consonant Sounds",
        letters: "Aa",
        letter: "a",
        word: "Pea",
        image: getAssetUrl(s3Assets.peaOneImg),
        audio: getAssetAudioUrl(s3Assets.peaPhonemeAudio),
        singleAudio: s3Assets.APhonemeAudio,
      },
    ],
  },
  {
    letter: "O",
    items: [
      {
        id: 7,
        title: "Consonant Sounds",
        letters: "Oo",
        letter: "o",
        word: "Orange",
        image: getAssetUrl(s3Assets.orangeFifteenImg),
        audio: getAssetAudioUrl(s3Assets.orangePhonemeAudio),
        singleAudio: s3Assets.OPhonemeAudio,
      },
      {
        id: 8,
        title: "Consonant Sounds",
        letters: "Oo",
        letter: "o",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogSevenImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: s3Assets.OPhonemeAudio,
      },
      {
        id: 9,
        title: "Consonant Sounds",
        letters: "Oo",
        letter: "o",
        word: "Mango",
        image: getAssetUrl(s3Assets.mangoThirteenImg),
        audio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        singleAudio: s3Assets.OPhonemeAudio,
      },
    ],
  },
  {
    letter: "I",
    items: [
      {
        id: 10,
        title: "Consonant Sounds",
        letters: "Ii",
        letter: "i",
        word: "Ice",
        image: getAssetUrl(s3Assets.iceThreeImg),
        audio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        singleAudio: s3Assets.IPhonemeAudio,
      },
      {
        id: 11,
        title: "Consonant Sounds",
        letters: "Ii",
        letter: "i",
        word: "Pig",
        image: getAssetUrl(s3Assets.pigNineImg),
        audio: getAssetAudioUrl(s3Assets.pigPhonemeAudio),
        singleAudio: s3Assets.IPhonemeAudio,
      },
      {
        id: 12,
        title: "Consonant Sounds",
        letters: "Ii",
        letter: "i",
        word: "Dhobi",
        image: getAssetUrl(s3Assets.dhobiNineImg),
        audio: getAssetAudioUrl(s3Assets.dhobiPhonemeAudio),
        singleAudio: s3Assets.IPhonemeAudio,
      },
    ],
  },
  {
    letter: "U",
    items: [
      {
        id: 13,
        title: "Consonant Sounds",
        letters: "Uu",
        letter: "u",
        word: "Umbrella",
        image: getAssetUrl(s3Assets.umbrellaTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudio),
        singleAudio: s3Assets.UPhonemeAudio,
      },
      {
        id: 14,
        title: "Consonant Sounds",
        letters: "Uu",
        letter: "u",
        word: "Dustbin",
        image: getAssetUrl(s3Assets.DustbinTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.dustbinPhonemeAudio),
        singleAudio: s3Assets.UPhonemeAudio,
      },
      {
        id: 15,
        title: "Consonant Sounds",
        letters: "Uu",
        letter: "u",
        word: "Laddu",
        image: getAssetUrl(s3Assets.LadduTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.ladduPhonemeAudio),
        singleAudio: s3Assets.UPhonemeAudio,
      },
    ],
  },
  {
    letter: "T",
    items: [
      {
        id: 16,
        title: "Consonant Sounds",
        letters: "Tt",
        letter: "t",
        word: "Tiger",
        image: getAssetUrl(s3Assets.tigerSevenImg),
        audio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
        singleAudio: s3Assets.TPhonemeAudio,
      },
      {
        id: 17,
        title: "Consonant Sounds",
        letters: "Tt",
        letter: "t",
        word: "Watch",
        image: getAssetUrl(s3Assets.watchTwentyImg),
        audio: getAssetAudioUrl(s3Assets.watchPhonemeAudio),
        singleAudio: s3Assets.TPhonemeAudio,
      },
      {
        id: 18,
        title: "Consonant Sounds",
        letters: "Tt",
        letter: "t",
        word: "Plant",
        image: getAssetUrl(s3Assets.plantTwentyImg),
        audio: getAssetAudioUrl(s3Assets.plantPhonemeAudio),
        singleAudio: s3Assets.TPhonemeAudio,
      },
    ],
  },
  {
    letter: "N",
    items: [
      {
        id: 19,
        title: "Consonant Sounds",
        letters: "Nn",
        letter: "n",
        word: "Nest",
        image: getAssetUrl(s3Assets.NestFourteenImg),
        audio: getAssetAudioUrl(s3Assets.nestPhonemeAudio),
        singleAudio: s3Assets.NPhonemeAudio,
      },
      {
        id: 20,
        title: "Consonant Sounds",
        letters: "Nn",
        letter: "n",
        word: "Honey",
        image: getAssetUrl(s3Assets.HoneyFourteenImg),
        audio: getAssetAudioUrl(s3Assets.honeyPhonemeAudio),
        singleAudio: s3Assets.NPhonemeAudio,
      },
      {
        id: 21,
        title: "Consonant Sounds",
        letters: "Nn",
        letter: "n",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFiveImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: s3Assets.NPhonemeAudio,
      },
    ],
  },
  {
    letter: "S",
    items: [
      {
        id: 22,
        title: "Consonant Sounds",
        letters: "Ss",
        letter: "s",
        word: "Sun",
        image: getAssetUrl(s3Assets.sunNineteenImg),
        audio: getAssetAudioUrl(s3Assets.sunPhonemeAudio),
        singleAudio: s3Assets.SPhonemeAudio,
      },
      {
        id: 23,
        title: "Consonant Sounds",
        letters: "Ss",
        letter: "s",
        word: "Horse",
        image: getAssetUrl(s3Assets.horseNineteenImg),
        audio: getAssetAudioUrl(s3Assets.horsePhonemeAudio),
        singleAudio: s3Assets.SPhonemeAudio,
      },
      {
        id: 24,
        title: "Consonant Sounds",
        letters: "Ss",
        letter: "s",
        word: "Bus",
        image: getAssetUrl(s3Assets.busNineteenImg),
        audio: getAssetAudioUrl(s3Assets.busPhonemeAudio),
        singleAudio: s3Assets.SPhonemeAudio,
      },
    ],
  },
  {
    letter: "R",
    items: [
      {
        id: 25,
        title: "Consonant Sounds",
        letters: "Rr",
        letter: "r",
        word: "Rat",
        image: getAssetUrl(s3Assets.ratEighteenImg),
        audio: getAssetAudioUrl(s3Assets.ratPhonemeAudio),
        singleAudio: s3Assets.RPhonemeAudio,
      },
      {
        id: 26,
        title: "Consonant Sounds",
        letters: "Rr",
        letter: "r",
        word: "Carrot",
        image: getAssetUrl(s3Assets.carrotEighteenImg),
        audio: getAssetAudioUrl(s3Assets.carrotPhonemeAudio),
        singleAudio: s3Assets.RPhonemeAudio,
      },
      {
        id: 27,
        title: "Consonant Sounds",
        letters: "Rr",
        letter: "r",
        word: "Car",
        image: getAssetUrl(s3Assets.carEighteenImg),
        audio: getAssetAudioUrl(s3Assets.carPhonemeAudio),
        singleAudio: s3Assets.RPhonemeAudio,
      },
    ],
  },
  {
    letter: "H",
    items: [
      {
        id: 28,
        title: "Consonant Sounds",
        letters: "Hh",
        letter: "h",
        word: "Hand",
        image: getAssetUrl(s3Assets.handEightImg),
        audio: getAssetAudioUrl(s3Assets.handPhonemeAudio),
        singleAudio: s3Assets.HPhonemeAudio,
      },
      {
        id: 29,
        title: "Consonant Sounds",
        letters: "Hh",
        letter: "h",
        word: "Teacher",
        image: getAssetUrl(s3Assets.teacherEightImg),
        audio: getAssetAudioUrl(s3Assets.teacherPhonemeAudio),
        singleAudio: s3Assets.HPhonemeAudio,
      },
      {
        id: 30,
        title: "Consonant Sounds",
        letters: "HH",
        letter: "h",
        word: "Earth",
        image: getAssetUrl(s3Assets.earthEightImg),
        audio: getAssetAudioUrl(s3Assets.earthPhonemeAudio),
        singleAudio: s3Assets.HPhonemeAudio,
      },
    ],
  },
  {
    letter: "L",
    items: [
      {
        id: 31,
        title: "Consonant Sounds",
        letters: "Ll",
        letter: "l",
        word: "Lion",
        image: getAssetUrl(s3Assets.LionTwelveImg),
        audio: getAssetAudioUrl(s3Assets.lionPhonemeAudio),
        singleAudio: s3Assets.LPhonemeAudio,
      },
      {
        id: 32,
        title: "Consonant Sounds",
        letters: "Ll",
        letter: "l",
        word: "Balloon",
        image: getAssetUrl(s3Assets.ballTwoImg),
        audio: getAssetAudioUrl(s3Assets.balloonPhonemeAudio),
        singleAudio: s3Assets.LPhonemeAudio,
      },
      {
        id: 33,
        title: "Consonant Sounds",
        letters: "Ll",
        letter: "l",
        word: "Bell",
        image: getAssetUrl(s3Assets.bellTwelveImg),
        audio: getAssetAudioUrl(s3Assets.bellPhonemeAudio),
        singleAudio: s3Assets.LPhonemeAudio,
      },
    ],
  },
  {
    letter: "D",
    items: [
      {
        id: 34,
        title: "Consonant Sounds",
        letters: "Dd",
        letter: "d",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogFourImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: s3Assets.DPhonemeAudio,
      },
      {
        id: 35,
        title: "Consonant Sounds",
        letters: "Dd",
        letter: "d",
        word: "Window",
        image: getAssetUrl(s3Assets.windowFourImg),
        audio: getAssetAudioUrl(s3Assets.windowPhonemeAudio),
        singleAudio: s3Assets.DPhonemeAudio,
      },
      {
        id: 36,
        title: "Consonant Sounds",
        letters: "Dd",
        letter: "d",
        word: "Sword",
        image: getAssetUrl(s3Assets.swordFourImg),
        audio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
        singleAudio: s3Assets.DPhonemeAudio,
      },
    ],
  },
  {
    letter: "C",
    items: [
      {
        id: 37,
        title: "Consonant Sounds",
        letters: "Cc",
        letter: "c",
        word: "Cat",
        image: getAssetUrl(s3Assets.catOneImg),
        audio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        singleAudio: s3Assets.CPhonemeAudio,
      },
      {
        id: 38,
        title: "Consonant Sounds",
        letters: "Cc",
        letter: "c",
        word: "Ice",
        image: getAssetUrl(s3Assets.iceThreeImg),
        audio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        singleAudio: s3Assets.CPhonemeAudio,
      },
      {
        id: 39,
        title: "Consonant Sounds",
        letters: "Cc",
        letter: "c",
        word: "Garlic",
        image: getAssetUrl(s3Assets.garlicThreeImg),
        audio: getAssetAudioUrl(s3Assets.garlicPhonemeAudio),
        singleAudio: s3Assets.CPhonemeAudio,
      },
    ],
  },
  {
    letter: "M",
    items: [
      {
        id: 40,
        title: "Consonant Sounds",
        letters: "Mm",
        letter: "m",
        word: "Mango",
        image: getAssetUrl(s3Assets.mangoThirteenImg),
        audio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        singleAudio: s3Assets.MPhonemeAudio,
      },
      {
        id: 41,
        title: "Consonant Sounds",
        letters: "Mm",
        letter: "m",
        word: "Lemon",
        image: getAssetUrl(s3Assets.lemonThirteenImg),
        audio: getAssetAudioUrl(s3Assets.lemonPhonemeAudio),
        singleAudio: s3Assets.MPhonemeAudio,
      },
      {
        id: 42,
        title: "Consonant Sounds",
        letters: "Mm",
        letter: "m",
        word: "Jam",
        image: getAssetUrl(s3Assets.jamTenImg),
        audio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
        singleAudio: s3Assets.MPhonemeAudio,
      },
    ],
  },
  {
    letter: "F",
    items: [
      {
        id: 43,
        title: "Consonant Sounds",
        letters: "Ff",
        letter: "f",
        word: "Fish",
        image: getAssetUrl(s3Assets.fishSixImg),
        audio: getAssetAudioUrl(s3Assets.fishPhonemeAudio),
        singleAudio: s3Assets.FPhonemeAudio,
      },
      {
        id: 44,
        title: "Consonant Sounds",
        letters: "Ff",
        letter: "f",
        word: "Giraffe",
        image: getAssetUrl(s3Assets.girraffeSixImg),
        audio: getAssetAudioUrl(s3Assets.giraffePhonemeAudio),
        singleAudio: s3Assets.FPhonemeAudio,
      },
      {
        id: 45,
        title: "Consonant Sounds",
        letters: "Ff",
        letter: "f",
        word: "Leaf",
        image: getAssetUrl(s3Assets.LeafSixImg),
        audio: getAssetAudioUrl(s3Assets.leafPhonemeAudio),
        singleAudio: s3Assets.FPhonemeAudio,
      },
    ],
  },
  {
    letter: "Y",
    items: [
      {
        id: 46,
        title: "Consonant Sounds",
        letters: "Yy",
        letter: "y",
        word: "Yak",
        image: getAssetUrl(s3Assets.yakTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.yakPhonemeAudio),
        singleAudio: s3Assets.YPhonemeAudio,
      },
      {
        id: 47,
        title: "Consonant Sounds",
        letters: "Yy",
        letter: "y",
        word: "Papaya",
        image: getAssetUrl(s3Assets.papayaTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.papayaPhonemeAudio),
        singleAudio: s3Assets.YPhonemeAudio,
      },
      {
        id: 48,
        title: "Consonant Sounds",
        letters: "Yy",
        letter: "y",
        word: "Key",
        image: getAssetUrl(s3Assets.KeyTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.keyPhonemeAudio),
        singleAudio: s3Assets.YPhonemeAudio,
      },
    ],
  },
  {
    letter: "W",
    items: [
      {
        id: 49,
        title: "Consonant Sounds",
        letters: "Ww",
        letter: "w",
        word: "Window",
        image: getAssetUrl(s3Assets.windowFourImg),
        audio: getAssetAudioUrl(s3Assets.earthPhonemeAudio),
        singleAudio: s3Assets.WPhonemeAudio,
      },
      {
        id: 50,
        title: "Consonant Sounds",
        letters: "Ww",
        letter: "w",
        word: "Sword",
        image: getAssetUrl(s3Assets.swordFourImg),
        audio: getAssetAudioUrl(s3Assets.swordPhonemeAudio),
        singleAudio: s3Assets.WPhonemeAudio,
      },
      {
        id: 51,
        title: "Consonant Sounds",
        letters: "Ww",
        letter: "w",
        word: "Crow",
        image: getAssetUrl(s3Assets.CrowTwentyThreeImg),
        audio: getAssetAudioUrl(s3Assets.crowPhonemeAudio),
        singleAudio: s3Assets.WPhonemeAudio,
      },
    ],
  },
  {
    letter: "G",
    items: [
      {
        id: 52,
        title: "Consonant Sounds",
        letters: "Gg",
        letter: "g",
        word: "Goat",
        image: getAssetUrl(s3Assets.goatSevenImg),
        audio: getAssetAudioUrl(s3Assets.goatPhonemeAudio),
        singleAudio: s3Assets.GPhonemeAudio,
      },
      {
        id: 53,
        title: "Consonant Sounds",
        letters: "Gg",
        letter: "g",
        word: "Tiger",
        image: getAssetUrl(s3Assets.tigerSevenImg),
        audio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
        singleAudio: s3Assets.GPhonemeAudio,
      },
      {
        id: 54,
        title: "Consonant Sounds",
        letters: "Gg",
        letter: "g",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogFourImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: s3Assets.GPhonemeAudio,
      },
    ],
  },
  {
    letter: "P",
    items: [
      {
        id: 55,
        title: "Consonant Sounds",
        letters: "Pp",
        letter: "p",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFiveImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: s3Assets.PPhonemeAudio,
      },
      {
        id: 56,
        title: "Consonant Sounds",
        letters: "Pp",
        letter: "p",
        word: "Apple",
        image: getAssetUrl(s3Assets.appleOneImg),
        audio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        singleAudio: s3Assets.PPhonemeAudio,
      },
      {
        id: 57,
        title: "Consonant Sounds",
        letters: "Pp",
        letter: "p",
        word: "Cap",
        image: getAssetUrl(s3Assets.capSixteenImg),
        audio: getAssetAudioUrl(s3Assets.capPhonemeAudio),
        singleAudio: s3Assets.PPhonemeAudio,
      },
    ],
  },
  {
    letter: "B",
    items: [
      {
        id: 58,
        title: "Consonant Sounds",
        letters: "Bb",
        letter: "b",
        word: "Ball",
        image: getAssetUrl(s3Assets.ballGif),
        audio: getAssetAudioUrl(s3Assets.ballPhonemeAudio),
        singleAudio: s3Assets.BPhonemeAudio,
      },
      {
        id: 59,
        title: "Consonant Sounds",
        letters: "Bb",
        letter: "b",
        word: "Zebra",
        image: getAssetUrl(s3Assets.zebraTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
        singleAudio: s3Assets.BPhonemeAudio,
      },
      {
        id: 60,
        title: "Consonant Sounds",
        letters: "Bb",
        letter: "b",
        word: "Cub",
        image: getAssetUrl(s3Assets.cubTwoImg),
        audio: getAssetAudioUrl(s3Assets.cubPhonemeAudio),
        singleAudio: s3Assets.BPhonemeAudio,
      },
    ],
  },
  {
    letter: "V",
    items: [
      {
        id: 61,
        title: "Consonant Sounds",
        letters: "Vv",
        letter: "v",
        word: "Van",
        image: getAssetUrl(s3Assets.VanTwentyTwoImg),
        audio: getAssetAudioUrl(s3Assets.vanPhonemeAudio),
        singleAudio: s3Assets.VPhonemeAudio,
      },
      {
        id: 62,
        title: "Consonant Sounds",
        letters: "Vv",
        letter: "v",
        word: "Guava",
        image: getAssetUrl(s3Assets.GuavaTwentyTwoImg),
        audio: getAssetAudioUrl(s3Assets.guavaPhonemeAudio),
        singleAudio: s3Assets.VPhonemeAudio,
      },
    ],
  },
  {
    letter: "K",
    items: [
      {
        id: 64,
        title: "Consonant Sounds",
        letters: "Kk",
        letter: "k",
        word: "Kite",
        image: getAssetUrl(s3Assets.kiteFiveImg),
        audio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        singleAudio: s3Assets.KPhonemeAudio,
      },
      {
        id: 65,
        title: "Consonant Sounds",
        letters: "Kk",
        letter: "k",
        word: "Monkey",
        image: getAssetUrl(s3Assets.monkeyElevenImg),
        audio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudio),
        singleAudio: s3Assets.KPhonemeAudio,
      },
      {
        id: 66,
        title: "Consonant Sounds",
        letters: "Kk",
        letter: "k",
        word: "Book",
        image: getAssetUrl(s3Assets.bookElevenImg),
        audio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
        singleAudio: s3Assets.KPhonemeAudio,
      },
    ],
  },
  {
    letter: "J",
    items: [
      {
        id: 67,
        title: "Consonant Sounds",
        letters: "Jj",
        letter: "j",
        word: "Jam",
        image: getAssetUrl(s3Assets.jamTenImg),
        audio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
        singleAudio: s3Assets.JPhonemeAudio,
      },
      {
        id: 68,
        title: "Consonant Sounds",
        letters: "Jj",
        letter: "j",
        word: "brinjal",
        image: getAssetUrl(s3Assets.brinjalTenImg),
        audio: getAssetAudioUrl(s3Assets.brinjalPhonemeAudio),
        singleAudio: s3Assets.JPhonemeAudio,
      },
      // {
      //   id: 69,
      //   title: "Consonant Sounds",
      //   letters: "Jj",
      //   letter: "j",
      //   word: "Raj",
      //   image: getAssetUrl(s3Assets.rajTenImg),
      //   audio: getAssetAudioUrl(s3Assets.rajPhonemeAudio),
      //   singleAudio: s3Assets.JPhonemeAudio,
      // },
    ],
  },
  {
    letter: "X",
    items: [
      {
        id: 70,
        title: "Consonant Sounds",
        letters: "Xx",
        letter: "x",
        word: "Xray",
        image: getAssetUrl(s3Assets.xrayTwentyFourImg),
        audio: getAssetAudioUrl(s3Assets.xrayPhonemeAudio),
        singleAudio: s3Assets.XPhonemeAudio,
      },
      {
        id: 71,
        title: "Consonant Sounds",
        letters: "Xx",
        letter: "x",
        word: "Textbook",
        image: getAssetUrl(s3Assets.bookElevenImg),
        audio: getAssetAudioUrl(s3Assets.textbookPhonemeAudio),
        singleAudio: s3Assets.XPhonemeAudio,
      },
      {
        id: 72,
        title: "Consonant Sounds",
        letters: "Xx",
        letter: "x",
        word: "Fox",
        image: getAssetUrl(s3Assets.foxTwentyFourImg),
        audio: getAssetAudioUrl(s3Assets.foxPhonemeAudio),
        singleAudio: s3Assets.XPhonemeAudio,
      },
    ],
  },
  {
    letter: "Q",
    items: [
      {
        id: 73,
        title: "Consonant Sounds",
        letters: "Qq",
        letter: "q",
        word: "Queen",
        image: getAssetUrl(s3Assets.queenSixteenImg),
        audio: getAssetAudioUrl(s3Assets.queenPhonemeAudio),
        singleAudio: s3Assets.QPhonemeAudio,
      },
      {
        id: 74,
        title: "Consonant Sounds",
        letters: "Qq",
        letter: "q",
        word: "Mosquito",
        image: getAssetUrl(s3Assets.mosquitoSeventeenImg),
        audio: getAssetAudioUrl(s3Assets.mosquitoPhonemeAudio),
        singleAudio: s3Assets.QPhonemeAudio,
      },
    ],
  },
  {
    letter: "Z",
    items: [
      {
        id: 76,
        title: "Consonant Sounds",
        letters: "Zz",
        letter: "z",
        word: "Zebra",
        image: getAssetUrl(s3Assets.zebraTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.cubPhonemeAudio),
        singleAudio: s3Assets.ZPhonemeAudio,
      },
      {
        id: 77,
        title: "Consonant Sounds",
        letters: "Zz",
        letter: "z",
        word: "Puzzle",
        image: getAssetUrl(s3Assets.PuzzleTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.cubPhonemeAudio),
        singleAudio: s3Assets.ZPhonemeAudio,
      },
      {
        id: 78,
        title: "Consonant Sounds",
        letters: "Zz",
        letter: "z",
        word: "Quiz",
        image: getAssetUrl(s3Assets.PuzzleTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.quizPhonemeAudio),
        singleAudio: s3Assets.ZPhonemeAudio,
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
        title: "Consonant Sounds",
        letters: "ಅ",
        letter: "ಅ",
        word: "ಅರಸ",
        image: getAssetUrl(s3Assets.kingAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.kingAlpAudio),
        singleAudio: s3Assets.aFirstAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಆ",
    items: [
      {
        id: 2,
        title: "Consonant Sounds",
        letters: "ಆ",
        letter: "ಆ",
        word: "ಆನೆ",
        image: getAssetUrl(s3Assets.elephentAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.elephantAlpAudio),
        singleAudio: s3Assets.aa2ndAudio,
      },
    ],
  },
  {
    letter: "ಇ",
    items: [
      {
        id: 3,
        title: "Consonant Sounds",
        letters: "ಇ",
        letter: "ಇ",
        word: "ಇಲಿ",
        image: getAssetUrl(s3Assets.ratAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.mouseAlpAudio),
        singleAudio: s3Assets.i3rdAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಈ",
    items: [
      {
        id: 4,
        title: "Consonant Sounds",
        letters: "ಈ",
        letter: "ಈ",
        word: "ಈಜು",
        image: getAssetUrl(s3Assets.swimAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.swimAlpAudio),
        singleAudio: s3Assets.ii4thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಉ",
    items: [
      {
        id: 5,
        title: "Consonant Sounds",
        letters: "ಉ",
        letter: "ಉ",
        word: "ಉದರ",
        image: getAssetUrl(s3Assets.bellyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.bellyAlpAudio),
        singleAudio: s3Assets.u5thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಊ",
    items: [
      {
        id: 6,
        title: "Consonant Sounds",
        letters: "ಊ",
        letter: "ಊ",
        word: "ಊಟ",
        image: getAssetUrl(s3Assets.foodAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.mealAlpAudio),
        singleAudio: s3Assets.uu6thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಋ",
    items: [
      {
        id: 7,
        title: "Consonant Sounds",
        letters: "ಋ",
        letter: "ಋ",
        word: "ಋಷಿ",
        image: getAssetUrl(s3Assets.monkAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.sageAlpAudio),
        singleAudio: s3Assets.ru7thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಎ",
    items: [
      {
        id: 8,
        title: "Consonant Sounds",
        letters: "ಎ",
        letter: "ಎ",
        word: "ಎಲೆ",
        image: getAssetUrl(s3Assets.leafAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.leafAlpAudio),
        singleAudio: s3Assets.e8thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಏ",
    items: [
      {
        id: 9,
        title: "Consonant Sounds",
        letters: "ಏ",
        letter: "ಏ",
        word: "ಏಣಿ",
        image: getAssetUrl(s3Assets.stairAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.ladderAlpAudio),
        singleAudio: s3Assets.ee9thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಐ",
    items: [
      {
        id: 10,
        title: "Consonant Sounds",
        letters: "ಐ",
        letter: "ಐ",
        word: "ಐದು",
        image: getAssetUrl(s3Assets.fiveAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fiveAlpAudio),
        singleAudio: s3Assets.ai10thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಒ",
    items: [
      {
        id: 11,
        title: "Consonant Sounds",
        letters: "ಒ",
        letter: "ಒ",
        word: "ಒಂಟೆ",
        image: getAssetUrl(s3Assets.camelAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.camelAlpAudio),
        singleAudio: s3Assets.o11thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಓ",
    items: [
      {
        id: 12,
        title: "Consonant Sounds",
        letters: "ಓ",
        letter: "ಓ",
        word: "ಓಡು",
        image: getAssetUrl(s3Assets.runAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.runningAlpAudio),
        singleAudio: s3Assets.oo12thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಔ",
    items: [
      {
        id: 13,
        title: "Consonant Sounds",
        letters: "ಔ",
        letter: "ಔ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.medicineAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medicineAlpAudio),
        singleAudio: s3Assets.au13thAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಕ",
    items: [
      {
        id: 14,
        title: "Consonant Sounds",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಕಮಲ",
        image: getAssetUrl(s3Assets.lotusAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.lotusAlpAudio),
        singleAudio: s3Assets.kaAudio,
      },
      {
        id: 15,
        title: "Consonant Sounds",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಏಕದಳ",
        image: getAssetUrl(s3Assets.cerealAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.seedCornGrainAlpAudio),
        singleAudio: s3Assets.kaAudio,
      },
      {
        id: 16,
        title: "Consonant Sounds",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಪದಕ",
        image: getAssetUrl(s3Assets.medalAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medalAlpAudio),
        singleAudio: s3Assets.kaAudio,
      },
    ],
  },
  {
    letter: "ಖ",
    items: [
      {
        id: 17,
        title: "Consonant Sounds",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಖಡ್ಗ",
        image: getAssetUrl(s3Assets.swordAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.swordAlpAudio),
        singleAudio: s3Assets.khaAudio,
      },
      {
        id: 18,
        title: "Consonant Sounds",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಲೇಖನಿ",
        image: getAssetUrl(s3Assets.penAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.penAlpAudio),
        singleAudio: s3Assets.khaAudio,
      },
      {
        id: 19,
        title: "Consonant Sounds",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಪಂಖ",
        image: getAssetUrl(s3Assets.fanAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fanAlpAudio),
        singleAudio: s3Assets.khaAudio,
      },
    ],
  },
  {
    letter: "ಗ",
    items: [
      {
        id: 20,
        title: "Consonant Sounds",
        letters: "ग",
        letter: "ಗ",
        word: "ಗರಿ",
        image: getAssetUrl(s3Assets.featherAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.featherAlpAudio),
        singleAudio: s3Assets.gaAudio,
      },
      {
        id: 21,
        title: "Consonant Sounds",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಆಗಸ",
        image: getAssetUrl(s3Assets.skyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.skyAlpAudio),
        singleAudio: s3Assets.gaAudio,
      },
      {
        id: 22,
        title: "Consonant Sounds",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಉರಗ",
        image: getAssetUrl(s3Assets.snakeAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.snakeAlpAudio),
        singleAudio: s3Assets.gaAudio,
      },
    ],
  },
  {
    letter: "ಘ",
    items: [
      {
        id: 23,
        title: "Consonant Sounds",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಘಂಟೆ",
        image: getAssetUrl(s3Assets.drumAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.bellAlpAudio),
        singleAudio: s3Assets.ghaAudio,
      },
      {
        id: 24,
        title: "Consonant Sounds",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಘಮಘಮ",
        image: getAssetUrl(s3Assets.fragranceAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fragranceAlpAudio),
        singleAudio: s3Assets.ghaAudio,
      },
      {
        id: 25,
        title: "Consonant Sounds",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಸಂಘ",
        image: getAssetUrl(s3Assets.childrenassociationAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.associationAlpAudio),
        singleAudio: s3Assets.ghaAudio,
      },
    ],
  },
  {
    letter: "ಚ",
    items: [
      {
        id: 26,
        title: "Consonant Sounds",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಚಮಚ",
        image: getAssetUrl(s3Assets.spoonAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.spoonAlpAudio),
        singleAudio: s3Assets.chaAudio,
      },
      {
        id: 27,
        title: "Consonant Sounds",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಈಚಲ",
        image: getAssetUrl(s3Assets.treeAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.palmAlpAudio),
        singleAudio: s3Assets.chaAudio,
      },
      {
        id: 28,
        title: "Consonant Sounds",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಮಂಚ",
        image: getAssetUrl(s3Assets.couchAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.cotAlpAudio),
        singleAudio: s3Assets.chaAudio,
      },
    ],
  },
  {
    letter: "ಜ",
    items: [
      {
        id: 29,
        title: "Consonant Sounds",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಜನ",
        image: getAssetUrl(s3Assets.peopleAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.peopleAlpAudio),
        singleAudio: s3Assets.jaAudio,
      },
      {
        id: 30,
        title: "Consonant Sounds",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಗೀಜಗ",
        image: getAssetUrl(s3Assets.birdAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.weaverbirdAlpAudio),
        singleAudio: s3Assets.jaAudio,
      },
      {
        id: 31,
        title: "Consonant Sounds",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಭುಜ",
        image: getAssetUrl(s3Assets.shoulderAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.shoulderAlpAudio),
        singleAudio: s3Assets.jaAudio,
      },
    ],
  },
  {
    letter: "ಟ",
    items: [
      {
        id: 32,
        title: "Consonant Sounds",
        letters: "ಟ",
        letter: "ट",
        word: "ಟಗರು",
        image: getAssetUrl(s3Assets.sheepAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.maleSheepAlpAudio),
        singleAudio: s3Assets.ta3rdSeriesInKaAudio,
      },
      {
        id: 33,
        title: "Consonant Sounds",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಕಿಟಕಿ",
        image: getAssetUrl(s3Assets.windowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.windowAlpAudio),
        singleAudio: s3Assets.ta3rdSeriesInKaAudio,
      },
      {
        id: 34,
        title: "Consonant Sounds",
        letters: "ट",
        letter: "ಟ",
        word: "ಆಟ",
        image: getAssetUrl(s3Assets.weplayAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.playAlpAudio),
        singleAudio: s3Assets.ta3rdSeriesInKaAudio,
      },
    ],
  },
  {
    letter: "ಠ",
    items: [
      //{ id: 36, title: "Consonant Sounds", letters: "ಠ", letter: "ಠ", word: "ಠಕ್ಕ", image: getAssetUrl(s3Assets.thiefAlpTelImage), audio: getAssetAudioUrl(s3Assets.thiefAlpAudio), singleAudio: s3Assets.taAlphabetWithThiefAudio },
      {
        id: 35,
        title: "Consonant Sounds",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಕೊಠಡಿ",
        image: getAssetUrl(s3Assets.bedroomAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.roomAlpAudio),
        singleAudio: s3Assets.taAlphabetWithThiefAudio,
      },
      {
        id: 36,
        title: "Consonant Sounds",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಕಂಠ",
        image: getAssetUrl(s3Assets.neckAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.frontPartOfTheNeckAlpAudio),
        singleAudio: s3Assets.taAlphabetWithThiefAudio,
      },
    ],
  },
  {
    letter: "ಡ",
    items: [
      {
        id: 37,
        title: "Consonant Sounds",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಡಬ್ಬಿ",
        image: getAssetUrl(s3Assets.boxAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.smallBoxOrChestAlpAudio),
        singleAudio: s3Assets.daAlphabetWithContainerImageAudio,
      },
      {
        id: 38,
        title: "Consonant Sounds",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಕಡಲು",
        image: getAssetUrl(s3Assets.beachAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.oceanAlpAudio),
        singleAudio: s3Assets.daAlphabetWithContainerImageAudio,
      },
      {
        id: 39,
        title: "Consonant Sounds",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಗಿಡ",
        image: getAssetUrl(s3Assets.plantAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.plantAlpAudio),
        singleAudio: s3Assets.daAlphabetWithContainerImageAudio,
      },
    ],
  },
  {
    letter: "ಢ",
    items: [
      {
        id: 40,
        title: "Consonant Sounds",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಢಣಢಣ",
        image: getAssetUrl(s3Assets.drumAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.manRingingTheBellAlpAudio),
        singleAudio: s3Assets.dhaAlphabetWithSchoolBellImageAudio,
      },
      {
        id: 41,
        title: "Consonant Sounds",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಪ್ರೌಢಶಾಲೆ",
        image: getAssetUrl(s3Assets.schoolAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.highschoolAlpAudio),
        singleAudio: s3Assets.dhaAlphabetWithSchoolBellImageAudio,
      },
      {
        id: 42,
        title: "Consonant Sounds",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಗಾಢ",
        image: getAssetUrl(s3Assets.eggFiveImg),
        audio: getAssetAudioUrl(s3Assets.gaadhaNoImagAlpAudio),
        singleAudio: s3Assets.dhaAlphabetWithSchoolBellImageAudio,
      },
    ],
  },
  {
    letter: "ಣ",
    items: [
      {
        id: 43,
        title: "Consonant Sounds",
        letters: "ಣ",
        letter: "ಣ",
        word: "ಹಣತೆ",
        image: getAssetUrl(s3Assets.candleAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.earthenLampDiyaAlpAudio),
        singleAudio: s3Assets.naAlphabetWithMoneyImageAudio,
      },
      {
        id: 44,
        title: "Consonant Sounds",
        letters: "ಣ",
        letter: "ಣ",
        word: "ಹಣ",
        image: getAssetUrl(s3Assets.coinAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.moneyAlpAudio),
        singleAudio: s3Assets.naAlphabetWithMoneyImageAudio,
      },
    ],
  },
  {
    letter: "ತ",
    items: [
      {
        id: 45,
        title: "Consonant Sounds",
        letters: "ತ",
        letter: "ತ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.tabalaAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.tabalaAlpAudio),
        singleAudio: s3Assets.taAlphabetWithHeadImageAudio,
      },
      {
        id: 46,
        title: "Consonant Sounds",
        letters: "ತ",
        letter: "ತ",
        word: "ಸಂತಸ",
        image: getAssetUrl(s3Assets.happyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.joyHappyAlpAudio),
        singleAudio: s3Assets.taAlphabetWithHeadImageAudio,
      },
      {
        id: 47,
        title: "Consonant Sounds",
        letters: "ತ",
        letter: "ತ",
        word: "ಗಣಿತ",
        image: getAssetUrl(s3Assets.mathematicsAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.mathAlpAudio),
        singleAudio: s3Assets.taAlphabetWithHeadImageAudio,
      },
    ],
  },
  {
    letter: "ಥ",
    items: [
      {
        id: 48,
        title: "Consonant Sounds",
        letters: "ಥ",
        letter: "ಥ",
        word: "ಥಳಥಳ",
        image: getAssetUrl(s3Assets.necklaceAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.shiningNecklaceAlpAudio),
        singleAudio: s3Assets.thaAlphabetWithGlitteringChainImageAudio,
      },
      {
        id: 49,
        title: "Consonant Sounds",
        letters: "ಥ",
        letter: "ಥ",
        word: "ಥರಥರ",
        image: getAssetUrl(s3Assets.fearAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.shakingWithFearAlpAudio),
        singleAudio: s3Assets.thaAlphabetWithGlitteringChainImageAudio,
      },
      {
        id: 50,
        title: "Consonant Sounds",
        letters: "ಥ",
        letter: "ಥ",
        word: "ರಥ",
        image: getAssetUrl(s3Assets.horsechariotAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.chariotAlpAudio),
        singleAudio: s3Assets.thaAlphabetWithGlitteringChainImageAudio,
      },
    ],
  },
  {
    letter: "ದ",
    items: [
      {
        id: 51,
        title: "Consonant Sounds",
        letters: "ದ",
        letter: "ದ",
        word: "ದನ",
        image: getAssetUrl(s3Assets.cowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.cowAlpAudio),
        singleAudio: s3Assets.daAlphabetWithMysoreDasaraImageAudio,
      },
      {
        id: 52,
        title: "Consonant Sounds",
        letters: "ದ",
        letter: "ದ",
        word: "ಕೂದಲು",
        image: getAssetUrl(s3Assets.hairAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.hairAlpAudio),
        singleAudio: s3Assets.daAlphabetWithMysoreDasaraImageAudio,
      },
      {
        id: 53,
        title: "Consonant Sounds",
        letters: "ದ",
        letter: "ದ",
        word: "ಕಾಗದ",
        image: getAssetUrl(s3Assets.paperAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.paperAlpAudio),
        singleAudio: s3Assets.daAlphabetWithMysoreDasaraImageAudio,
      },
    ],
  },
  {
    letter: "ಧ",
    items: [
      {
        id: 54,
        title: "Consonant Sounds",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಧನ",
        image: getAssetUrl(s3Assets.treasureAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.assetMoneyAndJewelsAlpAudio),
        singleAudio: s3Assets.dhaWordWithAssetOrMoneyImageAudio,
      },
      {
        id: 55,
        title: "Consonant Sounds",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಬುಧವಾರ",
        image: getAssetUrl(s3Assets.wednesdayAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.wednesdayAlpAudio),
        singleAudio: s3Assets.dhaWordWithAssetOrMoneyImageAudio,
      },
      {
        id: 56,
        title: "Consonant Sounds",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.medicineAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medicineAlpAudio),
        singleAudio: s3Assets.dhaWordWithAssetOrMoneyImageAudio,
      },
    ],
  },
  {
    letter: "ನ",
    items: [
      {
        id: 57,
        title: "Consonant Sounds",
        letters: "ನ",
        letter: "ನ",
        word: "ನರಿ",
        image: getAssetUrl(s3Assets.foxAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.foxAlpAudio),
        singleAudio: s3Assets.naAlphabetWithFoxImageAudio,
      },
      {
        id: 58,
        title: "Consonant Sounds",
        letters: "ನ",
        letter: "ನ",
        word: "ಕನಸು",
        image: getAssetUrl(s3Assets.dreamAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.dreamAlpAudio),
        singleAudio: s3Assets.naAlphabetWithFoxImageAudio,
      },
      {
        id: 59,
        title: "Consonant Sounds",
        letters: "ನ",
        letter: "ನ",
        word: "ನಮನ",
        image: getAssetUrl(s3Assets.pranamAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.namasteAlpAudio),
        singleAudio: s3Assets.naAlphabetWithFoxImageAudio,
      },
    ],
  },
  {
    letter: "ಪ",
    items: [
      {
        id: 60,
        title: "Consonant Sounds",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಪದಕ",
        image: getAssetUrl(s3Assets.medalAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medalAlpAudio),
        singleAudio: s3Assets.paAlphabetWithCrackersAudio,
      },
      {
        id: 61,
        title: "Consonant Sounds",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಗಾಳಿಪಟ",
        image: getAssetUrl(s3Assets.kiteAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.kiteAlpAudio),
        singleAudio: s3Assets.paAlphabetWithCrackersAudio,
      },
      {
        id: 62,
        title: "Consonant Sounds",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಕೋಪ",
        image: getAssetUrl(s3Assets.angerAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.angryBoyAlpAudio),
        singleAudio: s3Assets.paAlphabetWithCrackersAudio,
      },
    ],
  },
  {
    letter: "ಫ",
    items: [
      {
        id: 63,
        title: "Consonant Sounds",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಫಲ",
        image: getAssetUrl(s3Assets.fruitAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fruitsAlpAudio),
        singleAudio: s3Assets.phaAlphabetWithFruitsImageAudio,
      },
      {
        id: 64,
        title: "Consonant Sounds",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಸೌರಫಲಕ",
        image: getAssetUrl(s3Assets.solarAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.solarPanelAlpAudio),
        singleAudio: s3Assets.phaAlphabetWithFruitsImageAudio,
      },
      {
        id: 65,
        title: "Consonant Sounds",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಕಫ",
        image: getAssetUrl(s3Assets.coughAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.phlegmAlpAudio),
        singleAudio: s3Assets.phaAlphabetWithFruitsImageAudio,
      },
    ],
  },
  {
    letter: "ಬ",
    items: [
      {
        id: 66,
        title: "Consonant Sounds",
        letters: "ಬ",
        letter: "ಬ",
        word: "ಬಟಾಣಿ",
        image: getAssetUrl(s3Assets.peasAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.greenPeasAlpAudio),
        singleAudio: s3Assets.baAlphabetBangleAudio,
      },
      {
        id: 67,
        title: "Consonant Sounds",
        letters: "ಬ",
        letter: "ಬ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.tabalaAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.tabalaaAlpAudio),
        singleAudio: s3Assets.baAlphabetBangleAudio,
      },
      {
        id: 68,
        title: "Consonant Sounds",
        letters: "ಬ",
        letter: "ಬ",
        word: "ಕುಟುಂಬ",
        image: getAssetUrl(s3Assets.familyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.familyAlpAudio),
        singleAudio: s3Assets.baAlphabetBangleAudio,
      },
    ],
  },
  {
    letter: "ಭ",
    items: [
      {
        id: 69,
        title: "Consonant Sounds",
        letters: "ಭ",
        letter: "ಭ",
        word: "ಭರಣಿ",
        image: getAssetUrl(s3Assets.boxAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.smallBoxOrChestAlpAudio),
        singleAudio: s3Assets.bhaAlphabetWithScaredBoyAudio,
      },
      {
        id: 70,
        title: "Consonant Sounds",
        letters: "ಭ",
        letter: "ಭ",
        word: "ಆಭರಣ",
        image: getAssetUrl(s3Assets.jewelleryAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.jewelariesAlpAudio),
        singleAudio: s3Assets.bhaAlphabetWithScaredBoyAudio,
      },
      {
        id: 71,
        title: "Consonant Sounds",
        letters: "ಭ",
        letter: "ಭ",
        word: "ವೃಷಭ",
        image: getAssetUrl(s3Assets.bullAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.anOxOrBullAlpAudio),
        singleAudio: s3Assets.bhaAlphabetWithScaredBoyAudio,
      },
    ],
  },
  {
    letter: "ಮ",
    items: [
      {
        id: 72,
        title: "Consonant Sounds",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಮರ",
        image: getAssetUrl(s3Assets.treeAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.treeAlpAudio),
        singleAudio: s3Assets.maAlphabetTreeImageAudio,
      },
      {
        id: 73,
        title: "Consonant Sounds",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಕಮಲ",
        image: getAssetUrl(s3Assets.lotusAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.lotusAlpAudio),
        singleAudio: s3Assets.maAlphabetTreeImageAudio,
      },
      {
        id: 74,
        title: "Consonant Sounds",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಹಿಮ",
        image: getAssetUrl(s3Assets.snowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.snowAlpAudio),
        singleAudio: s3Assets.maAlphabetTreeImageAudio,
      },
    ],
  },
  {
    letter: "ಯ",
    items: [
      {
        id: 75,
        title: "Consonant Sounds",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಯಮ",
        image: getAssetUrl(s3Assets.yamrajAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.yamaAlpAudio),
        singleAudio: s3Assets.yaAlphabetYamaAudio,
      },
      {
        id: 76,
        title: "Consonant Sounds",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಪಾಯಸ",
        image: getAssetUrl(s3Assets.stewAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.kheerAlpAudio),
        singleAudio: s3Assets.yaAlphabetYamaAudio,
      },
      {
        id: 77,
        title: "Consonant Sounds",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಭಯ",
        image: getAssetUrl(s3Assets.fearAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fearAlpAudio),
        singleAudio: s3Assets.yaAlphabetYamaAudio,
      },
    ],
  },
  {
    letter: "ರ",
    items: [
      {
        id: 78,
        title: "Consonant Sounds",
        letters: "ರ",
        letter: "ರ",
        word: "ರಥ",
        image: getAssetUrl(s3Assets.horsechariotAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.chariot1AlpAudio),
        singleAudio: s3Assets.raAlphabetChariotAudio,
      },
      {
        id: 79,
        title: "Consonant Sounds",
        letters: "ರ",
        letter: "ರ",
        word: "ಬೆರಳು",
        image: getAssetUrl(s3Assets.fingerAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.fingerAlpAudio),
        singleAudio: s3Assets.raAlphabetChariotAudio,
      },
      {
        id: 80,
        title: "Consonant Sounds",
        letters: "ರ",
        letter: "ರ",
        word: "ಉದರ",
        image: getAssetUrl(s3Assets.bellyAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.bellyAlpAudio),
        singleAudio: s3Assets.raAlphabetChariotAudio,
      },
    ],
  },
  {
    letter: "ಲ",
    items: [
      {
        id: 81,
        title: "Consonant Sounds",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಲತೆ",
        image: getAssetUrl(s3Assets.leafAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.creeperAlpAudio),
        singleAudio: s3Assets.alphabetCreeperImageAudio,
      },
      {
        id: 82,
        title: "Consonant Sounds",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಚಿಲಕ",
        image: getAssetUrl(s3Assets.colorpencilAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.boltAlpAudio),
        singleAudio: s3Assets.alphabetCreeperImageAudio,
      },
      {
        id: 83,
        title: "Consonant Sounds",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಮೊಲ",
        image: getAssetUrl(s3Assets.rabbitAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.rabbitAlpAudio),
        singleAudio: s3Assets.alphabetCreeperImageAudio,
      },
    ],
  },
  {
    letter: "ವ",
    items: [
      {
        id: 84,
        title: "Consonant Sounds",
        letters: "ವ",
        letter: "व",
        word: "ವನ",
        image: getAssetUrl(s3Assets.forestAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.jungleAlpAudio),
        singleAudio: s3Assets.vaAlphabetJungleImageAudio,
      },
      {
        id: 85,
        title: "Consonant Sounds",
        letters: "ವ",
        letter: "ವ",
        word: "ಲವಣ",
        image: getAssetUrl(s3Assets.saltAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.rockSaltAlpAudio),
        singleAudio: s3Assets.vaAlphabetJungleImageAudio,
      },
      {
        id: 86,
        title: "Consonant Sounds",
        letters: "ವ",
        letter: "ವ",
        word: "ಶಿವ",
        image: getAssetUrl(s3Assets.shivAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.shivaGodAlpAudio),
        singleAudio: s3Assets.vaAlphabetJungleImageAudio,
      },
    ],
  },
  {
    letter: "ಶ",
    items: [
      {
        id: 87,
        title: "Consonant Sounds",
        letters: "ಶ",
        letter: "ಶ",
        word: "ಶಶಿ",
        image: getAssetUrl(s3Assets.moonAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.moonAlpAudio),
        singleAudio: s3Assets.shaMoonAlphabetAudio,
      },
      {
        id: 88,
        title: "Consonant Sounds",
        letters: "ಶ",
        letter: "ಶ",
        word: "ದಶಕ",
        image: getAssetUrl(s3Assets.fiveAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.tenInASetAlpAudio),
        singleAudio: s3Assets.shaMoonAlphabetAudio,
      },
      {
        id: 89,
        title: "Consonant Sounds",
        letters: "ಶ",
        letter: "ಶ",
        word: "ದೇಶ",
        image: getAssetUrl(s3Assets.countryAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.countryAlpAudio),
        singleAudio: s3Assets.shaMoonAlphabetAudio,
      },
    ],
  },
  {
    letter: "ಷ",
    items: [
      {
        id: 90,
        title: "Consonant Sounds",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಷಡ್ಭುಜ",
        image: getAssetUrl(s3Assets.hexagonAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.hexagoneAlpAudio),
        singleAudio: s3Assets.SHAAlphabetHexagoneAudio,
      },
      {
        id: 91,
        title: "Consonant Sounds",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.medicineAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.medicine2AlpAudio),
        singleAudio: s3Assets.SHAAlphabetHexagoneAudio,
      },
      {
        id: 92,
        title: "Consonant Sounds",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಪುರುಷ",
        image: getAssetUrl(s3Assets.manAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.purushaManAlpAudio),
        singleAudio: s3Assets.SHAAlphabetHexagoneAudio,
      },
    ],
  },
  {
    letter: "ಸ",
    items: [
      {
        id: 93,
        title: "Consonant Sounds",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಸರ",
        image: getAssetUrl(s3Assets.tinklechainAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.goldChainAlpAudio),
        singleAudio: s3Assets.saalphabetgoldchain,
      },
      {
        id: 94,
        title: "Consonant Sounds",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಮೊಸಳೆ",
        image: getAssetUrl(s3Assets.crocodileAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.crocodileAlpAudio),
        singleAudio: s3Assets.saalphabetgoldchain,
      },
      {
        id: 95,
        title: "Consonant Sounds",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಹಂಸ",
        image: getAssetUrl(s3Assets.swanAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.swanAlpAudio),
        singleAudio: s3Assets.saalphabetgoldchain,
      },
    ],
  },
  {
    letter: "ಹ",
    items: [
      {
        id: 96,
        title: "Consonant Sounds",
        letters: "ಹ",
        letter: "ಹ",
        word: "ಹಸು",
        image: getAssetUrl(s3Assets.cowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.cow2AlpAudio),
        singleAudio: s3Assets.alphabetWithCowAudio,
      },
      {
        id: 97,
        title: "Consonant Sounds",
        letters: "ಹ",
        letter: "ಹ",
        word: "ವಾಹನ",
        image: getAssetUrl(s3Assets.carAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.vehicleAlpAudio),
        singleAudio: s3Assets.alphabetWithCowAudio,
      },
      {
        id: 98,
        title: "Consonant Sounds",
        letters: "ಹ",
        letter: "ಹ",
        word: "ಸಿಂಹ",
        image: getAssetUrl(s3Assets.lionAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.lionAlpAudio),
        singleAudio: s3Assets.alphabetWithCowAudio,
      },
    ],
  },
  {
    letter: "ಳ",
    items: [
      {
        id: 99,
        title: "Consonant Sounds",
        letters: "ಳ",
        letter: "ಳ",
        word: "ಹಳದಿ",
        image: getAssetUrl(s3Assets.yellowAlpTelImage),
        audio: getAssetAudioUrl(s3Assets.yellowAlpAudio),
        singleAudio: s3Assets.alphabetWithYellowAudio,
      },
      //{ id: 102, title: "Consonant Sounds", letters: "ಳ", letter: "ಳ", word: "ತೋಳ", image: getAssetUrl(s3Assets.wolfAlpTelImage), audio: getAssetAudioUrl(s3Assets.wolfAlpAudio), singleAudio: s3Assets.alphabetWithYellowAudio }
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

  const generatePlaylist = (data) => {
    const playlist = [];

    for (let i = 0; i < data.length; i += 5) {
      const block = data.slice(i, i + 5);

      // UI1: push all items of each letter
      block.forEach((letterObj) => {
        letterObj.items.forEach((item) => {
          playlist.push({
            type: "UI1",
            item,
            letter: letterObj.letter,
          });
        });
      });

      // UI2: push 1 random item from each letter
      block.forEach((letterObj) => {
        if (letterObj.items.length > 0) {
          const randomItem =
            letterObj.items[Math.floor(Math.random() * letterObj.items.length)];
          playlist.push({
            type: "UI2",
            item: randomItem,
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
  }, [currentIndex]);

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

  const flowNames = [...new Set(data.map((item) => item.id))];

  const renderUI = () => {
    const cycleIndex = Math.floor(currentIndex / 20);
    const positionInCycle = currentIndex % 20;

    const current = playlist[currentIndex];
    if (!current) return null;

    //console.log('ui?', currentIndex, block, isUI1, letters);

    const UI1 = () => {
      console.log("ui1", item, current);

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
            {/* <Box
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
            </Box> */}

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
                width: "100%",
                maxWidth: 700, // optional: keep it nicely sized
                mx: "auto", // center horizontally
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #1CB0F6",
                borderRadius: "32px",
                backgroundColor: "#F1FAFE",
                //p: { xs: 2, md: 4 },
                position: "relative",
                alignItems: "stretch",
              }}
            >
              {/* Left - Letter */}
              <Typography
                component="div"
                sx={{
                  color: red,
                  fontWeight: 500,
                  fontSize: { xs: 140, md: 180 },
                  lineHeight: 1,
                  fontFamily: "Quicksand",
                  flex: 1,
                  textAlign: "center",
                  p: 2,
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

              {/* Divider Line */}
              <Box
                sx={{
                  width: "1px",
                  backgroundColor: "#1CB0F6",
                  alignSelf: "stretch",
                }}
              />

              {/* Right - Image */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
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
                  }}
                />
              </Box>
            </Box>

            {/* Buttons */}
            <Stack
              direction="column"
              spacing={3}
              sx={{
                //position: "absolute",
                //bottom: 20,
                //left: "50%",
                //transform: "translateX(-50%)",
                zIndex: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
                  gap: 2,
                  bottom: 20,
                  //left: "50%",
                  //transform: "translateX(-50%)",
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
              </Box>
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
                {/* {recAudio && (
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
                )} */}
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

export default R0;
