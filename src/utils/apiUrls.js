const API_CONFIG = {
  public: {
    GET_VIRTUAL_ID: "api/virtualId/generateVirtualID",
    GET_MILESTONE: "scores/getMilestone/user",
    GET_POINTER: "api/pointer/getPoints",
    GET_ASSESSMENT: "v1/content/getAssessment",
    ADD_POINTER: "api/pointer/addPoints",
    ADD_LESSON: "api/lesson/addLesson",
    GET_SET_RESULT: "scores/getSetResult",
    GET_PAGINATION: "v1/content/pagination",
    UPDATE_LEARNER_PROFILE: "scores/updateLearnerProfile",
    GET_CONTENT: "scores/GetContent",
    GET_LESSON_PROGRESS_BY_ID: "api/lesson/getLessonProgressByUserId",
    CREATE_LEARNER_PROGRESS: "api/learnerProgress/createLearnerProgress",
  },
  v1: {
    GET_VIRTUAL_ID: "v1/api/virtualId/generateVirtualID",
    GET_MILESTONE: "v1/scores/getMilestone/user",
    GET_POINTER: "v1/api/pointer/getPoints",
    GET_ASSESSMENT: "v1/content/getAssessment",
    ADD_POINTER: "v1/api/pointer/addPoints",
    ADD_LESSON: "v1/api/lesson/addLesson",
    GET_SET_RESULT: "v1/scores/getSetResult",
    GET_PAGINATION: "v1/content/pagination",
    UPDATE_LEARNER_PROFILE: "v1/scores/updateLearnerProfile",
    GET_CONTENT: "v1/scores/GetContent",
    GET_LESSON_PROGRESS_BY_ID: "v1/api/lesson/getLessonProgressByUserId",
    CREATE_LEARNER_PROGRESS: "v1/api/learnerProgress/createLearnerProgress",
  },
  v2: {
    GET_VIRTUAL_ID: "v2/api/virtualId/generateVirtualID",
    GET_MILESTONE: "v2/scores/getMilestone/user",
    GET_POINTER: "v2/api/pointer/getPoints",
    GET_ASSESSMENT: "v2/content/getAssessment",
    ADD_POINTER: "v2/api/pointer/addPoints",
    ADD_LESSON: "v2/api/lesson/addLesson",
    GET_SET_RESULT: "v2/scores/getSetResult",
    GET_PAGINATION: "v2/content/pagination",
    UPDATE_LEARNER_PROFILE: "v2/scores/updateLearnerProfile",
    GET_CONTENT: "v2/scores/GetContent",
    GET_LESSON_PROGRESS_BY_ID: "v2/api/lesson/getLessonProgressByUserId",
    CREATE_LEARNER_PROGRESS: "v2/api/learnerProgress/createLearnerProgress",
  },
};

// Load the correct version based on environment variable (default to v1)
const API_URLS = API_CONFIG[process.env.REACT_APP_VERSION_NAME || "public"];

export default API_URLS;
