# Case Entity v0625 — Gap Analysis Summary

**Comparing:** JSON Schema v0625 (MSK-Nimble sample) vs Campaigns, Cases & Interactions Schema Group (PR #12)

**Date:** 2026-02-10

---

## Overview

The v0625 JSON represents a flattened, case-centric snapshot of an MSK/Nimble episode of care. The CCI schema group is a fully normalized, multi-party model with 11 entities and 206 fields. This summary captures the key alignments, gaps, and recommendations.

---

## Alignment Scorecard

| Area | Status | Key Insight |
|------|--------|-------------|
| Case ID & campaign link | ✅ Good | Both reference a campaign |
| Campaign/Perf Lever depth | 🔴 Gap | CCI has health plan scoping + performance levers; v0625 has only `campaign_id` |
| Case name, type, status | 🔴 Structural | CCI moves these to **CASE_PARTICIPANT** (per-party); v0625 puts them on the root case |
| Alternate IDs | ✅ Match | v0625's `alternate_case_identity[]` maps naturally to CASE_PARTICIPANT rows |
| Status history | 🟡 Different | v0625 uses an inline array; CCI splits into `status_state` + participant status + CASE_LOG |
| Organizations | ✅ Good | v0625's `organization_identity[]` maps to CASE_PARTICIPANT |
| Member reference | 🟡 Different | v0625 puts member on root; CCI uses CASE_ITEM linking table |
| Workflow steps | ✅ Structural match | Both model steps as arrays; field-level gaps exist |
| Per-step outcomes | 🔴 Gap | v0625 has per-step outcomes; CCI tracks at case level via OUTCOME entity |
| Supporting entities | 🔴 Gap | v0625 has no TASK, FLAG, GOAL, INTERACTION, OUTCOME, CASE_ITEM, CASE_LOG, DOCUMENT_REFERENCE |

---

## Key Structural Differences

### Case Descriptors Live on CASE_PARTICIPANT, Not CASE

The most significant design difference. In CCI, each participating organization (Wellnecity, employer, vendor, TPA) gets its own CASE_PARTICIPANT row with its own case ID, name, type, status, and owner. The v0625 JSON puts these on the root case object.

**v0625 pattern:**
- `case_name`, `case_description_short`, `vendor_case_type` → root-level fields

**CCI pattern:**
- `case_participant_case_name`, `case_participant_case_description`, `case_participant_case_type` → per-party rows

### Status is Separated Into Three Concerns

| Concern | v0625 | CCI |
|---------|-------|-----|
| Lifecycle state | Mixed into `case_status[]` array | `CASE.status_state` (active/resolved) |
| Per-party status | Mixed into `case_status[]` array | `CASE_PARTICIPANT.case_participant_case_status` |
| Status history | `case_status[].case_status_as_of` timestamps | `CASE_LOG` entity (append-only audit trail) |

### Members Linked via CASE_ITEM, Not Direct FK

CCI uses the CASE_ITEM linking table (`item_type = 'member'`) to associate members, MOIs, claims, prescriptions, and parent cases with a case. The v0625 JSON puts member directly on the root.

---

## Workflow Step Comparison

| v0625 Step Field | CCI CASE_WORKFLOW Field | Status |
|------------------|------------------------|--------|
| `step_n_owner` | `case_workflow_assigned_person_id` | 🟡 Name vs FK |
| `step_n_type` | `case_workflow_step_category` | ✅ Aligned |
| `step_n_value` | `case_workflow_step_name` | ✅ Aligned |
| `step_n_description` | `case_workflow_step_description` | ✅ Aligned |
| `step_n_begin_date` | — | 🔴 Missing in CCI |
| `step_n_end_date` | `case_workflow_completed_date` | ✅ Aligned |
| `step_n_as_of_date` | — | 🔴 Missing in CCI |
| `step_n_outcome_reason` | — | 🟡 Case-level in CCI |
| `step_n_outcome_savings` | — | 🟡 Case-level in CCI |
| — | `case_workflow_step_sequence` | 🔴 Missing in v0625 |
| — | `case_workflow_step_status` | 🔴 Missing in v0625 |
| — | `case_workflow_is_template` | 🔴 Missing in v0625 |

---

## Recommendations

### v0625 Fields That Could Enhance CCI

| v0625 Field | Proposed CCI Enhancement |
|-------------|--------------------------|
| `case_description_short` | Add short/long description split to CASE_PARTICIPANT |
| `step_n_begin_date` | Add `case_workflow_start_date` to CASE_WORKFLOW |
| `step_n_as_of_date` | Add snapshot/as-of date to CASE_WORKFLOW for reporting |
| `step_n_outcome_reason` / `step_n_outcome_savings` | Consider per-step outcome tracking on CASE_WORKFLOW |

### CCI Entities v0625 Should Adopt

The v0625 sample covers only the CASE entity. A complete implementation would also need:

- **CASE_PARTICIPANT** — multi-party case descriptors (natural fit for v0625's `alternate_case_identity` and `organization_identity`)
- **CASE_WORKFLOW** — normalized workflow steps with sequence, status, and template tracking
- **CASE_ITEM** — linking table for members, MOIs, claims, prescriptions
- **CASE_LOG** — audit trail for status changes
- **TASK / FLAG / GOAL** — work queue items within a case
- **INTERACTION** — contact events
- **OUTCOME / SAVINGS_EVENT** — results and financial tracking
- **DOCUMENT_REFERENCE** — attached documents

---

## Conclusion

The v0625 JSON and CCI schema are well-aligned at the conceptual level — both model campaigns, multi-party case identities, and workflow steps. The primary gaps are structural: CCI normalizes case descriptors onto CASE_PARTICIPANT, tracks status across three separate concerns, and links related data through dedicated entities (CASE_ITEM, CASE_LOG, TASK, etc.). The v0625 patterns for `alternate_case_identity` and `organization_identity` are a natural precursor to CASE_PARTICIPANT and can be adopted with minimal refactoring.

---

*Source: [Case Entity JSON Schema v0625](./case-entity-json-schema-v0625.md) vs [Campaigns, Cases & Interactions Schema Group](./work-flow-domain.md)*
*PR: [#12 — feat: add Campaigns, Cases & Interactions schema group](https://github.com/WNCgcp-org/wellnecity-edm/pull/12)*
