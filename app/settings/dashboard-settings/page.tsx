"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react"

// Sample Power BI reports data
const initialReports = [
  { id: "1", powerBiName: "2", displayName: "2222", organisations: [] as string[], roles: [] as string[], active: true },
  { id: "2", powerBiName: "attendance_PBI_test", displayName: "attendance_PBI_test...!", organisations: [] as string[], roles: [] as string[], active: true },
  { id: "3", powerBiName: "attendance_PBI_test1", displayName: "attendance_PBI_test11", organisations: [] as string[], roles: [] as string[], active: true },
  { id: "4", powerBiName: "Dans Test Report", displayName: "Dans Test Report", organisations: [] as string[], roles: [] as string[], active: true },
  { id: "5", powerBiName: "Dashboard Test", displayName: "Dashboard Test", organisations: [] as string[], roles: [] as string[], active: true },
  { id: "6", powerBiName: "DataModel", displayName: "DataModel", organisations: [] as string[], roles: [] as string[], active: false },
  { id: "7", powerBiName: "Josh Test", displayName: "Josh Test", organisations: [] as string[], roles: [] as string[], active: true },
  { id: "8", powerBiName: "3", displayName: "Kates Dashboard", organisations: [] as string[], roles: [] as string[], active: true },
  { id: "9", powerBiName: "test", displayName: "test", organisations: [] as string[], roles: [] as string[], active: false },
]

type Report = typeof initialReports[number]

// Sample organisations for dropdown - with type to distinguish MAT vs School
const availableOrganisations = [
  { id: "org-1", name: "St Clare Catholic Multi Academy Trust", type: "mat" as const, schoolCount: 5 },
  { id: "org-2", name: "All Saints' Catholic High School", type: "school" as const },
  { id: "org-3", name: "Emmaus Catholic and CofE Primary School", type: "school" as const },
  { id: "org-4", name: "Notre Dame High School", type: "school" as const },
  { id: "org-5", name: "Sacred Heart School", type: "school" as const },
  { id: "org-6", name: "St Alban's Catholic Primary School", type: "school" as const },
]

const matOrganisations = availableOrganisations.filter(org => org.type === "mat")
const schoolOrganisations = availableOrganisations.filter(org => org.type === "school")

// Sample roles per organisation
const rolesByOrganisation: Record<string, { id: string; name: string }[]> = {
  "org-1": [
    { id: "role-1-1", name: "Admin" },
    { id: "role-1-2", name: "Trust Leader" },
    { id: "role-1-3", name: "Data Manager" },
  ],
  "org-2": [
    { id: "role-2-1", name: "Admin" },
    { id: "role-2-2", name: "Trust Leader" },
    { id: "role-2-3", name: "Viewer" },
  ],
  "org-3": [
    { id: "role-3-1", name: "Head Teacher" },
    { id: "role-3-2", name: "Teacher" },
    { id: "role-3-3", name: "Data Manager" },
  ],
  "org-4": [
    { id: "role-4-1", name: "Head Teacher" },
    { id: "role-4-2", name: "Teacher" },
    { id: "role-4-3", name: "Admin" },
  ],
  "org-5": [
    { id: "role-5-1", name: "Head Teacher" },
    { id: "role-5-2", name: "Teacher" },
    { id: "role-5-3", name: "Viewer" },
  ],
}

export default function DashboardSettingsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [reports, setReports] = useState(initialReports)
  const [originalReports, setOriginalReports] = useState(initialReports)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [schoolSearch, setSchoolSearch] = useState<Record<string, string>>({})
  const [roleSearch, setRoleSearch] = useState<Record<string, string>>({})
  const itemsPerPage = 10

  const filteredReports = reports.filter(report => 
    report.powerBiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const hasChanges = (report: Report) => {
    const original = originalReports.find(r => r.id === report.id)
    if (!original) return false
    return (
      report.displayName !== original.displayName ||
      report.active !== original.active ||
      JSON.stringify(report.organisations) !== JSON.stringify(original.organisations) ||
      JSON.stringify(report.roles) !== JSON.stringify(original.roles)
    )
  }

  const handleDisplayNameChange = (id: string, value: string) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, displayName: value } : report
    ))
  }

  const handleMATSelect = (reportId: string, orgId: string) => {
    // MAT is exclusive - selecting MAT clears all schools
    setReports(reports.map(report => {
      if (report.id !== reportId) return report
      const currentOrgs = report.organisations
      const currentMATSelected = currentOrgs.find(id => matOrganisations.some(m => m.id === id))
      // If clicking the same MAT, deselect it; otherwise select only the MAT (clear schools)
      const newOrgs = currentMATSelected === orgId 
        ? [] 
        : [orgId]
      return { ...report, organisations: newOrgs }
    }))
  }

  const handleSchoolToggle = (reportId: string, orgId: string) => {
    // Multi select for schools - only allowed if no MAT is selected
    setReports(reports.map(report => {
      if (report.id !== reportId) return report
      const currentOrgs = report.organisations
      // Check if a MAT is selected
      const hasMATSelected = currentOrgs.some(id => matOrganisations.some(m => m.id === id))
      if (hasMATSelected) return report // Don't allow school selection if MAT is selected
      
      const newOrgs = currentOrgs.includes(orgId)
        ? currentOrgs.filter(o => o !== orgId)
        : [...currentOrgs, orgId]
      return { ...report, organisations: newOrgs }
    }))
  }
  
  const hasMATSelected = (report: Report) => {
    return report.organisations.some(id => matOrganisations.some(m => m.id === id))
  }

  const handleRoleToggle = (reportId: string, roleId: string) => {
    setReports(reports.map(report => {
      if (report.id !== reportId) return report
      const currentRoles = report.roles
      const newRoles = currentRoles.includes(roleId)
        ? currentRoles.filter(r => r !== roleId)
        : [...currentRoles, roleId]
      return { ...report, roles: newRoles }
    }))
  }

  const getSelectedSchoolNames = (orgIds: string[]) => {
    return orgIds
      .map(id => availableOrganisations.find(o => o.id === id)?.name)
      .filter(Boolean)
      .join("\n")
  }

  const getSelectedRoleNames = (report: Report) => {
    const lines: string[] = []
    report.organisations.forEach(orgId => {
      const org = availableOrganisations.find(o => o.id === orgId)
      const orgRoles = rolesByOrganisation[orgId] || []
      const selectedOrgRoles = orgRoles.filter(r => report.roles.includes(r.id))
      if (selectedOrgRoles.length > 0) {
        if (report.organisations.length > 1) {
          lines.push(`${org?.name}:`)
          selectedOrgRoles.forEach(r => lines.push(`  - ${r.name}`))
        } else {
          selectedOrgRoles.forEach(r => lines.push(`- ${r.name}`))
        }
      }
    })
    return lines.join("\n")
  }

  const handleActiveChange = (id: string, value: boolean) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, active: value } : report
    ))
  }

  const handleSave = (id: string) => {
    // In a real app, this would save to the backend
    const report = reports.find(r => r.id === id)
    console.log("Saving report:", report)
    // Update original to match current (mark as saved)
    setOriginalReports(originalReports.map(r => 
      r.id === id ? { ...reports.find(rep => rep.id === id)! } : r
    ))
  }

  const handleIngest = () => {
    // In a real app, this would trigger an ingest process
    console.log("Ingesting reports...")
  }

  return (
    <TooltipProvider delayDuration={300}>
    <div className="flex h-screen bg-slate-100">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-slate-100 p-4 pb-0">
          <TopNavigation />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-9 h-9 bg-slate-50 border-slate-200"
                  />
                </div>
                <Button 
                  onClick={handleIngest}
                  className="text-white"
                  style={{ backgroundColor: "#121051" }}
                >
                  Pull Reports
                </Button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Power BI Report Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Dashboard Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">School</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Roles</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Active</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReports.map((report) => (
                      <tr key={report.id} className="border-b border-slate-100">
                        <td className="py-4 px-4">
                          <span className="text-sm text-[#121051] font-medium">{report.powerBiName}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Input
                            value={report.displayName}
                            onChange={(e) => handleDisplayNameChange(report.id, e.target.value)}
                            className="h-9 max-w-[200px] bg-slate-50 border-slate-200"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button 
                                      className="flex items-center gap-2 h-9 w-[200px] px-3 bg-white border border-slate-200 rounded-md text-sm text-left hover:border-[#121051] transition-colors"
                                    >
                                      <span className="flex-1 truncate text-slate-700">
                                        {report.organisations.length > 0 
                                          ? `${report.organisations.length} selected`
                                          : "Select School..."}
                                      </span>
                                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[350px] p-0 shadow-lg" align="start">
                                    <div className="p-2 border-b">
                                      <Input
                                        placeholder="Search..."
                                        value={schoolSearch[report.id] || ""}
                                        onChange={(e) => setSchoolSearch(prev => ({ ...prev, [report.id]: e.target.value }))}
                                        className="h-8"
                                        autoFocus
                                      />
                                    </div>
                                    <div className="max-h-[300px] overflow-auto">
                                      {/* MAT Section - Single Select */}
                                      {matOrganisations.filter(org => org.name.toLowerCase().includes((schoolSearch[report.id] || "").toLowerCase())).length > 0 && (
                                        <>
                                          <div className="px-3 py-2 border-b border-slate-200">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Multi-Academy Trusts</span>
                                          </div>
                                          {matOrganisations
                                            .filter(org => org.name.toLowerCase().includes((schoolSearch[report.id] || "").toLowerCase()))
                                            .map((org) => (
                                            <div
                                              key={org.id}
                                              onClick={() => handleMATSelect(report.id, org.id)}
                                              className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                                                report.organisations.includes(org.id) ? "bg-slate-50" : ""
                                              }`}
                                            >
                                              <span className={`text-sm ${report.organisations.includes(org.id) ? "text-[#121051] font-medium" : "text-slate-900"}`}>
                                                {org.name}
                                              </span>
                                              <span className="text-sm text-slate-400">
                                                {org.schoolCount} {org.schoolCount === 1 ? "school" : "schools"}
                                              </span>
                                            </div>
                                          ))}
                                        </>
                                      )}
                                      {/* Schools Section - Multi Select (disabled if MAT is selected) */}
                                      {schoolOrganisations.filter(org => org.name.toLowerCase().includes((schoolSearch[report.id] || "").toLowerCase())).length > 0 && (
                                        <>
                                          <div className="px-3 py-2 border-b border-slate-200">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Schools</span>
                                          </div>
                                          {schoolOrganisations
                                            .filter(org => org.name.toLowerCase().includes((schoolSearch[report.id] || "").toLowerCase()))
                                            .map((org) => (
                                            <label
                                              key={org.id}
                                              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${
                                                hasMATSelected(report) 
                                                  ? "opacity-50 cursor-not-allowed" 
                                                  : "hover:bg-slate-50 cursor-pointer"
                                              }`}
                                            >
                                              <Checkbox
                                                checked={report.organisations.includes(org.id)}
                                                onCheckedChange={() => handleSchoolToggle(report.id, org.id)}
                                                disabled={hasMATSelected(report)}
                                                className="data-[state=checked]:bg-[#121051] data-[state=checked]:border-[#121051]"
                                              />
                                              <span className="text-sm text-slate-900">{org.name}</span>
                                            </label>
                                          ))}
                                        </>
                                      )}
                                      {availableOrganisations.filter(org => org.name.toLowerCase().includes((schoolSearch[report.id] || "").toLowerCase())).length === 0 && (
                                        <div className="p-3 text-sm text-slate-500 text-center">No results found</div>
                                      )}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </TooltipTrigger>
                            {report.organisations.length > 0 && (
                              <TooltipContent side="top" className="max-w-[300px]">
                                <ul className="space-y-1">
                                  {report.organisations.map(orgId => {
                                    const org = availableOrganisations.find(o => o.id === orgId)
                                    return (
                                      <li key={orgId} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                        {org?.name}
                                      </li>
                                    )
                                  })}
                                </ul>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </td>
                        <td className="py-4 px-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button 
                                      disabled={report.organisations.length === 0}
                                      className="flex items-center gap-2 h-9 w-[200px] px-3 bg-white border border-slate-200 rounded-md text-sm text-left hover:border-[#121051] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200"
                                    >
                                      <span className="flex-1 truncate text-slate-700">
                                        {report.organisations.length === 0 
                                          ? "Select School First"
                                          : report.roles.length > 0 
                                            ? `${report.roles.length} selected`
                                            : "Select Roles..."}
                                      </span>
                                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[350px] p-0 shadow-lg" align="start">
                                    <div className="p-2 border-b">
                                      <Input
                                        placeholder="Search..."
                                        value={roleSearch[report.id] || ""}
                                        onChange={(e) => setRoleSearch(prev => ({ ...prev, [report.id]: e.target.value }))}
                                        className="h-8"
                                        autoFocus
                                      />
                                    </div>
                                    <div className="max-h-[300px] overflow-auto">
                                      {report.organisations.map((orgId, index) => {
                                        const org = availableOrganisations.find(o => o.id === orgId)
                                        const orgRoles = (rolesByOrganisation[orgId] || []).filter(role => 
                                          role.name.toLowerCase().includes((roleSearch[report.id] || "").toLowerCase())
                                        )
                                        if (orgRoles.length === 0) return null
                                        return (
                                          <div key={orgId}>
                                            {(report.organisations.length > 1) && (
                                              <div className="px-3 py-2 border-b border-slate-200">
                                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                  {org?.name}
                                                </span>
                                              </div>
                                            )}
                                            {orgRoles.map((role) => (
                                              <label
                                                key={role.id}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                                              >
                                                <Checkbox
                                                  checked={report.roles.includes(role.id)}
                                                  onCheckedChange={() => handleRoleToggle(report.id, role.id)}
                                                  className="data-[state=checked]:bg-[#121051] data-[state=checked]:border-[#121051]"
                                                />
                                                <span className="text-sm text-slate-900">{role.name}</span>
                                              </label>
                                            ))}
                                            {index < report.organisations.length - 1 && report.organisations.length > 1 && (
                                              <div className="border-b border-slate-200" />
                                            )}
                                          </div>
                                        )
                                      })}
                                      {report.organisations.every(orgId => 
                                        (rolesByOrganisation[orgId] || []).filter(role => 
                                          role.name.toLowerCase().includes((roleSearch[report.id] || "").toLowerCase())
                                        ).length === 0
                                      ) && (
                                        <div className="px-3 py-2 text-sm text-slate-500">No roles found</div>
                                      )}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </TooltipTrigger>
                            {report.roles.length > 0 && (
                              <TooltipContent side="top" className="max-w-[350px]">
                                <div className="space-y-2">
                                  {report.organisations.map(orgId => {
                                    const org = availableOrganisations.find(o => o.id === orgId)
                                    const orgRoles = rolesByOrganisation[orgId] || []
                                    const selectedOrgRoles = orgRoles.filter(r => report.roles.includes(r.id))
                                    if (selectedOrgRoles.length === 0) return null
                                    return (
                                      <div key={orgId}>
                                        {report.organisations.length > 1 && (
                                          <div className="text-xs font-semibold text-slate-300 mb-1">{org?.name}</div>
                                        )}
                                        <ul className="space-y-0.5">
                                          {selectedOrgRoles.map(role => (
                                            <li key={role.id} className="flex items-center gap-2 text-sm">
                                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                              {role.name}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )
                                  })}
                                </div>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">{report.active ? "Yes" : "No"}</span>
                            <Switch
                              checked={report.active}
                              onCheckedChange={(value) => handleActiveChange(report.id, value)}
                              className="data-[state=checked]:bg-[#121051]"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleSave(report.id)}
                              size="sm"
                              disabled={!hasChanges(report)}
                              className="text-white px-6 disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-100"
                              style={{ backgroundColor: hasChanges(report) ? "#121051" : undefined }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-slate-200 text-slate-600 hover:bg-[#121051] hover:text-white hover:border-[#121051] transition-colors"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                  <span className="text-sm text-slate-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredReports.length)} of {filteredReports.length} results
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-8 px-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 w-8 ${page === currentPage ? "text-white" : ""}`}
                        style={page === currentPage ? { backgroundColor: "#121051" } : undefined}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 px-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
    </TooltipProvider>
  )
}
