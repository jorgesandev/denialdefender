# DenialDefender: Synthetic Data Strategy & Provenance

This document outlines the strategy, structure, and ethical rationale behind the synthetic dataset driving the DenialDefender evaluation harness.

## 1. Rationale: PHI-Free Evaluation

DenialDefender is architected to process sensitive medical and insurance documents. To enable rigorous testing, public benchmarking, and developer collaboration without risking the exposure of Protected Health Information (PHI), the project utilizes a 100% synthetic dataset. 

This approach ensures that the entire Retrieval-Augmented Generation (RAG) pipeline—from PDF intake to final appeal generation—can be validated against realistic clinical scenarios in a completely safe, non-HIPAA-regulated environment.

## 2. Clinical Foundation: Synthea™

The core longitudinal patient histories are derived from **Synthea™** (MITRE Corporation), an open-source synthetic patient generator that simulates the life of a patient from birth to death.

- **Scale**: We seeded our dataset with 30 high-fidelity cases.
- **Coverage**: The cohort spans 8 clinical specialties (Cardiology, Oncology, Orthopedics, etc.) and 5 major US payers (Aetna, UHC, BCBS, Cigna, Medicare).
- **Data Fidelity**: Synthea provides realistic lab values, medication histories, and encounter notes, ensuring the LLM has a complex, "noisy" context to parse—mirroring real-world clinical records.

## 3. The "Appeal Layer": Synthetic Correspondence

While Synthea provides the clinical backbone, it does not simulate the administrative friction of insurance denials. We have programmatically layered a "Correspondence Layer" on each patient case, consisting of:

- **Denial Letters**: Template-driven documents matching specific payer styles and denial codes (e.g., "Medical Necessity," "Experimental/Investigational").
- **Medical Policies**: Synthetic payer bulletins that define the coverage criteria the AI must argue against.
- **Physician Progress Notes**: Synthesized clinical reasoning that provides the "ammunition" for the appeal.

## 4. Knowledge Base Structure

The `data/knowledge/` directory serves as the system's "Administrative Intelligence," containing:
- **Managed Care Frameworks**: Structural rules for HMO/PPO/Medicare Advantage.
- **Payer Policies**: A structured JSON database of coverage criteria.
- **Winning Appeal Templates**: Few-shot examples of successful rhetorical strategies used by the RAG system to calibrate its tone.

## 5. Usage & Reproducibility

The raw data is organized in `data/cases/case_XXX/` directories. Each contains a `case.json` (the RAG-ready clinical bundle) and a `manifest.json` (metadata for evaluation).

For developers wishing to extend this dataset, the deterministic scripts are available in `scripts/`. No real-world patient data should ever be committed to this repository.
