import {
	CaretDown,
	CaretLeft,
	CaretRight,
	CaretUp,
} from "@phosphor-icons/react"
import { type ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type CollapseDirection = "vertical" | "horizontal"

interface GridPanelProps {
	children: ReactNode
	className?: string
	title?: string
	actions?: ReactNode
	collapsible?: boolean
	collapseDirection?: CollapseDirection
	collapsed?: boolean
	onCollapsedChange?: (collapsed: boolean) => void
	collapsedSummary?: ReactNode
}

export function GridPanel({
	children,
	className,
	title,
	actions,
	collapsible = false,
	collapseDirection = "vertical",
	collapsed: controlledCollapsed,
	onCollapsedChange,
	collapsedSummary,
}: GridPanelProps) {
	const [internalCollapsed, setInternalCollapsed] = useState(false)
	const [contentVisible, setContentVisible] = useState(true)
	const isControlled = controlledCollapsed !== undefined
	const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed

	const isHorizontal = collapseDirection === "horizontal"

	// Delay content visibility for horizontal collapse to prevent flash
	useEffect(() => {
		if (isHorizontal) {
			if (isCollapsed) {
				setContentVisible(false)
			} else {
				const timer = setTimeout(() => setContentVisible(true), 200)
				return () => clearTimeout(timer)
			}
		}
	}, [isCollapsed, isHorizontal])

	const toggleCollapsed = () => {
		const newState = !isCollapsed
		if (!isControlled) {
			setInternalCollapsed(newState)
		}
		onCollapsedChange?.(newState)
	}

	// Horizontal collapse: panel collapses to a thin vertical bar
	if (isHorizontal) {
		return (
			<div
				className={cn(
					"flex overflow-hidden border bg-card transition-[width] duration-300 ease-in-out",
					className,
					isCollapsed && "!w-8 !min-w-8",
				)}
			>
				{isCollapsed ? (
					// Collapsed horizontal state - vertical bar with rotated title
					<div
						className={cn(
							"flex h-full w-8 cursor-pointer flex-col items-center py-3 hover:bg-accent/50",
						)}
						onClick={toggleCollapsed}
					>
						<button className="text-muted-foreground hover:text-foreground">
							<CaretRight size={14} />
						</button>
						{title && (
							<span
								className="mt-2 text-xs font-medium text-card-foreground"
								style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
							>
								{title}
							</span>
						)}
						{collapsedSummary && (
							<span
								className="mt-2 text-xs text-muted-foreground"
								style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
							>
								{collapsedSummary}
							</span>
						)}
					</div>
				) : (
					// Expanded horizontal state
					<div className="flex h-full w-full flex-col">
						{(title || actions || collapsible) && (
							<div
								className={cn(
									"flex h-8 shrink-0 items-center gap-2 border-b px-3",
									collapsible && "cursor-pointer hover:bg-accent/50",
								)}
								onClick={collapsible ? toggleCollapsed : undefined}
							>
								{collapsible && (
									<button className="text-muted-foreground hover:text-foreground">
										<CaretLeft size={14} />
									</button>
								)}
								{title && (
									<span className="text-xs font-medium text-card-foreground">
										{title}
									</span>
								)}
								<div className="flex-1" />
								{actions && (
									<div className="flex items-center gap-2">{actions}</div>
								)}
							</div>
						)}
						<div
							className={cn(
								"flex-1 overflow-auto p-3 transition-opacity duration-150",
								contentVisible ? "opacity-100" : "opacity-0",
							)}
						>
							{children}
						</div>
					</div>
				)}
			</div>
		)
	}

	// Vertical collapse (default behavior)
	return (
		<div
			className={cn(
				"flex flex-col overflow-hidden border bg-card transition-[height] duration-300 ease-in-out",
				isCollapsed && "!h-8 min-h-8",
				className,
			)}
		>
			{(title || actions || collapsible) && (
				<div
					className={cn(
						"flex h-8 shrink-0 items-center gap-2 border-b px-3",
						collapsible && "cursor-pointer hover:bg-accent/50",
					)}
					onClick={collapsible ? toggleCollapsed : undefined}
				>
					{collapsible && (
						<button className="text-muted-foreground hover:text-foreground">
							{isCollapsed ? <CaretDown size={14} /> : <CaretUp size={14} />}
						</button>
					)}
					{title && (
						<span className="text-xs font-medium text-card-foreground">
							{title}
						</span>
					)}
					{isCollapsed && collapsedSummary && (
						<span className="text-xs text-muted-foreground">
							{collapsedSummary}
						</span>
					)}
					<div className="flex-1" />
					{actions && <div className="flex items-center gap-2">{actions}</div>}
				</div>
			)}
			{!isCollapsed && (
				<div className="flex-1 overflow-auto p-3">{children}</div>
			)}
		</div>
	)
}

interface GridLayoutProps {
	children: ReactNode
	className?: string
	columns?: 1 | 2 | 3 | 4
	rows?: 1 | 2 | 3 | 4
}

export function GridLayout({
	children,
	className,
	columns = 2,
	rows = 2,
}: GridLayoutProps) {
	const gridCols = {
		1: "grid-cols-1",
		2: "grid-cols-2",
		3: "grid-cols-3",
		4: "grid-cols-4",
	}

	const gridRows = {
		1: "grid-rows-1",
		2: "grid-rows-2",
		3: "grid-rows-3",
		4: "grid-rows-4",
	}

	return (
		<div
			className={cn(
				"grid h-full gap-1",
				gridCols[columns],
				gridRows[rows],
				className,
			)}
		>
			{children}
		</div>
	)
}

// Pre-built layouts for common use cases
export function SinglePanel({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<GridLayout columns={1} rows={1} className={className}>
			{children}
		</GridLayout>
	)
}

export function SplitHorizontal({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<GridLayout columns={1} rows={2} className={className}>
			{children}
		</GridLayout>
	)
}

export function SplitVertical({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<GridLayout columns={2} rows={1} className={className}>
			{children}
		</GridLayout>
	)
}

export function QuadPanel({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<GridLayout columns={2} rows={2} className={className}>
			{children}
		</GridLayout>
	)
}
