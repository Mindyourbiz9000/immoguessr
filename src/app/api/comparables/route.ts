import { NextRequest, NextResponse } from "next/server";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { computeComparables } from "@/lib/comparables";
import type { Listing } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");

  if (!listingId) {
    return NextResponse.json({ error: "listingId required" }, { status: 400 });
  }

  const listing = MOCK_LISTINGS.find((l) => l.id === listingId);
  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = new Date();
  const fullListing: Listing = { ...listing, createdAt: now, firstSeenAt: now, lastSeenAt: now };
  const allListings: Listing[] = MOCK_LISTINGS.map((l) => ({
    ...l,
    createdAt: now,
    firstSeenAt: now,
    lastSeenAt: now,
  }));

  const comps = computeComparables(fullListing, allListings);

  return NextResponse.json(comps);
}
