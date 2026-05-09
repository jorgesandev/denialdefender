# DenialDefender
**Autonomous Insurance Appeals for Hospital Revenue Cycle Teams**
*We don't charge if we don't recover.*

**Project Brief v2**
*AMD Developer Hackathon 2026*
*Team Sophon*
*Vision and Multimodal AI Track*

## 1. Executive Summary

US hospitals and physician practices leave hundreds of billions of dollars in recoverable revenue on the table every year because writing insurance appeal letters is too slow and too expensive to scale. The economics of denials are well understood inside healthcare and almost invisible outside it. Insurers know that nearly every patient and most providers will give up before mounting a full appeal, even though appeals, when filed, succeed at remarkably high rates.

DenialDefender is the autonomous appeals layer for hospital revenue cycle management. A clinic or RCM service uploads a denial letter; we ingest the denial, the patient chart, the payer's medical policy, the relevant clinical literature, and the bank of past successful appeals at that payer, and we draft a submission-ready appeal packet (medical necessity letter, code corrections, supporting evidence, payer-specific phrasing) in minutes instead of days.

We sell to hospital revenue cycle teams and to the third-party RCM services they outsource billing to (R1 RCM, Waystar, Ensemble, Conifer, and the long tail). We charge on contingency: a percentage of recovered revenue. Customers have zero downside, and our incentives are perfectly aligned with theirs.

| Metric | Value | Source |
| :--- | :--- | :--- |
| In-network claims denied | 19% | KFF, 2024 ACA marketplace data |
| Denials ever appealed | Less than 1% | KFF, 2024 |
| Appeal success rate when filed | 44 to 82% | HFMA / Premier 2024; KFF |
| Stranded recoverable revenue | $262B+ annually | KFF + Premier hospital data |

This brief makes the case for why this problem is real, why it is unsolved, why now is the moment, and why AMD Instinct MI300X is not just a fine choice for the workload but the single most important architectural enabler of the product's economics.

## 2. The Problem

Every claim a US healthcare provider submits goes through a payer review process that can deny it for medical, administrative, coding, prior authorization, or unspecified reasons. Denial rates have climbed every year of the past decade, the cost to rework each denial has climbed with it, and the gap between denials filed and denials appealed has widened into one of the largest unautomated workflows in the US economy.

### The denial rate is rising, not falling

KFF's analysis of CMS Transparency in Coverage data shows a 19% in-network denial rate and 37% out-of-network denial rate on ACA marketplace plans in 2024, with significant variation across insurers. Some major payers denied more than a third of claims.

Provider-reported numbers are even more alarming. Experian Health's 2025 State of Claims survey of 250 revenue cycle leaders found that 41% of providers report denial rates above 10%, up from 30% in 2022. Among hospital systems specifically, Premier Inc. reported an average initial denial rate of 15% across surveyed hospitals.

> "Health claims are still stuck in a cycle of denials, delays and data errors. 41% of survey respondents said that at least one in ten claims is denied. That's a lot of rework and lost revenue that providers were counting on." *(Experian Health, State of Claims Report 2025)*

### Almost no one appeals, even though appeals work

This is the fact that breaks the economics open. KFF reports that fewer than 1% of denied ACA marketplace claims are ever appealed by patients. On the provider side, only roughly 12% of Medicare Advantage prior auth denials are appealed, and just 6.4% in fee-for-service Medicare.

Yet when appeals are filed, they win at extraordinary rates:
- **Medicare Advantage appeals:** 81.7% of appealed denials overturned, full or partial (HFMA / Premier 2024).
- **Commercial payer appeals:** 54.3% overturned.
- **ACA marketplace internal appeals:** 44% upheld in patient's favor; an additional 27% overturned at external review.
- Some state-level analyses show 60 to 80% overturn rates.

Translation: when providers actually file the appeal, they get paid more often than not. The reason they don't file is simple. Appeals are slow, expensive, and don't scale.

### The cost to rework a denial is breaking RCM teams

Industry estimates put the cost to rework a single denied claim between $25 and $118, with the most-cited figure landing at $43 to $48 per denial. Multiplied across the approximately 600 million claims denied annually in the US, that's over $19 billion in pure administrative waste before any clinical decision is even revisited.

AKASA's revenue cycle management survey ranks denial management as the single most time-consuming RCM task. Industry consolidation around RCM service companies (R1, Waystar, Ensemble, Conifer) reflects providers' inability to staff this work in-house at scale. Even those services are still running offshore appeal-writing teams as their core operational model.

### Why the gap exists

Writing a competent appeal letter requires reading and synthesizing five distinct document categories: the denial letter itself, the patient's full chart, the payer's specific medical policy bulletin for that procedure, the relevant clinical literature establishing medical necessity, and the bank of past appeals (what has worked at this payer, in this specialty, for this code, this year). 

A skilled human takes 45 to 90 minutes per appeal. The math on $43 per rework only works because most denials never get appealed at all.

## 3. The Market

US healthcare is a $5 trillion annual market, of which roughly $1.5 trillion flows through claim-and-reimbursement workflows. That flow is where DenialDefender lives. The buyer is not the patient and not the doctor. The buyer is the financial operations team that gets measured on recovery rate.

### Sizing the opportunity

Roughly 3.6 billion medical claims are processed in the US each year. Applying conservative payer-mix-weighted denial rates gives approximately 600 million denied claims annually. Premier Inc.'s 2024 hospital survey put the average denied-claim value at slightly over $5,000. Multiplying gives an initially-denied claim base in the range of $250 to $300 billion per year.

Industry estimates place 60 to 65% of denials as recoverable on appeal, but only roughly 35% of denials are ever appealed in any form. The remaining 65% of recoverable denials, never appealed at all, represent the structural waste DenialDefender targets.

| Layer | Calculation | Annual value |
| :--- | :--- | :--- |
| Total denied claims (US, all payers) | ~600M claims x ~$5K avg | ~$262 billion |
| Recoverable share | 65% recoverable | ~$170 billion |
| Currently appealed | 35% of recoverable filed | ~$60 billion (filed) |
| Stranded recoverable revenue | 65% of recoverable never filed | ~$110 billion |
| Conservative SOM (5%) | Year-3 target | ~$5.5 billion |

These numbers are not aspirational. They are the floor. They exclude commercial-plan claims (where transparency data is incomplete), employer-sponsored plans, and international markets. The MGMA estimates that two-thirds of denials are recoverable when practices have the right systems; the gap between recoverable and recovered is exactly the wedge.

### The buyer landscape

The US has roughly 6,100 hospitals and around 230,000 physician practices. The high-leverage sales channel is not direct to either of those. It runs through the RCM service companies that already process billions of claims on their behalf:
- **R1 RCM:** ~$2.5B annual revenue, processes claims for 94 of the largest US health systems.
- **Waystar:** public, ~$6B market cap as of 2026, serves 1M+ providers.
- **Ensemble Health Partners:** private, $7B+ valuation.
- **Optum / Change Healthcare:** UnitedHealth-owned, dominant market position.
- **Conifer Health Solutions, Athenahealth, AdvancedMD, Tebra,** and a long tail of mid-market and specialty-vertical players.

These companies' business model is recovery-rate uplift. Every additional point of recovery is direct margin. They are structurally the right initial customers for a contingency-priced AI appeal layer.

### Tailwinds

- **CMS Interoperability and Prior Authorization Final Rule:** Finalized in early 2024, payers must expose prior authorization decisions and denial data via FHIR APIs by January 2027. This is the data layer DenialDefender needs and that no incumbent has been engineered around.
- **Public sentiment shift:** Following the December 2024 killing of UnitedHealthcare CEO Brian Thompson, denial practices have entered mainstream political discourse for the first time in a generation. A January 2026 KFF poll shows 66% of insured adults consider denials a major problem. Bipartisan congressional pressure is real and rising.
- **Payer voluntary commitments:** In June 2025, major insurers publicly pledged to fix the broken prior authorization system, but follow-through has been limited. The political cost of inaction is now meaningful.
- **LLM capability threshold crossed:** Long-context regulated-text reasoning at the level appeals require was not feasible at production quality before late 2024. The window opened recently.

## 4. The Solution: What DenialDefender Is

DenialDefender is an AI system that drafts insurance appeal letters at scale. The user (a billing specialist or RCM analyst) uploads a denial letter and authorizes access to the relevant patient record. The system reads everything required to write a competent appeal and produces a submission-ready packet for human review.

### What the user does

1. **Drag and drop:** The denial letter (PDF, image, or fax scan). DenialDefender extracts the denial reason, denial code, payer, plan, and relevant patient identifiers.
2. **Authorize chart access:** The system reads the relevant clinical record: physician notes, lab results, imaging reports, prior auth history.
3. **Review the draft:** Within 60 to 90 seconds the system produces a complete appeal packet: medical necessity letter with payer-specific framing, supporting clinical literature with citations, code corrections where applicable, and a confidence score.
4. **Submit:** Human reviewer signs off; the packet is filed via fax, portal, or API depending on the payer.
5. **Track and learn:** Outcomes feed back into the system. The model learns what wins at each payer, in each specialty, for each denial code.

### What is in the box

- **Multimodal denial intake:** OCR for scanned and faxed denial letters, structured extraction for digital ones, vision-language interpretation for handwritten or low-quality scans.
- **Long-context evidence assembly:** Patient chart, payer's specific Medical Policy Bulletin, supporting peer-reviewed literature, and historical successful appeals, all loaded into a single working context window served by Qwen3-32B on a single MI300X.
- **Payer-specific style transfer:** Aetna-style, UnitedHealth-style, BCBS-style. Different payers respond to different rhetorical structures and citation patterns; we learn each.
- **Confidence calibration:** Each generated appeal carries a calibrated probability of overturn at this payer, given features of the denial and the evidence assembled. Allows the RCM team to triage.
- **Outcome tracking and learning loop:** Every appeal generates structured outcome data; per-payer overturn rates feed back into model selection and prompt strategy.

### What it is not

Boundaries matter, especially in healthcare AI. DenialDefender does not diagnose, does not prescribe, does not auto-submit appeals without human review, does not replace the clinician's medical judgment, and does not make coverage determinations. It produces drafts for trained humans to evaluate and submit. This positioning is identical to how Hippocratic AI and other regulated-AI healthcare players have established trust with payers and providers.

### Demo flow (the version judges see live)

On stage in San Francisco, a real (synthetic, HIPAA-clean) denial letter is dragged into the interface. Within 90 seconds, DenialDefender produces a 2-page appeal letter with cited clinical evidence, payer-specific phrasing, and code corrections. We show the actual context size loaded into MI300X memory and the co-residency of the language and vision models on a single device, a configuration no NVIDIA-based competitor can match on a single GPU.

## 5. Who It's For (Buyer Personas + GTM)

Healthcare software lives or dies on buyer selection. The best technology pointed at the wrong buyer becomes a graveyard. DenialDefender targets two buyer segments and explicitly avoids a third.

### Primary buyer 1: RCM service companies

Companies like R1 RCM, Waystar, Ensemble Health Partners, Conifer, and a long tail of mid-market RCM services process billing on behalf of hospitals and physician groups. Their entire P&L is driven by recovery rate uplift. A 1-point improvement in recovery is direct margin to them and a sticky retention story for their customers.

These companies already have integration teams, security review processes, and procurement infrastructure that can absorb a vendor like DenialDefender. They are not selling to doctors. They are selling to CFOs, exactly like we are.

- **Sales motion:** design partner program with one mid-market RCM service (200 to 500 hospital clients), prove recovery uplift in a 90-day pilot on a defined claim set, expand to enterprise contract.
- **Initial deal size:** $250K to $1M ARR; expansion potential 5 to 10x per logo.

### Primary buyer 2: Hospital systems (200 to 1,000 beds)

Mid-market hospital systems run RCM in-house and lose tens of millions per year in unrecovered denials. The buyer inside the hospital is the VP of Revenue Cycle, who reports to the CFO and whose KPI is net collection rate. They have budget authority for tools that demonstrably improve recovery.

The pitch is not *replace your team*. RCM teams are protective of their roles. The pitch is *give your team 10x output capacity*. An appeals specialist who can review and submit 60 high-quality appeals per week instead of 8 is more productive, not displaced.

- **Deal size:** $50K to $500K ARR per system, scaling with bed count and payer mix.

The 6,100 US hospitals plus the largest physician group practices represent a $1B+ direct serviceable market once channel is established.

### Who we explicitly do not sell to

Solo doctors and small clinics (under 5 providers) feel the pain most acutely but are the worst possible customer. They have no procurement process, no IT, no budget for SaaS, and the LTV math does not work. Every healthcare startup graveyard is full of we'll-sell-to-small-clinics pitches. We acknowledge this segment exists, route them to partner products (a freemium tier or a referral to ReachRx-style platforms), and stay focused on the buyers who can pay.

### The wedge

*We don't charge if we don't recover.* We take a percentage of revenue we restore that you would otherwise have written off. Zero upfront. Zero downside. We win when you win.

This sentence makes the deal close. CFOs cannot say no to a vendor that costs nothing if it does nothing. It also disqualifies us, gracefully, from customers whose denial volumes are too small to be worth it, which is exactly the segmentation we want.

## 6. Business Model

### Pricing: contingency, not seats

DenialDefender charges a percentage of recovered revenue (industry-standard contingency pricing in the 8 to 15% range, depending on segment and volume). RCM service companies negotiate the lower end (8 to 10%) at scale; mid-market hospital systems pay closer to 12 to 15% on a smaller base.

The pricing matches how the RCM industry already buys. This is not the SaaS-default model and that is the point. Seat-based pricing creates procurement friction in a buyer that already runs SaaS budget audits quarterly. Contingency pricing turns the conversation from *how much does this cost* to *how much do you find*, which is the question RCM leaders want to be asked.

### Unit economics: illustrative

Consider a representative 250-bed community hospital:

| Variable | Value |
| :--- | :--- |
| Annual claim volume | ~120,000 claims |
| Initial denial rate (15%) | ~18,000 denied claims |
| Average denied claim value | $5,200 |
| Total denied claim value annually | ~$93.6M |
| Currently appealed (35%) and recovered (54%) | ~$17.7M recovered |
| Stranded recoverable revenue (65% never appealed x 60% recoverable) | ~$36.5M |
| DenialDefender uplift target (recover 30% of stranded) | ~$11M new recovery |
| Our take at 12% contingency | $1.32M ARR per system |

Even discounting that example by half for early-stage execution risk gives $600K to $700K ARR per mid-market hospital. Closing 10 hospitals in year one is $6 to $7M ARR. Closing one mid-tier RCM service company with 200 client hospitals is meaningfully more. The unit economics support a Series A in year two on conservative assumptions.

### Defensibility

- **Proprietary outcome data:** Every appeal we generate produces a structured win/loss outcome tied to payer, specialty, denial code, and rhetorical strategy. Within 12 months we hold the largest dataset of what wins on appeal in the industry, per payer, per code. This is the moat.
- **Per-customer learning loop:** The model improves on the customer's actual claim mix, not generic data. Switching costs accumulate. A year of fine-tuning on a hospital's payer mix is not portable.
- **Network effects across payers:** What wins at Aetna teaches us something about what wins at UnitedHealth. Cross-payer pattern transfer compounds across the customer base.
- **CMS data tailwind:** When the Interoperability Rule's payer API requirement takes effect in 2027, customers who have already onboarded with us inherit a structured-denial-data advantage immediately.

### Acquisition logic

R1 RCM, Waystar, Optum, athenahealth, and the major hospital RCM platforms all need this capability and are not going to build it from scratch in time. The exit path through strategic acquisition is well-paved by recent comparables: Cohere Health at ~$589M valuation on the payer side, Harvey AI at $5B in legal AI, Abridge at $5.3B in clinical scribing.

A focused vertical AI company with proprietary outcome data and recurring contingency revenue is exactly the asset profile these acquirers pay premium multiples for.

## 7. Why AMD Instinct MI300X: The Technical Case

The economics of DenialDefender depend on producing high-quality, regulated-domain text from very large multi-document working contexts at low marginal cost per appeal. The hardware choice is not an afterthought; it is load-bearing. AMD's Instinct MI300X is, in our analysis, the only commodity-priced GPU that makes the unit economics of contingency-priced appeals work today.

### 7.1. Workload characterization

A single appeal generation pass requires the model to attend over the following document set:

| Input document | Typical size | Token estimate |
| :--- | :--- | :--- |
| Denial letter | 5 to 20 pages | 2K to 8K |
| Patient chart (relevant span) | 50 to 500 pages | 20K to 200K |
| Payer Medical Policy Bulletin | 10 to 50 pages | 5K to 25K |
| Supporting clinical literature (5 to 15 papers) | 200 to 800 pages | 80K to 320K |
| Bank of past successful appeals at this payer | 10 to 50 docs | 20K to 100K |
| **TOTAL working context per appeal** | | **~130K to 650K tokens** |

This working set is real. RAG-based chunking degrades appeal quality measurably because the rhetorical force of a medical necessity letter depends on coherent cross-document reasoning. The patient's specific lab values cited in the same paragraph as the payer's specific policy clause, supported by the specific paper that establishes standard of care, framed in the rhetorical pattern that has historically won at this payer. Chunking breaks that. We need the entire context resident.

For the hackathon demo, working contexts are bounded at 64K tokens, sufficient to demonstrate the architectural pattern while keeping inference latency under 90 seconds end-to-end. The full 250K to 650K production envelope is enabled by the same hardware via FP8 quantization paths discussed in §7.6.1.

### 7.2. MI300X capacity advantage

The MI300X carries 192 GB of HBM3 on a single device. The architectural question is not whether a single large model fits. That comparison favors MI300X but does not capture the operational reality of a production multimodal pipeline. The relevant comparison is whether a complete inference stack (language model plus vision model plus working KV cache for long contexts) fits on a single device.

| GPU | Memory | Bandwidth | Qwen3-32B FP16 + Qwen2.5-VL-7B FP16 + 64K KV cache (~129 GB)? |
| :--- | :--- | :--- | :--- |
| **AMD Instinct MI300X** | 192 GB HBM3 | 5.3 TB/s | **Yes.** Single device, ~63 GB headroom. |
| NVIDIA H200 SXM | 141 GB HBM3e | 4.8 TB/s | Tight. No operational headroom. |
| NVIDIA H100 SXM | 80 GB HBM3 | 3.35 TB/s | No. Requires 2+ GPUs and tensor-parallel sharding. |
| NVIDIA A100 80GB | 80 GB HBM2e | 2.0 TB/s | No. Same as H100 plus bandwidth-limited. |

Co-residency on a single device is not a benchmarking nicety. It eliminates inter-device traffic between vision and language stages of the pipeline, the dominant latency cost in multimodal RAG systems. On NVIDIA-equivalent setups, the same workload requires either multi-GPU sharding (which doubles the per-appeal compute cost) or aggressive INT4 quantization (which regulated-healthcare customers reject for clinical text).

### 7.3. Bandwidth advantage on memory-bound inference

Long-context decoder inference is memory-bandwidth-bound, not compute-bound. The MI300X's 5.3 TB/s of HBM3 bandwidth is approximately 1.6x the H100 SXM5's 3.35 TB/s and ~1.1x the H200's 4.8 TB/s.

For workloads where the model spends most of its time streaming KV-cache across the memory hierarchy, exactly our case, this translates directly into lower per-appeal latency, which translates directly into per-appeal compute cost. AMD's published Llama 3 70B benchmarks show MI300X running the model in FP16 on a single device where H100 SXM5 80 GB cannot. Even at INT8 quantization on H100 the KV-cache pressure forces compromises that affect generation quality on long sequences.

### 7.4. Co-resident multi-model architecture

DenialDefender uses two distinct models in a single appeal generation pipeline:
- **Qwen3-32B (dense, FP16, ~64 GB):** long-context reasoning, evidence synthesis, and appeal letter generation. The dense architecture is deliberate. For grounded long-form writing where every cited fact must be traceable to retrieved evidence, dense models attend more uniformly across context than mixture-of-experts alternatives.
- **Qwen2.5-VL-7B (FP16, ~15 GB):** vision-language model for handwritten chart pages, scanned EOBs, and faxed denial letters where text-layer extraction is insufficient.

On a single MI300X with 192 GB, both models are co-resident in FP16 with split GPU memory allocation (0.65 / 0.25 utilization split, ~10% headroom). The handoff from vision-extracted denial intake to language-driven appeal generation happens with no inter-device traffic. Total VRAM footprint with 64K-token KV cache: ~129 GB of 192 GB available.

NVIDIA-based equivalent setups face a forced choice: aggressive quantization (FP8 or INT4), which regulated-domain customers reject for clinical text, or 2+ H100s with associated tensor-parallel and pipeline-parallel overhead. Neither preserves the per-appeal economics that contingency pricing requires.

### 7.5. Cost story

Public cloud pricing for MI300X as of May 2026 ranges from $1.99 to $2.35 per GPU-hour. H100 SXM5 on equivalent providers is $4 to $7 per GPU-hour. Combined with the multi-GPU requirement for the same workload on NVIDIA, the per-appeal compute cost on MI300X is structurally 4 to 8x lower than on H100-based infrastructure.

- At target inference latency (60 to 90 seconds end-to-end), DenialDefender's per-appeal compute cost on MI300X lands at approximately **$0.03 per appeal**.
- The H100-equivalent setup, accounting for the 2-GPU requirement and longer per-call latency from tensor-parallel sharding, lands at **$0.17 to $0.29 per appeal**, or 5 to 9x higher.

At a contingency-pricing business model with average recovered claims of ~$2,500 and a 12% take rate ($300 per successful appeal), the inference cost differential of $0.03 vs $0.20 is the difference between a fat-margin SaaS and a thin-margin services business. The MI300X choice is not a hardware preference; it is the unit-economics enabler that makes contingency pricing structurally defensible.

### 7.6. Software stack: ROCm 7, vLLM 0.14+, and Optimum-AMD

The ROCm 7.0 software stack supports PyTorch and Hugging Face natively at the application level, meaning that the engineering team writing the appeal-generation pipeline does not interact with low-level GPU kernels. Migration from a CUDA-based PyTorch project to ROCm is largely a runtime configuration change.

vLLM 0.14+ has first-class ROCm support with Day 0 compatibility for the Qwen3 family, and runs Qwen models with prefix caching, paged attention, and continuous batching, the three optimizations that matter most for long-context inference economics. Hugging Face Optimum-AMD provides drop-in inference-optimized model loading with ROCm-aware kernels for the Qwen architecture family.

#### 7.6.1. Precision strategy: FP16 today, FP8 in production

DenialDefender ships at FP16 inference precision. This is a deliberate engineering choice for the regulated-healthcare market we serve, not a hardware constraint. Two reasons:
1. **Customer trust at the contracting stage:** Hospital revenue cycle teams and RCM service buyers explicitly evaluate AI vendors on precision posture during procurement review. FP16, no quantization is the table-stakes answer that gets us through compliance review at R1, Waystar, and the hospital systems we sell into. FP8, even with rigorous validation, opens a conversation that delays contracts by months.
2. **Margin headroom for FP8 migration in production:** The MI300X's 192 GB capacity means we can validate and migrate to FP8 inference without re-architecting or changing hardware. Once we have payer-specific gold-standard test sets (which we generate in production from human-reviewed appeal outcomes), FP8 inference on the same MI300X would let us run an 80B-parameter model in the same memory budget while halving per-appeal compute cost.

The hardware investment is precision-stage-independent. This precision-stage flexibility (FP16 for trust-building with regulated customers, FP8 for production economics once validated) is unique to high-memory accelerators like MI300X. On 80GB-class GPUs, the FP16 stage is operationally infeasible for our pipeline, forcing the precision choice to be made before the customer trust is earned. We get to defer it.

### 7.7. On-stage benchmark we will demonstrate

During the live pitch, we load Qwen3-32B and Qwen2.5-VL-7B onto a single MI300X via the AMD Developer Cloud, ingest a representative synthetic denial packet of approximately 60K tokens, and produce a complete appeal letter end-to-end in under 90 seconds. We display the GPU memory utilization (showing both models co-resident in FP16, ~129 GB of 192 GB used), the ingestion-to-first-token latency, and the total wall-clock time from upload to draft.

## 8. Tech Stack and Architecture

### 8.1. Compute layer
- **Hardware:** AMD Instinct MI300X via AMD Developer Cloud (DigitalOcean-powered, $100 program credits cover hackathon build phase).
- **Software:** ROCm 7.0 runtime, AMD CDNA 3 architecture-aware kernels.
- **Inference server:** vLLM 0.14+ with ROCm backend (Day 0 support for Qwen3 family), prefix caching enabled, paged attention, continuous batching.
- **Model loading:** Hugging Face Optimum-AMD with weight loading directly from the event Hugging Face organization.

### 8.2. Models
- **Primary reasoning model: Qwen3-32B (dense, FP16).** Long-context appeal generation, payer-specific style transfer, evidence synthesis. Dense architecture chosen deliberately for grounded long-form writing over mixture-of-experts alternatives.
- **Vision model: Qwen2.5-VL-7B (FP16).** Denial letter OCR, scanned chart page interpretation, structured extraction from faxed payer correspondence.
- **Optional fine-tune:** LoRA adapter on Qwen3-32B for payer-specific style. Architected, deferred to post-pilot validation.

### 8.3. Application layer
- **Backend:** FastAPI (Python 3.11), async request orchestration, structured outputs via Pydantic models.
- **Storage:** PostgreSQL 16 with pgvector extension for past-appeal retrieval; encrypted at rest.
- **Frontend:** Next.js 14 with Tailwind, shipped as a Hugging Face Space within the event organization.
- **Demo deployment:** Live demo runs on AMD Developer Cloud during pitch; HF Space mirrors a stable demo path for asynchronous evaluation by remote judges.

### 8.4. Data sources for the hackathon build
All data used during the build is synthetic or open-licensed. We use no real PHI.
- **Synthetic patient charts:** Synthea (MITRE Corporation, Apache 2.0).
- **Payer policies:** CMS Medicare Coverage Determinations (public domain) and synthetic commercial-payer policy bulletins.
- **Clinical literature:** PubMed Central Open Access Subset.
- **Denial letters and appeal templates:** Synthesized from publicly available appeal-writing guides and de-identified appeal corpora published in academic literature.

### 8.5. Pipeline (per-appeal flow)
1. **Ingestion:** user uploads denial letter (PDF, image, or fax). Qwen2.5-VL-7B extracts denial code, payer, plan, denied service, and citing references.
2. **Patient context retrieval:** structured query against patient chart vector index returns relevant clinical span (typically 30K to 80K tokens).
3. **Policy retrieval:** payer-specific Medical Policy Bulletin is loaded by exact-match on payer plus procedure code.
4. **Literature retrieval:** pgvector similarity search over PubMed Central retrieves 5 to 15 most relevant supporting papers.
5. **Past-appeal retrieval:** best-N successful appeals at this payer for this code from the historical bank.
6. **Generation:** assembled context (~40K to 60K tokens for hackathon demo, scaling to 250K+ in production) is passed to Qwen3-32B for the appeal draft, with an explicit payer-style system prompt.
7. **Confidence scoring:** lightweight classifier on appeal features predicts overturn probability.
8. **Human review:** appeal surfaces in the review UI; reviewer accepts, edits, or rejects.
9. **Outcome capture:** post-submission outcome (overturned, upheld, partial) is recorded and feeds the learning loop.

### 8.6. Production posture (out of hackathon scope, noted for completeness)
In production deployment, DenialDefender is HIPAA-compliant with signed BAAs with each customer; SOC 2 Type II is on the year-one roadmap. PHI handling uses tenant-isolated encrypted stores and explicit data residency controls. None of this is built for the hackathon. The hackathon ships the synthetic-data demo and the architecture diagram. The production posture is described here so judges understand the path forward, not because we claim to have shipped it in 4 days.

## 9. Competitive Landscape

Healthcare AI is a crowded space. The right competitive question is not *is anyone in this room*. They are. The right question is *is anyone doing this specific thing for this specific buyer*. The answer is no, for reasons that are structural and durable.

### Adjacent but not overlapping

| Company | What they do | Why it's not us |
| :--- | :--- | :--- |
| Cohere Health (~$589M val) | Intelligent prior auth on the payer side | They sell to insurance companies, helping payers make smarter coverage decisions. We sell to providers fighting their decisions. Complementary, not competitive. |
| Rhyme, Latent Health, Availity | Prior auth submission tools on the provider side | Submission, not appeals. Different workflow, different buyer in the org. |
| R1 RCM, Waystar, Optum, athenahealth | Full-stack RCM platforms | Rules-based, pre-LLM denial workflows. Potential acquirers, not competitors. |
| Hippocratic AI ($126M Series C) | Patient-facing voice agents (post-discharge calls, intake) | Different workflow entirely. Their explicit constraint is no clinical decision support. |
| Abridge, Suki, Nuance DAX | AI medical scribing | Clinical documentation at point of care. Pre-claim, not post-denial. |
| Harvey AI ($5B val) | Legal document AI for law firms | Wrong vertical and wrong buyer. |

### Why no one is in our exact lane

The provider-side appeals workflow has been structurally underserved because it required three things to converge that have only converged in the last 18 months: (1) LLMs capable of reliable long-context regulated-text reasoning, (2) commodity GPU infrastructure capable of running those models at per-appeal economics that match contingency pricing, and (3) regulatory data infrastructure (CMS Interoperability Rule) that exposes denial data via APIs. Until 2024, you had at most one of those. By late 2025, you have all three. The window has opened.

### Our positioning

DenialDefender is the only provider-side, contingency-priced, AI-native appeal layer designed for RCM service operators. Cohere wins the payer-side market; we win the provider-side. Both can be large companies.

## 10. Why Now

Four independent lines of force converge in 2026 to make this the right moment:

- **Regulatory:** payer denial data becomes accessible. The CMS Interoperability and Prior Authorization Final Rule, finalized in early 2024, requires payers to expose prior authorization decisions and denial data via FHIR APIs by January 1, 2027. This is the data infrastructure DenialDefender is engineered around. Incumbents whose denial workflows were built before this rule will have to retrofit; we will be native.
- **Political:** denial practices have entered mainstream discourse. The December 2024 killing of UnitedHealthcare CEO Brian Thompson did not create the underlying anger about denials, but it surfaced it permanently. A January 2026 KFF poll found 66% of insured adults consider delays and denials a major problem. Bipartisan legislation targeting prior authorization transparency has advanced in both houses. Insurers' June 2025 voluntary commitments to fix the broken prior authorization system reflect the political cost of continued inaction. Hospitals advocating for fairer adjudication have political cover they did not have two years ago.
- **Technical:** long-context regulated-text reasoning crossed the threshold. Producing a high-quality, defensible appeal letter requires reading 200K+ tokens of mixed clinical, regulatory, and legal text and synthesizing them into a rhetorically coherent argument. This was infeasible at production quality before late 2024. With Qwen3, recent Llama models, and the broader open-weights long-context generation, the capability is now at the threshold where it beats human throughput at acceptable quality, with humans in the loop for review.
- **Economic:** AMD MI300X makes per-appeal economics viable. Contingency pricing requires per-appeal compute costs in single-digit dollars, ideally under $2. On NVIDIA H100-based infrastructure with the multi-GPU sharding that long-context regulated-domain inference requires, that math does not close. On MI300X, with 192 GB enabling single-device co-residency of a 32B-class language model and a 7B vision model at full FP16 precision, and 5.3 TB/s bandwidth keeping latency low, it does. This is a 2025 to 2026 unlock. AMD's developer cloud reaching $1.99 to $2.35/hr per GPU is what makes contingency-priced AI in regulated-text domains financially defensible for the first time.

## 11. Risks and Mitigations

- **Regulatory and compliance risk:** PHI handling, HIPAA, BAA execution, state-by-state insurance regulation, and emerging AI-in-healthcare regulation are real concerns. *Mitigation:* explicit human-in-the-loop on every submitted appeal, BAA-first sales motion, no clinical decision-making by the system, alignment with the regulated-AI positioning that Hippocratic AI and similar players have validated with payers.
- **Hallucination risk in regulated text:** An appeal letter that cites a non-existent paper or a misattributed clinical fact is worse than no appeal. *Mitigation:* every cited reference is grounded in the retrieved evidence corpus and verified against the source before inclusion. The model does not generate citations from internal knowledge. It composes only from retrieved spans. Confidence scoring filters low-confidence drafts before they reach human reviewers.
- **Payer countermeasures:** If we succeed, payers will respond by making denials more sophisticated. This is real and we welcome it as a market signal. *Mitigation:* the per-payer learning loop adapts faster than payer policy review cycles; structurally, the harder a payer makes appeals to write, the more value we provide; and Cohere Health's traction on the payer side suggests the sophistication arms race is happening regardless of whether we participate.
- **Insurance industry lobbying:** The industry has significant political capital and may push for restrictions on AI-generated appeals. *Mitigation:* we are explicit that human reviewers approve every appeal. We are an authorship tool, not an autonomous filer. Provider trade associations (AHA, AMA) have aligned interests with us and significant counter-lobbying capacity.
- **Demo risk at the hackathon itself:** Live demos fail. *Mitigation:* pre-recorded fallback video, two independent demo paths (live MI300X plus cached HF Space), and a synthetic dataset prepared and tested before SF.

## 12. The 4-Day Hackathon Scope

This brief describes a multi-year company. The hackathon ships a sharp slice of it. Distinguishing the demo from the company is part of how we earn judge trust.

### What ships by Saturday May 10, 12:00 PT
- Working DenialDefender pipeline running on AMD Instinct MI300X via the AMD Developer Cloud.
- Qwen3-32B (FP16) and Qwen2.5-VL-7B (FP16) co-resident on a single MI300X, served via vLLM 0.14+ with ROCm 7.0.
- Total VRAM utilization: ~129 GB of 192 GB available (~67%), demonstrating the headroom that enables the FP16-to-FP8 production migration path described in §7.6.1.
- Web interface (Next.js) deployed as a Hugging Face Space within the event organization.
- End-to-end demo: synthetic denial letter to 90-second appeal generation to side-by-side review UI.
- Synthetic dataset of 50+ realistic denial scenarios across 5 payers and 8 specialties.
- Open-source GitHub repository with complete reproducibility instructions (qualifies for Build in Public challenge).
- Two technical updates posted to X and LinkedIn during the hackathon, tagging @lablab and @AIatAMD (qualifies for Build in Public challenge).
- This brief, the architecture diagram, and the 3-minute pitch deck.

### What is roadmap, not demo
- Real EHR integrations (Epic, Cerner, Meditech). Production-only.
- Live payer API integrations under the CMS Interoperability Rule. 2027 timeline.
- HIPAA-compliant production deployment with signed BAAs.
- Per-payer fine-tuned LoRA adapters at scale. One demo adapter shipped, full bank is post-pilot.
- SOC 2 Type II certification.
- Outcome-tracking learning loop closure. Architected, not yet running on real outcomes.

### Targeted prizes
- **Vision and Multimodal AI Track 1st Place:** $2,500.
- **Grand Prize (Best Overall Project):** $5,000.
- **Hugging Face Special Prize 1st Place:** Reachy Mini Wireless plus 6 months HF Pro plus $500 HF Credits, driven by HF Space likes.
- **Build in Public Reward:** Awarded for technical updates and open-source release.
- **Social Engagement Hardware Reward:** AMD Radeon AI PRO R9700 GPU, awarded for outstanding social engagement and project promotion.

Stacked target: ~$8,000+ in cash, an HF Pro / Reachy / credits package, and an additional GPU. We optimize for the Grand Prize first; the track and special prizes are secondary.

## 13. Appendix: Sources

All numerical claims in this brief are sourced to primary or industry-standard secondary publications. Judges fact-checking any figure can find the underlying data via the links below.

### Healthcare denial market data
1. Kaiser Family Foundation: Claims Denials and Appeals in ACA Marketplace Plans, 2024 (March 2026). https://www.kff.org/patient-consumer-protections/claims-denials-and-appeals-in-aca-marketplace-plans-in-2024/
2. CMS Transparency in Coverage 2026 Public Use File. https://www.cms.gov/marketplace/resources/data/public-use-files
3. Experian Health: State of Claims 2025 Report. https://www.experian.com/blogs/healthcare/state-of-claims-2025/
4. HFMA: ACA marketplace plans see highest denial rate in nine years (Premier Inc. data). https://www.hfma.org/fast-finance/aca-marketplace-plans-payment-denial/
5. MoneyGeek analysis of CMS Transparency in Coverage data, plan year 2024. https://www.moneygeek.com/insurance/health/aca-claim-denial-rates-by-state-and-insurer/
6. Aptarro: 50+ US Healthcare Denial Rates and Reimbursement Statistics for 2026. https://www.aptarro.com/insights/us-healthcare-denial-rates-reimbursement-statistics
7. TechTarget / ValuePenguin: Breaking Down Claim Denial Rates by Healthcare Payer. https://www.techtarget.com/revcyclemanagement/feature/Breaking-down-claim-denial-rates-by-healthcare-payer
8. STAT Medical Consulting: Top 10 Claim Denials in 2025. https://www.statmedical.net/understanding-the-top-10-claim-denials-in-2025-and-how-to-prevent-them
9. Counterforce Health: Insurance Denial Statistics, Why 80% of Appeals Succeed. https://www.counterforcehealth.org/post/insurance-denial-statistics-why-80-of-appeals-succeed-but-only-1-try/

### Competitor and acquirer references
10. Cohere Health: Series C announcement (May 2025), $200M total raised. https://www.prnewswire.com/news-releases/cohere-health-secures-90m-series-c-to-expand-ai-powered-platform-transforming-health-plan-clinical-decision-making-302454527.html
11. Cohere Health company profile (PitchBook). https://pitchbook.com/profiles/company/399267-82
12. IntuitionLabs: Cohere Health, AI in Prior Authorization and Company Profile. https://intuitionlabs.ai/articles/cohere-health-ai-prior-authorization
13. Hippocratic AI Series C ($126M, Nov 2025). https://www.fiercehealthcare.com/ai-and-machine-learning/hippocratic-ai-lands-126m-series-c-expand-patient-facing-ai-agents-fuel-ma
14. ReachRx product overview. https://www.reachrx.ai/product

### AMD Instinct MI300X technical specifications
15. AMD Instinct MI300X official product page and datasheet. https://www.amd.com/en/products/accelerators/instinct/mi300/mi300x.html
16. AMD Instinct MI300X Generative AI Accelerator and Platform Architecture (Hot Chips 2024). https://hc2024.hotchips.org/assets/program/conference/day1/23_HC2024.AMD.MI300X.ASmith(MI300X).v1.Final.20240817.pdf
17. Lenovo Press: ThinkSystem AMD MI300X 192GB Product Guide. https://lenovopress.lenovo.com/lp1943-thinksystem-amd-mi300x-192gb-750w-8-gpu-board
18. Chips and Cheese: Testing AMD's Giant MI300X (independent benchmark). https://chipsandcheese.com/p/testing-amds-giant-mi300x
19. MI300X Cloud Pricing Comparison (May 2026). https://getdeploying.com/gpus/amd-mi300x
20. TensorWave: AMD MI300X Accelerator Specs and Performance. https://tensorwave.com/blog/mi300x-2

### Hackathon and ecosystem references
21. AMD Developer Hackathon (lablab.ai). https://lablab.ai/ai-hackathons/amd-developer
22. AMD Developer Cloud. https://www.amd.com/en/developer/resources/cloud-access/amd-developer-cloud.html
23. Hugging Face: AMD Developer Hackathon organization. https://huggingface.co/lablab-ai-amd-developer-hackathon
24. Qwen models on Hugging Face. https://huggingface.co/Qwen
25. vLLM ROCm backend documentation. https://docs.vllm.ai/en/latest/getting_started/amd-installation.html
26. Hugging Face Optimum-AMD. https://huggingface.co/docs/optimum-amd
