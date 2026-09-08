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
