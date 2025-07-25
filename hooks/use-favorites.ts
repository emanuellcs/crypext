"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("crypto-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const toggleFavorite = (cryptoId: string) => {
    const newFavorites = favorites.includes(cryptoId)
      ? favorites.filter((id) => id !== cryptoId)
      : [...favorites, cryptoId]

    setFavorites(newFavorites)
    localStorage.setItem("crypto-favorites", JSON.stringify(newFavorites))
  }

  return { favorites, toggleFavorite }
}
