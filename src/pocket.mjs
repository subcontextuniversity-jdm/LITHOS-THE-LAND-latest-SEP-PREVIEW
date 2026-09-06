import {
  CONTINUITY,
  LIBRARY_NOUNS,
  PLACES,
  VIGIL_BRANCH,
  seedLibrary,
  greeting,
  selectForWeave,
  adaPropose,
  pullWeaveKnot,
} from "./weave.mjs";
import { VISUAL_GRAMMAR_06 } from "./law.mjs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function thingGlyph() {
  return `<svg class="thing-0041" viewBox="0 0 120 140" aria-hidden="true">
    <defs>
      <linearGradient id="clipMetal" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#8fe7f2"/>
        <stop offset="1" stop-color="#b38cff"/>
      </linearGradient>
    </defs>
    <path d="M40 12h40l14 22v70c0 16-14 28-34 28s-34-12-34-28V34z" fill="none" stroke="url(#clipMetal)" stroke-width="5"/>
    <path d="M52 58h16v28H52z" fill="none" stroke="#e8b04a" stroke-width="3"/>
    <circle cx="60" cy="36" r="7" fill="#6ee7f2"/>
  </svg>`;
}

export function startPocket(root, { human, onBack, onReplayOrigin }) {
  const ac = new AbortController();
  const { signal } = ac;
  const who = human?.name || "Josh";

  const state = {
    view: "film",
    film: 0,
    selected: [],
    ada: null,
    pattern: null,
    tension: 0,
    woven: null,
    library: seedLibrary(),
    error: "",
  };

  const filmBeats = [
    {
      plate: "./film/plates/clip03_leaves_become_screens.png",
      kicker: "TREE → LEAF → SCREEN",
      line: "Leaves become screens.",
    },
    {
      plate: "./film/plates/clip03_thing_leaves_the_screen.png",
      kicker: "SCREEN → ACTION → ASSET",
      line: "A Thing can come out of the application.",
    },
    {
      plate: "./film/plates/clip04_library_is_not_files.png",
      kicker: "ASSET → BRANCH → LIBRARY",
      line: "Library is not Files. Library is what I have.",
    },
    {
      plate: "./film/plates/clip04_empty_branch_ready.png",
      kicker: "WEAVE → CANOPY → TREE",
      line: "Ready for the next Thing.",
    },
  ];

  let filmTimer = 0;

  function stopFilm() {
    window.clearInterval(filmTimer);
  }

  function playFilm() {
    stopFilm();
    state.view = "film";
    state.film = 0;
    render();
    filmTimer = window.setInterval(() => {
      state.film += 1;
      if (state.film >= filmBeats.length) {
        stopFilm();
        state.view = "home";
        render();
        return;
      }
      render();
    }, 3800);
  }

  function chrome(screen) {
    return `<section class="pocket">
      <header class="pocket-top">
        <span class="brand">LITHOS//POCKET</span>
        <span>${CONTINUITY.join(" → ")}</span>
        <button class="linkish" data-act="back" type="button">HOME</button>
      </header>
      <div class="pocket-stage">
        <div class="phone" data-phone>
          <div class="phone-bar"><span></span><span></span></div>
          ${screen}
          <nav class="phone-nav">
            <button type="button" data-act="home" class="${state.view === "home" ? "on" : ""}">🏠</button>
            <button type="button" data-act="place" class="${state.view === "place" || state.view === "stage" ? "on" : ""}">🎵</button>
            <button type="button" data-act="library" class="${state.view === "library" ? "on" : ""}">📚</button>
            <button type="button" data-act="open-weave" class="${state.view === "weave" || state.view === "leaf" ? "on" : ""}">🪡</button>
          </nav>
        </div>
        ${state.view === "stage" || state.view === "leaf" ? spatial() : ""}
      </div>
    </section>`;
  }

  function spatial() {
    const assets = [
      { emoji: "🖼", name: "still" },
      { emoji: "🎵", name: "wave" },
      { emoji: "📄", name: "note" },
      { emoji: "◇", name: "glb" },
      { emoji: "⌘", name: "code" },
      { emoji: "✎", name: "sketch" },
      { emoji: "▶", name: "take" },
    ];
    return `<aside class="spatial ${state.view === "leaf" ? "spatial-leaf" : ""}">
      <div class="risen">
        ${thingGlyph()}
        <div class="tiny">◇ THING://0041</div>
      </div>
      <div class="asset-cloud">
        ${assets
          .map(
            (asset, i) =>
              `<button class="asset-chip" style="--i:${i}" type="button" data-act="library">${asset.emoji}<span>${asset.name}</span></button>`,
          )
          .join("")}
      </div>
      <p class="lede">Cards are not representations trapped in UI. The Thing left the screen. Each asset keeps a golden thread home.</p>
      <div class="actions">
        <button class="btn" data-act="library" type="button">Follow a thread → Library</button>
      </div>
    </aside>`;
  }

  function renderFilm() {
    const beat = filmBeats[state.film] ?? filmBeats[0];
    root.innerHTML = `<section class="film-plate" style="background-image:url('${beat.plate}')">
      <button class="skip" type="button" data-act="skip-film">Skip to Pocket</button>
      <div class="film-copy">
        <div class="tiny">${escapeHtml(beat.kicker)}</div>
        <h1>${escapeHtml(beat.line)}</h1>
      </div>
    </section>`;
  }

  function renderHome() {
    const places = PLACES.map(
      (place) => `<button class="place-card" type="button" data-act="place" data-id="${place.id}">
        <span class="emoji">${place.emoji}</span>
        <strong>${place.name}</strong>
        <p>${escapeHtml(place.mood)}</p>
      </button>`,
    ).join("");
    root.innerHTML = chrome(`
      <div class="phone-scroll">
        <div class="hello">
          <div class="tiny">CURSOR</div>
          <h1>${escapeHtml(who)}</h1>
          <p class="hello-line">${escapeHtml(greeting())}</p>
        </div>
        <div class="tiny">Places</div>
        <div class="place-grid">${places}</div>
        <div class="reactions">🌱 🎵 🧊 🌀 🧵 📎 🛠️ 🪨 🐒</div>
      </div>`);
  }

  function renderPlace() {
    const cards = VIGIL_BRANCH.map(
      (item) => `<button class="branch-card ${item.ref ? "opens" : ""}" type="button" data-act="${item.ref ? "emerge" : "noop"}" data-id="${item.id}">
        <span>${item.emoji}</span>
        <strong>${item.name}</strong>
        ${item.ref ? `<code>${item.ref}</code>` : ""}
      </button>`,
    ).join("");
    root.innerHTML = chrome(`
      <div class="phone-scroll">
        <button class="linkish" data-act="home" type="button">← Places</button>
        <h1>VIGIL</h1>
        <p class="lede">A branching project. Not twelve applications associated with a project.</p>
        <div class="tree-card">
          <pre>VIGIL
├─ 🎵 AUDIO
├─ 🎨 ART
├─ ◇ 3D
├─ ✎ NOTES
└─ ⌘ CODE</pre>
        </div>
        <div class="branch-grid">${cards}</div>
      </div>`);
  }

  function renderStage() {
    root.innerHTML = chrome(`
      <div class="phone-scroll">
        <button class="linkish" data-act="place" type="button">← VIGIL</button>
        <h1>◇ 3D</h1>
        <p class="lede">Tap made the card open outward. The object is no longer only a preview.</p>
        <div class="mini-stage">${thingGlyph()}<div class="tiny">THING://0041</div></div>
        <button class="btn" data-act="library" type="button">Carry the threads</button>
      </div>`);
  }

  function renderLibrary() {
    const cards = state.library
      .map((item) => {
        const on = state.selected.includes(item.id) ? "selected" : "";
        return `<button class="lib-card ${on}" type="button" data-act="toggle" data-id="${item.id}">
          <span>${item.emoji}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.note)}</p>
        </button>`;
      })
      .join("");
    const nouns = Object.entries(LIBRARY_NOUNS)
      .map(([key, value]) => `<div><b>${key}</b> ${escapeHtml(value)}</div>`)
      .join("");
    root.innerHTML = chrome(`
      <div class="phone-scroll">
        <h1>Library</h1>
        <p class="lede">Not Files. What you have. Select two or three, then weave.</p>
        <div class="lib-grid">${cards}</div>
        <p class="error">${escapeHtml(state.error)}</p>
        <button class="btn" data-act="open-weave" type="button">🪡 Weave</button>
        <div class="nouns">${nouns}</div>
      </div>`);
  }

  function renderWeave() {
    const picked = state.selected
      .map((id) => state.library.find((item) => item.id === id))
      .filter(Boolean);
    const rows = picked
      .map((item) => `<div class="weave-row">${item.emoji} ${escapeHtml(item.title)}</div>`)
      .join("");
    const proposals = (state.ada?.proposals ?? [])
      .map(
        (item) => `<button class="card-btn ${state.pattern === item.id ? "selected" : ""}" type="button" data-act="pattern" data-id="${item.id}">
          <div class="k">${item.label}</div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.why)}</p>
        </button>`,
      )
      .join("");
    root.innerHTML = chrome(`
      <div class="phone-scroll weave-sheet">
        <div class="tiny">🪡 WEAVE</div>
        <div class="weave-stack">${rows || "<p class='lede'>Pick two or three Things in Library first.</p>"}</div>
        <p class="lede">What should these become?</p>
        <button class="btn ghost" data-act="ask-ada" type="button">Ask ADA…</button>
        ${state.ada ? `<p class="tiny">ADA proposes. She cannot tie the knot.</p><div class="proposal-grid">${proposals}</div>` : ""}
        ${
          state.pattern
            ? `<div class="pull-box">
                <label class="tiny" for="tension">Pull the threads into the knot</label>
                <input id="tension" type="range" min="0" max="100" value="${state.tension}" data-act="tension">
                <div class="knot-diamond ${state.tension > 80 ? "tight" : ""}">◆</div>
                <button class="btn" data-act="knot" type="button" ${state.tension >= 100 ? "" : "disabled"}>Knot</button>
              </div>`
            : ""
        }
        <p class="error">${escapeHtml(state.error)}</p>
      </div>`);
  }

  function renderLeaf() {
    const thing = state.woven;
    root.innerHTML = chrome(`
      <div class="phone-scroll">
        <p class="tiny">HUMAN MADE SOMETHING.</p>
        <h1>${thing?.emoji ?? "🪡"} ${escapeHtml(thing?.title ?? "")}</h1>
        <p class="lede">${escapeHtml(thing?.note ?? "")}</p>
        <pre class="tree-card">${escapeHtml((thing?.parents ?? []).join("\n"))}</pre>
        <div class="blank-leaf">
          <span class="cursor"></span>
        </div>
        <p class="lede">A blank card on a new branch. Ready for the next Thing.</p>
        <div class="actions">
          <button class="btn" data-act="library" type="button">Back to Library</button>
          <button class="btn ghost" data-act="film" type="button">Replay the leaf film</button>
        </div>
        <pre class="plaque">${VISUAL_GRAMMAR_06}</pre>
      </div>`);
  }

  function render() {
    const views = {
      film: renderFilm,
      home: renderHome,
      place: renderPlace,
      stage: renderStage,
      library: renderLibrary,
      weave: renderWeave,
      leaf: renderLeaf,
    };
    (views[state.view] ?? renderHome)();
  }

  root.addEventListener(
    "click",
    (event) => {
      const act = event.target.closest("[data-act]")?.dataset.act;
      if (!act || act === "tension") return;
      state.error = "";

      if (act === "skip-film" || act === "home") {
        stopFilm();
        state.view = "home";
        render();
        return;
      }
      if (act === "film") {
        playFilm();
        return;
      }
      if (act === "back") {
        stopFilm();
        ac.abort();
        onBack();
        return;
      }
      if (act === "replay") {
        stopFilm();
        ac.abort();
        onReplayOrigin();
        return;
      }
      if (act === "place") {
        state.view = "place";
        render();
        return;
      }
      if (act === "emerge") {
        state.view = "stage";
        render();
        return;
      }
      if (act === "library") {
        state.view = "library";
        render();
        return;
      }
      if (act === "toggle") {
        const id = event.target.closest("[data-id]").dataset.id;
        if (state.selected.includes(id)) {
          state.selected = state.selected.filter((item) => item !== id);
        } else if (state.selected.length < 3) {
          state.selected = [...state.selected, id];
        }
        render();
        return;
      }
      if (act === "open-weave") {
        state.view = "weave";
        state.ada = null;
        state.pattern = null;
        state.tension = 0;
        render();
        return;
      }
      if (act === "ask-ada") {
        const picked = selectForWeave(state.selected, state.library);
        if (!picked.ok) {
          state.error = picked.error;
          render();
          return;
        }
        state.ada = adaPropose(picked.selection);
        render();
        return;
      }
      if (act === "pattern") {
        state.pattern = event.target.closest("[data-id]").dataset.id;
        state.tension = 0;
        render();
        return;
      }
      if (act === "knot") {
        if (state.tension < 100) {
          state.error = "Pull the threads all the way. The knot is a decision, not a sparkle.";
          render();
          return;
        }
        const picked = selectForWeave(state.selected, state.library);
        if (!picked.ok) {
          state.error = picked.error;
          render();
          return;
        }
        const proposal = state.ada?.proposals.find((item) => item.id === state.pattern);
        const result = pullWeaveKnot(human ?? { id: "human-cursor", name: who }, picked.selection, proposal);
        if (!result.ok) {
          state.error = result.error;
          render();
          return;
        }
        state.woven = result.thing;
        state.library = [...state.library, result.thing];
        state.view = "leaf";
        render();
      }
    },
    { signal },
  );

  root.addEventListener(
    "input",
    (event) => {
      if (event.target.dataset.act !== "tension") return;
      state.tension = Number(event.target.value);
      const diamond = root.querySelector(".knot-diamond");
      const knot = root.querySelector("[data-act='knot']");
      if (diamond) diamond.classList.toggle("tight", state.tension > 80);
      if (knot) knot.disabled = state.tension < 100;
    },
    { signal },
  );

  playFilm();
  return {
    stop() {
      stopFilm();
      ac.abort();
    },
  };
}
