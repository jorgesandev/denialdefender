import pdfplumber
from pathlib import Path
import base64
from openai import OpenAI
import os, json

llm_client = OpenAI(base_url=os.getenv("VLLM_LLM_URL", "http://localhost:8000/v1"), api_key="dummy")
vl_client = OpenAI(base_url=os.getenv("VLLM_VL_URL", "http://localhost:8001/v1"), api_key="dummy")

def extract_pdf_text(pdf_path: str) -> tuple[str, bool]:
    """Returns (text, was_scanned). Falls back to vision model if no text layer."""
    text_parts = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
    full = "\n\n".join(text_parts)
    
    if len(full.strip()) < 100:
        return _extract_with_vision(pdf_path), True
    return full, False

def _extract_with_vision(pdf_path: str) -> str:
    """Use Qwen2.5-VL-7B for scanned/handwritten/faxed denials."""
    from pdf2image import convert_from_path
    from io import BytesIO
    
    images = convert_from_path(pdf_path, dpi=200)
    extracted_pages = []
    for i, img in enumerate(images):
        buf = BytesIO()
        img.save(buf, format="JPEG")
        img_b64 = base64.b64encode(buf.getvalue()).decode()
        
        response = vl_client.chat.completions.create(
            model="qwen-vl",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}},
                    {"type": "text", "text": "Transcribe ALL text from this insurance document page. Preserve structure, codes, and dates exactly. Output the transcription only — no commentary."}
                ]
            }],
            max_tokens=2000,
            temperature=0.1,
        )
        extracted_pages.append(response.choices[0].message.content)
    return "\n\n--- PAGE BREAK ---\n\n".join(extracted_pages)

def parse_denial(text: str) -> dict:
    """Use Qwen3-32B to extract structured denial fields."""
    prompt = f"""Extract the following from this insurance denial letter as JSON:
- payer (insurance company name)
- patient_id (if present)
- denial_code (e.g. "CO-50")
- denial_reason (1 sentence)
- denied_service
- procedure_codes (list of CPT/ICD codes)

Denial letter:
{text}

Respond with ONLY valid JSON, no preamble. /no_think"""
    
    response = llm_client.chat.completions.create(
        model="qwen3-32b",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.1,
    )
    
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
            
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fallback if the model spits out slightly malformed JSON
        return {"payer": "Unknown", "denial_reason": "Failed to parse JSON", "procedure_codes": []}
