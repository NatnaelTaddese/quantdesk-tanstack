import { useState, type ReactNode } from "react"
import { TopNav, BottomNav } from "@/components/layout/nav"
import { StatusBar } from "@/components/layout/status-bar"
import { CommandMenu } from "@/components/layout/command-menu"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [commandOpen, setCommandOpen] = useState(false)

  useKeyboardShortcuts({ onCommandOpen: () => setCommandOpen(true) })

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Top Nav — logo + search + theme toggle */}
      <TopNav onCommandOpen={() => setCommandOpen(true)} />

      {/* Content */}
      <ScrollArea className="h-full">
        <main className="flex-1 overflow-auto p-3"> {children}</main>
      </ScrollArea>

      {/* Status Bar — market data ticker */}
      <StatusBar />

      {/* Bottom Nav — numbered tab links */}
      <BottomNav />

      {/* Command Palette */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  )
}
