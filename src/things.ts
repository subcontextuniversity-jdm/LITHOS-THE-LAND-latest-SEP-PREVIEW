import type { Thing } from "./types.ts";

// Sample Things the picker can edit. Each `ref` is identity and never changes,
// no matter how many times its glyph, name or accent are re-bound.

export function seedThings(): Thing[] {
  return [
    {
      ref: "THING://0041",
      type: "CONNECTOR",
      name: "GitHub",
      glyphId: "github",
      accent: "inherited",
      state: "CONNECTED",
      weight: 0,
      scars: [],
    },
    {
      ref: "THING://0042",
      type: "LEXICON",
      name: "ICON//LEXICON",
      glyphId: "dictionary",
      accent: "cyan",
      state: "LOCKED & MAPPED",
      weight: 0,
      scars: [],
    },
    {
      ref: "THING://0100",
      type: "PLACE",
      name: "STUDIO",
      glyphId: "place-boundary",
      accent: "amber",
      state: "OPEN",
      weight: 0,
      scars: [],
    },
    {
      ref: "THING://0007",
      type: "HUMAN",
      name: "CURSOR",
      glyphId: "cursor",
      accent: "inherited",
      state: "PRESENT",
      weight: 0,
      scars: [],
    },
  ];
}
