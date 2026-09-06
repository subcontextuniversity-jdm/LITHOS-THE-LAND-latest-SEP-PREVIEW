import { useMemo, useState } from "react";
import { filterGlyphs } from "../schema/filter-glyphs";
import { GLYPH_RULES } from "../schema/rules";
import type { GlyphDefinition, RescopeEntity } from "../schema/types";
import { GlyphIcon } from "./GlyphIcon";

export function GlyphPicker({
  entity,
  showAll,
  onSelect,
  onClose,
  onToggleShowAll,
}: {
  entity: RescopeEntity;
  showAll: boolean;
  onSelect: (glyph: string) => void;
  onClose: () => void;
  onToggleShowAll: () => void;
}) {
  const [query, setQuery] = useState("");
  const [blocked, setBlocked] = useState<GlyphDefinition | null>(null);

  const glyphs = useMemo(
    () => filterGlyphs(entity.type, query, showAll),
    [entity.type, query, showAll],
  );

  return (
    <div className="glyph-picker-layer" role="dialog" aria-label="Edit glyph">
      <div className="glyph-picker" data-testid="glyph-picker">
        <header>
          <button type="button" className="text-btn" onClick={onClose} aria-label="Close picker">
            ←
          </button>
          <div>
            <strong>Edit Glyph</strong>
            <small>
              {entity.name}
              <span className="sep">{entity.id}</span>
            </small>
          </div>
        </header>

        <input
          data-testid="search-glyphs"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setBlocked(null);
          }}
          placeholder="Search glyphs..."
          autoFocus
        />

        <div className="glyph-grid">
          {glyphs.map((glyph) => (
            <button
              key={glyph.id}
              type="button"
              title={glyph.label}
              data-glyph-icon={glyph.icon}
              className={glyph.compatible ? "" : "is-incompatible"}
              onClick={() => {
                if (!glyph.compatible) {
                  setBlocked(glyph);
                  return;
                }
                onSelect(glyph.icon);
              }}
            >
              <GlyphIcon name={glyph.icon} />
              <span>{glyph.label}</span>
            </button>
          ))}
        </div>

        {blocked && (
          <div className="glyph-block" data-testid="incompatible-glyph">
            <strong>× {blocked.categories[0]} GLYPH</strong>
            <p>
              Not valid for {entity.type}. {entity.type} may wear{" "}
              {GLYPH_RULES[entity.type].join(", ")}.
            </p>
            <button
              type="button"
              className="text-btn"
              onClick={() => setBlocked(null)}
            >
              [WHY?] {blocked.label} is {blocked.categories.join("/")} lexicon.
              Representation cannot rewrite {entity.type} into {blocked.categories[0]}.
            </button>
          </div>
        )}

        <footer>
          <button
            type="button"
            className="text-btn"
            data-testid="show-all-glyphs"
            onClick={onToggleShowAll}
          >
            {showAll ? "SHOW COMPATIBLE ONLY" : "SHOW ALL GLYPHS"}
          </button>
          <small>
            Filter is the lexicon. {entity.type} law: {GLYPH_RULES[entity.type].join(", ")}.
          </small>
        </footer>
      </div>
    </div>
  );
}
