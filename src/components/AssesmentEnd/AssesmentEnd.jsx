import { getConfig } from "../../config/runtimeConfig";
import MainLayout from "../Layout/MainLayout";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { getLocalData, setLocalData } from "../../utils/constants";
import { getUiStrings } from "../../constants/strings";
import { getFontFamily } from "../../utils/fontUtils";
import {
  AssesmentCompletePlane,
  AverageMood,
  BadMood,
  GoodMood,
  LevelRight,
} from "../Icons/SvgIcons";
import homeBackground from "../../assets/images/homeBackground.png";
import { Typography } from "../../../node_modules/@mui/material/index";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import { ProfileHeader } from "../Assesment/Assesment";
import desktopLevel5 from "../../assets/images/assesmentComplete.png";
import config from "../../utils/urlConstants.json";
import { uniqueId } from "../../services/utilService";
import usePreloadAudio from "../../hooks/usePreloadAudio";
import { fetchUserPoints } from "../../services/orchestration/orchestrationService";
import { getFetchMilestoneDetails } from "../../services/learnerAi/learnerAiService";

const AssesmentEnd = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [shake, setShake] = useState(true);
  const [level, setLevel] = useState("");
  const [previousLevel, setPreviousLevel] = useState("");
  const [points, setPoints] = useState(0);
  const levelCompleteAudioSrc = usePreloadAudio(LevelCompleteAudio);
  const [vocabCount, setVocabCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const lang = getLocalData("lang");
  const ui = getUiStrings(lang);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (levelCompleteAudioSrc && !hasFetchedData.current) {
      let audio = new Audio(levelCompleteAudioSrc);
      audio.play();
    }
  }, [levelCompleteAudioSrc]);

  useEffect(() => {
    if (hasFetchedData.current) return;

    (async () => {
      hasFetchedData.current = true;
      const virtualId = getLocalData("virtualId");
      const lang = getLocalData("lang");
      const previous_level = getLocalData("previous_level");
      setPreviousLevel(previous_level?.replace("m", ""));
      try {
        const getMilestoneDetails = await getFetchMilestoneDetails(lang);
        const { data } = getMilestoneDetails;
        setLevel(data.milestone_level);
        setLocalData("userLevel", data.milestone_level?.replace("m", ""));
        setVocabCount(data?.extra?.vocabulary_count || 0);
        setWordCount(data?.extra?.latest_towre_data?.wordsPerMinute || 0);
      } catch (error) {
        console.error(
          "Error fetching milestone details on AssesmentEnd:",
          error
        );
        // Fall back to the locally cached level so the screen still renders
        const cachedLevel = getLocalData("userLevel");
        if (cachedLevel) setLevel(`m${cachedLevel}`);
      }
      let sessionId = getLocalData("sessionId");
      if (!sessionId) {
        sessionId = uniqueId();
        setLocalData("sessionId", sessionId);
      }
      if (
        getConfig("REACT_APP_IS_APP_IFRAME") !== "true" &&
        (localStorage.getItem("contentSessionId") !== null ||
          getConfig("REACT_APP_IS_IN_APP_AUTHORISATION") === "true")
      ) {
        fetchUserPoints()
          .then((points) => {
            setPoints(points);
          })
          .catch((error) => {
            console.error("Error fetching user points:", error);
            setPoints(0);
          });
      }
    })();
    setTimeout(() => {
      setShake(false);
    }, 4000);
  }, []);

  const navigate = useNavigate();
  let newLevel = level.replace("m", "");

  const sectionStyle = {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${desktopLevel5})`,
    backgroundSize: isMobile ? "cover" : "contain", // Cover the entire viewport
    backgroundRepeat: isMobile ? "no-repeat" : "round", // Center the image
    backgroundPosition: isMobile ? "center" : "initial",
    position: "relative",
  };

  const handleRedirect = () => {
    navigate("/practice");
  };
  return true ? (
    <Box style={sectionStyle}>
      <ProfileHeader
        {...{ level: newLevel, points, wordCount, vocabCount, lang }}
      />
      <Box
        sx={
          isMobile
            ? {
                position: "absolute",
                top: "30%",
                left: "50%",
                transformOrigin: "center center",
                animation: "mobileFloat 4s ease-in-out infinite",
                "@keyframes mobileFloat": {
                  "0%": {
                    transform:
                      "translate(-50%, -50%) scale(0.58) translateY(0px) rotate(-1deg)",
                  },
                  "50%": {
                    transform:
                      "translate(-50%, -50%) scale(0.58) translateY(-12px) rotate(1deg)",
                  },
                  "100%": {
                    transform:
                      "translate(-50%, -50%) scale(0.58) translateY(0px) rotate(-1deg)",
                  },
                },
              }
            : {
                position: "absolute",
                top: 5,
                left: 0,
              }
        }
      >
        <Box sx={{ position: "relative" }} className={isMobile ? "" : "plane"}>
          <AssesmentCompletePlane />
          <Box
            sx={{
              position: "absolute",
              bottom: 129,
              left: 115,
              transform: "rotate(-5deg)",
            }}
          >
            <span
              style={{
                color: "#00B359",
                fontWeight: 700,
                fontSize: "22px",
                fontFamily: getFontFamily(lang),
                lineHeight: "32.5px",
                letterSpacing: "2%",
              }}
            >
              {newLevel === previousLevel ? ui.ALMOST_THERE : ui.HURRAY}
            </span>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 105,
              left: 40,
              transform: "rotate(-5deg)",
            }}
          >
            <span
              style={{
                color: "#183346",
                fontWeight: 700,
                fontSize: "15px",
                fontFamily: getFontFamily(lang),
                lineHeight: "30px",
              }}
            >
              {newLevel === previousLevel
                ? ui.ASSESSMENT_END_MORE_PRACTICE
                : ui.ASSESSMENT_END_LEVEL_COMPLETED.replace(
                    "{level}",
                    previousLevel || ""
                  )}
            </span>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100px",
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          zIndex: 5555,
          justifyContent: "space-between",
        }}
      >
        <Box
          ml={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Box>
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "18px",
                fontFamily: "Quicksand",
                lineHeight: "24.5px",
              }}
            >
              {`Rate your experience for Level ${previousLevel}`}
            </span>
          </Box>
          <Box display="flex" mt={1}>
            <Box>
              <GoodMood />
            </Box>
            <Box ml={3}>
              <AverageMood />
            </Box>
            <Box ml={3}>
              <BadMood />
            </Box>
          </Box> */}
        </Box>
        <Box
          mr={isMobile ? 2 : 8}
          sx={{
            display: "flex",
          }}
        >
          {/* <Box
            sx={{
              cursor: "pointer",
              background: "linear-gradient(90deg, #8585A2 0%, #39394F 85%)",
              minWidth: "60px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
            onClick={handleRedirect}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "20px",
                fontFamily: "Quicksand",
              }}
            >
              {"Home"}
            </span>
          </Box> */}
          <Box
            ml={3}
            sx={{
              cursor: "pointer",
              background:
                "linear-gradient(90deg, rgba(255,144,80,1) 0%, rgba(225,84,4,1) 85%)",
              minWidth: "100px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
            onClick={handleRedirect}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "20px",
                fontFamily: getFontFamily(lang),
              }}
            >
              {ui.COMMON_CONTINUE}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  ) : (
    <MainLayout
      showNext={true}
      showTimer={false}
      backgroundImage={homeBackground}
      enableNext={true}
      {...{
        handleNext: () => {
          navigate(`/`);
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
        mt={5}
      >
        {/* <Box sx={{ position: "absolute", top: 5, right: 80 }}>
          <Box sx={{ position: "absolute", top: "center" }}></Box>
          <span
            style={{
              color: "#FFB118",
              fontWeight: 400,
              fontSize: "30px",
              fontFamily: "'Bad Comic', sans-serif",
              lineHeight: "30px",
              marginLeft: "10px",
            }}
          >
            {"Level"}
          </span>
          <LevelRight />
        </Box> */}
        <Typography
          className="successHeader"
          sx={{
            mt: 5,
            textAlign: "center",
          }}
        >
          {newLevel === previousLevel ? ui.ALMOST_THERE : ui.HURRAY}
        </Typography>
        <Box mt={1}>
          <span
            style={{
              color: "#50507D",
              fontWeight: 600,
              fontSize: "30px",
              fontFamily: getFontFamily(lang),
              lineHeight: "37.5px",
              letterSpacing: "2%",
            }}
          >
            {newLevel === previousLevel
              ? ui.ASSESSMENT_END_MORE_PRACTICE
              : ui.ASSESSMENT_END_LEVEL_COMPLETED.replace(
                  "{level}",
                  previousLevel || ""
                )}
          </span>
        </Box>
        {/* <Box display="flex" mt={2}>
          <span
            style={{
              color: "#FFB118",
              fontWeight: 500,
              fontSize: "28px",
              fontFamily: "Quicksand",
              lineHeight: "30px",
              marginLeft: "10px",
            }}
          >
            {"You Earned"}
          </span>
          <Box ml={1}>
            <img src={coinStar} height={34} width={34} />
          </Box>
          <span
            style={{
              color: "#FFB118",
              fontWeight: 700,
              fontSize: "28px",
              fontFamily: "Quicksand",
              lineHeight: "30px",
              marginLeft: "10px",
            }}
          >
            {"46"}
          </span>
          <span
            style={{
              color: "#FFB118",
              fontWeight: 500,
              fontSize: "28px",
              fontFamily: "Quicksand",
              lineHeight: "30px",
              marginLeft: "10px",
            }}
          >
            {"Coins"}
          </span>
        </Box> */}
        <Box mt={5}>
          <span
            style={{
              color: "#5C5C84",
              fontWeight: 400,
              fontSize: "26px",
              fontFamily: getFontFamily(lang),
              lineHeight: "28.5px",
            }}
          >
            {ui.ASSESSMENT_END_RATE_EXPERIENCE.replace(
              "{level}",
              previousLevel || ""
            )}
          </span>
        </Box>
        <Box display="flex" mt={2}>
          <Box>
            <GoodMood />
          </Box>
          <Box ml={2}>
            <AverageMood />
          </Box>
          <Box ml={2}>
            <BadMood />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default AssesmentEnd;
