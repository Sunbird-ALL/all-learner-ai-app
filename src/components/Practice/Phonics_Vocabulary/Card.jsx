import React from "react";
import { FaVolumeUp, FaRedo, FaPause } from "react-icons/fa";
import { useSpeech } from "./useSpeech";

/**
 * Reusable Card component for learning alphabets or words.
 * @param {Object} props
 * @param {Object} props.item - Data item containing letter, wordText, image etc.
 * @param {string} props.language - 'en' or 'ta'
 * @param {boolean} props.isCompleted - Completion status
 * @param {Function} props.onComplete - Callback when card task is finished
 * @param {Function} props.onReset - Callback to undo progress
 */
const Card = ({
  item,
  language = "en",
  mode = "alphabet",
  isCompleted,
  onComplete,
  onReset,
}) => {
  const { playSpeech, cancelSpeech, isSpeaking } = useSpeech();

  const handlePlay = (e) => {
    if (e) e.stopPropagation();

    if (isSpeaking) {
      cancelSpeech();
    } else {
      playSpeech(mode === "word" ? item.wordText : item.letter, language);
      if (onComplete) onComplete(item.letter);
    }
  };

  const handleReset = (e) => {
    if (e) e.stopPropagation();
    if (onReset) onReset(item.letter);
  };

  const displayText = mode === "word" ? item.wordText : item.letter;
  const isWord = mode === "word";

  return (
    <div
      style={{
        ...styles.card,
        borderColor: item.color || "var(--primary-color)",
        boxShadow: isCompleted
          ? "0 8px 15px rgba(46, 204, 113, 0.2)"
          : "0 4px 6px rgba(0,0,0,0.1)",
        transform: isCompleted ? "scale(1.02)" : "scale(1)",
        opacity: isCompleted ? 1 : 0.9,
      }}
      onClick={handlePlay}
    >
      <div style={styles.content}>
        {item.image ? (
          <div style={styles.columnContainer}>
            <img src={item.image} alt={item.wordText} style={styles.image} />
            <span
              style={{
                ...styles.text,
                color: item.color,
                fontSize: isWord ? "1.5rem" : "2.8rem",
              }}
            >
              {displayText}
            </span>
          </div>
        ) : (
          <span
            style={{
              ...styles.text,
              color: item.color,
              fontSize: isWord ? "2rem" : "2.8rem",
            }}
          >
            {displayText}
          </span>
        )}
      </div>

      <div style={styles.controls}>
        <button
          onClick={handlePlay}
          style={{
            ...styles.iconButton,
            backgroundColor: item.color || "var(--primary-color)",
          }}
          title={isSpeaking ? "Pause" : "Play Sound"}
        >
          {isSpeaking ? <FaPause /> : <FaVolumeUp />}
        </button>
        <button
          onClick={handleReset}
          style={{ ...styles.iconButton, backgroundColor: "#95a5a6" }}
          title="Reset Progress"
        >
          <FaRedo />
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "var(--card-bg)",
    borderRadius: "20px",
    borderWidth: "4px",
    borderStyle: "solid",
    height: "var(--card-height)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.6rem",
    position: "relative",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  text: {
    fontSize: "2.8rem",
    fontFamily: "var(--font-secondary)",
    fontWeight: "bold",
  },
  columnContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  image: {
    width: "70px",
    height: "70px",
    objectFit: "contain",
    borderRadius: "10px",
    marginBottom: "1px",
  },
  controls: {
    display: "flex",
    gap: "8px",
    marginTop: "auto",
    width: "100%",
    justifyContent: "center",
  },
  iconButton: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    color: "white",
    fontSize: "0.9rem",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "transform 0.1s",
  },
};

export default Card;
