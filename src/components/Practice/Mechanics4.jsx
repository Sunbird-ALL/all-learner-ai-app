import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import VoiceAnalyser from "../../utils/VoiceAnalyser";
import MainLayout from "../Layouts.jsx/MainLayout";
// import useSound from "use-sound";
// import t from "../../assets/audio/t.mp3";
// import i from "../../assets/audio/i.mp3";
// import g from "../../assets/audio/g.mp3";
// import e from "../../assets/audio/e.mp3";
// import r from "../../assets/audio/r.mp3";
import correctSound from "../../assets/correct.wav";
import wrongSound from "../../assets/audio/wrong.wav";
import addSound from "../../assets/audio/add.mp3";
import removeSound from "../../assets/remove.wav";
import { splitGraphemes } from "split-graphemes";
import usePreloadAudio from "../../hooks/usePreloadAudio";
import { practiceSteps, getLocalData } from "../../utils/constants";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  CircularProgress,
} from "@mui/material";
const theme = createTheme();
const Mechanics4 = ({
  page,
  setPage,
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  header,
  parentWords = "",
  image,
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
  isNextButtonCalled,
  setIsNextButtonCalled,
}) => {
  const [words, setWords] = useState(
    type === "word" ? [] : ["Friend", "She is", "My"]
  );
  const correctSoundAudio = usePreloadAudio(correctSound);
  const wrongSoundAudio = usePreloadAudio(wrongSound);
  const addSoundAudio = usePreloadAudio(addSound);
  const removeSoundAudio = usePreloadAudio(removeSound);
  const [wordsAfterSplit, setWordsAfterSplit] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  let progressDatas = getLocalData("practiceProgress");
  //const virtualId = String(getLocalData("virtualId"));

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  let currentLevel = practiceSteps?.[currentPracticeStep]?.name || "L1";

  if (level === 13 && currentLevel === "P3") {
    switch (currentStep) {
      case 1:
        parentWords = "Tommy received a bright red balloon at the fair.";
        break;
      case 2:
        parentWords =
          "As he was walking home, a strong wind blew the balloon out of his hand.";
        break;
      case 3:
        parentWords = "Tommy chased after it, but it was too fast.";
        break;
      case 4:
        parentWords =
          "A friendly neighbour saw the balloon and grabbed it with a long walking stick.";
        break;
      case 5:
        parentWords = "She returned the balloon to Tommy, who was very happy.";
        break;
    }
  } else if (level === 13 && currentLevel === "P7") {
    switch (currentStep) {
      case 1:
        parentWords =
          "Selvi was walking home from school when she saw a puppy trapped in a fence.";
        break;
      case 2:
        parentWords =
          "She gently freed the puppy and noticed it had a collar with a name tag Tom and a phone number.";
        break;
      case 3:
        parentWords =
          "Selvi called the number, and the owner, Mrs.Anu, answered.";
        break;
      case 4:
        parentWords = "Mrs.Anu was very grateful and came to pick up Tom.";
        break;
      case 5:
        parentWords =
          "Selvi felt happy knowing she had helped reunite Tom with his owner.";
        break;
    }
  }

  useEffect(() => {
    setSelectedWords([]);
  }, [contentId]);

  const [shake, setShake] = useState(false);

  function jumbleSentence(sentence) {
    // Split the sentence into words
    const words = sentence.split(" ");

    // Shuffle the words using Fisher-Yates (Durstenfeld) shuffle algorithm
    for (let i = words.length - 1; i > 0; i--) {
      // Pick a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));

      // Swap words[i] with the element at random index
      [words[i], words[j]] = [words[j], words[i]];
    }

    // Join the jumbled words back into a sentence
    return words;
  }

  useEffect(() => {
    let wordsArr = jumbleSentence(parentWords);
    if (parentWords) {
      for (let i = wordsArr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let k = wordsArr[i];
        wordsArr[i] = wordsArr[j];
        wordsArr[j] = k;
      }
      setWordsAfterSplit(wordsArr);
      setWords(wordsArr);
    }
  }, [parentWords]);

  const [selectedWords, setSelectedWords] = useState([]);

  // const [tPlay] = useSound(t);
  // const [iPlay] = useSound(i);
  // const [gPlay] = useSound(g);
  // const [ePlay] = useSound(e);
  // const [rPlay] = useSound(r);

  // const audioPlay = {
  //   T: tPlay,
  //   I: iPlay,
  //   G: gPlay,
  //   E: ePlay,
  //   R: rPlay,
  // };
  const handleWords = (word, isSelected) => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 3000);
    // audioPlay[word]();
    if (selectedWords?.length + 1 !== wordsAfterSplit?.length || isSelected) {
      let audio = new Audio(isSelected ? removeSoundAudio : addSoundAudio);
      audio.play();
      setEnableNext(false);
    }

    if (isSelected) {
      let selectedWordsArr = [...selectedWords];
      let index = selectedWordsArr?.findIndex((elem) => elem === word);
      selectedWordsArr?.splice(index, 1);
      setSelectedWords(selectedWordsArr);
      setWords([...words, word]);
    } else {
      let wordsArr = [...words];
      let index = wordsArr?.findIndex((elem) => elem === word);
      wordsArr?.splice(index, 1);
      setWords(wordsArr);
      setSelectedWords([...selectedWords, word]);
      if (selectedWords?.length + 1 === wordsAfterSplit?.length) {
        let audio = new Audio(
          [...selectedWords, word]?.join(" ") === parentWords
            ? correctSoundAudio
            : wrongSoundAudio
        );
        audio.play();
      }
    }
  };

  console.log(
    "Mechanics4",
    parentWords,
    words,
    wordsAfterSplit,
    currentStep,
    currentLevel
  );

  const answer =
    selectedWords?.length !== wordsAfterSplit?.length
      ? ""
      : selectedWords?.join(" ") === parentWords
      ? "correct"
      : "wrong";

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m4"}
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
      }}
    >
      <div
        style={{
          left: `calc(50% - 258px / 2)`,
          top: `calc(50% - 45px / 2 - 235.5px)`,
          fontFamily: "Quicksand",
          fontStyle: "normal",
          fontWeight: 600,
          fontSize: isMobile ? "30px" : "36px",
          lineHeight: "45px",
          alignItems: "center",
          textAlign: "center",
          color: "#333F61",
        }}
      >
        {header}
      </div>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 8 }}>
        <Box
          sx={{
            minWidth: "250px",
            minHeight: "75px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
            borderRadius: "15px",
            border: `2px solid ${
              answer === "correct"
                ? "#58CC02"
                : answer === "wrong"
                ? "#C30303"
                : !words?.length && !!selectedWords?.length && type === "word"
                ? "#1897DE"
                : "rgba(51, 63, 97, 0.10)"
            }`,
            cursor: "pointer",
            letterSpacing: answer != "correct" ? "5px" : "normal",
            background: "#FBFBFB",
            paddingX: type === "word" ? 0 : "20px",
          }}
        >
          {selectedWords?.map((elem, ind) => (
            <span
              key={ind}
              onClick={() => handleWords(elem, true)}
              className={
                answer === "wrong"
                  ? `audioSelectedWrongWord ${shake ? "shakeImage" : ""}`
                  : ""
              }
              style={{
                borderRadius: "12px",
                padding: "5px 10px 5px 10px",
                border:
                  answer != "wrong"
                    ? answer === "correct"
                      ? "none" // No border if the answer is correct
                      : answer === "wrong"
                      ? "2px solid #C30303" // Red border if the answer is wrong
                      : !words.length && selectedWords.length && type === "word"
                      ? "2px solid #1897DE" // Blue border for some specific condition
                      : "2px solid rgba(51, 63, 97, 0.15)"
                    : "", // Default light border,
                color:
                  type === "word"
                    ? answer === "correct"
                      ? "#58CC02"
                      : answer === "wrong"
                      ? "#C30303"
                      : "#1897DE"
                    : answer === "wrong"
                    ? "#C30303"
                    : "#333F61",
                fontWeight: type === "word" ? 600 : 700,
                fontSize: isMobile
                  ? "clamp(1rem, 2vw, 2rem)"
                  : "clamp(1.5rem, 2.5vw, 2.5rem)",
                fontFamily: "Quicksand",
                cursor: "pointer",
                marginLeft:
                  type === "word" ? 0 : answer != "correct" ? "20px" : 0,
              }}
            >
              {elem}
            </span>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        {words?.map((elem, ind) => (
          <React.Fragment key={ind}>
            {type === "word" ? (
              <Box
                onClick={() => handleWords(elem)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { xs: "50px", sm: "60px", md: "70px" },
                  minWidth: { xs: "50px", sm: "60px", md: "70px" },
                  background: "#1897DE",
                  m: { xs: 0.5, sm: 1 },
                  cursor: "pointer",
                  borderRadius: "12px",
                  border: "5px solid #10618E",
                  fontSize: { xs: "25px", sm: "30px", md: "35px", lg: "40px" },
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: {
                      xs: "25px",
                      sm: "35px",
                      md: "40px",
                      lg: "40px",
                    },
                    fontFamily: "Quicksand",
                  }}
                >
                  {elem}
                </span>
              </Box>
            ) : (
              <Box
                onClick={() => handleWords(elem)}
                sx={{
                  textAlign: "center",
                  px: { xs: "15px", sm: "20px", md: "25px" },
                  py: { xs: "8px", sm: "10px", md: "12px" },
                  m: { xs: 0.5, sm: 1 },
                  textTransform: "none",
                  borderRadius: "12px",
                  border: `1px solid rgba(51, 63, 97, 0.10)`,
                  background: "#FFF",
                  cursor: "pointer",
                  fontSize: { xs: "25px", sm: "30px", md: "35px", lg: "40px" },
                }}
              >
                <span
                  style={{
                    color: "#6F80B1",
                    fontWeight: 600,
                    fontFamily: "Quicksand",
                  }}
                >
                  {elem}
                </span>
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>

      {
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <VoiceAnalyser
            pageName={"m4"}
            setVoiceText={setVoiceText}
            setRecordedAudio={setRecordedAudio}
            setVoiceAnimate={setVoiceAnimate}
            storyLine={storyLine}
            dontShowListen={type === "image" || isDiscover}
            // updateStory={updateStory}
            handleNext={handleNext}
            enableNext={enableNext}
            originalText={parentWords}
            audioLink={audio ? audio : null}
            {...{
              contentId,
              contentType,
              currentLine: currentStep - 1,
              playTeacherAudio,
              callUpdateLearner,
              isShowCase,
              setEnableNext,
              showOnlyListen: answer !== "correct",
              setOpenMessageDialog,
              isNextButtonCalled,
              setIsNextButtonCalled,
            }}
          />
        </Box>
      }
    </MainLayout>
  );
};

export default Mechanics4;
