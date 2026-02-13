# Medical Claim Crosswalk: Current BSD vs Proposed EDM

## Overview

This document provides a crosswalk comparison between the **Current** medical claims structure (Brighton BSD/FHIR staged fields) and the **Proposed** FHIR R5-compliant EDM MEDICAL_CLAIM entity.

**Created**: 2026-01-26
**Branch**: `feature/medical-claim-fhir-compliant`

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Attributes in Both** | 42 |
| **Attributes Only in Current** | 123 |
| **Attributes Only in Proposed** | 45 |
| **Total Current Attributes** | 165 |
| **Total Proposed Attributes** | 87 |

### Analysis Notes

- The **Current** structure is a denormalized "mega table" with embedded patient, subscriber, provider, and line-level data
- The **Proposed** structure normalizes data into separate entities (MEMBER, PROVIDER, CLAIM_LINE, CLAIM_DIAGNOSIS, etc.)
- Many "Current only" attributes move to related entities rather than being eliminated
- "Proposed only" attributes are primarily FHIR R5 enhancements and EDM-specific fields

---

## Attributes in Both (42)

These fields exist in both current and proposed structures with direct or semantic mapping:

| # | Current (BSD) | Proposed (EDM) | Notes |
|---|---------------|----------------|-------|
| 1 | `adjudication_status` | `claim_status` | Status mapping |
| 2 | `allowed_amount` | `allowed_amount` | Header level |
| 3 | `billed_amount_submitted` | `billed_amount` | Header level |
| 4 | `claim_admit_date` | `admission_date` | |
| 5 | `claim_date_of_service_end` | `service_date_to` | |
| 6 | `claim_date_of_service_start` | `service_date_from` | |
| 7 | `claim_diagnosis_drg_code` | `drg_code` | |
| 8 | `claim_diagnosis_primary_diagnosis_code` | `primary_diagnosis_code` | |
| 9 | `claim_discharge_date` | `discharge_date` | |
| 10 | `claim_id` | `claim_number` | Primary identifier |
| 11 | `claim_received_date` | `received_date` | |
| 12 | `claim_type` | `claim_type` | |
| 13 | `cob_savings` | `cob_amount` | Header level |
| 14 | `coinsurance` | `coinsurance_amount` | Header level |
| 15 | `copay` | `copay_amount` | Header level |
| 16 | `deductible` | `deductible_amount` | Header level |
| 17 | `ineligible` | `ineligible_amount` | |
| 18 | `original_claim_id` | `original_claim_id` | Adjustment reference |
| 19 | `paid_date` | `paid_date` | |
| 20 | `place_of_service_code` | `place_of_service` | |
| 21 | `total_paid` | `paid_amount` | Header level |
| 22 | `total_patient_paid` | `member_responsibility` | Semantic mapping |
| 23 | `total_payor_paid` | `payor_paid_amount` | |
| 24 | `client_id` | `employer_id` | FK reference |
| 25 | `patient_id` | `member_id` | FK reference |
| 26 | `billing_provider_npi` | `billing_provider_id` | FK to PROVIDER |
| 27 | `rendering_provider_npi` | `provider_id` | FK to PROVIDER |
| 28 | `billing_provider_network_indicator` | `network_status` | Semantic mapping |
| 29 | `claim_bundle_natural_key` | (via IDENTITY entity) | Normalized |
| 30 | `claim_procedure_code` | `principal_procedure_code` | Primary procedure |
| 31 | `claim_procedure_modifier_1` | (via CLAIM_LINE) | Normalized to line |
| 32 | `claim_procedure_modifier_2` | (via CLAIM_LINE) | Normalized to line |
| 33 | `claim_procedure_quantity` | (via CLAIM_LINE) | Normalized to line |
| 34 | `claim_procedure_revenue_code` | (via CLAIM_LINE) | Normalized to line |
| 35 | `claim_line_number` | (via CLAIM_LINE) | Normalized to line |
| 36 | `allowed_amount - line level` | (via CLAIM_LINE) | Normalized to line |
| 37 | `billed_amount_submitted_line level` | (via CLAIM_LINE) | Normalized to line |
| 38 | `total_paid - line level` | (via CLAIM_LINE) | Normalized to line |
| 39 | `coinsurance - line level` | (via CLAIM_LINE) | Normalized to line |
| 40 | `copay - line level` | (via CLAIM_LINE) | Normalized to line |
| 41 | `deductible - line level` | (via CLAIM_LINE) | Normalized to line |
| 42 | `cob_savings - line level` | (via CLAIM_LINE) | Normalized to line |

---

## Attributes Only in Current (123)

These fields exist in the current BSD structure but are **not directly in the proposed MEDICAL_CLAIM entity**. Most are normalized into related entities.

### Patient Demographics (24 fields) → Normalized to MEMBER entity

| # | Current Field | Disposition |
|---|---------------|-------------|
| 1 | `patient_address_1` | → MEMBER.address_line_1 |
| 2 | `patient_address_2` | → MEMBER.address_line_2 |
| 3 | `patient_city` | → MEMBER.city |
| 4 | `patient_dob` | → MEMBER.date_of_birth |
| 5 | `patient_email` | → MEMBER.email |
| 6 | `patient_first_name` | → MEMBER.first_name |
| 7 | `patient_gender` | → MEMBER.gender |
| 8 | `patient_home_email` | → MEMBER.email_home |
| 9 | `patient_home_phone` | → MEMBER.phone_home |
| 10 | `patient_id_internal` | → MEMBER.wellnecity_id |
| 11 | `patient_last_name` | → MEMBER.last_name |
| 12 | `patient_middle_name` | → MEMBER.middle_name |
| 13 | `patient_other_email` | → MEMBER.other_addresses (JSON) |
| 14 | `patient_other_phone` | → MEMBER.other_phones (JSON) |
| 15 | `patient_relationship` | → MEMBER.relationship_to_subscriber |
| 16 | `patient_sequence_number` | → MEMBER.member_sequence |
| 17 | `patient_ssn` | → MEMBER.ssn |
| 18 | `patient_state` | → MEMBER.state |
| 19 | `patient_suffix` | → MEMBER.suffix |
| 20 | `patient_work_email` | → MEMBER.email_work |
| 21 | `patient_work_phone` | → MEMBER.phone_work |
| 22 | `patient_zip` | → MEMBER.zip_code |

### Subscriber Demographics (20 fields) → Normalized to MEMBER entity

| # | Current Field | Disposition |
|---|---------------|-------------|
| 23 | `subscriber_address_1` | → MEMBER (subscriber record) |
| 24 | `subscriber_address_2` | → MEMBER (subscriber record) |
| 25 | `subscriber_city` | → MEMBER (subscriber record) |
| 26 | `subscriber_dob` | → MEMBER (subscriber record) |
| 27 | `subscriber_email` | → MEMBER (subscriber record) |
| 28 | `subscriber_first_name` | → MEMBER (subscriber record) |
| 29 | `subscriber_gender` | → MEMBER (subscriber record) |
| 30 | `subscriber_home_email` | → MEMBER (subscriber record) |
| 31 | `subscriber_home_phone` | → MEMBER (subscriber record) |
| 32 | `subscriber_id` | → MEMBER.subscriber_id |
| 33 | `subscriber_last_name` | → MEMBER (subscriber record) |
| 34 | `subscriber_middle_name` | → MEMBER (subscriber record) |
| 35 | `subscriber_other_email` | → MEMBER (subscriber record) |
| 36 | `subscriber_other_phone` | → MEMBER (subscriber record) |
| 37 | `subscriber_ssn` | → MEMBER (subscriber record) |
| 38 | `subscriber_state` | → MEMBER (subscriber record) |
| 39 | `subscriber_suffix` | → MEMBER (subscriber record) |
| 40 | `subscriber_work_email` | → MEMBER (subscriber record) |
| 41 | `subscriber_work_phone` | → MEMBER (subscriber record) |
| 42 | `subscriber_zip` | → MEMBER (subscriber record) |

### Billing Provider Details (16 fields) → Normalized to PROVIDER entity

| # | Current Field | Disposition |
|---|---------------|-------------|
| 43 | `billing_provider_addressline1` | → PROVIDER.address_line_1 |
| 44 | `billing_provider_addressline2` | → PROVIDER.address_line_2 |
| 45 | `billing_provider_city` | → PROVIDER.city |
| 46 | `billing_provider_first` | → PROVIDER.first_name |
| 47 | `billing_provider_last` | → PROVIDER.last_name |
| 48 | `billing_provider_name` | → PROVIDER.name |
| 49 | `billing_provider_postalcode` | → PROVIDER.zip_code |
| 50 | `billing_provider_secondary_tax_id` | → PROVIDER.tax_id |
| 51 | `billing_provider_specialty` | → PROVIDER.specialty |
| 52 | `billing_provider_specialty_description` | → PROVIDER (via TAXONOMY_CODE) |
| 53 | `billing_provider_state` | → PROVIDER.state |
| 54 | `billing_provider_tertiary_id` | → PROVIDER.other_ids (JSON) |
| 55 | `billing_provider_tertiary_id_system_type` | → PROVIDER.other_ids (JSON) |
| 56 | `billing_provider_type` | → PROVIDER.provider_type |

### Rendering Provider Details (14 fields) → Normalized to PROVIDER entity

| # | Current Field | Disposition |
|---|---------------|-------------|
| 57 | `rendering_provider_addressline1` | → PROVIDER.address_line_1 |
| 58 | `rendering_provider_addressline2` | → PROVIDER.address_line_2 |
| 59 | `rendering_provider_city` | → PROVIDER.city |
| 60 | `rendering_provider_name` | → PROVIDER.name |
| 61 | `rendering_provider_network_indicator` | → PROVIDER.network_indicator |
| 62 | `rendering_provider_postalcode` | → PROVIDER.zip_code |
| 63 | `rendering_provider_secondary_tax_id` | → PROVIDER.tax_id |
| 64 | `rendering_provider_specialty` | → PROVIDER.specialty |
| 65 | `rendering_provider_specialty_description` | → PROVIDER (via TAXONOMY_CODE) |
| 66 | `rendering_provider_state` | → PROVIDER.state |
| 67 | `rendering_provider_tertiary_id` | → PROVIDER.other_ids (JSON) |
| 68 | `rendering_provider_tertiary_id_system_type` | → PROVIDER.other_ids (JSON) |
| 69 | `rendering_provider_type` | → PROVIDER.provider_type |

### Diagnosis Codes (20 fields) → Normalized to CLAIM_DIAGNOSIS entity

| # | Current Field | Disposition |
|---|---------------|-------------|
| 70 | `claim_diagnosis_primary_diagnosis_code_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |
| 71 | `claim_diagnosis_secondary_diagnosis_code_1` | → CLAIM_DIAGNOSIS (sequence=2) |
| 72 | `claim_diagnosis_secondary_diagnosis_code_1_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |
| 73 | `claim_diagnosis_secondary_diagnosis_code_2` | → CLAIM_DIAGNOSIS (sequence=3) |
| 74 | `claim_diagnosis_secondary_diagnosis_code_2_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |
| 75 | `claim_diagnosis_secondary_diagnosis_code_3` | → CLAIM_DIAGNOSIS (sequence=4) |
| 76 | `claim_diagnosis_secondary_diagnosis_code_3_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |
| 77 | `claim_diagnosis_secondary_diagnosis_code_4` | → CLAIM_DIAGNOSIS (sequence=5) |
| 78 | `claim_diagnosis_secondary_diagnosis_code_4_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |
| 79 | `claim_diagnosis_secondary_diagnosis_code_5` | → CLAIM_DIAGNOSIS (sequence=6) |
| 80 | `claim_diagnosis_secondary_diagnosis_code_5_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |
| 81 | `claim_diagnosis_secondary_diagnosis_code_6` | → CLAIM_DIAGNOSIS (sequence=7) |
| 82 | `claim_diagnosis_secondary_diagnosis_code_6_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |
| 83 | `claim_diagnosis_secondary_diagnosis_code_7` | → CLAIM_DIAGNOSIS (sequence=8) |
| 84 | `claim_diagnosis_secondary_diagnosis_code_7_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |
| 85 | `claim_diagnosis_secondary_diagnosis_code_8` | → CLAIM_DIAGNOSIS (sequence=9) |
| 86 | `claim_diagnosis_secondary_diagnosis_code_8_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |
| 87 | `claim_diagnosis_secondary_diagnosis_code_9` | → CLAIM_DIAGNOSIS (sequence=10) |
| 88 | `claim_diagnosis_secondary_diagnosis_code_9_poa_indicator` | → CLAIM_DIAGNOSIS.poa_indicator |

### Procedure Codes (18 fields) → Normalized to CLAIM_LINE / CLAIM_PROCEDURE entities

| # | Current Field | Disposition |
|---|---------------|-------------|
| 89 | `claim_procedure_code_2` | → CLAIM_LINE.procedure_code |
| 90 | `claim_procedure_code_3` | → CLAIM_LINE.procedure_code |
| 91 | `claim_procedure_code_4` | → CLAIM_LINE.procedure_code |
| 92 | `claim_procedure_code_5` | → CLAIM_LINE.procedure_code |
| 93 | `claim_procedure_code_6` | → CLAIM_LINE.procedure_code |
| 94 | `claim_procedure_code_type` | → CLAIM_LINE.procedure_code_type |
| 95 | `claim_procedure_code_type_2` | → CLAIM_LINE.procedure_code_type |
| 96 | `claim_procedure_code_type_3` | → CLAIM_LINE.procedure_code_type |
| 97 | `claim_procedure_code_type_4` | → CLAIM_LINE.procedure_code_type |
| 98 | `claim_procedure_code_type_5` | → CLAIM_LINE.procedure_code_type |
| 99 | `claim_procedure_code_type_6` | → CLAIM_LINE.procedure_code_type |
| 100 | `claim_procedure_icd_code_1` | → CLAIM_PROCEDURE.procedure_code |
| 101 | `claim_procedure_icd_code_2` | → CLAIM_PROCEDURE.procedure_code |
| 102 | `claim_procedure_icd_code_3` | → CLAIM_PROCEDURE.procedure_code |
| 103 | `claim_procedure_icd_code_4` | → CLAIM_PROCEDURE.procedure_code |
| 104 | `claim_procedure_icd_code_5` | → CLAIM_PROCEDURE.procedure_code |
| 105 | `claim_procedure_icd_code_6` | → CLAIM_PROCEDURE.procedure_code |
| 106 | `claim_procedure_modifier_3` | → CLAIM_LINE.modifier_3 |
| 107 | `claim_procedure_modifier_4` | → CLAIM_LINE.modifier_4 |

### Revenue Codes (6 fields) → Normalized to CLAIM_LINE entity

| # | Current Field | Disposition |
|---|---------------|-------------|
| 108 | `claim_procedure_revenue_code` (staged 2-7) | → CLAIM_LINE.revenue_code |

### Line-Level Natural Key (1 field)

| # | Current Field | Disposition |
|---|---------------|-------------|
| 109 | `claim_line_natural_key` | → CLAIM_LINE.source_line_id |

### File/Client Metadata (12 fields) → Normalized to OPERATIONS TLD

| # | Current Field | Disposition |
|---|---------------|-------------|
| 110 | `client_name` | → EMPLOYER.name |
| 111 | `client_object_id` | → EMPLOYER.employer_id |
| 112 | `data_provider` | → DATA_FEED.vendor |
| 113 | `data_version` | → DATA_FEED.version |
| 114 | `file_effective_date` | → INTEGRATION_LOG.effective_date |
| 115 | `file_load_date` | → INTEGRATION_LOG.received_at |
| 116 | `file_name` | → INTEGRATION_LOG.file_name |
| 117 | `file_received_date` | → INTEGRATION_LOG.received_at |
| 118 | `file_updated_date` | → INTEGRATION_LOG.updated_at |

---

## Attributes Only in Proposed (45)

These fields are **new in the proposed EDM MEDICAL_CLAIM entity**, not present in the current BSD structure:

### FHIR R5 Specific Fields (12 fields)

| # | Proposed Field | Type | Description |
|---|----------------|------|-------------|
| 1 | `claim_use` | string(30) | FHIR R5 required: claim, preauthorization, predetermination |
| 2 | `claim_outcome` | string(30) | FHIR R5 required: queued, complete, error, partial |
| 3 | `trace_number` | string(100) | FHIR R5: Tracking identifier |
| 4 | `claim_precedence` | integer | FHIR R5: Order for multiple EOBs |
| 5 | `insurer_id` | uuid | FHIR R5: FK to insurer organization |
| 6 | `patient_paid_total` | decimal(12,2) | FHIR R5: Total patient paid |
| 7 | `payment_type` | string(30) | FHIR R5: complete, partial |
| 8 | `payment_amount` | decimal(12,2) | FHIR R5: Actual payment amount |
| 9 | `decision` | string(30) | FHIR R5: denied, partial, approved |
| 10 | `disposition` | string(255) | FHIR R5: Human-readable status |
| 11 | `pre_auth_ref` | json | FHIR R5: Authorization references |
| 12 | `funds_reserve` | string(30) | FHIR R5: Funds reservation code |

### EDM Internal/System Fields (10 fields)

| # | Proposed Field | Type | Description |
|---|----------------|------|-------------|
| 13 | `claim_id` | uuid | Internal UUID (vs external claim_number) |
| 14 | `source_claim_id` | string(100) | Original TPA claim ID |
| 15 | `source` | string(50) | Source system identifier |
| 16 | `source_claim_status` | string(30) | Original TPA status |
| 17 | `created_at` | datetime | Record creation timestamp |
| 18 | `updated_at` | datetime | Last update timestamp |

### Claim Processing Fields (10 fields)

| # | Proposed Field | Type | Description |
|---|----------------|------|-------------|
| 19 | `claim_form_type` | string(20) | CMS1500, UB04 |
| 20 | `adjustment_type` | string(20) | ORIGINAL, REPLACEMENT, VOID, REVERSAL |
| 21 | `adjustment_reason` | string(100) | Adjustment reason |
| 22 | `effective_date` | date | Adjudication effective date |
| 23 | `effective_timestamp` | datetime | Adjudication effective timestamp |
| 24 | `processed_date` | date | Date claim processed |
| 25 | `check_number` | string(50) | Payment check/EFT number |

### Provider Reference Fields (5 fields)

| # | Proposed Field | Type | Description |
|---|----------------|------|-------------|
| 26 | `referring_provider_id` | uuid | FK to PROVIDER (referring) |
| 27 | `attending_provider_id` | uuid | FK to PROVIDER (attending) |
| 28 | `supervising_provider_id` | uuid | FK to PROVIDER (supervising) |
| 29 | `operating_provider_id` | uuid | FK to PROVIDER (operating) |
| 30 | `ordering_provider_id` | uuid | FK to PROVIDER (ordering) |

### Clinical/Admission Fields (6 fields)

| # | Proposed Field | Type | Description |
|---|----------------|------|-------------|
| 31 | `admission_type` | string(20) | Admission type code |
| 32 | `admission_source` | string(20) | Admission source code |
| 33 | `discharge_status` | string(20) | Discharge status code |
| 34 | `drg_type` | string(20) | MS-DRG, APR-DRG |
| 35 | `admitting_diagnosis_code` | string(10) | Admitting diagnosis |
| 36 | `admitting_diagnosis_type` | string(20) | Admitting diagnosis type |
| 37 | `admitting_poa_indicator` | string(5) | Admitting POA indicator |
| 38 | `patient_reason_diagnosis` | json | Patient reason diagnoses |
| 39 | `diagnosis_codes` | json | All diagnosis codes array |
| 40 | `procedure_codes` | json | All procedure codes array |

### Financial/Coverage Fields (7 fields)

| # | Proposed Field | Type | Description |
|---|----------------|------|-------------|
| 41 | `is_capitated` | boolean | Capitated claim flag |
| 42 | `is_cob` | boolean | COB flag |
| 43 | `cob_payer_order` | integer | COB payer order |
| 44 | `currency_code` | string(3) | Currency code |
| 45 | `authorization_number` | string(50) | Prior auth number |
| 46 | `billed_processing_type` | string(20) | Billed processing type |
| 47 | `allowed_processing_type` | string(20) | Allowed processing type |
| 48 | `paid_processing_type` | string(20) | Paid processing type |
| 49 | `discount_amount` | decimal(12,2) | Discount amount |
| 50 | `out_of_pocket_amount` | decimal(12,2) | OOP amount |
| 51 | `other_paid_amount` | decimal(12,2) | Other paid |
| 52 | `other_patient_paid` | decimal(12,2) | Other patient paid |
| 53 | `other_payor_paid` | decimal(12,2) | Other payor paid |
| 54 | `withhold_amount` | decimal(12,2) | Withhold amount |
| 55 | `interest_amount` | decimal(12,2) | Interest paid |
| 56 | `penalty_amount` | decimal(12,2) | Penalty amount |

---

## Normalization Summary

The proposed EDM normalizes the current 165-field denormalized structure into multiple related entities:

| Entity | Fields Absorbed | Purpose |
|--------|-----------------|---------|
| **MEMBER** | 44 | Patient + Subscriber demographics |
| **PROVIDER** | 30 | Billing + Rendering provider details |
| **CLAIM_LINE** | 40+ | Line-level procedures, amounts, modifiers |
| **CLAIM_DIAGNOSIS** | 20 | Normalized diagnosis codes with sequence |
| **CLAIM_PROCEDURE** | 12 | Normalized ICD procedure codes |
| **EMPLOYER** | 3 | Client/employer reference |
| **OPERATIONS TLD** | 6 | File/feed metadata |

---

## Migration Considerations

1. **Patient/Subscriber Data**: Extract to MEMBER entity using subscriber_id as linking key
2. **Provider Data**: Extract to PROVIDER entity using NPI as natural key
3. **Line-Level Data**: Transform embedded arrays to CLAIM_LINE rows
4. **Diagnosis Codes**: Transform numbered fields to CLAIM_DIAGNOSIS rows with sequence
5. **Procedure Codes**: Transform numbered fields to CLAIM_PROCEDURE rows with sequence
6. **FHIR R5 Fields**: Derive or default new required fields (`claim_use`, `claim_outcome`)
