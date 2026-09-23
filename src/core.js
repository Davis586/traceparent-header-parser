const VERSION = 0x00;

const HEX_RE = /^[0-9a-f]{2}$/;

function validateVersion(version) {
  if (version !== '00') {
    throw new Error(`unsupported traceparent version: ${version}`);
  }
}

function validateTraceId(traceId) {
  if (traceId === '00000000000000000000000000000000') {
    throw new Error('trace id must not be all zeros');
  }
  if (!/^[0-9a-fA-F]{32}$/.test(traceId)) {
    throw new Error(`invalid trace id: ${traceId}`);
  }
}

function validateSpanId(spanId) {
  if (spanId === '0000000000000000') {
    throw new Error('span id must not be all zeros');
  }
  if (!/^[0-9a-fA-F]{16}$/.test(spanId)) {
    throw new Error(`invalid span id: ${spanId}`);
  }
}

function validateFlags(flags) {
  if (!/^[0-9a-fA-F]{2}$/.test(flags)) {
    throw new Error(`invalid trace flags: ${flags}`);
  }
}

/**
 * Parse a W3C traceparent header.
 *
 * @param {string} header - The traceparent header value.
 * @returns {{version: string, traceId: string, spanId: string, flags: string}}
 * @throws {Error} If the header is not a valid traceparent.
 */
export function parseTraceparent(header) {
  if (typeof header !== 'string') {
    throw new Error('traceparent header must be a string');
  }

  const parts = header.split('-');
  if (parts.length !== 4) {
    throw new Error(`traceparent must have 4 parts, got ${parts.length}`);
  }

  const [version, traceId, spanId, flags] = parts;

  validateVersion(version);
  validateTraceId(traceId);
  validateSpanId(spanId);
  validateFlags(flags);

  return { version, traceId, spanId, flags };
}

/**
 * Parse a traceparent header, returning null instead of throwing on invalid input.
 *
 * @param {string} header - The traceparent header value.
 * @returns {{version: string, traceId: string, spanId: string, flags: string} | null}
 */
export function tryParseTraceparent(header) {
  try {
    return parseTraceparent(header);
  } catch {
    return null;
  }
}
