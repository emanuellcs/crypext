"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { fetchChartData } from "@/lib/api"
import type { ChartData } from "@/types/crypto"

interface PriceChartProps {
  coinId: string
}

export function PriceChart({ coinId }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7")

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true)
        const data = await fetchChartData(coinId, timeRange)
        setChartData(data)
      } catch (error) {
        console.error("Error fetching chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [coinId, timeRange])

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="loading-skeleton h-full w-full rounded-xl"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {["1", "7", "30", "90"].map((days) => (
          <Button
            key={days}
            variant={timeRange === days ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(days)}
            className="hover:bg-zinc-800/50"
          >
            {days}D
          </Button>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111111",
                border: "1px solid #1f1f1f",
                borderRadius: "12px",
                color: "#e4e4e7",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              labelStyle={{ color: "#a1a1aa" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                stroke: "#3b82f6",
                strokeWidth: 2,
                fill: "#000000",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
