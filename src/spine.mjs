import { PATH, STACK_SPINE, VISUAL_GRAMMAR_06 } from "./grammar.mjs";
import { DEEPEST_THESIS } from "./thesis.mjs";
import { AUTHORIZATION_KIND, LEDGER_PERSISTENCE, receiptHash } from "./math.mjs";
import { GATOR_GRANTS, PLACE, loginNewest } from "./airlock.mjs";
import { execute, gatorTieKnot } from "./gator.mjs";
import { applyWeight, attest, mapPast, sentinelExecute } from "./sentinel.mjs";

export const STACK_STATUS = Object.freeze({
  conversion: "ABSENT-HERE",
  authorization: AUTHORIZATION_KIND,
  ledger: LEDGER_PERSISTENCE,
  networkNodes: "ABSENT",
  passport: "ABSENT",
  nativeApps: "ABSENT",
});

export function seedThing0041() {
  return {
    thingId: "THING://0041",
    origin: Object.freeze({
      application: "Blender",
      inspectable: true,
      at: "2016-2017",
      place: "Caloundra lineage, Thingiverse commons",
    }),
    representations: Object.freeze([
      Object.freeze({ kind: "blend", label: "model.blend", contentHash: null }),
    ]),
    trace: [],
    scars: [],
    weight: [],
    threads: Object.freeze([{ kind: "origin", to: "commons" }]),
  };
}

export async function runLoginNewest({ name = "Josh", failFirst = true } = {}) {
  const thing0 = seedThing0041();

  const gatorIn = loginNewest({ name, nodeKind: "GATOR", thing: thing0 });
  if (!gatorIn.ok) return gatorIn;
  const sentinelIn = loginNewest({ name, nodeKind: "SENTINEL", thing: thing0 });
  if (!sentinelIn.ok) return sentinelIn;

  if (gatorIn.session.human.id !== sentinelIn.session.human.id) {
    return { ok: false, error: "Split gate produced two humans. The airlock is broken." };
  }

  const first = execute(gatorIn.session, thing0, {
    kind: "attempt_make",
    grant: "attempt_make",
    fail: failFirst ? "Overhang on the jaw collapsed." : null,
    learning: "Print the jaw split, then assemble. Future fabrication requires support.",
    scarId: "scar-overhang",
    blocks: [],
    requires: failFirst ? ["require_support"] : [],
    note: "first make",
  });

  const afterWork = first.thing ?? thing0;
  const mapped = mapPast(sentinelIn.session, afterWork);
  if (!mapped.ok) return mapped;

  let weightedThing = afterWork;
  let weightResult = null;
  if (first.scar) {
    weightResult = applyWeight(sentinelIn.session, afterWork, first.scar);
    if (!weightResult.ok) return weightResult;
    weightedThing = weightResult.thing;
  }

  const attestation = attest(sentinelIn.session, gatorIn.session, first);
  if (!attestation.ok) return attestation;

  const nextGator = loginNewest({
    name,
    nodeKind: "GATOR",
    thing: weightedThing,
  });
  if (!nextGator.ok) return nextGator;

  const blockedRetry = execute(nextGator.session, weightedThing, {
    kind: "attempt_make",
    grant: "attempt_make",
    note: "retry without support",
  });

  const supportedLogin = loginNewest({
    name,
    nodeKind: "GATOR",
    thing: weightedThing,
    grants: [...GATOR_GRANTS, "require_support"],
  });
  if (!supportedLogin.ok) return supportedLogin;

  const supportedRetry = execute(supportedLogin.session, weightedThing, {
    kind: "attempt_make",
    grant: "attempt_make",
    note: "retry with support after weight",
  });

  const knot = {
    ok: true,
    by: gatorIn.session.human.id,
    role: "CURSOR",
    decision: "KNOT",
    note: "Human committed after the scar was mapped, not carried.",
  };

  const payload = {
    airlock: "JDM-AIRLOCK",
    login: "LOGIN-NEWEST",
    gate: "SPLIT",
    human: gatorIn.session.human.id,
    place: PLACE.id,
    thing: weightedThing.thingId,
    gator: gatorIn.session.node.id,
    sentinel: sentinelIn.session.node.id,
    decision: "KNOT",
    scar: first.scar?.id ?? null,
    authorization: AUTHORIZATION_KIND,
  };
  const hash = await receiptHash(payload);

  return {
    ok: true,
    thesis: DEEPEST_THESIS,
    grammar: VISUAL_GRAMMAR_06,
    spine: STACK_SPINE,
    path: PATH,
    status: STACK_STATUS,
    human: gatorIn.session.human,
    gator: gatorIn.session,
    sentinel: sentinelIn.session,
    first,
    mapped,
    weightResult,
    attestation,
    nextPull: nextGator.session.scope,
    blockedRetry,
    supportedRetry,
    gatorMayNotKnot: gatorTieKnot(),
    sentinelMayNotExecute: sentinelExecute(),
    knot,
    receipt: {
      id: `RECEIPT://${hash.slice(0, 12)}`,
      receiptHash: hash,
      payload,
      persistence: LEDGER_PERSISTENCE,
    },
    home: {
      thingId: weightedThing.thingId,
      scarsVisible: (weightedThing.scars ?? []).length > 0,
      weightNotReset: (weightedThing.weight ?? []).length > 0,
      carriedForHuman: mapped.carriedForHuman,
    },
  };
}

export function stackIndex() {
  return {
    thesis: DEEPEST_THESIS,
    spine: STACK_SPINE,
    path: PATH,
    status: STACK_STATUS,
    folders: [
      "spine/",
      "airlock/",
      "nodes/gator/",
      "nodes/sentinel/",
      "nodes/noded-work/",
      "history/",
      "grammar/",
      "math/",
      "canon/",
      "src/",
      "test/",
    ],
  };
}
