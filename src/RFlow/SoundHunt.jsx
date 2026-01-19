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

const theme = createTheme();

const content = {
  L1: [
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.boatImg),
          text: "boat",
          audio: getAssetAudioUrl(s3Assets.boatAudio),
        },
        {
          img: getAssetUrl(s3Assets.hotImg),
          text: "hot",
          audio: getAssetAudioUrl(s3Assets.hotAudio),
        },
        {
          img: getAssetUrl(s3Assets.coatImg),
          text: "coat",
          audio: getAssetAudioUrl(s3Assets.coatAudio),
        },
      ],
      correctWord: "hot",
      audio: getAssetAudioUrl(s3Assets.hotAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.boatImg),
          text: "boat",
          audio: getAssetAudioUrl(s3Assets.boatAudio),
        },
        {
          img: getAssetUrl(s3Assets.toadImg),
          text: "toad",
          audio: getAssetAudioUrl(s3Assets.toadAudio),
        },
        {
          img: getAssetUrl(s3Assets.bikeImg),
          text: "bike",
          audio: getAssetAudioUrl(s3Assets.bikeAudio),
        },
      ],
      correctWord: "boat",
      audio: getAssetAudioUrl(s3Assets.boatAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.catImg),
          text: "cat",
          audio: getAssetAudioUrl(s3Assets.catAudio),
        },
        {
          img: getAssetUrl(s3Assets.tapImg),
          text: "tap",
          audio: getAssetAudioUrl(s3Assets.tapAudio),
        },
        {
          img: getAssetUrl(s3Assets.coatImg),
          text: "coat",
          audio: getAssetAudioUrl(s3Assets.coatAudio),
        },
      ],
      correctWord: "coat",
      audio: getAssetAudioUrl(s3Assets.coatAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.matImg),
          text: "mat",
          audio: getAssetAudioUrl(s3Assets.matAudio),
        },
        {
          img: getAssetUrl(s3Assets.toadImg),
          text: "toad",
          audio: getAssetAudioUrl(s3Assets.toadAudio),
        },
        {
          img: getAssetUrl(s3Assets.potImg),
          text: "pot",
          audio: getAssetAudioUrl(s3Assets.potAudio),
        },
      ],
      correctWord: "toad",
      audio: getAssetAudioUrl(s3Assets.toadAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.bikeImg),
          text: "bike",
          audio: getAssetAudioUrl(s3Assets.bikeAudio),
        },
        {
          img: getAssetUrl(s3Assets.godImg),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio),
        },
        {
          img: getAssetUrl(s3Assets.hotImg),
          text: "hot",
          audio: getAssetAudioUrl(s3Assets.hotAudio),
        },
      ],
      correctWord: "bike",
      audio: getAssetAudioUrl(s3Assets.bikeAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.boatImg),
          text: "boat",
          audio: getAssetAudioUrl(s3Assets.boatAudio),
        },
        {
          img: getAssetUrl(s3Assets.coatImg),
          text: "coat",
          audio: getAssetAudioUrl(s3Assets.coatAudio),
        },
        {
          img: getAssetUrl(s3Assets.catImg),
          text: "cat",
          audio: getAssetAudioUrl(s3Assets.catAudio),
        },
      ],
      correctWord: "cat",
      audio: getAssetAudioUrl(s3Assets.catAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.toadImg),
          text: "toad",
          audio: getAssetAudioUrl(s3Assets.toadAudio),
        },
        {
          img: getAssetUrl(s3Assets.tapImg),
          text: "tap",
          audio: getAssetAudioUrl(s3Assets.tapAudio),
        },
        {
          img: getAssetUrl(s3Assets.bikeImg),
          text: "bike",
          audio: getAssetAudioUrl(s3Assets.bikeAudio),
        },
      ],
      correctWord: "tap",
      audio: getAssetAudioUrl(s3Assets.tapAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.matImg),
          text: "mat",
          audio: getAssetAudioUrl(s3Assets.matAudio),
        },
        {
          img: getAssetUrl(s3Assets.catImg),
          text: "cat",
          audio: getAssetAudioUrl(s3Assets.catAudio),
        },
        {
          img: getAssetUrl(s3Assets.potImg),
          text: "pot",
          audio: getAssetAudioUrl(s3Assets.potAudio),
        },
      ],
      correctWord: "mat",
      audio: getAssetAudioUrl(s3Assets.matAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.godImg),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio),
        },
        {
          img: getAssetUrl(s3Assets.hotImg),
          text: "hot",
          audio: getAssetAudioUrl(s3Assets.hotAudio),
        },
        {
          img: getAssetUrl(s3Assets.potImg),
          text: "pot",
          audio: getAssetAudioUrl(s3Assets.potAudio),
        },
      ],
      correctWord: "pot",
      audio: getAssetAudioUrl(s3Assets.potAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.boatImg),
          text: "boat",
          audio: getAssetAudioUrl(s3Assets.boatAudio),
        },
        {
          img: getAssetUrl(s3Assets.godImg),
          text: "god",
          audio: getAssetAudioUrl(s3Assets.godAudio),
        },
        {
          img: getAssetUrl(s3Assets.coatImg),
          text: "coat",
          audio: getAssetAudioUrl(s3Assets.coatAudio),
        },
      ],
      correctWord: "god",
      audio: getAssetAudioUrl(s3Assets.godAudio),
      flowName: "P1",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.toeImg),
          text: "toe",
          audio: getAssetAudioUrl(s3Assets.toeAudio),
        },
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.packImg),
          text: "pack",
          audio: getAssetAudioUrl(s3Assets.packAudio),
        },
      ],
      correctWord: "toe",
      audio: getAssetAudioUrl(s3Assets.toeAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.tieImg),
          text: "tie",
          audio: getAssetAudioUrl(s3Assets.tieAudio),
        },
        {
          img: getAssetUrl(s3Assets.pineImg),
          text: "pine",
          audio: getAssetAudioUrl(s3Assets.pineAudio),
        },
        {
          img: getAssetUrl(s3Assets.timeImg),
          text: "time",
          audio: getAssetAudioUrl(s3Assets.timeAudio),
        },
      ],
      correctWord: "time",
      audio: getAssetAudioUrl(s3Assets.timeAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.tieImg),
          text: "tie",
          audio: getAssetAudioUrl(s3Assets.tieAudio),
        },
        {
          img: getAssetUrl(s3Assets.palmImg),
          text: "palm",
          audio: getAssetAudioUrl(s3Assets.palmAudio),
        },
        {
          img: getAssetUrl(s3Assets.pineImg),
          text: "pine",
          audio: getAssetAudioUrl(s3Assets.pineAudio),
        },
      ],
      correctWord: "pine",
      audio: getAssetAudioUrl(s3Assets.pineAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.nightImg),
          text: "night",
          audio: getAssetAudioUrl(s3Assets.nightAudio),
        },
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.tieImg),
          text: "tie",
          audio: getAssetAudioUrl(s3Assets.tieAudio),
        },
      ],
      correctWord: "tie",
      audio: getAssetAudioUrl(s3Assets.tieAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.nightImg),
          text: "night",
          audio: getAssetAudioUrl(s3Assets.nightAudio),
        },
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.pineImg),
          text: "pine",
          audio: getAssetAudioUrl(s3Assets.pineAudio),
        },
      ],
      correctWord: "bin",
      audio: getAssetAudioUrl(s3Assets.binAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.toeImg),
          text: "toe",
          audio: getAssetAudioUrl(s3Assets.toeAudio),
        },
        {
          img: getAssetUrl(s3Assets.packImg),
          text: "pack",
          audio: getAssetAudioUrl(s3Assets.packAudio),
        },
        {
          img: getAssetUrl(s3Assets.pondImg),
          text: "pond",
          audio: getAssetAudioUrl(s3Assets.pondAudio),
        },
      ],
      correctWord: "pack",
      audio: getAssetAudioUrl(s3Assets.packAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.palmImg),
          text: "palm",
          audio: getAssetAudioUrl(s3Assets.palmAudio),
        },
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.pineImg),
          text: "pine",
          audio: getAssetAudioUrl(s3Assets.pineAudio),
        },
      ],
      correctWord: "palm",
      audio: getAssetAudioUrl(s3Assets.palmAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.binImg),
          text: "bin",
          audio: getAssetAudioUrl(s3Assets.binAudio),
        },
        {
          img: getAssetUrl(s3Assets.pondImg),
          text: "pond",
          audio: getAssetAudioUrl(s3Assets.pondAudio),
        },
        {
          img: getAssetUrl(s3Assets.pitImg),
          text: "pit",
          audio: getAssetAudioUrl(s3Assets.pitAudio),
        },
      ],
      correctWord: "pond",
      audio: getAssetAudioUrl(s3Assets.pondAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.palmImg),
          text: "palm",
          audio: getAssetAudioUrl(s3Assets.palmAudio),
        },
        {
          img: getAssetUrl(s3Assets.nightImg),
          text: "night",
          audio: getAssetAudioUrl(s3Assets.nightAudio),
        },
        {
          img: getAssetUrl(s3Assets.pitImg),
          text: "pit",
          audio: getAssetAudioUrl(s3Assets.pitAudio),
        },
      ],
      correctWord: "pit",
      audio: getAssetAudioUrl(s3Assets.pitAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.pitImg),
          text: "pit",
          audio: getAssetAudioUrl(s3Assets.pitAudio),
        },
        {
          img: getAssetUrl(s3Assets.timeImg),
          text: "time",
          audio: getAssetAudioUrl(s3Assets.timeAudio),
        },
        {
          img: getAssetUrl(s3Assets.nightImg),
          text: "night",
          audio: getAssetAudioUrl(s3Assets.nightAudio),
        },
      ],
      correctWord: "night",
      audio: getAssetAudioUrl(s3Assets.nightAudio),
      flowName: "P3",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
        {
          img: getAssetUrl(s3Assets.breatheImg),
          text: "breathe",
          audio: getAssetAudioUrl(s3Assets.breatheAudio),
        },
        {
          img: getAssetUrl(s3Assets.jumpImg),
          text: "jump",
          audio: getAssetAudioUrl(s3Assets.jumpAudio),
        },
      ],
      correctWord: "jump",
      audio: getAssetAudioUrl(s3Assets.jumpAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
        {
          img: getAssetUrl(s3Assets.singImg),
          text: "sing",
          audio: getAssetAudioUrl(s3Assets.singAudio),
        },
        {
          img: getAssetUrl(s3Assets.breatheImg),
          text: "breathe",
          audio: getAssetAudioUrl(s3Assets.breatheAudio),
        },
      ],
      correctWord: "sing",
      audio: getAssetAudioUrl(s3Assets.singAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ringImg),
          text: "ring",
          audio: getAssetAudioUrl(s3Assets.ringAudio),
        },
        {
          img: getAssetUrl(s3Assets.jumpImg),
          text: "jump",
          audio: getAssetAudioUrl(s3Assets.jumpAudio),
        },
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
      ],
      correctWord: "ring",
      audio: getAssetAudioUrl(s3Assets.ringAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.pathImg),
          text: "path",
          audio: getAssetAudioUrl(s3Assets.pathAudio),
        },
        {
          img: getAssetUrl(s3Assets.wingImg),
          text: "wing",
          audio: getAssetAudioUrl(s3Assets.wingAudio),
        },
        {
          img: getAssetUrl(s3Assets.singImg),
          text: "sing",
          audio: getAssetAudioUrl(s3Assets.singAudio),
        },
      ],
      correctWord: "wing",
      audio: getAssetAudioUrl(s3Assets.wingAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.pathImg),
          text: "path",
          audio: getAssetAudioUrl(s3Assets.pathAudio),
        },
        {
          img: getAssetUrl(s3Assets.singImg),
          text: "sing",
          audio: getAssetAudioUrl(s3Assets.singAudio),
        },
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
      ],
      correctWord: "path",
      audio: getAssetAudioUrl(s3Assets.pathAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.mathImg),
          text: "math",
          audio: getAssetAudioUrl(s3Assets.mathAudio),
        },
        {
          img: getAssetUrl(s3Assets.ringImg),
          text: "ring",
          audio: getAssetAudioUrl(s3Assets.ringAudio),
        },
        {
          img: getAssetUrl(s3Assets.breatheImg),
          text: "breathe",
          audio: getAssetAudioUrl(s3Assets.breatheAudio),
        },
      ],
      correctWord: "math",
      audio: getAssetAudioUrl(s3Assets.mathAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.wingImg),
          text: "wing",
          audio: getAssetAudioUrl(s3Assets.wingAudio),
        },
        {
          img: getAssetUrl(s3Assets.furImg),
          text: "fur",
          audio: getAssetAudioUrl(s3Assets.furAudio),
        },
        {
          img: getAssetUrl(s3Assets.breatheImg),
          text: "breathe",
          audio: getAssetAudioUrl(s3Assets.breatheAudio),
        },
      ],
      correctWord: "breathe",
      audio: getAssetAudioUrl(s3Assets.breatheAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ringImg),
          text: "ring",
          audio: getAssetAudioUrl(s3Assets.ringAudio),
        },
        {
          img: getAssetUrl(s3Assets.runImg),
          text: "run",
          audio: getAssetAudioUrl(s3Assets.runAudio),
        },
        {
          img: getAssetUrl(s3Assets.jumpImg),
          text: "jump",
          audio: getAssetAudioUrl(s3Assets.jumpAudio),
        },
      ],
      correctWord: "run",
      audio: getAssetAudioUrl(s3Assets.runAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.ringImg),
          text: "ring",
          audio: getAssetAudioUrl(s3Assets.ringAudio),
        },
        {
          img: getAssetUrl(s3Assets.singImg),
          text: "sing",
          audio: getAssetAudioUrl(s3Assets.singAudio),
        },
        {
          img: getAssetUrl(s3Assets.birdImg),
          text: "bird",
          audio: getAssetAudioUrl(s3Assets.birdAudio),
        },
      ],
      correctWord: "bird",
      audio: getAssetAudioUrl(s3Assets.birdAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.furImg),
          text: "fur",
          audio: getAssetAudioUrl(s3Assets.furAudio),
        },
        {
          img: getAssetUrl(s3Assets.pathImg),
          text: "path",
          audio: getAssetAudioUrl(s3Assets.pathAudio),
        },
        {
          img: getAssetUrl(s3Assets.birdImg),
          text: "bird",
          audio: getAssetAudioUrl(s3Assets.birdAudio),
        },
      ],
      correctWord: "fur",
      audio: getAssetAudioUrl(s3Assets.furAudio),
      flowName: "P2",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.threeImg2),
          text: "three",
          audio: getAssetAudioUrl(s3Assets.threeAudio),
        },
        {
          img: getAssetUrl(s3Assets.riverImg),
          text: "river",
          audio: getAssetAudioUrl(s3Assets.riverAudio),
        },
        {
          img: getAssetUrl(s3Assets.thumbImg),
          text: "thumb",
          audio: getAssetAudioUrl(s3Assets.thumbAudio),
        },
      ],
      correctWord: "thumb",
      audio: getAssetAudioUrl(s3Assets.thumbAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.earthImg),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio),
        },
        {
          img: getAssetUrl(s3Assets.magicImg),
          text: "magic",
          audio: getAssetAudioUrl(s3Assets.magicAudio),
        },
        {
          img: getAssetUrl(s3Assets.mother2Img),
          text: "mother",
          audio: getAssetAudioUrl(s3Assets.motherAudio),
        },
      ],
      correctWord: "mother",
      audio: getAssetAudioUrl(s3Assets.motherAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.fatherImg),
          text: "father",
          audio: getAssetAudioUrl(s3Assets.fatherAudio),
        },
        {
          img: getAssetUrl(s3Assets.dinnerImg),
          text: "dinner",
          audio: getAssetAudioUrl(s3Assets.dinner2Audio),
        },
        {
          img: getAssetUrl(s3Assets.mother2Img),
          text: "mother",
          audio: getAssetAudioUrl(s3Assets.motherAudio),
        },
      ],
      correctWord: "father",
      audio: getAssetAudioUrl(s3Assets.fatherAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.dinnerImg),
          text: "dinner",
          audio: getAssetAudioUrl(s3Assets.dinner2Audio),
        },
        {
          img: getAssetUrl(s3Assets.riverImg),
          text: "river",
          audio: getAssetAudioUrl(s3Assets.riverAudio),
        },
        {
          img: getAssetUrl(s3Assets.threeImg2),
          text: "three",
          audio: getAssetAudioUrl(s3Assets.threeAudio),
        },
      ],
      correctWord: "three",
      audio: getAssetAudioUrl(s3Assets.threeAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.earthImg),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
        {
          img: getAssetUrl(s3Assets.rabbitImg),
          text: "rabbit",
          audio: getAssetAudioUrl(s3Assets.rabbitAudio),
        },
      ],
      correctWord: "rabbit",
      audio: getAssetAudioUrl(s3Assets.rabbitAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.magicImg),
          text: "magic",
          audio: getAssetAudioUrl(s3Assets.magicAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
        {
          img: getAssetUrl(s3Assets.riverImg),
          text: "river",
          audio: getAssetAudioUrl(s3Assets.riverAudio),
        },
      ],
      correctWord: "river",
      audio: getAssetAudioUrl(s3Assets.riverAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
        {
          img: getAssetUrl(s3Assets.rabbitImg),
          text: "rabbit",
          audio: getAssetAudioUrl(s3Assets.rabbitAudio),
        },
        {
          img: getAssetUrl(s3Assets.threeImg2),
          text: "three",
          audio: getAssetAudioUrl(s3Assets.threeAudio),
        },
      ],
      correctWord: "purple",
      audio: getAssetAudioUrl(s3Assets.purpleAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.dinnerImg),
          text: "dinner",
          audio: getAssetAudioUrl(s3Assets.dinner2Audio),
        },
        {
          img: getAssetUrl(s3Assets.fatherImg),
          text: "father",
          audio: getAssetAudioUrl(s3Assets.fatherAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
      ],
      correctWord: "dinner",
      audio: getAssetAudioUrl(s3Assets.dinner2Audio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.thumbImg),
          text: "thumb",
          audio: getAssetAudioUrl(s3Assets.thumbAudio),
        },
        {
          img: getAssetUrl(s3Assets.earthImg),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio),
        },
        {
          img: getAssetUrl(s3Assets.purpleImg),
          text: "purple",
          audio: getAssetAudioUrl(s3Assets.purpleAudio),
        },
      ],
      correctWord: "earth",
      audio: getAssetAudioUrl(s3Assets.earthAudio),
      flowName: "P4",
    },
    {
      allwords: [
        {
          img: getAssetUrl(s3Assets.magicImg),
          text: "magic",
          audio: getAssetAudioUrl(s3Assets.magicAudio),
        },
        {
          img: getAssetUrl(s3Assets.threeImg2),
          text: "three",
          audio: getAssetAudioUrl(s3Assets.threeAudio),
        },
        {
          img: getAssetUrl(s3Assets.earthImg),
          text: "earth",
          audio: getAssetAudioUrl(s3Assets.earthAudio),
        },
      ],
      correctWord: "magic",
      audio: getAssetAudioUrl(s3Assets.magicAudio),
      flowName: "P4",
    },
  ],
};

const SoundHunt = ({
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [recording, setRecording] = useState("no");
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlayedOnce, setIsAudioPlayedOnce] = useState(false);
  const [scale, setScale] = useState(1);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Filter content based on steps prop (from API/config)
  // steps comes from questions.length in Practice.jsx
  const filteredContent = useMemo(() => {
    if (steps && steps > 0) {
      // Limit to the number of questions specified by steps
      return content.L1.slice(0, steps);
    }
    // Default: show all questions
    return content.L1;
  }, [steps]);

  const handleWordClick = (word) => {
    setSelectedWord(word);
    const currentQuestion = filteredContent[currentQuestionIndex];

    if (word === currentQuestion.correctWord) {
      const audio = new Audio(correctSound);
      audio.play();
      setShowConfetti(true);
      setWrongWord(null);
      setTimeout(() => {
        setShowConfetti(false);
        setSelectedWord(null);
        // setCurrentQuestionIndex(
        //   (prevIndex) => (prevIndex + 1) % content.L1.length
        // );
        setRecording("recording");
      }, 3000);
    } else {
      const audio = new Audio(wrongSound);
      audio.play();
      setWrongWord(word);
      setTimeout(() => setWrongWord(null), 2000);
    }
  };

  const currentQuestion = filteredContent[currentQuestionIndex];

  const flowNames = [...new Set(filteredContent.map((item) => item.flowName))];
  const activeFlow =
    filteredContent[currentQuestionIndex]?.flowName || flowNames[0];

  const correctImage = currentQuestion?.allwords?.find(
    (word) => word.text === currentQuestion?.correctWord
  )?.img;

  let currentAudio = null;

  const handlePlayAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
    }

    currentAudio = new Audio(filteredContent[currentQuestionIndex].audio);

    currentAudio.play();
    setIsPlaying(true);
    setIsAudioPlayedOnce(true);

    currentAudio.onended = () => {
      setIsPlaying(false);
    };
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m1"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      flowNames={flowNames} // Pass all flows
      activeFlow={activeFlow} // Pass current active flow
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
      {currentQuestion?.allwords ? (
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
                  onClick={handlePlayAudio}
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

              <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
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
                          : "#FFFFFF",
                        padding: "8px",
                        borderRadius: "24px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        border: "2px solid rgba(255, 255, 255, 0.5)",
                        width: isMobile ? "60px" : "128px",
                        height: isMobile ? "60px" : "128px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(56px)",
                        WebkitBackdropFilter: "blur(56px)",
                        cursor: isAudioPlayedOnce ? "pointer" : "not-allowed",
                        opacity: isAudioPlayedOnce ? 1 : 0.7,
                        transition: "background-color 0.3s ease-in-out",
                      }}
                      onClick={() => {
                        if (isAudioPlayedOnce) {
                          handleWordClick(item.text);
                        }
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.text}
                        style={{
                          width: isMobile ? "55px" : "110px",
                          height: isMobile ? "55px" : "110px",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
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
                  backgroundColor: "#FFFFFF",
                  padding: "8px",
                  borderRadius: "24px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  width: "128px",
                  height: "128px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(56px)",
                  WebkitBackdropFilter: "blur(56px)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease-in-out",
                }}
                //onClick={() => handleWordClick(currentQuestion.correctWord)}
              >
                <img
                  src={correctImage}
                  alt={currentQuestion.correctWord}
                  style={{ width: "110px", height: "110px" }}
                />
              </div>
              <img
                onClick={() => {
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
                  backgroundColor: "#FFFFFF",
                  padding: "8px",
                  borderRadius: "24px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  width: "128px",
                  height: "128px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(56px)",
                  WebkitBackdropFilter: "blur(56px)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease-in-out",
                }}
                //onClick={() => handleWordClick(currentQuestion.correctWord)}
              >
                <img
                  src={correctImage}
                  alt={currentQuestion.correctWord}
                  style={{ width: "110px", height: "110px" }}
                />
              </div>
              <Box style={{ marginTop: "10px", marginBottom: "10px" }}>
                <RecordVoiceVisualizer />
              </Box>
              <img
                onClick={async () => {
                  const audio = new Audio(correctSound);
                  audio.play();
                  setRecording("no");
                  setIsPlaying(false);
                  setIsAudioPlayedOnce(false);
                  if (currentQuestionIndex === filteredContent.length - 1) {
                    // If handleNext prop is provided (e.g., from Practice flow), use it to update progress
                    if (handleNext && typeof handleNext === "function") {
                      // Call handleNext(true) to indicate mechanism is complete and trigger progress update
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
                  } else {
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                  }
                }}
                src={Assets.pause}
                alt="Stop"
                style={{ width: "60px", height: "60px", cursor: "pointer" }}
              />
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
                  onClick={async () => {
                    const audio = new Audio(correctSound);
                    audio.play();
                    setRecording("no");
                    setIsPlaying(false);
                    if (currentQuestionIndex === filteredContent.length - 1) {
                      // If handleNext prop is provided (e.g., from Practice flow), use it to update progress
                      if (handleNext && typeof handleNext === "function") {
                        // Call handleNext(true) to indicate mechanism is complete and trigger progress update
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

export default SoundHunt;
