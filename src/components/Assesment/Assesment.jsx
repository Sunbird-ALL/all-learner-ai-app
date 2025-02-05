import MainLayout from "../Layouts.jsx/MainLayout";
import assessmentBackground from "../../assets/images/assessmentBackground.png";
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
} from "../../../node_modules/@mui/material/index";
import LogoutImg from "../../assets/images/logout.svg";
import { styled } from "@mui/material/styles";
import {
  RoundTick,
  SelectLanguageButton,
  StartAssessmentButton,
  getLocalData,
  getParameter,
  languages,
  levelConfig,
  setLocalData,
} from "../../utils/constants";
import practicebg from "../../assets/images/practice-bg.svg";
import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";
import { useEffect, useState } from "react";
import HelpLogo from "../../assets/help.png";
import CloseIcon from "@mui/icons-material/Close";

import axios from "../../../node_modules/axios/index";
// import { useDispatch } from 'react-redux';
import { setVirtualId } from "../../store/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import desktopLevel1 from "../../assets/images/desktopLevel1.png";
import desktopLevel2 from "../../assets/images/desktopLevel2.png";
import desktopLevel3 from "../../assets/images/desktopLevel3.jpg";
import desktopLevel4 from "../../assets/images/desktopLevel4.png";
import desktopLevel5 from "../../assets/images/desktopLevel5.png";
import desktopLevel6 from "../../assets/images/desktopLevel6.png";
import desktopLevel7 from "../../assets/images/desktopLevel7.png";
import desktopLevel8 from "../../assets/images/desktopLevel8.png";
import desktopLevel9 from "../../assets/images/desktopLevel9.png";
import profilePic from "../../assets/images/profile_url.png";
import textureImage from "../../assets/images/textureImage.png";
import back from "../../assets/images/back-arrow.png";
import { jwtDecode } from "jwt-decode";
import config from "../../utils/urlConstants.json";
import panda from "../../assets/images/panda.svg";
import cryPanda from "../../assets/images/cryPanda.svg";
import { uniqueId } from "../../services/utilService";
import { end } from "../../services/telementryService";
import { fetchUserPoints } from "../../services/orchestration/orchestrationService";
import { fetchVirtualId } from "../../services/userservice/userService";
import { getFetchMilestoneDetails } from "../../services/learnerAi/learnerAiService";

export const LanguageModal = ({ lang, setLang, setOpenLangModal }) => {
  const [selectedLang, setSelectedLang] = useState(lang);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: "600px",
          minHeight: "424px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${textureImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "round",
          boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
          backdropFilter: "blur(25px)",
        }}
      >
        <Box mt="32px">
          <span
            style={{
              color: "#000000",
              fontWeight: 600,
              fontSize: "36px",
              fontFamily: "Quicksand",
              lineHeight: "45px",
            }}
          >
            {`Select Language`}
          </span>
        </Box>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Grid container justifyContent={"space-evenly"} sx={{ width: "80%" }}>
            {languages.map((elem) => {
              const isSelectedLang = elem.lang === selectedLang;
              return (
                <Grid xs={5} item key={elem.lang}>
                  <Box
                    onClick={() => setSelectedLang(elem.lang)}
                    sx={{
                      cursor: "pointer",
                      mt: "34px",
                      ml: "15px",
                      me: "15px",
                      height: "140px",
                      background: isSelectedLang ? "#EE6931" : "#EFEFEF",
                      borderRadius: "10px",
                      border: `3px solid ${
                        isSelectedLang ? "#A03D13" : "#DADADA"
                      }`,
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {isSelectedLang ? (
                        <Box mt={"-2px"} mr={"15px"}>
                          <RoundTick />
                        </Box>
                      ) : (
                        <Box
                          mt={"-2px"}
                          mr={"15px"}
                          sx={{
                            height: "18px",
                            width: "18px",
                            borderRadius: "15px",
                            border: "1.5px solid #999999",
                          }}
                        ></Box>
                      )}
                    </Box>
                    <Box mt="-2px">
                      <span
                        style={{
                          color: isSelectedLang ? "#FFFFFF" : "#000000",
                          fontWeight: 600,
                          fontSize: "50px",
                          fontFamily: "Quicksand",
                          lineHeight: "62px",
                        }}
                      >
                        {elem.symbol}
                      </span>
                    </Box>
                    <Box mt={1}>
                      <span
                        style={{
                          color: isSelectedLang ? "#FFFFFF" : "#000000",
                          fontWeight: 600,
                          fontSize: "20px",
                          fontFamily: "Quicksand",
                          lineHeight: "25px",
                        }}
                      >
                        {elem.name}
                      </span>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          mt={5}
          mb={1}
          // mr="110px"
        >
          <Box
            onClick={() => {
              setLang(selectedLang);
              setOpenLangModal(false);
            }}
            sx={{
              cursor: "pointer",
              background: "#6DAF19",
              minWidth: "173px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "20px",
                fontFamily: "Quicksand",
                display: "flex",
                alignItems: "center",
              }}
            >
              {"Confirm"}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const MessageDialog = ({
  message,
  closeDialog,
  isError,
  dontShowHeader,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: "600px",
          minHeight: "424px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${textureImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "round",
          boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
          backdropFilter: "blur(25px)",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", left: 10, bottom: 0 }}>
          {isError ? (
            <img src={cryPanda} alt="cryPanda" />
          ) : (
            <img src={panda} alt="panda" />
          )}
        </Box>

        <Box mt="32px">
          {!dontShowHeader && (
            <Typography
              className={isError ? "failureHeader" : "successHeader"}
              sx={{
                mt: 3,
                textAlign: "center",
              }}
            >
              {isError ? "Oops..." : "Hurray!!!"}
            </Typography>
          )}
        </Box>

        <Box
          mt="28px"
          display={"flex"}
          flexWrap={"wrap"}
          padding={"0px 10px 0px 10px"}
          width={"80%"}
        >
          <span
            style={{
              color: "#000000",
              fontWeight: 700,
              fontSize: "40px",
              fontFamily: "Quicksand",
              lineHeight: "62px",
              textAlign: "center",
            }}
          >
            {message || ``}
          </span>
        </Box>
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          mt="60px"
          // mr="110px"
          mb={2}
        >
          <Box
            onClick={() => {
              closeDialog();
            }}
            sx={{
              cursor: "pointer",
              background: "#6DAF19",
              minWidth: "173px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "20px",
                fontFamily: "Quicksand",
              }}
            >
              {"Continue"}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const ProfileHeader = ({
  setOpenLangModal,
  lang,
  profileName,
  points = 0,
  handleBack,
}) => {
  const language = lang || getLocalData("lang");
  const username = profileName || getLocalData("profileName");
  const navigate = useNavigate();
  const [openMessageDialog, setOpenMessageDialog] = useState("");

  const handleProfileBack = () => {
    try {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        window.parent.postMessage({ type: "restore-iframe-content" }, "*");
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    end({});
    navigate("/login");
  };

  const CustomIconButton = styled(IconButton)({
    padding: "6px 20px",
    color: "white",
    fontSize: "20px",
    fontWeight: 500,
    borderRadius: "8px",
    marginRight: "10px",
    fontFamily: '"Lato", "sans-serif"',
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& .logout-img": {
      display: "block",
      filter: "invert(1)",
    },
  });

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .MuiTooltip-tooltip`]: {
      fontSize: "1.2rem", // Adjust the font size as needed
    },
  });

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: { xs: "60px", sm: "70px" },
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(3px)",
          display: "flex",
          alignItems: "center",
          zIndex: 5555,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", sm: "50%" },
          }}
        >
          {handleBack && (
            <Box ml={{ xs: "10px", sm: "94px" }}>
              <IconButton onClick={handleBack}>
                <img src={back} alt="back" style={{ height: "30px" }} />
              </IconButton>
            </Box>
          )}
          {username && (
            <>
              <Box
                ml={
                  handleBack
                    ? { xs: "10px", sm: "12px" }
                    : { xs: "10px", sm: "94px" }
                }
                sx={{ cursor: "pointer" }}
                onClick={handleProfileBack}
              >
                <img
                  src={profilePic}
                  alt="profile-pic"
                  style={{ height: "30px" }}
                />
              </Box>
              <Box ml="12px">
                <span
                  style={{
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: { xs: "14px", sm: "16px" },
                    fontFamily: "Quicksand",
                    lineHeight: "25px",
                  }}
                >
                  {username || ""}
                </span>
              </Box>
            </>
          )}
        </Box>

        <Box
          sx={{
            justifySelf: "flex-end",
            width: { xs: "100%", sm: "50%" },
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
            alignItems: "center",
          }}
        >
          {/* <Box sx={{ position: "relative" }} mr="10px">
            <img
              src={scoreView}
              alt="scoreView"
              width={"86px"}
              height={"35px"}
            />
            <Box sx={{ position: "absolute", top: "6px", right: "16px" }}>
              <span
                style={{
                  color: "#FFDD39",
                  fontWeight: 700,
                  fontSize: "18px",
                  fontFamily: "Quicksand",
                }}
              >
                {points}
              </span>
            </Box>
          </Box> */}

          <Box
            mr={{ xs: "10px", sm: "90px" }}
            onClick={() =>
              setOpenLangModal
                ? setOpenLangModal(true)
                : setOpenMessageDialog({
                    message: "go to homescreen to change language",
                    dontShowHeader: true,
                  })
            }
          >
            <Box sx={{ position: "relative", cursor: "pointer" }}>
              <SelectLanguageButton />
              <Box sx={{ position: "absolute", top: 9, left: 20 }}>
                <span
                  style={{
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: { xs: "14px", sm: "16px" },
                    fontFamily: "Quicksand",
                    lineHeight: "25px",
                  }}
                >
                  {languages?.find((elem) => elem.lang === language)?.name ||
                    "Select Language"}
                </span>
              </Box>
            </Box>
          </Box>
          {process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true" && (
            <CustomTooltip title="Logout">
              <Box>
                <CustomIconButton onClick={handleLogout}>
                  <img
                    className="logout-img"
                    style={{ height: 30, width: 35 }}
                    src={LogoutImg}
                    alt="Logout"
                  />
                </CustomIconButton>
              </Box>
            </CustomTooltip>
          )}
        </Box>
      </Box>
    </>
  );
};

const Assesment = ({ discoverStart }) => {
  let username;
  if (localStorage.getItem("token") !== null) {
    let jwtToken = localStorage.getItem("token");
    var userDetails = jwtDecode(jwtToken);
    username = userDetails.student_name;
    setLocalData("profileName", username);
  }
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [profileName, setProfileName] = useState(username);
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  // let lang = searchParams.get("lang") || "ta";
  const [level, setLevel] = useState("");
  const dispatch = useDispatch();
  const [openLangModal, setOpenLangModal] = useState(false);
  const [lang, setLang] = useState(getLocalData("lang") || "en");
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // const level = getLocalData('userLevel');
    // setLevel(level);
    setLocalData("lang", lang);
    dispatch(setVirtualId(localStorage.getItem("virtualId")));
    let contentSessionId = localStorage.getItem("contentSessionId");
    localStorage.setItem("sessionId", contentSessionId);
    const TOKEN = localStorage.getItem("apiToken");
    let virtualId;
    if (TOKEN) {
      const tokenDetails = jwtDecode(TOKEN);
      virtualId = tokenDetails?.virtual_id;
    }

    if (discoverStart && username && !virtualId) {
      (async () => {
        setLocalData("profileName", username);
        const usernameDetails = await fetchVirtualId(username);
        const getMilestoneDetails = await getFetchMilestoneDetails(lang);

        localStorage.setItem(
          "getMilestone",
          JSON.stringify({ ...getMilestoneDetails })
        );
        setLevel(getMilestoneDetails?.data?.milestone_level?.replace("m", ""));
        let session_id = localStorage.getItem("sessionId");

        if (!session_id) {
          session_id = uniqueId();
          localStorage.setItem("sessionId", session_id);
        }

        localStorage.setItem("lang", lang || "ta");
        if (
          process.env.REACT_APP_IS_APP_IFRAME !== "true" &&
          localStorage.getItem("contentSessionId") !== null
        ) {
          fetchUserPoints().then((points) => {
            setPoints(points);
          });
        }

        dispatch(setVirtualId(virtualId));
      })();
    } else {
      (async () => {
        const language = lang;
        const getMilestoneDetails = await getFetchMilestoneDetails(language);
        localStorage.setItem(
          "getMilestone",
          JSON.stringify({ ...getMilestoneDetails })
        );
        setLevel(
          Number(getMilestoneDetails?.data?.milestone_level?.replace("m", ""))
        );
        let sessionId = getLocalData("sessionId");

        if (!sessionId || sessionId === "null") {
          sessionId = uniqueId();
          localStorage.setItem("sessionId", sessionId);
        }

        if (
          process.env.REACT_APP_IS_APP_IFRAME !== "true" &&
          virtualId &&
          localStorage.getItem("contentSessionId") !== null
        ) {
          fetchUserPoints().then((points) => {
            setPoints(points);
          });
        }
      })();
    }
  }, [lang]);

  const TOKEN = localStorage.getItem("apiToken");
  let virtualId;
  if (TOKEN) {
    const tokenDetails = jwtDecode(TOKEN);
    virtualId = JSON.stringify(tokenDetails?.virtual_id);
  }

  const handleOpenVideo = () => {
    if (process.env.REACT_APP_SHOW_HELP_VIDEO === "true") {
      let allowedOrigins = [];
      try {
        allowedOrigins = JSON.parse(
          process.env.REACT_APP_PARENT_ORIGIN_URL || "[]"
        );
      } catch (error) {
        console.error(
          "Invalid JSON format in REACT_APP_PARENT_ORIGIN_URL:",
          error
        );
      }

      const parentOrigin =
        window?.location?.ancestorOrigins?.[0] || window.parent.location.origin;

      if (allowedOrigins.includes(parentOrigin)) {
        try {
          window.parent.postMessage(
            {
              message: "help-video-link",
            },
            parentOrigin
          );
        } catch (error) {
          console.error("Error sending postMessage:", error);
        }
      } else {
        console.warn(`Parent origin "${parentOrigin}" is not allowed.`);
      }
    }
  };

  const navigate = useNavigate();
  const handleRedirect = () => {
    const profileName = getLocalData("profileName");
    if (!username && !profileName && !virtualId && level === 0) {
      // alert("please add username in query param");
      setOpenMessageDialog({
        message: "please add username in query param",
        isError: true,
      });
      return;
    }
    if (level === 0) {
      navigate("/discover");
    } else {
      navigate("/practice");
    }
  };

  const images = {
    desktopLevel1,
    desktopLevel2,
    desktopLevel3,
    desktopLevel4,
    desktopLevel5,
    desktopLevel6,
    desktopLevel7,
    desktopLevel8,
    desktopLevel9,
  };

  const sectionStyle = {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${images?.[`desktopLevel${level || 1}`]})`,
    backgroundRepeat: "round",
    backgroundSize: "auto",
    position: "relative",
  };

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      {openLangModal && (
        <LanguageModal {...{ lang, setLang, setOpenLangModal }} />
      )}
      {level > 0 ? (
        <Box style={sectionStyle}>
          <ProfileHeader
            {...{ level, lang, setOpenLangModal, points, setOpenMessageDialog }}
          />
          <Box>
            {process.env.REACT_APP_SHOW_HELP_VIDEO === "true" && (
              <Box
                onClick={handleOpenVideo}
                sx={{
                  position: "absolute",
                  bottom: 40,
                  right: 80,
                  width: "237px",
                  height: "112px",
                  cursor: "pointer",
                }}
              >
                <img src={HelpLogo} alt="help_video_link" />
              </Box>
            )}
            <Box
              sx={{
                position: "absolute",
                bottom: 60,
                right: 0,
                width: "237px",
                height: "112px",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "20px 0px 0px 20px",
                backdropFilter: "blur(3px)",
              }}
            >
              <Box
                sx={{
                  width: "165px",
                  height: "64px",
                  background: levelConfig[level].color,
                  borderRadius: "10px",
                  margin: "24px 48px 24px 24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  boxShadow: `3px 3px 10px ${levelConfig[level].color}80`,
                }}
                onClick={handleRedirect}
              >
                <span
                  style={{
                    color: "#F0EEEE",
                    fontWeight: 600,
                    fontSize: "20px",
                    fontFamily: "Quicksand",
                    lineHeight: "25px",
                    textShadow: "#000 1px 0 10px",
                  }}
                >
                  {`Start Level ${level}`}
                </span>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <MainLayout
          showNext={false}
          showTimer={false}
          cardBackground={assessmentBackground}
          backgroundImage={practicebg}
          {...{
            setOpenLangModal,
            lang,
            points,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              right: { xs: 20, md: 200 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: { xs: 2, md: 5 },
            }}
          >
            <Typography
              sx={{
                color: "#322020",
                fontWeight: 700,
                fontSize: { xs: "24px", md: "40px" },
                fontFamily: "Quicksand",
                lineHeight: { xs: "36px", md: "62px" },
                textAlign: "center",
              }}
              fontSize={{ md: "40px", xs: "30px" }}
            >
              {discoverStart
                ? "Let's test your language skills"
                : "You have good language skills"}
            </Typography>
            <Box>
              <Typography
                sx={{
                  color: "#1CB0F6",
                  fontWeight: 600,
                  fontSize: { xs: "20px", md: "30px" },
                  fontFamily: "Quicksand",
                  lineHeight: { xs: "30px", md: "50px" },
                  textAlign: "center",
                }}
                fontSize={{ md: "30px", xs: "20px" }}
              >
                {level > 0
                  ? `Take the assessment to complete Level ${level}.`
                  : "Take the assessment to discover your level"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {process.env.REACT_APP_SHOW_HELP_VIDEO === "true" && (
                <Box
                  onClick={handleOpenVideo}
                  sx={{
                    mt: { xs: 1, md: 1 },
                    mr: { xs: 2, md: 2 },
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <img src={HelpLogo} alt="help_video_link" />
                </Box>
              )}
              <Box
                sx={{
                  cursor: "pointer",
                  mt: { xs: 1, md: 2 },
                  zIndex: 9999,
                }}
                onClick={handleRedirect}
              >
                <StartAssessmentButton />
              </Box>
            </Box>
          </Box>
        </MainLayout>
      )}
    </>
  );
};

export default Assesment;
