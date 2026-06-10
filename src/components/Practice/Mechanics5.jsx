import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Radio } from "@mui/material";
import MainLayout from "../Layout/MainLayout";
import {
  PlayAudioButton,
  StopAudioButton,
  getLocalData,
} from "../../utils/constants";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import PropTypes from "prop-types";
import ZoomableImage from "./ZoomableImage";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { getFontFamily } from "../../utils/fontUtils";
const theme = createTheme();

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
  const [storedData, setStoredData] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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
          display: { xs: "flex", sm: "block" },
          flexDirection: { xs: "column", sm: "initial" },
          height: { xs: "calc(100% - 55px)", sm: "auto" },
          marginTop: { xs: "55px", sm: "0px" },
          justifyContent: { xs: "flex-start", sm: "initial" },
          alignItems: { xs: "center", sm: "initial" },
          width: "100%",
          overflowY: { xs: "auto", sm: "visible" },
          paddingBottom: { xs: "90px", sm: "0px" },
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            left: "calc(50% - 258px / 2)",
            top: "calc(50% - 45px / 2 - 235.5px)",
            fontFamily: getFontFamily(lang || "en"),
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: isMobile ? "16px" : "36px",
            lineHeight: isMobile ? "22px" : "45px",
            alignItems: "center",
            textAlign: "center",
            color: "#333F61",
            paddingTop: isMobile ? "10px" : isTablet ? "16vh" : "12vh",
          }}
        >
          {header}
        </div>

        <Grid
          container
          sx={{
            width: isMobile ? "100%" : "70%",
            justifyContent: "center",
            mb: 2,
            mt: isMobile ? 1.5 : 8,
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
            {/* Image with full-width gradient overlay on top */}
            {image?.split("/")?.[4] && (
              <ZoomableImage
                src={image}
                alt="contentImage"
                imageStyle={
                  isMobile
                    ? {
                        height: "140px",
                        objectFit: "contain",
                        borderRadius: "15px",
                      }
                    : {}
                }
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
              paddingBottom={isMobile ? 1 : 3}
              sx={{
                display: "flex",
                marginLeft: mechanism === "mechanic_4" ? "-10px" : "",
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
              <span
                style={{
                  color: "#262649",
                  fontWeight: isMobile ? 600 : 800,
                  fontSize: isMobile ? "15px" : "26px",
                  fontFamily: getFontFamily(lang || "en"),
                }}
              >
                {parentWords}
              </span>
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
                    mt={isMobile ? 0 : 3}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Radio
                      checked={selectedOption === i}
                      onChange={(e) => handleOptionChange(e, i)}
                      value={i}
                      name="options"
                      color="primary"
                      sx={isMobile ? { padding: "4px" } : {}}
                    />
                    <audio
                      ref={audiosRef.current[i]}
                      preload="metadata"
                      onPlaying={() => setPlayingIndex(i)}
                      onPause={() => setPlayingIndex(null)}
                    >
                      <source
                        src={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${option.audio_url}`}
                        type="audio/wav"
                      />
                    </audio>
                    <Box
                      sx={{
                        cursor: "pointer",
                        zIndex: 10,
                        margin: isMobile ? "4px" : "10px",
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
                        <img
                          src={`${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${option.image_url}`}
                          style={{
                            borderRadius: "20px",
                            width: isMobile ? "110px" : "200px",
                            height: isMobile ? "70px" : "150px",
                          }}
                          alt=""
                        />
                      )}

                      <h1
                        style={{
                          color: "#262649",
                          fontWeight: 600,
                          fontSize: isMobile ? "14px" : "24px",
                          fontFamily: getFontFamily(lang || "en"),
                          marginLeft: isMobile ? "15px" : "10px",
                          margin: isMobile ? "0px 0px 0px 2px" : "initial",
                        }}
                      >
                        {option?.text || "Text is missing"}
                      </h1>
                    </Box>
                  </Box>
                ))
              ) : (
                <div>No options available</div>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box
          paddingTop={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            ...(isMobile && {
              transform: "scale(0.7)",
              transformOrigin: "top center",
              "& > div > div > div": {
                flexDirection: "row !important",
                alignItems: "center",
                gap: "10px",
                "& > div": {
                  marginBottom: "0px !important",
                  marginTop: "0px !important",
                },
              },
              "& .playing": {
                width: "150px !important",
                height: "30px !important",
                padding: "0.2rem !important",
                "& .playing__bar": {
                  width: "1.5px !important",
                },
              },
              "& .playing[style*='bottom']": {
                bottom: "-22px !important",
              },
              "& .loader": {
                marginTop: "20px !important",
              },
            }),
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
              options.find((option) => option.isAns === true).text
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
