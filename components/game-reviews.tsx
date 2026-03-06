"use client"

import { useState } from "react"
import { useGameReviews } from "@/hooks/use-api"
import { useAuth } from "@/lib/auth-context"
import { reviewApi } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { mutate } from "swr"

interface GameReviewsProps {
  gameId: string
  gameName: string
}

export function GameReviews({ gameId, gameName }: GameReviewsProps) {
  const { user, isAuthenticated } = useAuth()
  const { data: reviews, isLoading, error } = useGameReviews(gameId)
  
  const [isWriting, setIsWriting] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to leave a review")
      return
    }

    if (!comment.trim()) {
      toast.error("Please write a comment")
      return
    }

    setIsSubmitting(true)

    try {
      await reviewApi.create({
        gameId,
        userId: user.id,
        rating,
        comment: comment.trim(),
      })

      toast.success("Review submitted!")
      setComment("")
      setRating(5)
      setIsWriting(false)
      
      // Refresh reviews
      mutate(`reviews-game-${gameId}`)
    } catch (err) {
      console.error('Failed to submit review:', err)
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  return (
    <div className="bg-card rounded-3xl border-4 border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Reviews
          </h3>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-4 h-4",
                      star <= Math.round(averageRating)
                        ? "fill-secondary text-secondary"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          )}
        </div>

        {isAuthenticated && !isWriting && (
          <Button
            onClick={() => setIsWriting(true)}
            variant="outline"
            className="rounded-full"
          >
            Write Review
          </Button>
        )}
      </div>

      {/* Write Review Form */}
      {isWriting && (
        <div className="mb-6 p-4 bg-muted/50 rounded-2xl">
          <p className="font-semibold text-foreground mb-3">
            Rate {gameName}
          </p>
          
          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "w-8 h-8",
                    star <= rating
                      ? "fill-secondary text-secondary"
                      : "text-muted hover:text-secondary/50"
                  )}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating === 1 && "Not great"}
              {rating === 2 && "Okay"}
              {rating === 3 && "Good"}
              {rating === 4 && "Great!"}
              {rating === 5 && "Amazing!"}
            </span>
          </div>

          {/* Comment */}
          <Textarea
            placeholder="What did you think about this game?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-4 rounded-xl"
            rows={3}
          />

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="rounded-full"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                "Submit Review"
              )}
            </Button>
            <Button
              onClick={() => setIsWriting(false)}
              variant="ghost"
              className="rounded-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading reviews...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Could not load reviews</p>
        </div>
      )}

      {/* Reviews List */}
      {!isLoading && reviews && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted mx-auto mb-3" />
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-muted/30 rounded-2xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">
                        {review.userName || "Anonymous"}
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-3 h-3",
                              star <= review.rating
                                ? "fill-secondary text-secondary"
                                : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {review.comment}
                    </p>
                    {review.createdAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sign in prompt */}
      {!isAuthenticated && (
        <div className="mt-4 p-4 bg-muted/30 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            Sign in to leave a review
          </p>
        </div>
      )}
    </div>
  )
}
