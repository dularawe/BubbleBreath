"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppNav } from "@/components/app-nav"
import { Mascot } from "@/components/mascot"
import { useAuth } from "@/lib/auth-context"
import { mlApi } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Camera, 
  CameraOff, 
  Smile, 
  Star, 
  Trophy,
  Heart,
  ArrowLeft,
  Loader2,
  Sparkles,
  Target,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { ImageRating } from "@/lib/api/types"

const smileChallenges = [
  { id: 1, name: "Warm Smile", description: "Show a gentle, warm smile", target: "Good", points: 10 },
  { id: 2, name: "Big Grin", description: "Show your biggest, happiest smile!", target: "Nice", points: 15 },
  { id: 3, name: "Friendly Hello", description: "Smile like you're greeting a friend", target: "Good", points: 10 },
  { id: 4, name: "Joy Burst", description: "Think of something funny and smile!", target: "Nice", points: 20 },
  { id: 5, name: "Peaceful Smile", description: "A calm, relaxed smile", target: "Good", points: 10 },
]

export default function SmileTherapyPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const [cameraActive, setCameraActive] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [points, setPoints] = useState(0)
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([])
  const [mlResult, setMlResult] = useState<ImageRating | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 640, height: 480 } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
        setPermissionGranted(true)
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      toast.error("Camera access is required for this game")
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Capture frame from video
  const captureFrame = useCallback(async (): Promise<Blob | null> => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return null

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.drawImage(video, 0, 0)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
    })
  }, [])

  // Analyze smile with ML API
  const analyzeSmile = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to play")
      return
    }

    if (!cameraActive) {
      toast.error("Please turn on your camera first")
      return
    }

    setIsAnalyzing(true)
    setMlResult(null)

    try {
      const blob = await captureFrame()
      
      if (!blob) {
        toast.error("Failed to capture image")
        setIsAnalyzing(false)
        return
      }

      const file = new File([blob], 'smile.jpg', { type: 'image/jpeg' })
      const imageUrl = URL.createObjectURL(blob)
      setCapturedImage(imageUrl)

      const result = await mlApi.classifyImage(parseInt(user.id), file)
      setMlResult(result)

      const challenge = smileChallenges[currentChallenge]
      
      // Check if smile matches challenge target
      if (result.label === 'Good' || result.label === 'Nice') {
        const earnedPoints = challenge.points + (streak * 5)
        setPoints(prev => prev + earnedPoints)
        setStreak(prev => prev + 1)
        setCompletedChallenges(prev => [...prev, challenge.id])
        
        toast.success(`Great smile! +${earnedPoints} points`)
        
        // Move to next challenge or complete game
        if (currentChallenge < smileChallenges.length - 1) {
          setTimeout(() => {
            setCurrentChallenge(prev => prev + 1)
            setMlResult(null)
            setCapturedImage(null)
          }, 2000)
        } else {
          setGameComplete(true)
        }
      } else {
        setStreak(0)
        toast.info("Try again! Show us your best smile!")
      }
    } catch (error) {
      console.error('ML analysis failed:', error)
      toast.error("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Reset game
  const resetGame = () => {
    setCurrentChallenge(0)
    setPoints(0)
    setCompletedChallenges([])
    setMlResult(null)
    setCapturedImage(null)
    setStreak(0)
    setGameComplete(false)
  }

  const progress = ((completedChallenges.length) / smileChallenges.length) * 100
  const challenge = smileChallenges[currentChallenge]

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint/20 via-background to-sunny/10 pb-24 md:pt-24 md:pb-8">
      <AppNav />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/games')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Smile className="w-8 h-8 text-sunny" />
              Smile Therapy
            </h1>
            <p className="text-muted-foreground">Practice your smile and earn points!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-secondary fill-secondary" />
              <span className="font-bold text-foreground">{points}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-coral/30 px-3 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-coral" />
                <span className="font-bold text-foreground">{streak}x</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Challenge Progress</span>
            <span className="font-semibold text-foreground">
              {completedChallenges.length} / {smileChallenges.length}
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-muted" />
        </div>

        {gameComplete ? (
          /* Game Complete Screen */
          <div className="bg-card rounded-3xl border-4 border-sunny p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-sunny/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-12 h-12 text-sunny" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Amazing Job!</h2>
              <p className="text-muted-foreground">You completed all smile challenges!</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-muted/50 rounded-2xl p-4">
                <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{points}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-4">
                <Target className="w-8 h-8 text-mint mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{completedChallenges.length}</p>
                <p className="text-sm text-muted-foreground">Challenges</p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-4">
                <Heart className="w-8 h-8 text-coral mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{streak}</p>
                <p className="text-sm text-muted-foreground">Best Streak</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetGame} variant="outline" className="rounded-full px-6">
                <RefreshCw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Button onClick={() => router.push('/games')} className="rounded-full px-6">
                More Games
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Camera View */}
            <div className="lg:col-span-2">
              <div className="relative bg-card rounded-3xl border-4 border-primary/30 overflow-hidden aspect-video">
                {!permissionGranted ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-8">
                    <Mascot mood="waving" size="lg" className="mb-6" />
                    <h2 className="text-xl font-bold text-foreground mb-2 text-center">
                      Ready to Smile?
                    </h2>
                    <p className="text-muted-foreground text-center mb-6 max-w-sm">
                      Turn on your camera to start the smile therapy game!
                    </p>
                    <Button 
                      size="lg" 
                      onClick={startCamera}
                      className="rounded-full px-8"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Captured Image Overlay */}
                    {capturedImage && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="relative">
                          <img 
                            src={capturedImage} 
                            alt="Captured smile" 
                            className="max-w-full max-h-64 rounded-2xl transform -scale-x-100"
                          />
                          {mlResult && (
                            <div className={cn(
                              "absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-lg",
                              mlResult.label === 'Good' || mlResult.label === 'Nice'
                                ? "bg-mint text-foreground"
                                : "bg-coral text-foreground"
                            )}>
                              {mlResult.label === 'Good' || mlResult.label === 'Nice' 
                                ? "Great Smile!" 
                                : "Try Again!"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status Indicator */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-card/90 px-4 py-2 rounded-full">
                      <div className="w-3 h-3 bg-mint rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-foreground">Camera Ready</span>
                    </div>

                    {/* Mascot */}
                    <div className="absolute bottom-4 right-4">
                      <Mascot 
                        mood={mlResult?.label === 'Good' || mlResult?.label === 'Nice' ? 'excited' : 'happy'} 
                        size="sm" 
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Controls */}
              {permissionGranted && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={cameraActive ? stopCamera : startCamera}
                    className="rounded-full"
                  >
                    {cameraActive ? (
                      <><CameraOff className="w-4 h-4 mr-2" /> Stop Camera</>
                    ) : (
                      <><Camera className="w-4 h-4 mr-2" /> Start Camera</>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    onClick={analyzeSmile}
                    disabled={isAnalyzing || !cameraActive || !isAuthenticated}
                    className="rounded-full px-8"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Smile className="w-5 h-5 mr-2" /> Capture Smile</>
                    )}
                  </Button>
                </div>
              )}

              {!isAuthenticated && permissionGranted && (
                <p className="text-center text-muted-foreground mt-4">
                  Please <a href="/login" className="text-primary font-semibold hover:underline">sign in</a> to play and save your progress
                </p>
              )}
            </div>

            {/* Challenge Panel */}
            <div className="space-y-4">
              {/* Current Challenge */}
              <div className="bg-card rounded-3xl border-4 border-sunny p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-sunny" />
                  <h3 className="font-bold text-foreground">Current Challenge</h3>
                </div>
                <div className="bg-sunny/10 rounded-2xl p-4 mb-4">
                  <p className="text-lg font-bold text-foreground mb-1">{challenge.name}</p>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reward</span>
                  <span className="flex items-center gap-1 font-bold text-foreground">
                    <Star className="w-4 h-4 text-secondary" />
                    {challenge.points} pts
                  </span>
                </div>
              </div>

              {/* Challenge List */}
              <div className="bg-card rounded-3xl border-4 border-border p-6">
                <h3 className="font-bold text-foreground mb-4">All Challenges</h3>
                <div className="space-y-2">
                  {smileChallenges.map((c, index) => (
                    <div 
                      key={c.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-colors",
                        completedChallenges.includes(c.id) 
                          ? "bg-mint/20" 
                          : index === currentChallenge 
                            ? "bg-sunny/20"
                            : "bg-muted/30"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        completedChallenges.includes(c.id) 
                          ? "bg-mint text-foreground" 
                          : index === currentChallenge 
                            ? "bg-sunny text-foreground"
                            : "bg-muted text-muted-foreground"
                      )}>
                        {completedChallenges.includes(c.id) ? "✓" : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium",
                          completedChallenges.includes(c.id) 
                            ? "text-mint" 
                            : index === currentChallenge 
                              ? "text-foreground"
                              : "text-muted-foreground"
                        )}>
                          {c.name}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">{c.points}pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-sky/10 rounded-2xl p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Tip:</span> Relax your face, 
                  think of something happy, and let your smile shine naturally!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
