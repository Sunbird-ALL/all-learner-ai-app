/**
 * ASER adaptive discovery: set4 → (set5|set2) → (set6|set3|set3|set1) → terminal landing.
 */

export const DISCOVERY_SET_FLOW_STORAGE = {
  STATE: "discovery_set_flow_state",
  CHAR_SESSION: "discovery_set_flow_char_session",
  CHAR_RESULT: "discovery_set_flow_char_result",
};

export function getInitialSetTag() {
  return "set4";
}

export function collectionForSet(assessmentResponse, setTag) {
  const rows = assessmentResponse?.data;
  if (!Array.isArray(rows)) return null;
  return (
    rows.find((c) => Array.isArray(c.tags) && c.tags.includes(setTag)) || null
  );
}

export function categoryToContentType(category) {
  if (!category || typeof category !== "string") return "Sentence";
  const c = category.toLowerCase();
  if (c === "char") return "Char";
  if (c === "word") return "Word";
  if (c === "paragraph") return "Paragraph";
  if (c === "story") return "Sentence";
  return category;
}

/**
 * After completing a set, history includes the just-finished step as last item.
 * @param {Array<{ setTag: string, result: 'pass'|'fail' }>} history
 * @returns {{ type: 'load', setTag: string } | { type: 'terminal', landing: string, towre: boolean } | { type: 'invalid' }}
 */
export function resolveAfterSetComplete(history) {
  const n = history.length;
  if (n === 0) return { type: "invalid" };
  if (n < 3) {
    const last = history[n - 1];
    if (n === 1) {
      if (last.setTag !== "set4") return { type: "invalid" };
      return last.result === "pass"
        ? { type: "load", setTag: "set5" }
        : { type: "load", setTag: "set2" };
    }
    const [h0, h1] = history;
    if (h0.setTag === "set4" && h0.result === "pass" && h1.setTag === "set5") {
      return h1.result === "pass"
        ? { type: "load", setTag: "set6" }
        : { type: "load", setTag: "set3" };
    }
    if (h0.setTag === "set4" && h0.result === "fail" && h1.setTag === "set2") {
      return h1.result === "pass"
        ? { type: "load", setTag: "set3" }
        : { type: "load", setTag: "set1" };
    }
    return { type: "invalid" };
  }
  return terminalFromFullHistory(history);
}

function terminalFromFullHistory(history) {
  const [a, b, c] = history;
  const P = "pass";
  const F = "fail";
  const ok = (x, tag, r) => x.setTag === tag && x.result === r;

  if (ok(a, "set4", P) && ok(b, "set5", P) && ok(c, "set6", P))
    return { type: "terminal", landing: "M4", towre: true };
  if (ok(a, "set4", P) && ok(b, "set5", P) && ok(c, "set6", F))
    return { type: "terminal", landing: "M3", towre: true };
  if (ok(a, "set4", P) && ok(b, "set5", F) && ok(c, "set3", P))
    return { type: "terminal", landing: "M3", towre: true };
  if (ok(a, "set4", P) && ok(b, "set5", F) && ok(c, "set3", F))
    return { type: "terminal", landing: "M2", towre: false };
  if (ok(a, "set4", F) && ok(b, "set2", P) && ok(c, "set3", P))
    return { type: "terminal", landing: "M2", towre: false };
  if (ok(a, "set4", F) && ok(b, "set2", P) && ok(c, "set3", F))
    return { type: "terminal", landing: "M1", towre: false };
  if (ok(a, "set4", F) && ok(b, "set2", F) && ok(c, "set1", P))
    return { type: "terminal", landing: "M1", towre: false };
  if (ok(a, "set4", F) && ok(b, "set2", F) && ok(c, "set1", F))
    return { type: "terminal", landing: "F1", towre: false };
  return { type: "terminal", landing: "M1", towre: false };
}
