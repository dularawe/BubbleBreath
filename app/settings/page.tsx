"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppNav } from "@/components/app-nav"
import { Mascot } from "@/components/mascot"
import { useAuth } from "@/lib/auth-context"
import { authApi } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  User, Lock, LogOut, Eye, EyeOff, Shield, 
  ChevronRight, CheckCircle, AlertCircle
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout, logoutAll, isAuthenticated } = useAuth()
  
  const [activeSection, setActiveSection] = useState<"profile" | "password" | "security">("profile")
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  const validatePasswordChange = () => {
    const errors: Record<string, string> = {}
    
    if (!currentPassword) {
      errors.currentPassword = "Current password is required"
    }
    
    if (!newPassword) {
      errors.newPassword = "New password is required"
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
    }
    
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }
    
    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordChange()) return
    
    setIsChangingPassword(true)
    
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword
      })
      
      toast.success("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      toast.error("Failed to change password. Please check your current password.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success("Logged out successfully")
    router.push("/login")
  }

  const handleLogoutAll = async () => {
    await logoutAll()
    toast.success("Logged out from all devices")
    router.push("/login")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pt-24 md:pb-8">
        <AppNav />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-card rounded-3xl border-4 border-primary/30 p-8 text-center">
            <Mascot mood="thinking" size="lg" className="mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Please Sign In
            </h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to access settings.
            </p>
            <Button onClick={() => router.push("/login")} className="rounded-full">
              Go to Sign In
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-24 md:pb-8">
      <AppNav />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Mascot mood="happy" size="md" animate={false} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-2xl border-2 border-border p-4 space-y-2">
              <button
                onClick={() => setActiveSection("profile")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                  activeSection === "profile" ? "bg-primary/20 text-primary" : "hover:bg-muted"
                )}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
              
              <button
                onClick={() => setActiveSection("password")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                  activeSection === "password" ? "bg-primary/20 text-primary" : "hover:bg-muted"
                )}
              >
                <Lock className="w-5 h-5" />
                <span className="font-medium">Password</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
              
              <button
                onClick={() => setActiveSection("security")}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                  activeSection === "security" ? "bg-primary/20 text-primary" : "hover:bg-muted"
                )}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Security</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeSection === "profile" && (
              <div className="bg-card rounded-3xl border-4 border-border p-6">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                      {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-lg">
                        {user?.name || "User"}
                      </p>
                      <p className="text-muted-foreground">{user?.email}</p>
                      {user?.role && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full">
                          {user.role}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium text-foreground">{user?.email}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">User ID</p>
                      <p className="font-medium text-foreground font-mono text-sm">{user?.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "password" && (
              <div className="bg-card rounded-3xl border-4 border-border p-6">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Change Password
                </h2>
                
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="font-semibold">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="h-12 rounded-xl border-2 pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="font-semibold">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-12 rounded-xl border-2"
                      placeholder="Enter new password"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-semibold">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-xl border-2"
                      placeholder="Confirm new password"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full h-12 rounded-xl font-bold"
                  >
                    {isChangingPassword ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Changing Password...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Update Password
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <div className="bg-card rounded-3xl border-4 border-border p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Security Options
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">Sign Out</p>
                          <p className="text-sm text-muted-foreground">
                            Sign out from this device only
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="rounded-xl border-2"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-destructive/10 rounded-xl border-2 border-destructive/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">Sign Out Everywhere</p>
                          <p className="text-sm text-muted-foreground">
                            Sign out from all devices and sessions
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={handleLogoutAll}
                          className="rounded-xl"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out All
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
