"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AppNav } from "@/components/app-nav"
import { Mascot } from "@/components/mascot"
import { Button } from "@/components/ui/button"
import { useChallenges } from "@/hooks/use-api"
import { useAuth } from "@/lib/auth-context"
import { Video, Gamepad2, Trophy, Sparkles, Loader2 } from "lucide-react"

const greetings = [
  "Hey there, superstar!",
  "Welcome back, champion!",
  "Hello, amazing friend!",
  "Great to see you!",
  "You're doing awesome!",
]

const tips = [
  "Take a deep breath and smile!",
  "You are brave and strong!",
  "Every feeling is okay to have.",
  "You can do hard things!",
  "Being kind makes everyone happy!",
]

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const { data: challenges, isLoading: challengesLoading } = useChallenges()
  
  const [greeting, setGreeting] = useState(greetings[0])
  const [tip, setTip] = useState(tips[0])
  const [mascotMood, setMascotMood] = useState<"happy" | "waving" | "excited">("waving")

  // Get today's active challenge
  const todayChallenge = challenges?.find(c => c.active && !c.completed) || challenges?.[0]

  useEffect(() => {
    // Personalize greeting if user is logged in
    if (isAuthenticated && user?.name) {
      setGreeting(`Hey ${user.name.split(' ')[0]}, superstar!`)
    } else {
      setGreeting(greetings[Math.floor(Math.random() * greetings.length)])
    }
    setTip(tips[Math.floor(Math.random() * tips.length)])
    
    const moodInterval = setInterval(() => {
      setMascotMood((prev) => {
        if (prev === "waving") return "happy"
        if (prev === "happy") return "excited"
        return "waving"
      })
    }, 3000)
    
    return () => clearInterval(moodInterval)
  }, [isAuthenticated, user])

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-24 md:pb-8">
      <AppNav />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-12">
          <div className="relative mb-6">
            <Mascot mood={mascotMood} size="xl" />
            <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              Hi!
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-primary">Mind</span>Pals
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            {greeting}
          </p>
          
          <div className="flex items-center gap-2 bg-sunny/30 px-4 py-2 rounded-full">
            <Sparkles className="w-5 h-5 text-secondary" />
            <p className="text-lg text-foreground font-medium">{tip}</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/video-session" className="group">
            <div className="flex flex-col items-center p-8 bg-coral/20 border-4 border-coral rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-20 h-20 bg-coral rounded-2xl flex items-center justify-center mb-4 group-hover:animate-bounce">
                <Video className="w-10 h-10 text-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Video Fun</h2>
              <p className="text-sm text-muted-foreground text-center">
                Play games with your camera and see how you feel!
              </p>
            </div>
          </Link>

          <Link href="/games" className="group">
            <div className="flex flex-col items-center p-8 bg-mint/20 border-4 border-mint rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-20 h-20 bg-mint rounded-2xl flex items-center justify-center mb-4 group-hover:animate-bounce">
                <Gamepad2 className="w-10 h-10 text-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Play Games</h2>
              <p className="text-sm text-muted-foreground text-center">
                Fun activities to learn about feelings and make friends!
              </p>
            </div>
          </Link>

          <Link href="/progress" className="group">
            <div className="flex flex-col items-center p-8 bg-sky/20 border-4 border-sky rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="w-20 h-20 bg-sky rounded-2xl flex items-center justify-center mb-4 group-hover:animate-bounce">
                <Trophy className="w-10 h-10 text-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">My Stars</h2>
              <p className="text-sm text-muted-foreground text-center">
                See all the awesome things you have accomplished!
              </p>
            </div>
          </Link>
        </section>

        {/* Daily Challenge */}
        <section className="bg-card border-4 border-primary/30 rounded-3xl p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">Today&apos;s Challenge</span>
          </div>
          
          {challengesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading challenge...</span>
            </div>
          ) : todayChallenge ? (
            <>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {todayChallenge.name}
              </h3>
              
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                {todayChallenge.description}
              </p>

              {todayChallenge.reward && (
                <div className="inline-flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-full mb-6">
                  <Trophy className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">
                    Earn {todayChallenge.reward} points!
                  </span>
                </div>
              )}
              
              <Link href={todayChallenge.gameId ? `/games/${todayChallenge.gameId}` : "/games/bubble-breathing"}>
                <Button size="lg" className="rounded-full px-8 py-6 text-lg font-bold">
                  Start Challenge
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Breathing Bubble Adventure
              </h3>
              
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Help our mascot blow magical bubbles by taking slow, deep breaths. 
                Can you make the biggest bubble?
              </p>
              
              <Link href="/games/bubble-breathing">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg font-bold">
                  Start Challenge
                </Button>
              </Link>
            </>
          )}
        </section>

        {/* Sign In Prompt for guests */}
        {!isAuthenticated && (
          <section className="mt-8 bg-muted/50 rounded-3xl p-6 text-center border-2 border-border">
            <p className="text-muted-foreground mb-4">
              Sign in to save your progress and unlock more features!
            </p>
            <Link href="/login">
              <Button variant="outline" className="rounded-full border-2">
                Sign In
              </Button>
            </Link>
          </section>
        )}
      </main>
    </div>
  )
}
