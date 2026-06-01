import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import DiscoverSentance from "../DiscoverSentance";

jest.mock("../../Layout/MainLayout", () => ({ children }) => (
  <div>{children}</div>
));
jest.mock("axios");
jest.mock("../../../utils/constants", () => ({
  getLocalData: jest.fn(() => null),
  setLocalData: jest.fn(),
}));

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe("DiscoverSentance", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <DiscoverSentance contentData={[]} />
      </MemoryRouter>
    );
  });
});
