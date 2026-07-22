import { getConfig } from "../../config/runtimeConfig";
import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Radio, Typography } from "@mui/material";
import MainLayout from "../Layout/MainLayout";
import {
  PlayAudioButton,
  StopAudioButton,
  getLocalData,
} from "../../utils/constants";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import PropTypes from "prop-types";
import ZoomableImage from "./ZoomableImage";
import { getFontFamily } from "../../utils/fontUtils";
import { getUiStrings } from "../../constants/strings";

const Mechanics5 = ({
  background,
  type,
  isDiscover,
  header,
  parentWords,
  options = {},
  image,
  question_audio,
  handleNext,
  enableNext,
  showTimer,
  points,
  steps,
  currentStep,
  level,
  progressData,
  showProgress,
  playTeacherAudio,
  handleBack,
  disableScreen,
  loading,
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  contentId,
  contentType,
  callUpdateLearner,
  isShowCase,
  setEnableNext,
  selectedWord,
  wordToCheck,
  setOpenMessageDialog,
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  percentage,
  fluency,
  isNextButtonCalled,
  setIsNextButtonCalled,
  gameOverData,
  correctness,
  audio,
  mechanism,
  vocabCount,
  wordCount,
}) => {
  const audiosRef = useRef(
    new Array(options.length).fill(null).map(() => React.createRef())
  );
  const questionAudioRef = useRef();
  const [playingIndex, setPlayingIndex] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Add state to track selected radio button
  const lang = getLocalData("lang");
  const ui = getUiStrings(lang || "en");
  const [storedData, setStoredData] = useState([]);

  const updateStoredData = (audios, isCorrect) => {
    if (audios) {
      const newEntry = {
        selectedAnswer:
          options && options.length > 0 && options[selectedOption]?.text,
        audioUrl: audios,
        correctAnswer: isCorrect,
      };

      setStoredData((prevData) => [...prevData, newEntry]);
    }
  };

  const resetStoredData = () => {
    setStoredData([]);
  };

  useEffect(() => {
    updateStoredData();
  }, [handleNext]);

  useEffect(() => {
    // Ensure that audio stops playing when options change
    audiosRef.current.forEach((ref) => {
      if (ref.current && !ref.current.paused) {
        ref.current.pause();
      }
    });

    // Create new refs for the updated options
    audiosRef.current = new Array(options.length)
      .fill(null)
      .map(() => React.createRef());
    setPlayingIndex(null); // Reset playing index
    setSelectedOption(null);
  }, [options]); // Depend on options to reset refs

  const togglePlayPause = (index) => {
    const currentAudio =
      index === "question"
        ? questionAudioRef.current
        : audiosRef.current[index].current;
    if (playingIndex === index && !currentAudio.paused) {
      currentAudio.pause();
      setPlayingIndex(null);
    } else {
      if (playingIndex !== null && playingIndex !== index) {
        const previousAudio =
          playingIndex === "question"
            ? questionAudioRef.current
            : audiosRef.current[playingIndex].current;
        previousAudio.pause();
      }
      currentAudio.play();
      setPlayingIndex(index);
    }
  };

  //console.log('Mechanics5' , storedData, options);

  const handleOptionChange = (event, i) => {
    setSelectedOption(i); // Set the selected option index
  };

  return (
    <MainLayout
      pageName={"m5"}
      storedData={storedData}
      resetStoredData={resetStoredData}
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      lang={lang}
      cardContentStyle={{
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
        justifyContent: "flex-start",
        alignItems: "stretch",
      }}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        contentType,
        percentage,
        fluency,
        playTeacherAudio,
        handleBack,
        isShowCase,
        startShowCase,
        setStartShowCase,
        disableScreen,
        livesData,
        gameOverData,
        loading,
        setLivesData,
        isNextButtonCalled,
        setIsNextButtonCalled,
        vocabCount,
        wordCount,
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            fontFamily: getFontFamily(lang || "en"),
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "clamp(16px, 2.5vw, 30px)",
            lineHeight: { xs: "1.4", sm: "45px" },
            textAlign: "center",
            color: "#333F61",
            paddingTop: {
              xs: isShowCase && startShowCase ? "44px" : "8px",
              sm:
                isShowCase && startShowCase
                  ? "60px"
                  : "clamp(10px, 5dvh, 40px)",
              md:
                isShowCase && startShowCase
                  ? "54px"
                  : "clamp(12px, 4dvh, 36px)",
            },
            paddingBottom: "8px",
          }}
        >
          {header}
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          <Grid
            container
            sx={{
              width: { xs: "100%", md: "70%" },
              justifyContent: "center",
              mb: 2,
              mt: {
                xs: 1,
                sm: "clamp(8px, 3dvh, 32px)",
                md: "clamp(12px, 4dvh, 40px)",
              },
            }}
          >
            <Grid
              item
              xs={12}
              sm={4}
              position="relative"
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {image && (
                <ZoomableImage
                  src={image}
                  alt="content illustration"
                  imageStyle={{
                    width: "100%",
                    maxWidth: "320px",
                    height: "auto",
                    maxHeight: "clamp(120px, 22dvh, 280px)",
                    objectFit: "contain",
                    borderRadius: "15px",
                  }}
                />
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={8}
              sx={{
                paddingLeft: { xs: 0, sm: 2 },
                mt: { xs: 2, sm: 0 },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: { xs: 1, sm: 3 },
                  ml: mechanism === "mechanic_4" ? "-10px" : "",
                }}
              >
                <audio
                  key={question_audio} // Key added to force remount when source changes
                  ref={questionAudioRef}
                  preload="metadata"
                  onPlaying={() => setPlayingIndex("question")}
                  onPause={() => setPlayingIndex(null)}
                >
                  <source src={question_audio} type="audio/wav" />
                </audio>
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => togglePlayPause("question")}
                >
                  {playingIndex === "question" ? (
                    <StopAudioButton size={35} color={"#1CB0F6"} />
                  ) : (
                    <PlayAudioButton size={35} color={"#1CB0F6"} />
                  )}
                </Box>
                <Typography
                  component="span"
                  sx={{
                    color: "#262649",
                    fontWeight: { xs: 600, md: 800 },
                    fontSize: "clamp(15px, 2vw, 26px)",
                    fontFamily: getFontFamily(lang || "en"),
                    wordBreak: "break-word",
                  }}
                >
                  {parentWords}
                </Typography>
              </Box>
              <Box
                sx={{
                  ...(mechanism === "mechanic_4" && {
                    display: "flex",
                    justifyContent: "center",
                  }),
                  "@media (max-width:1100px)": {
                    gap: "40px",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                  },
                }}
              >
                {options && options.length > 0 ? (
                  options.map((option, i) => (
                    <Box
                      key={option.audio_url}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: { xs: 0, sm: 3 },
                      }}
                    >
                      <Radio
                        checked={selectedOption === i}
                        onChange={(e) => handleOptionChange(e, i)}
                        value={i}
                        name="options"
                        color="primary"
                        sx={{ padding: { xs: "4px", sm: "9px" } }}
                      />
                      <audio
                        ref={audiosRef.current[i]}
                        preload="metadata"
                        onPlaying={() => setPlayingIndex(i)}
                        onPause={() => setPlayingIndex(null)}
                      >
                        <source
                          src={`${getConfig(
                            "REACT_APP_AWS_S3_BUCKET_CONTENT_URL"
                          )}/mechanics_audios/${option.audio_url}`}
                          type="audio/wav"
                        />
                      </audio>
                      <Box
                        sx={{
                          cursor: "pointer",
                          zIndex: 10,
                          margin: { xs: "4px", sm: "10px" },
                        }}
                        onClick={() => togglePlayPause(i)}
                      >
                        {playingIndex === i ? (
                          <StopAudioButton size={35} color={"#1CB0F6"} />
                        ) : (
                          <PlayAudioButton size={35} color={"#1CB0F6"} />
                        )}
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        {option.image_url && (
                          <Box
                            component="img"
                            src={`${getConfig(
                              "REACT_APP_AWS_S3_BUCKET_CONTENT_URL"
                            )}/mechanics_images/${option.image_url}`}
                            alt={option?.text || "option image"}
                            sx={{
                              borderRadius: "20px",
                              width: {
                                xs: "110px",
                                sm: "150px",
                                md: "180px",
                                lg: "200px",
                              },
                              height: {
                                xs: "70px",
                                sm: "100px",
                                md: "130px",
                                lg: "150px",
                              },
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        )}
                        <Typography
                          component="span"
                          sx={{
                            color: "#262649",
                            fontWeight: 600,
                            fontSize: "clamp(14px, 1.8vw, 24px)",
                            fontFamily: getFontFamily(lang || "en"),
                            display: "block",
                            mt: option.image_url ? 0.5 : 0,
                            ml: { xs: "2px", sm: "10px" },
                            wordBreak: "break-word",
                          }}
                        >
                          {option?.text || ui.CONTENT_TEXT_MISSING}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box>{ui.NO_OPTIONS}</Box>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 1,
              "& > div": {
                "@media (max-width: 379px)": {
                  transform: "scale(0.72)",
                  transformOrigin: "top center",
                },
                "@media (min-width: 380px) and (max-width: 480px)": {
                  transform: "scale(0.85)",
                  transformOrigin: "top center",
                },
              },
            }}
          >
            <VoiceAnalyser
              pageName={"m5"}
              updateStoredData={updateStoredData}
              setVoiceText={setVoiceText}
              setRecordedAudio={setRecordedAudio}
              setVoiceAnimate={setVoiceAnimate}
              storyLine={storyLine}
              dontShowListen={type === "image" || isDiscover}
              isShowCase={isShowCase || isDiscover}
              originalText={
                options &&
                options.length > 0 &&
                options.find((option) => option.isAns === true)?.text
                  ? options.find((option) => option.isAns === true).text
                  : parentWords
              }
              enableNext={enableNext}
              handleNext={handleNext}
              selectedOption={options[selectedOption]}
              correctness={correctness}
              audioLink={audio ? audio : null}
              {...{
                contentId,
                contentType,
                currentLine: currentStep - 1,
                playTeacherAudio,
                callUpdateLearner,
                isShowCase,
                setEnableNext,
                showOnlyListen: !options[selectedOption],
                setOpenMessageDialog,
                startShowCase,
                setStartShowCase,
                disableScreen,
                livesData,
                gameOverData,
                loading,
                setLivesData,
                isNextButtonCalled,
                setIsNextButtonCalled,
              }}
            />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

Mechanics5.propTypes = {
  handleNext: PropTypes.func.isRequired,
  // background: PropTypes.string,
  header: PropTypes.string,
  image: PropTypes.string,
  setVoiceText: PropTypes.func.isRequired,
  setRecordedAudio: PropTypes.func.isRequired,
  setVoiceAnimate: PropTypes.func.isRequired,
  enableNext: PropTypes.bool,
  showTimer: PropTypes.bool,
  points: PropTypes.number,
  currentStep: PropTypes.number.isRequired,
  percentage: PropTypes.string,
  fluency: PropTypes.bool,
  isDiscover: PropTypes.bool,
  showProgress: PropTypes.bool,
  callUpdateLearner: PropTypes.bool,
  disableScreen: PropTypes.bool,
  isShowCase: PropTypes.bool,
  handleBack: PropTypes.func.isRequired,
  setEnableNext: PropTypes.func.isRequired,
  startShowCase: PropTypes.bool,
  setStartShowCase: PropTypes.func,
  setLivesData: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setOpenMessageDialog: PropTypes.func.isRequired,
  isNextButtonCalled: PropTypes.bool,
  setIsNextButtonCalled: PropTypes.func,
  background: PropTypes.bool,
  type: PropTypes.any,
  words: PropTypes.any,
  storyLine: PropTypes.number,
  steps: PropTypes.number,
  contentId: PropTypes.any,
  contentType: PropTypes.string,
  level: PropTypes.any,
  progressData: PropTypes.object,
  playTeacherAudio: PropTypes.func,
  livesData: PropTypes.any,
  gameOverData: PropTypes.any,
  highlightWords: PropTypes.func,
  matchedChar: PropTypes.any,
};

export default Mechanics5;
