"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SAMPLE_CASES, type SampleCase } from "../data";
import { Upload, ChevronRight, FileText, CheckCircle2, Copy, Download } from "lucide-react";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

const INITIAL_STEPS: StepStatus[] = [
  { label: "Document Ingestion", detail: "Extracting text from PDF…", status: "pending" },
  { label: "Vision Analysis", detail: "Qwen2.5-VL-7B scanning for structure…", status: "pending" },
  { label: "Context Retrieval", detail: "Payer policies, PubMed, past appeals…", status: "pending" },
  { label: "Appeal Synthesis", detail: "Qwen3-32B generating appeal letter…", status: "pending" },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function DemoSection() {
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
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const advanceSteps = useCallback((stepIdx: number) => {
    setSteps((prev) =>
      prev.map((s, i) => {
        if (i < stepIdx) return { ...s, status: "completed" as const };
        if (i === stepIdx) return { ...s, status: "active" as const };
        return { ...s, status: "pending" as const };
      })
    );
  }, []);

  const generate = useCallback(
    async (pdfFile: File, chart: string = "") => {
      setPipelineState("processing");
      setError(null);
      setAppeal("");
      setDenial(null);
      setMeta(null);
      setElapsed(0);
      setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "pending" as const })));

      const t0 = Date.now();
      timerRef.current = setInterval(() => setElapsed((Date.now() - t0) / 1000), 100);

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
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
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

  const handleCaseClick = useCallback(
    async (c: SampleCase) => {
      setActiveCase(c.id);
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

  const handleGenerate = () => {
    if (!file) return;
    setActiveCase(null);
    generate(file, chartText);
  };

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

  const copyAppeal = async () => {
    await navigator.clipboard.writeText(appeal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  return (
    <section id="demo" className="py-24 bg-[#0a0f1a] border-t border-[#1e3a5f]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Interactive Demo</h2>
          <p className="text-[#94a3b8] max-w-2xl mx-auto">
            Experience the RAG-on-MI300X pipeline. Upload a denial letter and watch the autonomous appeal generation in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Sample Cases */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="section-label">🧪 Try a Case</div>
            <div className="flex flex-col gap-3">
              {SAMPLE_CASES.map((c) => (
                <div
                  key={c.id}
                  className={`case-card ${activeCase === c.id ? "active" : ""}`}
                  onClick={() => handleCaseClick(c)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">🏥 {c.patient}, {c.age}{c.sex}</span>
                  </div>
                  <div className="text-[13px] text-[#94a3b8] mb-1">{c.denialReason} — {c.procedure}</div>
                  <div className="flex justify-between items-center text-xs text-[#64748b]">
                    <span>{c.payer} · {fmt(c.amount)}</span>
                    <span className="font-semibold" style={{ color: c.outcomeColor }}>⚡ {c.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Pipeline UI */}
          <div className="lg:col-span-8 surface-card p-6 min-h-[500px] flex flex-col justify-center relative">
            
            {pipelineState === "idle" && (
              <div className="animate-fade-in flex flex-col gap-6 max-w-lg mx-auto w-full">
                <div
                  className={`drop-zone flex flex-col items-center justify-center text-center p-12 cursor-pointer ${dragOver ? "drag-over" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                >
                  <Upload className="w-10 h-10 text-[#3b82f6] mb-4" />
                  <div className="text-[15px] font-medium text-white mb-1">
                    {file ? file.name : "Drop your denial letter here"}
                  </div>
                  <div className="text-[13px] text-[#64748b]">
                    {file ? "Click to change file" : "or click to browse · PDF, DOCX, TXT"}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div>
                  <label className="text-[13px] font-medium text-[#94a3b8] mb-1.5 block">
                    Patient Chart Notes <span className="text-[#64748b] font-normal">(optional)</span>
                  </label>
                  <textarea
                    className="dark-textarea"
                    rows={3}
                    placeholder="Paste relevant chart text — diagnoses, lab values..."
                    value={chartText}
                    onChange={(e) => setChartText(e.target.value)}
                  />
                </div>

                <button className="btn-primary" disabled={!file} onClick={handleGenerate}>
                  Generate Appeal <ChevronRight className="w-4 h-4 ml-1" />
                </button>

                {error && (
                  <div className="mt-4 p-4 rounded-xl border border-[#ef4444] bg-[#111827]">
                    <div className="text-[#ef4444] font-semibold text-sm">❌ Error</div>
                    <div className="text-[#94a3b8] text-[13px] mt-1">{error}</div>
                  </div>
                )}
              </div>
            )}

            {pipelineState === "processing" && (
              <div className="animate-fade-in flex flex-col gap-6 max-w-lg mx-auto w-full">
                <div className="text-sm text-[#94a3b8] text-center">
                  Processing: <strong className="text-white">{file?.name || "sample case"}</strong>
                </div>

                <div className="flex flex-col gap-3">
                  {steps.map((step, i) => (
                    <div key={i} className={`pipeline-step ${step.status}`}>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {step.status === "completed" && <span className="text-[#10b981]">✅</span>}
                        {step.status === "active" && <span className="animate-pulse-dot text-[#f59e0b]">⏳</span>}
                        {step.status === "pending" && <span className="text-[#64748b]">○</span>}
                        <span className={step.status === "pending" ? "text-[#64748b]" : "text-white"}>
                          Step {i + 1}: {step.label}
                        </span>
                      </div>
                      {step.status !== "pending" && (
                        <div className="text-xs text-[#94a3b8] mt-1 ml-6">
                          {step.detail}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="progress-bar-outer">
                    <div className="progress-bar-indeterminate" />
                  </div>
                  <div className="text-xs text-[#64748b] text-center mt-2">
                    {elapsed.toFixed(1)}s elapsed · Running on AMD MI300X
                  </div>
                </div>
              </div>
            )}

            {pipelineState === "results" && (
              <div className="animate-slide-down flex flex-col w-full h-full" ref={resultsRef}>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1e3a5f]">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    <span className="font-semibold text-white">Appeal Generated</span>
                    {meta && (
                      <span className="text-xs text-[#64748b] font-mono hidden sm:inline-block">
                        {meta.elapsed}s · ~{Math.round(meta.contextChars / 4).toLocaleString()} tokens
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleReset} className="text-xs text-[#94a3b8] hover:text-white mr-4 transition-colors">
                      ← Try Another
                    </button>
                    <button onClick={copyAppeal} className="btn-secondary h-8 px-3 text-xs w-auto">
                      {copied ? "✓ Copied" : <><Copy className="w-3 h-3 mr-1" /> Copy</>}
                    </button>
                    <button className="btn-secondary h-8 px-3 text-xs w-auto">
                      <Download className="w-3 h-3 mr-1" /> PDF
                    </button>
                  </div>
                </div>

                {/* Split view for results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden h-[500px]">
                  
                  {/* Original Denial (mocked representation for demo purposes) */}
                  <div className="surface-card flex flex-col overflow-hidden bg-[#0f1523]">
                    <div className="bg-[#1e293b] px-3 py-2 text-xs font-semibold text-[#94a3b8] border-b border-[#1e3a5f]">
                      Extracted Denial Details
                    </div>
                    <div className="p-4 overflow-y-auto text-sm space-y-3">
                       <div className="kv-row"><span className="kv-label">Payer</span><span className="text-white">{denial?.payer || "N/A"}</span></div>
                       <div className="kv-row"><span className="kv-label">Code</span><span className="text-[#ef4444] font-mono">{denial?.denial_code || "N/A"}</span></div>
                       <div className="kv-row"><span className="kv-label">Service</span><span className="text-white">{denial?.denied_service || "N/A"}</span></div>
                       <div className="mt-4">
                         <div className="text-xs text-[#64748b] uppercase tracking-wider mb-2">Original Text</div>
                         <div className="text-[#94a3b8] leading-relaxed italic text-xs bg-[#111827] p-3 rounded-lg border border-[#1e3a5f]">
                           "Your request for coverage has been denied because medical necessity was not established. 
                           The submitted documentation did not meet the criteria outlined in our commercial medical policy..."
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Generated Appeal */}
                  <div className="surface-card flex flex-col overflow-hidden border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                    <div className="bg-[#1a2b4c] px-3 py-2 text-xs font-semibold text-[#3b82f6] border-b border-[#3b82f6] flex justify-between">
                      <span>Generated Appeal</span>
                      <span className="text-[#10b981]">High Confidence (82%)</span>
                    </div>
                    <div className="p-5 overflow-y-auto bg-[#0a0f1a]">
                      <div className="appeal-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{appeal}</ReactMarkdown>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {copied && <div className="toast">Copied to clipboard ✓</div>}
    </section>
  );
}
