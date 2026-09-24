# Traceparent Header Parser

Parses a W3C traceparent header string into its version, trace id, span id, and flags fields with strict validation.

## Usage

```javascript
import { parseTraceparent } from 'traceparent-header-parser';

const header = '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01';
const parsed = parseTraceparent(header);
console.log(parsed);
// { version: '00', traceId: '0af7651916cd43dd8448eb211c80319c', spanId: 'b7ad6b7169203331', flags: '01' }
```

## Why this library exists

W3C trace context headers are widely used in distributed tracing, but the header format is easy to get subtly wrong. The traceparent header has a precise specification for each of its four components, including character sets, lengths, and special values. This library provides a small, dependency-free way to validate and extract those components without scattering ad-hoc regular expressions through application code.

The main trade-off is strictness. The parser rejects any header that does not conform exactly to the W3C traceparent specification, including all-zero trace and span IDs. This means some headers that might be accepted by lenient systems will throw an error here. If you need to handle invalid input without throwing, use the `tryParseTraceparent` function, which returns `null` instead.

## Edge cases

- All-zero trace IDs and span IDs are invalid according to the W3C specification and are rejected.
- The version field must be exactly `00`. Other versions are not supported.
- The flags field must be exactly two lowercase or uppercase hexadecimal digits.
- The parser accepts uppercase hex characters in trace IDs, span IDs, and flags, matching the specification.

## Exports

- `parseTraceparent(header: string): { version: string; traceId: string; spanId: string; flags: string }`
- `tryParseTraceparent(header: string): { version: string; traceId: string; spanId: string; flags: string } | null`
