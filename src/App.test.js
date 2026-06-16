/**
 * App smoke test — verifies the root component renders without crashing.
 * All heavy dependencies are mocked to isolate App's own logic.
 */
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// ─── Test ─────────────────────────────────────────────────────────────────

import App from "./App";

// ─── Mocks ────────────────────────────────────────────────────────────────

jest.mock("./utils/constants", () => ({
  getLocalData: jest.fn(() => null),
  setLocalData: jest.fn(),
}));
jest.mock("./utils/errorReporter", () => ({ reportError: jest.fn() }));
jest.mock("./services/telemetryService", () => ({
  initialize: jest.fn(),
  error: jest.fn(),
  Log: jest.fn(),
}));
jest.mock("./utils/fontUtils", () => ({
  getFontFamily: jest.fn(() => "Quicksand, sans-serif"),
}));
jest.mock("./views/AppContent/AppContent", () => () => (
  <div data-testid="app-content" />
));
jest.mock("./components/GetSetResultLoadingOverlay", () => () => null);
jest.mock("./components/SystemBanners/SystemBanners", () => () => null);
jest.mock("./components/ServerErrorScreen/ServerErrorScreen", () => () => null);
jest.mock("./config/config", () => ({
  RESILIENCE_CONFIG: { axioRetryEnabled: false, axiosRetryDelaysSec: "" },
  APP_CONSTANTS: {},
}));
jest.mock("axios", () => ({
  interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  defaults: { headers: { common: {} } },
}));
jest.mock("./context/SessionExpiredProvider", () => ({
  SessionExpiredProvider: ({ children }) => <>{children}</>,
}));
jest.mock("@tekdi/all-telemetry-sdk/index.js", () => ({}), { virtual: true });
// ─── Store ────────────────────────────────────────────────────────────────

const store = configureStore({
  reducer: {
    snackbar: (s = { open: false, message: "", type: "" }) => s,
    user: (s = { isApiDone: false, id: 0, mobile: "", virtualId: null }) => s,
  },
});

test("App renders without crashing", () => {
  expect(() =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    )
  ).not.toThrow();
});
