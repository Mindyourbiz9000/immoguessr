"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatEuro, getScoreColor } from "@/lib/scoring";
import type { RoundResult } from "@/types";
import { Trophy, Home, RotateCcw, Share2 } from "lucide-react";
import Link from "next/link";

interface GameSummaryProps {
  rounds: RoundResult[];
  totalScore: number;
  mode: string;
  onPlayAgain: () => void;
}

export function GameSummary({ rounds, totalScore, mode, onPlayAgain }: GameSummaryProps) {
  const maxPossible = rounds.length * 1000;
  const pct = Math.round((totalScore / maxPossible) * 100);

  return (
    <div className="max-w-lg mx-auto space-y-6 py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="text-center space-y-4"
      >
        <Trophy className="h-16 w-16 text-yellow-400 mx-auto" />
        <h1 className="text-3xl font-black text-white">Game Over!</h1>
        <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
          {totalScore.toLocaleString()}
        </p>
        <p className="text-white/40">
          out of {maxPossible.toLocaleString()} ({pct}%)
        </p>
      </motion.div>

      <Card>
        <CardContent className="p-4 space-y-2">
          {rounds.map((r, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {r.listing.title}
                </p>
                <p className="text-xs text-white/40">
                  {formatEuro(r.guess)} → {formatEuro(r.result.actualPrice)}
                </p>
              </div>
              <p className={`text-lg font-black tabular-nums ${getScoreColor(r.result.score)} ml-3`}>
                {r.result.score}
              </p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={onPlayAgain} variant="gold" size="lg" className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Play again
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
        </Button>
      </div>

      <Button variant="ghost" size="lg" className="w-full text-white/40">
        <Share2 className="h-4 w-4 mr-2" />
        Share result card
      </Button>
    </div>
  );
}
