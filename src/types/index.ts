export interface Listing {
  id: string;
  source: string;
  sourceUrl: string | null;
  title: string;
  propertyType: string;
  transactionType: string;
  askingPrice: number;
  municipality: string;
  postalCode: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  livingAreaM2: number | null;
  landAreaM2: number | null;
  epcScore: number | null;
  energyLabel: string | null;
  condition: string | null;
  constructionYear: number | null;
  floor: number | null;
  hasTerrace: boolean;
  hasGarden: boolean;
  hasParking: boolean;
  hasElevator: boolean;
  description: string | null;
  photoUrls: string[];
  isActive: boolean;
  isApproved: boolean;
  createdAt: string | Date;
  firstSeenAt: string | Date;
  lastSeenAt: string | Date;
}

export interface PlayableListing {
  id: string;
  title: string;
  propertyType: string;
  municipality: string;
  postalCode: string;
  province: string;
  bedrooms: number | null;
  bathrooms: number | null;
  livingAreaM2: number | null;
  landAreaM2: number | null;
  epcScore: number | null;
  energyLabel: string | null;
  condition: string | null;
  constructionYear: number | null;
  floor: number | null;
  hasTerrace: boolean;
  hasGarden: boolean;
  hasParking: boolean;
  hasElevator: boolean;
  photoUrls: string[];
}

export interface GuessResult {
  actualPrice: number;
  guessPrice: number;
  absoluteError: number;
  percentageError: number;
  score: number;
  label: ScoreLabel;
  comparables: ComparableInfo;
  explanation: string;
}

export type ScoreLabel = "Perfect!" | "Very close!" | "Good read" | "Not bad" | "Way off";

export interface ComparableInfo {
  medianPrice: number;
  medianPricePerM2: number;
  priceRange: { min: number; max: number };
  fairValueBand: { low: number; high: number };
  listings: ComparableListing[];
}

export interface ComparableListing {
  id: string;
  title: string;
  price: number;
  pricePerM2: number | null;
  municipality: string;
  distanceKm: number | null;
  similarityScore: number | null;
}

export type GameMode = "daily" | "unlimited" | "versus" | "learn";

export interface GameState {
  sessionId: string | null;
  mode: GameMode;
  currentRound: number;
  totalRounds: number | null;
  totalScore: number;
  rounds: RoundResult[];
  currentListing: PlayableListing | null;
  phase: "loading" | "guessing" | "revealed" | "finished";
}

export interface RoundResult {
  roundNumber: number;
  listing: PlayableListing;
  guess: number;
  result: GuessResult;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  date: string;
  streak: number;
  mode: string;
}
