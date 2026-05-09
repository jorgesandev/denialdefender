import gradio as gr
import requests
import os

API_URL = os.environ.get("NGROK_URL", "http://localhost:9000")


def generate_appeal(pdf_file, chart_notes: str = ""):
    if pdf_file is None:
        return "Please upload a denial letter PDF.", ""

    try:
        with open(pdf_file, "rb") as f:
            r = requests.post(
                f"{API_URL}/api/generate",
                files={"denial_pdf": (os.path.basename(pdf_file), f, "application/pdf")},
                data={"chart_text": chart_notes or ""},
                timeout=180,
            )
        r.raise_for_status()
    except requests.exceptions.Timeout:
        return "Request timed out (>3 min). The model may still be warming up — try again.", ""
    except requests.exceptions.RequestException as e:
        return f"Backend error: {e}", ""

    j = r.json()
    denial = j.get("denial", {})

    meta_parts = [
        f"Payer: {denial.get('payer', 'N/A')}",
        f"Denial Code: {denial.get('denial_code', 'N/A')}",
        f"Service: {denial.get('denied_service', 'N/A')}",
        f"Generated in: {j.get('elapsed_seconds', '?')}s",
    ]
    if j.get("was_scanned"):
        meta_parts.append("Vision model used (scanned PDF)")

    context_chars = j.get("context_size_chars", 0)
    if context_chars:
        meta_parts.append(f"Context: ~{context_chars // 4:,} tokens")

    meta_parts.append("Models: Qwen3-32B (language) + Qwen2.5-VL-7B (vision) · AMD MI300X · FP16")

    return j.get("appeal", "No appeal generated."), "\n".join(meta_parts)


demo = gr.Interface(
    fn=generate_appeal,
    inputs=[
        gr.File(
            label="Insurance Denial Letter (PDF)",
            file_types=[".pdf"],
        ),
        gr.Textbox(
            label="Patient Chart Notes (optional)",
            placeholder="Paste relevant chart text — diagnoses, lab values, treatment history...",
            lines=4,
        ),
    ],
    outputs=[
        gr.Textbox(label="Generated Appeal Letter", lines=30, show_copy_button=True),
        gr.Textbox(label="Pipeline Metadata"),
    ],
    title="DenialDefender",
    description=(
        "**Autonomous insurance appeal generation for hospital revenue cycle teams.**\n\n"
        "Upload a denial letter (digital PDF or scanned/faxed) → receive a submission-ready appeal letter in ~60 seconds.\n\n"
        "**Architecture:** Qwen3-32B + Qwen2.5-VL-7B co-resident on a single AMD MI300X via vLLM 0.14 with ROCm 7.0. "
        "Full FP16, no quantization. ~129GB / 192GB VRAM. ~$0.03 compute per appeal.\n\n"
        "Built for the AMD Developer Hackathon 2026."
    ),
    allow_flagging="never",
)

if __name__ == "__main__":
    demo.launch()
