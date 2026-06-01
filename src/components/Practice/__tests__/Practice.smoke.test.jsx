/**
 * Smoke tests for all Practice mechanics components.
 * Strategy: mock all heavy external dependencies, render with minimal props,
 * verify no crash (render-without-throwing).
 */
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// ─── Component imports ───────────────────────────────────────────────────────

import ZoomableImage from "../ZoomableImage";
import RetryDialog from "../RetryDialog";
import AudioTooltipModal from "../AudioTooltipModal";

// ─── Module mocks (must be before imports) ─────────────────────────────────

jest.mock("../../../utils/imageAudioLinks", () => ({}));
jest.mock("../../../utils/s3Links", () => ({
  getAssetUrl: jest.fn(() => ""),
  getAssetAudioUrl: jest.fn(() => ""),
}));
jest.mock("../../../utils/constants", () => ({
  getLocalData: jest.fn(() => null),
  setLocalData: jest.fn(),
  replaceAll: jest.fn((s) => s),
  compareArrays: jest.fn(() => []),
  questionsList: [],
  practiceSteps: {},
  NextButton: () => <button>Next</button>,
  NextButtonRound: () => <button>Next</button>,
  ListenButton: () => <button>Listen</button>,
}));
jest.mock("../../../services/telemetryService", () => ({
  Log: jest.fn(),
  initialize: jest.fn(),
}));
jest.mock("../../../services/evaluation/evaluationService", () => ({
  evaluateText: jest.fn(() => Promise.resolve({})),
  handleTextEvaluation: jest.fn(() => Promise.resolve(null)),
}));
jest.mock("../../../services/learnerAi/learnerAiService", () => ({
  getContent: jest.fn(() => Promise.resolve({ wordsArr: [] })),
  updateLearnerProfile: jest.fn(() => Promise.resolve({})),
  addInteraction: jest.fn(),
}));
jest.mock("../../../utils/errorReporter", () => ({ reportError: jest.fn() }));
jest.mock("react-speech-recognition", () => ({
  __esModule: true,
  default: {
    startListening: jest.fn(),
    stopListening: jest.fn(),
    abortListening: jest.fn(),
  },
  useSpeechRecognition: () => ({
    transcript: "",
    resetTranscript: jest.fn(),
    listening: false,
    browserSupportsSpeechRecognition: true,
  }),
}));
jest.mock("../../Layout/MainLayout", () => ({ children }) => (
  <div data-testid="main-layout">{children}</div>
));

// ─── Test store ─────────────────────────────────────────────────────────────

const store = configureStore({
  reducer: {
    snackbar: (state = { open: false, message: "", type: "" }) => state,
    user: (state = { isApiDone: false, id: 0, mobile: "", virtualId: null }) =>
      state,
  },
});

const Wrapper = ({ children }) => (
  <Provider store={store}>
    <MemoryRouter>{children}</MemoryRouter>
  </Provider>
);

const renderSmoke = (Component, props = {}) => {
  expect(() =>
    render(<Component {...props} />, { wrapper: Wrapper })
  ).not.toThrow();
};

// Note: Heavily Redux/audio-dependent components are imported lazily below
// to avoid import-time side-effects breaking the test suite.

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("Practice component smoke tests", () => {
  it("ZoomableImage renders", () => {
    renderSmoke(ZoomableImage, { src: "", alt: "test" });
  });

  it("RetryDialog renders", () => {
    renderSmoke(RetryDialog, { message: "test", onRetry: jest.fn() });
  });

  it("AudioTooltipModal renders", () => {
    renderSmoke(AudioTooltipModal, {});
  });
});
