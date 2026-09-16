"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Circle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RAGPicker } from "@/components/ui/rag-picker"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// -------------------------------------------------------------------------
// Mock data — the "document" of data blocks that a form is built from. Each
// block carries the shared (central) value that every school inherits by
// default; overriding a block replaces that value for the selected school
// only. Wire this to real form/data-block sources when available.
// -------------------------------------------------------------------------

const FORMS = [
  "Headteacher's Report - Educational",
  "Headteacher's Report - Financial",
  "Annual Report",
  "Self-Evaluation Form",
]

const SCHOOLS = [
  "Holy Family Catholic Academy",
  "St. Mary's Primary School",
  "Sacred Heart Academy",
  "St. Joseph's School",
]

type BlockType = "text" | "number" | "percent" | "date" | "rag"

interface DataBlock {
  id: string
  label: string
  type: BlockType
  /** Shared value inherited from central data. */
  shared: string
  info?: string
}

interface DocSection {
  id: string
  title: string
  blocks: DataBlock[]
}

const DOCUMENT: DocSection[] = [
  {
    id: "school-details",
    title: "School Details",
    blocks: [
      {
        id: "school-name",
        label: "School name",
        type: "text",
        shared: "{setting:name}",
        info: "The registered name of the school as it appears on the report cover.",
      },
      { id: "headteacher", label: "Headteacher", type: "text", shared: "{setting:headteacher}" },
      { id: "dfe-number", label: "DfE establishment number", type: "text", shared: "{setting:dfe}" },
      {
        id: "last-ofsted",
        label: "Last Ofsted inspection",
        type: "date",
        shared: "2023-11-14",
        info: "Date of the most recent Ofsted inspection.",
      },
      {
        id: "overall-effectiveness",
        label: "Overall effectiveness",
        type: "rag",
        shared: "green",
        info: "RAG rating summarising the trust's view of overall effectiveness.",
      },
    ],
  },
  {
    id: "demographics",
    title: "Roll & Demographics",
    blocks: [
      { id: "number-on-roll", label: "Number on roll", type: "number", shared: "412" },
      { id: "pupil-premium", label: "Pupil premium", type: "percent", shared: "28" },
      { id: "eal", label: "English as an additional language", type: "percent", shared: "19" },
      { id: "send", label: "SEND support", type: "percent", shared: "14" },
    ],
  },
  {
    id: "attendance",
    title: "Attendance",
    blocks: [
      {
        id: "overall-attendance",
        label: "Overall attendance",
        type: "percent",
        shared: "96.2",
        info: "Whole-school attendance for the reporting period.",
      },
      { id: "persistent-absence", label: "Persistent absence", type: "percent", shared: "8.4" },
      { id: "authorised-absence", label: "Authorised absence", type: "percent", shared: "3.1" },
    ],
  },
  {
    id: "assessment",
    title: "Key Stage 2 Assessment",
    blocks: [
      { id: "ks2-reading", label: "Reading at expected standard", type: "percent", shared: "74" },
      { id: "ks2-writing", label: "Writing at expected standard", type: "percent", shared: "69" },
      { id: "ks2-maths", label: "Maths at expected standard", type: "percent", shared: "77" },
    ],
  },
]

const TYPE_LABEL: Record<BlockType, string> = {
  text: "Text",
  number: "Number",
  percent: "Percentage",
  date: "Date",
  rag: "RAG rating",
}

const ALL_BLOCKS = DOCUMENT.flatMap((s) => s.blocks)

export function DataOverridesContent() {
  const [selectedForm, setSelectedForm] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [activeSection, setActiveSection] = useState(DOCUMENT[0].id)

  // Override values keyed by block id. A key being present means the block is
  // overridden for this school; its value replaces the shared value.
  const [overrides, setOverrides] = useState<Record<string, string>>({})

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const isReady = Boolean(selectedForm && selectedSchool)

  // Reset overrides whenever the form or school selection changes.
  useEffect(() => {
    setOverrides({})
    setActiveSection(DOCUMENT[0].id)
  }, [selectedForm, selectedSchool])

  // Track the section currently in view for the left-hand navigation.
  useEffect(() => {
    if (!isReady) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.4, rootMargin: "-80px 0px -60% 0px" },
    )
    Object.values(sectionRefs.current).forEach((ref) => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [isReady])

  const overriddenCount = useMemo(
    () => ALL_BLOCKS.filter((b) => overrides[b.id] !== undefined).length,
    [overrides],
  )

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" })
    setActiveSection(id)
  }

  const isOverridden = (id: string) => overrides[id] !== undefined

  const toggleOverride = (block: DataBlock) => {
    setOverrides((prev) => {
      const next = { ...prev }
      if (block.id in next) {
        delete next[block.id]
      } else {
        // Seed the override with the shared value so editing starts from it.
        next[block.id] = block.shared
      }
      return next
    })
  }

  const setOverrideValue = (id: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [id]: value }))
  }

  const clearForm = () => {
    setSelectedForm("")
    setSelectedSchool("")
    setOverrides({})
    setActiveSection(DOCUMENT[0].id)
  }

  const sectionOverrideCount = (section: DocSection) =>
    section.blocks.filter((b) => isOverridden(b.id)).length

  return (
    <div className="flex h-full gap-4">
      {/* Left panel: form + school pickers and section navigation */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white border border-slate-200 rounded-lg h-full flex flex-col">
          <div className="p-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-slate-900">Data Overrides</h3>
              {(selectedForm || selectedSchool) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearForm}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 bg-transparent"
                >
                  Clear Form
                </Button>
              )}
            </div>

            <div className="space-y-4 mt-4">
              {/* Form selector */}
              <div className="relative">
                <select
                  value={selectedForm}
                  onChange={(e) => setSelectedForm(e.target.value)}
                  className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white text-sm appearance-none accent-[#33295e] focus:outline-none focus:ring-2 focus:ring-[#33295e] focus:border-[#33295e]"
                >
                  <option value="">Please select a form...</option>
                  {FORMS.map((form) => (
                    <option key={form} value={form}>
                      {form}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* School selector */}
              <div className="relative">
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white text-sm appearance-none accent-[#33295e] focus:outline-none focus:ring-2 focus:ring-[#33295e] focus:border-[#33295e]"
                >
                  <option value="">Please select a school...</option>
                  {SCHOOLS.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Section navigation — only once a form and school are chosen */}
          {isReady && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-4 border-b border-slate-200 flex-shrink-0">
                <h3 className="font-semibold text-lg text-slate-900">Data Blocks</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {overriddenCount} of {ALL_BLOCKS.length} overridden
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                <nav className="p-2">
                  {DOCUMENT.map((section) => {
                    const count = sectionOverrideCount(section)
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 hover:bg-slate-50 mb-1",
                          activeSection === section.id && "bg-blue-50 border border-blue-200",
                        )}
                      >
                        {count > 0 ? (
                          <CheckCircle className="w-4 h-4 text-[#33295e] flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              "font-medium text-sm truncate",
                              activeSection === section.id ? "text-blue-900" : "text-slate-900",
                            )}
                          >
                            {section.title}
                          </div>
                        </div>
                        {count > 0 && (
                          <span className="flex-shrink-0 inline-flex items-center rounded-full bg-[#33295e] px-2 py-0.5 text-xs font-medium text-white">
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div ref={scrollRef} className="min-w-0 flex-1 overflow-y-auto">
        {isReady ? (
          <div className="space-y-6 pb-20">
            {/* Context banner */}
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-1">
              <div>
                <p className="text-xs text-slate-500">Form</p>
                <p className="text-sm font-semibold text-slate-900">{selectedForm}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">School</p>
                <p className="text-sm font-semibold text-slate-900">{selectedSchool}</p>
              </div>
              <div className="ml-auto">
                <Button className="bg-[#33295e] text-white hover:bg-[#fd6d6d]" disabled={overriddenCount === 0}>
                  Save overrides
                </Button>
              </div>
            </div>

            {DOCUMENT.map((section) => (
              <Card
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el
                }}
                className="scroll-mt-4"
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.blocks.map((block) => {
                    const overridden = isOverridden(block.id)
                    return (
                      <div
                        key={block.id}
                        className={cn(
                          "rounded-lg border p-4 transition-colors",
                          overridden ? "border-[#33295e]/40 bg-[#33295e]/5" : "border-slate-200 bg-white",
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-slate-900">{block.label}</span>
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                {TYPE_LABEL[block.type]}
                              </span>
                              {overridden && (
                                <span className="inline-flex items-center rounded-full bg-[#33295e] px-2 py-0.5 text-xs font-medium text-white">
                                  Overridden
                                </span>
                              )}
                              {block.info && <InfoTooltip content={block.info} />}
                            </div>
                          </div>

                          {/* Use-shared toggle: on = shared, off = override */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-slate-500 whitespace-nowrap">Use shared value</span>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={!overridden}
                              aria-label={`Use shared value for ${block.label}`}
                              onClick={() => toggleOverride(block)}
                              className={cn(
                                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#33295e] focus:ring-offset-1",
                                !overridden ? "bg-[#33295e]" : "bg-slate-300",
                              )}
                            >
                              <span
                                className={cn(
                                  "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                                  !overridden ? "translate-x-4" : "translate-x-1",
                                )}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3">
                          {overridden ? (
                            <BlockEditor
                              block={block}
                              value={overrides[block.id] ?? ""}
                              onChange={(v) => setOverrideValue(block.id, v)}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">Shared:</span>
                              <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 font-mono">
                                {formatShared(block)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white">
            <div className="max-w-sm px-6 text-center">
              <p className="text-base font-medium text-slate-900">Select a form and school</p>
              <p className="mt-1 text-sm text-slate-500">
                Choose a form type and a school to load its data blocks, then turn off any block to override its value
                for that school.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Read-only display of the shared value, formatted by block type. */
function formatShared(block: DataBlock): string {
  if (block.type === "percent") return `${block.shared}%`
  if (block.type === "rag") return block.shared.toUpperCase()
  return block.shared
}

/** The editable control used when a block is overridden for a school. */
function BlockEditor({
  block,
  value,
  onChange,
}: {
  block: DataBlock
  value: string
  onChange: (value: string) => void
}) {
  if (block.type === "rag") {
    return <RAGPicker value={value as "red" | "amber" | "green" | ""} onChange={(v) => onChange(v)} />
  }

  if (block.type === "date") {
    return (
      <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="max-w-xs" />
    )
  }

  if (block.type === "number" || block.type === "percent") {
    return (
      <div className="relative max-w-xs">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={block.type === "percent" ? "pr-8" : ""}
        />
        {block.type === "percent" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">%</span>
        )}
      </div>
    )
  }

  return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={`Override for this school...`} />
}
