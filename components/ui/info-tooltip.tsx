"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoTooltipProps {
  content: string
  className?: string
  variant?: "default" | "monochrome"
}

export function InfoTooltip({ content, className, variant = "default" }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  const buttonClasses =
    variant === "monochrome"
      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
      : "bg-blue-100 text-blue-600 hover:bg-blue-200"

  const iconClasses = variant === "monochrome" ? "text-slate-700" : "text-blue-600"

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("inline-flex items-center justify-center w-5 h-5 rounded-full transition-colors", buttonClasses)}
        aria-label="More information"
      >
        <Info className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Tooltip */}
          <div className="absolute z-50 w-80 p-4 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg left-0 top-full">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Info className={cn("w-4 h-4 flex-shrink-0 mt-0.5", iconClasses)} />
                <span className="font-medium text-sm text-slate-900">How to answer this question</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </>
      )}
    </div>
  )
}
