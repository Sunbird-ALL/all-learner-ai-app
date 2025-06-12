import { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

let ffmpeg = null;
let loadingPromise = null;

const useFFmpeg = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        if (!ffmpeg) {
          ffmpeg = createFFmpeg({
            log: false,
            corePath:
              "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
          });
        }

        if (!loadingPromise) {
          loadingPromise = ffmpeg.load();
        }

        await loadingPromise;
        setLoading(false);
      } catch (err) {
        console.error("Error loading FFmpeg:", err);
        setError(err);
        setLoading(false);
      }
    };

    loadFFmpeg();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return { ffmpeg, loading, error };
};

export default useFFmpeg;
