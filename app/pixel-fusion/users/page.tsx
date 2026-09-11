"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Building2, School, Users as UsersIcon, ShieldCheck } from "lucide-react"
import { ORG_DIRECTORY } from "@/lib/notifications"

const NAVY = "#121051"
const ACCENT = "#B30089"

// Flatten the shared organisation directory into a lookup from an "access id"
// to the organisation and school it represents. A standalone school is its own
// organisation, so its org id and school id are the same.
type AccessInfo = {
  orgId: string
  orgName: string
  orgKind: "mat" | "school"
  schoolId: string
  schoolName: string
}

const ACCESS_LOOKUP: Record<string, AccessInfo> = {}
for (const org of ORG_DIRECTORY) {
  if (org.kind === "mat" && org.schools) {
    for (const s of org.schools) {
      ACCESS_LOOKUP[s.id] = {
        orgId: org.id,
        orgName: org.name,
        orgKind: "mat",
        schoolId: s.id,
        schoolName: s.name,
      }
    }
  } else {
    ACCESS_LOOKUP[org.id] = {
      orgId: org.id,
      orgName: org.name,
      orgKind: "school",
      schoolId: org.id,
      schoolName: org.name,
    }
  }
}

type SystemUser = {
  id: number
  name: string
  email: string
  roles: string[]
  lastActive: string | null
  // "all" grants system-wide access; otherwise a list of school / standalone ids.
  access: "all" | string[]
}

// Sample system-wide users. Several deliberately span more than one organisation
// (separate trusts and standalone schools) to show the full picture.
const SYSTEM_USERS: SystemUser[] = [
  {
    id: 1,
    name: "Gareth Hutchings",
    email: "gareth@fuze.com",
    roles: ["Platform Admin"],
    lastActive: "2026-07-02 15:44",
    access: "all",
  },
  {
    id: 2,
    name: "Sarah Thompson",
    email: "sarah.thompson@stclare.sch.uk",
    roles: ["Trust Data Lead", "Reports"],
    lastActive: "2026-07-02 14:44",
    access: ["school-1", "school-2", "school-3"],
  },
  {
    id: 3,
    name: "Daniel Foster",
    email: "daniel.foster@consult.co.uk",
    roles: ["Data Consultant"],
    lastActive: "2026-07-01 22:44",
    // Cross-trust plus a standalone school.
    access: ["school-1", "school-3", "school-4", "standalone-1"],
  },
  {
    id: 4,
    name: "Emily Carter",
    email: "emily.carter@sacredheart.sch.uk",
    roles: ["Attendance Lead", "User"],
    lastActive: "2026-07-02 09:44",
    access: ["school-4"],
  },
  {
    id: 5,
    name: "David Owusu",
    email: "david.owusu@stalbans.sch.uk",
    roles: ["SENDCo"],
    lastActive: "2026-06-28 08:12",
    access: ["standalone-1"],
  },
  {
    id: 6,
    name: "Priya Sharma",
    email: "priya.sharma@region.gov.uk",
    roles: ["Regional Advisor"],
    lastActive: "2026-07-01 17:44",
    // Access to both standalone schools and one trust.
    access: ["standalone-1", "standalone-2", "school-2"],
  },
  {
    id: 7,
    name: "Mark Robinson",
    email: "mark.robinson@holytrinity.sch.uk",
    roles: ["Business Manager", "Finance"],
    lastActive: "2026-06-30 11:20",
    access: ["standalone-2"],
  },
  {
    id: 8,
    name: "Rachel Green",
    email: "rachel.green@holyfamily.org.uk",
    roles: ["Assessment Lead"],
    lastActive: "2026-07-02 07:44",
    access: ["school-4", "school-1"],
  },
]

type AccessGroup = { orgId: string; orgName: string; schools: { id: string; name: string }[] }

// Group a user's accessible schools by the organisation (trust) they belong to,
// keeping standalone schools separate.
function groupAccess(access: string[]) {
  const trusts = new Map<string, AccessGroup>()
  const standalone: { id: string; name: string }[] = []

  for (const id of access) {
    const info = ACCESS_LOOKUP[id]
    if (!info) continue
    if (info.orgKind === "mat") {
      if (!trusts.has(info.orgId)) {
        trusts.set(info.orgId, { orgId: info.orgId, orgName: info.orgName, schools: [] })
      }
      trusts.get(info.orgId)!.schools.push({ id: info.schoolId, name: info.schoolName })
    } else {
      standalone.push({ id: info.schoolId, name: info.schoolName })
    }
  }

  return { trusts: Array.from(trusts.values()), standalone }
}

// Count of distinct organisations a user can reach (each trust and each
// standalone school counts as one organisation).
function organisationCount(access: "all" | string[]): number {
  if (access === "all") return ORG_DIRECTORY.length
  const { trusts, standalone } = groupAccess(access)
  return trusts.length + standalone.length
}

export default function SystemUsersPage() {
  const [search, setSearch] = useState("")
  const [orgFilter, setOrgFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  // All roles across the system, for the role filter.
  const allRoles = useMemo(() => {
    const set = new Set<string>()
    SYSTEM_USERS.forEach((u) => u.roles.forEach((r) => set.add(r)))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return SYSTEM_USERS.filter((user) => {
      const matchesSearch =
        q === "" || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)

      const matchesOrg =
        orgFilter === "all" ||
        user.access === "all" ||
        user.access.some((id) => ACCESS_LOOKUP[id]?.orgId === orgFilter)

      const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter)

      return matchesSearch && matchesOrg && matchesRole
    })
  }, [search, orgFilter, roleFilter])

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <main className="flex-1 px-4 pb-6 overflow-auto">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">System Users</h1>
                  <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                    Every user across the whole system, with each organisation and school they can access —
                    including users who span more than one trust or standalone school.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                    <UsersIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900">{SYSTEM_USERS.length}</span>
                    <span className="text-xs text-slate-500">users</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900">{ORG_DIRECTORY.length}</span>
                    <span className="text-xs text-slate-500">organisations</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <select
                  value={orgFilter}
                  onChange={(e) => setOrgFilter(e.target.value)}
                  className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B30089]/20"
                >
                  <option value="all">All organisations</option>
                  {ORG_DIRECTORY.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#B30089]/20"
                >
                  <option value="all">All roles</option>
                  {allRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {SYSTEM_USERS.length}{" "}
                users
              </p>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Roles</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                        Organisations &amp; schools
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                        Last active
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-500">
                          <UsersIcon className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                          <p className="font-medium">No users found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user) => {
                        const orgCount = organisationCount(user.access)
                        return (
                          <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                            {/* User */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold"
                                  style={{ backgroundColor: ACCENT }}
                                >
                                  {user.name
                                    .split(" ")
                                    .map((n) => n.charAt(0))
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    {orgCount} organisation{orgCount !== 1 ? "s" : ""}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Roles */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {user.roles.map((role) => (
                                  <span
                                    key={role}
                                    className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                                  >
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Organisations & schools */}
                            <td className="py-4 px-4 text-sm text-slate-600 align-top">
                              {user.access === "all" ? (
                                <span
                                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-white"
                                  style={{ backgroundColor: NAVY }}
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  All organisations &amp; schools
                                </span>
                              ) : (
                                (() => {
                                  const { trusts, standalone } = groupAccess(user.access)
                                  return (
                                    <div className="flex flex-col gap-2.5 min-w-[240px]">
                                      {trusts.map((group) => (
                                        <div key={group.orgId} className="flex flex-col gap-1">
                                          <div className="flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-[#B30089] shrink-0" />
                                            <span className="text-xs font-semibold text-slate-900">
                                              {group.orgName}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
                                              {group.schools.length}
                                            </span>
                                          </div>
                                          <div className="flex flex-col gap-0.5 pl-5">
                                            {group.schools.map((s) => (
                                              <span key={s.id} className="text-xs text-slate-600">
                                                {s.name}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                      {standalone.length > 0 && (
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-1.5">
                                            <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="text-xs font-semibold text-slate-900">
                                              Standalone schools
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
                                              {standalone.length}
                                            </span>
                                          </div>
                                          <div className="flex flex-col gap-0.5 pl-5">
                                            {standalone.map((s) => (
                                              <span key={s.id} className="text-xs text-slate-600">
                                                {s.name}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })()
                              )}
                            </td>

                            {/* Last active */}
                            <td className="py-4 px-4 text-sm text-slate-600 align-top whitespace-nowrap">
                              {user.lastActive ? (
                                user.lastActive
                              ) : (
                                <span className="text-slate-400">Never</span>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
