import en from "./en";
import hi from "./hi";
import te from "./te";

const UI_STRINGS_BY_LANG = {
  en,
  hi,
  te,
};

/**
 * @param {string | null | undefined} lang
 * @returns {typeof en}
 */
export function getUiStrings(lang) {
  if (!lang) return en;
  const code = String(lang).toLowerCase();
  return UI_STRINGS_BY_LANG[code] || en;
}

export { en, hi, te };
