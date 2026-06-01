import { replaceAll, compareArrays } from "./constants";

describe("replaceAll", () => {
  it("replaces all occurrences of a substring", () => {
    expect(replaceAll("a-b-c", "-", "/")).toBe("a/b/c");
  });

  it("returns original string when search not found", () => {
    expect(replaceAll("hello", "x", "y")).toBe("hello");
  });

  it("replaces spaces", () => {
    expect(replaceAll("hello world foo", " ", "_")).toBe("hello_world_foo");
  });

  it("handles empty replace string (deletion)", () => {
    expect(replaceAll("a1b2c3", /[0-9]/.source, "")).toBe("a1b2c3");
    expect(replaceAll("a1b2c3", "1", "")).toBe("ab2c3");
  });

  it("handles empty string input", () => {
    expect(replaceAll("", "a", "b")).toBe("");
  });
});

describe("compareArrays", () => {
  it('returns "1" for each matching element', () => {
    expect(compareArrays(["a", "b"], ["a", "b"])).toEqual(["1", "1"]);
  });

  it('returns "0" for each non-matching element', () => {
    expect(compareArrays(["a", "b"], ["x", "y"])).toEqual(["0", "0"]);
  });

  it('returns "-1" when arr2 element is empty string', () => {
    expect(compareArrays(["a", "b"], ["a", ""])).toEqual(["1", "-1"]);
  });

  it('returns "-1" when arr2 element is undefined', () => {
    expect(compareArrays(["a", "b", "c"], ["a", "b"])).toEqual([
      "1",
      "1",
      "-1",
    ]);
  });

  it('appends "-1" entries for extra arr2 elements', () => {
    expect(compareArrays(["a"], ["a", "b", "c"])).toEqual(["1", "-1", "-1"]);
  });

  it("returns empty array for two empty arrays", () => {
    expect(compareArrays([], [])).toEqual([]);
  });
});
