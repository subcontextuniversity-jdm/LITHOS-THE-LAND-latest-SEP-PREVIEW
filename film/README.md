# Film plates — generate motion, stamp type later

Video models butcher thesis copy. Generate **motion plates** with these prompts. Add overlays in the edit (DaVinci / the typewriter layer in this preview).

Continuity:

```text
CODE → LINE → THREAD → STITCH → KNOT → OBJECT → TREE
TREE → LEAF → SCREEN → ACTION → ASSET → BRANCH → LIBRARY → TREE
```

Sound:

```text
KEY → CLICK → STITCH → TENSION → CONFIRM → BEAT → SILENCE
```

## Order

1. Generate Clip 01.
2. Export the **final diamond frame**.
3. Use that actual frame as Clip 02's start image.
4. Generate Clip 03 from a still of the golden tree (Clip 02 end, before cursor).
5. Export Clip 03's last frame (object + threads beyond frame).
6. Use that frame as Clip 04's start image.

Do not ask the model to render `PROVIDERS SUPPLY CAPABILITY, NEVER SOVEREIGNTY` or correct equations. Stamp those from `overlays.txt`.

Prompts live in `clip-01.txt` … `clip-04.txt`. One paste each.
