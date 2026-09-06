import type { TypeErrorState } from "../schema/types";

export function TypeErrorPanel({
  error,
  onShowMe,
  onClose,
}: {
  error: TypeErrorState;
  onShowMe: () => void;
  onClose: () => void;
}) {
  return (
    <aside className="type-error" data-testid="type-error" role="alert">
      <header>
        <strong>◆ TYPE ERROR</strong>
        <button type="button" className="text-btn" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
      </header>
      <p>
        <b>{error.child.name}</b> is an {error.child.type}.
      </p>
      <p>
        <b>{error.parent.name}</b> is a {error.parent.type}.
      </p>
      {error.lesson.split("\n").map((line) => (
        <p key={line}>{line}</p>
      ))}
      <button type="button" className="primary-btn" data-testid="show-me" onClick={onShowMe}>
        [SHOW ME]
      </button>
    </aside>
  );
}
