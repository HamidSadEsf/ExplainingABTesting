import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adaptive Bayesian A/B Testing Dashboard",
  description:
    "Interactive Bayesian experimentation dashboard with posterior distributions, expected loss guardrails, and prior sensitivity testing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}