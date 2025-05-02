import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Radio } from "@mui/material";
import MainLayout from "../Layouts.jsx/MainLayout";
import { PlayAudioButton, StopAudioButton } from "../../utils/constants";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import PropTypes from "prop-types";
import { Modal } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";

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
}) => {
  const audiosRef = useRef(
    new Array(options.length).fill(null).map(() => React.createRef())
  );
  const [zoomOpen, setZoomOpen] = useState(false);
  const questionAudioRef = useRef();
  const [playingIndex, setPlayingIndex] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Add state to track selected radio button

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
      }}
    >
      <div
        style={{
          left: "calc(50% - 258px / 2)",
          top: "calc(50% - 45px / 2 - 235.5px)",
          fontFamily: "Quicksand",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: "36px",
          lineHeight: "45px",
          alignItems: "center",
          textAlign: "center",
          color: "#333F61",
          paddingTop: "12vh",
        }}
      >
        {header}
      </div>

      <Grid
        container
        sx={{ width: "70%", justifyContent: "center", mb: 2, mt: 8 }}
      >
        <Grid item xs={4} position="relative">
          {/* Image with full-width gradient overlay on top */}
          {image?.split("/")?.[4] && (
            <Box
              sx={{
                position: "relative",
                cursor: "zoom-in",
                width: "fit-content",
              }}
            >
              <img
                src={image}
                style={{
                  borderRadius: "20px",
                  maxWidth: "100%",
                }}
                alt="contentImage"
                onClick={() => setZoomOpen(true)} // Open modal on click
              />

              {/* Subtle gradient overlay across the top */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "40px", // Height of the gradient overlay
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)",
                  borderTopLeftRadius: "20px",
                  borderTopRightRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "8px",
                }}
              >
                {/* Zoom icon positioned in the top-left corner */}
                <ZoomInIcon
                  onClick={() => setZoomOpen(true)}
                  sx={{ color: "white", fontSize: "22px", cursor: "pointer" }}
                />
              </Box>
            </Box>
          )}

          {/* Modal for zoomed image with gradient and close icon */}
          <Modal
            open={zoomOpen}
            onClose={() => setZoomOpen(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                outline: "none",
                height: "500px",
                width: "500px",
              }}
            >
              {/* Subtle gradient overlay at the top of the zoomed image */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "40px", // Adjust height as needed
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: "8px",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                {/* Close icon positioned within the gradient overlay */}
                <CloseIcon
                  onClick={() => setZoomOpen(false)}
                  sx={{
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "4px",
                  }}
                />
              </Box>

              <img
                src={image}
                alt="Zoomed content"
                style={{
                  // maxWidth: "90vw",
                  // maxHeight: "90vh",
                  width: "100%",
                  borderRadius: "8px",
                }}
              />
            </Box>
          </Modal>
        </Grid>

        <Grid item xs={8} paddingLeft={2}>
          <Box
            paddingBottom={3}
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
                fontWeight: 800,
                fontSize: "26px",
                fontFamily: "Quicksand",
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
                  mt={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Radio
                    checked={selectedOption === i}
                    onChange={(e) => handleOptionChange(e, i)}
                    value={i}
                    name="options"
                    color="primary"
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
                    sx={{ cursor: "pointer", zIndex: 10, margin: "10px" }}
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
                          width: "200px",
                          height: "150px",
                        }}
                        alt=""
                      />
                    )}

                    <h1
                      style={{
                        color: "#262649",
                        fontWeight: 600,
                        fontSize: "24px",
                        fontFamily: "Quicksand",
                        marginLeft: "10px",
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

      <Box paddingTop={1} sx={{ display: "flex", justifyContent: "center" }}>
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
