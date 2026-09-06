import { ROLES, isCursor, isNode, splitSubjects } from "./math.mjs";

export const CURSOR_DOOR = "CURSOR_DOOR";
export const TALON_DOOR = "TALON_DOOR";
export const GATE_KIND = "SPLIT";

export function presentAtDoor(subject, door) {
  if (door === CURSOR_DOOR) {
    if (!isCursor(subject?.role)) {
      return {
        ok: false,
        door,
        error: "CURSOR_DOOR refuses nodes. A Gator or Sentinel is not a person.",
      };
    }
    return { ok: true, door, subject };
  }
  if (door === TALON_DOOR) {
    if (!isNode(subject?.role)) {
      return {
        ok: false,
        door,
        error: "TALON_DOOR refuses humans. Capability is not a login as a person.",
      };
    }
    return { ok: true, door, subject };
  }
  return { ok: false, error: "Unknown door." };
}

/**
 * One crossing. Two chambers. Same credential cannot occupy both.
 */
export function splitGate({ human, node }) {
  const split = splitSubjects(human, node);
  if (!split.ok) return split;

  const left = presentAtDoor(human, CURSOR_DOOR);
  if (!left.ok) return left;
  const right = presentAtDoor(node, TALON_DOOR);
  if (!right.ok) return right;

  if (human.id && node.id && human.id === node.id) {
    return {
      ok: false,
      error: "One subject cannot occupy both chambers. The gate is split.",
    };
  }

  if (node.role === ROLES.CURSOR) {
    return { ok: false, error: "TALON_DOOR will not admit CURSOR." };
  }

  return {
    ok: true,
    kind: GATE_KIND,
    left: Object.freeze({ door: CURSOR_DOOR, role: human.role, id: human.id }),
    right: Object.freeze({ door: TALON_DOOR, role: node.role, id: node.id }),
    fused: false,
  };
}

export function fuseGate() {
  return {
    ok: false,
    error: "The gate stays split. Decider and executor do not become one subject.",
  };
}
