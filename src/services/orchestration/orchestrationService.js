import axios from "axios";
import { getLocalData } from "../../utils/constants";
import config from "../../utils/urlConstants.json";

const API_BASE_URL_ORCHESTRATION =
  process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST;

const getHeaders = (token) => {
  const apiToken = token ? token : localStorage.getItem("apiToken");
  return {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  };
};

export const getLessonProgressByID = async (lang, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_LESSON_PROGRESS_BY_ID}?language=${lang}`,
      getHeaders(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching lesson progress by ID:", error);
    throw error;
  }
};

export const fetchUserPoints = async (token, lang, sessionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_POINTER}/${sessionId}?language=${lang}`,
      getHeaders(token)
    );
    return response?.data?.result?.totalLanguagePoints || 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
};

export const addPointer = async (points, milestone, token, lang, sessionId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_POINTER}`,
      {
        sessionId: sessionId,
        points: points,
        language: lang,
        milestone: milestone,
      },
      getHeaders(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

export const createLearnerProgress = async (
  subSessionId,
  milestoneLevel,
  totalSyllableCount,
  token,
  lang,
  sessionId
) => {
  try {
    const requestBody = {
      sessionId: sessionId,
      subSessionId: subSessionId,
      milestoneLevel: milestoneLevel,
      language: lang,
    };
    if (totalSyllableCount !== undefined) {
      requestBody.totalSyllableCount = totalSyllableCount;
    }
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.CREATE_LEARNER_PROGRESS}`,
      requestBody,
      getHeaders(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error creating learner progress:", error);
    throw error;
  }
};

export const addLesson = async ({
  sessionId,
  milestone = "practice",
  lesson = "0",
  progress = 0,
  language,
  milestoneLevel,
  token,
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_LESSON}`,
      {
        sessionId: sessionId,
        milestone: milestone,
        lesson: lesson,
        progress: progress,
        language: language,
        milestoneLevel: milestoneLevel,
      },
      getHeaders(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error adding lesson:", error);
    throw error;
  }
};
