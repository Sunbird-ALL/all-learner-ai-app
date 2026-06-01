import axios from "axios";
import { fetchAssessmentData, fetchPaginatedContent } from "./contentService";

jest.mock("axios");

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe("fetchAssessmentData", () => {
  it("posts with ASER tag and given language", async () => {
    axios.post.mockResolvedValueOnce({ data: { collections: [] } });

    const result = await fetchAssessmentData("en");

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining(""),
      expect.objectContaining({ tags: ["ASER"], language: "en" }),
      expect.any(Object)
    );
    expect(result).toEqual({ collections: [] });
  });

  it("throws when the request fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network error"));
    await expect(fetchAssessmentData("en")).rejects.toThrow("Network error");
  });

  it("passes different languages correctly", async () => {
    axios.post.mockResolvedValueOnce({ data: { collections: [] } });
    await fetchAssessmentData("ta");
    const body = axios.post.mock.calls[0][1];
    expect(body.language).toBe("ta");
  });
});

describe("fetchPaginatedContent", () => {
  it("builds URL with page, limit, collectionId and multilingual=true", async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    const result = await fetchPaginatedContent("col-123", 10, 2);

    const url = axios.get.mock.calls[0][0];
    expect(url).toContain("page=2");
    expect(url).toContain("limit=10");
    expect(url).toContain("collectionId=col-123");
    expect(url).toContain("multilingual=true");
    expect(result).toEqual({ data: [] });
  });

  it("defaults to page=1 when not provided", async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    await fetchPaginatedContent("col-abc", 5);
    const url = axios.get.mock.calls[0][0];
    expect(url).toContain("page=1");
  });

  it("throws when the request fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Timeout"));
    await expect(fetchPaginatedContent("col-x", 5)).rejects.toThrow("Timeout");
  });
});
