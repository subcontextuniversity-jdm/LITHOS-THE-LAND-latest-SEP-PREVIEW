// P01 — the two legitimate surfaces of the SAME object.
//
// NOTE is human-facing and calm: only what a normal person needs. WORKBENCH is
// operator-facing: it exposes identity, runtime, PASS/scope, actions, lineage,
// receipts and verification state. Both project the identical NOTE-0042 record.
//
// The distinction is projection, not two objects — and NOTE's calmness is not a
// security boundary (that is the PASS engine's job).

import type { LineageEntry, Note, ObjectStore } from "./object.ts";
import type { Grant } from "./pass.ts";
import type { Receipt } from "./receipts.ts";

export interface NoteView {
  id: string;
  title: string;
  body: string;
  status: Note["status"];
  actions: string[];
}

// Deliberately omits worker, model, MCP, tokens, routing, lineage, receipts.
export function noteSurface(store: ObjectStore, id: string): NoteView {
  const n = store.read(id);
  return {
    id: n.id,
    title: n.title,
    body: n.body,
    status: n.status,
    actions: ["Save update"],
  };
}

export interface WorkbenchView {
  identity: string;
  representation: string;
  revision: number;
  runtime: string;
  passGrants: Grant[];
  canonicalCount: number;
  lineage: LineageEntry[];
  receipts: readonly Receipt[];
  verificationSummary: { verified: number; blocked: number; failed: number };
}

export function workbenchSurface(
  store: ObjectStore,
  id: string,
  grants: Grant[],
  receipts: readonly Receipt[],
  runtime: string,
): WorkbenchView {
  const n = store.read(id);
  const verificationSummary = {
    verified: receipts.filter((r) => r.verification === "VERIFIED").length,
    blocked: receipts.filter((r) => r.verification === "BLOCKED").length,
    failed: receipts.filter((r) => r.verification === "FAILED").length,
  };
  return {
    identity: n.id,
    representation: "WORKBENCH",
    revision: n.revision,
    runtime,
    passGrants: grants,
    canonicalCount: store.count(),
    lineage: store.lineage,
    receipts,
    verificationSummary,
  };
}
