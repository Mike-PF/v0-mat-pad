"use client"

import { useState } from "react"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus,
  ChevronDown,
  Building2, 
  School, 
  Settings,
  Pencil,
  ChevronRight,
  ArrowLeft
} from "lucide-react"

// MAT and School data structure
interface SchoolData {
  id: string
  urn: string
  name: string
  headTeacher: string
  address: string
  phone: string
  email: string
  logo: string
  primaryColor: string
  secondaryColor: string
  powerBiLoginEmail?: string
  matId?: string
}

interface MATData {
  id: string
  name: string
  ceo: string
  address: string
  phone: string
  email: string
  logo: string
  primaryColor: string
  secondaryColor: string
  powerBiLoginEmail?: string
  schools: SchoolData[]
}

// Sample data
const initialMATs: MATData[] = [
  {
    id: "mat-1",
    name: "St Clare Catholic Multi Academy Trust",
    ceo: "Dr. Sarah Mitchell",
    address: "123 Trust House, Liverpool, L1 1AA",
    phone: "0151 123 4567",
    email: "admin@stclaremat.org",
    logo: "/placeholder.svg",
    primaryColor: "#121051",
    secondaryColor: "#4A90D9",
    powerBiLoginEmail: "reports@stclaremat.org",
    schools: [
      {
        id: "school-1",
        urn: "138337",
        name: "All Saints' Catholic High School",
        headTeacher: "Mr. James Wilson",
        address: "School Lane, Liverpool, L2 2BB",
        phone: "0151 234 5678",
        email: "office@allsaints.org",
        logo: "/placeholder.svg",
        primaryColor: "#121051",
        secondaryColor: "#4A90D9",
        powerBiLoginEmail: "reports@allsaints.org",
        matId: "mat-1",
      },
      {
        id: "school-2",
        urn: "140826",
        name: "Emmaus Catholic and CofE Primary School",
        headTeacher: "Mrs. Helen Brown",
        address: "Church Road, Liverpool, L3 3CC",
        phone: "0151 345 6789",
        email: "office@emmaus.org",
        logo: "/placeholder.svg",
        primaryColor: "#121051",
        secondaryColor: "#4A90D9",
        matId: "mat-1",
      },
      {
        id: "school-3",
        urn: "138361",
        name: "Notre Dame High School",
        headTeacher: "Dr. Michael O'Connor",
        address: "Notre Dame Drive, Liverpool, L4 4DD",
        phone: "0151 456 7890",
        email: "office@notredame.org",
        logo: "/placeholder.svg",
        primaryColor: "#2563eb",
        secondaryColor: "#60A5FA",
        powerBiLoginEmail: "reports@notredame.org",
        matId: "mat-1",
      },
    ],
  },
  {
    id: "mat-2",
    name: "Holy Family Catholic Academy Trust",
    ceo: "Mr. David Thompson",
    address: "456 Academy Way, Manchester, M1 1AA",
    phone: "0161 123 4567",
    email: "admin@holyfamilymat.org",
    logo: "/placeholder.svg",
    primaryColor: "#059669",
    secondaryColor: "#34D399",
    schools: [
      {
        id: "school-4",
        urn: "140439",
        name: "Sacred Heart School",
        headTeacher: "Mrs. Patricia Kelly",
        address: "Heart Lane, Manchester, M2 2BB",
        phone: "0161 234 5678",
        email: "office@sacredheart.org",
        logo: "/placeholder.svg",
        primaryColor: "#059669",
        secondaryColor: "#34D399",
        matId: "mat-2",
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
    headTeacher: "Mr. Robert Evans",
    address: "Alban Road, Leeds, LS1 1AA",
    phone: "0113 123 4567",
    email: "office@stalbans.org",
    logo: "/placeholder.svg",
    primaryColor: "#dc2626",
    secondaryColor: "#F87171",
    powerBiLoginEmail: "reports@stalbans.org",
  },
  {
    id: "standalone-2",
    urn: "144606",
    name: "Holy Trinity Catholic and Church of England School",
    headTeacher: "Mrs. Angela Davies",
    address: "Trinity Street, Birmingham, B1 1AA",
    phone: "0121 123 4567",
    email: "office@holytrinity.org",
    logo: "/placeholder.svg",
    primaryColor: "#7c3aed",
    secondaryColor: "#A78BFA",
  },
]

export default function OrganisationPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [mats, setMats] = useState<MATData[]>(initialMATs)
  const [standaloneSchools, setStandaloneSchools] = useState<SchoolData[]>(initialStandaloneSchools)
  const [selectedType, setSelectedType] = useState<"mat" | "school">("mat")
  const [selectedId, setSelectedId] = useState<string>("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<MATData | SchoolData | null>(null)
  const [drillDownSchoolId, setDrillDownSchoolId] = useState<string | null>(null)
  const [settingsTab, setSettingsTab] = useState<"basic" | "branding" | "powerbi">("basic")
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newOrgType, setNewOrgType] = useState<"mat" | "school">("school")
  const [newOrgName, setNewOrgName] = useState("")
  const [newOrgExpiry, setNewOrgExpiry] = useState("")
  const [schoolsDropdownOpen, setSchoolsDropdownOpen] = useState(false)
  const [schoolsSearch, setSchoolsSearch] = useState("")

  // Get all schools (from MATs and standalone)
  const getAllSchools = (): SchoolData[] => {
    const matSchools = mats.flatMap(mat => mat.schools)
    return [...matSchools, ...standaloneSchools]
  }

  // Filter MATs and schools based on search
  const getFilteredMATs = () => {
    if (!pickerSearch) return mats
    const search = pickerSearch.toLowerCase()
    return mats.filter(mat => 
      mat.name.toLowerCase().includes(search)
    )
  }

  const getFilteredSchools = () => {
    const allSchools = getAllSchools()
    if (!pickerSearch) return allSchools
    const search = pickerSearch.toLowerCase()
    return allSchools.filter(school => 
      school.name.toLowerCase().includes(search) ||
      school.urn.toLowerCase().includes(search)
    )
  }

  const getFilteredMATSchools = () => {
    if (!selectedMAT) return []
    if (!schoolsSearch) return selectedMAT.schools
    const search = schoolsSearch.toLowerCase()
    return selectedMAT.schools.filter(school => 
      school.name.toLowerCase().includes(search) ||
      school.urn.toLowerCase().includes(search)
    )
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
    setPickerSearch("") // Clear search when selecting
    setDrillDownSchoolId(null) // Reset drill down when selecting new item
  }

  const handleEditClick = () => {
    const data = getSelectedData()
    if (data) {
      setEditingItem(JSON.parse(JSON.stringify(data)))
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingItem(null)
  }

  const handleOpenAddModal = () => {
    setNewOrgType("school")
    setNewOrgName("")
    setNewOrgExpiry("")
    setAddModalOpen(true)
  }

  const handleAddOrganisation = () => {
    // For now just close the modal - would save to backend in real app
    setAddModalOpen(false)
    setNewOrgName("")
    setNewOrgExpiry("")
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
    setIsEditing(false)
    setEditingItem(null)
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
                      <span className="text-sm font-medium text-slate-900 flex-1 text-left truncate">
                        {displayName}
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedType === "mat" ? "MAT" : "School"}
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
                        value={pickerSearch}
                        onChange={(e) => setPickerSearch(e.target.value)}
                        className="h-9"
                        autoFocus
                      />
                    </div>
                    
                    <div className="overflow-auto flex-1">
                      {/* MATs Section */}
                      {getFilteredMATs().length > 0 && (
                        <>
                          <div className="p-2 border-b">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
                              Multi-Academy Trusts
                            </span>
                          </div>
                          {getFilteredMATs().map((mat) => (
                            <button
                              key={mat.id}
                              onClick={() => handleSelect("mat", mat.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                selectedType === "mat" && selectedId === mat.id ? "bg-[#B30089]" : "hover:bg-slate-50"
                              }`}
                            >
                              <span className={`text-sm flex-1 text-left truncate ${selectedType === "mat" && selectedId === mat.id ? "text-white font-medium" : "text-slate-900"}`}>
                                {mat.name}
                              </span>
                              <span className={`text-xs ${selectedType === "mat" && selectedId === mat.id ? "text-white" : "text-slate-500"}`}>
                                {mat.schools.length} schools
                              </span>
                            </button>
                          ))}
                        </>
                      )}

                      {/* Schools Section */}
                      {getFilteredSchools().length > 0 && (
                        <>
                          <div className="p-2 border-b border-t">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2">
                              Schools
                            </span>
                          </div>
                          {getFilteredSchools().map((school) => {
                            const parentMAT = getParentMAT(school)
                            return (
                              <button
                                key={school.id}
                                onClick={() => handleSelect("school", school.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                                  selectedType === "school" && selectedId === school.id ? "bg-[#B30089]" : "hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex-1 text-left min-w-0">
                                  <span className={`text-sm block truncate ${selectedType === "school" && selectedId === school.id ? "text-white font-medium" : "text-slate-900"}`}>
                                    {school.name}
                                  </span>
                                  {parentMAT && (
                                    <span className={`text-xs truncate block ${selectedType === "school" && selectedId === school.id ? "text-white" : "text-slate-500"}`}>
                                      {parentMAT.name}
                                    </span>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </>
                      )}

                      {/* No results */}
                      {getFilteredMATs().length === 0 && getFilteredSchools().length === 0 && (
                        <div className="p-4 text-center text-sm text-slate-500">
                          No results found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {selectedData ? (
                  isEditing ? (
                    <>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="border-slate-300 text-slate-600"
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveEdit}
                        className="text-white"
                        style={{ backgroundColor: "#121051" }}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleEditClick}
                      className="border-slate-300 text-slate-600 hover:bg-[#121051] hover:text-white hover:border-[#121051] transition-colors"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )
                ) : (
                  <Button 
                    size="sm"
                    onClick={handleOpenAddModal}
                    className="text-white"
                    style={{ backgroundColor: "#121051" }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Organisation
                  </Button>
                )}
              </div>
            </div>

            {/* Schools Navigation Panel - shown when MAT is selected */}
            {selectedType === "mat" && selectedMAT && (
              <div className="px-4 py-3 border-b bg-slate-50">
                {isViewingSchoolInMAT ? (
                  /* Back to MAT navigation */
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBackToMAT}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors text-sm text-slate-600"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to {selectedMAT.name}
                    </button>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-2 text-sm text-slate-900">
                      <School className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">{selectedData?.name}</span>
                    </div>
                  </div>
                ) : (
                  /* Schools list for drilling down */
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Schools in Trust ({selectedMAT.schools.length})
                      </span>
                    </div>
                    {selectedMAT.schools.length >= 3 ? (
                      /* Dropdown with search for large numbers */
                      <div className="relative">
                        <button
                          onClick={() => {
                            setSchoolsDropdownOpen(!schoolsDropdownOpen)
                            setSchoolsSearch("")
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md hover:border-[#121051] transition-colors text-sm text-slate-700 min-w-[250px]"
                        >
                          <School className="w-4 h-4 text-slate-400" />
                          <span className="flex-1 text-left">Select a school...</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${schoolsDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {schoolsDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 w-[350px] bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-[300px] flex flex-col">
                            <div className="p-2 border-b">
                              <Input
                                placeholder="Search schools..."
                                value={schoolsSearch}
                                onChange={(e) => setSchoolsSearch(e.target.value)}
                                className="h-8"
                                autoFocus
                              />
                            </div>
                            <div className="overflow-auto flex-1">
                              {getFilteredMATSchools().length > 0 ? (
                                getFilteredMATSchools().map((school) => (
                                  <button
                                    key={school.id}
                                    onClick={() => {
                                      handleDrillDownToSchool(school.id)
                                      setSchoolsDropdownOpen(false)
                                      setSchoolsSearch("")
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
                                  >
                                    <School className="w-4 h-4 text-slate-400" />
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm text-slate-900 block truncate">{school.name}</span>
                                      <span className="text-xs text-slate-500">URN: {school.urn}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300" />
                                  </button>
                                ))
                              ) : (
                                <div className="p-3 text-sm text-slate-500 text-center">No schools found</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Chips for small numbers */
                      <div className="flex flex-wrap gap-2">
                        {selectedMAT.schools.map((school) => (
                          <button
                            key={school.id}
                            onClick={() => handleDrillDownToSchool(school.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:border-[#121051] hover:bg-slate-50 transition-colors text-sm text-slate-700 group"
                          >
                            <School className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#121051]" />
                            <span className="truncate max-w-[200px]">{school.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#121051]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tabs */}
            {selectedData && (
              <div className="px-4 flex border-b">
                <button
                  onClick={() => setSettingsTab("basic")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    settingsTab === "basic"
                      ? "border-[#121051] text-[#121051]"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Basic Information
                </button>
                <button
                  onClick={() => setSettingsTab("branding")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    settingsTab === "branding"
                      ? "border-[#121051] text-[#121051]"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Branding
                </button>
                <button
                  onClick={() => setSettingsTab("powerbi")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                    settingsTab === "powerbi"
                      ? "border-[#121051] text-[#121051]"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Power BI
                </button>
              </div>
            )}

            {/* Content */}
            <CardContent className="flex-1 overflow-auto p-6">
              {selectedData ? (
                <div className="max-w-3xl">
                  {/* Basic Information Tab */}
                  {settingsTab === "basic" && (
                    <div className="space-y-6">
                      {isEditing && editingItem ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="text-xs text-slate-500 block mb-1">Name</label>
                            <Input
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              className="h-9"
                            />
                          </div>
                          {"urn" in editingItem ? (
                            <>
                              <div>
                                <label className="text-xs text-slate-500 block mb-1">URN</label>
                                <Input
                                  value={editingItem.urn}
                                  onChange={(e) => setEditingItem({ ...editingItem, urn: e.target.value })}
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-slate-500 block mb-1">Head Teacher</label>
                                <Input
                                  value={(editingItem as SchoolData).headTeacher}
                                  onChange={(e) => setEditingItem({ ...editingItem, headTeacher: e.target.value })}
                                  className="h-9"
                                />
                              </div>
                            </>
                          ) : (
                            <div className="col-span-2">
                              <label className="text-xs text-slate-500 block mb-1">CEO</label>
                              <Input
                                value={(editingItem as MATData).ceo}
                                onChange={(e) => setEditingItem({ ...editingItem, ceo: e.target.value })}
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
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {"urn" in selectedData ? (
                            <>
                              <div>
                                <span className="text-xs text-slate-500">URN</span>
                                <p className="text-sm text-slate-900">{selectedData.urn}</p>
                              </div>
                              <div>
                                <span className="text-xs text-slate-500">Head Teacher</span>
                                <p className="text-sm text-slate-900">{(selectedData as SchoolData).headTeacher}</p>
                              </div>
                            </>
                          ) : (
                            <div className="col-span-2">
                              <span className="text-xs text-slate-500">CEO</span>
                              <p className="text-sm text-slate-900">{(selectedData as MATData).ceo}</p>
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
                  )}

                  {/* Branding Tab */}
                  {settingsTab === "branding" && (
                    <div className="space-y-6">
                      {isEditing && editingItem ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-slate-500 block mb-1">Logo</label>
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden">
                                  {editingItem.logo ? (
                                    <Image
                                      src={editingItem.logo}
                                      alt="Logo"
                                      width={48}
                                      height={48}
                                      className="object-contain"
                                    />
                                  ) : (
                                    <span className="text-xs text-slate-400">No logo</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <label 
                                    htmlFor="logo-upload"
                                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 transition-colors"
                                  >
                                    Upload Logo
                                  </label>
                                  <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        const url = URL.createObjectURL(file)
                                        setEditingItem({ ...editingItem, logo: url })
                                      }
                                    }}
                                  />
                                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
                                </div>
                              </div>
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
                            <div>
                              <label className="text-xs text-slate-500 block mb-1">Secondary Color</label>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  value={editingItem.secondaryColor}
                                  onChange={(e) => setEditingItem({ ...editingItem, secondaryColor: e.target.value })}
                                  className="h-9 w-12 p-1 cursor-pointer"
                                />
                                <Input
                                  value={editingItem.secondaryColor}
                                  onChange={(e) => setEditingItem({ ...editingItem, secondaryColor: e.target.value })}
                                  className="h-9 flex-1"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
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
                            <div>
                              <span className="text-xs text-slate-500 block mb-1">Secondary Color</span>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-8 h-8 rounded border border-slate-200"
                                  style={{ backgroundColor: selectedData.secondaryColor }}
                                />
                                <span className="text-sm text-slate-700">{selectedData.secondaryColor}</span>
                              </div>
                            </div>
                          </div>
                      )}
                    </div>
                  )}

                  {/* Power BI Tab */}
                  {settingsTab === "powerbi" && (
                    <div className="space-y-6">
                      {isEditing && editingItem ? (
                        <div className="space-y-4">
                          <div>
<label className="text-xs text-slate-500 block mb-1">Login Email</label>
                              <Input
                                type="email"
                                value={editingItem.powerBiLoginEmail || ""}
                                onChange={(e) => setEditingItem({ ...editingItem, powerBiLoginEmail: e.target.value })}
                                placeholder="Enter Power BI login email"
                              className="h-9"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                              The email address used to log in to Power BI Premium
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs text-slate-500">Login Email</span>
                            {selectedData.powerBiLoginEmail ? (
                              <p className="text-sm text-slate-900">{selectedData.powerBiLoginEmail}</p>
                            ) : (
                              <p className="text-sm text-slate-400 italic">No email configured</p>
                            )}
                          </div>
                        </div>
                      )}
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

      {/* Add Organisation Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md p-0 flex flex-col">
          <div className="p-6 pb-4 border-b">
            <h2 className="text-lg font-semibold text-slate-900">Add Organisation</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Type</label>
              <Select value={newOrgType} onValueChange={(value: "mat" | "school") => { setNewOrgType(value); setNewOrgName(""); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mat">Multi-Academy Trust (MAT)</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Name</label>
              <Select value={newOrgName} onValueChange={setNewOrgName}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={newOrgType === "mat" ? "Select a MAT" : "Select a school"} />
                </SelectTrigger>
                <SelectContent>
                  {newOrgType === "mat" ? (
                    mats.map((mat) => (
                      <SelectItem key={mat.id} value={mat.id}>
                        {mat.name}
                      </SelectItem>
                    ))
                  ) : (
                    getAllSchools().map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Expiry Date</label>
              <Input
                type="date"
                value={newOrgExpiry}
                onChange={(e) => setNewOrgExpiry(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="p-6 pt-4 border-t flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setAddModalOpen(false)}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddOrganisation}
              disabled={!newOrgName || !newOrgExpiry}
              className="px-4 text-white disabled:opacity-50"
              style={{ backgroundColor: "#121051" }}
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
