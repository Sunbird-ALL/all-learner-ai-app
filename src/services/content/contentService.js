import axios from "axios";
import config from "../../utils/urlConstants.json";

const API_BASE_URL_CONTENT_SERVICE =
  process.env.REACT_APP_CONTENT_SERVICE_APP_HOST;

const getHeaders = (token) => {
  const apiToken = token ? token : localStorage.getItem("apiToken");
  return {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  };
};

export const fetchAssessmentData = async (lang, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_CONTENT_SERVICE}/${config.URLS.GET_ASSESSMENT}`,
      {
        tags: ["ASER"],
        language: lang,
      },
      getHeaders(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching assessment:", error);
    throw error;
  }
};

export const fetchPaginatedContent = async (
  collectionId,
  page = 1,
  limit = 5,
  token
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_CONTENT_SERVICE}/${config.URLS.GET_PAGINATION}?page=${page}&limit=${limit}&collectionId=${collectionId}`,
      getHeaders(token)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pagination data:", error);
    throw error; // Rethrow for handling in the calling function
  }
};
