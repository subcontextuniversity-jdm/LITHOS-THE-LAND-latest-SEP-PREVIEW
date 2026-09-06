import { VISUAL_GRAMMAR_06 } from "./grammar.mjs";
import { ROLES, accumulateWeight, resetWeight } from "./math.mjs";

export function assertSentinel(session, grantId) {
  if (!session?.node || session.node.role !== ROLES.SENTINEL) {
    return { ok: false, error: "Sentinel work requires a Sentinel session." };
  }
  if (grantId && !session.scope.grants.includes(grantId)) {
    return { ok: false, error: `Out of scope: ${grantId}.` };
  }
  return { ok: true };
}

export function sentinelExecute() {
  return {
    ok: false,
    error: "Deciders must not execute. Sentinel watches. Gator executes.",
  };
}

export function sentinelTieKnot() {
  return {
    ok: false,
    error: "KNOT = DECISION. Sentinel cannot tie the knot.",
  };
}

export function sentinelCarryPast() {
  return {
    ok: false,
    error: VISUAL_GRAMMAR_06.split("\n")[0],
    grammar: VISUAL_GRAMMAR_06,
  };
}

/**
 * Map the past. Do not attach it to the human as cargo.
 */
export function mapPast(session, thing) {
  const scoped = assertSentinel(session, "map_past");
  if (!scoped.ok) return scoped;
  if (thing.thingId !== session.thingId) {
    return { ok: false, error: "Sentinel may not map another Thing." };
  }
  return {
    ok: true,
    mapped: true,
    carriedForHuman: false,
    grammar: VISUAL_GRAMMAR_06,
    map: Object.freeze({
      thingId: thing.thingId,
      origin: thing.origin ?? null,
      trace: Object.freeze([...(thing.trace ?? [])]),
      scars: Object.freeze([...(thing.scars ?? [])]),
      weight: Object.freeze([...(thing.weight ?? [])]),
    }),
  };
}

export function applyWeight(session, thing, scar) {
  const scoped = assertSentinel(session, "apply_weight");
  if (!scoped.ok) return scoped;
  if (!scar?.id) {
    return { ok: false, error: "Scar is evidence. There is nothing to weigh." };
  }
  const weight = accumulateWeight(thing.weight ?? [], scar);
  return {
    ok: true,
    thing: {
      ...thing,
      weight,
    },
    weight,
    reset: resetWeight(),
  };
}

export function attest(session, gatorSession, work) {
  const scoped = assertSentinel(session, "attest_scope");
  if (!scoped.ok) return scoped;
  if (gatorSession?.node?.role !== ROLES.GATOR) {
    return { ok: false, error: "Sentinel attests Gator work, not itself." };
  }
  if (gatorSession.thingId !== session.thingId) {
    return { ok: false, error: "Sentinel and Gator are not on the same Thing." };
  }
  if (gatorSession.place?.id !== session.place?.id) {
    return { ok: false, error: "Sentinel and Gator are not in the same place." };
  }
  if (gatorSession.human?.id !== session.human?.id) {
    return { ok: false, error: "Sentinel and Gator do not share this human's scope." };
  }
  if (work?.ok === false && !work.executed) {
    return { ok: false, error: "Nothing to attest. Gator did not execute.", work };
  }
  return {
    ok: true,
    attested: true,
    gatorId: gatorSession.node.id,
    thingId: session.thingId,
    failed: Boolean(work?.failed),
    scarId: work?.scar?.id ?? null,
  };
}

export function refuseGlyph(session, grantId) {
  const scoped = assertSentinel(session, "refuse_glyph");
  if (!scoped.ok) return scoped;
  return {
    ok: true,
    refused: true,
    grantId,
    reason: "GLYPH = boundary. Sentinel keeps the node from crossing it.",
  };
}
