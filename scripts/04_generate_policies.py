import os
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CASES_DIR = os.path.join(DATA_DIR, "cases")
PAYERS_DIR = os.path.join(DATA_DIR, "payers")

POLICY_TEMPLATES = {
    "Medical necessity not established": """# {payer} Medical Policy Bulletin
**Specialty:** {specialty}
**Policy:** Medical Necessity Guidelines

## Description
This policy outlines the medical necessity requirements for {specialty} procedures. {payer} considers interventions medically necessary only when conservative therapy has failed or is contraindicated.

## Coverage Criteria
1. The patient must have a documented diagnosis relevant to the requested service.
2. The patient must have failed at least 6 weeks of conservative treatment (e.g., physical therapy, pharmacotherapy).
3. Objective clinical evidence (imaging, lab results) must support the need for intervention.

## Denial Reasons
If the clinical documentation does not establish the above criteria, the service will be denied as not medically necessary.
""",
    "No prior authorization": """# {payer} Prior Authorization Policy
**Specialty:** {specialty}

## Description
{payer} requires prior authorization for all elective {specialty} procedures.

## Requirements
Providers must submit a request for authorization at least 14 days prior to the date of service. Retroactive authorizations are generally not permitted unless emergency care criteria are met.

## Exceptions
Emergency services where the patient's life or limb is at immediate risk do not require prior authorization.
""",
    "Coding error": """# {payer} Coding and Billing Guidelines
**Specialty:** {specialty}

## Description
Accurate coding is required for all {specialty} claims submitted to {payer}.

## Policy
Claims must follow current CPT, HCPCS, and ICD-10 coding guidelines. Upcoding, unbundling, or using incorrect modifiers will result in claim denial.

## Corrective Action
If a claim is denied for coding errors, the provider must submit a corrected claim or an appeal with supporting documentation demonstrating the appropriate code selection based on the clinical notes.
""",
    "Eligibility issues": """# {payer} Member Eligibility Policy

## Description
Coverage is contingent upon active member eligibility on the date of service.

## Verification
Providers are responsible for verifying member eligibility prior to rendering {specialty} services. Claims submitted for services rendered during a coverage lapse will be denied.
""",
    "Missing documentation": """# {payer} Clinical Documentation Requirements
**Specialty:** {specialty}

## Description
{payer} requires comprehensive clinical documentation to process claims for {specialty}.

## Requirements
Documentation must include:
- A clear history of present illness.
- Relevant physical exam findings.
- Assessment and plan.
- All relevant lab and imaging reports.

Failure to provide requested documentation within 30 days of a request will result in denial.
"""
}

def generate_policies():
    os.makedirs(PAYERS_DIR, exist_ok=True)
    
    with open(os.path.join(DATA_DIR, "manifest.json"), "r") as f:
        manifest = json.load(f)
        
    for case in manifest:
        case_id = case["case_id"]
        payer = case["payer"]
        specialty = case["specialty"]
        reason = case["denial_reason"]
        
        template = POLICY_TEMPLATES.get(reason, POLICY_TEMPLATES["Medical necessity not established"])
        policy_text = template.format(payer=payer, specialty=specialty)
        
        case_dir = os.path.join(CASES_DIR, case_id)
        
        # Write to case folder
        with open(os.path.join(case_dir, "policy_bulletin.md"), "w") as f:
            f.write(policy_text)
            
        # Also write a shared copy to payers folder if not exists
        shared_policy_name = f"{payer.lower().replace(' ', '_')}_{specialty.lower().replace(' ', '_').replace('/', '_')}_policy.md"
        shared_policy_path = os.path.join(PAYERS_DIR, shared_policy_name)
        if not os.path.exists(shared_policy_path):
            with open(shared_policy_path, "w") as f:
                f.write(policy_text)
                
    print("Generated policy bulletins for all cases.")

if __name__ == "__main__":
    generate_policies()
