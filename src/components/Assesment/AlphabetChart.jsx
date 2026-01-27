import React, { useState, useMemo, useEffect, useRef } from "react";
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
} from "../../RFlow/LetterTrain";

import { wordData } from "../../RFlow/Barakhadi";
import { getAssetAudioUrl, getAssetUrl } from "../../utils/rFlowS3Links";
import { motion, AnimatePresence } from "framer-motion";

const AlphabetCard = ({ item, playAudio, isActive, mode }) => {
  const renderHighlightedWord = () => {
    const originalWord = item.word || "";
    const displayVal = item.display || "";

    if (!isActive || !displayVal || !originalWord) {
      return (
        originalWord.charAt(0).toUpperCase() +
        originalWord.slice(1).toLowerCase()
      );
    }

    // Manual capitalization for the whole word first
    const capitalizedWord =
      originalWord.charAt(0).toUpperCase() +
      originalWord.slice(1).toLowerCase();
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
            borderBottom: "3px solid #ff0000",
            paddingBottom: "1px",
            display: "inline-block",
            lineHeight: "1",
          }}
        >
          {middle}
        </span>
        {after}
      </>
    );
  };

  return (
    <motion.div
      animate={
        isActive ? { scale: [1, 1.12, 1], y: [0, -14, 0] } : { scale: 1, y: 0 }
      }
      transition={
        isActive
          ? { duration: 0.6, ease: "easeOut" }
          : {
              duration: 0.7, // 👈 slow & calm return
              ease: [0.22, 1, 0.36, 1], // natural easing
            }
      }
      style={{ position: "relative" }}
    >
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "240px",
          cursor: "pointer",

          boxShadow: isActive
            ? "0 0 0 3px #6366f1, 0 14px 30px rgba(0,0,0,0.25)"
            : "0 4px 12px rgba(0,0,0,0.1)",

          transition: "box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
        onClick={() => {
          if (mode === "alphabet" && item.alaphabetChartAudio) {
            playAudio(item, item.alaphabetChartAudio);
          } else {
            playAudio(item);
          }
        }}
      >
        {/* Top Row */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333F61",
              fontSize: mode === "alphabet" ? "3.8rem" : "2.8rem",
              width: "100%",
            }}
          >
            {item.display}
          </Typography>

          <IconButton
            size="small"
            sx={{ color: "#333F61" }}
            onClick={(e) => {
              e.stopPropagation();
              if (mode === "alphabet" && item.alaphabetChartAudio) {
                playAudio(item, item.alaphabetChartAudio);
              } else {
                playAudio(item);
              }
            }}
          >
            <VolumeUpIcon />
          </IconButton>
        </Box>

        {/* Image */}
        {item.image ? (
          <Box
            sx={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              my: 1,
              overflow: "hidden",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
              },
              transition: "transform 0.2s ease",
            }}
          >
            <img
              src={item.image}
              alt={item.word}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}

        {/* Word */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#333F61",
            textAlign: "center",
            fontSize: "1.5rem",
            mt: 1,
          }}
        >
          {renderHighlightedWord()}
        </Typography>
      </Box>
    </motion.div>
  );
};

const AlphabetChart = ({ open, onClose, lang }) => {
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
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const itemsPerPage = 8;

  const rawData = useMemo(() => {
    if (lang === "hi") return letterDataHi;
    if (lang === "te") return letterDataTe;
    if (lang === "kn") return letterDataKn;
    if (lang === "en") return letterDataEn;
    return []; // Return empty array for unsupported languages (like "ta")
  }, [lang]);

  const alphabetItems = useMemo(() => {
    return rawData
      .filter((group) => "letter" in group && group.letter) // only letter-based groups
      .map((group) => {
        const first = group.items?.[0] || {};
        console.log("first", first);

        return {
          key: group.letter,
          display: group.letter,
          word: first.word || "",
          image: first.image || "",
          audio: first.singleAudio || first.audio || "",
          alaphabetChartAudio: first.alaphabetChartAudio || "",
        };
      })
      .sort((a, b) =>
        (a.display || "").localeCompare(b.display || "", activeLang)
      );
  }, [rawData, activeLang]);

  const wordItems = useMemo(() => {
    if (activeLang !== "en" && wordData[activeLang]) {
      return wordData[activeLang].map((itm, idx) => ({
        key: `${activeLang}-${idx}`,
        display: itm.text,
        word: itm.text,
        image: getAssetUrl(itm.image) || "",
        audio: (itm.audio ? getAssetAudioUrl(itm.audio) : "") || "",
      }));
    }

    return rawData
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
      });
  }, [rawData, activeLang]);

  const data = viewMode === "alphabet" ? alphabetItems : wordItems;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentItems = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
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

    audio.onended = () => {
      setPlayingKey(null);
      setActiveCardKey(null);
      currentSrcRef.current = null;
      audioRef.current = null;
    };
    audio.onerror = () => {
      setPlayingKey(null);
      setActiveCardKey(null);
      currentSrcRef.current = null;
      audioRef.current = null;
    };
    audio.play().catch(() => {
      setPlayingKey(null);
      setActiveCardKey(null);
      currentSrcRef.current = null;
      audioRef.current = null;
    });
  };

  // const getTitle = () => {
  //   if (lang === "en") {
  //     return viewMode === "alphabet" ? "Alphabet Chart" : "Syllable Chart";
  //   }

  //   if (lang === "hi") {
  //     return viewMode === "alphabet" ? "वर्णमाला चार्ट" : "मात्रा चार्ट";
  //   }

  //   if (lang === "te") {
  //     return viewMode === "alphabet" ? "అక్షరమాల చార్ట్" : "గుణింతాల చార్ట్";
  //   }

  //   if (lang === "kn") {
  //     return viewMode === "alphabet" ? "ಅಕ್ಷರಮಾಲೆ ಚಾರ್ಟ್" : "ಗುಣಿತಾಕ್ಷರ ಚಾರ್ಟ್";
  //   }

  //   if (lang === "ta") {
  //     return viewMode === "alphabet"
  //       ? "எழுத்துக்கள் பட்டியல்"
  //       : "சொற்கள் பட்டியல்";
  //   }

  //   // Default for other languages or unknown
  //   return viewMode === "alphabet" ? "Alphabet Chart" : "Syllable Chart";
  // };

  useEffect(() => {
    setCurrentPage(0);
  }, [viewMode, activeLang]);

  if (!open) return null;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#e9eef1",
          color: "#000000",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(25px)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
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
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          aria-label="view mode"
          sx={{
            "& .MuiToggleButton-root": {
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.2 },
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
          <ToggleButton value="alphabet">Alphabet</ToggleButton>
          <ToggleButton value="word">Syllable</ToggleButton>
        </ToggleButtonGroup>

        {/* RIGHT — Close */}
        <Box sx={{ position: "absolute", right: { xs: 16, sm: 24 } }}>
          <IconButton
            onClick={onClose}
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
            <CloseIcon sx={{ fontSize: { xs: "2rem", sm: "2rem" } }} />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          overflowY: "auto",
          display: "flex",
          alignItems: "center",
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
          <Grid container spacing={3} sx={{ maxWidth: "1200px" }}>
            <AnimatePresence mode="wait">
              {currentItems.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={item.key}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                  >
                    <AlphabetCard
                      item={item}
                      playAudio={playAudio}
                      isAnimating={playingKey === item.key}
                      isActive={activeCardKey === item.key}
                      mode={viewMode}
                    />
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Box>

      {/* Footer */}

      <Box
        sx={{
          p: 3,
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
          sx={{
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
          }}
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
          sx={{
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
          }}
        >
          Next
        </Button>
      </Box>
    </Dialog>
  );
};

export default AlphabetChart;
