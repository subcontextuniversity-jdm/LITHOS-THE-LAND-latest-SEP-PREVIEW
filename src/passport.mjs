import { sha256 } from "./law.mjs";
import { canonicalize } from "./canonical.mjs";

export const CAPABILITY_RULE =
  "Agents receive bounded capabilities, not inherited human credentials.";

export const SPINE_LAW = `Proton Pass knows the secrets.
Proton Mail knows identity/messages.
Slack knows the active conversation.
Lumo knows private context.
Google knows Workspace.
GitHub knows code.
Models know only the context they're handed.
LITHOS knows how all of those pieces relate.`;

export const SWITCHBOARD = Object.freeze([
  "ASK",
  "ROUTE",
  "MODEL",
  "RESULT",
  "REVIEW",
  "RECEIPT",
]);

export const WORKERS = Object.freeze({
  TALON: "route/fork/return",
  SENTINEL: "boundary/permission",
  GLASS: "visibility/review",
  FORGE: "build/code",
  LUMO: "private thinking",
});

export const SECRET_KEYS = Object.freeze([
  "password",
  "secret",
  "token",
  "pat",
  "credential",
  "pass",
  "apiKey",
  "api_key",
  "refreshToken",
  "privateKey",
]);

export const VAULTS = Object.freeze([
  { id: "lithos-core", label: "LITHOS//CORE", knows: "lithos-scope", connector: "proton-pass" },
  { id: "google-workspace", label: "GOOGLE//WORKSPACE", knows: "workspace", connector: "google" },
  { id: "github-dev", label: "GITHUB//DEV", knows: "code", connector: "github" },
  { id: "slack-comms", label: "SLACK//COMMS", knows: "conversation", connector: "slack" },
  { id: "fixmyiphone-ops", label: "FIXMYIPHONE//OPS", knows: "ops", connector: "fixmyiphone" },
]);

export const CONNECTORS = Object.freeze([
  {
    id: "proton-pass",
    name: "Proton Pass",
    knows: "secrets",
    storesSecret: false,
    state: "ABSENT",
    flags: {
      connected: false,
      read: false,
      write: false,
      humanApproval: true,
      localOnly: true,
      expiry: null,
      lastUsed: null,
    },
  },
  {
    id: "proton-mail",
    name: "Proton Mail",
    knows: "identity/messages",
    storesSecret: false,
    state: "ABSENT",
    flags: {
      connected: false,
      read: false,
      write: false,
      humanApproval: true,
      localOnly: true,
      expiry: null,
      lastUsed: null,
    },
  },
  {
    id: "slack",
    name: "Slack",
    knows: "active conversation",
    storesSecret: false,
    state: "ABSENT",
    flags: {
      connected: false,
      read: false,
      write: false,
      humanApproval: true,
      localOnly: false,
      expiry: null,
      lastUsed: null,
    },
  },
  {
    id: "firefox",
    name: "Firefox",
    knows: "model switchboard",
    storesSecret: false,
    state: "SKETCH",
    flags: {
      connected: false,
      read: true,
      write: false,
      humanApproval: true,
      localOnly: true,
      expiry: null,
      lastUsed: null,
    },
  },
  {
    id: "lumo",
    name: "Lumo",
    knows: "private context",
    storesSecret: false,
    state: "SKETCH",
    flags: {
      connected: false,
      read: false,
      write: false,
      humanApproval: true,
      localOnly: true,
      expiry: null,
      lastUsed: null,
    },
  },
  {
    id: "google",
    name: "Google Workspace",
    knows: "Workspace",
    storesSecret: false,
    state: "ABSENT",
    flags: {
      connected: false,
      read: false,
      write: false,
      humanApproval: true,
      localOnly: false,
      expiry: null,
      lastUsed: null,
    },
  },
  {
    id: "github",
    name: "GitHub",
    knows: "code",
    storesSecret: false,
    state: "ABSENT",
    flags: {
      connected: false,
      read: false,
      write: false,
      humanApproval: true,
      localOnly: false,
      expiry: null,
      lastUsed: null,
    },
  },
  {
    id: "cursor",
    name: "Cursor / Forge",
    knows: "build/code",
    storesSecret: false,
    state: "SKETCH",
    flags: {
      connected: false,
      read: true,
      write: false,
      humanApproval: true,
      localOnly: true,
      expiry: null,
      lastUsed: null,
    },
  },
]);

export const EXPERIMENTS = Object.freeze([
  {
    id: "01",
    name: "PROTON PASS → CONNECTOR PASSPORTS",
    state: "LIVE",
    note: "Logical vaults around capabilities. LITHOS records scope. Proton keeps the secret.",
  },
  {
    id: "02",
    name: "PROTON MAIL → MAIL ROUTER",
    state: "SKETCH",
    note: "Aliases as event sources. Mailbox stays Proton-backed. Not implemented.",
  },
  {
    id: "03",
    name: "SLACK → HUMAN/AGENT BUS",
    state: "SKETCH",
    note: "Conversation is not canonical memory. Channels map to Places. Not connected.",
  },
  {
    id: "04",
    name: "FIREFOX → MODEL SWITCHBOARD",
    state: "SKETCH",
    note: "ASK → ROUTE → MODEL → RESULT → REVIEW → RECEIPT. The model is a worker, not the OS.",
  },
  {
    id: "05",
    name: "LUMO → PRIVATE THINKING ROOM",
    state: "SKETCH",
    note: "Encrypted continuity. Not a general chatbot.",
  },
  {
    id: "06",
    name: "GOOGLE WORKSPACE → PRODUCTIVITY CONNECTOR",
    state: "ABSENT",
    note: "Gemini for Google-native work. LITHOS stays above it.",
  },
  {
    id: "07",
    name: "GROK → SIGNAL WORKER",
    state: "SKETCH",
    note: "Narrow identity: pulse, not a second OS.",
  },
  {
    id: "08",
    name: "GITHUB + CURSOR → FORGE PIPELINE",
    state: "SKETCH",
    note: "Worker gets repository capability, not Josh's master login.",
  },
  {
    id: "09",
    name: "MODEL RACING / GAUNTLET",
    state: "SKETCH",
    note: "Race only when uncertainty justifies the cost.",
  },
  {
    id: "10",
    name: "EMAIL → THING / RECEIPT CONVERSION",
    state: "SKETCH",
    note: "The original message remains evidence. Agents retrieve records; they do not paste inboxes.",
  },
  {
    id: "11",
    name: "CONNECTOR STORE / PATCH BAY",
    state: "SKETCH",
    note: "CONNECTED · READ · WRITE · HUMAN APPROVAL · LOCAL ONLY · EXPIRY · LAST USED",
  },
  {
    id: "12",
    name: "LOOMO/LUMO → CREDENTIAL-SPINE MAP",
    state: "SKETCH",
    note: "A graph of relations. Not another settings page. Not another password manager.",
  },
]);

export const SPINE_MAP = `                         JOSH
                           │
                    SENTINEL / SCOPE
                           │
                 ┌─────────┴─────────┐
                 │                   │
           PROTON PASS          PROTON MAIL
           credentials          identity/events
                 │                   │
        ┌────────┼────────┐          │
      Google   GitHub    Slack    aliases
        │        │         │
     Gemini   Cursor    TALON
        │        │         │
        └────────┼─────────┘
                 │
              LITHOS
                 │
        ┌────────┼─────────┐
      Claude   GPT       Grok
     reasoning synthesis  signal
        │        │         │
        └────────┼─────────┘
                 ↓
              GLASS
                 ↓
             RECEIPT
                 ↓
          CANONICAL RECORD`;

export const ALIASES = Object.freeze([
  "build@",
  "receipts@",
  "support@",
  "security@",
  "agents@",
  "billing@",
]);

export const PLACES = Object.freeze([
  "#lithos-build",
  "#signal",
  "#fixmyiphone",
  "#security",
  "#receipts",
]);

export function containsSecret(value, seen = new Set()) {
  if (value == null) return false;
  if (typeof value !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);
  return Object.entries(value).some(([key, nested]) => {
    if (SECRET_KEYS.includes(key)) return true;
    if (nested && typeof nested === "object") return containsSecret(nested, seen);
    return false;
  });
}

export function assertNoSecret(record) {
  if (containsSecret(record)) {
    return { ok: false, error: "A passport may not hold a secret. Proton Pass knows the secrets." };
  }
  return { ok: true };
}

export async function mintPassport({
  vault,
  worker,
  human,
  scope = ["read"],
  ttlMs = 60 * 60 * 1000,
  extra = null,
}) {
  if (!human?.id) {
    return { ok: false, error: "SENTINEL: a human grants a passport. A worker does not inherit one." };
  }
  if (!vault?.id) {
    return { ok: false, error: "A passport needs a capability vault, not a dumped password list." };
  }
  if (!worker) {
    return { ok: false, error: "A passport is issued to a worker, not to an application." };
  }
  if (containsSecret({ vault, worker, human, extra, scope })) {
    return { ok: false, error: "A passport may not hold a secret. Proton Pass knows the secrets." };
  }

  const payload = {
    vault: vault.label,
    vaultId: vault.id,
    connector: vault.connector,
    worker,
    scope: [...scope],
    grantedBy: human.id,
    credentialBoundary: "PROTON PASS",
    holdsSecret: false,
    authorization: "DEMO-ONLY",
  };
  const hash = await sha256(canonicalize(payload));
  const now = Date.now();
  const passport = Object.freeze({
    id: `PASSPORT://${vault.id.toUpperCase()}-${hash.slice(0, 4).toUpperCase()}`,
    ...payload,
    issuedAt: now,
    expiry: now + ttlMs,
    lastUsed: null,
    flags: Object.freeze({
      connected: false,
      read: scope.includes("read"),
      write: scope.includes("write"),
      humanApproval: true,
      localOnly: true,
    }),
    hash,
  });
  const clean = assertNoSecret(passport);
  if (!clean.ok) return clean;
  return { ok: true, passport };
}

export function grantToWorker(passport, worker, at = Date.now()) {
  if (!passport?.id) {
    return { ok: false, error: "No passport." };
  }
  if (containsSecret(passport)) {
    return { ok: false, error: "A passport may not hold a secret. Proton Pass knows the secrets." };
  }
  if (at >= passport.expiry) {
    return { ok: false, error: "SENTINEL: this passport has expired." };
  }
  if (worker?.role === "HUMAN" || worker?.inheritCredentials) {
    return { ok: false, error: "Workers receive capability, not inherited human credentials." };
  }
  return {
    ok: true,
    grant: Object.freeze({
      passportId: passport.id,
      worker: worker?.id ?? worker,
      can: passport.scope,
      cannot: Object.freeze(["read_secret", "inherit_human_login", "store_password"]),
      credentialBoundary: passport.credentialBoundary,
      holdsSecret: false,
    }),
  };
}

export function useCapability(passport, action, { human, at = Date.now() } = {}) {
  if (at >= passport.expiry) {
    return { ok: false, error: "SENTINEL: this passport has expired." };
  }
  if (action === "write" && passport.flags.humanApproval && !human?.id) {
    return { ok: false, error: "WRITE requires human approval." };
  }
  if (action === "write" && !passport.scope.includes("write")) {
    return { ok: false, error: "SENTINEL: write is out of scope." };
  }
  if (action === "read" && !passport.scope.includes("read")) {
    return { ok: false, error: "SENTINEL: read is out of scope." };
  }
  if (action === "read_secret" || action === "inherit_login") {
    return { ok: false, error: "Agents receive bounded capabilities, not inherited human credentials." };
  }
  return {
    ok: true,
    used: { passportId: passport.id, action, at },
    lastUsed: at,
  };
}

export function routeAsk(task) {
  const models = {
    google: "gemini",
    github: "forge",
    signal: "grok",
    private: "lumo",
    default: "claude",
  };
  const model = models[task?.kind] ?? models.default;
  return {
    path: SWITCHBOARD,
    route: [...SWITCHBOARD],
    model,
    context: task?.recordRef ?? null,
    note: "The model is a worker selected by the OS. It receives handed context, not the vault.",
    live: false,
  };
}

export function openGauntlet(task) {
  if (!task?.uncertain) {
    return {
      ok: false,
      error: "Do not race every task. Gauntlet only when uncertainty justifies the cost.",
    };
  }
  return {
    ok: true,
    racers: ["claude", "gpt", "grok"],
    judge: "GLASS",
    live: false,
  };
}

export function emailToRecord(email) {
  const id = email?.id ?? "EMAIL://9341";
  return {
    evidence: id,
    derived: [
      { id: "TASK://221", from: id },
      { id: "THREAD://88", from: id },
      { id: "ARTIFACT://41", from: id },
      { id: "RECEIPT://991", from: id },
    ],
    bodyCopiedIntoModel: false,
    note: "Agents retrieve the record. They do not paste the inbox.",
  };
}

export function forgeIntent(name, human) {
  if (!human?.id) {
    return { ok: false, error: "FORGE needs a human intent. It does not push with Josh's login." };
  }
  return {
    ok: true,
    pipeline: Object.freeze([
      "INTENT",
      "repo",
      "branch",
      "Cursor/Forge",
      "tests",
      "diff",
      "review",
      "receipt",
      "PR",
    ]),
    intent: name,
    pushed: false,
    credential: null,
    note: "GitHub credentials stay in the credential boundary.",
  };
}

export const HONESTY = Object.freeze({
  connectors: "ABSENT",
  secrets: "NOT STORED",
  authorization: "DEMO-ONLY",
  handoff003: "NOT WRITTEN",
});
