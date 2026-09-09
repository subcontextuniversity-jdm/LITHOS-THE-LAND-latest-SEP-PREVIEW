// P01 — the canonical object.
//
// NOTE-0042 must exist ONCE. Every surface resolves the same record from the
// same store. "Object once, render many" (LITHOS P01). Identity, keys and scope
// are never presentation (constitution LAW 06).

export const CANONICAL_NOTE_ID = "NOTE-0042";

export interface Note {
  /** Canonical identity. Stable; never changes. */
  id: string;
  title: string;
  body: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  /** Monotonic revision — increments on every accepted mutation. */
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export interface LineageEntry {
  revision: number;
  at: string;
  by: string;
  capability: string;
  hashBefore: string;
  hashAfter: string;
}

// Small, synchronous, content-derived hash (djb2 → hex). Not cryptographic; it
// exists so a receipt can carry independently inspectable evidence that content
// actually changed, rather than a worker's claim that it did. A real deployment
// swaps this for a content-addressed digest (image/output S-SHASH).
export function hashString(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return "0x" + h.toString(16).padStart(8, "0");
}

export function contentHash(note: Note): string {
  return hashString(`${note.id}|${note.title}|${note.body}|${note.status}|${note.revision}`);
}

/**
 * The single canonical object store. One instance backs every surface, which is
 * why NOTE and WORKBENCH cannot drift into two copies of NOTE-0042.
 */
export class ObjectStore {
  private notes = new Map<string, Note>();
  readonly lineage: LineageEntry[] = [];

  constructor() {
    const now = "2026-09-08T00:00:00Z";
    this.notes.set(CANONICAL_NOTE_ID, {
      id: CANONICAL_NOTE_ID,
      title: "Kitchen rebuild — punch list",
      body: "Tiling booked. Waiting on the electrician to confirm Thursday.",
      status: "ACTIVE",
      revision: 1,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Number of canonical notes. P01-05 requires this stays 1 after worker runs. */
  count(): number {
    return this.notes.size;
  }

  resolve(id: string): Note | undefined {
    return this.notes.get(id);
  }

  /** Read a defensive copy so callers cannot mutate the canonical record directly. */
  read(id: string): Note {
    const n = this.notes.get(id);
    if (!n) throw new Error(`unknown object ${id}`);
    return { ...n };
  }

  /**
   * The ONLY mutation path. Appends to the body, bumps revision, records lineage
   * with before/after hashes. Returns the lineage entry as evidence.
   */
  applyUpdate(id: string, by: string, capability: string, appendText: string): LineageEntry {
    const n = this.notes.get(id);
    if (!n) throw new Error(`unknown object ${id}`);
    const hashBefore = contentHash(n);
    n.body = n.body ? `${n.body}\n${appendText}` : appendText;
    n.revision += 1;
    n.updatedAt = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    const hashAfter = contentHash(n);
    const entry: LineageEntry = {
      revision: n.revision,
      at: n.updatedAt,
      by,
      capability,
      hashBefore,
      hashAfter,
    };
    this.lineage.push(entry);
    return entry;
  }
}
