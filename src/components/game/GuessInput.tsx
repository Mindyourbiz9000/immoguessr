"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEuro } from "@/lib/scoring";
import { Euro, Send } from "lucide-react";

interface GuessInputProps {
  onSubmit: (guess: number) => void;
  isSubmitting: boolean;
}

const QUICK_CHIPS = [100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000];

export function GuessInput({ onSubmit, isSubmitting }: GuessInputProps) {
  const [value, setValue] = useState("");

  const numericValue = parseInt(value.replace(/\D/g, ""), 10) || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      setValue("");
      return;
    }
    const num = parseInt(raw, 10);
    if (num > 99999999) return;
    setValue(num.toLocaleString("fr-BE"));
  };

  const handleChip = useCallback((amount: number) => {
    setValue(amount.toLocaleString("fr-BE"));
  }, []);

  const handleSubmit = () => {
    if (numericValue > 0 && !isSubmitting) {
      onSubmit(numericValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Euro className="h-5 w-5 text-primary" />
          Your guess
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-white/40">
            €
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="250.000"
            className="w-full h-14 rounded-xl bg-white/10 border border-white/10 pl-10 pr-4 text-2xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            autoFocus
          />
        </div>

        {numericValue > 0 && (
          <p className="text-center text-sm text-white/50">
            {formatEuro(numericValue)}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 text-xs font-medium text-white/60 hover:text-white transition-colors"
            >
              {chip >= 1000000
                ? `${chip / 1000000}M`
                : `${chip / 1000}K`}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {[-50000, -10000, 10000, 50000].map((adj) => (
            <button
              key={adj}
              onClick={() => {
                const next = Math.max(0, numericValue + adj);
                setValue(next > 0 ? next.toLocaleString("fr-BE") : "");
              }}
              disabled={numericValue === 0}
              className="flex-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 py-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors disabled:opacity-30"
            >
              {adj > 0 ? "+" : ""}{adj / 1000}K
            </button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={numericValue === 0 || isSubmitting}
          variant="gold"
          size="xl"
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
              Revealing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Lock in guess
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
