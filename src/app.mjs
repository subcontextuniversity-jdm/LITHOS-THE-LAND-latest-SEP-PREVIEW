import { startKeynote } from "./keynote.mjs";
import { createWorld, startSlice } from "./slice.mjs";
import { startPocket } from "./pocket.mjs";
import { loadState } from "./store.mjs";

const root = document.getElementById("app");
const params = new URLSearchParams(location.search);
let session = { stop() {} };

function bootSlice(saved) {
  session.stop();
  const world = createWorld(saved);
  session = startSlice(root, world, {
    onReplayOrigin: () => startOrigin(world),
    onOpenLand: () => bootPocket(world),
  });
}

function bootPocket(world) {
  session.stop();
  session = startPocket(root, {
    human: world?.human,
    onBack: () => bootSlice(world),
    onReplayOrigin: () => startOrigin(world),
  });
}

function startOrigin(existingWorld) {
  session.stop();
  session = startKeynote(root, {
    onDone() {
      const world = existingWorld ?? createWorld(loadState());
      world.phase = "enter";
      world.seenOrigin = true;
      bootSlice(world);
    },
  });
}

const saved = params.get("reset") === "1" ? null : loadState();
const skip = params.get("enter") === "1";
const land = params.get("land") === "1" || params.get("pocket") === "1";

if (land) {
  bootPocket(createWorld(saved));
} else if (skip || saved?.human) {
  bootSlice(saved);
} else {
  startOrigin(saved ? createWorld(saved) : null);
}
