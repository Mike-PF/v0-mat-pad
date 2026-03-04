"use client"

import { useState } from "react"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { 
  Building2, 
  School, 
  Settings,
  Pencil,
  ChevronDown,
  ChevronRight,
  ArrowLeft
} from "lucide-react"

// MAT and School data structure
interface SchoolData {
  id: string
  urn: string
  name: string
  address: string
  phone: string
  email: string
  logo: string
  primaryColor: string
  matId?: string
  features: {
    attendance: boolean
    behaviour: boolean
    safeguarding: boolean
    analytics: boolean
  }
}

interface MATData {
  id: string
  name: string
  address: string
  phone: string
  email: string
  logo: string
  primaryColor: string
  features: {
    attendance: boolean
    behaviour: boolean
    safeguarding: boolean
    analytics: boolean
  }
  schools: SchoolData[]
}

// Sample data
const initialMATs: MATData[] = [
  {
    id: "mat-1",
    name: "St Clare Catholic Multi Academy Trust",
    address: "123 Trust House, Liverpool, L1 1AA",
    phone: "0151 123 4567",
    email: "admin@stclaremat.org",
    logo: "/placeholder.svg",
    primaryColor: "#121051",
    features: {
      attendance: true,
      behaviour: true,
      safeguarding: true,
      analytics: true,
    },
    schools: [
      {
        id: "school-1",
        urn: "138337",
        name: "All Saints' Catholic High School",
        address: "School Lane, Liverpool, L2 2BB",
        phone: "0151 234 5678",
        email: "office@allsaints.org",
        logo: "/placeholder.svg",
        primaryColor: "#121051",
        matId: "mat-1",
        features: {
          attendance: true,
          behaviour: true,
          safeguarding: true,
          analytics: false,
        },
      },
      {
        id: "school-2",
        urn: "140826",
        name: "Emmaus Catholic and CofE Primary School",
        address: "Church Road, Liverpool, L3 3CC",
        phone: "0151 345 6789",
        email: "office@emmaus.org",
        logo: "/placeholder.svg",
        primaryColor: "#121051",
        matId: "mat-1",
        features: {
          attendance: true,
          behaviour: false,
          safeguarding: true,
          analytics: true,
        },
      },
      {
        id: "school-3",
        urn: "138361",
        name: "Notre Dame High School",
        address: "Notre Dame Drive, Liverpool, L4 4DD",
        phone: "0151 456 7890",
        email: "office@notredame.org",
        logo: "/placeholder.svg",
        primaryColor: "#2563eb",
        matId: "mat-1",
        features: {
          attendance: true,
          behaviour: true,
          safeguarding: true,
          analytics: true,
        },
      },
    ],
  },
  {
    id: "mat-2",
    name: "Holy Family Catholic Academy Trust",
    address: "456 Academy Way, Manchester, M1 1AA",
    phone: "0161 123 4567",
    email: "admin@holyfamilymat.org",
    logo: "/placeholder.svg",
    primaryColor: "#059669",
    features: {
      attendance: true,
      behaviour: true,
      safeguarding: false,
      analytics: true,
    },
    schools: [
      {
        id: "school-4",
        urn: "140439",
        name: "Sacred Heart School",
        address: "Heart Lane, Manchester, M2 2BB",
        phone: "0161 234 5678",
        email: "office@sacredheart.org",
        logo: "/placeholder.svg",
        primaryColor: "#059669",
        matId: "mat-2",
        features: {
          attendance: true,
          behaviour: true,
          safeguarding: false,
          analytics: true,
        },
      },
    ],
  },
]

// Standalone schools (not part of a MAT)
const initialStandaloneSchools: SchoolData[] = [
  {
    id: "standalone-1",
    urn: "148974",
    name: "St Alban's Catholic Primary and Nursery School",
    address: "Alban Road, Leeds, LS1 1AA",
    phone: "0113 123 4567",
    email: "office@stalbans.org",
    logo: "/placeholder.svg",
    primaryColor: "#dc2626",
    features: {
      attendance: true,
      behaviour: true,
      safeguarding: true,
      analytics: false,
    },
  },
  {
    id: "standalone-2",
    urn: "144606",
    name: "Holy Trinity Catholic and Church of England School",
    address: "Trinity Street, Birmingham, B1 1AA",
    phone: "0121 123 4567",
    email: "office@holytrinity.org",
    logo: "/placeholder.svg",
    primaryColor: "#7c3aed",
    features: {
      attendance: true,
      behaviour: false,
      safeguarding: true,
      analytics: true,
    },
  },
]

export default function OrganisationPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [mats, setMats] = useState<MATData[]>(initialMATs)
  const [standaloneSchools, setStandaloneSchools] = useState<SchoolData[]>(initialStandaloneSchools)
  const [selectedType, setSelectedType] = useState<"mat" | "school">("mat")
  const [selectedId, setSelectedId] = useState<string>("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MATData | SchoolData | null>(null)
  const [drillDownSchoolId, setDrillDownSchoolId] = useState<string | null>(null)

  // Get all schools (from MATs and standalone)
  const getAllSchools = (): SchoolData[] => {
    const matSchools = mats.flatMap(mat => mat.schools)
    return [...matSchools, ...standaloneSchools]
  }

  const getSelectedData = (): MATData | SchoolData | null => {
    if (!selectedId) return null
    
    // If we're drilled down into a school within a MAT
    if (drillDownSchoolId && selectedType === "mat") {
      const mat = mats.find(m => m.id === selectedId)
      return mat?.schools.find(s => s.id === drillDownSchoolId) || null
    }
    
    if (selectedType === "mat") {
      return mats.find(m => m.id === selectedId) || null
    } else {
      return getAllSchools().find(s => s.id === selectedId) || null
    }
  }

  const getSelectedMAT = (): MATData | null => {
    if (selectedType === "mat") {
      return mats.find(m => m.id === selectedId) || null
    }
    return null
  }

  const handleDrillDownToSchool = (schoolId: string) => {
    setDrillDownSchoolId(schoolId)
  }

  const handleBackToMAT = () => {
    setDrillDownSchoolId(null)
  }

  const getParentMAT = (school: SchoolData): MATData | null => {
    if (!school.matId) return null
    return mats.find(m => m.id === school.matId) || null
  }

  const handleSelect = (type: "mat" | "school", id: string) => {
    setSelectedType(type)
    setSelectedId(id)
    setPickerOpen(false)
    setDrillDownSchoolId(null) // Reset drill down when selecting new item
  }

  const handleEditClick = () => {
    const data = getSelectedData()
    if (data) {
      setEditingItem(JSON.parse(JSON.stringify(data)))
      setEditModalOpen(true)
    }
  }

  const handleSaveEdit = () => {
    if (!editingItem) return

    // If editing a drilled-down school within a MAT
    if (drillDownSchoolId && selectedType === "mat") {
      const school = editingItem as SchoolData
      setMats(prev => prev.map(m => 
        m.id === selectedId 
          ? { ...m, schools: m.schools.map(s => s.id === school.id ? school : s) }
          : m
      ))
    } else if (selectedType === "mat") {
      setMats(prev => prev.map(m => 
        m.id === editingItem.id ? editingItem as MATData : m
      ))
    } else {
      const school = editingItem as SchoolData
      if (school.matId) {
        // School within a MAT
        setMats(prev => prev.map(m => 
          m.id === school.matId 
            ? { ...m, schools: m.schools.map(s => s.id === school.id ? school : s) }
            : m
        ))
      } else {
        // Standalone school
        setStandaloneSchools(prev => prev.map(s => 
          s.id === school.id ? school : s
        ))
      }
    }
    setEditModalOpen(false)
  }

  const handleFeatureToggle = (feature: keyof MATData["features"], value: boolean) => {
    if (!editingItem) return
    setEditingItem({
      ...editingItem,
      features: {
        ...editingItem.features,
        [feature]: value,
      },
    })
  }

  const selectedData = getSelectedData()
  const selectedMAT = getSelectedMAT()
  const isViewingSchoolInMAT = selectedType === "mat" && drillDownSchoolId !== null
  const displayName = selectedData?.name || "Select an organisation"

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-hidden">
          <Card className="h-full flex flex-col">
            {/* Picker Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="relative">
                <button
                  onClick={() => setPickerOpen(!pickerOpen)}
                  className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors min-w-[300px]"
                >
                  {selectedData ? (
                    <>
                      {selectedType === "mat" ? (
                        <Building2 className="w-5 h-5 text-slate-600" />
                      ) : (
                        <School className="w-5 h-5 text-slate-600" />
                      )}
                      <span className="text-sm font-medium text-slate-900 flex-1 text-left truncate">
                        {displayName}
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedType === "mat" ? "MAT" : "School"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Settings className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-500 flex-1 text-left">
                        Select an organisation...
                      </span>
                    </>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${pickerOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {pickerOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[400px] bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-[400px] overflow-auto">
                    {/* MATs Section */}
                    <div className="p-2 border-b">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
                        Multi-Academy Trusts
                      </span>
                    </div>
                    {mats.map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => handleSelect("mat", mat.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                          selectedType === "mat" && selectedId === mat.id ? "bg-slate-100" : ""
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-900 flex-1 text-left truncate">
                          {mat.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {mat.schools.length} schools
                        </span>
                      </button>
                    ))}

                    {/* Schools Section */}
                    <div className="p-2 border-b border-t">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
                        Schools
                      </span>
                    </div>
                    {getAllSchools().map((school) => {
                      const parentMAT = getParentMAT(school)
                      return (
                        <button
                          key={school.id}
                          onClick={() => handleSelect("school", school.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                            selectedType === "school" && selectedId === school.id ? "bg-slate-100" : ""
                          }`}
                        >
                          <School className="w-4 h-4 text-slate-500" />
                          <div className="flex-1 text-left min-w-0">
                            <span className="text-sm text-slate-900 block truncate">
                              {school.name}
                            </span>
                            {parentMAT && (
                              <span className="text-xs text-slate-500 truncate block">
                                {parentMAT.name}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {selectedData && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="border-slate-300 text-slate-600 hover:bg-[#121051] hover:text-white hover:border-[#121051] transition-colors"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {/* Content */}
            <CardContent className="flex-1 overflow-auto p-6">
              {selectedData ? (
                <div className="space-y-6 max-w-3xl">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {"urn" in selectedData && (
                        <div>
                          <span className="text-xs text-slate-500">URN</span>
                          <p className="text-sm text-slate-900">{selectedData.urn}</p>
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="text-xs text-slate-500">Address</span>
                        <p className="text-sm text-slate-900">{selectedData.address}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Phone</span>
                        <p className="text-sm text-slate-900">{selectedData.phone}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Email</span>
                        <p className="text-sm text-slate-900">{selectedData.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Branding */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Branding</h3>
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">Logo</span>
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                          <Image
                            src={selectedData.logo}
                            alt="Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">Primary Color</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded border border-slate-200"
                            style={{ backgroundColor: selectedData.primaryColor }}
                          />
                          <span className="text-sm text-slate-700">{selectedData.primaryColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Features</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedData.features).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <span className="text-sm text-slate-700 capitalize">{feature}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${enabled ? "text-green-600" : "text-slate-400"}`}>
                              {enabled ? "Enabled" : "Disabled"}
                            </span>
                            <div 
                              className={`w-2 h-2 rounded-full ${enabled ? "bg-green-500" : "bg-slate-300"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schools list for MAT - clickable to drill down */}
                  {selectedType === "mat" && !isViewingSchoolInMAT && selectedMAT && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        Schools ({selectedMAT.schools.length})
                      </h3>
                      <div className="space-y-1">
                        {selectedMAT.schools.map((school) => (
                          <button
                            key={school.id}
                            onClick={() => handleDrillDownToSchool(school.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-left group"
                          >
                            <School className="w-4 h-4 text-slate-400" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-slate-700 block truncate">
                                {school.name}
                              </span>
                              <span className="text-xs text-slate-500">URN: {school.urn}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Back to MAT button when viewing school within MAT */}
                  {isViewingSchoolInMAT && selectedMAT && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Parent Trust</h3>
                      <button
                        onClick={handleBackToMAT}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors text-left group"
                      >
                        <ArrowLeft className="w-4 h-4 text-slate-400" />
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">{selectedMAT.name}</span>
                      </button>
                    </div>
                  )}

                  {/* Parent MAT for standalone school selected from dropdown */}
                  {selectedType === "school" && (selectedData as SchoolData).matId && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">Parent Trust</h3>
                      <p className="text-sm text-slate-600">
                        {getParentMAT(selectedData as SchoolData)?.name}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select an organisation or school to view settings</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col">
          <div className="p-6 pb-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900">
              Edit {selectedType === "mat" && !isViewingSchoolInMAT ? "Multi-Academy Trust" : "School"}
            </h2>
          </div>
          
          {editingItem && (
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-slate-500 block mb-1">Name</label>
                    <Input
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  {"urn" in editingItem && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">URN</label>
                      <Input
                        value={editingItem.urn}
                        onChange={(e) => setEditingItem({ ...editingItem, urn: e.target.value })}
                        className="h-9"
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="text-xs text-slate-500 block mb-1">Address</label>
                    <Input
                      value={editingItem.address}
                      onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Phone</label>
                    <Input
                      value={editingItem.phone}
                      onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Email</label>
                    <Input
                      value={editingItem.email}
                      onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Branding */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Branding</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Logo URL</label>
                    <Input
                      value={editingItem.logo}
                      onChange={(e) => setEditingItem({ ...editingItem, logo: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Primary Color</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={editingItem.primaryColor}
                        onChange={(e) => setEditingItem({ ...editingItem, primaryColor: e.target.value })}
                        className="h-9 w-12 p-1 cursor-pointer"
                      />
                      <Input
                        value={editingItem.primaryColor}
                        onChange={(e) => setEditingItem({ ...editingItem, primaryColor: e.target.value })}
                        className="h-9 flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Features</h3>
                <div className="space-y-3">
                  {Object.entries(editingItem.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-700 capitalize">{feature}</span>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(value) => handleFeatureToggle(feature as keyof MATData["features"], value)}
                        className="data-[state=checked]:bg-[#121051]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 pt-4 border-t flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="px-4 text-white"
              style={{ backgroundColor: "#121051" }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
