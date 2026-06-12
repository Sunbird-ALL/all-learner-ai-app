import React from "react";
import { render } from "@testing-library/react";

import GetSetResultLoadingOverlay from "./GetSetResultLoadingOverlay";

jest.mock("../services/learnerAi/getSetResultLoading", () => ({
  subscribeGetSetResultLoading: jest.fn(() => jest.fn()),
}));
jest.mock("../utils/constants", () => ({ getLocalData: jest.fn(() => null) }));

describe("GetSetResultLoadingOverlay", () => {
  it("renders without crashing", () => {
    render(<GetSetResultLoadingOverlay />);
  });
});
