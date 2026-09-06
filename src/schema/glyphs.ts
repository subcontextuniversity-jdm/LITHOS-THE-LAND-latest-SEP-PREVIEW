import { GLYPH_RULES } from "./rules";
import { ENTITY_TYPES, type GlyphDefinition, type GlyphCategory } from "./types";

function validFor(categories: readonly GlyphCategory[]) {
  return ENTITY_TYPES.filter((type) =>
    categories.some((category) => GLYPH_RULES[type].includes(category)),
  );
}

function define(
  def: Omit<GlyphDefinition, "validFor">,
): GlyphDefinition {
  return Object.freeze({
    ...def,
    categories: Object.freeze([...def.categories]),
    keywords: Object.freeze([...def.keywords]),
    validFor: Object.freeze(validFor(def.categories)),
  });
}

export const GLYPHS: readonly GlyphDefinition[] = Object.freeze([
  define({
    id: "glyph.user",
    icon: "user",
    label: "Human",
    categories: ["IDENTITY"],
    keywords: ["human", "person", "user", "cursor", "josh"],
  }),
  define({
    id: "glyph.boundary",
    icon: "boundary",
    label: "Boundary",
    categories: ["PLACE"],
    keywords: ["place", "scope", "boundary", "container", "brackets"],
  }),
  define({
    id: "glyph.brackets",
    icon: "brackets",
    label: "Brackets",
    categories: ["PLACE"],
    keywords: ["brackets", "place", "scope", "code", "build"],
  }),
  define({
    id: "glyph.square",
    icon: "square",
    label: "Square",
    categories: ["PLACE"],
    keywords: ["place", "box", "square", "boundary"],
  }),
  define({
    id: "glyph.diamond-place",
    icon: "diamond-outline",
    label: "Facet",
    categories: ["PLACE"],
    keywords: ["place", "diamond", "facet", "scope"],
  }),
  define({
    id: "glyph.home",
    icon: "home",
    label: "Home",
    categories: ["PLACE"],
    keywords: ["home", "house", "place", "rescope"],
  }),
  define({
    id: "glyph.grid",
    icon: "grid",
    label: "Grid",
    categories: ["PLACE"],
    keywords: ["grid", "place", "workspace", "bench"],
  }),
  define({
    id: "glyph.folder",
    icon: "folder",
    label: "Folder",
    categories: ["PLACE"],
    keywords: ["folder", "place", "container", "scope"],
  }),
  define({
    id: "glyph.workspace",
    icon: "workspace",
    label: "Workspace",
    categories: ["PLACE"],
    keywords: ["workspace", "build", "place", "bench"],
  }),
  define({
    id: "glyph.cube",
    icon: "cube",
    label: "Cube",
    categories: ["THING"],
    keywords: ["cube", "object", "thing", "box", "form"],
  }),
  define({
    id: "glyph.hexagon",
    icon: "hexagon",
    label: "Hexagon",
    categories: ["THING"],
    keywords: ["hex", "thing", "object", "cell"],
  }),
  define({
    id: "glyph.circle",
    icon: "circle",
    label: "Circle",
    categories: ["THING"],
    keywords: ["circle", "thing", "object", "node"],
  }),
  define({
    id: "glyph.github",
    icon: "github",
    label: "GitHub",
    categories: ["CONNECTOR"],
    keywords: ["git", "repo", "repository", "code", "github"],
  }),
  define({
    id: "glyph.link",
    icon: "link",
    label: "Link",
    categories: ["CONNECTOR"],
    keywords: ["link", "connector", "url", "join"],
  }),
  define({
    id: "glyph.plug",
    icon: "plug",
    label: "Plug",
    categories: ["CONNECTOR"],
    keywords: ["plug", "connector", "port", "bind"],
  }),
  define({
    id: "glyph.node",
    icon: "node",
    label: "Node",
    categories: ["CONNECTOR"],
    keywords: ["node", "connector", "graph", "port"],
  }),
  define({
    id: "glyph.forward",
    icon: "arrow-right",
    label: "Send",
    categories: ["ACTION"],
    keywords: ["send", "move", "forward", "next", "arrow"],
  }),
  define({
    id: "glyph.play",
    icon: "play",
    label: "Play",
    categories: ["ACTION"],
    keywords: ["play", "run", "action", "go"],
  }),
  define({
    id: "glyph.guardian",
    icon: "diamond",
    label: "Guardian",
    categories: ["GUARDIAN"],
    keywords: ["guardian", "policy", "gate", "decision"],
  }),
  define({
    id: "glyph.shield",
    icon: "shield",
    label: "Shield",
    categories: ["GUARDIAN"],
    keywords: ["shield", "guardian", "guard", "policy"],
  }),
  define({
    id: "glyph.gate",
    icon: "gate",
    label: "Gate",
    categories: ["GUARDIAN"],
    keywords: ["gate", "guardian", "knot", "permit"],
  }),
  define({
    id: "glyph.trace",
    icon: "path",
    label: "Trace",
    categories: ["TRACE"],
    keywords: ["trace", "path", "time", "history"],
  }),
  define({
    id: "glyph.hash",
    icon: "hash",
    label: "Hash",
    categories: ["TRACE"],
    keywords: ["hash", "receipt", "trace", "id"],
  }),
  define({
    id: "glyph.receipt",
    icon: "receipt",
    label: "Receipt",
    categories: ["TRACE"],
    keywords: ["receipt", "proof", "trace", "record"],
  }),
  define({
    id: "glyph.terminal",
    icon: "terminal",
    label: "System",
    categories: ["SYSTEM"],
    keywords: ["system", "terminal", "host", "machine"],
  }),
]);

export function glyphByIcon(icon: string): GlyphDefinition | undefined {
  return GLYPHS.find((glyph) => glyph.icon === icon);
}
