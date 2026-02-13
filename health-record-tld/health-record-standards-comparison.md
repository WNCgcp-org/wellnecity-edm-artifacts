# Health Record Standards Comparison

**Document Purpose:** Evaluation of leading healthcare data standards for implementing a robust Person Health Record system.

**Date:** January 25, 2026
**Branch:** `feature/person-health-record`

---

## Executive Summary

This document compares four leading healthcare data standards to inform the design of a Person Health Record. Each standard serves different primary purposes:

| Standard | Primary Purpose | Best For |
|----------|----------------|----------|
| **HL7 FHIR R4** | Real-time data exchange | Clinical care + interoperability |
| **HL7 CDA** | Document exchange | Complete clinical documents |
| **openEHR** | Persistent storage | Lifetime patient records |
| **OMOP CDM** | Research analytics | Population health research |

---

## Detailed Comparison

### 1. HL7 FHIR R4 (Fast Healthcare Interoperability Resources)

#### Overview
Modern, REST API-based standard for exchanging healthcare information. Uses modular "Resources" representing discrete healthcare concepts. FHIR R4 is the most widely adopted version globally and is mandated by US federal regulation.

#### Data Format
- JSON and XML (both equally supported)
- RESTful HTTP APIs with standard CRUD operations

#### Pros
| Advantage | Description |
|-----------|-------------|
| Modern architecture | REST APIs, JSON/XML familiar to web developers |
| Regulatory mandate | Required by US 21st Century Cures Act |
| Broad vendor support | Epic, Cerner, Athena, and others have implemented FHIR APIs |
| Large community | Active open-source community with rapid support |
| Excellent tooling | SMART on FHIR, CDS Hooks, mature FHIR servers |
| Flexible exchange | Supports real-time APIs, messaging, and document-based exchange |

#### Cons
| Disadvantage | Description |
|--------------|-------------|
| Flexibility paradox | Two implementations can be "FHIR compliant" but incompatible |
| Not persistence-first | Designed for exchange, not long-term storage |
| High implementation cost | Significant investment required for transition |
| Knowledge gap | 76% of respondents cite lack of FHIR knowledge as barrier |
| Profile fragmentation | Over-reliance on profiles can reduce interoperability |

#### Adoption
- Mainstream adoption as of 2025
- 73% of countries mandate or advise FHIR use
- Required by CMS for patient access and prior authorization

---

### 2. HL7 CDA (Clinical Document Architecture)

#### Overview
XML-based standard for exchanging structured clinical documents. Provides both machine-processable structure and human-readable presentation. CDA Release 2 (2005) remains the standard.

#### Data Format
- XML only
- Header + Body structure
- Supports text, images, sounds, and multimedia

#### Pros
| Advantage | Description |
|-----------|-------------|
| Well-established | Standard since 2005, ISO-approved |
| Dual representation | Human AND machine-readable in single document |
| Document persistence | Creates complete, self-contained clinical documents |
| Legal acceptance | Established compliance framework in many jurisdictions |
| Rich content | Supports multimedia and complex clinical narratives |

#### Cons
| Disadvantage | Description |
|--------------|-------------|
| Document-centric | Difficult to extract fine-grained data items |
| Not backwards compatible | HL7 v2 systems cannot directly read CDA |
| Excessive file sizes | C-CDA documents can reach hundreds of MB |
| No real-time | Document-based model not suited for streaming |
| Declining adoption | Being superseded by FHIR for new implementations |
| Data extraction | Requires decomposition for granular analysis |

#### Adoption
- 500 million+ documents exchanged annually in C-CDA format
- Primary US standard for document exchange between EHRs
- Declining relative to FHIR for new implementations

---

### 3. openEHR (Open Electronic Health Record)

#### Overview
Open standard emphasizing long-term data persistence, vendor neutrality, and separation of clinical content from application logic through archetypes and templates. Uses Archetype Query Language (AQL) for data retrieval.

#### Data Format
- XML (can also be JSON)
- Highly structured reference model
- Clinical content defined through archetypes

#### Pros
| Advantage | Description |
|-----------|-------------|
| Long-term persistence | Designed for lifetime patient records with versioning |
| Vendor neutrality | True independence from application vendors |
| Deep clinical semantics | Archetypes ensure clinical accuracy |
| Future-proof | Separation of content from application enables sustainability |
| Comprehensive versioning | Every object versioned, history always available |
| Powerful queries | Archetype Query Language (AQL) for data retrieval |
| ISO adopted | Archetype formalism is ISO 13606-2:2019 |

#### Cons
| Disadvantage | Description |
|--------------|-------------|
| Steep learning curve | Complex archetype/template system requires training |
| Limited vendor support | Not fully supported in many HIS/EHR systems |
| Fragmented adoption | Limited tooling ecosystem compared to FHIR |
| Over-complex | 300+ archetypes may be excessive for simple use cases |
| Implementation barriers | Requires substantial upfront architectural planning |
| Integration challenges | Difficult to integrate with non-openEHR systems |

#### Adoption
- Growing momentum in 2025
- UK NHS using openEHR for shared care platforms
- Strong in Australia, Scandinavia
- Often used alongside FHIR (openEHR for persistence, FHIR for APIs)

---

### 4. OMOP CDM (Observational Medical Outcomes Partnership)

#### Overview
Open community standard for standardizing observational healthcare data structure and content. Enables comparative analysis, real-world evidence generation, and population health research. Maintained by OHDSI collaborative.

#### Data Format
- Relational database schema (SQL)
- Normalized tables with standardized vocabularies
- Person-centric (all events linked to PERSON table)

#### Pros
| Advantage | Description |
|-----------|-------------|
| Standardized analytics | OHDSI vocabulary enables consistent cross-institution analysis |
| Multi-source | Accommodates claims, EHR, and registry data |
| Research-optimized | Designed for population-level observational studies |
| Open-source ecosystem | ATLAS tool, SQL libraries, shared analytical routines |
| Cost-effective research | Faster, more reliable evidence generation |
| Rare disease support | Enables data pooling across institutions |
| Proven track record | Active at Stanford, UCSF, UF, many research institutions |

#### Cons
| Disadvantage | Description |
|--------------|-------------|
| Research-only | Not designed for clinical care delivery |
| ETL required | Significant effort to map existing data to OMOP schema |
| No clinical use | Cannot serve as primary EHR or patient-facing system |
| Imaging gaps | Limited support for imaging metadata |
| Complex schema | Learning curve for those unfamiliar with relational DBs |
| Transformation burden | Requires ongoing ETL maintenance |

#### Adoption
- Strong in academic/research institutions
- Growing use for FDA post-market surveillance
- Used for COVID-19 research and pandemic tracking
- International adoption for population health research

---

## Comparative Matrix

| Dimension | FHIR R4 | CDA | openEHR | OMOP CDM |
|-----------|---------|-----|---------|----------|
| **Primary Purpose** | Real-time exchange | Document exchange | Persistent storage | Research analytics |
| **Data Format** | JSON/XML REST | XML | XML/JSON | SQL |
| **Persistence** | Secondary | Document-based | Primary strength | Analytics-focused |
| **Adoption Level** | Mainstream | Declining | Growing niche | Research-strong |
| **Implementation Cost** | High | Medium | High | Medium |
| **Learning Curve** | Moderate | Moderate | Steep | Moderate |
| **Vendor Support** | Excellent | Established | Limited | Research-focused |
| **API-Ready** | Yes (native) | No | Can layer APIs | No (DB-native) |
| **Real-time** | Yes | No | Optional | No |
| **Long-term Storage** | Not primary | Yes | Excellent | Yes (analytics) |
| **US Regulatory Mandate** | Yes | Declining | No | No |

---

## Recommendation Options

### Option A: FHIR-Only
**Best for:** Rapid implementation, regulatory compliance, interoperability

- Aligns with existing `bq_fhir_ingest` infrastructure
- Fastest path to implementation
- Strong vendor and community support
- May require additional persistence layer for long-term records

### Option B: openEHR + FHIR
**Best for:** Long-term architecture, vendor neutrality, data persistence

- openEHR for persistent clinical data repository
- FHIR APIs layered on top for interoperability
- Most future-proof but higher implementation complexity
- Recommended for organizations building systems to last decades

### Option C: FHIR + OMOP
**Best for:** Clinical operations combined with research/analytics

- FHIR for clinical care delivery and interoperability
- OMOP CDM for analytics and research data warehouse
- Good if population health analytics is a requirement

---

## Decision Factors

When selecting a standard, consider:

1. **Primary use case** - Clinical care vs. research vs. document exchange
2. **Existing infrastructure** - What systems are already in place?
3. **Regulatory requirements** - US federal mandates favor FHIR
4. **Long-term vision** - How long must data persist? Decades?
5. **Interoperability needs** - Who do you need to exchange data with?
6. **Team expertise** - What skills does your team have?
7. **Vendor ecosystem** - What tools and support are available?

---

## Next Steps

1. Review this comparison with stakeholders
2. Identify primary use case requirements
3. Assess existing infrastructure alignment
4. Select standard(s) for Person Health Record implementation
5. Define implementation roadmap

---

## References

- [HL7 FHIR R4 Specification](https://www.hl7.org/fhir/)
- [HL7 CDA Overview](https://build.fhir.org/ig/HL7/CDA-core-sd/overview.html)
- [openEHR Specifications](https://specifications.openehr.org/)
- [OMOP Common Data Model](https://ohdsi.github.io/CommonDataModel/)
- [OHDSI Collaborative](https://www.ohdsi.org/)
