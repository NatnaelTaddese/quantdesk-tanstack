import { useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  MagnifyingGlass,
  Star,
  ChartLine,
  TrendUp,
  CurrencyBtc,
  Lightning,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { GridPanel } from "@/components/layout/grid"
import { Button } from "@/components/ui/button"

import { createFileRoute } from '@tanstack/react-router'


const popularTickers = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 189.84,
    change: 1.23,
    volume: "45.2M",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 415.56,
    change: -0.45,
    volume: "22.1M",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 878.34,
    change: 3.12,
    volume: "38.5M",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 155.72,
    change: -0.89,
    volume: "18.2M",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com",
    price: 178.25,
    change: 0.67,
    volume: "28.4M",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 175.21,
    change: -2.34,
    volume: "52.8M",
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 502.3,
    change: 1.56,
    volume: "15.3M",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase",
    price: 198.45,
    change: 0.32,
    volume: "9.1M",
  },
]

const indices = [
  { symbol: "SPY", name: "S&P 500 ETF", price: 512.45, change: 0.42 },
  { symbol: "QQQ", name: "Nasdaq 100", price: 445.23, change: -0.18 },
  { symbol: "DIA", name: "Dow Jones ETF", price: 398.76, change: 0.25 },
  { symbol: "IWM", name: "Russell 2000", price: 198.76, change: 0.85 },
  { symbol: "VIX", name: "Volatility Index", price: 14.82, change: -3.45 },
  { symbol: "TLT", name: "20+ Year Treasury", price: 92.45, change: 0.12 },
]

const crypto = [
  { symbol: "BTC-USD", name: "Bitcoin", price: 67432.5, change: 2.34 },
  { symbol: "ETH-USD", name: "Ethereum", price: 3456.78, change: 1.89 },
  { symbol: "SOL-USD", name: "Solana", price: 142.23, change: -1.23 },
  { symbol: "AVAX-USD", name: "Avalanche", price: 35.67, change: 3.45 },
]

const recentViews = [
  { symbol: "NVDA", time: "2 min ago" },
  { symbol: "AAPL", time: "15 min ago" },
  { symbol: "TSLA", time: "1 hr ago" },
  { symbol: "AMD", time: "2 hrs ago" },
]

const timeframes = [
  { label: "1D", value: "1d" },
  { label: "5D", value: "5d" },
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "6M", value: "6m" },
  { label: "1Y", value: "1y" },
  { label: "ALL", value: "all" },
]

export const Route = createFileRoute("/_app/chart")({
  component: ChartPage,
})

function ChartPage() {
  const [search, setSearch] = useState("")
  const [selectedTimeframe, setSelectedTimeframe] = useState("1d")

  const filteredPopular = popularTickers.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-full flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between border bg-card px-3 py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold">CHART</span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Lightning size={12} className="text-amber-500" />
            Real-time data
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setSelectedTimeframe(tf.value)}
              className={cn(
                "h-6 px-2 text-[10px] font-medium transition-all",
                selectedTimeframe === tf.value
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-1 overflow-hidden">
        {/* Left Column - Search & Popular */}
        <div className="flex w-80 flex-col gap-1">
          {/* Search Panel */}
          <GridPanel title="Search" className="shrink-0">
            <div className="relative">
              <MagnifyingGlass className="absolute top-1/2 left-2 size-3 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter ticker (e.g. AAPL)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 w-full rounded-none border border-border bg-transparent px-7 text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
          </GridPanel>

          {/* Search Results or Popular Tickers */}
          {search ? (
            <GridPanel
              title="Results"
              actions={
                <span className="text-[10px] text-muted-foreground">
                  {filteredPopular.length} found
                </span>
              }
              className="flex-1"
            >
              <div className="space-y-0">
                {filteredPopular.length > 0 ? (
                  filteredPopular.map((ticker) => (
                    <Link
                      key={ticker.symbol}
                      href={`/chart/${ticker.symbol}`}
                      className="flex items-center justify-between border-b border-border/50 py-1.5 last:border-0 hover:bg-foreground/[0.03]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium">
                          {ticker.symbol}
                        </span>
                        <span className="max-w-[100px] truncate text-[10px] text-muted-foreground">
                          {ticker.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          ${ticker.price.toFixed(2)}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[10px]",
                            ticker.change >= 0
                              ? "text-emerald-500"
                              : "text-rose-500"
                          )}
                        >
                          {ticker.change >= 0 ? "+" : ""}
                          {ticker.change}%
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    No tickers found for &quot;{search}&quot;
                  </div>
                )}
              </div>
            </GridPanel>
          ) : (
            <>
              {/* Popular Tickers */}
              <GridPanel
                title="Popular"
                actions={
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Star size={10} weight="fill" className="text-amber-500" />
                    Top 8
                  </div>
                }
                className="flex-1"
              >
                <div className="space-y-0">
                  {popularTickers.map((ticker) => (
                    <Link
                      key={ticker.symbol}
                      href={`/chart/${ticker.symbol}`}
                      className="flex items-center justify-between border-b border-border/50 py-1 last:border-0 hover:bg-foreground/[0.03]"
                    >
                      <div className="flex items-center gap-1.5">
                        <ChartLine
                          size={12}
                          className="text-muted-foreground"
                        />
                        <div>
                          <div className="font-mono text-xs font-medium">
                            {ticker.symbol}
                          </div>
                          <div className="text-[9px] text-muted-foreground">
                            {ticker.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs">
                          ${ticker.price.toFixed(2)}
                        </div>
                        <div
                          className={cn(
                            "font-mono text-[10px]",
                            ticker.change >= 0
                              ? "text-emerald-500"
                              : "text-rose-500"
                          )}
                        >
                          {ticker.change >= 0 ? "+" : ""}
                          {ticker.change}%
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </GridPanel>

              {/* Recent Views */}
              <GridPanel
                title="Recent"
                actions={
                  <span className="text-[10px] text-muted-foreground">
                    History
                  </span>
                }
                className="h-32 shrink-0"
              >
                <div className="space-y-0">
                  {recentViews.map((view) => (
                    <Link
                      key={view.symbol}
                      href={`/chart/${view.symbol}`}
                      className="flex items-center justify-between border-b border-border/50 py-1 last:border-0 hover:bg-foreground/[0.03]"
                    >
                      <span className="font-mono text-xs font-medium">
                        {view.symbol}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {view.time}
                      </span>
                    </Link>
                  ))}
                </div>
              </GridPanel>
            </>
          )}
        </div>

        {/* Center & Right Columns */}
        <div className="flex flex-1 flex-col gap-1">
          <div className="grid flex-1 grid-cols-2 gap-1">
            {/* Indices */}
            <GridPanel
              title="Indices"
              actions={
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <TrendUp size={10} />
                  Benchmarks
                </div>
              }
            >
              <div className="space-y-0">
                {indices.map((ticker) => (
                  <Link
                    key={ticker.symbol}
                    href={`/chart/${ticker.symbol}`}
                    className="flex items-center justify-between border-b border-border/50 py-1.5 last:border-0 hover:bg-foreground/[0.03]"
                  >
                    <div className="flex items-center gap-1.5">
                      <ChartLine size={12} className="text-muted-foreground" />
                      <div>
                        <div className="font-mono text-xs font-medium">
                          {ticker.symbol}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          {ticker.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs">
                        ${ticker.price.toFixed(2)}
                      </div>
                      <div
                        className={cn(
                          "font-mono text-[10px]",
                          ticker.change >= 0
                            ? "text-emerald-500"
                            : "text-rose-500"
                        )}
                      >
                        {ticker.change >= 0 ? "+" : ""}
                        {ticker.change}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </GridPanel>

            {/* Crypto */}
            <GridPanel
              title="Crypto"
              actions={
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <CurrencyBtc size={10} className="text-amber-500" />
                  24h
                </div>
              }
            >
              <div className="space-y-0">
                {crypto.map((ticker) => (
                  <Link
                    key={ticker.symbol}
                    href={`/chart/${ticker.symbol}`}
                    className="flex items-center justify-between border-b border-border/50 py-1.5 last:border-0 hover:bg-foreground/[0.03]"
                  >
                    <div className="flex items-center gap-1.5">
                      <ChartLine size={12} className="text-muted-foreground" />
                      <div>
                        <div className="font-mono text-xs font-medium">
                          {ticker.symbol}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          {ticker.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs">
                        ${ticker.price.toLocaleString()}
                      </div>
                      <div
                        className={cn(
                          "font-mono text-[10px]",
                          ticker.change >= 0
                            ? "text-emerald-500"
                            : "text-rose-500"
                        )}
                      >
                        {ticker.change >= 0 ? "+" : ""}
                        {ticker.change}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </GridPanel>
          </div>
        </div>
      </div>
    </div>
  )
}
