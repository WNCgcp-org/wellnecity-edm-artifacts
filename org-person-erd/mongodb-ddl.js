/**
 * MongoDB DDL for Wellnecity Enterprise Data Model
 *
 * This script creates collections with JSON Schema validation for all entities
 * defined in the ORG/PERSON Entity Relationship Diagram.
 *
 * Usage:
 *   mongosh < mongodb-ddl.js
 *   OR
 *   mongosh --eval "load('mongodb-ddl.js')"
 *
 * @version 0.5
 * @date 2026-01-26
 */

// ============================================================================
// DATABASE SETUP
// ============================================================================

// Switch to the wellnecity database
use("wellnecity_edm");

// ============================================================================
// ORGANIZATION DOMAIN
// ============================================================================

// -----------------------------------------------------------------------------
// ORG - Base entity for all business organizations
// -----------------------------------------------------------------------------
db.createCollection("org", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ORG",
      description: "Base entity for all business organizations (employers, clients, vendors, brokers, carriers, health plan sponsors, provider organizations)",
      required: ["_id", "name", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        name: {
          bsonType: "string",
          description: "Organization display name"
        },
        legal_name: {
          bsonType: "string",
          description: "Legal/registered name of the organization"
        },
        website: {
          bsonType: "string",
          description: "Organization website URL"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the organization is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.org.createIndex({ "name": 1 });
db.org.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// ORG_IDENTIFIER - Identifier for an ORG (Tax ID, FEIN, NPI, etc.)
// -----------------------------------------------------------------------------
db.createCollection("org_identifier", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ORG_IDENTIFIER",
      description: "Identifier for an ORG (Tax ID, FEIN, NPI, NAIC, DUNS, etc.) with usability status",
      required: ["_id", "org_id", "identifier_type", "identifier_value", "usability_status", "usability_status_date", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_id: {
          bsonType: "binData",
          description: "FK to ORG"
        },
        identifier_type: {
          bsonType: "string",
          enum: ["TAX_ID", "FEIN", "NPI", "NAIC", "DUNS", "LEI", "OTHER"],
          description: "Type of identifier"
        },
        identifier_value: {
          bsonType: "string",
          description: "The identifier value"
        },
        issuing_authority: {
          bsonType: "string",
          description: "Organization or system that issued the ID"
        },
        issue_date: {
          bsonType: "date",
          description: "Date the identifier was issued"
        },
        expiration_date: {
          bsonType: "date",
          description: "Date the identifier expires"
        },
        usability_status: {
          bsonType: "string",
          enum: ["ACTIVE", "INACTIVE", "ARCHIVED", "KNOWN_ERROR"],
          description: "Usability status of the identifier"
        },
        usability_status_date: {
          bsonType: "date",
          description: "Date the usability status was set"
        },
        is_primary: {
          bsonType: "bool",
          description: "Whether this is the primary identifier of its type"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.org_identifier.createIndex({ "org_id": 1 });
db.org_identifier.createIndex({ "org_id": 1, "identifier_type": 1 });
db.org_identifier.createIndex({ "identifier_type": 1, "identifier_value": 1 });
db.org_identifier.createIndex({ "usability_status": 1 });

// -----------------------------------------------------------------------------
// ORG_CONTACT - Contact information for an ORG
// -----------------------------------------------------------------------------
db.createCollection("org_contact", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ORG_CONTACT",
      description: "Contact information for an ORG (email, phone, address) with usability status",
      required: ["_id", "org_id", "contact_type", "label", "is_preferred", "usability_status", "usability_status_date", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_id: {
          bsonType: "binData",
          description: "FK to ORG"
        },
        contact_type: {
          bsonType: "string",
          enum: ["EMAIL", "PHONE", "ADDRESS"],
          description: "Type of contact information"
        },
        email: {
          bsonType: "string",
          description: "Email address (for EMAIL type)"
        },
        phone: {
          bsonType: "string",
          description: "Phone number (for PHONE type)"
        },
        address_line_1: {
          bsonType: "string",
          description: "Primary address line (for ADDRESS type)"
        },
        address_line_2: {
          bsonType: "string",
          description: "Secondary address line (for ADDRESS type)"
        },
        city: {
          bsonType: "string",
          description: "City name (for ADDRESS type)"
        },
        state: {
          bsonType: "string",
          pattern: "^[A-Z]{2}$",
          description: "Two-letter state code (for ADDRESS type)"
        },
        zip_code: {
          bsonType: "string",
          pattern: "^[0-9]{5}(-[0-9]{4})?$",
          description: "ZIP code (for ADDRESS type)"
        },
        country: {
          bsonType: "string",
          description: "Country code ISO 3166-1 alpha-2 (for ADDRESS type)"
        },
        label: {
          bsonType: "string",
          enum: ["HEADQUARTERS", "BILLING", "MAILING", "BRANCH", "OTHER"],
          description: "Label for the contact"
        },
        is_preferred: {
          bsonType: "bool",
          description: "Whether this is the preferred contact of its type"
        },
        usability_status: {
          bsonType: "string",
          enum: ["ACTIVE", "INACTIVE", "ARCHIVED", "KNOWN_ERROR"],
          description: "Usability status of the contact"
        },
        usability_status_date: {
          bsonType: "date",
          description: "Date the usability status was set"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.org_contact.createIndex({ "org_id": 1 });
db.org_contact.createIndex({ "org_id": 1, "contact_type": 1 });
db.org_contact.createIndex({ "org_id": 1, "contact_type": 1, "is_preferred": 1 });
db.org_contact.createIndex({ "email": 1 }, { sparse: true });
db.org_contact.createIndex({ "usability_status": 1 });

// -----------------------------------------------------------------------------
// ORG_ROLE - Role assignment for an ORG
// -----------------------------------------------------------------------------
db.createCollection("org_role", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ORG_ROLE",
      description: "Role assignment for an ORG (EMPLOYER, CLIENT, VENDOR, BROKER, CARRIER, HEALTH_PLAN_SPONSOR, PROVIDER_ORG)",
      required: ["_id", "org_id", "role_type", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_id: {
          bsonType: "binData",
          description: "FK to ORG"
        },
        role_type: {
          bsonType: "string",
          enum: ["EMPLOYER", "CLIENT", "VENDOR", "BROKER", "CARRIER", "HEALTH_PLAN_SPONSOR", "PROVIDER_ORG"],
          description: "Type of role assigned to the organization"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the role became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the role was terminated (null if active)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the role is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.org_role.createIndex({ "org_id": 1 });
db.org_role.createIndex({ "role_type": 1 });
db.org_role.createIndex({ "org_id": 1, "role_type": 1 });
db.org_role.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// EMPLOYER_DETAILS - Role-specific attributes for EMPLOYER
// -----------------------------------------------------------------------------
db.createCollection("employer_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "EMPLOYER_DETAILS",
      description: "Role-specific attributes for EMPLOYER (NAICS, SIC, industry, size)",
      required: ["_id", "org_role_id", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_role_id: {
          bsonType: "binData",
          description: "FK to ORG_ROLE (must be EMPLOYER role)"
        },
        naics_code: {
          bsonType: "string",
          pattern: "^[0-9]{2,6}$",
          description: "North American Industry Classification System code"
        },
        sic_code: {
          bsonType: "string",
          pattern: "^[0-9]{4}$",
          description: "Standard Industrial Classification code"
        },
        industry: {
          bsonType: "string",
          description: "Industry description"
        },
        size_tier: {
          bsonType: "string",
          enum: ["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"],
          description: "Organization size tier"
        },
        employee_count: {
          bsonType: "int",
          minimum: 0,
          description: "Number of employees"
        },
        fein: {
          bsonType: "string",
          description: "Federal Employer Identification Number"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.employer_details.createIndex({ "org_role_id": 1 }, { unique: true });
db.employer_details.createIndex({ "naics_code": 1 });
db.employer_details.createIndex({ "size_tier": 1 });

// -----------------------------------------------------------------------------
// CLIENT_DETAILS - Role-specific attributes for CLIENT
// -----------------------------------------------------------------------------
db.createCollection("client_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "CLIENT_DETAILS",
      description: "Role-specific attributes for CLIENT (client code, tier, account manager)",
      required: ["_id", "org_role_id", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_role_id: {
          bsonType: "binData",
          description: "FK to ORG_ROLE (must be CLIENT role)"
        },
        client_code: {
          bsonType: "string",
          description: "Unique client identifier code"
        },
        account_manager: {
          bsonType: "string",
          description: "Name of assigned account manager"
        },
        implementation_date: {
          bsonType: "date",
          description: "Date client was implemented"
        },
        client_tier: {
          bsonType: "string",
          enum: ["STANDARD", "PREMIUM", "ENTERPRISE"],
          description: "Client service tier"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.client_details.createIndex({ "org_role_id": 1 }, { unique: true });
db.client_details.createIndex({ "client_code": 1 }, { unique: true, sparse: true });
db.client_details.createIndex({ "client_tier": 1 });

// -----------------------------------------------------------------------------
// VENDOR_DETAILS - Role-specific attributes for VENDOR
// -----------------------------------------------------------------------------
db.createCollection("vendor_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "VENDOR_DETAILS",
      description: "Role-specific attributes for VENDOR (vendor type, integration type)",
      required: ["_id", "org_role_id", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_role_id: {
          bsonType: "binData",
          description: "FK to ORG_ROLE (must be VENDOR role)"
        },
        vendor_type: {
          bsonType: "string",
          enum: ["TPA", "PBM", "LAB", "CLEARINGHOUSE", "OTHER"],
          description: "Type of vendor"
        },
        service_category: {
          bsonType: "string",
          description: "Category of services provided"
        },
        integration_type: {
          bsonType: "string",
          enum: ["API", "SFTP", "MANUAL"],
          description: "Type of data integration"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.vendor_details.createIndex({ "org_role_id": 1 }, { unique: true });
db.vendor_details.createIndex({ "vendor_type": 1 });
db.vendor_details.createIndex({ "integration_type": 1 });

// -----------------------------------------------------------------------------
// BROKER_DETAILS - Role-specific attributes for BROKER
// -----------------------------------------------------------------------------
db.createCollection("broker_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "BROKER_DETAILS",
      description: "Role-specific attributes for BROKER (license, broker type)",
      required: ["_id", "org_role_id", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_role_id: {
          bsonType: "binData",
          description: "FK to ORG_ROLE (must be BROKER role)"
        },
        license_number: {
          bsonType: "string",
          description: "Broker license number"
        },
        license_state: {
          bsonType: "string",
          pattern: "^[A-Z]{2}$",
          description: "State where license is held"
        },
        broker_type: {
          bsonType: "string",
          enum: ["GENERAL_AGENT", "BROKER", "CONSULTANT"],
          description: "Type of broker"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.broker_details.createIndex({ "org_role_id": 1 }, { unique: true });
db.broker_details.createIndex({ "license_number": 1, "license_state": 1 });
db.broker_details.createIndex({ "broker_type": 1 });

// -----------------------------------------------------------------------------
// CARRIER_DETAILS - Role-specific attributes for CARRIER
// -----------------------------------------------------------------------------
db.createCollection("carrier_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "CARRIER_DETAILS",
      description: "Role-specific attributes for CARRIER (NAIC code, carrier type, rating)",
      required: ["_id", "org_role_id", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_role_id: {
          bsonType: "binData",
          description: "FK to ORG_ROLE (must be CARRIER role)"
        },
        naic_code: {
          bsonType: "string",
          pattern: "^[0-9]{5}$",
          description: "National Association of Insurance Commissioners code"
        },
        carrier_type: {
          bsonType: "string",
          enum: ["COMMERCIAL", "MEDICARE", "MEDICAID", "OTHER"],
          description: "Type of insurance carrier"
        },
        am_best_rating: {
          bsonType: "string",
          description: "AM Best financial strength rating"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.carrier_details.createIndex({ "org_role_id": 1 }, { unique: true });
db.carrier_details.createIndex({ "naic_code": 1 });
db.carrier_details.createIndex({ "carrier_type": 1 });

// -----------------------------------------------------------------------------
// HEALTH_PLAN_SPONSOR_DETAILS - Role-specific attributes for HEALTH_PLAN_SPONSOR
// -----------------------------------------------------------------------------
db.createCollection("health_plan_sponsor_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "HEALTH_PLAN_SPONSOR_DETAILS",
      description: "Role-specific attributes for HEALTH_PLAN_SPONSOR (sponsor type, funding)",
      required: ["_id", "org_role_id", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_role_id: {
          bsonType: "binData",
          description: "FK to ORG_ROLE (must be HEALTH_PLAN_SPONSOR role)"
        },
        sponsor_type: {
          bsonType: "string",
          enum: ["SELF_INSURED", "FULLY_INSURED", "LEVEL_FUNDED"],
          description: "Type of health plan sponsorship"
        },
        funding_arrangement: {
          bsonType: "string",
          description: "Description of funding arrangement"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.health_plan_sponsor_details.createIndex({ "org_role_id": 1 }, { unique: true });
db.health_plan_sponsor_details.createIndex({ "sponsor_type": 1 });

// -----------------------------------------------------------------------------
// PROVIDER_ORG_DETAILS - Role-specific attributes for PROVIDER_ORG
// -----------------------------------------------------------------------------
db.createCollection("provider_org_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PROVIDER_ORG_DETAILS",
      description: "Role-specific attributes for PROVIDER_ORG (NPI, facility type, specialty)",
      required: ["_id", "org_role_id", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_role_id: {
          bsonType: "binData",
          description: "FK to ORG_ROLE (must be PROVIDER_ORG role)"
        },
        npi: {
          bsonType: "string",
          pattern: "^[0-9]{10}$",
          description: "National Provider Identifier (10 digits)"
        },
        facility_type: {
          bsonType: "string",
          enum: ["HOSPITAL", "CLINIC", "LAB", "PHARMACY", "IMAGING", "OTHER"],
          description: "Type of healthcare facility"
        },
        specialty: {
          bsonType: "string",
          description: "Primary specialty of the facility"
        },
        taxonomy_code: {
          bsonType: "string",
          pattern: "^[0-9A-Z]{10}$",
          description: "Healthcare Provider Taxonomy Code"
        },
        license_number: {
          bsonType: "string",
          description: "Facility license number"
        },
        license_state: {
          bsonType: "string",
          pattern: "^[A-Z]{2}$",
          description: "State where license is held"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.provider_org_details.createIndex({ "org_role_id": 1 }, { unique: true });
db.provider_org_details.createIndex({ "npi": 1 }, { unique: true, sparse: true });
db.provider_org_details.createIndex({ "facility_type": 1 });
db.provider_org_details.createIndex({ "taxonomy_code": 1 });

// -----------------------------------------------------------------------------
// ORG_RELATIONSHIP - Relationship between two ORGs
// -----------------------------------------------------------------------------
db.createCollection("org_relationship", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ORG_RELATIONSHIP",
      description: "Relationship between two ORGs (WELLNECITY_CLIENT, BROKER_CLIENT, CARRIER_CLIENT, VENDOR_CLIENT, PROVIDER_ORG_CLIENT)",
      required: ["_id", "org_id_source", "org_id_target", "relationship_type", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_id_source: {
          bsonType: "binData",
          description: "FK to ORG (source organization)"
        },
        org_id_target: {
          bsonType: "binData",
          description: "FK to ORG (target organization)"
        },
        relationship_type: {
          bsonType: "string",
          enum: ["WELLNECITY_CLIENT", "BROKER_CLIENT", "CARRIER_CLIENT", "VENDOR_CLIENT", "PROVIDER_ORG_CLIENT"],
          description: "Type of relationship between organizations"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the relationship became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the relationship was terminated (null if active)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the relationship is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.org_relationship.createIndex({ "org_id_source": 1 });
db.org_relationship.createIndex({ "org_id_target": 1 });
db.org_relationship.createIndex({ "relationship_type": 1 });
db.org_relationship.createIndex({ "org_id_source": 1, "org_id_target": 1, "relationship_type": 1 });
db.org_relationship.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// CONTRACT - Legal agreement tied to an ORG_RELATIONSHIP
// -----------------------------------------------------------------------------
db.createCollection("contract", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "CONTRACT",
      description: "Legal agreement tied to an ORG_RELATIONSHIP",
      required: ["_id", "org_relationship_id", "effective_date", "status", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_relationship_id: {
          bsonType: "binData",
          description: "FK to ORG_RELATIONSHIP"
        },
        contract_type: {
          bsonType: "string",
          description: "Type of contract (e.g., 'Analytics Services', 'TPA Agreement')"
        },
        contract_number: {
          bsonType: "string",
          description: "Unique contract identifier"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the contract became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the contract was terminated (null if active)"
        },
        status: {
          bsonType: "string",
          enum: ["DRAFT", "ACTIVE", "EXPIRED", "TERMINATED", "RENEWED"],
          description: "Current status of the contract"
        },
        terms: {
          bsonType: "string",
          description: "Contract terms and conditions (text or reference)"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.contract.createIndex({ "org_relationship_id": 1 });
db.contract.createIndex({ "contract_number": 1 }, { unique: true, sparse: true });
db.contract.createIndex({ "status": 1 });
db.contract.createIndex({ "effective_date": 1 });

// -----------------------------------------------------------------------------
// ORG_STRUCTURE - Internal organizational structure definition
// -----------------------------------------------------------------------------
db.createCollection("org_structure", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ORG_STRUCTURE",
      description: "Internal organizational structure definition (e.g., Financial Divisions, Benefit Administration)",
      required: ["_id", "org_id", "structure_type", "name", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_id: {
          bsonType: "binData",
          description: "FK to ORG"
        },
        structure_type: {
          bsonType: "string",
          enum: ["FINANCIAL", "BENEFIT_ADMIN", "REPORTING", "GEOGRAPHIC", "OPERATIONAL", "OTHER"],
          description: "Type of organizational structure"
        },
        name: {
          bsonType: "string",
          description: "Name of the structure"
        },
        description: {
          bsonType: "string",
          description: "Description of the structure purpose"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the structure became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the structure was terminated"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the structure is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.org_structure.createIndex({ "org_id": 1 });
db.org_structure.createIndex({ "org_id": 1, "structure_type": 1 });
db.org_structure.createIndex({ "structure_type": 1 });
db.org_structure.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// ORG_STRUCTURE_NODE - Hierarchical node within an ORG_STRUCTURE
// -----------------------------------------------------------------------------
db.createCollection("org_structure_node", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ORG_STRUCTURE_NODE",
      description: "Hierarchical node within an ORG_STRUCTURE",
      required: ["_id", "org_structure_id", "name", "level", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        org_structure_id: {
          bsonType: "binData",
          description: "FK to ORG_STRUCTURE"
        },
        parent_node_id: {
          bsonType: "binData",
          description: "FK to parent ORG_STRUCTURE_NODE (NULL for root nodes)"
        },
        node_code: {
          bsonType: "string",
          description: "Code identifier for the node"
        },
        name: {
          bsonType: "string",
          description: "Name of the node"
        },
        description: {
          bsonType: "string",
          description: "Description of the node"
        },
        level: {
          bsonType: "int",
          minimum: 0,
          description: "Depth in hierarchy (0 = root)"
        },
        sort_order: {
          bsonType: "int",
          description: "Sort order among siblings"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the node became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the node was terminated"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the node is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.org_structure_node.createIndex({ "org_structure_id": 1 });
db.org_structure_node.createIndex({ "org_structure_id": 1, "parent_node_id": 1 });
db.org_structure_node.createIndex({ "parent_node_id": 1 });
db.org_structure_node.createIndex({ "org_structure_id": 1, "node_code": 1 });
db.org_structure_node.createIndex({ "level": 1 });
db.org_structure_node.createIndex({ "is_active": 1 });

// ============================================================================
// PORTFOLIO DOMAIN
// ============================================================================

// -----------------------------------------------------------------------------
// PORTFOLIO - Flexible grouping of organizations
// -----------------------------------------------------------------------------
db.createCollection("portfolio", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PORTFOLIO",
      description: "Flexible grouping of organizations; can be nested and owned by ORG or PERSON",
      required: ["_id", "name", "portfolio_type", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        name: {
          bsonType: "string",
          description: "Portfolio name"
        },
        description: {
          bsonType: "string",
          description: "Portfolio description"
        },
        portfolio_type: {
          bsonType: "string",
          enum: ["USER", "WELLNECITY", "BROKER", "VENDOR", "EMPLOYER", "CARRIER", "HEALTH_PLAN_SPONSOR"],
          description: "Type of portfolio"
        },
        owner_org_id: {
          bsonType: "binData",
          description: "FK to ORG that owns this portfolio (nullable)"
        },
        owner_person_id: {
          bsonType: "binData",
          description: "FK to PERSON that owns this portfolio (nullable)"
        },
        parent_portfolio_id: {
          bsonType: "binData",
          description: "FK to parent PORTFOLIO for nesting (nullable)"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the portfolio became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the portfolio was terminated (null if active)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the portfolio is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.portfolio.createIndex({ "name": 1 });
db.portfolio.createIndex({ "portfolio_type": 1 });
db.portfolio.createIndex({ "owner_org_id": 1 });
db.portfolio.createIndex({ "owner_person_id": 1 });
db.portfolio.createIndex({ "parent_portfolio_id": 1 });
db.portfolio.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// PORTFOLIO_MEMBER - Links a PORTFOLIO to an ORG
// -----------------------------------------------------------------------------
db.createCollection("portfolio_member", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PORTFOLIO_MEMBER",
      description: "Links a PORTFOLIO to an ORG (any org, not just clients)",
      required: ["_id", "portfolio_id", "org_id", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        portfolio_id: {
          bsonType: "binData",
          description: "FK to PORTFOLIO"
        },
        org_id: {
          bsonType: "binData",
          description: "FK to ORG (any organization)"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the membership became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the membership was terminated (null if active)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the membership is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.portfolio_member.createIndex({ "portfolio_id": 1 });
db.portfolio_member.createIndex({ "org_id": 1 });
db.portfolio_member.createIndex({ "portfolio_id": 1, "org_id": 1 }, { unique: true });
db.portfolio_member.createIndex({ "is_active": 1 });

// ============================================================================
// PERSON DOMAIN
// ============================================================================

// -----------------------------------------------------------------------------
// PERSON - Base entity for all individuals
// -----------------------------------------------------------------------------
db.createCollection("person", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PERSON",
      description: "Base entity for all individuals (employees, members, dependents, providers)",
      required: ["_id", "first_name", "last_name", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        first_name: {
          bsonType: "string",
          description: "First name"
        },
        last_name: {
          bsonType: "string",
          description: "Last name"
        },
        middle_name: {
          bsonType: "string",
          description: "Middle name"
        },
        date_of_birth: {
          bsonType: "date",
          description: "Date of birth"
        },
        gender: {
          bsonType: "string",
          enum: ["MALE", "FEMALE", "OTHER", "UNKNOWN"],
          description: "Gender"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the person is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.person.createIndex({ "last_name": 1, "first_name": 1 });
db.person.createIndex({ "date_of_birth": 1 });
db.person.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// PERSON_IDENTIFIER - Identifier for a PERSON (SSN, MRN, Member ID, etc.)
// -----------------------------------------------------------------------------
db.createCollection("person_identifier", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PERSON_IDENTIFIER",
      description: "Identifier for a PERSON (SSN, MRN, Member ID, etc.) with usability status",
      required: ["_id", "person_id", "identifier_type", "identifier_value", "usability_status", "usability_status_date", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        person_id: {
          bsonType: "binData",
          description: "FK to PERSON"
        },
        identifier_type: {
          bsonType: "string",
          enum: ["SSN", "MRN", "MEMBER_ID", "EMPLOYEE_ID", "NPI", "DRIVERS_LICENSE", "PASSPORT", "OTHER"],
          description: "Type of identifier"
        },
        identifier_value: {
          bsonType: "string",
          description: "The identifier value"
        },
        issuing_authority: {
          bsonType: "string",
          description: "Organization or system that issued the ID"
        },
        issue_date: {
          bsonType: "date",
          description: "Date the identifier was issued"
        },
        expiration_date: {
          bsonType: "date",
          description: "Date the identifier expires"
        },
        usability_status: {
          bsonType: "string",
          enum: ["ACTIVE", "INACTIVE", "ARCHIVED", "KNOWN_ERROR"],
          description: "Usability status of the identifier"
        },
        usability_status_date: {
          bsonType: "date",
          description: "Date the usability status was set"
        },
        is_primary: {
          bsonType: "bool",
          description: "Whether this is the primary identifier of its type"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.person_identifier.createIndex({ "person_id": 1 });
db.person_identifier.createIndex({ "person_id": 1, "identifier_type": 1 });
db.person_identifier.createIndex({ "identifier_type": 1, "identifier_value": 1 });
db.person_identifier.createIndex({ "usability_status": 1 });

// -----------------------------------------------------------------------------
// PERSON_CONTACT - Contact information for a PERSON
// -----------------------------------------------------------------------------
db.createCollection("person_contact", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PERSON_CONTACT",
      description: "Contact information for a PERSON (email, phone, address) with usability status",
      required: ["_id", "person_id", "contact_type", "label", "is_preferred", "usability_status", "usability_status_date", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        person_id: {
          bsonType: "binData",
          description: "FK to PERSON"
        },
        contact_type: {
          bsonType: "string",
          enum: ["EMAIL", "PHONE", "ADDRESS"],
          description: "Type of contact information"
        },
        email: {
          bsonType: "string",
          description: "Email address (for EMAIL type)"
        },
        phone: {
          bsonType: "string",
          description: "Phone number (for PHONE type)"
        },
        address_line_1: {
          bsonType: "string",
          description: "Primary address line (for ADDRESS type)"
        },
        address_line_2: {
          bsonType: "string",
          description: "Secondary address line (for ADDRESS type)"
        },
        city: {
          bsonType: "string",
          description: "City name (for ADDRESS type)"
        },
        state: {
          bsonType: "string",
          pattern: "^[A-Z]{2}$",
          description: "Two-letter state code (for ADDRESS type)"
        },
        zip_code: {
          bsonType: "string",
          pattern: "^[0-9]{5}(-[0-9]{4})?$",
          description: "ZIP code (for ADDRESS type)"
        },
        country: {
          bsonType: "string",
          description: "Country code ISO 3166-1 alpha-2 (for ADDRESS type)"
        },
        label: {
          bsonType: "string",
          enum: ["HOME", "WORK", "MOBILE", "OTHER"],
          description: "Label for the contact"
        },
        is_preferred: {
          bsonType: "bool",
          description: "Whether this is the preferred contact of its type"
        },
        usability_status: {
          bsonType: "string",
          enum: ["ACTIVE", "INACTIVE", "ARCHIVED", "KNOWN_ERROR"],
          description: "Usability status of the contact"
        },
        usability_status_date: {
          bsonType: "date",
          description: "Date the usability status was set"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.person_contact.createIndex({ "person_id": 1 });
db.person_contact.createIndex({ "person_id": 1, "contact_type": 1 });
db.person_contact.createIndex({ "person_id": 1, "contact_type": 1, "is_preferred": 1 });
db.person_contact.createIndex({ "email": 1 }, { sparse: true });
db.person_contact.createIndex({ "usability_status": 1 });

// -----------------------------------------------------------------------------
// EMPLOYEE - Links PERSON to an EMPLOYER ORG
// -----------------------------------------------------------------------------
db.createCollection("employee", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "EMPLOYEE",
      description: "Links PERSON to an EMPLOYER ORG",
      required: ["_id", "person_id", "employer_org_id", "hire_date", "employment_status", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        person_id: {
          bsonType: "binData",
          description: "FK to PERSON"
        },
        employer_org_id: {
          bsonType: "binData",
          description: "FK to ORG (must have EMPLOYER role)"
        },
        employee_number: {
          bsonType: "string",
          description: "Employer-assigned employee identifier"
        },
        hire_date: {
          bsonType: "date",
          description: "Date of hire"
        },
        termination_date: {
          bsonType: "date",
          description: "Date of termination (null if active)"
        },
        employment_status: {
          bsonType: "string",
          enum: ["ACTIVE", "TERMINATED", "LOA", "RETIRED"],
          description: "Current employment status"
        },
        employment_type: {
          bsonType: "string",
          enum: ["FULL_TIME", "PART_TIME", "CONTRACTOR"],
          description: "Type of employment"
        },
        job_title: {
          bsonType: "string",
          description: "Job title"
        },
        department: {
          bsonType: "string",
          description: "Department name"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the employment is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.employee.createIndex({ "person_id": 1 });
db.employee.createIndex({ "employer_org_id": 1 });
db.employee.createIndex({ "employee_number": 1 });
db.employee.createIndex({ "employer_org_id": 1, "employee_number": 1 }, { unique: true, sparse: true });
db.employee.createIndex({ "employment_status": 1 });
db.employee.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// PROVIDER - Links PERSON to healthcare provider role
// -----------------------------------------------------------------------------
db.createCollection("provider", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PROVIDER",
      description: "Links PERSON to healthcare provider role (replaces PRACTITIONER)",
      required: ["_id", "person_id", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        person_id: {
          bsonType: "binData",
          description: "FK to PERSON"
        },
        npi: {
          bsonType: "string",
          pattern: "^[0-9]{10}$",
          description: "National Provider Identifier (10 digits)"
        },
        provider_type: {
          bsonType: "string",
          enum: ["PHYSICIAN", "NURSE", "THERAPIST", "PHARMACIST", "OTHER"],
          description: "Type of provider"
        },
        specialty: {
          bsonType: "string",
          description: "Primary specialty"
        },
        taxonomy_code: {
          bsonType: "string",
          pattern: "^[0-9A-Z]{10}$",
          description: "Healthcare Provider Taxonomy Code"
        },
        license_number: {
          bsonType: "string",
          description: "Professional license number"
        },
        license_state: {
          bsonType: "string",
          pattern: "^[A-Z]{2}$",
          description: "State where license is held"
        },
        dea_number: {
          bsonType: "string",
          description: "DEA registration number"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the provider is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.provider.createIndex({ "person_id": 1 });
db.provider.createIndex({ "npi": 1 }, { unique: true, sparse: true });
db.provider.createIndex({ "provider_type": 1 });
db.provider.createIndex({ "specialty": 1 });
db.provider.createIndex({ "taxonomy_code": 1 });
db.provider.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// PROVIDER_AFFILIATION - Links PROVIDER to PROVIDER_ORG
// -----------------------------------------------------------------------------
db.createCollection("provider_affiliation", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PROVIDER_AFFILIATION",
      description: "Links PROVIDER (person) to PROVIDER_ORG with affiliation type",
      required: ["_id", "provider_id", "provider_org_id", "affiliation_type", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        provider_id: {
          bsonType: "binData",
          description: "FK to PROVIDER"
        },
        provider_org_id: {
          bsonType: "binData",
          description: "FK to ORG (must have PROVIDER_ORG role)"
        },
        affiliation_type: {
          bsonType: "string",
          enum: ["EMPLOYED", "CONTRACTED", "PRIVILEGED"],
          description: "Type of affiliation with the organization"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the affiliation became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the affiliation was terminated (null if active)"
        },
        is_primary: {
          bsonType: "bool",
          description: "Whether this is the provider's primary affiliation"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the affiliation is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.provider_affiliation.createIndex({ "provider_id": 1 });
db.provider_affiliation.createIndex({ "provider_org_id": 1 });
db.provider_affiliation.createIndex({ "provider_id": 1, "provider_org_id": 1 });
db.provider_affiliation.createIndex({ "affiliation_type": 1 });
db.provider_affiliation.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// HOUSEHOLD - Grouping of persons living together
// -----------------------------------------------------------------------------
db.createCollection("household", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "HOUSEHOLD",
      description: "Grouping of persons living together",
      required: ["_id", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        household_name: {
          bsonType: "string",
          description: "Name for the household (e.g., 'Smith Family')"
        },
        address_line_1: {
          bsonType: "string",
          description: "Primary address line"
        },
        address_line_2: {
          bsonType: "string",
          description: "Secondary address line"
        },
        city: {
          bsonType: "string",
          description: "City name"
        },
        state: {
          bsonType: "string",
          pattern: "^[A-Z]{2}$",
          description: "Two-letter state code"
        },
        zip_code: {
          bsonType: "string",
          pattern: "^[0-9]{5}(-[0-9]{4})?$",
          description: "ZIP code (5 or 9 digit)"
        },
        country: {
          bsonType: "string",
          description: "Country code (ISO 3166-1 alpha-2)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the household is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.household.createIndex({ "household_name": 1 });
db.household.createIndex({ "zip_code": 1 });
db.household.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// HOUSEHOLD_PARTICIPANT - Links PERSON to HOUSEHOLD
// -----------------------------------------------------------------------------
db.createCollection("household_participant", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "HOUSEHOLD_PARTICIPANT",
      description: "Links PERSON to HOUSEHOLD with relationship type",
      required: ["_id", "household_id", "person_id", "relationship_type", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        household_id: {
          bsonType: "binData",
          description: "FK to HOUSEHOLD"
        },
        person_id: {
          bsonType: "binData",
          description: "FK to PERSON"
        },
        relationship_type: {
          bsonType: "string",
          enum: ["FATHER", "MOTHER", "CHILD", "HUSBAND", "WIFE", "DOMESTIC_PARTNER"],
          description: "Relationship type within the household"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the participation became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the participation was terminated (null if active)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the participation is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.household_participant.createIndex({ "household_id": 1 });
db.household_participant.createIndex({ "person_id": 1 });
db.household_participant.createIndex({ "household_id": 1, "person_id": 1 }, { unique: true });
db.household_participant.createIndex({ "relationship_type": 1 });
db.household_participant.createIndex({ "is_active": 1 });

// ============================================================================
// BENEFITS DOMAIN
// ============================================================================

// -----------------------------------------------------------------------------
// BENEFIT_PLAN - Health plan offered by a HEALTH_PLAN_SPONSOR ORG
// -----------------------------------------------------------------------------
db.createCollection("benefit_plan", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "BENEFIT_PLAN",
      description: "Health plan offered by a HEALTH_PLAN_SPONSOR ORG; optionally linked to ORG_STRUCTURE_NODE",
      required: ["_id", "sponsor_org_id", "plan_name", "plan_type", "benefit_type", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        sponsor_org_id: {
          bsonType: "binData",
          description: "FK to ORG (must have HEALTH_PLAN_SPONSOR role)"
        },
        org_structure_node_id: {
          bsonType: "binData",
          description: "FK to ORG_STRUCTURE_NODE for plan assignment (optional)"
        },
        plan_name: {
          bsonType: "string",
          description: "Name of the benefit plan"
        },
        plan_code: {
          bsonType: "string",
          description: "Unique plan identifier code"
        },
        plan_type: {
          bsonType: "string",
          enum: ["HMO", "PPO", "HDHP", "EPO", "POS", "INDEMNITY"],
          description: "Type of health plan"
        },
        benefit_type: {
          bsonType: "string",
          enum: ["MEDICAL", "DENTAL", "VISION", "PHARMACY", "LIFE_DISABILITY"],
          description: "Category of benefits provided"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the plan became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the plan was terminated (null if active)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the plan is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.benefit_plan.createIndex({ "sponsor_org_id": 1 });
db.benefit_plan.createIndex({ "sponsor_org_id": 1, "org_structure_node_id": 1 });
db.benefit_plan.createIndex({ "org_structure_node_id": 1 }, { sparse: true });
db.benefit_plan.createIndex({ "plan_code": 1 }, { unique: true, sparse: true });
db.benefit_plan.createIndex({ "plan_type": 1 });
db.benefit_plan.createIndex({ "benefit_type": 1 });
db.benefit_plan.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// COVERAGE_TYPE - Tier within a plan (Single, Family, etc.)
// -----------------------------------------------------------------------------
db.createCollection("coverage_type", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "COVERAGE_TYPE",
      description: "Tier within a plan (Single, Family, etc.) with financial limits",
      required: ["_id", "benefit_plan_id", "name", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        benefit_plan_id: {
          bsonType: "binData",
          description: "FK to BENEFIT_PLAN"
        },
        name: {
          bsonType: "string",
          enum: ["SINGLE", "SINGLE_DEPENDENT", "SINGLE_SPOUSE", "FAMILY", "SPOUSE_ONLY", "DEPENDENT_ONLY"],
          description: "Coverage tier name"
        },
        in_network_deductible_individual: {
          bsonType: "decimal",
          description: "In-network individual deductible amount"
        },
        in_network_deductible_family: {
          bsonType: "decimal",
          description: "In-network family deductible amount"
        },
        in_network_coinsurance: {
          bsonType: "decimal",
          description: "In-network coinsurance percentage (0-100)"
        },
        in_network_oop_max_individual: {
          bsonType: "decimal",
          description: "In-network individual out-of-pocket maximum"
        },
        in_network_oop_max_family: {
          bsonType: "decimal",
          description: "In-network family out-of-pocket maximum"
        },
        out_of_network_deductible_individual: {
          bsonType: "decimal",
          description: "Out-of-network individual deductible amount"
        },
        out_of_network_deductible_family: {
          bsonType: "decimal",
          description: "Out-of-network family deductible amount"
        },
        out_of_network_coinsurance: {
          bsonType: "decimal",
          description: "Out-of-network coinsurance percentage (0-100)"
        },
        out_of_network_oop_max_individual: {
          bsonType: "decimal",
          description: "Out-of-network individual out-of-pocket maximum"
        },
        out_of_network_oop_max_family: {
          bsonType: "decimal",
          description: "Out-of-network family out-of-pocket maximum"
        },
        copay_primary_care: {
          bsonType: "decimal",
          description: "Copay for primary care visits"
        },
        copay_specialist: {
          bsonType: "decimal",
          description: "Copay for specialist visits"
        },
        copay_emergency: {
          bsonType: "decimal",
          description: "Copay for emergency room visits"
        },
        copay_urgent_care: {
          bsonType: "decimal",
          description: "Copay for urgent care visits"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the coverage type became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the coverage type was terminated (null if active)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the coverage type is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.coverage_type.createIndex({ "benefit_plan_id": 1 });
db.coverage_type.createIndex({ "benefit_plan_id": 1, "name": 1 }, { unique: true });
db.coverage_type.createIndex({ "name": 1 });
db.coverage_type.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// PLAN_LIMIT - Template defining limits for a plan
// -----------------------------------------------------------------------------
db.createCollection("plan_limit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PLAN_LIMIT",
      description: "Template defining limits for a plan (deductible, OOP max, visit limits, etc.)",
      required: ["_id", "benefit_plan_id", "limit_type", "network_type", "level", "period_type", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        benefit_plan_id: {
          bsonType: "binData",
          description: "FK to BENEFIT_PLAN"
        },
        limit_type: {
          bsonType: "string",
          enum: ["DEDUCTIBLE", "OOP_MAX", "VISIT_LIMIT", "RX_SPENDING", "BENEFIT_MAX"],
          description: "Type of limit"
        },
        network_type: {
          bsonType: "string",
          enum: ["IN_NETWORK", "OUT_OF_NETWORK", "COMBINED"],
          description: "Network applicability"
        },
        level: {
          bsonType: "string",
          enum: ["INDIVIDUAL", "FAMILY"],
          description: "Level at which the limit applies"
        },
        benefit_category: {
          bsonType: "string",
          enum: ["MEDICAL", "DENTAL", "VISION", "PHARMACY", "PHYSICAL_THERAPY", "MENTAL_HEALTH"],
          description: "Category of benefits this limit applies to"
        },
        limit_amount: {
          bsonType: "decimal",
          description: "Dollar amount for the limit"
        },
        limit_count: {
          bsonType: "int",
          description: "Count limit (e.g., number of visits)"
        },
        period_type: {
          bsonType: "string",
          enum: ["PLAN_YEAR", "CALENDAR_YEAR", "LIFETIME"],
          description: "Period over which the limit applies"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the limit became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the limit was terminated (null if active)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the limit is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.plan_limit.createIndex({ "benefit_plan_id": 1 });
db.plan_limit.createIndex({ "limit_type": 1 });
db.plan_limit.createIndex({ "network_type": 1 });
db.plan_limit.createIndex({ "level": 1 });
db.plan_limit.createIndex({ "benefit_plan_id": 1, "limit_type": 1, "network_type": 1, "level": 1 });
db.plan_limit.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// ELIGIBILITY - Links EMPLOYEE to BENEFIT_PLAN with status
// -----------------------------------------------------------------------------
db.createCollection("eligibility", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ELIGIBILITY",
      description: "Links EMPLOYEE to BENEFIT_PLAN with eligibility status",
      required: ["_id", "employee_id", "benefit_plan_id", "status", "effective_date", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        employee_id: {
          bsonType: "binData",
          description: "FK to EMPLOYEE"
        },
        benefit_plan_id: {
          bsonType: "binData",
          description: "FK to BENEFIT_PLAN"
        },
        status: {
          bsonType: "string",
          enum: ["NOT_ELIGIBLE", "ELIGIBLE_ENROLLED", "ELIGIBLE_NOT_ENROLLED"],
          description: "Eligibility status"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the eligibility became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the eligibility was terminated (null if active)"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.eligibility.createIndex({ "employee_id": 1 });
db.eligibility.createIndex({ "benefit_plan_id": 1 });
db.eligibility.createIndex({ "employee_id": 1, "benefit_plan_id": 1 });
db.eligibility.createIndex({ "status": 1 });

// -----------------------------------------------------------------------------
// COVERAGE - Instance of enrollment in a COVERAGE_TYPE
// -----------------------------------------------------------------------------
db.createCollection("coverage", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "COVERAGE",
      description: "Instance of enrollment in a COVERAGE_TYPE",
      required: ["_id", "coverage_type_id", "benefit_plan_id", "effective_date", "status", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        coverage_type_id: {
          bsonType: "binData",
          description: "FK to COVERAGE_TYPE"
        },
        benefit_plan_id: {
          bsonType: "binData",
          description: "FK to BENEFIT_PLAN"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the coverage became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the coverage was terminated (null if active)"
        },
        status: {
          bsonType: "string",
          enum: ["ACTIVE", "TERMINATED", "COBRA", "PENDING"],
          description: "Current status of the coverage"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.coverage.createIndex({ "coverage_type_id": 1 });
db.coverage.createIndex({ "benefit_plan_id": 1 });
db.coverage.createIndex({ "status": 1 });
db.coverage.createIndex({ "effective_date": 1 });

// -----------------------------------------------------------------------------
// PLAN_MEMBER - Person enrolled in a COVERAGE
// -----------------------------------------------------------------------------
db.createCollection("plan_member", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "PLAN_MEMBER",
      description: "Person enrolled in a COVERAGE (SUBSCRIBER or DEPENDENT)",
      required: ["_id", "person_id", "coverage_id", "member_type", "effective_date", "is_active", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        person_id: {
          bsonType: "binData",
          description: "FK to PERSON"
        },
        coverage_id: {
          bsonType: "binData",
          description: "FK to COVERAGE"
        },
        subscriber_plan_member_id: {
          bsonType: "binData",
          description: "FK to PLAN_MEMBER (NULL if this member is the subscriber)"
        },
        member_type: {
          bsonType: "string",
          enum: ["SUBSCRIBER", "DEPENDENT"],
          description: "Whether this is a subscriber or dependent"
        },
        subscriber_relationship_type: {
          bsonType: "string",
          enum: ["SELF", "SPOUSE", "CHILD", "DOMESTIC_PARTNER"],
          description: "Relationship to the subscriber"
        },
        wellnecity_id: {
          bsonType: "string",
          description: "Wellnecity-assigned member identifier"
        },
        subscriber_id: {
          bsonType: "string",
          description: "Subscriber ID from the carrier/TPA"
        },
        effective_date: {
          bsonType: "date",
          description: "Date the membership became effective"
        },
        termination_date: {
          bsonType: "date",
          description: "Date the membership was terminated (null if active)"
        },
        is_active: {
          bsonType: "bool",
          description: "Whether the membership is currently active"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.plan_member.createIndex({ "person_id": 1 });
db.plan_member.createIndex({ "coverage_id": 1 });
db.plan_member.createIndex({ "subscriber_plan_member_id": 1 });
db.plan_member.createIndex({ "wellnecity_id": 1 }, { unique: true, sparse: true });
db.plan_member.createIndex({ "subscriber_id": 1 });
db.plan_member.createIndex({ "member_type": 1 });
db.plan_member.createIndex({ "is_active": 1 });

// -----------------------------------------------------------------------------
// ACCUMULATOR - Tracks spending/usage against PLAN_LIMIT
// -----------------------------------------------------------------------------
db.createCollection("accumulator", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "ACCUMULATOR",
      description: "Tracks spending/usage against PLAN_LIMIT for a PLAN_MEMBER or COVERAGE",
      required: ["_id", "plan_limit_id", "period_start", "period_end", "created_at", "updated_at"],
      properties: {
        _id: {
          bsonType: "binData",
          description: "UUID primary key"
        },
        plan_limit_id: {
          bsonType: "binData",
          description: "FK to PLAN_LIMIT"
        },
        plan_member_id: {
          bsonType: "binData",
          description: "FK to PLAN_MEMBER (for individual-level accumulators)"
        },
        coverage_id: {
          bsonType: "binData",
          description: "FK to COVERAGE (for family-level accumulators)"
        },
        accumulated_amount: {
          bsonType: "decimal",
          description: "Current accumulated dollar amount"
        },
        accumulated_count: {
          bsonType: "int",
          description: "Current accumulated count (e.g., visits)"
        },
        period_start: {
          bsonType: "date",
          description: "Start date of the accumulation period"
        },
        period_end: {
          bsonType: "date",
          description: "End date of the accumulation period"
        },
        created_at: {
          bsonType: "date",
          description: "Record creation timestamp"
        },
        updated_at: {
          bsonType: "date",
          description: "Record last update timestamp"
        }
      }
    }
  }
});

db.accumulator.createIndex({ "plan_limit_id": 1 });
db.accumulator.createIndex({ "plan_member_id": 1 });
db.accumulator.createIndex({ "coverage_id": 1 });
db.accumulator.createIndex({ "period_start": 1, "period_end": 1 });
db.accumulator.createIndex({ "plan_limit_id": 1, "plan_member_id": 1, "period_start": 1 });
db.accumulator.createIndex({ "plan_limit_id": 1, "coverage_id": 1, "period_start": 1 });

// ============================================================================
// SUMMARY
// ============================================================================

print("\n============================================================================");
print("MongoDB DDL Execution Complete");
print("============================================================================");
print("\nCollections created:");
print("  Organization Domain:");
print("    - org");
print("    - org_role");
print("    - employer_details");
print("    - client_details");
print("    - vendor_details");
print("    - broker_details");
print("    - carrier_details");
print("    - health_plan_sponsor_details");
print("    - provider_org_details");
print("    - org_relationship");
print("    - contract");
print("\n  Portfolio Domain:");
print("    - portfolio");
print("    - portfolio_member");
print("\n  Person Domain:");
print("    - person");
print("    - employee");
print("    - provider");
print("    - provider_affiliation");
print("    - household");
print("    - household_participant");
print("\n  Benefits Domain:");
print("    - benefit_plan");
print("    - coverage_type");
print("    - plan_limit");
print("    - eligibility");
print("    - coverage");
print("    - plan_member");
print("    - accumulator");
print("\nTotal: 26 collections with JSON Schema validation and indexes");
print("============================================================================\n");
