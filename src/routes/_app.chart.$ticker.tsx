import {
	Buildings,
	ChartBar,
	ChartLine,
	ChartPieSlice,
	Gauge,
	Money,
	Pulse,
	Target,
	Users,
} from "@phosphor-icons/react"
import { createFileRoute, useParams } from "@tanstack/react-router"
import { useState } from "react"
import { GridPanel } from "@/components/layout/grid"
import { cn } from "@/lib/utils"

// Mock data for stock analysis
const mockStockData = {
	AAPL: {
		name: "Apple Inc.",
		price: 189.84,
		change: 1.23,
		changePercent: 0.65,
		marketCap: 2950,
		float: 15.2,
		sharesOutstanding: 15.4,
		beta: 1.18,
		high52: 199.62,
		low52: 124.17,
		avgVolume: 54.2,
		peTTM: 31.2,
		peForward: 28.5,
		ps: 7.8,
		pb: 48.5,
		evEbitda: 24.3,
		revenueGrowthYoY: 8.1,
		revenueGrowthQoQ: 2.3,
		epsGrowth: 12.3,
		grossMargin: 45.2,
		netMargin: 25.8,
		roe: 160.1,
		roa: 22.4,
		roic: 35.6,
		totalDebt: 105.8,
		cash: 162.1,
		freeCashFlow: 99.8,
	},
}

// Mock options data
const mockOptionsData = {
	putCallRatio: 0.72,
	unusualActivity: true,
	maxPain: 190,
	gammaExposure: 2.45,
	volumePuts: 125000,
	volumeCalls: 173000,
	oiPuts: 2450000,
	oiCalls: 3120000,
}

// Mock analyst ratings
const mockAnalystRatings = {
	buy: 28,
	hold: 12,
	sell: 2,
	priceTarget: {
		high: 250,
		low: 160,
		mean: 210,
		current: 189.84,
	},
}

// Mock quant factors (0-100 percentile within sector)
const mockQuantFactors = {
	momentum1M: 78,
	momentum3M: 82,
	momentum6M: 85,
	value: 42,
	quality: 95,
	lowVolatility: 35,
	growth: 68,
}

const timeframes = [
	{ label: "1D", value: "1d" },
	{ label: "5D", value: "5d" },
	{ label: "1M", value: "1m" },
	{ label: "3M", value: "3m" },
	{ label: "6M", value: "6m" },
	{ label: "YTD", value: "ytd" },
	{ label: "1Y", value: "1y" },
	{ label: "2Y", value: "2y" },
	{ label: "5Y", value: "5y" },
]

const overlayIndicators = [
	{ id: "sma20", label: "SMA 20", active: false },
	{ id: "sma50", label: "SMA 50", active: true },
	{ id: "sma200", label: "SMA 200", active: true },
	{ id: "ema9", label: "EMA 9", active: false },
	{ id: "ema21", label: "EMA 21", active: false },
	{ id: "bb", label: "Bollinger Bands", active: false },
	{ id: "vwap", label: "VWAP", active: true },
	{ id: "ichimoku", label: "Ichimoku Cloud", active: false },
	{ id: "pivot", label: "Pivot Points", active: false },
]

const subChartIndicators = [
	{ id: "rsi", label: "RSI (14)", active: true },
	{ id: "macd", label: "MACD", active: false },
	{ id: "stoch", label: "Stochastic", active: false },
	{ id: "atr", label: "ATR", active: false },
	{ id: "obv", label: "OBV", active: false },
]

// Mock candles for chart
const _mockCandles = Array.from({ length: 50 }, (_, i) => {
	const base = 185 + Math.random() * 15
	const open = base
	const close = base + (Math.random() - 0.5) * 3
	const high = Math.max(open, close) + Math.random() * 1.5
	const low = Math.min(open, close) - Math.random() * 1.5
	const volume = Math.floor(20 + Math.random() * 60)
	return {
		time: `09:${String(30 + Math.floor(i / 5)).padStart(2, "0")}`,
		o: open,
		h: high,
		l: low,
		c: close,
		vol: `${volume}M`,
	}
})

export const Route = createFileRoute("/_app/chart/$ticker")({
	component: ChartTickerPage,
})

function ChartTickerPage() {
	const params = useParams({ from: "/chart/$ticker" })
	const ticker = params.ticker?.toUpperCase() ?? "AAPL"
	const data =
		mockStockData[ticker as keyof typeof mockStockData] ?? mockStockData.AAPL

	const [selectedTimeframe, setSelectedTimeframe] = useState("1d")
	const [activeOverlays, setActiveOverlays] = useState<string[]>([
		"sma50",
		"sma200",
		"vwap",
	])
	const [activeSubCharts, setActiveSubCharts] = useState<string[]>(["rsi"])
	const [_showFundamentals, _setShowFundamentals] = useState(true)

	const toggleOverlay = (id: string) => {
		setActiveOverlays((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		)
	}

	const toggleSubChart = (id: string) => {
		setActiveSubCharts((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		)
	}

	const totalRatings =
		mockAnalystRatings.buy + mockAnalystRatings.hold + mockAnalystRatings.sell
	const buyPercent = (mockAnalystRatings.buy / totalRatings) * 100
	const holdPercent = (mockAnalystRatings.hold / totalRatings) * 100
	const sellPercent = (mockAnalystRatings.sell / totalRatings) * 100

	return (
		<div className="flex h-full flex-col gap-1 overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between border bg-card px-3 py-2">
				<div className="flex items-center gap-4">
					<div className="flex items-baseline gap-2">
						<span className="font-mono text-lg font-bold">{ticker}</span>
						<span className="text-xs text-muted-foreground">{data.name}</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="font-mono text-lg">${data.price.toFixed(2)}</span>
						<span
							className={cn(
								"font-mono text-sm",
								data.change >= 0 ? "text-emerald-500" : "text-rose-500",
							)}
						>
							{data.change >= 0 ? "+" : ""}
							{data.change.toFixed(2)} ({data.changePercent >= 0 ? "+" : ""}
							{data.changePercent}%)
						</span>
					</div>
				</div>
				<div className="flex items-center gap-1">
					{timeframes.map((tf) => (
						<button
							key={tf.value}
							onClick={() => setSelectedTimeframe(tf.value)}
							className={cn(
								"h-6 px-2 text-[10px] font-medium transition-all",
								selectedTimeframe === tf.value
									? "bg-foreground/10 text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{tf.label}
						</button>
					))}
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 gap-1 overflow-hidden">
				{/* Left - Chart Area */}
				<div className="flex flex-1 flex-col gap-1">
					{/* Chart Panel */}
					<GridPanel
						title="Price Chart"
						actions={
							<div className="flex items-center gap-2">
								<span className="text-[10px] text-muted-foreground">
									{activeOverlays.length} overlays
								</span>
								<span className="text-[10px] text-muted-foreground">
									{activeSubCharts.length} indicators
								</span>
							</div>
						}
						className="flex-1"
					>
						{/* Chart Placeholder */}
						<div className="relative flex h-full flex-col">
							{/* Chart Area */}
							<div className="flex-1 bg-muted/20">
								<div className="flex h-full flex-col items-center justify-center">
									<ChartLine size={48} className="text-muted-foreground/20" />
									<div className="mt-2 font-mono text-xs text-muted-foreground">
										{ticker} — {selectedTimeframe.toUpperCase()}
									</div>
									<div className="mt-1 text-[10px] text-muted-foreground/60">
										TradingView Lightweight Charts placeholder
									</div>
									<div className="mt-4 flex gap-2">
										{activeOverlays.map((overlay) => (
											<span
												key={overlay}
												className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[9px] text-blue-500"
											>
												{overlayIndicators.find((i) => i.id === overlay)?.label}
											</span>
										))}
									</div>
								</div>
							</div>

							{/* Sub-chart indicators area */}
							{activeSubCharts.length > 0 && (
								<div className="h-24 border-t">
									<div className="flex h-full items-center justify-center">
										<div className="flex gap-2">
											{activeSubCharts.map((ind) => (
												<span
													key={ind}
													className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] text-purple-500"
												>
													{subChartIndicators.find((i) => i.id === ind)?.label}
												</span>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					</GridPanel>

					{/* Indicator Controls */}
					<GridPanel title="Indicators" className="shrink-0" collapsible>
						<div className="space-y-3">
							{/* Overlay Indicators */}
							<div>
								<div className="mb-1.5 text-[10px] font-medium text-muted-foreground">
									OVERLAYS
								</div>
								<div className="flex flex-wrap gap-1">
									{overlayIndicators.map((ind) => (
										<button
											key={ind.id}
											onClick={() => toggleOverlay(ind.id)}
											className={cn(
												"rounded px-2 py-1 text-[10px] transition-colors",
												activeOverlays.includes(ind.id)
													? "bg-blue-500/20 text-blue-500"
													: "bg-muted text-muted-foreground hover:text-foreground",
											)}
										>
											{ind.label}
										</button>
									))}
								</div>
							</div>

							{/* Sub-chart Indicators */}
							<div>
								<div className="mb-1.5 text-[10px] font-medium text-muted-foreground">
									SUB-CHARTS
								</div>
								<div className="flex flex-wrap gap-1">
									{subChartIndicators.map((ind) => (
										<button
											key={ind.id}
											onClick={() => toggleSubChart(ind.id)}
											className={cn(
												"rounded px-2 py-1 text-[10px] transition-colors",
												activeSubCharts.includes(ind.id)
													? "bg-purple-500/20 text-purple-500"
													: "bg-muted text-muted-foreground hover:text-foreground",
											)}
										>
											{ind.label}
										</button>
									))}
								</div>
							</div>

							{/* Drawing Tools */}
							<div>
								<div className="mb-1.5 text-[10px] font-medium text-muted-foreground">
									DRAWING TOOLS
								</div>
								<div className="flex gap-1">
									{[
										"Trendline",
										"Horizontal",
										"Fibonacci",
										"Rectangle",
										"Text",
									].map((tool) => (
										<button
											key={tool}
											className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground"
										>
											{tool}
										</button>
									))}
								</div>
							</div>
						</div>
					</GridPanel>
				</div>

				{/* Right - Analysis Panels */}
				<div className="flex w-80 flex-col gap-1">
					{/* Key Stats */}
					<GridPanel
						title="Key Statistics"
						actions={
							<span className="text-[10px] text-muted-foreground">
								<Buildings size={10} className="mr-1 inline" />
								{data.marketCap}B
							</span>
						}
						className="shrink-0"
					>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div>
								<div className="text-[10px] text-muted-foreground">Float</div>
								<div className="font-mono">{data.float}B</div>
							</div>
							<div>
								<div className="text-[10px] text-muted-foreground">
									Shares Out
								</div>
								<div className="font-mono">{data.sharesOutstanding}B</div>
							</div>
							<div>
								<div className="text-[10px] text-muted-foreground">Beta</div>
								<div className="font-mono">{data.beta}</div>
							</div>
							<div>
								<div className="text-[10px] text-muted-foreground">
									Avg Volume
								</div>
								<div className="font-mono">{data.avgVolume}M</div>
							</div>
							<div className="col-span-2">
								<div className="text-[10px] text-muted-foreground">
									52W Range
								</div>
								<div className="flex items-center gap-2">
									<span className="font-mono text-[10px]">${data.low52}</span>
									<div className="h-1.5 flex-1 rounded-full bg-muted">
										<div
											className="h-full rounded-full bg-blue-500"
											style={{
												width: `${((data.price - data.low52) / (data.high52 - data.low52)) * 100}%`,
											}}
										/>
									</div>
									<span className="font-mono text-[10px]">${data.high52}</span>
								</div>
							</div>
						</div>
					</GridPanel>

					{/* Valuation */}
					<GridPanel
						title="Valuation"
						actions={<Money size={10} className="text-muted-foreground" />}
						className="shrink-0"
					>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div>
								<div className="text-[10px] text-muted-foreground">
									P/E (TTM)
								</div>
								<div className="font-mono">{data.peTTM}</div>
							</div>
							<div>
								<div className="text-[10px] text-muted-foreground">
									P/E (Forward)
								</div>
								<div className="font-mono">{data.peForward}</div>
							</div>
							<div>
								<div className="text-[10px] text-muted-foreground">P/S</div>
								<div className="font-mono">{data.ps}</div>
							</div>
							<div>
								<div className="text-[10px] text-muted-foreground">P/B</div>
								<div className="font-mono">{data.pb}</div>
							</div>
							<div className="col-span-2">
								<div className="text-[10px] text-muted-foreground">
									EV/EBITDA
								</div>
								<div className="font-mono">{data.evEbitda}</div>
							</div>
						</div>
					</GridPanel>

					{/* Growth & Margins */}
					<GridPanel
						title="Growth & Margins"
						actions={<ChartBar size={10} className="text-muted-foreground" />}
						className="shrink-0"
					>
						<div className="space-y-2 text-xs">
							<div className="grid grid-cols-2 gap-2">
								<div>
									<div className="text-[10px] text-muted-foreground">
										Rev Growth YoY
									</div>
									<div
										className={cn(
											"font-mono",
											data.revenueGrowthYoY >= 0
												? "text-emerald-500"
												: "text-rose-500",
										)}
									>
										{data.revenueGrowthYoY >= 0 ? "+" : ""}
										{data.revenueGrowthYoY}%
									</div>
								</div>
								<div>
									<div className="text-[10px] text-muted-foreground">
										Rev Growth QoQ
									</div>
									<div
										className={cn(
											"font-mono",
											data.revenueGrowthQoQ >= 0
												? "text-emerald-500"
												: "text-rose-500",
										)}
									>
										{data.revenueGrowthQoQ >= 0 ? "+" : ""}
										{data.revenueGrowthQoQ}%
									</div>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<div>
									<div className="text-[10px] text-muted-foreground">
										Gross Margin
									</div>
									<div className="font-mono">{data.grossMargin}%</div>
								</div>
								<div>
									<div className="text-[10px] text-muted-foreground">
										Net Margin
									</div>
									<div className="font-mono">{data.netMargin}%</div>
								</div>
							</div>
							<div className="grid grid-cols-3 gap-1 text-[10px]">
								<div>
									<div className="text-muted-foreground">ROE</div>
									<div className="font-mono">{data.roe}%</div>
								</div>
								<div>
									<div className="text-muted-foreground">ROA</div>
									<div className="font-mono">{data.roa}%</div>
								</div>
								<div>
									<div className="text-muted-foreground">ROIC</div>
									<div className="font-mono">{data.roic}%</div>
								</div>
							</div>
						</div>
					</GridPanel>

					{/* Balance Sheet */}
					<GridPanel
						title="Balance Sheet"
						actions={<Pulse size={10} className="text-muted-foreground" />}
						className="shrink-0"
					>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div>
								<div className="text-[10px] text-muted-foreground">
									Total Debt
								</div>
								<div className="font-mono">${data.totalDebt}B</div>
							</div>
							<div>
								<div className="text-[10px] text-muted-foreground">Cash</div>
								<div className="font-mono text-emerald-500">${data.cash}B</div>
							</div>
							<div className="col-span-2">
								<div className="text-[10px] text-muted-foreground">
									Free Cash Flow
								</div>
								<div className="font-mono text-emerald-500">
									${data.freeCashFlow}B
								</div>
							</div>
						</div>
					</GridPanel>

					{/* Options Flow */}
					<GridPanel
						title="Options Flow"
						actions={
							<span className="text-[10px] text-muted-foreground">
								P/C: {mockOptionsData.putCallRatio}
							</span>
						}
						className="shrink-0"
					>
						<div className="space-y-2 text-xs">
							<div className="flex items-center justify-between">
								<span className="text-[10px] text-muted-foreground">
									Max Pain
								</span>
								<span className="font-mono">${mockOptionsData.maxPain}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[10px] text-muted-foreground">
									Gamma Exposure
								</span>
								<span className="font-mono">
									{mockOptionsData.gammaExposure}M
								</span>
							</div>
							<div className="grid grid-cols-2 gap-2 text-[10px]">
								<div>
									<div className="text-muted-foreground">Volume</div>
									<div className="font-mono">
										<span className="text-emerald-500">
											{mockOptionsData.volumeCalls}C
										</span>{" "}
										<span className="text-rose-500">
											{mockOptionsData.volumePuts}P
										</span>
									</div>
								</div>
								<div>
									<div className="text-muted-foreground">Open Interest</div>
									<div className="font-mono">
										<span className="text-emerald-500">
											{(mockOptionsData.oiCalls / 1000000).toFixed(1)}MC
										</span>{" "}
										<span className="text-rose-500">
											{(mockOptionsData.oiPuts / 1000000).toFixed(1)}MP
										</span>
									</div>
								</div>
							</div>
							{mockOptionsData.unusualActivity && (
								<div className="rounded bg-amber-500/20 px-2 py-1 text-center text-[10px] text-amber-500">
									Unusual Activity Detected
								</div>
							)}
						</div>
					</GridPanel>

					{/* Analyst Ratings */}
					<GridPanel
						title="Analyst Ratings"
						actions={<Users size={10} className="text-muted-foreground" />}
						className="shrink-0"
					>
						<div className="space-y-2">
							{/* Rating bar */}
							<div className="flex h-2 overflow-hidden rounded-full">
								<div
									className="bg-emerald-500"
									style={{ width: `${buyPercent}%` }}
								/>
								<div
									className="bg-amber-500"
									style={{ width: `${holdPercent}%` }}
								/>
								<div
									className="bg-rose-500"
									style={{ width: `${sellPercent}%` }}
								/>
							</div>
							<div className="flex justify-between text-[10px]">
								<span className="text-emerald-500">
									Buy {mockAnalystRatings.buy}
								</span>
								<span className="text-amber-500">
									Hold {mockAnalystRatings.hold}
								</span>
								<span className="text-rose-500">
									Sell {mockAnalystRatings.sell}
								</span>
							</div>

							{/* Price Target */}
							<div className="border-t pt-2">
								<div className="mb-1 text-[10px] text-muted-foreground">
									Price Target
								</div>
								<div className="flex items-center justify-between text-xs">
									<span className="font-mono text-rose-500">
										${mockAnalystRatings.priceTarget.low}
									</span>
									<span className="font-mono font-bold">
										${mockAnalystRatings.priceTarget.mean}
									</span>
									<span className="font-mono text-emerald-500">
										${mockAnalystRatings.priceTarget.high}
									</span>
								</div>
								<div className="mt-1 flex items-center gap-1">
									<Target size={10} className="text-muted-foreground" />
									<span className="text-[10px] text-muted-foreground">
										Current vs Mean:{" "}
										{(
											((mockAnalystRatings.priceTarget.current -
												mockAnalystRatings.priceTarget.mean) /
												mockAnalystRatings.priceTarget.mean) *
											100
										).toFixed(1)}
										%
									</span>
								</div>
							</div>
						</div>
					</GridPanel>

					{/* Quant Factors */}
					<GridPanel
						title="Quant Factors"
						actions={<Gauge size={10} className="text-muted-foreground" />}
						className="flex-1"
					>
						<div className="space-y-2">
							<div className="text-[10px] text-muted-foreground">
								Percentile rank within sector (0-100)
							</div>

							{/* Factor bars */}
							<div className="space-y-1.5">
								{[
									{
										label: "Momentum 1M",
										value: mockQuantFactors.momentum1M,
										color: "bg-blue-500",
									},
									{
										label: "Momentum 3M",
										value: mockQuantFactors.momentum3M,
										color: "bg-blue-500",
									},
									{
										label: "Momentum 6M",
										value: mockQuantFactors.momentum6M,
										color: "bg-blue-500",
									},
									{
										label: "Value",
										value: mockQuantFactors.value,
										color: "bg-emerald-500",
									},
									{
										label: "Quality",
										value: mockQuantFactors.quality,
										color: "bg-purple-500",
									},
									{
										label: "Low Vol",
										value: mockQuantFactors.lowVolatility,
										color: "bg-amber-500",
									},
									{
										label: "Growth",
										value: mockQuantFactors.growth,
										color: "bg-rose-500",
									},
								].map((factor) => (
									<div key={factor.label}>
										<div className="flex items-center justify-between text-[10px]">
											<span className="text-muted-foreground">
												{factor.label}
											</span>
											<span className="font-mono">{factor.value}</span>
										</div>
										<div className="h-1.5 rounded-full bg-muted">
											<div
												className={cn("h-full rounded-full", factor.color)}
												style={{ width: `${factor.value}%` }}
											/>
										</div>
									</div>
								))}
							</div>

							{/* Radar chart placeholder */}
							<div className="mt-3 flex items-center justify-center rounded border border-dashed border-muted py-4">
								<ChartPieSlice size={24} className="text-muted-foreground/30" />
							</div>
						</div>
					</GridPanel>
				</div>
			</div>
		</div>
	)
}
