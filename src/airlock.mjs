import { GOLDEN_CORD, PATH } from "./grammar.mjs";
import {
  AUTHORIZATION_KIND,
  LEDGER_PERSISTENCE,
  ROLES,
  isCursor,
  nextPull,
} from "./math.mjs";
import { fuseGate, splitGate } from "./split-gate.mjs";

export const AIRLOCK_ID = "JDM-AIRLOCK";
export const LOGIN_KIND = "LOGIN-NEWEST";
export const AUTH_STATUS = "DEMO-ONLY";
export const PASSPORT_STATUS = "ABSENT";

export const PLACE = Object.freeze({
  id: "bench",
  name: "THE BENCH",
  kind: "workshop",
  where: "A maker place. Not an application.",
});

export const FORBIDDEN_GRANTS = Object.freeze([
  "tie_knot",
  "sovereignty",
  "golden_cord",
  "reset_weight",
  "erase_scar",
  "become_cursor",
  "carry_past_for_human",
]);

export const GATOR_GRANTS = Object.freeze([
  "read_thing",
  "read_lineage",
  "propose_remix",
  "attempt_make",
  "leave_scar",
  "write_receipt",
  "carry_within_place",
  "execute_within_scope",
]);

export const SENTINEL_GRANTS = Object.freeze([
  "read_thing",
  "read_lineage",
  "watch",
  "map_past",
  "apply_weight",
  "attest_scope",
  "refuse_glyph",
]);

function slug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function arrive(name) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) {
    return { ok: false, error: "CURSOR = HUMAN. A name is required at the airlock." };
  }
  return {
    ok: true,
    airlock: AIRLOCK_ID,
    human: Object.freeze({
      id: `human-${slug(trimmed) || "cursor"}`,
      name: trimmed,
      role: ROLES.CURSOR,
    }),
  };
}

export function presentNode(kind, { id, name } = {}) {
  const role = String(kind ?? "").toUpperCase();
  if (role !== ROLES.GATOR && role !== ROLES.SENTINEL) {
    return { ok: false, error: "Only Gator or Sentinel may present at TALON_DOOR." };
  }
  const nodeId = id ?? `${role.toLowerCase()}-local`;
  return {
    ok: true,
    node: Object.freeze({
      id: nodeId,
      name: name ?? (role === ROLES.GATOR ? "GATOR" : "SENTINEL"),
      role,
      provider: "local",
      can:
        role === ROLES.GATOR
          ? Object.freeze([
              "propose",
              "search",
              "build",
              "route",
              "remember",
              "execute_within_scope",
              "carry_within_place",
            ])
          : Object.freeze(["watch", "map_past", "apply_weight", "attest_scope", "refuse_glyph"]),
      cannot: Object.freeze([
        "tie_knot",
        "acquire_sovereignty",
        "leave_place",
        "pull_golden_cord",
        "reset_weight",
        "erase_scar",
        "become_cursor",
        "carry_past_for_human",
        ...(role === ROLES.SENTINEL ? ["execute_within_scope"] : ["attest_scope"]),
      ]),
    }),
  };
}

export function equalize({ human, node, place, thing, grants }) {
  if (!isCursor(human?.role)) {
    return { ok: false, error: "Airlock will not equalize without a human." };
  }
  const gate = splitGate({ human, node });
  if (!gate.ok) return gate;

  if (!place?.id) {
    return { ok: false, error: "Where does this belong?" };
  }
  if (!thing?.thingId) {
    return { ok: false, error: "Which Thing is being touched?" };
  }

  const defaultGrants = node.role === ROLES.GATOR ? GATOR_GRANTS : SENTINEL_GRANTS;
  const requested = [...new Set(grants ?? defaultGrants)];
  const illegal = requested.filter((id) => FORBIDDEN_GRANTS.includes(id));
  if (illegal.length) {
    return { ok: false, error: "GLYPH rejected.", illegal };
  }

  const weighted = nextPull(requested, thing.weight ?? []);

  return {
    ok: true,
    login: LOGIN_KIND,
    authorization: AUTHORIZATION_KIND,
    persistence: LEDGER_PERSISTENCE,
    passport: PASSPORT_STATUS,
    airlock: AIRLOCK_ID,
    fused: false,
    path: PATH,
    session: Object.freeze({
      id: `${AIRLOCK_ID}/${human.id}/${node.id}`,
      human,
      node,
      place,
      thingId: thing.thingId,
      gate,
      scope: Object.freeze({
        humanId: human.id,
        placeId: place.id,
        thingId: thing.thingId,
        workerId: node.id,
        grants: weighted.grants,
        required: weighted.required,
        grantedAt: Date.now(),
      }),
    }),
  };
}

export function loginNewest({ name, nodeKind, place = PLACE, thing, grants }) {
  const humanIn = arrive(name);
  if (!humanIn.ok) return humanIn;
  const nodeIn = presentNode(nodeKind);
  if (!nodeIn.ok) return nodeIn;
  return equalize({
    human: humanIn.human,
    node: nodeIn.node,
    place,
    thing,
    grants,
  });
}

export function pullGoldenCord() {
  return { ok: false, rejected: true, code: "GOLDEN_CORD", message: GOLDEN_CORD };
}

export function refuseFusedLogin() {
  return fuseGate();
}
