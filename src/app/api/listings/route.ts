import { NextRequest, NextResponse } from "next/server";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import type { PlayableListing } from "@/types";

// Track which listings have been served per pseudo-session to avoid repeats
const servedListings = new Map<string, Set<string>>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "unlimited";
  const round = parseInt(searchParams.get("round") || "1", 10);

  const activeListings = MOCK_LISTINGS.filter((l) => l.isActive && l.isApproved);

  let listing;

  if (mode === "daily") {
    // Deterministic daily selection based on date
    const today = new Date().toISOString().slice(0, 10);
    const seed = hashString(today);
    const shuffled = [...activeListings].sort(
      (a, b) => hashString(a.id + today) - hashString(b.id + today)
    );
    listing = shuffled[(round - 1) % shuffled.length];
  } else {
    // Random selection, avoid recent repeats
    const sessionKey = req.headers.get("x-session-id") || "default";
    if (!servedListings.has(sessionKey)) {
      servedListings.set(sessionKey, new Set());
    }
    const served = servedListings.get(sessionKey)!;

    const available = activeListings.filter((l) => !served.has(l.id));
    if (available.length === 0) {
      served.clear();
      listing = activeListings[Math.floor(Math.random() * activeListings.length)];
    } else {
      listing = available[Math.floor(Math.random() * available.length)];
    }
    served.add(listing.id);
  }

  // Strip the price from the response
  const playable: PlayableListing = {
    id: listing.id,
    title: listing.title,
    propertyType: listing.propertyType,
    municipality: listing.municipality,
    postalCode: listing.postalCode,
    province: listing.province,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    livingAreaM2: listing.livingAreaM2,
    landAreaM2: listing.landAreaM2,
    epcScore: listing.epcScore,
    energyLabel: listing.energyLabel,
    condition: listing.condition,
    constructionYear: listing.constructionYear,
    floor: listing.floor,
    hasTerrace: listing.hasTerrace,
    hasGarden: listing.hasGarden,
    hasParking: listing.hasParking,
    hasElevator: listing.hasElevator,
    photoUrls: listing.photoUrls,
  };

  return NextResponse.json({ listing: playable });
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
