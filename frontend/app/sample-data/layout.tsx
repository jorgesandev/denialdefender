import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Cases — DenialDefender",
  description:
    "Download synthetic insurance denial letters and patient charts for testing DenialDefender. Five real-world denial scenarios across five major US payers.",
};

export default function SampleDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
