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
import { ChevronDown } from "lucide-react"

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

// Sample organisations for dropdown
const availableOrganisations = [
  { id: "org-1", name: "St Clare Catholic Multi Academy Trust" },
  { id: "org-2", name: "Holy Family Catholic Academy Trust" },
  { id: "org-3", name: "All Saints' Catholic High School" },
  { id: "org-4", name: "Notre Dame High School" },
  { id: "org-5", name: "Sacred Heart School" },
]

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

  const handleOrganisationToggle = (reportId: string, orgId: string) => {
    setReports(reports.map(report => {
      if (report.id !== reportId) return report
      const currentOrgs = report.organisations
      const newOrgs = currentOrgs.includes(orgId)
        ? currentOrgs.filter(o => o !== orgId)
        : [...currentOrgs, orgId]
      return { ...report, organisations: newOrgs }
    }))
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
              <div className="flex items-center justify-end mb-6">
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
                    {reports.map((report) => (
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
                                      className="flex items-center justify-between h-9 w-[200px] px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-left hover:bg-slate-100 transition-colors"
                                    >
                                      <span className="truncate text-slate-600">
                                        {report.organisations.length > 0 
                                          ? `${report.organisations.length} selected`
                                          : "Select School..."}
                                      </span>
                                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[280px] p-0" align="start">
                                    <div className="max-h-[250px] overflow-auto">
                                      {availableOrganisations.map((org) => (
                                        <label
                                          key={org.id}
                                          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                                        >
                                          <Checkbox
                                            checked={report.organisations.includes(org.id)}
                                            onCheckedChange={() => handleOrganisationToggle(report.id, org.id)}
                                            className="data-[state=checked]:bg-[#121051] data-[state=checked]:border-[#121051]"
                                          />
                                          <span className="text-sm text-slate-700">{org.name}</span>
                                        </label>
                                      ))}
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
                                      className="flex items-center justify-between h-9 w-[200px] px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-left hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-50"
                                    >
                                      <span className="truncate text-slate-600">
                                        {report.organisations.length === 0 
                                          ? "Select School First"
                                          : report.roles.length > 0 
                                            ? `${report.roles.length} selected`
                                            : "Select Roles..."}
                                      </span>
                                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[280px] p-0" align="start">
                                    <div className="max-h-[300px] overflow-auto">
                                      {report.organisations.map((orgId, index) => {
                                        const org = availableOrganisations.find(o => o.id === orgId)
                                        const orgRoles = rolesByOrganisation[orgId] || []
                                        return (
                                          <div key={orgId}>
                                            {(report.organisations.length > 1) && (
                                              <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 sticky top-0">
                                                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                  {org?.name}
                                                </span>
                                              </div>
                                            )}
                                            {orgRoles.map((role) => (
                                              <label
                                                key={role.id}
                                                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer"
                                              >
                                                <Checkbox
                                                  checked={report.roles.includes(role.id)}
                                                  onCheckedChange={() => handleRoleToggle(report.id, role.id)}
                                                  className="data-[state=checked]:bg-[#121051] data-[state=checked]:border-[#121051]"
                                                />
                                                <span className="text-sm text-slate-700">{role.name}</span>
                                              </label>
                                            ))}
                                            {index < report.organisations.length - 1 && report.organisations.length > 1 && (
                                              <div className="border-b border-slate-200" />
                                            )}
                                          </div>
                                        )
                                      })}
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
                          <Button
                            onClick={() => handleSave(report.id)}
                            size="sm"
                            disabled={!hasChanges(report)}
                            className="text-white px-6 disabled:bg-slate-300 disabled:text-slate-500 disabled:opacity-100"
                            style={{ backgroundColor: hasChanges(report) ? "#121051" : undefined }}
                          >
                            Save
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
    </TooltipProvider>
  )
}
