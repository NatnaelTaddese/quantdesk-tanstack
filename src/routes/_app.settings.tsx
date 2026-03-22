import { createFileRoute } from "@tanstack/react-router"
import { GridPanel } from "@/components/layout/grid"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const sections = [
	{
		title: "General",
		settings: [
			{
				label: "Theme",
				value: "Dark",
				description: "Application color scheme",
			},
			{ label: "Font Size", value: "12px", description: "Base UI font size" },
			{
				label: "Density",
				value: "Compact",
				description: "Layout density level",
			},
			{
				label: "Animations",
				value: "Reduced",
				description: "Motion and transitions",
			},
		],
	},
	{
		title: "Market Data",
		settings: [
			{
				label: "Default Exchange",
				value: "NYSE",
				description: "Primary exchange for quotes",
			},
			{ label: "Currency", value: "USD", description: "Display currency" },
			{
				label: "Refresh Rate",
				value: "1s",
				description: "Quote update interval",
			},
			{
				label: "Pre/Post Market",
				value: "Enabled",
				description: "Show extended hours data",
			},
		],
	},
	{
		title: "Trading",
		settings: [
			{
				label: "Default Order Type",
				value: "Limit",
				description: "Default order submission type",
			},
			{
				label: "Confirmation",
				value: "Required",
				description: "Order confirmation dialog",
			},
			{
				label: "Risk Limit",
				value: "$50,000",
				description: "Maximum single order value",
			},
			{
				label: "Paper Trading",
				value: "Enabled",
				description: "Simulated execution mode",
			},
		],
	},
	{
		title: "Notifications",
		settings: [
			{
				label: "Price Alerts",
				value: "On",
				description: "Trigger on price thresholds",
			},
			{ label: "Order Fills", value: "On", description: "Notify on execution" },
			{
				label: "News Alerts",
				value: "Off",
				description: "Breaking news notifications",
			},
			{
				label: "System Alerts",
				value: "On",
				description: "Connection/error notifications",
			},
		],
	},
]

export const Route = createFileRoute("/_app/settings")({
	component: SettingsPage,
})

function SettingsPage() {
	return (
		<div className="mx-auto h-full max-w-3xl overflow-auto p-4">
			<div className="mb-4">
				<h1 className="font-mono text-sm font-bold">SETTINGS</h1>
				<p className="text-xs text-muted-foreground">
					Configure your QuantDesk environment.
				</p>
			</div>

			<div className="space-y-4">
				{sections.map((section) => (
					<GridPanel key={section.title} title={section.title}>
						<div className="space-y-0">
							{section.settings.map((setting, i) => (
								<div key={setting.label}>
									<div className="flex items-center justify-between py-2">
										<div>
											<p className="text-xs font-medium">{setting.label}</p>
											<p className="text-[10px] text-muted-foreground">
												{setting.description}
											</p>
										</div>
										<span className="border px-2 py-0.5 font-mono text-xs text-muted-foreground">
											{setting.value}
										</span>
									</div>
									{i < section.settings.length - 1 && <Separator />}
								</div>
							))}
						</div>
					</GridPanel>
				))}

				<GridPanel title="Danger Zone">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs font-medium text-rose-500">
								Reset All Settings
							</p>
							<p className="text-[10px] text-muted-foreground">
								Restore all settings to defaults. This cannot be undone.
							</p>
						</div>
						<Button
							variant="outline"
							size="xs"
							className="border-rose-500/30 border-b-rose-500/20 text-rose-500 hover:bg-rose-500/10"
						>
							Reset
						</Button>
					</div>
				</GridPanel>
			</div>
		</div>
	)
}
