"use client"

import { useState } from "react"
import {
  Type,
  Baseline,
  Hash,
  Calendar,
  Palette,
  RotateCcw,
  FileText,
  School as SchoolIcon,
  Save,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const NAVY = "#33295e"

// ---------------------------------------------------------------------------
// Mock data — forms, schools, and the document (sections → data blocks) that a
// form is made up of. Each block has a shared default value; a school can turn
// a block off to replace that default with its own value.
// ---------------------------------------------------------------------------

type Form = { id: string; name: string; level: "School" | "MAT" }

const FORMS: Form[] = [
  { id: "head-report", name: "Head Report (24/25) - Gaz", level: "School" },
  { id: "attendance", name: "Attendance Report Template", level: "School" },
  { id: "send", name: "SEND Provision Report", level: "School" },
  { id: "governor", name: "Governor Termly Report", level: "MAT" },
]

const SCHOOLS = [
  { urn: "138337", name: "All Saints' Catholic High School" },
  { urn: "138361", name: "Notre Dame High School" },
  { urn: "140439", name: "Sacred Heart School, A Catholic Voluntary Academy" },
  { urn: "138830", name: "St Wilfrid's Catholic Primary School" },
  { urn: "140826", name: "Emmaus Catholic and CofE Primary School" },
]

type BlockType = "richtext" | "short-text" | "number" | "date" | "rag"

type DataBlock = {
  id: string
  label: string
  type: BlockType
  /** The shared default value used unless a school overrides it. */
  defaultValue: string
  /** Short explanation shown in the info tooltip. */
  hint: string
}

type DocSection = {
  id: string
  label: string
  blocks: DataBlock[]
}

const BLOCK_META: Record<BlockType, { label: string; icon: typeof Type }> = {
  richtext: { label: "Rich text", icon: Type },
  "short-text": { label: "Short text", icon: Baseline },
  number: { label: "Number", icon: Hash },
  date: { label: "Date", icon: Calendar },
  rag: { label: "RAG rating", icon: Palette },
}

const RAG_OPTIONS: { value: string; label: string; color: string; bg: string }[] = [
  { value: "red", label: "Red", color: "#b91c1c", bg: "#fee2e2" },
  { value: "amber", label: "Amber", color: "#b45309", bg: "#fef3c7" },
  { value: "green", label: "Green", color: "#15803d", bg: "#dcfce7" },
]

// The document shape shared by every form in this demo.
const DOCUMENT: DocSection[] = [
  {
    id: "report-header",
    label: "Report Header",
    blocks: [
      {
        id: "b-school-name",
        label: "School name",
        type: "short-text",
        defaultValue: "{setting:name}",
        hint: "Pulled from the school's settings. Override to display a different name on this form.",
      },
      {
        id: "b-period",
        label: "Reporting period",
        type: "short-text",
        defaultValue: "Autumn Term 2024/25",
        hint: "The period this report covers.",
      },
      {
        id: "b-head-name",
        label: "Headteacher name",
        type: "short-text",
        defaultValue: "{setting:head}",
        hint: "Pulled from the school's settings.",
      },
    ],
  },
  {
    id: "exec-summary",
    label: "1. Executive Summary from the Headteacher/Head of School",
    blocks: [
      {
        id: "b-religion-life",
        label: "{setting:religion} Life",
        type: "richtext",
        defaultValue:
          "<p>Our school's religious life continues to flourish, with strong participation in collective worship and a shared commitment to our values across the whole community.</p>",
        hint: "Shared narrative used across all schools unless overridden.",
      },
      {
        id: "b-religious-education",
        label: "Religious Education",
        type: "richtext",
        defaultValue:
          "<p>RE outcomes remain strong across all key stages, with pupils demonstrating secure knowledge and thoughtful engagement with big questions.</p>",
        hint: "Default RE summary. Override for school-specific commentary.",
      },
    ],
  },
  {
    id: "attendance",
    label: "2. Attendance & Welfare",
    blocks: [
      {
        id: "b-overall-attendance",
        label: "Overall attendance (%)",
        type: "number",
        defaultValue: "95.4",
        hint: "Trust-wide default figure. Override with the school's actual attendance.",
      },
      {
        id: "b-persistent-absence",
        label: "Persistent absence (%)",
        type: "number",
        defaultValue: "8.2",
        hint: "Percentage of pupils persistently absent.",
      },
      {
        id: "b-attendance-rag",
        label: "Attendance RAG",
        type: "rag",
        defaultValue: "green",
        hint: "Overall attendance status indicator.",
      },
    ],
  },
  {
    id: "safeguarding",
    label: "3. Safeguarding",
    blocks: [
      {
        id: "b-safeguarding-statement",
        label: "Safeguarding statement",
        type: "richtext",
        defaultValue:
          "<p>All staff have completed annual safeguarding training and understand their responsibilities under Keeping Children Safe in Education.</p>",
        hint: "Standard statement. Override where the school needs bespoke wording.",
      },
      {
        id: "b-dsl-review-date",
        label: "Last DSL policy review",
        type: "date",
        defaultValue: "2024-09-01",
        hint: "Date the safeguarding policy was last reviewed.",
      },
    ],
  },
]

const ALL_BLOCK_IDS = DOCUMENT.flatMap((s) => s.blocks.map((b) => b.id))

// ---------------------------------------------------------------------------

type OverrideState = { value: string }

export function DataOverridesContent() {
  const [formId, setFormId] = useState<string>("")
  const [schoolUrn, setSchoolUrn] = useState<string>("")

  // Which blocks are overridden for the selected school, and their values.
  const [overrides, setOverrides] = useState<Record<string, OverrideState>>({})

  const selectedForm = FORMS.find((f) => f.id === formId)
  const selectedSchool = SCHOOLS.find((s) => s.urn === schoolUrn)
  const loaded = Boolean(selectedForm && selectedSchool)

  const overriddenCount = Object.keys(overrides).length

  // Reset overrides whenever the form or school changes — overrides are scoped
  // to a single form/school pairing.
  const resetForSelection = () => setOverrides({})

  const isOverridden = (id: string) => id in overrides

  const toggleBlock = (block: DataBlock) => {
    setOverrides((prev) => {
      const next = { ...prev }
      if (block.id in next) {
        delete next[block.id]
      } else {
        // Seed the override with the current default so the editor starts from
        // the shared value rather than a blank field.
        next[block.id] = { value: block.defaultValue }
      }
      return next
    })
  }

  const setValue = (id: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [id]: { value } }))
  }

  const schoolLabel = selectedSchool?.name ?? "this school"

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl pb-16">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Data Overrides</h1>
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
            Pick a form and a school to load its data blocks. Each block uses a shared default value — turn a block off
            to replace that value with a school-specific override.
          </p>
        </div>

        {/* Selectors */}
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <FileText className="h-3.5 w-3.5" />
                Form
              </label>
              <Select
                value={formId}
                onValueChange={(v) => {
                  setFormId(v)
                  resetForSelection()
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a form..." />
                </SelectTrigger>
                <SelectContent>
                  {FORMS.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <SchoolIcon className="h-3.5 w-3.5" />
                School
              </label>
              <Select
                value={schoolUrn}
                onValueChange={(v) => {
                  setSchoolUrn(v)
                  resetForSelection()
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a school..." />
                </SelectTrigger>
                <SelectContent>
                  {SCHOOLS.map((s) => (
                    <SelectItem key={s.urn} value={s.urn}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {!loaded && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Layers className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-700">No document loaded</p>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              Choose a form and a school above to load its data blocks and manage overrides.
            </p>
          </div>
        )}

        {/* Loaded document */}
        {loaded && (
          <>
            {/* Summary bar */}
            <div className="sticky top-0 z-10 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{selectedForm!.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Overrides for <span className="font-medium text-slate-700">{selectedSchool!.name}</span> ·{" "}
                  <span className="font-medium" style={{ color: overriddenCount > 0 ? NAVY : undefined }}>
                    {overriddenCount}
                  </span>{" "}
                  of {ALL_BLOCK_IDS.length} blocks overridden
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOverrides({})}
                  disabled={overriddenCount === 0}
                  className="gap-1.5 border-slate-200 text-slate-600 transition-colors hover:border-[#33295e] hover:bg-[#33295e] hover:text-white disabled:opacity-40"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset all
                </Button>
                <Button size="sm" className="gap-1.5 bg-[#33295e] text-white transition-colors hover:bg-[#fd6d6d]">
                  <Save className="h-3.5 w-3.5" />
                  Save overrides
                </Button>
              </div>
            </div>

            {/* Sections */}
            <div className="mt-4 space-y-4">
              {DOCUMENT.map((section) => (
                <div key={section.id} className="rounded-lg border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <h2 className="text-sm font-semibold text-slate-900">{section.label}</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {section.blocks.map((block) => (
                      <DataBlockRow
                        key={block.id}
                        block={block}
                        overridden={isOverridden(block.id)}
                        overrideValue={overrides[block.id]?.value ?? block.defaultValue}
                        schoolLabel={schoolLabel}
                        onToggle={() => toggleBlock(block)}
                        onChange={(v) => setValue(block.id, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

function DataBlockRow({
  block,
  overridden,
  overrideValue,
  schoolLabel,
  onToggle,
  onChange,
}: {
  block: DataBlock
  overridden: boolean
  overrideValue: string
  schoolLabel: string
  onToggle: () => void
  onChange: (value: string) => void
}) {
  const meta = BLOCK_META[block.type]
  const Icon = meta.icon

  return (
    <div className={overridden ? "bg-slate-50/60 px-4 py-4" : "px-4 py-4"}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              <Icon className="h-3 w-3" />
              {meta.label}
            </span>
            <span className="truncate text-sm font-medium text-slate-800">{block.label}</span>
            <InfoTooltip content={block.hint} variant="monochrome" />
            {overridden && (
              <span className="rounded-full bg-[#33295e] px-2 py-0.5 text-[10px] font-medium text-white">
                Overridden
              </span>
            )}
          </div>

          {/* Default value preview when using the shared value */}
          {!overridden && (
            <div className="mt-2">
              <p className="mb-0.5 text-[11px] uppercase tracking-wide text-slate-400">Default value</p>
              <DefaultPreview block={block} />
            </div>
          )}
        </div>

        {/* Toggle: on = use default, off = overridden */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          <button
            type="button"
            role="switch"
            aria-checked={!overridden}
            onClick={onToggle}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#33295e] focus:ring-offset-1 ${
              overridden ? "bg-slate-300" : "bg-[#33295e]"
            }`}
            aria-label={overridden ? "Enable default value" : "Override for this school"}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                overridden ? "translate-x-1" : "translate-x-4"
              }`}
            />
          </button>
          <span className="text-[10px] text-slate-400">{overridden ? "Override" : "Default"}</span>
        </div>
      </div>

      {/* Override editor */}
      {overridden && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-medium text-slate-500">
            Override value for <span className="text-slate-700">{schoolLabel}</span>
          </p>
          <OverrideField block={block} value={overrideValue} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

// A compact, read-only preview of the shared default value.
function DefaultPreview({ block }: { block: DataBlock }) {
  if (block.type === "rag") {
    const opt = RAG_OPTIONS.find((o) => o.value === block.defaultValue) ?? RAG_OPTIONS[2]
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium"
        style={{ color: opt.color, backgroundColor: opt.bg }}
      >
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: opt.color }} />
        {opt.label}
      </span>
    )
  }
  if (block.type === "richtext") {
    return (
      <div
        className="line-clamp-2 text-xs text-slate-500 [&_p]:m-0"
        dangerouslySetInnerHTML={{ __html: block.defaultValue }}
      />
    )
  }
  return <p className="text-xs text-slate-500">{block.defaultValue}</p>
}

// The editable override input, matching the block type.
function OverrideField({
  block,
  value,
  onChange,
}: {
  block: DataBlock
  value: string
  onChange: (value: string) => void
}) {
  if (block.type === "richtext") {
    return <RichTextEditor value={value} onChange={onChange} placeholder="Enter override content..." />
  }
  if (block.type === "rag") {
    return (
      <div className="flex gap-2">
        {RAG_OPTIONS.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="rounded px-3 py-1.5 text-xs font-medium transition-all"
              style={
                active
                  ? { color: opt.color, backgroundColor: opt.bg, boxShadow: `inset 0 0 0 1.5px ${opt.color}` }
                  : { color: "#64748b", backgroundColor: "#f1f5f9" }
              }
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }
  if (block.type === "number") {
    return (
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[200px]"
        placeholder="Enter value..."
      />
    )
  }
  if (block.type === "date") {
    return (
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[220px]"
      />
    )
  }
  // short-text
  return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Enter value..." />
}
