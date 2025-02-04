import axios from "axios";
import config from "../../utils/urlConstants.json";

const API_BASE_URL_CONTENT_SERVICE =
  process.env.REACT_APP_CONTENT_SERVICE_APP_HOST;
const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJ2aXJ0dWFsX2lkIjo1ODU5NDk5OTc5fQ.58zZunu96NzTU-0qOL-I86nVaafUdXyX5Dw78v6E2sQ";

export const fetchAssessmentData = async (lang) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_CONTENT_SERVICE}/${config.URLS.GET_ASSESSMENT}`,
      {
        tags: ["ASER"],
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
    console.error("Error fetching assessment:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const fetchPaginatedContent = async (
  collectionId,
  page = 1,
  limit = 5
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL_CONTENT_SERVICE}/${config.URLS.GET_PAGINATION}?page=${page}&limit=${limit}&collectionId=${collectionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pagination data:", error);
    throw error; // Rethrow for handling in the calling function
  }
};
