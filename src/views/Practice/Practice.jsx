import React, { useEffect, useState } from "react";
import Mechanics2 from "../../components/Practice/Mechanics2";
import Mechanics3 from "../../components/Practice/Mechanics3";
import Mechanics4 from "../../components/Practice/Mechanics4";
import Mechanics5 from "../../components/Practice/Mechanics5";
import { useNavigate } from "react-router-dom";
import {
  callConfetti,
  getLocalData,
  levelGetContent,
  practiceSteps,
  setLocalData,
} from "../../utils/constants";
import axios from "axios";
import WordsOrImage from "../../components/Mechanism/WordsOrImage";
import { uniqueId } from "../../services/utilService";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import { splitGraphemes } from "split-graphemes";
import { Typography } from "@mui/material";
import config from "../../utils/urlConstants.json";
import { MessageDialog } from "../../components/Assesment/Assesment";
import { Log } from "../../services/telementryService";
import Mechanics6 from "../../components/Practice/Mechanics6";

const Practice = () => {
  const [page, setPage] = useState("");
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [points, setPoints] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [enableNext, setEnableNext] = useState(false);
  const [progressData, setProgressData] = useState({});
  const [level, setLevel] = useState(0);
  const [isShowCase, setIsShowCase] = useState(false);
  const [startShowCase, setStartShowCase] = useState(false);
  const limit = 5;
  const [disableScreen, setDisableScreen] = useState(false);
  const [mechanism, setMechanism] = useState("");

  const [livesData, setLivesData] = useState();
  const [gameOverData, setGameOverData] = useState();
  const [loading, setLoading] = useState();
  const LIVES = 5;
  const TARGETS_PERCENTAGE = 0.3;
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const lang = getLocalData("lang");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [fluency, setFluency] = useState(false);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);

  const gameOver = (data, isUserPass) => {
    const userWon = isUserPass;
    const meetsFluencyCriteria = livesData?.meetsFluencyCriteria;
    setGameOverData({ gameOver: true, userWon, ...data, meetsFluencyCriteria });
  };

  useEffect(() => {
    if (startShowCase) {
      setLivesData({ ...livesData, lives: LIVES });
    }
  }, [startShowCase]);

  const callConfettiAndPlay = () => {
    let audio = new Audio(LevelCompleteAudio);
    audio.play();
    callConfetti();
  };

  useEffect(() => {
    let currentPracticeStep = progressData.currentPracticeStep;
    let fromBack = progressData.fromBack;
    if (
      questions?.length &&
      Number(currentPracticeStep + 1) > 0 &&
      currentQuestion === 0 &&
      !fromBack
      // !state?.refresh
    ) {
      setDisableScreen(true);
      callConfettiAndPlay();

      setTimeout(() => {
        setOpenMessageDialog({
          message: `You have successfully completed ${practiceSteps[currentPracticeStep].fullName} `,
        });
      }, 1200);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isShowCase) {
      setLocalData("sub_session_id", uniqueId());
    }
  }, [isShowCase]);

  useEffect(() => {
    if (voiceText === "error") {
      setOpenMessageDialog({
        message: "Sorry I couldn't hear a voice. Could you please speak again?",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText == "success") {
      setVoiceText("");
    }
    //eslint-disable-next-line
  }, [voiceText]);

  const send = (score) => {
    if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
      let allowedOrigins = [];
      try {
        allowedOrigins = JSON.parse(
          process.env.REACT_APP_PARENT_ORIGIN_URL || "[]"
        );
      } catch (error) {
        console.error(
          "Invalid JSON format in REACT_APP_PARENT_ORIGIN_URL:",
          error
        );
      }
      const parentOrigin =
        window?.location?.ancestorOrigins?.[0] || window.parent.location.origin;
      if (allowedOrigins.includes(parentOrigin)) {
        window.parent.postMessage(
          {
            score: score,
            message: "all-test-rig-score",
          },
          parentOrigin
        );
      }
    }
  };

  const checkFluency = (contentType, fluencyScore) => {
    switch (contentType.toLowerCase()) {
      case "word":
        setFluency(fluencyScore < 2);
        break;
      case "sentence":
        setFluency(fluencyScore < 6);
        break;
      case "paragraph":
        setFluency(fluencyScore < 10);
        break;
      default:
        setFluency(true);
    }
  };

  const handleNext = async (isGameOver) => {
    setIsNextButtonCalled(true);
    setEnableNext(false);

    try {
      const lang = getLocalData("lang");
      if (localStorage.getItem("contentSessionId") !== null) {
        setPoints(1);
        if (isShowCase) {
          send(1);
        }
      } else {
        const pointsRes = await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_POINTER}`,
          {
            userId: localStorage.getItem("virtualId"),
            sessionId: localStorage.getItem("sessionId"),
            points: 1,
            language: lang,
            milestone: `m${level}`,
          }
        );
        setPoints(pointsRes?.data?.result?.totalLanguagePoints || 0);
      }

      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");

      let practiceProgress = getLocalData("practiceProgress");

      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      let currentPracticeStep = "";
      let currentPracticeProgress = "";

      if (practiceProgress?.[virtualId]) {
        currentPracticeStep = practiceProgress[virtualId].currentPracticeStep;
        currentPracticeProgress = Math.round(
          ((currentQuestion + 1 + currentPracticeStep * limit) /
            (practiceSteps.length * limit)) *
            100
        );
      }

      let showcasePercentage = ((currentQuestion + 1) * 100) / questions.length;

      await axios.post(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
        {
          userId: virtualId,
          sessionId: sessionId,
          milestone: isShowCase ? "showcase" : "practice",
          lesson: currentPracticeStep,
          progress: isShowCase ? showcasePercentage : currentPracticeProgress,
          language: lang,
          milestoneLevel: `m${level}`,
        }
      );

      let newPracticeStep =
        currentQuestion === questions.length - 1 || isGameOver
          ? currentPracticeStep + 1
          : currentPracticeStep;
      newPracticeStep = Number(newPracticeStep);
      let newQuestionIndex =
        currentQuestion === questions.length - 1 ? 0 : currentQuestion + 1;

      const currentGetContent = levelGetContent[
        localStorage.getItem("lang") || "en"
      ]?.[level]?.find(
        (elem) => elem.title === practiceSteps?.[newPracticeStep]?.name
      );

      if (currentQuestion === questions.length - 1 || isGameOver) {
        // navigate or setNextPracticeLevel
        let currentPracticeStep =
          practiceProgress[virtualId].currentPracticeStep;
        let isShowCase = currentPracticeStep === 4 || currentPracticeStep === 9; // P4 or P8
        if (isShowCase || isGameOver) {
          // assesment

          const sub_session_id = getLocalData("sub_session_id");
          const getSetResultRes = await axios.post(
            `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
            {
              sub_session_id: sub_session_id,
              contentType: currentContentType,
              session_id: sessionId,
              user_id: virtualId,
              totalSyllableCount: totalSyllableCount,
              language: localStorage.getItem("lang"),
              is_mechanics: mechanism?.id,
            }
          );
          const { data: getSetData } = getSetResultRes;
          const data = JSON.stringify(getSetData?.data);
          Log(data, "practice", "ET");
          setPercentage(getSetData?.data?.percentage);
          checkFluency(currentContentType, getSetData?.data?.fluency);
          if (process.env.REACT_APP_POST_LEARNER_PROGRESS === "true") {
            await axios.post(
              `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.CREATE_LEARNER_PROGRESS}`,
              {
                userId: virtualId,
                sessionId: sessionId,
                subSessionId: sub_session_id,
                milestoneLevel: getSetData?.data?.currentLevel,
                totalSyllableCount: totalSyllableCount,
                language: localStorage.getItem("lang"),
              }
            );
          }
          setLocalData("previous_level", getSetData.data.previous_level);
          if (getSetData.data.sessionResult === "pass") {
            try {
              await axios.post(
                `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
                {
                  userId: virtualId,
                  sessionId: sessionId,
                  milestone: "practice",
                  lesson: "0",
                  progress: 0,
                  language: lang,
                  milestoneLevel: getSetData.data.currentLevel,
                }
              );
              gameOver({ link: "/assesment-end" }, true);
              return;
            } catch (e) {
              // catch error
            }
          }
        }

        let quesArr = [];

        if (newPracticeStep == 10) {
          newPracticeStep = 0;
          currentPracticeProgress = 0;
        }

        await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
          {
            userId: virtualId,
            sessionId: sessionId,
            milestone: "practice",
            lesson: newPracticeStep,
            progress: currentPracticeProgress,
            language: lang,
            milestoneLevel: `m${level}`,
          }
        );

        if (newPracticeStep == 0 || newPracticeStep == 5 || isGameOver) {
          gameOver();
          return;
        }
        const resGetContent = await axios.get(
          `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}` +
            (currentGetContent?.mechanism?.id
              ? `&mechanics_id=${currentGetContent?.mechanism?.id}`
              : "") +
            (currentGetContent?.competency
              ? `&level_competency=${currentGetContent?.competency}`
              : "") +
            (currentGetContent?.tags
              ? `&tags=${currentGetContent?.tags}`
              : "") +
            (currentGetContent?.storyMode
              ? `&story_mode=${currentGetContent?.storyMode}`
              : "")
        );

        //Need: required only for S1 and S2

        setTotalSyllableCount(resGetContent?.data?.totalSyllableCount);
        setLivesData({
          ...livesData,
          totalTargets: resGetContent?.data?.totalSyllableCount,
          targetsForLives:
            resGetContent?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE,
          targetPerLive:
            (resGetContent?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE) /
            LIVES,
        });

        let showcaseLevel =
          currentPracticeStep === 3 || currentPracticeStep === 8;
        setIsShowCase(showcaseLevel);

        // Need: API returns contents if 200 status
        quesArr = [...quesArr, ...(resGetContent?.data?.content || [])];
        setCurrentContentType(resGetContent?.data?.content?.[0]?.contentType);
        setCurrentCollectionId(resGetContent?.data?.content?.[0]?.collectionId);

        // Need: not required - not using this anywhere

        setCurrentQuestion(0);

        // Need: not required - we are geting this data from API
        practiceProgress[virtualId] = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress[virtualId]);
        localStorage.setItem("storyTitle", resGetContent?.name);

        setQuestions(quesArr);

        // Need: needs to revisit this logic
        setTimeout(() => {
          setMechanism(currentGetContent.mechanism);
        }, 1000);
      } else if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);

        practiceProgress[virtualId] = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress[virtualId]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [temp_audio, set_temp_audio] = useState(null);
  const [audioPlayFlag, setAudioPlayFlag] = useState(true); // base64url of teachertext

  const learnAudio = () => {
    if (temp_audio !== null) {
      temp_audio.play();
      setAudioPlayFlag(!audioPlayFlag);
      temp_audio.addEventListener("ended", () => setAudioPlayFlag(true));
    }
  };

  useEffect(() => {
    learnAudio();
  }, [temp_audio]);

  const playTeacherAudio = () => {
    const contentId = questions[currentQuestion]?.contentId;
    let audio = new Audio(
      `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
    );
    audio.addEventListener("canplaythrough", () => {
      set_temp_audio(
        new Audio(
          `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${contentId}.wav`
        )
      );
    });
  };

  const fetchDetails = async () => {
    let quesArr = [];
    try {
      setLoading(true);
      const lang = getLocalData("lang");
      const virtualId = getLocalData("virtualId");
      let sessionId = getLocalData("sessionId");

      if (!sessionId) {
        sessionId = uniqueId();
        localStorage.setItem("sessionId", sessionId);
      }

      const getMilestoneDetails = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}/${virtualId}?language=${lang}`
      );

      // Need: validate the getMilestoneDetails API return

      setLocalData(
        "getMilestone",
        JSON.stringify({ ...getMilestoneDetails.data })
      );

      let level =
        Number(
          getMilestoneDetails?.data.data?.milestone_level?.replace("m", "")
        ) || 1;

      setLevel(level);

      const resLessons = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_LESSON_PROGRESS_BY_ID}/${virtualId}?language=${lang}`
      );

      // Need: Handle Error for lessons - no lesson progress - starting point should be P1

      const getPointersDetails = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.GET_POINTER}/${virtualId}/${sessionId}?language=${lang}`
      );

      // Need: Just Opss icon - we are trying to fetch the score for you
      setPoints(getPointersDetails?.data?.result?.totalLanguagePoints || 0);

      let userState = Number.isInteger(
        Number(resLessons.data?.result?.result?.lesson)
      )
        ? Number(resLessons.data?.result?.result?.lesson)
        : 0;

      // Need: revisit this - looks like not required
      let practiceProgress = getLocalData("practiceProgress");
      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      practiceProgress[virtualId] = {
        currentQuestion: 0,
        currentPracticeProgress: (userState / practiceSteps.length) * 100,
        currentPracticeStep: userState || 0,
      };

      const currentGetContent = levelGetContent[
        localStorage.getItem("lang") || "en"
      ]?.[level]?.find(
        (elem) => elem.title === practiceSteps?.[userState].name
      );

      const resWord = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}` +
          (currentGetContent?.mechanism?.id
            ? `&mechanics_id=${currentGetContent?.mechanism?.id}`
            : "") +
          (currentGetContent?.competency
            ? `&level_competency=${currentGetContent?.competency}`
            : "") +
          (currentGetContent?.tags ? `&tags=${currentGetContent?.tags}` : "") +
          (currentGetContent?.storyMode
            ? `&story_mode=${currentGetContent?.storyMode}`
            : "")
      );

      // Need: handle error if resWord is empty

      setTotalSyllableCount(resWord?.data?.totalSyllableCount);
      setLivesData({
        ...livesData,
        totalTargets: resWord?.data?.totalSyllableCount,
        targetsForLives:
          resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE,
        targetPerLive:
          (resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
      });
      quesArr = [...quesArr, ...(resWord?.data?.content || [])];
      setCurrentContentType(currentGetContent.criteria);

      setCurrentCollectionId(resWord?.data?.content?.[0]?.collectionId);

      localStorage.setItem("storyTitle", resWord?.name);

      setQuestions(quesArr);
      setMechanism(currentGetContent.mechanism);

      let showcaseLevel = userState === 4 || userState === 9;
      setIsShowCase(showcaseLevel);
      if (showcaseLevel) {
        await axios.post(
          `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
          {
            userId: virtualId,
            sessionId: sessionId,
            milestone: "showcase",
            lesson: userState,
            progress: 0,
            language: lang,
            milestoneLevel: `m${level}`,
          }
        );
      }

      setCurrentQuestion(practiceProgress[virtualId]?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
      setProgressData(practiceProgress[virtualId]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("err", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleBack = async () => {
    if (progressData.currentPracticeStep > 0) {
      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");
      const lang = getLocalData("lang");
      let practiceProgress = {};
      let newCurrentPracticeStep =
        progressData.currentPracticeStep === 5
          ? 3
          : progressData.currentPracticeStep - 1;
      practiceProgress[virtualId] = {
        currentQuestion: 0,
        currentPracticeProgress:
          (newCurrentPracticeStep / practiceSteps.length) * 100,
        currentPracticeStep: newCurrentPracticeStep,
        fromBack: true,
      };

      await axios.post(
        `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
        {
          userId: virtualId,
          sessionId: sessionId,
          milestone: "practice",
          lesson: newCurrentPracticeStep,
          progress: (newCurrentPracticeStep / practiceSteps.length) * 100,
          language: lang,
          milestoneLevel: `m${level}`,
        }
      );

      setProgressData(practiceProgress[virtualId]);

      const currentGetContent = levelGetContent[
        localStorage.getItem("lang") || "en"
      ]?.[level]?.find(
        (elem) => elem.title === practiceSteps?.[newCurrentPracticeStep].name
      );
      let quesArr = [];
      const resWord = await axios.get(
        `${process.env.REACT_APP_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${currentGetContent.criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}` +
          (currentGetContent?.mechanism?.id
            ? `&mechanics_id=${currentGetContent?.mechanism?.id}`
            : "") +
          (currentGetContent?.competency
            ? `&level_competency=${currentGetContent?.competency}`
            : "") +
          (currentGetContent?.tags ? `&tags=${currentGetContent?.tags}` : "") +
          (currentGetContent?.storyMode
            ? `&story_mode=${currentGetContent?.storyMode}`
            : "")
      );
      setTotalSyllableCount(resWord?.data?.totalSyllableCount);
      setLivesData({
        ...livesData,
        totalTargets: resWord?.data?.totalSyllableCount,
        targetsForLives:
          resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE,
        targetPerLive:
          (resWord?.data?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
      });
      quesArr = [...quesArr, ...(resWord?.data?.content || [])];
      setCurrentContentType(currentGetContent.criteria);
      setCurrentCollectionId(resWord?.data?.content?.[0]?.collectionId);

      localStorage.setItem("storyTitle", resWord?.name);
      setQuestions(quesArr);
      setTimeout(() => {
        setMechanism(currentGetContent.mechanism);
      }, 1000);
      setCurrentQuestion(practiceProgress[virtualId]?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
    } else {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    }
  };

  useEffect(() => {
    if (livesData?.scoreData) {
      if (livesData?.redLivesToShow <= 0) {
        handleNext(true);
      }
    }
  }, [livesData]);

  function highlightWords(sentence, matchedChar) {
    const words = sentence.split(" ");
    matchedChar.sort(function (str1, str2) {
      return str2.length - str1.length;
    });

    let type = currentContentType?.toLowerCase();
    if (type === "char" || type === "word") {
      const word = splitGraphemes(words[0].toLowerCase()).filter(
        (item) => item !== "‌" && item !== "" && item !== " "
      );
      let highlightedString = [];
      let i = 0;
      for (const char of word) {
        let matchFound = false;
        for (const matched of matchedChar) {
          const length = splitGraphemes(matched).filter(
            (item) => item !== "‌" && item !== "" && item !== " "
          ).length;
          const substr = word.slice(i, i + length).join("");

          if (substr.includes(matched)) {
            highlightedString.push(
              <React.Fragment key={i}>
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                    fontWeight: 700,
                    fontFamily: "Quicksand",
                    lineHeight: "50px",
                    background: "#FFF0BD",
                  }}
                >
                  {i === 0 ? substr.toUpperCase() : substr}
                </Typography>
              </React.Fragment>
            );
            i += length - 1;
            matchFound = true;
            break;
          }
        }
        if (!matchFound) {
          highlightedString.push(
            <React.Fragment key={i}>
              <Typography
                variant="h5"
                component="h4"
                sx={{
                  color: "#333F61",
                  fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                }}
              >
                {i === 0 ? char.toUpperCase() : char}
              </Typography>
            </React.Fragment>
          );
        }
        i++;
      }
      return highlightedString;
    } else {
      const highlightedSentence = words.map((word, index) => {
        const isMatched = matchedChar.some((char) =>
          word.toLowerCase().includes(char)
        );
        if (isMatched) {
          return (
            <React.Fragment key={index}>
              <Typography
                variant="h5"
                component="h4"
                ml={1}
                sx={{
                  fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: "Quicksand",
                  lineHeight: "50px",
                  background: "#FFF0BD",
                }}
              >
                {word}
              </Typography>{" "}
            </React.Fragment>
          );
        } else {
          return (
            <Typography
              variant="h5"
              component="h4"
              ml={1}
              sx={{
                color: "#333F61",
                fontSize: "clamp(1.6rem, 2.5vw, 3.8rem)",
                fontWeight: 700,
                fontFamily: "Quicksand",
                lineHeight: "50px",
              }}
              key={word}
            >
              {word + " "}
            </Typography>
          );
        }
      });
      return highlightedSentence;
    }
  }

  useEffect(() => {
    if (questions[currentQuestion]?.contentSourceData) {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        const contentSourceData =
          questions[currentQuestion]?.contentSourceData || [];
        const stringLengths = contentSourceData.map((item) => item.text.length);
        const length =
          questions[currentQuestion]?.mechanics_data &&
          (questions[currentQuestion]?.mechanics_data[0]?.mechanics_id ===
            "mechanic_2" ||
            questions[currentQuestion]?.mechanics_data[0]?.mechanics_id ===
              "mechanic_1")
            ? 500
            : stringLengths[0];
        let allowedOrigins = [];
        try {
          allowedOrigins = JSON.parse(
            process.env.REACT_APP_PARENT_ORIGIN_URL || "[]"
          );
        } catch (error) {
          console.error(
            "Invalid JSON format in REACT_APP_PARENT_ORIGIN_URL:",
            error
          );
        }
        const parentOrigin =
          window?.location?.ancestorOrigins?.[0] ||
          window.parent.location.origin;
        if (allowedOrigins.includes(parentOrigin)) {
          window.parent.postMessage(
            { type: "stringLengths", length },
            parentOrigin
          );
        }
      }
    }
  }, [questions[currentQuestion]]);

  const renderMechanics = () => {
    if (!mechanism) {
      return (
        <WordsOrImage
          {...{
            level: !isShowCase && level,
            header: getHeader(questions[currentQuestion]?.contentType),
            words: questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            handleNext,
            type: questions[currentQuestion]?.contentType,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background: getBackground(isShowCase),
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            startShowCase,
            setStartShowCase,
            handleBack: !isShowCase && handleBack,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            loading,
            percentage,
            fluency,
            setOpenMessageDialog,
            setEnableNext,
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (mechanism.name === "fillInTheBlank" && mechanism.id !== "") {
      return (
        <Mechanics3
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header: getHeader(
              mechanism.name,
              questions[currentQuestion]?.contentType
            ),
            parentWords: questions[currentQuestion]?.mechanics_data?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            handleNext,
            image: getImageUrl(questions[currentQuestion]?.mechanics_data),
            audio: getAudioUrl(questions[currentQuestion]?.mechanics_data),
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background: getBackground(isShowCase),
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords: getAllWords(questions),
            loading,
            setOpenMessageDialog,
            options: getOptions(questions[currentQuestion]?.mechanics_data),
          }}
        />
      );
    } else if (mechanism.name === "formAWord") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header: getHeader(questions[currentQuestion]?.contentType),
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            handleNext,
            type: "word",
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background: getBackground(isShowCase),
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
          }}
        />
      );
    } else if (mechanism.name === "readTheImage") {
      const options = getOptions(questions[currentQuestion]?.mechanics_data);
      const audioLink = getAudioLink(options);
      const mechanics_data = questions[currentQuestion]?.mechanics_data;

      return (
        <Mechanics5
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              "Look at the picture and speak the correct answer from below",
            parentWords: getParentWords(
              mechanics_data,
              questions[currentQuestion]
            ),
            contentType: currentContentType,
            question_audio: getQuestionAudio(
              mechanics_data,
              questions[currentQuestion]
            ),
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            options: options,
            correctness: mechanics_data ? mechanics_data[0]?.correctness : null,
            setRecordedAudio,
            setVoiceAnimate,
            handleNext,
            type: "word",
            image: getImageUrl(mechanics_data),
            audio: getAudioUrl(mechanics_data, audioLink),
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background: getBackground(isShowCase),
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            matchedChar: !isShowCase && questions[currentQuestion]?.matchedChar,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
          }}
        />
      );
    } else if (mechanism.name === "formASentence") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header: "Form a sentence using the words and speak",
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            jumbled_text:
              questions[currentQuestion]?.mechanics_data?.[0]?.jumbled_text,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            handleNext,
            audio: getAudioUrl(questions[currentQuestion]?.mechanics_data),
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background: getBackground(isShowCase),
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords: getAllWords(questions),
            loading,
            setOpenMessageDialog,
          }}
        />
      );
    } else if (
      mechanism.name === "audio" ||
      (mechanism.name === "fillInTheBlank" && mechanism.id === "")
    ) {
      return (
        <Mechanics6
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header: getHeader(
              mechanism.name,
              questions[currentQuestion]?.contentType
            ),
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            handleNext,
            image: getImageUrl(questions[currentQuestion]?.mechanics_data),
            audio: getAudioUrl(questions[currentQuestion]?.mechanics_data),
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background: getBackground(isShowCase),
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords: getAllWords(questions),
            loading,
            setOpenMessageDialog,
            options: getOptions(questions[currentQuestion]?.mechanics_data),
          }}
        />
      );
    } else if (page == 1) {
      return <Mechanics2 page={page} setPage={setPage} />;
    }
  };

  const getHeader = (mechanismName, contentType) => {
    if (mechanismName === "fillInTheBlank") {
      return "Fill in the blank";
    } else if (contentType === "image") {
      return "Guess the below image";
    } else {
      return `Speak the below ${contentType}`;
    }
  };

  const getBackground = (isShowCase) => {
    return isShowCase
      ? "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)"
      : undefined;
  };

  const getImageUrl = (mechanicsData) => {
    return mechanicsData
      ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${mechanicsData[0]?.image_url}`
      : null;
  };

  const getAudioUrl = (mechanicsData, audioLink) => {
    if (mechanicsData) {
      return `${
        process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL
      }/mechanics_audios/${audioLink || mechanicsData[0]?.audio_url}`;
    }
    return null;
  };

  const getAllWords = (questions) => {
    return questions?.map((elem) => elem?.contentSourceData?.[0]?.text) || [];
  };

  const getOptions = (mechanicsData) => {
    return mechanicsData ? mechanicsData[0]?.options : [];
  };

  const getAudioLink = (options) => {
    return options && options.length > 0
      ? options.find((option) => option.isAns === true)?.audio_url || null
      : null;
  };

  const getParentWords = (mechanicsData, question) => {
    return mechanicsData
      ? mechanicsData[0].text
      : question?.contentSourceData?.[0]?.text;
  };

  const getQuestionAudio = (mechanicsData, question) => {
    return mechanicsData
      ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${mechanicsData[0].audio_url}`
      : question?.contentSourceData?.[0]?.audio_url;
  };
  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
            setDisableScreen(false);
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      {renderMechanics()}
    </>
  );
};

export default Practice;
