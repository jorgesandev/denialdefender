"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const r = await fetch(process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/health", { signal: AbortSignal.timeout(5000) });
        if (mounted) setOnline(r.ok);
      } catch {
        if (mounted) setOnline(false);
      }
    };
    check();
    const id = setInterval(check, 30_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return (
    <nav className="nav-bar">
      <Link href="/" className="flex items-center gap-3" aria-label="DenialDefender home">
        <Image
          src="/brand/logos/logo-with-text-hq.png"
          alt="DenialDefender"
          width={138}
          height={30}
          priority
        />
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#demo" className="subtle-link">Demo</a>
        <a href="#architecture" className="subtle-link">Architecture</a>
        <a href="#data-hub" className="subtle-link">Data Hub</a>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" style={{ fontSize: 12 }}>
          <span
            className="animate-pulse-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: online === true ? "#10b981" : online === false ? "#ef4444" : "#64748b",
              display: "inline-block",
            }}
          />
          <span style={{ color: "var(--text-secondary)" }}>
            {online === true ? "MI300X Online" : online === false ? "Offline" : "Checking…"}
          </span>
        </div>
      </div>
    </nav>
  );
}
