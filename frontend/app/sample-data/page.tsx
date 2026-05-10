"use client";

import Link from "next/link";
import { SAMPLE_CASES } from "../data";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const DENIAL_LABELS: Record<string, string> = {
  "001": "Lack of Medical Necessity",
  "002": "Missing Prior Authorization",
  "003": "Non-Covered Service",
  "004": "Coding Error",
  "005": "Experimental Treatment",
};

export default function SampleDataPage() {
  return (
    <>
      {/* Nav */}
      <nav className="nav-bar">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 subtle-link" style={{ textDecoration: "none" }}>
            <span className="text-xl">🛡️</span>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              DenialDefender
            </span>
          </Link>
        </div>
        <div style={{ fontSize: 13 }}>
          <Link href="/" className="subtle-link">
            ← Back to Demo
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>
            📥 Sample Cases
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
            Five synthetic insurance denial cases for testing DenialDefender. Each case includes
            a denial letter PDF and a patient chart PDF. All data is synthetic — no real PHI.
          </p>
        </div>

        {/* Download All */}
        <div className="animate-fade-in-up" style={{ marginBottom: 28, animationDelay: "50ms" }}>
          <a
            href="/data/denialdefender_sample_cases.zip"
            download
            className="btn-primary"
            style={{
              width: "auto",
              display: "inline-flex",
              padding: "0 28px",
              height: 48,
              fontSize: 14,
              textDecoration: "none",
              borderRadius: 12,
            }}
          >
            📦 Download All Cases (ZIP · 1.2 MB)
          </a>
        </div>

        {/* Case cards */}
        <div className="stagger-children flex flex-col gap-4">
          {SAMPLE_CASES.map((c) => (
            <div key={c.id} className="surface-card" style={{ padding: 24 }}>
              {/* Top row */}
              <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 4 }}>
                    Case {c.id} · {DENIAL_LABELS[c.id]}
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                    🏥 {c.patient}
                  </h2>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {c.age}{c.sex} · {c.payer}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    textAlign: "right",
                  }}
                >
                  {fmt(c.amount)}
                </div>
              </div>

              {/* Detail row */}
              <div className="flex flex-wrap gap-2" style={{ marginBottom: 16 }}>
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(59,130,246,0.15)",
                    color: "var(--accent-primary)",
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "4px 12px",
                    borderRadius: 8,
                  }}
                >
                  {c.procedure}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(255,255,255,0.05)",
                    color: "var(--text-muted)",
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "4px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border-default)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {c.denialCode}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: 8,
                    color: c.outcomeColor,
                    background: `${c.outcomeColor}18`,
                  }}
                >
                  ⚡ {c.outcome}
                </span>
              </div>

              {/* Download buttons */}
              <div className="flex gap-3">
                <a
                  href={`/data/denials/${c.folder}/denial_letter.pdf`}
                  download
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    padding: "8px 16px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)";
                    (e.currentTarget as HTMLElement).style.background = "var(--accent-glow)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-input)";
                  }}
                >
                  📄 Denial Letter
                </a>
                <a
                  href={`/data/denials/${c.folder}/patient_chart.pdf`}
                  download
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                    padding: "8px 16px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)";
                    (e.currentTarget as HTMLElement).style.background = "var(--accent-glow)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-input)";
                  }}
                >
                  📋 Patient Chart
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-default)", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
            All data is synthetic. No real patient health information (PHI) is used.
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            DenialDefender · Team Sophon · AMD Developer Hackathon 2026
          </p>
        </div>
      </main>
    </>
  );
}
