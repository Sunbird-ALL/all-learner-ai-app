import React, { useState, useMemo, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Dialog,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  dataEn as letterDataEn,
  dataHi as letterDataHi,
  dataTe as letterDataTe,
  dataKn as letterDataKn,
  dataNe as letterDataNe,
} from "../../RFlow/LetterTrain";

import {
  wordData,
  TeluguGunithas,
  KannadaGunithas,
  HindiGunithas,
  NepaliGunithas,
} from "../../RFlow/Barakhadi";
import { getAssetAudioUrl, getAssetUrl } from "../../utils/rFlowS3Links";
import { interact } from "../../services/telemetryService";
import { motion, AnimatePresence } from "framer-motion";
import { getFontFamily } from "../../utils/fontUtils";

const getCardAnimation = (compact, veryCompact) =>
  compact || veryCompact
    ? { scale: [1, 1.04, 1], y: 0 }
    : { scale: [1, 1.12, 1], y: [0, -14, 0] };

const getCardHeight = (veryCompact, compact) => {
  if (veryCompact) return "200px";
  if (compact) return "290px";
  return "270px";
};

const getImageMaxHeight = (veryCompact, compact) => {
  if (veryCompact) return "80px";
  if (compact) return "140px";
  return "140px";
};

const getCardBoxSx = (isActive, cardHeight) => ({
  bgcolor: "#FFFFFF",
  borderRadius: "16px",
  pt: 2.5,
  px: 1.5,
  pb: 1.5,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  height: cardHeight,
  overflow: "hidden",
  cursor: "pointer",
  boxShadow: isActive
    ? "0 0 0 3px #6366f1, 0 14px 30px rgba(0,0,0,0.25)"
    : "0 4px 12px rgba(0,0,0,0.1)",
  transition: "box-shadow 0.3s ease",
  "&:hover": { transform: "scale(1.02)" },
});

const TeluguGunithaCard = ({
  item,
  playAudio,
  isActive,
  compact,
  veryCompact,
}) => {
  const activeAnimation = getCardAnimation(compact, veryCompact);
  const cardHeight = getCardHeight(veryCompact, compact);

  return (
    <motion.div
      animate={isActive ? activeAnimation : { scale: 1, y: 0 }}
      transition={
        isActive
          ? { duration: 0.6, ease: "easeOut" }
          : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
      }
      style={{ position: "relative", zIndex: isActive ? 1 : 0 }}
    >
      <Box
        sx={getCardBoxSx(isActive, cardHeight)}
        onClick={() => playAudio(item)}
      >
        {/* Top Row — audio icon right-aligned */}
        <Box
          sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
        >
          <IconButton
            size="small"
            sx={{ color: "#333F61" }}
            onClick={(e) => {
              e.stopPropagation();
              playAudio(item);
            }}
          >
            <VolumeUpIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>
        </Box>

        {/* Image — flex:1 fills remaining space, contain shows full image */}
        <Box
          sx={{
            width: "100%",
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.label || ""}
              style={{
                maxWidth: "100%",
                maxHeight: getImageMaxHeight(veryCompact, compact),
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

TeluguGunithaCard.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    image: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  playAudio: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  compact: PropTypes.bool,
  veryCompact: PropTypes.bool,
};

const renderHighlightedWord = (item, isActive) => {
  const originalWord = item.word || "";
  const displayVal = item.display || "";

  if (!isActive || !displayVal || !originalWord) {
    return (
      originalWord.charAt(0).toUpperCase() + originalWord.slice(1).toLowerCase()
    );
  }

  const capitalizedWord =
    originalWord.charAt(0).toUpperCase() + originalWord.slice(1).toLowerCase();
  const lowerWord = capitalizedWord.toLowerCase();
  const lowerHighlight = displayVal.toLowerCase();

  const index = lowerWord.indexOf(lowerHighlight);
  if (index === -1) return capitalizedWord;

  const before = capitalizedWord.substring(0, index);
  const middle = capitalizedWord.substring(index, index + displayVal.length);
  const after = capitalizedWord.substring(index + displayVal.length);

  return (
    <>
      {before}
      <span
        style={{
          fontWeight: "bold",
          color: "#e53935",
          textDecoration: "underline",
          textDecorationColor: "#e53935",
        }}
      >
        {middle}
      </span>
      {after}
    </>
  );
};

const getLetterFontSize = (lang, mode) => {
  if (lang === "te") {
    return mode === "alphabet" ? "3.1rem" : "2.5rem";
  }
  return mode === "alphabet" ? "2.8rem" : "2.2rem";
};

const AlphabetCard = ({
  item,
  playAudio,
  isActive,
  mode,
  lang,
  compact,
  veryCompact,
}) => {
  const activeAnimation = getCardAnimation(compact, veryCompact);
  const cardHeight = getCardHeight(veryCompact, compact);

  const handleCardClick = () => {
    if (mode === "alphabet" && item.alaphabetChartAudio) {
      playAudio(item, item.alaphabetChartAudio);
    } else {
      playAudio(item);
    }
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
    handleCardClick();
  };

  return (
    <motion.div
      animate={isActive ? activeAnimation : { scale: 1, y: 0 }}
      transition={
        isActive
          ? { duration: 0.6, ease: "easeOut" }
          : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
      }
      style={{ position: "relative", zIndex: isActive ? 1 : 0 }}
    >
      <Box sx={getCardBoxSx(isActive, cardHeight)} onClick={handleCardClick}>
        {/* Top Row */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: lang === "te" ? "normal" : "bold",
              color: isActive && mode === "alphabet" ? "#e53935" : "#333F61",
              textDecoration:
                isActive && mode === "alphabet" ? "underline" : "none",
              textDecorationColor: "#e53935",
              fontSize: getLetterFontSize(lang, mode),
              width: "100%",
              fontFamily: getFontFamily(lang || "en"),
            }}
          >
            {item.display}
          </Typography>

          <IconButton
            size="small"
            sx={{ color: "#333F61" }}
            onClick={handleIconClick}
          >
            <VolumeUpIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>
        </Box>

        {/* Image */}
        <Box
          sx={{
            width: "100%",
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.word}
              style={{
                maxWidth: "100%",
                maxHeight: getImageMaxHeight(veryCompact, compact),
                objectFit: "contain",
              }}
            />
          )}
        </Box>

        {/* Word */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#333F61",
            textAlign: "center",
            fontSize: "1.5rem",
            fontFamily: getFontFamily(lang || "en"),
            lineHeight: 1.3,
          }}
        >
          {renderHighlightedWord(item, isActive)}
        </Typography>
      </Box>
    </motion.div>
  );
};

AlphabetCard.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    display: PropTypes.string,
    word: PropTypes.string,
    image: PropTypes.string,
    audio: PropTypes.string,
    alaphabetChartAudio: PropTypes.string,
  }).isRequired,
  playAudio: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  compact: PropTypes.bool,
  veryCompact: PropTypes.bool,
};

const HINDI_ORDER = [
  "अ",
  "आ",
  "इ",
  "ई",
  "उ",
  "ऊ",
  "ऋ",
  "ए",
  "ऐ",
  "ओ",
  "औ",
  "अं",
  "अः",
  "क",
  "ख",
  "ग",
  "घ",
  "ङ",
  "च",
  "छ",
  "ज",
  "झ",
  "ञ",
  "ट",
  "ठ",
  "ड",
  "ढ",
  "ण",
  "त",
  "थ",
  "द",
  "ध",
  "न",
  "प",
  "फ",
  "ब",
  "भ",
  "म",
  "य",
  "र",
  "ल",
  "व",
  "श",
  "ष",
  "स",
  "ह",
  "क्ष",
  "त्र",
  "ज्ञ",
];

const NEPALI_ORDER = [
  "अ",
  "आ",
  "इ",
  "ई",
  "उ",
  "ऊ",
  "ऋ",
  "ए",
  "ऐ",
  "ओ",
  "औ",
  "अं",
  "अः",
  "क",
  "ख",
  "ग",
  "घ",
  "ङ",
  "च",
  "छ",
  "ज",
  "झ",
  "ञ",
  "ट",
  "ठ",
  "ड",
  "ढ",
  "ण",
  "त",
  "थ",
  "द",
  "ध",
  "न",
  "प",
  "फ",
  "ब",
  "भ",
  "म",
  "य",
  "र",
  "ल",
  "व",
  "श",
  "ष",
  "स",
  "ह",
  "क्ष",
  "त्र",
  "ज्ञ",
];

const TELUGU_ORDER = [
  "అ",
  "ఆ",
  "ఇ",
  "ఈ",
  "ఉ",
  "ఊ",
  "ఋ",
  "ౠ",
  "ఎ",
  "ఏ",
  "ఐ",
  "ఒ",
  "ఓ",
  "ఔ",
  "అం",
  "అః",
  "క",
  "ఖ",
  "గ",
  "ఘ",
  "ఙ",
  "చ",
  "ఛ",
  "జ",
  "ఝ",
  "ఞ",
  "ట",
  "ఠ",
  "డ",
  "ఢ",
  "ణ",
  "త",
  "థ",
  "ద",
  "ధ",
  "న",
  "ప",
  "ఫ",
  "బ",
  "భ",
  "మ",
  "య",
  "ర",
  "ల",
  "వ",
  "శ",
  "ష",
  "స",
  "హ",
  "ళ",
  "క్ష",
  "ఱ",
];

const KANNADA_ORDER = [
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
  "ಕ",
  "ಖ",
  "ಗ",
  "ಘ",
  "ಙ",
  "ಚ",
  "ಛ",
  "ಜ",
  "ಝ",
  "ಞ",
  "ಟ",
  "ಠ",
  "ಡ",
  "ಢ",
  "ಣ",
  "ತ",
  "ಥ",
  "ದ",
  "ಧ",
  "ನ",
  "ಪ",
  "ಫ",
  "ಬ",
  "ಭ",
  "ಮ",
  "ಯ",
  "ರ",
  "ಲ",
  "ವ",
  "ಶ",
  "ಷ",
  "ಸ",
  "ಹ",
  "ಳ",
  "ಕ್ಷ",
  "ಜ್ಞ",
];

const buildOrderMap = (order) =>
  order.reduce((acc, letter, index) => {
    acc[letter] = index;
    return acc;
  }, {});

export const HINDI_ORDER_MAP = buildOrderMap(HINDI_ORDER);
export const NEPALI_ORDER_MAP = buildOrderMap(NEPALI_ORDER);
export const TELUGU_ORDER_MAP = buildOrderMap(TELUGU_ORDER);
export const KANNADA_ORDER_MAP = buildOrderMap(KANNADA_ORDER);

const ORDER_MAPS = {
  hi: HINDI_ORDER_MAP,
  ne: NEPALI_ORDER_MAP,
  te: TELUGU_ORDER_MAP,
  kn: KANNADA_ORDER_MAP,
};

export const sortByLangOrder = (a, b, activeLang) => {
  const map = ORDER_MAPS[activeLang];
  if (map) {
    const aIndex = map[a.display] ?? Number.MAX_SAFE_INTEGER;
    const bIndex = map[b.display] ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  }
  return (a.display || "").localeCompare(b.display || "", activeLang);
};

const AlphabetChart = ({ open, onClose, lang }) => {
  const [winSize, setWinSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setWinSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCompact = winSize.height <= 900 && winSize.width >= 900;
  const isVeryCompact = winSize.height <= 820 && winSize.width >= 900;
  const [currentPage, setCurrentPage] = useState(0);
  const [playingKey, setPlayingKey] = useState(null);
  const [viewMode, setViewMode] = useState("alphabet"); // "alphabet" | "word"
  const [activeCardKey, setActiveCardKey] = useState(null);

  const audioRef = useRef(null);
  const currentSrcRef = useRef(null);

  // Normalize lang to ensure it's at least undefined (safe for localeCompare) and not null
  const activeLang = lang || "en";

  // Stop audio on unmount
  useEffect(() => {
    return () => stopAudio();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Stop audio when dialog is closed
  useEffect(() => {
    if (!open) stopAudio();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const itemsPerPage = 6;

  const rawData = useMemo(() => {
    if (lang === "hi") return letterDataHi;
    if (lang === "te") return letterDataTe;
    if (lang === "kn") return letterDataKn;
    if (lang === "en") return letterDataEn;
    if (lang === "ne") return letterDataNe;
    return []; // Return empty array for unsupported languages (like "ta")
  }, [lang]);

  const alphabetItems = useMemo(() => {
    return rawData
      .filter((group) => "letter" in group && group.letter)
      .map((group) => {
        const first = group.items?.[0] || {};

        return {
          key: group.letter,
          display: group.letter,
          word: first.word || "",
          image: first.image || "",
          audio: first.singleAudio || first.audio || "",
          alaphabetChartAudio: first.alaphabetChartAudio || "",
        };
      })
      .filter((item) => item.display && item.word && item.audio && item.image)
      .sort((a, b) => sortByLangOrder(a, b, activeLang));
  }, [rawData, activeLang]);

  const wordItems = useMemo(() => {
    let gunithaSource = null;
    if (activeLang === "te") {
      gunithaSource = TeluguGunithas;
    } else if (activeLang === "kn") {
      gunithaSource = KannadaGunithas;
    } else if (activeLang === "hi") {
      gunithaSource = HindiGunithas;
    } else if (activeLang === "ne") {
      gunithaSource = NepaliGunithas;
    }

    const gunithaItems = gunithaSource
      ? gunithaSource
          .map((g, idx) => ({
            key: `${activeLang}-gunitha-${idx}`,
            display: "",
            word: "",
            label: g.audio ? g.audio.replace(/\.wav$/i, "") : "",
            image: getAssetUrl(g.image) || "",
            audio: g.audio ? getAssetAudioUrl(g.audio) : "",
            isGunitha: true,
          }))
          .filter((item) => item.image && item.audio)
      : [];

    if (activeLang !== "en" && wordData[activeLang]) {
      const syllableItems = wordData[activeLang]
        .map((itm, idx) => ({
          key: `${activeLang}-${idx}`,
          display: itm.text,
          word: itm.text,
          image: getAssetUrl(itm.image) || "",
          audio: (itm.audio ? getAssetAudioUrl(itm.audio) : "") || "",
        }))
        .filter(
          (item) => item.display && item.word && item.audio && item.image
        );
      return [...gunithaItems, ...syllableItems];
    }

    const syllableItems = rawData
      .filter((group) => "syllable" in group && group.syllable)
      .map((group) => {
        const first = group.items?.[0] || {};

        return {
          key: group.syllable,
          display: group.syllable,
          word: first.word || "",
          image: first.image || "",
          audio: first.audio || first.singleAudio || "",
        };
      })
      .filter((item) => item.display && item.word && item.audio && item.image);

    return [...gunithaItems, ...syllableItems];
  }, [rawData, activeLang]);

  const data = viewMode === "alphabet" ? alphabetItems : wordItems;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    currentSrcRef.current = null;
    setPlayingKey(null);
    setActiveCardKey(null);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      interact(
        "ET",
        `Page Navigate : Next (Page ${currentPage + 2})`,
        "alphabet-chart"
      );
      stopAudio();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      interact(
        "ET",
        `Page Navigate : Previous (Page ${currentPage})`,
        "alphabet-chart"
      );
      stopAudio();
      setCurrentPage((prev) => prev - 1);
    }
  };

  const playAudio = (item, specificAudio = null) => {
    const audioSrc = specificAudio || item.audio;
    if (!audioSrc) return;

    // If same source is already playing, do nothing
    if (playingKey === item.key && currentSrcRef.current === audioSrc) {
      return;
    }

    interact(
      "ET",
      `Card Click : ${viewMode === "alphabet" ? "Alphabet" : "Syllable"} - ${
        item.display || item.label || ""
      }`,
      "alphabet-chart"
    );

    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setActiveCardKey(item.key);
    setPlayingKey(item.key);
    currentSrcRef.current = audioSrc;

    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    const resetAudio = () => {
      setPlayingKey(null);
      setActiveCardKey(null);
      currentSrcRef.current = null;
      audioRef.current = null;
    };
    audio.onended = resetAudio;
    audio.onerror = resetAudio;
    audio.play().catch(resetAudio);
  };

  const getToggleLabel = (type) => {
    const labels = {
      en: { alphabet: "Alphabet", syllable: "Syllable" },
      hi: { alphabet: "वर्णमाला", syllable: "मात्रा" },
      te: { alphabet: "అక్షరమాల", syllable: "గుణింతాలు" },
      kn: { alphabet: "ಅಕ್ಷರಮಾಲೆ", syllable: "ಗುಣಿತಾಕ್ಷರ" },
      ta: { alphabet: "எழுத்துக்கள்", syllable: "சொற்கள்" },
      ne: { alphabet: "वर्णमाला", syllable: "मात्रा" },
    };

    return labels[lang]?.[type] || labels.en[type];
  };

  useEffect(() => {
    stopAudio();
    setCurrentPage(0);
  }, [viewMode, activeLang]); // eslint-disable-line react-hooks/exhaustive-deps

  const navButtonSx = {
    bgcolor: "#FFFFFF",
    color: "#333F61",
    fontWeight: "bold",
    px: 4,
    py: 1,
    borderRadius: "50px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    "&:hover": { bgcolor: "#f0f0f0" },
    "&.Mui-disabled": {
      bgcolor: "rgba(0,0,0,0.1)",
      color: "rgba(0,0,0,0.3)",
    },
  };

  if (!open) return null;

  return (
    <Dialog
      fullScreen
      // width="90%"
      // maxWidth="1200px"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#e9eef1",
          color: "#000000",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(25px)",
          zIndex: 9999,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          py: isVeryCompact ? { xs: 1.5, sm: 1.5 } : { xs: 2, sm: 2.5 },
          px: isVeryCompact ? { xs: 2, sm: 2 } : { xs: 2, sm: 2.5 },
          mt: 9,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#e0e7ec",
          borderBottom: "1px solid #d1dbe0",
        }}
      >
        {/* CENTER — Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode) {
              interact(
                "ET",
                `View Toggle : ${
                  newMode === "alphabet" ? "Alphabet" : "Syllable"
                }`,
                "alphabet-chart"
              );
              setViewMode(newMode);
            }
          }}
          aria-label="view mode"
          sx={{
            "& .MuiToggleButton-root": {
              px: isVeryCompact ? { xs: 2, sm: 3 } : { xs: 3, sm: 4 },
              py: isVeryCompact ? { xs: 0.5, sm: 0.7 } : { xs: 1, sm: 1.2 },
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontWeight: 600,
              borderRadius: "12px !important",
              textTransform: "none",

              // 👇 border for unselected
              border: "2px solid #94a3b8",
              color: "#334155",
              backgroundColor: "#f8fafc",

              transition: "all 0.2s ease",
            },

            "& .Mui-selected": {
              bgcolor: "#333F61 !important",
              color: "#fff !important",
              borderColor: "#333F61",
              boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
            },

            "& .MuiToggleButtonGroup-grouped": {
              mx: 0.5,
            },
          }}
        >
          <ToggleButton value="alphabet">
            {getToggleLabel("alphabet")}
          </ToggleButton>

          <ToggleButton value="syllable">
            {getToggleLabel("syllable")}
          </ToggleButton>
        </ToggleButtonGroup>

        {/* RIGHT — Close */}
        <Box sx={{ position: "absolute", right: { xs: 16, sm: 24 } }}>
          <IconButton
            onClick={() => {
              interact("ET", "Close Alphabet Chart", "alphabet-chart");
              onClose();
            }}
            size="medium"
            aria-label="Close"
            sx={{
              color: "#111827",
              bgcolor: "rgba(255,255,255,0.7)",
              borderRadius: "50%",
              "&:hover": {
                bgcolor: "#f3f4f6",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: "1.7rem", sm: "1.5rem" } }} />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          py: isVeryCompact
            ? { xs: 0.5, md: 0.5 }
            : isCompact
            ? { xs: 0.75, md: 1 }
            : { xs: 2, md: 4 },
          px: isVeryCompact
            ? { xs: 1, md: 1 }
            : isCompact
            ? { xs: 1, md: 1.5 }
            : { xs: 2, md: 4 },
          overflowY: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 4, md: 6 },
                bgcolor: "rgba(255, 255, 255, 0.6)",
                borderRadius: "24px",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                maxWidth: "500px",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "#333F61",
                  fontWeight: "bold",
                  mb: 2,
                  fontFamily: "Quicksand, sans-serif",
                }}
              >
                No Data Found
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.5 }}
              >
                Sorry, we don't have any{" "}
                {viewMode === "alphabet" ? "alphabets" : "syllables"} for this
                language yet.
              </Typography>
            </Box>
          </motion.div>
        ) : (
          <Box
            sx={{
              my: "auto",
              width: "100%",
              maxWidth: isVeryCompact ? "900px" : "1080px",
            }}
          >
            <Grid container spacing={isCompact ? 2 : 3}>
              <AnimatePresence mode="wait">
                {currentItems.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={item.key}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                      style={{
                        position: "relative",
                        zIndex: activeCardKey === item.key ? 1 : 0,
                      }}
                    >
                      {item.isGunitha ? (
                        <TeluguGunithaCard
                          item={item}
                          playAudio={playAudio}
                          isActive={activeCardKey === item.key}
                          compact={isCompact}
                          veryCompact={isVeryCompact}
                        />
                      ) : (
                        <AlphabetCard
                          lang={activeLang}
                          item={item}
                          playAudio={playAudio}
                          isAnimating={playingKey === item.key}
                          isActive={activeCardKey === item.key}
                          mode={viewMode}
                          compact={isCompact}
                          veryCompact={isVeryCompact}
                        />
                      )}
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Footer */}

      <Box
        sx={{
          py: isVeryCompact ? 1.5 : isCompact ? 2 : 3,
          px: isVeryCompact ? 2 : isCompact ? 3 : 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBackIosIcon />}
          onClick={handlePrev}
          disabled={currentPage === 0}
          sx={navButtonSx}
        >
          Previous
        </Button>

        <Typography sx={{ fontWeight: "bold", color: "#000000" }}>
          Page {currentPage + 1} of {totalPages || 1}
        </Typography>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIosIcon />}
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          sx={navButtonSx}
        >
          Next
        </Button>
      </Box>
    </Dialog>
  );
};

AlphabetChart.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

export default AlphabetChart;
