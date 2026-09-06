import { ACCENTS } from "../schema/types";
import { authorityOf, containsScope } from "../schema/locks";
import type { GraphState, RescopeEntity } from "../schema/types";
import { IDS, initialEntities } from "../state/initial-state";
import { identityUnchanged } from "../state/selectors";
import { GlyphIcon } from "./GlyphIcon";

export function EntityInspector({
  state,
  entity,
  onEditGlyph,
  onAccent,
  onBind,
}: {
  state: GraphState;
  entity: RescopeEntity;
  onEditGlyph: () => void;
  onAccent: (accent: (typeof ACCENTS)[number]) => void;
  onBind: (parentId: string, childId: string) => void;
}) {
  const seed = initialEntities[entity.id];
  const place = containsScope(state, entity.id);
  const preserved = seed ? identityUnchanged(seed, entity) : true;
  const representationChanged = seed
    ? seed.glyph !== entity.glyph || seed.accent !== entity.accent
    : false;
  const authority = authorityOf(entity);

  return (
    <section className="inspector" data-testid="entity-inspector" data-entity-id={entity.id}>
      <header className="pane-head">
        <span>ENTITY</span>
        <small>inspector</small>
      </header>

      <div className="inspector-id">
        <span className="entity-glyph lg" data-accent={entity.accent}>
          <GlyphIcon name={entity.glyph} />
        </span>
        <div>
          <strong>{entity.name}</strong>
          <code>{entity.id}</code>
        </div>
      </div>

      <dl className="facts">
        <div>
          <dt>IDENTITY</dt>
          <dd data-testid="identity-status">{preserved ? "unchanged" : "mutated"}</dd>
        </div>
        <div>
          <dt>TYPE</dt>
          <dd>{entity.type}</dd>
        </div>
        <div>
          <dt>PLACE</dt>
          <dd>{place ? place.name : "—"}</dd>
        </div>
        <div>
          <dt>STATE</dt>
          <dd>{entity.state}</dd>
        </div>
        <div>
          <dt>GLYPH</dt>
          <dd data-testid="glyph-value">{entity.glyph}</dd>
        </div>
        <div>
          <dt>ACCENT</dt>
          <dd>{entity.accent}</dd>
        </div>
      </dl>

      {representationChanged && preserved && (
        <div className="proof" data-testid="identity-proof">
          <p>✓ Representation changed</p>
          <p>✓ Identity preserved</p>
          <pre>
            {`id             ${authority.id}
type           ${authority.type}
name           ${authority.name}
state          ${authority.state}
capabilities   ${authority.capabilities.join(", ")}
history        ${authority.history.length} entries`}
          </pre>
        </div>
      )}

      <button
        type="button"
        className="primary-btn"
        data-testid="edit-glyph"
        onClick={onEditGlyph}
      >
        EDIT GLYPH
      </button>

      <div className="accent-row" aria-label="Accent">
        {ACCENTS.map((accent) => (
          <button
            key={accent}
            type="button"
            className={`accent-swatch${entity.accent === accent ? " is-active" : ""}`}
            data-accent={accent}
            data-testid={`accent-${accent}`}
            title={accent}
            onClick={() => onAccent(accent)}
          />
        ))}
      </div>

      {entity.id === IDS.build && (
        <div className="prove-binds">
          <header className="pane-head">
            <span>PROVE BINDING</span>
            <small>validator, not picker</small>
          </header>
          <button
            type="button"
            data-testid="bind-send-under-build"
            onClick={() => onBind(IDS.build, IDS.send)}
          >
            Bind SEND under BUILD
          </button>
          <button
            type="button"
            data-testid="bind-probe-under-build"
            onClick={() => onBind(IDS.build, IDS.probe)}
          >
            Bind Probe under BUILD
          </button>
        </div>
      )}

      <div className="readonly">
        <h3>Capabilities</h3>
        <p>{entity.capabilities.join(" · ") || "none"}</p>
        <h3>History</h3>
        <ul>
          {entity.history.map((entry) => (
            <li key={`${entry.at}:${entry.event}`}>
              <small>{entry.at}</small> {entry.event}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
