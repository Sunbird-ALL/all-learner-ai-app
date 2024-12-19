import { Box, Card, CardContent, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import practicebgstone from "../../assets/images/practice-bg-stone.svg";
import practicebgstone2 from "../../assets/images/practice-bg-stone2.svg";
import practicebgstone3 from "../../assets/images/practice-bg-stone3.svg";
import practicebg from "../../assets/images/practice-bg.svg";
import practicebg2 from "../../assets/images/practice-bg2.svg";
import practicebg3 from "../../assets/images/practice-bg3.svg";
import gameWon from "../../assets/images/gameWon.svg";
import gameLost from "../../assets/images/gameLost.svg";
import correctImage from "../../assets/correct.svg";
import wrongImage from "../../assets/wrong.svg";
import turtleImage from "../../assets/turtle.svg";
import clouds from "../../assets/images/clouds.svg";
import catLoading from "../../assets/images/catLoading.gif";
import textureImage from "../../assets/images/textureImage.png";
import timer from "../../assets/images/timer.svg";
import playButton from "../../assets/listen.png";
import pauseButton from "../../assets/pause.png";
import {
  GreenTick,
  HeartBlack,
  Diamond,
  LevelEight,
  LevelFive,
  LevelFour,
  LevelNine,
  LevelOne,
  LevelSeven,
  LevelSix,
  LevelThree,
  LevelTwo,
  NextButton,
  callConfettiSnow,
  levelConfig,
  practiceSteps,
} from "../../utils/constants";

import { ProfileHeader } from "../Assesment/Assesment";
import Confetti from "react-confetti";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import gameLoseAudio from "../../assets/audio/gameLose.wav";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MainLayout = (props) => {
  const levelsImages = {
    1: {
      milestone: <LevelOne />,
      backgroundAddOn: practicebgstone,
      background: practicebg,
    },
    2: {
      milestone: <LevelTwo />,
      backgroundAddOn: practicebgstone2,
      background: practicebg2,
    },
    3: {
      milestone: <LevelThree />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
    },
    4: {
      milestone: <LevelFour />,
      backgroundAddOn: practicebgstone,
      background: practicebg3,
      backgroundColor: `${levelConfig[4].color}60`,
    },
    5: {
      milestone: <LevelFive />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[5].color}60`,
    },
    6: {
      milestone: <LevelSix />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[6].color}60`,
    },
    7: {
      milestone: <LevelSeven />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[7].color}60`,
    },
    8: {
      milestone: <LevelEight />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[8].color}60`,
    },
    9: {
      milestone: <LevelNine />,
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
  };

  const LEVEL = props?.level;
  const {
    handleNext,
    enableNext,
    showNext = true,
    showTimer = true,
    // showScore = true,
    nextLessonAndHome = false,
    cardBackground,
    backgroundImage,
    points = 0,
    progressData,
    showProgress,
    setOpenLangModal,
    lang,
    handleBack,
    disableScreen,
    isShowCase,
    startShowCase,
    contentType,
    percentage,
    fluency,
    setStartShowCase,
    livesData,
    gameOverData,
    loading,
    storedData,
    resetStoredData,
  } = props;

  const [shake, setShake] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const audioRefs = useRef([]);

  //console.log('Main Layout Array', storedData, pageName);

  const handleAudioPlay = (index) => {
    const audioElem = audioRefs.current[index];

    if (!audioElem) {
      console.error("Audio element not found:", audioElem);
      return;
    }

    if (audioPlaying !== null && audioPlaying !== index) {
      const previousAudioElem = audioRefs.current[audioPlaying];
      if (previousAudioElem) {
        previousAudioElem.pause();
      }
    }

    if (audioElem.paused) {
      audioElem.play();
      setAudioPlaying(index);
      audioElem.onended = () => {
        setAudioPlaying(null);
      };
    } else {
      audioElem.pause();
      setAudioPlaying(null);
    }
  };

  useEffect(() => {
    if (isShowCase && gameOverData) {
      setShake(gameOverData ? gameOverData.userWon : true);

      let audio = "";
      if (gameOverData) {
        audio = new Audio(
          gameOverData.userWon ? LevelCompleteAudio : gameLoseAudio
        );
        if (!gameOverData?.userWon) {
          callConfettiSnow();
        }
      } else {
        audio = new Audio(LevelCompleteAudio);
      }
      audio.play();
      setTimeout(() => {
        setShake(false);
      }, 4000);
    }
  }, [startShowCase, isShowCase, gameOverData]);

  let currentPracticeStep = progressData?.currentPracticeStep;
  let currentPracticeProgress = progressData?.currentPracticeProgress || 0;

  const sectionStyle = {
    width: "100%",
    backgroundImage: `url(${
      backgroundImage ? backgroundImage : levelsImages?.[LEVEL]?.background
    })`,
    backgroundSize: "cover", // Cover the entire viewport
    backgroundPosition: "center center", // Center the image
    backgroundRepeat: "no-repeat", // Do not repeat the image
    minHeight: "100vh",
    // padding: "30px 100px",
    display: "flex",
    paddingTop: { md: "0px", xs: "20px" },
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    background: props?.background || levelsImages?.[LEVEL]?.backgroundColor,
    position: "relative",
  };

  const steps = props.steps;
  const currentStep = props.currentStep;
  const stepsArr = [...Array(steps || 0).keys()];
  let width = window.innerWidth * 0.85;

  const blackLivesToShow =
    livesData?.blackLivesToShow > 0 ? livesData?.blackLivesToShow : 0;

  const redLivesToShow =
    livesData?.redLivesToShow !== undefined
      ? livesData?.redLivesToShow > 0
        ? livesData?.redLivesToShow
        : 0
      : livesData?.lives;

  const navigate = useNavigate();
  return (
    <Box sx={sectionStyle}>
      <ProfileHeader
        {...{ level: LEVEL, setOpenLangModal, lang, points, handleBack }}
      />

      {LEVEL && (
        <Box
          sx={{
            position: "absolute",
            bottom: "70px",
            left:
              LEVEL === 1
                ? "3px"
                : LEVEL === 2
                ? "40px"
                : LEVEL === 3
                ? "78px"
                : "78px",
          }}
        >
          <img
            src={levelsImages?.[LEVEL]?.backgroundAddOn}
            alt="backgroundAddOn"
          />
        </Box>
      )}
      <Box sx={{ position: "absolute", top: "15px", right: "80px" }}>
        {/* {showScore && (
          <Box sx={{ position: "relative" }}>
            <img
              src={scoreView}
              alt="scoreView"
              width={"144px"}
              height={"35px"}
            />
            <Box sx={{ position: "absolute", top: "6px", right: "46px" }}>
              <span
                style={{
                  color: "#FFDD39",
                  fontWeight: 700,
                  fontSize: "18px",
                  fontFamily: "Quicksand",
                }}
              >
                {points}
              </span>
            </Box>
          </Box>
        )} */}
      </Box>
      {loading ? (
        <Card
          sx={{
            width: "85vw",
            minHeight: "80vh",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${cardBackground || textureImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "round",
            boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
            backdropFilter: "blur(25px)",
            mt: "50px",
          }}
        >
          <Box>
            <img
              src={catLoading}
              alt="catLoading"
              // sx={{ height: "58px", width: "58px" }}
            />
          </Box>
        </Card>
      ) : (
        <>
          {(!isShowCase || (isShowCase && startShowCase)) && !gameOverData && (
            <Card
              sx={{
                position: { xs: "absolute", md: "relative" },
                left: { xs: "0px", md: "auto" },
                width: { xs: "100%", md: "85vw" },
                minHeight: "80vh",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundImage: `url(${cardBackground || textureImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
                backdropFilter: "blur(25px)",
                mt: "50px",
              }}
            >
              <CardContent
                sx={{
                  minHeight: "100%",
                  opacity: disableScreen ? 0.25 : 1,
                  pointerEvents: disableScreen ? "none" : "initial",
                }}
              >
                {showTimer && (
                  <Box sx={{ position: "absolute" }}>
                    <img
                      src={timer}
                      alt="timer"
                      style={{ height: "58px", width: "58px" }}
                    />
                  </Box>
                )}
                {props.children}
              </CardContent>
              {steps > 0 && (
                <Box
                  sx={{
                    width: { xs: "100%", md: "85vw" },
                    position: "absolute",
                    display: "flex",
                    top: "0",
                  }}
                >
                  {stepsArr?.map((step, index) => {
                    const showGreen = step + 1 <= currentStep;
                    return (
                      <Box
                        key={index}
                        index={index}
                        sx={{
                          height: "8px",
                          width: `${100 / steps}%`,
                          background: showGreen ? "#18DE2C" : "#C1C6CC",
                          marginLeft: "3px",
                        }}
                      ></Box>
                    );
                  })}
                </Box>
              )}
              {contentType &&
                contentType.toLowerCase() !== "word" &&
                startShowCase && (
                  <Box
                    position={"absolute"}
                    top={20}
                    left={20}
                    justifyContent={"center"}
                  >
                    <Box display={"flex"}>
                      {[...Array(Math.max(0, redLivesToShow) || 0).keys()]?.map(
                        (elem) => (
                          <Diamond />
                        )
                      )}

                      {[
                        ...Array(Math.max(0, blackLivesToShow) || 0).keys(),
                      ]?.map((elem) => (
                        <HeartBlack />
                      ))}
                    </Box>
                    <span
                      style={{
                        marginLeft: "5px",
                        color: "#000000",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "30px",
                        fontFamily: "Quicksand",
                      }}
                    >
                      {`You have ${redLivesToShow} lives`}
                    </span>
                  </Box>
                )}
              <Box sx={{ height: "120px", position: "relative" }}>
                <Box sx={{ position: "absolute", left: 0, bottom: "-2px" }}>
                  <footer>{LEVEL && levelsImages?.[LEVEL]?.milestone}</footer>
                </Box>
                <Box
                  sx={{
                    borderBottom: "1.5px solid rgba(51, 63, 97, 0.15)",
                    width: "100%",
                  }}
                ></Box>
                {showNext && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: currentPracticeStep ? "center" : "right",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {showProgress && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          {" "}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "48px",
                              border: "1.5px solid rgba(51, 63, 97, 0.15)",
                              ml: {
                                xs: 10,
                                sm: 15,
                                lg: 25,
                                md: 18,
                              },
                              borderRadius: "30px",
                              background: "white",
                            }}
                          >
                            {practiceSteps.map((elem, i) => {
                              return (
                                <Box
                                  key={i}
                                  sx={{
                                    width: {
                                      xs: "24px",
                                      sm: "26px",
                                      md: "28px",
                                      lg: "36px",
                                    },
                                    height: {
                                      xs: "24px",
                                      sm: "26px",
                                      md: "28px",
                                      lg: "36px",
                                    },
                                    background:
                                      currentPracticeStep > i
                                        ? "linear-gradient(90deg, rgba(132, 246, 48, 0.1) 0%, rgba(64, 149, 0, 0.1) 95%)"
                                        : currentPracticeStep === i
                                        ? "linear-gradient(90deg, #FF4BC2 0%, #C20281 95%)"
                                        : "rgba(0, 0, 0, 0.04)",
                                    ml: {
                                      xs: 0.5,
                                      sm: 0.5,
                                      md: 1.5,
                                      lg: 2,
                                    },
                                    mr: i === practiceSteps?.length - 1 ? 2 : 0,
                                    borderRadius: "30px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {currentPracticeStep > i ? (
                                    <GreenTick />
                                  ) : (
                                    <span
                                      style={{
                                        color:
                                          currentPracticeStep === i
                                            ? "white"
                                            : "#1E2937",
                                        fontWeight: 600,
                                        lineHeight: "20px",
                                        fontSize: "16px",
                                        fontFamily: "Quicksand",
                                      }}
                                    >
                                      {elem.name}
                                    </span>
                                  )}
                                </Box>
                              );
                            })}
                          </Box>
                          {/* <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              ml: {
                                xs: 10,
                                sm: 15,
                                lg: 25,
                                md: 15,
                              },
                              mt: 2,
                            }}
                          >
                            <span
                              style={{
                                color: "#1E2937",
                                fontWeight: 500,
                                lineHeight: "18px",
                                fontSize: "14px",
                                fontFamily: "Quicksand",
                              }}
                            >
                              {"Overall Progress:"}
                            </span>
                            <Box
                              sx={{
                                height: "12px",
                                width: {
                                  md: "250px",
                                  lg: "350px",
                                },
                                background: "#D1F8D5",
                                borderRadius: "6px",
                                ml: 2,
                                position: "relative",
                              }}
                            >
                              <Box
                                sx={{
                                  height: "12px",
                                  width: `${currentPracticeProgress}%`,
                                  background: "#18DE2C",
                                  borderRadius: "6px",
                                  position: "absolute",
                                }}
                              ></Box>
                            </Box>
                            <span
                              style={{
                                color: "#1E2937",
                                fontWeight: 700,
                                lineHeight: "18px",
                                fontSize: "14px",
                                fontFamily: "Quicksand",
                                marginLeft: "10px",
                              }}
                            >
                              {`${currentPracticeProgress}%`}
                            </span>
                          </Box> */}
                        </Box>
                      </Box>
                    )}
                    {/* <Box
                      sx={{ display: "flex", justifyContent: "right", mr: 4 }}
                    >
                      {enableNext ? (
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            if (props.setIsNextButtonCalled) {
                              props.setIsNextButtonCalled(true);
                            } else {
                              handleNext();
                            }
                          }}
                        >
                          <NextButton />
                        </Box>
                      ) : (
                        <Box sx={{ cursor: "pointer" }}>
                          <NextButton disabled />
                        </Box>
                      )}
                    </Box> */}
                  </Box>
                )}
                {nextLessonAndHome && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 4,
                      ml: 4,
                      mr: 4,
                    }}
                  >
                    <Box
                      sx={{
                        cursor: "pointer",
                        background:
                          "linear-gradient(90deg, rgba(255,144,80,1) 0%, rgba(225,84,4,1) 85%)",
                        minWidth: "100px",
                        height: "55px",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "0px 24px 0px 20px",
                      }}
                      onClick={() => handleNext()}
                    >
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: 600,
                          fontSize: "20px",
                          fontFamily: "Quicksand",
                        }}
                      >
                        {"Next Lesson"}
                      </span>
                      {/* <NextButton /> */}
                    </Box>
                    {enableNext ? (
                      <Box
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleNext()}
                      >
                        <NextButton />
                      </Box>
                    ) : (
                      <Box sx={{ cursor: "pointer" }}>
                        <NextButton disabled />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Card>
          )}
          {((isShowCase && !startShowCase) || gameOverData) && (
            <Card
              sx={{
                width: "85vw",
                minHeight: "80vh",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundImage: `url(${cardBackground || textureImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "round",
                boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
                backdropFilter: "blur(25px)",
                mt: "50px",
              }}
            >
              <Box>{shake && <Confetti width={width} height={"600px"} />}</Box>
              <CardContent
                sx={{
                  width: "82vw",
                  minHeight: "100%",
                  opacity: disableScreen ? 0.25 : 1,
                  pointerEvents: disableScreen ? "none" : "initial",
                }}
              >
                {isShowCase && !startShowCase && !gameOverData && (
                  <>
                    <Typography
                      className="successHeader"
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      Hurray!!!
                    </Typography>
                    <Typography
                      sx={{
                        mb: 1,
                        mt: 1,
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#50507D",
                          fontWeight: 600,
                          fontSize: "20px",
                          lineHeight: "37px",
                          letterSpacing: "2%",
                          fontFamily: "Quicksand",
                        }}
                      >
                        {"Ready for Challenge?"}
                      </span>
                    </Typography>
                  </>
                )}
                {gameOverData && (
                  <>
                    <Box
                      sx={{
                        position: "absolute",
                        top: "-120px",
                        left: "-70px",
                      }}
                    >
                      {!gameOverData?.userWon && (
                        <img
                          src={clouds}
                          alt="clouds"
                          style={{ zIndex: -999 }}
                        />
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: "100",
                      }}
                    >
                      {gameOverData?.userWon ? (
                        <img
                          src={gameWon}
                          alt="gameWon"
                          style={{ zIndex: 9999, height: 340 }}
                        />
                      ) : (
                        <Stack
                          justifyContent="center"
                          alignItems="center"
                          direction={"row"}
                          zIndex={100}
                        >
                          <Stack justifyContent="center" alignItems="center">
                            <img
                              src={gameLost}
                              alt="gameLost"
                              style={{ height: 340 }}
                            />
                            <Typography
                              sx={{ mb: 1, mt: 1, textAlign: "center" }}
                            >
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: "24px",
                                  lineHeight: "1.5",
                                  letterSpacing: "1px",
                                  fontFamily: "Quicksand",
                                  backgroundColor: "rgb(237, 134, 0)",
                                  padding: "6px 12px",
                                  color: "#fff",
                                  borderRadius: "20px",
                                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                                }}
                              >
                                {percentage <= 0 ? 0 : percentage}/100
                              </span>
                              <br />

                              {!fluency ? (
                                <Typography textAlign="center" sx={{ mt: 2 }}>
                                  Good try! Need more speed.
                                </Typography>
                              ) : (
                                <Typography textAlign="center" sx={{ mt: 2 }}>
                                  You need{" "}
                                  <span style={{ fontWeight: "bold" }}>
                                    {Math.abs(70 - percentage)}
                                  </span>{" "}
                                  more.
                                </Typography>
                              )}
                            </Typography>
                          </Stack>
                          {/* second stack below*/}
                          <Stack
                            sx={{
                              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
                              paddingY: "49px",
                              paddingX: "30px",
                              borderRadius: "13px",
                              marginLeft: "80px",
                              bgcolor: "#FFFFFF",
                              zIndex: 100,
                            }}
                            direction={"row"}
                          >
                            <Stack
                              sx={{
                                paddingRight:
                                  (props.pageName === "wordsorimage" ||
                                    props.pageName === "m5") &&
                                  !fluency
                                    ? "20px"
                                    : "0px",
                                borderRight:
                                  (props.pageName === "wordsorimage" ||
                                    props.pageName === "m5") &&
                                  !fluency
                                    ? "1px dashed grey"
                                    : "none",
                              }}
                            >
                              {(props.pageName === "wordsorimage" ||
                                props.pageName === "m5") &&
                                storedData?.map((elem, index) => (
                                  <Stack
                                    key={index}
                                    justifyContent={"start"}
                                    alignItems={"center"}
                                    direction={"row"}
                                    mt={index > 0 ? "25px" : 0}
                                  >
                                    <Box
                                      sx={{
                                        marginLeft: "35px",
                                        marginRight: "5px",
                                      }}
                                    >
                                      {elem?.audioUrl ? (
                                        <button
                                          onClick={() => handleAudioPlay(index)}
                                          style={{
                                            height: "30px",
                                            cursor: "pointer",
                                            background: "none",
                                            border: "none",
                                            padding: "0",
                                          }}
                                          aria-label={
                                            audioPlaying === index
                                              ? "Pause audio"
                                              : "Play audio"
                                          }
                                        >
                                          <img
                                            src={
                                              audioPlaying === index
                                                ? pauseButton
                                                : playButton
                                            }
                                            alt={
                                              audioPlaying === index
                                                ? "Pause"
                                                : "Play"
                                            }
                                            style={{ height: "30px" }}
                                          />
                                        </button>
                                      ) : (
                                        <Box></Box>
                                      )}
                                      <audio
                                        ref={(el) =>
                                          (audioRefs.current[index] = el)
                                        }
                                        src={elem?.audioUrl}
                                      />
                                    </Box>

                                    {elem?.correctAnswer === false ? (
                                      <img
                                        src="https://raw.githubusercontent.com/Sunbird-ALL/all-learner-ai-app/refs/heads/all-1.2-tn-dev/src/assets/wrong.svg"
                                        alt="wrongImage"
                                      />
                                    ) : (
                                      <img
                                        src="https://raw.githubusercontent.com/Sunbird-ALL/all-learner-ai-app/refs/heads/all-1.2-tn-dev/src/assets/correct.svg"
                                        alt="correctImage"
                                      />
                                    )}
                                    <span
                                      style={{
                                        marginLeft: "8px",
                                        color: "#1E2937",
                                        fontWeight: 700,
                                        lineHeight: "30px",
                                        fontSize: "15px",
                                        fontFamily: "Quicksand",
                                        minWidth: "100px",
                                      }}
                                    >
                                      {elem.selectedAnswer || "Binocular"}
                                    </span>
                                  </Stack>
                                ))}
                            </Stack>
                            {!fluency && (
                              <Stack
                                sx={{
                                  paddingLeft:
                                    (props.pageName === "wordsorimage" ||
                                      props.pageName === "m5") &&
                                    !fluency
                                      ? "20px"
                                      : "0px",
                                }}
                                justifyContent={"center"}
                                alignItems={"center"}
                              >
                                <img
                                  src="https://raw.githubusercontent.com/Sunbird-ALL/all-learner-ai-app/refs/heads/all-1.2-tn-dev/src/assets/turtle.svg"
                                  alt="turtleImage"
                                />
                                <span
                                  style={{
                                    marginTop: "12px",
                                    color: "#1E2937",
                                    fontWeight: 700,
                                    lineHeight: "25px",
                                    fontSize: "20px",
                                    fontFamily: "Quicksand",
                                  }}
                                >
                                  {"Oops, a bit slow!"}
                                </span>
                              </Stack>
                            )}
                          </Stack>
                        </Stack>
                      )}
                    </Box>
                  </>
                )}
              </CardContent>
              <Box sx={{ height: "120px", position: "relative" }}>
                <Box
                  sx={{
                    borderBottom: "1.5px solid rgba(51, 63, 97, 0.15)",
                    width: "100%",
                  }}
                ></Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: currentPracticeStep ? "center" : "right",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: currentPracticeStep
                          ? "center"
                          : "right",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {showProgress && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              flexDirection: "column",
                            }}
                          >
                            {" "}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "48px",
                                border: "1.5px solid rgba(51, 63, 97, 0.15)",
                                ml: {
                                  lg: 25,
                                  md: 18,
                                },
                                borderRadius: "30px",
                                background: "white",
                              }}
                            >
                              {practiceSteps.map((elem, i) => {
                                return (
                                  <Box
                                    key={i}
                                    sx={{
                                      width: {
                                        md: "28px",
                                        lg: "36px",
                                      },
                                      height: {
                                        md: "28px",
                                        lg: "36px",
                                      },
                                      background:
                                        currentPracticeStep > i
                                          ? "linear-gradient(90deg, rgba(132, 246, 48, 0.1) 0%, rgba(64, 149, 0, 0.1) 95%)"
                                          : currentPracticeStep === i
                                          ? "linear-gradient(90deg, #FF4BC2 0%, #C20281 95%)"
                                          : "rgba(0, 0, 0, 0.04)",
                                      ml: {
                                        md: 1.5,
                                        lg: 2,
                                      },
                                      mr:
                                        i === practiceSteps?.length - 1 ? 2 : 0,
                                      borderRadius: "30px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {currentPracticeStep > i ? (
                                      <GreenTick />
                                    ) : (
                                      <span
                                        style={{
                                          color:
                                            currentPracticeStep === i
                                              ? "white"
                                              : "#1E2937",
                                          fontWeight: 600,
                                          lineHeight: "20px",
                                          fontSize: "16px",
                                          fontFamily: "Quicksand",
                                        }}
                                      >
                                        {elem.name}
                                      </span>
                                    )}
                                  </Box>
                                );
                              })}
                            </Box>
                            {/* <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                ml: {
                                  lg: 25,
                                  md: 15,
                                },
                                mt: 2,
                              }}
                            >
                              <span
                                style={{
                                  color: "#1E2937",
                                  fontWeight: 500,
                                  lineHeight: "18px",
                                  fontSize: "14px",
                                  fontFamily: "Quicksand",
                                }}
                              >
                                {"Overall Progress:"}
                              </span>
                              <Box
                                sx={{
                                  height: "12px",
                                  width: {
                                    md: "250px",
                                    lg: "350px",
                                  },
                                  background: "#D1F8D5",
                                  borderRadius: "6px",
                                  ml: 2,
                                  position: "relative",
                                }}
                              >
                                <Box
                                  sx={{
                                    height: "12px",
                                    width: `${currentPracticeProgress}%`,
                                    background: "#18DE2C",
                                    borderRadius: "6px",
                                    position: "absolute",
                                  }}
                                ></Box>
                              </Box>
                              <span
                                style={{
                                  color: "#1E2937",
                                  fontWeight: 700,
                                  lineHeight: "18px",
                                  fontSize: "14px",
                                  fontFamily: "Quicksand",
                                  marginLeft: "10px",
                                }}
                              >
                                {`${currentPracticeProgress}%`}
                              </span>
                            </Box> */}
                          </Box>
                        </Box>
                      )}
                      <Box
                        sx={{ display: "flex", justifyContent: "right", mr: 4 }}
                      >
                        <Box
                          sx={{
                            cursor: "pointer",
                            background:
                              "linear-gradient(90deg, rgba(255,144,80,1) 0%, rgba(225,84,4,1) 85%)",
                            minWidth: "160px",
                            height: "55px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px 24px 0px 20px",
                          }}
                          onClick={() => {
                            if (
                              props.pageName === "wordsorimage" ||
                              props.pageName === "m5"
                            ) {
                              resetStoredData();
                            }
                            if (isShowCase && !startShowCase && !gameOverData) {
                              setStartShowCase(true);
                            }
                            if (gameOverData) {
                              gameOverData.link
                                ? navigate(gameOverData.link)
                                : navigate("/_practice");
                            }
                          }}
                        >
                          <Typography
                            style={{
                              color: "#FFFFFF",
                              fontWeight: 600,
                              fontSize: "20px",
                              fontFamily: "Quicksand",
                            }}
                            fontSize={{ md: "14px", xs: "10px" }}
                          >
                            {!gameOverData ? "Start Game ➜" : "Practice ➜"}
                          </Typography>
                          {/* <NextButton /> */}
                        </Box>
                      </Box>
                    </Box>
                  }
                </Box>
              </Box>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

MainLayout.propTypes = {
  contentType: PropTypes.string,
  handleBack: PropTypes.func,
  disableScreen: PropTypes.bool,
  isShowCase: PropTypes.bool,
  showProgress: PropTypes.bool,
  setOpenLangModal: PropTypes.func,
  points: PropTypes.number,
  handleNext: PropTypes.any,
  enableNext: PropTypes.bool,
  showNext: PropTypes.bool,
  showTimer: PropTypes.bool,
  nextLessonAndHome: PropTypes.bool,
  startShowCase: PropTypes.bool,
  setStartShowCase: PropTypes.func,
  loading: PropTypes.bool,
  storedData: PropTypes.array,
  resetStoredData: PropTypes.func,
  pageName: PropTypes.string,
};

export default MainLayout;
