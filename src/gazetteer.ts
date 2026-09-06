// Caution 2 — search vocabulary is a UX promise.
//
// Searching "boundary" must return a curated, semantically-related set — not
// whatever free-text happens to match. This gazetteer is that small curated
// file: term -> ordered list of glyph ids. Curated terms resolve here first;
// anything else falls back to keyword matching in search.ts.

export const GAZETTEER: Record<string, string[]> = {
  // boundary -> [◆, ⊘, ◉, [ ], ↗]
  boundary: ["guardian", "block", "scope", "place-boundary", "leave-place"],

  // github -> connector + the git Things and actions
  github: ["github", "repository", "branch", "commit", "merge", "fork"],
  git: ["github", "repository", "branch", "commit", "merge", "fork"],

  // authority crossing vocabulary
  authority: ["guardian", "sovereign", "guardian-enforced", "escalate", "target"],

  // proof / receipt vocabulary
  receipt: ["receipt", "verified", "hash", "trace", "escalate"],
  proof: ["receipt", "verified", "hash"],

  // place vocabulary
  place: ["place-boundary", "scope", "commons", "home", "building"],

  // identity vocabulary
  identity: ["cursor", "identity"],

  // direction / navigation grammar
  direction: ["send", "return", "leave-place", "enter-place", "exchange", "retry", "handoff"],
};
