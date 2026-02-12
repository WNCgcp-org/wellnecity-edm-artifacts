# Case Entity - JSON Schema v0625

```json
{
  "wncty_case_identity": {
    "wncty_case_id": "Wncty Case ID",
    "vendor_case_type": "MSK-Nimble",
    "case_name": "Wncty_case_98987798",
    "case_description_short": "Shoulder Pain",
    "case_description_long": "Member is experiencing pain in their right shoulder",
    "case_start_date": "2025-01-30T02:40:29Z",
    "case_end_date": "2025-05-30T04:30:25Z",
    "campaign_id": "Campaign_Care_mgmt_001"
  },
  "alternate_case_identity": [
    {
      "case_id": "Nimble_ID_001",
      "case_id_type": "Nimble_Case"
    },
    {
      "case_id": "Edison_ID_045",
      "case_id_type": "Edison_Case"
    }
  ],
  "case_status": [
    {
      "case_status": "Open",
      "case_status_type": "WnctyCaseStatus",
      "case_status_as_of": "2025-01-01T06:05:15Z"
    },
    {
      "case_status": "VSO Ordered",
      "case_status_type": "Nimble case status",
      "case_status_as_of": "2025-01-15T08:20:38Z"
    },
    {
      "case_status": "VPT Completed",
      "case_status_type": "Nimble case status",
      "case_status_as_of": "2025-01-20T10:25:58Z"
    },
    {
      "case_status": "Referred",
      "case_status_type": "Edison case status",
      "case_status_as_of": "2025-01-25T13:45:42Z"
    }
  ],
  "organization_identity": [
    {
      "org_ref_id": "Humana",
      "org_ref_type": "Employer",
      "org_name": "Humana",
      "org_role": "Health Plan Sponsor"
    },
    {
      "org_ref_id": "Edison",
      "org_ref_type": "Vendor",
      "org_name": "Edison",
      "org_role": "Vendor"
    }
  ],
  "member_id": {
    "member_ref_id": "anki98jiu90",
    "member_ref_id_type": "Health plan Member ID"
  },
  "workflow": {
    "workflow_id": "ANNN989",
    "workflow_name": "Nimble MSK Episode of Care",
    "steps": [
      {
        "step_n_owner": "Nimble",
        "step_n_type": "Care Journey Mgmt.",
        "step_n_value": "VSO",
        "step_n_description": "Virtual Second Opinion",
        "step_n_begin_date": "2025-01-15T13:45:42Z",
        "step_n_end_date": "2025-01-15T13:45:42Z",
        "step_n_as_of_date": "2025-06-28T13:45:42Z",
        "step_n_outcome_reason": "",
        "step_n_outcome_savings": null
      },
      {
        "step_n_owner": "Nimble",
        "step_n_type": "Care Journey Mgmt.",
        "step_n_value": "VPT",
        "step_n_description": "Virtual Physical Therapy",
        "step_n_begin_date": "2025-01-20T02:10:30Z",
        "step_n_end_date": "2025-01-20T03:10:30Z",
        "step_n_as_of_date": "2025-01-20T03:10:30Z",
        "step_n_outcome_reason": "",
        "step_n_outcome_savings": null
      },
      {
        "step_n_owner": "Nimble",
        "step_n_type": "Care Journey Mgmt.",
        "step_n_value": "referral",
        "step_n_description": "Refer to Edison",
        "step_n_begin_date": "2025-01-25T02:10:30Z",
        "step_n_end_date": "2025-01-25T03:10:30Z",
        "step_n_as_of_date": "2025-01-25T03:10:30Z",
        "step_n_outcome_reason": "",
        "step_n_outcome_savings": null
      }
    ]
  }
}
```

---

## Changelog — Fixes Applied

| # | Location | Original | Fixed | Notes |
|---|----------|----------|-------|-------|
| 1 | `wncty_case_identity.case_start_date` | `"2025-01-0130T02:40:29Z"` | `"2025-01-30T02:40:29Z"` | Removed extra `01` — invalid ISO 8601 date |
| 2 | Root key `"Member ID"` | `"Member ID"` | `"member_id"` | Normalized to snake_case for consistency with all other keys |
| 3 | Step 2 key `"step_owner"` | `"step_owner"` | `"step_n_owner"` | Normalized to match Step 1 naming convention |
| 4 | Step 2 key `"step_ndescription"` | `"step_ndescription"` | `"step_n_description"` | Missing underscore after `n` |
| 5 | Step 3 key `"step_owner"` | `"step_owner"` | `"step_n_owner"` | Normalized to match Step 1 naming convention |
| 6 | Step 3 key `"step_type"` | `"step_type"` | `"step_n_type"` | Normalized to match Step 1 naming convention |
| 7 | Step 3 key `"step_description"` | `"step_description"` | `"step_n_description"` | Normalized to match Step 1 naming convention |
| 8 | Step 2 `step_n_begin_date` | `"2025-01-20T2:10:30Z"` | `"2025-01-20T02:10:30Z"` | Zero-padded hour for ISO 8601 compliance |
| 9 | Step 2 `step_n_end_date` | `"2025-01-20T3:10:30Z"` | `"2025-01-20T03:10:30Z"` | Zero-padded hour for ISO 8601 compliance |
| 10 | Step 3 `step_n_begin_date` | `"2025-01-25T2:10:30Z"` | `"2025-01-25T02:10:30Z"` | Zero-padded hour for ISO 8601 compliance |
| 11 | Step 3 `step_n_as_of_date` | `"2025-01-2T03:10:30Z5"` | `"2025-01-25T03:10:30Z"` | Fixed malformed date — missing day digit and trailing `5` |

---

## Gap Analysis: v0625 JSON vs Campaigns, Cases & Interactions Schema Group

Comparison of this JSON sample against the **CASE** entity and supporting entities defined in the [Campaigns, Cases, and Interactions Schema Group](./work-flow-domain.md) (PR #12).

### 1. Case Identity & Origin

| v0625 JSON Field | CCI Schema Field | Match |
|------------------|------------------|-------|
| `wncty_case_id` | `case_id` (uuid PK) | ✅ Aligned |
| — | `case_origin` (json array of sources) | 🔴 **Missing in v0625** — CCI tracks origin as a JSON array (patient, moi, referral, analytics) |
| — | `case_subject_type` | 🔴 **Missing in v0625** |

### 2. Campaign & Performance Lever

| v0625 JSON Field | CCI Schema Field | Match |
|------------------|------------------|-------|
| `campaign_id` | `campaign_id` (uuid FK) | ✅ Aligned |
| — | `campaign_name` | 🟡 v0625 has no campaign name — CCI denormalizes it |
| — | `campaign_health_plan_id` / `campaign_health_plan_name` | 🔴 **Missing in v0625** — CCI ties campaigns to a health plan ORG |
| — | `program_key` | 🔴 **Missing in v0625** — CCI uses this for analytics program tracking |
| — | `performance_lever_id` / `performance_lever_name` | 🔴 **Missing in v0625** — CCI rolls cases up to a Performance Lever |

### 3. Case Name, Description, Type → CASE_PARTICIPANT

The biggest structural difference. In the CCI schema, fields like case name, description, type, and status **do not live on CASE** — they live on **CASE_PARTICIPANT** (one row per participating organization):

| v0625 JSON Field | CCI Schema Location | Match |
|------------------|---------------------|-------|
| `case_name` | `CASE_PARTICIPANT.case_participant_case_name` | 🔴 **Structural mismatch** — CCI puts case name on the participant, not the case |
| `case_description_short` | `CASE_PARTICIPANT.case_participant_case_description` | 🔴 Same — per-party description |
| `case_description_long` | `CASE_PARTICIPANT.case_participant_case_description` | 🔴 CCI has one description per participant, not short/long split |
| `vendor_case_type` ("MSK-Nimble") | `CASE_PARTICIPANT.case_participant_case_type` | 🔴 CCI puts type on participant rows, not CASE |

### 4. Alternate Case Identities → CASE_PARTICIPANT

| v0625 JSON Field | CCI Schema Location | Match |
|------------------|---------------------|-------|
| `alternate_case_identity[].case_id` | `CASE_PARTICIPANT.case_participant_case_id` | ✅ **Conceptually aligned** — each vendor's case ID is a CASE_PARTICIPANT row |
| `alternate_case_identity[].case_id_type` | `CASE_PARTICIPANT.case_participant_role` | ✅ The "type" maps to the participant's role (vendor, employer, etc.) |

The v0625 `alternate_case_identity` array is essentially a flat version of what CCI models as CASE_PARTICIPANT rows.

### 5. Case Status

| v0625 JSON Field | CCI Schema Field | Match |
|------------------|------------------|-------|
| `case_status[].case_status` (array) | `CASE.status_state` (single: active/resolved) | 🔴 **Major difference** — CCI puts only the lifecycle state on CASE |
| `case_status[].case_status_type` ("WnctyCaseStatus", "Nimble case status") | `CASE_PARTICIPANT.case_participant_case_status` | ✅ **Aligned conceptually** — vendor-specific statuses go on the participant row |
| `case_status[].case_status_as_of` (timestamps) | `CASE_LOG` entries | 🟡 CCI tracks status history via CASE_LOG, not as an inline status array |

The v0625 status array mixes the Wncty lifecycle status with vendor-specific statuses in a single array. In CCI, these are separated:
- **Lifecycle state** → `CASE.status_state`
- **Per-party status** → `CASE_PARTICIPANT.case_participant_case_status`
- **Status history** → `CASE_LOG`

### 6. Organizations → CASE_PARTICIPANT

| v0625 JSON Field | CCI Schema Location | Match |
|------------------|---------------------|-------|
| `organization_identity[].org_ref_id` | `CASE_PARTICIPANT.case_participant_org_id` (FK to ORG) | ✅ Aligned |
| `organization_identity[].org_ref_type` | `CASE_PARTICIPANT.case_participant_role` | ✅ Aligned |
| `organization_identity[].org_role` | `CASE_PARTICIPANT.case_participant_role` | ✅ Aligned |

Maps well. The v0625 `organization_identity` array is essentially a simplified CASE_PARTICIPANT.

### 7. Member Reference

| v0625 JSON Field | CCI Schema Location | Match |
|------------------|---------------------|-------|
| `member_id.member_ref_id` | `CASE_ITEM` with `item_type = 'member'` | 🟡 **Different pattern** — CCI links members via CASE_ITEM, not as a direct field on CASE |
| `member_id.member_ref_id_type` | — | 🟡 CCI doesn't qualify ID types; it uses a single member FK |

### 8. Workflow → CASE_WORKFLOW

| v0625 JSON Field | CCI Schema Location | Match |
|------------------|---------------------|-------|
| `workflow.workflow_id` | `CASE_WORKFLOW.case_workflow_template_id` | 🟡 Similar concept — CCI ties to Performance Lever Library templates |
| `workflow.workflow_name` | `CASE_WORKFLOW.case_workflow_template_name` | ✅ Aligned |
| `workflow.steps[]` | CASE_WORKFLOW rows (one per step) | ✅ Aligned — both model steps as an array/table |

#### Step-Level Field Mapping

| v0625 Step Field | CCI CASE_WORKFLOW Field | Match |
|------------------|------------------------|-------|
| `step_n_owner` | `case_workflow_assigned_person_id` (FK to PERSON) | 🟡 v0625 uses vendor name; CCI uses a PERSON FK |
| `step_n_type` | `case_workflow_step_category` | ✅ Aligned |
| `step_n_value` ("VSO", "VPT") | `case_workflow_step_name` | ✅ Aligned |
| `step_n_description` | `case_workflow_step_description` | ✅ Aligned |
| `step_n_begin_date` | — | 🔴 **Missing in CCI** — CCI has `due_date` and `completed_date` but no begin date |
| `step_n_end_date` | `case_workflow_completed_date` | ✅ Aligned |
| `step_n_as_of_date` | — | 🔴 **Missing in CCI** — no as-of/snapshot date |
| `step_n_outcome_reason` | — | 🟡 CCI tracks outcomes at case level (OUTCOME entity), not per-step |
| `step_n_outcome_savings` | — | 🟡 Same — savings tracked on OUTCOME/SAVINGS_EVENT, not per step |
| — | `case_workflow_step_sequence` | 🔴 **Missing in v0625** — CCI explicitly orders steps |
| — | `case_workflow_step_status` | 🔴 **Missing in v0625** — CCI tracks per-step status |
| — | `case_workflow_is_template` | 🔴 **Missing in v0625** — CCI distinguishes template vs. ad-hoc steps |

### 9. CCI Entities Not Represented in v0625

| CCI Entity / Field | Purpose |
|---------------------|---------|
| `CASE.case_origin` | JSON array of sources |
| `CASE.due_date` | Case due date |
| `CASE.last_activity_date` | Last activity timestamp |
| `CASE.is_deleted` / `is_archived` / `is_hidden` | Display/soft-delete flags |
| `CASE.identified_savings_total` / `realized_savings_total` | Financial summaries |
| `CASE.notes` / `extension` | Notes and FHIR extensions |
| `CASE.created_at` / `updated_at` / `created_by` / `updated_by` | Audit fields |
| **TASK** entity | Action items within a case |
| **FLAG** entity | Member alerts and markers |
| **GOAL** entity | Care management targets |
| **INTERACTION** entity | Contact events |
| **OUTCOME** entity | Case results and savings |
| **CASE_ITEM** entity | Robust linking table (MOI, claims, Rx, etc.) |
| **CASE_LOG** entity | Audit trail |
| **DOCUMENT_REFERENCE** entity | Attached documents |

### 10. v0625 Fields That Could Enhance CCI

| v0625 Field | Potential CCI Enhancement |
|-------------|---------------------------|
| `case_description_short` | Add short/long description split to CASE_PARTICIPANT |
| `step_n_begin_date` | Add `case_workflow_start_date` to CASE_WORKFLOW |
| `step_n_as_of_date` | Add snapshot/as-of date to CASE_WORKFLOW for reporting |
| `step_n_outcome_reason` / `step_n_outcome_savings` | Consider per-step outcome tracking on CASE_WORKFLOW |

### Summary

| Area | Alignment | Key Insight |
|------|-----------|-------------|
| Case ID & campaign link | ✅ Good | Both reference a campaign |
| Campaign/Perf Lever depth | 🔴 Gap | CCI has health plan scoping + performance levers; v0625 has only `campaign_id` |
| Case name, type, status | 🔴 Structural | CCI moves these to **CASE_PARTICIPANT** (per-party); v0625 puts them on the root case |
| Alternate IDs | ✅ Conceptual match | v0625's `alternate_case_identity[]` maps naturally to CASE_PARTICIPANT rows |
| Status history | 🟡 Different pattern | v0625 uses an inline array; CCI splits into `status_state` + participant status + CASE_LOG |
| Organizations | ✅ Good | v0625's `organization_identity[]` maps to CASE_PARTICIPANT |
| Member reference | 🟡 Different pattern | v0625 puts member on root; CCI uses CASE_ITEM |
| Workflow steps | ✅ Good structural match | Both model steps as arrays; field-level gaps exist (begin date, sequence, status) |
| Per-step outcomes/savings | 🔴 Gap | v0625 has per-step outcomes; CCI tracks at case level via OUTCOME entity |
| Supporting entities | 🔴 Gap | v0625 has no equivalent of TASK, FLAG, GOAL, INTERACTION, OUTCOME, CASE_ITEM, CASE_LOG, DOCUMENT_REFERENCE |

**Bottom line:** The v0625 JSON captures a solid MSK/Nimble use case but is a flattened, case-centric snapshot. The CCI schema is a fully normalized, multi-party model where case descriptors live on CASE_PARTICIPANT and related data is linked through dedicated entities. The v0625 patterns for `alternate_case_identity` and `organization_identity` map naturally to CASE_PARTICIPANT — they just need to adopt that structure formally.
