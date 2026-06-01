import axios from "axios";
import { evaluateText, handleTextEvaluation } from "./evaluationService";

jest.mock("axios");
jest.mock("../../utils/errorReporter", () => ({ reportError: jest.fn() }));

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe("evaluateText", () => {
  it("posts formData and returns response data", async () => {
    const mockData = { responseObj: { responseDataParams: { data: [] } } };
    axios.post.mockResolvedValueOnce({ data: mockData });

    const formData = new FormData();
    const result = await evaluateText(formData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("evaluateText"),
      formData
    );
    expect(result).toEqual(mockData);
  });

  it("throws and reports error on failure", async () => {
    const error = new Error("Network error");
    error.response = { status: 500, data: { message: "server error" } };
    axios.post.mockRejectedValueOnce(error);

    await expect(evaluateText(new FormData())).rejects.toThrow("Network error");
  });
});

describe("handleTextEvaluation", () => {
  it('prepends "1. " to both teacher and student text', async () => {
    const mockResponse = {
      responseObj: {
        responseDataParams: {
          data: [
            {
              marks: 8,
              semantics: 7,
              context: 6,
              grammar: 5,
              accuracy: 9,
              overall: 7,
            },
          ],
        },
      },
    };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    await handleTextEvaluation("The cat sat", "The cat sat on mat");

    const formData = axios.post.mock.calls[0][1];
    expect(formData.get("teacherText")).toBe("1. The cat sat");
    expect(formData.get("studentText")).toBe("1. The cat sat on mat");
  });

  it("returns structured result with all expected fields", async () => {
    const mockResponse = {
      responseObj: {
        responseDataParams: {
          data: [
            {
              marks: 8,
              semantics: 7,
              context: 6,
              grammar: 5,
              accuracy: 9,
              overall: 7,
            },
          ],
        },
      },
    };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await handleTextEvaluation("teacher text", "student text");

    expect(result).toEqual({
      marks: 8,
      grades: 8,
      semantics: 7,
      context: 6,
      grammar: 5,
      accuracy: 9,
      overall: 7,
    });
  });

  it("returns null when api call fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("fail"));
    const result = await handleTextEvaluation("a", "b");
    expect(result).toBeNull();
  });

  it("returns zeroed result when response data is empty", async () => {
    const mockResponse = { responseObj: { responseDataParams: { data: [] } } };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await handleTextEvaluation("a", "b");

    expect(result).toEqual({
      marks: 0,
      grades: 0,
      semantics: 0,
      context: 0,
      grammar: 0,
      accuracy: 0,
      overall: 0,
    });
  });
});
