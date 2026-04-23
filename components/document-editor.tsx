"use client"

import { useState } from "react"
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
  Indent,
  Outdent,
  Pilcrow,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const ACCENT = "hsl(314 100% 35%)"
const NAVY = "#121051"

// Template variables organized by category
const templateVariables = {
  School: ["logo", "school.name", "school.urn"],
  Stats: [
    "school.stats.pupils",
    "school.stats.male",
    "school.stats.female",
    "school.stats.fsmPct",
    "school.stats.y11Students",
  ],
  Detail: ["school.detail.laName", "school.detail.phase"],
  Address: ["school.address.town"],
  Ofsted: [
    "school.ofsted.overall",
    "ofstedBehaviourAttitudeLastInspection_Mapped",
    "ofstedBehaviourAttitudeLevelAssuranceOF_Mapped",
    "ofstedOverallEffectivenessSEFGradeOF_Mapped",
    "ofstedQualityOfEducationLevelOfAssuranceOF_Mapped",
  ],
  National: ["school.national.yearM1SecondaryFSM"],
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
        <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Template Variables</h2>

            {Object.entries(templateVariables).map(([category, variables]) => (
              <div key={category} className="mb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2 pb-2 border-b border-slate-200">
                  {category}
                </h3>
                <div className="space-y-1">
                  {variables.map((variable) => (
                    <button
                      key={variable}
                      className="block w-full text-left text-sm py-1 px-1 rounded hover:bg-slate-50 transition-colors"
                      style={{ color: ACCENT }}
                      onClick={() => {
                        // Copy variable to clipboard or insert into document
                        navigator.clipboard.writeText(`{{${variable}}}`)
                      }}
                      title={`Click to copy {{${variable}}}`}
                    >
                      {variable}
                    </button>
                  ))}
                </div>
              </div>
            ))}
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
