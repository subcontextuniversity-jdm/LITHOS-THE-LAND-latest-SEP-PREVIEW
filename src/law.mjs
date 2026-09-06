export const VISUAL_GRAMMAR_06 = `The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.`;

export const GRAMMAR = Object.freeze({
  THREAD: "relationship",
  GLYPH: "rule",
  SCAR: "learning",
  WEIGHT: "memory",
  KNOT: "decision",
  CURSOR: "human",
});

export const SLICE_PATH = Object.freeze([
  "ENTER",
  "HUMAN",
  "HOME",
  "PLACE",
  "INTENT",
  "WORKER",
  "SCOPE",
  "ACTION",
  "RECEIPT",
  "HOME",
]);

export const GOLDEN_CORD = Object.freeze({
  ok: false,
  rejected: true,
  code: "GOLDEN_CORD",
  message: "DON'T PULL THE GOLDEN CORD.",
  detail:
    "Not the empire. Not the token. Not 120 screens explaining what someday might exist. One honest vertical slice.",
});

export const PLACE = Object.freeze({
  id: "bench",
  name: "THE BENCH",
  kind: "workshop",
  where: "A maker place. Not an application.",
});

export const WORKER = Object.freeze({
  id: "carrier",
  name: "BOUNDED CARRIER",
  provider: "local",
  can: Object.freeze([
    "propose",
    "search",
    "build",
    "route",
    "remember",
    "execute_within_scope",
  ]),
  cannot: Object.freeze([
    "tie_knot",
    "acquire_sovereignty",
    "leave_place",
    "pull_golden_cord",
  ]),
});

export const SCOPE_GLYPHS = Object.freeze([
  {
    id: "read_thing",
    label: "Read this Thing",
    allowed: true,
  },
  {
    id: "read_lineage",
    label: "Read lineage",
    allowed: true,
  },
  {
    id: "propose_remix",
    label: "Propose a remix",
    allowed: true,
  },
  {
    id: "attempt_make",
    label: "Attempt a make",
    allowed: true,
  },
  {
    id: "leave_scar",
    label: "Leave a scar",
    allowed: true,
  },
  {
    id: "write_receipt",
    label: "Write a receipt",
    allowed: true,
  },
  {
    id: "tie_knot",
    label: "Tie the knot",
    allowed: false,
    reason: "KNOT = DECISION. CURSOR = HUMAN.",
  },
  {
    id: "sovereignty",
    label: "Own the human",
    allowed: false,
    reason: "Providers supply capability, never sovereignty.",
  },
  {
    id: "golden_cord",
    label: "Pull the golden cord",
    allowed: false,
    reason: "DON'T PULL THE GOLDEN CORD.",
  },
]);

const ALLOWED_GRANT_IDS = new Set(
  SCOPE_GLYPHS.filter((glyph) => glyph.allowed).map((glyph) => glyph.id),
);

function slug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function bindHuman(name) {
  const trimmed = String(name ?? "").trim();
  if (!trimmed) {
    return { ok: false, error: "CURSOR = HUMAN. A name is required." };
  }
  return {
    ok: true,
    human: {
      id: `human-${slug(trimmed) || "cursor"}`,
      name: trimmed,
      role: "CURSOR",
      boundAt: Date.now(),
    },
  };
}

export function seedThing() {
  return {
    id: "thing-001",
    name: "THE CARRY CLIP",
    source: "A commons shaped like Thingiverse, around 2016.",
    note: "A clip for a camera strap. Photography became geometry.",
    remixed: null,
    carried: false,
    weight: 1,
    lineage: [
      {
        at: "2016",
        event: "Someone uploaded a bag clip.",
        who: "unknown maker",
      },
      {
        at: "2017",
        event: "Remixed for a DSLR strap.",
        who: "a photographer",
      },
      {
        at: "2017",
        event: "Print failed. Overhang on the jaw collapsed.",
        who: "a printer",
        scar: true,
      },
      {
        at: "2018",
        event: "Jaw split so it prints flat.",
        who: "a remixer",
      },
    ],
    scars: [
      {
        id: "scar-overhang",
        event: "Overhang on the jaw collapsed.",
        learning: "Print the jaw split, then assemble.",
        at: "2017",
      },
    ],
  };
}

export function grantScope({ human, place, thing, worker, grants }) {
  if (!human?.id) {
    return { ok: false, error: "Who is asking?" };
  }
  if (!place?.id || !thing?.id || !worker?.id) {
    return { ok: false, error: "Where does this belong?" };
  }

  const uniqueGrants = [...new Set(grants ?? [])];
  const illegal = uniqueGrants.filter((id) => !ALLOWED_GRANT_IDS.has(id));
  if (illegal.length) {
    return {
      ok: false,
      error: "GLYPH rejected.",
      illegal,
    };
  }

  return {
    ok: true,
    scope: {
      humanId: human.id,
      placeId: place.id,
      thingId: thing.id,
      workerId: worker.id,
      grants: uniqueGrants,
      grantedAt: Date.now(),
    },
  };
}

export function assertScope(scope, grantId, { human, place, thing, worker } = {}) {
  if (!scope) {
    return { ok: false, error: "No scope. Intelligence without relationships becomes another silo." };
  }
  if (human && scope.humanId !== human.id) {
    return { ok: false, error: "This scope is not yours." };
  }
  if (place && scope.placeId !== place.id) {
    return { ok: false, error: "Worker may not leave the place." };
  }
  if (thing && scope.thingId !== thing.id) {
    return { ok: false, error: "Worker may not touch another Thing." };
  }
  if (worker && scope.workerId !== worker.id) {
    return { ok: false, error: "Wrong worker." };
  }
  if (grantId && !scope.grants.includes(grantId)) {
    return { ok: false, error: `Out of scope: ${grantId}.` };
  }
  return { ok: true };
}

export function pullGoldenCord() {
  return { ...GOLDEN_CORD };
}

export function inspectLineage(thing, scope, ctx) {
  const scoped = assertScope(scope, "read_lineage", ctx);
  if (!scoped.ok) return scoped;
  return {
    ok: true,
    thingId: thing.id,
    lineage: thing.lineage,
    scars: thing.scars,
    weight: thing.weight,
    grammar: VISUAL_GRAMMAR_06,
  };
}

function currentYear() {
  return String(new Date().getFullYear());
}

export function proposeRemix(thing, scope, ctx) {
  const scoped = assertScope(scope, "propose_remix", ctx);
  if (!scoped.ok) return scoped;

  const scars = thing.scars ?? [];
  const weight = thing.weight ?? 0;
  const proposals = [];

  const overhangScar = scars.some((scar) => /overhang/i.test(scar.event));
  if (overhangScar) {
    proposals.push({
      id: "print-flat",
      title: "Keep the jaw split. Print it flat.",
      why: "Scar is evidence. The overhang already taught this.",
    });
  }

  if (weight >= 2) {
    proposals.push({
      id: "receipt-clip",
      title: "Turn the clip into a receipt carrier.",
      why: "Weight is consequence. This Thing has been asked to remember.",
    });
  } else {
    proposals.push({
      id: "wider-jaw",
      title: "Widen the jaw for 25mm webbing.",
      why: "A camera strap still wants to belong to a bag.",
    });
  }

  if (weight >= 3) {
    proposals.unshift({
      id: "scar-channel",
      title: "Cut a scar-channel into the body.",
      why: "Memory changes the next pull. Do not polish the failure away.",
    });
  }

  proposals.push({
    id: "unchanged",
    title: "Carry it forward unchanged.",
    why: "Not every pull needs a remix.",
  });

  return {
    ok: true,
    proposals,
    grammar: VISUAL_GRAMMAR_06,
  };
}

export function tieKnot(human, choiceId) {
  if (!human?.id) {
    return { ok: false, error: "KNOT = DECISION. The human ties the knot." };
  }
  if (!choiceId) {
    return { ok: false, error: "A knot needs a choice." };
  }
  return {
    ok: true,
    knot: {
      by: human.id,
      byName: human.name,
      choice: choiceId,
      at: Date.now(),
    },
  };
}

export function applyRemix(thing, proposal, human) {
  const next = structuredClone(thing);
  next.remixed = proposal.id;
  next.weight = (next.weight ?? 0) + 1;
  next.lineage = [
    ...(next.lineage ?? []),
    {
      at: currentYear(),
      event: proposal.title,
      who: human.name,
    },
  ];
  return next;
}

export function attemptMake(thing, scope, ctx) {
  const scoped = assertScope(scope, "attempt_make", ctx);
  if (!scoped.ok) return scoped;

  if (thing.remixed === "wider-jaw") {
    const scarred = leaveScar(
      thing,
      "Make failed. Widening the jaw brought the overhang back.",
      "Weight is consequence. A new pull can re-open an old scar.",
    );
    return {
      ok: true,
      succeeded: false,
      thing: scarred,
      message: "The thread broke. The scar stays.",
    };
  }

  const addressed =
    thing.remixed === "print-flat" ||
    thing.remixed === "scar-channel" ||
    (thing.lineage ?? []).some((entry) => /split|print it flat|prints flat/i.test(entry.event));

  if (!addressed) {
    const scarred = leaveScar(
      thing,
      "Make failed. The jaw overhang collapsed again.",
      "The scar was already there. Ignoring it is not a new idea.",
    );
    return {
      ok: true,
      succeeded: false,
      thing: scarred,
      message: "The thread broke. The scar stays.",
    };
  }

  const next = structuredClone(thing);
  next.weight = (next.weight ?? 0) + 1;
  next.lineage = [
    ...(next.lineage ?? []),
    {
      at: currentYear(),
      event: "Make succeeded. The clip held.",
      who: ctx?.human?.name ?? "human",
    },
  ];
  return {
    ok: true,
    succeeded: true,
    thing: next,
    message: "It held. The receipt can go home.",
  };
}

export function leaveScar(thing, event, learning) {
  const next = structuredClone(thing);
  const at = currentYear();
  const scar = {
    id: `scar-${Date.now()}`,
    event,
    learning,
    at,
  };
  next.scars = [...(next.scars ?? []), scar];
  next.weight = (next.weight ?? 0) + 1;
  next.lineage = [
    ...(next.lineage ?? []),
    { at, event, who: "this slice", scar: true },
  ];
  return next;
}

export function carryHome(thing, human) {
  const next = structuredClone(thing);
  next.carried = true;
  next.weight = (next.weight ?? 0) + 1;
  next.lineage = [
    ...(next.lineage ?? []),
    {
      at: currentYear(),
      event: "Carried forward. The Thing left the application that created it.",
      who: human.name,
    },
  ];
  return next;
}

export async function writeReceipt({
  human,
  place,
  worker,
  scope,
  action,
  result,
}) {
  const scoped = assertScope(scope, "write_receipt", { human, place, worker });
  if (!scoped.ok) return scoped;

  const body = {
    human: { id: human.id, name: human.name },
    place: { id: place.id, name: place.name },
    worker: { id: worker.id, name: worker.name, provider: worker.provider },
    scope: { grants: scope.grants },
    action,
    result,
    at: new Date().toISOString(),
  };
  const hash = await sha256(stableStringify(body));
  return {
    ok: true,
    receipt: {
      ...body,
      id: `rcp-${hash.slice(0, 12)}`,
      hash,
    },
  };
}

export function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

export async function sha256(text) {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.subtle) {
    throw new Error("No subtle crypto.");
  }
  const bytes = new TextEncoder().encode(text);
  const digest = await cryptoApi.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function workerMayNotTieKnot() {
  return {
    ok: false,
    error: "KNOT = DECISION. Agents can execute within scope. The human ties the knot.",
  };
}
