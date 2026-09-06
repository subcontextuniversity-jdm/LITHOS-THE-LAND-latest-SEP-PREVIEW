import { childrenOf, containsScope } from "../schema/locks";
import type { GraphState, RescopeEntity } from "../schema/types";

export function lineage(state: GraphState, entityId: string): RescopeEntity[] {
  const chain: RescopeEntity[] = [];
  let current: RescopeEntity | undefined = state.entities[entityId];
  const guard = new Set<string>();

  while (current && !guard.has(current.id)) {
    chain.unshift(current);
    guard.add(current.id);
    current = containsScope(state, current.id) ?? undefined;
  }

  return chain;
}

export function treeRoots(state: GraphState): RescopeEntity[] {
  const childIds = new Set(
    state.edges.filter((edge) => edge.kind === "CONTAINS").map((edge) => edge.childId),
  );
  return Object.values(state.entities).filter((entity) => !childIds.has(entity.id));
}

export function containedChildren(state: GraphState, parentId: string): RescopeEntity[] {
  return childrenOf(state, parentId, "CONTAINS");
}

export function unboundEntities(state: GraphState): RescopeEntity[] {
  const childIds = new Set(
    state.edges.filter((edge) => edge.kind === "CONTAINS").map((edge) => edge.childId),
  );
  const parentIds = new Set(
    state.edges.filter((edge) => edge.kind === "CONTAINS").map((edge) => edge.parentId),
  );
  return Object.values(state.entities).filter(
    (entity) => !childIds.has(entity.id) && !parentIds.has(entity.id),
  );
}

export function identityUnchanged(
  before: RescopeEntity,
  after: RescopeEntity,
): boolean {
  return (
    after.id === before.id &&
    after.type === before.type &&
    after.name === before.name &&
    after.state === before.state &&
    JSON.stringify(after.capabilities) === JSON.stringify(before.capabilities) &&
    JSON.stringify(after.history) === JSON.stringify(before.history)
  );
}

export function authorityReferencesUnchanged(
  before: RescopeEntity,
  after: RescopeEntity,
): boolean {
  return (
    after.capabilities === before.capabilities &&
    after.history === before.history
  );
}
