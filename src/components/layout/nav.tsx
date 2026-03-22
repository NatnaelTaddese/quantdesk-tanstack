import { useLocation, Link } from "@tanstack/react-router"
import {
  MagnifyingGlass,
  Command,
  Moon,
  Sun,
  SlidersIcon,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"

// -------------------------------------------------------------------
//  Shared key styles — the tactile "keycap" look
// -------------------------------------------------------------------

/** Base keycap: raised surface with south-wall depth */
const keycap = [
  "relative inline-flex items-center select-none",
  "border border-b-[4px] rounded-none",
  "transition-[color,background-color,border-color,box-shadow,transform] duration-75 ease-out",
  // press
  "active:translate-y-[3px] active:border-b",
].join(" ")

/** Resting keycap appearance (idle state) */
const keycapIdle = [
  "border-transparent border-b-transparent",
  "text-muted-foreground",
].join(" ")

/** Hovered keycap — border appears, key lifts off the surface */
const keycapHover = [
  "hover:text-foreground",
  "hover:border-border hover:border-b-border/80",
  "hover:bg-muted/60",
  "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_3px_-1px_rgba(0,0,0,0.2)]",
  "dark:hover:border-input/80 dark:hover:border-b-input/50",
  "dark:hover:bg-muted/40",
  "dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_2px_3px_-1px_rgba(0,0,0,0.4)]",
].join(" ")

/** Pressed keycap — sinks with inset shadow */
const keycapActive = [
  "active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]",
  "dark:active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
].join(" ")

/** Active page keycap — always "held down" look */
const keycapSelected = [
  "text-foreground",
  "border-border border-b-border/80",
  "bg-foreground/[0.08]",
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_1px_2px_-1px_rgba(0,0,0,0.15)]",
  "dark:border-input/80 dark:border-b-input/50",
  "dark:bg-input/25",
  "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_1px_2px_-1px_rgba(0,0,0,0.3)]",
].join(" ")

// -------------------------------------------------------------------
//  Data
// -------------------------------------------------------------------

interface NavItem {
  index: string
  label: string
  href: string
  shortcut: string
}

export const navItems: NavItem[] = [
  { index: "01", label: "Dashboard", href: "/dashboard", shortcut: "D" },
  { index: "02", label: "Screener", href: "/screener", shortcut: "S" },
  { index: "03", label: "Charts", href: "/chart", shortcut: "C" },
  { index: "04", label: "Models", href: "/predictions", shortcut: "P" },
  { index: "05", label: "Research", href: "/research", shortcut: "R" },
  { index: "06", label: "Portfolio", href: "/portfolio", shortcut: "W" },
  { index: "07", label: "News", href: "/news", shortcut: "N" },
]

// -------------------------------------------------------------------
//  Top Header
// -------------------------------------------------------------------

interface TopNavProps {
  onCommandOpen: () => void
}

export function TopNav({ onCommandOpen }: TopNavProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b bg-background px-4">
      {/* Left — Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="font-display text-sm font-bold tracking-tighter text-foreground">
          QUANTDESK.
        </span>
      </Link>

      {/* Right — Search trigger + theme toggle */}
      <div className="flex items-center gap-2">
        {/* Search — styled as a wide keycap */}
        <button
          type="button"
          onClick={onCommandOpen}
          className={cn(
            keycap,
            "h-7 w-56 gap-2 px-2.5 text-xs",
            "border-border border-b-border/80 text-muted-foreground",
            "bg-background",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_2px_3px_-1px_rgba(0,0,0,0.15)]",
            "dark:border-input/80 dark:border-b-input/50",
            "dark:bg-input/15",
            "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_2px_3px_-1px_rgba(0,0,0,0.35)]",
            "hover:bg-muted/60 hover:text-foreground",
            "dark:hover:bg-muted/40",
            "active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]",
            "dark:active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]"
          )}
        >
          <MagnifyingGlass className="size-3.5" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground/70">
            <Command className="size-3" />K
          </kbd>
        </button>

        <Separator orientation="vertical" className="h-7" />

        {/* Theme toggle — small square keycap */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className={cn(
            keycap,
            keycapIdle,
            keycapHover,
            keycapActive,
            "size-7 justify-center"
          )}
        >
          <Sun className="hidden size-3.5 dark:block" />
          <Moon className="block size-3.5 dark:hidden" />
        </button>
      </div>
    </header>
  )
}

// -------------------------------------------------------------------
//  Bottom Tab Bar
// -------------------------------------------------------------------

export function BottomNav() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <nav className="flex h-9 shrink-0 items-center justify-between border-t bg-background px-4">
      {/* Left — Numbered tab links as keycaps */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/") ||
            (item.href === "/dashboard" && pathname === "/")
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                keycap,
                "h-7 gap-1.5 px-2.5 text-xs",
                isActive
                  ? keycapSelected
                  : [keycapIdle, keycapHover, keycapActive].join(" ")
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums",
                  isActive ? "text-primary" : "text-muted-foreground/50"
                )}
              >
                {item.index}
              </span>
              <span className="font-display font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Right — Settings + account stub */}
      <div className="flex items-center gap-2">
        <Link
          to="/settings"
          className={cn(
            keycap,
            "h-7 gap-1.5 px-2.5 text-xs",
            pathname.startsWith("/settings")
              ? keycapSelected
              : [keycapIdle, keycapHover, keycapActive].join(" ")
          )}
        >
          <SlidersIcon className="size-3.5" weight="bold" />
          <span className="font-medium">Settings</span>
        </Link>

        <Separator orientation="vertical" className="!h-4" />

        {/* User avatar placeholder */}
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center border border-b-[3px] border-border/60 border-b-border/40 bg-foreground/5 text-[10px] font-bold text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_1px_2px_-1px_rgba(0,0,0,0.2)] dark:border-input/60 dark:border-b-input/40 dark:bg-input/20 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_1px_2px_-1px_rgba(0,0,0,0.35)]">
            QD
          </div>
        </div>
      </div>
    </nav>
  )
}
