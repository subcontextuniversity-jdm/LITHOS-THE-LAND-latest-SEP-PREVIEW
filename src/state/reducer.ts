import { assertEdgeKind, inspectBinding } from "../schema/validator";
import type { GraphAction } from "./actions";
import type { GraphState, RescopeEdge, TraceEvent } from "../schema/types";

function nextId(prefix: string): string {
  const bytes = crypto.randomUUID();
  return `${prefix}${bytes}`;
}

function trace(
  state: GraphState,
  event: Omit<TraceEvent, "id" | "at">,
): TraceEvent[] {
  return [
    ...state.trace,
    {
      id: nextId("TRACE://"),
      at: Date.now(),
      ...event,
    },
  ].slice(-24);
}

export function graphReducer(state: GraphState, action: GraphAction): GraphState {
  switch (action.type) {
    case "SELECT_ENTITY":
      return {
        ...state,
        selectedEntityId: action.entityId,
        highlightEntityIds: action.entityId ? [action.entityId] : [],
        typeError: action.entityId ? state.typeError : null,
        trace: action.entityId
          ? trace(state, {
              kind: "SELECT",
              message: `Selected ${action.entityId}`,
            })
          : state.trace,
      };

    case "SET_GLYPH": {
      const entity = state.entities[action.entityId];
      if (!entity) return state;
      if (entity.glyph === action.glyph) {
        return {
          ...state,
          pickerOpen: false,
          showAllGlyphs: false,
        };
      }

      return {
        ...state,
        pickerOpen: false,
        showAllGlyphs: false,
        entities: {
          ...state.entities,
          [action.entityId]: {
            ...entity,
            glyph: action.glyph,
          },
        },
        trace: trace(state, {
          kind: "GLYPH",
          message: `${entity.id} glyph ${entity.glyph} → ${action.glyph}. Identity preserved.`,
        }),
      };
    }

    case "SET_ACCENT": {
      const entity = state.entities[action.entityId];
      if (!entity) return state;
      if (entity.accent === action.accent) return state;

      return {
        ...state,
        entities: {
          ...state.entities,
          [action.entityId]: {
            ...entity,
            accent: action.accent,
          },
        },
        trace: trace(state, {
          kind: "ACCENT",
          message: `${entity.id} accent ${entity.accent} → ${action.accent}. Identity preserved.`,
        }),
      };
    }

    case "BIND_ENTITY": {
      const parent = state.entities[action.parentId];
      const child = state.entities[action.childId];
      const kind = action.edgeKind ?? "CONTAINS";

      if (!parent || !child) {
        throw new Error("Unknown entity.");
      }

      assertEdgeKind(kind);

      const duplicate = state.edges.some(
        (edge) =>
          edge.parentId === parent.id &&
          edge.childId === child.id &&
          edge.kind === kind,
      );
      if (duplicate) return state;

      const verdict = inspectBinding(parent, child, kind);
      if (!verdict.ok) {
        return {
          ...state,
          typeError: { ...verdict.error, kind },
          highlightEntityIds: [parent.id, child.id],
          selectedEntityId: parent.id,
          pickerOpen: false,
          trace: trace(state, {
            kind: "TYPE_ERROR",
            message: `TYPE ERROR: Cannot bind ${child.type} to ${parent.type}.`,
          }),
        };
      }

      const edge: RescopeEdge = {
        id: nextId("EDGE://"),
        parentId: parent.id,
        childId: child.id,
        kind,
      };

      return {
        ...state,
        typeError: null,
        edges: [...state.edges, edge],
        highlightEntityIds: [parent.id, child.id],
        trace: trace(state, {
          kind: "BIND",
          message: `${kind} ${child.id} under ${parent.id}`,
        }),
      };
    }

    case "OPEN_PICKER":
      return {
        ...state,
        selectedEntityId: action.entityId,
        pickerOpen: true,
        showAllGlyphs: false,
        highlightEntityIds: [action.entityId],
        trace: trace(state, {
          kind: "PICKER",
          message: `Edit glyph for ${action.entityId}`,
        }),
      };

    case "CLOSE_PICKER":
      return {
        ...state,
        pickerOpen: false,
        showAllGlyphs: false,
      };

    case "TOGGLE_SHOW_ALL_GLYPHS":
      return {
        ...state,
        showAllGlyphs: !state.showAllGlyphs,
      };

    case "CLEAR_TYPE_ERROR":
      return {
        ...state,
        typeError: null,
      };

    case "SHOW_ME_TYPE_ERROR":
      if (!state.typeError) return state;
      return {
        ...state,
        selectedEntityId: state.typeError.parent.id,
        highlightEntityIds: [state.typeError.parent.id, state.typeError.child.id],
        pickerOpen: false,
      };

    default:
      return state;
  }
}
