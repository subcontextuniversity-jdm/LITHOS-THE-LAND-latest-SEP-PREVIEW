import { glyphAllowedFor } from "./validator";
import { GLYPHS } from "./glyphs";
import type { EntityType, GlyphMatch } from "./types";

export function filterGlyphs(
  type: EntityType,
  query: string,
  showAll = false,
): GlyphMatch[] {
  const needle = query.trim().toLowerCase();

  return GLYPHS.filter((glyph) => {
    const compatible = glyphAllowedFor(type, glyph);
    if (!showAll && !compatible) return false;
    if (!needle) return true;

    return (
      glyph.label.toLowerCase().includes(needle) ||
      glyph.icon.toLowerCase().includes(needle) ||
      glyph.keywords.some((keyword) => keyword.toLowerCase().includes(needle))
    );
  }).map((glyph) => ({
    ...glyph,
    compatible: glyphAllowedFor(type, glyph),
  }));
}
