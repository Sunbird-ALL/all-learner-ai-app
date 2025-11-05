import axios from "axios";
import config from "../../utils/urlConstants.json";
import { jwtDecode } from "jwt-decode";

const API_HOST_VIRTUAL_ID_HOST = process.env.REACT_APP_VIRTUAL_ID_HOST;

export const fetchVirtualId = async (username) => {
  try {
    const url = `${API_HOST_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}`;
    console.log("[Login] Attempting to fetch virtual ID from:", url);
    console.log("[Login] API_HOST_VIRTUAL_ID_HOST:", API_HOST_VIRTUAL_ID_HOST);

    const response = await axios.post(url, null, {
      timeout: 30000, // 30 second timeout
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("[Login] Virtual ID response received:", response.status);
    return response.data;
  } catch (error) {
    console.error("[Login] Error fetching virtual ID:", error);
    console.error("[Login] Error details:", {
      message: error?.message,
      code: error?.code,
      response: error?.response?.data,
      status: error?.response?.status,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
      },
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
    }
  }
  return virtualId;
};
