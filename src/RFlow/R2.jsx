import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import * as s3Assets from "../utils/s3Links";
import { getAssetUrl } from "../utils/s3Links";
import { getAssetAudioUrl } from "../utils/s3Links";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../components/Layouts.jsx/MainLayout";
import listenImg from "../assets/listen.png";
// import Mic from "assets/mikee.svg";
// import Stop from "assets/pausse.svg";
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
import chairImg from "../assets/chair.svg";
import correctTick from "../assets/correctTick.svg";
import r3Next from "../assets/r3Next.svg";
import dogGif from "../assets/dogGif.gif";
import r3Reset from "../assets/r3Reset.svg";
import r3WrongTick from "../assets/r3WrongTick.svg";
import mikeImg from "../assets/mikeee.svg";
import pauseImg from "../assets/paaauuse.svg";
import effectImg from "../assets/effects.svg";
import buttonImg from "../assets/buton.png";
import coinsImg from "../assets/coiins.svg";
import headerImg from "../assets/headers.svg";
import shipImg from "../assets/sheep.svg";
import shipAudio1 from "../assets/ship1.mp3";
import shipAudio from "../assets/ship.wav";
import shipAudio2 from "../assets/ship2.mp3";
import shipAudio3 from "../assets/ship3.mp3";
import audioIcon from "../assets/audioIcon.svg";
import handIconGif from "../assets/handIconGif.gif";
import musicIcon from "../assets/musicIcon.svg";
import stepThreeTextR from "../assets/stepThreeTextR.svg";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../utils/levelData";

const theme = createTheme();

const levelData = {
  en: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.foilR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.foilR2Eng),
        options: [
          {
            id: "woodR2Eng",
            value: getAssetAudioUrl(s3Assets.woodR2Eng),
            type: "audio",
          },
          {
            id: "foilR2Eng",
            value: getAssetAudioUrl(s3Assets.foilR2Eng),
            type: "audio",
          },
          {
            id: "boilR2Eng",
            value: getAssetAudioUrl(s3Assets.boilR2Eng),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.footR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.footR2Eng),
        options: [
          {
            id: "footR2Eng",
            value: getAssetAudioUrl(s3Assets.footR2Eng),
            type: "audio",
          },
          {
            id: "booksR2Eng",
            value: getAssetAudioUrl(s3Assets.booksR2Eng),
            type: "audio",
          },
          {
            id: "boyR2Eng",
            value: getAssetAudioUrl(s3Assets.boyR2Eng),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.toysR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.toysR2Eng),
        options: [
          {
            id: "cowR2Eng",
            value: getAssetAudioUrl(s3Assets.cowR2Eng),
            type: "audio",
          },
          {
            id: "toysR2Eng",
            value: getAssetAudioUrl(s3Assets.toysR2Eng),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.boyR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.boyR2Eng),
        options: [
          {
            id: "owlR2Eng",
            value: getAssetAudioUrl(s3Assets.owlR2Eng),
            type: "audio",
          },
          {
            id: "boyR2Eng",
            value: getAssetAudioUrl(s3Assets.boyR2Eng),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.soilR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.soilR2Eng),
        options: [
          {
            id: "soilR2Eng",
            value: getAssetAudioUrl(s3Assets.soilR2Eng),
            type: "audio",
          },
          {
            id: "boilR2Eng",
            value: getAssetAudioUrl(s3Assets.boilR2Eng),
            type: "audio",
          },
          {
            id: "watchR2Eng",
            value: getAssetAudioUrl(s3Assets.watchR2Eng),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cowR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cowR2Eng),
        options: [
          {
            id: "yawnR2Eng",
            value: getAssetAudioUrl(s3Assets.yawnR2Eng),
            type: "audio",
          },
          {
            id: "cowR2Eng",
            value: getAssetAudioUrl(s3Assets.cowR2Eng),
            type: "audio",
          },
          {
            id: "fullR2Eng",
            value: getAssetAudioUrl(s3Assets.fullR2Eng),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.booksR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.booksR2Eng),
        options: [
          {
            id: "booksR2Eng",
            value: getAssetAudioUrl(s3Assets.booksR2Eng),
            type: "audio",
          },
          {
            id: "woodR2Eng",
            value: getAssetAudioUrl(s3Assets.woodR2Eng),
            type: "audio",
          },
          {
            id: "watchR2Eng",
            value: getAssetAudioUrl(s3Assets.watchR2Eng),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.woodR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.woodR2Eng),
        options: [
          {
            id: "footR2Eng",
            value: getAssetAudioUrl(s3Assets.footR2Eng),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
          {
            id: "woodR2Eng",
            value: getAssetAudioUrl(s3Assets.woodR2Eng),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.owlR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.owlR2Eng),
        options: [
          {
            id: "owlR2Eng",
            value: getAssetAudioUrl(s3Assets.owlR2Eng),
            type: "audio",
          },
          {
            id: "yawnR2Eng",
            value: getAssetAudioUrl(s3Assets.yawnR2Eng),
            type: "audio",
          },
          {
            id: "boilR2Eng",
            value: getAssetAudioUrl(s3Assets.boilR2Eng),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.watchR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.watchR2Eng),
        options: [
          {
            id: "watchR2Eng",
            value: getAssetAudioUrl(s3Assets.watchR2Eng),
            type: "audio",
          },
          {
            id: "loudR2Eng",
            value: getAssetAudioUrl(s3Assets.loudR2Eng),
            type: "audio",
          },
          {
            id: "footR2Eng",
            value: getAssetAudioUrl(s3Assets.footR2Eng),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.fullR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.fullR2Eng),
        options: [
          {
            id: "fullR2Eng",
            value: getAssetAudioUrl(s3Assets.fullR2Eng),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
          {
            id: "foilR2Eng",
            value: getAssetAudioUrl(s3Assets.foilR2Eng),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.yawnR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.yawnR2Eng),
        options: [
          {
            id: "yawnR2Eng",
            value: getAssetAudioUrl(s3Assets.yawnR2Eng),
            type: "audio",
          },
          {
            id: "owlR2Eng",
            value: getAssetAudioUrl(s3Assets.owlR2Eng),
            type: "audio",
          },
          {
            id: "booksR2Eng",
            value: getAssetAudioUrl(s3Assets.booksR2Eng),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cookR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cookR2Eng),
        options: [
          {
            id: "cowR2Eng",
            value: getAssetAudioUrl(s3Assets.cowR2Eng),
            type: "audio",
          },
          {
            id: "loudR2Eng",
            value: getAssetAudioUrl(s3Assets.loudR2Eng),
            type: "audio",
          },
          {
            id: "cookR2Eng",
            value: getAssetAudioUrl(s3Assets.cookR2Eng),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.boilR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.boilR2Eng),
        options: [
          {
            id: "boilR2Eng",
            value: getAssetAudioUrl(s3Assets.boilR2Eng),
            type: "audio",
          },
          {
            id: "footR2Eng",
            value: getAssetAudioUrl(s3Assets.footR2Eng),
            type: "audio",
          },
          {
            id: "booksR2Eng",
            value: getAssetAudioUrl(s3Assets.booksR2Eng),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.loudR2),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.loudR2Eng),
        options: [
          {
            id: "owlR2Eng",
            value: getAssetAudioUrl(s3Assets.owlR2Eng),
            type: "audio",
          },
          {
            id: "loudR2Eng",
            value: getAssetAudioUrl(s3Assets.loudR2Eng),
            type: "audio",
          },
          {
            id: "watchR2Eng",
            value: getAssetAudioUrl(s3Assets.watchR2Eng),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
    ],
  },
  hi: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.karelaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.karelaR2HinAud),
        options: [
          {
            id: "karelaR2Hin",
            value: getAssetAudioUrl(s3Assets.karelaR2HinAud),
            type: "audio",
          },
          {
            id: "makdiR2Hin",
            value: getAssetAudioUrl(s3Assets.makdiR2HinAud),
            type: "audio",
          },
          {
            id: "bainganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.kitabR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.kitabR2HinAud),
        options: [
          {
            id: "jharnaR2Hin",
            value: getAssetAudioUrl(s3Assets.jharnaR2HinAud),
            type: "audio",
          },
          {
            id: "kitabR2Hin",
            value: getAssetAudioUrl(s3Assets.kitabR2HinAud),
            type: "audio",
          },
          {
            id: "ladkaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.manabR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.manavR2HinAud),
        options: [
          {
            id: "machisR2Hin",
            value: getAssetAudioUrl(s3Assets.machisR2HinAud),
            type: "audio",
          },
          {
            id: "manavR2Hin",
            value: getAssetAudioUrl(s3Assets.manavR2HinAud),
            type: "audio",
          },
          {
            id: "tarazuR2Hin",
            value: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.dholakR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.dholakR2HinAud),
        options: [
          {
            id: "dholakR2Hin",
            value: getAssetAudioUrl(s3Assets.dholakR2HinAud),
            type: "audio",
          },
          {
            id: "dawaiR2Hin",
            value: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
            type: "audio",
          },
          {
            id: "makdiR2Hin",
            value: getAssetAudioUrl(s3Assets.makdiR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.ladkaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.ladkaR2HinAud),
        options: [
          {
            id: "ladkaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAud),
            type: "audio",
          },
          {
            id: "bainganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAud),
            type: "audio",
          },
          {
            id: "jharnaR2Hin",
            value: getAssetAudioUrl(s3Assets.jharnaR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hridayR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.hridayR2HinAud),
        options: [
          {
            id: "idliR2Hin",
            value: getAssetAudioUrl(s3Assets.idliR2HinAud),
            type: "audio",
          },
          {
            id: "hridayR2Hin",
            value: getAssetAudioUrl(s3Assets.hridayR2HinAud),
            type: "audio",
          },
          {
            id: "manavR2Hin",
            value: getAssetAudioUrl(s3Assets.manavR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.baiganR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bainganR2HinAud),
        options: [
          {
            id: "makdiR2Hin",
            value: getAssetAudioUrl(s3Assets.makdiR2HinAud),
            type: "audio",
          },
          {
            id: "bainganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAud),
            type: "audio",
          },
          {
            id: "dholakR2Hin",
            value: getAssetAudioUrl(s3Assets.dholakR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.jharnaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.jharnaR2HinAud),
        options: [
          {
            id: "jharnaR2Hin",
            value: getAssetAudioUrl(s3Assets.jharnaR2HinAud),
            type: "audio",
          },
          {
            id: "kitabR2Hin",
            value: getAssetAudioUrl(s3Assets.kitabR2HinAud),
            type: "audio",
          },
          {
            id: "hridayR2Hin",
            value: getAssetAudioUrl(s3Assets.hridayR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.machisR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.machisR2HinAud),
        options: [
          {
            id: "machisR2Hin",
            value: getAssetAudioUrl(s3Assets.machisR2HinAud),
            type: "audio",
          },
          {
            id: "rupyaR2Hin",
            value: getAssetAudioUrl(s3Assets.rupyaR2HinAud),
            type: "audio",
          },
          {
            id: "kisanR2Hin",
            value: getAssetAudioUrl(s3Assets.kisanR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.makdiR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.makdiR2HinAud),
        options: [
          {
            id: "idliR2Hin",
            value: getAssetAudioUrl(s3Assets.idliR2HinAud),
            type: "audio",
          },
          {
            id: "makdiR2Hin",
            value: getAssetAudioUrl(s3Assets.makdiR2HinAud),
            type: "audio",
          },
          {
            id: "tarazuR2Hin",
            value: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.kisanR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.kisanR2HinAud),
        options: [
          {
            id: "kisanR2Hin",
            value: getAssetAudioUrl(s3Assets.kisanR2HinAud),
            type: "audio",
          },
          {
            id: "dawaiR2Hin",
            value: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
            type: "audio",
          },
          {
            id: "kitabR2Hin",
            value: getAssetAudioUrl(s3Assets.kitabR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.idliR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.idliR2HinAud),
        options: [
          {
            id: "idliR2Hin",
            value: getAssetAudioUrl(s3Assets.idliR2HinAud),
            type: "audio",
          },
          {
            id: "dawaiR2Hin",
            value: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
            type: "audio",
          },
          {
            id: "ladkaR2Hin",
            value: getAssetAudioUrl(s3Assets.ladkaR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.rupyaR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.rupyaR2HinAud),
        options: [
          {
            id: "rupyaR2Hin",
            value: getAssetAudioUrl(s3Assets.rupyaR2HinAud),
            type: "audio",
          },
          {
            id: "bainganR2Hin",
            value: getAssetAudioUrl(s3Assets.bainganR2HinAud),
            type: "audio",
          },
          {
            id: "dholakR2Hin",
            value: getAssetAudioUrl(s3Assets.dholakR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.dawaiR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
        options: [
          {
            id: "dawaiR2Hin",
            value: getAssetAudioUrl(s3Assets.dawaiR2HinAud),
            type: "audio",
          },
          {
            id: "tarazuR2Hin",
            value: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
            type: "audio",
          },
          {
            id: "hridayR2Hin",
            value: getAssetAudioUrl(s3Assets.hridayR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tarajuR2Hin),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
        options: [
          {
            id: "machisR2Hin",
            value: getAssetAudioUrl(s3Assets.machisR2HinAud),
            type: "audio",
          },
          {
            id: "tarazuR2Hin",
            value: getAssetAudioUrl(s3Assets.tarazuR2HinAud),
            type: "audio",
          },
          {
            id: "manavR2Hin",
            value: getAssetAudioUrl(s3Assets.manavR2HinAud),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
    ],
  },
  ta: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bearR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bearR2Tam),
        options: [
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
          {
            id: "bearR2Tam",
            value: getAssetAudioUrl(s3Assets.bearR2Tam),
            type: "audio",
          },
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.boatR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.boatR2Tam),
        options: [
          {
            id: "boatR2Tam",
            value: getAssetAudioUrl(s3Assets.boatR2Tam),
            type: "audio",
          },
          {
            id: "hotR2Tam",
            value: getAssetAudioUrl(s3Assets.hotR2Tam),
            type: "audio",
          },
          {
            id: "chilliR2Tam",
            value: getAssetAudioUrl(s3Assets.chilliR2Tam),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.birdR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.birdR2Tam),
        options: [
          {
            id: "birdR2Tam",
            value: getAssetAudioUrl(s3Assets.birdR2Tam),
            type: "audio",
          },
          {
            id: "donkeyR2Tam",
            value: getAssetAudioUrl(s3Assets.donkeyR2Tam),
            type: "audio",
          },
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.humanR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.humanR2Tam),
        options: [
          {
            id: "danceR2Tam",
            value: getAssetAudioUrl(s3Assets.danceR2Tam),
            type: "audio",
          },
          {
            id: "humanR2Tam",
            value: getAssetAudioUrl(s3Assets.humanR2Tam),
            type: "audio",
          },
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tabalaR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.tabalaR2Tam),
        options: [
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
          {
            id: "tabalaR2Tam",
            value: getAssetAudioUrl(s3Assets.tabalaR2Tam),
            type: "audio",
          },
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.ringR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.ringR2Tam),
        options: [
          {
            id: "bearR2Tam",
            value: getAssetAudioUrl(s3Assets.bearR2Tam),
            type: "audio",
          },
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.chilliR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.chilliR2Tam),
        options: [
          {
            id: "hotR2Tam",
            value: getAssetAudioUrl(s3Assets.hotR2Tam),
            type: "audio",
          },
          {
            id: "chilliR2Tam",
            value: getAssetAudioUrl(s3Assets.chilliR2Tam),
            type: "audio",
          },
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.slowR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.slowR2Tam),
        options: [
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
          {
            id: "slowR2Tam",
            value: getAssetAudioUrl(s3Assets.slowR2Tam),
            type: "audio",
          },
          {
            id: "tabalaR2Tam",
            value: getAssetAudioUrl(s3Assets.tabalaR2Tam),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.hotR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.hotR2Tam),
        options: [
          {
            id: "hotR2Tam",
            value: getAssetAudioUrl(s3Assets.hotR2Tam),
            type: "audio",
          },
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
          {
            id: "donkeyR2Tam",
            value: getAssetAudioUrl(s3Assets.donkeyR2Tam),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.donkeyR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.donkeyR2Tam),
        options: [
          {
            id: "donkeyR2Tam",
            value: getAssetAudioUrl(s3Assets.donkeyR2Tam),
            type: "audio",
          },
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
          {
            id: "tabalaR2Tam",
            value: getAssetAudioUrl(s3Assets.tabalaR2Tam),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.danceR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.danceR2Tam),
        options: [
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
          {
            id: "danceR2Tam",
            value: getAssetAudioUrl(s3Assets.danceR2Tam),
            type: "audio",
          },
          {
            id: "bearR2Tam",
            value: getAssetAudioUrl(s3Assets.bearR2Tam),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.fruitR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.fruitR2Tam),
        options: [
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
          {
            id: "hotR2Tam",
            value: getAssetAudioUrl(s3Assets.hotR2Tam),
            type: "audio",
          },
          {
            id: "boatR2Tam",
            value: getAssetAudioUrl(s3Assets.boatR2Tam),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.sunR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.sunR2Tam),
        options: [
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
          {
            id: "sunR2Tam",
            value: getAssetAudioUrl(s3Assets.sunR2Tam),
            type: "audio",
          },
          {
            id: "slowR2Tam",
            value: getAssetAudioUrl(s3Assets.slowR2Tam),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.oldR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.oldR2Tam),
        options: [
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
          {
            id: "oldR2Tam",
            value: getAssetAudioUrl(s3Assets.oldR2Tam),
            type: "audio",
          },
          {
            id: "donkeyR2Tam",
            value: getAssetAudioUrl(s3Assets.donkeyR2Tam),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.frogR2TamI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.frogR2Tam),
        options: [
          {
            id: "fruitR2Tam",
            value: getAssetAudioUrl(s3Assets.fruitR2Tam),
            type: "audio",
          },
          {
            id: "frogR2Tam",
            value: getAssetAudioUrl(s3Assets.frogR2Tam),
            type: "audio",
          },
          {
            id: "ringR2Tam",
            value: getAssetAudioUrl(s3Assets.ringR2Tam),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
    ],
  },
  kn: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.batR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.batR2Kan),
        options: [
          {
            id: "batR2Kan",
            value: getAssetAudioUrl(s3Assets.batR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
          {
            id: "antR2Kan",
            value: getAssetAudioUrl(s3Assets.antR2Kan),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.flagR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.flagR2Kan),
        options: [
          {
            id: "mushroomR2Kan",
            value: getAssetAudioUrl(s3Assets.mushroomR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
          {
            id: "potterR2Kan",
            value: getAssetAudioUrl(s3Assets.potterR2Kan),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.authorR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.authorR2Kan),
        options: [
          {
            id: "authorR2Kan",
            value: getAssetAudioUrl(s3Assets.authorR2Kan),
            type: "audio",
          },
          {
            id: "peacockR2Kan",
            value: getAssetAudioUrl(s3Assets.peacockR2Kan),
            type: "audio",
          },
          {
            id: "heartR2Kan",
            value: getAssetAudioUrl(s3Assets.heartR2Kan),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.heartR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.heartR2Kan),
        options: [
          {
            id: "heartR2Kan",
            value: getAssetAudioUrl(s3Assets.heartR2Kan),
            type: "audio",
          },
          {
            id: "roseR2Kan",
            value: getAssetAudioUrl(s3Assets.roseR2Kan),
            type: "audio",
          },
          {
            id: "antR2Kan",
            value: getAssetAudioUrl(s3Assets.antR2Kan),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.medicineR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.medicineR2Kan),
        options: [
          {
            id: "mushroomR2Kan",
            value: getAssetAudioUrl(s3Assets.mushroomR2Kan),
            type: "audio",
          },
          {
            id: "familyR2Kan",
            value: getAssetAudioUrl(s3Assets.familyR2Kan),
            type: "audio",
          },
          {
            id: "medicineR2Kan",
            value: getAssetAudioUrl(s3Assets.medicineR2Kan),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.PeacockR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.peacockR2Kan),
        options: [
          {
            id: "peacockR2Kan",
            value: getAssetAudioUrl(s3Assets.peacockR2Kan),
            type: "audio",
          },
          {
            id: "squirrelR2Kan",
            value: getAssetAudioUrl(s3Assets.squirrelR2Kan),
            type: "audio",
          },
          {
            id: "batR2Kan",
            value: getAssetAudioUrl(s3Assets.batR2Kan),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.familyR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.familyR2Kan),
        options: [
          {
            id: "familyR2Kan",
            value: getAssetAudioUrl(s3Assets.familyR2Kan),
            type: "audio",
          },
          {
            id: "flightR2Kan",
            value: getAssetAudioUrl(s3Assets.flightR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.squirrelR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.squirrelR2Kan),
        options: [
          {
            id: "squirrelR2Kan",
            value: getAssetAudioUrl(s3Assets.squirrelR2Kan),
            type: "audio",
          },
          {
            id: "humanR2Kan",
            value: getAssetAudioUrl(s3Assets.humanR2Kan),
            type: "audio",
          },
          {
            id: "antR2Kan",
            value: getAssetAudioUrl(s3Assets.antR2Kan),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.humanR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.humanR2Kan),
        options: [
          {
            id: "batR2Kan",
            value: getAssetAudioUrl(s3Assets.batR2Kan),
            type: "audio",
          },
          {
            id: "humanR2Kan",
            value: getAssetAudioUrl(s3Assets.humanR2Kan),
            type: "audio",
          },
          {
            id: "peacockR2Kan",
            value: getAssetAudioUrl(s3Assets.peacockR2Kan),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.antR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.antR2Kan),
        options: [
          {
            id: "antR2Kan",
            value: getAssetAudioUrl(s3Assets.antR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
          {
            id: "squirrelR2Kan",
            value: getAssetAudioUrl(s3Assets.squirrelR2Kan),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.flightR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.flightR2Kan),
        options: [
          {
            id: "familyR2Kan",
            value: getAssetAudioUrl(s3Assets.familyR2Kan),
            type: "audio",
          },
          {
            id: "potterR2Kan",
            value: getAssetAudioUrl(s3Assets.potterR2Kan),
            type: "audio",
          },
          {
            id: "flightR2Kan",
            value: getAssetAudioUrl(s3Assets.flightR2Kan),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.fingerR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.fingerR2Kan),
        options: [
          {
            id: "fingerR2Kan",
            value: getAssetAudioUrl(s3Assets.fingerR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
          {
            id: "batR2Kan",
            value: getAssetAudioUrl(s3Assets.batR2Kan),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.mushroomR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.mushroomR2Kan),
        options: [
          {
            id: "mushroomR2Kan",
            value: getAssetAudioUrl(s3Assets.mushroomR2Kan),
            type: "audio",
          },
          {
            id: "authorR2Kan",
            value: getAssetAudioUrl(s3Assets.authorR2Kan),
            type: "audio",
          },
          {
            id: "heartR2Kan",
            value: getAssetAudioUrl(s3Assets.heartR2Kan),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.roseR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.roseR2Kan),
        options: [
          {
            id: "squirrelR2Kan",
            value: getAssetAudioUrl(s3Assets.squirrelR2Kan),
            type: "audio",
          },
          {
            id: "roseR2Kan",
            value: getAssetAudioUrl(s3Assets.roseR2Kan),
            type: "audio",
          },
          {
            id: "flagR2Kan",
            value: getAssetAudioUrl(s3Assets.flagR2Kan),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.potterR2KanI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.potterR2Kan),
        options: [
          {
            id: "potterR2Kan",
            value: getAssetAudioUrl(s3Assets.potterR2Kan),
            type: "audio",
          },
          {
            id: "mushroomR2Kan",
            value: getAssetAudioUrl(s3Assets.mushroomR2Kan),
            type: "audio",
          },
          {
            id: "medicineR2Kan",
            value: getAssetAudioUrl(s3Assets.medicineR2Kan),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
    ],
  },
  te: {
    L1: [
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.aeroplaneR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.aeroplaneR2Tel),
        options: [
          {
            id: "aeroplaneR2Tel",
            value: getAssetAudioUrl(s3Assets.aeroplaneR2Tel),
            type: "audio",
          },
          {
            id: "cycleR2Tel",
            value: getAssetAudioUrl(s3Assets.cycleR2Tel),
            type: "audio",
          },
          {
            id: "heartR2Tel",
            value: getAssetAudioUrl(s3Assets.heartR2Tel),
            type: "audio",
          },
        ],
        flowName: "P1",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.brainR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.brainR2Tel),
        options: [
          {
            id: "brainR2Tel",
            value: getAssetAudioUrl(s3Assets.brainR2Tel),
            type: "audio",
          },
          {
            id: "bearR2Tel",
            value: getAssetAudioUrl(s3Assets.bearR2Tel),
            type: "audio",
          },
          {
            id: "animalR2Tel",
            value: getAssetAudioUrl(s3Assets.animalR2Tel),
            type: "audio",
          },
        ],
        flowName: "P2",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.rabbitR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.rabbitR2Tel),
        options: [
          {
            id: "pigeonR2Tel",
            value: getAssetAudioUrl(s3Assets.pigeonR2Tel),
            type: "audio",
          },
          {
            id: "rabbitR2Tel",
            value: getAssetAudioUrl(s3Assets.rabbitR2Tel),
            type: "audio",
          },
          {
            id: "tomatoR2Tel",
            value: getAssetAudioUrl(s3Assets.tomatoR2Tel),
            type: "audio",
          },
        ],
        flowName: "P3",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.windowR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.windowR2Tel),
        options: [
          {
            id: "windowR2Tel",
            value: getAssetAudioUrl(s3Assets.windowR2Tel),
            type: "audio",
          },
          {
            id: "peacockR2Tel",
            value: getAssetAudioUrl(s3Assets.peacockR2Tel),
            type: "audio",
          },
          {
            id: "appleR2Tel",
            value: getAssetAudioUrl(s3Assets.appleR2Tel),
            type: "audio",
          },
        ],
        flowName: "P4",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.brinjalR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.brinjalR2Tel),
        options: [
          {
            id: "brinjalR2Tel",
            value: getAssetAudioUrl(s3Assets.brinjalR2Tel),
            type: "audio",
          },
          {
            id: "tomatoR2Tel",
            value: getAssetAudioUrl(s3Assets.tomatoR2Tel),
            type: "audio",
          },
          {
            id: "crocodileR2Tel",
            value: getAssetAudioUrl(s3Assets.crocodileR2Tel),
            type: "audio",
          },
        ],
        flowName: "P5",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.elephantR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.elephantR2Tel),
        options: [
          {
            id: "rabbitR2Tel",
            value: getAssetAudioUrl(s3Assets.rabbitR2Tel),
            type: "audio",
          },
          {
            id: "bearR2Tel",
            value: getAssetAudioUrl(s3Assets.bearR2Tel),
            type: "audio",
          },
          {
            id: "elephantR2Tel",
            value: getAssetAudioUrl(s3Assets.elephantR2Tel),
            type: "audio",
          },
        ],
        flowName: "P6",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.crocodileR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.crocodileR2Tel),
        options: [
          {
            id: "crocodileR2Tel",
            value: getAssetAudioUrl(s3Assets.crocodileR2Tel),
            type: "audio",
          },
          {
            id: "animalR2Tel",
            value: getAssetAudioUrl(s3Assets.animalR2Tel),
            type: "audio",
          },
          {
            id: "cycleR2Tel",
            value: getAssetAudioUrl(s3Assets.cycleR2Tel),
            type: "audio",
          },
        ],
        flowName: "P7",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.cycleR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.cycleR2Tel),
        options: [
          {
            id: "appleR2Tel",
            value: getAssetAudioUrl(s3Assets.appleR2Tel),
            type: "audio",
          },
          {
            id: "aeroplaneR2Tel",
            value: getAssetAudioUrl(s3Assets.aeroplaneR2Tel),
            type: "audio",
          },
          {
            id: "cycleR2Tel",
            value: getAssetAudioUrl(s3Assets.cycleR2Tel),
            type: "audio",
          },
        ],
        flowName: "P8",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.animalR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.animalR2Tel),
        options: [
          {
            id: "animalR2Tel",
            value: getAssetAudioUrl(s3Assets.animalR2Tel),
            type: "audio",
          },
          {
            id: "brainR2Tel",
            value: getAssetAudioUrl(s3Assets.brainR2Tel),
            type: "audio",
          },
          {
            id: "pigeonR2Tel",
            value: getAssetAudioUrl(s3Assets.pigeonR2Tel),
            type: "audio",
          },
        ],
        flowName: "P9",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.bearR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.bearR2Tel),
        options: [
          {
            id: "elephantR2Tel",
            value: getAssetAudioUrl(s3Assets.elephantR2Tel),
            type: "audio",
          },
          {
            id: "bearR2Tel",
            value: getAssetAudioUrl(s3Assets.bearR2Tel),
            type: "audio",
          },
          {
            id: "cycleR2Tel",
            value: getAssetAudioUrl(s3Assets.cycleR2Tel),
            type: "audio",
          },
        ],
        flowName: "P10",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.appleR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.appleR2Tel),
        options: [
          {
            id: "appleR2Tel",
            value: getAssetAudioUrl(s3Assets.appleR2Tel),
            type: "audio",
          },
          {
            id: "brinjalR2Tel",
            value: getAssetAudioUrl(s3Assets.brinjalR2Tel),
            type: "audio",
          },
          {
            id: "windowR2Tel",
            value: getAssetAudioUrl(s3Assets.windowR2Tel),
            type: "audio",
          },
        ],
        flowName: "P11",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.pigeonR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.pigeonR2Tel),
        options: [
          {
            id: "pigeonR2Tel",
            value: getAssetAudioUrl(s3Assets.pigeonR2Tel),
            type: "audio",
          },
          {
            id: "heartR2Tel",
            value: getAssetAudioUrl(s3Assets.heartR2Tel),
            type: "audio",
          },
          {
            id: "rabbitR2Tel",
            value: getAssetAudioUrl(s3Assets.rabbitR2Tel),
            type: "audio",
          },
        ],
        flowName: "P12",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.tomatoR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.tomatoR2Tel),
        options: [
          {
            id: "peacockR2Tel",
            value: getAssetAudioUrl(s3Assets.peacockR2Tel),
            type: "audio",
          },
          {
            id: "tomatoR2Tel",
            value: getAssetAudioUrl(s3Assets.tomatoR2Tel),
            type: "audio",
          },
          {
            id: "crocodileR2Tel",
            value: getAssetAudioUrl(s3Assets.crocodileR2Tel),
            type: "audio",
          },
        ],
        flowName: "P13",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.peacockR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.peacockR2Tel),
        options: [
          {
            id: "tomatoR2Tel",
            value: getAssetAudioUrl(s3Assets.tomatoR2Tel),
            type: "audio",
          },
          {
            id: "windowR2Tel",
            value: getAssetAudioUrl(s3Assets.windowR2Tel),
            type: "audio",
          },
          {
            id: "peacockR2Tel",
            value: getAssetAudioUrl(s3Assets.peacockR2Tel),
            type: "audio",
          },
        ],
        flowName: "P14",
      },
      {
        question: {
          text: "test",
          img: getAssetUrl(s3Assets.heartR2TelI),
          type: "text",
        },
        answer: getAssetAudioUrl(s3Assets.heartR2Tel),
        options: [
          {
            id: "heartR2Tel",
            value: getAssetAudioUrl(s3Assets.heartR2Tel),
            type: "audio",
          },
          {
            id: "bearR2Tel",
            value: getAssetAudioUrl(s3Assets.bearR2Tel),
            type: "audio",
          },
          {
            id: "peacockR2Tel",
            value: getAssetAudioUrl(s3Assets.peacockR2Tel),
            type: "audio",
          },
        ],
        flowName: "P15",
      },
    ],
  },
};

const colors = ["#4CDAFE", "#FC8AFF", "#FFB213"];

const styles = [
  {
    background: "linear-gradient(279.15deg, #0780B9 0%, #4CC5FF 90.43%)",
    boxShadow: "0px 0px 20px 8px #40B9F357",
  },
  {
    background: "linear-gradient(278.71deg, #C20281 0%, #FF4BC2 84.1%)",
    boxShadow: "0px 0px 20px 8px #FF4BC257",
  },
  {
    background: "linear-gradient(279.36deg, #710EDC 0%, #A856FF 100%)",
    boxShadow: "0px 0px 24px 8px #8224E757",
  },
];

const R2 = ({
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
  rStep,
  onComplete,
  vocabCount,
  wordCount,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [recording, setRecording] = useState("no");
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("1");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMatch, setIsMatch] = useState(null);
  const [showRecordButton, setShowRecordButton] = useState(false);
  const [step3Correct, setStep3Correct] = useState(false);
  const [step3Wrong, setStep3Wrong] = useState(false);
  //const [showConfetti, setShowConfetti] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedTextThree, setSelectedTextThree] = useState(null);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const lang = getLocalData("lang");
  const [handPhase, setHandPhase] = useState("audio");
  const [audioInstance, setAudioInstance] = useState(null);
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const content = levelData[lang];

  const transcriptRef = useRef("");

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  steps = 1;

  const currentQuestion = content?.L1[currentQuestionIndex];

  const flowNames = [...new Set(content?.L1?.map((item) => item.flowName))];
  const activeFlow =
    content?.L1[currentQuestionIndex]?.flowName || flowNames[0];

  const stopLoader = () => {
    setSelectedCheckbox(null);
    setIsMatch(false);
    setShowRecordButton(true);
    setTimeout(() => {
      setShowReset(true);
    }, 3000);
  };

  console.log("cq", currentQuestion, rStep);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveIndex((prev) =>
  //       prev < content?.L1[currentQuestionIndex + 1]?.options.length - 1
  //         ? prev + 1
  //         : 0
  //     );
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          stopLoader();
          return 100;
        }
        return prev + 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [progress]);

  const handleCheckboxChange = (text) => {
    setSelectedCheckbox(text);
    setShowNextButton(true);
  };

  const handleNextClick = () => {
    if (isAudioPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsAudioPlaying(false);
    }
    if (selectedCheckbox) {
      setProgress(0);
      handleAudioClick(selectedCheckbox);
      setShowNextButton(false);
    }
    setActiveIndex(0);
    setHandPhase("audio");
  };

  const playAudio = (audioKey) => {
    if (isAudioPlaying) {
      // If already playing, stop the audio
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setIsAudioPlaying(false);
    }
    if (audioKey) {
      const audioElement = new Audio(audioKey);
      setHandPhase("audio");
      audioElement.play();
      setTimeout(() => {
        setHandPhase("checkbox");
      }, 1500);
      setAudioInstance(audioElement);
      setIsAudioPlaying(true);
      //audioElement.onended = () => setIsAudioPlaying(false);
      audioElement.onended = () => {
        setIsAudioPlaying(false);
        setTimeout(() => {
          setActiveIndex(
            (prev) =>
              (prev + 1) % content?.L1[currentQuestionIndex]?.options.length
          );
          setHandPhase("audio");
        }, 1500);
      };
    } else {
      console.error("Audio file not found:", audioKey);
    }
  };

  const reset = () => {
    setIsMatch(null);
    setSelectedText(null);
    setShowReset(false);
    setShowRecordButton(false);
    setProgress(0);
    setActiveIndex(0);
    setHandPhase("audio");
  };

  const handleAudioClick = (text) => {
    setSelectedText(text);
    setSelectedCheckbox(null);
    if (text === content?.L1[currentQuestionIndex]?.answer) {
      setIsMatch(true);
      setShowConfetti(true);
      setShowRecordButton(true);
      const audio = new Audio(correctSound);
      audio.play();
      setRecording("no");
      setTimeout(() => {
        setIsMatch(null);
        setSelectedText(null);
        setShowConfetti(false);
        setShowRecordButton(false);
        if (currentQuestionIndex === content?.L1.length - 1) {
          setLocalData("rFlow", false);
          setLocalData("mFail", false);
          setLocalData("rStep", 0);
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            navigate("/");
          } else {
            navigate("/discover-start");
          }
          onComplete();
        } else {
          console.log("contents", content);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 3000);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setSelectedCheckbox(null);
      setIsMatch(false);
      setShowRecordButton(true);
      setTimeout(() => {
        setShowReset(true);
      }, 3000);
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
      activeFlow={activeFlow} // Pass current active flow
      rStep={rStep}
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
      {currentQuestion?.question ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // background:
            //   "linear-gradient(128.49deg, rgb(158, 197, 255) 0%, rgb(225, 166, 248) 100%)",
            backgroundColor: "#FFFFFF",
          }}
        >
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}

          {step === "1" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {!showRecordButton && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  {/* Dog Image - Moves with Progress */}
                  <img
                    src={Assets.dogGif}
                    alt="Dog"
                    style={{
                      position: "relative",
                      left: `${(progress / 100) * 260}px`,
                      width: isMobile ? "45px" : "50px",
                      height: isMobile ? "50px" : "55px",
                      transition: "left 0.2s linear",
                      marginBottom: "-10px",
                      marginLeft: "-10px",
                    }}
                  />

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: "280px",
                      height: "15px",
                      backgroundColor: "white",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "2px solid #F39F27",
                      position: "relative",
                    }}
                  >
                    {/* Progress Fill */}
                    <div
                      style={{
                        width: `${progress}%`,
                        height: "100%",
                        background:
                          "linear-gradient(0deg, #F19920 0%, #F39F27 23%, #F7B03B 58%, #FECC5C 100%)",
                        transition: "width 0.2s linear",
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  background: "#FF7F361A",
                  borderRadius: "20px",
                  padding: "20px 50px",
                  maxWidth: "50%",
                  height: "120px",
                  border: "2px dotted var(--Button-Orange, #FF7F36)",
                  //boxShadow: "0px 6px 0px 1px rgb(245, 245, 255)",
                  // boxShadow:
                  //   "rgb(245, 245, 255) 0px 6px 0px 1px, rgb(102, 102, 133) 0px 11px 0px 1px",
                }}
              >
                {/* <img
                        src={content.L1[0].stepOne.img}
                        alt="Ship"
                        style={{ width: "210px", height: "auto" }}
                      /> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    maxWidth: isMobile ? "90%" : "80%",
                    textAlign: "center",
                  }}
                >
                  {/* <span
                          style={{
                            fontSize: "28px",
                            fontWeight: "600",
                            fontStyle: "Digitalt",
                            color: "#08B9FF",
                          }}
                        >
                          {content?.L1[currentQuestionIndex]?.question?.text}

                        </span> */}
                  <img
                    src={content?.L1[currentQuestionIndex]?.question?.img}
                    alt="Hint"
                    style={{
                      //position: "absolute",
                      //top: "-40px",
                      //left: "-30px",
                      //transform: "rotate(-45deg)",
                      height: "100px",
                    }}
                  />
                  {/* <img
                          src={listenImg}
                          alt="Listen"
                          style={{ width: "30px", cursor: "pointer" }}
                          onClick={() => playAudio(content.L1[0].stepOne.correctAudio)}
                        /> */}
                </div>
              </div>

              {!showRecordButton &&
                content?.L1[currentQuestionIndex]?.options?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: isMobile ? "5px" : "50px",
                      marginTop: "20px",
                    }}
                  >
                    {content?.L1[currentQuestionIndex]?.options.map(
                      (audio, index) => {
                        const style = styles[index % styles.length];

                        return (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            {index === activeIndex && (
                              <img
                                src={Assets.hintGif}
                                alt="Hint"
                                style={{
                                  position: "absolute",
                                  ...(handPhase === "audio"
                                    ? {
                                        bottom: "40px",
                                        left: "-30px",
                                        transform: "rotate(-120deg)",
                                      }
                                    : {
                                        bottom: "-50px",
                                        left: "-30px",
                                        transform: "rotate(-120deg)",
                                      }),
                                  height: isMobile ? "70px" : "80px",
                                  zIndex: "9999",
                                  transition: "all 0.3s ease",
                                }}
                              />
                            )}
                            <div
                              style={{
                                display: "flex",
                                //border: "2px solid white",
                                gap: "10px",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span
                                style={{
                                  color: "#000000",
                                  fontFamily: "Quicksand",
                                  fontWeight: 700,
                                  fontSize: isMobile ? "20px" : "36px",
                                  lineHeight: "60px",
                                  letterSpacing: "0%",
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                }}
                              >
                                {index + 1}
                              </span>
                              <div
                                style={{
                                  gap: "5px",
                                  width: isMobile ? "50px" : "80px",
                                  height: isMobile ? "50px" : "80px",
                                  background:
                                    selectedText === audio.value
                                      ? isMatch
                                        ? "#58CC02"
                                        : "#FF0000"
                                      : style.background,
                                  borderRadius: "50%",
                                  display: "flex",
                                  //border: "2px solid white",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "30px",
                                  fontWeight: "bold",
                                  boxShadow:
                                    selectedText === audio.value
                                      ? "none"
                                      : style.boxShadow,
                                  cursor: "pointer",
                                  color: "#FFFFFF",
                                  filter:
                                    activeIndex !== index
                                      ? "brightness(50%)"
                                      : "none",
                                  transition: "filter 0.3s ease",
                                }}
                                onClick={() => {
                                  setActiveIndex(index);
                                  playAudio(audio.value);
                                }}
                              >
                                <img
                                  src={Assets.musicIcon}
                                  alt="Mike"
                                  style={{
                                    width: isMobile ? "30px" : "40px",
                                    height: isMobile ? "30px" : "40px",
                                    cursor: "pointer",
                                  }}
                                />
                                {/* {index + 1} */}
                              </div>
                            </div>
                            {/* <input
                              type="checkbox"
                              id={`checkbox-${audio.id}`}
                              checked={selectedCheckbox === audio.value}
                              onChange={() => handleCheckboxChange(audio.value)}
                              style={{
                                width: "60px",
                                height: "60px",
                                appearance: "none",
                                backgroundColor:
                                  selectedCheckbox === audio.value
                                    ? "#58CC02"
                                    : "#BB81D066",
                                border: "2px solid white",
                                borderRadius: "8px",
                                cursor: "pointer",
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "15px",
                                marginLeft: "30px",
                              }}
                            /> */}
                            <div
                              style={{
                                width: isMobile ? "50px" : "60px",
                                height: isMobile ? "50px" : "60px",
                                backgroundColor:
                                  selectedCheckbox === audio.value
                                    ? "#58CC02"
                                    : "#BB81D066",
                                border: "2px solid white",
                                borderRadius: "8px",
                                cursor: "pointer",
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "15px",
                                marginLeft: isMobile ? "20px" : "30px",
                              }}
                              onClick={() => handleCheckboxChange(audio.value)}
                            >
                              <input
                                type="checkbox"
                                id={`checkbox-${audio.id}`}
                                checked={selectedCheckbox === audio.value}
                                readOnly
                                style={{
                                  display: "none", // hide the native checkbox
                                }}
                              />
                              {/* {selectedCheckbox === audio.value && ( */}
                              <span
                                style={{
                                  fontSize: isMobile ? "24px" : "36px",
                                  fontWeight: "900",
                                  color: "white",
                                  lineHeight: 1,
                                }}
                              >
                                ✓
                              </span>
                              {/* )} */}
                            </div>

                            {/* {selectedCheckbox === audio.text && (
                            <div
                              style={{
                                position: "absolute",
                                width: "60px",
                                height: "245px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
                              }}
                            >
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )} */}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

              {showNextButton && (
                <div
                  style={{
                    position: isMobile ? "none" : "fixed",
                    bottom: "180px",
                    right: "60px",
                    zIndex: 1000,
                  }}
                >
                  <div onClick={handleNextClick} style={{ cursor: "pointer" }}>
                    <NextButtonRound
                      height={isMobile ? 45 : 60}
                      width={isMobile ? 45 : 60}
                    />
                  </div>
                </div>
              )}

              {showRecordButton && !showReset && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "25px",
                  }}
                >
                  <img
                    src={isMatch ? Assets.correctTick : Assets.r3WrongTick}
                    alt="Effect"
                    style={{
                      height: isMobile ? "45px" : "80px",
                      transition: "opacity 0.4s ease-in-out",
                    }}
                  />
                </div>
              )}

              {showReset && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "25px",
                  }}
                >
                  <img
                    src={Assets.r3Reset}
                    alt="Effect"
                    style={{
                      height: isMobile ? "45px" : "80px",
                      transition: "opacity 0.4s ease-in-out",
                      cursor: "pointer",
                    }}
                    onClick={reset}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "24px" }}>{currentQuestion.word}</h2>
          {currentQuestion.img && (
            <img
              src={currentQuestion.img}
              alt={currentQuestion.word}
              style={{ width: "120px", height: "120px" }}
            />
          )}
          <div style={{ marginTop: "20px" }}>
            {recording === "no" ? (
              <img
                onClick={() => setRecording("startRec")}
                src={Assets.mic}
                alt="Start Recording"
                style={{ width: "70px", height: "70px", cursor: "pointer" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "80px",
                  margin: "20px 20px",
                }}
              >
                <RecordVoiceVisualizer />
                <img
                  onClick={() => {
                    const audio = new Audio(correctSound);
                    audio.play();
                    setRecording("no");
                    if (currentQuestionIndex === content.L1.length - 1) {
                      setLocalData("rFlow", false);
                      setLocalData("mFail", false);
                      setLocalData("rStep", 0);
                      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                        navigate("/");
                      } else {
                        navigate("/discover-start");
                      }
                      onComplete();
                    } else {
                      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    }
                  }}
                  src={Assets.pause}
                  alt="Stop Recording"
                  style={{ width: "60px", height: "60px", cursor: "pointer" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default R2;
