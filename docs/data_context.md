# DenialDefender: Synthetic Data Context

This document explains the strategy, structure, and rationale behind the synthetic dataset included in the `data/` directory.

## 1. Overview and Rationale

DenialDefender is designed to ingest denial letters, analyze the corresponding patient clinical charts against payer guidelines, and generate comprehensive, citation-backed appeal letters using Retrieval-Augmented Generation (RAG). 

To prove this architecture without exposing any Protected Health Information (PHI), the project utilizes a highly structured, 100% synthetic dataset of 30 patient cases. This size is large enough to demonstrate generalization across different medical specialties and payers, while remaining manageable for rapid iteration and source control.

## 2. Provenance: The Synthea Foundation

The underlying clinical data is generated using **Synthea** (MITRE Corporation, Apache 2.0). 
We utilize the standard Synthea 1K Sample to seed our records. Synthea provides realistic longitudinal medical histories, including:
- Demographics and patient identification.
- Medical conditions and encounters.
- Medications, allergies, and immunizations.
- Observations (labs/vitals) and imaging studies.
- Simulated claims and administrative data.

*Note: The raw Synthea CSV files are excluded from version control to prevent repository bloat, but the deterministic extraction scripts remain available in `scripts/`.*

## 3. The Curation Matrix

The 30 curated cases are generated deterministically to cover a comprehensive matrix reflecting real-world denial distributions.

### Payers Represented
1. Aetna
2. UnitedHealthcare (UHC)
3. Blue Cross Blue Shield (BCBS)
4. Cigna
5. Medicare

### Clinical Specialties Represented
1. Cardiology
2. Oncology
3. Orthopedics
4. Gastroenterology
5. Endocrinology
6. OB/GYN
7. Behavioral Health
8. Internal Medicine

## 4. The Appeal Layer

Synthea natively generates clinical histories, but it does not simulate the *denial and appeal* workflow. To provide a complete end-to-end test harness, we programmatically layer synthetic correspondence on top of each Synthea patient case.

Each case directory (e.g., `data/cases/case_001/`) contains the following components:

- **`case.json`**: The consolidated, RAG-ready clinical bundle for the patient, extracted directly from Synthea.
- **`manifest.json`**: Metadata defining the patient's assigned payer, specialty, and target denial reason.
- **`denial_letter.txt`**: A synthetic denial letter serving as the trigger for the system. It is generated using templates specific to the assigned payer and denial reason (e.g., "Medical necessity not established").
- **`policy_bulletin.md`**: A synthetic payer medical policy that dictates the coverage rules for the disputed service.
- **`notes.md`**: Synthesized clinical progress notes representing the physician's evaluation, serving as the core evidence base for the appeal.

## 5. Supporting Knowledge Base

Beyond the individual cases, the dataset includes a global `data/knowledge/` directory. This acts as the standard claims-processing intelligence injected into the RAG context, covering four pillars:
1. **Managed Care Plan Structures** (HMO, PPO, Medicare Advantage rules).
2. **Essential Supporting Documents** (UB-04, EOB parsing).
3. **Key Review Criteria** (Medical necessity definitions, coding accuracy).
4. **Common Denial Reasons** (And standard rhetorical arguments to overcome them).

Representative medical literature (`data/literature/`) and appeal templates (`data/appeal_templates/`) complete the necessary context for the LLM to draft robust, defensible appeals.
