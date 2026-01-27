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
import hintimg from "../assets/hintsicon.svg";

const theme = createTheme();

export const dataEn = [
  {
    syllable: "he",
    items: [
      {
        id: 1,
        title: "Syllable",
        syllable: "he",
        word: "Head",
        image: getAssetUrl(s3Assets.HeadImg),
        audio: getAssetAudioUrl(s3Assets.HeadAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HeadAudio),
      },
      {
        id: 2,
        title: "Syllable",
        syllable: "he",
        word: "teacher",
        image: getAssetUrl(s3Assets.teacherImg),
        audio: getAssetAudioUrl(s3Assets.teacherAudio),
        singleAudio: getAssetAudioUrl(s3Assets.teacherAudio),
      },
    ],
  },
  {
    syllable: "in",
    items: [
      {
        id: 3,
        title: "Syllable",
        syllable: "in",
        word: "Pin",
        image: getAssetUrl(s3Assets.PinImg),
        audio: getAssetAudioUrl(s3Assets.PinAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PinAudio),
      },
      {
        id: 4,
        title: "Syllable",
        syllable: "in",
        word: "Winter",
        image: getAssetUrl(s3Assets.WinterImg),
        audio: getAssetAudioUrl(s3Assets.WinterAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WinterAudio),
      },
    ],
  },
  {
    syllable: "an",
    items: [
      {
        id: 5,
        title: "Syllable",
        syllable: "an",
        word: "Ant",
        image: getAssetUrl(s3Assets.AntImg),
        audio: getAssetAudioUrl(s3Assets.AntAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AntAudio),
      },
      {
        id: 6,
        title: "Syllable",
        syllable: "an",
        word: "plant",
        image: getAssetUrl(s3Assets.plantImg),
        audio: getAssetAudioUrl(s3Assets.plantAudio),
        singleAudio: getAssetAudioUrl(s3Assets.plantAudio),
      },
    ],
  },
  {
    syllable: "at",
    items: [
      {
        id: 7,
        title: "Syllable",
        syllable: "at",
        word: "Atom",
        image: getAssetUrl(s3Assets.AtomImg),
        audio: getAssetAudioUrl(s3Assets.AtomAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AtomAudio),
      },
      {
        id: 8,
        title: "Syllable",
        syllable: "at",
        word: "Cattle",
        image: getAssetUrl(s3Assets.CattleImg),
        audio: getAssetAudioUrl(s3Assets.CattleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CattleAudio),
      },
    ],
  },
  {
    syllable: "or",
    items: [
      {
        id: 9,
        title: "Syllable",
        syllable: "or",
        word: "orange",
        image: getAssetUrl(s3Assets.orangeImg),
        audio: getAssetAudioUrl(s3Assets.orangeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.orangeAudio),
      },
      {
        id: 10,
        title: "Syllable",
        syllable: "or",
        word: "store",
        image: getAssetUrl(s3Assets.storeImg),
        audio: getAssetAudioUrl(s3Assets.storeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.storeAudio),
      },
    ],
  },
  {
    syllable: "of",
    items: [
      {
        id: 11,
        title: "Syllable",
        syllable: "of",
        word: "Office",
        image: getAssetUrl(s3Assets.OfficeImg),
        audio: getAssetAudioUrl(s3Assets.OfficeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.OfficeAudio),
      },
      {
        id: 12,
        title: "Syllable",
        syllable: "of",
        word: "Soft",
        image: getAssetUrl(s3Assets.SoftImg),
        audio: getAssetAudioUrl(s3Assets.SoftAudio),
        singleAudio: getAssetAudioUrl(s3Assets.SoftAudio),
      },
    ],
  },
  {
    syllable: "it",
    items: [
      {
        id: 13,
        title: "Syllable",
        syllable: "it",
        word: "kite",
        image: getAssetUrl(s3Assets.kiteImg),
        audio: getAssetAudioUrl(s3Assets.kiteAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kiteAudio),
      },
      {
        id: 14,
        title: "Syllable",
        syllable: "it",
        word: "fruits",
        image: getAssetUrl(s3Assets.fruitsImg),
        audio: getAssetAudioUrl(s3Assets.fruitsAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fruitsAudio),
      },
    ],
  },
  {
    syllable: "as",
    items: [
      {
        id: 15,
        title: "Syllable",
        syllable: "as",
        word: "Gas",
        image: getAssetUrl(s3Assets.GasImg),
        audio: getAssetAudioUrl(s3Assets.GasAudio),
        singleAudio: getAssetAudioUrl(s3Assets.GasAudio),
      },
      {
        id: 16,
        title: "Syllable",
        syllable: "as",
        word: "basket",
        image: getAssetUrl(s3Assets.basketImg),
        audio: getAssetAudioUrl(s3Assets.basketAudio),
        singleAudio: getAssetAudioUrl(s3Assets.basketAudio),
      },
    ],
  },
  {
    syllable: "me",
    items: [
      {
        id: 17,
        title: "Syllable",
        syllable: "me",
        word: "game",
        image: getAssetUrl(s3Assets.gameImg),
        audio: getAssetAudioUrl(s3Assets.gameAudio),
        singleAudio: getAssetAudioUrl(s3Assets.gameAudio),
      },
      {
        id: 18,
        title: "Syllable",
        syllable: "me",
        word: "Camel",
        image: getAssetUrl(s3Assets.CamelImg),
        audio: getAssetAudioUrl(s3Assets.CamelAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CamelAudio),
      },
    ],
  },
  {
    syllable: "be",
    items: [
      {
        id: 19,
        title: "Syllable",
        syllable: "be",
        word: "Tube",
        image: getAssetUrl(s3Assets.TubeImg),
        audio: getAssetAudioUrl(s3Assets.TubeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.TubeAudio),
      },
      {
        id: 20,
        title: "Syllable",
        syllable: "be",
        word: "beautiful",
        image: getAssetUrl(s3Assets.beautifulImg),
        audio: getAssetAudioUrl(s3Assets.beautifulAudio),
        singleAudio: getAssetAudioUrl(s3Assets.beautifulAudio),
      },
    ],
  },
  {
    syllable: "her",
    items: [
      {
        id: 21,
        title: "Syllable",
        syllable: "her",
        word: "feather",
        image: getAssetUrl(s3Assets.featherImg),
        audio: getAssetAudioUrl(s3Assets.featherAudio),
        singleAudio: getAssetAudioUrl(s3Assets.featherAudio),
      },
      {
        id: 22,
        title: "Syllable",
        syllable: "her",
        word: "Cherry",
        image: getAssetUrl(s3Assets.CherryImg),
        audio: getAssetAudioUrl(s3Assets.CherryAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CherryAudio),
      },
    ],
  },
  {
    syllable: "ate",
    items: [
      {
        id: 23,
        title: "Syllable",
        syllable: "ate",
        word: "Water",
        image: getAssetUrl(s3Assets.WaterImg),
        audio: getAssetAudioUrl(s3Assets.WaterAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WaterAudio),
      },
      {
        id: 24,
        title: "Syllable",
        syllable: "ate",
        word: "Gate",
        image: getAssetUrl(s3Assets.GateImg),
        audio: getAssetAudioUrl(s3Assets.GateAudio),
        singleAudio: getAssetAudioUrl(s3Assets.GateAudio),
      },
    ],
  },
  {
    syllable: "all",
    items: [
      {
        id: 25,
        title: "Syllable",
        syllable: "all",
        word: "Ally",
        image: getAssetUrl(s3Assets.AllyImg),
        audio: getAssetAudioUrl(s3Assets.AllyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AllyAudio),
      },
      {
        id: 26,
        title: "Syllable",
        syllable: "all",
        word: "Balloon",
        image: getAssetUrl(s3Assets.BalloonImg),
        audio: getAssetAudioUrl(s3Assets.BalloonAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BalloonAudio),
      },
    ],
  },
  {
    syllable: "men",
    items: [
      {
        id: 27,
        title: "Syllable",
        syllable: "men",
        word: "Menu",
        image: getAssetUrl(s3Assets.MenuImg),
        audio: getAssetAudioUrl(s3Assets.MenuAudio),
        singleAudio: getAssetAudioUrl(s3Assets.MenuAudio),
      },
      {
        id: 28,
        title: "Syllable",
        syllable: "men",
        word: "Women",
        image: getAssetUrl(s3Assets.WomenImg),
        audio: getAssetAudioUrl(s3Assets.WomenAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WomenAudio),
      },
    ],
  },
  {
    syllable: "ear",
    items: [
      {
        id: 29,
        title: "Syllable",
        syllable: "ear",
        word: "Earth",
        image: getAssetUrl(s3Assets.EarthImg),
        audio: getAssetAudioUrl(s3Assets.EarthAudio),
        singleAudio: getAssetAudioUrl(s3Assets.EarthAudio),
      },
      {
        id: 30,
        title: "Syllable",
        syllable: "ear",
        word: "Near",
        image: getAssetUrl(s3Assets.NearImg),
        audio: getAssetAudioUrl(s3Assets.NearAudio),
        singleAudio: getAssetAudioUrl(s3Assets.NearAudio),
      },
    ],
  },
  {
    syllable: "rat",
    items: [
      {
        id: 31,
        title: "Syllable",
        syllable: "rat",
        word: "Rattle",
        image: getAssetUrl(s3Assets.RattleImg),
        audio: getAssetAudioUrl(s3Assets.RattleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.RattleAudio),
      },
      {
        id: 32,
        title: "Syllable",
        syllable: "rat",
        word: "decorate",
        image: getAssetUrl(s3Assets.decorateImg),
        audio: getAssetAudioUrl(s3Assets.decorateAudio),
        singleAudio: getAssetAudioUrl(s3Assets.decorateAudio),
      },
    ],
  },
  {
    syllable: "Up",
    items: [
      {
        id: 33,
        title: "Syllable",
        syllable: "Up",
        word: "Upset",
        image: getAssetUrl(s3Assets.UpsetImg),
        audio: getAssetAudioUrl(s3Assets.UpsetAudio),
        singleAudio: getAssetAudioUrl(s3Assets.UpsetAudio),
      },
      {
        id: 34,
        title: "Syllable",
        syllable: "Up",
        word: "Puppy",
        image: getAssetUrl(s3Assets.PuppyImg),
        audio: getAssetAudioUrl(s3Assets.PuppyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PuppyAudio),
      },
    ],
  },
  {
    syllable: "Us",
    items: [
      {
        id: 35,
        title: "Syllable",
        syllable: "Us",
        word: "Bus",
        image: getAssetUrl(s3Assets.BusImg),
        audio: getAssetAudioUrl(s3Assets.BusAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BusAudio),
      },
      {
        id: 36,
        title: "Syllable",
        syllable: "Us",
        word: "Dust",
        image: getAssetUrl(s3Assets.DustImg),
        audio: getAssetAudioUrl(s3Assets.DustAudio),
        singleAudio: getAssetAudioUrl(s3Assets.DustAudio),
      },
    ],
  },
  {
    syllable: "Am",
    items: [
      {
        id: 37,
        title: "Syllable",
        syllable: "Am",
        word: "Jam",
        image: getAssetUrl(s3Assets.JamImg),
        audio: getAssetAudioUrl(s3Assets.JamAudio),
        singleAudio: getAssetAudioUrl(s3Assets.JamAudio),
      },
      {
        id: 38,
        title: "Syllable",
        syllable: "Am",
        word: "Camel",
        image: getAssetUrl(s3Assets.Camel2Img),
        audio: getAssetAudioUrl(s3Assets.Camel2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.Camel2Audio),
      },
    ],
  },
  {
    syllable: "My",
    items: [
      {
        id: 39,
        title: "Syllable",
        syllable: "My",
        word: "Army",
        image: getAssetUrl(s3Assets.ArmyImg),
        audio: getAssetAudioUrl(s3Assets.ArmyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ArmyAudio),
      },
      {
        id: 40,
        title: "Syllable",
        syllable: "My",
        word: "Tummy",
        image: getAssetUrl(s3Assets.TummyImg),
        audio: getAssetAudioUrl(s3Assets.TummyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.TummyAudio),
      },
    ],
  },
  {
    syllable: "So",
    items: [
      {
        id: 41,
        title: "Syllable",
        syllable: "So",
        word: "Sofa",
        image: getAssetUrl(s3Assets.SofaImg),
        audio: getAssetAudioUrl(s3Assets.SofaAudio),
        singleAudio: getAssetAudioUrl(s3Assets.SofaAudio),
      },
      {
        id: 42,
        title: "Syllable",
        syllable: "So",
        word: "Person",
        image: getAssetUrl(s3Assets.PersonImg),
        audio: getAssetAudioUrl(s3Assets.PersonAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PersonAudio),
      },
    ],
  },
  {
    syllable: "No",
    items: [
      {
        id: 43,
        title: "Syllable",
        syllable: "No",
        word: "Nose",
        image: getAssetUrl(s3Assets.NoseImg),
        audio: getAssetAudioUrl(s3Assets.NoseAudio),
        singleAudio: getAssetAudioUrl(s3Assets.NoseAudio),
      },
      {
        id: 44,
        title: "Syllable",
        syllable: "No",
        word: "Piano",
        image: getAssetUrl(s3Assets.PianoImg),
        audio: getAssetAudioUrl(s3Assets.PianoAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PianoAudio),
      },
    ],
  },
  {
    syllable: "is",
    items: [
      {
        id: 45,
        title: "Syllable",
        syllable: "is",
        word: "list",
        image: getAssetUrl(s3Assets.listImg),
        audio: getAssetAudioUrl(s3Assets.listAudio),
        singleAudio: getAssetAudioUrl(s3Assets.listAudio),
      },
      {
        id: 46,
        title: "Syllable",
        syllable: "is",
        word: "fish",
        image: getAssetUrl(s3Assets.fishImg),
        audio: getAssetAudioUrl(s3Assets.fishAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fishAudio),
      },
    ],
  },
  {
    syllable: "Ox",
    items: [
      {
        id: 47,
        title: "Syllable",
        syllable: "Ox",
        word: "Oxen",
        image: getAssetUrl(s3Assets.OxenImg),
        audio: getAssetAudioUrl(s3Assets.OxenAudio),
        singleAudio: getAssetAudioUrl(s3Assets.OxenAudio),
      },
      {
        id: 48,
        title: "Syllable",
        syllable: "Ox",
        word: "Boxer",
        image: getAssetUrl(s3Assets.BoxerImg),
        audio: getAssetAudioUrl(s3Assets.BoxerAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BoxerAudio),
      },
    ],
  },
  {
    syllable: "Do",
    items: [
      {
        id: 49,
        title: "Syllable",
        syllable: "Do",
        word: "Doll",
        image: getAssetUrl(s3Assets.DollImg),
        audio: getAssetAudioUrl(s3Assets.DollAudio),
        singleAudio: getAssetAudioUrl(s3Assets.DollAudio),
      },
      {
        id: 50,
        title: "Syllable",
        syllable: "Do",
        word: "Indoor",
        image: getAssetUrl(s3Assets.IndoorImg),
        audio: getAssetAudioUrl(s3Assets.IndoorAudio),
        singleAudio: getAssetAudioUrl(s3Assets.IndoorAudio),
      },
    ],
  },
  {
    syllable: "Go",
    items: [
      {
        id: 51,
        title: "Syllable",
        syllable: "Go",
        word: "Gold",
        image: getAssetUrl(s3Assets.GoldImg),
        audio: getAssetAudioUrl(s3Assets.GoldAudio),
        singleAudio: getAssetAudioUrl(s3Assets.GoldAudio),
      },
      {
        id: 52,
        title: "Syllable",
        syllable: "Go",
        word: "Wagon",
        image: getAssetUrl(s3Assets.WagonImg),
        audio: getAssetAudioUrl(s3Assets.WagonAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WagonAudio),
      },
    ],
  },
  {
    syllable: "on",
    items: [
      {
        id: 53,
        title: "Syllable",
        syllable: "on",
        word: "one",
        image: getAssetUrl(s3Assets.oneImg),
        audio: getAssetAudioUrl(s3Assets.oneAudio),
        singleAudio: getAssetAudioUrl(s3Assets.oneAudio),
      },
      {
        id: 54,
        title: "Syllable",
        syllable: "on",
        word: "tongue",
        image: getAssetUrl(s3Assets.tongueImg),
        audio: getAssetAudioUrl(s3Assets.tongueAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tongueAudio),
      },
    ],
  },
  {
    syllable: "to",
    items: [
      {
        id: 55,
        title: "Syllable",
        syllable: "to",
        word: "toys",
        image: getAssetUrl(s3Assets.toysImg),
        audio: getAssetAudioUrl(s3Assets.toysAudio),
        singleAudio: getAssetAudioUrl(s3Assets.toysAudio),
      },
      {
        id: 56,
        title: "Syllable",
        syllable: "to",
        word: "store",
        image: getAssetUrl(s3Assets.store2Img),
        audio: getAssetAudioUrl(s3Assets.store2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.store2Audio),
      },
    ],
  },
  {
    syllable: "Act",
    items: [
      {
        id: 57,
        title: "Syllable",
        syllable: "Act",
        word: "Actor",
        image: getAssetUrl(s3Assets.ActorImg),
        audio: getAssetAudioUrl(s3Assets.ActorAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ActorAudio),
      },
      {
        id: 58,
        title: "Syllable",
        syllable: "Act",
        word: "Tractor",
        image: getAssetUrl(s3Assets.TractorImg),
        audio: getAssetAudioUrl(s3Assets.TractorAudio),
        singleAudio: getAssetAudioUrl(s3Assets.TractorAudio),
      },
    ],
  },
  {
    syllable: "Age",
    items: [
      {
        id: 59,
        title: "Syllable",
        syllable: "Age",
        word: "Agent",
        image: getAssetUrl(s3Assets.AgentImg),
        audio: getAssetAudioUrl(s3Assets.AgentAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AgentAudio),
      },
      {
        id: 60,
        title: "Syllable",
        syllable: "Age",
        word: "Cage",
        image: getAssetUrl(s3Assets.CageImg),
        audio: getAssetAudioUrl(s3Assets.CageAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CageAudio),
      },
    ],
  },
  {
    syllable: "Air",
    items: [
      {
        id: 61,
        title: "Syllable",
        syllable: "Air",
        word: "Airport",
        image: getAssetUrl(s3Assets.AirportImg),
        audio: getAssetAudioUrl(s3Assets.AirportAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AirportAudio),
      },
      {
        id: 62,
        title: "Syllable",
        syllable: "Air",
        word: "Chair",
        image: getAssetUrl(s3Assets.ChairImg),
        audio: getAssetAudioUrl(s3Assets.ChairAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ChairAudio),
      },
    ],
  },
  {
    syllable: "Arm",
    items: [
      {
        id: 63,
        title: "Syllable",
        syllable: "Arm",
        word: "Army",
        image: getAssetUrl(s3Assets.Army2Img),
        audio: getAssetAudioUrl(s3Assets.Army2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.Army2Audio),
      },
      {
        id: 64,
        title: "Syllable",
        syllable: "Arm",
        word: "Farmer",
        image: getAssetUrl(s3Assets.FarmerImg),
        audio: getAssetAudioUrl(s3Assets.FarmerAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FarmerAudio),
      },
    ],
  },
  {
    syllable: "Art",
    items: [
      {
        id: 65,
        title: "Syllable",
        syllable: "Art",
        word: "Artist",
        image: getAssetUrl(s3Assets.ArtistImg),
        audio: getAssetAudioUrl(s3Assets.ArtistAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ArtistAudio),
      },
      {
        id: 66,
        title: "Syllable",
        syllable: "Art",
        word: "Party",
        image: getAssetUrl(s3Assets.PartyImg),
        audio: getAssetAudioUrl(s3Assets.PartyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PartyAudio),
      },
    ],
  },
  {
    syllable: "Ask",
    items: [
      {
        id: 67,
        title: "Syllable",
        syllable: "Ask",
        word: "Asking",
        image: getAssetUrl(s3Assets.AskingImg),
        audio: getAssetAudioUrl(s3Assets.AskingAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AskingAudio),
      },
      {
        id: 68,
        title: "Syllable",
        syllable: "Ask",
        word: "Mask",
        image: getAssetUrl(s3Assets.MaskImage),
        audio: getAssetAudioUrl(s3Assets.MaskAudio),
        singleAudio: getAssetAudioUrl(s3Assets.MaskAudio),
      },
    ],
  },
  {
    syllable: "Bit",
    items: [
      {
        id: 69,
        title: "Syllable",
        syllable: "Bit",
        word: "Bitter",
        image: getAssetUrl(s3Assets.BitterImg),
        audio: getAssetAudioUrl(s3Assets.BitterAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BitterAudio),
      },
      {
        id: 70,
        title: "Syllable",
        syllable: "Bit",
        word: "Habit",
        image: getAssetUrl(s3Assets.HabitImg),
        audio: getAssetAudioUrl(s3Assets.HabitAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HabitAudio),
      },
    ],
  },
  {
    syllable: "Car",
    items: [
      {
        id: 71,
        title: "Syllable",
        syllable: "Car",
        word: "Carrot",
        image: getAssetUrl(s3Assets.CarrotImg),
        audio: getAssetAudioUrl(s3Assets.CarrotAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CarrotAudio),
      },
      {
        id: 72,
        title: "Syllable",
        syllable: "Car",
        word: "Scarf",
        image: getAssetUrl(s3Assets.ScarfImg),
        audio: getAssetAudioUrl(s3Assets.ScarfAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ScarfAudio),
      },
    ],
  },
  {
    syllable: "Fit",
    items: [
      {
        id: 73,
        title: "Syllable",
        syllable: "Fit",
        word: "Fitness",
        image: getAssetUrl(s3Assets.FitnessImg),
        audio: getAssetAudioUrl(s3Assets.FitnessAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FitnessAudio),
      },
      {
        id: 74,
        title: "Syllable",
        syllable: "Fit",
        word: "Profit",
        image: getAssetUrl(s3Assets.ProfitImg),
        audio: getAssetAudioUrl(s3Assets.ProfitAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ProfitAudio),
      },
    ],
  },
  {
    syllable: "Fly",
    items: [
      {
        id: 75,
        title: "Syllable",
        syllable: "Fly",
        word: "Flying",
        image: getAssetUrl(s3Assets.FlyingImg),
        audio: getAssetAudioUrl(s3Assets.FlyingAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FlyingAudio),
      },
      {
        id: 76,
        title: "Syllable",
        syllable: "Fly",
        word: "Butterfly",
        image: getAssetUrl(s3Assets.ButterflyImg),
        audio: getAssetAudioUrl(s3Assets.ButterflyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ButterflyAudio),
      },
    ],
  },
  {
    syllable: "Fun",
    items: [
      {
        id: 77,
        title: "Syllable",
        syllable: "Fun",
        word: "Funny",
        image: getAssetUrl(s3Assets.FunnyImg),
        audio: getAssetAudioUrl(s3Assets.FunnyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FunnyAudio),
      },
      {
        id: 78,
        title: "Syllable",
        syllable: "Fun",
        word: "Funnel",
        image: getAssetUrl(s3Assets.FunnelImg),
        audio: getAssetAudioUrl(s3Assets.FunnelAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FunnelAudio),
      },
    ],
  },
  {
    syllable: "Ice",
    items: [
      {
        id: 79,
        title: "Syllable",
        syllable: "Ice",
        word: "Mice",
        image: getAssetUrl(s3Assets.MiceImg),
        audio: getAssetAudioUrl(s3Assets.MiceAudio),
        singleAudio: getAssetAudioUrl(s3Assets.MiceAudio),
      },
      {
        id: 80,
        title: "Syllable",
        syllable: "Ice",
        word: "Juice",
        image: getAssetUrl(s3Assets.JuiceImg),
        audio: getAssetAudioUrl(s3Assets.JuiceAudio),
        singleAudio: getAssetAudioUrl(s3Assets.JuiceAudio),
      },
    ],
  },
  {
    syllable: "Ink",
    items: [
      {
        id: 81,
        title: "Syllable",
        syllable: "Ink",
        word: "Pink",
        image: getAssetUrl(s3Assets.PinkImg),
        audio: getAssetAudioUrl(s3Assets.PinkAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PinkAudio),
      },
      {
        id: 82,
        title: "Syllable",
        syllable: "Ink",
        word: "Twinkle",
        image: getAssetUrl(s3Assets.TwinkleImg),
        audio: getAssetAudioUrl(s3Assets.TwinkleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.TwinkleAudio),
      },
    ],
  },
  {
    syllable: "Key",
    items: [
      {
        id: 83,
        title: "Syllable",
        syllable: "Key",
        word: "Keyboard",
        image: getAssetUrl(s3Assets.KeyboardImg),
        audio: getAssetAudioUrl(s3Assets.KeyboardAudio),
        singleAudio: getAssetAudioUrl(s3Assets.KeyboardAudio),
      },
      {
        id: 84,
        title: "Syllable",
        syllable: "Key",
        word: "Donkey",
        image: getAssetUrl(s3Assets.DonkeyImg),
        audio: getAssetAudioUrl(s3Assets.DonkeyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.DonkeyAudio),
      },
    ],
  },
  {
    syllable: "the",
    items: [
      {
        id: 85,
        title: "Syllable",
        syllable: "the",
        word: "Bathe",
        image: getAssetUrl(s3Assets.BatheImg),
        audio: getAssetAudioUrl(s3Assets.BatheAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BatheAudio),
      },
      {
        id: 86,
        title: "Syllable",
        syllable: "the",
        word: "Father",
        image: getAssetUrl(s3Assets.FatherImg),
        audio: getAssetAudioUrl(s3Assets.FatherAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FatherAudio),
      },
    ],
  },
  {
    syllable: "and",
    items: [
      {
        id: 87,
        title: "Syllable",
        syllable: "and",
        word: "Hand",
        image: getAssetUrl(s3Assets.HandImg),
        audio: getAssetAudioUrl(s3Assets.HandAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HandAudio),
      },
      {
        id: 88,
        title: "Syllable",
        syllable: "and",
        word: "Candle",
        image: getAssetUrl(s3Assets.CandleImg),
        audio: getAssetAudioUrl(s3Assets.CandleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CandleAudio),
      },
    ],
  },
  {
    syllable: "for",
    items: [
      {
        id: 89,
        title: "Syllable",
        syllable: "for",
        word: "Forest",
        image: getAssetUrl(s3Assets.ForestImg),
        audio: getAssetAudioUrl(s3Assets.ForestAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ForestAudio),
      },
      {
        id: 90,
        title: "Syllable",
        syllable: "for",
        word: "fort",
        image: getAssetUrl(s3Assets.fortImg),
        audio: getAssetAudioUrl(s3Assets.fortAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fortAudio),
      },
    ],
  },
  {
    syllable: "hat",
    items: [
      {
        id: 91,
        title: "Syllable",
        syllable: "hat",
        word: "hate",
        image: getAssetUrl(s3Assets.hateImg),
        audio: getAssetAudioUrl(s3Assets.hateAudio),
        singleAudio: getAssetAudioUrl(s3Assets.hateAudio),
      },
      {
        id: 92,
        title: "Syllable",
        syllable: "hat",
        word: "Chatter",
        image: getAssetUrl(s3Assets.ChatterImg),
        audio: getAssetAudioUrl(s3Assets.ChatterAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ChatterAudio),
      },
    ],
  },
  {
    syllable: "his",
    items: [
      {
        id: 93,
        title: "Syllable",
        syllable: "his",
        word: "History",
        image: getAssetUrl(s3Assets.HistoryImg),
        audio: getAssetAudioUrl(s3Assets.HistoryAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HistoryAudio),
      },
      {
        id: 94,
        title: "Syllable",
        syllable: "his",
        word: "Whisper",
        image: getAssetUrl(s3Assets.WhisperImg),
        audio: getAssetAudioUrl(s3Assets.WhisperAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WhisperAudio),
      },
    ],
  },
  {
    syllable: "was",
    items: [
      {
        id: 95,
        title: "Syllable",
        syllable: "was",
        word: "Wasp",
        image: getAssetUrl(s3Assets.WaspImg),
        audio: getAssetAudioUrl(s3Assets.WaspAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WaspAudio),
      },
      {
        id: 96,
        title: "Syllable",
        syllable: "was",
        word: "Waste",
        image: getAssetUrl(s3Assets.WasteImg),
        audio: getAssetAudioUrl(s3Assets.WasteAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WasteAudio),
      },
    ],
  },
  {
    syllable: "one",
    items: [
      {
        id: 97,
        title: "Syllable",
        syllable: "one",
        word: "Bone",
        image: getAssetUrl(s3Assets.BoneImg),
        audio: getAssetAudioUrl(s3Assets.BoneAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BoneAudio),
      },
      {
        id: 98,
        title: "Syllable",
        syllable: "one",
        word: "money",
        image: getAssetUrl(s3Assets.moneyImg),
        audio: getAssetAudioUrl(s3Assets.moneyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.moneyAudio),
      },
    ],
  },
  {
    syllable: "our",
    items: [
      {
        id: 99,
        title: "Syllable",
        syllable: "our",
        word: "colour",
        image: getAssetUrl(s3Assets.colourImg),
        audio: getAssetAudioUrl(s3Assets.colourAudio),
        singleAudio: getAssetAudioUrl(s3Assets.colourAudio),
      },
      {
        id: 100,
        title: "Syllable",
        syllable: "our",
        word: "four",
        image: getAssetUrl(s3Assets.fourImg),
        audio: getAssetAudioUrl(s3Assets.fourAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fourAudio),
      },
    ],
  },
  {
    syllable: "wit",
    items: [
      {
        id: 101,
        title: "Syllable",
        syllable: "wit",
        word: "Witch",
        image: getAssetUrl(s3Assets.WitchImg),
        audio: getAssetAudioUrl(s3Assets.WitchAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WitchAudio),
      },
      {
        id: 102,
        title: "Syllable",
        syllable: "wit",
        word: "Switch",
        image: getAssetUrl(s3Assets.SwitchImg),
        audio: getAssetAudioUrl(s3Assets.SwitchAudio),
        singleAudio: getAssetAudioUrl(s3Assets.SwitchAudio),
      },
    ],
  },
  {
    syllable: "not",
    items: [
      {
        id: 103,
        title: "Syllable",
        syllable: "not",
        word: "notebook",
        image: getAssetUrl(s3Assets.notebookImg),
        audio: getAssetAudioUrl(s3Assets.notebookAudio),
        singleAudio: getAssetAudioUrl(s3Assets.notebookAudio),
      },
      {
        id: 104,
        title: "Syllable",
        syllable: "not",
        word: "note",
        image: getAssetUrl(s3Assets.noteImg),
        audio: getAssetAudioUrl(s3Assets.noteAudio),
        singleAudio: getAssetAudioUrl(s3Assets.noteAudio),
      },
    ],
  },
  {
    syllable: "Bed",
    items: [
      {
        id: 105,
        title: "Syllable",
        syllable: "Bed",
        word: "Bedroom",
        image: getAssetUrl(s3Assets.BedroomImg),
        audio: getAssetAudioUrl(s3Assets.BedroomAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BedroomAudio),
      },
      {
        id: 106,
        title: "Syllable",
        syllable: "Bed",
        word: "Bedtime",
        image: getAssetUrl(s3Assets.BedtimeImg),
        audio: getAssetAudioUrl(s3Assets.BedtimeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BedtimeAudio),
      },
    ],
  },
  {
    syllable: "hi",
    items: [
      {
        id: 107,
        title: "Syllable",
        syllable: "hi",
        word: "Hide",
        image: getAssetUrl(s3Assets.HideImg),
        audio: getAssetAudioUrl(s3Assets.HideAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HideAudio),
      },
      {
        id: 108,
        title: "Syllable",
        syllable: "hi",
        word: "child",
        image: getAssetUrl(s3Assets.childImg),
        audio: getAssetAudioUrl(s3Assets.childAudio),
        singleAudio: getAssetAudioUrl(s3Assets.childAudio),
      },
    ],
  },
  {
    letter: "E",
    items: [
      {
        id: 1,
        title: "Vowel",
        letters: "Ee",
        letter: "e",
        word: "Egg",
        image: getAssetUrl(s3Assets.eggFiveImg),
        audio: getAssetAudioUrl(s3Assets.eggPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.eggPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.EForEggAudio),
      },
      {
        id: 2,
        title: "Vowel",
        letters: "Ee",
        letter: "e",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFourteenImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.EForPenAudio),
      },
      {
        id: 3,
        title: "Vowel",
        letters: "Ee",
        letter: "e",
        word: "Kite",
        image: getAssetUrl(s3Assets.kiteFiveImg),
        audio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.EForKiteAudio),
      },
    ],
  },
  {
    letter: "A",
    items: [
      {
        id: 4,
        title: "Vowel",
        letters: "Aa",
        letter: "a",
        word: "Apple",
        image: getAssetUrl(s3Assets.appleOneImg),
        audio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.AForAppleAudio),
      },
      {
        id: 5,
        title: "Vowel",
        letters: "Aa",
        letter: "a",
        word: "Cat",
        image: getAssetUrl(s3Assets.catOneImg),
        audio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.AForCatAudio),
      },
      {
        id: 6,
        title: "Vowel",
        letters: "Aa",
        letter: "a",
        word: "Pea",
        image: getAssetUrl(s3Assets.peaOneImg),
        audio: getAssetAudioUrl(s3Assets.peaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.peaPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.AForPeaAudio),
      },
    ],
  },
  {
    letter: "O",
    items: [
      {
        id: 7,
        title: "Vowel",
        letters: "Oo",
        letter: "o",
        word: "Orange",
        image: getAssetUrl(s3Assets.orangeFifteenImg),
        audio: getAssetAudioUrl(s3Assets.orangePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.orangePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.OForOrangeAudio),
      },
      {
        id: 8,
        title: "Vowel",
        letters: "Oo",
        letter: "o",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogSevenImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.OForDogAudio),
      },
      {
        id: 9,
        title: "Vowel",
        letters: "Oo",
        letter: "o",
        word: "Mango",
        image: getAssetUrl(s3Assets.mangoThirteenImg),
        audio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.OForMangoAudio),
      },
    ],
  },
  {
    letter: "I",
    items: [
      {
        id: 10,
        title: "Vowel",
        letters: "Ii",
        letter: "i",
        word: "Ice",
        image: getAssetUrl(s3Assets.iceThreeImg),
        audio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.IForIceAudio),
      },
      {
        id: 11,
        title: "Vowel",
        letters: "Ii",
        letter: "i",
        word: "Pig",
        image: getAssetUrl(s3Assets.pigNineImg),
        audio: getAssetAudioUrl(s3Assets.pigPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.pigPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.IForPigAudio),
      },
      {
        id: 12,
        title: "Vowel",
        letters: "Ii",
        letter: "i",
        word: "Chilly",
        image: getAssetUrl(s3Assets.chilliImg),
        audio: getAssetAudioUrl(s3Assets.chillyAud),
        singleAudio: getAssetAudioUrl(s3Assets.chillyAud),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.IForChillyAudio),
      },
    ],
  },
  {
    letter: "U",
    items: [
      {
        id: 13,
        title: "Vowel",
        letters: "Uu",
        letter: "u",
        word: "Umbrella",
        image: getAssetUrl(s3Assets.umbrellaTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.umbrellaPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.UForUmbrellaAudio),
      },
      {
        id: 14,
        title: "Vowel",
        letters: "Uu",
        letter: "u",
        word: "Dustbin",
        image: getAssetUrl(s3Assets.DustbinTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.dustbinPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dustbinPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.UForDustbinAudio),
      },
      {
        id: 15,
        title: "Vowel",
        letters: "Uu",
        letter: "u",
        word: "Laddu",
        image: getAssetUrl(s3Assets.LadduTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.ladduPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ladduPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.UForLadduAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.TForTigerAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.TForWatchAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.TForPlantAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.NForNestAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.NForHoneyAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.NForPenAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.SForSunAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.SForHorseAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.SForBusAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.RForRatAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.RForCarrotAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.RForCarAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.HForHandAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.HForTeacherAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.HForEarthAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.LForLionAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.LForBalloonAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.LForBellAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.DForDogAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.DForWindowAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.DForSwordAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.CForCatAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.CForIceAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.CForGarlicAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.MForMangoAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.MForLemonAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.MForJamAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.FForFishAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.FForGiraffeAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.FForLeafAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.YForYakAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.YForPapayaAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.YForKeyAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.WForWindowAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.WForSwordAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.WForCrowAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.GForGoatAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.GForTigerAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.GForDogAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.PForPenAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.PForAppleAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.PForCapAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.BForBallAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.BForZebraAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.BForCubAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.VForVanAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.VForGuavaAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.KForKiteAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.KForMonkeyAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.KForBookAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.JForJamAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.JForBrinjalAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.XForXrayAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.XForTextbookAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.XForFoxAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.QForQueenAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.QForMosquitoAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ZForZebraAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ZForPuzzleAudio),
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
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ZForQuizAudio),
      },
    ],
  },
];

export const dataKn = [
  {
    letter: "ಅ",
    items: [
      {
        id: 1,
        title: "ಸ್ವರಗಳು",
        letters: "ಅ",
        letter: "ಅ",
        word: "ಅರಸ",
        image: getAssetUrl(s3Assets.ಅರಸImg),
        audio: getAssetAudioUrl(s3Assets.ಅರಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅರಸSingleAudio),
      },
    ],
  },
  {
    letter: "ಆ",
    items: [
      {
        id: 2,
        title: "ಸ್ವರಗಳು",
        letters: "ಆ",
        letter: "ಆ",
        word: "ಆನೆ",
        image: getAssetUrl(s3Assets.ಆನೆImg),
        audio: getAssetAudioUrl(s3Assets.ಆನೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆನೆSingleAudio),
      },
    ],
  },
  {
    letter: "ಇ",
    items: [
      {
        id: 3,
        title: "ಸ್ವರಗಳು",
        letters: "ಇ",
        letter: "ಇ",
        word: "ಇಲಿ",
        image: getAssetUrl(s3Assets.ಇಲಿImg),
        audio: getAssetAudioUrl(s3Assets.ಇಲಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಇಲಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಈ",
    items: [
      {
        id: 4,
        title: "ಸ್ವರಗಳು",
        letters: "ಈ",
        letter: "ಈ",
        word: "ಈಜು",
        image: getAssetUrl(s3Assets.ಈಜುImg),
        audio: getAssetAudioUrl(s3Assets.ಈಜುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಈಜುSingleAudio),
      },
    ],
  },
  {
    letter: "ಉ",
    items: [
      {
        id: 5,
        title: "ಸ್ವರಗಳು",
        letters: "ಉ",
        letter: "ಉ",
        word: "ಉದರ",
        image: getAssetUrl(s3Assets.ಉದರImg),
        audio: getAssetAudioUrl(s3Assets.ಉದರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉದರSingleAudio),
      },
    ],
  },
  {
    letter: "ಊ",
    items: [
      {
        id: 6,
        title: "ಸ್ವರಗಳು",
        letters: "ಊ",
        letter: "ಊ",
        word: "ಊಟ",
        image: getAssetUrl(s3Assets.ಊಟImg),
        audio: getAssetAudioUrl(s3Assets.ಊಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಊಟSingleAudio),
      },
    ],
  },
  {
    letter: "ಋ",
    items: [
      {
        id: 7,
        title: "ಸ್ವರಗಳು",
        letters: "ಋ",
        letter: "ಋ",
        word: "ಋಷಿ",
        image: getAssetUrl(s3Assets.ಋಷಿImg),
        audio: getAssetAudioUrl(s3Assets.ಋಷಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಋಷಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಎ",
    items: [
      {
        id: 8,
        title: "ಸ್ವರಗಳು",
        letters: "ಎ",
        letter: "ಎ",
        word: "ಎಲೆ",
        image: getAssetUrl(s3Assets.ಎಲೆImg),
        audio: getAssetAudioUrl(s3Assets.ಎಲೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಎಲೆSingleAudio),
      },
    ],
  },
  {
    letter: "ಏ",
    items: [
      {
        id: 9,
        title: "ಸ್ವರಗಳು",
        letters: "ಏ",
        letter: "ಏ",
        word: "ಏಣಿ",
        image: getAssetUrl(s3Assets.ಏಣಿImg),
        audio: getAssetAudioUrl(s3Assets.ಏಣಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಏಣಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಐ",
    items: [
      {
        id: 10,
        title: "ಸ್ವರಗಳು",
        letters: "ಐ",
        letter: "ಐ",
        word: "ಐದು",
        image: getAssetUrl(s3Assets.ಐದುImg),
        audio: getAssetAudioUrl(s3Assets.ಐದುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಐದುSingleAudio),
      },
    ],
  },
  {
    letter: "ಒ",
    items: [
      {
        id: 11,
        title: "ಸ್ವರಗಳು",
        letters: "ಒ",
        letter: "ಒ",
        word: "ಒಂಟೆ",
        image: getAssetUrl(s3Assets.ಒಂಟೆImg),
        audio: getAssetAudioUrl(s3Assets.ಒಂಟೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಒಂಟೆSingleAudio),
      },
    ],
  },
  {
    letter: "ಓ",
    items: [
      {
        id: 12,
        title: "ಸ್ವರಗಳು",
        letters: "ಓ",
        letter: "ಓ",
        word: "ಓಡು",
        image: getAssetUrl(s3Assets.ಓಡುImg),
        audio: getAssetAudioUrl(s3Assets.ಓಡುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಓಡುSingleAudio),
      },
    ],
  },
  {
    letter: "ಔ",
    items: [
      {
        id: 13,
        title: "ಸ್ವರಗಳು",
        letters: "ಔ",
        letter: "ಔ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.ಔಷಧImg),
        audio: getAssetAudioUrl(s3Assets.ಔಷಧAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಔಷಧSingleAudio),
      },
    ],
  },
  {
    letter: "ಅಂ",
    items: [
      {
        id: 14,
        title: "ಸ್ವರಗಳು",
        letters: "ಅಂ",
        letter: "ಅಂ",
        word: "ಅಂಗಡಿ",
        image: getAssetUrl(s3Assets.ಅಂಗಡಿImg),
        audio: getAssetAudioUrl(s3Assets.ಅಂಗಡಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅಂಗಡಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಅಃ",
    items: [
      {
        id: 15,
        title: "ಸ್ವರಗಳು",
        letters: "ಅಃ",
        letter: "ಅಃ",
        word: "ಅಃ",
        image: getAssetUrl(s3Assets.ಅಃImg),
        audio: getAssetAudioUrl(s3Assets.ಅಃAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅಃSingleAudio),
      },
    ],
  },
  {
    letter: "ಕ",
    items: [
      {
        id: 16,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಕಮಲ",
        image: getAssetUrl(s3Assets.ಕಮಲImg),
        audio: getAssetAudioUrl(s3Assets.ಕಮಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಮಲSingleAudio),
      },
      {
        id: 17,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಏಕದಳ",
        image: getAssetUrl(s3Assets.ಏಕದಳImg),
        audio: getAssetAudioUrl(s3Assets.ಏಕದಳAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಏಕದಳSingleAudio),
      },
      {
        id: 18,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಕ",
        letter: "ಕ",
        word: "ಪದಕ",
        image: getAssetUrl(s3Assets.ಪದಕImg),
        audio: getAssetAudioUrl(s3Assets.ಪದಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪದಕSingleAudio),
      },
    ],
  },
  {
    letter: "ಖ",
    items: [
      {
        id: 19,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಖಡ್ಗ",
        image: getAssetUrl(s3Assets.ಖಡ್ಗImg),
        audio: getAssetAudioUrl(s3Assets.ಖಡ್ಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಖಡ್ಗSingleAudio),
      },
      {
        id: 20,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಲೇಖನಿ",
        image: getAssetUrl(s3Assets.ಲೇಖನಿImg),
        audio: getAssetAudioUrl(s3Assets.ಲೇಖನಿ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಲೇಖನಿSingleAudio),
      },
      {
        id: 21,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಖ",
        letter: "ಖ",
        word: "ಪಂಖ",
        image: getAssetUrl(s3Assets.ಪಂಖImg),
        audio: getAssetAudioUrl(s3Assets.ಪಂಖAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪಂಖSingleAudio),
      },
    ],
  },
  {
    letter: "ಗ",
    items: [
      {
        id: 22,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಗರಿ",
        image: getAssetUrl(s3Assets.ಗರಿImg),
        audio: getAssetAudioUrl(s3Assets.ಗರಿ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗರಿSingleAudio),
      },
      {
        id: 23,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಆಗಸ",
        image: getAssetUrl(s3Assets.ಆಗಸImg),
        audio: getAssetAudioUrl(s3Assets.ಆಗಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಗಸSingleAudio),
      },
      {
        id: 24,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಗ",
        letter: "ಗ",
        word: "ಉರಗ",
        image: getAssetUrl(s3Assets.ಉರಗImg),
        audio: getAssetAudioUrl(s3Assets.ಉರಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉರಗSingleAudio),
      },
    ],
  },
  {
    letter: "ಘ",
    items: [
      {
        id: 25,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಘಂಟೆ",
        image: getAssetUrl(s3Assets.ಘಂಟೆImg),
        audio: getAssetAudioUrl(s3Assets.ಘಂಟೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಘಂಟೆSingleAudio),
      },
      {
        id: 26,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಘಮಘಮ",
        image: getAssetUrl(s3Assets.ಘಮಘಮImg),
        audio: getAssetAudioUrl(s3Assets.ಘಮಘಮAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಘಮಘಮSingleAudio),
      },
      {
        id: 27,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಘ",
        letter: "ಘ",
        word: "ಸಂಘ",
        image: getAssetUrl(s3Assets.ಸಂಘImg),
        audio: getAssetAudioUrl(s3Assets.ಸಂಘAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸಂಘSingleAudio),
      },
    ],
  },
  {
    letter: "ಙ",
    items: [
      {
        id: 28,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಙ",
        letter: "ಙ",
        word: "ಙ",
        image: getAssetUrl(s3Assets.ಙImg),
        audio: getAssetAudioUrl(s3Assets.ಙAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಙSingleAudio),
      },
    ],
  },
  {
    letter: "ಚ",
    items: [
      {
        id: 29,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಚಮಚ",
        image: getAssetUrl(s3Assets.ಚಮಚImg),
        audio: getAssetAudioUrl(s3Assets.ಚಮಚAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಚಮಚSingleAudio),
      },
      {
        id: 30,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಈಚಲ",
        image: getAssetUrl(s3Assets.ಈಚಲImg),
        audio: getAssetAudioUrl(s3Assets.ಈಚಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಈಚಲSingleAudio),
      },
      {
        id: 31,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಚ",
        letter: "ಚ",
        word: "ಮಂಚ",
        image: getAssetUrl(s3Assets.ಮಂಚImg),
        audio: getAssetAudioUrl(s3Assets.ಮಂಚAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮಂಚSingleAudio),
      },
    ],
  },
  {
    letter: "ಛ",
    items: [
      {
        id: 32,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಛ",
        letter: "ಛ",
        word: "ಛತ್ರಿ",
        image: getAssetUrl(s3Assets.ಛತ್ರಿImg),
        audio: getAssetAudioUrl(s3Assets.ಛತ್ರಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಛತ್ರಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಜ",
    items: [
      {
        id: 33,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಜನ",
        image: getAssetUrl(s3Assets.ಜನImg),
        audio: getAssetAudioUrl(s3Assets.ಜನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಜನSingleAudio),
      },
      {
        id: 34,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಗೀಜಗ",
        image: getAssetUrl(s3Assets.ಗೀಜಗImg),
        audio: getAssetAudioUrl(s3Assets.ಗೀಜಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗೀಜಗSingleAudio),
      },
      {
        id: 35,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಜ",
        letter: "ಜ",
        word: "ಭುಜ",
        image: getAssetUrl(s3Assets.ಭುಜImg),
        audio: getAssetAudioUrl(s3Assets.ಭುಜAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಭುಜSingleAudio),
      },
    ],
  },
  {
    letter: "ಝ",
    items: [
      {
        id: 36,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಝ",
        letter: "ಝ",
        word: "ಝರಿ",
        image: getAssetUrl(s3Assets.ಝರಿImg),
        audio: getAssetAudioUrl(s3Assets.ಝರಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಝರಿSingleAudio),
      },
    ],
  },
  {
    letter: "ಞ",
    items: [
      {
        id: 37,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಞ",
        letter: "ಞ",
        word: "ಞ",
        image: getAssetUrl(s3Assets.ಞImg),
        audio: getAssetAudioUrl(s3Assets.ಞAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಞSingleAudio),
      },
    ],
  },
  {
    letter: "ಟ",
    items: [
      {
        id: 38,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಟಗರು",
        image: getAssetUrl(s3Assets.ಟಗರುImg),
        audio: getAssetAudioUrl(s3Assets.ಟಗರುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಟಗರುSingleAudio),
      },
      {
        id: 39,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಕಿಟಕಿ",
        image: getAssetUrl(s3Assets.ಕಿಟಕಿImg),
        audio: getAssetAudioUrl(s3Assets.ಕಿಟಕಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಿಟಕಿSingleAudio),
      },
      {
        id: 40,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಟ",
        letter: "ಟ",
        word: "ಆಟ",
        image: getAssetUrl(s3Assets.ಆಟImg),
        audio: getAssetAudioUrl(s3Assets.ಆಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಟSingleAudio),
      },
    ],
  },
  {
    letter: "ಠ",
    items: [
      {
        id: 41,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಠಕ್ಕ",
        image: getAssetUrl(s3Assets.ಠಕ್ಕImg),
        audio: getAssetAudioUrl(s3Assets.ಠಕ್ಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಠಕ್ಕSingleAudio),
      },
      {
        id: 42,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಕೊಠಡಿ",
        image: getAssetUrl(s3Assets.ಕೊಠಡಿImg),
        audio: getAssetAudioUrl(s3Assets.ಕೊಠಡಿ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕೊಠಡಿSingleAudio),
      },
      {
        id: 43,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಠ",
        letter: "ಠ",
        word: "ಕಂಠ",
        image: getAssetUrl(s3Assets.ಕಂಠImg),
        audio: getAssetAudioUrl(s3Assets.ಕಂಠAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಂಠSingleAudio),
      },
    ],
  },
  {
    letter: "ಡ",
    items: [
      {
        id: 44,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಡಬ್ಬ",
        image: getAssetUrl(s3Assets.ಡಬ್ಬImg),
        audio: getAssetAudioUrl(s3Assets.ಡಬ್ಬAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಡಬ್ಬSingleAudio),
      },
      {
        id: 45,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಕಡಲು",
        image: getAssetUrl(s3Assets.ಕಡಲುImg),
        audio: getAssetAudioUrl(s3Assets.ಕಡಲುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಡಲುSingleAudio),
      },
      {
        id: 46,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಡ",
        letter: "ಡ",
        word: "ಗಿಡ",
        image: getAssetUrl(s3Assets.ಗಿಡImg),
        audio: getAssetAudioUrl(s3Assets.ಗಿಡAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಿಡSingleAudio),
      },
    ],
  },
  {
    letter: "ಢ",
    items: [
      {
        id: 47,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಢಣಢಣ",
        image: getAssetUrl(s3Assets.ಢಣಢಣImg),
        audio: getAssetAudioUrl(s3Assets.ಢಣಢಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಢಣಢಣSingleAudio),
      },
      {
        id: 48,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಪ್ರೌಢಶಾಲೆ",
        image: getAssetUrl(s3Assets.ಪ್ರೌಢಶಾಲೆImg),
        audio: getAssetAudioUrl(s3Assets.ಪ್ರೌಢಶಾಲೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪ್ರೌಢಶಾಲೆSingleAudio),
      },
      {
        id: 49,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಢ",
        letter: "ಢ",
        word: "ಗಾಢ",
        image: getAssetUrl(s3Assets.ಗಾಢImg),
        audio: getAssetAudioUrl(s3Assets.ಗಾಢAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಾಢSingleAudio),
      },
    ],
  },
  {
    letter: "ಣ",
    items: [
      {
        id: 50,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಣ",
        letter: "ಣ",
        word: "ಹಣ",
        image: getAssetUrl(s3Assets.ಹಣImg),
        audio: getAssetAudioUrl(s3Assets.ಹಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಣSingleAudio),
      },
      {
        id: 51,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಣ",
        letter: "ಣ",
        word: "ಹಣತೆ",
        image: getAssetUrl(s3Assets.ಹಣತೆImg),
        audio: getAssetAudioUrl(s3Assets.ಹಣತೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಣತೆSingleAudio),
      },
    ],
  },
  {
    letter: "ತ",
    items: [
      {
        id: 52,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ತ",
        letter: "ತ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.ತಬಲImg),
        audio: getAssetAudioUrl(s3Assets.ತಬಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ತಬಲSingleAudio),
      },
      {
        id: 53,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ತ",
        letter: "ತ",
        word: "ಸಂತಸ",
        image: getAssetUrl(s3Assets.ಸಂತಸImg),
        audio: getAssetAudioUrl(s3Assets.ಸಂತಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸಂತಸSingleAudio),
      },
      {
        id: 54,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ತ",
        letter: "ತ",
        word: "ಗಣಿತ",
        image: getAssetUrl(s3Assets.ಗಣಿತImg),
        audio: getAssetAudioUrl(s3Assets.ಗಣಿತAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಣಿತSingleAudio),
      },
    ],
  },
  {
    letter: "ಥ",
    items: [
      {
        id: 55,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಥ",
        letter: "ಥ",
        word: "ಥಳಥಳ",
        image: getAssetUrl(s3Assets.ಥಳಥಳImg),
        audio: getAssetAudioUrl(s3Assets.ಥಳಥಳAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಥಳಥಳSingleAudio),
      },
      {
        id: 56,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಥ",
        letter: "ಥ",
        word: "ಥರಥರ",
        image: getAssetUrl(s3Assets.ಥರಥರImg),
        audio: getAssetAudioUrl(s3Assets.ಥರಥರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಥರಥರSingleAudio),
      },
      {
        id: 57,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಥ",
        letter: "ಥ",
        word: "ರಥ",
        image: getAssetUrl(s3Assets.ರಥImg),
        audio: getAssetAudioUrl(s3Assets.ರಥAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ರಥSingleAudio),
      },
    ],
  },
  {
    letter: "ದ",
    items: [
      {
        id: 58,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ದ",
        letter: "ದ",
        word: "ದನ",
        image: getAssetUrl(s3Assets.ದನImg),
        audio: getAssetAudioUrl(s3Assets.ದನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ದನSingleAudio),
      },
      {
        id: 59,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ದ",
        letter: "ದ",
        word: "ಕೂದಲು",
        image: getAssetUrl(s3Assets.ಕೂದಲುImg),
        audio: getAssetAudioUrl(s3Assets.ಕೂದಲುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕೂದಲುSingleAudio),
      },
      {
        id: 60,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ದ",
        letter: "ದ",
        word: "ಕಾಗದ",
        image: getAssetUrl(s3Assets.ಕಾಗದImg),
        audio: getAssetAudioUrl(s3Assets.ಕಾಗದAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಾಗದSingleAudio),
      },
    ],
  },
  {
    letter: "ಧ",
    items: [
      {
        id: 61,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಧನ",
        image: getAssetUrl(s3Assets.ಧನImg),
        audio: getAssetAudioUrl(s3Assets.ಧನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಧನSingleAudio),
      },
      {
        id: 62,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಬುಧವಾರ",
        image: getAssetUrl(s3Assets.ಬುಧವಾರImg),
        audio: getAssetAudioUrl(s3Assets.ಬುಧವಾರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಬುಧವಾರSingleAudio),
      },
      {
        id: 63,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಧ",
        letter: "ಧ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.ಔಷಧ2Img),
        audio: getAssetAudioUrl(s3Assets.ಔಷಧ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಔಷಧ2SingleAudio),
      },
    ],
  },
  {
    letter: "ನ",
    items: [
      {
        id: 64,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ನ",
        letter: "ನ",
        word: "ನರಿ",
        image: getAssetUrl(s3Assets.ನರಿImg),
        audio: getAssetAudioUrl(s3Assets.ನರಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ನರಿSingleAudio),
      },
      {
        id: 65,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ನ",
        letter: "ನ",
        word: "ಕನಸು",
        image: getAssetUrl(s3Assets.ಕನಸುImg),
        audio: getAssetAudioUrl(s3Assets.ಕನಸುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕನಸುSingleAudio),
      },
      {
        id: 66,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ನ",
        letter: "ನ",
        word: "ನಮನ",
        image: getAssetUrl(s3Assets.ನಮನImg),
        audio: getAssetAudioUrl(s3Assets.ನಮನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ನಮನSingleAudio),
      },
    ],
  },
  {
    letter: "ಪ",
    items: [
      {
        id: 67,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಪದಕ",
        image: getAssetUrl(s3Assets.ಪದಕ2Img),
        audio: getAssetAudioUrl(s3Assets.ಪದಕ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪದಕ2SingleAudio),
      },
      {
        id: 68,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಗಾಳಿಪಟ",
        image: getAssetUrl(s3Assets.ಗಾಳಿಪಟImg),
        audio: getAssetAudioUrl(s3Assets.ಗಾಳಿಪಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಾಳಿಪಟSingleAudio),
      },
      {
        id: 69,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಪ",
        letter: "ಪ",
        word: "ಕೋಪ",
        image: getAssetUrl(s3Assets.ಕೋಪImg),
        audio: getAssetAudioUrl(s3Assets.ಕೋಪAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕೋಪSingleAudio),
      },
    ],
  },
  {
    letter: "ಫ",
    items: [
      {
        id: 70,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಫಲ",
        image: getAssetUrl(s3Assets.ಫಲImg),
        audio: getAssetAudioUrl(s3Assets.ಫಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಫಲSingleAudio),
      },
      {
        id: 71,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಸೌರಫಲಕ",
        image: getAssetUrl(s3Assets.ಸೌರಫಲಕImg),
        audio: getAssetAudioUrl(s3Assets.ಸೌರಫಲಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸೌರಫಲಕSingleAudio),
      },
      {
        id: 72,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಫ",
        letter: "ಫ",
        word: "ಕಫ",
        image: getAssetUrl(s3Assets.ಕಫImg),
        audio: getAssetAudioUrl(s3Assets.ಕಫAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಫSingleAudio),
      },
    ],
  },
  {
    letter: "ಬ",
    items: [
      {
        id: 73,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಬ",
        letter: "ಬ",
        word: "ಬಟಾಣಿ",
        image: getAssetUrl(s3Assets.ಬಟಾಣಿImg),
        audio: getAssetAudioUrl(s3Assets.ಬಟಾಣಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಬಟಾಣಿSingleAudio),
      },
      {
        id: 74,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಬ",
        letter: "ಬ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.ತಬಲ2Img),
        audio: getAssetAudioUrl(s3Assets.ತಬಲ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ತಬಲ2SingleAudio),
      },
      {
        id: 75,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಬ",
        letter: "ಬ",
        word: "ಕುಟುಂಬ",
        image: getAssetUrl(s3Assets.ಕುಟುಂಬImg),
        audio: getAssetAudioUrl(s3Assets.ಕುಟುಂಬAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕುಟುಂಬSingleAudio),
      },
    ],
  },
  {
    letter: "ಭ",
    items: [
      {
        id: 76,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಭ",
        letter: "ಭ",
        word: "ಭರಣಿ",
        image: getAssetUrl(s3Assets.ಭರಣಿImg),
        audio: getAssetAudioUrl(s3Assets.ಭರಣಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಭರಣಿSingleAudio),
      },
      {
        id: 77,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಭ",
        letter: "ಭ",
        word: "ಆಭರಣ",
        image: getAssetUrl(s3Assets.ಆಭರಣImg),
        audio: getAssetAudioUrl(s3Assets.ಆಭರಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಭರಣSingleAudio),
      },
      {
        id: 78,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಭ",
        letter: "ಭ",
        word: "ವೃಷಭ",
        image: getAssetUrl(s3Assets.ವೃಷಭImg),
        audio: getAssetAudioUrl(s3Assets.ವೃಷಭAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವೃಷಭSingleAudio),
      },
    ],
  },
  {
    letter: "ಮ",
    items: [
      {
        id: 79,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಮರ",
        image: getAssetUrl(s3Assets.ಮರImg),
        audio: getAssetAudioUrl(s3Assets.ಮರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮರSingleAudio),
      },
      {
        id: 80,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಕಮಲ",
        image: getAssetUrl(s3Assets.ಕಮಲ2Img),
        audio: getAssetAudioUrl(s3Assets.ಕಮಲ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಮಲ2SingleAudio),
      },
      {
        id: 81,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಮ",
        letter: "ಮ",
        word: "ಹಿಮ",
        image: getAssetUrl(s3Assets.ಹಿಮImg),
        audio: getAssetAudioUrl(s3Assets.ಹಿಮAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಿಮSingleAudio),
      },
    ],
  },
  {
    letter: "ಯ",
    items: [
      {
        id: 82,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಯಮ",
        image: getAssetUrl(s3Assets.ಯಮImg),
        audio: getAssetAudioUrl(s3Assets.ಯಮAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಯಮSingleAudio),
      },
      {
        id: 83,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಪಾಯಸ",
        image: getAssetUrl(s3Assets.ಪಾಯಸImg),
        audio: getAssetAudioUrl(s3Assets.ಪಾಯಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪಾಯಸSingleAudio),
      },
      {
        id: 84,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಯ",
        letter: "ಯ",
        word: "ಭಯ",
        image: getAssetUrl(s3Assets.ಭಯImg),
        audio: getAssetAudioUrl(s3Assets.ಭಯAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಭಯSingleAudio),
      },
    ],
  },
  {
    letter: "ರ",
    items: [
      {
        id: 85,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ರ",
        letter: "ರ",
        word: "ರಥ",
        image: getAssetUrl(s3Assets.ರಥ2Img),
        audio: getAssetAudioUrl(s3Assets.ರಥ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ರಥ2SingleAudio),
      },
      {
        id: 86,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ರ",
        letter: "ರ",
        word: "ಬೆರಳು",
        image: getAssetUrl(s3Assets.ಬೆರಳುImg),
        audio: getAssetAudioUrl(s3Assets.ಬೆರಳುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಬೆರಳುSingleAudio),
      },
      {
        id: 87,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ರ",
        letter: "ರ",
        word: "ಉದರ",
        image: getAssetUrl(s3Assets.ಉದರ2Img),
        audio: getAssetAudioUrl(s3Assets.ಉದರ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉದರ2SingleAudio),
      },
    ],
  },
  {
    letter: "ಲ",
    items: [
      {
        id: 88,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಲತೆ",
        image: getAssetUrl(s3Assets.ಲತೆImg),
        audio: getAssetAudioUrl(s3Assets.ಲತೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಲತೆSingleAudio),
      },
      {
        id: 89,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಚಿಲಕ",
        image: getAssetUrl(s3Assets.ಚಿಲಕImg),
        audio: getAssetAudioUrl(s3Assets.ಚಿಲಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಚಿಲಕSingleAudio),
      },
      {
        id: 90,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಲ",
        letter: "ಲ",
        word: "ಮೊಲ",
        image: getAssetUrl(s3Assets.ಮೊಲImg),
        audio: getAssetAudioUrl(s3Assets.ಮೊಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮೊಲSingleAudio),
      },
    ],
  },
  {
    letter: "ವ",
    items: [
      {
        id: 91,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ವ",
        letter: "ವ",
        word: "ವನ",
        image: getAssetUrl(s3Assets.ವನImg),
        audio: getAssetAudioUrl(s3Assets.ವನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವನSingleAudio),
      },
      {
        id: 92,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ವ",
        letter: "ವ",
        word: "ಲವಣ",
        image: getAssetUrl(s3Assets.ಲವಣImg),
        audio: getAssetAudioUrl(s3Assets.ಲವಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಲವಣSingleAudio),
      },
      {
        id: 93,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ವ",
        letter: "ವ",
        word: "ಶಿವ",
        image: getAssetUrl(s3Assets.ಶಿವImg),
        audio: getAssetAudioUrl(s3Assets.ಶಿವAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಶಿವSingleAudio),
      },
    ],
  },
  {
    letter: "ಶ",
    items: [
      {
        id: 94,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಶ",
        letter: "ಶ",
        word: "ಶಶಿ",
        image: getAssetUrl(s3Assets.ಶಶಿImg),
        audio: getAssetAudioUrl(s3Assets.ಶಶಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಶಶಿSingleAudio),
      },
      {
        id: 95,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಶ",
        letter: "ಶ",
        word: "ದಶಕ",
        image: getAssetUrl(s3Assets.ದಶಕImg),
        audio: getAssetAudioUrl(s3Assets.ದಶಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ದಶಕSingleAudio),
      },
      {
        id: 96,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಶ",
        letter: "ಶ",
        word: "ದೇಶ",
        image: getAssetUrl(s3Assets.ದೇಶImg),
        audio: getAssetAudioUrl(s3Assets.ದೇಶAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ದೇಶSingleAudio),
      },
    ],
  },
  {
    letter: "ಷ",
    items: [
      {
        id: 97,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಷಡ್ಭುಜ",
        image: getAssetUrl(s3Assets.ಷಡ್ಭುಜImg),
        audio: getAssetAudioUrl(s3Assets.ಷಡ್ಭುಜAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಷಡ್ಭುಜSingleAudio),
      },
      {
        id: 98,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.ಔಷಧ3Img),
        audio: getAssetAudioUrl(s3Assets.ಔಷಧ3Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಔಷಧ3SingleAudio),
      },
      {
        id: 99,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಷ",
        letter: "ಷ",
        word: "ಪುರುಷ",
        image: getAssetUrl(s3Assets.ಪುರುಷImg),
        audio: getAssetAudioUrl(s3Assets.ಪುರುಷAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪುರುಷSingleAudio),
      },
    ],
  },
  {
    letter: "ಸ",
    items: [
      {
        id: 100,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಸರ",
        image: getAssetUrl(s3Assets.ಸರImg),
        audio: getAssetAudioUrl(s3Assets.ಸರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸರSingleAudio),
      },
      {
        id: 101,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಮೊಸಳೆ",
        image: getAssetUrl(s3Assets.ಮೊಸಳೆImg),
        audio: getAssetAudioUrl(s3Assets.ಮೊಸಳೆAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮೊಸಳೆSingleAudio),
      },
      {
        id: 102,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಸ",
        letter: "ಸ",
        word: "ಹಂಸ",
        image: getAssetUrl(s3Assets.ಹಂಸImg),
        audio: getAssetAudioUrl(s3Assets.ಹಂಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಂಸSingleAudio),
      },
    ],
  },
  {
    letter: "ಹ",
    items: [
      {
        id: 103,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಹ",
        letter: "ಹ",
        word: "ಹಸು",
        image: getAssetUrl(s3Assets.ಹಸುImg),
        audio: getAssetAudioUrl(s3Assets.ಹಸುAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಸುSingleAudio),
      },
      {
        id: 104,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಹ",
        letter: "ಹ",
        word: "ವಾಹನ",
        image: getAssetUrl(s3Assets.ವಾಹನImg),
        audio: getAssetAudioUrl(s3Assets.ವಾಹನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವಾಹನSingleAudio),
      },
      {
        id: 105,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಹ",
        letter: "ಹ",
        word: "ಸಿಂಹ",
        image: getAssetUrl(s3Assets.ಸಿಂಹImg),
        audio: getAssetAudioUrl(s3Assets.ಸಿಂಹAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸಿಂಹSingleAudio),
      },
    ],
  },
  {
    letter: "ಳ",
    items: [
      {
        id: 106,
        title: "ವ್ಯಂಜನಗಳು",
        letters: "ಳ",
        letter: "ಳ",
        word: "ಹಳದಿ",
        image: getAssetUrl(s3Assets.ಹಳದಿImg),
        audio: getAssetAudioUrl(s3Assets.ಹಳದಿAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಳದಿSingleAudio),
      },
    ],
  },
];

export const dataHi = [
  {
    letter: "अ",
    items: [
      {
        id: 1,
        title: "स्वर",
        letters: "अ",
        letter: "अ",
        word: "अनार",
        image: getAssetUrl(s3Assets.अनारImg),
        audio: getAssetAudioUrl(s3Assets.अनारAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अनारAudio),
      },
    ],
  },
  {
    letter: "आ",
    items: [
      {
        id: 2,
        title: "स्वर",
        letters: "आ",
        letter: "आ",
        word: "आम",
        image: getAssetUrl(s3Assets.आमImg),
        audio: getAssetAudioUrl(s3Assets.आमAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आमAudio),
      },
      {
        id: 3,
        title: "स्वर",
        letters: "आ",
        letter: "आ",
        word: "कछुआ",
        image: getAssetUrl(s3Assets.कछुआImg),
        audio: getAssetAudioUrl(s3Assets.कछुआAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कछुआAudio),
      },
    ],
  },
  {
    letter: "इ",
    items: [
      {
        id: 4,
        title: "स्वर",
        letters: "इ",
        letter: "इ",
        word: "इमली",
        image: getAssetUrl(s3Assets.इमलीImg),
        audio: getAssetAudioUrl(s3Assets.इमलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.इमलीAudio),
      },
      {
        id: 5,
        title: "स्वर",
        letters: "इ",
        letter: "इ",
        word: "साइकिल",
        image: getAssetUrl(s3Assets.साइकिलImg),
        audio: getAssetAudioUrl(s3Assets.साइकिलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.साइकिलAudio),
      },
    ],
  },
  {
    letter: "ई",
    items: [
      {
        id: 6,
        title: "स्वर",
        letters: "ई",
        letter: "ई",
        word: "ईख",
        image: getAssetUrl(s3Assets.ईखImg),
        audio: getAssetAudioUrl(s3Assets.ईखAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ईखAudio),
      },
      {
        id: 7,
        title: "स्वर",
        letters: "ई",
        letter: "ई",
        word: "नई",
        image: getAssetUrl(s3Assets.नईImg),
        audio: getAssetAudioUrl(s3Assets.नईAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नईAudio),
      },
    ],
  },
  {
    letter: "उ",
    items: [
      {
        id: 8,
        title: "स्वर",
        letters: "उ",
        letter: "उ",
        word: "उड़",
        image: getAssetUrl(s3Assets.उड़Img),
        audio: getAssetAudioUrl(s3Assets.उड़Audio),
        singleAudio: getAssetAudioUrl(s3Assets.उड़Audio),
      },
    ],
  },
  {
    letter: "ऊ",
    items: [
      {
        id: 9,
        title: "स्वर",
        letters: "ऊ",
        letter: "ऊ",
        word: "ऊपर",
        image: getAssetUrl(s3Assets.ऊपरImg),
        audio: getAssetAudioUrl(s3Assets.ऊपरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऊपरAudio),
      },
    ],
  },
  {
    letter: "ऋ",
    items: [
      {
        id: 10,
        title: "स्वर",
        letters: "ऋ",
        letter: "ऋ",
        word: "ऋषि",
        image: getAssetUrl(s3Assets.ऋषिImg),
        audio: getAssetAudioUrl(s3Assets.ऋषिAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऋषिAudio),
      },
    ],
  },
  {
    letter: "ए",
    items: [
      {
        id: 11,
        title: "स्वर",
        letters: "ए",
        letter: "ए",
        word: "एड़ी",
        image: getAssetUrl(s3Assets.एड़ीImg),
        audio: getAssetAudioUrl(s3Assets.एड़ीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.एड़ीAudio),
      },
      {
        id: 12,
        title: "स्वर",
        letters: "ए",
        letter: "ए",
        word: "पढ़िए",
        image: getAssetUrl(s3Assets.पढ़िएImg),
        audio: getAssetAudioUrl(s3Assets.पढ़िएAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पढ़िएAudio),
      },
    ],
  },
  {
    letter: "ऐ",
    items: [
      {
        id: 13,
        title: "स्वर",
        letters: "ऐ",
        letter: "ऐ",
        word: "ऐनक",
        image: getAssetUrl(s3Assets.ऐनकImg),
        audio: getAssetAudioUrl(s3Assets.ऐनकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऐनकAudio),
      },
    ],
  },
  {
    letter: "ओ",
    items: [
      {
        id: 14,
        title: "स्वर",
        letters: "ओ",
        letter: "ओ",
        word: "ओखली",
        image: getAssetUrl(s3Assets.ओखलीImg),
        audio: getAssetAudioUrl(s3Assets.ओखलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ओखलीAudio),
      },
    ],
  },
  {
    letter: "औ",
    items: [
      {
        id: 15,
        title: "स्वर",
        letters: "औ",
        letter: "औ",
        word: "औरत",
        image: getAssetUrl(s3Assets.औरतImg),
        audio: getAssetAudioUrl(s3Assets.औरतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.औरतAudio),
      },
    ],
  },
  {
    letter: "अं",
    items: [
      {
        id: 16,
        title: "स्वर",
        letters: "अं",
        letter: "अं",
        word: "अंगूर",
        image: getAssetUrl(s3Assets.अंगूरImg),
        audio: getAssetAudioUrl(s3Assets.अंगूरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अंगूरAudio),
      },
    ],
  },
  {
    letter: "क",
    items: [
      {
        id: 17,
        title: "व्यंजन",
        letters: "क",
        letter: "क",
        word: "कबूतर",
        image: getAssetUrl(s3Assets.कबूतरImg),
        audio: getAssetAudioUrl(s3Assets.कबूतरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कबूतरAudio),
      },
      {
        id: 18,
        title: "व्यंजन",
        letters: "क",
        letter: "क",
        word: "बकरी",
        image: getAssetUrl(s3Assets.बकरीImg),
        audio: getAssetAudioUrl(s3Assets.बकरीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बकरीAudio),
      },
      {
        id: 19,
        title: "व्यंजन",
        letters: "क",
        letter: "क",
        word: "नमक",
        image: getAssetUrl(s3Assets.नमकImg),
        audio: getAssetAudioUrl(s3Assets.नमकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नमकAudio),
      },
    ],
  },
  {
    letter: "ख",
    items: [
      {
        id: 20,
        title: "व्यंजन",
        letters: "ख",
        letter: "ख",
        word: "खरगोश",
        image: getAssetUrl(s3Assets.खरगोशImg),
        audio: getAssetAudioUrl(s3Assets.खरगोशAudio),
        singleAudio: getAssetAudioUrl(s3Assets.खरगोशAudio),
      },
      {
        id: 21,
        title: "व्यंजन",
        letters: "ख",
        letter: "ख",
        word: "लेखन",
        image: getAssetUrl(s3Assets.लेखनImg),
        audio: getAssetAudioUrl(s3Assets.लेखनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लेखनAudio),
      },
      {
        id: 22,
        title: "व्यंजन",
        letters: "ख",
        letter: "ख",
        word: "भूख",
        image: getAssetUrl(s3Assets.भूखImg),
        audio: getAssetAudioUrl(s3Assets.भूखAudio),
        singleAudio: getAssetAudioUrl(s3Assets.भूखAudio),
      },
    ],
  },
  {
    letter: "ग",
    items: [
      {
        id: 23,
        title: "व्यंजन",
        letters: "ग",
        letter: "ग",
        word: "गधा",
        image: getAssetUrl(s3Assets.गधाImg),
        audio: getAssetAudioUrl(s3Assets.गधाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गधाAudio),
      },
      {
        id: 24,
        title: "व्यंजन",
        letters: "ग",
        letter: "ग",
        word: "नगर",
        image: getAssetUrl(s3Assets.नगरImg),
        audio: getAssetAudioUrl(s3Assets.नगरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नगरAudio),
      },
      {
        id: 25,
        title: "व्यंजन",
        letters: "ग",
        letter: "ग",
        word: "लोग",
        image: getAssetUrl(s3Assets.लोगImg),
        audio: getAssetAudioUrl(s3Assets.लोगAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लोगAudio),
      },
    ],
  },
  {
    letter: "घ",
    items: [
      {
        id: 26,
        title: "व्यंजन",
        letters: "घ",
        letter: "घ",
        word: "घर",
        image: getAssetUrl(s3Assets.घरImg),
        audio: getAssetAudioUrl(s3Assets.घरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.घरAudio),
      },
      {
        id: 27,
        title: "व्यंजन",
        letters: "घ",
        letter: "घ",
        word: "घुँघरू",
        image: getAssetUrl(s3Assets.घुँघरूImg),
        audio: getAssetAudioUrl(s3Assets.घुँघरूAudio),
        singleAudio: getAssetAudioUrl(s3Assets.घुँघरूAudio),
      },
      {
        id: 28,
        title: "व्यंजन",
        letters: "घ",
        letter: "घ",
        word: "बाघ",
        image: getAssetUrl(s3Assets.बाघImg),
        audio: getAssetAudioUrl(s3Assets.बाघAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बाघAudio),
      },
    ],
  },
  {
    letter: "च",
    items: [
      {
        id: 29,
        title: "व्यंजन",
        letters: "च",
        letter: "च",
        word: "चढ़",
        image: getAssetUrl(s3Assets.चढ़Img),
        audio: getAssetAudioUrl(s3Assets.चढ़Audio),
        singleAudio: getAssetAudioUrl(s3Assets.चढ़Audio),
      },
      {
        id: 30,
        title: "व्यंजन",
        letters: "च",
        letter: "च",
        word: "खिचड़ी",
        image: getAssetUrl(s3Assets.खिचड़ीImg),
        audio: getAssetAudioUrl(s3Assets.खिचड़ीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.खिचड़ीAudio),
      },
      {
        id: 31,
        title: "व्यंजन",
        letters: "च",
        letter: "च",
        word: "पाँच",
        image: getAssetUrl(s3Assets.पाँचImg),
        audio: getAssetAudioUrl(s3Assets.पाँचAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पाँचAudio),
      },
    ],
  },
  {
    letter: "छ",
    items: [
      {
        id: 32,
        title: "व्यंजन",
        letters: "छ",
        letter: "छ",
        word: "छत",
        image: getAssetUrl(s3Assets.छतImg),
        audio: getAssetAudioUrl(s3Assets.छतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.छतAudio),
      },
      {
        id: 33,
        title: "व्यंजन",
        letters: "छ",
        letter: "छ",
        word: "मछली",
        image: getAssetUrl(s3Assets.मछलीImg),
        audio: getAssetAudioUrl(s3Assets.मछलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मछलीAudio),
      },
      {
        id: 34,
        title: "व्यंजन",
        letters: "छ",
        letter: "छ",
        word: "पूछ",
        image: getAssetUrl(s3Assets.पूछImg),
        audio: getAssetAudioUrl(s3Assets.पूछAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पूछAudio),
      },
    ],
  },
  {
    letter: "ज",
    items: [
      {
        id: 35,
        title: "व्यंजन",
        letters: "ज",
        letter: "ज",
        word: "जग",
        image: getAssetUrl(s3Assets.जगImg),
        audio: getAssetAudioUrl(s3Assets.जगAudio),
        singleAudio: getAssetAudioUrl(s3Assets.जगAudio),
      },
      {
        id: 36,
        title: "व्यंजन",
        letters: "ज",
        letter: "ज",
        word: "गाजर",
        image: getAssetUrl(s3Assets.गाजरImg),
        audio: getAssetAudioUrl(s3Assets.गाजरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गाजरAudio),
      },
      {
        id: 37,
        title: "व्यंजन",
        letters: "ज",
        letter: "ज",
        word: "सूरज",
        image: getAssetUrl(s3Assets.सूरजImg),
        audio: getAssetAudioUrl(s3Assets.सूरजAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सूरजAudio),
      },
    ],
  },
  {
    letter: "झ",
    items: [
      {
        id: 38,
        title: "व्यंजन",
        letters: "झ",
        letter: "झ",
        word: "झण्डा",
        image: getAssetUrl(s3Assets.झण्डाImg),
        audio: getAssetAudioUrl(s3Assets.झण्डाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.झण्डाAudio),
      },
    ],
  },
  {
    letter: "ट",
    items: [
      {
        id: 39,
        title: "व्यंजन",
        letters: "ट",
        letter: "ट",
        word: "टमाटर",
        image: getAssetUrl(s3Assets.टमाटरImg),
        audio: getAssetAudioUrl(s3Assets.टमाटरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.टमाटरAudio),
      },
      {
        id: 40,
        title: "व्यंजन",
        letters: "ट",
        letter: "ट",
        word: "मटर",
        image: getAssetUrl(s3Assets.मटरImg),
        audio: getAssetAudioUrl(s3Assets.मटरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मटरAudio),
      },
      {
        id: 41,
        title: "व्यंजन",
        letters: "ट",
        letter: "ट",
        word: "ऊँट",
        image: getAssetUrl(s3Assets.ऊँटImg),
        audio: getAssetAudioUrl(s3Assets.ऊँटAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऊँटAudio),
      },
    ],
  },
  {
    letter: "ठ",
    items: [
      {
        id: 42,
        title: "व्यंजन",
        letters: "ठ",
        letter: "ठ",
        word: "ठठेरा",
        image: getAssetUrl(s3Assets.ठठेराImg),
        audio: getAssetAudioUrl(s3Assets.ठठेराAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ठठेराAudio),
      },
      {
        id: 43,
        title: "व्यंजन",
        letters: "ठ",
        letter: "ठ",
        word: "गुठली",
        image: getAssetUrl(s3Assets.गुठलीImg),
        audio: getAssetAudioUrl(s3Assets.गुठलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गुठलीAudio),
      },
      {
        id: 44,
        title: "व्यंजन",
        letters: "ठ",
        letter: "ठ",
        word: "आठ",
        image: getAssetUrl(s3Assets.आठImg),
        audio: getAssetAudioUrl(s3Assets.आठAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आठAudio),
      },
    ],
  },
  {
    letter: "ड",
    items: [
      {
        id: 45,
        title: "व्यंजन",
        letters: "ड",
        letter: "ड",
        word: "डमरू",
        image: getAssetUrl(s3Assets.डमरूImg),
        audio: getAssetAudioUrl(s3Assets.डमरूAudio),
        singleAudio: getAssetAudioUrl(s3Assets.डमरूAudio),
      },
      {
        id: 46,
        title: "व्यंजन",
        letters: "ड",
        letter: "ड",
        word: "पेड़",
        image: getAssetUrl(s3Assets.पेड़Img),
        audio: getAssetAudioUrl(s3Assets.पेड़Audio),
        singleAudio: getAssetAudioUrl(s3Assets.पेड़Audio),
      },
    ],
  },
  {
    letter: "ढ",
    items: [
      {
        id: 47,
        title: "व्यंजन",
        letters: "ढ",
        letter: "ढ",
        word: "ढक्कन",
        image: getAssetUrl(s3Assets.ढक्कनImg),
        audio: getAssetAudioUrl(s3Assets.ढक्कनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ढक्कनAudio),
      },
      {
        id: 48,
        title: "व्यंजन",
        letters: "ढ",
        letter: "ढ",
        word: "मेंढक",
        image: getAssetUrl(s3Assets.मेंढकImg),
        audio: getAssetAudioUrl(s3Assets.मेंढकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मेंढकAudio),
      },
    ],
  },
  {
    letter: "ण",
    items: [
      {
        id: 49,
        title: "व्यंजन",
        letters: "ण",
        letter: "ण",
        word: "लवण",
        image: getAssetUrl(s3Assets.लवणImg),
        audio: getAssetAudioUrl(s3Assets.लवणAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लवणAudio),
      },
    ],
  },
  {
    letter: "त",
    items: [
      {
        id: 50,
        title: "व्यंजन",
        letters: "त",
        letter: "त",
        word: "तट",
        image: getAssetUrl(s3Assets.तटImg),
        audio: getAssetAudioUrl(s3Assets.तटAudio),
        singleAudio: getAssetAudioUrl(s3Assets.तटAudio),
      },
      {
        id: 51,
        title: "व्यंजन",
        letters: "त",
        letter: "त",
        word: "सुतली",
        image: getAssetUrl(s3Assets.सुतलीImg),
        audio: getAssetAudioUrl(s3Assets.सुतलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सुतलीAudio),
      },
      {
        id: 52,
        title: "व्यंजन",
        letters: "त",
        letter: "त",
        word: "रात",
        image: getAssetUrl(s3Assets.रातImg),
        audio: getAssetAudioUrl(s3Assets.रातAudio),
        singleAudio: getAssetAudioUrl(s3Assets.रातAudio),
      },
    ],
  },
  {
    letter: "थ",
    items: [
      {
        id: 53,
        title: "व्यंजन",
        letters: "थ",
        letter: "थ",
        word: "थक",
        image: getAssetUrl(s3Assets.थकImg),
        audio: getAssetAudioUrl(s3Assets.थकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.थकAudio),
      },
      {
        id: 54,
        title: "व्यंजन",
        letters: "थ",
        letter: "थ",
        word: "हाथ",
        image: getAssetUrl(s3Assets.हाथImg),
        audio: getAssetAudioUrl(s3Assets.हाथAudio),
        singleAudio: getAssetAudioUrl(s3Assets.हाथAudio),
      },
    ],
  },
  {
    letter: "द",
    items: [
      {
        id: 55,
        title: "व्यंजन",
        letters: "द",
        letter: "द",
        word: "दरवाजा",
        image: getAssetUrl(s3Assets.दरवाजाImg),
        audio: getAssetAudioUrl(s3Assets.दरवाजाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.दरवाजाAudio),
      },
      {
        id: 56,
        title: "व्यंजन",
        letters: "द",
        letter: "द",
        word: "बादल",
        image: getAssetUrl(s3Assets.बादलImg),
        audio: getAssetAudioUrl(s3Assets.बादलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बादलAudio),
      },
      {
        id: 57,
        title: "व्यंजन",
        letters: "द",
        letter: "द",
        word: "आनंद",
        image: getAssetUrl(s3Assets.आनंदImg),
        audio: getAssetAudioUrl(s3Assets.आनंदAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आनंदAudio),
      },
    ],
  },
  {
    letter: "ध",
    items: [
      {
        id: 58,
        title: "व्यंजन",
        letters: "ध",
        letter: "ध",
        word: "धनुष",
        image: getAssetUrl(s3Assets.धनुषImg),
        audio: getAssetAudioUrl(s3Assets.धनुषAudio),
        singleAudio: getAssetAudioUrl(s3Assets.धनुषAudio),
      },
      {
        id: 59,
        title: "व्यंजन",
        letters: "ध",
        letter: "ध",
        word: "इधर",
        image: getAssetUrl(s3Assets.इधरImg),
        audio: getAssetAudioUrl(s3Assets.इधरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.इधरAudio),
      },
      {
        id: 60,
        title: "व्यंजन",
        letters: "ध",
        letter: "ध",
        word: "दूध",
        image: getAssetUrl(s3Assets.दूधImg),
        audio: getAssetAudioUrl(s3Assets.दूधAudio),
        singleAudio: getAssetAudioUrl(s3Assets.दूधAudio),
      },
    ],
  },
  {
    letter: "न",
    items: [
      {
        id: 61,
        title: "व्यंजन",
        letters: "न",
        letter: "न",
        word: "नल",
        image: getAssetUrl(s3Assets.नलImg),
        audio: getAssetAudioUrl(s3Assets.नलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नलAudio),
      },
      {
        id: 62,
        title: "व्यंजन",
        letters: "न",
        letter: "न",
        word: "जानवर",
        image: getAssetUrl(s3Assets.जानवरImg),
        audio: getAssetAudioUrl(s3Assets.जानवरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.जानवरAudio),
      },
      {
        id: 63,
        title: "व्यंजन",
        letters: "न",
        letter: "न",
        word: "बहन",
        image: getAssetUrl(s3Assets.बहनImg),
        audio: getAssetAudioUrl(s3Assets.बहनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बहनAudio),
      },
    ],
  },
  {
    letter: "प",
    items: [
      {
        id: 64,
        title: "व्यंजन",
        letters: "प",
        letter: "प",
        word: "पतंग",
        image: getAssetUrl(s3Assets.पतंगImg),
        audio: getAssetAudioUrl(s3Assets.पतंगAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पतंगAudio),
      },
      {
        id: 65,
        title: "व्यंजन",
        letters: "प",
        letter: "प",
        word: "कपड़े",
        image: getAssetUrl(s3Assets.कपड़ेImg),
        audio: getAssetAudioUrl(s3Assets.कपड़ेAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कपड़ेAudio),
      },
      {
        id: 66,
        title: "व्यंजन",
        letters: "प",
        letter: "प",
        word: "साँप",
        image: getAssetUrl(s3Assets.साँपImg),
        audio: getAssetAudioUrl(s3Assets.साँपAudio),
        singleAudio: getAssetAudioUrl(s3Assets.साँपAudio),
      },
    ],
  },
  {
    letter: "फ",
    items: [
      {
        id: 67,
        title: "व्यंजन",
        letters: "फ",
        letter: "फ",
        word: "फल",
        image: getAssetUrl(s3Assets.फलImg),
        audio: getAssetAudioUrl(s3Assets.फलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.फलAudio),
      },
      {
        id: 68,
        title: "व्यंजन",
        letters: "फ",
        letter: "फ",
        word: "बर्फ",
        image: getAssetUrl(s3Assets.बर्फImg),
        audio: getAssetAudioUrl(s3Assets.बर्फAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बर्फAudio),
      },
    ],
  },
  {
    letter: "ब",
    items: [
      {
        id: 69,
        title: "व्यंजन",
        letters: "ब",
        letter: "ब",
        word: "बतख",
        image: getAssetUrl(s3Assets.बतखImg),
        audio: getAssetAudioUrl(s3Assets.बतखAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बतखAudio),
      },
      {
        id: 70,
        title: "व्यंजन",
        letters: "ब",
        letter: "ब",
        word: "सुबह",
        image: getAssetUrl(s3Assets.सुबहImg),
        audio: getAssetAudioUrl(s3Assets.सुबहAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सुबहAudio),
      },
      {
        id: 71,
        title: "व्यंजन",
        letters: "ब",
        letter: "ब",
        word: "सेब",
        image: getAssetUrl(s3Assets.सेबImg),
        audio: getAssetAudioUrl(s3Assets.सेबAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सेबAudio),
      },
    ],
  },
  {
    letter: "भ",
    items: [
      {
        id: 72,
        title: "व्यंजन",
        letters: "भ",
        letter: "भ",
        word: "भय",
        image: getAssetUrl(s3Assets.भयImg),
        audio: getAssetAudioUrl(s3Assets.भयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.भयAudio),
      },
      {
        id: 73,
        title: "व्यंजन",
        letters: "भ",
        letter: "भ",
        word: "अनुभव",
        image: getAssetUrl(s3Assets.अनुभवImg),
        audio: getAssetAudioUrl(s3Assets.अनुभवAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अनुभवAudio),
      },
      {
        id: 74,
        title: "व्यंजन",
        letters: "भ",
        letter: "भ",
        word: "नभ",
        image: getAssetUrl(s3Assets.नभImg),
        audio: getAssetAudioUrl(s3Assets.नभAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नभAudio),
      },
    ],
  },
  {
    letter: "म",
    items: [
      {
        id: 75,
        title: "व्यंजन",
        letters: "म",
        letter: "म",
        word: "मछली",
        image: getAssetUrl(s3Assets.मछलीImg),
        audio: getAssetAudioUrl(s3Assets.मछलीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मछलीAudio),
      },
      {
        id: 76,
        title: "व्यंजन",
        letters: "म",
        letter: "म",
        word: "गमला",
        image: getAssetUrl(s3Assets.गमलाImg),
        audio: getAssetAudioUrl(s3Assets.गमलाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गमलाAudio),
      },
      {
        id: 77,
        title: "व्यंजन",
        letters: "म",
        letter: "म",
        word: "कदम",
        image: getAssetUrl(s3Assets.कदमImg),
        audio: getAssetAudioUrl(s3Assets.कदमAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कदमAudio),
      },
    ],
  },
  {
    letter: "य",
    items: [
      {
        id: 78,
        title: "व्यंजन",
        letters: "य",
        letter: "य",
        word: "यह",
        image: getAssetUrl(s3Assets.यहImg),
        audio: getAssetAudioUrl(s3Assets.यहAudio),
        singleAudio: getAssetAudioUrl(s3Assets.यहAudio),
      },
      {
        id: 79,
        title: "व्यंजन",
        letters: "य",
        letter: "य",
        word: "पायल",
        image: getAssetUrl(s3Assets.पायलImg),
        audio: getAssetAudioUrl(s3Assets.पायलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पायलAudio),
      },
      {
        id: 80,
        title: "व्यंजन",
        letters: "य",
        letter: "य",
        word: "गाय",
        image: getAssetUrl(s3Assets.गायImg),
        audio: getAssetAudioUrl(s3Assets.गायAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गायAudio),
      },
    ],
  },
  {
    letter: "र",
    items: [
      {
        id: 81,
        title: "व्यंजन",
        letters: "र",
        letter: "र",
        word: "रथ",
        image: getAssetUrl(s3Assets.रथImg),
        audio: getAssetAudioUrl(s3Assets.रथAudio),
        singleAudio: getAssetAudioUrl(s3Assets.रथAudio),
      },
      {
        id: 82,
        title: "व्यंजन",
        letters: "र",
        letter: "र",
        word: "भारत",
        image: getAssetUrl(s3Assets.भारतImg),
        audio: getAssetAudioUrl(s3Assets.भारतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.भारतAudio),
      },
      {
        id: 83,
        title: "व्यंजन",
        letters: "र",
        letter: "र",
        word: "चार",
        image: getAssetUrl(s3Assets.चारImg),
        audio: getAssetAudioUrl(s3Assets.चारAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चारAudio),
      },
    ],
  },
  {
    letter: "ल",
    items: [
      {
        id: 84,
        title: "व्यंजन",
        letters: "ल",
        letter: "ल",
        word: "लड़का",
        image: getAssetUrl(s3Assets.लड़काImg),
        audio: getAssetAudioUrl(s3Assets.लड़काAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लड़काAudio),
      },
      {
        id: 85,
        title: "व्यंजन",
        letters: "ल",
        letter: "ल",
        word: "चलना",
        image: getAssetUrl(s3Assets.चलनाImg),
        audio: getAssetAudioUrl(s3Assets.चलनाAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चलनाAudio),
      },
      {
        id: 86,
        title: "व्यंजन",
        letters: "ल",
        letter: "ल",
        word: "बाल",
        image: getAssetUrl(s3Assets.बालImg),
        audio: getAssetAudioUrl(s3Assets.बालAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बालAudio),
      },
    ],
  },
  {
    letter: "व",
    items: [
      {
        id: 87,
        title: "व्यंजन",
        letters: "व",
        letter: "व",
        word: "वन",
        image: getAssetUrl(s3Assets.वनImg),
        audio: getAssetAudioUrl(s3Assets.वनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.वनAudio),
      },
      {
        id: 88,
        title: "व्यंजन",
        letters: "व",
        letter: "व",
        word: "चावल",
        image: getAssetUrl(s3Assets.चावलImg),
        audio: getAssetAudioUrl(s3Assets.चावलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चावलAudio),
      },
      {
        id: 89,
        title: "व्यंजन",
        letters: "व",
        letter: "व",
        word: "नाव",
        image: getAssetUrl(s3Assets.नावImg),
        audio: getAssetAudioUrl(s3Assets.नावAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नावAudio),
      },
    ],
  },
  {
    letter: "श",
    items: [
      {
        id: 90,
        title: "व्यंजन",
        letters: "श",
        letter: "श",
        word: "शहर",
        image: getAssetUrl(s3Assets.शहरImg),
        audio: getAssetAudioUrl(s3Assets.शहरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.शहरAudio),
      },
      {
        id: 91,
        title: "व्यंजन",
        letters: "श",
        letter: "श",
        word: "बारिश",
        image: getAssetUrl(s3Assets.बारिशImg),
        audio: getAssetAudioUrl(s3Assets.बारिशAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बारिशAudio),
      },
    ],
  },
  {
    letter: "ष",
    items: [
      {
        id: 92,
        title: "व्यंजन",
        letters: "ष",
        letter: "ष",
        word: "षट्कोण",
        image: getAssetUrl(s3Assets.षट्‌कोणImg),
        audio: getAssetAudioUrl(s3Assets.षट्‌कोणAudio),
        singleAudio: getAssetAudioUrl(s3Assets.षट्‌कोणAudio),
      },
      {
        id: 93,
        title: "व्यंजन",
        letters: "ष",
        letter: "ष",
        word: "विषय",
        image: getAssetUrl(s3Assets.विषयImg),
        audio: getAssetAudioUrl(s3Assets.विषयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.विषयAudio),
      },
      {
        id: 94,
        title: "व्यंजन",
        letters: "ष",
        letter: "ष",
        word: "धनुष",
        image: getAssetUrl(s3Assets.धनुषImg),
        audio: getAssetAudioUrl(s3Assets.धनुषAudio),
        singleAudio: getAssetAudioUrl(s3Assets.धनुषAudio),
      },
    ],
  },
  {
    letter: "स",
    items: [
      {
        id: 95,
        title: "व्यंजन",
        letters: "स",
        letter: "स",
        word: "समय",
        image: getAssetUrl(s3Assets.समयImg),
        audio: getAssetAudioUrl(s3Assets.समयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.समयAudio),
      },
      {
        id: 96,
        title: "व्यंजन",
        letters: "स",
        letter: "स",
        word: "आसमान",
        image: getAssetUrl(s3Assets.आसमानImg),
        audio: getAssetAudioUrl(s3Assets.आसमानAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आसमानAudio),
      },
      {
        id: 97,
        title: "व्यंजन",
        letters: "स",
        letter: "स",
        word: "घास",
        image: getAssetUrl(s3Assets.घासImg),
        audio: getAssetAudioUrl(s3Assets.घासAudio),
        singleAudio: getAssetAudioUrl(s3Assets.घासAudio),
      },
    ],
  },
  {
    letter: "ह",
    items: [
      {
        id: 98,
        title: "व्यंजन",
        letters: "ह",
        letter: "ह",
        word: "हाथी",
        image: getAssetUrl(s3Assets.हाथीImg),
        audio: getAssetAudioUrl(s3Assets.हाथीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.हाथीAudio),
      },
      {
        id: 99,
        title: "व्यंजन",
        letters: "ह",
        letter: "ह",
        word: "बाहर",
        image: getAssetUrl(s3Assets.बाहरImg),
        audio: getAssetAudioUrl(s3Assets.बाहरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बाहरAudio),
      },
      {
        id: 100,
        title: "व्यंजन",
        letters: "ह",
        letter: "ह",
        word: "मुँह",
        image: getAssetUrl(s3Assets.मुँहImg),
        audio: getAssetAudioUrl(s3Assets.मुँहAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मुँहAudio),
      },
    ],
  },
  {
    letter: "क्ष",
    items: [
      {
        id: 101,
        title: "व्यंजन",
        letters: "क्ष",
        letter: "क्ष",
        word: "क्षत्रिय",
        image: getAssetUrl(s3Assets.क्षत्रियImg),
        audio: getAssetAudioUrl(s3Assets.क्षत्रियAudio),
        singleAudio: getAssetAudioUrl(s3Assets.क्षत्रियAudio),
      },
      {
        id: 102,
        title: "व्यंजन",
        letters: "क्ष",
        letter: "क्ष",
        word: "अक्षर",
        image: getAssetUrl(s3Assets.अक्षरImg),
        audio: getAssetAudioUrl(s3Assets.अक्षरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अक्षरAudio),
      },
    ],
  },
  {
    letter: "त्र",
    items: [
      {
        id: 103,
        title: "व्यंजन",
        letters: "त्र",
        letter: "त्र",
        word: "त्रिशूल",
        image: getAssetUrl(s3Assets.त्रिशूलImg),
        audio: getAssetAudioUrl(s3Assets.त्रिशूलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.त्रिशूलAudio),
      },
      {
        id: 104,
        title: "व्यंजन",
        letters: "त्र",
        letter: "त्र",
        word: "चित्र",
        image: getAssetUrl(s3Assets.चित्रImg),
        audio: getAssetAudioUrl(s3Assets.चित्रAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चित्रAudio),
      },
    ],
  },
  {
    letter: "ज्ञ",
    items: [
      {
        id: 105,
        title: "व्यंजन",
        letters: "ज्ञ",
        letter: "ज्ञ",
        word: "ज्ञानी",
        image: getAssetUrl(s3Assets.ज्ञानीImg),
        audio: getAssetAudioUrl(s3Assets.ज्ञानीAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ज्ञानीAudio),
      },
    ],
  },
];

export const dataTe = [
  {
    letter: "త",
    items: [
      {
        id: 1,
        title: "Letter",
        letter: "త",
        word: "తబల",
        image: getAssetUrl(s3Assets.తబలImg),
        audio: getAssetAudioUrl(s3Assets.తబలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తబలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.తతబలAudio),
      },
      {
        id: 2,
        title: "Letter",
        letter: "త",
        word: "జాతర",
        image: getAssetUrl(s3Assets.జతరImg),
        audio: getAssetAudioUrl(s3Assets.జతరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.జతరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.తజాతరAudio),
      },
      {
        id: 3,
        title: "Letter",
        letter: "త",
        word: "ఈత",
        image: getAssetUrl(s3Assets.ఈతImg),
        audio: getAssetAudioUrl(s3Assets.ఈతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఈతAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.తఈతAudio),
      },
    ],
  },
  {
    letter: "బ",
    items: [
      {
        id: 4,
        title: "Letter",
        letter: "బ",
        word: "బంతి",
        image: getAssetUrl(s3Assets.బతImg),
        audio: getAssetAudioUrl(s3Assets.బతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బతAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.బబంతిAudio),
      },
      {
        id: 5,
        title: "Letter",
        letter: "బ",
        word: "తబల",
        image: getAssetUrl(s3Assets.తబల2Img),
        audio: getAssetAudioUrl(s3Assets.తబల2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.తబల2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.బతబలAudio),
      },
      {
        id: 6,
        title: "Letter",
        letter: "బ",
        word: "లబలబ",
        image: getAssetUrl(s3Assets.లబలబImg),
        audio: getAssetAudioUrl(s3Assets.లబలబAudio),
        singleAudio: getAssetAudioUrl(s3Assets.లబలబAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.బలబలబAudio),
      },
    ],
  },
  {
    letter: "ల",
    items: [
      {
        id: 7,
        title: "Letter",
        letter: "ల",
        word: "లత",
        image: getAssetUrl(s3Assets.లతImg),
        audio: getAssetAudioUrl(s3Assets.లతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.లతAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.లలతAudio),
      },
      {
        id: 8,
        title: "Letter",
        letter: "ల",
        word: "బలపం",
        image: getAssetUrl(s3Assets.బలపImg),
        audio: getAssetAudioUrl(s3Assets.బలపAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బలపAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.లబలపంAudio),
      },
      {
        id: 9,
        title: "Letter",
        letter: "ల",
        word: "వెల",
        image: getAssetUrl(s3Assets.వలImg),
        audio: getAssetAudioUrl(s3Assets.వలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.లవెలAudio),
      },
    ],
  },
  {
    letter: "క",
    items: [
      {
        id: 10,
        title: "Letter",
        letter: "క",
        word: "కంజర",
        image: getAssetUrl(s3Assets.కజరImg),
        audio: getAssetAudioUrl(s3Assets.కజరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కజరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.కకంజరAudio),
      },
      {
        id: 11,
        title: "Letter",
        letter: "క",
        word: "ఆకలి",
        image: getAssetUrl(s3Assets.ఆకలImg),
        audio: getAssetAudioUrl(s3Assets.ఆకలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఆకలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.కఆకలిAudio),
      },
      {
        id: 12,
        title: "Letter",
        letter: "క",
        word: "చిలుక",
        image: getAssetUrl(s3Assets.చలకImg),
        audio: getAssetAudioUrl(s3Assets.చలకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చలకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.కచిలుకAudio),
      },
    ],
  },
  {
    letter: "జ",
    items: [
      {
        id: 13,
        title: "Letter",
        letter: "జ",
        word: "జడ",
        image: getAssetUrl(s3Assets.జడImg),
        audio: getAssetAudioUrl(s3Assets.జడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.జడAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.జజడAudio),
      },
      {
        id: 14,
        title: "Letter",
        letter: "జ",
        word: "కంజర",
        image: getAssetUrl(s3Assets.కజర2Img),
        audio: getAssetAudioUrl(s3Assets.కజర2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.కజర2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.జకంజరAudio),
      },
      {
        id: 15,
        title: "Letter",
        letter: "జ",
        word: "జలజ",
        image: getAssetUrl(s3Assets.జలజImg),
        audio: getAssetAudioUrl(s3Assets.జలజAudio),
        singleAudio: getAssetAudioUrl(s3Assets.జలజAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.జజలజAudio),
      },
    ],
  },
  {
    letter: "ర",
    items: [
      {
        id: 16,
        title: "Letter",
        letter: "ర",
        word: "రవి",
        image: getAssetUrl(s3Assets.రవImg),
        audio: getAssetAudioUrl(s3Assets.రవAudio),
        singleAudio: getAssetAudioUrl(s3Assets.రవAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.రరవిAudio),
      },
      {
        id: 17,
        title: "Letter",
        letter: "ర",
        word: "గిరక",
        image: getAssetUrl(s3Assets.గరకImg),
        audio: getAssetAudioUrl(s3Assets.గరకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గరకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.రగిరకAudio),
      },
      {
        id: 18,
        title: "Letter",
        letter: "ర",
        word: "చీర",
        image: getAssetUrl(s3Assets.చరImg),
        audio: getAssetAudioUrl(s3Assets.చరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.రచీరAudio),
      },
    ],
  },
  {
    letter: "ఆ",
    items: [
      {
        id: 19,
        title: "Letter",
        letter: "ఆ",
        word: "ఆట",
        image: getAssetUrl(s3Assets.ఆటImg),
        audio: getAssetAudioUrl(s3Assets.ఆటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఆటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఆఆటAudio),
      },
    ],
  },
  {
    letter: "ట",
    items: [
      {
        id: 20,
        title: "Letter",
        letter: "ట",
        word: "టమాట",
        image: getAssetUrl(s3Assets.టమటImg),
        audio: getAssetAudioUrl(s3Assets.టమటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.టమటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.టటమాటAudio),
      },
      {
        id: 21,
        title: "Letter",
        letter: "ట",
        word: "నాటకం",
        image: getAssetUrl(s3Assets.నటకImg),
        audio: getAssetAudioUrl(s3Assets.నటకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.నటకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.టనాటకంAudio),
      },
      {
        id: 22,
        title: "Letter",
        letter: "ట",
        word: "తోట",
        image: getAssetUrl(s3Assets.తటImg),
        audio: getAssetAudioUrl(s3Assets.తటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.టతోటAudio),
      },
    ],
  },
  {
    letter: "ఉ",
    items: [
      {
        id: 23,
        title: "Letter",
        letter: "ఉ",
        word: "ఉంగరం",
        image: getAssetUrl(s3Assets.ఉగరImg),
        audio: getAssetAudioUrl(s3Assets.ఉగరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉగరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఉఉంగరంAudio),
      },
    ],
  },
  {
    letter: "గ",
    items: [
      {
        id: 24,
        title: "Letter",
        letter: "గ",
        word: "గద",
        image: getAssetUrl(s3Assets.గదImg),
        audio: getAssetAudioUrl(s3Assets.గదAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గదAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.గగదAudio),
      },
      {
        id: 25,
        title: "Letter",
        letter: "గ",
        word: "ఉంగరం",
        image: getAssetUrl(s3Assets.ఉగర2Img),
        audio: getAssetAudioUrl(s3Assets.ఉగర2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉగర2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.గఉంగరంAudio),
      },
      {
        id: 26,
        title: "Letter",
        letter: "గ",
        word: "పండుగ",
        image: getAssetUrl(s3Assets.పడగImg),
        audio: getAssetAudioUrl(s3Assets.పడగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పడగAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.గపండుగAudio),
      },
    ],
  },
  {
    letter: "శ",
    items: [
      {
        id: 27,
        title: "Letter",
        letter: "శ",
        word: "శనగ",
        image: getAssetUrl(s3Assets.శనగImg),
        audio: getAssetAudioUrl(s3Assets.శనగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.శనగAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.శశనగAudio),
      },
      {
        id: 28,
        title: "Letter",
        letter: "శ",
        word: "దశమి",
        image: getAssetUrl(s3Assets.దశమImg),
        audio: getAssetAudioUrl(s3Assets.దశమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దశమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.శదశమిAudio),
      },
      {
        id: 29,
        title: "Letter",
        letter: "శ",
        word: "దిశ",
        image: getAssetUrl(s3Assets.దశImg),
        audio: getAssetAudioUrl(s3Assets.దశAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దశAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.శదిశAudio),
      },
    ],
  },
  {
    letter: "అ",
    items: [
      {
        id: 30,
        title: "Letter",
        letter: "అ",
        word: "అనప",
        image: getAssetUrl(s3Assets.అనపImg),
        audio: getAssetAudioUrl(s3Assets.అనపAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అనపAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.అఅనపAudio),
      },
    ],
  },
  {
    letter: "ప",
    items: [
      {
        id: 31,
        title: "Letter",
        letter: "ప",
        word: "పంట",
        image: getAssetUrl(s3Assets.పటImg),
        audio: getAssetAudioUrl(s3Assets.పటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.పపంటAudio),
      },
      {
        id: 32,
        title: "Letter",
        letter: "ప",
        word: "చేపలు",
        image: getAssetUrl(s3Assets.చపలImg),
        audio: getAssetAudioUrl(s3Assets.చపలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చపలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.పచేపలుAudio),
      },
      {
        id: 33,
        title: "Letter",
        letter: "ప",
        word: "పాప",
        image: getAssetUrl(s3Assets.పపImg),
        audio: getAssetAudioUrl(s3Assets.పపAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పపAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.పపాపAudio),
      },
    ],
  },
  {
    letter: "స",
    items: [
      {
        id: 34,
        title: "Letter",
        letter: "స",
        word: "సవరం",
        image: getAssetUrl(s3Assets.సవరImg),
        audio: getAssetAudioUrl(s3Assets.సవరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.సవరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ససవరంAudio),
      },
      {
        id: 35,
        title: "Letter",
        letter: "స",
        word: "దసరా",
        image: getAssetUrl(s3Assets.దసరImg),
        audio: getAssetAudioUrl(s3Assets.దసరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దసరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.సదసరాAudio),
      },
      {
        id: 36,
        title: "Letter",
        letter: "స",
        word: "పనస",
        image: getAssetUrl(s3Assets.పనసImg),
        audio: getAssetAudioUrl(s3Assets.పనసAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పనసAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.సపనసAudio),
      },
    ],
  },
  {
    letter: "వ",
    items: [
      {
        id: 37,
        title: "Letter",
        letter: "వ",
        word: "వల",
        image: getAssetUrl(s3Assets.వల2Img),
        audio: getAssetAudioUrl(s3Assets.వల2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.వల2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.వవలAudio),
      },
      {
        id: 38,
        title: "Letter",
        letter: "వ",
        word: "లవణం",
        image: getAssetUrl(s3Assets.లవణImg),
        audio: getAssetAudioUrl(s3Assets.లవణAudio),
        singleAudio: getAssetAudioUrl(s3Assets.లవణAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.వలవణంAudio),
      },
      {
        id: 39,
        title: "Letter",
        letter: "వ",
        word: "పడవ",
        image: getAssetUrl(s3Assets.పడవImg),
        audio: getAssetAudioUrl(s3Assets.పడవAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పడవAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.వపడవAudio),
      },
    ],
  },
  {
    letter: "ఊ",
    items: [
      {
        id: 40,
        title: "Letter",
        letter: "ఊ",
        word: "ఊయల",
        image: getAssetUrl(s3Assets.ఊయలImg),
        audio: getAssetAudioUrl(s3Assets.ఊయలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఊయలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఊఊయలAudio),
      },
    ],
  },
  {
    letter: "డ",
    items: [
      {
        id: 41,
        title: "Letter",
        letter: "డ",
        word: "డబ్బా",
        image: getAssetUrl(s3Assets.డబబImg),
        audio: getAssetAudioUrl(s3Assets.డబబAudio),
        singleAudio: getAssetAudioUrl(s3Assets.డబబAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.డడబ్బాAudio),
      },
      {
        id: 42,
        title: "Letter",
        letter: "డ",
        word: "అడవి",
        image: getAssetUrl(s3Assets.అడవImg),
        audio: getAssetAudioUrl(s3Assets.అడవAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అడవAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.డఅడవిAudio),
      },
      {
        id: 43,
        title: "Letter",
        letter: "డ",
        word: "బండ",
        image: getAssetUrl(s3Assets.బడImg),
        audio: getAssetAudioUrl(s3Assets.బడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బడAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.డబండAudio),
      },
    ],
  },
  {
    letter: "ద",
    items: [
      {
        id: 44,
        title: "Letter",
        letter: "ద",
        word: "దండ",
        image: getAssetUrl(s3Assets.దడImg),
        audio: getAssetAudioUrl(s3Assets.దడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దడAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.దదండAudio),
      },
      {
        id: 45,
        title: "Letter",
        letter: "ద",
        word: "ఉదయం",
        image: getAssetUrl(s3Assets.ఉదయImg),
        audio: getAssetAudioUrl(s3Assets.ఉదయAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉదయAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.దఉదయంAudio),
      },
      {
        id: 46,
        title: "Letter",
        letter: "ద",
        word: "కింద",
        image: getAssetUrl(s3Assets.కదImg),
        audio: getAssetAudioUrl(s3Assets.కదAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కదAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.దకిందAudio),
      },
    ],
  },
  {
    letter: "ఈ",
    items: [
      {
        id: 47,
        title: "Letter",
        letter: "ఈ",
        word: "ఈత",
        image: getAssetUrl(s3Assets.ఈత2Img),
        audio: getAssetAudioUrl(s3Assets.ఈత2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ఈత2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఈఈతAudio),
      },
    ],
  },
  {
    letter: "మ",
    items: [
      {
        id: 48,
        title: "Letter",
        letter: "మ",
        word: "మర",
        image: getAssetUrl(s3Assets.మరImg),
        audio: getAssetAudioUrl(s3Assets.మరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.మరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.మమరAudio),
      },
      {
        id: 49,
        title: "Letter",
        letter: "మ",
        word: "నెమలి",
        image: getAssetUrl(s3Assets.నమలImg),
        audio: getAssetAudioUrl(s3Assets.నమలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.నమలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.మనెమలిAudio),
      },
      {
        id: 50,
        title: "Letter",
        letter: "మ",
        word: "చీమ",
        image: getAssetUrl(s3Assets.చమImg),
        audio: getAssetAudioUrl(s3Assets.చమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.మచీమAudio),
      },
    ],
  },
  {
    letter: "చ",
    items: [
      {
        id: 51,
        title: "Letter",
        letter: "చ",
        word: "చరకా",
        image: getAssetUrl(s3Assets.చరకImg),
        audio: getAssetAudioUrl(s3Assets.చరకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చరకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.చచరకాAudio),
      },
      {
        id: 52,
        title: "Letter",
        letter: "చ",
        word: "రచన",
        image: getAssetUrl(s3Assets.రచనImg),
        audio: getAssetAudioUrl(s3Assets.రచనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.రచనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.చరచనAudio),
      },
      {
        id: 53,
        title: "Letter",
        letter: "చ",
        word: "కిచకిచ",
        image: getAssetUrl(s3Assets.కచకచImg),
        audio: getAssetAudioUrl(s3Assets.కచకచAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కచకచAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.చకిచకిచAudio),
      },
    ],
  },
  {
    letter: "ఒ",
    items: [
      {
        id: 54,
        title: "Letter",
        letter: "ఒ",
        word: "ఒక",
        image: getAssetUrl(s3Assets.ఒకImg),
        audio: getAssetAudioUrl(s3Assets.ఒకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఒకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఒఒకAudio),
      },
    ],
  },
  {
    letter: "ఓ",
    items: [
      {
        id: 55,
        title: "Letter",
        letter: "ఓ",
        word: "ఓడ",
        image: getAssetUrl(s3Assets.ఓడImg),
        audio: getAssetAudioUrl(s3Assets.ఓడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఓడAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఓఓడAudio),
      },
    ],
  },
  {
    letter: "ఔ",
    items: [
      {
        id: 56,
        title: "Letter",
        letter: "ఔ",
        word: "ఔటు",
        image: getAssetUrl(s3Assets.ఔటImg),
        audio: getAssetAudioUrl(s3Assets.ఔటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఔటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఔఔటుAudio),
      },
    ],
  },
  {
    letter: "య",
    items: [
      {
        id: 57,
        title: "Letter",
        letter: "య",
        word: "యద",
        image: getAssetUrl(s3Assets.యదImg),
        audio: getAssetAudioUrl(s3Assets.యదAudio),
        singleAudio: getAssetAudioUrl(s3Assets.యదAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.యయదAudio),
      },
      {
        id: 58,
        title: "Letter",
        letter: "య",
        word: "కాయలు",
        image: getAssetUrl(s3Assets.కయలImg),
        audio: getAssetAudioUrl(s3Assets.కయలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కయలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.యకాయలుAudio),
      },
      {
        id: 59,
        title: "Letter",
        letter: "య",
        word: "వంకాయ",
        image: getAssetUrl(s3Assets.వకయImg),
        audio: getAssetAudioUrl(s3Assets.వకయAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వకయAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.యవంకాయAudio),
      },
    ],
  },
  {
    letter: "ఇ",
    items: [
      {
        id: 60,
        title: "Letter",
        letter: "ఇ",
        word: "ఇటుక",
        image: getAssetUrl(s3Assets.ఇటకImg),
        audio: getAssetAudioUrl(s3Assets.ఇటకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఇటకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఇఇటుకAudio),
      },
    ],
  },
  {
    letter: "ఎ",
    items: [
      {
        id: 61,
        title: "Letter",
        letter: "ఎ",
        word: "ఎలుక",
        image: getAssetUrl(s3Assets.ఎలకImg),
        audio: getAssetAudioUrl(s3Assets.ఎలకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఎలకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఎఎలుకAudio),
      },
    ],
  },
  {
    letter: "ఏ",
    items: [
      {
        id: 62,
        title: "Letter",
        letter: "ఏ",
        word: "ఏనుగు",
        image: getAssetUrl(s3Assets.ఏనగImg),
        audio: getAssetAudioUrl(s3Assets.ఏనగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఏనగAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఏఏనుగుAudio),
      },
    ],
  },
  {
    letter: "ఐ",
    items: [
      {
        id: 63,
        title: "Letter",
        letter: "ఐ",
        word: "ఐదు",
        image: getAssetUrl(s3Assets.ఐదImg),
        audio: getAssetAudioUrl(s3Assets.ఐదAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఐదAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఐఐదుAudio),
      },
    ],
  },
  {
    letter: "ణ",
    items: [
      {
        id: 64,
        title: "Letter",
        letter: "ణ",
        word: "గణపతి",
        image: getAssetUrl(s3Assets.గణపతImg),
        audio: getAssetAudioUrl(s3Assets.గణపతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గణపతAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ణగణపతిAudio),
      },
      {
        id: 65,
        title: "Letter",
        letter: "ణ",
        word: "వీణ",
        image: getAssetUrl(s3Assets.వణImg),
        audio: getAssetAudioUrl(s3Assets.వణAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వణAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ణవీణAudio),
      },
    ],
  },
  {
    letter: "ళ",
    items: [
      {
        id: 66,
        title: "Letter",
        letter: "ళ",
        word: "తాళం",
        image: getAssetUrl(s3Assets.తళImg),
        audio: getAssetAudioUrl(s3Assets.తళAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తళAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ళతాళంAudio),
      },
      {
        id: 67,
        title: "Letter",
        letter: "ళ",
        word: "కళ",
        image: getAssetUrl(s3Assets.కళImg),
        audio: getAssetAudioUrl(s3Assets.కళAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కళAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ళకళAudio),
      },
    ],
  },
  {
    letter: "హ",
    items: [
      {
        id: 68,
        title: "Letter",
        letter: "హ",
        word: "హంస",
        image: getAssetUrl(s3Assets.హసImg),
        audio: getAssetAudioUrl(s3Assets.హసAudio),
        singleAudio: getAssetAudioUrl(s3Assets.హసAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.హహంసAudio),
      },
      {
        id: 69,
        title: "Letter",
        letter: "హ",
        word: "వాహనం",
        image: getAssetUrl(s3Assets.వహనImg),
        audio: getAssetAudioUrl(s3Assets.వహనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వహనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.హవాహనంAudio),
      },
      {
        id: 70,
        title: "Letter",
        letter: "హ",
        word: "గుహ",
        image: getAssetUrl(s3Assets.గహImg),
        audio: getAssetAudioUrl(s3Assets.గహAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గహAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.హగుహAudio),
      },
    ],
  },
  {
    letter: "ఖ",
    items: [
      {
        id: 71,
        title: "Letter",
        letter: "ఖ",
        word: "ఖగం",
        image: getAssetUrl(s3Assets.ఖగImg),
        audio: getAssetAudioUrl(s3Assets.ఖగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఖగAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఖఖగంAudio),
      },
      {
        id: 72,
        title: "Letter",
        letter: "ఖ",
        word: "ముఖము",
        image: getAssetUrl(s3Assets.మఖమImg),
        audio: getAssetAudioUrl(s3Assets.మఖమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.మఖమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఖముఖముAudio),
      },
      {
        id: 73,
        title: "Letter",
        letter: "ఖ",
        word: "శంఖం",
        image: getAssetUrl(s3Assets.శఖImg),
        audio: getAssetAudioUrl(s3Assets.శఖAudio),
        singleAudio: getAssetAudioUrl(s3Assets.శఖAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఖశంఖంAudio),
      },
    ],
  },
  {
    letter: "ఛ",
    items: [
      {
        id: 74,
        title: "Letter",
        letter: "ఛ",
        word: "ఛత్రము",
        image: getAssetUrl(s3Assets.ఛతరమImg),
        audio: getAssetAudioUrl(s3Assets.ఛతరమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఛతరమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఛఛత్రముAudio),
      },
      {
        id: 75,
        title: "Letter",
        letter: "ఛ",
        word: "పింఛం",
        image: getAssetUrl(s3Assets.పఛImg),
        audio: getAssetAudioUrl(s3Assets.పఛAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పఛAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఛపింఛంAudio),
      },
    ],
  },
  {
    letter: "ఠ",
    items: [
      {
        id: 76,
        title: "Letter",
        letter: "ఠ",
        word: "పాఠశాల",
        image: getAssetUrl(s3Assets.పఠశలImg),
        audio: getAssetAudioUrl(s3Assets.పఠశలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పఠశలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఠపాఠశాలAudio),
      },
      {
        id: 77,
        title: "Letter",
        letter: "ఠ",
        word: "పాఠం",
        image: getAssetUrl(s3Assets.పఠImg),
        audio: getAssetAudioUrl(s3Assets.పఠAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పఠAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఠపాఠంAudio),
      },
    ],
  },
  {
    letter: "ఢ",
    items: [
      {
        id: 78,
        title: "Letter",
        letter: "ఢ",
        word: "ఢమఢమ",
        image: getAssetUrl(s3Assets.ఢమఢమImg),
        audio: getAssetAudioUrl(s3Assets.ఢమఢమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఢమఢమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఢఢమఢమAudio),
      },
    ],
  },
  {
    letter: "ఘ",
    items: [
      {
        id: 79,
        title: "Letter",
        letter: "ఘ",
        word: "ఘటం",
        image: getAssetUrl(s3Assets.ఘటImg),
        audio: getAssetAudioUrl(s3Assets.ఘటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఘటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఘఘటంAudio),
      },
      {
        id: 80,
        title: "Letter",
        letter: "ఘ",
        word: "సంఘటన",
        image: getAssetUrl(s3Assets.సఘటనImg),
        audio: getAssetAudioUrl(s3Assets.సఘటనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.సఘటనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఘసంఘటనAudio),
      },
      {
        id: 81,
        title: "Letter",
        letter: "ఘ",
        word: "మేఘం",
        image: getAssetUrl(s3Assets.మఘImg),
        audio: getAssetAudioUrl(s3Assets.మఘAudio),
        singleAudio: getAssetAudioUrl(s3Assets.మఘAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఘమేఘంAudio),
      },
    ],
  },
  {
    letter: "ఝ",
    items: [
      {
        id: 82,
        title: "Letter",
        letter: "ఝ",
        word: "ఝషం",
        image: getAssetUrl(s3Assets.ఝషImg),
        audio: getAssetAudioUrl(s3Assets.ఝషAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఝషAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఝఝషంAudio),
      },
    ],
  },
  {
    letter: "ఋ",
    items: [
      {
        id: 83,
        title: "Letter",
        letter: "ఋ",
        word: "ఋషి",
        image: getAssetUrl(s3Assets.ఋషImg),
        audio: getAssetAudioUrl(s3Assets.ఋషAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఋషAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఋఋషిAudio),
      },
    ],
  },
  {
    letter: "ష",
    items: [
      {
        id: 84,
        title: "Letter",
        letter: "ష",
        word: "షరా",
        image: getAssetUrl(s3Assets.షరImg),
        audio: getAssetAudioUrl(s3Assets.షరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.షరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.షషరాAudio),
      },
      {
        id: 85,
        title: "Letter",
        letter: "ష",
        word: "విషము",
        image: getAssetUrl(s3Assets.వషమImg),
        audio: getAssetAudioUrl(s3Assets.వషమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వషమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.షవిషముAudio),
      },
      {
        id: 86,
        title: "Letter",
        letter: "ష",
        word: "ఉష",
        image: getAssetUrl(s3Assets.ఉషImg),
        audio: getAssetAudioUrl(s3Assets.ఉషAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉషAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.షఉషAudio),
      },
    ],
  },
  {
    letter: "థ",
    items: [
      {
        id: 87,
        title: "Letter",
        letter: "థ",
        word: "థర్మోస్",
        image: getAssetUrl(s3Assets.థరమసImg),
        audio: getAssetAudioUrl(s3Assets.థరమసAudio),
        singleAudio: getAssetAudioUrl(s3Assets.థరమసAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.థథర్మోస్Audio),
      },
      {
        id: 88,
        title: "Letter",
        letter: "థ",
        word: "రథము",
        image: getAssetUrl(s3Assets.రథమImg),
        audio: getAssetAudioUrl(s3Assets.రథమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.రథమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.థరథముAudio),
      },
      {
        id: 89,
        title: "Letter",
        letter: "థ",
        word: "కథ",
        image: getAssetUrl(s3Assets.కథImg),
        audio: getAssetAudioUrl(s3Assets.కథAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కథAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.థకథAudio),
      },
    ],
  },
  {
    letter: "ధ",
    items: [
      {
        id: 90,
        title: "Letter",
        letter: "ధ",
        word: "ధనం",
        image: getAssetUrl(s3Assets.ధనImg),
        audio: getAssetAudioUrl(s3Assets.ధనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ధనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ధధనంAudio),
      },
      {
        id: 91,
        title: "Letter",
        letter: "ధ",
        word: "క్రోధము",
        image: getAssetUrl(s3Assets.కరధమImg),
        audio: getAssetAudioUrl(s3Assets.కరధమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కరధమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ధక్రోధముAudio),
      },
      {
        id: 92,
        title: "Letter",
        letter: "ధ",
        word: "బాధ",
        image: getAssetUrl(s3Assets.బధImg),
        audio: getAssetAudioUrl(s3Assets.బధAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బధAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ధబాధAudio),
      },
    ],
  },
  {
    letter: "ఫ",
    items: [
      {
        id: 93,
        title: "Letter",
        letter: "ఫ",
        word: "ఫలము",
        image: getAssetUrl(s3Assets.ఫలమImg),
        audio: getAssetAudioUrl(s3Assets.ఫలమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఫలమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఫఫలముAudio),
      },
      {
        id: 94,
        title: "Letter",
        letter: "ఫ",
        word: "టెలిఫోను",
        image: getAssetUrl(s3Assets.టలఫనImg),
        audio: getAssetAudioUrl(s3Assets.టలఫనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.టలఫనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఫటెలిఫోనుAudio),
      },
      {
        id: 95,
        title: "Letter",
        letter: "ఫ",
        word: "సీతాఫలం",
        image: getAssetUrl(s3Assets.సతఫలImg),
        audio: getAssetAudioUrl(s3Assets.సతఫలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.సతఫలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఫసీతాఫలంAudio),
      },
    ],
  },
  {
    letter: "భ",
    items: [
      {
        id: 96,
        title: "Letter",
        letter: "భ",
        word: "భజన",
        image: getAssetUrl(s3Assets.భజనImg),
        audio: getAssetAudioUrl(s3Assets.భజనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.భజనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.భభజనAudio),
      },
      {
        id: 97,
        title: "Letter",
        letter: "భ",
        word: "సభ",
        image: getAssetUrl(s3Assets.సభImg),
        audio: getAssetAudioUrl(s3Assets.సభAudio),
        singleAudio: getAssetAudioUrl(s3Assets.సభAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.భసభAudio),
      },
    ],
  },
  {
    letter: "క్ష",
    items: [
      {
        id: 98,
        title: "Letter",
        letter: "క్ష",
        word: "క్షత్రియుడు",
        image: getAssetUrl(s3Assets.కషతరయడImg),
        audio: getAssetAudioUrl(s3Assets.కషతరయడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కషతరయడAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.క్షక్షత్రియుడుAudio),
      },
      {
        id: 99,
        title: "Letter",
        letter: "క్ష",
        word: "అక్షరం",
        image: getAssetUrl(s3Assets.అకషరImg),
        audio: getAssetAudioUrl(s3Assets.అకషరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అకషరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.క్షఅక్షరంAudio),
      },
      {
        id: 100,
        title: "Letter",
        letter: "క్ష",
        word: "పరీక్ష",
        image: getAssetUrl(s3Assets.పరకషImg),
        audio: getAssetAudioUrl(s3Assets.పరకషAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పరకషAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.క్షపరీక్షAudio),
      },
    ],
  },
  {
    letter: "అం",
    items: [
      {
        id: 101,
        title: "Letter",
        letter: "అం",
        word: "అంగడి",
        image: getAssetUrl(s3Assets.అగడImg),
        audio: getAssetAudioUrl(s3Assets.అగడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అగడAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.అంఅంగడిAudio),
      },
    ],
  },
  {
    letter: "ఙ",
    items: [
      {
        id: 102,
        title: "Letter",
        letter: "ఙ",
        word: "ఙ",
        image: getAssetUrl(s3Assets.ఙImg),
        audio: getAssetAudioUrl(s3Assets.ఙAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఙAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఙఙAudio),
      },
    ],
  },
  {
    letter: "ఞ",
    items: [
      {
        id: 103,
        title: "Letter",
        letter: "ఞ",
        word: "ఞ",
        image: getAssetUrl(s3Assets.ఞImg),
        audio: getAssetAudioUrl(s3Assets.ఞAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఞAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఞఞAudio),
      },
    ],
  },
  {
    letter: "అః",
    items: [
      {
        id: 104,
        title: "Letter",
        letter: "అః",
        word: "అః",
        image: getAssetUrl(s3Assets.అImg),
        audio: getAssetAudioUrl(s3Assets.అAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.అఃఅఃAudio),
      },
    ],
  },
  {
    letter: "ఱ",
    items: [
      {
        id: 105,
        title: "Letter",
        letter: "ఱ",
        word: "ఱంపం",
        image: getAssetUrl(s3Assets.ఱపImg),
        audio: getAssetAudioUrl(s3Assets.ఱపAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఱపAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఱఱంపంAudio),
      },
    ],
  },
  {
    letter: "న",
    items: [
      {
        id: 106,
        title: "Letter",
        letter: "న",
        word: "నగ",
        image: getAssetUrl(s3Assets.నగImg),
        audio: getAssetAudioUrl(s3Assets.నగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.నగSingleAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ననగAudio),
      },
    ],
  },
  {
    letter: "ౠ",
    items: [
      {
        id: 107,
        title: "Letter",
        letter: "ౠ",
        word: "ౠక",
        image: getAssetUrl(s3Assets.ౠకImg),
        audio: getAssetAudioUrl(s3Assets.ౠకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ౠకSingleAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ౠౠకAudio),
      },
    ],
  },
];

const LetterTrain = ({
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
  customLetters, // Array of letters to filter (e.g., ["a", "m", "s", "t"])
  //isNextButtonCalled,
  //setIsNextButtonCalled,
}) => {
  steps = 1;
  const lang = getLocalData("lang");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  let data;

  const letterss = dataTe.flatMap((obj) =>
    obj.items.map((item) => item.letter)
  );

  const chunkSize = 5;
  const result = [];

  for (let i = 0; i < letterss.length; i += chunkSize) {
    result.push(letterss.slice(i, i + chunkSize));
  }

  console.log("===============================", result);

  if (lang === "en") {
    data = dataEn;
  } else if (lang === "hi") {
    data = dataHi;
  } else if (lang === "te") {
    data = dataTe;
  } else if (lang === "kn") {
    data = dataKn;
  } else {
    data = dataEn; // fallback (English)
  }

  // Filter data based on customLetters if provided
  if (
    customLetters &&
    Array.isArray(customLetters) &&
    customLetters.length > 0
  ) {
    // Normalize customLetters to uppercase for comparison
    const normalizedCustomLetters = customLetters
      .map((letter) =>
        letter && typeof letter === "string" ? letter.toUpperCase() : ""
      )
      .filter(Boolean);
    data = data.filter((letterObj) => {
      // Check if the letter or syllable (uppercase) matches any of the custom letters
      const letterToCheck = letterObj.letter || letterObj.syllable;
      if (!letterToCheck || typeof letterToCheck !== "string") {
        return false;
      }
      return normalizedCustomLetters.includes(letterToCheck.toUpperCase());
    });
  }

  const generatePlaylist = (data) => {
    const playlist = [];

    for (let i = 0; i < data.length; i += 5) {
      const block = data.slice(i, i + 5);

      block.forEach((letterObj) => {
        // Check if items exists and is an array
        if (letterObj.items && Array.isArray(letterObj.items)) {
          letterObj.items.forEach((item) => {
            playlist.push({
              type: "UI1",
              item,
              letter: letterObj.letter || letterObj.syllable || "",
            });
          });
        }
      });

      block.forEach((letterObj) => {
        // Check if items exists, is an array, and has length > 0
        if (
          letterObj.items &&
          Array.isArray(letterObj.items) &&
          letterObj.items.length > 0
        ) {
          const firstItem = letterObj.items[0];
          playlist.push({
            type: "UI2",
            item: firstItem,
            letter: letterObj.letter || letterObj.syllable || "",
          });
        }
      });
    }

    return playlist;
  };

  const playlist = generatePlaylist(data);
  console.log("LetterTrain playlist generated:", {
    playlistLength: playlist.length,
    customLetters,
    playlistItems: playlist.map((item, idx) => ({
      index: idx,
      type: item.type,
      letter: item.letter,
      word: item.item?.word,
    })),
  });

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
  const [open, setOpen] = useState(false);

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

    console.log("LetterTrain handleNextWord:", {
      currentIndex,
      playlistLength: playlist.length,
      isLastItem: currentIndex >= playlist.length - 1,
      customLetters,
      hasHandleNext: !!handleNext,
    });

    // Check if we've reached the end of the playlist
    if (currentIndex < playlist.length - 1) {
      // Move to next item in playlist
      setCurrentIndex((i) => i + 1);
    } else {
      // Reached end of playlist - complete the LetterTrain step
      console.log(
        "LetterTrain completed - all customLetters done. Calling handleNext."
      );
      // If handleNext prop is provided (e.g., from F1), use it instead of default navigation
      if (handleNext && typeof handleNext === "function") {
        handleNext();
      } else {
        // Default R0 behavior
        setLocalData("rStepZero", 1);
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        console.log("finished r0");
      }
      // Don't continue - exit here
      return;
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

    const totalLetters = data && Array.isArray(data) ? data.length : 0;
    const completedLetters =
      letters && Array.isArray(letters) ? letters.length : 0;

    // Calculate total items in playlist
    const totalItemsInPlaylist =
      playlist && Array.isArray(playlist) ? playlist.length : 0;

    const completionPercentage =
      totalLetters > 0
        ? Math.round((completedLetters / totalLetters) * 100)
        : 0;
    const UI1 = () => {
      //console.log("ui1", item, current);

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

      let TOTAL_ITEMS = 0;

      // Use actual playlist length if customLetters is provided, otherwise use hardcoded values
      if (
        customLetters &&
        Array.isArray(customLetters) &&
        customLetters.length > 0 &&
        playlist &&
        Array.isArray(playlist)
      ) {
        TOTAL_ITEMS = playlist.length;
      } else {
        if (lang === "en") {
          TOTAL_ITEMS = 101;
        } else if (lang === "hi") {
          TOTAL_ITEMS = 151;
        } else if (lang === "te") {
          TOTAL_ITEMS = 146;
        } else if (lang === "kn") {
          TOTAL_ITEMS = 142;
        } else {
          TOTAL_ITEMS = 100; // fallback default
        }
      }

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
            height: { xs: "auto", sm: "60vh" },
            minHeight: { xs: "50vh", sm: "60vh" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              width: { xs: "95%", sm: "min(95%, 1024px)" },
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
              paddingTop: { xs: 2, sm: 3, md: 4 },
              minHeight: { xs: "45vh", sm: "50vh", md: "50vh" },
            }}
          >
            {/* Progress container - right side */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: 8, sm: 10 },
                right: { xs: 10, sm: 20 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: { xs: "80px", sm: "100px", md: "120px" },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  border: "2px solid #1CB0F6",
                  borderRadius: "50%",
                  padding: { xs: "4px 8px", sm: "5px 10px", md: "6px 12px" },
                  fontFamily: "Quicksand",
                  fontWeight: 700,
                  fontSize: { xs: "11px", sm: "12px", md: "14px" },
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
                  height: { xs: "14px", sm: "16px", md: "18px" },
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
                top: { xs: 12, sm: 14, md: 16 },
                left: { xs: 8, sm: 12, md: 16 },
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: { xs: "16px", sm: "20px", md: "24px" },
                padding: { xs: "8px 12px", sm: "10px 14px", md: "14px 18px" },
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "2px solid #FF9800",
                zIndex: 10,
                backdropFilter: "blur(5px)",
                minWidth: { xs: "100px", sm: "120px", md: "140px" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Quicksand",
                  fontWeight: 700,
                  fontSize: { xs: "14px", sm: "16px", md: "20px" },
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
                  maxWidth: isMobile ? "280px" : isTablet ? "380px" : "480px",
                  maxHeight: isMobile ? "50px" : isTablet ? "60px" : "70px",
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
                          minWidth: { xs: 40, sm: 50, md: 60 },
                          minHeight: { xs: 40, sm: 50, md: 60 },
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
                            fontSize: isMobile
                              ? "20px"
                              : isTablet
                              ? "24px"
                              : "28px",
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
                width: { xs: "90%", sm: "80%", md: "75%" },
                maxWidth: { xs: 280, sm: 340, md: 380 },
                height: "auto",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #1CB0F6",
                borderRadius: { xs: "10px", sm: "12px", md: "14px" },
                backgroundColor: "#F1FAFE",
                mb: 0.5,
                padding: { xs: "3px", sm: "3.5px", md: "4px" },
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
                {item.letters &&
                Array.isArray(item.letters) &&
                item.letters.length > 1 ? (
                  <>
                    <span style={{ color: "#C93128" }}>{item.letters[0]}</span>
                    <span style={{ color: "#1c2752" }}>{item.letters[1]}</span>
                    {item.letters.slice(2)}
                  </>
                ) : (
                  <span style={{ color: "red" }}>
                    {item.letters || item.letter || item.syllable || ""}
                  </span>
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                mt: 3,
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
                {renderHighlightedWord(item.word, item.syllable || item.letter)}
              </span>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                zIndex: 10,
                justifyContent: "center",
                alignItems: "flex-end",
                mb: 1,
                mt: 1,
              }}
            >
              <IconButton
                onClick={handleBackNavigation}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "#1CB0F6",
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 6px 14px rgba(28,176,246,0.35)",
                  "&:hover": { bgcolor: "#1AA3E3" },
                  transform: "translateY(-4px)",
                }}
              >
                <ArrowLeft size={22} />
              </IconButton>

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
                  transform: "translateY(-1px)",
                }}
              >
                <RotateCcw size={22} />
              </IconButton>

              {/* ➡️ Next button */}
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

      let TOTAL_ITEMS = 0;
      // Use actual playlist length if customLetters is provided, otherwise use hardcoded values
      if (
        customLetters &&
        Array.isArray(customLetters) &&
        customLetters.length > 0
      ) {
        TOTAL_ITEMS = playlist.length;
      } else {
        if (lang === "en") TOTAL_ITEMS = 101;
        else if (lang === "kn") TOTAL_ITEMS = 142;
        else if (lang === "hi") TOTAL_ITEMS = 151;
        else if (lang === "te") TOTAL_ITEMS = 146;
        else TOTAL_ITEMS = 100; // fallback
      }
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
                  {renderHighlightedWord(
                    item.word,
                    item.syllable || item.letter
                  )}
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
        <img
          src={hintimg}
          alt="hint"
          style={{
            width: "50px",
            height: "50px",
            position: "absolute",
            top: "20px",
            left: "0px",
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={() => setOpen(true)}
        />

        {/* Modal */}
        {open && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "90vh",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div
              style={{
                position: "relative",
                background: "#000",
                padding: "10px",
                borderRadius: "12px",
                maxWidth: "90%",
                width: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

              {/* YouTube Video */}
              <iframe
                width="100%"
                height="340"
                src={`https://www.youtube.com/embed/gfl-lcNz1QE?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: "8px" }}
              ></iframe>
            </div>
          </div>
        )}
        {renderUI()}
      </Box>
    </MainLayout>
  );
};

export default LetterTrain;
