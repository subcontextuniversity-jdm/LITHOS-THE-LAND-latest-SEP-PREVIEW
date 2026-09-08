import { beforeEach, describe, expect, it } from "vitest";
import { CANONICAL_NOTE_ID, ObjectStore } from "./object.ts";
import { PassEngine, seedGrants } from "./pass.ts";
import { ReceiptLedger } from "./receipts.ts";
import { Hermes, HERMES_RUNTIME } from "./hermes.ts";
import { noteSurface, workbenchSurface } from "./surfaces.ts";

// ACCEPTANCE GATE — P01 NOTE PROOF.
// ONE OBJECT → TWO SURFACES → REAL PASS → ONE WORKER → ONE RECEIPT.

let store: ObjectStore;
let ledger: ReceiptLedger;
let pass: PassEngine;

beforeEach(() => {
  store = new ObjectStore();
  ledger = new ReceiptLedger();
  pass = new PassEngine(store, ledger);
});

describe("P01-01 — SAME OBJECT", () => {
  it("NOTE and WORKBENCH both resolve NOTE-0042 (one canonical record)", () => {
    const note = noteSurface(store, CANONICAL_NOTE_ID);
    const wb = workbenchSurface(store, CANONICAL_NOTE_ID, seedGrants(), ledger.all(), "test");
    expect(note.id).toBe(CANONICAL_NOTE_ID);
    expect(wb.identity).toBe(CANONICAL_NOTE_ID);
    expect(store.count()).toBe(1);
  });
});

describe("P01-02 — DIFFERENT SURFACES", () => {
  it("NOTE stays calm (no operator fields); WORKBENCH exposes operator info", () => {
    const note = noteSurface(store, CANONICAL_NOTE_ID);
    const wb = workbenchSurface(store, CANONICAL_NOTE_ID, seedGrants(), ledger.all(), "test");
    // NOTE projects only human fields.
    expect(Object.keys(note).sort()).toEqual(["actions", "body", "id", "status", "title"]);
    expect(note).not.toHaveProperty("receipts");
    expect(note).not.toHaveProperty("passGrants");
    // WORKBENCH exposes operator surfaces.
    expect(wb).toHaveProperty("passGrants");
    expect(wb).toHaveProperty("lineage");
    expect(wb).toHaveProperty("receipts");
    expect(wb).toHaveProperty("verificationSummary");
  });
});

describe("P01-03 — PASS ALLOW", () => {
  it("an explicitly authorised capability executes and is VERIFIED by evidence", () => {
    const before = store.read(CANONICAL_NOTE_ID).revision;
    const res = pass.invoke("HUMAN:JOSH", CANONICAL_NOTE_ID, "note.update", { append: "Electrician confirmed Thursday 9am." });
    expect(res.ok).toBe(true);
    expect(res.decision).toBe("ALLOW");
    expect(res.receipt.verification).toBe("VERIFIED");
    expect(store.read(CANONICAL_NOTE_ID).revision).toBe(before + 1);
    // Evidence is inspectable: a real revision + hash transition, not a claim.
    expect(res.receipt.evidence).toMatch(/rev \d+ → \d+ · 0x[0-9a-f]+ → 0x[0-9a-f]+/);
  });
});

describe("P01-04 — PASS DENY", () => {
  it("an unauthorised capability cannot execute even if directly requested", () => {
    const before = store.read(CANONICAL_NOTE_ID);
    // Directly request a forbidden capability, bypassing any UI. Still denied.
    const res = pass.invoke("HUMAN:JOSH", CANONICAL_NOTE_ID, "note.delete");
    expect(res.ok).toBe(false);
    expect(res.decision).toBe("DENY");
    expect(res.receipt.verification).toBe("BLOCKED");
    expect(res.receipt.evidence).toContain("not in scope");
    // Object is untouched — no silent side effect.
    expect(store.read(CANONICAL_NOTE_ID)).toEqual(before);
  });

  it("an actor with no PASS on the object is denied", () => {
    const res = pass.invoke("WORKER:GHOST", CANONICAL_NOTE_ID, "note.read");
    expect(res.decision).toBe("DENY");
    expect(res.receipt.evidence).toContain("no PASS");
  });
});

describe("P01-05 — WORKER TRACE", () => {
  it("Hermes operates on NOTE-0042 without creating another canonical note", () => {
    expect(store.count()).toBe(1);
    const out = new Hermes(pass).run({
      objectId: CANONICAL_NOTE_ID,
      intent: "Describe NOTE-0042 and append one authorised operator update.",
      allowedTools: ["note.read", "note.describe", "note.update"],
      requestedUpdate: "Operator: confirmed tiling delivery date.",
    });
    expect(out.status).toBe("COMPLETE");
    expect(out.worker).toBe("HERMES");
    expect(out.actionsUsed).toEqual(["note.read", "note.describe", "note.update"]);
    // Still exactly one canonical object.
    expect(store.count()).toBe(1);
    // Every receipt is attributed to the worker, not anonymous.
    expect(out.receipts.every((r) => r.actor === "WORKER:HERMES")).toBe(true);
    // Honest about the runtime: not a live model.
    expect(out.runtime).toBe(HERMES_RUNTIME);
    expect(out.runtime).toContain("LM Studio NOT connected");
  });

  it("Hermes cannot exceed its scope: note.delete is BLOCKED", () => {
    const res = pass.invoke("WORKER:HERMES", CANONICAL_NOTE_ID, "note.delete");
    expect(res.decision).toBe("DENY");
    expect(res.receipt.verification).toBe("BLOCKED");
  });
});

describe("P01-06 — RECEIPT", () => {
  it("a receipt shows who/what acted, on which object, under which scope, with what result", () => {
    pass.invoke("HUMAN:JOSH", CANONICAL_NOTE_ID, "note.update", { append: "note." });
    const r = ledger.all().at(-1)!;
    expect(r.receiptId).toMatch(/^RECEIPT:\/\/\d{4}$/);
    for (const field of ["actor", "object", "capability", "scope", "decision", "verification", "evidence", "at"] as const) {
      expect(r[field], field).toBeTruthy();
    }
    expect(r.actor).toBe("HUMAN:JOSH");
    expect(r.object).toBe(CANONICAL_NOTE_ID);
  });
});
