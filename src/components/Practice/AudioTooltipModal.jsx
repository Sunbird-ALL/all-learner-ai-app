import React, { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { ListenButton } from "../../utils/constants";

const AudioTooltipModal = ({ audioSrc, description, children }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShowModal(true)}
      onMouseLeave={() => setShowModal(false)}
    >
      {children}

      {showModal && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "200px",
            background: "#fff",
            border: "2px solid #ff8c52",
            borderRadius: "16px",
            boxShadow: "0px 0px 20px 10px #FF7F367A",
            padding: "16px 0px",
            marginTop: "8px",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <div>
            <Box
              className="walkthrough-step-1"
              sx={{
                //marginTop: "7px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: { xs: "50px", sm: "60px", md: "70px" },
                cursor: "pointer",
              }}
              onClick={() => {
                // playWordAudio(
                //   `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${"text"}`
                // );
              }}
            >
              <ListenButton height={50} width={50} />
            </Box>
          </div>
          {/* <div
            style={{
              width: "100%",
              height: "1.5px",
              backgroundColor: "#ff8c52",
              marginTop: "15px",
              borderRadius: "1px",
            }}
          />
          <p style={{ fontSize: "18px", color: "#333", margin: 15, fontStyle: "Quicksand", fontWeight: "600" }}>
            {description}
          </p> */}
        </div>
      )}
    </div>
  );
};

export default AudioTooltipModal;
