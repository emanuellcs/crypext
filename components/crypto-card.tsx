"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice, formatPercentage } from "@/lib/utils"
import type { Cryptocurrency } from "@/types/crypto"

interface CryptoCardProps {
  crypto: Cryptocurrency
  isFavorite: boolean
  onToggleFavorite: (cryptoId: string) => void
}

export function CryptoCard({ crypto, isFavorite, onToggleFavorite }: CryptoCardProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      <Card className="crypto-card cursor-pointer overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src={crypto.image || "/placeholder.svg"}
                alt={crypto.name}
                width={40}
                height={40}
                className="rounded-full"
                priority={crypto.market_cap_rank <= 10}
              />
              <div>
                <h3 className="font-bold text-lg text-white">{crypto.name}</h3>
                <p className="text-sm text-zinc-400 uppercase font-medium">{crypto.symbol}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite(crypto.id)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-800/50"
            >
              <Star className={`w-4 h-4 ${isFavorite ? "fill-current text-yellow-400" : "text-zinc-400"}`} />
            </Button>
          </div>

          <div className="space-y-3 mb-4">
            <p className="text-2xl font-bold text-white">{formatPrice(crypto.current_price)}</p>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                {formatPercentage(crypto.price_change_percentage_24h)}
              </span>
            </div>
          </div>

          <div className="text-sm text-zinc-400 space-y-1">
            <p>
              Market Cap: <span className="font-medium">${crypto.market_cap.toLocaleString()}</span>
            </p>
            <p>
              Rank: <span className="font-medium">#{crypto.market_cap_rank}</span>
            </p>
          </div>

          <Link href={`/coin/${crypto.id}`} className="absolute inset-0" />
        </CardContent>
      </Card>
    </motion.div>
  )
}
