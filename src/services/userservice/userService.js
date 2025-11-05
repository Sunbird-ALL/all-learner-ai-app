import axios from "axios";
import config from "../../utils/urlConstants.json";
import { jwtDecode } from "jwt-decode";

const API_HOST_VIRTUAL_ID_HOST = process.env.REACT_APP_VIRTUAL_ID_HOST;

export const fetchVirtualId = async (username) => {
  try {
    // Check if API host is configured
    if (!API_HOST_VIRTUAL_ID_HOST) {
      const error = new Error("API_HOST_VIRTUAL_ID_HOST is not configured");
      console.error("[Login] Configuration error:", error.message);
      throw error;
    }

    const url = `${API_HOST_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}`;
    console.log("[Login] Attempting to fetch virtual ID from:", url);
    console.log("[Login] API_HOST_VIRTUAL_ID_HOST:", API_HOST_VIRTUAL_ID_HOST);
    console.log("[Login] Full URL:", url);

    const response = await axios.post(url, null, {
      timeout: 30000, // 30 second timeout
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: function (status) {
        // Don't throw error for any status code
        return true;
      },
    }).then(response => {
      // Check if response is actually an error
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
      }
    });

    console.log("[Login] Virtual ID response received:", response.status);
    return response.data;
  } catch (error) {
    console.error("[Login] Error fetching virtual ID:", error);
    console.error("[Login] Error details:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      response: error?.response?.data,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
      },
      isAxiosError: error?.isAxiosError,
      request: error?.request ? "Request object exists" : "No request object",
    });
    
    // Provide more specific error message
    if (error?.code === 'ECONNABORTED') {
      error.message = "Request timeout - server took too long to respond";
    } else if (error?.code === 'ERR_NETWORK') {
      error.message = "Network error - unable to reach server. Check your connection and CORS settings.";
    } else if (error?.code === 'ERR_CANCELED') {
      error.message = "Request was canceled";
    }
    
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
