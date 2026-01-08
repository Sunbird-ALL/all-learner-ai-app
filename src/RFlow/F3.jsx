import React from "react";
import F1 from "./F1";

/**
 * F3 Flow - Similar structure to F1 but with different flow sequence
 * TODO: Define F3 flow sequence when requirements are provided
 */

// Define the F3 flow sequence (placeholder - update with actual flow)
const F3_FLOW = [
  // TODO: Define F3 flow sequence
  // Example: { type: "L", step: 1 }, { type: "P", step: 1 }, etc.
];

const F3 = (props) => {
  // For now, F3 uses the same structure as F1
  // Update this when F3 flow requirements are provided
  return <F1 {...props} flowSequence={F3_FLOW} flowKey="f3" />;
};

export default F3;
