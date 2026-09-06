export const VISUAL_GRAMMAR_06 = `The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.`;

export const GRAMMAR = Object.freeze({
  THREAD: "relationship",
  GLYPH: "boundary",
  SCAR: "learning",
  WEIGHT: "memory",
  KNOT: "decision",
  CURSOR: "human",
  TALON: "capability",
  ADA: "composition",
});

export const STACK_SPINE = Object.freeze([
  { layer: "LORE", verb: "explains" },
  { layer: "LAW", verb: "constrains" },
  { layer: "MATH", verb: "formalises" },
  { layer: "CODE", verb: "enforces" },
  { layer: "NODES", verb: "execute" },
  { layer: "HASHES", verb: "identify" },
  { layer: "RECEIPTS", verb: "prove" },
  { layer: "HUMANS", verb: "choose" },
]);

export const PATH = Object.freeze([
  "HUMAN",
  "AIRLOCK",
  "SPLIT",
  "PLACE",
  "SCOPE",
  "WORK",
  "RECEIPT",
  "HOME",
]);

export const GOLDEN_CORD = "DON'T PULL THE GOLDEN CORD.";
export const DONT_CUT_THE_THREAD = "DON'T CUT THE THREAD.";

export function grammarCorrespondence() {
  return Object.freeze({
    rule: "Mythology must correspond to system truth or it becomes decoration.",
    lockedVisualGrammar: "06",
    inventedVisualGrammars: [],
  });
}
