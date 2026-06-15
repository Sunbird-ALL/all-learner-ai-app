import reducer, { showSnackBar, hideSnackBar } from "./snackbar.slice";

describe("snackbar slice", () => {
  const initialState = { open: false, message: "", type: "" };

  it("returns initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("showSnackBar", () => {
    it("sets open to true with message and type", () => {
      const state = reducer(
        initialState,
        showSnackBar({ message: "Saved!", type: "success" })
      );
      expect(state).toEqual({ open: true, message: "Saved!", type: "success" });
    });

    it("overwrites a previous snackbar", () => {
      const prev = { open: true, message: "Old", type: "info" };
      const state = reducer(
        prev,
        showSnackBar({ message: "New", type: "error" })
      );
      expect(state.message).toBe("New");
      expect(state.type).toBe("error");
    });
  });

  describe("hideSnackBar", () => {
    it("resets all fields to closed state", () => {
      const prev = { open: true, message: "Hello", type: "success" };
      const state = reducer(prev, hideSnackBar());
      expect(state).toEqual(initialState);
    });

    it("is idempotent on already-closed state", () => {
      const state = reducer(initialState, hideSnackBar());
      expect(state).toEqual(initialState);
    });
  });
});
