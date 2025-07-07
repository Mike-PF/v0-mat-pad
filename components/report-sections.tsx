"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react"

interface Section {
  id: string
  title: string
  hasActions?: boolean
}

export function ReportSections() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const sections: Section[] = [
    { id: "academy-vision", title: "Academy Vision" },
    { id: "introduction", title: "Introduction to the Report" },
    { id: "self-evaluation", title: "Self-Evaluation" },
    { id: "statutory-assessments", title: "Statutory Assessments" },
    { id: "key-priorities-1", title: "Key Priorities", hasActions: true },
    { id: "targets", title: "Targets" },
    { id: "catholic-life", title: "Catholic Life, Religious Education and Collective Worship" },
    { id: "curriculum", title: "Primary Curriculum Implementation" },
    { id: "educational-visits", title: "Educational Visits" },
    { id: "professional-development", title: "Professional Development" },
    { id: "safeguarding", title: "Safeguarding" },
    { id: "behaviour", title: "Behaviour" },
    { id: "bullying", title: "Bullying" },
    { id: "send", title: "Special Educational Needs and Disabilities" },
    { id: "protected-characteristics", title: "Incidents relating to Protected Characteristics" },
    { id: "suspensions", title: "Suspensions and Exclusions" },
    { id: "attendance", title: "Attendance" },
    { id: "punctuality", title: "Punctuality" },
    { id: "additional", title: "Additional", hasActions: true },
    { id: "key-priorities-2", title: "Key Priorities", hasActions: true },
    { id: "key-priorities-3", title: "Key Priorities", hasActions: true },
    { id: "key-priorities-4", title: "Key Priorities", hasActions: true },
    { id: "key-priorities-5", title: "Key Priorities", hasActions: true },
  ]

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <section className="h-full overflow-y-auto">
      <div className="space-y-2">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id)

          return (
            <div key={section.id} className="border border-slate-200 rounded-lg bg-white">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center flex-1">
                  <h3 className="font-medium text-left">{section.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {section.hasActions && (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="p-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
                        title="Add"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
                        title="Remove answers"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-100">
                  <div className="pt-4 text-slate-600">
                    <p>Content for {section.title} would go here...</p>
                    <div className="mt-4 p-4 bg-slate-50 rounded border-2 border-dashed border-slate-300 text-center text-slate-500">
                      Form fields and content editor would be implemented here
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
