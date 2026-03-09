"use client";

import {
  Bed,
  Bath,
  Maximize,
  Trees,
  Zap,
  Building2,
  Calendar,
  Layers,
  Car,
  Flower2,
  Fence,
  ArrowUpFromDot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PlayableListing } from "@/types";

interface PropertyFactsProps {
  listing: PlayableListing;
}

export function PropertyFacts({ listing }: PropertyFactsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={listing.propertyType === "house" ? "house" : "apartment"}>
          {listing.propertyType === "house" ? "House" : "Apartment"}
        </Badge>
        {listing.condition && (
          <Badge variant="outline">{listing.condition}</Badge>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">{listing.title}</h2>
        <p className="text-white/60 text-sm mt-1">
          {listing.municipality}, {listing.postalCode} &middot; {listing.province}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {listing.bedrooms != null && (
          <Fact icon={Bed} label="Bedrooms" value={listing.bedrooms.toString()} />
        )}
        {listing.bathrooms != null && (
          <Fact icon={Bath} label="Bathrooms" value={listing.bathrooms.toString()} />
        )}
        {listing.livingAreaM2 != null && (
          <Fact icon={Maximize} label="Living area" value={`${listing.livingAreaM2} m²`} />
        )}
        {listing.landAreaM2 != null && (
          <Fact icon={Trees} label="Land area" value={`${listing.landAreaM2} m²`} />
        )}
        {listing.energyLabel && (
          <Fact icon={Zap} label="Energy" value={listing.energyLabel} />
        )}
        {listing.constructionYear != null && (
          <Fact icon={Calendar} label="Built" value={listing.constructionYear.toString()} />
        )}
        {listing.floor != null && (
          <Fact icon={Layers} label="Floor" value={listing.floor.toString()} />
        )}
        {listing.epcScore != null && (
          <Fact icon={Building2} label="EPC score" value={`${listing.epcScore} kWh/m²`} />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {listing.hasTerrace && <FeatureBadge icon={Fence} label="Terrace" />}
        {listing.hasGarden && <FeatureBadge icon={Flower2} label="Garden" />}
        {listing.hasParking && <FeatureBadge icon={Car} label="Parking" />}
        {listing.hasElevator && <FeatureBadge icon={ArrowUpFromDot} label="Elevator" />}
      </div>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5">
      <Icon className="h-4 w-4 text-white/40 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-white/40 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-white truncate">{value}</p>
      </div>
    </div>
  );
}

function FeatureBadge({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Badge variant="feature" className="gap-1.5 py-1 px-3">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
