import {
	ArrowBendUpRight,
	CalendarBlank,
	ChartBar,
	ChartLine,
	ChartLineUp,
	CheckCircle,
	Clock,
	Code,
	Copy,
	Export,
	FloppyDisk,
	Info,
	Lightning,
	Play,
	Plus,
	Scales,
	Sliders,
	SortAscending,
	SortDescending,
	Stop,
	Table,
	Warning,
} from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { GridPanel } from "@/components/layout/grid"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// ============================================================
// MOCK DATA
// ============================================================

// Saved strategies
const mockStrategies = [
	{
		id: 1,
		name: "Mean Reversion SPY/QQQ",
		description: "Pairs trading between SPY and QQQ based on z-score",
		universe: ["SPY", "QQQ"],
		entryRule: "zscore < -2 and rsi_14 < 30",
		exitRule: "zscore > 0 or holding_days > 10",
		positionSizing: "equal_weight",
		status: "active",
		lastRun: "2 hours ago",
		inSampleSharpe: 1.82,
		outOfSampleSharpe: 1.45,
	},
	{
		id: 2,
		name: "Momentum ETF Rotation",
		description: "Monthly rotation into top 3 momentum ETFs",
		universe: ["SPY", "QQQ", "IWM", "EFA", "EEM", "TLT", "GLD"],
		entryRule: "momentum_12m in top_3",
		exitRule: "momentum_12m not in top_5 or month_end",
		positionSizing: "inverse_volatility",
		status: "draft",
		lastRun: "1 day ago",
		inSampleSharpe: 1.65,
		outOfSampleSharpe: 1.12,
	},
	{
		id: 3,
		name: "Earnings Drift",
		description: "Post-earnings announcement drift strategy",
		universe: ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA"],
		entryRule: "earnings_surprise > 5% and volume_ratio > 1.5",
		exitRule: "holding_days > 5 or pnl > 3%",
		positionSizing: "kelly_fraction",
		status: "completed",
		lastRun: "5 days ago",
		inSampleSharpe: 1.15,
		outOfSampleSharpe: 0.78,
	},
	{
		id: 4,
		name: "Vol Surface Arbitrage",
		description: "Options volatility surface mean reversion",
		universe: ["SPX"],
		entryRule: "iv_percentile > 80 and term_structure_inverted",
		exitRule: "iv_percentile < 50 or days_to_expiry < 7",
		positionSizing: "fixed_pct",
		status: "active",
		lastRun: "30 min ago",
		inSampleSharpe: 2.45,
		outOfSampleSharpe: 1.92,
	},
]

// Backtest results for comparison
const mockBacktestResults = [
	{
		id: 1,
		strategyId: 1,
		name: "Mean Reversion SPY/QQQ",
		runDate: "2026-03-13 10:30",
		period: "2020-01-01 to 2025-12-31",
		initialCapital: 100000,
		finalValue: 187250,
		totalReturn: 87.25,
		cagr: 13.4,
		sharpeRatio: 1.82,
		sortinoRatio: 2.45,
		calmarRatio: 1.65,
		maxDrawdown: -8.12,
		avgDrawdownDuration: 15,
		winRate: 62.5,
		profitFactor: 1.85,
		avgWinLoss: 1.42,
		numTrades: 342,
		avgHoldingPeriod: 4.2,
		betaToSpy: 0.45,
		alpha: 8.2,
		correlationToSpy: 0.52,
		deflatedSharpe: 1.58,
		isOverfit: false,
	},
	{
		id: 2,
		strategyId: 2,
		name: "Momentum ETF Rotation",
		runDate: "2026-03-12 15:45",
		period: "2019-01-01 to 2025-12-31",
		initialCapital: 100000,
		finalValue: 215890,
		totalReturn: 115.89,
		cagr: 12.1,
		sharpeRatio: 1.45,
		sortinoRatio: 1.92,
		calmarRatio: 0.78,
		maxDrawdown: -15.62,
		avgDrawdownDuration: 42,
		winRate: 58.3,
		profitFactor: 1.62,
		avgWinLoss: 1.28,
		numTrades: 156,
		avgHoldingPeriod: 22.5,
		betaToSpy: 0.92,
		alpha: 3.8,
		correlationToSpy: 0.85,
		deflatedSharpe: 1.18,
		isOverfit: false,
	},
	{
		id: 3,
		strategyId: 3,
		name: "Earnings Drift",
		runDate: "2026-03-08 09:15",
		period: "2021-01-01 to 2025-12-31",
		initialCapital: 100000,
		finalValue: 142580,
		totalReturn: 42.58,
		cagr: 8.7,
		sharpeRatio: 0.98,
		sortinoRatio: 1.35,
		calmarRatio: 0.72,
		maxDrawdown: -12.08,
		avgDrawdownDuration: 28,
		winRate: 54.7,
		profitFactor: 1.35,
		avgWinLoss: 1.18,
		numTrades: 64,
		avgHoldingPeriod: 4.8,
		betaToSpy: 0.72,
		alpha: 2.1,
		correlationToSpy: 0.68,
		deflatedSharpe: 0.72,
		isOverfit: true, // In-sample >> out-of-sample
	},
	{
		id: 4,
		strategyId: 4,
		name: "Vol Surface Arbitrage",
		runDate: "2026-03-13 11:00",
		period: "2022-01-01 to 2025-12-31",
		initialCapital: 100000,
		finalValue: 198450,
		totalReturn: 98.45,
		cagr: 18.3,
		sharpeRatio: 2.15,
		sortinoRatio: 3.12,
		calmarRatio: 3.39,
		maxDrawdown: -5.42,
		avgDrawdownDuration: 8,
		winRate: 68.2,
		profitFactor: 2.45,
		avgWinLoss: 1.65,
		numTrades: 890,
		avgHoldingPeriod: 3.2,
		betaToSpy: 0.12,
		alpha: 16.8,
		correlationToSpy: 0.15,
		deflatedSharpe: 1.85,
		isOverfit: false,
	},
]

// Currently selected backtest - detailed data
const mockSelectedBacktest = {
	...mockBacktestResults[0],
	equityCurve: [
		{ date: "2020-01", value: 100000, spy: 100000, drawdown: 0 },
		{ date: "2020-02", value: 98500, spy: 91200, drawdown: -1.5 },
		{ date: "2020-03", value: 92000, spy: 78500, drawdown: -8.0 },
		{ date: "2020-04", value: 101200, spy: 88900, drawdown: 0 },
		{ date: "2020-05", value: 104500, spy: 93200, drawdown: 0 },
		{ date: "2020-06", value: 108200, spy: 95100, drawdown: 0 },
		{ date: "2020-07", value: 115800, spy: 100500, drawdown: 0 },
		{ date: "2020-08", value: 122400, spy: 107800, drawdown: 0 },
		{ date: "2020-09", value: 118900, spy: 103900, drawdown: -2.86 },
		{ date: "2020-10", value: 116200, spy: 101200, drawdown: -5.07 },
		{ date: "2020-11", value: 128500, spy: 112400, drawdown: 0 },
		{ date: "2020-12", value: 135200, spy: 116800, drawdown: 0 },
		{ date: "2021-01", value: 132800, spy: 115200, drawdown: -1.78 },
		{ date: "2021-02", value: 138400, spy: 118900, drawdown: 0 },
		{ date: "2021-03", value: 142100, spy: 123500, drawdown: 0 },
		{ date: "2021-04", value: 148900, spy: 128700, drawdown: 0 },
		{ date: "2021-05", value: 151200, spy: 129400, drawdown: 0 },
		{ date: "2021-06", value: 155800, spy: 132100, drawdown: 0 },
		{ date: "2021-07", value: 158400, spy: 135200, drawdown: 0 },
		{ date: "2021-08", value: 162900, spy: 139400, drawdown: 0 },
		{ date: "2021-09", value: 157800, spy: 132800, drawdown: -3.13 },
		{ date: "2021-10", value: 168500, spy: 142100, drawdown: 0 },
		{ date: "2021-11", value: 165200, spy: 141200, drawdown: -1.96 },
		{ date: "2021-12", value: 172400, spy: 147500, drawdown: 0 },
		{ date: "2022-01", value: 164800, spy: 139800, drawdown: -4.41 },
		{ date: "2022-02", value: 160200, spy: 135400, drawdown: -7.08 },
		{ date: "2022-03", value: 168400, spy: 140200, drawdown: -2.32 },
		{ date: "2022-04", value: 158500, spy: 128100, drawdown: -8.06 },
		{ date: "2022-05", value: 156200, spy: 126400, drawdown: -9.4 },
		{ date: "2022-06", value: 152800, spy: 115800, drawdown: -11.37 },
		{ date: "2022-07", value: 162400, spy: 126500, drawdown: -5.8 },
		{ date: "2022-08", value: 158100, spy: 121200, drawdown: -8.29 },
		{ date: "2022-09", value: 151200, spy: 110500, drawdown: -12.29 },
		{ date: "2022-10", value: 158400, spy: 119200, drawdown: -8.12 },
		{ date: "2022-11", value: 165800, spy: 125800, drawdown: -3.83 },
		{ date: "2022-12", value: 162100, spy: 120500, drawdown: -5.97 },
		{ date: "2023-01", value: 170500, spy: 128200, drawdown: -1.1 },
		{ date: "2023-02", value: 167200, spy: 125100, drawdown: -3.02 },
		{ date: "2023-03", value: 172400, spy: 129800, drawdown: 0 },
		{ date: "2023-04", value: 175800, spy: 131500, drawdown: 0 },
		{ date: "2023-05", value: 174200, spy: 132100, drawdown: -0.91 },
		{ date: "2023-06", value: 182400, spy: 140800, drawdown: 0 },
		{ date: "2023-07", value: 187200, spy: 145200, drawdown: 0 },
		{ date: "2023-08", value: 184500, spy: 142800, drawdown: -1.44 },
		{ date: "2023-09", value: 178900, spy: 136200, drawdown: -4.43 },
		{ date: "2023-10", value: 175200, spy: 133500, drawdown: -6.41 },
		{ date: "2023-11", value: 185400, spy: 145800, drawdown: -0.96 },
		{ date: "2023-12", value: 192800, spy: 152400, drawdown: 0 },
		{ date: "2024-01", value: 195400, spy: 154800, drawdown: 0 },
		{ date: "2024-02", value: 201200, spy: 162400, drawdown: 0 },
		{ date: "2024-03", value: 205800, spy: 167500, drawdown: 0 },
		{ date: "2024-04", value: 198500, spy: 160200, drawdown: -3.55 },
		{ date: "2024-05", value: 208400, spy: 168900, drawdown: 0 },
		{ date: "2024-06", value: 212800, spy: 174500, drawdown: 0 },
		{ date: "2024-07", value: 218500, spy: 176200, drawdown: 0 },
		{ date: "2024-08", value: 215200, spy: 178400, drawdown: -1.51 },
		{ date: "2024-09", value: 222400, spy: 182100, drawdown: 0 },
		{ date: "2024-10", value: 218900, spy: 180500, drawdown: -1.57 },
		{ date: "2024-11", value: 228500, spy: 190200, drawdown: 0 },
		{ date: "2024-12", value: 235800, spy: 188500, drawdown: 0 },
		{ date: "2025-01", value: 232400, spy: 185200, drawdown: -1.44 },
		{ date: "2025-02", value: 242800, spy: 192400, drawdown: 0 },
		{ date: "2025-03", value: 248500, spy: 198100, drawdown: 0 },
		{ date: "2025-04", value: 252100, spy: 202400, drawdown: 0 },
		{ date: "2025-05", value: 258400, spy: 208500, drawdown: 0 },
		{ date: "2025-06", value: 262800, spy: 212100, drawdown: 0 },
		{ date: "2025-07", value: 268500, spy: 218400, drawdown: 0 },
		{ date: "2025-08", value: 272100, spy: 222800, drawdown: 0 },
		{ date: "2025-09", value: 265800, spy: 215200, drawdown: -2.32 },
		{ date: "2025-10", value: 275400, spy: 225400, drawdown: 0 },
		{ date: "2025-11", value: 282100, spy: 232800, drawdown: 0 },
		{ date: "2025-12", value: 287250, spy: 238500, drawdown: 0 },
	],
	monthlyReturns: {
		2020: {
			Jan: 0,
			Feb: -1.5,
			Mar: -6.6,
			Apr: 10.0,
			May: 3.3,
			Jun: 3.5,
			Jul: 7.0,
			Aug: 5.7,
			Sep: -2.9,
			Oct: -2.3,
			Nov: 10.6,
			Dec: 5.2,
		},
		2021: {
			Jan: -1.8,
			Feb: 4.2,
			Mar: 2.7,
			Apr: 4.8,
			May: 1.5,
			Jun: 3.0,
			Jul: 1.7,
			Aug: 2.8,
			Sep: -3.1,
			Oct: 6.8,
			Nov: -2.0,
			Dec: 4.4,
		},
		2022: {
			Jan: -4.4,
			Feb: -2.8,
			Mar: 5.1,
			Apr: -5.9,
			May: -1.5,
			Jun: -2.2,
			Jul: 6.3,
			Aug: -2.6,
			Sep: -4.4,
			Oct: 4.8,
			Nov: 4.7,
			Dec: -2.2,
		},
		2023: {
			Jan: 5.2,
			Feb: -1.9,
			Mar: 3.1,
			Apr: 2.0,
			May: -0.9,
			Jun: 4.7,
			Jul: 2.6,
			Aug: -1.4,
			Sep: -3.0,
			Oct: -2.1,
			Nov: 5.8,
			Dec: 4.0,
		},
		2024: {
			Jan: 1.3,
			Feb: 3.0,
			Mar: 2.3,
			Apr: -3.5,
			May: 5.0,
			Jun: 2.1,
			Jul: 2.7,
			Aug: -1.5,
			Sep: 3.3,
			Oct: -1.6,
			Nov: 4.4,
			Dec: 3.2,
		},
		2025: {
			Jan: -1.4,
			Feb: 4.5,
			Mar: 2.3,
			Apr: 1.4,
			May: 2.5,
			Jun: 1.7,
			Jul: 2.2,
			Aug: 1.3,
			Sep: -2.3,
			Oct: 3.6,
			Nov: 2.4,
			Dec: 1.8,
		},
	},
}

// Trade log for selected backtest
const mockTradeLog = [
	{
		id: 1,
		entryDate: "2025-12-15",
		exitDate: "2025-12-20",
		ticker: "SPY",
		side: "LONG",
		shares: 100,
		entryPrice: 598.5,
		exitPrice: 605.2,
		returnPct: 1.12,
		pnl: 670,
		holdingDays: 5,
	},
	{
		id: 2,
		entryDate: "2025-12-10",
		exitDate: "2025-12-18",
		ticker: "QQQ",
		side: "SHORT",
		shares: 50,
		entryPrice: 525.8,
		exitPrice: 518.4,
		returnPct: 1.41,
		pnl: 370,
		holdingDays: 8,
	},
	{
		id: 3,
		entryDate: "2025-12-02",
		exitDate: "2025-12-08",
		ticker: "SPY",
		side: "LONG",
		shares: 120,
		entryPrice: 592.1,
		exitPrice: 600.85,
		returnPct: 1.48,
		pnl: 1050,
		holdingDays: 6,
	},
	{
		id: 4,
		entryDate: "2025-11-25",
		exitDate: "2025-12-01",
		ticker: "QQQ",
		side: "LONG",
		shares: 80,
		entryPrice: 508.2,
		exitPrice: 520.45,
		returnPct: 2.41,
		pnl: 980,
		holdingDays: 6,
	},
	{
		id: 5,
		entryDate: "2025-11-18",
		exitDate: "2025-11-22",
		ticker: "SPY",
		side: "SHORT",
		shares: 100,
		entryPrice: 602.5,
		exitPrice: 595.8,
		returnPct: 1.11,
		pnl: 670,
		holdingDays: 4,
	},
	{
		id: 6,
		entryDate: "2025-11-10",
		exitDate: "2025-11-15",
		ticker: "QQQ",
		side: "LONG",
		shares: 60,
		entryPrice: 498.4,
		exitPrice: 505.2,
		returnPct: 1.36,
		pnl: 408,
		holdingDays: 5,
	},
	{
		id: 7,
		entryDate: "2025-11-02",
		exitDate: "2025-11-08",
		ticker: "SPY",
		side: "LONG",
		shares: 90,
		entryPrice: 588.9,
		exitPrice: 582.1,
		returnPct: -1.15,
		pnl: -612,
		holdingDays: 6,
	},
	{
		id: 8,
		entryDate: "2025-10-28",
		exitDate: "2025-11-01",
		ticker: "QQQ",
		side: "SHORT",
		shares: 70,
		entryPrice: 492.8,
		exitPrice: 498.5,
		returnPct: -1.16,
		pnl: -399,
		holdingDays: 4,
	},
	{
		id: 9,
		entryDate: "2025-10-20",
		exitDate: "2025-10-25",
		ticker: "SPY",
		side: "LONG",
		shares: 110,
		entryPrice: 575.2,
		exitPrice: 585.4,
		returnPct: 1.77,
		pnl: 1122,
		holdingDays: 5,
	},
	{
		id: 10,
		entryDate: "2025-10-12",
		exitDate: "2025-10-18",
		ticker: "QQQ",
		side: "LONG",
		shares: 85,
		entryPrice: 478.5,
		exitPrice: 488.2,
		returnPct: 2.03,
		pnl: 825,
		holdingDays: 6,
	},
	{
		id: 11,
		entryDate: "2025-10-05",
		exitDate: "2025-10-10",
		ticker: "SPY",
		side: "SHORT",
		shares: 100,
		entryPrice: 582.4,
		exitPrice: 575.1,
		returnPct: 1.25,
		pnl: 730,
		holdingDays: 5,
	},
	{
		id: 12,
		entryDate: "2025-09-28",
		exitDate: "2025-10-02",
		ticker: "QQQ",
		side: "LONG",
		shares: 75,
		entryPrice: 465.8,
		exitPrice: 472.5,
		returnPct: 1.44,
		pnl: 503,
		holdingDays: 4,
	},
	{
		id: 13,
		entryDate: "2025-09-20",
		exitDate: "2025-09-26",
		ticker: "SPY",
		side: "LONG",
		shares: 95,
		entryPrice: 568.2,
		exitPrice: 560.4,
		returnPct: -1.37,
		pnl: -741,
		holdingDays: 6,
	},
	{
		id: 14,
		entryDate: "2025-09-12",
		exitDate: "2025-09-18",
		ticker: "QQQ",
		side: "SHORT",
		shares: 65,
		entryPrice: 472.5,
		exitPrice: 478.9,
		returnPct: -1.35,
		pnl: -416,
		holdingDays: 6,
	},
	{
		id: 15,
		entryDate: "2025-09-05",
		exitDate: "2025-09-10",
		ticker: "SPY",
		side: "LONG",
		shares: 100,
		entryPrice: 555.8,
		exitPrice: 565.2,
		returnPct: 1.69,
		pnl: 940,
		holdingDays: 5,
	},
]

// Position sizing methods
const positionSizingMethods = [
	{
		value: "equal_weight",
		label: "Equal Weight",
		description: "Allocate equal $ to each position",
	},
	{
		value: "inverse_volatility",
		label: "Inverse Volatility",
		description: "Size inversely proportional to volatility",
	},
	{
		value: "kelly_fraction",
		label: "Kelly Fraction",
		description: "Optimal f based on win rate and payoff",
	},
	{
		value: "fixed_pct",
		label: "Fixed % of Portfolio",
		description: "Fixed percentage per position",
	},
]

// Default strategy template (Python code)
const defaultPythonTemplate = `# Strategy: Mean Reversion
# Entry and exit logic using pandas/numpy

import numpy as np
import pandas as pd


def calculate_signals(data):
    """
    Generate buy/sell signals based on strategy rules.
    
    Parameters:
    -----------
    data : pd.DataFrame
        OHLCV data with columns: open, high, low, close, volume
    
    Returns:
    --------
    pd.Series
        Signal series: 1 = BUY, -1 = SELL, 0 = HOLD
    """
    # Calculate indicators
    data['sma_20'] = data['close'].rolling(20).mean()
    data['sma_200'] = data['close'].rolling(200).mean()
    data['rsi'] = calculate_rsi(data['close'], 14)
    
    # Entry conditions
    buy_signal = (
        (data['close'] > data['sma_200']) &  # Price above long-term trend
        (data['rsi'] < 30) &                   # Oversold
        (data['close'] < data['sma_20'])       # Short-term pullback
    )
    
    # Exit conditions
    sell_signal = (
        (data['rsi'] > 70) |                   # Overbought
        (data['close'] < data['sma_200'])      # Below long-term trend
    )
    
    # Generate signals
    signals = pd.Series(0, index=data.index)
    signals[buy_signal] = 1
    signals[sell_signal] = -1
    
    return signals

def calculate_rsi(prices, period=14):
    """Calculate RSI indicator."""
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))
`

// ============================================================
// TYPES
// ============================================================

type SortConfig = {
	key: string
	direction: "asc" | "desc"
}

type ViewTab = "builder" | "results" | "compare"
type BuilderMode = "form" | "code"
type ResultsTab = "equity" | "monthly" | "trades" | "statistics"

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
	const sign = value >= 0 ? "+" : ""
	return `${sign}${value.toFixed(decimals)}%`
}

const formatNumber = (value: number, decimals = 2) => {
	return value.toFixed(decimals)
}

// ============================================================
// COMPONENT
// ============================================================

export const Route = createFileRoute("/_app/research")({
	component: ResearchPage,
})

function ResearchPage() {
	// State
	const [activeTab, setActiveTab] = useState<ViewTab>("builder")
	const [builderMode, setBuilderMode] = useState<BuilderMode>("form")
	const [resultsTab, setResultsTab] = useState<ResultsTab>("equity")
	const [selectedStrategy, setSelectedStrategy] = useState(mockStrategies[0])
	const [selectedBacktest, setSelectedBacktest] = useState(
		mockBacktestResults[0],
	)
	const [isRunning, setIsRunning] = useState(false)
	const [showSaveDialog, setShowSaveDialog] = useState(false)
	const [tradeSortConfig, setTradeSortConfig] = useState<SortConfig>({
		key: "entryDate",
		direction: "desc",
	})
	const [compareSelected, setCompareSelected] = useState<number[]>([1, 2])

	// Form state for strategy builder
	const [strategyName, setStrategyName] = useState(selectedStrategy.name)
	const [entryRule, setEntryRule] = useState(selectedStrategy.entryRule)
	const [exitRule, setExitRule] = useState(selectedStrategy.exitRule)
	const [universe, setUniverse] = useState(selectedStrategy.universe.join(", "))
	const [positionSizing, setPositionSizing] = useState(
		selectedStrategy.positionSizing,
	)
	const [pythonCode, setPythonCode] = useState(defaultPythonTemplate)

	// Backtest parameters
	const [initialCapital, setInitialCapital] = useState("100000")
	const [commissionRate, setCommissionRate] = useState("0.05")
	const [slippageBps, setSlippageBps] = useState("5")
	const [useMargin, setUseMargin] = useState(false)
	const [walkForward, setWalkForward] = useState(true)
	const [startDate, setStartDate] = useState("2020-01-01")
	const [endDate, setEndDate] = useState("2025-12-31")

	// Sorted trades
	const sortedTrades = useMemo(() => {
		return [...mockTradeLog].sort((a, b) => {
			const aVal = a[tradeSortConfig.key as keyof typeof a]
			const bVal = b[tradeSortConfig.key as keyof typeof b]
			if (typeof aVal === "number" && typeof bVal === "number") {
				return tradeSortConfig.direction === "asc" ? aVal - bVal : bVal - aVal
			}
			return tradeSortConfig.direction === "asc"
				? String(aVal).localeCompare(String(bVal))
				: String(bVal).localeCompare(String(aVal))
		})
	}, [tradeSortConfig])

	// Backtest comparison data
	const comparisonData = useMemo(() => {
		return mockBacktestResults.filter((bt) => compareSelected.includes(bt.id))
	}, [compareSelected])

	// Event handlers
	const handleRunBacktest = () => {
		setIsRunning(true)
		// Simulate backtest running
		setTimeout(() => {
			setIsRunning(false)
			setActiveTab("results")
		}, 2000)
	}

	const handleTradeSort = (key: string) => {
		setTradeSortConfig((prev) => ({
			key,
			direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
		}))
	}

	const SortIcon = ({ column }: { column: string }) => {
		if (tradeSortConfig.key !== column) return null
		return tradeSortConfig.direction === "desc" ? (
			<SortDescending size={10} className="ml-0.5 inline" />
		) : (
			<SortAscending size={10} className="ml-0.5 inline" />
		)
	}

	// Chart calculations
	const equityCurve = mockSelectedBacktest.equityCurve
	const maxEquity = Math.max(
		...equityCurve.map((d) => Math.max(d.value, d.spy)),
	)
	const minEquity = Math.min(
		...equityCurve.map((d) => Math.min(d.value, d.spy)),
	)
	const equityRange = maxEquity - minEquity || 1

	// Monthly returns data
	const monthlyReturns = mockSelectedBacktest.monthlyReturns
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	]
	const years = Object.keys(monthlyReturns).map(Number).sort()

	// Get color for monthly return
	const getReturnColor = (value: number) => {
		if (value >= 5) return "bg-emerald-600 text-white"
		if (value >= 2) return "bg-emerald-500 text-white"
		if (value > 0) return "bg-emerald-400/70 text-emerald-950"
		if (value === 0) return "bg-muted text-muted-foreground"
		if (value > -2) return "bg-rose-400/70 text-rose-950"
		if (value > -5) return "bg-rose-500 text-white"
		return "bg-rose-600 text-white"
	}

	// Status colors
	const statusColors: Record<string, string> = {
		active: "text-emerald-500",
		draft: "text-amber-500",
		completed: "text-blue-500",
		archived: "text-muted-foreground/50",
	}

	return (
		<div className="flex h-full flex-col gap-1">
			{/* Header */}
			<div className="flex items-center justify-between border bg-card px-3 py-2">
				<div className="flex items-center gap-3">
					<span className="font-mono text-sm font-semibold">RESEARCH LAB</span>
					<div className="flex items-center gap-2 text-[10px] text-muted-foreground">
						<span>{mockStrategies.length} strategies</span>
						<span className="text-muted-foreground/50">|</span>
						<span>{mockBacktestResults.length} backtests</span>
					</div>
					{isRunning && (
						<div className="flex items-center gap-1 rounded border border-amber-500/50 bg-amber-500/10 px-2 py-0.5">
							<Lightning size={10} className="animate-pulse text-amber-500" />
							<span className="text-[10px] text-amber-500">
								Running backtest...
							</span>
						</div>
					)}
				</div>
				<div className="flex items-center gap-1.5">
					<Button
						variant="ghost"
						size="xs"
						className="gap-1"
						onClick={() => setShowSaveDialog(true)}
					>
						<FloppyDisk size={14} />
						Save
					</Button>
					<Button variant="ghost" size="xs" className="gap-1">
						<Export size={14} />
						Export
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 gap-1 overflow-hidden">
				{/* Left Column - Strategy List & Parameters */}
				<div className="flex w-72 flex-col gap-1">
					{/* Saved Strategies */}
					<GridPanel
						title="Saved Strategies"
						actions={
							<Button variant="ghost" size="xs" className="h-5 gap-1 px-1">
								<Plus size={12} />
								New
							</Button>
						}
						className="flex-1"
					>
						<div className="space-y-1">
							{mockStrategies.map((strategy) => (
								<div
									key={strategy.id}
									onClick={() => {
										setSelectedStrategy(strategy)
										setStrategyName(strategy.name)
										setEntryRule(strategy.entryRule)
										setExitRule(strategy.exitRule)
										setUniverse(strategy.universe.join(", "))
										setPositionSizing(strategy.positionSizing)
									}}
									className={cn(
										"cursor-pointer border p-2 transition-colors",
										selectedStrategy.id === strategy.id
											? "border-primary bg-primary/5"
											: "border-border/50 hover:border-border hover:bg-foreground/[0.02]",
									)}
								>
									<div className="flex items-center justify-between">
										<span className="text-xs font-medium">{strategy.name}</span>
										<span
											className={`text-[9px] uppercase ${statusColors[strategy.status]}`}
										>
											{strategy.status}
										</span>
									</div>
									<p className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground">
										{strategy.description}
									</p>
									<div className="mt-1 flex items-center gap-2 text-[10px]">
										<span className="text-muted-foreground">
											<Clock size={10} className="mr-0.5 inline" />
											{strategy.lastRun}
										</span>
										{strategy.inSampleSharpe - strategy.outOfSampleSharpe >
											0.5 && (
											<span className="flex items-center gap-0.5 text-amber-500">
												<Warning size={10} />
												Overfit?
											</span>
										)}
									</div>
								</div>
							))}
						</div>
					</GridPanel>

					{/* Backtest Parameters */}
					<GridPanel
						title="Backtest Parameters"
						actions={<Sliders size={12} className="text-muted-foreground" />}
					>
						<div className="space-y-2">
							<div className="grid grid-cols-2 gap-2">
								<div>
									<label className="text-[10px] text-muted-foreground">
										Initial Capital
									</label>
									<Input
										value={initialCapital}
										onChange={(e) => setInitialCapital(e.target.value)}
										className="mt-0.5 h-7 text-xs"
									/>
								</div>
								<div>
									<label className="text-[10px] text-muted-foreground">
										Commission (%)
									</label>
									<Input
										value={commissionRate}
										onChange={(e) => setCommissionRate(e.target.value)}
										className="mt-0.5 h-7 text-xs"
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<div>
									<label className="text-[10px] text-muted-foreground">
										Slippage (bps)
									</label>
									<Input
										value={slippageBps}
										onChange={(e) => setSlippageBps(e.target.value)}
										className="mt-0.5 h-7 text-xs"
									/>
								</div>
								<div className="flex flex-col justify-end">
									<label className="flex items-center gap-1.5 text-[10px]">
										<input
											type="checkbox"
											checked={useMargin}
											onChange={(e) => setUseMargin(e.target.checked)}
											className="rounded border-border"
										/>
										<span>Use Margin</span>
									</label>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<div>
									<label className="text-[10px] text-muted-foreground">
										Start Date
									</label>
									<Input
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="mt-0.5 h-7 text-xs"
									/>
								</div>
								<div>
									<label className="text-[10px] text-muted-foreground">
										End Date
									</label>
									<Input
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="mt-0.5 h-7 text-xs"
									/>
								</div>
							</div>
							<div className="border-t pt-2">
								<label className="flex items-center gap-1.5 text-[10px]">
									<input
										type="checkbox"
										checked={walkForward}
										onChange={(e) => setWalkForward(e.target.checked)}
										className="rounded border-border"
									/>
									<span>Walk-Forward Optimization</span>
									<Info size={10} className="text-muted-foreground" />
								</label>
								{walkForward && (
									<p className="mt-1 text-[9px] text-muted-foreground">
										80% in-sample / 20% out-of-sample rolling windows
									</p>
								)}
							</div>
						</div>
					</GridPanel>

					{/* Run Button */}
					<Button
						className="w-full gap-2"
						onClick={handleRunBacktest}
						disabled={isRunning}
					>
						{isRunning ? (
							<>
								<Stop size={16} />
								Running...
							</>
						) : (
							<>
								<Play size={16} weight="fill" />
								Run Backtest
							</>
						)}
					</Button>
				</div>

				{/* Center - Main Content Area */}
				<div className="flex flex-1 flex-col gap-1 overflow-hidden">
					{/* Tab Navigation */}
					<div className="flex items-center gap-1 border bg-card px-2 py-1">
						{[
							{ key: "builder", label: "Strategy Builder", icon: Code },
							{ key: "results", label: "Results Dashboard", icon: ChartLineUp },
							{ key: "compare", label: "Compare Backtests", icon: Scales },
						].map(({ key, label, icon: Icon }) => (
							<button
								key={key}
								onClick={() => setActiveTab(key as ViewTab)}
								className={cn(
									"flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
									activeTab === key
										? "bg-foreground/10 text-foreground"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<Icon size={14} />
								{label}
							</button>
						))}
					</div>

					{/* Strategy Builder Tab */}
					{activeTab === "builder" && (
						<div className="flex flex-1 flex-col gap-1 overflow-hidden">
							{/* Mode Toggle */}
							<div className="flex items-center gap-1 border bg-card px-2 py-1">
								<button
									onClick={() => setBuilderMode("form")}
									className={cn(
										"flex items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors",
										builderMode === "form"
											? "bg-foreground/10 text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									<Sliders size={12} />
									Form Builder
								</button>
								<button
									onClick={() => setBuilderMode("code")}
									className={cn(
										"flex items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors",
										builderMode === "code"
											? "bg-foreground/10 text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									<Code size={12} />
									Python Editor
								</button>
							</div>

							{builderMode === "form" ? (
								<div className="flex-1 overflow-auto border bg-card p-4">
									<div className="mx-auto max-w-3xl space-y-4">
										{/* Strategy Name */}
										<div>
											<label className="text-xs font-medium">
												Strategy Name
											</label>
											<Input
												value={strategyName}
												onChange={(e) => setStrategyName(e.target.value)}
												className="mt-1"
												placeholder="Enter strategy name..."
											/>
										</div>

										{/* Universe */}
										<div>
											<label className="text-xs font-medium">Universe</label>
											<p className="text-[10px] text-muted-foreground">
												Tickers to trade (comma-separated)
											</p>
											<Input
												value={universe}
												onChange={(e) => setUniverse(e.target.value)}
												className="mt-1 font-mono"
												placeholder="SPY, QQQ, IWM..."
											/>
										</div>

										{/* Entry Rule */}
										<div>
											<label className="text-xs font-medium">Entry Rule</label>
											<p className="text-[10px] text-muted-foreground">
												Conditions to enter a position (Python expression)
											</p>
											<Textarea
												value={entryRule}
												onChange={(e) => setEntryRule(e.target.value)}
												className="mt-1 font-mono text-xs"
												placeholder="signal == 'BUY' and rsi_14 < 30 and close > sma_200"
												rows={3}
											/>
											<div className="mt-1 flex flex-wrap gap-1">
												{[
													"rsi_14 < 30",
													"close > sma_200",
													"volume > avg_volume",
													"macd_cross",
												].map((hint) => (
													<button
														key={hint}
														onClick={() =>
															setEntryRule((prev) =>
																prev ? `${prev} and ${hint}` : hint,
															)
														}
														className="rounded border px-1.5 py-0.5 text-[9px] text-muted-foreground hover:bg-foreground/5"
													>
														+ {hint}
													</button>
												))}
											</div>
										</div>

										{/* Exit Rule */}
										<div>
											<label className="text-xs font-medium">Exit Rule</label>
											<p className="text-[10px] text-muted-foreground">
												Conditions to exit a position (Python expression)
											</p>
											<Textarea
												value={exitRule}
												onChange={(e) => setExitRule(e.target.value)}
												className="mt-1 font-mono text-xs"
												placeholder="signal == 'SELL' or holding_days > 10 or pnl > 5%"
												rows={3}
											/>
											<div className="mt-1 flex flex-wrap gap-1">
												{[
													"rsi_14 > 70",
													"holding_days > 10",
													"pnl > 5%",
													"stop_loss(-2%)",
												].map((hint) => (
													<button
														key={hint}
														onClick={() =>
															setExitRule((prev) =>
																prev ? `${prev} or ${hint}` : hint,
															)
														}
														className="rounded border px-1.5 py-0.5 text-[9px] text-muted-foreground hover:bg-foreground/5"
													>
														+ {hint}
													</button>
												))}
											</div>
										</div>

										{/* Position Sizing */}
										<div>
											<label className="text-xs font-medium">
												Position Sizing
											</label>
											<div className="mt-1 grid grid-cols-2 gap-2">
												{positionSizingMethods.map((method) => (
													<button
														key={method.value}
														onClick={() => setPositionSizing(method.value)}
														className={cn(
															"border p-2 text-left transition-colors",
															positionSizing === method.value
																? "border-primary bg-primary/5"
																: "border-border/50 hover:border-border",
														)}
													>
														<span className="text-xs font-medium">
															{method.label}
														</span>
														<p className="mt-0.5 text-[10px] text-muted-foreground">
															{method.description}
														</p>
													</button>
												))}
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="flex-1 overflow-hidden border bg-card">
									{/* Code Editor (simplified - would use CodeMirror in production) */}
									<div className="flex h-full flex-col">
										<div className="flex items-center justify-between border-b px-3 py-1.5">
											<span className="text-[10px] text-muted-foreground">
												strategy.py
											</span>
											<div className="flex items-center gap-1">
												<Button
													variant="ghost"
													size="xs"
													className="h-5 gap-1 px-1.5"
												>
													<Copy size={12} />
													Copy
												</Button>
												<Button
													variant="ghost"
													size="xs"
													className="h-5 gap-1 px-1.5"
												>
													<ArrowBendUpRight size={12} />
													Format
												</Button>
											</div>
										</div>
										<Textarea
											value={pythonCode}
											onChange={(e) => setPythonCode(e.target.value)}
											className="h-full flex-1 resize-none rounded-none border-0 font-mono text-xs leading-relaxed focus-visible:ring-0"
											style={{ minHeight: "400px" }}
										/>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Results Dashboard Tab */}
					{activeTab === "results" && (
						<div className="flex flex-1 flex-col gap-1 overflow-hidden">
							{/* Results Sub-tabs */}
							<div className="flex items-center gap-1 border bg-card px-2 py-1">
								{[
									{ key: "equity", label: "Equity Curve", icon: ChartLine },
									{
										key: "monthly",
										label: "Monthly Returns",
										icon: CalendarBlank,
									},
									{ key: "trades", label: "Trade Log", icon: Table },
									{ key: "statistics", label: "Statistics", icon: ChartBar },
								].map(({ key, label, icon: Icon }) => (
									<button
										key={key}
										onClick={() => setResultsTab(key as ResultsTab)}
										className={cn(
											"flex items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors",
											resultsTab === key
												? "bg-foreground/10 text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										<Icon size={12} />
										{label}
									</button>
								))}
							</div>

							{/* Equity Curve */}
							{resultsTab === "equity" && (
								<div className="flex flex-1 flex-col gap-1 overflow-hidden">
									{/* Main Equity Chart */}
									<GridPanel
										title="Equity Curve"
										actions={
											<div className="flex items-center gap-2 text-[10px]">
												<span className="flex items-center gap-1">
													<span className="h-2 w-2 rounded-full bg-emerald-500" />
													Strategy
												</span>
												<span className="flex items-center gap-1">
													<span className="h-2 w-2 rounded-full bg-blue-500" />
													SPY
												</span>
											</div>
										}
										className="flex-1"
									>
										<div className="relative h-full min-h-[200px]">
											{/* Y-axis labels */}
											<div className="absolute top-0 left-0 flex h-full w-12 flex-col justify-between text-[9px] text-muted-foreground">
												<span>{formatCurrency(maxEquity)}</span>
												<span>
													{formatCurrency((maxEquity + minEquity) / 2)}
												</span>
												<span>{formatCurrency(minEquity)}</span>
											</div>
											{/* Chart area */}
											<div className="mr-2 ml-14 h-full">
												<svg
													className="h-full w-full"
													viewBox="0 0 100 50"
													preserveAspectRatio="none"
												>
													{/* Grid lines */}
													{[0, 25, 50, 75, 100].map((y) => (
														<line
															key={y}
															x1="0"
															y1={50 - y / 2}
															x2="100"
															y2={50 - y / 2}
															stroke="currentColor"
															strokeOpacity="0.1"
															strokeWidth="0.2"
														/>
													))}
													{/* SPY line */}
													<polyline
														fill="none"
														stroke="rgb(59, 130, 246)"
														strokeWidth="0.5"
														points={equityCurve
															.map((d, i) => {
																const x = (i / (equityCurve.length - 1)) * 100
																const y =
																	50 - ((d.spy - minEquity) / equityRange) * 50
																return `${x},${y}`
															})
															.join(" ")}
													/>
													{/* Strategy line */}
													<polyline
														fill="none"
														stroke="rgb(16, 185, 129)"
														strokeWidth="0.5"
														points={equityCurve
															.map((d, i) => {
																const x = (i / (equityCurve.length - 1)) * 100
																const y =
																	50 -
																	((d.value - minEquity) / equityRange) * 50
																return `${x},${y}`
															})
															.join(" ")}
													/>
												</svg>
											</div>
											{/* X-axis labels */}
											<div className="mr-2 ml-14 flex justify-between text-[9px] text-muted-foreground">
												{equityCurve
													.filter((_, i) => i % 12 === 0)
													.map((d) => (
														<span key={d.date}>{d.date.slice(0, 4)}</span>
													))}
											</div>
										</div>
									</GridPanel>

									{/* Drawdown Chart */}
									<GridPanel title="Underwater (Drawdown)" className="h-32">
										<div className="relative h-full">
											<div className="absolute top-0 left-0 flex h-full w-12 flex-col justify-between text-[9px] text-muted-foreground">
												<span>0%</span>
												<span>-6%</span>
												<span>-12%</span>
											</div>
											<div className="mr-2 ml-14 h-full">
												<svg
													className="h-full w-full"
													viewBox="0 0 100 30"
													preserveAspectRatio="none"
												>
													{/* Zero line */}
													<line
														x1="0"
														y1="0"
														x2="100"
														y2="0"
														stroke="currentColor"
														strokeOpacity="0.2"
														strokeWidth="0.2"
													/>
													{/* Drawdown area */}
													<path
														fill="rgba(244, 63, 94, 0.3)"
														stroke="rgb(244, 63, 94)"
														strokeWidth="0.3"
														d={`M0,0 ${equityCurve
															.map((d, i) => {
																const x = (i / (equityCurve.length - 1)) * 100
																const y = Math.abs(d.drawdown) * 2.5 // Scale drawdown
																return `L${x},${y}`
															})
															.join(" ")} L100,0 Z`}
													/>
												</svg>
											</div>
										</div>
									</GridPanel>
								</div>
							)}

							{/* Monthly Returns Heatmap */}
							{resultsTab === "monthly" && (
								<GridPanel
									title="Monthly Returns Heatmap"
									className="flex-1 overflow-auto"
								>
									<div className="min-w-[600px]">
										<table className="w-full">
											<thead>
												<tr className="text-[10px] text-muted-foreground">
													<th className="p-1 text-left font-medium">YEAR</th>
													{months.map((m) => (
														<th key={m} className="p-1 text-center font-medium">
															{m}
														</th>
													))}
													<th className="p-1 text-right font-medium">TOTAL</th>
												</tr>
											</thead>
											<tbody>
												{years.map((year) => {
													const yearData =
														monthlyReturns[year as keyof typeof monthlyReturns]
													const yearTotal = Object.values(yearData).reduce(
														(a, b) => a + b,
														0,
													)
													return (
														<tr key={year} className="text-xs">
															<td className="p-1 font-mono font-medium">
																{year}
															</td>
															{months.map((m) => {
																const value =
																	yearData[m as keyof typeof yearData]
																return (
																	<td key={m} className="p-0.5">
																		<div
																			className={cn(
																				"flex h-7 items-center justify-center font-mono text-[10px]",
																				getReturnColor(value),
																			)}
																		>
																			{value !== 0
																				? formatPercent(value, 1).replace(
																						"+",
																						"",
																					)
																				: "-"}
																		</div>
																	</td>
																)
															})}
															<td
																className={cn(
																	"p-1 text-right font-mono font-medium",
																	yearTotal >= 0
																		? "text-emerald-500"
																		: "text-rose-500",
																)}
															>
																{formatPercent(yearTotal, 1)}
															</td>
														</tr>
													)
												})}
											</tbody>
										</table>
										{/* Legend */}
										<div className="mt-4 flex items-center justify-center gap-2">
											<span className="text-[10px] text-muted-foreground">
												Returns:
											</span>
											{[
												{ label: "< -5%", color: "bg-rose-600" },
												{ label: "-5% to -2%", color: "bg-rose-500" },
												{ label: "-2% to 0%", color: "bg-rose-400/70" },
												{ label: "0%", color: "bg-muted" },
												{ label: "0% to 2%", color: "bg-emerald-400/70" },
												{ label: "2% to 5%", color: "bg-emerald-500" },
												{ label: "> 5%", color: "bg-emerald-600" },
											].map((item) => (
												<div
													key={item.label}
													className="flex items-center gap-1"
												>
													<span className={cn("h-3 w-3", item.color)} />
													<span className="text-[9px] text-muted-foreground">
														{item.label}
													</span>
												</div>
											))}
										</div>
									</div>
								</GridPanel>
							)}

							{/* Trade Log */}
							{resultsTab === "trades" && (
								<div className="flex flex-1 flex-col overflow-hidden border bg-card">
									<div className="flex items-center justify-between border-b px-3 py-1.5 text-[10px]">
										<span className="text-muted-foreground">
											{mockTradeLog.length} trades | Click column to sort
										</span>
										<div className="flex items-center gap-2">
											<span className="text-emerald-500">
												{mockTradeLog.filter((t) => t.pnl > 0).length} wins
											</span>
											<span className="text-rose-500">
												{mockTradeLog.filter((t) => t.pnl < 0).length} losses
											</span>
										</div>
									</div>
									<div className="flex-1 overflow-auto">
										<table className="w-full text-xs">
											<thead className="sticky top-0 bg-card">
												<tr className="border-b text-[10px] text-muted-foreground">
													<th
														className="cursor-pointer px-3 py-1.5 text-left font-medium hover:text-foreground"
														onClick={() => handleTradeSort("entryDate")}
													>
														ENTRY <SortIcon column="entryDate" />
													</th>
													<th
														className="cursor-pointer px-3 py-1.5 text-left font-medium hover:text-foreground"
														onClick={() => handleTradeSort("exitDate")}
													>
														EXIT <SortIcon column="exitDate" />
													</th>
													<th className="px-3 py-1.5 text-left font-medium">
														TICKER
													</th>
													<th className="px-3 py-1.5 text-center font-medium">
														SIDE
													</th>
													<th
														className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
														onClick={() => handleTradeSort("shares")}
													>
														SHARES <SortIcon column="shares" />
													</th>
													<th className="px-3 py-1.5 text-right font-medium">
														ENTRY $
													</th>
													<th className="px-3 py-1.5 text-right font-medium">
														EXIT $
													</th>
													<th
														className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
														onClick={() => handleTradeSort("returnPct")}
													>
														RETURN % <SortIcon column="returnPct" />
													</th>
													<th
														className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
														onClick={() => handleTradeSort("pnl")}
													>
														P&L <SortIcon column="pnl" />
													</th>
													<th
														className="cursor-pointer px-3 py-1.5 text-right font-medium hover:text-foreground"
														onClick={() => handleTradeSort("holdingDays")}
													>
														DAYS <SortIcon column="holdingDays" />
													</th>
												</tr>
											</thead>
											<tbody>
												{sortedTrades.map((trade) => (
													<tr
														key={trade.id}
														className="border-b border-border/50 hover:bg-foreground/[0.02]"
													>
														<td className="px-3 py-1.5 font-mono text-muted-foreground">
															{trade.entryDate}
														</td>
														<td className="px-3 py-1.5 font-mono text-muted-foreground">
															{trade.exitDate}
														</td>
														<td className="px-3 py-1.5 font-mono font-medium">
															{trade.ticker}
														</td>
														<td className="px-3 py-1.5 text-center">
															<span
																className={cn(
																	"rounded px-1.5 py-0.5 text-[9px] font-medium",
																	trade.side === "LONG"
																		? "bg-emerald-500/20 text-emerald-500"
																		: "bg-rose-500/20 text-rose-500",
																)}
															>
																{trade.side}
															</span>
														</td>
														<td className="px-3 py-1.5 text-right font-mono">
															{trade.shares}
														</td>
														<td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
															${trade.entryPrice.toFixed(2)}
														</td>
														<td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
															${trade.exitPrice.toFixed(2)}
														</td>
														<td
															className={cn(
																"px-3 py-1.5 text-right font-mono",
																trade.returnPct >= 0
																	? "text-emerald-500"
																	: "text-rose-500",
															)}
														>
															{trade.returnPct >= 0 ? "+" : ""}
															{trade.returnPct.toFixed(2)}%
														</td>
														<td
															className={cn(
																"px-3 py-1.5 text-right font-mono",
																trade.pnl >= 0
																	? "text-emerald-500"
																	: "text-rose-500",
															)}
														>
															{trade.pnl >= 0 ? "+" : ""}
															{formatCurrency(trade.pnl)}
														</td>
														<td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
															{trade.holdingDays}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)}

							{/* Statistics */}
							{resultsTab === "statistics" && (
								<div className="flex-1 overflow-auto p-1">
									<div className="grid grid-cols-3 gap-1">
										{/* Returns */}
										<GridPanel title="Returns">
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Total Return
													</span>
													<span className="font-mono text-sm text-emerald-500">
														+{selectedBacktest.totalReturn.toFixed(2)}%
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														CAGR
													</span>
													<span className="font-mono text-sm text-emerald-500">
														+{selectedBacktest.cagr.toFixed(2)}%
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Final Value
													</span>
													<span className="font-mono text-sm">
														{formatCurrency(selectedBacktest.finalValue)}
													</span>
												</div>
											</div>
										</GridPanel>

										{/* Risk-Adjusted */}
										<GridPanel title="Risk-Adjusted Returns">
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Sharpe Ratio
													</span>
													<span
														className={cn(
															"font-mono text-sm",
															selectedBacktest.sharpeRatio >= 1.5
																? "text-emerald-500"
																: selectedBacktest.sharpeRatio >= 1
																	? "text-foreground"
																	: "text-amber-500",
														)}
													>
														{selectedBacktest.sharpeRatio.toFixed(2)}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Sortino Ratio
													</span>
													<span className="font-mono text-sm">
														{selectedBacktest.sortinoRatio.toFixed(2)}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Calmar Ratio
													</span>
													<span className="font-mono text-sm">
														{selectedBacktest.calmarRatio.toFixed(2)}
													</span>
												</div>
											</div>
										</GridPanel>

										{/* Drawdown */}
										<GridPanel title="Drawdown">
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Max Drawdown
													</span>
													<span className="font-mono text-sm text-rose-500">
														{selectedBacktest.maxDrawdown.toFixed(2)}%
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Avg DD Duration
													</span>
													<span className="font-mono text-sm">
														{selectedBacktest.avgDrawdownDuration} days
													</span>
												</div>
											</div>
										</GridPanel>

										{/* Trading Statistics */}
										<GridPanel title="Trading Statistics">
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Win Rate
													</span>
													<span
														className={cn(
															"font-mono text-sm",
															selectedBacktest.winRate >= 55
																? "text-emerald-500"
																: selectedBacktest.winRate >= 45
																	? "text-foreground"
																	: "text-rose-500",
														)}
													>
														{selectedBacktest.winRate.toFixed(1)}%
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Profit Factor
													</span>
													<span className="font-mono text-sm">
														{selectedBacktest.profitFactor.toFixed(2)}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Avg Win/Loss
													</span>
													<span className="font-mono text-sm">
														{selectedBacktest.avgWinLoss.toFixed(2)}x
													</span>
												</div>
											</div>
										</GridPanel>

										{/* Trade Counts */}
										<GridPanel title="Trade Activity">
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Total Trades
													</span>
													<span className="font-mono text-sm">
														{selectedBacktest.numTrades}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Avg Holding Period
													</span>
													<span className="font-mono text-sm">
														{selectedBacktest.avgHoldingPeriod.toFixed(1)} days
													</span>
												</div>
											</div>
										</GridPanel>

										{/* Benchmark Comparison */}
										<GridPanel title="vs SPY Benchmark">
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Beta
													</span>
													<span className="font-mono text-sm">
														{selectedBacktest.betaToSpy.toFixed(2)}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Alpha
													</span>
													<span className="font-mono text-sm text-emerald-500">
														+{selectedBacktest.alpha.toFixed(2)}%
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-[10px] text-muted-foreground">
														Correlation
													</span>
													<span className="font-mono text-sm">
														{selectedBacktest.correlationToSpy.toFixed(2)}
													</span>
												</div>
											</div>
										</GridPanel>

										{/* Deflated Sharpe */}
										<GridPanel
											title="Overfitting Analysis"
											className="col-span-3"
										>
											<div className="grid grid-cols-3 gap-4">
												<div>
													<p className="text-[10px] text-muted-foreground">
														Deflated Sharpe Ratio
													</p>
													<p
														className={cn(
															"font-mono text-lg",
															selectedBacktest.deflatedSharpe >= 1.5
																? "text-emerald-500"
																: selectedBacktest.deflatedSharpe >= 1
																	? "text-foreground"
																	: "text-amber-500",
														)}
													>
														{selectedBacktest.deflatedSharpe.toFixed(2)}
													</p>
													<p className="text-[9px] text-muted-foreground">
														Corrected for multiple testing
													</p>
												</div>
												<div>
													<p className="text-[10px] text-muted-foreground">
														In-Sample Sharpe
													</p>
													<p className="font-mono text-lg">
														{mockStrategies[0].inSampleSharpe.toFixed(2)}
													</p>
												</div>
												<div>
													<p className="text-[10px] text-muted-foreground">
														Out-of-Sample Sharpe
													</p>
													<p className="font-mono text-lg">
														{mockStrategies[0].outOfSampleSharpe.toFixed(2)}
													</p>
												</div>
												{selectedBacktest.isOverfit && (
													<div className="col-span-3 flex items-center gap-2 rounded border border-amber-500/50 bg-amber-500/10 p-2">
														<Warning size={16} className="text-amber-500" />
														<div>
															<p className="text-xs font-medium text-amber-500">
																Potential Overfitting Detected
															</p>
															<p className="text-[10px] text-amber-500/80">
																In-sample Sharpe is significantly higher than
																out-of-sample. Consider simplifying the strategy
																or using more robust features.
															</p>
														</div>
													</div>
												)}
											</div>
										</GridPanel>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Compare Backtests Tab */}
					{activeTab === "compare" && (
						<div className="flex flex-1 flex-col gap-1 overflow-hidden">
							{/* Selection */}
							<GridPanel title="Select Backtests to Compare">
								<div className="flex flex-wrap gap-2">
									{mockBacktestResults.map((bt) => (
										<label
											key={bt.id}
											className={cn(
												"flex cursor-pointer items-center gap-2 border p-2 transition-colors",
												compareSelected.includes(bt.id)
													? "border-primary bg-primary/5"
													: "border-border/50 hover:border-border",
											)}
										>
											<input
												type="checkbox"
												checked={compareSelected.includes(bt.id)}
												onChange={(e) => {
													if (e.target.checked) {
														setCompareSelected([...compareSelected, bt.id])
													} else {
														setCompareSelected(
															compareSelected.filter((id) => id !== bt.id),
														)
													}
												}}
												className="rounded border-border"
											/>
											<div>
												<p className="text-xs font-medium">{bt.name}</p>
												<p className="text-[10px] text-muted-foreground">
													{bt.period}
												</p>
											</div>
										</label>
									))}
								</div>
							</GridPanel>

							{/* Comparison Table */}
							<GridPanel
								title="Comparison Table"
								className="flex-1 overflow-auto"
							>
								<table className="w-full text-xs">
									<thead>
										<tr className="border-b text-[10px] text-muted-foreground">
											<th className="px-2 py-1.5 text-left font-medium">
												METRIC
											</th>
											{comparisonData.map((bt) => (
												<th
													key={bt.id}
													className="px-2 py-1.5 text-right font-medium"
												>
													{bt.name}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{[
											{
												label: "Total Return",
												key: "totalReturn",
												format: (v: number) => formatPercent(v),
												positive: true,
											},
											{
												label: "CAGR",
												key: "cagr",
												format: (v: number) => formatPercent(v),
												positive: true,
											},
											{
												label: "Sharpe Ratio",
												key: "sharpeRatio",
												format: (v: number) => formatNumber(v),
												positive: true,
											},
											{
												label: "Sortino Ratio",
												key: "sortinoRatio",
												format: (v: number) => formatNumber(v),
												positive: true,
											},
											{
												label: "Calmar Ratio",
												key: "calmarRatio",
												format: (v: number) => formatNumber(v),
												positive: true,
											},
											{
												label: "Max Drawdown",
												key: "maxDrawdown",
												format: (v: number) => formatPercent(v),
												positive: false,
											},
											{
												label: "Win Rate",
												key: "winRate",
												format: (v: number) => `${v.toFixed(1)}%`,
												positive: true,
											},
											{
												label: "Profit Factor",
												key: "profitFactor",
												format: (v: number) => formatNumber(v),
												positive: true,
											},
											{
												label: "Num Trades",
												key: "numTrades",
												format: (v: number) => v.toString(),
												positive: null,
											},
											{
												label: "Avg Holding (days)",
												key: "avgHoldingPeriod",
												format: (v: number) => formatNumber(v, 1),
												positive: null,
											},
											{
												label: "Beta to SPY",
												key: "betaToSpy",
												format: (v: number) => formatNumber(v),
												positive: null,
											},
											{
												label: "Alpha",
												key: "alpha",
												format: (v: number) => formatPercent(v),
												positive: true,
											},
											{
												label: "Correlation to SPY",
												key: "correlationToSpy",
												format: (v: number) => formatNumber(v),
												positive: null,
											},
											{
												label: "Deflated Sharpe",
												key: "deflatedSharpe",
												format: (v: number) => formatNumber(v),
												positive: true,
											},
										].map((metric) => {
											const values = comparisonData.map(
												(bt) => bt[metric.key as keyof typeof bt] as number,
											)
											const best =
												metric.positive === true
													? Math.max(...values)
													: metric.positive === false
														? Math.min(...values)
														: null
											return (
												<tr
													key={metric.key}
													className="border-b border-border/50"
												>
													<td className="px-2 py-1.5 text-muted-foreground">
														{metric.label}
													</td>
													{comparisonData.map((bt) => {
														const value = bt[
															metric.key as keyof typeof bt
														] as number
														const isBest = best !== null && value === best
														return (
															<td
																key={bt.id}
																className={cn(
																	"px-2 py-1.5 text-right font-mono",
																	isBest && "font-medium text-emerald-500",
																)}
															>
																{metric.format(value)}
																{isBest && " ★"}
															</td>
														)
													})}
												</tr>
											)
										})}
									</tbody>
								</table>
							</GridPanel>
						</div>
					)}
				</div>

				{/* Right Column - Quick Stats & Recent Results */}
				<div className="flex w-80 flex-col gap-1">
					{/* Current Backtest Summary */}
					<GridPanel title="Selected Backtest">
						<div className="space-y-3">
							<div>
								<p className="text-xs font-medium">{selectedBacktest.name}</p>
								<p className="text-[10px] text-muted-foreground">
									{selectedBacktest.period}
								</p>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<div className="border p-2">
									<p className="text-[10px] text-muted-foreground">
										TOTAL RETURN
									</p>
									<p className="font-mono text-sm text-emerald-500">
										+{selectedBacktest.totalReturn.toFixed(2)}%
									</p>
								</div>
								<div className="border p-2">
									<p className="text-[10px] text-muted-foreground">SHARPE</p>
									<p className="font-mono text-sm">
										{selectedBacktest.sharpeRatio.toFixed(2)}
									</p>
								</div>
								<div className="border p-2">
									<p className="text-[10px] text-muted-foreground">MAX DD</p>
									<p className="font-mono text-sm text-rose-500">
										{selectedBacktest.maxDrawdown.toFixed(2)}%
									</p>
								</div>
								<div className="border p-2">
									<p className="text-[10px] text-muted-foreground">WIN RATE</p>
									<p className="font-mono text-sm">
										{selectedBacktest.winRate.toFixed(1)}%
									</p>
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex items-center justify-between text-[10px]">
									<span className="text-muted-foreground">CAGR</span>
									<span className="font-mono text-emerald-500">
										+{selectedBacktest.cagr.toFixed(2)}%
									</span>
								</div>
								<div className="flex items-center justify-between text-[10px]">
									<span className="text-muted-foreground">Profit Factor</span>
									<span className="font-mono">
										{selectedBacktest.profitFactor.toFixed(2)}
									</span>
								</div>
								<div className="flex items-center justify-between text-[10px]">
									<span className="text-muted-foreground">Trades</span>
									<span className="font-mono">
										{selectedBacktest.numTrades}
									</span>
								</div>
							</div>
						</div>
					</GridPanel>

					{/* Recent Backtests */}
					<GridPanel
						title="Recent Backtests"
						actions={<Clock size={12} className="text-muted-foreground" />}
						className="flex-1"
					>
						<div className="space-y-1">
							{mockBacktestResults.map((bt) => (
								<div
									key={bt.id}
									onClick={() => setSelectedBacktest(bt)}
									className={cn(
										"cursor-pointer border p-2 transition-colors",
										selectedBacktest.id === bt.id
											? "border-primary bg-primary/5"
											: "border-border/50 hover:border-border hover:bg-foreground/[0.02]",
									)}
								>
									<div className="flex items-center justify-between">
										<span className="text-xs font-medium">{bt.name}</span>
										{bt.isOverfit && (
											<Warning size={12} className="text-amber-500" />
										)}
									</div>
									<div className="mt-1 flex items-center gap-3 text-[10px]">
										<span className="font-mono text-emerald-500">
											+{bt.totalReturn.toFixed(1)}%
										</span>
										<span className="font-mono text-muted-foreground">
											SR: {bt.sharpeRatio.toFixed(2)}
										</span>
										<span className="font-mono text-rose-500">
											DD: {bt.maxDrawdown.toFixed(1)}%
										</span>
									</div>
									<p className="mt-0.5 text-[9px] text-muted-foreground">
										{bt.runDate}
									</p>
								</div>
							))}
						</div>
					</GridPanel>

					{/* Tips */}
					<GridPanel title="Tips" className="shrink-0">
						<div className="space-y-2 text-[10px] text-muted-foreground">
							<div className="flex items-start gap-2">
								<CheckCircle
									size={12}
									className="mt-0.5 shrink-0 text-emerald-500"
								/>
								<span>
									Use walk-forward optimization to validate out-of-sample
									performance
								</span>
							</div>
							<div className="flex items-start gap-2">
								<Warning size={12} className="mt-0.5 shrink-0 text-amber-500" />
								<span>
									Watch for overfitting: large gap between in-sample and
									out-of-sample Sharpe
								</span>
							</div>
							<div className="flex items-start gap-2">
								<Info size={12} className="mt-0.5 shrink-0 text-blue-500" />
								<span>Deflated Sharpe corrects for multiple testing bias</span>
							</div>
						</div>
					</GridPanel>
				</div>
			</div>

			{/* Save Strategy Dialog */}
			<Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Save Strategy</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div>
							<label className="text-xs font-medium">Strategy Name</label>
							<Input
								value={strategyName}
								onChange={(e) => setStrategyName(e.target.value)}
								className="mt-1"
							/>
						</div>
						<div>
							<label className="text-xs font-medium">Description</label>
							<Textarea
								placeholder="Describe your strategy..."
								className="mt-1"
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowSaveDialog(false)}>
							Cancel
						</Button>
						<Button onClick={() => setShowSaveDialog(false)}>
							Save Strategy
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
