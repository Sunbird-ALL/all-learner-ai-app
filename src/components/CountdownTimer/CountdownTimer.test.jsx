import React from "react";
import { render, screen, act } from "@testing-library/react";
import CountdownTimer from "./CountdownTimer";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("CountdownTimer", () => {
  it("displays the initial count", () => {
    render(<CountdownTimer initialCount={3} onComplete={jest.fn()} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("decrements count after 1 second", () => {
    render(<CountdownTimer initialCount={3} onComplete={jest.fn()} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("decrements to 1 after 2 seconds", () => {
    render(<CountdownTimer initialCount={3} onComplete={jest.fn()} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calls onComplete when count reaches 0", () => {
    const onComplete = jest.fn();
    render(<CountdownTimer initialCount={3} onComplete={onComplete} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("uses default initialCount of 3", () => {
    render(<CountdownTimer onComplete={jest.fn()} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders progress dots", () => {
    render(<CountdownTimer initialCount={3} onComplete={jest.fn()} />);
    // 3 progress dots
    const dots = screen.getAllByTestId("progress-dot");
    expect(dots.length).toBe(3);
  });
});
