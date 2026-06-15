import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RetryDialog from "../RetryDialog";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("RetryDialog", () => {
  it("renders without crashing", () => {
    renderWithRouter(<RetryDialog />);
  });

  it("shows default message when none provided", () => {
    renderWithRouter(<RetryDialog />);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("shows custom message when provided", () => {
    renderWithRouter(<RetryDialog message="Connection lost. Please retry." />);
    expect(
      screen.getByText("Connection lost. Please retry.")
    ).toBeInTheDocument();
  });

  it('shows "Oops..." heading', () => {
    renderWithRouter(<RetryDialog />);
    expect(screen.getByText("Oops...")).toBeInTheDocument();
  });

  it("calls onRetry when Retry button is clicked", () => {
    const onRetry = jest.fn();
    renderWithRouter(<RetryDialog onRetry={onRetry} />);
    fireEvent.click(screen.getByText("Retry"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
