import json, os, re
from pathlib import Path

# --- 1. Patient chart retrieval ---
def retrieve_chart_spans(chart_text: str, denial: dict) -> str:
    if len(chart_text) < 30000:
        return chart_text
    keywords = [denial.get("denied_service", "")] + denial.get("procedure_codes", [])
    keywords = [k for k in keywords if k]
    sections = re.split(r'\n(?=[A-Z][A-Z ]{3,}:)', chart_text)
    relevant = [s for s in sections if any(k.lower() in s.lower() for k in keywords)]
    return "\n\n".join(relevant) if relevant else chart_text[:30000]

# --- 2. Payer policy lookup ---
def retrieve_payer_policy(denial: dict) -> str:
    policy_path = Path("../data/payer_policies.json")
    if not policy_path.exists():
        return "No specific payer policy found in mock data."
        
    PAYER_POLICIES = json.loads(policy_path.read_text())
    payer = denial.get("payer", "").lower()
    code = denial.get("denial_code", "")
    for key, policy in PAYER_POLICIES.items():
        if key.lower() in payer:
            return policy.get(code, policy.get("default", ""))
    return "Standard medical necessity guidelines apply."

# --- 3. Clinical literature (pgvector) ---
def retrieve_literature(denial: dict, k: int = 5) -> list[str]:
    try:
        from sentence_transformers import SentenceTransformer
        import psycopg
        
        # If DB URL isn't set, return mock data to prevent crashing
        if not os.getenv("PG_URL"):
            return ["Mock Literature: Patient outcomes improve with timely MRI imaging."]
            
        model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        query = f"{denial.get('denied_service', '')} {denial.get('denial_reason', '')}"
        qvec = model.encode(query).tolist()
        
        with psycopg.connect(os.getenv("PG_URL")) as conn:
            rows = conn.execute(
                "SELECT title, abstract FROM pubmed ORDER BY embedding <=> %s::vector LIMIT %s",
                (str(qvec), k),
            ).fetchall()
        return [f"{r[0]}\n{r[1]}" for r in rows]
    except Exception as e:
        print(f"Vector DB not ready: {e}")
        return []

# --- 4. Past successful appeals ---
def retrieve_past_appeals(denial: dict, k: int = 3) -> list[str]:
    appeals_path = Path("../data/past_appeals.json")
    if not appeals_path.exists():
        return []
        
    PAST_APPEALS = json.loads(appeals_path.read_text())
    payer = denial.get("payer", "").lower()
    code = denial.get("denial_code", "")
    
    matches = [
        a["text"] for a in PAST_APPEALS
        if payer in a["payer"].lower() and a["denial_code"] == code
    ]
    return matches[:k] if matches else [a["text"] for a in PAST_APPEALS[:k]]
