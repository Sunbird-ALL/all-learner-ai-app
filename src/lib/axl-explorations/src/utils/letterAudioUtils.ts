import { Language } from '../constants/languages';
import { englishAudioManager } from './englishAudioManager';
import { teluguAudioManager } from './teluguAudioManager';
import { kannadaAudioManager } from './kannadaAudioManager';
import { marathiAudioManager } from './marathiAudioManager';
import { hindiAudioManager } from './hindiAudioManager';
import { showSlowLoadToast } from './audioUtils';

// Resolve the correct audio manager for a language (defaults to English).
function getAudioManager(language: Language) {
  switch (language) {
    case 'en':
      return englishAudioManager;
    case 'te':
      return teluguAudioManager;
    case 'kn':
      return kannadaAudioManager;
    case 'mr':
      return marathiAudioManager;
    case 'hi':
      return hindiAudioManager;
    default:
      return englishAudioManager;
  }
}

// Map a language to its TTS locale for the SpeechSynthesis fallback.
function getTtsLang(language: Language): string {
  return language === 'te'
    ? 'te-IN'
    : language === 'kn'
    ? 'kn-IN'
    : language === 'mr'
    ? 'mr-IN'
    : language === 'hi'
    ? 'hi-IN'
    : 'en-US';
}



const blobUrlCache = new Map<string, string>();
const inFlight = new Map<string, Promise<string | null>>();
function fetchAndCache(url: string): Promise<string | null> {
  const cached = blobUrlCache.get(url);
  if (cached) return Promise.resolve(cached);

  const existing = inFlight.get(url);
  if (existing) return existing;

  const request = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return res.blob();
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      blobUrlCache.set(url, objectUrl);
      inFlight.delete(url);
      return objectUrl;
    })
    .catch(() => {
      inFlight.delete(url);
      return null;
    });

  inFlight.set(url, request);
  return request;
}


export function prefetchLetterAudio(
  letter: string,
  language: Language,
  options: { timeoutMs?: number } = {}
): Promise<void> {
  if (!letter || typeof window === 'undefined') return Promise.resolve();

  const url = getAudioManager(language).getAudioUrl(letter);
  if (blobUrlCache.has(url)) return Promise.resolve();

  const fetchPromise = fetchAndCache(url).then(() => undefined);

  if (options.timeoutMs && options.timeoutMs > 0) {
    // Safety net: never block the game forever on a stalled download.
    return Promise.race([
      fetchPromise,
      new Promise<void>((resolve) => window.setTimeout(resolve, options.timeoutMs)),
    ]);
  }
  return fetchPromise;
}

export function prefetchLetterAudioBatch(
  letters: string[],
  language: Language,
  options: { timeoutMs?: number } = {}
): Promise<void> {
  if (!Array.isArray(letters)) return Promise.resolve();
  const seen = new Set<string>();
  const pending: Promise<void>[] = [];
  for (const letter of letters) {
    if (!letter || seen.has(letter)) continue;
    seen.add(letter);
    pending.push(prefetchLetterAudio(letter, language, options));
  }
  return Promise.all(pending).then(() => undefined);
}


export async function playLetterAudio(letter: string, language: Language): Promise<void> {
  const url = getAudioManager(language).getAudioUrl(letter);

  const speakFallback = (): Promise<void> =>
    new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = getTtsLang(language);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve(); // mobile: speech synthesis blocked → don't hang
      speechSynthesis.speak(utterance);
    });

  let objectUrl = blobUrlCache.get(url) || null;
  if (!objectUrl) {
    // Not prefetched yet — download now (sharing any in-flight prefetch) and
    // show the slow-load toast if it stalls.
    let slowTimer: number | undefined = window.setTimeout(() => showSlowLoadToast(), 1000);
    objectUrl = await fetchAndCache(url);
    if (slowTimer !== undefined) {
      window.clearTimeout(slowTimer);
      slowTimer = undefined;
    }
  }

  return new Promise((resolve) => {
    const audio = new Audio(objectUrl || url);
    audio.onended = () => resolve();
    audio.onerror = () => {
      speakFallback().then(resolve);
    };
    audio.play().catch(() => {
      speakFallback().then(resolve);
    });
  });
}
