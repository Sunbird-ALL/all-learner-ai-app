import axios from "axios";
import { reportError } from "../../utils/errorReporter";

const EVAL_URL =
  process.env.REACT_APP_EVAL_HOST ||
  "https://dev-ekstep-tell-ocr-service-985885894164.asia-south1.run.app";

/**
 * Low-level POST to the OCR/Gemini text evaluation endpoint.
 * Returns the parsed JSON response, or throws on network/parse errors.
 * @param {FormData} formData
 */
export const evaluateText = async (formData) => {
  try {
    const { data } = await axios.post(
      `${EVAL_URL}/api/v1/ocr/gemini/evaluateText`,
      formData
    );
    return data;
  } catch (error) {
    reportError({
      type: "api_error",
      endpoint: "evaluateText",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });
    throw error;
  }
};

/**
 * Higher-level evaluation helper — prepends "1. " to both texts and
 * returns a structured result object (marks, grades, semantics, etc.).
 * Used by apiUtil.js handleTextEvaluation.
 * @param {string} teacherText
 * @param {string} studentText
 */
export const handleTextEvaluation = async (teacherText, studentText) => {
  try {
    const formData = new FormData();
    formData.append("teacherText", `1. ${teacherText}`);
    formData.append("studentText", `1. ${studentText}`);

    const result = await evaluateText(formData);
    console.log("Evaluation API Response:", result);

    const evalResult = result?.responseObj?.responseDataParams?.data?.[0] || {};

    return {
      marks: evalResult.marks || 0,
      grades: evalResult.marks || 0,
      semantics: evalResult.semantics || 0,
      context: evalResult.context || 0,
      grammar: evalResult.grammar || 0,
      accuracy: evalResult.accuracy || 0,
      overall: evalResult.overall || 0,
    };
  } catch (error) {
    console.error("Error in evaluateText API:", error);
    return null;
  }
};
