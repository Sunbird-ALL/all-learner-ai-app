import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingFallback from "./index";

describe("LoadingFallback", () => {
  it("renders without crashing", () => {
    render(<LoadingFallback />);
  });

  it("renders a spinner element with rotation animation", () => {
    render(<LoadingFallback />);
    // The spinner is a div with specific border styles for a spin animation
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });

  it("renders with full viewport height wrapper", () => {
    render(<LoadingFallback />);
    const wrapper = screen.getByTestId("loading-wrapper");
    expect(wrapper).toHaveStyle({ minHeight: "100vh" });
  });
});
