/* global globalThis */
// ─── Static imports (must all come before any declarations) ─────────────────
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  lazy,
  Suspense,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { splitGraphemes } from "split-graphemes";
// Named helper exports from RFlow modules — used in business logic, must be static
import { getF1FlowStep, advanceF1Flow, F1_FLOW } from "../../RFlow/F1";
import { getF2FlowStep, advanceF2Flow, F2_FLOW } from "../../RFlow/F2";
import { getF3FlowStep, advanceF3Flow, F3_FLOW } from "../../RFlow/F3";
import {
  callConfetti,
  getLocalData,
  isRecommendationApiEnabledForLang,
  practiceSteps,
  sendTestRigScore,
  setLocalData,
} from "../../utils/constants";
import { getUiStrings } from "../../constants/strings";
import { levelGetContent } from "../../data/levelContent";
import { getFontFamily } from "../../utils/fontUtils";
import {
  markFlowLearnStepStart,
  calculateLetterTrainDuration,
  getStepTitleFromFlowIndex,
} from "../../utils/flowStepTelemetry";
import { uniqueId } from "../../services/utilService";
import { Log } from "../../services/telemetryService";
import { MessageDialog } from "../../components/Assesment/Assesment";
import { RetryDialog } from "../../components/Practice/RetryDialog";
import * as Assets from "../../utils/imageAudioLinks";
import * as s3Assets from "../../utils/s3Links";
import { getAssetUrl } from "../../utils/s3Links";
import { getAssetAudioUrl } from "../../utils/s3Links";
import usePreloadAudio from "../../hooks/usePreloadAudio";
import { levelMapping } from "../../utils/levelData";
import config from "../../utils/urlConstants.json";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import {
  addLesson,
  addPointer,
  addCorrectPracticeWords,
  fetchUserPoints,
  createLearnerProgress,
  getLessonProgressByID,
} from "../../services/orchestration/orchestrationService";
import {
  getContent,
  getContentNew,
  getFetchMilestoneDetails,
  getSetResultPractice,
  callEngagementPredictor,
  clearInteractions,
} from "../../services/learnerAi/learnerAiService";
import { levels, levelTwo, levelThree } from "../../data/practiceContent";
import { onLocalData } from "../../utils/localStorageEvents";
import { useAlphabetDemo } from "../../context/AlphabetDemoContext";

// ─── Lazy-loaded activity components (one chunk each) ────────────────────────
const Mechanics2 = lazy(() => import("../../components/Practice/Mechanics2"));
const Mechanics3 = lazy(() => import("../../components/Practice/Mechanics3"));
const Mechanics4 = lazy(() => import("../../components/Practice/Mechanics4"));
const Mechanics5 = lazy(() => import("../../components/Practice/Mechanics5"));
const Mechanics6 = lazy(() => import("../../components/Practice/Mechanics6"));
const Mechanics7 = lazy(() => import("../../components/Practice/Mechanics7"));
const BingoCard = lazy(() => import("../../components/Practice/BingoCard"));
const SyllablePuzzle = lazy(() =>
  import("../../components/Practice/SyllablePuzzle")
);
const ReadAloud = lazy(() => import("../../components/Practice/ReadAloud"));
const R3 = lazy(() => import("../../components/Practice/R3"));
const TowreFlow = lazy(() => import("../../components/Practice/TowreFlow"));
const McqFlow = lazy(() => import("../../components/Practice/McqFlow"));
const JumbledWord = lazy(() => import("../../components/Practice/JumbledWord"));
const AskMoreM14 = lazy(() => import("../../components/Practice/AskMoreM14"));
const ActOutM13 = lazy(() => import("../../components/Practice/ActOutM13"));
const PhoneConversation = lazy(() =>
  import("../../components/Practice/PhoneConversation")
);
const PhrasesInAction = lazy(() =>
  import("../../components/Practice/PhrasesInAction")
);
const WhatsMissing = lazy(() =>
  import("../../components/Practice/WhatsMissing")
);
const ArrangePicture = lazy(() =>
  import("../../components/Practice/ArrangePicture")
);
const AnouncementFlow = lazy(() =>
  import("../../components/Practice/AnouncementFlow")
);
const FluencyP1 = lazy(() => import("../../components/Practice/FluencyP1"));
const FluencyP2 = lazy(() => import("../../components/Practice/FluencyP2"));
const FluencyP3 = lazy(() => import("../../components/Practice/FluencyP3"));
const FluencyP4 = lazy(() => import("../../components/Practice/FluencyP4"));
const FluencyP5 = lazy(() => import("../../components/Practice/FluencyP5"));
const LetterHuntMechanics = lazy(() =>
  import("../../components/Practice/LetterHuntMechanics")
);
const LetterLauncherMechanics = lazy(() =>
  import("../../components/Practice/LetterLauncherMechanics")
);
const MemoryChallengeMechanics = lazy(() =>
  import("../../components/Practice/MemoryChallengeMechanics")
);
const ParagraphFlow = lazy(() =>
  import("../../components/Practice/ParagraphFlow")
);
const AserFlow = lazy(() => import("../../components/Practice/AserFlow"));
const ReadMatch = lazy(() => import("../../components/Practice/ReadMatch"));
const WordWall = lazy(() => import("../../components/Practice/WordWall"));
const WordsOrImage = lazy(() =>
  import("../../components/Mechanism/WordsOrImage")
);
const R0 = lazy(() => import("../../RFlow/R0"));
const R1 = lazy(() => import("../../RFlow/R1"));
const R2 = lazy(() => import("../../RFlow/R2"));
const R4 = lazy(() => import("../../RFlow/R4"));
const LetterTrain = lazy(() => import("../../RFlow/LetterTrain"));
const F1 = lazy(() => import("../../RFlow/F1"));
const F2 = lazy(() => import("../../RFlow/F2"));
const Barakhadi = lazy(() => import("../../RFlow/Barakhadi"));
const R3Flow = lazy(() => import("../../RFlow/R3"));
const SoundHunt = lazy(() => import("../../RFlow/SoundHunt"));
const SoundHuntS1Combined = lazy(() =>
  import("../../RFlow/SoundHuntS1Combined")
);

const Practice = () => {
  const [page, setPage] = useState("");
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [points, setPoints] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [enableNext, setEnableNext] = useState(false);
  const [progressData, setProgressData] = useState({});
  const justCompletedStepRef = useRef(null);
  const [currentImage, setCurrentImage] = useState({});
  const [parentWords, setParentWords] = useState({});
  const [levelOneWord, setLevelOneWord] = useState("");
  const [level, setLevel] = useState(0);
  const [vocabCount, setVocabCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [isShowCase, setIsShowCase] = useState(false);
  const [startShowCase, setStartShowCase] = useState(false);
  // M4 to M9 milestone levels should show 10 contents instead of 5
  const limit = useMemo(() => (level >= 4 && level <= 9 ? 10 : 5), [level]);
  const [disableScreen, setDisableScreen] = useState(false);
  const [mechanism, setMechanism] = useState("");
  const [refAudio, setRefAudio] = useState("");
  const [livesData, setLivesData] = useState();
  const [gameOverData, setGameOverData] = useState();
  const [loading, setLoading] = useState();
  const [fetchError, setFetchError] = useState(false);
  const LIVES = 5;
  const TARGETS_PERCENTAGE = 0.3;
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const [showRetryDialog, setShowRetryDialog] = useState(false);
  const [retryDialogMessage, setRetryDialogMessage] = useState("");
  const lang = getLocalData("lang");
  const ui = useMemo(() => getUiStrings(lang), [lang]);
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [fluency, setFluency] = useState(false);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [rStep, setRStep] = useState(() => {
    return Number(getLocalData("rStep")) || 2;
  });
  const { isAlphabetDemoActive, setIsAlphabetDemoActive } = useAlphabetDemo();

  const [rStepZero, setRStepZero] = useState(() => {
    return Number(getLocalData("rStepZero"));
  });

  // Parsed milestone for effects that run before other milestone-derived state below
  const getMilestoneDataForInit = () => {
    try {
      const milestoneStr = getLocalData("getMilestone");
      if (milestoneStr) {
        return JSON.parse(milestoneStr);
      }
    } catch (e) {
      console.error("Error parsing getMilestone:", e);
    }
    return null;
  };
  const milestoneDataForInit = getMilestoneDataForInit();
  const milestoneLevelForInit =
    milestoneDataForInit?.data?.milestone_level || null;

  // Track F1 flow index in state to trigger re-renders
  const [f1FlowIndexState, setF1FlowIndexState] = useState(() => {
    const savedIndex = getLocalData("f1FlowIndex");
    return savedIndex !== null ? Number(savedIndex) : 0;
  });

  // Track F2 flow index in state to trigger re-renders
  const [f2FlowIndexState, setF2FlowIndexState] = useState(() => {
    const savedIndex = getLocalData("f2FlowIndex");
    return savedIndex !== null ? Number(savedIndex) : 0;
  });

  // Track F3 flow index in state to trigger re-renders
  const [f3FlowIndexState, setF3FlowIndexState] = useState(() => {
    const savedIndex = getLocalData("f3FlowIndex");
    return savedIndex !== null ? Number(savedIndex) : 0;
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setRStepZero(Number(getLocalData("rStepZero")));
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (milestoneLevelForInit === "B" && rStepZero !== 1) {
      setLocalData("mFail", true);
      const f1Step = getF1FlowStep();
      const existingF1Index = getLocalData("f1FlowIndex");
      if (!f1Step.step && existingF1Index === null) {
        setLocalData("f1FlowIndex", 0);
      }
    } else if (
      (level === "B" || level === 1) &&
      rStepZero !== 1 &&
      milestoneLevelForInit !== "B"
    ) {
      setLocalData("mFail", true);
      setLocalData("rStepZero", 0);
    }
  }, [milestoneLevelForInit, rStepZero, level]);

  //console.log("practice rStepZero", rStepZero);

  const handleComplete = (nextStep) => {
    setRStep(nextStep);
    setLocalData("rStep", nextStep);
  };

  let progressDatas = getLocalData("practiceProgress");

  if (typeof progressDatas === "string") {
    progressDatas = JSON.parse(progressDatas);
  }

  let currentPracticeStep;
  if (progressDatas) {
    currentPracticeStep = progressDatas?.currentPracticeStep;
  }

  const currentLevel = practiceSteps?.[currentPracticeStep]?.title || "P1";
  const milestoneType = ["S1", "S2"].includes(currentLevel)
    ? "showcase"
    : "practice";

  //console.log("prog", progressDatas);

  const rFlow = String(getLocalData("rFlow"));
  const tFlow = String(getLocalData("tFlow"));
  const readMatch = String(getLocalData("readMatch"));
  //const setWordWall = setLocalData("wordWall", true);
  const wordWallFlow = String(getLocalData("wordWall"));

  // Get milestone_level from API response to determine which flow to show
  const getMilestoneData = () => {
    try {
      const milestoneStr = getLocalData("getMilestone");
      if (milestoneStr) {
        return JSON.parse(milestoneStr);
      }
    } catch (e) {
      console.error("Error parsing getMilestone:", e);
    }
    return null;
  };
  const milestoneData = getMilestoneData();
  const milestoneLevel = milestoneData?.data?.milestone_level || null;
  const subMilestoneLevel = milestoneData?.data?.sub_milestone_level || null;

  // Check if F1 flow should be active based on milestone_level
  // F1 flow is triggered when milestone_level is "B" and sub_milestone_level is "F1"
  const shouldShowF1 = milestoneLevel === "B" && subMilestoneLevel === "F1";
  // F2 flow is triggered when milestone_level is "B" and sub_milestone_level is "F2"
  const shouldShowF2 = milestoneLevel === "B" && subMilestoneLevel === "F2";
  // F3 flow is triggered when milestone_level is "B" and sub_milestone_level is "F3"
  const shouldShowF3 = milestoneLevel === "B" && subMilestoneLevel === "F3";

  // Sync F1 state with localStorage when it changes externally
  useEffect(() => {
    const saved = getLocalData("f1FlowIndex");
    if (saved !== null) setF1FlowIndexState(Number(saved));
    return onLocalData("f1FlowIndex", (v) => setF1FlowIndexState(Number(v)));
  }, []);

  // Sync F2 state with localStorage when it changes externally
  useEffect(() => {
    const saved = getLocalData("f2FlowIndex");
    if (saved !== null) setF2FlowIndexState(Number(saved));
    return onLocalData("f2FlowIndex", (v) => setF2FlowIndexState(Number(v)));
  }, []);

  // Sync F3 state with localStorage when it changes externally
  useEffect(() => {
    const saved = getLocalData("f3FlowIndex");
    if (saved !== null) setF3FlowIndexState(Number(saved));
    return onLocalData("f3FlowIndex", (v) => setF3FlowIndexState(Number(v)));
  }, []);

  // Check if F1 flow is active (replaces R0/R1)
  // Use state to ensure re-renders when flow advances
  const f1FlowStep = {
    index: f1FlowIndexState,
    step: F1_FLOW[f1FlowIndexState] || null,
    isLast: f1FlowIndexState === F1_FLOW.length - 1,
  };
  const isF1FlowActive = shouldShowF1 && f1FlowStep.step !== null;
  const isF1LearnStep = isF1FlowActive && f1FlowStep.step?.type === "L";
  const isF1PracticeStep = isF1FlowActive && f1FlowStep.step?.type === "P";
  const isF1ApplyStep = isF1FlowActive && f1FlowStep.step?.type === "A";

  // Check if F2 flow is active
  // Use state to ensure re-renders when flow advances
  // Also check localStorage as fallback in case state hasn't updated yet (e.g., during fetchDetails)
  const f2FlowIndexFromStorage = getLocalData("f2FlowIndex");
  const effectiveF2FlowIndex =
    f2FlowIndexFromStorage !== null
      ? Number(f2FlowIndexFromStorage)
      : f2FlowIndexState;
  const f2FlowStep = {
    index: effectiveF2FlowIndex,
    step: F2_FLOW[effectiveF2FlowIndex] || null,
    isLast: effectiveF2FlowIndex === F2_FLOW.length - 1,
  };
  const isF2FlowActive = shouldShowF2 && f2FlowStep.step !== null;

  // Log for debugging if there's a mismatch
  if (
    shouldShowF2 &&
    f2FlowIndexFromStorage !== null &&
    Number(f2FlowIndexFromStorage) !== f2FlowIndexState
  ) {
    // Force state update to match localStorage immediately
    setF2FlowIndexState(Number(f2FlowIndexFromStorage));
  }

  if (shouldShowF2) {
    // F2 flow is active
  }

  // Check if F3 flow is active
  // Use state to ensure re-renders when flow advances
  // Ensure f3FlowIndex is initialized in localStorage if missing and sync state
  useEffect(() => {
    if (shouldShowF3) {
      const savedF3Index = getLocalData("f3FlowIndex");
      const indexToUse = savedF3Index !== null ? Number(savedF3Index) : 0;

      // Always sync localStorage and state - if localStorage is missing, initialize to 0
      if (savedF3Index === null) {
        setLocalData("f3FlowIndex", 0);
        console.log(
          "F3 flow - Initialized f3FlowIndex to 0 (P1) in localStorage"
        );
      }

      // Sync state with localStorage value
      if (f3FlowIndexState !== indexToUse) {
        console.log(
          "F3 flow - Syncing f3FlowIndexState:",
          f3FlowIndexState,
          "->",
          indexToUse,
          "from localStorage"
        );
        setF3FlowIndexState(indexToUse);
      }
    }
  }, [shouldShowF3, f3FlowIndexState]);

  // Get current F3 flow step - always read from localStorage to ensure consistency
  const currentF3FlowStepFromStorage = getF3FlowStep();
  const f3FlowStep = {
    index: currentF3FlowStepFromStorage.index,
    step: currentF3FlowStepFromStorage.step,
    isLast: currentF3FlowStepFromStorage.isLast,
  };

  // Sync state with the step from storage
  useEffect(() => {
    if (
      shouldShowF3 &&
      f3FlowStep.step &&
      f3FlowIndexState !== f3FlowStep.index
    ) {
      console.log(
        "F3 flow - Syncing f3FlowIndexState with f3FlowStep.index:",
        f3FlowIndexState,
        "->",
        f3FlowStep.index
      );
      setF3FlowIndexState(f3FlowStep.index);
    }
  }, [shouldShowF3, f3FlowStep.index, f3FlowIndexState]);

  const isF3FlowActive = shouldShowF3 && f3FlowStep.step !== null;

  // Helper function to map redirect strings to F3 flow indices
  // "P1" -> 0, "P2" -> 1, "P3" -> 2, "P4" -> 3, "P5" -> 4, "P6" -> 6, etc.
  const getF3FlowIndexFromRedirect = (redirect) => {
    if (!redirect || typeof redirect !== "string") return null;

    // Match "P" followed by a number (e.g., "P1", "P6")
    const match = redirect.match(/^P(\d+)$/);
    if (match) {
      const practiceNum = parseInt(match[1], 10);
      // F3_FLOW indices: P1=0, P2=1, P3=2, P4=3, P5=4, A1=5, P6=6, P7=7, P8=8, P9=9, P10=10, A2=11
      // So P1-P5 map to 0-4, P6-P10 map to 6-10
      if (practiceNum >= 1 && practiceNum <= 5) {
        return practiceNum - 1; // P1=0, P2=1, P3=2, P4=3, P5=4
      } else if (practiceNum >= 6 && practiceNum <= 10) {
        return practiceNum; // P6=6, P7=7, P8=8, P9=9, P10=10
      }
    }

    return null;
  };
  const isF2LearnStep = isF2FlowActive && f2FlowStep.step?.type === "L";
  const isF2PracticeStep = isF2FlowActive && f2FlowStep.step?.type === "P";

  useEffect(() => {
    const m =
      typeof mechanism === "object" && mechanism !== null
        ? mechanism.name
        : null;
    if (m !== "letterTrain" && m !== "barakhadi") return;
    if (!isF1LearnStep && !isF2LearnStep) return;
    markFlowLearnStepStart();
  }, [
    mechanism,
    isF1LearnStep,
    isF2LearnStep,
    f1FlowStep.index,
    f2FlowStep.index,
  ]);
  const isF2ApplyStep = isF2FlowActive && f2FlowStep.step?.type === "A";

  // Map F1 flow index to practiceSteps index
  // F1_FLOW index directly maps to practiceSteps index (0->0, 1->1, 2->2, etc.)
  const getF1PracticeStepIndex = () => {
    if (!isF1FlowActive) return progressData?.currentPracticeStep || 0;
    return f1FlowStep.index; // F1 flow index directly maps to practiceSteps index
  };

  const f1PracticeStepIndex = getF1PracticeStepIndex();

  // Check if F1 flow is complete and should show letter hunt
  const f1FlowComplete = String(getLocalData("f1FlowComplete")) === "true";

  // Use state to track f1FlowComplete so component re-renders when it changes
  const [f1FlowCompleteState, setF1FlowCompleteState] =
    useState(f1FlowComplete);

  // useEffect(() => {
  //   if (lang !== "en") {
  //     setLocalData("rFlow", false);
  //   }
  // }, [lang]);

  useEffect(() => {
    // 🎬 Trigger alphabet demo for F1 flow at specific milestones
    // Milestone indices: L1=0,A1=6,A2=13,A3=20
    const immediateMilestones = F1_FLOW.reduce((acc, step, idx) => {
      if (step.type === "L" && step.step === 1) acc.push(idx);
      return acc;
    }, []);
    const deferredMilestones = F1_FLOW.reduce((acc, step, idx) => {
      if (step.type === "A") acc.push(idx);
      return acc;
    }, []);

    const milestoneIndices = [...immediateMilestones, ...deferredMilestones];

    // 🛡️ Clear stale showAlphabetDemo if current index is NOT a milestone
    // This prevents the chart audio from playing after re-login at a non-milestone step (e.g., P1)
    if (!milestoneIndices.includes(f1FlowIndexState)) {
      const staleDemo = getLocalData("showAlphabetDemo");
      if (staleDemo === "true") {
        setLocalData("showAlphabetDemo", "false");
        // 🔇 Tell Assesment.jsx to stop any playing chart audio
        globalThis.dispatchEvent(new Event("alphabetDemoStop"));
      }
      return; // Not at a milestone, no need to set up triggers
    }

    const handleTrigger = (index) => {
      if (isF1FlowActive && milestoneIndices.includes(index)) {
        const playedIndicesRaw = getLocalData("playedAlphabetDemoIndices");
        let playedIndices = [];
        try {
          playedIndices = playedIndicesRaw ? JSON.parse(playedIndicesRaw) : [];
        } catch (e) {
          playedIndices = [];
        }

        if (!playedIndices.includes(index)) {
          // console.log(
          //   "Practice - Triggering Alphabet Demo for F1 milestone:",
          //   index
          // );
          const updatedPlayedIndices = [...playedIndices, index];
          setLocalData(
            "playedAlphabetDemoIndices",
            JSON.stringify(updatedPlayedIndices)
          );
          setLocalData("showAlphabetDemo", "true");
          setIsAlphabetDemoActive(true);
          globalThis.dispatchEvent(new Event("alphabetDemoComplete"));
        }
      }
    };

    // 1. Immediate trigger for L1 milestone (index 0)
    // Trigger directly when this useEffect runs, no need for event
    if (immediateMilestones.includes(f1FlowIndexState)) {
      handleTrigger(f1FlowIndexState);
    }

    // 2. Listener for deferred trigger (e.g., from MainLayout "Start Game" button)
    // Only for showcase milestones A1, A2, A3
    const handleTriggerRequest = () => {
      if (deferredMilestones.includes(f1FlowIndexState)) {
        handleTrigger(f1FlowIndexState);
      }
    };
    window.addEventListener("alphabetDemoTriggerRequest", handleTriggerRequest);

    return () => {
      window.removeEventListener(
        "alphabetDemoTriggerRequest",
        handleTriggerRequest
      );
    };
  }, [f1FlowIndexState, isF1FlowActive]);

  // useEffect(() => {
  //   setLocalData("rFlow", true)
  // }, []);

  useEffect(() => {
    //console.log("levelsssss", level, rFlow, rStep);

    let currentLevelMap;
    let currentImageMap;

    if (level === 2) {
      currentLevelMap = practiceSteps?.[currentPracticeStep]?.titleNew || "P1";
      currentImageMap =
        practiceSteps[progressData.currentPracticeStep]?.titleNew || "P1";
    } else if (level === 3) {
      currentLevelMap =
        practiceSteps?.[currentPracticeStep]?.titleThree || "P1";
      currentImageMap =
        practiceSteps[progressData.currentPracticeStep]?.titleThree || "P1";
    } else {
      currentLevelMap = practiceSteps?.[currentPracticeStep]?.title || "P1";
      currentImageMap =
        practiceSteps[progressData.currentPracticeStep]?.title || "P1";
    }

    if (
      progressData?.currentPracticeStep !== undefined &&
      progressData?.currentPracticeStep !== null
    ) {
      const selectedLevels =
        level === 2
          ? levelTwo[lang]
          : level === 3
          ? levelThree[lang]
          : levels[lang];

      const levelData = selectedLevels[currentLevelMap];
      const levelImage = selectedLevels[currentImageMap];
      //console.log("levelsNew", level, levelData);
      const currentWord = levelData[currentQuestion];

      setCurrentImage(levelImage[currentQuestion]);
      setParentWords(currentWord?.syllable?.join(" "));
      setLevelOneWord(levelImage[currentQuestion]?.completeWord);
      setRefAudio(levelImage[currentQuestion]?.audio);
    }
  }, [progressData]);

  const gameOver = (data, isUserPass) => {
    const userWon = isUserPass;
    const meetsFluencyCriteria = livesData?.meetsFluencyCriteria;
    setGameOverData({ gameOver: true, userWon, ...data, meetsFluencyCriteria });
  };
  //console.log("data", currentImage, parentWords);

  useEffect(() => {
    if (startShowCase) {
      setLivesData({ ...livesData, lives: LIVES });
    }
  }, [startShowCase]);

  const levelCompleteAudioSrc = usePreloadAudio(LevelCompleteAudio);

  const callConfettiAndPlay = () => {
    const audio = new Audio(levelCompleteAudioSrc);
    audio.play();
    callConfetti();
    window.telemetry?.syncEvents && window.telemetry.syncEvents();
  };

  useEffect(() => {
    let currentPracticeStep = progressData.currentPracticeStep;
    let fromBack = progressData.fromBack;
    if (
      questions?.length &&
      Number(currentPracticeStep + 1) > 0 &&
      currentQuestion === 0 &&
      !fromBack &&
      justCompletedStepRef.current !== null
    ) {
      setDisableScreen(true);
      callConfettiAndPlay();

      setTimeout(() => {
        // Read the step index captured in handleNext *before* state advanced to the next step.
        const completedStepIndex = justCompletedStepRef.current;
        justCompletedStepRef.current = null;
        const step = practiceSteps[completedStepIndex];
        if (!step) return;
        let stepName;

        if (level === 1) {
          stepName = step.fullNameMOne;
        } else if (level === 2) {
          stepName = step.fullNameMTwo;
        } else if (level === 3) {
          stepName = step.fullNameMThree;
        } else {
          stepName = step.fullName;
        }
        setOpenMessageDialog({
          message: `You have successfully completed ${stepName} `,
        });
      }, 1200);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isShowCase) {
      const oldSubSessionId = getLocalData("sub_session_id");
      const newSubSessionId = uniqueId();
      setLocalData("sub_session_id", newSubSessionId);

      // Clear interactions for old sub session if it exists
      if (oldSubSessionId) {
        clearInteractions(oldSubSessionId);
      }
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
    if (voiceText === "profanity") {
      setOpenMessageDialog({
        message: `Please speak appropriately.`,
        severity: "warning",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText == "success") {
      setVoiceText("");
    }
  }, [voiceText]);

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

  // Handle LetterTrain completion for F1/F2 flow Learn steps
  const handleLetterTrainComplete = async () => {
    const isF2LearnStep = isF2FlowActive && f2FlowStep.step?.type === "L";
    if (
      (!isF1FlowActive && !isF2FlowActive) ||
      (!isF1LearnStep && !isF2LearnStep)
    ) {
      // Not F1/F2 flow or not a Learn step, use regular handleNext
      return handleNext(false);
    }

    try {
      const lang = getLocalData("lang");
      const sessionId = getLocalData("sessionId");

      // Handle F2 flow Learn step completion
      if (isF2FlowActive && isF2LearnStep) {
        // Get current F2 flow step BEFORE advancement
        const currentF2FlowStep = getF2FlowStep();

        // Advance F2 flow - this updates localStorage
        const nextStep = advanceF2Flow();

        // Get the updated F2 flow step AFTER advancement
        let updatedF2FlowStep = getF2FlowStep();

        // Verify the index was actually incremented
        if (updatedF2FlowStep.index === currentF2FlowStep.index) {
          console.error(
            "F2 flow index did not advance! Current:",
            currentF2FlowStep.index,
            "Updated:",
            updatedF2FlowStep.index
          );
          // Force advance if it didn't work
          const forcedIndex = currentF2FlowStep.index + 1;
          setLocalData("f2FlowIndex", forcedIndex);
          updatedF2FlowStep = getF2FlowStep();
        }

        // Update state to trigger re-render
        setF2FlowIndexState(updatedF2FlowStep.index);

        // Store F2 flow progress in backend
        if (updatedF2FlowStep.step) {
          const calculatedProgress =
            ((updatedF2FlowStep.index + 1) / F2_FLOW.length) * 100;
          const cappedProgress = Math.min(100, Math.round(calculatedProgress));
          try {
            await addLesson({
              sessionId,
              milestone: "practice",
              lesson: (updatedF2FlowStep.index + 1).toString(), // Convert to 1-indexed for backend
              progress: cappedProgress,
              language: lang,
              milestoneLevel: "B",
              subMilestoneLevel: "F2",
              duration: calculateLetterTrainDuration(),
              applyLevel: getStepTitleFromFlowIndex(
                updatedF2FlowStep.index,
                "F2"
              ),
            });
          } catch (e) {
            console.error("Error storing F2 flow progress:", e);
          }
        }

        // Update practice progress to reflect new F2 flow step
        const newPracticeStep = updatedF2FlowStep.index;
        let practiceProgress = getLocalData("practiceProgress");
        practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};
        practiceProgress = {
          ...practiceProgress,
          currentQuestion: 0,
          currentPracticeProgress:
            ((newPracticeStep + 1) / F2_FLOW.length) * 100,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
        setCurrentQuestion(0);

        // Update points for F2 flow based on contentCount
        // Skip for Apply steps - they handle points after all 3 levels complete
        if (
          updatedF2FlowStep.step &&
          !localStorage.getItem("contentSessionId")
        ) {
          try {
            const lang = getLocalData("lang") || "en";
            const f2Config = levelGetContent[lang]?.["F2"];
            const currentStepContent = f2Config?.[currentF2FlowStep.index];
            const isApplyStep = currentStepContent?.title?.startsWith("A");

            // Only add points for non-Apply steps (L and P steps)
            // Apply steps add points after all 3 levels are completed
            if (!isApplyStep) {
              const contentCount =
                currentStepContent?.contentCount || questions.length || 1;
              const result = await addPointer(contentCount, "B");

              if (result?.result?.totalLanguagePoints) {
                setPoints(result.result.totalLanguagePoints);
              }
            }
          } catch (error) {
            console.error("Error updating F2 flow points:", error);
          }
        }

        // Get content for the next step using the updated F2 flow index
        let nextStepContent = null;
        if (isF2FlowActive) {
          const effectiveLang = lang || "en";
          const f2Config = levelGetContent[effectiveLang]?.["F2"];

          if (
            f2Config &&
            Array.isArray(f2Config) &&
            f2Config[updatedF2FlowStep.index]
          ) {
            nextStepContent = f2Config[updatedF2FlowStep.index];
          }
        }

        // If next step is LetterTrain, mechanism is already set above
        // Force re-render by updating state
        const nextStepType = updatedF2FlowStep.step?.type;
        const isIndicLanguage = lang !== "en"; // Any language other than English uses barakhadi

        if (nextStepType === "P" || nextStepType === "A") {
          // Next step is Practice or Apply - use LetterHunt
          setMechanism({ id: "letterHunt", name: "letterHunt" });
          setQuestions([]); // LetterHunt generates its own content
        } else if (nextStepType === "L") {
          // Next step is Learn - use barakhadi for Indic, letterTrain for English
          const mechanismName = isIndicLanguage ? "barakhadi" : "letterTrain";
          setMechanism({ id: mechanismName, name: mechanismName });
        }
        setProgressData(practiceProgress);

        return; // Exit early for F2 flow
      }

      // Handle F1 flow Learn step completion (existing logic)
      // Get current F1 flow step BEFORE advancement
      const currentF1FlowStep = getF1FlowStep();

      // Advance F1 flow - this updates localStorage
      const nextStep = advanceF1Flow();

      // Get the updated F1 flow step AFTER advancement
      let updatedF1FlowStep = getF1FlowStep();

      // Verify the index was actually incremented
      if (updatedF1FlowStep.index === currentF1FlowStep.index) {
        console.error(
          "F1 flow index did not advance! Current:",
          currentF1FlowStep.index,
          "Updated:",
          updatedF1FlowStep.index
        );
        // Force advance if it didn't work
        const forcedIndex = currentF1FlowStep.index + 1;
        setLocalData("f1FlowIndex", forcedIndex);
        updatedF1FlowStep = getF1FlowStep();
        console.log("Forced F1 flow step:", updatedF1FlowStep);
      }

      // Update state to trigger re-render
      setF1FlowIndexState(updatedF1FlowStep.index);

      // Store F1 flow progress in backend
      // Save the next step index (1-indexed) so user resumes from the next step on relogin
      // Example: L1 (index 0) completes → advances to P1 (index 1) → save lesson "2" (1-indexed)
      if (updatedF1FlowStep.step) {
        try {
          // Ensure progress doesn't exceed 100%
          const calculatedProgress =
            ((updatedF1FlowStep.index + 1) / F1_FLOW.length) * 100;
          const cappedProgress = Math.min(100, Math.round(calculatedProgress));

          await addLesson({
            sessionId,
            milestone: "practice",
            lesson: (updatedF1FlowStep.index + 1).toString(), // Convert to 1-indexed for backend
            progress: cappedProgress,
            language: lang,
            milestoneLevel: "B",
            subMilestoneLevel: "F1",
            duration: calculateLetterTrainDuration(),
            applyLevel: getStepTitleFromFlowIndex(
              updatedF1FlowStep.index,
              "F1"
            ),
          });
          console.log("F1 Learn step progress saved:", {
            completedStepIndex: currentF1FlowStep.index,
            nextStepIndex: updatedF1FlowStep.index,
            lessonSaved: (updatedF1FlowStep.index + 1).toString(), // 1-indexed
          });
        } catch (e) {
          console.error("Error storing F1 flow progress:", e);
        }
      }

      // Update practice progress to reflect new F1 flow step
      const newPracticeStep = updatedF1FlowStep.index;
      let practiceProgress = getLocalData("practiceProgress");
      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};
      practiceProgress = {
        ...practiceProgress,
        currentQuestion: 0,
        currentPracticeProgress: ((newPracticeStep + 1) / F1_FLOW.length) * 100,
        currentPracticeStep: newPracticeStep,
      };
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
      setProgressData(practiceProgress);
      setCurrentQuestion(0);

      // Update points for F1 flow Learn step based on contentCount
      // Skip for Apply steps - they handle points after all 3 levels complete
      if (currentF1FlowStep.step && !localStorage.getItem("contentSessionId")) {
        try {
          const lang = getLocalData("lang") || "en";
          const f1Config = levelGetContent[lang]?.["F1"];
          const completedStepContent = f1Config?.[currentF1FlowStep.index];
          const isApplyStep = completedStepContent?.title?.startsWith("A");

          // Only add points for non-Apply steps
          if (!isApplyStep) {
            const contentCount =
              completedStepContent?.contentCount || questions.length || 1;
            const result = await addPointer(contentCount, "B");

            if (result?.result?.totalLanguagePoints) {
              setPoints(result.result.totalLanguagePoints);
            }
          }
        } catch (error) {
          console.error("Error updating F1 Learn step points:", error);
        }
      }

      // Get content for the next step using the updated F1 flow index
      // For F1 flow, directly access the config array using the updated F1 flow index
      // This avoids using getCurrentContent which relies on stale state values
      let nextStepContent = null;
      if (isF1FlowActive) {
        // For F1 flow, directly access the F1 config array using the updated index
        // The F1 config array index directly corresponds to F1_FLOW index
        // Ensure we use the correct language (default to "en" if lang is not available)
        const effectiveLang = lang || "en";
        const f1Config = levelGetContent[effectiveLang]?.["F1"];
        console.log("F1 config lookup:", {
          lang: effectiveLang,
          hasF1Config: !!f1Config,
          f1ConfigLength: f1Config?.length,
          targetIndex: updatedF1FlowStep.index,
          f1FlowStep: updatedF1FlowStep.step,
          availableLanguages: Object.keys(levelGetContent || {}),
        });

        if (
          f1Config &&
          Array.isArray(f1Config) &&
          f1Config[updatedF1FlowStep.index]
        ) {
          nextStepContent = f1Config[updatedF1FlowStep.index];
          console.log("F1 next step content from config:", {
            index: updatedF1FlowStep.index,
            title: nextStepContent?.title,
            mechanism: nextStepContent?.mechanism,
            customLetters: nextStepContent?.customLetters,
          });

          // Validate that the mechanism matches the F1_FLOW step type
          const f1StepType = updatedF1FlowStep.step?.type;
          const expectedMechanism =
            f1StepType === "L" ? "letterTrain" : "letterHunt";
          if (nextStepContent?.mechanism?.name !== expectedMechanism) {
            console.warn(
              "F1 config mechanism mismatch! Expected:",
              expectedMechanism,
              "Got:",
              nextStepContent?.mechanism?.name
            );
            // Override with correct mechanism based on F1_FLOW step type
            if (nextStepContent) {
              nextStepContent.mechanism = {
                id: expectedMechanism,
                name: expectedMechanism,
              };
              console.log("Corrected mechanism to:", nextStepContent.mechanism);
            }
          }
        } else {
          console.error("F1 config not found!", {
            index: updatedF1FlowStep.index,
            f1ConfigExists: !!f1Config,
            f1ConfigIsArray: Array.isArray(f1Config),
            f1ConfigLength: f1Config?.length,
            levelGetContentKeys: levelGetContent
              ? Object.keys(levelGetContent)
              : null,
            f1ConfigForLang: levelGetContent[effectiveLang]
              ? Object.keys(levelGetContent[effectiveLang])
              : null,
          });
          // Don't use getCurrentContent fallback - it uses wrong logic for F1
          // Instead, return null and let the component handle it
          nextStepContent = null;
        }
      } else {
        // For non-F1 flows, use getCurrentContent
        nextStepContent = getCurrentContent(newPracticeStep);
      }

      // If F1 config is not found, determine mechanism from F1_FLOW step type
      if (!nextStepContent && isF1FlowActive) {
        console.warn(
          "F1 config not found, determining mechanism from F1_FLOW step type"
        );
        const f1StepType = updatedF1FlowStep.step?.type;
        if (f1StepType === "L") {
          // Learn step - LetterTrain
          nextStepContent = {
            mechanism: { id: "letterTrain", name: "letterTrain" },
          };
        } else if (f1StepType === "P" || f1StepType === "A") {
          // Practice or Apply step - LetterHunt
          nextStepContent = {
            mechanism: { id: "letterHunt", name: "letterHunt" },
          };
        } else {
          console.error("Unknown F1 step type:", f1StepType);
          return; // Don't proceed if we can't determine the mechanism
        }
      }

      if (!nextStepContent) {
        console.error(
          "No next step content found! Cannot proceed to next step."
        );
        return; // Don't proceed if we don't have content
      }

      // Validate and set mechanism - ensure it matches F1_FLOW step type
      const f1StepType = updatedF1FlowStep.step?.type;

      // For F1 flow, ALWAYS determine mechanism from F1_FLOW step type (ignore config mechanism)
      // Use updatedF1FlowStep directly since we just advanced the flow
      let finalMechanism;
      const f1StepTypeForMechanism = updatedF1FlowStep.step?.type;
      console.log(
        "Determining mechanism - level:",
        level,
        "isF1FlowActive:",
        isF1FlowActive,
        "f1StepType:",
        f1StepTypeForMechanism,
        "updatedF1FlowStep:",
        updatedF1FlowStep
      );

      // Always determine mechanism from F1_FLOW step type if we have a valid step
      if (f1StepTypeForMechanism) {
        // Always use F1_FLOW step type to determine mechanism, not the config
        if (f1StepTypeForMechanism === "L") {
          finalMechanism = { id: "letterTrain", name: "letterTrain" };
        } else if (
          f1StepTypeForMechanism === "P" ||
          f1StepTypeForMechanism === "A"
        ) {
          finalMechanism = { id: "letterHunt", name: "letterHunt" };
        } else {
          console.error("Unknown F1 step type:", f1StepTypeForMechanism);
          return; // Don't proceed if we can't determine the mechanism
        }
        console.log(
          "F1 flow mechanism determined from step type:",
          f1StepTypeForMechanism,
          "->",
          finalMechanism.name
        );
      } else if (nextStepContent?.mechanism) {
        // Fallback: use mechanism from config if F1 step type is not available
        finalMechanism = nextStepContent.mechanism;
        console.log(
          "Using mechanism from config (no F1 step type):",
          finalMechanism
        );
      } else {
        console.error(
          "Cannot determine mechanism - no F1 step type and no config mechanism"
        );
        return; // Don't proceed if we can't determine the mechanism
      }

      // Update mechanism first - this is critical for re-rendering the correct component
      console.log(
        "Setting mechanism to:",
        finalMechanism,
        "for F1 step type:",
        f1StepTypeForMechanism
      );
      setMechanism(finalMechanism);

      // LetterHunt generates its own content, so we don't need to fetch questions
      if (finalMechanism.name === "letterHunt") {
        // LetterHunt will generate its own content based on config
        // Just ensure questions array is set (can be empty, LetterHunt will handle it)
        setQuestions([]);
      } else if (nextStepContent?.mechanism?.name !== "letterTrain") {
        // For other mechanisms (not LetterTrain or LetterHunt), fetch questions
        // Add null check for nextStepContent
        if (!nextStepContent) {
          console.error(
            "handleNext - nextStepContent is undefined for F1 flow"
          );
          return;
        }

        // M3 should always use getContent, not recommendation API
        // Check both level (number) and level as string "3" to be safe
        const isM3 = level === 3 || level === "3" || String(level) === "3";
        const getContentFn = isM3
          ? getContent
          : nextStepContent?.mechanism ||
            ((level === 1 || level === 2) && lang === "en")
          ? getContent
          : isRecommendationApiEnabledForLang(lang)
          ? getContentNew
          : getContent;

        console.log("handleNext (F1 flow) - API selection for M3:", {
          level,
          levelType: typeof level,
          isM3,
          step: nextStepContent?.title,
          usingRecommendationAPI: getContentFn === getContentNew,
          usingGetContent: getContentFn === getContent,
          hasMechanism: !!nextStepContent?.mechanism,
          recommendationAPIEnabled: isRecommendationApiEnabledForLang(lang),
          lang,
        });

        try {
          // Only fetch if criteria exists (LetterHunt doesn't have criteria)
          if (nextStepContent?.criteria) {
            const resWord = await getContentFn(
              nextStepContent.criteria,
              lang,
              limit,
              {
                mechanismId: nextStepContent?.mechanism?.id,
                competency: nextStepContent?.competency,
                tags: nextStepContent?.tags,
                storyMode: nextStepContent?.storyMode,
                CEFR_level: nextStepContent?.CEFR_level,
                multilingual: nextStepContent?.multilingual,
              },
              level
            );

            if (resWord && resWord.length > 0) {
              setQuestions(resWord);
            }
          }
        } catch (e) {
          console.error("Error fetching content for next step:", e);
        }
      }
      // If next step is LetterTrain, mechanism is already set above

      // Force re-render by updating state
      // Update progressData to trigger re-render
      setProgressData(practiceProgress);

      // Log for debugging
      console.log("LetterTrain completed, next step:", {
        newPracticeStep,
        nextStepContent,
        mechanism: nextStepContent?.mechanism,
        f1FlowStep: updatedF1FlowStep,
        f1FlowIndexState: updatedF1FlowStep.index,
        f1ConfigLength:
          levels === "B" ? levelGetContent[lang]?.["F1"]?.length : null,
        currentMechanismState: mechanism, // Log current mechanism state for comparison
      });

      // The component will automatically re-render when:
      // - f1FlowIndexState changes (via setF1FlowIndexState) - this updates f1FlowStep
      // - mechanism changes (via setMechanism) - this determines which component to render
      // - progressData changes (via setProgressData) - this updates progress
      // React will batch these state updates and re-render once with all new values
    } catch (error) {
      console.error("Error in handleLetterTrainComplete:", error);
    }
  };

  const handleNext = async (isGameOver) => {
    setIsNextButtonCalled(true);
    setEnableNext(false);

    try {
      const lang = getLocalData("lang");

      const virtualId = getLocalData("virtualId");
      const sessionId = getLocalData("sessionId");

      let practiceProgress = getLocalData("practiceProgress");

      if (levelMapping[virtualId] !== undefined) {
        setLevel(levelMapping[virtualId]);
      } else {
        const token = getLocalData("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const emisUsername = String(decoded.emis_username);
            //console.log("emu", emisUsername);

            if (levelMapping[emisUsername] !== undefined) {
              setLevel(levelMapping[emisUsername]);
            }
          } catch (error) {
            console.error("Error decoding JWT token:", error);
          }
        }
      }

      //console.log("Assigned LEVEL:", level);
      const token = getLocalData("token");
      let emisUsername = null;

      if (token) {
        try {
          const decoded = jwtDecode(token);
          emisUsername = String(decoded.emis_username);
          //console.log("emu", emisUsername);
        } catch (error) {
          console.error("Error decoding JWT token:", error);
        }
      }

      let updatedLevel;

      if (levelMapping[virtualId] || levelMapping[emisUsername]) {
        updatedLevel = levelMapping[virtualId] || levelMapping[emisUsername];

        setLevel(updatedLevel);
      }

      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      let currentPracticeStep = "";
      let currentPracticeProgress = "";

      if (practiceProgress) {
        currentPracticeStep = practiceProgress.currentPracticeStep;
        currentPracticeProgress = Math.round(
          ((currentQuestion + 1 + currentPracticeStep * limit) /
            (practiceSteps.length * limit)) *
            100
        );
      }

      let showcasePercentage = ((currentQuestion + 1) * 100) / questions.length;

      let newPracticeStep =
        currentQuestion === questions.length - 1 || isGameOver
          ? currentPracticeStep + 1
          : currentPracticeStep;
      newPracticeStep = Number(newPracticeStep);
      let newQuestionIndex =
        currentQuestion === questions.length - 1 ? 0 : currentQuestion + 1;

      // Handle F1 flow advancement when any F1 step completes (Learn, Practice, or Apply)
      // Check if F1 flow is active by checking milestone level
      const currentF1FlowStepBeforeAdvance = getF1FlowStep();
      const isF1FlowActiveCheck =
        milestoneLevel === "B" && currentF1FlowStepBeforeAdvance.step !== null;
      let updatedF1FlowStep = null;

      // For F1 flow, check if we should advance (either questions completed or game over)
      // NOTE: LetterHuntMechanics already advances F1 flow before calling handleNext,
      // so we should NOT advance again here. We just need to read the current state.
      // Check if LetterHuntMechanics already advanced the flow
      const f1FlowAdvancedByLetterHunt =
        getLocalData("f1FlowAdvancedByLetterHunt") === "true";

      // Only advance if this is NOT from LetterHunt (questions.length > 0 means it's not LetterHunt)
      // AND LetterHuntMechanics hasn't already advanced it
      const shouldAdvanceF1 =
        isF1FlowActiveCheck &&
        !f1FlowAdvancedByLetterHunt && // Don't advance if LetterHuntMechanics already did
        questions.length > 0 && // Not LetterHunt (LetterHunt has empty questions array)
        (currentQuestion === questions.length - 1 || isGameOver);

      if (shouldAdvanceF1) {
        console.log(
          "handleNext - F1 flow step before advance:",
          currentF1FlowStepBeforeAdvance
        );

        // Advance F1 flow first
        advanceF1Flow();

        // Get updated F1 flow step after advancement
        updatedF1FlowStep = getF1FlowStep();
        console.log(
          "handleNext - F1 flow step after advance:",
          updatedF1FlowStep,
          "step type:",
          updatedF1FlowStep.step?.type
        );

        // Update state to trigger re-render
        setF1FlowIndexState(updatedF1FlowStep.index);

        // Store F1 flow progress in backend when step completes
        // Store the NEW index (after advancement) as 1-indexed so user resumes from next step on relogin
        // Example: L1 (index 0) completes → advances to P1 (index 1) → save lesson "2" (1-indexed)
        if (updatedF1FlowStep.step) {
          try {
            // Ensure progress doesn't exceed 100%
            const calculatedProgress =
              ((updatedF1FlowStep.index + 1) / F1_FLOW.length) * 100;
            const cappedProgress = Math.min(
              100,
              Math.round(calculatedProgress)
            );

            await addLesson({
              sessionId,
              milestone: "practice",
              lesson: (updatedF1FlowStep.index + 1).toString(), // Convert to 1-indexed for backend
              progress: cappedProgress,
              language: lang,
              milestoneLevel: "B", // F1 flow is for milestone level B
              subMilestoneLevel: "F1",
              duration: calculateLetterTrainDuration(),
              applyLevel: getStepTitleFromFlowIndex(
                updatedF1FlowStep.index,
                "F1"
              ),
            });
            console.log("F1 flow progress saved (handleNext):", {
              completedStepIndex: currentF1FlowStepBeforeAdvance.index,
              nextStepIndex: updatedF1FlowStep.index,
              lessonSaved: (updatedF1FlowStep.index + 1).toString(), // 1-indexed
            });
          } catch (e) {
            console.error("Error storing F1 flow progress:", e);
          }
        }

        // Update practiceProgress for F1 flow
        const newF1FlowIndex = updatedF1FlowStep.index;
        let practiceProgress = getLocalData("practiceProgress");
        practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};
        practiceProgress = {
          ...practiceProgress,
          currentQuestion: 0,
          currentPracticeProgress:
            ((newF1FlowIndex + 1) / F1_FLOW.length) * 100,
          currentPracticeStep: newF1FlowIndex,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
        setCurrentQuestion(0);

        // Update points for F1 flow based on contentCount (use COMPLETED step, not next step)
        // Skip for Apply steps - they handle points after all 3 levels complete
        if (
          currentF1FlowStepBeforeAdvance.step &&
          !localStorage.getItem("contentSessionId")
        ) {
          try {
            const lang = getLocalData("lang") || "en";
            const f1Config = levelGetContent[lang]?.["F1"];
            const completedStepContent =
              f1Config?.[currentF1FlowStepBeforeAdvance.index];
            const isApplyStep = completedStepContent?.title?.startsWith("A");

            // Only add points for non-Apply steps (L and P steps)
            // Apply steps add points after all 3 levels are completed
            if (!isApplyStep) {
              const contentCount =
                completedStepContent?.contentCount || questions.length || 1;
              const result = await addPointer(contentCount, "B");

              if (result?.result?.totalLanguagePoints) {
                setPoints(result.result.totalLanguagePoints);
              }
            }
          } catch (error) {
            console.error("Error updating F1 flow points:", error);
          }
        }
      }

      // For F3 flow, always check current F3 flow step from localStorage (may have been advanced by LetterLauncherMechanics)
      // Check if F3 flow is active
      const currentF3FlowStepFromStorage = getF3FlowStep();
      const isF3FlowByMilestone =
        milestoneLevel === "B" &&
        subMilestoneLevel === "F3" &&
        currentF3FlowStepFromStorage.step !== null;

      // For F2 flow, always check current F2 flow step from localStorage (may have been advanced by LetterHuntMechanics)
      // Check if F2 flow is active
      const f2FlowAdvancedByLetterHunt =
        getLocalData("f2FlowAdvancedByLetterHunt") === "true";
      const currentF2FlowStepFromStorage = getF2FlowStep();
      const isF2FlowByMilestone =
        milestoneLevel === "B" &&
        subMilestoneLevel === "F2" &&
        currentF2FlowStepFromStorage.step !== null;

      // For F1 flow, always check current F1 flow step from localStorage (may have been advanced by LetterHuntMechanics)
      // Check if F1 flow is active by checking milestone level
      const isF1FlowByMilestone =
        milestoneLevel === "B" &&
        subMilestoneLevel === "F1" &&
        !isF2FlowByMilestone &&
        !isF3FlowByMilestone;
      let currentGetContent;

      // Handle F3 flow first (takes precedence over F2 and F1)
      // Check if F3 flow was already advanced by LetterLauncherMechanics
      const f3FlowAdvancedByLetterLauncher =
        getLocalData("f3FlowAdvancedByLetterLauncher") === "true";

      if (isF3FlowByMilestone) {
        // Check if there's a redirect request (e.g., from failed level)
        const f3FlowRedirect = getLocalData("f3FlowRedirect");
        if (f3FlowRedirect) {
          const targetIndex = getF3FlowIndexFromRedirect(f3FlowRedirect);
          if (targetIndex !== null) {
            console.log(
              `F3 flow redirect requested: ${f3FlowRedirect} -> index ${targetIndex}`
            );
            // Set F3 flow index to target
            setLocalData("f3FlowIndex", targetIndex);
            setF3FlowIndexState(targetIndex);
            // Clear redirect flag
            setLocalData("f3FlowRedirect", null);
            // Clear f3ApplySubStep to ensure A1 starts from Letter Launcher, not Memory Challenge
            setLocalData("f3ApplySubStep", null);

            // Update practice progress
            const lang = getLocalData("lang") || "en";
            const sessionId = getLocalData("sessionId");
            const totalF3Steps = F3_FLOW.length;
            const currentPracticeProgress = Math.round(
              ((targetIndex + 1) / totalF3Steps) * 100
            );

            try {
              await addLesson({
                sessionId: sessionId,
                milestone: "practice",
                lesson: (targetIndex + 1).toString(), // Convert to 1-indexed for backend (matches F1/F2/F3 pattern)
                progress: currentPracticeProgress,
                language: lang,
                milestoneLevel: "B",
                subMilestoneLevel: "F3",
                applyLevel: getStepTitleFromFlowIndex(targetIndex, "F3"),
              });
              console.log("F3 flow redirect progress saved:", {
                index: targetIndex,
                lessonSaved: (targetIndex + 1).toString(), // 1-indexed
                progress: currentPracticeProgress,
              });
            } catch (e) {
              console.error("Error storing F3 flow redirect progress:", e);
            }

            // Update local practice progress
            let practiceProgress = getLocalData("practiceProgress");
            practiceProgress = practiceProgress
              ? JSON.parse(practiceProgress)
              : {};
            practiceProgress = {
              ...practiceProgress,
              currentQuestion: 0,
              currentPracticeProgress: currentPracticeProgress,
              currentPracticeStep: targetIndex,
            };
            setLocalData("practiceProgress", JSON.stringify(practiceProgress));
            setProgressData(practiceProgress);
            setCurrentQuestion(0);

            // Return early - redirect handled
            return;
          } else {
            console.warn(
              `F3 flow redirect failed: could not map "${f3FlowRedirect}" to flow index`
            );
            setLocalData("f3FlowRedirect", null);
          }
        }

        // Always get current F3 flow step from localStorage (it may have been advanced by LetterLauncherMechanics)
        // Read directly from localStorage to get the most up-to-date value
        const savedF3Index = getLocalData("f3FlowIndex");
        const f3IndexFromStorage =
          savedF3Index !== null ? Number(savedF3Index) : 0;
        const currentF3FlowStep = {
          index: f3IndexFromStorage,
          step: F3_FLOW[f3IndexFromStorage] || null,
          isLast: f3IndexFromStorage === F3_FLOW.length - 1,
        };

        console.log("handleNext - F3 flow active, current step from storage:", {
          f3IndexFromStorage,
          step: currentF3FlowStep.step,
          stepType: currentF3FlowStep.step?.type,
          f3FlowIndexState,
          f3FlowAdvancedByLetterLauncher,
        });

        // Update state to ensure UI reflects current F3 flow index
        if (currentF3FlowStep.index !== f3FlowIndexState) {
          console.log(
            "handleNext - Updating f3FlowIndexState from",
            f3FlowIndexState,
            "to",
            currentF3FlowStep.index
          );
          setF3FlowIndexState(currentF3FlowStep.index);
        }

        // Only store F3 flow progress in backend if LetterLauncherMechanics hasn't already done it
        // IMPORTANT: Check flag FIRST to prevent duplicate addLesson calls
        if (f3FlowAdvancedByLetterLauncher) {
          console.log(
            "F3 flow progress already saved by LetterLauncherMechanics, skipping addLesson in handleNext"
          );
          // Clear the flag after a short delay to allow it to be used again for next step
          setTimeout(() => {
            setLocalData("f3FlowAdvancedByLetterLauncher", "false");
          }, 500);
        } else if (currentF3FlowStep.step) {
          // Only call addLesson if flag is NOT set (LetterLauncherMechanics hasn't already called it)
          try {
            await addLesson({
              sessionId,
              milestone: "practice",
              lesson: currentF3FlowStep.index.toString(),
              progress: ((currentF3FlowStep.index + 1) / F3_FLOW.length) * 100,
              language: lang,
              milestoneLevel: "B",
              subMilestoneLevel: "F3",
            });
            console.log("F3 flow progress saved to backend by handleNext:", {
              index: currentF3FlowStep.index,
              progress: ((currentF3FlowStep.index + 1) / F3_FLOW.length) * 100,
            });
          } catch (e) {
            console.error("Error storing F3 flow progress:", e);
          }
        }

        // Update practice progress to reflect new F3 flow step
        const newF3PracticeStep = currentF3FlowStep.index;
        let practiceProgress = getLocalData("practiceProgress");
        practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};
        practiceProgress = {
          ...practiceProgress,
          currentQuestion: 0,
          currentPracticeProgress:
            ((newF3PracticeStep + 1) / F3_FLOW.length) * 100,
          currentPracticeStep: newF3PracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
        setCurrentQuestion(0);

        // F3 flow points are handled entirely by LetterLauncherMechanics component
        // Do not add points here to avoid duplicates

        // Use F3 flow index to get content from F3 config
        const effectiveLang = lang || "en";
        const f3Config = levelGetContent[effectiveLang]?.["F3"];
        console.log(
          "handleNext - Fetching F3 content for index:",
          currentF3FlowStep.index,
          "step type:",
          currentF3FlowStep.step?.type,
          "title should be:",
          currentF3FlowStep.step?.type === "P"
            ? `P${currentF3FlowStep.step?.step}`
            : `A${currentF3FlowStep.step?.step}`
        );

        if (
          f3Config &&
          Array.isArray(f3Config) &&
          f3Config[currentF3FlowStep.index]
        ) {
          currentGetContent = f3Config[currentF3FlowStep.index];
          console.log("handleNext - F3 content from config:", {
            index: currentF3FlowStep.index,
            title: currentGetContent?.title,
            mechanism: currentGetContent?.mechanism,
          });
        } else {
          // Fallback: determine mechanism from F3_FLOW step type
          const f3StepType = currentF3FlowStep.step?.type;
          console.log(
            "handleNext - F3 config not found, using step type:",
            f3StepType
          );
          if (f3StepType === "P" || f3StepType === "A") {
            currentGetContent = {
              mechanism: { id: "letterLauncher", name: "letterLauncher" },
            };
          }
          console.log("handleNext - F3 content fallback:", currentGetContent);
        }

        // Set mechanism based on F3_FLOW step type
        const f3StepTypeForMechanism = currentF3FlowStep.step?.type;
        console.log(
          "handleNext - Setting mechanism for F3 step type:",
          f3StepTypeForMechanism,
          "at index:",
          currentF3FlowStep.index
        );
        if (f3StepTypeForMechanism === "P" || f3StepTypeForMechanism === "A") {
          setMechanism({ id: "letterLauncher", name: "letterLauncher" });
          setQuestions([]); // LetterLauncher generates its own content
          console.log(
            "handleNext - Mechanism set to letterLauncher for F3 index",
            currentF3FlowStep.index
          );
        }
      } else if (isF2FlowByMilestone) {
        // Handle F2 flow (takes precedence over F1)
        // Always get current F2 flow step from localStorage (it may have been advanced by LetterHuntMechanics)
        // Read directly from localStorage to get the most up-to-date value
        const savedF2Index = getLocalData("f2FlowIndex");
        const f2IndexFromStorage =
          savedF2Index !== null ? Number(savedF2Index) : 0;
        const currentF2FlowStep = {
          index: f2IndexFromStorage,
          step: F2_FLOW[f2IndexFromStorage] || null,
          isLast: f2IndexFromStorage === F2_FLOW.length - 1,
        };

        console.log("handleNext - F2 flow active, current step from storage:", {
          f2IndexFromStorage,
          step: currentF2FlowStep.step,
          stepType: currentF2FlowStep.step?.type,
          f2FlowIndexState,
          f2FlowAdvancedByLetterHunt,
        });

        // Update state to ensure UI reflects current F2 flow index
        if (currentF2FlowStep.index !== f2FlowIndexState) {
          console.log(
            "handleNext - Updating f2FlowIndexState from",
            f2FlowIndexState,
            "to",
            currentF2FlowStep.index
          );
          setF2FlowIndexState(currentF2FlowStep.index);
        }

        // Use F2 flow index to get content from F2 config
        const effectiveLang = lang || "en";
        const f2Config = levelGetContent[effectiveLang]?.["F2"];
        console.log(
          "handleNext - Fetching F2 content for index:",
          currentF2FlowStep.index,
          "step type:",
          currentF2FlowStep.step?.type,
          "title should be:",
          currentF2FlowStep.step?.type === "L"
            ? `L${currentF2FlowStep.step?.step}`
            : currentF2FlowStep.step?.type === "P"
            ? `P${currentF2FlowStep.step?.step}`
            : `A${currentF2FlowStep.step?.step}`
        );

        if (
          f2Config &&
          Array.isArray(f2Config) &&
          f2Config[currentF2FlowStep.index]
        ) {
          currentGetContent = f2Config[currentF2FlowStep.index];
          // Add null check for currentGetContent
          if (!currentGetContent) {
            console.error(
              "handleNext - F2 config entry is null/undefined at index:",
              currentF2FlowStep.index
            );
            // Fallback to step type
            const f2StepType = currentF2FlowStep.step?.type;
            if (f2StepType === "L") {
              currentGetContent = {
                mechanism: { id: "letterTrain", name: "letterTrain" },
              };
            } else if (f2StepType === "P" || f2StepType === "A") {
              currentGetContent = {
                mechanism: { id: "letterHunt", name: "letterHunt" },
              };
            }
          } else {
            console.log("handleNext - F2 content from config:", {
              index: currentF2FlowStep.index,
              title: currentGetContent?.title,
              mechanism: currentGetContent?.mechanism,
              customLetters: currentGetContent?.customLetters,
            });
          }
        } else {
          // Fallback: determine mechanism from F2_FLOW step type
          const f2StepType = currentF2FlowStep.step?.type;
          console.log(
            "handleNext - F2 config not found, using step type:",
            f2StepType
          );
          if (f2StepType === "L") {
            currentGetContent = {
              mechanism: { id: "letterTrain", name: "letterTrain" },
            };
          } else if (f2StepType === "P" || f2StepType === "A") {
            currentGetContent = {
              mechanism: { id: "letterHunt", name: "letterHunt" },
            };
          }
          console.log("handleNext - F2 content fallback:", currentGetContent);
        }

        // ALWAYS set mechanism based on F2_FLOW step type (ignore config mechanism)
        const f2StepTypeForMechanism = currentF2FlowStep.step?.type;
        const isIndicLanguage = lang !== "en";
        console.log(
          "handleNext - Setting mechanism for F2 step type:",
          f2StepTypeForMechanism,
          "at index:",
          currentF2FlowStep.index
        );
        if (f2StepTypeForMechanism === "L") {
          const mechanismName = isIndicLanguage ? "barakhadi" : "letterTrain";
          setMechanism({ id: mechanismName, name: mechanismName });
          console.log(
            "handleNext - Mechanism set to letterTrain for F2 index",
            currentF2FlowStep.index
          );
        } else if (
          f2StepTypeForMechanism === "P" ||
          f2StepTypeForMechanism === "A"
        ) {
          setMechanism({ id: "letterHunt", name: "letterHunt" });
          setQuestions([]); // LetterHunt generates its own content
          console.log(
            "handleNext - Mechanism set to letterHunt for F2 index",
            currentF2FlowStep.index
          );
        } else {
          console.error(
            "handleNext - Unknown F2 step type:",
            f2StepTypeForMechanism,
            "at index:",
            currentF2FlowStep.index
          );
        }
      } else if (isF1FlowByMilestone) {
        // Always get current F1 flow step from localStorage (it may have been advanced by LetterHuntMechanics)
        // Read directly from localStorage to get the most up-to-date value
        const savedF1Index = getLocalData("f1FlowIndex");
        let f1IndexFromStorage =
          savedF1Index !== null ? Number(savedF1Index) : 0;

        // Validate that the index is within bounds
        if (f1IndexFromStorage < 0 || f1IndexFromStorage >= F1_FLOW.length) {
          console.error(
            "handleNext - Invalid F1 flow index from localStorage:",
            f1IndexFromStorage,
            "resetting to 0"
          );
          f1IndexFromStorage = 0;
          setLocalData("f1FlowIndex", 0);
        }

        const currentF1FlowStep = {
          index: f1IndexFromStorage,
          step: F1_FLOW[f1IndexFromStorage] || null,
          isLast: f1IndexFromStorage === F1_FLOW.length - 1,
        };

        console.log("handleNext - F1 flow active, current step from storage:", {
          f1IndexFromStorage,
          step: currentF1FlowStep.step,
          stepType: currentF1FlowStep.step?.type,
          f1FlowIndexState,
          f1FlowAdvancedByLetterHunt,
        });

        // Update state to ensure UI reflects current F1 flow index
        if (currentF1FlowStep.index !== f1FlowIndexState) {
          console.log(
            "handleNext - Updating f1FlowIndexState from",
            f1FlowIndexState,
            "to",
            currentF1FlowStep.index
          );
          setF1FlowIndexState(currentF1FlowStep.index);
        }

        // Use F1 flow index to get content from F1 config
        const effectiveLang = lang || "en";
        const f1Config = levelGetContent[effectiveLang]?.["F1"];
        console.log(
          "handleNext - Fetching F1 content for index:",
          currentF1FlowStep.index,
          "step type:",
          currentF1FlowStep.step?.type,
          "title should be:",
          currentF1FlowStep.step?.type === "L"
            ? `L${currentF1FlowStep.step?.step}`
            : currentF1FlowStep.step?.type === "P"
            ? `P${currentF1FlowStep.step?.step}`
            : `A${currentF1FlowStep.step?.step}`
        );

        if (
          f1Config &&
          Array.isArray(f1Config) &&
          f1Config[currentF1FlowStep.index]
        ) {
          currentGetContent = f1Config[currentF1FlowStep.index];
          // Add null check for currentGetContent
          if (!currentGetContent) {
            console.error(
              "handleNext - F1 config entry is null/undefined at index:",
              currentF1FlowStep.index,
              "f1Config length:",
              f1Config.length,
              "f1Config keys:",
              Object.keys(f1Config)
            );
            // Fallback to step type
            const f1StepType = currentF1FlowStep.step?.type;
            if (f1StepType === "L") {
              currentGetContent = {
                mechanism: { id: "letterTrain", name: "letterTrain" },
              };
            } else if (f1StepType === "P" || f1StepType === "A") {
              currentGetContent = {
                mechanism: { id: "letterHunt", name: "letterHunt" },
              };
            }
          } else {
            console.log("handleNext - F1 content from config:", {
              index: currentF1FlowStep.index,
              title: currentGetContent?.title,
              mechanism: currentGetContent?.mechanism,
              customLetters: currentGetContent?.customLetters,
            });
          }
        } else {
          // Fallback: determine mechanism from F1_FLOW step type
          const f1StepType = currentF1FlowStep.step?.type;
          console.error(
            "handleNext - F1 config not found for index:",
            currentF1FlowStep.index,
            "f1Config exists:",
            !!f1Config,
            "f1Config is array:",
            Array.isArray(f1Config),
            "f1Config length:",
            f1Config?.length,
            "using step type:",
            f1StepType
          );
          if (f1StepType === "L") {
            currentGetContent = {
              mechanism: { id: "letterTrain", name: "letterTrain" },
            };
          } else if (f1StepType === "P" || f1StepType === "A") {
            currentGetContent = {
              mechanism: { id: "letterHunt", name: "letterHunt" },
            };
          }
          console.log("handleNext - F1 content fallback:", currentGetContent);
        }

        // ALWAYS set mechanism based on F1_FLOW step type (ignore config mechanism)
        const f1StepTypeForMechanism = currentF1FlowStep.step?.type;
        console.log(
          "handleNext - Setting mechanism for F1 step type:",
          f1StepTypeForMechanism,
          "at index:",
          currentF1FlowStep.index
        );
        if (f1StepTypeForMechanism === "L") {
          setMechanism({ id: "letterTrain", name: "letterTrain" });
          console.log(
            "handleNext - Mechanism set to letterTrain for index",
            currentF1FlowStep.index
          );
        } else if (
          f1StepTypeForMechanism === "P" ||
          f1StepTypeForMechanism === "A"
        ) {
          setMechanism({ id: "letterHunt", name: "letterHunt" });
          setQuestions([]); // LetterHunt generates its own content
          console.log(
            "handleNext - Mechanism set to letterHunt for index",
            currentF1FlowStep.index
          );
        } else {
          console.error(
            "handleNext - Unknown F1 step type:",
            f1StepTypeForMechanism,
            "at index:",
            currentF1FlowStep.index
          );
        }
      }

      // // Add null check for currentGetContent
      // if (!currentGetContent) {
      //   console.error(
      //     "handleNext - currentGetContent is undefined for newPracticeStep:",
      //     newPracticeStep
      //   );
      //   return;
      // }

      // M3 should always use getContent, not recommendation API
      // Check both level (number) and level as string "3" to be safe
      const isM3 = level === 3 || level === "3" || String(level) === "3";
      const getContentFn = isM3
        ? getContent
        : currentGetContent?.mechanism ||
          ((level === 1 || level === 2) && lang === "en")
        ? getContent
        : isRecommendationApiEnabledForLang(lang)
        ? getContentNew
        : getContent;

      console.log("handleNext - API selection for M3:", {
        level,
        levelType: typeof level,
        isM3,
        step: currentGetContent?.title,
        usingRecommendationAPI: getContentFn === getContentNew,
        usingGetContent: getContentFn === getContent,
        hasMechanism: !!currentGetContent?.mechanism,
        recommendationAPIEnabled: isRecommendationApiEnabledForLang(lang),
        lang,
      });

      //console.log("cqer", currentQuestion, questions, level);

      // if(updatedLevel === 14){
      //   setCurrentQuestion(currentQuestion + 1);
      // }else{

      // For F1/F2 flow, if we've already set the mechanism correctly above, skip the content fetching logic
      // This prevents overriding the mechanism and content that were set above
      // Check if this is F1/F2 flow and if we've already processed it (f1FlowAdvancedByLetterHunt/f2FlowAdvancedByLetterHunt flag)
      const shouldSkipContentFetch =
        (isF2FlowByMilestone && f2FlowAdvancedByLetterHunt) ||
        (isF1FlowByMilestone && f1FlowAdvancedByLetterHunt);

      // Update UI points for F1/F2/F3 flows when they complete via LetterHuntMechanics/LetterLauncherMechanics
      // LetterHuntMechanics/LetterLauncherMechanics already updated points in backend, we just need to fetch and update UI
      if (
        (currentQuestion === questions.length - 1 || isGameOver) &&
        shouldSkipContentFetch &&
        !localStorage.getItem("contentSessionId")
      ) {
        // LetterHuntMechanics already called addPointer, so we just need to fetch updated points
        // to update the UI. Don't call addPointer again to avoid duplicate points.
        if (f1FlowAdvancedByLetterHunt || f2FlowAdvancedByLetterHunt) {
          try {
            const updatedPoints = await fetchUserPoints();
            setPoints(updatedPoints || 0);
            console.log(
              "F1/F2 flow points UI updated (LetterHuntMechanics already updated backend):",
              {
                flow: f1FlowAdvancedByLetterHunt ? "F1" : "F2",
                totalPoints: updatedPoints,
              }
            );
          } catch (error) {
            console.error(
              "Error fetching updated points after LetterHuntMechanics completion:",
              error
            );
          }
        } else if (isF3FlowByMilestone) {
          // F3 flow points are handled entirely by LetterLauncherMechanics
          // Just fetch the updated points from backend to update UI
          try {
            const userPointsRes = await fetchUserPoints();
            const totalPoints = userPointsRes?.result?.totalLanguagePoints || 0;
            setPoints(totalPoints);
          } catch (error) {
            console.error(
              "Error fetching F3 flow points (shouldSkipContentFetch):",
              error
            );
          }
        }
      }

      // Check if all questions are completed
      // For M3 S2, ensure we check completion correctly
      const isAllQuestionsCompleted =
        currentQuestion === questions.length - 1 ||
        isGameOver ||
        (level === 3 &&
          questions.length > 0 &&
          currentQuestion >= questions.length - 1);

      console.log("handleNext - Completion check:", {
        level,
        currentQuestion,
        questionsLength: questions.length,
        isGameOver,
        isAllQuestionsCompleted,
        shouldSkipContentFetch,
        step:
          practiceSteps?.[practiceProgress?.currentPracticeStep]?.title ||
          practiceSteps?.[practiceProgress?.currentPracticeStep]?.titleThree,
        currentPracticeStep: practiceProgress?.currentPracticeStep,
      });

      if (isAllQuestionsCompleted && !shouldSkipContentFetch) {
        let currentPracticeStep = practiceProgress.currentPracticeStep;
        let isShowCase = currentPracticeStep === 4 || currentPracticeStep === 9; // P4 or P8

        if (localStorage.getItem("contentSessionId") !== null) {
          setPoints(1);
          if (isShowCase) {
            sendTestRigScore(5);
          }
        } else {
          // Get contentCount from config for the COMPLETED step
          let points = 1; // Default fallback
          try {
            const lang = getLocalData("lang") || "en";
            const levelKey = `m${level}`;
            const levelConfig = levelGetContent[lang]?.[levelKey];
            const completingStepTitle =
              practiceSteps?.[currentPracticeStep]?.title ||
              practiceSteps?.[currentPracticeStep]?.name;
            const completedStepContent = levelConfig?.find(
              (step) => step.title === completingStepTitle
            );
            const contentCount = completedStepContent?.contentCount;

            // Use contentCount if available, otherwise fallback to 1
            if (contentCount && contentCount > 0) {
              points = contentCount;
            }

            console.log("Points calculation for completed step:", {
              currentPracticeStep,
              completingStepTitle,
              contentCount,
              points,
              levelKey,
            });
          } catch (error) {
            console.error("Error getting contentCount for points:", error);
            // Keep default points = 1
          }

          let milestone = `m${level}`;

          // Validate that points is a valid positive number
          if (!points || points <= 0) {
            console.error("Invalid points value:", points);
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
            return;
          }

          if ([1, 2, 4, 5, 6, 7, 8, 9].includes(level)) {
            const addCorrectWords = await addCorrectPracticeWords();
          }

          const result = await addPointer(points, milestone);
          const awardedPoints = result?.result?.points;

          // Validate that the awarded points match what we expected to add
          if (awardedPoints !== points) {
            console.warn("Points mismatch:", {
              expected: points,
              awarded: awardedPoints,
              milestone,
            });
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
            return;
          }
          setPoints(result?.result?.totalLanguagePoints || 0);
          console.log("Points updated successfully:", {
            pointsAdded: points,
            totalPoints: result?.result?.totalLanguagePoints,
            milestone,
          });
        }

        // Check if this is a showcase step (S1 or S2) or game over
        // For M3, S1 is at index 4, S2 is at index 9
        // Calculate currentLevel from the step we're completing (currentPracticeStep, not newPracticeStep)
        const completingStepLevel =
          practiceSteps?.[currentPracticeStep]?.title || currentLevel;
        const isShowcaseStep =
          completingStepLevel === "S1" || completingStepLevel === "S2";
        const shouldShowFeedback = isShowCase || isGameOver || isShowcaseStep;

        console.log("handleNext - Showcase check:", {
          isShowCase,
          isGameOver,
          isShowcaseStep,
          currentLevel,
          completingStepLevel,
          currentPracticeStep,
          shouldShowFeedback,
          level,
          practiceStepTitle: practiceSteps?.[currentPracticeStep]?.title,
          practiceStepName: practiceSteps?.[currentPracticeStep]?.name,
        });

        if (shouldShowFeedback) {
          console.log("handleNext - Entering feedback logic for:", {
            currentLevel,
            completingStepLevel,
            level,
            isM3S1: level === 3 && completingStepLevel === "S1",
            isM3S2: level === 3 && completingStepLevel === "S2",
          });
          const sub_session_id = getLocalData("sub_session_id");
          const getSetResultRes = await getSetResultPractice({
            subSessionId: sub_session_id,
            currentContentType,
            sessionId,
            totalSyllableCount,
            mechanism,
          });
          const { data: getSetData } = getSetResultRes;

          // Call engagement predictor after getsetresult
          // Interactions and lesson are automatically retrieved
          callEngagementPredictor(sub_session_id);

          const data = JSON.stringify(getSetData);
          Log(data, "practice", "ET");
          setPercentage(getSetData?.percentage);
          checkFluency(currentContentType, getSetData?.fluency);
          if (process.env.REACT_APP_POST_LEARNER_PROGRESS === "true") {
            await createLearnerProgress(
              sub_session_id,
              getSetData?.currentLevel,
              totalSyllableCount
            );
          }
          //setLocalData("previous_level", getSetData.data.previous_level);
          setLocalData("previous_level", getSetData.previous_level);

          if (getSetData.sessionResult === "pass") {
            // Skip this block for F1/F2/F3 flows (milestoneLevel "B")
            // These flows handle their own progress saving
            if (
              milestoneLevel === "B" ||
              isF1FlowActive ||
              isF2FlowActive ||
              isF3FlowActive
            ) {
              console.log(
                "Skipping assessment completion addLesson for F1/F2/F3 flow",
                {
                  milestoneLevel,
                  isF1FlowActive,
                  isF2FlowActive,
                  isF3FlowActive,
                }
              );
            } else {
              if (
                level === 15 &&
                (currentLevel === "S1" || currentLevel === "S2")
              ) {
                setLocalData("allCompleted", true);
                gameOver({ link: "/assesment-end" }, true);
                return;
              }
              if (
                (lang === "en" ||
                  lang === "te" ||
                  lang === "kn" ||
                  lang === "hi") &&
                (level === 3 || level === 6 || level === 9)
              ) {
                try {
                  await addLesson({
                    sessionId,
                    milestone: milestoneType,
                    lesson: "0",
                    progress: 0,
                    language: lang,
                    milestoneLevel: getSetData.currentLevel,
                  });
                } catch (e) {
                  // catch error
                }
                gameOver({ link: "/assesment-end" }, true);
                setLocalData("tFlow", true);
                //setLocalData("wordWall", true);
                return; // Exit to show feedback screen for M3/M6/M9
              }
              if (lang === "en" || lang === "te") {
                try {
                  await addLesson({
                    sessionId,
                    milestone: milestoneType,
                    lesson: "0",
                    progress: 0,
                    language: lang,
                    milestoneLevel: getSetData.currentLevel,
                  });
                } catch (e) {
                  // catch error
                }
                gameOver({ link: "/assesment-end" }, true);
                setLocalData("wordWall", true);
                return; // Exit to show feedback screen
              }

              try {
                await addLesson({
                  sessionId,
                  milestone: milestoneType,
                  lesson: "0",
                  progress: 0,
                  language: lang,
                  milestoneLevel: getSetData.currentLevel,
                });
                gameOver({ link: "/assesment-end" }, true);
                return;
              } catch (e) {
                // catch error
              }
            }
          } else if (currentLevel === "S2" && (level === 1 || level === 2)) {
            setLocalData("mFail", true);
            // setTimeout(() => {
            //   // setLocalData("rFlow", true);
            //   setLocalData("rStepZero", 0);
            // }, 7000);
          }
        }

        let quesArr = [];

        if (newPracticeStep === 10) {
          newPracticeStep = 0;
          currentPracticeProgress = 0;
        }

        // Skip addLesson for F1/F2/F3 flows - they handle their own progress saving
        // Check if F1/F2/F3 flow is active and has already been advanced by LetterHuntMechanics
        const f1FlowAdvancedByLetterHunt =
          getLocalData("f1FlowAdvancedByLetterHunt") === "true";
        const f2FlowAdvancedByLetterHunt =
          getLocalData("f2FlowAdvancedByLetterHunt") === "true";
        const isF1FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F1";
        const isF2FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F2";
        const isF3FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F3";

        const shouldSkipAddLesson =
          isF1FlowByMilestone || isF2FlowByMilestone || isF3FlowByMilestone; // F3 flow always handles its own progress

        if (!shouldSkipAddLesson) {
          // Determine milestone type based on the NEXT step (newPracticeStep), not the current step
          // This ensures that when P2 completes and next is S1, milestone is "showcase"
          const nextStepTitle = practiceSteps?.[newPracticeStep]?.title || "";
          const nextStepMilestoneType = ["S1", "S2"].includes(nextStepTitle)
            ? "showcase"
            : "practice";

          await addLesson({
            sessionId: sessionId,
            milestone: nextStepMilestoneType,
            lesson: newPracticeStep,
            progress: currentPracticeProgress,
            language: lang,
            milestoneLevel: `m${level}`,
          });
        } else {
          console.log(
            "Skipping addLesson in handleNext - F1/F2/F3 flow already handled progress saving",
            {
              isF1FlowByMilestone,
              f1FlowAdvancedByLetterHunt,
              isF2FlowByMilestone,
              f2FlowAdvancedByLetterHunt,
              isF3FlowByMilestone,
            }
          );
        }

        if (newPracticeStep === 0 || newPracticeStep === 5 || isGameOver) {
          gameOver();
          return;
        }

        // Get content config for the NEXT step (newPracticeStep)
        const currentGetContent = getCurrentContent(newPracticeStep);

        if (!["B", 0, 10, 11, 12, 13, 14, 15].includes(level)) {
          // For M4-M9, always use limit (10), otherwise use contentCount from config if available
          // Force limit to 10 for M4-M9 regardless of config
          const contentLimit =
            level >= 4 && level <= 9
              ? 10
              : currentGetContent?.contentCount || limit;

          // Determine which API function to use for the next step
          const isM3 = level === 3 || level === "3" || String(level) === "3";
          const getContentFn = isM3
            ? getContent
            : currentGetContent?.mechanism ||
              ((level === 1 || level === 2) && lang === "en")
            ? getContent
            : isRecommendationApiEnabledForLang(lang)
            ? getContentNew
            : getContent;

          console.log("handleNext - Content fetch for next step:", {
            level,
            levelType: typeof level,
            step: currentGetContent?.title,
            contentCount: currentGetContent?.contentCount,
            contentLimit,
            computedLimit: limit,
            isM4ToM9: level >= 4 && level <= 9,
            hasMechanism: !!currentGetContent?.mechanism,
            mechanismName: currentGetContent?.mechanism?.name,
            criteria: currentGetContent.criteria,
            tags: currentGetContent?.tags,
          });
          const resGetContent = await getContentFn(
            currentGetContent.criteria,
            lang,
            contentLimit,
            {
              mechanismId: currentGetContent?.mechanism?.id,
              competency: currentGetContent?.competency,
              tags: currentGetContent?.tags,
              storyMode: currentGetContent?.storyMode,
              CEFR_level: currentGetContent?.CEFR_level,
              multilingual: currentGetContent?.multilingual,
            },
            level
          );
          console.log("handleNext - API response for next step:", {
            level,
            contentCount: resGetContent?.content?.length,
            requestedLimit: contentLimit,
            expectedCount: contentLimit,
            actualCount: resGetContent?.content?.length,
            content: resGetContent?.content,
          });

          // Verify we got the expected number of items
          if (
            level >= 4 &&
            level <= 9 &&
            resGetContent?.content?.length !== 10
          ) {
            console.warn(
              "handleNext - M4-M9: Expected 10 items but got:",
              resGetContent?.content?.length
            );
          }

          setTotalSyllableCount(resGetContent?.totalSyllableCount);
          setLivesData({
            ...livesData,
            totalTargets: resGetContent?.totalSyllableCount,
            targetsForLives:
              resGetContent?.subsessionTargetsCount * TARGETS_PERCENTAGE,
            targetPerLive:
              (resGetContent?.subsessionTargetsCount * TARGETS_PERCENTAGE) /
              LIVES,
          });

          let showcaseLevel =
            currentPracticeStep === 3 || currentPracticeStep === 8;
          setIsShowCase(showcaseLevel);
          // TODO: API returns contents if 200 status
          quesArr = [...quesArr, ...(resGetContent?.content || [])];
          setCurrentContentType(resGetContent?.content?.[0]?.contentType);
          setCurrentCollectionId(resGetContent?.content?.[0]?.collectionId);

          // // TODO: API returns contents if 200 status
          // quesArr = [...quesArr, ...(resGetContent?.data?.content || [])];
          // setCurrentContentType(resGetContent?.data?.content?.[0]?.contentType);
          // setCurrentCollectionId(
          //   resGetContent?.data?.content?.[0]?.collectionId
          // );

          // TODO: not required - not using this anywhere
          setAssessmentResponse(resGetContent);

          // Capture completed step before state advances so the success toast names it correctly.
          justCompletedStepRef.current = currentPracticeStep;
          setCurrentQuestion(0);
          // TODO: not required - we are geting this data from API
          practiceProgress = {
            currentQuestion: newQuestionIndex,
            currentPracticeProgress,
            currentPracticeStep: newPracticeStep,
          };
          setLocalData("practiceProgress", JSON.stringify(practiceProgress));
          setProgressData(practiceProgress);
          setLocalData("storyTitle", resGetContent?.name);

          // // TODO: not required - we are geting this data from API
          // practiceProgress = {
          //   currentQuestion: newQuestionIndex,
          //   currentPracticeProgress,
          //   currentPracticeStep: newPracticeStep,
          // };
          // setLocalData("practiceProgress", JSON.stringify(practiceProgress));
          // setProgressData(practiceProgress);
          // localStorage.setItem("storyTitle", resGetContent?.name);

          setQuestions(quesArr);

          // Set mechanism for the next step
          // if (currentGetContent?.mechanism) {
          setMechanism(currentGetContent?.mechanism || {});
          // }
        }

        if (["B", 0, 10, 11, 12, 13, 14, 15].includes(level)) {
          let showcaseLevel =
            currentPracticeStep === 3 || currentPracticeStep === 8;
          setIsShowCase(showcaseLevel);

          // Capture completed step before state advances so the success toast names it correctly.
          justCompletedStepRef.current = currentPracticeStep;
          setCurrentQuestion(0);

          practiceProgress = {
            currentQuestion: newQuestionIndex,
            currentPracticeProgress,
            currentPracticeStep: newPracticeStep,
          };
          setLocalData("practiceProgress", JSON.stringify(practiceProgress));
          setProgressData(practiceProgress);

          const dummyQuestions = Array.from({ length: 5 }, (_, i) => ({
            id: `dummy-${i + 1}`,
          }));

          setQuestions(dummyQuestions);

          // Set mechanism for the NEXT step (newPracticeStep) for M10-M15
          const currentGetContent = getCurrentContent(newPracticeStep);
          setMechanism(currentGetContent?.mechanism || {});
        }

        if (levelMapping[virtualId] !== undefined) {
          setLevel(levelMapping[virtualId]);
        } else {
          const token = getLocalData("token");
          if (token) {
            try {
              const decoded = jwtDecode(token);
              const emisUsername = String(decoded.emis_username);
              //console.log("emu", emisUsername);

              if (levelMapping[emisUsername] !== undefined) {
                setLevel(levelMapping[emisUsername]);
              }
            } catch (error) {
              console.error("Error decoding JWT token:", error);
            }
          }
        }

        //console.log("Assigned LEVEL:", level);
      } else if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);

        practiceProgress = {
          currentQuestion: newQuestionIndex,
          currentPracticeProgress,
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
      } else {
        newPracticeStep =
          practiceSteps.length - 1 === practiceProgress.currentPracticeStep
            ? 0
            : practiceProgress.currentPracticeStep + 1;
        const currentGetContent = getCurrentContent(newPracticeStep);

        // Fetch content for the next step if not F1/F2/F3 flow
        if (
          !["B", 0, 10, 11, 12, 13, 14, 15].includes(level) &&
          currentGetContent?.criteria
        ) {
          try {
            // For M4-M9, always use 10, otherwise use contentCount from config if available
            const contentLimit =
              level >= 4 && level <= 9
                ? 10
                : currentGetContent?.contentCount || limit;

            const isM3 = level === 3 || level === "3" || String(level) === "3";
            const getContentFn = isM3
              ? getContent
              : currentGetContent?.mechanism ||
                ((level === 1 || level === 2) && lang === "en")
              ? getContent
              : isRecommendationApiEnabledForLang(lang)
              ? getContentNew
              : getContent;

            const resGetContent = await getContentFn(
              currentGetContent.criteria,
              lang,
              contentLimit,
              {
                mechanismId: currentGetContent?.mechanism?.id,
                competency: currentGetContent?.competency,
                tags: currentGetContent?.tags,
                storyMode: currentGetContent?.storyMode,
                CEFR_level: currentGetContent?.CEFR_level,
                multilingual: currentGetContent?.multilingual,
              },
              level
            );

            if (resGetContent?.content && resGetContent.content.length > 0) {
              setCurrentContentType(resGetContent?.content?.[0]?.contentType);
              setCurrentCollectionId(resGetContent?.content?.[0]?.collectionId);
              setAssessmentResponse(resGetContent);
              setQuestions(resGetContent.content);
              setCurrentQuestion(0);
              setLocalData("storyTitle", resGetContent?.name);
            }
          } catch (error) {
            console.error("Error fetching content in else block:", error);
          }
        }

        // if (currentGetContent?.mechanism) {
        setMechanism(currentGetContent?.mechanism || {});
        // }

        // Skip addLesson for F1/F2/F3 flows - they handle their own progress saving
        const f1FlowAdvancedByLetterHunt =
          getLocalData("f1FlowAdvancedByLetterHunt") === "true";
        const f2FlowAdvancedByLetterHunt =
          getLocalData("f2FlowAdvancedByLetterHunt") === "true";
        const isF1FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F1";
        const isF2FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F2";
        const isF3FlowByMilestone =
          milestoneLevel === "B" && subMilestoneLevel === "F3";

        const shouldSkipAddLesson =
          isF1FlowByMilestone || isF2FlowByMilestone || isF3FlowByMilestone; // F3 flow always handles its own progress

        if (!shouldSkipAddLesson) {
          await addLesson({
            sessionId: sessionId,
            milestone: milestoneType,
            lesson: newPracticeStep,
            progress: Math.round(
              (newPracticeStep / (practiceSteps.length * limit)) * 100
            ),
            language: lang,
            milestoneLevel: `m${level}`,
          });
        } else {
          console.log(
            "Skipping addLesson in handleNext - F1/F2/F3 flow already handled progress saving",
            {
              isF1FlowByMilestone,
              f1FlowAdvancedByLetterHunt,
              isF2FlowByMilestone,
              f2FlowAdvancedByLetterHunt,
              isF3FlowByMilestone,
            }
          );
        }

        practiceProgress = {
          currentQuestion: 0,
          currentPracticeProgress: Math.round(
            (newPracticeStep / (practiceSteps.length * limit)) * 100
          ),
          currentPracticeStep: newPracticeStep,
        };
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
      }
    } catch (error) {
      console.error(error);
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
        setLocalData("sessionId", sessionId);
      }
      const getMilestoneDetails = await getFetchMilestoneDetails(lang);

      // TODO: validate the getMilestoneDetails API return
      setLocalData("getMilestone", JSON.stringify({ ...getMilestoneDetails }));
      setVocabCount(
        getMilestoneDetails?.data?.extra?.vocabulary_count +
          getMilestoneDetails?.data?.extra?.learned_voc_count || 0
      );
      setWordCount(
        getMilestoneDetails?.data?.extra?.latest_towre_data?.wordsPerMinute || 0
      );
      const levels = getMilestoneDetails?.data?.milestone_level;
      let newLevel = levels?.startsWith("m")
        ? Number(levels.replace("m", ""))
        : levels;
      setLevel(
        levels?.startsWith("m") ? Number(levels.replace("m", "")) : levels
      );
      console.log("newLevel", levels);

      const resLessons = await getLessonProgressByID(lang);

      // Check if lesson progress is available
      const hasLessonProgress =
        resLessons?.result?.lesson !== null &&
        resLessons?.result?.lesson !== undefined &&
        Number.isInteger(Number(resLessons?.result?.lesson));

      if (
        process.env.REACT_APP_IS_APP_IFRAME !== "true" &&
        (localStorage.getItem("contentSessionId") !== null ||
          process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true")
      ) {
        fetchUserPoints()
          .then((points) => {
            setPoints(points);
          })
          .catch((error) => {
            console.error("Error fetching user points:", error);
            setPoints(0);
          });
      }

      let userState = hasLessonProgress
        ? Number(resLessons.result?.lesson)
        : null; // Set to null initially to trigger fallback check

      // TODO: revisit this - looks like not required
      let practiceProgress = getLocalData("practiceProgress");
      practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};

      // For F1/F2/F3 flow (milestone_level === "B"), restore flow index from backend
      // This ensures progress is restored on relogin (localStorage is cleared on logout)
      if (levels === "B") {
        const subMilestoneLevel =
          getMilestoneDetails?.data?.sub_milestone_level;

        // If userState is null (no lesson progress), initialize to 0 for fallback
        if (userState === null) {
          userState = 0;
        }

        if (subMilestoneLevel === "F1") {
          // For F1 flow, lesson number from backend is 1-indexed (1-21)
          // But F1_FLOW array is 0-indexed (0-20), so convert: lesson 21 = index 20 (A3)
          // Convert 1-indexed lesson to 0-indexed flow index
          const f1FlowIndex = userState > 0 ? userState - 1 : 0;

          // Check if this is a valid F1 flow index (0 to F1_FLOW.length - 1)
          if (f1FlowIndex >= 0 && f1FlowIndex < F1_FLOW.length) {
            // Additional validation: Check if the restored index makes sense
            // If the index is too high (e.g., 20 for A3 when user should be at P3 or A1),
            // it might be an old/stale progress. Log a warning but still restore it.
            if (f1FlowIndex > 10) {
              console.warn(
                `Restoring F1 flow progress from high index: lesson ${userState} (1-indexed) -> flow index ${f1FlowIndex} (0-indexed) -> ${
                  F1_FLOW[f1FlowIndex]?.type
                }${
                  F1_FLOW[f1FlowIndex]?.step || ""
                }. This might be stale progress.`
              );
            }
            // Restore F1 flow index from backend
            console.log(
              `Restoring F1 flow progress: lesson ${userState} (1-indexed) -> flow index ${f1FlowIndex} (0-indexed) -> ${
                F1_FLOW[f1FlowIndex]?.type
              }${F1_FLOW[f1FlowIndex]?.step || ""}`
            );
            setLocalData("f1FlowIndex", f1FlowIndex);
            // IMPORTANT: Update state to trigger re-render with correct flow index
            setF1FlowIndexState(f1FlowIndex);
            // Update userState to match the flow index for practiceProgress calculation
            userState = f1FlowIndex;
          } else {
            // If backend doesn't have valid F1 flow index, start from beginning
            console.warn(
              `Invalid F1 flow index ${f1FlowIndex} from lesson ${userState}, starting from beginning`
            );
            setLocalData("f1FlowIndex", 0);
            userState = 0;
          }
        } else if (subMilestoneLevel === "F2") {
          // For F2 flow, lesson number from backend is 1-indexed (1-21)
          // But F2_FLOW array is 0-indexed (0-20), so convert
          const f2FlowIndex = userState > 0 ? userState - 1 : 0;

          // Always restore F2 flow index from backend lesson value
          // The backend is the source of truth, especially after browser refresh/relogin when localStorage is cleared
          if (f2FlowIndex >= 0 && f2FlowIndex < F2_FLOW.length) {
            console.log(
              `Restoring F2 flow progress: lesson ${userState} (1-indexed) -> flow index ${f2FlowIndex} (0-indexed) -> ${
                F2_FLOW[f2FlowIndex]?.type
              }${F2_FLOW[f2FlowIndex]?.step || ""}`
            );
            setLocalData("f2FlowIndex", f2FlowIndex);
            // IMPORTANT: Update state to trigger re-render with correct flow index
            // Update state immediately and synchronously
            console.log(
              `Setting F2 flow index state from ${f2FlowIndexState} to ${f2FlowIndex} (lesson ${userState} -> index ${f2FlowIndex} -> ${
                F2_FLOW[f2FlowIndex]?.type
              }${F2_FLOW[f2FlowIndex]?.step || ""})`
            );
            setF2FlowIndexState(f2FlowIndex);
            userState = f2FlowIndex;
          } else {
            console.warn(
              `Invalid F2 flow index ${f2FlowIndex} from lesson ${userState}, starting from beginning`
            );
            setLocalData("f2FlowIndex", 0);
            // IMPORTANT: Update state to trigger re-render
            setF2FlowIndexState(0);
            userState = 0;
          }
        } else if (subMilestoneLevel === "F3") {
          // For F3 flow, lesson number from backend is 1-indexed (1-12)
          // But F3_FLOW array is 0-indexed (0-11), so convert
          const f3FlowIndex = userState > 0 ? userState - 1 : 0;

          if (f3FlowIndex >= 0 && f3FlowIndex < F3_FLOW.length) {
            console.log(
              `Restoring F3 flow progress: lesson ${userState} (1-indexed) -> flow index ${f3FlowIndex} (0-indexed) -> ${
                F3_FLOW[f3FlowIndex]?.type
              }${F3_FLOW[f3FlowIndex]?.step || ""}`
            );
            setLocalData("f3FlowIndex", f3FlowIndex);
            // IMPORTANT: Update state to trigger re-render with correct flow index
            setF3FlowIndexState(f3FlowIndex);
            userState = f3FlowIndex;
          } else {
            console.warn(
              `Invalid F3 flow index ${f3FlowIndex} from lesson ${userState}, starting from beginning`
            );
            setLocalData("f3FlowIndex", 0);
            userState = 0;
          }
        }
      }

      // Ensure userState is a number before calculating progress
      // If userState is still null at this point, it will be set in the fallback logic below
      const finalUserState = userState !== null ? userState : 0;

      practiceProgress = {
        currentQuestion: 0,
        currentPracticeProgress: (finalUserState / practiceSteps.length) * 100,
        currentPracticeStep: finalUserState,
      };

      const getCurrentContent = (stepKey) => {
        // Handle null stepKey
        if (stepKey === null || stepKey === undefined) {
          return null;
        }

        const lang = getLocalData("lang") || "en";
        console.log("curGetCont2", lang, levels);
        // For F1 flow (levels === "B"), use "F1" as the level key
        const levelKey = levels === "B" ? "F1" : newLevel;

        if (levels === "B") {
          // For F1 flow, stepKey is the F1 flow index (0-20)
          // The F1 config array has titles "P1", "P2", "P3", etc. in order
          // So we can directly use stepKey as the array index
          const f1Config = levelGetContent[lang]?.[levelKey];
          if (f1Config && f1Config[stepKey]) {
            return f1Config[stepKey];
          }
          return null;
        } else {
          // For non-F1 flows, use practiceSteps mapping
          return levelGetContent[lang]?.[levelKey]?.find(
            (elem) => elem.title === practiceSteps?.[stepKey]?.name
          );
        }
      };

      let currentGetContent = getCurrentContent(userState);

      console.log("curContent", currentGetContent, userState);
      console.log(
        "Initial load - About to fetch questions. Level:",
        level,
        "Type:",
        typeof level,
        "newLevel:",
        newLevel
      );

      // Fallback: If lesson steps are not available, check milestone level and load first step
      if (!currentGetContent) {
        console.warn(
          "currentGetContent is undefined for userState:",
          userState,
          "level:",
          newLevel,
          "levels:",
          levels,
          "- Attempting fallback to first step of milestone level"
        );

        // Determine fallback step based on milestone level
        if (levels === "B") {
          // For milestone level "B" (F1/F2/F3 flows), start at index 0
          const subMilestoneLevel =
            getMilestoneDetails?.data?.sub_milestone_level;

          if (subMilestoneLevel === "F1") {
            console.log("Fallback: Loading first step of F1 flow (index 0)");
            setLocalData("f1FlowIndex", 0);
            userState = 0;
          } else if (subMilestoneLevel === "F2") {
            console.log("Fallback: Loading first step of F2 flow (index 0)");
            setLocalData("f2FlowIndex", 0);
            userState = 0;
          } else if (subMilestoneLevel === "F3") {
            console.log("Fallback: Loading first step of F3 flow (index 0)");
            setLocalData("f3FlowIndex", 0);
            userState = 0;
          } else {
            // Default to F1 if sub_milestone_level is not specified
            console.log(
              "Fallback: Loading first step of F1 flow (default for milestone B)"
            );
            setLocalData("f1FlowIndex", 0);
            userState = 0;
          }

          // Try to get content again with fallback userState
          currentGetContent = getCurrentContent(userState);

          // Update practiceProgress for F1/F2/F3 flows
          // For F flows, progress is based on flow length, not practiceSteps.length
          let flowLength = 0;
          if (subMilestoneLevel === "F1") {
            flowLength = F1_FLOW.length;
          } else if (subMilestoneLevel === "F2") {
            flowLength = F2_FLOW.length;
          } else if (subMilestoneLevel === "F3") {
            flowLength = F3_FLOW.length;
          } else {
            flowLength = F1_FLOW.length; // Default to F1
          }

          practiceProgress = {
            currentQuestion: 0,
            currentPracticeProgress:
              flowLength > 0 ? ((userState + 1) / flowLength) * 100 : 0,
            currentPracticeStep: userState,
          };
        } else {
          // For other milestone levels (m1, m2, etc.), find first step in that level's config
          const lang = getLocalData("lang") || "en";
          const levelKey = newLevel;
          const levelConfig = levelGetContent[lang]?.[levelKey];

          if (
            levelConfig &&
            Array.isArray(levelConfig) &&
            levelConfig.length > 0
          ) {
            // Find first step that matches a practice step
            const firstStep = levelConfig.find((step) => {
              // Check if step title matches any practice step name
              return practiceSteps?.some((ps) => ps.name === step.title);
            });

            if (firstStep) {
              // Find the practice step index that matches
              const practiceStepIndex = practiceSteps?.findIndex(
                (ps) => ps.name === firstStep.title
              );

              if (practiceStepIndex !== -1 && practiceStepIndex !== undefined) {
                console.log(
                  `Fallback: Loading first step of milestone level ${levels} (${firstStep.title}, index ${practiceStepIndex})`
                );
                userState = practiceStepIndex;
                currentGetContent = firstStep;
              } else {
                // If no matching practice step found, use first config item
                console.log(
                  `Fallback: Loading first config item of milestone level ${levels} (${levelConfig[0]?.title})`
                );
                userState = 0;
                currentGetContent = levelConfig[0];
              }
            } else {
              // If no matching step found, use first config item
              console.log(
                `Fallback: Loading first config item of milestone level ${levels} (${levelConfig[0]?.title})`
              );
              userState = 0;
              currentGetContent = levelConfig[0];
            }

            // Update practiceProgress for non-F flows
            practiceProgress = {
              currentQuestion: 0,
              currentPracticeProgress: (userState / practiceSteps.length) * 100,
              currentPracticeStep: userState,
            };
          } else {
            console.error(
              `Fallback failed: No config found for milestone level ${levels} (key: ${levelKey})`
            );
            setLoading(false);
            return;
          }
        }

        // Save updated progress to localStorage and state
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        setProgressData(practiceProgress);
        console.log("Fallback: Updated practiceProgress:", practiceProgress);
      }

      // Final check: If still no content, error out
      if (!currentGetContent) {
        console.error(
          "Failed to load content even after fallback. userState:",
          userState,
          "level:",
          newLevel,
          "levels:",
          levels
        );
        setLoading(false);
        return;
      }

      // M3 should always use getContent, not recommendation API
      // Use newLevel instead of level state, as level state might not be updated yet
      const levelToCheck = newLevel || level;
      // Check both levelToCheck (number) and as string "3" to be safe
      const isM3 =
        levelToCheck === 3 ||
        levelToCheck === "3" ||
        String(levelToCheck) === "3";
      const getContentFn = isM3
        ? getContent
        : currentGetContent?.mechanism ||
          ((levelToCheck === 1 || levelToCheck === 2) && lang === "en")
        ? getContent
        : isRecommendationApiEnabledForLang(lang)
        ? getContentNew
        : getContent;

      console.log("Initial load - API selection for M3:", {
        level,
        newLevel,
        levelToCheck,
        levelToCheckType: typeof levelToCheck,
        isM3,
        step: currentGetContent?.title,
        usingRecommendationAPI: getContentFn === getContentNew,
        usingGetContent: getContentFn === getContent,
        hasMechanism: !!currentGetContent?.mechanism,
        recommendationAPIEnabled: isRecommendationApiEnabledForLang(lang),
        lang,
      });

      //console.log("curGetCont", userState, currentGetContent);
      console.log("Initial load - Level check:", {
        level,
        newLevel,
        levelToCheck,
        levelType: typeof levelToCheck,
        isInExcludedList: ["B", 0, 10, 11, 12, 13, 14, 15].includes(
          levelToCheck
        ),
        willFetch: !["B", 0, 10, 11, 12, 13, 14, 15].includes(levelToCheck),
      });

      if (!["B", 0, 10, 11, 12, 13, 14, 15].includes(levelToCheck)) {
        try {
          // For M4-M9, always use 10, otherwise use contentCount from config if available
          const contentLimit =
            levelToCheck >= 4 && levelToCheck <= 9
              ? 10
              : currentGetContent?.contentCount || limit;
          console.log(
            "Initial load - Fetching questions for level:",
            levelToCheck,
            "criteria:",
            currentGetContent.criteria,
            "contentLimit:",
            contentLimit
          );
          const resWord = await getContentFn(
            currentGetContent.criteria,
            lang,
            contentLimit,
            {
              mechanismId: currentGetContent?.mechanism?.id,
              competency: currentGetContent?.competency,
              tags: currentGetContent?.tags,
              storyMode: currentGetContent?.storyMode,
              CEFR_level: currentGetContent?.CEFR_level,
              multilingual: currentGetContent?.multilingual,
            },
            level
          );

          console.log("Initial load - resWord:", resWord);
          console.log("Initial load - resWord?.content:", resWord?.content);
          console.log(
            "Initial load - Array.isArray(resWord):",
            Array.isArray(resWord)
          );

          if (!resWord) {
            console.error("Initial load - resWord is null/undefined");
          } else {
            setTotalSyllableCount(resWord?.totalSyllableCount);
            setLivesData({
              ...livesData,
              totalTargets: resWord?.totalSyllableCount,
              targetsForLives:
                resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE,
              targetPerLive:
                (resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
            });

            // Handle both cases: resWord as array or resWord.content as array
            if (Array.isArray(resWord)) {
              quesArr = [...quesArr, ...resWord];
            } else if (resWord?.content && Array.isArray(resWord.content)) {
              quesArr = [...quesArr, ...resWord.content];
            } else if (resWord && !Array.isArray(resWord)) {
              // If resWord is an object but doesn't have content, use it as a single question
              quesArr = [...quesArr, resWord];
            }

            console.log("Initial load - quesArr after processing:", quesArr);

            if (quesArr.length === 0) {
              console.warn(
                "Initial load - quesArr is empty after processing resWord"
              );
            }

            setCurrentContentType(currentGetContent.criteria);

            setCurrentCollectionId(
              Array.isArray(resWord)
                ? resWord[0]?.collectionId
                : resWord?.content?.[0]?.collectionId
            );
            setAssessmentResponse(resWord);

            setLocalData("storyTitle", resWord?.name);

            localStorage.setItem("storyTitle", resWord?.name);

            setQuestions(quesArr);
            console.log(
              "Initial load - setQuestions called with:",
              quesArr,
              "length:",
              quesArr.length
            );
          }
        } catch (error) {
          console.error("Initial load - Error fetching questions:", error);
          setQuestions([]);
        }
      }

      if ([10, 11, 12, 13, 14, 15].includes(levelToCheck)) {
        const dummyQuestions = Array.from({ length: 5 }, (_, i) => ({
          id: `dummy-${i + 1}`,
        }));

        setQuestions(dummyQuestions);
      }
      // Add null check before accessing mechanism
      // Only set mechanism after questions are loaded (for non-F1 flows)
      // This prevents race condition where component renders before data is ready
      if (
        questions.length > 0 ||
        ["B", 0, 10, 11, 12, 13, 14, 15].includes(levelToCheck)
      ) {
        setMechanism(currentGetContent?.mechanism || {});
        console.log(
          "Initial load - Mechanism set to:",
          currentGetContent?.mechanism
        );
      } else {
        console.warn(
          "Initial load - Mechanism not set yet, questions not loaded. Questions length:",
          questions.length
        );
        // Set mechanism anyway, but log a warning
        setMechanism(currentGetContent?.mechanism || {});
      }

      // if (virtualId === "6760800019" || level == 12) {
      //   //setMechanism({ id: "read_aloud", name: "readAloud" });
      // }

      // if (virtualId === "1621936833" || level == 13) {
      //   setMechanism({ id: "r3", name: "r3" });
      // }

      let showcaseLevel =
        levels !== "B" && (userState === 4 || userState === 9);
      setIsShowCase(showcaseLevel);
      setCurrentQuestion(practiceProgress?.currentQuestion || 0);
      setLocalData("practiceProgress", JSON.stringify(practiceProgress));
      setProgressData(practiceProgress);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setFetchError(true);
      console.error("err", error);
    }
  };

  useEffect(() => {
    fetchDetails();
    setLocalData("correctPracticeWords", null);
  }, []);

  useEffect(() => {
    setLocalData("mechanism_id", (mechanism && mechanism.id) || "");
  }, [mechanism]);

  // Reset startShowCase to false when entering an Apply step (to show "Hurray!!! Ready for Challenge?" screen)
  useEffect(() => {
    const isF1ApplyStep = isF1FlowActive && f1FlowStep.step?.type === "A";
    const isF2ApplyStep = isF2FlowActive && f2FlowStep.step?.type === "A";
    const isF3ApplyStep = isF3FlowActive && f3FlowStep.step?.type === "A";

    if (isF1ApplyStep || isF2ApplyStep || isF3ApplyStep) {
      // Reset startShowCase to false when entering an Apply step
      // This ensures the "Hurray!!! Ready for Challenge?" screen is shown
      setStartShowCase(false);
    }
  }, [
    isF1FlowActive,
    f1FlowStep.step?.type,
    isF2FlowActive,
    f2FlowStep.step?.type,
    isF3FlowActive,
    f3FlowStep.step?.type,
  ]);

  const getCurrentContent = (stepKey) => {
    const lang = getLocalData("lang") || "en";

    // For F1, use "F1" as the level key
    const levelKey = shouldShowF1 ? "F1" : level;

    // If F1 flow is active, use the F1 flow index to get the correct step
    const actualStepKey = isF1FlowActive ? f1PracticeStepIndex : stepKey;

    return levelGetContent[lang]?.[levelKey]?.find(
      (elem) => elem.title === practiceSteps?.[actualStepKey]?.name
    );
  };

  const handleBack = async () => {
    const virtualId = getLocalData("virtualId");
    const sessionId = getLocalData("sessionId");
    const lang = getLocalData("lang");

    // Check if F1 flow is active by checking milestone level and F1 flow step
    const currentF1FlowStep = getF1FlowStep();
    const isF1FlowActiveCheck =
      milestoneLevel === "B" &&
      subMilestoneLevel === "F1" &&
      currentF1FlowStep.step !== null;

    // Handle F1 flow back navigation
    if (isF1FlowActiveCheck) {
      const currentF1Index = currentF1FlowStep.index;
      if (currentF1Index > 0) {
        const newF1Index = currentF1Index - 1;
        setLocalData("f1FlowIndex", newF1Index);
        setF1FlowIndexState(newF1Index);

        // Get the F1 config for the previous step
        const f1Config = levelGetContent[lang]?.["F1"];
        const previousF1Step = f1Config?.[newF1Index];
        const previousF1FlowStep = F1_FLOW[newF1Index];

        // Determine mechanism from F1 flow step type
        let mechanismToSet;
        if (previousF1FlowStep?.type === "L") {
          mechanismToSet = { id: "letterTrain", name: "letterTrain" };
        } else if (
          previousF1FlowStep?.type === "P" ||
          previousF1FlowStep?.type === "A"
        ) {
          mechanismToSet = { id: "letterHunt", name: "letterHunt" };
        } else {
          mechanismToSet = previousF1Step?.mechanism || {
            id: "letterTrain",
            name: "letterTrain",
          };
        }

        // Update progress
        const practiceProgress = {
          currentQuestion: 0,
          currentPracticeProgress: ((newF1Index + 1) / F1_FLOW.length) * 100,
          currentPracticeStep: newF1Index,
          fromBack: true,
        };

        await addLesson({
          sessionId: sessionId,
          milestone: "practice",
          lesson: (newF1Index + 1).toString(),
          progress: Math.min(
            100,
            Math.round(((newF1Index + 1) / F1_FLOW.length) * 100)
          ),
          language: lang,
          milestoneLevel: "B",
          subMilestoneLevel: "F1",
          duration: calculateLetterTrainDuration(),
          applyLevel: getStepTitleFromFlowIndex(newF1Index, "F1"),
        });

        setProgressData(practiceProgress);
        setMechanism(mechanismToSet);
        setCurrentQuestion(0);
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));

        // For F1 flow, we don't need to fetch questions - they're handled by the components
        return;
      } else {
        // Can't go back further in F1 flow
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        return;
      }
    }

    // Handle F2 flow back navigation
    const currentF2FlowStep = getF2FlowStep();
    const isF2FlowActiveCheck =
      milestoneLevel === "B" &&
      subMilestoneLevel === "F2" &&
      currentF2FlowStep.step !== null;
    if (isF2FlowActiveCheck) {
      const currentF2Index = currentF2FlowStep.index;
      if (currentF2Index > 0) {
        const newF2Index = currentF2Index - 1;
        setLocalData("f2FlowIndex", newF2Index);
        setF2FlowIndexState(newF2Index);

        // Determine mechanism from F2 flow step type (language-aware)
        const previousF2FlowStep = F2_FLOW[newF2Index];
        const isIndicLanguage = (lang || "en") !== "en";
        let mechanismToSet;
        if (previousF2FlowStep?.type === "L") {
          const mechName = isIndicLanguage ? "barakhadi" : "letterTrain";
          mechanismToSet = { id: mechName, name: mechName };
        } else if (
          previousF2FlowStep?.type === "P" ||
          previousF2FlowStep?.type === "A"
        ) {
          mechanismToSet = { id: "letterHunt", name: "letterHunt" };
        }

        const practiceProgress = {
          currentQuestion: 0,
          currentPracticeProgress: ((newF2Index + 1) / F2_FLOW.length) * 100,
          currentPracticeStep: newF2Index,
          fromBack: true,
        };

        await addLesson({
          sessionId: sessionId,
          milestone: "practice",
          lesson: (newF2Index + 1).toString(),
          progress: Math.min(
            100,
            Math.round(((newF2Index + 1) / F2_FLOW.length) * 100)
          ),
          language: lang,
          milestoneLevel: "B",
          subMilestoneLevel: "F2",
          duration: calculateLetterTrainDuration(),
          applyLevel: getStepTitleFromFlowIndex(newF2Index, "F2"),
        });

        setProgressData(practiceProgress);
        if (mechanismToSet) setMechanism(mechanismToSet);
        setCurrentQuestion(0);
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        return;
      } else {
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        return;
      }
    }

    // Handle F3 flow back navigation
    const currentF3FlowForBack = getF3FlowStep();
    const isF3FlowActiveCheck =
      milestoneLevel === "B" &&
      subMilestoneLevel === "F3" &&
      currentF3FlowForBack.step !== null;
    if (isF3FlowActiveCheck) {
      const currentF3Index = currentF3FlowForBack.index;
      if (currentF3Index > 0) {
        const newF3Index = currentF3Index - 1;
        setLocalData("f3FlowIndex", newF3Index);
        setLocalData("f3ApplySubStep", null);
        setF3FlowIndexState(newF3Index);

        // F3 uses LetterLauncher for both P and A (contentType varies)
        const mechanismToSet = { id: "letterLauncher", name: "letterLauncher" };

        const practiceProgress = {
          currentQuestion: 0,
          currentPracticeProgress: ((newF3Index + 1) / F3_FLOW.length) * 100,
          currentPracticeStep: newF3Index,
          fromBack: true,
        };

        await addLesson({
          sessionId: sessionId,
          milestone: "practice",
          lesson: (newF3Index + 1).toString(),
          progress: Math.min(
            100,
            Math.round(((newF3Index + 1) / F3_FLOW.length) * 100)
          ),
          language: lang,
          milestoneLevel: "B",
          subMilestoneLevel: "F3",
          applyLevel: getStepTitleFromFlowIndex(newF3Index, "F3"),
        });

        setProgressData(practiceProgress);
        setMechanism(mechanismToSet);
        setCurrentQuestion(0);
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        return;
      } else {
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        return;
      }
    }

    // Non-F1 flow back navigation
    if (progressData.currentPracticeStep > 0) {
      let practiceProgress = {};

      // Non-F1 flow back navigation
      let newCurrentPracticeStep =
        progressData.currentPracticeStep === 5
          ? 3
          : progressData.currentPracticeStep - 1;
      practiceProgress = {
        currentQuestion: 0,
        currentPracticeProgress:
          (newCurrentPracticeStep / practiceSteps.length) * 100,
        currentPracticeStep: newCurrentPracticeStep,
        fromBack: true,
      };
      await addLesson({
        sessionId: sessionId,
        milestone: milestoneType,
        lesson: newCurrentPracticeStep,
        progress: (newCurrentPracticeStep / practiceSteps.length) * 100,
        language: lang,
        milestoneLevel: `m${level}`,
      });

      setProgressData(practiceProgress);

      const currentGetContent = getCurrentContent(newCurrentPracticeStep);

      // Add safety check for undefined currentGetContent
      if (!currentGetContent) {
        console.error(
          "handleBack: currentGetContent is undefined for step:",
          newCurrentPracticeStep
        );
        setCurrentQuestion(practiceProgress?.currentQuestion || 0);
        setLocalData("practiceProgress", JSON.stringify(practiceProgress));
        return;
      }

      // M3 should always use getContent, not recommendation API
      // Check both level (number) and level as string "3" to be safe
      const isM3 = level === 3 || level === "3" || String(level) === "3";
      const getContentFn = isM3
        ? getContent
        : currentGetContent?.mechanism ||
          ((level === 1 || level === 2) && lang === "en")
        ? getContent
        : isRecommendationApiEnabledForLang(lang)
        ? getContentNew
        : getContent;

      console.log("handleBack - API selection for M3:", {
        level,
        levelType: typeof level,
        isM3,
        step: currentGetContent?.title,
        usingRecommendationAPI: getContentFn === getContentNew,
        usingGetContent: getContentFn === getContent,
        hasMechanism: !!currentGetContent?.mechanism,
        recommendationAPIEnabled: isRecommendationApiEnabledForLang(lang),
        lang,
      });

      let quesArr = [];

      if (!["B", 0, 10, 11, 12, 13, 14, 15].includes(level)) {
        // Add safety check for criteria
        if (currentGetContent?.criteria) {
          // For M4-M9, always use 10, otherwise use contentCount from config if available
          const contentLimit =
            level >= 4 && level <= 9
              ? 10
              : currentGetContent?.contentCount || limit;
          console.log("fetchDetails - M3 S1 content fetch:", {
            step: currentGetContent?.title,
            contentCount: currentGetContent?.contentCount,
            contentLimit,
            defaultLimit: limit,
            hasMechanism: !!currentGetContent?.mechanism,
            mechanismName: currentGetContent?.mechanism?.name,
            criteria: currentGetContent.criteria,
            tags: currentGetContent?.tags,
            currentGetContent: currentGetContent, // Full config object for debugging
            level: level,
            practiceStep: currentPracticeStep,
          });

          // Force contentLimit to 10 for M3 S1 if config has it
          if (
            level === 3 &&
            currentGetContent?.title === "S1" &&
            currentGetContent?.contentCount
          ) {
            const forcedLimit = currentGetContent.contentCount;
            console.log(
              "fetchDetails - Forcing contentLimit to config value for M3 S1:",
              forcedLimit
            );
            // contentLimit is already set above, but let's ensure it's used
          }
          const resWord = await getContentFn(
            currentGetContent.criteria,
            lang,
            contentLimit,
            {
              mechanismId: currentGetContent?.mechanism?.id,
              competency: currentGetContent?.competency,
              tags: currentGetContent?.tags,
              storyMode: currentGetContent?.storyMode,
              CEFR_level: currentGetContent?.CEFR_level,
              multilingual: currentGetContent?.multilingual,
            },
            level
          );
          console.log("fetchDetails - M3 S1 API response:", {
            contentCount: resWord?.content?.length,
            requestedLimit: contentLimit,
            content: resWord?.content,
          });
          setTotalSyllableCount(resWord?.totalSyllableCount);
          setLivesData({
            ...livesData,
            totalTargets: resWord?.totalSyllableCount,
            targetsForLives:
              resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE,
            targetPerLive:
              (resWord?.subsessionTargetsCount * TARGETS_PERCENTAGE) / LIVES,
          });
          quesArr = [...quesArr, ...(resWord?.content || [])];

          // Log the actual content received
          console.log("fetchDetails - M3 S1 final quesArr:", {
            quesArrLength: quesArr.length,
            resWordContentLength: resWord?.content?.length,
            requestedLimit: contentLimit,
            actualReceived: quesArr.length,
            expected: contentLimit,
          });

          // If we got fewer items than requested, log a warning
          if (
            quesArr.length < contentLimit &&
            level === 3 &&
            currentGetContent?.title === "S1"
          ) {
            console.warn(
              "fetchDetails - M3 S1: Received fewer items than requested!",
              {
                requested: contentLimit,
                received: quesArr.length,
                resWordContent: resWord?.content,
              }
            );
          }

          setCurrentContentType(currentGetContent.criteria);
          setCurrentCollectionId(resWord?.content?.[0]?.collectionId);
          setAssessmentResponse(resWord);

          setLocalData("storyTitle", resWord?.name);
          setQuestions(quesArr);
        }
      }

      if (["B", 0, 10, 11, 12, 13, 14, 15].includes(level)) {
        const dummyQuestions = Array.from({ length: 5 }, (_, i) => ({
          id: `dummy-${i + 1}`,
        }));

        setQuestions(dummyQuestions);
      }

      setTimeout(() => {
        // Add safety check for mechanism
        // if (currentGetContent?.mechanism) {
        setMechanism(currentGetContent?.mechanism || {});
        // }
        // else{
        //   renderMechanics();
        // }
      }, 1000);
      setCurrentQuestion(practiceProgress?.currentQuestion || 0);
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

  function highlightWords(sentence, matchedChar, color) {
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
      for (let i = 0; i < word.length; i++) {
        let matchFound = false;
        for (let j = 0; j < matchedChar.length; j++) {
          let length = splitGraphemes(matchedChar[j]).filter(
            (item) => item !== "‌" && item !== "" && item !== " "
          ).length;
          const substr = word.slice(i, i + length).join("");
          if (substr.includes(matchedChar[j])) {
            highlightedString.push(
              <React.Fragment key={i}>
                <Typography
                  variant="h5"
                  component="h4"
                  sx={{
                    fontSize:
                      lang === "te"
                        ? "clamp(1.9rem, 2.8vw, 4.1rem)"
                        : "clamp(1.6rem, 2.5vw, 3.8rem)",
                    fontWeight: lang === "te" ? 400 : 700,
                    fontFamily: getFontFamily(lang),
                    lineHeight: "50px",
                    background: "#FFF0BD",
                    color: color,
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
                  color: color,
                  fontSize:
                    lang === "te"
                      ? "clamp(1.9rem, 2.8vw, 4.1rem)"
                      : "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: getFontFamily(lang),
                  lineHeight: "50px",
                }}
              >
                {i === 0 ? word[i].toUpperCase() : word[i]}
              </Typography>
            </React.Fragment>
          );
        }
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
                  fontSize:
                    lang === "te"
                      ? "clamp(1.9rem, 2.8vw, 4.1rem)"
                      : "clamp(1.6rem, 2.5vw, 3.8rem)",
                  fontWeight: 700,
                  fontFamily: getFontFamily(lang),
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
                color: color,
                fontSize:
                  lang === "te"
                    ? "clamp(1.9rem, 2.8vw, 4.1rem)"
                    : "clamp(1.6rem, 2.5vw, 3.8rem)",
                fontWeight: 700,
                fontFamily: getFontFamily(lang),
                lineHeight: "50px",
              }}
              key={index}
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
        window.parent.postMessage(
          { type: "stringLengths", length },
          window?.location?.ancestorOrigins?.[0] ||
            window.parent.location.origin
        );
      }
    }
  }, [questions[currentQuestion]]);

  //console.log("mecc", wordWallFlow);

  const renderMechanics = () => {
    // IMPORTANT: For non-F flows (m1, m2, etc.), use mechanism from config as-is
    // Don't override mechanisms for milestone levels that are not "B"
    const isNonFFlow =
      milestoneLevel &&
      milestoneLevel !== "B" &&
      typeof milestoneLevel === "string" &&
      milestoneLevel.startsWith("m");

    // For F3 flow, ensure mechanism matches F3_FLOW step type
    // F3 flow takes precedence over F2 and F1 flows
    // F3 Practice steps use Letter Launcher, F3 Apply steps use Letter Launcher + Memory Challenge + Read Aloud
    if (
      !isNonFFlow &&
      isF3FlowActive &&
      f3FlowStep?.step &&
      milestoneLevel === "B"
    ) {
      const currentF3Step = getF3FlowStep();
      const f3StepType = currentF3Step.step?.type;
      const expectedMechanism =
        f3StepType === "P" || f3StepType === "A"
          ? "letterLauncher" // F3 Practice and Apply steps use Letter Launcher
          : null;

      // If mechanism doesn't match expected, fix it immediately
      if (
        expectedMechanism &&
        (!mechanism ||
          typeof mechanism !== "object" ||
          !mechanism.name ||
          mechanism.name !== expectedMechanism)
      ) {
        // Only warn if mechanism exists but is incorrect
        if (
          mechanism &&
          typeof mechanism === "object" &&
          mechanism.name &&
          mechanism.name !== expectedMechanism
        ) {
          console.warn(
            "renderMechanics - F3 flow mechanism mismatch detected, correcting:",
            {
              currentMechanism: mechanism?.name,
              expectedMechanism,
              f3StepType,
              f3FlowIndexState,
              currentF3StepIndex: currentF3Step.index,
              milestoneLevel,
            }
          );
        }
        // Set the correct mechanism immediately
        if (expectedMechanism === "letterLauncher") {
          console.log(
            "renderMechanics - Setting mechanism to letterLauncher for F3 step"
          );
          setMechanism({ id: "letterLauncher", name: "letterLauncher" });
        }
      }
    }
    // For F2 flow, ensure mechanism matches F2_FLOW step type
    // F2 flow takes precedence over F1 flow when both conditions might be true
    // F2 Learn steps use LetterTrain, F2 Practice and Apply steps use LetterHunt
    else if (
      !isNonFFlow &&
      isF2FlowActive &&
      f2FlowStep?.step &&
      milestoneLevel === "B"
    ) {
      const currentF2Step = getF2FlowStep();
      const f2StepType = currentF2Step.step?.type;
      const isIndicLanguage = lang !== "en";
      const expectedMechanism =
        f2StepType === "L"
          ? isIndicLanguage
            ? "barakhadi"
            : "letterTrain" // F2 Learn steps use LetterTrain
          : f2StepType === "P" || f2StepType === "A"
          ? "letterHunt" // F2 Practice and Apply steps use LetterHunt
          : null;

      // If mechanism doesn't match expected, fix it immediately
      if (
        expectedMechanism &&
        (!mechanism ||
          typeof mechanism !== "object" ||
          !mechanism.name ||
          mechanism.name !== expectedMechanism)
      ) {
        // Only warn if mechanism exists but is incorrect
        if (
          mechanism &&
          typeof mechanism === "object" &&
          mechanism.name &&
          mechanism.name !== expectedMechanism
        ) {
          console.warn(
            "renderMechanics - F2 flow mechanism mismatch detected, correcting:",
            {
              currentMechanism: mechanism?.name,
              expectedMechanism,
              f2StepType,
              f2FlowIndexState,
              currentF2StepIndex: currentF2Step.index,
              milestoneLevel,
            }
          );
        }
        // Set the correct mechanism immediately
        if (expectedMechanism === "barakhadi") {
          console.log(
            "renderMechanics - Setting mechanism to barakhadi for F2 Learn step (Indic language)"
          );
          setMechanism({ id: "barakhadi", name: "barakhadi" });
        } else if (expectedMechanism === "letterTrain") {
          console.log(
            "renderMechanics - Setting mechanism to letterTrain for F2 Learn step (English)"
          );
          setMechanism({ id: "letterTrain", name: "letterTrain" });
        } else if (expectedMechanism === "letterHunt") {
          console.log(
            "renderMechanics - Setting mechanism to letterHunt for F2 step"
          );
          setMechanism({ id: "letterHunt", name: "letterHunt" });
        }
      }
    }
    // For F1 flow, ensure mechanism matches F1_FLOW step type
    // This prevents rendering the wrong component due to stale mechanism state
    // Only run this for F1 flow (level "B") to avoid interfering with other flows
    // F1 flow should only be active if F2 flow is not active
    else if (
      !isNonFFlow &&
      isF1FlowActive &&
      f1FlowStep?.step &&
      milestoneLevel === "B" &&
      !isF2FlowActive
    ) {
      const currentF1Step = getF1FlowStep();
      const f1StepType = currentF1Step.step?.type;
      const expectedMechanism =
        f1StepType === "L"
          ? "letterTrain"
          : f1StepType === "P" || f1StepType === "A"
          ? "letterHunt"
          : null;

      // If mechanism doesn't match expected, fix it immediately
      // Only log warning if mechanism exists but is wrong (not just undefined during initialization)
      if (
        expectedMechanism &&
        (!mechanism ||
          typeof mechanism !== "object" ||
          !mechanism.name ||
          mechanism.name !== expectedMechanism)
      ) {
        // Only warn if mechanism exists but is incorrect (not just undefined/empty)
        if (
          mechanism &&
          typeof mechanism === "object" &&
          mechanism.name &&
          mechanism.name !== expectedMechanism
        ) {
          console.warn(
            "renderMechanics - Mechanism mismatch detected, correcting:",
            {
              currentMechanism: mechanism?.name,
              expectedMechanism,
              f1StepType,
              f1FlowIndexState,
              currentF1StepIndex: currentF1Step.index,
              milestoneLevel,
            }
          );
        }
        // Set the correct mechanism immediately (this will happen even if mechanism is undefined/empty during initialization)
        if (expectedMechanism === "letterTrain") {
          console.log("renderMechanics - Setting mechanism to letterTrain");
          setMechanism({ id: "letterTrain", name: "letterTrain" });
        } else if (expectedMechanism === "letterHunt") {
          console.log("renderMechanics - Setting mechanism to letterHunt");
          setMechanism({ id: "letterHunt", name: "letterHunt" });
        }
      }
    }

    // Check F1 completion FIRST - highest priority
    // Use state value which is kept in sync with localStorage
    // For F1 flow with Learn steps (LetterTrain), skip this check and go to LetterTrain
    const isF1LearnStepForRender =
      isF1FlowActive &&
      milestoneLevel === "B" &&
      shouldShowF1 &&
      getF1FlowStep()?.step?.type === "L";
    // Check if mechanism is empty - handle both string and object types
    const isMechanismEmpty =
      !mechanism ||
      (typeof mechanism === "string" && mechanism === "") ||
      (typeof mechanism === "object" && !mechanism.id && !mechanism.name);

    // For non-F flows (m1, m2, etc.), if no mechanism from config, render WordsOrImage
    // For F flows, use existing logic
    // IMPORTANT: Always check for special flows (tFlow, wordWallFlow, etc.) before falling back to WordsOrImage
    if (
      !isF1LearnStepForRender &&
      ((isNonFFlow &&
        isMechanismEmpty &&
        rFlow !== "true" &&
        tFlow !== "true" &&
        readMatch !== "true" &&
        wordWallFlow !== "true") ||
        (!isNonFFlow &&
          ((isMechanismEmpty &&
            rFlow !== "true" &&
            tFlow !== "true" &&
            readMatch !== "true" &&
            wordWallFlow !== "true") ||
            (mechanism &&
              typeof mechanism === "object" &&
              mechanism?.id === "mechanic_15" &&
              rFlow !== "true" &&
              tFlow !== "true" &&
              readMatch !== "true" &&
              wordWallFlow !== "true"))))
    ) {
      const mechanics_data = questions[currentQuestion]?.mechanics_data;

      return (
        <WordsOrImage
          {...{
            level: level,
            audioLink: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${questions[currentQuestion]?.contentId}.wav`,
            mechanism_id: mechanism?.id,
            header:
              mechanism?.id &&
              (mechanism?.id === "mechanic_15"
                ? ui.PRACTICE_READ_QUESTION_RECORD_RESPONSE
                : questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : `${ui.PRACTICE_SPEAK_BELOW} ${questions[currentQuestion]?.contentType}`),
            words:
              mechanism?.id === "mechanic_15"
                ? questions[currentQuestion]?.mechanics_data?.[0]?.text
                : questions[currentQuestion]?.contentSourceData?.[0]?.text,
            hints: questions[currentQuestion]?.mechanics_data?.[0]?.hints?.text,
            multilingual: questions[currentQuestion]?.multilingual,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: questions[currentQuestion]?.contentType,
            image:
              mechanism?.id === "mechanic_15"
                ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/${questions[currentQuestion]?.mechanics_data[0]?.image_url}`
                : "",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background: isShowCase
              ? "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)"
              : undefined,
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
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (tFlow === "true") {
      // Note: React.memo with custom comparison in TowreFlow will prevent
      // unnecessary re-renders even if props object is recreated
      return (
        <TowreFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      (mechanism.name === "r0" ||
        mechanism.name === "r1" ||
        mechanism.name === "r2" ||
        mechanism.name === "r3" ||
        mechanism.name === "r4")
    ) {
      // R0, R1, R2, R3, R4 mechanisms from config
      const getCurrentContentForR = getCurrentContent(
        progressData?.currentPracticeStep || 0
      );
      const customLetters = getCurrentContentForR?.customLetters;

      // Common props for all R components
      const commonProps = {
        page,
        setPage,
        level: level,
        header:
          questions[currentQuestion]?.contentType === "image"
            ? ui.PRACTICE_GUESS_IMAGE
            : ui.PRACTICE_SPEAK_WORD,
        currentImg: currentImage,
        parentWords: parentWords,
        contentType: currentContentType,
        contentId: questions[currentQuestion]?.contentId,
        setVoiceText,
        setRecordedAudio,
        setVoiceAnimate,
        storyLine,
        handleNext,
        type: "word",
        enableNext,
        showTimer: false,
        points,
        steps: questions?.length,
        currentStep: currentQuestion + 1,
        progressData,
        showProgress: true,
        background:
          isShowCase &&
          "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
        playTeacherAudio,
        callUpdateLearner: isShowCase,
        disableScreen,
        isShowCase,
        handleBack: !isShowCase && handleBack,
        setEnableNext,
        loading,
        setOpenMessageDialog,
        vocabCount,
        wordCount,
      };

      // Render appropriate R component based on mechanism name
      if (mechanism.name === "r0") {
        return <R0 {...commonProps} customLetters={customLetters} />;
      } else if (mechanism.name === "r1") {
        return <R1 {...commonProps} />;
      } else if (mechanism.name === "r2") {
        return <R2 {...commonProps} />;
      } else if (mechanism.name === "r3") {
        return <R3 {...commonProps} />;
      } else if (mechanism.name === "r4") {
        return <R4 {...commonProps} />;
      }
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "soundHunt"
    ) {
      // SoundHunt mechanism from config
      const getCurrentContentForSoundHunt = getCurrentContent(
        progressData?.currentPracticeStep || 0
      );
      const customLetters = getCurrentContentForSoundHunt?.customLetters;

      // Common props for SoundHunt component
      const commonProps = {
        page,
        setPage,
        level: level,
        header:
          questions[currentQuestion]?.contentType === "image"
            ? ui.PRACTICE_GUESS_IMAGE
            : ui.PRACTICE_SPEAK_WORD,
        currentImg: currentImage,
        parentWords: parentWords,
        contentType: currentContentType,
        contentId: questions[currentQuestion]?.contentId,
        setVoiceText,
        setRecordedAudio,
        setVoiceAnimate,
        storyLine,
        handleNext,
        type: "word",
        enableNext,
        showTimer: false,
        points,
        steps: questions?.length,
        currentStep: currentQuestion + 1,
        progressData,
        showProgress: true,
        background:
          isShowCase &&
          "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
        playTeacherAudio,
        callUpdateLearner: isShowCase,
        disableScreen,
        isShowCase,
        handleBack: !isShowCase && handleBack,
        setEnableNext,
        loading,
        setOpenMessageDialog,
        vocabCount,
        wordCount,
      };

      return (
        <SoundHunt
          isShowCase={false}
          {...commonProps}
          customLetters={customLetters}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "soundHuntS1Combined"
    ) {
      // SoundHuntS1Combined mechanism - handles both Word Hunt and Sound Hunt for m1 s1
      // This component uses its own filteredContent (10 soundMatch + 10 pictureWords = 20 items)
      // So we need to set steps to 20, not questions?.length
      const getCurrentContentForCombined = getCurrentContent(
        progressData?.currentPracticeStep || 0
      );
      const customLetters = getCurrentContentForCombined?.customLetters;

      // Common props for SoundHuntS1Combined component
      const commonProps = {
        page,
        setPage,
        level: level,
        header:
          questions[currentQuestion]?.contentType === "image"
            ? ui.PRACTICE_GUESS_IMAGE
            : ui.PRACTICE_SPEAK_WORD,
        currentImg: currentImage,
        parentWords: parentWords,
        contentType: currentContentType,
        contentId: questions[currentQuestion]?.contentId,
        setVoiceText,
        setRecordedAudio,
        setVoiceAnimate,
        storyLine,
        handleNext,
        type: "word",
        enableNext,
        showTimer: false,
        points,
        steps: 20, // SoundHuntS1Combined always has 20 items (10 soundMatch + 10 pictureWords)
        currentStep: currentQuestion + 1, // This will be updated by the component internally
        progressData,
        showProgress: true,
        background:
          isShowCase &&
          "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
        playTeacherAudio,
        callUpdateLearner: isShowCase,
        disableScreen,
        isShowCase: true,
        startShowCase,
        setStartShowCase,
        handleBack: !isShowCase && handleBack,
        setEnableNext,
        loading,
        setOpenMessageDialog,
        vocabCount,
        wordCount,
      };

      return (
        <SoundHuntS1Combined {...commonProps} customLetters={customLetters} />
      );
    } else if (readMatch === "true") {
      return (
        <ReadMatch
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (wordWallFlow === "true") {
      return (
        <WordWall
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            multilingual: questions[currentQuestion]?.multilingual,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    }
    // Removed F1 component check - LetterTrain should be used instead for F1 Learn steps
    // The LetterTrain check below will handle F1 Learn steps
    else if (
      rFlow === "true" &&
      shouldShowF1 &&
      rStepZero === 0 &&
      !isF1FlowActive
    ) {
      // Legacy R0 flow (deprecated - use F1 instead)
      // Get currentGetContent to access customLetters
      const currentGetContentForR0 = getCurrentContent(
        progressData?.currentPracticeStep || 0
      );
      const customLetters = currentGetContentForR0?.customLetters;

      return (
        <R0
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            setIsNextButtonCalled,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
            customLetters: customLetters,
          }}
        />
      );
    } else if (
      rFlow === "true" &&
      shouldShowF1 &&
      rStepZero === 1 &&
      lang === "en" &&
      !isF1FlowActive &&
      !f1FlowComplete
    ) {
      // Legacy R1 flow (deprecated - use F1 instead)
      return (
        <R1
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      rFlow === "true" &&
      shouldShowF1 &&
      rStepZero === 1 &&
      lang !== "en"
    ) {
      return (
        <Barakhadi
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (rFlow === "true" && level === 2 && [2, 3, 4].includes(rStep)) {
      return (
        <R2
          page={page}
          setPage={setPage}
          rStep={rStep}
          //onComplete={() => handleComplete(3)}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      mechanism &&
      mechanism.name === "fillInTheBlank" &&
      mechanism.id !== ""
    ) {
      return (
        <Mechanics3
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism.name === "fillInTheBlank"
                ? ui.PRACTICE_FILL_IN_THE_BLANK
                : questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : `${ui.PRACTICE_SPEAK_BELOW} ${questions[currentQuestion]?.contentType}`,
            parentWords: questions[currentQuestion]?.mechanics_data?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            image: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                questions[currentQuestion]?.mechanics_data[0]?.image_url
              : null,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            options: questions[currentQuestion]?.mechanics_data
              ? questions[currentQuestion]?.mechanics_data[0]?.options
              : [],
            setOpenMessageDialog,
            startShowCase,
            setStartShowCase,
            livesData,
            setLivesData,
            gameOverData,
            highlightWords,
            percentage,
            fluency,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "formAWord") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : `${ui.PRACTICE_SPEAK_BELOW} ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "formAWord2"
    ) {
      // Get the multilingual config from the step config
      const currentStepConfig = getCurrentContent(
        progressData?.currentPracticeStep
      );
      const enableMultilingual = currentStepConfig?.multilingual !== false;

      return (
        <Mechanics7
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: questions[currentQuestion]?.contentSourceData?.[0],
            parentWords: questions[currentQuestion]?.mechanics_data?.[0],
            multilingual: questions[currentQuestion]?.multilingual,
            enableMultilingual: enableMultilingual,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "bingoCard") {
      return (
        <BingoCard
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.mechanics_data?.[0],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP1") {
      return (
        <FluencyP1
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData:
              questions[currentQuestion]?.contentSourceData?.[0],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP2") {
      // Check if questions array has data
      if (
        !questions ||
        questions.length === 0 ||
        currentQuestion >= questions.length
      ) {
        console.warn(
          "FluencyP2 - Questions not loaded yet or invalid currentQuestion",
          {
            questionsLength: questions?.length,
            currentQuestion,
            questions: questions,
          }
        );
        // Return loading state or null until questions are loaded
        return null;
      }

      // Get contentSourceData with fallback
      const currentQuestionData = questions[currentQuestion];
      console.log("FluencyP2 - currentQuestionData:", currentQuestionData);
      console.log("FluencyP2 - questions array:", questions);
      console.log("FluencyP2 - currentQuestion index:", currentQuestion);

      // Try to get contentSourceData from various possible locations
      let contentSourceDataForP2 = currentQuestionData?.contentSourceData?.[0];

      // If not found, try alternative structures
      if (!contentSourceDataForP2) {
        if (currentQuestionData?.text) {
          // Text might be directly on the question object
          contentSourceDataForP2 = {
            text: currentQuestionData.text,
            audioUrl:
              currentQuestionData.audioUrl ||
              currentQuestionData.audio_url ||
              "",
          };
        } else if (
          currentQuestionData?.contentSourceData &&
          Array.isArray(currentQuestionData.contentSourceData) &&
          currentQuestionData.contentSourceData.length > 0
        ) {
          contentSourceDataForP2 = currentQuestionData.contentSourceData[0];
        }
      }

      console.log(
        "FluencyP2 - contentSourceDataForP2:",
        contentSourceDataForP2
      );

      // If still no data, show retry dialog
      if (!contentSourceDataForP2) {
        console.warn(
          "FluencyP2 - No contentSourceData found, showing retry dialog"
        );
        if (!showRetryDialog) {
          setRetryDialogMessage(ui.PRACTICE_UNABLE_LOAD_CONTENT_RETRY);
          setShowRetryDialog(true);
        }
        return null;
      }

      return (
        <FluencyP2
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData: contentSourceDataForP2,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP3") {
      return (
        <FluencyP3
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData: questions,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP4") {
      return (
        <FluencyP4
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData: questions,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background: isShowCase
              ? "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)"
              : undefined,
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase ? handleBack : undefined,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP5") {
      return (
        <FluencyP5
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData:
              questions[currentQuestion]?.contentSourceData?.[0],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "fluencyP6") {
      return (
        <ParagraphFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: questions[currentQuestion]?.multilingual_data,
            contentSourceData: questions[currentQuestion],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "syllablePuzzle") {
      return (
        <SyllablePuzzle
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "readTheImage") {
      const options = questions[currentQuestion]?.mechanics_data
        ? questions[currentQuestion]?.mechanics_data[0]?.options
        : [];
      const audioLink =
        options && options.length > 0
          ? options.find((option) => option.isAns === true)?.audio_url || null
          : null;

      const mechanics_data = questions[currentQuestion]?.mechanics_data;
      return (
        <Mechanics5
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism?.id === "mechanic_16"
                ? ui.PRACTICE_READ_QUESTION_SELECT_ANSWER
                : ui.PRACTICE_LOOK_PICTURE_SPEAK_ANSWER,
            parentWords: mechanics_data
              ? mechanics_data[0].text
              : questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            question_audio: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                mechanics_data[0].audio_url
              : questions[currentQuestion]?.contentSourceData?.[0]?.audio_url,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            options: options,
            correctness: mechanics_data ? mechanics_data[0]?.correctness : null,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            mechanism: mechanism?.id,
            image: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                mechanics_data[0]?.image_url
              : null,

            audio: mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                audioLink
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
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
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "formASentence") {
      return (
        <Mechanics4
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header: ui.PRACTICE_FORM_SENTENCE_SPEAK,
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
            storyLine,
            handleNext,
            // image: elephant,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "readAloud") {
      return (
        <ReadAloud
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "jumbledWord") {
      return (
        <JumbledWord
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "askMore") {
      return (
        <AskMoreM14
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
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
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "actOut") {
      return (
        <ActOutM13
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
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
    } else if (mechanism && mechanism.name === "ReadAloudMcqM10") {
      return (
        <PhoneConversation
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
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
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "WhatsMissing") {
      return (
        <WhatsMissing
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "arrangePicture") {
      return (
        <ArrangePicture
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "barakhadi" &&
      isF2FlowActive &&
      milestoneLevel === "B" &&
      getF2FlowStep()?.step?.type === "L"
    ) {
      // Render Barakhadi for F2 Learn steps in Indic languages
      const lang = getLocalData("lang") || "en";

      // Check if this is a F2 Learn step for render
      const currentF2StepForBarakhadi = getF2FlowStep();
      const isF2LearnStepForBarakhadi =
        currentF2StepForBarakhadi?.step?.type === "L";

      // Get current F2 flow step to extract customWords (customLetters from config)
      const currentF2Step = getF2FlowStep();
      const f2IndexToUse = currentF2Step?.index ?? f2FlowIndexState;

      // Get F2 config from constants
      const f2Config = levelGetContent[lang]?.["F2"];
      let currentGetContentForF2;

      if (
        f2Config &&
        Array.isArray(f2Config) &&
        f2IndexToUse >= 0 &&
        f2IndexToUse < f2Config.length
      ) {
        currentGetContentForF2 = f2Config[f2IndexToUse];
      } else {
        // Fallback: try to get content using getCurrentContent
        const currentF2FlowStep = getF2FlowStep();
        if (currentF2FlowStep?.step?.title) {
          currentGetContentForF2 = getCurrentContent(
            level,
            currentF2FlowStep.step.title,
            lang
          );
        }
      }

      // Extract customWords from F2 config (customLetters contains words for F2 Learn steps)
      const customWordsForF2 = currentGetContentForF2?.customLetters;

      console.log("Barakhadi render - F2 Learn step for Indic language:", {
        mechanism: mechanism?.name,
        isF2FlowActive,
        milestoneLevel,
        f2StepType: getF2FlowStep()?.step?.type,
        lang,
        f2IndexToUse,
        customWordsForF2,
        currentGetContentForF2,
      });

      return (
        <Barakhadi
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header: ui.PRACTICE_SPEAK_WORD,
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext: isF2LearnStepForBarakhadi
              ? handleLetterTrainComplete
              : handleNext, // Use same conditional pattern as LetterTrain
            type: "word",
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
            customWords: customWordsForF2, // Pass customWords from F2 config (customLetters contains words)
          }}
        />
      );
    } else if (
      mechanism &&
      typeof mechanism === "object" &&
      mechanism.name === "barakhadi" &&
      isF2FlowActive &&
      milestoneLevel === "B" &&
      getF2FlowStep()?.step?.type === "L"
    ) {
      // Render Barakhadi for F2 Learn steps in Indic languages
      const lang = getLocalData("lang") || "en";

      // Check if this is a F2 Learn step for render
      const currentF2StepForBarakhadi = getF2FlowStep();
      const isF2LearnStepForBarakhadi =
        currentF2StepForBarakhadi?.step?.type === "L";

      // Get current F2 flow step to extract customWords (customLetters from config)
      const currentF2Step = getF2FlowStep();
      const f2IndexToUse = currentF2Step?.index ?? f2FlowIndexState;

      // Get F2 config from constants
      const f2Config = levelGetContent[lang]?.["F2"];
      let currentGetContentForF2;

      if (
        f2Config &&
        Array.isArray(f2Config) &&
        f2IndexToUse >= 0 &&
        f2IndexToUse < f2Config.length
      ) {
        currentGetContentForF2 = f2Config[f2IndexToUse];
      } else {
        // Fallback: try to get content using getCurrentContent
        const currentF2FlowStep = getF2FlowStep();
        if (currentF2FlowStep?.step?.title) {
          currentGetContentForF2 = getCurrentContent(
            level,
            currentF2FlowStep.step.title,
            lang
          );
        }
      }

      // Extract customWords from F2 config (customLetters contains words for F2 Learn steps)
      const customWordsForF2 = currentGetContentForF2?.customLetters;

      console.log("Barakhadi render - F2 Learn step for Indic language:", {
        mechanism: mechanism?.name,
        isF2FlowActive,
        milestoneLevel,
        f2StepType: getF2FlowStep()?.step?.type,
        lang,
        f2IndexToUse,
        customWordsForF2,
        currentGetContentForF2,
      });

      return (
        <Barakhadi
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header: ui.PRACTICE_SPEAK_WORD,
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext: isF2LearnStepForBarakhadi
              ? handleLetterTrainComplete
              : handleNext, // Use same conditional pattern as LetterTrain
            type: "word",
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
            customWords: customWordsForF2, // Pass customWords from F2 config (customLetters contains words)
          }}
        />
      );
    } else if (
      (mechanism &&
        typeof mechanism === "object" &&
        mechanism.name === "letterTrain") ||
      (isF2FlowActive &&
        milestoneLevel === "B" &&
        shouldShowF2 &&
        getF2FlowStep()?.step?.type === "L") || // F2 Learn steps use LetterTrain
      (isF1FlowActive &&
        milestoneLevel === "B" &&
        shouldShowF1 &&
        !isF2FlowActive && // Don't render LetterTrain for F1 if F2 flow is active
        getF1FlowStep()?.step?.type === "L")
    ) {
      console.log("LetterTrain render - Condition matched, entering block", {
        mechanismMatch:
          mechanism &&
          typeof mechanism === "object" &&
          mechanism.name === "letterTrain",
        f1FlowMatch:
          isF1FlowActive &&
          milestoneLevel === "B" &&
          shouldShowF1 &&
          getF1FlowStep()?.step?.type === "L",
        mechanism: typeof mechanism === "object" ? mechanism?.name : mechanism,
        isF1FlowActive,
        milestoneLevel,
        shouldShowF1,
        f1StepType: getF1FlowStep()?.step?.type,
      });

      // Only render LetterTrain for F1 flow (milestone level "B")
      // Double-check that this is actually F1 flow, not other milestones
      if (isF1FlowActive && milestoneLevel !== "B") {
        console.warn(
          "LetterTrain render - isF1FlowActive is true but milestoneLevel is not 'B':",
          milestoneLevel
        );
        // Don't render LetterTrain for non-F1 milestones - skip this block
      } else {
        console.log("LetterTrain render - Entering LetterTrain block", {
          mechanism:
            typeof mechanism === "object" ? mechanism?.name : mechanism,
          mechanismType: typeof mechanism,
          isF1FlowActive,
          milestoneLevel,
          shouldShowF1,
          f1FlowIndexState,
          f1StepType: isF1FlowActive ? getF1FlowStep()?.step?.type : null,
        });

        // Get currentGetContent to access customLetters
        // For F1 flow, directly access F1 config array using f1FlowIndexState
        let currentGetContentForLetterTrain;
        let customLetters;

        // Check if this is an F2 Learn step (takes precedence)
        const currentF2StepForLetterTrain = isF2FlowActive
          ? getF2FlowStep()
          : null;
        const isF2LearnStepForRender =
          currentF2StepForLetterTrain?.step?.type === "L";

        // Check if this is an F1 Learn step
        const currentF1StepForLetterTrain =
          isF1FlowActive && !isF2FlowActive ? getF1FlowStep() : null;
        const isF1LearnStepForRender =
          currentF1StepForLetterTrain?.step?.type === "L";

        console.log("LetterTrain render - F1/F2 step check", {
          currentF1Step: currentF1StepForLetterTrain,
          currentF2Step: currentF2StepForLetterTrain,
          isF1LearnStepForRender,
          isF2LearnStepForRender,
          f1StepType: currentF1StepForLetterTrain?.step?.type,
          f2StepType: currentF2StepForLetterTrain?.step?.type,
        });

        // If it's F1/F2 flow but not a Learn step, don't render LetterTrain - let it fall through to LetterHunt
        // Also check that milestoneLevel is actually "B" to prevent rendering for other milestones
        if (
          (isF2FlowActive && !isF2LearnStepForRender) ||
          (isF1FlowActive && !isF1LearnStepForRender) ||
          ((isF1FlowActive || isF2FlowActive) && milestoneLevel !== "B")
        ) {
          if (isF1FlowActive && milestoneLevel !== "B") {
            console.warn(
              "LetterTrain render - Blocked: isF1FlowActive but milestoneLevel is not 'B':",
              milestoneLevel
            );
          } else {
            console.log(
              "LetterTrain render - Not a Learn step, will fall through to LetterHunt"
            );
          }
          // Don't render LetterTrain for Practice/Apply steps or non-F1 milestones
          // This will fall through to LetterHunt rendering or other mechanisms
          // Don't return null here - let it continue to check other mechanisms
        } else {
          // Ensure mechanism is set correctly for F1/F2 flow Learn steps
          if (
            (isF2FlowActive || isF1FlowActive) &&
            (isF2LearnStepForRender || isF1LearnStepForRender) &&
            mechanism?.name !== "letterTrain"
          ) {
            console.log(
              "LetterTrain render - Setting mechanism to letterTrain for F1/F2 Learn step"
            );
            setMechanism({ id: "letterTrain", name: "letterTrain" });
          }

          if (isF2FlowActive) {
            // For F2 flow, use currentF2Step.index (from localStorage) instead of f2FlowIndexState
            // This ensures we always use the most up-to-date index
            const f2IndexToUse = currentF2StepForLetterTrain.index;
            const lang = getLocalData("lang") || "en";
            const f2Config = levelGetContent[lang]?.["F2"];
            if (f2Config && Array.isArray(f2Config) && f2Config[f2IndexToUse]) {
              currentGetContentForLetterTrain = f2Config[f2IndexToUse];
              customLetters = currentGetContentForLetterTrain?.customLetters;
              console.log(
                "LetterTrain render - F2 config for index:",
                f2IndexToUse,
                "customLetters:",
                customLetters
              );
            } else {
              console.error(
                "LetterTrain render - F2 config not found for index:",
                f2IndexToUse,
                "f2FlowIndexState:",
                f2FlowIndexState
              );
              currentGetContentForLetterTrain = null;
              customLetters = null;
            }
          } else if (isF1FlowActive) {
            // For F1 flow, use currentF1Step.index (from localStorage) instead of f1FlowIndexState
            // This ensures we always use the most up-to-date index
            const currentF1Step = getF1FlowStep();
            const f1IndexToUse = currentF1Step.index;
            const lang = getLocalData("lang") || "en";
            const f1Config = levelGetContent[lang]?.["F1"];
            if (f1Config && Array.isArray(f1Config) && f1Config[f1IndexToUse]) {
              currentGetContentForLetterTrain = f1Config[f1IndexToUse];
              customLetters = currentGetContentForLetterTrain?.customLetters;
              console.log(
                "LetterTrain render - F1 config for index:",
                f1IndexToUse,
                "customLetters:",
                customLetters
              );
            } else {
              console.error(
                "LetterTrain render - F1 config not found for index:",
                f1IndexToUse,
                "f1FlowIndexState:",
                f1FlowIndexState
              );
              currentGetContentForLetterTrain = null;
              customLetters = null;
            }
          } else {
            // For non-F1 flow, use getCurrentContent
            const stepIndexForContent = progressData?.currentPracticeStep || 0;
            currentGetContentForLetterTrain =
              getCurrentContent(stepIndexForContent);
            customLetters = currentGetContentForLetterTrain?.customLetters;
          }

          // Get confidentLetters from API response (stored in localStorage) with fallback to config
          // This applies to all flows (F1, F2, and non-F1)
          let confidentLettersForLetterTrain =
            currentGetContentForLetterTrain?.confidentLetters;
          try {
            const storedConfidentLetters =
              localStorage.getItem("confidentLetters");
            if (storedConfidentLetters) {
              const parsed = JSON.parse(storedConfidentLetters);
              if (Array.isArray(parsed) && parsed.length > 0) {
                confidentLettersForLetterTrain = parsed;
                console.log(
                  "✅ LetterTrain - Using confidentLetters from API response:",
                  confidentLettersForLetterTrain
                );
              }
            }
          } catch (error) {
            console.warn(
              "Error reading confidentLetters from localStorage, using config:",
              error
            );
          }

          // Only render LetterTrain if we have customLetters (for F1/F2 Learn steps)
          // If customLetters is undefined, it means we're not in a Learn step, so don't render
          console.log("LetterTrain render - Checking customLetters", {
            customLetters,
            isF1FlowActive,
            isF2FlowActive,
            currentGetContent: currentGetContentForLetterTrain,
            f1FlowIndexState,
            f2FlowIndexState,
            f1IndexToUse: isF1FlowActive ? getF1FlowStep().index : null,
            f2IndexToUse: isF2FlowActive ? getF2FlowStep().index : null,
          });

          // If customLetters is still undefined, try to get it from currentGetContent (the one logged as curContent)
          if (!customLetters && isF2FlowActive) {
            // Try to get customLetters from the current F2 content that was loaded
            const lang = getLocalData("lang") || "en";
            const f2Config = levelGetContent[lang]?.["F2"];
            const currentF2Step = getF2FlowStep();
            const f2IndexToUse = currentF2Step.index;
            if (f2Config && Array.isArray(f2Config) && f2Config[f2IndexToUse]) {
              const fallbackContent = f2Config[f2IndexToUse];
              if (fallbackContent?.customLetters) {
                console.log(
                  "LetterTrain render - Found customLetters in F2 fallback content:",
                  fallbackContent.customLetters
                );
                customLetters = fallbackContent.customLetters;
                currentGetContentForLetterTrain = fallbackContent;
              }
            }
          } else if (!customLetters && isF1FlowActive) {
            // Try to get customLetters from the current F1 content that was loaded
            const lang = getLocalData("lang") || "en";
            const f1Config = levelGetContent[lang]?.["F1"];
            const currentF1Step = getF1FlowStep();
            const f1IndexToUse = currentF1Step.index;
            if (f1Config && Array.isArray(f1Config) && f1Config[f1IndexToUse]) {
              const fallbackContent = f1Config[f1IndexToUse];
              if (fallbackContent?.customLetters) {
                console.log(
                  "LetterTrain render - Found customLetters in F1 fallback content:",
                  fallbackContent.customLetters
                );
                customLetters = fallbackContent.customLetters;
                currentGetContentForLetterTrain = fallbackContent;
              }
            }
          }

          if (!customLetters && (isF2FlowActive || isF1FlowActive)) {
            console.warn(
              "LetterTrain render blocked: customLetters is undefined for F1/F2 flow step",
              {
                stepIndex: isF2FlowActive
                  ? f2FlowIndexState
                  : isF1FlowActive
                  ? f1FlowIndexState
                  : progressData?.currentPracticeStep || 0,
                f1FlowIndexState,
                f2FlowIndexState,
                f1FlowStep: f1FlowStep?.step,
                f2FlowStep: f2FlowStep?.step,
                currentGetContent: currentGetContentForLetterTrain,
              }
            );
            // Don't render LetterTrain if we don't have customLetters in F1 flow
            // Don't return null - let it fall through to check other mechanisms or show loading
            // Returning null causes blank screen
          } else if (customLetters) {
            console.log(
              "LetterTrain render - Rendering LetterTrain with customLetters:",
              customLetters
            );
            return (
              <LetterTrain
                page={page}
                setPage={setPage}
                isAlphabetDemoActive={isAlphabetDemoActive}
                {...{
                  level: level,
                  header:
                    questions[currentQuestion]?.contentType === "image"
                      ? ui.PRACTICE_GUESS_IMAGE
                      : ui.PRACTICE_SPEAK_WORD,
                  currentImg: currentImage,
                  parentWords: parentWords,
                  contentType: currentContentType,
                  contentId: questions[currentQuestion]?.contentId,
                  setVoiceText,
                  setRecordedAudio,
                  setVoiceAnimate,
                  storyLine,
                  handleNext:
                    isF2LearnStepForRender || isF1LearnStep
                      ? handleLetterTrainComplete
                      : handleNext,
                  type: "word",
                  enableNext,
                  showTimer: false,
                  points,
                  steps: questions?.length,
                  currentStep: currentQuestion + 1,
                  progressData,
                  showProgress: true,
                  background:
                    isShowCase &&
                    "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
                  playTeacherAudio,
                  callUpdateLearner: isShowCase,
                  disableScreen,
                  isShowCase,
                  handleBack: !isShowCase && handleBack,
                  setEnableNext,
                  loading,
                  setOpenMessageDialog,
                  vocabCount,
                  wordCount,
                  customLetters: customLetters,
                  confidentLetters: confidentLettersForLetterTrain,
                }}
              />
            );
          }
        }
      }
    } else if (mechanism && mechanism.name === "letterLauncher") {
      if (loading) {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        );
      }
      // F3 flow uses Letter Launcher for Practice and Apply steps
      if (isF3FlowActive && f3FlowStep?.step && milestoneLevel === "B") {
        // CRITICAL: Always get fresh step from localStorage (getF3FlowStep reads directly)
        // This ensures we use the correct index even if f3FlowIndex was just removed
        const currentF3Step = getF3FlowStep();
        const f3StepType = currentF3Step.step?.type;

        // Ensure localStorage is in sync with the step we're using
        // This is critical when f3FlowIndex is removed - we need to initialize it
        // Note: State sync happens in useEffect to avoid setState during render
        const savedF3Index = getLocalData("f3FlowIndex");
        if (
          savedF3Index === null ||
          Number(savedF3Index) !== currentF3Step.index
        ) {
          setLocalData("f3FlowIndex", currentF3Step.index);
        }

        console.log("LetterLauncher render - F3 flow check:", {
          f3FlowIndexState,
          currentF3StepIndex: currentF3Step.index,
          savedF3IndexFromStorage: getLocalData("f3FlowIndex"),
          f3StepType,
          mechanism: mechanism?.name,
          step: currentF3Step.step,
          hasStep: !!currentF3Step.step,
        });

        // If we don't have a valid step, show retry dialog
        if (!currentF3Step.step) {
          console.warn(
            "LetterLauncher render - No F3 step found at index:",
            currentF3Step.index,
            "showing retry dialog"
          );
          if (!showRetryDialog) {
            setRetryDialogMessage(ui.PRACTICE_UNABLE_LOAD_F3_STEP_RETRY);
            setShowRetryDialog(true);
          }
          return null;
        }

        // Get F3 config
        const lang = getLocalData("lang") || "en";
        const f3Config = levelGetContent[lang]?.["F3"];
        const f3IndexToUse = currentF3Step.index;

        // Ensure f3FlowIndexState is in sync with currentF3Step.index
        // This fixes the issue where removing f3FlowIndex causes mismatch
        if (f3FlowIndexState !== currentF3Step.index) {
          console.log(
            "LetterLauncher render - Syncing f3FlowIndexState:",
            f3FlowIndexState,
            "->",
            currentF3Step.index
          );
          setF3FlowIndexState(currentF3Step.index);
        }

        // Note: localStorage sync already handled above (line 10360-10363)

        let currentGetContentForF3;
        if (f3Config && Array.isArray(f3Config) && f3Config[f3IndexToUse]) {
          currentGetContentForF3 = f3Config[f3IndexToUse];
          console.log(
            "LetterLauncher render - F3 config for index:",
            f3IndexToUse,
            "content:",
            currentGetContentForF3
          );
        } else {
          console.error(
            "LetterLauncher render - F3 config not found for index:",
            f3IndexToUse,
            "f3Config exists:",
            !!f3Config,
            "isArray:",
            Array.isArray(f3Config),
            "config length:",
            f3Config?.length,
            "available indices:",
            f3Config?.map((_, i) => i)
          );
          return (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h2>{ui.PRACTICE_F3_LETTER_LAUNCHER_STUB_TITLE}</h2>
              <p>{ui.PRACTICE_LETTER_LAUNCHER_NOT_IMPLEMENTED}</p>
              <p>
                Step: {f3StepType}
                {currentF3Step.step?.step}
              </p>
            </div>
          );
        }

        // Extract config values
        const letterLauncherLevel =
          currentGetContentForF3?.letterLauncherLevel || 1;
        const letterLauncherEndLevel =
          currentGetContentForF3?.letterLauncherEndLevel;
        const letterLauncherContentCount =
          currentGetContentForF3?.letterLauncherContentCount || 10;
        const contentType =
          currentF3Step.step?.contentType ||
          currentGetContentForF3?.contentType ||
          "letter";

        const isShowcase = currentGetContentForF3?.isShowcase || false;
        const applyStep = currentGetContentForF3?.applyStep;
        const failRedirect = currentGetContentForF3?.failRedirect;
        const passRedirect = currentGetContentForF3?.passRedirect;

        // Get confidentLetters from API response (stored in localStorage) with fallback to config
        // BUT: Only apply confidentLetters for Practice steps, NOT for Apply steps
        // Apply steps should use normal level-based letters/syllables
        let confidentLettersForF3 = undefined;
        if (f3StepType === "P") {
          // Only for Practice steps: use confidentLetters
          const confidentLettersFromConfig =
            currentGetContentForF3?.confidentLetters;
          confidentLettersForF3 = confidentLettersFromConfig;
          try {
            const storedConfidentLetters =
              localStorage.getItem("confidentLetters");
            if (storedConfidentLetters) {
              const parsed = JSON.parse(storedConfidentLetters);
              if (Array.isArray(parsed) && parsed.length > 0) {
                confidentLettersForF3 = parsed;
                console.log(
                  "✅ Using confidentLetters from API response (F3 Practice):",
                  confidentLettersForF3
                );
              }
            }
          } catch (error) {
            console.warn(
              "Error reading confidentLetters from localStorage, using config:",
              error
            );
          }
        } else if (f3StepType === "A") {
          // For Apply steps: don't use confidentLetters (use normal level-based content)
          confidentLettersForF3 = undefined;
          console.log(
            "✅ F3 Apply step - confidentLetters disabled, using normal level-based letters/syllables"
          );
        }
        const memoryChallengeLevel =
          currentGetContentForF3?.memoryChallengeLevel;
        const memoryChallengeEndLevel =
          currentGetContentForF3?.memoryChallengeEndLevel;
        const memoryChallengeContentCount =
          currentGetContentForF3?.memoryChallengeContentCount || 5;
        const readAloudContentCount =
          currentGetContentForF3?.readAloudContentCount;
        const milestoneLevelValue = level === "B" ? "B" : `m${level}`;
        const sessionId = getLocalData("sessionId");

        // Track which sub-step we're on for Apply steps (Letter Launcher -> Memory Challenge -> Read Aloud)
        const f3ApplySubStepState =
          getLocalData("f3ApplySubStep") || "letterLauncher";

        // For Apply steps, check if we need to show Memory Challenge or Read Aloud
        if (f3StepType === "A" && isShowcase) {
          // Apply step - check sub-step
          if (
            f3ApplySubStepState === "memoryChallenge" &&
            memoryChallengeLevel
          ) {
            // Show Memory Challenge
            return (
              <MemoryChallengeMechanics
                page={page}
                setPage={setPage}
                level={memoryChallengeLevel}
                endLevel={memoryChallengeEndLevel || 3}
                contentCount={memoryChallengeContentCount}
                sessionId={sessionId}
                handleNext={() => {
                  // Check for redirect request first
                  const f3FlowRedirect = getLocalData("f3FlowRedirect");
                  if (f3FlowRedirect) {
                    // Redirect is handled by Practice.jsx's handleNext
                    if (handleNext) {
                      handleNext();
                    }
                    return;
                  }

                  // After Memory Challenge, check if we need Read Aloud
                  if (readAloudContentCount && applyStep === 2) {
                    // A2: Show Read Aloud after Memory Challenge
                    setLocalData("f3ApplySubStep", "readAloud");
                    // Force re-render by updating mechanism
                    setMechanism({ id: "readAloud", name: "readAloud" });
                  } else {
                    // A1: Complete after Memory Challenge
                    setLocalData("f3ApplySubStep", null);
                    if (handleNext) {
                      handleNext();
                    }
                  }
                }}
                handleBack={handleBack}
                applyStep={applyStep}
                failRedirect={failRedirect}
                passRedirect={passRedirect}
                isF3FlowActive={isF3FlowActive}
                f3FlowStep={currentF3Step}
                isShowCase={isShowcase}
                header={ui.PRACTICE_MEMORY_CHALLENGE}
                points={points}
                steps={memoryChallengeContentCount}
                currentStep={1}
                progressData={progressData}
                showProgress={true}
                background="#FFB31F"
                enableNext={enableNext}
                setEnableNext={setEnableNext}
                loading={loading}
                setOpenMessageDialog={setOpenMessageDialog}
                vocabCount={vocabCount}
                wordCount={wordCount}
                showTimer={false}
                milestoneLevel={milestoneLevelValue}
                setProgressData={setProgressData}
                setCurrentQuestion={setCurrentQuestion}
              />
            );
          } else if (
            f3ApplySubStepState === "readAloud" &&
            readAloudContentCount
          ) {
            // Show Read Aloud (for A2)
            // ReadAloud component already exists, use it
            return (
              <ReadAloud
                page={page}
                setPage={setPage}
                handleNext={() => {
                  // Complete A2 - check if we should redirect to discover-start
                  setLocalData("f3ApplySubStep", null);

                  // Check if A2 is complete and should redirect to discover-start
                  // A2 is the last step in F3 flow (index 13), and passRedirect is "complete"
                  if (
                    applyStep === 2 &&
                    passRedirect === "complete" &&
                    f3FlowStep?.isLast
                  ) {
                    console.log(
                      "A2 completed successfully - F3 flow complete, redirecting to discover-start"
                    );
                    // Clear F3 flow data
                    setLocalData("f3FlowIndex", null);
                    setLocalData("f3FlowComplete", "true");
                    // Clear practice progress
                    setLocalData("practiceProgress", null);
                    // Redirect to discover-start
                    navigate("/discover-start");
                    return;
                  }

                  if (handleNext) {
                    handleNext();
                  }
                }}
                handleBack={handleBack}
                // ... other ReadAloud props
              />
            );
          }
          // Default: Show Letter Launcher for Apply step
        }

        // Render Letter Launcher using library component
        return (
          <LetterLauncherMechanics
            page={page}
            setPage={setPage}
            level={letterLauncherLevel}
            endLevel={letterLauncherEndLevel}
            contentType={contentType}
            contentCount={letterLauncherContentCount}
            isShowCase={isShowcase}
            sessionId={sessionId}
            confidentLetters={confidentLettersForF3}
            handleBack={!isShowcase && handleBack}
            handleNext={() => {
              // FIRST: Check if there's a redirect request (e.g., from failed level)
              // This takes priority over moving to Memory Challenge
              const f3FlowRedirect = getLocalData("f3FlowRedirect");
              if (f3FlowRedirect) {
                console.log(
                  `Letter Launcher handleNext - Redirect flag found: ${f3FlowRedirect}, redirecting instead of moving to Memory Challenge`
                );
                // Call the main handleNext which will handle the redirect
                if (handleNext) {
                  handleNext();
                }
                return;
              }

              // SECOND: For Apply steps, after Letter Launcher completes successfully, move to Memory Challenge
              // Only move to Memory Challenge if there's no redirect flag
              if (f3StepType === "A" && isShowcase && memoryChallengeLevel) {
                console.log(
                  `Letter Launcher handleNext - All levels passed, moving to Memory Challenge`
                );
                setLocalData("f3ApplySubStep", "memoryChallenge");
                // Trigger re-render by updating mechanism
                setMechanism({
                  id: "memoryChallenge",
                  name: "memoryChallenge",
                });
              } else {
                // Practice step or no Memory Challenge - complete normally
                // Clear sub-step if set
                setLocalData("f3ApplySubStep", null);
                if (handleNext) {
                  handleNext();
                }
              }
            }}
            applyStep={applyStep}
            failRedirect={failRedirect}
            passRedirect={passRedirect}
            isF3FlowActive={isF3FlowActive}
            f3FlowStep={currentF3Step}
            header={
              f3StepType === "A"
                ? ui.PRACTICE_F3_APPLY_LETTER_SPEED.replace(
                    "{step}",
                    String(applyStep ?? "")
                  )
                : ui.PRACTICE_F3_PRACTICE_LETTER_SPEED.replace(
                    "{step}",
                    String(currentF3Step.step?.step ?? "")
                  )
            }
            points={points}
            steps={letterLauncherContentCount}
            currentStep={1}
            progressData={progressData}
            showProgress={true}
            background="#FFB31F"
            enableNext={enableNext}
            setEnableNext={setEnableNext}
            loading={loading}
            setOpenMessageDialog={setOpenMessageDialog}
            vocabCount={vocabCount}
            wordCount={wordCount}
            showTimer={false}
            milestoneLevel={milestoneLevelValue}
            setProgressData={setProgressData}
            setCurrentQuestion={setCurrentQuestion}
          />
        );
      } else {
        // Non-F3 flow - Letter Launcher not yet implemented for other flows
        return (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>{ui.PRACTICE_LETTER_LAUNCHER_TITLE}</h2>
            <p>{ui.PRACTICE_LETTER_LAUNCHER_NOT_IMPLEMENTED}</p>
          </div>
        );
      }
    } else if (mechanism && mechanism.name === "letterHunt") {
      // For F2 flow, all steps (Learn, Practice, Apply) use LetterHunt
      // F2 flow takes precedence over F1 flow
      if (isF2FlowActive) {
        // Use effectiveF2FlowIndex from component level (which uses localStorage fallback)
        // instead of getF2FlowStep() which might use stale state
        const currentF2Step = {
          index: effectiveF2FlowIndex,
          step: F2_FLOW[effectiveF2FlowIndex] || null,
          isLast: effectiveF2FlowIndex === F2_FLOW.length - 1,
        };
        const f2StepType = currentF2Step.step?.type;
        console.log("LetterHunt render - F2 flow check:", {
          f2FlowIndexState,
          effectiveF2FlowIndex,
          f2FlowIndexFromStorage,
          currentF2StepIndex: currentF2Step.index,
          f2StepType,
          mechanism: mechanism?.name,
          step: currentF2Step.step,
          hasStep: !!currentF2Step.step,
        });

        // If we don't have a valid step, show retry dialog
        if (!currentF2Step.step) {
          console.warn(
            "LetterHunt render - No F2 step found at index:",
            currentF2Step.index,
            "showing retry dialog"
          );
          if (!showRetryDialog) {
            setRetryDialogMessage(ui.PRACTICE_UNABLE_LOAD_F2_STEP_RETRY);
            setShowRetryDialog(true);
          }
          return null;
        }

        if (f2StepType === "L") {
          console.warn(
            "LetterHunt render blocked: F2 flow step type is 'L' (Learn) but mechanism is letterHunt. This is incorrect - Learn steps use LetterTrain.",
            {
              f2FlowIndexState,
              currentF2Step: currentF2Step.step,
              mechanism,
            }
          );
          // Don't render LetterHunt if it's actually a Learn step (should use LetterTrain)
          return null;
        } else if (f2StepType === "P" || f2StepType === "A") {
          // F2 Practice and Apply steps use LetterHunt
          // Ensure mechanism is set correctly for F2 flow
          if (mechanism?.name !== "letterHunt") {
            console.log(
              "LetterHunt render - Setting mechanism to letterHunt for F2 step type:",
              f2StepType
            );
            setMechanism({ id: "letterHunt", name: "letterHunt" });
          }
          // For F2 flow, use F2 config directly
          let currentGetContentForF2;
          const f2IndexToUse = currentF2Step.index;
          const lang = getLocalData("lang") || "en";
          const f2Config = levelGetContent[lang]?.["F2"];
          if (f2Config && Array.isArray(f2Config) && f2Config[f2IndexToUse]) {
            currentGetContentForF2 = f2Config[f2IndexToUse];
            console.log(
              "LetterHunt render - F2 config for index:",
              f2IndexToUse,
              "content:",
              currentGetContentForF2
            );
          } else {
            console.error(
              "LetterHunt render - F2 config not found for index:",
              f2IndexToUse,
              "f2FlowIndexState:",
              f2FlowIndexState,
              "f2Config length:",
              f2Config?.length
            );
            // Fallback to getCurrentContent if F2 config not found
            currentGetContentForF2 = getCurrentContent(
              progressData?.currentPracticeStep || 0
            );
          }

          // Add null check for currentGetContentForF2
          if (!currentGetContentForF2) {
            console.error(
              "LetterHunt render - currentGetContentForF2 is null/undefined for index:",
              f2IndexToUse
            );
            // Create a minimal config object for Apply steps
            if (f2StepType === "A") {
              const applyStepNum = currentF2Step.step?.step || 1;
              currentGetContentForF2 = {
                title: `A${applyStepNum}`,
                letterHuntLevel: 1,
                letterHuntEndLevel: 3,
                isShowcase: true,
                applyStep: applyStepNum,
                failRedirect:
                  applyStepNum === 1 ? "L1" : applyStepNum === 2 ? "L4" : "L7",
                passRedirect:
                  applyStepNum === 1 ? "L4" : applyStepNum === 2 ? "L7" : "F3",
              };
              console.log(
                "LetterHunt render - Created fallback config for F2 Apply step:",
                currentGetContentForF2
              );
            } else {
              // For Practice steps, create minimal config
              const practiceStepNum = currentF2Step.step?.step || 1;
              currentGetContentForF2 = {
                title: `P${practiceStepNum}`,
                letterHuntLevel: 1,
                isShowcase: false,
              };
              console.log(
                "LetterHunt render - Created fallback config for F2 Practice step:",
                currentGetContentForF2
              );
            }
          }

          const letterHuntLevel = currentGetContentForF2?.letterHuntLevel || 1;
          const letterHuntIsShowcase =
            currentGetContentForF2?.isShowcase || false;
          const letterHuntEndLevel = currentGetContentForF2?.letterHuntEndLevel;
          const letterHuntContentCount =
            currentGetContentForF2?.letterHuntContentCount || 10; // Content count per level
          const applyStep = currentGetContentForF2?.applyStep;
          const failRedirect = currentGetContentForF2?.failRedirect;
          const passRedirect = currentGetContentForF2?.passRedirect;
          const customLettersForF2 = currentGetContentForF2?.customLetters; // Extract customLetters from F2 config (can be words/syllables or letters)
          const confidentLettersFromConfigF2 =
            currentGetContentForF2?.confidentLetters; // Extract confidentLetters from F2 config

          // Get confidentLetters from API response (stored in localStorage) with fallback to config
          // BUT: Only apply confidentLetters for Practice steps, NOT for Apply steps
          // Apply steps should use normal level-based letters/syllables
          let confidentLettersForF2 = undefined;
          if (f2StepType === "P") {
            // Only for Practice steps: use confidentLetters
            confidentLettersForF2 = confidentLettersFromConfigF2;
            try {
              const storedConfidentLetters =
                localStorage.getItem("confidentLetters");
              if (storedConfidentLetters) {
                const parsed = JSON.parse(storedConfidentLetters);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  confidentLettersForF2 = parsed;
                  console.log(
                    "✅ Using confidentLetters from API response (F2 Practice):",
                    confidentLettersForF2
                  );
                }
              }
            } catch (error) {
              console.warn(
                "Error reading confidentLetters from localStorage, using config:",
                error
              );
            }
          } else if (f2StepType === "A") {
            // For Apply steps: don't use confidentLetters (use normal level-based content)
            confidentLettersForF2 = undefined;
            console.log(
              "✅ F2 Apply step - confidentLetters disabled, using normal level-based letters/syllables"
            );
          }

          const milestoneLevelValue = "B";
          // For Letter Hunt, questions are generated by LetterGame, so use letterHuntContentCount for steps
          const letterHuntSteps =
            questions?.length > 0
              ? questions.length
              : letterHuntIsShowcase
              ? letterHuntContentCount * (letterHuntEndLevel || 1)
              : letterHuntContentCount;

          return (
            <LetterHuntMechanics
              page={page}
              setPage={setPage}
              isAlphabetDemoActive={isAlphabetDemoActive}
              {...{
                level: letterHuntIsShowcase
                  ? letterHuntLevel || 1
                  : letterHuntLevel,
                header:
                  questions[currentQuestion]?.contentType === "image"
                    ? ui.PRACTICE_GUESS_IMAGE
                    : ui.PRACTICE_LETTER_RECOGNITION,
                points,
                steps: letterHuntSteps || 10, // Ensure steps is never 0 or undefined
                currentStep: (currentQuestion || 0) + 1,
                progressData,
                showProgress: true,
                background: "#FFB31F",
                handleNext,
                handleBack: !letterHuntIsShowcase && handleBack,
                enableNext,
                setEnableNext,
                isShowCase: letterHuntIsShowcase,
                loading,
                setOpenMessageDialog,
                vocabCount,
                wordCount,
                showTimer: false,
                milestoneLevel: milestoneLevelValue,
                endLevel: letterHuntEndLevel,
                startShowCase,
                setStartShowCase,
                setProgressData,
                setCurrentQuestion,
                applyStep,
                failRedirect,
                passRedirect,
                isF1FlowActive: false, // F2 flow is active, not F1
                f1FlowStep: null,
                isF2FlowActive, // Pass F2 flow active flag
                f2FlowStep, // Pass F2 flow step info
                customLetters: customLettersForF2, // Pass customLetters from F2 config
                confidentLetters: confidentLettersForF2, // Pass confidentLetters from F2 config
              }}
            />
          );
        } else {
          // F2 flow step type is neither L, P, nor A - this shouldn't happen
          console.error(
            "LetterHunt render - Unknown F2 step type:",
            f2StepType,
            "at index:",
            currentF2Step.index
          );
          return null;
        }
      }
      // For F1 flow, verify that this is actually a Practice or Apply step, not a Learn step
      // If mechanism is letterHunt but F1 flow step type is "L", something is wrong - don't render
      else if (isF1FlowActive && !isF2FlowActive) {
        // Also check if we should render LetterHunt based on F1 step type, even if mechanism isn't set yet
        const currentF1StepCheck = getF1FlowStep();
        const f1StepTypeCheck = currentF1StepCheck.step?.type;
        if (
          (f1StepTypeCheck === "P" || f1StepTypeCheck === "A") &&
          mechanism?.name !== "letterHunt"
        ) {
          console.log(
            "LetterHunt render - F1 step type is",
            f1StepTypeCheck,
            "but mechanism is",
            mechanism?.name,
            "- setting mechanism"
          );
          setMechanism({ id: "letterHunt", name: "letterHunt" });
        }
        const currentF1Step = getF1FlowStep();
        const f1StepType = currentF1Step.step?.type;
        console.log("LetterHunt render - F1 flow check:", {
          f1FlowIndexState,
          currentF1StepIndex: currentF1Step.index,
          f1StepType,
          mechanism: mechanism?.name,
          step: currentF1Step.step,
          hasStep: !!currentF1Step.step,
        });

        // If we don't have a valid step, show retry dialog
        if (!currentF1Step.step) {
          console.warn(
            "LetterHunt render - No F1 step found at index:",
            currentF1Step.index,
            "showing retry dialog"
          );
          if (!showRetryDialog) {
            setRetryDialogMessage(ui.PRACTICE_UNABLE_LOAD_F1_STEP_RETRY);
            setShowRetryDialog(true);
          }
          return null;
        }

        if (f1StepType === "L") {
          console.warn(
            "LetterHunt render blocked: F1 flow step type is 'L' (Learn) but mechanism is letterHunt. This is incorrect.",
            {
              f1FlowIndexState,
              currentF1Step: currentF1Step.step,
              mechanism,
            }
          );
          // Don't render LetterHunt if it's actually a Learn step
          // Return null to prevent rendering, but the mechanism should be corrected on next render
          return null;
        } else if (f1StepType === "P" || f1StepType === "A") {
          // Ensure mechanism is set correctly for F1 flow
          if (mechanism?.name !== "letterHunt") {
            console.log(
              "LetterHunt render - Setting mechanism to letterHunt for F1 step type:",
              f1StepType
            );
            setMechanism({ id: "letterHunt", name: "letterHunt" });
          }
          // Only proceed with LetterHunt rendering if step type is P or A
          // For F1 flow, use F1 config directly
          let currentGetContentForF1;
          // For F1 flow, use currentF1Step.index (from localStorage) instead of f1FlowIndexState
          // This ensures we always use the most up-to-date index
          const f1IndexToUse = currentF1Step.index;
          const lang = getLocalData("lang") || "en";
          const f1Config = levelGetContent[lang]?.["F1"];
          if (f1Config && Array.isArray(f1Config) && f1Config[f1IndexToUse]) {
            currentGetContentForF1 = f1Config[f1IndexToUse];
            console.log(
              "LetterHunt render - F1 config for index:",
              f1IndexToUse,
              "content:",
              currentGetContentForF1
            );
          } else {
            console.error(
              "LetterHunt render - F1 config not found for index:",
              f1IndexToUse,
              "f1FlowIndexState:",
              f1FlowIndexState,
              "f1Config length:",
              f1Config?.length
            );
            // Fallback to getCurrentContent if F1 config not found
            currentGetContentForF1 = getCurrentContent(
              progressData?.currentPracticeStep || 0
            );
          }

          // Add null check for currentGetContentForF1
          if (!currentGetContentForF1) {
            console.error(
              "LetterHunt render - currentGetContentForF1 is null/undefined for index:",
              f1IndexToUse
            );
            // Create a minimal config object for Apply steps
            if (f1StepType === "A") {
              const applyStepNum = currentF1Step.step?.step || 1;
              currentGetContentForF1 = {
                title: `A${applyStepNum}`,
                letterHuntLevel: 1,
                letterHuntEndLevel: 3,
                isShowcase: true,
                applyStep: applyStepNum,
                failRedirect:
                  applyStepNum === 1 ? "L1" : applyStepNum === 2 ? "L4" : "L7",
                passRedirect:
                  applyStepNum === 1 ? "L4" : applyStepNum === 2 ? "L7" : "F2",
              };
              console.log(
                "LetterHunt render - Created fallback config for Apply step:",
                currentGetContentForF1
              );
            } else {
              // For Practice steps, create minimal config
              const practiceStepNum = currentF1Step.step?.step || 1;
              currentGetContentForF1 = {
                title: `P${practiceStepNum}`,
                letterHuntLevel: 1,
                isShowcase: false,
              };
              console.log(
                "LetterHunt render - Created fallback config for Practice step:",
                currentGetContentForF1
              );
            }
          }

          const letterHuntLevel = currentGetContentForF1?.letterHuntLevel || 1;
          const letterHuntIsShowcase =
            currentGetContentForF1?.isShowcase || false; // Get isShowcase from config
          const letterHuntEndLevel = currentGetContentForF1?.letterHuntEndLevel; // Optional end level
          const letterHuntContentCount =
            currentGetContentForF1?.letterHuntContentCount || 10; // Content count per level
          const applyStep = currentGetContentForF1?.applyStep; // Apply step number (1, 2, or 3)
          const failRedirect = currentGetContentForF1?.failRedirect; // e.g., "L1", "L4", "L7"
          const passRedirect = currentGetContentForF1?.passRedirect; // e.g., "L4", "L7", "F2"
          const customLettersForF1 = currentGetContentForF1?.customLetters; // Extract customLetters from F1 config (can be words/syllables or letters)
          const confidentLettersFromConfig =
            currentGetContentForF1?.confidentLetters; // Extract confidentLetters from F1 config

          // Get confidentLetters from API response (stored in localStorage) with fallback to config
          // BUT: Only apply confidentLetters for Practice steps, NOT for Apply steps
          // Apply steps should use normal level-based letters/syllables
          let confidentLettersForF1 = undefined;
          if (f1StepType === "P") {
            // Only for Practice steps: use confidentLetters
            confidentLettersForF1 = confidentLettersFromConfig;
            try {
              const storedConfidentLetters =
                localStorage.getItem("confidentLetters");
              if (storedConfidentLetters) {
                const parsed = JSON.parse(storedConfidentLetters);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  confidentLettersForF1 = parsed;
                  console.log(
                    "✅ Using confidentLetters from API response (F1 Practice):",
                    confidentLettersForF1
                  );
                }
              }
            } catch (error) {
              console.warn(
                "Error reading confidentLetters from localStorage, using config:",
                error
              );
            }
          } else if (f1StepType === "A") {
            // For Apply steps: don't use confidentLetters (use normal level-based content)
            confidentLettersForF1 = undefined;
            console.log(
              "✅ F1 Apply step - confidentLetters disabled, using normal level-based letters/syllables"
            );
          }

          // For F1/F2/F3 flows, always use "B" as milestoneLevel
          const milestoneLevelValue = "B";
          // For showcase mode (Apply steps), we still need to pass startLevel and endLevel
          // For non-showcase mode, pass level to use default behavior
          // Use isShowcase from config (constants.js) - this is the source of truth
          // For Letter Hunt, questions are generated by LetterGame, so use letterHuntContentCount for steps
          // For showcase mode (Apply steps), calculate total steps: contentCount * endLevel
          // For non-showcase mode, use contentCount
          const letterHuntSteps =
            questions?.length > 0
              ? questions.length
              : letterHuntIsShowcase && letterHuntEndLevel
              ? letterHuntContentCount * letterHuntEndLevel
              : letterHuntContentCount || 10; // Ensure minimum of 10 if undefined

          console.log("LetterHunt render - F1 A2 config:", {
            f1IndexToUse,
            letterHuntLevel,
            letterHuntEndLevel,
            letterHuntContentCount,
            letterHuntIsShowcase,
            letterHuntSteps,
            currentGetContentForF1,
          });

          return (
            <LetterHuntMechanics
              page={page}
              setPage={setPage}
              isAlphabetDemoActive={isAlphabetDemoActive}
              {...{
                level: letterHuntIsShowcase
                  ? letterHuntLevel || 1
                  : letterHuntLevel, // For showcase, pass startLevel (1) for Apply steps; for non-showcase, pass the level
                header:
                  questions[currentQuestion]?.contentType === "image"
                    ? ui.PRACTICE_GUESS_IMAGE
                    : ui.PRACTICE_LETTER_RECOGNITION,
                points,
                steps: letterHuntSteps,
                currentStep: (currentQuestion || 0) + 1,
                progressData,
                showProgress: true,
                background: "#FFB31F",
                handleNext,
                handleBack: !letterHuntIsShowcase && handleBack,
                enableNext,
                setEnableNext,
                isShowCase: letterHuntIsShowcase, // Use isShowcase from config (constants.js)
                loading,
                setOpenMessageDialog,
                vocabCount,
                wordCount,
                showTimer: false,
                milestoneLevel: milestoneLevelValue,
                endLevel: letterHuntEndLevel, // Pass end level if specified in config
                startShowCase,
                setStartShowCase,
                setProgressData, // Pass setProgressData to update state when resetting to P1
                setCurrentQuestion, // Pass setCurrentQuestion to reset currentQuestion state when resetting to P1
                setPoints, // Pass setPoints to update UI when points are added
                applyStep, // Pass Apply step number
                failRedirect, // Pass fail redirect (e.g., "L1", "L4", "L7")
                passRedirect, // Pass pass redirect (e.g., "L4", "L7", "F2")
                isF1FlowActive, // Pass F1 flow active flag
                f1FlowStep, // Pass F1 flow step info
                isF2FlowActive, // Pass F2 flow active flag
                f2FlowStep, // Pass F2 flow step info
                customLetters: customLettersForF1, // Pass customLetters from F1 config
                confidentLetters: confidentLettersForF1, // Pass confidentLetters from F1 config
              }}
            />
          );
        } else {
          // F1 flow step type is neither L, P, nor A - this shouldn't happen
          console.error(
            "LetterHunt render - Unknown F1 step type:",
            f1StepType,
            "at index:",
            currentF1Step.index
          );
          return null;
        }
      } else {
        // For non-F1 flow, use getCurrentContent
        let currentGetContentForF1 = getCurrentContent(
          progressData?.currentPracticeStep || 0
        );

        const letterHuntLevel = currentGetContentForF1?.letterHuntLevel || 1;
        const letterHuntIsShowcase =
          currentGetContentForF1?.isShowcase || false;
        const letterHuntEndLevel = currentGetContentForF1?.letterHuntEndLevel;
        const applyStep = currentGetContentForF1?.applyStep;
        const failRedirect = currentGetContentForF1?.failRedirect;
        const passRedirect = currentGetContentForF1?.passRedirect;
        const customLettersForNonF1 = currentGetContentForF1?.customLetters; // Extract customLetters from config
        const milestoneLevelValue = level === "B" ? "B" : `m${level}`;

        return (
          <LetterHuntMechanics
            page={page}
            setPage={setPage}
            isAlphabetDemoActive={isAlphabetDemoActive}
            {...{
              level: letterHuntIsShowcase
                ? letterHuntLevel || 1
                : letterHuntLevel,
              header:
                questions[currentQuestion]?.contentType === "image"
                  ? ui.PRACTICE_GUESS_IMAGE
                  : ui.PRACTICE_LETTER_RECOGNITION,
              points,
              steps: questions?.length,
              currentStep: currentQuestion + 1,
              progressData,
              showProgress: true,
              background:
                isShowCase &&
                "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
              handleNext,
              handleBack: !letterHuntIsShowcase && handleBack,
              enableNext,
              setEnableNext,
              isShowCase: letterHuntIsShowcase,
              loading,
              setOpenMessageDialog,
              vocabCount,
              wordCount,
              showTimer: false,
              milestoneLevel: milestoneLevelValue,
              endLevel: letterHuntEndLevel,
              startShowCase,
              setStartShowCase,
              setProgressData,
              setCurrentQuestion,
              setPoints, // Pass setPoints to update UI when points are added
              applyStep,
              failRedirect,
              passRedirect,
              isF1FlowActive,
              f1FlowStep,
              isF2FlowActive,
              f2FlowStep,
              customLetters: customLettersForNonF1, // Pass customLetters from config
            }}
          />
        );
      }
    } else if (mechanism && mechanism.name === "memoryChallenge") {
      // Memory Challenge for F3 Apply steps
      if (isF3FlowActive && f3FlowStep?.step && milestoneLevel === "B") {
        const currentF3Step = getF3FlowStep();
        const lang = getLocalData("lang") || "en";
        const f3Config = levelGetContent[lang]?.["F3"];
        const f3IndexToUse = currentF3Step.index;
        const currentGetContentForF3 = f3Config?.[f3IndexToUse];

        if (!currentGetContentForF3) {
          return null;
        }

        const memoryChallengeLevel =
          currentGetContentForF3?.memoryChallengeLevel || 1;
        const memoryChallengeEndLevel =
          currentGetContentForF3?.memoryChallengeEndLevel || 3;
        const memoryChallengeContentCount =
          currentGetContentForF3?.memoryChallengeContentCount || 5;
        const readAloudContentCount =
          currentGetContentForF3?.readAloudContentCount;
        const applyStep = currentGetContentForF3?.applyStep;
        const failRedirect = currentGetContentForF3?.failRedirect;
        const passRedirect = currentGetContentForF3?.passRedirect;
        const isShowcase = currentGetContentForF3?.isShowcase || false;
        const milestoneLevelValue = level === "B" ? "B" : `m${level}`;
        const sessionId = getLocalData("sessionId");

        return (
          <MemoryChallengeMechanics
            page={page}
            setPage={setPage}
            level={memoryChallengeLevel}
            endLevel={memoryChallengeEndLevel}
            contentCount={memoryChallengeContentCount}
            sessionId={sessionId}
            handleNext={() => {
              // Check for redirect request first
              const f3FlowRedirect = getLocalData("f3FlowRedirect");
              if (f3FlowRedirect) {
                // Redirect is handled by Practice.jsx's handleNext
                if (handleNext) {
                  handleNext();
                }
                return;
              }

              // After Memory Challenge, check if we need Read Aloud
              if (readAloudContentCount && applyStep === 2) {
                // A2: Show Read Aloud after Memory Challenge
                setLocalData("f3ApplySubStep", "readAloud");
                setMechanism({ id: "readAloud", name: "readAloud" });
              } else {
                // A1: Complete after Memory Challenge
                setLocalData("f3ApplySubStep", null);
                if (handleNext) {
                  handleNext();
                }
              }
            }}
            handleBack={handleBack}
            applyStep={applyStep}
            failRedirect={failRedirect}
            passRedirect={passRedirect}
            isF3FlowActive={isF3FlowActive}
            f3FlowStep={currentF3Step}
            isShowCase={isShowcase}
            header={ui.PRACTICE_MEMORY_CHALLENGE}
            points={points}
            steps={memoryChallengeContentCount}
            currentStep={1}
            progressData={progressData}
            showProgress={true}
            background="#FFB31F"
            enableNext={enableNext}
            setEnableNext={setEnableNext}
            loading={loading}
            setOpenMessageDialog={setOpenMessageDialog}
            vocabCount={vocabCount}
            wordCount={wordCount}
            showTimer={false}
            milestoneLevel={milestoneLevelValue}
            setProgressData={setProgressData}
            setCurrentQuestion={setCurrentQuestion}
          />
        );
      }
    } else if (mechanism && mechanism.name === "AnouncementFlow") {
      return (
        <AnouncementFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
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
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "PhrasesInAction") {
      return (
        <PhrasesInAction
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: questions[currentQuestion]?.contentSourceData?.[0],
            parentWords: questions[currentQuestion]?.mechanics_data?.[0],
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            multilingual: questions[currentQuestion]?.multilingual,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase: true,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (mechanism && mechanism.name === "McqFlow") {
      return (
        <McqFlow
          page={page}
          setPage={setPage}
          {...{
            level: level,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : ui.PRACTICE_SPEAK_WORD,
            //
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            // image: elephant,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase: true,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (
      (mechanism && mechanism.name === "audio") ||
      (mechanism && mechanism.name === "fillInTheBlank" && mechanism.id === "")
    ) {
      return (
        <Mechanics6
          page={page}
          setPage={setPage}
          {...{
            level: !isShowCase && level,
            header:
              mechanism.name === "fillInTheBlank"
                ? ui.PRACTICE_FILL_IN_THE_BLANK
                : questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : `${ui.PRACTICE_SPEAK_BELOW} ${questions[currentQuestion]?.contentType}`,
            parentWords:
              questions[currentQuestion]?.contentSourceData?.[0]?.text,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            type: mechanism.name,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            image: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_images/` +
                questions[currentQuestion]?.mechanics_data[0]?.image_url
              : null,
            audio: questions[currentQuestion]?.mechanics_data
              ? `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/` +
                questions[currentQuestion]?.mechanics_data[0]?.audio_url
              : null,
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            allWords:
              questions?.map((elem) => elem?.contentSourceData?.[0]?.text) ||
              [],
            loading,
            setOpenMessageDialog,
            options: questions[currentQuestion]?.mechanics_data
              ? questions[currentQuestion]?.mechanics_data[0]?.options
              : [],
            isNextButtonCalled,
            setIsNextButtonCalled,
            vocabCount,
            wordCount,
          }}
        />
      );
    } else if (page === 1) {
      return <Mechanics2 page={page} setPage={setPage} />;
    }

    // Fallback: If no conditions match, show loading or default to WordsOrImage
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    // Default fallback - render WordsOrImage if questions are available
    if (questions && questions.length > 0 && questions[currentQuestion]) {
      return (
        <WordsOrImage
          {...{
            level: level,
            audioLink: `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/all-audio-files/${lang}/${questions[currentQuestion]?.contentId}.wav`,
            mechanism_id: mechanism?.id,
            header:
              questions[currentQuestion]?.contentType === "image"
                ? ui.PRACTICE_GUESS_IMAGE
                : `${ui.PRACTICE_SPEAK_BELOW} ${questions[currentQuestion]?.contentType}`,
            words: questions[currentQuestion]?.contentSourceData?.[0]?.text,
            currentImg: currentImage,
            parentWords: parentWords,
            contentType: currentContentType,
            contentId: questions[currentQuestion]?.contentId,
            setVoiceText,
            setRecordedAudio,
            setVoiceAnimate,
            storyLine,
            handleNext,
            type: "word",
            enableNext,
            showTimer: false,
            points,
            steps: questions?.length,
            currentStep: currentQuestion + 1,
            progressData,
            showProgress: true,
            background:
              isShowCase &&
              "linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)",
            playTeacherAudio,
            callUpdateLearner: isShowCase,
            disableScreen,
            isShowCase,
            handleBack: !isShowCase && handleBack,
            setEnableNext,
            loading,
            setOpenMessageDialog,
            vocabCount,
            wordCount,
          }}
        />
      );
    }

    // Final fallback - return null if nothing can be rendered
    return null;
  };

  // Show a friendly error card when the initial data fetch fails (API down / timeout).
  // Offers a retry so the user can recover without a full page reload.
  if (fetchError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 2,
          px: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: "Quicksand", fontWeight: 700, color: "#555" }}
        >
          Could not load your practice session.
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Quicksand", color: "#888", maxWidth: 360 }}
        >
          The server is unreachable right now. Check your connection and try
          again.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setFetchError(false);
            setLoading(true);
            fetchDetails();
          }}
          sx={{
            mt: 1,
            background: "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
            color: "white",
            fontFamily: "Quicksand",
            fontWeight: 700,
            borderRadius: "25px",
            textTransform: "none",
            px: 4,
            py: 1.5,
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

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
      {showRetryDialog && (
        <RetryDialog
          message={retryDialogMessage}
          onRetry={() => {
            setShowRetryDialog(false);
            setRetryDialogMessage("");
            // Redirect to discover-start route
            navigate("/discover-start", { replace: true });
          }}
          onClose={() => {
            setShowRetryDialog(false);
            setRetryDialogMessage("");
          }}
        />
      )}
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        {renderMechanics()}
      </Suspense>
    </>
  );
};

export default Practice;
