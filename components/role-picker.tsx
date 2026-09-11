"use client"

import { useMemo, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type Role = {
  id: string
  name: string
}

export type RoleGroup = {
  orgName: string
  roles: Role[]
}

export function RolePicker({
  groups,
  selected,
  onChange,
}: {
  groups: RoleGroup[]
  selected: string[]
  onChange: (ids: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const q = query.trim().toLowerCase()

  const filteredGroups = useMemo(
    () =>
      groups.map((g) => ({
        ...g,
        roles: q ? g.roles.filter((r) => r.name.toLowerCase().includes(q)) : g.roles,
      })),
    [groups, q],
  )

  const allRoleIds = groups.flatMap((g) => g.roles.map((r) => r.id))
  const label =
    selected.length === 0
      ? "Select roles..."
      : selected.length === 1
        ? (groups.flatMap((g) => g.roles).find((r) => r.id === selected[0])?.name ?? "1 selected")
        : `${selected.length} selected`

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((r) => r !== id) : [...selected, id])
  }

  const Row = ({ role }: { role: Role }) => {
    const checked = selected.includes(role.id)
    return (
      <button
        type="button"
        onClick={() => toggle(role.id)}
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
        <span className="flex-1 min-w-0 text-sm text-slate-700 truncate">{role.name}</span>
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
        <div className="p-3 border-b border-slate-100">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles..."
            className="w-full h-9 text-sm border border-slate-200 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-[#33295e]"
          />
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {groups.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-400">Select an organisation first</p>
          ) : (
            filteredGroups.map((group, i) => (
              <div key={`${group.orgName}-${i}`} className="px-1">
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {group.orgName}
                </p>
                {group.roles.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-slate-400">No roles available</p>
                ) : (
                  group.roles.map((role) => <Row key={role.id} role={role} />)
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
