import os
import json
from datetime import datetime, timedelta
import random

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CASES_DIR = os.path.join(DATA_DIR, "cases")

DENIAL_TEMPLATES = {
    "Medical necessity not established": """[PAYER_LOGO_PLACEHOLDER]
{payer} Health Plans
P.O. Box 12345
Claims Processing Department

Date: {date}
Member Name: {patient_name}
Member ID: {patient_id}
Date of Service: {dos}

NOTICE OF ADVERSE BENEFIT DETERMINATION

Dear {patient_name},

We have received a claim for {specialty} services from your provider on {dos}. After careful review of the clinical documentation submitted, we are denying coverage for the requested service.

Reason for Denial:
Based on our medical policies, the requested service does not meet the criteria for medical necessity. Specifically, the clinical notes do not establish that conservative therapy (e.g., physical therapy, pharmacotherapy) was attempted and failed prior to the requested intervention. Objective clinical evidence supporting the necessity of this procedure was not found in the submitted records.

If you or your provider disagree with this determination, you have the right to file an appeal. Please submit a letter of appeal along with additional supporting documentation (e.g., clinical notes, imaging results, lab reports) demonstrating medical necessity within 180 days of receiving this notice.

Sincerely,
Medical Review Department
{payer} Health Plans
""",
    "No prior authorization": """[PAYER_LOGO_PLACEHOLDER]
{payer} Health Plans
Prior Authorization Department

Date: {date}
Member Name: {patient_name}
Member ID: {patient_id}
Date of Service: {dos}

NOTICE OF CLAIM DENIAL

Dear {patient_name},

This letter is to inform you that the claim for {specialty} services rendered on {dos} has been denied.

Reason for Denial:
Our records indicate that the required prior authorization was not obtained for this elective procedure. Under your {payer} plan, {specialty} procedures require authorization at least 14 days prior to the service date. We do not have a record of an authorization request on file, nor does the documentation indicate an emergency situation where life or limb was at immediate risk.

You may appeal this decision by submitting an appeal letter with proof of authorization or clinical evidence establishing an emergency exception.

Sincerely,
Claims Adjudication Team
{payer} Health Plans
""",
    "Coding error": """[PAYER_LOGO_PLACEHOLDER]
{payer} Health Plans
Provider Billing Services

Date: {date}
Member Name: {patient_name}
Member ID: {patient_id}
Date of Service: {dos}

EXPLANATION OF BENEFITS / CLAIM DENIAL

Dear {patient_name},

We have processed the claim submitted by your provider for {specialty} services on {dos}. 

Reason for Denial:
The claim cannot be processed as submitted due to a coding error. The procedure codes (CPT/HCPCS) billed do not align with the submitted diagnosis codes (ICD-10) or lack appropriate modifiers based on the provided clinical notes. 

Next Steps:
Your provider must review the coding guidelines and submit a corrected claim or an appeal with supporting documentation demonstrating the appropriate code selection.

Sincerely,
Provider Billing Services
{payer} Health Plans
""",
    "Eligibility issues": """[PAYER_LOGO_PLACEHOLDER]
{payer} Health Plans
Member Services

Date: {date}
Member Name: {patient_name}
Member ID: {patient_id}
Date of Service: {dos}

NOTICE OF DENIAL: ELIGIBILITY

Dear {patient_name},

We have received a claim for {specialty} services on {dos}. 

Reason for Denial:
According to our records, your coverage under {payer} was not active on the date of service. Therefore, we cannot provide benefits for these services.

If you believe this is an error and you had active coverage on the date of service, please contact Member Services or file an appeal with proof of eligibility.

Sincerely,
Member Eligibility Team
{payer} Health Plans
""",
    "Missing documentation": """[PAYER_LOGO_PLACEHOLDER]
{payer} Health Plans
Clinical Review Department

Date: {date}
Member Name: {patient_name}
Member ID: {patient_id}
Date of Service: {dos}

NOTICE OF CLAIM DENIAL - MISSING INFORMATION

Dear {patient_name},

We are unable to process the claim for {specialty} services from your provider on {dos}.

Reason for Denial:
The clinical documentation submitted with the claim is incomplete. We previously requested comprehensive clinical notes, including history of present illness, physical exam findings, and relevant lab/imaging reports. Because this information was not received within the 30-day timeframe, the claim is denied.

Your provider may appeal this decision by submitting the requested comprehensive clinical documentation.

Sincerely,
Clinical Review Department
{payer} Health Plans
"""
}

def generate_denials():
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
        patient_name = f"{first_name} {last_name}"
        patient_id = patient.get("id", "UNKNOWN_ID")
        
        # Pick a date of service from encounters, if any
        encounters = case_data.get("encounters", [])
        if encounters:
            dos_raw = encounters[-1].get("START", "")
            try:
                # Synthea dates are like 2011-04-30T10:20:30Z
                dos = dos_raw.split("T")[0]
            except:
                dos = "2023-10-15"
        else:
            dos = "2023-10-15"
            
        date_today = datetime.now().strftime("%Y-%m-%d")
        
        template = DENIAL_TEMPLATES.get(reason, DENIAL_TEMPLATES["Medical necessity not established"])
        letter_text = template.format(
            payer=payer, 
            specialty=specialty,
            patient_name=patient_name,
            patient_id=patient_id,
            dos=dos,
            date=date_today
        )
        
        with open(os.path.join(case_dir, "denial_letter.txt"), "w") as f:
            f.write(letter_text)
            
    print("Generated denial letters for all cases.")

if __name__ == "__main__":
    generate_denials()
