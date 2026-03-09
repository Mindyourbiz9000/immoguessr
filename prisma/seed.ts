import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const listings = [
  {
    id: "lst_001",
    source: "mock",
    title: "Charming terraced house with garden in Ixelles",
    propertyType: "house",
    transactionType: "sale",
    askingPrice: 695000,
    municipality: "Ixelles",
    postalCode: "1050",
    province: "Brussels-Capital",
    latitude: 50.8279,
    longitude: 4.3695,
    bedrooms: 3,
    bathrooms: 2,
    livingAreaM2: 185,
    landAreaM2: 95,
    epcScore: 280,
    energyLabel: "D",
    condition: "good",
    constructionYear: 1920,
    hasGarden: true,
    photoUrls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
  },
  {
    id: "lst_002",
    source: "mock",
    title: "Modern apartment with terrace in Antwerp Zuid",
    propertyType: "apartment",
    transactionType: "sale",
    askingPrice: 349000,
    municipality: "Antwerpen",
    postalCode: "2000",
    province: "Antwerp",
    latitude: 51.2056,
    longitude: 4.3944,
    bedrooms: 2,
    bathrooms: 1,
    livingAreaM2: 95,
    epcScore: 150,
    energyLabel: "B",
    condition: "as new",
    constructionYear: 2019,
    floor: 4,
    hasTerrace: true,
    hasParking: true,
    hasElevator: true,
    photoUrls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
  },
];

async function main() {
  console.log("Seeding database...");

  for (const listing of listings) {
    await prisma.listing.upsert({
      where: { id: listing.id },
      update: listing,
      create: listing,
    });
  }

  console.log(`Seeded ${listings.length} listings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
