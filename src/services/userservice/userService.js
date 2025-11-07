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
    console.log("[Login] Current origin:", window.location.origin);
    console.log("[Login] Is HTTPS:", window.location.protocol === "https:");

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

    // Check for SSL certificate errors in various ways
    const errorMessageLower = (error?.message || "").toLowerCase();
    const errorCodeLower = (error?.code || "").toLowerCase();
    const errorNameLower = (error?.name || "").toLowerCase();

    // Detect SSL certificate errors
    // On mobile, SSL errors often show as ERR_NETWORK because the browser blocks
    // the request before it can report a specific SSL error code
    const targetUrl = error?.config?.url || "";
    const isHTTPSRequest = targetUrl.startsWith("https:");
    const isHTTPSApp = window.location.protocol === "https:";
    const hasNoResponse = !error?.response && !error?.request?.response;

    // Mobile browsers often report ERR_NETWORK for SSL errors because they block
    // the request before connection, so we need to infer it's SSL-related
    const isLikelySSLErrorOnMobile =
      isMobile &&
      error?.code === "ERR_NETWORK" &&
      isHTTPSRequest &&
      isHTTPSApp &&
      hasNoResponse;

    const isSSLError =
      errorCodeLower.includes("cert") ||
      errorCodeLower.includes("ssl") ||
      errorCodeLower.includes("tls") ||
      errorMessageLower.includes("cert") ||
      errorMessageLower.includes("ssl") ||
      errorMessageLower.includes("tls") ||
      errorMessageLower.includes("authority") ||
      errorMessageLower.includes("invalid certificate") ||
      error?.code === "ERR_CERT_AUTHORITY_INVALID" ||
      error?.code === "ERR_CERT_COMMON_NAME_INVALID" ||
      error?.code === "ERR_CERT_DATE_INVALID" ||
      error?.code === "ERR_SSL_PROTOCOL_ERROR" ||
      isLikelySSLErrorOnMobile; // Mobile browsers often report ERR_NETWORK for SSL errors

    // Detect CORS errors
    const isCORSError =
      errorMessageLower.includes("cors") ||
      errorMessageLower.includes("access-control") ||
      errorMessageLower.includes("origin") ||
      (error?.response?.status === 0 && !error?.response?.data); // CORS often results in status 0

    // Detect network connectivity errors
    const isNetworkError =
      error?.code === "ERR_NETWORK" ||
      error?.code === "ECONNREFUSED" ||
      error?.code === "ETIMEDOUT" ||
      error?.code === "ENOTFOUND" ||
      (!error?.response && !isSSLError && !isCORSError);

    console.error("[Login] Error classification:", {
      isSSLError,
      isCORSError,
      isNetworkError,
      errorCode: error?.code,
      errorMessage: error?.message,
      isLikelySSLErrorOnMobile: isLikelySSLErrorOnMobile || false,
      targetUrl: targetUrl,
      isHTTPSRequest,
      isHTTPSApp,
      hasNoResponse,
    });

    if (error?.code === "ECONNABORTED") {
      error.message = "Request timeout - server took too long to respond";
    } else if (isSSLError) {
      if (isMobile) {
        error.message =
          "SSL Certificate Error (Mobile): The API server's SSL certificate is invalid or expired. Mobile browsers block these requests for security. This must be fixed on the server side. Desktop browsers may allow bypassing, but mobile cannot.";
        console.error(
          "[Login] SSL Certificate Error - This is why it works on desktop but not mobile"
        );
      } else {
        error.message =
          "SSL certificate error - the API server's certificate is invalid or expired. Please contact the server administrator.";
      }
    } else if (isCORSError) {
      if (isMobile) {
        error.message =
          "CORS Error (Mobile): The API server is blocking requests from this origin. The server needs to allow CORS from your domain. Check server CORS configuration.";
        console.error(
          "[Login] CORS Error - Server is blocking cross-origin requests"
        );
      } else {
        error.message =
          "CORS error - the API server is blocking requests from this origin. Please check server CORS configuration.";
      }
    } else if (error?.code === "ERR_NETWORK" || isNetworkError) {
      if (isMobile && isLikelySSLErrorOnMobile) {
        // On mobile, ERR_NETWORK with HTTPS target and no response is almost always SSL
        error.message =
          "SSL Certificate Error (Mobile): The API server's SSL certificate is invalid or expired. Mobile browsers block these requests for security (reported as 'Network Error'). This must be fixed on the server side. Desktop browsers may allow bypassing, but mobile cannot.";
        console.error(
          "[Login] SSL Certificate Error (detected from ERR_NETWORK pattern) - This is why it works on desktop but not mobile"
        );
      } else if (isMobile) {
        // Most likely SSL on mobile, but could be other issues
        error.message =
          "Network Error (Mobile): Unable to reach the server. Most likely cause: SSL certificate invalid (mobile browsers block this). Other possibilities: Server down, network issue, or CORS blocking. Check browser console for detailed error code.";
        console.error(
          "[Login] Network Error on Mobile - Check error classification above to identify root cause"
        );
      } else {
        error.message =
          "Network error - unable to reach server. Check your connection and CORS settings.";
      }
    } else if (error?.code === "ERR_CANCELED") {
      error.message = "Request was canceled";
    }

    // Log mobile-specific diagnostic info
    if (isMobile) {
      const diagnostics = {
        userAgent: navigator.userAgent,
        onLine: navigator.onLine,
        connection: navigator.connection
          ? {
              effectiveType: navigator.connection.effectiveType,
              downlink: navigator.connection.downlink,
              rtt: navigator.connection.rtt,
              saveData: navigator.connection.saveData,
            }
          : "Not available",
        errorCode: error?.code,
        errorMessage: error?.message,
        errorName: error?.name,
        url: error?.config?.url,
        origin: window.location.origin,
        protocol: window.location.protocol,
        isHTTPS: window.location.protocol === "https:",
        targetProtocol: error?.config?.url?.startsWith("https:")
          ? "https"
          : "http",
        errorClassification: {
          isSSLError,
          isCORSError,
          isNetworkError,
        },
      };

      console.error(
        "[Login] Mobile device error - Additional diagnostics:",
        diagnostics
      );

      // Try to provide actionable advice
      if (diagnostics.targetProtocol === "https" && diagnostics.isHTTPS) {
        console.error(
          "[Login] Both app and API use HTTPS - SSL certificate issue is most likely"
        );
      } else if (diagnostics.targetProtocol === "http" && diagnostics.isHTTPS) {
        console.error(
          "[Login] Mixed content: App is HTTPS but API is HTTP - this may be blocked"
        );
      }
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
