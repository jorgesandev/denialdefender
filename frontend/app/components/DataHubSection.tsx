import { Download, FileArchive, ArrowRight } from "lucide-react";

export default function DataHubSection() {
  return (
    <section id="data-hub" className="py-24 section-soft">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="pill status-pill mb-6">100% Synthetic Data — HIPAA Compliant</div>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-6">Open-Source Data Hub</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              We built a foundational dataset of 30 comprehensive synthetic patient cases across 5 payers and 8 specialties to prove the architecture. Each case includes patient history, clinical notes, prior authorizations, synthetic denial letters, and payer policy bulletins.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary w-auto px-6" style={{ background: "#0f766e", boxShadow: "0 0 18px rgba(15,118,110,0.25)" }}>
                <FileArchive className="w-4 h-4 mr-2" />
                Download Full Repository (30 Cases)
              </button>
              <button className="btn-secondary w-auto px-6">
                <Download className="w-4 h-4 mr-2" />
                Sample Case (ZIP)
              </button>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="surface-card p-6">
              <div className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Dataset Composition</div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full text-accent flex items-center justify-center shrink-0 mt-0.5 text-xs"
                    style={{ background: "var(--bg-input)" }}
                  >
                    1
                  </div>
                  <div>
                    <strong className="block text-sm text-slate-900">Patient Records</strong>
                    <span className="text-xs text-slate-500">Generated via Synthea. Includes demographics, conditions, medications, and full clinical narratives.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full text-accent flex items-center justify-center shrink-0 mt-0.5 text-xs"
                    style={{ background: "var(--bg-input)" }}
                  >
                    2
                  </div>
                  <div>
                    <strong className="block text-sm text-slate-900">Payer Correspondence</strong>
                    <span className="text-xs text-slate-500">Synthetic denial letters mimicking 5 major US payers, spanning medical necessity, coding, and prior auth issues.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full text-accent flex items-center justify-center shrink-0 mt-0.5 text-xs"
                    style={{ background: "var(--bg-input)" }}
                  >
                    3
                  </div>
                  <div>
                    <strong className="block text-sm text-slate-900">Clinical Evidence</strong>
                    <span className="text-xs text-slate-500">Payer medical policy bulletins and retrieved PubMed Central Open Access literature.</span>
                  </div>
                </li>
              </ul>
              <a href="https://github.com/jorgesandev/denialdefender" className="mt-6 text-accent text-sm font-medium flex items-center hover:text-slate-900 transition-colors">
                View Generation Scripts on GitHub <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
