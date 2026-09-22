import { getLocalData, setLocalData } from "../utils/constants";
import {
  impression as telemetryImpression,
  assess as telemetryAssess,
} from "../services/telemetryService";

// Track step start time for F3 duration calculation
let f3StepStartTs = Date.now();

/**
 * F3 Flow sequence:
 * P=Practice (Letter Launcher), A=Apply (Letter Launcher + Memory Challenge + Read Aloud)
 *
 * Structure:
 * Practice 1 (Letter Speed) -> Practice 2 (Letter Speed) -> Practice 3 (Letter Speed) ->
 * Practice 4 (Letter Speed) -> Practice 5 (Letter Speed) -> Apply 1 (Letter Speed 3 levels + Memory Challenge 3 levels) ->
 * Practice 6 (Syllable Speed) -> Practice 7 (Syllable Speed) -> Practice 8 (Syllable Speed) ->
 * Practice 9 (Syllable Speed) -> Practice 10 (Syllable Speed) -> Apply 2 (Syllable Speed 1 level + Memory Challenge 3 levels + Read Aloud)
 *
 * Apply steps have special handling:
 * - Apply 1: Letter Speed (3 levels) -> Memory Challenge (3 levels)
 *   - If fail at any level → Practice 1
 *   - If pass all → Practice 6
 * - Apply 2: Syllable Speed (1 level) -> Memory Challenge (3 levels) -> Read Aloud
 *   - If fail at any level → Practice 6
 *   - If pass all → Complete F3
 */
export const F3_FLOW = [
  { type: "P", step: 1, mechanism: "letterLauncher", contentType: "letter" }, // Practice 1 - Letter Speed (Letter Launcher)
  { type: "P", step: 2, mechanism: "letterLauncher", contentType: "letter" }, // Practice 2 - Letter Speed (Letter Launcher)
  { type: "P", step: 3, mechanism: "letterLauncher", contentType: "letter" }, // Practice 3 - Letter Speed (Letter Launcher)
  { type: "P", step: 4, mechanism: "letterLauncher", contentType: "letter" }, // Practice 4 - Letter Speed (Letter Launcher)
  { type: "P", step: 5, mechanism: "letterLauncher", contentType: "letter" }, // Practice 5 - Letter Speed (Letter Launcher)
  {
    type: "A",
    step: 1,
    mechanism: "letterLauncher",
    contentType: "letter",
    failRedirect: "P1",
    passRedirect: "P6",
  }, // Apply 1 - Letter Speed (3 levels) + Memory Challenge (3 levels)
  { type: "P", step: 6, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 6 - Syllable Speed (Letter Launcher)
  { type: "P", step: 7, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 7 - Syllable Speed (Letter Launcher)
  { type: "P", step: 8, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 8 - Syllable Speed (Letter Launcher)
  { type: "P", step: 9, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 9 - Syllable Speed (Letter Launcher)
  { type: "P", step: 10, mechanism: "letterLauncher", contentType: "syllable" }, // Practice 10 - Syllable Speed (Letter Launcher)
  {
    type: "A",
    step: 2,
    mechanism: "letterLauncher",
    contentType: "syllable",
    failRedirect: "P6",
    passRedirect: "complete",
  }, // Apply 2 - Syllable Speed (1 level) + Memory Challenge (3 levels) + Read Aloud
];

/**
 * Get current F3 flow step
 */
export const getF3FlowStep = () => {
  const savedIndex = getLocalData("f3FlowIndex");
  const flowIndex = savedIndex ? Number(savedIndex) : 0;
  return {
    index: flowIndex,
    step: F3_FLOW[flowIndex] || null,
    isLast: flowIndex === F3_FLOW.length - 1,
  };
};

/**
 * Advance to next F3 flow step
 */
export const advanceF3Flow = () => {
  const current = getF3FlowStep();
  if (current.isLast) {
    setLocalData("f3FlowIndex", null);
    return null;
  }
  const nextIndex = current.index + 1;
  setLocalData("f3FlowIndex", nextIndex);
  return F3_FLOW[nextIndex];
};

/**
 * Reset F3 flow
 */
export const resetF3Flow = () => {
  setLocalData("f3FlowIndex", null);
};

/**
 * Fire IMPRESSION (start) for the current F3 step.
 * Call from Practice.jsx when rendering a new F3 step.
 */
export const fireF3StepStart = (stepIndex) => {
  const step = F3_FLOW[stepIndex];
  if (!step) return;
  const stepId = `F3_${step.type}${step.step}`;
  localStorage.setItem("currentStep", stepId);
  f3StepStartTs = Date.now();
  telemetryImpression(
    {
      pageid: stepId,
      subtype: "start",
      uri: window.location.pathname,
      visits: [{ objid: stepId, objtype: "Step", section: "", duration: 0 }],
    },
    "ET"
  );
};

/**
 * Fire IMPRESSION (end) + ASSESS for a F3 step, then optionally advance.
 * Call from Practice.jsx at every F3 step pass/fail decision point.
 */
export const completeF3StepWithTelemetry = (stepIndex, result = {}) => {
  const step = F3_FLOW[stepIndex];
  if (!step) return;
  const stepId = `F3_${step.type}${step.step}`;
  const durationMs = Date.now() - f3StepStartTs;
  const pass = result.pass !== undefined ? result.pass : true;
  const mechanic = result.mechanic || "letterLauncher";

  telemetryImpression(
    {
      pageid: stepId,
      subtype: "end",
      uri: window.location.pathname,
      visits: [
        {
          objid: stepId,
          objtype: "Step",
          section: mechanic,
          duration: durationMs,
        },
      ],
    },
    "ET"
  );
  telemetryAssess({
    item: { id: stepId, type: mechanic, maxscore: 1 },
    pass,
    score: pass ? 100 : 0,
    resvalues: [{ attempts: result.attempts || 1 }],
    duration: durationMs,
  });
};
