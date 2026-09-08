// P01 — HERMES, the first real LITHOS worker.
//
// Hermes receives a bounded job (object, intent, allowed tools, return contract)
// and executes ONLY through scoped capabilities on the PASS engine. It has no
// broad machine authority. It returns a structured result plus the receipts that
// are its evidence — a claim of "done" is worthless without them.
//
// The model/describe step is a LOCAL DETERMINISTIC STUB. LM Studio and a live
// LITHOS MCP model endpoint are NOT connected in this environment, so Hermes does
// not — and must not — report a verified live-model call. The object/scope/
// worker/receipt loop around it is real and enforced.

import type { Capability, InvokeResult, PassEngine } from "./pass.ts";
import type { Receipt } from "./receipts.ts";

export const HERMES_RUNTIME = "local-deterministic-stub (LM Studio NOT connected)";

export interface HermesJob {
  objectId: string;
  intent: string;
  allowedTools: Capability[];
  /** The operator-requested, authorised update text to append. */
  requestedUpdate: string;
}

export interface HermesReturn {
  worker: "HERMES";
  status: "COMPLETE" | "BLOCKED" | "FAILED";
  intent: string;
  runtime: string;
  actionsUsed: Capability[];
  description?: string;
  newRevision?: number;
  receipts: Receipt[];
}

export class Hermes {
  constructor(private pass: PassEngine) {}

  run(job: HermesJob): HermesReturn {
    const actor = "WORKER:HERMES";
    const actionsUsed: Capability[] = [];
    const receipts: Receipt[] = [];
    let description: string | undefined;
    let newRevision: number | undefined;

    const step = (cap: Capability, args: Record<string, unknown> = {}): InvokeResult => {
      const res = this.pass.invoke(actor, job.objectId, cap, args, HERMES_RUNTIME);
      actionsUsed.push(cap);
      receipts.push(res.receipt);
      return res;
    };

    // Hermes only ever attempts tools inside its allowed set.
    const allowed = (cap: Capability) => job.allowedTools.includes(cap);

    if (allowed("note.read")) {
      const r = step("note.read");
      if (!r.ok) return { worker: "HERMES", status: "FAILED", intent: job.intent, runtime: HERMES_RUNTIME, actionsUsed, receipts };
    }

    if (allowed("note.describe")) {
      const r = step("note.describe");
      if (r.ok) description = String(r.value);
      else return { worker: "HERMES", status: r.decision === "DENY" ? "BLOCKED" : "FAILED", intent: job.intent, runtime: HERMES_RUNTIME, actionsUsed, description, receipts };
    }

    if (allowed("note.update")) {
      const r = step("note.update", { append: job.requestedUpdate });
      if (r.ok) newRevision = (r.value as { revision: number }).revision;
      else return { worker: "HERMES", status: r.decision === "DENY" ? "BLOCKED" : "FAILED", intent: job.intent, runtime: HERMES_RUNTIME, actionsUsed, description, receipts };
    }

    return {
      worker: "HERMES",
      status: "COMPLETE",
      intent: job.intent,
      runtime: HERMES_RUNTIME,
      actionsUsed,
      description,
      newRevision,
      receipts,
    };
  }
}
