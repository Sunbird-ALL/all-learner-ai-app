import React from "react";
import { render } from "@testing-library/react";

import AudioDiagnosticModal from "../AudioDiagnosticModal";

jest.mock("../../../utils/constants", () => ({
  getLocalData: jest.fn(() => null),
  setLocalData: jest.fn(),
}));

// Ensure speechSynthesis.getVoices is available before component mounts
beforeEach(() => {
  Object.defineProperty(window, "speechSynthesis", {
    writable: true,
    configurable: true,
    value: {
      speak: jest.fn(),
      cancel: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      getVoices: jest.fn().mockReturnValue([]),
      speaking: false,
      pending: false,
      paused: false,
    },
  });
});

describe("AudioDiagnosticModal", () => {
  it("renders without crashing when closed", () => {
    render(<AudioDiagnosticModal open={false} onClose={jest.fn()} />);
  });
});
