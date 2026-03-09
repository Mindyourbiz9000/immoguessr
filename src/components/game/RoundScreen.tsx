"use client";

import { useState, useEffect, useCallback } from "react";
import { PhotoGallery } from "./PhotoGallery";
import { PropertyFacts } from "./PropertyFacts";
import { GuessInput } from "./GuessInput";
import { RevealPanel } from "./RevealPanel";
import { GameSummary } from "./GameSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useGameStore } from "@/store/game";
import type { GuessResult, GameMode } from "@/types";

interface RoundScreenProps {
  mode: GameMode;
  totalRounds: number | null;
}

export function RoundScreen({ mode, totalRounds }: RoundScreenProps) {
  const {
    phase,
    currentRound,
    currentListing,
    totalScore,
    rounds,
    startGame,
    setListing,
    submitGuess,
    nextRound,
    reset,
  } = useGameStore();

  const [result, setResult] = useState<GuessResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchListing = useCallback(async () => {
    try {
      const res = await fetch(`/api/listings?mode=${mode}&round=${currentRound}`);
      const data = await res.json();
      if (data.listing) {
        setListing(data.listing);
      }
    } catch (err) {
      console.error("Failed to fetch listing:", err);
    }
  }, [mode, currentRound, setListing]);

  useEffect(() => {
    if (phase === "loading") {
      if (!useGameStore.getState().sessionId) {
        startGame(mode, totalRounds);
      }
      fetchListing();
    }
  }, [phase, mode, totalRounds, startGame, fetchListing]);

  const handleGuess = async (guess: number) => {
    setIsSubmitting(true);
    try {
      const r = await submitGuess(guess);
      setResult(r);
    } catch (err) {
      console.error("Submit error:", err);
    }
    setIsSubmitting(false);
  };

  const handleNext = () => {
    setResult(null);
    nextRound();
  };

  const handlePlayAgain = () => {
    setResult(null);
    reset();
    startGame(mode, totalRounds);
  };

  if (phase === "finished") {
    return <GameSummary rounds={rounds} totalScore={totalScore} mode={mode} onPlayAgain={handlePlayAgain} />;
  }

  return (
    <div className="min-h-screen">
      {/* Progress bar for daily */}
      {totalRounds && (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-2">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <Progress value={(currentRound / totalRounds) * 100} className="flex-1" />
            <span className="text-xs text-white/40 font-medium tabular-nums shrink-0">
              {currentRound}/{totalRounds}
            </span>
            <span className="text-xs text-yellow-400 font-bold tabular-nums shrink-0">
              {totalScore} pts
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-24 lg:pb-8">
        {phase === "loading" || !currentListing ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Photos */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-16">
                <PhotoGallery photos={currentListing.photoUrls} title={currentListing.title} />
              </div>
            </div>

            {/* Facts */}
            <div className="lg:col-span-3">
              <PropertyFacts listing={currentListing} />
            </div>

            {/* Guess / Reveal */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-16">
                {phase === "guessing" ? (
                  <GuessInput onSubmit={handleGuess} isSubmitting={isSubmitting} />
                ) : result ? (
                  <RevealPanel
                    result={result}
                    onNext={handleNext}
                    roundNumber={currentRound}
                    totalRounds={totalRounds}
                    totalScore={totalScore}
                    isLearnMode={mode === "learn"}
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky guess button */}
      {phase === "guessing" && currentListing && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pb-4 pt-8 px-4">
          {/* Handled inside GuessInput */}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5">
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      </div>
      <div className="lg:col-span-3 space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-4">
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}
