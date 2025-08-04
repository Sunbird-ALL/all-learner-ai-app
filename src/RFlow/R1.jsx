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
import { response } from "../services/telementryService";

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
      {
        allwords: [
          { img: getAssetUrl(s3Assets.rootsR1Eng), text: "Roots" },
          { img: getAssetUrl(s3Assets.trayR1Eng), text: "Tray" },
          { img: getAssetUrl(s3Assets.earsR1Eng), text: "Ears" },
        ],
        correctWord: "Ears",
        audio: getAssetAudioUrl(s3Assets.earsR1Audio),
        flowName: "P16",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.flagR1Eng), text: "Flag" },
          { img: getAssetUrl(s3Assets.shoeR1Eng), text: "Shoe" },
          { img: getAssetUrl(s3Assets.ringR1Eng), text: "Ring" },
        ],
        correctWord: "Ring",
        audio: getAssetAudioUrl(s3Assets.ringR1Audio),
        flowName: "P17",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.spinR1Eng), text: "Spin" },
          { img: getAssetUrl(s3Assets.pearR1Eng), text: "Pear" },
          { img: getAssetUrl(s3Assets.beltR1Eng), text: "Belt" },
        ],
        correctWord: "Spin",
        audio: getAssetAudioUrl(s3Assets.spinR1Audio),
        flowName: "P18",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.gateR1Eng), text: "Gate" },
          { img: getAssetUrl(s3Assets.hugR1Eng), text: "Hug" },
          { img: getAssetUrl(s3Assets.inkR1Eng), text: "Ink" },
        ],
        correctWord: "Ink",
        audio: getAssetAudioUrl(s3Assets.inkR1Audio),
        flowName: "P19",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fanR1OneImg), text: "Fan" },
          { img: getAssetUrl(s3Assets.leafR1Eng), text: "Leaf" },
          { img: getAssetUrl(s3Assets.giftR1Eng), text: "Gift" },
        ],
        correctWord: "Gift",
        audio: getAssetAudioUrl(s3Assets.giftR1Audio),
        flowName: "P20",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.soapR1Eng), text: "Soap" },
          { img: getAssetUrl(s3Assets.fortR1Eng), text: "Fort" },
          { img: getAssetUrl(s3Assets.speakR1Eng), text: "Speak" },
        ],
        correctWord: "Speak",
        audio: getAssetAudioUrl(s3Assets.speakR1Audio),
        flowName: "P21",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.farmerR1Eng), text: "Farmer" },
          { img: getAssetUrl(s3Assets.bikeR1Eng), text: "Bike" },
          { img: getAssetUrl(s3Assets.mealR1Eng), text: "Meal" },
        ],
        correctWord: "Farmer",
        audio: getAssetAudioUrl(s3Assets.farmerR1Audio),
        flowName: "P22",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.cubR1Eng), text: "Cub" },
          { img: getAssetUrl(s3Assets.dollR1Eng), text: "Doll" },
          { img: getAssetUrl(s3Assets.sickR1Eng), text: "Sick" },
        ],
        correctWord: "Doll",
        audio: getAssetAudioUrl(s3Assets.dollR1Audio),
        flowName: "P23",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.saltR1Eng), text: "Salt" },
          { img: getAssetUrl(s3Assets.tieR1Eng), text: "Tie" },
          { img: getAssetUrl(s3Assets.limeR1Eng), text: "Lime" },
        ],
        correctWord: "Lime",
        audio: getAssetAudioUrl(s3Assets.limeR1Audio),
        flowName: "P24",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.antR1Eng), text: "Ant" },
          { img: getAssetUrl(s3Assets.bodyR1Eng), text: "Body" },
          { img: getAssetUrl(s3Assets.fireR1Eng), text: "Fire" },
        ],
        correctWord: "Ant",
        audio: getAssetAudioUrl(s3Assets.antR1Audio),
        flowName: "P25",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.pigR1Eng), text: "Pig" },
          { img: getAssetUrl(s3Assets.legR1Eng), text: "Leg" },
          { img: getAssetUrl(s3Assets.cryR1Eng), text: "Cry" },
        ],
        correctWord: "Cry",
        audio: getAssetAudioUrl(s3Assets.cryR1Audio),
        flowName: "P26",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.beeR1Eng), text: "Bee" },
          { img: getAssetUrl(s3Assets.hutR1Eng), text: "Hut" },
          { img: getAssetUrl(s3Assets.aimR1Eng), text: "Aim" },
        ],
        correctWord: "Aim",
        audio: getAssetAudioUrl(s3Assets.aimR1Audio),
        flowName: "P27",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.sickR1Eng), text: "Sick" },
          { img: getAssetUrl(s3Assets.fortR1Eng), text: "Fort" },
          { img: getAssetUrl(s3Assets.leafR1Eng), text: "Leaf" },
        ],
        correctWord: "Leaf",
        audio: getAssetAudioUrl(s3Assets.leafR1Audio),
        flowName: "P28",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.beltR1Eng), text: "Belt" },
          { img: getAssetUrl(s3Assets.gateR1Eng), text: "Gate" },
          { img: getAssetUrl(s3Assets.soapR1Eng), text: "Soap" },
        ],
        correctWord: "Soap",
        audio: getAssetAudioUrl(s3Assets.soapR1Audio),
        flowName: "P29",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.trayR1Eng), text: "Tray" },
          { img: getAssetUrl(s3Assets.shoeR1Eng), text: "Shoe" },
          { img: getAssetUrl(s3Assets.pearR1Eng), text: "Pear" },
        ],
        correctWord: "Pear",
        audio: getAssetAudioUrl(s3Assets.pearR1Audio),
        flowName: "P30",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fireR1Eng), text: "Fire" },
          { img: getAssetUrl(s3Assets.bodyR1Eng), text: "Body" },
          { img: getAssetUrl(s3Assets.legR1Eng), text: "Leg" },
        ],
        correctWord: "Body",
        audio: getAssetAudioUrl(s3Assets.bodyR1Audio),
        flowName: "P31",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.hugR1Eng), text: "Hug" },
          { img: getAssetUrl(s3Assets.bikeR1Eng), text: "Bike" },
          { img: getAssetUrl(s3Assets.tieR1Eng), text: "Tie" },
        ],
        correctWord: "Tie",
        audio: getAssetAudioUrl(s3Assets.tieR1Audio),
        flowName: "P32",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mealR1Eng), text: "Meal" },
          { img: getAssetUrl(s3Assets.saltR1Eng), text: "Salt" },
          { img: getAssetUrl(s3Assets.hutR1Eng), text: "Hut" },
        ],
        correctWord: "Hut",
        audio: getAssetAudioUrl(s3Assets.hutR1Audio),
        flowName: "P33",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.beeR1Eng), text: "Bee" },
          { img: getAssetUrl(s3Assets.cubR1Eng), text: "Cub" },
          { img: getAssetUrl(s3Assets.sickR1Eng), text: "Sick" },
        ],
        correctWord: "Bee",
        audio: getAssetAudioUrl(s3Assets.beeR1Audio),
        flowName: "P34",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fortR1Eng), text: "Fort" },
          { img: getAssetUrl(s3Assets.rootsR1Eng), text: "Roots" },
          { img: getAssetUrl(s3Assets.flagR1Eng), text: "Flag" },
        ],
        correctWord: "Roots",
        audio: getAssetAudioUrl(s3Assets.rootsR1Audio),
        flowName: "P35",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.shoeR1Eng), text: "Shoe" },
          { img: getAssetUrl(s3Assets.gateR1Eng), text: "Gate" },
          { img: getAssetUrl(s3Assets.trayR1Eng), text: "Tray" },
        ],
        correctWord: "Tray",
        audio: getAssetAudioUrl(s3Assets.trayR1Audio),
        flowName: "P36",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.legR1Eng), text: "Leg" },
          { img: getAssetUrl(s3Assets.fireR1Eng), text: "Fire" },
          { img: getAssetUrl(s3Assets.pigR1Eng), text: "Pig" },
        ],
        correctWord: "Pig",
        audio: getAssetAudioUrl(s3Assets.pigR1Audio),
        flowName: "P37",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.sickR1Eng), text: "Sick" },
          { img: getAssetUrl(s3Assets.cryR1Eng), text: "Cry" },
          { img: getAssetUrl(s3Assets.antR1Eng), text: "Ant" },
        ],
        correctWord: "Sick",
        audio: getAssetAudioUrl(s3Assets.sickR1Audio),
        flowName: "P38",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.beltR1Eng), text: "Belt" },
          { img: getAssetUrl(s3Assets.mealR1Eng), text: "Meal" },
          { img: getAssetUrl(s3Assets.flagR1Eng), text: "Flag" },
        ],
        correctWord: "Flag",
        audio: getAssetAudioUrl(s3Assets.flagR1Audio),
        flowName: "P39",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.hugR1Eng), text: "Hug" },
          { img: getAssetUrl(s3Assets.inkR1Eng), text: "Ink" },
          { img: getAssetUrl(s3Assets.ringR1Eng), text: "Ring" },
        ],
        correctWord: "Hug",
        audio: getAssetAudioUrl(s3Assets.hugR1Audio),
        flowName: "P40",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.spinR1Eng), text: "Spin" },
          { img: getAssetUrl(s3Assets.farmerR1Eng), text: "Farmer" },
          { img: getAssetUrl(s3Assets.speakR1Eng), text: "Speak" },
        ],
        correctWord: "Spin",
        audio: getAssetAudioUrl(s3Assets.spinR1Audio),
        flowName: "P41",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.giftR1Eng), text: "Gift" },
          { img: getAssetUrl(s3Assets.leafR1Eng), text: "Leaf" },
          { img: getAssetUrl(s3Assets.dollR1Eng), text: "Doll" },
        ],
        correctWord: "Gift",
        audio: getAssetAudioUrl(s3Assets.giftR1Audio),
        flowName: "P42",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.limeR1Eng), text: "Lime" },
          { img: getAssetUrl(s3Assets.aimR1Eng), text: "Aim" },
          { img: getAssetUrl(s3Assets.cubR1Eng), text: "Cub" },
        ],
        correctWord: "Cub",
        audio: getAssetAudioUrl(s3Assets.cubR1Audio),
        flowName: "P43",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.bikeR1Eng), text: "Bike" },
          { img: getAssetUrl(s3Assets.tieR1Eng), text: "Tie" },
          { img: getAssetUrl(s3Assets.earsR1Eng), text: "Ears" },
        ],
        correctWord: "Bike",
        audio: getAssetAudioUrl(s3Assets.bikeR1Audio),
        flowName: "P44",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.speakR1Eng), text: "Speak" },
          { img: getAssetUrl(s3Assets.saltR1Eng), text: "Salt" },
          { img: getAssetUrl(s3Assets.fanR1Kan), text: "Fan" },
        ],
        correctWord: "Salt",
        audio: getAssetAudioUrl(s3Assets.saltR1Audio),
        flowName: "P45",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mealR1Eng), text: "Meal" },
          { img: getAssetUrl(s3Assets.fireR1Eng), text: "Fire" },
          { img: getAssetUrl(s3Assets.legR1Eng), text: "Leg" },
        ],
        correctWord: "Leg",
        audio: getAssetAudioUrl(s3Assets.legR1Audio),
        flowName: "P46",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.gateR1Eng), text: "Gate" },
          { img: getAssetUrl(s3Assets.shoeR1Eng), text: "Shoe" },
          { img: getAssetUrl(s3Assets.rootsR1Eng), text: "Roots" },
        ],
        correctWord: "Gate",
        audio: getAssetAudioUrl(s3Assets.gateR1Audio),
        flowName: "P47",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fortR1Eng), text: "Fort" },
          { img: getAssetUrl(s3Assets.hutR1Eng), text: "Hut" },
          { img: getAssetUrl(s3Assets.pearR1Eng), text: "Pear" },
        ],
        correctWord: "Fort",
        audio: getAssetAudioUrl(s3Assets.fortR1Audio),
        flowName: "P48",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.ringR1Eng), text: "Ring" },
          { img: getAssetUrl(s3Assets.mealR1Eng), text: "Meal" },
          { img: getAssetUrl(s3Assets.spinR1Eng), text: "Spin" },
        ],
        correctWord: "Meal",
        audio: getAssetAudioUrl(s3Assets.mealR1Audio),
        flowName: "P49",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.farmerR1Eng), text: "Farmer" },
          { img: getAssetUrl(s3Assets.dollR1Eng), text: "Doll" },
          { img: getAssetUrl(s3Assets.cryR1Eng), text: "Cry" },
        ],
        correctWord: "Farmer",
        audio: getAssetAudioUrl(s3Assets.farmerR1Audio),
        flowName: "P50",
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
          { img: getAssetUrl(s3Assets.teacher2Img), text: "Teeth" }, //audios
          { img: getAssetUrl(s3Assets.neckR1Hin), text: "Neck" },
        ],
        correctWord: "Teeth",
        audio: getAssetAudioUrl(s3Assets.teacherM2Eng),
        flowName: "P15",
      },

      {
        allwords: [
          { img: getAssetUrl(s3Assets.BrushR1HinImg), text: "Brush" },
          { img: getAssetUrl(s3Assets.carrotR1HinImg), text: "Carrot" },
          { img: getAssetUrl(s3Assets.gamlaR1HinImg), text: "Gamla" },
        ],
        correctWord: "Carrot",
        audio: getAssetAudioUrl(s3Assets.gajarR1HinAudio),
        flowName: "P16",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.EagleR1HinImg), text: "Eagle" },
          { img: getAssetUrl(s3Assets.hockeyR1HinImg), text: "Hockey" },
          { img: getAssetUrl(s3Assets.oilR1HinImg), text: "Oil" },
        ],
        correctWord: "Eagle",
        audio: getAssetAudioUrl(s3Assets.baazR1HinAudio),
        flowName: "P17",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.bodyR1HinImg), text: "Body" },
          { img: getAssetUrl(s3Assets.coffeeR1HinImg), text: "Coffee" },
          { img: getAssetUrl(s3Assets.tigerR1HinImg), text: "Tiger" },
        ],
        correctWord: "Tiger",
        audio: getAssetAudioUrl(s3Assets.sherR1HinAudio),
        flowName: "P18",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.ballR1HinImg), text: "Ball" },
          { img: getAssetUrl(s3Assets.peacockR1Hin), text: "Peacock" },
          { img: getAssetUrl(s3Assets.AutoR1Hin), text: "Auto" },
        ],
        correctWord: "Peacock",
        audio: getAssetAudioUrl(s3Assets.morR1HinAudio),
        flowName: "P19",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.donkeyR1HinImg), text: "Donkey" },
          { img: getAssetUrl(s3Assets.teacherR1Hin), text: "Teacher" },
          { img: getAssetUrl(s3Assets.mugR1Hin), text: "Mug" },
        ],
        correctWord: "Donkey",
        audio: getAssetAudioUrl(s3Assets.gadhaR1HinAudio),
        flowName: "P20",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.singerR1HinImg), text: "Singer" },
          { img: getAssetUrl(s3Assets.teaR1HinImg), text: "Tea" },
          { img: getAssetUrl(s3Assets.fireR1HinImg), text: "Fire" },
        ],
        correctWord: "Singer",
        audio: getAssetAudioUrl(s3Assets.gayakR1HinAudio),
        flowName: "P21",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.danceR1HinImg), text: "Dance" },
          { img: getAssetUrl(s3Assets.medicineR1Hin), text: "Medicine" },
          { img: getAssetUrl(s3Assets.saltR1HinImg), text: "Salt" },
        ],
        correctWord: "Salt",
        audio: getAssetAudioUrl(s3Assets.namakR1HinAudio),
        flowName: "P22",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.gadaR1HinImg), text: "Gada" },
          { img: getAssetUrl(s3Assets.eggR1HinImg), text: "Egg" },
          { img: getAssetUrl(s3Assets.dandaR1Hin), text: "Stick" },
        ],
        correctWord: "Egg",
        audio: getAssetAudioUrl(s3Assets.andaR1HinAudio),
        flowName: "P23",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.BrushR1HinImg), text: "Brush" },
          { img: getAssetUrl(s3Assets.teethR1HinImg), text: "Teeth" },
          { img: getAssetUrl(s3Assets.legR1HinImg), text: "Leg" },
        ],
        correctWord: "Brush",
        audio: getAssetAudioUrl(s3Assets.manjanR1HinAudio),
        flowName: "P24",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.oilR1HinImg), text: "Oil" },
          { img: getAssetUrl(s3Assets.hockeyR1HinImg), text: "Hockey" },
          { img: getAssetUrl(s3Assets.coffeeR1HinImg), text: "Coffee" },
        ],
        correctWord: "Oil",
        audio: getAssetAudioUrl(s3Assets.telR1HinAudio),
        flowName: "P25",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.tigerR1HinImg), text: "Tiger" },
          { img: getAssetUrl(s3Assets.snakeR1HinImg), text: "Snake" },
          { img: getAssetUrl(s3Assets.parrotR1HinImg), text: "Parrot" },
        ],
        correctWord: "Snake",
        audio: getAssetAudioUrl(s3Assets.saapR1HinAudio),
        flowName: "P26",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.ballR1HinImg), text: "Ball" },
          { img: getAssetUrl(s3Assets.hockeyR1HinImg), text: "Hockey" },
          { img: getAssetUrl(s3Assets.batR1HinImg), text: "Bat" },
        ],
        correctWord: "Ball",
        audio: getAssetAudioUrl(s3Assets.gendR1HinAudio),
        flowName: "P27",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.crowR1HinImg), text: "Crow" },
          { img: getAssetUrl(s3Assets.parrotR1HinImg), text: "Parrot" },
          { img: getAssetUrl(s3Assets.EagleR1HinImg), text: "Eagle" },
        ],
        correctWord: "Crow",
        audio: getAssetAudioUrl(s3Assets.kauwaR1HinAudio),
        flowName: "P28",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.knifeR1HinImg), text: "Knife" },
          { img: getAssetUrl(s3Assets.kadhR1HinImg), text: "Kadhai" },
          { img: getAssetUrl(s3Assets.dandaR1Hin), text: "Stick" },
        ],
        correctWord: "Knife",
        audio: getAssetAudioUrl(s3Assets.chakuR1HinAudio),
        flowName: "P29",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.parrotR1HinImg), text: "Parrot" },
          { img: getAssetUrl(s3Assets.crowR1HinImg), text: "Crow" },
          { img: getAssetUrl(s3Assets.donkeyR1HinImg), text: "Donkey" },
        ],
        correctWord: "Parrot",
        audio: getAssetAudioUrl(s3Assets.totaR1HinAudio),
        flowName: "P30",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.houseR1HinImg), text: "House" },
          { img: getAssetUrl(s3Assets.gamlaR1HinImg), text: "Gamla" },
          { img: getAssetUrl(s3Assets.dressR1HinImg), text: "Dress" },
        ],
        correctWord: "House",
        audio: getAssetAudioUrl(s3Assets.gharR1HinAudio),
        flowName: "P31",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.chandR1HinImg), text: "Moon" },
          { img: getAssetUrl(s3Assets.fireR1HinImg), text: "Fire" },
          { img: getAssetUrl(s3Assets.teaR1HinImg), text: "Tea" },
        ],
        correctWord: "Moon",
        audio: getAssetAudioUrl(s3Assets.chaandR1HinAudio),
        flowName: "P32",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.legR1HinImg), text: "Leg" },
          { img: getAssetUrl(s3Assets.neckR1HinImg), text: "Neck" },
          { img: getAssetUrl(s3Assets.noseR1HinImg), text: "Nose" },
        ],
        correctWord: "Leg",
        audio: getAssetAudioUrl(s3Assets.taangR1HinAudio),
        flowName: "P33",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.AutoR1Hin), text: "Auto" },
          { img: getAssetUrl(s3Assets.carR1HinImg), text: "Car" },
          { img: getAssetUrl(s3Assets.TyreR1HinImg), text: "Tyre" },
        ],
        correctWord: "Auto",
        audio: getAssetAudioUrl(s3Assets.autoR1HinAudio),
        flowName: "P34",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.teaR1HinImg), text: "Tea" },
          { img: getAssetUrl(s3Assets.coffeeR1HinImg), text: "Coffee" },
          { img: getAssetUrl(s3Assets.medicineR1Hin), text: "Medicine" },
        ],
        correctWord: "Tea",
        audio: getAssetAudioUrl(s3Assets.chaiR1HinAudio),
        flowName: "P35",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fireR1HinImg), text: "Fire" },
          { img: getAssetUrl(s3Assets.gadaR1HinImg), text: "Gada" },
          { img: getAssetUrl(s3Assets.oilR1HinImg), text: "Oil" },
        ],
        correctWord: "Fire",
        audio: getAssetAudioUrl(s3Assets.aagR1HinAudio),
        flowName: "P36",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.dressR1HinImg), text: "Dress" },
          { img: getAssetUrl(s3Assets.rubberR1HinImg), text: "Rubber" },
          { img: getAssetUrl(s3Assets.kiteR1HinImg), text: "Kite" },
        ],
        correctWord: "Dress",
        audio: getAssetAudioUrl(s3Assets.kapdaR1HinAudio),
        flowName: "P37",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mathR1HinImg), text: "Math" },
          { img: getAssetUrl(s3Assets.danceR1HinImg), text: "Dance" },
          { img: getAssetUrl(s3Assets.hockeyR1HinImg), text: "Hockey" },
        ],
        correctWord: "Math",
        audio: getAssetAudioUrl(s3Assets.ganitR1HinAudio),
        flowName: "P38",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.batR1HinImg), text: "Bat" },
          { img: getAssetUrl(s3Assets.hockeyR1HinImg), text: "Hockey" },
          { img: getAssetUrl(s3Assets.chandR1HinImg), text: "Chand" },
        ],
        correctWord: "Bat",
        audio: getAssetAudioUrl(s3Assets.batR1HinAudio),
        flowName: "P39",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.neckR1HinImg), text: "Neck" },
          { img: getAssetUrl(s3Assets.noseR1HinImg), text: "Nose" },
          { img: getAssetUrl(s3Assets.teethR1HinImg), text: "Teeth" },
        ],
        correctWord: "Neck",
        audio: getAssetAudioUrl(s3Assets.galaR1HinAudio),
        flowName: "P40",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.coffeeR1HinImg), text: "Coffee" },
          { img: getAssetUrl(s3Assets.teaR1HinImg), text: "Tea" },
          { img: getAssetUrl(s3Assets.medicineR1Hin), text: "Medicine" },
        ],
        correctWord: "Coffee",
        audio: getAssetAudioUrl(s3Assets.coffeeR1HinAudio),
        flowName: "P41",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.dandaR1Hin), text: "Stick" },
          { img: getAssetUrl(s3Assets.batR1HinImg), text: "Bat" },
          { img: getAssetUrl(s3Assets.hockeyR1HinImg), text: "Hockey" },
        ],
        correctWord: "Stick",
        audio: getAssetAudioUrl(s3Assets.dandaR1HinAudio),
        flowName: "P42",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.hockeyR1HinImg), text: "Hockey" },
          { img: getAssetUrl(s3Assets.batR1HinImg), text: "Bat" },
          { img: getAssetUrl(s3Assets.ballR1HinImg), text: "Ball" },
        ],
        correctWord: "Hockey",
        audio: getAssetAudioUrl(s3Assets.hockeyR1HinAudio),
        flowName: "P43",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.eidR1Hin), text: "Eid" },
          { img: getAssetUrl(s3Assets.danceR1HinImg), text: "Dance" },
          { img: getAssetUrl(s3Assets.singerR1HinImg), text: "Singer" },
        ],
        correctWord: "Eid",
        audio: getAssetAudioUrl(s3Assets.eidR1HinAudio),
        flowName: "P44",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.tigerR1HinImg), text: "Tiger" },
          { img: getAssetUrl(s3Assets.cheetahR1Hin), text: "Cheetah" },
          { img: getAssetUrl(s3Assets.donkeyR1HinImg), text: "Donkey" },
        ],
        correctWord: "Cheetah",
        audio: getAssetAudioUrl(s3Assets.cheetahR1HinAudio),
        flowName: "P45",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.bodyR1HinImg), text: "Body" },
          { img: getAssetUrl(s3Assets.legR1HinImg), text: "Leg" },
          { img: getAssetUrl(s3Assets.neckR1HinImg), text: "Neck" },
        ],
        correctWord: "Body",
        audio: getAssetAudioUrl(s3Assets.tanR1HinAudio),
        flowName: "P46",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.kamalR1HinImg), text: "Kamal" },
          { img: getAssetUrl(s3Assets.gamlaR1HinImg), text: "Gamla" },
          { img: getAssetUrl(s3Assets.fruitR1HinImg), text: "Fruit" },
        ],
        correctWord: "Kamal",
        audio: getAssetAudioUrl(s3Assets.kamalR1HinAud),
        flowName: "P47",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.rubberR1HinImg), text: "Rubber" },
          { img: getAssetUrl(s3Assets.dressR1HinImg), text: "Dress" },
          { img: getAssetUrl(s3Assets.kiteR1HinImg), text: "Kite" },
        ],
        correctWord: "Rubber",
        audio: getAssetAudioUrl(s3Assets.rabarR1HinAudio),
        flowName: "P48",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.kiteR1HinImg), text: "Kite" },
          { img: getAssetUrl(s3Assets.ballR1HinImg), text: "Ball" },
          { img: getAssetUrl(s3Assets.batR1HinImg), text: "Bat" },
        ],
        correctWord: "Kite",
        audio: getAssetAudioUrl(s3Assets.patangR1HinAudio),
        flowName: "P49",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.gamlaR1HinImg), text: "Gamla" },
          { img: getAssetUrl(s3Assets.houseR1HinImg), text: "House" },
          { img: getAssetUrl(s3Assets.kamalR1HinImg), text: "Kamal" },
        ],
        correctWord: "Gamla",
        audio: getAssetAudioUrl(s3Assets.gamlaR1HinAudio),
        flowName: "P50",
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
          { img: getAssetUrl(s3Assets.sandM1Tam), text: "Soil" },
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
        audio: getAssetAudioUrl(s3Assets.dosaAudio),
        flowName: "P5",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.teethR1Tam), text: "Teeth" },
          { img: getAssetUrl(s3Assets.drinkR1Tam), text: "Drink" },
          { img: getAssetUrl(s3Assets.cowR1Tam), text: "Cow" },
        ],
        correctWord: "Teeth",
        audio: getAssetAudioUrl(s3Assets.toothAudio),
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
        audio: getAssetAudioUrl(s3Assets.tableAudio),
        flowName: "P10",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.happyR1), text: "Happy" },
          { img: getAssetUrl(s3Assets.bellR1Tam), text: "Bell" },
          { img: getAssetUrl(s3Assets.tortoiseR1Tam), text: "Tortoise" },
        ],
        correctWord: "Happy",
        audio: getAssetAudioUrl(s3Assets.happpyAudio),
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
      {
        allwords: [
          { img: getAssetUrl(s3Assets.honeyR1TamImage), text: "Honey" },
          { img: getAssetUrl(s3Assets.rainR1TamImage), text: "Rain" },
          { img: getAssetUrl(s3Assets.jumpR1TamImage), text: "Jump" },
        ],
        correctWord: "Honey",
        audio: getAssetAudioUrl(s3Assets.honeyR1TamAudio),
        flowName: "P16",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.drumR1TamImage), text: "Drum" },
          { img: getAssetUrl(s3Assets.umbrellaR1TamImage), text: "Umbrella" },
          { img: getAssetUrl(s3Assets.headR1TamImage), text: "Head" },
        ],
        correctWord: "Drum",
        audio: getAssetAudioUrl(s3Assets.drumR1TamAudio),
        flowName: "P17",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.muscleR1TamImage), text: "Muscle" },
          { img: getAssetUrl(s3Assets.laughR1TamImage), text: "Laugh" },
          { img: getAssetUrl(s3Assets.roseR1TamImage), text: "Rose" },
        ],
        correctWord: "Rose",
        audio: getAssetAudioUrl(s3Assets.roseR1TamAudio),
        flowName: "P18",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.houseR1TamImage), text: "House" },
          { img: getAssetUrl(s3Assets.bellR1TamImage), text: "Bell" },
          { img: getAssetUrl(s3Assets.musicR1TamImage), text: "Music" },
        ],
        correctWord: "House",
        audio: getAssetAudioUrl(s3Assets.houseR1TamAudio),
        flowName: "P19",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.snowR1TamImage), text: "Snow" },
          { img: getAssetUrl(s3Assets.meatR1TamImage), text: "Meat" },
          { img: getAssetUrl(s3Assets.alcoholR1TamImage), text: "Alcohol" },
        ],
        correctWord: "Snow",
        audio: getAssetAudioUrl(s3Assets.snowR1TamAudio),
        flowName: "P20",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.flagR1TamImage), text: "FLag" },
          { img: getAssetUrl(s3Assets.personR1TamImage), text: "Person" },
          { img: getAssetUrl(s3Assets.runR1TamImage), text: "Run" },
        ],
        correctWord: "FLag",
        audio: getAssetAudioUrl(s3Assets.flagR1TamAudio),
        flowName: "P21",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.infantR1TamImage), text: "Infant" },
          { img: getAssetUrl(s3Assets.cookR1TamImage), text: "Cook" },
          { img: getAssetUrl(s3Assets.leafR1TamImage), text: "Leaf" },
        ],
        correctWord: "Leaf",
        audio: getAssetAudioUrl(s3Assets.leafR1TamAudio),
        flowName: "P22",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mosquitoR1TamImage), text: "Mosquito" },
          { img: getAssetUrl(s3Assets.tortoiseR1TamImage), text: "Tortoise" },
          { img: getAssetUrl(s3Assets.jumpR1TamImage), text: "Jump" },
        ],
        correctWord: "Mosquito",
        audio: getAssetAudioUrl(s3Assets.mosquitoR1TamAudio),
        flowName: "P23",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.umbrellaR1TamImage), text: "Umbrella" },
          { img: getAssetUrl(s3Assets.headR1TamImage), text: "Head" },
          { img: getAssetUrl(s3Assets.muscleR1TamImage), text: "Muscle" },
        ],
        correctWord: "Umbrella",
        audio: getAssetAudioUrl(s3Assets.umbrellaR1TamAudio),
        flowName: "P24",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.laughR1TamImage), text: "Laugh" },
          { img: getAssetUrl(s3Assets.musicR1TamImage), text: "Music" },
          { img: getAssetUrl(s3Assets.houseR1TamImage), text: "House" },
        ],
        correctWord: "Laugh",
        audio: getAssetAudioUrl(s3Assets.laughR1TamAudio),
        flowName: "P25",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.meatR1TamImage), text: "Meat" },
          { img: getAssetUrl(s3Assets.alcoholR1TamImage), text: "Alcohol" },
          { img: getAssetUrl(s3Assets.thunderR1TamImage), text: "Thunder" },
        ],
        correctWord: "Meat",
        audio: getAssetAudioUrl(s3Assets.meatR1TamAudio),
        flowName: "P26",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.personR1TamImage), text: "Person" },
          { img: getAssetUrl(s3Assets.runR1TamImage), text: "Run" },
          { img: getAssetUrl(s3Assets.infantR1TamImage), text: "Infant" },
        ],
        correctWord: "Run",
        audio: getAssetAudioUrl(s3Assets.runR1TamAudio),
        flowName: "P27",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.elephantR1TamImage), text: "Elephant" },
          { img: getAssetUrl(s3Assets.mosquitoR1TamImage), text: "Mosquito" },
          { img: getAssetUrl(s3Assets.tortoiseR1TamImage), text: "Tortoise" },
        ],
        correctWord: "Elephant",
        audio: getAssetAudioUrl(s3Assets.elephantR1TamAudio),
        flowName: "P28",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.headR1TamImage), text: "Head" },
          { img: getAssetUrl(s3Assets.muscleR1TamImage), text: "Muscle" },
          { img: getAssetUrl(s3Assets.laughR1TamImage), text: "Laugh" },
        ],
        correctWord: "Head",
        audio: getAssetAudioUrl(s3Assets.headR1TamAudio),
        flowName: "P29",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.musicR1TamImage), text: "Music" },
          { img: getAssetUrl(s3Assets.houseR1TamImage), text: "House" },
          { img: getAssetUrl(s3Assets.meatR1TamImage), text: "Meat" },
        ],
        correctWord: "Music",
        audio: getAssetAudioUrl(s3Assets.musicR1TamAudio),
        flowName: "P30",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.alcoholR1TamImage), text: "Alcohol" },
          { img: getAssetUrl(s3Assets.thunderR1TamImage), text: "Thunder" },
          { img: getAssetUrl(s3Assets.personR1TamImage), text: "Person" },
        ],
        correctWord: "Alcohol",
        audio: getAssetAudioUrl(s3Assets.alcoholR1TamAudio),
        flowName: "P31",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.runR1TamImage), text: "Run" },
          { img: getAssetUrl(s3Assets.infantR1TamImage), text: "Infant" },
          { img: getAssetUrl(s3Assets.cookR1TamImage), text: "Cook" },
        ],
        correctWord: "Infant",
        audio: getAssetAudioUrl(s3Assets.infantR1TamAudio),
        flowName: "P32",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mosquitoR1TamImage), text: "Mosquito" },
          { img: getAssetUrl(s3Assets.basketR1TamImage), text: "Basket" },
          { img: getAssetUrl(s3Assets.jumpR1TamImage), text: "Jump" },
        ],
        correctWord: "Basket",
        audio: getAssetAudioUrl(s3Assets.basketR1TamAudio),
        flowName: "P33",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.rainR1TamImage), text: "Rain" },
          { img: getAssetUrl(s3Assets.drumR1TamImage), text: "Drum" },
          { img: getAssetUrl(s3Assets.roseR1TamImage), text: "Rose" },
        ],
        correctWord: "Rain",
        audio: getAssetAudioUrl(s3Assets.rainR1TamAudio),
        flowName: "P34",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.muscleR1TamImage), text: "Muscle" },
          { img: getAssetUrl(s3Assets.houseR1TamImage), text: "House" },
          { img: getAssetUrl(s3Assets.snowR1TamImage), text: "Snow" },
        ],
        correctWord: "Muscle",
        audio: getAssetAudioUrl(s3Assets.muscleR1TamAudio),
        flowName: "P35",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.bellR1TamImage), text: "Bell" },
          { img: getAssetUrl(s3Assets.musicR1TamImage), text: "Music" },
          { img: getAssetUrl(s3Assets.honeyR1TamImage), text: "Honey" },
        ],
        correctWord: "Bell",
        audio: getAssetAudioUrl(s3Assets.bellR1TamAudio),
        flowName: "P36",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.personR1TamImage), text: "Person" },
          { img: getAssetUrl(s3Assets.runR1TamImage), text: "Run" },
          { img: getAssetUrl(s3Assets.headR1TamImage), text: "Head" },
        ],
        correctWord: "Person",
        audio: getAssetAudioUrl(s3Assets.personR1TamAudio),
        flowName: "P37",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.jumpR1TamImage), text: "Jump" },
          { img: getAssetUrl(s3Assets.umbrellaR1TamImage), text: "Umbrella" },
          { img: getAssetUrl(s3Assets.laughR1TamImage), text: "Laugh" },
        ],
        correctWord: "Jump",
        audio: getAssetAudioUrl(s3Assets.jumpR1TamAudio),
        flowName: "P38",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.cookR1TamImage), text: "Cook" },
          { img: getAssetUrl(s3Assets.jarR1TamImage), text: "Jar" },
          { img: getAssetUrl(s3Assets.rainR1TamImage), text: "Rain" },
        ],
        correctWord: "Jar",
        audio: getAssetAudioUrl(s3Assets.jarR1TamAudio),
        flowName: "P39",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.drumR1TamImage), text: "Drum" },
          { img: getAssetUrl(s3Assets.roseR1TamImage), text: "Rose" },
          { img: getAssetUrl(s3Assets.muscleR1TamImage), text: "Muscle" },
        ],
        correctWord: "Drum",
        audio: getAssetAudioUrl(s3Assets.drumR1TamAudio),
        flowName: "P40",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.honeyR1TamImage), text: "Honey" },
          { img: getAssetUrl(s3Assets.rainR1TamImage), text: "Rain" },
          { img: getAssetUrl(s3Assets.thunderR1TamImage), text: "Thunder" },
        ],
        correctWord: "Honey",
        audio: getAssetAudioUrl(s3Assets.honeyR1TamAudio),
        flowName: "P41",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.snowR1TamImage), text: "Snow" },
          { img: getAssetUrl(s3Assets.meatR1TamImage), text: "Meat" },
          { img: getAssetUrl(s3Assets.alcoholR1TamImage), text: "Alcohol" },
        ],
        correctWord: "Alcohol",
        audio: getAssetAudioUrl(s3Assets.alcoholR1TamAudio),
        flowName: "P42",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.infantR1TamImage), text: "Infant" },
          { img: getAssetUrl(s3Assets.mosquitoR1TamImage), text: "Mosquito" },
          { img: getAssetUrl(s3Assets.tortoiseR1TamImage), text: "Tortoise" },
        ],
        correctWord: "Infant",
        audio: getAssetAudioUrl(s3Assets.infantR1TamAudio),
        flowName: "P43",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.umbrellaR1TamImage), text: "Umbrella" },
          { img: getAssetUrl(s3Assets.laughR1TamImage), text: "Laugh" },
          { img: getAssetUrl(s3Assets.musicR1TamImage), text: "Music" },
        ],
        correctWord: "Music",
        audio: getAssetAudioUrl(s3Assets.musicR1TamAudio),
        flowName: "P44",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.personR1TamImage), text: "Person" },
          { img: getAssetUrl(s3Assets.runR1TamImage), text: "Run" },
          { img: getAssetUrl(s3Assets.cookR1TamImage), text: "Cook" },
        ],
        correctWord: "Cook",
        audio: getAssetAudioUrl(s3Assets.cookR1TamAudio),
        flowName: "P45",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.headR1TamImage), text: "Head" },
          { img: getAssetUrl(s3Assets.muscleR1TamImage), text: "Muscle" },
          { img: getAssetUrl(s3Assets.houseR1TamImage), text: "House" },
        ],
        correctWord: "House",
        audio: getAssetAudioUrl(s3Assets.houseR1TamAudio),
        flowName: "P46",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.jumpR1TamImage), text: "Jump" },
          { img: getAssetUrl(s3Assets.roseR1TamImage), text: "Rose" },
          { img: getAssetUrl(s3Assets.drumR1TamImage), text: "Drum" },
        ],
        correctWord: "Rose",
        audio: getAssetAudioUrl(s3Assets.roseR1TamAudio),
        flowName: "P47",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.thunderR1TamImage), text: "Thunder" },
          { img: getAssetUrl(s3Assets.rainR1TamImage), text: "Rain" },
          { img: getAssetUrl(s3Assets.honeyR1TamImage), text: "Honey" },
        ],
        correctWord: "Thunder",
        audio: getAssetAudioUrl(s3Assets.thunderR1TamAudio),
        flowName: "P48",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.maleR1TamImage), text: "Male" },
          { img: getAssetUrl(s3Assets.infantR1TamImage), text: "Infant" },
          { img: getAssetUrl(s3Assets.swordR1TamImage), text: "Sword" },
        ],
        correctWord: "Sword",
        audio: getAssetAudioUrl(s3Assets.swordR1TamAudio),
        flowName: "P49",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.tortoiseR1TamImage), text: "Tortoise" },
          { img: getAssetUrl(s3Assets.jumpR1TamImage), text: "Jump" },
          { img: getAssetUrl(s3Assets.umbrellaR1TamImage), text: "Umbrella" },
        ],
        correctWord: "Tortoise",
        audio: getAssetAudioUrl(s3Assets.tortoiseR1TamAudio),
        flowName: "P50",
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

      {
        allwords: [
          { img: getAssetUrl(s3Assets.fireR1Kan), text: "Fire" },
          { img: getAssetUrl(s3Assets.pocketR1Kan), text: "Pocket" },
          { img: getAssetUrl(s3Assets.ballR1Kan), text: "Ball" },
        ],
        correctWord: "Pocket",
        audio: getAssetAudioUrl(s3Assets.PocketR1KanAudio),
        flowName: "P16",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.jeepR1Kan), text: "Jeep" },
          { img: getAssetUrl(s3Assets.riverR1Kan), text: "River" },
          { img: getAssetUrl(s3Assets.kneeR1Kan), text: "Knee" },
        ],
        correctWord: "River",
        audio: getAssetAudioUrl(s3Assets.RiverR1KanAudio),
        flowName: "P17",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.scorpionR1Kan), text: "Scorpion" },
          { img: getAssetUrl(s3Assets.henR1Kan), text: "Hen" },
          {
            img: getAssetUrl(s3Assets.autorickshawR1Kan),
            text: "Autorickshaw",
          },
        ],
        correctWord: "Hen",
        audio: getAssetAudioUrl(s3Assets.HenR1KanAudio),
        flowName: "P18",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.appleR1Kan), text: "Apple" },
          { img: getAssetUrl(s3Assets.trainR1Kan), text: "Train" },
          { img: getAssetUrl(s3Assets.tailR1Kan), text: "Tail" },
        ],
        correctWord: "Tail",
        audio: getAssetAudioUrl(s3Assets.TailR1KanAudio),
        flowName: "P19",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.maleR1Kan), text: "Male" },
          { img: getAssetUrl(s3Assets.babyR1Kan), text: "Baby" },
          { img: getAssetUrl(s3Assets.capR1Kan), text: "Cap" },
        ],
        correctWord: "Cap",
        audio: getAssetAudioUrl(s3Assets.CapR1KanAudio),
        flowName: "P20",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.footR1Kan), text: "Foot" },
          { img: getAssetUrl(s3Assets.matR1Kan), text: "Mat" },
          { img: getAssetUrl(s3Assets.mugR1Kan), text: "Mug" },
        ],
        correctWord: "Mug",
        audio: getAssetAudioUrl(s3Assets.MugR1KanAudio),
        flowName: "P21",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.tortoiseR1Kan), text: "Tortoise" },
          { img: getAssetUrl(s3Assets.milkR1Kan), text: "Milk" },
          { img: getAssetUrl(s3Assets.treeR1Kan), text: "Tree" },
        ],
        correctWord: "Tortoise",
        audio: getAssetAudioUrl(s3Assets.TortiseR1KanAudio),
        flowName: "P22",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.elephantR1Kan), text: "Elephant" },
          { img: getAssetUrl(s3Assets.juiceR1Kan), text: "Juice" },
          { img: getAssetUrl(s3Assets.noseR1Kan), text: "Nose" },
        ],
        correctWord: "Juice",
        audio: getAssetAudioUrl(s3Assets.RasajuiceKan),
        flowName: "P23",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mangoR1Kan), text: "Mango" },
          { img: getAssetUrl(s3Assets.snakeR1Kan), text: "Snake" },
          { img: getAssetUrl(s3Assets.glassR1Kan), text: "Glass" },
        ],
        correctWord: "Snake",
        audio: getAssetAudioUrl(s3Assets.SnakeR1KanAudio),
        flowName: "P24",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.leafR1Kan), text: "Leaf" },
          { img: getAssetUrl(s3Assets.laughR1Kan), text: "Laugh" },
          { img: getAssetUrl(s3Assets.spiderR1Kan), text: "Spider" },
        ],
        correctWord: "Spider",
        audio: getAssetAudioUrl(s3Assets.spiderR1KanAudio),
        flowName: "P25",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.ratR1Kan), text: "Rat" },
          { img: getAssetUrl(s3Assets.plantR1Kan), text: "Plant" },
          { img: getAssetUrl(s3Assets.carR1Kan), text: "Car" },
        ],
        correctWord: "Car",
        audio: getAssetAudioUrl(s3Assets.carR1KanAudio),
        flowName: "P26",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.honybeeR1Kan), text: "Honeybee" },
          { img: getAssetUrl(s3Assets.parrotR1Kan), text: "Parrot" },
          { img: getAssetUrl(s3Assets.cowR1Kan), text: "Cow" },
        ],
        correctWord: "Parrot",
        audio: getAssetAudioUrl(s3Assets.parrotR1KanAudio),
        flowName: "P27",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.monkeyR1Kan), text: "Monkey" },
          { img: getAssetUrl(s3Assets.lionR1Kan), text: "Lion" },
          { img: getAssetUrl(s3Assets.shirtR1Kan), text: "Shirt" },
        ],
        correctWord: "Monkey",
        audio: getAssetAudioUrl(s3Assets.MonkeyR1KanAudio),
        flowName: "P28",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.pigR1Kan), text: "Pig" },
          { img: getAssetUrl(s3Assets.legR1Kan), text: "Leg" },
          { img: getAssetUrl(s3Assets.wolfR1Kan), text: "Wolf" },
        ],
        correctWord: "Leg",
        audio: getAssetAudioUrl(s3Assets.legR1KanAudio),
        flowName: "P29",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.crowR1Kan), text: "Crow" },
          { img: getAssetUrl(s3Assets.cloudR1Kan), text: "Cloud" },
          { img: getAssetUrl(s3Assets.featherR1Kan), text: "Feather" },
        ],
        correctWord: "Feather",
        audio: getAssetAudioUrl(s3Assets.featherR1KanAudio),
        flowName: "P30",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fanR1Kan), text: "Fan" },
          { img: getAssetUrl(s3Assets.jarR1Kan), text: "Jar" },
          { img: getAssetUrl(s3Assets.farmerR1Kan), text: "Farmer" },
        ],
        correctWord: "Jar",
        audio: getAssetAudioUrl(s3Assets.JarR1KanAudio),
        flowName: "P31",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.trainR1Kan), text: "Train" },
          { img: getAssetUrl(s3Assets.appleR1Kan), text: "Apple" },
          { img: getAssetUrl(s3Assets.tailR1Kan), text: "Tail" },
        ],
        correctWord: "Train",
        audio: getAssetAudioUrl(s3Assets.TrainR1KanAudio),
        flowName: "P32",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.maleR1Kan), text: "Male" },
          { img: getAssetUrl(s3Assets.babyR1Kan), text: "Baby" },
          { img: getAssetUrl(s3Assets.capR1Kan), text: "Cap" },
        ],
        correctWord: "Male",
        audio: getAssetAudioUrl(s3Assets.MaleR1KanAudio),
        flowName: "P33",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.footR1Kan), text: "Foot" },
          { img: getAssetUrl(s3Assets.matR1Kan), text: "Mat" },
          { img: getAssetUrl(s3Assets.mugR1Kan), text: "Mug" },
        ],
        correctWord: "Foot",
        audio: getAssetAudioUrl(s3Assets.FootR1KanAudio),
        flowName: "P34",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.tortoiseR1Kan), text: "Tortoise" },
          { img: getAssetUrl(s3Assets.milkR1Kan), text: "Milk" },
          { img: getAssetUrl(s3Assets.treeR1Kan), text: "Tree" },
        ],
        correctWord: "Tree",
        audio: getAssetAudioUrl(s3Assets.TreeKan),
        flowName: "P35",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.elephantR1Kan), text: "Elephant" },
          { img: getAssetUrl(s3Assets.juiceR1Kan), text: "Juice" },
          { img: getAssetUrl(s3Assets.noseR1Kan), text: "Nose" },
        ],
        correctWord: "Elephant",
        audio: getAssetAudioUrl(s3Assets.ElephantR1KanAudio),
        flowName: "P36",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mangoR1Kan), text: "Mango" },
          { img: getAssetUrl(s3Assets.snakeR1Kan), text: "Snake" },
          { img: getAssetUrl(s3Assets.glassR1Kan), text: "Glass" },
        ],
        correctWord: "Mango",
        audio: getAssetAudioUrl(s3Assets.MangoR1KanAudio),
        flowName: "P37",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.leafR1Kan), text: "Leaf" },
          { img: getAssetUrl(s3Assets.laughR1Kan), text: "Laugh" },
          { img: getAssetUrl(s3Assets.spiderR1Kan), text: "Spider" },
        ],
        correctWord: "Laugh",
        audio: getAssetAudioUrl(s3Assets.laughR1KanAudio),
        flowName: "P38",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.ratR1Kan), text: "Rat" },
          { img: getAssetUrl(s3Assets.plantR1Kan), text: "Plant" },
          { img: getAssetUrl(s3Assets.carR1Kan), text: "Car" },
        ],
        correctWord: "Rat",
        audio: getAssetAudioUrl(s3Assets.ratR1KanAudio),
        flowName: "P39",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.honybeeR1Kan), text: "Honeybee" },
          { img: getAssetUrl(s3Assets.parrotR1Kan), text: "Parrot" },
          { img: getAssetUrl(s3Assets.cowR1Kan), text: "Cow" },
        ],
        correctWord: "Honeybee",
        audio: getAssetAudioUrl(s3Assets.HoneyR1KanAudio),
        flowName: "P40",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.monkeyR1Kan), text: "Monkey" },
          { img: getAssetUrl(s3Assets.lionR1Kan), text: "Lion" },
          { img: getAssetUrl(s3Assets.shirtR1Kan), text: "Shirt" },
        ],
        correctWord: "Lion",
        audio: getAssetAudioUrl(s3Assets.lionKan),
        flowName: "P41",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.pigR1Kan), text: "Pig" },
          { img: getAssetUrl(s3Assets.legR1Kan), text: "Leg" },
          { img: getAssetUrl(s3Assets.wolfR1Kan), text: "Wolf" },
        ],
        correctWord: "Wolf",
        audio: getAssetAudioUrl(s3Assets.wolfR1KanAudio),
        flowName: "P42",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.crowR1Kan), text: "Crow" },
          { img: getAssetUrl(s3Assets.cloudR1Kan), text: "Cloud" },
          { img: getAssetUrl(s3Assets.featherR1Kan), text: "Feather" },
        ],
        correctWord: "Crow",
        audio: getAssetAudioUrl(s3Assets.CrowR1KanAudio),
        flowName: "P43",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fanR1Kan), text: "Fan" },
          { img: getAssetUrl(s3Assets.jarR1Kan), text: "Jar" },
          { img: getAssetUrl(s3Assets.farmerR1Kan), text: "Farmer" },
        ],
        correctWord: "Fan",
        audio: getAssetAudioUrl(s3Assets.fanR1KanAudio),
        flowName: "P44",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.trainR1Kan), text: "Train" },
          { img: getAssetUrl(s3Assets.appleR1Kan), text: "Apple" },
          { img: getAssetUrl(s3Assets.tailR1Kan), text: "Tail" },
        ],
        correctWord: "Apple",
        audio: getAssetAudioUrl(s3Assets.AppleR1KanAudio),
        flowName: "P45",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.maleR1Kan), text: "Male" },
          { img: getAssetUrl(s3Assets.babyR1Kan), text: "Baby" },
          { img: getAssetUrl(s3Assets.capR1Kan), text: "Cap" },
        ],
        correctWord: "Baby",
        audio: getAssetAudioUrl(s3Assets.BabyR1KanAudio),
        flowName: "P46",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.footR1Kan), text: "Foot" },
          { img: getAssetUrl(s3Assets.matR1Kan), text: "Mat" },
          { img: getAssetUrl(s3Assets.mugR1Kan), text: "Mug" },
        ],
        correctWord: "Mat",
        audio: getAssetAudioUrl(s3Assets.MatR1KanAudio),
        flowName: "P47",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.tortoiseR1Kan), text: "Tortoise" },
          { img: getAssetUrl(s3Assets.milkR1Kan), text: "Milk" },
          { img: getAssetUrl(s3Assets.treeR1Kan), text: "Tree" },
        ],
        correctWord: "Milk",
        audio: getAssetAudioUrl(s3Assets.MilkR1KanAudio),
        flowName: "P48",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.elephantR1Kan), text: "Elephant" },
          { img: getAssetUrl(s3Assets.juiceR1Kan), text: "Juice" },
          { img: getAssetUrl(s3Assets.noseR1Kan), text: "Nose" },
        ],
        correctWord: "Nose",
        audio: getAssetAudioUrl(s3Assets.NoseR1KanAudio),
        flowName: "P49",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mangoR1Kan), text: "Mango" },
          { img: getAssetUrl(s3Assets.snakeR1Kan), text: "Snake" },
          { img: getAssetUrl(s3Assets.glassR1Kan), text: "Glass" },
        ],
        correctWord: "Glass",
        audio: getAssetAudioUrl(s3Assets.glassR1KanAudio),
        flowName: "P50",
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
      {
        allwords: [
          { img: getAssetUrl(s3Assets.crowR1Tel), text: "Crow" },
          { img: getAssetUrl(s3Assets.goatR1Tel), text: "Goat" },
          { img: getAssetUrl(s3Assets.legR1Tel), text: "Leg" },
        ],
        correctWord: "Crow",
        audio: getAssetAudioUrl(s3Assets.crowR1TelAudio),
        flowName: "P16",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.angerR1Tel), text: "Anger" },
          { img: getAssetUrl(s3Assets.nestR1Tel), text: "Nest" },
          { img: getAssetUrl(s3Assets.ropeR1Tel), text: "Rope" },
        ],
        correctWord: "Anger",
        audio: getAssetAudioUrl(s3Assets.angerR1TelAudio),
        flowName: "P17",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.dosaR1Tel), text: "Dosa" },
          { img: getAssetUrl(s3Assets.lionR1Tel), text: "Lion" },
          { img: getAssetUrl(s3Assets.pillowR1Tel), text: "Pillow" },
        ],
        correctWord: "Dosa",
        audio: getAssetAudioUrl(s3Assets.dosaR1TelAudio),
        flowName: "P18",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.farmerR1Tel), text: "Farmer" },
          { img: getAssetUrl(s3Assets.castleR1Tel), text: "Castle" },
          { img: getAssetUrl(s3Assets.medicineR1Tel), text: "Medicine" },
        ],
        correctWord: "Farmer",
        audio: getAssetAudioUrl(s3Assets.farmerR1TelAudio),
        flowName: "P19",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.sareeR1Tel), text: "Saree" },
          { img: getAssetUrl(s3Assets.mosquitoR1Tel), text: "Mosquito" },
          { img: getAssetUrl(s3Assets.fishR1Tel), text: "Fish" },
        ],
        correctWord: "Saree",
        audio: getAssetAudioUrl(s3Assets.sareeR1TelAudio),
        flowName: "P20",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.rootR1Tel), text: "Root" },
          { img: getAssetUrl(s3Assets.fingerR1Tel), text: "Finger" },
          { img: getAssetUrl(s3Assets.cowR1Tel), text: "Cow" },
        ],
        correctWord: "Root",
        audio: getAssetAudioUrl(s3Assets.rootR1TelAudio),
        flowName: "P21",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.carR1Tel), text: "Car" },
          { img: getAssetUrl(s3Assets.plantR1Tel), text: "Plant" },
          { img: getAssetUrl(s3Assets.juiceR1Tel), text: "Juice" },
        ],
        correctWord: "Plant",
        audio: getAssetAudioUrl(s3Assets.plantR1TelAudio),
        flowName: "P22",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.ropeR1Tel), text: "Rope" },
          { img: getAssetUrl(s3Assets.duckR1Tel), text: "Duck" },
          { img: getAssetUrl(s3Assets.neckR1Tel), text: "Neck" },
        ],
        correctWord: "Rope",
        audio: getAssetAudioUrl(s3Assets.ropeR1TelAudio),
        flowName: "P23",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.pillowR1Tel), text: "Pillow" },
          { img: getAssetUrl(s3Assets.swimR1Tel), text: "Swim" },
          { img: getAssetUrl(s3Assets.featherR1Tel), text: "Feather" },
        ],
        correctWord: "Pillow",
        audio: getAssetAudioUrl(s3Assets.pillowR1TelAudio),
        flowName: "P24",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.medicineR1Tel), text: "Medicine" },
          { img: getAssetUrl(s3Assets.fishR1Tel), text: "Fish" },
          { img: getAssetUrl(s3Assets.schoolR1Tel), text: "School" },
        ],
        correctWord: "Medicine",
        audio: getAssetAudioUrl(s3Assets.medicineR1TelAudio),
        flowName: "P25",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fingerR1Tel), text: "Finger" },
          { img: getAssetUrl(s3Assets.leafR1Tel), text: "Leaf" },
          { img: getAssetUrl(s3Assets.mosquitoR1Tel), text: "Mosquito" },
        ],
        correctWord: "Finger",
        audio: getAssetAudioUrl(s3Assets.fingerR1TelAudio),
        flowName: "P26",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.legR1Tel), text: "Leg" },
          { img: getAssetUrl(s3Assets.castleR1Tel), text: "Castle" },
          { img: getAssetUrl(s3Assets.lionR1Tel), text: "Lion" },
        ],
        correctWord: "Leg",
        audio: getAssetAudioUrl(s3Assets.legR1TelAudio),
        flowName: "P27",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.juiceR1Tel), text: "Juice" },
          { img: getAssetUrl(s3Assets.potR1Tel), text: "Pot" },
          { img: getAssetUrl(s3Assets.crowR1Tel), text: "Crow" },
        ],
        correctWord: "Juice",
        audio: getAssetAudioUrl(s3Assets.juiceR1TelAudio),
        flowName: "P28",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.neemR1Tel), text: "Neem" },
          { img: getAssetUrl(s3Assets.nestR1Tel), text: "Nest" },
          { img: getAssetUrl(s3Assets.goatR1Tel), text: "Goat" },
        ],
        correctWord: "Neem",
        audio: getAssetAudioUrl(s3Assets.neemR1TelAudio),
        flowName: "P29",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.plantR1Tel), text: "Plant" },
          { img: getAssetUrl(s3Assets.cowR1Tel), text: "Cow" },
          { img: getAssetUrl(s3Assets.ballR1Tel), text: "Ball" },
        ],
        correctWord: "Cow",
        audio: getAssetAudioUrl(s3Assets.cowR1TelAudio),
        flowName: "P30",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.mosquitoR1Tel), text: "Mosquito" },
          { img: getAssetUrl(s3Assets.fruitR1Tel), text: "Fruit" },
          { img: getAssetUrl(s3Assets.farmerR1Tel), text: "Farmer" },
        ],
        correctWord: "Mosquito",
        audio: getAssetAudioUrl(s3Assets.mosquitoR1TelAudio),
        flowName: "P31",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.swanR1Tel), text: "Swan" },
          { img: getAssetUrl(s3Assets.pillowR1Tel), text: "Pillow" },
          { img: getAssetUrl(s3Assets.carR1Tel), text: "Car" },
        ],
        correctWord: "Swan",
        audio: getAssetAudioUrl(s3Assets.swanR1TelAudio),
        flowName: "P32",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.castleR1Tel), text: "Castle" },
          { img: getAssetUrl(s3Assets.fishR1Tel), text: "Fish" },
          { img: getAssetUrl(s3Assets.legR1Tel), text: "Leg" },
        ],
        correctWord: "Castle",
        audio: getAssetAudioUrl(s3Assets.castleR1TelAudio),
        flowName: "P33",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.lionR1Tel), text: "Lion" },
          { img: getAssetUrl(s3Assets.juiceR1Tel), text: "Juice" },
          { img: getAssetUrl(s3Assets.ropeR1Tel), text: "Rope" },
        ],
        correctWord: "Lion",
        audio: getAssetAudioUrl(s3Assets.lionR1TelAudio),
        flowName: "P34",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.shipR1Tel), text: "Ship" },
          { img: getAssetUrl(s3Assets.angerR1Tel), text: "Anger" },
          { img: getAssetUrl(s3Assets.nestR1Tel), text: "Nest" },
        ],
        correctWord: "Ship",
        audio: getAssetAudioUrl(s3Assets.shipR1TelAudio),
        flowName: "P35",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.penR1Tel), text: "Pen" },
          { img: getAssetUrl(s3Assets.plantR1Tel), text: "Plant" },
          { img: getAssetUrl(s3Assets.crowR1Tel), text: "Crow" },
        ],
        correctWord: "Pen",
        audio: getAssetAudioUrl(s3Assets.penR1TelAudio),
        flowName: "P36",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.milkR1Tel), text: "Milk" },
          { img: getAssetUrl(s3Assets.goatR1Tel), text: "Goat" },
          { img: getAssetUrl(s3Assets.fingerR1Tel), text: "Finger" },
        ],
        correctWord: "Milk",
        audio: getAssetAudioUrl(s3Assets.milkR1TelAudio),
        flowName: "P37",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fishR1Tel), text: "Fish" },
          { img: getAssetUrl(s3Assets.sareeR1Tel), text: "Saree" },
          { img: getAssetUrl(s3Assets.pillowR1Tel), text: "Pillow" },
        ],
        correctWord: "Fish",
        audio: getAssetAudioUrl(s3Assets.fishR1TelAudio),
        flowName: "P38",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.carR1Tel), text: "Car" },
          { img: getAssetUrl(s3Assets.mosquitoR1Tel), text: "Mosquito" },
          { img: getAssetUrl(s3Assets.rootR1Tel), text: "Root" },
        ],
        correctWord: "Car",
        audio: getAssetAudioUrl(s3Assets.carR1TelAudio),
        flowName: "P39",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.duckR1Tel), text: "Duck" },
          { img: getAssetUrl(s3Assets.castleR1Tel), text: "Castle" },
          { img: getAssetUrl(s3Assets.lionR1Tel), text: "Lion" },
        ],
        correctWord: "Duck",
        audio: getAssetAudioUrl(s3Assets.duckR1TelAudio),
        flowName: "P40",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.goatR1Tel), text: "Goat" },
          { img: getAssetUrl(s3Assets.dosaR1Tel), text: "Dosa" },
          { img: getAssetUrl(s3Assets.farmerR1Tel), text: "Farmer" },
        ],
        correctWord: "Goat",
        audio: getAssetAudioUrl(s3Assets.goatR1TelAudio),
        flowName: "P41",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.neckR1Tel), text: "Neck" },
          { img: getAssetUrl(s3Assets.medicineR1Tel), text: "Medicine" },
          { img: getAssetUrl(s3Assets.cowR1Tel), text: "Cow" },
        ],
        correctWord: "Neck",
        audio: getAssetAudioUrl(s3Assets.neckR1TelAudio),
        flowName: "P42",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.swimR1Tel), text: "Swim" },
          { img: getAssetUrl(s3Assets.carR1Tel), text: "Car" },
          { img: getAssetUrl(s3Assets.crowR1Tel), text: "Crow" },
        ],
        correctWord: "Swim",
        audio: getAssetAudioUrl(s3Assets.swimR1TelAudio),
        flowName: "P43",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.nestR1Tel), text: "Nest" },
          { img: getAssetUrl(s3Assets.goatR1Tel), text: "Goat" },
          { img: getAssetUrl(s3Assets.legR1Tel), text: "Leg" },
        ],
        correctWord: "Nest",
        audio: getAssetAudioUrl(s3Assets.nestR1TelAudio),
        flowName: "P44",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.featherR1Tel), text: "Feather" },
          { img: getAssetUrl(s3Assets.angerR1Tel), text: "Anger" },
          { img: getAssetUrl(s3Assets.nestR1Tel), text: "Nest" },
        ],
        correctWord: "Feather",
        audio: getAssetAudioUrl(s3Assets.featherR1TelAudio),
        flowName: "P45",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.fruitR1Tel), text: "Fruit" },
          { img: getAssetUrl(s3Assets.farmerR1Tel), text: "Farmer" },
          { img: getAssetUrl(s3Assets.medicineR1Tel), text: "Medicine" },
        ],
        correctWord: "Fruit",
        audio: getAssetAudioUrl(s3Assets.fruitR1TelAudio),
        flowName: "P46",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.ballR1Tel), text: "Ball" },
          { img: getAssetUrl(s3Assets.cowR1Tel), text: "Cow" },
          { img: getAssetUrl(s3Assets.carR1Tel), text: "Car" },
        ],
        correctWord: "Ball",
        audio: getAssetAudioUrl(s3Assets.ballR1TelAudio),
        flowName: "P47",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.schoolR1Tel), text: "School" },
          { img: getAssetUrl(s3Assets.crowR1Tel), text: "Crow" },
          { img: getAssetUrl(s3Assets.goatR1Tel), text: "Goat" },
        ],
        correctWord: "School",
        audio: getAssetAudioUrl(s3Assets.schoolR1TelAudio),
        flowName: "P48",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.potR1Tel), text: "Pot" },
          { img: getAssetUrl(s3Assets.legR1Tel), text: "Leg" },
          { img: getAssetUrl(s3Assets.angerR1Tel), text: "Anger" },
        ],
        correctWord: "Pot",
        audio: getAssetAudioUrl(s3Assets.potR1TelAudio),
        flowName: "P49",
      },
      {
        allwords: [
          { img: getAssetUrl(s3Assets.leafR1Tel), text: "Leaf" },
          { img: getAssetUrl(s3Assets.nestR1Tel), text: "Nest" },
          { img: getAssetUrl(s3Assets.ropeR1Tel), text: "Rope" },
        ],
        correctWord: "Leaf",
        audio: getAssetAudioUrl(s3Assets.leafR1TelAudio),
        flowName: "P50",
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
                    response(
                      {
                        // Required
                        target: "", // Required. Target of the response
                        //"qid": "", // Required. Unique assessment/question id
                        type: "SPEAK", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
                        values: [
                          { original_text: currentQuestion?.correctWord },
                          { level: "R1" },
                          { isCorrect: "true" },
                        ],
                      },
                      "ET"
                    );
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
                      response(
                        {
                          // Required
                          target: "", // Required. Target of the response
                          //"qid": "", // Required. Unique assessment/question id
                          type: "SPEAK", // Required. Type of response. CHOOSE, DRAG, SELECT, MATCH, INPUT, SPEAK, WRITE
                          values: [
                            { original_text: currentQuestion?.correctWord },
                            { level: "R1" },
                            { isCorrect: "true" },
                          ],
                        },
                        "ET"
                      );
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
