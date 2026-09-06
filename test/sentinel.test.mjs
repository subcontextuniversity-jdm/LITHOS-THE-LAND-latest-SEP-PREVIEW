import test from "node:test";
import assert from "node:assert/strict";
import { VISUAL_GRAMMAR_06 } from "../src/grammar.mjs";
import { loginNewest } from "../src/airlock.mjs";
import { execute } from "../src/gator.mjs";
import {
  applyWeight,
  attest,
  mapPast,
  sentinelCarryPast,
  sentinelExecute,
  sentinelTieKnot,
} from "../src/sentinel.mjs";
import { seedThing0041 } from "../src/spine.mjs";

test("sentinel maps the past and will not carry it", () => {
  const thing = seedThing0041();
  const sentinel = loginNewest({ name: "Josh", nodeKind: "SENTINEL", thing });
  const mapped = mapPast(sentinel.session, thing);
  assert.equal(mapped.ok, true);
  assert.equal(mapped.carriedForHuman, false);
  assert.equal(mapped.grammar, VISUAL_GRAMMAR_06);
  assert.equal(sentinelCarryPast().ok, false);
  assert.equal(sentinelExecute().ok, false);
  assert.equal(sentinelTieKnot().ok, false);
});

test("sentinel applies weight from a gator scar and attests the same place", () => {
  const thing = seedThing0041();
  const gator = loginNewest({ name: "Josh", nodeKind: "GATOR", thing });
  const sentinel = loginNewest({ name: "Josh", nodeKind: "SENTINEL", thing });
  const failed = execute(gator.session, thing, {
    kind: "attempt_make",
    grant: "attempt_make",
    fail: "Overhang on the jaw collapsed.",
    learning: "Print the jaw split, then assemble.",
    scarId: "scar-overhang",
    requires: ["require_support"],
  });
  assert.equal(failed.ok, false);
  assert.equal(failed.executed, true);
  const weighed = applyWeight(sentinel.session, failed.thing, failed.scar);
  assert.equal(weighed.ok, true);
  assert.equal(weighed.reset.ok, false);
  assert.equal(weighed.weight[0].scarId, "scar-overhang");
  const ok = attest(sentinel.session, gator.session, failed);
  assert.equal(ok.ok, true);
  assert.equal(ok.failed, true);
});
