"use client"

import { useState } from "react"
import { useChallenges, useGames } from "@/hooks/use-api"
import { challengeApi } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Pencil, Trash2, Loader2, Target, Search } from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"
import type { Challenge, ChallengeRequest } from "@/lib/api/types"

export default function ChallengesAdminPage() {
  const { data: challenges, isLoading, error } = useChallenges()
  const { data: games } = useGames()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [formData, setFormData] = useState<ChallengeRequest>({
    name: "",
    description: "",
    reward: 0,
    gameId: "",
    startDate: "",
    endDate: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      reward: 0,
      gameId: "",
      startDate: "",
      endDate: "",
    })
  }

  const handleCreate = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      await challengeApi.create(formData)
      toast.success("Challenge created successfully!")
      setIsCreateOpen(false)
      resetForm()
      mutate("challenges")
    } catch (err) {
      console.error(err)
      toast.error("Failed to create challenge")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingChallenge) return

    setIsSubmitting(true)
    try {
      await challengeApi.update({
        id: editingChallenge.id,
        ...formData,
      })
      toast.success("Challenge updated successfully!")
      setEditingChallenge(null)
      resetForm()
      mutate("challenges")
    } catch (err) {
      console.error(err)
      toast.error("Failed to update challenge")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return

    setDeletingId(id)
    try {
      await challengeApi.delete(id)
      toast.success("Challenge deleted successfully!")
      mutate("challenges")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete challenge")
    } finally {
      setDeletingId(null)
    }
  }

  const openEditDialog = (challenge: Challenge) => {
    setEditingChallenge(challenge)
    setFormData({
      name: challenge.name,
      description: challenge.description,
      reward: challenge.reward,
      gameId: challenge.gameId || "",
      startDate: challenge.startDate || "",
      endDate: challenge.endDate || "",
    })
  }

  const filteredChallenges = challenges?.filter(challenge =>
    challenge.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Target className="w-6 h-6 text-coral" />
          Challenges Management
        </h1>
        <p className="text-muted-foreground">Create, edit, and delete challenges</p>
      </div>

      <div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Challenge</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter challenge name"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter challenge description"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reward">Reward Points</Label>
                  <Input
                    id="reward"
                    type="number"
                    min={0}
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: parseInt(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="game">Associated Game</Label>
                  <Select
                    value={formData.gameId}
                    onValueChange={(value) => setFormData({ ...formData, gameId: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select game (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {games?.map((game) => (
                        <SelectItem key={game.id} value={game.id}>
                          {game.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                    "Create Challenge"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading challenges...</span>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border-2 border-destructive rounded-xl p-4 text-center">
            <p className="text-destructive">Failed to load challenges. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChallenges?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No challenges found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredChallenges?.map((challenge) => (
                    <TableRow key={challenge.id}>
                      <TableCell className="font-medium">{challenge.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{challenge.description}</TableCell>
                      <TableCell>{challenge.reward} pts</TableCell>
                      <TableCell>
                        {games?.find(g => g.id === challenge.gameId)?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          challenge.completed 
                            ? "bg-mint/20 text-mint" 
                            : challenge.active 
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {challenge.completed ? "Completed" : challenge.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(challenge)}
                            className="rounded-full"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(challenge.id)}
                            disabled={deletingId === challenge.id}
                            className="rounded-full text-destructive hover:text-destructive"
                          >
                            {deletingId === challenge.id ? (
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

        <Dialog open={!!editingChallenge} onOpenChange={(open) => !open && setEditingChallenge(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Challenge</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <Label htmlFor="edit-reward">Reward Points</Label>
                <Input
                  id="edit-reward"
                  type="number"
                  min={0}
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: parseInt(e.target.value) || 0 })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-game">Associated Game</Label>
                <Select
                  value={formData.gameId}
                  onValueChange={(value) => setFormData({ ...formData, gameId: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select game (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {games?.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                  "Update Challenge"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
