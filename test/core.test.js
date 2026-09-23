import test from 'node:test';
import assert from 'node:assert/strict';

import { parseTraceparent, tryParseTraceparent } from '../src/index.js';

const VALID_HEADER = '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01';

test('parses a valid traceparent header', () => {
  const result = parseTraceparent(VALID_HEADER);
  assert.deepEqual(result, {
    version: '00',
    traceId: '0af7651916cd43dd8448eb211c80319c',
    spanId: 'b7ad6b7169203331',
    flags: '01'
  });
});

test('rejects a non-string header', () => {
  assert.throws(() => parseTraceparent(123), /traceparent header must be a string/);
});

test('rejects a header with wrong number of parts', () => {
  assert.throws(() => parseTraceparent('00-abc'), /traceparent must have 4 parts/);
});

test('rejects an unsupported version', () => {
  assert.throws(() => parseTraceparent('01-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01'), /unsupported traceparent version/);
});

test('rejects an all-zero trace id', () => {
  assert.throws(() => parseTraceparent('00-00000000000000000000000000000000-b7ad6b7169203331-01'), /trace id must not be all zeros/);
});

test('rejects a trace id with invalid hex characters', () => {
  assert.throws(() => parseTraceparent('00-0af7651916cd43dd8448eb211c80319g-b7ad6b7169203331-01'), /invalid trace id/);
});

test('rejects a short trace id', () => {
  assert.throws(() => parseTraceparent('00-0af7651916cd43dd8448eb211c8031-b7ad6b7169203331-01'), /invalid trace id/);
});

test('rejects an all-zero span id', () => {
  assert.throws(() => parseTraceparent('00-0af7651916cd43dd8448eb211c80319c-0000000000000000-01'), /span id must not be all zeros/);
});

test('rejects a span id with invalid hex characters', () => {
  assert.throws(() => parseTraceparent('00-0af7651916cd43dd8448eb211c80319c-b7ad6b716920333x-01'), /invalid span id/);
});

test('rejects a short span id', () => {
  assert.throws(() => parseTraceparent('00-0af7651916cd43dd8448eb211c80319c-b7ad6b71692033-01'), /invalid span id/);
});

test('rejects flags that are not two hex digits', () => {
  assert.throws(() => parseTraceparent('00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-0'), /invalid trace flags/);
});

test('rejects flags with non-hex characters', () => {
  assert.throws(() => parseTraceparent('00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-0g'), /invalid trace flags/);
});

test('tryParseTraceparent returns null on invalid input', () => {
  assert.equal(tryParseTraceparent('not-a-valid-header'), null);
});

test('tryParseTraceparent returns object on valid input', () => {
  const result = tryParseTraceparent(VALID_HEADER);
  assert.deepEqual(result, {
    version: '00',
    traceId: '0af7651916cd43dd8448eb211c80319c',
    spanId: 'b7ad6b7169203331',
    flags: '01'
  });
});

test('parses a header with uppercase hex characters', () => {
  const result = parseTraceparent('00-0AF7651916CD43DD8448EB211C80319C-B7AD6B7169203331-01');
  assert.deepEqual(result, {
    version: '00',
    traceId: '0AF7651916CD43DD8448EB211C80319C',
    spanId: 'B7AD6B7169203331',
    flags: '01'
  });
});
