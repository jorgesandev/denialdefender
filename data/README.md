# DenialDefender Synthetic Case Dataset

This repository contains 30 comprehensive, synthetic patient cases designed to exercise the DenialDefender architecture. The dataset is built from open-licensed clinical data sources (Synthea) and augmented with synthetic payer correspondence, allowing end-to-end evaluation of the RAG appeal generation pipeline without exposing Protected Health Information (PHI).

## Dataset Organization

The `/data` directory is structured as follows:

- `cases/`: The 30 curated synthetic patient cases.
- `payers/`: Synthetic medical policy bulletins and coverage guidelines.
- `knowledge/`: Structured domain knowledge representing the 4 pillars of claims appeals.
- `literature/`: Sample peer-reviewed literature abstracts supporting medical necessity.
- `appeal_templates/`: Rhetorical structures and exemplar appeals for various denial reasons.
- `csv/`: The raw 1K Synthea dataset used for case generation (excluded from version control).
- `manifest.json`: The global index mapping cases to their assigned payer, specialty, and denial reason.

## Payer × Specialty Matrix

The 30 cases are deterministically generated to span the following matrix:

### Payers (5)
- Aetna
- UnitedHealthcare (UHC)
- Blue Cross Blue Shield (BCBS)
- Cigna
- Medicare

### Specialties (8)
- Cardiology
- Oncology
- Orthopedics
- Gastroenterology
- Endocrinology
- OB/GYN
- Behavioral Health
- Internal Medicine

## The Case Bundle

Each directory in `data/cases/` contains:
1. `case.json`: The full patient clinical history (demographics, conditions, encounters, medications, labs, etc.) extracted from Synthea and consolidated for RAG ingestion.
2. `denial_letter.txt`: The synthetic denial letter triggering the appeal workflow.
3. `notes.md`: Synthesized clinical notes representing the physician's evaluation and plan.
4. `policy_bulletin.md`: The applicable payer medical policy governing the disputed service.
5. `manifest.json`: Case metadata.

## Generation Scripts

The cases are generated deterministically using the scripts in `scripts/`:
- `02_curate_30_cases.py`: Parses the raw Synthea CSVs and bundles the 30 target cases.
- `03_synthesize_denials.py`: Generates the synthetic denial letters based on the case data.
- `04_generate_policies.py`: Associates the appropriate payer policy with each case.
- `05_synthesize_notes.py`: Generates supporting clinical progress notes.
