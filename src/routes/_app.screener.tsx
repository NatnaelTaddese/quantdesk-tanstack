import {
	ChartLine,
	Code,
	CurrencyDollar,
	Export,
	FloppyDisk,
	Gauge,
	Plus,
	SortAscending,
	SortDescending,
	Upload,
} from "@phosphor-icons/react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { GridPanel } from "@/components/layout/grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Mock data for screener results
const mockScreenerData = [
	{
		symbol: "NVDA",
		name: "NVIDIA Corp.",
		price: 878.34,
		change: 3.12,
		marketCap: 2180,
		pe: 72.5,
		pb: 45.2,
		epsGrowth: 125.4,
		revenueGrowth: 122.4,
		debtEquity: 0.41,
		dividendYield: 0.02,
		sector: "Technology",
		industry: "Semiconductors",
		rsi: 68,
		sma20: 845.2,
		sma50: 780.5,
		sma200: 520.3,
		macdCrossover: "bullish",
		high52Week: 974.0,
		low52Week: 222.97,
		volumeRatio: 1.8,
		atr: 32.5,
		bbSqueeze: false,
		momentumScore: 92,
		valueScore: 25,
		qualityScore: 88,
	},
	{
		symbol: "AAPL",
		name: "Apple Inc.",
		price: 189.84,
		change: 1.23,
		marketCap: 2950,
		pe: 31.2,
		pb: 48.5,
		epsGrowth: 12.3,
		revenueGrowth: 8.1,
		debtEquity: 1.52,
		dividendYield: 0.51,
		sector: "Technology",
		industry: "Consumer Electronics",
		rsi: 55,
		sma20: 185.4,
		sma50: 178.2,
		sma200: 165.8,
		macdCrossover: "none",
		high52Week: 199.62,
		low52Week: 124.17,
		volumeRatio: 0.9,
		atr: 4.2,
		bbSqueeze: true,
		momentumScore: 65,
		valueScore: 42,
		qualityScore: 95,
	},
	{
		symbol: "MSFT",
		name: "Microsoft Corp.",
		price: 415.56,
		change: -0.45,
		marketCap: 3090,
		pe: 36.8,
		pb: 13.2,
		epsGrowth: 18.5,
		revenueGrowth: 15.2,
		debtEquity: 0.35,
		dividendYield: 0.72,
		sector: "Technology",
		industry: "Software",
		rsi: 48,
		sma20: 420.3,
		sma50: 405.1,
		sma200: 365.4,
		macdCrossover: "bearish",
		high52Week: 430.82,
		low52Week: 309.45,
		volumeRatio: 1.1,
		atr: 8.5,
		bbSqueeze: false,
		momentumScore: 58,
		valueScore: 38,
		qualityScore: 92,
	},
	{
		symbol: "AMZN",
		name: "Amazon.com",
		price: 178.25,
		change: 0.67,
		marketCap: 1850,
		pe: 62.4,
		pb: 8.9,
		epsGrowth: 245.2,
		revenueGrowth: 12.5,
		debtEquity: 0.58,
		dividendYield: 0,
		sector: "Consumer",
		industry: "E-Commerce",
		rsi: 52,
		sma20: 175.8,
		sma50: 168.3,
		sma200: 145.2,
		macdCrossover: "none",
		high52Week: 189.77,
		low52Week: 101.26,
		volumeRatio: 1.2,
		atr: 5.8,
		bbSqueeze: false,
		momentumScore: 62,
		valueScore: 28,
		qualityScore: 78,
	},
	{
		symbol: "GOOGL",
		name: "Alphabet Inc.",
		price: 155.72,
		change: -0.89,
		marketCap: 1920,
		pe: 25.4,
		pb: 6.8,
		epsGrowth: 32.1,
		revenueGrowth: 13.5,
		debtEquity: 0.11,
		dividendYield: 0,
		sector: "Technology",
		industry: "Internet Services",
		rsi: 42,
		sma20: 158.4,
		sma50: 152.3,
		sma200: 138.5,
		macdCrossover: "bearish",
		high52Week: 191.75,
		low52Week: 102.21,
		volumeRatio: 0.8,
		atr: 4.1,
		bbSqueeze: true,
		momentumScore: 45,
		valueScore: 55,
		qualityScore: 85,
	},
	{
		symbol: "META",
		name: "Meta Platforms",
		price: 502.3,
		change: 1.56,
		marketCap: 1280,
		pe: 28.9,
		pb: 8.2,
		epsGrowth: 73.2,
		revenueGrowth: 24.7,
		debtEquity: 0.18,
		dividendYield: 0.4,
		sector: "Technology",
		industry: "Social Media",
		rsi: 61,
		sma20: 495.2,
		sma50: 475.8,
		sma200: 380.4,
		macdCrossover: "bullish",
		high52Week: 542.81,
		low52Week: 274.38,
		volumeRatio: 1.4,
		atr: 15.2,
		bbSqueeze: false,
		momentumScore: 78,
		valueScore: 48,
		qualityScore: 82,
	},
	{
		symbol: "TSLA",
		name: "Tesla Inc.",
		price: 175.21,
		change: -2.34,
		marketCap: 558,
		pe: 42.8,
		pb: 9.5,
		epsGrowth: -23.5,
		revenueGrowth: 3.5,
		debtEquity: 0.12,
		dividendYield: 0,
		sector: "Consumer",
		industry: "Auto Manufacturers",
		rsi: 35,
		sma20: 185.4,
		sma50: 195.2,
		sma200: 220.5,
		macdCrossover: "bearish",
		high52Week: 299.29,
		low52Week: 138.8,
		volumeRatio: 2.1,
		atr: 12.8,
		bbSqueeze: false,
		momentumScore: 28,
		valueScore: 32,
		qualityScore: 65,
	},
	{
		symbol: "JPM",
		name: "JPMorgan Chase",
		price: 198.45,
		change: 0.32,
		marketCap: 572,
		pe: 11.2,
		pb: 1.8,
		epsGrowth: 8.2,
		revenueGrowth: 12.4,
		debtEquity: 1.25,
		dividendYield: 2.28,
		sector: "Financials",
		industry: "Banks",
		rsi: 58,
		sma20: 195.3,
		sma50: 188.4,
		sma200: 165.2,
		macdCrossover: "none",
		high52Week: 205.88,
		low52Week: 135.19,
		volumeRatio: 0.95,
		atr: 4.5,
		bbSqueeze: false,
		momentumScore: 72,
		valueScore: 78,
		qualityScore: 88,
	},
	{
		symbol: "V",
		name: "Visa Inc.",
		price: 278.45,
		change: 1.23,
		marketCap: 571,
		pe: 32.1,
		pb: 14.5,
		epsGrowth: 15.8,
		revenueGrowth: 10.2,
		debtEquity: 0.52,
		dividendYield: 0.75,
		sector: "Financials",
		industry: "Credit Services",
		rsi: 62,
		sma20: 275.1,
		sma50: 268.3,
		sma200: 252.4,
		macdCrossover: "bullish",
		high52Week: 290.96,
		low52Week: 227.77,
		volumeRatio: 1.0,
		atr: 5.2,
		bbSqueeze: false,
		momentumScore: 68,
		valueScore: 45,
		qualityScore: 94,
	},
	{
		symbol: "UNH",
		name: "UnitedHealth Group",
		price: 527.8,
		change: 0.85,
		marketCap: 486,
		pe: 21.5,
		pb: 6.2,
		epsGrowth: 12.4,
		revenueGrowth: 14.1,
		debtEquity: 0.72,
		dividendYield: 1.42,
		sector: "Healthcare",
		industry: "Health Insurance",
		rsi: 54,
		sma20: 522.4,
		sma50: 515.3,
		sma200: 498.2,
		macdCrossover: "none",
		high52Week: 554.7,
		low52Week: 436.38,
		volumeRatio: 0.85,
		atr: 12.1,
		bbSqueeze: true,
		momentumScore: 55,
		valueScore: 62,
		qualityScore: 90,
	},
	{
		symbol: "LLY",
		name: "Eli Lilly",
		price: 752.34,
		change: 2.89,
		marketCap: 714,
		pe: 112.4,
		pb: 52.8,
		epsGrowth: 58.9,
		revenueGrowth: 28.5,
		debtEquity: 1.85,
		dividendYield: 0.65,
		sector: "Healthcare",
		industry: "Pharmaceuticals",
		rsi: 71,
		sma20: 735.2,
		sma50: 695.4,
		sma200: 580.3,
		macdCrossover: "bullish",
		high52Week: 800.78,
		low52Week: 411.32,
		volumeRatio: 1.5,
		atr: 22.4,
		bbSqueeze: false,
		momentumScore: 88,
		valueScore: 15,
		qualityScore: 85,
	},
	{
		symbol: "AVGO",
		name: "Broadcom Inc.",
		price: 1345.67,
		change: 2.34,
		marketCap: 625,
		pe: 56.7,
		pb: 12.4,
		epsGrowth: 42.1,
		revenueGrowth: 34.2,
		debtEquity: 1.64,
		dividendYield: 1.55,
		sector: "Technology",
		industry: "Semiconductors",
		rsi: 65,
		sma20: 1320.4,
		sma50: 1245.8,
		sma200: 980.5,
		macdCrossover: "bullish",
		high52Week: 1438.17,
		low52Week: 795.91,
		volumeRatio: 1.3,
		atr: 45.2,
		bbSqueeze: false,
		momentumScore: 82,
		valueScore: 35,
		qualityScore: 80,
	},
	{
		symbol: "XOM",
		name: "Exxon Mobil",
		price: 108.25,
		change: -0.52,
		marketCap: 432,
		pe: 12.8,
		pb: 2.1,
		epsGrowth: -15.2,
		revenueGrowth: -8.5,
		debtEquity: 0.21,
		dividendYield: 3.45,
		sector: "Energy",
		industry: "Oil & Gas",
		rsi: 45,
		sma20: 110.2,
		sma50: 112.4,
		sma200: 105.8,
		macdCrossover: "bearish",
		high52Week: 123.75,
		low52Week: 95.77,
		volumeRatio: 0.75,
		atr: 2.8,
		bbSqueeze: false,
		momentumScore: 38,
		valueScore: 72,
		qualityScore: 75,
	},
	{
		symbol: "COST",
		name: "Costco Wholesale",
		price: 712.89,
		change: 1.56,
		marketCap: 316,
		pe: 48.9,
		pb: 14.2,
		epsGrowth: 18.2,
		revenueGrowth: 9.8,
		debtEquity: 0.35,
		dividendYield: 0.58,
		sector: "Consumer",
		industry: "Retail",
		rsi: 59,
		sma20: 705.3,
		sma50: 685.2,
		sma200: 620.4,
		macdCrossover: "none",
		high52Week: 746.96,
		low52Week: 474.32,
		volumeRatio: 0.9,
		atr: 15.8,
		bbSqueeze: false,
		momentumScore: 70,
		valueScore: 28,
		qualityScore: 92,
	},
	{
		symbol: "AMD",
		name: "Advanced Micro Devices",
		price: 178.45,
		change: 4.25,
		marketCap: 288,
		pe: 285.5,
		pb: 4.8,
		epsGrowth: 352.8,
		revenueGrowth: 10.2,
		debtEquity: 0.05,
		dividendYield: 0,
		sector: "Technology",
		industry: "Semiconductors",
		rsi: 72,
		sma20: 168.3,
		sma50: 155.4,
		sma200: 125.8,
		macdCrossover: "bullish",
		high52Week: 227.3,
		low52Week: 93.12,
		volumeRatio: 2.2,
		atr: 8.5,
		bbSqueeze: false,
		momentumScore: 85,
		valueScore: 18,
		qualityScore: 72,
	},
	{
		symbol: "INTC",
		name: "Intel Corp.",
		price: 42.85,
		change: -1.25,
		marketCap: 181,
		pe: 108.2,
		pb: 1.5,
		epsGrowth: -78.5,
		revenueGrowth: -14.2,
		debtEquity: 0.47,
		dividendYield: 1.18,
		sector: "Technology",
		industry: "Semiconductors",
		rsi: 32,
		sma20: 45.2,
		sma50: 48.3,
		sma200: 42.8,
		macdCrossover: "bearish",
		high52Week: 51.28,
		low52Week: 26.86,
		volumeRatio: 1.8,
		atr: 2.1,
		bbSqueeze: false,
		momentumScore: 22,
		valueScore: 58,
		qualityScore: 45,
	},
]

// Saved screens presets
const savedScreens = [
	{
		id: 1,
		name: "High Momentum Tech",
		filters: "sector=Technology, momentumScore>70",
	},
	{ id: 2, name: "Value Dividend Plays", filters: "pe<20, dividendYield>2" },
	{ id: 3, name: "Oversold RSI", filters: "rsi<30" },
	{ id: 4, name: "52W High Breakout", filters: "price>high52Week*0.95" },
]

const universeOptions = [
	{ id: "sp500", name: "S&P 500", count: 500 },
	{ id: "nasdaq100", name: "NASDAQ 100", count: 100 },
	{ id: "russell2000", name: "Russell 2000", count: 2000 },
	{ id: "all", name: "All US Stocks", count: 8500 },
]

const sectors = [
	"Technology",
	"Healthcare",
	"Financials",
	"Consumer",
	"Energy",
	"Industrials",
	"Materials",
	"Utilities",
	"Real Estate",
	"Communications",
]
const industries = [
	"Semiconductors",
	"Software",
	"Consumer Electronics",
	"Banks",
	"Pharmaceuticals",
	"Oil & Gas",
	"Retail",
	"Auto Manufacturers",
	"Internet Services",
]

type SortConfig = {
	key: string
	direction: "asc" | "desc"
}

type FilterCategory = "fundamental" | "technical" | "quant" | "custom"

export const Route = createFileRoute("/_app/screener")({
	component: ScreenerPage,
})

function ScreenerPage() {
	const router = useRouter()
	const [activeFilters, setActiveFilters] =
		useState<FilterCategory>("fundamental")
	const [filtersExpanded, setFiltersExpanded] = useState(true)
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "marketCap",
		direction: "desc",
	})
	const [selectedUniverse, setSelectedUniverse] = useState("sp500")
	const [customExpression, setCustomExpression] = useState("")

	// Filter states
	const [filters, setFilters] = useState({
		// Fundamental
		marketCapMin: "",
		marketCapMax: "",
		peMin: "",
		peMax: "",
		pbMin: "",
		pbMax: "",
		epsGrowthMin: "",
		epsGrowthMax: "",
		revenueGrowthMin: "",
		revenueGrowthMax: "",
		debtEquityMax: "",
		dividendYieldMin: "",
		sector: "",
		industry: "",
		// Technical
		priceAboveSMA: "",
		rsiMin: "",
		rsiMax: "",
		macdCrossover: "",
		high52WeekProximity: "",
		volumeRatioMin: "",
		atrMax: "",
		bbSqueeze: "",
		// Quant
		momentumScoreMin: "",
		valueScoreMin: "",
		qualityScoreMin: "",
	})

	const updateFilter = (key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }))
	}

	// Apply filters to data
	const filteredData = useMemo(() => {
		return mockScreenerData.filter((stock) => {
			// Fundamental filters
			if (
				filters.marketCapMin &&
				stock.marketCap < parseFloat(filters.marketCapMin)
			)
				return false
			if (
				filters.marketCapMax &&
				stock.marketCap > parseFloat(filters.marketCapMax)
			)
				return false
			if (filters.peMin && stock.pe < parseFloat(filters.peMin)) return false
			if (filters.peMax && stock.pe > parseFloat(filters.peMax)) return false
			if (filters.pbMin && stock.pb < parseFloat(filters.pbMin)) return false
			if (filters.pbMax && stock.pb > parseFloat(filters.pbMax)) return false
			if (
				filters.dividendYieldMin &&
				stock.dividendYield < parseFloat(filters.dividendYieldMin)
			)
				return false
			if (
				filters.debtEquityMax &&
				stock.debtEquity > parseFloat(filters.debtEquityMax)
			)
				return false
			if (filters.sector && stock.sector !== filters.sector) return false
			if (filters.industry && stock.industry !== filters.industry) return false
			// Technical filters
			if (filters.rsiMin && stock.rsi < parseFloat(filters.rsiMin)) return false
			if (filters.rsiMax && stock.rsi > parseFloat(filters.rsiMax)) return false
			if (
				filters.volumeRatioMin &&
				stock.volumeRatio < parseFloat(filters.volumeRatioMin)
			)
				return false
			if (
				filters.macdCrossover &&
				filters.macdCrossover !== "all" &&
				stock.macdCrossover !== filters.macdCrossover
			)
				return false
			// Quant filters
			if (
				filters.momentumScoreMin &&
				stock.momentumScore < parseFloat(filters.momentumScoreMin)
			)
				return false
			if (
				filters.valueScoreMin &&
				stock.valueScore < parseFloat(filters.valueScoreMin)
			)
				return false
			if (
				filters.qualityScoreMin &&
				stock.qualityScore < parseFloat(filters.qualityScoreMin)
			)
				return false
			return true
		})
	}, [filters])

	// Sort data
	const sortedData = useMemo(() => {
		return [...filteredData].sort((a, b) => {
			const aVal = a[sortConfig.key as keyof typeof a]
			const bVal = b[sortConfig.key as keyof typeof b]
			if (typeof aVal === "number" && typeof bVal === "number") {
				return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal
			}
			return sortConfig.direction === "asc"
				? String(aVal).localeCompare(String(bVal))
				: String(bVal).localeCompare(String(aVal))
		})
	}, [filteredData, sortConfig])

	const handleSort = (key: string) => {
		setSortConfig((prev) => ({
			key,
			direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
		}))
	}

	const SortIcon = ({ column }: { column: string }) => {
		if (sortConfig.key !== column) return null
		return sortConfig.direction === "desc" ? (
			<SortDescending size={12} className="ml-0.5 inline" />
		) : (
			<SortAscending size={12} className="ml-0.5 inline" />
		)
	}

	const clearFilters = () => {
		setFilters({
			marketCapMin: "",
			marketCapMax: "",
			peMin: "",
			peMax: "",
			pbMin: "",
			pbMax: "",
			epsGrowthMin: "",
			epsGrowthMax: "",
			revenueGrowthMin: "",
			revenueGrowthMax: "",
			debtEquityMax: "",
			dividendYieldMin: "",
			sector: "",
			industry: "",
			priceAboveSMA: "",
			rsiMin: "",
			rsiMax: "",
			macdCrossover: "",
			high52WeekProximity: "",
			volumeRatioMin: "",
			atrMax: "",
			bbSqueeze: "",
			momentumScoreMin: "",
			valueScoreMin: "",
			qualityScoreMin: "",
		})
		setCustomExpression("")
	}

	const activeFilterCount = Object.values(filters).filter(
		(v) => v !== "",
	).length

	return (
		<div className="flex h-full flex-col gap-1">
			{/* Header */}
			<div className="flex items-center justify-between border bg-card px-3 py-2">
				<div className="flex items-center gap-3">
					<span className="font-mono text-sm font-semibold">SCREENER</span>
					<div className="flex items-center gap-1">
						<select
							value={selectedUniverse}
							onChange={(e) => setSelectedUniverse(e.target.value)}
							className="h-6 rounded-none border bg-transparent px-2 text-[10px] text-muted-foreground"
						>
							{universeOptions.map((u) => (
								<option key={u.id} value={u.id}>
									{u.name} ({u.count})
								</option>
							))}
						</select>
						<Button variant="ghost" size="xs" className="h-6 gap-1 text-[10px]">
							<Upload size={10} />
							CSV
						</Button>
					</div>
				</div>
				<div className="flex items-center gap-1.5">
					<Button variant="ghost" size="xs" className="gap-1">
						<FloppyDisk size={14} />
						Save Screen
					</Button>
					<Button variant="ghost" size="xs" className="gap-1">
						<Export size={14} />
						Export
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 gap-1 overflow-hidden">
				{/* Filters Panel */}
				<GridPanel
					title="Filters"
					collapsible
					collapseDirection="horizontal"
					collapsed={!filtersExpanded}
					onCollapsedChange={(c) => setFiltersExpanded(!c)}
					collapsedSummary={
						activeFilterCount > 0 ? (
							<span className="text-blue-500">{activeFilterCount} active</span>
						) : undefined
					}
					className="w-72 shrink-0"
					actions={
						activeFilterCount > 0 ? (
							<button
								onClick={clearFilters}
								className="text-[10px] text-muted-foreground hover:text-foreground"
							>
								Clear all
							</button>
						) : undefined
					}
				>
					{/* Filter Category Tabs */}
					<div className="mb-3 flex gap-1 border-b pb-2">
						{[
							{ key: "fundamental", icon: CurrencyDollar, label: "Fund" },
							{ key: "technical", icon: ChartLine, label: "Tech" },
							{ key: "quant", icon: Gauge, label: "Quant" },
							{ key: "custom", icon: Code, label: "Custom" },
						].map(({ key, icon: Icon, label }) => (
							<button
								key={key}
								onClick={() => setActiveFilters(key as FilterCategory)}
								className={`flex flex-1 flex-col items-center gap-0.5 rounded-sm px-2 py-1 text-[10px] ${
									activeFilters === key
										? "bg-foreground/10 text-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Icon size={14} />
								{label}
							</button>
						))}
					</div>

					{/* Fundamental Filters */}
					{activeFilters === "fundamental" && (
						<div className="space-y-3">
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Market Cap ($B)
								</label>
								<div className="flex gap-1">
									<Input
										placeholder="Min"
										value={filters.marketCapMin}
										onChange={(e) =>
											updateFilter("marketCapMin", e.target.value)
										}
										className="h-6 text-[10px]"
									/>
									<Input
										placeholder="Max"
										value={filters.marketCapMax}
										onChange={(e) =>
											updateFilter("marketCapMax", e.target.value)
										}
										className="h-6 text-[10px]"
									/>
								</div>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									P/E Ratio
								</label>
								<div className="flex gap-1">
									<Input
										placeholder="Min"
										value={filters.peMin}
										onChange={(e) => updateFilter("peMin", e.target.value)}
										className="h-6 text-[10px]"
									/>
									<Input
										placeholder="Max"
										value={filters.peMax}
										onChange={(e) => updateFilter("peMax", e.target.value)}
										className="h-6 text-[10px]"
									/>
								</div>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									P/B Ratio
								</label>
								<div className="flex gap-1">
									<Input
										placeholder="Min"
										value={filters.pbMin}
										onChange={(e) => updateFilter("pbMin", e.target.value)}
										className="h-6 text-[10px]"
									/>
									<Input
										placeholder="Max"
										value={filters.pbMax}
										onChange={(e) => updateFilter("pbMax", e.target.value)}
										className="h-6 text-[10px]"
									/>
								</div>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Dividend Yield (%)
								</label>
								<Input
									placeholder="Min yield"
									value={filters.dividendYieldMin}
									onChange={(e) =>
										updateFilter("dividendYieldMin", e.target.value)
									}
									className="h-6 text-[10px]"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Debt/Equity
								</label>
								<Input
									placeholder="Max"
									value={filters.debtEquityMax}
									onChange={(e) =>
										updateFilter("debtEquityMax", e.target.value)
									}
									className="h-6 text-[10px]"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Sector
								</label>
								<select
									value={filters.sector}
									onChange={(e) => updateFilter("sector", e.target.value)}
									className="h-6 w-full rounded-none border bg-transparent px-2 text-[10px]"
								>
									<option value="">All Sectors</option>
									{sectors.map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Industry
								</label>
								<select
									value={filters.industry}
									onChange={(e) => updateFilter("industry", e.target.value)}
									className="h-6 w-full rounded-none border bg-transparent px-2 text-[10px]"
								>
									<option value="">All Industries</option>
									{industries.map((i) => (
										<option key={i} value={i}>
											{i}
										</option>
									))}
								</select>
							</div>
						</div>
					)}

					{/* Technical Filters */}
					{activeFilters === "technical" && (
						<div className="space-y-3">
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Price vs SMA
								</label>
								<select
									value={filters.priceAboveSMA}
									onChange={(e) =>
										updateFilter("priceAboveSMA", e.target.value)
									}
									className="h-6 w-full rounded-none border bg-transparent px-2 text-[10px]"
								>
									<option value="">Any</option>
									<option value="above20">Above SMA 20</option>
									<option value="above50">Above SMA 50</option>
									<option value="above200">Above SMA 200</option>
									<option value="below20">Below SMA 20</option>
									<option value="below50">Below SMA 50</option>
									<option value="below200">Below SMA 200</option>
								</select>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									RSI (14)
								</label>
								<div className="flex gap-1">
									<Input
										placeholder="Min"
										value={filters.rsiMin}
										onChange={(e) => updateFilter("rsiMin", e.target.value)}
										className="h-6 text-[10px]"
									/>
									<Input
										placeholder="Max"
										value={filters.rsiMax}
										onChange={(e) => updateFilter("rsiMax", e.target.value)}
										className="h-6 text-[10px]"
									/>
								</div>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									MACD Crossover
								</label>
								<select
									value={filters.macdCrossover}
									onChange={(e) =>
										updateFilter("macdCrossover", e.target.value)
									}
									className="h-6 w-full rounded-none border bg-transparent px-2 text-[10px]"
								>
									<option value="">Any</option>
									<option value="bullish">Bullish</option>
									<option value="bearish">Bearish</option>
									<option value="none">None</option>
								</select>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									52W High Proximity
								</label>
								<select
									value={filters.high52WeekProximity}
									onChange={(e) =>
										updateFilter("high52WeekProximity", e.target.value)
									}
									className="h-6 w-full rounded-none border bg-transparent px-2 text-[10px]"
								>
									<option value="">Any</option>
									<option value="5">Within 5%</option>
									<option value="10">Within 10%</option>
									<option value="20">Within 20%</option>
								</select>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Volume Ratio (vs 30d avg)
								</label>
								<Input
									placeholder="Min (e.g. 1.5)"
									value={filters.volumeRatioMin}
									onChange={(e) =>
										updateFilter("volumeRatioMin", e.target.value)
									}
									className="h-6 text-[10px]"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Bollinger Band Squeeze
								</label>
								<select
									value={filters.bbSqueeze}
									onChange={(e) => updateFilter("bbSqueeze", e.target.value)}
									className="h-6 w-full rounded-none border bg-transparent px-2 text-[10px]"
								>
									<option value="">Any</option>
									<option value="true">In Squeeze</option>
									<option value="false">Not in Squeeze</option>
								</select>
							</div>
						</div>
					)}

					{/* Quant Filters */}
					{activeFilters === "quant" && (
						<div className="space-y-3">
							<div className="rounded border border-blue-500/30 bg-blue-500/5 p-2 text-[10px] text-muted-foreground">
								Factor scores are Z-score normalized across the universe (0-100
								scale)
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Momentum Score
								</label>
								<Input
									placeholder="Min (0-100)"
									value={filters.momentumScoreMin}
									onChange={(e) =>
										updateFilter("momentumScoreMin", e.target.value)
									}
									className="h-6 text-[10px]"
								/>
								<div className="mt-1 h-1.5 w-full rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-blue-500"
										style={{ width: `${filters.momentumScoreMin || 0}%` }}
									/>
								</div>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Value Score
								</label>
								<Input
									placeholder="Min (0-100)"
									value={filters.valueScoreMin}
									onChange={(e) =>
										updateFilter("valueScoreMin", e.target.value)
									}
									className="h-6 text-[10px]"
								/>
								<div className="mt-1 h-1.5 w-full rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-emerald-500"
										style={{ width: `${filters.valueScoreMin || 0}%` }}
									/>
								</div>
							</div>
							<div>
								<label className="mb-1 block text-[10px] text-muted-foreground">
									Quality Score
								</label>
								<Input
									placeholder="Min (0-100)"
									value={filters.qualityScoreMin}
									onChange={(e) =>
										updateFilter("qualityScoreMin", e.target.value)
									}
									className="h-6 text-[10px]"
								/>
								<div className="mt-1 h-1.5 w-full rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-purple-500"
										style={{ width: `${filters.qualityScoreMin || 0}%` }}
									/>
								</div>
							</div>
						</div>
					)}

					{/* Custom Expression */}
					{activeFilters === "custom" && (
						<div className="space-y-3">
							<div className="rounded border border-amber-500/30 bg-amber-500/5 p-2 text-[10px] text-muted-foreground">
								Write Python-style filter expressions using available fields
							</div>
							<textarea
								value={customExpression}
								onChange={(e) => setCustomExpression(e.target.value)}
								placeholder="rsi_14 < 30 and price > sma_200"
								className="h-24 w-full rounded-none border bg-transparent p-2 font-mono text-[10px] placeholder:text-muted-foreground"
							/>
							<div className="text-[9px] text-muted-foreground">
								<div className="mb-1 font-medium">Available fields:</div>
								<div className="flex flex-wrap gap-1">
									{[
										"price",
										"rsi_14",
										"sma_20",
										"sma_50",
										"sma_200",
										"volume_ratio",
										"pe",
										"pb",
										"market_cap",
										"momentum_score",
										"value_score",
									].map((f) => (
										<span key={f} className="rounded bg-muted px-1 py-0.5">
											{f}
										</span>
									))}
								</div>
							</div>
							<Button variant="outline" size="xs" className="w-full">
								Apply Expression
							</Button>
						</div>
					)}

					{/* Saved Screens */}
					<div className="mt-4 border-t pt-3">
						<div className="mb-2 flex items-center justify-between text-[10px]">
							<span className="font-medium text-muted-foreground">
								SAVED SCREENS
							</span>
							<button className="text-muted-foreground hover:text-foreground">
								<Plus size={12} />
							</button>
						</div>
						<div className="space-y-1">
							{savedScreens.map((screen) => (
								<button
									key={screen.id}
									className="w-full rounded px-2 py-1 text-left text-[10px] hover:bg-muted"
								>
									<div className="font-medium">{screen.name}</div>
									<div className="truncate text-muted-foreground">
										{screen.filters}
									</div>
								</button>
							))}
						</div>
					</div>
				</GridPanel>

				{/* Results Table */}
				<div className="flex flex-1 flex-col overflow-hidden border bg-card">
					{/* Table Header Info */}
					<div className="flex items-center justify-between border-b px-3 py-1.5 text-[10px]">
						<span className="text-muted-foreground">
							{sortedData.length} results from{" "}
							{universeOptions.find((u) => u.id === selectedUniverse)?.name}
						</span>
						<span className="text-muted-foreground">
							Click row to view chart
						</span>
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
									<th className="px-3 py-1.5 text-left font-medium">NAME</th>
									<th
										className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
										onClick={() => handleSort("price")}
									>
										PRICE <SortIcon column="price" />
									</th>
									<th
										className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
										onClick={() => handleSort("change")}
									>
										CHG% <SortIcon column="change" />
									</th>
									<th
										className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
										onClick={() => handleSort("marketCap")}
									>
										MKT CAP <SortIcon column="marketCap" />
									</th>
									<th
										className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
										onClick={() => handleSort("pe")}
									>
										P/E <SortIcon column="pe" />
									</th>
									<th
										className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
										onClick={() => handleSort("rsi")}
									>
										RSI <SortIcon column="rsi" />
									</th>
									<th
										className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
										onClick={() => handleSort("momentumScore")}
									>
										MOM <SortIcon column="momentumScore" />
									</th>
									<th
										className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
										onClick={() => handleSort("volumeRatio")}
									>
										VOL <SortIcon column="volumeRatio" />
									</th>
									<th className="px-3 py-1.5 text-left font-medium">SECTOR</th>
								</tr>
							</thead>
							<tbody>
								{sortedData.map((row) => (
									<tr
										key={row.symbol}
										className="cursor-pointer border-b border-border/50 hover:bg-foreground/[0.03]"
										onClick={() =>
											router.navigate({ to: `/chart/${row.symbol}` })
										}
									>
										<td className="px-3 py-1.5 font-mono font-medium">
											{row.symbol}
										</td>
										<td className="max-w-[150px] truncate px-3 py-1.5 text-muted-foreground">
											{row.name}
										</td>
										<td className="px-3 py-1.5 text-right font-mono">
											${row.price.toFixed(2)}
										</td>
										<td
											className={`px-3 py-1.5 text-right font-mono ${
												row.change >= 0 ? "text-emerald-500" : "text-rose-500"
											}`}
										>
											{row.change >= 0 ? "+" : ""}
											{row.change.toFixed(2)}%
										</td>
										<td className="px-3 py-1.5 text-right font-mono">
											${row.marketCap}B
										</td>
										<td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
											{row.pe.toFixed(1)}
										</td>
										<td className="px-3 py-1.5 text-right">
											<span
												className={`font-mono ${
													row.rsi > 70
														? "text-rose-500"
														: row.rsi < 30
															? "text-emerald-500"
															: "text-muted-foreground"
												}`}
											>
												{row.rsi}
											</span>
										</td>
										<td className="px-3 py-1.5 text-right">
											<div className="flex items-center justify-end gap-1">
												<div className="h-1.5 w-12 rounded-full bg-muted">
													<div
														className="h-full rounded-full bg-blue-500"
														style={{ width: `${row.momentumScore}%` }}
													/>
												</div>
												<span className="w-5 font-mono text-[10px] text-muted-foreground">
													{row.momentumScore}
												</span>
											</div>
										</td>
										<td className="px-3 py-1.5 text-right">
											<span
												className={`font-mono ${
													row.volumeRatio > 1.5
														? "text-amber-500"
														: "text-muted-foreground"
												}`}
											>
												{row.volumeRatio.toFixed(1)}x
											</span>
										</td>
										<td className="px-3 py-1.5 text-muted-foreground">
											{row.sector}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Status */}
					<div className="flex items-center justify-between border-t px-3 py-1 text-[10px] text-muted-foreground">
						<span>
							Showing {sortedData.length} of {mockScreenerData.length} stocks
						</span>
						<span>Last updated: {new Date().toLocaleTimeString()}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
