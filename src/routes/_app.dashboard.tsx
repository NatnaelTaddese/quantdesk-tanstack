import { Plus, TrendDown, TrendUp } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import { GridPanel } from "@/components/layout/grid"

const marketIndices = [
	{
		symbol: "S&P 500",
		name: "SPX",
		price: 5892.45,
		change: 0.87,
		color: "emerald",
	},
	{
		symbol: "NASDAQ",
		name: "IXIC",
		price: 18543.32,
		change: 1.24,
		color: "emerald",
	},
	{
		symbol: "DOW JONES",
		name: "DJI",
		price: 43235.78,
		change: -0.23,
		color: "rose",
	},
	{ symbol: "VIX", name: "VIX", price: 14.82, change: -3.45, color: "rose" },
	{
		symbol: "10Y YIELD",
		name: "US10Y",
		price: 4.32,
		change: 0.05,
		color: "emerald",
	},
	{ symbol: "DXY", name: "DXY", price: 103.45, change: -0.12, color: "rose" },
]

const watchlist = [
	{
		symbol: "AAPL",
		name: "Apple Inc.",
		price: 189.84,
		change: 1.23,
		high52: 199.62,
		low52: 124.17,
	},
	{
		symbol: "MSFT",
		name: "Microsoft Corp.",
		price: 415.56,
		change: -0.45,
		high52: 430.82,
		low52: 309.45,
	},
	{
		symbol: "NVDA",
		name: "NVIDIA Corp.",
		price: 878.34,
		change: 3.12,
		high52: 974.0,
		low52: 222.97,
	},
	{
		symbol: "AMZN",
		name: "Amazon.com",
		price: 178.25,
		change: 0.67,
		high52: 189.77,
		low52: 101.26,
	},
	{
		symbol: "GOOGL",
		name: "Alphabet Inc.",
		price: 155.72,
		change: -0.89,
		high52: 191.75,
		low52: 102.21,
	},
	{
		symbol: "META",
		name: "Meta Platforms",
		price: 502.3,
		change: 1.56,
		high52: 542.81,
		low52: 274.38,
	},
	{
		symbol: "TSLA",
		name: "Tesla Inc.",
		price: 175.21,
		change: -2.34,
		high52: 299.29,
		low52: 138.8,
	},
	{
		symbol: "JPM",
		name: "JPMorgan Chase",
		price: 198.45,
		change: 0.32,
		high52: 205.88,
		low52: 135.19,
	},
]

const topSignals = {
	buy: [
		{ ticker: "NVDA", score: 94, model: "LSTM v3", confidence: 92 },
		{ ticker: "AMD", score: 89, model: "Transformer", confidence: 87 },
		{ ticker: "META", score: 86, model: "Random Forest", confidence: 84 },
		{ ticker: "GOOGL", score: 82, model: "LSTM v3", confidence: 79 },
		{ ticker: "AMZN", score: 78, model: "XGBoost", confidence: 75 },
	],
	sell: [
		{ ticker: "INTC", score: 91, model: "LSTM v3", confidence: 88 },
		{ ticker: "BA", score: 87, model: "Transformer", confidence: 85 },
		{ ticker: "DIS", score: 83, model: "Random Forest", confidence: 81 },
		{ ticker: "NKE", score: 79, model: "XGBoost", confidence: 76 },
		{ ticker: "PFE", score: 75, model: "LSTM v3", confidence: 72 },
	],
}

const recentAlerts = [
	{
		type: "PRICE",
		ticker: "NVDA",
		message: "Price crossed above $875",
		time: "09:45",
	},
	{
		type: "SIGNAL",
		ticker: "AMD",
		message: "Strong BUY signal generated",
		time: "09:32",
	},
	{
		type: "PRICE",
		ticker: "TSLA",
		message: "Price dropped below $180",
		time: "09:15",
	},
	{
		type: "SIGNAL",
		ticker: "INTC",
		message: "Strong SELL signal generated",
		time: "08:58",
	},
	{
		type: "PRICE",
		ticker: "AAPL",
		message: "New 52-week high reached",
		time: "08:42",
	},
	{
		type: "VOLUME",
		ticker: "AMD",
		message: "Volume spike detected (3.2x avg)",
		time: "08:30",
	},
	{
		type: "SIGNAL",
		ticker: "META",
		message: "BUY signal generated",
		time: "08:15",
	},
	{
		type: "PRICE",
		ticker: "MSFT",
		message: "Price crossed below $420",
		time: "07:55",
	},
	{
		type: "SIGNAL",
		ticker: "BA",
		message: "SELL signal generated",
		time: "07:40",
	},
	{
		type: "PRICE",
		ticker: "JPM",
		message: "New 52-week low avoided",
		time: "07:22",
	},
]

const macroCalendar = [
	{
		event: "FOMC Meeting Minutes",
		date: "Mar 19",
		time: "14:00",
		impact: "high",
	},
	{ event: "CPI (YoY)", date: "Mar 20", time: "08:30", impact: "high" },
	{ event: "Retail Sales", date: "Mar 21", time: "08:30", impact: "medium" },
	{ event: "NFP Report", date: "Mar 28", time: "08:30", impact: "high" },
	{ event: "PCE Inflation", date: "Mar 29", time: "08:30", impact: "medium" },
]

const portfolioPnL = [
	{ time: "9:30", pnl: 0 },
	{ time: "10:00", pnl: 1250 },
	{ time: "10:30", pnl: 2100 },
	{ time: "11:00", pnl: 1850 },
	{ time: "11:30", pnl: 3200 },
	{ time: "12:00", pnl: 2800 },
	{ time: "13:00", pnl: 4100 },
	{ time: "13:30", pnl: 5200 },
	{ time: "14:00", pnl: 4800 },
	{ time: "14:30", pnl: 6100 },
	{ time: "15:00", pnl: 7200 },
	{ time: "15:30", pnl: 8500 },
	{ time: "16:00", pnl: 11416 },
]

const maxPnL = Math.max(...portfolioPnL.map((d) => d.pnl))
const minPnL = Math.min(...portfolioPnL.map((d) => d.pnl))
const pnlRange = maxPnL - minPnL || 1

const activityLog = [
	{ time: "09:31:02", action: "BUY", symbol: "AAPL", qty: 50, price: 189.2 },
	{ time: "09:30:45", action: "SELL", symbol: "TSLA", qty: 25, price: 176.8 },
	{ time: "09:30:12", action: "BUY", symbol: "NVDA", qty: 20, price: 875.5 },
	{ time: "09:15:00", action: "SYS", symbol: "---", qty: 0, price: 0 },
]

export const Route = createFileRoute("/_app/dashboard")({
	component: DashboardPage,
})

function DashboardPage() {
	return (
		<div className="flex h-full flex-col gap-1">
			{/* Market Overview */}
			<div className="grid grid-cols-6 gap-1">
				{marketIndices.map((idx) => (
					<div
						key={idx.symbol}
						className="flex flex-col justify-center border bg-card p-2"
					>
						<div className="text-[10px] text-muted-foreground">
							{idx.symbol}
						</div>
						<div className="flex items-baseline justify-between">
							<span className="font-mono text-sm font-semibold">
								{idx.price.toLocaleString()}
							</span>
							<span
								className={`font-mono text-xs ${idx.color === "emerald" ? "text-emerald-500" : "text-rose-500"}`}
							>
								{idx.change >= 0 ? "+" : ""}
								{idx.change}%
							</span>
						</div>
					</div>
				))}
			</div>

			{/* Main Grid */}
			<div className="grid flex-1 grid-cols-4 gap-1">
				{/* Left Column - Watchlist */}
				<div className="col-span-1 flex flex-col gap-1">
					<GridPanel
						title="Watchlist"
						actions={
							<span className="text-[10px] text-muted-foreground">
								{watchlist.length} symbols
							</span>
						}
						className="h-full"
					>
						<div className="space-y-0">
							<div className="flex items-center gap-1 border-b pb-1 text-[10px] text-muted-foreground">
								<span className="w-12">SYM</span>
								<span className="flex-1">PRICE</span>
								<span className="w-12 text-right">CHG%</span>
								<span className="w-8" />
							</div>
							{watchlist.map((item) => (
								<div
									key={item.symbol}
									className="flex items-center gap-1 py-1 text-xs hover:bg-foreground/[0.03]"
								>
									<div className="flex w-12 flex-col">
										<span className="font-mono font-medium">{item.symbol}</span>
										<span className="truncate text-[9px] text-muted-foreground">
											{item.name}
										</span>
									</div>
									<span className="flex-1 font-mono">
										{item.price.toFixed(2)}
									</span>
									<span
										className={`w-12 text-right font-mono ${item.change >= 0 ? "text-emerald-500" : "text-rose-500"}`}
									>
										{item.change >= 0 ? "+" : ""}
										{item.change.toFixed(2)}%
									</span>
									<button className="flex w-8 items-center justify-center text-muted-foreground hover:text-foreground">
										<Plus size={12} />
									</button>
								</div>
							))}
						</div>
					</GridPanel>
				</div>

				{/* Center Column - Today's Signals */}
				<div className="col-span-1 flex flex-col gap-1">
					<GridPanel title="Today's Top Signals" className="h-full">
						<div className="space-y-3">
							{/* BUY Signals */}
							<div>
								<div className="flex items-center gap-1 border-b pb-1 text-[10px] text-muted-foreground">
									<TrendUp size={12} className="text-emerald-500" />
									<span>TOP BUY SIGNALS</span>
								</div>
								<div className="mt-1 space-y-0">
									{topSignals.buy.map((signal, _i) => (
										<div
											key={signal.ticker}
											className="flex items-center gap-1 py-0.5 text-xs"
										>
											<span className="w-8 font-mono font-medium text-emerald-500">
												{signal.ticker}
											</span>
											<div className="flex flex-1 items-center gap-1">
												<div className="h-1.5 flex-1 rounded-full bg-emerald-500/20">
													<div
														className="h-full rounded-full bg-emerald-500"
														style={{ width: `${signal.score}%` }}
													/>
												</div>
												<span className="w-6 text-right font-mono text-[10px] text-muted-foreground">
													{signal.score}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* SELL Signals */}
							<div>
								<div className="flex items-center gap-1 border-b pb-1 text-[10px] text-muted-foreground">
									<TrendDown size={12} className="text-rose-500" />
									<span>TOP SELL SIGNALS</span>
								</div>
								<div className="mt-1 space-y-0">
									{topSignals.sell.map((signal) => (
										<div
											key={signal.ticker}
											className="flex items-center gap-1 py-0.5 text-xs"
										>
											<span className="w-8 font-mono font-medium text-rose-500">
												{signal.ticker}
											</span>
											<div className="flex flex-1 items-center gap-1">
												<div className="h-1.5 flex-1 rounded-full bg-rose-500/20">
													<div
														className="h-full rounded-full bg-rose-500"
														style={{ width: `${signal.score}%` }}
													/>
												</div>
												<span className="w-6 text-right font-mono text-[10px] text-muted-foreground">
													{signal.score}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</GridPanel>
				</div>

				{/* Right Column - Alerts & Macro */}
				<div className="col-span-2 flex flex-col gap-1">
					<div className="grid grid-rows-2 gap-1">
						{/* Recent Alerts */}
						<GridPanel
							title="Recent Alerts"
							actions={
								<span className="text-[10px] text-muted-foreground">
									{recentAlerts.length} new
								</span>
							}
							className="h-full"
						>
							<div className="space-y-0">
								{recentAlerts.slice(0, 6).map((alert, i) => (
									<div
										key={i}
										className="flex items-center gap-2 border-b py-1 text-xs last:border-0"
									>
										<span className="w-8 font-mono text-muted-foreground">
											{alert.time}
										</span>
										<span
											className={`w-12 rounded px-1 py-0.5 text-[10px] font-medium ${alert.type === "PRICE" ? "bg-blue-500/20 text-blue-500" : alert.type === "SIGNAL" ? "bg-purple-500/20 text-purple-500" : "bg-amber-500/20 text-amber-500"}`}
										>
											{alert.type}
										</span>
										<span className="font-medium">{alert.ticker}</span>
										<span className="flex-1 truncate text-muted-foreground">
											{alert.message}
										</span>
									</div>
								))}
							</div>
						</GridPanel>

						{/* Macro Calendar */}
						<GridPanel
							title="Macro Calendar"
							actions={
								<span className="text-[10px] text-muted-foreground">
									This week
								</span>
							}
							className="h-full"
						>
							<div className="space-y-0">
								{macroCalendar.map((event, i) => (
									<div
										key={i}
										className="flex items-center gap-2 border-b py-1.5 text-xs last:border-0"
									>
										<div className="flex w-16 flex-col">
											<span className="font-medium">{event.date}</span>
											<span className="text-[10px] text-muted-foreground">
												{event.time}
											</span>
										</div>
										<span
											className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${event.impact === "high" ? "bg-rose-500/20 text-rose-500" : "bg-amber-500/20 text-amber-500"}`}
										>
											{event.impact.toUpperCase()}
										</span>
										<span className="flex-1 truncate">{event.event}</span>
									</div>
								))}
							</div>
						</GridPanel>
					</div>

					{/* Portfolio Snapshot */}
					<GridPanel
						title="Portfolio Snapshot"
						actions={
							<span className="text-[10px] text-emerald-500">+$11,416.55</span>
						}
						className="h-32"
					>
						<div className="flex h-full items-end gap-0.5">
							{portfolioPnL.map((d, i) => (
								<div
									key={i}
									className="flex-1"
									style={{
										height: `${((d.pnl - minPnL) / pnlRange) * 100}%`,
										minHeight: d.pnl >= 0 ? "4px" : "0px",
									}}
								>
									<div
										className={`h-full w-full ${d.pnl >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
									/>
								</div>
							))}
						</div>
					</GridPanel>
				</div>
			</div>

			{/* Activity Log */}
			<GridPanel
				title="Activity Log"
				collapsible
				collapsedSummary={
					<span className="text-emerald-500">BUY AAPL x50</span>
				}
				className="h-32"
			>
				<div className="space-y-0.5 font-mono text-[11px]">
					{activityLog.map((log, i) => (
						<div
							key={i}
							className="flex items-center gap-3 text-muted-foreground"
						>
							<span className="text-muted-foreground/50">{log.time}</span>
							{log.action === "SYS" ? (
								<span className="text-muted-foreground/50">
									Session started. Market data connected.
								</span>
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
		</div>
	)
}
