import { jsonFormat } from "../../src/formats/json.mjs";
import { expect, test } from "@jest/globals";
import { PassThrough } from "node:stream";
import winston from "winston";

test("emits JSON metadata with redaction and timestamps", async () => {
  const stream = new PassThrough();
  const outputReady = new Promise((resolve) => stream.once("data", resolve));
  const logger = winston.createLogger({
    format: jsonFormat({ keys: ["token"] }, true),
    transports: [new winston.transports.Stream({ stream })],
  });
  logger.info("hello", { token: "secret", visible: true });
  const output = (await outputReady).toString();
  const record = JSON.parse(output.trim());
  expect(record.token).toBe("[REDACTED]");
  expect(record.visible).toBe(true);
  expect(record.timestamp).toBeDefined();
});

test("preserves metadata that uses reserved JSON field names", async () => {
  const stream = new PassThrough();
  const outputReady = new Promise((resolve) => stream.once("data", resolve));
  const logger = winston.createLogger({
    format: jsonFormat({ keys: [] }, false),
    transports: [new winston.transports.Stream({ stream })],
  });
  logger.info("original message", { level: "custom level", message: "custom message" });
  const record = JSON.parse((await outputReady).toString().trim());
  expect(record.level).toBe("custom level");
  expect(record.message).toBe("custom message");
});

test("ignores non-object splat arguments as metadata", () => {
  const format = jsonFormat({ keys: [] }, false);
  const result = format.transform({
    level: "info",
    message: "hello",
    [Symbol.for("splat")]: ["interpolation value"],
  });
  expect(JSON.parse(result[Symbol.for("message")])).toEqual({ level: "info", message: "hello" });
});

test("uses a safe fallback when JSON output serialization fails", () => {
  const original = JSON.stringify;
  JSON.stringify = () => {
    throw new Error("stringify");
  };
  try {
    const format = jsonFormat({ keys: [] }, false);
    const result = format.transform({ level: "info", message: "hello" });
    expect(result[Symbol.for("message")]).toBe(
      '{"level":"[Unserializable]","message":"[Unserializable]"}',
    );
  } finally {
    JSON.stringify = original;
  }
});

test("preserves a safe fallback record when level is absent", () => {
  const original = JSON.stringify;
  let calls = 0;
  JSON.stringify = (value) => {
    if (calls++ === 0) throw new Error("record");
    return original(value);
  };
  try {
    const format = jsonFormat({ keys: [] }, false);
    const result = format.transform({ message: "hello" });
    expect(result[Symbol.for("message")]).toBe('{"level":"[Unserializable]","message":"hello"}');
  } finally {
    JSON.stringify = original;
  }
});

test("formats records without a timestamp", () => {
  const format = jsonFormat({ keys: [] }, false);
  const result = format.transform({ level: "info", message: "hello" });
  expect(JSON.parse(result[Symbol.for("message")])).toMatchObject({
    level: "info",
    message: "hello",
  });
});

test("defensively serializes and redacts non-string messages", () => {
  const format = jsonFormat({ keys: ["token"] }, false);
  const circular = {};
  circular.self = circular;
  const result = format.transform({
    level: "info",
    message: { error: new Error("boom"), big: 2n, circular, token: "message-token" },
    token: "secret",
  });
  const record = JSON.parse(result[Symbol.for("message")]);
  expect(record.message.error.message).toBe("boom");
  expect(record.message.big).toBe("2n");
  expect(record.message.circular.self).toBe("[CIRCULAR]");
  expect(record.message.token).toBe("[REDACTED]");
  expect(record.token).toBe("[REDACTED]");
});

test("preserves own prototype-named metadata safely", () => {
  const format = jsonFormat({ keys: [] }, false);
  const metadata = JSON.parse('{"__proto__":"safe"}');
  const result = format.transform({ level: "info", message: "hello", metadata });
  expect(JSON.parse(result[Symbol.for("message")]).metadata.__proto__).toBe("safe");
});
