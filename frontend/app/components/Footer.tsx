export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-12 text-sm text-slate-500">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-slate-900">DenialDefender</span>
          </div>
          <p className="mb-4 text-slate-600 max-w-sm">
            Autonomous insurance appeals for hospital revenue cycle teams. Powered by AMD Instinct MI300X.
          </p>
          <div className="text-xs text-slate-500">
            AMD Developer Hackathon 2026<br />
            Vision and Multimodal AI Track
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Project</h4>
          <ul className="space-y-2">
            <li><a href="#demo" className="hover:text-slate-900 transition-colors">Interactive Demo</a></li>
            <li><a href="#evidence" className="hover:text-slate-900 transition-colors">Evidence Stack</a></li>
            <li><a href="https://github.com/jorgesandev/denialdefender" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">GitHub Repository</a></li>
            <li><a href="https://huggingface.co/spaces/lablab-ai-amd-developer-hackathon/denialdefender" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">Hugging Face Space</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Team Sophon</h4>
          <ul className="space-y-2">
            <li>Jorge Sandoval</li>
            <li><a href="mailto:contact@jorgesandoval.dev" className="hover:text-slate-900 transition-colors">contact@jorgesandoval.dev</a></li>
            <li><a href="https://jorgesandoval.dev" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">jorgesandoval.dev</a></li>
            <li><a href="https://x.com/jorgesandev" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">X: @jorgesandev</a></li>
            <li><a href="https://www.linkedin.com/in/jorgesandev/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">LinkedIn: @jorgesandev</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
