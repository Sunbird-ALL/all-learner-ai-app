import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layouts.jsx/MainLayout";
import {
  getLocalData,
  setLocalData,
  practiceSteps,
  levelGetContent,
} from "../../utils/constants";
import { addLesson } from "../../services/orchestration/orchestrationService";
import { getF3FlowStep, advanceF3Flow, F3_FLOW } from "../../RFlow/F3";

// Import from library
import {
  LetterLauncherGameCore,
  LanguageProvider,
  AudioLanguageProvider,
  sessionManager,
  sessionTelemetryManager,
  SpaceBackground,
  playLetterAudio,
  FuelProgressBar,
  getFuelRequirement,
  getMissionDestination,
  calculateFuel,
  TryAgain,
  SuccessScreen,
} from "../../lib/axl-explorations/src/lib/index";
import { trackingAssessmentService } from "../../lib/axl-explorations/src/utils/trackingAssessmentService";

/**
 * Wrapper component that integrates axl-explorations ROARRapidVisualGameCore
 * into the Practice.jsx mechanics system for F3 flow Letter Launcher
 */
const LetterLauncherMechanicsContent = ({
  page,
  setPage,
  level, // Starting level (1, 2, 3, etc.)
  header,
  points,
  steps,
  currentStep,
  progressData,
  showProgress,
  background,
  handleNext,
  handleBack,
  enableNext,
  setEnableNext,
  isShowCase,
  loading,
  setOpenMessageDialog,
  vocabCount,
  wordCount,
  showTimer,
  milestoneLevel,
  endLevel, // Optional: end level for level range
  startShowCase,
  setStartShowCase,
  setProgressData,
  setCurrentQuestion,
  applyStep,
  failRedirect,
  passRedirect,
  isF3FlowActive,
  f3FlowStep,
  contentType = "letter", // "letter" or "syllable"
  contentCount = 10,
}) => {
  const [currentGameLevel, setCurrentGameLevel] = useState(level || 1);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const navigate = useNavigate();

  // Reset currentGameLevel when level prop changes (e.g., when step changes)
  useEffect(() => {
    if (level && level !== currentGameLevel) {
      setCurrentGameLevel(level);
    }
  }, [level]);

  // Ensure isShowCase is a boolean (handle undefined case)
  const effectiveIsShowCase = isShowCase === true;

  // For Apply steps, initialize startShowCase to false if not provided
  // This ensures the start screen shows before the game begins
  const [localStartShowCase, setLocalStartShowCase] = useState(
    startShowCase !== undefined
      ? startShowCase
      : effectiveIsShowCase
      ? false
      : true
  );

  // Use prop if provided, otherwise use local state
  const effectiveStartShowCase =
    startShowCase !== undefined ? startShowCase : localStartShowCase;
  const effectiveSetStartShowCase = setStartShowCase || setLocalStartShowCase;

  const lang = getLocalData("lang") || "en";

  // Map language to library Language type
  const initialLanguage =
    lang === "en"
      ? "en"
      : lang === "te"
      ? "te"
      : lang === "kn"
      ? "kn"
      : lang === "mr"
      ? "mr"
      : "en";
  const initialAudioLanguage = initialLanguage;

  // Initialize telemetry session before game starts
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const currentUser = sessionManager.getCurrentUser();
        let userId = "anonymous";

        if (currentUser && currentUser.username) {
          userId = currentUser.username;
        } else {
          const storedUser =
            localStorage.getItem("user") || localStorage.getItem("username");
          if (storedUser) {
            userId = storedUser;
          }
        }

        const currentSession = sessionTelemetryManager.getCurrentSession();
        if (!currentSession || !currentSession.isActive) {
          await sessionTelemetryManager.startUserSession(userId);
          console.log(
            "✅ Telemetry session initialized for Letter Launcher game"
          );
        }

        setSessionInitialized(true);
      } catch (error) {
        console.warn("Failed to initialize telemetry session:", error);
        setSessionInitialized(true);
      }
    };

    const timeoutId = setTimeout(() => {
      console.warn("Session initialization timeout - proceeding anyway");
      setSessionInitialized(true);
    }, 3000);

    document.body.classList.add("letter-launcher-active");

    initializeSession();

    return () => {
      document.body.classList.remove("letter-launcher-active");
      clearTimeout(timeoutId);
    };
  }, []);

  const handleGameBack = () => {
    if (handleBack) {
      handleBack();
    }
  };

  // Generate questions based on contentType
  const generateQuestions = () => {
    const questions = [];
    const letters =
      contentType === "letter"
        ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
        : ["at", "an", "in", "on", "am", "it", "up", "en", "ed", "ot"];

    for (let i = 0; i < contentCount; i++) {
      const audioLetter = letters[Math.floor(Math.random() * letters.length)];
      // Randomly decide if displayed letter matches audio (70% match, 30% mismatch)
      const isMatch = Math.random() > 0.3;
      const displayedLetter = isMatch
        ? audioLetter
        : letters[Math.floor(Math.random() * letters.length)];

      questions.push({
        audioLetter,
        displayedLetter,
        isMatch,
        complexity: "simple",
        language: initialLanguage,
      });
    }

    return questions;
  };

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [currentFuel, setCurrentFuel] = useState(0);
  const [fuelEarned, setFuelEarned] = useState(null);
  const [questionSummaries, setQuestionSummaries] = useState([]);
  const [levelStartTime, setLevelStartTime] = useState(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  // Get F3 flow assessment parameters from config
  const getF3AssessmentParams = () => {
    if (!isF3FlowActive || !f3FlowStep?.step) {
      return {
        sub_session_id: undefined,
        sub_milestone_level: undefined,
        apply_level: undefined,
        sub_apply_level: undefined,
      };
    }

    // Get sub_session_id from telemetry
    const currentSubSession = sessionTelemetryManager.getCurrentSubSession();
    const sub_session_id = currentSubSession?.subSessionId;

    // For F3 flow, sub_milestone_level is always "F3"
    const sub_milestone_level = "F3";

    // Get step title from F3 config
    const lang = getLocalData("lang") || "en";
    const f3Config = levelGetContent[lang]?.["F3"];
    const f3StepConfig =
      f3Config && Array.isArray(f3Config) && f3Config[f3FlowStep.index]
        ? f3Config[f3FlowStep.index]
        : null;
    const stepTitle =
      f3StepConfig?.title ||
      (f3FlowStep.step?.type === "A"
        ? `A${f3FlowStep.step?.step}`
        : f3FlowStep.step?.type === "P"
        ? `P${f3FlowStep.step?.step}`
        : null);

    // Determine apply_level - use step title for all F3 flow steps
    const apply_level = stepTitle || undefined;

    return {
      sub_session_id,
      sub_milestone_level,
      apply_level,
      // sub_apply_level will be set dynamically based on currentGameLevel
    };
  };

  const assessmentParams = getF3AssessmentParams();

  // Reset completion state when step changes (detected by f3FlowStep change)
  useEffect(() => {
    if (isF3FlowActive && f3FlowStep?.step) {
      // Reset completion state when step changes
      setIsGameComplete(false);
      setLevelFailed(false);
      setCurrentQuestionIndex(0);
      setCorrectCount(0);
      setWrongCount(0);
      setCurrentFuel(0);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setShowLetter(false);
      setFuelEarned(null);
      setQuestionStartTime(null);
      // Regenerate questions for new step
      if (sessionInitialized) {
        const newQuestions = generateQuestions();
        setQuestions(newQuestions);
      }
    }
  }, [
    isF3FlowActive,
    f3FlowStep?.step?.step,
    f3FlowStep?.step?.type,
    contentType,
    contentCount,
    sessionInitialized,
  ]);

  useEffect(() => {
    if (sessionInitialized) {
      const generatedQuestions = generateQuestions();
      setQuestions(generatedQuestions);
      // Initialize level start time and reset question summaries
      setLevelStartTime(Date.now());
      setQuestionSummaries([]);
      setTotalTimeSpent(0);
    }
  }, [sessionInitialized, contentType, contentCount]);

  // Play audio and show letter after audio ends
  // For Apply steps, don't start until startShowCase is true
  useEffect(() => {
    if (
      !sessionInitialized ||
      questions.length === 0 ||
      showFeedback ||
      isGameComplete
    ) {
      return;
    }

    // For Apply steps, wait for start screen to be dismissed
    if (effectiveIsShowCase && !effectiveStartShowCase) {
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const playQuestionAudio = async () => {
      setShowLetter(false);
      setIsPlayingAudio(true);

      // Play audio
      await playLetterAudio(currentQuestion.audioLetter, initialLanguage);

      // After audio ends, show the letter
      setShowLetter(true);
      setIsPlayingAudio(false);
      setQuestionStartTime(Date.now());
    };

    playQuestionAudio();
  }, [
    sessionInitialized,
    questions,
    currentQuestionIndex,
    showFeedback,
    isGameComplete,
    effectiveIsShowCase,
    effectiveStartShowCase,
  ]);

  // Start timer when start screen is dismissed for Apply steps
  useEffect(() => {
    if (
      effectiveIsShowCase &&
      effectiveStartShowCase &&
      sessionInitialized &&
      questions.length > 0 &&
      !isGameComplete &&
      !isTimerRunning
    ) {
      // Start the timer for Apply steps when game begins
      setIsTimerRunning(true);
      setTimeRemaining(30);
    }
  }, [
    effectiveIsShowCase,
    effectiveStartShowCase,
    sessionInitialized,
    questions.length,
    isGameComplete,
  ]);

  // Timer countdown for Apply steps
  useEffect(() => {
    if (
      effectiveIsShowCase &&
      effectiveStartShowCase &&
      isTimerRunning &&
      timeRemaining > 0
    ) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    effectiveIsShowCase,
    effectiveStartShowCase,
    isTimerRunning,
    timeRemaining,
  ]);

  const handleTimeUp = () => {
    setIsTimerRunning(false);
    // Check pass criteria based on contentCount
    // For Apply steps, check if fuel requirement is met (fuel is primary metric)
    // For Practice steps, check fuel OR correct count (70% accuracy)
    const { requiredFuel } = getFuelRequirement(currentGameLevel, contentCount);
    const hasEnoughFuel = currentFuel >= requiredFuel;
    // Calculate correct count threshold based on contentCount (70% accuracy, minimum 7)
    const minCorrectThreshold = Math.max(7, Math.floor(contentCount * 0.7));
    const hasEnoughCorrect = correctCount >= minCorrectThreshold;

    if (effectiveIsShowCase) {
      // For Apply steps: pass if user has enough fuel (fuel is the primary metric)
      // Fuel already accounts for both speed and accuracy
      if (hasEnoughFuel) {
        handleLevelPass();
      } else {
        handleLevelFail();
      }
    } else {
      // For Practice steps: pass if user has enough fuel OR enough correct answers
      // Fuel is preferred metric, but also allow passing with good accuracy
      // Use the threshold calculated above (70% accuracy, minimum 7)
      if (hasEnoughFuel || hasEnoughCorrect) {
        handleLevelPass();
      } else {
        handleLevelFail();
      }
    }
  };

  const handleAnswerSelect = (isMatch) => {
    if (showFeedback || isPlayingAudio || !showLetter) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrectAnswer = isMatch === currentQuestion.isMatch;

    // Calculate fuel based on response time
    let fuelResult = null;
    if (questionStartTime) {
      const responseTime = Date.now() - questionStartTime;
      fuelResult = calculateFuel(responseTime, isCorrectAnswer);
      if (isCorrectAnswer) {
        setCurrentFuel((prev) => prev + fuelResult.fuelEarned);
      }
    }

    setSelectedAnswer(isMatch);
    setShowFeedback(true);
    setIsCorrect(isCorrectAnswer);
    setFuelEarned(fuelResult);

    // Track question for assessment
    const responseTime = questionStartTime ? Date.now() - questionStartTime : 0;
    const questionSummary = {
      questionId: `q${currentQuestionIndex + 1}`,
      questionType: "letterLauncher", // Required by QuestionSummary interface
      userAnswer: isMatch ? "match" : "no_match",
      correctAnswer: currentQuestion.isMatch ? "match" : "no_match",
      isCorrect: isCorrectAnswer,
      responseTime: responseTime,
      complexity: currentQuestion.complexity || "simple",
    };
    setQuestionSummaries((prev) => [...prev, questionSummary]);

    if (isCorrectAnswer) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    // Move to next question after feedback
    // DO NOT update progress here - only update when ALL questions are complete
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question - game is still in progress
        setCurrentQuestionIndex((prev) => prev + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
        setShowLetter(false);
        setFuelEarned(null);
        // DO NOT call handleNext here - game is not complete yet
      } else {
        // Completed all questions in this level
        // Check pass criteria before deciding what to do
        const { requiredFuel } = getFuelRequirement(
          currentGameLevel,
          contentCount
        );
        const hasEnoughFuel = currentFuel >= requiredFuel;
        // Calculate correct count threshold based on contentCount (70% accuracy, minimum 7)
        const minCorrectThreshold = Math.max(7, Math.floor(contentCount * 0.7));
        const hasEnoughCorrect = correctCount >= minCorrectThreshold;

        // Debug logging
        console.log("Letter Launcher - Pass/Fail Check:", {
          correctCount,
          contentCount,
          minCorrectThreshold,
          hasEnoughCorrect,
          currentFuel,
          requiredFuel,
          hasEnoughFuel,
          isShowCase,
          effectiveIsShowCase,
          isShowCaseType: typeof isShowCase,
          willUseFuelCheck: effectiveIsShowCase,
        });

        // For Apply steps (effectiveIsShowCase), pass if user has enough fuel
        // For Practice steps (!effectiveIsShowCase), pass if user has enough correct answers
        if (effectiveIsShowCase) {
          // For Apply steps: pass if user has enough fuel (fuel is the primary metric)
          // Fuel already accounts for both speed and accuracy
          if (hasEnoughFuel) {
            // User passed - check if more levels to complete
            // For Apply steps with endLevel, check if we need to continue to next level
            // For Practice steps or when endLevel is undefined, complete immediately
            if (endLevel && currentGameLevel < endLevel) {
              // Move to next level - user passed this level
              setCurrentGameLevel((prev) => prev + 1);
              setCurrentQuestionIndex(0);
              setCorrectCount(0);
              setWrongCount(0);
              setShowFeedback(false);
              setSelectedAnswer(null);
              setShowLetter(false);
              setFuelEarned(null);
              setCurrentFuel(0);
              setQuestionSummaries([]);
              setLevelStartTime(Date.now());
              const newQuestions = generateQuestions();
              setQuestions(newQuestions);
              // DO NOT call handleNext - more levels to complete
            } else {
              // All levels completed and passed - show success screen
              handleLevelPass();
            }
          } else {
            // User failed - show failure screen, do NOT advance
            handleLevelFail();
          }
        } else {
          // Practice step: pass if user has enough fuel OR enough correct answers
          // Fuel is preferred metric, but also allow passing with good accuracy
          // Use the same threshold calculated above (70% accuracy, minimum 7)
          if (hasEnoughFuel || hasEnoughCorrect) {
            // User passed - show success screen
            handleStepComplete();
          } else {
            // User failed - show failure screen, do NOT advance
            handleLevelFail();
          }
        }
      }
    }, 2000);
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setShowLetter(false);
    }
  };

  const [levelFailed, setLevelFailed] = useState(false);

  const handleLevelPass = async () => {
    setIsTimerRunning(false);
    setIsGameComplete(true);
    setLevelFailed(false);

    // Calculate total time spent
    const timeSpent = levelStartTime
      ? Math.round((Date.now() - levelStartTime) / 1000)
      : 0;
    setTotalTimeSpent((prev) => prev + timeSpent);

    // Call assessment API
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser && questionSummaries.length > 0) {
      const sessionId = sessionTelemetryManager.getCurrentSession()?.sessionId;
      const subsessionId =
        sessionTelemetryManager.getCurrentSubSession()?.subSessionId;
      const actualCorrect = questionSummaries.filter((q) => q.isCorrect).length;
      const finalFuel = currentFuel;
      const { requiredFuel } = getFuelRequirement(
        currentGameLevel,
        contentCount
      );
      const missionDestination = getMissionDestination(currentGameLevel);

      try {
        await trackingAssessmentService.createAssessmentTracking({
          userId: currentUser.username,
          gameKey: `letterLauncher_${initialLanguage}`,
          gameTitle: "Letter Launcher",
          level: currentGameLevel,
          language: initialLanguage,
          totalQuestions: questionSummaries.length,
          correctAnswers: actualCorrect,
          totalScore: finalFuel,
          timeSpent: timeSpent,
          assessmentSummary: questionSummaries,
          sessionId: sessionId,
          subsessionId: subsessionId,
          sub_session_id: assessmentParams.sub_session_id,
          sub_milestone_level: assessmentParams.sub_milestone_level,
          apply_level: assessmentParams.apply_level,
          sub_apply_level: effectiveIsShowCase ? currentGameLevel : undefined,
          metadata: {
            difficulty: "simple",
            levelFailed: false,
            scorePercentage: (actualCorrect / questionSummaries.length) * 100,
            fuelEarned: finalFuel,
            fuelRequired: requiredFuel,
            missionDestination: missionDestination,
          },
        });
        console.log(
          "Letter Launcher assessment tracking created for level:",
          currentGameLevel
        );
      } catch (error) {
        console.error("Error creating assessment tracking:", error);
      }
    }

    // For Apply steps, check if all levels are passed
    // Only check endLevel if it's defined (Apply steps), otherwise complete immediately
    if (effectiveIsShowCase && endLevel && currentGameLevel >= endLevel) {
      // All levels passed - show success screen, then user can continue to next step
      // Don't call handleNext immediately - let user see success screen
      // The SuccessScreen's Continue button will advance the flow
    } else if (effectiveIsShowCase) {
      // Move to next level within the same Apply step - DO NOT update progress yet
      // Game continues with next level, so progress should not be updated
      // This only happens if user PASSED the current level
      setCurrentGameLevel((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      setCorrectCount(0);
      setWrongCount(0);
      setIsGameComplete(false);
      setIsTimerRunning(false);
      setLevelFailed(false);
      setQuestionSummaries([]);
      setLevelStartTime(Date.now());
      const newQuestions = generateQuestions();
      setQuestions(newQuestions);
      // DO NOT call handleNext here - more levels to complete within this Apply step
    }
  };

  const handleLevelFail = async () => {
    setIsTimerRunning(false);
    setIsGameComplete(true);
    setLevelFailed(true);

    // Calculate total time spent
    const timeSpent = levelStartTime
      ? Math.round((Date.now() - levelStartTime) / 1000)
      : 0;

    // Call assessment API for failed level
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser && questionSummaries.length > 0) {
      const sessionId = sessionTelemetryManager.getCurrentSession()?.sessionId;
      const subsessionId =
        sessionTelemetryManager.getCurrentSubSession()?.subSessionId;
      const actualCorrect = questionSummaries.filter((q) => q.isCorrect).length;
      const finalFuel = currentFuel;
      const { requiredFuel } = getFuelRequirement(
        currentGameLevel,
        contentCount
      );
      const missionDestination = getMissionDestination(currentGameLevel);

      try {
        await trackingAssessmentService.createAssessmentTracking({
          userId: currentUser.username,
          gameKey: `letterLauncher_${initialLanguage}`,
          gameTitle: "Letter Launcher",
          level: currentGameLevel,
          language: initialLanguage,
          totalQuestions: questionSummaries.length,
          correctAnswers: actualCorrect,
          totalScore: finalFuel,
          timeSpent: timeSpent,
          assessmentSummary: questionSummaries,
          sessionId: sessionId,
          subsessionId: subsessionId,
          sub_session_id: assessmentParams.sub_session_id,
          sub_milestone_level: assessmentParams.sub_milestone_level,
          apply_level: assessmentParams.apply_level,
          sub_apply_level: effectiveIsShowCase ? currentGameLevel : undefined,
          metadata: {
            difficulty: "simple",
            levelFailed: true,
            scorePercentage: (actualCorrect / questionSummaries.length) * 100,
            fuelEarned: finalFuel,
            fuelRequired: requiredFuel,
            missionDestination: missionDestination,
          },
        });
        console.log(
          "Letter Launcher assessment tracking created for failed level:",
          currentGameLevel
        );
      } catch (error) {
        console.error("Error creating assessment tracking:", error);
      }
    }

    // Show failure screen - don't call handleNext immediately
    // User can choose to play again or go back
  };

  const handleStepComplete = async () => {
    // Only mark as complete and update progress when ALL questions are answered
    // This function is only called when we've answered the last question
    setIsGameComplete(true);
    setLevelFailed(false);

    // Calculate total time spent
    const timeSpent = levelStartTime
      ? Math.round((Date.now() - levelStartTime) / 1000)
      : 0;

    // Call assessment API for Practice steps
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser && questionSummaries.length > 0) {
      const sessionId = sessionTelemetryManager.getCurrentSession()?.sessionId;
      const subsessionId =
        sessionTelemetryManager.getCurrentSubSession()?.subSessionId;
      const actualCorrect = questionSummaries.filter((q) => q.isCorrect).length;
      const finalFuel = currentFuel;
      const { requiredFuel } = getFuelRequirement(
        currentGameLevel,
        contentCount
      );
      const missionDestination = getMissionDestination(currentGameLevel);

      try {
        await trackingAssessmentService.createAssessmentTracking({
          userId: currentUser.username,
          gameKey: `letterLauncher_${initialLanguage}`,
          gameTitle: "Letter Launcher",
          level: currentGameLevel,
          language: initialLanguage,
          totalQuestions: questionSummaries.length,
          correctAnswers: actualCorrect,
          totalScore: finalFuel,
          timeSpent: timeSpent,
          assessmentSummary: questionSummaries,
          sessionId: sessionId,
          subsessionId: subsessionId,
          sub_session_id: assessmentParams.sub_session_id,
          sub_milestone_level: assessmentParams.sub_milestone_level,
          apply_level: assessmentParams.apply_level,
          metadata: {
            difficulty: "simple",
            levelFailed: false,
            scorePercentage: (actualCorrect / questionSummaries.length) * 100,
            fuelEarned: finalFuel,
            fuelRequired: requiredFuel,
            missionDestination: missionDestination,
          },
        });
        console.log(
          "Letter Launcher assessment tracking created for Practice step"
        );
      } catch (error) {
        console.error("Error creating assessment tracking:", error);
      }
    }

    // Show completion screen - don't call handleNext immediately
    // User can see results before proceeding
  };

  const resetGame = () => {
    // Reset game state for "Play Again" or "Try Again"
    // IMPORTANT: This does NOT advance the flow - user retries the same step
    setIsGameComplete(false);
    setLevelFailed(false);
    setCurrentQuestionIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentFuel(0);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setShowLetter(false);
    setFuelEarned(null);
    setQuestionStartTime(null);
    setQuestionSummaries([]);
    setLevelStartTime(Date.now());
    setIsTimerRunning(false);
    setTimeRemaining(30);
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    if (effectiveIsShowCase) {
      // Reset to the current level (don't change level - user retries same level)
      setCurrentGameLevel(currentGameLevel);
      // Show start screen again for Apply steps
      effectiveSetStartShowCase(false);
    }
  };

  if (!sessionInitialized || questions.length === 0) {
    return (
      <MainLayout
        page={header}
        showTimer={false}
        setPage={setPage}
        level={milestoneLevel || "B"}
        flowNames={[]}
        activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
        progressData={progressData}
        showProgress={showProgress}
        points={points}
        vocabCount={vocabCount}
        wordCount={wordCount}
        handleBack={handleBack}
        isShowCase={effectiveIsShowCase}
        startShowCase={effectiveStartShowCase}
        setStartShowCase={effectiveSetStartShowCase}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading game...</p>
        </div>
      </MainLayout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Get fuel requirements and mission destination
  const { requiredFuel, maxFuel } = getFuelRequirement(
    currentGameLevel,
    contentCount
  );
  const missionDestination = getMissionDestination(currentGameLevel);

  // Show completion screen when game is complete
  if (isGameComplete) {
    const finalFuel = currentFuel;
    const totalQuestions = questions.length;
    const totalCorrect = correctCount;

    // Check if level passed (for Apply steps, check fuel; for Practice, check if all questions answered)
    // For Apply steps: must have enough fuel to pass
    // For Practice steps: must have at least one correct answer
    const hasPassed = effectiveIsShowCase
      ? finalFuel >= requiredFuel
      : totalCorrect > 0; // Practice steps pass if at least one correct

    // If level failed OR didn't pass criteria, show failure screen
    // User must retry the same step - do NOT advance flow
    if (levelFailed || !hasPassed) {
      // Show failure screen with fuel display
      return (
        <MainLayout
          page={header}
          setPage={setPage}
          level={milestoneLevel || "B"}
          flowNames={[]}
          showTimer={false}
          activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
          progressData={progressData}
          showProgress={showProgress}
          points={points}
          vocabCount={vocabCount}
          wordCount={wordCount}
          handleBack={handleBack}
          isShowCase={effectiveIsShowCase}
          startShowCase={effectiveStartShowCase}
          setStartShowCase={effectiveSetStartShowCase}
        >
          <div
            style={{
              height: "100%",
              maxHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <TryAgain
              totalCorrect={totalCorrect}
              totalQuestions={totalQuestions}
              selectedLanguage={initialLanguage}
              currentLevel={currentGameLevel}
              gameKey={`letterLauncher_${initialLanguage}`}
              onTryAgain={resetGame}
              onBackToHome={handleGameBack}
              fuelMode={true}
              fuelCollected={finalFuel}
              fuelRequired={requiredFuel}
              destination={missionDestination}
              useSpaceBackground={true}
            />
          </div>
        </MainLayout>
      );
    }

    // Show success screen
    const starsEarned = effectiveIsShowCase
      ? finalFuel < requiredFuel
        ? 1
        : finalFuel - requiredFuel > (maxFuel - requiredFuel) / 2
        ? 3
        : 2
      : 3; // Practice steps always get 3 stars

    return (
      <MainLayout
        page={header}
        setPage={setPage}
        level={milestoneLevel || "B"}
        flowNames={[]}
        activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
        progressData={progressData}
        showProgress={showProgress}
        points={points}
        showTimer={false}
        vocabCount={vocabCount}
        wordCount={wordCount}
        handleBack={handleBack}
        isShowCase={effectiveIsShowCase}
        startShowCase={effectiveStartShowCase}
        setStartShowCase={effectiveSetStartShowCase}
      >
        <SpaceBackground
          className="h-full w-full"
          style={{ height: "100%", maxHeight: "100vh", overflow: "auto" }}
        >
          <div
            style={{
              height: "100%",
              maxHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <SuccessScreen
              gameTitle="Letter Launcher"
              score={totalCorrect}
              totalQuestions={totalQuestions}
              starsEarned={starsEarned}
              onPlayAgain={resetGame}
              onBackToHub={handleGameBack}
              hasNextLevel={true}
              onNextLevel={async () => {
                // Continue to next step/level - clear completion state and advance
                setIsGameComplete(false);
                setLevelFailed(false);

                // Advance F3 flow and save progress if F3 flow is active
                if (isF3FlowActive && f3FlowStep?.step) {
                  // Get current F3 flow step before advancing
                  const currentF3FlowStep = getF3FlowStep();

                  // Advance F3 flow
                  const nextStep = advanceF3Flow();

                  // Get updated F3 flow step after advancement
                  const updatedF3FlowStep = getF3FlowStep();

                  if (updatedF3FlowStep.step) {
                    // Save progress to backend (like LetterHuntMechanics does)
                    const lang = getLocalData("lang") || "en";
                    const sessionId = getLocalData("sessionId");
                    const totalF3Steps = F3_FLOW.length;
                    const currentPracticeProgress = Math.round(
                      ((updatedF3FlowStep.index + 1) / totalF3Steps) * 100
                    );

                    try {
                      await addLesson({
                        sessionId: sessionId,
                        milestone: "practice",
                        lesson: updatedF3FlowStep.index.toString(),
                        progress: currentPracticeProgress,
                        language: lang,
                        milestoneLevel: "B",
                      });
                      console.log(
                        "F3 flow progress saved by LetterLauncherMechanics:",
                        {
                          index: updatedF3FlowStep.index,
                          progress: currentPracticeProgress,
                        }
                      );
                    } catch (e) {
                      console.error(
                        "Error storing F3 flow progress in LetterLauncherMechanics:",
                        e
                      );
                    }

                    // Update local storage
                    const updatedPracticeProgress = {
                      currentQuestion: 0,
                      currentPracticeProgress: currentPracticeProgress,
                      currentPracticeStep: updatedF3FlowStep.index,
                    };
                    setLocalData(
                      "practiceProgress",
                      JSON.stringify(updatedPracticeProgress)
                    );

                    // Update parent state if setProgressData is provided
                    if (
                      setProgressData &&
                      typeof setProgressData === "function"
                    ) {
                      setProgressData(updatedPracticeProgress);
                    }

                    // Reset currentQuestion state to 0 so handleNext doesn't increment
                    if (
                      setCurrentQuestion &&
                      typeof setCurrentQuestion === "function"
                    ) {
                      setCurrentQuestion(0);
                    }

                    // Set a flag to indicate F3 flow was already advanced by LetterLauncherMechanics
                    // This prevents handleNext from calling addLesson again
                    setLocalData("f3FlowAdvancedByLetterLauncher", "true");
                  }
                }

                // Call handleNext to move to next step (it will skip addLesson if flag is set)
                if (handleNext) {
                  handleNext();
                }
              }}
              continueButtonText="Continue"
            />
          </div>
        </SpaceBackground>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      page={header}
      setPage={setPage}
      level={milestoneLevel || "B"}
      flowNames={[]}
      activeFlow={isF3FlowActive ? `P${f3FlowStep?.step?.step || 1}` : ""}
      progressData={progressData}
      showProgress={showProgress}
      points={points}
      vocabCount={vocabCount}
      wordCount={wordCount}
      handleBack={handleBack}
      isShowCase={isShowCase}
      startShowCase={effectiveStartShowCase}
      setStartShowCase={effectiveSetStartShowCase}
      showTimer={false}
    >
      <SpaceBackground
        className="h-full w-full p-2 sm:p-4 overflow-hidden flex flex-col"
        style={{ height: "100%", minHeight: "100%" }}
      >
        <div
          className="max-w-6xl mx-auto w-full flex-1 flex flex-col"
          style={{ height: "100%", minHeight: 0 }}
        >
          {/* Header */}
          <div className="relative flex flex-row items-center mb-1.5 sm:mb-2 gap-2 flex-shrink-0">
            <button
              onClick={handleGameBack}
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 hover:text-white text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 z-10 rounded-md flex items-center"
            >
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2 text-center w-full">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white drop-shadow-lg leading-tight">
                Letter Launcher
              </h1>
              <div className="hidden sm:flex items-center justify-center gap-1.5 text-white/80 text-[10px] sm:text-xs mt-0.5">
                <svg
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>
                  {effectiveIsShowCase && endLevel
                    ? `Level ${currentGameLevel} / ${endLevel}`
                    : effectiveIsShowCase
                    ? `Level ${currentGameLevel}`
                    : `Practice ${f3FlowStep?.step?.step || 1}`}{" "}
                  • Mission: {missionDestination}
                </span>
              </div>
            </div>

            {/* Spacer to balance layout */}
            <div className="w-[100px] sm:w-[120px]"></div>
          </div>

          {/* Main Content Card */}
          <div
            className="flex-1 flex flex-col bg-transparent"
            style={{ minHeight: 0, height: "100%" }}
          >
            {/* Fuel Progress - Only show if showProgress is true */}
            {showProgress && (
              <div className="mb-2 sm:mb-3 flex-shrink-0">
                <FuelProgressBar
                  currentFuel={currentFuel}
                  requiredFuel={requiredFuel}
                  maxFuel={maxFuel}
                  hidePercentage={true}
                />
              </div>
            )}

            {/* Game Area */}
            <div
              className="flex-1 flex flex-col px-1 sm:px-2 py-2"
              style={{ minHeight: 0, overflow: "auto" }}
            >
              <div
                className="bg-transparent rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 flex-1 flex flex-col"
                style={{ minHeight: 0 }}
              >
                <LanguageProvider initialLanguage={initialLanguage}>
                  <AudioLanguageProvider initialLanguage={initialAudioLanguage}>
                    {currentQuestion && (
                      <LetterLauncherGameCore
                        currentQuestion={{
                          ...currentQuestion,
                          displayedLetter: showLetter
                            ? currentQuestion.displayedLetter
                            : "",
                        }}
                        mode="game"
                        selectedLanguage={initialLanguage}
                        showFeedback={showFeedback}
                        isCorrect={isCorrect}
                        selectedAnswer={selectedAnswer}
                        fuelEarned={fuelEarned}
                        disabled={!showLetter || isPlayingAudio}
                        onAnswerSelect={handleAnswerSelect}
                        onContinue={handleContinue}
                      />
                    )}
                  </AudioLanguageProvider>
                </LanguageProvider>
              </div>
            </div>
          </div>
        </div>
      </SpaceBackground>
    </MainLayout>
  );
};

const LetterLauncherMechanics = (props) => {
  return <LetterLauncherMechanicsContent {...props} />;
};

export default LetterLauncherMechanics;
