# SPLIT-GATE

Also written SPLITED-GATE in the SEP note. The spelling does not split the law. The gate does.

Two chambers. One crossing. No fusion.

```text
LEFT  = CURSOR_DOOR   = person
RIGHT = TALON_DOOR    = Gator or Sentinel
```

## Why split

HANDOFF 003: something else can work on a Thing without owning the Thing, the Place, or the Human.

If the worker logs in *as* the human, the worker has already acquired a kind of sovereignty: the kind that looks like a session.

If the human must become a worker to get anything done, the place has already lost its person.

So the gate stays split.

## Law in code

`src/split-gate.mjs`

- `presentAtDoor(subject, CURSOR_DOOR)` fails for Gator and Sentinel.
- `presentAtDoor(subject, TALON_DOOR)` fails for Cursor.
- `splitGate({ human, node })` fails if ids collide.
- `fuseGate()` always fails.

Decider (Sentinel) and executor (Gator) are both TALON-side, but they are still not one node. They take separate crossings. They share human and place. They do not share knot authority. They do not share execute.

## What fusion would look like (rejected)

- "Login with Google" that also is the agent.
- A single API key that can click Knot.
- A sentinel that "just does it for you."
- A gator that "watches itself."

The last two are how systems grow a quiet emperor.
