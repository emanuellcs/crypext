"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CryptoGrid } from "@/components/crypto-grid"
import { SearchBar } from "@/components/search-bar"
import { FavoritesToggle } from "@/components/favorites-toggle"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { useFavorites } from "@/hooks/use-favorites"
import { fetchCryptoData } from "@/lib/api"
import type { Cryptocurrency } from "@/types/crypto"

export default function HomePage() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([])
  const [filteredCryptos, setFilteredCryptos] = useState<Cryptocurrency[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const { favorites, toggleFavorite } = useFavorites()

  useEffect(() => {
    const loadCryptoData = async () => {
      try {
        setLoading(true)
        const data = await fetchCryptoData()
        setCryptos(data)
        setFilteredCryptos(data)
      } catch (error) {
        console.error("Error fetching crypto data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCryptoData()
    const interval = setInterval(loadCryptoData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = cryptos

    if (searchTerm) {
      filtered = filtered.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter((crypto) => favorites.includes(crypto.id))
    }

    setFilteredCryptos(filtered)
  }, [cryptos, searchTerm, showFavoritesOnly, favorites])

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          CrypExt
        </h1>
        <p className="text-xl text-zinc-400 font-medium">Real-time cryptocurrency price tracker</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <FavoritesToggle
          showFavoritesOnly={showFavoritesOnly}
          onToggle={setShowFavoritesOnly}
          favoritesCount={favorites.length}
        />
      </motion.div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <CryptoGrid cryptos={filteredCryptos} favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
    </div>
  )
}
