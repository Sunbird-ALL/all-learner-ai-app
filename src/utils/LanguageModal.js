import React, { useState } from "react";
import MotherTongue from "./../assets/motherTongue.svg";
import { getLocalData, setLocalData } from "./constants";

const sampleTranslations = [
  { lang: "Kannada", text: "ka", icon: "ಅ" },
  { lang: "Tamil", text: "tn", icon: "அ" },
  { lang: "Telugu", text: "te", icon: "అ" },
  { lang: "Hindi", text: "hi", icon: "क" },
];

const LanguageModalNew = ({ show, word, onClose }) => {
  const [selectedLang, setSelectedLang] = useState("ka");

  if (!show) return null;

  const handleConfirm = () => {
    setLocalData("nativeLang", selectedLang);
    setLocalData("nativeLangEnable", true);
    console.log("Selected language:", selectedLang);
    onClose();
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <img src={MotherTongue} alt="icon" style={styles.avatar} />
          <h2 style={styles.title}>Choose your help language</h2>
        </div>

        <div style={styles.langGrid}>
          {sampleTranslations.map((entry, index) => {
            const isSelected = selectedLang === entry.text;
            return (
              <div
                key={index}
                style={{
                  ...styles.card,
                  backgroundColor: isSelected ? "#F37021" : "#fff",
                  color: isSelected ? "#fff" : "#333F61",
                  borderColor: isSelected ? "#F37021" : "#e0e0e0",
                  position: "relative",
                }}
                onClick={() => setSelectedLang(entry.text)}
              >
                <div
                  style={{
                    ...styles.cardIcon,
                    color: isSelected ? "#fff" : "#333F61",
                  }}
                >
                  {entry.icon}
                </div>
                <div
                  style={{
                    ...styles.cardText,
                    color: isSelected ? "#fff" : "#333F61",
                  }}
                >
                  {entry.lang}
                </div>
                <div style={isSelected ? styles.tickMark : styles.noTickMark}>
                  {isSelected && "✔"}
                </div>
              </div>
            );
          })}
        </div>

        <button style={styles.confirmBtn} onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 80,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "600px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "35px",
    justifyContent: "center",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
  },
  title: {
    fontSize: "36px",
    margin: 0,
    fontWeight: "600",
    fontFamily: "Quicksand",
    color: "#333F61",
  },
  langGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    marginBottom: "20px",
  },
  card: {
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    padding: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontWeight: "600",
    fontFamily: "Quicksand",
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
    background: "linear-gradient(to right, #00c6ff, #0072ff)",
    color: "#fff",
    padding: "12px 72px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "Quicksand",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default LanguageModalNew;
