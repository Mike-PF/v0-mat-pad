"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Building2, School, Users as UsersIcon, ShieldCheck, Trash2, Pencil, Mail, Clock } from "lucide-react"
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

// A user's roles are assigned per school, so the same person can be (for example)
// a Trust Data Lead at one school and only a Reports user at another.
type SchoolAccess = { schoolId: string; roles: string[] }

type SystemUser = {
  id: number
  name: string
  email: string
  lastActive: string | null
  // "all" grants system-wide access with systemRoles applied everywhere;
  // otherwise access is a per-school list, each carrying its own roles.
  access: "all" | SchoolAccess[]
  // Only used when access === "all".
  systemRoles: string[]
}

// Sample system-wide users. Several deliberately span more than one organisation
// (separate trusts and standalone schools) and hold different roles per school.
const SYSTEM_USERS: SystemUser[] = [
  {
    id: 1,
    name: "Gareth Hutchings",
    email: "gareth@fuze.com",
    lastActive: "2026-07-02 15:44",
    access: "all",
    systemRoles: ["Platform Admin"],
  },
  {
    id: 2,
    name: "Sarah Thompson",
    email: "sarah.thompson@stclare.sch.uk",
    lastActive: "2026-07-02 14:44",
    systemRoles: [],
    access: [
      { schoolId: "school-1", roles: ["Trust Data Lead", "Reports"] },
      { schoolId: "school-2", roles: ["Trust Data Lead"] },
      { schoolId: "school-3", roles: ["Reports"] },
    ],
  },
  {
    id: 3,
    name: "Daniel Foster",
    email: "daniel.foster@consult.co.uk",
    lastActive: "2026-07-01 22:44",
    systemRoles: [],
    // Cross-trust plus a standalone school, with different roles at each.
    access: [
      { schoolId: "school-1", roles: ["Data Consultant"] },
      { schoolId: "school-3", roles: ["Data Consultant", "Reports"] },
      { schoolId: "school-4", roles: ["Data Consultant"] },
      { schoolId: "standalone-1", roles: ["Data Consultant", "Assessment Lead"] },
    ],
  },
  {
    id: 4,
    name: "Emily Carter",
    email: "emily.carter@sacredheart.sch.uk",
    lastActive: "2026-07-02 09:44",
    systemRoles: [],
    access: [{ schoolId: "school-4", roles: ["Attendance Lead", "User"] }],
  },
  {
    id: 5,
    name: "David Owusu",
    email: "david.owusu@stalbans.sch.uk",
    lastActive: "2026-06-28 08:12",
    systemRoles: [],
    access: [{ schoolId: "standalone-1", roles: ["SENDCo"] }],
  },
  {
    id: 6,
    name: "Priya Sharma",
    email: "priya.sharma@region.gov.uk",
    lastActive: "2026-07-01 17:44",
    systemRoles: [],
    // Access to both standalone schools and one trust, with a lighter role on the trust school.
    access: [
      { schoolId: "standalone-1", roles: ["Regional Advisor"] },
      { schoolId: "standalone-2", roles: ["Regional Advisor"] },
      { schoolId: "school-2", roles: ["Reports"] },
    ],
  },
  {
    id: 7,
    name: "Mark Robinson",
    email: "mark.robinson@holytrinity.sch.uk",
    lastActive: "2026-06-30 11:20",
    systemRoles: [],
    access: [{ schoolId: "standalone-2", roles: ["Business Manager", "Finance"] }],
  },
  {
    id: 8,
    name: "Rachel Green",
    email: "rachel.green@holyfamily.org.uk",
    lastActive: "2026-07-02 07:44",
    systemRoles: [],
    access: [
      { schoolId: "school-4", roles: ["Assessment Lead"] },
      { schoolId: "school-1", roles: ["Assessment Lead", "User"] },
    ],
  },
]

// Full catalogue of assignable roles, used by the edit form.
const ALL_ROLES = [
  "Platform Admin",
  "Trust Data Lead",
  "Data Consultant",
  "Attendance Lead",
  "SENDCo",
  "Regional Advisor",
  "Business Manager",
  "Finance",
  "Assessment Lead",
  "Reports",
  "User",
]

type AccessGroupSchool = { id: string; name: string; roles: string[] }
type AccessGroup = { orgId: string; orgName: string; schools: AccessGroupSchool[] }

// Group a user's accessible schools by the organisation (trust) they belong to,
// keeping standalone schools separate. Each school keeps its own role list.
function groupAccess(access: SchoolAccess[]) {
  const trusts = new Map<string, AccessGroup>()
  const standalone: AccessGroupSchool[] = []

  for (const a of access) {
    const info = ACCESS_LOOKUP[a.schoolId]
    if (!info) continue
    const entry = { id: info.schoolId, name: info.schoolName, roles: a.roles }
    if (info.orgKind === "mat") {
      if (!trusts.has(info.orgId)) {
        trusts.set(info.orgId, { orgId: info.orgId, orgName: info.orgName, schools: [] })
      }
      trusts.get(info.orgId)!.schools.push(entry)
    } else {
      standalone.push(entry)
    }
  }

  return { trusts: Array.from(trusts.values()), standalone }
}

// Count of distinct organisations a user can reach (each trust and each
// standalone school counts as one organisation).
function organisationCount(access: "all" | SchoolAccess[]): number {
  if (access === "all") return ORG_DIRECTORY.length
  const { trusts, standalone } = groupAccess(access)
  return trusts.length + standalone.length
}

// Distinct set of roles a user holds anywhere, for the summary column and filter.
function distinctRoles(user: SystemUser): string[] {
  if (user.access === "all") return user.systemRoles
  const set = new Set<string>()
  user.access.forEach((a) => a.roles.forEach((r) => set.add(r)))
  return Array.from(set)
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

// Small pink-tinted chip used to show a role assigned at a specific school.
function RoleChip({ role }: { role: string }) {
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium"
      style={{ backgroundColor: "rgba(179,0,137,0.08)", color: ACCENT }}
    >
      {role}
    </span>
  )
}

// Renders one school row with its per-school roles beneath the name.
function SchoolWithRoles({ name, roles }: { name: string; roles: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-700">{name}</span>
      <div className="flex flex-wrap gap-1">
        {roles.length > 0 ? (
          roles.map((r) => <RoleChip key={r} role={r} />)
        ) : (
          <span className="text-[10px] italic text-slate-400">No roles</span>
        )}
      </div>
    </div>
  )
}

// Renders a user's organisation/school access grouped by trust + standalone
// schools, with the roles held at each individual school.
function AccessBreakdown({ access, systemRoles }: { access: "all" | SchoolAccess[]; systemRoles: string[] }) {
  if (access === "all") {
    return (
      <div className="flex flex-col gap-2 min-w-[240px]">
        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: NAVY }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          All organisations &amp; schools
        </span>
        <div className="flex flex-wrap gap-1 pl-0.5">
          {systemRoles.map((r) => (
            <RoleChip key={r} role={r} />
          ))}
        </div>
      </div>
    )
  }

  const { trusts, standalone } = groupAccess(access)
  return (
    <div className="flex flex-col gap-3 min-w-[260px]">
      {trusts.map((group) => (
        <div key={group.orgId} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#B30089] shrink-0" />
            <span className="text-xs font-semibold text-slate-900">{group.orgName}</span>
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
              {group.schools.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 pl-5">
            {group.schools.map((s) => (
              <SchoolWithRoles key={s.id} name={s.name} roles={s.roles} />
            ))}
          </div>
        </div>
      ))}
      {standalone.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-900">Standalone schools</span>
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
              {standalone.length}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 pl-5">
            {standalone.map((s) => (
              <SchoolWithRoles key={s.id} name={s.name} roles={s.roles} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SystemUsersPage() {
  const [users, setUsers] = useState<SystemUser[]>(SYSTEM_USERS)
  const [search, setSearch] = useState("")
  const [orgFilter, setOrgFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  // Selected user for the detail modal.
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)
  // Delete confirmation.
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null)
  // Edit form state.
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editAccess, setEditAccess] = useState<SchoolAccess[]>([])
  const [editSystemRoles, setEditSystemRoles] = useState<string[]>([])

  // All roles across the system, for the role filter.
  const allRoles = useMemo(() => {
    const set = new Set<string>()
    users.forEach((u) => distinctRoles(u).forEach((r) => set.add(r)))
    return Array.from(set).sort()
  }, [users])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesSearch =
        q === "" || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)

      const matchesOrg =
        orgFilter === "all" ||
        user.access === "all" ||
        user.access.some((a) => ACCESS_LOOKUP[a.schoolId]?.orgId === orgFilter)

      const matchesRole = roleFilter === "all" || distinctRoles(user).includes(roleFilter)

      return matchesSearch && matchesOrg && matchesRole
    })
  }, [users, search, orgFilter, roleFilter])

  const openEdit = (user: SystemUser) => {
    setEditingUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditSystemRoles([...user.systemRoles])
    // Deep copy so role toggles don't mutate the stored user until saved.
    setEditAccess(user.access === "all" ? [] : user.access.map((a) => ({ schoolId: a.schoolId, roles: [...a.roles] })))
    // Close the detail modal so the edit dialog takes focus.
    setSelectedUser(null)
  }

  const toggleSchoolRole = (schoolId: string, role: string) => {
    setEditAccess((prev) =>
      prev.map((a) =>
        a.schoolId === schoolId
          ? { ...a, roles: a.roles.includes(role) ? a.roles.filter((r) => r !== role) : [...a.roles, role] }
          : a,
      ),
    )
  }

  const toggleSystemRole = (role: string) => {
    setEditSystemRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const saveEdit = () => {
    if (!editingUser) return
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: editName.trim() || u.name,
              email: editEmail.trim() || u.email,
              access: u.access === "all" ? "all" : editAccess,
              systemRoles: u.access === "all" ? editSystemRoles : u.systemRoles,
            }
          : u,
      ),
    )
    setEditingUser(null)
  }

  const confirmDelete = () => {
    if (!userToDelete) return
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
    setUserToDelete(null)
    setSelectedUser(null)
  }

  // Grouped view of the access currently being edited, for the edit form.
  const editGroups = useMemo(() => groupAccess(editAccess), [editAccess])

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
                    Every user across the whole system, with the roles they hold at each organisation and school —
                    including users who span more than one trust or standalone school. Select a user to view their
                    per-school roles and manage their account.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                    <UsersIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900">{users.length}</span>
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
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {users.length}{" "}
                users
              </p>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Roles held</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">
                        Roles per organisation &amp; school
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                        Last active
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500">
                          <UsersIcon className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                          <p className="font-medium">No users found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user) => {
                        const orgCount = organisationCount(user.access)
                        const roles = distinctRoles(user)
                        return (
                          <tr
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                          >
                            {/* User */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold"
                                  style={{ backgroundColor: ACCENT }}
                                >
                                  {initials(user.name)}
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

                            {/* Roles held (aggregated) */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {roles.map((role) => (
                                  <span
                                    key={role}
                                    className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                                  >
                                    {role}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Roles per organisation & school */}
                            <td className="py-4 px-4 text-sm text-slate-600 align-top">
                              <AccessBreakdown access={user.access} systemRoles={user.systemRoles} />
                            </td>

                            {/* Last active */}
                            <td className="py-4 px-4 text-sm text-slate-600 align-top whitespace-nowrap">
                              {user.lastActive ? user.lastActive : <span className="text-slate-400">Never</span>}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 align-top">
                              <div className="flex items-center justify-end gap-1">
                                <TooltipProvider delayDuration={300}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setUserToDelete(user)
                                        }}
                                        className="p-2 text-slate-400 hover:text-[#121051] hover:bg-slate-100 rounded transition-colors"
                                        aria-label={`Delete ${user.name}`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Delete user</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider delayDuration={300}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          openEdit(user)
                                        }}
                                        className="p-2 text-slate-400 hover:text-[#121051] hover:bg-slate-100 rounded transition-colors"
                                        aria-label={`Edit ${user.name}`}
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit user</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
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

      {/* User detail modal */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-lg !block max-h-[85vh] overflow-y-auto">
          {selectedUser && (
            <div>
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white text-lg font-semibold"
                  style={{ backgroundColor: ACCENT }}
                >
                  {initials(selectedUser.name)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900">{selectedUser.name}</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedUser.email}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    Last active: {selectedUser.lastActive ?? "Never"}
                  </p>
                </div>
              </div>

              {/* Roles held (aggregated) */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Roles held</h3>
                <div className="flex flex-wrap gap-1.5">
                  {distinctRoles(selectedUser).map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white"
                      style={{ backgroundColor: NAVY }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Roles per organisation & school */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Roles per organisation &amp; school ({organisationCount(selectedUser.access)})
                </h3>
                <div className="rounded-lg border border-slate-200 p-4">
                  <AccessBreakdown access={selectedUser.access} systemRoles={selectedUser.systemRoles} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUserToDelete(selectedUser)
                  }}
                  className="px-4 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </Button>
                <Button
                  onClick={() => openEdit(selectedUser)}
                  className="px-4 text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  <Pencil className="w-4 h-4 mr-1.5" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-lg !block max-h-[85vh] overflow-y-auto">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Edit User</h2>

          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Name</label>
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-11" />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
            <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="h-11" />
          </div>

          {editingUser?.access === "all" ? (
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 mb-2 block">System roles (apply everywhere)</label>
              <div className="flex flex-wrap gap-2">
                {ALL_ROLES.map((role) => {
                  const active = editSystemRoles.includes(role)
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleSystemRole(role)}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                        active ? "text-white border-transparent" : "text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                      style={active ? { backgroundColor: NAVY } : undefined}
                    >
                      {role}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Roles per organisation &amp; school</label>
              <div className="flex flex-col gap-4">
                {editGroups.trusts.map((group) => (
                  <div key={group.orgId} className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#B30089] shrink-0" />
                      <span className="text-xs font-semibold text-slate-900">{group.orgName}</span>
                    </div>
                    {group.schools.map((s) => (
                      <div key={s.id} className="pl-5">
                        <p className="text-xs text-slate-700 mb-1.5">{s.name}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ALL_ROLES.map((role) => {
                            const active = s.roles.includes(role)
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => toggleSchoolRole(s.id, role)}
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-colors ${
                                  active
                                    ? "text-white border-transparent"
                                    : "text-slate-600 border-slate-200 hover:border-slate-300"
                                }`}
                                style={active ? { backgroundColor: NAVY } : undefined}
                              >
                                {role}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                {editGroups.standalone.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-900">Standalone schools</span>
                    </div>
                    {editGroups.standalone.map((s) => (
                      <div key={s.id} className="pl-5">
                        <p className="text-xs text-slate-700 mb-1.5">{s.name}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ALL_ROLES.map((role) => {
                            const active = s.roles.includes(role)
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => toggleSchoolRole(s.id, role)}
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-colors ${
                                  active
                                    ? "text-white border-transparent"
                                    : "text-slate-600 border-slate-200 hover:border-slate-300"
                                }`}
                                style={active ? { backgroundColor: NAVY } : undefined}
                              >
                                {role}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={() => setEditingUser(null)} className="px-4">
              Cancel
            </Button>
            <Button onClick={saveEdit} className="px-4 text-white" style={{ backgroundColor: NAVY }}>
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="max-w-md">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Confirm Delete</h2>
          <div className="py-2">
            <p className="text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">{userToDelete?.name}</span>? This removes their access
              to every organisation and school. This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={() => setUserToDelete(null)} className="px-4">
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="px-4 text-white" style={{ backgroundColor: NAVY }}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
