"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ChevronDown, Trash2, Pencil } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Sample organisations for dropdown
const organisations = [
  { id: "org-1", name: "St Joseph Catholic Multi Academy Trust" },
  { id: "org-2", name: "Holy Cross Academy Trust" },
  { id: "org-3", name: "Sacred Heart School" },
]

// Sample schools data
const schoolsData = [
  { urn: "149029", name: "Holy Spirit Catholic Academy" },
  { urn: "149133", name: "St Ambrose Catholic Academy" },
  { urn: "149132", name: "St Nicholas Catholic Academy" },
  { urn: "149190", name: "Holy Family Catholic Academy" },
]

// Sample users data matching the image
const initialUsers = [
  { 
    id: 1, 
    email: "ed@pixel-fusion.com", 
    hasLoggedIn: false, 
    name: "fred ed", 
    roles: ["CPOMS Data", "User"],
    schools: [
      { urn: "149029", name: "Holy Spirit Catholic Academy" },
      { urn: "149133", name: "St Ambrose Catholic Academy" },
      { urn: "149132", name: "St Nicholas Catholic Academy" },
    ]
  },
  { 
    id: 2, 
    email: "fred@test.com", 
    hasLoggedIn: false, 
    name: "Fred Smith", 
    roles: ["CPOMS Data", "Finance", "User"],
    schools: [
      { urn: "149190", name: "Holy Family Catholic Academy" },
      { urn: "149029", name: "Holy Spirit Catholic Academy" },
      { urn: "149133", name: "St Ambrose Catholic Academy" },
      { urn: "149132", name: "St Nicholas Catholic Academy" },
    ]
  },
  { 
    id: 3, 
    email: "sdfwesr@test.com", 
    hasLoggedIn: false, 
    name: "sdfsdf werwer", 
    roles: ["Finance", "Finance Data", "Preview", "User Admin"],
    schools: "all"
  },
]

interface User {
  id: number
  email: string
  hasLoggedIn: boolean
  name: string
  roles: string[]
  schools: { urn: string; name: string }[] | "all"
}

export default function UsersPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>(null)
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const orgDropdownRef = useRef<HTMLDivElement>(null)

  const selectedOrg = organisations.find(org => org.id === selectedOrganisation)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setOrgDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClearSelection = () => {
    setSelectedOrganisation(null)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id))
    }
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>

        <main className="flex-1 px-4 pb-6 overflow-auto">
          {/* Organisations Card */}
          <Card className="mb-4">
            <CardContent className="py-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Organisations</h3>
              <div className="flex items-center gap-4">
                <div className="relative" ref={orgDropdownRef}>
                  <button
                    onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                    className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors min-w-[280px] text-left"
                  >
                    <span className={`text-sm truncate ${selectedOrg ? "text-slate-900" : "text-slate-500"}`}>
                      {selectedOrg ? selectedOrg.name : "Select organisation..."}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${orgDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {orgDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-[300px] overflow-auto">
                      {organisations.map(org => (
                        <button
                          key={org.id}
                          onClick={() => {
                            setSelectedOrganisation(org.id)
                            setOrgDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                            selectedOrganisation === org.id 
                              ? "bg-[#B30089] text-white" 
                              : "text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          {org.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedOrganisation && (
                  <button
                    onClick={handleClearSelection}
                    className="text-sm text-[#121051] hover:underline font-medium"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Users Card - Only shown when organisation is selected */}
          {selectedOrganisation && (
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Users</h3>
                  <Button 
                    className="text-white gap-2"
                    style={{ backgroundColor: "#121051" }}
                  >
                    <Plus className="w-4 h-4" />
                    Add user
                  </Button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Email/Login</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Has logged in</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Schools</th>
                        <th className="py-3 px-4 w-[100px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-100 last:border-0">
                          <td className="py-4 px-4 text-sm text-slate-900">{user.email}</td>
                          <td className="py-4 px-4 text-sm text-slate-600">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                              user.hasLoggedIn 
                                ? "bg-green-100 text-green-700" 
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {user.hasLoggedIn ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-900">{user.name}</td>
                          <td className="py-4 px-4 text-sm text-slate-600">
                            {user.roles.join(", ")}
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">
                            {user.schools === "all" ? (
                              <span>All Schools</span>
                            ) : (
                              <div className="flex flex-col gap-0.5">
                                {user.schools.map((school, idx) => (
                                  <span key={idx}>{school.urn} {school.name}</span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-1">
                              <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleDeleteClick(user)
                                      }}
                                      className="p-2 text-slate-400 hover:text-[#121051] hover:bg-slate-50 rounded transition-colors"
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
                                        e.preventDefault()
                                        e.stopPropagation()
                                        // TODO: Implement edit user
                                      }}
                                      className="p-2 text-slate-400 hover:text-[#121051] hover:bg-slate-50 rounded transition-colors"
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Delete User Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={(open) => !open && setDeleteDialogOpen(false)}>
            <DialogContent className="max-w-md">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Confirm Delete</h2>
              <div className="py-4">
                <p className="text-sm text-slate-600">
                  Are you sure you want to delete <span className="font-semibold text-slate-900">{userToDelete?.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="px-4 text-white"
                  style={{ backgroundColor: "#121051" }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
