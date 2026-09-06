import { AUTHORITY_KEYS, REPRESENTATION_KEYS } from "./rules";
import type { GraphState, RescopeEntity } from "./types";

export const LOCK_01_IDENTITY =
  "GLYPH CHANGE → SAME ENTITY ID → SAME TYPE → SAME THREADS → SAME SCOPE → SAME HISTORY";

export const LOCK_02_REPRESENTATION =
  "glyph, accent, label presentation, layout, animation = REPRESENTATION ONLY";

export const LOCK_03_GRAMMAR =
  "BINDING_RULES, GLYPH_RULES, EDGE_RULES live in one constitutional registry.";

export const LOCK_04_TREE_THREAD =
  "CONTAINS, THREAD, ROUTES_TO remain distinct edge kinds.";

export const IMPLEMENTATION_LAW = "REPRESENTATION MUTATES / IDENTITY PERSISTS";

export function authorityOf(entity: RescopeEntity) {
  return {
    id: entity.id,
    type: entity.type,
    name: entity.name,
    state: entity.state,
    capabilities: entity.capabilities,
    history: entity.history,
  };
}

export function representationOf(entity: RescopeEntity) {
  return {
    glyph: entity.glyph,
    accent: entity.accent,
  };
}

export function containsScope(
  state: Pick<GraphState, "entities" | "edges">,
  entityId: string,
): RescopeEntity | null {
  const edge = state.edges.find(
    (item) => item.kind === "CONTAINS" && item.childId === entityId,
  );
  if (!edge) return null;
  return state.entities[edge.parentId] ?? null;
}

export function childrenOf(
  state: Pick<GraphState, "entities" | "edges">,
  parentId: string,
  kind: "CONTAINS" | "THREAD" | "ROUTES_TO" = "CONTAINS",
): RescopeEntity[] {
  return state.edges
    .filter((edge) => edge.parentId === parentId && edge.kind === kind)
    .map((edge) => state.entities[edge.childId])
    .filter((entity): entity is RescopeEntity => Boolean(entity));
}

export function assertNoAuthorityKeysInRepresentation(): void {
  for (const key of REPRESENTATION_KEYS) {
    if ((AUTHORITY_KEYS as readonly string[]).includes(key)) {
      throw new Error(`Representation key leaked into authority: ${key}`);
    }
  }
}
