import test from "node:test";
import assert from "node:assert/strict";
import {
  DEEPEST_THESIS,
  DERIVATIONS,
  everythingElseCanBeDerivedFromThat,
} from "../src/thesis.mjs";

test("the deepest thesis is the stem", () => {
  assert.equal(
    DEEPEST_THESIS,
    "Intelligence should move through relationships without acquiring sovereignty over them.",
  );
  assert.equal(everythingElseCanBeDerivedFromThat(), true);
  assert.ok(DERIVATIONS.some((item) => item.id === "node-without-authority"));
  assert.ok(DERIVATIONS.some((item) => item.id === "handoff-003"));
});
