"use client"

import { useState, useRef, useCallback } from "react"
import { AppNav } from "@/components/app-nav"
import { Mascot } from "@/components/mascot"
import { EmotionDisplay } from "@/components/emotion-display"
import { useFaceDetection } from "@/hooks/use-face-detection"
import { useAuth } from "@/lib/auth-context"
import { mlApi } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, Play, Pause, Sparkles, Star, Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { ImageRating } from "@/lib/api/types"

const activities = [
  { id: "mirror", name: "Mirror Game", description: "Copy the expressions you see!", icon: "mirror" },
  { id: "breathing", name: "Breathing Buddy", description: "Breathe with the bubble!", icon: "breathing" },
  { id: "emotions", name: "Emotion Explorer", description: "Can you make these faces?", icon: "emotions" },
  { id: "ml-analysis", name: "Smile Detector", description: "Let AI analyze your smile!", icon: "ml" },
]

export default function VideoSessionPage() {
  const {
    detection,
    startDetection,
    stopDetection,
    videoRef,
    isActive,
    permissionGranted,
    requestPermission
  } = useFaceDetection()

  const { user, isAuthenticated } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [points, setPoints] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mlResult, setMlResult] = useState<ImageRating | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const handleStartCamera = async () => {
    const granted = await requestPermission()
    if (granted) {
      startDetection()
    }
  }

  const handleToggleDetection = () => {
    if (isActive) {
      stopDetection()
    } else {
      startDetection()
    }
  }

  // Award points when emotion matches activity goals
  const awardPoints = () => {
    setPoints(prev => prev + 10)
  }

  // Capture current frame from video
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return null

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8)
    })
  }, [videoRef])

  // Analyze captured frame with ML API
  const analyzeExpression = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to use ML analysis")
      return
    }

    setIsAnalyzing(true)
    setMlResult(null)

    try {
      const blob = await captureFrame()
      
      if (!blob) {
        toast.error("Failed to capture image")
        return
      }

      // Create file from blob
      const file = new File([blob], 'expression.jpg', { type: 'image/jpeg' })
      
      // Store captured image for display
      const imageUrl = URL.createObjectURL(blob)
      setCapturedImage(imageUrl)

      // Call ML API
      const result = await mlApi.classifyImage(parseInt(user.id), file)
      setMlResult(result)
      
      // Award points based on result
      if (result.label === 'Good' || result.label === 'Nice') {
        setPoints(prev => prev + 25)
        toast.success(`Great expression! +25 points`)
      } else {
        setPoints(prev => prev + 10)
        toast.info(`Expression analyzed! +10 points`)
      }
    } catch (error) {
      console.error('ML analysis failed:', error)
      toast.error("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Upload image for analysis
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isAuthenticated || !user) {
      toast.error("Please sign in to use ML analysis")
      return
    }

    setIsAnalyzing(true)
    setMlResult(null)

    try {
      // Display uploaded image
      const imageUrl = URL.createObjectURL(file)
      setCapturedImage(imageUrl)

      // Call ML API
      const result = await mlApi.classifyImage(parseInt(user.id), file)
      setMlResult(result)
      
      if (result.label === 'Good' || result.label === 'Nice') {
        setPoints(prev => prev + 25)
        toast.success(`Great expression! +25 points`)
      } else {
        setPoints(prev => prev + 10)
        toast.info(`Expression analyzed! +10 points`)
      }
    } catch (error) {
      console.error('ML analysis failed:', error)
      toast.error("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getMascotMood = () => {
    if (!detection.faceDetected) return "thinking"
    if (detection.emotion === "happy") return "excited"
    if (detection.emotion === "calm") return "calm"
    return "happy"
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-24 md:pb-8">
      <AppNav />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Video Fun Zone
            </h1>
            <p className="text-muted-foreground">
              Play games with your camera and discover your feelings!
            </p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-full">
            <Star className="w-6 h-6 text-secondary fill-secondary" />
            <span className="text-xl font-bold text-foreground">{points}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <div className="relative bg-card rounded-3xl border-4 border-primary/30 overflow-hidden aspect-video">
              {!permissionGranted ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-8">
                  <Mascot mood="waving" size="lg" className="mb-6" />
                  <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                    Let&apos;s Turn On Your Camera!
                  </h2>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    We need your camera to play fun games together. Don&apos;t worry, 
                    only you can see yourself!
                  </p>
                  <Button 
                    size="lg" 
                    onClick={handleStartCamera}
                    className="rounded-full px-8 py-6 text-lg font-bold"
                  >
                    <Camera className="w-6 h-6 mr-2" />
                    Turn On Camera
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
                  
                  {/* Hidden canvas for capturing frames */}
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Overlay UI */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        isActive ? "bg-primary-foreground animate-pulse" : "bg-muted-foreground"
                      )} />
                      <span className="font-semibold">
                        {isActive ? "Detecting..." : "Paused"}
                      </span>
                    </div>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleToggleDetection}
                      className="rounded-full"
                    >
                      {isActive ? (
                        <><Pause className="w-4 h-4 mr-1" /> Pause</>
                      ) : (
                        <><Play className="w-4 h-4 mr-1" /> Resume</>
                      )}
                    </Button>
                  </div>

                  {/* Mascot Companion */}
                  <div className="absolute bottom-4 right-4">
                    <Mascot mood={getMascotMood()} size="md" />
                  </div>
                </>
              )}
            </div>

            {/* Controls */}
            {permissionGranted && (
              <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleDetection}
                  className="rounded-full bg-transparent"
                >
                  {isActive ? (
                    <><CameraOff className="w-5 h-5 mr-2" /> Stop Camera</>
                  ) : (
                    <><Camera className="w-5 h-5 mr-2" /> Start Camera</>
                  )}
                </Button>
                <Button
                  size="lg"
                  onClick={awardPoints}
                  className="rounded-full"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Earn Points!
                </Button>
                {selectedActivity === 'ml-analysis' && isAuthenticated && (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={analyzeExpression}
                    disabled={isAnalyzing || !isActive}
                    className="rounded-full"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
                    ) : (
                      <><ImageIcon className="w-5 h-5 mr-2" /> Analyze Expression</>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Detection Results */}
            <EmotionDisplay
              emotion={detection.emotion}
              confidence={detection.emotionConfidence}
              attention={detection.attention}
              attentionScore={detection.attentionScore}
              gesture={detection.gesture}
              faceDetected={detection.faceDetected}
            />

            {/* ML Analysis Result */}
            {mlResult && (
              <div className="bg-card rounded-3xl border-4 border-mint p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-mint" />
                  ML Analysis Result
                </h3>
                
                {capturedImage && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img 
                      src={capturedImage} 
                      alt="Analyzed expression" 
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Label</span>
                    <span className={cn(
                      "font-bold px-3 py-1 rounded-full",
                      mlResult.label === 'Good' ? "bg-mint text-foreground" :
                      mlResult.label === 'Nice' ? "bg-sky text-foreground" :
                      "bg-coral text-foreground"
                    )}>
                      {mlResult.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-bold text-foreground">
                      {Math.round(mlResult.score * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Activities */}
            <div className="bg-card rounded-3xl border-4 border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Choose an Activity
              </h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => setSelectedActivity(activity.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 text-left transition-all",
                      selectedActivity === activity.id
                        ? "bg-primary/20 border-primary"
                        : "bg-muted/50 border-transparent hover:bg-muted"
                    )}
                  >
                    <p className="font-semibold text-foreground">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </button>
                ))}
              </div>

              {/* Upload Image Option */}
              {selectedActivity === 'ml-analysis' && (
                <div className="mt-4 pt-4 border-t border-border">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing || !isAuthenticated}
                    className="w-full rounded-xl border-2"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image to Analyze
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Sign in to use ML analysis
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
