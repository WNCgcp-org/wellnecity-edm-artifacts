-- ============================================================================
-- HEALTH_RECORD TLD - BigQuery DDL
-- ============================================================================
-- Dataset: edm_health_record
-- Purpose: Person Health Record with openEHR semantics and FHIR R4 mapping
-- ============================================================================

-- Create dataset
CREATE SCHEMA IF NOT EXISTS `edm_health_record`
OPTIONS(
  description = 'HEALTH_RECORD TLD - Person Health Record with openEHR semantics and FHIR mapping',
  location = 'US'
);

-- ============================================================================
-- Table: HEALTH_RECORD_COMPOSITION
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.health_record_composition` (
  composition_id STRING NOT NULL,
  member_id STRING NOT NULL,
  employer_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  template_id STRING,
  composition_type STRING NOT NULL,
  category STRING NOT NULL,
  context_start_time TIMESTAMP NOT NULL,
  context_end_time TIMESTAMP,
  context_setting STRING,
  context_location STRING,
  composer_id STRING,
  composer_name STRING,
  language STRING,
  territory STRING,
  version_number INT64 NOT NULL,
  is_current BOOL NOT NULL,
  preceding_version_id STRING,
  status STRING NOT NULL,
  fhir_bundle_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  -- ETL metadata
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(context_start_time)
CLUSTER BY member_id, composition_type
OPTIONS(
  description = 'Clinical document compositions - openEHR COMPOSITION mapped to FHIR Bundle'
);

-- ============================================================================
-- Table: PROBLEM
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.problem` (
  problem_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  problem_name STRING NOT NULL,
  problem_code STRING,
  problem_code_system STRING,
  problem_code_display STRING,
  clinical_status STRING NOT NULL,
  verification_status STRING,
  category STRING,
  severity STRING,
  body_site STRING,
  body_site_code STRING,
  onset_date DATE,
  onset_age STRING,
  abatement_date DATE,
  recorded_date TIMESTAMP NOT NULL,
  recorder_id STRING,
  asserter_id STRING,
  encounter_id STRING,
  clinical_note STRING,
  fhir_condition_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(recorded_date)
CLUSTER BY member_id, clinical_status
OPTIONS(
  description = 'Problems and diagnoses - openEHR EVALUATION.problem_diagnosis mapped to FHIR Condition'
);

-- ============================================================================
-- Table: ALLERGY
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.allergy` (
  allergy_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  substance_name STRING NOT NULL,
  substance_code STRING,
  substance_code_system STRING,
  substance_code_display STRING,
  category STRING,
  allergy_type STRING,
  criticality STRING,
  clinical_status STRING NOT NULL,
  verification_status STRING,
  onset_date DATE,
  recorded_date TIMESTAMP NOT NULL,
  recorder_id STRING,
  asserter_id STRING,
  last_occurrence DATE,
  reaction_manifestation JSON,
  reaction_severity STRING,
  reaction_onset STRING,
  reaction_description STRING,
  reaction_exposure_route STRING,
  clinical_note STRING,
  fhir_allergy_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(recorded_date)
CLUSTER BY member_id, clinical_status
OPTIONS(
  description = 'Allergies and adverse reactions - openEHR EVALUATION.adverse_reaction_risk mapped to FHIR AllergyIntolerance'
);

-- ============================================================================
-- Table: MEDICATION
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.medication` (
  medication_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  entry_type STRING NOT NULL,
  medication_name STRING NOT NULL,
  medication_code STRING,
  medication_code_system STRING,
  medication_code_display STRING,
  status STRING NOT NULL,
  intent STRING,
  category STRING,
  dosage_text STRING,
  dose_quantity NUMERIC,
  dose_unit STRING,
  route STRING,
  route_code STRING,
  frequency_text STRING,
  frequency_period NUMERIC,
  frequency_period_unit STRING,
  as_needed BOOL,
  as_needed_reason STRING,
  start_date DATE,
  end_date DATE,
  authored_on TIMESTAMP NOT NULL,
  prescriber_id STRING,
  prescriber_name STRING,
  dispense_quantity NUMERIC,
  dispense_unit STRING,
  refills_allowed INT64,
  substitution_allowed BOOL,
  reason_code STRING,
  reason_text STRING,
  clinical_note STRING,
  fhir_medication_id STRING,
  rx_claim_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(authored_on)
CLUSTER BY member_id, status, entry_type
OPTIONS(
  description = 'Medication orders and administration - openEHR INSTRUCTION/ACTION mapped to FHIR MedicationRequest/Statement'
);

-- ============================================================================
-- Table: VITAL_SIGN
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.vital_sign` (
  vital_sign_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  vital_type STRING NOT NULL,
  vital_code STRING,
  vital_code_system STRING,
  vital_code_display STRING,
  status STRING NOT NULL,
  effective_datetime TIMESTAMP NOT NULL,
  value_quantity NUMERIC,
  value_unit STRING,
  value_systolic NUMERIC,
  value_diastolic NUMERIC,
  value_text STRING,
  interpretation STRING,
  body_site STRING,
  body_site_code STRING,
  method STRING,
  device STRING,
  performer_id STRING,
  performer_name STRING,
  encounter_id STRING,
  clinical_note STRING,
  fhir_observation_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(effective_datetime)
CLUSTER BY member_id, vital_type
OPTIONS(
  description = 'Vital signs - openEHR OBSERVATION archetypes mapped to FHIR Observation (vital-signs)'
);

-- ============================================================================
-- Table: LAB_RESULT
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.lab_result` (
  lab_result_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  diagnostic_report_id STRING,
  archetype_id STRING NOT NULL,
  test_name STRING NOT NULL,
  test_code STRING,
  test_code_system STRING,
  test_code_display STRING,
  category STRING,
  status STRING NOT NULL,
  effective_datetime TIMESTAMP NOT NULL,
  issued TIMESTAMP,
  value_quantity NUMERIC,
  value_unit STRING,
  value_string STRING,
  value_codeable_concept STRING,
  value_codeable_system STRING,
  reference_range_low NUMERIC,
  reference_range_high NUMERIC,
  reference_range_text STRING,
  interpretation STRING,
  specimen_type STRING,
  specimen_code STRING,
  performing_lab STRING,
  performing_lab_id STRING,
  ordering_provider_id STRING,
  encounter_id STRING,
  clinical_note STRING,
  fhir_observation_id STRING,
  medical_claim_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(effective_datetime)
CLUSTER BY member_id, test_code
OPTIONS(
  description = 'Laboratory results - openEHR OBSERVATION.laboratory_test_result mapped to FHIR Observation (laboratory)'
);

-- ============================================================================
-- Table: PROCEDURE_RECORD
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.procedure_record` (
  procedure_record_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  procedure_name STRING NOT NULL,
  procedure_code STRING,
  procedure_code_system STRING,
  procedure_code_display STRING,
  status STRING NOT NULL,
  status_reason STRING,
  category STRING,
  performed_datetime TIMESTAMP,
  performed_period_start TIMESTAMP,
  performed_period_end TIMESTAMP,
  body_site STRING,
  body_site_code STRING,
  laterality STRING,
  performer_id STRING,
  performer_name STRING,
  performer_role STRING,
  location_id STRING,
  location_name STRING,
  encounter_id STRING,
  reason_code STRING,
  reason_text STRING,
  outcome STRING,
  complication STRING,
  clinical_note STRING,
  fhir_procedure_id STRING,
  medical_claim_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(performed_datetime)
CLUSTER BY member_id, procedure_code
OPTIONS(
  description = 'Clinical procedures - openEHR ACTION.procedure mapped to FHIR Procedure'
);

-- ============================================================================
-- Table: IMMUNIZATION
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.immunization` (
  immunization_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  vaccine_name STRING NOT NULL,
  vaccine_code STRING,
  vaccine_code_system STRING,
  vaccine_code_display STRING,
  status STRING NOT NULL,
  status_reason STRING,
  occurrence_datetime TIMESTAMP NOT NULL,
  recorded_date TIMESTAMP,
  primary_source BOOL,
  report_origin STRING,
  lot_number STRING,
  expiration_date DATE,
  site STRING,
  site_code STRING,
  route STRING,
  route_code STRING,
  dose_quantity NUMERIC,
  dose_unit STRING,
  performer_id STRING,
  performer_name STRING,
  location_id STRING,
  encounter_id STRING,
  clinical_note STRING,
  fhir_immunization_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(occurrence_datetime)
CLUSTER BY member_id, vaccine_code
OPTIONS(
  description = 'Immunizations - openEHR ACTION.immunisation mapped to FHIR Immunization'
);

-- ============================================================================
-- Table: CLINICAL_NOTE
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.clinical_note` (
  clinical_note_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  document_type STRING NOT NULL,
  document_type_code STRING,
  document_status STRING NOT NULL,
  doc_status STRING,
  title STRING,
  content_text STRING,
  content_format STRING,
  content_url STRING,
  content_size INT64,
  content_hash STRING,
  created_datetime TIMESTAMP NOT NULL,
  author_id STRING,
  author_name STRING,
  authenticator_id STRING,
  custodian_id STRING,
  encounter_id STRING,
  clinical_context STRING,
  fhir_document_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(created_datetime)
CLUSTER BY member_id, document_type
OPTIONS(
  description = 'Clinical notes and documents - openEHR COMPOSITION.report mapped to FHIR DocumentReference'
);

-- ============================================================================
-- Table: CARE_PLAN
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.care_plan` (
  care_plan_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  plan_title STRING NOT NULL,
  plan_description STRING,
  status STRING NOT NULL,
  intent STRING NOT NULL,
  category STRING,
  period_start DATE,
  period_end DATE,
  created_datetime TIMESTAMP NOT NULL,
  author_id STRING,
  author_name STRING,
  contributor_ids JSON,
  addresses_conditions JSON,
  goals JSON,
  activities JSON,
  encounter_id STRING,
  clinical_note STRING,
  fhir_careplan_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(created_datetime)
CLUSTER BY member_id, status
OPTIONS(
  description = 'Care plans - openEHR INSTRUCTION.care_plan mapped to FHIR CarePlan'
);

-- ============================================================================
-- Table: ENCOUNTER_RECORD
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.encounter_record` (
  encounter_id STRING NOT NULL,
  composition_id STRING,
  member_id STRING NOT NULL,
  archetype_id STRING NOT NULL,
  encounter_class STRING NOT NULL,
  encounter_class_code STRING,
  encounter_type STRING,
  encounter_type_code STRING,
  status STRING NOT NULL,
  priority STRING,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP,
  length_minutes INT64,
  reason_code STRING,
  reason_text STRING,
  admission_source STRING,
  discharge_disposition STRING,
  participant_ids JSON,
  location_id STRING,
  location_name STRING,
  service_provider_id STRING,
  diagnosis_ids JSON,
  hospitalization_admit_source STRING,
  hospitalization_discharge_disposition STRING,
  clinical_admission_id STRING,
  fhir_encounter_id STRING,
  source STRING,
  source_id STRING,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(period_start)
CLUSTER BY member_id, encounter_class, status
OPTIONS(
  description = 'Clinical encounters - openEHR COMPOSITION.encounter mapped to FHIR Encounter'
);

-- ============================================================================
-- Table: HEALTH_RECORD_PROVENANCE
-- ============================================================================
CREATE OR REPLACE TABLE `edm_health_record.health_record_provenance` (
  provenance_id STRING NOT NULL,
  target_type STRING NOT NULL,
  target_id STRING NOT NULL,
  recorded TIMESTAMP NOT NULL,
  occurred_datetime TIMESTAMP,
  activity STRING NOT NULL,
  activity_code STRING,
  reason STRING,
  agent_type STRING NOT NULL,
  agent_id STRING NOT NULL,
  agent_name STRING,
  agent_role STRING,
  on_behalf_of_id STRING,
  location_id STRING,
  signature STRING,
  signature_type STRING,
  policy STRING,
  fhir_provenance_id STRING,
  created_at TIMESTAMP NOT NULL,
  _load_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  _batch_id STRING
)
PARTITION BY DATE(recorded)
CLUSTER BY target_type, target_id
OPTIONS(
  description = 'Audit trail and provenance - openEHR AUDIT_DETAILS mapped to FHIR Provenance'
);

-- ============================================================================
-- Indexes (via clustering) are defined in table options above
-- Additional indexes can be created as needed using BigQuery Search Index
-- ============================================================================

-- Example: Create search index for problem codes
-- CREATE SEARCH INDEX idx_problem_code_search ON `edm_health_record.problem`(problem_code);

-- ============================================================================
-- Foreign Key Relationships (documented, not enforced in BigQuery)
-- ============================================================================
/*
HEALTH_RECORD_COMPOSITION:
  - member_id -> edm_core.member(member_id)
  - employer_id -> edm_core.employer(employer_id)
  - preceding_version_id -> edm_health_record.health_record_composition(composition_id)

PROBLEM:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)
  - encounter_id -> edm_health_record.encounter_record(encounter_id)

ALLERGY:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)

MEDICATION:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)
  - rx_claim_id -> edm_claims.rx_claim(claim_id)

VITAL_SIGN:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)
  - encounter_id -> edm_health_record.encounter_record(encounter_id)

LAB_RESULT:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)
  - diagnostic_report_id -> edm_health_record.lab_result(lab_result_id)
  - encounter_id -> edm_health_record.encounter_record(encounter_id)
  - medical_claim_id -> edm_claims.medical_claim(claim_id)

PROCEDURE_RECORD:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)
  - encounter_id -> edm_health_record.encounter_record(encounter_id)
  - medical_claim_id -> edm_claims.medical_claim(claim_id)

IMMUNIZATION:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)
  - encounter_id -> edm_health_record.encounter_record(encounter_id)

CLINICAL_NOTE:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)
  - encounter_id -> edm_health_record.encounter_record(encounter_id)

CARE_PLAN:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)
  - encounter_id -> edm_health_record.encounter_record(encounter_id)

ENCOUNTER_RECORD:
  - member_id -> edm_core.member(member_id)
  - composition_id -> edm_health_record.health_record_composition(composition_id)
  - clinical_admission_id -> edm_clinical.admission(admission_id)

HEALTH_RECORD_PROVENANCE:
  - target_id -> (polymorphic reference to any health_record entity)
*/
