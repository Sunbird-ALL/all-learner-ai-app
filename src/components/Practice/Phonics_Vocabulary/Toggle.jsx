import React from "react";

const Toggle = ({ mode, onToggle }) => {
  return (
    <div style={styles.container}>
      <div
        style={styles.toggleTrack}
        onClick={onToggle}
        role="button"
        aria-label="Toggle mode"
      >
        <div
          style={{
            ...styles.slider,
            transform: mode === "word" ? "translateX(100%)" : "translateX(0)",
          }}
        ></div>

        <div
          style={{
            ...styles.label,
            color: mode === "alphabet" ? "#fff" : "#7f8c8d",
          }}
        >
          Learn A to Z
        </div>
        <div
          style={{
            ...styles.label,
            color: mode === "word" ? "#fff" : "#7f8c8d",
          }}
        >
          Learn Words
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  toggleTrack: {
    width: "min(400px, 90vw)", // Responsive width
    height: "60px",
    backgroundColor: "#ecf0f1",
    borderRadius: "30px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
    padding: "5px",
    boxSizing: "border-box",
  },
  slider: {
    position: "absolute",
    top: "5px",
    left: "5px",
    width: "calc(50% - 5px)",
    height: "calc(100% - 10px)",
    backgroundColor: "#ff6b6b",
    borderRadius: "25px",
    transition: "transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
    zIndex: 1,
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  label: {
    flex: 1,
    textAlign: "center",
    fontSize: "1.2rem", // Reduced font size slightly
    fontFamily: "var(--font-secondary)",
    zIndex: 2,
    transition: "color 0.3s",
    userSelect: "none",
    fontWeight: "bold",
  },
};

export default Toggle;
