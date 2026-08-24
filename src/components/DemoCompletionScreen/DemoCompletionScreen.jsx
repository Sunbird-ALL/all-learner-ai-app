import { Card, Button } from "@mui/material";
import { ArrowLeft, Gamepad2, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { getUiStrings } from "../../constants/strings";

const DemoCompletionScreen = ({
  language = "en",
  onStartGame,
  onReplayDemo,
  onBack,
  hideHeader = false,
}) => {
  const ui = getUiStrings(language);

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(45deg, #FF730E 30%, #FFB951 90%)",
        padding: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {!hideHeader && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
              flexShrink: 0,
            }}
          >
            <Button
              onClick={onBack}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                fontSize: "14px",
                padding: "8px 12px",
              }}
            >
              <ArrowLeft
                style={{ height: "12px", width: "12px", marginRight: "4px" }}
              />
              {ui.COMMON_BACK}
            </Button>
          </div>
        )}

        <Card
          style={{
            flex: 1,
            padding: "40px",
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px",
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
              textAlign: "center",
            }}
          >
            {/* Trophy Animation */}
            <div
              style={{
                position: "relative",
                animation: "trophy-bounce 2s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  background:
                    "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 25px 50px -12px rgba(251,191,36,0.5)",
                  position: "relative",
                }}
              >
                <Trophy
                  style={{ width: "80px", height: "80px", color: "white" }}
                />

                {/* Sparkles */}
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    fontSize: "40px",
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  ✨
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    left: "-20px",
                    fontSize: "32px",
                    animation: "float 3s ease-in-out infinite",
                    animationDelay: "0.5s",
                  }}
                >
                  🌟
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "36px",
                    animation: "float 3s ease-in-out infinite",
                    animationDelay: "1s",
                  }}
                >
                  ⭐
                </div>
              </div>
            </div>

            {/* Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Sparkles
                style={{ width: "32px", height: "32px", color: "#F59E0B" }}
              />
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: "900",
                  color: "#1F2937",
                  margin: 0,
                }}
              >
                {ui.DEMO_COMPLETE}
              </h1>
              <Sparkles
                style={{ width: "32px", height: "32px", color: "#F59E0B" }}
              />
            </div>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#6B7280",
                margin: 0,
              }}
            >
              {ui.DEMO_COMPLETION_SUBTITLE}
            </p>

            {/* Message */}
            <div
              style={{
                backgroundColor: "#FEF3C7",
                border: "2px solid #FBBF24",
                borderRadius: "16px",
                padding: "24px 32px",
                maxWidth: "600px",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  color: "#92400E",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                {ui.DEMO_COMPLETION_MESSAGE}
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <Button
                onClick={onReplayDemo}
                style={{
                  padding: "16px 32px",
                  backgroundColor: "#6B7280",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "16px",
                  borderRadius: "9999px",
                  boxShadow: "0 10px 15px -3px rgba(107,114,128,0.4)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <RotateCcw style={{ width: "20px", height: "20px" }} />
                {ui.DEMO_COMPLETION_REPLAY}
              </Button>

              <Button
                onClick={onStartGame}
                style={{
                  padding: "16px 32px",
                  background:
                    "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "18px",
                  borderRadius: "9999px",
                  boxShadow: "0 10px 15px -3px rgba(16,185,129,0.4)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  animation: "pulse-button 2s ease-in-out infinite",
                }}
              >
                <Gamepad2 style={{ width: "24px", height: "24px" }} />
                {ui.DEMO_COMPLETION_START_GAME}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <style>
        {`
          @keyframes trophy-bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes pulse-button {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}
      </style>
    </div>
  );
};

export default DemoCompletionScreen;
