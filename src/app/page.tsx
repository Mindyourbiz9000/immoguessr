"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Infinity,
  Swords,
  BookOpen,
  TrendingUp,
  Users,
  Target,
  ChevronRight,
} from "lucide-react";

const stats = [
  { label: "Listings analyzed", value: "2,847", icon: TrendingUp },
  { label: "Avg. player error", value: "12.3%", icon: Target },
  { label: "Players today", value: "341", icon: Users },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,166,35,0.1),transparent_70%)]" />

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 text-yellow-400 border-yellow-400/30">
              Belgium Edition
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-6">
              Can you guess
              <br />
              <span className="text-gradient">the price?</span>
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10">
              See a real Belgian property listing. Guess the asking price.
              <br className="hidden sm:block" />
              Compete with friends. Learn the market.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild variant="gold" size="xl">
              <Link href="/daily">
                <Gamepad2 className="h-5 w-5 mr-2" />
                Play Daily Challenge
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link href="/game">
                <Infinity className="h-5 w-5 mr-2" />
                Unlimited Mode
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game modes */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-white mb-8 text-center">Choose your mode</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModeCard
            href="/daily"
            icon={Gamepad2}
            title="Daily Challenge"
            description="5 listings, same for everyone. Compare your score."
            color="from-yellow-500/20"
          />
          <ModeCard
            href="/game"
            icon={Infinity}
            title="Unlimited"
            description="Endless rounds. Practice your pricing instincts."
            color="from-blue-500/20"
          />
          <ModeCard
            href="/versus"
            icon={Swords}
            title="Versus"
            description="Head-to-head. Closest guess wins each round."
            color="from-purple-500/20"
          />
          <ModeCard
            href="/learn"
            icon={BookOpen}
            title="Learn Mode"
            description="Detailed explanations after every guess."
            color="from-emerald-500/20"
          />
        </div>
      </section>

      {/* Sample teaser */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
                alt="Sample property"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 hidden md:block" />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <Badge variant="house" className="w-fit mb-3">House</Badge>
              <h3 className="text-xl font-bold text-white mb-2">
                Charming terraced house in Ixelles
              </h3>
              <p className="text-white/50 text-sm mb-1">Ixelles, 1050 · Brussels-Capital</p>
              <div className="flex gap-4 text-sm text-white/40 mb-6">
                <span>3 bed</span>
                <span>185 m²</span>
                <span>EPC D</span>
              </div>
              <p className="text-2xl font-black text-white mb-6">€ ???,???</p>
              <Button asChild variant="gold" size="lg" className="w-fit">
                <Link href="/game">
                  Can you guess?
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-white/30">
          <p>ImmoGuessr Belgium — A property price guessing game</p>
          <p className="mt-1">Data sourced from authorized, licensed feeds only.</p>
        </div>
      </footer>
    </div>
  );
}

function ModeCard({
  href,
  icon: Icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card className={`group cursor-pointer hover:border-white/20 transition-all duration-300 bg-gradient-to-b ${color} to-transparent h-full`}>
        <CardContent className="p-6">
          <Icon className="h-8 w-8 text-white/60 mb-4 group-hover:text-white transition-colors" />
          <h3 className="font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/40">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
