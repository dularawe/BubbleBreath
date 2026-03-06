"use client"

import { useState } from "react"
import { useReviews, useGames } from "@/hooks/use-api"
import { reviewApi, type Review } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, Star, MessageSquare, ThumbsUp, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminReviewsPage() {
  const { data: reviews, isLoading, mutate } = useReviews()
  const { data: games } = useGames()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [formData, setFormData] = useState({
    gameId: "",
    userId: "",
    rating: "5",
    comment: "",
    isApproved: true,
  })

  const resetForm = () => {
    setFormData({
      gameId: "",
      userId: "",
      rating: "5",
      comment: "",
      isApproved: true,
    })
  }

  const handleCreate = async () => {
    try {
      await reviewApi.create({
        gameId: formData.gameId,
        userId: formData.userId,
        rating: parseInt(formData.rating),
        comment: formData.comment,
        isApproved: formData.isApproved,
      })
      toast.success("Review created successfully")
      setIsCreateOpen(false)
      resetForm()
      mutate()
    } catch {
      toast.error("Failed to create review")
    }
  }

  const handleUpdate = async () => {
    if (!editingReview) return
    try {
      await reviewApi.update({
        id: editingReview.id,
        rating: parseInt(formData.rating),
        comment: formData.comment,
        isApproved: formData.isApproved,
      })
      toast.success("Review updated successfully")
      setEditingReview(null)
      resetForm()
      mutate()
    } catch {
      toast.error("Failed to update review")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    try {
      await reviewApi.delete(id)
      toast.success("Review deleted successfully")
      mutate()
    } catch {
      toast.error("Failed to delete review")
    }
  }

  const handleApprove = async (review: Review) => {
    try {
      await reviewApi.update({ id: review.id, isApproved: !review.isApproved })
      toast.success(review.isApproved ? "Review hidden" : "Review approved")
      mutate()
    } catch {
      toast.error("Failed to update review")
    }
  }

  const openEditDialog = (review: Review) => {
    setEditingReview(review)
    setFormData({
      gameId: review.gameId,
      userId: review.userId,
      rating: review.rating.toString(),
      comment: review.comment,
      isApproved: review.isApproved,
    })
  }

  const averageRating = reviews?.length 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"
  const approvedReviews = reviews?.filter(r => r.isApproved).length || 0
  const pendingReviews = reviews?.filter(r => !r.isApproved).length || 0

  const getGameName = (gameId: string) => {
    const game = games?.find(g => g.id === gameId)
    return game?.name || "Unknown Game"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reviews Management</h1>
          <p className="text-muted-foreground">Manage user reviews and ratings</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Game</Label>
                <Select value={formData.gameId} onValueChange={(v) => setFormData({ ...formData, gameId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {games?.map((game) => (
                      <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  placeholder="Enter user ID"
                />
              </div>
              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Select value={formData.rating} onValueChange={(v) => setFormData({ ...formData, rating: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} Star{n > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Comment</Label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Write your review..."
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isApproved"
                  checked={formData.isApproved}
                  onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  className="rounded border-input"
                />
                <Label htmlFor="isApproved">Approved</Label>
              </div>
              <Button onClick={handleCreate} className="w-full">Create Review</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{averageRating}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            <MessageSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{reviews?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <ThumbsUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{approvedReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <MessageSquare className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{getGameName(review.gameId)}</TableCell>
                  <TableCell className="font-mono text-xs">{review.userId.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{review.comment}</TableCell>
                  <TableCell>
                    <Badge className={review.isApproved ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleApprove(review)}
                        title={review.isApproved ? "Hide review" : "Approve review"}
                      >
                        <ThumbsUp className={`w-4 h-4 ${review.isApproved ? "text-green-500" : "text-muted-foreground"}`} />
                      </Button>
                      <Dialog open={editingReview?.id === review.id} onOpenChange={(open) => !open && setEditingReview(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(review)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Review</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Rating (1-5)</Label>
                              <Select value={formData.rating} onValueChange={(v) => setFormData({ ...formData, rating: v })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((n) => (
                                    <SelectItem key={n} value={n.toString()}>
                                      {n} Star{n > 1 ? "s" : ""}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Comment</Label>
                              <Textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                rows={4}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="editIsApproved"
                                checked={formData.isApproved}
                                onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                                className="rounded border-input"
                              />
                              <Label htmlFor="editIsApproved">Approved</Label>
                            </div>
                            <Button onClick={handleUpdate} className="w-full">Update Review</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(review.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!reviews || reviews.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No reviews found. Create your first review above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
