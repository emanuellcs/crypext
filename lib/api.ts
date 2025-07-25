import type { Cryptocurrency, CoinDetail, ChartData } from "@/types/crypto"

const BASE_URL = "https://api.coingecko.com/api/v3"

export async function fetchCryptoData(): Promise<Cryptocurrency[]> {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
    { next: { revalidate: 60 } },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch crypto data")
  }

  return response.json()
}

export async function fetchCoinDetail(coinId: string): Promise<CoinDetail> {
  const response = await fetch(`${BASE_URL}/coins/${coinId}`, {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch coin detail")
  }

  return response.json()
}

export async function fetchChartData(coinId: string, days: string): Promise<ChartData[]> {
  const response = await fetch(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`, {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch chart data")
  }

  const data = await response.json()

  return data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
    date: new Date(timestamp).toLocaleDateString(),
  }))
}
