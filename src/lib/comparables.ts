import type { ComparableInfo, ComparableListing, Listing } from "@/types";

export function computeComparables(
  target: Listing,
  allListings: Listing[]
): ComparableInfo {
  const candidates = allListings.filter(
    (l) =>
      l.id !== target.id &&
      l.propertyType === target.propertyType &&
      l.isActive &&
      l.isApproved
  );

  const scored = candidates
    .map((l) => ({
      listing: l,
      score: similarityScore(target, l),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const prices = scored.map((s) => s.listing.askingPrice).sort((a, b) => a - b);
  const pricesPerM2 = scored
    .filter((s) => s.listing.livingAreaM2 && s.listing.livingAreaM2 > 0)
    .map((s) => Math.round(s.listing.askingPrice / s.listing.livingAreaM2!));

  const medianPrice = median(prices) || target.askingPrice;
  const medianPricePerM2 = median(pricesPerM2) || 0;

  const compListings: ComparableListing[] = scored.slice(0, 3).map((s) => ({
    id: s.listing.id,
    title: s.listing.title,
    price: s.listing.askingPrice,
    pricePerM2:
      s.listing.livingAreaM2 && s.listing.livingAreaM2 > 0
        ? Math.round(s.listing.askingPrice / s.listing.livingAreaM2)
        : null,
    municipality: s.listing.municipality,
    distanceKm: s.listing.latitude && target.latitude
      ? haversineDistance(
          target.latitude,
          target.longitude!,
          s.listing.latitude,
          s.listing.longitude!
        )
      : null,
    similarityScore: s.score,
  }));

  return {
    medianPrice,
    medianPricePerM2,
    priceRange: {
      min: prices[0] || target.askingPrice,
      max: prices[prices.length - 1] || target.askingPrice,
    },
    fairValueBand: {
      low: Math.round(medianPrice * 0.9),
      high: Math.round(medianPrice * 1.1),
    },
    listings: compListings,
  };
}

function similarityScore(a: Listing, b: Listing): number {
  let score = 0;

  if (a.municipality === b.municipality) score += 30;
  else if (a.province === b.province) score += 10;

  if (a.bedrooms && b.bedrooms) {
    const diff = Math.abs(a.bedrooms - b.bedrooms);
    score += Math.max(0, 20 - diff * 7);
  }

  if (a.livingAreaM2 && b.livingAreaM2) {
    const ratio = Math.min(a.livingAreaM2, b.livingAreaM2) / Math.max(a.livingAreaM2, b.livingAreaM2);
    score += ratio * 25;
  }

  const priceDiff = Math.abs(a.askingPrice - b.askingPrice) / Math.max(a.askingPrice, b.askingPrice);
  score += Math.max(0, 25 * (1 - priceDiff));

  return Math.round(score);
}

function median(arr: number[]): number | null {
  if (arr.length === 0) return null;
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 !== 0 ? arr[mid] : Math.round((arr[mid - 1] + arr[mid]) / 2);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export function generateExplanation(
  target: Listing,
  comps: ComparableInfo
): string {
  const pricePerM2 =
    target.livingAreaM2 && target.livingAreaM2 > 0
      ? Math.round(target.askingPrice / target.livingAreaM2)
      : null;

  const parts: string[] = [];
  const type = target.propertyType === "house" ? "house" : "apartment";

  if (pricePerM2 && comps.medianPricePerM2 > 0) {
    const diff = ((pricePerM2 - comps.medianPricePerM2) / comps.medianPricePerM2) * 100;
    if (Math.abs(diff) < 5) {
      parts.push(`This ${type} is priced in line with the local median of €${comps.medianPricePerM2}/m².`);
    } else if (diff > 0) {
      parts.push(
        `This ${type} is priced ${Math.round(diff)}% above the local median of €${comps.medianPricePerM2}/m².`
      );
    } else {
      parts.push(
        `This ${type} is priced ${Math.round(Math.abs(diff))}% below the local median of €${comps.medianPricePerM2}/m².`
      );
    }
  }

  const drivers: string[] = [];
  if (target.condition === "renovated" || target.condition === "as new") drivers.push("renovated condition");
  if (target.hasTerrace) drivers.push("terrace");
  if (target.hasGarden) drivers.push("garden");
  if (target.hasParking) drivers.push("parking");
  if (target.hasElevator) drivers.push("elevator access");
  if (target.energyLabel && ["A", "A+", "A++", "B"].includes(target.energyLabel))
    drivers.push("strong energy performance");
  if (target.energyLabel && ["E", "F", "G"].includes(target.energyLabel))
    drivers.push("poor energy rating (renovation needed)");

  if (drivers.length > 0) {
    parts.push(`Key price drivers include: ${drivers.join(", ")}.`);
  }

  if (parts.length === 0) {
    parts.push(
      `This ${type} in ${target.municipality} is listed at €${target.askingPrice.toLocaleString("fr-BE")}. Check comparable listings for local context.`
    );
  }

  return parts.join(" ");
}
