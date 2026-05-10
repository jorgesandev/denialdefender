# DenialDefender Frontend Architecture

The frontend for DenialDefender is a premium, Series B MedTech-grade web application built to serve as both a high-conversion commercial landing page and a technical showcase for the AMD Developer Hackathon.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **Icons:** `lucide-react`
- **Animations:** CSS-based animations mapped via Tailwind (`animate-fade-in`, `animate-slide-down`, `animate-pulse-glow`)

## Design System: "Clinical Dark"
The application adheres to a highly customized "Clinical Dark" design system to convey trust, performance, and modern AI capabilities.
- **Backgrounds:** Deep slates and off-blacks (`#0a0f1a`, `#111827`).
- **Accents:** Vibrant Medical Cyan (`#00E5FF` to `#00B4D8`) used for gradients, success states, and primary actions.
- **Typography:** Inter (sans-serif for high legibility) and JetBrains Mono (for code, metadata, and pipeline statistics).
- **Glassmorphism:** Use of translucent surface cards (`.surface-card`) with subtle borders and shadows to create depth without relying on stark borders.

## Component Architecture

The single-page structure in `app/page.tsx` is modularized into distinct components stored in `app/components/`:

1. **`HeroSection.tsx`**: The main fold. Introduces the value proposition and dynamically presents the three pillars of the platform's architecture (AMD MI300X capabilities, RAG pipelines, and Multimodal Intake).
2. **`DemoSection.tsx`**: The core interactive experience.
   - Handles the state machine for the pipeline: `idle` → `processing` → `results`.
   - Manages the `multipart/form-data` upload of the PDF denial letters.
   - Visually simulates the processing steps while awaiting the actual inference response from the backend.
   - Renders the generated markdown appeal using `react-markdown` alongside the parsed metadata.
3. **`DataHubSection.tsx`**: Outlines the composition of the synthetic dataset and provides links to the repository and sample downloads.
4. **`Navbar.tsx` & `Footer.tsx`**: Provides persistent navigation, hackathon metadata, Hugging Face Space links, and dynamically checks the backend's `MI300X Online` health status via polling.

## State Management and API Integration

The frontend operates statelessly regarding authentication or session storage (as this is a public demo), but relies heavily on React state within `DemoSection.tsx` to handle the asynchronous pipeline.

- **Endpoint:** `NEXT_PUBLIC_API_URL/api/generate`
- **CORS & Routing:** The frontend is configured to hit the AMD cloud droplet via a secure `ngrok` tunnel (defined in `.env.local`). It sends the PDF and optional chart context, and awaits the synthesized appeal, updating the progress UI concurrently to provide immediate user feedback.
