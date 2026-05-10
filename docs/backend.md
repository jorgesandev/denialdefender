# DenialDefender: Backend Architecture & Infrastructure

This document provides a technical deep-dive into the DenialDefender backend, optimized for the **AMD Instinct™ MI300X** accelerator on the **AMD Developer Cloud**.

## 1. Production Infrastructure

DenialDefender is architected to leverage the massive memory bandwidth and capacity of the MI300X.

- **Accelerator:** 1x AMD Instinct™ MI300X (192 GB HBM3, 5.3 TB/s)
- **Host System:** 20 vCPU / 240 GB RAM / 5 TB NVMe Scratch
- **OS/Runtime:** Ubuntu 24.04, ROCm™ 6.2+, vLLM 0.6.3+
- **API Framework:** FastAPI (Python 3.12)

## 2. Multi-Model Co-residency

The hallmark of the DenialDefender architecture is the ability to run two large-scale models co-resident on a single GPU without quantization. This eliminates inter-device communication latency and maximizes throughput.

| Model | Role | Precision | VRAM Footprint |
|---|---|---|---|
| **Qwen2.5-32B-Instruct** | Reasoning, Context Synthesis, Appeal Drafting | FP16 | ~64 GB |
| **Qwen2.5-VL-7B** | Multimodal OCR, Scan Interpretation, Layout Analysis | FP16 | ~14 GB |
| **KV Cache & Overhead** | Context windows for RAG (40k+ tokens) | - | ~100 GB |

By utilizing the 192 GB HBM3 capacity, we maintain a persistent hot cache for both models, enabling end-to-end processing (OCR + RAG + Generation) in under 90 seconds for complex medical cases.

## 3. The Orchestration Pipeline

The backend follows a modular, asynchronous design:

1. **Intake (`ingest.py`)**: Receives PDF/Image uploads. Uses `pdfplumber` for digital text and falls back to `Qwen2.5-VL` for scanned/faxed documents.
2. **Retrieval (`retrieval.py`)**: A four-pillar RAG system:
   - **Patient Context**: Extracts relevant clinical spans from the chart.
   - **Payer Policy**: Matches denial codes against a knowledge base of insurance rules.
   - **Past Appeals**: Identifies winning rhetorical patterns from successful historical cases.
   - **Medical Literature**: Injects peer-reviewed citations for clinical justification.
3. **Synthesis (`prompts.py`)**: Constructing a high-fidelity context window for the reasoning model.
4. **Generation**: Streaming output via vLLM to the frontend.

## 4. Operational Monitoring

The FastAPI orchestrator runs on port `9000`. In development and hackathon environments, we utilize **ngrok** to securely tunnel this port for the frontend and Hugging Face Space.

### Security & Noise
When monitoring the vLLM or FastAPI logs on a public-facing droplet, you will observe `404 Not Found` entries from automated internet scanners.
- **Status**: These are non-impacting background noise.
- **Validation**: The system only accepts valid multipart/form-data payloads at the `/api/generate` endpoint.

## 5. Deployment Notes

To boot the backend in a production-ready state:
```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 9000
```
