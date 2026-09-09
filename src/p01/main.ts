import "./styles.css";
import { CANONICAL_NOTE_ID, ObjectStore } from "./object.ts";
import { PassEngine, seedGrants } from "./pass.ts";
import { ReceiptLedger } from "./receipts.ts";
import type { EvidenceBinding } from "./receipts.ts";
import { Hermes, HERMES_RUNTIME } from "./hermes.ts";
import { isPending } from "./environment.ts";
import { noteSurface, workbenchSurface } from "./surfaces.ts";

// P01 NOTE PROOF — one canonical object rendered through two surfaces, every
// action scoped by a real PASS, every attempt receipted. The runtime for the
// model/describe step is a labelled local stub: LM Studio is not connected here.

const store = new ObjectStore();
const ledger = new ReceiptLedger();
const pass = new PassEngine(store, ledger);
const hermes = new Hermes(pass, ledger);
const grants = seedGrants();

let humanDraft = "Electrician confirmed Thursday 9am.";
let lastEvent = "";

const root = document.querySelector<HTMLDivElement>("#p01")!;

function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
}

// Render the run-level evidence binding: the answer to "how do we know Hermes
// didn't fake it?". PENDING fields (require Docker / registry / live model) are
// visibly marked rather than dressed up as bound.
function renderBinding(b: EvidenceBinding): string {
  const val = (v: string) => (isPending(v) ? `<span class="pending">${esc(v)}</span>` : esc(v));
  const rows: [string, string][] = [
    ["image digest (S-SHASH)", val(b.imageDigest)],
    ["model", esc(b.modelId)],
    ["model-file hash", val(b.modelFileHash)],
    ["MCP version", val(b.mcpVersion)],
    ["toolset version", esc(b.toolsetVersion)],
    ["input object", `${esc(b.inputObject)} · ${esc(b.inputHash)}`],
    ["granted caps", esc(b.grantedCapabilities.join(", "))],
    ["network", esc(b.network)],
    ["started / done", `${esc(b.startedAt)} → ${esc(b.completedAt)}`],
    ["output", `${esc(b.outputHash)} @ ${esc(b.outputLocation)}`],
    ["exit / validation", `${esc(b.exitStatus)} · ${esc(b.validation)}`],
  ];
  return `<div class="binding"><div class="binding-tag">EVIDENCE BINDING</div>${rows
    .map(([k, v]) => `<div class="brow"><span class="bk">${k}</span><span class="bv">${v}</span></div>`)
    .join("")}</div>`;
}

function saveHumanUpdate(): void {
  const text = humanDraft.trim();
  if (!text) return;
  const res = pass.invoke("HUMAN:JOSH", CANONICAL_NOTE_ID, "note.update", { append: text });
  lastEvent = res.ok
    ? `HUMAN:JOSH · note.update · ${res.receipt.verification} · ${res.receipt.evidence}`
    : `HUMAN:JOSH · note.update · ${res.receipt.verification} · ${res.receipt.evidence}`;
  humanDraft = "";
  render();
}

function runHermes(): void {
  const out = hermes.run({
    objectId: CANONICAL_NOTE_ID,
    intent: "Describe NOTE-0042 and append one authorised operator update.",
    allowedTools: ["note.read", "note.describe", "note.update"],
    requestedUpdate: "Operator: confirmed tiling delivery date.",
  });
  lastEvent = `HERMES · ${out.status} · used [${out.actionsUsed.join(", ")}] · desc: ${out.description ?? "—"}`;
  render();
}

function attemptForbidden(): void {
  // Directly request a capability that no PASS grants — bypassing any UI gate.
  const res = pass.invoke("WORKER:HERMES", CANONICAL_NOTE_ID, "note.delete");
  lastEvent = `HERMES · note.delete · ${res.receipt.verification} · ${res.receipt.evidence}`;
  render();
}

function render(): void {
  const note = noteSurface(store, CANONICAL_NOTE_ID);
  const wb = workbenchSurface(store, CANONICAL_NOTE_ID, grants, ledger.all(), HERMES_RUNTIME);

  root.innerHTML = `
  <header class="top">
    <div class="brand">◆ LITHOS // P01 — NOTE PROOF</div>
    <div class="spine">OBJECT ONCE → RENDER MANY → SCOPE EVERY ACTION → RECEIPT THE WORK</div>
  </header>
  <p class="runtime-note">runtime: ${esc(HERMES_RUNTIME)} — the model/describe step is a local deterministic stub; the object · PASS · worker · receipt loop is real and enforced.</p>

  <main class="layout">
    <!-- NOTE surface: calm, human-facing -->
    <section class="panel">
      <div class="panel-head"><span>NOTE</span><span class="panel-tag">HUMAN SURFACE</span></div>
      <div class="panel-body">
        <h1 class="note-title">${esc(note.title)}</h1>
        <span class="chip">${note.status}</span>
        <div class="note-body">${esc(note.body)}</div>
        <div class="row">
          <input id="human-draft" class="txt" placeholder="Add an update…" value="${esc(humanDraft)}" />
          <button class="act" id="save">Save update</button>
        </div>
        <div class="note-foot">Nothing here about workers, models, scopes or receipts. Just the note.</div>
      </div>
    </section>

    <!-- WORKBENCH surface: operator-facing -->
    <section class="panel">
      <div class="panel-head"><span>WORKBENCH</span><span class="panel-tag">OPERATOR SURFACE · same NOTE-0042</span></div>
      <div class="panel-body">
        <div class="kv">
          <span class="k">object</span><span class="v mono-amber">${wb.identity}</span>
          <span class="k">representation</span><span class="v">${wb.representation}</span>
          <span class="k">revision</span><span class="v">${wb.revision}</span>
          <span class="k">canonical count</span><span class="v">${wb.canonicalCount} <span style="color:var(--ink-faint)">(exactly one — no copies)</span></span>
          <span class="k">runtime</span><span class="v">${esc(wb.runtime)}</span>
          <span class="k">verification</span><span class="v"><span class="v-VERIFIED">${wb.verificationSummary.verified} VERIFIED</span> · <span class="v-BLOCKED">${wb.verificationSummary.blocked} BLOCKED</span> · <span class="v-FAILED">${wb.verificationSummary.failed} FAILED</span></span>
        </div>

        <div class="controls">
          <button class="act" id="hermes">Run HERMES job</button>
          <button class="act danger" id="forbidden">Attempt forbidden: note.delete</button>
        </div>

        <div class="subhead">PASS GRANTS (actor + object + capability + scope)</div>
        <div class="grants">
          ${grants.map((g) => `<div class="grant"><span class="who">${g.actor}</span> on ${g.object} · <span class="caps">[${g.capabilities.join(", ")}]</span> · scope ${g.scope}</div>`).join("")}
          <div class="grant"><span class="caps">note.delete granted to no one → always BLOCKED</span></div>
        </div>

        <div class="subhead">LINEAGE (revision history — inspectable evidence)</div>
        ${wb.lineage.length === 0 ? `<div class="lin">no mutations yet</div>` : wb.lineage.map((l) => `<div class="lin">rev <span class="amber">${l.revision}</span> · ${esc(l.by)} · ${l.capability} · ${l.hashBefore} → ${l.hashAfter}</div>`).join("")}

        <div class="subhead">RECEIPTS (${wb.receipts.length})</div>
        ${wb.receipts.length === 0 ? `<div class="lin">no receipts yet — act on the object to generate evidence</div>` : wb.receipts.slice().reverse().map((r) => `
          <div class="receipt">
            <div class="rid">${r.receiptId} · ${r.at}</div>
            <div class="line1"><span class="cap">${esc(r.actor)} → <b>${r.capability}</b> on ${r.object}</span><span class="verdict v-${r.verification}">${r.verification}</span></div>
            <div class="ev">scope ${esc(r.scope)} · ${r.decision} · ${esc(r.evidence)}</div>
            ${r.binding ? renderBinding(r.binding) : ""}
          </div>`).join("")}
      </div>
    </section>
  </main>

  <footer class="foot">
    <span>complex underneath · calm above</span>
    <span>${lastEvent ? "last: " + esc(lastEvent) : "no fake green lights — VERIFIED only with evidence"}</span>
    <span>JOSH → OBJECT → PASS → WORKER → WORK → RECEIPT</span>
  </footer>`;

  wire();
}

function wire(): void {
  const draft = document.querySelector<HTMLInputElement>("#human-draft");
  draft?.addEventListener("input", (e) => { humanDraft = (e.target as HTMLInputElement).value; });
  document.querySelector<HTMLButtonElement>("#save")?.addEventListener("click", saveHumanUpdate);
  document.querySelector<HTMLButtonElement>("#hermes")?.addEventListener("click", runHermes);
  document.querySelector<HTMLButtonElement>("#forbidden")?.addEventListener("click", attemptForbidden);
}

render();
