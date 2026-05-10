export default function FinalCTASection() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="surface-card p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-900">
              Bring autonomous appeals to your RCM team
            </h2>
            <p className="text-slate-600 mt-3 max-w-xl">
              Start a pilot in days. We integrate with your denial intake workflow and deliver traceable, reviewer-ready appeals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#demo" className="btn-primary w-auto px-7 h-12 text-sm">
              Try the Demo
            </a>
            <a
              href="mailto:contact@jorgesandoval.dev"
              className="btn-secondary w-auto px-7 h-12 text-sm"
            >
              Request Pilot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
