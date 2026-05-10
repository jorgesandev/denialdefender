/* ──────────────────────────────────────────────────────────
   Sample-case metadata (matches data/synthetic/manifest.json)
   ────────────────────────────────────────────────────────── */

export interface SampleCase {
  id: string;
  patient: string;
  age: number;
  sex: string;
  denialReason: string;
  denialCode: string;
  payer: string;
  procedure: string;
  amount: number;
  outcome: string;
  outcomeColor: string;
  folder: string;
}

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: "001",
    patient: "Maria Elena Rodriguez",
    age: 52,
    sex: "F",
    denialReason: "Lack of Medical Necessity",
    denialCode: "MN-204",
    payer: "UnitedHealthcare",
    procedure: "MRI Lumbar Spine",
    amount: 2850,
    outcome: "Overturn Likely",
    outcomeColor: "#10b981",
    folder: "001_lack_of_medical_necessity",
  },
  {
    id: "002",
    patient: "David Anthony Chen",
    age: 45,
    sex: "M",
    denialReason: "Missing Prior Authorization",
    denialCode: "PA-101",
    payer: "Anthem BCBS",
    procedure: "Knee Arthroscopy",
    amount: 18420,
    outcome: "Overturn Likely",
    outcomeColor: "#10b981",
    folder: "002_missing_prior_authorization",
  },
  {
    id: "003",
    patient: "James Robert Patterson",
    age: 63,
    sex: "M",
    denialReason: "Non-Covered Service",
    denialCode: "NC-302",
    payer: "Aetna",
    procedure: "Continuous Glucose Monitor (CGM)",
    amount: 1285,
    outcome: "Needs Strong Argument",
    outcomeColor: "#f59e0b",
    folder: "003_non_covered_service",
  },
  {
    id: "004",
    patient: "Priya Sharma",
    age: 67,
    sex: "F",
    denialReason: "Coding Error",
    denialCode: "CE-150",
    payer: "Cigna Healthcare",
    procedure: "Transthoracic Echocardiogram",
    amount: 1890,
    outcome: "Overturn Certain",
    outcomeColor: "#10b981",
    folder: "004_coding_error",
  },
  {
    id: "005",
    patient: "Angela Marie Thompson",
    age: 49,
    sex: "F",
    denialReason: "Experimental Treatment",
    denialCode: "EX-401",
    payer: "BCBS Illinois",
    procedure: "Proton Beam Radiation Therapy",
    amount: 42500,
    outcome: "Strong Case for External Review",
    outcomeColor: "#f59e0b",
    folder: "005_experimental_treatment",
  },
];
