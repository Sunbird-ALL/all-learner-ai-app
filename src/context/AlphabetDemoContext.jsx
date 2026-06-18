import React, { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const AlphabetDemoContext = createContext();

export const AlphabetDemoProvider = ({ children }) => {
  const [isAlphabetDemoActive, setIsAlphabetDemoActive] = useState(false);
  // True only while the demo popup is on screen — lets the F1 loader hide once it appears.
  const [isAlphabetDemoPopupVisible, setIsAlphabetDemoPopupVisible] =
    useState(false);

  // Memoized so consumers only re-render when these values change.
  const value = useMemo(
    () => ({
      isAlphabetDemoActive,
      setIsAlphabetDemoActive,
      isAlphabetDemoPopupVisible,
      setIsAlphabetDemoPopupVisible,
    }),
    [isAlphabetDemoActive, isAlphabetDemoPopupVisible]
  );

  return (
    <AlphabetDemoContext.Provider value={value}>
      {children}
    </AlphabetDemoContext.Provider>
  );
};

AlphabetDemoProvider.propTypes = {
  children: PropTypes.node,
};

export const useAlphabetDemo = () => useContext(AlphabetDemoContext);
