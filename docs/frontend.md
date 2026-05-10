# DenialDefender: Frontend Design & Architecture

This document outlines the design philosophy, technical stack, and component architecture for the DenialDefender frontend.

## 1. Design Philosophy: "Clinical Dark"

The DenialDefender UI is designed to evoke trust, precision, and medical authority. We utilize a **"Clinical Dark"** aesthetic:
- **Primary Palette**: Deep slate backgrounds, crisp white typography, and clinical blue accents.
- **Typography**: Sora for headings (modern/clean), IBM Plex Sans for body (highly readable), and IBM Plex Mono for technical/data overlays.
- **Micro-interactions**: Subtle hover states and smooth progress transitions to reduce user anxiety during the 60-90s inference window.

## 2. Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4 (Alpha)
- **Icons**: Lucide React
- **Deployment**: Vercel (Production) / Hugging Face Spaces (Demo)

## 3. Core Component Architecture

The application is structured into high-intent sections:

- **HeroSection**: Immediate value proposition and system health monitoring.
- **ProofBar**: Live metrics demonstrating the scale of the denial problem.
- **WorkflowSection**: A 4-step visualization of the RAG pipeline.
- **DemoSection**: The core interaction layer. Handles file uploads, multipart form submission, and real-time inference streaming.
- **EvidenceSection**: Transparency layer showing the data sources and payer policies used in generation.
- **GuardrailsSection**: Clear documentation on what the AI does and does not do (Human-in-the-loop).

## 4. State Management & API Integration

The frontend maintains a lean state footprint:
- **API URL**: Configured via `NEXT_PUBLIC_API_URL` in `.env.local`.
- **Health Polling**: A background hook pings the FastAPI `/health` endpoint to update the UI "System Online" status.
- **Streaming**: The demo UI consumes a server-sent events (SSE) style stream from the backend, rendering the appeal letter word-by-word for a superior UX.

## 5. Development & Customization

To run the frontend locally:
```bash
cd frontend
npm install
npm run dev
```

### Common Customizations:
- **Branding**: Logos are stored in `public/brand/logos/`. Sizing is controlled in `components/Navbar.tsx`.
- **Theme Tokens**: Global colors and font pairings are defined in `app/globals.css` using Tailwind v4 CSS variables.

---
See the [Backend Documentation](backend.md) for details on how the frontend communicates with the MI300X inference engine.
