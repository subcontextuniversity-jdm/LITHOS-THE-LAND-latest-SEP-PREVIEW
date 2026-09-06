import type { EdgeKind, EntityType, GlyphCategory } from "./types";

export const VISUAL_GRAMMAR_06 = `The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.`;

export const BINDING_RULES: { readonly [K in EntityType]: readonly EntityType[] } = {
  HUMAN: ["PLACE", "THING", "CONNECTOR"],
  PLACE: ["PLACE", "THING", "CONNECTOR"],
  THING: ["ACTION", "THING", "CONNECTOR", "TRACE"],
  ACTION: ["TRACE"],
  GUARDIAN: ["ACTION", "TRACE"],
  TRACE: [],
  CONNECTOR: ["THING", "ACTION", "TRACE"],
  SYSTEM: ["PLACE", "THING", "CONNECTOR", "GUARDIAN"],
};

export const GLYPH_RULES: { readonly [K in EntityType]: readonly GlyphCategory[] } = {
  HUMAN: ["IDENTITY"],
  PLACE: ["PLACE"],
  THING: ["THING"],
  ACTION: ["ACTION"],
  GUARDIAN: ["GUARDIAN"],
  TRACE: ["TRACE"],
  CONNECTOR: ["CONNECTOR", "THING"],
  SYSTEM: ["SYSTEM"],
};

export const EDGE_RULES: Record<
  EdgeKind,
  {
    readonly meaning: string;
    readonly grammar: "BINDING_RULES" | "THREAD_RULES" | "ROUTE_RULES";
    readonly executable: boolean;
  }
> = Object.freeze({
  CONTAINS: Object.freeze({
    meaning: "TREE membership. Parent scope holds child.",
    grammar: "BINDING_RULES",
    executable: true,
  }),
  THREAD: Object.freeze({
    meaning: "Relationship. Not containment. Next module.",
    grammar: "THREAD_RULES",
    executable: false,
  }),
  ROUTES_TO: Object.freeze({
    meaning: "Directed capability path. Not membership.",
    grammar: "ROUTE_RULES",
    executable: false,
  }),
});

export const REPRESENTATION_KEYS = ["glyph", "accent"] as const;

export const AUTHORITY_KEYS = [
  "id",
  "type",
  "name",
  "state",
  "capabilities",
  "history",
] as const;
