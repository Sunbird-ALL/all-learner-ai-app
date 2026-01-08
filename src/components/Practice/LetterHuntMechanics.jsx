import React, { useState, useEffect } from "react";
import MainLayout from "../Layouts.jsx/MainLayout";
import {
  getLocalData,
  setLocalData,
  practiceSteps,
  levelGetContent,
} from "../../utils/constants";
import { addLesson } from "../../services/orchestration/orchestrationService";
import { getF1FlowStep, advanceF1Flow } from "../../RFlow/F1";

// Import from library
import {
  LetterGame,
  LanguageProvider,
  AudioLanguageProvider,
  sessionManager,
  sessionTelemetryManager,
} from "../../lib/axl-explorations/src/lib/index";

/**
 * Wrapper component that integrates axl-explorations LetterGame
 * into the Practice.jsx mechanics system
 */
const LetterHuntMechanicsContent = ({
  page,
  setPage,
  level, // Letter hunt game level (1, 2, 3, etc.) - start level
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
  milestoneLevel, // Milestone level (B, 1, 2, etc.) - passed from Practice.jsx
  endLevel, // Optional: end level for level range
  startShowCase, // Optional: startShowCase state
  setStartShowCase, // Optional: setStartShowCase function
  setProgressData, // Optional: function to update progressData state in parent
  setCurrentQuestion, // Optional: function to reset currentQuestion state in parent
  applyStep, // Optional: Apply step number (1, 2, or 3) for F1 flow
  failRedirect, // Optional: Redirect target on failure (e.g., "L1", "L4", "L7")
  passRedirect, // Optional: Redirect target on pass (e.g., "L4", "L7", "F2")
  isF1FlowActive, // Optional: Whether F1 flow is active
  f1FlowStep, // Optional: Current F1 flow step info
  customLetters, // Optional: Custom letters to use for Letter Hunt (from F1 config)
}) => {
  // Store the current level being played for failure handling
  const [currentGameLevel, setCurrentGameLevel] = useState(1);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  // Get F1 flow assessment parameters from config
  const getF1AssessmentParams = () => {
    if (!isF1FlowActive || !f1FlowStep?.step) {
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

    // For F1 flow, sub_milestone_level is always "F1"
    const sub_milestone_level = "F1";

    // Get step title from F1 config
    const lang = getLocalData("lang") || "en";
    const f1Config = levelGetContent[lang]?.["F1"];
    const f1StepConfig =
      f1Config && Array.isArray(f1Config) && f1Config[f1FlowStep.index]
        ? f1Config[f1FlowStep.index]
        : null;
    const stepTitle =
      f1StepConfig?.title ||
      (f1FlowStep.step?.type === "A"
        ? `A${f1FlowStep.step?.step}`
        : f1FlowStep.step?.type === "P"
        ? `P${f1FlowStep.step?.step}`
        : f1FlowStep.step?.type === "L"
        ? `L${f1FlowStep.step?.step}`
        : null);

    // Determine apply_level - use step title for all F1 flow steps
    // For Apply steps, this will be "A1", "A2", "A3"
    // For Practice steps, this will be "P1", "P2", etc. (though backend might only use it for Apply steps)
    const apply_level = stepTitle || undefined;

    // sub_apply_level will be passed dynamically based on currentGameLevel
    // This represents the level within the Apply step (1, 2, or 3)

    return {
      sub_session_id,
      sub_milestone_level,
      apply_level,
      // sub_apply_level will be set dynamically when calling LetterGame
    };
  };

  const f1AssessmentParams = getF1AssessmentParams();

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
          console.log("✅ Telemetry session initialized for Letter Hunt game");
        }

        setSessionInitialized(true);
      } catch (error) {
        console.warn("Failed to initialize telemetry session:", error);
        setSessionInitialized(true);
      }
    };

    // Add class to body to prevent scrolling
    document.body.classList.add("letter-hunt-active");

    initializeSession();

    // Cleanup: remove class when component unmounts
    return () => {
      document.body.classList.remove("letter-hunt-active");
    };
  }, []);

  const handleGameBack = () => {
    if (handleBack) {
      handleBack();
    }
  };

  // Helper function to map redirect string (e.g., "L1", "L4", "L7") to F1 flow index
  const getF1FlowIndexFromRedirect = (redirect) => {
    if (!redirect) return null;

    // Map Learn step redirects to F1 flow indices
    // F1_FLOW: L1(0), P1(1), L2(2), P2(3), L3(4), P3(5), A1(6), L4(7), P4(8), L5(9), P5(10), L6(11), P6(12), A2(13), L7(14), P7(15), L8(16), P8(17), L9(18), P9(19), A3(20)
    const redirectMap = {
      L1: 0, // Learn 1
      L2: 2, // Learn 2
      L3: 4, // Learn 3
      L4: 7, // Learn 4
      L5: 9, // Learn 5
      L6: 11, // Learn 6
      L7: 14, // Learn 7
      L8: 16, // Learn 8
      L9: 18, // Learn 9
    };

    return redirectMap[redirect] !== undefined ? redirectMap[redirect] : null;
  };

  // Backward compatibility: handleLevel1Failure for level 1 only
  const handleLevel1Failure = async () => {
    return handleLevelFailure(1);
  };

  // Handle level failure in showcase mode - redirect based on Apply step rules
  // For Apply steps:
  // - Level 1 or 2 fail: go to failRedirect (e.g., "L1" for Apply 1)
  // - Level 3 fail: go to failRedirect (e.g., "L1" for Apply 1)
  // - Level 3 pass: go to passRedirect (e.g., "L4" for Apply 1)
  const handleLevelFailure = async (failedLevel: number) => {
    console.log(
      "handleLevelFailure called - failedLevel:",
      failedLevel,
      "isShowCase:",
      isShowCase,
      "applyStep:",
      applyStep,
      "failRedirect:",
      failRedirect,
      "isF1FlowActive:",
      isF1FlowActive
    );
    try {
      const lang = getLocalData("lang") || "en";
      const sessionId = getLocalData("sessionId");

      let targetStep = 0; // Default to P1
      let targetFlowIndex = null;

      // If this is an Apply step with a failRedirect, use it
      if (applyStep && failRedirect && isF1FlowActive) {
        targetFlowIndex = getF1FlowIndexFromRedirect(failRedirect);
        if (targetFlowIndex !== null) {
          // Set F1 flow index to the target Learn step
          setLocalData("f1FlowIndex", targetFlowIndex);
          targetStep = targetFlowIndex; // Use flow index as practice step index for F1
          console.log(
            `Apply step ${applyStep} - Level ${failedLevel} failed - redirecting to ${failRedirect} (F1 flow index ${targetFlowIndex})`
          );
        } else {
          console.error(
            `Failed to map failRedirect "${failRedirect}" to F1 flow index`
          );
        }
      } else {
        console.warn("handleLevelFailure - Missing required conditions:", {
          applyStep: !!applyStep,
          failRedirect: !!failRedirect,
          isF1FlowActive: !!isF1FlowActive,
        });
      }

      // If we have a valid targetFlowIndex, proceed with redirect
      if (targetFlowIndex !== null) {
        const currentPracticeProgress = Math.round(
          (targetStep / (practiceSteps?.length || 21)) * 100
        );

        // Update learner progress via addLesson
        await addLesson({
          sessionId: sessionId,
          milestone: "practice",
          lesson: targetStep,
          progress: currentPracticeProgress,
          language: lang,
          milestoneLevel: milestoneLevel || "B",
        });

        // Update local storage
        const updatedPracticeProgress = {
          currentQuestion: 0,
          currentPracticeProgress: currentPracticeProgress,
          currentPracticeStep: targetStep,
        };
        setLocalData(
          "practiceProgress",
          JSON.stringify(updatedPracticeProgress)
        );
        console.log("Updated localStorage with:", updatedPracticeProgress);

        // Update parent state if setProgressData is provided
        if (setProgressData && typeof setProgressData === "function") {
          setProgressData(updatedPracticeProgress);
          console.log("Updated progressData state");
        }

        // Reset currentQuestion state in parent to 0 so handleNext doesn't increment
        if (setCurrentQuestion && typeof setCurrentQuestion === "function") {
          setCurrentQuestion(0);
          console.log("Reset currentQuestion to 0");
        }

        // Clear any F1 flow advancement flag to ensure handleNext processes the redirect
        setLocalData("f1FlowAdvancedByLetterHunt", "false");

        // Use a small delay to ensure localStorage and state are updated before handleNext reads them
        setTimeout(() => {
          console.log("Calling handleNext to exit and redirect to Learn step");
          if (handleNext) {
            handleNext(false);
          } else if (handleBack) {
            handleBack();
          }
        }, 100);
      } else {
        console.error(
          "handleLevelFailure - No valid targetFlowIndex, cannot redirect"
        );
        // Still try to exit the game
        setTimeout(() => {
          if (handleNext) {
            handleNext(false);
          } else if (handleBack) {
            handleBack();
          }
        }, 100);
      }
    } catch (error) {
      console.error("Error redirecting after level failure:", error);
      // Still exit the game even if progress update fails
      setTimeout(() => {
        if (handleNext) {
          handleNext(false);
        } else if (handleBack) {
          handleBack();
        }
      }, 100);
    }
  };

  // Handle level completion - update learner progress and exit
  const handleLevelComplete = async (completedLevel) => {
    try {
      // For Apply steps in showcase mode, check if all levels are complete
      if (isShowCase && applyStep && endLevel && completedLevel >= endLevel) {
        // All levels passed - redirect to passRedirect
        console.log(
          `Apply step ${applyStep} completed all levels - redirecting to ${passRedirect}`
        );

        if (passRedirect === "F2") {
          // Transition to F2 milestone - this would need to be handled by the parent
          // For now, just exit and let the parent handle the milestone transition
          if (handleNext) {
            handleNext(false);
          }
          return;
        }

        // Redirect to the specified Learn step
        const targetFlowIndex = getF1FlowIndexFromRedirect(passRedirect);
        if (targetFlowIndex !== null && isF1FlowActive) {
          setLocalData("f1FlowIndex", targetFlowIndex);
          const targetStep = targetFlowIndex;
          const lang = getLocalData("lang") || "en";
          const sessionId = getLocalData("sessionId");
          const currentPracticeProgress = Math.round(
            (targetStep / (practiceSteps?.length || 21)) * 100
          );

          await addLesson({
            sessionId: sessionId,
            milestone: "practice",
            lesson: targetStep,
            progress: currentPracticeProgress,
            language: lang,
            milestoneLevel: milestoneLevel,
          });

          const updatedPracticeProgress = {
            currentQuestion: 0,
            currentPracticeProgress: currentPracticeProgress,
            currentPracticeStep: targetStep,
          };
          setLocalData(
            "practiceProgress",
            JSON.stringify(updatedPracticeProgress)
          );

          if (setProgressData && typeof setProgressData === "function") {
            setProgressData(updatedPracticeProgress);
          }

          if (setCurrentQuestion && typeof setCurrentQuestion === "function") {
            setCurrentQuestion(0);
          }

          setTimeout(() => {
            if (handleNext) {
              handleNext(false);
            }
          }, 100);
          return;
        }
      }

      // For showcase mode (non-Apply or not all levels complete), don't auto-advance
      if (isShowCase) {
        // In showcase mode, just exit without updating progress
        if (handleNext) {
          handleNext();
        } else if (handleBack) {
          handleBack();
        }
        return;
      }

      // For non-showcase mode, update progress and move to next step
      // Only proceed if handleNext and milestoneLevel are provided
      if (!handleNext || !milestoneLevel) {
        // If no handleNext, just return - completion is handled elsewhere
        return;
      }

      const lang = getLocalData("lang") || "en";
      const sessionId = getLocalData("sessionId");

      // Check if this is F1 flow - if so, advance F1 flow index instead of practice step
      if (isF1FlowActive && f1FlowStep?.step) {
        console.log("F1 flow Practice step completed - advancing F1 flow");

        // Get current F1 flow step
        const currentF1FlowStep = getF1FlowStep();
        console.log("Current F1 flow step before advance:", currentF1FlowStep);

        // Advance F1 flow
        const nextStep = advanceF1Flow();
        console.log("advanceF1Flow returned:", nextStep);

        // Get updated F1 flow step
        const updatedF1FlowStep = getF1FlowStep();
        console.log("Updated F1 flow step after advance:", updatedF1FlowStep);

        if (updatedF1FlowStep.step) {
          // Update learner progress with new F1 flow index
          const newF1FlowIndex = updatedF1FlowStep.index;
          const totalF1Steps = 21; // Total F1 flow steps
          const currentPracticeProgress = Math.round(
            ((newF1FlowIndex + 1) / totalF1Steps) * 100
          );

          await addLesson({
            sessionId: sessionId,
            milestone: "practice",
            lesson: newF1FlowIndex.toString(),
            progress: currentPracticeProgress,
            language: lang,
            milestoneLevel: "B",
          });

          // Update local storage
          const updatedPracticeProgress = {
            currentQuestion: 0,
            currentPracticeProgress: currentPracticeProgress,
            currentPracticeStep: newF1FlowIndex,
          };
          setLocalData(
            "practiceProgress",
            JSON.stringify(updatedPracticeProgress)
          );

          // Update parent state if setProgressData is provided
          if (setProgressData && typeof setProgressData === "function") {
            setProgressData(updatedPracticeProgress);
          }

          // Reset currentQuestion state to 0 so handleNext doesn't increment
          if (setCurrentQuestion && typeof setCurrentQuestion === "function") {
            setCurrentQuestion(0);
          }

          // Set a flag to indicate F1 flow was already advanced by LetterHuntMechanics
          // This prevents handleNext from advancing again
          setLocalData("f1FlowAdvancedByLetterHunt", "true");

          // Exit the game by calling handleNext (will move to next F1 flow step)
          setTimeout(() => {
            handleNext(false);
            // Clear the flag after a short delay
            setTimeout(() => {
              setLocalData("f1FlowAdvancedByLetterHunt", "false");
            }, 500);
          }, 100);
          return;
        } else {
          console.error("F1 flow advance failed - no next step available");
        }
      }

      // For non-F1 flow, use regular practice step advancement
      // Get current practice step from progressData
      const currentPracticeStep = progressData?.currentPracticeStep || 0;
      const newPracticeStep = currentPracticeStep + 1;

      // Calculate progress percentage
      // Use practiceSteps length if available, otherwise use a default
      const totalSteps = practiceSteps?.length || 10;
      const limit = 1; // Default limit
      const currentPracticeProgress = Math.round(
        (newPracticeStep / (totalSteps * limit)) * 100
      );

      // Determine milestone type
      const currentLevelTitle = practiceSteps?.[newPracticeStep]?.title || "P1";
      const milestoneType = ["S1", "S2"].includes(currentLevelTitle)
        ? "showcase"
        : "practice";

      // Update learner progress via addLesson
      await addLesson({
        sessionId: sessionId,
        milestone: milestoneType,
        lesson: newPracticeStep,
        progress: currentPracticeProgress,
        language: lang,
        milestoneLevel: milestoneLevel,
      });

      // Update local storage
      const updatedPracticeProgress = {
        currentQuestion: 0,
        currentPracticeProgress: currentPracticeProgress,
        currentPracticeStep: newPracticeStep,
      };
      setLocalData("practiceProgress", JSON.stringify(updatedPracticeProgress));

      // Update parent state if setProgressData is provided
      if (setProgressData && typeof setProgressData === "function") {
        setProgressData(updatedPracticeProgress);
      }

      // Reset currentQuestion state to 0 so handleNext doesn't increment
      if (setCurrentQuestion && typeof setCurrentQuestion === "function") {
        setCurrentQuestion(0);
      }

      // Exit the game by calling handleNext (will move to next P level)
      setTimeout(() => {
        handleNext(false);
      }, 100);
    } catch (error) {
      console.error(
        "Error updating learner progress after letter hunt completion:",
        error
      );
      // Still exit the game even if progress update fails
      if (handleNext) {
        setTimeout(() => {
          handleNext(false);
        }, 100);
      }
    }
  };

  const initialLanguage =
    localStorage.getItem("selectedLanguage") || getLocalData("lang") || "en";
  const initialAudioLanguage =
    localStorage.getItem("selectedAudioLanguage") ||
    getLocalData("lang") ||
    "en";

  if (!sessionInitialized) {
    return (
      <MainLayout
        page={page}
        setPage={setPage}
        header={header || "Letter Hunt"}
        points={points}
        steps={steps}
        currentStep={currentStep}
        progressData={progressData}
        showProgress={showProgress}
        handleBack={handleBack}
        isShowCase={isShowCase}
        loading={true}
        background={background}
        showTimer={showTimer}
        startShowCase={startShowCase}
        setStartShowCase={setStartShowCase}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading game...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      page={page}
      setPage={setPage}
      header={header || "Letter Hunt"}
      points={points}
      steps={steps}
      currentStep={currentStep}
      progressData={progressData}
      showProgress={showProgress}
      handleBack={handleBack}
      isShowCase={isShowCase}
      loading={loading}
      background={background}
      showTimer={showTimer}
      startShowCase={startShowCase}
      setStartShowCase={setStartShowCase}
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
              className="letter-hunt-wrapper"
            >
              <LetterGame
                onBack={handleGameBack}
                startLevel={level || 1}
                endLevel={endLevel}
                disableNavigation={true}
                onLevelComplete={handleLevelComplete}
                isShowcase={isShowCase || false} // Pass isShowCase flag to LetterGame
                onLevel1Failure={() => handleLevelFailure(1)} // Backward compatibility for level 1 only
                onLevelFailure={handleLevelFailure} // New callback for any level failure (includes level number)
                customLetters={customLetters} // Pass customLetters from F1 config
                sub_session_id={f1AssessmentParams.sub_session_id} // Pass sub session ID from telemetry
                sub_milestone_level={f1AssessmentParams.sub_milestone_level} // Pass "F1" for F1 flow
                apply_level={f1AssessmentParams.apply_level} // Pass apply level (A1, A2, A3) from config
                // sub_apply_level is calculated dynamically in LetterGame based on currentLevel
              />
            </div>
          </AudioLanguageProvider>
        </LanguageProvider>
      </div>
    </MainLayout>
  );
};

const LetterHuntMechanics = (props) => {
  return <LetterHuntMechanicsContent {...props} />;
};

export default LetterHuntMechanics;
