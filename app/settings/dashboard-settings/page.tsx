"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

// Sample roles for dropdown
const availableRoles = [
  { id: "role-1", name: "Admin" },
  { id: "role-2", name: "Teacher" },
  { id: "role-3", name: "Head Teacher" },
  { id: "role-4", name: "Data Manager" },
  { id: "role-5", name: "Viewer" },
]

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

  const handleOrganisationChange = (id: string, value: string) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, organisations: value ? [value] : [] } : report
    ))
  }

  const handleRoleChange = (id: string, value: string) => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, roles: value ? [value] : [] } : report
    ))
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
                          <Select 
                            value={report.organisations[0] || ""} 
                            onValueChange={(value) => handleOrganisationChange(report.id, value)}
                          >
                            <SelectTrigger className="h-9 w-[200px] bg-slate-50 border-slate-200">
                              <SelectValue placeholder="Select School..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableOrganisations.map((org) => (
                                <SelectItem key={org.id} value={org.id}>
                                  {org.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-4 px-4">
                          <Select 
                            value={report.roles[0] || ""} 
                            onValueChange={(value) => handleRoleChange(report.id, value)}
                            disabled={report.organisations.length === 0}
                          >
                            <SelectTrigger className="h-9 w-[200px] bg-slate-50 border-slate-200">
                              <SelectValue placeholder={report.organisations.length === 0 ? "Select Organisations First" : "Select Roles..."} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableRoles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
  )
}
