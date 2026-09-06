import { ROLES, accumulateWeight } from "./math.mjs";

export function assertGator(session, grantId) {
  if (!session?.node || session.node.role !== ROLES.GATOR) {
    return { ok: false, error: "Gator work requires a Gator session." };
  }
  if (session.human?.id !== session.scope?.humanId) {
    return { ok: false, error: "This scope is not yours." };
  }
  if (grantId && !session.scope.grants.includes(grantId)) {
    return { ok: false, error: `Out of scope: ${grantId}.` };
  }
  const missing = (session.scope.required ?? []).filter(
    (id) => !session.scope.grants.includes(id),
  );
  if (missing.length) {
    return {
      ok: false,
      error: "Weight changed the next pull. Required grants are missing.",
      missing,
    };
  }
  return { ok: true };
}

export function gatorTieKnot() {
  return {
    ok: false,
    error: "KNOT = DECISION. Gator can execute within scope. The human ties the knot.",
  };
}

export function gatorLeavePlace() {
  return { ok: false, error: "Worker may not leave the place." };
}

export function gatorAcquireSovereignty() {
  return { ok: false, error: "Providers supply capability, never sovereignty." };
}

function freezeEvent(entry) {
  return Object.freeze({ ...entry, at: entry.at ?? Date.now() });
}

export function execute(session, thing, action) {
  const scoped = assertGator(session, action.grant ?? "execute_within_scope");
  if (!scoped.ok) return scoped;
  if (thing.thingId !== session.thingId) {
    return { ok: false, error: "Worker may not touch another Thing." };
  }
  if (action.kind === "tie_knot") return gatorTieKnot();
  if (action.kind === "leave_place") return gatorLeavePlace();
  if (action.kind === "sovereignty") return gatorAcquireSovereignty();

  const trace = freezeEvent({
    actor: session.node.id,
    role: ROLES.GATOR,
    kind: action.kind,
    grant: action.grant ?? "execute_within_scope",
    note: action.note ?? "bounded execute",
  });

  if (action.fail) {
    const scar = Object.freeze({
      id: action.scarId ?? `scar-${action.kind}`,
      event: action.fail,
      learning: action.learning ?? action.fail,
      blocks: Object.freeze([...(action.blocks ?? [])]),
      requires: Object.freeze([...(action.requires ?? [])]),
    });
    return {
      ok: false,
      executed: true,
      failed: true,
      thing: {
        ...thing,
        trace: [...(thing.trace ?? []), trace],
        scars: [...(thing.scars ?? []), scar],
      },
      scar,
      trace,
    };
  }

  return {
    ok: true,
    executed: true,
    thing: {
      ...thing,
      trace: [...(thing.trace ?? []), trace],
    },
    trace,
  };
}

export function carryWithinPlace(session, thing) {
  const scoped = assertGator(session, "carry_within_place");
  if (!scoped.ok) return scoped;
  if (thing.thingId !== session.thingId) {
    return { ok: false, error: "Worker may not touch another Thing." };
  }
  return {
    ok: true,
    carried: true,
    placeId: session.place.id,
    thingId: thing.thingId,
    note: "Carried inside the place. Not taken home as sovereignty.",
  };
}

export { accumulateWeight };
