import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import WordsOrImage from "../WordsOrImage";

jest.mock("../../Layout/MainLayout", () => ({ children }) => (
  <div>{children}</div>
));
jest.mock("../../../utils/imageAudioLinks", () => ({}));
jest.mock("../../../utils/s3Links", () => ({
  getAssetUrl: jest.fn(() => ""),
  getAssetAudioUrl: jest.fn(() => ""),
}));
jest.mock("../../../utils/VoiceAnalyser", () => () => (
  <div data-testid="voice-analyser" />
));
jest.mock("../../../utils/RecordVoiceVisualizer", () => () => null);

describe("WordsOrImage", () => {
  it("renders without crashing with text content", () => {
    render(
      <MemoryRouter>
        <WordsOrImage
          type="word"
          text="apple"
          setVoiceText={jest.fn()}
          setRecordedAudio={jest.fn()}
          handleNext={jest.fn()}
          handleBack={jest.fn()}
          setVoiceAnimate={jest.fn()}
          setEnableNext={jest.fn()}
          setOpenMessageDialog={jest.fn()}
          currentStep={0}
        />
      </MemoryRouter>
    );
  });
});
