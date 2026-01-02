import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LetterHuntMechanics from "../../components/Practice/LetterHuntMechanics";

/**
 * DEMO ROUTE - Letter Hunt Game Demo (Practice View)
 *
 * This is a demo route for showcasing the Letter Hunt game as it appears in Practice.
 * Accessible at: /letter-hunt-demo
 *
 * TODO: Remove this component and route after demo is complete
 */
const LetterHuntDemo = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const handleBack = () => {
    navigate("/");
  };

  const handleNext = () => {
    // Demo: Just show completion message
    console.log("Game completed!");
  };

  // Mock props to match Practice.jsx structure
  return (
    <LetterHuntMechanics
      page={page}
      setPage={setPage}
      level={1}
      header="Letter Recognition"
      points={0}
      steps={10}
      currentStep={1}
      progressData={{}}
      showProgress={true}
      background="linear-gradient(281.02deg, #AE92FF 31.45%, #555ADA 100%)"
      handleNext={handleNext}
      handleBack={handleBack}
      enableNext={false}
      setEnableNext={() => {}}
      isShowCase={false}
      loading={false}
      setOpenMessageDialog={() => {}}
      vocabCount={0}
      wordCount={0}
      showTimer={false}
    />
  );
};

export default LetterHuntDemo;
