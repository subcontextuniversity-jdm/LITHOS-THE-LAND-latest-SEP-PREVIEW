import test from "node:test";
import assert from "node:assert/strict";
import {
  AIRLOCK_ID,
  AUTH_STATUS,
  LOGIN_KIND,
  PASSPORT_STATUS,
  PLACE,
  arrive,
  loginNewest,
  presentNode,
  pullGoldenCord,
  refuseFusedLogin,
} from "../src/airlock.mjs";
import { seedThing0041 } from "../src/spine.mjs";

test("JDM airlock binds a named human as CURSOR", () => {
  assert.equal(arrive("  ").ok, false);
  const in_ = arrive("Josh");
  assert.equal(in_.ok, true);
  assert.equal(in_.airlock, AIRLOCK_ID);
  assert.equal(in_.human.role, "CURSOR");
  assert.equal(in_.human.id, "human-josh");
});

test("LOGIN-NEWEST splits gator and sentinel without a passport", () => {
  const thing = seedThing0041();
  const gator = loginNewest({ name: "Josh", nodeKind: "GATOR", thing });
  const sentinel = loginNewest({ name: "Josh", nodeKind: "SENTINEL", thing });
  assert.equal(gator.ok, true);
  assert.equal(gator.login, LOGIN_KIND);
  assert.equal(gator.authorization, AUTH_STATUS);
  assert.equal(gator.passport, PASSPORT_STATUS);
  assert.equal(gator.session.place.id, PLACE.id);
  assert.equal(gator.session.node.role, "GATOR");
  assert.equal(sentinel.session.node.role, "SENTINEL");
  assert.equal(gator.session.human.id, sentinel.session.human.id);
  assert.equal(gator.fused, false);
});

test("airlock rejects sovereignty, fused login, and the golden cord", () => {
  const thing = seedThing0041();
  const denied = loginNewest({
    name: "Josh",
    nodeKind: "GATOR",
    thing,
    grants: ["sovereignty"],
  });
  assert.equal(denied.ok, false);
  assert.equal(pullGoldenCord().ok, false);
  assert.equal(refuseFusedLogin().ok, false);
  assert.equal(presentNode("CURSOR").ok, false);
});
