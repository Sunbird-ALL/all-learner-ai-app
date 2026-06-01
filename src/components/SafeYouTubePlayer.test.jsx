import React from "react";
import { render, screen } from "@testing-library/react";
import SafeYouTubePlayer from "./SafeYouTubePlayer";

describe("SafeYouTubePlayer", () => {
  it("renders without crashing", () => {
    render(<SafeYouTubePlayer videoId="dQw4w9WgXcQ" />);
  });

  it("renders an iframe with the correct YouTube embed URL", () => {
    render(<SafeYouTubePlayer videoId="dQw4w9WgXcQ" />);
    const iframe = screen.getByTitle("YouTube video player");
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toContain("dQw4w9WgXcQ");
  });

  it("renders mute and fullscreen buttons", () => {
    render(<SafeYouTubePlayer videoId="abc123" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders volume slider", () => {
    render(<SafeYouTubePlayer videoId="abc123" />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
  });
});
