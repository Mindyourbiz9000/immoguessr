"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Trophy, BookOpen, Shield, Gamepad2 } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/daily", label: "Daily", icon: Gamepad2 },
  { href: "/game", label: "Play", icon: Gamepad2 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/admin", label: "Admin", icon: Shield },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
            <span className="text-sm font-black text-black">IG</span>
          </div>
          <span className="font-black text-white text-lg hidden sm:block">
            Immo<span className="text-yellow-400">Guessr</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
