"use client"

import { useState, useRef, useEffect } from "react"
import {
  ZoomOut,
  ZoomIn,
  Search,
  Printer,
  FolderOpen,
  Code,
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  ChevronDown,
  ChevronRight,
  Indent,
  Outdent,
  Pilcrow,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const ACCENT = "hsl(314 100% 35%)"
const NAVY = "#121051"

// Template variables organized by category - expanded for scale
const templateVariables: Record<string, string[]> = {
  School: [
    "logo",
    "school.name",
    "school.urn",
    "school.dfeNumber",
    "school.establishmentNumber",
    "school.ukprn",
    "school.type",
    "school.status",
    "school.openDate",
    "school.closeDate",
    "school.website",
    "school.telephone",
    "school.email",
    "school.headteacher",
    "school.headteacherTitle",
    "school.trustName",
    "school.trustCode",
    "school.localAuthority",
    "school.parliamentaryConstituency",
    "school.ward",
    "school.region",
  ],
  Stats: [
    "school.stats.pupils",
    "school.stats.male",
    "school.stats.female",
    "school.stats.fsmPct",
    "school.stats.y11Students",
    "school.stats.y7Students",
    "school.stats.y8Students",
    "school.stats.y9Students",
    "school.stats.y10Students",
    "school.stats.sixthFormStudents",
    "school.stats.pupilCapacity",
    "school.stats.teacherCount",
    "school.stats.teacherFte",
    "school.stats.taCount",
    "school.stats.taFte",
    "school.stats.pupilTeacherRatio",
    "school.stats.meanClassSize",
    "school.stats.senWithStatement",
    "school.stats.senWithoutStatement",
    "school.stats.englishNotFirstLanguage",
    "school.stats.ethnicityWhiteBritish",
    "school.stats.ethnicityOther",
  ],
  Detail: [
    "school.detail.laName",
    "school.detail.phase",
    "school.detail.gender",
    "school.detail.religiousCharacter",
    "school.detail.admissionsPolicy",
    "school.detail.ageRangeLow",
    "school.detail.ageRangeHigh",
    "school.detail.nurseryProvision",
    "school.detail.sixthFormProvision",
    "school.detail.boarders",
    "school.detail.specialClasses",
    "school.detail.urbanRural",
  ],
  Address: [
    "school.address.street",
    "school.address.locality",
    "school.address.town",
    "school.address.county",
    "school.address.postcode",
    "school.address.country",
    "school.address.easting",
    "school.address.northing",
    "school.address.latitude",
    "school.address.longitude",
  ],
  Ofsted: [
    "school.ofsted.overall",
    "school.ofsted.lastInspectionDate",
    "school.ofsted.nextInspectionDate",
    "school.ofsted.qualityOfEducation",
    "school.ofsted.behaviourAndAttitudes",
    "school.ofsted.personalDevelopment",
    "school.ofsted.leadershipAndManagement",
    "school.ofsted.earlyYearsProvision",
    "school.ofsted.sixthFormProvision",
    "school.ofsted.safeguarding",
    "school.ofsted.previousOverall",
    "school.ofsted.previousInspectionDate",
    "ofstedBehaviourAttitudeLastInspection_Mapped",
    "ofstedBehaviourAttitudeLevelAssuranceOF_Mapped",
    "ofstedOverallEffectivenessSEFGradeOF_Mapped",
    "ofstedQualityOfEducationLevelOfAssuranceOF_Mapped",
  ],
  National: [
    "school.national.yearM1SecondaryFSM",
    "school.national.progress8",
    "school.national.attainment8",
    "school.national.ebacc",
    "school.national.ebaccAPS",
    "school.national.englishMathsGrade5",
    "school.national.englishMathsGrade4",
    "school.national.stayingInEducation",
    "school.national.destinations",
  ],
  Attendance: [
    "school.attendance.overall",
    "school.attendance.authorised",
    "school.attendance.unauthorised",
    "school.attendance.persistentAbsence",
    "school.attendance.severeAbsence",
    "school.attendance.exclusions",
    "school.attendance.suspensions",
    "school.attendance.permanentExclusions",
    "school.attendance.lateArrival",
    "school.attendance.missedSessions",
  ],
  Finance: [
    "school.finance.totalIncome",
    "school.finance.totalExpenditure",
    "school.finance.revenueReserve",
    "school.finance.perPupilFunding",
    "school.finance.staffCosts",
    "school.finance.teachingStaffCosts",
    "school.finance.supplyStaffCosts",
    "school.finance.premisesCosts",
    "school.finance.educationalSupplies",
    "school.finance.energyCosts",
    "school.finance.cateringCosts",
  ],
  Workforce: [
    "school.workforce.headcountTeachers",
    "school.workforce.fteTeachers",
    "school.workforce.headcountTAs",
    "school.workforce.fteTAs",
    "school.workforce.headcountAdmin",
    "school.workforce.fteAdmin",
    "school.workforce.vacancies",
    "school.workforce.turnoverRate",
    "school.workforce.absenceRate",
    "school.workforce.qualifiedTeachers",
  ],
  Performance: [
    "school.performance.ks2Reading",
    "school.performance.ks2Writing",
    "school.performance.ks2Maths",
    "school.performance.ks2Combined",
    "school.performance.ks4Progress8",
    "school.performance.ks4Attainment8",
    "school.performance.ks4EnglishMaths",
    "school.performance.ks4EBacc",
    "school.performance.ks5ALevel",
    "school.performance.ks5Academic",
    "school.performance.ks5Applied",
  ],
}

// Sample document content for display
const sampleDocumentContent = [
  { title: "The 'Double Serialisation' Failure", page: 16 },
  { title: "RESTful Resource Naming (Resource vs. Action)", page: 16 },
  { title: "Implementation Standards", page: 17, indent: 0 },
  { title: "The RESTful Verb Breakdown", page: 17, indent: 1 },
  { title: "Standardising Query Parameters", page: 19 },
  { title: "Secrets & Configuration Management", page: 19 },
  { title: "Image & Asset Optimisation", page: 19 },
  { title: "Database Migrations – Version Control", page: 20 },
  { title: "Git Branching & Standards", page: 21 },
  { title: "Branch Naming Convention", page: 21, indent: 1 },
  { title: "The Workflow: Trunk-Based Development", page: 21, indent: 1 },
  { title: "Commit & Merge Standards", page: 22, indent: 1 },
  { title: "Definition of Done (DoD)", page: 22 },
]

interface DocumentEditorProps {
  documentName: string
  onExit: () => void
  onSave: () => void
}

export function DocumentEditor({ documentName, onExit, onSave }: DocumentEditorProps) {
  const [zoom, setZoom] = useState(100)
  const [activeTab, setActiveTab] = useState<"Home" | "Layout" | "Insert">("Home")
  const [selectedStyle, setSelectedStyle] = useState("Normal Text")
  const [selectedFont, setSelectedFont] = useState("Aptos")
  const [selectedFontSize, setSelectedFontSize] = useState("12")
  const [showStyleDropdown, setShowStyleDropdown] = useState(false)
  const [showFontDropdown, setShowFontDropdown] = useState(false)
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false)
  
  // Template variables sidebar state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const sectionNames = Object.keys(templateVariables)

  // Filter sections by search query
  const filteredSections = searchQuery
    ? sectionNames.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : sectionNames

  // If a section is selected, filter its variables too
  const sectionVariables = selectedSection
    ? (templateVariables[selectedSection] ?? []).filter((v) =>
        searchQuery ? v.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
    : []

  const styles = ["Normal Text", "Heading 1", "Heading 2", "Heading 3", "Title", "Subtitle"]
  const fonts = ["Aptos", "Arial", "Calibri", "Times New Roman", "Verdana", "Georgia"]
  const fontSizes = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "72"]

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50))

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Top Bar - Editor Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
            <span className="text-sm text-slate-600 min-w-[50px]">{zoom}%</span>
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-100 rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-100 rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Document Title */}
          <span className="text-sm text-slate-700 font-medium">
            {documentName || "Untitled Document"}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8">
          {(["Home", "Layout", "Insert"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-slate-100 rounded" title="Search">
            <Search className="w-4 h-4 text-slate-500" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded" title="Print">
            <Printer className="w-4 h-4 text-slate-500" />
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded">
            <FolderOpen className="w-4 h-4" />
            Open file
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded" title="Embed">
            <Code className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded"
          >
            Exit
          </button>
          <Button
            onClick={onSave}
            className="text-white"
            style={{ backgroundColor: NAVY }}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-slate-200">
        {/* Style Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStyleDropdown(!showStyleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded hover:border-slate-400 min-w-[120px] text-sm"
          >
            <span className="truncate">{selectedStyle}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
          </button>
          {showStyleDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-[150px]">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    setSelectedStyle(style)
                    setShowStyleDropdown(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                >
                  {style}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFontDropdown(!showFontDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded hover:border-slate-400 min-w-[100px] text-sm"
          >
            <span className="truncate">{selectedFont}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
          </button>
          {showFontDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 min-w-[150px]">
              {fonts.map((font) => (
                <button
                  key={font}
                  onClick={() => {
                    setSelectedFont(font)
                    setShowFontDropdown(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded hover:border-slate-400 min-w-[60px] text-sm"
          >
            <span>{selectedFontSize}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
          </button>
          {showFontSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto min-w-[60px]">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedFontSize(size)
                    setShowFontSizeDropdown(false)
                  }}
                  className="block w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Text Formatting */}
        <button className="p-2 hover:bg-slate-100 rounded">
          <Bold className="w-4 h-4 text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded">
          <Italic className="w-4 h-4 text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded">
          <Underline className="w-4 h-4 text-slate-600" />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Text Color */}
        <button className="p-2 hover:bg-slate-100 rounded flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-slate-800" />
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Lists */}
        <button className="p-2 hover:bg-slate-100 rounded flex items-center gap-0.5">
          <List className="w-4 h-4 text-slate-600" />
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded flex items-center gap-0.5">
          <ListOrdered className="w-4 h-4 text-slate-600" />
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Alignment */}
        <button className="p-2 bg-slate-100 rounded border border-slate-300">
          <AlignLeft className="w-4 h-4 text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded">
          <AlignCenter className="w-4 h-4 text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded">
          <AlignRight className="w-4 h-4 text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded">
          <AlignJustify className="w-4 h-4 text-slate-600" />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Indentation */}
        <button className="p-2 hover:bg-slate-100 rounded">
          <Outdent className="w-4 h-4 text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded">
          <Indent className="w-4 h-4 text-slate-600" />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Paragraph Mark */}
        <button className="p-2 hover:bg-slate-100 rounded">
          <Pilcrow className="w-4 h-4 text-slate-600" />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Undo/Redo */}
        <button className="p-2 hover:bg-slate-100 rounded">
          <Undo className="w-4 h-4 text-slate-400" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded">
          <Redo className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Template Variables Sidebar */}
        <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col">

          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex-shrink-0">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">Template Variables</h2>

            {/* Section Dropdown */}
            <div className="relative mb-3" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm border border-slate-200 rounded-md hover:border-slate-300 transition-colors bg-white"
              >
                <span className={selectedSection ? "text-slate-900 font-medium" : "text-slate-400"}>
                  {selectedSection ?? "Select a section..."}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                  {sectionNames.map((section) => (
                    <button
                      key={section}
                      onClick={() => {
                        setSelectedSection(section)
                        setSearchQuery("")
                        setDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${
                        selectedSection === section ? "bg-slate-50 font-medium" : ""
                      }`}
                    >
                      <span style={{ color: selectedSection === section ? NAVY : undefined }}>
                        {section}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {templateVariables[section].length}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search — only shown when a section is selected */}
            {selectedSection && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search in ${selectedSection}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Variables list */}
          <div className="flex-1 overflow-y-auto">
            {!selectedSection ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm text-center px-6 gap-2">
                <ChevronDown className="w-8 h-8 text-slate-300" />
                Select a section above to browse its data points
              </div>
            ) : sectionVariables.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm px-4">
                No variables matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              sectionVariables.map((variable) => (
                <button
                  key={variable}
                  onClick={() => navigator.clipboard.writeText(`{{${variable}}}`)}
                  title={`Click to copy {{${variable}}}`}
                  className="w-full text-left px-4 py-2.5 border-b border-slate-100 text-sm hover:bg-slate-50 transition-colors"
                  style={{ color: ACCENT }}
                >
                  {variable}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Document Canvas */}
        <div className="flex-1 overflow-auto p-8 bg-slate-200">
          <div
            className="mx-auto bg-white shadow-lg"
            style={{
              width: `${(816 * zoom) / 100}px`,
              minHeight: `${(1056 * zoom) / 100}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          >
            {/* Page 1 */}
            <div className="p-16" style={{ minHeight: "1056px" }}>
              {/* Table of Contents style content */}
              <div className="space-y-2">
                {sampleDocumentContent.slice(0, 6).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-2"
                    style={{ paddingLeft: item.indent ? `${item.indent * 24}px` : "0" }}
                  >
                    <span className="text-sm text-slate-800 shrink-0">{item.title}</span>
                    <span className="flex-1 border-b border-dotted border-slate-400 mb-1" />
                    <span className="text-sm text-slate-800 shrink-0">{item.page}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Page 2 */}
          <div
            className="mx-auto bg-white shadow-lg mt-8"
            style={{
              width: `${(816 * zoom) / 100}px`,
              minHeight: `${(1056 * zoom) / 100}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          >
            <div className="p-16" style={{ minHeight: "1056px" }}>
              <div className="space-y-2">
                {sampleDocumentContent.slice(6).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-2"
                    style={{ paddingLeft: item.indent ? `${item.indent * 24}px` : "0" }}
                  >
                    <span className="text-sm text-slate-800 shrink-0">{item.title}</span>
                    <span className="flex-1 border-b border-dotted border-slate-400 mb-1" />
                    <span className="text-sm text-slate-800 shrink-0">{item.page}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
