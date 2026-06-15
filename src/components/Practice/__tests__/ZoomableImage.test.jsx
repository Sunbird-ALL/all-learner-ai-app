import React from "react";
import { render, screen } from "@testing-library/react";
import ZoomableImage from "../ZoomableImage";

// ZoomableImage imports from imageAudioLinks which is a large file — mock it
jest.mock("../../../utils/imageAudioLinks", () => ({}));

describe("ZoomableImage", () => {
  it("renders without crashing", () => {
    render(<ZoomableImage src="https://example.com/img.png" alt="test" />);
  });

  it("renders the image with provided src", () => {
    render(
      <ZoomableImage src="https://example.com/img.png" alt="a test image" />
    );
    const img = screen.getByRole("img", { name: "a test image" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/img.png");
  });

  it("renders zoom icon button in thumbnail variant", () => {
    render(
      <ZoomableImage
        src="https://example.com/img.png"
        alt="zoom test"
        variant="thumbnail"
      />
    );
    const zoomBtn = screen.getByRole("button", {
      name: /zoom image/i,
      hidden: true,
    });
    expect(zoomBtn).toBeInTheDocument();
  });
});
