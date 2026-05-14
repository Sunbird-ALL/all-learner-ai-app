import React, { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

const AlphabetDemoContext = createContext();

export const AlphabetDemoProvider = ({ children }) => {
  const [isAlphabetDemoActive, setIsAlphabetDemoActive] = useState(false);

  // Memoized so consumers only re-render when isAlphabetDemoActive changes.
  const value = useMemo(
    () => ({ isAlphabetDemoActive, setIsAlphabetDemoActive }),
    [isAlphabetDemoActive]
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
