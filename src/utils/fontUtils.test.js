import { getFontFamily, getFontFamilyByLang } from "./fontUtils";

// Mock getLocalData so getFontFamily doesn't need real localStorage
jest.mock("./constants", () => ({
  getLocalData: jest.fn(() => null),
}));

describe("getFontFamilyByLang", () => {
  it('returns Telugu font for "te"', () => {
    expect(getFontFamilyByLang("te")).toContain("Sree Krushnadevaraya");
  });

  it('returns Kannada font for "kn"', () => {
    expect(getFontFamilyByLang("kn")).toContain("Baloo Tamma 2");
  });

  it('returns Kannada font for "ka" (alias)', () => {
    expect(getFontFamilyByLang("ka")).toContain("Baloo Tamma 2");
  });

  it("returns Quicksand for English", () => {
    expect(getFontFamilyByLang("en")).toBe("Quicksand, sans-serif");
  });

  it("returns Quicksand for Hindi", () => {
    expect(getFontFamilyByLang("hi")).toBe("Quicksand, sans-serif");
  });

  it("returns Quicksand for Tamil", () => {
    expect(getFontFamilyByLang("ta")).toBe("Quicksand, sans-serif");
  });

  it("returns Quicksand for null input", () => {
    expect(getFontFamilyByLang(null)).toBe("Quicksand, sans-serif");
  });

  it("returns Quicksand for empty string", () => {
    expect(getFontFamilyByLang("")).toBe("Quicksand, sans-serif");
  });

  it("handles uppercase language codes", () => {
    expect(getFontFamilyByLang("TE")).toContain("Sree Krushnadevaraya");
  });
});

describe("getFontFamily", () => {
  it("returns Quicksand when no lang arg and localStorage returns null", () => {
    expect(getFontFamily()).toBe("Quicksand, sans-serif");
  });

  it('returns Telugu font when lang "te" passed directly', () => {
    expect(getFontFamily("te")).toContain("Sree Krushnadevaraya");
  });

  it('returns Kannada font when lang "kn" passed directly', () => {
    expect(getFontFamily("kn")).toContain("Baloo Tamma 2");
  });

  it('returns Quicksand for "en"', () => {
    expect(getFontFamily("en")).toBe("Quicksand, sans-serif");
  });
});
