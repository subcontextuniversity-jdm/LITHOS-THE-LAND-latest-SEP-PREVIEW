"""Guardian Canonical JSON — the one rule locked in PASSPORT/v1.

UTF-8( json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=True) )

Floats are forbidden so timestamps cannot silently become 1.0 and so this
profile stays RFC 8785 JCS-compatible for the allowed types.
"""

from __future__ import annotations

import json
from typing import Any

SEPARATORS = (",", ":")


def _reject_floats(obj: Any) -> None:
    if type(obj) is float:
        raise TypeError("Guardian Canonical JSON forbids floats")
    if isinstance(obj, dict):
        for key, value in obj.items():
            if not isinstance(key, str):
                raise TypeError("Guardian Canonical JSON requires string keys")
            _reject_floats(value)
        return
    if isinstance(obj, list):
        for item in obj:
            _reject_floats(item)


def canonical(obj: dict) -> bytes:
    if not isinstance(obj, dict):
        raise TypeError("canonical() signs a JSON object")
    _reject_floats(obj)
    return json.dumps(
        obj,
        sort_keys=True,
        separators=SEPARATORS,
        ensure_ascii=True,
    ).encode("utf-8")


def payload_without_signature(doc: dict) -> dict:
    return {key: value for key, value in doc.items() if key != "signature"}
