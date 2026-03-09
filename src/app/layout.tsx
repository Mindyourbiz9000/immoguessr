import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImmoGuessr Belgium — Guess the property price",
  description:
    "Can you guess Belgian property prices? Play ImmoGuessr and test your real estate instincts. Daily challenges, leaderboards, and more.",
  openGraph: {
    title: "ImmoGuessr Belgium",
    description: "How well do you know Belgian property prices?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <Navbar />
        <main className="pt-14 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
