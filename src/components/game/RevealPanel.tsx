"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatEuro } from "@/lib/scoring";
import { getScoreColor, getScoreBgColor } from "@/lib/scoring";
import type { GuessResult } from "@/types";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Share2,
} from "lucide-react";

interface RevealPanelProps {
  result: GuessResult;
  onNext: () => void;
  roundNumber: number;
  totalRounds: number | null;
  totalScore: number;
  isLearnMode?: boolean;
}

export function RevealPanel({
  result,
  onNext,
  roundNumber,
  totalRounds,
  totalScore,
  isLearnMode,
}: RevealPanelProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = result.score / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setAnimatedScore(Math.min(Math.round(increment * step), result.score));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [result.score]);

  useEffect(() => {
    const t = setTimeout(() => setShowDetails(true), 600);
    return () => clearTimeout(t);
  }, []);

  const isOver = result.guessPrice > result.actualPrice;
  const diff = result.guessPrice - result.actualPrice;

  return (
    <div className="space-y-4">
      {/* Score reveal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <Card className={`bg-gradient-to-br ${getScoreBgColor(result.score)} border-white/10`}>
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-white/60 text-sm font-medium uppercase tracking-wider">
              Round {roundNumber} Score
            </p>
            <p className={`text-6xl font-black tabular-nums ${getScoreColor(result.score)}`}>
              {animatedScore}
            </p>
            <p className={`text-lg font-bold ${getScoreColor(result.score)}`}>
              {result.label}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Price comparison */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Your guess</p>
                    <p className="text-xl font-bold text-white">{formatEuro(result.guessPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Actual price</p>
                    <p className="text-xl font-bold text-emerald-400">{formatEuro(result.actualPrice)}</p>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isOver ? (
                      <TrendingUp className="h-4 w-4 text-red-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-blue-400" />
                    )}
                    <span className="text-sm text-white/60">
                      {isOver ? "Over" : "Under"} by{" "}
                      <span className="font-bold text-white">
                        {formatEuro(Math.abs(diff))}
                      </span>
                    </span>
                  </div>
                  <Badge variant="outline">
                    {result.percentageError > 0 ? "+" : ""}
                    {result.percentageError.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Comparables */}
            {result.comparables && (
              <Card>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-white">Local market context</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-white/40 text-xs">Median price</p>
                      <p className="font-bold text-white">{formatEuro(result.comparables.medianPrice)}</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-white/40 text-xs">Median €/m²</p>
                      <p className="font-bold text-white">
                        {result.comparables.medianPricePerM2 > 0
                          ? `€${result.comparables.medianPricePerM2.toLocaleString("fr-BE")}`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-white/40 text-xs">Price range</p>
                      <p className="font-bold text-white text-xs">
                        {formatEuro(result.comparables.priceRange.min)} – {formatEuro(result.comparables.priceRange.max)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-white/40 text-xs">Fair value band</p>
                      <p className="font-bold text-white text-xs">
                        {formatEuro(result.comparables.fairValueBand.low)} – {formatEuro(result.comparables.fairValueBand.high)}
                      </p>
                    </div>
                  </div>

                  {result.comparables.listings.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs text-white/40 uppercase tracking-wider">Comparable listings</p>
                      {result.comparables.listings.map((comp) => (
                        <div
                          key={comp.id}
                          className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">{comp.title}</p>
                            <p className="text-xs text-white/40">
                              {comp.municipality}
                              {comp.distanceKm != null && ` · ${comp.distanceKm} km`}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-white shrink-0 ml-3">
                            {formatEuro(comp.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Explanation */}
            {(isLearnMode || result.explanation) && (
              <Card className="border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-white/80 leading-relaxed">{result.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Running score */}
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-white/40">
                Total score:{" "}
                <span className="font-bold text-white">{totalScore.toLocaleString()}</span>
                {totalRounds && (
                  <span className="text-white/30">
                    {" "}· Round {roundNumber}/{totalRounds}
                  </span>
                )}
              </p>
              <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                <Share2 className="h-3 w-3" />
                Share
              </button>
            </div>

            {/* Next round CTA */}
            <Button onClick={onNext} variant="success" size="xl" className="w-full">
              <span className="flex items-center gap-2">
                {totalRounds && roundNumber >= totalRounds ? "See results" : "Next round"}
                <ArrowRight className="h-5 w-5" />
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
