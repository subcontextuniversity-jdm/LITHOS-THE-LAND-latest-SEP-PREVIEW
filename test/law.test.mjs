import test from "node:test";
import assert from "node:assert/strict";
import {
  VISUAL_GRAMMAR_06,
  GRAMMAR,
  PLACE,
  WORKER,
  bindHuman,
  seedThing,
  grantScope,
  pullGoldenCord,
  proposeRemix,
  inspectLineage,
  attemptMake,
  tieKnot,
  applyRemix,
  carryHome,
  writeReceipt,
  workerMayNotTieKnot,
} from "../src/law.mjs";

test("visual grammar 06 is locked", () => {
  assert.equal(
    VISUAL_GRAMMAR_06,
    `The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.`,
  );
});

test("cursor requires a human name", () => {
  assert.equal(bindHuman("  ").ok, false);
  assert.equal(bindHuman("Josh").human.role, "CURSOR");
  assert.equal(GRAMMAR.CURSOR, "human");
});

test("golden cord cannot be pulled", () => {
  const result = pullGoldenCord();
  assert.equal(result.ok, false);
  assert.equal(result.rejected, true);
  assert.equal(result.message, "DON'T PULL THE GOLDEN CORD.");
});

test("scope rejects sovereignty and the golden cord", () => {
  const human = bindHuman("Ada").human;
  const thing = seedThing();
  const denied = grantScope({
    human,
    place: PLACE,
    thing,
    worker: WORKER,
    grants: ["sovereignty"],
  });
  assert.equal(denied.ok, false);
  const cord = grantScope({
    human,
    place: PLACE,
    thing,
    worker: WORKER,
    grants: ["golden_cord"],
  });
  assert.equal(cord.ok, false);
});

test("worker cannot tie the knot", () => {
  const result = workerMayNotTieKnot();
  assert.equal(result.ok, false);
  const human = bindHuman("Josh").human;
  assert.equal(tieKnot(null, "print-flat").ok, false);
  assert.equal(tieKnot(human, "print-flat").ok, true);
});

test("remix proposals change as weight accumulates", async () => {
  const human = bindHuman("Josh").human;
  const thing = seedThing();
  const granted = grantScope({
    human,
    place: PLACE,
    thing,
    worker: WORKER,
    grants: ["read_lineage", "propose_remix", "write_receipt", "attempt_make"],
  });
  assert.equal(granted.ok, true);

  const first = proposeRemix(thing, granted.scope, { human, place: PLACE, thing, worker: WORKER });
  assert.equal(first.ok, true);
  assert.ok(first.proposals.some((item) => item.id === "wider-jaw"));
  assert.ok(!first.proposals.some((item) => item.id === "receipt-clip"));

  const remixed = applyRemix(
    thing,
    first.proposals.find((item) => item.id === "print-flat"),
    human,
  );
  const second = proposeRemix(remixed, granted.scope, {
    human,
    place: PLACE,
    thing: remixed,
    worker: WORKER,
  });
  assert.ok(second.proposals.some((item) => item.id === "receipt-clip"));
  assert.ok(!second.proposals.some((item) => item.id === "wider-jaw"));
});

test("make fails if the overhang scar is ignored, then succeeds after the knot", () => {
  const human = bindHuman("Josh").human;
  const thing = seedThing();
  thing.lineage = thing.lineage.filter((entry) => !/prints flat|split/i.test(entry.event));
  const granted = grantScope({
    human,
    place: PLACE,
    thing,
    worker: WORKER,
    grants: ["attempt_make", "leave_scar", "write_receipt"],
  });

  const failed = attemptMake(thing, granted.scope, { human, place: PLACE, thing, worker: WORKER });
  assert.equal(failed.succeeded, false);
  assert.ok(failed.thing.weight > thing.weight);
  assert.ok(failed.thing.scars.length > thing.scars.length);

  const addressed = applyRemix(
    failed.thing,
    { id: "print-flat", title: "Keep the jaw split. Print it flat." },
    human,
  );
  const passed = attemptMake(addressed, granted.scope, {
    human,
    place: PLACE,
    thing: addressed,
    worker: WORKER,
  });
  assert.equal(passed.succeeded, true);
});

test("receipt proves human, place, worker, scope, action", async () => {
  const human = bindHuman("Josh").human;
  const thing = seedThing();
  const granted = grantScope({
    human,
    place: PLACE,
    thing,
    worker: WORKER,
    grants: ["write_receipt"],
  });
  const carried = carryHome(thing, human);
  const written = await writeReceipt({
    human,
    place: PLACE,
    worker: WORKER,
    scope: granted.scope,
    action: "CARRY",
    result: { thingId: carried.id, carried: true },
  });
  assert.equal(written.ok, true);
  assert.match(written.receipt.id, /^rcp-[a-f0-9]{12}$/);
  assert.equal(written.receipt.hash.length, 64);
  assert.equal(written.receipt.human.name, "Josh");
  assert.equal(written.receipt.place.id, "bench");
  assert.deepEqual(written.receipt.scope.grants, ["write_receipt"]);
});

test("widening the jaw reopens the overhang scar", () => {
  const human = bindHuman("Josh").human;
  const thing = applyRemix(seedThing(), { id: "wider-jaw", title: "Widen the jaw for 25mm webbing." }, human);
  const granted = grantScope({
    human,
    place: PLACE,
    thing,
    worker: WORKER,
    grants: ["attempt_make", "leave_scar", "write_receipt"],
  });
  const failed = attemptMake(thing, granted.scope, { human, place: PLACE, thing, worker: WORKER });
  assert.equal(failed.succeeded, false);
  assert.match(failed.message, /scar stays/i);
});

test("inspecting lineage without a grant is refused", () => {
  const human = bindHuman("Josh").human;
  const thing = seedThing();
  const granted = grantScope({
    human,
    place: PLACE,
    thing,
    worker: WORKER,
    grants: ["write_receipt"],
  });
  const peek = inspectLineage(thing, granted.scope, {
    human,
    place: PLACE,
    thing,
    worker: WORKER,
  });
  assert.equal(peek.ok, false);
});
