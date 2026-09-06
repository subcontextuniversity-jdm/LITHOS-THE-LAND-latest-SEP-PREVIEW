import { STACK_SPINE, VISUAL_GRAMMAR_06, GOLDEN_CORD, PATH } from "./grammar.mjs";
import { DEEPEST_THESIS } from "./thesis.mjs";
import { STACK_STATUS, runLoginNewest, seedThing0041, stackIndex } from "./spine.mjs";
import { arrive, loginNewest, PLACE } from "./airlock.mjs";

const app = document.getElementById("app");
const params = new URLSearchParams(location.search);
const view = params.get("proof") ? "proof" : params.get("airlock") ? "airlock" : "spine";

function nav() {
  return `<nav class="links">
    <a href="./">Spine</a>
    <a href="./?airlock=1">JDM Airlock</a>
    <a href="./?proof=1">Noded work</a>
    <a href="./spine/LATEST-REAL-SEP-LITHOS-2026-STACK-SPINE.html">Print spine</a>
  </nav>`;
}

function chips() {
  return `<div class="status">
    <span class="chip warn">${STACK_STATUS.authorization}</span>
    <span class="chip warn">${STACK_STATUS.ledger}</span>
    <span class="chip">PASSPORT ${STACK_STATUS.passport}</span>
    <span class="chip">NETWORK NODES ${STACK_STATUS.networkNodes}</span>
  </div>`;
}

function footer() {
  return `<footer class="cord">${GOLDEN_CORD}</footer>`;
}

function path(now) {
  return `<div class="path">${PATH.map((step) => `<span class="${step === now ? "now" : ""}">${step}</span>`).join("")}</div>`;
}

function spineView() {
  const index = stackIndex();
  app.innerHTML = `
    <p class="kicker">LITHOS // SEP-LATEST // STACK SPINE</p>
    <h1>The land has a spine.</h1>
    <p class="thesis">${DEEPEST_THESIS}</p>
    ${nav()}
    ${chips()}
    ${path("AIRLOCK")}
    <div class="layers">
      ${STACK_SPINE.map(
        (item) => `<div class="layer"><b>${item.layer}</b><span>${item.verb}</span><span class="dim">LIVE map</span></div>`,
      ).join("")}
    </div>
    <p class="vg06">${VISUAL_GRAMMAR_06.replaceAll("\n", "<br />")}</p>
    <p class="mute">Folders: ${index.folders.join(" · ")}</p>
    <p class="dim">Gator executes. Sentinel maps. The gate stays split. The human knots.</p>
    ${footer()}
  `;
}

function airlockView() {
  app.innerHTML = `
    <p class="kicker">LOGIN-NEWEST // SPLIT-GATE // JDM AIRLOCK</p>
    <h1>Equalize. Do not fuse.</h1>
    <p class="thesis">A person and a capability may enter the same place without becoming each other.</p>
    ${nav()}
    ${chips()}
    ${path("SPLIT")}
    <div class="row">
      <label class="mute" for="name">CURSOR</label>
      <input id="name" value="Josh" maxlength="40" />
      <button id="arrive" class="primary" type="button">Arrive</button>
    </div>
    <p id="arriveOut" class="mute"></p>
    <div class="chambers">
      <div class="door left">
        <p class="kicker">Cursor door</p>
        <h2>Human</h2>
        <p id="leftDoor" class="mute">Empty. A name is required.</p>
      </div>
      <div class="airlock-core">JDM Airlock</div>
      <div class="door right">
        <p class="kicker">Talon door</p>
        <h2>Node</h2>
        <p id="rightDoor" class="mute">Present Gator or Sentinel.</p>
        <div class="row">
          <button id="gator" type="button">Present Gator</button>
          <button id="sentinel" type="button">Present Sentinel</button>
        </div>
      </div>
    </div>
    <p id="gateOut" class="mute"></p>
    <p class="dim">Passport ${STACK_STATUS.passport}. Fusion refused. ${PLACE.name} waits on the other side.</p>
    ${footer()}
  `;

  const state = { human: null, node: null };

  const paint = () => {
    document.getElementById("leftDoor").textContent = state.human
      ? `${state.human.name} · ${state.human.role} · ${state.human.id}`
      : "Empty. A name is required.";
    document.getElementById("rightDoor").textContent = state.node
      ? `${state.node.name} · ${state.node.role} · ${state.node.id}`
      : "Present Gator or Sentinel.";
  };

  document.getElementById("arrive").onclick = () => {
    const result = arrive(document.getElementById("name").value);
    const out = document.getElementById("arriveOut");
    if (!result.ok) {
      out.className = "error";
      out.textContent = result.error;
      state.human = null;
      paint();
      return;
    }
    out.className = "mute";
    out.textContent = "Left chamber occupied. CURSOR = HUMAN.";
    state.human = result.human;
    paint();
  };

  const present = async (kind) => {
    const thing = seedThing0041();
    const name = document.getElementById("name").value;
    const result = loginNewest({ name, nodeKind: kind, thing });
    const out = document.getElementById("gateOut");
    if (!result.ok) {
      out.className = "error";
      out.textContent = result.error;
      return;
    }
    state.human = result.session.human;
    state.node = result.session.node;
    paint();
    out.className = "mute";
    out.textContent = `${result.login} · gate ${result.session.gate.kind} · fused ${result.fused} · scope grants ${result.session.scope.grants.length} · ${result.session.id}`;
  };

  document.getElementById("gator").onclick = () => present("GATOR");
  document.getElementById("sentinel").onclick = () => present("SENTINEL");
}

async function proofView() {
  app.innerHTML = `
    <p class="kicker">NODED WORK // GATOR + SENTINEL</p>
    <h1>Work without a new emperor.</h1>
    ${nav()}
    ${chips()}
    ${path("WORK")}
    <p class="mute">Running LOGIN-NEWEST proof…</p>
  `;
  const proof = await runLoginNewest({ name: "Josh", failFirst: true });
  app.innerHTML = `
    <p class="kicker">NODED WORK // GATOR + SENTINEL</p>
    <h1>Work without a new emperor.</h1>
    ${nav()}
    ${chips()}
    ${path("HOME")}
    <p class="vg06">${VISUAL_GRAMMAR_06.replaceAll("\n", "<br />")}</p>
    <div class="panel">
      <p class="kicker">First pull</p>
      <pre>${proof.first.failed ? proof.first.scar.event : "make succeeded"}
scar ${proof.first.scar?.id ?? "none"} stays visible
gator may knot? ${proof.gatorMayNotKnot.ok}
sentinel may execute? ${proof.sentinelMayNotExecute.ok}
mapped, carried for human? ${proof.mapped.carriedForHuman}</pre>
    </div>
    <div class="panel">
      <p class="kicker">Next pull</p>
      <pre>required ${JSON.stringify(proof.nextPull.required)}
retry without support ${proof.blockedRetry.ok ? "passed (wrong)" : "refused"}
retry with support ${proof.supportedRetry.ok ? "executed" : "failed"}
weight reset? ${proof.weightResult.reset.ok}</pre>
    </div>
    <div class="receipt">
      <div class="kicker" style="color:#6a4c12">RECEIPT</div>
      <pre style="color:#2a2418">${proof.receipt.id}
${JSON.stringify(proof.receipt.payload, null, 2)}
hash ${proof.receipt.receiptHash}
knot by ${proof.knot.by}</pre>
    </div>
    <p class="dim">Home: ${proof.home.thingId}. Scars visible. Weight intact. Still not carried.</p>
    ${footer()}
  `;
}

if (view === "airlock") airlockView();
else if (view === "proof") proofView();
else spineView();
