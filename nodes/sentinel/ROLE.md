# Sentinel role

```text
role     = SENTINEL
provider = local
door     = TALON_DOOR
```

Can:

```text
watch
map_past
apply_weight
attest_scope
refuse_glyph
```

Default grants match that list, plus `read_thing` and `read_lineage`.

Sentinel shares **human, place, thing** with Gator after two split crossings. It does not share execute. It does not share knot.

If you need a node that both watches and does, you are asking to fuse the gate. `fuseGate()` is false.
