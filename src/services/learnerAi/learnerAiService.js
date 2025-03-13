import axios from "axios";
import API_URLS from "../../utils/apiUrls";
import { getLocalData } from "../../utils/constants";

const API_LEARNER_AI_APP_HOST = process.env.REACT_APP_LEARNER_AI_APP_HOST;

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

export const getContent = async (criteria, lang, limit, options = {}) => {
  const virtualId = localStorage.getItem("virtualId");

  try {
    let url = `${API_LEARNER_AI_APP_HOST}/${API_URLS.GET_CONTENT}/${criteria}`;

    if (options.contentId) {
      url += `/${options.contentId}`;
    }

    if (virtualId) {
      url += `/${virtualId}`;
    }
    url += `?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`;

    if (options.mechanismId) url += `&mechanics_id=${options.mechanismId}`;
    if (options.competency) url += `&level_competency=${options.competency}`;
    if (options.tags) url += `&tags=${options.tags}`;
    if (options.storyMode) url += `&story_mode=${options.storyMode}`;

    const response = await axios.get(url, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export const getFetchMilestoneDetails = async (lang) => {
  const virtualId = localStorage.getItem("virtualId");
  if (localStorage.getItem("apiToken") || virtualId) {
    try {
      const response = await axios.get(
        `${API_LEARNER_AI_APP_HOST}/${API_URLS.GET_MILESTONE}${
          virtualId ? "/" + virtualId : ""
        }?language=${lang}`,
        getHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching milestone details:", error);
      throw error;
    }
  }
};

export const fetchGetSetResult = async (
  subSessionId,
  currentContentType,
  currentCollectionId,
  totalSyllableCount
) => {
  const session_id = getLocalData("sessionId");
  const lang = getLocalData("lang");
  const virtualId = localStorage.getItem("virtualId");

  try {
    const requestBody = {
      sub_session_id: subSessionId,
      contentType: currentContentType,
      session_id,
      collectionId: currentCollectionId,
      totalSyllableCount,
      language: lang,
    };

    if (virtualId) {
      requestBody.userId = virtualId;
    }

    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${API_URLS.GET_SET_RESULT}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error in getSetResult:", error);
    throw error;
  }
};

export const getSetResultPractice = async ({
  subSessionId,
  currentContentType,
  sessionId,
  totalSyllableCount,
  mechanism,
}) => {
  const virtualId = localStorage.getItem("virtualId");

  try {
    const requestBody = {
      sub_session_id: subSessionId,
      contentType: currentContentType,
      session_id: sessionId,
      totalSyllableCount,
      language: getLocalData("lang"),
      is_mechanics: mechanism && mechanism?.id ? true : false,
    };

    if (virtualId) {
      requestBody.userId = virtualId;
    }

    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${API_URLS.GET_SET_RESULT}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching set result:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

export const updateLearnerProfile = async (lang, requestBody) => {
  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${API_URLS.UPDATE_LEARNER_PROFILE}/${lang}`,
      requestBody,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating learner profile:", error);
    throw error;
  }
};
