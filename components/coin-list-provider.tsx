"use client"

import { useEffect } from "react"
import { fetchCoinList } from "@/lib/api"

const STORAGE_KEY = "coinList:v1"
const TIMESTAMP_KEY = "coinListTimestamp:v1"
const ONE_DAY = 24 * 60 * 60 * 1000

export function CoinListProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const ts = localStorage.getItem(TIMESTAMP_KEY)

        if (raw && ts) {
          const age = Date.now() - Number(ts)
          if (!isNaN(age) && age < ONE_DAY) return // cached and fresh
        }

        const list = await fetchCoinList()
        // store only id, name, symbol to keep size small
        const compact = list.map((c: any) => ({ id: c.id, name: c.name, symbol: c.symbol }))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compact))
        localStorage.setItem(TIMESTAMP_KEY, String(Date.now()))
      } catch (err) {
        console.error("Failed to load coin list:", err)
      }
    }

    load()
  }, [])

  return <>{children}</>
}

export function getCachedCoinList() {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return null
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    console.error("Failed to parse cached coin list", err)
    return null
  }
}
