import test from "node:test";
import assert from "node:assert/strict";
import { loginNewest } from "../src/airlock.mjs";
import {
  carryWithinPlace,
  execute,
  gatorAcquireSovereignty,
  gatorLeavePlace,
  gatorTieKnot,
} from "../src/gator.mjs";
import { seedThing0041 } from "../src/spine.mjs";

test("gator executes in scope and cannot knot, leave, or own", () => {
  const thing = seedThing0041();
  const gator = loginNewest({ name: "Josh", nodeKind: "GATOR", thing });
  const work = execute(gator.session, thing, {
    kind: "propose_remix",
    grant: "propose_remix",
    note: "bounded propose",
  });
  assert.equal(work.ok, true);
  assert.equal(work.thing.thingId, "THING://0041");
  assert.equal(work.thing.trace[0].role, "GATOR");
  assert.equal(gatorTieKnot().ok, false);
  assert.equal(gatorLeavePlace().ok, false);
  assert.equal(gatorAcquireSovereignty().ok, false);
  assert.equal(execute(gator.session, thing, { kind: "tie_knot" }).ok, false);
});

test("gator may not touch another Thing or carry it out of place", () => {
  const thing = seedThing0041();
  const gator = loginNewest({ name: "Josh", nodeKind: "GATOR", thing });
  const other = { ...thing, thingId: "THING://9999" };
  assert.equal(execute(gator.session, other, { kind: "propose_remix", grant: "propose_remix" }).ok, false);
  const carried = carryWithinPlace(gator.session, thing);
  assert.equal(carried.ok, true);
  assert.equal(carried.placeId, "bench");
});
