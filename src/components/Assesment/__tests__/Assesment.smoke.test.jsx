import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AlphabetChart from "../AlphabetChart";
import AlphabetChartPreview from "../AlphabetChartPreview";

jest.mock("../../Layout/MainLayout", () => ({ children }) => (
  <div>{children}</div>
));
jest.mock("../../../utils/constants", () => ({
  getLocalData: jest.fn(() => null),
  setLocalData: jest.fn(),
}));

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe("AlphabetChart", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AlphabetChart open={false} onClose={jest.fn()} lang="en" />
      </MemoryRouter>
    );
  });
});

describe("AlphabetChartPreview", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AlphabetChartPreview language="en" />
      </MemoryRouter>
    );
  });
});
