import winston from "winston";
import { safeSerialize } from "@eliware/redact";

const messageSymbol = Symbol.for("message");
const sanitizedSymbol = Symbol("sanitized");

export const jsonFormat = (redact, timestamp) => {
  // Sanitize eagerly so every emitted record has deterministic, transport-independent metadata.
  const sanitize = winston.format((info) => {
    const { level, message } = info;
    const splatMetadata = (info[Symbol.for("splat")] ?? []).flatMap((entry) =>
      entry && typeof entry === "object" ? Object.entries(entry) : [],
    );
    const infoMetadata = Object.entries(info).filter(
      ([key]) => key !== "level" && key !== "message",
    );
    const metadata = Object.fromEntries([...splatMetadata, ...infoMetadata]);
    const safeMessage = typeof message === "string" ? message : safeSerialize(message, redact);
    const safeMetadata = safeSerialize(metadata, redact);
    const hasReservedField =
      Object.hasOwn(safeMetadata, "level") || Object.hasOwn(safeMetadata, "message");
    const sanitized = hasReservedField
      ? { level, message: safeMessage, metadata: safeMetadata }
      : { level, message: safeMessage, ...safeMetadata };
    info[sanitizedSymbol] = sanitized;
    return info;
  });
  const output = winston.format((info) => {
    try {
      const record = info[sanitizedSymbol];
      info[messageSymbol] = JSON.stringify(record);
    } catch {
      const fallback = {
        level: info.level ?? "[Unserializable]",
        message: safeSerialize(info.message, redact),
      };
      try {
        info[messageSymbol] = JSON.stringify(fallback);
      } catch {
        info[messageSymbol] = '{"level":"[Unserializable]","message":"[Unserializable]"}';
      }
    }
    return info;
  });
  return winston.format.combine(
    ...(timestamp ? [winston.format.timestamp()] : []),
    sanitize(),
    output(),
  );
};
