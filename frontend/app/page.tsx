"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SAMPLE_CASES, type SampleCase } from "./data";

/* ── Types ──────────────────────────────────────────────── */
interface DenialData {
  payer?: string;
  denial_code?: string;
  denial_reason?: string;
  denied_service?: string;
  procedure_codes?: string[];
}
interface Meta {
  elapsed: number;
  wasScanned: boolean;
  contextChars: number;
  models: { vision: string | null; language: string };
}
type PipelineState = "idle" | "processing" | "results";
interface StepStatus {
  label: string;
  detail: string;
  status: "pending" | "active" | "completed";
}

/* ── Constants ──────────────────────────────────────────── */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

const INITIAL_STEPS: StepStatus[] = [
  { label: "Document Ingestion", detail: "Extracting text from PDF…", status: "pending" },
  { label: "Vision Analysis", detail: "Qwen2.5-VL-7B scanning for structure…", status: "pending" },
  { label: "Context Retrieval", detail: "Payer policies, PubMed, past appeals…", status: "pending" },
  { label: "Appeal Synthesis", detail: "Qwen3-32B generating appeal letter…", status: "pending" },
];

/* ── Helpers ─────────────────────────────────────────────── */
function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

/* ── Component ───────────────────────────────────────────── */
export default function Home() {
  /* state */
  const [file, setFile] = useState<File | null>(null);
  const [chartText, setChartText] = useState("");
  const [appeal, setAppeal] = useState("");
  const [denial, setDenial] = useState<DenialData | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pipelineState, setPipelineState] = useState<PipelineState>("idle");
  const [steps, setSteps] = useState<StepStatus[]>(INITIAL_STEPS);
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  /* ── Health check ──────────────────────────────────────── */
  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const r = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) });
        if (mounted) setOnline(r.ok);
      } catch {
        if (mounted) setOnline(false);
      }
    };
    check();
    const id = setInterval(check, 30_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  /* ── Pipeline step simulator ───────────────────────────── */
  const advanceSteps = useCallback((stepIdx: number) => {
    setSteps((prev) =>
      prev.map((s, i) => {
        if (i < stepIdx) return { ...s, status: "completed" as const };
        if (i === stepIdx) return { ...s, status: "active" as const };
        return { ...s, status: "pending" as const };
      })
    );
  }, []);

  /* ── Generate appeal ───────────────────────────────────── */
  const generate = useCallback(
    async (pdfFile: File, chart: string = "") => {
      setPipelineState("processing");
      setError(null);
      setAppeal("");
      setDenial(null);
      setMeta(null);
      setElapsed(0);
      setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "pending" as const })));

      /* start timer */
      const t0 = Date.now();
      timerRef.current = setInterval(() => setElapsed((Date.now() - t0) / 1000), 100);

      /* simulate pipeline steps while the backend works */
      advanceSteps(0);
      const stepTimers = [
        setTimeout(() => advanceSteps(1), 3000),
        setTimeout(() => advanceSteps(2), 8000),
        setTimeout(() => advanceSteps(3), 15000),
      ];

      const fd = new FormData();
      fd.append("denial_pdf", pdfFile);
      fd.append("chart_text", chart);

      try {
        const r = await fetch(`${API_URL}/api/generate`, { method: "POST", body: fd });
        if (!r.ok) throw new Error(await r.text() || `HTTP ${r.status}`);
        const j = await r.json();

        setDenial(j.denial);
        setAppeal(j.appeal);
        setMeta({
          elapsed: j.elapsed_seconds,
          wasScanned: j.was_scanned,
          contextChars: j.context_size_chars,
          models: j.models_used,
        });
        setSteps((prev) => prev.map((s) => ({ ...s, status: "completed" as const })));
        setPipelineState("results");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed");
        setPipelineState("idle");
      } finally {
        if (timerRef.current) clearInterval(timerRef.current);
        stepTimers.forEach(clearTimeout);
      }
    },
    [advanceSteps]
  );

  /* ── Sample case click ─────────────────────────────────── */
  const handleCaseClick = useCallback(
    async (c: SampleCase) => {
      setActiveCase(c.id);
      rightPanelRef.current?.scrollIntoView({ behavior: "smooth" });

      try {
        const pdfUrl = `/data/denials/${c.folder}/denial_letter.pdf`;
        const resp = await fetch(pdfUrl);
        const blob = await resp.blob();
        const pdfFile = new File([blob], "denial_letter.pdf", { type: "application/pdf" });
        setFile(pdfFile);
        generate(pdfFile);
      } catch {
        setError("Failed to load sample case PDF.");
      }
    },
    [generate]
  );

  /* ── Upload generate ───────────────────────────────────── */
  const handleGenerate = () => {
    if (!file) return;
    setActiveCase(null);
    generate(file, chartText);
  };

  /* ── Reset ─────────────────────────────────────────────── */
  const handleReset = () => {
    setPipelineState("idle");
    setFile(null);
    setChartText("");
    setAppeal("");
    setDenial(null);
    setMeta(null);
    setError(null);
    setActiveCase(null);
    setElapsed(0);
    setSteps(INITIAL_STEPS);
  };

  /* ── Copy ──────────────────────────────────────────────── */
  const copyAppeal = async () => {
    await navigator.clipboard.writeText(appeal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Drag & Drop ───────────────────────────────────────── */
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── NAV BAR ─────────────────────────────────────── */}
      <nav className="nav-bar">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>
            DenialDefender
          </span>
        </div>

        <div className="flex items-center gap-1.5" style={{ fontSize: 12 }}>
          <span
            className="animate-pulse-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: online === true ? "#10b981" : online === false ? "#ef4444" : "#64748b",
              display: "inline-block",
            }}
          />
          <span style={{ color: "var(--text-secondary)" }}>
            {online === true ? "System Online" : online === false ? "Backend Offline" : "Checking…"}
          </span>
        </div>

        <div className="flex items-center gap-4" style={{ fontSize: 13 }}>
          <a
            href="https://github.com/jorgesandev/denialdefender"
            target="_blank"
            rel="noopener noreferrer"
            className="subtle-link"
          >
            GitHub
          </a>
          <a
            href="https://huggingface.co/spaces/lablab-ai-amd-developer-hackathon/denialdefender"
            target="_blank"
            rel="noopener noreferrer"
            className="subtle-link"
          >
            🤗 HF Space
          </a>
        </div>
      </nav>

      {/* ── MAIN GRID ───────────────────────────────────── */}
      <div
        className="flex-1 grid gap-0"
        style={{
          gridTemplateColumns: "minmax(340px, 2fr) minmax(420px, 3fr)",
          minHeight: "calc(100vh - 56px)",
        }}
      >
        {/* ═══════════════════════════════════════════
            LEFT PANEL — "The Story"
            ═══════════════════════════════════════════ */}
        <aside
          className="overflow-y-auto stagger-children"
          style={{
            padding: 24,
            borderRight: "1px solid var(--border-default)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Hero */}
          <div className="surface-card" style={{ padding: 24 }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--accent-primary)",
                marginBottom: 8,
              }}
            >
              🛡️ DenialDefender
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
              Autonomous insurance appeal generation for hospital revenue cycle teams.
              Upload a denial letter → get a submission-ready appeal in <strong style={{ color: "var(--text-primary)" }}>~60 seconds</strong>.
            </p>
            <div className="flex gap-3">
              <button
                className="btn-primary"
                style={{ width: "auto", padding: "0 20px", height: 38, fontSize: 13 }}
                onClick={() => rightPanelRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Try Demo →
              </button>
              <a
                href="https://github.com/jorgesandev/denialdefender"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ width: "auto", padding: "0 20px", height: 38, fontSize: 13 }}
              >
                Docs
              </a>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-card stat-danger">
              <div className="stat-number" style={{ color: "var(--accent-danger)" }}>$262B</div>
              <div className="stat-label">lost annually</div>
            </div>
            <div className="stat-card stat-warning">
              <div className="stat-number" style={{ color: "var(--accent-warning)" }}>&lt;1%</div>
              <div className="stat-label">ever appealed</div>
            </div>
            <div className="stat-card stat-success">
              <div className="stat-number" style={{ color: "var(--accent-success)" }}>~$0.03</div>
              <div className="stat-label">per appeal</div>
            </div>
          </div>

          {/* Sample Cases */}
          <div>
            <div className="section-label">🧪 Try a Case</div>
            <div className="flex flex-col gap-2">
              {SAMPLE_CASES.map((c) => (
                <div
                  key={c.id}
                  className={`case-card ${activeCase === c.id ? "active" : ""}`}
                  onClick={() => handleCaseClick(c)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleCaseClick(c)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                      🏥 {c.patient}, {c.age}{c.sex}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                    {c.denialReason} — {c.procedure}
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {c.payer} · {fmt(c.amount)}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: c.outcomeColor }}>
                      ⚡ {c.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture */}
          <div className="surface-card" style={{ padding: 20 }}>
            <div className="section-label">⚙️ Architecture</div>
            <div className="flex flex-col gap-0">
              {[
                ["Hardware", "AMD MI300X · 192GB VRAM"],
                ["Runtime", "ROCm 7.0 · vLLM 0.14+"],
                ["Precision", "FP16 (no quantization)"],
                ["Vision", "Qwen2.5-VL-7B"],
                ["Reasoning", "Qwen3-32B"],
              ].map(([k, v]) => (
                <div className="kv-row" key={k}>
                  <span className="kv-label">{k}</span>
                  <span className="kv-value">{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="vram-bar-outer">
                <div className="vram-bar-inner">129 GB / 192 GB</div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="surface-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Team Sophon</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Jorge Sandoval</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1" style={{ fontSize: 13 }}>
              <a href="https://jorgesandoval.dev" target="_blank" rel="noopener noreferrer" className="subtle-link">🌐 jorgesandoval.dev</a>
              <a href="https://x.com/jorgesandev" target="_blank" rel="noopener noreferrer" className="subtle-link">✕ @jorgesandev</a>
              <a href="https://www.linkedin.com/in/jorgesandev/" target="_blank" rel="noopener noreferrer" className="subtle-link">💼 LinkedIn</a>
              <a href="mailto:contact@jorgesandoval.dev" className="subtle-link">✉ Email</a>
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 12 }}>
              Built for AMD Developer Hackathon 2026
            </div>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════
            RIGHT PANEL — "The Engine"
            ═══════════════════════════════════════════ */}
        <main
          ref={rightPanelRef}
          className="overflow-y-auto"
          style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* ── STATE: IDLE ──────────────────────────── */}
          {pipelineState === "idle" && (
            <div className="animate-fade-in flex flex-col gap-4">
              {/* Upload zone */}
              <div
                className={`drop-zone flex flex-col items-center justify-center gap-3 ${dragOver ? "drag-over" : ""}`}
                style={{ padding: "48px 24px", cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                <div style={{ fontSize: 48 }}>{file ? "✅" : "📄"}</div>
                <div style={{ fontSize: 15, color: "var(--text-primary)", fontWeight: 500 }}>
                  {file ? file.name : "Drop your denial letter here"}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {file ? "Click to change file" : "or click to browse · PDF (digital or scanned)"}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              {/* Chart notes */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                  Patient Chart Notes <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  className="dark-textarea"
                  rows={3}
                  placeholder="Paste relevant chart text — diagnoses, lab values, treatment history…"
                  value={chartText}
                  onChange={(e) => setChartText(e.target.value)}
                />
              </div>

              {/* Generate button */}
              <button className="btn-primary" disabled={!file} onClick={handleGenerate}>
                🚀 Generate Appeal
              </button>

              <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                ── or select a sample case from the left panel ──
              </div>

              {/* Error */}
              {error && (
                <div
                  className="surface-card animate-fade-in"
                  style={{ borderColor: "var(--accent-danger)", padding: 16 }}
                >
                  <div style={{ color: "var(--accent-danger)", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                    ❌ Error
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>{error}</div>
                </div>
              )}
            </div>
          )}

          {/* ── STATE: PROCESSING ────────────────────── */}
          {pipelineState === "processing" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                Processing: <strong style={{ color: "var(--text-primary)" }}>{file?.name || "sample case"}</strong>
              </div>

              {/* Pipeline steps */}
              <div className="flex flex-col gap-3">
                {steps.map((step, i) => (
                  <div key={i} className={`pipeline-step ${step.status}`}>
                    <div className="flex items-center gap-2" style={{ fontSize: 14, fontWeight: 500 }}>
                      {step.status === "completed" && <span style={{ color: "var(--accent-success)" }}>✅</span>}
                      {step.status === "active" && <span className="animate-pulse-dot" style={{ color: "var(--accent-warning)" }}>⏳</span>}
                      {step.status === "pending" && <span style={{ color: "var(--text-muted)" }}>○</span>}
                      <span style={{ color: step.status === "pending" ? "var(--text-muted)" : "var(--text-primary)" }}>
                        Step {i + 1}: {step.label}
                      </span>
                    </div>
                    {step.status !== "pending" && (
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, marginLeft: 24 }}>
                        {step.detail}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="progress-bar-outer">
                  <div className="progress-bar-indeterminate" />
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 8 }}>
                  {elapsed.toFixed(1)}s elapsed · Running on AMD MI300X
                </div>
              </div>

              {error && (
                <div className="surface-card" style={{ borderColor: "var(--accent-danger)", padding: 16 }}>
                  <div style={{ color: "var(--accent-danger)", fontWeight: 600, fontSize: 14 }}>❌ Error</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>{error}</div>
                  <button className="btn-secondary" style={{ marginTop: 12 }} onClick={handleReset}>
                    ← Back
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── STATE: RESULTS ───────────────────────── */}
          {pipelineState === "results" && (
            <div className="animate-slide-down flex flex-col gap-4">
              {/* Header bar */}
              <div
                className="surface-card flex items-center justify-between"
                style={{ padding: "12px 20px" }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--accent-success)", fontSize: 18 }}>✅</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Appeal Generated</span>
                  {meta && (
                    <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {meta.elapsed}s · ~{Math.round(meta.contextChars / 4).toLocaleString()} tokens
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyAppeal}
                    className="btn-secondary"
                    style={{ width: "auto", height: 32, padding: "0 14px", fontSize: 12 }}
                  >
                    {copied ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
              </div>

              {/* Appeal letter */}
              <div
                className="surface-card"
                style={{ padding: 24, maxHeight: "60vh", overflowY: "auto" }}
              >
                <div className="appeal-markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{appeal}</ReactMarkdown>
                </div>
              </div>

              {/* Pipeline metadata */}
              {denial && (
                <div className="surface-card" style={{ padding: 20 }}>
                  <div className="section-label">Pipeline Metadata</div>
                  <div className="flex flex-col gap-0">
                    {[
                      ["Payer", denial.payer || "N/A"],
                      ["Denial Code", denial.denial_code || "N/A"],
                      ["Service", denial.denied_service || "N/A"],
                      ...(meta?.wasScanned ? [["Vision Model", "Qwen2.5-VL-7B (scanned PDF)"]] : []),
                      ["Reasoning", "Qwen3-32B · FP16 · MI300X"],
                      ...(meta ? [["Context", `~${Math.round(meta.contextChars / 4).toLocaleString()} tokens`]] : []),
                      ...(meta ? [["Elapsed", `${meta.elapsed}s`]] : []),
                    ].map(([k, v]) => (
                      <div className="kv-row" key={k}>
                        <span className="kv-label">{k}</span>
                        <span className="kv-value">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Try another */}
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Try Another Case
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── Toast ────────────────────────────────────── */}
      {copied && <div className="toast">Copied to clipboard ✓</div>}

      {/* ── Mobile responsive override ───────────────── */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr !important;
          }
          aside {
            border-right: none !important;
            border-bottom: 1px solid var(--border-default);
            max-height: none;
          }
        }
      `}</style>
    </>
  );
}
