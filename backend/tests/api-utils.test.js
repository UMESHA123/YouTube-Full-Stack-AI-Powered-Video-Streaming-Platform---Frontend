import test from "node:test";
import assert from "node:assert/strict";
import { ApiResponse } from "../api/utils/ApiResponse.js";
import { ApiError } from "../api/utils/ApiError.js";

test("ApiResponse marks successful status codes", () => {
  const response = new ApiResponse(200, { ok: true }, "ok");
  assert.equal(response.success, true);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.data, { ok: true });
});

test("ApiResponse marks failure status codes", () => {
  const response = new ApiResponse(500, null, "error");
  assert.equal(response.success, false);
  assert.equal(response.message, "error");
});

test("ApiError keeps status code and errors array", () => {
  const error = new ApiError(400, "Bad Request", ["field is required"]);
  assert.equal(error.success, false);
  assert.equal(error.statusCode, 400);
  assert.equal(error.message, "Bad Request");
  assert.deepEqual(error.errors, ["field is required"]);
});
