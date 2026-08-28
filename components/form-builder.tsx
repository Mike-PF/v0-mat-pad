"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Type,
  ImageIcon,
  Baseline,
  Hash,
  Minus,
  Check,
  Calendar,
  Palette,
  List,
  BarChart3,
  ChevronDown,
  GripVertical,
  Trash2,
  Settings,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { InfoTooltip } from "@/components/ui/info-tooltip"

const SECTION_OPTIONS = [
  "Academy Vision",
  "Introduction to the Report",
  "Self-Evaluation",
  "Statutory Assessments",
  "Key Priorities",
  "Targets",
  "Safeguarding",
]

const PERIOD_OPTIONS = ["Open", "Termly", "Half Termly", "Monthly"]

// Question-type buttons rendered across the top of the editor pane.
const QUESTION_TYPES = [
  { id: "text", label: "Rich text", icon: Type },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "short-text", label: "Short text", icon: Baseline },
  { id: "number", label: "Number", icon: Hash },
  { id: "divider", label: "Divider", icon: Minus },
  { id: "checkbox", label: "Checkbox", icon: Check },
  { id: "date", label: "Date", icon: Calendar },
  { id: "rag", label: "RAG rating", icon: Palette },
  { id: "list", label: "List", icon: List },
  { id: "chart", label: "Chart", icon: BarChart3 },
]

export function FormBuilder() {
  const router = useRouter()
  const [formLevelMat, setFormLevelMat] = useState(false)
  const [name, setName] = useState("Headteacher's Report - Educational")
  const [description, setDescription] = useState("St. Joseph's Headteach report")
  const [sectionName, setSectionName] = useState("")
  const [period, setPeriod] = useState("")

  const [sectionTitle, setSectionTitle] = useState("Academy Vision")
  const [editorValue, setEditorValue] = useState("")


  return (
    <div className="flex h-full gap-4">
      {/* Left builder panel */}
      <div className="w-80 flex-shrink-0 overflow-y-auto rounded-lg border border-slate-200 bg-white">
        <div className="space-y-5 p-4">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter form name..." />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
            />
          </div>

          {/* Form Level */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Form Level</label>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${!formLevelMat ? "font-medium text-slate-900" : "text-slate-400"}`}
              >
                School
              </span>
              <button
                type="button"
                onClick={() => setFormLevelMat((v) => !v)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  formLevelMat ? "bg-[#33295e]" : "bg-slate-300"
                }`}
                aria-label="Toggle form level"
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                    formLevelMat ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
              {formLevelMat && <span className="text-sm font-medium text-slate-900">MAT</span>}
            </div>
          </div>

          {/* Section Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Section Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#33295e]"
              >
                <option value="">Select Section</option>
                {SECTION_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {/* Period */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Period</label>
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#33295e]"
              >
                <option value="">Select Period</option>
                {PERIOD_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/settings/form-creation")}
              className="border-slate-200 text-slate-600 transition-colors hover:bg-[#33295e] hover:text-white hover:border-[#33295e]"
            >
              Back
            </Button>
            <Button className="bg-[#33295e] text-white transition-colors hover:bg-[#fd6d6d]">Save Form</Button>
          </div>

          {/* Report Sections */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <h3 className="text-lg font-bold text-slate-900">Report Sections</h3>
            <Button size="sm" className="gap-1.5 bg-[#33295e] text-white transition-colors hover:bg-[#fd6d6d]">
              <Plus className="h-4 w-4" />
              New Section
            </Button>
          </div>
        </div>
      </div>

      {/* Right editor panel */}
      <div className="min-w-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4">
        {/* Question-type toolbar */}
        <div className="mb-4 flex flex-wrap gap-2">
          {QUESTION_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              title={label}
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-[#33295e] hover:bg-[#33295e] hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>

        {/* Section editor */}
        <div className="rounded-lg border border-slate-200 p-5">
          <h2 className="mb-5 text-xl font-bold text-slate-900">{sectionTitle || "Untitled Section"}</h2>

          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">{sectionTitle || "Untitled"}</span>
              <InfoTooltip content="Provide guidance for how this question should be answered." variant="monochrome" />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Drag to reorder"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete question"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-red-300 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Question settings"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          <RichTextEditor value={editorValue} onChange={setEditorValue} placeholder="" />
        </div>
      </div>
    </div>
  )
}
