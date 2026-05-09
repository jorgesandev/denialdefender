from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import time
import os

from app.ingest import extract_pdf_text, parse_denial, llm_client
from app.retrieval import (
    retrieve_chart_spans, retrieve_payer_policy,
    retrieve_literature, retrieve_past_appeals,
)
from app.prompts import APPEAL_SYSTEM_PROMPT, build_appeal_prompt

app = FastAPI(title="DenialDefender API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/generate")
async def generate(denial_pdf: UploadFile = File(...), chart_text: str = Form(default="")):
    t0 = time.time()
    
    # 1. Ingest (uses vision model if scanned)
    pdf_bytes = await denial_pdf.read()
    tmp_dir = Path("/tmp")
    tmp_dir.mkdir(exist_ok=True)
    tmp_file = tmp_dir / denial_pdf.filename
    tmp_file.write_bytes(pdf_bytes)
    
    denial_text, was_scanned = extract_pdf_text(str(tmp_file))
    denial = parse_denial(denial_text)
    denial["_raw_text"] = denial_text
    
    # Clean up temp file
    os.remove(tmp_file)
    
    # 2. Retrieve
    chart_spans = retrieve_chart_spans(chart_text, denial)
    policy = retrieve_payer_policy(denial)
    literature = retrieve_literature(denial, k=5)
    past_appeals = retrieve_past_appeals(denial, k=3)
    
    # 3. Generate (language model)
    prompt = build_appeal_prompt(denial, chart_spans, policy, literature, past_appeals)
    
    response = llm_client.chat.completions.create(
        model="qwen3-32b",
        messages=[
            {"role": "system", "content": APPEAL_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=4096, # Kept this at 4096 for safety!
        temperature=0.4,
    )
    
    return {
        "denial": {k: v for k, v in denial.items() if k != "_raw_text"},
        "appeal": response.choices[0].message.content,
        "context_size_chars": len(prompt),
        "was_scanned": was_scanned,
        "elapsed_seconds": round(time.time() - t0, 1),
        "models_used": {
            "vision": "qwen-vl" if was_scanned else None,
            "language": "qwen3-32b",
        },
    }
