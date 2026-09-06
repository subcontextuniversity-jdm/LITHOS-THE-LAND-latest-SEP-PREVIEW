export const DEEPEST_THESIS =
  "Intelligence should move through relationships without acquiring sovereignty over them.";

export const DERIVATIONS = Object.freeze([
  {
    id: "model-without-place",
    claim: "A model can be powerful without owning the place.",
    from: DEEPEST_THESIS,
  },
  {
    id: "node-without-authority",
    claim: "A node can execute without becoming the authority.",
    from: DEEPEST_THESIS,
  },
  {
    id: "ledger-without-application",
    claim: "A ledger can prove an event without becoming the entire application.",
    from: DEEPEST_THESIS,
  },
  {
    id: "capability-without-sovereignty",
    claim: "Providers supply capability, never sovereignty.",
    from: DEEPEST_THESIS,
  },
  {
    id: "handoff-003",
    claim:
      "Something else can work on a Thing without owning the Thing, the Place, or the Human.",
    from: DEEPEST_THESIS,
  },
]);

export function everythingElseCanBeDerivedFromThat() {
  return DERIVATIONS.every((item) => item.from === DEEPEST_THESIS);
}
