import { Download, FileArchive, ArrowRight } from "lucide-react";

export default function DataHubSection() {
  return (
    <section id="data-hub" className="py-24 bg-[#111827] border-t border-[#1e3a5f]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e293b] border border-[#10b981]/30 text-[#10b981] text-xs font-semibold uppercase tracking-wider mb-6">
              100% Synthetic Data — HIPAA Compliant
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Open-Source Data Hub</h2>
            <p className="text-[#94a3b8] text-lg leading-relaxed mb-8">
              We built a foundational dataset of 30 comprehensive synthetic patient cases across 5 payers and 8 specialties to prove the architecture. Each case includes patient history, clinical notes, prior authorizations, synthetic denial letters, and payer policy bulletins.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary w-auto px-6" style={{ background: "#10b981", boxShadow: "0 0 20px rgba(16,185,129,0.2)" }}>
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
            <div className="surface-card p-6 border-[#1e3a5f]">
              <div className="text-sm font-semibold text-white mb-4 border-b border-[#1e3a5f] pb-2">Dataset Composition</div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e293b] text-[#3b82f6] flex items-center justify-center shrink-0 mt-0.5 text-xs">1</div>
                  <div>
                    <strong className="block text-sm text-white">Patient Records</strong>
                    <span className="text-xs text-[#64748b]">Generated via Synthea. Includes demographics, conditions, medications, and full clinical narratives.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e293b] text-[#3b82f6] flex items-center justify-center shrink-0 mt-0.5 text-xs">2</div>
                  <div>
                    <strong className="block text-sm text-white">Payer Correspondence</strong>
                    <span className="text-xs text-[#64748b]">Synthetic denial letters mimicking 5 major US payers, spanning medical necessity, coding, and prior auth issues.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#1e293b] text-[#3b82f6] flex items-center justify-center shrink-0 mt-0.5 text-xs">3</div>
                  <div>
                    <strong className="block text-sm text-white">Clinical Evidence</strong>
                    <span className="text-xs text-[#64748b]">Payer medical policy bulletins and retrieved PubMed Central Open Access literature.</span>
                  </div>
                </li>
              </ul>
              <a href="https://github.com/jorgesandev/denialdefender" className="mt-6 text-[#3b82f6] text-sm font-medium flex items-center hover:text-white transition-colors">
                View Generation Scripts on GitHub <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
