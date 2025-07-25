"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FavoritesToggleProps {
  showFavoritesOnly: boolean
  onToggle: (show: boolean) => void
  favoritesCount: number
}

export function FavoritesToggle({ showFavoritesOnly, onToggle, favoritesCount }: FavoritesToggleProps) {
  return (
    <Button
      variant={showFavoritesOnly ? "default" : "outline"}
      onClick={() => onToggle(!showFavoritesOnly)}
      className="hover:bg-zinc-800/50"
    >
      <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? "fill-current text-red-400" : ""}`} />
      Favorites ({favoritesCount})
    </Button>
  )
}
