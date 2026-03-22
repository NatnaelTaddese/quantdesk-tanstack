import {
	ArrowDown,
	ArrowsClockwise,
	ArrowUp,
	BookmarkSimple,
	Buildings,
	CaretDown,
	CaretUp,
	ChartLine,
	Clock,
	Export,
	Eye,
	EyeSlash,
	MagnifyingGlass,
	Minus,
	Newspaper,
	Rss,
	Star,
	TrendUp,
	X,
} from "@phosphor-icons/react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { GridPanel } from "@/components/layout/grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ============================================================
// MOCK DATA
// ============================================================

// User's watchlist tickers
const mockWatchlist = [
	"AAPL",
	"NVDA",
	"MSFT",
	"GOOGL",
	"AMZN",
	"TSLA",
	"META",
	"SPY",
	"QQQ",
]

// User's portfolio tickers
const mockPortfolioTickers = [
	"AAPL",
	"NVDA",
	"MSFT",
	"GOOGL",
	"AMZN",
	"JPM",
	"JNJ",
	"XOM",
	"V",
]

// News articles with sentiment
const mockArticles = [
	{
		id: 1,
		headline:
			"Fed signals potential rate cuts in Q2 2025 amid cooling inflation data",
		summary:
			"Federal Reserve officials indicated they may begin cutting interest rates as early as next quarter, citing progress on inflation targets and a gradually cooling labor market.",
		source: "Bloomberg",
		sourceUrl: "https://bloomberg.com",
		time: "09:31",
		date: "2026-03-13",
		tickers: ["SPY", "TLT", "QQQ"],
		sector: "Macro",
		sentiment: "positive",
		sentimentScore: 0.78,
		sentimentModel: "FinBERT",
		starred: false,
		read: true,
	},
	{
		id: 2,
		headline:
			"NVIDIA reports record data center revenue, beats estimates by 12%",
		summary:
			"NVIDIA Corp posted quarterly revenue of $28.5 billion, driven by unprecedented demand for AI chips. Data center segment grew 154% year-over-year.",
		source: "Reuters",
		sourceUrl: "https://reuters.com",
		time: "09:28",
		date: "2026-03-13",
		tickers: ["NVDA", "AMD", "SMCI"],
		sector: "Technology",
		sentiment: "positive",
		sentimentScore: 0.92,
		sentimentModel: "FinBERT",
		starred: true,
		read: true,
	},
	{
		id: 3,
		headline: "Oil prices surge as OPEC+ extends production cuts through Q3",
		summary:
			"Crude oil jumped 4.2% after OPEC+ announced an extension of production cuts. Analysts warn of potential impact on consumer spending and inflation.",
		source: "WSJ",
		sourceUrl: "https://wsj.com",
		time: "09:15",
		date: "2026-03-13",
		tickers: ["XLE", "USO", "XOM", "CVX"],
		sector: "Energy",
		sentiment: "negative",
		sentimentScore: -0.45,
		sentimentModel: "FinBERT",
		starred: false,
		read: false,
	},
	{
		id: 4,
		headline:
			"Apple Vision Pro 2 announced with enterprise focus, analysts mixed",
		summary:
			"Apple unveiled the next generation of its spatial computing headset with improved displays and enterprise features. Street reaction remains divided on adoption prospects.",
		source: "CNBC",
		sourceUrl: "https://cnbc.com",
		time: "09:02",
		date: "2026-03-13",
		tickers: ["AAPL"],
		sector: "Technology",
		sentiment: "neutral",
		sentimentScore: 0.12,
		sentimentModel: "FinBERT",
		starred: false,
		read: false,
	},
	{
		id: 5,
		headline: "European banks face new stress test requirements under Basel IV",
		summary:
			"EU regulators announced stricter capital requirements for European banks, potentially impacting profitability and dividend policies.",
		source: "FT",
		sourceUrl: "https://ft.com",
		time: "08:45",
		date: "2026-03-13",
		tickers: ["XLF", "BAC", "JPM", "GS"],
		sector: "Financials",
		sentiment: "negative",
		sentimentScore: -0.38,
		sentimentModel: "FinBERT",
		starred: false,
		read: true,
	},
	{
		id: 6,
		headline: "US jobs report: 275K added, unemployment steady at 3.7%",
		summary:
			"The US economy added 275,000 jobs in February, exceeding expectations. The unemployment rate held at 3.7%, suggesting continued labor market strength.",
		source: "Bloomberg",
		sourceUrl: "https://bloomberg.com",
		time: "08:30",
		date: "2026-03-13",
		tickers: ["SPY", "DXY"],
		sector: "Macro",
		sentiment: "positive",
		sentimentScore: 0.65,
		sentimentModel: "FinBERT",
		starred: true,
		read: true,
	},
	{
		id: 7,
		headline:
			"Microsoft Azure revenue growth accelerates, cloud competition intensifies",
		summary:
			"Microsoft reported 31% growth in Azure revenue, beating estimates. The company highlighted strong AI services adoption among enterprise customers.",
		source: "Reuters",
		sourceUrl: "https://reuters.com",
		time: "08:15",
		date: "2026-03-13",
		tickers: ["MSFT", "AMZN", "GOOGL"],
		sector: "Technology",
		sentiment: "positive",
		sentimentScore: 0.71,
		sentimentModel: "FinBERT",
		starred: false,
		read: false,
	},
	{
		id: 8,
		headline: "China PMI data disappoints, emerging market ETFs under pressure",
		summary:
			"China's manufacturing PMI fell to 49.1, below the expansion threshold. Emerging market funds saw outflows as investors rotated to developed markets.",
		source: "WSJ",
		sourceUrl: "https://wsj.com",
		time: "07:55",
		date: "2026-03-13",
		tickers: ["EEM", "FXI", "BABA"],
		sector: "Macro",
		sentiment: "negative",
		sentimentScore: -0.52,
		sentimentModel: "FinBERT",
		starred: false,
		read: true,
	},
	{
		id: 9,
		headline:
			"Tesla announces new Model 2 pricing, aiming for mass market appeal",
		summary:
			"Tesla revealed pricing for its entry-level Model 2 at $25,000 before incentives. Production is set to begin in Q4 at the Texas Gigafactory.",
		source: "Electrek",
		sourceUrl: "https://electrek.co",
		time: "07:30",
		date: "2026-03-13",
		tickers: ["TSLA"],
		sector: "Consumer",
		sentiment: "positive",
		sentimentScore: 0.58,
		sentimentModel: "FinBERT",
		starred: false,
		read: false,
	},
	{
		id: 10,
		headline: "Amazon Web Services launches new AI chip to compete with NVIDIA",
		summary:
			"AWS unveiled its next-generation Trainium chip, claiming 40% better price-performance than competitors for AI training workloads.",
		source: "TechCrunch",
		sourceUrl: "https://techcrunch.com",
		time: "07:15",
		date: "2026-03-13",
		tickers: ["AMZN", "NVDA", "AMD"],
		sector: "Technology",
		sentiment: "neutral",
		sentimentScore: 0.25,
		sentimentModel: "FinBERT",
		starred: false,
		read: false,
	},
	{
		id: 11,
		headline: "JPMorgan raises S&P 500 year-end target to 5,800",
		summary:
			"JPMorgan strategists lifted their S&P 500 target, citing strong earnings momentum and potential Fed rate cuts. The firm remains overweight on technology.",
		source: "Bloomberg",
		sourceUrl: "https://bloomberg.com",
		time: "06:45",
		date: "2026-03-13",
		tickers: ["SPY", "JPM"],
		sector: "Macro",
		sentiment: "positive",
		sentimentScore: 0.68,
		sentimentModel: "FinBERT",
		starred: false,
		read: true,
	},
	{
		id: 12,
		headline: "Alphabet faces EU antitrust probe over AI partnerships",
		summary:
			"European Commission opened investigation into Google's AI cloud partnerships, examining potential anti-competitive practices in the generative AI market.",
		source: "FT",
		sourceUrl: "https://ft.com",
		time: "06:30",
		date: "2026-03-13",
		tickers: ["GOOGL", "MSFT"],
		sector: "Technology",
		sentiment: "negative",
		sentimentScore: -0.42,
		sentimentModel: "FinBERT",
		starred: false,
		read: false,
	},
	{
		id: 13,
		headline: "Meta's Threads surpasses 200M users, challenging X",
		summary:
			"Meta reported that Threads has reached 200 million monthly active users, with strong growth in advertising revenue potential.",
		source: "The Verge",
		sourceUrl: "https://theverge.com",
		time: "06:00",
		date: "2026-03-13",
		tickers: ["META"],
		sector: "Technology",
		sentiment: "positive",
		sentimentScore: 0.55,
		sentimentModel: "FinBERT",
		starred: false,
		read: false,
	},
	{
		id: 14,
		headline: "Healthcare stocks rally on Medicare drug pricing clarity",
		summary:
			"Healthcare sector gained after CMS released updated guidance on Medicare drug price negotiations, removing some uncertainty for pharma companies.",
		source: "Reuters",
		sourceUrl: "https://reuters.com",
		time: "Yesterday",
		date: "2026-03-12",
		tickers: ["XLV", "JNJ", "PFE", "UNH"],
		sector: "Healthcare",
		sentiment: "positive",
		sentimentScore: 0.48,
		sentimentModel: "FinBERT",
		starred: false,
		read: true,
	},
	{
		id: 15,
		headline: "Visa reports strong cross-border volume growth in Q1",
		summary:
			"Visa posted better-than-expected cross-border transaction volume, driven by international travel recovery and e-commerce growth.",
		source: "CNBC",
		sourceUrl: "https://cnbc.com",
		time: "Yesterday",
		date: "2026-03-12",
		tickers: ["V", "MA"],
		sector: "Financials",
		sentiment: "positive",
		sentimentScore: 0.62,
		sentimentModel: "FinBERT",
		starred: false,
		read: false,
	},
]

// 7-day sentiment trend data per ticker
const mockSentimentTrends: Record<string, { date: string; score: number }[]> = {
	NVDA: [
		{ date: "Mar 7", score: 0.65 },
		{ date: "Mar 8", score: 0.72 },
		{ date: "Mar 9", score: 0.58 },
		{ date: "Mar 10", score: 0.68 },
		{ date: "Mar 11", score: 0.75 },
		{ date: "Mar 12", score: 0.82 },
		{ date: "Mar 13", score: 0.92 },
	],
	AAPL: [
		{ date: "Mar 7", score: 0.42 },
		{ date: "Mar 8", score: 0.38 },
		{ date: "Mar 9", score: 0.45 },
		{ date: "Mar 10", score: 0.52 },
		{ date: "Mar 11", score: 0.35 },
		{ date: "Mar 12", score: 0.28 },
		{ date: "Mar 13", score: 0.12 },
	],
	MSFT: [
		{ date: "Mar 7", score: 0.55 },
		{ date: "Mar 8", score: 0.62 },
		{ date: "Mar 9", score: 0.58 },
		{ date: "Mar 10", score: 0.65 },
		{ date: "Mar 11", score: 0.68 },
		{ date: "Mar 12", score: 0.72 },
		{ date: "Mar 13", score: 0.71 },
	],
	GOOGL: [
		{ date: "Mar 7", score: 0.48 },
		{ date: "Mar 8", score: 0.52 },
		{ date: "Mar 9", score: 0.45 },
		{ date: "Mar 10", score: 0.38 },
		{ date: "Mar 11", score: 0.25 },
		{ date: "Mar 12", score: -0.15 },
		{ date: "Mar 13", score: -0.42 },
	],
	TSLA: [
		{ date: "Mar 7", score: -0.25 },
		{ date: "Mar 8", score: -0.18 },
		{ date: "Mar 9", score: 0.12 },
		{ date: "Mar 10", score: 0.28 },
		{ date: "Mar 11", score: 0.35 },
		{ date: "Mar 12", score: 0.42 },
		{ date: "Mar 13", score: 0.58 },
	],
	SPY: [
		{ date: "Mar 7", score: 0.45 },
		{ date: "Mar 8", score: 0.52 },
		{ date: "Mar 9", score: 0.48 },
		{ date: "Mar 10", score: 0.55 },
		{ date: "Mar 11", score: 0.62 },
		{ date: "Mar 12", score: 0.65 },
		{ date: "Mar 13", score: 0.72 },
	],
}

// Sector sentiment data
const mockSectorSentiment = [
	{ sector: "Technology", score: 0.58, articles: 45, change: 0.12 },
	{ sector: "Financials", score: 0.32, articles: 28, change: -0.08 },
	{ sector: "Healthcare", score: 0.45, articles: 22, change: 0.15 },
	{ sector: "Consumer", score: 0.28, articles: 18, change: 0.05 },
	{ sector: "Energy", score: -0.22, articles: 15, change: -0.18 },
	{ sector: "Macro", score: 0.52, articles: 35, change: 0.08 },
	{ sector: "Industrials", score: 0.18, articles: 12, change: -0.02 },
	{ sector: "Utilities", score: 0.05, articles: 8, change: 0.01 },
]

// Trending tickers with sentiment
const mockTrendingTickers = [
	{ ticker: "NVDA", mentions: 42, sentiment: 0.82, change: 0.15 },
	{ ticker: "AAPL", mentions: 38, sentiment: 0.12, change: -0.28 },
	{ ticker: "SPY", mentions: 35, sentiment: 0.68, change: 0.08 },
	{ ticker: "MSFT", mentions: 32, sentiment: 0.71, change: 0.05 },
	{ ticker: "TSLA", mentions: 28, sentiment: 0.58, change: 0.22 },
	{ ticker: "GOOGL", mentions: 25, sentiment: -0.42, change: -0.35 },
	{ ticker: "AMZN", mentions: 22, sentiment: 0.45, change: 0.12 },
	{ ticker: "META", mentions: 18, sentiment: 0.55, change: 0.18 },
]

// News sources
const mockSources = [
	{ name: "Bloomberg", active: true, articles: 28 },
	{ name: "Reuters", active: true, articles: 24 },
	{ name: "WSJ", active: true, articles: 18 },
	{ name: "CNBC", active: true, articles: 15 },
	{ name: "FT", active: true, articles: 12 },
	{ name: "TechCrunch", active: false, articles: 8 },
	{ name: "The Verge", active: false, articles: 6 },
	{ name: "Electrek", active: false, articles: 4 },
]

// ============================================================
// TYPES
// ============================================================

type FilterMode = "all" | "watchlist" | "portfolio" | "starred"
type SentimentFilter = "all" | "positive" | "neutral" | "negative"

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const getSentimentIcon = (sentiment: string) => {
	switch (sentiment) {
		case "positive":
			return <ArrowUp className="size-3 text-emerald-500" weight="bold" />
		case "negative":
			return <ArrowDown className="size-3 text-rose-500" weight="bold" />
		default:
			return <Minus className="size-3 text-muted-foreground" weight="bold" />
	}
}

const getSentimentColor = (score: number) => {
	if (score >= 0.5) return "text-emerald-500"
	if (score >= 0.2) return "text-emerald-400"
	if (score > -0.2) return "text-muted-foreground"
	if (score > -0.5) return "text-rose-400"
	return "text-rose-500"
}

const getSentimentBgColor = (score: number) => {
	if (score >= 0.5) return "bg-emerald-500"
	if (score >= 0.2) return "bg-emerald-400"
	if (score > -0.2) return "bg-amber-400"
	if (score > -0.5) return "bg-rose-400"
	return "bg-rose-500"
}

const getSentimentLabel = (score: number) => {
	if (score >= 0.5) return "Very Positive"
	if (score >= 0.2) return "Positive"
	if (score > -0.2) return "Neutral"
	if (score > -0.5) return "Negative"
	return "Very Negative"
}

// ============================================================
// COMPONENT
// ============================================================

export const Route = createFileRoute("/_app/news")({
	component: NewsPage,
})

function NewsPage() {
	const _router = useRouter()

	// State
	const [articles, setArticles] = useState(mockArticles)
	const [filterMode, setFilterMode] = useState<FilterMode>("all")
	const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all")
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
	const [selectedSector, setSelectedSector] = useState<string | null>(null)
	const [showOnlyUnread, setShowOnlyUnread] = useState(false)
	const [expandedArticle, setExpandedArticle] = useState<number | null>(null)

	// Toggle star
	const toggleStar = (id: number) => {
		setArticles((prev) =>
			prev.map((a) => (a.id === id ? { ...a, starred: !a.starred } : a)),
		)
	}

	// Mark as read
	const markAsRead = (id: number) => {
		setArticles((prev) =>
			prev.map((a) => (a.id === id ? { ...a, read: true } : a)),
		)
	}

	// Filter articles
	const filteredArticles = useMemo(() => {
		return articles.filter((article) => {
			// Filter by mode
			if (filterMode === "watchlist") {
				if (!article.tickers.some((t) => mockWatchlist.includes(t)))
					return false
			} else if (filterMode === "portfolio") {
				if (!article.tickers.some((t) => mockPortfolioTickers.includes(t)))
					return false
			} else if (filterMode === "starred") {
				if (!article.starred) return false
			}

			// Filter by sentiment
			if (sentimentFilter !== "all" && article.sentiment !== sentimentFilter) {
				return false
			}

			// Filter by ticker
			if (selectedTicker && !article.tickers.includes(selectedTicker)) {
				return false
			}

			// Filter by sector
			if (selectedSector && article.sector !== selectedSector) {
				return false
			}

			// Filter by read status
			if (showOnlyUnread && article.read) {
				return false
			}

			// Filter by search query
			if (searchQuery) {
				const query = searchQuery.toLowerCase()
				return (
					article.headline.toLowerCase().includes(query) ||
					article.summary.toLowerCase().includes(query) ||
					article.tickers.some((t) => t.toLowerCase().includes(query)) ||
					article.source.toLowerCase().includes(query)
				)
			}

			return true
		})
	}, [
		articles,
		filterMode,
		sentimentFilter,
		selectedTicker,
		selectedSector,
		showOnlyUnread,
		searchQuery,
	])

	// Counts
	const unreadCount = articles.filter((a) => !a.read).length
	const starredCount = articles.filter((a) => a.starred).length

	// Get sentiment trend for chart
	const selectedTrend = selectedTicker
		? mockSentimentTrends[selectedTicker]
		: null
	const trendMin = selectedTrend
		? Math.min(...selectedTrend.map((d) => d.score))
		: -1
	const trendMax = selectedTrend
		? Math.max(...selectedTrend.map((d) => d.score))
		: 1
	const trendRange = trendMax - trendMin || 1

	return (
		<div className="flex h-full flex-col gap-1">
			{/* Header */}
			<div className="flex items-center justify-between border bg-card px-3 py-2">
				<div className="flex items-center gap-3">
					<span className="font-mono text-sm font-semibold">NEWS FEED</span>
					<div className="flex items-center gap-2 text-[10px] text-muted-foreground">
						<span>{articles.length} articles</span>
						<span className="text-muted-foreground/50">|</span>
						<span className="text-amber-500">{unreadCount} unread</span>
						<span className="text-muted-foreground/50">|</span>
						<span className="flex items-center gap-0.5">
							<Star size={10} weight="fill" className="text-amber-400" />
							{starredCount} saved
						</span>
					</div>
					<div className="flex items-center gap-1 rounded border border-emerald-500/50 bg-emerald-500/10 px-2 py-0.5">
						<Rss size={10} className="text-emerald-500" />
						<span className="text-[10px] text-emerald-500">Live</span>
					</div>
				</div>
				<div className="flex items-center gap-1.5">
					<Button variant="ghost" size="xs" className="gap-1">
						<ArrowsClockwise size={14} />
						Refresh
					</Button>
					<Button variant="ghost" size="xs" className="gap-1">
						<Export size={14} />
						Export
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 gap-1 overflow-hidden">
				{/* Left Column - Filters & Trending */}
				<div className="flex w-64 flex-col gap-1">
					{/* Filter Mode */}
					<GridPanel title="Filter By">
						<div className="space-y-1">
							{[
								{ key: "all", label: "All News", count: articles.length },
								{
									key: "watchlist",
									label: "Watchlist",
									count: articles.filter((a) =>
										a.tickers.some((t) => mockWatchlist.includes(t)),
									).length,
								},
								{
									key: "portfolio",
									label: "Portfolio",
									count: articles.filter((a) =>
										a.tickers.some((t) => mockPortfolioTickers.includes(t)),
									).length,
								},
								{ key: "starred", label: "Saved", count: starredCount },
							].map(({ key, label, count }) => (
								<button
									key={key}
									onClick={() => setFilterMode(key as FilterMode)}
									className={cn(
										"flex w-full items-center justify-between px-2 py-1.5 text-xs transition-colors",
										filterMode === key
											? "bg-foreground/10 text-foreground"
											: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
									)}
								>
									<span>{label}</span>
									<span className="font-mono text-[10px]">{count}</span>
								</button>
							))}
						</div>
					</GridPanel>

					{/* Sentiment Filter */}
					<GridPanel title="Sentiment">
						<div className="flex gap-1">
							{[
								{ key: "all", label: "All" },
								{
									key: "positive",
									label: "Positive",
									color: "text-emerald-500",
								},
								{
									key: "neutral",
									label: "Neutral",
									color: "text-muted-foreground",
								},
								{ key: "negative", label: "Negative", color: "text-rose-500" },
							].map(({ key, label, color }) => (
								<button
									key={key}
									onClick={() => setSentimentFilter(key as SentimentFilter)}
									className={cn(
										"flex-1 border px-1.5 py-1 text-[10px] transition-colors",
										sentimentFilter === key
											? "border-foreground/20 bg-foreground/10"
											: "border-transparent hover:border-border",
										color,
									)}
								>
									{label}
								</button>
							))}
						</div>
					</GridPanel>

					{/* Trending Tickers */}
					<GridPanel
						title="Trending Tickers"
						actions={<TrendUp size={12} className="text-muted-foreground" />}
						className="flex-1"
					>
						<div className="space-y-0">
							<div className="flex items-center justify-between border-b pb-1 text-[9px] text-muted-foreground">
								<span>TICKER</span>
								<span>MENTIONS</span>
								<span>SENTIMENT</span>
							</div>
							{mockTrendingTickers.map((t) => (
								<button
									key={t.ticker}
									onClick={() =>
										setSelectedTicker(
											selectedTicker === t.ticker ? null : t.ticker,
										)
									}
									className={cn(
										"flex w-full items-center justify-between py-1.5 text-xs transition-colors",
										selectedTicker === t.ticker
											? "bg-primary/10"
											: "hover:bg-foreground/[0.03]",
									)}
								>
									<span className="font-mono font-medium">{t.ticker}</span>
									<span className="font-mono text-muted-foreground">
										{t.mentions}
									</span>
									<div className="flex items-center gap-1">
										<span
											className={cn(
												"font-mono",
												getSentimentColor(t.sentiment),
											)}
										>
											{t.sentiment >= 0 ? "+" : ""}
											{t.sentiment.toFixed(2)}
										</span>
										{t.change !== 0 && (
											<span
												className={cn(
													"text-[9px]",
													t.change > 0 ? "text-emerald-500" : "text-rose-500",
												)}
											>
												{t.change > 0 ? "↑" : "↓"}
											</span>
										)}
									</div>
								</button>
							))}
						</div>
					</GridPanel>

					{/* Sources */}
					<GridPanel title="Sources" className="shrink-0">
						<div className="space-y-1">
							{mockSources.slice(0, 5).map((s) => (
								<div
									key={s.name}
									className="flex items-center justify-between text-xs text-muted-foreground"
								>
									<span className="flex items-center gap-1.5">
										<span
											className={cn(
												"size-1.5 rounded-full",
												s.active ? "bg-emerald-500" : "bg-muted-foreground/50",
											)}
										/>
										{s.name}
									</span>
									<span className="font-mono text-[10px]">{s.articles}</span>
								</div>
							))}
						</div>
					</GridPanel>
				</div>

				{/* Center - News Feed */}
				<div className="flex flex-1 flex-col gap-1 overflow-hidden">
					{/* Search & Controls */}
					<div className="flex items-center gap-2 border bg-card px-3 py-1.5">
						<div className="relative flex-1">
							<MagnifyingGlass
								size={14}
								className="absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								placeholder="Search headlines, tickers, sources..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-7 pl-7 text-xs"
							/>
						</div>
						<button
							onClick={() => setShowOnlyUnread(!showOnlyUnread)}
							className={cn(
								"flex items-center gap-1 rounded border px-2 py-1 text-[10px] transition-colors",
								showOnlyUnread
									? "border-primary bg-primary/10 text-primary"
									: "border-border text-muted-foreground hover:text-foreground",
							)}
						>
							{showOnlyUnread ? <Eye size={12} /> : <EyeSlash size={12} />}
							Unread only
						</button>
						{(selectedTicker || selectedSector) && (
							<button
								onClick={() => {
									setSelectedTicker(null)
									setSelectedSector(null)
								}}
								className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground"
							>
								<X size={12} />
								Clear filters
							</button>
						)}
					</div>

					{/* Active Filters */}
					{(selectedTicker || selectedSector) && (
						<div className="flex items-center gap-2 px-1 text-[10px]">
							<span className="text-muted-foreground">Filtering by:</span>
							{selectedTicker && (
								<span className="flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-primary">
									Ticker: {selectedTicker}
									<button onClick={() => setSelectedTicker(null)}>
										<X size={10} />
									</button>
								</span>
							)}
							{selectedSector && (
								<span className="flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-blue-500">
									Sector: {selectedSector}
									<button onClick={() => setSelectedSector(null)}>
										<X size={10} />
									</button>
								</span>
							)}
						</div>
					)}

					{/* Articles List */}
					<div className="flex-1 overflow-auto border bg-card">
						<div className="divide-y divide-border/50">
							{filteredArticles.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
									<Newspaper size={32} className="mb-2" />
									<p className="text-sm">No articles match your filters</p>
									<p className="text-[10px]">
										Try adjusting your search or filter criteria
									</p>
								</div>
							) : (
								filteredArticles.map((article) => (
									<div
										key={article.id}
										className={cn(
											"px-3 py-2.5 transition-colors hover:bg-foreground/[0.02]",
											!article.read && "bg-primary/[0.02]",
										)}
										onClick={() => markAsRead(article.id)}
									>
										<div className="flex items-start gap-3">
											{/* Sentiment Indicator */}
											<div className="mt-1 flex flex-col items-center gap-1">
												{getSentimentIcon(article.sentiment)}
												<span
													className={cn(
														"font-mono text-[9px]",
														getSentimentColor(article.sentimentScore),
													)}
												>
													{article.sentimentScore >= 0 ? "+" : ""}
													{article.sentimentScore.toFixed(2)}
												</span>
											</div>

											{/* Content */}
											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-2">
													<h3
														className={cn(
															"cursor-pointer text-xs leading-snug hover:text-primary",
															!article.read && "font-medium",
														)}
														onClick={() =>
															setExpandedArticle(
																expandedArticle === article.id
																	? null
																	: article.id,
															)
														}
													>
														{article.headline}
													</h3>
													<button
														onClick={(e) => {
															e.stopPropagation()
															toggleStar(article.id)
														}}
														className="shrink-0 p-1 text-muted-foreground hover:text-amber-400"
													>
														{article.starred ? (
															<Star
																size={14}
																weight="fill"
																className="text-amber-400"
															/>
														) : (
															<Star size={14} />
														)}
													</button>
												</div>

												{/* Summary (expandable) */}
												{expandedArticle === article.id && (
													<p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
														{article.summary}
													</p>
												)}

												{/* Meta */}
												<div className="mt-1.5 flex flex-wrap items-center gap-2">
													<span className="flex items-center gap-1 text-[10px] text-muted-foreground">
														<Clock size={10} />
														{article.time}
													</span>
													<span className="text-[10px] text-muted-foreground">
														{article.source}
													</span>
													<button
														onClick={(e) => {
															e.stopPropagation()
															setSelectedSector(article.sector)
														}}
														className="text-[10px] text-blue-500 hover:underline"
													>
														{article.sector}
													</button>
													<div className="flex gap-1">
														{article.tickers.map((t) => (
															<button
																key={t}
																onClick={(e) => {
																	e.stopPropagation()
																	setSelectedTicker(t)
																}}
																className={cn(
																	"border px-1 py-px font-mono text-[9px] transition-colors",
																	mockWatchlist.includes(t)
																		? "border-primary/50 bg-primary/10 text-primary"
																		: "border-border text-muted-foreground hover:border-primary/50 hover:text-primary",
																)}
															>
																{t}
															</button>
														))}
													</div>
													<span className="text-[9px] text-muted-foreground/50">
														via {article.sentimentModel}
													</span>
													{!article.read && (
														<span className="rounded bg-amber-500/20 px-1 py-px text-[9px] text-amber-500">
															NEW
														</span>
													)}
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between border bg-card px-3 py-1 text-[10px] text-muted-foreground">
						<span>
							Showing {filteredArticles.length} of {articles.length} articles
						</span>
						<span>Last updated: {new Date().toLocaleTimeString()}</span>
					</div>
				</div>

				{/* Right Column - Sentiment Analysis */}
				<div className="flex w-80 flex-col gap-1">
					{/* Sentiment Trend Chart */}
					<GridPanel
						title={
							selectedTicker
								? `${selectedTicker} Sentiment Trend`
								: "Select Ticker for Trend"
						}
						actions={
							selectedTicker && (
								<span className="text-[10px] text-muted-foreground">
									7-day rolling
								</span>
							)
						}
					>
						{selectedTicker && selectedTrend ? (
							<div className="space-y-2">
								{/* Current Score */}
								<div className="flex items-center justify-between">
									<span className="text-[10px] text-muted-foreground">
										Current Score
									</span>
									<div className="flex items-center gap-2">
										<span
											className={cn(
												"font-mono text-lg font-bold",
												getSentimentColor(
													selectedTrend[selectedTrend.length - 1].score,
												),
											)}
										>
											{selectedTrend[selectedTrend.length - 1].score >= 0
												? "+"
												: ""}
											{selectedTrend[selectedTrend.length - 1].score.toFixed(2)}
										</span>
										<span
											className={cn(
												"rounded px-1.5 py-0.5 text-[9px]",
												getSentimentBgColor(
													selectedTrend[selectedTrend.length - 1].score,
												),
												"text-white",
											)}
										>
											{getSentimentLabel(
												selectedTrend[selectedTrend.length - 1].score,
											)}
										</span>
									</div>
								</div>

								{/* Chart */}
								<div className="relative h-24">
									{/* Zero line */}
									<div
										className="absolute right-0 left-0 border-t border-dashed border-muted-foreground/30"
										style={{ top: `${((trendMax - 0) / trendRange) * 100}%` }}
									/>
									<svg
										className="h-full w-full"
										viewBox="0 0 100 50"
										preserveAspectRatio="none"
									>
										{/* Area fill */}
										<path
											fill="url(#sentimentGradient)"
											fillOpacity="0.3"
											d={`M0,${50 - ((selectedTrend[0].score - trendMin) / trendRange) * 50} ${selectedTrend
												.map((d, i) => {
													const x = (i / (selectedTrend.length - 1)) * 100
													const y =
														50 - ((d.score - trendMin) / trendRange) * 50
													return `L${x},${y}`
												})
												.join(" ")} L100,50 L0,50 Z`}
										/>
										{/* Line */}
										<polyline
											fill="none"
											stroke="rgb(16, 185, 129)"
											strokeWidth="1"
											points={selectedTrend
												.map((d, i) => {
													const x = (i / (selectedTrend.length - 1)) * 100
													const y =
														50 - ((d.score - trendMin) / trendRange) * 50
													return `${x},${y}`
												})
												.join(" ")}
										/>
										{/* Points */}
										{selectedTrend.map((d, i) => {
											const x = (i / (selectedTrend.length - 1)) * 100
											const y = 50 - ((d.score - trendMin) / trendRange) * 50
											return (
												<circle
													key={i}
													cx={x}
													cy={y}
													r="1.5"
													fill={
														d.score >= 0
															? "rgb(16, 185, 129)"
															: "rgb(244, 63, 94)"
													}
												/>
											)
										})}
										<defs>
											<linearGradient
												id="sentimentGradient"
												x1="0%"
												y1="0%"
												x2="0%"
												y2="100%"
											>
												<stop offset="0%" stopColor="rgb(16, 185, 129)" />
												<stop
													offset="100%"
													stopColor="rgb(16, 185, 129)"
													stopOpacity="0"
												/>
											</linearGradient>
										</defs>
									</svg>
								</div>

								{/* X-axis labels */}
								<div className="flex justify-between text-[9px] text-muted-foreground">
									{selectedTrend.map((d) => (
										<span key={d.date}>{d.date}</span>
									))}
								</div>
							</div>
						) : (
							<div className="flex h-24 flex-col items-center justify-center text-muted-foreground">
								<ChartLine size={24} className="mb-1" />
								<p className="text-[10px]">
									Click a ticker to view sentiment trend
								</p>
							</div>
						)}
					</GridPanel>

					{/* Sector Sentiment Heatmap */}
					<GridPanel
						title="Sector Sentiment"
						actions={<Buildings size={12} className="text-muted-foreground" />}
						className="flex-1"
					>
						<div className="space-y-1.5">
							{mockSectorSentiment.map((s) => (
								<button
									key={s.sector}
									onClick={() =>
										setSelectedSector(
											selectedSector === s.sector ? null : s.sector,
										)
									}
									className={cn(
										"w-full transition-colors",
										selectedSector === s.sector && "ring-1 ring-primary",
									)}
								>
									<div className="flex items-center justify-between text-xs">
										<span className="flex items-center gap-1.5">
											<span
												className={cn(
													"inline-block h-3 w-1 rounded-sm",
													getSentimentBgColor(s.score),
												)}
											/>
											{s.sector}
										</span>
										<div className="flex items-center gap-2">
											<span
												className={cn(
													"font-mono text-[10px]",
													getSentimentColor(s.score),
												)}
											>
												{s.score >= 0 ? "+" : ""}
												{s.score.toFixed(2)}
											</span>
											<span
												className={cn(
													"flex items-center gap-0.5 text-[9px]",
													s.change > 0
														? "text-emerald-500"
														: s.change < 0
															? "text-rose-500"
															: "text-muted-foreground",
												)}
											>
												{s.change > 0 ? (
													<CaretUp size={8} />
												) : s.change < 0 ? (
													<CaretDown size={8} />
												) : null}
												{Math.abs(s.change).toFixed(2)}
											</span>
										</div>
									</div>
									<div className="mt-1 h-1.5 w-full rounded-full bg-muted">
										<div
											className={cn(
												"h-full rounded-full transition-all",
												getSentimentBgColor(s.score),
											)}
											style={{ width: `${((s.score + 1) / 2) * 100}%` }}
										/>
									</div>
									<div className="mt-0.5 text-right text-[9px] text-muted-foreground">
										{s.articles} articles
									</div>
								</button>
							))}
						</div>
					</GridPanel>

					{/* Saved Articles */}
					<GridPanel
						title="Saved Articles"
						actions={
							<span className="text-[10px] text-muted-foreground">
								{starredCount} saved
							</span>
						}
						className="max-h-48 shrink-0"
					>
						{starredCount === 0 ? (
							<div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
								<BookmarkSimple size={20} className="mb-1" />
								<p className="text-[10px]">Star articles to save them here</p>
							</div>
						) : (
							<div className="space-y-1.5 overflow-auto">
								{articles
									.filter((a) => a.starred)
									.map((article) => (
										<div
											key={article.id}
											className="border-b border-border/50 pb-1.5 last:border-0"
										>
											<p className="line-clamp-2 cursor-pointer text-[11px] leading-snug hover:text-primary">
												{article.headline}
											</p>
											<div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground">
												<span>{article.source}</span>
												<span>{article.time}</span>
												<button
													onClick={() => toggleStar(article.id)}
													className="ml-auto text-amber-400 hover:text-muted-foreground"
												>
													<X size={10} />
												</button>
											</div>
										</div>
									))}
							</div>
						)}
					</GridPanel>

					{/* Sentiment Legend */}
					<GridPanel title="Sentiment Scale" className="shrink-0">
						<div className="flex items-center justify-between text-[9px]">
							<div className="flex items-center gap-1">
								<span className="h-2 w-2 rounded-full bg-rose-500" />
								<span className="text-muted-foreground">-1.0 (Negative)</span>
							</div>
							<div className="flex items-center gap-1">
								<span className="h-2 w-2 rounded-full bg-amber-400" />
								<span className="text-muted-foreground">0 (Neutral)</span>
							</div>
							<div className="flex items-center gap-1">
								<span className="h-2 w-2 rounded-full bg-emerald-500" />
								<span className="text-muted-foreground">+1.0 (Positive)</span>
							</div>
						</div>
						<p className="mt-1.5 text-[9px] text-muted-foreground">
							Sentiment scores computed using FinBERT model on headline +
							summary text
						</p>
					</GridPanel>
				</div>
			</div>
		</div>
	)
}
