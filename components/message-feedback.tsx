"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const NAVY = "#33295e"
const ACCENT = "#fd6d6d"

export const FEEDBACK_CATEGORIES = [
  "Inaccurate data",
  "Didn't answer the question",
  "Incomplete answer",
  "Report formatting",
  "Too slow",
  "Other",
] as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]

export interface MessageFeedbackValue {
  rating: "up" | "down"
  category?: FeedbackCategory
  notes?: string
  submittedAt: string
}

interface MessageFeedbackProps {
  messageId: string
  value?: MessageFeedbackValue
  onSubmit: (value: MessageFeedbackValue) => void
}

export function MessageFeedback({ messageId, value, onSubmit }: MessageFeedbackProps) {
  const [draftRating, setDraftRating] = useState<"up" | "down" | null>(null)
  const [category, setCategory] = useState<FeedbackCategory | null>(null)
  const [notes, setNotes] = useState("")
  const [showError, setShowError] = useState(false)

  const activeRating = draftRating ?? value?.rating ?? null
  const isOpen = draftRating !== null
  const notesId = `feedback-notes-${messageId}`

  const handleRate = (rating: "up" | "down") => {
    if (draftRating === rating) {
      handleCancel()
      return
    }
    setDraftRating(rating)
    setCategory(value?.rating === rating ? value.category ?? null : null)
    setNotes(value?.rating === rating ? value.notes ?? "" : "")
    setShowError(false)
  }

  const handleCancel = () => {
    setDraftRating(null)
    setCategory(null)
    setNotes("")
    setShowError(false)
  }

  const handleSubmit = () => {
    if (!draftRating) return
    if (draftRating === "down" && !category) {
      setShowError(true)
      return
    }
    onSubmit({
      rating: draftRating,
      category: draftRating === "down" ? category ?? undefined : undefined,
      notes: notes.trim() || undefined,
      submittedAt: new Date().toISOString(),
    })
    handleCancel()
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleRate("up")}
          aria-label="Good answer"
          aria-pressed={activeRating === "up"}
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-slate-100"
          style={activeRating === "up" ? { color: "#ffffff", backgroundColor: NAVY } : { color: "#94a3b8" }}
        >
          <ThumbsUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleRate("down")}
          aria-label="Bad answer"
          aria-pressed={activeRating === "down"}
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-slate-100"
          style={activeRating === "down" ? { color: "#ffffff", backgroundColor: ACCENT } : { color: "#94a3b8" }}
        >
          <ThumbsDown className="h-4 w-4" />
        </button>
        {value && !isOpen && (
          <span className="ml-1 flex items-center gap-1 text-xs text-slate-500">
            <Check className="h-3 w-3 text-emerald-600" />
            {value.rating === "down" && value.category ? `Feedback sent · ${value.category}` : "Thanks for your feedback"}
          </span>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="flex flex-col gap-5 sm:max-w-lg">
          <DialogHeader className="flex flex-row items-center gap-3 text-left">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: draftRating === "up" ? NAVY : ACCENT, color: "#ffffff" }}
              aria-hidden="true"
            >
              {draftRating === "up" ? <ThumbsUp className="h-5 w-5" /> : <ThumbsDown className="h-5 w-5" />}
            </span>
            <div className="flex flex-col gap-1">
              <DialogTitle style={{ color: NAVY }}>
                {draftRating === "up" ? "What was good about this answer?" : "What went wrong?"}
              </DialogTitle>
              <DialogDescription>
                {draftRating === "up"
                  ? "Your feedback helps us improve the AI assistant."
                  : "Pick a category and add any details to help us fix it."}
              </DialogDescription>
            </div>
          </DialogHeader>

          {draftRating === "down" && (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-xs font-medium text-slate-600">
                Category <span style={{ color: ACCENT }}>*</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {FEEDBACK_CATEGORIES.map((option) => {
                  const selected = category === option
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setCategory(option)
                        setShowError(false)
                      }}
                      aria-pressed={selected}
                      className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                      style={
                        selected
                          ? { backgroundColor: NAVY, borderColor: NAVY, color: "#ffffff" }
                          : { borderColor: "#e2e8f0", color: "#475569" }
                      }
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
              {showError && (
                <p role="alert" className="text-xs" style={{ color: ACCENT }}>
                  Please choose a category.
                </p>
              )}
            </fieldset>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor={notesId} className="text-xs font-medium text-slate-600">
              Notes {draftRating === "up" && <span className="font-normal text-slate-400">(optional)</span>}
            </label>
            <Textarea
              id={notesId}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                draftRating === "up" ? "Tell us what worked well..." : "Tell us more about the issue..."
              }
              rows={3}
              maxLength={1000}
              className="resize-none text-sm"
            />
          </div>

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: NAVY, color: "#ffffff" }}
            >
              Submit feedback
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
