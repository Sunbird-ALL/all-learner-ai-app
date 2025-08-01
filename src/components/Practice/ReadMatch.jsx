import React, { useState, useEffect } from "react";
import bikeImg from "../../assets/bike.svg";
import lemonImg from "../../assets/Mango.svg";
import farmerImg from "../../assets/farmer.svg";
import background from "../../assets/background.svg";
import Confetti from "react-confetti";
import ulineImg from "../../assets/Uline.svg";
import fireImg from "../../assets/fire.svg";
import fanImg from "../../assets/fan.svg";
import tieImg from "../../assets/tie.svg";
import RememberImg from "../../assets/CanyouremImg.svg";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import { Log } from "../../services/telementryService";
import { useNavigate } from "react-router-dom";
import { setLocalData } from "../../utils/constants";

const theme = createTheme();

const ReadMatch = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [correctMatch, setCorrectMatch] = useState(null);
  const [isFaded, setIsFaded] = useState(false);
  const [wrongMatch, setWrongMatch] = useState({
    wordIndex: null,
    imageIndex: null,
  });
  const [showInitialSelection, setShowInitialSelection] = useState(false);
  const [shuffledImages, setShuffledImages] = useState([]);

  const wordImagePairs = [
    { word: "Bike", img: bikeImg, match: "Bike" },
    { word: "Lime", img: lemonImg, match: "Lime" },
    { word: "Farmer", img: farmerImg, match: "Farmer" },
    { word: "Fan", img: fanImg, match: "Fan" },
    { word: "Fire", img: fireImg, match: "Fire" },
    { word: "Tie", img: tieImg, match: "Tie" },
  ];

  const words = wordImagePairs.map((pair) => pair.word);
  const correctMatches = wordImagePairs.map((pair) => pair.match);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  console.log("matches", matches, wordImagePairs.length);

  useEffect(() => {
    setShuffledImages(shuffleArray(wordImagePairs));
  }, []);

  useEffect(() => {
    console.log("res", matches.length, wordImagePairs.length);

    if (matches.length === wordImagePairs.length) {
      setLocalData("readMatch", false);
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    }
  }, [matches]);

  const handleWordClick = (word, wordIndex) => {
    if (isMatchedWord(wordIndex)) return;
    setSelectedWord({ word, wordIndex });
    setSelectedImage(null);
    setWrongMatch({ wordIndex: null, imageIndex: null });
    setShowInitialSelection(false);
  };

  const handleImageClick = (imageIndex) => {
    if (!selectedWord) return;
    if (isMatchedImage(imageIndex)) return;

    setSelectedImage(imageIndex);
    setShowInitialSelection(true);

    if (shuffledImages[imageIndex].match === selectedWord.word) {
      setCorrectMatch({
        wordIndex: selectedWord.wordIndex,
        imageIndex: imageIndex,
      });

      setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => {
          setMatches([
            ...matches,
            {
              sourceIndex: imageIndex,
              wordIndex: selectedWord.wordIndex,
            },
          ]);
          setCorrectMatch(null);
          setShowConfetti(false);
          setIsFaded(true);
          setSelectedWord(null);
          setSelectedImage(null);
          setShowInitialSelection(false);
        }, 1000);
      }, 1000);
    } else {
      setTimeout(() => {
        setWrongMatch({
          wordIndex: selectedWord.wordIndex,
          imageIndex: imageIndex,
        });

        setTimeout(() => {
          setSelectedWord(null);
          setSelectedImage(null);
          setWrongMatch({ wordIndex: null, imageIndex: null });
          setShowInitialSelection(false);
        }, 1000);
      }, 1000);
    }
  };

  const isMatchedWord = (wordIndex) =>
    matches.some((m) => m.wordIndex === wordIndex);
  const isMatchedImage = (imageIndex) =>
    matches.some((m) => m.sourceIndex === imageIndex);
  const isCorrectMatchWord = (wordIndex) =>
    correctMatch?.wordIndex === wordIndex;
  const isCorrectMatchImage = (imageIndex) =>
    correctMatch?.imageIndex === imageIndex;
  const isWrongMatchWord = (wordIndex) => wrongMatch.wordIndex === wordIndex;
  const isWrongMatchImage = (imageIndex) =>
    wrongMatch.imageIndex === imageIndex;
  const isInitialSelection = (wordIndex, imageIndex) =>
    showInitialSelection &&
    selectedWord?.wordIndex === wordIndex &&
    selectedImage === imageIndex;

  const getImageStyle = (index) => {
    const isMatched = isMatchedImage(index);
    const isCorrect = isCorrectMatchImage(index) && showConfetti;
    const isSelected = selectedImage === index;
    const isWrong = isWrongMatchImage(index);
    const isDisabled = isMatched && !isCorrect;
    const isInitial = isInitialSelection(selectedWord?.wordIndex, index);

    return {
      border: isCorrect
        ? "1px solid #c1e2a7"
        : isWrong
        ? "1px solid #FF4B4B"
        : isDisabled
        ? "1px solid rgba(0,0,0,0.3)"
        : isInitial
        ? "1px solid #A856FF"
        : "1px solid #A856FF",
      borderRadius: "10px",
      padding: isMobile ? "5px" : "10px",
      width: isMobile ? "80px" : isTablet ? "120px" : "150px",
      height: isMobile ? "50px" : isTablet ? "75px" : "90px",
      backgroundColor: isCorrect
        ? "#DEF5CC"
        : isWrong
        ? "#FEE4D5"
        : isDisabled
        ? "rgba(255, 255, 255, 0.6)"
        : isInitial
        ? "#F6EEFF"
        : isSelected
        ? "#F6EEFF"
        : "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: isMatched ? "default" : "pointer",
      transition: "all 0.3s ease",
      opacity: isDisabled ? 0.8 : 1,
      boxShadow:
        !isMatched && selectedWord && selectedImage === null
          ? `1px 6px 0px rgba(168, 86, 255, 0.9)`
          : "none",
      transform: selectedImage === index ? "translateY(-2px)" : "translateY(0)",
    };
  };

  const getWordStyle = (wordIndex) => {
    const isMatched = isMatchedWord(wordIndex);
    const isCorrect = isCorrectMatchWord(wordIndex) && showConfetti;
    const isSelected = selectedWord?.wordIndex === wordIndex;
    const isDisabled = isMatched && !isCorrect;
    const isWrong = isWrongMatchWord(wordIndex);
    const isInitial = isInitialSelection(wordIndex, selectedImage);

    return {
      border: isCorrect
        ? "1px solid #c1e2a7"
        : isWrong
        ? "1px solid #FF4B4B"
        : isDisabled
        ? "1px solid rgba(0,0,0,0.3)"
        : isInitial
        ? "1px solid #A856FF"
        : "1px solid #A856FF",
      borderRadius: "10px",
      padding: isMobile ? "5px 10px" : "10px 20px",
      font: "Quicksand",
      backgroundColor: isCorrect
        ? "#DEF5CC"
        : isWrong
        ? "#FEE4D5"
        : isDisabled
        ? "rgba(255, 255, 255, 0.4)"
        : isInitial
        ? "#F6EEFF"
        : isSelected
        ? "#F6EEFF"
        : "#fff",
      cursor: isMatched ? "default" : "pointer",
      transition: "all 0.3s ease",
      opacity: isDisabled ? 0.5 : 1,
      fontFamily: "Quicksand, sans-serif",
      fontWeight: 400,
      fontSize: isMobile ? "16px" : isTablet ? "20px" : "24px",
      lineHeight: isMobile ? "16px" : isTablet ? "20px" : "24px",
      letterSpacing: "0px",
      color: "#1D2C5B",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: isMobile ? "20px" : isTablet ? "22px" : "25px",
      width: isMobile ? "80px" : isTablet ? "120px" : "150px",
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "relative",
          minHeight: "94vh",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          fontFamily: "Arial, sans-serif",
          padding: isMobile ? "18px 10px" : "18px 40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            padding: isMobile
              ? "40px 10px"
              : isTablet
              ? "40px 30px"
              : "40px 90px",
            width: "100%",
            maxWidth: isMobile ? "100%" : "1250px",
            height: "auto",
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: isMobile ? "70px" : "90px",
              backgroundImage: `url(${ulineImg})`,
              backgroundSize: isMobile
                ? "cover"
                : isTablet
                ? "cover"
                : "contain",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={RememberImg}
              alt="Can You Remember?"
              sx={{
                height: isMobile ? "14px" : "27px",
                margin: isMobile ? "15px auto" : "30px auto",
                marginBottom: isMobile ? "17px" : "37px",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: isMobile ? "50px" : "80px",
              gap: isMobile ? "5px" : "20px",
              flexDirection: isMobile ? "row" : "row",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? "13px" : "20px",
                alignItems: "center",
                width: isMobile ? "30%" : "auto",
              }}
            >
              {shuffledImages.slice(0, 3).map((item, index) => (
                <Box
                  key={index}
                  onClick={() =>
                    !isMatchedImage(index) && handleImageClick(index)
                  }
                  sx={getImageStyle(index)}
                >
                  <Box
                    component="img"
                    src={item.img}
                    alt={`image-${index}`}
                    sx={{
                      width: isMobile ? "30px" : "60px",
                      height: isMobile ? "30px" : "60px",
                      opacity: isMatchedImage(index) && isFaded ? 0.7 : 1,
                    }}
                  />
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: isMobile ? "4px" : "20px",
                fontFamily: "Quicksand",
                width: isMobile ? "30%" : "auto",
              }}
            >
              {words.map((word, i) => (
                <Box
                  key={i}
                  onClick={() => !isMatchedWord(i) && handleWordClick(word, i)}
                  sx={getWordStyle(i)}
                >
                  {word}
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? "13px" : "20px",
                alignItems: "center",
                width: isMobile ? "30%" : "auto",
              }}
            >
              {shuffledImages.slice(3).map((item, index) => (
                <Box
                  key={index + 3}
                  onClick={() =>
                    !isMatchedImage(index + 3) && handleImageClick(index + 3)
                  }
                  sx={getImageStyle(index + 3)}
                >
                  <Box
                    component="img"
                    src={item.img}
                    alt={`image-${index + 3}`}
                    sx={{
                      width: isMobile ? "30px" : "60px",
                      height: isMobile ? "30px" : "60px",
                      opacity: isMatchedImage(index + 3) && isFaded ? 0.7 : 1,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ReadMatch;
