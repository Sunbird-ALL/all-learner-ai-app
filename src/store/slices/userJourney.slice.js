import { createSlice } from "@reduxjs/toolkit";

const userJourneySlice = createSlice({
  name: "userJourney",
  initialState: {
    token: "",
    profileName: "",
    practiceProgress: {},
    allAppContentSessionId: "",
    getMilestone: {},
    language: "en",
    mechanism_id: "",
    sessionId: "",
    storyTitle: "",
    subSessionIid: "",
    userLevel: "",
    previousLevel: "",
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setProfileName(state, action) {
      state.profileName = action.payload;
    },
    setPracticeProgress(state, action) {
      state.practiceProgress = action.payload;
    },
    setAllAppContentSessionId(state, action) {
      state.allAppContentSessionId = action.payload;
    },
    setGetMilestone(state, action) {
      state.getMilestone = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setMechanismId(state, action) {
      state.mechanism_id = action.payload;
    },
    setSessionId(state, action) {
      state.sessionId = action.payload;
    },
    setStoryTitle(state, action) {
      state.storyTitle = action.payload;
    },
    setSubSessionId(state, action) {
      state.subSessionIid = action.payload;
    },
    setUserLevel(state, action) {
      state.userLevel = action.payload;
    },
    setPreviousLevel(state, action) {
      state.previousLevel = action.payload;
    },
  },
});

export const {
  setToken,
  setProfileName,
  setPracticeProgress,
  setAllAppContentSessionId,
  setGetMilestone,
  setLanguage,
  setMechanismId,
  setSessionId,
  setStoryTitle,
  setSubSessionId,
  setUserLevel,
  setPreviousLevel,
} = userJourneySlice.actions;

export default userJourneySlice.reducer;
