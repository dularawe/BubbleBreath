"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Mascot } from "@/components/mascot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await login({ email, password })
      toast.success("Welcome back!")
      router.push("/")
    } catch {
      toast.error("Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Mascot mood="waving" size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to <span className="text-primary">Mind</span>Pals!
          </h1>
          <p className="text-muted-foreground">
            Sign in to continue your adventure
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-3xl border-4 border-primary/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-2 border-border focus:border-primary"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl border-2 border-border focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-lg font-bold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sample Login Credentials */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 border-2 border-dashed border-border">
            <p className="text-sm font-semibold text-foreground mb-3 text-center">
              Sample Login Credentials (Testing)
            </p>
            <div className="space-y-3">
              {/* User Credentials */}
              <div 
                className="bg-card rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors border border-border"
                onClick={() => {
                  setEmail("user@mindpals.com")
                  setPassword("user123456")
                  toast.info("User credentials filled!")
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-mint uppercase tracking-wide">User Account</span>
                  <span className="text-xs text-muted-foreground">Click to fill</span>
                </div>
                <p className="text-sm text-foreground">user@mindpals.com</p>
                <p className="text-sm text-muted-foreground">user123456</p>
              </div>
              
              {/* Admin Credentials */}
              <div 
                className="bg-card rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors border border-border"
                onClick={() => {
                  setEmail("admin@mindpals.com")
                  setPassword("admin123456")
                  toast.info("Admin credentials filled!")
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-coral uppercase tracking-wide">Admin Account</span>
                  <span className="text-xs text-muted-foreground">Click to fill</span>
                </div>
                <p className="text-sm text-foreground">admin@mindpals.com</p>
                <p className="text-sm text-muted-foreground">admin123456</p>
              </div>
            </div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
