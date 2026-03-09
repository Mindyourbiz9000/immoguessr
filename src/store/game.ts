import { create } from "zustand";
import type { GameMode, GameState, GuessResult, PlayableListing, RoundResult } from "@/types";

interface GameStore extends GameState {
  startGame: (mode: GameMode, totalRounds: number | null) => void;
  setListing: (listing: PlayableListing) => void;
  submitGuess: (guess: number) => Promise<GuessResult>;
  nextRound: () => void;
  finishGame: () => void;
  reset: () => void;
}

const initialState: GameState = {
  sessionId: null,
  mode: "unlimited",
  currentRound: 1,
  totalRounds: null,
  totalScore: 0,
  rounds: [],
  currentListing: null,
  phase: "loading",
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: (mode, totalRounds) => {
    set({
      ...initialState,
      mode,
      totalRounds,
      sessionId: `session_${Date.now()}`,
      phase: "loading",
    });
  },

  setListing: (listing) => {
    set({ currentListing: listing, phase: "guessing" });
  },

  submitGuess: async (guess) => {
    const { currentListing, currentRound } = get();
    if (!currentListing) throw new Error("No listing");

    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: currentListing.id,
        guess,
      }),
    });

    const result: GuessResult = await res.json();

    const roundResult: RoundResult = {
      roundNumber: currentRound,
      listing: currentListing,
      guess,
      result,
    };

    set((s) => ({
      rounds: [...s.rounds, roundResult],
      totalScore: s.totalScore + result.score,
      phase: "revealed",
    }));

    return result;
  },

  nextRound: () => {
    const { currentRound, totalRounds } = get();
    if (totalRounds && currentRound >= totalRounds) {
      set({ phase: "finished" });
    } else {
      set((s) => ({
        currentRound: s.currentRound + 1,
        currentListing: null,
        phase: "loading",
      }));
    }
  },

  finishGame: () => set({ phase: "finished" }),

  reset: () => set(initialState),
}));
