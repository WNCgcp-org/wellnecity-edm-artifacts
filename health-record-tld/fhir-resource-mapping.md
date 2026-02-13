# FHIR R4 Resource Mapping Reference

## Overview

This document maps HEALTH_RECORD TLD entities to their corresponding HL7 FHIR R4 resources. The mapping enables interoperability with FHIR-compliant systems while maintaining openEHR persistence semantics.

## Architecture

```
openEHR Storage (BigQuery) → FHIR Views → FHIR API/Export
```

FHIR resources are exposed via BigQuery views that transform openEHR-structured data into FHIR-compliant JSON structures.

---

## Entity to Resource Mapping Summary

| EDM Entity | FHIR Resource | Profile (US Core) |
|------------|---------------|-------------------|
| HEALTH_RECORD_COMPOSITION | Bundle (document), Composition | - |
| PROBLEM | Condition | US Core Condition |
| ALLERGY | AllergyIntolerance | US Core AllergyIntolerance |
| MEDICATION | MedicationRequest, MedicationStatement | US Core MedicationRequest |
| VITAL_SIGN | Observation (vital-signs) | US Core Vital Signs |
| LAB_RESULT | Observation (laboratory), DiagnosticReport | US Core Laboratory Result Observation |
| PROCEDURE_RECORD | Procedure | US Core Procedure |
| IMMUNIZATION | Immunization | US Core Immunization |
| CLINICAL_NOTE | DocumentReference | US Core DocumentReference |
| CARE_PLAN | CarePlan | US Core CarePlan |
| ENCOUNTER_RECORD | Encounter | US Core Encounter |
| HEALTH_RECORD_PROVENANCE | Provenance | US Core Provenance |

---

## Detailed Resource Mappings

### PROBLEM → Condition

**FHIR Resource**: `Condition`
**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition`

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `problem_id` | `Condition.id` | 1..1 | Resource ID |
| `fhir_condition_id` | `Condition.identifier` | 0..* | Business identifier |
| `member_id` | `Condition.subject` | 1..1 | Reference(Patient) |
| `problem_code` | `Condition.code.coding.code` | 1..1 | Required |
| `problem_code_system` | `Condition.code.coding.system` | 1..1 | Required |
| `problem_code_display` | `Condition.code.coding.display` | 0..1 | |
| `problem_name` | `Condition.code.text` | 0..1 | Human-readable |
| `clinical_status` | `Condition.clinicalStatus.coding.code` | 0..1 | Bound to condition-clinical |
| `verification_status` | `Condition.verificationStatus.coding.code` | 0..1 | Bound to condition-ver-status |
| `category` | `Condition.category.coding.code` | 0..* | problem-list-item, encounter-diagnosis |
| `severity` | `Condition.severity.coding.code` | 0..1 | |
| `body_site` | `Condition.bodySite.text` | 0..* | |
| `body_site_code` | `Condition.bodySite.coding.code` | 0..* | SNOMED |
| `onset_date` | `Condition.onsetDateTime` | 0..1 | |
| `abatement_date` | `Condition.abatementDateTime` | 0..1 | |
| `recorded_date` | `Condition.recordedDate` | 0..1 | |
| `recorder_id` | `Condition.recorder` | 0..1 | Reference(Practitioner) |
| `asserter_id` | `Condition.asserter` | 0..1 | Reference(Practitioner) |
| `encounter_id` | `Condition.encounter` | 0..1 | Reference(Encounter) |
| `clinical_note` | `Condition.note.text` | 0..* | |

**Required for US Core**:
- `code` (1..1)
- `subject` (1..1)

**Value Sets**:
- `clinicalStatus`: http://terminology.hl7.org/CodeSystem/condition-clinical
- `verificationStatus`: http://terminology.hl7.org/CodeSystem/condition-ver-status
- `category`: http://terminology.hl7.org/CodeSystem/condition-category

---

### ALLERGY → AllergyIntolerance

**FHIR Resource**: `AllergyIntolerance`
**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-allergyintolerance`

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `allergy_id` | `AllergyIntolerance.id` | 1..1 | |
| `fhir_allergy_id` | `AllergyIntolerance.identifier` | 0..* | |
| `member_id` | `AllergyIntolerance.patient` | 1..1 | Reference(Patient) |
| `substance_code` | `AllergyIntolerance.code.coding.code` | 1..1 | |
| `substance_code_system` | `AllergyIntolerance.code.coding.system` | 1..1 | |
| `substance_code_display` | `AllergyIntolerance.code.coding.display` | 0..1 | |
| `substance_name` | `AllergyIntolerance.code.text` | 0..1 | |
| `clinical_status` | `AllergyIntolerance.clinicalStatus.coding.code` | 0..1 | |
| `verification_status` | `AllergyIntolerance.verificationStatus.coding.code` | 1..1 | Required |
| `allergy_type` | `AllergyIntolerance.type` | 0..1 | allergy, intolerance |
| `category` | `AllergyIntolerance.category` | 0..* | food, medication, environment, biologic |
| `criticality` | `AllergyIntolerance.criticality` | 0..1 | low, high, unable-to-assess |
| `onset_date` | `AllergyIntolerance.onsetDateTime` | 0..1 | |
| `recorded_date` | `AllergyIntolerance.recordedDate` | 0..1 | |
| `recorder_id` | `AllergyIntolerance.recorder` | 0..1 | Reference(Practitioner) |
| `asserter_id` | `AllergyIntolerance.asserter` | 0..1 | |
| `last_occurrence` | `AllergyIntolerance.lastOccurrence` | 0..1 | |
| `reaction_manifestation` | `AllergyIntolerance.reaction.manifestation` | 0..* | CodeableConcept[] |
| `reaction_severity` | `AllergyIntolerance.reaction.severity` | 0..1 | mild, moderate, severe |
| `reaction_description` | `AllergyIntolerance.reaction.description` | 0..1 | |
| `reaction_onset` | `AllergyIntolerance.reaction.onset` | 0..1 | |
| `reaction_exposure_route` | `AllergyIntolerance.reaction.exposureRoute` | 0..1 | |
| `clinical_note` | `AllergyIntolerance.note.text` | 0..* | |

**Required for US Core**:
- `code` (1..1)
- `patient` (1..1)

---

### MEDICATION → MedicationRequest / MedicationStatement

**FHIR Resources**:
- `MedicationRequest` (for orders/prescriptions, entry_type = INSTRUCTION)
- `MedicationStatement` (for medication history, entry_type = ACTION)

**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest`

#### MedicationRequest Mapping (entry_type = 'INSTRUCTION')

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `medication_id` | `MedicationRequest.id` | 1..1 | |
| `fhir_medication_id` | `MedicationRequest.identifier` | 0..* | |
| `member_id` | `MedicationRequest.subject` | 1..1 | Reference(Patient) |
| `status` | `MedicationRequest.status` | 1..1 | Required |
| `intent` | `MedicationRequest.intent` | 1..1 | Required |
| `medication_code` | `MedicationRequest.medicationCodeableConcept.coding.code` | 1..1 | |
| `medication_code_system` | `MedicationRequest.medicationCodeableConcept.coding.system` | 1..1 | |
| `medication_code_display` | `MedicationRequest.medicationCodeableConcept.coding.display` | 0..1 | |
| `medication_name` | `MedicationRequest.medicationCodeableConcept.text` | 0..1 | |
| `category` | `MedicationRequest.category.coding.code` | 0..* | |
| `authored_on` | `MedicationRequest.authoredOn` | 0..1 | |
| `prescriber_id` | `MedicationRequest.requester` | 0..1 | Reference(Practitioner) |
| `dosage_text` | `MedicationRequest.dosageInstruction.text` | 0..1 | |
| `dose_quantity` | `MedicationRequest.dosageInstruction.doseAndRate.doseQuantity.value` | 0..1 | |
| `dose_unit` | `MedicationRequest.dosageInstruction.doseAndRate.doseQuantity.unit` | 0..1 | |
| `route` | `MedicationRequest.dosageInstruction.route.text` | 0..1 | |
| `route_code` | `MedicationRequest.dosageInstruction.route.coding.code` | 0..1 | |
| `frequency_text` | `MedicationRequest.dosageInstruction.timing.code.text` | 0..1 | |
| `frequency_period` | `MedicationRequest.dosageInstruction.timing.repeat.period` | 0..1 | |
| `frequency_period_unit` | `MedicationRequest.dosageInstruction.timing.repeat.periodUnit` | 0..1 | |
| `as_needed` | `MedicationRequest.dosageInstruction.asNeededBoolean` | 0..1 | |
| `as_needed_reason` | `MedicationRequest.dosageInstruction.asNeededCodeableConcept.text` | 0..1 | |
| `start_date` | `MedicationRequest.dosageInstruction.timing.repeat.boundsPeriod.start` | 0..1 | |
| `end_date` | `MedicationRequest.dosageInstruction.timing.repeat.boundsPeriod.end` | 0..1 | |
| `dispense_quantity` | `MedicationRequest.dispenseRequest.quantity.value` | 0..1 | |
| `dispense_unit` | `MedicationRequest.dispenseRequest.quantity.unit` | 0..1 | |
| `refills_allowed` | `MedicationRequest.dispenseRequest.numberOfRepeatsAllowed` | 0..1 | |
| `substitution_allowed` | `MedicationRequest.substitution.allowedBoolean` | 0..1 | |
| `reason_code` | `MedicationRequest.reasonCode.coding.code` | 0..* | |
| `reason_text` | `MedicationRequest.reasonCode.text` | 0..* | |
| `clinical_note` | `MedicationRequest.note.text` | 0..* | |

**Required for US Core**:
- `status` (1..1)
- `intent` (1..1)
- `medication[x]` (1..1)
- `subject` (1..1)

---

### VITAL_SIGN → Observation (vital-signs)

**FHIR Resource**: `Observation`
**US Core Profiles**:
- `http://hl7.org/fhir/us/core/StructureDefinition/us-core-blood-pressure`
- `http://hl7.org/fhir/us/core/StructureDefinition/us-core-heart-rate`
- `http://hl7.org/fhir/us/core/StructureDefinition/us-core-body-temperature`
- etc.

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `vital_sign_id` | `Observation.id` | 1..1 | |
| `fhir_observation_id` | `Observation.identifier` | 0..* | |
| `member_id` | `Observation.subject` | 1..1 | Reference(Patient) |
| `status` | `Observation.status` | 1..1 | Required |
| `vital_code` | `Observation.code.coding.code` | 1..1 | LOINC |
| `vital_code_system` | `Observation.code.coding.system` | 1..1 | http://loinc.org |
| `vital_code_display` | `Observation.code.coding.display` | 0..1 | |
| `vital_type` | (mapped to code) | | Used to determine LOINC |
| `effective_datetime` | `Observation.effectiveDateTime` | 0..1 | |
| `value_quantity` | `Observation.valueQuantity.value` | 0..1 | For single-value vitals |
| `value_unit` | `Observation.valueQuantity.unit` | 0..1 | |
| `value_systolic` | `Observation.component[0].valueQuantity.value` | 0..1 | BP only |
| `value_diastolic` | `Observation.component[1].valueQuantity.value` | 0..1 | BP only |
| `interpretation` | `Observation.interpretation.coding.code` | 0..* | |
| `body_site` | `Observation.bodySite.text` | 0..1 | |
| `body_site_code` | `Observation.bodySite.coding.code` | 0..1 | |
| `method` | `Observation.method.text` | 0..1 | |
| `device` | `Observation.device` | 0..1 | Reference(Device) |
| `performer_id` | `Observation.performer` | 0..* | Reference(Practitioner) |
| `encounter_id` | `Observation.encounter` | 0..1 | Reference(Encounter) |
| `clinical_note` | `Observation.note.text` | 0..* | |

**LOINC Codes by Vital Type**:
| vital_type | LOINC Code | Display |
|------------|------------|---------|
| BLOOD_PRESSURE | 85354-9 | Blood pressure panel with all children optional |
| PULSE | 8867-4 | Heart rate |
| TEMPERATURE | 8310-5 | Body temperature |
| RESPIRATORY_RATE | 9279-1 | Respiratory rate |
| OXYGEN_SATURATION | 2708-6 | Oxygen saturation in Arterial blood |
| HEIGHT | 8302-2 | Body height |
| WEIGHT | 29463-7 | Body weight |
| BMI | 39156-5 | Body mass index (BMI) |

**Blood Pressure Components**:
| Component | LOINC | Unit |
|-----------|-------|------|
| Systolic | 8480-6 | mm[Hg] |
| Diastolic | 8462-4 | mm[Hg] |

---

### LAB_RESULT → Observation (laboratory)

**FHIR Resource**: `Observation`
**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-lab`

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `lab_result_id` | `Observation.id` | 1..1 | |
| `fhir_observation_id` | `Observation.identifier` | 0..* | |
| `member_id` | `Observation.subject` | 1..1 | Reference(Patient) |
| `status` | `Observation.status` | 1..1 | Required |
| `category` | `Observation.category` | 1..* | Must include "laboratory" |
| `test_code` | `Observation.code.coding.code` | 1..1 | LOINC |
| `test_code_system` | `Observation.code.coding.system` | 1..1 | |
| `test_code_display` | `Observation.code.coding.display` | 0..1 | |
| `test_name` | `Observation.code.text` | 0..1 | |
| `effective_datetime` | `Observation.effectiveDateTime` | 0..1 | Specimen collection time |
| `issued` | `Observation.issued` | 0..1 | Result available time |
| `value_quantity` | `Observation.valueQuantity.value` | 0..1 | |
| `value_unit` | `Observation.valueQuantity.unit` | 0..1 | |
| `value_string` | `Observation.valueString` | 0..1 | |
| `value_codeable_concept` | `Observation.valueCodeableConcept.coding.code` | 0..1 | |
| `reference_range_low` | `Observation.referenceRange.low.value` | 0..1 | |
| `reference_range_high` | `Observation.referenceRange.high.value` | 0..1 | |
| `reference_range_text` | `Observation.referenceRange.text` | 0..1 | |
| `interpretation` | `Observation.interpretation.coding.code` | 0..* | |
| `specimen_type` | `Observation.specimen` | 0..1 | Reference(Specimen) |
| `performing_lab` | `Observation.performer` | 0..* | Reference(Organization) |
| `encounter_id` | `Observation.encounter` | 0..1 | Reference(Encounter) |
| `clinical_note` | `Observation.note.text` | 0..* | |
| `diagnostic_report_id` | `Observation.partOf` | 0..* | Reference(DiagnosticReport) |

**Required for US Core**:
- `status` (1..1)
- `category` (1..*) - must include "laboratory"
- `code` (1..1)
- `subject` (1..1)

---

### PROCEDURE_RECORD → Procedure

**FHIR Resource**: `Procedure`
**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure`

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `procedure_record_id` | `Procedure.id` | 1..1 | |
| `fhir_procedure_id` | `Procedure.identifier` | 0..* | |
| `member_id` | `Procedure.subject` | 1..1 | Reference(Patient) |
| `status` | `Procedure.status` | 1..1 | Required |
| `status_reason` | `Procedure.statusReason.text` | 0..1 | |
| `procedure_code` | `Procedure.code.coding.code` | 1..1 | |
| `procedure_code_system` | `Procedure.code.coding.system` | 1..1 | |
| `procedure_code_display` | `Procedure.code.coding.display` | 0..1 | |
| `procedure_name` | `Procedure.code.text` | 0..1 | |
| `category` | `Procedure.category.coding.code` | 0..1 | |
| `performed_datetime` | `Procedure.performedDateTime` | 0..1 | |
| `performed_period_start` | `Procedure.performedPeriod.start` | 0..1 | |
| `performed_period_end` | `Procedure.performedPeriod.end` | 0..1 | |
| `body_site` | `Procedure.bodySite.text` | 0..* | |
| `body_site_code` | `Procedure.bodySite.coding.code` | 0..* | |
| `performer_id` | `Procedure.performer.actor` | 0..* | Reference(Practitioner) |
| `performer_role` | `Procedure.performer.function.text` | 0..* | |
| `location_id` | `Procedure.location` | 0..1 | Reference(Location) |
| `encounter_id` | `Procedure.encounter` | 0..1 | Reference(Encounter) |
| `reason_code` | `Procedure.reasonCode.coding.code` | 0..* | |
| `reason_text` | `Procedure.reasonCode.text` | 0..* | |
| `outcome` | `Procedure.outcome.text` | 0..1 | |
| `complication` | `Procedure.complication.text` | 0..* | |
| `clinical_note` | `Procedure.note.text` | 0..* | |

**Required for US Core**:
- `status` (1..1)
- `code` (1..1)
- `subject` (1..1)
- `performed[x]` (1..1)

---

### IMMUNIZATION → Immunization

**FHIR Resource**: `Immunization`
**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-immunization`

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `immunization_id` | `Immunization.id` | 1..1 | |
| `fhir_immunization_id` | `Immunization.identifier` | 0..* | |
| `member_id` | `Immunization.patient` | 1..1 | Reference(Patient) |
| `status` | `Immunization.status` | 1..1 | Required |
| `status_reason` | `Immunization.statusReason.text` | 0..1 | |
| `vaccine_code` | `Immunization.vaccineCode.coding.code` | 1..1 | CVX |
| `vaccine_code_system` | `Immunization.vaccineCode.coding.system` | 1..1 | |
| `vaccine_code_display` | `Immunization.vaccineCode.coding.display` | 0..1 | |
| `vaccine_name` | `Immunization.vaccineCode.text` | 0..1 | |
| `occurrence_datetime` | `Immunization.occurrenceDateTime` | 1..1 | Required |
| `recorded_date` | `Immunization.recorded` | 0..1 | |
| `primary_source` | `Immunization.primarySource` | 1..1 | Required |
| `report_origin` | `Immunization.reportOrigin.text` | 0..1 | |
| `lot_number` | `Immunization.lotNumber` | 0..1 | |
| `expiration_date` | `Immunization.expirationDate` | 0..1 | |
| `site` | `Immunization.site.text` | 0..1 | |
| `site_code` | `Immunization.site.coding.code` | 0..1 | |
| `route` | `Immunization.route.text` | 0..1 | |
| `route_code` | `Immunization.route.coding.code` | 0..1 | |
| `dose_quantity` | `Immunization.doseQuantity.value` | 0..1 | |
| `dose_unit` | `Immunization.doseQuantity.unit` | 0..1 | |
| `performer_id` | `Immunization.performer.actor` | 0..* | Reference(Practitioner) |
| `encounter_id` | `Immunization.encounter` | 0..1 | Reference(Encounter) |
| `clinical_note` | `Immunization.note.text` | 0..* | |

**Required for US Core**:
- `status` (1..1)
- `vaccineCode` (1..1)
- `patient` (1..1)
- `occurrence[x]` (1..1)
- `primarySource` (1..1)

---

### CLINICAL_NOTE → DocumentReference

**FHIR Resource**: `DocumentReference`
**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-documentreference`

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `clinical_note_id` | `DocumentReference.id` | 1..1 | |
| `fhir_document_id` | `DocumentReference.identifier` | 0..* | |
| `member_id` | `DocumentReference.subject` | 1..1 | Reference(Patient) |
| `document_status` | `DocumentReference.status` | 1..1 | Required |
| `doc_status` | `DocumentReference.docStatus` | 0..1 | |
| `document_type` | `DocumentReference.type.text` | 0..1 | |
| `document_type_code` | `DocumentReference.type.coding.code` | 1..1 | LOINC |
| `title` | `DocumentReference.description` | 0..1 | |
| `category` | `DocumentReference.category.coding.code` | 1..* | |
| `created_datetime` | `DocumentReference.date` | 0..1 | |
| `author_id` | `DocumentReference.author` | 0..* | Reference(Practitioner) |
| `authenticator_id` | `DocumentReference.authenticator` | 0..1 | |
| `custodian_id` | `DocumentReference.custodian` | 0..1 | Reference(Organization) |
| `content_text` | `DocumentReference.content.attachment.data` | 0..1 | Base64 encoded |
| `content_format` | `DocumentReference.content.attachment.contentType` | 0..1 | |
| `content_url` | `DocumentReference.content.attachment.url` | 0..1 | |
| `content_size` | `DocumentReference.content.attachment.size` | 0..1 | |
| `content_hash` | `DocumentReference.content.attachment.hash` | 0..1 | |
| `encounter_id` | `DocumentReference.context.encounter` | 0..* | Reference(Encounter) |

---

### CARE_PLAN → CarePlan

**FHIR Resource**: `CarePlan`
**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-careplan`

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `care_plan_id` | `CarePlan.id` | 1..1 | |
| `fhir_careplan_id` | `CarePlan.identifier` | 0..* | |
| `member_id` | `CarePlan.subject` | 1..1 | Reference(Patient) |
| `status` | `CarePlan.status` | 1..1 | Required |
| `intent` | `CarePlan.intent` | 1..1 | Required |
| `plan_title` | `CarePlan.title` | 0..1 | |
| `plan_description` | `CarePlan.description` | 0..1 | |
| `category` | `CarePlan.category.coding.code` | 1..* | Must include assess-plan |
| `period_start` | `CarePlan.period.start` | 0..1 | |
| `period_end` | `CarePlan.period.end` | 0..1 | |
| `created_datetime` | `CarePlan.created` | 0..1 | |
| `author_id` | `CarePlan.author` | 0..1 | Reference(Practitioner) |
| `addresses_conditions` | `CarePlan.addresses` | 0..* | Reference(Condition) |
| `goals` | `CarePlan.goal` | 0..* | Reference(Goal) |
| `activities` | `CarePlan.activity.detail.description` | 0..* | |
| `encounter_id` | `CarePlan.encounter` | 0..1 | Reference(Encounter) |
| `clinical_note` | `CarePlan.note.text` | 0..* | |

---

### ENCOUNTER_RECORD → Encounter

**FHIR Resource**: `Encounter`
**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-encounter`

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `encounter_id` | `Encounter.id` | 1..1 | |
| `fhir_encounter_id` | `Encounter.identifier` | 0..* | |
| `member_id` | `Encounter.subject` | 1..1 | Reference(Patient) |
| `status` | `Encounter.status` | 1..1 | Required |
| `encounter_class` | `Encounter.class.code` | 1..1 | Required |
| `encounter_class_code` | `Encounter.class.system` | 1..1 | |
| `encounter_type` | `Encounter.type.text` | 0..* | |
| `encounter_type_code` | `Encounter.type.coding.code` | 0..* | |
| `priority` | `Encounter.priority.coding.code` | 0..1 | |
| `period_start` | `Encounter.period.start` | 0..1 | |
| `period_end` | `Encounter.period.end` | 0..1 | |
| `length_minutes` | `Encounter.length.value` | 0..1 | (in minutes) |
| `reason_code` | `Encounter.reasonCode.coding.code` | 0..* | |
| `reason_text` | `Encounter.reasonCode.text` | 0..* | |
| `participant_ids` | `Encounter.participant.individual` | 0..* | Reference(Practitioner) |
| `location_id` | `Encounter.location.location` | 0..* | Reference(Location) |
| `location_name` | (derived from location) | | |
| `service_provider_id` | `Encounter.serviceProvider` | 0..1 | Reference(Organization) |
| `diagnosis_ids` | `Encounter.diagnosis.condition` | 0..* | Reference(Condition) |
| `hospitalization_admit_source` | `Encounter.hospitalization.admitSource.text` | 0..1 | |
| `hospitalization_discharge_disposition` | `Encounter.hospitalization.dischargeDisposition.text` | 0..1 | |

---

### HEALTH_RECORD_PROVENANCE → Provenance

**FHIR Resource**: `Provenance`
**US Core Profile**: `http://hl7.org/fhir/us/core/StructureDefinition/us-core-provenance`

| EDM Field | FHIR Path | Cardinality | Notes |
|-----------|-----------|-------------|-------|
| `provenance_id` | `Provenance.id` | 1..1 | |
| `fhir_provenance_id` | `Provenance.identifier` | 0..* | |
| `target_type`, `target_id` | `Provenance.target` | 1..* | Reference(Resource) |
| `recorded` | `Provenance.recorded` | 1..1 | Required |
| `occurred_datetime` | `Provenance.occurredDateTime` | 0..1 | |
| `activity` | `Provenance.activity.coding.code` | 0..1 | |
| `reason` | `Provenance.reason.text` | 0..* | |
| `agent_type` | `Provenance.agent.type.coding.code` | 0..1 | |
| `agent_id` | `Provenance.agent.who` | 1..* | Reference(Practitioner) |
| `agent_role` | `Provenance.agent.role.coding.code` | 0..* | |
| `on_behalf_of_id` | `Provenance.agent.onBehalfOf` | 0..1 | Reference(Organization) |
| `location_id` | `Provenance.location` | 0..1 | Reference(Location) |
| `signature` | `Provenance.signature.data` | 0..* | |
| `signature_type` | `Provenance.signature.type.code` | 0..* | |
| `policy` | `Provenance.policy` | 0..* | |

---

## Reference Patterns

### Patient Reference
All resources reference the patient via `member_id`:
```json
{
  "subject": {
    "reference": "Patient/{member_id}"
  }
}
```

### Practitioner Reference
Provider references use NPI when available:
```json
{
  "requester": {
    "reference": "Practitioner/{prescriber_id}",
    "display": "{prescriber_name}"
  }
}
```

### Encounter Reference
```json
{
  "encounter": {
    "reference": "Encounter/{encounter_id}"
  }
}
```

---

## Value Set Bindings

| Field | Value Set | Binding Strength |
|-------|-----------|------------------|
| Condition.clinicalStatus | http://terminology.hl7.org/CodeSystem/condition-clinical | Required |
| Condition.verificationStatus | http://terminology.hl7.org/CodeSystem/condition-ver-status | Required |
| AllergyIntolerance.clinicalStatus | http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical | Required |
| AllergyIntolerance.verificationStatus | http://terminology.hl7.org/CodeSystem/allergyintolerance-verification | Required |
| MedicationRequest.status | http://hl7.org/fhir/CodeSystem/medicationrequest-status | Required |
| Observation.status | http://hl7.org/fhir/observation-status | Required |
| Procedure.status | http://hl7.org/fhir/event-status | Required |
| Immunization.status | http://hl7.org/fhir/event-status | Required |
| Encounter.status | http://hl7.org/fhir/encounter-status | Required |

---

## Resources

- [HL7 FHIR R4 Specification](https://hl7.org/fhir/R4/)
- [US Core Implementation Guide](https://hl7.org/fhir/us/core/)
- [FHIR Resource Index](https://hl7.org/fhir/R4/resourcelist.html)
