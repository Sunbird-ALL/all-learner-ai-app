import { interact, start } from "../services/telementryService";
const duration = new Date().getTime();
export const interactCall = (telemetryMode) => {
  interact(telemetryMode);
};

export const startEvent = (languages, token) => {
  start(duration, languages, token);
};
