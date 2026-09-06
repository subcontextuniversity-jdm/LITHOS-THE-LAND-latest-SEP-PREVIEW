import { BINDING_RULES, EDGE_RULES, GLYPH_RULES } from "./rules";
import type {
  BindingError,
  EdgeKind,
  EntityType,
  GlyphDefinition,
  RescopeEntity,
} from "./types";

export function allowedChildTypes(parentType: EntityType): readonly EntityType[] {
  return BINDING_RULES[parentType];
}

export function glyphAllowedFor(type: EntityType, glyph: GlyphDefinition): boolean {
  return glyph.categories.some((category) => GLYPH_RULES[type].includes(category));
}

export function lessonFor(parentType: EntityType, childType: EntityType): string {
  if (parentType === "PLACE" && childType === "ACTION") {
    return [
      "Actions operate on Things or Connectors.",
      "They do not become children of Place boundaries.",
    ].join("\n");
  }

  if (parentType === "TRACE") {
    return "TRACE is time. It does not contain further children in this grammar.";
  }

  const expected = allowedChildTypes(parentType);
  if (expected.length === 0) {
    return `${parentType} does not take children.`;
  }

  return `${childType} is not a legal child of ${parentType}. Expected: ${expected.join(", ")}.`;
}

export function inspectBinding(
  parent: RescopeEntity,
  child: RescopeEntity,
  kind: EdgeKind = "CONTAINS",
): { ok: true } | { ok: false; error: BindingError } {
  if (kind !== "CONTAINS") {
    return { ok: true };
  }

  const allowed = allowedChildTypes(parent.type);
  if (allowed.includes(child.type)) {
    return { ok: true };
  }

  return {
    ok: false,
    error: {
      code: "TYPE_ERROR",
      parent: { id: parent.id, type: parent.type, name: parent.name },
      child: { id: child.id, type: child.type, name: child.name },
      expected: allowed,
      lesson: lessonFor(parent.type, child.type),
    },
  };
}

export function assertBinding(
  parent: RescopeEntity,
  child: RescopeEntity,
  kind: EdgeKind = "CONTAINS",
): void {
  const verdict = inspectBinding(parent, child, kind);
  if (verdict.ok) return;

  const expected =
    verdict.error.expected.length > 0
      ? verdict.error.expected.join(", ")
      : "(none)";

  throw new Error(
    `TYPE ERROR: Cannot bind ${child.type} to ${parent.type}. Expected: ${expected}.`,
  );
}

export function assertEdgeKind(kind: EdgeKind): void {
  if (!(kind in EDGE_RULES)) {
    throw new Error(`Unknown edge kind: ${String(kind)}`);
  }
}

export function formatTypeError(error: BindingError): string {
  return [
    `${error.child.name} is an ${error.child.type}.`,
    `${error.parent.name} is a ${error.parent.type}.`,
    error.lesson,
  ].join("\n");
}
