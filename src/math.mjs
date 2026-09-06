import { canonicalize } from "./canonical.mjs";
import { sha256 } from "./hash.mjs";

export const AUTHORIZATION_KIND = "DEMO-ONLY";
export const LEDGER_PERSISTENCE = "IN-MEMORY";

export const ROLES = Object.freeze({
  CURSOR: "CURSOR",
  GATOR: "GATOR",
  SENTINEL: "SENTINEL",
});

const KNOT_ROLES = new Set([ROLES.CURSOR]);
const NODE_ROLES = new Set([ROLES.GATOR, ROLES.SENTINEL]);

export function isCursor(role) {
  return role === ROLES.CURSOR;
}

export function isNode(role) {
  return NODE_ROLES.has(role);
}

export function mayKnot(role) {
  return KNOT_ROLES.has(role);
}

export function rolesAreDisjoint(a, b) {
  if (a === b) return false;
  const pair = new Set([a, b]);
  return pair.has(ROLES.CURSOR) && [...pair].some((role) => NODE_ROLES.has(role));
}

/**
 * Identity is not the hash of the current bytes.
 * thingId stays. Representation hashes move.
 */
export function identityLaw(thing) {
  return Object.freeze({
    thingId: thing.thingId,
    representationHashes: (thing.representations ?? []).map((item) => item.contentHash),
    identityIsNotContent: true,
  });
}

/**
 * Weight is a set of constraints indexed by scar.
 * It is never reset. Duplicate scars do not double-count.
 */
export function accumulateWeight(weight, scar) {
  const current = Array.isArray(weight) ? weight : [];
  if (current.some((item) => item.scarId === scar.id)) {
    return Object.freeze([...current]);
  }
  return Object.freeze([
    ...current,
    Object.freeze({
      scarId: scar.id,
      learning: scar.learning,
      changesNextPull: true,
      blocks: Object.freeze([...(scar.blocks ?? [])]),
      requires: Object.freeze([...(scar.requires ?? [])]),
    }),
  ]);
}

export function resetWeight() {
  return {
    ok: false,
    error: "Weight is consequence. It is not reset.",
  };
}

/**
 * Memory changes the next pull: grants that scars block are removed;
 * required grants are demanded before work proceeds.
 */
export function nextPull(grants, weight) {
  const blocked = new Set((weight ?? []).flatMap((item) => item.blocks ?? []));
  const required = [...new Set((weight ?? []).flatMap((item) => item.requires ?? []))];
  const allowed = (grants ?? []).filter((grant) => !blocked.has(grant));
  return Object.freeze({
    grants: Object.freeze(allowed),
    required: Object.freeze(required),
    changed: blocked.size > 0 || required.length > 0,
  });
}

export async function receiptHash(payload) {
  return sha256(canonicalize(payload));
}

export async function contentHash(bytes) {
  return sha256(typeof bytes === "string" ? bytes : canonicalize(bytes));
}

export function splitSubjects(human, node) {
  if (!isCursor(human?.role)) {
    return { ok: false, error: "CURSOR = HUMAN. The left chamber is for a person." };
  }
  if (!isNode(node?.role)) {
    return { ok: false, error: "TALON = CAPABILITY. The right chamber is for a node." };
  }
  if (!rolesAreDisjoint(human.role, node.role)) {
    return { ok: false, error: "Split gate requires disjoint subject kinds." };
  }
  if (mayKnot(node.role)) {
    return { ok: false, error: "A node cannot inhabit knot authority." };
  }
  return { ok: true };
}
