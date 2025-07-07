"use client"

import { cn } from "@/lib/utils"

interface RAGPickerProps {
  value: "red" | "amber" | "green" | ""
  onChange: (value: "red" | "amber" | "green") => void
  label?: string
  className?: string
}

export function RAGPicker({ value, onChange, label, className }: RAGPickerProps) {
  const options = [
    { value: "red", label: "Red", color: "bg-red-500", description: "Requires Improvement" },
    { value: "amber", label: "Amber", color: "bg-amber-500", description: "Good" },
    { value: "green", label: "Green", color: "bg-green-500", description: "Outstanding" },
  ] as const

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="flex gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:shadow-md",
              value === option.value ? "border-slate-400 shadow-md" : "border-slate-200 hover:border-slate-300",
            )}
          >
            <div className={cn("w-8 h-8 rounded-full mb-2", option.color)} />
            <span className="text-sm font-medium">{option.label}</span>
            <span className="text-xs text-slate-500 text-center">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
