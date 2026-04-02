import axios from "axios";
import config from "../../utils/urlConstants.json";
import { jwtDecode } from "jwt-decode";

const API_HOST_VIRTUAL_ID_HOST = process.env.REACT_APP_VIRTUAL_ID_HOST;

export const register = async (username) => {
  try {
    const response = await axios.post(
      `${API_HOST_VIRTUAL_ID_HOST}/${config.URLS.REGISTER}`,
      { username: username }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking user:", error);
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
    }
  }
  return virtualId;
};
