import { Box, CardContent, Typography, CircularProgress } from "@mui/material";
import { createRef, useState, useEffect } from "react";
import v11 from "../../assets/audio/V10.mp3";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import { PlayAudioButton, StopAudioButton } from "../../utils/constants";
import MainLayout from "../Layouts.jsx/MainLayout";
import PropTypes from "prop-types";

const WordsOrImage = ({
  handleNext,
  background,
  header,
  isPractice = false,
  type,
  words,
  image,
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  enableNext,
  showTimer,
  points,
  steps,
  currentStep,
  contentId,
  contentType,
  percentage,
  fluency,
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
  startShowCase,
  setStartShowCase,
  livesData,
  setLivesData,
  gameOverData,
  highlightWords,
  matchedChar,
  loading,
  setOpenMessageDialog,
  isNextButtonCalled,
  setIsNextButtonCalled,
  setOfflineReport,
}) => {
  const audioRef = createRef(null);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [storedData, setStoredData] = useState([]);

  //console.log('wordsORimage', words, storedData);

  const updateStoredData = (audio, isCorrect) => {
    if (audio && words) {
      const newEntry = {
        selectedAnswer: words,
        audioUrl: audio,
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

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };
  const [currrentProgress, setCurrrentProgress] = useState(0);

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      storedData={storedData}
      resetStoredData={resetStoredData}
      pageName={"wordsorimage"}
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
        setIsNextButtonCalled,
      }}
    >
      <CardContent
        sx={{
          overflow: "hidden",
          pt: "100px",
          opacity: disableScreen ? 0.25 : 1,
          pointerEvents: disableScreen ? "none" : "initial",
        }}
      >
        {type === "image" ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={image}
              style={{
                maxWidth: "450px",
                maxHeight: "130px",
                marginBottom: "40px",
              }}
            />
          </Box>
        ) : type === "phonics" ? (
          <Box
            position="relative"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              mb: "40px",
            }}
          >
            <Box
              position="relative"
              sx={{
                minWidth: "403px",
                borderRadius: "15px",
                background: "rgba(255, 161, 50, 0.1)",
                height: "88px",
                display: "flex",
              }}
            >
              <audio
                ref={audioRef}
                preload="metadata"
                onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                onCanPlay={(e) => {
                  setIsReady(true);
                }}
                onPlaying={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => {
                  setCurrrentProgress(e.currentTarget.currentTime);
                }}
              >
                <source type="audio/mp3" src={v11} />
              </audio>
              {/* <AudioPlayerSvg color="#FFA132" /> */}

              <Box
                sx={{
                  height: "88px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    cursor: "pointer",
                    marginLeft: "20px",
                    marginTop: "5px",
                  }}
                  onClick={() => {
                    togglePlayPause();
                  }}
                >
                  {isReady && (
                    <>
                      {isPlaying ? (
                        <StopAudioButton color="#FFA132" />
                      ) : (
                        <PlayAudioButton color="#FFA132" />
                      )}
                    </>
                  )}
                </Box>
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    color: "#333F61",
                    fontSize: "44px",
                    letterSpacing: "2.2px",
                    lineHeight: "normal",
                    fontWeight: 600,
                    fontFamily: "Quicksand",
                    marginLeft: "20px",
                  }}
                >
                  {"REF LECTION"}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            {!words && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
              </Box>
            )}
            {words && !matchedChar && (
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  mb: 4,
                  color: "#333F61",
                  textAlign: "center",
                  fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                  // lineHeight: "normal",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                }}
              >
                {words ? words[0].toUpperCase() + words.slice(1) : ""}
              </Typography>
            )}
            {matchedChar && (
              <Box
                display={"flex"}
                mb={4}
                sx={{
                  width: "100%",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {highlightWords(words, matchedChar)}
              </Box>
            )}
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <VoiceAnalyser
            pageName={"wordsorimage"}
            setVoiceText={setVoiceText}
            updateStoredData={updateStoredData}
            setRecordedAudio={setRecordedAudio}
            setVoiceAnimate={setVoiceAnimate}
            storyLine={storyLine}
            setOfflineReport={setOfflineReport}
            dontShowListen={type === "image" || isDiscover}
            // updateStory={updateStory}
            originalText={words}
            handleNext={handleNext}
            enableNext={enableNext}
            isShowCase={isShowCase || isDiscover}
            {...{
              contentId,
              contentType,
              currentLine: currentStep - 1,
              playTeacherAudio,
              callUpdateLearner: true,
              isPractice: isPractice,
              setEnableNext,
              livesData,
              setLivesData,
              setOpenMessageDialog,
              isNextButtonCalled,
              setIsNextButtonCalled,
            }}
          />
        </Box>
      </CardContent>
    </MainLayout>
  );
};

WordsOrImage.propTypes = {
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
  handleBack: PropTypes.any,
  setEnableNext: PropTypes.func.isRequired,
  startShowCase: PropTypes.bool,
  setStartShowCase: PropTypes.func,
  setLivesData: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setOpenMessageDialog: PropTypes.func.isRequired,
  isNextButtonCalled: PropTypes.bool,
  setIsNextButtonCalled: PropTypes.func,
  background: PropTypes.any,
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

export default WordsOrImage;
