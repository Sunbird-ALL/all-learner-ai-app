import { getConfig } from "../../config/runtimeConfig";
import axios from "axios";
import config from "../../utils/urlConstants.json";
import { getLocalData, setLocalData } from "../../utils/constants";
import { getVirtualId } from "../userservice/userService";
import {
  beginGetSetResultRequest,
  endGetSetResultRequest,
} from "./getSetResultLoading";
import { reportError } from "../../utils/errorReporter";

const API_LEARNER_AI_APP_HOST = getConfig("REACT_APP_LEARNER_AI_APP_HOST");

const getHeaders = () => {
  const token = localStorage.getItem("apiToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getContent = async (
  criteria,
  lang,
  limit,
  options,
  level = {}
) => {
  try {
    let url = `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT}/${criteria}?language=${lang}&contentlimit=${limit}&gettargetlimit=${limit}`;

    if (
      options.mechanismId &&
      ![2, 3].includes(level) &&
      !options.mechanismId.startsWith("Fluency") &&
      options.mechanismId !== "PhrasesInAction"
    )
      url += `&mechanics_id=${options.mechanismId}`;
    if (options.competency) url += `&level_competency=${options.competency}`;
    if (options.tags) url += `&tags=${options.tags}`;
    if (options.storyMode) url += `&story_mode=${options.storyMode}`;
    if (options.CEFR_level) url += `&CEFR_level=${options.CEFR_level}`;
    if (options.multilingual) url += `&multilingual=${options.multilingual}`;

    const response = await axios.get(url, getHeaders());

    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    reportError({
      type: "api_error",
      endpoint: "getContent",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

export const getContentNew = async (
  criteria,
  lang,
  limit,
  options = {},
  level
) => {
  try {
    // M3 should not use recommendation API
    const isM3 = level === 3 || level === "3" || String(level) === "3";
    if (isM3) {
      // getContentNew (recommendation API) called for M3 - this should not happen
    }

    let url = `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_CONTENT_NEW}`;
    const data = {
      language: lang,
      content_type: criteria,
    };
    const response = await axios.post(url, data, getHeaders());
    if (response?.data?.content?.length === 0) {
      console.error(
        "No content found from recommendation API, falling back to getContent"
      );
      try {
        return await getContent(criteria, lang, limit, options, level);
      } catch (fallbackError) {
        console.error("Fallback getContent also failed", fallbackError);
        throw fallbackError;
      }
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    reportError({
      type: "api_error",
      endpoint: "getContentNew",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    try {
      console.error("Recommendation API failed, falling back to getContent");
      return await getContent(criteria, lang, limit, options, level);
    } catch (fallbackError) {
      console.error("Fallback getContent also failed", fallbackError);
      throw fallbackError;
    }
  }
};

export const getFetchMilestoneDetails = async (lang) => {
  if (localStorage.getItem("apiToken")) {
    try {
      const response = await axios.get(
        `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_MILESTONE}?language=${lang}`,
        getHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching milestone details:", error);
      reportError({
        type: "api_error",
        endpoint: "getFetchMilestoneDetails",
        status: error?.response?.status,
        message: error?.response?.data?.message || error?.message,
        stack: error?.stack,
      });
      throw error;
    }
  }
};

/**
 * @param {string} [setTag] ASER discovery tag: set1–set6 (sent as setNo + numeric discoverySet)
 * @param {boolean} [applyDiscoveryMilestone] When true, sends applyDiscoveryMilestone for backend persistence rules
 */
export const fetchGetSetResult = async (
  subSessionId,
  currentContentType,
  currentCollectionId,
  totalSyllableCount,
  setTag,
  applyDiscoveryMilestone
) => {
  const session_id = getLocalData("sessionId");
  const lang = getLocalData("lang");

  beginGetSetResultRequest();
  try {
    const body = {
      sub_session_id: subSessionId,
      contentType: currentContentType,
      session_id: session_id,
      collectionId: currentCollectionId,
      totalSyllableCount: totalSyllableCount,
      language: lang,
      is_B_enable: true,
    };
    if (setTag && typeof setTag === "string") {
      const trimmed = setTag.trim();
      body.setNo = trimmed;
      const m = /^set([1-6])$/i.exec(trimmed);
      if (m) {
        body.discoverySet = Number(m[1]);
      }
    }
    if (applyDiscoveryMilestone === true) {
      body.applyDiscoveryMilestone = true;
    }
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
      body,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error in getSetResult:", error);
    reportError({
      type: "api_error",
      endpoint: "fetchGetSetResult",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error;
  } finally {
    endGetSetResultRequest();
  }
};

export const getSetResultPractice = async ({
  subSessionId,
  currentContentType,
  sessionId,
  totalSyllableCount,
  mechanism,
}) => {
  const maxLevel = getLocalData("max_level");

  beginGetSetResultRequest();
  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.GET_SET_RESULT}`,
      {
        sub_session_id: subSessionId,
        contentType: currentContentType || "Paragraph",
        session_id: sessionId,
        totalSyllableCount: totalSyllableCount,
        language: getLocalData("lang"),
        max_level: parseInt(maxLevel || getConfig("REACT_APP_MAX_LEVEL"), 10),
        is_mechanics: mechanism && mechanism?.id ? true : false,
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching set result:", error);
    reportError({
      type: "api_error",
      endpoint: "getSetResultPractice",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error; // Rethrow the error to handle it in the calling function
  } finally {
    endGetSetResultRequest();
  }
};

export const addInteraction = (subSessionId, interaction) => {
  try {
    if (!subSessionId) return;

    const storageKey = `interactions_${subSessionId}`;
    const existingInteractions = getLocalData(storageKey) || [];
    const interactions = Array.isArray(existingInteractions)
      ? existingInteractions
      : [];

    interactions.push({
      original_text: interaction.original_text || "",
      response_text: interaction.response_text || "",
      audio_path: interaction.audio_path || "",
      created_at: interaction.created_at || new Date().toISOString(),
    });

    setLocalData(storageKey, interactions);
  } catch (error) {
    console.error("Error adding interaction:", error);
    reportError({
      type: "api_error",
      endpoint: "addInteraction",
      message: error?.message,
      stack: error?.stack,
    });
  }
};

const getInteractions = (subSessionId) => {
  try {
    if (!subSessionId) return [];

    const storageKey = `interactions_${subSessionId}`;
    const interactions = getLocalData(storageKey);
    return Array.isArray(interactions) ? interactions : [];
  } catch (error) {
    console.error("Error getting interactions:", error);
    return [];
  }
};

export const clearInteractions = (subSessionId) => {
  try {
    if (!subSessionId) return;

    const storageKey = `interactions_${subSessionId}`;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Error clearing interactions:", error);
  }
};

export const updateLearnerProfile = async (lang, requestBody) => {
  for (let key in requestBody) {
    if (typeof requestBody[key] === "string") {
      requestBody[key] = requestBody[key]
        .replace(/<script.*?>.*?<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .trim();
    }
  }

  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/${config.URLS.UPDATE_LEARNER_PROFILE}/${lang}`,
      requestBody,
      getHeaders()
    );

    // Track interaction for engagement prediction
    // Only track if we have original_text and response_text
    if (requestBody.audio) {
      const subSessionId =
        requestBody.sub_session_id || getLocalData("sub_session_id");
      if (subSessionId) {
        // Get audio_path if available (from requestBody.audio_path or requestBody.audioFileName)
        // audio_path might be set later in VoiceAnalyser, so we'll update it if needed
        const audioPath =
          requestBody.audio_path || requestBody.audioFileName || "";

        addInteraction(subSessionId, {
          original_text: requestBody.original_text,
          response_text: response.data.responseText,
          audio_path: audioPath,
          created_at: new Date().toISOString(),
        });
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error updating learner profile:", error);
    reportError({
      type: "api_error",
      endpoint: "updateLearnerProfile",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

export const addTowreRecord = async (
  audioPath,
  towreResult,
  language = "en"
) => {
  const sessionId = getLocalData("sessionId");

  const payload = {
    audio_file_path: `${audioPath}`,
    session_id: sessionId,
    language: language,
    towre_result: towreResult,
  };

  try {
    const response = await axios.post(
      `${API_LEARNER_AI_APP_HOST}/api/towre/addRecord`,
      payload,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error adding TOWRE record:", error);
    reportError({
      type: "api_error",
      endpoint: "addTowreRecord",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const setMilestoneScore = async (
  language,
  milestoneLevel,
  sessionId,
  subSessionId
) => {
  try {
    // Construct URL - ensure no double slashes
    const baseUrl = API_LEARNER_AI_APP_HOST?.replace(/\/$/, "") || "";
    const path = config.URLS.SET_MILESTONE_SCORE?.replace(/^\//, "") || "";
    const url = `${baseUrl}/${path}`;

    const response = await axios.post(
      url,
      {
        language: language,
        milestone_level: milestoneLevel,
        session_id: sessionId,
        sub_session_id: subSessionId,
      },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error setting milestone score:", error);
    reportError({
      type: "api_error",
      endpoint: "setMilestoneScore",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

export const predictEngagement = (payload) => {
  const token = localStorage.getItem("apiToken");
  const url = getConfig("REACT_APP_ENGAGEMENT_PREDICT_URL");

  axios
    .post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((error) => {
      console.error("Error predicting engagement:", error);
    });
};

export const callEngagementPredictor = async (subSessionId = null) => {
  const isEnabled =
    getConfig("REACT_APP_IS_ENGAGEMENT_PREDICT_ENABLE") === "true";
  if (!isEnabled) return;

  try {
    const lang = getLocalData("lang");

    // Only call for English language
    if (lang !== "en") {
      return;
    }

    const token = localStorage.getItem("apiToken");
    const session_id = getLocalData("sessionId");

    if (!token || !session_id) {
      console.warn("Missing token or session_id for engagement prediction");
      return;
    }

    // Get milestone level
    let milestoneLevel = "m0";
    try {
      const milestoneData = getLocalData("getMilestone");
      if (milestoneData) {
        const parsed = JSON.parse(milestoneData);
        milestoneLevel = parsed?.data?.milestone_level || "m0";
      }
    } catch (e) {
      console.error("Error parsing milestone data:", e);
    }

    // Get interactions from localStorage using subSessionId
    const sessionIdToUse = subSessionId || getLocalData("sub_session_id");
    if (!sessionIdToUse) {
      console.log("No sub_session_id found for engagement prediction");
      return;
    }

    const interactionsToUse = getInteractions(sessionIdToUse);

    // Only call engagement predictor if we have interactions
    if (!interactionsToUse || interactionsToUse.length === 0) {
      console.log("No interactions found for engagement prediction");
      return;
    }

    // Get lesson number
    let practiceProgress = getLocalData("practiceProgress");
    practiceProgress = practiceProgress ? JSON.parse(practiceProgress) : {};
    let lessonNumber = practiceProgress?.currentPracticeStep || "0";

    // Format interactions
    const formattedInteractions = interactionsToUse.map(
      (interaction, index) => ({
        interaction_id: index + 1,
        original_text: interaction.original_text,
        response_text: interaction.response_text,
        audio_path: interaction.audio_path,
        created_at: interaction.created_at || new Date().toISOString(),
      })
    );

    const engagementPayload = {
      token: token,
      session_id: session_id,
      milestone_level: milestoneLevel,
      lesson: String(lessonNumber),
      language: "en",
      interactions: formattedInteractions,
    };

    predictEngagement(engagementPayload);
  } catch (error) {
    console.error("Error calling engagement/predict API:", error);
  }
};
