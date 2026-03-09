import { NextResponse } from "next/server";
import { MOCK_LISTINGS } from "@/lib/mock-data";

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const seed = hashString(today);
  const active = MOCK_LISTINGS.filter((l) => l.isActive && l.isApproved);

  // Select 5 deterministic listings for today
  const shuffled = [...active].sort(
    (a, b) => hashString(a.id + today) - hashString(b.id + today)
  );

  const dailyIds = shuffled.slice(0, 5).map((l) => l.id);

  return NextResponse.json({
    date: today,
    listingIds: dailyIds,
    totalRounds: 5,
  });
}

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
