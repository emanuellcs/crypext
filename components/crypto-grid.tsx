"use client"

import { motion } from "framer-motion"
import { CryptoCard } from "./crypto-card"
import type { Cryptocurrency } from "@/types/crypto"

interface CryptoGridProps {
  cryptos: Cryptocurrency[]
  favorites: string[]
  onToggleFavorite: (cryptoId: string) => void
}

export function CryptoGrid({ cryptos, favorites, onToggleFavorite }: CryptoGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {cryptos.map((crypto) => (
        <motion.div key={crypto.id} variants={itemVariants}>
          <CryptoCard crypto={crypto} isFavorite={favorites.includes(crypto.id)} onToggleFavorite={onToggleFavorite} />
        </motion.div>
      ))}
    </motion.div>
  )
}
