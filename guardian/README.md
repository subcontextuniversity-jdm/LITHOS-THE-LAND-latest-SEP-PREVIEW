# GUARDIAN

Ed25519 passport gate for thread actions. Spec is locked in `spec/PASSPORT.md`.

```text
PASSPORT SPEC    → LOCKED
GUARDIAN VERIFY  → executable
RECEIPT STAMPING → OPEN
CURSOR HOOK      → OPEN
```

```bash
pip install -r guardian/requirements.txt
python3 -m unittest guardian.test_verify
python3 guardian/verify.py <passport.json> '{"kind":"READ","target_path":"src/app.mjs"}'
```

Mint sets `issued_at` / `expires_at` at issuance (3600s TTL). Templates must not contain timestamps.

```bash
export GUARDIAN_MASTER_SK_HEX='<64 hex chars>'
python3 guardian/mint.py guardian/fixtures/talon-build.template.json -o /tmp/passport.json
```

Inject `RESCOPE//ROOT//KARASU`'s public key into `MASTER_PUBKEY_HEX` in `verify.py` once. Verify does not read keys at runtime. Production private keys do not belong in this repository.
