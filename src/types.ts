// ICON//LEXICON — semantic entity definitions.
//
// The taxonomy is the LITHOS spine (HUMAN PLACE THING THREAD ACTION GUARDIAN
// TRACE CONNECTOR) plus two operational categories (SYSTEM, LEXICON). A glyph's
// `category` is therefore part of the grammar, not decoration: the same visual
// mark filed under two categories is two different runtime meanings.

export const CATEGORIES = [
  "HUMAN",
  "PLACE",
  "THING",
  "THREAD",
  "ACTION",
  "GUARDIAN",
  "TRACE",
  "CONNECTOR",
  "SYSTEM",
  "LEXICON",
] as const;

export type Category = (typeof CATEGORIES)[number];

// Where a glyph is permitted to appear. Lock 2: one glyph = one runtime
// meaning, so overlapping events (route change vs authority crossing) are
// separated by surface as well as by meaning.
export const SURFACES = ["MAP", "RENDER", "PICKER", "GUARDIAN", "RECEIPT"] as const;
export type Surface = (typeof SURFACES)[number];

export interface Glyph {
  /** Stable identity of the lexicon entry. Never changes. */
  id: string;
  /** The visual mark. Pure presentation — swappable without consequence. */
  mark: string;
  /** Semantic label shown in the picker. */
  name: string;
  /** Authoritative category. Part of the grammar; the picker cannot re-file it. */
  category: Category;
  /** Exactly one runtime meaning (Lock 2). */
  meaning: string;
  /** Surfaces on which this glyph may legally appear. */
  surfaces: Surface[];
  /** Free-text discovery aids. Curated search still goes through the gazetteer. */
  keywords: string[];
}

export interface Thing {
  /** Canonical reference, e.g. THING://0041. This is identity. */
  ref: string;
  /** The Thing's type — drives which glyph categories may bind to it. */
  type: Category;
  /** Human-facing name. Presentation. */
  name: string;
  /** Currently bound glyph id. Presentation. */
  glyphId: string;
  /** Accent token — "inherited" or a colour name. Presentation. */
  accent: string;
  /** Runtime state string. */
  state: string;
  /** WEIGHT — memory: how many representation changes this Thing has carried. */
  weight: number;
  /** SCAR log — evidence of every glyph change. Identity is never in here. */
  scars: Scar[];
}

export interface Scar {
  at: string;
  from: string;
  to: string;
}

export interface BindResult {
  ok: boolean;
  /** Human message. On failure this is the TYPE ERROR compiler warning. */
  message: string;
  expected?: Category[];
}
