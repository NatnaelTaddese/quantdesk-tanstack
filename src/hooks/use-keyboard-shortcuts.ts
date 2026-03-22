import { useRouter } from "@tanstack/react-router"
import { useCallback, useEffect } from "react"

interface UseKeyboardShortcutsProps {
	onCommandOpen: () => void
}

export function useKeyboardShortcuts({
	onCommandOpen,
}: UseKeyboardShortcutsProps) {
	const router = useRouter()

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			// Command palette - Cmd/Ctrl + K
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault()
				onCommandOpen()
				return
			}

			// Navigation shortcuts - only if not in input
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			) {
				return
			}

			const shortcuts: Record<string, string> = {
				d: "/dashboard",
				s: "/screener",
				c: "/chart",
				p: "/predictions",
				r: "/research",
				w: "/portfolio",
				n: "/news",
			}

			const key = e.key.toLowerCase()
			if (shortcuts[key]) {
				e.preventDefault()
				router.navigate({ to: shortcuts[key] })
			}

			// Settings shortcut - comma
			if (key === ",") {
				e.preventDefault()
				router.navigate({ to: "/settings" })
			}

			// Dark mode toggle - press 't'
			if (key === "t") {
				e.preventDefault()
				const event = new CustomEvent("toggle-theme")
				window.dispatchEvent(event)
			}
		},
		[onCommandOpen, router],
	)

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [handleKeyDown])
}
