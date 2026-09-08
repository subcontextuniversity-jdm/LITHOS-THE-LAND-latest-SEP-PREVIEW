# ICON//LEXICON — Canonical Term Mapping

**Status of this document:** ratification draft for the *normalise* pass (P1).
**Scope of this pass:** documentation only. No schema, icon, category, branch, or
PR changes were made to produce it. It records the agreed canonical vocabulary so
that a later pass can migrate `src/types.ts`, `src/lexicon.ts`, and the icon family
against a fixed target instead of a moving one.

**Lineage:** extends the ICON//LEXICON work on
`cursor/lithos-icon-lexicon-picker-360a` (PR #3). This doc is additive; nothing in
`src/` is touched yet.

---

## 0. Locked laws (verbatim — do not rewrite, soften, or brand over)

These govern the whole lexicon and are reproduced exactly from `src/constitution.ts`.

```text
06 // REPRESENTATION IS NOT IDENTITY
A glyph, name or accent is presentation.
Deleting, restyling or re-colouring it
never alters the Thing's identity, keys
or scope.
```

```text
LOCKED // VISUAL GRAMMAR 06
The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.
```

**Trust rule (terminology, not yet a primitive):**

```text
CLAIM ≠ EVIDENCE
EVIDENCE → RECEIPT
```

A worker's claim is not the receipt. A `RECEIPT` is only `VERIFIED` when independently
inspectable evidence (diff, hash, timestamp, command/test result, object revision,
source reference, runtime output) satisfies the acceptance requirements of a `SCOPE`.

---

## 1. The spine

LITHOS is substrate — the common language, contracts and infrastructure through which
other systems work together. It is not a chatbot, model, IDE, agent wrapper, or
isolated application.

```text
HUMAN → PLACE → SCOPE → CAPABILITY → WORK → RECEIPT
```

Read as a sentence the system must make true:

> A human can select something, summon an appropriately scoped capability, let it
> perform bounded work, and receive inspectable evidence of exactly what happened.

The implementation beneath (Cursor, Kiro, Cline, HERMES, LM Studio, a local/cloud
model, an MCP server, a future device) may change. The grammar should survive it.

---

## 2. Land → System → Canonical

LITHOS Land stays as the human-readable metaphor layer, but every metaphor is audited
against the technical concept and the canonical object it maps to.

```text
LAND TERM  →  SYSTEM TERM       →  CANONICAL OBJECT / CONTRACT
PLACE      →  bounded context   →  PLACE object / schema
PASS       →  scoped grant      →  PASS object (issued by a GUARDIAN)
RECEIPT    →  evidence record   →  RECEIPT object (who / scope / object / result)
```

---

## 3. Canonical 20-term table

Two-layer meaning per term: a **HUMAN MEANING** that reads at a glance, and a **SYSTEM
MEANING** for operators. `STATUS` is the *migration* status against today's code:

- **PRESENT** — already exists and stays.
- **DRIFT** — exists under a different/overloaded name; migrate + keep an alias.
- **MISSING** — not yet represented; add in a later pass.

`ICON` records today's mark. Per the brand decision (§4), emoji are **placeholders**
to be replaced by monochrome geometric glyphs in the icon-refresh pass; on-brand
geometry (`◆ ◇ ◉ ◈ [ ]`) is kept.

| TERM | HUMAN MEANING | SYSTEM MEANING | ICON (today) | VERB/NOUN | STATUS | ALIASES | DEPRECATED |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **HUMAN** | The person who owns and chooses. | The authenticated principal; sole holder of sovereignty and authority. | `👤` placeholder | NOUN (actor) | PRESENT | CURSOR, PRINCIPAL, SELF | — |
| **HOME** | The safe place you return to. | The human's root context and safe default state; target of `RETURN`. | `⌂` | NOUN | PRESENT (promote) | BASE | — |
| **PLACE** | A doorway; where things are. | An addressable bounded context holding objects, capabilities, authority and history. | `[ ]` | NOUN | PRESENT | PLACE BOUNDARY, ROOM, CONTEXT | — |
| **TREE** | The structure everything hangs from. | The ancestry graph of places/objects: ROOT → TRUNK → BRANCH → OBJECT. | pending geom | NOUN | MISSING | WORLD TREE (Land) | — |
| **BRANCH** | A direction that grew off the trunk. | A bounded subdivision / line of growth within the tree. | `🌿` placeholder | NOUN | PRESENT (promote) | LINE | — |
| **OBJECT** | The actual thing (note, app, model, file). | The canonical entity: stable identity, persisted once, rendered many (P01). | `◈` (node) | NOUN | DRIFT | THING, NODE | "THING" as the human word only — `THING://` URI is retained |
| **THREAD** | The activity/conversation on a thing. | An ordered activity/relationship stream bound to an object. | `🧵` placeholder | NOUN | PRESENT | RELATIONSHIP, CONVERSATION | — |
| **SCOPE** | The boundary around what's allowed. | The boundary of permitted work: which capabilities may act on which objects, in which place. | `◉` | NOUN | PRESENT (promote) | — | — |
| **PASS** | A ticket/key granting an ability. | A scoped, revocable grant of capability, issued by a `GUARDIAN` and receipted. | `◆` (shared; distinct geom pending) | NOUN (issued via `SUMMON`) | DRIFT | ALLOW ONCE, GRANT | — |
| **CAPABILITY** | Something you can call on to do a job. | A callable, scoped ability exposed through LITHOS MCP (model, tool, worker, or bridge). | `◇` (talon) | NOUN | DRIFT | TALON | CONNECTOR (catch-all; splits into the five capability kinds below) |
| **WORKER** | Something that does the work. | An entity that executes bounded jobs under a `PASS` and returns evidence (e.g. HERMES). | pending geom | NOUN (actor) | MISSING | AGENT | — |
| **MODEL** | The reasoning brain you can ask. | A reasoning/generation capability; a provider, never the human or the authority. | `🧠` placeholder | NOUN | DRIFT | REASONER, LLM | — |
| **BRIDGE** | The connection between two systems. | A connector linking LITHOS to an external system/host without granting it sovereignty. | `🔌`/`☁` placeholder | NOUN | DRIFT | CONNECTOR | — |
| **MCP** | The plug that lets tools talk to LITHOS safely. | LITHOS MCP: the machine-readable interface exposing *bounded* LITHOS capabilities (read object, query tree, render, request model, call tool, return evidence, create receipt). | pending geom | NOUN | MISSING | API (partial) | — |
| **SUMMON** | Call a helper/ability into the room. | Request a scoped `CAPABILITY`/`WORKER` into the current `SCOPE`, subject to a `PASS`. | pending geom | VERB | MISSING | CALL, INVOKE | — |
| **WORK** | The actual doing. | A bounded transformation by a worker/capability under a `PASS`, producing evidence. | pending geom | VERB / NOUN | DRIFT | ACTION (partial) | — |
| **RECEIPT** | A stamped slip proving what happened. | Evidence describing who/what acted, under what scope, upon which object, with which result. | `🧾` placeholder | NOUN (verb: to receipt) | PRESENT | PROOF, STAMP | — |
| **LINEAGE** | Where it came from and what followed. | The provenance chain of an object/receipt: sources, prior revisions, descendants. | pending geom | NOUN | MISSING | PROVENANCE, HISTORY, SCAR, WEIGHT | — |
| **VERIFIED** | Checked and proven true. | A state where evidence satisfies a scope's acceptance requirements; set by a `GUARDIAN`, never self-claimed. | `✓` | STATE | PRESENT | ATTESTED | — |
| **BLOCKED** | A wall you can't pass yet. | A known boundary preventing progression; a `GUARDIAN` refusal, receipted. | `⊘` | STATE | PRESENT | DENIED | BLOCK (rename → BLOCKED; keep BLOCK as alias) |

### Retained actor (not one of the 20, but load-bearing)

| TERM | HUMAN MEANING | SYSTEM MEANING | ICON (today) | VERB/NOUN | STATUS |
| --- | --- | --- | --- | --- | --- |
| **GUARDIAN** | The gatekeeper that decides. | The authority actor that issues `PASS`, and stamps `VERIFIED`/`BLOCKED`. Not a scope and not a grant — an actor. | `◆` | NOUN (actor) | PRESENT |

---

## 4. Brand decision (recorded for the icon-refresh pass)

Keep the manifesto's **material** identity — molten amber, obsidian glass, CRT ghosts —
but **strip the neon glow / sparkle layer**:

- Move from "display font + glow" to **monochrome geometric glyphs + amber accent only**.
- The brand stays underground; the chrome becomes **engineered, not decorative**.
- Emoji marks in the table above are placeholders; the core icon family becomes simple
  geometric silhouettes that hold at nav / toolbar / card / diagram scale, in light and
  dark, monochrome-first.

No style code is changed in this pass.

---

## 5. Grammar: two vocabularies, kept separate

**Architectural grammar** (durable system primitives):

```text
SELECT   choose an existing object/capability
SUMMON   bring a scoped worker/capability into the current scope
DESCRIBE inspect or explain
ASK      request reasoning/information
WORK     perform bounded transformation
RETURN   bring result back to human context
RECEIPT  record evidence and lineage
```

**Interaction vocabulary** (surface gestures — informative, *not* auto-promoted to
primitives): `TAP · HOLD · FLICK · DRAG · DROP · PEEL · PIN · POCKET · THROW · MORPH · ASK`.

These stay separated so surface gestures can evolve without mutating the architecture.

---

## 6. Workbench quadrants → lexicon families

The emerging host/workbench model (Google Antigravity as current host) maps to the
canonical families, which is why the icon language must describe places, objects,
capabilities, workers, scope and evidence rather than generic software-menu concepts.

```text
LEFT   // PLACE    project · tree · files · storage · connectors · devices · branches · objects
CENTRE // WORK     object · document · code · preview (desktop/mobile/web) · model output
RIGHT  // PARTY    HOMEY · HERMES · models · Kiro · Cline · Cursor · workers · capability status
BOTTOM // RECEIPT  action · worker · source · model · scope · files touched · result · timestamp · lineage · verification
```

`PARTY` is a surface region composed of `CAPABILITY` + `WORKER` + `MODEL` entities; it is
not a new ontology term.

---

## 7. What is *not* LITHOS

Recorded here; expanded in the architecture doc in a later pass.

- **HOMEY** — human-facing companion/operator layer. Not LITHOS.
- **HERMES** — local worker/runtime. Not LITHOS.
- **LM Studio** — a model/MCP host/lab. Not LITHOS.
- **Cursor / Kiro / Cline / Zed** — engineering hosts or worker capabilities. Not LITHOS.
- **Google Antigravity / Studio** — current experimental workshop/host. Not LITHOS.

LITHOS = machinery / substrate / rules. These are environments or capabilities LITHOS
may coordinate — authority always comes from the LITHOS scope/capability system.

---

## 8. Deferred to later passes (explicitly not done here)

- Extend the `Glyph` schema with `humanMeaning`, `systemMeaning`, `verbNoun`, `status`,
  `aliases`, `deprecates` (non-breaking, optional fields).
- Introduce canonical categories + old→new alias map (`THING→OBJECT`, split `CONNECTOR`,
  separate `WORK` from navigation, `TRACE→RECEIPT/LINEAGE`, add `TREE/PASS/SCOPE/WORKER`).
- Design the 12-icon core family as monochrome SVGs.
- Author `docs/ARCHITECTURE.md` (the LITHOS tree + the "not LITHOS" clarifications).

None of the above is started until this table is ratified.

---

## 9. Build sequence (for orientation — unchanged)

```text
P01  OBJECT ONCE → RENDER MANY   FROZEN BASELINE (external; not rebuilt here)
P02  CAPABILITY / PASS
P03  LOCAL MODEL / MCP
P04  HERMES WORKER
P05  RECEIPT + LINEAGE
P06  DEVICE / REMOTE SURFACES
```

This normalise pass supports the progression; it does not implement P02–P06.
