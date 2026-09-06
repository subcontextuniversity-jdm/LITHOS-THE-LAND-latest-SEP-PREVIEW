/**
 * RFC 8785 JSON Canonicalization Scheme (JCS), sufficient for LITHOS receipt
 * payloads: objects, arrays, strings, finite numbers, booleans, and null.
 * SHA-256 of this encoding is an integrity digest, not a digital signature.
 */
export const CANONICALIZATION = "RFC 8785";

export function canonicalize(value) {
  if (value === null) return "null";
  const type = typeof value;
  if (type === "boolean") return value ? "true" : "false";
  if (type === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("RFC 8785 rejects non-finite numbers.");
    }
    return JSON.stringify(value);
  }
  if (type === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  }
  if (type === "object") {
    const keys = Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  }
  throw new Error(`Cannot canonicalize ${type}.`);
}
