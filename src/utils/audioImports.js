// Audio imports
const audioFiles = {
  s1: new URL("../assets/audio/S1.m4a", import.meta.url).href,
  s2: new URL("../assets/audio/S2.m4a", import.meta.url).href,
  s3: new URL("../assets/audio/S3.m4a", import.meta.url).href,
  s4: new URL("../assets/audio/S4.m4a", import.meta.url).href,
  s5: new URL("../assets/audio/S5.m4a", import.meta.url).href,
  s6: new URL("../assets/audio/S6.m4a", import.meta.url).href,
  v1: new URL("../assets/audio/V1.m4a", import.meta.url).href,
  v2: new URL("../assets/audio/V2.m4a", import.meta.url).href,
  v3: new URL("../assets/audio/V3.m4a", import.meta.url).href,
  v4: new URL("../assets/audio/V4.m4a", import.meta.url).href,
  v5: new URL("../assets/audio/V5.m4a", import.meta.url).href,
  v6: new URL("../assets/audio/V6.m4a", import.meta.url).href,
  v7: new URL("../assets/audio/V7.m4a", import.meta.url).href,
  v8: new URL("../assets/audio/V8.m4a", import.meta.url).href,
  v10: new URL("../assets/audio/V10.mp3", import.meta.url).href,
  livesAdd: new URL("../assets/audio/livesAdd.wav", import.meta.url).href,
  livesCut: new URL("../assets/audio/livesCut.wav", import.meta.url).href,
};

export const AudioPath = {
  1: {
    0: audioFiles.v1,
    1: audioFiles.v2,
    2: audioFiles.v3,
    3: audioFiles.v4,
    4: audioFiles.v5,
    5: audioFiles.v6,
    6: audioFiles.v7,
    7: audioFiles.v8,
    10: audioFiles.v10,
  },
  2: {
    0: audioFiles.s1,
    1: audioFiles.s2,
    2: audioFiles.s3,
    3: audioFiles.s4,
    4: audioFiles.s5,
    5: audioFiles.s6,
  },
};

export const livesAddAudio = audioFiles.livesAdd;
export const livesCutAudio = audioFiles.livesCut;
