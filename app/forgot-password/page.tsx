"use client"

import { useState } from "react"
import Link from "next/link"
import { authApi } from "@/lib/api/client"
import { Mascot } from "@/components/mascot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = () => {
    if (!email) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email")
      return false
    }
    setError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) return
    
    setIsLoading(true)
    
    try {
      await authApi.forgotPassword({ email })
      setIsSuccess(true)
      toast.success("Reset link sent! Check your email.")
    } catch {
      toast.error("Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-foreground" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Check Your Email!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            We sent a password reset link to <strong className="text-foreground">{email}</strong>. 
            Click the link in the email to reset your password.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => setIsSuccess(false)}
              variant="outline"
              className="w-full h-12 rounded-xl border-2"
            >
              Resend Email
            </Button>
            
            <Link href="/login">
              <Button className="w-full h-12 rounded-xl">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Mascot mood="thinking" size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Forgot Password?
          </h1>
          <p className="text-muted-foreground">
            No worries! Enter your email and we will send you a reset link.
          </p>
        </div>

        {/* Form */}
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
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
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
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Reset Link
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  )
}
