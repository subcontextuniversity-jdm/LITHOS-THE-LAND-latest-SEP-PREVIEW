import {
  PLACE,
  WORKER,
  SCOPE_GLYPHS,
  VISUAL_GRAMMAR_06,
  GRAMMAR,
  SLICE_PATH,
  bindHuman,
  seedThing,
  grantScope,
  pullGoldenCord,
  proposeRemix,
  inspectLineage,
  attemptMake,
  tieKnot,
  applyRemix,
  carryHome,
  writeReceipt,
} from "./law.mjs";
import { loadState, saveState, clearState } from "./store.mjs";

const DEFAULT_STATUS = "somewhere between a camera and a compiler";

const INTENTS = [
  {
    id: "inspect",
    title: "Inspect lineage",
    copy: "Read the ancestry. Do not pretend the failures never happened.",
    grants: ["read_thing", "read_lineage", "write_receipt"],
  },
  {
    id: "remix",
    title: "Propose a remix",
    copy: "The worker may suggest. You tie the knot.",
    grants: ["read_thing", "read_lineage", "propose_remix", "write_receipt"],
  },
  {
    id: "make",
    title: "Attempt a make",
    copy: "Print it. If the overhang is still a lie, the scar stays.",
    grants: ["read_thing", "attempt_make", "leave_scar", "write_receipt"],
  },
  {
    id: "carry",
    title: "Carry it home",
    copy: "The Thing has to survive the application that created it.",
    grants: ["read_thing", "write_receipt"],
  },
];

function clipSvg() {
  return `<svg viewBox="0 0 200 200" width="180" height="180" aria-hidden="true">
    <defs>
      <linearGradient id="metal" x1="0" x2="1">
        <stop offset="0" stop-color="#8fdbe6"/>
        <stop offset="1" stop-color="#b38cff"/>
      </linearGradient>
    </defs>
    <path d="M70 30h60l12 28v78c0 18-16 32-42 32s-42-14-42-32V58z" fill="none" stroke="url(#metal)" stroke-width="6"/>
    <path d="M84 86h32v40H84z" fill="none" stroke="#e8b04a" stroke-width="4"/>
    <path d="M92 48h16v18H92z" fill="#6ee7f2"/>
  </svg>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function createWorld(saved) {
  return {
    phase: saved?.phase ?? "enter",
    human: saved?.human ?? null,
    thing: saved?.thing ?? seedThing(),
    scope: saved?.scope ?? null,
    intent: saved?.intent ?? null,
    workerAdmitted: saved?.workerAdmitted ?? false,
    proposals: saved?.proposals ?? [],
    chosenProposal: saved?.chosenProposal ?? null,
    actionLog: saved?.actionLog ?? "",
    receipt: saved?.receipt ?? null,
    receipts: saved?.receipts ?? [],
    status: saved?.status ?? DEFAULT_STATUS,
    overlay: null,
    error: "",
    seenOrigin: saved?.seenOrigin ?? false,
  };
}

export function startSlice(root, world, { onReplayOrigin }) {
  const ac = new AbortController();
  const { signal } = ac;

  function persist() {
    saveState({
      phase: world.phase,
      human: world.human,
      thing: world.thing,
      scope: world.scope,
      intent: world.intent,
      workerAdmitted: world.workerAdmitted,
      proposals: world.proposals,
      chosenProposal: world.chosenProposal,
      actionLog: world.actionLog,
      receipt: world.receipt,
      receipts: world.receipts,
      status: world.status,
      seenOrigin: true,
    });
  }

  function go(phase) {
    world.phase = phase;
    world.error = "";
    persist();
    render();
  }

  function top(placeName) {
    return `<header class="topbar">
      <span class="brand">LITHOS//OS</span>
      <span>${SLICE_PATH.join(" · ")}</span>
      <span>${escapeHtml(placeName)}</span>
    </header>`;
  }

  function bottom() {
    const who = world.human ? `CURSOR = ${escapeHtml(world.human.name)}` : "CURSOR = HUMAN";
    return `<footer class="bottombar">
      <span>${who}</span>
      <span>WEIGHT ${world.thing.weight}</span>
      <span>SCARS ${world.thing.scars.length}</span>
    </footer>`;
  }

  function renderEnter() {
    root.innerHTML = `
      <section class="enter-wrap">
        <div>
          <div class="prompt">&gt; ENTER<span class="cursor"></span></div>
          <p class="lede">One human. One place. One bounded worker. One receipt. Then home.</p>
          <div class="actions">
            <button class="btn" data-act="begin" type="button">Enter</button>
            <button class="btn ghost" data-act="replay" type="button">Replay the origin</button>
          </div>
        </div>
      </section>`;
  }

  function renderHuman() {
    root.innerHTML = `
      <section class="room">
        ${top("HUMAN")}
        <div class="room-body">
          <div>
            <h1>Who is asking?</h1>
            <p class="lede">CURSOR = HUMAN. The system can map a name. It cannot become you.</p>
          </div>
          <form class="field" data-act="bind">
            <label for="human-name">Your name</label>
            <input id="human-name" name="name" maxlength="48" autocomplete="nickname" required>
            <div class="actions">
              <button class="btn" type="submit">Bind the cursor</button>
            </div>
            ${world.error ? `<p class="error">${escapeHtml(world.error)}</p>` : ""}
          </form>
        </div>
        ${bottom()}
      </section>`;
    root.querySelector("#human-name")?.focus();
  }

  function renderHome() {
    const carried = world.thing.carried
      ? `<div class="glass"><div class="tiny">Thing carried</div><strong>${escapeHtml(world.thing.name)}</strong><p class="lede">${escapeHtml(world.thing.note)}</p></div>`
      : `<div class="glass"><div class="tiny">Shelf</div><p class="lede">Nothing carried yet. The bench still holds it.</p></div>`;
    const receipts = world.receipts.length
      ? world.receipts
          .slice()
          .reverse()
          .map((item) => `<div>${escapeHtml(item.id)} · ${escapeHtml(item.action)} · ${escapeHtml(item.at.slice(0, 19))}</div>`)
          .join("")
      : "<p class='lede'>No receipts yet.</p>";

    root.innerHTML = `
      <section class="room">
        ${top("HOME")}
        <div class="room-body">
          <div>
            <h1>HOME</h1>
            <p class="lede">Not a dashboard. A room. You can leave without asking permission.</p>
          </div>
          <div class="home-grid">
            <button class="door glass" data-act="place" type="button">
              <div>
                <div class="tiny">Door</div>
                <strong>${PLACE.name}</strong>
                <p class="lede">${PLACE.where}</p>
              </div>
              <div class="hint">Open the place →</div>
            </button>
            <div class="glass status-box">
              <div class="tiny">Unnecessarily dramatic status</div>
              <textarea rows="3" data-act="status">${escapeHtml(world.status)}</textarea>
            </div>
            ${carried}
            <div class="glass">
              <div class="tiny">Receipts</div>
              ${receipts}
            </div>
            <pre class="glass plaque">${VISUAL_GRAMMAR_06}</pre>
            <div class="glass">
              <div class="tiny">Grammar</div>
              <div class="grammar-list">${Object.entries(GRAMMAR)
                .map(([key, value]) => `<div>${key} <span>= ${value}</span></div>`)
                .join("")}</div>
            </div>
          </div>
          <div class="actions">
            <button class="btn ghost" data-act="replay" type="button">Replay the origin</button>
            <button class="linkish" data-act="forget" type="button">Leave / forget this place</button>
          </div>
        </div>
        ${bottom()}
      </section>
      <button class="cord-rail" data-act="cord" type="button" title="Don't.">
        <span class="cord"></span>
        <span class="cord-label">GOLDEN CORD</span>
      </button>`;
  }

  function renderPlace() {
    const lineage = world.thing.lineage
      .map(
        (entry) => `<div class="lineage-item">
          <div class="year">${escapeHtml(entry.at)}</div>
          <div class="dot${entry.scar ? " scar" : ""}"></div>
          <div><strong>${escapeHtml(entry.event)}</strong><div class="tiny">${escapeHtml(entry.who)}</div></div>
        </div>`,
      )
      .join("");
    root.innerHTML = `
      <section class="room">
        ${top(PLACE.name)}
        <div class="room-body">
          <div>
            <h1>${PLACE.name}</h1>
            <p class="lede">Where does this thing belong? A workshop. One Thing on the table.</p>
          </div>
          <div class="bench-layout">
            <div class="clip-wrap glass">
              ${clipSvg()}
              <div>
                <div class="tiny">${escapeHtml(world.thing.id)}</div>
                <strong>${escapeHtml(world.thing.name)}</strong>
                <p class="lede">${escapeHtml(world.thing.source)}</p>
                <div class="meta-row">
                  <span class="weight-pill">WEIGHT ${world.thing.weight}</span>
                  <span class="scar-pill">SCARS ${world.thing.scars.length}</span>
                  <span>${world.thing.carried ? "CARRIED" : "ON THE BENCH"}</span>
                </div>
              </div>
            </div>
            <div class="glass">
              <div class="tiny">Lineage — ancestry, not empire</div>
              <div class="lineage">${lineage}</div>
            </div>
          </div>
          <div class="actions">
            <button class="btn" data-act="intent" type="button">State an intent</button>
            <button class="btn ghost" data-act="home" type="button">Return home</button>
          </div>
        </div>
        ${bottom()}
      </section>`;
  }

  function renderIntent() {
    const cards = INTENTS.map(
      (intent) => `<button class="card-btn" data-act="choose-intent" data-id="${intent.id}" type="button">
        <div class="k">${intent.id}</div>
        <strong>${intent.title}</strong>
        <p>${intent.copy}</p>
      </button>`,
    ).join("");
    root.innerHTML = `
      <section class="room">
        ${top("INTENT")}
        <div class="room-body">
          <div>
            <h1>What is the work?</h1>
            <p class="lede">One useful piece of work. Not 120 screens.</p>
          </div>
          <div class="intent-grid">${cards}</div>
        </div>
        ${bottom()}
      </section>`;
  }

  function renderWorker() {
    root.innerHTML = `
      <section class="room">
        ${top("WORKER")}
        <div class="room-body">
          <div>
            <h1>Admit a worker</h1>
            <p class="lede">Providers supply capability, never sovereignty. This one is local. It can enter, work, leave a receipt, and go home.</p>
          </div>
          <div class="glass worker-pane">
            <h2>${WORKER.name}</h2>
            <p>provider: ${WORKER.provider}</p>
            <p>can: ${WORKER.can.join(", ")}</p>
            <p>cannot: ${WORKER.cannot.join(", ")}</p>
          </div>
          <div class="actions">
            <button class="btn" data-act="admit" type="button">Admit into the place</button>
            <button class="btn ghost" data-act="refuse" type="button">Refuse</button>
          </div>
        </div>
        ${bottom()}
      </section>`;
  }

  function renderScope() {
    const intent = INTENTS.find((item) => item.id === world.intent);
    const rows = SCOPE_GLYPHS.map((glyph) => {
      const needed = intent?.grants.includes(glyph.id);
      const checked = glyph.allowed && needed ? "checked" : "";
      const disabled = glyph.allowed ? "" : "disabled";
      return `<label class="scope-row${glyph.allowed ? "" : " denied"}">
        <input type="checkbox" name="grant" value="${glyph.id}" ${checked} ${disabled}>
        <span>${escapeHtml(glyph.label)}${needed ? " · needed" : ""}</span>
        <span class="why">${glyph.allowed ? "GLYPH" : escapeHtml(glyph.reason)}</span>
      </label>`;
    }).join("");
    root.innerHTML = `
      <section class="room">
        ${top("SCOPE")}
        <div class="room-body">
          <div>
            <h1>What may it touch?</h1>
            <p class="lede">A door means nothing if software can walk through the wall. You grant the glyphs.</p>
          </div>
          <form data-act="grant">
            <div class="scope-list">${rows}</div>
            <div class="actions" style="margin-top:16px">
              <button class="btn" type="submit">Tie the knot / grant scope</button>
            </div>
            ${world.error ? `<p class="error">${escapeHtml(world.error)}</p>` : ""}
          </form>
        </div>
        ${bottom()}
      </section>`;
  }

  function renderAction() {
    const intent = world.intent;
    let body = "";
    if (intent === "inspect") {
      body = `<div class="glass"><div class="tiny">Worker log</div><pre class="log">${escapeHtml(world.actionLog || "Waiting for you to allow the inspection.")}</pre></div>
        <div class="actions"><button class="btn" data-act="do-inspect" type="button">Let it read lineage</button></div>`;
    }
    if (intent === "remix") {
      const cards = (world.proposals || [])
        .map(
          (item) => `<button class="card-btn${world.chosenProposal === item.id ? " selected" : ""}" data-act="choose-proposal" data-id="${item.id}" type="button">
            <div class="k">${item.id}</div>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.why)}</p>
          </button>`,
        )
        .join("");
      body = `<div class="glass worker-pane"><div class="tiny">Worker proposals</div><p class="lede">Memory changes the next pull. Weight is currently ${world.thing.weight}.</p></div>
        <div class="actions"><button class="btn" data-act="do-propose" type="button">Ask for proposals</button></div>
        <div class="proposal-grid">${cards}</div>
        <div class="actions"><button class="btn" data-act="tie-remix" type="button" ${world.chosenProposal ? "" : "disabled"}>Tie the knot</button></div>`;
    }
    if (intent === "make") {
      body = `<div class="glass"><p class="lede">${escapeHtml(world.actionLog || "The worker can attempt a make. If the overhang scar is ignored, it will fail on purpose.")}</p></div>
        <div class="actions"><button class="btn" data-act="do-make" type="button">Attempt the make</button></div>`;
    }
    if (intent === "carry") {
      body = `<div class="glass"><p class="lede">Take this Thing somewhere else. It should not need this bench in order to exist.</p></div>
        <div class="actions"><button class="btn" data-act="do-carry" type="button">Carry it home</button></div>`;
    }
    root.innerHTML = `
      <section class="room">
        ${top("ACTION")}
        <div class="room-body">
          <div>
            <h1>Work</h1>
            <p class="lede">The worker executes within scope. You still hold the cursor.</p>
          </div>
          ${body}
          ${world.error ? `<p class="error">${escapeHtml(world.error)}</p>` : ""}
        </div>
        ${bottom()}
      </section>`;
  }

  function renderReceipt() {
    const receipt = world.receipt;
    if (!receipt) {
      root.innerHTML = `<section class="room">${top("RECEIPT")}<div class="room-body"><p>No receipt.</p></div></section>`;
      return;
    }
    root.innerHTML = `
      <section class="room">
        ${top("RECEIPT")}
        <div class="room-body">
          <article class="receipt">
            <h2>RECEIPT</h2>
            <div>ID ${escapeHtml(receipt.id)}</div>
            <div>HUMAN ${escapeHtml(receipt.human.name)}</div>
            <div>PLACE ${escapeHtml(receipt.place.name)}</div>
            <div>WORKER ${escapeHtml(receipt.worker.name)} (${escapeHtml(receipt.worker.provider)})</div>
            <div>ACTION ${escapeHtml(receipt.action)}</div>
            <div>AT ${escapeHtml(receipt.at)}</div>
            <div>SCOPE ${escapeHtml(receipt.scope.grants.join(", "))}</div>
            <div>RESULT ${escapeHtml(JSON.stringify(receipt.result))}</div>
            <p class="hash">${escapeHtml(receipt.hash)}</p>
            <p>A blockchain is not seasoning. This is just a hash of what happened.</p>
          </article>
          <div class="actions">
            <button class="btn" data-act="home" type="button">Go home</button>
            <button class="btn ghost" data-act="place" type="button">Back to the bench</button>
          </div>
        </div>
        ${bottom()}
      </section>`;
  }

  function renderOverlay() {
    if (!world.overlay) return;
    const card = document.createElement("div");
    card.className = "overlay";
    card.innerHTML = `<div class="overlay-card glass">
      <div class="tiny">${escapeHtml(world.overlay.title)}</div>
      <h1>${escapeHtml(world.overlay.message)}</h1>
      <p class="lede">${escapeHtml(world.overlay.detail)}</p>
      <div class="actions"><button class="btn" data-act="close-overlay" type="button">Leave it alone</button></div>
    </div>`;
    root.append(card);
  }

  function render() {
    const views = {
      enter: renderEnter,
      human: renderHuman,
      home: renderHome,
      place: renderPlace,
      intent: renderIntent,
      worker: renderWorker,
      scope: renderScope,
      action: renderAction,
      receipt: renderReceipt,
    };
    (views[world.phase] ?? renderEnter)();
    renderOverlay();
  }

  async function finishAction(action, result, nextThing = world.thing) {
    const written = await writeReceipt({
      human: world.human,
      place: PLACE,
      worker: WORKER,
      scope: world.scope,
      action,
      result,
    });
    if (!written.ok) {
      world.error = written.error;
      render();
      return;
    }
    world.thing = nextThing;
    world.receipt = written.receipt;
    world.receipts = [...world.receipts, written.receipt];
    go("receipt");
  }

  root.addEventListener("click", async (event) => {
    const act = event.target.closest("[data-act]")?.dataset.act;
    if (!act) return;

    if (act === "begin") go(world.human ? "home" : "human");
    if (act === "replay") {
      ac.abort();
      onReplayOrigin();
      return;
    }
    if (act === "home") go("home");
    if (act === "place") go("place");
    if (act === "intent") go("intent");
    if (act === "refuse") {
      world.workerAdmitted = false;
      go("place");
    }
    if (act === "admit") {
      world.workerAdmitted = true;
      go("scope");
    }
    if (act === "choose-intent") {
      world.intent = event.target.closest("[data-id]").dataset.id;
      world.scope = null;
      world.proposals = [];
      world.chosenProposal = null;
      world.actionLog = "";
      go("worker");
    }
    if (act === "choose-proposal") {
      world.chosenProposal = event.target.closest("[data-id]").dataset.id;
      persist();
      render();
    }
    if (act === "cord") {
      const rejected = pullGoldenCord();
      world.overlay = {
        title: "REJECTED",
        message: rejected.message,
        detail: rejected.detail,
      };
      render();
    }
    if (act === "close-overlay") {
      world.overlay = null;
      render();
    }
    if (act === "forget") {
      clearState();
      world.human = null;
      world.thing = seedThing();
      world.receipts = [];
      world.scope = null;
      world.status = DEFAULT_STATUS;
      go("enter");
    }
    if (act === "do-inspect") {
      const seen = inspectLineage(world.thing, world.scope, {
        human: world.human,
        place: PLACE,
        thing: world.thing,
        worker: WORKER,
      });
      if (!seen.ok) {
        world.error = seen.error;
        render();
        return;
      }
      world.actionLog = seen.lineage
        .map((entry) => `${entry.at}  ${entry.event}${entry.scar ? "  [SCAR]" : ""}`)
        .join("\n");
      await finishAction("INSPECT", {
        scars: seen.scars.length,
        weight: seen.weight,
      });
    }
    if (act === "do-propose") {
      const proposed = proposeRemix(world.thing, world.scope, {
        human: world.human,
        place: PLACE,
        thing: world.thing,
        worker: WORKER,
      });
      if (!proposed.ok) {
        world.error = proposed.error;
        render();
        return;
      }
      world.proposals = proposed.proposals;
      persist();
      render();
    }
    if (act === "tie-remix") {
      const knot = tieKnot(world.human, world.chosenProposal);
      if (!knot.ok) {
        world.error = knot.error;
        render();
        return;
      }
      const proposal = world.proposals.find((item) => item.id === world.chosenProposal);
      const next = applyRemix(world.thing, proposal, world.human);
      await finishAction("REMIX", { knot: knot.knot.choice, title: proposal.title }, next);
    }
    if (act === "do-make") {
      const made = attemptMake(world.thing, world.scope, {
        human: world.human,
        place: PLACE,
        thing: world.thing,
        worker: WORKER,
      });
      if (!made.ok) {
        world.error = made.error;
        render();
        return;
      }
      world.actionLog = made.message;
      await finishAction("MAKE", { succeeded: made.succeeded, message: made.message }, made.thing);
    }
    if (act === "do-carry") {
      const knot = tieKnot(world.human, "carry");
      if (!knot.ok) {
        world.error = knot.error;
        render();
        return;
      }
      const next = carryHome(world.thing, world.human);
      await finishAction("CARRY", { carried: true, thingId: next.id }, next);
    }
  }, { signal });

  root.addEventListener("submit", (event) => {
    const act = event.target.dataset.act;
    if (!act) return;
    event.preventDefault();
    if (act === "bind") {
      const name = new FormData(event.target).get("name");
      const bound = bindHuman(name);
      if (!bound.ok) {
        world.error = bound.error;
        render();
        return;
      }
      world.human = bound.human;
      go("home");
    }
    if (act === "grant") {
      const grants = [...event.target.querySelectorAll('input[name="grant"]:checked')].map(
        (input) => input.value,
      );
      const granted = grantScope({
        human: world.human,
        place: PLACE,
        thing: world.thing,
        worker: WORKER,
        grants,
      });
      if (!granted.ok) {
        world.error = granted.error + (granted.illegal ? ` (${granted.illegal.join(", ")})` : "");
        render();
        return;
      }
      const knot = tieKnot(world.human, `scope:${world.intent}`);
      if (!knot.ok) {
        world.error = knot.error;
        render();
        return;
      }
      world.scope = granted.scope;
      go("action");
    }
  }, { signal });

  root.addEventListener("input", (event) => {
    if (event.target.dataset.act === "status") {
      world.status = event.target.value;
      persist();
    }
  }, { signal });

  render();
  persist();
  return {
    render,
    world,
    stop() {
      ac.abort();
    },
  };
}
