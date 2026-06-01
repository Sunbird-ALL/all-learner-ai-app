import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import DiscoverEnd from "../DiscoverEnd";

jest.mock("../../../utils/constants", () => ({
  getLocalData: jest.fn(() => null),
  setLocalData: jest.fn(),
  LetsStart: () => <span>Start</span>,
}));

jest.mock("../../../services/learnerAi/learnerAiService", () => ({
  getFetchMilestoneDetails: jest.fn(() =>
    Promise.resolve({ data: { milestone_level: "m1" } })
  ),
}));

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe("DiscoverEnd", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <DiscoverEnd />
      </MemoryRouter>
    );
  });
});
