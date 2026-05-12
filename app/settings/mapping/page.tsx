"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"


const ethnicityValues = [
  "Any other Asian background",
  "Any other Black background",
  "Any other mixed background",
  "Any Other White Background",
  "Asian - British",
  "Bangladeshi",
  "Black - African",
  "Black Caribbean",
  "Chinese",
  "Gypsy/Roma",
  "Indian",
  "Information Not Yet Obtained",
  "Pakistani",
  "Refused",
  "White - British",
  "White - Irish",
  "White and Asian",
  "White and Black African",
]

const mappedValues = [
  { code: "ABAN", count: 1, label: "Bangladeshi" },
  { code: "ABRI", count: 1, label: "Asian - British" },
  { code: "AIND", count: 1, label: "Indian" },
  { code: "AOTH", count: 1, label: "Any other Asian background" },
  { code: "APKN", count: 1, label: "Pakistani" },
  { code: "AWEL", count: null, label: "Asian - Welsh" },
  { code: "BAFR", count: 1, label: "Black - African" },
  { code: "BBRI", count: null, label: "Black -British" },
  { code: "BCRB", count: 1, label: "Black Caribbean" },
  { code: "BOTH", count: 1, label: "Any other black background" },
  { code: "BWEL", count: null, label: "Black - Welsh" },
  { code: "CHNE", count: 1, label: "Chinese" },
  { code: "MOTH", count: 1, label: "Any other mixed background" },
  { code: "MWAS", count: 1, label: "White and Asian" },
  { code: "MWBA", count: 1, label: "White and Black African" },
  { code: "MWBC", count: 1, label: "White and Black Caribbean" },
  { code: "NOBT", count: 1, label: "Information not yet obtained" },
  { code: "OOTH", count: null, label: "Any other ethnic group" },
]

// DfE extended ethnicity reference data
const dfeExtendedEthnicities: Record<string, {
  dfeExtendedLabel: string
  dfeExtendedCode: string
  dfeMainCode: string
  dfeMainDescription: string
}> = {
  "Any other Asian background": { dfeExtendedLabel: "Any other Asian background", dfeExtendedCode: "AOTH", dfeMainCode: "AOTH", dfeMainDescription: "Any other Asian background" },
  "Any other Black background": { dfeExtendedLabel: "Any other Black background", dfeExtendedCode: "BOTH", dfeMainCode: "BOTH", dfeMainDescription: "Any other Black background" },
  "Any other mixed background": { dfeExtendedLabel: "Any other mixed background", dfeExtendedCode: "MOTH", dfeMainCode: "MOTH", dfeMainDescription: "Any other mixed background" },
  "Any Other White Background": { dfeExtendedLabel: "Any other white background", dfeExtendedCode: "WOTH", dfeMainCode: "WOTH", dfeMainDescription: "Any other white background" },
  "Asian - British": { dfeExtendedLabel: "Asian - British", dfeExtendedCode: "ABRI", dfeMainCode: "AOTH", dfeMainDescription: "Any other Asian background" },
  "Bangladeshi": { dfeExtendedLabel: "Bangladeshi", dfeExtendedCode: "ABAN", dfeMainCode: "ABAN", dfeMainDescription: "Bangladeshi" },
  "Black - African": { dfeExtendedLabel: "Black - African", dfeExtendedCode: "BAFR", dfeMainCode: "BAFR", dfeMainDescription: "Black - African" },
  "Black Caribbean": { dfeExtendedLabel: "Black Caribbean", dfeExtendedCode: "BCRB", dfeMainCode: "BCRB", dfeMainDescription: "Black Caribbean" },
  "Chinese": { dfeExtendedLabel: "Chinese", dfeExtendedCode: "CHNE", dfeMainCode: "CHNE", dfeMainDescription: "Chinese" },
  "Gypsy/Roma": { dfeExtendedLabel: "Gypsy/Roma", dfeExtendedCode: "WROM", dfeMainCode: "WOTH", dfeMainDescription: "Any other white background" },
  "Indian": { dfeExtendedLabel: "Indian", dfeExtendedCode: "AIND", dfeMainCode: "AIND", dfeMainDescription: "Indian" },
  "Information Not Yet Obtained": { dfeExtendedLabel: "Not obtained", dfeExtendedCode: "NOBT", dfeMainCode: "NOBT", dfeMainDescription: "Information not yet obtained" },
  "Pakistani": { dfeExtendedLabel: "Pakistani", dfeExtendedCode: "APKN", dfeMainCode: "APKN", dfeMainDescription: "Pakistani" },
  "Refused": { dfeExtendedLabel: "Refused", dfeExtendedCode: "REFU", dfeMainCode: "REFU", dfeMainDescription: "Refused" },
  "White - British": { dfeExtendedLabel: "White - British", dfeExtendedCode: "WBRI", dfeMainCode: "WBRI", dfeMainDescription: "White - British" },
  "White - Irish": { dfeExtendedLabel: "White - Irish", dfeExtendedCode: "WIRI", dfeMainCode: "WIRI", dfeMainDescription: "White - Irish" },
  "White and Asian": { dfeExtendedLabel: "White and Asian", dfeExtendedCode: "MWAS", dfeMainCode: "MWAS", dfeMainDescription: "White and Asian" },
  "White and Black African": { dfeExtendedLabel: "White and Black African", dfeExtendedCode: "MWBA", dfeMainCode: "MWBA", dfeMainDescription: "White and Black African" },
}

export default function MappingPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedMapping, setSelectedMapping] = useState("ethnicity")
  const [selectedOrganisation, setSelectedOrganisation] = useState("st-clare")
  const [activeTab, setActiveTab] = useState<"map" | "review">("map")
  const [leftSearch, setLeftSearch] = useState("")
  const [rightSearch, setRightSearch] = useState("")
  const [mappings, setMappings] = useState<Record<string, string>>({
    "Any other Asian background": "AOTH",
    "Any other Black background": "BOTH",
    "Any other mixed background": "MOTH",
    "Any Other White Background": "OOTH",
    "Asian - British": "ABRI",
    "Bangladeshi": "ABAN",
    "Black - African": "BAFR",
    "Black Caribbean": "BCRB",
    "Chinese": "CHNE",
    "Gypsy/Roma": "OOTH",
    "Indian": "AIND",
    "Information Not Yet Obtained": "NOBT",
    "Pakistani": "APKN",
    "Refused": "NOBT",
    "White - British": "ABRI",
    "White - Irish": "ABRI",
    "White and Asian": "MWAS",
    "White and Black African": "MWBA",
  })
  const [reportedEthnicities, setReportedEthnicities] = useState<Record<string, string>>({
    "Any other Asian background": "dfe-main",
    "Any other Black background": "dfe-main",
    "Any other mixed background": "dfe-main",
    "Any Other White Background": "dfe-main",
    "Asian - British": "dfe-extended",
    "Bangladeshi": "dfe-main",
    "Black - African": "dfe-main",
    "Black Caribbean": "dfe-main",
    "Chinese": "dfe-main",
    "Gypsy/Roma": "dfe-extended",
    "Indian": "dfe-main",
    "Information Not Yet Obtained": "dfe-main",
    "Pakistani": "dfe-main",
    "Refused": "dfe-main",
    "White - British": "dfe-main",
    "White - Irish": "dfe-main",
    "White and Asian": "dfe-main",
    "White and Black African": "dfe-main",
  })

  const filteredEthnicityValues = ethnicityValues.filter((v) =>
    v.toLowerCase().includes(leftSearch.toLowerCase())
  )

  const filteredMappedValues = mappedValues.filter(
    (v) =>
      v.code.toLowerCase().includes(rightSearch.toLowerCase()) ||
      v.label.toLowerCase().includes(rightSearch.toLowerCase())
  )

  const clearSelection = () => {
    setSelectedMapping("")
    setSelectedOrganisation("")
    setMappings({})
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto space-y-4">
          {/* Data Mapping Header Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-end justify-between">
                <div className="flex items-end gap-6">
                  <div>
                    <h1 className="text-base font-bold text-slate-900 mb-1">Data Mapping</h1>
                    <p className="text-xs text-slate-500 mb-1">Data mapping</p>
                    <Select value={selectedMapping} onValueChange={setSelectedMapping}>
                      <SelectTrigger className="w-36 h-9 bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethnicity">Ethnicity</SelectItem>
                        <SelectItem value="sen">SEN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Organisation</p>
                    <Select value={selectedOrganisation} onValueChange={setSelectedOrganisation}>
                      <SelectTrigger className="w-52 h-9 bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="st-clare">St Clare Catholic Multi A...</SelectItem>
                        <SelectItem value="holy-cross">Holy Cross Academy</SelectItem>
                        <SelectItem value="st-mary">St Mary&apos;s School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-slate-700 underline hover:text-slate-900 pb-2"
                  >
                    Clear Selection
                  </button>
                </div>
                <Button className="bg-primary hover:bg-primary/90 px-8">Save</Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Full-Width Layout */}
          {selectedMapping && selectedOrganisation && (
          <Card>
            <CardContent className="p-0">
              {/* Tab Navigation */}
              <div className="flex items-center border-b px-4">
                <button
                  onClick={() => setActiveTab("map")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "map"
                      ? "text-primary border-primary"
                      : "text-slate-500 border-transparent hover:text-slate-700"
                  }`}
                >
                  Map Ethnicities
                </button>
                <button
                  onClick={() => setActiveTab("review")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "review"
                      ? "text-primary border-primary"
                      : "text-slate-500 border-transparent hover:text-slate-700"
                  }`}
                >
                  Review Mapped Values
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                    {Object.keys(mappings).filter(k => mappings[k]).length}
                  </span>
                </button>
              </div>

              {/* Map Ethnicities Tab */}
              {activeTab === "map" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">School Ethnicity Values</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Select a DfE mapping for each school ethnicity value</p>
                    </div>
                    <Input
                      placeholder="Search ethnicities..."
                      value={leftSearch}
                      onChange={(e) => setLeftSearch(e.target.value)}
                      className="w-64 h-9"
                    />
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 w-1/2">School Ethnicity</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 w-1/2">Mapped to DfE Value</th>
                        </tr>
                      </thead>
                    </table>
                    <div className="max-h-[450px] overflow-y-auto">
                      <table className="w-full">
                        <tbody>
                          {filteredEthnicityValues.map((value, index) => (
                            <tr
                              key={index}
                              className="border-t hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-4 py-3 w-1/2">
                                <span className="text-sm text-slate-800">{value}</span>
                              </td>
                              <td className="px-4 py-3 w-1/2">
                                <Select
                                  value={mappings[value] || ""}
                                  onValueChange={(val) =>
                                    setMappings((prev) => ({ ...prev, [value]: val }))
                                  }
                                >
                                  <SelectTrigger className="w-full max-w-md h-9 text-sm">
                                    <SelectValue placeholder="Select DfE mapping..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {mappedValues.map((mv) => (
                                      <SelectItem key={mv.code} value={mv.code}>
                                        <span className="font-medium">{mv.code}</span>
                                        <span className="text-slate-500 ml-2">- {mv.label}</span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Mapped Values Tab */}
              {activeTab === "review" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Mapped Values Overview</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Review all mappings and select which value to use in reports</p>
                    </div>
                    <Input
                      placeholder="Search mapped values..."
                      value={rightSearch}
                      onChange={(e) => setRightSearch(e.target.value)}
                      className="w-64 h-9"
                    />
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px]">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">School Ethnicity</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Mapped to DfE Extended</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">DfE Extended Code</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">DfE Main Code</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">DfE Main Description</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">Reported Ethnicity</th>
                          </tr>
                        </thead>
                      </table>
                      <div className="max-h-[450px] overflow-y-auto">
                        <table className="w-full min-w-[900px]">
                          <tbody>
                            {filteredEthnicityValues
                              .filter((v) => mappings[v])
                              .filter((v) =>
                                v.toLowerCase().includes(rightSearch.toLowerCase()) ||
                                (dfeExtendedEthnicities[v]?.dfeExtendedLabel ?? "").toLowerCase().includes(rightSearch.toLowerCase())
                              )
                              .map((schoolEthnicity, index) => {
                                const mappedCode = mappings[schoolEthnicity]
                                const mappedVal = mappedValues.find((mv) => mv.code === mappedCode)
                                const dfe = dfeExtendedEthnicities[schoolEthnicity]
                                return (
                                  <tr key={index} className="border-t hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-slate-800">{schoolEthnicity}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{dfe?.dfeExtendedLabel ?? mappedVal?.label ?? "—"}</td>
                                    <td className="px-4 py-3">
                                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                                        {dfe?.dfeExtendedCode ?? mappedCode}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                                        {dfe?.dfeMainCode ?? "—"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{dfe?.dfeMainDescription ?? "—"}</td>
                                    <td className="px-4 py-3">
                                      <Select
                                        value={reportedEthnicities[schoolEthnicity] || ""}
                                        onValueChange={(val) =>
                                          setReportedEthnicities((prev) => ({ ...prev, [schoolEthnicity]: val }))
                                        }
                                      >
                                        <SelectTrigger className="h-8 w-36 text-sm">
                                          <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="dfe-main">DfE main</SelectItem>
                                          <SelectItem value="dfe-extended">DfE extended</SelectItem>
                                          <SelectItem value="school">School</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </td>
                                  </tr>
                                )
                              })}
                            {filteredEthnicityValues.filter((v) => mappings[v]).length === 0 && (
                              <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                                  No mappings yet. Go to the &quot;Map Ethnicities&quot; tab to create mappings.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </div>
  )
}
