import { beats } from "./beats.mjs";
import { VISUAL_GRAMMAR_06, GRAMMAR, SLICE_PATH } from "./law.mjs";

const THINGIVERSE = [
  "strap clip",
  "cable comb",
  "lens hood",
  "phone jig",
  "bench hook",
  "spool cup",
  "rasp mount",
  "door latch",
  "tripod shoe",
  "key plate",
  "hdmi catch",
  "lamp arm",
];

function el(html) {
  const wrap = document.createElement("div");
  wrap.innerHTML = html.trim();
  return wrap.firstElementChild;
}

function screenThingiverse() {
  const cells = THINGIVERSE.map(
    (name) => `<article class="thing-cell"><div class="iso"></div><span>${name}</span></article>`,
  ).join("");
  return `<div class="screen-frame">
    <div class="screen-label">SCREEN // COMMONS GRID</div>
    <div class="thing-grid">${cells}</div>
  </div>`;
}

function screenBelong() {
  return `<pre class="chain">HUMAN
  ↓
PLACE
  ↓
SCOPE
  ↓
WORK
  ↓
RECEIPT
  ↓
HOME</pre>`;
}

function screenYou() {
  return `<pre class="you-tree">YOU
│
├── PEOPLE
├── PLACES
├── THINGS
├── AGENTS
├── TOOLS
└── PROVIDERS</pre>`;
}

function screenToaster() {
  return `<div class="toaster">
    <header>Toaster.exe</header>
    <div class="body">
      Installing optional seasoning…
      <div class="stamp">BLOCKCHAIN ADDED TO TOASTER // REJECTED</div>
    </div>
  </div>`;
}

function screenNudge() {
  return `<div class="msn">
    <header>MSN Messenger</header>
    <div class="body"><strong>MSN NUDGE DETECTED</strong><br>Someone wants you to look at the window.</div>
  </div>`;
}

function screenSlice() {
  return `<pre class="path">${SLICE_PATH.join("\n→ ")}</pre>`;
}

function screenPath() {
  return `<div class="path">HUMAN → PLACE → SCOPE → WORK → RECEIPT → HOME</div>`;
}

function voiceHtml(beat, typed) {
  let text = typed ?? beat.text;
  if (beat.emphasis && text.includes(beat.emphasis)) {
    text = text.replace(beat.emphasis, `<em>${beat.emphasis}</em>`);
  }
  if (beat.strong) {
    text = `<strong>${text}</strong>`;
  }
  return `${text}<span class="cursor"></span>`;
}

function renderBeat(beat, typed) {
  if (beat.type === "stage") {
    return `<p class="stage-note">${beat.text}</p>`;
  }
  if (beat.type === "say") {
    return `<p class="voice">${voiceHtml(beat, typed)}</p>`;
  }
  if (beat.type === "quote") {
    return `<p class="quote">“${beat.text}”</p>`;
  }
  if (beat.type === "pause") {
    return `<p class="voice"><span class="cursor"></span></p>`;
  }
  if (beat.type === "list") {
    const chips = beat.items.map((item) => `<span class="chip">${item}</span>`).join("");
    return `<div class="silo-list">${chips}</div>`;
  }
  if (beat.type === "glyph") {
    return `<div class="glyph-card"><span class="k">${beat.key}</span><span class="v">${beat.value}</span></div>`;
  }
  if (beat.type === "grammar") {
    return `<pre class="grammar-lock">${VISUAL_GRAMMAR_06}</pre>`;
  }
  if (beat.type === "grammar-list") {
    return `<div class="grammar-list">${Object.entries(GRAMMAR)
      .map(([key, value]) => `<div>${key} <span>= ${value}</span></div>`)
      .join("")}</div>`;
  }
  if (beat.type === "cursor-only") {
    return `<p class="voice"><span class="cursor"></span></p>`;
  }
  if (beat.type === "thread") {
    return `<div class="thread-line"></div>`;
  }
  if (beat.type === "early") {
    return `<div class="early">
      <div>YOU'RE EARLY.</div>
      <div>DON'T TELL EVERYONE.</div>
      <div class="later">...actually tell a few people.</div>
    </div>`;
  }
  if (beat.type === "screen") {
    const screens = {
      thingiverse: screenThingiverse,
      belong: screenBelong,
      toaster: screenToaster,
      you: screenYou,
      nudge: screenNudge,
      slice: screenSlice,
      path: screenPath,
    };
    return screens[beat.id]?.() ?? "";
  }
  return "";
}

function durationFor(beat) {
  if (beat.type === "pause") return 1100;
  if (beat.type === "say") return Math.min(5200, 900 + beat.text.length * 28);
  if (beat.type === "quote") return 3200;
  if (beat.type === "screen" && beat.id === "nudge") return 2600;
  if (beat.type === "screen") return 2400;
  if (beat.type === "list") return 2200;
  if (beat.type === "grammar") return 4200;
  if (beat.type === "early") return 3600;
  if (beat.type === "thread") return 1600;
  if (beat.type === "cursor-only") return 1400;
  return 1600;
}

export function startKeynote(root, { onDone }) {
  let index = 0;
  let timer = 0;
  let typingTimer = 0;
  let closed = false;

  const skip = el(`<button class="skip" type="button">Skip to enter</button>`);
  skip.addEventListener("click", finish);

  function finish() {
    if (closed) return;
    closed = true;
    window.clearTimeout(timer);
    window.clearInterval(typingTimer);
    window.removeEventListener("keydown", onKey);
    root.removeEventListener("click", onClick);
    skip.remove();
    onDone();
  }

  function paint(html) {
    root.innerHTML = `<section class="stage">${html}</section>`;
    root.append(skip);
  }

  function play() {
    if (closed) return;
    if (index >= beats.length) {
      finish();
      return;
    }
    const beat = beats[index];
    window.clearInterval(typingTimer);

    if (beat.type === "say") {
      let i = 0;
      const full = beat.text;
      paint(renderBeat(beat, ""));
      typingTimer = window.setInterval(() => {
        i += 1;
        const voice = root.querySelector(".voice");
        if (voice) voice.innerHTML = voiceHtml(beat, full.slice(0, i));
        if (i >= full.length) window.clearInterval(typingTimer);
      }, 18);
    } else {
      paint(renderBeat(beat));
    }

    timer = window.setTimeout(() => {
      index += 1;
      play();
    }, durationFor(beat));
  }

  function onClick(event) {
    if (event.target.closest(".skip")) return;
    window.clearTimeout(timer);
    index += 1;
    play();
  }

  function onKey(event) {
    if (event.key === "Escape") {
      finish();
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      window.clearTimeout(timer);
      index += 1;
      play();
    }
  }

  window.addEventListener("keydown", onKey);
  root.addEventListener("click", onClick);
  play();

  return { stop: finish };
}
