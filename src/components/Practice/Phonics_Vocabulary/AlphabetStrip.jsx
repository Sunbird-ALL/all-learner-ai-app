import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const AlphabetStrip = ({ data = [], completedLetters = [] }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={styles.container}>
      <IconButton onClick={() => scroll("left")} aria-label="scroll left">
        <ChevronLeft fontSize="large" />
      </IconButton>
      <div ref={scrollRef} style={styles.scrollContainer}>
        {data.map((item) => {
          const isCompleted = completedLetters.includes(item.letter);
          return (
            <div
              key={item.letter}
              style={{
                ...styles.letterCircle,
                backgroundColor: isCompleted
                  ? "var(--success-color)"
                  : "#bdc3c7", // Green if completed, Grey if not
                color: "white",
                transform: isCompleted ? "scale(1.1)" : "scale(1)",
              }}
              title={item.wordText}
            >
              {item.letter}
            </div>
          );
        })}
      </div>
      <IconButton
        onClick={() => scroll("right")}
        aria-label="scroll right"
        fontSize="large"
      >
        <ChevronRight fontSize="large" />
      </IconButton>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    padding: "0.8rem 0",
    backgroundColor: "rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px 0",
    borderRadius: "15px",
  },
  scrollContainer: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    padding: "10px 5px", // Reduced horizontal padding as arrows are external
    maxWidth: "90%", // Adjusted to make room for arrows
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    scrollBehavior: "smooth",
  },
  letterCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    fontFamily: "var(--font-secondary)",
    flexShrink: 0,
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    cursor: "default",
    textAlign: "center",
    padding: "2px",
  },
};

export default AlphabetStrip;
