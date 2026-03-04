"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Copy, ExternalLink, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"

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

const mockRoles = [
  { id: 1, name: "User", users: 0 },
  { id: 2, name: "bl Finance", users: 0 },
  { id: 3, name: "Admin", users: 0 },
]

export default function RolesPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>("org-1")
  const [orgSearch, setOrgSearch] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOrg = selectedOrganisation 
    ? availableOrganisations.find(o => o.id === selectedOrganisation) 
    : null

  const filteredMATs = matOrganisations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  )
  
  const filteredSchools = schoolOrganisations.filter(org =>
    org.name.toLowerCase().includes(orgSearch.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPickerOpen(false)
        setOrgSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
