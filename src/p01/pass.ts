// P01 — the PASS contract.
//
// PASS is enforceable architecture, NOT UI hiding. Authorization is:
//
//     actor + object + capability + scope  →  ALLOW | DENY
//
// A request outside scope is DENY → RECORD → RECEIPT (BLOCKED). There is no
// silent failure and no path to execute a capability without passing this gate:
// capability handlers are private and can only be reached through `invoke`.
// Hiding a button in NOTE is never what stops NOTE from acting — the absence of
// a grant is.

import type { ObjectStore } from "./object.ts";
import { CANONICAL_NOTE_ID, contentHash } from "./object.ts";
import type { Receipt } from "./receipts.ts";
import { ReceiptLedger } from "./receipts.ts";

export type Capability = "note.read" | "note.update" | "note.describe" | "note.delete";

export const ALL_CAPABILITIES: Capability[] = [
  "note.read",
  "note.update",
  "note.describe",
  "note.delete",
];

export interface Grant {
  actor: string;
  object: string;
  capabilities: Capability[];
  scope: string;
}

export interface Decision {
  decision: "ALLOW" | "DENY";
  scope: string;
  reason?: string;
}

export interface InvokeResult {
  ok: boolean;
  decision: "ALLOW" | "DENY";
  receipt: Receipt;
  value?: unknown;
}

// Deliberately tiny, deliberately explicit. note.delete is defined but granted
// to NO ONE in this proof — the forbidden capability used to demonstrate DENY.
export function seedGrants(): Grant[] {
  return [
    {
      actor: "HUMAN:JOSH",
      object: CANONICAL_NOTE_ID,
      capabilities: ["note.read", "note.update"],
      scope: "human/note-0042",
    },
    {
      actor: "WORKER:HERMES",
      object: CANONICAL_NOTE_ID,
      capabilities: ["note.read", "note.describe", "note.update"],
      scope: "job/describe+append",
    },
  ];
}

export interface CapabilityContext {
  store: ObjectStore;
  actor: string;
  object: string;
  args: Record<string, unknown>;
  runtime: string;
}

export interface CapabilityOutcome {
  value: unknown;
  /** Inspectable evidence string proving the effect actually happened. */
  evidence: string;
  /** Whether the effect was confirmed by independent inspection. */
  verified: boolean;
}

export class PassEngine {
  private grants: Grant[];
  // Handlers are private: the only way to run one is through `invoke`, so the
  // PASS check can never be bypassed by "discovering an endpoint".
  private handlers: Record<Capability, (ctx: CapabilityContext) => CapabilityOutcome>;

  constructor(
    private store: ObjectStore,
    private ledger: ReceiptLedger,
    grants: Grant[] = seedGrants(),
  ) {
    this.grants = grants;
    this.handlers = {
      "note.read": (ctx) => {
        const n = ctx.store.read(ctx.object);
        return { value: n, evidence: `read rev ${n.revision} · ${contentHash(n)}`, verified: true };
      },
      "note.describe": (ctx) => {
        const n = ctx.store.read(ctx.object);
        // LOCAL DETERMINISTIC STUB — not a live model. LM Studio is not connected
        // in this environment, so this is explicitly NOT a verified model call.
        const words = n.body.trim().split(/\s+/).filter(Boolean).length;
        const desc = `"${n.title}" — ${n.status.toLowerCase()} note, ${words} words across ${n.body.split("\n").length} line(s).`;
        // The description genuinely happened and is inspectable, so it is VERIFIED
        // as a LOCAL DETERMINISTIC result. Honesty lives in the runtime label: this
        // is NOT a live model. LM Studio is not connected in this environment.
        return {
          value: desc,
          evidence: `describe(local-deterministic, NOT a live model) len=${desc.length} · runtime=${ctx.runtime}`,
          verified: true,
        };
      },
      "note.update": (ctx) => {
        const append = String(ctx.args.append ?? "");
        if (!append) throw new Error("note.update requires 'append' text");
        const before = ctx.store.read(ctx.object);
        const hashBefore = contentHash(before);
        const entry = ctx.store.applyUpdate(ctx.object, ctx.actor, "note.update", append);
        // Independent confirmation: revision advanced and hash changed as expected.
        const verified = entry.revision === before.revision + 1 && entry.hashAfter !== hashBefore;
        return {
          value: { revision: entry.revision },
          evidence: `rev ${before.revision} → ${entry.revision} · ${entry.hashBefore} → ${entry.hashAfter}`,
          verified,
        };
      },
      "note.delete": () => {
        // Handler exists so a request can be *attempted* and denied — but no grant
        // includes it, so authorize() blocks it before we ever get here.
        throw new Error("note.delete is not implemented in P01");
      },
    };
  }

  authorize(actor: string, object: string, capability: Capability): Decision {
    const grant = this.grants.find((g) => g.actor === actor && g.object === object);
    if (!grant) {
      return { decision: "DENY", scope: "none", reason: `no PASS for ${actor} on ${object}` };
    }
    if (!grant.capabilities.includes(capability)) {
      return {
        decision: "DENY",
        scope: grant.scope,
        reason: `${capability} not in scope '${grant.scope}'`,
      };
    }
    return { decision: "ALLOW", scope: grant.scope };
  }

  /**
   * The single gateway. Authorize → (allow) run handler + receipt VERIFIED/FAILED
   * → (deny) receipt BLOCKED. Callers never touch handlers directly.
   */
  invoke(
    actor: string,
    object: string,
    capability: Capability,
    args: Record<string, unknown> = {},
    runtime = "lithos-mcp/local",
  ): InvokeResult {
    const decision = this.authorize(actor, object, capability);

    if (decision.decision === "DENY") {
      const receipt = this.ledger.record({
        actor,
        object,
        capability,
        scope: decision.scope,
        decision: "DENY",
        verification: "BLOCKED",
        evidence: decision.reason ?? "denied",
        runtime,
      });
      return { ok: false, decision: "DENY", receipt };
    }

    try {
      const outcome = this.handlers[capability]({ store: this.store, actor, object, args, runtime });
      const receipt = this.ledger.record({
        actor,
        object,
        capability,
        scope: decision.scope,
        decision: "ALLOW",
        verification: outcome.verified ? "VERIFIED" : "FAILED",
        evidence: outcome.evidence,
        runtime,
      });
      return { ok: outcome.verified, decision: "ALLOW", receipt, value: outcome.value };
    } catch (err) {
      const receipt = this.ledger.record({
        actor,
        object,
        capability,
        scope: decision.scope,
        decision: "ALLOW",
        verification: "FAILED",
        evidence: `error: ${(err as Error).message}`,
        runtime,
      });
      return { ok: false, decision: "ALLOW", receipt };
    }
  }
}
