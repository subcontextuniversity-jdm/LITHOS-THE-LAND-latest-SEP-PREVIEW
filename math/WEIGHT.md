# Weight

Let `W` be a list of constraints. Let `σ` be a scar with id `σ.id`.

```text
accumulate(W, σ) =
  W                             if ∃ w ∈ W : w.scarId = σ.id
  W ∪ { constraint(σ) }         otherwise

reset(W) = ⊥
```

```text
nextPull(G, W) = {
  grants:   G \ blocks(W),
  required: ⋃ requires(W),
  changed:  blocks(W) ≠ ∅ ∨ requires(W) ≠ ∅
}
```

Weight is consequence. It is not a score. It is not XP. It is not a reputation the Sentinel spends.
