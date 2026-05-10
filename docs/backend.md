# DenialDefender Backend Architecture

This document details the backend architecture for DenialDefender, specifically its deployment on the **AMD Developer Cloud** utilizing the **AMD Instinct MI300X** accelerator.

## 1. Infrastructure Setup

The production/demo backend is deployed on an AMD Developer Cloud instance tailored for heavy inference workloads:
- **Instance Type:** `0.17.1-gpu-mi300x1-192gb-devcloud-atl1`
- **GPU:** 1x AMD Instinct MI300X
- **VRAM:** 192 GB HBM3 (5.3 TB/s bandwidth)
- **CPU/RAM:** 20 vCPU / 240 GB RAM
- **Storage:** 720 GB NVMe Boot / 5 TB Scratch
- **OS/Runtime:** Ubuntu 24.04 with ROCm 7.0 and vLLM 0.17.1

## 2. Multi-Model Co-residency on MI300X

DenialDefender operates two distinct models in a single appeal generation pipeline without requiring tensor-parallel multi-GPU sharding. This is made possible by the 192 GB capacity of the MI300X:

1. **Qwen3-32B (Dense, FP16):** The core reasoning engine used for synthesizing context and generating the appeal letter.
2. **Qwen2.5-VL-7B (FP16):** The vision-language model used for OCR and interpreting scanned faxes/PDFs.

### Memory Allocation
Both models run co-resident at full FP16 precision. When a request is processed, the system consumes approximately ~188 GB / 192 GB of VRAM (91% utilization). The vLLM APIServer manages two `EngineCore` processes to orchestrate these models side-by-side with zero inter-device traffic overhead.

## 3. The FastAPI Orchestrator

The main application logic is handled by a FastAPI application running via Uvicorn.
- **Port:** `9000`
- **Routing:** ngrok is used to securely expose the local port `9000` to the public internet (e.g., `https://display-wackiness-gutter.ngrok-free.dev -> http://localhost:9000`).
- **Flow:** The Next.js frontend sends a multipart payload (PDF + optional chart text) to the FastAPI `/api/generate` endpoint. The FastAPI orchestrator handles document ingestion, context retrieval, and sequentially calls the local vLLM server to execute the vision and language tasks.

## 4. Understanding Server "Errors" and Logs

When monitoring the vLLM APIServer or the FastAPI console in the droplet, you may see a stream of `WARNING` or `404 Not Found` messages, such as:

```text
(APIServer pid=288283) WARNING:  Invalid HTTP request received.
(APIServer pid=288283) INFO:     66.132.195.72:17840 - "GET / HTTP/1.1" 404 Not Found
(APIServer pid=288283) INFO:     45.33.72.120:36908 - "GET /.env HTTP/1.1" 404 Not Found
(APIServer pid=288283) INFO:     45.33.72.120:36930 - "GET /.bash_history HTTP/1.1" 404 Not Found
```

### What does this mean?
**These are not application errors.** Because the droplet has a public IP address (and/or because the vLLM server port is exposed), automated internet botnets and vulnerability scanners constantly ping the server looking for exposed configuration files (like `.env`, `config.json`, `.bash_history`). 

Because your server does not serve these files (vLLM only expects specific OpenAI-compatible API routes like `/v1/chat/completions`), it correctly responds with `404 Not Found` or logs an "Invalid HTTP request". 

### Action Required
**None.** This is standard background noise for any server connected to the public internet. The models and the FastAPI orchestrator will continue to function normally. Ensure that your FastAPI endpoint (`/api/generate`) validates payloads properly, and your `.env` files are kept out of public-facing directories, which they already are.
