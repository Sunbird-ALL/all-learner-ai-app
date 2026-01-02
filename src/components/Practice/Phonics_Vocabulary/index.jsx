import React, { useState } from "react";
import MainLayout from "../../Layouts.jsx/MainLayout";
import Header from "./Header";
import Footer from "./Footer";
import Card from "./Card";
import AlphabetStrip from "./AlphabetStrip";
import Celebration from "./Celebration";
import { getPhonicsData } from "./phonics";
import { getLocalData } from "../../../utils/constants";

const PhonicsVocabulary = ({ level, vocabCount, wordCount, points }) => {
  const [mode, setMode] = useState("alphabet"); // 'alphabet' or 'word'
  const [startIndex, setStartIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState([]);
  // const [language, setLanguage] = useState("en"); // 'en' or 'ta'
  const lang = getLocalData("lang");
  const [category, setCategory] = useState("uyir"); // 'uyir', 'mei', 'uyirMei'

  // Load data based on current language and category
  const currentData = getPhonicsData(lang, category, mode);

  const toggleMode = () => {
    setMode((prev) => (prev === "alphabet" ? "word" : "alphabet"));
    setStartIndex(0);
  };

  // const handleLanguageChange = (lang) => {
  //   setLanguage(lang);
  //   setStartIndex(0);
  //   setCompletedLetters([]);
  // };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setStartIndex(0);
    setCompletedLetters([]);
  };

  const handleNext = () => {
    if (startIndex + 10 < currentData.length) {
      setStartIndex((prev) => prev + 10);
    }
  };

  const handlePrev = () => {
    if (startIndex - 10 >= 0) {
      setStartIndex((prev) => prev - 10);
    }
  };

  const handleCardComplete = (letter) => {
    setCompletedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
  };

  const handleCardReset = (letter) => {
    setCompletedLetters((prev) => prev.filter((l) => l !== letter));
  };

  const handleReset = () => {
    setCompletedLetters([]);
    setStartIndex(0);
  };

  const visibleItems = currentData.slice(startIndex, startIndex + 10);
  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + 10 >= currentData.length;

  // Check if all visible items are completed to trigger the blink
  const allVisibleCompleted =
    visibleItems.length > 0 &&
    visibleItems.every((item) => completedLetters.includes(item.letter));
  const shouldBlink = !isNextDisabled && allVisibleCompleted;

  // Full completion celebration
  const showCelebration =
    currentData.length > 0 && completedLetters.length === currentData.length;

  return (
    <MainLayout
      level={1} // Example level to set background (1-15)
      loading={false}
      showNext={true}
      enableNext={true}
      showTimer={false}
      points={points}
      showProgress={false}
      pageName="simplePage"
      vocabCount={vocabCount}
      wordCount={wordCount}
      lang={lang}

      // You can add other props as defined in MainLayout types
    >
      <div style={styles.app}>
        {showCelebration && <Celebration onReset={handleReset} />}
        {["en", "ta"].includes(lang) ? (
          <>
            <Header
              language={lang}
              // onLanguageChange={handleLanguageChange}
              mode={mode}
              onModeToggle={toggleMode}
              category={category}
              onCategoryChange={handleCategoryChange}
              showAlphabetStrip={mode === "alphabet"}
            >
              <div style={styles.stripWrapper}>
                <AlphabetStrip
                  data={
                    lang === "ta" && category === "uyirMei"
                      ? currentData.filter(
                          (item) => !item.letter.slice(1).match(/[ா-ௌ]/)
                        )
                      : currentData
                  }
                  completedLetters={completedLetters}
                />
              </div>
            </Header>
            <main style={styles.main}>
              <div style={styles.grid}>
                {visibleItems.map((item) => (
                  <div key={item.letter} style={styles.gridItem}>
                    <Card
                      item={item}
                      language={lang}
                      mode={mode}
                      isCompleted={completedLetters.includes(item.letter)}
                      onComplete={handleCardComplete}
                      onReset={handleCardReset}
                    />
                  </div>
                ))}
              </div>
            </main>

            <Footer
              onPrev={handlePrev}
              onNext={handleNext}
              isPrevDisabled={isPrevDisabled}
              isNextDisabled={isNextDisabled}
              shouldBlinkNext={shouldBlink}
            />
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
              width: "100%",
              maxHeight: "60vh",
            }}
          >
            <h2 style={{ textAlign: "center", color: "var(--text-muted)" }}>
              Have to prepare the content of the language
            </h2>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PhonicsVocabulary;

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  stripWrapper: {
    width: "100%",
    padding: "0 10px",
    boxSizing: "border-box",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "1rem",
    boxSizing: "border-box",
    overflowY: "auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    paddingBottom: "20px",
    paddingTop: "20px",
    // backgroundColor: "red",
  },
  gridItem: {
    width: "100%",
  },
};
