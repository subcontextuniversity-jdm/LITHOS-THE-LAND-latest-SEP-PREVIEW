import "./styles.css";
import type { Category, Glyph, Thing } from "./types.ts";
import { CATEGORIES } from "./types.ts";
import { LEXICON } from "./lexicon.ts";
import { glyphById, isCuratedTerm, search } from "./search.ts";
import { ACCEPTS, TYPE_LABEL, validateBind } from "./binding.ts";
import { seedThings } from "./things.ts";
import { sampleReceipt } from "./receipt.ts";
import {
  LAW_06_REPRESENTATION_IS_NOT_IDENTITY,
  VISUAL_GRAMMAR_06,
} from "./constitution.ts";

type Filter = Category | "ALL";

interface State {
  query: string;
  filter: Filter;
  raw: boolean;
  things: Thing[];
  currentRef: string;
  bind: { ok: boolean; message: string } | null;
}

const state: State = {
  query: "",
  filter: "ALL",
  raw: false,
  things: seedThings(),
  currentRef: "THING://0041",
  bind: null,
};

const app = document.querySelector<HTMLDivElement>("#app")!;

function currentThing(): Thing {
  return state.things.find((t) => t.ref === state.currentRef)!;
}

function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
}

function attemptBind(glyphId: string): void {
  const glyph = glyphById(glyphId);
  const thing = currentThing();
  if (!glyph) return;
  const res = validateBind(glyph, thing);
  if (res.ok) {
    // Lock 1: representation changes; identity, keys and scope do not.
    thing.scars.push({
      at: new Date().toISOString().slice(11, 19) + "Z",
      from: thing.glyphId,
      to: glyph.id,
    });
    thing.glyphId = glyph.id;
    thing.weight += 1;
  }
  state.bind = { ok: res.ok, message: res.message };
  render();
}

function tile(g: Glyph): string {
  return `
    <button class="tile" data-glyph="${g.id}" data-cat="${g.category}" title="${esc(g.meaning)}">
      <span class="tile-mark">${esc(g.mark)}</span>
      <span class="tile-name">${esc(g.name)}</span>
      <span class="chip chip-${g.category}">${g.category}</span>
    </button>`;
}

function renderGrid(): string {
  const results = state.raw
    ? LEXICON.slice()
    : search(state.query, state.filter);
  if (results.length === 0) {
    return `<div class="empty">no glyphs — try HUMAN · PLACE · THING · or search "boundary"</div>`;
  }
  return `<div class="grid">${results.map(tile).join("")}</div>`;
}

function renderTabs(): string {
  const tabs: Filter[] = ["ALL", ...CATEGORIES];
  return tabs
    .map(
      (t) =>
        `<button class="tab ${state.filter === t ? "on" : ""}" data-tab="${t}">${t}</button>`,
    )
    .join("");
}

function renderThingSelect(): string {
  return state.things
    .map(
      (t) =>
        `<option value="${t.ref}" ${t.ref === state.currentRef ? "selected" : ""}>${t.ref} · ${esc(t.name)}</option>`,
    )
    .join("");
}

function renderInspector(): string {
  const t = currentThing();
  const g = glyphById(t.glyphId)!;
  const accepts = ACCEPTS[t.type].join(" · ");
  return `
    <div class="thing-head">
      <div class="thing-mark">${esc(g.mark)}</div>
      <div>
        <div class="thing-ref">${t.ref}</div>
        <div class="thing-sub">type ${TYPE_LABEL[t.type]} · accepts ${accepts}</div>
      </div>
    </div>
    <pre class="tree">THING${esc(t.ref.slice(5))}
├─ type:   ${t.type}
├─ name:   ${esc(t.name)}
├─ glyph:  ${g.id} <span class="muted">(${esc(g.mark)})</span>
├─ accent: ${esc(t.accent)}
├─ state:  ${esc(t.state)}
└─ weight: ${t.weight}   <span class="muted">identity ${t.ref} — unchanged</span></pre>`;
}

function renderBind(): string {
  if (!state.bind) {
    return `<div class="bind idle">Pick a glyph to bind it to ${state.currentRef}. Try binding an ACTION (→) onto STUDIO.</div>`;
  }
  return `<pre class="bind ${state.bind.ok ? "ok" : "err"}">${esc(state.bind.message)}</pre>`;
}

function renderScars(): string {
  const t = currentThing();
  if (t.scars.length === 0) {
    return `<div class="muted small">No scars yet. WEIGHT ${t.weight}.</div>`;
  }
  const rows = t.scars
    .map((s) => `<div class="scar">※ ${s.at} · ${esc(s.from)} → ${esc(s.to)}</div>`)
    .join("");
  return `<div class="scars">${rows}<div class="muted small">WEIGHT ${t.weight} · memory changes the next pull</div></div>`;
}

function renderReceipt(): string {
  const r = sampleReceipt();
  const rows = r.fields
    .map((f) => `<div class="rc-row"><span class="rc-label">${f.label}</span><span class="rc-val">${esc(f.render)}</span></div>`)
    .join("");
  return `<div class="rc-ref">${r.ref}</div>${rows}`;
}

function render(): void {
  const t = currentThing();
  const searchNote = state.query && isCuratedTerm(state.query)
    ? `<span class="curated">curated</span>`
    : state.query
      ? `<span class="freetext">free-text</span>`
      : "";

  app.innerHTML = `
  <div class="crt"></div>
  <header class="topbar">
    <div class="brand">📖 ICON//LEXICON <span class="dim">// EDIT GLYPH</span></div>
    <div class="status"><span>[ WORLD TREE: GERMINATING... ]</span><span>THING://0042 · LOCKED &amp; MAPPED</span></div>
  </header>

  <main class="layout">
    <section class="panel picker">
      <div class="searchrow">
        <input id="search" class="search" placeholder="Search Things, actions, connectors..." value="${esc(state.query)}" ${state.raw ? "disabled" : ""}/>
        ${searchNote}
        <label class="rawtoggle"><input type="checkbox" id="raw" ${state.raw ? "checked" : ""}/> RAW</label>
      </div>
      <div class="tabs ${state.raw ? "disabled" : ""}">${renderTabs()}</div>
      ${renderGrid()}
      <div class="hint">${state.raw ? "RAW — full icon library, no semantic grouping (advanced browsing underneath)." : 'Semantic, searchable. Try <code>boundary</code>, <code>github</code>, or a category tab.'}</div>
    </section>

    <aside class="panel inspector">
      <div class="section-title">THING INSPECTOR</div>
      <label class="pick-label">editing
        <select id="thing">${renderThingSelect()}</select>
      </label>
      ${renderInspector()}
      <div class="section-title">BIND</div>
      ${renderBind()}
      <pre class="law">${esc(LAW_06_REPRESENTATION_IS_NOT_IDENTITY)}</pre>

      <div class="section-title">SCAR // WEIGHT</div>
      ${renderScars()}
      <pre class="law dim-law">${esc(VISUAL_GRAMMAR_06)}</pre>

      <div class="section-title">RECEIPT — one vocabulary, three surfaces</div>
      <div class="receipt">${renderReceipt()}</div>
    </aside>
  </main>
  <footer class="footbar">
    <span>GLYPH CHANGE → SAME THING</span>
    <span>editing ${t.ref}</span>
    <span>[ CONNECTION SPEED: 56K ]</span>
  </footer>`;

  wire();
}

function wire(): void {
  const searchEl = document.querySelector<HTMLInputElement>("#search");
  searchEl?.addEventListener("input", (e) => {
    state.query = (e.target as HTMLInputElement).value;
    const pos = searchEl.selectionStart;
    render();
    const again = document.querySelector<HTMLInputElement>("#search");
    if (again) {
      again.focus();
      if (pos != null) again.setSelectionRange(pos, pos);
    }
  });

  document.querySelector<HTMLInputElement>("#raw")?.addEventListener("change", (e) => {
    state.raw = (e.target as HTMLInputElement).checked;
    render();
  });

  document.querySelector<HTMLSelectElement>("#thing")?.addEventListener("change", (e) => {
    state.currentRef = (e.target as HTMLSelectElement).value;
    state.bind = null;
    render();
  });

  document.querySelectorAll<HTMLButtonElement>(".tab").forEach((b) =>
    b.addEventListener("click", () => {
      state.filter = b.dataset.tab as Filter;
      render();
    }),
  );

  document.querySelectorAll<HTMLButtonElement>(".tile").forEach((b) =>
    b.addEventListener("click", () => attemptBind(b.dataset.glyph!)),
  );
}

render();
