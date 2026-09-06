import test from "node:test";
import assert from "node:assert/strict";
import { WORKER } from "../src/law.mjs";
import { canonicalize, CANONICALIZATION } from "../src/canonical.mjs";
import { LEDGER_PERSISTENCE } from "../src/ledger.mjs";
import {
  THING_ID,
  DERIVATIVE_ID,
  CONVERSION_ROUTE,
  AUTHORIZATION_KIND,
  SKETCH_JAW,
  seedThing0041,
  ensureHashes,
  convertRepresentation,
  convertBlendGlbStl,
  inspectRepresentations,
  openOn,
  proposeForThing,
  deriveThing,
  alterProposal,
  retargetThread,
  approveKnot,
  commitKnot,
  hashReceipt,
  claimVerified,
  resetDefaultLedger,
} from "../src/identity.mjs";

const human = { id: "human-josh", name: "Josh", role: "CURSOR" };

test.beforeEach(() => {
  resetDefaultLedger();
});

async function importedThing() {
  return ensureHashes(seedThing0041());
}

async function convertedThing() {
  const result = await convertBlendGlbStl(await importedThing());
  assert.equal(result.ok, true);
  return result.thing;
}

async function proposalFor(thing) {
  const ada = proposeForThing(thing);
  return ada.proposals.find((item) => item.id === "place") ?? ada.proposals[0];
}

test("01 IDENTITY: blend → glb → stl retains exactly one logical Thing ID", async () => {
  const start = await importedThing();
  const chain = await convertBlendGlbStl(start);
  assert.equal(chain.ok, true);
  assert.deepEqual(chain.thingIds, [THING_ID, THING_ID, THING_ID]);
  assert.equal(chain.thing.thingId, THING_ID);
  const ids = inspectRepresentations(chain.thing).map((item) => item.representationId);
  assert.equal(new Set(ids).size, 3);
  assert.ok(ids.every((id) => id.startsWith("REP://0041/")));
});

test("02 PRESERVATION: original and each output remain inspectable; adding must not overwrite prior content", async () => {
  const start = await importedThing();
  const blend = start.representations[0];
  const glb = await convertRepresentation(start, { kind: "glb", from: "blend" });
  const stl = await convertRepresentation(glb.thing, { kind: "stl", from: "glb" });
  const labels = inspectRepresentations(stl.thing).map((item) => item.label);
  assert.deepEqual(labels, ["model.blend", "model.glb", "model.stl"]);
  const kept = stl.thing.representations[0];
  assert.equal(kept.content, blend.content);
  assert.equal(kept.contentHash, blend.contentHash);
  assert.notEqual(stl.thing.representations[1].content, blend.content);
  assert.notEqual(stl.thing.representations[2].contentHash, blend.contentHash);
  const overwrite = await convertRepresentation(stl.thing, { kind: "glb", from: "blend" });
  assert.equal(overwrite.ok, false);
  assert.equal(overwrite.published, false);
  assert.match(overwrite.error, /overwrite/);
  assert.equal(inspectRepresentations(overwrite.thing).length, 3);
});

test("03 TRACE: successful conversion records source, result and outcome; failure publishes nothing", async () => {
  const start = await importedThing();
  const importEvent = start.trace[0];
  const glb = await convertRepresentation(start, { kind: "glb", from: "blend" });
  assert.equal(glb.thing.trace.filter((item) => item.kind === "CONVERT").length, 1);
  const convertEvent = glb.thing.trace.at(-1);
  assert.equal(convertEvent.source, start.representations[0].representationId);
  assert.equal(convertEvent.result, glb.thing.representations[1].representationId);
  assert.equal(convertEvent.outcome, "SUCCESS");
  assert.equal(convertEvent.conversion, CONVERSION_ROUTE);
  assert.equal(glb.thing.trace[0], importEvent);

  const failed = await convertRepresentation(glb.thing, { kind: "broken", fail: true, from: "glb" });
  assert.equal(failed.ok, false);
  assert.equal(failed.published, false);
  assert.equal(failed.thing.representations.length, 2);
  assert.ok(!failed.thing.representations.some((item) => item.kind === "broken"));
  const failure = failed.thing.trace.at(-1);
  assert.equal(failure.outcome, "FAILURE");
  assert.equal(failure.result, null);
  assert.equal(failed.thing.trace[0], importEvent);
});

test("04 DERIVATION: knot creates a distinct descendant with parent THING://0041", async () => {
  const original = await convertedThing();
  const proposal = await proposalFor(original);
  const granted = await approveKnot(human, { proposal, thing: original });
  const committed = await commitKnot(original, human, proposal, granted.approval);
  assert.equal(committed.ok, true);
  assert.equal(committed.derivative.thingId, DERIVATIVE_ID);
  assert.equal(committed.derivative.parent, THING_ID);
  assert.equal(committed.parent.thingId, THING_ID);
  assert.notEqual(committed.derivative.thingId, committed.parent.thingId);
  assert.equal(original.thingId, THING_ID);
  assert.equal(original.descendants.length, 0);
  assert.deepEqual(
    inspectRepresentations(committed.parent).map((item) => item.label),
    ["model.blend", "model.glb", "model.stl"],
  );
});

test("05 PROPOSAL: ADA may propose; a proposal alone cannot publish a derivative", async () => {
  const thing = await convertedThing();
  const ada = proposeForThing(thing);
  assert.equal(ada.committed, false);
  assert.equal(ada.derivative, null);
  assert.deepEqual(ada.cannot, ["tie_knot", "decide"]);
  const pending = deriveThing(thing, ada.proposals[0]);
  assert.equal(pending.committed, false);
  assert.equal(pending.derivative, null);
  const edited = alterProposal(pending, { note: "drop Cover, add Sketch" }, human);
  assert.equal(edited.committed, false);
  assert.equal(edited.derivative, null);
  const retargeted = retargetThread(thing, "cover-vigil", SKETCH_JAW, human);
  assert.equal(retargeted.derivative, null);
  assert.equal(thing.descendants.length, 0);
});

test("06 KNOT: commit requires bound human approval; retries of the exact operation are idempotent", async () => {
  const original = await convertedThing();
  const proposal = await proposalFor(original);
  assert.equal((await commitKnot(original, human, proposal)).ok, false);

  const granted = await approveKnot(human, { proposal, thing: original });
  const changedProposal = { ...proposal, id: "screen" };
  const invalidated = await commitKnot(original, human, changedProposal, granted.approval);
  assert.equal(invalidated.ok, false);
  assert.match(invalidated.error, /invalidates/);

  const worker = await commitKnot(original, WORKER, proposal, granted.approval);
  assert.equal(worker.ok, false);

  const first = await commitKnot(original, human, proposal, granted.approval);
  assert.equal(first.ok, true);
  assert.equal(first.duplicate, false);
  assert.equal(first.derivative.thingId, DERIVATIVE_ID);
  assert.equal(first.ledger.persistence, LEDGER_PERSISTENCE);
  const frozenHash = first.receipt.receiptHash;

  const retryOriginal = await commitKnot(original, human, proposal, granted.approval);
  assert.equal(retryOriginal.ok, true);
  assert.equal(retryOriginal.duplicate, true);
  assert.equal(retryOriginal.idempotent, true);
  assert.equal(retryOriginal.parent.descendants.length, 1);
  assert.equal(retryOriginal.derivative.thingId, DERIVATIVE_ID);
  assert.equal(retryOriginal.parent.receipts.length, 1);
  assert.equal(retryOriginal.receipt.receiptHash, frozenHash);
  assert.equal(original.descendants.length, 0);
  assert.equal(original.receipts.length, 0);

  const retryParent = await commitKnot(first.parent, human, proposal, granted.approval);
  assert.equal(retryParent.duplicate, true);
  assert.equal(retryParent.idempotent, true);
  assert.equal(retryParent.parent.descendants.length, 1);
  assert.equal(retryParent.derivative.thingId, DERIVATIVE_ID);
  assert.equal(retryParent.parent.receipts.length, 1);
  assert.equal(retryParent.receipt.receiptHash, frozenHash);
});

test("07 RECEIPTS: new consequential work appends an immutable receipt; hashes are RFC 8785 / SHA-256 integrity", async () => {
  const original = await convertedThing();
  const ada = proposeForThing(original);
  const firstProposal = ada.proposals[0];
  const secondProposal = ada.proposals[1];
  const firstApproval = await approveKnot(human, { proposal: firstProposal, thing: original });
  const first = await commitKnot(original, human, firstProposal, firstApproval.approval);
  const frozen = first.receipt;
  assert.equal(frozen.authorization, AUTHORIZATION_KIND);
  assert.equal(frozen.claim, "EVIDENCE");
  assert.equal(frozen.verified, false);
  assert.equal(frozen.payload.integrity.canonicalization, CANONICALIZATION);
  assert.equal(frozen.payload.decision, "KNOT");
  assert.ok(frozen.payload.inputs.every((item) => item.contentHash && item.representationId));
  assert.ok(frozen.payload.outputs.every((item) => item.contentHash && item.representationId));
  assert.equal(await hashReceipt(frozen), frozen.receiptHash);
  assert.equal(canonicalize(frozen.payload), canonicalize(frozen.payload));
  assert.equal(
    await hashReceipt({ ...frozen, presentation: { tab: "pocket", viewport: "narrow" } }),
    frozen.receiptHash,
  );
  assert.equal(claimVerified(frozen, {}).ok, false);

  const secondApproval = await approveKnot(human, {
    proposal: secondProposal,
    thing: first.parent,
  });
  const second = await commitKnot(first.parent, human, secondProposal, secondApproval.approval);
  assert.equal(second.parent.receipts.length, 2);
  assert.equal(first.parent.receipts.length, 1);
  assert.equal(first.parent.receipts[0].receiptHash, frozen.receiptHash);
  assert.equal(second.parent.receipts[0].receiptHash, frozen.receiptHash);
  assert.notEqual(second.receipt.receiptHash, frozen.receiptHash);
  assert.equal(second.derivative.thingId, "DERIVATIVE://0041-B");
});

test("08 SURFACES: opening Pocket, Workbench or Drafting Table is non-consequential", async () => {
  const original = await convertedThing();
  const proposal = await proposalFor(original);
  const granted = await approveKnot(human, { proposal, thing: original });
  const committed = await commitKnot(original, human, proposal, granted.approval);
  const receipts = committed.parent.receipts;
  const hash = receipts[0].receiptHash;

  for (const surface of ["pocket", "workbench", "drafting", "stage"]) {
    const opened = openOn(committed.parent, surface, {
      tab: surface,
      viewport: "browser-layout",
      lastViewed: surface,
    });
    assert.equal(opened.consequential, false);
    assert.equal(opened.receipt, null);
    assert.equal(opened.thing.thingId, THING_ID);
    assert.equal(opened.thing, committed.parent);
    assert.equal(opened.view.presentation.viewport, "browser-layout");
  }

  assert.equal(committed.parent.thingId, THING_ID);
  assert.equal(committed.parent.receipts, receipts);
  assert.equal(committed.parent.receipts.length, 1);
  assert.equal(committed.parent.receipts[0].receiptHash, hash);
  assert.equal(committed.parent.descendants.length, 1);
  assert.equal(CONVERSION_ROUTE, "SIMULATED");
  assert.equal(AUTHORIZATION_KIND, "DEMO-ONLY");
});
