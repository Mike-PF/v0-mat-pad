"use client"

import { useMemo, useState } from "react"
import { Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PermissionAssigner, type Assignee } from "@/components/permission-assigner"
import type { PermissionTargets } from "@/components/question-section"

function Checkbox({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={cn(
        "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors",
        checked ? "border-[#33295e] bg-[#33295e] text-white" : "border-slate-300 bg-white hover:border-[#33295e]",
      )}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  )
}

interface BulkPermissionsPanelProps {
  permissionTargets: PermissionTargets
  onBulkApply: (keys: string[], assignees: Assignee[]) => void
}

export function BulkPermissionsPanel({ permissionTargets, onBulkApply }: BulkPermissionsPanelProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [applyAssignees, setApplyAssignees] = useState<Assignee[]>([])

  const allKeys = useMemo(() => {
    const keys: string[] = []
    permissionTargets.sections.forEach((section) => {
      keys.push(`section:${section.id}`)
      section.questions.forEach((question) => keys.push(`question:${question.id}`))
    })
    return keys
  }, [permissionTargets])

  const allSelected = allKeys.length > 0 && allKeys.every((key) => selectedKeys.has(key))

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleSectionGroup = (section: PermissionTargets["sections"][number]) => {
    const keys = [`section:${section.id}`, ...section.questions.map((q) => `question:${q.id}`)]
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      const allOn = keys.every((k) => next.has(k))
      keys.forEach((k) => (allOn ? next.delete(k) : next.add(k)))
      return next
    })
  }

  const toggleExpanded = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  const toggleSelectAll = () => {
    setSelectedKeys(allSelected ? new Set() : new Set(allKeys))
  }

  const handleApply = () => {
    if (selectedKeys.size === 0) return
    onBulkApply(Array.from(selectedKeys), applyAssignees)
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      {/* Header + apply controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Bulk permissions</h3>
          <p className="text-sm text-slate-500">Select sections or questions below, then assign roles or users.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleSelectAll}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-[#33295e] hover:text-[#33295e]"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
          <PermissionAssigner
            label="selected items"
            size="sm"
            assignees={applyAssignees}
            onChange={setApplyAssignees}
          />
          <Button
            size="sm"
            onClick={handleApply}
            disabled={selectedKeys.size === 0}
            className="bg-[#33295e] text-white hover:bg-[#2a2150] disabled:opacity-50"
          >
            Apply to {selectedKeys.size} selected
          </Button>
        </div>
      </div>

      {/* Selectable checklist — multi-column grid so it breathes */}
      <div className="grid gap-x-6 gap-y-1 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {permissionTargets.sections.map((section) => {
          const sectionKey = `section:${section.id}`
          const isExpanded = expandedSections.has(section.id)
          return (
            <div key={section.id} className="rounded-md border border-slate-100">
              <div className="flex items-center gap-2 px-2 py-2">
                <Checkbox checked={selectedKeys.has(sectionKey)} onToggle={() => toggleKey(sectionKey)} />
                <button
                  type="button"
                  onClick={() => toggleExpanded(section.id)}
                  className="flex flex-1 items-center gap-1 text-left text-sm font-medium text-slate-700"
                  aria-expanded={isExpanded}
                >
                  <ChevronRight
                    className={cn("h-3.5 w-3.5 text-slate-400 transition-transform", isExpanded && "rotate-90")}
                  />
                  <span className="truncate">{section.title}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleSectionGroup(section)}
                  className="flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-500 hover:bg-slate-100"
                >
                  {section.questions.length} Q
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 pb-1">
                  {section.questions.map((question) => {
                    const questionKey = `question:${question.id}`
                    return (
                      <div key={question.id} className="flex items-center gap-2 py-1.5 pl-8 pr-2">
                        <Checkbox checked={selectedKeys.has(questionKey)} onToggle={() => toggleKey(questionKey)} />
                        <span className="flex-1 truncate text-xs text-slate-600">{question.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
