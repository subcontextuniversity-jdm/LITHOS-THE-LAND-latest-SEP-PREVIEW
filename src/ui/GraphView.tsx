import { containsScope } from "../schema/locks";
import type { GraphState, RescopeEntity } from "../schema/types";
import { IDS } from "../state/initial-state";
import { containedChildren, unboundEntities } from "../state/selectors";
import { GlyphIcon } from "./GlyphIcon";

function Node({
  state,
  entity,
  depth,
  onSelect,
  onEditGlyph,
}: {
  state: GraphState;
  entity: RescopeEntity;
  depth: number;
  onSelect: (id: string) => void;
  onEditGlyph: (id: string) => void;
}) {
  const selected = state.selectedEntityId === entity.id;
  const highlighted = state.highlightEntityIds.includes(entity.id);
  const kids = containedChildren(state, entity.id);

  return (
    <li>
      <div
        className={`entity-node${selected ? " is-selected" : ""}${highlighted ? " is-highlighted" : ""}`}
        data-accent={entity.accent}
        data-entity-id={entity.id}
        style={{ paddingLeft: 12 + depth * 18 }}
      >
        <button
          type="button"
          className="entity-hit"
          onClick={() => onSelect(entity.id)}
          onDoubleClick={() => onEditGlyph(entity.id)}
        >
          <span className="entity-glyph">
            <GlyphIcon name={entity.glyph} />
          </span>
          <span className="entity-copy">
            <strong>{entity.name}</strong>
            <small>{entity.id}</small>
          </span>
        </button>
      </div>
      {kids.length > 0 && (
        <ul className="tree-branch">
          {kids.map((child) => (
            <Node
              key={child.id}
              state={state}
              entity={child}
              depth={depth + 1}
              onSelect={onSelect}
              onEditGlyph={onEditGlyph}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function GraphView({
  state,
  onSelect,
  onEditGlyph,
}: {
  state: GraphState;
  onSelect: (id: string) => void;
  onEditGlyph: (id: string) => void;
}) {
  const root = state.entities[IDS.josh];
  const unbound = unboundEntities(state);

  return (
    <section className="graph-view" aria-label="Preview graph">
      <header className="pane-head">
        <span>TREE</span>
        <small>CONTAINS only</small>
      </header>
      <ul className="tree-root">
        {root && (
          <Node
            state={state}
            entity={root}
            depth={0}
            onSelect={onSelect}
            onEditGlyph={onEditGlyph}
          />
        )}
      </ul>
      {unbound.length > 0 && (
        <div className="unbound-rail">
          <header className="pane-head">
            <span>UNBOUND</span>
            <small>not in the tree</small>
          </header>
          <ul>
            {unbound.map((entity) => {
              const scope = containsScope(state, entity.id);
              return (
                <li key={entity.id}>
                  <button
                    type="button"
                    className={`entity-hit unbound${state.selectedEntityId === entity.id ? " is-selected" : ""}`}
                    data-entity-id={entity.id}
                    data-accent={entity.accent}
                    onClick={() => onSelect(entity.id)}
                  >
                    <span className="entity-glyph">
                      <GlyphIcon name={entity.glyph} />
                    </span>
                    <span className="entity-copy">
                      <strong>{entity.name}</strong>
                      <small>
                        {entity.type}
                        {scope ? ` · ${scope.name}` : ""}
                      </small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
