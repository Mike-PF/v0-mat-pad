"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"

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

export default function MappingPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedMapping, setSelectedMapping] = useState("ethnicity")
  const [selectedOrganisation, setSelectedOrganisation] = useState("st-clare")
  const [leftSearch, setLeftSearch] = useState("")
  const [rightSearch, setRightSearch] = useState("")
  const [mappings, setMappings] = useState<Record<string, string>>({})

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
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

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
                        <SelectItem value="gender">Gender</SelectItem>
                        <SelectItem value="language">Language</SelectItem>
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

          {/* Two Column Layout */}
          {selectedMapping && selectedOrganisation && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Panel - Ethnicity Values */}
                <Card className="border">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <span className="text-sm font-medium text-primary">Ethnicity</span>
                      <Input
                        placeholder="Search..."
                        value={leftSearch}
                        onChange={(e) => setLeftSearch(e.target.value)}
                        className="w-40 h-8 text-sm"
                      />
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      {filteredEthnicityValues.map((value, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-4 py-3 border-b last:border-0 hover:bg-slate-50"
                        >
                          <span className="text-sm text-slate-700">{value} -</span>
                          <Select
                            value={mappings[value] || ""}
                            onValueChange={(val) =>
                              setMappings((prev) => ({ ...prev, [value]: val }))
                            }
                          >
                            <SelectTrigger className="w-44 h-8 text-sm text-slate-400">
                              <SelectValue placeholder="Select Mapped Value..." />
                            </SelectTrigger>
                            <SelectContent>
                              {mappedValues.map((mv) => (
                                <SelectItem key={mv.code} value={mv.code}>
                                  {mv.code} - {mv.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Right Panel - Mapped Values */}
                <Card className="border">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <span className="text-sm font-medium text-slate-700">Mapped Values</span>
                      <Input
                        placeholder="Search..."
                        value={rightSearch}
                        onChange={(e) => setRightSearch(e.target.value)}
                        className="w-40 h-8 text-sm"
                      />
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      {filteredMappedValues.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-4 py-3 border-b last:border-0 hover:bg-slate-50 cursor-pointer"
                        >
                          <span className="text-sm">
                            <span className="text-amber-600 font-medium">
                              {item.code}
                              {item.count !== null && ` (${item.count})`}
                            </span>
                            <span className="text-slate-700"> - {item.label}</span>
                          </span>
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      </div>
    </div>
  )
}
