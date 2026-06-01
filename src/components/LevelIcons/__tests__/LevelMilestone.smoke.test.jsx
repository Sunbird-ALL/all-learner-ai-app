import React from "react";
import { render } from "@testing-library/react";
import LevelMilestone from "../LevelMilestone";

describe("LevelMilestone", () => {
  it("renders without crashing", () => {
    render(<LevelMilestone level={1} />);
  });

  it("renders different levels without crashing", () => {
    [1, 2, 3, 4, 5, 6, 7, 8].forEach((level) => {
      const { unmount } = render(<LevelMilestone level={level} />);
      unmount();
    });
  });
});
