"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { formatEuro } from "@/lib/scoring";
import {
  Shield,
  Upload,
  FileJson,
  FileSpreadsheet,
  RefreshCw,
  Check,
  X,
  Eye,
  EyeOff,
  Database,
  BarChart3,
} from "lucide-react";

const tabs = ["Listings", "Import", "Stats"] as const;
type Tab = (typeof tabs)[number];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Listings");
  const [listings, setListings] = useState(
    MOCK_LISTINGS.map((l) => ({
      id: l.id,
      title: l.title,
      propertyType: l.propertyType,
      askingPrice: l.askingPrice,
      municipality: l.municipality,
      postalCode: l.postalCode,
      province: l.province,
      photoUrls: l.photoUrls,
      isApproved: l.isApproved,
      isActive: l.isActive,
    }))
  );

  const toggleApproval = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isApproved: !l.isApproved } : l))
    );
  };

  const toggleActive = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
          <p className="text-sm text-white/50">Manage listings and data imports</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              activeTab === tab
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Listings" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/40">{listings.length} listings total</p>
            <div className="flex gap-2 text-xs text-white/40">
              <span>{listings.filter((l) => l.isActive).length} active</span>
              <span>{listings.filter((l) => l.isApproved).length} approved</span>
            </div>
          </div>

          {listings.map((listing) => (
            <Card key={listing.id} className={cn(!listing.isApproved && "opacity-60")}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-24 rounded-lg bg-white/5 overflow-hidden shrink-0">
                    {listing.photoUrls[0] && (
                      <img
                        src={listing.photoUrls[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white truncate">
                        {listing.title}
                      </h3>
                      <Badge
                        variant={
                          listing.propertyType === "house" ? "house" : "apartment"
                        }
                      >
                        {listing.propertyType}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/40">
                      {listing.municipality}, {listing.postalCode} · {listing.province}
                    </p>
                    <p className="text-sm font-bold text-white mt-1">
                      {formatEuro(listing.askingPrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(listing.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        listing.isActive
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-white/5 text-white/30 hover:bg-white/10"
                      )}
                      title={listing.isActive ? "Active" : "Inactive"}
                    >
                      {listing.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleApproval(listing.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        listing.isApproved
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      )}
                      title={listing.isApproved ? "Approved" : "Rejected"}
                    >
                      {listing.isApproved ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "Import" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImportCard
            icon={FileSpreadsheet}
            title="CSV Import"
            description="Upload a CSV file with listing data. Columns will be mapped to the listing schema."
            action="Upload CSV"
          />
          <ImportCard
            icon={FileJson}
            title="JSON Feed Import"
            description="Import listings from a JSON file or paste a JSON array of listing objects."
            action="Upload JSON"
          />
          <ImportCard
            icon={RefreshCw}
            title="Scheduled Sync"
            description="Configure a recurring sync job from an authorized external data source."
            action="Configure"
          />
          <ImportCard
            icon={Upload}
            title="Manual Upload"
            description="Add a single listing manually with a form. Useful for testing."
            action="Add listing"
          />
        </div>
      )}

      {activeTab === "Stats" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={Database}
            label="Total listings"
            value={listings.length.toString()}
          />
          <StatCard
            icon={BarChart3}
            label="Avg. asking price"
            value={formatEuro(
              Math.round(
                listings.reduce((s, l) => s + l.askingPrice, 0) / listings.length
              )
            )}
          />
          <StatCard
            icon={BarChart3}
            label="Price range"
            value={`${formatEuro(
              Math.min(...listings.map((l) => l.askingPrice))
            )} – ${formatEuro(Math.max(...listings.map((l) => l.askingPrice)))}`}
          />
        </div>
      )}
    </div>
  );
}

function ImportCard({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <Card className="hover:border-white/20 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-white/50">{description}</p>
        <Button variant="outline" size="sm">
          {action}
        </Button>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-6 text-center space-y-2">
        <Icon className="h-6 w-6 text-primary mx-auto" />
        <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </CardContent>
    </Card>
  );
}
