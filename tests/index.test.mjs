import log, {
  createLogger,
  createPolicy,
  defaultPolicy,
  log as namedLog,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
  safeSerialize,
} from "@eliware/log";
import { expect, test } from "@jest/globals";

test("exposes the package and Redact APIs from its root", () => {
  expect(log).toBe(namedLog);
  expect(log.info).toEqual(expect.any(Function));
  expect(createLogger).toEqual(expect.any(Function));
  expect(createPolicy).toEqual(expect.any(Function));
  expect(defaultPolicy.keys.has("token")).toBe(true);
  expect(redactHeaders({ authorization: "secret" })).toEqual({ authorization: "[REDACTED]" });
  expect(redactText("token=example-token")).toBe("token=[REDACTED]");
  expect(redactValue({ token: "secret" })).toEqual({ token: "[REDACTED]" });
  expect(replaceLiteralSecret("value=secret", "secret")).toBe("value=[REDACTED]");
  expect(safeSerialize).toEqual(expect.any(Function));
  expect(safeSerialize({ count: 1n })).toEqual({ count: "1n" });
});
