import { levenshtein, phoneticMatch } from "./phoneticUtils";

describe("levenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshtein("hello", "hello")).toBe(0);
  });

  it("returns string length when other string is empty", () => {
    expect(levenshtein("abc", "")).toBe(3);
    expect(levenshtein("", "xyz")).toBe(3);
  });

  it("returns 1 for single substitution", () => {
    expect(levenshtein("cat", "bat")).toBe(1);
  });

  it("returns 1 for single insertion", () => {
    expect(levenshtein("cat", "cats")).toBe(1);
  });

  it("returns 1 for single deletion", () => {
    expect(levenshtein("cats", "cat")).toBe(1);
  });

  it("computes correct distance for different words", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
  });

  it("returns 0 for two empty strings", () => {
    expect(levenshtein("", "")).toBe(0);
  });
});

describe("phoneticMatch", () => {
  it("returns 100 for identical words", () => {
    expect(phoneticMatch("cat", "cat")).toBe(100);
  });

  it("returns a number between 0 and 100", () => {
    const result = phoneticMatch("hello", "helo");
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it("returns high similarity for similar-sounding words", () => {
    const result = phoneticMatch("phone", "fone");
    expect(result).toBeGreaterThan(50);
  });

  it("returns lower similarity for very different words", () => {
    const result = phoneticMatch("apple", "zebra");
    expect(result).toBeLessThan(80);
  });
});
