"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useGames, useCategories, useAchievements, useChallenges, useReviews, usePayments, usePrivileges, useImageRatings } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { 
  Gamepad2, FolderOpen, Trophy, Target, MessageSquare, 
  CreditCard, Shield, Image, Settings, ChevronRight, 
  TrendingUp, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

const adminSections = [
  { id: "games", label: "Games", icon: Gamepad2, href: "/admin/games", color: "bg-mint" },
  { id: "categories", label: "Categories", icon: FolderOpen, href: "/admin/categories", color: "bg-sky" },
  { id: "achievements", label: "Achievements", icon: Trophy, href: "/admin/achievements", color: "bg-sunny" },
  { id: "challenges", label: "Challenges", icon: Target, href: "/admin/challenges", color: "bg-coral" },
  { id: "reviews", label: "Reviews", icon: MessageSquare, href: "/admin/reviews", color: "bg-lavender" },
  { id: "payments", label: "Payments", icon: CreditCard, href: "/admin/payments", color: "bg-primary" },
  { id: "privileges", label: "Privileges", icon: Shield, href: "/admin/privileges", color: "bg-mint" },
  { id: "ml-ratings", label: "ML Ratings", icon: Image, href: "/admin/ml-ratings", color: "bg-sky" },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  
  // Fetch all data for stats
  const { data: games, isLoading: gamesLoading } = useGames()
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: achievements, isLoading: achievementsLoading } = useAchievements()
  const { data: challenges, isLoading: challengesLoading } = useChallenges()
  const { data: reviews, isLoading: reviewsLoading } = useReviews()
  const { data: payments, isLoading: paymentsLoading } = usePayments()
  const { data: privileges, isLoading: privilegesLoading } = usePrivileges()
  const { data: imageRatings, isLoading: ratingsLoading } = useImageRatings()

  const isLoading = gamesLoading || categoriesLoading || achievementsLoading || 
                    challengesLoading || reviewsLoading || paymentsLoading || 
                    privilegesLoading || ratingsLoading

  const stats = [
    { label: "Games", value: games?.length || 0, icon: Gamepad2, color: "text-mint" },
    { label: "Categories", value: categories?.length || 0, icon: FolderOpen, color: "text-sky" },
    { label: "Achievements", value: achievements?.length || 0, icon: Trophy, color: "text-sunny" },
    { label: "Challenges", value: challenges?.length || 0, icon: Target, color: "text-coral" },
    { label: "Reviews", value: reviews?.length || 0, icon: MessageSquare, color: "text-lavender" },
    { label: "Payments", value: payments?.length || 0, icon: CreditCard, color: "text-primary" },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
      </div>

      {/* Quick Stats */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Overview
        </h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading stats...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-card rounded-2xl p-4 border-2 border-border"
                >
                  <Icon className={cn("w-6 h-6 mb-2", stat.color)} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Management Sections */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminSections.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.id}
                href={section.href}
                className="group"
              >
                <div className="bg-card rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    section.color
                  )}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-foreground">{section.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage {section.label.toLowerCase()}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/games?action=create">
            <Button className="rounded-full">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Add Game
            </Button>
          </Link>
          <Link href="/admin/categories?action=create">
            <Button variant="outline" className="rounded-full border-2">
              <FolderOpen className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </Link>
          <Link href="/admin/achievements?action=create">
            <Button variant="outline" className="rounded-full border-2">
              <Trophy className="w-4 h-4 mr-2" />
              Add Achievement
            </Button>
          </Link>
          <Link href="/admin/challenges?action=create">
            <Button variant="outline" className="rounded-full border-2">
              <Target className="w-4 h-4 mr-2" />
              Add Challenge
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
