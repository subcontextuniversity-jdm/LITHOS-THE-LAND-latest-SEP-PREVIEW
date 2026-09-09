# RECEIPT CONTRACT — binding the claim to evidence

**Question this answers:** *"How do we know Hermes didn't fake it?"*
**Answer:** a "done" claim is worthless on its own. It must be bound to external,
independently inspectable facts — a content-addressed environment, declared
authority, captured output, and a receipt anyone can re-check.

This is the LITHOS reading of the container / Kubernetes distribution model: not
installable packages, but **complete, reproducible worker environments** (app +
runtime + libraries + config) bundled into a versioned, content-addressed image.

---

## Infrastructure concept → LITHOS meaning

| Infrastructure concept | LITHOS meaning |
| --- | --- |
| Docker image | Sealed worker environment |
| Image digest | S-SHASH identity |
| Container registry | Approved worker vault |
| Kubernetes workload | Summoned worker instance |
| Registry credentials | PASS |
| Image vulnerability scan | REVIEW GATE |
| Deployment manifest | DESCRIBE / execution contract |
| Container logs and results | RECEIPT |
| Image relationships | LINEAGE |
| Kubernetes cluster | Future TALON worker network |

Clean execution path:

```text
OBJECT → PASS → APPROVED IMAGE → HERMES RUN → OUTPUT → RECEIPT
```

The security property: **Hermes cannot quietly alter its environment between
runs.** The sealed image is content-addressed (S-SHASH), the authority is
declared (PASS), the output is captured and hashed, and the receipt is
inspectable.

---

## Evidence binding fields (implemented in `src/p01/receipts.ts`)

Each HERMES run now emits a run-level receipt (`capability: hermes.run`) carrying
an `EvidenceBinding`. Fields are populated honestly: what is computable today is
bound now; what needs Docker / a registry / a live model is a visible **PENDING**
placeholder (never a fake value).

| Field | Status today | Becomes real when |
| --- | --- | --- |
| Exact container-image digest (S-SHASH) | **PENDING** | Hermes runs inside a Docker-sealed image (Next) |
| Model + model-file hash | **PENDING** | a live model file is loaded (Ollama / LM Studio) |
| MCP server version | **PENDING** | an external LITHOS MCP is used |
| Skill/plugin (toolset) version | **bound** (`lithos-p01-tools@0.1.0`) | — |
| Input object ID + hash | **bound** | — |
| Granted capabilities | **bound** (from the PASS grant) | — |
| Network-access state | **bound** (`none · no egress granted`) | — |
| Start + completion times | **bound** | — |
| Output hash + storage location | **bound** (`NOTE-0042@revN`) | — |
| Exit status + validation result | **bound** (`OK` / `VERIFIED`·`BLOCKED`·`FAILED`) | — |

No field is dressed up as bound when it isn't (see `src/p01/environment.ts`,
`isPending`). This is the "no fake green lights" rule applied to the environment
itself, not just the outcome.

---

## Architecture call (roadmap)

- **Now:** run Hermes directly on Windows/Ollama and implement the receipt
  contract. *(The receipt contract — this document + `EvidenceBinding` — is done
  here; the Windows/Ollama execution is Josh-side and outside this cloud
  environment.)*
- **Next:** package one tiny LITHOS MCP worker using Docker Compose → the
  `imageDigest` / S-SHASH binding becomes real.
- **Later:** introduce a private container registry (Approved Worker Vault) for
  signed, approved workers; JFrog is a candidate — a single virtual registry
  combining approved internal images with cached external images, plus dependency
  tracing and access controls.
- **HOLD:** Kubernetes. A single RTX 3070 workstation does not need cluster
  orchestration yet.
- **Future:** Kubernetes becomes justified when TALON has several independent
  machines, remote workers, automatic restarts and workload scheduling.

Division of labour: **LITHOS describes and authorises the work. Hermes executes
it. Docker seals the environment. A registry (e.g. JFrog) preserves and verifies
what was actually deployed.**

---

## New canonical terms (to fold into `docs/LEXICON.md` on ratification)

These arrived with this mapping and are recorded here so the lexicon branch can
absorb them under the same ratify-before-schema discipline:

- **S-SHASH** — content-addressed identity of a sealed worker environment (image digest).
- **APPROVED WORKER VAULT** — the registry of signed, approved worker images.
- **REVIEW GATE** — the scan/acceptance check an image passes before it is approved.
- **SUMMONED WORKER INSTANCE** — a running worker (k8s workload) summoned from an approved image.
- **TALON WORKER NETWORK** — the future multi-machine worker fabric (k8s cluster).
- **SEALED WORKER ENVIRONMENT** — the Docker image: app + runtime + libraries + config, versioned.
