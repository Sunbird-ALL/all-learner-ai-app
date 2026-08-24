import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AssesmentEnd from "../AssesmentEnd";

jest.mock("../../Layout/MainLayout", () => ({ children }) => (
  <div>{children}</div>
));
jest.mock("../../../utils/constants", () => ({
  getLocalData: () => null,
  setLocalData: () => {},
}));
jest.mock("axios");
jest.mock("../../../context/AlphabetDemoContext", () => ({
  useAlphabetDemo: () => ({
    isAlphabetDemoActive: false,
    setIsAlphabetDemoActive: () => {},
    isAlphabetDemoPopupVisible: false,
    setIsAlphabetDemoPopupVisible: () => {},
  }),
}));
jest.mock("../../../services/learnerAi/learnerAiService", () => ({
  getFetchMilestoneDetails: () =>
    Promise.resolve({ data: { milestone_level: "m1" } }),
}));
jest.mock("../../../services/orchestration/orchestrationService", () => ({
  fetchUserPoints: () => Promise.resolve({ points: 0 }),
}));
jest.mock("../../../services/utilService", () => ({
  uniqueId: () => "test-id",
}));

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe("AssesmentEnd", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AssesmentEnd />
      </MemoryRouter>
    );
  });
});
