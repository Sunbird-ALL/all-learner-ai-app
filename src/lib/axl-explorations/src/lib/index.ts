// Library entry point for axl-explorations
// Export LetterGame and all necessary components, contexts, and utilities

// Main game component
export { LetterGame } from '../components/games/LetterGame';
export { LetterHuntGameCore, type LetterHuntQuestion } from '../components/games/LetterHuntGameCore';
export { LetterGamePreview } from '../components/games/LetterGamePreview';

// Contexts
export { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
export { AudioLanguageProvider, useAudioLanguage } from '../contexts/AudioLanguageContext';

// Utilities
export { memoryGameDataLoader } from '../utils/memoryGameDataLoader';
export { generateLetterQuestions } from '../utils/gameDataGenerators';
export * from '../utils/audioUtils';
export { englishAudioManager } from '../utils/englishAudioManager';
export { teluguAudioManager } from '../utils/teluguAudioManager';
export { kannadaAudioManager } from '../utils/kannadaAudioManager';
export { marathiAudioManager } from '../utils/marathiAudioManager';

// Session management
export { sessionManager } from '../utils/sessionManager';
export { sessionTelemetryManager } from '../utils/sessionTelemetryManager';

// Constants
export type { Language } from '../constants/languages';
export { LANGUAGES, getNativeLanguageName } from '../constants/languages';

// Supporting components
export { SuccessScreen } from '../components/SuccessScreen';
export { LevelSelector } from '../components/LevelSelector';
export { TryAgain } from '../components/TryAgain';
export { ProgressBar } from '../components/ProgressBar';

// Types
export type { LetterQuestion } from '../utils/gameDataGenerators';

