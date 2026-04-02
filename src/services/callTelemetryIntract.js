import { interact, start } from "../services/telemetryService";
const duration = new Date().getTime();
export const interactCall = (telemetryMode) => {
  interact(telemetryMode);
};

export const startEvent = () => {
  start(duration);
};
