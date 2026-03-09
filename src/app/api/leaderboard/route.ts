import { NextRequest, NextResponse } from "next/server";

// In-memory mock leaderboard
const leaderboard = [
  { id: "1", username: "BelgianRealtor", score: 4820, date: "2026-03-09", streak: 14, mode: "daily" },
  { id: "2", username: "ImmoExpert_BE", score: 4650, date: "2026-03-09", streak: 12, mode: "daily" },
  { id: "3", username: "BruxellesGuessr", score: 4510, date: "2026-03-09", streak: 8, mode: "daily" },
  { id: "4", username: "AntwerpenAce", score: 4380, date: "2026-03-09", streak: 6, mode: "daily" },
  { id: "5", username: "FlandersFlip", score: 4200, date: "2026-03-09", streak: 5, mode: "daily" },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "daily";
  const period = searchParams.get("period") || "daily";

  return NextResponse.json({
    entries: leaderboard.filter((e) => e.mode === mode),
    period,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, score, mode } = body;

  leaderboard.push({
    id: String(leaderboard.length + 1),
    username,
    score,
    date: new Date().toISOString().slice(0, 10),
    streak: 1,
    mode: mode || "daily",
  });

  leaderboard.sort((a, b) => b.score - a.score);

  return NextResponse.json({ success: true });
}
