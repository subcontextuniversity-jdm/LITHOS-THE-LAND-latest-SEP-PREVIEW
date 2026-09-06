import { pullGoldenCord } from "./law.mjs";

export const CONTINUITY = Object.freeze([
  "TREE",
  "LEAF",
  "SCREEN",
  "ACTION",
  "ASSET",
  "BRANCH",
  "LIBRARY",
  "TREE",
]);

export const LIBRARY_NOUNS = Object.freeze({
  FILES: "where bytes live",
  LIBRARY: "what I have",
  TREE: "how it belongs",
  THREADS: "what it relates to",
  STAGE: "how I work with it",
  TRACE: "how it became this",
  WEAVER: "how I compose something new",
});

export const PLACES = Object.freeze([
  { id: "vigil", emoji: "🎵", name: "VIGIL", mood: "a night record that still isn't finished" },
  { id: "studio", emoji: "🎨", name: "STUDIO", mood: "covers, stills, things that want a frame" },
  { id: "things", emoji: "🧊", name: "THINGS", mood: "objects that should survive the app" },
  { id: "garden", emoji: "🌱", name: "GARDEN", mood: "slow work. dirt under the cursor." },
]);

export const VIGIL_BRANCH = Object.freeze([
  { id: "audio", emoji: "🎵", name: "AUDIO", kind: "audio" },
  { id: "art", emoji: "🎨", name: "ART", kind: "art" },
  { id: "model", emoji: "◇", name: "3D", kind: "model", ref: "THING://0041" },
  { id: "notes", emoji: "✎", name: "NOTES", kind: "notes" },
  { id: "code", emoji: "⌘", name: "CODE", kind: "code" },
]);

export function seedLibrary() {
  return [
    {
      id: "cover-vigil",
      kind: "art",
      emoji: "🎨",
      title: "Cover",
      ref: "ART://COVER",
      note: "A still that wants to hold the record.",
    },
    {
      id: "thing-0041",
      kind: "model",
      emoji: "◇",
      title: "THING://0041",
      ref: "THING://0041",
      note: "The body. It can leave the screen.",
    },
    {
      id: "audio-vigil",
      kind: "audio",
      emoji: "🎵",
      title: "Theme",
      ref: "AUDIO://VIGIL",
      note: "A short motif. Not a stem pack.",
    },
    {
      id: "sketch-jaw",
      kind: "sketch",
      emoji: "✎",
      title: "Jaw split",
      ref: "SKETCH://JAW",
      note: "The overhang already taught this.",
    },
  ];
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning ◡";
  if (hour < 18) return "Good afternoon ◡";
  return "Good evening ◡";
}

export function selectForWeave(ids, library) {
  const unique = [...new Set(ids ?? [])];
  if (unique.length < 2 || unique.length > 3) {
    return { ok: false, error: "Select two or three Things." };
  }
  const items = unique.map((id) => library.find((item) => item.id === id));
  if (items.some((item) => !item)) {
    return { ok: false, error: "A selected Thing is not in this Library." };
  }
  return { ok: true, selection: items };
}

export function adaPropose(selection) {
  if (!selection || selection.length < 2) {
    return { ok: false, error: "ADA can propose a relationship. She cannot invent the Things." };
  }
  const kinds = selection.map((item) => item.kind);
  const hasModel = kinds.includes("model");
  const hasArt = kinds.includes("art") || kinds.includes("sketch");
  const hasAudio = kinds.includes("audio");

  const proposals = [
    {
      id: "pattern",
      label: "PATTERN",
      title: "A reusable seam",
      why: "What belongs together, on any surface.",
    },
    {
      id: "screen",
      label: "SCREEN",
      title: hasModel ? "A leaf that opens into the object" : "A pocket card for these Things",
      why: "A screen is a leaf. It should not trap the Thing.",
    },
    {
      id: "place",
      label: "PLACE",
      title: hasAudio && hasArt ? "A small studio that can hold a night" : "A bench for these three",
      why: "Place is where the work lives. Not another account.",
    },
  ];

  return {
    ok: true,
    by: "ADA",
    can: ["propose"],
    cannot: ["tie_knot"],
    proposals,
  };
}

export function adaMayNotTieKnot() {
  return {
    ok: false,
    error: "ADA proposes the pattern. The human pulls the threads into the knot.",
  };
}

export function pullWeaveKnot(human, selection, proposal) {
  if (!human?.id) {
    return { ok: false, error: "KNOT = DECISION. The human ties the knot." };
  }
  if (!proposal?.id) {
    return { ok: false, error: "A knot needs a chosen pattern." };
  }
  const picked = selectForWeave(
    selection.map((item) => item.id),
    selection,
  );
  if (!picked.ok) return picked;

  const title =
    proposal.id === "place"
      ? "Vigil pocket"
      : proposal.id === "screen"
        ? "Thing leaf"
        : "Seam card";

  const thing = {
    id: `woven-${proposal.id}-${human.id}`.slice(0, 48),
    kind: "woven",
    emoji: "🪡",
    title,
    ref: `THING://WOVEN/${proposal.id.toUpperCase()}`,
    note: "Human made something.",
    parents: selection.map((item) => item.ref ?? item.id),
    pattern: proposal.id,
    wovenBy: human.name,
  };

  return { ok: true, thing, knot: { by: human.id, pattern: proposal.id, at: Date.now() } };
}

export function refuseGoldenCordFromLibrary() {
  return pullGoldenCord();
}
