"use client"

import { useMemo, useRef, useState } from "react"
import { Users, Shield, Search, X, Plus, Check } from "lucide-react"

export type Assignee = { id: string; name: string; type: "role" | "user" }

// Mock data — replace with real roles/users later
export const MOCK_ROLES: { id: string; name: string }[] = [
  { id: "role-ht", name: "Head Teacher" },
  { id: "role-htr-viewer", name: "Head Teacher Report Viewer" },
  { id: "role-school-viewer", name: "School Viewer" },
  { id: "role-governor", name: "Governor" },
  { id: "role-trust-admin", name: "Trust Administrator" },
  { id: "role-finance", name: "Finance Lead" },
]

export const MOCK_USERS: { id: string; name: string; email: string }[] = [
  { id: "user-1", name: "Sarah Thompson", email: "s.thompson@sjc.ac.uk" },
  { id: "user-2", name: "David Okafor", email: "d.okafor@sjc.ac.uk" },
  { id: "user-3", name: "Priya Patel", email: "p.patel@sjc.ac.uk" },
  { id: "user-4", name: "James McAllister", email: "j.mcallister@sjc.ac.uk" },
  { id: "user-5", name: "Chris Bennett", email: "c.bennett@sjc.ac.uk" },
]

interface PermissionAssignerProps {
  label: string
  assignees: Assignee[]
  onChange: (assignees: Assignee[]) => void
  size?: "sm" | "md"
}

export function PermissionAssigner({ label, assignees, onChange, size = "md" }: PermissionAssignerProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"role" | "user">("role")
  const [query, setQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const isSelected = (id: string) => assignees.some((a) => a.id === id)

  const toggle = (item: Assignee) => {
    if (isSelected(item.id)) {
      onChange(assignees.filter((a) => a.id !== item.id))
    } else {
      onChange([...assignees, item])
    }
  }

  const remove = (id: string) => onChange(assignees.filter((a) => a.id !== id))

  const filteredRoles = useMemo(
    () => MOCK_ROLES.filter((r) => r.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  )
  const filteredUsers = useMemo(
    () =>
      MOCK_USERS.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white font-medium text-slate-600 transition-colors hover:border-[#33295e] hover:bg-[#33295e] hover:text-white ${
            size === "sm" ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-sm"
          }`}
          aria-label={`Assign permissions for ${label}`}
        >
          Permissions
          {assignees.length > 0 && (
            <span className="ml-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-[#33295e] px-1 text-[10px] font-semibold text-white">
              {assignees.length}
            </span>
          )}
        </button>

        {assignees.map((a) => (
          <span
            key={a.id}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-0.5 pl-2 pr-1 text-xs font-medium text-slate-700"
          >
            {a.type === "role" ? <Shield className="h-3 w-3 text-[#33295e]" /> : <Users className="h-3 w-3 text-[#33295e]" />}
            {a.name}
            <button
              type="button"
              onClick={() => remove(a.id)}
              className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              aria-label={`Remove ${a.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            {/* Toggle */}
            <div className="flex gap-1 border-b border-slate-100 p-2">
              <button
                type="button"
                onClick={() => setTab("role")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === "role" ? "bg-[#33295e] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Roles
              </button>
              <button
                type="button"
                onClick={() => setTab("user")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === "user" ? "bg-[#33295e] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Users
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-slate-100 p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tab === "role" ? "Search roles..." : "Search users..."}
                  className="w-full rounded-md border border-slate-200 py-2 pl-8 pr-3 text-sm focus:border-[#33295e] focus:outline-none focus:ring-1 focus:ring-[#33295e]"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto p-1">
              {tab === "role" &&
                (filteredRoles.length ? (
                  filteredRoles.map((role) => {
                    const selected = isSelected(role.id)
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggle({ id: role.id, name: role.name, type: "role" })}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-slate-50"
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selected ? "border-[#33295e] bg-[#33295e] text-white" : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="text-sm text-slate-700">{role.name}</span>
                      </button>
                    )
                  })
                ) : (
                  <p className="px-3 py-6 text-center text-sm text-slate-400">No roles found</p>
                ))}

              {tab === "user" &&
                (filteredUsers.length ? (
                  filteredUsers.map((user) => {
                    const selected = isSelected(user.id)
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggle({ id: user.id, name: user.name, type: "user" })}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-slate-50"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                            selected ? "border-[#33295e] bg-[#33295e] text-white" : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-slate-700">{user.name}</span>
                          <span className="block truncate text-xs text-slate-400">{user.email}</span>
                        </span>
                      </button>
                    )
                  })
                ) : (
                  <p className="px-3 py-6 text-center text-sm text-slate-400">No users found</p>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2">
              <span className="text-xs text-slate-500">
                {assignees.length} assigned to {label}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 rounded-md bg-[#33295e] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#33295e]/90"
              >
                <Plus className="h-3 w-3" />
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
