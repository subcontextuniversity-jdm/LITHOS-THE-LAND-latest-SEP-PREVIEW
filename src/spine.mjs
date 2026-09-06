import {
  CAPABILITY_RULE,
  SPINE_LAW,
  SWITCHBOARD,
  WORKERS,
  VAULTS,
  CONNECTORS,
  EXPERIMENTS,
  SPINE_MAP,
  ALIASES,
  PLACES,
  HONESTY,
  mintPassport,
  grantToWorker,
  routeAsk,
  openGauntlet,
  emailToRecord,
  forgeIntent,
} from "./passport.mjs";
import { VISUAL_GRAMMAR_06, pullGoldenCord, WORKER } from "./law.mjs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function startSpine(root, { human, onBack }) {
  const ac = new AbortController();
  const { signal } = ac;
  const who = human ?? { id: "human-josh", name: "Josh", role: "CURSOR" };
  const state = {
    vault: "github-dev",
    worker: "FORGE",
    passport: null,
    grant: null,
    route: null,
    gauntlet: null,
    mail: null,
    forge: null,
    error: "",
    overlay: null,
  };

  function honesty() {
    return `<div class="proof-honesty">
      <span>CONNECTORS ${HONESTY.connectors}</span>
      <span>SECRETS ${HONESTY.secrets}</span>
      <span>AUTHORIZATION ${HONESTY.authorization}</span>
      <span>HANDOFF 003 ${HONESTY.handoff003}</span>
    </div>`;
  }

  function render() {
    const vaults = VAULTS.map(
      (item) =>
        `<button class="chip ${state.vault === item.id ? "on" : ""}" type="button" data-act="vault" data-id="${item.id}">${escapeHtml(item.label)}</button>`,
    ).join("");
    const workers = Object.keys(WORKERS)
      .map(
        (name) =>
          `<button class="chip ${state.worker === name ? "on" : ""}" type="button" data-act="worker" data-id="${name}">${name}</button>`,
      )
      .join("");
    const bay = CONNECTORS.map((item) => {
      const flags = item.flags;
      return `<article class="bay-card glass ${item.state.toLowerCase()}">
        <div class="tiny">${item.state} · ${escapeHtml(item.knows)}</div>
        <strong>${escapeHtml(item.name)}</strong>
        <p class="flag-row">
          <span>${flags.connected ? "CONNECTED" : "UNCONNECTED"}</span>
          <span>${flags.read ? "READ" : "NO READ"}</span>
          <span>${flags.write ? "WRITE" : "NO WRITE"}</span>
          <span>${flags.humanApproval ? "HUMAN APPROVAL" : "UNBOUND"}</span>
          <span>${flags.localOnly ? "LOCAL ONLY" : "REMOTE"}</span>
          <span>EXPIRY ${flags.expiry ?? "—"}</span>
          <span>LAST USED ${flags.lastUsed ?? "—"}</span>
        </p>
      </article>`;
    }).join("");
    const experiments = EXPERIMENTS.map(
      (item) => `<button class="exp-card glass ${item.state.toLowerCase()}" type="button" data-act="exp" data-id="${item.id}">
        <div class="tiny">${item.id} · ${item.state}</div>
        <strong>${escapeHtml(item.name)}</strong>
        <p class="lede">${escapeHtml(item.note)}</p>
      </button>`,
    ).join("");
    const models = ["Claude", "ChatGPT", "Gemini", "Grok", "Lumo", "local"]
      .map((name) => `<div class="model-pane glass"><div class="tiny">PANE</div><strong>${name}</strong></div>`)
      .join("");

    root.innerHTML = `<section class="spine">
      <header class="proof-bar">
        <span class="brand">LITHOS//SPINE</span>
        <span>CREDENTIAL BOUNDARY</span>
        <button class="linkish" data-act="back" type="button">LAND</button>
      </header>
      ${honesty()}
      <div class="land-body spine-body">
        <p class="stage-note">Twelve experiments. Not twelve products.</p>
        <h1>${escapeHtml(CAPABILITY_RULE)}</h1>
        <p class="lede">Firefox faces the models. Proton holds the spine. The model is a worker selected by the OS.</p>
        <pre class="chain">${SWITCHBOARD.join(" → ")}</pre>
        <pre class="tree-card">${escapeHtml(SPINE_LAW)}</pre>
        <pre class="spine-map">${escapeHtml(SPINE_MAP)}</pre>
        <div class="grammar-list">${Object.entries(WORKERS)
          .map(([key, value]) => `<div>${key} <span>= ${value}</span></div>`)
          .join("")}</div>

        <div class="tiny">PATCH BAY</div>
        <div class="bay-grid">${bay}</div>

        <div class="tiny">Mint a passport · scope, not a password</div>
        <div class="actions wrap">${vaults}</div>
        <div class="actions wrap">${workers}</div>
        <div class="actions">
          <button class="btn" data-act="mint" type="button">Mint passport</button>
          <button class="btn ghost" data-act="grant" type="button">Grant to worker</button>
        </div>
        <p class="error">${escapeHtml(state.error)}</p>
        ${
          state.passport
            ? `<pre class="tree-card">${escapeHtml(
                JSON.stringify(
                  {
                    id: state.passport.id,
                    vault: state.passport.vault,
                    worker: state.passport.worker,
                    scope: state.passport.scope,
                    holdsSecret: state.passport.holdsSecret,
                    credentialBoundary: state.passport.credentialBoundary,
                    flags: state.passport.flags,
                    grant: state.grant,
                  },
                  null,
                  2,
                ),
              )}</pre>`
            : `<p class="lede">LITHOS records that a connector exists and its permission scope. It never stores the password.</p>`
        }

        <div class="tiny">FIREFOX SWITCHBOARD · SKETCH</div>
        <div class="model-row">${models}</div>
        <div class="actions">
          <button class="btn ghost" data-act="route" type="button">Route a signal</button>
          <button class="btn ghost" data-act="gauntlet" type="button">Open Gauntlet</button>
          <button class="btn ghost" data-act="mail" type="button">Email → record</button>
          <button class="btn ghost" data-act="forge" type="button">/forge repair-lounge</button>
        </div>
        ${state.route ? `<pre class="tree-card">${escapeHtml(JSON.stringify(state.route, null, 2))}</pre>` : ""}
        ${state.gauntlet ? `<pre class="tree-card">${escapeHtml(JSON.stringify(state.gauntlet, null, 2))}</pre>` : ""}
        ${state.mail ? `<pre class="tree-card">${escapeHtml(JSON.stringify(state.mail, null, 2))}</pre>` : ""}
        ${state.forge ? `<pre class="tree-card">${escapeHtml(JSON.stringify(state.forge, null, 2))}</pre>` : ""}

        <p class="lede">Aliases as event sources, not inboxes: ${ALIASES.join(" ")}</p>
        <p class="lede">Slack as Places, not memory: ${PLACES.join(" ")}</p>

        <div class="tiny">Twelve experiments</div>
        <div class="exp-grid">${experiments}</div>

        <pre class="glass plaque">${VISUAL_GRAMMAR_06}</pre>
      </div>
      <button class="cord-rail" data-act="cord" type="button" title="Don't.">
        <span class="cord"></span>
        <span class="cord-label">GOLDEN CORD</span>
      </button>
    </section>`;

    if (state.overlay) {
      const card = document.createElement("div");
      card.className = "overlay";
      card.innerHTML = `<div class="overlay-card glass">
        <div class="tiny">${escapeHtml(state.overlay.title)}</div>
        <h1>${escapeHtml(state.overlay.message)}</h1>
        <p class="lede">${escapeHtml(state.overlay.detail)}</p>
        <div class="actions"><button class="btn" data-act="close" type="button">Leave it alone</button></div>
      </div>`;
      root.append(card);
    }
  }

  root.addEventListener(
    "click",
    async (event) => {
      const act = event.target.closest("[data-act]")?.dataset.act;
      if (!act) return;
      state.error = "";

      if (act === "back") {
        ac.abort();
        onBack();
        return;
      }
      if (act === "close") {
        state.overlay = null;
        render();
        return;
      }
      if (act === "cord") {
        const refused = pullGoldenCord();
        state.overlay = { title: "REJECTED", message: refused.message, detail: refused.detail };
        render();
        return;
      }
      if (act === "vault") {
        state.vault = event.target.closest("[data-id]").dataset.id;
        render();
        return;
      }
      if (act === "worker") {
        state.worker = event.target.closest("[data-id]").dataset.id;
        render();
        return;
      }
      if (act === "mint") {
        const vault = VAULTS.find((item) => item.id === state.vault);
        const minted = await mintPassport({
          vault,
          worker: state.worker.toLowerCase(),
          human: who,
          scope: ["read"],
        });
        if (!minted.ok) {
          state.error = minted.error;
          render();
          return;
        }
        state.passport = minted.passport;
        state.grant = null;
        render();
        return;
      }
      if (act === "grant") {
        if (!state.passport) {
          state.error = "Mint a passport first. Capability is issued, not inherited.";
          render();
          return;
        }
        const granted = grantToWorker(state.passport, { id: WORKER.id, name: state.worker });
        if (!granted.ok) {
          state.error = granted.error;
          render();
          return;
        }
        state.grant = granted.grant;
        render();
        return;
      }
      if (act === "route") {
        state.route = routeAsk({ kind: "signal", recordRef: "SIGNAL://1" });
        render();
        return;
      }
      if (act === "gauntlet") {
        state.gauntlet = openGauntlet({ uncertain: true });
        render();
        return;
      }
      if (act === "mail") {
        state.mail = emailToRecord({ id: "EMAIL://9341" });
        render();
        return;
      }
      if (act === "forge") {
        state.forge = forgeIntent("repair-lounge", who);
        render();
        return;
      }
      if (act === "exp") {
        const item = EXPERIMENTS.find((entry) => entry.id === event.target.closest("[data-id]").dataset.id);
        state.overlay = {
          title: `${item.state} · ${item.id}`,
          message: item.name,
          detail: item.note,
        };
        render();
      }
    },
    { signal },
  );

  render();
  return {
    stop() {
      ac.abort();
    },
  };
}
