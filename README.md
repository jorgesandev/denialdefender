<p align="center">
  <h1 align="center">🛡️ DenialDefender</h1>
  <p align="center">
    <strong>Autonomous Insurance Appeals for Hospital Revenue Cycle Teams</strong>
  </p>
  <p align="center">
    <em>We don't charge if we don't recover.</em>
    <a href="https://huggingface.co/spaces/lablab-ai-amd-developer-hackathon/denialdefender">
      <img src="https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Space-blue" alt="Hugging Face Space">
    </a>
  </p>
  <p align="center">
    <a href="#quick-start-hybrid-localremote-dev">Quick Start</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#demo">Demo</a> •
    <a href="#hf-space-deployment">HF Space</a> •
    <a href="LICENSE">License</a>
  </p>
</p>

---

> **Built for the [AMD Developer Hackathon 2026](https://lablab.ai/ai-hackathons/amd-developer) · Team Sophon · Vision & Multimodal AI Track**
>
> 🔨 Building in public this week — follow along on [X](https://x.com/jorgesandev) and [LinkedIn](https://linkedin.com/in/jorgesandev).

---

## The Problem

US hospitals leave **$262 billion+** in recoverable revenue on the table every year because writing insurance appeal letters is too slow and too expensive to scale.

| Metric | Value |
|---|---|
| In-network claims denied | **19%** (KFF, 2024) |
| Denials ever appealed | **< 1%** |
| Appeal success rate (when filed) | **44–82%** |
| Stranded recoverable revenue | **$262B+** |

The gap between "denied" and "appealed" is one of the largest unautomated workflows in the US economy.

## The Solution

DenialDefender is an AI system that drafts insurance appeal letters at scale. A billing specialist uploads a denial letter, and within **60–90 seconds** the system produces a complete appeal packet:

- ✅ Medical necessity letter with payer-specific framing
- ✅ Supporting clinical literature with citations
- ✅ Code corrections where applicable
- ✅ Calibrated confidence score for overturn probability
- ✅ Human review before submission — always

**What it is not:** DenialDefender does not diagnose, prescribe, auto-submit appeals, or replace clinical judgment. It produces drafts for trained humans to evaluate and submit.

## Demo

**[Live Demo on Hugging Face Spaces](https://huggingface.co/spaces/lablab-ai-amd-developer-hackathon/denialdefender)**

Upload any insurance denial letter (digital PDF or scanned/faxed image) to see the full pipeline: Qwen2.5-VL-7B reads the document if there's no text layer, four retrievers assemble the context window, and Qwen3-32B writes the appeal. End-to-end in ~60 seconds. Compute cost: ~$0.03.

To run the demo locally: follow the Quick Start steps below, then open `http://localhost:3000`.

## Architecture

```text
┌────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                      │
│   Drag-drop denial upload → Streaming generation → Review UI   │
└──────────────────────────┬─────────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼─────────────────────────────────────┐
│                     Backend (FastAPI)                           │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ Denial   │  │ Patient  │  │ Policy    │  │ Past-Appeal  │  │
│  │ Intake   │  │ Context  │  │ Retrieval │  │ Retrieval    │  │
│  │ (Qwen-VL)│  │ Retrieval│  │           │  │              │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └──────┬───────┘  │
│       └──────────────┴──────────────┴───────────────┘          │
│                           │                                    │
│              ┌────────────▼────────────┐                       │
│              │   Appeal Generation     │                       │
│              │   (Qwen3-32B via        │                       │
│              │    vLLM + ROCm)         │                       │
│              └────────────┬────────────┘                       │
│                           │                                    │
│              ┌────────────▼────────────┐                       │
│              │  Confidence Scoring     │                       │
│              └─────────────────────────┘                       │
└──────────────────────────┬─────────────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────────────┐
│              PostgreSQL + pgvector                              │
│    Patient charts · Payer policies · Clinical literature        │
│    Past successful appeals · Outcome tracking                  │
└────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| **Compute** | AMD Instinct MI300X (192 GB HBM3, 5.3 TB/s) via AMD Developer Cloud |
| **Models** | Qwen3-32B (Reasoning) + Qwen2.5-VL-7B (Vision) |
| **Inference** | vLLM with ROCm backend (Co-resident on a single GPU) |
| **Backend** | FastAPI · Python 3.12 · Pydantic · pdfplumber |
| **Database** | PostgreSQL 16 + pgvector |
| **Frontend** | Next.js · Tailwind CSS |

## Quick Start (Hybrid Local/Remote Dev)

DenialDefender uses a hybrid dev environment: the heavy AI compute runs on a remote AMD MI300X droplet, while the FastAPI and Next.js applications run locally on your machine for rapid iteration.

### Prerequisites

- Python 3.12 (Highly recommended for stable wheel builds)
- Node.js 20+
- Access to an AMD MI300X Droplet with vLLM installed
- Mac Users: `brew install poppler` (Required for local PDF processing)

### 1. Clone the repo

```bash
git clone https://github.com/jorgesandev/denialdefender.git
cd denialdefender
```

### 2. Set up environment variables

```bash
cp .env.example backend/.env
# VLLM_LLM_URL and VLLM_VL_URL default to localhost — correct for SSH tunnel setup

cp .env.example frontend/.env.local
# Only NEXT_PUBLIC_API_URL is read by Next.js; the others are ignored
```

### 3. Establish the GPU Tunnel
Forward the remote vLLM ports to your local machine so your backend can communicate with the MI300X:
```bash
ssh -L 8000:localhost:8000 -L 8001:localhost:8001 root@<your-droplet-ip>
```
*(Leave this terminal running in the background).*

### 4. Start the Backend (FastAPI)
Create an isolated Python 3.12 virtual environment, install dependencies, and boot the server:
```bash
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run the modular application
uvicorn app.main:app --reload --port 9000
```

### 5. Start the Frontend (Next.js)
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The Next.js frontend runs at `http://localhost:3000` and talks to the FastAPI backend at `http://localhost:9000`.

## Frontend (Quick Reference)

The frontend is a Next.js 16 App Router project styled with Tailwind CSS and uses an "Executive Light" theme (see `docs/frontend.md` for details). Key notes:

- **Primary files:** [docs/frontend.md](docs/frontend.md) documents theme, components, and run instructions.
- **Logo/brand:** `frontend/public/brand/logos/logo-with-text-hq.png` — change sizing in [frontend/app/components/Navbar.tsx](frontend/app/components/Navbar.tsx) and colors/padding in [frontend/app/globals.css](frontend/app/globals.css).
- **Env:** set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to point the UI at your backend.

Run locally:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## HF Space Deployment

The `hf_space/` directory is a self-contained Gradio app that proxies to the FastAPI backend. The backend stays on your droplet; the Space just wraps it in a public UI.

### 1. Expose FastAPI publicly

```bash
# On the droplet (or locally if tunneled):
pip install pyngrok
ngrok http 9000
# Copy the https://xxxx.ngrok.app URL
```

### 2. Push to Hugging Face

```bash
# Create a new Space at huggingface.co/new-space (Gradio, public)
# then push hf_space/ as its repo root:
cd hf_space
git init
git remote add origin https://huggingface.co/spaces/<your-org>/<space-name>
git add .
git commit -m "feat: initial DenialDefender Space"
git push -u origin main
```

### 3. Set the secret

In your Space settings → **Secrets**, add:

| Key | Value |
|---|---|
| `NGROK_URL` | `https://xxxx.ngrok.app` |

The Space reads this at runtime to route requests to your live FastAPI instance.

## Project Structure

```text
denialdefender/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI routes — orchestrates the full pipeline
│   │   ├── ingest.py        # PDF text extraction; falls back to Qwen2.5-VL-7B for scans
│   │   ├── retrieval.py     # Four retrievers: chart, policy, literature, past appeals
│   │   └── prompts.py       # System prompt + prompt builder for Qwen3-32B
│   ├── requirements.txt
│   └── test_api.py          # Quick smoke-test script
├── frontend/                # Next.js 16 + Tailwind 4
│   ├── app/
│   │   ├── page.tsx         # Two-panel UI: upload → generated appeal
│   │   └── layout.tsx
│   └── .env.local           # NEXT_PUBLIC_API_URL (not committed)
├── hf_space/                # Hugging Face Space deployment
│   ├── app.py               # Gradio interface — proxies to FastAPI via NGROK_URL
│   ├── requirements.txt
│   └── README.md            # Space card (frontmatter + description)
├── data/
│   ├── synthetic/           # Five synthetic denial cases (PDF + chart)
│   ├── payer_policies.json  # Payer-specific policy excerpts keyed by denial code
│   └── past_appeals.json    # Winning appeal excerpts for few-shot retrieval
├── screenshots/             # rocm-smi captures for social posts
├── media/                   # Screen recordings for demo (not committed)
├── internal_logs/
│   └── friday_log.md        # Running build log — commands, blockers, decisions
├── .env.example             # Annotated template for all env vars
└── README.md
```

## Why AMD MI300X?

DenialDefender's workload is **memory-bandwidth-bound long-context inference**. Each appeal requires ingesting massive context windows (denial letter + patient chart + payer policy + clinical literature + past appeals). 

The MI300X is uniquely suited for this architecture:
- **192 GB HBM3**: Allows us to run a 32-billion parameter reasoning model AND a 7-billion parameter vision model *co-resident* on a single GPU in FP16, with zero quantization compromise.
- **5.3 TB/s bandwidth**: Crucial for rapidly processing 40K+ token context windows to hit our 90-second SLA.
- **Unit Economics**: Contingency pricing requires per-appeal compute in single-digit dollars. The MI300X makes that math work at scale.

## Data Sources
All data used is **synthetic or open-licensed**. No real PHI is used at any point.
- **Patient charts:** Synthea (MITRE, Apache 2.0)
- **Payer policies:** CMS Medicare Coverage Determinations
- **Clinical literature:** PubMed Central Open Access Subset

## License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author

**Jorge Sandoval** · Team Sophon

[![Portfolio](https://img.shields.io/badge/Portfolio-jorgesandoval.dev-1A2B4A?style=flat-square)](https://jorgesandoval.dev)
[![X](https://img.shields.io/badge/X-@jorgesandev-000000?style=flat-square&logo=x)](https://x.com/jorgesandev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-jorgesandev-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/jorgesandev)
[![Email](https://img.shields.io/badge/Email-contact@jorgesandoval.dev-C8102E?style=flat-square&logo=gmail)](mailto:contact@jorgesandoval.dev)

---
<p align="center">
  <strong>Team Sophon</strong> · AMD Developer Hackathon 2026 · Vision & Multimodal AI Track
</p>