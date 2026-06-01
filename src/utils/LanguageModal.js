import React, { useState, useMemo, useEffect } from "react";
import { useMediaQuery, createTheme } from "@mui/material";
import MotherTongue from "./../assets/motherTongue.svg";
import textureImage from "../assets/images/textureImage.png";
import { getLocalData, setLocalData } from "./constants";

const theme = createTheme();

// Language code to full language object mapping
const languageMap = {
  en: { lang: "English", text: "en", icon: "🇺🇸" },
  ta: { lang: "Tamil", text: "tn", icon: "அ" }, // Map ta to tn for storage
  tn: { lang: "Tamil", text: "tn", icon: "அ" },
  kn: { lang: "Kannada", text: "ka", icon: "ಅ" }, // Map kn to ka for storage
  ka: { lang: "Kannada", text: "ka", icon: "ಅ" },
  te: { lang: "Telugu", text: "te", icon: "అ" },
  gu: { lang: "Gujarati", text: "gu", icon: "ક" },
  hi: { lang: "Hindi", text: "hi", icon: "क" },
  or: { lang: "Odia", text: "or", icon: "କ" },
};

// Default language codes (fallback if env variable is not set)
const defaultLanguageCodes = ["ka", "tn", "te", "hi"];

// Get languages from environment variable or use defaults
const getNativeLanguages = () => {
  try {
    const envLanguages = process.env.REACT_APP_NATIVE_LANGUAGES;
    if (envLanguages) {
      const parsed = JSON.parse(envLanguages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Map language codes to full language objects
        const mappedLanguages = parsed
          .map((code) => {
            // Handle both string codes and existing object format
            if (typeof code === "string") {
              return languageMap[code.toLowerCase()];
            } else if (code && code.text) {
              // Already in object format, return as is
              return code;
            }
            return null;
          })
          .filter(Boolean); // Remove any null/undefined entries

        if (mappedLanguages.length > 0) {
          return mappedLanguages;
        }
      }
    }
  } catch (error) {
    console.warn(
      "Failed to parse REACT_APP_NATIVE_LANGUAGES, using defaults:",
      error
    );
  }
  // Fallback to default language codes mapped to objects
  return defaultLanguageCodes.map((code) => languageMap[code]).filter(Boolean);
};

// Get default native language from environment variable
const getDefaultNativeLanguage = (availableLanguages) => {
  try {
    const envDefaultLang = process.env.REACT_APP_DEFAULT_NATIVE_LANGUAGE;
    if (envDefaultLang) {
      const defaultCode = envDefaultLang.toLowerCase().trim();
      // Map the code to storage code (e.g., "kn" -> "ka", "ta" -> "tn")
      const mappedLang = languageMap[defaultCode];
      if (mappedLang) {
        const storageCode = mappedLang.text;
        // Check if this language is in the available languages list
        const isAvailable = availableLanguages.some(
          (lang) => lang.text === storageCode
        );
        if (isAvailable) {
          return storageCode;
        } else {
          console.warn(
            `Default native language "${defaultCode}" (storage: "${storageCode}") is not in the available languages list. Using first available language instead.`
          );
        }
      } else {
        console.warn(
          `Invalid default native language code: "${defaultCode}". Using first available language instead.`
        );
      }
    }
  } catch (error) {
    console.warn(
      "Failed to parse REACT_APP_DEFAULT_NATIVE_LANGUAGE, using first available language:",
      error
    );
  }
  // Fallback to first language in the list
  return availableLanguages[0]?.text || "ka";
};

const LanguageModalNew = ({ show, word, onClose }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get languages from env variable or defaults
  const availableLanguages = useMemo(() => getNativeLanguages(), []);

  // Get default native language from env variable or use first available
  const defaultLang = useMemo(() => {
    return getDefaultNativeLanguage(availableLanguages);
  }, [availableLanguages]);

  // Set default selected language from config or first language in the list
  const [selectedLang, setSelectedLang] = useState(defaultLang);

  // Update selected language if availableLanguages or default changes
  useEffect(() => {
    const newDefault = getDefaultNativeLanguage(availableLanguages);
    if (availableLanguages.length > 0) {
      // If current selection is not available, use default
      const isCurrentAvailable = availableLanguages.some(
        (l) => l.text === selectedLang
      );
      if (!isCurrentAvailable) {
        setSelectedLang(newDefault);
      } else if (defaultLang !== newDefault) {
        // If default changed and current is still valid, optionally update to new default
        // For now, we keep the current selection if it's valid
      }
    }
  }, [availableLanguages, defaultLang, selectedLang]);

  if (!show) return null;

  const handleConfirm = () => {
    setLocalData("nativeLang", selectedLang);
    setLocalData("nativeLangEnable", true);
    console.log("Selected language:", selectedLang);
    onClose();
  };

  const modalStyle = {
    ...styles.modal,
    width: isMobile ? "80%" : styles.modal.width,
    maxWidth: isMobile ? "380px" : styles.modal.maxWidth,
    backgroundSize: isMobile ? "cover" : styles.modal.backgroundSize,
    backgroundRepeat: isMobile ? "no-repeat" : styles.modal.backgroundRepeat,
    boxShadow: isMobile ? "0px 10px 30px rgba(0, 0, 0, 0.15)" : styles.modal.boxShadow,
    padding: isMobile ? "20px 16px" : styles.modal.padding,
  };

  const headerStyle = {
    ...styles.header,
    marginBottom: isMobile ? "15px" : styles.header.marginBottom,
  };

  const avatarStyle = {
    ...styles.avatar,
    width: isMobile ? "40px" : styles.avatar.width,
    height: isMobile ? "40px" : styles.avatar.height,
  };

  const titleStyle = {
    ...styles.title,
    fontSize: isMobile ? "20px" : styles.title.fontSize,
  };

  const langGridStyle = {
    ...styles.langGrid,
    gap: isMobile ? "10px" : styles.langGrid.gap,
    marginBottom: isMobile ? "15px" : styles.langGrid.marginBottom,
  };

  const confirmBtnStyle = {
    ...styles.confirmBtn,
    height: isMobile ? "48px" : styles.confirmBtn.height,
    marginTop: isMobile ? "5px" : styles.confirmBtn.marginTop,
  };

  return (
    <div style={styles.backdrop}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <img src={MotherTongue} alt="icon" style={avatarStyle} />
          <h2 style={titleStyle}>Choose your help language</h2>
        </div>

        <div style={langGridStyle}>
          {availableLanguages.map((entry, index) => {
            const isSelected = selectedLang === entry.text;
            
            const cardStyle = {
              ...styles.card,
              backgroundColor: isSelected ? "#F37021" : "#fff",
              color: isSelected ? "#fff" : "#333F61",
              borderColor: isSelected ? "#F37021" : "#e0e0e0",
              position: "relative",
              flex: isMobile ? "1 1 110px" : styles.card.flex,
              maxWidth: isMobile ? "140px" : styles.card.maxWidth,
            };

            const cardIconStyle = {
              ...styles.cardIcon,
              color: isSelected ? "#fff" : "#333F61",
              fontFamily:
                entry.text === "te"
                  ? "Sree Krushnadevaraya, Quicksand"
                  : "Quicksand",
              fontSize:
                entry.text === "te"
                  ? (isMobile ? "34px" : "42px")
                  : (isMobile ? "28px" : styles.cardIcon.fontSize),
            };

            const cardTextStyle = {
              ...styles.cardText,
              color: isSelected ? "#fff" : "#333F61",
              fontFamily:
                entry.text === "te"
                  ? "Sree Krushnadevaraya, Quicksand"
                  : "Quicksand",
              fontSize:
                entry.text === "te"
                  ? (isMobile ? "18px" : "22px")
                  : (isMobile ? "16px" : styles.cardText.fontSize),
            };

            return (
              <div
                key={index}
                style={cardStyle}
                onClick={() => setSelectedLang(entry.text)}
              >
                <div style={cardIconStyle}>
                  {entry.icon}
                </div>
                <div style={cardTextStyle}>
                  {entry.lang}
                </div>
                <div style={isSelected ? styles.tickMark : styles.noTickMark}>
                  {isSelected && "✔"}
                </div>
              </div>
            );
          })}
        </div>

        <button style={confirmBtnStyle} onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    overflow: "hidden",
    boxSizing: "border-box",
    padding: "16px 12px",
  },
  modal: {
    width: "min(600px, calc(100vw - 24px))",
    maxWidth: "600px",
    maxHeight: "min(90vh, 100%)",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundImage: `url(${textureImage})`,
    backgroundSize: "contain",
    backgroundRepeat: "round",
    boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(25px)",
    overflow: "hidden",
    boxSizing: "border-box",
    padding: "clamp(16px, 3vw, 28px) clamp(12px, 2vw, 24px)",
    textAlign: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "clamp(20px, 4vh, 35px)",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "100%",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  title: {
    fontSize: "clamp(24px, 5vw, 36px)",
    margin: 0,
    fontWeight: "600",
    fontFamily: "Quicksand",
    color: "#000000",
    lineHeight: 1.2,
    textAlign: "center",
  },
  langGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "stretch",
    alignContent: "center",
    gap: "clamp(12px, 3vw, 20px)",
    marginBottom: "20px",
    width: "100%",
  },
  card: {
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    padding: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontWeight: "600",
    fontFamily: "Quicksand",
    flex: "1 1 140px",
    maxWidth: "200px",
    boxSizing: "border-box",
  },
  cardIcon: {
    fontSize: "36px",
    marginBottom: "5px",
    fontWeight: "600",
    fontFamily: "Quicksand",
  },
  cardText: {
    fontSize: "20px",
    fontWeight: "600",
    fontFamily: "Quicksand",
  },
  tickMark: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#fff",
    color: "#F37021",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noTickMark: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#fff",
    border: "1.5px solid #999999",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtn: {
    background: "#6DAF19",
    color: "#fff",
    minWidth: "173px",
    height: "55px",
    padding: "0 24px",
    borderRadius: "10px",
    border: "none",
    fontSize: "20px",
    fontWeight: "600",
    fontFamily: "Quicksand",
    cursor: "pointer",
    marginTop: "10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};

export default LanguageModalNew;
