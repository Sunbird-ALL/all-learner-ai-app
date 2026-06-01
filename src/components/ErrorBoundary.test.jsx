import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

jest.mock("../utils/errorReporter", () => ({ reportError: jest.fn() }));

// Silence React's console.error for expected boundary errors
beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error("Test error");
  return <div>Child content</div>;
};

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("shows the reload button in error state", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
  });

  it("shows description text in error state", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
  });

  it("calls reportError when a child throws", () => {
    const { reportError } = require("../utils/errorReporter");
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(reportError).toHaveBeenCalledWith(
      expect.objectContaining({ type: "react_error" })
    );
  });
});
