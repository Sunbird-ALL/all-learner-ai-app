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

    initializeSession();
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
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          minHeight: "600px",
        }}
      >
        <LanguageProvider initialLanguage={initialLanguage}>
          <AudioLanguageProvider initialLanguage={initialAudioLanguage}>
            <LetterGame
              onBack={handleGameBack}
              initialLevel={1}
              disableNavigation={true}
            />
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
