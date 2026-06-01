import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ServerErrorScreen from "./ServerErrorScreen";

describe("ServerErrorScreen", () => {
  it("renders without crashing", () => {
    render(<ServerErrorScreen />);
  });

  it("displays a heading", () => {
    render(<ServerErrorScreen />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    const onRetry = jest.fn();
    render(<ServerErrorScreen onRetry={onRetry} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
