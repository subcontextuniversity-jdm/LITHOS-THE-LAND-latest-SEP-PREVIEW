# Bounds

A node is bounded if every one of these is true:

- place id matches the session
- thing id matches the session
- human id matches the session
- grants exclude forbidden glyphs
- required grants from weight are present before execute
- role cannot knot
- Sentinel cannot execute; Gator cannot attest

Network bounds (separate machines, capability tokens, revocation): **ABSENT**.

This folder is the local typestate. It is not a cluster.
