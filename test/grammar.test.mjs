import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { VISUAL_GRAMMAR_06, GRAMMAR, STACK_SPINE, grammarCorrespondence } from "../src/grammar.mjs";

const LOCKED = `The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.
`;

test("visual grammar 06 is locked and not rewritten", () => {
  assert.equal(VISUAL_GRAMMAR_06, LOCKED.trimEnd());
  const file = readFileSync(new URL("../canon/VISUAL-GRAMMAR-06.txt", import.meta.url), "utf8");
  assert.equal(file.replace(/\n$/, ""), VISUAL_GRAMMAR_06);
  assert.equal(grammarCorrespondence().lockedVisualGrammar, "06");
  assert.deepEqual(grammarCorrespondence().inventedVisualGrammars, []);
});

test("grammar terms match the public handoff", () => {
  assert.equal(GRAMMAR.THREAD, "relationship");
  assert.equal(GRAMMAR.GLYPH, "boundary");
  assert.equal(GRAMMAR.SCAR, "learning");
  assert.equal(GRAMMAR.WEIGHT, "memory");
  assert.equal(GRAMMAR.KNOT, "decision");
  assert.equal(GRAMMAR.CURSOR, "human");
  assert.equal(GRAMMAR.TALON, "capability");
  assert.equal(GRAMMAR.ADA, "composition");
});

test("stack spine order is lore through humans", () => {
  assert.deepEqual(
    STACK_SPINE.map((item) => item.layer),
    ["LORE", "LAW", "MATH", "CODE", "NODES", "HASHES", "RECEIPTS", "HUMANS"],
  );
  assert.equal(STACK_SPINE[4].verb, "execute");
});
