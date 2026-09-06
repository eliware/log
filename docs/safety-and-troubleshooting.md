# Safety and troubleshooting

Never log credentials, access tokens, private keys, or other sensitive values.
Configure `redactKeys` for known sensitive metadata and review custom
transports before enabling them. Redaction is delegated to
`@eliware/redact`, which also provides defensive serialization for errors,
BigInts, arrays, circular values, and hostile objects.

For validation, run:

```bash
npm test
npm run lint
npm run typecheck
npm audit --omit=dev --audit-level=moderate
npm run pack
```

If validation stops before tests, inspect the reported repository convention
requirements first. For custom output, use an injected Winston transport and
confirm that any metadata added after formatting is protected by that
transport.
