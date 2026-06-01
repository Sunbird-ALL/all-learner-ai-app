import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LoginPage from "./LoginPage";

jest.mock("../../utils/constants", () => ({
  getLocalData: jest.fn(() => null),
  setLocalData: jest.fn(),
}));

describe("LoginPage", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  });
});
