import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook for Web Speech API integration.
 * Handles voice selection for English (en-IN) and Tamil (ta-IN).
 * Properly handles voice loading timing issues.
 */
export const useSpeech = () => {
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Load voices and set up listener for voice changes
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log("Voices loaded:", voices.length);
      }
    };

    // Initial load
    loadVoices();

    // Listen for voices changed event (some browsers load voices asynchronously)
    if ("speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      }
    };
  }, []);

  const cancelSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const playSpeech = useCallback((text, language = "en") => {
    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (voices.length === 0) {
      console.warn("No voices available yet, attempting to speak anyway");
    }

    const targetLang = language === "ta" ? "ta-IN" : "en-IN";
    const voice =
      voices.find((v) => v.lang === targetLang) ||
      voices.find((v) => v.lang.startsWith(language === "ta" ? "ta" : "en"));

    if (voice) {
      utterance.voice = voice;
      console.log("Using voice:", voice.name, voice.lang);
    } else {
      console.warn(`No ${targetLang} voice found, using default`);
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    utterance.onend = () => {
      console.log("Speech completed");
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  return { playSpeech, cancelSpeech, isSpeaking, voicesLoaded };
};
