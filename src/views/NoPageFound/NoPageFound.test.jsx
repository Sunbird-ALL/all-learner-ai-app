import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import NoPageFound from "./NoPageFound";

jest.mock("../../config/config", () => ({
  APP_CONSTANTS: { PAGE_NOT_FOUND: "Page Not Found" },
}));

describe("NoPageFound", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <NoPageFound />
      </MemoryRouter>
    );
  });

  it("displays page not found text", () => {
    render(
      <MemoryRouter>
        <NoPageFound />
      </MemoryRouter>
    );
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });
});
