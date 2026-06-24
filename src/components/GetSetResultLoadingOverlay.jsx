import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { subscribeGetSetResultLoading } from "../services/learnerAi/getSetResultLoading";
import { getLocalData } from "../utils/constants";
import { getUiStrings } from "../constants/strings";
import catLoading from "../assets/images/catLoading.gif";
import towreLoading from "../assets/images/loaderGif.gif";
import textureImage from "../assets/images/textureImage.png";

/**
 * Matches MainLayout practice loading: texture card + cat GIF, or TOWRE loader when tFlow is set.
 * No on-screen copy (same as default cat branch in MainLayout).
 */
const GetSetResultLoadingOverlay = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeGetSetResultLoading(setOpen), []);

  const tFlowIsTowre = String(getLocalData("tFlow")) === "true";
  const ui = getUiStrings(getLocalData("lang") || "en");

  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 20,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        backdropFilter: "blur(8px)",
      }}
      open={open}
      aria-busy={open}
    >
      <Box
        role="status"
        aria-live="polite"
        aria-label="Loading, please wait"
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {ui.LOADING_OVERLAY_ARIA}
      </Box>
      <style>{`
        @keyframes getset-dots {
          0%, 80%, 100% { transform: scale(0.65); opacity: 0.45; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <Card
        sx={{
          width: { xs: "min(85vw, 420px)", sm: "400px" },
          minHeight: { xs: "min(52vh, 340px)", sm: 320 },
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${textureImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "round",
          boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
          backdropFilter: "blur(25px)",
          px: 2,
          py: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {tFlowIsTowre ? (
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={towreLoading}
                alt=""
                sx={{
                  display: "block",
                  margin: "0 auto",
                  height: { xs: 160, sm: 200 },
                  width: "auto",
                  maxWidth: "100%",
                }}
              />
            </Box>
          ) : (
            <Box
              component="img"
              src={catLoading}
              alt=""
              sx={{
                maxWidth: "100%",
                height: "auto",
                display: "block",
              }}
            />
          )}
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              justifyContent: "center",
              mt: 2.5,
            }}
            aria-hidden
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background:
                    i % 3 === 0
                      ? "#5C52D5"
                      : i % 3 === 1
                      ? "#EE6931"
                      : "#FFC107",
                  animation: "getset-dots 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </Box>
        </Box>
      </Card>
    </Backdrop>
  );
};

export default GetSetResultLoadingOverlay;
