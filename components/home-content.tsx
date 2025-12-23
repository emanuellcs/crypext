"use client"

import { useState } from "react"
import { SearchBar } from "@/components/search-bar"
import { FavoritesToggle } from "@/components/favorites-toggle"
import { CryptoGrid } from "@/components/crypto-grid"
import { useFavorites } from "@/hooks/use-favorites"
import type { Cryptocurrency } from "@/types/crypto"

interface HomeContentProps {
  initialMarketData: Cryptocurrency[]
  coinList: { id: string; name: string; symbol: string }[]
}

export function HomeContent({ initialMarketData, coinList }: HomeContentProps) {
  const { favorites, toggleFavorite } = useFavorites()
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const displayedCryptos = showFavoritesOnly
    ? initialMarketData.filter((c) => favorites.includes(c.id))
    : initialMarketData

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent py-2">
          CrypExt
        </h1>
        <p className="text-lg text-zinc-400 font-medium">Search and inspect cryptocurrencies instantly</p>
      </div>

      <div className="flex flex-col items-center gap-4 mb-12">
        <SearchBar favorites={favorites} showFavoritesOnly={showFavoritesOnly} coins={coinList} />
        
        <FavoritesToggle
          showFavoritesOnly={showFavoritesOnly}
          onToggle={setShowFavoritesOnly}
          favoritesCount={favorites.length}
        />
      </div>

      {showFavoritesOnly && displayedCryptos.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg">No favorites yet.</p>
          <p className="text-sm mt-2">Star some coins to see them here.</p>
        </div>
      ) : (
        <div key={showFavoritesOnly ? "favs" : "all"}>
           <CryptoGrid 
              cryptos={displayedCryptos} 
              favorites={favorites} 
              onToggleFavorite={toggleFavorite} 
           />
        </div>
      )}
    </div>
  )
}