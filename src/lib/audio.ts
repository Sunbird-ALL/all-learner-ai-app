/*
 * Centralized audio URL builder.
 *
 * Default behavior (standalone direct deploy): returns origin-rooted URLs
 * like "/audio/foo.wav" — same as before this helper existed.
 *
 * Iframe deployment: set REACT_APP_AUDIO_BASE=/all-app at build time so URLs
 * become "/all-app/audio/foo.wav" and resolve to the all-app folder under
 * the parent host.
 *
 * Future CDN migration: set REACT_APP_AUDIO_BASE=https://cdn.example.com to
 * point all audio at a CDN — no code changes needed.
 */

/*
 * Safety: the prefix is applied ONLY when BOTH conditions are true:
 *   1. REACT_APP_IS_APP_IFRAME === "true"  (we're being built for iframe mode)
 *   2. REACT_APP_AUDIO_BASE is set         (a non-empty prefix has been provided)
 *
 * If either is missing or wrong, BASE falls back to "" — URLs stay as
 * "/audio/..." (today's standalone behavior). This way, an accidental
 * REACT_APP_AUDIO_BASE in a standalone deployment can't break audio.
 */
const IS_IFRAME = process.env.REACT_APP_IS_APP_IFRAME === 'true';
const AUDIO_BASE = process.env.REACT_APP_AUDIO_BASE || '';
const BASE: string = IS_IFRAME && AUDIO_BASE ? AUDIO_BASE : '';

export const audioUrl = (relativePath: string): string => {
    const clean = relativePath.replace(/^\/?(audio\/)?/, '');
    return `${BASE}/audio/${clean}`;
};

/*
 * Language code → folder name mapping used by per-letter audio.
 * Only te / kn / mr have dedicated folders; everything else (including 'hi'
 * and 'en') falls back to the 'english' folder — this exactly mirrors the
 * pre-existing if-else behavior in the consuming game components.
 */
const LETTER_LANGUAGE_FOLDER: Record<string, string> = {
    te: 'telugu',
    kn: 'kannada',
    mr: 'marathi',
};

// Build the URL for a single-letter audio file given a language code.
// Equivalent to:
//   te → audioUrl(`telugu/letter/${letter}.wav`)
//   kn → audioUrl(`kannada/letter/${letter}.wav`)
//   mr → audioUrl(`marathi/letter/${letter}.wav`)
//   default → audioUrl(`english/letter/${letter}.wav`)
export const letterAudioUrl = (lang: string, letter: string): string => {
    const folder = LETTER_LANGUAGE_FOLDER[lang] ?? 'english';
    return audioUrl(`${folder}/letter/${letter}.wav`);
};

// Build the URL for a sound-match audio file used by multiple game components.
// Equivalent to: audioUrl(`audio-preview/combined-word-games/sound-match/${language}/${word}.wav`)
export const soundMatchAudioUrl = (language: string, word: string): string =>
    audioUrl(`audio-preview/combined-word-games/sound-match/${language}/${word}.wav`);
