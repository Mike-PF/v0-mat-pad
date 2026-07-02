"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  Trash2,
  FileSpreadsheet,
  Download,
  MessageCircleQuestion,
  CheckCircle2,
  XCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react"
import * as XLSX from "xlsx"
import { isPlatformAdmin, CURRENT_ORG } from "@/lib/current-org"
import {
  useAiManagement,
  asksByTopic,
  asksByTopicWithinDays,
  totalAsks,
  getAreaColor,
  targetsForArea,
  REPORT_AREAS,
  filterLog,
  logToExportRows,
  formatLogDate,
  uniqueValues,
  activeCount,
  MAX_ACTIVE_QUESTIONS,
  type ChatTarget,
  type AreaPinned,
  type PinnedQuestion,
  type AskLogEntry,
  type LogFilters,
} from "@/lib/ai-chatbot"
import { reportCategories } from "@/components/reports-content"

const NAVY = "#121051"

// Sentinel for the "All reports in this area" option (Radix Select forbids "" values).
const ALL_REPORTS = "__all_reports__"

type Tab = "prompts" | "trends" | "reports"

/**
 * System reports listed on the Dashboards page, grouped by the area heading they
 * sit under. Used to scope an AI question to a single specific report.
 */
function systemReportsForArea(area: string): { id: string; name: string }[] {
  const cat = reportCategories.find((c) => c.name.toLowerCase() === area.toLowerCase())
  if (!cat) return []
  return cat.reports.filter((r) => r.isSystem).map((r) => ({ id: r.id, name: r.name }))
}

/** Find the human-readable name for a report id across all areas. */
function reportNameById(reportId: string): string {
  for (const c of reportCategories) {
    const r = c.reports.find((x) => x.id === reportId)
    if (r) return r.name
  }
  return reportId
}

export default function AiManagementPage() {
  const allowed = isPlatformAdmin()

  // Map each system report/dashboard id to its report area, so the hook can migrate
  // any legacy per-report pinned questions into the unified per-area lists.
  const reportAreaMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of reportCategories) {
      for (const r of c.reports) map[r.id] = c.name
    }
    return map
  }, [])

  const {
    mounted,
    targets,
    areaPinned,
    asks,
    log,
    pinAreaQuestion,
    updateAreaPinned,
    removeAreaPinned,
    toggleAreaPinned,
    reorderAreaScoped,
  } = useAiManagement(reportAreaMap)

  const [tab, setTab] = useState<Tab>("prompts")
  const [search, setSearch] = useState("")

  // Add / edit question dialog state. Questions attach to a report area, and can
  // optionally be scoped to one specific report within that area.
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogArea, setDialogArea] = useState<string>(REPORT_AREAS[0])
  // "" = nothing selected yet (shows the placeholder); ALL_REPORTS = all reports in
  // the area; any other value = a specific report id.
  const [dialogReport, setDialogReport] = useState<string>("")
  const [dialogIndex, setDialogIndex] = useState<number | null>(null) // null = adding new
  const [dialogText, setDialogText] = useState("")
  // Which question (area + list index) is being edited, so that if the admin changes
  // its area we can move it to the new area's list instead of editing it in place.
  const [editOrigin, setEditOrigin] = useState<{ area: string; index: number } | null>(null)

  // Delete confirm — the area + index of the question to remove.
  const [deleteConfirm, setDeleteConfirm] = useState<{ area: string; index: number } | null>(null)

  const topicGroups = useMemo(() => asksByTopic(asks), [asks])
  const grandTotal = useMemo(() => totalAsks(asks), [asks])

  // `reportId` pre-selects a dashboard (used by the per-dashboard "Add question"
  // buttons); ALL_REPORTS pre-selects the group scope.
  function openAdd(area?: string, reportId?: string) {
    setDialogArea(area ?? REPORT_AREAS[0])
    setDialogReport(reportId ?? "")
    setDialogIndex(null)
    setEditOrigin(null)
    setDialogText("")
    setDialogOpen(true)
  }

  function openEdit(area: string, index: number) {
    const item = (areaPinned[area] ?? [])[index]
    setDialogArea(area)
    setDialogReport(item?.reportId ? item.reportId : ALL_REPORTS)
    setDialogIndex(index)
    setEditOrigin({ area, index })
    setDialogText(item?.text ?? "")
    setDialogOpen(true)
  }

  // When the area changes, the previously chosen dashboard no longer applies.
  function handleDialogAreaChange(area: string) {
    setDialogArea(area)
    setDialogReport("")
  }

  function saveDialog() {
    if (!dialogText.trim() || !dialogReport) return
    // A specific dashboard is chosen only when it's a real report id — not the
    // unselected placeholder ("") and not the "All dashboards in this area" option.
    const scopedReportId = dialogReport !== "" && dialogReport !== ALL_REPORTS ? dialogReport : undefined

    if (dialogIndex === null || !editOrigin) {
      // Adding a brand-new question.
      pinAreaQuestion(dialogArea, dialogText, scopedReportId)
    } else if (editOrigin.area === dialogArea) {
      // Same area: update text + scope in place, preserving the question's order.
      updateAreaPinned(dialogArea, editOrigin.index, dialogText, scopedReportId)
    } else {
      // Moved to a different area: remove from the old area, add to the new one.
      removeAreaPinned(editOrigin.area, editOrigin.index)
      pinAreaQuestion(dialogArea, dialogText, scopedReportId)
    }

    setDialogOpen(false)
    setDialogText("")
    setDialogIndex(null)
    setEditOrigin(null)
    setDialogReport("")
  }

  if (!allowed) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4">
            <TopNavigation />
          </div>
          <main className="flex-1 flex items-center justify-center p-6">
            <Card className="max-w-md">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <h1 className="text-lg font-semibold text-slate-900 mb-1">Restricted page</h1>
                <p className="text-sm text-slate-500">
                  AI Management is only available to the Fuze platform team. You are signed in as{" "}
                  <span className="font-medium text-slate-700">{CURRENT_ORG}</span>.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "prompts", label: "Report Prompts" },
    { id: "trends", label: "Question Trends" },
    { id: "reports", label: "Reports" },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>
        <main className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="w-full">
            {/* Header */}
            <div className="flex items-start gap-3 mb-6">
              <div>
                <h1 className="text-xl font-bold text-slate-900">AI Management</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Attach AI questions to specific reports and dashboards. The chatbot tailors what it suggests on each
                  page based on what users actually ask, and you can export the full question log for reporting.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 mb-6">
              {tabs.map((t) => {
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      active
                        ? "border-[#121051] text-[#121051]"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            {!mounted ? (
              <div className="py-20 text-center text-sm text-slate-400">Loading…</div>
            ) : tab === "prompts" ? (
              <PromptsTab
                targets={targets}
                areaPinned={areaPinned}
                search={search}
                setSearch={setSearch}
                onAdd={openAdd}
                onEdit={openEdit}
                onDelete={(area, index) => setDeleteConfirm({ area, index })}
                onToggle={toggleAreaPinned}
                onReorderScoped={reorderAreaScoped}
              />
            ) : tab === "trends" ? (
              <TrendsTab topicGroups={topicGroups} grandTotal={grandTotal} targets={targets} asks={asks} log={log} />
            ) : (
              <ReportsTab log={log} />
            )}
          </div>
        </main>
      </div>

      {/* Add / edit question dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            {dialogIndex === null ? "Add a question" : "Edit question"}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Choose the report area this question belongs to, then optionally narrow it to a single report. Area
            questions are suggested across every dashboard and report in that area; a report-specific question is only
            suggested when that exact report is open.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-area">
                Report area<span className="text-red-500">*</span>
              </Label>
              <Select value={dialogArea} onValueChange={handleDialogAreaChange}>
                <SelectTrigger id="question-area">
                  <SelectValue placeholder="Select a report area…" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="question-report">
                Dashboard<span className="text-red-500">*</span>
              </Label>
              <Select value={dialogReport} onValueChange={setDialogReport}>
                <SelectTrigger id="question-report">
                  <SelectValue placeholder="Select a dashboard…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_REPORTS}>All dashboards in this area</SelectItem>
                  {systemReportsForArea(dialogArea).map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400">
                {systemReportsForArea(dialogArea).length === 0
                  ? "No system dashboards sit under this area on the Dashboards page."
                  : "Choose “All dashboards in this area” to suggest it everywhere in the area, or pick one dashboard to scope it."}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="question-text">
                Question<span className="text-red-500">*</span>
              </Label>
              <Input
                id="question-text"
                value={dialogText}
                onChange={(e) => setDialogText(e.target.value)}
                placeholder="e.g. How does our Progress 8 compare to last year?"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveDialog()
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveDialog}
                disabled={!dialogText.trim() || !dialogReport}
              className="text-white"
              style={{ backgroundColor: NAVY }}
            >
              {dialogIndex === null ? "Add question" : "Save changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Remove question?</h2>
          <p className="text-sm text-slate-500 mb-6">
            {deleteConfirm &&
              (() => {
                const item = (areaPinned[deleteConfirm.area] ?? [])[deleteConfirm.index]
                const where = item?.reportId ? reportNameById(item.reportId) : deleteConfirm.area
                return (
                  <>
                    &ldquo;{item?.text}&rdquo; will no longer be suggested on{" "}
                    <span className="font-medium text-slate-700">{where}</span>.
                  </>
                )
              })()}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm) removeAreaPinned(deleteConfirm.area, deleteConfirm.index)
                setDeleteConfirm(null)
              }}
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===========================================================================
// Tab 1 — Report Prompts
// ===========================================================================

/**
 * A reorderable list of pinned questions. The list order is the order questions
 * appear in the AI chatbot; only active ones are surfaced there, capped at
 * MAX_ACTIVE_QUESTIONS. Rows are reordered with up/down controls (matching the
 * System Help page), toggled active/inactive, clicked to edit, and removed.
 */
function QuestionList({
  questions,
  onEdit,
  onDelete,
  onToggle,
  onReorder,
  areaActive,
  hideHeader,
  hideScope,
}: {
  questions: PinnedQuestion[]
  onEdit: (index: number) => void
  onDelete: (index: number) => void
  onToggle: (index: number) => void
  onReorder: (from: number, to: number) => void
  // The active count/cap is shared across the whole area, so it can be passed in;
  // otherwise it is derived from this list alone.
  areaActive?: number
  hideHeader?: boolean
  // Hide the per-row scope chip when the whole list is a single scope (the section
  // header already states it).
  hideScope?: boolean
}) {
  const active = areaActive ?? activeCount(questions)
  const capReached = active >= MAX_ACTIVE_QUESTIONS
  const multiple = questions.length > 1

  return (
    <div className="space-y-2">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">
            {active} of {MAX_ACTIVE_QUESTIONS} active
          </span>
          {capReached && (
            <span className="text-[11px] text-slate-400">Turn one off to activate another</span>
          )}
        </div>
      )}

      {questions.map((q, i) => {
        // A question can only be switched on when under the active cap.
        const toggleDisabled = !q.active && capReached
        // Report-scoped questions are shown dashed with a chip naming the dashboard;
        // area-wide questions are solid and chipped "All dashboards".
        const scoped = !!q.reportId
        return (
          <div
            key={`${q.text}-${i}`}
            className={`group flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-left transition-colors hover:border-slate-300 ${
              scoped ? "border-dashed bg-slate-50/60" : "bg-white"
            }`}
          >
            {/* Order controls — up/down + badge, matching the System Help page */}
            {multiple && (
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onReorder(i, i - 1)}
                  disabled={i === 0}
                  className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move up"
                >
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  type="button"
                  onClick={() => onReorder(i, i + 1)}
                  disabled={i === questions.length - 1}
                  className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move down"
                >
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}

            {multiple && (
              <span className="text-xs font-medium text-slate-400 w-4 flex-shrink-0 text-center">{i + 1}</span>
            )}

            {/* Question text + scope — click to edit */}
            <button
              type="button"
              onClick={() => onEdit(i)}
              className="flex-1 min-w-0 text-left"
            >
              <span className={`block text-sm ${q.active ? "text-slate-700" : "text-slate-400"}`}>{q.text}</span>
              {!hideScope && (
                <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-slate-400">
                  {scoped ? `Only on ${reportNameById(q.reportId!)}` : "All dashboards in this area"}
                </span>
              )}
            </button>

            {!q.active && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 shrink-0">Inactive</span>
            )}

            {/* Active toggle (matches the System Help switch) */}
            <button
              type="button"
              onClick={() => onToggle(i)}
              disabled={toggleDisabled}
              className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                q.active ? "bg-[#121051]" : "bg-slate-300"
              } ${toggleDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              role="switch"
              aria-checked={q.active}
              aria-label={q.active ? "Deactivate question" : "Activate question"}
              title={toggleDisabled ? `Only ${MAX_ACTIVE_QUESTIONS} questions can be active at once` : undefined}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  q.active ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>

            {/* Remove — always visible, matching the System Help page */}
            <button
              type="button"
              onClick={() => onDelete(i)}
              className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
              aria-label="Remove question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

/**
 * An expandable per-dashboard section. When expanded it shows the area's group
 * questions first (read-only context, since they are ordered at the group level),
 * then this dashboard's own questions, which can be reordered independently of every
 * other dashboard. This is the order the chatbot uses when opened on this dashboard.
 */
function DashboardOrderSection({
  area,
  dashboard,
  groupItems,
  dashItems,
  areaActive,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onReorderScoped,
}: {
  area: string
  dashboard: { id: string; name: string }
  groupItems: PinnedQuestion[]
  dashItems: { q: PinnedQuestion; i: number }[]
  areaActive: number
  onAdd: (area?: string, reportId?: string) => void
  onEdit: (area: string, index: number) => void
  onDelete: (area: string, index: number) => void
  onToggle: (area: string, index: number) => void
  onReorderScoped: (area: string, reportId: string | undefined, from: number, to: number) => void
}) {
  const [open, setOpen] = useState(false)
  const activeGroup = groupItems.filter((q) => q.active)
  const activeDash = dashItems.filter((x) => x.q.active).length
  const surfaced = activeGroup.length + activeDash

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        )}
        <span className="flex-1 min-w-0 text-sm font-medium text-slate-700 truncate">{dashboard.name}</span>
        <span className="text-[11px] text-slate-400 shrink-0">
          {surfaced} suggested{dashItems.length > 0 ? ` · ${dashItems.length} own` : ""}
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-slate-100">
          {/* Group questions — shown first, ordered at the group level. */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Group questions (shown first)</p>
            {activeGroup.length === 0 ? (
              <p className="text-xs text-slate-400">No active group questions.</p>
            ) : (
              activeGroup.map((q, i) => (
                <div
                  key={`${q.text}-${i}`}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md bg-slate-50 text-xs text-slate-500"
                >
                  <span className="flex-1 min-w-0 truncate">{q.text}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">Group</span>
                </div>
              ))
            )}
          </div>

          {/* This dashboard's own questions — ordered independently. */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Only on this dashboard</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onAdd(area, dashboard.id)}
                className="h-8 bg-white text-xs font-medium text-slate-700"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add question
              </Button>
            </div>
            {dashItems.length > 0 ? (
              <QuestionList
                questions={dashItems.map((x) => x.q)}
                areaActive={areaActive}
                hideHeader
                hideScope
                onEdit={(i) => onEdit(area, dashItems[i].i)}
                onDelete={(i) => onDelete(area, dashItems[i].i)}
                onToggle={(i) => onToggle(area, dashItems[i].i)}
                onReorder={(from, to) => onReorderScoped(area, dashboard.id, from, to)}
              />
            ) : (
              <p className="text-xs text-slate-400">
                No dashboard-specific questions yet. Add one to suggest it only on {dashboard.name}.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function PromptsTab({
  targets,
  areaPinned,
  search,
  setSearch,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onReorderScoped,
}: {
  targets: ChatTarget[]
  areaPinned: AreaPinned
  search: string
  setSearch: (v: string) => void
  onAdd: (area?: string, reportId?: string) => void
  onEdit: (area: string, index: number) => void
  onDelete: (area: string, index: number) => void
  onToggle: (area: string, index: number) => void
  // Reorder within a scope: reportId undefined = group questions, else a dashboard's.
  onReorderScoped: (area: string, reportId: string | undefined, from: number, to: number) => void
}) {
  // Match areas by name, or by any report/dashboard that lives in the area.
  const visibleAreas = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return [...REPORT_AREAS]
    return REPORT_AREAS.filter((area) => {
      if (area.toLowerCase().includes(q)) return true
      return targetsForArea(targets, area).some((t) => t.name.toLowerCase().includes(q))
    })
  }, [search, targets])

  const PAGE_SIZE = 6
  const [page, setPage] = useState(1)
  useEffect(() => {
    setPage(1)
  }, [search])
  const pageCount = Math.max(1, Math.ceil(visibleAreas.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageAreas = visibleAreas.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search report areas…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => onAdd()} className="text-white shrink-0" style={{ backgroundColor: NAVY }}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add question
        </Button>
      </div>

      <p className="text-xs text-slate-500">
        Questions are attached to a report area. When a user opens the AI chatbot from any dashboard or report in that
        area, these questions are suggested to them.
      </p>

      {visibleAreas.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400">No report areas match your search.</div>
      ) : (
        <>
          {pageAreas.map((area) => {
            const color = getAreaColor(area)
            const pinned = areaPinned[area] ?? []
            const areaTargets = targetsForArea(targets, area)
            const totalCount = pinned.length
            const areaActive = pinned.filter((q) => q.active).length
            // Group ("all dashboards") questions with their flat index in the area list.
            const groupItems = pinned.map((q, i) => ({ q, i })).filter((x) => !x.q.reportId)
            const dashboards = systemReportsForArea(area)
            return (
              <Card key={area} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Area header */}
                  <div className="flex items-start gap-3 p-5 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-900">{area}</h3>
                        <span
                          className="px-1.5 py-0.5 text-[10px] font-medium rounded"
                          style={{ backgroundColor: `${color}18`, color }}
                        >
                          {totalCount} {totalCount === 1 ? "question" : "questions"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {areaTargets.length === 0
                          ? "No reports or dashboards in this area yet"
                          : `Surfaced on: ${areaTargets.map((t) => t.name).join(", ")}`}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-6">
                    {/* Group questions — surfaced on every dashboard in the area, always
                        shown first. Order them here for the whole area. */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-semibold text-slate-600">All dashboards in this area</div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onAdd(area, ALL_REPORTS)}
                          className="h-8 bg-white text-xs font-medium text-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Add group question
                        </Button>
                      </div>
                      {groupItems.length > 0 ? (
                        <QuestionList
                          questions={groupItems.map((x) => x.q)}
                          areaActive={areaActive}
                          hideScope
                          onEdit={(i) => onEdit(area, groupItems[i].i)}
                          onDelete={(i) => onDelete(area, groupItems[i].i)}
                          onToggle={(i) => onToggle(area, groupItems[i].i)}
                          onReorder={(from, to) => onReorderScoped(area, undefined, from, to)}
                        />
                      ) : (
                        <p className="text-xs text-slate-400 py-1">
                          No group questions yet. These are suggested on every dashboard in the area.
                        </p>
                      )}
                    </div>

                    {/* Per-dashboard order — each dashboard shows the group questions first,
                        then its own questions in an order you set for that dashboard. */}
                    {dashboards.length > 0 && (
                      <div className="space-y-2 border-t border-slate-100 pt-5">
                        <p className="text-xs font-semibold text-slate-600">Order per dashboard</p>
                        <div className="space-y-2">
                          {dashboards.map((d) => {
                            const dashItems = pinned.map((q, i) => ({ q, i })).filter((x) => x.q.reportId === d.id)
                            return (
                              <DashboardOrderSection
                                key={d.id}
                                area={area}
                                dashboard={d}
                                groupItems={groupItems.map((x) => x.q)}
                                dashItems={dashItems}
                                areaActive={areaActive}
                                onAdd={onAdd}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggle={onToggle}
                                onReorderScoped={onReorderScoped}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {totalCount === 0 && dashboards.length === 0 && (
                      <p className="text-xs text-slate-400 py-2">
                        No dashboards sit under this area yet. Add a group question to suggest it across the area.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          <Pagination
            page={safePage}
            pageCount={pageCount}
            onPageChange={setPage}
            totalItems={visibleAreas.length}
            pageSize={PAGE_SIZE}
            itemLabel="report areas"
          />
        </>
      )}
    </div>
  )
}

// ===========================================================================
// Tab 2 — Question Trends
// ===========================================================================

function TrendsTab({
  topicGroups,
  grandTotal,
  targets,
  asks,
  log,
}: {
  topicGroups: ReturnType<typeof asksByTopic>
  grandTotal: number
  targets: ChatTarget[]
  asks: ReturnType<typeof useAiManagement>["asks"]
  log: ReturnType<typeof useAiManagement>["log"]
}) {
  // The "by topic" panel reflects only the last 7 days, derived from the question
  // log (which carries real timestamps), while the summary cards above stay 30-day.
  const TOPIC_WINDOW_DAYS = 7
  const recentTopicGroups = useMemo(() => asksByTopicWithinDays(log, TOPIC_WINDOW_DAYS), [log])
  // Full sorted list of reports/dashboards by question volume (paged in the UI).
  const topTargets = useMemo(() => {
    return targets
      .map((t) => ({
        target: t,
        total: asks.filter((a) => a.targetId === t.id).reduce((s, a) => s + a.count, 0),
      }))
      .filter((t) => t.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [targets, asks])

  // Full sorted list of the most-asked questions (paged in the UI).
  const topQuestions = useMemo(() => asks.slice().sort((a, b) => b.count - a.count), [asks])

  const fastestGrowing = topicGroups.slice().sort((a, b) => b.trend - a.trend)[0]?.topic ?? "—"
  // Average questions asked per day across the last 30 days.
  const avgPerDay = Math.round(grandTotal / 30)
  // The single topic users ask about the most (topicGroups is sorted by total desc).
  const mostAskedTopic = topicGroups[0]?.topic ?? "—"

  // Keep the bar scale consistent across pages using the global max (list is sorted desc).
  const topicMax = recentTopicGroups[0]?.total ?? 1

  // Track which topic rows are expanded to reveal the questions asked within them.
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})
  const toggleTopic = (topic: string) => setExpandedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }))
  const allExpanded = recentTopicGroups.length > 0 && recentTopicGroups.every((g) => expandedTopics[g.topic])

  // Cap the questions shown per open topic so expanding many topics never balloons
  // into one giant scroll. Each topic can be individually expanded to show them all.
  const QUESTIONS_PER_TOPIC = 5
  const [showAllQuestions, setShowAllQuestions] = useState<Record<string, boolean>>({})
  const toggleShowAll = (topic: string) => setShowAllQuestions((prev) => ({ ...prev, [topic]: !prev[topic] }))

  // Paginate by rows, not topics: each topic header and each visible question counts
  // as one row. Expanding a topic pushes its questions (and any topics below it) onto
  // later pages, so a single page never shows more than TOPIC_ROWS_PER_PAGE rows.
  const TOPIC_ROWS_PER_PAGE = 10
  type TopicRow =
    | { kind: "topic"; g: (typeof recentTopicGroups)[number] }
    | { kind: "question"; topic: string; q: (typeof recentTopicGroups)[number]["questions"][number] }
    | { kind: "more"; g: (typeof recentTopicGroups)[number] }
  const topicRows = useMemo<TopicRow[]>(() => {
    const rows: TopicRow[] = []
    for (const g of recentTopicGroups) {
      rows.push({ kind: "topic", g })
      if (expandedTopics[g.topic]) {
        const visible = showAllQuestions[g.topic] ? g.questions : g.questions.slice(0, QUESTIONS_PER_TOPIC)
        for (const q of visible) rows.push({ kind: "question", topic: g.topic, q })
        if (g.questions.length > QUESTIONS_PER_TOPIC) rows.push({ kind: "more", g })
      }
    }
    return rows
  }, [recentTopicGroups, expandedTopics, showAllQuestions])

  const [topicPage, setTopicPage] = useState(1)
  const topicPageCount = Math.max(1, Math.ceil(topicRows.length / TOPIC_ROWS_PER_PAGE))
  const safeTopicPage = Math.min(topicPage, topicPageCount)
  const pagedRows = topicRows.slice((safeTopicPage - 1) * TOPIC_ROWS_PER_PAGE, safeTopicPage * TOPIC_ROWS_PER_PAGE)

  // Paging for the two summary lists at the bottom of the tab.
  const LIST_PAGE_SIZE = 8
  const [questionPage, setQuestionPage] = useState(1)
  const questionPageCount = Math.max(1, Math.ceil(topQuestions.length / LIST_PAGE_SIZE))
  const safeQuestionPage = Math.min(questionPage, questionPageCount)
  const pagedQuestions = topQuestions.slice((safeQuestionPage - 1) * LIST_PAGE_SIZE, safeQuestionPage * LIST_PAGE_SIZE)

  const TARGET_PAGE_SIZE = 6
  const [targetPage, setTargetPage] = useState(1)
  const targetPageCount = Math.max(1, Math.ceil(topTargets.length / TARGET_PAGE_SIZE))
  const safeTargetPage = Math.min(targetPage, targetPageCount)
  // Keep bar scale consistent across pages using the global max (list is sorted desc).
  const targetMax = topTargets[0]?.total ?? 1
  const pagedTargets = topTargets.slice((safeTargetPage - 1) * TARGET_PAGE_SIZE, safeTargetPage * TARGET_PAGE_SIZE)

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Questions (30 days)" value={grandTotal.toLocaleString()} />
        <StatCard label="Avg. questions per day" value={avgPerDay.toLocaleString()} />
        <StatCard label="Most asked topic" value={mostAskedTopic} small />
        <StatCard label="Fastest growing topic" value={fastestGrowing} small />
      </div>

      {/* By topic */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <MessageCircleQuestion className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">What people are asking, by topic</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                if (allExpanded) {
                  setExpandedTopics({})
                } else {
                  setExpandedTopics(Object.fromEntries(recentTopicGroups.map((g) => [g.topic, true])))
                }
                setTopicPage(1)
              }}
              className="shrink-0 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {allExpanded ? "Collapse all" : "Expand all"}
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Questions asked in the last 7 days, grouped by keyword (Attendance, Attainment, SEND…). Use this to spot
            where demand is heading.
          </p>
          <div className="space-y-4">
            {pagedRows.map((row) => {
              if (row.kind === "topic") {
                const g = row.g
                const color = getAreaColor(g.topic)
                const isOpen = !!expandedTopics[g.topic]
                return (
                  <button
                    key={`t-${g.topic}`}
                    type="button"
                    onClick={() => toggleTopic(g.topic)}
                    aria-expanded={isOpen}
                    className="block w-full text-left rounded-md -mx-1 px-1 py-1 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                        />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-sm font-medium text-slate-800">{g.topic}</span>
                        <span className="text-xs text-slate-400">{g.questions.length} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">{g.total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(g.total / topicMax) * 100}%`, backgroundColor: color }}
                      />
                    </div>
                  </button>
                )
              }
              if (row.kind === "question") {
                return (
                  <div key={`q-${row.q.id}`} className="ml-6 pl-4 border-l border-slate-200">
                    <div className="flex items-center gap-3 py-1">
                      <span className="flex-1 text-sm text-slate-600">{row.q.question}</span>
                      <span className="text-xs font-medium text-slate-500 shrink-0">
                        {row.q.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )
              }
              // "more" row — toggle showing all questions for the topic.
              return (
                <div key={`m-${row.g.topic}`} className="ml-6 pl-4 border-l border-slate-200">
                  <button
                    type="button"
                    onClick={() => toggleShowAll(row.g.topic)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    {showAllQuestions[row.g.topic] ? "Show fewer" : `Show all ${row.g.questions.length} questions`}
                  </button>
                </div>
              )
            })}
            {recentTopicGroups.length === 0 && (
              <p className="text-sm text-slate-400 py-2">No questions have been asked in the last 7 days.</p>
            )}
          </div>
          <div className="mt-4">
            <Pagination
              page={safeTopicPage}
              pageCount={topicPageCount}
              onPageChange={setTopicPage}
              totalItems={topicRows.length}
              pageSize={TOPIC_ROWS_PER_PAGE}
              itemLabel="rows"
            />
          </div>
        </CardContent>
      </Card>

      {/* Top questions + busiest targets */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Top questions overall</h3>
            <div className="space-y-1">
              {pagedQuestions.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 py-1.5">
                  <span className="text-xs font-semibold text-slate-300 w-6">
                    {(safeQuestionPage - 1) * LIST_PAGE_SIZE + i + 1}
                  </span>
                  <span className="flex-1 text-sm text-slate-700 truncate">{a.question}</span>
                  <span className="text-xs font-medium text-slate-500">{a.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Pagination
                page={safeQuestionPage}
                pageCount={questionPageCount}
                onPageChange={setQuestionPage}
                totalItems={topQuestions.length}
                pageSize={LIST_PAGE_SIZE}
                itemLabel="questions"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Busiest reports & dashboards</h3>
            <div className="space-y-3">
              {pagedTargets.map(({ target, total }) => {
                const color = getAreaColor(target.area)
                return (
                  <div key={target.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700 truncate">{target.name}</span>
                      <span className="text-xs font-medium text-slate-500">{total.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(total / targetMax) * 100}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4">
              <Pagination
                page={safeTargetPage}
                pageCount={targetPageCount}
                onPageChange={setTargetPage}
                totalItems={topTargets.length}
                pageSize={TARGET_PAGE_SIZE}
                itemLabel="reports"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ===========================================================================
// Tab 3 — Reports (exportable question log)
// ===========================================================================

/**
 * Organisations visible to a platform admin. Each MAT groups the individual
 * schools that appear in the question log, so filtering by a trust matches every
 * one of its schools and the school counts stay accurate.
 */
const ORG_TREE: { id: string; name: string; schools: string[] }[] = [
  { id: "mat-fuze", name: "Fuze Multi Academy Trust", schools: ["Fuze MAT (Central)", "Oakfield Primary", "Hillside Junior"] },
  { id: "mat-st-michael", name: "St Michael's Catholic Multi Academy Trust", schools: ["St Mary's CofE"] },
  { id: "mat-greenhill", name: "Greenhill Learning Trust", schools: ["Greenhill Academy", "Riverside High"] },
]

/** The currently selected organisation scope for the question log. */
type OrgSelection =
  | { type: "all" }
  | { type: "mat"; id: string; name: string }
  | { type: "school"; name: string }

/** Resolve the parent MAT name for a given school, if any. */
function parentMatName(school: string): string | null {
  return ORG_TREE.find((m) => m.schools.includes(school))?.name ?? null
}

/**
 * Searchable organisation picker shown to platform admins in place of a flat
 * "All schools" dropdown. Lists every MAT (with school counts) and every school.
 */
function OrgPicker({
  value,
  onChange,
  schools,
}: {
  value: OrgSelection
  onChange: (sel: OrgSelection) => void
  schools: string[]
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const q = search.trim().toLowerCase()
  const filteredMats = ORG_TREE.filter((m) => m.name.toLowerCase().includes(q))
  const filteredSchools = schools.filter((s) => s.toLowerCase().includes(q))

  const label =
    value.type === "all"
      ? "All organisations"
      : value.type === "mat"
        ? value.name
        : value.name

  function select(sel: OrgSelection) {
    onChange(sel)
    setOpen(false)
    setSearch("")
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm hover:border-slate-300 transition-colors"
      >
        <span className={`flex-1 text-left truncate ${value.type === "all" ? "text-slate-500" : "text-slate-900"}`}>
          {label}
        </span>
        {value.type === "mat" && (
          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">MAT</span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[300px] bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-[360px] flex flex-col">
          <div className="p-2 border-b">
            <Input
              placeholder="Search MATs or schools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
              autoFocus
            />
          </div>
          <div className="overflow-auto flex-1">
            {/* All organisations */}
            {"all organisations".includes(q) && (
              <button
                type="button"
                onClick={() => select({ type: "all" })}
                className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors ${
                  value.type === "all" ? "bg-[#B30089] text-white font-medium" : "text-slate-900 hover:bg-slate-50"
                }`}
              >
                All organisations
              </button>
            )}

            {/* MATs */}
            {filteredMats.length > 0 && (
              <>
                <div className="px-4 py-2 border-t border-b">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Multi-Academy Trusts
                  </span>
                </div>
                {filteredMats.map((mat) => {
                  const selected = value.type === "mat" && value.id === mat.id
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => select({ type: "mat", id: mat.id, name: mat.name })}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                        selected ? "bg-[#B30089]" : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`text-sm flex-1 text-left truncate ${selected ? "text-white font-medium" : "text-slate-900"}`}
                      >
                        {mat.name}
                      </span>
                      <span className={`text-xs shrink-0 ${selected ? "text-white" : "text-slate-500"}`}>
                        {mat.schools.length} {mat.schools.length === 1 ? "school" : "schools"}
                      </span>
                    </button>
                  )
                })}
              </>
            )}

            {/* Schools */}
            {filteredSchools.length > 0 && (
              <>
                <div className="px-4 py-2 border-t border-b">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Schools</span>
                </div>
                {filteredSchools.map((school) => {
                  const selected = value.type === "school" && value.name === school
                  const parent = parentMatName(school)
                  return (
                    <button
                      key={school}
                      type="button"
                      onClick={() => select({ type: "school", name: school })}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                        selected ? "bg-[#B30089]" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex-1 text-left min-w-0">
                        <span
                          className={`text-sm block truncate ${selected ? "text-white font-medium" : "text-slate-900"}`}
                        >
                          {school}
                        </span>
                        {parent && (
                          <span className={`text-xs truncate block ${selected ? "text-white" : "text-slate-500"}`}>
                            {parent}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </>
            )}

            {filteredMats.length === 0 && filteredSchools.length === 0 && !"all organisations".includes(q) && (
              <div className="p-4 text-center text-sm text-slate-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Columns the question log can be sorted by. */
type SortKey = "askedAt" | "user" | "role" | "school" | "page" | "topic" | "question" | "answered"

/** Return a new array of log entries sorted by the given column and direction. */
function sortLog(entries: AskLogEntry[], key: SortKey, dir: "asc" | "desc"): AskLogEntry[] {
  const factor = dir === "asc" ? 1 : -1
  return [...entries].sort((a, b) => {
    let cmp: number
    if (key === "askedAt") {
      cmp = new Date(a.askedAt).getTime() - new Date(b.askedAt).getTime()
    } else if (key === "answered") {
      cmp = Number(a.answered) - Number(b.answered)
    } else {
      cmp = String(a[key] ?? "").localeCompare(String(b[key] ?? ""), undefined, { sensitivity: "base" })
    }
    // Stable tie-break by date so equal keys keep a predictable order.
    if (cmp === 0) cmp = new Date(a.askedAt).getTime() - new Date(b.askedAt).getTime()
    return cmp * factor
  })
}

function ReportsTab({ log }: { log: AskLogEntry[] }) {
  const [filters, setFilters] = useState<LogFilters>({
    search: "",
    school: "all",
    topic: "all",
    answered: "all",
  })

  // Organisation scope (platform admins can see every organisation). Kept separate
  // from `filters.school` so a trust selection can match all of its schools.
  const [orgSel, setOrgSel] = useState<OrgSelection>({ type: "all" })

  // Column sorting. Defaults to newest-first by date & time.
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "askedAt", dir: "desc" })
  function toggleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : // New column: dates start newest-first, everything else A→Z.
          { key, dir: key === "askedAt" ? "desc" : "asc" },
    )
  }

  const schools = useMemo(() => uniqueValues(log, "school"), [log])
  const topics = useMemo(() => uniqueValues(log, "topic"), [log])
  const filtered = useMemo(() => {
    const base = filterLog(log, filters)
    let scoped = base
    if (orgSel.type === "school") scoped = base.filter((e) => e.school === orgSel.name)
    else if (orgSel.type === "mat") {
      const mat = ORG_TREE.find((m) => m.id === orgSel.id)
      const matSchools = new Set(mat?.schools ?? [])
      scoped = base.filter((e) => matSchools.has(e.school))
    }
    return sortLog(scoped, sort.key, sort.dir)
  }, [log, filters, orgSel, sort])

  const unansweredCount = useMemo(() => filtered.filter((e) => !e.answered).length, [filtered])

  // The log row whose full response is being viewed in the detail dialog.
  const [selectedEntry, setSelectedEntry] = useState<AskLogEntry | null>(null)

  const ROW_PAGE_SIZE = 15
  const [page, setPage] = useState(1)
  // Reset to the first page whenever the filters change the result set.
  useEffect(() => {
    setPage(1)
  }, [filters, orgSel, sort])
  const pageCount = Math.max(1, Math.ceil(filtered.length / ROW_PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice((safePage - 1) * ROW_PAGE_SIZE, safePage * ROW_PAGE_SIZE)

  function handleExport() {
    const rows = logToExportRows(filtered)
    const worksheet = XLSX.utils.json_to_sheet(rows)
    // Sensible column widths.
    worksheet["!cols"] = [
      { wch: 20 }, // Date & time
      { wch: 18 }, // User
      { wch: 18 }, // Role
      { wch: 22 }, // School / Org
      { wch: 28 }, // Page / Report
      { wch: 16 }, // Topic
      { wch: 52 }, // Question
      { wch: 10 }, // Answered
      { wch: 70 }, // Response
    ]
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "AI Questions")
    const stamp = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(workbook, `ai-chatbot-questions-${stamp}.xlsx`)
  }

  // A clickable column header that sorts the log by `sortKey`. Shows a direction
  // arrow only on the active column.
  function SortHeader({
    label,
    sortKey,
    align = "left",
  }: {
    label: string
    sortKey: SortKey
    align?: "left" | "center"
  }) {
    const active = sort.key === sortKey
    return (
      <th className={`px-4 py-3 whitespace-nowrap ${align === "center" ? "text-center" : ""}`}>
        <button
          type="button"
          onClick={() => toggleSort(sortKey)}
          aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
          className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wide transition-colors hover:text-slate-700 ${
            active ? "text-slate-700" : "text-slate-500"
          } ${align === "center" ? "justify-center" : ""}`}
        >
          {label}
          {active ? (
            sort.dir === "asc" ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )
          ) : (
            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
          )}
        </button>
      </th>
    )
  }

  return (
    <div className="space-y-4">
      {/* Intro + export */}
      <Card>
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FileSpreadsheet className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">AI question log</h3>
            </div>
            <p className="text-xs text-slate-500">
              Every question asked to the chatbot — who asked it, their role and school, and the page they were on. Use
              the filters below, then export the current view to Excel.
            </p>
          </div>
          <Button onClick={handleExport} className="text-white shrink-0" style={{ backgroundColor: NAVY }}>
            <Download className="w-4 h-4 mr-2" />
            Export to Excel ({filtered.length})
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Search"
            className="pl-9"
          />
        </div>
        <OrgPicker value={orgSel} onChange={setOrgSel} schools={schools} />
        <Select value={filters.topic} onValueChange={(v) => setFilters((f) => ({ ...f, topic: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="All topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All topics</SelectItem>
            {topics.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.answered}
          onValueChange={(v) => setFilters((f) => ({ ...f, answered: v as LogFilters["answered"] }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Answered & unanswered</SelectItem>
            <SelectItem value="answered">Answered only</SelectItem>
            <SelectItem value="unanswered">Unanswered only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary line */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {log.length} questions
        </span>
        {unansweredCount > 0 && (
          <span className="inline-flex items-center gap-1 text-amber-600">
            <XCircle className="w-3.5 h-3.5" />
            {unansweredCount} unanswered (gaps to investigate)
          </span>
        )}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <SortHeader label="Date & time" sortKey="askedAt" />
                  <SortHeader label="User" sortKey="user" />
                  <SortHeader label="Role" sortKey="role" />
                  <SortHeader label="School / Org" sortKey="school" />
                  <SortHeader label="Page / Report" sortKey="page" />
                  <SortHeader label="Topic" sortKey="topic" />
                  <SortHeader label="Question" sortKey="question" />
                  <SortHeader label="Answered" sortKey="answered" align="center" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                      No questions match your filters.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((e) => {
                    const color = getAreaColor(e.topic)
                    return (
                      <tr
                        key={e.id}
                        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`View response for: ${e.question}`}
                        onClick={() => setSelectedEntry(e)}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") {
                            ev.preventDefault()
                            setSelectedEntry(e)
                          }
                        }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatLogDate(e.askedAt)}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800">{e.user}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{e.role}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{e.school}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">{e.page}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className="px-1.5 py-0.5 text-[10px] font-medium rounded uppercase tracking-wide"
                            style={{ backgroundColor: `${color}18`, color }}
                          >
                            {e.topic}
                          </span>
                        </td>
                        <td className="px-4 py-3 min-w-[280px]">
                          <span className="text-slate-700 hover:text-slate-900 hover:underline">{e.question}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {e.answered ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" aria-label="Answered" />
                          ) : (
                            <XCircle className="w-4 h-4 text-amber-500 inline" aria-label="Unanswered" />
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Pagination
        page={safePage}
        pageCount={pageCount}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={ROW_PAGE_SIZE}
        itemLabel="questions"
      />

      {/* Question + response detail */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="max-w-lg">
          {selectedEntry && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="px-1.5 py-0.5 text-[10px] font-medium rounded uppercase tracking-wide"
                  style={{
                    backgroundColor: `${getAreaColor(selectedEntry.topic)}18`,
                    color: getAreaColor(selectedEntry.topic),
                  }}
                >
                  {selectedEntry.topic}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    selectedEntry.answered ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {selectedEntry.answered ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {selectedEntry.answered ? "Answered" : "Unanswered"}
                </span>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Question</p>
                <p className="text-sm font-medium text-slate-900">{selectedEntry.question}</p>
              </div>

              {/* Response */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">AI response</p>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm leading-relaxed text-slate-700">{selectedEntry.answer}</p>
                </div>
              </div>

              {/* Meta */}
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-sm">
                <div>
                  <dt className="text-xs text-slate-400">Asked by</dt>
                  <dd className="text-slate-700">{selectedEntry.user}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Role</dt>
                  <dd className="text-slate-700">{selectedEntry.role}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">School / Org</dt>
                  <dd className="text-slate-700">{selectedEntry.school}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400">Page / Report</dt>
                  <dd className="text-slate-700">{selectedEntry.page}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-slate-400">Asked</dt>
                  <dd className="text-slate-700">{formatLogDate(selectedEntry.askedAt)}</dd>
                </div>
              </dl>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedEntry(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ===========================================================================
// Shared small components
// ===========================================================================

// Builds a compact page list with ellipses, e.g. [1, "…", 4, 5, 6, "…", 12].
function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "…")[] = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) pages.push("…")
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push("…")
  pages.push(total)
  return pages
}

function Pagination({
  page,
  pageCount,
  onPageChange,
  totalItems,
  pageSize,
  itemLabel = "items",
}: {
  page: number
  pageCount: number
  onPageChange: (p: number) => void
  totalItems: number
  pageSize: number
  itemLabel?: string
}) {
  if (pageCount <= 1) return null
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {start}–{end}
        </span>{" "}
        of {totalItems} {itemLabel}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        {getPageRange(page, pageCount).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-2 text-xs text-slate-400">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              className="h-8 min-w-8 px-2 text-xs"
              style={p === page ? { backgroundColor: NAVY, color: "white" } : undefined}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          disabled={page === pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function StatCard({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`font-bold text-slate-900 mt-1 ${small ? "text-base" : "text-2xl"}`}>{value}</p>
      </CardContent>
    </Card>
  )
}
