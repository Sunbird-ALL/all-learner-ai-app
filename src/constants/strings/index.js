import en from "./en";
import hi from "./hi";
import kn from "./kn";
import te from "./te";
import ne from "./ne";

const UI_STRINGS_BY_LANG = {
  en,
  hi,
  kn,
  te,
  ne,
};

/**
 * @param {string | null | undefined} lang
 * @returns {typeof en}
 */
export function getUiStrings(lang) {
  if (!lang) return en;
  const code = String(lang).toLowerCase();
  const strings = UI_STRINGS_BY_LANG[code];
  if (!strings) return en;
  return { ...en, ...strings };
}

export { en, hi, kn, te, ne };
