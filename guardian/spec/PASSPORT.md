# GUARDIAN://PASSPORT/v1 — LOCKED

Signed capability document. Guardian validates it before any thread action.

This lock incorporates three spec findings that applied before the schema was committed:

1. **Algorithm naming (SUPERSEDED):** `Curve25519` is X25519 key-agreement. Signing on that curve is **Ed25519**. The field is `key_type`. The only accepted value is `"Ed25519"`.
2. **Timestamps (STALE template rejected):** `issued_at` / `expires_at` are **not** schema constants. Mint sets both at issuance. TTL is 3600 seconds. `expires_at = issued_at + 3600`.
3. **Canonicalization (LOCKED):** signature covers exact bytes. Those bytes are Guardian Canonical JSON of the passport **with `signature` stripped**.

```text
PASSPORT SPEC    → LOCKED
GUARDIAN VERIFY  → executable (see guardian/verify.py)
RECEIPT STAMPING → OPEN (407 → human decision → RECEIPT://000N)
CURSOR HOOK      → OPEN (wrapper calls verify() before spawn)
```

## Token shape

Live tokens (mint output) have this shape. Templates MUST omit `issued_at`, `expires_at`, and `signature`.

```json
{
  "schema": "GUARDIAN://PASSPORT/v1",
  "identity": "TALON//BUILD",
  "key_type": "Ed25519",
  "issued_at": 1788675300,
  "expires_at": 1788678900,
  "claims": {
    "scopes": ["READ", "WRITE"],
    "capabilities": { "env_access": false },
    "boundaries": {
      "forbidden_paths": ["/.git/*", "/.env", "/secrets/*"]
    }
  },
  "signature": {
    "key_type": "Ed25519",
    "value": "<base64 of 64-byte Ed25519 signature>"
  }
}
```

`issued_at` / `expires_at` above are examples of the *type* (Unix seconds, integers). They are not a frozen template. Any fixture that ships `1741295320` is invalid.

### Field rules

| Field | Signed? | Rule |
|---|---|---|
| `schema` | yes | const `GUARDIAN://PASSPORT/v1` |
| `identity` | yes | non-empty string (`TALON//BUILD`, …) |
| `key_type` | yes | const `Ed25519` |
| `issued_at` | yes | integer Unix seconds, set at mint (`now`) |
| `expires_at` | yes | integer Unix seconds, `issued_at + 3600` |
| `claims.scopes` | yes | actions Guardian may proceed (`READ`, `WRITE`, `PUSH`, …) |
| `claims.capabilities.env_access` | yes | `false` forbids any target containing `.env` |
| `claims.boundaries.forbidden_paths` | yes | see boundary match |
| `signature` | **no** | stripped before canonicalization |

`key_type` lives on the signed payload so it cannot be swapped after signing. The copy inside `signature` is operator-facing only.

Root signing key identity: `RESCOPE//ROOT//KARASU`. Guardian's `MASTER_PUBKEY_HEX` is a **compile-time injection** of that public key. Verify never reads key material from disk or the environment.

## Canonical JSON (the one rule)

Signed bytes =

```text
UTF-8( json.dumps(payload_without_signature,
                  sort_keys=True,
                  separators=(",", ":"),
                  ensure_ascii=True) )
```

Locked properties:

- object keys sorted lexicographically at every nesting level
- no insignificant whitespace
- `ensure_ascii=True` (non-ASCII as `\uXXXX`) — Python `json.dumps` default, made explicit
- integers only for numbers (timestamps are `int`, never `float`)
- `signature` key absent from the hashed object
- floats are forbidden in passports

This profile is RFC 8785 JCS-compatible for the allowed types (objects, arrays, strings, integers, booleans, null). Receipts in HANDOFF 002 remain RFC 8785 over SHA-256 integrity; passports are Ed25519 over this encoding. Do not mix the two assurance stories.

Mint and verify MUST import the same `canonical()` implementation (`guardian/canonical.py`). Placeholder signatures cannot verify against unreproducible bytes.

## TTL

```text
valid iff  issued_at  <=  now  <  expires_at
ttl        =  3600 seconds
```

Clock is Unix seconds. A template with frozen timestamps is born expired or will expire independently of mint; that is rejected.

## Boundary match

A forbidden path `F` matches target `T` when:

- if `F` ends with `/*`: `T == F[:-2]` or `T.startswith(F[:-2] + "/")`
- else: `T == F` or `T.startswith(F.rstrip("/") + "/")`

Do **not** use `str.rstrip("/*")` — that strips a character class, not the suffix `/*`.

`/secret` does not match `/secretstuff`.

## Verify order and exit codes

```text
01  signature over canonical(payload)     → 401 invalid
02  key_type == "Ed25519"                 → 401 invalid
03  issued_at <= now < expires_at         → 403 expired / not yet valid
04  env_access false and ".env" in target → 403 deny (taught)
05  forbidden path match                  → 407 hold for human
06  action kind not in scopes             → 403 deny (taught)
07  in scope                              → 0   proceed, emit trace
```

```text
0    proceed
401  bad signature / malformed / wrong key_type
403  out of scope (deny, taught) or TTL
407  boundary crossing → Guardian holds → human decision → RECEIPT://000N
```

The 407 branch is where ALLOW ONCE → receipt-stamping plugs in. `GUARDIAN://RECEIPT` is OPEN: same master key signs the receipt; append to the trace log. This module only **holds** (exit 407) and prints the decision prompt:

```text
[ KEEP BLOCKED ]  [ ALLOW ONCE ]  [ ADD TO {identity} ]
```

## Visual grammar (407 hold)

The system can map the past, but it cannot carry it for you.
Scar is evidence.
Weight is consequence.
Memory changes the next pull.

Guardian may map the attempted crossing. It may not allow it on its own. The human ties the knot. The scar stays on the trace.

## CLI (Cursor init hook feeds this)

```bash
python3 guardian/verify.py <passport.json> '<action-json>'
```

`action-json`:

```json
{ "kind": "READ", "target_path": "src/app.mjs" }
```

## Mint

```bash
export GUARDIAN_MASTER_SK_HEX='<64 hex chars of Ed25519 seed>'
python3 guardian/mint.py guardian/fixtures/talon-build.template.json
```

Mint is how timestamps become real. It is not a substitute for injecting `RESCOPE//ROOT//KARASU` into `MASTER_PUBKEY_HEX`. Production private keys do not live in this repository.
