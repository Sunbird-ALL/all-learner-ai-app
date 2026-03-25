import React from "react";
import {
  LevelOne,
  LevelTwo,
  LevelThree,
  LevelFour,
  LevelFive,
  LevelSix,
  LevelSeven,
  LevelEight,
  LevelNine,
  LevelTen,
  LevelEleven,
  LevelTwelve,
  LevelThirteen,
  LevelFourteen,
  LevelFifteen,
} from "../Icons/SvgIcons";

/**
 * Lazy-loadable wrapper that renders the correct level milestone SVG.
 * Imported via React.lazy() in MainLayout so the SVG data only downloads
 * when a level-complete screen is about to render.
 */
const LevelMilestone = ({ level, isMobile }) => {
  const height = isMobile ? 120 : 168;

  const levelComponents = {
    1: <LevelOne height={height} />,
    2: <LevelTwo height={height} />,
    3: <LevelThree height={height} />,
    4: <LevelFour height={height} />,
    5: <LevelFive height={height} />,
    6: <LevelSix height={height} />,
    7: <LevelSeven height={height} />,
    8: <LevelEight height={height} />,
    9: <LevelNine height={height} />,
    10: <LevelTen height={height} />,
    11: <LevelEleven height={height} />,
    12: <LevelTwelve height={height} />,
    13: <LevelThirteen height={height} />,
    14: <LevelFourteen height={height} />,
    15: <LevelFifteen height={height} />,
  };

  return levelComponents[level] || null;
};

export default LevelMilestone;
