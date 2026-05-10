"use client";

import { ChevronRight, Database, Server, BrainCircuit } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-[#3b82f6] rounded-full blur-[150px] opacity-[0.15] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e293b] border border-[#3b82f6]/30 text-[#3b82f6] text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse"></span>
            AMD Developer Hackathon 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Autonomous insurance appeals for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#00B4D8]">RCM teams</span>
          </h1>
          
          <p className="text-xl text-[#94a3b8] mb-10 max-w-2xl mx-auto leading-relaxed">
            We do not charge if we do not recover. A $110B problem solved by Qwen3-32B and AMD Instinct MI300X.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#demo" className="btn-primary w-auto px-8 h-14 text-base rounded-full shadow-[0_0_30px_rgba(0,229,255,0.3)]">
              Try the Demo <ChevronRight className="w-5 h-5 ml-1" />
            </a>
            <a href="#architecture" className="btn-secondary w-auto px-8 h-14 text-base rounded-full border-[#1e3a5f] bg-[#111827]">
              View Architecture
            </a>
          </div>
        </div>

        {/* Browser Mockup / Video Placeholder */}
        <div className="relative mx-auto max-w-5xl animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="surface-card rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#1e3a5f]">
            <div className="bg-[#111827] px-4 py-3 flex items-center border-b border-[#1e3a5f]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              </div>
              <div className="mx-auto bg-[#0a0f1a] px-3 py-1 rounded-md text-xs text-[#64748b] font-mono flex items-center gap-2 border border-[#1e3a5f]">
                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                trydenialdefender.com
              </div>
            </div>
            <div className="aspect-video bg-[#0a0f1a] relative flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#111827] to-[#0a0f1a] opacity-80"></div>
              {/* Fake UI elements for the hero mock */}
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#1e293b] border border-[#3b82f6] flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                   <span className="text-3xl text-white">▶</span>
                </div>
                <p className="text-[#94a3b8] font-medium tracking-wide text-sm">WATCH 30-SECOND PIPELINE OVERVIEW</p>
              </div>
              {/* Decorative grid */}
              <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="architecture" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          <div className="surface-card p-8 group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#1e293b] text-[#00E5FF] flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-shadow">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AMD Instinct MI300X</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              192 GB of HBM3 memory allows our 32B parameter dense model and 7B vision model to remain co-resident in full FP16 precision.
            </p>
          </div>
          <div className="surface-card p-8 group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#1e293b] text-[#7B2CBF] flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(123,44,191,0.2)] transition-shadow">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">RAG, Not Fine-Tuning</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              Every fact is grounded. We load patient charts, payer policies, and clinical literature dynamically into a massive 64K+ working context window.
            </p>
          </div>
          <div className="surface-card p-8 group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#1e293b] text-[#10b981] flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-shadow">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multimodal Intake</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              Scanned faxes, digital PDFs, handwritten notes. Qwen2.5-VL-7B seamlessly interprets messy healthcare data before routing to the reasoning engine.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
