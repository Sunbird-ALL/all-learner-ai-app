import React from "react";

/**
 * Reusable Footer component for navigation.
 */
const Footer = ({
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
  shouldBlinkNext,
}) => {
  return (
    <footer style={styles.footer}>
      <button
        style={{
          ...styles.navButton,
          backgroundColor: isPrevDisabled ? "#bdc3c7" : "#95a5a6",
          cursor: isPrevDisabled ? "not-allowed" : "pointer",
        }}
        onClick={onPrev}
        disabled={isPrevDisabled}
      >
        ⬅ Prev
      </button>
      <button
        style={{
          ...styles.navButton,
          backgroundColor: isNextDisabled ? "#bdc3c7" : "#e74c3c",
          cursor: isNextDisabled ? "not-allowed" : "pointer",
          animation: shouldBlinkNext ? "pulse-button 1.5s infinite" : "none",
        }}
        onClick={onNext}
        disabled={isNextDisabled}
      >
        Next ➡
      </button>
    </footer>
  );
};

const styles = {
  footer: {
    height: "var(--footer-height)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "0 2rem",
    backgroundColor: "#fff",
    boxShadow: "0 -4px 10px rgba(0,0,0,0.05)",
    flexShrink: 0,
    zIndex: 10,
    width: "100%",
    boxSizing: "border-box",
  },
  navButton: {
    color: "white",
    fontSize: "1.4rem",
    padding: "6px 30px",
    borderRadius: "40px",
    boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
    transition: "transform 0.1s",
    minWidth: "140px",
    textAlign: "center",
    border: "none",
  },
};

export default Footer;
