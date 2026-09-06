# Identity

Let `T` be a Thing.

```text
T.thingId              stays
T.representations[k]   may change
h(representation)      moves
```

`identityLaw(T)` returns `{ thingId, representationHashes, identityIsNotContent: true }`.

TRANSFORM(T) ≠ NEW IDENTITY.

Gator failure does not mint `THING://0041-failed`. It leaves a scar on `THING://0041`.

HANDOFF 002 already proved form-change. This math exists so HANDOFF 003 cannot "helpfully" fork identity when a node job errors.
