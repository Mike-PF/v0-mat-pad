"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown } from "lucide-react"

const schoolsData = [
  { urn: "138337", name: "All Saints' Catholic High School" },
  { urn: "140826", name: "Emmaus Catholic and CofE Primary School" },
  { urn: "138361", name: "Notre Dame High School" },
  { urn: "140439", name: "Sacred Heart School, A Catholic Voluntary Academy" },
  { urn: "138828", name: "St Thomas of Canterbury School, a Catholic Voluntary Academy" },
  { urn: "138830", name: "St Wilfrid's Catholic Primary School" },
  { urn: "138848", name: "St Marie's School, A Catholic Voluntary Academy" },
  { urn: "140025", name: "St John Fisher Primary, A Catholic Voluntary Academy" },
  { urn: "140440", name: "St Mary's Primary School, A Catholic Voluntary Academy" },
  { urn: "140441", name: "St Ann's Catholic Primary School, A Voluntary Academy" },
  { urn: "140588", name: "St Catherine's Catholic Primary School (Hallam)" },
  { urn: "148974", name: "St Alban's Catholic Primary and Nursery School" },
  { urn: "144606", name: "Holy Trinity Catholic and Church of England School" },
]

export function SettingsContent() {
  const [selectedOrganisation, setSelectedOrganisation] = useState("St Clare Catholic Multi Academy Trust")

  const organisations = [
    "St Clare Catholic Multi Academy Trust",
    "Holy Family Catholic Academy Trust",
    "Sacred Heart Multi Academy Trust",
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Settings Content */}
      <div className="flex-1 overflow-auto space-y-6">
        {/* Organisations Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Organisations</CardTitle>
              <Button className="bg-[#121051] hover:bg-[#0f0d42] text-white" style={{ backgroundColor: "#121051" }}>
                <Plus className="w-4 h-4 mr-2" />
                Add organisation
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {/* Organisation Dropdown */}
              <div className="relative max-w-64">
                <select
                  value={selectedOrganisation}
                  onChange={(e) => setSelectedOrganisation(e.target.value)}
                  className="w-60 p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {organisations.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* Organisation Details */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="text-slate-500">Created at</span>
                  <span className="ml-1 text-slate-900">2023-12-15</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500">Expires at</span>
                  <span className="ml-1 text-slate-900">2100-01-01</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schools Section - Expanded to show all schools */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Schools</CardTitle>
              <Button className="bg-[#121051] hover:bg-[#0f0d42] text-white" style={{ backgroundColor: "#121051" }}>
                <Plus className="w-4 h-4 mr-2" />
                Add schools
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="border border-slate-200 rounded-lg overflow-hidden h-full">
              <table className="w-full h-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">URN</th>
                    <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolsData.map((school, index) => (
                    <tr key={school.urn} className="hover:bg-slate-50 border-b border-slate-100">
                      <td className="p-3 text-slate-900 font-medium">{school.urn}</td>
                      <td className="p-3 text-slate-900">{school.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
