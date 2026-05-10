"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, GitFork } from "lucide-react";

export default function HeroSection() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const r = await fetch(process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/health", {
          signal: AbortSignal.timeout(5000),
        });
        if (mounted) setOnline(r.ok);
      } catch {
        if (mounted) setOnline(false);
      }
    };
    check();
    const id = setInterval(check, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section id="product" className="relative overflow-hidden pt-24 pb-20">
      <div className="absolute -top-24 right-0 w-130 h-130 rounded-full bg-[rgba(14,116,144,0.12)] blur-[120px]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="pill mb-6">Autonomous appeals for RCM teams</div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight text-slate-900">
              Appeal packets in 90 seconds, backed by policy and clinical evidence.
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl">
              DenialDefender drafts submission-ready appeals with citations from payer policy, patient charts, and medical literature. No recovery, no fee.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#demo" className="btn-primary w-auto px-8 h-12 text-sm">
                Try the Demo
              </a>
              <a href="#evidence" className="btn-secondary w-auto px-7 h-12 text-sm">
                View Evidence
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <a
                href="https://github.com/jorgesandev/denialdefender"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <GitFork className="w-4 h-4" />
                GitHub Repo
              </a>
              <a
                href="https://huggingface.co/spaces/lablab-ai-amd-developer-hackathon/denialdefender"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                HF Space
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 text-xs text-slate-500">
              <div className="pill status-pill">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    background: online === true ? "#0f766e" : online === false ? "#b91c1c" : "var(--text-muted)",
                  }}
                />
                {online === true ? "MI300X Online" : online === false ? "MI300X Offline" : "MI300X Checking"}
              </div>
              <div className="pill status-pill">$110B stranded recoverable revenue</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              <div className="surface-card p-4">
                <div className="text-sm font-semibold text-slate-900">44-82% win rate</div>
                <div className="text-xs text-slate-500 mt-1">When appeals are filed</div>
              </div>
              <div className="surface-card p-4">
                <div className="text-sm font-semibold text-slate-900">60-90s drafts</div>
                <div className="text-xs text-slate-500 mt-1">End-to-end generation</div>
              </div>
              <div className="surface-card p-4">
                <div className="text-sm font-semibold text-slate-900">Evidence grounded</div>
                <div className="text-xs text-slate-500 mt-1">Policy + chart + literature</div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "120ms" }}>
            <div className="surface-card p-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span className="uppercase tracking-[0.2em]">Appeal Packet</span>
                <span className="pill status-pill">Evidence Linked</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="rounded-xl border p-4"
                  style={{ borderColor: "var(--border-default)", background: "var(--bg-input)" }}
                >
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Denial Letter</div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 rounded bg-slate-200" />
                    <div className="h-2 rounded bg-slate-200 w-5/6" />
                    <div className="h-2 rounded bg-slate-200 w-2/3" />
                    <div className="h-2 rounded bg-slate-200 w-4/5" />
                  </div>
                </div>
                <div className="rounded-xl border border-[rgba(14,116,144,0.4)] bg-white p-4 shadow-[0_12px_28px_rgba(14,116,144,0.12)]">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Appeal Draft</div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 rounded bg-[rgba(14,116,144,0.2)]" />
                    <div className="h-2 rounded bg-slate-200 w-4/5" />
                    <div className="h-2 rounded bg-slate-200 w-3/4" />
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5"
                        style={{ borderColor: "var(--border-default)" }}
                      >
                        12 citations
                      </span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5"
                        style={{ borderColor: "var(--border-default)" }}
                      >
                        82% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                <span>Qwen3-32B + Qwen2.5-VL-7B on AMD MI300X</span>
                <span className="text-accent font-semibold">Full FP16</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
