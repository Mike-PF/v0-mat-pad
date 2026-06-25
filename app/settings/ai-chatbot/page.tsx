"use client"

import { useMemo, useState } from "react"
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
  LayoutDashboard,
  FileBarChart2,
  Lightbulb,
  MessageCircleQuestion,
  Lock,
} from "lucide-react"
import { isPlatformAdmin, CURRENT_ORG } from "@/lib/current-org"
import {
  useAiManagement,
  surfacedQuestions,
  topAsksForTarget,
  asksByTopic,
  totalAsks,
  getAreaColor,
  DEMAND_STATUS_LABELS,
  type ChatTarget,
  type DemandRecord,
} from "@/lib/ai-chatbot"

const NAVY = "#121051"

type Tab = "prompts" | "trends" | "demand"

export default function AiManagementPage() {
  const allowed = isPlatformAdmin()

  const {
    mounted,
    targets,
    asks,
    demand,
    toggleAutoSurface,
    pinQuestion,
    updatePinned,
    removePinned,
    setDemandStatus,
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
    { id: "demand", label: "Report Demand", icon: Lightbulb },
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
                  page based on what users actually ask, and you can track demand for reports we haven&apos;t built yet.
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
              />
            ) : tab === "trends" ? (
              <TrendsTab topicGroups={topicGroups} grandTotal={grandTotal} targets={targets} asks={asks} />
            ) : (
              <DemandTab demand={demand} onStatus={setDemandStatus} />
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
              {dialogIndex === null ? "Pin a question" : "Edit pinned question"}
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
              {dialogIndex === null ? "Pin question" : "Save changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Remove pinned question?</h2>
          <p className="text-sm text-slate-500 mb-6">
            {deleteConfirm && (
              <>
                &ldquo;{deleteConfirm.target.pinned[deleteConfirm.index]}&rdquo; will no longer be pinned to{" "}
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
}) {
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
        targets.map((target) => {
          const surfaced = surfacedQuestions(target, asks)
          const topAsks = topAsksForTarget(asks, target.id)
          const color = getAreaColor(target.area)
          const KindIcon = target.kind === "dashboard" ? LayoutDashboard : FileBarChart2
          return (
            <Card key={target.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Target header */}
                <div className="flex items-start gap-3 p-5 border-b border-slate-100">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <KindIcon className="w-4 h-4" style={{ color }} />
                  </div>
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

                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  {/* Left: what the chatbot surfaces */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Suggested on this page
                      </span>
                      <Button size="sm" variant="outline" onClick={() => onAdd(target)} className="h-7 px-2 text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Pin question
                      </Button>
                    </div>
                    {surfaced.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4">
                        Nothing suggested yet. Pin a question or enable auto-surface.
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
                              {s.source === "pinned" ? (
                                <Pin className="w-3.5 h-3.5 text-[#121051] shrink-0 mt-0.5" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              )}
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
                                <span className="text-[10px] text-slate-400 uppercase tracking-wide shrink-0 mt-1">
                                  Auto
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right: most asked here (drives auto-surface) */}
                  <div className="p-5 bg-slate-50/40">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Most asked here
                    </span>
                    {topAsks.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4">No questions asked here yet.</p>
                    ) : (
                      <div className="space-y-2.5 mt-3">
                        {topAsks.map((a) => {
                          const max = topAsks[0].count
                          const isPinned = target.pinned.some((p) => p.toLowerCase() === a.question.toLowerCase())
                          return (
                            <div key={a.id} className="group">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm text-slate-700 truncate flex-1">{a.question}</span>
                                {!isPinned && (
                                  <button
                                    onClick={() => onAdd(target, a.question)}
                                    className="text-[11px] font-medium text-[#121051] hover:underline shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Pin
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${(a.count / max) * 100}%`,
                                      backgroundColor: getAreaColor(a.topic),
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-slate-500 w-10 text-right">{a.count}</span>
                                <TrendBadge trend={a.trend} />
                              </div>
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
        })
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
            {topicGroups.map((g) => {
              const max = topicGroups[0].total
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
// Tab 3 — Report Demand
// ===========================================================================

function DemandTab({
  demand,
  onStatus,
}: {
  demand: DemandRecord[]
  onStatus: (id: string, status: DemandRecord["status"]) => void
}) {
  const sorted = useMemo(() => demand.slice().sort((a, b) => b.count - a.count), [demand])

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900">Reports people want that we haven&apos;t built</h3>
          </div>
          <p className="text-xs text-slate-500">
            These are clusters of chatbot questions that didn&apos;t map to an existing report or dashboard. High,
            rising demand is a strong signal of what to build next.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {sorted.map((d) => {
          const max = sorted[0].count
          const color = getAreaColor(d.topic)
          return (
            <Card key={d.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-semibold text-slate-900">{d.request}</h4>
                      <span
                        className="px-1.5 py-0.5 text-[10px] font-medium rounded uppercase tracking-wide"
                        style={{ backgroundColor: `${color}18`, color }}
                      >
                        {d.topic}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">Most requested by {d.topSource}</p>
                    <div className="flex items-center gap-2 max-w-md">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(d.count / max) * 100}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500 w-20 text-right">{d.count} asks</span>
                      <TrendBadge trend={d.trend} />
                    </div>
                  </div>
                  <Select value={d.status} onValueChange={(v) => onStatus(d.id, v as DemandRecord["status"])}>
                    <SelectTrigger className="w-36 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(DEMAND_STATUS_LABELS) as DemandRecord["status"][]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {DEMAND_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ===========================================================================
// Shared small components
// ===========================================================================

function TrendBadge({ trend }: { trend: number }) {
  const up = trend >= 0
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium shrink-0 ${
        up ? "text-emerald-600" : "text-red-500"
      }`}
    >
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(trend)}%
    </span>
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
