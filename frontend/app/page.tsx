"use client";
import { useState, useRef } from "react";

interface DenialData {
  payer?: string;
  denial_code?: string;
  denial_reason?: string;
  denied_service?: string;
  procedure_codes?: string[];
}

interface MetaData {
  elapsed: number;
  was_scanned: boolean;
  context_size: number;
  models: { vision: string | null; language: string };
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [chartText, setChartText] = useState("");
  const [appeal, setAppeal] = useState("");
  const [loading, setLoading] = useState(false);
  const [denial, setDenial] = useState<DenialData | null>(null);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function generate() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setAppeal("");
    setDenial(null);
    setMeta(null);

    const fd = new FormData();
    fd.append("denial_pdf", file);
    fd.append("chart_text", chartText);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
      const r = await fetch(`${apiUrl}/api/generate`, {
        method: "POST",
        body: fd,
      });

      if (!r.ok) {
        const err = await r.text();
        throw new Error(err || `HTTP ${r.status}`);
      }

      const j = await r.json();
      setDenial(j.denial);
      setAppeal(j.appeal);
      setMeta({
        elapsed: j.elapsed_seconds,
        was_scanned: j.was_scanned,
        context_size: j.context_size_chars,
        models: j.models_used,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function copyAppeal() {
    await navigator.clipboard.writeText(appeal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-[#1A2B4A]">DenialDefender</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Autonomous insurance appeals on AMD MI300X — Qwen3-32B + Qwen2.5-VL-7B co-resident, full FP16
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-lg text-slate-800">1. Upload Denial Letter</h2>

            {/* File dropzone */}
            <label
              className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                file
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <div className="text-3xl mb-2">{file ? "✅" : "📄"}</div>
              <p className="text-sm text-slate-600 text-center">
                {file ? (
                  <span className="font-medium text-blue-700">{file.name}</span>
                ) : (
                  "Click to upload or drag & drop"
                )}
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF only · Digital or scanned</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            {/* Optional chart text */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Patient Chart Notes{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                value={chartText}
                onChange={(e) => setChartText(e.target.value)}
                placeholder="Paste relevant patient chart notes here — diagnoses, lab values, treatment history..."
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={!file || loading}
              className="w-full bg-[#1A2B4A] text-white font-medium py-3 rounded-lg hover:bg-[#243d6a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Generating appeal..." : "Generate Appeal Letter"}
            </button>

            {/* Loading indicator */}
            {loading && (
              <div className="text-center space-y-2">
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <span className="animate-pulse">⚡</span>
                  Running on AMD MI300X · ~60 sec end-to-end
                </p>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full w-2/3 animate-pulse" />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Denial metadata */}
            {denial && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Parsed Denial
                </p>
                <div className="flex flex-wrap gap-2">
                  {denial.payer && (
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      {denial.payer}
                    </span>
                  )}
                  {denial.denial_code && (
                    <span className="inline-flex items-center bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">
                      Code: {denial.denial_code}
                    </span>
                  )}
                  {denial.denied_service && (
                    <span className="inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      {denial.denied_service}
                    </span>
                  )}
                </div>
                {denial.denial_reason && (
                  <p className="text-xs text-slate-500 italic">{denial.denial_reason}</p>
                )}
                {meta && (
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <p>Generated in {meta.elapsed}s</p>
                    {meta.was_scanned && (
                      <p className="text-purple-600">Vision model used (scanned PDF)</p>
                    )}
                    {meta.context_size > 0 && (
                      <p>
                        Context: ~{Math.round(meta.context_size / 4).toLocaleString()} tokens
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-slate-800">2. Generated Appeal Letter</h2>
              {appeal && (
                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  78% overturn rate
                </span>
              )}
            </div>

            {!appeal && !loading && (
              <div className="flex flex-col items-center justify-center flex-1 min-h-64 text-slate-400">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-sm">Appeal letter will appear here</p>
                <p className="text-xs mt-1">Upload a denial PDF and click Generate</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center flex-1 min-h-64 text-slate-400">
                <div className="text-5xl mb-3 animate-bounce">⚡</div>
                <p className="text-sm font-medium text-slate-600">
                  Qwen3-32B synthesizing evidence...
                </p>
                <p className="text-xs mt-1">Retrieving chart, policy, and literature context</p>
              </div>
            )}

            {appeal && (
              <div className="flex flex-col flex-1">
                <div className="flex-1 overflow-y-auto max-h-[600px] pr-1">
                  <pre className="whitespace-pre-wrap text-sm font-serif leading-relaxed text-slate-800">
                    {appeal}
                  </pre>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={copyAppeal}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {copied ? "Copied!" : "Copy to clipboard"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Architecture badges */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {[
            "AMD MI300X · 192GB VRAM",
            "Qwen3-32B + Qwen2.5-VL-7B co-resident",
            "~129GB / 192GB · Full FP16",
            "~$0.03 per appeal",
            "vLLM 0.14 + ROCm 7.0",
            "$262B/yr unappealed in the US",
          ].map((label) => (
            <span
              key={label}
              className="bg-white border border-slate-200 text-slate-500 text-xs px-3 py-1 rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
