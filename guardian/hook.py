#!/usr/bin/env python3
# CURSOR HOOK — OPEN
# Wrapper only: call verify() before spawn. Init-hook wiring is not in this module.

from __future__ import annotations

import json
import sys
from pathlib import Path

if __name__ == "__main__" and __package__ is None:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from guardian.verify import EXIT_OK, verify


def gate(passport_path: str, attempted_action: dict) -> int:
    return verify(passport_path, attempted_action)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(
            "usage: python3 guardian/hook.py <passport.json> '<action-json>'",
            file=sys.stderr,
        )
        sys.exit(2)
    code = gate(sys.argv[1], json.loads(sys.argv[2]))
    if code != EXIT_OK:
        sys.exit(code)
    print("◆ GUARDIAN — hook OPEN: verify passed; spawn is not wired.")
    sys.exit(EXIT_OK)
