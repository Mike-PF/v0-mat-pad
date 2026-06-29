"use client"

import { useEffect, useMemo, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bot,
  Search,
  Plus,
  Trash2,
  Pin,
  Sparkles,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  Download,
  MessageCircleQuestion,
  CheckCircle2,
  XCircle,
  Lock,
} from "lucide-react"
import * as XLSX from "xlsx"
import { isPlatformAdmin, CURRENT_ORG } from "@/lib/current-org"
import {
  useAiManagement,
  surfacedQuestions,
  topAsksForTarget,
  asksByTopic,
  totalAsks,
  getAreaColor,
  filterLog,
  logToExportRows,
  formatLogDate,
  uniqueValues,
  type ChatTarget,
  type AskLogEntry,
  type LogFilters,
} from "@/lib/ai-chatbot"

const NAVY = "#121051"

type Tab = "prompts" | "trends" | "reports"

export default function AiManagementPage() {
  const allowed = isPlatformAdmin()

  const {
    mounted,
    targets,
    asks,
    log,
    toggleAutoSurface,
    pinQuestion,
    updatePinned,
    removePinned,
    excludeQuestion,
  } = useAiManagement()

  const [tab, setTab] = useState<Tab>("prompts")
  const [search, setSearch] = useState("")
  const [kindFilter, setKindFilter] = useState<"all" | "dashboard" | "report">("all")

  // Pin / edit dialog state
  const [dialogTarget, setDialogTarget] = useState<ChatTarget | null>(null)
  const [dialogIndex, setDialogIndex] = useState<number | null>(null) // null = adding new
  const [dialogText, setDialogText] = useState("")

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<{ target: ChatTarget; index: number } | null>(null)

  const filteredTargets = useMemo(() => {
    return targets.filter((t) => {
      if (kindFilter !== "all" && t.kind !== kindFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return t.name.toLowerCase().includes(q) || t.area.toLowerCase().includes(q)
      }
      return true
    })
  }, [targets, kindFilter, search])

  const topicGroups = useMemo(() => asksByTopic(asks), [asks])
  const grandTotal = useMemo(() => totalAsks(asks), [asks])

  function openAdd(target: ChatTarget, prefill = "") {
    setDialogTarget(target)
    setDialogIndex(null)
    setDialogText(prefill)
  }

  function openEdit(target: ChatTarget, index: number) {
    setDialogTarget(target)
    setDialogIndex(index)
    setDialogText(target.pinned[index])
  }

  function saveDialog() {
    if (!dialogTarget || !dialogText.trim()) return
    if (dialogIndex === null) {
      pinQuestion(dialogTarget.id, dialogText)
    } else {
      updatePinned(dialogTarget.id, dialogIndex, dialogText)
    }
    setDialogTarget(null)
    setDialogText("")
    setDialogIndex(null)
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

  const tabs: { id: Tab; label: string; icon: typeof Bot }[] = [
    { id: "prompts", label: "Report Prompts", icon: Sparkles },
    { id: "trends", label: "Question Trends", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileSpreadsheet },
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
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${NAVY}14` }}
              >
                <Bot className="w-5 h-5" style={{ color: NAVY }} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AI Management</h1>
                <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">
                  Attach AI questions to specific reports and dashboards. The chatbot tailors what it suggests on each
                  page based on what users actually ask, and you can export the full question log for reporting.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 mb-6">
              {tabs.map((t) => {
                const Icon = t.icon
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
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                )
              })}
            </div>

            {!mounted ? (
              <div className="py-20 text-center text-sm text-slate-400">Loading…</div>
            ) : tab === "prompts" ? (
              <PromptsTab
                targets={filteredTargets}
                asks={asks}
                search={search}
                setSearch={setSearch}
                kindFilter={kindFilter}
                setKindFilter={setKindFilter}
                onToggleAuto={toggleAutoSurface}
                onAdd={openAdd}
                onEdit={openEdit}
                onDelete={(target, index) => setDeleteConfirm({ target, index })}
                onExclude={excludeQuestion}
              />
            ) : tab === "trends" ? (
              <TrendsTab topicGroups={topicGroups} grandTotal={grandTotal} targets={targets} asks={asks} />
            ) : (
              <ReportsTab log={log} />
            )}
          </div>
        </main>
      </div>

      {/* Pin / edit dialog */}
      <Dialog open={!!dialogTarget} onOpenChange={(open) => !open && setDialogTarget(null)}>
        <DialogContent className="max-w-lg">
          <div className="flex items-center gap-2 mb-1">
            <Pin className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">
              {dialogIndex === null ? "Add a question" : "Edit question"}
            </h2>
          </div>
          {dialogTarget && (
            <p className="text-sm text-slate-500 mb-4">
              This question will always be suggested on{" "}
              <span className="font-medium text-slate-700">{dialogTarget.name}</span>.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="pin-text">
              Question<span className="text-red-500">*</span>
            </Label>
            <Input
              id="pin-text"
              value={dialogText}
              onChange={(e) => setDialogText(e.target.value)}
              placeholder="e.g. How does our Progress 8 compare to last year?"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveDialog()
              }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDialogTarget(null)}>
              Cancel
            </Button>
            <Button
              onClick={saveDialog}
              disabled={!dialogText.trim()}
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
            {deleteConfirm && (
              <>
                &ldquo;{deleteConfirm.target.pinned[deleteConfirm.index]}&rdquo; will no longer be suggested on{" "}
                {deleteConfirm.target.name}.
              </>
            )}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm) removePinned(deleteConfirm.target.id, deleteConfirm.index)
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

function PromptsTab({
  targets,
  asks,
  search,
  setSearch,
  kindFilter,
  setKindFilter,
  onToggleAuto,
  onAdd,
  onEdit,
  onDelete,
  onExclude,
}: {
  targets: ChatTarget[]
  asks: ReturnType<typeof useAiManagement>["asks"]
  search: string
  setSearch: (v: string) => void
  kindFilter: "all" | "dashboard" | "report"
  setKindFilter: (v: "all" | "dashboard" | "report") => void
  onToggleAuto: (id: string) => void
  onAdd: (target: ChatTarget, prefill?: string) => void
  onEdit: (target: ChatTarget, index: number) => void
  onDelete: (target: ChatTarget, index: number) => void
  onExclude: (targetId: string, question: string) => void
}) {
  const PAGE_SIZE = 5
  const [page, setPage] = useState(1)
  // Reset to the first page whenever the filters change the result set.
  useEffect(() => {
    setPage(1)
  }, [search, kindFilter])
  const pageCount = Math.max(1, Math.ceil(targets.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageTargets = targets.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports & dashboards…"
            className="pl-9"
          />
        </div>
        <Select value={kindFilter} onValueChange={(v) => setKindFilter(v as typeof kindFilter)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All targets</SelectItem>
            <SelectItem value="dashboard">Dashboards</SelectItem>
            <SelectItem value="report">Reports</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {targets.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400">No reports or dashboards match your filter.</div>
      ) : (
        <>
        {pageTargets.map((target) => {
          const surfaced = surfacedQuestions(target, asks)
          const topAsks = topAsksForTarget(asks, target.id)
          const color = getAreaColor(target.area)
          return (
            <Card key={target.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Target header */}
                <div className="flex items-start gap-3 p-5 border-b border-slate-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-slate-900">{target.name}</h3>
                      <span
                        className="px-1.5 py-0.5 text-[10px] font-medium rounded uppercase tracking-wide"
                        style={{ backgroundColor: `${color}18`, color }}
                      >
                        {target.area}
                      </span>
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-500 capitalize">
                        {target.kind}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {topAsks.reduce((s, a) => s + a.count, 0).toLocaleString()} questions asked here in the last 30
                      days
                    </p>
                  </div>
                  <label className="flex items-center gap-2 shrink-0 cursor-pointer">
                    <span className="text-xs text-slate-500 hidden sm:inline">Auto-surface top asked</span>
                    <Switch checked={target.autoSurface} onCheckedChange={() => onToggleAuto(target.id)} />
                  </label>
                </div>

                <div>
                  {/* What the chatbot surfaces */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Suggested on this page
                      </span>
                      <Button size="sm" variant="outline" onClick={() => onAdd(target)} className="h-7 px-2 text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add question
                      </Button>
                    </div>
                    {surfaced.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4">
                        Nothing suggested yet. Add a question or enable auto-surface.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {surfaced.map((s, i) => {
                          const pinnedIndex = s.source === "pinned" ? target.pinned.indexOf(s.text) : -1
                          return (
                            <div
                              key={`${s.text}-${i}`}
                              className={`group flex items-start gap-2 p-2.5 rounded-lg border text-left ${
                                s.source === "pinned"
                                  ? "border-slate-200 bg-white cursor-pointer hover:border-slate-300"
                                  : "border-dashed border-slate-200 bg-slate-50/60"
                              }`}
                              role={s.source === "pinned" ? "button" : undefined}
                              tabIndex={s.source === "pinned" ? 0 : undefined}
                              onClick={s.source === "pinned" ? () => onEdit(target, pinnedIndex) : undefined}
                              onKeyDown={
                                s.source === "pinned"
                                  ? (e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        onEdit(target, pinnedIndex)
                                      }
                                    }
                                  : undefined
                              }
                            >
                              <span className="flex-1 text-sm text-slate-700">{s.text}</span>
                              {s.source === "pinned" ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(target, pinnedIndex)
                                  }}
                                  className="p-1 rounded text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                  aria-label="Remove pinned question"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">
                                    Auto
                                  </span>
                                  <button
                                    onClick={() => onExclude(target.id, s.text)}
                                    className="p-1 rounded text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                    aria-label="Remove auto-surfaced question"
                                    title="Remove this suggestion"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        <Pagination
          page={safePage}
          pageCount={pageCount}
          onPageChange={setPage}
          totalItems={targets.length}
          pageSize={PAGE_SIZE}
          itemLabel="reports & dashboards"
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
}: {
  topicGroups: ReturnType<typeof asksByTopic>
  grandTotal: number
  targets: ChatTarget[]
  asks: ReturnType<typeof useAiManagement>["asks"]
}) {
  const topTargets = useMemo(() => {
    return targets
      .map((t) => ({
        target: t,
        total: asks.filter((a) => a.targetId === t.id).reduce((s, a) => s + a.count, 0),
      }))
      .filter((t) => t.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
  }, [targets, asks])

  const fastestGrowing = topicGroups.slice().sort((a, b) => b.trend - a.trend)[0]?.topic ?? "—"

  const TOPIC_PAGE_SIZE = 6
  const [topicPage, setTopicPage] = useState(1)
  const topicPageCount = Math.max(1, Math.ceil(topicGroups.length / TOPIC_PAGE_SIZE))
  const safeTopicPage = Math.min(topicPage, topicPageCount)
  // Keep the bar scale consistent across pages using the global max (list is sorted desc).
  const topicMax = topicGroups[0]?.total ?? 1
  const pagedTopics = topicGroups.slice((safeTopicPage - 1) * TOPIC_PAGE_SIZE, safeTopicPage * TOPIC_PAGE_SIZE)

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Questions (30 days)" value={grandTotal.toLocaleString()} />
        <StatCard label="Topics tracked" value={String(topicGroups.length)} />
        <StatCard label="Reports & dashboards" value={String(targets.length)} />
        <StatCard label="Fastest growing" value={fastestGrowing} small />
      </div>

      {/* By topic */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircleQuestion className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-900">What people are asking, by topic</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Questions are grouped by keyword (Attendance, Attainment, SEND…). Use this to spot where demand is heading.
          </p>
          <div className="space-y-4">
            {pagedTopics.map((g) => {
              const max = topicMax
              const color = getAreaColor(g.topic)
              return (
                <div key={g.topic}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-slate-800">{g.topic}</span>
                      <span className="text-xs text-slate-400">{g.questions.length} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">{g.total.toLocaleString()}</span>
                      <TrendBadge trend={g.trend} />
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(g.total / max) * 100}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4">
            <Pagination
              page={safeTopicPage}
              pageCount={topicPageCount}
              onPageChange={setTopicPage}
              totalItems={topicGroups.length}
              pageSize={TOPIC_PAGE_SIZE}
              itemLabel="topics"
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
              {asks
                .slice()
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3 py-1.5">
                    <span className="text-xs font-semibold text-slate-300 w-4">{i + 1}</span>
                    <span className="flex-1 text-sm text-slate-700 truncate">{a.question}</span>
                    <span className="text-xs font-medium text-slate-500">{a.count}</span>
                    <TrendBadge trend={a.trend} />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Busiest reports & dashboards</h3>
            <div className="space-y-3">
              {topTargets.map(({ target, total }) => {
                const max = topTargets[0].total
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
                        style={{ width: `${(total / max) * 100}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                )
              })}
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

function ReportsTab({ log }: { log: AskLogEntry[] }) {
  const [filters, setFilters] = useState<LogFilters>({
    search: "",
    school: "all",
    topic: "all",
    answered: "all",
  })

  const schools = useMemo(() => uniqueValues(log, "school"), [log])
  const topics = useMemo(() => uniqueValues(log, "topic"), [log])
  const filtered = useMemo(() => filterLog(log, filters), [log, filters])

  const unansweredCount = useMemo(() => filtered.filter((e) => !e.answered).length, [filtered])

  const ROW_PAGE_SIZE = 15
  const [page, setPage] = useState(1)
  // Reset to the first page whenever the filters change the result set.
  useEffect(() => {
    setPage(1)
  }, [filters])
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
    ]
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "AI Questions")
    const stamp = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(workbook, `ai-chatbot-questions-${stamp}.xlsx`)
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
            placeholder="Search question, person, page…"
            className="pl-9"
          />
        </div>
        <Select value={filters.school} onValueChange={(v) => setFilters((f) => ({ ...f, school: v }))}>
          <SelectTrigger>
            <SelectValue placeholder="All schools" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All schools</SelectItem>
            {schools.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                  <th className="px-4 py-3 whitespace-nowrap">Date &amp; time</th>
                  <th className="px-4 py-3 whitespace-nowrap">User</th>
                  <th className="px-4 py-3 whitespace-nowrap">Role</th>
                  <th className="px-4 py-3 whitespace-nowrap">School / Org</th>
                  <th className="px-4 py-3 whitespace-nowrap">Page / Report</th>
                  <th className="px-4 py-3 whitespace-nowrap">Topic</th>
                  <th className="px-4 py-3">Question</th>
                  <th className="px-4 py-3 whitespace-nowrap text-center">Answered</th>
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
                      <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/60">
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
                        <td className="px-4 py-3 text-slate-700 min-w-[280px]">{e.question}</td>
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
    </div>
  )
}

// ===========================================================================
// Shared small components
// ===========================================================================

function TrendBadge({ trend }: { trend: number }) {
  const up = trend >= 0
  // Style guide status colours: Success (#4A7C44) and Destructive (#EF4444).
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-medium shrink-0"
      style={{ color: up ? "#4A7C44" : "#EF4444" }}
    >
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(trend)}%
    </span>
  )
}

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
