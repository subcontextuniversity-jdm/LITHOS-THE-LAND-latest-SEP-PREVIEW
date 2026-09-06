# Receipt

Let `P` be a payload object.

```text
canonicalize(P)  = RFC 8785 JCS
receiptHash(P)   = SHA-256( canonicalize(P) )   // hex
```

Key order does not matter. Non-finite numbers are rejected.

This is an **integrity digest**. It is not a digital signature. Authorization remains **DEMO-ONLY**. Persistence remains **IN-MEMORY**.

A ledger that proves an event without becoming the entire application: the receipt is a value. The UI may show it. The UI is not it.
