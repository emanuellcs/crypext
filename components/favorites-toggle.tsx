"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FavoritesToggleProps {
  showFavoritesOnly: boolean
  onToggle: (show: boolean) => void
  favoritesCount: number
}

export function FavoritesToggle({ showFavoritesOnly, onToggle, favoritesCount }: FavoritesToggleProps) {
  return (
    <div className="w-full flex justify-center">
      <Button
        variant={showFavoritesOnly ? "default" : "outline"}
        onClick={() => onToggle(!showFavoritesOnly)}
        className={
          showFavoritesOnly
            ? "text-zinc-900 hover:bg-zinc-200 border-zinc-700 transition-colors"
            : "text-zinc-200 hover:text-white hover:bg-zinc-800 border-zinc-700 transition-colors"
        }
      >
        <Star className={`w-4 h-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
        Favorites ({favoritesCount})
      </Button>
    </div>
  )
}