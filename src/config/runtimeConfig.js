// Config source depends on how the app is run:
//  - Standalone (npm start / CRA build): build-time env from .env. Keys are
//    listed statically because CRA only inlines literal process.env.REACT_APP_X
//    references, not dynamic process.env[key]. These are ready at module load,
//    before routes/components read them.
//  - npm package: process.env is not present in the bundle, so these resolve to
//    undefined; the consumer passes a config prop and setConfig() replaces them
//    before App/routes are imported (see src/package-entry.jsx).
let config = {
  REACT_APP_APISLUG: process.env.REACT_APP_APISLUG,
  REACT_APP_AWS_S3_BUCKET_CONTENT_URL:
    process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL,
  REACT_APP_AWS_S3_BUCKET_URL: process.env.REACT_APP_AWS_S3_BUCKET_URL,
  REACT_APP_AXIOS_RETRY_DELAYS_SEC:
    process.env.REACT_APP_AXIOS_RETRY_DELAYS_SEC,
  REACT_APP_AXIOS_RETRY_ENABLED: process.env.REACT_APP_AXIOS_RETRY_ENABLED,
  REACT_APP_AXL_HOST: process.env.REACT_APP_AXL_HOST,
  REACT_APP_BATCHSIZE: process.env.REACT_APP_BATCHSIZE,
  REACT_APP_BUILD_NUMBER: process.env.REACT_APP_BUILD_NUMBER,
  REACT_APP_CAPTURE_AUDIO: process.env.REACT_APP_CAPTURE_AUDIO,
  REACT_APP_CHANNEL: process.env.REACT_APP_CHANNEL,
  REACT_APP_COMMIT_ID: process.env.REACT_APP_COMMIT_ID,
  REACT_APP_CONTENT_SERVICE_APP_HOST:
    process.env.REACT_APP_CONTENT_SERVICE_APP_HOST,
  REACT_APP_CSP_APP_HOST: process.env.REACT_APP_CSP_APP_HOST,
  REACT_APP_DEFAULT_NATIVE_LANGUAGE:
    process.env.REACT_APP_DEFAULT_NATIVE_LANGUAGE,
  REACT_APP_DOWNTIME_END_HOUR: process.env.REACT_APP_DOWNTIME_END_HOUR,
  REACT_APP_DOWNTIME_START_HOUR: process.env.REACT_APP_DOWNTIME_START_HOUR,
  REACT_APP_ENABLE_RESET_ROUTE: process.env.REACT_APP_ENABLE_RESET_ROUTE,
  REACT_APP_ENDPOINT: process.env.REACT_APP_ENDPOINT,
  REACT_APP_ENGAGEMENT_PREDICT_URL:
    process.env.REACT_APP_ENGAGEMENT_PREDICT_URL,
  REACT_APP_ENV: process.env.REACT_APP_ENV,
  REACT_APP_EVAL_HOST: process.env.REACT_APP_EVAL_HOST,
  REACT_APP_HOST: process.env.REACT_APP_HOST,
  REACT_APP_ID: process.env.REACT_APP_ID,
  REACT_APP_IS_APP_IFRAME: process.env.REACT_APP_IS_APP_IFRAME,
  REACT_APP_IS_AUDIOPREPROCESSING: process.env.REACT_APP_IS_AUDIOPREPROCESSING,
  REACT_APP_IS_ENGAGEMENT_PREDICT_ENABLE:
    process.env.REACT_APP_IS_ENGAGEMENT_PREDICT_ENABLE,
  REACT_APP_IS_IN_APP_AUTHORISATION:
    process.env.REACT_APP_IS_IN_APP_AUTHORISATION,
  REACT_APP_LANGUAGE: process.env.REACT_APP_LANGUAGE,
  REACT_APP_LANGUAGES: process.env.REACT_APP_LANGUAGES,
  REACT_APP_LEARNER_AI_APP_HOST: process.env.REACT_APP_LEARNER_AI_APP_HOST,
  REACT_APP_LEARNER_AI_ORCHESTRATION_HOST:
    process.env.REACT_APP_LEARNER_AI_ORCHESTRATION_HOST,
  REACT_APP_LOGIN_MODE: process.env.REACT_APP_LOGIN_MODE,
  REACT_APP_MAX_LEVEL: process.env.REACT_APP_MAX_LEVEL,
  REACT_APP_MIN_SCREEN_HEIGHT: process.env.REACT_APP_MIN_SCREEN_HEIGHT,
  REACT_APP_MIN_SCREEN_WIDTH: process.env.REACT_APP_MIN_SCREEN_WIDTH,
  REACT_APP_MODE: process.env.REACT_APP_MODE,
  REACT_APP_NATIVE_LANGUAGES: process.env.REACT_APP_NATIVE_LANGUAGES,
  REACT_APP_PARENT_ORIGIN_URL: process.env.REACT_APP_PARENT_ORIGIN_URL,
  REACT_APP_PID: process.env.REACT_APP_PID,
  REACT_APP_POST_LEARNER_PROGRESS: process.env.REACT_APP_POST_LEARNER_PROGRESS,
  REACT_APP_PRESIGNED_URL_SERVICE: process.env.REACT_APP_PRESIGNED_URL_SERVICE,
  REACT_APP_RECOMMENDATION_API_LANGUAGES:
    process.env.REACT_APP_RECOMMENDATION_API_LANGUAGES,
  REACT_APP_SHOW_HELP_VIDEO: process.env.REACT_APP_SHOW_HELP_VIDEO,
  REACT_APP_TELEMETRY_MODE: process.env.REACT_APP_TELEMETRY_MODE,
  REACT_APP_USE_RECOMMENDATION_API:
    process.env.REACT_APP_USE_RECOMMENDATION_API,
  REACT_APP_VER: process.env.REACT_APP_VER,
  REACT_APP_VIRTUAL_ID_HOST: process.env.REACT_APP_VIRTUAL_ID_HOST,
};

// npm package: replace the (empty) build-time defaults with the config prop.
export function setConfig(payload) {
  config = payload && typeof payload === "object" ? payload : {};
  return config;
}

// Returns undefined for unknown keys; call sites already guard with `|| ""` / `=== "true"`.
export function getConfig(key) {
  return config[key];
}
