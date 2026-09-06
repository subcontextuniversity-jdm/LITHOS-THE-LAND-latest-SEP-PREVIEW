import test from "node:test";
import assert from "node:assert/strict";
import { ROLES } from "../src/math.mjs";
import { CURSOR_DOOR, TALON_DOOR, fuseGate, presentAtDoor, splitGate } from "../src/split-gate.mjs";

const josh = { id: "human-josh", name: "Josh", role: ROLES.CURSOR };
const gator = { id: "gator-local", name: "GATOR", role: ROLES.GATOR };
const sentinel = { id: "sentinel-local", name: "SENTINEL", role: ROLES.SENTINEL };

test("split gate admits human left and node right", () => {
  const gate = splitGate({ human: josh, node: gator });
  assert.equal(gate.ok, true);
  assert.equal(gate.kind, "SPLIT");
  assert.equal(gate.fused, false);
  assert.equal(gate.left.door, CURSOR_DOOR);
  assert.equal(gate.right.door, TALON_DOOR);
});

test("nodes cannot enter the cursor door; humans cannot enter the talon door", () => {
  assert.equal(presentAtDoor(gator, CURSOR_DOOR).ok, false);
  assert.equal(presentAtDoor(josh, TALON_DOOR).ok, false);
  assert.equal(presentAtDoor(sentinel, CURSOR_DOOR).ok, false);
  assert.equal(splitGate({ human: gator, node: josh }).ok, false);
});

test("the same id cannot occupy both chambers; the gate will not fuse", () => {
  assert.equal(splitGate({ human: josh, node: { ...gator, id: josh.id } }).ok, false);
  assert.equal(fuseGate().ok, false);
});
