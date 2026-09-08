import type { BindResult, Category, Glyph, Thing } from "./types.ts";

// The binding compiler.
//
// The picker is a strict type system: a glyph may only be bound to a Thing when
// the glyph's category is accepted by the Thing's type. Attempting an illegal
// bind produces a compiler warning (TYPE ERROR) rather than silently corrupting
// the grammar.
//
// Reproduces the constitution's worked example exactly:
//   bind ACTION (→) onto a PLACE BOUNDARY ([ ]) =>
//     TYPE ERROR:
//     Cannot bind ACTION onto PLACE BOUNDARY.
//     Expected: THING or CONNECTOR.

export const ACCEPTS: Record<Category, Category[]> = {
  HUMAN: ["HUMAN"],
  PLACE: ["THING", "CONNECTOR"],
  THING: ["THING", "CONNECTOR", "ACTION", "THREAD"],
  THREAD: ["THREAD", "CONNECTOR"],
  ACTION: ["ACTION"],
  GUARDIAN: ["GUARDIAN", "ACTION"],
  TRACE: ["TRACE"],
  CONNECTOR: ["CONNECTOR", "THING"],
  SYSTEM: ["SYSTEM"],
  // The lexicon Thing is the representation layer itself; it can hold any glyph.
  LEXICON: ["HUMAN", "PLACE", "THING", "THREAD", "ACTION", "GUARDIAN", "TRACE", "CONNECTOR", "SYSTEM", "LEXICON"],
};

// How a Thing's type is named in a compiler warning.
export const TYPE_LABEL: Record<Category, string> = {
  HUMAN: "HUMAN",
  PLACE: "PLACE BOUNDARY",
  THING: "THING",
  THREAD: "THREAD",
  ACTION: "ACTION",
  GUARDIAN: "GUARDIAN",
  TRACE: "TRACE",
  CONNECTOR: "CONNECTOR",
  SYSTEM: "SYSTEM",
  LEXICON: "LEXICON",
};

export function validateBind(glyph: Glyph, thing: Thing): BindResult {
  const expected = ACCEPTS[thing.type];
  if (expected.includes(glyph.category)) {
    return {
      ok: true,
      message: `BIND OK · ${glyph.category} → ${thing.type} · REPRESENTATION IS NOT IDENTITY`,
      expected,
    };
  }
  return {
    ok: false,
    expected,
    message: [
      "TYPE ERROR:",
      `Cannot bind ${glyph.category} onto ${TYPE_LABEL[thing.type]}.`,
      `Expected: ${expected.join(" or ")}.`,
    ].join("\n"),
  };
}
