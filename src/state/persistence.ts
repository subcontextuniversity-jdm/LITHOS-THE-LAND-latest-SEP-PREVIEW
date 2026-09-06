import { initialState, PERSISTENCE } from "./initial-state";
import type { GraphState } from "../schema/types";

const persistedKeys = ["entities", "edges"] as const;

export function serializeGraph(state: GraphState): string {
  return JSON.stringify({
    v: 1,
    mode: PERSISTENCE.mode,
    entities: state.entities,
    edges: state.edges,
  });
}

export function deserializeGraph(raw: string): GraphState | null {
  try {
    const parsed = JSON.parse(raw) as {
      v?: number;
      entities?: GraphState["entities"];
      edges?: GraphState["edges"];
    };
    if (parsed.v !== 1 || !parsed.entities || !parsed.edges) return null;
    if (typeof parsed.entities !== "object" || !Array.isArray(parsed.edges)) {
      return null;
    }

    return {
      ...initialState,
      entities: parsed.entities,
      edges: parsed.edges,
      pickerOpen: false,
      showAllGlyphs: false,
      typeError: null,
    };
  } catch {
    return null;
  }
}

export function loadGraph(storage: Storage | null): GraphState {
  if (!storage) return initialState;
  const raw = storage.getItem(PERSISTENCE.key);
  if (!raw) return initialState;
  return deserializeGraph(raw) ?? initialState;
}

export function saveGraph(storage: Storage | null, state: GraphState): void {
  if (!storage) return;
  const snapshot: Pick<GraphState, (typeof persistedKeys)[number]> = {
    entities: state.entities,
    edges: state.edges,
  };
  storage.setItem(
    PERSISTENCE.key,
    serializeGraph({ ...initialState, ...snapshot }),
  );
}
