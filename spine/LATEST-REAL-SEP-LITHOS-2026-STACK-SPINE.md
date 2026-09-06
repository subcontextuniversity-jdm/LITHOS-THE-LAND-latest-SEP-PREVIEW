# LITHOS // STACK SPINE

SEP-LATEST · REAL · 2026

Document: `LATEST-REAL-SEP-LITHOS-2026-STACK-SPINE`

```text
LORE explains.
LAW constrains.
MATH formalises.
CODE enforces.
NODES execute.
HASHES identify.
RECEIPTS prove.
HUMANS choose.
```

## Thesis (stem)

Intelligence should move through relationships without acquiring sovereignty over them.

Everything else in this document is a derivation.

- A model can be powerful without owning the place.
- A node can execute without becoming the authority.
- A ledger can prove an event without becoming the entire application.
- Providers supply capability, never sovereignty.
- Something else can work on a Thing without owning the Thing, the Place, or the Human.

## The spine is vertical

Not a pile of apps. A load path.

| Layer | Verb | In this preview |
| --- | --- | --- |
| LORE | explains | `canon/`, `history/` |
| LAW | constrains | `airlock/`, glyphs, forbidden grants |
| MATH | formalises | `math/`, `src/math.mjs` |
| CODE | enforces | `src/` |
| NODES | execute | Gator executes. Sentinel does not. |
| HASHES | identify | RFC 8785 + SHA-256 of receipts and bytes |
| RECEIPTS | prove | in-memory evidence of a knot |
| HUMANS | choose | CURSOR ties the knot |

If a layer is missing, the stack is not a spine. It is a poster.

## Horizontal crossing (LOGIN-NEWEST)

```text
HUMAN → AIRLOCK → SPLIT → PLACE → SCOPE → WORK → RECEIPT → HOME
```

The vertical spine is what the system *is*.
The horizontal path is how a person *crosses* it.

They meet at the **JDM Airlock**.

The airlock does not log you into a product.
It equalizes two pressures without fusing two kinds of subject.

```text
        CURSOR_DOOR              TALON_DOOR
        ───────────              ──────────
        HUMAN / Josh             GATOR or SENTINEL
        may knot                 may not knot
        sovereign in the place   capability in the place
```

The gate is **SPLIT**. It will not fuse.
Decider and executor do not become one login.

## Nodes on this spine

**Gator** — TALON that executes. Search, build, route, remember, carry within place, execute within scope. Cannot tie the knot, leave the place, acquire sovereignty, reset weight, erase scars, or become the cursor.

**Sentinel** — watcher. Maps the past. Applies weight. Attests that Gator stayed in scope. Refuses illegal glyphs. Cannot execute Gator's work, cannot knot, cannot carry the past for the human.

Visual Grammar 06, locked:

```text
The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.
```

Sentinel maps.
Gator executes the next pull under that weight.
The human still has to walk.

## Math (not flavour)

- **Identity.** `thingId` is stable. Representation hashes move. Identity is not the hash of the current bytes.
- **Split.** `mayKnot(CURSOR) = true`. `mayKnot(GATOR) = mayKnot(SENTINEL) = false`. Cursor ∩ Node = ∅ as inhabitants of one chamber.
- **Weight.** `W ← W ∪ constraint(scar)`. Never reset. Duplicate scars do not double-count. `nextPull(grants, W)` demands `requires` and removes `blocks`.
- **Receipt.** SHA-256 of RFC 8785 canonical JSON. Integrity digest. **DEMO-ONLY.** Not a digital signature.
- **Typestate.** A Sentinel session cannot call `execute`. A Gator session cannot call `attest`. The human alone commits `KNOT`.

## What this spine is not

- Not HANDOFF 001's Golden Tree walk (that is another branch).
- Not HANDOFF 002's `.blend → .glb → .stl` continuity (SIMULATED there; ABSENT here).
- Not a passport (ABSENT; concurrent spec).
- Not networked nodes (ABSENT).
- Not an empire of screens. Don't pull the golden cord.

## Proof in this repository

```bash
npm test
```

`runLoginNewest()` in `src/spine.mjs`:

1. Josh arrives at JDM Airlock.
2. Split gate: Gator right, Sentinel right of a second crossing, same human.
3. Gator attempts a make. Overhang collapses. Scar stays.
4. Sentinel maps. Does not carry. Applies weight. Attests.
5. Next Gator pull requires `require_support`. Retry without it fails.
6. Human adds the grant. Gator executes. Human knots. Receipt hashed.

SAME PLACE → TWO NODES → HISTORY INTACT → WEIGHT NOT RESET.

**LITHOS//THE LAND**

You're early.

DON'T PULL THE GOLDEN CORD.
DON'T CUT THE THREAD.
