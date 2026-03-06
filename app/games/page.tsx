"use client"

import { useState, useMemo } from "react"
import { AppNav } from "@/components/app-nav"
import { GameCard } from "@/components/game-card"
import { Mascot } from "@/components/mascot"
import { useGames, useCategories } from "@/hooks/use-api"
import { Wind, Heart, Users, Brain, Palette, Music, Smile, Star, Lock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Icon mapping for games
const iconMap: Record<string, React.ReactNode> = {
  wind: <Wind className="w-10 h-10" />,
  heart: <Heart className="w-10 h-10" />,
  users: <Users className="w-10 h-10" />,
  brain: <Brain className="w-10 h-10" />,
  palette: <Palette className="w-10 h-10" />,
  music: <Music className="w-10 h-10" />,
  smile: <Smile className="w-10 h-10" />,
}

// Color mapping
const colorMap: Record<string, "coral" | "mint" | "sunny" | "sky" | "lavender"> = {
  coral: "coral",
  mint: "mint",
  sunny: "sunny",
  sky: "sky",
  lavender: "lavender",
}

// Fallback static games for when API is unavailable
const fallbackGames = [
  {
    id: "smile-therapy",
    name: "Smile Therapy",
    description: "Practice your smile with AI-powered feedback and earn points!",
    icon: "smile",
    href: "/games/smile-therapy",
    level: 1,
    unlocked: true,
    stars: 0,
    color: "sunny",
    categoryId: "emotions",
  },
  {
    id: "bubble-breathing",
    name: "Bubble Breathing",
    description: "Blow magical bubbles by taking slow, deep breaths!",
    icon: "wind",
    href: "/games/bubble-breathing",
    level: 2,
    unlocked: true,
    stars: 3,
    color: "mint",
    categoryId: "breathing",
  },
  {
    id: "emotion-match",
    name: "Emotion Match",
    description: "Match faces with feelings in this fun card game!",
    icon: "heart",
    href: "/games/emotion-match",
    level: 2,
    unlocked: true,
    stars: 2,
    color: "coral",
    categoryId: "emotions",
  },
  {
    id: "friend-finder",
    name: "Friend Finder",
    description: "Learn how to make friends through fun scenarios!",
    icon: "users",
    href: "/games/friend-finder",
    level: 3,
    unlocked: true,
    stars: 1,
    color: "sky",
    categoryId: "social",
  },
  {
    id: "calm-clouds",
    name: "Calm Clouds",
    description: "Float on peaceful clouds and relax your mind!",
    icon: "brain",
    href: "/games/calm-clouds",
    level: 4,
    unlocked: true,
    stars: 0,
    color: "lavender",
    categoryId: "mindfulness",
  },
  {
    id: "color-moods",
    name: "Color My Mood",
    description: "Express your feelings through beautiful art!",
    icon: "palette",
    href: "/games/color-moods",
    level: 5,
    unlocked: false,
    stars: 0,
    color: "sunny",
    categoryId: "emotions",
  },
  {
    id: "rhythm-relax",
    name: "Rhythm Relax",
    description: "Follow the beat and calm your heart!",
    icon: "music",
    href: "/games/rhythm-relax",
    level: 6,
    unlocked: false,
    stars: 0,
    color: "coral",
    categoryId: "mindfulness",
  },
]

const fallbackCategories = [
  { id: "all", name: "All Games" },
  { id: "breathing", name: "Breathing" },
  { id: "emotions", name: "Emotions" },
  { id: "social", name: "Social" },
  { id: "mindfulness", name: "Mindfulness" },
]

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  const { data: apiGames, isLoading: gamesLoading, error: gamesError } = useGames()
  const { data: apiCategories, isLoading: categoriesLoading } = useCategories()

  // Use API data if available, otherwise use fallback
  const games = useMemo(() => {
    if (apiGames && apiGames.length > 0) {
      return apiGames.map((game, index) => ({
        ...game,
        icon: game.imageUrl?.includes('wind') ? 'wind' : 
              game.imageUrl?.includes('heart') ? 'heart' :
              game.imageUrl?.includes('users') ? 'users' :
              game.imageUrl?.includes('brain') ? 'brain' :
              game.imageUrl?.includes('palette') ? 'palette' :
              game.imageUrl?.includes('music') ? 'music' : 'wind',
        href: `/games/${game.id}`,
        level: game.level || index + 1,
        unlocked: game.unlocked !== false,
        stars: game.stars || 0,
        color: game.category?.color || ['mint', 'coral', 'sky', 'lavender', 'sunny'][index % 5],
      }))
    }
    return fallbackGames
  }, [apiGames])

  const categories = useMemo(() => {
    if (apiCategories && apiCategories.length > 0) {
      return [{ id: "all", name: "All Games" }, ...apiCategories]
    }
    return fallbackCategories
  }, [apiCategories])

  const totalStars = games.reduce((acc, game) => acc + (game.stars || 0), 0)
  const maxStars = games.length * 3

  const filteredGames = selectedCategory === "all" 
    ? games 
    : games.filter(game => game.categoryId === selectedCategory)

  const isLoading = gamesLoading || categoriesLoading

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-24 md:pb-8">
      <AppNav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <Mascot mood="excited" size="lg" animate={false} />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Game World
            </h1>
            <p className="text-muted-foreground mb-4">
              Explore fun games that help you learn about feelings and grow stronger!
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-secondary fill-secondary" />
                <span className="font-bold text-foreground">{totalStars} / {maxStars} Stars</span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {games.filter(g => !g.unlocked).length} locked
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-card rounded-2xl p-6 mb-8 border-2 border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-foreground">Your Progress</span>
            <span className="text-sm text-muted-foreground">
              Level {Math.floor(totalStars / 3) + 1} Explorer
            </span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(totalStars / maxStars) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Earn {maxStars - totalStars} more stars to unlock all games!
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full font-semibold transition-all",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading games...</span>
          </div>
        )}

        {/* Error State - Show fallback data */}
        {gamesError && (
          <div className="bg-secondary/20 border-2 border-secondary rounded-2xl p-4 mb-8">
            <p className="text-sm text-muted-foreground">
              Using offline games. Connect to the internet to see the latest!
            </p>
          </div>
        )}

        {/* Games Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                title={game.name}
                description={game.description}
                icon={iconMap[game.icon || 'wind'] || <Wind className="w-10 h-10" />}
                href={game.href || `/games/${game.id}`}
                level={game.level || 1}
                unlocked={game.unlocked !== false}
                stars={game.stars || 0}
                color={colorMap[game.color || 'mint'] || 'mint'}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Mascot mood="thinking" size="lg" className="mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No games found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category!
            </p>
          </div>
        )}

        {/* Encouragement Banner */}
        <div className="mt-12 bg-primary/10 rounded-3xl p-8 text-center border-4 border-primary/30">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            You are doing amazing!
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every game you play helps you understand your feelings better. 
            Keep exploring and having fun!
          </p>
        </div>
      </main>
    </div>
  )
}
