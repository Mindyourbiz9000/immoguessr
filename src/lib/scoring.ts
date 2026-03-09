import type { ScoreLabel } from "@/types";

export function calculateScore(guess: number, actual: number): number {
  if (guess <= 0 || actual <= 0) return 0;
  const score = Math.max(0, Math.round(1000 * Math.exp(-4 * Math.abs(Math.log(guess / actual)))));
  return score;
}

export function getScoreLabel(score: number): ScoreLabel {
  if (score >= 950) return "Perfect!";
  if (score >= 800) return "Very close!";
  if (score >= 600) return "Good read";
  if (score >= 350) return "Not bad";
  return "Way off";
}

export function getScoreColor(score: number): string {
  if (score >= 950) return "text-yellow-400";
  if (score >= 800) return "text-emerald-400";
  if (score >= 600) return "text-blue-400";
  if (score >= 350) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBgColor(score: number): string {
  if (score >= 950) return "from-yellow-500/20 to-yellow-600/5";
  if (score >= 800) return "from-emerald-500/20 to-emerald-600/5";
  if (score >= 600) return "from-blue-500/20 to-blue-600/5";
  if (score >= 350) return "from-orange-500/20 to-orange-600/5";
  return "from-red-500/20 to-red-600/5";
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-BE").format(n);
}
