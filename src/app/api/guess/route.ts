import { NextRequest, NextResponse } from "next/server";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { calculateScore, getScoreLabel } from "@/lib/scoring";
import { computeComparables, generateExplanation } from "@/lib/comparables";
import type { GuessResult, Listing } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { listingId, guess } = body as { listingId: string; guess: number };

  if (!listingId || !guess || guess <= 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const listing = MOCK_LISTINGS.find((l) => l.id === listingId);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const actualPrice = listing.askingPrice;
  const score = calculateScore(guess, actualPrice);
  const pctError = ((guess - actualPrice) / actualPrice) * 100;

  // Build full Listing object for comparables
  const now = new Date();
  const fullListing: Listing = {
    ...listing,
    createdAt: now,
    firstSeenAt: now,
    lastSeenAt: now,
  };

  const allListings: Listing[] = MOCK_LISTINGS.map((l) => ({
    ...l,
    createdAt: now,
    firstSeenAt: now,
    lastSeenAt: now,
  }));

  const comparables = computeComparables(fullListing, allListings);
  const explanation = generateExplanation(fullListing, comparables);

  const result: GuessResult = {
    actualPrice,
    guessPrice: guess,
    absoluteError: Math.abs(guess - actualPrice),
    percentageError: Math.round(pctError * 10) / 10,
    score,
    label: getScoreLabel(score),
    comparables,
    explanation,
  };

  return NextResponse.json(result);
}
