import axios from "axios";
import { getLocalData } from "../../utils/constants";
import config from "../../utils/urlConstants.json";

const API_BASE_URL_ORCHESTRATION =
  process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST;

export const getLessonProgressByID = async (virtualId, lang) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_LESSON_PROGRESS_BY_ID}/${virtualId}?language=${lang}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching lesson progress by ID:", error);
    throw error;
  }
};

export const fetchUserPoints = async () => {
  try {
    const sessionId = getLocalData("sessionId");
    const virtualId = getLocalData("virtualId");
    const lang = getLocalData("lang");

    const response = await axios.get(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.GET_POINTER}/${virtualId}/${sessionId}?language=${lang}`
    );
    return response?.data?.result?.totalLanguagePoints || 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
};

export const addPointer = async (points, milestone) => {
  const userId = localStorage.getItem("virtualId");
  const sessionId = localStorage.getItem("sessionId");
  const lang = getLocalData("lang");

  try {
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_POINTER}`,
      {
        userId: userId,
        sessionId: sessionId,
        points: points,
        language: lang,
        milestone: milestone,
      },
      {
        // headers: {
        //   'Authorization': `Bearer ${token}`,
        //   'Content-Type': 'application/json',
        // }
      }
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
  totalSyllableCount
) => {
  const userId = localStorage.getItem("virtualId");
  const sessionId = localStorage.getItem("sessionId");
  const language = localStorage.getItem("lang");

  try {
    const requestBody = {
      userId: userId,
      sessionId: sessionId,
      subSessionId: subSessionId,
      milestoneLevel: milestoneLevel,
      language: language,
    };
    if (totalSyllableCount !== undefined) {
      requestBody.totalSyllableCount = totalSyllableCount;
    }
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.CREATE_LEARNER_PROGRESS}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("Error creating learner progress:", error);
    throw error;
  }
};

export const addLesson = async ({
  userId,
  sessionId,
  milestone = "practice",
  lesson = "0",
  progress = 0,
  language,
  milestoneLevel,
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${config.URLS.ADD_LESSON}`,
      {
        userId: userId,
        sessionId: sessionId,
        milestone: milestone,
        lesson: lesson,
        progress: progress,
        language: language,
        milestoneLevel: milestoneLevel,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding lesson:", error);
    throw error;
  }
};
