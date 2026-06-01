/**
 * Smoke tests for remaining views (renders without crashing).
 * Complex views with heavy dependencies are tested here with mocking.
 */
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// ─── Global mocks ─────────────────────────────────────────────────────────

jest.mock("../../utils/constants", () => ({
  getLocalData: jest.fn(() => null),
  setLocalData: jest.fn(),
  replaceAll: jest.fn((s) => s),
  compareArrays: jest.fn(() => []),
  getLanguageOrDefault: jest.fn(() => "en"),
  questionsList: [],
  practiceSteps: {},
  NextButton: () => <button>Next</button>,
  NextButtonRound: () => <button>Next</button>,
  ListenButton: () => <button>Listen</button>,
}));
jest.mock("../../utils/imageAudioLinks", () => ({}));
jest.mock("../../utils/s3Links", () => ({
  getAssetUrl: jest.fn(() => ""),
  getAssetAudioUrl: jest.fn(() => ""),
}));
jest.mock("../../services/telemetryService", () => ({
  Log: jest.fn(),
  initialize: jest.fn(),
}));
jest.mock("../../utils/errorReporter", () => ({ reportError: jest.fn() }));
jest.mock("../../components/Layout/MainLayout", () => ({ children }) => (
  <div>{children}</div>
));
jest.mock("axios");
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

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

// ─── Test helpers ─────────────────────────────────────────────────────────

const store = configureStore({
  reducer: {
    snackbar: (s = { open: false, message: "", type: "" }) => s,
    user: (s = { isApiDone: false, id: 0, mobile: "", virtualId: null }) => s,
  },
});

const wrap = (ui) => (
  <Provider store={store}>
    <MemoryRouter>{ui}</MemoryRouter>
  </Provider>
);

// ─── Tests ────────────────────────────────────────────────────────────────

describe("Views smoke tests", () => {
  it("DiscoverStart renders", async () => {
    const { default: DiscoverStart } = await import(
      "../DiscoverStart/DiscoverStartPage"
    );
    expect(() => render(wrap(<DiscoverStart />))).not.toThrow();
  });

  it("MilestoneForm view renders", async () => {
    const { default: MilestoneFormPage } = await import(
      "../MilestoneForm/MilestoneFormPage"
    );
    expect(() => render(wrap(<MilestoneFormPage />))).not.toThrow();
  });
});
