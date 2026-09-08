# LITHOS-THE-LAND-latest-SEP-PREVIEW
The deepest thesis is becoming:  Intelligence should move through relationships without acquiring sovereignty over them.  Everything else can be derived from that.  A model can be powerful without owning the place. A node can execute without becoming the authority. A ledger can prove an event without becoming the entire application.

---

## ICON//LEXICON — the representation layer

`THING://0042` — the representation layer of the constitution. A semantic,
searchable glyph lexicon (not a 500-icon anonymous grid), a binding compiler
that type-checks glyph → Thing assignments, and a reference viewer that renders
the same vocabulary across maps, refusals and receipts.

Laws encoded here:

- **06 // REPRESENTATION IS NOT IDENTITY** — a glyph, name or accent is
  presentation; restyling it never alters a Thing's identity, keys or scope.
  `GLYPH CHANGE → SAME THING`.
- **One glyph = one runtime meaning** — `↗ LEAVE PLACE` (map/render surface)
  and `⇱ ESCALATE` (guardian/receipt surface) are different events and never
  overlap.
- **`category` is authoritative** — the picker cannot silently re-file a glyph;
  `🔒` under PLACE ("locked place") and under GUARDIAN ("Guardian-enforced") are
  two distinct entries.
- **Curated search** — synonyms live in a gazetteer (`boundary → [◆ ⊘ ◉ [ ] ↗]`),
  not free-text matching.

### Layout

| Path | Role |
| --- | --- |
| `src/types.ts` | Semantic entity types (the spine + operational categories) |
| `src/lexicon.ts` | The glyph lexicon (source of truth) |
| `src/gazetteer.ts` | Curated search synonyms |
| `src/binding.ts` | The binding compiler (TYPE ERROR warnings) |
| `src/things.ts` | Sample Things the picker edits |
| `src/receipt.ts` | Receipt rendered from the same vocabulary |
| `src/main.ts` | Reference viewer UI |
| `schema/lexicon.schema.json` | JSON schema for entity definitions |

### Development

```bash
npm install      # install dependencies
npm run dev      # start the reference viewer at http://localhost:5173
npm run test     # run the LEXICON audit suite
npm run build    # type-check + production build
```
