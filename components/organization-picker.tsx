"use client"

import { useMemo, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type Organization = {
  urn: string
  name: string
  type: "mat" | "school"
  schoolCount?: number
}

export function OrganizationPicker({
  mats,
  schools,
  selected,
  onChange,
}: {
  mats: Organization[]
  schools: Organization[]
  selected: string[]
  onChange: (urns: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const q = query.trim().toLowerCase()
  const filteredMats = useMemo(() => mats.filter((m) => m.name.toLowerCase().includes(q)), [mats, q])
  const filteredSchools = useMemo(() => schools.filter((s) => s.name.toLowerCase().includes(q)), [schools, q])

  const visibleUrns = [...filteredMats, ...filteredSchools].map((o) => o.urn)
  const allVisibleSelected = visibleUrns.length > 0 && visibleUrns.every((u) => selected.includes(u))

  const toggle = (urn: string) => {
    onChange(selected.includes(urn) ? selected.filter((u) => u !== urn) : [...selected, urn])
  }

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      onChange(selected.filter((u) => !visibleUrns.includes(u)))
    } else {
      onChange(Array.from(new Set([...selected, ...visibleUrns])))
    }
  }

  const allOrgs = [...mats, ...schools]
  const label =
    selected.length === 0
      ? "Select organisation..."
      : selected.length === 1
        ? (allOrgs.find((o) => o.urn === selected[0])?.name ?? "1 selected")
        : `${selected.length} selected`

  const Row = ({ org }: { org: Organization }) => {
    const checked = selected.includes(org.urn)
    return (
      <button
        type="button"
        onClick={() => toggle(org.urn)}
        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 rounded-md transition-colors"
      >
        <span
          className={cn(
            "flex items-center justify-center w-5 h-5 rounded-md border shrink-0 transition-colors",
            checked ? "bg-[#33295e] border-[#33295e]" : "border-slate-300 bg-white",
          )}
        >
          {checked && <Check className="w-3.5 h-3.5 text-white" />}
        </span>
        <span className="flex-1 min-w-0 text-sm text-slate-700 truncate">{org.name}</span>
        {org.type === "mat" && (
          <span className="text-xs text-slate-400 shrink-0">{org.schoolCount ?? 0} schools</span>
        )}
      </button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="h-9 w-full min-w-[190px] flex items-center justify-between gap-2 text-sm border border-slate-200 bg-slate-50 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#33295e]"
        >
          <span className={cn("truncate", selected.length === 0 ? "text-slate-400" : "text-slate-700")}>{label}</span>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <div className="flex items-center gap-3 p-3 border-b border-slate-100">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search MATs or schools..."
            className="flex-1 min-w-0 h-9 text-sm border border-slate-200 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-[#33295e]"
          />
          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-sm text-[#33295e] font-medium shrink-0 hover:underline"
          >
            {allVisibleSelected ? "Clear all" : "Select all"}
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredMats.length > 0 && (
            <div className="px-1">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Multi-Academy Trusts
              </p>
              {filteredMats.map((m) => (
                <Row key={m.urn} org={m} />
              ))}
            </div>
          )}
          {filteredSchools.length > 0 && (
            <div className="px-1 mt-1">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Schools</p>
              {filteredSchools.map((s) => (
                <Row key={s.urn} org={s} />
              ))}
            </div>
          )}
          {filteredMats.length === 0 && filteredSchools.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-slate-400">No organisations found</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
