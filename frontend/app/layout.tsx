import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "DenialDefender — Autonomous Insurance Appeal Generation",
  description:
    "AI-powered insurance appeal letters in under 90 seconds. Qwen3-32B + Qwen2.5-VL-7B co-resident on AMD MI300X, full FP16. Built for hospital revenue cycle teams.",
  keywords: [
    "insurance appeals",
    "medical billing",
    "AI",
    "AMD MI300X",
    "revenue cycle management",
    "denied claims",
    "healthcare AI",
  ],
  openGraph: {
    title: "DenialDefender — Autonomous Insurance Appeals",
    description:
      "Autonomous insurance appeal generation powered by AMD MI300X. Upload a denial letter, get a submission-ready appeal in 60 seconds.",
    type: "website",
    url: "https://trydenialdefender.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "DenialDefender",
    description: "Autonomous insurance appeals on AMD MI300X",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: "#0a0f1a", color: "#f1f5f9" }}
      >
        {children}
      </body>
    </html>
  );
}
