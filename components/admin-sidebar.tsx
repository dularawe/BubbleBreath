"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Gamepad2, 
  FolderTree, 
  Trophy, 
  Target, 
  MessageSquare, 
  CreditCard, 
  Shield,
  Smile,
  Home,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/challenges", label: "Challenges", icon: Target },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/privileges", label: "Privileges", icon: Shield },
  { href: "/admin/ml-ratings", label: "Smile Therapy", icon: Smile },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">MindPals</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                "hover:bg-muted",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start gap-2">
            <ChevronLeft className="w-4 h-4" />
            <Home className="w-4 h-4" />
            Back to App
          </Button>
        </Link>
      </div>
    </aside>
  )
}
