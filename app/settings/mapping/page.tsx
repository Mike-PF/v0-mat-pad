"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ArrowRight, Trash2 } from "lucide-react"

const mockMappings = [
  { id: 1, source: "SIS.student_id", destination: "Forms.pupil_reference", type: "Direct" },
  { id: 2, source: "SIS.first_name", destination: "Forms.first_name", type: "Direct" },
  { id: 3, source: "SIS.last_name", destination: "Forms.surname", type: "Direct" },
  { id: 4, source: "SIS.class_code", destination: "Forms.year_group", type: "Transform" },
]

export default function MappingPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Mapping</CardTitle>
                  <CardDescription>Configure field mappings between external systems and forms</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Mapping
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Source System</label>
                  <Select defaultValue="sis">
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sis">Student Information System</SelectItem>
                      <SelectItem value="hr">HR Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Destination</label>
                  <Select defaultValue="forms">
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forms">Forms System</SelectItem>
                      <SelectItem value="reports">Reports System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Source Field</th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-slate-600"></th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Destination Field</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Type</th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMappings.map((mapping) => (
                      <tr key={mapping.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <code className="px-2 py-1 bg-slate-100 rounded text-sm">{mapping.source}</code>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <ArrowRight className="h-4 w-4 text-slate-400 mx-auto" />
                        </td>
                        <td className="px-4 py-3">
                          <code className="px-2 py-1 bg-slate-100 rounded text-sm">{mapping.destination}</code>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              mapping.type === "Direct"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {mapping.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
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
  )
}
