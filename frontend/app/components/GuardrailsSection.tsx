import { CheckCircle2, XCircle } from "lucide-react";

const DOES = [
  "Drafts appeal letters with citations",
  "Surfaces payer policy criteria",
  "Summarizes clinical evidence for reviewers",
  "Exports submission-ready packets",
];

const DOES_NOT = [
  "Diagnose or prescribe",
  "Submit appeals without human review",
  "Make coverage determinations",
  "Train on customer PHI",
];

export default function GuardrailsSection() {
  return (
    <section id="guardrails" className="py-20 section-soft">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="section-label">Guardrails</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900">
              Clear boundaries for clinical trust
            </h2>
          </div>
          <p className="text-slate-600 max-w-md">
            Built for regulated workflows with explicit human oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="surface-card p-6">
            <div className="text-sm font-semibold text-slate-900 mb-4">What it does</div>
            <ul className="space-y-3">
              {DOES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-6">
            <div className="text-sm font-semibold text-slate-900 mb-4">What it does not</div>
            <ul className="space-y-3">
              {DOES_NOT.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <XCircle className="w-4 h-4 text-rose-500 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
