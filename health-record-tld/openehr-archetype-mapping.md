# openEHR Archetype Mapping Reference

## Overview

This document maps HEALTH_RECORD TLD entities to their corresponding openEHR archetypes. The mapping follows the openEHR Reference Model (RM) and Archetype Model (AM) specifications.

## openEHR Fundamentals

### Entry Types

openEHR defines five clinical entry types:

| Entry Type | Purpose | Temporal Focus | EDM Entities |
|------------|---------|----------------|--------------|
| **OBSERVATION** | Direct observations, measurements, experiences | Past/Present | VITAL_SIGN, LAB_RESULT |
| **EVALUATION** | Clinical assessments, opinions, diagnoses | Present | PROBLEM, ALLERGY |
| **INSTRUCTION** | Actionable statements about future care | Future | MEDICATION (orders), CARE_PLAN |
| **ACTION** | Records of performed activities | Past | MEDICATION (admin), PROCEDURE_RECORD, IMMUNIZATION |
| **ADMIN_ENTRY** | Administrative information | N/A | (metadata fields) |

### Archetype Identifier Format

```
[namespace::]openEHR-EHR-{CLASS}.{concept_id}.v{version}
```

Example: `openEHR-EHR-OBSERVATION.blood_pressure.v2`

---

## Entity to Archetype Mapping

### HEALTH_RECORD_COMPOSITION

**Primary Archetype**: COMPOSITION (Reference Model class)

| Composition Type | Archetype ID | Description |
|------------------|--------------|-------------|
| ENCOUNTER | `openEHR-EHR-COMPOSITION.encounter.v1` | Clinical encounter documentation |
| DISCHARGE_SUMMARY | `openEHR-EHR-COMPOSITION.discharge_summary.v1` | Discharge documentation |
| PROBLEM_LIST | `openEHR-EHR-COMPOSITION.problem_list.v1` | Active problem list |
| MEDICATION_LIST | `openEHR-EHR-COMPOSITION.medication_list.v1` | Current medications |
| LAB_REPORT | `openEHR-EHR-COMPOSITION.report-result.v1` | Laboratory report |
| VITAL_SIGNS | `openEHR-EHR-COMPOSITION.vital_signs.v1` | Vital signs collection |

**Key openEHR Paths**:
| EDM Field | openEHR Path |
|-----------|--------------|
| `composition_id` | `/uid` |
| `archetype_id` | `/archetype_node_id` |
| `template_id` | `/archetype_details/template_id` |
| `composition_type` | `/name/value` |
| `category` | `/category/value` |
| `context_start_time` | `/context/start_time` |
| `context_end_time` | `/context/end_time` |
| `context_setting` | `/context/setting` |
| `composer_id` | `/composer/external_ref` |
| `composer_name` | `/composer/name` |
| `language` | `/language/code_string` |
| `territory` | `/territory/code_string` |

---

### PROBLEM

**Primary Archetype**: `openEHR-EHR-EVALUATION.problem_diagnosis.v1`

**Archetype Purpose**: Recording clinical problems, diagnoses, and health concerns.

**Key openEHR Paths**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `problem_name` | `/data[at0001]/items[at0002]` | Problem/Diagnosis name |
| `problem_code` | `/data[at0001]/items[at0002]/defining_code` | Coded diagnosis |
| `clinical_status` | `/data[at0001]/items[at0063]` | Status of diagnosis |
| `verification_status` | `/data[at0001]/items[at0073]` | Verification status |
| `severity` | `/data[at0001]/items[at0005]` | Severity |
| `body_site` | `/data[at0001]/items[at0012]` | Body site |
| `onset_date` | `/data[at0001]/items[at0077]` | Date/time of onset |
| `abatement_date` | `/data[at0001]/items[at0030]` | Date/time of resolution |
| `clinical_note` | `/data[at0001]/items[at0069]` | Comment |

**Archetype Nodes (at-codes)**:
- `at0001` - structure (Tree)
- `at0002` - Problem/Diagnosis name
- `at0005` - Severity
- `at0012` - Body site
- `at0030` - Date/time of resolution
- `at0063` - Status
- `at0069` - Comment
- `at0073` - Diagnostic certainty
- `at0077` - Date/time of onset

---

### ALLERGY

**Primary Archetype**: `openEHR-EHR-EVALUATION.adverse_reaction_risk.v1`

**Archetype Purpose**: Recording propensity for adverse reactions to substances.

**Key openEHR Paths**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `substance_name` | `/data[at0001]/items[at0002]` | Substance |
| `substance_code` | `/data[at0001]/items[at0002]/defining_code` | Coded substance |
| `category` | `/data[at0001]/items[at0063]` | Category |
| `allergy_type` | `/data[at0001]/items[at0058]` | Reaction type |
| `criticality` | `/data[at0001]/items[at0101]` | Criticality |
| `clinical_status` | `/data[at0001]/items[at0063]` | Status |
| `verification_status` | `/data[at0001]/items[at0073]` | Verification |
| `onset_date` | `/data[at0001]/items[at0117]` | Onset of first reaction |
| `last_occurrence` | `/data[at0001]/items[at0117]` | Last reaction date |
| `reaction_manifestation` | `/data[at0001]/items[at0009]/items[at0011]` | Manifestation |
| `reaction_severity` | `/data[at0001]/items[at0009]/items[at0089]` | Reaction severity |
| `reaction_description` | `/data[at0001]/items[at0009]/items[at0025]` | Reaction description |
| `clinical_note` | `/data[at0001]/items[at0006]` | Comment |

**Archetype Nodes**:
- `at0001` - structure
- `at0002` - Substance
- `at0006` - Comment
- `at0009` - Reaction event
- `at0011` - Manifestation
- `at0025` - Reaction description
- `at0058` - Reaction type (allergy vs intolerance)
- `at0063` - Status
- `at0073` - Verification status
- `at0089` - Severity of reaction
- `at0101` - Criticality
- `at0117` - Onset/Last occurrence

---

### MEDICATION

**Primary Archetypes**:
- `openEHR-EHR-INSTRUCTION.medication_order.v3` (for orders/prescriptions)
- `openEHR-EHR-ACTION.medication.v1` (for administration records)

**Supporting Cluster Archetypes**:
- `openEHR-EHR-CLUSTER.medication.v2` - Medication substance details
- `openEHR-EHR-CLUSTER.dosage.v2` - Dosing information
- `openEHR-EHR-CLUSTER.timing_daily.v1` - Daily timing
- `openEHR-EHR-CLUSTER.timing_noncontinuous.v1` - Non-continuous timing

**Key openEHR Paths (INSTRUCTION)**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `medication_name` | `/activities[at0001]/description[at0002]/items[at0070]` | Medication item |
| `medication_code` | `/activities[at0001]/description[at0002]/items[at0070]/defining_code` | Coded medication |
| `dosage_text` | `/activities[at0001]/description[at0002]/items[at0009]` | Dose description |
| `dose_quantity` | `/activities[at0001]/description[at0002]/items[at0144]` | Dose amount |
| `route` | `/activities[at0001]/description[at0002]/items[at0091]` | Route |
| `frequency_text` | `/activities[at0001]/description[at0002]/items[at0113]` | Timing description |
| `as_needed` | `/activities[at0001]/description[at0002]/items[at0146]` | PRN |
| `start_date` | `/activities[at0001]/description[at0002]/items[at0113]/events[at0014]` | Start date |
| `dispense_quantity` | `/activities[at0001]/description[at0002]/items[at0135]` | Amount to dispense |
| `refills_allowed` | `/activities[at0001]/description[at0002]/items[at0134]` | Number of repeats |
| `substitution_allowed` | `/activities[at0001]/description[at0002]/items[at0133]` | Substitution |
| `reason_text` | `/activities[at0001]/description[at0002]/items[at0018]` | Clinical indication |
| `clinical_note` | `/activities[at0001]/description[at0002]/items[at0044]` | Comment |

**Key openEHR Paths (ACTION)**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `status` | `/ism_transition/current_state` | ISM state |
| `medication_name` | `/description[at0017]/items[at0020]` | Medication |
| `dose_quantity` | `/description[at0017]/items[at0033]` | Dose |
| `route` | `/description[at0017]/items[at0140]` | Route |

---

### VITAL_SIGN

**Primary Archetypes** (by vital type):

| Vital Type | Archetype ID |
|------------|--------------|
| BLOOD_PRESSURE | `openEHR-EHR-OBSERVATION.blood_pressure.v2` |
| PULSE | `openEHR-EHR-OBSERVATION.pulse.v2` |
| TEMPERATURE | `openEHR-EHR-OBSERVATION.body_temperature.v2` |
| RESPIRATORY_RATE | `openEHR-EHR-OBSERVATION.respiration.v2` |
| OXYGEN_SATURATION | `openEHR-EHR-OBSERVATION.pulse_oximetry.v1` |
| HEIGHT | `openEHR-EHR-OBSERVATION.height.v2` |
| WEIGHT | `openEHR-EHR-OBSERVATION.body_weight.v2` |
| BMI | `openEHR-EHR-OBSERVATION.body_mass_index.v2` |

**Key openEHR Paths (Blood Pressure example)**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `effective_datetime` | `/data[at0001]/events[at0006]/time` | Event time |
| `value_systolic` | `/data[at0001]/events[at0006]/data[at0003]/items[at0004]` | Systolic |
| `value_diastolic` | `/data[at0001]/events[at0006]/data[at0003]/items[at0005]` | Diastolic |
| `body_site` | `/protocol[at0011]/items[at0014]` | Location of measurement |
| `method` | `/protocol[at0011]/items[at0009]` | Method |
| `device` | `/protocol[at0011]/items[at0013]` | Device |
| `clinical_note` | `/data[at0001]/events[at0006]/data[at0003]/items[at0033]` | Comment |

**openEHR OBSERVATION Structure**:
```
OBSERVATION
├── data (History)
│   └── events[] (Event)
│       ├── time
│       ├── data (ItemTree) - measured values
│       └── state (ItemTree) - patient state during measurement
└── protocol (ItemTree) - measurement method/device
```

---

### LAB_RESULT

**Primary Archetype**: `openEHR-EHR-OBSERVATION.laboratory_test_result.v1`

**Supporting Cluster Archetypes**:
- `openEHR-EHR-CLUSTER.laboratory_test_analyte.v1` - Individual analyte results
- `openEHR-EHR-CLUSTER.specimen.v1` - Specimen details

**Key openEHR Paths**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `test_name` | `/data[at0001]/events[at0002]/data[at0003]/items[at0005]` | Test name |
| `test_code` | `/data[at0001]/events[at0002]/data[at0003]/items[at0005]/defining_code` | LOINC code |
| `effective_datetime` | `/data[at0001]/events[at0002]/time` | Specimen collection time |
| `status` | `/data[at0001]/events[at0002]/state` | Result status |
| `value_quantity` | `/data[at0001]/events[at0002]/data[at0003]/items[at0078]/items[at0001]` | Analyte result |
| `reference_range_low` | `/data[at0001]/events[at0002]/data[at0003]/items[at0078]/items[at0004]` | Reference range low |
| `reference_range_high` | `/data[at0001]/events[at0002]/data[at0003]/items[at0078]/items[at0005]` | Reference range high |
| `interpretation` | `/data[at0001]/events[at0002]/data[at0003]/items[at0078]/items[at0057]` | Interpretation |
| `specimen_type` | `/data[at0001]/events[at0002]/data[at0003]/items[at0065]` | Specimen |
| `clinical_note` | `/data[at0001]/events[at0002]/data[at0003]/items[at0078]/items[at0006]` | Comment |

---

### PROCEDURE_RECORD

**Primary Archetype**: `openEHR-EHR-ACTION.procedure.v1`

**Key openEHR Paths**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `procedure_name` | `/description[at0001]/items[at0002]` | Procedure name |
| `procedure_code` | `/description[at0001]/items[at0002]/defining_code` | Procedure code |
| `status` | `/ism_transition/current_state` | ISM careflow state |
| `status_reason` | `/description[at0001]/items[at0014]` | Reason |
| `performed_datetime` | `/time` | Time of action |
| `body_site` | `/description[at0001]/items[at0063]` | Body site |
| `laterality` | `/description[at0001]/items[at0064]` | Laterality |
| `outcome` | `/description[at0001]/items[at0048]` | Outcome |
| `complication` | `/description[at0001]/items[at0006]` | Complication |
| `clinical_note` | `/description[at0001]/items[at0005]` | Comment |

**ISM (Instruction State Machine) States**:
| State | Code | EDM status |
|-------|------|------------|
| Planned | 526 | preparation |
| Scheduled | 529 | preparation |
| Active | 245 | in-progress |
| Suspended | 530 | on-hold |
| Aborted | 531 | stopped |
| Completed | 532 | completed |
| Cancelled | 528 | not-done |

---

### IMMUNIZATION

**Primary Archetype**: `openEHR-EHR-ACTION.immunisation.v1`

**Key openEHR Paths**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `vaccine_name` | `/description[at0001]/items[at0002]` | Immunisation item |
| `vaccine_code` | `/description[at0001]/items[at0002]/defining_code` | CVX code |
| `occurrence_datetime` | `/time` | Administration time |
| `lot_number` | `/description[at0001]/items[at0004]` | Batch/lot number |
| `expiration_date` | `/description[at0001]/items[at0005]` | Expiry date |
| `site` | `/description[at0001]/items[at0006]` | Body site |
| `route` | `/description[at0001]/items[at0007]` | Route |
| `dose_quantity` | `/description[at0001]/items[at0008]` | Dose quantity |
| `clinical_note` | `/description[at0001]/items[at0009]` | Comment |

---

### CLINICAL_NOTE

**Primary Archetypes**:
- `openEHR-EHR-COMPOSITION.report.v1` - Generic report composition
- `openEHR-EHR-EVALUATION.clinical_synopsis.v1` - Clinical synopsis entry

**Key openEHR Paths**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `title` | `/name/value` | Report name |
| `content_text` | `/content[at0001]/items[at0002]` | Synopsis text |
| `created_datetime` | `/context/start_time` | Report date |
| `author_id` | `/composer/external_ref` | Author reference |
| `author_name` | `/composer/name` | Author name |

---

### CARE_PLAN

**Primary Archetype**: `openEHR-EHR-INSTRUCTION.care_plan.v1`

**Key openEHR Paths**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `plan_title` | `/activities[at0001]/description[at0002]/items[at0003]` | Care plan name |
| `plan_description` | `/activities[at0001]/description[at0002]/items[at0004]` | Description |
| `status` | `/activities[at0001]/action_archetype_id` | Status (from workflow) |
| `period_start` | `/activities[at0001]/timing/lower` | Start date |
| `period_end` | `/activities[at0001]/timing/upper` | End date |
| `goals` | `/activities[at0001]/description[at0002]/items[at0005]` | Goals |
| `activities` | `/activities[at0001]/description[at0002]/items[at0006]` | Activities |

---

### ENCOUNTER_RECORD

**Primary Archetype**: `openEHR-EHR-COMPOSITION.encounter.v1`

**Key openEHR Paths**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `encounter_class` | `/context/setting` | Care setting |
| `encounter_type` | `/name/value` | Encounter type |
| `period_start` | `/context/start_time` | Start time |
| `period_end` | `/context/end_time` | End time |
| `reason_text` | `/context/other_context/items[reason]` | Reason for encounter |
| `location_name` | `/context/location` | Location |
| `participant_ids` | `/context/participations` | Participants |

---

### HEALTH_RECORD_PROVENANCE

**Primary Mapping**: openEHR `AUDIT_DETAILS` from Reference Model

The openEHR Reference Model includes audit information at multiple levels:
- `VERSION.commit_audit` - Audit for version commits
- `CONTRIBUTION.audit` - Audit for contributions
- `AUDIT_DETAILS` - Common audit structure

**Key openEHR Paths**:
| EDM Field | openEHR Path | Notes |
|-----------|--------------|-------|
| `recorded` | `AUDIT_DETAILS.time_committed` | Commit time |
| `activity` | `AUDIT_DETAILS.change_type` | Type of change |
| `agent_id` | `AUDIT_DETAILS.committer/external_ref` | Committer ID |
| `agent_name` | `AUDIT_DETAILS.committer/name` | Committer name |
| `reason` | `AUDIT_DETAILS.description` | Reason for change |

---

## Terminology Bindings

openEHR archetypes bind to standard terminologies:

| Terminology | URI | Usage |
|-------------|-----|-------|
| SNOMED CT | `http://snomed.info/sct` | Clinical concepts, body sites, procedures |
| ICD-10-CM | `http://hl7.org/fhir/sid/icd-10-cm` | Diagnoses |
| LOINC | `http://loinc.org` | Lab tests, vital signs, documents |
| RxNorm | `http://www.nlm.nih.gov/research/umls/rxnorm` | Medications |
| CVX | `http://hl7.org/fhir/sid/cvx` | Vaccines |
| NDC | `http://hl7.org/fhir/sid/ndc` | Drug products |

---

## Resources

- [openEHR Clinical Knowledge Manager (CKM)](https://ckm.openehr.org/ckm/)
- [openEHR Specifications](https://specifications.openehr.org/)
- [openEHR Reference Model](https://specifications.openehr.org/releases/RM/latest/)
- [openEHR Archetype Model](https://specifications.openehr.org/releases/AM/latest/)
