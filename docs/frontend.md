# DenialDefender Frontend

This document describes the frontend's style, layout, and where to find the key UI pieces. The site uses a refined "Executive Light" theme with a clean, premium landing layout (NAV → HERO → ProofBar → Workflow → Demo → Evidence → Guardrails → CTA → Footer).

## Tech & Design Summary
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Tailwind CSS v4
- **Icons:** lucide-react (fallbacks: `GitFork` used where `Github` wasn't available)
- **Fonts:** Sora for display, IBM Plex Sans for body, IBM Plex Mono for code (wired in `app/layout.tsx` and CSS variables)
- **Theme:** "Executive Light" — light backgrounds, a saturated blue navbar (`#0f4c81`), subtle elevated cards, and restrained accent colors.

## Key Files & Assets
- Logo: [frontend/public/brand/logos/logo-with-text-hq.png](frontend/public/brand/logos/logo-with-text-hq.png)
- Navbar: [frontend/app/components/Navbar.tsx](frontend/app/components/Navbar.tsx)
- Global tokens & theme: [frontend/app/globals.css](frontend/app/globals.css)
- Hero: [frontend/app/components/HeroSection.tsx](frontend/app/components/HeroSection.tsx)
- Demo: [frontend/app/components/DemoSection.tsx](frontend/app/components/DemoSection.tsx)
- Evidence & Data: [frontend/app/components/EvidenceSection.tsx](frontend/app/components/EvidenceSection.tsx)

## Components (what they do)
- **Navbar:** compact branding + centered nav links; shows health/status pills and external links. Adjust height/padding in [globals.css](frontend/app/globals.css) and logo sizing in [Navbar.tsx](frontend/app/components/Navbar.tsx).
- **HeroSection:** main value prop and CTAs (Try Demo, View Evidence, GitHub & Hugging Face buttons). Status pill polls the backend health endpoint.
- **ProofBar:** metric tiles under the fold to build trust.
- **WorkflowSection:** 4-step visual pipeline explanation.
- **DemoSection:** upload UI, progress simulation, and streaming/display of generated appeal.
- **EvidenceSection / DataHubSection:** documents data sources, payer policies, and sample downloads.
- **GuardrailsSection & FinalCTASection:** usage guidance and closing CTA.

## Styling & Tokens
- Global tokens live in `frontend/app/globals.css` and are used across Tailwind utilities.
- Navbar color: `#0f4c81` (see `.nav-bar` in `globals.css`).
- Fonts are injected via `app/layout.tsx` and referenced with CSS vars: `--font-display`, `--font-body`, `--font-code`.

## Run & Development
1. Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

2. Set the backend URL in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:9000
```

3. The app will be available at `http://localhost:3000` by default.

## Quick tips for common edits
- Increase navbar height or logo size: edit [globals.css](frontend/app/globals.css) `.nav-bar` height and padding, then update the `Image` `width`/`height` values in [Navbar.tsx](frontend/app/components/Navbar.tsx).
- Change hero CTA labels or add icons: edit [HeroSection.tsx](frontend/app/components/HeroSection.tsx).
- Update theme tokens (colors/spacing): edit `frontend/app/globals.css` and follow existing CSS variable naming to keep Tailwind utilities consistent.

## Environment & API
- The frontend reads only one runtime variable: `NEXT_PUBLIC_API_URL` (used to call `/api/generate` and the health endpoint).

## Contact
For visual tweaks or new design assets, edit `frontend/public/brand/logos/` and update `Navbar.tsx` for sizing. Ping the repo owner for deployment keys and HF Space credentials.

---
See the live code in `frontend/app/components/` for implementation details and examples.
