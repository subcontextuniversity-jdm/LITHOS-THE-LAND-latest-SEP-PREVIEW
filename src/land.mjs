import { VISUAL_GRAMMAR_06, GRAMMAR, pullGoldenCord } from "./law.mjs";

const SURFACES = [
  { id: "pocket", name: "iPhone becomes the Pocket", state: "LIVE", act: "pocket" },
  { id: "bench", name: "The physical world becomes the Workshop", state: "LIVE", act: "bench" },
  { id: "commons", name: "The web becomes the Commons", state: "SKETCH", act: "absent" },
  { id: "stage", name: "3D becomes the Stage", state: "SKETCH", act: "absent" },
  { id: "workbench", name: "Windows can become the Workbench", state: "ABSENT", act: "absent" },
  { id: "engine", name: "Linux becomes the Engine Room", state: "ABSENT", act: "absent" },
  { id: "draft", name: "iPad becomes the Drafting Table", state: "ABSENT", act: "absent" },
  { id: "deck", name: "Android becomes the Modular Deck", state: "ABSENT", act: "absent" },
];

const PILLARS = [
  "CREATE",
  "LEARN",
  "WORK",
  "PLAY",
  "BUILD",
  "CARE",
  "TRADE",
  "REMEMBER",
  "SHARE",
  "RETURN",
];

const MYTH = {
  ...GRAMMAR,
  TALON: "capability",
  ADA: "composition",
};

export function startLand(root, { onPocket, onBench, onOrigin }) {
  const ac = new AbortController();
  const { signal } = ac;
  const state = { overlay: null, handshake: true };

  let handshakeTimer = 0;

  function stamp(title, message, detail) {
    state.overlay = { title, message, detail };
    render();
  }

  function renderHandshake() {
    root.innerHTML = `<section class="land-boot">
      <p class="stage-note">1996 called. We left the modem running.</p>
      <p class="prompt">LITHOS://THE LAND_ <span class="cursor"></span></p>
      <pre class="boot-log">> boot --public-preview
> tracing roots...
> CONNECTION SPEED: 56K
> WORLD TREE: GERMINATING...</pre>
      <button class="skip" type="button" data-act="skip">Skip handshake</button>
    </section>`;
  }

  function render() {
    if (state.handshake) {
      renderHandshake();
      return;
    }

    const surfaces = SURFACES.map(
      (item) => `<button class="surface ${item.state.toLowerCase()}" type="button" data-act="${item.act}" data-name="${item.name}">
        <span class="tiny">${item.state}</span>
        <strong>${item.name}</strong>
      </button>`,
    ).join("");

    const pillars = PILLARS.map((name) => `<span class="chip">${name}</span>`).join("");

    const myth = Object.entries(MYTH)
      .map(([key, value]) => `<div>${key} <span>= ${value}</span></div>`)
      .join("");

    root.innerHTML = `<section class="land">
      <header class="land-bar">
        <span class="brand">LITHOS//THE LAND</span>
        <span>PUBLIC HANDOFF 001</span>
        <span>[ 56K ]</span>
      </header>

      <div class="land-hero" style="background-image:url('./film/plates/clip04_empty_branch_ready.png')">
        <p class="stage-note">THE GOLDEN TREE</p>
        <h1>The future of computing may look less like a dashboard and more like a living tree.</h1>
        <p class="lede">Not a corporate org chart. Not another folder hierarchy wearing glass effects. Roots below. Branches above. People somewhere in the middle, carrying things between worlds.</p>
      </div>

      <div class="land-body">
        <pre class="chain">ROOT → TRUNK → BRANCH → THING
                   ↘ THREAD</pre>
        <p class="lede">The roots are memory. The trunk is law. Branches can grow wildly, but the trunk prevents the entire tree becoming spaghetti.</p>

        <div class="tiny">What is planted</div>
        <div class="plant-grid">
          <button class="door glass" data-act="pocket" type="button">
            <div class="tiny">LIVE · Pocket</div>
            <strong>Good afternoon ◡</strong>
            <p class="lede">A screen becomes fabric. iPhone becomes the Pocket. Leaves become screens.</p>
            <div class="hint">Enter the Pocket →</div>
          </button>
          <button class="door glass" data-act="bench" type="button">
            <div class="tiny">LIVE · Workshop</div>
            <strong>THE BENCH</strong>
            <p class="lede">One human. One place. One bounded worker. One receipt.</p>
            <div class="hint">Enter the slice →</div>
          </button>
          <button class="door glass" data-act="origin" type="button">
            <div class="tiny">LIVE · Origin</div>
            <strong>THE THINGS WE CARRY</strong>
            <p class="lede">Caloundra. Thingiverse. Where a Thing learned to survive the application that created it.</p>
            <div class="hint">Replay the origin →</div>
          </button>
          <div class="glass absent-card">
            <div class="tiny">ABSENT</div>
            <strong>The empire, the token, 120 screens</strong>
            <p class="lede">Some branches are deliberately marked ABSENT. Good.</p>
          </div>
        </div>

        <div class="tiny">Different surfaces. Same tree. Same law.</div>
        <div class="surface-grid">${surfaces}</div>

        <div class="tiny">They are not ten apps. They are ten human conditions.</div>
        <div class="silo-list">${pillars}</div>

        <div class="ada-block glass">
          <div class="tiny">ADA = COMPOSITION</div>
          <p class="lede">What belongs together? A screen becomes fabric. A relationship becomes thread. A reusable interface becomes a pattern. A transition becomes a seam. The cursor becomes a needle. The machine is the loom.</p>
          <pre class="you-tree">TREE  = STRUCTURE
STAGE = SPACE
TRACE = TIME
ADA   = COMPOSITION</pre>
        </div>

        <div class="glass">
          <div class="tiny">Mythology must correspond to system truth</div>
          <div class="grammar-list">${myth}</div>
        </div>

        <pre class="glass plaque">${VISUAL_GRAMMAR_06}</pre>

        <pre class="tree-card">LORE explains.
LAW constrains.
MATH formalises.
CODE enforces.
NODES execute.
HASHES identify.
RECEIPTS prove.
HUMANS choose.</pre>

        <p class="lede">We aren't claiming the whole tree exists today. This is a public preview of the map while we're still planting it.</p>
        <p class="lede">The old internet taught us something worth remembering: you didn't need permission to make a weird little corner of it.</p>

        <div class="invite">
          <p>So bring a Thing. Fork a branch. Tie a thread. Break something. Leave the scar. Grow the tree.</p>
          <div class="path">HUMAN → PLACE → SCOPE → WORK → RECEIPT → HOME</div>
        </div>
      </div>

      <footer class="land-foot">
        <span>You're early.</span>
        <span>[ CONNECTION SPEED: 56K ]</span>
        <span>[ WORLD TREE: GERMINATING... ]</span>
      </footer>

      <button class="cord-rail" data-act="cord" type="button" title="Don't.">
        <span class="cord"></span>
        <span class="cord-label">GOLDEN CORD</span>
      </button>
    </section>`;

    if (state.overlay) {
      const card = document.createElement("div");
      card.className = "overlay";
      card.innerHTML = `<div class="overlay-card glass">
        <div class="tiny">${state.overlay.title}</div>
        <h1>${state.overlay.message}</h1>
        <p class="lede">${state.overlay.detail}</p>
        <div class="actions"><button class="btn" data-act="close" type="button">Leave it alone</button></div>
      </div>`;
      root.append(card);
    }
  }

  handshakeTimer = window.setTimeout(() => {
    state.handshake = false;
    render();
  }, 2800);

  root.addEventListener(
    "click",
    (event) => {
      const act = event.target.closest("[data-act]")?.dataset.act;
      if (!act) return;
      if (act === "skip" || act === "skip-film") {
        window.clearTimeout(handshakeTimer);
        state.handshake = false;
        render();
        return;
      }
      if (act === "close") {
        state.overlay = null;
        render();
        return;
      }
      if (act === "cord") {
        const refused = pullGoldenCord();
        stamp("REJECTED", refused.message, refused.detail);
        return;
      }
      if (act === "absent") {
        stamp(
          "ABSENT",
          "This branch is not planted yet.",
          "Some branches work. Some are sketches. Some are experiments. Some are deliberately marked ABSENT. Good.",
        );
        return;
      }
      if (act === "pocket") {
        ac.abort();
        onPocket();
        return;
      }
      if (act === "bench") {
        ac.abort();
        onBench();
        return;
      }
      if (act === "origin") {
        ac.abort();
        onOrigin();
        return;
      }
    },
    { signal },
  );

  render();
  return {
    stop() {
      window.clearTimeout(handshakeTimer);
      ac.abort();
    },
  };
}
