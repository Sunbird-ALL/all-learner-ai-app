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

import ballonImg from "../assets/ballon.svg";
import bearImg from "../assets/bear.svg";
import boyImg from "../assets/boy.svg";
import deleteImg from "../assets/delete.svg";
import eraseImg from "../assets/erase.svg";
import listenImgBox from "../assets/listenimgbox.svg";
import boyballonflyImg from "../assets/boyballonfly.svg";
import wordbanaoImg from "../assets/wordbanao.svg";
import dottimg from "../assets/dottimg.svg";
import nextImg from "../assets/nextImg.svg";
import closebuttonImg from "../assets/closebtn.svg";
import { callTelemetryDiscovery } from "../utils/apiUtil";
import audiowaveImg from "../assets/audiowave.svg";

const theme = createTheme();

const vowelsData = {
  hi: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं", "अः"],

  ta: [
    "அ",
    "ஆ",
    "இ",
    "ஈ",
    "உ",
    "ஊ",
    "எ",
    "ஏ",
    "ஐ",
    "ஒ",
    "ஓ",
    "ஔ",
    "ஃ",
    "ஂ",
    "஁",
  ],

  te: [
    "అ",
    "ఆ",
    "ఇ",
    "ఈ",
    "ఉ",
    "ఊ",
    "ఋ",
    "ఎ",
    "ఏ",
    "ఐ",
    "ఒ",
    "ఓ",
    "ఔ",
    "అం",
    "అః",
  ],

  kn: [
    "ಅ",
    "ಆ",
    "ಇ",
    "ಈ",
    "ಉ",
    "ಊ",
    "ಋ",
    "ಎ",
    "ಏ",
    "ಐ",
    "ಒ",
    "ಓ",
    "ಔ",
    "ಅಂ",
    "ಅಃ",
  ],
};

const barakhadiCharts = {
  hi: {
    क: [
      "क",
      "का",
      "कि",
      "की",
      "कु",
      "कू",
      "कृ",
      "के",
      "कै",
      "को",
      "कौ",
      "कं",
      "कः",
    ],
    ख: [
      "ख",
      "खा",
      "खि",
      "खी",
      "खु",
      "खू",
      "खृ",
      "खे",
      "खै",
      "खो",
      "खौ",
      "खं",
      "खः",
    ],
    ग: [
      "ग",
      "गा",
      "गि",
      "गी",
      "गु",
      "गू",
      "गृ",
      "गे",
      "गै",
      "गो",
      "गौ",
      "गं",
      "गः",
    ],
    घ: [
      "घ",
      "घा",
      "घि",
      "घी",
      "घु",
      "घू",
      "घृ",
      "घे",
      "घै",
      "घो",
      "घौ",
      "घं",
      "घः",
    ],
    ङ: [
      "ङ",
      "ङा",
      "ङि",
      "ङी",
      "ङु",
      "ङू",
      "ङृ",
      "ङे",
      "ङै",
      "ङो",
      "ङौ",
      "ङं",
      "ङः",
    ],

    च: [
      "च",
      "चा",
      "चि",
      "ची",
      "चु",
      "चू",
      "चृ",
      "चे",
      "चै",
      "चो",
      "चौ",
      "चं",
      "चः",
    ],
    छ: [
      "छ",
      "छा",
      "छि",
      "छी",
      "छु",
      "छू",
      "छृ",
      "छे",
      "छै",
      "छो",
      "छौ",
      "छं",
      "छः",
    ],
    ज: [
      "ज",
      "जा",
      "जि",
      "जी",
      "जु",
      "जू",
      "जृ",
      "जे",
      "जै",
      "जो",
      "जौ",
      "जं",
      "जः",
    ],
    झ: [
      "झ",
      "झा",
      "झि",
      "झी",
      "झु",
      "झू",
      "झृ",
      "झे",
      "झै",
      "झो",
      "झौ",
      "झं",
      "झः",
    ],
    ञ: [
      "ञ",
      "ञा",
      "ञि",
      "ञी",
      "ञु",
      "ञू",
      "ञृ",
      "ञे",
      "ञै",
      "ञो",
      "ञौ",
      "ञं",
      "ञः",
    ],

    ट: [
      "ट",
      "टा",
      "टि",
      "टी",
      "टु",
      "टू",
      "टृ",
      "टे",
      "टै",
      "टो",
      "टौ",
      "टं",
      "टः",
    ],
    ठ: [
      "ठ",
      "ठा",
      "ठि",
      "ठी",
      "ठु",
      "ठू",
      "ठृ",
      "ठे",
      "ठै",
      "ठो",
      "ठौ",
      "ठं",
      "ठः",
    ],
    ड: [
      "ड",
      "डा",
      "डि",
      "डी",
      "डु",
      "डू",
      "डृ",
      "डे",
      "डै",
      "डो",
      "डौ",
      "डं",
      "डः",
    ],
    ढ: [
      "ढ",
      "ढा",
      "ढि",
      "ढी",
      "ढु",
      "ढू",
      "ढृ",
      "ढे",
      "ढै",
      "ढो",
      "ढौ",
      "ढं",
      "ढः",
    ],
    ण: [
      "ण",
      "णा",
      "णि",
      "णी",
      "णु",
      "णू",
      "णृ",
      "णे",
      "णै",
      "णो",
      "णौ",
      "णं",
      "णः",
    ],

    त: [
      "त",
      "ता",
      "ति",
      "ती",
      "तु",
      "तू",
      "तृ",
      "ते",
      "तै",
      "तो",
      "तौ",
      "तं",
      "तः",
    ],
    थ: [
      "थ",
      "था",
      "थि",
      "थी",
      "थु",
      "थू",
      "थृ",
      "थे",
      "थै",
      "थो",
      "थौ",
      "थं",
      "थः",
    ],
    द: [
      "द",
      "दा",
      "दि",
      "दी",
      "दु",
      "दू",
      "दृ",
      "दे",
      "दै",
      "दो",
      "दौ",
      "दं",
      "दः",
    ],
    ध: [
      "ध",
      "धा",
      "धि",
      "धी",
      "धु",
      "धू",
      "धृ",
      "धे",
      "धै",
      "धो",
      "धौ",
      "धं",
      "धः",
    ],
    न: [
      "न",
      "ना",
      "नि",
      "नी",
      "नु",
      "नू",
      "नृ",
      "ने",
      "नै",
      "नो",
      "नौ",
      "नं",
      "नः",
    ],

    प: [
      "प",
      "पा",
      "पि",
      "पी",
      "पु",
      "पू",
      "पृ",
      "पे",
      "पै",
      "पो",
      "पौ",
      "पं",
      "पः",
    ],
    फ: [
      "फ",
      "फा",
      "फि",
      "फी",
      "फु",
      "फू",
      "फृ",
      "फे",
      "फै",
      "फो",
      "फौ",
      "फं",
      "फः",
    ],
    ब: [
      "ब",
      "बा",
      "बि",
      "बी",
      "बु",
      "बू",
      "बृ",
      "बे",
      "बै",
      "बो",
      "बौ",
      "बं",
      "बः",
    ],
    भ: [
      "भ",
      "भा",
      "भि",
      "भी",
      "भु",
      "भू",
      "भृ",
      "भे",
      "भै",
      "भो",
      "भौ",
      "भं",
      "भः",
    ],
    म: [
      "म",
      "मा",
      "मि",
      "मी",
      "मु",
      "मू",
      "मृ",
      "मे",
      "मै",
      "मो",
      "मौ",
      "मं",
      "मः",
    ],

    य: [
      "य",
      "या",
      "यि",
      "यी",
      "यु",
      "यू",
      "यृ",
      "ये",
      "यै",
      "यो",
      "यौ",
      "यं",
      "यः",
    ],
    र: [
      "र",
      "रा",
      "रि",
      "री",
      "रु",
      "रू",
      "रृ",
      "रे",
      "रै",
      "रो",
      "रौ",
      "रं",
      "रः",
    ],
    ल: [
      "ल",
      "ला",
      "लि",
      "ली",
      "लु",
      "लू",
      "लृ",
      "ले",
      "लै",
      "लो",
      "लौ",
      "लं",
      "लः",
    ],
    व: [
      "व",
      "वा",
      "वि",
      "वी",
      "वु",
      "वू",
      "वृ",
      "वे",
      "वै",
      "वो",
      "वौ",
      "वं",
      "वः",
    ],

    श: [
      "श",
      "शा",
      "शि",
      "शी",
      "शु",
      "शू",
      "शृ",
      "शे",
      "शै",
      "शो",
      "शौ",
      "शं",
      "शः",
    ],
    ष: [
      "ष",
      "षा",
      "षि",
      "षी",
      "षु",
      "षू",
      "षृ",
      "षे",
      "ষৈ",
      "ষো",
      "ষৌ",
      "ষং",
      "ষঃ",
    ],
    स: [
      "स",
      "सा",
      "सि",
      "सी",
      "सु",
      "सू",
      "सृ",
      "से",
      "सै",
      "सो",
      "सौ",
      "सं",
      "सः",
    ],
    ह: [
      "ह",
      "हा",
      "हि",
      "ही",
      "हु",
      "हू",
      "हृ",
      "हे",
      "है",
      "हो",
      "हौ",
      "हं",
      "हः",
    ],
  },

  ta: {
    க: [
      "க",
      "கா",
      "கி",
      "கீ",
      "கு",
      "கூ",
      "கெ",
      "கே",
      "கை",
      "கொ",
      "கோ",
      "கௌ",
      "கஂ",
      "கஃ",
      "க஁",
    ],
    ங: [
      "ங",
      "ஙா",
      "ஙி",
      "ஙீ",
      "ஙு",
      "ஙூ",
      "ஙெ",
      "ஙே",
      "ஙை",
      "ஙொ",
      "ஙோ",
      "ஙௌ",
      "ஙஂ",
      "ஙஃ",
      "ங஁",
    ],
    ச: [
      "ச",
      "சா",
      "சி",
      "சீ",
      "சு",
      "சூ",
      "செ",
      "சே",
      "சை",
      "சொ",
      "சோ",
      "சௌ",
      "சஂ",
      "சஃ",
      "ச஁",
    ],
    ஞ: [
      "ஞ",
      "ஞா",
      "ஞி",
      "ஞீ",
      "ஞு",
      "ஞூ",
      "ஞெ",
      "ஞே",
      "ஞை",
      "ஞொ",
      "ஞோ",
      "ஞௌ",
      "ஞஂ",
      "ஞஃ",
      "ஞ஁",
    ],
    ட: [
      "ட",
      "டா",
      "டி",
      "டீ",
      "டு",
      "டூ",
      "டெ",
      "டே",
      "டை",
      "டொ",
      "டோ",
      "டௌ",
      "டஂ",
      "டஃ",
      "ட஁",
    ],
    ண: [
      "ண",
      "ணா",
      "ணி",
      "ணீ",
      "ணு",
      "ணூ",
      "ணெ",
      "ணே",
      "ணை",
      "ணொ",
      "ணோ",
      "ணௌ",
      "ணஂ",
      "ணஃ",
      "ண஁",
    ],
    த: [
      "த",
      "தா",
      "தி",
      "தீ",
      "து",
      "தூ",
      "தெ",
      "தே",
      "தை",
      "தொ",
      "தோ",
      "தௌ",
      "தஂ",
      "தஃ",
      "த஁",
    ],
    ந: [
      "ந",
      "நா",
      "நி",
      "நீ",
      "நு",
      "நூ",
      "நெ",
      "நே",
      "நை",
      "நொ",
      "நோ",
      "நௌ",
      "நஂ",
      "நஃ",
      "ந஁",
    ],
    ப: [
      "ப",
      "பா",
      "பி",
      "பீ",
      "பு",
      "பூ",
      "பெ",
      "பே",
      "பை",
      "பொ",
      "போ",
      "பௌ",
      "பஂ",
      "பஃ",
      "ப஁",
    ],
    ம: [
      "ம",
      "மா",
      "மி",
      "மீ",
      "மு",
      "மூ",
      "மெ",
      "மே",
      "மை",
      "மொ",
      "மோ",
      "மௌ",
      "மஂ",
      "மஃ",
      "ம஁",
    ],
    ய: [
      "ய",
      "யா",
      "யி",
      "யீ",
      "யு",
      "யூ",
      "யெ",
      "யே",
      "யை",
      "யொ",
      "யோ",
      "யௌ",
      "யஂ",
      "யஃ",
      "ய஁",
    ],
    ர: [
      "ர",
      "ரா",
      "ரி",
      "ரீ",
      "ரு",
      "ரூ",
      "ரெ",
      "ரே",
      "ரை",
      "ரொ",
      "ரோ",
      "ரௌ",
      "ரஂ",
      "ரஃ",
      "ர஁",
    ],
    ல: [
      "ல",
      "லா",
      "லி",
      "லீ",
      "லு",
      "லூ",
      "லெ",
      "லே",
      "லை",
      "லொ",
      "லோ",
      "லௌ",
      "லஂ",
      "லஃ",
      "ல஁",
    ],
    வ: [
      "வ",
      "வா",
      "வி",
      "வீ",
      "வு",
      "வூ",
      "வெ",
      "வே",
      "வை",
      "வொ",
      "வோ",
      "வௌ",
      "வஂ",
      "வஃ",
      "வ஁",
    ],
    ழ: [
      "ழ",
      "ழா",
      "ழி",
      "ழீ",
      "ழு",
      "ழூ",
      "ழெ",
      "ழே",
      "ழை",
      "ழொ",
      "ழோ",
      "ழௌ",
      "ழஂ",
      "ழஃ",
      "ழ஁",
    ],
    ள: [
      "ள",
      "ளா",
      "ளி",
      "ளீ",
      "ளு",
      "ளூ",
      "ளெ",
      "ளே",
      "ளை",
      "ளொ",
      "ளோ",
      "ளௌ",
      "ளஂ",
      "ளஃ",
      "ள஁",
    ],
    ற: [
      "ற",
      "றா",
      "றி",
      "றீ",
      "று",
      "றூ",
      "றெ",
      "றே",
      "றை",
      "றொ",
      "றோ",
      "றௌ",
      "றஂ",
      "றஃ",
      "ற஁",
    ],
    ன: [
      "ன",
      "னா",
      "னி",
      "னீ",
      "னு",
      "னூ",
      "னெ",
      "னே",
      "னை",
      "னொ",
      "னோ",
      "னௌ",
      "னஂ",
      "னஃ",
      "ன஁",
    ],
  },

  te: {
    క: [
      "క",
      "కా",
      "కి",
      "కీ",
      "కు",
      "కూ",
      "కృ",
      "కె",
      "కే",
      "కై",
      "కొ",
      "కో",
      "కౌ",
      "కం",
      "కః",
    ],
    ఖ: [
      "ఖ",
      "ఖా",
      "ఖి",
      "ఖీ",
      "ఖు",
      "ఖూ",
      "ఖృ",
      "ఖె",
      "ఖే",
      "ఖై",
      "ఖొ",
      "ఖో",
      "ఖౌ",
      "ఖం",
      "ఖః",
    ],
    గ: [
      "గ",
      "గా",
      "గి",
      "గీ",
      "గు",
      "గూ",
      "గృ",
      "గె",
      "గే",
      "గై",
      "గొ",
      "గో",
      "గౌ",
      "గం",
      "గః",
    ],
    ఘ: [
      "ఘ",
      "ఘా",
      "ఘి",
      "ఘీ",
      "ఘు",
      "ఘూ",
      "ఘృ",
      "ఘె",
      "ఘే",
      "ఘై",
      "ఘొ",
      "ఘో",
      "ఘౌ",
      "ఘం",
      "ఘః",
    ],
    ఙ: [
      "ఙ",
      "ఙా",
      "ఙి",
      "ఙీ",
      "ఙు",
      "ఙూ",
      "ఙృ",
      "ఙె",
      "ఙే",
      "ఙై",
      "ఙొ",
      "ఙో",
      "ఙౌ",
      "ఙం",
      "ఙః",
    ],
    చ: [
      "చ",
      "చా",
      "చి",
      "చీ",
      "చు",
      "చూ",
      "చృ",
      "చె",
      "చే",
      "చై",
      "చొ",
      "చో",
      "చౌ",
      "చం",
      "చః",
    ],
    ఛ: [
      "ఛ",
      "ఛా",
      "ఛి",
      "ఛీ",
      "ఛు",
      "ఛూ",
      "ఛృ",
      "ఛె",
      "ఛే",
      "ఛై",
      "ఛొ",
      "ఛో",
      "ఛౌ",
      "ఛం",
      "ఛః",
    ],
    జ: [
      "జ",
      "జా",
      "జి",
      "జీ",
      "జు",
      "జూ",
      "జృ",
      "జె",
      "జే",
      "జై",
      "జొ",
      "జో",
      "జౌ",
      "జం",
      "జః",
    ],
    ఝ: [
      "ఝ",
      "ఝా",
      "ఝి",
      "ఝీ",
      "ఝు",
      "ఝూ",
      "ఝృ",
      "ఝె",
      "ఝే",
      "ఝై",
      "ఝొ",
      "ఝో",
      "ఝౌ",
      "ఝం",
      "ఝః",
    ],
    ఞ: [
      "ఞ",
      "ఞా",
      "ఞి",
      "ఞీ",
      "ఞు",
      "ఞూ",
      "ఞృ",
      "ఞె",
      "ఞే",
      "ఞై",
      "ఞొ",
      "ఞో",
      "ఞౌ",
      "ఞం",
      "ఞః",
    ],
    ట: [
      "ట",
      "టా",
      "టి",
      "టీ",
      "టు",
      "టూ",
      "టృ",
      "టె",
      "టే",
      "టై",
      "టొ",
      "టో",
      "టౌ",
      "టం",
      "టః",
    ],
    ఠ: [
      "ఠ",
      "ఠా",
      "ఠి",
      "ఠీ",
      "ఠు",
      "ఠూ",
      "ఠృ",
      "ఠె",
      "ఠే",
      "ఠై",
      "ఠొ",
      "ఠో",
      "ఠౌ",
      "ఠం",
      "ఠః",
    ],
    డ: [
      "డ",
      "డా",
      "డి",
      "డీ",
      "డు",
      "డూ",
      "డృ",
      "డె",
      "డే",
      "డై",
      "డొ",
      "డో",
      "డౌ",
      "డం",
      "డః",
    ],
    ఢ: [
      "ఢ",
      "ఢా",
      "ఢి",
      "ఢీ",
      "ఢు",
      "ఢూ",
      "ఢృ",
      "ఢె",
      "ఢే",
      "ఢై",
      "ఢొ",
      "ఢో",
      "ఢౌ",
      "ఢం",
      "ఢః",
    ],
    ణ: [
      "ణ",
      "ణా",
      "ణి",
      "ణీ",
      "ణు",
      "ణూ",
      "ణృ",
      "ణె",
      "ణే",
      "ణై",
      "ణొ",
      "ణో",
      "ణౌ",
      "ణం",
      "ణః",
    ],
    త: [
      "త",
      "తా",
      "తి",
      "తీ",
      "తు",
      "తూ",
      "తృ",
      "తె",
      "తే",
      "తై",
      "తొ",
      "తో",
      "తౌ",
      "తం",
      "తః",
    ],
    థ: [
      "థ",
      "థా",
      "థి",
      "థీ",
      "థు",
      "థూ",
      "థృ",
      "థె",
      "థే",
      "థై",
      "థొ",
      "థో",
      "థౌ",
      "థం",
      "థః",
    ],
    ద: [
      "ద",
      "దా",
      "ది",
      "దీ",
      "దు",
      "దూ",
      "దృ",
      "దె",
      "దే",
      "దై",
      "దొ",
      "దో",
      "దౌ",
      "దం",
      "దః",
    ],
    ధ: [
      "ధ",
      "ధా",
      "ధి",
      "ధీ",
      "ధు",
      "ధూ",
      "ధృ",
      "ధె",
      "ధే",
      "ధై",
      "ధొ",
      "ధో",
      "ధౌ",
      "ధం",
      "ధః",
    ],
    న: [
      "న",
      "నా",
      "ని",
      "నీ",
      "ను",
      "నూ",
      "నృ",
      "నె",
      "నే",
      "నై",
      "నొ",
      "నో",
      "నౌ",
      "నం",
      "నః",
    ],
    ప: [
      "ప",
      "పా",
      "పి",
      "పీ",
      "పు",
      "పూ",
      "పృ",
      "పె",
      "పే",
      "పై",
      "పొ",
      "పో",
      "పౌ",
      "పం",
      "పః",
    ],
    ఫ: [
      "ఫ",
      "ఫా",
      "ఫి",
      "ఫీ",
      "ఫు",
      "ఫూ",
      "ఫృ",
      "ఫె",
      "ఫే",
      "ఫై",
      "ఫొ",
      "ఫో",
      "ఫౌ",
      "ఫం",
      "ఫః",
    ],
    బ: [
      "బ",
      "బా",
      "బి",
      "బీ",
      "బు",
      "బూ",
      "బృ",
      "బె",
      "బే",
      "బై",
      "బొ",
      "బో",
      "బౌ",
      "బం",
      "బః",
    ],
    భ: [
      "భ",
      "భా",
      "భి",
      "భీ",
      "భు",
      "భూ",
      "భృ",
      "భె",
      "భే",
      "భై",
      "భొ",
      "భో",
      "భౌ",
      "భం",
      "భః",
    ],
    మ: [
      "మ",
      "మా",
      "మి",
      "మీ",
      "ము",
      "మూ",
      "మృ",
      "మె",
      "మే",
      "మై",
      "మొ",
      "మో",
      "మౌ",
      "మం",
      "మః",
    ],
    య: [
      "య",
      "యా",
      "యి",
      "యీ",
      "యు",
      "యూ",
      "యృ",
      "యె",
      "యే",
      "యై",
      "యొ",
      "యో",
      "యౌ",
      "యం",
      "యః",
    ],
    ర: [
      "ర",
      "రా",
      "రి",
      "రీ",
      "రు",
      "రూ",
      "రృ",
      "రె",
      "రే",
      "రై",
      "రొ",
      "రో",
      "రౌ",
      "రం",
      "రః",
    ],
    ల: [
      "ల",
      "లా",
      "లి",
      "లీ",
      "లు",
      "లూ",
      "లృ",
      "లె",
      "లే",
      "లై",
      "లొ",
      "లో",
      "లౌ",
      "లం",
      "లః",
    ],
    వ: [
      "వ",
      "వా",
      "వి",
      "వీ",
      "వు",
      "వూ",
      "వృ",
      "వె",
      "వే",
      "వై",
      "వొ",
      "వో",
      "వౌ",
      "వం",
      "వః",
    ],
    శ: [
      "శ",
      "శా",
      "శి",
      "శీ",
      "శు",
      "శూ",
      "శృ",
      "శె",
      "శే",
      "శై",
      "శొ",
      "శో",
      "శౌ",
      "శం",
      "శః",
    ],
    ష: [
      "ష",
      "షా",
      "షి",
      "షీ",
      "షు",
      "షూ",
      "షృ",
      "షె",
      "షే",
      "షై",
      "షొ",
      "షో",
      "షౌ",
      "షం",
      "షః",
    ],
    స: [
      "స",
      "సా",
      "సి",
      "సీ",
      "సు",
      "సూ",
      "సృ",
      "సె",
      "సే",
      "సై",
      "సొ",
      "సో",
      "సౌ",
      "సం",
      "సః",
    ],
    హ: [
      "హ",
      "హా",
      "హి",
      "హీ",
      "హు",
      "హూ",
      "హృ",
      "హె",
      "హే",
      "హై",
      "హొ",
      "హో",
      "హౌ",
      "హం",
      "హః",
    ],
  },

  kn: {
    ಕ: [
      "ಕ",
      "ಕಾ",
      "ಕಿ",
      "ಕೀ",
      "ಕು",
      "ಕೂ",
      "ಕೃ",
      "ಕೆ",
      "ಕೇ",
      "ಕೈ",
      "ಕೊ",
      "ಕೋ",
      "ಕೌ",
      "ಕಂ",
      "ಕಃ",
    ],
    ಖ: [
      "ಖ",
      "ಖಾ",
      "ಖಿ",
      "ಖೀ",
      "ಖು",
      "ಖೂ",
      "ಖೃ",
      "ಖೆ",
      "ಖೇ",
      "ಖೈ",
      "ಖೊ",
      "ಖೋ",
      "ಖೌ",
      "ಖಂ",
      "ಖಃ",
    ],
    ಗ: [
      "ಗ",
      "ಗಾ",
      "ಗಿ",
      "ಗೀ",
      "ಗು",
      "ಗೂ",
      "ಗೃ",
      "ಗೆ",
      "ಗೇ",
      "ಗೈ",
      "ಗೊ",
      "ಗೋ",
      "ಗೌ",
      "ಗಂ",
      "ಗಃ",
    ],
    ಘ: [
      "ಘ",
      "ಘಾ",
      "ಘಿ",
      "ಘೀ",
      "ಘು",
      "ಘೂ",
      "ಘೃ",
      "ಘೆ",
      "ಘೇ",
      "ಘೈ",
      "ಘೊ",
      "ಘೋ",
      "ಘೌ",
      "ಘಂ",
      "ಘಃ",
    ],
    ಙ: [
      "ಙ",
      "ಙಾ",
      "ಙಿ",
      "ಙೀ",
      "ಙು",
      "ಙೂ",
      "ಙೃ",
      "ಙೆ",
      "ಙೇ",
      "ಙೈ",
      "ಙೊ",
      "ಙೋ",
      "ಙೌ",
      "ಙಂ",
      "ಙಃ",
    ],
    ಚ: [
      "ಚ",
      "ಚಾ",
      "ಚಿ",
      "ಚೀ",
      "ಚು",
      "ಚೂ",
      "ಚೃ",
      "ಚೆ",
      "ಚೇ",
      "ಚೈ",
      "ಚೊ",
      "ಚೋ",
      "ಚೌ",
      "ಚಂ",
      "ಚಃ",
    ],
    ಛ: [
      "ಛ",
      "ಛಾ",
      "ಛಿ",
      "ಛೀ",
      "ಛು",
      "ಛೂ",
      "ಛೃ",
      "ಛೆ",
      "ಛೇ",
      "ಛೈ",
      "ಛೊ",
      "ಛೋ",
      "ಛೌ",
      "ಛಂ",
      "ಛಃ",
    ],
    ಜ: [
      "ಜ",
      "ಜಾ",
      "ಜಿ",
      "ಜೀ",
      "ಜು",
      "ಜೂ",
      "ಜೃ",
      "ಜೆ",
      "ಜೇ",
      "ಜೈ",
      "ಜೊ",
      "ಜೋ",
      "ಜೌ",
      "ಜಂ",
      "ಜಃ",
    ],
    ಝ: [
      "ಝ",
      "ಝಾ",
      "ಝಿ",
      "ಝೀ",
      "ಝು",
      "ಝೂ",
      "ಝೃ",
      "ಝೆ",
      "ಝೇ",
      "ಝೈ",
      "ಝೊ",
      "ಝೋ",
      "ಝೌ",
      "ಝಂ",
      "ಝಃ",
    ],
    ಞ: [
      "ಞ",
      "ಞಾ",
      "ಞಿ",
      "ಞೀ",
      "ಞು",
      "ಞೂ",
      "ಞೃ",
      "ಞೆ",
      "ಞೇ",
      "ಞೈ",
      "ಞೊ",
      "ಞೋ",
      "ಞೌ",
      "ಞಂ",
      "ಞಃ",
    ],
    ಟ: [
      "ಟ",
      "ಟಾ",
      "ಟಿ",
      "ಟೀ",
      "ಟು",
      "ಟೂ",
      "ಟೃ",
      "ಟೆ",
      "ಟೇ",
      "ಟೈ",
      "ಟೊ",
      "ಟೋ",
      "ಟೌ",
      "ಟಂ",
      "ಟಃ",
    ],
    ಠ: [
      "ಠ",
      "ಠಾ",
      "ಠಿ",
      "ಠೀ",
      "ಠು",
      "ಠೂ",
      "ಠೃ",
      "ಠೆ",
      "ಠೇ",
      "ಠೈ",
      "ಠೊ",
      "ಠೋ",
      "ಠೌ",
      "ಠಂ",
      "ಠಃ",
    ],
    ಡ: [
      "ಡ",
      "ಡಾ",
      "ಡಿ",
      "ಡೀ",
      "ಡು",
      "ಡೂ",
      "ಡೃ",
      "ಡೆ",
      "ಡೇ",
      "ಡೈ",
      "ಡೊ",
      "ಡೋ",
      "ಡೌ",
      "ಡಂ",
      "ಡಃ",
    ],
    ಢ: [
      "ಢ",
      "ಢಾ",
      "ಢಿ",
      "ಢೀ",
      "ಢು",
      "ಢೂ",
      "ಢೃ",
      "ಢೆ",
      "ಢೇ",
      "ಢೈ",
      "ಢೊ",
      "ಢೋ",
      "ಢೌ",
      "ಢಂ",
      "ಢಃ",
    ],
    ಣ: [
      "ಣ",
      "ಣಾ",
      "ಣಿ",
      "ಣೀ",
      "ಣು",
      "ಣೂ",
      "ಣೃ",
      "ಣೆ",
      "ಣೇ",
      "ಣೈ",
      "ಣೊ",
      "ಣೋ",
      "ಣೌ",
      "ಣಂ",
      "ಣಃ",
    ],
    ತ: [
      "ತ",
      "ತಾ",
      "ತಿ",
      "ತೀ",
      "ತು",
      "ತೂ",
      "ತೃ",
      "ತೆ",
      "ತೇ",
      "ತೈ",
      "ತೊ",
      "ತೋ",
      "ತೌ",
      "ತಂ",
      "ತಃ",
    ],
    ಥ: [
      "ಥ",
      "ಥಾ",
      "ಥಿ",
      "ಥೀ",
      "ಥು",
      "ಥೂ",
      "ಥೃ",
      "ಥೆ",
      "ಥೇ",
      "ಥೈ",
      "ಥೊ",
      "ಥೋ",
      "ಥೌ",
      "ಥಂ",
      "ಥಃ",
    ],
    ದ: [
      "ದ",
      "ದಾ",
      "ದಿ",
      "ದೀ",
      "ದು",
      "ದೂ",
      "ದೃ",
      "ದೆ",
      "ದೇ",
      "ದೈ",
      "ದೊ",
      "ದೋ",
      "ದೌ",
      "ದಂ",
      "ದಃ",
    ],
    ಧ: [
      "ಧ",
      "ಧಾ",
      "ಧಿ",
      "ಧೀ",
      "ಧು",
      "ಧೂ",
      "ಧೃ",
      "ಧೆ",
      "ಧೇ",
      "ಧೈ",
      "ಧೊ",
      "ಧೋ",
      "ಧೌ",
      "ಧಂ",
      "ಧಃ",
    ],
    ನ: [
      "ನ",
      "ನಾ",
      "ನಿ",
      "ನೀ",
      "ನು",
      "ನೂ",
      "ನೃ",
      "ನೆ",
      "ನೇ",
      "ನೈ",
      "ನೊ",
      "ನೋ",
      "ನೌ",
      "ನಂ",
      "ನಃ",
    ],
    ಪ: [
      "ಪ",
      "ಪಾ",
      "ಪಿ",
      "ಪೀ",
      "ಪು",
      "ಪೂ",
      "ಪೃ",
      "ಪೆ",
      "ಪೇ",
      "ಪೈ",
      "ಪೊ",
      "ಪೋ",
      "ಪೌ",
      "ಪಂ",
      "ಪಃ",
    ],
    ಫ: [
      "ಫ",
      "ಫಾ",
      "ಫಿ",
      "ಫೀ",
      "ಫು",
      "ಫೂ",
      "ಫೃ",
      "ಫೆ",
      "ಫೇ",
      "ಫೈ",
      "ಫೊ",
      "ಫೋ",
      "ಫೌ",
      "ಫಂ",
      "ಫಃ",
    ],
    ಬ: [
      "ಬ",
      "ಬಾ",
      "ಬಿ",
      "ಬೀ",
      "ಬು",
      "ಬೂ",
      "ಬೃ",
      "ಬೆ",
      "ಬೇ",
      "ಬೈ",
      "ಬೊ",
      "ಬೋ",
      "ಬೌ",
      "ಬಂ",
      "ಬಃ",
    ],
    ಭ: [
      "ಭ",
      "ಭಾ",
      "ಭಿ",
      "ಭೀ",
      "ಭು",
      "ಭೂ",
      "ಭೃ",
      "ಭೆ",
      "ಭೇ",
      "ಭೈ",
      "ಭೊ",
      "ಭೋ",
      "ಭೌ",
      "ಭಂ",
      "ಭಃ",
    ],
    ಮ: [
      "ಮ",
      "ಮಾ",
      "ಮಿ",
      "ಮೀ",
      "ಮು",
      "ಮೂ",
      "ಮೃ",
      "ಮೆ",
      "ಮೇ",
      "ಮೈ",
      "ಮೊ",
      "ಮೋ",
      "ಮೌ",
      "ಮಂ",
      "ಮಃ",
    ],
    ಯ: [
      "ಯ",
      "ಯಾ",
      "ಯಿ",
      "ಯೀ",
      "ಯು",
      "ಯೂ",
      "ಯೃ",
      "ಯೆ",
      "ಯೇ",
      "ಯೈ",
      "ಯೊ",
      "ಯೋ",
      "ಯೌ",
      "ಯಂ",
      "ಯಃ",
    ],
    ರ: [
      "ರ",
      "ರಾ",
      "ರಿ",
      "ರೀ",
      "ರು",
      "ರೂ",
      "ರೃ",
      "ರೆ",
      "ರೇ",
      "ರೈ",
      "ರೊ",
      "ರೋ",
      "ರೌ",
      "ರಂ",
      "ರಃ",
    ],
    ಲ: [
      "ಲ",
      "ಲಾ",
      "ಲಿ",
      "ಲೀ",
      "ಲು",
      "ಲೂ",
      "ಲೃ",
      "ಲೆ",
      "ಲೇ",
      "ಲೈ",
      "ಲೊ",
      "ಲೋ",
      "ಲೌ",
      "ಲಂ",
      "ಲಃ",
    ],
    ವ: [
      "ವ",
      "ವಾ",
      "ವಿ",
      "ವೀ",
      "ವು",
      "ವೂ",
      "ವೃ",
      "ವೆ",
      "ವೇ",
      "ವೈ",
      "ವೊ",
      "ವೋ",
      "ವೌ",
      "ವಂ",
      "ವಃ",
    ],
    ಶ: [
      "ಶ",
      "ಶಾ",
      "ಶಿ",
      "ಶೀ",
      "ಶು",
      "ಶೂ",
      "ಶೃ",
      "ಶೆ",
      "ಶೇ",
      "ಶೈ",
      "ಶೊ",
      "ಶೋ",
      "ಶೌ",
      "ಶಂ",
      "ಶಃ",
    ],
    ಷ: [
      "ಷ",
      "ಷಾ",
      "ಷಿ",
      "ಷೀ",
      "ಷು",
      "ಷೂ",
      "ಷೃ",
      "ಷೆ",
      "ಷೇ",
      "ಷೈ",
      "ಷೊ",
      "ಷೋ",
      "ಷೌ",
      "ಷಂ",
      "ಷಃ",
    ],
    ಸ: [
      "ಸ",
      "ಸಾ",
      "ಸಿ",
      "ಸೀ",
      "ಸು",
      "ಸೂ",
      "ಸೃ",
      "ಸೆ",
      "ಸೇ",
      "ಸೈ",
      "ಸೊ",
      "ಸೋ",
      "ಸೌ",
      "ಸಂ",
      "ಸಃ",
    ],
    ಹ: [
      "ಹ",
      "ಹಾ",
      "ಹಿ",
      "ಹೀ",
      "ಹು",
      "ಹೂ",
      "ಹೃ",
      "ಹೆ",
      "ಹೇ",
      "ಹೈ",
      "ಹೊ",
      "ಹೋ",
      "ಹೌ",
      "ಹಂ",
      "ಹಃ",
    ],
  },
};

const wordData = {
  hi: [
    {
      text: "भारत",
      audio: "e0babcda-d6ff-4fed-a36d-5ccdd831b1f2.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.bharataudio),
    },
    {
      text: "राजा",
      audio: "b4edcfa0-91cf-4343-91f9-35fd8c691fcf.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.rajaaudio),
    },
    {
      text: "जल",
      audio: "551fee7a-fad6-4c0b-a384-5cee9aa7c7c2.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.jalaudio),
    },
    {
      text: "भालू",
      audio: "18cf4ec8-4669-49eb-81dc-622196bd226a.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.bhaluaudio),
    },
    {
      text: "किताब",
      audio: "42dfd842-8e09-4ab1-b14a-5b2afab33b5c.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.kitabaudio),
    },
    {
      text: "नदी",
      audio: "07346231-fd5b-4a41-82e8-c1f0be6a7a85.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.nadiaudio),
    },
    {
      text: "केला",
      audio: "1b1b2c77-88e1-46e0-b8a9-f94561d34d4a.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.kelaaudio),
    },
    {
      text: "पपीता",
      audio: "7ffaaae5-31ff-413c-ae1f-eb51780cf4d3.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.papitaaudio),
    },
    {
      text: "पहाड",
      audio: "97cd336e-0495-4aaa-8f64-6764f2714f6f.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.pahadaudio),
    },
    {
      text: "सेब",
      audio: "1ce9cb46-6761-4c97-b184-ed123ea49de5.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.sebaudio),
    },
  ],

  ta: [
    {
      text: "மலை",
      audio: "bf0f13d5-f206-4fe2-b0fc-39462362b948.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.மலைAudio),
    },
    {
      text: "நதி",
      audio: "47c2b4ee-88bf-4b4f-92e6-07716978b021.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.நதிAudio),
    },
    {
      text: "புழு",
      audio: "49500432-222b-475c-81c9-d331adfbca3a.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.புழுAudio),
    },
    {
      text: "வலி",
      audio: "5c7cdc08-b216-4317-80e2-a2995aeb1239.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.வலிAudio),
    },
    {
      text: "தலை",
      audio: "e782655f-6da9-4dc8-9f36-ce404c4c53c2.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.தலைAudio),
    },
    {
      text: "நாடு",
      audio: "37a8ced6-8fa4-451d-a712-627c09bd8398.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.நாடுAudio),
    },
    {
      text: "மாடு",
      audio: "37a8ced6-8fa4-451d-a712-627c09bd8398.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.மாடுAudio),
    },
    {
      text: "மழை",
      audio: "0d6e3293-7cd1-40ac-a971-46062a2c5bda.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.மழைAudio),
    },
    {
      text: "கடை",
      audio: "81bf37f3-4517-4af1-94d6-d8f801e20534.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.கடைAudio),
    },
    {
      text: "வீடு",
      audio: "7837a882-d5c5-40b6-b4d2-3d72d42427c7.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.வீடுAudio),
    },
  ],

  te: [
    {
      text: "నీరు",
      audio: "b2a623f9-e4d1-427f-a50a-83471aeb8d6e.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.నీరుAudio),
    },
    {
      text: "పాలు",
      audio: "6a5b2232-1afe-49eb-a467-d0d86b1e5daf.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.పాలుAudio),
    },
    {
      text: "చేప",
      audio: "4b9977d3-2b1a-4819-ab81-eae005b93192.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.చేపAudio),
    },
    {
      text: "లేడి",
      audio: "4204ec95-d07c-452f-884b-8a625ef23bb7.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.పక్షిAudio),
    },
    {
      text: "నది",
      audio: "ab310a2b-a6d4-435a-bcd2-589b33689c23.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.నదిAudio),
    },
    {
      text: "కథలు",
      audio: "fb3d428a-cd3f-45e5-85a8-162c823cfecb.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.కుక్కAudio),
    },
    {
      text: "తిను",
      audio: "8017f67a-1f3c-4286-82fa-5fb8a290d500.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.పిల్లిAudio),
    },
    {
      text: "మనిషి",
      audio: "6dc6f74e-44e2-4c1d-99d0-c08dbd740caf.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.మనిషిAudio),
    },
    {
      text: "బడి",
      audio: "4a3fafe7-b90c-4341-9c38-c40caed08494.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.బడిAudio),
    },
    {
      text: "పని",
      audio: "9f7f13c0-95b4-4fec-ae0f-28308d8261a8.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ఇల్లుAudio),
    },
  ],
  kn: [
    {
      text: "ತಂಡ",
      audio: "e90023db-551d-462a-a132-dd2d93fd026a.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನೀರುAudio),
    },
    {
      text: "ಹಾಲು",
      audio: "c8b3656f-1f13-404e-8409-864fd33c56ac.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹಾಲುAudio),
    },
    {
      text: "ಮೀನು",
      audio: "18ae34eb-1151-4692-bef4-6c4e9d45c68e.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೀನುAudio),
    },
    {
      text: "ಕಮಲ",
      audio: "6c751bea-e1d2-440a-8d1c-b8847f59312d.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹಕ್ಕಿAudio),
    },
    {
      text: "ನದಿ",
      audio: "a11f0fe3-431f-4e15-9f85-0e50c6927e1e.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನದಿAudio),
    },
    {
      text: "ನಾಯಿ",
      audio: "be34bf1d-1a30-4244-a9fc-93872eac28d9.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನಾಯಿAudio),
    },
    {
      text: "ಸಿಹಿ",
      audio: "cb55bceb-11c9-4eeb-bd4f-28835fdccfdd.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಬೆಕ್ಕುAudio),
    },
    {
      text: "ಮನೆ",
      audio: "9d2e0804-5d26-456f-bcae-6d92d39d4091.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮನೆAudio),
    },
    {
      text: "ಪಾಠ",
      audio: "26a8679c-cbc5-4a55-84bf-eb87de6678a6.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಪಾಠAudio),
    },
    {
      text: "ತಂಡ",
      audio: "ebf6d7ed-84f3-48f7-999b-61ba7ba67e5d.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಬಳ್ಳಿAudio),
    },
  ],
};
function getScriptFromLang(lang) {
  const scriptMap = {
    hi: "devanagari",
    kn: "kannada",
    te: "telugu",
    ta: "tamil",
  };
  return scriptMap[lang] || "devanagari";
}

function getConsonantsFromWord(word, lang) {
  const chart = barakhadiCharts[lang];
  if (!chart) return [];

  const consonants = Object.keys(chart);
  return Array.from(word).filter((char) => consonants.includes(char));
}

function getBarakhadiForWord(word, lang) {
  const chart = barakhadiCharts[lang];
  if (!chart) return {};

  const wordConsonants = getConsonantsFromWord(word, lang);
  const allConsonants = Object.keys(chart);

  let selectedConsonants = [...wordConsonants];
  const needed = 4 - selectedConsonants.length;

  if (needed > 0) {
    const availableConsonants = allConsonants.filter(
      (c) => !selectedConsonants.includes(c)
    );
    const randomConsonants = availableConsonants
      .sort(() => Math.random() - 0.5)
      .slice(0, needed);
    selectedConsonants = [...selectedConsonants, ...randomConsonants];
  } else if (selectedConsonants.length > 4) {
    selectedConsonants = selectedConsonants.slice(0, 4);
  }

  selectedConsonants = selectedConsonants.sort(() => Math.random() - 0.5);

  const barakhadi = {};
  selectedConsonants.forEach((consonant) => {
    barakhadi[consonant] = chart[consonant] || [];
  });

  return barakhadi;
}

const playAudio = (audioUrl) => {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  }
};

const Barakhadi = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
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
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
}) => {
  steps = 1;

  const [word, setWord] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFullChart, setShowFullChart] = useState(false);
  const [currentBarakhadi, setCurrentBarakhadi] = useState({});
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [incorrectCell, setIncorrectCell] = useState(null);
  const [voicesReady, setVoicesReady] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const navigate = useNavigate();
  const correctAudio = new Audio(correctSound);
  const wrongAudio = new Audio(wrongSound);
  const lang = getLocalData("lang") || "hi";
  const [showAudioWave, setShowAudioWave] = useState(false);
  const [showWordAudioWave, setShowWordAudioWave] = useState(false);

  const swar = vowelsData[lang] || vowelsData.hi;
  const vowels = vowelsData[lang] || vowelsData.hi;

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesReady(true);
        console.log(
          "Voices loaded successfully:",
          voices.map((v) => ({ name: v.name, lang: v.lang }))
        );

        const hasTamil = voices.some(
          (v) => v.lang === "ta-IN" || v.lang.startsWith("ta")
        );
        if (!hasTamil && lang === "ta") {
          setVoiceStatus("Tamil voice not available. Using Hindi instead.");
        } else {
          setVoiceStatus("");
        }
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [lang]);

  const getWordData = () => {
    return wordData[lang] || wordData.hi;
  };

  const wordDataList = getWordData();

  const getTitle = () => {
    const titles = {
      hi: "हिंदी बारहखड़ी चार्ट",
      ta: "தமிழ் பாராகடி சார்ட்",
      te: "తెలుగు బారాఖడీ చార్ట్",
      kn: "ಕನ್ನಡ ಬಾರಾಖಡಿ ಚಾರ್ಟ್",
    };
    return titles[lang] || titles.hi;
  };

  const getButtonTexts = () => {
    const texts = {
      hi: {
        listen: "सुनो",
        delete: "पिछला मिटाओ",
        erase: "सब मिटाओ",
        viewChart: "पूरा चार्ट देखें",
      },
      ta: {
        listen: "கேள்",
        delete: "கடைசியை நீக்கு",
        erase: "அனைத்தையும் துடை",
        viewChart: "முழு விளக்கப்படத்தைக் காண்க",
      },
      te: {
        listen: "వినండి",
        delete: "చివరిది తొలగించు",
        erase: "అన్నీ తొలగించు",
        viewChart: "పూర్తి చార్ట్ చూడండి",
      },
      kn: {
        listen: "ಕೇಳಿ",
        delete: "ಕೊನೆಯದನ್ನು ಅಳಿಸಿ",
        erase: "ಎಲ್ಲಾ ಅಳಿಸಿ",
        viewChart: "ಪೂರ್ಣ ಚಾರ್ಟ್ ನೋಡಿ",
      },
    };
    return texts[lang] || texts.hi;
  };

  const buttonTexts = getButtonTexts();

  const getChartTitle = () => {
    const titles = {
      hi: "हिंदी बारहखड़ी चार्ट",
      ta: "தமிழ் மெய்யெழுத்துக்கள்",
      te: "తెలుగు బారాఖడీ చార్ట్",
      kn: "ಕನ್ನಡ ಬಾರಾಖಡಿ ಚಾರ್ಟ್",
    };
    return titles[lang] || titles.hi;
  };

  const getSpeechLang = () => {
    const langCodes = {
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      kn: "kn-IN",
    };

    const requestedCode = langCodes[lang] || "hi-IN";
    const voices = speechSynthesis.getVoices();

    const isVoiceAvailable = voices.some(
      (voice) =>
        voice.lang === requestedCode ||
        voice.lang.startsWith(requestedCode.split("-")[0])
    );

    console.log("Voice availability check:", {
      requested: requestedCode,
      available: isVoiceAvailable,
      allVoices: voices.map((v) => v.lang),
    });

    if (!isVoiceAvailable) {
      console.log(`Voice for ${requestedCode} not available, using fallback`);

      if (voices.some((v) => v.lang === "hi-IN" || v.lang.startsWith("hi"))) {
        return "hi-IN";
      } else if (
        voices.some((v) => v.lang === "en-US" || v.lang.startsWith("en"))
      ) {
        return "en-US";
      } else if (voices.length > 0) {
        return voices[0].lang;
      }
    }

    return requestedCode;
  };

  const getInstructionAltText = () => {
    const altTexts = {
      hi: "शब्द",
      ta: "சொல்",
      te: "పదం",
      kn: "ಪದ",
    };
    return altTexts[lang] || altTexts.hi;
  };

  useEffect(() => {
    const initialTargetWord = wordDataList[0].text;
    setTargetWord(initialTargetWord);
    const barakhadi = getBarakhadiForWord(initialTargetWord, lang);
    setCurrentBarakhadi(barakhadi);
  }, [lang]);

  useEffect(() => {
    if (targetWord) {
      const barakhadi = getBarakhadiForWord(targetWord, lang);
      setCurrentBarakhadi(barakhadi);
    }
  }, [targetWord, lang]);

  const handleNextWord = () => {
    const nextIndex = currentWordIndex + 1;

    if (nextIndex >= wordDataList.length) {
      setLocalData("rFlow", false);

      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
      callTelemetryDiscovery("R1-Barakhadi");

      return;
    }

    setCurrentWordIndex(nextIndex);
    setTargetWord(wordDataList[nextIndex].text);
    setWord("");
    setShowConfetti(false);
    setIncorrectCell(null);
  };

  const handleLetterClick = (letter, rowIndex, colIndex) => {
    const remainingTarget = targetWord.slice(word.length);

    const isCorrect = remainingTarget.startsWith(letter);

    const newWord = word + letter;
    setWord(newWord);

    if (isCorrect) {
      if (newWord === targetWord) {
        correctAudio.play();
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }
    }
  };

  const handleErase = () => {
    setWord("");
    setIncorrectCell(null);
  };

  const handleDelete = () => {
    setWord((prevWord) => prevWord.slice(0, -1));
    setIncorrectCell(null);
  };
  const handleListen = () => {
    if (word.length > 0) {
      console.log("Playing audio for user-typed word:", word);

      if (word === targetWord) {
        playSegmentedAudio(currentWordData);
      } else {
        playTTS(word);
      }
    }
  };

  const playTTS = (textToSpeak) => {
    if (!voicesReady) {
      console.log("Voices not loaded yet, retrying in 500ms...");
      setTimeout(() => playTTS(textToSpeak), 500);
      return;
    }

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const requestedLang = getSpeechLang();
      const voices = speechSynthesis.getVoices();

      // Find the best available voice
      let selectedVoice = null;

      // First try: Exact match
      selectedVoice = voices.find((voice) => voice.lang === requestedLang);

      // Second try: Language family match (e.g., ta-IN for ta)
      if (!selectedVoice) {
        const langFamily = requestedLang.split("-")[0];
        selectedVoice = voices.find((voice) =>
          voice.lang.startsWith(langFamily)
        );
      }

      // Third try: Hindi fallback
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang === "hi-IN" || voice.lang.startsWith("hi")
        );
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang === "en-US" || voice.lang.startsWith("en")
        );
      }

      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        console.log("Using voice:", selectedVoice.name, selectedVoice.lang);
      } else {
        utterance.lang = requestedLang;
        console.log("No suitable voice found, using default");
      }

      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      console.log("TTS Final Settings:", {
        text: textToSpeak,
        requestedLang: requestedLang,
        actualLang: utterance.lang,
        voice: utterance.voice?.name,
      });

      utterance.onstart = () => {
        console.log("TTS started successfully");
        setShowAudioWave(true);
      };

      utterance.onend = () => {
        console.log("TTS ended");
        setShowAudioWave(false);
      };

      utterance.onerror = (event) => {
        console.error("TTS error:", event);
        setShowAudioWave(false);
      };

      speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const playSegmentedAudio = (wordData) => {
    if (wordData && wordData.segmentedAudio) {
      setShowAudioWave(true);

      const audio = new Audio(wordData.segmentedAudio);

      audio.play().catch((error) => {
        console.error("Error playing segmented audio:", error);
        setShowAudioWave(false);
        playTTS(wordData.text);
      });

      audio.onended = () => {
        setShowAudioWave(false);
      };

      setTimeout(() => {
        setShowAudioWave(false);
      }, 5000);
    } else {
      playTTS(wordData.text);
    }
  };

  const playWordAudio = (wordData) => {
    if (wordData && wordData.audio) {
      setShowWordAudioWave(true);

      const audioUrl = `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${wordData.audio}`;
      console.log("Attempting to play audio from:", audioUrl);

      const audio = new Audio(audioUrl);

      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        setShowWordAudioWave(false);
        playTTS(wordData.text);
      });

      audio.onended = () => {
        console.log("Audio playback completed");
        setShowWordAudioWave(false);
      };

      audio.onerror = (e) => {
        console.error("Audio element error:", e);
        setShowWordAudioWave(false);
      };
    } else {
      console.log("No audio found, using TTS");
      playTTS(wordData.text);
    }
  };

  const debugVoices = () => {
    const voices = speechSynthesis.getVoices();
    console.log("=== VOICE DEBUG INFO ===");
    console.log("Total voices:", voices.length);
    console.log(
      "Available languages:",
      [...new Set(voices.map((v) => v.lang))].sort()
    );
    console.log(
      "Detailed voices:",
      voices.map((v) => ({
        name: v.name,
        lang: v.lang,
        localService: v.localService,
        default: v.default,
      }))
    );
  };

  const currentWordData =
    wordDataList.find((item) => item.text === targetWord) || wordDataList[0];
  const vyajan = Object.keys(currentBarakhadi);

  const generateFullBarakhadi = () => {
    return barakhadiCharts[lang] || {};
  };

  const containerStyle = {
    fontFamily: "sans-serif",
    background: "#f2fbe9",
    padding: "0px",
    textAlign: "center",
    overflow: "hidden",
  };

  const cardStyle = {
    background: "#fff",
    padding: "23px",
    borderRadius: "12px",
    display: "inline-block",
    position: "relative",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    width: "95%",
    maxWidth: "1200px",
    height: "485px",
  };

  const titleStyle = {
    fontSize: "15px",
    fontWeight: "bold",
    color: "rgba(51, 63, 97, 1)",
    marginBottom: "15px",
    marginTop: "-7px",
    fontFamily: "Quicksand",
    gap: "10px",
  };

  const wordBoxStyle = {
    border: "1px dashed #ff9800",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    zIndex: 1000,
    background: "#FFF9ED",
    height: "130px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const btnRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "200px",
    marginTop: "auto",
    flexShrink: 0,
  };

  const buttonStyle = {
    padding: "12px 50px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    height: "40px",
  };

  const disabledButtonStyle = {
    padding: "12px 50px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    boxShadow: "0px 4px 6px rgba(0, 128, 0, 0.3)",
    opacity: 0.6,
    cursor: "not-allowed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "14px",
    height: "40px",
  };

  const tableStyle = {
    marginTop: "15px",
    borderCollapse: "collapse",
    width: "100%",
    tableLayout: "fixed",
    position: "relative",
  };

  const tdStyle = {
    padding: "8px",
    border: "1px solid #ccc",
    fontSize: "19px",
    textAlign: "center",
    width: "59px",
    cursor: "pointer",
    fontWeight: 800,
    transition: "background-color 0.3s ease",
  };

  const circleStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#2c3e50",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "12px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.15)",
    margin: "0 auto",
    marginBottom: "4px",
  };

  const leftCircleStyle = {
    position: "absolute",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#ffeb3b",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.15)",
    border: "1px solid black",
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      parentWords={parentWords}
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
      <div style={containerStyle}>
        {showConfetti && <Confetti />}

        {voiceStatus && (
          <div
            style={{
              position: "fixed",
              bottom: 10,
              left: 10,
              background: "yellow",
              padding: "5px",
              fontSize: "12px",
              borderRadius: "5px",
              border: "1px solid orange",
            }}
          >
            {voiceStatus}
          </div>
        )}

        <style>
          {`
            @keyframes pulse {
              0% {
                transform: scale(0.6);
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              100% {
                transform: scale(1.4);
                opacity: 0;
              }
            }
          `}
        </style>

        {showFullChart && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              zIndex: 10000,
              margin: "20px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                padding: "10px",
                width: "100%",
                maxWidth: "1100px",
                margin: "0 auto",
                position: "relative",
                minHeight: "auto",
              }}
            >
              <img
                src={closebuttonImg}
                alt="Close"
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                onClick={() => setShowFullChart(false)}
              />

              <h2
                style={{
                  textAlign: "center",
                  color: "rgba(51, 63, 97, 1)",
                  marginBottom: "20px",
                  fontSize: "30px",
                  fontWeight: 700,
                  marginRight: "30px",
                  marginTop: "10px",
                  fontFamily: "Quicksand",
                }}
              >
                {getChartTitle()}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Vowels Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "10px",
                    width: `${vowels.length * 52}px`,
                    marginLeft: "142px",
                    gap: "2px",
                  }}
                >
                  {vowels.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        background: "#1a237e",
                        color: "white",
                        border: "1px solid #999",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 2px",
                        fontSize: "18px",
                        flexShrink: 0,
                      }}
                    >
                      {v}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "10px",
                      gap: "3px",
                    }}
                  >
                    {Object.keys(generateFullBarakhadi()).map(
                      (consonant, index) => (
                        <div
                          key={index}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: "50%",
                            background: "#fbc02d",
                            border: "1px solid black",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "4px 0",
                            fontSize: "18px",
                            flexShrink: 0,
                          }}
                        >
                          {consonant}
                        </div>
                      )
                    )}
                  </div>

                  <div>
                    <table
                      style={{
                        borderCollapse: "collapse",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      <tbody>
                        {Object.entries(generateFullBarakhadi()).map(
                          ([consonant, syllables], rowIdx) => (
                            <tr key={rowIdx}>
                              {syllables.map((syllable, idx) => (
                                <td
                                  key={idx}
                                  style={{
                                    width: 55,
                                    height: 55,
                                    border: "1px solid #ccc",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    minWidth: "55px",
                                  }}
                                >
                                  {syllable}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <div style={titleStyle}>
            <img
              src={wordbanaoImg}
              alt={getInstructionAltText()}
              height={"30px"}
              style={{ display: "block", margin: "0 auto" }}
            />
          </div>

          <div style={wordBoxStyle}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                marginBottom: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    background: "rgba(51, 63, 97, 1)",
                    color: "#fff",
                    padding: "3px 26px",
                    borderRadius: "6px",
                    minWidth: "80px",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {currentWordData.text}
                </span>

                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {showWordAudioWave ? (
                    <img
                      src={audiowaveImg}
                      alt="audio playing"
                      style={{
                        width: "100px",
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                  ) : (
                    <>
                      <img
                        src={listenImg}
                        alt="listen"
                        style={{
                          width: "25px",
                          cursor: "pointer",
                          position: "relative",
                          zIndex: 1,
                        }}
                        onClick={() => playWordAudio(currentWordData)}
                      />
                      <div
                        style={{
                          position: "absolute",
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#A856FF",
                          borderRadius: "50%",
                          animation: "pulse 1.2s linear infinite",
                          top: "-23%",
                          left: "8%",
                          transform: "translate(-50%, -50%)",
                          zIndex: -1,
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                border: "1px solid orange",
                borderRadius: "10px",
                height: "39px",
                marginBottom: "10px",
                width: "90%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: word === targetWord ? "#27ae60" : "#2c3e50",
                background: word === targetWord ? "#e8f5e8" : "#ffffff",
                transition: "background 0.3s ease, color 0.3s ease",
                overflow: "hidden",
                whiteSpace: "nowrap",
                lineHeight: "1",
              }}
            >
              {word ? word : <span style={{ opacity: 0 }}>A</span>}
            </div>

            <div style={btnRowStyle}>
              <button
                style={
                  word.length === 0
                    ? {
                        ...disabledButtonStyle,
                        boxShadow: "3px 4px 6px rgba(0, 128, 0, 0.3)",
                      }
                    : {
                        ...buttonStyle,
                        boxShadow: "3px 4px 6px rgba(0, 128, 0, 1.6)",
                      }
                }
                onClick={handleListen}
                disabled={word.length === 0}
              >
                <img
                  src={listenImgBox}
                  alt="listen"
                  style={{ height: "17px" }}
                />
                <span>{buttonTexts.listen}</span>
              </button>

              <button
                style={{
                  ...buttonStyle,
                  boxShadow: "3px 4px 6px rgba(255, 165, 0, 1.6)",
                }}
                onClick={handleDelete}
              >
                <img src={deleteImg} alt="delete" style={{ height: "17px" }} />
                <span>{buttonTexts.delete}</span>
              </button>

              <button
                style={{
                  ...buttonStyle,
                  boxShadow: "3px 4px 6px rgba(255, 0, 0, 1.6)",
                }}
                onClick={handleErase}
              >
                <img src={eraseImg} alt="erase" style={{ height: "17px" }} />
                <span>{buttonTexts.erase}</span>
              </button>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              paddingLeft: "60px",
              height: "360px",
            }}
          >
            {vyajan.map((v, i) => (
              <div
                key={i}
                style={{
                  ...leftCircleStyle,
                  left: "19px",
                  top: `${i * 45 + 40}px`,
                }}
              >
                {v}
              </div>
            ))}

            <table style={tableStyle}>
              <thead>
                <tr>
                  {swar.map((v, i) => (
                    <th key={i}>
                      <div style={circleStyle}>{v}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vyajan.map((consonant, rowIndex) => (
                  <tr key={rowIndex}>
                    {currentBarakhadi[consonant]?.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        style={tdStyle}
                        onClick={() =>
                          handleLetterClick(cell, rowIndex, colIndex)
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                padding: "0 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  background: "#F8FBFF",
                  border: "1px solid rgba(231, 232, 236, 1)",
                  borderRadius: "12px",
                  padding: "6px 14px",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                }}
                onClick={() => setShowFullChart(true)}
              >
                <img src={dottimg} alt="dots" style={{ height: "28px" }} />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "rgba(51,63,97,1)",
                    fontFamily: "Quicksand",
                  }}
                >
                  {buttonTexts.viewChart}
                </span>
              </div>

              <img
                src={nextImg}
                alt="next"
                style={{ height: "36px", cursor: "pointer" }}
                onClick={handleNextWord}
              />
            </div>
          </div>

          <img
            src={boyballonflyImg}
            alt="boy balloon"
            style={{
              position: "absolute",
              top: "10px",
              right: "120px",
              width: "60px",
              zIndex: 1,
            }}
          />

          <img
            src={boyImg}
            alt="boy"
            style={{
              position: "absolute",
              top: "48px",
              right: "60px",
              width: "60px",
            }}
          />
          <img
            src={bearImg}
            alt="bear"
            style={{
              position: "absolute",
              bottom: "-25px",
              right: "20px",
              width: "170px",
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Barakhadi;
