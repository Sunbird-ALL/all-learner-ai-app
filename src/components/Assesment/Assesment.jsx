import MainLayout from "../Layouts.jsx/MainLayout";
import assessmentBackground from "../../assets/images/assessmentBackground.png";
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  isMuiElement,
  createTheme,
} from "../../../node_modules/@mui/material/index";
import { useMediaQuery, useTheme } from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HelpLogo from "../../assets/help.png";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
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
import desktopLevel10 from "../../assets/images/desktopLevel10.png";
import desktopLevel11 from "../../assets/images/desktopLevel11.png";
import desktopLevel12 from "../../assets/images/desktopLevel12.png";
import desktopLevel13 from "../../assets/images/desktopLevel13.png";
import desktopLevel14 from "../../assets/images/desktopLevel14.png";
import desktopLevel15 from "../../assets/images/desktopLevel15.png";
import rOneImage from "../../assets/R1Back.png";
import rTwoImage from "../../assets/R2Back.png";
import rThreeImage from "../../assets/R3Back.png";
import rFourImage from "../../assets/R4Back.png";
import Image from "../../assets/images/DeskTopR1Image.png";
import profilePic from "../../assets/images/profile_url.png";
import textureImage from "../../assets/images/textureImage.png";
import back from "../../assets/images/back-arrow.png";
import { jwtDecode } from "jwt-decode";
import panda from "../../assets/images/panda.svg";
import cryPanda from "../../assets/images/cryPanda.svg";
import { uniqueId } from "../../services/utilService";
import ProgressOverlay from "../CommonComponent/ProgressOverlay";
import { end } from "../../services/telementryService";
import { levelMapping } from "../../utils/levelData";
import scoreView from "../../assets/images/scoreView.svg";
import { fetchUserPoints } from "../../services/orchestration/orchestrationService";
import { fetchVirtualId } from "../../services/userservice/userService";
import { getFetchMilestoneDetails } from "../../services/learnerAi/learnerAiService";
import * as Assets from "../../utils/imageAudioLinks";

const theme = createTheme();
import { offlineModelsInfo } from "../../utils/constants";
import ModelLoaderIndicator from "../ModelLoaderIndicator";

export const LanguageModal = ({
  lang,
  setLang,
  setOpenLangModal,
  setLoading,
  setDownloadProgress,
}) => {
  const [selectedLang, setSelectedLang] = useState(lang);
  const [isOfflineModel, setIsOfflineModel] = useState(
    localStorage.getItem("isOfflineModel") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isOfflineModel", isOfflineModel);
  }, [isOfflineModel]);

  // const dbName = "language-ai-models";
  // const dbVersion = 1;
  // let db;

  // // Open IndexedDB
  // const openDB = () => {
  //   return new Promise((resolve, reject) => {
  //     const request = window.indexedDB.open(dbName, dbVersion);
  //     request.onerror = (event) => {
  //       console.error("IndexedDB error:", event.target.errorCode);
  //       reject(event.target.error);
  //     };
  //     request.onsuccess = (event) => {
  //       db = event.target.result;
  //       console.log("IndexedDB opened successfully");
  //       resolve();
  //     };
  //     request.onupgradeneeded = (event) => {
  //       db = event.target.result;
  //       console.log("Creating object store for models");
  //       if (!db.objectStoreNames.contains("models")) {
  //         db.createObjectStore("models");
  //       }
  //     };
  //   });
  // };

  // // Function to store model in IndexedDB
  // const storeModel = async (modelName, modelURL, isVocabModel) => {
  //   try {
  //     console.log(modelURL);
  //     const response = await fetch(modelURL);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     let modelData

  //     if(!isVocabModel){

  //     const reader = response.body.getReader();
  //     const contentLength = +response.headers.get("Content-Length");
  //     let receivedLength = 0;
  //     const chunks = [];

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;
  //       chunks.push(value);
  //       receivedLength += value.length;

  //       // Update progress
  //       const percentage = (receivedLength / contentLength) * 100;
  //       setDownloadProgress(percentage.toFixed());
  //     }

  //      modelData = new Uint8Array(receivedLength);

  //      let position = 0;
  //      for (let chunk of chunks) {
  //        modelData.set(chunk, position);
  //        position += chunk.length;
  //      }

  //     }else{
  //       console.log(response);
  //       const vocabData = await response.arrayBuffer();
  //       const decoder = new TextDecoder("utf-8");
  //       modelData = decoder.decode(vocabData).split("\n");
  //     }

  //     const transaction = db.transaction(["models"], "readwrite");
  //     const store = transaction.objectStore("models");

  //     store.put(modelData, modelName);
  //     console.log(`Stored model ${modelName} in IndexedDB`);
  //   } catch (error) {
  //     console.error("Error storing model in IndexedDB:", error);
  //   }
  // };

  // // Function to check if the model is already stored in IndexedDB
  // const isModelStored = (modelName) => {
  //   return new Promise((resolve, reject) => {
  //     const transaction = db.transaction(["models"], "readonly");
  //     const store = transaction.objectStore("models");
  //     const request = store.get(modelName);

  //     request.onerror = function (event) {
  //       console.error(
  //         "Error checking model in IndexedDB:",
  //         event.target.errorCode
  //       );
  //       reject(event.target.error);
  //     };

  //     request.onsuccess = function (event) {
  //       resolve(!!event.target.result);
  //     };
  //   });
  // };

  // // Function to load model
  // const loadModel = async (selectedLang) => {
  //   setLoading(true);
  //   try {
  //     await openDB();
  //     let modelName = "";
  //     let modelURL = "";
  //     let vacabFileName = "";
  //     let vocabURL = "";

  //     offlineModelsInfo.map((modelInfoElement) => {
  //       if (modelInfoElement.lang === selectedLang) {
  //         modelName = modelInfoElement.modelName;
  //         modelURL = modelInfoElement.modelURL;
  //         vocabURL = modelInfoElement?.vocabUrl;
  //         vacabFileName = modelInfoElement?.vacabFileName;
  //       }
  //     });

  //     const stored = await isModelStored(modelName);

  //     if(vocabURL){
  //       const vocabStored = await isModelStored(vacabFileName);
  //       if (!stored) {
  //         await storeModel(vacabFileName, vocabURL, true);
  //       } else {
  //         console.log(`Model ${vacabFileName} is already stored in IndexedDB`);
  //         return;
  //       }
  //     }

  //     if (!stored) {
  //       await storeModel(modelName, modelURL,false);
  //     } else {
  //       console.log(`Model ${modelName} is already stored in IndexedDB`);
  //       return;
  //     }

  //   } catch (error) {
  //     console.log(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          width: "600px",
          //minHeight: "424px",
          maxHeight: "90vh",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${textureImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "round",
          boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
          backdropFilter: "blur(25px)",
          overflowY: "auto",
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
            {languages?.map((elem, index) => {
              const isSelectedLang =
                isOfflineModel === elem.offline && elem.lang === selectedLang;
              return (
                <Grid xs={3} item key={elem.lang}>
                  <Box
                    onClick={() => {
                      setSelectedLang(elem.lang);
                      setIsOfflineModel(elem.offline);
                    }}
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
            onClick={async () => {
              setLang(selectedLang);
              setOpenLangModal(false);
              if (isOfflineModel && selectedLang !== "en") {
                loadModel(selectedLang);
              } else {
                await window.sherpaModule.loadModel();
              }
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        <Box
          sx={{
            position: "absolute",
            left: 10,
            bottom: 0,
            pointerEvents: "none",
          }}
        >
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
              fontSize: isMobile ? " 20px" : "40px",
              fontFamily: "Quicksand",
              lineHeight: isMobile ? "35px" : "62px",
              textAlign: "center",
            }}
          >
            {message || ``}
          </span>
        </Box>
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          mt={isMobile ? "15px" : "60px"}
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
              zIndex: "9999",
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: isMobile ? "16px" : "20px",
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
  loading,
  handleBack,
}) => {
  const language = lang || getLocalData("lang");
  const username = profileName || getLocalData("profileName");
  const navigate = useNavigate();
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleProfileBack = () => {
    try {
      if (import.meta.env.VITE_IS_APP_IFRAME === "true") {
        window.parent.postMessage(
          { type: "restore-iframe-content" },
          window?.location?.ancestorOrigins?.[0] ||
            window.parent.location.origin
        );
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const isOfflineModel = localStorage.getItem("isOfflineModel") === "true";

  const selectedLanguage = languages?.find(
    (elem) => elem.lang === language && elem.offline === isOfflineModel
  );

  const displayLanguage = selectedLanguage?.name || "Select Language";

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    end({});
    window.location.href = "/login";
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
          height: { xs: "60px", sm: "50px" },
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
          {import.meta.env.VITE_IS_IN_APP_AUTHORISATION === "true" && (
            <Box sx={{ position: "relative" }} mr="10px">
              <img
                src={scoreView}
                alt="scoreView"
                width={isMobile ? "47px" : "86px"}
                height={isMobile ? "25px" : "35px"}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: isMobile ? "40%" : "50%",
                  left: isMobile ? "68%" : "70%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  style={{
                    color: "#FFDD39",
                    fontWeight: 700,
                    fontSize: isMobile ? "11px" : "18px",
                    fontFamily: "Quicksand",
                  }}
                >
                  {points}
                </span>
              </Box>
            </Box>
          )}
        </Box>
        {/* <Box><ModelLoaderIndicator /></Box> */}
        <Box
          sx={{
            justifySelf: "flex-start",
            width: { xs: "100%", sm: "40%" },
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
            alignItems: "center",
          }}
        >
          {isOfflineModel && <ModelLoaderIndicator />}
        </Box>
        <Box
          mr={{ xs: "10px", sm: "40px" }}
          onClick={() =>
            setOpenLangModal
              ? setOpenLangModal(!loading)
              : setOpenMessageDialog({
                  message: "go to homescreen to change language",
                  dontShowHeader: true,
                })
          }
        >
          <Box sx={{ position: "relative", cursor: "pointer" }}>
            <SelectLanguageButton width={isMobile ? 80 : 180} />
            <Box
              sx={{ position: "absolute", top: 9, left: isMobile ? 10 : 20 }}
            >
              <span
                style={{
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: isMobile ? "10px" : "16px",
                  fontFamily: "Quicksand",
                  lineHeight: "25px",
                }}
              >
                {isMobile
                  ? "Language"
                  : languages?.find((elem) => elem.lang === language)?.name ||
                    "Select Language"}
              </span>
            </Box>
          </Box>
        </Box>
        {import.meta.env.VITE_IS_IN_APP_AUTHORISATION === "true" && (
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
    </>
  );
};

const Assesment = ({ discoverStart }) => {
  let username;
  if (localStorage.getItem("token") !== null) {
    let jwtToken = localStorage.getItem("token");
    //var userDetails = jwtDecode(jwtToken);
    //username = userDetails.student_name;
    //setLocalData("profileName", username);
  }
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [profileName, setProfileName] = useState(username);
  const [loading, setLoading] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  // let lang = searchParams.get("lang") || "ta";
  const [level, setLevel] = useState("");
  const dispatch = useDispatch();
  const [openLangModal, setOpenLangModal] = useState(false);
  const [lang, setLang] = useState(getLocalData("lang") || "en");
  const [points, setPoints] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    setLocalData("lang", lang);
    let contentSessionId = localStorage.getItem("contentSessionId");
    setLocalData("sessionId", contentSessionId);

    if (discoverStart && username && !TOKEN) {
      (async () => {
        setLocalData("profileName", username);
        const usernameDetails = await fetchVirtualId(username);
        const getMilestoneDetails = await getFetchMilestoneDetails(lang);

        setLocalData(
          "getMilestone",
          JSON.stringify({ ...getMilestoneDetails })
        );

        if (
          levelMapping[usernameDetails?.data?.result?.virtualID] !== undefined
        ) {
          setLevel(levelMapping[usernameDetails?.data?.result?.virtualID]);
        } else {
          const token = getLocalData("token");
          if (token) {
            try {
              const decoded = jwtDecode(token);
              const emisUsername = String(decoded.emis_username);

              if (levelMapping[emisUsername] !== undefined) {
                setLevel(levelMapping[emisUsername]);
              }
            } catch (error) {
              console.error("Error decoding JWT token:", error);
            }
          }
        }

        console.log("Assigned LEVEL:", level);

        localStorage.setItem(
          "virtualId",
          usernameDetails?.data?.result?.virtualID
        );
        //let session_id = localStorage.getItem("sessionId");
        setLevel(getMilestoneDetails?.data?.milestone_level?.replace("m", ""));
        let session_id = getLocalData("sessionId");

        if (!session_id) {
          session_id = uniqueId();
          setLocalData("sessionId", session_id);
        }

        setLocalData("lang", lang || "ta");
        if (
          import.meta.env.VITE_IS_APP_IFRAME !== "true" &&
          localStorage.getItem("contentSessionId") !== null
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

        // dispatch(setVirtualId(virtualId));
      })();
    } else {
      (async () => {
        const language = lang;
        const getMilestoneDetails = await getFetchMilestoneDetails(language);
        setLocalData(
          "getMilestone",
          JSON.stringify({ ...getMilestoneDetails })
        );
        setLevel(
          Number(getMilestoneDetails?.data?.milestone_level?.replace("m", ""))
        );

        if (levelMapping[virtualId] !== undefined) {
          setLevel(levelMapping[virtualId]);
        } else {
          const token = getLocalData("token");
          if (token) {
            try {
              const decoded = jwtDecode(token);
              const emisUsername = String(decoded.emis_username);

              if (levelMapping[emisUsername] !== undefined) {
                setLevel(levelMapping[emisUsername]);
              }
            } catch (error) {
              console.error("Error decoding JWT token:", error);
            }
          }
        }

        console.log("Assigned LEVEL:", level);

        let sessionId = getLocalData("sessionId");

        if (!sessionId || sessionId === "null") {
          sessionId = localStorage.getItem("contentSessionId") || uniqueId();
          setLocalData("sessionId", sessionId);
        }

        if (
          import.meta.env.VITE_IS_APP_IFRAME !== "true" &&
          TOKEN &&
          localStorage.getItem("contentSessionId") !== null
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
    }
  }, [lang]);

  const TOKEN = localStorage.getItem("token");
  let virtualId;
  // if (TOKEN) {
  //   const tokenDetails = jwtDecode(TOKEN);
  //   virtualId = JSON.stringify(tokenDetails?.virtual_id);
  // }

  const handleOpenVideo = () => {
    if (import.meta.env.VITE_SHOW_HELP_VIDEO === "true") {
      let allowedOrigins = [];
      try {
        allowedOrigins = JSON.parse(
          import.meta.env.VITE_PARENT_ORIGIN_URL || "[]"
        );
      } catch (error) {
        console.error("Invalid JSON format in VITE_PARENT_ORIGIN_URL:", error);
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

  const dbName = "language-ai-models";
  const dbVersion = 1;
  let db;

  // Function to check if the model is already stored in IndexedDB
  const isModelStored = async (modelName) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["models"], "readonly");
      const store = transaction.objectStore("models");
      const request = store.get(modelName);

      request.onerror = function (event) {
        console.error(
          "Error checking model in IndexedDB:",
          event.target.errorCode
        );
        reject(event.target.error);
      };

      request.onsuccess = function (event) {
        resolve(!!event.target.result);
      };
    });
  };

  const loadModelIndic = async (modelName) => {
    try {
      let transaction;
      let store;
      let request;
      try {
        transaction = await db.transaction(["models"], "readonly");
        store = transaction.objectStore("models");
        request = await store.get(modelName);
      } catch (error) {
        console.error("Error accessing IndexedDB:", error);
        return;
      }

      request.onsuccess = async () => {
        const modelData = request.result;
        if (window.offlineSession === undefined) {
          window.offlineSession = await window.ort.InferenceSession.create(
            modelData
          );
          console.log(window.offlineSession);
        }
      };

      request.onerror = (err) => {
        console.error(`Error to get model data: ${err}`);
      };

      console.log(`Created model session`);
    } catch (error) {
      console.error("Error storing model in IndexedDB:", error);
    }
  };

  const loadVocabIndic = async (vocabFileName) => {
    try {
      let transaction;
      let store;
      let request;
      try {
        transaction = await db.transaction(["models"], "readonly");
        store = transaction.objectStore("models");
        request = await store.get(vocabFileName);
      } catch (error) {
        console.error("Error accessing IndexedDB:", error);
        return;
      }

      request.onsuccess = async () => {
        window.offlineVocab = request.result;
      };

      request.onerror = (err) => {
        console.error(`Error to get model data: ${err}`);
      };

      console.log(`Created model session`);
    } catch (error) {
      console.error("Error storing model in IndexedDB:", error);
    }
  };

  // Function to store model in IndexedDB
  const storeModel = async (modelName, modelURL, isVocabModel) => {
    try {
      console.log(modelURL);
      const response = await fetch(modelURL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let modelData;

      if (!isVocabModel) {
        const reader = response.body.getReader();
        const contentLength = +response.headers.get("Content-Length");
        let receivedLength = 0;
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;

          // Update progress
          const percentage = (receivedLength / contentLength) * 100;
          setDownloadProgress(percentage.toFixed());
        }

        modelData = new Uint8Array(receivedLength);

        let position = 0;
        for (let chunk of chunks) {
          modelData.set(chunk, position);
          position += chunk.length;
        }
      } else {
        console.log(response);
        const vocabData = await response.arrayBuffer();
        const decoder = new TextDecoder("utf-8");
        modelData = decoder.decode(vocabData).split("\n");
      }

      const transaction = db.transaction(["models"], "readwrite");
      const store = transaction.objectStore("models");

      store.put(modelData, modelName);
      console.log(`Stored model ${modelName} in IndexedDB`);
    } catch (error) {
      console.error("Error storing model in IndexedDB:", error);
    }
  };

  // Function to load model
  const loadModel = async (lang) => {
    setLoading(true);
    try {
      await openDB();
      let modelName = "";
      let modelURL = "";
      let vacabFileName = "";
      let vocabURL = "";

      offlineModelsInfo.map((modelInfoElement) => {
        if (modelInfoElement.lang === lang) {
          modelName = modelInfoElement.modelName;
          modelURL = modelInfoElement.modelURL;
          vocabURL = modelInfoElement?.vocabUrl;
          vacabFileName = modelInfoElement?.vacabFileName;
        }
      });

      const stored = await isModelStored(modelName);

      if (!stored) {
        await storeModel(modelName, modelURL, false);
      } else {
        window.dispatchEvent(new Event("modelLoaded"));
        console.log(`Model ${modelName} is already stored in IndexedDB`);
        return;
      }

      if (vocabURL) {
        const vocabStored = await isModelStored(vacabFileName);
        if (!stored) {
          await storeModel(vacabFileName, vocabURL, true);
        } else {
          console.log(`Model ${vacabFileName} is already stored in IndexedDB`);
          return;
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open IndexedDB

  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, dbVersion);
      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.errorCode);
        reject(event.target.error);
      };
      request.onsuccess = (event) => {
        db = event.target.result;
        console.log("IndexedDB opened successfully");
        resolve();
      };
      request.onupgradeneeded = (event) => {
        db = event.target.result;
        console.log("Creating object store for models");
        if (!db.objectStoreNames.contains("models")) {
          db.createObjectStore("models");
        }
      };
    });
  };

  const handleRedirect = async (lang) => {
    const profileName = getLocalData("profileName");
    if (!username && !profileName && !TOKEN && level === 0) {
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
    if (localStorage.getItem("isOfflineModel") === "true") {
      let modelName = "";
      let vacabFileName = "";

      offlineModelsInfo.map((modelInfoElement) => {
        if (modelInfoElement.lang === lang) {
          modelName = modelInfoElement.modelName;
          vacabFileName = modelInfoElement?.vacabFileName;
        }
      });

      await openDB();
      const stored = await isModelStored(modelName);
      if (stored) {
        window.dispatchEvent(new Event("modelLoaded"));
        console.log(`Model ${modelName} is already stored in IndexedDB`);
      } else {
        alert(`you have to download en-offline model`);
        if (lang != "en") {
          await loadModel(lang);
        } else {
          window.sherpaModule.loadModel();
        }
        return;
      }
      if (lang !== "en") {
        await loadModelIndic(modelName);
        await loadVocabIndic(vacabFileName);
      } else {
        if (!window.sherpaRecognizer) {
          await window.sherpaModule.loadModel();
          await fileExists("transducer-encoder.onnx");
          let config = {
            modelConfig: {
              debug: 1,
              tokens: "./tokens.txt",
            },
          };
          config.modelConfig.transducer = {
            encoder: "./transducer-encoder.onnx",
            decoder: "./transducer-decoder.onnx",
            joiner: "./transducer-joiner.onnx",
          };
          config.modelConfig.modelType = "transducer";
          let recognizer = new window.OfflineRecognizer(
            config,
            window.sherpaModule
          );
          window.sherpaRecognizer = recognizer;
          console.log("recognizer is created!", recognizer);

          if (import.meta.env.VITE_APP_SHERPA_VAD_ENABLED === "true") {
            let vad = window.createVad(window.sherpaModule);
            window.vad = vad;
            console.log("vad is created!", vad);

            let buffer = new CircularBuffer(30 * 16000, window.sherpaModule);
            window.wasmBuffer = buffer;
            console.log("CircularBuffer is created!", buffer);
          }

          function fileExists(filename) {
            let buffer = null;
            try {
              const filenameLen = Module.lengthBytesUTF8(filename) + 1;
              const buffer = Module._malloc(filenameLen);
              if (!buffer) {
                throw new Error("Failed to allocate memory");
              }
              Module.stringToUTF8(filename, buffer, filenameLen);

              let exists = Module._SherpaOnnxFileExists(buffer);

              Module._free(buffer);

              return exists;
            } catch (error) {
              console.error("Error checking file existence:", error);
              return false;
            } finally {
              if (buffer) {
                Module._free(buffer);
              }
            }
          }
        }
      }
    }
  };

  window.handleRedirect = handleRedirect;

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
    desktopLevel10,
    desktopLevel11,
    desktopLevel12,
    desktopLevel13,
    desktopLevel14,
    desktopLevel15,
  };

  const rFlow = String(getLocalData("rFlow"));
  const rStep = Number(getLocalData("rStep")) || 2;

  const sectionStyle = {
    width: "100vw",
    height: "100vh",
    // backgroundImage: `url(${
    //   rFlow === "true" ? rOneImage : images?.[`desktopLevel${level || 1}`]
    // })`,
    backgroundImage: `url(${
      rFlow === "true"
        ? level == 1
          ? rOneImage
          : level == 2 && rStep === 2
          ? rTwoImage
          : level == 2 && rStep === 3
          ? rThreeImage
          : level == 2 && rStep === 4
          ? rFourImage
          : images?.[`desktopLevel${level || 1}`]
        : images?.[`desktopLevel${level || 1}`]
    })`,
    backgroundRepeat: "round",
    backgroundSize: "auto",
    position: "relative",
  };

  return (
    <>
      {loading && (
        <ProgressOverlay
          size="4rem"
          color={"#ffffff"}
          showLinearProgress={true}
          downloadProgress={downloadProgress}
        />
      )}
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
        <LanguageModal
          {...{
            lang,
            setLang,
            setOpenLangModal,
            setLoading,
            setDownloadProgress,
          }}
        />
      )}
      {level > 0 ? (
        <Box style={sectionStyle}>
          <ProfileHeader
            {...{
              level,
              lang,
              setOpenLangModal,
              points,
              loading,
              setOpenMessageDialog,
            }}
          />
          <Box>
            {import.meta.env.VITE_SHOW_HELP_VIDEO === "true" && (
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
                  width: rFlow === "true" ? "190px" : "165px",
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
                onClick={async () => {
                  await handleRedirect(lang);
                }}
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
                  {rFlow === "true"
                    ? `Start Refresher ${level === 1 ? "1" : rStep}`
                    : `Start Level ${level}`}
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
              //right: { xs: 20, md: 200 },
              //right: isMobile ? 20 : 200,
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: { xs: 2, md: 5 },
              textAlign: "center",
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
              {import.meta.env.VITE_SHOW_HELP_VIDEO === "true" && (
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
                onClick={async () => {
                  await handleRedirect(lang);
                }}
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
