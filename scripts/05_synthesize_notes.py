import os
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CASES_DIR = os.path.join(DATA_DIR, "cases")

def generate_notes():
    with open(os.path.join(DATA_DIR, "manifest.json"), "r") as f:
        manifest = json.load(f)
        
    for case in manifest:
        case_id = case["case_id"]
        payer = case["payer"]
        specialty = case["specialty"]
        reason = case["denial_reason"]
        
        case_dir = os.path.join(CASES_DIR, case_id)
        with open(os.path.join(case_dir, "case.json"), "r") as f:
            case_data = json.load(f)
            
        patient = case_data.get("patient", {})
        demographics = patient.get("demographics", {})
        
        first_name = demographics.get("FIRST", "John")
        last_name = demographics.get("LAST", "Doe")
        age = 45 # Approximate
        gender = demographics.get("GENDER", "M")
        
        # Look for a primary condition
        conditions = case_data.get("conditions", [])
        primary_condition = conditions[0].get("DESCRIPTION", "Unspecified condition") if conditions else "Unspecified condition"
        
        notes_md = f"""# Clinical Notes

## Patient Info
**Name:** {first_name} {last_name}
**Gender:** {gender}

## Chief Complaint
Patient presents for evaluation of {primary_condition}.

## History of Present Illness (HPI)
Patient has been experiencing symptoms related to {primary_condition} for several months. They report trying conservative treatments (rest, over-the-counter NSAIDs) with minimal relief. Symptoms are interfering with daily activities.

## Physical Exam
- **General:** Well-appearing, in no acute distress.
- **Relevant Findings:** Tenderness and limited range of motion noted in the affected area.

## Assessment
1. {primary_condition} - Exacerbated despite conservative management.

## Plan
Recommend proceeding with intervention for {specialty}. Discussed risks, benefits, and alternatives with the patient. Patient consents to the procedure.

"""
        # Append some extra text if the denial reason was missing documentation
        if reason == "Missing documentation":
            notes_md += "\n*Note: Laboratory results and imaging were reviewed but not attached to the primary submission packet.*"

        with open(os.path.join(case_dir, "notes.md"), "w") as f:
            f.write(notes_md)
            
    print("Generated clinical notes for all cases.")

if __name__ == "__main__":
    generate_notes()
