import { createLogger } from "../src/create-logger.mjs";
import { expect, test } from "@jest/globals";
import { PassThrough } from "node:stream";
import winston from "winston";

test("creates an injectable logger", () => {
  expect(createLogger({ transports: [] }).info).toEqual(expect.any(Function));
});

test("configures JSON output and redaction", async () => {
  const stream = new PassThrough();
  const outputReady = new Promise((resolve) => stream.once("data", resolve));
  createLogger({
    format: "json",
    keys: ["secret"],
    transports: [new winston.transports.Stream({ stream })],
  }).info("message", { secret: "hidden" });
  const output = (await outputReady).toString();
  expect(JSON.parse(output.trim()).secret).toBe("[REDACTED]");
});

test("rejects malformed redaction configuration", () => {
  expect(() => createLogger({ keys: null, transports: [] })).toThrow("keys");
});

test("rejects an invalid configured level", () => {
  expect(() => createLogger({ level: "not-a-winston-level", transports: [] })).toThrow(
    "Unknown logger level",
  );
});
