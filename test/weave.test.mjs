import test from "node:test";
import assert from "node:assert/strict";
import {
  LIBRARY_NOUNS,
  seedLibrary,
  selectForWeave,
  adaPropose,
  adaMayNotTieKnot,
  pullWeaveKnot,
  greeting,
  refuseGoldenCordFromLibrary,
} from "../src/weave.mjs";

test("library is not files", () => {
  assert.equal(LIBRARY_NOUNS.FILES, "where bytes live");
  assert.equal(LIBRARY_NOUNS.LIBRARY, "what I have");
  assert.equal(LIBRARY_NOUNS.TREE, "how it belongs");
  assert.equal(LIBRARY_NOUNS.THREADS, "what it relates to");
  assert.equal(LIBRARY_NOUNS.STAGE, "where I work with it");
  assert.equal(LIBRARY_NOUNS.ADA, "how I compose something new");
});

test("weave needs two or three Things from the library", () => {
  const library = seedLibrary();
  assert.equal(selectForWeave(["cover-vigil"], library).ok, false);
  assert.equal(selectForWeave(["cover-vigil", "thing-0041"], library).ok, true);
  assert.equal(
    selectForWeave(["cover-vigil", "thing-0041", "audio-vigil"], library).ok,
    true,
  );
  assert.equal(
    selectForWeave(["cover-vigil", "thing-0041", "audio-vigil", "sketch-jaw"], library).ok,
    false,
  );
});

test("ADA proposes and cannot tie the knot", () => {
  const library = seedLibrary();
  const { selection } = selectForWeave(
    ["cover-vigil", "thing-0041", "audio-vigil"],
    library,
  );
  const proposed = adaPropose(selection);
  assert.equal(proposed.ok, true);
  assert.deepEqual(
    proposed.proposals.map((item) => item.label),
    ["PATTERN", "SCREEN", "PLACE"],
  );
  assert.equal(adaMayNotTieKnot().ok, false);
  assert.equal(pullWeaveKnot(null, selection, proposed.proposals[0]).ok, false);
});

test("human knot creates a new Thing with parent lineage", () => {
  const human = { id: "human-josh", name: "Josh" };
  const library = seedLibrary();
  const { selection } = selectForWeave(
    ["cover-vigil", "thing-0041", "audio-vigil"],
    library,
  );
  const proposed = adaPropose(selection);
  const screen = proposed.proposals.find((item) => item.id === "screen");
  const woven = pullWeaveKnot(human, selection, screen);
  assert.equal(woven.ok, true);
  assert.equal(woven.thing.emoji, "🪡");
  assert.equal(woven.thing.parents.length, 3);
  assert.ok(woven.thing.parents.includes("THING://0041"));
  assert.equal(woven.thing.note, "Human made something.");
});

test("afternoon greeting uses the exact overlay mark", () => {
  const afternoon = new Date(2026, 8, 6, 15, 0, 0);
  assert.equal(greeting(afternoon), "Good afternoon ◡");
});

test("library still cannot pull the golden cord", () => {
  const refused = refuseGoldenCordFromLibrary();
  assert.equal(refused.message, "DON'T PULL THE GOLDEN CORD.");
});
