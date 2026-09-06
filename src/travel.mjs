import { VISUAL_GRAMMAR_06 } from "./law.mjs";
import {
  PROOF_ACTS,
  SUCCESS,
  DONT_CUT_THE_THREAD,
  THE_PROPOSAL_IS_NOT_THE_DECISION,
  CONVERSION_ROUTE,
  AUTHORIZATION_KIND,
  LEDGER_PERSISTENCE,
  SKETCH_JAW,
  createProof,
  travelTo,
  whatAmILookingAt,
  proposeForThing,
  deriveThing,
  alterProposal,
  retargetThread,
  approveKnot,
  commitKnot,
  receiveIntoLibrary,
  growTree,
  whyIsThisTheWayItIsNow,
  recordFailure,
  resetDefaultLedger,
  acceptanceGate,
} from "./identity.mjs";

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
      <linearGradient id="clipMetal2" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#8fe7f2"/>
        <stop offset="1" stop-color="#b38cff"/>
      </linearGradient>
    </defs>
    <path d="M40 12h40l14 22v70c0 16-14 28-34 28s-34-12-34-28V34z" fill="none" stroke="url(#clipMetal2)" stroke-width="5"/>
    <path d="M52 58h16v28H52z" fill="none" stroke="#e8b04a" stroke-width="3"/>
    <circle cx="60" cy="36" r="7" fill="#6ee7f2"/>
  </svg>`;
}

export function startProof(root, { human, onBack }) {
  const ac = new AbortController();
  const { signal } = ac;
  const who = human ?? { id: "human-josh", name: "Josh", role: "CURSOR" };
  const state = {
    proof: null,
    tension: 0,
    error: "",
    ready: false,
  };

  async function boot() {
    resetDefaultLedger();
    const proof = await createProof(who);
    const scarred = recordFailure(proof.thing, {
      event: "Overhang collapsed",
      learning: "Unsupported geometry",
    });
    state.proof = {
      ...proof,
      thing: scarred.thing,
      inspector: whatAmILookingAt(scarred.thing, "drafting"),
    };
    state.ready = true;
    render();
  }

  function honesty() {
    return `<div class="proof-honesty">
      <span>CONVERSION ${CONVERSION_ROUTE}</span>
      <span>AUTHORIZATION ${AUTHORIZATION_KIND}</span>
      <span>LEDGER ${LEDGER_PERSISTENCE}</span>
      <span>SURFACES browser layouts</span>
    </div>`;
  }

  function inspector() {
    const proof = state.proof;
    const look = proof.inspector ?? whatAmILookingAt(proof.thing, proof.surface ?? "drafting");
    return `<aside class="proof-inspector glass">
      <div class="tiny">What am I looking at?</div>
      <strong>${escapeHtml(look.lookingAt)}</strong>
      <p class="lede">${escapeHtml(look.answer)}</p>
      <pre>${escapeHtml(proof.thing.thingId)}
${proof.thing.representations.map((item) => `├─ ${item.label}  ${item.representationId}`).join("\n")}</pre>
    </aside>`;
  }

  function chrome(body) {
    const proof = state.proof;
    const acts = PROOF_ACTS.map(
      (act) => `<span class="${proof.act === act ? "on" : ""}">${act}</span>`,
    ).join("");
    return `<section class="proof">
      <header class="proof-bar">
        <span class="brand">LITHOS//HANDOFF 002</span>
        <span>THE THING THAT SURVIVES</span>
        <button class="linkish" data-act="back" type="button">LAND</button>
      </header>
      ${honesty()}
      <nav class="proof-acts">${acts}</nav>
      <div class="proof-layout">
        ${inspector()}
        <div class="proof-stage">${body}</div>
      </div>
    </section>`;
  }

  function renderArrive() {
    const thing = state.proof.thing;
    root.innerHTML = chrome(`
      ${thingGlyph()}
      <p class="tiny">ARRIVE</p>
      <h1>${escapeHtml(thing.thingId)}</h1>
      <p class="lede">This came from somewhere. Changing form does not require losing identity.</p>
      <pre class="tree-card">${escapeHtml(thing.thingId)}
├─ ${thing.representations.map((item) => item.label).join("\n├─ ")}
├─ TRACE ${thing.trace.map((item) => item.event).join(" → ")}
└─ conversion ${CONVERSION_ROUTE}</pre>
      <button class="btn" data-act="travel" type="button">Bring it in →</button>
    `);
  }

  function renderTravel() {
    const proof = state.proof;
    const cards = [
      ["pocket", "Pocket", "iPhone layout. Not a native app."],
      ["workbench", "Workbench", "Windows layout. Proof surface, ABSENT as an app."],
      ["drafting", "Drafting Table", "iPad layout. Proof surface, ABSENT as an app."],
    ]
      .map(([id, name, note]) => {
        const on = proof.surface === id ? "selected" : "";
        const seen = proof.visited.includes(id) ? "seen" : "";
        return `<button class="surface-card ${on} ${seen}" type="button" data-act="open" data-id="${id}">
          <strong>${name}</strong>
          <p>${note}</p>
          <div class="tiny">${proof.visited.includes(id) ? "encountered" : "open"}</div>
        </button>`;
      })
      .join("");
    const ready = ["pocket", "workbench", "drafting"].every((id) => proof.visited.includes(id));
    root.innerHTML = chrome(`
      <p class="tiny">TRAVEL</p>
      <h1>Same Thing. Three browser layouts.</h1>
      <p class="lede">Opening a surface is not a conversion, not a receipt, and not native software.</p>
      <div class="surface-row">${cards}</div>
      <p class="error">${escapeHtml(state.error)}</p>
      <button class="btn" data-act="transform" type="button" ${ready ? "" : "disabled"}>Continue to TRANSFORM →</button>
    `);
  }

  function renderTransform() {
    const proof = state.proof;
    const threads = proof.thing.threads
      .map((item) => `<div class="weave-row">${item.emoji} ${escapeHtml(item.title)}</div>`)
      .join("");
    const proposals = (proof.ada?.proposals ?? [])
      .map(
        (item) => `<button class="card-btn ${proof.derivation?.proposal?.id === item.id ? "selected" : ""}" type="button" data-act="pattern" data-id="${item.id}">
          <div class="k">${item.label}</div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.why)}</p>
        </button>`,
      )
      .join("");
    const canKnot = Boolean(proof.derivation?.proposal) && proof.derivation?.proposal?.alteredBy;
    root.innerHTML = chrome(`
      <p class="tiny">TRANSFORM</p>
      <h1>${escapeHtml(THE_PROPOSAL_IS_NOT_THE_DECISION)}</h1>
      <p class="lede">ADA proposes. The human alters the relationship. Only a bound Knot commits.</p>
      <div class="weave-stack">${threads}</div>
      <div class="actions">
        <button class="btn ghost" data-act="ask-ada" type="button">Ask ADA…</button>
        <button class="btn ghost" data-act="alter" type="button">Drop Cover, add Sketch</button>
      </div>
      ${proof.ada ? `<div class="proposal-grid weave-picks">${proposals}</div>` : ""}
      ${
        canKnot
          ? `<div class="pull-box">
              <label class="tiny" for="tension">Pull the threads into the knot</label>
              <input id="tension" type="range" min="0" max="100" value="${state.tension}" data-act="tension">
              <div class="knot-diamond ${state.tension > 80 ? "tight" : ""}">◆</div>
              <button class="btn" data-act="knot" type="button" ${state.tension >= 100 ? "" : "disabled"}>Knot</button>
            </div>`
          : `<p class="lede">Ask ADA, then change the relationship. Authorization is ${AUTHORIZATION_KIND}.</p>`
      }
      <p class="error">${escapeHtml(state.error)}</p>
    `);
  }

  function renderRemember() {
    const proof = state.proof;
    const why = whyIsThisTheWayItIsNow(proof.thing, proof.derivative);
    const trace = why.trace.map((item) => `${item.kind}  ${item.event}`).join("\n");
    const scar = proof.thing.scars[0];
    const weight = proof.thing.weight[0];
    root.innerHTML = chrome(`
      <p class="tiny">REMEMBER</p>
      <h1>Why is this the way it is now?</h1>
      <p class="lede">${escapeHtml(why.not)}</p>
      <pre class="tree-card">${escapeHtml(trace)}</pre>
      <pre class="tree-card">FAILURE
${escapeHtml(scar?.event ?? "")}
      ↓
SCAR
${escapeHtml(scar?.learning ?? "")}
      ↓
WEIGHT
${escapeHtml(weight?.consequence ?? "")}
      ↓
NEXT ACTION CHANGES</pre>
      <pre class="plaque">${VISUAL_GRAMMAR_06}</pre>
      <p class="lede">${escapeHtml(proof.derivative.thingId)} parent ${escapeHtml(proof.derivative.parent)}</p>
      <button class="btn" data-act="return" type="button">Return →</button>
    `);
  }

  function renderReturn() {
    const proof = state.proof;
    const gate = acceptanceGate(proof);
    const checks = Object.entries(gate.checks)
      .map(([name, ok]) => `${ok ? "[x]" : "[ ]"} ${name}`)
      .join("\n");
    root.innerHTML = chrome(`
      <p class="tiny">RETURN</p>
      <h1>${SUCCESS}</h1>
      <pre class="tree-card">RECEIPT ${escapeHtml(proof.receipt.id)}
hash ${escapeHtml(proof.receipt.receiptHash.slice(0, 16))}…
authorization ${AUTHORIZATION_KIND}
claim ${escapeHtml(proof.receipt.claim)}
ledger ${LEDGER_PERSISTENCE}

LIBRARY
${proof.library.map((item) => item.title).join("\n")}

TREE leaves ${proof.tree.count}
${proof.tree.leaves.map((item) => item.id).join("\n")}</pre>
      <pre class="tree-card">${escapeHtml(checks)}</pre>
      <p class="path">[ ${escapeHtml(proof.thing.thingId)} — TRACE PRESERVED ]</p>
      <p class="path">[ NEW LEAF DETECTED ]</p>
      <p class="lede">You're still early.</p>
      <p class="path">${DONT_CUT_THE_THREAD}</p>
      <div class="actions">
        <button class="btn" data-act="back" type="button">Back to THE LAND</button>
      </div>
    `);
  }

  function render() {
    if (!state.ready) {
      root.innerHTML = `<section class="proof"><p class="lede">Loading THING://0041…</p></section>`;
      return;
    }
    const views = {
      ARRIVE: renderArrive,
      TRAVEL: renderTravel,
      TRANSFORM: renderTransform,
      REMEMBER: renderRemember,
      RETURN: renderReturn,
    };
    (views[state.proof.act] ?? renderArrive)();
  }

  root.addEventListener(
    "click",
    async (event) => {
      const act = event.target.closest("[data-act]")?.dataset.act;
      if (!act || act === "tension") return;
      if (!state.ready) return;
      state.error = "";
      const proof = state.proof;

      if (act === "back") {
        ac.abort();
        onBack();
        return;
      }
      if (act === "travel") {
        state.proof = { ...proof, act: "TRAVEL" };
        render();
        return;
      }
      if (act === "open") {
        const surface = event.target.closest("[data-id]").dataset.id;
        state.proof = travelTo(proof, surface, {
          tab: surface,
          viewport: "browser-layout",
          lastViewed: surface,
        });
        render();
        return;
      }
      if (act === "transform") {
        if (!["pocket", "workbench", "drafting"].every((id) => proof.visited.includes(id))) {
          state.error = "Open Pocket, Workbench and Drafting Table first. Travel is not a receipt.";
          render();
          return;
        }
        state.proof = { ...proof, act: "TRANSFORM" };
        render();
        return;
      }
      if (act === "ask-ada") {
        const ada = proposeForThing(proof.thing);
        state.proof = { ...proof, ada, derivation: deriveThing(proof.thing, ada.proposals[0]) };
        render();
        return;
      }
      if (act === "alter") {
        if (!proof.ada) {
          state.error = "Ask ADA first. The proposal is not the decision.";
          render();
          return;
        }
        const changed = retargetThread(proof.thing, "cover-vigil", SKETCH_JAW, who);
        const derivation = alterProposal(
          proof.derivation ?? deriveThing(changed.thing, proof.ada.proposals[0]),
          { note: "drop Cover, add Sketch" },
          who,
        );
        state.proof = { ...proof, thing: changed.thing, derivation };
        render();
        return;
      }
      if (act === "pattern") {
        const id = event.target.closest("[data-id]").dataset.id;
        const proposal = proof.ada.proposals.find((item) => item.id === id);
        state.proof = {
          ...proof,
          derivation: deriveThing(proof.thing, proposal),
        };
        if (proof.derivation?.proposal?.alteredBy) {
          state.proof.derivation = alterProposal(state.proof.derivation, { note: proof.derivation.proposal.note }, who);
        }
        render();
        return;
      }
      if (act === "knot") {
        if (state.tension < 100) {
          state.error = "Pull the threads all the way. The knot is a decision, not a sparkle.";
          render();
          return;
        }
        const proposal = proof.derivation?.proposal;
        const granted = await approveKnot(who, { proposal, thing: proof.thing });
        if (!granted.ok) {
          state.error = granted.error;
          render();
          return;
        }
        const committed = await commitKnot(proof.thing, who, proposal, granted.approval);
        if (!committed.ok) {
          state.error = committed.error;
          render();
          return;
        }
        state.proof = {
          ...proof,
          act: "REMEMBER",
          thing: committed.parent,
          derivative: committed.derivative,
          knot: committed.knot,
          receipt: committed.receipt,
          library: receiveIntoLibrary(proof.library, committed.derivative),
          tree: growTree(proof.tree, committed.derivative),
        };
        render();
        return;
      }
      if (act === "return") {
        state.proof = { ...proof, act: "RETURN" };
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

  boot();
  return {
    stop() {
      ac.abort();
    },
  };
}
