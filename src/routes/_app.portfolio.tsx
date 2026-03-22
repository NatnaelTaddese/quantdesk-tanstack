import { useState, useMemo } from "react"
import { useRouter } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GridPanel } from "@/components/layout/grid"
import { cn } from "@/lib/utils"
import {

  Plus,
  Export,
  Upload,
  Pencil,
  Trash,
  Bell,
  BellRinging,
  CaretUp,
  CaretDown,
  ChartLine,
  ChartBar,
  ChartPieSlice,
  Gauge,
  Warning,
  TrendUp,
  TrendDown,
  ArrowsDownUp,
  SortAscending,
  SortDescending,
  X,
  Check,
  Target,
  ShieldWarning,
  Globe,
  Buildings,
  Lightning,
  Plugs,
} from "@phosphor-icons/react"

import { createFileRoute } from '@tanstack/react-router'

// ============================================================
// MOCK DATA
// ============================================================

// Positions data
const mockPositions = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 150,
    avgCost: 172.5,
    currentPrice: 189.84,
    sector: "Technology",
    country: "USA",
    beta: 1.18,
    peakPrice: 199.62,
  },
  {
    id: 2,
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    shares: 50,
    avgCost: 750.0,
    currentPrice: 878.34,
    sector: "Technology",
    country: "USA",
    beta: 1.72,
    peakPrice: 974.0,
  },
  {
    id: 3,
    symbol: "MSFT",
    name: "Microsoft Corp.",
    shares: 80,
    avgCost: 390.2,
    currentPrice: 415.56,
    sector: "Technology",
    country: "USA",
    beta: 0.89,
    peakPrice: 430.82,
  },
  {
    id: 4,
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 120,
    avgCost: 145.0,
    currentPrice: 155.72,
    sector: "Technology",
    country: "USA",
    beta: 1.05,
    peakPrice: 191.75,
  },
  {
    id: 5,
    symbol: "AMZN",
    name: "Amazon.com",
    shares: 60,
    avgCost: 160.0,
    currentPrice: 178.25,
    sector: "Consumer",
    country: "USA",
    beta: 1.24,
    peakPrice: 189.77,
  },
  {
    id: 6,
    symbol: "JPM",
    name: "JPMorgan Chase",
    shares: 100,
    avgCost: 175.0,
    currentPrice: 198.45,
    sector: "Financials",
    country: "USA",
    beta: 1.08,
    peakPrice: 205.88,
  },
  {
    id: 7,
    symbol: "JNJ",
    name: "Johnson & Johnson",
    shares: 75,
    avgCost: 158.0,
    currentPrice: 162.34,
    sector: "Healthcare",
    country: "USA",
    beta: 0.52,
    peakPrice: 175.45,
  },
  {
    id: 8,
    symbol: "XOM",
    name: "Exxon Mobil",
    shares: 120,
    avgCost: 95.0,
    currentPrice: 108.25,
    sector: "Energy",
    country: "USA",
    beta: 0.95,
    peakPrice: 123.75,
  },
  {
    id: 9,
    symbol: "TSLA",
    name: "Tesla Inc.",
    shares: -25,
    avgCost: 190.0,
    currentPrice: 175.21,
    sector: "Consumer",
    country: "USA",
    beta: 2.01,
    peakPrice: 299.29,
  },
  {
    id: 10,
    symbol: "V",
    name: "Visa Inc.",
    shares: 40,
    avgCost: 255.0,
    currentPrice: 278.45,
    sector: "Financials",
    country: "USA",
    beta: 0.94,
    peakPrice: 290.96,
  },
]

// Portfolio value history (for P&L chart)
const mockPortfolioHistory = [
  { date: "2026-01-02", value: 245000, spy: 100 },
  { date: "2026-01-09", value: 248500, spy: 101.2 },
  { date: "2026-01-16", value: 252300, spy: 102.5 },
  { date: "2026-01-23", value: 249800, spy: 101.8 },
  { date: "2026-01-30", value: 255600, spy: 103.2 },
  { date: "2026-02-06", value: 261200, spy: 104.8 },
  { date: "2026-02-13", value: 258900, spy: 104.1 },
  { date: "2026-02-20", value: 265400, spy: 105.9 },
  { date: "2026-02-27", value: 270100, spy: 107.2 },
  { date: "2026-03-06", value: 276800, spy: 108.5 },
  { date: "2026-03-13", value: 284592, spy: 109.8 },
]

// Risk metrics
const mockRiskMetrics = {
  portfolioBeta: 1.15,
  var95: -8245.5,
  var99: -12834.25,
  cvar95: -10892.3,
  cvar99: -15421.8,
  sharpeRatio: 1.42,
  sortinoRatio: 1.89,
  maxDrawdown: -12.5,
  currentDrawdown: -3.2,
  volatility: 18.5,
  trackingError: 4.2,
  informationRatio: 0.85,
}

// Correlation matrix (simplified)
const correlationSymbols = [
  "AAPL",
  "NVDA",
  "MSFT",
  "GOOGL",
  "AMZN",
  "JPM",
  "JNJ",
  "XOM",
]
const mockCorrelationMatrix = [
  [1.0, 0.72, 0.85, 0.78, 0.68, 0.45, 0.25, 0.15],
  [0.72, 1.0, 0.68, 0.65, 0.58, 0.35, 0.18, 0.1],
  [0.85, 0.68, 1.0, 0.82, 0.72, 0.48, 0.28, 0.18],
  [0.78, 0.65, 0.82, 1.0, 0.75, 0.42, 0.22, 0.12],
  [0.68, 0.58, 0.72, 0.75, 1.0, 0.38, 0.2, 0.08],
  [0.45, 0.35, 0.48, 0.42, 0.38, 1.0, 0.35, 0.42],
  [0.25, 0.18, 0.28, 0.22, 0.2, 0.35, 1.0, 0.28],
  [0.15, 0.1, 0.18, 0.12, 0.08, 0.42, 0.28, 1.0],
]

// Alerts
const mockAlerts = [
  {
    id: 1,
    symbol: "AAPL",
    type: "price_target",
    targetPrice: 200.0,
    currentPrice: 189.84,
    direction: "above",
    active: true,
  },
  {
    id: 2,
    symbol: "NVDA",
    type: "stop_loss",
    targetPrice: 800.0,
    currentPrice: 878.34,
    direction: "below",
    active: true,
  },
  {
    id: 3,
    symbol: "TSLA",
    type: "price_target",
    targetPrice: 160.0,
    currentPrice: 175.21,
    direction: "below",
    active: true,
  },
  {
    id: 4,
    symbol: "MSFT",
    type: "stop_loss",
    targetPrice: 380.0,
    currentPrice: 415.56,
    direction: "below",
    active: true,
  },
  {
    id: 5,
    symbol: "AMZN",
    type: "price_target",
    targetPrice: 190.0,
    currentPrice: 178.25,
    direction: "above",
    active: false,
  },
]

// Recent activity
const mockActivity = [
  { time: "09:31:02", action: "BUY", symbol: "AAPL", qty: 50, price: 189.2 },
  { time: "09:30:45", action: "SELL", symbol: "TSLA", qty: 25, price: 176.8 },
  { time: "09:15:22", action: "BUY", symbol: "NVDA", qty: 20, price: 875.5 },
  { time: "Yesterday", action: "DIV", symbol: "JPM", qty: 0, price: 125.0 },
  { time: "Mar 11", action: "BUY", symbol: "V", qty: 40, price: 255.0 },
]

// ============================================================
// TYPES
// ============================================================

type SortConfig = {
  key: string
  direction: "asc" | "desc"
}

type ViewTab = "positions" | "risk" | "alerts"

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPercent = (value: number, decimals = 2) => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`
}

// ============================================================
// COMPONENT
// ============================================================

export const Route = createFileRoute("/_app/portfolio")({
  component: PortfolioPage,
})

function PortfolioPage() {
  const router = useRouter()

  // State
  const [activeTab, setActiveTab] = useState<ViewTab>("positions")
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "value",
    direction: "desc",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddPosition, setShowAddPosition] = useState(false)
  const [showAddAlert, setShowAddAlert] = useState(false)
  const [editingPosition, setEditingPosition] = useState<number | null>(null)
  const [riskPanelExpanded, setRiskPanelExpanded] = useState(true)

  // Calculate derived position data
  const positionsWithMetrics = useMemo(() => {
    return mockPositions.map((pos) => {
      const marketValue = pos.shares * pos.currentPrice
      const costBasis = pos.shares * pos.avgCost
      const unrealizedPnl = marketValue - costBasis
      const unrealizedPnlPct =
        ((pos.currentPrice - pos.avgCost) / pos.avgCost) * 100
      const drawdownFromPeak =
        ((pos.currentPrice - pos.peakPrice) / pos.peakPrice) * 100
      return {
        ...pos,
        marketValue,
        costBasis,
        unrealizedPnl,
        unrealizedPnlPct,
        drawdownFromPeak,
      }
    })
  }, [])

  // Calculate totals
  const portfolioTotals = useMemo(() => {
    const totalValue = positionsWithMetrics.reduce(
      (sum, p) => sum + Math.abs(p.marketValue),
      0
    )
    const totalCost = positionsWithMetrics.reduce(
      (sum, p) => sum + Math.abs(p.costBasis),
      0
    )
    const totalPnl = positionsWithMetrics.reduce(
      (sum, p) => sum + p.unrealizedPnl,
      0
    )
    const longValue = positionsWithMetrics
      .filter((p) => p.shares > 0)
      .reduce((sum, p) => sum + p.marketValue, 0)
    const shortValue = positionsWithMetrics
      .filter((p) => p.shares < 0)
      .reduce((sum, p) => sum + Math.abs(p.marketValue), 0)
    const grossExposure = longValue + shortValue
    const netExposure = longValue - shortValue

    return {
      totalValue,
      totalCost,
      totalPnl,
      totalPnlPct: (totalPnl / totalCost) * 100,
      longValue,
      shortValue,
      grossExposure,
      netExposure,
      longCount: positionsWithMetrics.filter((p) => p.shares > 0).length,
      shortCount: positionsWithMetrics.filter((p) => p.shares < 0).length,
    }
  }, [positionsWithMetrics])

  // Add weight to positions
  const positionsWithWeight = useMemo(() => {
    return positionsWithMetrics.map((pos) => ({
      ...pos,
      weight: (Math.abs(pos.marketValue) / portfolioTotals.totalValue) * 100,
    }))
  }, [positionsWithMetrics, portfolioTotals])

  // Filter and sort positions
  const filteredPositions = useMemo(() => {
    return positionsWithWeight.filter(
      (p) =>
        p.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [positionsWithWeight, searchQuery])

  const sortedPositions = useMemo(() => {
    return [...filteredPositions].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof typeof a]
      const bVal = b[sortConfig.key as keyof typeof b]
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal
      }
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [filteredPositions, sortConfig])

  // Sector allocation
  const sectorAllocation = useMemo(() => {
    const sectors: Record<string, number> = {}
    positionsWithWeight.forEach((pos) => {
      if (!sectors[pos.sector]) sectors[pos.sector] = 0
      sectors[pos.sector] += Math.abs(pos.marketValue)
    })
    return Object.entries(sectors)
      .map(([sector, value]) => ({
        sector,
        value,
        weight: (value / portfolioTotals.totalValue) * 100,
      }))
      .sort((a, b) => b.weight - a.weight)
  }, [positionsWithWeight, portfolioTotals])

  // P&L attribution (waterfall data)
  const pnlAttribution = useMemo(() => {
    return positionsWithWeight
      .map((pos) => ({
        symbol: pos.symbol,
        pnl: pos.unrealizedPnl,
        contribution: (pos.unrealizedPnl / portfolioTotals.totalCost) * 100,
      }))
      .sort((a, b) => b.pnl - a.pnl)
  }, [positionsWithWeight, portfolioTotals])

  // Event handlers
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }))
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return null
    return sortConfig.direction === "desc" ? (
      <SortDescending size={10} className="ml-0.5 inline" />
    ) : (
      <SortAscending size={10} className="ml-0.5 inline" />
    )
  }

  // Chart calculations
  const chartMax = Math.max(...mockPortfolioHistory.map((d) => d.value))
  const chartMin = Math.min(...mockPortfolioHistory.map((d) => d.value))
  const chartRange = chartMax - chartMin || 1

  // Correlation color helper
  const getCorrelationColor = (value: number) => {
    if (value >= 0.7) return "bg-rose-500"
    if (value >= 0.4) return "bg-amber-500"
    if (value >= 0) return "bg-emerald-500"
    return "bg-blue-500"
  }

  const getCorrelationOpacity = (value: number) => {
    return Math.abs(value)
  }

  return (
    <div className="flex h-full flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between border bg-card px-3 py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold">PORTFOLIO</span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>
              {portfolioTotals.longCount + portfolioTotals.shortCount} positions
            </span>
            <span className="text-muted-foreground/50">|</span>
            <span className="text-emerald-500">
              {portfolioTotals.longCount} long
            </span>
            <span className="text-rose-500">
              {portfolioTotals.shortCount} short
            </span>
          </div>
          <div className="flex items-center gap-1 rounded border px-2 py-0.5">
            <Plugs size={10} className="text-emerald-500" />
            <span className="text-[10px] text-emerald-500">Live</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="xs"
            className="gap-1"
            onClick={() => setShowAddPosition(true)}
          >
            <Plus size={14} />
            Add Position
          </Button>
          <Button variant="ghost" size="xs" className="gap-1">
            <Upload size={14} />
            Import CSV
          </Button>
          <Button variant="ghost" size="xs" className="gap-1">
            <Export size={14} />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-1 overflow-hidden">
        {/* Left Column - Summary & Allocation */}
        <div className="flex w-72 flex-col gap-1">
          {/* Portfolio Summary */}
          <GridPanel title="Portfolio Summary">
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-muted-foreground">TOTAL VALUE</p>
                <p className="font-mono text-2xl font-bold">
                  {formatCurrency(portfolioTotals.totalValue)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border p-2">
                  <p className="text-[10px] text-muted-foreground">
                    UNREALIZED P&L
                  </p>
                  <p
                    className={cn(
                      "font-mono text-sm",
                      portfolioTotals.totalPnl >= 0
                        ? "text-emerald-500"
                        : "text-rose-500"
                    )}
                  >
                    {portfolioTotals.totalPnl >= 0 ? "+" : ""}
                    {formatCurrency(portfolioTotals.totalPnl)}
                  </p>
                  <p
                    className={cn(
                      "font-mono text-[10px]",
                      portfolioTotals.totalPnl >= 0
                        ? "text-emerald-500"
                        : "text-rose-500"
                    )}
                  >
                    {formatPercent(portfolioTotals.totalPnlPct)}
                  </p>
                </div>
                <div className="border p-2">
                  <p className="text-[10px] text-muted-foreground">TODAY</p>
                  <p className="font-mono text-sm text-emerald-500">+$1,245</p>
                  <p className="font-mono text-[10px] text-emerald-500">
                    +0.44%
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">GROSS EXPOSURE</span>
                  <span className="font-mono">
                    {formatCurrency(portfolioTotals.grossExposure)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">NET EXPOSURE</span>
                  <span className="font-mono">
                    {formatCurrency(portfolioTotals.netExposure)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">
                    LONG/SHORT RATIO
                  </span>
                  <span className="font-mono">
                    {(
                      portfolioTotals.longValue / portfolioTotals.shortValue
                    ).toFixed(2)}
                    x
                  </span>
                </div>
              </div>
            </div>
          </GridPanel>

          {/* Sector Allocation */}
          <GridPanel
            title="Sector Allocation"
            actions={
              <ChartPieSlice size={12} className="text-muted-foreground" />
            }
          >
            <div className="space-y-1.5">
              {sectorAllocation.map((s) => (
                <div key={s.sector}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{s.sector}</span>
                    <span className="font-mono">{s.weight.toFixed(1)}%</span>
                  </div>
                  <div className="mt-0.5 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        s.sector === "Technology"
                          ? "bg-blue-500"
                          : s.sector === "Consumer"
                            ? "bg-purple-500"
                            : s.sector === "Financials"
                              ? "bg-emerald-500"
                              : s.sector === "Healthcare"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                      )}
                      style={{ width: `${s.weight}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GridPanel>

          {/* Geographic Exposure */}
          <GridPanel
            title="Geographic Exposure"
            actions={<Globe size={12} className="text-muted-foreground" />}
            className="shrink-0"
          >
            <div className="space-y-1.5">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span>United States</span>
                  <span className="font-mono">100.0%</span>
                </div>
                <div className="mt-0.5 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-blue-500" />
                </div>
              </div>
              <div className="rounded border border-dashed p-2 text-center text-[10px] text-muted-foreground">
                Add international positions for geographic diversification
              </div>
            </div>
          </GridPanel>

          {/* Top Contributors */}
          <GridPanel
            title="P&L Attribution"
            actions={<ChartBar size={12} className="text-muted-foreground" />}
            className="flex-1"
          >
            <div className="space-y-1">
              <div className="text-[10px] text-muted-foreground">
                Top contributors to total P&L
              </div>
              {pnlAttribution.slice(0, 6).map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center gap-2 text-xs"
                >
                  <span className="w-10 font-mono font-medium">
                    {item.symbol}
                  </span>
                  <div className="flex flex-1 items-center">
                    <div className="h-1.5 flex-1 rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          item.pnl >= 0 ? "bg-emerald-500" : "bg-rose-500"
                        )}
                        style={{
                          width: `${Math.min(Math.abs(item.contribution) * 10, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className={cn(
                      "w-14 text-right font-mono text-[10px]",
                      item.pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}
                  >
                    {item.pnl >= 0 ? "+" : ""}
                    {formatCurrency(item.pnl)}
                  </span>
                </div>
              ))}
            </div>
          </GridPanel>
        </div>

        {/* Center - Main Content Area */}
        <div className="flex flex-1 flex-col gap-1 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 border bg-card px-2 py-1">
            {[
              { key: "positions", label: "Positions", icon: Buildings },
              { key: "risk", label: "Risk Dashboard", icon: ShieldWarning },
              { key: "alerts", label: "Alerts", icon: Bell },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as ViewTab)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTab === key
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Positions Tab */}
          {activeTab === "positions" && (
            <div className="flex flex-1 flex-col overflow-hidden border bg-card">
              {/* Table Header */}
              <div className="flex items-center justify-between border-b px-3 py-1.5 text-[10px]">
                <span className="text-muted-foreground">
                  {sortedPositions.length} positions | Click row to view chart
                </span>
                <Input
                  placeholder="Search positions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-6 w-48 text-[10px]"
                />
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b text-[10px] text-muted-foreground">
                      <th
                        className="cursor-pointer px-3 py-1.5 text-left font-medium hover:text-foreground"
                        onClick={() => handleSort("symbol")}
                      >
                        TICKER <SortIcon column="symbol" />
                      </th>
                      <th className="px-3 py-1.5 text-left font-medium">
                        NAME
                      </th>
                      <th
                        className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
                        onClick={() => handleSort("shares")}
                      >
                        SHARES <SortIcon column="shares" />
                      </th>
                      <th
                        className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
                        onClick={() => handleSort("avgCost")}
                      >
                        AVG COST <SortIcon column="avgCost" />
                      </th>
                      <th
                        className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
                        onClick={() => handleSort("currentPrice")}
                      >
                        PRICE <SortIcon column="currentPrice" />
                      </th>
                      <th
                        className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
                        onClick={() => handleSort("marketValue")}
                      >
                        MKT VALUE <SortIcon column="marketValue" />
                      </th>
                      <th
                        className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
                        onClick={() => handleSort("unrealizedPnl")}
                      >
                        P&L ($) <SortIcon column="unrealizedPnl" />
                      </th>
                      <th
                        className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
                        onClick={() => handleSort("unrealizedPnlPct")}
                      >
                        P&L (%) <SortIcon column="unrealizedPnlPct" />
                      </th>
                      <th
                        className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
                        onClick={() => handleSort("weight")}
                      >
                        WEIGHT <SortIcon column="weight" />
                      </th>
                      <th className="px-3 py-1.5 text-left font-medium">
                        SECTOR
                      </th>
                      <th className="px-3 py-1.5 text-center font-medium">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPositions.map((row) => (
                      <tr
                        key={row.id}
                        className="cursor-pointer border-b border-border/50 hover:bg-foreground/[0.03]"
                        onClick={() => router.navigate({ to: `/chart/${row.symbol}` })}
                      >
                        <td className="px-3 py-1.5">
                          <span className="font-mono font-medium">
                            {row.symbol}
                          </span>
                          {row.shares < 0 && (
                            <span className="ml-1 rounded bg-rose-500/20 px-1 py-0.5 text-[9px] text-rose-500">
                              SHORT
                            </span>
                          )}
                        </td>
                        <td className="max-w-[120px] truncate px-3 py-1.5 text-muted-foreground">
                          {row.name}
                        </td>
                        <td
                          className={cn(
                            "px-3 py-1.5 text-right font-mono",
                            row.shares < 0 && "text-rose-500"
                          )}
                        >
                          {row.shares.toLocaleString()}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                          ${row.avgCost.toFixed(2)}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono">
                          ${row.currentPrice.toFixed(2)}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono">
                          {formatCurrency(Math.abs(row.marketValue))}
                        </td>
                        <td
                          className={cn(
                            "px-3 py-1.5 text-right font-mono",
                            row.unrealizedPnl >= 0
                              ? "text-emerald-500"
                              : "text-rose-500"
                          )}
                        >
                          {row.unrealizedPnl >= 0 ? "+" : ""}
                          {formatCurrency(row.unrealizedPnl)}
                        </td>
                        <td
                          className={cn(
                            "px-3 py-1.5 text-right font-mono",
                            row.unrealizedPnlPct >= 0
                              ? "text-emerald-500"
                              : "text-rose-500"
                          )}
                        >
                          {formatPercent(row.unrealizedPnlPct)}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                          {row.weight.toFixed(1)}%
                        </td>
                        <td className="px-3 py-1.5 text-muted-foreground">
                          {row.sector}
                        </td>
                        <td className="px-3 py-1.5">
                          <div
                            className="flex items-center justify-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="p-1 text-muted-foreground hover:text-foreground">
                              <Pencil size={12} />
                            </button>
                            <button className="p-1 text-muted-foreground hover:text-rose-500">
                              <Trash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="flex items-center justify-between border-t px-3 py-1 text-[10px] text-muted-foreground">
                <span>Last sync: {new Date().toLocaleTimeString()}</span>
                <span>Market: Open</span>
              </div>
            </div>
          )}

          {/* Risk Dashboard Tab */}
          {activeTab === "risk" && (
            <div className="flex flex-1 flex-col gap-1 overflow-auto">
              {/* Risk Metrics Grid */}
              <div className="grid grid-cols-4 gap-1">
                <GridPanel title="Portfolio Beta">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-mono text-2xl font-bold">
                        {mockRiskMetrics.portfolioBeta.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        vs S&P 500
                      </p>
                    </div>
                    <Gauge
                      size={24}
                      className={cn(
                        mockRiskMetrics.portfolioBeta > 1.2
                          ? "text-rose-500"
                          : mockRiskMetrics.portfolioBeta < 0.8
                            ? "text-emerald-500"
                            : "text-amber-500"
                      )}
                    />
                  </div>
                </GridPanel>

                <GridPanel title="VaR (95%)">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-mono text-2xl font-bold text-rose-500">
                        {formatCurrency(mockRiskMetrics.var95)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Daily 1-day
                      </p>
                    </div>
                    <Warning size={24} className="text-amber-500" />
                  </div>
                </GridPanel>

                <GridPanel title="VaR (99%)">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-mono text-2xl font-bold text-rose-500">
                        {formatCurrency(mockRiskMetrics.var99)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Daily 1-day
                      </p>
                    </div>
                    <ShieldWarning size={24} className="text-rose-500" />
                  </div>
                </GridPanel>

                <GridPanel title="Max Drawdown">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-mono text-2xl font-bold text-rose-500">
                        {mockRiskMetrics.maxDrawdown.toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Current: {mockRiskMetrics.currentDrawdown.toFixed(1)}%
                      </p>
                    </div>
                    <TrendDown size={24} className="text-rose-500" />
                  </div>
                </GridPanel>
              </div>

              {/* CVaR & Performance Metrics */}
              <div className="grid grid-cols-2 gap-1">
                <GridPanel title="Conditional VaR (Expected Shortfall)">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        CVaR 95%
                      </p>
                      <p className="font-mono text-lg text-rose-500">
                        {formatCurrency(mockRiskMetrics.cvar95)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Avg loss beyond VaR
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        CVaR 99%
                      </p>
                      <p className="font-mono text-lg text-rose-500">
                        {formatCurrency(mockRiskMetrics.cvar99)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Avg loss beyond VaR
                      </p>
                    </div>
                  </div>
                </GridPanel>

                <GridPanel title="Risk-Adjusted Returns">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Sharpe Ratio
                      </p>
                      <p className="font-mono text-lg">
                        {mockRiskMetrics.sharpeRatio.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Sortino Ratio
                      </p>
                      <p className="font-mono text-lg">
                        {mockRiskMetrics.sortinoRatio.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Info Ratio
                      </p>
                      <p className="font-mono text-lg">
                        {mockRiskMetrics.informationRatio.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </GridPanel>
              </div>

              {/* Position Drawdowns */}
              <GridPanel title="Position Drawdowns from Peak">
                <div className="space-y-1.5">
                  {positionsWithWeight
                    .sort((a, b) => a.drawdownFromPeak - b.drawdownFromPeak)
                    .slice(0, 8)
                    .map((pos) => (
                      <div
                        key={pos.symbol}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="w-10 font-mono font-medium">
                          {pos.symbol}
                        </span>
                        <div className="flex flex-1 items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-rose-500"
                              style={{
                                width: `${Math.abs(pos.drawdownFromPeak)}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="w-14 text-right font-mono text-rose-500">
                          {pos.drawdownFromPeak.toFixed(1)}%
                        </span>
                        <span className="w-20 text-right font-mono text-[10px] text-muted-foreground">
                          Peak: ${pos.peakPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              </GridPanel>

              {/* Correlation Heatmap */}
              <GridPanel
                title="Correlation Matrix"
                actions={
                  <span className="text-[10px] text-muted-foreground">
                    30-day rolling correlations
                  </span>
                }
                className="flex-1"
              >
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-1 text-[10px]"></th>
                        {correlationSymbols.map((sym) => (
                          <th
                            key={sym}
                            className="p-1 text-center font-mono text-[10px] text-muted-foreground"
                          >
                            {sym}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {correlationSymbols.map((rowSym, rowIdx) => (
                        <tr key={rowSym}>
                          <td className="p-1 font-mono text-[10px] text-muted-foreground">
                            {rowSym}
                          </td>
                          {mockCorrelationMatrix[rowIdx].map((corr, colIdx) => (
                            <td key={colIdx} className="p-0.5">
                              <div
                                className={cn(
                                  "flex h-6 w-full items-center justify-center font-mono text-[9px]",
                                  rowIdx === colIdx
                                    ? "bg-foreground/10"
                                    : getCorrelationColor(corr)
                                )}
                                style={{
                                  opacity:
                                    rowIdx === colIdx
                                      ? 1
                                      : 0.3 + getCorrelationOpacity(corr) * 0.7,
                                }}
                              >
                                {corr.toFixed(2)}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-2 flex items-center justify-center gap-4 text-[10px]">
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-emerald-500" /> Low
                      (&lt;0.4)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-amber-500" /> Medium
                      (0.4-0.7)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded bg-rose-500" /> High
                      (&gt;0.7)
                    </span>
                  </div>
                </div>
              </GridPanel>
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === "alerts" && (
            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
              {/* Alerts Header */}
              <div className="flex items-center justify-between border bg-card px-3 py-2">
                <div className="flex items-center gap-2">
                  <BellRinging size={16} className="text-amber-500" />
                  <span className="text-xs">
                    {mockAlerts.filter((a) => a.active).length} active alerts
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  className="gap-1"
                  onClick={() => setShowAddAlert(true)}
                >
                  <Plus size={14} />
                  Add Alert
                </Button>
              </div>

              {/* Alerts List */}
              <div className="flex-1 overflow-auto border bg-card">
                <div className="space-y-0">
                  {mockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "flex items-center gap-3 border-b px-3 py-2",
                        !alert.active && "opacity-50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded",
                          alert.type === "price_target"
                            ? "bg-blue-500/20 text-blue-500"
                            : "bg-rose-500/20 text-rose-500"
                        )}
                      >
                        {alert.type === "price_target" ? (
                          <Target size={16} />
                        ) : (
                          <ShieldWarning size={16} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">
                            {alert.symbol}
                          </span>
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-medium",
                              alert.type === "price_target"
                                ? "bg-blue-500/20 text-blue-500"
                                : "bg-rose-500/20 text-rose-500"
                            )}
                          >
                            {alert.type === "price_target"
                              ? "PRICE TARGET"
                              : "STOP LOSS"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Alert when price goes{" "}
                          <span className="font-medium text-foreground">
                            {alert.direction}
                          </span>{" "}
                          <span className="font-mono">
                            ${alert.targetPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[10px]">
                          <span className="text-muted-foreground">
                            Current:
                          </span>
                          <span className="font-mono">
                            ${alert.currentPrice.toFixed(2)}
                          </span>
                          <span
                            className={cn(
                              "font-mono",
                              (alert.direction === "above" &&
                                alert.currentPrice < alert.targetPrice) ||
                                (alert.direction === "below" &&
                                  alert.currentPrice > alert.targetPrice)
                                ? "text-muted-foreground"
                                : "text-amber-500"
                            )}
                          >
                            (
                            {(
                              ((alert.targetPrice - alert.currentPrice) /
                                alert.currentPrice) *
                              100
                            ).toFixed(1)}
                            % away)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className={cn(
                            "rounded p-1.5",
                            alert.active
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {alert.active ? (
                            <Bell size={14} />
                          ) : (
                            <Bell size={14} />
                          )}
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-foreground">
                          <Pencil size={14} />
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-rose-500">
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert Info */}
              <div className="border bg-card p-3">
                <div className="flex items-start gap-2">
                  <Lightning size={14} className="mt-0.5 text-amber-500" />
                  <div className="text-[10px] text-muted-foreground">
                    <p className="font-medium text-foreground">
                      How Alerts Work
                    </p>
                    <p className="mt-1">
                      Alerts are monitored by a background Celery job that runs
                      every 30 seconds during market hours. When triggered,
                      you&apos;ll receive an in-app notification and optional
                      email/SMS alerts if configured in settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Charts & Performance */}
        <div className="flex w-80 flex-col gap-1">
          {/* P&L Chart */}
          <GridPanel
            title="Portfolio Value vs SPY"
            actions={
              <div className="flex items-center gap-1 text-[10px]">
                <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-500">
                  Portfolio
                </span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-500">
                  SPY
                </span>
              </div>
            }
            className="h-48"
          >
            <div className="flex h-full flex-col">
              {/* Mini area chart placeholder */}
              <div className="flex flex-1 items-end gap-0.5">
                {mockPortfolioHistory.map((d, i) => (
                  <div key={i} className="flex flex-1 flex-col justify-end">
                    <div
                      className="w-full bg-blue-500"
                      style={{
                        height: `${((d.value - chartMin) / chartRange) * 100}%`,
                        minHeight: "2px",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">Jan 2</span>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">
                    +
                    {(
                      ((mockPortfolioHistory[mockPortfolioHistory.length - 1]
                        .value -
                        mockPortfolioHistory[0].value) /
                        mockPortfolioHistory[0].value) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                  <span className="text-amber-500">
                    +
                    {(
                      mockPortfolioHistory[mockPortfolioHistory.length - 1]
                        .spy - 100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <span className="text-muted-foreground">Today</span>
              </div>
            </div>
          </GridPanel>

          {/* Daily P&L History */}
          <GridPanel title="Daily P&L History" className="shrink-0">
            <div className="space-y-0">
              <div className="flex items-center gap-2 border-b pb-1 text-[10px] text-muted-foreground">
                <span className="flex-1">DATE</span>
                <span className="w-20 text-right">NAV</span>
                <span className="w-16 text-right">P&L</span>
              </div>
              {mockPortfolioHistory
                .slice()
                .reverse()
                .slice(0, 5)
                .map((h, i, arr) => {
                  const prevValue = arr[i + 1]?.value ?? h.value
                  const dayPnl = h.value - prevValue
                  const dayPnlPct = (dayPnl / prevValue) * 100
                  return (
                    <div
                      key={h.date}
                      className="flex items-center gap-2 py-1 text-xs"
                    >
                      <span className="flex-1 font-mono text-muted-foreground">
                        {h.date.slice(5)}
                      </span>
                      <span className="w-20 text-right font-mono">
                        {formatCurrency(h.value)}
                      </span>
                      <span
                        className={cn(
                          "w-16 text-right font-mono",
                          dayPnl >= 0 ? "text-emerald-500" : "text-rose-500"
                        )}
                      >
                        {dayPnl >= 0 ? "+" : ""}
                        {formatCurrency(dayPnl)}
                      </span>
                    </div>
                  )
                })}
            </div>
          </GridPanel>

          {/* Quick Stats */}
          <GridPanel title="Performance Metrics" className="shrink-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-[10px] text-muted-foreground">
                  YTD Return
                </div>
                <div className="font-mono text-emerald-500">+16.2%</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">
                  vs Benchmark
                </div>
                <div className="font-mono text-emerald-500">+6.4%</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">
                  Win Rate
                </div>
                <div className="font-mono">68%</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">
                  Profit Factor
                </div>
                <div className="font-mono">2.4</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">Avg Win</div>
                <div className="font-mono text-emerald-500">+$2,450</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">
                  Avg Loss
                </div>
                <div className="font-mono text-rose-500">-$1,020</div>
              </div>
            </div>
          </GridPanel>

          {/* Notifications */}
          <GridPanel
            title="Recent Notifications"
            actions={<span className="text-[10px] text-amber-500">2 new</span>}
            className="flex-1"
          >
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded border border-amber-500/30 bg-amber-500/5 p-2">
                <Warning size={14} className="mt-0.5 text-amber-500" />
                <div>
                  <p className="text-xs font-medium">
                    NVDA approaching stop-loss
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    $78.34 away from $800.00 trigger
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    2 min ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded border p-2">
                <TrendUp size={14} className="mt-0.5 text-emerald-500" />
                <div>
                  <p className="text-xs font-medium">
                    AAPL hit new 52-week high
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Touched $199.62 intraday
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    15 min ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded border p-2">
                <Target size={14} className="mt-0.5 text-blue-500" />
                <div>
                  <p className="text-xs font-medium">
                    TSLA short P&L target reached
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Unrealized gain: +$369.75
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </GridPanel>
        </div>
      </div>

      {/* Activity Log */}
      <GridPanel
        title="Activity Log"
        collapsible
        collapsedSummary={
          <span className="text-emerald-500">BUY AAPL x50 @ $189.20</span>
        }
        className="h-32"
      >
        <div className="space-y-0.5 font-mono text-[11px]">
          {mockActivity.map((log, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <span className="text-muted-foreground/50">{log.time}</span>
              {log.action === "DIV" ? (
                <>
                  <span className="text-purple-500">{log.action}</span>
                  <span className="text-foreground">{log.symbol}</span>
                  <span>received ${log.price.toFixed(2)}</span>
                </>
              ) : (
                <>
                  <span
                    className={
                      log.action === "BUY"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }
                  >
                    {log.action}
                  </span>
                  <span className="text-foreground">{log.symbol}</span>
                  <span>x{log.qty}</span>
                  <span>@ ${log.price.toFixed(2)}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </GridPanel>

      {/* Add Position Modal Placeholder */}
      {showAddPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="w-96 border bg-card p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono font-semibold">Add Position</h3>
              <button
                onClick={() => setShowAddPosition(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">
                  TICKER SYMBOL
                </label>
                <Input placeholder="AAPL" className="h-8" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] text-muted-foreground">
                    SHARES
                  </label>
                  <Input placeholder="100" type="number" className="h-8" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-muted-foreground">
                    AVG COST
                  </label>
                  <Input
                    placeholder="150.00"
                    type="number"
                    step="0.01"
                    className="h-8"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">
                  POSITION TYPE
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 rounded bg-emerald-500/20 py-2 text-xs font-medium text-emerald-500">
                    LONG
                  </button>
                  <button className="flex-1 rounded bg-muted py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                    SHORT
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddPosition(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setShowAddPosition(false)}
                >
                  Add Position
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Alert Modal Placeholder */}
      {showAddAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="w-96 border bg-card p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono font-semibold">Add Alert</h3>
              <button
                onClick={() => setShowAddAlert(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">
                  SELECT POSITION
                </label>
                <select className="h-8 w-full rounded-none border bg-transparent px-2 text-xs">
                  <option value="">Select a position...</option>
                  {mockPositions.map((pos) => (
                    <option key={pos.symbol} value={pos.symbol}>
                      {pos.symbol} - {pos.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] text-muted-foreground">
                  ALERT TYPE
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 rounded bg-blue-500/20 py-2 text-xs font-medium text-blue-500">
                    Price Target
                  </button>
                  <button className="flex-1 rounded bg-muted py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                    Stop Loss
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] text-muted-foreground">
                    TRIGGER PRICE
                  </label>
                  <Input
                    placeholder="200.00"
                    type="number"
                    step="0.01"
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-muted-foreground">
                    DIRECTION
                  </label>
                  <select className="h-8 w-full rounded-none border bg-transparent px-2 text-xs">
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddAlert(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setShowAddAlert(false)}
                >
                  Create Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
