import { NextRequest, NextResponse } from "next/server";
import { MOCK_LISTINGS } from "@/lib/mock-data";

// Admin API for listing management
export async function GET() {
  return NextResponse.json({
    listings: MOCK_LISTINGS,
    stats: {
      total: MOCK_LISTINGS.length,
      active: MOCK_LISTINGS.filter((l) => l.isActive).length,
      approved: MOCK_LISTINGS.filter((l) => l.isApproved).length,
      houses: MOCK_LISTINGS.filter((l) => l.propertyType === "house").length,
      apartments: MOCK_LISTINGS.filter((l) => l.propertyType === "apartment").length,
      avgPrice: Math.round(
        MOCK_LISTINGS.reduce((s, l) => s + l.askingPrice, 0) / MOCK_LISTINGS.length
      ),
    },
  });
}

// Import listings (CSV/JSON)
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await req.json();
    const { listings, format } = body;

    if (!listings || !Array.isArray(listings)) {
      return NextResponse.json(
        { error: "Expected { listings: [...], format: 'json' | 'csv' }" },
        { status: 400 }
      );
    }

    // Validate and normalize
    const normalized = listings.map((l: Record<string, unknown>, i: number) => ({
      id: (l.id as string) || `import_${Date.now()}_${i}`,
      source: (l.source as string) || "import",
      title: l.title || "Untitled",
      propertyType: l.propertyType || l.property_type || "unknown",
      askingPrice: Number(l.askingPrice || l.asking_price || 0),
      municipality: l.municipality || "Unknown",
      postalCode: l.postalCode || l.postal_code || "0000",
      province: l.province || "Unknown",
    }));

    return NextResponse.json({
      success: true,
      imported: normalized.length,
      message: `${normalized.length} listings imported successfully. Review in admin panel.`,
    });
  }

  return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
}
