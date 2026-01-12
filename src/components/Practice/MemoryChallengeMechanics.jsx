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
  MemoryGameCore,
  LanguageProvider,
  AudioLanguageProvider,
  sessionManager,
  sessionTelemetryManager,
  memoryGameDataLoader,
} from "../../lib/axl-explorations/src/lib/index";

/**
 * Wrapper component that integrates axl-explorations MemoryGameCore
 * into the Practice.jsx mechanics system for F3 flow Memory Challenge
 */
const MemoryChallengeMechanicsContent = ({
  page,
  setPage,
  level, // Starting level (1, 2, 3)
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
  endLevel = 3, // End level (usually 3)
  startShowCase,
  setStartShowCase,
  setProgressData,
  setCurrentQuestion,
  applyStep,
  failRedirect,
  passRedirect,
  isF3FlowActive,
  f3FlowStep,
  contentCount = 5, // Number of sequences per level
}) => {
  const [currentGameLevel, setCurrentGameLevel] = useState(level || 1);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const navigate = useNavigate();
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
            "✅ Telemetry session initialized for Memory Challenge game"
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

    document.body.classList.add("memory-challenge-active");

    initializeSession();

    return () => {
      document.body.classList.remove("memory-challenge-active");
      clearTimeout(timeoutId);
    };
  }, []);

  const handleGameBack = () => {
    if (handleBack) {
      handleBack();
    }
  };

  // Generate sequences: 2 meaningful words + 3 non-word sequences per level
  const generateSequences = () => {
    const supportedLanguage =
      initialLanguage === "en" ||
      initialLanguage === "te" ||
      initialLanguage === "kn" ||
      initialLanguage === "mr"
        ? initialLanguage
        : "en";

    // Use memoryGameDataLoader to generate sequences
    const sequences = memoryGameDataLoader.generateMemoryQuestions(
      supportedLanguage,
      currentGameLevel,
      "simple",
      contentCount
    );

    return sequences.map((seq, idx) => ({
      sequence: seq.sequence,
      display: seq.display || seq.sequence.join(""),
      complexity: seq.complexity || "simple",
      language: seq.language || initialLanguage,
    }));
  };

  const [sequences, setSequences] = useState([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [showSequence, setShowSequence] = useState(true);
  const [userInput, setUserInput] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [sequenceTimer, setSequenceTimer] = useState(3);
  const [currentLetterOptions, setCurrentLetterOptions] = useState([]);

  useEffect(() => {
    if (sessionInitialized) {
      const generatedSequences = generateSequences();
      setSequences(generatedSequences);

      // Get letter options from the first sequence
      if (generatedSequences.length > 0) {
        const allLetters = new Set();
        generatedSequences.forEach((seq) => {
          seq.sequence.forEach((letter) => allLetters.add(letter));
        });
        setCurrentLetterOptions(Array.from(allLetters));
      }
    }
  }, [sessionInitialized, currentGameLevel, contentCount]);

  // Show sequence for 3 seconds, then hide
  useEffect(() => {
    if (showSequence && sequences.length > 0) {
      const timer = setTimeout(() => {
        setShowSequence(false);
        setUserInput([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSequence, sequences]);

  const handleLetterClick = (letter) => {
    if (showSequence) return; // Don't allow input while showing sequence

    setUserInput((prev) => [...prev, letter]);
  };

  const handleRemoveLast = () => {
    setUserInput((prev) => prev.slice(0, -1));
  };

  const handleCheckSequence = () => {
    if (!sequences[currentSequenceIndex]) return;

    const currentSequence = sequences[currentSequenceIndex];
    const isCorrectAnswer =
      JSON.stringify(userInput) === JSON.stringify(currentSequence.sequence);

    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);

    if (isCorrectAnswer) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    // Move to next sequence after feedback
    setTimeout(() => {
      if (currentSequenceIndex < sequences.length - 1) {
        setCurrentSequenceIndex((prev) => {
          const nextIndex = prev + 1;
          setShowSequence(true);
          setUserInput([]);
          setShowFeedback(false);
          return nextIndex;
        });
      } else {
        // Completed all sequences in this level
        handleLevelComplete();
      }
    }, 1500);
  };

  const handleLevelComplete = () => {
    // Check pass criteria: > 80% accuracy
    const accuracy = (correctCount / sequences.length) * 100;

    if (accuracy > 80) {
      // Level passed
      if (currentGameLevel < endLevel) {
        // Move to next level
        setCurrentGameLevel((prev) => prev + 1);
        setCurrentSequenceIndex(0);
        setCorrectCount(0);
        setWrongCount(0);
        setUserInput([]);
        setIsGameComplete(false);
        const newSequences = generateSequences();
        setSequences(newSequences);
      } else {
        // All levels passed
        setIsGameComplete(true);
        setTimeout(() => {
          if (handleNext) {
            handleNext();
          }
        }, 2000);
      }
    } else {
      // Level failed - redirect to failRedirect
      if (failRedirect && handleNext) {
        setTimeout(() => {
          handleNext();
        }, 2000);
      }
    }
  };

  if (!sessionInitialized || sequences.length === 0) {
    return (
      <MainLayout
        page={header}
        setPage={setPage}
        level={milestoneLevel || "B"}
        flowNames={[]}
        activeFlow={isF3FlowActive ? `A${f3FlowStep?.step?.step || 1}` : ""}
        progressData={progressData}
        showProgress={showProgress}
        points={points}
        vocabCount={vocabCount}
        wordCount={wordCount}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading game...</p>
        </div>
      </MainLayout>
    );
  }

  const currentSequence = sequences[currentSequenceIndex];

  return (
    <MainLayout
      page={header}
      setPage={setPage}
      level={milestoneLevel || "B"}
      flowNames={[]}
      activeFlow={isF3FlowActive ? `A${f3FlowStep?.step?.step || 1}` : ""}
      progressData={progressData}
      showProgress={showProgress}
      points={points}
      vocabCount={vocabCount}
      wordCount={wordCount}
    >
      <div
        style={{
          padding: "0",
          height: "100%",
          maxHeight: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <LanguageProvider initialLanguage={initialLanguage}>
          <AudioLanguageProvider initialLanguage={initialAudioLanguage}>
            <div
              style={{
                height: "100%",
                maxHeight: "100%",
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                position: "relative",
              }}
              className="memory-challenge-wrapper"
            >
              {currentSequence && (
                <MemoryGameCore
                  currentSequence={currentSequence}
                  mode="game"
                  selectedLanguage={initialLanguage}
                  currentLevel={currentGameLevel}
                  showSequence={showSequence}
                  showFeedback={showFeedback}
                  isCorrect={isCorrect}
                  userInput={userInput}
                  currentLetterOptions={currentLetterOptions}
                  sequenceTimer={sequenceTimer}
                  onLetterClick={handleLetterClick}
                  onRemoveLast={handleRemoveLast}
                  onCheckSequence={handleCheckSequence}
                  onContinue={() => {
                    // Auto-advance after feedback
                    if (currentSequenceIndex < sequences.length - 1) {
                      setCurrentSequenceIndex((prev) => {
                        const nextIndex = prev + 1;
                        setShowSequence(true);
                        setUserInput([]);
                        setShowFeedback(false);
                        return nextIndex;
                      });
                    }
                  }}
                />
              )}
            </div>
          </AudioLanguageProvider>
        </LanguageProvider>
      </div>
    </MainLayout>
  );
};

const MemoryChallengeMechanics = (props) => {
  return <MemoryChallengeMechanicsContent {...props} />;
};

export default MemoryChallengeMechanics;
