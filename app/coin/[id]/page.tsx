"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, Star, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriceChart } from "@/components/price-chart"
import { useFavorites } from "@/hooks/use-favorites"
import { fetchCoinDetail } from "@/lib/api"
import { formatPrice, formatPercentage } from "@/lib/utils"
import type { CoinDetail } from "@/types/crypto"

export default function CoinPage() {
  const params = useParams()
  const router = useRouter()
  const [coin, setCoin] = useState<CoinDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const { favorites, toggleFavorite } = useFavorites()

  useEffect(() => {
    const loadCoinDetail = async () => {
      if (!params.id || typeof params.id !== "string") return

      const cacheKey = `coinDetail:${params.id}`
      const cacheTsKey = `coinDetailTs:${params.id}`
      const FIVE_MIN = 5 * 60 * 1000

      try {
        setLoading(true)

        const raw = localStorage.getItem(cacheKey)
        const ts = localStorage.getItem(cacheTsKey)

        if (raw && ts) {
          const age = Date.now() - Number(ts)
          if (!isNaN(age) && age < FIVE_MIN) {
            try {
              const parsed = JSON.parse(raw)
              setCoin(parsed)
              setLoading(false)
              return
            } catch (parseErr) {
              console.warn("Failed to parse cached coin detail, refetching", parseErr)
            }
          }
        }

        const data = await fetchCoinDetail(params.id)
        setCoin(data)
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data))
          localStorage.setItem(cacheTsKey, String(Date.now()))
        } catch (err) {
          // ignore storage failures
        }
      } catch (error) {
        console.error("Error fetching coin detail:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCoinDetail()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-zinc-800 rounded w-32"></div>
          <div className="h-16 bg-zinc-800 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-zinc-800 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="crypto-card max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Coin not found</h2>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isFavorite = favorites.includes(coin.id)
  const priceChange24h = coin.market_data.price_change_percentage_24h
  const isPositive = priceChange24h >= 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto px-4 py-8"
    >
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-zinc-800/50">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Market
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <Card className="crypto-card mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={coin.image.large || "/placeholder.svg"}
                  alt={coin.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <CardTitle className="text-3xl md:text-4xl font-bold">{coin.name}</CardTitle>
                  <p className="text-xl text-zinc-400 uppercase font-medium">{coin.symbol}</p>
                </div>
              </div>
              <Button
                variant={isFavorite ? "default" : "outline"}
                onClick={() => toggleFavorite(coin.id)}
                className={isFavorite 
                  ? "text-zinc-900 hover:bg-zinc-200 border-zinc-700 transition-colors"
                  : "text-zinc-200 hover:text-white hover:bg-zinc-800 border-zinc-700 transition-colors"
                }
              >
                <Star className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="crypto-card">
                <CardContent className="p-6">
                  <p className="text-sm text-zinc-400 mb-2 font-medium">Current Price</p>
                  <p className="text-2xl font-bold">{formatPrice(coin.market_data.current_price.usd)}</p>
                </CardContent>
              </Card>
              <Card className="crypto-card">
                <CardContent className="p-6">
                  <p className="text-sm text-zinc-400 mb-2 font-medium">24h Change</p>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <p className={`text-xl font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                      {formatPercentage(priceChange24h)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="crypto-card">
                <CardContent className="p-6">
                  <p className="text-sm text-zinc-400 mb-2 font-medium">Market Cap</p>
                  <p className="text-xl font-bold">${coin.market_data.market_cap.usd.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="crypto-card">
                <CardContent className="p-6">
                  <p className="text-sm text-zinc-400 mb-2 font-medium">24h Volume</p>
                  <p className="text-xl font-bold">${coin.market_data.total_volume.usd.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="crypto-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Price Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart coinId={coin.id} />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
