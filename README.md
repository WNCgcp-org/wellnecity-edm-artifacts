# Wellnecity EDM Artifacts

Design artifacts, visualizations, and documentation tools for the Wellnecity Enterprise Data Model (EDM).

This repository stores artifacts that support the EDM but are not part of the core three-layer model (Conceptual, Logical, Physical). Per the EDM [CLAUDE.md guidelines](https://github.com/WNCgcp-org/wellnecity-edm), the EDM repo contains only model definitions — all supplementary artifacts live here.

---

## Structure

```
wellnecity-edm-artifacts/
├── README.md
└── campaigns-cases-interactions/     # PR #12 artifacts
    ├── work-flow-domain.md           # Full CCI schema group definition (11 entities, 206 fields)
    ├── case-interaction-schema.html  # HTML ERD visualization
    ├── case-entity-json-schema-v0625.md        # JSON sample + fixes + gap analysis
    ├── case-entity-v0625-gap-analysis-summary.md  # Gap analysis summary (MD)
    └── case-entity-v0625-gap-analysis-summary.pdf # Gap analysis summary (PDF)
```

---

## Related

- [wellnecity-edm](https://github.com/WNCgcp-org/wellnecity-edm) — Enterprise Data Model (source of truth)
- [EDM PR #12](https://github.com/WNCgcp-org/wellnecity-edm/pull/12) — Campaigns, Cases & Interactions schema group
