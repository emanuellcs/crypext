"use client"

import { Card, CardContent } from "@/components/ui/card"

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="crypto-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 loading-skeleton rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 loading-skeleton"></div>
                <div className="h-3 w-12 loading-skeleton"></div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="h-6 w-24 loading-skeleton"></div>
              <div className="h-4 w-16 loading-skeleton"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-32 loading-skeleton"></div>
              <div className="h-3 w-20 loading-skeleton"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
