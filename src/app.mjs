import { startKeynote } from "./keynote.mjs";
import { createWorld, startSlice } from "./slice.mjs";
import { loadState } from "./store.mjs";

const root = document.getElementById("app");
const params = new URLSearchParams(location.search);
let session = { stop() {} };

function bootSlice(saved) {
  session.stop();
  const world = createWorld(saved);
  session = startSlice(root, world, {
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

if (skip || saved?.human) {
  bootSlice(saved);
} else {
  startOrigin(saved ? createWorld(saved) : null);
}
