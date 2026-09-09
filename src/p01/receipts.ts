// P01 — the receipt ledger.
//
// A receipt is evidence, not optimism. Every capability attempt — allowed or
// denied — produces an immutable receipt describing who/what acted, on which
// object, under which scope, with what result and verification state.
//
// Outcome vocabulary is exactly: VERIFIED / FAILED / BLOCKED. Nothing is
// VERIFIED because a screen looks correct; it is VERIFIED only when inspectable
// evidence (a revision bump + changed content hash) confirms it.

export type Verification = "VERIFIED" | "FAILED" | "BLOCKED";

/**
 * The evidence a run-level receipt binds, so a "done" claim is tied to external,
 * inspectable facts rather than the worker's word. Fields requiring Docker / a
 * registry / a live model are honest PENDING placeholders until those land.
 */
export interface EvidenceBinding {
  imageDigest: string;          // S-SHASH of the sealed worker environment
  modelId: string;
  modelFileHash: string;        // model-file hash
  mcpVersion: string;           // MCP server version
  toolsetVersion: string;       // skill/plugin versions
  inputObject: string;          // input object ID
  inputHash: string;            // input object hash
  grantedCapabilities: string[];
  network: string;              // network-access state
  startedAt: string;
  completedAt: string;
  outputHash: string;           // output hash
  outputLocation: string;       // where the output is stored
  exitStatus: string;           // exit status
  validation: Verification;     // validation result
}

export interface Receipt {
  receiptId: string;
  at: string;
  actor: string;
  object: string;
  capability: string;
  scope: string;
  decision: "ALLOW" | "DENY";
  verification: Verification;
  /** Independently inspectable evidence, or the denial reason. */
  evidence: string;
  runtime?: string;
  /** Present on run-level receipts: the full environment/evidence binding. */
  binding?: EvidenceBinding;
}

export class ReceiptLedger {
  private entries: Receipt[] = [];
  private seq = 0;

  record(r: Omit<Receipt, "receiptId" | "at"> & { at?: string }): Receipt {
    this.seq += 1;
    const receipt: Receipt = {
      receiptId: `RECEIPT://${String(this.seq).padStart(4, "0")}`,
      at: r.at ?? new Date().toISOString().replace(/\.\d+Z$/, "Z"),
      ...r,
    };
    this.entries.push(receipt);
    return receipt;
  }

  all(): readonly Receipt[] {
    return this.entries;
  }
}
