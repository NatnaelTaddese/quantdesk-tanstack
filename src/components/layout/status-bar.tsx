import { useSyncExternalStore, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface StatusBarProps {
  className?: string
}

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
}

const mockMarketData: MarketData[] = [
  { symbol: "EUR/USD", price: 1.0847, change: 0.0012, changePercent: 0.11 },
  { symbol: "GBP/USD", price: 1.2734, change: -0.0021, changePercent: -0.16 },
  { symbol: "USD/JPY", price: 149.82, change: 0.45, changePercent: 0.3 },
  { symbol: "DXY", price: 103.45, change: -0.12, changePercent: -0.12 },
]

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function formatPrice(price: number): string {
  return price.toFixed(4)
}

function formatChange(change: number, changePercent: number): string {
  const sign = change >= 0 ? "+" : ""
  return `${sign}${change.toFixed(4)} (${sign}${changePercent.toFixed(2)}%)`
}

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function StatusBar({ className }: StatusBarProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const [time, setTime] = useState<string>(() => formatTime(new Date()))

  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setTime(formatTime(new Date()))
    }, 1000)
    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted) {
    return (
      <footer
        className={cn(
          "flex h-6 items-center justify-between border-t bg-muted/50 px-3 text-[10px]",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className={cn(
        "flex h-6 items-center justify-between border-t bg-muted/50 px-3 text-[10px]",
        className
      )}
    >
      {/* Left side - Market data */}
      <div className="flex items-center gap-4">
        {mockMarketData.map((data) => (
          <div key={data.symbol} className="flex items-center gap-1.5">
            <span className="font-medium text-muted-foreground">
              {data.symbol}
            </span>
            <span className="font-mono">{formatPrice(data.price)}</span>
            <span
              className={cn(
                "font-mono",
                data.change >= 0 ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {formatChange(data.change, data.changePercent)}
            </span>
          </div>
        ))}
      </div>

      {/* Right side - System info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
          <span className="font-mono">MEM: 2.4GB</span>
          <span className="font-mono">LAT: 12ms</span>
          <span className="font-mono">WS: 3</span>
        </div>
        <span className="w-16 text-right font-mono">{time}</span>
      </div>
    </footer>
  )
}
