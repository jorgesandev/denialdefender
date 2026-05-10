import { Download, FileArchive, ArrowRight, ShieldCheck, Database, Server } from "lucide-react";

const EVIDENCE_POINTS = [
  "Denial letter and payer policy criteria",
  "Patient chart with diagnoses, labs, imaging, and notes",
  "Clinical literature from PubMed Central Open Access",
  "Past successful appeals by payer and specialty",
];

export default function EvidenceSection() {
  return (
    <section id="evidence" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div>
            <div className="section-label">Evidence Stack</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              RAG over fine-tuning, with audit-ready citations
            </h2>
            <p className="text-slate-600 mb-8">
              Every appeal is grounded in retrieved evidence so reviewers can trace the exact policy clause or clinical fact.
            </p>

            <div className="space-y-4">
              {EVIDENCE_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-accent mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="surface-card p-4">
                <div className="flex items-center gap-3 text-slate-900 font-semibold">
                  <Server className="w-4 h-4 text-accent" />
                  AMD Instinct MI300X
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  192GB HBM3 keeps the 32B and 7B models co-resident at full FP16.
                </p>
              </div>
              <div className="surface-card p-4">
                <div className="flex items-center gap-3 text-slate-900 font-semibold">
                  <Database className="w-4 h-4 text-accent" />
                  Long-context retrieval
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Policy updates are indexed instantly, no retraining required.
                </p>
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="section-label">Data Hub</div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">30 synthetic cases</h3>
            <p className="text-sm text-slate-600 mb-6">
              A clean, HIPAA-safe dataset spanning five payers and eight specialties to prove the pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                className="btn-primary w-auto px-6"
                style={{ background: "#0f766e", boxShadow: "0 0 18px rgba(15,118,110,0.25)" }}
              >
                <FileArchive className="w-4 h-4 mr-2" />
                Download Full Repository
              </button>
              <button className="btn-secondary w-auto px-5">
                <Download className="w-4 h-4 mr-2" />
                Sample Case (ZIP)
              </button>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>Patient records, clinical notes, medications, and labs</li>
              <li>Payer correspondence for medical necessity and coding</li>
              <li>Policy bulletins and literature references</li>
            </ul>
            <a
              href="https://github.com/jorgesandev/denialdefender"
              className="mt-6 text-accent text-sm font-medium flex items-center hover:text-slate-900 transition-colors"
            >
              View generation scripts on GitHub <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
