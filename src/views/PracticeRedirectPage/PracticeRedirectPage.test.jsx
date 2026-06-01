import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PracticeRedirectPage from "./PracticeRedirectPage";

describe("PracticeRedirectPage", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <PracticeRedirectPage />
      </MemoryRouter>
    );
  });
});
