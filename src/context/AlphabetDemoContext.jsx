import React, { createContext, useContext, useState } from "react";

const AlphabetDemoContext = createContext();

export const AlphabetDemoProvider = ({ children }) => {
  const [isAlphabetDemoActive, setIsAlphabetDemoActive] = useState(false);

  return (
    <AlphabetDemoContext.Provider
      value={{ isAlphabetDemoActive, setIsAlphabetDemoActive }}
    >
      {children}
    </AlphabetDemoContext.Provider>
  );
};

export const useAlphabetDemo = () => useContext(AlphabetDemoContext);
