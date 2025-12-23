import { fetchCryptoData, fetchCoinList } from "@/lib/api"
import { HomeContent } from "@/components/home-content"

export default async function HomePage() {
  const [marketData, coinList] = await Promise.all([fetchCryptoData(), fetchCoinList()])

  return <HomeContent initialMarketData={marketData} coinList={coinList} />
}