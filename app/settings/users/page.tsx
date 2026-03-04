"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ChevronDown, Trash2, Pencil, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Sample MATs data
const matsData = [
  { id: "mat-1", name: "St Joseph Catholic Multi Academy Trust", schools: ["school-1", "school-2", "school-3", "school-4"] },
]

// Sample Schools data  
const schoolsListData = [
  { id: "school-1", name: "Holy Spirit Catholic Academy", urn: "149029", matId: "mat-1" },
  { id: "school-2", name: "St Ambrose Catholic Academy", urn: "149133", matId: "mat-1" },
  { id: "school-3", name: "St Nicholas Catholic Academy", urn: "149132", matId: "mat-1" },
  { id: "school-4", name: "Holy Family Catholic Academy", urn: "149190", matId: "mat-1" },
  { id: "school-6", name: "Sacred Heart School", urn: "149210", matId: null }, // Standalone school
]

// Sample schools data
const schoolsData = [
  { urn: "149029", name: "Holy Spirit Catholic Academy" },
  { urn: "149133", name: "St Ambrose Catholic Academy" },
  { urn: "149132", name: "St Nicholas Catholic Academy" },
  { urn: "149190", name: "Holy Family Catholic Academy" },
]

// Available roles with their permissions
const availableRoles = [
  "User",
  "Admin",
  "Finance",
  "Finance Data",
  "CPOMS Data",
  "Preview",
  "User Admin",
]

// Role permissions mapping
const rolePermissions: Record<string, { category: string; permissions: string[] }[]> = {
  "User": [
    { category: "Dashboards", permissions: ["View dashboards"] },
    { category: "Reports", permissions: ["View reports"] },
  ],
  "Admin": [
    { category: "Admin", permissions: ["Allow user management", "Manage Roles", "Manage users", "Manage users schools", "View system settings"] },
    { category: "Dashboards", permissions: ["View dashboards"] },
    { category: "Reports", permissions: ["Report Manager", "View reports"] },
  ],
  "Finance": [
    { category: "Reports", permissions: ["View reports", "Report Manager"] },
    { category: "Uploads", permissions: ["Upload data files"] },
  ],
  "Finance Data": [
    { category: "Reports", permissions: ["View reports"] },
    { category: "Uploads", permissions: ["Upload data files"] },
  ],
  "CPOMS Data": [
    { category: "Reports", permissions: ["View reports"] },
    { category: "Uploads", permissions: ["Upload data files"] },
  ],
  "Preview": [
    { category: "Dashboards", permissions: ["View dashboards"] },
    { category: "Reports", permissions: ["View reports"] },
  ],
  "User Admin": [
    { category: "Admin", permissions: ["Allow user management", "Manage users", "Manage users schools"] },
    { category: "Dashboards", permissions: ["View dashboards"] },
  ],
}

// Sample users data matching the image
const initialUsers: User[] = [
  { 
    id: 1, 
    email: "ed@pixel-fusion.com", 
    lastLoggedIn: null, 
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
    lastLoggedIn: "2024-03-01 14:32", 
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
    lastLoggedIn: "2024-02-28 09:15", 
    name: "sdfsdf werwer", 
    roles: ["Finance", "Finance Data", "Preview", "User Admin"],
    schools: "all"
  },
]

interface User {
  id: number
  email: string
  lastLoggedIn: string | null
  name: string
  roles: string[]
  schools: { urn: string; name: string }[] | "all"
}

export default function UsersPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedType, setSelectedType] = useState<"mat" | "school" | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  
  // Edit/Add user state
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editEmail, setEditEmail] = useState("")
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")
  const [editSelectedSchools, setEditSelectedSchools] = useState<{ urn: string; name: string }[]>([])
  const [editAllSchools, setEditAllSchools] = useState(false)
  const [editSelectedRoles, setEditSelectedRoles] = useState<string[]>([])
  const [schoolsDropdownOpen, setSchoolsDropdownOpen] = useState(false)
  const [rolesDropdownOpen, setRolesDropdownOpen] = useState(false)
  
  const pickerRef = useRef<HTMLDivElement>(null)
  const schoolsDropdownRef = useRef<HTMLDivElement>(null)
  const rolesDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerOpen(false)
      }
      if (schoolsDropdownRef.current && !schoolsDropdownRef.current.contains(event.target as Node)) {
        setSchoolsDropdownOpen(false)
      }
      if (rolesDropdownRef.current && !rolesDropdownRef.current.contains(event.target as Node)) {
        setRolesDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Helper functions for filtering
  const getFilteredMATs = () => {
    return matsData.filter(mat => 
      mat.name.toLowerCase().includes(pickerSearch.toLowerCase())
    )
  }

  const getFilteredSchools = () => {
    return schoolsListData.filter(school => 
      school.name.toLowerCase().includes(pickerSearch.toLowerCase())
    )
  }

  const getParentMAT = (school: typeof schoolsListData[0]) => {
    if (!school.matId) return null
    return matsData.find(mat => mat.id === school.matId)
  }

  const handleSelect = (type: "mat" | "school", id: string) => {
    setSelectedType(type)
    setSelectedId(id)
    setPickerOpen(false)
    setPickerSearch("")
  }

  // Get display name for selected item
  const getSelectedDisplayName = () => {
    if (selectedType === "mat") {
      const mat = matsData.find(m => m.id === selectedId)
      return mat?.name || ""
    } else if (selectedType === "school") {
      const school = schoolsListData.find(s => s.id === selectedId)
      return school?.name || ""
    }
    return ""
  }

  // Add user handler
  const handleAddUser = () => {
    setIsAddMode(true)
    setEditingUser(null)
    setEditFirstName("")
    setEditLastName("")
    setEditEmail("")
    setEditAllSchools(false)
    setEditSelectedSchools([])
    setEditSelectedRoles([])
    setEditUserOpen(true)
  }

  // Edit user handlers
  const handleEditUser = (user: User) => {
    setIsAddMode(false)
    const nameParts = user.name.split(" ")
    setEditingUser(user)
    setEditFirstName(nameParts[0] || "")
    setEditLastName(nameParts.slice(1).join(" ") || "")
    setEditEmail(user.email)
    if (user.schools === "all") {
      setEditAllSchools(true)
      setEditSelectedSchools([])
    } else {
      setEditAllSchools(false)
      setEditSelectedSchools(user.schools)
    }
    setEditSelectedRoles(user.roles)
    setEditUserOpen(true)
  }

  const handleSaveUser = () => {
    if (isAddMode) {
      // Add new user
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        email: editEmail,
        lastLoggedIn: null,
        name: `${editFirstName} ${editLastName}`.trim(),
        schools: editAllSchools ? "all" : editSelectedSchools,
        roles: editSelectedRoles,
      }
      setUsers([...users, newUser])
    } else if (editingUser) {
      // Update existing user
      const updatedUser: User = {
        ...editingUser,
        name: `${editFirstName} ${editLastName}`.trim(),
        schools: editAllSchools ? "all" : editSelectedSchools,
        roles: editSelectedRoles,
      }
      setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u))
    }
    setEditUserOpen(false)
    setEditingUser(null)
    setIsAddMode(false)
  }

  const toggleSchool = (school: { urn: string; name: string }) => {
    const exists = editSelectedSchools.find(s => s.urn === school.urn)
    if (exists) {
      setEditSelectedSchools(editSelectedSchools.filter(s => s.urn !== school.urn))
    } else {
      setEditSelectedSchools([...editSelectedSchools, school])
    }
  }

  const toggleRole = (role: string) => {
    if (editSelectedRoles.includes(role)) {
      setEditSelectedRoles(editSelectedRoles.filter(r => r !== role))
    } else {
      setEditSelectedRoles([...editSelectedRoles, role])
    }
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
              <div className="flex items-center gap-4">
                <div className="relative" ref={pickerRef}>
                  <button
                    onClick={() => setPickerOpen(!pickerOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors min-w-[300px]"
                  >
                    {selectedType ? (
                      <>
                        <span className="text-sm font-medium text-slate-900 flex-1 text-left truncate">
                          {getSelectedDisplayName()}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {selectedType === "mat" ? "MAT" : "School"}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500 flex-1 text-left">
                        Select an organisation...
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {pickerOpen && (
                    <div className="absolute top-full left-0 mt-1 w-[400px] bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-[400px] flex flex-col">
                      {/* Search Input */}
                      <div className="p-2 border-b">
                        <Input
                          placeholder="Search MATs or schools..."
                          value={pickerSearch}
                          onChange={(e) => setPickerSearch(e.target.value)}
                          className="h-9"
                          autoFocus
                        />
                      </div>
                      
                      <div className="overflow-auto flex-1">
                        {/* MATs Section */}
                        {getFilteredMATs().length > 0 && (
                          <>
                            <div className="p-2 border-b">
                              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
                                Multi-Academy Trusts
                              </span>
                            </div>
                            {getFilteredMATs().map((mat) => (
                              <button
                                key={mat.id}
                                onClick={() => handleSelect("mat", mat.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                  selectedType === "mat" && selectedId === mat.id ? "bg-[#B30089]" : "hover:bg-slate-50"
                                }`}
                              >
                                <span className={`text-sm flex-1 text-left truncate ${selectedType === "mat" && selectedId === mat.id ? "text-white font-medium" : "text-slate-900"}`}>
                                  {mat.name}
                                </span>
                                <span className={`text-xs ${selectedType === "mat" && selectedId === mat.id ? "text-white" : "text-slate-500"}`}>
                                  {mat.schools.length} schools
                                </span>
                              </button>
                            ))}
                          </>
                        )}

                        {/* Schools Section */}
                        {getFilteredSchools().length > 0 && (
                          <>
                            <div className="p-2 border-b border-t">
                              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
                                Schools
                              </span>
                            </div>
                            {getFilteredSchools().map((school) => {
                              const parentMAT = getParentMAT(school)
                              return (
                                <button
                                  key={school.id}
                                  onClick={() => handleSelect("school", school.id)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                    selectedType === "school" && selectedId === school.id ? "bg-[#B30089]" : "hover:bg-slate-50"
                                  }`}
                                >
                                  <div className="flex-1 text-left min-w-0">
                                    <span className={`text-sm block truncate ${selectedType === "school" && selectedId === school.id ? "text-white font-medium" : "text-slate-900"}`}>
                                      {school.name}
                                    </span>
                                    {parentMAT && (
                                      <span className={`text-xs truncate block ${selectedType === "school" && selectedId === school.id ? "text-white" : "text-slate-500"}`}>
                                        {parentMAT.name}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </>
                        )}

                        {/* No results */}
                        {getFilteredMATs().length === 0 && getFilteredSchools().length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            No results found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {selectedType && (
                  <button
                    onClick={() => {
                      setSelectedType(null)
                      setSelectedId(null)
                    }}
                    className="text-sm text-[#121051] hover:underline"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Users Card - Only shown when organisation is selected */}
          {selectedType && (
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Users</h3>
                  <Button 
                    onClick={handleAddUser}
                    className="text-white"
                    style={{ backgroundColor: "#121051" }}
                  >
                    Add user
                  </Button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Last logged in</th>
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
                            {user.lastLoggedIn || "Never"}
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-900">{user.name}</td>
                          <td className="py-4 px-4 text-sm text-slate-600">
                            <TooltipProvider delayDuration={300}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button type="button" className="text-left hover:text-[#B30089] transition-colors">
                                    {user.roles.join(", ")}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" align="start" className="max-w-md p-0">
                                  <div className="p-3 max-h-[300px] overflow-auto">
                                    <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Role Permissions</div>
                                    {user.roles.map((role, roleIdx) => {
                                      const perms = rolePermissions[role]
                                      return (
                                        <div key={roleIdx} className={roleIdx > 0 ? "mt-3 pt-3 border-t" : ""}>
                                          <div className="font-medium text-sm text-slate-900 mb-1">{role}</div>
                                          {perms ? (
                                            <div className="space-y-1">
                                              {perms.map((cat, catIdx) => (
                                                <div key={catIdx}>
                                                  <span className="text-xs font-medium text-slate-500">{cat.category}:</span>
                                                  <span className="text-xs text-slate-600 ml-1">{cat.permissions.join(", ")}</span>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-xs text-slate-400">No permissions defined</span>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">
                            {user.schools === "all" ? (
                              <span>All Schools</span>
                            ) : user.schools.length <= 2 ? (
                              <div className="flex flex-col gap-0.5">
                                {user.schools.map((school, idx) => (
                                  <span key={idx}>{school.urn} {school.name}</span>
                                ))}
                              </div>
                            ) : (
                              <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button type="button" className="text-left">
                                      <div className="flex flex-col gap-0.5">
                                        <span>{user.schools[0].urn} {user.schools[0].name}</span>
                                        <span className="text-[#B30089] hover:underline cursor-pointer">
                                          +{user.schools.length - 1} more schools
                                        </span>
                                      </div>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom" align="start" className="max-w-md">
                                    <div className="flex flex-col gap-1 max-h-[200px] overflow-auto">
                                      {user.schools.map((school, idx) => (
                                        <span key={idx} className="text-sm">{school.urn} {school.name}</span>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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
                                        handleEditUser(user)
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

          {/* Edit User Modal */}
          <Dialog open={editUserOpen} onOpenChange={(open) => {
            if (!open) {
              setEditUserOpen(false)
              setSchoolsDropdownOpen(false)
              setRolesDropdownOpen(false)
            }
          }}>
            <DialogContent className="max-w-md !block">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">{isAddMode ? "Add User" : "Update User"}</h2>
              
              {/* First Name */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  First name<span className="text-slate-400">*</span>
                </label>
                <Input
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Last name<span className="text-slate-400">*</span>
                </label>
                <Input
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Email<span className="text-slate-400">*</span>
                </label>
                <Input
                  value={isAddMode ? editEmail : editingUser?.email || ""}
                  onChange={(e) => isAddMode && setEditEmail(e.target.value)}
                  disabled={!isAddMode}
                  className={`h-11 ${!isAddMode ? "bg-slate-100 text-slate-600" : ""}`}
                />
              </div>

              {/* Select Schools */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Select school(s)
                </label>
                <div className="relative" ref={schoolsDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setSchoolsDropdownOpen(!schoolsDropdownOpen)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors text-left h-11"
                  >
                    {editAllSchools ? (
                      <span className="text-sm text-slate-900 flex-1 truncate">All Schools</span>
                    ) : editSelectedSchools.length > 0 ? (
                      <>
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded text-xs font-medium text-white" style={{ backgroundColor: "#121051" }}>
                          {editSelectedSchools.length}
                        </span>
                        <span className="text-sm text-slate-900 flex-1 truncate">
                          {editSelectedSchools.map(s => s.name).join(", ")}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500 flex-1">Select schools...</span>
                    )}
                    {(editAllSchools || editSelectedSchools.length > 0) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditSelectedSchools([])
                          setEditAllSchools(false)
                        }}
                        className="p-0.5 hover:bg-slate-100 rounded"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${schoolsDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {schoolsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-[100] max-h-[200px] overflow-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setEditAllSchools(!editAllSchools)
                          if (!editAllSchools) setEditSelectedSchools([])
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          editAllSchools ? "bg-[#B30089] text-white" : "hover:bg-slate-50 text-slate-900"
                        }`}
                      >
                        All Schools
                      </button>
                      {schoolsData.map(school => {
                        const isSelected = editSelectedSchools.some(s => s.urn === school.urn)
                        return (
                          <button
                            key={school.urn}
                            type="button"
                            onClick={() => {
                              if (editAllSchools) setEditAllSchools(false)
                              toggleSchool(school)
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                              isSelected ? "bg-[#B30089] text-white" : "hover:bg-slate-50 text-slate-900"
                            }`}
                          >
                            {school.name}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Select Roles */}
              <div className="mb-4">
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                  Select role(s)
                </label>
                <div className="relative" ref={rolesDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setRolesDropdownOpen(!rolesDropdownOpen)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors text-left h-11"
                  >
                    {editSelectedRoles.length > 0 ? (
                      <>
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded text-xs font-medium text-white" style={{ backgroundColor: "#121051" }}>
                          {editSelectedRoles.length}
                        </span>
                        <span className="text-sm text-slate-900 flex-1 truncate">
                          {editSelectedRoles.join(", ")}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500 flex-1">Select roles...</span>
                    )}
                    {editSelectedRoles.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditSelectedRoles([])
                        }}
                        className="p-0.5 hover:bg-slate-100 rounded"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${rolesDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {rolesDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-[100] max-h-[200px] overflow-auto">
                      {availableRoles.map(role => {
                        const isSelected = editSelectedRoles.includes(role)
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => toggleRole(role)}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                              isSelected ? "bg-[#B30089] text-white" : "hover:bg-slate-50 text-slate-900"
                            }`}
                          >
                            {role}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleSaveUser}
                  className="px-6 text-white"
                  style={{ backgroundColor: "#121051" }}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
