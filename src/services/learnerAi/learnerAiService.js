import axios from "axios";
import config from "../../utils/urlConstants.json";
import { getLocalData } from "../../utils/constants";

const API_LEARNER_AI_APP_HOST = process.env.REACT_APP_LEARNER_AI_APP_HOST;
const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJ2aXJ0dWFsX2lkIjo1ODU5NDk5OTc5fQ.58zZunu96NzTU-0qOL-I86nVaafUdXyX5Dw78v6E2sQ";

export const getContent = async (
  criteria,
  virtualId,
  lang,
  limit,
  options = {}
) => {
  try {
    let url = `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${criteria}/${virtualId}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`;

    if (options.mechanismId) url += `&mechanics_id=${options.mechanismId}`;
    if (options.competency) url += `&level_competency=${options.competency}`;
    if (options.tags) url += `&tags=${options.tags}`;
    if (options.storyMode) url += `&story_mode=${options.storyMode}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export const getFetchMilestoneDetails = async (virtualId, lang) => {
  try {
    const response = await axios.get(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}/${virtualId}?language=${lang}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching milestone details:", error);
    throw error;
  }
};

export const fetchGetSetResult = async (
  subSessionId,
  currentContentType,
  currentCollectionId,
  totalSyllableCount
) => {
  const session_id = localStorage.getItem("sessionId");
  const user_id = localStorage.getItem("virtualId");
  const lang = getLocalData("lang");

  debugger;
  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
      {
        sub_session_id: subSessionId,
        contentType: currentContentType,
        session_id: session_id,
        user_id: user_id,
        collectionId: currentCollectionId,
        totalSyllableCount: totalSyllableCount,
        language: lang,
      },
      {
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
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
  virtualId,
  totalSyllableCount,
  mechanism,
}) => {
  try {
    debugger;
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
      {
        sub_session_id: subSessionId,
        contentType: currentContentType,
        session_id: sessionId,
        user_id: virtualId,
        totalSyllableCount: totalSyllableCount,
        language: localStorage.getItem("lang"),
        is_mechanics: mechanism && mechanism?.id ? true : false,
      },
      {
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
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
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.UPDATE_LEARNER_PROFILE}/${lang}`,
      requestBody,
      {
        headers: {
          authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating learner profile:", error);
    throw error;
  }
};
