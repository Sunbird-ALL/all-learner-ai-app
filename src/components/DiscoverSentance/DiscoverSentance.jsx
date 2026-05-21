import { useEffect, useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "../../../node_modules/axios/index";
// import elephant from "../../assets/images/elephant.svg";
import {
  callConfetti,
  getLocalData,
  sendTestRigScore,
  setLocalData,
} from "../../utils/constants";
import WordsOrImage from "../Mechanism/WordsOrImage";
import { uniqueId } from "../../services/utilService";
import useSound from "use-sound";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import config from "../../utils/urlConstants.json";
import { MessageDialog } from "../Assesment/Assesment";
import { Log } from "../../services/telemetryService";
import usePreloadAudio from "../../hooks/usePreloadAudio";
import {
  addLesson,
  addPointer,
  fetchUserPoints,
  createLearnerProgress,
} from "../../services/orchestration/orchestrationService";
import {
  fetchGetSetResult,
  callEngagementPredictor,
  clearInteractions,
} from "../../services/learnerAi/learnerAiService";
import {
  fetchAssessmentData,
  fetchPaginatedContent,
} from "../../services/content/contentService";
import DiscoverSentencePreview from "./DiscoverSentencePreview";
import {
  getInitialSetTag,
  collectionForSet,
  categoryToContentType,
  resolveAfterSetComplete,
  DISCOVERY_SET_FLOW_STORAGE,
} from "../../utils/discoverSetFlow";

const SpeakSentenceComponent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [storyLine, setStoryLine] = useState(0);
  const [assessmentResponse, setAssessmentResponse] = useState(undefined);
  const [currentContentType, setCurrentContentType] = useState("");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [voiceAnimate, setVoiceAnimate] = useState(false);
  const [points, setPoints] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [enableNext, setEnableNext] = useState(false);
  const [assesmentCount, setAssesmentcount] = useState(0);
  const [initialAssesment, setInitialAssesment] = useState(true);
  const [disableScreen, setDisableScreen] = useState(false);
  // const [play] = useSound(LevelCompleteAudio);
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const interactionsRef = useRef([]);
  const [discoveryHistory, setDiscoveryHistory] = useState([]);
  const [currentSetTag, setCurrentSetTag] = useState("");
  const discoveryHistoryRef = useRef([]);
  const [questionsReady, setQuestionsReady] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const levelCompleteAudioSrc = usePreloadAudio(LevelCompleteAudio);
  const sessionId = getLocalData("sessionId");

  const callConfettiAndPlay = () => {
    let audio = new Audio(levelCompleteAudioSrc);
    audio.play();
    callConfetti();
    window.telemetry?.syncEvents && window.telemetry.syncEvents();
  };

  const showCompletionPopup = (setNumber) =>
    new Promise((resolve) => {
      setDisableScreen(true);
      callConfettiAndPlay();
      setTimeout(() => {
        setOpenMessageDialog({
          message: "You have successfully completed assessment " + setNumber,
          __onClose: () => {
            setDisableScreen(false);
            resolve();
          },
        });
      }, 1200);
    });

  useEffect(() => {
    if (questions?.length) setAssesmentcount(assesmentCount + 1);
  }, [questions]);

  useEffect(() => {
    if (!localStorage.getItem("contentSessionId")) {
      fetchUserPoints()
        .then((points) => {
          setPoints(points);
        })
        .catch((error) => {
          console.error("Error fetching user points:", error);
          setPoints(0);
        });
    }
  }, []);

  useEffect(() => {
    if (questions?.length) {
      const oldSubSessionId = getLocalData("sub_session_id");
      const newSubSessionId = uniqueId();
      setLocalData("sub_session_id", newSubSessionId);

      // Clear interactions for old sub session if it exists
      if (oldSubSessionId) {
        clearInteractions(oldSubSessionId);
      }

      setInteractions([]);
      interactionsRef.current = [];
    }
  }, [questions]);

  useEffect(() => {
    interactionsRef.current = interactions;
  }, [interactions]);

  useEffect(() => {
    discoveryHistoryRef.current = discoveryHistory;
  }, [discoveryHistory]);

  async function loadDiscoveryNextSet(newHistory, assessmentData) {
    const lang = getLocalData("lang");
    const resolved = resolveAfterSetComplete(newHistory);
    if (resolved.type === "invalid") {
      navigate("/discover-end");
      return;
    }
    if (resolved.type === "terminal") {
      if (
        resolved.towre &&
        (lang === "te" || lang === "en" || lang === "kn" || lang === "hi")
      ) {
        navigate("/towre-flow");
      } else {
        navigate("/discover-end");
      }
      return;
    }
    const nextCol = collectionForSet(assessmentData, resolved.setTag);
    if (!nextCol?.collectionId) {
      console.error("No collection for set", resolved.setTag);
      navigate("/discover-end");
      return;
    }
    const ct = categoryToContentType(nextCol.category);
    if (ct === "Char") {
      sessionStorage.setItem(
        DISCOVERY_SET_FLOW_STORAGE.STATE,
        JSON.stringify({
          history: newHistory,
          pendingCharSetTag: resolved.setTag,
        })
      );
      sessionStorage.setItem(
        DISCOVERY_SET_FLOW_STORAGE.CHAR_SESSION,
        JSON.stringify({
          collectionId: nextCol.collectionId,
          storyTitle: nextCol.name || "",
        })
      );
      navigate("/letter-hunt");
      return;
    }
    const resPagination = await fetchPaginatedContent(nextCol.collectionId, 5);
    setCurrentContentType(ct);
    setTotalSyllableCount(resPagination?.totalSyllableCount);
    setCurrentCollectionId(nextCol.collectionId);
    setLocalData("storyTitle", nextCol.name);
    setCurrentQuestion(0);
    setQuestions([...(resPagination?.data || [])]);
    setInteractions([]);
    interactionsRef.current = [];
    setCurrentSetTag(resolved.setTag);
    sessionStorage.setItem(
      DISCOVERY_SET_FLOW_STORAGE.STATE,
      JSON.stringify({ history: newHistory, pendingCharSetTag: null })
    );
  }

  async function initDiscoveryFromSet4(resAssessment) {
    setAssessmentResponse(resAssessment);
    const initialTag = getInitialSetTag();
    const col = collectionForSet(resAssessment, initialTag);
    if (!col?.collectionId) {
      console.error("No collection ID found for discovery set4.");
      return;
    }
    const resPagination = await fetchPaginatedContent(col.collectionId, 5);
    setCurrentContentType(categoryToContentType(col.category));
    setTotalSyllableCount(resPagination?.totalSyllableCount);
    setCurrentCollectionId(col.collectionId);
    setLocalData("storyTitle", col.name);
    setQuestions([...(resPagination?.data || [])]);
    setCurrentSetTag(initialTag);
    setDiscoveryHistory([]);
    discoveryHistoryRef.current = [];
    sessionStorage.setItem(
      DISCOVERY_SET_FLOW_STORAGE.STATE,
      JSON.stringify({ history: [], pendingCharSetTag: null })
    );
  }

  const handleInteractionComplete = (interactionData) => {
    if (interactionData) {
      setInteractions((prev) => {
        const updated = [...prev, interactionData];
        interactionsRef.current = updated;
        return updated;
      });
    }
  };

  useEffect(() => {
    if (voiceText === "error") {
      // alert("");
      setOpenMessageDialog({
        message: "Sorry I couldn't hear a voice. Could you please speak again?",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText === "profanity") {
      setOpenMessageDialog({
        message: `Please speak appropriately.`,
        severity: "warning",
        isError: true,
      });
      setVoiceText("");
      setEnableNext(false);
    }
    if (voiceText == "success") {
      // go_to_result(voiceText);
      setVoiceText("");
    }
    //eslint-disable-next-line
  }, [voiceText]);

  const handleNext = async () => {
    setIsNextButtonCalled(true);
    setEnableNext(false);

    try {
      const lang = getLocalData("lang");

      // await axios.post(
      //   `${process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST}/${config.URLS.ADD_LESSON}`,
      //   {
      //     userId: localStorage.getItem("virtualId"),
      //     sessionId: localStorage.getItem("sessionId"),
      //     milestone: `discoveryList/discovery/${currentCollectionId}`,
      //     lesson: localStorage.getItem("storyTitle"),
      //     progress: ((currentQuestion + 1) * 100) / questions.length,
      //     language: lang,
      //     milestoneLevel: "m0",
      //   }
      // );

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentQuestion === questions.length - 1) {
        const sub_session_id = getLocalData("sub_session_id");
        const isThirdDiscoverySet = discoveryHistoryRef.current.length === 2;
        const getSetResultRes = await fetchGetSetResult(
          sub_session_id,
          currentContentType,
          currentCollectionId,
          totalSyllableCount,
          currentSetTag || undefined,
          isThirdDiscoverySet
        );

        // Call engagement predictor after getsetresult
        // Interactions are automatically retrieved from localStorage
        callEngagementPredictor(sub_session_id);

        if (!(localStorage.getItem("contentSessionId") !== null)) {
          let point = 1;
          let milestone = "m0";

          if (point !== 1) {
            if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
              navigate("/");
            } else {
              navigate("/discover-start");
            }
            return;
          }

          try {
            const result = await addPointer(point, milestone);
            const awardedPoints = result?.result?.points;
            if (awardedPoints !== 1) {
              if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
                navigate("/");
              } else {
                navigate("/discover-start");
              }
              return;
            }
            setPoints(result?.result?.totalLanguagePoints || 0);
          } catch (error) {
            setPoints(0);
            console.error("Error adding points:", error);
          }
        } else {
          sendTestRigScore(5);
          // setPoints(localStorage.getItem("currentLessonScoreCount"));
        }

        setInitialAssesment(false);
        const { data: getSetData } = getSetResultRes;
        const data = JSON.stringify(getSetData);
        Log(data, "discovery", "ET");
        if (process.env.REACT_APP_POST_LEARNER_PROGRESS === "true") {
          try {
            const milestoneLevel = getSetData?.currentLevel;
            const result = await createLearnerProgress(
              sub_session_id,
              milestoneLevel
            );
          } catch (error) {
            console.error("Error creating learner progress:", error);
          }
        }

        const passFail = getSetData.sessionResult === "pass" ? "pass" : "fail";
        const newHistory = [
          ...discoveryHistoryRef.current,
          { setTag: currentSetTag, result: passFail },
        ];
        setDiscoveryHistory(newHistory);
        discoveryHistoryRef.current = newHistory;
        sessionStorage.setItem(
          DISCOVERY_SET_FLOW_STORAGE.STATE,
          JSON.stringify({ history: newHistory, pendingCharSetTag: null })
        );
        await addLesson({
          sessionId,
          milestone: `showcase`,
          lesson: "0",
          progress: 50,
          language: lang,
          milestoneLevel: "m0",
        });
        if (newHistory.length < 3) {
          await showCompletionPopup(newHistory.length);
        }
        await loadDiscoveryNextSet(newHistory, assessmentResponse);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (questionsReady) return;
    let cancelled = false;
    (async () => {
      try {
        const lang = getLocalData("lang");

        const charRaw = sessionStorage.getItem(
          DISCOVERY_SET_FLOW_STORAGE.CHAR_RESULT
        );
        if (charRaw) {
          let charRes;
          try {
            charRes = JSON.parse(charRaw);
          } catch {
            const resAssessment = await fetchAssessmentData(lang);
            sessionStorage.removeItem(DISCOVERY_SET_FLOW_STORAGE.CHAR_RESULT);
            if (cancelled) return;
            await initDiscoveryFromSet4(resAssessment);
            return;
          }

          let mergedHistory;
          try {
            const resAssessment = await fetchAssessmentData(lang);
            sessionStorage.removeItem(DISCOVERY_SET_FLOW_STORAGE.CHAR_RESULT);
            if (cancelled) return;
            const stateRaw = sessionStorage.getItem(
              DISCOVERY_SET_FLOW_STORAGE.STATE
            );
            if (stateRaw) {
              try {
                const state = JSON.parse(stateRaw);
                const pending = state.pendingCharSetTag;
                if (pending) {
                  const passFail =
                    charRes.sessionResult === "pass" ? "pass" : "fail";
                  mergedHistory = [
                    ...(state.history || []),
                    { setTag: pending, result: passFail },
                  ];
                }
              } catch {
                /* invalid STATE; fall through to set4 */
              }
            }
            if (!mergedHistory) {
              await initDiscoveryFromSet4(resAssessment);
              return;
            }
            if (cancelled) return;
            setAssessmentResponse(resAssessment);
            setDiscoveryHistory(mergedHistory);
            discoveryHistoryRef.current = mergedHistory;
            sessionStorage.setItem(
              DISCOVERY_SET_FLOW_STORAGE.STATE,
              JSON.stringify({
                history: mergedHistory,
                pendingCharSetTag: null,
              })
            );
            setInitialAssesment(false);
            setQuestionsReady(true);
            if (mergedHistory.length < 3) {
              await showCompletionPopup(mergedHistory.length);
            }
            if (cancelled) return;
            await loadDiscoveryNextSet(mergedHistory, resAssessment);
          } catch (e) {
            console.error("Discovery char resume error:", e);
            const resAssessment = await fetchAssessmentData(lang);
            if (!cancelled) await initDiscoveryFromSet4(resAssessment);
          }
          return;
        }

        const resAssessment = await fetchAssessmentData(lang);
        if (cancelled) return;
        await initDiscoveryFromSet4(resAssessment);
        if (!cancelled) setQuestionsReady(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!cancelled) setFetchError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchError]);

  const handleBack = () => {
    const destination =
      process.env.REACT_APP_IS_APP_IFRAME === "true" ? "/" : "/discover-start";
    navigate(destination);
    // if (process.env.REACT_APP_IS_APP_IFRAME === 'true') {
    //   navigate("/");
    // } else {
    //   navigate("/discover-start")
    // }
  };

  useEffect(() => {
    localStorage.setItem("mechanism_id", "");

    const isCharResume = !!sessionStorage.getItem(
      DISCOVERY_SET_FLOW_STORAGE.CHAR_RESULT
    );
    if (!isCharResume) {
      setShowDemo(true);
    }
  }, []);

  const handleDemoComplete = () => {
    // Demo completed, now show the actual game
    setShowDemo(false);
  };

  const handleDemoBack = () => {
    const destination =
      process.env.REACT_APP_IS_APP_IFRAME === "true" ? "/" : "/discover-start";
    navigate(destination);
  };

  if (showDemo) {
    return (
      <DiscoverSentencePreview
        onStartGame={handleDemoComplete}
        onBack={handleDemoBack}
      />
    );
  }

  if (fetchError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 2,
          px: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: "Quicksand", fontWeight: 700, color: "#555" }}
        >
          Could not load your session.
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Quicksand", color: "#888", maxWidth: 360 }}
        >
          The server is unreachable right now. Check your connection and try
          again.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setFetchError(false);
            setQuestionsReady(false);
          }}
          sx={{
            mt: 1,
            background: "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
            color: "white",
            fontFamily: "Quicksand",
            fontWeight: 700,
            borderRadius: "25px",
            textTransform: "none",
            px: 4,
            py: 1.5,
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (!questionsReady) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={48} sx={{ color: "#FF730E" }} />
        <Typography
          sx={{
            fontFamily: "Quicksand",
            fontWeight: 600,
            color: "#555",
            fontSize: "18px",
          }}
        >
          Please wait, we are fetching details for you…
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            const cb = openMessageDialog && openMessageDialog.__onClose;
            setOpenMessageDialog("");
            setDisableScreen(false);
            if (cb) cb();
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      <WordsOrImage
        {...{
          background: "linear-gradient(45deg, #FF730E 30%, #FFB951 90%)",
          header:
            questions[currentQuestion]?.contentType === "image"
              ? `Guess the below image`
              : `Speak the below ${questions[currentQuestion]?.contentType}`,
          words: questions[currentQuestion]?.contentSourceData?.[0]?.text,
          contentType: currentContentType,
          contentId: questions[currentQuestion]?.contentId,
          setVoiceText,
          setRecordedAudio,
          setVoiceAnimate,
          storyLine,
          handleNext,
          type: questions[currentQuestion]?.contentType,
          // image: elephant,
          enableNext,
          showTimer: false,
          points,
          steps: questions?.length,
          currentStep: currentQuestion + 1,
          isDiscover: true,
          callUpdateLearner: true,
          disableScreen,
          handleBack,
          setEnableNext,
          isNextButtonCalled,
          setIsNextButtonCalled,
          setOpenMessageDialog,
          onInteractionComplete: handleInteractionComplete,
        }}
      />
    </>
  );
};

export default SpeakSentenceComponent;
