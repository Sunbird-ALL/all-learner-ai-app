import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { SuccessScreen } from "../SuccessScreen";
import { LevelSelector } from "../LevelSelector";
import { TryAgain } from "../TryAgain";
import { LetterGamePreview } from "./LetterGamePreview";
import { LetterHuntGameCore, type LetterHuntQuestion } from "./LetterHuntGameCore";
import { ArrowLeft, RotateCcw, TrendingUp, Globe } from "lucide-react";
import { useLearningProgress } from "../../hooks/useLearningProgress";
import { type LetterQuestion } from "../../utils/gameDataGenerators";
import { memoryGameDataLoader } from "../../utils/memoryGameDataLoader";
import { useLanguage } from "../../contexts/LanguageContext";
import { Language, getNativeLanguageName } from "../../constants/languages";
import { sessionManager } from "../../utils/sessionManager";
import { sessionTelemetryManager } from "../../utils/sessionTelemetryManager";
import { trackingAssessmentService, QuestionSummary } from "../../utils/trackingAssessmentService";

// Extended question interface for multilingual support
interface MultilingualLetterQuestion extends LetterHuntQuestion {
  // Additional properties can be added here if needed
}

interface LetterGameProps {
  onBack: () => void;
  initialLevel?: number; // Optional: set initial level when used without routing
  disableNavigation?: boolean; // Optional: disable React Router navigation
}

export function LetterGame({ onBack, initialLevel, disableNavigation = false }: LetterGameProps) {
  const navigate = useNavigate();
  const params = useParams<{ level?: string }>();
  const { level: urlLevel } = params || {};
  
  // Use internal state for level when disableNavigation is true or no URL level
  const [internalLevel, setInternalLevel] = useState<number | null>(initialLevel || null);
  
  // Use URL level if available and navigation is enabled, otherwise use internal state
  const level = disableNavigation ? (internalLevel?.toString() || undefined) : urlLevel;
  
  // Override navigate function when navigation is disabled
  const navigateHandler = disableNavigation 
    ? (path: string) => {
        // Extract level from path like "/letter-game/level/1"
        const match = path.match(/\/level\/(\d+)/);
        if (match) {
          const newLevel = parseInt(match[1]);
          setInternalLevel(newLevel);
        }
      }
    : navigate;
  
  const { 
    startSession, 
    recordAnswer, 
    endSession, 
    getGameProgress, 
    getDifficultySettings,
    manuallyAdvanceLevel
  } = useLearningProgress();

  const { selectedLanguage } = useLanguage();
  
  // Determine if we're showing level selector or playing a specific level
  const isLevelSelector = !level || level === 'select';
  const selectedLevel = level && level !== 'select' ? parseInt(level) : null;
  const showLevelSelector = isLevelSelector;
  const [questions, setQuestions] = useState<MultilingualLetterQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  // New state for retry flow: track current displayed question (may be retry with shuffled options)
  const [currentDisplayedQuestion, setCurrentDisplayedQuestion] = useState<MultilingualLetterQuestion | null>(null);
  const [totalAttempts, setTotalAttempts] = useState(0); // Track total attempts including retries
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [levelFailed, setLevelFailed] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [forcePreview, setForcePreview] = useState(false);
  const [backendCurrentLevel, setBackendCurrentLevel] = useState<number>(1);
  const [isLoadingLevel, setIsLoadingLevel] = useState(true);
  const [level1HasProgress, setLevel1HasProgress] = useState(false); // Track if level 1 has any percentage > 0%
  const [lives, setLives] = useState<number>(3); // Lives system: 3 red hearts
  const [gameEndedByLives, setGameEndedByLives] = useState(false); // Track if game ended due to lives lost
  
  // Telemetry state
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  
  // Tracking Assessment state
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [questionSummaries, setQuestionSummaries] = useState<QuestionSummary[]>([]);

  // Language-specific level configurations (using English names for all languages)
  const getLanguageLevels = (language: Language) => {
    switch (language) {
      case 'te':
        return {
          maxLevels: 10, // Standardized to 10 levels for Telugu
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'] // English level names
        };
      case 'mr':
        return {
          maxLevels: 10, // Standardized to 10 levels for Marathi
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'] // English level names
        };
      case 'kn':
        return {
          maxLevels: 10, // Standardized to 10 levels for Kannada
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'] // English level names
        };
      default:
        return {
          maxLevels: 10, // Standard levels for English
          levelNames: ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'] // English level names
        };
    }
  };

  // Use language-specific game key for progress tracking
  const gameKey = selectedLanguage ? `letterHunt_${selectedLanguage}` : 'letterHunt';
  const gameProgress = getGameProgress(gameKey);
  const currentLevel = selectedLevel || gameProgress.currentLevel;
  const difficultySettings = getDifficultySettings(gameKey, currentLevel);
  const languageLevels = getLanguageLevels(selectedLanguage || 'en');

  // Language data - now uses comprehensive letter sets from JSON
  // Note: memoryGameDataLoader only supports en, te, mr, kn (not hi)
  // Since selectedLanguage can never be 'hi' (LanguageContext blocks it), this is safe
  const getLanguageLetters = (language: Language): string[] => {
    // Ensure only supported languages are passed (fallback to 'en' if somehow 'hi' is passed)
    const supportedLanguage = (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
      ? language 
      : 'en';
    return memoryGameDataLoader.getAllLetters(supportedLanguage);
  };

  const getAudioText = (language: Language, letter: string): string => {
    // Just return the letter itself for direct pronunciation
    return letter;
  };

  // Helper function to get corresponding short/long vowel for Indic languages
  const getCorrespondingVowel = (language: Language, letter: string): string | null => {
    // Vowel pairs for Indic languages (short/long)
    const vowelPairs: Record<string, Record<string, string>> = {
      te: {
        'అ': 'ఆ', 'ఆ': 'అ',  // a/aa
        'ఇ': 'ఈ', 'ఈ': 'ఇ',  // i/ii
        'ఉ': 'ఊ', 'ఊ': 'ఉ',  // u/uu
        'ఎ': 'ఏ', 'ఏ': 'ఎ',  // e/ee
        'ఒ': 'ఓ', 'ఓ': 'ఒ',  // o/oo
      },
      kn: {
        'ಅ': 'ಆ', 'ಆ': 'ಅ',  // a/aa
        'ಇ': 'ಈ', 'ಈ': 'ಇ',  // i/ii
        'ಉ': 'ಊ', 'ಊ': 'ಉ',  // u/uu
        'ಎ': 'ಏ', 'ಏ': 'ಎ',  // e/ee
        'ಒ': 'ಓ', 'ಓ': 'ಒ',  // o/oo
      },
      mr: {
        'अ': 'आ', 'आ': 'अ',  // a/aa
        'इ': 'ई', 'ई': 'इ',  // i/ii
        'उ': 'ऊ', 'ऊ': 'उ',  // u/uu
        'ए': 'ऐ', 'ऐ': 'ए',  // e/ai
        'ओ': 'औ', 'औ': 'ओ',  // o/au
        'कि':'की', 'की':'कि',
        'गि':'गी', 'गी':'गि',
        'ति':'ती', 'ती':'ति',
        'लु':'लू', 'लू':'लु',
      }
    };

    if (language === 'te' || language === 'kn' || language === 'mr') {
      return vowelPairs[language]?.[letter] || null;
    }
    return null;
  };

  const generateMultilingualQuestions = (language: Language, level: number, complexity: string, count: number = 10): MultilingualLetterQuestion[] => {
    // Get level-appropriate letter set from JSON data
    const getLevelLetters = (language: Language, level: number): string[] => {
      // Ensure only supported languages are passed (memoryGameDataLoader doesn't support 'hi')
      // Since selectedLanguage can never be 'hi' (LanguageContext blocks it), this is a safety check
      const supportedLanguage: 'en' | 'te' | 'mr' | 'kn' = 
        (language === 'en' || language === 'te' || language === 'mr' || language === 'kn') 
          ? language 
          : 'en';
      
      // For Telugu, Kannada, and Marathi, use exact level mapping
      if (supportedLanguage === 'te' || supportedLanguage === 'kn' || supportedLanguage === 'mr') {
        const levelKey = level.toString();
        return memoryGameDataLoader.getLettersByLevel(supportedLanguage, levelKey);
      }
      
      // For other languages, use complexity mapping
      if (level <= 2) return memoryGameDataLoader.getLetters(supportedLanguage, 'basic');
      if (level <= 4) return memoryGameDataLoader.getLetters(supportedLanguage, 'intermediate');
      if (level <= 6) return memoryGameDataLoader.getLetters(supportedLanguage, 'advanced');
      if (level <= 8) return memoryGameDataLoader.getLetters(supportedLanguage, 'expert');
      return memoryGameDataLoader.getLetters(supportedLanguage, 'master');
    };
    
    const lettersToUse = getLevelLetters(language, level);
    const questions: MultilingualLetterQuestion[] = [];
    
    // Strategy:
    // 1. If we have >= count letters: use all unique letters
    // 2. If we have < count letters: use all unique letters first, then fill remaining with random unique selections
    const availableUniqueCount = Math.min(lettersToUse.length, count);
    const remainingCount = count - availableUniqueCount;
    
    // First phase: Use all available unique letters (shuffled)
    const shuffledLetters = [...lettersToUse].sort(() => Math.random() - 0.5);
    const uniqueTargets = shuffledLetters.slice(0, availableUniqueCount);
    
    // Second phase: For remaining questions, select randomly but ensure no duplicates among remaining ones
    const remainingTargets: string[] = [];
    const remainingUsed = new Set<string>();
    
    for (let i = 0; i < remainingCount; i++) {
      let target: string;
      let attempts = 0;
      const maxAttempts = 50;
      
      // Select a random letter that hasn't been used in the remaining batch
      do {
        target = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
        attempts++;
      } while (remainingUsed.has(target) && attempts < maxAttempts);
      
      remainingTargets.push(target);
      remainingUsed.add(target);
    }
    
    // Combine all targets
    const allTargets = [...uniqueTargets, ...remainingTargets];
    
    for (let i = 0; i < count; i++) {
      const target = allTargets[i];
      
      // Get corresponding vowel to exclude (for Indic languages)
      const correspondingVowel = getCorrespondingVowel(language, target);
      
      // Create options (target + 3 random unique letters)
      const options = [target];
      let attempts = 0;
      const maxAttempts = lettersToUse.length * 3; // Reasonable upper bound
      
      while (options.length < 4 && attempts < maxAttempts) {
        const randomLetter = lettersToUse[Math.floor(Math.random() * lettersToUse.length)];
        // Exclude if already in options or if it's the corresponding vowel (for Indic languages)
        const isExcluded = options.includes(randomLetter) || 
                          (correspondingVowel && randomLetter === correspondingVowel);
        if (!isExcluded) {
          options.push(randomLetter);
        }
        attempts++;
      }
      
      // Shuffle options
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }

      questions.push({
        target,
        options,
        audio: getAudioText(language, target),
        audioText: getAudioText(language, target),
        language,
        complexity
      });
    }

    return questions;
  };

  // Initialize game session and questions when language or level is selected
  useEffect(() => {
    const initializeGame = async () => {
      if (selectedLanguage && selectedLevel !== null && !isGameComplete) {
        // Add a small delay to ensure state reset completes first
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const session = startSession(gameKey);
        setPreviousLevel(currentLevel);
        
        // Initialize tracking assessment
        const now = Date.now();
        setLevelStartTime(now);
        setQuestionStartTime(now);
        setQuestionSummaries([]);
        
        // Start telemetry subsession
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        if (currentSubSession && currentSubSession.isActive) {
          await sessionTelemetryManager.endSubSession();
        }
        await sessionTelemetryManager.startSubSession(gameKey, currentLevel, selectedLanguage);
        
        const newQuestions = generateMultilingualQuestions(
          selectedLanguage,
          currentLevel,
          difficultySettings.complexity,
          10
        );
        setQuestions(newQuestions);
      }
    };
    initializeGame();
  }, [selectedLanguage, selectedLevel, gameKey, isGameComplete]);

  // Note: Page refresh is handled in App.tsx via beforeunload event
  // The initializeGame useEffect above will automatically start a new subsession after refresh

  // Fetch backend current level on mount
  useEffect(() => {
    const fetchBackendLevel = async () => {
      if (!selectedLanguage) return;
      
      const currentUser = sessionManager.getCurrentUser();
      if (!currentUser) {
        setIsLoadingLevel(false);
        return;
      }

      try {
        setIsLoadingLevel(true);
        
        // Extract game name without language suffix
        const gameName = gameKey.split('_')[0];
        
        // Search for level stats using current user
        const searchParams = {
          userId: currentUser.username,
          courseId: gameName,
          unitId: selectedLanguage
        };
        
        const result = await trackingAssessmentService.searchAssessmentTracking(searchParams);
        
        // Handle the enhanced backend response format
        if (result.success && result.data && typeof result.data === 'object') {
          // Check if level 1 has any progress (> 0%)
          const level1Data = (result.data as any)['level1'];
          const level1Percent = level1Data?.metadata?.scorePercentage ?? 0;
          const level1Completed = level1Data?.metadata?.isCompleted ?? false;
          const hasLevel1Progress = level1Completed || level1Percent > 0;
          setLevel1HasProgress(hasLevel1Progress);

          // Compute effective current level based on successful progress only
          let highestSuccessfulLevel = 0;
          Object.keys(result.data).forEach((levelKey: string) => {
            if (!levelKey.startsWith('level')) return;
            const levelNumber = parseInt(levelKey.replace('level', ''));
            if (Number.isNaN(levelNumber)) return;
            const levelData = (result.data as any)[levelKey];
            const percent = levelData?.metadata?.scorePercentage ?? 0;
            const completed = levelData?.metadata?.isCompleted ?? false;
            if (completed || percent > 0) {
              highestSuccessfulLevel = Math.max(highestSuccessfulLevel, levelNumber);
            }
          });

          const computedFromProgress = Math.min(
            Math.max(1, (highestSuccessfulLevel > 0 ? highestSuccessfulLevel + 1 : 1)),
            languageLevels.maxLevels
          );
          const backendProvided = result.metadata?.currentLevel || 1;
          const effectiveCurrentLevel = Math.min(
            Math.max(computedFromProgress, backendProvided),
            languageLevels.maxLevels
          );
          setBackendCurrentLevel(effectiveCurrentLevel);
        }
      } catch (error) {
        console.error('Error fetching backend level:', error);
      } finally {
        setIsLoadingLevel(false);
      }
    };

    fetchBackendLevel();
  }, [selectedLanguage, gameKey]);

  // Auto-show level selector when component loads
  useEffect(() => {
    if (selectedLanguage && selectedLevel === null) {
      // Level selector is now controlled by URL routing
      // No need to set showLevelSelector state
    }
  }, [selectedLanguage, selectedLevel]);

  // Reset game state when navigating to a new level via URL
  useEffect(() => {
    if (selectedLevel !== null) {
      // Reset game state when navigating to a specific level
      setCurrentQuestionIndex(0);
      setScore(0);
      setTotalCorrect(0);
      setTotalAttempts(0);
      setSelectedLetter(null);
      setShowFeedback(false);
      setIsGameComplete(false);
      setShowLevelUp(false);
      setLevelFailed(false);
      setCurrentDisplayedQuestion(null);
      setLives(3); // Reset lives to 3
      setGameEndedByLives(false); // Reset lives lost flag
      
      // Clear any stored failed level when user navigates to a level
      const failedLevelKey = `failedLevel_${gameKey}`;
      localStorage.removeItem(failedLevelKey);
    }
  }, [selectedLevel, selectedLanguage, gameKey]);

  // Helper function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Helper function to create a question with shuffled options
  const createQuestionWithShuffledOptions = useCallback((question: MultilingualLetterQuestion): MultilingualLetterQuestion => {
    return {
      ...question,
      options: shuffleArray(question.options)
    };
  }, [shuffleArray]);

  // Get the current question to display (either from original questions or retry with shuffled options)
  const currentQuestion = currentDisplayedQuestion || questions[currentQuestionIndex];
  const progressCurrent = questions.length === 0
    ? 0
    : Math.min(currentQuestionIndex + 1, questions.length);

  // Initialize currentDisplayedQuestion when questions are loaded or question index changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const originalQuestion = questions[currentQuestionIndex];
      // Create question with shuffled options for new question
      setCurrentDisplayedQuestion(createQuestionWithShuffledOptions(originalQuestion));
    }
  }, [questions, currentQuestionIndex, createQuestionWithShuffledOptions]);

  // Track question start time
  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, currentDisplayedQuestion]);

  // Handle feedback audio completion - if lives reached 0, end game after audio completes
  const handleFeedbackAudioComplete = useCallback(() => {
    if (lives === 0 && !isGameComplete) {
      setGameEndedByLives(true);
    }
  }, [lives, isGameComplete]);

  // Handle game end when all lives are lost - trigger after audio completes
  useEffect(() => {
    const handleGameEndByLives = async () => {
      if (!gameEndedByLives || isGameComplete) return; // Prevent multiple calls
      
      const totalTimeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
      const currentUser = sessionManager.getCurrentUser();
      
      if (currentUser) {
        const currentSession = sessionTelemetryManager.getCurrentSession();
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        const sessionId = currentSession?.sessionId;
        const subsessionId = currentSubSession?.subSessionId;

        // For lives lost scenario: maxScore = totalCorrect, totalScore = totalAttempts
        const totalQuestionCount = Math.max(1, currentQuestionIndex + 1); // Questions attempted
        const scorePercentage = totalQuestionCount > 0 ? (totalCorrect / totalQuestionCount) * 100 : 0;

        // Get latest question summaries
        setQuestionSummaries((latestSummaries) => {
          trackingAssessmentService.createAssessmentTracking({
            userId: currentUser.username,
            gameKey: gameKey,
            gameTitle: 'Letter Hunt Game',
            level: currentLevel,
            language: selectedLanguage || 'en',
            totalQuestions: totalCorrect, // This becomes totalMaxScore (max possible score = number of correct answers)
            correctAnswers: 0, // Not used when totalScore is provided, but required by interface
            totalScore: totalAttempts, // This becomes totalScore (actual score = number of attempts)
            timeSpent: totalTimeSpent,
            assessmentSummary: latestSummaries,
            sessionId: sessionId,
            subsessionId: subsessionId,
            metadata: {
              difficulty: difficultySettings.complexity,
              levelFailed: true,
              scorePercentage: scorePercentage,
              totalAttempts: totalAttempts,
              totalQuestionsAttempted: totalQuestionCount, // Store actual questions attempted
              gameEndedByLives: true, // Flag indicating game ended due to lives lost
              livesLost: true
            }
          });
          return latestSummaries;
        });
      }

      // End telemetry subsession and flush events
      await sessionTelemetryManager.endSubSession();
      await sessionTelemetryManager.flushAssessEventBatch();

      endSession();
      setLevelFailed(true);
      setIsGameComplete(true);
    };

    if (gameEndedByLives && lives === 0 && !isGameComplete) {
      handleGameEndByLives();
    }
  }, [gameEndedByLives, lives, isGameComplete, currentQuestionIndex, totalCorrect, totalAttempts, levelStartTime, selectedLanguage, currentLevel, difficultySettings.complexity, gameKey, endSession]);

  const handleLetterSelect = async (letter: string) => {
    if (showFeedback || isGameComplete) return;
    
    setSelectedLetter(letter);
    const correct = letter === currentQuestion.target;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Increment total attempts (including retries)
    setTotalAttempts(prev => prev + 1);
    
    // Record the answer for adaptive learning
    recordAnswer(correct);
    
    // Telemetry assess
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;
    const questionId = `letter_${currentLevel}_${currentQuestionIndex}`;
    await sessionTelemetryManager.sendAssessEvent(
      questionId,
      'letterHunt',
      letter,
      currentQuestion.target,
      correct,
      responseTime
    );
    sessionTelemetryManager.updateSubSession(correct, totalAttempts + 1);
    
    // Store question summary for tracking assessment
    const questionSummary: QuestionSummary = {
      questionId: questionId,
      questionType: 'letterHunt',
      userAnswer: letter,
      correctAnswer: currentQuestion.target,
      isCorrect: correct,
      responseTime: responseTime,
      complexity: currentQuestion.complexity || 'medium'
    };
    setQuestionSummaries(prev => [...prev, questionSummary]);
    
    if (correct) {
      setScore(prevScore => prevScore + 10);
      setTotalCorrect(prevTotal => prevTotal + 1);
    } else {
      // Lose a life on incorrect answer
      // If lives reach 0, feedback audio will play and then handleFeedbackAudioComplete will end the game
      setLives(prevLives => Math.max(0, prevLives - 1));
    }

    // Don't auto-advance - player must manually continue
  };

  const handleContinue = useCallback(async () => {
    // If game already ended by lives, don't process continue
    if (gameEndedByLives || lives === 0) {
      return;
    }

    const totalQuestionCount = questions.length || 1;
    const hasCompletedAllQuestions = totalCorrect >= totalQuestionCount && isCorrect;

    if (hasCompletedAllQuestions) {
      const attemptsForPercentage = Math.max(totalAttempts, 1);
      const scorePercentage = (totalCorrect / attemptsForPercentage) * 100;
      const canAdvance = true;

      const totalTimeSpent = Math.floor((Date.now() - levelStartTime) / 1000);

      const currentUser = sessionManager.getCurrentUser();
      if (currentUser) {
        const currentSession = sessionTelemetryManager.getCurrentSession();
        const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
        const sessionId = currentSession?.sessionId;
        const subsessionId = currentSubSession?.subSessionId;

        setQuestionSummaries((latestSummaries) => {
          const actualCorrect = latestSummaries.filter(q => q.isCorrect).length;
          const totalAttemptsLogged = latestSummaries.length;

          trackingAssessmentService.createAssessmentTracking({
            userId: currentUser.username,
            gameKey: gameKey,
            gameTitle: 'Letter Hunt Game',
            level: currentLevel,
            language: selectedLanguage || 'en',
            totalQuestions: totalCorrect, // This becomes totalMaxScore (max possible score = correct answers)
            correctAnswers: totalAttempts, // This becomes totalScore (actual score = attempts)
            totalScore: totalAttempts, // Also pass explicitly (though service calculates from correctAnswers)
            timeSpent: totalTimeSpent,
            assessmentSummary: latestSummaries,
            sessionId: sessionId,
            subsessionId: subsessionId,
            metadata: {
              difficulty: difficultySettings.complexity,
              levelFailed: false,
              scorePercentage: scorePercentage,
              totalAttempts: totalAttemptsLogged,
              gameEndedByLives: false
            }
          });
          return latestSummaries;
        });
      }

      await sessionTelemetryManager.endSubSession();
      await sessionTelemetryManager.flushAssessEventBatch();

      if (canAdvance) {
        endSession();
        const newProgress = getGameProgress(gameKey);
        if (newProgress.currentLevel > previousLevel) {
          setShowLevelUp(true);
        }
      }

      setLevelFailed(!canAdvance);
      setIsGameComplete(true);
      return;
    }

    // If answer was incorrect and lives remain, show same question with shuffled options (retry)
    if (!isCorrect && lives > 0 && currentQuestionIndex < questions.length) {
      const originalQuestion = questions[currentQuestionIndex];
      // Create new question with shuffled options for retry
      const retryQuestion = createQuestionWithShuffledOptions(originalQuestion);
      setCurrentDisplayedQuestion(retryQuestion);
      setSelectedLetter(null);
      setShowFeedback(false);
      // Reset question start time for retry
      setQuestionStartTime(Date.now());
      return;
    }
    
    // If answer was correct, move to next original question
    if (isCorrect) {
      // Move to next original question if available
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedLetter(null);
        setShowFeedback(false);
        // Reset displayed question for next question
        setCurrentDisplayedQuestion(null);
      } else {
        // No more original questions, but we haven't reached 10 attempts yet
        // All questions answered correctly but continue was triggered before state updated
        setShowFeedback(false);
        setQuestionStartTime(Date.now());
      }
    }
  }, [currentQuestionIndex, questions.length, totalCorrect, totalAttempts, isCorrect, previousLevel, gameKey, createQuestionWithShuffledOptions, levelStartTime, selectedLanguage, currentLevel, difficultySettings.complexity, getGameProgress, endSession, lives, gameEndedByLives]);

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
    setTotalAttempts(0);
    setSelectedLetter(null);
    setShowFeedback(false);
    setIsGameComplete(false);
    setShowLevelUp(false);
    setLevelFailed(false);
    setCurrentDisplayedQuestion(null);
    setLives(3); // Reset lives to 3
    setGameEndedByLives(false); // Reset lives lost flag
    
    // Reset tracking assessment state
    setLevelStartTime(Date.now());
    setQuestionSummaries([]);
    
    // Start new session and regenerate questions
    if (selectedLanguage) {
      const session = startSession(gameKey);
      const newQuestions = generateMultilingualQuestions(
        selectedLanguage,
        currentLevel,
        difficultySettings.complexity,
        10
      );
      setQuestions(newQuestions);
    }
  };


  const handleLevelSelect = (level: number) => {
    // Navigate to the specific level URL or update internal state
    navigateHandler(`/letter-game/level/${level}`);
  };

  const handleShowLevelSelector = () => {
    // Navigate to level selector or reset internal state
    navigateHandler('/letter-game');
  };

  // Handle back button with telemetry
  const handleBackWithTelemetry = async () => {
    if (selectedLevel !== null && !showLevelSelector && !isGameComplete) {
      await sessionTelemetryManager.endSubSessionWithBackButton();
    }
    onBack();
  };



  const calculateStars = () => {
    // Determine stars based on accuracy using actual attempts as the denominator
    const attemptsUsed = Math.max(totalAttempts || questions.length || 0, 1);
    const percentage = (totalCorrect / attemptsUsed) * 100;
    if (percentage === 100) return 3;
    if (percentage >= 90) return 2;
    if (percentage >= 80) return 1;
    // if (percentage >= 70) return 2;
    // if (percentage >= 60) return 1;
    return 0;
  };

  const getNewAchievements = () => {
    const achievements = [];
    if (questions.length > 0) { // Only calculate achievements if there are questions
      if (totalCorrect === questions.length) {
        achievements.push("Letter Master - Perfect Score!");
      }
      if (totalCorrect >= Math.floor(questions.length * 0.8)) {
        achievements.push("Quick Learner - Great Progress!");
      }
    }
    if (showLevelUp) {
      achievements.push(`Level Up! Advanced to next level!`);
    }
    return achievements;
  };

  // Show loading state while fetching backend level
  if (isLoadingLevel && selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show preview screen first (before level selector)
  // For individual games: Hide preview for level 2+ if level 1 has any progress > 0%
  // Show preview only if: (backend level is 1 AND level 1 has no progress) OR forcePreview is true
  const shouldShowPreview = showPreview && selectedLanguage && 
    ((backendCurrentLevel === 1 && !level1HasProgress) || forcePreview);
  
  if (shouldShowPreview) {
    return (
      <LetterGamePreview
        onStartGame={() => {
          setShowPreview(false);
          setForcePreview(false);
        }}
        onBack={() => {
          setForcePreview(false);
          onBack();
        }}
        difficulty={difficultySettings.complexity as "Easy" | "Medium" | "Hard"}
        estimatedTime="5-8 min"
        level={currentLevel}
      />
    );
  }

  // Show level selection screen if level not selected (after preview)
  if (showLevelSelector) {
    // Use the actual current level being played, not just the stored progress level
    const levelSelectorCurrentLevel = selectedLevel || gameProgress.currentLevel;
    
    return (
      <LevelSelector
        selectedLanguage={selectedLanguage}
        currentLevel={levelSelectorCurrentLevel}
        maxLevels={languageLevels.maxLevels}
        onLevelSelect={handleLevelSelect}
        onBack={() => {
          setShowPreview(true);
          onBack();
        }}
        onDemo={() => {
          setForcePreview(true);
          setShowPreview(true);
        }}
        gameTitle="Letter Recognition"
        gameKey={gameKey}
        unlockAll={true}
      />
    );
  }


  // Show success screen when game is complete
  if (isGameComplete) {
    // If level failed or ended by lives, show try again screen
    if (levelFailed || gameEndedByLives) {
      // For lives lost scenario: totalQuestions = questions attempted
      const displayQuestions = gameEndedByLives ? Math.max(1, currentQuestionIndex + 1) : questions.length;
      
      return (
        <TryAgain
          totalCorrect={totalCorrect}
          totalQuestions={displayQuestions}
          selectedLanguage={selectedLanguage!}
          currentLevel={currentLevel}
          gameKey={gameKey}
          onTryAgain={resetGame}
          onBackToHome={onBack}
          livesLost={gameEndedByLives}
        />
      );
    }
    
    // If level passed, show success screen
    return (
      <SuccessScreen
        gameTitle={'letterHunt'}
        score={totalCorrect}
        totalQuestions={questions.length}
        totalAttempts={totalAttempts}
        starsEarned={calculateStars()}
        newAchievements={getNewAchievements()}
        onPlayAgain={resetGame}
        onBackToHub={onBack}
        hasNextLevel={currentLevel < languageLevels.maxLevels}
        onNextLevel={() => {
          // ✅ MANUAL LEVEL ADVANCEMENT: Force advance to next level when user clicks "Next Level"
          const nextLevel = Math.min(currentLevel + 1, languageLevels.maxLevels);
          
          console.log(`Manual advancement: ${currentLevel} -> ${nextLevel} for ${selectedLanguage} (max: ${languageLevels.maxLevels})`);
          
          // Manually advance the level using the learning progress hook
          manuallyAdvanceLevel(gameKey, nextLevel);
          
          // Navigate to the next level URL or update internal state
          if (disableNavigation) {
            setInternalLevel(nextLevel);
          } else {
            navigateHandler(`/letter-game/level/${nextLevel}`);
          }
          
          // Clear any stored failed level when user advances to next level
          const failedLevelKey = `failedLevel_${gameKey}`;
          localStorage.removeItem(failedLevelKey);
          
          // Reset game state for new level
          setCurrentQuestionIndex(0);
          setScore(0);
          setTotalCorrect(0);
          setSelectedLetter(null);
          setShowFeedback(false);
          setIsCorrect(false);
          setShowLevelUp(false);
          setLevelFailed(false);
          setIsGameComplete(false);
          setLives(3);
          setGameEndedByLives(false);
        }}
      />
    );
  }

  // Don't render if questions aren't loaded yet
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-cool flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-cool p-2 sm:p-4 overflow-hidden flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-1.5 sm:mb-2 gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={handleBackWithTelemetry}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">Back</span>
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
              Letter Recognition
            </h1>
            <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-[10px] sm:text-xs mt-0.5">
              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>
                {selectedLevel !== null && selectedLevel !== gameProgress.currentLevel ? 
                  `Practice Level ${selectedLevel}` : 
                  `Level ${currentLevel} / ${languageLevels.maxLevels}`
                } • {difficultySettings.complexity}
              </span>
            </div>
          </div>
          
          {/* <Button 
            variant="outline" 
            onClick={resetGame}
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2"
          >
            <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </Button> */}
        </div>

        {/* Main Content Card */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Game Core Component */}
          <LetterHuntGameCore
            questions={currentDisplayedQuestion ? [currentDisplayedQuestion] : questions}
            currentQuestionIndex={0}
            selectedAnswer={selectedLetter}
            showFeedback={showFeedback}
            isCorrect={isCorrect}
            mode="game"
            onAnswerSelect={handleLetterSelect}
            onContinue={handleContinue}
            onFeedbackAudioComplete={handleFeedbackAudioComplete}
            showSpeaker={true}
            showContinueButton={true}
            showProgress={true}
            progress={{
              current: progressCurrent,
              total: questions.length,
              score: totalCorrect
            }}
            isPreview={false}
            disabled={showFeedback}
            lives={lives}
            maxLives={3}
          />
        </div>
      </div>
    </div>
  );
}

export default LetterGame;