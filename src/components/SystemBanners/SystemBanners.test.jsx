import React from "react";
import { render } from "@testing-library/react";
import SystemBanners from "./SystemBanners";

describe("SystemBanners", () => {
  it("renders without crashing", () => {
    render(<SystemBanners />);
  });
});
