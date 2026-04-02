import {
  collectionForSet,
  categoryToContentType,
  resolveAfterSetComplete,
  getInitialSetTag,
} from "./discoverSetFlow";

describe("discoverSetFlow", () => {
  test("getInitialSetTag", () => {
    expect(getInitialSetTag()).toBe("set4");
  });

  test("collectionForSet finds by tag", () => {
    const data = {
      data: [
        { collectionId: "a", tags: ["ASER", "set2"] },
        { collectionId: "b", tags: ["ASER", "set4"] },
      ],
    };
    expect(collectionForSet(data, "set4")?.collectionId).toBe("b");
    expect(collectionForSet(data, "set1")).toBeNull();
  });

  test("categoryToContentType", () => {
    expect(categoryToContentType("Char")).toBe("Char");
    expect(categoryToContentType("Word")).toBe("Word");
    expect(categoryToContentType("story")).toBe("Sentence");
  });

  const P = "pass";
  const F = "fail";

  test("path1 M4 Towre", () => {
    const h = [
      { setTag: "set4", result: P },
      { setTag: "set5", result: P },
      { setTag: "set6", result: P },
    ];
    const r = resolveAfterSetComplete(h);
    expect(r.type).toBe("terminal");
    expect(r.landing).toBe("M4");
    expect(r.towre).toBe(true);
  });

  test("path2 M3 Towre", () => {
    const r = resolveAfterSetComplete([
      { setTag: "set4", result: P },
      { setTag: "set5", result: P },
      { setTag: "set6", result: F },
    ]);
    expect(r.landing).toBe("M3");
    expect(r.towre).toBe(true);
  });

  test("path3 M3 Towre", () => {
    const r = resolveAfterSetComplete([
      { setTag: "set4", result: P },
      { setTag: "set5", result: F },
      { setTag: "set3", result: P },
    ]);
    expect(r.landing).toBe("M3");
    expect(r.towre).toBe(true);
  });

  test("path4 M2", () => {
    const r = resolveAfterSetComplete([
      { setTag: "set4", result: P },
      { setTag: "set5", result: F },
      { setTag: "set3", result: F },
    ]);
    expect(r.landing).toBe("M2");
    expect(r.towre).toBe(false);
  });

  test("path5 M2", () => {
    const r = resolveAfterSetComplete([
      { setTag: "set4", result: F },
      { setTag: "set2", result: P },
      { setTag: "set3", result: P },
    ]);
    expect(r.landing).toBe("M2");
    expect(r.towre).toBe(false);
  });

  test("path6 M1", () => {
    const r = resolveAfterSetComplete([
      { setTag: "set4", result: F },
      { setTag: "set2", result: P },
      { setTag: "set3", result: F },
    ]);
    expect(r.landing).toBe("M1");
  });

  test("path7 M1", () => {
    const r = resolveAfterSetComplete([
      { setTag: "set4", result: F },
      { setTag: "set2", result: F },
      { setTag: "set1", result: P },
    ]);
    expect(r.landing).toBe("M1");
  });

  test("path8 F1", () => {
    const r = resolveAfterSetComplete([
      { setTag: "set4", result: F },
      { setTag: "set2", result: F },
      { setTag: "set1", result: F },
    ]);
    expect(r.landing).toBe("F1");
    expect(r.towre).toBe(false);
  });

  test("next after set4 pass", () => {
    expect(resolveAfterSetComplete([{ setTag: "set4", result: P }])).toEqual({
      type: "load",
      setTag: "set5",
    });
  });

  test("next after set4 fail", () => {
    expect(resolveAfterSetComplete([{ setTag: "set4", result: F }])).toEqual({
      type: "load",
      setTag: "set2",
    });
  });
});
