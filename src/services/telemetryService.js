import { CsTelemetryModule } from "@project-sunbird/client-services/telemetry";
import { uniqueId } from "./utilService";
import { jwtDecode } from "../../node_modules/jwt-decode/build/cjs/index";
import { getLocalData, setLocalData } from "../utils/constants";
import { reportError } from "../utils/errorReporter";
import {
  initSession,
  recordStep,
  recordAssess,
  recordResponse,
  recordInterruptStart,
  recordInterruptEnd,
  getSessionState,
  resetSession,
} from "./sessionManager";

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
  localStorage.setItem(
    "axl_game_session",
    JSON.stringify({
      currentUser: {
        username: getLocalData("virtualId") || localStorage.getItem("apiToken"),
        loginTime: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      },
      users: [],
    })
  );
  // One-time SDK setup: only run init() and collect device info once per page load.
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
  }

  // Always call initTelemetry so credentials (authToken, endpoint, uid) are
  // refreshed on every initialize() call — including page refresh and re-login.
  const telemetryConfig = {
    config: {
      pdata: context.pdata,
      env: "",
      channel: context.channel,
      did: context.did,
      authtoken: context.authToken || "",
      // uid: apiToken only — backend detokenises to resolved user ID (privacy)
      uid: localStorage.getItem("apiToken") || "anonymous",
      // sid: use provided value (from AXL on integration) or auto-generate for standalone
      sid:
        context.sid ||
        (() => {
          const existing = localStorage.getItem("sessionId");
          if (existing) return existing;
          const generated = uniqueId();
          localStorage.setItem("sessionId", generated);
          return generated;
        })(),
      batchsize: process.env.REACT_APP_BATCHSIZE,
      mode: context.mode,
      host: context.host,
      apislug: context.apislug,
      endpoint: context.endpoint,
      tags: context.tags,
      cdata: [
        { id: contentSessionId, type: "ContentSession" },
        { id: playSessionId, type: "PlaySession" },
        ...globalDeviceCdata,
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
    reportError({
      type: "telemetry_init_failure",
      message: error?.message,
      stack: error?.stack,
    });
  }
};

/**
 * start() — fires START event and begins session accumulation.
 * @param {string} stepTitle — current step title e.g. "P1", "L2" (optional)
 */
export const start = (stepTitle) => {
  try {
    if (CsTelemetryModule.instance.isInitialised) {
      startTime = Date.now();

      // Begin accumulating session data in sessionManager
      const milestone = localStorage.getItem("milestone") || null;
      const subMilestone = localStorage.getItem("subMilestone") || null;
      initSession(milestone, subMilestone);

      CsTelemetryModule.instance.telemetryService.raiseStartTelemetry({
        options: getEventOptions(),
        edata: {
          type: "content",
          mode: "play",
          stageid: stepTitle || "", // current step title; empty string if unknown
          duration: 0, // always 0 at session start
          dspec: window.navigator.userAgent,
        },
      });
    } else {
      console.warn("Telemetry service not initialized, skipping start event");
    }
  } catch (error) {
    console.error("err", error);
  }
};

export const response = (context, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    try {
      // Check if telemetry service is initialized
      if (CsTelemetryModule.instance.isInitialised) {
        recordResponse(); // update session accumulator (SUMMARY.interactions)
        CsTelemetryModule.instance.telemetryService.raiseResponseTelemetry(
          { ...context },
          getEventOptions()
        );
      } else {
        console.warn(
          "Telemetry service not initialized, skipping response event"
        );
      }
    } catch (error) {
      console.error("Error raising response telemetry:", error);
    }
  }
};

export const Log = (context, pageid, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    try {
      // Check if telemetry service is initialized
      if (CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseLogTelemetry({
          options: getEventOptions(),
          edata: {
            type: "api_call",
            level: "TRACE",
            message: context,
            pageid: pageid,
          },
        });
      } else {
        console.warn("Telemetry service not initialized, skipping log event");
      }
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
    // Check if telemetry service is initialized
    if (CsTelemetryModule.instance.isInitialised) {
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
    } else {
      console.warn("Telemetry service not initialized, skipping end event");
    }
  } catch (error) {
    console.error("Error in end telemetry event:", error);
  }
};

export const interact = (telemetryMode, subtype = "", pageid = "") => {
  if (checkTelemetryMode(telemetryMode)) {
    try {
      // Check if telemetry service is initialized
      if (CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
          options: getEventOptions(),
          edata: { type: "TOUCH", subtype: subtype, pageid: pageid },
        });
      } else {
        console.warn(
          "Telemetry service not initialized, skipping interact event"
        );
      }
    } catch (error) {
      console.error("Error raising interact telemetry:", error);
    }
  }
};

export const search = (id) => {
  try {
    // Check if telemetry service is initialized
    if (CsTelemetryModule.instance.isInitialised) {
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
    } else {
      console.warn("Telemetry service not initialized, skipping search event");
    }
  } catch (error) {
    console.error("Error raising search telemetry:", error);
  }
};

/**
 * impression() — page view / workflow step event.
 *
 * Legacy call:  impression(pageString, telemetryMode)
 * Step call:    impression({ pageid, subtype, uri, visits }, telemetryMode)
 *
 * When subtype="end" and pageid is set, automatically updates session accumulator.
 */
export const impression = (currentPageOrOptions, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    try {
      if (CsTelemetryModule.instance.isInitialised) {
        let edata;
        if (
          typeof currentPageOrOptions === "object" &&
          currentPageOrOptions !== null
        ) {
          const {
            pageid = "",
            subtype = "",
            uri = "",
            visits = [],
          } = currentPageOrOptions;

          // When a step ends, update session accumulator for SUMMARY
          if (subtype === "end" && pageid) {
            const durationMs = visits[0]?.duration || 0;
            recordStep(pageid, durationMs);
            localStorage.setItem("currentStep", pageid);
          }
          edata = {
            type: "workflow",
            subtype,
            pageid: pageid + "",
            uri,
            visits,
          };
        } else {
          // Legacy string call — keep backward compatibility
          edata = {
            type: "workflow",
            subtype: "",
            pageid: (currentPageOrOptions || "") + "",
            uri: "",
          };
        }

        CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
          options: getEventOptions(),
          edata,
        });
      } else {
        console.warn(
          "Telemetry service not initialized, skipping impression event"
        );
      }
    } catch (error) {
      console.error("Error raising impression telemetry:", error);
    }
  }
};

export const error = (error, data, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    try {
      // Check if telemetry service is initialized
      if (CsTelemetryModule.instance.isInitialised) {
        const resolvedPageId = data.pageid || url || "";
        const stacktrace = JSON.stringify(
          error?.response?.data || error?.message || {}
        );

        CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
          options: getEventOptions(),
          edata: {
            pageid: resolvedPageId,
            err: data.err || "API_ERROR",
            errtype: data.errtype || "SYSTEM",
            stacktrace: stacktrace || "",
            ...(data.object ? { object: data.object } : {}),
            ...(data.plugin ? { plugin: data.plugin } : {}),
          },
        });
      } else {
        console.warn("Telemetry service not initialized, skipping error event");
      }
    } catch (err) {
      console.error("Error raising error telemetry:", err);
    }
  }
};

export const feedback = (data, contentId, telemetryMode) => {
  if (checkTelemetryMode(telemetryMode)) {
    try {
      // Check if telemetry service is initialized
      if (CsTelemetryModule.instance.isInitialised) {
        CsTelemetryModule.instance.telemetryService.raiseFeedBackTelemetry({
          options: getEventOptions(),
          edata: {
            contentId: contentId,
            rating: data,
            comments: "",
          },
        });
      } else {
        console.warn(
          "Telemetry service not initialized, skipping feedback event"
        );
      }
    } catch (err) {
      console.error("Error raising feedback telemetry:", err);
    }
  }
};

/**
 * assess() — ASSESS event for step pass/fail result (Sunbird v3).
 * Call after every getSetResult API response and at F-series Apply step boundaries.
 *
 * @param {Object} data  { item: { id, type, maxscore }, pass, score, resvalues, duration }
 */
export const assess = (data) => {
  try {
    if (CsTelemetryModule.instance.isInitialised) {
      const {
        item = {},
        pass = false,
        score = 0,
        resvalues = [],
        duration = 0,
      } = data || {};

      recordAssess(pass); // update session accumulator

      // Correct method name: raiseAssesTelemetry (one 's') — per SDK TypeScript declaration
      // Correct signature: (data, options) — two separate params, not a wrapped object
      CsTelemetryModule.instance.telemetryService.raiseAssesTelemetry(
        {
          item: {
            id: item.id || "",
            type: item.type || "default",
            maxscore: item.maxscore || 1,
          },
          pass,
          score,
          resvalues,
          duration,
        },
        {
          ...getEventOptions(),
          object: { id: item.id || "", type: "Step", ver: "1.0" },
        }
      );
    } else {
      console.warn("Telemetry service not initialized, skipping assess event");
    }
  } catch (err) {
    console.error("Error raising assess telemetry:", err);
  }
};

/**
 * audit() — AUDIT event for object state/lifecycle change (Sunbird v3).
 * Call when a learner's milestone level changes.
 *
 * @param {Object} data  { props, state, prevstate, objectId, objectType }
 */
export const audit = (data) => {
  try {
    if (CsTelemetryModule.instance.isInitialised) {
      const {
        props = [],
        state: newState = "",
        prevstate = "",
        objectId = "",
        objectType = "Learner",
      } = data || {};

      CsTelemetryModule.instance.telemetryService.raiseAuditTelemetry({
        options: {
          ...getEventOptions(),
          object: {
            id: objectId || localStorage.getItem("apiToken") || "",
            type: objectType,
            ver: "1.0",
          },
        },
        edata: { props, state: newState, prevstate },
      });
    } else {
      console.warn("Telemetry service not initialized, skipping audit event");
    }
  } catch (err) {
    console.error("Error raising audit telemetry:", err);
  }
};

/**
 * interrupt() — INTERRUPT event for session disruption (tab switch, device lock).
 * Call from the visibilitychange listener in App.js.
 *
 * @param {Object} data  { type, pageid }
 */
export const interrupt = (data) => {
  try {
    if (CsTelemetryModule.instance.isInitialised) {
      const { type = "background", pageid = "" } = data || {};
      CsTelemetryModule.instance.telemetryService.raiseLogTelemetry({
        options: getEventOptions(),
        edata: {
          type: "INTERRUPT",
          level: "INFO",
          message: type,
          pageid,
        },
      });
    } else {
      console.warn(
        "Telemetry service not initialized, skipping interrupt event"
      );
    }
  } catch (err) {
    console.error("Error raising interrupt telemetry:", err);
  }
};

/**
 * fireSessionEnd() — fires END + SUMMARY together at any session exit point.
 *
 * Call from:
 *   1. App.js — beforeunload handler (tab close / page refresh)
 *   2. LoginPage.jsx — logout handler
 *   3. AssesmentEnd.jsx — milestone complete screen
 */
export const fireSessionEnd = () => {
  try {
    const s = getSessionState();
    if (!s.startTs) return; // no active session

    if (!CsTelemetryModule.instance.isInitialised) {
      console.warn("Telemetry service not initialized, skipping END + SUMMARY");
      return;
    }

    const now = Date.now();
    const timespent = Math.round((now - s.startTs - s.totalInterruptMs) / 1000);

    // END event
    CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
      edata: {
        type: "content",
        mode: "play",
        pageid: localStorage.getItem("currentStep") || "",
        duration: timespent,
        summary: [
          { id: "stepsCompleted", type: "Number", value: s.stepsCompleted },
          { id: "stepsPassed", type: "Number", value: s.stepsPassed },
        ],
      },
    });

    // SUMMARY event — pre-aggregated session document for Metabase dashboards
    // Correct signature: raiseSummaryTelemetry(data, options) — two separate params
    // This fixes the double-nesting issue (events.edata.edata) in MongoDB
    CsTelemetryModule.instance.telemetryService.raiseSummaryTelemetry(
      {
        type: "session",
        mode: "play",
        starttime: s.startTs,
        endtime: now,
        timespent,
        pageviews: s.steps.length,
        interactions: s.responseCount,
        pagesummary: s.steps.map((st) => ({
          id: st.stepId,
          type: "Step",
          env: "all-player",
          timespent: Math.round(st.durationMs / 1000),
          visits: 1,
        })),
        eventssummary: [
          { eid: "IMPRESSION", count: s.impressionCount },
          { eid: "ASSESS", count: s.assessCount },
          { eid: "RESPONSE", count: s.responseCount },
          { eid: "INTERRUPT", count: s.interruptCount },
        ],
        extra: {
          milestone: s.milestone,
          subMilestone: s.subMilestone,
          language: s.language,
          stepsCompleted: s.stepsCompleted,
          stepsPassed: s.stepsPassed,
          stepsFailed: s.stepsFailed,
          totalAttempts: s.responseCount,
        },
      },
      getEventOptions()
    );

    resetSession(); // clear for next session
  } catch (err) {
    console.error("Error in fireSessionEnd:", err);
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
  // uid: apiToken only — backend detokenises to resolved user ID
  // Privacy: no school, grade, UDISE or demographic data stored in telemetry
  const apiToken = localStorage.getItem("apiToken") || "anonymous";

  let buddyUserId = "";
  if (isBuddyLogin) {
    try {
      const buddyUserDetails = jwtDecode(localStorage.getItem("buddyToken"));
      buddyUserId = buddyUserDetails.emis_username || "";
    } catch (_) {}
  }

  const uid = isBuddyLogin ? apiToken + "/" + buddyUserId : apiToken;

  return {
    object: {},
    context: {
      pdata: {
        id: process.env.REACT_APP_ID,
        ver: [
          process.env.REACT_APP_VER,
          process.env.REACT_APP_BUILD_NUMBER,
          process.env.REACT_APP_COMMIT_ID?.substring(0, 7),
        ]
          .filter(Boolean)
          .join("-"),
        pid: process.env.REACT_APP_PID,
      },
      env: process.env.REACT_APP_ENV,
      uid,
      cdata: [
        // Session identifiers
        {
          id: getLocalData("sessionId") || contentSessionId,
          type: "ContentSession",
        },
        { id: playSessionId, type: "PlaySession" },
        // Identity — apiToken only (backend resolves to user ID)
        { id: apiToken, type: "UserID" },
        // Learning context — non-identifiable
        { id: getLocalData("lang") || "", type: "language" },
        { id: localStorage.getItem("milestone") || "", type: "milestone" },
        // Device info — captured once at init
        ...globalDeviceCdata,
      ],
      rollup: {},
    },
  };
};
