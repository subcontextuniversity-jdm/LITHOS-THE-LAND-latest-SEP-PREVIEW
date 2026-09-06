#!/usr/bin/env python3
# CURSOR HOOK — OPEN
# Wrapper only: call verify() before spawn. Init-hook wiring is not in this module.

from __future__ import annotations

import json
import sys
from pathlib import Path

if __name__ == "__main__" and __package__ is None:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from guardian.verify import CLI_EXIT, EXIT_OK, EXIT_SIG, verify


def gate(passport_path: str, attempted_action: dict) -> int:
    return verify(passport_path, attempted_action)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(
            "usage: python3 guardian/hook.py <passport.json> '<action-json>'",
            file=sys.stderr,
        )
        sys.exit(2)
    try:
        action = json.loads(sys.argv[2])
        if not isinstance(action, dict):
            raise ValueError("action must be a JSON object")
    except ValueError:
        print("GUARDIAN_EXIT=401", file=sys.stderr)
        sys.exit(CLI_EXIT[EXIT_SIG])
    code = gate(sys.argv[1], action)
    print(f"GUARDIAN_EXIT={code}", file=sys.stderr)
    if code != EXIT_OK:
        sys.exit(CLI_EXIT[code])
    print("◆ GUARDIAN — hook OPEN: verify passed; spawn is not wired.")
    sys.exit(EXIT_OK)
