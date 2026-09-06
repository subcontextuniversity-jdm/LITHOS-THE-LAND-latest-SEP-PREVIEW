import test from "node:test";
import assert from "node:assert/strict";
import { VISUAL_GRAMMAR_06 } from "../src/grammar.mjs";
import { DEEPEST_THESIS } from "../src/thesis.mjs";
import { runLoginNewest, stackIndex } from "../src/spine.mjs";

test("LOGIN-NEWEST noded work: scar stays, weight changes the next pull, human knots", async () => {
  const proof = await runLoginNewest({ name: "Josh", failFirst: true });
  assert.equal(proof.ok, true);
  assert.equal(proof.thesis, DEEPEST_THESIS);
  assert.equal(proof.grammar, VISUAL_GRAMMAR_06);
  assert.equal(proof.first.failed, true);
  assert.equal(proof.mapped.carriedForHuman, false);
  assert.equal(proof.home.scarsVisible, true);
  assert.equal(proof.home.weightNotReset, true);
  assert.deepEqual(proof.nextPull.required, ["require_support"]);
  assert.equal(proof.blockedRetry.ok, false);
  assert.equal(proof.supportedRetry.ok, true);
  assert.equal(proof.gatorMayNotKnot.ok, false);
  assert.equal(proof.sentinelMayNotExecute.ok, false);
  assert.equal(proof.knot.by, "human-josh");
  assert.equal(proof.receipt.payload.gate, "SPLIT");
  assert.equal(proof.receipt.payload.airlock, "JDM-AIRLOCK");
  assert.match(proof.receipt.receiptHash, /^[0-9a-f]{64}$/);
  assert.equal(proof.status.passport, "ABSENT");
  assert.equal(proof.status.networkNodes, "ABSENT");
});

test("stack index lists the sorted folders", () => {
  const index = stackIndex();
  assert.ok(index.folders.includes("nodes/gator/"));
  assert.ok(index.folders.includes("nodes/sentinel/"));
  assert.ok(index.folders.includes("airlock/"));
  assert.equal(index.spine.length, 8);
});
