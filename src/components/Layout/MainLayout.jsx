import {
  Box,
  Card,
  CardContent,
  Typography,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import practicebgstone from "../../assets/images/practice-bg-stone.svg";
import practicebgstone2 from "../../assets/images/practice-bg-stone2.svg";
import practicebgstone3 from "../../assets/images/practice-bg-stone3.svg";
import practicebg from "../../assets/images/practice-bg.svg";
import practicebg2 from "../../assets/images/practice-bg2.svg";
import practicebg3 from "../../assets/images/practice-bg3.svg";
import gameWon from "../../assets/images/gameWon.svg";
import clouds from "../../assets/images/clouds.svg";
import catLoading from "../../assets/images/catLoading.gif";
import towreLoading from "../../assets/images/loaderGif.gif";
import textureImage from "../../assets/images/textureImage.png";
import timer from "../../assets/images/timer.svg";
import playButton from "../../assets/listen.png";
import pauseButton from "../../assets/pause.png";
import {
  NextButton,
  callConfettiSnow,
  levelConfig,
  practiceSteps,
  getLocalData,
  setLocalData,
} from "../../utils/constants";
import { lazy, Suspense } from "react";
import { GreenTick, HeartBlack, Diamond } from "../Icons/SvgIcons";
import { levelGetContent } from "../../data/levelContent";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { ProfileHeader } from "../Assesment/Assesment";
import Confetti from "react-confetti";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import gameLoseAudio from "../../assets/audio/gameLose.wav";
import * as Assets from "../../utils/imageAudioLinks";
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { levelMapping } from "../../utils/levelData";
import { jwtDecode } from "jwt-decode";
import F1Image from "../../assets/F1.png";
import F2Image from "../../assets/F2.png";
import F3Image from "../../assets/F3.png";
import zIndex from "@mui/material/styles/zIndex";
import { Log } from "../../services/telemetryService";
import { getF1FlowStep, F1_FLOW } from "../../RFlow/F1";
import { getF2FlowStep, F2_FLOW } from "../../RFlow/F2";
import { getF3FlowStep, F3_FLOW } from "../../RFlow/F3";
import { getUiStrings } from "../../constants/strings";

// Level milestone SVGs are lazy-loaded — only downloaded when a level-complete screen renders
const LevelMilestone = lazy(() => import("../LevelIcons/LevelMilestone"));

const theme = createTheme();

const MainLayout = (props) => {
  // console.log("MainLayout props:", props);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const levelsImages = {
    B: {
      milestone: <img src={F1Image} alt="F1" height={isMobile ? 120 : 168} />,
      backgroundAddOn: practicebgstone,
      background: practicebg,
      backgroundColor: `#FFB31F`,
    },
    1: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={1} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone,
      background: practicebg,
    },
    2: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={2} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone2,
      background: practicebg2,
    },
    3: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={3} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
    },
    4: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={4} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone,
      background: practicebg3,
      backgroundColor: `${levelConfig[4].color}60`,
    },
    5: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={5} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[5].color}60`,
    },
    6: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={6} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[6].color}60`,
    },
    7: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={7} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[7].color}60`,
    },
    8: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={8} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[8].color}60`,
    },
    9: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={9} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    10: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={10} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    11: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={11} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    12: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={12} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    13: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={13} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    14: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={14} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
    15: {
      milestone: (
        <Suspense fallback={null}>
          <LevelMilestone level={15} isMobile={isMobile} />
        </Suspense>
      ),
      backgroundAddOn: practicebgstone3,
      background: practicebg3,
      backgroundColor: `${levelConfig[9].color}60`,
    },
  };
  const hasTriggeredDemoRef = useRef(false);
  const rFlow = String(getLocalData("rFlow"));
  const rStep = getLocalData("rStepZero");
  const tFlow = String(getLocalData("tFlow"));
  const mFlow = getLocalData("mFail");
  const allCompleted = getLocalData("allCompleted");

  // Get milestone_level from API to determine if F1 flow should be active
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

  // F1 flow is triggered when milestone_level is "B" and sub_milestone_level is "F1"
  const shouldShowF1 = milestoneLevel === "B" && subMilestoneLevel === "F1";
  // F2 flow is triggered when milestone_level is "B" and sub_milestone_level is "F2"
  const shouldShowF2 = milestoneLevel === "B" && subMilestoneLevel === "F2";
  // F3 flow is triggered when milestone_level is "B" and sub_milestone_level is "F3"
  const shouldShowF3 = milestoneLevel === "B" && subMilestoneLevel === "F3";

  // Check if F1 flow is active
  const f1FlowStep = getF1FlowStep();
  const isF1FlowActive = shouldShowF1 && f1FlowStep.step !== null;

  // Check if F2 flow is active
  const f2FlowStep = getF2FlowStep();
  const isF2FlowActive = shouldShowF2 && f2FlowStep.step !== null;

  // Check if F3 flow is active
  const f3FlowStep = getF3FlowStep();
  const isF3FlowActive = shouldShowF3 && f3FlowStep.step !== null;

  // console.log("rStep", rStep);

  let LEVEL = props?.level;

  // If milestone level is "m1", "m2", etc., extract the number for image lookup
  // This ensures we show the correct milestone level image instead of F flow images
  // Priority: milestone level > props.level
  if (
    milestoneLevel &&
    typeof milestoneLevel === "string" &&
    milestoneLevel.startsWith("m")
  ) {
    const milestoneNumber = parseInt(milestoneLevel.substring(1), 10);
    if (!isNaN(milestoneNumber)) {
      LEVEL = milestoneNumber;
    }
  } else if (milestoneLevel && milestoneLevel !== "B") {
    // If milestone level is not "B" and not "m1", "m2", etc., try to extract number anyway
    // This handles cases where milestone level might be just a number string
    const milestoneNumber = parseInt(milestoneLevel, 10);
    if (!isNaN(milestoneNumber)) {
      LEVEL = milestoneNumber;
    }
  }

  // Use F2 step names if F2 flow is active, otherwise F1, otherwise props flowNames
  // flowNames should be ["L1", "P1", "L2", "P2", "L3", "P3", "A1", ...] for F1/F2 flow
  const getF1FlowNames = () => {
    if (!isF1FlowActive) return null;
    return F1_FLOW.map((flowStep) => {
      if (flowStep.type === "L") {
        return `L${flowStep.step}`;
      } else if (flowStep.type === "P") {
        return `P${flowStep.step}`;
      } else if (flowStep.type === "A") {
        return `A${flowStep.step}`;
      }
      return "";
    });
  };

  const getF2FlowNames = () => {
    if (!isF2FlowActive) return null;
    return F2_FLOW.map((flowStep) => {
      if (flowStep.type === "L") {
        return `L${flowStep.step}`;
      } else if (flowStep.type === "P") {
        return `P${flowStep.step}`;
      } else if (flowStep.type === "A") {
        return `A${flowStep.step}`;
      }
      return "";
    });
  };

  const getF3FlowNames = () => {
    if (!isF3FlowActive) return null;
    return F3_FLOW.map((flowStep) => {
      if (flowStep.type === "L") {
        return `L${flowStep.step}`;
      } else if (flowStep.type === "P") {
        return `P${flowStep.step}`;
      } else if (flowStep.type === "A") {
        return `A${flowStep.step}`;
      }
      return "";
    });
  };

  let flowNames = isF3FlowActive
    ? getF3FlowNames() || props?.flowNames
    : isF2FlowActive
    ? getF2FlowNames() || props?.flowNames
    : isF1FlowActive
    ? getF1FlowNames() || props?.flowNames
    : props?.flowNames;

  // For F3 flow, set activeFlow based on current F3 step
  // For F2 flow, set activeFlow based on current F2 step
  // For F1 flow, set activeFlow based on current F1 step
  // activeFlow should be P1, P2, A1, etc. based on F3_FLOW, F2_FLOW, or F1_FLOW
  let activeFlow = props?.activeFlow;
  if (isF3FlowActive && f3FlowStep.step) {
    const currentFlowStep = F3_FLOW[f3FlowStep.index];
    if (currentFlowStep) {
      if (currentFlowStep.type === "P") {
        activeFlow = `P${currentFlowStep.step}`; // P1, P2, P3, etc.
      } else if (currentFlowStep.type === "A") {
        activeFlow = `A${currentFlowStep.step}`; // A1, A2
      }
    }
  } else if (isF2FlowActive && f2FlowStep.step) {
    const currentFlowStep = F2_FLOW[f2FlowStep.index];
    if (currentFlowStep) {
      if (currentFlowStep.type === "L") {
        activeFlow = `L${currentFlowStep.step}`; // L1, L2, L3, etc.
      } else if (currentFlowStep.type === "P") {
        activeFlow = `P${currentFlowStep.step}`; // P1, P2, P3, etc.
      } else if (currentFlowStep.type === "A") {
        activeFlow = `A${currentFlowStep.step}`; // A1, A2, A3
      }
    }
  } else if (isF1FlowActive && f1FlowStep.step) {
    const currentFlowStep = F1_FLOW[f1FlowStep.index];
    if (currentFlowStep) {
      if (currentFlowStep.type === "L") {
        activeFlow = `L${currentFlowStep.step}`; // L1, L2, L3, etc.
      } else if (currentFlowStep.type === "P") {
        activeFlow = `P${currentFlowStep.step}`; // P1, P2, P3, etc.
      } else if (currentFlowStep.type === "A") {
        activeFlow = `A${currentFlowStep.step}`; // A1, A2, A3
      }
    }
  }

  const virtualId = String(getLocalData("virtualId"));

  if (levelMapping[virtualId] !== undefined) {
    LEVEL = levelMapping[virtualId];
  } else {
    const token = getLocalData("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const emisUsername = String(decoded.emis_username);

        if (levelMapping[emisUsername] !== undefined) {
          LEVEL = levelMapping[emisUsername];
        }
      } catch (error) {
        console.error("Error decoding JWT token:", error);
      }
    }
  }

  //console.log("Assigned LEVEL:", LEVEL, props.rStep);

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
    isRecordingComplete,
    answer,
    isCorrect,
    vocabCount,
    wordCount,
    showMilestone = true,
  } = props;

  const [shake, setShake] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const audioRefs = useRef([]);

  const language = getLocalData("lang");
  const ui = getUiStrings(language);

  //console.log("levelss", LEVEL, livesData);

  // useEffect(() => {
  //   if (language !== "en") {
  //     setLocalData("rFlow", false);
  //   }
  // }, [language]);

  const handleAudioPlay = (index) => {
    const audioElem = audioRefs.current[index];

    if (!audioElem) {
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

  const [audioCache, setAudioCache] = useState({});

  useEffect(() => {
    const preloadAudio = async () => {
      try {
        const urls = [LevelCompleteAudio, gameLoseAudio];
        const cache = {};

        for (const url of urls) {
          const response = await fetch(url);
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          cache[url] = audioUrl;
        }

        setAudioCache(cache);
      } catch (error) {
        console.error("Error preloading audio:", error);
      }
    };

    preloadAudio();

    return () => {
      Object.values(audioCache).forEach((audioUrl) =>
        URL.revokeObjectURL(audioUrl)
      );
    };
  }, []);

  //console.log("isCo", isCorrect);

  useEffect(() => {
    if (isRecordingComplete && answer && isCorrect) {
      callConfettiSnow();
    }
  }, []);

  useEffect(() => {
    if (isShowCase && gameOverData) {
      setShake(gameOverData.userWon ?? true);

      let audioSrc;
      if (gameOverData) {
        audioSrc = gameOverData.userWon
          ? audioCache[LevelCompleteAudio]
          : audioCache[gameLoseAudio];
      } else {
        audioSrc = audioCache[LevelCompleteAudio];
      }

      if (audioSrc) {
        const audio = new Audio(audioSrc);
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });

        if (!gameOverData?.userWon) {
          callConfettiSnow();
        }
      }

      const shakeTimeout = setTimeout(() => {
        setShake(false);
      }, 4000);

      return () => {
        clearTimeout(shakeTimeout);
      };
    }
  }, [startShowCase, isShowCase, gameOverData, audioCache]);
  // console.log(" MainLayout gameOverData", gameOverData);
  // console.log(" MainLayout gameOverData userWon", gameOverData?.userWon);
  // console.log(" MainLayout LEVEL", LEVEL);
  // console.log(" MainLayout progressData", props);
  // console.log(
  //   " MainLayout progressData prop",
  //   props?.progressData?.currentPracticeStep
  // );

  useEffect(() => {
    if (hasTriggeredDemoRef.current) return;

    // ❌ wait until gameOverData is available
    if (!gameOverData) return;

    const userDidNotWin = gameOverData.userWon !== true;
    const isValidLevel = [1, 2, 3].includes(LEVEL);

    // Determine if demo should trigger based on flow type:
    // - F1 flow active: only trigger for L1 (index 0) — the only IMMEDIATE milestone
    //   A1/A2/A3 are DEFERRED and only trigger from Start Game button click
    // - Non-F1 flow (regular): trigger when user fails at S2 (step 9)
    let shouldTrigger = false;
    if (isF1FlowActive) {
      const immediateMilestones = [0]; // Only L1
      const currentF1Index = Number(getLocalData("f1FlowIndex") || -1);
      shouldTrigger = immediateMilestones.includes(currentF1Index);
    } else {
      // Regular flow: S2 fail scenario (step 9)
      const isStepNine = props?.progressData?.currentPracticeStep === 9;
      shouldTrigger = isStepNine;
    }

    if (userDidNotWin && isValidLevel && shouldTrigger) {
      hasTriggeredDemoRef.current = true;

      setLocalData("showAlphabetDemo", "true");
      // console.log("Triggering alphabet demo");

      window.dispatchEvent(new Event("alphabetDemoComplete"));
    }
  }, [
    gameOverData,
    LEVEL,
    props?.progressData?.currentPracticeStep,
    isF1FlowActive,
  ]);

  let currentPracticeStep = progressData?.currentPracticeStep;
  // For F1/F2/F3 flow, use the flow index instead of currentPracticeStep
  if (isF3FlowActive && f3FlowStep.index !== undefined) {
    currentPracticeStep = f3FlowStep.index;
  } else if (isF2FlowActive && f2FlowStep.index !== undefined) {
    currentPracticeStep = f2FlowStep.index;
  } else if (isF1FlowActive && f1FlowStep.index !== undefined) {
    currentPracticeStep = f1FlowStep.index;
  }
  const [currentPageStart, setCurrentPageStart] = useState(0);
  const prevActiveFlow = useRef(null);

  // State for progress bar pagination (dynamic steps based on width)
  const [progressBarStartIndex, setProgressBarStartIndex] = useState(0);
  const progressBarContainerRef = useRef(null);
  const progressBarParentRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate how many steps can fit based on available width
  // This is calculated dynamically based on actual container width
  const calculateVisibleSteps = useMemo(() => {
    if (containerWidth === 0) return 5; // Default to 5 if width not measured yet

    let stepWidth = 40;
    let stepMargin = 12;
    let containerPadding = 32;
    let buttonWidth = 56;

    if (isMobile) {
      stepWidth = 28;
      stepMargin = 4;
      containerPadding = 16;
      buttonWidth = 24;
    } else if (isTablet) {
      stepWidth = 32;
      stepMargin = 8;
      containerPadding = 24;
      buttonWidth = 48;
    }
    const buttonGap = isMobile ? 8 : 12; // Gap between button and container

    // Account for left and right margins (180px mobile, 200px tablet, 220px desktop)
    const leftMargin = isMobile ? 180 : isTablet ? 200 : 220;
    const rightMargin = isMobile ? 180 : isTablet ? 200 : 220;

    // The containerWidth is the width of the progress bar container (after margins)
    // But we need to calculate based on the actual available space
    // Available width = containerWidth (which already accounts for margins) - padding - button space
    const reservedForButtons = buttonWidth * 2 + buttonGap * 2;

    // Available width for steps = container width - padding - reserved button space
    const availableWidth =
      containerWidth - containerPadding - reservedForButtons;

    // Calculate how many steps can fit: (availableWidth + stepMargin) / (stepWidth + stepMargin)
    // We add stepMargin to availableWidth because the first step doesn't have left margin
    const stepsThatFit = Math.floor(
      (availableWidth + stepMargin) / (stepWidth + stepMargin)
    );

    // Be more generous - if we have space, use it!
    // Minimum 5 steps, maximum 25 steps (very wide screens)
    const calculatedSteps = isMobile
      ? 5
      : Math.max(5, Math.min(stepsThatFit, 25));

    return calculatedSteps;
  }, [containerWidth, isMobile, isTablet]);

  const VISIBLE_STEPS = calculateVisibleSteps;

  // Get F1 steps for progress bar when F1 flow is active
  // Labels should be: L1, P1, L2, P2, L3, P3, A1, L4, P4, etc.
  const getF1PracticeSteps = () => {
    if (!isF1FlowActive) return null;
    // Use F1_FLOW to generate labels based on type and step number
    return F1_FLOW.map((flowStep, index) => {
      let label = "";
      if (flowStep.type === "L") {
        label = `L${flowStep.step}`; // Learn: L1, L2, L3, etc.
      } else if (flowStep.type === "P") {
        label = `P${flowStep.step}`; // Practice: P1, P2, P3, etc.
      } else if (flowStep.type === "A") {
        label = `A${flowStep.step}`; // Apply: A1, A2, A3
      }
      return {
        name: label,
        title: label,
        titleNew: label,
        titleThree: label,
      };
    });
  };

  const getF2PracticeSteps = () => {
    if (!isF2FlowActive) return null;
    // Use F2_FLOW to generate labels based on type and step number
    return F2_FLOW.map((flowStep, index) => {
      let label = "";
      if (flowStep.type === "L") {
        label = `L${flowStep.step}`; // Learn: L1, L2, L3, etc.
      } else if (flowStep.type === "P") {
        label = `P${flowStep.step}`; // Practice: P1, P2, P3, etc.
      } else if (flowStep.type === "A") {
        label = `A${flowStep.step}`; // Apply: A1, A2, A3
      }
      return {
        name: label,
        title: label,
        titleNew: label,
        titleThree: label,
      };
    });
  };

  const getF3PracticeSteps = () => {
    if (!isF3FlowActive) return null;
    // Use F3_FLOW to generate labels based on type and step number
    return F3_FLOW.map((flowStep, index) => {
      let label = "";
      if (flowStep.type === "L") {
        label = `L${flowStep.step}`; // Learn: L1, L2, L3, etc.
      } else if (flowStep.type === "P") {
        label = `P${flowStep.step}`; // Practice: P1, P2, P3, etc.
      } else if (flowStep.type === "A") {
        label = `A${flowStep.step}`; // Apply: A1, A2
      }
      return {
        name: label,
        title: label,
        titleNew: label,
        titleThree: label,
      };
    });
  };

  // Use F3 steps if F3 flow is active, otherwise F2 steps, otherwise F1 steps, otherwise regular practiceSteps
  const displayPracticeSteps = isF3FlowActive
    ? getF3PracticeSteps() || practiceSteps
    : isF2FlowActive
    ? getF2PracticeSteps() || practiceSteps
    : isF1FlowActive
    ? getF1PracticeSteps() || practiceSteps
    : practiceSteps;

  // Calculate visible steps range (show dynamic steps based on width, ensure current step is visible)
  const totalSteps = displayPracticeSteps?.length || 0;

  // Calculate visible range ensuring current step is always visible
  const calculateVisibleRange = () => {
    if (totalSteps <= VISIBLE_STEPS) {
      // If total steps <= 5, show all
      return { start: 0, end: totalSteps };
    }

    // Ensure current step is always visible
    let start = progressBarStartIndex;
    let end = Math.min(start + VISIBLE_STEPS, totalSteps);

    // If current step is not in visible range, adjust to include it (Desktop only, disabled on mobile to allow manual navigation)
    if (!isMobile) {
      if (currentPracticeStep < start) {
        start = Math.max(0, currentPracticeStep - 2); // Show 2 steps before current
        end = Math.min(start + VISIBLE_STEPS, totalSteps);
      } else if (currentPracticeStep >= end) {
        end = Math.min(currentPracticeStep + 3, totalSteps); // Show 2 steps after current
        start = Math.max(0, end - VISIBLE_STEPS);
      }
    }

    return { start, end };
  };

  const visibleRange = calculateVisibleRange();
  const visibleSteps =
    displayPracticeSteps?.slice(visibleRange.start, visibleRange.end) || [];
  const canGoPrev = visibleRange.start > 0;
  const canGoNext = visibleRange.end < totalSteps;

  // Measure container width on mount, resize, and when dependencies change
  useEffect(() => {
    if (!showProgress) return;

    const measureWidth = () => {
      // Measure the parent container width (before margins are applied)
      if (progressBarParentRef.current) {
        requestAnimationFrame(() => {
          if (progressBarParentRef.current) {
            const parentWidth = progressBarParentRef.current.offsetWidth;
            // Account for margins: subtract left and right margins
            const leftMargin = isMobile ? 180 : isTablet ? 200 : 220;
            const rightMargin = isMobile ? 180 : isTablet ? 200 : 220;
            const actualWidth = parentWidth - leftMargin - rightMargin;

            if (actualWidth > 0) {
              setContainerWidth(actualWidth);
            }
          }
        });
      } else if (progressBarContainerRef.current) {
        // Fallback: measure the container itself
        requestAnimationFrame(() => {
          if (progressBarContainerRef.current) {
            const width = progressBarContainerRef.current.offsetWidth;
            if (width > 0) {
              setContainerWidth(width);
            }
          }
        });
      }
    };

    // Measure after a short delay to ensure layout is complete
    const timeoutId = setTimeout(measureWidth, 200);

    // Measure on window resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(measureWidth, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    showProgress,
    milestoneLevel,
    isF1FlowActive,
    isF2FlowActive,
    isF3FlowActive,
  ]);

  // Also measure when the container ref becomes available using ResizeObserver
  useEffect(() => {
    if (!showProgress || !progressBarContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setContainerWidth(width);
        }
      }
    });

    observer.observe(progressBarContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [showProgress]);

  // Update progress bar start index when current step changes to keep it visible
  useEffect(() => {
    if (totalSteps <= VISIBLE_STEPS) {
      setProgressBarStartIndex(0);
      return;
    }

    // Calculate if current step is in the current visible range
    const currentStart = progressBarStartIndex;
    const currentEnd = Math.min(currentStart + VISIBLE_STEPS, totalSteps);

    // If current step is outside visible range, adjust to center it
    if (
      currentPracticeStep < currentStart ||
      currentPracticeStep >= currentEnd
    ) {
      // Center current step: show 2 before and 2 after (or adjust if near edges)
      let newStart;
      if (currentPracticeStep < 2) {
        newStart = 0;
      } else if (currentPracticeStep >= totalSteps - 2) {
        newStart = Math.max(0, totalSteps - VISIBLE_STEPS);
      } else {
        newStart = Math.max(0, currentPracticeStep - 2);
      }
      setProgressBarStartIndex(newStart);
    }
  }, [currentPracticeStep, totalSteps, VISIBLE_STEPS]);

  const handleProgressBarPrev = () => {
    const newStart = Math.max(0, progressBarStartIndex - VISIBLE_STEPS);
    setProgressBarStartIndex(newStart);
  };

  const handleProgressBarNext = () => {
    const newStart = Math.min(
      totalSteps - VISIBLE_STEPS,
      progressBarStartIndex + VISIBLE_STEPS
    );
    setProgressBarStartIndex(newStart);
  };

  useEffect(() => {
    if (!flowNames || !activeFlow) return;

    const activeIndex = flowNames.indexOf(activeFlow);
    if (activeIndex === -1) return;

    const currentPageEnd = currentPageStart + 9;

    if (activeIndex > currentPageEnd && activeFlow !== prevActiveFlow.current) {
      const newPageStart = Math.floor(activeIndex / 10) * 10;
      setCurrentPageStart(newPageStart);
    }

    prevActiveFlow.current = activeFlow;
  }, [activeFlow, flowNames]);

  const handleNext1 = () => {
    if (!flowNames) return;
    const newStart = Math.min(flowNames.length - 10, currentPageStart + 10);
    setCurrentPageStart(newStart);
  };

  const handlePrev = () => {
    const newStart = Math.max(0, currentPageStart - 10);
    setCurrentPageStart(newStart);
  };
  const sectionStyle = {
    width: "100%",
    backgroundImage: `url(${
      backgroundImage ? backgroundImage : levelsImages?.[LEVEL]?.background
    })`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    minHeight: { xs: "100dvh", md: "100vh" },
    height: { xs: "100dvh", md: "auto" },
    maxHeight: { xs: "100dvh", md: "none" },
    overflow: { xs: "hidden", md: "visible" },
    display: "flex",
    paddingTop: { md: "0px", xs: "60px" },
    justifyContent: "center",
    alignItems: { xs: "flex-start", md: "center" },
    boxSizing: "border-box",
    background: props?.background || levelsImages?.[LEVEL]?.backgroundColor,
    position: "relative",
    "& > div:first-of-type": {
      background: {
        xs: "transparent!important",
        sm: "rgba(255, 255, 255, 0.2)!important",
      },
      backdropFilter: { xs: "none!important", sm: "blur(3px)!important" },
    },
  };

  const steps = props.steps;
  // console.log("steps:", steps);

  const currentStep = props.currentStep;
  // console.log("currentStep:", currentStep);

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

  const fFlowWrapperStyle = {
    height: isMobile ? "80px" : "150px",
    width: isMobile ? "80px" : "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Box sx={sectionStyle}>
      <ProfileHeader
        {...{
          level: LEVEL,
          setOpenLangModal,
          lang: language,
          points,
          handleBack,
          vocabCount,
          wordCount,
        }}
      />

      {!!LEVEL && !props.loading && (
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
      <Box sx={{ position: "absolute", top: "15px", right: "80px" }}></Box>
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
          {tFlow === "true" ? (
            <Box textAlign="center">
              <img
                src={towreLoading}
                alt="catLoading"
                height={200}
                style={{
                  display: "block",
                  margin: "0 auto",
                  marginBottom: "2px",
                }}
              />
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  marginBottom: "5px",
                  fontFamily: "Quicksand",
                  color: "#333F61",
                }}
              >
                {ui.LOADING_GAME}
              </p>
            </Box>
          ) : (
            <Box>
              <img src={catLoading} alt="catLoading" />
            </Box>
          )}
        </Card>
      ) : (
        <>
          {(!isShowCase || (isShowCase && startShowCase)) &&
            !gameOverData &&
            !allCompleted && (
              <Card
                sx={{
                  position: "relative",
                  left: { xs: "auto", md: "auto" },
                  width: { xs: "calc(100% - 20px)", md: "85vw" },
                  mx: { xs: "auto", md: "auto" },
                  minHeight: { xs: "unset", md: "80vh" },
                  height: { xs: "calc(100dvh - 80px)", md: "auto" },
                  maxHeight: {
                    xs: "calc(100dvh - 80px)",
                    md: "none",
                  },
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundImage: `url(${cardBackground || textureImage})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
                  backdropFilter: "blur(25px)",
                  mt: { xs: "0px", md: "min(75px, 8vh)" },
                  mb: { xs: "20px", md: "0px" },
                  overflow: { sm: "hidden", xs: "hidden" },
                }}
              >
                <Box>
                  {isRecordingComplete && answer && isCorrect && (
                    <Confetti width={width} height={"600px"} />
                  )}
                </Box>
                <CardContent
                  sx={{
                    minHeight: 0,
                    height: props.cardContentStyle?.height || {
                      xs: "100%",
                      md: "auto",
                    },
                    maxHeight: props.cardContentStyle
                      ? props.cardContentStyle.maxHeight || {
                          xs: "calc(100dvh - 160px)",
                          md: "calc(100vh - 260px)",
                        }
                      : {
                          xs: "calc(100dvh - 160px)",
                          md: "none",
                        },
                    display: { xs: "flex", md: "block" },
                    flexDirection: { xs: "column", md: "initial" },
                    justifyContent: { xs: "center", md: "initial" },
                    alignItems: { xs: "center", md: "initial" },
                    flexGrow: 1,
                    overflowY: "hidden",
                    opacity: disableScreen ? 0.25 : 1,
                    pointerEvents: disableScreen ? "none" : "initial",
                    padding: { xs: "16px !important", md: "24px !important" },
                    boxSizing: "border-box",
                    ...props.cardContentStyle,
                  }}
                >
                  {showTimer && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: { xs: "8px", sm: "16px" },
                        left: { xs: "8px", sm: "16px" },
                        zIndex: 10,
                      }}
                    >
                      <img
                        src={timer}
                        alt="timer"
                        style={{
                          height: isMobile ? "36px" : "58px",
                          width: isMobile ? "36px" : "58px",
                        }}
                      />
                    </Box>
                  )}
                  {props.children}
                </CardContent>
                {showMilestone &&
                  steps > 0 &&
                  tFlow !== "true" &&
                  !isF1FlowActive &&
                  !isF2FlowActive &&
                  !isF3FlowActive && (
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
                      top={isMobile ? 10 : 20}
                      left={isMobile ? "initial" : 20}
                      right={isMobile ? 10 : "initial"}
                      justifyContent={"center"}
                      sx={{
                        display: isMobile ? "flex" : "block",
                        flexDirection: isMobile ? "column" : "initial",
                        alignItems: isMobile ? "flex-end" : "initial",
                      }}
                    >
                      <Box display={"flex"} gap={isMobile ? "3px" : "5px"}>
                        {[
                          ...Array(Math.max(0, redLivesToShow) || 0).keys(),
                        ]?.map((elem) => (
                          <Diamond
                            key={`red-live-${elem}`}
                            height={isMobile ? "25px" : "50px"}
                            width={isMobile ? "25px" : "50px"}
                            style={{ flexShrink: 0 }}
                          />
                        ))}

                        {[
                          ...Array(Math.max(0, blackLivesToShow) || 0).keys(),
                        ]?.map((elem) => (
                          <HeartBlack
                            key={`black-live-${elem}`}
                            height={isMobile ? "25px" : "50px"}
                            width={isMobile ? "25px" : "50px"}
                            style={{ flexShrink: 0 }}
                          />
                        ))}
                      </Box>
                      {redLivesToShow != null && (
                        <span
                          style={{
                            marginLeft: "5px",
                            color: "#000000",
                            fontWeight: 700,
                            fontSize: isMobile ? "14px" : "24px",
                            lineHeight: isMobile ? "18px" : "30px",
                            fontFamily: "Quicksand",
                          }}
                        >
                          {`You have ${redLivesToShow} lives`}
                        </span>
                      )}
                    </Box>
                  )}
                <Box
                  sx={{
                    height: { xs: "80px", sm: "110px" },
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      left: { xs: "-10px", sm: 0 },
                      bottom: { xs: "2px", sm: "-2px" },
                      zIndex: "9999",
                      pointerEvents: "none",
                    }}
                  >
                    {showMilestone && (
                    <footer>
                      {/* Debug: Log milestone level and LEVEL for troubleshooting */}
                      {/* {console.log(
                        "MainLayout footer - milestoneLevel:",
                        milestoneLevel,
                        "LEVEL:",
                        LEVEL,
                        "rFlow:",
                        rFlow
                      )} */}

                      {/* Only show F flow images when milestone level is "B" */}
                      {tFlow !== "true" &&
                        (milestoneLevel === "B" && isF3FlowActive ? (
                          // F3 Flow - Show F3 milestone image
                          <div style={fFlowWrapperStyle}>
                            <img
                              src={F3Image}
                              alt="F3"
                              height={isMobile ? "75px" : "200px"}
                            />
                          </div>
                        ) : milestoneLevel === "B" && isF2FlowActive ? (
                          // F2 Flow - Show F2 milestone image
                          <div style={fFlowWrapperStyle}>
                            <img
                              src={F2Image}
                              alt="F2"
                              height={isMobile ? "75px" : "200px"}
                            />
                          </div>
                        ) : milestoneLevel === "B" && isF1FlowActive ? (
                          // F1 Flow - Show F1 milestone image
                          <div style={fFlowWrapperStyle}>
                            <img
                              src={F1Image}
                              alt="F1"
                              height={isMobile ? "75px" : "200px"}
                            />
                          </div>
                        ) : rFlow === "true" && milestoneLevel === "B" ? (
                          // Only show R flow images when milestone level is "B"
                          [1, "B"]?.includes(LEVEL) ? (
                            // R0 - Show F1 milestone image instead of R0 image
                            rStep == null || rStep === 0 || rStep === "0" ? (
                              <img
                                src={F1Image}
                                alt="F1"
                                height={isMobile ? "130px" : "200px"}
                              />
                            ) : (
                              <img
                                src={Assets.rOneMileImage}
                                alt="R One"
                                height={isMobile ? "130px" : "200px"}
                              />
                            )
                          ) : LEVEL === 2 ? (
                            <img
                              src={
                                props.rStep === 2
                                  ? Assets.r2MileImg
                                  : props.rStep === 3
                                  ? Assets.r3MileImg
                                  : props.rStep === 4
                                  ? Assets.r4MileImg
                                  : null
                              }
                              alt={`R Step ${props.rStep}`}
                              height={isMobile ? "130px" : "200px"}
                            />
                          ) : null
                        ) : (
                          !!LEVEL && levelsImages?.[LEVEL]?.milestone
                        ))}
                    </footer>
                    )}
                  </Box>
                  <Box
                    sx={{
                      borderBottom: "1.5px solid rgba(51, 63, 97, 0.15)",
                      width: "100%",
                      display: isMobile ? "none" : "block",
                    }}
                  ></Box>
                  {/* Show displayPracticeSteps progress bar - hide when flowNames progress bar is showing */}
                  {/* Show progress bar for F1, F2, or when conditions are met */}
                  {(showNext || showProgress) &&
                    tFlow !== "true" &&
                    !(
                      rFlow === "true" &&
                      ![1, "B", 3]?.includes(LEVEL) &&
                      !isF1FlowActive &&
                      !isF2FlowActive &&
                      !isF3FlowActive
                    ) && (
                      <Box
                        ref={progressBarParentRef}
                        sx={{
                          display: "flex",
                          justifyContent: currentPracticeStep
                            ? "center"
                            : "right",
                          alignItems: "center",
                          width: "100%",
                          height: { xs: "55px", sm: "100%" },
                          position: { xs: "absolute", sm: "relative" },
                          bottom: { xs: "10px", sm: "auto" },
                          left: 0,
                          right: 0,
                          zIndex: 10001,
                          pointerEvents: "none",
                        }}
                      >
                        {/* Show progress bar - use F2 flow steps when F2 is active, F1 flow steps when F1 is active, otherwise use regular steps */}
                        {/* Show dynamic steps based on available width with prev/next buttons */}
                        {showProgress && (
                          <Box
                            ref={progressBarContainerRef}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: {
                                xs: "calc(100% - 16px)",
                                sm: "calc(100% - 200px - 200px)",
                                md: "calc(100% - 220px - 220px)",
                              },
                              gap: { xs: 1, sm: 2 },
                              marginLeft: {
                                xs: "8px",
                                sm: "200px",
                                md: "220px",
                              },
                              marginRight: {
                                xs: "8px",
                                sm: "200px",
                                md: "220px",
                              },
                              position: "relative",
                              left: { xs: "20px", sm: "auto" },
                              zIndex: 10000,
                              pointerEvents: "auto",
                            }}
                          >
                            {/* Previous Button */}
                            {canGoPrev && (
                              <IconButton
                                onClick={handleProgressBarPrev}
                                disabled={!canGoPrev}
                                sx={{
                                  width: { xs: "24px", sm: "40px", md: "48px" },
                                  height: {
                                    xs: "24px",
                                    sm: "40px",
                                    md: "48px",
                                  },
                                  backgroundColor: "white",
                                  border: "1.5px solid rgba(51, 63, 97, 0.15)",
                                  borderRadius: "50%",
                                  "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                  },
                                  "&:disabled": {
                                    opacity: 0.3,
                                  },
                                }}
                              >
                                <ChevronLeft
                                  sx={{
                                    fontSize: {
                                      xs: "14px",
                                      sm: "24px",
                                      md: "28px",
                                    },
                                    color: "#333F61",
                                  }}
                                />
                              </IconButton>
                            )}

                            {/* Progress Steps Container */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "48px",
                                border: "1.5px solid rgba(51, 63, 97, 0.15)",
                                borderRadius: "30px",
                                background: "white",
                                padding: {
                                  xs: "4px 8px",
                                  sm: "4px 12px",
                                  md: "4px 16px",
                                },
                                minWidth: {
                                  xs: "auto",
                                  sm: "280px",
                                  md: "320px",
                                },
                                flex: { xs: "none", sm: 1 },
                                maxWidth: "100%",
                              }}
                            >
                              {visibleSteps.map((elem, visibleIndex) => {
                                const actualIndex =
                                  visibleRange.start + visibleIndex;
                                return (
                                  <Box
                                    key={actualIndex}
                                    sx={{
                                      width: {
                                        xs: "28px",
                                        sm: "32px",
                                        md: "36px",
                                        lg: "40px",
                                      },
                                      height: {
                                        xs: "22px",
                                        sm: "32px",
                                        md: "36px",
                                        lg: "40px",
                                      },
                                      background:
                                        currentPracticeStep > actualIndex
                                          ? "linear-gradient(90deg, rgba(132, 246, 48, 0.1) 0%, rgba(64, 149, 0, 0.1) 95%)"
                                          : currentPracticeStep === actualIndex
                                          ? "linear-gradient(90deg, #FF4BC2 0%, #C20281 95%)"
                                          : "rgba(0, 0, 0, 0.04)",
                                      ml:
                                        visibleIndex > 0
                                          ? { xs: 0.5, sm: 1, md: 1.5 }
                                          : 0,
                                      borderRadius: "50%",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      flexShrink: 0,
                                    }}
                                  >
                                    {currentPracticeStep > actualIndex ? (
                                      <GreenTick
                                        style={{
                                          transform: isMobile
                                            ? "scale(0.8)"
                                            : "none",
                                        }}
                                      />
                                    ) : (
                                      <span
                                        style={{
                                          color:
                                            currentPracticeStep === actualIndex
                                              ? "white"
                                              : "#1E2937",
                                          fontWeight: 600,
                                          lineHeight: "20px",
                                          fontSize: isMobile
                                            ? "9px"
                                            : isTablet
                                            ? "12px"
                                            : "14px",
                                          fontFamily: "Quicksand",
                                        }}
                                      >
                                        {LEVEL === 1
                                          ? elem.title
                                          : LEVEL === 2
                                          ? elem.titleNew
                                          : LEVEL === 3
                                          ? elem.titleNew
                                          : elem.name}
                                      </span>
                                    )}
                                  </Box>
                                );
                              })}
                            </Box>

                            {/* Next Button */}
                            {canGoNext && (
                              <IconButton
                                onClick={handleProgressBarNext}
                                disabled={!canGoNext}
                                sx={{
                                  display: "inline-flex",
                                  width: { xs: "24px", sm: "40px", md: "48px" },
                                  height: {
                                    xs: "24px",
                                    sm: "40px",
                                    md: "48px",
                                  },
                                  backgroundColor: "white",
                                  border: "1.5px solid rgba(51, 63, 97, 0.15)",
                                  borderRadius: "50%",
                                  "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                  },
                                  "&:disabled": {
                                    opacity: 0.3,
                                  },
                                }}
                              >
                                <ChevronRight
                                  sx={{
                                    fontSize: {
                                      xs: "14px",
                                      sm: "24px",
                                      md: "28px",
                                    },
                                    color: "#333F61",
                                  }}
                                />
                              </IconButton>
                            )}
                          </Box>
                        )}
                        {/* Hide flowNames progress bar when F1, F2, F3, or M3 flow is active - use displayPracticeSteps instead */}
                        {/* M3 (LEVEL 3) should use displayPracticeSteps, not flowNames */}
                        {rFlow === "true" &&
                          ![1, "B", 3]?.includes(LEVEL) &&
                          !isF1FlowActive &&
                          !isF2FlowActive &&
                          !isF3FlowActive && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                pointerEvents: "auto",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  maxWidth: "100%",
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "48px",
                                  }}
                                >
                                  <IconButton
                                    onClick={handlePrev}
                                    disabled={currentPageStart === 0}
                                    sx={{
                                      mr: 1,
                                      visibility:
                                        currentPageStart === 0
                                          ? "hidden"
                                          : "visible",
                                    }}
                                  >
                                    <ChevronLeft />
                                  </IconButton>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: "48px",
                                      border:
                                        "1.5px solid rgba(51, 63, 97, 0.15)",
                                      borderRadius: "30px",
                                      background: "white",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {flowNames
                                      ?.slice(
                                        currentPageStart,
                                        currentPageStart + 10
                                      )
                                      .map((flow, i) => (
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
                                              flow === activeFlow
                                                ? "linear-gradient(90deg, #FF4BC2 0%, #C20281 95%)"
                                                : flowNames?.indexOf(flow) <
                                                  flowNames?.indexOf(activeFlow)
                                                ? "linear-gradient(90deg, rgba(132, 246, 48, 0.1) 0%, rgba(64, 149, 0, 0.1) 95%)"
                                                : "rgba(0, 0, 0, 0.04)",
                                            ml: {
                                              xs: 0.5,
                                              sm: 0.5,
                                              md: 1.5,
                                              lg: 2,
                                            },
                                            mr: i === 9 ? 2 : 0,
                                            borderRadius: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexShrink: 0,
                                          }}
                                        >
                                          {flowNames?.indexOf(flow) <
                                          flowNames?.indexOf(activeFlow) ? (
                                            <GreenTick />
                                          ) : (
                                            <span
                                              style={{
                                                color:
                                                  flow === activeFlow
                                                    ? "white"
                                                    : "#1E2937",
                                                fontWeight: 600,
                                                fontSize: "16px",
                                                fontFamily: "Quicksand",
                                              }}
                                            >
                                              {flow}
                                            </span>
                                          )}
                                        </Box>
                                      ))}
                                  </Box>

                                  <IconButton
                                    onClick={handleNext1}
                                    disabled={
                                      currentPageStart + 10 >= flowNames?.length
                                    }
                                    sx={{
                                      ml: 1,
                                      visibility:
                                        currentPageStart + 10 >=
                                        flowNames?.length
                                          ? "hidden"
                                          : "visible",
                                    }}
                                  >
                                    <ChevronRight />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          )}
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
                          {ui.MAIN_LAYOUT_NEXT_LESSON}
                        </span>
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
          {((isShowCase && !startShowCase) || gameOverData) &&
            !allCompleted && (
              <Card
                sx={{
                  position: { xs: "absolute", md: "relative" },
                  top: { xs: "85px", md: "auto" },
                  bottom: { xs: "10px", md: "auto" },
                  left: { xs: "10px", md: "auto" },
                  right: { xs: "10px", md: "auto" },
                  width: { xs: "auto", md: "85vw" },
                  mx: { xs: "auto", md: "auto" },
                  minHeight: { xs: "unset", md: "80vh" },
                  height: { xs: "auto", md: "auto" },
                  borderRadius: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundImage: {
                    xs:
                      isShowCase && !startShowCase && !gameOverData
                        ? "none"
                        : `url(${cardBackground || textureImage})`,
                    md: `url(${cardBackground || textureImage})`,
                  },
                  backgroundSize: "contain",
                  backgroundRepeat: "round",
                  boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
                  backdropFilter: "blur(25px)",
                  mt: { xs: "0px", md: "50px" },
                  mb: { xs: "0px", md: "0px" },
                  "& .MuiCardContent-root": {
                    width: { xs: "100%", md: "82vw" },
                    minHeight: { xs: "unset", md: "100%" },
                    boxSizing: "border-box",
                    padding: { xs: "16px", md: "24px" },
                  },
                  "& img[alt='gameLost']": {
                    height: { xs: "180px!important", md: "250px!important" },
                  },
                  "& img[alt='Words Learnt']": {
                    width: { xs: "70px!important", md: "100px!important" },
                    height: { xs: "70px!important", md: "100px!important" },
                  },
                  "& img[alt='Star']": {
                    width: { xs: "50px!important", md: "100px!important" },
                    height: { xs: "50px!important", md: "100px!important" },
                  },
                }}
              >
                <Box>
                  {shake && <Confetti width={width} height={"602px"} />}
                </Box>
                <CardContent
                  sx={{
                    width: { xs: "100%", md: "82vw" },
                    minHeight: { xs: "unset", md: "100%" },
                    flex: { xs: 1, md: "unset" },
                    overflowY: { xs: "auto", md: "unset" },
                    opacity: disableScreen ? 0.25 : 1,
                    pointerEvents: disableScreen ? "none" : "initial",
                    display: { xs: "flex", md: "block" },
                    flexDirection: { xs: "column", md: "unset" },
                    "&::-webkit-scrollbar": {
                      width: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(0,0,0,0.15)",
                      borderRadius: "4px",
                    },
                  }}
                >
                  {isShowCase && !startShowCase && !gameOverData && (
                    <Box
                      sx={{
                        display: { xs: "flex", md: "block" },
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flexGrow: { xs: 1, md: "unset" },
                        width: "100%",
                      }}
                    >
                      <Typography
                        className="successHeader"
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {ui.HURRAY}
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
                          {ui.MAIN_LAYOUT_READY_CHALLENGE}
                        </span>
                      </Typography>
                    </Box>
                  )}
                  {gameOverData && (
                    <>
                      <Box
                        sx={{
                          position: "absolute",
                          top: { xs: "-50px", md: "-120px" },
                          left: { xs: "-20px", md: "-70px" },
                        }}
                      >
                        {!gameOverData?.userWon && (
                          <img
                            src={clouds}
                            alt="clouds"
                            style={{
                              zIndex: -999,
                              height: { xs: 200, md: 340 },
                            }}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 1,
                          minHeight: 0,
                          position: "relative",
                          zIndex: "100",
                          width: "100%",
                        }}
                      >
                        {gameOverData?.userWon ? (
                          <img
                            src={gameWon}
                            alt="gameWon"
                            style={{
                              zIndex: 9999,
                              width: "100%",
                              maxWidth: isMobile ? "320px" : "600px",
                              height: "auto",
                              maxHeight: isMobile ? "320px" : "500px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <Stack
                            justifyContent="center"
                            alignItems="center"
                            direction={{ xs: "column", md: "row" }}
                            spacing={{ xs: 2, md: 4 }}
                            zIndex={100}
                            sx={{ width: "100%" }}
                          >
                            <Stack justifyContent="center" alignItems="center">
                              <img
                                src={Assets.gameLost}
                                alt="gameLost"
                                style={{
                                  height: isMobile ? "220px" : "360px",
                                  width: "auto",
                                  objectFit: "contain",
                                }}
                              />
                              <Typography
                                sx={{ mb: 1, mt: 1, textAlign: "center" }}
                              >
                                {!props.pageName === "m8" && (
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      fontSize: { xs: "16px", md: "24px" },
                                      lineHeight: "1.5",
                                      letterSpacing: "1px",
                                      fontFamily: "Quicksand",
                                      backgroundColor: "rgb(237, 134, 0)",
                                      padding: "6px 12px",
                                      color: "#fff",
                                      borderRadius: "20px",
                                      boxShadow:
                                        "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                      textShadow:
                                        "1px 1px 2px rgba(0, 0, 0, 0.5)",
                                    }}
                                  >
                                    {percentage <= 0 ? 0 : percentage}/100
                                  </span>
                                )}
                                <br />

                                {!fluency ? (
                                  <Typography textAlign="center" sx={{ mt: 2 }}>
                                    {ui.MAIN_LAYOUT_GAMEOVER_GOOD_TRY_SPEED}
                                  </Typography>
                                ) : (
                                  <Typography textAlign="center" sx={{ mt: 2 }}>
                                    {ui.MAIN_LAYOUT_GAMEOVER_NEED_POINTS.replace(
                                      "{points}",
                                      Math.abs(70 - percentage)
                                    )}
                                  </Typography>
                                )}
                              </Typography>
                              {(props.pageName === "wordsorimage" ||
                                props.pageName === "m5") &&
                                storedData?.length > 0 && (
                                  <Box
                                    sx={{
                                      boxShadow:
                                        "rgba(0, 0, 0, 0.12) 0px 4px 16px",
                                      padding: { xs: "16px", md: "20px" },
                                      borderRadius: "16px",
                                      bgcolor: "#FFFFFF",
                                      width: { xs: "95%", md: "600px" },
                                      maxWidth: { xs: "100%", md: "700px" },
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        maxHeight: { xs: "220px", md: "280px" },
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        paddingRight: "8px",
                                        "&::-webkit-scrollbar": {
                                          width: "6px",
                                        },
                                        "&::-webkit-scrollbar-track": {
                                          background: "#f5f5f5",
                                          borderRadius: "10px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                          background: "#d1d1d1",
                                          borderRadius: "10px",
                                        },
                                        "&::-webkit-scrollbar-thumb:hover": {
                                          background: "#b1b1b1",
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "grid",
                                          gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                            md: "1fr 1fr",
                                          },
                                          gap: { xs: "10px", md: "12px" },
                                        }}
                                      >
                                        {storedData?.map((elem, index) => (
                                          <Box
                                            key={index}
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              padding: "10px 14px",
                                              borderRadius: "12px",
                                              backgroundColor:
                                                elem?.correctAnswer === false
                                                  ? "rgba(239, 68, 68, 0.08)"
                                                  : "rgba(34, 197, 94, 0.08)",
                                              border:
                                                elem?.correctAnswer === false
                                                  ? "1.5px solid rgba(239, 68, 68, 0.25)"
                                                  : "1.5px solid rgba(34, 197, 94, 0.25)",
                                              transition:
                                                "transform 0.15s ease, box-shadow 0.15s ease",
                                              "&:hover": {
                                                transform: "translateY(-1px)",
                                                boxShadow:
                                                  "0 2px 8px rgba(0,0,0,0.08)",
                                              },
                                            }}
                                          >
                                            {/* Play Button */}
                                            <Box
                                              sx={{
                                                marginRight: "10px",
                                                flexShrink: 0,
                                              }}
                                            >
                                              {elem?.audioUrl ? (
                                                <button
                                                  onClick={() =>
                                                    handleAudioPlay(index)
                                                  }
                                                  style={{
                                                    height: "30px",
                                                    cursor: "pointer",
                                                    background: "none",
                                                    border: "none",
                                                    padding: "0",
                                                  }}
                                                  aria-label={
                                                    audioPlaying === index
                                                      ? ui.A11Y_PAUSE_AUDIO
                                                      : ui.A11Y_PLAY_AUDIO
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
                                                  (audioRefs.current[index] =
                                                    el)
                                                }
                                                src={elem?.audioUrl}
                                              />
                                            </Box>

                                            {/* Status Icon */}
                                            <Box sx={{ flexShrink: 0, mr: 1 }}>
                                              {elem?.correctAnswer === false ? (
                                                <img
                                                  src={Assets.wrong}
                                                  alt="wrongImage"
                                                  style={{
                                                    width: "22px",
                                                    height: "22px",
                                                  }}
                                                />
                                              ) : (
                                                <img
                                                  src={Assets.correct}
                                                  alt="correctImage"
                                                  style={{
                                                    width: "22px",
                                                    height: "22px",
                                                  }}
                                                />
                                              )}
                                            </Box>

                                            {/* Word Text */}
                                            <Typography
                                              sx={{
                                                color: "#1E2937",
                                                fontWeight: 600,
                                                fontSize: {
                                                  xs: "14px",
                                                  md: "15px",
                                                },
                                                fontFamily: "Quicksand",
                                                flex: 1,
                                                wordBreak: "break-word",
                                                lineHeight: 1.3,
                                              }}
                                            >
                                              {elem.selectedAnswer || "—"}
                                            </Typography>
                                          </Box>
                                        ))}
                                      </Box>
                                    </Box>
                                    {(fluency ||
                                      [10, 11, 12, 13, 14, 15].includes(
                                        LEVEL
                                      )) && (
                                      <Stack
                                        sx={{
                                          mt: 2,
                                          pt: 2,
                                          borderTop: "1px dashed #e0e0e0",
                                          backgroundColor:
                                            "rgba(255, 152, 0, 0.08)",
                                          borderRadius: "10px",
                                          padding: "12px",
                                          marginTop: "16px",
                                        }}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        direction={"row"}
                                        spacing={1.5}
                                      >
                                        <img
                                          src={Assets.turtle}
                                          alt="turtleImage"
                                          style={{
                                            width: "45px",
                                            height: "45px",
                                          }}
                                        />
                                        <span
                                          style={{
                                            color: "#E65100",
                                            fontWeight: 700,
                                            lineHeight: "22px",
                                            fontSize: "15px",
                                            fontFamily: "Quicksand",
                                          }}
                                        >
                                          {ui.MAIN_LAYOUT_OOPS_SLOW}
                                        </span>
                                      </Stack>
                                    )}
                                  </Box>
                                )}
                            </Stack>
                            {/* second stack below*/}
                            <Stack
                              direction={"column"}
                              alignItems="center"
                              spacing={2}
                              marginLeft={{ xs: 0, md: "10px" }}
                              sx={{ width: { xs: "90%", md: "auto" } }}
                            >
                              <Box
                                component="img"
                                src={Assets.wordsLearnt}
                                alt="Words Learnt"
                                sx={{
                                  width: "100px",
                                  height: "100px",
                                }}
                              />

                              {/* Number */}
                              <Typography
                                sx={{
                                  color: "#FF00B8",
                                  fontWeight: "bold",
                                  fontSize: "24px",
                                  fontFamily: "Quicksand",
                                }}
                              >
                                {vocabCount}
                              </Typography>

                              {/* Label */}
                              <Typography
                                sx={{
                                  color: "#2E2E2E",
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  fontFamily: "Quicksand",
                                }}
                              >
                                {ui.ASSESSMENT_WORDS_LEARNT}
                              </Typography>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                                sx={{
                                  backgroundColor: "#F8EAD2",
                                  border: "2px solid yellow",
                                  borderRadius: "40px",
                                  padding: "10px 20px",
                                  width: { xs: "100%", md: "auto" },
                                }}
                              >
                                <img
                                  src={Assets.starNewImg}
                                  alt="Star"
                                  style={{
                                    width: { xs: "60px", md: "100px" },
                                    height: { xs: "60px", md: "100px" },
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  variant="body1"
                                  sx={{
                                    wordWrap: "break-word",
                                    whiteSpace: "normal",
                                    maxWidth: { xs: "120px", md: "120px" },
                                    fontWeight: "700",
                                    fontSize: { xs: "14px", md: "16px" },
                                    fontFamily: "Quicksand",
                                  }}
                                >
                                  {ui.MAIN_LAYOUT_PRACTICE_MORE}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        )}
                      </Box>
                    </>
                  )}
                </CardContent>
                <Box
                  sx={{
                    height: { xs: "80px", md: "120px" },
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      borderBottom: "1.5px solid rgba(51, 63, 97, 0.15)",
                      width: "100%",
                      display: isMobile ? "none" : "block",
                    }}
                  ></Box>
                  {/* Progress bar removed from second Card - using the one in first Card instead */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-end" },
                      alignItems: "center",
                      mr: { xs: 0, md: 4 },
                      mt: 0,
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        cursor: "pointer",
                        background:
                          "linear-gradient(90deg, rgba(255,144,80,1) 0%, rgba(225,84,4,1) 85%)",
                        minWidth: { xs: "130px", md: "160px" },
                        height: { xs: "42px", md: "55px" },
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: { xs: "0px 16px", md: "0px 24px 0px 20px" },
                      }}
                      onClick={() => {
                        if (
                          (LEVEL === 1 || LEVEL === 2) &&
                          (mFlow === true || mFlow === "true")
                        ) {
                          //console.log("mFlow value:", mFlow);
                          // setLocalData("rFlow", true);
                          setLocalData("rStepZero", 0);
                        }
                        // if (
                        //               LEVEL === 1 ||
                        //               LEVEL === 2 ||
                        //               LEVEL === 3 ||
                        //               LEVEL === 4 ||
                        //               LEVEL === 6 ||
                        //               LEVEL === 9
                        //             ) {
                        //               setLocalData("tFlow", true);
                        //               navigate("/_practice");
                        //             }
                        if (
                          props.pageName === "wordsorimage" ||
                          props.pageName === "m5"
                        ) {
                          resetStoredData();
                        }
                        if (isShowCase && !startShowCase && !gameOverData) {
                          setStartShowCase(true);
                          // 🎬 Trigger alphabet demo ONLY for F1 flow deferred milestones (A-step indices)
                          // Derive from F1_FLOW so it stays in sync with Practice.jsx
                          if (isF1FlowActive) {
                            const deferredMilestones = F1_FLOW.reduce(
                              (acc, step, idx) => {
                                if (step.type === "A") acc.push(idx);
                                return acc;
                              },
                              []
                            );
                            const currentF1Index = Number(
                              getLocalData("f1FlowIndex") || -1
                            );
                            if (deferredMilestones.includes(currentF1Index)) {
                              window.dispatchEvent(
                                new Event("alphabetDemoTriggerRequest")
                              );
                            }
                          }
                        }
                        if (gameOverData) {
                          gameOverData.link
                            ? navigate(gameOverData.link)
                            : navigate("/_practice");
                        }
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#FFFFFF",
                          fontWeight: 600,
                          fontSize: { xs: "13px", md: "16px" },
                          fontFamily: "Quicksand",
                        }}
                      >
                        {!gameOverData
                          ? ui.MAIN_LAYOUT_START_GAME
                          : ui.MAIN_LAYOUT_PRACTICE_ARROW}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            )}
          {LEVEL === 15 && allCompleted && (
            <Card
              sx={{
                width: "65%",
                //height: "100%",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundImage: `url(${cardBackground || textureImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "round",
                boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
                backdropFilter: "blur(25px)",
                mt: "100px",
              }}
            >
              <img
                src={Assets.allLevCompleted}
                width={"100%"}
                height={"100%"}
              />
              {/* Removed duplicate progress bar section - using the one above instead */}
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
  isRecordingComplete: PropTypes.bool,
  answer: PropTypes.string,
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
  cardContentStyle: PropTypes.object,
  gameOverData: PropTypes.shape({
    userWon: PropTypes.bool,
  }),
};

export default MainLayout;
