# EDM Crosswalk: Gap Analysis

## Overview

This document identifies **gaps** between the proposed EDM and the existing BigQuery schema. These represent areas requiring new development, data acquisition, or architectural changes.

**Last Updated**: 2026-01-26
**Status**: Updated to reflect Layer 2/Layer 3 model completion

---

## Gap Severity Legend

| Severity | Description | Action Required |
|----------|-------------|-----------------|
| **CRITICAL** | Core EDM functionality missing | Must build before go-live |
| **HIGH** | Important analytics capability missing | Build in Phase 1-2 |
| **MEDIUM** | Nice-to-have functionality | Build in Phase 2-3 |
| **LOW** | Enhancement opportunity | Future roadmap |
| **RESOLVED** | Gap has been addressed in EDM model | Implementation ready |

---

## RESOLVED GAPS (Previously Critical)

### 1. ACCUMULATOR Entity - ✅ RESOLVED

**EDM Entity**: `CLAIMS.ACCUMULATOR`
**Status**: ✅ Fully defined in Layer 2 (Logical) and Layer 3 (Physical)
**Fields**: 22 (including standard columns)

**Resolution**:
- Complete entity definition in `models/logical/layer-2-logical-model.md`
- BigQuery DDL ready in `models/physical/layer-3-physical-model.md`
- Table path: `wncty-ptfm-data-prd-db78.edm_claims.accumulator`
- Clustering: `member_id`, `accumulator_type`

**Implemented Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `accumulator_id` | STRING | Primary key (UUID) |
| `member_id` | STRING | FK to member |
| `employer_id` | STRING | FK to employer |
| `accumulator_type` | STRING | DEDUCTIBLE, OOP_MAX, COPAY_MAX |
| `coverage_type` | STRING | MEDICAL, PHARMACY, DENTAL |
| `network_tier` | STRING | IN_NETWORK, OUT_OF_NETWORK, COMBINED |
| `coverage_level` | STRING | INDIVIDUAL, FAMILY |
| `benefit_period_start` | DATE | Period start date |
| `benefit_period_end` | DATE | Period end date |
| `limit_amount` | NUMERIC | Maximum/limit amount |
| `accumulated_amount` | NUMERIC | Current accumulated |
| `remaining_amount` | NUMERIC | Remaining balance |
| `is_met` | BOOL | Limit reached flag |
| `met_date` | DATE | Date limit reached |
| `last_update_date` | DATE | Last accumulation date |

**Next Steps**: ETL pipeline implementation to populate from claims data

---

### 2. ACCUMULATOR_UPDATE Entity - ✅ RESOLVED

**EDM Entity**: `CLAIMS.ACCUMULATOR_UPDATE`
**Status**: ✅ Fully defined in Layer 2 (Logical) and Layer 3 (Physical)
**Fields**: 18 (including standard columns)

**Resolution**:
- Complete entity definition in `models/logical/layer-2-logical-model.md`
- BigQuery DDL ready in `models/physical/layer-3-physical-model.md`
- Table path: `wncty-ptfm-data-prd-db78.edm_claims.accumulator_update`
- Partitioning: `update_date` (DAY)
- Clustering: `accumulator_id`, `update_type`

**Implemented Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `update_id` | STRING | Primary key (UUID) |
| `accumulator_id` | STRING | FK to accumulator |
| `claim_id` | STRING | FK to medical_claim |
| `rx_claim_id` | STRING | FK to rx_claim |
| `update_date` | DATE | Date of update |
| `update_type` | STRING | CLAIM, ADJUSTMENT, MANUAL, RESET |
| `amount` | NUMERIC | Amount applied |
| `previous_accumulated` | NUMERIC | Before update |
| `new_accumulated` | NUMERIC | After update |
| `previous_remaining` | NUMERIC | Remaining before |
| `new_remaining` | NUMERIC | Remaining after |
| `triggered_met` | BOOL | Did this trigger met |
| `notes` | STRING | Update notes |
| `created_by` | STRING | User/system that created |

**Next Steps**: Implement as append-only transaction log in ETL pipeline

---

### 3. CLAIM_LINE Normalization - ✅ RESOLVED

**EDM Entity**: `CLAIMS.CLAIM_LINE`
**Status**: ✅ Fully defined in Layer 2 (Logical) and Layer 3 (Physical)
**Fields**: 38 (including standard columns)

**Resolution**:
- Complete entity definition in `models/logical/layer-2-logical-model.md`
- BigQuery DDL ready in `models/physical/layer-3-physical-model.md`
- Table path: `wncty-ptfm-data-prd-db78.edm_claims.claim_line`
- Partitioning: `service_date` (DAY)
- Clustering: `claim_id`, `line_number`

**Implemented Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `line_id` | STRING | Primary key (UUID) |
| `claim_id` | STRING | FK to medical_claim |
| `line_number` | INT64 | Line sequence number |
| `service_date` | DATE | Service date |
| `revenue_code` | STRING | Revenue code (UB) |
| `cpt_code` | STRING | CPT/HCPCS code |
| `cpt_modifier_1-4` | STRING | Modifiers 1-4 |
| `ndc_code` | STRING | NDC code (if drug) |
| `diagnosis_pointer` | STRING | Diagnosis code pointers |
| `place_of_service` | STRING | Place of service |
| `units` | NUMERIC | Service units |
| `billed_amount` | NUMERIC | Line billed amount |
| `allowed_amount` | NUMERIC | Line allowed amount |
| `paid_amount` | NUMERIC | Line paid amount |
| `denial_reason_code` | STRING | Line denial reason |

**Next Steps**: ETL transformation to normalize from mega table

---

## RESOLVED GAPS (Previously High Priority)

### 4. PROVIDER Master Table - ✅ RESOLVED

**EDM Entity**: `CLINICAL.PROVIDER`
**Status**: ✅ Fully defined in Layer 2 (Logical) and Layer 3 (Physical)
**Fields**: 56 (including standard columns)

**Resolution**:
- Complete entity definition in `models/logical/layer-2-logical-model.md`
- BigQuery DDL ready in `models/physical/layer-3-physical-model.md`
- Table path: `wncty-ptfm-data-prd-db78.edm_clinical.provider`
- Clustering: `npi`, `provider_type`

**All Previously Missing Fields Now Included**:
- `credential`, `license_number`, `license_state`, `license_status`
- `dea_number`, `medicare_provider_id`, `medicaid_provider_id`
- `enumeration_date`, `is_accepting_patients`, `is_pcp`, `is_specialist`
- Full address, taxonomy, and organization affiliation fields

**Next Steps**: Source initial data from NPPES, enrich from claims

---

### 5. FACILITY Master Table - ✅ RESOLVED

**EDM Entity**: `CLINICAL.FACILITY`
**Status**: ✅ Fully defined in Layer 2 (Logical) and Layer 3 (Physical)
**Fields**: 38 (including standard columns)

**Resolution**:
- Complete entity definition in `models/logical/layer-2-logical-model.md`
- BigQuery DDL ready in `models/physical/layer-3-physical-model.md`
- Table path: `wncty-ptfm-data-prd-db78.edm_clinical.facility`
- Clustering: `npi`, `facility_type`

**All Previously Missing Fields Now Included**:
- `cms_certification_number`, `bed_count`, `staffed_beds`
- `teaching_flag`, `trauma_level`, `cah_flag`, `rural_flag`
- `ownership_type`, `system_affiliation`, `system_id`
- `latitude`, `longitude`, `cms_rating`, `accreditation`

**Next Steps**: Source from CMS Provider of Services + NPPES

---

### 6. PHARMACY Master Table - ✅ RESOLVED

**EDM Entity**: `CLINICAL.PHARMACY`
**Status**: ✅ Fully defined in Layer 2 (Logical) and Layer 3 (Physical)
**Fields**: 36 (including standard columns)

**Resolution**:
- Complete entity definition in `models/logical/layer-2-logical-model.md`
- BigQuery DDL ready in `models/physical/layer-3-physical-model.md`
- Table path: `wncty-ptfm-data-prd-db78.edm_clinical.pharmacy`
- Clustering: `npi`, `pharmacy_type`

**All Previously Missing Fields Now Included**:
- `ncpdp_id`, `nabp_number`, `chain_code`, `chain_name`
- `dea_number`, `state_license`, `license_state`
- `dispensing_class`, `is_340b`, `specialty_accreditation`
- `latitude`, `longitude`, `hours_of_operation`, `is_24_hour`

**Next Steps**: Build pharmacy master from NCPDP database

---

## HIGH PRIORITY GAPS (Remaining)

### 7. Reference Code Tables - PARTIALLY MISSING

**EDM TLD**: REFERENCE (10 entities)
**Current State**: 2 of 10 reference tables exist in BigQuery; all 10 defined in EDM model

| Entity | EDM Model | BigQuery | Data Source |
|--------|-----------|----------|-------------|
| `CODE_SET` | ✅ Defined | ❌ Missing | Internal registry |
| `ICD10_CODE` | ✅ Defined | ✅ EXISTS | `MegaData.icd-10-reference-list` |
| `CPT_CODE` | ✅ Defined | ✅ EXISTS | `MegaData.cpt-reference-list` |
| `HCPCS_CODE` | ✅ Defined | ❌ Missing | CMS |
| `NDC_CODE` | ✅ Defined | ❌ Missing | FDA |
| `REVENUE_CODE` | ✅ Defined | ❌ Missing | NUBC |
| `PLACE_OF_SERVICE` | ✅ Defined | ❌ Missing | CMS |
| `MODIFIER_CODE` | ✅ Defined | ❌ Missing | CMS/AMA |
| `DRG_CODE` | ✅ Defined | ❌ Missing | CMS |
| `TAXONOMY_CODE` | ✅ Defined | ❌ Missing | NUCC |

**Business Impact**:
- Limited code validation capability
- Cannot provide code descriptions in reports
- No unified code management

**Recommendation**: Source reference data from CMS, AMA, NCPDP, FDA

---

### 8. STEP Entity - MODEL DEFINED, NOT IMPLEMENTED

**EDM Entity**: `INTERVENTION.STEP`
**Status**: ✅ Defined in EDM conceptual model | ❌ BigQuery implementation pending
**Fields**: ~25

**Impact**: Cannot track case workflow progression

**EDM Model** (from Layer 1 Conceptual):
| Field | Type | Description |
|-------|------|-------------|
| `step_id` | uuid | Primary key |
| `case_id` | uuid | FK to case |
| `sequence` | int | Step order |
| `step_type` | string | Workflow step type |
| `status` | string | Step status |
| `due_date` | date | Due date |
| `completed_date` | date | Completion date |

**Data Source**: MongoDB `patient_case_tz` - needs ETL pipeline

**Recommendation**: Create Layer 2/3 definitions, then implement ETL

---

### 9. PARTNER Entity - MODEL DEFINED, NOT IMPLEMENTED

**EDM Entity**: `OPERATIONS.PARTNER`
**Status**: ✅ Defined in EDM conceptual model | ❌ BigQuery implementation pending
**Fields**: ~20

**EDM Model** (from Layer 1 Conceptual):
| Field | Type | Description |
|-------|------|-------------|
| `partner_id` | uuid | Primary key |
| `name` | string | Partner name |
| `partner_type` | string | Type (CLINICAL, NAVIGATION, etc.) |
| `specialty` | string | Partner specialty |

**Recommendation**: Create Layer 2/3 definitions, build partner registry table

---

## MEDIUM PRIORITY GAPS

### 10. CONTRACT Entity - MODEL DEFINED, NOT IMPLEMENTED

**EDM Entity**: `FINANCIAL.CONTRACT`
**Status**: ✅ Defined in EDM conceptual model | ❌ BigQuery implementation pending
**Fields**: ~30

**EDM Model** (from Layer 1 Conceptual):
| Field | Type | Description |
|-------|------|-------------|
| `contract_id` | uuid | Primary key |
| `employer_id` | uuid | FK to employer |
| `vendor_id` | uuid | FK to vendor |
| `practitioner_id` | uuid | FK to practitioner |
| `contract_type` | string | Contract type |
| `effective_date` | date | Start date |
| `termination_date` | date | End date |

**Recommendation**: Create Layer 2/3 definitions, source from contract management system

---

### 11. STOP_LOSS_CLAIM Entity - MODEL DEFINED, NOT IMPLEMENTED

**EDM Entity**: `FINANCIAL.STOP_LOSS_CLAIM`
**Status**: ✅ Defined in EDM conceptual model | ❌ BigQuery implementation pending
**Fields**: ~20

**EDM Model** (from Layer 1 Conceptual):
| Field | Type | Description |
|-------|------|-------------|
| `sl_claim_id` | uuid | Primary key |
| `policy_id` | uuid | FK to stop_loss_policy |
| `medical_claim_id` | uuid | FK to medical_claim |
| `reimbursement_amount` | decimal | Amount reimbursed |
| `filed_date` | date | Date filed |
| `status` | string | Claim status |

**Recommendation**: Create Layer 2/3 definitions, build stop-loss claims table

---

### 12. SAVINGS_EVENT Entity - MODEL DEFINED, NOT IMPLEMENTED

**EDM Entity**: `FINANCIAL.SAVINGS_EVENT`
**Status**: ✅ Defined in EDM conceptual model | ❌ BigQuery implementation pending
**Fields**: ~20

**Current**: `MegaData.outcomes_savings` view exists but not structured per EDM

**EDM Model** (from Layer 1 Conceptual):
| Field | Type | Description |
|-------|------|-------------|
| `savings_id` | uuid | Primary key |
| `claim_id` | uuid | FK to claim |
| `outcome_id` | uuid | FK to outcome |
| `savings_type` | string | Type classification |
| `amount_saved` | decimal | Savings amount |
| `event_date` | date | Event date |
| `lever` | string | Savings lever |

**Recommendation**: Create Layer 2/3 definitions, enhance outcomes model with savings tracking

---

### 13. ADMISSION Entity - ✅ RESOLVED

**EDM Entity**: `CLINICAL.ADMISSION`
**Status**: ✅ Fully defined in Layer 2 (Logical) and Layer 3 (Physical)
**Fields**: 36 (including standard columns)

**Resolution**:
- Complete entity definition in `models/logical/layer-2-logical-model.md`
- BigQuery DDL ready in `models/physical/layer-3-physical-model.md`
- Table path: `wncty-ptfm-data-prd-db78.edm_clinical.admission`
- Partitioning: `admit_date` (MONTH)
- Clustering: `member_id`, `facility_id`

**All Previously Missing Fields Now Included**:
- `admission_id`, `admission_type`, `admission_source`
- `discharge_status`, `discharge_disposition`, `los_days`
- `readmission_flag`, `readmission_days`, `readmission_type`
- `drg_code`, `drg_type`, `mdc_code`, `icu_days`

**Next Steps**: ETL pipeline to build from claims + Encounter data

---

## LOW PRIORITY GAPS

### 14. OPERATIONS TLD - MODEL DEFINED, NOT IMPLEMENTED

**EDM Entities**: VENDOR, DATA_FEED, INTEGRATION_LOG
**Status**: ✅ Defined in EDM conceptual model | ❌ BigQuery implementation pending
**Total Fields**: ~128

**Missing Capabilities** (Implementation needed):
- Vendor management
- Feed monitoring
- Data quality tracking
- SLA monitoring

**Recommendation**: Create Layer 2/3 definitions, Phase 3 implementation

---

### 15. ANALYTICS TLD - MODEL DEFINED, NOT IMPLEMENTED

**EDM Entities**: DASHBOARD, REPORT, REPORT_SOURCE, REPORT_EXECUTION, METRIC, METRIC_VALUE
**Status**: ✅ Defined in EDM conceptual model | ❌ BigQuery implementation pending
**Total Fields**: ~192

**Missing Capabilities** (Implementation needed):
- Dashboard/report inventory
- Data lineage
- Metric definitions
- Usage tracking

**Recommendation**: Create Layer 2/3 definitions, Phase 3 implementation

---

## Gap Summary by Severity

| Severity | Count | Status | Entities |
|----------|-------|--------|----------|
| **RESOLVED** | 7 | ✅ Model Complete | ACCUMULATOR, ACCUMULATOR_UPDATE, CLAIM_LINE, PROVIDER, FACILITY, PHARMACY, ADMISSION |
| **HIGH** | 3 | 🔶 Model Partial | Reference tables (8 missing), STEP, PARTNER |
| **MEDIUM** | 3 | 🔶 Model Partial | CONTRACT, STOP_LOSS_CLAIM, SAVINGS_EVENT |
| **LOW** | 9 | 🔶 Conceptual Only | OPERATIONS TLD (3), ANALYTICS TLD (6) |

---

## Updated Gap Closure Roadmap

### ✅ COMPLETED: Critical Gaps (Model Design)
- [x] Design ACCUMULATOR schema (Layer 2 + Layer 3)
- [x] Design ACCUMULATOR_UPDATE schema (Layer 2 + Layer 3)
- [x] Design CLAIM_LINE normalized entity (Layer 2 + Layer 3)
- [x] Design PROVIDER master table (Layer 2 + Layer 3)
- [x] Design FACILITY master table (Layer 2 + Layer 3)
- [x] Design PHARMACY master table (Layer 2 + Layer 3)
- [x] Design ADMISSION entity (Layer 2 + Layer 3)

### Sprint 1-2: ETL Implementation for Resolved Entities
- [ ] Implement ACCUMULATOR ETL pipeline
- [ ] Implement ACCUMULATOR_UPDATE append-only log
- [ ] Implement CLAIM_LINE normalization from mega table
- [ ] Implement PROVIDER master from NPPES + claims
- [ ] Implement FACILITY master from CMS POS + NPPES
- [ ] Implement PHARMACY master from NCPDP
- [ ] Implement ADMISSION from claims + Encounter

### Sprint 3-4: Reference Data
- [ ] Source NDC reference data (FDA)
- [ ] Source HCPCS reference data (CMS)
- [ ] Source Revenue Code reference (NUBC)
- [ ] Source POS reference (CMS)
- [ ] Source Modifier reference (AMA/CMS)
- [ ] Source DRG reference (CMS)
- [ ] Source Taxonomy reference (NUCC)
- [ ] Build CODE_SET registry

### Sprint 5-6: Intervention & Financial Enhancement
- [ ] Create STEP Layer 2/3 definitions + ETL
- [ ] Create PARTNER Layer 2/3 definitions + ETL
- [ ] Create CONTRACT Layer 2/3 definitions
- [ ] Create STOP_LOSS_CLAIM Layer 2/3 definitions
- [ ] Create SAVINGS_EVENT Layer 2/3 definitions

### Future: Operations & Analytics
- [ ] OPERATIONS TLD Layer 2/3 definitions + implementation
- [ ] ANALYTICS TLD Layer 2/3 definitions + implementation
