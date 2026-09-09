// P01 — HERMES, the first real LITHOS worker.
//
// Hermes receives a bounded job (object, intent, allowed tools, return contract)
// and executes ONLY through scoped capabilities on the PASS engine. It has no
// broad machine authority. Each step is receipted, and the run as a whole emits
// a RUN RECEIPT binding the environment + evidence, so a "done" claim is tied to
// external inspectable facts — not the worker's word.
//
// The model/describe step is a LOCAL DETERMINISTIC STUB. LM Studio / Ollama and a
// live LITHOS MCP model endpoint are NOT connected in this environment, so Hermes
// does not report a verified live-model call, and the container/model bindings in
// the receipt are honest PENDING placeholders (see environment.ts).

import { contentHash, hashString } from "./object.ts";
import type { Note } from "./object.ts";
import type { Capability, InvokeResult, PassEngine } from "./pass.ts";
import type { EvidenceBinding, Receipt, Verification } from "./receipts.ts";
import type { ReceiptLedger } from "./receipts.ts";
import { WORKER_ENVIRONMENT } from "./environment.ts";

export const HERMES_RUNTIME = "local-deterministic-stub (LM Studio/Ollama NOT connected)";

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
  /** Per-capability receipts plus the final run receipt. */
  receipts: Receipt[];
  /** The run-level receipt binding environment + evidence. */
  runReceipt: Receipt;
}

const now = () => new Date().toISOString().replace(/\.\d+Z$/, "Z");

export class Hermes {
  constructor(private pass: PassEngine, private ledger: ReceiptLedger) {}

  run(job: HermesJob): HermesReturn {
    const actor = "WORKER:HERMES";
    const startedAt = now();
    const actionsUsed: Capability[] = [];
    const receipts: Receipt[] = [];
    let description: string | undefined;
    let newRevision: number | undefined;
    let inputHash = "n/a";
    let blocked = false;
    let failed = false;

    const step = (cap: Capability, args: Record<string, unknown> = {}): InvokeResult => {
      const res = this.pass.invoke(actor, job.objectId, cap, args, HERMES_RUNTIME);
      actionsUsed.push(cap);
      receipts.push(res.receipt);
      if (res.decision === "DENY") blocked = true;
      else if (!res.ok) failed = true;
      return res;
    };

    // A job's declared tools are a REQUEST. The PASS is the authority. Hermes
    // attempts each declared tool in a canonical order; anything outside its
    // granted scope is denied at the gate and blocks the run (DENY → RECEIPT).
    const order: Capability[] = ["note.read", "note.describe", "note.update", "note.delete"];
    const plan = order.filter((c) => job.allowedTools.includes(c));
    for (const cap of plan) {
      if (blocked || failed) break;
      const args = cap === "note.update" ? { append: job.requestedUpdate } : {};
      const r = step(cap, args);
      if (!r.ok) break;
      if (cap === "note.read" && r.value) inputHash = contentHash(r.value as Note);
      if (cap === "note.describe") description = String(r.value);
      if (cap === "note.update") newRevision = (r.value as { revision: number }).revision;
    }

    const status: HermesReturn["status"] = blocked ? "BLOCKED" : failed ? "FAILED" : "COMPLETE";
    const validation: Verification = blocked ? "BLOCKED" : failed ? "FAILED" : "VERIFIED";
    const completedAt = now();

    const grant = this.pass.grantFor(actor, job.objectId);
    const outputLocation = newRevision ? `${job.objectId}@rev${newRevision}` : job.objectId;
    const outputHash = hashString(`${job.intent}|${description ?? ""}|${outputLocation}|${validation}`);

    const binding: EvidenceBinding = {
      imageDigest: WORKER_ENVIRONMENT.imageDigest,
      modelId: WORKER_ENVIRONMENT.modelId,
      modelFileHash: WORKER_ENVIRONMENT.modelFileHash,
      mcpVersion: WORKER_ENVIRONMENT.mcpVersion,
      toolsetVersion: WORKER_ENVIRONMENT.toolsetVersion,
      inputObject: job.objectId,
      inputHash,
      grantedCapabilities: grant ? [...grant.capabilities] : [],
      network: "none · no egress granted",
      startedAt,
      completedAt,
      outputHash,
      outputLocation,
      exitStatus: status === "COMPLETE" ? "OK" : status,
      validation,
    };

    const runReceipt = this.ledger.record({
      actor,
      object: job.objectId,
      capability: "hermes.run",
      scope: grant?.scope ?? "none",
      decision: "ALLOW",
      verification: validation,
      evidence: `intent="${job.intent}" · actions [${actionsUsed.join(", ")}] · output ${outputHash} @ ${outputLocation}`,
      runtime: HERMES_RUNTIME,
      binding,
    });
    receipts.push(runReceipt);

    return { worker: "HERMES", status, intent: job.intent, runtime: HERMES_RUNTIME, actionsUsed, description, newRevision, receipts, runReceipt };
  }
}
