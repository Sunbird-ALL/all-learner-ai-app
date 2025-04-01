import axios from "axios";
import { getLocalData } from "../../utils/constants";
import API_URLS from "../../utils/apiUrls";

const API_BASE_URL_ORCHESTRATION =
  process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST;

const getHeaders = () => {
  const token = localStorage.getItem("apiToken"); // Fetch token for V2
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  } else {
    return {}; // No headers for V1
  }
};

export const getLessonProgressByID = async (lang) => {
  try {
    const virtualId = localStorage.getItem("virtualId");

    let url = `${API_BASE_URL_ORCHESTRATION}/${API_URLS.GET_LESSON_PROGRESS_BY_ID}`;

    if (virtualId) {
      url += `/${virtualId}`;
    }

    url += `?language=${lang}`;
    const response = await axios.get(url, getHeaders());

    return response.data;
  } catch (error) {
    console.error("Error fetching lesson progress by ID:", error);
    throw error;
  }
};

export const fetchUserPoints = async () => {
  try {
    const sessionId = getLocalData("sessionId");
    const lang = getLocalData("lang");
    const virtualId = localStorage.getItem("virtualId");

    let url = `${API_BASE_URL_ORCHESTRATION}/${API_URLS.GET_POINTER}`;

    if (virtualId) {
      url += `/${virtualId}`;
    }

    url += `/${sessionId}?language=${lang}`;

    // Fetch the data with proper headers
    const response = await axios.get(url, getHeaders());

    return response?.data?.result?.totalLanguagePoints || 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
};

export const addPointer = async (points, milestone) => {
  const sessionId = getLocalData("sessionId");
  const lang = getLocalData("lang");
  const virtualId = localStorage.getItem("virtualId");

  try {
    const requestData = {
      sessionId,
      points,
      language: lang,
      milestone,
    };

    if (virtualId) {
      requestData.userId = virtualId;
    }

    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${API_URLS.ADD_POINTER}`,
      requestData,
      getHeaders()
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
  const sessionId = getLocalData("sessionId");
  const language = getLocalData("lang");
  const virtualId = localStorage.getItem("virtualId");

  try {
    const requestBody = {
      sessionId: sessionId,
      subSessionId: subSessionId,
      milestoneLevel: milestoneLevel,
      language: language,
    };
    if (totalSyllableCount !== undefined) {
      requestBody.totalSyllableCount = totalSyllableCount;
    }

    if (virtualId) {
      requestBody.userId = virtualId;
    }

    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${API_URLS.CREATE_LEARNER_PROGRESS}`,
      requestBody,
      getHeaders()
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
}) => {
  try {
    const virtualId = localStorage.getItem("virtualId");

    // Create request payload dynamically
    const requestData = {
      sessionId,
      milestone,
      lesson,
      progress,
      language,
      milestoneLevel,
    };

    if (virtualId) {
      requestData.userId = virtualId;
    }

    const response = await axios.post(
      `${API_BASE_URL_ORCHESTRATION}/${API_URLS.ADD_LESSON}`,
      requestData,
      getHeaders()
    );

    return response.data;
  } catch (error) {
    console.error("Error adding lesson:", error);
    throw error;
  }
};
