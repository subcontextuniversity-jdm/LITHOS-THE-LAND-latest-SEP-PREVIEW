import { describe, expect, it } from "vitest";
import { CATEGORIES } from "./types.ts";
import { LEXICON } from "./lexicon.ts";
import { GAZETTEER } from "./gazetteer.ts";
import { glyphById, search } from "./search.ts";
import { validateBind } from "./binding.ts";
import { seedThings } from "./things.ts";

// LEXICON audit — same discipline as the passport spec.

describe("lexicon integrity", () => {
  it("every entry has a stable, unique id", () => {
    const ids = LEXICON.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("Caution 1 — every glyph records an authoritative category from the spine", () => {
    for (const g of LEXICON) {
      expect(CATEGORIES).toContain(g.category);
    }
  });

  it("Lock 2 — every glyph carries exactly one runtime meaning", () => {
    for (const g of LEXICON) {
      expect(g.meaning.trim().length).toBeGreaterThan(0);
      expect(g.surfaces.length).toBeGreaterThan(0);
    }
  });

  it("Caution 1 — a shared mark under two categories is two distinct meanings (🔒)", () => {
    const locks = LEXICON.filter((g) => g.mark === "🔒");
    expect(locks.map((g) => g.category).sort()).toEqual(["GUARDIAN", "PLACE"]);
    expect(locks[0].meaning).not.toBe(locks[1].meaning);
  });
});

describe("Lock 2 — arrows are grammar, not decoration", () => {
  it("↗ LEAVE PLACE and ⇱ ESCALATE are different events on disjoint surfaces", () => {
    const leave = glyphById("leave-place")!;
    const escalate = glyphById("escalate")!;
    expect(leave.meaning).not.toBe(escalate.meaning);
    // ↗ only ever appears in maps/renderings; ⇱ only in guardian refusals/receipts.
    expect(leave.surfaces).toEqual(["MAP", "RENDER"]);
    expect(escalate.surfaces).toEqual(["GUARDIAN", "RECEIPT"]);
    const overlap = leave.surfaces.filter((s) => escalate.surfaces.includes(s));
    expect(overlap).toEqual([]);
  });
});

describe("Caution 2 — curated search gazetteer", () => {
  it("every gazetteer term resolves to real glyphs", () => {
    for (const [term, ids] of Object.entries(GAZETTEER)) {
      for (const id of ids) {
        expect(glyphById(id), `${term} -> ${id}`).toBeTruthy();
      }
    }
  });

  it('searching "boundary" returns the curated set [◆, ⊘, ◉, [ ], ↗]', () => {
    const marks = search("boundary", "ALL").map((g) => g.mark);
    expect(marks).toEqual(["◆", "⊘", "◉", "[ ]", "↗"]);
  });

  it('searching "github" returns connector + git Things and actions', () => {
    const names = search("github", "ALL").map((g) => g.name);
    expect(names).toEqual(["GITHUB", "REPOSITORY", "BRANCH", "COMMIT", "MERGE", "FORK"]);
  });
});

describe("binding compiler", () => {
  it("reproduces the constitution's TYPE ERROR exactly", () => {
    const place = seedThings().find((t) => t.ref === "THING://0100")!;
    const send = glyphById("send")!;
    const res = validateBind(send, place);
    expect(res.ok).toBe(false);
    expect(res.message).toBe(
      "TYPE ERROR:\nCannot bind ACTION onto PLACE BOUNDARY.\nExpected: THING or CONNECTOR.",
    );
  });

  it("allows a type-compatible bind (THING onto CONNECTOR)", () => {
    const github = seedThings().find((t) => t.ref === "THING://0041")!;
    const repo = glyphById("repository")!;
    expect(validateBind(repo, github).ok).toBe(true);
  });
});
