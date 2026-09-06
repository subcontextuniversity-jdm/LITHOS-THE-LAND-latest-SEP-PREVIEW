# Scope

```text
S = (humanId, placeId, thingId, workerId, grants, required)
```

`grants ∩ forbidden = ∅`

```text
forbidden = {
  tie_knot,
  sovereignty,
  golden_cord,
  reset_weight,
  erase_scar,
  become_cursor,
  carry_past_for_human
}
```

`required` comes from weight, not from the node's appetite.

Gator `assertGator` fails if a required grant is missing. That is the fourth line of VG06 as a type.
