import { VISUAL_GRAMMAR_06 } from "../schema/rules";
import type { TraceEvent } from "../schema/types";
import { PERSISTENCE } from "../state/initial-state";

export function TracePanel({ events }: { events: TraceEvent[] }) {
  return (
    <footer className="trace-panel" data-testid="trace">
      <div className="trace-events">
        <span className="pane-head">
          TRACE <small>{PERSISTENCE.mode}</small>
        </span>
        <ol>
          {events
            .slice()
            .reverse()
            .slice(0, 6)
            .map((event) => (
              <li key={event.id}>
                <code>{event.kind}</code> {event.message}
              </li>
            ))}
        </ol>
      </div>
      <blockquote className="grammar-06">
        {VISUAL_GRAMMAR_06.split("\n").map((line) => (
          <p key={line}>{line}</p>
        ))}
      </blockquote>
    </footer>
  );
}
