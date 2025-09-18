import React, { useState, useRef, useEffect } from "react";
import image1Img from "../../assets/image1.svg";
import image2Img from "../../assets/image2.svg";
import image3Img from "../../assets/image3.svg";
import image4Img from "../../assets/image4.svg";
import image5Img from "../../assets/image5.svg";
import profileImg from "../../assets/prfiile.svg";
import crossImg from "../../assets/cross.svg";
import circleImg from "../../assets/circlee.svg";
import nextImg from "../../assets/nexxt.svg";
import {
  level13,
  level14,
  level10,
  level11,
  level12,
  level15,
} from "../../utils/levelData";
import MainLayout from "../Layouts.jsx/MainLayout";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import spinnerStop from "../../assets/pause.png";
import listenImg2 from "../../assets/listen.png";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
} from "../../utils/constants";
import correctSound from "../../assets/correct.wav";
import raMic from "../../assets/listen.png";
import raStop from "../../assets/pause.png";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

const levelMap = {
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
};

const theme = createTheme();

const audioData = [
  {
    audio: "appleAudio",
    text: "Tommy received a bright red balloon at the fair.",
  },
  {
    audio: "appleAudio",
    text: "As he was walking home, a strong wind blew the balloon out of his hand.",
  },
  { audio: "appleAudio", text: "Tommy chased after it, but it was too fast." },
  {
    audio: "appleAudio",
    text: "A friendly neighbour saw the balloon and grabbed it with a long walking stick.",
  },
  {
    audio: "appleAudio",
    text: "She returned the balloon to Tommy, who was very happy.",
  },
];

const imagesData = [
  { img: image2Img, id: "1" },
  { img: image3Img, id: "4" },
  { img: image4Img, id: "3" },
  { img: image1Img, id: "5" },
  { img: image5Img, id: "2" },
];

function ArrangePicture({
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
}) {
  const [placedImages, setPlacedImages] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [wrongAttempts, setWrongAttempts] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);
  const [audioIndex, setAudioIndex] = useState(0);
  const [isPressedOnce, setIsPressedOnce] = useState(false);
  const utteranceRef = useRef(null);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [isReadAloudPlaying, setIsReadAloudPlaying] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );
  const lang = getLocalData("lang");

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  const getConversation = (level, currentLevel) => {
    const levelData = levelMap[level];
    const conversationObj = levelData?.find(
      (item) => item.level === currentLevel
    );
    return conversationObj?.data || [];
  };

  let progressDatas = getLocalData("practiceProgress");
  //const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.name || "P3";

  const conversation = getConversation(level, currentLevel);
  const allTexts = conversation?.audioData?.[audioIndex]?.text;

  const handleNextStep = () => {
    if (isReadAloudPlaying) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setHighlightedWord(null);
      setIsReadAloudPlaying(false);
      //return;
    }
    if (audioIndex < conversation?.audioData?.length - 1) {
      setAudioIndex(audioIndex + 1);
      setIsPressedOnce(false);
    } else {
      setStep(2);
    }
  };

  const handleNextTask = () => {
    if (isReadAloudPlaying) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setHighlightedWord(null);
      setIsReadAloudPlaying(false);
      //return;
    }
    handleNext();
    setPlacedImages([null, null, null, null, null]);
    setWrongAttempts([false, false, false, false, false]);
    setStep(1);
    setIsPlaying(false);
    setAudioInstance(null);
    setAudioIndex(0);
  };

  const handleImageClick = (image) => {
    const emptyIndex = placedImages.findIndex((item) => item === null);

    if (emptyIndex !== -1) {
      if (image.id === (emptyIndex + 1).toString()) {
        const updatedPlacedImages = [...placedImages];
        updatedPlacedImages[emptyIndex] = image;
        setPlacedImages(updatedPlacedImages);
      } else {
        const updatedWrongAttempts = [...wrongAttempts];
        updatedWrongAttempts[emptyIndex] = true;
        setWrongAttempts(updatedWrongAttempts);

        setTimeout(() => {
          const resetWrongAttempts = [...wrongAttempts];
          resetWrongAttempts[emptyIndex] = false;
          setWrongAttempts(resetWrongAttempts);
        }, 1000);
      }
    }
  };

  const handleReadAloud = () => {
    setIsPressedOnce(true);
    if (isReadAloudPlaying) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setHighlightedWord(null);
      setIsReadAloudPlaying(false);
      return;
    }
    setIsReadAloudPlaying(true);

    const utterance = new SpeechSynthesisUtterance(allTexts);
    utteranceRef.current = utterance;

    utterance.onboundary = (event) => {
      const charIndex = event.charIndex;
      const words = allTexts.split(" ");
      let cumulativeLength = 0;
      let currentWordIndex = 0;

      for (let i = 0; i < words.length; i++) {
        cumulativeLength += words[i].length + 1;
        if (cumulativeLength > charIndex) {
          currentWordIndex = i;
          break;
        }
      }

      setHighlightedWord({
        word: words[currentWordIndex],
        index: currentWordIndex,
      });
    };

    utterance.onend = () => {
      utteranceRef.current = null;
      setHighlightedWord(null);
      setIsReadAloudPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const isAllCorrect = placedImages.every(
    (image, index) => image && image.id === (index + 1).toString()
  );

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m7"}
      //answer={answer}
      //isRecordingComplete={isRecordingComplete}
      parentWords={parentWords}
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
      <ThemeProvider theme={theme}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#BFE981",
            padding: "0px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "90%",
              height: "90%",
              backgroundColor: "white",
              borderRadius: "20px",
              margin: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {step === 1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  alignItems: "center",
                  margin: "50px",
                }}
              >
                <p
                  style={{
                    fontSize: isMobile ? "16px" : "20px",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Please listen to the audio {audioIndex + 1}
                </p>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    width: "100%",
                    lineHeight: "2",
                    marginTop: "25px",
                    textAlign: "center",
                    // alignContent: "center",
                    // display: "flex",
                    // alignSelf: "center",
                    // alignItems: "center",
                    // justifyContent: "center"
                  }}
                >
                  {allTexts?.split(" ").map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      style={{
                        backgroundColor:
                          highlightedWord && highlightedWord.index === wordIndex
                            ? "#833B1C40"
                            : "transparent",
                        transition: "background-color 0.2s ease",
                        border:
                          highlightedWord && highlightedWord.index === wordIndex
                            ? "1px solid #42210B"
                            : "none",
                        color: "#000000",
                        fontSize: isMobile ? "14px" : "18px",
                        fontWeight: "500",
                        textAlign: "center",
                        alignContent: "center",
                        alignSelf: "center",
                        alignItems: "center",
                        width: "50px",
                      }}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </div>
                <div
                  style={{ display: "flex", gap: "20px", marginTop: "50px" }}
                >
                  <img
                    src={isReadAloudPlaying ? spinnerStop : listenImg2}
                    alt="Start"
                    height={isMobile ? "35px" : "50px"}
                    width={isMobile ? "35px" : "50px"}
                    onClick={handleReadAloud}
                    style={{ cursor: "pointer" }}
                  />
                  <div
                    onClick={() => {
                      if (isPressedOnce) {
                        handleNextStep();
                        handleNext();
                      }
                    }}
                    className="flex items-center"
                    style={{
                      cursor: isPressedOnce ? "pointer" : "not-allowed",
                    }}
                  >
                    <NextButtonRound
                      height={isMobile ? 35 : 50}
                      width={isMobile ? 35 : 50}
                    />
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <>
                <h2
                  style={{
                    //fontFamily: "PoetsenOne",
                    fontSize: isMobile ? "16px" : "24px",
                    fontWeight: "bold",
                    color: "#000000",
                    marginBottom: "20px",
                  }}
                >
                  Arrange the Pictures
                </h2>

                {isAllCorrect && (
                  <p
                    style={{
                      //fontFamily: "DynaPuff",
                      fontSize: isMobile ? "16px" : "24px",
                      fontWeight: "bold",
                      color: "#58CC02",
                      marginBottom: "20px",
                    }}
                  >
                    Great Work
                  </p>
                )}

                <div
                  style={{
                    display: isMobile ? "grid" : "flex",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    justifyItems: "center",
                    gap: "20px",
                    margin: "20px 0",
                  }}
                >
                  {Array.from({ length: 5 }).map((_, index) => {
                    const isLastRowFirstItem = index === 4;

                    return (
                      <div
                        key={index}
                        style={{
                          gridColumn: isLastRowFirstItem ? "1 / -1" : undefined,
                          width: isMobile
                            ? "75px"
                            : isLandscape
                            ? "85px"
                            : "120px",
                          height: isMobile
                            ? "75px"
                            : isLandscape
                            ? "85px"
                            : "120px",
                          backgroundColor: "#FFEFE6",
                          border: placedImages[index]
                            ? "none"
                            : "2px dashed #FF8C8C",
                          borderRadius: "10px",
                          position: "relative",
                          display: "flex",
                          alignItems: "cen ter",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        {placedImages[index] && (
                          <>
                            <img
                              src={
                                getAssetUrl(
                                  s3Assets[placedImages[index].img]
                                ) || Assets[placedImages[index].img]
                              }
                              alt={`Placed Image ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "5px",
                                left: "5px",
                                width: "15px",
                                height: "15px",
                                backgroundColor: "white",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: isMobile ? "10px" : "14px",
                                fontWeight: "bold",
                                color: "black",
                                border: "1px solid #000",
                              }}
                            >
                              {index + 1}
                            </div>
                          </>
                        )}

                        {wrongAttempts[index] && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <img
                              src={crossImg}
                              alt="Wrong Attempt"
                              style={{
                                width: isMobile ? "36px" : "30px",
                                height: isMobile ? "36px" : "30px",
                              }}
                            />
                            <p
                              style={{
                                marginTop: "5px",
                                color: "#000000",
                                fontSize: isMobile ? "12px" : "14px",
                                fontWeight: "bold",
                              }}
                            >
                              Wrong
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isAllCorrect && (
                  <div
                    onClick={handleNextTask}
                    style={{ textAlign: "center", marginTop: "20px" }}
                  >
                    <NextButtonRound
                      height={isMobile ? 35 : 50}
                      width={isMobile ? 35 : 50}
                    />
                  </div>
                )}

                <div
                  style={{
                    display: isMobile ? "grid" : "flex",
                    gridTemplateColumns: isMobile
                      ? "repeat(2, 1fr)"
                      : undefined,
                    justifyContent: "center",
                    justifyItems: "center",
                    gap: "25px",
                    margin: "20px 0px",
                  }}
                >
                  {conversation?.images?.map((image, index) =>
                    placedImages.some(
                      (placed) => placed && placed.id === image.id
                    ) ? null : (
                      <div
                        key={image.id}
                        style={{
                          gridColumn: index === 4 ? "1 / -1" : undefined,
                          width: isMobile
                            ? "75px"
                            : isLandscape
                            ? "85px"
                            : "120px",
                          height: isMobile
                            ? "75px"
                            : isLandscape
                            ? "85px"
                            : "120px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(image)}
                      >
                        <img
                          src={
                            getAssetUrl(s3Assets[image.img]) ||
                            Assets[image.img]
                          }
                          alt={`Image ${image.id}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </ThemeProvider>
    </MainLayout>
  );
}

export default ArrangePicture;
