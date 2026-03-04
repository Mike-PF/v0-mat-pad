"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Sample organisations for dropdown
const availableOrganisations = [
  { id: "org-1", name: "St Clare Catholic Multi Academy Trust", type: "mat" as const, schoolCount: 5 },
  { id: "org-2", name: "All Saints' Catholic High School", type: "school" as const, matName: "St Clare Catholic Multi Academy Trust" },
  { id: "org-3", name: "Emmaus Catholic and CofE Primary School", type: "school" as const, matName: "St Clare Catholic Multi Academy Trust" },
  { id: "org-4", name: "Notre Dame High School", type: "school" as const, matName: "St Clare Catholic Multi Academy Trust" },
  { id: "org-5", name: "Sacred Heart School", type: "school" as const },
]

const matOrganisations = availableOrganisations.filter(org => org.type === "mat")
const schoolOrganisations = availableOrganisations.filter(org => org.type === "school")

const initialRoles: Role[] = [
  { id: 1, name: "User", users: 0 },
  { id: 2, name: "bl Finance", users: 2 },
  { id: 3, name: "Admin", users: 0 },
]

const mockUsers = [
  { id: 1, email: "fred@test.com", name: "Fred Smith" },
  { id: 2, email: "sdfwesr@test.com", name: "sdfsdf werwer" },
  { id: 3, email: "john@test.com", name: "John Doe" },
  { id: 4, email: "jane@test.com", name: "Jane Smith" },
  { id: 5, email: "mike@test.com", name: "Mike Johnson" },
  { id: 6, email: "sarah@test.com", name: "Sarah Williams" },
  { id: 7, email: "david@test.com", name: "David Brown" },
  { id: 8, email: "emma@test.com", name: "Emma Davis" },
  { id: 9, email: "chris@test.com", name: "Chris Wilson" },
  { id: 10, email: "lisa@test.com", name: "Lisa Taylor" },
  { id: 11, email: "mark@test.com", name: "Mark Anderson" },
  { id: 12, email: "amy@test.com", name: "Amy Thomas" },
  ]

const permissionsData = {
  Admin: [
    { id: "admin-1", name: "Allow Mapping Maintenance", enabled: false },
    { id: "admin-2", name: "Allow Term Management", enabled: false },
    { id: "admin-3", name: "Allow user management", enabled: false },
    { id: "admin-4", name: "Form Builder", enabled: false },
    { id: "admin-5", name: "Maintain Schools", enabled: false },
    { id: "admin-6", name: "Manage Roles", enabled: false },
    { id: "admin-7", name: "Manage system connectors", enabled: false },
    { id: "admin-8", name: "Manage users", enabled: false },
    { id: "admin-9", name: "Manage users schools", enabled: false },
    { id: "admin-10", name: "View system settings", enabled: false },
  ],
  Dashboards: [
    { id: "dash-1", name: "View dashboards", enabled: false },
  ],
  "Q+A": [
    { id: "qa-1", name: "Archive Form", enabled: true },
    { id: "qa-2", name: "Start Q+A Form", enabled: true },
    { id: "qa-3", name: "View Questions and Answers area", enabled: true },
  ],
  Reports: [
    { id: "rep-1", name: "Report Manager", enabled: true },
    { id: "rep-2", name: "View reports", enabled: true },
  ],
  Uploads: [
    { id: "upl-1", name: "Upload data files", enabled: true },
  ],
}

interface Role {
  id: number
  name: string
  users: number
}

export default function RolesPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>(null)
  const [orgSearch, setOrgSearch] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Edit mode state
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [editRoleName, setEditRoleName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [permissions, setPermissions] = useState(permissionsData)
  const [userPage, setUserPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(5)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  const selectedOrg = selectedOrganisation 
    ? availableOrganisations.find(o => o.id === selectedOrganisation) 
    : null

  const filteredMATs = matOrganisations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  )
  
  const filteredSchools = schoolOrganisations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  )

  // Get selected users data
  const selectedUsersData = mockUsers.filter(u => selectedUsers.includes(u.id))
  
  // Filter users for search in table
  const filteredUsersInTable = selectedUsersData.filter(u => 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  )
  
  // Pagination
  const totalUserPages = Math.ceil(filteredUsersInTable.length / usersPerPage)
  const paginatedUsers = filteredUsersInTable.slice(
    (userPage - 1) * usersPerPage,
    userPage * usersPerPage
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPickerOpen(false)
        setOrgSearch("")
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setEditRoleName(role.name)
    // Mock: set some selected users for "bl Finance" role
    if (role.name === "bl Finance") {
      setSelectedUsers([1, 2])
    } else {
      setSelectedUsers([])
    }
    setPermissions(permissionsData)
  }

  const handleBack = () => {
    setEditingRole(null)
    setEditRoleName("")
    setSelectedUsers([])
    setUserSearch("")
  }

  const handleAddRole = () => {
    // Create a new blank role for editing
    const newRole: Role = { id: 0, name: "", users: 0 }
    setEditingRole(newRole)
    setEditRoleName("")
    setSelectedUsers([])
    setPermissions(permissionsData)
  }

  const handleSaveRole = () => {
    if (!editingRole) return
    
    if (editingRole.id === 0) {
      // Adding a new role
      const newId = Math.max(...roles.map(r => r.id), 0) + 1
      const newRole: Role = {
        id: newId,
        name: editRoleName,
        users: selectedUsers.length,
      }
      setRoles([...roles, newRole])
    } else {
      // Updating existing role
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, name: editRoleName, users: selectedUsers.length }
          : role
      ))
    }
    
    // Return to list view
    handleBack()
  }

  const handleDeleteClick = (role: Role) => {
    console.log("[v0] handleDeleteClick called with role:", role)
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    console.log("[v0] handleConfirmDelete called, roleToDelete:", roleToDelete)
    if (roleToDelete) {
      console.log("[v0] Deleting role id:", roleToDelete.id)
      setRoles(roles.filter(r => r.id !== roleToDelete.id))
    }
    setDeleteDialogOpen(false)
    setRoleToDelete(null)
  }

  const handleToggleUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(prev => prev.filter(id => id !== userId))
  }

  const handleTogglePermission = (category: string, permissionId: string) => {
    setPermissions(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].map(p => 
        p.id === permissionId ? { ...p, enabled: !p.enabled } : p
      )
    }))
  }

  // Edit View
  if (editingRole) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <TopNavigation />
          </div>

          <main className="flex-1 px-4 pb-6 overflow-auto">
            {/* Header with Role Name and Actions */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <label className="text-sm text-slate-700 block mb-1">Role name*</label>
                <Input
                  value={editRoleName}
                  onChange={(e) => setEditRoleName(e.target.value)}
                  className="w-[200px] h-9"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  Back
                </Button>
                <Button
                  className="text-white"
                  style={{ backgroundColor: "#121051" }}
                  onClick={handleSaveRole}
                >
                  Save
                </Button>
              </div>
            </div>

            {/* Users Card */}
            <Card className="mb-4">
              <CardContent className="py-4">
                <h3 className="text-sm font-semibold text-[#121051] mb-4">Users</h3>
                
                {/* Users Dropdown and Search Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors w-[250px] text-left"
                    >
                      {selectedUsers.length > 0 ? (
                        <>
                          <span className="flex items-center justify-center w-5 h-5 bg-[#121051] text-white text-xs rounded-full flex-shrink-0">
                            {selectedUsers.length}
                          </span>
                          <span className="text-sm text-slate-700 flex-1 truncate">
                            {selectedUsersData.length <= 2 
                              ? selectedUsersData.map(u => u.name).join(", ")
                              : `${selectedUsersData.slice(0, 2).map(u => u.name).join(", ")}...`
                            }
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-slate-500 flex-1">Select users...</span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-[350px] bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-[300px] overflow-auto">
                        {mockUsers.map(user => {
                          const isSelected = selectedUsers.includes(user.id)
                          return (
                            <button
                              key={user.id}
                              onClick={() => handleToggleUser(user.id)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                                isSelected 
                                  ? "bg-[#B30089]" 
                                  : "hover:bg-slate-100"
                              }`}
                            >
                              <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-slate-900"}`}>
                                {user.name}
                              </span>
                              <span className={`text-xs ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                                ({user.email})
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <Input
                    placeholder="Search..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value)
                      setUserPage(1)
                    }}
                    className="w-[200px] h-9 bg-white border-slate-200"
                  />
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 w-[45%]">Email/Login</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Name</th>
                        <th className="py-3 px-4 w-[100px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map(user => (
                        <tr key={user.id} className="border-b border-slate-200 last:border-0">
                          <td className="py-3 px-4 text-sm text-slate-900">{user.email}</td>
                          <td className="py-3 px-4 text-sm text-slate-900">{user.name}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end">
                              <button 
                                onClick={() => handleRemoveUser(user.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {paginatedUsers.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-sm text-slate-500">
                            No users assigned to this role
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalUserPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <span className="text-sm text-slate-600">
                      Showing {((userPage - 1) * usersPerPage) + 1} to {Math.min(userPage * usersPerPage, filteredUsersInTable.length)} of {filteredUsersInTable.length} results
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserPage(p => Math.max(1, p - 1))}
                        disabled={userPage === 1}
                        className="h-8 px-3 text-sm font-normal hover:bg-slate-100 hover:text-slate-900"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center">
                        {/* First page */}
                        <button
                          onClick={() => setUserPage(1)}
                          className={`h-8 w-8 text-sm flex items-center justify-center rounded ${
                            userPage === 1 
                              ? "bg-[#121051] text-white" 
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          1
                        </button>
                        
                        {/* Left ellipsis */}
                        {userPage > 3 && (
                          <span className="h-8 w-8 text-sm flex items-center justify-center text-slate-400">...</span>
                        )}
                        
                        {/* Middle pages */}
                        {Array.from({ length: totalUserPages }, (_, i) => i + 1)
                          .filter(page => {
                            if (page === 1 || page === totalUserPages) return false
                            if (totalUserPages <= 7) return true
                            return page >= userPage - 1 && page <= userPage + 1
                          })
                          .map(page => (
                            <button
                              key={page}
                              onClick={() => setUserPage(page)}
                              className={`h-8 w-8 text-sm flex items-center justify-center rounded ${
                                userPage === page 
                                  ? "bg-[#121051] text-white" 
                                  : "text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        
                        {/* Right ellipsis */}
                        {userPage < totalUserPages - 2 && totalUserPages > 5 && (
                          <span className="h-8 w-8 text-sm flex items-center justify-center text-slate-400">...</span>
                        )}
                        
                        {/* Last page */}
                        {totalUserPages > 1 && (
                          <button
                            onClick={() => setUserPage(totalUserPages)}
                            className={`h-8 w-8 text-sm flex items-center justify-center rounded ${
                              userPage === totalUserPages 
                                ? "bg-[#121051] text-white" 
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {totalUserPages}
                          </button>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                        disabled={userPage === totalUserPages}
                        className="h-8 px-3 text-sm font-normal hover:bg-slate-100 hover:text-slate-900"
                      >
                        Next
                      </Button>
                      <select
                        value={usersPerPage}
                        onChange={(e) => {
                          setUsersPerPage(Number(e.target.value))
                          setUserPage(1)
                        }}
                        className="h-8 px-2 pr-8 ml-2 border border-slate-200 rounded-md text-sm text-slate-600 bg-white appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Permissions Card */}
            <Card>
              <CardContent className="py-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Permissions</h3>
                
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(permissions).map(([category, perms]) => (
                    <div key={category} className="border border-slate-200 rounded-lg p-4">
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-slate-900">{category}</h4>
                      </div>

                      {/* Permissions List */}
                      <div className="space-y-3">
                        {perms.map(permission => (
                          <div key={permission.id} className="flex items-center justify-between gap-2">
                            <span className="text-sm text-slate-700 flex-1">{permission.name}</span>
                            <Switch
                              checked={permission.enabled}
                              onCheckedChange={() => handleTogglePermission(category, permission.id)}
                              className="data-[state=checked]:bg-[#22c55e]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  // List View
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <main className="flex-1 px-4 pb-6 overflow-auto">
          {/* Organisation Selector Card */}
          <Card className="mb-4">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setPickerOpen(!pickerOpen)
                      setOrgSearch("")
                    }}
                    className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors min-w-[300px]"
                  >
                    {selectedOrg ? (
                      <>
                        <span className="text-sm font-medium text-slate-900 flex-1 text-left truncate">
                          {selectedOrg.name}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {selectedOrg.type === "mat" ? "MAT" : "School"}
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
                          value={orgSearch}
                          onChange={(e) => setOrgSearch(e.target.value)}
                          className="h-9"
                          autoFocus
                        />
                      </div>
                      
                      <div className="overflow-auto flex-1">
                        {/* MATs Section */}
                        {filteredMATs.length > 0 && (
                          <>
                            <div className="p-2 border-b">
                              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
                                Multi-Academy Trusts
                              </span>
                            </div>
                            {filteredMATs.map((mat) => (
                              <button
                                key={mat.id}
                                onClick={() => {
                                  setSelectedOrganisation(mat.id)
                                  setPickerOpen(false)
                                  setOrgSearch("")
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                  selectedOrganisation === mat.id ? "bg-[#B30089]" : "hover:bg-slate-50"
                                }`}
                              >
                                <span className={`text-sm flex-1 text-left truncate ${selectedOrganisation === mat.id ? "text-white font-medium" : "text-slate-900"}`}>
                                  {mat.name}
                                </span>
                                <span className={`text-xs ${selectedOrganisation === mat.id ? "text-white" : "text-slate-500"}`}>
                                  {mat.schoolCount} schools
                                </span>
                              </button>
                            ))}
                          </>
                        )}

                        {/* Schools Section */}
                        {filteredSchools.length > 0 && (
                          <>
                            <div className="p-2 border-b border-t">
                              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
                                Schools
                              </span>
                            </div>
                            {filteredSchools.map((school) => (
                              <button
                                key={school.id}
                                onClick={() => {
                                  setSelectedOrganisation(school.id)
                                  setPickerOpen(false)
                                  setOrgSearch("")
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                  selectedOrganisation === school.id ? "bg-[#B30089]" : "hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex-1 text-left min-w-0">
                                  <span className={`text-sm block truncate ${selectedOrganisation === school.id ? "text-white font-medium" : "text-slate-900"}`}>
                                    {school.name}
                                  </span>
                                  {school.matName && (
                                    <span className={`text-xs truncate block ${selectedOrganisation === school.id ? "text-white" : "text-slate-500"}`}>
                                      {school.matName}
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </>
                        )}

                        {/* No results */}
                        {filteredMATs.length === 0 && filteredSchools.length === 0 && (
                          <div className="p-4 text-center text-sm text-slate-500">
                            No results found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {selectedOrganisation && (
                  <button
                    onClick={() => setSelectedOrganisation(null)}
                    className="text-sm text-[#121051] hover:underline"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Roles Table Card - Only show when organisation is selected */}
          {selectedOrganisation && (
            <Card>
              <CardContent className="py-6">
                {/* Header with Add Role button */}
                <div className="flex items-center justify-end mb-6">
                  <Button 
                    className="text-white"
                    style={{ backgroundColor: "#121051" }}
                    onClick={handleAddRole}
                  >
                    Add role
                  </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 w-[40%]">Role name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Users</th>
                        <th className="py-3 px-4 w-[100px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role.id} className="border-b border-slate-200 last:border-0">
                          <td className="py-4 px-4 text-sm text-slate-900">{role.name}</td>
                          <td className="py-4 px-4 text-sm text-slate-600">{role.users}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleDeleteClick(role)
                                      }}
                                      className="p-2 text-slate-400 hover:text-[#121051] hover:bg-slate-50 rounded transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete role</p>
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
                                        handleEditRole(role)
                                      }}
                                      className="p-2 text-slate-400 hover:text-[#121051] hover:bg-slate-50 rounded transition-colors"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit role</p>
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

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-slate-900">Delete Role</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Are you sure you want to delete the role "{roleToDelete?.name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
