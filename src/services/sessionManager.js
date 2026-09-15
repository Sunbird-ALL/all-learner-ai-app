/**
 * sessionManager.js
 *
 * In-memory accumulator for session-level telemetry data.
 * Called internally by telemetryService.js — not called directly by components.
 *
 * State is built up incrementally throughout a session and read by
 * fireSessionEnd() to populate the SUMMARY event payload.
 *
 * Privacy: tracks only learning behaviour — no school, grade, or demographic data.
 * User is identified by apiToken (uid) only.
 */

import { getLocalData } from "../utils/constants";

const defaultState = {
  startTs: null, // epoch ms — set when START fires
  totalInterruptMs: 0, // accumulated idle time from INTERRUPT events
  lastInterruptTs: null, // timestamp when tab last went to background
  steps: [], // [{ stepId: "M4_S1", durationMs: 120000 }]
  impressionCount: 0, // total IMPRESSION events (start + end = 2 per step)
  assessCount: 0, // total ASSESS events fired this session
  responseCount: 0, // total RESPONSE (speech attempt) events this session
  interruptCount: 0, // total INTERRUPT (background) events this session
  stepsCompleted: 0, // steps where IMPRESSION end fired
  stepsPassed: 0, // steps where ASSESS.pass = true
  stepsFailed: 0, // steps where ASSESS.pass = false
  milestone: null, // milestone level at session start e.g. "m4"
  subMilestone: null, // sub-milestone for Level B e.g. "F1", "F2", "F3"
  language: null, // content language at session start e.g. "hi", "en"
};

let state = { ...defaultState };

/**
 * Call when START event fires — resets and begins tracking a new session.
 * Captures milestone, sub-milestone and language at the moment the session starts.
 */
export const initSession = (milestone, subMilestone) => {
  state = {
    ...defaultState,
    startTs: Date.now(),
    milestone: milestone || localStorage.getItem("milestone") || null,
    subMilestone: subMilestone || null,
    language: getLocalData("lang") || "",
  };
};

/**
 * Call when IMPRESSION (subtype: "end") fires — records a completed step visit.
 * @param {string} stepId    — composite step key e.g. "F1_L2", "M3_P5", "M4_S1"
 * @param {number} durationMs — time spent on the step in milliseconds
 */
export const recordStep = (stepId, durationMs) => {
  state.steps.push({ stepId, durationMs });
  state.impressionCount += 2; // start + end pair = 2 events
  state.stepsCompleted++;
};

/**
 * Call when ASSESS fires — records step pass/fail result.
 * @param {boolean} pass — true if the step was passed
 */
export const recordAssess = (pass) => {
  state.assessCount++;
  if (pass) {
    state.stepsPassed++;
  } else {
    state.stepsFailed++;
  }
};

/**
 * Call when RESPONSE fires — increments speech attempt counter.
 */
export const recordResponse = () => {
  state.responseCount++;
};

/**
 * Call when INTERRUPT fires (tab goes to background / device locks).
 */
export const recordInterruptStart = () => {
  state.lastInterruptTs = Date.now();
  state.interruptCount++;
};

/**
 * Call when tab comes back to foreground — accumulates idle duration.
 */
export const recordInterruptEnd = () => {
  if (state.lastInterruptTs) {
    state.totalInterruptMs += Date.now() - state.lastInterruptTs;
    state.lastInterruptTs = null;
  }
};

/**
 * Returns a snapshot of the current session state.
 * Used by fireSessionEnd() in telemetryService.js to build the SUMMARY payload.
 */
export const getSessionState = () => ({ ...state });

/**
 * Resets state to default — call after SUMMARY fires so the next session starts clean.
 */
export const resetSession = () => {
  state = { ...defaultState };
};
