export interface Cryptocurrency {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  market_cap_rank: number
}

export interface CoinDetail {
  id: string
  symbol: string
  name: string
  image: {
    large: string
  }
  market_data: {
    current_price: {
      usd: number
    }
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    market_cap: {
      usd: number
    }
    total_volume: {
      usd: number
    }
    circulating_supply: number
    max_supply: number
  }
  description: {
    en: string
  }
}

export interface ChartData {
  timestamp: number
  price: number
  date: string
}
