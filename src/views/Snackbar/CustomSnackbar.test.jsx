import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "../../store/slices/snackbar.slice";
import userReducer from "../../store/slices/user.slice";
import CustomSnackbar from "./CustomSnackbar";

const makeStore = (snackbarState) =>
  configureStore({
    reducer: { snackbar: snackbarReducer, user: userReducer },
    preloadedState: { snackbar: snackbarState },
  });

describe("CustomSnackbar", () => {
  it("renders without crashing when closed", () => {
    const store = makeStore({ open: false, message: "", type: "" });
    render(
      <Provider store={store}>
        <CustomSnackbar />
      </Provider>
    );
  });

  it("shows message when open", () => {
    const store = makeStore({
      open: true,
      message: "Saved successfully!",
      type: "success",
    });
    render(
      <Provider store={store}>
        <CustomSnackbar />
      </Provider>
    );
    expect(screen.getByText("Saved successfully!")).toBeInTheDocument();
  });
});
