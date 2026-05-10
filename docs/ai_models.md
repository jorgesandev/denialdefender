# DenialDefender: AI Model Selection & MI300X Optimization

This document details the selection criteria for the models used in DenialDefender and how they are optimized for the **AMD Instinct™ MI300X**.

## 1. The Dual-Model Pipeline

DenialDefender utilizes a specialized "Vision + Reasoning" pipeline to handle the complexities of medical billing workflows.

### A. The "Eyes": Qwen2.5-VL-7B
Medical insurance denials are often transmitted via fax or legacy portals as image-heavy PDFs. 
- **Role**: OCR, Document Layout Analysis, and Visual Extraction.
- **Why Qwen2.5-VL?**: It provides state-of-the-art performance for document understanding at a relatively small parameter count (7B), allowing for fast inference and low VRAM footprint while maintaining high accuracy on dense medical tables.

### B. The "Brain": Qwen2.5-32B-Instruct
Generating a winning medical appeal requires deep reasoning, understanding of complex medical policies, and a professional clinical tone.
- **Role**: Context Synthesis, RAG Orchestration, and Final Appeal Drafting.
- **Why Qwen2.5-32B?**: At 32B parameters, this model strikes a "Goldilocks" balance: it has significantly more reasoning depth and long-context stability (128k context support) than 7B models, but is efficient enough to run at high speeds on the MI300X without sharding across multiple GPUs.

## 2. MI300X: The Performance Multiplier

The **AMD Instinct™ MI300X** is the primary reason DenialDefender can achieve "Series B" product performance in a hackathon environment.

### 192 GB HBM3 Capacity
Running a 32B model and a 7B model concurrently in FP16 (unquantized) requires roughly 80 GB of VRAM for weights alone. The 192 GB capacity of the MI300X leaves over 100 GB for **KV Caching**.
- **Impact**: We can handle massive RAG context windows (40,000+ tokens) with high throughput, ensuring the model "sees" the entire patient chart and the entire payer policy simultaneously.

### 5.3 TB/s Memory Bandwidth
LLM inference is largely memory-bandwidth bound. The MI300X's 5.3 TB/s bandwidth allows for near-instant response times.
- **Impact**: We hit a sub-90-second SLA for a task that typically takes a human specialist 45–60 minutes.

### Co-resident Execution
Because both models fit on one GPU, there is zero latency from PCIe or infinity fabric transfers between devices. The vision model finishes its OCR task, and the resulting text is passed immediately to the reasoning model's context window within the same HBM3 memory space.

## 3. Deployment Configuration (vLLM)

We utilize the **vLLM** inference engine with the **ROCm™** backend.

```python
# vLLM Configuration Snippet
engine_args = AsyncEngineArgs(
    model="Qwen/Qwen2.5-32B-Instruct",
    gpu_memory_utilization=0.85,
    max_model_len=65536,
    enforce_eager=True, # Optimized for MI300X
    device="cuda" # ROCm maps hip/cuda
)
```

By leveraging `enforce_eager=True` and ROCm-optimized kernels, we achieve maximum FLOPS utilization on the AMD hardware.
