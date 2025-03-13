import axios from "axios";
import API_URLS from "../../utils/apiUrls";
import { getLocalData } from "../../utils/constants";

const API_BASE_URL_CONTENT_SERVICE =
  process.env.REACT_APP_CONTENT_SERVICE_APP_HOST;

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

export const fetchAssessmentData = async (lang) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_CONTENT_SERVICE}/${API_URLS.GET_ASSESSMENT}`,
      {
        tags: ["ASER"],
        language: lang,
      },
      getHeaders()
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
  limit = 5
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_CONTENT_SERVICE}/${API_URLS.GET_PAGINATION}?page=${page}&limit=${limit}&collectionId=${collectionId}`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pagination data:", error);
    throw error; // Rethrow for handling in the calling function
  }
};
