# FHIR R5 Compliance Specification

## Decision Summary

**Target FHIR Version**: R5 (v5.0.0)
**Decision Date**: 2026-01-26
**Primary Resource**: ExplanationOfBenefit (EOB)

### Rationale for FHIR R5

While FHIR R4 remains the most widely adopted version in industry, Wellnecity is targeting **FHIR R5** for the following reasons:

1. **Forward-looking compliance** - R5 will become the standard as R6 approaches normative status (expected late 2026)
2. **Enhanced features** - R5 includes improvements for claims processing:
   - `diagnosisRelatedGroup` as first-class element
   - `traceNumber` for enhanced claim tracking
   - `event` array for claim lifecycle tracking
   - `reviewOutcome` with structured decision codes
   - `patientPaid` at multiple hierarchy levels
3. **Better alignment** - R5's three-tier item hierarchy (item → detail → subDetail) aligns with EDM's CLAIM_LINE normalization
4. **Reduced future migration** - Building to R5 now avoids R4→R5 migration later

### Sources

- [The State of FHIR in 2025 - Fire.ly](https://fire.ly/blog/the-state-of-fhir-in-2025/)
- [FHIR Versioning Guide - 1upHealth](https://1up.health/blog/fhir-versioning-and-how-to-still-stay-up-to-date/)
- [HL7 FHIR R5 ExplanationOfBenefit](https://hl7.org/fhir/R5/explanationofbenefit.html)
- [HealthIT.gov FHIR Standards](https://www.healthit.gov/topic/standards-technology/standards/fhir)

---

## FHIR R5 ExplanationOfBenefit Resource Mapping

### Required Fields (Cardinality 1..1)

| FHIR R5 Element | EDM Field | EDM Entity | Notes |
|-----------------|-----------|------------|-------|
| `status` | `claim_status` | MEDICAL_CLAIM | Map to: active, cancelled, draft, entered-in-error |
| `type` | `claim_type` | MEDICAL_CLAIM | oral, pharmacy, vision, institutional, professional |
| `use` | `claim_use` | MEDICAL_CLAIM | **NEW** - claim, preauthorization, predetermination |
| `patient` | `member_id` | MEDICAL_CLAIM | FK to MEMBER |
| `created` | `created_at` | MEDICAL_CLAIM | Resource creation timestamp |
| `outcome` | `claim_outcome` | MEDICAL_CLAIM | **NEW** - queued, complete, error, partial |

### Identifier & Reference Fields

| FHIR R5 Element | EDM Field | EDM Entity | Notes |
|-----------------|-----------|------------|-------|
| `identifier` | `claim_number` | MEDICAL_CLAIM | Primary business identifier |
| `traceNumber` | `trace_number` | MEDICAL_CLAIM | **NEW R5** - Tracking identifier |
| `insurer` | `insurer_id` | MEDICAL_CLAIM | **NEW** - FK to ORGANIZATION |
| `provider` | `provider_id` | MEDICAL_CLAIM | Rendering provider |
| `claim` | `source_claim_id` | MEDICAL_CLAIM | Reference to original claim |
| `claimResponse` | `adjudication_id` | MEDICAL_CLAIM | FK to ADJUDICATION |

### Clinical & Administrative Details

| FHIR R5 Element | EDM Field | EDM Entity | Notes |
|-----------------|-----------|------------|-------|
| `billablePeriod.start` | `service_date_from` | MEDICAL_CLAIM | |
| `billablePeriod.end` | `service_date_to` | MEDICAL_CLAIM | |
| `diagnosis[].sequence` | `diagnosis_sequence` | CLAIM_DIAGNOSIS | **NEW entity needed** |
| `diagnosis[].diagnosisCodeableConcept` | `diagnosis_code` | CLAIM_DIAGNOSIS | ICD-10 code |
| `diagnosis[].type` | `diagnosis_type` | CLAIM_DIAGNOSIS | admitting, principal, secondary |
| `diagnosis[].onAdmission` | `poa_indicator` | CLAIM_DIAGNOSIS | Present on admission |
| `procedure[].sequence` | `procedure_sequence` | CLAIM_PROCEDURE | **NEW entity needed** |
| `procedure[].procedureCodeableConcept` | `procedure_code` | CLAIM_PROCEDURE | ICD-10-PCS |
| `procedure[].date` | `procedure_date` | CLAIM_PROCEDURE | |
| `careTeam[].provider` | Various `*_provider_id` | MEDICAL_CLAIM | Multiple provider roles |
| `careTeam[].role` | Provider role enum | MEDICAL_CLAIM | rendering, billing, referring, etc. |
| `diagnosisRelatedGroup` | `drg_code` | MEDICAL_CLAIM | **R5 first-class element** |
| `precedence` | `claim_precedence` | MEDICAL_CLAIM | **NEW R5** - Order for multiple EOBs |

### Item (Line-Level) Structure

| FHIR R5 Element | EDM Field | EDM Entity | Notes |
|-----------------|-----------|------------|-------|
| `item[].sequence` | `line_number` | CLAIM_LINE | |
| `item[].traceNumber` | `line_trace_number` | CLAIM_LINE | **NEW R5** |
| `item[].revenue` | `revenue_code` | CLAIM_LINE | |
| `item[].productOrService` | `cpt_code` | CLAIM_LINE | CPT/HCPCS |
| `item[].productOrServiceEnd` | `procedure_code_end` | CLAIM_LINE | **NEW R5** - Range endpoint |
| `item[].modifier[]` | `cpt_modifier_1-4` | CLAIM_LINE | |
| `item[].servicedDate` | `service_date` | CLAIM_LINE | |
| `item[].servicedPeriod` | `service_date_from/to` | CLAIM_LINE | |
| `item[].locationCodeableConcept` | `place_of_service` | CLAIM_LINE | |
| `item[].quantity` | `units` | CLAIM_LINE | |
| `item[].unitPrice` | `unit_price` | CLAIM_LINE | **NEW** |
| `item[].factor` | `factor` | CLAIM_LINE | **NEW** - Multiplier |
| `item[].tax` | `tax_amount` | CLAIM_LINE | **NEW R5** |
| `item[].net` | `billed_amount` | CLAIM_LINE | |
| `item[].patientPaid` | `patient_paid_amount` | CLAIM_LINE | **NEW R5** |

### Item Adjudication Structure

| FHIR R5 Element | EDM Field | EDM Entity | Notes |
|-----------------|-----------|------------|-------|
| `item[].adjudication[].category` | `adjudication_category` | CLAIM_LINE | submitted, eligible, benefit, etc. |
| `item[].adjudication[].reason` | `adjudication_reason_code` | CLAIM_LINE | Denial/adjustment reason |
| `item[].adjudication[].amount` | Various amount fields | CLAIM_LINE | |
| `item[].reviewOutcome.decision` | `line_decision` | CLAIM_LINE | **NEW R5** |
| `item[].reviewOutcome.reason` | `line_decision_reason` | CLAIM_LINE | **NEW R5** |

### Financial Totals

| FHIR R5 Element | EDM Field | EDM Entity | Notes |
|-----------------|-----------|------------|-------|
| `total[].category=submitted` | `billed_amount` | MEDICAL_CLAIM | |
| `total[].category=eligible` | `allowed_amount` | MEDICAL_CLAIM | |
| `total[].category=benefit` | `paid_amount` | MEDICAL_CLAIM | |
| `total[].category=deductible` | `deductible_amount` | MEDICAL_CLAIM | |
| `total[].category=copay` | `copay_amount` | MEDICAL_CLAIM | |
| `total[].category=coinsurance` | `coinsurance_amount` | MEDICAL_CLAIM | |
| `patientPaid` | `patient_paid_total` | MEDICAL_CLAIM | **NEW R5** |
| `payment.type` | `payment_type` | MEDICAL_CLAIM | **NEW** |
| `payment.date` | `paid_date` | MEDICAL_CLAIM | |
| `payment.amount` | `payment_amount` | MEDICAL_CLAIM | |
| `payment.identifier` | `check_number` | MEDICAL_CLAIM | |

### Event Tracking (NEW R5)

| FHIR R5 Element | EDM Field | EDM Entity | Notes |
|-----------------|-----------|------------|-------|
| `event[].type` | `event_type` | CLAIM_EVENT | **NEW entity needed** |
| `event[].when[x]` | `event_datetime` | CLAIM_EVENT | |

---

## New EDM Entities Required for FHIR R5

### 1. CLAIM_DIAGNOSIS

Normalized diagnosis codes from claims (FHIR R5 `diagnosis[]` array).

```
CLAIMS.CLAIM_DIAGNOSIS
├── diagnosis_id (PK)
├── claim_id (FK → MEDICAL_CLAIM)
├── sequence (1-based)
├── diagnosis_code (FK → ICD10_CODE)
├── diagnosis_type (admitting, principal, clinical, secondary, etc.)
├── poa_indicator (Y, N, U, W, 1, etc.)
├── package_code (for grouper use)
├── created_at
└── updated_at
```

### 2. CLAIM_PROCEDURE

Normalized procedure codes from claims (FHIR R5 `procedure[]` array).

```
CLAIMS.CLAIM_PROCEDURE
├── procedure_id (PK)
├── claim_id (FK → MEDICAL_CLAIM)
├── sequence (1-based)
├── procedure_code (ICD-10-PCS)
├── procedure_code_type (ICD10PCS, CPT, HCPCS)
├── procedure_date
├── udi_reference (device identifier)
├── created_at
└── updated_at
```

### 3. CLAIM_EVENT (NEW R5)

Claim lifecycle events (FHIR R5 `event[]` array).

```
CLAIMS.CLAIM_EVENT
├── event_id (PK)
├── claim_id (FK → MEDICAL_CLAIM)
├── event_type (received, accepted, rejected, complete, etc.)
├── event_datetime
├── event_period_start
├── event_period_end
├── created_at
└── updated_at
```

---

## EDM Field Additions for FHIR R5

### MEDICAL_CLAIM Entity - New Fields

| Field | Type | FHIR R5 Source | Description |
|-------|------|----------------|-------------|
| `claim_use` | string(30) | `use` | claim, preauthorization, predetermination |
| `claim_outcome` | string(30) | `outcome` | queued, complete, error, partial |
| `trace_number` | string(100) | `traceNumber` | R5 tracking identifier |
| `claim_precedence` | integer | `precedence` | Order for multiple EOBs |
| `insurer_id` | uuid | `insurer` | FK to ORGANIZATION |
| `patient_paid_total` | decimal(12,2) | `patientPaid` | Total patient paid |
| `payment_type` | string(30) | `payment.type` | complete, partial |
| `payment_amount` | decimal(12,2) | `payment.amount` | Actual payment amount |
| `decision` | string(30) | `decision` | denied, partial, approved |
| `disposition` | string(255) | `disposition` | Human-readable status |
| `pre_auth_ref` | json | `preAuthRef[]` | Authorization references |
| `funds_reserve` | string(30) | `fundsReserve` | Funds reservation code |

### CLAIM_LINE Entity - New Fields

| Field | Type | FHIR R5 Source | Description |
|-------|------|----------------|-------------|
| `line_trace_number` | string(100) | `item[].traceNumber` | R5 line tracking |
| `procedure_code_end` | string(10) | `item[].productOrServiceEnd` | R5 range endpoint |
| `unit_price` | decimal(12,4) | `item[].unitPrice` | Price per unit |
| `factor` | decimal(8,4) | `item[].factor` | Multiplier/discount |
| `tax_amount` | decimal(12,2) | `item[].tax` | R5 tax amount |
| `patient_paid_amount` | decimal(12,2) | `item[].patientPaid` | R5 patient paid |
| `line_decision` | string(30) | `item[].reviewOutcome.decision` | R5 decision |
| `line_decision_reason` | string(100) | `item[].reviewOutcome.reason` | R5 reason |
| `copay_amount` | decimal(12,2) | adjudication[copay] | |
| `coinsurance_amount` | decimal(12,2) | adjudication[coinsurance] | |
| `deductible_amount` | decimal(12,2) | adjudication[deductible] | |
| `non_covered_amount` | decimal(12,2) | adjudication[noncovered] | |
| `cob_amount` | decimal(12,2) | adjudication[priorpayerpaid] | |

---

## Implementation Phases

### Phase 1: Core R5 Fields (Sprint 1-2)
- Add required R5 fields to MEDICAL_CLAIM
- Add R5 fields to CLAIM_LINE
- Update BSD mappings

### Phase 2: Normalized Entities (Sprint 3-4)
- Create CLAIM_DIAGNOSIS entity
- Create CLAIM_PROCEDURE entity
- Migrate embedded arrays to normalized tables

### Phase 3: Event Tracking (Sprint 5-6)
- Create CLAIM_EVENT entity
- Implement event lifecycle tracking
- Add traceNumber support

---

## Backward Compatibility

While targeting R5, the EDM maintains compatibility with R4 consumers:

1. **R4 required fields** - All R4 required fields remain present
2. **R4 codes** - Value sets remain compatible
3. **R4 structure** - Item hierarchy unchanged (item → detail → subDetail)
4. **Export options** - ETL can produce R4 or R5 formatted output

---

## Validation Rules

### R5 Required Field Validation
- `claim_status` must be: active | cancelled | draft | entered-in-error
- `claim_type` must be: oral | pharmacy | vision | institutional | professional
- `claim_use` must be: claim | preauthorization | predetermination
- `claim_outcome` must be: queued | complete | error | partial
- `member_id` must reference valid MEMBER
- `created_at` must be populated

### Business Rules
- `claim_outcome` = 'complete' requires `paid_date` populated
- `claim_outcome` = 'error' requires at least one denial reason
- `claim_precedence` must be unique per member + date range
- `trace_number` should be unique per source system
