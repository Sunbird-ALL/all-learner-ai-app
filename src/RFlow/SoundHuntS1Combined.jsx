import React, { useState, useEffect, useMemo } from "react";
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
import {
  updateLearnerProfile,
  getSetResultPractice,
} from "../services/learnerAi/learnerAiService";

const theme = createTheme();

// Word Hunt (Sound Match) - Listen to Sound and choose the right word
const soundMatchContent = {
  L1: [
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.cookImg),
          text: "cook",
          audio: getAssetAudioUrl(s3Assets.cookAudio),
        },
        {
          img: getAssetUrl(s3Assets.godImg2),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio2),
        },
        {
          img: getAssetUrl(s3Assets.badImg),
          text: "bad",
          audio: getAssetAudioUrl(s3Assets.badAudio),
        },
      ],
      correctWord: "bad",
      audio: getAssetAudioUrl(s3Assets.badAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.godImg2),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio2),
        },
        {
          img: getAssetUrl(s3Assets.momImg),
          text: "mom",
          audio: getAssetAudioUrl(s3Assets.momAudio),
        },
        {
          img: getAssetUrl(s3Assets.goatImg),
          text: "goat",
          audio: getAssetAudioUrl(s3Assets.goatAudio),
        },
      ],
      correctWord: "mom",
      audio: getAssetAudioUrl(s3Assets.momAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.hopImg),
          text: "hop",
          audio: getAssetAudioUrl(s3Assets.hopAudio),
        },
        {
          img: getAssetUrl(s3Assets.fatImg),
          text: "fat",
          audio: getAssetAudioUrl(s3Assets.fatAudio),
        },
        {
          img: getAssetUrl(s3Assets.cookImg),
          text: "cook",
          audio: getAssetAudioUrl(s3Assets.cookAudio),
        },
      ],
      correctWord: "hop",
      audio: getAssetAudioUrl(s3Assets.hopAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.fatImg),
          text: "fat",
          audio: getAssetAudioUrl(s3Assets.fatAudio),
        },
        {
          img: getAssetUrl(s3Assets.momImg),
          text: "mom",
          audio: getAssetAudioUrl(s3Assets.momAudio),
        },
        {
          img: getAssetUrl(s3Assets.sadImg),
          text: "sad",
          audio: getAssetAudioUrl(s3Assets.sadAudio),
        },
      ],
      correctWord: "fat",
      audio: getAssetAudioUrl(s3Assets.fatAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.goatImg),
          text: "goat",
          audio: getAssetAudioUrl(s3Assets.goatAudio),
        },
        {
          img: getAssetUrl(s3Assets.nineImg),
          text: "nine",
          audio: getAssetAudioUrl(s3Assets.nineAudio),
        },
        {
          img: getAssetUrl(s3Assets.himImg),
          text: "him",
          audio: getAssetAudioUrl(s3Assets.himAudio),
        },
      ],
      correctWord: "him",
      audio: getAssetAudioUrl(s3Assets.himAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.godImg2),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio2),
        },
        {
          img: getAssetUrl(s3Assets.fatImg),
          text: "fat",
          audio: getAssetAudioUrl(s3Assets.fatAudio),
        },
        {
          img: getAssetUrl(s3Assets.sadImg),
          text: "sad",
          audio: getAssetAudioUrl(s3Assets.sadAudio),
        },
      ],
      correctWord: "sad",
      audio: getAssetAudioUrl(s3Assets.sadAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.godImg2),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio2),
        },
        {
          img: getAssetUrl(s3Assets.cookImg),
          text: "cook",
          audio: getAssetAudioUrl(s3Assets.cookAudio),
        },
        {
          img: getAssetUrl(s3Assets.goatImg),
          text: "goat",
          audio: getAssetAudioUrl(s3Assets.goatAudio),
        },
      ],
      correctWord: "cook",
      audio: getAssetAudioUrl(s3Assets.cookAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.godImg2),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio2),
        },
        {
          img: getAssetUrl(s3Assets.nineImg),
          text: "nine",
          audio: getAssetAudioUrl(s3Assets.nineAudio),
        },
        {
          img: getAssetUrl(s3Assets.fatImg),
          text: "fat",
          audio: getAssetAudioUrl(s3Assets.fatAudio),
        },
      ],
      correctWord: "god",
      audio: getAssetAudioUrl(s3Assets.godAudio2),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.cookImg),
          text: "cook",
          audio: getAssetAudioUrl(s3Assets.cookAudio),
        },
        {
          img: getAssetUrl(s3Assets.nineImg),
          text: "nine",
          audio: getAssetAudioUrl(s3Assets.nineAudio),
        },
        {
          img: getAssetUrl(s3Assets.fatImg),
          text: "fat",
          audio: getAssetAudioUrl(s3Assets.fatAudio),
        },
      ],
      correctWord: "nine",
      audio: getAssetAudioUrl(s3Assets.nineAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.goatImg),
          text: "goat",
          audio: getAssetAudioUrl(s3Assets.goatAudio),
        },
        {
          img: getAssetUrl(s3Assets.badImg),
          text: "bad",
          audio: getAssetAudioUrl(s3Assets.badAudio),
        },
        {
          img: getAssetUrl(s3Assets.cookImg),
          text: "cook",
          audio: getAssetAudioUrl(s3Assets.cookAudio),
        },
      ],
      correctWord: "goat",
      audio: getAssetAudioUrl(s3Assets.goatAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.wideImg),
          text: "wide",
          audio: getAssetAudioUrl(s3Assets.wideAudio),
        },
        {
          img: getAssetUrl(s3Assets.noteImg),
          text: "note",
          audio: getAssetAudioUrl(s3Assets.noteAudio),
        },
        {
          img: getAssetUrl(s3Assets.buyImg),
          text: "buy",
          audio: getAssetAudioUrl(s3Assets.buyAudio),
        },
      ],
      correctWord: "buy",
      audio: getAssetAudioUrl(s3Assets.buyAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.happy2Img),
          text: "happy",
          audio: getAssetAudioUrl(s3Assets.happy3Audio),
        },
        {
          img: getAssetUrl(s3Assets.wideImg),
          text: "wide",
          audio: getAssetAudioUrl(s3Assets.wideAudio),
        },
        {
          img: getAssetUrl(s3Assets.fineImg),
          text: "fine",
          audio: getAssetAudioUrl(s3Assets.fineAudio),
        },
      ],
      correctWord: "fine",
      audio: getAssetAudioUrl(s3Assets.fineAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.kindImg),
          text: "kind",
          audio: getAssetAudioUrl(s3Assets.kindAudio),
        },
        {
          img: getAssetUrl(s3Assets.bodyImg),
          text: "body",
          audio: getAssetAudioUrl(s3Assets.bodyAudio),
        },
        {
          img: getAssetUrl(s3Assets.buyImg),
          text: "buy",
          audio: getAssetAudioUrl(s3Assets.buyAudio),
        },
      ],
      correctWord: "kind",
      audio: getAssetAudioUrl(s3Assets.kindAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.fineImg),
          text: "fine",
          audio: getAssetAudioUrl(s3Assets.fineAudio),
        },
        {
          img: getAssetUrl(s3Assets.halfImg),
          text: "half",
          audio: getAssetAudioUrl(s3Assets.halfAudio),
        },
        {
          img: getAssetUrl(s3Assets.noteImg),
          text: "note",
          audio: getAssetAudioUrl(s3Assets.noteAudio),
        },
      ],
      correctWord: "note",
      audio: getAssetAudioUrl(s3Assets.noteAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.happy2Img),
          text: "happy",
          audio: getAssetAudioUrl(s3Assets.happy3Audio),
        },
        {
          img: getAssetUrl(s3Assets.wideImg),
          text: "wide",
          audio: getAssetAudioUrl(s3Assets.wideAudio),
        },
        {
          img: getAssetUrl(s3Assets.hideImg),
          text: "hide",
          audio: getAssetAudioUrl(s3Assets.hideAudio),
        },
      ],
      correctWord: "wide",
      audio: getAssetAudioUrl(s3Assets.wideAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.halfImg),
          text: "half",
          audio: getAssetAudioUrl(s3Assets.halfAudio),
        },
        {
          img: getAssetUrl(s3Assets.knowImg),
          text: "know",
          audio: getAssetAudioUrl(s3Assets.knowAudio),
        },
        {
          img: getAssetUrl(s3Assets.hideImg),
          text: "hide",
          audio: getAssetAudioUrl(s3Assets.hideAudio),
        },
      ],
      correctWord: "know",
      audio: getAssetAudioUrl(s3Assets.knowAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.fineImg),
          text: "fine",
          audio: getAssetAudioUrl(s3Assets.fineAudio),
        },
        {
          img: getAssetUrl(s3Assets.halfImg),
          text: "half",
          audio: getAssetAudioUrl(s3Assets.halfAudio),
        },
        {
          img: getAssetUrl(s3Assets.bodyImg),
          text: "body",
          audio: getAssetAudioUrl(s3Assets.bodyAudio),
        },
      ],
      correctWord: "half",
      audio: getAssetAudioUrl(s3Assets.halfAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.buyImg),
          text: "buy",
          audio: getAssetAudioUrl(s3Assets.buyAudio),
        },
        {
          img: getAssetUrl(s3Assets.halfImg),
          text: "half",
          audio: getAssetAudioUrl(s3Assets.halfAudio),
        },
        {
          img: getAssetUrl(s3Assets.hideImg),
          text: "hide",
          audio: getAssetAudioUrl(s3Assets.hideAudio),
        },
      ],
      correctWord: "hide",
      audio: getAssetAudioUrl(s3Assets.hideAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.knowImg),
          text: "know",
          audio: getAssetAudioUrl(s3Assets.knowAudio),
        },
        {
          img: getAssetUrl(s3Assets.happy2Img),
          text: "happy",
          audio: getAssetAudioUrl(s3Assets.happy3Audio),
        },
        {
          img: getAssetUrl(s3Assets.halfImg),
          text: "half",
          audio: getAssetAudioUrl(s3Assets.halfAudio),
        },
      ],
      correctWord: "happy",
      audio: getAssetAudioUrl(s3Assets.happy3Audio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.halfImg),
          text: "half",
          audio: getAssetAudioUrl(s3Assets.halfAudio),
        },
        {
          img: getAssetUrl(s3Assets.bodyImg),
          text: "body",
          audio: getAssetAudioUrl(s3Assets.bodyAudio),
        },
        {
          img: getAssetUrl(s3Assets.knowImg),
          text: "know",
          audio: getAssetAudioUrl(s3Assets.knowAudio),
        },
      ],
      correctWord: "body",
      audio: getAssetAudioUrl(s3Assets.bodyAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.sonImg),
          text: "Son",
          audio: getAssetAudioUrl(s3Assets.sonAudio),
        },
        {
          img: getAssetUrl(s3Assets.chairImg),
          text: "chair",
          audio: getAssetAudioUrl(s3Assets.chairAudio),
        },
        {
          img: getAssetUrl(s3Assets.fairImg),
          text: "fair",
          audio: getAssetAudioUrl(s3Assets.fairAudio),
        },
      ],
      correctWord: "Son",
      audio: getAssetAudioUrl(s3Assets.sonAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.zigImg),
          text: "zig",
          audio: getAssetAudioUrl(s3Assets.zigAudio),
        },
        {
          img: getAssetUrl(s3Assets.fairImg),
          text: "fair",
          audio: getAssetAudioUrl(s3Assets.fairAudio),
        },
        {
          img: getAssetUrl(s3Assets.chatImg),
          text: "chat",
          audio: getAssetAudioUrl(s3Assets.chatAudio),
        },
      ],
      correctWord: "zig",
      audio: getAssetAudioUrl(s3Assets.zigAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.logImg),
          text: "log",
          audio: getAssetAudioUrl(s3Assets.logAudio),
        },
        {
          img: getAssetUrl(s3Assets.sonImg),
          text: "Son",
          audio: getAssetAudioUrl(s3Assets.sonAudio),
        },
        {
          img: getAssetUrl(s3Assets.birdImg2),
          text: "bird",
          audio: getAssetAudioUrl(s3Assets.birdAudio2),
        },
      ],
      correctWord: "log",
      audio: getAssetAudioUrl(s3Assets.logAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.penImg),
          text: "pen",
          audio: getAssetAudioUrl(s3Assets.penAudio),
        },
        {
          img: getAssetUrl(s3Assets.nowImg),
          text: "now",
          audio: getAssetAudioUrl(s3Assets.nowAudio),
        },
        {
          img: getAssetUrl(s3Assets.fairImg),
          text: "fair",
          audio: getAssetAudioUrl(s3Assets.fairAudio),
        },
      ],
      correctWord: "now",
      audio: getAssetAudioUrl(s3Assets.nowAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.chatImg),
          text: "chat",
          audio: getAssetAudioUrl(s3Assets.chatAudio),
        },
        {
          img: getAssetUrl(s3Assets.sonImg),
          text: "Son",
          audio: getAssetAudioUrl(s3Assets.sonAudio),
        },
        {
          img: getAssetUrl(s3Assets.nowImg),
          text: "now",
          audio: getAssetAudioUrl(s3Assets.nowAudio),
        },
      ],
      correctWord: "chat",
      audio: getAssetAudioUrl(s3Assets.chatAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.logImg),
          text: "log",
          audio: getAssetAudioUrl(s3Assets.logAudio),
        },
        {
          img: getAssetUrl(s3Assets.chatImg),
          text: "chat",
          audio: getAssetAudioUrl(s3Assets.chatAudio),
        },
        {
          img: getAssetUrl(s3Assets.penImg),
          text: "pen",
          audio: getAssetAudioUrl(s3Assets.penAudio),
        },
      ],
      correctWord: "pen",
      audio: getAssetAudioUrl(s3Assets.penAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.nowImg),
          text: "now",
          audio: getAssetAudioUrl(s3Assets.nowAudio),
        },
        {
          img: getAssetUrl(s3Assets.birdImg2),
          text: "bird",
          audio: getAssetAudioUrl(s3Assets.birdAudio2),
        },
        {
          img: getAssetUrl(s3Assets.fairImg),
          text: "fair",
          audio: getAssetAudioUrl(s3Assets.fairAudio),
        },
      ],
      correctWord: "fair",
      audio: getAssetAudioUrl(s3Assets.fairAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.birdImg2),
          text: "bird",
          audio: getAssetAudioUrl(s3Assets.birdAudio2),
        },
        {
          img: getAssetUrl(s3Assets.careImg),
          text: "care",
          audio: getAssetAudioUrl(s3Assets.careAudio),
        },
        {
          img: getAssetUrl(s3Assets.zigImg),
          text: "zig",
          audio: getAssetAudioUrl(s3Assets.zigAudio),
        },
      ],
      correctWord: "care",
      audio: getAssetAudioUrl(s3Assets.careAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.zigImg),
          text: "zig",
          audio: getAssetAudioUrl(s3Assets.zigAudio),
        },
        {
          img: getAssetUrl(s3Assets.chatImg),
          text: "chat",
          audio: getAssetAudioUrl(s3Assets.chatAudio),
        },
        {
          img: getAssetUrl(s3Assets.birdImg2),
          text: "bird",
          audio: getAssetAudioUrl(s3Assets.birdAudio2),
        },
      ],
      correctWord: "bird",
      audio: getAssetAudioUrl(s3Assets.birdAudio2),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.careImg),
          text: "care",
          audio: getAssetAudioUrl(s3Assets.careAudio),
        },
        {
          img: getAssetUrl(s3Assets.logImg),
          text: "log",
          audio: getAssetAudioUrl(s3Assets.logAudio),
        },
        {
          img: getAssetUrl(s3Assets.chairImg),
          text: "chair",
          audio: getAssetAudioUrl(s3Assets.chairAudio),
        },
      ],
      correctWord: "chair",
      audio: getAssetAudioUrl(s3Assets.chairAudio),
      flowName: "S1",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.orangeImg),
          text: "orange",
          audio: getAssetAudioUrl(s3Assets.orangeAudio),
        },
        {
          img: getAssetUrl(s3Assets.turnImg),
          text: "turn",
          audio: getAssetAudioUrl(s3Assets.turnAudio),
        },
        {
          img: getAssetUrl(s3Assets.dearImg),
          text: "dear",
          audio: getAssetAudioUrl(s3Assets.dearAudio),
        },
      ],
      correctWord: "turn",
      audio: getAssetAudioUrl(s3Assets.turnAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.earthImg2),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio2),
        },
        {
          img: getAssetUrl(s3Assets.sootheImg),
          text: "soothe",
          audio: getAssetAudioUrl(s3Assets.sootheAudio),
        },
        {
          img: getAssetUrl(s3Assets.dearImg),
          text: "dear",
          audio: getAssetAudioUrl(s3Assets.dearAudio),
        },
      ],
      correctWord: "soothe",
      audio: getAssetAudioUrl(s3Assets.sootheAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.lazyImg),
          text: "lazy",
          audio: getAssetAudioUrl(s3Assets.lazyAudio),
        },
        {
          img: getAssetUrl(s3Assets.perkImg),
          text: "perk",
          audio: getAssetAudioUrl(s3Assets.perkAudio),
        },
        {
          img: getAssetUrl(s3Assets.earImg),
          text: "ear",
          audio: getAssetAudioUrl(s3Assets.earAudio),
        },
      ],
      correctWord: "perk",
      audio: getAssetAudioUrl(s3Assets.perkAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.earthImg2),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio2),
        },
        {
          img: getAssetUrl(s3Assets.royalImg),
          text: "royal",
          audio: getAssetAudioUrl(s3Assets.royalAudio),
        },
        {
          img: getAssetUrl(s3Assets.dearImg),
          text: "dear",
          audio: getAssetAudioUrl(s3Assets.dearAudio),
        },
      ],
      correctWord: "dear",
      audio: getAssetAudioUrl(s3Assets.dearAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.perkImg),
          text: "perk",
          audio: getAssetAudioUrl(s3Assets.perkAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg2),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio2),
        },
        {
          img: getAssetUrl(s3Assets.royalImg),
          text: "royal",
          audio: getAssetAudioUrl(s3Assets.royalAudio),
        },
      ],
      correctWord: "royal",
      audio: getAssetAudioUrl(s3Assets.royalAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.dearImg),
          text: "dear",
          audio: getAssetAudioUrl(s3Assets.dearAudio),
        },
        {
          img: getAssetUrl(s3Assets.earImg),
          text: "ear",
          audio: getAssetAudioUrl(s3Assets.earAudio),
        },
        {
          img: getAssetUrl(s3Assets.royalImg),
          text: "royal",
          audio: getAssetAudioUrl(s3Assets.royalAudio),
        },
      ],
      correctWord: "ear",
      audio: getAssetAudioUrl(s3Assets.earAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.lazyImg),
          text: "lazy",
          audio: getAssetAudioUrl(s3Assets.lazyAudio),
        },
        {
          img: getAssetUrl(s3Assets.earthImg2),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio2),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg2),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio2),
        },
      ],
      correctWord: "lazy",
      audio: getAssetAudioUrl(s3Assets.lazyAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.sootheImg),
          text: "soothe",
          audio: getAssetAudioUrl(s3Assets.sootheAudio),
        },
        {
          img: getAssetUrl(s3Assets.perkImg),
          text: "perk",
          audio: getAssetAudioUrl(s3Assets.perkAudio),
        },
        {
          img: getAssetUrl(s3Assets.orangeImg),
          text: "orange",
          audio: getAssetAudioUrl(s3Assets.orangeAudio),
        },
      ],
      correctWord: "orange",
      audio: getAssetAudioUrl(s3Assets.orangeAudio),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.earImg),
          text: "ear",
          audio: getAssetAudioUrl(s3Assets.earAudio),
        },
        {
          img: getAssetUrl(s3Assets.perkImg),
          text: "perk",
          audio: getAssetAudioUrl(s3Assets.perkAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg2),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio2),
        },
      ],
      correctWord: "purple",
      audio: getAssetAudioUrl(s3Assets.purpleAudio2),
      flowName: "S2",
      type: "soundMatch",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.purpleImg2),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio2),
        },
        {
          img: getAssetUrl(s3Assets.earthImg2),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio2),
        },
        {
          img: getAssetUrl(s3Assets.lazyImg),
          text: "lazy",
          audio: getAssetAudioUrl(s3Assets.lazyAudio),
        },
      ],
      correctWord: "earth",
      audio: getAssetAudioUrl(s3Assets.earthAudio2),
      flowName: "S2",
      type: "soundMatch",
    },
  ],
};

// Sound Hunt (Picture words) - Read the word and choose the right sound
const pictureWordsContent = {
  L1: [
    {
      word: "bad",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.cookAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.godAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.badAudio),
          isCorrect: true,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "mom",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.godAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.momAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.goatAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "hop",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.hopAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.fatAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.cookAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "fat",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.fatAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.momAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.sadAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "him",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.goatAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.nineAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.himAudio),
          isCorrect: true,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "sad",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.godAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.fatAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.sadAudio),
          isCorrect: true,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "cook",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.godAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.cookAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.goatAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "god",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.godAudio2),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.nineAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.fatAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "nine",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.cookAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.nineAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.fatAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "goat",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.goatAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.badAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.cookAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "buy",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.wideAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.noteAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.buyAudio),
          isCorrect: true,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "fine",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.happyAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.wideAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.fineAudio),
          isCorrect: true,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "kind",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.kindAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.bodyAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.buyAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "note",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.fineAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.halfAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.noteAudio),
          isCorrect: true,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "wide",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.happyAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.wideAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.hideAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "know",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.halfAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.knowAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.hideAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "half",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.fineAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.halfAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.bodyAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "hide",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.buyAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.halfAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.hideAudio),
          isCorrect: true,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "happy",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.knowAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.happyAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.halfAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "body",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.halfAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.bodyAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.knowAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "Son",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.sonAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.chairAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.fairAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "zig",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.zigAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.fairAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.chatAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "log",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.logAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.sonAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.birdAudio2),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "now",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.penAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.nowAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.fairAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "chat",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.chatAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.sonAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.nowAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "pen",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.logAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.chatAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.penAudio),
          isCorrect: true,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "fair",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.nowAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.birdAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.fairAudio),
          isCorrect: true,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "care",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.birdAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.careAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.zigAudio),
          isCorrect: false,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "bird",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.zigAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.chatAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.birdAudio2),
          isCorrect: true,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "chair",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.careAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.logAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.chairAudio),
          isCorrect: true,
        },
      ],
      flowName: "S1",
      type: "pictureWords",
    },
    {
      word: "turn",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.orangeAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.turnAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.dearAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "soothe",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.earthAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.sootheAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.dearAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "perk",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.lazyAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.perkAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.earAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "dear",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.earthAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.royalAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.dearAudio),
          isCorrect: true,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "royal",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.perkAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.purpleAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.royalAudio),
          isCorrect: true,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "ear",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.dearAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.earAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.royalAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "lazy",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.lazyAudio),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.earthAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.purpleAudio2),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "orange",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.sootheAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.perkAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.orangeAudio),
          isCorrect: true,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "purple",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.earAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.perkAudio),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.purpleAudio2),
          isCorrect: true,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
    {
      word: "earth",
      audioOptions: [
        {
          audio: getAssetAudioUrl(s3Assets.purpleAudio2),
          isCorrect: false,
        },
        {
          audio: getAssetAudioUrl(s3Assets.earthAudio2),
          isCorrect: true,
        },
        {
          audio: getAssetAudioUrl(s3Assets.lazyAudio),
          isCorrect: false,
        },
      ],
      flowName: "S2",
      type: "pictureWords",
    },
  ],
};

// Combine both contents - alternate between soundMatch and pictureWords
// First 10 questions: soundMatch (Listen to Sound and choose the right word)
// Next 10 questions: pictureWords (Read the word and choose the right sound)
// Filter to only S1 questions and ensure correct order
const soundMatchS1 = soundMatchContent.L1.filter((q) => q.flowName === "S1");
const pictureWordsS1 = pictureWordsContent.L1.filter(
  (q) => q.flowName === "S1"
);
// Combine: first all soundMatch S1, then all pictureWords S1
const combinedContent = [...soundMatchS1, ...pictureWordsS1];

const SoundHuntS1Combined = ({
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
  vocabCount,
  wordCount,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedAudioIndex, setSelectedAudioIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [wrongAudioIndex, setWrongAudioIndex] = useState(null);
  const [recording, setRecording] = useState("no");
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlayedOnce, setIsAudioPlayedOnce] = useState(false);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(null);
  const [scale, setScale] = useState(1);
  // Track word selections for ansSelectionStatus
  const [ansSelectionStatus, setAnsSelectionStatus] = useState({});
  // Track if an option has been selected (to show Next button)
  const [hasSelectedOption, setHasSelectedOption] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Filter content based on steps prop (from API/config)
  // steps comes from questions.length in Practice.jsx
  // For S1, we always show all 20 questions (10 soundMatch + 10 pictureWords)
  const filteredContent = useMemo(() => {
    // Always show all S1 questions (20 total: 10 soundMatch + 10 pictureWords)
    // The steps prop is used for progress tracking, but we show all questions
    return combinedContent;
  }, []);

  // Audio recording state
  const mediaRecorderRef = React.useRef(null);
  const recordedChunksRef = React.useRef([]);
  const streamRef = React.useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Use filteredContent instead of combinedContent
  const currentQuestion = filteredContent[currentQuestionIndex];
  const isSoundMatch = currentQuestion?.type === "soundMatch";
  const isPictureWords = currentQuestion?.type === "pictureWords";

  // Reset state when question changes
  useEffect(() => {
    setSelectedWord(null);
    setSelectedAudioIndex(null);
    setWrongWord(null);
    setWrongAudioIndex(null);
    setShowConfetti(false);
    setRecording("no");
    setIsPlaying(false);
    setIsAudioPlayedOnce(false);
    setPlayingAudioIndex(null);
    setHasSelectedOption(false);

    // Stop any active recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, [currentQuestionIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Handle Word Hunt (Sound Match) - Listen to Sound and choose the right word
  const handleWordClick = (word) => {
    setSelectedWord(word);
    const currentQuestion = filteredContent[currentQuestionIndex];
    const isCorrect = word === currentQuestion.correctWord;
    const wordLower = word?.toLowerCase();
    const correctWordLower = currentQuestion.correctWord?.toLowerCase();

    // Track selection status for ansSelectionStatus
    if (wordLower) {
      setAnsSelectionStatus((prev) => {
        const updated = {
          ...prev,
          [wordLower]: isCorrect,
        };
        // Also ensure the correct word is tracked
        if (correctWordLower && correctWordLower !== wordLower) {
          // If wrong word selected, mark correct word as not selected (false)
          if (!isCorrect) {
            updated[correctWordLower] = false;
          }
        }
        return updated;
      });
    }

    // Mark that an option has been selected
    setHasSelectedOption(true);

    if (isCorrect) {
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);
      setWrongWord(null);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setWrongWord(word);
      setTimeout(() => setWrongWord(null), 2000);
    }
  };

  // Handle Sound Hunt (Picture words) - Read the word and choose the right sound
  const handleAudioClick = (audioIndex) => {
    setSelectedAudioIndex(audioIndex);
    const currentQuestion = filteredContent[currentQuestionIndex];
    const selectedAudio = currentQuestion.audioOptions[audioIndex];
    const isCorrect = selectedAudio.isCorrect;
    const wordLower = currentQuestion.word?.toLowerCase();

    // Track selection status for ansSelectionStatus
    if (wordLower) {
      setAnsSelectionStatus((prev) => ({
        ...prev,
        [wordLower]: isCorrect,
      }));
    }

    // Mark that an option has been selected
    setHasSelectedOption(true);

    if (isCorrect) {
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);
      setWrongAudioIndex(null);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setWrongAudioIndex(audioIndex);
      setTimeout(() => setWrongAudioIndex(null), 2000);
    }
  };

  const handlePlayAudio = (audioIndex) => {
    const currentQuestion = filteredContent[currentQuestionIndex];
    const audioOption = currentQuestion.audioOptions[audioIndex];

    const audio = new Audio(audioOption.audio);
    setPlayingAudioIndex(audioIndex);

    audio.play();

    audio.onended = () => {
      setPlayingAudioIndex(null);
    };
  };

  const handlePlayMainAudio = () => {
    const currentQuestion = filteredContent[currentQuestionIndex];
    const audio = new Audio(currentQuestion.audio);

    audio.play();
    setIsPlaying(true);
    setIsAudioPlayedOnce(true);

    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const flowNames = [...new Set(filteredContent.map((item) => item.flowName))];
  const activeFlow =
    filteredContent[currentQuestionIndex]?.flowName || flowNames[0];

  // Convert blob to base64
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

  // Start audio recording
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = "audio/webm;codecs=opus";
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        console.log("Recording stopped event fired");
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      console.log("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Stop audio recording and process
  const stopRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      console.log("Stopping recording...");
      const recorder = mediaRecorderRef.current;
      recorder.stop();

      // Wait for the recorder to stop and process the audio
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (recorder.state === "inactive") {
            clearInterval(checkInterval);
            console.log("Recording stopped, processing audio...");

            // Just stop recording, don't call API here
            // API will be called on S1 completion
            resolve();

            mediaRecorderRef.current = null;
            recordedChunksRef.current = [];
          }
        }, 100);

        // Timeout after 2 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 2000);
      });
    } else {
      console.warn("No active recording to stop");
      return Promise.resolve();
    }
  };

  // Build ansSelectionStatus with all words from S1 questions
  const buildAnsSelectionStatus = () => {
    // Use filteredContent which already contains only S1 questions
    const s1Questions = filteredContent;
    const status = {};

    // Get all unique words from S1 questions
    s1Questions.forEach((question) => {
      if (question.type === "soundMatch") {
        // For soundMatch, track all words in allwords array
        question.allwords?.forEach((wordObj) => {
          const word = wordObj.text?.toLowerCase();
          if (word && !(word in status)) {
            // Check if this word was correctly selected
            status[word] = ansSelectionStatus[word] || false;
          }
        });
      } else if (question.type === "pictureWords") {
        // For pictureWords, track the word itself
        const word = question.word?.toLowerCase();
        if (word && !(word in status)) {
          status[word] = ansSelectionStatus[word] || false;
        }
      }
    });

    return status;
  };

  // Update learner profile after S1 completion
  const updateLearnerProfileOnCompletion = async () => {
    try {
      const lang = getLocalData("lang") || "en";
      const sessionId = getLocalData("sessionId");
      const sub_session_id = getLocalData("sub_session_id");

      // Build ansSelectionStatus with all words from S1
      const ansSelectionStatusObj = buildAnsSelectionStatus();

      const requestBody = {
        original_text: "Char",
        audio: "",
        session_id: sessionId,
        language: lang,
        date: new Date(),
        sub_session_id,
        contentType: "Char",
        mechanics_id: "",
        milestone: "B",
        is_nonAsr: true,
        ansSelectionStatus: ansSelectionStatusObj,
      };

      console.log("Calling updateLearnerProfile API on S1 completion:", {
        sessionId,
        sub_session_id,
        lang,
        ansSelectionStatus: ansSelectionStatusObj,
      });

      const result = await updateLearnerProfile(lang, requestBody);
      console.log(
        "✅ Learner profile updated successfully on S1 completion:",
        result
      );
      return result;
    } catch (error) {
      console.error("❌ Error updating learner profile on completion:", error);
      console.error("Error details:", error.response || error.message);
      throw error;
    }
  };

  // Get/Set result when S1 is complete
  const handleS1Complete = async () => {
    try {
      // First update learner profile
      await updateLearnerProfileOnCompletion();

      // Then get/set result
      const sub_session_id = getLocalData("sub_session_id");
      const sessionId = getLocalData("sessionId");

      const result = await getSetResultPractice({
        subSessionId: sub_session_id,
        currentContentType: contentType || "Word",
        sessionId,
        totalSyllableCount: 20, // Total questions for S1 combined
        mechanism: { id: "soundHuntS1Combined", name: "soundHuntS1Combined" },
      });

      console.log("S1 result:", result);
      setLocalData("s1_complete", true);
      setLocalData("s1_result", JSON.stringify(result));

      // Return the result so caller can check sessionResult
      return result;
    } catch (error) {
      console.error("Error getting/setting S1 result:", error);
      throw error;
    }
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m1"}
      parentWords={parentWords}
      flowNames={flowNames}
      activeFlow={activeFlow}
      rStep={rStep}
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
          background: "linear-gradient(180deg, #91E7EF 0%, #42C6FF 100%)",
          padding: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {recording === "no" && (
          <>
            {showConfetti && <Confetti />}

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {[
                { top: "10%", left: "5%" },
                { top: "25%", left: "30%" },
                { top: "10%", left: "55%" },
                { top: "25%", left: "80%" },
              ].map((pos, index) => (
                <img
                  key={index}
                  src={Assets.cloudNewImg}
                  alt={`Cloud ${index + 1}`}
                  style={{
                    position: "absolute",
                    width: "150px",
                    height: "auto",
                    ...pos,
                  }}
                />
              ))}
            </div>

            {/* Word Hunt (Sound Match) - Listen to Sound and choose the right word */}
            {isSoundMatch && !isPictureWords && currentQuestion?.allwords && (
              <>
                {selectedWord === currentQuestion?.correctWord ? (
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      marginBottom: "75px",
                    }}
                  >
                    <img
                      src={Assets.tickImg}
                      alt="Tick"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </div>
                ) : wrongWord ? (
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "60%",
                      backgroundColor: "rgba(255, 127, 54, 0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      border: "4px solid #FFFFFF",
                      marginBottom: "75px",
                    }}
                  >
                    <img
                      src={Assets.xImg}
                      alt="Wrong"
                      style={{ width: "25px", height: "25px" }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={handlePlayMainAudio}
                    disabled={isPlaying}
                    style={{
                      position: "relative",
                      marginBottom: "75px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={
                        isPlaying ? Assets.pauseButtonImg : Assets.playButtonImg
                      }
                      alt="Audio"
                      style={{
                        width: "55px",
                        height: "55px",
                        transform: `scale(${scale})`,
                        transition: "transform 0.5s ease-in-out",
                      }}
                    />
                  </button>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    marginTop: "24px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {currentQuestion?.allwords.map((item, index) => {
                    const isCorrect =
                      selectedWord === currentQuestion?.correctWord &&
                      item.text === selectedWord;
                    const isWrong = wrongWord === item.text;
                    return (
                      <div
                        key={index}
                        style={{
                          backgroundColor: isCorrect
                            ? "rgba(117, 209, 0, 0.6)"
                            : isWrong
                            ? "rgba(255, 127, 54, 0.8)"
                            : "#1897DE",
                          padding: isMobile ? "12px 16px" : "16px 24px",
                          borderRadius: "12px",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          border:
                            isCorrect || isWrong
                              ? "2px solid rgba(255, 255, 255, 0.5)"
                              : "5px solid #10618E",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(56px)",
                          WebkitBackdropFilter: "blur(56px)",
                          cursor: isAudioPlayedOnce ? "pointer" : "not-allowed",
                          opacity: isAudioPlayedOnce ? 1 : 0.7,
                          transition: "background-color 0.3s ease-in-out",
                          minWidth: isMobile ? "80px" : "120px",
                          minHeight: isMobile ? "50px" : "60px",
                        }}
                        onClick={() => {
                          if (isAudioPlayedOnce) {
                            handleWordClick(item.text);
                          }
                        }}
                      >
                        <span
                          style={{
                            color: "#FFFFFF",
                            fontWeight: 600,
                            fontSize: isMobile ? "20px" : "28px",
                            fontFamily: "Quicksand",
                            textAlign: "center",
                          }}
                        >
                          {item.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Sound Hunt (Picture words) - Read the word and choose the right sound */}
            {!isSoundMatch &&
              isPictureWords &&
              currentQuestion?.word &&
              currentQuestion?.audioOptions && (
                <>
                  {/* Display the word */}
                  <div
                    style={{
                      backgroundColor: "#1897DE",
                      padding: isMobile ? "16px 24px" : "20px 32px",
                      borderRadius: "12px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      border: "5px solid #10618E",
                      marginBottom: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: isMobile ? "150px" : "200px",
                    }}
                  >
                    <span
                      style={{
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: isMobile ? "32px" : "48px",
                        fontFamily: "Quicksand",
                        textAlign: "center",
                      }}
                    >
                      {currentQuestion.word}
                    </span>
                  </div>

                  {selectedAudioIndex !== null &&
                  currentQuestion.audioOptions[selectedAudioIndex]
                    ?.isCorrect ? (
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        marginBottom: "40px",
                      }}
                    >
                      <img
                        src={Assets.tickImg}
                        alt="Tick"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </div>
                  ) : wrongAudioIndex !== null ? (
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "60%",
                        backgroundColor: "rgba(255, 127, 54, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        border: "4px solid #FFFFFF",
                        marginBottom: "40px",
                      }}
                    >
                      <img
                        src={Assets.xImg}
                        alt="Wrong"
                        style={{ width: "25px", height: "25px" }}
                      />
                    </div>
                  ) : null}

                  {/* Audio options */}
                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      marginTop: "24px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {currentQuestion?.audioOptions.map((audioOption, index) => {
                      const isCorrect =
                        selectedAudioIndex === index && audioOption.isCorrect;
                      const isWrong = wrongAudioIndex === index;
                      const isPlaying = playingAudioIndex === index;

                      return (
                        <div
                          key={index}
                          style={{
                            backgroundColor: isCorrect
                              ? "rgba(117, 209, 0, 0.6)"
                              : isWrong
                              ? "rgba(255, 127, 54, 0.8)"
                              : "#FFFFFF",
                            padding: "16px",
                            borderRadius: "24px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            border: "2px solid rgba(255, 255, 255, 0.5)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(56px)",
                            WebkitBackdropFilter: "blur(56px)",
                            cursor: "pointer",
                            opacity: 1,
                            transition: "background-color 0.3s ease-in-out",
                            minWidth: isMobile ? "100px" : "140px",
                            minHeight: isMobile ? "100px" : "140px",
                          }}
                          onClick={() => {
                            handleAudioClick(index);
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayAudio(index);
                            }}
                            disabled={isPlaying}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              marginBottom: "8px",
                            }}
                          >
                            <img
                              src={
                                isPlaying
                                  ? Assets.pauseButtonImg
                                  : Assets.playButtonImg
                              }
                              alt="Play Audio"
                              style={{
                                width: isMobile ? "40px" : "50px",
                                height: isMobile ? "40px" : "50px",
                                transform: isPlaying
                                  ? `scale(${scale})`
                                  : "scale(1)",
                                transition: "transform 0.5s ease-in-out",
                              }}
                            />
                          </button>
                          <span
                            style={{
                              color:
                                isCorrect || isWrong ? "#FFFFFF" : "#666666",
                              fontWeight: 500,
                              fontSize: isMobile ? "12px" : "14px",
                              fontFamily: "Quicksand",
                              textAlign: "center",
                            }}
                          >
                            Sound {index + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

            {/* Next Button - appears after user selects an option */}
            {hasSelectedOption && recording === "no" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
                }}
              >
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={async () => {
                    console.log("Next button clicked");
                    // Move to next question
                    if (currentQuestionIndex === filteredContent.length - 1) {
                      // All questions completed - call getSetResultPractice for S1
                      try {
                        const result = await handleS1Complete();

                        // Check sessionResult from API response
                        // Response structure: result.data.sessionResult (based on Practice.jsx pattern)
                        const getSetData = result?.data || result;
                        const sessionResult = getSetData?.sessionResult;
                        console.log("S1 completion - Full result:", result);
                        console.log("S1 completion - getSetData:", getSetData);
                        console.log("S1 sessionResult:", sessionResult);
                        console.log(
                          "S1 sessionResult type:",
                          typeof sessionResult
                        );
                        console.log(
                          "S1 sessionResult lowercased:",
                          sessionResult?.toLowerCase()
                        );

                        // Check for fail (case-insensitive)
                        if (sessionResult?.toLowerCase() === "fail") {
                          // If fail, move to next step in practice flow
                          console.log(
                            "S1 sessionResult is 'fail' - moving to next practice step"
                          );
                          console.log(
                            "handleNext available:",
                            !!handleNext,
                            "type:",
                            typeof handleNext
                          );
                          if (handleNext && typeof handleNext === "function") {
                            console.log(
                              "Calling handleNext(true) to move to next step"
                            );
                            await handleNext(true);
                            console.log(
                              "handleNext(true) completed - should have moved to next step"
                            );
                            return;
                          } else {
                            console.warn(
                              "handleNext is not available or not a function, cannot move to next step"
                            );
                          }
                        } else if (sessionResult?.toLowerCase() === "pass") {
                          // If pass, redirect to discover-start
                          setLocalData("rFlow", false);
                          setLocalData("mFail", false);
                          setLocalData("rStep", 0);
                          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                            navigate("/");
                          } else {
                            navigate("/discover-start");
                          }
                          return;
                        } else {
                          // Fallback: if no sessionResult or unknown value, use handleNext if available
                          if (handleNext && typeof handleNext === "function") {
                            await handleNext(true);
                            return;
                          } else {
                            // Standalone mode - navigate to discover-start
                            setLocalData("rFlow", false);
                            setLocalData("mFail", false);
                            setLocalData("rStep", 0);
                            if (
                              process.env.REACT_APP_IS_APP_IFRAME === "true"
                            ) {
                              navigate("/");
                            } else {
                              navigate("/discover-start");
                            }
                          }
                        }
                      } catch (error) {
                        console.error("Error handling S1 completion:", error);
                        // On error, fallback to handleNext if available
                        if (handleNext && typeof handleNext === "function") {
                          await handleNext(true);
                          return;
                        }
                      }
                    } else {
                      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                      setSelectedWord(null);
                      setSelectedAudioIndex(null);
                      setWrongWord(null);
                      setWrongAudioIndex(null);
                      setShowConfetti(false);
                      setHasSelectedOption(false);
                    }
                  }}
                >
                  <NextButtonRound />
                </Box>
              </div>
            )}
          </>
        )}

        {recording === "recording" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "80px",
            }}
          >
            <div
              style={{
                backgroundColor: "#1897DE",
                padding: "16px 24px",
                borderRadius: "12px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                border: "5px solid #10618E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease-in-out",
                minWidth: "120px",
                minHeight: "60px",
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "28px",
                  fontFamily: "Quicksand",
                  textAlign: "center",
                }}
              >
                {isSoundMatch
                  ? currentQuestion.correctWord
                  : currentQuestion.word}
              </span>
            </div>
            <img
              onClick={async () => {
                await startRecording();
                setRecording("startRec");
              }}
              src={Assets.pzMic}
              alt="mic"
              style={{ width: "70px", height: "70px", cursor: "pointer" }}
            />
          </div>
        )}

        {recording === "startRec" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "80px",
            }}
          >
            <div
              style={{
                backgroundColor: "#1897DE",
                padding: "16px 24px",
                borderRadius: "12px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                border: "5px solid #10618E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease-in-out",
                minWidth: "120px",
                minHeight: "60px",
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "28px",
                  fontFamily: "Quicksand",
                  textAlign: "center",
                }}
              >
                {isSoundMatch
                  ? currentQuestion.correctWord
                  : currentQuestion.word}
              </span>
            </div>
            <Box style={{ marginTop: "10px", marginBottom: "10px" }}>
              <RecordVoiceVisualizer />
            </Box>
            <img
              onClick={async () => {
                console.log("Stop button clicked");

                // Stop recording and wait for API call to complete
                await stopRecording();

                const audio = new Audio(correctSound);
                audio.play();
                setRecording("no");
                setIsPlaying(false);
                setIsAudioPlayedOnce(false);
                setPlayingAudioIndex(null);

                if (currentQuestionIndex === filteredContent.length - 1) {
                  // All questions completed - call getSetResultPractice for S1
                  try {
                    const result = await handleS1Complete();

                    // Check sessionResult from API response
                    // Response structure: result.data.sessionResult (based on Practice.jsx pattern)
                    const getSetData = result?.data || result;
                    const sessionResult = getSetData?.sessionResult;
                    console.log("S1 completion - Full result:", result);
                    console.log("S1 completion - getSetData:", getSetData);
                    console.log("S1 sessionResult:", sessionResult);
                    console.log("S1 sessionResult type:", typeof sessionResult);
                    console.log(
                      "S1 sessionResult lowercased:",
                      sessionResult?.toLowerCase()
                    );

                    // Check for fail (case-insensitive)
                    if (sessionResult?.toLowerCase() === "fail") {
                      // If fail, move to next step in practice flow
                      console.log(
                        "S1 sessionResult is 'fail' - moving to next practice step"
                      );
                      console.log(
                        "handleNext available:",
                        !!handleNext,
                        "type:",
                        typeof handleNext
                      );
                      if (handleNext && typeof handleNext === "function") {
                        console.log(
                          "Calling handleNext(true) to move to next step"
                        );
                        await handleNext(true);
                        console.log(
                          "handleNext(true) completed - should have moved to next step"
                        );
                        return;
                      } else {
                        console.warn(
                          "handleNext is not available or not a function, cannot move to next step"
                        );
                      }
                    } else if (sessionResult?.toLowerCase() === "pass") {
                      // If pass, redirect to discover-start
                      setLocalData("rFlow", false);
                      setLocalData("mFail", false);
                      setLocalData("rStep", 0);
                      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                        navigate("/");
                      } else {
                        navigate("/discover-start");
                      }
                      return;
                    } else {
                      // Fallback: if no sessionResult or unknown value, use handleNext if available
                      if (handleNext && typeof handleNext === "function") {
                        await handleNext(true);
                        return;
                      } else {
                        // Standalone mode - navigate to discover-start
                        setLocalData("rFlow", false);
                        setLocalData("mFail", false);
                        setLocalData("rStep", 0);
                        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                          navigate("/");
                        } else {
                          navigate("/discover-start");
                        }
                      }
                    }
                  } catch (error) {
                    console.error("Error handling S1 completion:", error);
                    // On error, fallback to handleNext if available
                    if (handleNext && typeof handleNext === "function") {
                      await handleNext(true);
                      return;
                    }
                  }
                } else {
                  setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                  setSelectedWord(null);
                  setSelectedAudioIndex(null);
                  setWrongWord(null);
                  setWrongAudioIndex(null);
                  setShowConfetti(false);
                }
              }}
              src={Assets.pause}
              alt="Stop"
              style={{ width: "60px", height: "60px", cursor: "pointer" }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SoundHuntS1Combined;
