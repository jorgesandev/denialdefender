# DenialDefender: Frontend Interface

This directory contains the professional web interface for DenialDefender, built to demonstrate the scale and speed of the **AMD Instinct™ MI300X** inference pipeline.

## Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Styling**: Tailwind CSS v4 (Alpha)
- **Icons**: Lucide React
- **Theme**: "Clinical Dark" (See `app/globals.css`)

## Prerequisites

- **Node.js**: v20+
- **Backend**: A running instance of the DenialDefender FastAPI orchestrator (locally or via secure tunnel).

## Getting Started

1. **Installation**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configuration**:
   Create a `.env.local` file with your backend endpoint:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:9000
   ```

3. **Development Mode**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Directory Structure

- `app/components/`: High-intent UI sections (Hero, Demo, Evidence, etc.).
- `app/globals.css`: Foundational design tokens and Tailwind v4 configuration.
- `app/layout.tsx`: Root configuration, SEO metadata, and premium font injection.
- `public/brand/`: High-resolution logos and clinical brand assets.

## Production Build

To build and serve the optimized application:
```bash
npm run build
npm start
```

---
See the [Frontend Deep Dive](../docs/frontend.md) for detailed design tokens and component documentation.
