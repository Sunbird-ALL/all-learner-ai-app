import { renderHook, act, waitFor } from "@testing-library/react";
import usePreloadAudio from "./usePreloadAudio";

beforeEach(() => {
  global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = jest.fn();
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});

describe("usePreloadAudio", () => {
  it("returns null initially", async () => {
    // fetch that resolves after we check the initial state
    let resolvePromise;
    global.fetch = jest.fn(
      () =>
        new Promise((res) => {
          resolvePromise = res;
        })
    );
    const { result, unmount } = renderHook(() =>
      usePreloadAudio("https://example.com/audio.mp3")
    );
    expect(result.current).toBeNull();
    // resolve and unmount cleanly so the state update happens inside act
    await act(async () => {
      resolvePromise({ blob: () => Promise.resolve(new Blob()) });
    });
    unmount();
  });

  it("returns blob URL after successful fetch", async () => {
    const mockBlob = new Blob(["audio data"], { type: "audio/mp3" });
    global.fetch = jest.fn(() =>
      Promise.resolve({ blob: () => Promise.resolve(mockBlob) })
    );

    const { result } = renderHook(() =>
      usePreloadAudio("https://example.com/audio.mp3")
    );

    await waitFor(() => {
      expect(result.current).toBe("blob:mock-url");
    });

    expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
  });

  it("remains null when fetch fails", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    const { result } = renderHook(() =>
      usePreloadAudio("https://example.com/audio.mp3")
    );

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it("re-fetches when audioUrl changes", async () => {
    const mockBlob = new Blob(["audio"], { type: "audio/mp3" });
    global.fetch = jest.fn(() =>
      Promise.resolve({ blob: () => Promise.resolve(mockBlob) })
    );

    const { rerender } = renderHook(({ url }) => usePreloadAudio(url), {
      initialProps: { url: "https://example.com/audio1.mp3" },
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    rerender({ url: "https://example.com/audio2.mp3" });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });
});
