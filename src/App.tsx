import { useEffect, useMemo, useReducer } from "react";
import { IMPLEMENTATION_LAW } from "./schema/locks";
import { PERSISTENCE } from "./state/initial-state";
import { loadGraph, saveGraph } from "./state/persistence";
import { graphReducer } from "./state/reducer";
import { EntityInspector } from "./ui/EntityInspector";
import { GlyphPicker } from "./ui/GlyphPicker";
import { GraphView } from "./ui/GraphView";
import { TracePanel } from "./ui/TracePanel";
import { TypeErrorPanel } from "./ui/TypeErrorPanel";

const storage = typeof sessionStorage === "undefined" ? null : sessionStorage;

export function App() {
  const [state, dispatch] = useReducer(graphReducer, undefined, () => loadGraph(storage));

  useEffect(() => {
    saveGraph(storage, state);
  }, [state.entities, state.edges]);

  const selected = useMemo(
    () => (state.selectedEntityId ? state.entities[state.selectedEntityId] : null),
    [state.entities, state.selectedEntityId],
  );

  return (
    <div className="shell">
      <div className="crt" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      <header className="mast">
        <div>
          <p className="kicker">ICON//LEXICON</p>
          <h1>RESCOPE</h1>
          <p className="pipeline">
            SCHEMA → ENTITY → GLYPH → VALIDATOR → PICKER → INSPECTOR → TYPE ERROR → SAME IDENTITY
          </p>
        </div>
        <p className="ephemeral" data-testid="persistence-mode" title={PERSISTENCE.note}>
          {PERSISTENCE.mode} // SESSION
        </p>
      </header>

      <p className="law">{IMPLEMENTATION_LAW}</p>

      <div className="workspace">
        <GraphView
          state={state}
          onSelect={(entityId) => dispatch({ type: "SELECT_ENTITY", entityId })}
          onEditGlyph={(entityId) => dispatch({ type: "OPEN_PICKER", entityId })}
        />

        {selected ? (
          <EntityInspector
            state={state}
            entity={selected}
            onEditGlyph={() => dispatch({ type: "OPEN_PICKER", entityId: selected.id })}
            onAccent={(accent) =>
              dispatch({ type: "SET_ACCENT", entityId: selected.id, accent })
            }
            onBind={(parentId, childId) =>
              dispatch({ type: "BIND_ENTITY", parentId, childId })
            }
          />
        ) : (
          <section className="inspector empty">
            <header className="pane-head">
              <span>ENTITY</span>
              <small>select a node</small>
            </header>
            <p>Tap GitHub. Edit its glyph. Identity must not move.</p>
          </section>
        )}
      </div>

      {state.typeError && (
        <TypeErrorPanel
          error={state.typeError}
          onShowMe={() => dispatch({ type: "SHOW_ME_TYPE_ERROR" })}
          onClose={() => dispatch({ type: "CLEAR_TYPE_ERROR" })}
        />
      )}

      {state.pickerOpen && selected && (
        <GlyphPicker
          entity={selected}
          showAll={state.showAllGlyphs}
          onClose={() => dispatch({ type: "CLOSE_PICKER" })}
          onToggleShowAll={() => dispatch({ type: "TOGGLE_SHOW_ALL_GLYPHS" })}
          onSelect={(glyph) =>
            dispatch({
              type: "SET_GLYPH",
              entityId: selected.id,
              glyph,
            })
          }
        />
      )}

      <TracePanel events={state.trace} />
    </div>
  );
}
