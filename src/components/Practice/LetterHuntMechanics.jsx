import React, { useState, useEffect } from "react";
import MainLayout from "../Layouts.jsx/MainLayout";
import { getLocalData } from "../../utils/constants";

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
  level,
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
}) => {
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);

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
                initialLevel={level || 1}
                disableNavigation={true}
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
