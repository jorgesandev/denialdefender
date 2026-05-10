"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="nav-bar">
      <Link href="/" className="flex items-center gap-3" aria-label="DenialDefender home">
          <Image
            src="/brand/logos/logo-with-text-hq.png"
            alt="Denial Defender"
            width={180}
            height={44}
            className="object-contain"
            priority
          />
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#workflow" className="subtle-link">Workflow</a>
          <a href="#demo" className="subtle-link">Demo</a>
          <a href="#evidence" className="subtle-link">Evidence</a>
          <a href="#guardrails" className="subtle-link">Guardrails</a>
      </div>

      <div className="hidden md:block w-36" aria-hidden="true" />
    </nav>
  );
}
