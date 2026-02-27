"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ArrowRight } from "lucide-react"

const dataMappings = [
  { id: 1, source: "Student Name", destination: "pupil_name", type: "Text", status: "Active" },
  { id: 2, source: "Date of Birth", destination: "dob", type: "Date", status: "Active" },
  { id: 3, source: "UPN", destination: "unique_pupil_number", type: "Text", status: "Active" },
  { id: 4, source: "School URN", destination: "school_urn", type: "Number", status: "Active" },
  { id: 5, source: "Year Group", destination: "year_group", type: "Text", status: "Active" },
  { id: 6, source: "SEN Status", destination: "sen_status", type: "Text", status: "Active" },
  { id: 7, source: "EHCP Status", destination: "ehcp_status", type: "Text", status: "Active" },
  { id: 8, source: "Primary Need", destination: "primary_need", type: "Text", status: "Active" },
  { id: 9, source: "Funding Band", destination: "funding_band", type: "Text", status: "Inactive" },
  { id: 10, source: "Review Date", destination: "review_date", type: "Date", status: "Active" },
]

export default function MappingPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedSource, setSelectedSource] = useState("All Sources")

  const sources = ["All Sources", "MIS Import", "Census Data", "Manual Entry"]

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-auto space-y-6">
              {/* Filters Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Data Mapping Configuration</CardTitle>
                    <Button className="bg-[#121051] hover:bg-[#0f0d42] text-white" style={{ backgroundColor: "#121051" }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Mapping
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <select
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        className="w-48 p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {sources.map((source) => (
                          <option key={source} value={source}>
                            {source}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    <span className="text-slate-500">{dataMappings.length} mappings configured</span>
                  </div>
                </CardContent>
              </Card>

              {/* Mappings Table */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle className="text-lg">Field Mappings</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">Source Field</th>
                          <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200"></th>
                          <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">Destination Field</th>
                          <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">Type</th>
                          <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">Status</th>
                          <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataMappings.map((mapping) => (
                          <tr key={mapping.id} className="hover:bg-slate-50 border-b border-slate-100">
                            <td className="p-3 text-slate-900 font-medium">{mapping.source}</td>
                            <td className="p-3 text-slate-400">
                              <ArrowRight className="w-4 h-4" />
                            </td>
                            <td className="p-3 text-slate-700 font-mono text-sm">{mapping.destination}</td>
                            <td className="p-3 text-slate-600">{mapping.type}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  mapping.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {mapping.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
