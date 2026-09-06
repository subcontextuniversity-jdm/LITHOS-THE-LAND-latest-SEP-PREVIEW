import test from "node:test";
import assert from "node:assert/strict";
import { runLoginNewest } from "../src/spine.mjs";

test("gator and sentinel share the human and place without sharing knot authority", async () => {
  const proof = await runLoginNewest();
  assert.equal(proof.gator.human.id, proof.sentinel.human.id);
  assert.equal(proof.gator.place.id, proof.sentinel.place.id);
  assert.equal(proof.gator.node.role, "GATOR");
  assert.equal(proof.sentinel.node.role, "SENTINEL");
  assert.equal(proof.gator.node.cannot.includes("tie_knot"), true);
  assert.equal(proof.sentinel.node.cannot.includes("execute_within_scope"), true);
  assert.equal(proof.gator.node.cannot.includes("attest_scope"), true);
  assert.ok(proof.attestation.attested);
  assert.equal(proof.home.carriedForHuman, false);
});
