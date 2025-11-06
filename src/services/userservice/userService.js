import axios from "axios";
import config from "../../utils/urlConstants.json";
import { jwtDecode } from "jwt-decode";

const API_HOST_VIRTUAL_ID_HOST = process.env.REACT_APP_VIRTUAL_ID_HOST;

// Detect if running on mobile device
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const fetchVirtualId = async (username) => {
  try {
    // Check if API host is configured
    if (!API_HOST_VIRTUAL_ID_HOST) {
      const error = new Error("API_HOST_VIRTUAL_ID_HOST is not configured");
      console.error("[Login] Configuration error:", error.message);
      throw error;
    }

    // Log device type for debugging
    const isMobile = isMobileDevice();
    console.log("[Login] Device type:", isMobile ? "Mobile" : "Desktop");
    console.log("[Login] User Agent:", navigator.userAgent);

    // Determine if we're using React dev server (has proxy) or production build
    // React dev server: scripts are from webpack-dev-server (no /static/ path)
    // Production build: scripts are from /static/js/main.*.js
    const isProductionBuild =
      document.querySelector('script[src*="/static/js/main."]') !== null;
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    let url;
    // Only use relative URL if we're on React dev server (has proxy configured)
    // For production build (npx serve or deployed), use full URL
    if (
      !isProductionBuild &&
      isLocalhost &&
      API_HOST_VIRTUAL_ID_HOST.includes("learnerai-dev.theall.ai")
    ) {
      // Use relative URL for proxy in React dev server
      url = `/all-orchestration-services/${config.URLS.GET_VIRTUAL_ID}?username=${username}`;
      console.log(
        "[Login] Using relative URL (proxy) for React dev server:",
        url
      );
    } else {
      // Use full URL for production build (npx serve or deployed)
      // Static servers don't have proxy, so we need full URL
      url = `${API_HOST_VIRTUAL_ID_HOST}/${config.URLS.GET_VIRTUAL_ID}?username=${username}`;
      console.log("[Login] Using full URL (production build):", url);
      if (isLocalhost) {
        console.warn(
          "[Login] Note: Testing production build locally. API server must allow CORS from localhost."
        );
      }
    }

    console.log("[Login] API_HOST_VIRTUAL_ID_HOST:", API_HOST_VIRTUAL_ID_HOST);
    console.log("[Login] Full URL:", url);

    // Send empty body - match the working curl request
    // Use empty string to ensure Content-Length: 0, not JSON "null"
    const response = await axios
      .post(url, "", {
        timeout: 30000, // 30 second timeout
        headers: {
          Accept: "application/json, text/plain, */*",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          // Don't set Content-Type for empty body - let axios handle it
          // Don't set Origin/Referer - browser sets these automatically
        },
        validateStatus: function (status) {
          // Don't throw error for any status code
          return true;
        },
      })
      .then((response) => {
        // Check if response is actually an error
        if (response.status >= 200 && response.status < 300) {
          return response;
        } else {
          throw new Error(
            `HTTP ${response.status}: ${JSON.stringify(response.data)}`
          );
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
    const isMobile = isMobileDevice();

    if (error?.code === "ECONNABORTED") {
      error.message = "Request timeout - server took too long to respond";
    } else if (error?.code === "ERR_NETWORK") {
      // Check if it's an SSL certificate error
      if (
        error?.message?.includes("CERT") ||
        error?.message?.includes("certificate")
      ) {
        if (isMobile) {
          error.message =
            "SSL certificate error detected on mobile. The API server's certificate is invalid. This is a server-side issue that must be fixed by the administrator. Desktop browsers may allow bypassing this, but mobile browsers block it for security.";
        } else {
          error.message =
            "SSL certificate error - the API server's certificate is invalid or expired. Please contact the server administrator.";
        }
      } else {
        if (isMobile) {
          error.message =
            "Network error on mobile device. This could be due to: 1) SSL certificate issues (mobile browsers are stricter), 2) CORS blocking, or 3) Network connectivity. Please check your connection.";
        } else {
          error.message =
            "Network error - unable to reach server. Check your connection and CORS settings.";
        }
      }
    } else if (
      error?.code === "ERR_CERT_AUTHORITY_INVALID" ||
      error?.code === "ERR_CERT_COMMON_NAME_INVALID"
    ) {
      if (isMobile) {
        error.message =
          "SSL certificate error on mobile: The API server's certificate is invalid or expired. Mobile browsers (especially Chrome on Android) block requests with invalid certificates for security. This must be fixed on the server side. Desktop browsers may show a warning but allow bypassing.";
      } else {
        error.message =
          "SSL certificate error - the API server's certificate is invalid. Please contact the server administrator.";
      }
    } else if (error?.code === "ERR_CANCELED") {
      error.message = "Request was canceled";
    }

    // Log mobile-specific diagnostic info
    if (isMobile) {
      console.error("[Login] Mobile device error - Additional diagnostics:", {
        userAgent: navigator.userAgent,
        onLine: navigator.onLine,
        connection: navigator.connection
          ? {
              effectiveType: navigator.connection.effectiveType,
              downlink: navigator.connection.downlink,
              rtt: navigator.connection.rtt,
            }
          : "Not available",
        errorCode: error?.code,
        errorMessage: error?.message,
      });
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
