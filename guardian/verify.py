#!/usr/bin/env python3
# GUARDIAN://verify — validates a signed passport before any thread action
# Dependency: pip install pynacl
#
# Exit codes (LOCKED):
#   0   proceed
#   401 bad signature / malformed / key_type ≠ Ed25519
#   403 out of scope (deny, taught) or TTL
#   407 boundary crossing → Guardian holds → human decision → RECEIPT://000N

from __future__ import annotations

import base64
import json
import sys
import time
from pathlib import Path

from nacl.exceptions import BadSignatureError
from nacl.signing import VerifyKey

if __name__ == "__main__" and __package__ is None:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from guardian.canonical import canonical, payload_without_signature

# Hardcoded master public key — mirror of RESCOPE//ROOT//KARASU
# Inject once, never read at runtime from disk or the environment.
MASTER_PUBKEY_HEX = "<hex_of_master_public_key>"

TTL_SECONDS = 3600
KEY_TYPE = "Ed25519"

EXIT_OK = 0
EXIT_SIG = 401
EXIT_DENY = 403
EXIT_BOUNDARY = 407


def _boundary_matches(forbidden: str, target: str) -> bool:
    """Locked match rule. Do not use str.rstrip('/*') — that is a character class."""
    if forbidden.endswith("/*"):
        prefix = forbidden[:-2]
        return target == prefix or target.startswith(prefix + "/")
    prefix = forbidden.rstrip("/")
    return target == prefix or target.startswith(prefix + "/")


def verify_document(
    doc: dict,
    attempted_action: dict,
    *,
    now: int | None = None,
    master_pubkey_hex: str | None = None,
) -> int:
    """Validate a passport dict. `master_pubkey_hex` is a test injection only."""
    pubkey_hex = MASTER_PUBKEY_HEX if master_pubkey_hex is None else master_pubkey_hex

    # 01 // Verify signature over canonical(payload), signature stripped
    try:
        payload = payload_without_signature(doc)
        signature_value = doc["signature"]["value"]
        VerifyKey(bytes.fromhex(pubkey_hex)).verify(
            canonical(payload),
            base64.b64decode(signature_value, validate=True),
        )
    except (BadSignatureError, ValueError, KeyError, TypeError):
        print("◆ GUARDIAN — invalid passport signature. DROP.")
        return EXIT_SIG

    # 02 // key_type must be Ed25519 on the signed payload (Curve25519 is SUPERSEDED)
    if payload.get("key_type") != KEY_TYPE:
        print("◆ GUARDIAN — invalid passport signature. DROP.")
        return EXIT_SIG

    # 03 // TTL check (dynamic timestamps set at mint, not template constants)
    clock = int(time.time()) if now is None else int(now)
    try:
        issued_at = int(doc["issued_at"])
        expires_at = int(doc["expires_at"])
        if type(doc["issued_at"]) is float or type(doc["expires_at"]) is float:
            raise TypeError("timestamps must be integers")
    except (KeyError, TypeError, ValueError):
        print("◆ GUARDIAN — passport expired or not yet valid. DROP.")
        return EXIT_DENY

    if not issued_at <= clock < expires_at:
        print("◆ GUARDIAN — passport expired or not yet valid. DROP.")
        return EXIT_DENY

    # 04 // Scope + capability check for the attempted action
    try:
        scopes = doc["claims"]["scopes"]
        caps = doc["claims"]["capabilities"]
        forbidden_paths = doc["claims"]["boundaries"]["forbidden_paths"]
    except (KeyError, TypeError):
        print("◆ GUARDIAN — invalid passport signature. DROP.")
        return EXIT_SIG

    action = attempted_action.get("kind")
    target = attempted_action.get("target_path", "")
    if not isinstance(target, str):
        target = ""

    if caps.get("env_access") is False and ".env" in target:
        print("◆ GUARDIAN — env_access forbidden. DROP.")
        return EXIT_DENY

    for forbidden in forbidden_paths:
        if not isinstance(forbidden, str):
            continue
        if _boundary_matches(forbidden, target):
            identity = doc.get("identity", "UNKNOWN")
            print(
                f"◆ GUARDIAN — '{target}' crosses boundary '{forbidden}'.\n"
                f"  This action was never granted scope.\n"
                f"  [ KEEP BLOCKED ]  [ ALLOW ONCE ]  [ ADD TO {identity} ]"
            )
            return EXIT_BOUNDARY

    if action not in scopes:
        print(
            f"◆ GUARDIAN — capability '{action}' not in {doc.get('identity')} scopes {scopes}. DROP."
        )
        return EXIT_DENY

    # 05 // In scope: proceed, emit trace event
    print(f"✓ {doc.get('identity')} :: {action} :: {target} — in scope. Trace emitted.")
    return EXIT_OK


def verify(
    passport_path: str,
    attempted_action: dict,
    *,
    now: int | None = None,
    master_pubkey_hex: str | None = None,
) -> int:
    try:
        doc = json.loads(Path(passport_path).read_text(encoding="utf-8"))
        if not isinstance(doc, dict):
            raise ValueError("passport must be a JSON object")
    except (OSError, ValueError, json.JSONDecodeError):
        print("◆ GUARDIAN — invalid passport signature. DROP.")
        return EXIT_SIG
    return verify_document(
        doc,
        attempted_action,
        now=now,
        master_pubkey_hex=master_pubkey_hex,
    )


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(
            "usage: python3 guardian/verify.py <passport.json> '<action-json>'",
            file=sys.stderr,
        )
        sys.exit(2)
    sys.exit(verify(sys.argv[1], json.loads(sys.argv[2])))
