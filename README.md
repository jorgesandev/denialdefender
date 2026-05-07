<p align="center">
  <h1 align="center">🛡️ DenialDefender</h1>
  <p align="center">
    <strong>Autonomous Insurance Appeals for Hospital Revenue Cycle Teams</strong>
  </p>
  <p align="center">
    <em>We don't charge if we don't recover.</em>
  </p>
  <p align="center">
    <a href="#quick-start">Quick Start</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#demo">Demo</a> •
    <a href="#contributing">Contributing</a> •
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

## Architecture

```
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
│  │ (OCR/VL) │  │ Retrieval│  │           │  │              │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └──────┬───────┘  │
│       └──────────────┴──────────────┴───────────────┘          │
│                           │                                    │
│              ┌────────────▼────────────┐                       │
│              │   Appeal Generation     │                       │
│              │   (Qwen2.5-72B via      │                       │
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
| **Models** | Qwen2.5-72B-Instruct + Qwen2.5-VL-72B (co-resident, FP16, single GPU) |
| **Inference** | vLLM with ROCm backend (prefix caching, paged attention, continuous batching) |
| **Backend** | FastAPI · Python 3.11 · Pydantic |
| **Database** | PostgreSQL 16 + pgvector |
| **Frontend** | Next.js · Tailwind CSS |
| **Deployment** | Hugging Face Space (demo) · Docker Compose (local dev) |

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose
- (For GPU inference) Access to AMD MI300X via [AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html)

### 1. Clone the repo

```bash
git clone https://github.com/jorgesandev/denialdefender.git
cd denialdefender
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start the database

```bash
docker compose up -d
```

### 4. Start the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and the backend API at `http://localhost:8080`.

## Project Structure

```
denialdefender/
├── backend/                 # FastAPI application
│   ├── main.py              # API routes and app entry point
│   └── requirements.txt     # Python dependencies
├── frontend/                # Next.js application
│   ├── app/                 # App Router pages and layouts
│   ├── public/              # Static assets
│   └── package.json
├── data/
│   └── synthetic/
│       └── denials/         # Synthetic denial letters for testing
├── brand/                   # Brand assets (logos, covers)
├── docker-compose.yml       # PostgreSQL + pgvector setup
├── .env.example             # Environment variable template
├── DenialDefender_Project_Brief.pdf
├── LICENSE                  # MIT License
└── README.md
```

## Demo

> 🚧 **Coming soon** — Live demo deploying to Hugging Face Spaces.
>
> The end-to-end demo flow: upload a synthetic denial letter → AI generates a complete appeal packet in ~90 seconds → side-by-side review UI with confidence scoring.

## Why AMD MI300X

DenialDefender's workload is **memory-bandwidth-bound long-context inference** — each appeal requires 130K–650K tokens of context (denial letter + patient chart + payer policy + clinical literature + past appeals). The MI300X is uniquely suited:

- **192 GB HBM3** — co-resident Qwen2.5-72B + Qwen2.5-VL-72B on a single GPU, no quantization compromise
- **5.3 TB/s bandwidth** — 1.6× H100 SXM5, directly translates to lower per-appeal latency
- **4–8× lower per-appeal compute cost** vs. H100-based infrastructure ($1.99–$2.35/GPU-hr vs. $4–$7)
- Contingency pricing requires per-appeal compute in single-digit dollars — MI300X makes that math work

## Data Sources

All data used is **synthetic or open-licensed**. No real PHI is used at any point.

- **Patient charts:** [Synthea](https://synthetichealth.github.io/synthea/) (MITRE, Apache 2.0)
- **Payer policies:** CMS Medicare Coverage Determinations (public domain)
- **Clinical literature:** PubMed Central Open Access Subset
- **Denial letters:** Synthesized from public appeal-writing guides

## Contributing

We welcome contributions! This project is in active development during the AMD Developer Hackathon 2026.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please see our code of conduct and contribution guidelines (coming soon).

## Roadmap

- [x] Project scaffolding and local dev environment
- [ ] End-to-end appeal generation pipeline on MI300X
- [ ] Multimodal denial intake (OCR + vision-language model)
- [ ] Frontend: drag-drop upload + streaming generation UI
- [ ] Hugging Face Space deployment
- [ ] Synthetic dataset (50+ denial scenarios, 5 payers, 8 specialties)
- [ ] Per-payer style transfer and confidence scoring
- [ ] LoRA fine-tuning for payer-specific appeal styles

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author

**Jorge Sandoval** · Team Sophon

[![Portfolio](https://img.shields.io/badge/Portfolio-jorgesandoval.dev-1A2B4A?style=flat-square)](https://jorgesandoval.dev)
[![X](https://img.shields.io/badge/X-@jorgesandev-000000?style=flat-square&logo=x)](https://x.com/jorgesandev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-jorgesandev-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/jorgesandev)
[![Email](https://img.shields.io/badge/Email-contact@jorgesandoval.dev-C8102E?style=flat-square&logo=gmail)](mailto:contact@jorgesandoval.dev)

## Acknowledgements

- **AMD** — MI300X compute via the [AMD Developer Cloud](https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html)
- **Hugging Face** — Model hosting and Spaces deployment
- **lablab.ai** — Hackathon organization and community
- **Qwen Team** — Open-weight models powering the appeal generation pipeline
- **vLLM** — High-performance inference engine with ROCm support

---

<p align="center">
  <strong>Team Sophon</strong> · AMD Developer Hackathon 2026 · Vision & Multimodal AI Track
</p>
