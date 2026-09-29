import {
  Box,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";
import LevelCompleteAudio from "../../assets/audio/levelComplete.wav";
import discoverEndLeft from "../../assets/images/discover-end-left.svg";
import discoverEndRight from "../../assets/images/discover-end-right.svg";
import textureImage from "../../assets/images/textureImage.png";
import { getLocalData, setLocalData } from "../../utils/constants";
import { getUiStrings } from "../../constants/strings";
import { LetsStart } from "../Icons/SvgIcons";
import usePreloadAudio from "../../hooks/usePreloadAudio";
import { getFetchMilestoneDetails } from "../../services/learnerAi/learnerAiService";
import { Log, audit as telemetryAudit } from "../../services/telemetryService";

const sectionStyle = {
  backgroundImage: `url(${textureImage})`,
  backgroundSize: "cover", // Cover the entire viewport
  backgroundPosition: "center center", // Center the image
  width: "85vw",
  height: "80vh",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
  backdropFilter: "blur(25px)",
  position: "relative",
};

const SpeakSentenceComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [shake, setShake] = useState(true);
  const [level, setLevel] = useState("");
  const lang = getLocalData("lang");
  const ui = getUiStrings(lang || "en");
  const levelCompleteAudioSrc = usePreloadAudio(LevelCompleteAudio);
  // Guard: fire telemetry only once even if effect re-runs
  const telemetryFiredRef = useRef(false);

  useEffect(() => {
    (async () => {
      if (levelCompleteAudioSrc) {
        let audio = new Audio(levelCompleteAudioSrc);
        audio.play();
      }
      const lang = getLocalData("lang");
      try {
        const getMilestoneDetails = await getFetchMilestoneDetails(lang);
        const { data } = getMilestoneDetails;
        setLevel(data.milestone_level);
        setLocalData("userLevel", data.milestone_level?.replace("m", ""));

        // Fire telemetry once — discovery placement result
        if (!telemetryFiredRef.current && data.milestone_level) {
          telemetryFiredRef.current = true;
          const newLevel = data.milestone_level;
          // AUDIT: state change from "unplaced" → placed level
          telemetryAudit({
            props: ["milestoneLevel"],
            state: newLevel,
            prevstate: "unplaced",
            objectId: localStorage.getItem("apiToken") || "",
            objectType: "Learner",
          });
          // LOG: placement detail for dashboard filter
          Log(
            {
              type: "discovery_placement",
              level: "INFO",
              message: "discovery_complete",
              params: [
                { placedLevel: newLevel },
                { language: lang || "" },
                { ts: Date.now() },
              ],
            },
            "discover-end",
            "ET"
          );
          // Keep milestone in sync for subsequent cdata
          localStorage.setItem("milestone", newLevel);
        }
      } catch (error) {
        console.error(
          "Error fetching milestone details on DiscoverEnd:",
          error
        );
        // Fall back to the locally cached value so the screen still renders
        const cachedLevel = getLocalData("userLevel");
        if (cachedLevel) setLevel(`m${cachedLevel}`);
      }
    })();
    setTimeout(() => {
      setShake(false);
    }, 4000);
  }, [levelCompleteAudioSrc]);

  const handleProfileBack = () => {
    try {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  let width = window.innerWidth * 0.85;
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: "linear-gradient(45deg, #5FDF9A 30%, #35C57C 90%)",
        minHeight: "100vh",
        // padding: "20px 100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Card sx={sectionStyle}>
        <Box
          sx={{
            position: "absolute",
            left: "3px",
            bottom: "0px",
            pointerEvents: "none",
          }}
        >
          <img
            src={discoverEndLeft}
            alt="timer"
            className={shake && "shakeImage"}
            style={{
              width: isMobile ? "100px" : "auto",
              height: "auto",
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            right: "3px",
            bottom: isMobile ? "auto" : "0px",
            top: isMobile ? "0px" : "auto",
            pointerEvents: "none",
          }}
        >
          <img
            src={discoverEndRight}
            alt="timer"
            className={shake && "shakeImage"}
            style={{
              width: isMobile ? "100px" : "auto",
              height: "auto",
            }}
          />
        </Box>
        <Box sx={{ pointerEvents: "none" }}>
          {/* {!shake && <img src={discoverEndTop} alt="timer" className={shake && 'shakeImage'} />} */}
          {shake && <Confetti width={width} height={"600px"} />}
        </Box>
        <CardContent>
          <Typography
            className="successHeader"
            sx={{
              mb: 4,
              mt: 5,
              textAlign: "center",
              fontSize: isMobile ? "40px" : "64px",
            }}
          >
            {ui.HURRAY}
          </Typography>
          <Typography
            variant="h4"
            component="p"
            sx={{
              mb: 4,
              color: "#50507D",
              textAlign: "center",
              fontSize: isMobile ? "18px" : "26px",
              width: isMobile ? "85%" : "70%",
              margin: "0 auto",
              fontWeight: 600,
              fontFamily: "Quicksand",
              letterSpacing: "0.56px",
            }}
          >
            {ui.DISCOVER_END_GOOD_SKILLS_MESSAGE.replace(
              "{level}",
              level.replace("m", "")
            )}
            <br /> <br />
          </Typography>

          <Box
            onClick={handleProfileBack}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: isMobile ? "80%" : "280px",
              margin: "0 auto",
              cursor: "pointer",
              zIndex: "99999",
            }}
          >
            <LetsStart />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SpeakSentenceComponent;
