# DenialDefender: Backend Orchestrator

This is the FastAPI backend for DenialDefender, optimized for high-performance inference on the **AMD Instinct™ MI300X**. It orchestrates the end-to-end RAG pipeline, bridging the multimodal intake and the reasoning generation.

## Prerequisites

- **Python 3.12+**
- **ROCm™ 6.2+** (For GPU-accelerated inference)
- **vLLM Server**: A dual-model vLLM instance hosting **Qwen2.5-32B-Instruct** and **Qwen2.5-VL-7B**.
- **Poppler**: Required for PDF text extraction (`brew install poppler` on macOS).

## Project Structure

The backend is organized into functional modules within the `app/` directory:

- `main.py`: The FastAPI entry point and route orchestrator.
- `ingest.py`: Multimodal document intake (OCR + extraction).
- `retrieval.py`: The four-pillar RAG engine.
- `prompts.py`: Professional clinical prompt templates.

## Local Development Setup

1. **Environment Initialization**:
   ```bash
   cd backend
   python3.12 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configuration**:
   Copy `.env.example` to `backend/.env` and configure your `VLLM_LLM_URL` and `VLLM_VL_URL`.

3. **Running the Orchestrator**:
   ```bash
   uvicorn app.main:app --reload --port 9000
   ```

## Production Architecture (AMD MI300X)

In the production droplet:
1. **vLLM Engine**: Co-resident models run in FP16, utilizing 192GB of HBM3.
2. **FastAPI**: Runs as the primary API interface on port `9000`.
3. **Public Exposure**: Securely tunneled via `ngrok` or served via reverse proxy.

## API Documentation

- **`GET /health`**: Verifies backend readiness and vLLM connectivity.
- **`POST /api/generate`**:
  - **Payload**: `multipart/form-data`
  - **Fields**: `file` (PDF/Image), `chart_text` (Optional clinical context).
  - **Output**: Streaming JSON containing metadata, extracted denial data, and the final synthesized appeal.

## Monitoring & Safety

- **Logs**: Automated scanner noise (404s on `.env`, etc.) is filtered by the orchestrator and does not impact system performance.
- **VRAM**: Monitored via `rocm-smi` to ensure co-resident models maintain healthy KV cache headroom.

---
See the [Backend Deep Dive](../docs/backend.md) for detailed infrastructure specifications.
