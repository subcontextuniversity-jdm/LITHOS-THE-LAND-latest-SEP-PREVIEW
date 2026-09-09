// P01 — the sealed worker environment identity.
//
// This is the LITHOS reading of the container/Kubernetes distribution model:
//
//   Docker image        → sealed worker environment
//   Image digest        → S-SHASH identity
//   Container registry  → approved worker vault
//   Registry credential → PASS
//   Deployment manifest → DESCRIBE / execution contract
//   Container logs      → RECEIPT
//   Image relationships → LINEAGE
//
// The point of binding these into a receipt is that Hermes cannot quietly alter
// its environment between runs: the claim is tied to a content-addressed image,
// declared authority, captured output and an inspectable receipt.
//
// HONESTY: Hermes is not containerised yet and no live model/MCP is connected in
// this environment. Fields that require Docker / a registry / Ollama·LM Studio
// are marked PENDING here rather than fabricated. They become real on the
// roadmap (Docker: Next → private registry: Later).

export const PENDING = (why: string) => `pending · ${why}`;

export interface WorkerEnvironment {
  /** S-SHASH of the sealed worker image. Real once Hermes runs in Docker. */
  imageDigest: string;
  modelId: string;
  /** Hash of the model file. Real once a live model file is loaded. */
  modelFileHash: string;
  /** LITHOS MCP server version. Real once an external MCP is used. */
  mcpVersion: string;
  /** Skill/plugin (toolset) version — real now; this is our in-process toolset. */
  toolsetVersion: string;
}

export const WORKER_ENVIRONMENT: WorkerEnvironment = {
  imageDigest: PENDING("uncontainerised (Docker seal is roadmap: Next)"),
  modelId: "local-deterministic-stub",
  modelFileHash: PENDING("no model file — Ollama/LM Studio not connected"),
  mcpVersion: PENDING("in-process — no external LITHOS MCP yet"),
  toolsetVersion: "lithos-p01-tools@0.1.0",
};

export function isPending(value: string): boolean {
  return value.startsWith("pending · ");
}
