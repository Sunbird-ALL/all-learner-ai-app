import React from "react";
import Toggle from "./Toggle";

/**
 * Reusable Header component.
 * Includes Language Switcher, Mode Toggle, and Category Switcher.
 */
const Header = ({
  language,
  onLanguageChange,
  mode,
  onModeToggle,
  category,
  onCategoryChange,
  showAlphabetStrip,
  children,
}) => {
  return (
    <header style={styles.header}>
      <div style={styles.topRow}>
        {/* <div style={styles.languageSwitcher}>
                    <button
                        style={{
                            ...styles.langButton,
                            backgroundColor: language === 'en' ? 'var(--primary-color)' : '#ecf0f1',
                            color: language === 'en' ? 'white' : 'var(--text-muted)'
                        }}
                        onClick={() => onLanguageChange('en')}
                    >
                        En
                    </button>
                    <button
                        style={{
                            ...styles.langButton,
                            backgroundColor: language === 'ta' ? 'var(--primary-color)' : '#ecf0f1',
                            color: language === 'ta' ? 'white' : 'var(--text-muted)'
                        }}
                        onClick={() => onLanguageChange('ta')}
                    >
                        தழ்
                    </button>
                </div> */}

        <Toggle mode={mode} onToggle={onModeToggle} />

        {language === "ta" && (
          <div style={styles.categorySwitcher}>
            {["uyir", "mei", "uyirMei"].map((cat) => (
              <button
                key={cat}
                style={{
                  ...styles.catButton,
                  backgroundColor:
                    category === cat ? "var(--secondary-color)" : "#ecf0f1",
                  color: category === cat ? "white" : "var(--text-muted)",
                }}
                onClick={() => onCategoryChange(cat)}
              >
                {cat === "uyir"
                  ? "உயிர்"
                  : cat === "mei"
                  ? "மெய்"
                  : "உயிர் மெய்"}
              </button>
            ))}
          </div>
        )}
      </div>

      {showAlphabetStrip && children}
    </header>
  );
};

const styles = {
  header: {
    padding: "0.5rem 1rem",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    zIndex: 10,
  },
  topRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "30px",
    width: "100%",
    flexWrap: "wrap",
  },
  languageSwitcher: {
    display: "flex",
    gap: "8px",
  },
  langButton: {
    padding: "4px 12px",
    borderRadius: "15px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "0.8rem",
  },
  categorySwitcher: {
    display: "flex",
    gap: "10px",
  },
  catButton: {
    padding: "5px 15px",
    borderRadius: "15px",
    border: "none",
    fontSize: "0.85rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default Header;
