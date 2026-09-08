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
  CheckCircle2,
  Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { InfoTooltip } from "@/components/ui/info-tooltip"

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

type Question = { id: string; label: string }
type Section = {
  id: string
  label: string
  level: 0 | 1
  badge?: string
  questions: Question[]
}

// A representative filled-in form structure for the builder.
const SECTIONS: Section[] = [
  { id: "report-header", label: "Report Header", level: 0, questions: [] },
  {
    id: "exec-summary",
    label: "1. Executive Summary from the Headteacher/Head of School",
    level: 0,
    questions: [
      { id: "q-religion-life", label: "{setting:religion} Life" },
      { id: "q-religious-education", label: "Religious Education" },
    ],
  },
  {
    id: "impact-support",
    label: "2. Impact of Support from the Trust",
    level: 0,
    questions: [{ id: "q-impact-overview", label: "Overview of support received" }],
  },
  { id: "ht-forums", label: "Headteacher Forums", level: 1, badge: "T2", questions: [] },
  { id: "school-improvement", label: "School Improvement Visits", level: 1, badge: "T2", questions: [] },
  { id: "dsl-meetings", label: "DSL network meetings", level: 1, badge: "T2", questions: [] },
  { id: "chairs-forum", label: "Chairs Forum", level: 1, badge: "T2", questions: [] },
]

export function FormBuilder() {
  const router = useRouter()
  const [formLevelMat, setFormLevelMat] = useState(false)
  const [name, setName] = useState("Head Report (24/25) - Gaz")
  const [description, setDescription] = useState("Head teacher report")
  const [period, setPeriod] = useState("Open")
  const [settingsOpen, setSettingsOpen] = useState(true)

  const [activeSectionId, setActiveSectionId] = useState("exec-summary")
  const [editorValues, setEditorValues] = useState<Record<string, string>>({})

  const activeSection = SECTIONS.find((s) => s.id === activeSectionId) ?? SECTIONS[0]

  return (
    <div className="flex h-full gap-4">
      {/* Left builder panel */}
      <div className="w-80 flex-shrink-0 overflow-y-auto rounded-lg border border-slate-200 bg-white">
        <div className="space-y-5 p-4">
          {/* Form settings card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/70">
            {/* Summary header — click to expand/collapse the setup fields */}
            <button
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
              aria-expanded={settingsOpen}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{name || "Untitled form"}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <span>{formLevelMat ? "MAT" : "School"}</span>
                  <span aria-hidden="true">·</span>
                  <span>{period}</span>
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${
                  settingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {settingsOpen && (
              <div className="space-y-3 border-t border-slate-200 px-3 pb-3 pt-3">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter form name..." />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Description</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description..."
                  />
                </div>

                {/* Form Level + Period on one row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">Form Level</label>
                    <div className="inline-flex w-full rounded-md border border-slate-300 bg-white p-0.5">
                      {(["School", "MAT"] as const).map((level) => {
                        const active = (level === "MAT") === formLevelMat
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFormLevelMat(level === "MAT")}
                            className={`flex-1 rounded px-2 py-1.5 text-xs font-medium transition-colors ${
                              active ? "bg-[#33295e] text-white" : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {level}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">Period</label>
                    <div className="relative">
                      <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#33295e]"
                      >
                        {PERIOD_OPTIONS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions — always visible */}
            <div className="flex gap-2 border-t border-slate-200 px-3 py-2.5">
              <Button
                variant="outline"
                onClick={() => router.push("/settings/form-creation")}
                className="flex-1 border-slate-200 text-slate-600 transition-colors hover:border-[#33295e] hover:bg-[#33295e] hover:text-white"
              >
                Return to List
              </Button>
              <Button className="flex-1 bg-[#33295e] text-white transition-colors hover:bg-[#fd6d6d]">
                Save Form
              </Button>
            </div>
          </div>

          {/* Report Sections */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <h3 className="text-lg font-bold text-slate-900">Report Sections</h3>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-200 text-slate-600 transition-colors hover:border-[#33295e] hover:bg-[#33295e] hover:text-white"
            >
              New Section
            </Button>
          </div>

          {/* Section list */}
          <ul className="space-y-1">
            {SECTIONS.map((section) => {
              const isActive = section.id === activeSectionId
              return (
                <li key={section.id}>
                  <div
                    className={`flex items-center gap-2 rounded-md py-2 pr-2 transition-colors ${
                      section.level === 1 ? "pl-8" : "pl-2"
                    } ${isActive ? "bg-[#33295e]/5 ring-1 ring-[#33295e]/15" : "hover:bg-slate-50"}`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSectionId(section.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      {isActive ? (
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 flex-shrink-0 text-slate-300" />
                      )}
                      <span
                        className={`truncate text-sm ${
                          isActive ? "font-semibold text-[#33295e]" : "text-slate-700"
                        }`}
                      >
                        {section.label}
                      </span>
                    </button>
                    {section.badge && (
                      <span className="flex-shrink-0 rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                        {section.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Settings for ${section.label}`}
                      className="flex-shrink-0 text-slate-400 transition-colors hover:text-slate-700"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${section.label}`}
                      className="flex-shrink-0 text-slate-400 transition-colors hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
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

        {/* Active section heading */}
        <h2 className="mb-5 text-2xl font-bold text-slate-900">{activeSection.label}</h2>

        {/* Question blocks */}
        {activeSection.questions.length > 0 ? (
          <div className="space-y-8">
            {activeSection.questions.map((question) => (
              <div key={question.id}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{question.label}</span>
                    <InfoTooltip
                      content="Provide guidance for how this question should be answered."
                      variant="monochrome"
                    />
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
                <RichTextEditor
                  value={editorValues[question.id] ?? ""}
                  onChange={(val) => setEditorValues((prev) => ({ ...prev, [question.id]: val }))}
                  placeholder=""
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 py-16 text-center text-sm text-slate-400">
            No questions yet. Add one using the toolbar above.
          </div>
        )}
      </div>
    </div>
  )
}
