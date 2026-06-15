import React from "react";
import { render } from "@testing-library/react";
import DemoCompletionScreen from "../DemoCompletionScreen";

describe("DemoCompletionScreen", () => {
  it("renders without crashing", () => {
    render(<DemoCompletionScreen onStartGame={jest.fn()} onBack={jest.fn()} />);
  });
});
