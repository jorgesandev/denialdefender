# DenialDefender Frontend

This directory contains the Next.js frontend for DenialDefender—a premium, "Clinical Dark" web interface designed to showcase the AMD MI300X RAG pipeline.

## Prerequisites

- **Node.js:** v18+ (v20 recommended)
- **Backend:** A running instance of the DenialDefender FastAPI backend (either locally on port `9000` or hosted via an `ngrok` tunnel).

## Getting Started

1. **Install Dependencies:**
   Navigate to the `frontend` directory and run:
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root of the `frontend` directory. 
   
   If you are testing against a local backend on your machine:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:9000
   ```
   
   If you are testing against the live AMD Developer Cloud instance (routed via ngrok):
   ```env
   NEXT_PUBLIC_API_URL=https://<your-ngrok-url>.ngrok-free.dev
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Directory Structure

- `app/globals.css`: Contains the foundational design tokens, CSS variables, and custom utility classes for the "Clinical Dark" theme.
- `app/layout.tsx`: Root layout, font loading (Inter and JetBrains Mono), and metadata.
- `app/page.tsx`: The main landing page orchestrating the layout.
- `app/components/`: Modular UI sections including the Hero, Interactive Demo, Data Hub, Navbar, and Footer.
- `public/`: Static assets, branding logos, and the sample PDF dataset available for users to download.

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```
This will compile the application and start a Node server ready for production traffic.
