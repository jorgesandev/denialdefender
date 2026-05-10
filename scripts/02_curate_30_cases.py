import pandas as pd
import json
import random
import os
import math

# Configuration
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CSV_DIR = os.path.join(DATA_DIR, "csv")
CASES_DIR = os.path.join(DATA_DIR, "cases")
NUM_CASES = 30
RANDOM_SEED = 42

PAYERS = ["Aetna", "UHC", "BCBS", "Cigna", "Medicare"]
SPECIALTIES = [
    "Cardiology", "Oncology", "Orthopedics", "Gastroenterology", 
    "Endocrinology", "OB/GYN", "Behavioral Health", "Internal Medicine"
]
DENIAL_REASONS = [
    "Medical necessity not established", 
    "No prior authorization", 
    "Coding error", 
    "Eligibility issues", 
    "Missing documentation"
]

def load_csv(filename):
    path = os.path.join(CSV_DIR, filename)
    if not os.path.exists(path):
        return pd.DataFrame()
    return pd.read_csv(path, dtype=str).fillna("")

def main():
    random.seed(RANDOM_SEED)
    
    print("Loading CSV files...")
    patients_df = load_csv("patients.csv")
    if patients_df.empty:
        print("Error: patients.csv not found in data/csv/")
        return
        
    conditions_df = load_csv("conditions.csv")
    procedures_df = load_csv("procedures.csv")
    encounters_df = load_csv("encounters.csv")
    medications_df = load_csv("medications.csv")
    allergies_df = load_csv("allergies.csv")
    observations_df = load_csv("observations.csv")
    imaging_df = load_csv("imaging_studies.csv")
    immunizations_df = load_csv("immunizations.csv")
    claims_df = load_csv("claims.csv")

    print(f"Selecting {NUM_CASES} random patients...")
    selected_patients = patients_df.sample(n=NUM_CASES, random_state=RANDOM_SEED)
    
    global_manifest = []
    
    for idx, row in enumerate(selected_patients.itertuples(), 1):
        patient_id = row.Id
        case_id = f"case_{idx:03d}"
        case_dir = os.path.join(CASES_DIR, case_id)
        os.makedirs(case_dir, exist_ok=True)
        
        # Extract patient-specific data
        patient_data = {
            "id": patient_id,
            "demographics": row._asdict()
        }
        del patient_data["demographics"]["Index"]
        
        # Helper to get records for patient
        def get_records(df, patient_col="PATIENT"):
            if df.empty:
                return []
            if patient_col in df.columns:
                return df[df[patient_col] == patient_id].to_dict(orient="records")
            elif "Id" in df.columns and patient_col == "Id":
                return df[df["Id"] == patient_id].to_dict(orient="records")
            return []

        case_bundle = {
            "patient": patient_data,
            "conditions": get_records(conditions_df),
            "procedures": get_records(procedures_df),
            "encounters": get_records(encounters_df),
            "medications": get_records(medications_df),
            "allergies": get_records(allergies_df),
            "observations": get_records(observations_df),
            "imaging_studies": get_records(imaging_df),
            "immunizations": get_records(immunizations_df),
            "claims": get_records(claims_df),
        }
        
        # Write case.json
        with open(os.path.join(case_dir, "case.json"), "w") as f:
            json.dump(case_bundle, f, indent=2)
            
        # Generate manifest.json
        payer = random.choice(PAYERS)
        specialty = random.choice(SPECIALTIES)
        denial_reason = random.choice(DENIAL_REASONS)
        
        manifest = {
            "case_id": case_id,
            "patient_id": patient_id,
            "payer": payer,
            "specialty": specialty,
            "denial_reason": denial_reason,
            "status": "generated"
        }
        
        with open(os.path.join(case_dir, "manifest.json"), "w") as f:
            json.dump(manifest, f, indent=2)
            
        global_manifest.append(manifest)
        print(f"Generated {case_id} for patient {patient_id}")
        
    with open(os.path.join(DATA_DIR, "manifest.json"), "w") as f:
        json.dump(global_manifest, f, indent=2)
        
    print(f"Successfully generated {NUM_CASES} cases in {CASES_DIR}")

if __name__ == "__main__":
    main()
