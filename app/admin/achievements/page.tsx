"use client"

import { useState } from "react"
import { useAchievements } from "@/hooks/use-api"
import { achievementApi } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, Loader2, Trophy, Search } from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"
import type { Achievement, AchievementRequest } from "@/lib/api/types"

export default function AchievementsAdminPage() {
  const { data: achievements, isLoading, error } = useAchievements()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [formData, setFormData] = useState<AchievementRequest>({
    title: "",
    description: "",
    conditionType: "",
    value: 0,
    icon: "",
    color: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      conditionType: "",
      value: 0,
      icon: "",
      color: "",
    })
  }

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.conditionType) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await achievementApi.create(formData)
      toast.success("Achievement created successfully!")
      setIsCreateOpen(false)
      resetForm()
      mutate("achievements")
    } catch (err) {
      console.error(err)
      toast.error("Failed to create achievement")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingAchievement) return

    setIsSubmitting(true)
    try {
      await achievementApi.update({
        id: editingAchievement.id,
        ...formData,
      })
      toast.success("Achievement updated successfully!")
      setEditingAchievement(null)
      resetForm()
      mutate("achievements")
    } catch (err) {
      console.error(err)
      toast.error("Failed to update achievement")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return

    setDeletingId(id)
    try {
      await achievementApi.delete(id)
      toast.success("Achievement deleted successfully!")
      mutate("achievements")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete achievement")
    } finally {
      setDeletingId(null)
    }
  }

  const openEditDialog = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setFormData({
      title: achievement.title,
      description: achievement.description,
      conditionType: achievement.conditionType,
      value: achievement.value,
      icon: achievement.icon || "",
      color: achievement.color || "",
    })
  }

  const filteredAchievements = achievements?.filter(achievement =>
    achievement.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-sunny" />
          Achievements Management
        </h1>
        <p className="text-muted-foreground">Create, edit, and delete achievements</p>
      </div>

      <div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Achievement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter achievement title"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter achievement description"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conditionType">Condition Type *</Label>
                  <Input
                    id="conditionType"
                    value={formData.conditionType}
                    onChange={(e) => setFormData({ ...formData, conditionType: e.target.value })}
                    placeholder="e.g., games_played, stars_earned"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Target Value</Label>
                  <Input
                    id="value"
                    type="number"
                    min={0}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="e.g., star"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="e.g., bg-mint"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={isSubmitting}
                  className="w-full rounded-xl"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                  ) : (
                    "Create Achievement"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading achievements...</span>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border-2 border-destructive rounded-xl p-4 text-center">
            <p className="text-destructive">Failed to load achievements. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAchievements?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No achievements found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAchievements?.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell className="font-medium">{achievement.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{achievement.description}</TableCell>
                      <TableCell>{achievement.conditionType}</TableCell>
                      <TableCell>{achievement.value}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(achievement)}
                            className="rounded-full"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(achievement.id)}
                            disabled={deletingId === achievement.id}
                            className="rounded-full text-destructive hover:text-destructive"
                          >
                            {deletingId === achievement.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={!!editingAchievement} onOpenChange={(open) => !open && setEditingAchievement(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Achievement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-conditionType">Condition Type *</Label>
                <Input
                  id="edit-conditionType"
                  value={formData.conditionType}
                  onChange={(e) => setFormData({ ...formData, conditionType: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">Target Value</Label>
                <Input
                  id="edit-value"
                  type="number"
                  min={0}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-icon">Icon</Label>
                  <Input
                    id="edit-icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Color</Label>
                  <Input
                    id="edit-color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="w-full rounded-xl"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                ) : (
                  "Update Achievement"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
