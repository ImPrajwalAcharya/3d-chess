import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vajra 3D Chess | Himalayan Monastery & Newa Heritage",
  description:
    "A production-ready serverless 3D Chess web application inspired by traditional Nepali monasteries (Gumbas) and Newa pagoda temples. Featuring multi-level AI engines, serverless WebRTC P2P multiplayer, and procedural Staunton 3D pieces.",
  keywords: [
    "Chess",
    "3D Chess",
    "Nepali Heritage",
    "Monastery",
    "Three.js",
    "React Three Fiber",
    "WebRTC Chess",
    "Stockfish",
    "Next.js Chess",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☸</text></svg>" />
      </head>
      <body className="antialiased bg-[#0E0806] text-amber-100 overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
