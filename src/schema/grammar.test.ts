import { describe, expect, it } from "vitest";
import { filterGlyphs } from "./filter-glyphs";
import { GLYPHS } from "./glyphs";
import { BINDING_RULES, EDGE_RULES, GLYPH_RULES } from "./rules";
import { ENTITY_TYPES } from "./types";
import { assertBinding, inspectBinding, lessonFor } from "./validator";
import type { RescopeEntity } from "./types";

function entity(partial: Pick<RescopeEntity, "id" | "type" | "name">): RescopeEntity {
  return {
    glyph: "cube",
    accent: "inherited",
    state: "ACTIVE",
    capabilities: [],
    history: [],
    ...partial,
  };
}

describe("LOCK 03 central grammar", () => {
  it("does not copy binding law onto entity instances", () => {
    const place = entity({ id: "PLACE://0002", type: "PLACE", name: "BUILD" });
    expect("allowedBindings" in place).toBe(false);
    expect(BINDING_RULES.PLACE).toEqual(["PLACE", "THING", "CONNECTOR"]);
    expect(BINDING_RULES.PLACE.includes("ACTION")).toBe(false);
  });

  it("keeps BINDING_RULES, GLYPH_RULES, and EDGE_RULES as one registry", () => {
    for (const type of ENTITY_TYPES) {
      expect(Array.isArray(BINDING_RULES[type])).toBe(true);
      expect(Array.isArray(GLYPH_RULES[type])).toBe(true);
    }
    expect(EDGE_RULES.CONTAINS.grammar).toBe("BINDING_RULES");
    expect(EDGE_RULES.THREAD.grammar).toBe("THREAD_RULES");
    expect(EDGE_RULES.ROUTES_TO.grammar).toBe("ROUTE_RULES");
    expect(EDGE_RULES.CONTAINS.meaning).not.toBe(EDGE_RULES.THREAD.meaning);
  });
});

describe("L-03 PLACE cannot contain ACTION", () => {
  const place = entity({ id: "PLACE://0002", type: "PLACE", name: "BUILD" });
  const action = entity({ id: "ACTION://0001", type: "ACTION", name: "SEND" });

  it("rejects ACTION under PLACE once from BINDING_RULES", () => {
    const first = inspectBinding(place, action);
    const second = inspectBinding(place, action);
    expect(first.ok).toBe(false);
    expect(second.ok).toBe(false);
    if (first.ok || second.ok) throw new Error("expected type error");
    expect(first.error.lesson).toBe(second.error.lesson);
    expect(first.error.lesson).toContain("They do not become children of Place boundaries.");
    expect(() => assertBinding(place, action)).toThrow(
      /TYPE ERROR: Cannot bind ACTION to PLACE/,
    );
  });

  it("does not also reject via a second per-entity list", () => {
    expect(lessonFor("PLACE", "ACTION").split("TYPE ERROR").length).toBe(1);
  });
});

describe("L-04 PLACE may contain CONNECTOR", () => {
  it("accepts GitHub under BUILD", () => {
    const place = entity({ id: "PLACE://0002", type: "PLACE", name: "BUILD" });
    const connector = entity({
      id: "CONNECTOR://0041",
      type: "CONNECTOR",
      name: "GitHub",
    });
    expect(inspectBinding(place, connector)).toEqual({ ok: true });
    expect(() => assertBinding(place, connector)).not.toThrow();
  });
});

describe("LOCK 04 TREE ≠ THREAD", () => {
  it("does not apply CONTAINS grammar to THREAD", () => {
    const place = entity({ id: "PLACE://0002", type: "PLACE", name: "BUILD" });
    const action = entity({ id: "ACTION://0001", type: "ACTION", name: "SEND" });
    expect(inspectBinding(place, action, "THREAD")).toEqual({ ok: true });
    expect(inspectBinding(place, action, "ROUTES_TO")).toEqual({ ok: true });
    expect(inspectBinding(place, action, "CONTAINS").ok).toBe(false);
  });
});

describe("L-05 / L-06 glyph lexicon", () => {
  it("search repo returns GitHub for a connector", () => {
    const matches = filterGlyphs("CONNECTOR", "repo");
    expect(matches.every((glyph) => glyph.compatible)).toBe(true);
    expect(matches.map((glyph) => glyph.icon)).toContain("github");
  });

  it("hides ACTION-only glyphs when editing PLACE", () => {
    const matches = filterGlyphs("PLACE", "");
    expect(matches.map((glyph) => glyph.icon)).not.toContain("arrow-right");
    expect(matches.map((glyph) => glyph.label)).not.toContain("Send");
    expect(matches.every((glyph) => glyph.categories.includes("PLACE"))).toBe(true);
  });

  it("SHOW ALL marks SEND incompatible for PLACE", () => {
    const matches = filterGlyphs("PLACE", "", true);
    const send = matches.find((glyph) => glyph.icon === "arrow-right");
    expect(send).toBeDefined();
    expect(send?.compatible).toBe(false);
  });

  it("cube is legal representation for CONNECTOR without becoming a THING", () => {
    const cube = GLYPHS.find((glyph) => glyph.icon === "cube");
    expect(cube?.validFor).toContain("CONNECTOR");
    expect(cube?.validFor).toContain("THING");
  });
});
