"use client"

import { use } from "react"
import Link from "next/link"
import { useGame } from "@/hooks/use-api"
import { AppNav } from "@/components/app-nav"
import { Mascot } from "@/components/mascot"
import { GameReviews } from "@/components/game-reviews"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play, Clock, Star, Users, Loader2 } from "lucide-react"

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { game, isLoading, error } = useGame(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-100">
        <AppNav />
        <main className="max-w-4xl mx-auto px-4 py-8 pt-24 md:pt-28">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-100">
        <AppNav />
        <main className="max-w-4xl mx-auto px-4 py-8 pt-24 md:pt-28">
          <Card className="p-8 text-center">
            <Mascot emotion="sad" size="lg" />
            <h2 className="text-2xl font-bold text-foreground mt-4">Game not found</h2>
            <p className="text-muted-foreground mt-2">This game might have been removed or does not exist.</p>
            <Link href="/games">
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-700 border-green-300"
      case "medium": return "bg-yellow-500/20 text-yellow-700 border-yellow-300"
      case "hard": return "bg-red-500/20 text-red-700 border-red-300"
      default: return "bg-muted text-muted-foreground"
    }
  }

  // Map game titles to actual routes
  const getGameRoute = (title: string) => {
    const routeMap: Record<string, string> = {
      "Bubble Breathing": "/games/bubble-breathing",
      "Emotion Explorer": "/games/emotion-explorer",
      "Mindful Moments": "/games/mindful-moments",
      "Feeling Friends": "/games/feeling-friends",
    }
    return routeMap[title] || `/games/${id}/play`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-100">
      <AppNav />
      <main className="max-w-4xl mx-auto px-4 py-8 pt-24 md:pt-28 pb-24">
        {/* Back Button */}
        <Link href="/games" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games</span>
        </Link>

        {/* Game Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Game Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border-4 border-white shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <Mascot emotion="happy" size="xl" />
            </div>
            {game.thumbnail && (
              <img 
                src={game.thumbnail} 
                alt={game.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

          {/* Game Info */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getDifficultyColor(game.difficulty)}>
                {game.difficulty}
              </Badge>
              {game.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                  Premium
                </Badge>
              )}
              {game.isActive && (
                <Badge className="bg-green-500/20 text-green-700 border-green-300">
                  Active
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
              {game.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {game.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span>{game.duration} min</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>{game.rating?.toFixed(1) || "New"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5" />
                <span>{game.ageRange}</span>
              </div>
            </div>

            {/* Play Button */}
            <Link href={getGameRoute(game.title)}>
              <Button size="lg" className="w-full md:w-auto rounded-full text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
                <Play className="w-6 h-6 mr-2" />
                Play Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Instructions */}
        {game.instructions && (
          <Card className="mb-8 border-4 border-primary/20 rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">How to Play</h2>
              <p className="text-muted-foreground whitespace-pre-line">{game.instructions}</p>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <GameReviews gameId={id} />
      </main>
    </div>
  )
}
