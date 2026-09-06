import { redactValue, safeSerialize } from '@eliware/redact';

export const textFormat = (redact) => ({ level, message, ...meta }) => {
  let messageText;
  try { messageText = typeof message === 'string' ? message : JSON.stringify(safeSerialize(redactValue(message, redact), redact)); } catch { messageText = '[Unserializable]'; }
  let output = `[${typeof level === 'string' ? level.toUpperCase() : 'INFO'}] ${messageText}`;
  const safeMeta = redactValue(meta, redact);
  const keys = Object.keys(safeMeta);
  if (keys.length > 0) {
    try { output += ' ' + JSON.stringify(safeSerialize(safeMeta, redact)); } catch { output += ' [Unserializable]'; }
  }
  return output;
};
