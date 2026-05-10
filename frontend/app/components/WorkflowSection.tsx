const WORKFLOW_STEPS = [
  {
    title: "Upload the denial",
    detail: "Drop a PDF, fax, or portal export. We extract the denial code, payer, and request details.",
  },
  {
    title: "Retrieve evidence",
    detail: "We load chart data, payer policy bulletins, and clinical literature for the case.",
  },
  {
    title: "Draft the appeal",
    detail: "Qwen3-32B composes the letter with citations and payer-specific language.",
  },
  {
    title: "Review and export",
    detail: "Your team edits, approves, and exports PDF or TXT for submission.",
  },
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-20 section-soft">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="section-label">Workflow</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900">
              From denial to submission-ready appeal
            </h2>
          </div>
          <p className="text-slate-600 max-w-md">
            Designed for RCM teams that need speed, consistency, and evidence traceability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {WORKFLOW_STEPS.map((step, index) => (
            <div key={step.title} className="surface-card p-5">
              <div className="text-xs text-slate-500 font-semibold">Step {index + 1}</div>
              <div className="text-lg font-semibold text-slate-900 mt-2">{step.title}</div>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
