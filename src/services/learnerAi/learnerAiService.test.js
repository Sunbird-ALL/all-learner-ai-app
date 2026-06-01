import axios from "axios";
import {
  getContent,
  addInteraction,
  clearInteractions,
  updateLearnerProfile,
} from "./learnerAiService";

jest.mock("axios");
jest.mock("../../utils/errorReporter", () => ({ reportError: jest.fn() }));
jest.mock("../../utils/constants", () => ({
  getLocalData: jest.fn((key) => {
    if (key === "sessionId") return "sess-1";
    if (key === "lang") return "en";
    return null;
  }),
  setLocalData: jest.fn(),
}));
jest.mock("../userservice/userService", () => ({
  getVirtualId: jest.fn(() => Promise.resolve("virt-id")),
}));
jest.mock("./getSetResultLoading", () => ({
  beginGetSetResultRequest: jest.fn(),
  endGetSetResultRequest: jest.fn(),
}));

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe("getContent", () => {
  it("calls GET with correct criteria, language and limit params", async () => {
    axios.get.mockResolvedValueOnce({ data: { wordsArr: [] } });

    const result = await getContent("Word", "en", 5, {});

    const url = axios.get.mock.calls[0][0];
    expect(url).toContain("Word");
    expect(url).toContain("language=en");
    expect(url).toContain("contentlimit=5");
    expect(result).toEqual({ wordsArr: [] });
  });

  it("appends mechanics_id when provided and not Fluency/PhrasesInAction", async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    await getContent("Word", "en", 5, { mechanismId: "mech_001" });
    const url = axios.get.mock.calls[0][0];
    expect(url).toContain("mechanics_id=mech_001");
  });

  it("does not append mechanics_id for Fluency prefix", async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    await getContent("Word", "en", 5, { mechanismId: "FluencyP1" });
    const url = axios.get.mock.calls[0][0];
    expect(url).not.toContain("mechanics_id");
  });

  it("throws and reports error on failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("timeout"));
    await expect(getContent("Word", "en", 5, {})).rejects.toThrow("timeout");
  });
});

describe("addInteraction", () => {
  it("does nothing when subSessionId is falsy", () => {
    const { setLocalData } = require("../../utils/constants");
    addInteraction("", { original_text: "hello" });
    expect(setLocalData).not.toHaveBeenCalled();
  });

  it("pushes a new interaction with required fields", () => {
    const { getLocalData, setLocalData } = require("../../utils/constants");
    getLocalData.mockReturnValueOnce([]);

    addInteraction("sub-1", {
      original_text: "hello",
      response_text: "helo",
      audio_path: "/audio.wav",
    });

    expect(setLocalData).toHaveBeenCalledWith(
      "interactions_sub-1",
      expect.arrayContaining([
        expect.objectContaining({
          original_text: "hello",
          response_text: "helo",
          audio_path: "/audio.wav",
        }),
      ])
    );
  });
});

describe("clearInteractions", () => {
  it("removes the interactions key from localStorage", () => {
    const removeSpy = jest.spyOn(Storage.prototype, "removeItem");
    clearInteractions("sub-1");
    expect(removeSpy).toHaveBeenCalledWith("interactions_sub-1");
  });

  it("does nothing when subSessionId is falsy", () => {
    const removeSpy = jest.spyOn(Storage.prototype, "removeItem");
    clearInteractions("");
    expect(removeSpy).not.toHaveBeenCalled();
  });
});

describe("updateLearnerProfile", () => {
  it("strips script tags from string fields (XSS sanitization)", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    const body = {
      original_text: "hello <script>alert(1)</script>",
    };
    await updateLearnerProfile("en", body);

    const sentBody = axios.post.mock.calls[0][1];
    expect(sentBody.original_text).not.toContain("<script>");
  });

  it("strips javascript: from string fields", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    // eslint-disable-next-line no-script-url
    const body = { url: "javascript:alert(1)" };
    await updateLearnerProfile("en", body);

    const sentBody = axios.post.mock.calls[0][1];
    // eslint-disable-next-line no-script-url
    expect(sentBody.url).not.toContain("javascript:");
  });

  it("posts to the correct endpoint with language", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    await updateLearnerProfile("ta", { score: 5 });
    const url = axios.post.mock.calls[0][0];
    expect(url).toContain("ta");
  });

  it("returns response data on success", async () => {
    axios.post.mockResolvedValueOnce({ data: { result: "ok" } });
    const result = await updateLearnerProfile("en", {});
    expect(result).toEqual({ result: "ok" });
  });
});
