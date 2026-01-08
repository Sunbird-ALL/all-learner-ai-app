import React from "react";
import F1 from "./F1";

/**
 * F2 Flow - Similar structure to F1 but with different flow sequence
 * TODO: Define F2 flow sequence when requirements are provided
 */

// Define the F2 flow sequence (placeholder - update with actual flow)
const F2_FLOW = [
  // TODO: Define F2 flow sequence
  // Example: { type: "L", step: 1 }, { type: "P", step: 1 }, etc.
];

const F2 = (props) => {
  // For now, F2 uses the same structure as F1
  // Update this when F2 flow requirements are provided
  return <F1 {...props} flowSequence={F2_FLOW} flowKey="f2" />;
};

export default F2;
