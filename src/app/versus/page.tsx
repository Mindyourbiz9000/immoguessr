"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords, Copy, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function VersusPage() {
  const [roomCode] = useState(() =>
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-4">
        <Swords className="h-16 w-16 text-purple-400 mx-auto" />
        <h1 className="text-3xl font-black text-white">Versus Mode</h1>
        <p className="text-white/50">
          Challenge a friend. Same listings, closest guess wins.
        </p>
      </div>

      <Card className="border-purple-500/20 bg-gradient-to-b from-purple-500/5 to-transparent">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Your room code</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-4xl font-black text-white tracking-[0.3em]">{roomCode}</p>
              <button
                onClick={copyCode}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Copy className="h-4 w-4 text-white/40" />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-emerald-400 mt-1">Copied!</p>
            )}
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-center justify-center gap-2 text-white/40">
            <Users className="h-4 w-4" />
            <span className="text-sm">Waiting for opponent...</span>
          </div>

          <Badge variant="outline" className="mx-auto block w-fit">
            5 rounds · Same listings
          </Badge>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button variant="gold" size="xl" className="w-full" disabled>
          <span className="flex items-center gap-2">
            Start match
            <ArrowRight className="h-5 w-5" />
          </span>
        </Button>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-white/40 text-center">
              Share the room code with a friend. When both players join, the match begins.
              Each player guesses the same 5 listings. Winner is the player with the highest total score.
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-white/20 text-center">
        Real-time multiplayer coming soon. Currently in preview mode.
      </p>
    </div>
  );
}
