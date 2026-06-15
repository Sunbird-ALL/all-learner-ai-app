import { safeParseJSON, reportError, flushErrorQueue } from "./errorReporter";

const QUEUE_KEY = "all_error_queue";

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("safeParseJSON", () => {
  it("parses valid JSON", () => {
    expect(safeParseJSON('{"a":1}')).toEqual({ a: 1 });
  });

  it("returns null for invalid JSON by default", () => {
    expect(safeParseJSON("not-json")).toBeNull();
  });

  it("returns provided fallback for invalid JSON", () => {
    expect(safeParseJSON("bad", [])).toEqual([]);
  });

  it("returns null for null input", () => {
    expect(safeParseJSON(null)).toBeNull();
  });

  it("parses arrays", () => {
    expect(safeParseJSON("[1,2,3]")).toEqual([1, 2, 3]);
  });
});

describe("reportError", () => {
  it("calls fetch with POST and JSON content-type", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    await reportError({ type: "js_error", message: "test error" });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  it("enriches payload with ts and url", async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    await reportError({ type: "js_error" });
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body).toHaveProperty("ts");
    expect(body).toHaveProperty("url");
  });

  it("buffers error to localStorage when fetch fails", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    await reportError({ type: "js_error", message: "fail" });
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    expect(queue.length).toBe(1);
    expect(queue[0].type).toBe("js_error");
  });
});

describe("flushErrorQueue", () => {
  it("does nothing when queue is empty", async () => {
    global.fetch.mockResolvedValue({ ok: true });
    await flushErrorQueue();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("sends queued errors and clears localStorage on success", async () => {
    const errors = [
      { type: "js_error", ts: 1 },
      { type: "api_error", ts: 2 },
    ];
    localStorage.setItem(QUEUE_KEY, JSON.stringify(errors));
    global.fetch.mockResolvedValue({ ok: true });

    await flushErrorQueue();

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem(QUEUE_KEY)).toBeNull();
  });

  it("stops flushing and keeps remaining items when fetch fails midway", async () => {
    const errors = [{ type: "err1" }, { type: "err2" }, { type: "err3" }];
    localStorage.setItem(QUEUE_KEY, JSON.stringify(errors));

    global.fetch
      .mockResolvedValueOnce({ ok: true })
      .mockRejectedValueOnce(new Error("fail"));

    await flushErrorQueue();

    const remaining = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    expect(remaining.length).toBe(2);
  });

  it("caps the queue at 50 entries via bufferError", async () => {
    // Fill 50 existing items
    const existing = Array.from({ length: 50 }, (_, i) => ({ type: `e${i}` }));
    localStorage.setItem(QUEUE_KEY, JSON.stringify(existing));

    // reportError with failing fetch will try to push a 51st
    global.fetch.mockRejectedValueOnce(new Error("fail"));
    await reportError({ type: "overflow" });

    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    expect(queue.length).toBe(50);
    // The oldest entry should have been evicted
    expect(queue[49].type).toBe("overflow");
  });
});
