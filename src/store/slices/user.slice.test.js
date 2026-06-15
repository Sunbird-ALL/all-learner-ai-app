import reducer, {
  setUser,
  setIsDone,
  setOTPSent,
  setOtpVerified,
  setVirtualId,
} from "./user.slice";

describe("user slice", () => {
  const initialState = {
    isApiDone: false,
    isOtpVerified: false,
    username: "",
    id: 0,
    mobile: "",
    otpSent: false,
    virtualId: null,
  };

  it("returns initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  describe("setUser", () => {
    it("sets id and mobile, marks isApiDone true, resets isOtpVerified", () => {
      const state = reducer(
        { ...initialState, isOtpVerified: true },
        setUser({ id: 42, mobile: "9876543210" })
      );
      expect(state.id).toBe(42);
      expect(state.mobile).toBe("9876543210");
      expect(state.isApiDone).toBe(true);
      expect(state.isOtpVerified).toBe(false);
    });
  });

  describe("setIsDone", () => {
    it("sets isApiDone flag", () => {
      const state = reducer(initialState, setIsDone({ isApiDone: true }));
      expect(state.isApiDone).toBe(true);
    });

    it("can reset isApiDone to false", () => {
      const prev = { ...initialState, isApiDone: true };
      const state = reducer(prev, setIsDone({ isApiDone: false }));
      expect(state.isApiDone).toBe(false);
    });
  });

  describe("setOTPSent", () => {
    it("sets otpSent flag to true", () => {
      const state = reducer(initialState, setOTPSent({ otpSent: true }));
      expect(state.otpSent).toBe(true);
    });

    it("can reset otpSent to false", () => {
      const prev = { ...initialState, otpSent: true };
      const state = reducer(prev, setOTPSent({ otpSent: false }));
      expect(state.otpSent).toBe(false);
    });
  });

  describe("setOtpVerified", () => {
    it("sets isOtpVerified to true", () => {
      const state = reducer(
        initialState,
        setOtpVerified({ isOtpVerified: true })
      );
      expect(state.isOtpVerified).toBe(true);
    });
  });

  describe("setVirtualId", () => {
    it("sets virtualId from payload", () => {
      const state = reducer(initialState, setVirtualId("virt-123"));
      expect(state.virtualId).toBe("virt-123");
    });

    it("can set virtualId to null", () => {
      const prev = { ...initialState, virtualId: "old-id" };
      const state = reducer(prev, setVirtualId(null));
      expect(state.virtualId).toBeNull();
    });
  });
});
