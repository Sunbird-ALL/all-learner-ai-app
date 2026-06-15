import { compareWords, transliterateKannadaToLatin } from "./textUtils";

describe("compareWords", () => {
  it("returns 100% similarity for identical words", () => {
    const result = compareWords("apple", "apple");
    expect(result.similarity).toBe(100);
    expect(result.isFine).toBe(true);
  });

  it("returns isFine=true for similar-sounding words", () => {
    const result = compareWords("phone", "fone");
    expect(result.isFine).toBe(true);
  });

  it("returns isFine=false for very different words", () => {
    const result = compareWords("apple", "zebra");
    expect(result.isFine).toBe(false);
  });

  it("includes metaphone1 and metaphone2 in result", () => {
    const result = compareWords("cat", "kat");
    expect(result).toHaveProperty("metaphone1");
    expect(result).toHaveProperty("metaphone2");
  });

  it("includes similarity score as a number", () => {
    const result = compareWords("hello", "helo");
    expect(typeof result.similarity).toBe("number");
  });

  it("handles exact match with full score", () => {
    const result = compareWords("dog", "dog");
    expect(result.similarity).toBe(100);
  });
});

describe("transliterateKannadaToLatin", () => {
  it("returns a string", () => {
    const result = transliterateKannadaToLatin("ಕ");
    expect(typeof result).toBe("string");
  });

  it("returns lowercase output", () => {
    const result = transliterateKannadaToLatin("ಕ");
    expect(result).toBe(result.toLowerCase());
  });

  it("handles empty string without throwing", () => {
    expect(() => transliterateKannadaToLatin("")).not.toThrow();
  });
});
