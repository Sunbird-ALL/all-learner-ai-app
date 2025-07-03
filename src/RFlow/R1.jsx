import React, { useState, useEffect } from "react";
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

const levelData = {
  en: {
    L1: [
      {
        allwords: [
          { img: getAssetUrl(s3Assets.singR1), text: "Sing" },
          { img: getAssetUrl(s3Assets.hugR1), text: "Hug" },
          { img: getAssetUrl(s3Assets.flagR1), text: "Flag" },
        ],
        correctWord: "Sing",
        audio: getAssetAudioUrl(s3Assets.singR1Eng),
        flowName: "P1",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.rootsR1), text: "Roots" },
          { img: getAssetUrl(s3Assets.beltR1), text: "Belt" },
          { img: getAssetUrl(s3Assets.rainR1), text: "Rain" },
        ],
        correctWord: "Rain",
        audio: getAssetAudioUrl(s3Assets.rainR1Eng),
        flowName: "P2",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.sunR1), text: "Sun" },
          { img: getAssetUrl(s3Assets.pigR1), text: "Pig" },
          { img: getAssetUrl(s3Assets.tieR1), text: "Tie" },
        ],
        correctWord: "Sun",
        audio: getAssetAudioUrl(s3Assets.sunR1Eng),
        flowName: "P3",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fireR1), text: "Fire" },
          { img: getAssetUrl(s3Assets.parkImg), text: "Park" },
          { img: getAssetUrl(s3Assets.shoeR1), text: "Shoe" },
        ],
        correctWord: "Park",
        audio: getAssetAudioUrl(s3Assets.parkR1Eng),
        flowName: "P4",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.bodyR1), text: "Body" },
          { img: getAssetUrl(s3Assets.kiteR1), text: "Kite" },
          { img: getAssetUrl(s3Assets.trayR1), text: "Tray" },
        ],
        correctWord: "Kite",
        audio: getAssetAudioUrl(s3Assets.kiteR1Eng),
        flowName: "P5",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.inkR1), text: "Ink" },
          { img: getAssetUrl(s3Assets.vanR1), text: "Van" },
          { img: getAssetUrl(s3Assets.manR1), text: "Man" },
        ],
        correctWord: "Man",
        audio: getAssetAudioUrl(s3Assets.manR1Eng),
        flowName: "P6",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.bikeR1), text: "Bike" },
          { img: getAssetUrl(s3Assets.eggR1), text: "Egg" },
          { img: getAssetUrl(s3Assets.giftR1), text: "Gift" },
        ],
        correctWord: "Egg",
        audio: getAssetAudioUrl(s3Assets.eggR1Eng),
        flowName: "P7",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.trafficR1), text: "Traffic" },
          { img: getAssetUrl(s3Assets.farmerR1), text: "Farmer" },
          { img: getAssetUrl(s3Assets.cubR1), text: "Cub" },
        ],
        correctWord: "Traffic",
        audio: getAssetAudioUrl(s3Assets.trafficR1Eng),
        flowName: "P8",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.carR1), text: "Car" },
          { img: getAssetUrl(s3Assets.hutR1), text: "Hut" },
          { img: getAssetUrl(s3Assets.beeR1), text: "Bee" },
        ],
        correctWord: "Car",
        audio: getAssetAudioUrl(s3Assets.carR1Eng),
        flowName: "P9",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.pearR1), text: "Pear" },
          { img: getAssetUrl(s3Assets.saltR1), text: "Salt" },
          { img: getAssetUrl(s3Assets.cakeR1), text: "Cake" },
        ],
        correctWord: "Cake",
        audio: getAssetAudioUrl(s3Assets.cakeR1Eng),
        flowName: "P10",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.aimR1), text: "Aim" },
          { img: getAssetUrl(s3Assets.legR1), text: "Leg" },
          { img: getAssetUrl(s3Assets.hatR1), text: "Hat" },
        ],
        correctWord: "Hat",
        audio: getAssetAudioUrl(s3Assets.hatR1Eng),
        flowName: "P11",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.jugR1), text: "Jug" },
          { img: getAssetUrl(s3Assets.soapR1), text: "Soap" },
          { img: getAssetUrl(s3Assets.gateR1), text: "Gate" },
        ],
        correctWord: "Jug",
        audio: getAssetAudioUrl(s3Assets.jugR1Eng),
        flowName: "P12",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.antR1), text: "Ant" },
          { img: getAssetUrl(s3Assets.fanR1), text: "Fan" },
          { img: getAssetUrl(s3Assets.mangoR1), text: "Mango" },
        ],
        correctWord: "Fan",
        audio: getAssetAudioUrl(s3Assets.fanR1Eng),
        flowName: "P13",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.basketImg), text: "Basket" },
          { img: getAssetUrl(s3Assets.vanR1), text: "Van" },
          { img: getAssetUrl(s3Assets.dogsBarkImg), text: "Dog" },
        ],
        correctWord: "Van",
        audio: getAssetAudioUrl(s3Assets.vanR1Eng),
        flowName: "P14",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.shipR1), text: "Ship" },
          { img: getAssetUrl(s3Assets.cryR1), text: "Cry" },
          { img: getAssetUrl(s3Assets.appleM1), text: "Apple" },
        ],
        correctWord: "Ship",
        audio: getAssetAudioUrl(s3Assets.shipR1Eng),
        flowName: "P15",
      },
    ],
  },
  hi: {
    L1: [
      {
        allwords: [
          { img: getAssetUrl(s3Assets.bagR1Hin), text: "Bag" },
          { img: getAssetUrl(s3Assets.kiteR1Hin), text: "Kite" },
          { img: getAssetUrl(s3Assets.jugR1), text: "Jug" },
        ],
        correctWord: "Jug",
        audio: getAssetAudioUrl(s3Assets.jugR1HinAud),
        flowName: "P1",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.jaalR1Hin), text: "Jaal" },
          { img: getAssetUrl(s3Assets.batR1Hin), text: "Bat" },
          { img: getAssetUrl(s3Assets.houseR1Hin), text: "House" },
        ],
        correctWord: "Jaal",
        audio: getAssetAudioUrl(s3Assets.jalR1HinAud),
        flowName: "P2",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fireR1Hin), text: "Fire" },
          { img: getAssetUrl(s3Assets.kadhR1Hin), text: "Kadhai" },
          { img: getAssetUrl(s3Assets.knifeR1Hin), text: "Knife" },
        ],
        correctWord: "Kadhai",
        audio: getAssetAudioUrl(s3Assets.kadhR1HinAud),
        flowName: "P3",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.cupR1Hin), text: "Cup" },
          { img: getAssetUrl(s3Assets.legR1Hin), text: "Leg" },
          { img: getAssetUrl(s3Assets.teaR1Hin), text: "Tea" },
        ],
        correctWord: "Cup",
        audio: getAssetAudioUrl(s3Assets.cupR1HinAud),
        flowName: "P4",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.medicineR1Hin), text: "Medicine" },
          { img: getAssetUrl(s3Assets.lunchR1Hin), text: "Lunch" },
          { img: getAssetUrl(s3Assets.bagR1Hin), text: "Bag" },
        ],
        correctWord: "Lunch",
        audio: getAssetAudioUrl(s3Assets.lunchR1HinAud),
        flowName: "P5",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.saltR1Hin), text: "Salt" },
          { img: getAssetUrl(s3Assets.teethR1Hin), text: "Teeth" },
          { img: getAssetUrl(s3Assets.cowR1KanImage), text: "Cow" },
        ],
        correctWord: "Cow",
        audio: getAssetAudioUrl(s3Assets.cowR1HinAud),
        flowName: "P6",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.medicineR1Hin), text: "Medicine" },
          { img: getAssetUrl(s3Assets.gadaR1Hin), text: "Gada" },
          { img: getAssetUrl(s3Assets.eggR1Hin), text: "Egg" },
        ],
        correctWord: "Gada",
        audio: getAssetAudioUrl(s3Assets.gadaR1HinAud),
        flowName: "P7",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.carR1Hin), text: "Car" },
          { img: getAssetUrl(s3Assets.TyreR1Hin), text: "Tyre" },
          { img: getAssetUrl(s3Assets.chandR1Hin), text: "Moon" },
        ],
        correctWord: "Car",
        audio: getAssetAudioUrl(s3Assets.carR1HinAud),
        flowName: "P8",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.kamalR1Hin), text: "Kamal" },
          { img: getAssetUrl(s3Assets.woonR1Hin), text: "Oon" },
          { img: getAssetUrl(s3Assets.mugR1Hin), text: "Mug" },
        ],
        correctWord: "Oon",
        audio: getAssetAudioUrl(s3Assets.oonR1HinAud),
        flowName: "P9",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.kamalR1Hin), text: "Kamal" },
          { img: getAssetUrl(s3Assets.rubberR1Hin), text: "Rubber" },
          { img: getAssetUrl(s3Assets.crowR1Hin), text: "Crow" },
        ],
        correctWord: "Kamal",
        audio: getAssetAudioUrl(s3Assets.kamalR1HinAud),
        flowName: "P10",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.snakeR1Hin), text: "Snake" },
          { img: getAssetUrl(s3Assets.noseR1Hin), text: "Nose" },
          { img: getAssetUrl(s3Assets.parrotR1Hin), text: "Parrot" },
        ],
        correctWord: "Nose",
        audio: getAssetAudioUrl(s3Assets.nakR1HinAud),
        flowName: "P11",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.dandaR1Hin), text: "Stick" },
          { img: getAssetUrl(s3Assets.fruitR1Hin), text: "Phal" },
          { img: getAssetUrl(s3Assets.mathR1Hin), text: "Math" },
        ],
        correctWord: "Phal",
        audio: getAssetAudioUrl(s3Assets.phalR1HinAud),
        flowName: "P12",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.danceR1Hin), text: "Nritya" },
          { img: getAssetUrl(s3Assets.peacockR1Hin), text: "Peacock" },
          { img: getAssetUrl(s3Assets.dressR1Hin), text: "Dress" },
        ],
        correctWord: "Nritya",
        audio: getAssetAudioUrl(s3Assets.nrityaR1HinAud),
        flowName: "P13",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.singerR1Hin), text: "Singer" },
          { img: getAssetUrl(s3Assets.donkeyR1Hin), text: "Pashu" },
          { img: getAssetUrl(s3Assets.eidR1Hin), text: "Eid" },
        ],
        correctWord: "Pashu",
        audio: getAssetAudioUrl(s3Assets.pashuR1HinAud),
        flowName: "P14",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.AutoR1Hin), text: "Auto" },
          { img: getAssetUrl(s3Assets.teacher2Img), text: "Teeth" },
          { img: getAssetUrl(s3Assets.neckR1Hin), text: "Neck" },
        ],
        correctWord: "Teeth",
        audio: getAssetAudioUrl(s3Assets.teacherM2Eng),
        flowName: "P15",
      },
    ],
  },
  ta: {
    L1: [
      {
        allwords: [
          { img: getAssetUrl(s3Assets.catR1Tam), text: "Cat" },
          { img: getAssetUrl(s3Assets.ratR1Tam), text: "Rat" },
          { img: getAssetUrl(s3Assets.eyeR1Tam), text: "Eye" },
        ],
        correctWord: "Eye",
        audio: getAssetAudioUrl(s3Assets.eyeR1TamAudio),
        flowName: "P1",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.soilR1Tam), text: "Soil" },
          { img: getAssetUrl(s3Assets.stoneR1Tam), text: "Stone" },
          { img: getAssetUrl(s3Assets.penR1Tam), text: "Pen" },
        ],
        correctWord: "Soil",
        audio: getAssetAudioUrl(s3Assets.soilR1TamAudio),
        flowName: "P2",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mountainR1Tam), text: "Mountain" },
          { img: getAssetUrl(s3Assets.elephantR1Tam), text: "Elephant" },
          { img: getAssetUrl(s3Assets.leafR1Tam), text: "Leaf" },
        ],
        correctWord: "Mountain",
        audio: getAssetAudioUrl(s3Assets.mountainR1TamAudio),
        flowName: "P3",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.plantR1Tam), text: "Plant" },
          { img: getAssetUrl(s3Assets.clothR1Tam), text: "Cloth" },
          { img: getAssetUrl(s3Assets.basketR1Tam), text: "Basket" },
        ],
        correctWord: "Cloth",
        audio: getAssetAudioUrl(s3Assets.clothR1TamAudio),
        flowName: "P4",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.dosaR1Tam), text: "Dosa" },
          { img: getAssetUrl(s3Assets.flagR1Tam), text: "Flag" },
          { img: getAssetUrl(s3Assets.bellR1Tam), text: "Bell" },
        ],
        correctWord: "Dosa",
        audio: getAssetAudioUrl(s3Assets.dosaR1TamAudio),
        flowName: "P5",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.teethR1Tam), text: "Teeth" },
          { img: getAssetUrl(s3Assets.drinkR1Tam), text: "Drink" },
          { img: getAssetUrl(s3Assets.cowR1Tam), text: "Cow" },
        ],
        correctWord: "Teeth",
        audio: getAssetAudioUrl(s3Assets.teethR1TamAudio),
        flowName: "P6",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fishR1Tam), text: "Fish" },
          { img: getAssetUrl(s3Assets.parrotR1Tam), text: "Parrot" },
          { img: getAssetUrl(s3Assets.tableR1Tam), text: "Table" },
        ],
        correctWord: "Fish",
        audio: getAssetAudioUrl(s3Assets.fishR1TamAudio),
        flowName: "P7",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.dosaR1Tam), text: "Vada" },
          { img: getAssetUrl(s3Assets.jarR1Tam), text: "Jar" },
          { img: getAssetUrl(s3Assets.flagR1Tam), text: "Flag" },
        ],
        correctWord: "Vada",
        audio: getAssetAudioUrl(s3Assets.vadaR1TamAudio),
        flowName: "P8",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.catR1Tam), text: "Cat" },
          { img: getAssetUrl(s3Assets.stoneR1Tam), text: "Stone" },
          { img: getAssetUrl(s3Assets.nestR1Tam), text: "Nest" },
        ],
        correctWord: "Stone",
        audio: getAssetAudioUrl(s3Assets.stoneR1TamAudio),
        flowName: "P9",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.tableR1Tam), text: "Table" },
          { img: getAssetUrl(s3Assets.henR1Tam), text: "Hen" },
          { img: getAssetUrl(s3Assets.swordR1Tam), text: "Sword" },
        ],
        correctWord: "Table",
        audio: getAssetAudioUrl(s3Assets.tableR1TamAudio),
        flowName: "P10",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.drinkR1Tam), text: "Drink" },
          { img: getAssetUrl(s3Assets.bellR1Tam), text: "Bell" },
          { img: getAssetUrl(s3Assets.tortoiseR1Tam), text: "Tortoise" },
        ],
        correctWord: "Drink",
        audio: getAssetAudioUrl(s3Assets.drinkR1TamAudio),
        flowName: "P11",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.penR1Tam), text: "Pen" },
          { img: getAssetUrl(s3Assets.catR1Tam), text: "Cat" },
          { img: getAssetUrl(s3Assets.ratR1Tam), text: "Rat" },
        ],
        correctWord: "Rat",
        audio: getAssetAudioUrl(s3Assets.ratR1TamAudio),
        flowName: "P12",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.eyeR1Tam), text: "Eye" },
          { img: getAssetUrl(s3Assets.moonR1Tam), text: "Moon" },
          { img: getAssetUrl(s3Assets.catR1Tam), text: "Cat" },
        ],
        correctWord: "Cat",
        audio: getAssetAudioUrl(s3Assets.catR1TamAudio),
        flowName: "P13",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.henR1Tam), text: "Hen" },
          { img: getAssetUrl(s3Assets.parrotR1Tam), text: "Parrot" },
          { img: getAssetUrl(s3Assets.soilR1Tam), text: "Soil" },
        ],
        correctWord: "Hen",
        audio: getAssetAudioUrl(s3Assets.henR1TamAudio),
        flowName: "P14",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.moustacheR1Tam), text: "Moustache" },
          { img: getAssetUrl(s3Assets.nestR1Tam), text: "Nest" },
          { img: getAssetUrl(s3Assets.elephantR1Tam), text: "Elephant" },
        ],
        correctWord: "Nest",
        audio: getAssetAudioUrl(s3Assets.nestR1TamAudio),
        flowName: "P15",
      },
    ],
  },
  kn: {
    L1: [
      {
        allwords: [
          { img: getAssetUrl(s3Assets.crowR1KanImage), text: "Crow" },
          { img: getAssetUrl(s3Assets.cowR1KanImage), text: "Cow" },
          { img: getAssetUrl(s3Assets.snakeR1KanImage), text: "Snake" },
        ],
        correctWord: "Cow",
        audio: getAssetAudioUrl(s3Assets.cowR1KanAudio),
        flowName: "P1",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.treeR1KanImage), text: "Tree" },
          { img: getAssetUrl(s3Assets.pigR1KanImage), text: "Pig" },
          { img: getAssetUrl(s3Assets.glassR1KanImage), text: "Glass" },
        ],
        correctWord: "Tree",
        audio: getAssetAudioUrl(s3Assets.TreeKan),
        flowName: "P2",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mangoR1KanImage), text: "Mango" },
          { img: getAssetUrl(s3Assets.juiceR1KanImage), text: "Juice" },
          { img: getAssetUrl(s3Assets.monkeyR1KanImage), text: "Monkey" },
        ],
        correctWord: "Juice",
        audio: getAssetAudioUrl(s3Assets.RasajuiceKan),
        flowName: "P3",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.ratR1KanImage), text: "Rat" },
          { img: getAssetUrl(s3Assets.spiderR1KanImage), text: "Spider" },
          { img: getAssetUrl(s3Assets.cloudR1KanImage), text: "Cloud" },
        ],
        correctWord: "Rat",
        audio: getAssetAudioUrl(s3Assets.ratR1KanAudio),
        flowName: "P4",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.farmerR1KanImage), text: "Farmer" },
          { img: getAssetUrl(s3Assets.fanR1KanImage), text: "Fan" },
          { img: getAssetUrl(s3Assets.featherR1KanImage), text: "Feather" },
        ],
        correctWord: "Feather",
        audio: getAssetAudioUrl(s3Assets.featherR1KanAudio),
        flowName: "P5",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.leafR1KanImage), text: "Leaf" },
          { img: getAssetUrl(s3Assets.noseR1KanImage), text: "Nose" },
          { img: getAssetUrl(s3Assets.laughR1KanImage), text: "Laugh" },
        ],
        correctWord: "Laugh",
        audio: getAssetAudioUrl(s3Assets.laughR1KanAudio),
        flowName: "P6",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fanR1KanImage), text: "Fan" },
          { img: getAssetUrl(s3Assets.jarR1KanImage), text: "Jar" },
          { img: getAssetUrl(s3Assets.wolfR1KanImage), text: "Wolf" },
        ],
        correctWord: "Fan",
        audio: getAssetAudioUrl(s3Assets.fanR1KanAudio),
        flowName: "P7",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.pigR1KanImage), text: "Pig" },
          { img: getAssetUrl(s3Assets.elephantR1KanImage), text: "Elephant" },
          { img: getAssetUrl(s3Assets.shirtR1KanImage), text: "Shirt" },
        ],
        correctWord: "Pig",
        audio: getAssetAudioUrl(s3Assets.pigR1KanAudio),
        flowName: "P8",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.ratR1KanImage), text: "Rat" },
          { img: getAssetUrl(s3Assets.leafR1KanImage), text: "Leaf" },
          { img: getAssetUrl(s3Assets.honybeeR1KanImage), text: "Honeybee" },
        ],
        correctWord: "Leaf",
        audio: getAssetAudioUrl(s3Assets.leafR1KanAudio),
        flowName: "P9",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.spiderR1KanImage), text: "Spider" },
          { img: getAssetUrl(s3Assets.plantR1KanImage), text: "Plant" },
          { img: getAssetUrl(s3Assets.featherR1KanImage), text: "Feather" },
        ],
        correctWord: "Spider",
        audio: getAssetAudioUrl(s3Assets.spiderR1KanAudio),
        flowName: "P10",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.carR1KanImage), text: "Car" },
          { img: getAssetUrl(s3Assets.parrotR1KanImage), text: "Parrot" },
          { img: getAssetUrl(s3Assets.glassR1KanImage), text: "Glass" },
        ],
        correctWord: "Car",
        audio: getAssetAudioUrl(s3Assets.carR1KanAudio),
        flowName: "P11",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.legR1KanImage), text: "Leg" },
          { img: getAssetUrl(s3Assets.treeR1KanImage), text: "Tree" },
          { img: getAssetUrl(s3Assets.snakeR1KanImage), text: "Snake" },
        ],
        correctWord: "Leg",
        audio: getAssetAudioUrl(s3Assets.legR1KanAudio),
        flowName: "P12",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.parrotR1KanImage), text: "Parrot" },
          { img: getAssetUrl(s3Assets.monkeyR1KanImage), text: "Monkey" },
          { img: getAssetUrl(s3Assets.cowR1KanImage), text: "Cow" },
        ],
        correctWord: "Parrot",
        audio: getAssetAudioUrl(s3Assets.parrotR1KanAudio),
        flowName: "P13",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.shirtR1KanImage), text: "Shirt" },
          { img: getAssetUrl(s3Assets.farmerR1KanImage), text: "Farmer" },
          { img: getAssetUrl(s3Assets.milkR1KanImage), text: "Milk" },
        ],
        correctWord: "Farmer",
        audio: getAssetAudioUrl(s3Assets.farmerR1KanAudio),
        flowName: "P14",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.pigR1KanImage), text: "Pig" },
          { img: getAssetUrl(s3Assets.monkeyR1KanImage), text: "Monkey" },
          { img: getAssetUrl(s3Assets.lionR1KanImage), text: "Lion" },
        ],
        correctWord: "Lion",
        audio: getAssetAudioUrl(s3Assets.lionKan),
        flowName: "P15",
      },
    ],
  },
  te: {
    L1: [
      {
        allwords: [
          { img: getAssetUrl(s3Assets.penR1Tel), text: "Pen" },
          { img: getAssetUrl(s3Assets.mouthR1Tel), text: "Mouth" },
          { img: getAssetUrl(s3Assets.shoeR1Tel), text: "Shoe" },
        ],
        correctWord: "Mouth",
        audio: getAssetAudioUrl(s3Assets.mouthR1TelAudio),
        flowName: "P1",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.waterR1Tel), text: "Water" },
          { img: getAssetUrl(s3Assets.featherR1Tel), text: "Feather" },
          { img: getAssetUrl(s3Assets.schoolR1Tel), text: "School" },
        ],
        correctWord: "Water",
        audio: getAssetAudioUrl(s3Assets.waterR1TelAudio),
        flowName: "P2",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.swanR1Tel), text: "Swan" },
          { img: getAssetUrl(s3Assets.milkR1Tel), text: "Milk" },
          { img: getAssetUrl(s3Assets.monkeyR1Tel), text: "Monkey" },
        ],
        correctWord: "Monkey",
        audio: getAssetAudioUrl(s3Assets.monkeyR1TelAudio),
        flowName: "P3",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.cheethaR1Tel), text: "Cheetah" },
          { img: getAssetUrl(s3Assets.moustacheR1Tel), text: "Moustache" },
          { img: getAssetUrl(s3Assets.lockR1Tel), text: "Lock" },
        ],
        correctWord: "Moustache",
        audio: getAssetAudioUrl(s3Assets.moustacheR1TelAudio),
        flowName: "P4",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.antR1Tel), text: "Ant" },
          {
            img: getAssetUrl(s3Assets.autorickshawR1Tel),
            text: "Autorickshaw",
          },
          { img: getAssetUrl(s3Assets.potR1Tel), text: "Pot" },
        ],
        correctWord: "Autorickshaw",
        audio: getAssetAudioUrl(s3Assets.autorickshawR1TelAudio),
        flowName: "P5",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.snakeR1Tel), text: "Snake" },
          { img: getAssetUrl(s3Assets.leafR1Tel), text: "Leaf" },
          { img: getAssetUrl(s3Assets.shipR1Tel), text: "Ship" },
        ],
        correctWord: "Snake",
        audio: getAssetAudioUrl(s3Assets.snakeR1TelAudio),
        flowName: "P6",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.neemR1Tel), text: "Neem" },
          { img: getAssetUrl(s3Assets.ballR1Tel), text: "Ball" },
          { img: getAssetUrl(s3Assets.antR1Tel), text: "Ant" },
        ],
        correctWord: "Ant",
        audio: getAssetAudioUrl(s3Assets.antR1TelAudio),
        flowName: "P7",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fruitR1Tel), text: "Fruit" },
          { img: getAssetUrl(s3Assets.lockR1Tel), text: "Lock" },
          { img: getAssetUrl(s3Assets.mugR1Tel), text: "Mug" },
        ],
        correctWord: "Mug",
        audio: getAssetAudioUrl(s3Assets.mugR1TelAudio),
        flowName: "P8",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.cheethaR1Tel), text: "Cheetah" },
          { img: getAssetUrl(s3Assets.duckR1Tel), text: "Duck" },
          { img: getAssetUrl(s3Assets.noseM2TamImg), text: "Nose" },
        ],
        correctWord: "Cheetah",
        audio: getAssetAudioUrl(s3Assets.cheetahR1TelAudio),
        flowName: "P9",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.shoeR1Tel), text: "Shoe" },
          { img: getAssetUrl(s3Assets.swingR1Tel), text: "Swing" },
          { img: getAssetUrl(s3Assets.necklaceR1Tel), text: "Necklace" },
        ],
        correctWord: "Shoe",
        audio: getAssetAudioUrl(s3Assets.shoeR1TelAudio),
        flowName: "P10",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.footR1Tel), text: "Foot" },
          { img: getAssetUrl(s3Assets.tigerR1Tel), text: "Tiger" },
          { img: getAssetUrl(s3Assets.mugR1Tel), text: "Mug" },
        ],
        correctWord: "Foot",
        audio: getAssetAudioUrl(s3Assets.footR1TelAudio),
        flowName: "P11",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.featherR1Tel), text: "Feather" },
          { img: getAssetUrl(s3Assets.neckR1Tel), text: "Neck" },
          { img: getAssetUrl(s3Assets.necklaceR1Tel), text: "Necklace" },
        ],
        correctWord: "Necklace",
        audio: getAssetAudioUrl(s3Assets.necklaceR1TelAudio),
        flowName: "P12",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.tigerR1Tel), text: "Tiger" },
          { img: getAssetUrl(s3Assets.penR1Tel), text: "Pen" },
          { img: getAssetUrl(s3Assets.milkR1Tel), text: "Milk" },
        ],
        correctWord: "Tiger",
        audio: getAssetAudioUrl(s3Assets.tigerR1TelAudio),
        flowName: "P13",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.lockR1Tel), text: "Lock" },
          { img: getAssetUrl(s3Assets.leafR1Tel), text: "Leaf" },
          { img: getAssetUrl(s3Assets.waterR1Tel), text: "Water" },
        ],
        correctWord: "Lock",
        audio: getAssetAudioUrl(s3Assets.lockR1TelAudio),
        flowName: "P14",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.swimR1Tel), text: "Swim" },
          { img: getAssetUrl(s3Assets.mugR1Tel), text: "Mug" },
          { img: getAssetUrl(s3Assets.swingR1Tel), text: "Swing" },
        ],
        correctWord: "Swing",
        audio: getAssetAudioUrl(s3Assets.swingR1TelAudio),
        flowName: "P15",
      },
    ],
  },
};

const R1 = ({
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongWord, setWrongWord] = useState(null);
  const [recording, setRecording] = useState("no");
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioPlayedOnce, setIsAudioPlayedOnce] = useState(false);
  const [scale, setScale] = useState(1);
  const lang = getLocalData("lang");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const content = levelData[lang];

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  steps = 1;

  const handleWordClick = (word) => {
    setSelectedWord(word);
    const currentQuestion = content.L1[currentQuestionIndex];

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

  const currentQuestion = content.L1[currentQuestionIndex];

  const flowNames = [...new Set(content.L1.map((item) => item.flowName))];
  const activeFlow = content.L1[currentQuestionIndex]?.flowName || flowNames[0];

  const correctImage = currentQuestion?.allwords?.find(
    (word) => word.text === currentQuestion?.correctWord
  )?.img;

  let currentAudio = null;

  const handlePlayAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
    }

    currentAudio = new Audio(content.L1[currentQuestionIndex].audio);

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
      pageName={"m14"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
      flowNames={flowNames} // Pass all flows
      activeFlow={activeFlow} // Pass current active flow
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
      {currentQuestion?.allwords ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "97vh",
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
                onClick={() => {
                  const audio = new Audio(correctSound);
                  audio.play();
                  setRecording("no");
                  setIsAudioPlayedOnce(false);
                  setIsPlaying(false);
                  if (currentQuestionIndex === content.L1.length - 1) {
                    setLocalData("rFlow", false);
                    setLocalData("mFail", false);
                    //window.location.reload();
                    if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                      navigate("/");
                    } else {
                      navigate("/discover-start");
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
                  onClick={() => {
                    const audio = new Audio(correctSound);
                    audio.play();
                    setRecording("no");
                    if (currentQuestionIndex === content.L1.length - 1) {
                      setLocalData("rFlow", false);
                      setLocalData("mFail", false);
                      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                        navigate("/");
                      } else {
                        navigate("/discover-start");
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

export default R1;
