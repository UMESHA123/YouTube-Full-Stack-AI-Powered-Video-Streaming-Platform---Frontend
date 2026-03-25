import test from "node:test";
import assert from "node:assert/strict";
import {
  getBackendUrl,
  getKafkaBrokers,
  getCorsOrigins,
  getPort,
} from "../src/config.js";

test("notification-service config defaults are valid", () => {
  assert.equal(typeof getBackendUrl(), "string");
  assert.ok(getBackendUrl().length > 0);
  assert.ok(getKafkaBrokers().length > 0);
  assert.ok(getCorsOrigins().length > 0);
  assert.equal(typeof getPort(), "number");
});
