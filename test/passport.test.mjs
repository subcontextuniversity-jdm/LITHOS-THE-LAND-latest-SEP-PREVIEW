import test from "node:test";
import assert from "node:assert/strict";
import { WORKER } from "../src/law.mjs";
import {
  CAPABILITY_RULE,
  SPINE_LAW,
  SWITCHBOARD,
  WORKERS,
  VAULTS,
  EXPERIMENTS,
  HONESTY,
  containsSecret,
  mintPassport,
  grantToWorker,
  useCapability,
  routeAsk,
  openGauntlet,
  emailToRecord,
  forgeIntent,
} from "../src/passport.mjs";

const human = { id: "human-josh", name: "Josh", role: "CURSOR" };
const github = VAULTS.find((item) => item.id === "github-dev");

test("agents receive bounded capabilities, not inherited human credentials", () => {
  assert.equal(
    CAPABILITY_RULE,
    "Agents receive bounded capabilities, not inherited human credentials.",
  );
  assert.match(SPINE_LAW, /Proton Pass knows the secrets/);
  assert.match(SPINE_LAW, /Models know only the context they're handed/);
  assert.equal(WORKERS.SENTINEL, "boundary/permission");
  assert.equal(WORKERS.LUMO, "private thinking");
  assert.deepEqual(SWITCHBOARD, ["ASK", "ROUTE", "MODEL", "RESULT", "REVIEW", "RECEIPT"]);
  assert.equal(HONESTY.handoff003, "NOT WRITTEN");
  assert.equal(EXPERIMENTS.length, 12);
  assert.equal(EXPERIMENTS[0].state, "LIVE");
});

test("a passport records vault scope and never stores a password", async () => {
  const refused = await mintPassport({
    vault: github,
    worker: "forge",
    human,
    extra: { password: "should-not-land" },
  });
  assert.equal(refused.ok, false);

  const minted = await mintPassport({
    vault: github,
    worker: "forge",
    human,
    scope: ["read", "open_pr"],
  });
  assert.equal(minted.ok, true);
  assert.equal(minted.passport.holdsSecret, false);
  assert.equal(minted.passport.credentialBoundary, "PROTON PASS");
  assert.equal(minted.passport.vault, "GITHUB//DEV");
  assert.equal(containsSecret(minted.passport), false);
  assert.equal("password" in minted.passport, false);
  assert.equal("token" in minted.passport, false);
});

test("a worker receives the passport, not Josh's login", async () => {
  const minted = await mintPassport({ vault: github, worker: "forge", human, scope: ["read"] });
  assert.equal(
    grantToWorker(minted.passport, { inheritCredentials: true }).ok,
    false,
  );
  const granted = grantToWorker(minted.passport, WORKER);
  assert.equal(granted.ok, true);
  assert.deepEqual(granted.grant.cannot, [
    "read_secret",
    "inherit_human_login",
    "store_password",
  ]);
  assert.equal(granted.grant.holdsSecret, false);
  assert.equal(useCapability(minted.passport, "read_secret").ok, false);
  assert.equal(useCapability(minted.passport, "write").ok, false);
  assert.equal(useCapability(minted.passport, "write", { human }).ok, false);
  assert.equal(useCapability(minted.passport, "read").ok, true);
});

test("an expired passport is refused by SENTINEL", async () => {
  const minted = await mintPassport({
    vault: github,
    worker: "forge",
    human,
    ttlMs: 1,
  });
  const expired = useCapability(minted.passport, "read", { at: minted.passport.expiry + 10 });
  assert.equal(expired.ok, false);
  assert.match(expired.error, /expired/);
});

test("Firefox switchboard selects a worker; it does not become the OS", () => {
  const routed = routeAsk({ kind: "signal", recordRef: "SIGNAL://1" });
  assert.deepEqual(routed.route, SWITCHBOARD);
  assert.equal(routed.model, "grok");
  assert.equal(routed.live, false);
  assert.equal(routed.context, "SIGNAL://1");
  assert.equal(openGauntlet({ uncertain: false }).ok, false);
  assert.deepEqual(openGauntlet({ uncertain: true }).racers, ["claude", "gpt", "grok"]);
});

test("email becomes a record reference, not paste for a model", () => {
  const converted = emailToRecord({ id: "EMAIL://9341" });
  assert.equal(converted.evidence, "EMAIL://9341");
  assert.equal(converted.bodyCopiedIntoModel, false);
  assert.ok(converted.derived.some((item) => item.id === "RECEIPT://991"));
});

test("forge intent does not push with a GitHub login", () => {
  assert.equal(forgeIntent("repair-lounge", null).ok, false);
  const forged = forgeIntent("repair-lounge", human);
  assert.equal(forged.pushed, false);
  assert.equal(forged.credential, null);
  assert.ok(forged.pipeline.includes("receipt"));
});
