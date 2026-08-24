import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalData, setLocalData, practiceSteps } from "../utils/constants";
import { levelGetContent } from "../data/levelContent";
import {
  impression as telemetryImpression,
  assess as telemetryAssess,
} from "../services/telemetryService";

/**
 * F2 Flow sequence:
 * L=Learn (Syllable Clap/Letter Train for English, Barakadi for Indic), P=Practice (Letter Hunt), A=Apply (Letter Hunt with 3 levels)
 *
 * Structure:
 * Learn 1 -> Practice 1 -> Learn 2 -> Practice 2 -> Learn 3 -> Practice 3 -> Apply 1 ->
 * Learn 4 -> Practice 4 -> Learn 5 -> Practice 5 -> Learn 6 -> Practice 6 -> Apply 2 ->
 * Learn 7 -> Practice 7 -> Learn 8 -> Practice 8 -> Learn 9 -> Practice 9 -> Apply 3
 *
 * Apply steps have special handling:
 * - Apply 1: 3 levels, if fail at any level → Learn 1, if pass all → Learn 4
 * - Apply 2: 3 levels, if fail at any level → Learn 4, if pass all → Learn 7
 * - Apply 3: 3 levels, if fail at any level → Learn 7, if pass all → F3 (or complete)
 */
export const F2_FLOW = [
  { type: "L", step: 1 }, // Learn 1 - Syllable Clap/Letter Train (English) or Barakadi (Indic)
  { type: "P", step: 1 }, // Practice 1 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 2 }, // Learn 2 - Syllable Clap/Letter Hunt (English) or Barakadi (Indic)
  { type: "P", step: 2 }, // Practice 2 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 3 }, // Learn 3 - Syllable Clap/Letter Hunt (English) or Barakadi (Indic)
  { type: "P", step: 3 }, // Practice 3 - Letter Hunt (1 level, 10 content)
  { type: "A", step: 1, failRedirect: "L1", passRedirect: "L4" }, // Apply 1 - Letter Hunt (3 levels, 13 content per level)
  { type: "L", step: 4 }, // Learn 4 - Syllable Clap/Letter Hunt (English) or Barakadi (Indic)
  { type: "P", step: 4 }, // Practice 4 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 5 }, // Learn 5 - Syllable Clap/Letter Hunt (English) or Barakadi (Indic)
  { type: "P", step: 5 }, // Practice 5 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 6 }, // Learn 6 - Syllable Clap/Letter Hunt (English) or Barakadi (Indic)
  { type: "P", step: 6 }, // Practice 6 - Letter Hunt (1 level, 10 content)
  { type: "A", step: 2, failRedirect: "L4", passRedirect: "L7" }, // Apply 2 - Letter Hunt (3 levels, 13 content per level)
  { type: "L", step: 7 }, // Learn 7 - Syllable Clap/Letter Hunt (English) or Barakadi (Indic)
  { type: "P", step: 7 }, // Practice 7 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 8 }, // Learn 8 - Syllable Clap/Letter Hunt (English) or Barakadi (Indic)
  { type: "P", step: 8 }, // Practice 8 - Letter Hunt (1 level, 10 content)
  { type: "L", step: 9 }, // Learn 9 - Syllable Clap/Letter Hunt (English) or Barakadi (Indic)
  { type: "P", step: 9 }, // Practice 9 - Letter Hunt (1 level, 10 content)
  { type: "A", step: 3, failRedirect: "L7", passRedirect: "F3" }, // Apply 3 - Letter Hunt (3 levels, 13 content per level)
];

/**
 * Get current F2 flow step
 */
export const getF2FlowStep = () => {
  const savedIndex = getLocalData("f2FlowIndex");
  const flowIndex = savedIndex ? Number(savedIndex) : 0;
  return {
    index: flowIndex,
    step: F2_FLOW[flowIndex] || null,
    isLast: flowIndex === F2_FLOW.length - 1,
  };
};

/**
 * Advance to next F2 flow step
 */
export const advanceF2Flow = () => {
  const current = getF2FlowStep();
  if (current.isLast) {
    setLocalData("f2FlowIndex", null);
    return null;
  }
  const nextIndex = current.index + 1;
  setLocalData("f2FlowIndex", nextIndex);
  return F2_FLOW[nextIndex];
};

/**
 * Reset F2 flow
 */
export const resetF2Flow = () => {
  setLocalData("f2FlowIndex", null);
};

const F2 = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
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
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
  customLetters,
}) => {
  const navigate = useNavigate();
  const lang = getLocalData("lang") || "en";

  // Get current flow step from localStorage or default to 0
  const [currentFlowIndex, setCurrentFlowIndex] = useState(() => {
    const savedIndex = getLocalData("f2FlowIndex");
    return savedIndex ? Number(savedIndex) : 0;
  });

  const currentFlowStep = F2_FLOW[currentFlowIndex];
  const isLastStep = currentFlowIndex === F2_FLOW.length - 1;
  const stepStartTsRef = useRef(Date.now());

  // Save flow index and fire IMPRESSION (start) on each step change
  useEffect(() => {
    setLocalData("f2FlowIndex", currentFlowIndex);
    if (currentFlowStep) {
      const stepId = `F2_${currentFlowStep.type}${currentFlowStep.step}`;
      localStorage.setItem("currentStep", stepId);
      stepStartTsRef.current = Date.now();
      telemetryImpression(
        {
          pageid: stepId,
          subtype: "start",
          uri: window.location.pathname,
          visits: [
            { objid: stepId, objtype: "Step", section: "", duration: 0 },
          ],
        },
        "ET"
      );
    }
  }, [currentFlowIndex]);

  // Handle completion of current step
  const handleStepComplete = (result = {}) => {
    if (currentFlowStep) {
      const stepId = `F2_${currentFlowStep.type}${currentFlowStep.step}`;
      const durationMs = Date.now() - stepStartTsRef.current;
      const pass = result.pass !== undefined ? result.pass : true;
      telemetryImpression(
        {
          pageid: stepId,
          subtype: "end",
          uri: window.location.pathname,
          visits: [
            {
              objid: stepId,
              objtype: "Step",
              section: result.mechanic || "",
              duration: durationMs,
            },
          ],
        },
        "ET"
      );
      telemetryAssess({
        item: {
          id: stepId,
          type: result.mechanic || "letterTrain",
          maxscore: 1,
        },
        pass,
        score: pass ? 100 : 0,
        resvalues: [{ attempts: result.attempts || 1 }],
        duration: durationMs,
      });
    }

    if (isLastStep) {
      setLocalData("f2FlowIndex", null);
      setLocalData("f2FlowComplete", "true");
    } else {
      setCurrentFlowIndex((prev) => prev + 1);
    }
  };

  // Handle Learn (L) step completion
  const handleLearnComplete = () => {
    handleStepComplete();
  };

  // Render Learn step (Syllable Clap/Letter Train for English, Barakadi for Indic)
  const renderLearnStep = () => {
    // For F2, Learn steps use different components based on language
    // English: Syllable Clap/Letter Train
    // Indic: Barakadi
    // Return null here - these will be rendered by Practice.jsx based on mechanism
    return null;
  };

  // Main render logic
  if (!currentFlowStep) {
    // F2 flow complete - return null so Practice.jsx can handle next flow
    if (getLocalData("f2FlowComplete") === "true") {
      return null;
    }
    return <div>Flow step not found</div>;
  }

  // For Learn, Practice, and Apply steps, return null
  // These will be handled by the Practice component based on mechanism
  // F2 component just tracks the flow index
  return null;
};

export default F2;
