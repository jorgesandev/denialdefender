export default function ProofBar() {
  const stats = [
    { value: "44-82%", label: "Appeal success rate when filed" },
    { value: "$110B", label: "Stranded recoverable revenue" },
    { value: "60-90s", label: "Draft generation time" },
    { value: "$0", label: "Upfront cost to start" },
  ];

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-number text-slate-900">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
