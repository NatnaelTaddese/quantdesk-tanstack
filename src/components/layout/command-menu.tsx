import type { Icon } from "@phosphor-icons/react"
import {
	ArrowRight,
	Article,
	Brain,
	ChartLineUp,
	Clock,
	Gear,
	MagnifyingGlass,
	Newspaper,
	SquaresFour,
	Star,
	TrendUp,
	Wallet,
} from "@phosphor-icons/react"
import { useRouter } from "@tanstack/react-router"
import { useCallback, useState, useSyncExternalStore } from "react"
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command"

interface CommandMenuProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

interface CommandItemData {
	icon: Icon
	label: string
	href: string
	shortcut?: string
	keywords?: string[]
}

const navigationCommands: CommandItemData[] = [
	{
		icon: SquaresFour,
		label: "Dashboard",
		href: "/dashboard",
		shortcut: "D",
		keywords: ["home", "main"],
	},
	{
		icon: ChartLineUp,
		label: "Screener",
		href: "/screener",
		shortcut: "S",
		keywords: ["filter", "scan", "stocks"],
	},
	{
		icon: TrendUp,
		label: "Charts",
		href: "/chart",
		shortcut: "C",
		keywords: ["graph", "visualization", "technical"],
	},
	{
		icon: Brain,
		label: "AI Models",
		href: "/predictions",
		shortcut: "P",
		keywords: ["machine learning", "forecast", "ml"],
	},
	{
		icon: Article,
		label: "Research",
		href: "/research",
		shortcut: "R",
		keywords: ["notes", "analysis", "reports"],
	},
	{
		icon: Wallet,
		label: "Portfolio",
		href: "/portfolio",
		shortcut: "W",
		keywords: ["positions", "holdings", "pnl"],
	},
	{
		icon: Newspaper,
		label: "News",
		href: "/news",
		shortcut: "N",
		keywords: ["headlines", "feed", "updates"],
	},
	{
		icon: Gear,
		label: "Settings",
		href: "/settings",
		shortcut: ",",
		keywords: ["preferences", "config", "options"],
	},
]

const recentTickers = [
	{ symbol: "AAPL", name: "Apple Inc.", price: 178.35, change: 1.25 },
	{ symbol: "TSLA", name: "Tesla, Inc.", price: 245.67, change: -3.42 },
	{ symbol: "NVDA", name: "NVIDIA Corp.", price: 875.28, change: 12.45 },
	{ symbol: "MSFT", name: "Microsoft Corp.", price: 420.55, change: 2.18 },
]

const watchlist = [
	{ symbol: "SPY", name: "SPDR S&P 500", price: 512.45, change: 0.42 },
	{ symbol: "QQQ", name: "Invesco QQQ", price: 445.23, change: -0.18 },
	{ symbol: "IWM", name: "iShares Russell 2000", price: 198.76, change: 0.85 },
]

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
	const router = useRouter()
	const [search, setSearch] = useState("")
	const mounted = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	)

	const handleSelect = useCallback(
		(href: string) => {
			onOpenChange(false)
			router.navigate({ to: href })
		},
		[onOpenChange, router],
	)

	const handleSearchChange = useCallback((value: string) => {
		setSearch(value)
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput
				placeholder="Type a command or search ticker..."
				value={search}
				onValueChange={handleSearchChange}
			/>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				{/* Navigation Commands */}
				<CommandGroup heading="Navigation">
					{navigationCommands.map((command) => {
						const Icon = command.icon
						return (
							<CommandItem
								key={command.href}
								onSelect={() => handleSelect(command.href)}
								keywords={command.keywords}
							>
								<Icon className="mr-2 size-4" />
								<span>{command.label}</span>
								{command.shortcut && (
									<CommandShortcut>⌘{command.shortcut}</CommandShortcut>
								)}
							</CommandItem>
						)
					})}
				</CommandGroup>

				<CommandSeparator />

				{/* Recent Tickers */}
				<CommandGroup heading="Recent">
					{recentTickers.map((ticker) => (
						<CommandItem
							key={ticker.symbol}
							onSelect={() => handleSelect(`/chart/${ticker.symbol}`)}
						>
							<Clock className="mr-2 size-4 text-muted-foreground" />
							<span className="font-mono font-medium">{ticker.symbol}</span>
							<span className="ml-2 text-muted-foreground">{ticker.name}</span>
							<span className="ml-auto font-mono text-xs">
								${ticker.price.toFixed(2)}
							</span>
						</CommandItem>
					))}
				</CommandGroup>

				<CommandSeparator />

				{/* Watchlist */}
				<CommandGroup heading="Watchlist">
					{watchlist.map((ticker) => (
						<CommandItem
							key={ticker.symbol}
							onSelect={() => handleSelect(`/chart/${ticker.symbol}`)}
						>
							<Star className="mr-2 size-4 text-muted-foreground" />
							<span className="font-mono font-medium">{ticker.symbol}</span>
							<span className="ml-2 text-muted-foreground">{ticker.name}</span>
							<span className="ml-auto font-mono text-xs">
								${ticker.price.toFixed(2)}
							</span>
						</CommandItem>
					))}
				</CommandGroup>

				<CommandSeparator />

				{/* Ticker Search Results */}
				{search.length > 0 && (
					<CommandGroup heading="Search Results">
						<CommandItem
							onSelect={() => handleSelect(`/chart/${search.toUpperCase()}`)}
						>
							<MagnifyingGlass className="mr-2 size-4" />
							<span>Search for &quot;{search}&quot;</span>
							<ArrowRight className="ml-auto size-3 text-muted-foreground" />
						</CommandItem>
						<CommandItem
							onSelect={() =>
								handleSelect(`/screener?q=${encodeURIComponent(search)}`)
							}
						>
							<ChartLineUp className="mr-2 size-4" />
							<span>Screen for &quot;{search}&quot;</span>
							<ArrowRight className="ml-auto size-3 text-muted-foreground" />
						</CommandItem>
					</CommandGroup>
				)}
			</CommandList>
		</CommandDialog>
	)
}
