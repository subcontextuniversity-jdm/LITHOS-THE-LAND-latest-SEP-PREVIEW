#!/usr/bin/env python3
# GUARDIAN://mint — issue a live passport. Timestamps are set here, never copied.

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
from pathlib import Path

from nacl.signing import SigningKey

if __name__ == "__main__" and __package__ is None:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from guardian.canonical import canonical
from guardian.verify import KEY_TYPE, TTL_SECONDS

SCHEMA = "GUARDIAN://PASSPORT/v1"


def _signing_key_from_hex(seed_hex: str) -> SigningKey:
    seed = bytes.fromhex(seed_hex)
    if len(seed) != 32:
        raise ValueError("Ed25519 seed must be 32 bytes (64 hex chars)")
    return SigningKey(seed)


def mint(
    template: dict,
    signing_key: SigningKey,
    *,
    now: int | None = None,
    ttl_seconds: int | None = None,
) -> dict:
    """Build a live passport. issued_at/expires_at are computed at this call."""
    issued_at = int(time.time()) if now is None else int(now)
    ttl = TTL_SECONDS if ttl_seconds is None else int(ttl_seconds)
    if "ttl_seconds" in template and ttl_seconds is None:
        ttl = int(template["ttl_seconds"])
    if ttl != TTL_SECONDS:
        # Spec lock: 60-minute TTL. Mint may only use 3600 until the spec changes.
        raise ValueError(f"ttl_seconds must be {TTL_SECONDS}")

    if "issued_at" in template or "expires_at" in template or "signature" in template:
        raise ValueError(
            "templates must omit issued_at, expires_at, and signature; mint sets them"
        )

    identity = template["identity"]
    claims = template["claims"]
    payload = {
        "schema": SCHEMA,
        "identity": identity,
        "key_type": KEY_TYPE,
        "issued_at": issued_at,
        "expires_at": issued_at + ttl,
        "claims": claims,
    }
    signature = signing_key.sign(canonical(payload)).signature
    return {
        **payload,
        "signature": {
            "key_type": KEY_TYPE,
            "value": base64.b64encode(signature).decode("ascii"),
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Mint a GUARDIAN://PASSPORT/v1 token")
    parser.add_argument("template", help="template JSON (no timestamps, no signature)")
    parser.add_argument(
        "-o",
        "--output",
        help="write passport JSON here (default: stdout)",
    )
    args = parser.parse_args()

    seed_hex = os.environ.get("GUARDIAN_MASTER_SK_HEX")
    if not seed_hex:
        print(
            "GUARDIAN_MASTER_SK_HEX is required (32-byte Ed25519 seed as hex). "
            "Do not commit this value.",
            file=sys.stderr,
        )
        return 2

    template = json.loads(Path(args.template).read_text(encoding="utf-8"))
    doc = mint(template, _signing_key_from_hex(seed_hex))
    text = json.dumps(doc, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(text, encoding="utf-8")
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
