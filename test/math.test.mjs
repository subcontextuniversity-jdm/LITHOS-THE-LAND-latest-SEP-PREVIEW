import test from "node:test";
import assert from "node:assert/strict";
import {
  ROLES,
  accumulateWeight,
  identityLaw,
  mayKnot,
  nextPull,
  receiptHash,
  resetWeight,
  rolesAreDisjoint,
  splitSubjects,
} from "../src/math.mjs";
import { canonicalize } from "../src/canonical.mjs";

test("cursor and node roles are disjoint; only cursor may knot", () => {
  assert.equal(mayKnot(ROLES.CURSOR), true);
  assert.equal(mayKnot(ROLES.GATOR), false);
  assert.equal(mayKnot(ROLES.SENTINEL), false);
  assert.equal(rolesAreDisjoint(ROLES.CURSOR, ROLES.GATOR), true);
  assert.equal(rolesAreDisjoint(ROLES.GATOR, ROLES.GATOR), false);
  assert.equal(splitSubjects({ role: ROLES.GATOR }, { role: ROLES.SENTINEL }).ok, false);
});

test("identity is not the hash of current bytes", () => {
  const law = identityLaw({
    thingId: "THING://0041",
    representations: [{ contentHash: "aaa" }, { contentHash: "bbb" }],
  });
  assert.equal(law.thingId, "THING://0041");
  assert.equal(law.identityIsNotContent, true);
  assert.deepEqual(law.representationHashes, ["aaa", "bbb"]);
});

test("weight accumulates, never resets, and changes the next pull", () => {
  const scar = {
    id: "scar-overhang",
    learning: "requires support",
    requires: ["require_support"],
  };
  const once = accumulateWeight([], scar);
  const twice = accumulateWeight(once, scar);
  assert.equal(once.length, 1);
  assert.equal(twice.length, 1);
  assert.equal(resetWeight().ok, false);
  const pull = nextPull(["attempt_make", "read_thing"], once);
  assert.deepEqual(pull.required, ["require_support"]);
  assert.equal(pull.changed, true);
  assert.ok(pull.grants.includes("attempt_make"));
});

test("RFC 8785 canonicalization is order-insensitive", async () => {
  assert.equal(canonicalize({ b: 1, a: 2 }), '{"a":2,"b":1}');
  const left = await receiptHash({ human: "josh", place: "bench" });
  const right = await receiptHash({ place: "bench", human: "josh" });
  assert.equal(left, right);
  assert.equal(canonicalize({ z: true, a: false }), '{"a":false,"z":true}');
});
