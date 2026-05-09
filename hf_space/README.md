---
title: DenialDefender
emoji: 🛡️
colorFrom: red
colorTo: blue
sdk: gradio
sdk_version: 6.14.0
python_version: '3.13'
app_file: app.py
pinned: true
license: mit
short_description: Autonomous Insurance Appeals via AMD MI300X
---

# DenialDefender

Autonomous insurance appeal generation for hospital revenue cycle teams.

**Architecture:** Qwen3-32B + Qwen2.5-VL-7B co-resident on a single AMD MI300X via vLLM 0.14+ with ROCm 7.0. Full FP16, no quantization. ~129GB / 192GB VRAM utilization.

## What it does

Drag in a denial letter (digital or scanned) → 60-90 seconds later, a submission-ready appeal letter.

Pipeline:
1. **Qwen2.5-VL-7B (FP16)** — reads the denial via OCR if scanned/faxed, no text layer needed
2. **Retrieval** — patient chart sections, payer policy lookup, PubMed literature, past successful appeals
3. **Qwen3-32B (FP16)** — synthesizes evidence and writes the appeal letter

## The numbers

- US healthcare loses $262B/year to unappealed denied claims
- <1% of denials ever get appealed
- 44-82% of appeals that DO get filed succeed
- DenialDefender closes that gap at ~$0.03 compute per appeal

## Why MI300X

The same workload on NVIDIA H100 (80GB) requires either 2 GPUs with tensor-parallel sharding OR INT4 quantization — which regulated healthcare customers reject for clinical text. MI300X's 192GB enables both models in full FP16 on one device.

The 63GB of headroom is also the production migration path: FP8 inference would allow an 80B-parameter model in the same memory budget.

## Built for AMD Developer Hackathon 2026

[GitHub](https://github.com/jorgesandev/denialdefender) | AMD Developer Cloud · MI300X · ROCm 7.0

**If you like this Space, click the heart — we're competing for the HF Special Prize.**
