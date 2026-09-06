import test from "node:test";
import assert from "node:assert/strict";
import { WUKONG, seedThing0041, retargetThread, SKETCH_JAW } from "../src/identity.mjs";

const human = { id: "human-josh", name: "Josh", role: "CURSOR" };

test("WUKONG is transformation while preserving identity, not a subsystem", () => {
  assert.equal(WUKONG, "transformation while preserving identity");
});

test("only the human may retarget a thread", () => {
  const thing = seedThing0041();
  assert.equal(retargetThread(thing, "cover-vigil", SKETCH_JAW, null).ok, false);
  const changed = retargetThread(thing, "cover-vigil", SKETCH_JAW, human);
  assert.equal(changed.ok, true);
  assert.equal(changed.thing.thingId, "THING://0041");
  assert.ok(changed.thing.threads.some((item) => item.id === "sketch-jaw"));
  assert.ok(!changed.thing.threads.some((item) => item.id === "cover-vigil"));
  assert.equal(changed.derivative, null);
});
