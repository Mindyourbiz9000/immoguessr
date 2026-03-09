# ImmoGuessr Belgium

A property price guessing game for the Belgian real estate market. See a real listing, guess the asking price, and compete with others.

## Game Modes

- **Daily Challenge** — 5 listings per day, same for all players
- **Unlimited Mode** — Infinite random rounds
- **Versus Mode** — Head-to-head with a friend (coming soon)
- **Learn Mode** — Detailed market explanations after each guess

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL + Prisma ORM
- **State**: Zustand
- **Charts**: Recharts
- **Maps**: Leaflet (planned)
- **Animations**: Framer Motion

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client (requires database)
npm run db:generate

# Push schema to database
npm run db:push

# Seed with mock data
npm run db:seed

# Run development server
npm run dev
```

The app runs with in-memory mock data by default — no database required for local dev.

Open [http://localhost:3000](http://localhost:3000) to play.

## Scoring

Score is percentage-based so it's fair across all price ranges:

```
score = max(0, round(1000 × exp(-4 × |ln(guess / actual)|)))
```

| Score     | Label       |
|-----------|-------------|
| 950–1000  | Perfect!    |
| 800–949   | Very close! |
| 600–799   | Good read   |
| 350–599   | Not bad     |
| 0–349     | Way off     |

## Data

Listings are served from mock data (15 realistic Belgian properties). In production, connect the ingestion pipeline to import from authorized data sources via CSV, JSON, or scheduled sync.

**No scraping.** All data must come from compliant, licensed sources.

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes (listings, guess, daily, leaderboard, admin)
│   ├── admin/        # Admin dashboard
│   ├── daily/        # Daily challenge
│   ├── game/         # Unlimited mode
│   ├── leaderboard/  # Leaderboard
│   ├── learn/        # Learn mode
│   └── versus/       # Versus lobby
├── components/
│   ├── game/         # Game components (PhotoGallery, PropertyFacts, GuessInput, etc.)
│   ├── layout/       # Navbar
│   └── ui/           # Reusable UI (Button, Card, Badge, etc.)
├── lib/              # Scoring, comparables, DB, mock data, utilities
├── store/            # Zustand game state
└── types/            # TypeScript types
prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Seed script
```
