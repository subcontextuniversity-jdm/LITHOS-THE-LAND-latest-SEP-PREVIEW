import { startKeynote } from "./keynote.mjs";
import { createWorld, startSlice } from "./slice.mjs";
import { startPocket } from "./pocket.mjs";
import { startLand } from "./land.mjs";
import { startProof } from "./travel.mjs";
import { startSpine } from "./spine.mjs";
import { loadState } from "./store.mjs";

const root = document.getElementById("app");
const params = new URLSearchParams(location.search);
let session = { stop() {} };

function worldFrom(saved) {
  return createWorld(saved ?? loadState());
}

function bootLand() {
  session.stop();
  session = startLand(root, {
    onPocket: () => bootPocket(worldFrom()),
    onBench: () => {
      const saved = loadState();
      const world = createWorld(saved);
      world.phase = world.human ? "home" : "enter";
      bootSlice(world);
    },
    onOrigin: () => startOrigin(worldFrom()),
    onProof: () => bootProof(worldFrom()),
    onSpine: () => bootSpine(worldFrom()),
  });
}

function bootSpine(world) {
  session.stop();
  session = startSpine(root, {
    human: world?.human ?? { id: "human-josh", name: "Josh", role: "CURSOR" },
    onBack: () => bootLand(),
  });
}

function bootProof(world) {
  session.stop();
  session = startProof(root, {
    human: world?.human ?? { id: "human-josh", name: "Josh", role: "CURSOR" },
    onBack: () => bootLand(),
  });
}

function bootSlice(saved) {
  session.stop();
  const world = createWorld(saved);
  session = startSlice(root, world, {
    onReplayOrigin: () => startOrigin(world),
    onOpenLand: () => bootPocket(world),
    onOpenTree: () => bootLand(),
  });
}

function bootPocket(world) {
  session.stop();
  session = startPocket(root, {
    human: world?.human,
    onBack: () => bootLand(),
    onReplayOrigin: () => startOrigin(world),
  });
}

function startOrigin(existingWorld) {
  session.stop();
  session = startKeynote(root, {
    onDone() {
      bootLand();
    },
  });
}

const saved = params.get("reset") === "1" ? null : loadState();
const skip = params.get("enter") === "1";
const land = params.get("land") === "1" || params.get("pocket") === "1";
const origin = params.get("origin") === "1";
const proof = params.get("proof") === "1";
const spine = params.get("spine") === "1";

if (origin) {
  startOrigin(worldFrom(saved));
} else if (proof) {
  bootProof(worldFrom(saved));
} else if (spine) {
  bootSpine(worldFrom(saved));
} else if (land) {
  bootPocket(worldFrom(saved));
} else if (skip) {
  bootSlice(saved);
} else {
  bootLand();
}
