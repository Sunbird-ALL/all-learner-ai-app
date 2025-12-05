import { CsTelemetryModule } from "@project-sunbird/client-services/telemetry";
import { uniqueId } from "./utilService";
import { jwtDecode } from "../../node_modules/jwt-decode/build/cjs/index";
import { getLocalData, setLocalData } from "../utils/constants";

let startTime; // Variable to store the timestamp when the start event is raised
let contentSessionId;
let playSessionId;
let url;
let isBuddyLogin = checkTokenInLocalStorage();
let deviceInfoCache = {}; // Cache device info per device ID to avoid recalculating for every event
let currentDeviceId = null; // Store the current device ID from initialization

if (localStorage.getItem("token") !== null) {
  let jwtToken = localStorage.getItem("token");
  let userDetails = jwtDecode(jwtToken);
}

function checkTokenInLocalStorage() {
  const token = localStorage.getItem("buddyToken");
  return !!token; // Returns true if token is present, false if token is null or undefined
}

// if (localStorage.getItem("contentSessionId") !== null) {
//   contentSessionId = localStorage.getItem("contentSessionId");
// } else {
//   contentSessionId = localStorage.getItem("sessionId") || uniqueId();
//   localStorage.setItem("sessionId", contentSessionId);
//   localStorage.setItem("allAppContentSessionId", contentSessionId);
// }

if (getLocalData("contentSessionId") !== null) {
  contentSessionId = getLocalData("contentSessionId");
} else {
  contentSessionId = getLocalData("sessionId") || uniqueId();
  setLocalData("sessionId", contentSessionId);
  setLocalData("allAppContentSessionId", contentSessionId);
}

let getUrl = window.location.href;
url = getUrl && getUrl.includes("#") && getUrl.split("#")[1].split("/")[1];

export const initialize = async ({ context, config, metadata }) => {
  playSessionId = uniqueId();
  if (!CsTelemetryModule.instance.isInitialised) {
    await CsTelemetryModule.instance.init({});

    // Store device ID for caching device info per device
    currentDeviceId = context.did;

    // Get and cache device info for this device ID
    const deviceInfo = getCachedDeviceInfo(context.did);

    // Build complete device cdata array - set once in config
    const deviceCdata = [
      { id: deviceInfo.deviceType, type: "Device" },
      { id: deviceInfo.platform, type: "Platform" },
      { id: deviceInfo.browser, type: "Browser" },
      { id: deviceInfo.screenResolution, type: "ScreenResolution" },
      { id: deviceInfo.orientation, type: "Orientation" },
      { id: deviceInfo.touchSupport ? "Yes" : "No", type: "TouchSupport" },
      { id: deviceInfo.connectionType, type: "ConnectionType" },
      { id: deviceInfo.language, type: "DeviceLanguage" },
      { id: deviceInfo.timezone, type: "Timezone" },
      { id: String(deviceInfo.timezoneOffset), type: "TimezoneOffset" },
      { id: String(deviceInfo.hardwareConcurrency), type: "CPU Cores" },
      {
        id:
          deviceInfo.deviceMemory !== "unknown"
            ? String(deviceInfo.deviceMemory) + "GB"
            : "unknown",
        type: "DeviceMemory",
      },
      { id: String(deviceInfo.pixelRatio), type: "PixelRatio" },
      { id: String(deviceInfo.colorDepth), type: "ColorDepth" },
      {
        id:
          deviceInfo.connectionDownlink !== "unknown"
            ? String(deviceInfo.connectionDownlink)
            : "unknown",
        type: "ConnectionDownlink",
      },
      { id: deviceInfo.userAgent, type: "UserAgent" },
    ];

    const telemetryConfig = {
      config: {
        pdata: context.pdata,
        env: "",
        channel: context.channel,
        did: context.did,
        authtoken: context.authToken || "",
        uid:
          getLocalData("virtualId") ||
          localStorage.getItem("apiToken") ||
          "anonymous",
        sid: context.sid,
        batchsize: process.env.REACT_APP_BATCHSIZE,
        mode: context.mode,
        host: context.host,
        apislug: context.apislug,
        endpoint: context.endpoint,
        tags: context.tags,
        // Device info set once in config - will be included in all events
        cdata: [
          { id: contentSessionId, type: "ContentSession" },
          { id: playSessionId, type: "PlaySession" },
          ...deviceCdata, // Spread all device info into config cdata
        ],
      },
      userOrgDetails: {},
    };

    try {
      await CsTelemetryModule.instance.telemetryService.initTelemetry(
        telemetryConfig
      );
    } catch (error) {
      console.error(":e", error);
    }
  }
};

export const start = (duration) => {
  try {
    startTime = Date.now(); // Record the start time
    // Use cached device info for current device
    const deviceInfo = getCachedDeviceInfo(currentDeviceId);

    // Create a comprehensive device specification string
    const dspec = JSON.stringify({
      userAgent: deviceInfo.userAgent,
      deviceType: deviceInfo.deviceType,
      platform: deviceInfo.platform,
      browser: deviceInfo.browser,
      screenResolution: deviceInfo.screenResolution,
      pixelRatio: deviceInfo.pixelRatio,
      colorDepth: deviceInfo.colorDepth,
      touchSupport: deviceInfo.touchSupport,
      orientation: deviceInfo.orientation,
      connectionType: deviceInfo.connectionType,
      connectionDownlink: deviceInfo.connectionDownlink,
      hardwareConcurrency: deviceInfo.hardwareConcurrency,
      deviceMemory: deviceInfo.deviceMemory,
      language: deviceInfo.language,
      timezone: deviceInfo.timezone,
      timezoneOffset: deviceInfo.timezoneOffset,
    });

    CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
      options: getEventOptions(),
      edata: {
        type: "content",
        mode: "play",
        stageid: url,
        duration: Number((duration / 1e3).toFixed(2)),
        dspec: dspec,
      },
    });
  } catch (error) {
    console.error("err", error);
  }
};

export const response = (context, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry(
      {
        ...context,
      },
      getEventOptions()
    );
  }
};

export const Log = (context, pageid, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    try {
      CsTelemetryModule.instance.telemetryService.raiseLogTelemetry({
        options: getEventOptions(),
        edata: {
          type: "api_call",
          level: "TRACE",
          message: context,
          pageid: pageid,
        },
      });
    } catch (error) {
      console.error("Failed to log telemetry:", error, {
        context,
        pageid,
        telemetryMode,
      });
    }
  }
};

export const end = (data) => {
  try {
    const endTime = Date.now(); // Record the end time
    const duration = ((endTime - startTime) / 1000).toFixed(2); // Calculate duration in seconds

    CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
      edata: {
        type: "content",
        mode: "play",
        pageid: url,
        summary: data?.summary || {},
        duration: duration, // Log the calculated duration
      },
    });
  } catch (error) {
    console.error("Error in end telemetry event:", error);
  }
};

export const interact = (telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
      options: getEventOptions(),
      edata: { type: "TOUCH", subtype: "", pageid: url },
    });
  }
};

export const search = (id) => {
  CsTelemetryModule.instance.telemetryService.raiseSearchTelemetry({
    options: getEventOptions(),
    edata: {
      // Required
      type: "content", // Required. content, assessment, asset
      query: id, // Required. Search query string
      filters: {}, // Optional. Additional filters
      sort: {}, // Optional. Additional sort parameters
      correlationid: "", // Optional. Server generated correlation id (for mobile app's telemetry)
      size: 0, // Required. Number of search results
      topn: [{}], // Required. top N (configurable) results with their score
    },
  });
};

export const impression = (currentPage, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
      options: getEventOptions(),
      edata: {
        type: "workflow",
        subtype: "",
        pageid: currentPage + "",
        uri: "",
      },
    });
  }
};

export const error = (error, data, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
      options: getEventOptions(),
      edata: {
        pageid: url,
        err: data.err,
        errtype: data.errtype,
        stacktrace: error.toString() || "",
      },
    });
  }
};

export const feedback = (data, contentId, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    CsTelemetryModule.instance.telemetryService.raiseFeedBackTelemetry({
      options: getEventOptions(),
      edata: {
        contentId: contentId,
        rating: data,
        comments: "",
      },
    });
  }
};

function checkTelemetryMode(currentMode) {
  return (
    (process.env.REACT_APP_TELEMETRY_MODE === "ET" && currentMode === "ET") ||
    (process.env.REACT_APP_TELEMETRY_MODE === "NT" &&
      (currentMode === "ET" || currentMode === "NT")) ||
    (process.env.REACT_APP_TELEMETRY_MODE === "DT" &&
      (currentMode === "ET" || currentMode === "NT" || currentMode === "DT"))
  );
}

const getVirtualId = () => {
  const TOKEN = localStorage.getItem("apiToken");
  // let virtualId;
  // if (TOKEN) {
  //   const tokenDetails = jwtDecode(TOKEN);
  //   virtualId = JSON.stringify(tokenDetails?.virtual_id);
  // }
  return TOKEN;
};

/**
 * Gathers comprehensive device information for telemetry logging
 * @returns {Object} Device information object
 */
const getDeviceInfo = () => {
  const nav = window.navigator;
  const screen = window.screen;

  // Detect device type
  const userAgent = nav.userAgent || "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
  const isTablet =
    /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);
  let deviceType = "Desktop";
  if (isTablet) {
    deviceType = "Tablet";
  } else if (isMobile) {
    deviceType = "Mobile";
  }

  // Detect platform/OS
  let platform = nav.platform || "Unknown";
  if (userAgent.includes("Windows")) platform = "Windows";
  else if (userAgent.includes("Mac")) platform = "Mac";
  else if (userAgent.includes("Linux")) platform = "Linux";
  else if (userAgent.includes("Android")) platform = "Android";
  else if (
    userAgent.includes("iOS") ||
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  )
    platform = "iOS";

  // Detect browser
  let browser = "Unknown";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
    browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    browser = "Safari";
  else if (userAgent.includes("Edg")) browser = "Edge";
  else if (userAgent.includes("Opera") || userAgent.includes("OPR"))
    browser = "Opera";

  // Screen information
  const screenWidth = screen.width || 0;
  const screenHeight = screen.height || 0;
  const screenResolution = `${screenWidth}x${screenHeight}`;
  const colorDepth = screen.colorDepth || 0;
  const pixelRatio = window.devicePixelRatio || 1;

  // Device capabilities
  const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const orientation = screen.orientation
    ? screen.orientation.type
    : screenWidth > screenHeight
    ? "landscape"
    : "portrait";

  // Connection information (if available)
  const connection =
    nav.connection || nav.mozConnection || nav.webkitConnection;
  const connectionType = connection
    ? connection.effectiveType || connection.type || "unknown"
    : "unknown";
  const connectionDownlink = connection
    ? connection.downlink || "unknown"
    : "unknown";

  // Hardware information (if available)
  const hardwareConcurrency = nav.hardwareConcurrency || "unknown";
  const deviceMemory = nav.deviceMemory || "unknown";

  // Language and timezone
  const language = nav.language || nav.userLanguage || "unknown";
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
  const timezoneOffset = new Date().getTimezoneOffset();

  return {
    userAgent: userAgent,
    deviceType: deviceType,
    platform: platform,
    browser: browser,
    screenResolution: screenResolution,
    screenWidth: screenWidth,
    screenHeight: screenHeight,
    colorDepth: colorDepth,
    pixelRatio: pixelRatio,
    touchSupport: touchSupport,
    orientation: orientation,
    connectionType: connectionType,
    connectionDownlink: connectionDownlink,
    hardwareConcurrency: hardwareConcurrency,
    deviceMemory: deviceMemory,
    language: language,
    timezone: timezone,
    timezoneOffset: timezoneOffset,
  };
};

/**
 * Get cached device info per device ID (did)
 * Device info is unique per device, so we cache it per device ID
 * This ensures each device has its own cached device information
 * @param {string} deviceId - The device ID (did). If not provided, uses currentDeviceId
 */
const getCachedDeviceInfo = (deviceId = null) => {
  // Use provided device ID, or fall back to current device ID, or generate one
  const did = deviceId || currentDeviceId || getDeviceId();

  // If device info not cached for this device ID, calculate and cache it
  if (!deviceInfoCache[did]) {
    deviceInfoCache[did] = getDeviceInfo();
  }

  return deviceInfoCache[did];
};

/**
 * Get device ID from localStorage or generate one
 * Device ID should be consistent for the same device
 */
const getDeviceId = () => {
  // Try to get device ID from localStorage or generate one
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = uniqueId();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

/**
 * Clear cached device info for a specific device ID
 * @param {string} deviceId - Optional device ID. If not provided, clears all cache
 */
export const clearDeviceInfoCache = (deviceId = null) => {
  if (deviceId) {
    delete deviceInfoCache[deviceId];
  } else {
    deviceInfoCache = {};
  }
};

/**
 * Get event options with dynamic fields only
 * Device info is set once in telemetryConfig during initialization
 * This function only handles dynamic fields that change per event (user, session)
 */
export const getEventOptions = () => {
  var emis_username =
    localStorage.getItem("virtualId") ||
    localStorage.getItem("apiToken") ||
    "anonymous";
  var buddyUserId = "";
  var userDetails = null;

  if (localStorage.getItem("token") !== null) {
    let jwtToken = localStorage.getItem("token");
    userDetails = jwtDecode(jwtToken);
    emis_username = userDetails.emis_username;
  }

  if (isBuddyLogin) {
    let jwtToken = localStorage.getItem("buddyToken");
    let buddyUserDetails = jwtDecode(jwtToken);
    buddyUserId = buddyUserDetails.emis_username;
  }

  const userType = isBuddyLogin ? "Buddy User" : "User";
  const userId = isBuddyLogin
    ? emis_username + "/" + buddyUserId
    : emis_username ||
      localStorage.getItem("virtualId") ||
      localStorage.getItem("apiToken") ||
      "anonymous";

  // Only return dynamic fields that change per event
  // Device info is already set in telemetryConfig.cdata during initialization
  // Sunbird telemetry SDK will merge config cdata with event cdata
  return {
    object: {},
    context: {
      pdata: {
        // optional
        id: process.env.REACT_APP_ID, // Producer ID. For ex: For sunbird it would be "portal" or "genie"
        ver: process.env.REACT_APP_VER, // Version of the App
        pid: process.env.REACT_APP_PID, // Optional. In case the component is distributed, then which instance of that component
      },
      env: process.env.REACT_APP_ENV,
      uid: `${
        isBuddyLogin
          ? emis_username + "/" + buddyUserId
          : emis_username ||
            getLocalData("virtualId") ||
            localStorage.getItem("apiToken") ||
            "anonymous"
      }`,
      cdata: [
        // Dynamic session/user fields that may change per event
        {
          id: getLocalData("sessionId") || contentSessionId,
          type: "ContentSession",
        },
        { id: playSessionId, type: "PlaySession" },
        { id: userId, type: userType },
        { id: getLocalData("lang") || "ta", type: "language" },
        { id: userDetails?.school_name, type: "school_name" },
        {
          id: userDetails?.class_studying_id,
          type: "class_studying_id",
        },
        { id: userDetails?.udise_code, type: "udise_code" },
        { id: getVirtualId() || null, type: "virtualId" },
        // Device info is NOT included here - it's set in telemetryConfig.cdata
        // The telemetry SDK will merge config cdata with event cdata
      ],
      rollup: {},
    },
  };
};
