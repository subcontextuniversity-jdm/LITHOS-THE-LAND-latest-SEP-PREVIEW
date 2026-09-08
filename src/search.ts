import type { Category, Glyph } from "./types.ts";
import { LEXICON } from "./lexicon.ts";
import { GAZETTEER } from "./gazetteer.ts";

const BY_ID = new Map<string, Glyph>(LEXICON.map((g) => [g.id, g]));

export function glyphById(id: string): Glyph | undefined {
  return BY_ID.get(id);
}

// Gazetteer-first search. Curated terms return their ordered, curated set;
// everything else falls back to keyword / name / category matching. Results are
// then narrowed by the active category filter (ALL = no narrowing).
export function search(query: string, activeCategory: Category | "ALL"): Glyph[] {
  const q = query.trim().toLowerCase();

  let base: Glyph[];
  if (q === "") {
    base = LEXICON;
  } else if (GAZETTEER[q]) {
    base = GAZETTEER[q].map((id) => BY_ID.get(id)).filter((g): g is Glyph => Boolean(g));
  } else {
    base = LEXICON.filter((g) => {
      return (
        g.name.toLowerCase().includes(q) ||
        g.id.includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.keywords.some((k) => k.includes(q))
      );
    });
  }

  if (activeCategory === "ALL") return base;
  return base.filter((g) => g.category === activeCategory);
}

export function isCuratedTerm(query: string): boolean {
  return Boolean(GAZETTEER[query.trim().toLowerCase()]);
}
