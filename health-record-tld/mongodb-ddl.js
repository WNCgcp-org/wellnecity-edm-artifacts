/**
 * MongoDB DDL for HEALTH_RECORD TLD
 *
 * This script creates collections with JSON Schema validation for all entities
 * in the HEALTH_RECORD Top Level Domain implementing the hybrid openEHR + FHIR
 * architecture.
 *
 * Usage:
 *   mongosh < mongodb-ddl.js
 *   OR
 *   mongosh --eval "load('mongodb-ddl.js')"
 *
 * @version 1.0
 * @date 2026-01-26
 */

// ============================================================================
// DATABASE SETUP
// ============================================================================

use("wellnecity_edm");

// ============================================================================
// HEALTH_RECORD TLD - 12 Entities
// ============================================================================

// -----------------------------------------------------------------------------
// HEALTH_RECORD_COMPOSITION - Container grouping clinical entries
// openEHR: COMPOSITION | FHIR: Bundle/Composition
// -----------------------------------------------------------------------------
db.createCollection("health_record_composition", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "HEALTH_RECORD_COMPOSITION",
      description: "Container that groups related clinical entries following the openEHR COMPOSITION pattern",
      required: ["_id", "member_id", "employer_id", "archetype_id", "composition_type", "category", "context_start_time", "version_number", "is_current", "status", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (composition_id)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        employer_id: {
          bsonType: "binData",
          description: "FK to CORE.EMPLOYER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID (e.g., openEHR-EHR-COMPOSITION.encounter.v1)"
        },
        template_id: {
          bsonType: "string",
          maxLength: 255,
          description: "Template ID if using operational template"
        },
        composition_type: {
          bsonType: "string",
          enum: ["ENCOUNTER", "DISCHARGE_SUMMARY", "PROBLEM_LIST", "MEDICATION_LIST", "LAB_REPORT", "VITAL_SIGNS"],
          description: "Type of composition"
        },
        category: {
          bsonType: "string",
          enum: ["EVENT", "PERSISTENT", "EPISODIC"],
          description: "openEHR category"
        },
        context_start_time: {
          bsonType: "date",
          description: "Start time of clinical context"
        },
        context_end_time: {
          bsonType: "date",
          description: "End time of context"
        },
        context_setting: {
          bsonType: "string",
          maxLength: 100,
          description: "Care setting code (home, primary_care, emergency, inpatient)"
        },
        context_location: {
          bsonType: "string",
          maxLength: 255,
          description: "Location of care"
        },
        composer_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Author/composer identifier"
        },
        composer_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Author name"
        },
        language: {
          bsonType: "string",
          pattern: "^[a-z]{2}$",
          description: "Language code (ISO 639-1)"
        },
        territory: {
          bsonType: "string",
          pattern: "^[A-Z]{2}$",
          description: "Territory code (ISO 3166-1)"
        },
        version_number: {
          bsonType: "int",
          minimum: 1,
          description: "Version of this composition (starts at 1)"
        },
        is_current: {
          bsonType: "bool",
          description: "True if this is the current version"
        },
        preceding_version_id: {
          bsonType: "binData",
          description: "FK to previous version"
        },
        status: {
          bsonType: "string",
          enum: ["ACTIVE", "SUPERSEDED", "DELETED"],
          description: "Composition status"
        },
        fhir_bundle_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR Bundle identifier for mapping"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.health_record_composition.createIndex({ "member_id": 1 });
db.health_record_composition.createIndex({ "employer_id": 1 });
db.health_record_composition.createIndex({ "composition_type": 1 });
db.health_record_composition.createIndex({ "context_start_time": 1 });
db.health_record_composition.createIndex({ "status": 1 });
db.health_record_composition.createIndex({ "is_current": 1 });
db.health_record_composition.createIndex({ "fhir_bundle_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// PROBLEM - Diagnoses, health problems, and clinical conditions
// openEHR: EVALUATION.problem_diagnosis.v1 | FHIR: Condition
// -----------------------------------------------------------------------------
db.createCollection("problem", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PROBLEM",
      description: "Diagnoses, health problems, and clinical conditions",
      required: ["_id", "member_id", "archetype_id", "problem_name", "clinical_status", "recorded_date", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (problem_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (optional)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        problem_name: {
          bsonType: "string",
          maxLength: 500,
          description: "Problem/diagnosis name (text)"
        },
        problem_code: {
          bsonType: "string",
          maxLength: 20,
          description: "ICD-10-CM or SNOMED CT code"
        },
        problem_code_system: {
          bsonType: "string",
          maxLength: 100,
          description: "Code system URI (http://hl7.org/fhir/sid/icd-10-cm)"
        },
        problem_code_display: {
          bsonType: "string",
          maxLength: 500,
          description: "Code display text"
        },
        clinical_status: {
          bsonType: "string",
          enum: ["active", "recurrence", "relapse", "inactive", "remission", "resolved"],
          description: "Clinical status of the problem"
        },
        verification_status: {
          bsonType: "string",
          enum: ["unconfirmed", "provisional", "differential", "confirmed", "refuted", "entered-in-error"],
          description: "Verification status"
        },
        category: {
          bsonType: "string",
          enum: ["problem-list-item", "encounter-diagnosis", "health-concern"],
          description: "Problem category"
        },
        severity: {
          bsonType: "string",
          enum: ["mild", "moderate", "severe"],
          description: "Problem severity"
        },
        body_site: {
          bsonType: "string",
          maxLength: 255,
          description: "Anatomical location"
        },
        body_site_code: {
          bsonType: "string",
          maxLength: 20,
          description: "SNOMED body site code"
        },
        onset_date: {
          bsonType: "date",
          description: "Date of onset"
        },
        onset_age: {
          bsonType: "string",
          maxLength: 50,
          description: "Age at onset (e.g., '45 years')"
        },
        abatement_date: {
          bsonType: "date",
          description: "Date resolved/inactive"
        },
        recorded_date: {
          bsonType: "date",
          description: "When recorded in system"
        },
        recorder_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Who recorded (practitioner ID)"
        },
        asserter_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Who asserted the condition"
        },
        encounter_id: {
          bsonType: "binData",
          description: "FK to ENCOUNTER_RECORD"
        },
        clinical_note: {
          bsonType: "string",
          description: "Additional clinical notes"
        },
        fhir_condition_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR Condition identifier"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.problem.createIndex({ "member_id": 1 });
db.problem.createIndex({ "composition_id": 1 });
db.problem.createIndex({ "clinical_status": 1 });
db.problem.createIndex({ "problem_code": 1 });
db.problem.createIndex({ "recorded_date": 1 });
db.problem.createIndex({ "encounter_id": 1 });
db.problem.createIndex({ "fhir_condition_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// ALLERGY - Allergies, intolerances, and adverse reaction risks
// openEHR: EVALUATION.adverse_reaction_risk.v1 | FHIR: AllergyIntolerance
// -----------------------------------------------------------------------------
db.createCollection("allergy", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ALLERGY",
      description: "Allergies, intolerances, and adverse reaction risks",
      required: ["_id", "member_id", "archetype_id", "substance_name", "clinical_status", "recorded_date", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (allergy_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (optional)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        substance_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Causative agent name"
        },
        substance_code: {
          bsonType: "string",
          maxLength: 50,
          description: "RxNorm, SNOMED, or UNII code"
        },
        substance_code_system: {
          bsonType: "string",
          maxLength: 100,
          description: "Code system URI"
        },
        substance_code_display: {
          bsonType: "string",
          maxLength: 255,
          description: "Code display text"
        },
        category: {
          bsonType: "string",
          enum: ["food", "medication", "environment", "biologic"],
          description: "Allergy category"
        },
        allergy_type: {
          bsonType: "string",
          enum: ["allergy", "intolerance"],
          description: "Allergy vs intolerance"
        },
        criticality: {
          bsonType: "string",
          enum: ["low", "high", "unable-to-assess"],
          description: "Criticality assessment"
        },
        clinical_status: {
          bsonType: "string",
          enum: ["active", "inactive", "resolved"],
          description: "Clinical status"
        },
        verification_status: {
          bsonType: "string",
          enum: ["unconfirmed", "presumed", "confirmed", "refuted", "entered-in-error"],
          description: "Verification status"
        },
        onset_date: {
          bsonType: "date",
          description: "When allergy began"
        },
        recorded_date: {
          bsonType: "date",
          description: "When recorded in system"
        },
        recorder_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Who recorded"
        },
        asserter_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Who asserted"
        },
        last_occurrence: {
          bsonType: "date",
          description: "Date of last reaction"
        },
        reaction_manifestation: {
          bsonType: "array",
          description: "Array of manifestation codes/descriptions",
          items: {
            bsonType: "object",
            properties: {
              code: { bsonType: "string" },
              system: { bsonType: "string" },
              display: { bsonType: "string" },
              text: { bsonType: "string" }
            }
          }
        },
        reaction_severity: {
          bsonType: "string",
          enum: ["mild", "moderate", "severe"],
          description: "Reaction severity"
        },
        reaction_onset: {
          bsonType: "string",
          maxLength: 50,
          description: "Onset timing of reaction"
        },
        reaction_description: {
          bsonType: "string",
          description: "Narrative description of reaction"
        },
        reaction_exposure_route: {
          bsonType: "string",
          maxLength: 100,
          description: "Route of exposure"
        },
        clinical_note: {
          bsonType: "string",
          description: "Additional notes"
        },
        fhir_allergy_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR AllergyIntolerance identifier"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.allergy.createIndex({ "member_id": 1 });
db.allergy.createIndex({ "composition_id": 1 });
db.allergy.createIndex({ "clinical_status": 1 });
db.allergy.createIndex({ "substance_code": 1 });
db.allergy.createIndex({ "category": 1 });
db.allergy.createIndex({ "criticality": 1 });
db.allergy.createIndex({ "fhir_allergy_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// MEDICATION - Medication orders, prescriptions, and administration records
// openEHR: INSTRUCTION.medication_order.v3 | FHIR: MedicationRequest/Statement
// -----------------------------------------------------------------------------
db.createCollection("medication", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "MEDICATION",
      description: "Medication orders, prescriptions, and administration records",
      required: ["_id", "member_id", "archetype_id", "entry_type", "medication_name", "status", "authored_on", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (medication_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (optional)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        entry_type: {
          bsonType: "string",
          enum: ["INSTRUCTION", "ACTION"],
          description: "INSTRUCTION (order) or ACTION (administration)"
        },
        medication_name: {
          bsonType: "string",
          maxLength: 500,
          description: "Medication name (generic or brand)"
        },
        medication_code: {
          bsonType: "string",
          maxLength: 20,
          description: "NDC or RxNorm code"
        },
        medication_code_system: {
          bsonType: "string",
          maxLength: 100,
          description: "Code system URI"
        },
        medication_code_display: {
          bsonType: "string",
          maxLength: 500,
          description: "Code display text"
        },
        status: {
          bsonType: "string",
          enum: ["active", "completed", "cancelled", "stopped", "on-hold", "draft", "entered-in-error"],
          description: "Medication status"
        },
        intent: {
          bsonType: "string",
          enum: ["order", "plan", "proposal", "instance-order"],
          description: "Medication intent"
        },
        category: {
          bsonType: "string",
          enum: ["inpatient", "outpatient", "community", "discharge"],
          description: "Medication category"
        },
        dosage_text: {
          bsonType: "string",
          maxLength: 500,
          description: "Free-text dosage instructions"
        },
        dose_quantity: {
          bsonType: "decimal",
          description: "Dose amount"
        },
        dose_unit: {
          bsonType: "string",
          maxLength: 50,
          description: "Dose unit (mg, ml, tablet, etc.)"
        },
        route: {
          bsonType: "string",
          maxLength: 100,
          description: "Administration route (oral, IV, topical, etc.)"
        },
        route_code: {
          bsonType: "string",
          maxLength: 20,
          description: "SNOMED route code"
        },
        frequency_text: {
          bsonType: "string",
          maxLength: 100,
          description: "Frequency description (BID, TID, PRN)"
        },
        frequency_period: {
          bsonType: "decimal",
          description: "Frequency period value"
        },
        frequency_period_unit: {
          bsonType: "string",
          maxLength: 20,
          description: "Frequency period unit (h, d, wk)"
        },
        as_needed: {
          bsonType: "bool",
          description: "PRN flag"
        },
        as_needed_reason: {
          bsonType: "string",
          maxLength: 255,
          description: "PRN reason"
        },
        start_date: {
          bsonType: "date",
          description: "Medication start date"
        },
        end_date: {
          bsonType: "date",
          description: "Medication end date"
        },
        authored_on: {
          bsonType: "date",
          description: "When prescribed/ordered"
        },
        prescriber_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Prescriber NPI or identifier"
        },
        prescriber_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Prescriber name"
        },
        dispense_quantity: {
          bsonType: "decimal",
          description: "Quantity to dispense"
        },
        dispense_unit: {
          bsonType: "string",
          maxLength: 50,
          description: "Dispense unit"
        },
        refills_allowed: {
          bsonType: "int",
          description: "Number of refills"
        },
        substitution_allowed: {
          bsonType: "bool",
          description: "Generic substitution allowed"
        },
        reason_code: {
          bsonType: "string",
          maxLength: 20,
          description: "Reason for medication (ICD-10)"
        },
        reason_text: {
          bsonType: "string",
          maxLength: 500,
          description: "Reason description"
        },
        clinical_note: {
          bsonType: "string",
          description: "Additional notes"
        },
        fhir_medication_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR MedicationRequest identifier"
        },
        rx_claim_id: {
          bsonType: "binData",
          description: "FK to CLAIMS.RX_CLAIM"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.medication.createIndex({ "member_id": 1 });
db.medication.createIndex({ "composition_id": 1 });
db.medication.createIndex({ "status": 1 });
db.medication.createIndex({ "medication_code": 1 });
db.medication.createIndex({ "entry_type": 1 });
db.medication.createIndex({ "authored_on": 1 });
db.medication.createIndex({ "rx_claim_id": 1 });
db.medication.createIndex({ "fhir_medication_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// VITAL_SIGN - Vital sign observations
// openEHR: OBSERVATION.* (vitals) | FHIR: Observation (vital-signs)
// -----------------------------------------------------------------------------
db.createCollection("vital_sign", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "VITAL_SIGN",
      description: "Vital sign observations (BP, pulse, temperature, etc.)",
      required: ["_id", "member_id", "archetype_id", "vital_type", "status", "effective_datetime", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (vital_sign_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (optional)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        vital_type: {
          bsonType: "string",
          enum: ["BLOOD_PRESSURE", "PULSE", "TEMPERATURE", "RESPIRATORY_RATE", "OXYGEN_SATURATION", "HEIGHT", "WEIGHT", "BMI"],
          description: "Type of vital sign"
        },
        vital_code: {
          bsonType: "string",
          maxLength: 20,
          description: "LOINC code"
        },
        vital_code_system: {
          bsonType: "string",
          maxLength: 100,
          description: "Code system (http://loinc.org)"
        },
        vital_code_display: {
          bsonType: "string",
          maxLength: 255,
          description: "Code display text"
        },
        status: {
          bsonType: "string",
          enum: ["registered", "preliminary", "final", "amended", "corrected", "cancelled", "entered-in-error"],
          description: "Observation status"
        },
        effective_datetime: {
          bsonType: "date",
          description: "When measured"
        },
        value_quantity: {
          bsonType: "decimal",
          description: "Primary numeric value"
        },
        value_unit: {
          bsonType: "string",
          maxLength: 30,
          description: "Unit of measure"
        },
        value_systolic: {
          bsonType: "decimal",
          description: "Systolic BP (mmHg)"
        },
        value_diastolic: {
          bsonType: "decimal",
          description: "Diastolic BP (mmHg)"
        },
        value_text: {
          bsonType: "string",
          maxLength: 255,
          description: "Text value if non-numeric"
        },
        interpretation: {
          bsonType: "string",
          maxLength: 50,
          description: "N (normal), H (high), L (low), HH, LL, etc."
        },
        body_site: {
          bsonType: "string",
          maxLength: 100,
          description: "Body site of measurement"
        },
        body_site_code: {
          bsonType: "string",
          maxLength: 20,
          description: "SNOMED body site code"
        },
        method: {
          bsonType: "string",
          maxLength: 100,
          description: "Method of measurement"
        },
        device: {
          bsonType: "string",
          maxLength: 255,
          description: "Device used"
        },
        performer_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Who performed measurement"
        },
        performer_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Performer name"
        },
        encounter_id: {
          bsonType: "binData",
          description: "FK to ENCOUNTER_RECORD"
        },
        clinical_note: {
          bsonType: "string",
          description: "Additional notes"
        },
        fhir_observation_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR Observation identifier"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.vital_sign.createIndex({ "member_id": 1 });
db.vital_sign.createIndex({ "composition_id": 1 });
db.vital_sign.createIndex({ "vital_type": 1 });
db.vital_sign.createIndex({ "effective_datetime": 1 });
db.vital_sign.createIndex({ "status": 1 });
db.vital_sign.createIndex({ "encounter_id": 1 });
db.vital_sign.createIndex({ "fhir_observation_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// LAB_RESULT - Laboratory test results
// openEHR: OBSERVATION.laboratory_test_result.v1 | FHIR: Observation (laboratory)
// -----------------------------------------------------------------------------
db.createCollection("lab_result", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "LAB_RESULT",
      description: "Laboratory test results and diagnostic observations",
      required: ["_id", "member_id", "archetype_id", "test_name", "status", "effective_datetime", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (lab_result_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (optional)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        diagnostic_report_id: {
          bsonType: "binData",
          description: "Parent DiagnosticReport (for panel results)"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        test_name: {
          bsonType: "string",
          maxLength: 500,
          description: "Test name"
        },
        test_code: {
          bsonType: "string",
          maxLength: 20,
          description: "LOINC code"
        },
        test_code_system: {
          bsonType: "string",
          maxLength: 100,
          description: "Code system URI"
        },
        test_code_display: {
          bsonType: "string",
          maxLength: 500,
          description: "Code display text"
        },
        category: {
          bsonType: "string",
          maxLength: 50,
          description: "Laboratory category (chemistry, hematology, etc.)"
        },
        status: {
          bsonType: "string",
          enum: ["registered", "preliminary", "final", "amended", "corrected", "cancelled", "entered-in-error"],
          description: "Result status"
        },
        effective_datetime: {
          bsonType: "date",
          description: "Specimen collection time"
        },
        issued: {
          bsonType: "date",
          description: "Result issue time"
        },
        value_quantity: {
          bsonType: "decimal",
          description: "Numeric result value"
        },
        value_unit: {
          bsonType: "string",
          maxLength: 50,
          description: "Result unit"
        },
        value_string: {
          bsonType: "string",
          maxLength: 1000,
          description: "String result"
        },
        value_codeable_concept: {
          bsonType: "string",
          maxLength: 100,
          description: "Coded result"
        },
        value_codeable_system: {
          bsonType: "string",
          maxLength: 100,
          description: "Coded result system"
        },
        reference_range_low: {
          bsonType: "decimal",
          description: "Low normal value"
        },
        reference_range_high: {
          bsonType: "decimal",
          description: "High normal value"
        },
        reference_range_text: {
          bsonType: "string",
          maxLength: 255,
          description: "Reference range as text"
        },
        interpretation: {
          bsonType: "string",
          maxLength: 50,
          description: "N, H, L, HH, LL, A (abnormal), AA, etc."
        },
        specimen_type: {
          bsonType: "string",
          maxLength: 100,
          description: "Specimen type (blood, urine, etc.)"
        },
        specimen_code: {
          bsonType: "string",
          maxLength: 20,
          description: "SNOMED specimen code"
        },
        performing_lab: {
          bsonType: "string",
          maxLength: 255,
          description: "Performing laboratory name"
        },
        performing_lab_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Lab identifier (CLIA, etc.)"
        },
        ordering_provider_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Ordering provider NPI"
        },
        encounter_id: {
          bsonType: "binData",
          description: "FK to ENCOUNTER_RECORD"
        },
        clinical_note: {
          bsonType: "string",
          description: "Comments/notes"
        },
        fhir_observation_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR Observation identifier"
        },
        medical_claim_id: {
          bsonType: "binData",
          description: "FK to CLAIMS.MEDICAL_CLAIM"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.lab_result.createIndex({ "member_id": 1 });
db.lab_result.createIndex({ "composition_id": 1 });
db.lab_result.createIndex({ "test_code": 1 });
db.lab_result.createIndex({ "effective_datetime": 1 });
db.lab_result.createIndex({ "status": 1 });
db.lab_result.createIndex({ "diagnostic_report_id": 1 });
db.lab_result.createIndex({ "encounter_id": 1 });
db.lab_result.createIndex({ "medical_claim_id": 1 });
db.lab_result.createIndex({ "fhir_observation_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// PROCEDURE_RECORD - Clinical procedures
// openEHR: ACTION.procedure.v1 | FHIR: Procedure
// -----------------------------------------------------------------------------
db.createCollection("procedure_record", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PROCEDURE_RECORD",
      description: "Clinical procedures performed on the patient",
      required: ["_id", "member_id", "archetype_id", "procedure_name", "status", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (procedure_record_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (optional)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        procedure_name: {
          bsonType: "string",
          maxLength: 500,
          description: "Procedure name"
        },
        procedure_code: {
          bsonType: "string",
          maxLength: 20,
          description: "CPT, SNOMED, or ICD-10-PCS code"
        },
        procedure_code_system: {
          bsonType: "string",
          maxLength: 100,
          description: "Code system URI"
        },
        procedure_code_display: {
          bsonType: "string",
          maxLength: 500,
          description: "Code display text"
        },
        status: {
          bsonType: "string",
          enum: ["preparation", "in-progress", "not-done", "on-hold", "stopped", "completed", "entered-in-error", "unknown"],
          description: "Procedure status"
        },
        status_reason: {
          bsonType: "string",
          maxLength: 255,
          description: "Reason for status (especially if not-done)"
        },
        category: {
          bsonType: "string",
          maxLength: 50,
          description: "Procedure category"
        },
        performed_datetime: {
          bsonType: "date",
          description: "When performed (point in time)"
        },
        performed_period_start: {
          bsonType: "date",
          description: "Start of procedure"
        },
        performed_period_end: {
          bsonType: "date",
          description: "End of procedure"
        },
        body_site: {
          bsonType: "string",
          maxLength: 255,
          description: "Body site"
        },
        body_site_code: {
          bsonType: "string",
          maxLength: 20,
          description: "SNOMED body site code"
        },
        laterality: {
          bsonType: "string",
          enum: ["left", "right", "bilateral"],
          description: "Laterality"
        },
        performer_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Primary performer NPI"
        },
        performer_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Performer name"
        },
        performer_role: {
          bsonType: "string",
          maxLength: 100,
          description: "Performer role (surgeon, assistant, etc.)"
        },
        location_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Where performed"
        },
        location_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Location name"
        },
        encounter_id: {
          bsonType: "binData",
          description: "FK to ENCOUNTER_RECORD"
        },
        reason_code: {
          bsonType: "string",
          maxLength: 20,
          description: "Reason code (ICD-10)"
        },
        reason_text: {
          bsonType: "string",
          maxLength: 500,
          description: "Reason description"
        },
        outcome: {
          bsonType: "string",
          maxLength: 255,
          description: "Procedure outcome"
        },
        complication: {
          bsonType: "string",
          maxLength: 500,
          description: "Complications"
        },
        clinical_note: {
          bsonType: "string",
          description: "Additional notes"
        },
        fhir_procedure_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR Procedure identifier"
        },
        medical_claim_id: {
          bsonType: "binData",
          description: "FK to CLAIMS.MEDICAL_CLAIM"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.procedure_record.createIndex({ "member_id": 1 });
db.procedure_record.createIndex({ "composition_id": 1 });
db.procedure_record.createIndex({ "procedure_code": 1 });
db.procedure_record.createIndex({ "performed_datetime": 1 });
db.procedure_record.createIndex({ "status": 1 });
db.procedure_record.createIndex({ "encounter_id": 1 });
db.procedure_record.createIndex({ "medical_claim_id": 1 });
db.procedure_record.createIndex({ "fhir_procedure_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// IMMUNIZATION - Vaccination records
// openEHR: ACTION.immunisation.v1 | FHIR: Immunization
// -----------------------------------------------------------------------------
db.createCollection("immunization", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "IMMUNIZATION",
      description: "Vaccination and immunization records",
      required: ["_id", "member_id", "archetype_id", "vaccine_name", "status", "occurrence_datetime", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (immunization_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (optional)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        vaccine_name: {
          bsonType: "string",
          maxLength: 500,
          description: "Vaccine product name"
        },
        vaccine_code: {
          bsonType: "string",
          maxLength: 20,
          description: "CVX code"
        },
        vaccine_code_system: {
          bsonType: "string",
          maxLength: 100,
          description: "Code system (http://hl7.org/fhir/sid/cvx)"
        },
        vaccine_code_display: {
          bsonType: "string",
          maxLength: 500,
          description: "Code display text"
        },
        status: {
          bsonType: "string",
          enum: ["completed", "entered-in-error", "not-done"],
          description: "Immunization status"
        },
        status_reason: {
          bsonType: "string",
          maxLength: 255,
          description: "Reason if not-done"
        },
        occurrence_datetime: {
          bsonType: "date",
          description: "When administered"
        },
        recorded_date: {
          bsonType: "date",
          description: "When recorded in system"
        },
        primary_source: {
          bsonType: "bool",
          description: "True if from administering provider"
        },
        report_origin: {
          bsonType: "string",
          maxLength: 100,
          description: "Source of reported immunization"
        },
        lot_number: {
          bsonType: "string",
          maxLength: 50,
          description: "Vaccine lot number"
        },
        expiration_date: {
          bsonType: "date",
          description: "Vaccine expiration date"
        },
        site: {
          bsonType: "string",
          maxLength: 100,
          description: "Body site of administration"
        },
        site_code: {
          bsonType: "string",
          maxLength: 20,
          description: "SNOMED site code"
        },
        route: {
          bsonType: "string",
          maxLength: 100,
          description: "Administration route"
        },
        route_code: {
          bsonType: "string",
          maxLength: 20,
          description: "SNOMED route code"
        },
        dose_quantity: {
          bsonType: "decimal",
          description: "Dose amount"
        },
        dose_unit: {
          bsonType: "string",
          maxLength: 50,
          description: "Dose unit"
        },
        performer_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Administering provider"
        },
        performer_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Provider name"
        },
        location_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Administration location"
        },
        encounter_id: {
          bsonType: "binData",
          description: "FK to ENCOUNTER_RECORD"
        },
        clinical_note: {
          bsonType: "string",
          description: "Additional notes"
        },
        fhir_immunization_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR Immunization identifier"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.immunization.createIndex({ "member_id": 1 });
db.immunization.createIndex({ "composition_id": 1 });
db.immunization.createIndex({ "vaccine_code": 1 });
db.immunization.createIndex({ "occurrence_datetime": 1 });
db.immunization.createIndex({ "status": 1 });
db.immunization.createIndex({ "encounter_id": 1 });
db.immunization.createIndex({ "fhir_immunization_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// CLINICAL_NOTE - Clinical narratives and documentation
// openEHR: COMPOSITION.report.v1 | FHIR: DocumentReference
// -----------------------------------------------------------------------------
db.createCollection("clinical_note", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "CLINICAL_NOTE",
      description: "Clinical narratives, summaries, and documentation",
      required: ["_id", "member_id", "archetype_id", "document_type", "document_status", "created_datetime", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (clinical_note_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (optional)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        document_type: {
          bsonType: "string",
          enum: ["progress_note", "discharge_summary", "consultation", "history_physical", "procedure_note", "operative_note", "radiology_report", "pathology_report", "other"],
          description: "Type of clinical document"
        },
        document_type_code: {
          bsonType: "string",
          maxLength: 20,
          description: "LOINC document type code"
        },
        document_status: {
          bsonType: "string",
          enum: ["current", "superseded", "entered-in-error"],
          description: "Document status"
        },
        doc_status: {
          bsonType: "string",
          enum: ["preliminary", "final", "amended", "corrected"],
          description: "Composition status"
        },
        title: {
          bsonType: "string",
          maxLength: 500,
          description: "Document title"
        },
        content_text: {
          bsonType: "string",
          description: "Plain text content"
        },
        content_format: {
          bsonType: "string",
          enum: ["text/plain", "text/html", "application/pdf"],
          description: "Content format"
        },
        content_url: {
          bsonType: "string",
          maxLength: 1000,
          description: "URL to document content"
        },
        content_size: {
          bsonType: "int",
          description: "Content size in bytes"
        },
        content_hash: {
          bsonType: "string",
          maxLength: 64,
          description: "SHA-256 hash of content"
        },
        created_datetime: {
          bsonType: "date",
          description: "When document was created"
        },
        author_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Author identifier"
        },
        author_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Author name"
        },
        authenticator_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Authenticator/signer"
        },
        custodian_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Custodian organization"
        },
        encounter_id: {
          bsonType: "binData",
          description: "FK to ENCOUNTER_RECORD"
        },
        clinical_context: {
          bsonType: "string",
          maxLength: 255,
          description: "Clinical context"
        },
        fhir_document_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR DocumentReference identifier"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.clinical_note.createIndex({ "member_id": 1 });
db.clinical_note.createIndex({ "composition_id": 1 });
db.clinical_note.createIndex({ "document_type": 1 });
db.clinical_note.createIndex({ "created_datetime": 1 });
db.clinical_note.createIndex({ "document_status": 1 });
db.clinical_note.createIndex({ "encounter_id": 1 });
db.clinical_note.createIndex({ "fhir_document_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// CARE_PLAN - Care plans, treatment plans, and goals
// openEHR: INSTRUCTION.care_plan.v1 | FHIR: CarePlan
// -----------------------------------------------------------------------------
db.createCollection("care_plan", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "CARE_PLAN",
      description: "Care plans, treatment plans, and goals",
      required: ["_id", "member_id", "archetype_id", "plan_title", "status", "intent", "created_datetime", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (care_plan_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (optional)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        plan_title: {
          bsonType: "string",
          maxLength: 500,
          description: "Care plan title"
        },
        plan_description: {
          bsonType: "string",
          description: "Plan description"
        },
        status: {
          bsonType: "string",
          enum: ["draft", "active", "on-hold", "revoked", "completed", "entered-in-error", "unknown"],
          description: "Care plan status"
        },
        intent: {
          bsonType: "string",
          enum: ["proposal", "plan", "order", "option"],
          description: "Care plan intent"
        },
        category: {
          bsonType: "string",
          maxLength: 50,
          description: "assess-plan, discharge, longitudinal, etc."
        },
        period_start: {
          bsonType: "date",
          description: "Plan start date"
        },
        period_end: {
          bsonType: "date",
          description: "Plan end date"
        },
        created_datetime: {
          bsonType: "date",
          description: "When plan was created"
        },
        author_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Author identifier"
        },
        author_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Author name"
        },
        contributor_ids: {
          bsonType: "array",
          description: "Array of contributor identifiers",
          items: {
            bsonType: "string"
          }
        },
        addresses_conditions: {
          bsonType: "array",
          description: "Array of condition IDs this plan addresses",
          items: {
            bsonType: "binData"
          }
        },
        goals: {
          bsonType: "array",
          description: "Array of goal descriptions",
          items: {
            bsonType: "object",
            properties: {
              description: { bsonType: "string" },
              target_date: { bsonType: "date" },
              status: { bsonType: "string" }
            }
          }
        },
        activities: {
          bsonType: "array",
          description: "Array of planned activities",
          items: {
            bsonType: "object",
            properties: {
              description: { bsonType: "string" },
              status: { bsonType: "string" },
              scheduled_date: { bsonType: "date" }
            }
          }
        },
        encounter_id: {
          bsonType: "binData",
          description: "FK to ENCOUNTER_RECORD"
        },
        clinical_note: {
          bsonType: "string",
          description: "Additional notes"
        },
        fhir_careplan_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR CarePlan identifier"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.care_plan.createIndex({ "member_id": 1 });
db.care_plan.createIndex({ "composition_id": 1 });
db.care_plan.createIndex({ "status": 1 });
db.care_plan.createIndex({ "period_start": 1, "period_end": 1 });
db.care_plan.createIndex({ "encounter_id": 1 });
db.care_plan.createIndex({ "fhir_careplan_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// ENCOUNTER_RECORD - Clinical encounters and visits
// openEHR: COMPOSITION.encounter.v1 | FHIR: Encounter
// -----------------------------------------------------------------------------
db.createCollection("encounter_record", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ENCOUNTER_RECORD",
      description: "Clinical encounters, visits, and admissions",
      required: ["_id", "member_id", "archetype_id", "encounter_class", "status", "period_start", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (encounter_id)"
        },
        composition_id: {
          bsonType: "binData",
          description: "FK to HEALTH_RECORD_COMPOSITION (if exists)"
        },
        member_id: {
          bsonType: "binData",
          description: "FK to CORE.MEMBER"
        },
        archetype_id: {
          bsonType: "string",
          maxLength: 255,
          description: "openEHR archetype ID"
        },
        encounter_class: {
          bsonType: "string",
          enum: ["ambulatory", "emergency", "field", "home", "inpatient", "short-stay", "virtual"],
          description: "Class of encounter"
        },
        encounter_class_code: {
          bsonType: "string",
          maxLength: 20,
          description: "ActCode system code"
        },
        encounter_type: {
          bsonType: "string",
          maxLength: 100,
          description: "Specific encounter type"
        },
        encounter_type_code: {
          bsonType: "string",
          maxLength: 20,
          description: "SNOMED encounter type code"
        },
        status: {
          bsonType: "string",
          enum: ["planned", "arrived", "triaged", "in-progress", "onleave", "finished", "cancelled", "entered-in-error", "unknown"],
          description: "Encounter status"
        },
        priority: {
          bsonType: "string",
          maxLength: 30,
          description: "Urgency level"
        },
        period_start: {
          bsonType: "date",
          description: "Encounter start time"
        },
        period_end: {
          bsonType: "date",
          description: "Encounter end time"
        },
        length_minutes: {
          bsonType: "int",
          description: "Duration in minutes"
        },
        reason_code: {
          bsonType: "string",
          maxLength: 20,
          description: "Reason for visit (ICD-10)"
        },
        reason_text: {
          bsonType: "string",
          maxLength: 500,
          description: "Reason description"
        },
        admission_source: {
          bsonType: "string",
          maxLength: 100,
          description: "Where patient came from"
        },
        discharge_disposition: {
          bsonType: "string",
          maxLength: 100,
          description: "Discharge disposition"
        },
        participant_ids: {
          bsonType: "array",
          description: "Array of participant identifiers",
          items: {
            bsonType: "object",
            properties: {
              id: { bsonType: "string" },
              role: { bsonType: "string" },
              name: { bsonType: "string" }
            }
          }
        },
        location_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Facility/location ID"
        },
        location_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Location name"
        },
        service_provider_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Service provider organization"
        },
        diagnosis_ids: {
          bsonType: "array",
          description: "Array of diagnosis/problem IDs",
          items: {
            bsonType: "binData"
          }
        },
        hospitalization_admit_source: {
          bsonType: "string",
          maxLength: 100,
          description: "Admit source for inpatient"
        },
        hospitalization_discharge_disposition: {
          bsonType: "string",
          maxLength: 100,
          description: "Discharge status"
        },
        clinical_admission_id: {
          bsonType: "binData",
          description: "FK to CLINICAL.ADMISSION"
        },
        fhir_encounter_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR Encounter identifier"
        },
        source: {
          bsonType: "string",
          maxLength: 50,
          description: "Source system"
        },
        source_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Source record ID"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Last update timestamp"
        }
      }
    }
  }
});

db.encounter_record.createIndex({ "member_id": 1 });
db.encounter_record.createIndex({ "composition_id": 1 });
db.encounter_record.createIndex({ "encounter_class": 1 });
db.encounter_record.createIndex({ "status": 1 });
db.encounter_record.createIndex({ "period_start": 1, "period_end": 1 });
db.encounter_record.createIndex({ "clinical_admission_id": 1 });
db.encounter_record.createIndex({ "fhir_encounter_id": 1 }, { sparse: true });

// -----------------------------------------------------------------------------
// HEALTH_RECORD_PROVENANCE - Audit trail and data lineage
// openEHR: AUDIT_DETAILS | FHIR: Provenance
// -----------------------------------------------------------------------------
db.createCollection("health_record_provenance", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "HEALTH_RECORD_PROVENANCE",
      description: "Audit trail and data lineage tracking for all health record changes",
      required: ["_id", "target_type", "target_id", "recorded", "activity", "agent_type", "agent_id", "created_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key (provenance_id)"
        },
        target_type: {
          bsonType: "string",
          enum: ["HEALTH_RECORD_COMPOSITION", "PROBLEM", "ALLERGY", "MEDICATION", "VITAL_SIGN", "LAB_RESULT", "PROCEDURE_RECORD", "IMMUNIZATION", "CLINICAL_NOTE", "CARE_PLAN", "ENCOUNTER_RECORD"],
          description: "Target entity type"
        },
        target_id: {
          bsonType: "binData",
          description: "Target entity ID"
        },
        recorded: {
          bsonType: "date",
          description: "When provenance was recorded"
        },
        occurred_datetime: {
          bsonType: "date",
          description: "When the activity occurred"
        },
        activity: {
          bsonType: "string",
          enum: ["CREATE", "UPDATE", "DELETE", "VERIFY", "SIGN"],
          description: "Activity type"
        },
        activity_code: {
          bsonType: "string",
          maxLength: 20,
          description: "Provenance activity code"
        },
        reason: {
          bsonType: "string",
          maxLength: 500,
          description: "Reason for activity"
        },
        agent_type: {
          bsonType: "string",
          enum: ["author", "informant", "verifier", "enterer", "performer", "custodian"],
          description: "Agent type"
        },
        agent_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Agent identifier (user ID, system ID)"
        },
        agent_name: {
          bsonType: "string",
          maxLength: 255,
          description: "Agent name"
        },
        agent_role: {
          bsonType: "string",
          maxLength: 100,
          description: "Agent role"
        },
        on_behalf_of_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Acting on behalf of (organization)"
        },
        location_id: {
          bsonType: "string",
          maxLength: 100,
          description: "Location of activity"
        },
        signature: {
          bsonType: "string",
          description: "Digital signature (if signed)"
        },
        signature_type: {
          bsonType: "string",
          maxLength: 50,
          description: "Signature type"
        },
        policy: {
          bsonType: "string",
          maxLength: 500,
          description: "Policy/consent reference"
        },
        fhir_provenance_id: {
          bsonType: "string",
          maxLength: 100,
          description: "FHIR Provenance identifier"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        }
      }
    }
  }
});

db.health_record_provenance.createIndex({ "target_type": 1, "target_id": 1 });
db.health_record_provenance.createIndex({ "recorded": 1 });
db.health_record_provenance.createIndex({ "agent_id": 1 });
db.health_record_provenance.createIndex({ "activity": 1 });
db.health_record_provenance.createIndex({ "fhir_provenance_id": 1 }, { sparse: true });

// ============================================================================
// SUMMARY
// ============================================================================

print("\n============================================================================");
print("MongoDB DDL Execution Complete - HEALTH_RECORD TLD");
print("============================================================================");
print("\nCollections created:");
print("  1.  health_record_composition  (24 fields) - openEHR COMPOSITION / FHIR Bundle");
print("  2.  problem                    (26 fields) - openEHR EVALUATION.problem_diagnosis / FHIR Condition");
print("  3.  allergy                    (28 fields) - openEHR EVALUATION.adverse_reaction_risk / FHIR AllergyIntolerance");
print("  4.  medication                 (35 fields) - openEHR INSTRUCTION.medication_order / FHIR MedicationRequest");
print("  5.  vital_sign                 (26 fields) - openEHR OBSERVATION.* / FHIR Observation (vital-signs)");
print("  6.  lab_result                 (30 fields) - openEHR OBSERVATION.laboratory_test_result / FHIR Observation (lab)");
print("  7.  procedure_record           (28 fields) - openEHR ACTION.procedure / FHIR Procedure");
print("  8.  immunization               (26 fields) - openEHR ACTION.immunisation / FHIR Immunization");
print("  9.  clinical_note              (22 fields) - openEHR COMPOSITION.report / FHIR DocumentReference");
print("  10. care_plan                  (24 fields) - openEHR INSTRUCTION.care_plan / FHIR CarePlan");
print("  11. encounter_record           (28 fields) - openEHR COMPOSITION.encounter / FHIR Encounter");
print("  12. health_record_provenance   (18 fields) - openEHR AUDIT_DETAILS / FHIR Provenance");
print("\nTotal: 12 collections, ~315 fields");
print("============================================================================\n");
