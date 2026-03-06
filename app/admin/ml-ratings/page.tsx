"use client"

import { useState } from "react"
import { useImageRatings } from "@/hooks/use-api"
import { mlApi, type ImageRating } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Pencil, Trash2, Loader2, Smile, Search, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MLRatingsAdminPage() {
  const { data: ratings, isLoading, mutate } = useImageRatings()
  const [searchQuery, setSearchQuery] = useState("")
  const [editingRating, setEditingRating] = useState<ImageRating | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [viewingRating, setViewingRating] = useState<ImageRating | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    label: "Good" as "Good" | "Bad" | "Nice",
    score: 0,
    imageUrl: "",
  })

  const filteredRatings = ratings?.filter(rating =>
    rating.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rating.imageUrl.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (rating: ImageRating) => {
    setEditingRating(rating)
    setFormData({
      label: rating.label,
      score: rating.score,
      imageUrl: rating.imageUrl,
    })
  }

  const handleUpdate = async () => {
    if (!editingRating) return

    setIsSubmitting(true)
    try {
      await mlApi.update(editingRating.id, formData)
      toast.success("Rating updated successfully")
      setEditingRating(null)
      mutate()
    } catch {
      toast.error("Failed to update rating")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsSubmitting(true)
    try {
      await mlApi.delete(id)
      toast.success("Rating deleted successfully")
      setDeletingId(null)
      mutate()
    } catch {
      toast.error("Failed to delete rating")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getLabelColor = (label: string) => {
    switch (label) {
      case "Good":
        return "bg-mint text-foreground"
      case "Bad":
        return "bg-coral text-foreground"
      case "Nice":
        return "bg-sky text-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Smile className="w-6 h-6 text-sunny" />
          Smile Therapy Results
        </h1>
        <p className="text-muted-foreground">View and manage smile therapy game results</p>
      </div>

      <div>
        {/* Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by label or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading ratings...</span>
          </div>
        ) : !filteredRatings?.length ? (
          <div className="text-center py-12 text-muted-foreground">
            No image ratings found
          </div>
        ) : (
          <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRatings.map((rating) => (
                  <TableRow key={rating.id}>
                    <TableCell className="font-medium">{rating.id}</TableCell>
                    <TableCell>{rating.userId}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        getLabelColor(rating.label)
                      )}>
                        {rating.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">{rating.score.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingRating(rating)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {rating.createdAt ? new Date(rating.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(rating)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(rating.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* View Image Dialog */}
      <Dialog open={!!viewingRating} onOpenChange={() => setViewingRating(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              Rating: {viewingRating?.label} ({viewingRating?.score.toFixed(2)})
            </DialogDescription>
          </DialogHeader>
          {viewingRating && (
            <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
              <img
                src={viewingRating.imageUrl}
                alt="Classified image"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingRating} onOpenChange={() => setEditingRating(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rating</DialogTitle>
            <DialogDescription>
              Update the classification result
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Select
                value={formData.label}
                onValueChange={(value) => setFormData({ ...formData, label: value as "Good" | "Bad" | "Nice" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Bad">Bad</SelectItem>
                  <SelectItem value="Nice">Nice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRating(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rating</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rating? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingId && handleDelete(deletingId)}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
