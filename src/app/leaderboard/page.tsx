"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trophy, Medal, Flame, Crown } from "lucide-react";

const tabs = ["Daily", "Weekly", "All-time"] as const;
type Tab = (typeof tabs)[number];

const mockLeaderboard = [
  { rank: 1, name: "BelgianRealtor", score: 4820, streak: 14, avatar: "BR" },
  { rank: 2, name: "ImmoExpert_BE", score: 4650, streak: 12, avatar: "IE" },
  { rank: 3, name: "BruxellesGuessr", score: 4510, streak: 8, avatar: "BG" },
  { rank: 4, name: "AntwerpenAce", score: 4380, streak: 6, avatar: "AA" },
  { rank: 5, name: "FlandersFlip", score: 4200, streak: 5, avatar: "FF" },
  { rank: 6, name: "WalloniaPro", score: 4050, streak: 3, avatar: "WP" },
  { rank: 7, name: "GentGuru", score: 3980, streak: 3, avatar: "GG" },
  { rank: 8, name: "LeuvenLegend", score: 3850, streak: 2, avatar: "LL" },
  { rank: 9, name: "NamurNinja", score: 3720, streak: 1, avatar: "NN" },
  { rank: 10, name: "LiègeLife", score: 3600, streak: 1, avatar: "LL" },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Daily");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <Trophy className="h-12 w-12 text-yellow-400 mx-auto" />
        <h1 className="text-3xl font-black text-white">Leaderboard</h1>
        <p className="text-white/50 text-sm">Top players in Belgium</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
              activeTab === tab
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 0, 2].map((idx) => {
          const entry = mockLeaderboard[idx];
          const isFirst = idx === 0;
          return (
            <Card
              key={idx}
              className={cn(
                "text-center",
                isFirst && "border-yellow-400/30 bg-gradient-to-b from-yellow-500/10 to-transparent -mt-4"
              )}
            >
              <CardContent className="p-4 space-y-2">
                <div
                  className={cn(
                    "h-12 w-12 rounded-full mx-auto flex items-center justify-center font-bold text-sm",
                    isFirst
                      ? "bg-yellow-500/20 text-yellow-400"
                      : idx === 1
                      ? "bg-gray-400/20 text-gray-300"
                      : "bg-amber-700/20 text-amber-500"
                  )}
                >
                  {entry.avatar}
                </div>
                {isFirst && <Crown className="h-5 w-5 text-yellow-400 mx-auto" />}
                <p className="text-sm font-bold text-white truncate">{entry.name}</p>
                <p className="text-lg font-black text-white">{entry.score.toLocaleString()}</p>
                {entry.streak > 0 && (
                  <Badge variant="outline" className="text-orange-400 border-orange-400/30">
                    <Flame className="h-3 w-3 mr-1" />
                    {entry.streak}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <Card>
        <CardContent className="p-2">
          {mockLeaderboard.slice(3).map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-bold text-white/40 w-6 text-center tabular-nums">
                {entry.rank}
              </span>
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{entry.name}</p>
              </div>
              {entry.streak > 0 && (
                <div className="flex items-center gap-1 text-orange-400">
                  <Flame className="h-3 w-3" />
                  <span className="text-xs font-bold">{entry.streak}</span>
                </div>
              )}
              <p className="text-sm font-bold text-white tabular-nums">
                {entry.score.toLocaleString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
