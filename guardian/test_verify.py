"""Evidence for the three spec locks, plus verify exit-code contract."""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from nacl.signing import SigningKey

from guardian.canonical import canonical, payload_without_signature
from guardian.mint import mint
from guardian.verify import (
    CLI_EXIT,
    EXIT_BOUNDARY,
    EXIT_DENY,
    EXIT_OK,
    EXIT_SIG,
    KEY_TYPE,
    TTL_SECONDS,
    verify,
    verify_document,
)

ROOT = Path(__file__).resolve().parent
SCHEMA_PATH = ROOT / "schema" / "passport.v1.json"
SPEC_PATH = ROOT / "spec" / "PASSPORT.md"
TEMPLATE_PATH = ROOT / "fixtures" / "talon-build.template.json"
VERIFY_PATH = ROOT / "verify.py"

STALE_TEMPLATE_TS = 1741295320
IN_SCOPE = {"kind": "READ", "target_path": "src/app.mjs"}


def _template() -> dict:
    return json.loads(TEMPLATE_PATH.read_text(encoding="utf-8"))


def _keypair():
    sk = SigningKey.generate()
    return sk, sk.verify_key.encode().hex()


def _minted(now: int = 1_700_000_000, template: dict | None = None, sk=None):
    signing_key = sk or SigningKey.generate()
    doc = mint(template or _template(), signing_key, now=now)
    return doc, signing_key.verify_key.encode().hex(), signing_key


class SpecLockTests(unittest.TestCase):
    def test_schema_key_type_is_ed25519_not_curve25519(self):
        parsed = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
        self.assertEqual(parsed["properties"]["key_type"]["const"], "Ed25519")
        self.assertEqual(parsed["properties"]["signature"]["properties"]["key_type"]["const"], "Ed25519")
        self.assertEqual(parsed["x-guardian-algorithm"]["key_type"], "Ed25519")
        self.assertNotEqual(parsed["properties"]["key_type"]["const"], "Curve25519")

    def test_verify_source_matches_ed25519_not_curve25519(self):
        source = VERIFY_PATH.read_text(encoding="utf-8")
        self.assertIn('KEY_TYPE = "Ed25519"', source)
        self.assertNotIn('KEY_TYPE = "Curve25519"', source)

    def test_template_has_no_timestamps_and_no_signature(self):
        template = _template()
        self.assertNotIn("issued_at", template)
        self.assertNotIn("expires_at", template)
        self.assertNotIn("signature", template)
        blob = TEMPLATE_PATH.read_text(encoding="utf-8")
        self.assertNotIn(str(STALE_TEMPLATE_TS), blob)
        self.assertEqual(template["ttl_seconds"], TTL_SECONDS)

    def test_schema_forbids_stale_constant_timestamps(self):
        schema = SCHEMA_PATH.read_text(encoding="utf-8")
        self.assertNotIn(str(STALE_TEMPLATE_TS), schema)
        parsed = json.loads(schema)
        self.assertEqual(parsed["x-guardian-ttl"]["ttl_seconds"], 3600)
        self.assertIn("not schema constants", parsed["x-guardian-ttl"]["note"])

    def test_canonicalization_rule_is_documented_and_stable(self):
        spec = SPEC_PATH.read_text(encoding="utf-8")
        self.assertIn('sort_keys=True', spec)
        self.assertIn('separators=(",", ":")', spec)
        schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
        self.assertIn("sort_keys=True", schema["x-guardian-canonicalization"]["python"])

        a = {"b": 1, "a": {"z": True, "m": "x"}}
        b = {"a": {"m": "x", "z": True}, "b": 1}
        self.assertEqual(canonical(a), canonical(b))
        self.assertEqual(canonical(a), b'{"a":{"m":"x","z":true},"b":1}')

    def test_canonical_rejects_floats(self):
        with self.assertRaises(TypeError):
            canonical({"issued_at": 1.0})


class MintTimestampTests(unittest.TestCase):
    def test_mint_sets_dynamic_ttl_not_stale_constants(self):
        now = 1_788_675_300
        doc, _, _ = _minted(now=now)
        self.assertEqual(doc["issued_at"], now)
        self.assertEqual(doc["expires_at"], now + 3600)
        self.assertNotEqual(doc["issued_at"], STALE_TEMPLATE_TS)
        self.assertNotEqual(doc["expires_at"], STALE_TEMPLATE_TS)
        self.assertEqual(doc["key_type"], KEY_TYPE)
        self.assertEqual(doc["signature"]["key_type"], KEY_TYPE)

    def test_template_with_frozen_timestamps_is_rejected(self):
        sk = SigningKey.generate()
        bad = _template()
        bad["issued_at"] = STALE_TEMPLATE_TS
        bad["expires_at"] = STALE_TEMPLATE_TS + 3600
        with self.assertRaises(ValueError):
            mint(bad, sk, now=1_700_000_000)


class VerifyContractTests(unittest.TestCase):
    def test_in_scope_read_proceeds(self):
        doc, pub, _ = _minted()
        code = verify_document(doc, IN_SCOPE, now=doc["issued_at"], master_pubkey_hex=pub)
        self.assertEqual(code, EXIT_OK)

    def test_bad_signature_is_401(self):
        doc, pub, _ = _minted()
        doc["claims"]["scopes"] = ["READ", "WRITE", "PUSH"]
        code = verify_document(doc, IN_SCOPE, now=doc["issued_at"], master_pubkey_hex=pub)
        self.assertEqual(code, EXIT_SIG)

    def test_wrong_master_key_is_401(self):
        doc, _, _ = _minted()
        other = SigningKey.generate().verify_key.encode().hex()
        code = verify_document(doc, IN_SCOPE, now=doc["issued_at"], master_pubkey_hex=other)
        self.assertEqual(code, EXIT_SIG)

    def test_placeholder_master_key_fail_closed(self):
        doc, _, _ = _minted()
        code = verify_document(doc, IN_SCOPE, now=doc["issued_at"])
        self.assertEqual(code, EXIT_SIG)

    def test_mint_cli_then_verify_with_matching_pubkey(self):
        sk = SigningKey.generate()
        seed_hex = sk.encode().hex()
        pub = sk.verify_key.encode().hex()
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "passport.json"
            proc = subprocess.run(
                [
                    sys.executable,
                    str(ROOT / "mint.py"),
                    str(TEMPLATE_PATH),
                    "-o",
                    str(out),
                ],
                check=False,
                env={**os.environ, "GUARDIAN_MASTER_SK_HEX": seed_hex},
                cwd=str(ROOT.parent),
                capture_output=True,
                text=True,
            )
            self.assertEqual(proc.returncode, 0, proc.stderr)
            doc = json.loads(out.read_text(encoding="utf-8"))
            self.assertEqual(doc["expires_at"] - doc["issued_at"], TTL_SECONDS)
            self.assertNotEqual(doc["issued_at"], STALE_TEMPLATE_TS)
            code = verify(
                str(out),
                IN_SCOPE,
                now=doc["issued_at"],
                master_pubkey_hex=pub,
            )
            self.assertEqual(code, EXIT_OK)
            cli = subprocess.run(
                [
                    sys.executable,
                    str(ROOT / "verify.py"),
                    str(out),
                    json.dumps(IN_SCOPE),
                ],
                check=False,
                cwd=str(ROOT.parent),
                capture_output=True,
                text=True,
            )
            # Uninjected MASTER_PUBKEY_HEX must fail closed.
            # Unix $? is 41, not 401 (8-bit wait status).
            self.assertEqual(cli.returncode, 41)
            self.assertIn("invalid passport signature", cli.stdout)
            self.assertIn("GUARDIAN_EXIT=401", cli.stderr)


    def test_expired_is_403(self):
        doc, pub, _ = _minted(now=1_000_000)
        code = verify_document(doc, IN_SCOPE, now=doc["expires_at"], master_pubkey_hex=pub)
        self.assertEqual(code, EXIT_DENY)

    def test_not_yet_valid_is_403(self):
        doc, pub, _ = _minted(now=2_000_000)
        code = verify_document(doc, IN_SCOPE, now=1_999_999, master_pubkey_hex=pub)
        self.assertEqual(code, EXIT_DENY)

    def test_env_access_denied_is_403(self):
        doc, pub, _ = _minted()
        action = {"kind": "READ", "target_path": "src/.env"}
        code = verify_document(doc, action, now=doc["issued_at"], master_pubkey_hex=pub)
        self.assertEqual(code, EXIT_DENY)

    def test_forbidden_path_is_407(self):
        doc, pub, _ = _minted()
        action = {"kind": "READ", "target_path": "/secrets/karasu.sk"}
        code = verify_document(doc, action, now=doc["issued_at"], master_pubkey_hex=pub)
        self.assertEqual(code, EXIT_BOUNDARY)

    def test_boundary_does_not_prefix_false_positive(self):
        doc, pub, _ = _minted()
        action = {"kind": "READ", "target_path": "/secrets-not-really"}
        code = verify_document(doc, action, now=doc["issued_at"], master_pubkey_hex=pub)
        self.assertEqual(code, EXIT_OK)

    def test_cli_exit_map_is_8_bit(self):
        self.assertEqual(CLI_EXIT[EXIT_OK], 0)
        self.assertEqual(CLI_EXIT[EXIT_SIG], 41)
        self.assertEqual(CLI_EXIT[EXIT_DENY], 43)
        self.assertEqual(CLI_EXIT[EXIT_BOUNDARY], 47)
        for unix in CLI_EXIT.values():
            self.assertLess(unix, 256)

    def test_action_not_in_scopes_is_403(self):
        doc, pub, _ = _minted()
        action = {"kind": "PUSH", "target_path": "src/app.mjs"}
        code = verify_document(doc, action, now=doc["issued_at"], master_pubkey_hex=pub)
        self.assertEqual(code, EXIT_DENY)

    def test_file_roundtrip_reordered_keys_still_verify(self):
        doc, pub, _ = _minted()
        scrambled = json.loads(json.dumps(doc))
        # Re-dump with a different first-key order in the file; verify re-canonicalizes.
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "passport.json"
            path.write_text(json.dumps(scrambled, indent=4), encoding="utf-8")
            code = verify(
                str(path),
                IN_SCOPE,
                now=doc["issued_at"],
                master_pubkey_hex=pub,
            )
        self.assertEqual(code, EXIT_OK)
        self.assertEqual(
            canonical(payload_without_signature(doc)),
            canonical(payload_without_signature(scrambled)),
        )

    def test_key_type_curve25519_on_signed_payload_is_401(self):
        sk, pub = _keypair()
        doc = mint(_template(), sk, now=1_700_000_000)
        # Tamper unsigned? key_type is signed — changing it must fail sig first.
        doc["key_type"] = "Curve25519"
        code = verify_document(doc, IN_SCOPE, now=doc["issued_at"], master_pubkey_hex=pub)
        self.assertEqual(code, EXIT_SIG)


if __name__ == "__main__":
    unittest.main()
