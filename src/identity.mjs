import { adaPropose, selectForWeave } from "./weave.mjs";
import { WORKER, sha256 } from "./law.mjs";
import { CANONICALIZATION, canonicalize } from "./canonical.mjs";
import {
  LEDGER_PERSISTENCE,
  defaultLedger,
  nextDescendantId,
  recallOperation,
  rememberOperation,
} from "./ledger.mjs";

export const WUKONG = "transformation while preserving identity";
export const THE_PROPOSAL_IS_NOT_THE_DECISION = "The proposal is not the decision.";
export const DONT_CUT_THE_THREAD = "DON'T CUT THE THREAD.";
export const SUCCESS = "SAME THING → NEW FORM → HISTORY INTACT";
export const CONVERSION_ROUTE = "SIMULATED";
export const AUTHORIZATION_KIND = "DEMO-ONLY";
export const THING_ID = "THING://0041";
export const DERIVATIVE_ID = "DERIVATIVE://0041-A";

export const PROOF_ACTS = Object.freeze([
  "ARRIVE",
  "TRAVEL",
  "TRANSFORM",
  "REMEMBER",
  "RETURN",
]);

export const FORMS = Object.freeze({
  blend: Object.freeze({ kind: "blend", label: "model.blend", surface: "drafting" }),
  glb: Object.freeze({ kind: "glb", label: "model.glb", surface: "pocket" }),
  stl: Object.freeze({ kind: "stl", label: "model.stl", surface: "workbench" }),
  stage: Object.freeze({ kind: "stage", label: "STAGE INSTANCE", surface: "stage" }),
});

export const SKETCH_JAW = Object.freeze({
  id: "sketch-jaw",
  kind: "sketch",
  title: "Sketch",
  emoji: "✎",
  ref: "SKETCH://JAW",
  to: "SKETCH://JAW",
});

export const DEFAULT_SCOPE = "model-geometry";

function freezeEvent(entry) {
  return Object.freeze({ ...entry });
}

function representationId(thingId, kind) {
  const short = String(thingId).replace(/^THING:\/\//, "").replace(/^DERIVATIVE:\/\//, "D-");
  return `REP://${short}/${kind}`;
}

function simulatedContent(kind, sourceHash) {
  return sourceHash
    ? `SIMULATED ${kind} bytes from ${sourceHash}`
    : `SIMULATED ${kind} bytes for ${THING_ID}`;
}

function refuseNonHumanKnot(actor) {
  if (!actor?.id) {
    return { ok: false, error: "The proposal is not the decision. The human ties the knot." };
  }
  if (actor.role === "ADA" || actor.id === "ADA" || actor.by === "ADA") {
    return { ok: false, error: "ADA proposes. She cannot tie the knot." };
  }
  if (
    actor.role === "WORKER" ||
    actor.id === WORKER.id ||
    actor.cannot?.includes("tie_knot")
  ) {
    return {
      ok: false,
      error: "KNOT = DECISION. Agents can execute within scope. The human ties the knot.",
    };
  }
  return null;
}

export { LEDGER_PERSISTENCE, defaultLedger, resetDefaultLedger } from "./ledger.mjs";

export async function digest(value) {
  return sha256(typeof value === "string" ? value : canonicalize(value));
}

export async function hashContent(bytes) {
  return digest(bytes);
}

export async function sourceRevision(thing) {
  return digest({
    thingId: thing.thingId,
    representations: thing.representations.map((item) => ({
      representationId: item.representationId,
      contentHash: item.contentHash,
    })),
  });
}

export async function ensureHashes(thing) {
  const representations = [];
  for (const item of thing.representations) {
    if (item.contentHash) {
      representations.push(item);
      continue;
    }
    representations.push(
      Object.freeze({
        ...item,
        contentHash: await hashContent(item.content),
      }),
    );
  }
  return { ...thing, representations };
}

export function seedThing0041() {
  const content = simulatedContent("blend");
  const blend = Object.freeze({
    representationId: representationId(THING_ID, "blend"),
    thingId: THING_ID,
    kind: "blend",
    label: "model.blend",
    surface: "drafting",
    content,
    contentHash: null,
    conversion: "IMPORT",
  });
  return {
    thingId: THING_ID,
    id: THING_ID,
    identity: THING_ID,
    name: "THE CARRY CLIP",
    place: "vigil",
    origin: Object.freeze({
      inspectable: true,
      source: "A commons shaped like Thingiverse",
      at: "2016",
      application: "Blender",
      event: "This came from somewhere.",
    }),
    representations: [blend],
    threads: [
      { id: "cover-vigil", to: "ART://COVER", kind: "art", title: "Cover", emoji: "🎨" },
      { id: "audio-vigil", to: "AUDIO://VIGIL", kind: "audio", title: "Theme", emoji: "🎵" },
    ],
    trace: Object.freeze([
      freezeEvent({
        id: "trace-1",
        kind: "IMPORT",
        event: "IMPORT model.blend",
        source: null,
        result: representationId(THING_ID, "blend"),
        outcome: "SUCCESS",
        conversion: "IMPORT",
      }),
    ]),
    scars: Object.freeze([]),
    weight: Object.freeze([]),
    receipts: Object.freeze([]),
    descendants: Object.freeze([]),
    usedApprovals: Object.freeze([]),
    parent: null,
  };
}

export async function convertRepresentation(thing, nextRepresentation) {
  const hashed = await ensureHashes(thing);
  const requested =
    typeof nextRepresentation === "string"
      ? { kind: nextRepresentation }
      : { ...nextRepresentation };
  const fromKind = requested.from ?? hashed.representations.at(-1)?.kind;
  const from = hashed.representations.find((item) => item.kind === fromKind);

  if (requested.fail || !FORMS[requested.kind]) {
    const failure = freezeEvent({
      id: `trace-${hashed.trace.length + 1}`,
      kind: "CONVERT",
      event: `CONVERT ${fromKind ?? "?"} → ${requested.kind} FAILED`,
      source: from?.representationId ?? null,
      result: null,
      outcome: "FAILURE",
      conversion: CONVERSION_ROUTE,
    });
    return {
      ok: false,
      published: false,
      conversion: CONVERSION_ROUTE,
      error: requested.fail
        ? "Conversion failed. No representation published."
        : "Unknown representation. No converter is available.",
      thing: {
        ...hashed,
        thingId: hashed.thingId,
        trace: Object.freeze([...hashed.trace, failure]),
      },
    };
  }

  const catalog = FORMS[requested.kind];
  if (hashed.representations.some((item) => item.kind === catalog.kind)) {
    return {
      ok: false,
      published: false,
      error: "Conversion may not overwrite an existing representation record.",
      thing: hashed,
    };
  }
  if (!from) {
    return { ok: false, published: false, error: "No source representation to convert from.", thing: hashed };
  }

  const content = simulatedContent(catalog.kind, from.contentHash);
  const added = Object.freeze({
    representationId: representationId(hashed.thingId, catalog.kind),
    thingId: hashed.thingId,
    kind: catalog.kind,
    label: requested.label ?? catalog.label,
    surface: requested.surface ?? catalog.surface,
    content,
    contentHash: await hashContent(content),
    conversion: CONVERSION_ROUTE,
  });
  const traceEvent = freezeEvent({
    id: `trace-${hashed.trace.length + 1}`,
    kind: "CONVERT",
    event: `CONVERT ${from.kind} → ${added.kind}`,
    source: from.representationId,
    result: added.representationId,
    outcome: "SUCCESS",
    conversion: CONVERSION_ROUTE,
  });

  return {
    ok: true,
    published: true,
    conversion: CONVERSION_ROUTE,
    thing: {
      ...hashed,
      thingId: hashed.thingId,
      id: hashed.id,
      identity: hashed.identity,
      representations: [...hashed.representations, added],
      trace: Object.freeze([...hashed.trace, traceEvent]),
    },
  };
}

export async function convertBlendGlbStl(thing) {
  const glb = await convertRepresentation(thing, { kind: "glb", from: "blend" });
  if (!glb.ok) return glb;
  const stl = await convertRepresentation(glb.thing, { kind: "stl", from: "glb" });
  if (!stl.ok) return stl;
  return {
    ok: true,
    conversion: CONVERSION_ROUTE,
    thing: stl.thing,
    thingIds: [thing.thingId, glb.thing.thingId, stl.thing.thingId],
  };
}

export function inspectRepresentations(thing) {
  return thing.representations.map((item) => ({
    representationId: item.representationId,
    kind: item.kind,
    label: item.label,
    content: item.content,
    contentHash: item.contentHash,
  }));
}

export function openOn(thing, surface, presentation = {}) {
  if (!thing?.thingId && !thing?.id) {
    return { ok: false, error: "Nothing to open." };
  }
  const representation =
    thing.representations.find((item) => item.surface === surface) ?? thing.representations[0];
  return {
    ok: true,
    thing,
    consequential: false,
    receipt: null,
    view: {
      thingId: thing.thingId,
      id: thing.id,
      identity: thing.identity,
      surface,
      representation,
      name: thing.name,
      presentation: {
        tab: presentation.tab ?? surface,
        viewport: presentation.viewport ?? "browser",
        lastViewed: presentation.lastViewed ?? surface,
      },
    },
  };
}

export function sameIdentity(a, b) {
  const left = a?.thingId ?? a?.identity;
  const right = b?.thingId ?? b?.identity;
  return Boolean(left) && left === right;
}

export function whatAmILookingAt(thing, surface) {
  const names = {
    pocket: "Pocket",
    workbench: "Workbench",
    drafting: "Drafting Table",
    stage: "Stage",
  };
  const place = names[surface] ?? surface;
  return {
    thingId: thing.thingId,
    identity: thing.identity,
    name: thing.name,
    surface: place,
    lookingAt: `${thing.thingId} — ${thing.name}`,
    not: "Not a filename. Not a different object because the surface changed. Not a native application.",
    origin: thing.origin,
    conversion: CONVERSION_ROUTE,
    authorization: AUTHORIZATION_KIND,
    why: "Why is this object the way it is now?",
    answer: `You are looking at ${thing.thingId}. It is ${thing.name}. This ${place} is one browser layout for encountering it. Changing form did not create a new Thing.`,
  };
}

export function retargetThread(thing, fromId, toItem, human) {
  if (!human?.id) {
    return { ok: false, error: "CURSOR = HUMAN. Only the human changes a relationship." };
  }
  if (!toItem?.id) {
    return { ok: false, error: "THREAD needs somewhere to land." };
  }
  const nextThreads = thing.threads.filter((item) => item.id !== fromId);
  if (!nextThreads.some((item) => item.id === toItem.id)) {
    nextThreads.push({
      id: toItem.id,
      to: toItem.ref ?? toItem.to,
      kind: toItem.kind,
      title: toItem.title,
      emoji: toItem.emoji ?? "🧵",
    });
  }
  return {
    ok: true,
    thing: { ...thing, threads: nextThreads },
    changedBy: human.id,
    derivative: null,
  };
}

export function proposeForThing(thing) {
  const selection = thing.threads.map((item) => ({
    id: item.id,
    kind: item.kind,
    title: item.title,
    ref: item.to,
  }));
  const picked = selectForWeave(
    selection.map((item) => item.id),
    selection,
  );
  const proposals = picked.ok ? [...adaPropose(picked.selection).proposals] : [];
  if (thing.weight.some((item) => item.futureFabricationRequiresSupport)) {
    proposals.unshift({
      id: "print-with-support",
      label: "MAKE",
      title: "Print with support",
      why: "Weight is consequence. Future fabrication requires support.",
    });
  }
  return {
    ok: true,
    by: "ADA",
    can: ["propose"],
    cannot: ["tie_knot", "decide"],
    committed: false,
    derivative: null,
    constraint: THE_PROPOSAL_IS_NOT_THE_DECISION,
    proposals,
  };
}

export function deriveThing(parentThing, proposal) {
  if (!parentThing?.thingId && !parentThing?.identity) {
    return { ok: false, error: "Nothing to derive." };
  }
  if (!proposal?.id) {
    return { ok: false, error: "ADA can propose a relationship. She cannot invent the Things." };
  }
  return {
    ok: true,
    committed: false,
    derivative: null,
    awaiting: "KNOT",
    parent: parentThing,
    proposal,
    constraint: THE_PROPOSAL_IS_NOT_THE_DECISION,
  };
}

export function alterProposal(derivation, changes, human) {
  if (!human?.id) {
    return { ok: false, error: "Only the human alters a proposal." };
  }
  return {
    ok: true,
    committed: false,
    derivative: null,
    awaiting: "KNOT",
    parent: derivation.parent,
    proposal: { ...derivation.proposal, ...changes, alteredBy: human.id },
    constraint: THE_PROPOSAL_IS_NOT_THE_DECISION,
  };
}

export async function approvalBinding({ actorId, proposalId, sourceRevision: revision, scope }) {
  return digest({
    actor: actorId,
    proposalId,
    sourceRevision: revision,
    scope,
  });
}

export async function approveKnot(human, { proposal, thing, scope = DEFAULT_SCOPE }) {
  const refused = refuseNonHumanKnot(human);
  if (refused) return refused;
  if (!proposal?.id) {
    return { ok: false, error: "Nothing to approve." };
  }
  const hashed = await ensureHashes(thing);
  const revision = await sourceRevision(hashed);
  const binding = await approvalBinding({
    actorId: human.id,
    proposalId: proposal.id,
    sourceRevision: revision,
    scope,
  });
  return {
    ok: true,
    approval: Object.freeze({
      actor: human.id,
      proposalId: proposal.id,
      sourceRevision: revision,
      scope,
      binding,
      kind: AUTHORIZATION_KIND,
      note: "This is a demo binding, not a digital signature. SHA-256 is integrity, not signatory authentication.",
    }),
  };
}

export function receiptPayload({ operation, actor, scope, decision, inputs, outputs, outcome }) {
  return {
    operation,
    actor: { id: actor.id, name: actor.name, role: actor.role ?? "CURSOR" },
    scope,
    decision,
    inputs,
    outputs,
    outcome,
    authorization: {
      kind: AUTHORIZATION_KIND,
      note: "SHA-256 digest is integrity of the payload, not proof that the named human authorized the action.",
    },
    integrity: { alg: "SHA-256", canonicalization: CANONICALIZATION },
  };
}

export async function hashReceipt(receipt) {
  return digest(receipt.payload ?? receiptPayload(receipt));
}

export async function writeCommittedReceipt({ human, thing, derivative, knot, approval, operation = "derive" }) {
  if (!knot?.by || !derivative?.thingId) {
    return { ok: false, created: false, error: "Receipt is evidence of committed work." };
  }
  const inputs = thing.representations.map((item) => ({
    thingId: item.thingId,
    representationId: item.representationId,
    contentHash: item.contentHash,
  }));
  const outputs = derivative.representations.map((item) => ({
    thingId: item.thingId,
    representationId: item.representationId,
    contentHash: item.contentHash,
  }));
  const payload = receiptPayload({
    operation,
    actor: human,
    scope: approval.scope,
    decision: "KNOT",
    inputs,
    outputs,
    outcome: "committed",
  });
  const receiptHash = await digest(payload);
  return {
    ok: true,
    created: true,
    receipt: Object.freeze({
      id: `RECEIPT://${receiptHash.slice(0, 4).toUpperCase()}`,
      receiptHash,
      payload,
      claim: "EVIDENCE",
      verified: false,
      authorization: AUTHORIZATION_KIND,
    }),
  };
}

export function claimVerified(receipt, verification) {
  if (!verification?.occurred) {
    return {
      ok: false,
      error: "RECEIPT may not claim VERIFIED unless verification actually occurred.",
    };
  }
  return {
    ok: true,
    receipt: { ...receipt, verified: true, claim: "VERIFIED", verification },
  };
}

function idempotentResult(record) {
  return {
    ok: true,
    duplicate: true,
    idempotent: true,
    committed: false,
    parent: record.parent,
    derivative: record.derivative,
    receipt: record.receipt,
    knot: record.knot,
    operationId: record.operationId,
    ledger: { persistence: LEDGER_PERSISTENCE },
    conversion: CONVERSION_ROUTE,
    authorization: AUTHORIZATION_KIND,
  };
}

export async function commitKnot(thing, actor, proposal, approval, options = {}) {
  const ledger = options.ledger ?? defaultLedger();
  const refused = refuseNonHumanKnot(actor);
  if (refused) return refused;
  if (!proposal?.id) {
    return { ok: false, error: "A knot needs a chosen composition." };
  }
  if (!approval?.binding) {
    return {
      ok: false,
      error: "Commit requires human approval bound to the exact proposal, source revision and permitted scope.",
    };
  }

  const operationId = approval.binding;
  const existing = recallOperation(ledger, operationId);
  if (existing) {
    return idempotentResult(existing);
  }

  const hashed = await ensureHashes(thing);
  const revision = await sourceRevision(hashed);
  const expected = await approvalBinding({
    actorId: actor.id,
    proposalId: proposal.id,
    sourceRevision: revision,
    scope: approval.scope,
  });
  if (
    approval.binding !== expected ||
    approval.proposalId !== proposal.id ||
    approval.sourceRevision !== revision ||
    approval.actor !== actor.id
  ) {
    return { ok: false, error: "Changing the proposal or source invalidates the old approval." };
  }

  const childId = nextDescendantId(ledger, hashed.thingId);
  const remixContent = simulatedContent("remix", hashed.representations.at(-1).contentHash);
  const remix = Object.freeze({
    representationId: representationId(childId, "remix"),
    thingId: childId,
    kind: "remix",
    label: "remix",
    surface: "tree",
    content: remixContent,
    contentHash: await hashContent(remixContent),
    conversion: CONVERSION_ROUTE,
  });

  const deriveEvent = freezeEvent({
    id: `trace-${hashed.trace.length + 1}`,
    kind: "DERIVE",
    event: `KNOT → ${childId}`,
    source: hashed.thingId,
    result: childId,
    outcome: "SUCCESS",
    parent: hashed.thingId,
    child: childId,
  });
  const derivedEvent = freezeEvent({
    id: `trace-${hashed.trace.length + 1}-child`,
    kind: "DERIVED",
    event: `DERIVED FROM ${hashed.thingId}`,
    source: hashed.thingId,
    result: childId,
    outcome: "SUCCESS",
    parent: hashed.thingId,
    child: childId,
  });

  const parent = {
    ...hashed,
    thingId: hashed.thingId,
    id: hashed.id,
    identity: hashed.identity,
    descendants: Object.freeze([...(hashed.descendants ?? []), childId]),
    usedApprovals: Object.freeze([...(hashed.usedApprovals ?? []), approval.binding]),
    trace: Object.freeze([...hashed.trace, deriveEvent]),
  };

  const derivative = {
    thingId: childId,
    id: childId,
    identity: childId,
    name: `${hashed.name} — ${childId.slice(-1)}`,
    parent: hashed.thingId,
    ancestry: [hashed.thingId],
    place: hashed.place,
    origin: Object.freeze({
      inspectable: true,
      from: hashed.thingId,
      event: "Human knotted a meaningful divergence",
    }),
    representations: [remix],
    threads: hashed.threads,
    trace: Object.freeze([...hashed.trace, derivedEvent]),
    scars: hashed.scars,
    weight: hashed.weight,
    receipts: Object.freeze([]),
    descendants: Object.freeze([]),
    usedApprovals: Object.freeze([]),
    pattern: proposal.id,
    wovenBy: actor.name,
  };

  if (!derivative.parent) {
    return { ok: false, error: "A derivative may not lose its parent." };
  }

  const knot = {
    by: actor.id,
    byName: actor.name,
    pattern: proposal.id,
    at: Date.now(),
  };
  const written = await writeCommittedReceipt({
    human: actor,
    thing: parent,
    derivative,
    knot,
    approval,
  });
  parent.receipts = Object.freeze([...(hashed.receipts ?? []), written.receipt]);

  rememberOperation(ledger, {
    operationId,
    parentThingId: parent.thingId,
    parent,
    derivative,
    receipt: written.receipt,
    knot,
  });

  return {
    ok: true,
    duplicate: false,
    idempotent: false,
    committed: true,
    parent,
    derivative,
    knot,
    receipt: written.receipt,
    operationId,
    ledger: { persistence: LEDGER_PERSISTENCE },
    conversion: CONVERSION_ROUTE,
    authorization: AUTHORIZATION_KIND,
  };
}

export async function knotDerivative(thing, human, proposal, approval, options) {
  return commitKnot(thing, human, proposal, approval, options);
}

export function recordFailure(thing, { event, learning }) {
  const scar = Object.freeze({
    id: `scar-${thing.scars.length + 1}`,
    event,
    learning,
  });
  const requiresSupport = /support|unsupported|overhang/i.test(`${event} ${learning}`);
  const weight = Object.freeze({
    id: `weight-${thing.weight.length + 1}`,
    fromScar: scar.id,
    consequence: requiresSupport ? "Future fabrication requires support" : learning,
    changes: "next fabrication",
    futureFabricationRequiresSupport: requiresSupport,
  });
  const traceEvent = freezeEvent({
    id: `trace-${thing.trace.length + 1}`,
    kind: "FAILURE",
    event,
    source: thing.thingId,
    result: scar.id,
    outcome: "FAILURE",
    scar: scar.id,
  });
  return {
    ok: true,
    thing: {
      ...thing,
      thingId: thing.thingId,
      id: thing.id,
      identity: thing.identity,
      representations: thing.representations,
      scars: Object.freeze([...thing.scars, scar]),
      weight: Object.freeze([...thing.weight, weight]),
      trace: Object.freeze([...thing.trace, traceEvent]),
    },
  };
}

export function whyIsThisTheWayItIsNow(thing, derivative = null) {
  return {
    question: "Why is this object the way it is now?",
    not: "Not a timeline widget. Not version history. Not browser history.",
    trace: thing.trace,
    scars: thing.scars,
    weight: thing.weight,
    derivative: derivative ? { thingId: derivative.thingId, parent: derivative.parent } : null,
  };
}

export function receiveIntoLibrary(library, derivative) {
  if (library.some((item) => item.ref === derivative.thingId || item.id === derivative.thingId)) {
    return library;
  }
  return [
    ...library,
    {
      id: "derivative-0041-a",
      kind: "woven",
      emoji: "🪡",
      title: derivative.thingId,
      ref: derivative.thingId,
      note: "A descendant. Ancestry intact.",
      parents: derivative.ancestry,
    },
  ];
}

export function growTree(tree, derivative) {
  return {
    ...tree,
    leaves: [...tree.leaves, { id: derivative.thingId, parent: derivative.parent }],
    count: tree.count + 1,
    reason: "Something actually happened.",
  };
}

export function libraryFrom(thing) {
  return [
    {
      id: thing.thingId,
      kind: "model",
      emoji: "◇",
      title: thing.thingId,
      ref: thing.thingId,
      note: "The body. It can leave the screen.",
    },
  ];
}

export async function createProof(human = { id: "human-josh", name: "Josh", role: "CURSOR" }) {
  const converted = await convertBlendGlbStl(seedThing0041());
  const thing = converted.thing;
  return {
    act: "ARRIVE",
    human,
    thing,
    surface: null,
    visited: [],
    ada: null,
    derivation: null,
    knot: null,
    derivative: null,
    receipt: null,
    library: libraryFrom(thing),
    tree: { leaves: [{ id: thing.thingId }], count: 1 },
    inspector: whatAmILookingAt(thing, "drafting"),
    conversion: CONVERSION_ROUTE,
    authorization: AUTHORIZATION_KIND,
    presentation: { tab: null, viewport: "browser", lastViewed: null },
  };
}

export function travelTo(proof, surface, presentation = {}) {
  const opened = openOn(proof.thing, surface, presentation);
  return {
    ...proof,
    act: "TRAVEL",
    surface,
    visited: [...new Set([...proof.visited, surface])],
    view: opened.view,
    inspector: whatAmILookingAt(proof.thing, surface),
    thing: proof.thing,
    receipt: proof.receipt,
    consequential: false,
    presentation: opened.view.presentation,
  };
}

export function acceptanceGate(proof) {
  const checks = {
    "one persistent Thing identity": proof.thing.thingId === THING_ID,
    "≥3 representations/surfaces":
      proof.thing.representations.length >= 3 && proof.visited.length >= 3,
    "origin remains inspectable": proof.thing.origin?.inspectable === true,
    "relationship independent from storage": proof.thing.threads?.length >= 1,
    "ADA proposes without committing":
      Boolean(proof.ada) && proof.ada.committed === false && !proof.ada.derivative,
    "human modifies proposal": Boolean(proof.derivation?.proposal?.alteredBy),
    "human performs Knot": proof.knot?.by === proof.human.id,
    "derivative retains ancestry":
      proof.derivative?.thingId === DERIVATIVE_ID && proof.derivative.parent === THING_ID,
    "failure can become Scar": proof.thing.scars.length >= 1,
    "Scar affects future state through Weight": proof.thing.weight.some(
      (item) => item.futureFabricationRequiresSupport,
    ),
    "Receipt proves consequential work":
      Boolean(proof.receipt?.receiptHash) && proof.receipt.payload?.decision === "KNOT",
    "Library receives the resulting Thing": proof.library.some((item) => item.ref === DERIVATIVE_ID),
    "Tree changes because reality changed": proof.tree.count >= 2,
    "Thing can leave the originating application":
      proof.thing.origin.application === "Blender" && proof.visited.includes("pocket"),
    "nothing claims capabilities that aren't implemented":
      proof.conversion === CONVERSION_ROUTE && proof.authorization === AUTHORIZATION_KIND,
  };
  return {
    passed: Object.values(checks).every(Boolean),
    checks,
  };
}
