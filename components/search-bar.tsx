"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  coins: { id: string; name: string; symbol: string }[]
  favorites?: string[]
  showFavoritesOnly?: boolean
}

export function SearchBar({ coins, favorites = [], showFavoritesOnly = false }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<typeof coins>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!query) {
      setSuggestions([])
      setOpen(false)
      setActiveIndex(-1)
      return
    }

    const q = query.toLowerCase().trim()

    let filtered = coins.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    )

    if (showFavoritesOnly && favorites.length > 0) {
      const favSet = new Set(favorites)
      filtered = filtered.filter((c) => favSet.has(c.id))
    }

    filtered.sort((a, b) => {
      const aId = a.id.toLowerCase()
      const aName = a.name.toLowerCase()
      const aSymbol = a.symbol.toLowerCase()
      const bId = b.id.toLowerCase()
      const bName = b.name.toLowerCase()
      const bSymbol = b.symbol.toLowerCase()

      const aIdExact = aId === q
      const bIdExact = bId === q
      if (aIdExact && !bIdExact) return -1
      if (!aIdExact && bIdExact) return 1

      const aExact = aSymbol === q || aName === q
      const bExact = bSymbol === q || bName === q
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1

      if (aExact && bExact) {
        return aName.length - bName.length
      }

      const aStarts = aName.startsWith(q) || aSymbol.startsWith(q)
      const bStarts = bName.startsWith(q) || bSymbol.startsWith(q)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1

      return aName.localeCompare(bName)
    })

    setSuggestions(filtered.slice(0, 50))
    setOpen(filtered.length > 0)
    setActiveIndex(-1)
  }, [query, coins, showFavoritesOnly, favorites])

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      })
    }
  }, [activeIndex])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const sel = suggestions[activeIndex >= 0 ? activeIndex : 0]
        if (sel) selectCoin(sel.id)
      } else if (e.key === "Escape") {
        setOpen(false)
        inputRef.current?.blur()
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, suggestions, activeIndex])

  function selectCoin(id: string) {
    setOpen(false)
    setQuery("")
    router.push(`/coin/${id}`)
  }

  return (
    <div className="relative w-full max-w-2xl group z-50">
      <Search className="absolute left-4 top-3 text-zinc-400 w-5 h-5 transition-colors group-focus-within:text-white" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search cryptocurrencies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-12 bg-[#0b0b0b] border-[#1f1f1f] focus:border-zinc-700 text-white placeholder:text-zinc-500 backdrop-blur-sm/10 transition-all"
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
      />

      {open && (
        <div 
          ref={listRef}
          className="absolute mt-2 w-full bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden"
        >
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {suggestions.map((s, idx) => (
              <button
                key={s.id}
                ref={(el) => { itemRefs.current[idx] = el }}
                onClick={() => selectCoin(s.id)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`w-full text-left px-4 py-3 flex justify-between items-center transition-colors border-b border-zinc-900 last:border-0 ${
                  idx === activeIndex ? "bg-zinc-800" : "hover:bg-zinc-900"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="font-medium text-zinc-200 truncate pr-4">
                    {s.name}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase font-mono">{s.symbol}</div>
                </div>
                {(s.id === query.toLowerCase().trim() || s.symbol.toLowerCase() === query.toLowerCase().trim()) && (
                    <span className="flex-shrink-0 text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">MATCH</span>
                )}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 bg-zinc-900/50 text-[10px] text-zinc-500 border-t border-zinc-800 text-center">
            Found {suggestions.length} results. Use arrows to navigate.
          </div>
        </div>
      )}
    </div>
  )
}