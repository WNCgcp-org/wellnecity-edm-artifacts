-- ============================================================================
-- HEALTH_RECORD TLD - FHIR R4 Interoperability Views
-- ============================================================================
-- Purpose: Transform openEHR-structured data to FHIR R4-compliant JSON
-- These views enable FHIR API compatibility without a separate FHIR server
-- ============================================================================

-- ============================================================================
-- View: v_fhir_condition (from PROBLEM)
-- FHIR Resource: Condition
-- US Core Profile: http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_condition` AS
SELECT
  problem_id AS id,
  'Condition' AS resourceType,
  TO_JSON(STRUCT(
    STRUCT(
      fhir_condition_id AS value,
      'http://wellnecity.com/fhir/identifier/condition' AS system
    ) AS identifier
  )) AS identifier,
  TO_JSON(STRUCT(
    STRUCT(clinical_status AS code) AS coding,
    clinical_status AS text
  )) AS clinicalStatus,
  TO_JSON(STRUCT(
    STRUCT(verification_status AS code) AS coding,
    verification_status AS text
  )) AS verificationStatus,
  TO_JSON(ARRAY[STRUCT(
    STRUCT(category AS code) AS coding,
    category AS text
  )]) AS category,
  TO_JSON(STRUCT(
    STRUCT(severity AS code) AS coding,
    severity AS text
  )) AS severity,
  TO_JSON(STRUCT(
    ARRAY[STRUCT(
      problem_code AS code,
      problem_code_system AS system,
      problem_code_display AS display
    )] AS coding,
    problem_name AS text
  )) AS code,
  TO_JSON(ARRAY[STRUCT(
    ARRAY[STRUCT(
      body_site_code AS code,
      'http://snomed.info/sct' AS system
    )] AS coding,
    body_site AS text
  )]) AS bodySite,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS subject,
  CASE WHEN encounter_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Encounter/', encounter_id) AS reference))
  END AS encounter,
  CAST(onset_date AS STRING) AS onsetDateTime,
  CAST(abatement_date AS STRING) AS abatementDateTime,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', recorded_date) AS recordedDate,
  CASE WHEN recorder_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Practitioner/', recorder_id) AS reference))
  END AS recorder,
  CASE WHEN asserter_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Practitioner/', asserter_id) AS reference))
  END AS asserter,
  CASE WHEN clinical_note IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(clinical_note AS text)])
  END AS note
FROM `edm_health_record.problem`
WHERE clinical_status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_allergy_intolerance (from ALLERGY)
-- FHIR Resource: AllergyIntolerance
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_allergy_intolerance` AS
SELECT
  allergy_id AS id,
  'AllergyIntolerance' AS resourceType,
  TO_JSON(STRUCT(
    STRUCT(clinical_status AS code) AS coding
  )) AS clinicalStatus,
  TO_JSON(STRUCT(
    STRUCT(verification_status AS code) AS coding
  )) AS verificationStatus,
  allergy_type AS type,
  TO_JSON(ARRAY[category]) AS category,
  criticality,
  TO_JSON(STRUCT(
    ARRAY[STRUCT(
      substance_code AS code,
      substance_code_system AS system,
      substance_code_display AS display
    )] AS coding,
    substance_name AS text
  )) AS code,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS patient,
  CAST(onset_date AS STRING) AS onsetDateTime,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', recorded_date) AS recordedDate,
  CASE WHEN recorder_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Practitioner/', recorder_id) AS reference))
  END AS recorder,
  CAST(last_occurrence AS STRING) AS lastOccurrence,
  CASE WHEN reaction_manifestation IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      reaction_manifestation AS manifestation,
      reaction_description AS description,
      reaction_severity AS severity,
      reaction_onset AS onset,
      STRUCT(reaction_exposure_route AS text) AS exposureRoute
    )])
  END AS reaction,
  CASE WHEN clinical_note IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(clinical_note AS text)])
  END AS note
FROM `edm_health_record.allergy`
WHERE clinical_status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_medication_request (from MEDICATION where entry_type = 'INSTRUCTION')
-- FHIR Resource: MedicationRequest
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_medication_request` AS
SELECT
  medication_id AS id,
  'MedicationRequest' AS resourceType,
  status,
  intent,
  TO_JSON(ARRAY[STRUCT(
    STRUCT(category AS code) AS coding
  )]) AS category,
  TO_JSON(STRUCT(
    ARRAY[STRUCT(
      medication_code AS code,
      medication_code_system AS system,
      medication_code_display AS display
    )] AS coding,
    medication_name AS text
  )) AS medicationCodeableConcept,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS subject,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', authored_on) AS authoredOn,
  CASE WHEN prescriber_id IS NOT NULL THEN
    TO_JSON(STRUCT(
      CONCAT('Practitioner/', prescriber_id) AS reference,
      prescriber_name AS display
    ))
  END AS requester,
  TO_JSON(ARRAY[STRUCT(
    dosage_text AS text,
    STRUCT(
      STRUCT(
        dose_quantity AS value,
        dose_unit AS unit
      ) AS doseQuantity
    ) AS doseAndRate,
    STRUCT(route AS text, STRUCT(route_code AS code) AS coding) AS route,
    STRUCT(
      STRUCT(frequency_text AS text) AS code,
      STRUCT(
        frequency_period AS period,
        frequency_period_unit AS periodUnit,
        STRUCT(
          CAST(start_date AS STRING) AS start,
          CAST(end_date AS STRING) AS `end`
        ) AS boundsPeriod
      ) AS repeat
    ) AS timing,
    as_needed AS asNeededBoolean
  )]) AS dosageInstruction,
  TO_JSON(STRUCT(
    STRUCT(
      dispense_quantity AS value,
      dispense_unit AS unit
    ) AS quantity,
    refills_allowed AS numberOfRepeatsAllowed
  )) AS dispenseRequest,
  TO_JSON(STRUCT(
    substitution_allowed AS allowedBoolean
  )) AS substitution,
  CASE WHEN reason_code IS NOT NULL OR reason_text IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      STRUCT(reason_code AS code) AS coding,
      reason_text AS text
    )])
  END AS reasonCode,
  CASE WHEN clinical_note IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(clinical_note AS text)])
  END AS note
FROM `edm_health_record.medication`
WHERE entry_type = 'INSTRUCTION'
  AND status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_medication_statement (from MEDICATION where entry_type = 'ACTION')
-- FHIR Resource: MedicationStatement
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_medication_statement` AS
SELECT
  medication_id AS id,
  'MedicationStatement' AS resourceType,
  status,
  TO_JSON(STRUCT(
    ARRAY[STRUCT(
      medication_code AS code,
      medication_code_system AS system,
      medication_code_display AS display
    )] AS coding,
    medication_name AS text
  )) AS medicationCodeableConcept,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS subject,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', authored_on) AS dateAsserted,
  TO_JSON(ARRAY[STRUCT(
    dosage_text AS text,
    STRUCT(route AS text) AS route
  )]) AS dosage,
  CASE WHEN clinical_note IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(clinical_note AS text)])
  END AS note
FROM `edm_health_record.medication`
WHERE entry_type = 'ACTION'
  AND status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_observation_vital_signs (from VITAL_SIGN)
-- FHIR Resource: Observation (category: vital-signs)
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_observation_vital_signs` AS
SELECT
  vital_sign_id AS id,
  'Observation' AS resourceType,
  status,
  TO_JSON(ARRAY[STRUCT(
    ARRAY[STRUCT(
      'vital-signs' AS code,
      'http://terminology.hl7.org/CodeSystem/observation-category' AS system,
      'Vital Signs' AS display
    )] AS coding
  )]) AS category,
  TO_JSON(STRUCT(
    ARRAY[STRUCT(
      vital_code AS code,
      vital_code_system AS system,
      vital_code_display AS display
    )] AS coding,
    vital_type AS text
  )) AS code,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS subject,
  CASE WHEN encounter_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Encounter/', encounter_id) AS reference))
  END AS encounter,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', effective_datetime) AS effectiveDateTime,
  -- For non-BP vitals, use valueQuantity
  CASE WHEN vital_type != 'BLOOD_PRESSURE' AND value_quantity IS NOT NULL THEN
    TO_JSON(STRUCT(
      value_quantity AS value,
      value_unit AS unit,
      'http://unitsofmeasure.org' AS system
    ))
  END AS valueQuantity,
  -- For BP, use components
  CASE WHEN vital_type = 'BLOOD_PRESSURE' THEN
    TO_JSON(ARRAY[
      STRUCT(
        STRUCT(
          ARRAY[STRUCT('8480-6' AS code, 'http://loinc.org' AS system, 'Systolic blood pressure' AS display)] AS coding
        ) AS code,
        STRUCT(value_systolic AS value, 'mm[Hg]' AS unit, 'http://unitsofmeasure.org' AS system) AS valueQuantity
      ),
      STRUCT(
        STRUCT(
          ARRAY[STRUCT('8462-4' AS code, 'http://loinc.org' AS system, 'Diastolic blood pressure' AS display)] AS coding
        ) AS code,
        STRUCT(value_diastolic AS value, 'mm[Hg]' AS unit, 'http://unitsofmeasure.org' AS system) AS valueQuantity
      )
    ])
  END AS component,
  CASE WHEN interpretation IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      ARRAY[STRUCT(interpretation AS code)] AS coding
    )])
  END AS interpretation,
  CASE WHEN body_site IS NOT NULL THEN
    TO_JSON(STRUCT(
      ARRAY[STRUCT(body_site_code AS code, 'http://snomed.info/sct' AS system)] AS coding,
      body_site AS text
    ))
  END AS bodySite,
  CASE WHEN method IS NOT NULL THEN
    TO_JSON(STRUCT(method AS text))
  END AS method,
  CASE WHEN performer_id IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      CONCAT('Practitioner/', performer_id) AS reference,
      performer_name AS display
    )])
  END AS performer,
  CASE WHEN clinical_note IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(clinical_note AS text)])
  END AS note
FROM `edm_health_record.vital_sign`
WHERE status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_observation_lab (from LAB_RESULT)
-- FHIR Resource: Observation (category: laboratory)
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_observation_lab` AS
SELECT
  lab_result_id AS id,
  'Observation' AS resourceType,
  status,
  TO_JSON(ARRAY[STRUCT(
    ARRAY[STRUCT(
      'laboratory' AS code,
      'http://terminology.hl7.org/CodeSystem/observation-category' AS system,
      'Laboratory' AS display
    )] AS coding
  )]) AS category,
  TO_JSON(STRUCT(
    ARRAY[STRUCT(
      test_code AS code,
      test_code_system AS system,
      test_code_display AS display
    )] AS coding,
    test_name AS text
  )) AS code,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS subject,
  CASE WHEN encounter_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Encounter/', encounter_id) AS reference))
  END AS encounter,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', effective_datetime) AS effectiveDateTime,
  CASE WHEN issued IS NOT NULL THEN
    FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', issued)
  END AS issued,
  CASE WHEN value_quantity IS NOT NULL THEN
    TO_JSON(STRUCT(
      value_quantity AS value,
      value_unit AS unit,
      'http://unitsofmeasure.org' AS system
    ))
  END AS valueQuantity,
  value_string AS valueString,
  CASE WHEN value_codeable_concept IS NOT NULL THEN
    TO_JSON(STRUCT(
      ARRAY[STRUCT(value_codeable_concept AS code, value_codeable_system AS system)] AS coding
    ))
  END AS valueCodeableConcept,
  CASE WHEN reference_range_low IS NOT NULL OR reference_range_high IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      STRUCT(reference_range_low AS value) AS low,
      STRUCT(reference_range_high AS value) AS high,
      reference_range_text AS text
    )])
  END AS referenceRange,
  CASE WHEN interpretation IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      ARRAY[STRUCT(interpretation AS code)] AS coding
    )])
  END AS interpretation,
  CASE WHEN performing_lab IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      performing_lab AS display
    )])
  END AS performer,
  CASE WHEN clinical_note IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(clinical_note AS text)])
  END AS note
FROM `edm_health_record.lab_result`
WHERE status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_procedure (from PROCEDURE_RECORD)
-- FHIR Resource: Procedure
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_procedure` AS
SELECT
  procedure_record_id AS id,
  'Procedure' AS resourceType,
  status,
  CASE WHEN status_reason IS NOT NULL THEN
    TO_JSON(STRUCT(status_reason AS text))
  END AS statusReason,
  TO_JSON(STRUCT(
    ARRAY[STRUCT(
      procedure_code AS code,
      procedure_code_system AS system,
      procedure_code_display AS display
    )] AS coding,
    procedure_name AS text
  )) AS code,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS subject,
  CASE WHEN encounter_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Encounter/', encounter_id) AS reference))
  END AS encounter,
  CASE WHEN performed_datetime IS NOT NULL THEN
    FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', performed_datetime)
  END AS performedDateTime,
  CASE WHEN performed_period_start IS NOT NULL THEN
    TO_JSON(STRUCT(
      FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', performed_period_start) AS start,
      FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', performed_period_end) AS `end`
    ))
  END AS performedPeriod,
  CASE WHEN performer_id IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      STRUCT(performer_role AS text) AS function,
      STRUCT(
        CONCAT('Practitioner/', performer_id) AS reference,
        performer_name AS display
      ) AS actor
    )])
  END AS performer,
  CASE WHEN location_id IS NOT NULL THEN
    TO_JSON(STRUCT(
      CONCAT('Location/', location_id) AS reference,
      location_name AS display
    ))
  END AS location,
  CASE WHEN reason_code IS NOT NULL OR reason_text IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      STRUCT(reason_code AS code) AS coding,
      reason_text AS text
    )])
  END AS reasonCode,
  CASE WHEN body_site IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      ARRAY[STRUCT(body_site_code AS code, 'http://snomed.info/sct' AS system)] AS coding,
      body_site AS text
    )])
  END AS bodySite,
  CASE WHEN outcome IS NOT NULL THEN
    TO_JSON(STRUCT(outcome AS text))
  END AS outcome,
  CASE WHEN complication IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(complication AS text)])
  END AS complication,
  CASE WHEN clinical_note IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(clinical_note AS text)])
  END AS note
FROM `edm_health_record.procedure_record`
WHERE status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_immunization (from IMMUNIZATION)
-- FHIR Resource: Immunization
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_immunization` AS
SELECT
  immunization_id AS id,
  'Immunization' AS resourceType,
  status,
  CASE WHEN status_reason IS NOT NULL THEN
    TO_JSON(STRUCT(status_reason AS text))
  END AS statusReason,
  TO_JSON(STRUCT(
    ARRAY[STRUCT(
      vaccine_code AS code,
      vaccine_code_system AS system,
      vaccine_code_display AS display
    )] AS coding,
    vaccine_name AS text
  )) AS vaccineCode,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS patient,
  CASE WHEN encounter_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Encounter/', encounter_id) AS reference))
  END AS encounter,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', occurrence_datetime) AS occurrenceDateTime,
  CASE WHEN recorded_date IS NOT NULL THEN
    FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', recorded_date)
  END AS recorded,
  COALESCE(primary_source, true) AS primarySource,
  CASE WHEN report_origin IS NOT NULL THEN
    TO_JSON(STRUCT(report_origin AS text))
  END AS reportOrigin,
  lot_number AS lotNumber,
  CAST(expiration_date AS STRING) AS expirationDate,
  CASE WHEN site IS NOT NULL THEN
    TO_JSON(STRUCT(
      ARRAY[STRUCT(site_code AS code, 'http://snomed.info/sct' AS system)] AS coding,
      site AS text
    ))
  END AS site,
  CASE WHEN route IS NOT NULL THEN
    TO_JSON(STRUCT(
      ARRAY[STRUCT(route_code AS code, 'http://snomed.info/sct' AS system)] AS coding,
      route AS text
    ))
  END AS route,
  CASE WHEN dose_quantity IS NOT NULL THEN
    TO_JSON(STRUCT(
      dose_quantity AS value,
      dose_unit AS unit
    ))
  END AS doseQuantity,
  CASE WHEN performer_id IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      STRUCT(
        CONCAT('Practitioner/', performer_id) AS reference,
        performer_name AS display
      ) AS actor
    )])
  END AS performer,
  CASE WHEN clinical_note IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(clinical_note AS text)])
  END AS note
FROM `edm_health_record.immunization`
WHERE status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_encounter (from ENCOUNTER_RECORD)
-- FHIR Resource: Encounter
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_encounter` AS
SELECT
  encounter_id AS id,
  'Encounter' AS resourceType,
  status,
  TO_JSON(STRUCT(
    encounter_class AS code,
    'http://terminology.hl7.org/CodeSystem/v3-ActCode' AS system
  )) AS class,
  CASE WHEN encounter_type IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      ARRAY[STRUCT(encounter_type_code AS code)] AS coding,
      encounter_type AS text
    )])
  END AS type,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS subject,
  TO_JSON(STRUCT(
    FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', period_start) AS start,
    CASE WHEN period_end IS NOT NULL THEN
      FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', period_end)
    END AS `end`
  )) AS period,
  CASE WHEN length_minutes IS NOT NULL THEN
    TO_JSON(STRUCT(
      length_minutes AS value,
      'min' AS unit,
      'http://unitsofmeasure.org' AS system
    ))
  END AS length,
  CASE WHEN reason_code IS NOT NULL OR reason_text IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      STRUCT(reason_code AS code) AS coding,
      reason_text AS text
    )])
  END AS reasonCode,
  CASE WHEN location_id IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      STRUCT(
        CONCAT('Location/', location_id) AS reference,
        location_name AS display
      ) AS location
    )])
  END AS location,
  CASE WHEN service_provider_id IS NOT NULL THEN
    TO_JSON(STRUCT(
      CONCAT('Organization/', service_provider_id) AS reference
    ))
  END AS serviceProvider,
  CASE WHEN hospitalization_admit_source IS NOT NULL OR hospitalization_discharge_disposition IS NOT NULL THEN
    TO_JSON(STRUCT(
      STRUCT(hospitalization_admit_source AS text) AS admitSource,
      STRUCT(hospitalization_discharge_disposition AS text) AS dischargeDisposition
    ))
  END AS hospitalization
FROM `edm_health_record.encounter_record`
WHERE status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_document_reference (from CLINICAL_NOTE)
-- FHIR Resource: DocumentReference
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_document_reference` AS
SELECT
  clinical_note_id AS id,
  'DocumentReference' AS resourceType,
  document_status AS status,
  doc_status AS docStatus,
  TO_JSON(STRUCT(
    ARRAY[STRUCT(
      document_type_code AS code,
      'http://loinc.org' AS system
    )] AS coding,
    document_type AS text
  )) AS type,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS subject,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', created_datetime) AS date,
  CASE WHEN author_id IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      CONCAT('Practitioner/', author_id) AS reference,
      author_name AS display
    )])
  END AS author,
  title AS description,
  TO_JSON(ARRAY[STRUCT(
    STRUCT(
      content_format AS contentType,
      content_url AS url,
      content_size AS size,
      content_hash AS hash,
      title AS title
    ) AS attachment
  )]) AS content,
  CASE WHEN encounter_id IS NOT NULL THEN
    TO_JSON(STRUCT(
      ARRAY[STRUCT(CONCAT('Encounter/', encounter_id) AS reference)] AS encounter
    ))
  END AS context
FROM `edm_health_record.clinical_note`
WHERE document_status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_care_plan (from CARE_PLAN)
-- FHIR Resource: CarePlan
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_care_plan` AS
SELECT
  care_plan_id AS id,
  'CarePlan' AS resourceType,
  status,
  intent,
  TO_JSON(ARRAY[STRUCT(
    ARRAY[STRUCT('assess-plan' AS code)] AS coding,
    category AS text
  )]) AS category,
  plan_title AS title,
  plan_description AS description,
  TO_JSON(STRUCT(
    CONCAT('Patient/', member_id) AS reference
  )) AS subject,
  CASE WHEN encounter_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Encounter/', encounter_id) AS reference))
  END AS encounter,
  TO_JSON(STRUCT(
    CAST(period_start AS STRING) AS start,
    CAST(period_end AS STRING) AS `end`
  )) AS period,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', created_datetime) AS created,
  CASE WHEN author_id IS NOT NULL THEN
    TO_JSON(STRUCT(
      CONCAT('Practitioner/', author_id) AS reference,
      author_name AS display
    ))
  END AS author,
  addresses_conditions AS addresses,
  goals AS goal,
  activities AS activity,
  CASE WHEN clinical_note IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(clinical_note AS text)])
  END AS note
FROM `edm_health_record.care_plan`
WHERE status != 'entered-in-error';

-- ============================================================================
-- View: v_fhir_provenance (from HEALTH_RECORD_PROVENANCE)
-- FHIR Resource: Provenance
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_provenance` AS
SELECT
  provenance_id AS id,
  'Provenance' AS resourceType,
  TO_JSON(ARRAY[STRUCT(
    CONCAT(target_type, '/', target_id) AS reference
  )]) AS target,
  FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', recorded) AS recorded,
  CASE WHEN occurred_datetime IS NOT NULL THEN
    FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', occurred_datetime)
  END AS occurredDateTime,
  CASE WHEN activity IS NOT NULL THEN
    TO_JSON(STRUCT(
      ARRAY[STRUCT(activity_code AS code)] AS coding,
      activity AS text
    ))
  END AS activity,
  TO_JSON(ARRAY[STRUCT(
    STRUCT(
      ARRAY[STRUCT(agent_type AS code)] AS coding
    ) AS type,
    STRUCT(
      CONCAT('Practitioner/', agent_id) AS reference,
      agent_name AS display
    ) AS who,
    CASE WHEN on_behalf_of_id IS NOT NULL THEN
      STRUCT(CONCAT('Organization/', on_behalf_of_id) AS reference)
    END AS onBehalfOf
  )]) AS agent,
  CASE WHEN reason IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(reason AS text)])
  END AS reason,
  CASE WHEN location_id IS NOT NULL THEN
    TO_JSON(STRUCT(CONCAT('Location/', location_id) AS reference))
  END AS location,
  CASE WHEN policy IS NOT NULL THEN
    TO_JSON(ARRAY[policy])
  END AS policy,
  CASE WHEN signature IS NOT NULL THEN
    TO_JSON(ARRAY[STRUCT(
      ARRAY[STRUCT(signature_type AS code)] AS type,
      FORMAT_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', recorded) AS `when`,
      STRUCT(CONCAT('Practitioner/', agent_id) AS reference) AS who,
      signature AS data
    )])
  END AS signature
FROM `edm_health_record.health_record_provenance`;

-- ============================================================================
-- Composite View: Patient Summary Bundle
-- Creates a FHIR Bundle containing key health record data for a patient
-- ============================================================================
CREATE OR REPLACE VIEW `edm_health_record.v_fhir_patient_summary` AS
WITH patient_conditions AS (
  SELECT member_id, TO_JSON(ARRAY_AGG(STRUCT(
    'entry' AS type,
    STRUCT(id, resourceType, code, clinicalStatus, verificationStatus) AS resource
  ))) AS conditions
  FROM `edm_health_record.v_fhir_condition`
  WHERE clinical_status IN ('active', 'recurrence', 'relapse')
  GROUP BY member_id
),
patient_allergies AS (
  SELECT member_id, TO_JSON(ARRAY_AGG(STRUCT(
    'entry' AS type,
    STRUCT(id, resourceType, code, clinicalStatus, criticality) AS resource
  ))) AS allergies
  FROM `edm_health_record.v_fhir_allergy_intolerance`
  WHERE clinical_status = 'active'
  GROUP BY member_id
),
patient_medications AS (
  SELECT member_id, TO_JSON(ARRAY_AGG(STRUCT(
    'entry' AS type,
    STRUCT(id, resourceType, medicationCodeableConcept, status) AS resource
  ))) AS medications
  FROM `edm_health_record.v_fhir_medication_request`
  WHERE status = 'active'
  GROUP BY member_id
)
SELECT
  m.member_id,
  'Bundle' AS resourceType,
  'document' AS type,
  CURRENT_TIMESTAMP() AS timestamp,
  c.conditions,
  a.allergies,
  med.medications
FROM (SELECT DISTINCT member_id FROM `edm_health_record.problem`) m
LEFT JOIN patient_conditions c ON m.member_id = c.member_id
LEFT JOIN patient_allergies a ON m.member_id = a.member_id
LEFT JOIN patient_medications med ON m.member_id = med.member_id;
