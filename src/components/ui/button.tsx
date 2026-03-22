import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	[
		"group/button relative inline-flex shrink-0 items-center justify-center",
		"rounded-none text-xs font-medium whitespace-nowrap select-none",
		"outline-none",
		// tactile: thick south-wall
		"border border-b-[4px]",
		// tactile: press — sink + collapse south-wall + swap shadow
		"transition-[color,background-color,border-color,box-shadow,transform] duration-75 ease-out",
		"active:translate-y-[3px] active:border-b",
		// focus
		"focus-visible:ring-1 focus-visible:ring-ring/50",
		// disabled
		"disabled:pointer-events-none disabled:opacity-50",
		// icons
		"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	].join(" "),
	{
		variants: {
			variant: {
				default: [
					"bg-primary text-primary-foreground",
					"border-primary/70 border-b-primary/50",
					// 3D: top highlight + key shadow
					"shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_2px_3px_-1px_rgba(0,0,0,0.3)]",
					"hover:bg-primary/90",
					// press: inset only
					"active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]",
				].join(" "),
				outline: [
					"bg-background text-foreground",
					"border-border border-b-border",
					"shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_3px_-1px_rgba(0,0,0,0.2)]",
					"dark:border-input/80 dark:border-b-input/50",
					"dark:bg-input/20",
					"dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_2px_3px_-1px_rgba(0,0,0,0.4)]",
					"hover:bg-muted hover:text-foreground",
					"active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]",
					"dark:active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
				].join(" "),
				secondary: [
					"bg-secondary text-secondary-foreground",
					"border-secondary/70 border-b-secondary/50",
					"shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_2px_3px_-1px_rgba(0,0,0,0.2)]",
					"hover:bg-secondary/80",
					"active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]",
				].join(" "),
				ghost: [
					"border-transparent",
					// reveal key frame on hover
					"hover:bg-muted hover:text-foreground",
					"hover:border-b-[4px] hover:border-border hover:border-b-border/80",
					"hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_3px_-1px_rgba(0,0,0,0.2)]",
					"dark:hover:border-input/80 dark:hover:border-b-input/50 dark:hover:bg-muted/50",
					"dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_2px_3px_-1px_rgba(0,0,0,0.4)]",
					"active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]",
					"dark:active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
				].join(" "),
				destructive: [
					"bg-destructive/10 text-destructive",
					"border-destructive/30 border-b-destructive/20",
					"shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_2px_3px_-1px_rgba(0,0,0,0.15)]",
					"hover:bg-destructive/20",
					"active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]",
					"dark:bg-destructive/20 dark:hover:bg-destructive/30",
				].join(" "),
				link: [
					"border-transparent text-primary underline-offset-4 hover:underline",
					"active:translate-y-0 active:border-b-transparent",
				].join(" "),
			},
			size: {
				default:
					"h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
				xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-7 gap-1 px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
				lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
				icon: "size-8",
				"icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-7",
				"icon-lg": "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
