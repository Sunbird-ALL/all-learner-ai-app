import { CsTelemetryModule } from "@project-sunbird/client-services/telemetry";
import { uniqueId } from "./utilService";
import { jwtDecode } from "../../node_modules/jwt-decode/build/cjs/index";
import { getLocalData, setLocalData } from "../utils/constants";

let startTime; // Variable to store the timestamp when the start event is raised
let contentSessionId;
let playSessionId;
let url;
let isBuddyLogin = checkTokenInLocalStorage();

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

    // Get device info once during initialization
    const deviceInfo = getDeviceInfo();

    // Build device cdata array - set once and reused in all events
    const deviceCdata = [
      { id: deviceInfo.deviceType, type: "Device" },
      { id: deviceInfo.platform, type: "Platform" },
      { id: deviceInfo.browser, type: "Browser" },
      { id: deviceInfo.screenResolution, type: "ScreenResolution" },
      { id: deviceInfo.connectionType, type: "ConnectionType" },
      { id: String(deviceInfo.hardwareConcurrency), type: "CPU Cores" },
      {
        id:
          deviceInfo.deviceMemory !== "unknown"
            ? String(deviceInfo.deviceMemory) + "GB"
            : "unknown",
        type: "DeviceMemory",
      },
      {
        id:
          deviceInfo.connectionDownlink !== "unknown"
            ? String(deviceInfo.connectionDownlink)
            : "unknown",
        type: "ConnectionDownlink",
      },
      { id: deviceInfo.userAgent, type: "UserAgent" },
    ];

    // Store device cdata globally so it can be reused in getEventOptions
    globalDeviceCdata = deviceCdata;

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

    CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
      options: getEventOptions(),
      edata: {
        type: "content",
        mode: "play",
        stageid: url,
        duration: Number((duration / 1e3).toFixed(2)),
        dspec: window.navigator.userAgent,
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

  return {
    userAgent: userAgent,
    deviceType: deviceType,
    platform: platform,
    browser: browser,
    screenResolution: screenResolution,
    screenWidth: screenWidth,
    screenHeight: screenHeight,
    connectionType: connectionType,
    connectionDownlink: connectionDownlink,
    hardwareConcurrency: hardwareConcurrency,
    deviceMemory: deviceMemory,
  };
};

// Store device cdata globally so it can be reused in getEventOptions
let globalDeviceCdata = [];

/**
 * Get event options with all required fields including device info
 * Device info is calculated once during initialization and reused here
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

  // Include device info in every event to ensure it's logged
  // Device info is set once during initialization and stored in globalDeviceCdata
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
        // Include device info in every event to ensure it's logged
        ...globalDeviceCdata,
      ],
      rollup: {},
    },
  };
};
