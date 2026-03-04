"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Copy, ExternalLink, ChevronDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

// Sample organisations for dropdown
const availableOrganisations = [
  { id: "org-1", name: "St Clare Catholic Multi Academy Trust", type: "mat" as const },
  { id: "org-2", name: "All Saints' Catholic High School", type: "school" as const },
  { id: "org-3", name: "Emmaus Catholic and CofE Primary School", type: "school" as const },
  { id: "org-4", name: "Notre Dame High School", type: "school" as const },
  { id: "org-5", name: "Sacred Heart School", type: "school" as const },
]

const mockRoles = [
  { id: 1, name: "User", users: 0 },
  { id: 2, name: "bl Finance", users: 0 },
  { id: 3, name: "Admin", users: 0 },
]

export default function RolesPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>("org-1")
  const [orgSearch, setOrgSearch] = useState("")

  const selectedOrgName = selectedOrganisation 
    ? availableOrganisations.find(o => o.id === selectedOrganisation)?.name 
    : null

  const filteredOrganisations = availableOrganisations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  )

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
                <span className="text-sm font-medium text-slate-900">Organisation</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button 
                      className="flex items-center gap-2 h-9 w-[200px] px-3 bg-white border border-slate-200 rounded-md text-sm text-left hover:border-[#121051] transition-colors"
                    >
                      <span className="flex-1 truncate text-slate-700">
                        {selectedOrgName || "Select Organisation..."}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[350px] p-0 shadow-lg" align="start">
                    <div className="p-2 border-b">
                      <Input
                        placeholder="Search..."
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-[300px] overflow-auto">
                      {filteredOrganisations.map((org) => (
                        <div
                          key={org.id}
                          onClick={() => {
                            setSelectedOrganisation(org.id)
                            setOrgSearch("")
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                            selectedOrganisation === org.id ? "bg-slate-50" : ""
                          }`}
                        >
                          <span className={`text-sm ${selectedOrganisation === org.id ? "text-[#121051] font-medium" : "text-slate-900"}`}>
                            {org.name}
                          </span>
                        </div>
                      ))}
                      {filteredOrganisations.length === 0 && (
                        <div className="p-3 text-sm text-slate-500 text-center">No results found</div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
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

          {/* Roles Table Card */}
          <Card>
            <CardContent className="py-6">
              {/* Header with Add Role button */}
              <div className="flex items-center justify-end mb-6">
                <Button 
                  className="text-white gap-2"
                  style={{ backgroundColor: "#121051" }}
                >
                  <Plus className="w-4 h-4" />
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
                    {mockRoles.map((role) => (
                      <tr key={role.id} className="border-b border-slate-200 last:border-0">
                        <td className="py-4 px-4 text-sm text-slate-900">{role.name}</td>
                        <td className="py-4 px-4 text-sm text-slate-600">{role.users}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-[#121051] hover:bg-slate-50 rounded transition-colors">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-[#121051] hover:bg-slate-50 rounded transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
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
