# Weight

WEIGHT = memory.

Scar is evidence. Weight is consequence. Sentinel applies one to the other.

`applyWeight(session, thing, scar)` → `accumulateWeight`.

- Never resets (`resetWeight()` fails).
- Duplicate `scarId` does not double-count.
- `nextPull(grants, weight)` adds `required` and removes `blocks`.

That is the only way "Memory changes the next pull" is allowed to mean anything here.

Gator does not get to decide that a failure "doesn't count this time."
Human still chooses whether to grant `require_support` and whether to knot.
