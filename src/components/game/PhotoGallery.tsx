"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoGalleryProps {
  photos: string[];
  title: string;
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % photos.length);
  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);

  if (photos.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full rounded-2xl bg-white/5 flex items-center justify-center">
        <p className="text-white/40 text-sm">No photos available</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src={photos[current]}
          alt={`${title} - Photo ${current + 1}`}
          fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={current === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white/80">
        {current + 1} / {photos.length}
      </div>
    </div>
  );
}
