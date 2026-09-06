import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { VISUAL_GRAMMAR_06 } from "../src/law.mjs";

const tree = readFileSync(new URL("../canon/THE-GOLDEN-TREE.md", import.meta.url), "utf8");

test("public handoff 001 is THE GOLDEN TREE", () => {
  assert.match(tree, /PUBLIC HANDOFF 001/);
  assert.match(tree, /THE GOLDEN TREE/);
  assert.match(tree, /LITHOS\/\/THE LAND/);
  assert.match(tree, /WORLD TREE: GERMINATING/);
  assert.match(tree, /CONNECTION SPEED: 56K/);
});

test("the golden cord is not pulled", () => {
  assert.match(tree, /DON'T PULL THE GOLDEN CORD/);
  assert.match(tree, /Providers supply capability, never sovereignty/);
  assert.match(tree, /Some are deliberately marked \*\*ABSENT\*\*/);
});

test("visual grammar 06 remains locked beside the tree", () => {
  assert.equal(
    VISUAL_GRAMMAR_06,
    `The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.`,
  );
});
