# Gator can

From `presentNode("GATOR")`:

```text
propose
search
build
route
remember
execute_within_scope
carry_within_place
```

Default grants (LAW, not wishes):

```text
read_thing
read_lineage
propose_remix
attempt_make
leave_scar
write_receipt
carry_within_place
execute_within_scope
```

`execute(session, thing, action)` appends TRACE. If `action.fail` is set, it also leaves a SCAR. It does not apply WEIGHT. Weight is Sentinel's job. Mixing those jobs is how a worker starts "deciding what the failure meant."
