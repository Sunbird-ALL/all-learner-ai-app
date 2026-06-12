// Jest mock for @number-flow/react — avoids resolving number-flow/csp internals in test env
const React = require("react");

const NumberFlow = ({ value }) => React.createElement("span", null, value);
NumberFlow.displayName = "NumberFlow";

module.exports = NumberFlow;
module.exports.default = NumberFlow;
module.exports.NumberFlowGroup = ({ children }) =>
  React.createElement("span", null, children);
module.exports.useCanAnimate = () => false;
module.exports.useIsSupported = () => false;
module.exports.usePrefersReducedMotion = () => false;
