# DenialDefender Backend

This is the FastAPI backend orchestrator for DenialDefender. It acts as the bridge between the Next.js frontend, the PostgreSQL/pgvector database, and the vLLM server running the Qwen models on the AMD Instinct MI300X.

## Prerequisites

- **Python 3.11+**
- **vLLM Server:** A running instance of vLLM serving Qwen3-32B and Qwen2.5-VL-7B (typically running locally on the AMD Developer Cloud droplet).
- **PostgreSQL + pgvector:** For storing and retrieving context (managed via `docker-compose.yml` in the root).

## Local Development Setup

1. **Activate the Virtual Environment:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   *(Ensure you have libraries like `fastapi`, `uvicorn`, `pydantic`, `python-multipart`, and any necessary OpenAI/vLLM client libraries).*

3. **Environment Variables:**
   Create a `.env` file in the `backend` directory containing your local configurations:
   ```env
   VLLM_API_BASE=http://localhost:8000/v1
   DATABASE_URL=postgresql://user:password@localhost:5432/denialdefender
   ```

## Running the Server

Start the FastAPI server via Uvicorn on port `9000`:
```bash
uvicorn app.main:app --reload --port 9000
```

The API will be available at `http://127.0.0.1:9000`.

## Cloud Deployment (AMD Developer Cloud)

In the production/demo environment (AMD MI300X Droplet):
1. **vLLM Engine:** The vLLM APIServer runs as a background process, utilizing ~188GB of VRAM to host both Qwen models in FP16.
2. **FastAPI Server:** Run `uvicorn app.main:app --port 9000` (often within a `tmux` session).
3. **Public Exposure:** We use `ngrok` to expose the local `9000` port to a secure public URL, which the Next.js frontend calls.
   ```bash
   ngrok http 9000
   ```

## API Endpoints

- `GET /health` : Returns the health status of the orchestrator and verifies connectivity to the vLLM server.
- `POST /api/generate` : The core endpoint. Accepts a `multipart/form-data` payload containing `denial_pdf` (file) and `chart_text` (string). Returns a JSON payload containing the synthesized appeal, extracted denial metadata, and pipeline execution metrics.

## Troubleshooting

- **404 Not Found on /.env, /.bash_history, etc.:** If you see these in your droplet logs, it is automated internet bot scanners hitting the public IP. **This is normal and can be safely ignored.**
- **vLLM OOM (Out of Memory):** Verify using `rocm-smi` that VRAM utilization is below 192GB. Ensure KV cache sizing in the vLLM startup script leaves sufficient headroom.
