import { getLocalData, setLocalData } from "./constants";
import { levelGetContent } from "../data/levelContent";
import { F1_FLOW } from "../RFlow/F1";
import { F2_FLOW } from "../RFlow/F2";
import { F3_FLOW } from "../RFlow/F3";

const FLOW_LEARN_START_KEY = "flowLearnStepStartAt";

/**
 * Title for telemetry / applyLevel from F1/F2/F3 flow index and flow type.
 */
export function getStepTitleFromFlowIndex(flowIndex, flowType) {
  const lang = getLocalData("lang") || "en";

  if (flowType === "F1") {
    const f1Config = levelGetContent[lang]?.["F1"];
    const stepConfig = f1Config?.[flowIndex];
    if (stepConfig?.title) {
      return stepConfig.title;
    }
    const flowStep = F1_FLOW[flowIndex];
    if (flowStep) {
      return `${flowStep.type}${flowStep.step}`;
    }
  } else if (flowType === "F2") {
    const f2Config = levelGetContent[lang]?.["F2"];
    const stepConfig = f2Config?.[flowIndex];
    if (stepConfig?.title) {
      return stepConfig.title;
    }
    const flowStep = F2_FLOW[flowIndex];
    if (flowStep) {
      return `${flowStep.type}${flowStep.step}`;
    }
  } else if (flowType === "F3") {
    const f3Config = levelGetContent[lang]?.["F3"];
    const stepConfig = f3Config?.[flowIndex];
    if (stepConfig?.title) {
      return stepConfig.title;
    }
    const flowStep = F3_FLOW[flowIndex];
    if (flowStep) {
      return `${flowStep.type}${flowStep.step}`;
    }
  }
  return undefined;
}

/** Call when the user lands on an F1/F2 Learn step (LetterTrain / barakhadi). */
export function markFlowLearnStepStart() {
  setLocalData(FLOW_LEARN_START_KEY, String(Date.now()));
}

/** Elapsed seconds on the current learn step, or undefined if not marked. */
export function calculateLetterTrainDuration() {
  const raw = getLocalData(FLOW_LEARN_START_KEY);
  if (raw == null || raw === "") return undefined;
  const t = Number(raw);
  if (Number.isNaN(t)) return undefined;
  return Math.round((Date.now() - t) / 1000);
}
