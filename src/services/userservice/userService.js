import { getConfig } from "../../config/runtimeConfig";
import axios from "axios";
import config from "../../utils/urlConstants.json";
import { jwtDecode } from "jwt-decode";
import { reportError } from "../../utils/errorReporter";

const API_HOST_VIRTUAL_ID_HOST = getConfig("REACT_APP_VIRTUAL_ID_HOST");

export const register = async (username) => {
  try {
    const response = await axios.post(
      `${API_HOST_VIRTUAL_ID_HOST}/${config.URLS.REGISTER}`,
      { username: username }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    reportError({
      type: "api_error",
      endpoint: "register",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

export const fetchUserCheck = async (username) => {
  try {
    const response = await axios.post(
      `${API_HOST_VIRTUAL_ID_HOST}/${config.URLS.GET_USER_CHECK}`,
      { username: username }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking user:", error);
    reportError({
      type: "api_error",
      endpoint: "fetchUserCheck",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

export const fetchVirtualId = async (username) => {
  try {
    const response = await axios.post(
      `${API_HOST_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching virtual ID:", error);
    reportError({
      type: "api_error",
      endpoint: "fetchVirtualId",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

export const getVirtualId = () => {
  const TOKEN = localStorage.getItem("apiToken");
  let virtualId;
  if (TOKEN) {
    try {
      const tokenDetails = jwtDecode(TOKEN);
      virtualId = JSON.stringify(tokenDetails?.virtual_id);
    } catch (error) {
      console.error("Error decoding token:", error);
      reportError({
        type: "api_error",
        endpoint: "getVirtualId",
        message: error?.message,
        stack: error?.stack,
      });
    }
  }
  return virtualId;
};
