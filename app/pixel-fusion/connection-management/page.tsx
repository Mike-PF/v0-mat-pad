"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search,
  Cable,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Database,
  Lock,
  Ban,
} from "lucide-react"
import { isPlatformAdmin, CURRENT_ORG } from "@/lib/current-org"

const NAVY = "#121051"

type FeedStatus = "healthy" | "error" | "warning" | "syncing" | "disabled"

interface FeedRun {
  time: string
  outcome: "success" | "error" | "warning"
  records: number
  message: string
}

interface DataFeed {
  id: string
  name: string
  source: string
  category: string
  status: FeedStatus
  enabled: boolean
  lastConnected: string // ISO timestamp
  frequency: string
  recordsPopulated: number
  datasets: { name: string; records: number }[]
  error?: string
  history: FeedRun[]
}

// Prototype data feeds flowing into the platform. In production these would come
// from the sync/orchestration service.
const initialFeeds: DataFeed[] = [
  {
    id: "arbor",
    name: "Arbor MIS",
    source: "Arbor",
    category: "MIS",
    status: "healthy",
    enabled: true,
    lastConnected: "2026-07-21T06:12:00Z",
    frequency: "Every 6 hours",
    recordsPopulated: 48213,
    datasets: [
      { name: "Students", records: 12480 },
      { name: "Attendance", records: 28110 },
      { name: "Behaviour", records: 5123 },
      { name: "Assessments", records: 2500 },
    ],
    history: [
      { time: "2026-07-21T06:12:00Z", outcome: "success", records: 48213, message: "Full sync completed" },
      { time: "2026-07-21T00:12:00Z", outcome: "success", records: 47980, message: "Full sync completed" },
      { time: "2026-07-20T18:12:00Z", outcome: "success", records: 47850, message: "Full sync completed" },
    ],
  },
  {
    id: "wonde",
    name: "Wonde Sync",
    source: "Wonde",
    category: "Data Broker",
    status: "healthy",
    enabled: true,
    lastConnected: "2026-07-21T05:40:00Z",
    frequency: "Every 12 hours",
    recordsPopulated: 15602,
    datasets: [
      { name: "Staff", records: 1820 },
      { name: "Students", records: 12480 },
      { name: "Groups", records: 1302 },
    ],
    history: [
      { time: "2026-07-21T05:40:00Z", outcome: "success", records: 15602, message: "Full sync completed" },
      { time: "2026-07-20T17:40:00Z", outcome: "success", records: 15590, message: "Full sync completed" },
    ],
  },
  {
    id: "sisra",
    name: "SISRA Analytics",
    source: "Sisra",
    category: "Assessment",
    status: "error",
    enabled: true,
    lastConnected: "2026-07-20T09:25:19Z",
    frequency: "Daily at 07:00",
    recordsPopulated: 0,
    datasets: [],
    error: "Login details are incorrect (401 Unauthorized). Credentials rejected for 2 schools.",
    history: [
      { time: "2026-07-21T07:00:00Z", outcome: "error", records: 0, message: "Authentication failed — 401 Unauthorized" },
      { time: "2026-07-20T07:00:00Z", outcome: "error", records: 0, message: "Authentication failed — 401 Unauthorized" },
      { time: "2026-07-19T07:00:00Z", outcome: "success", records: 8420, message: "Full sync completed" },
    ],
  },
  {
    id: "cpoms",
    name: "CPOMS Safeguarding",
    source: "CPOMS",
    category: "Safeguarding",
    status: "warning",
    enabled: true,
    lastConnected: "2026-07-21T04:00:00Z",
    frequency: "Daily at 04:00",
    recordsPopulated: 3120,
    datasets: [
      { name: "Incidents", records: 2890 },
      { name: "Actions", records: 230 },
    ],
    error: "Partial sync — 3 of 9 schools skipped (storage link not configured).",
    history: [
      { time: "2026-07-21T04:00:00Z", outcome: "warning", records: 3120, message: "Partial sync — 3 schools skipped" },
      { time: "2026-07-20T04:00:00Z", outcome: "success", records: 3340, message: "Full sync completed" },
    ],
  },
  {
    id: "sampeople",
    name: "SAMpeople HR",
    source: "SAMpeople",
    category: "HR",
    status: "syncing",
    enabled: true,
    lastConnected: "2026-07-21T07:15:00Z",
    frequency: "Daily at 07:00",
    recordsPopulated: 1820,
    datasets: [
      { name: "Staff records", records: 1820 },
      { name: "Absence", records: 640 },
    ],
    history: [
      { time: "2026-07-21T07:15:00Z", outcome: "success", records: 1820, message: "Sync in progress" },
      { time: "2026-07-20T07:00:00Z", outcome: "success", records: 1815, message: "Full sync completed" },
    ],
  },
  {
    id: "evolve",
    name: "Evolve Trips",
    source: "Evolve",
    category: "Operations",
    status: "healthy",
    enabled: true,
    lastConnected: "2026-07-20T22:30:00Z",
    frequency: "Daily at 22:00",
    recordsPopulated: 940,
    datasets: [
      { name: "Trips", records: 410 },
      { name: "Risk assessments", records: 530 },
    ],
    history: [
      { time: "2026-07-20T22:30:00Z", outcome: "success", records: 940, message: "Full sync completed" },
    ],
  },
  {
    id: "safesmart",
    name: "Safesmart H&S",
    source: "Safesmart",
    category: "Compliance",
    status: "disabled",
    enabled: false,
    lastConnected: "2026-06-30T10:00:00Z",
    frequency: "Weekly (paused)",
    recordsPopulated: 0,
    datasets: [],
    history: [
      { time: "2026-06-30T10:00:00Z", outcome: "success", records: 1240, message: "Full sync completed before pause" },
    ],
  },
]

const statusMeta: Record<
  FeedStatus,
  { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }
> = {
  healthy: { label: "Healthy", color: "#15803d", bg: "#15803d18", Icon: CheckCircle2 },
  error: { label: "Error", color: "#dc2626", bg: "#dc262618", Icon: XCircle },
  warning: { label: "Warning", color: "#b45309", bg: "#b4530918", Icon: AlertTriangle },
  syncing: { label: "Syncing", color: "#1d4ed8", bg: "#1d4ed818", Icon: RefreshCw },
  disabled: { label: "Disabled", color: "#64748b", bg: "#64748b18", Icon: Ban },
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function StatusBadge({ status }: { status: FeedStatus }) {
  const { label, color, bg, Icon } = statusMeta[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ backgroundColor: bg, color }}
    >
      <Icon className={`w-3.5 h-3.5 ${status === "syncing" ? "animate-spin" : ""}`} />
      {label}
    </span>
  )
}

export default function ConnectionManagementPage() {
  const allowed = isPlatformAdmin()

  const [feeds, setFeeds] = useState<DataFeed[]>(initialFeeds)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | FeedStatus>("all")
  const [detailFeed, setDetailFeed] = useState<DataFeed | null>(null)

  const filtered = useMemo(() => {
    return feeds.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.source.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || f.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [feeds, search, statusFilter])

  const counts = useMemo(() => {
    return {
      total: feeds.length,
      healthy: feeds.filter((f) => f.status === "healthy").length,
      error: feeds.filter((f) => f.status === "error").length,
      warning: feeds.filter((f) => f.status === "warning").length,
    }
  }, [feeds])

  const toggleEnabled = (id: string) => {
    setFeeds((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              enabled: !f.enabled,
              status: !f.enabled ? "healthy" : "disabled",
            }
          : f,
      ),
    )
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
                  Connection Management is only available to the Fuze platform team. You are signed in as{" "}
                  <span className="font-medium text-slate-700">{CURRENT_ORG}</span>.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>
        <main className="flex-1 px-4 pb-8 overflow-auto">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#B3008918" }}
                >
                  <Cable className="w-5 h-5" style={{ color: "#B30089" }} />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">Connection Management</h1>
                  <p className="text-sm text-slate-500 max-w-2xl mt-0.5">
                    Monitor every data feed flowing into the platform. See when each feed last connected, review any
                    errors, and check exactly what data it populated on its most recent run.
                  </p>
                </div>
              </div>

              {/* Summary chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs mb-5">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                  <Database className="w-3.5 h-3.5" />
                  {counts.total} feeds
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50 text-green-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {counts.healthy} healthy
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {counts.warning} warnings
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 text-red-700">
                  <XCircle className="w-3.5 h-3.5" />
                  {counts.error} errors
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search feeds by name, source or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | FeedStatus)}>
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="syncing">Syncing</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feed table */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
                    <Cable className="w-7 h-7 text-slate-400" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900 mb-1">No feeds found</h4>
                  <p className="text-sm text-slate-500 max-w-sm">
                    No data feeds match your current search or filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-4 py-3 font-medium">Data feed</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Last connected</th>
                        <th className="px-4 py-3 font-medium">Data populated</th>
                        <th className="px-4 py-3 font-medium">Issues</th>
                        <th className="px-4 py-3 font-medium text-center">Enabled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((feed) => (
                        <tr
                          key={feed.id}
                          onClick={() => setDetailFeed(feed)}
                          className="border-b border-slate-100 last:border-0 cursor-pointer transition-colors hover:bg-slate-50"
                        >
                          {/* Feed */}
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{feed.name}</div>
                            <div className="text-xs text-slate-400">
                              {feed.source} · {feed.category} · {feed.frequency}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <StatusBadge status={feed.status} />
                          </td>

                          {/* Last connected */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {timeAgo(feed.lastConnected)}
                            </div>
                            <div className="text-xs text-slate-400">{formatDateTime(feed.lastConnected)}</div>
                          </td>

                          {/* Data populated */}
                          <td className="px-4 py-3">
                            {feed.recordsPopulated > 0 ? (
                              <>
                                <div className="text-slate-700">
                                  {feed.recordsPopulated.toLocaleString()} records
                                </div>
                                <div className="text-xs text-slate-400 truncate max-w-[220px]">
                                  {feed.datasets.map((d) => d.name).join(", ")}
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400">No data on last run</span>
                            )}
                          </td>

                          {/* Issues */}
                          <td className="px-4 py-3 max-w-[260px]">
                            {feed.error ? (
                              <span className="text-xs text-red-600 line-clamp-2">{feed.error}</span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>

                          {/* Enabled */}
                          <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <Switch
                              checked={feed.enabled}
                              onCheckedChange={() => toggleEnabled(feed.id)}
                              aria-label={`Toggle ${feed.name}`}
                              className="data-[state=checked]:bg-[#121051]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Feed detail dialog */}
      <Dialog open={!!detailFeed} onOpenChange={(open) => !open && setDetailFeed(null)}>
        <DialogContent className="max-w-lg">
          {detailFeed && (
            <>
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{detailFeed.name}</h2>
                  <p className="text-xs text-slate-400">
                    {detailFeed.source} · {detailFeed.category} · {detailFeed.frequency}
                  </p>
                </div>
                <StatusBadge status={detailFeed.status} />
              </div>

              {/* Last connection */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs text-slate-400 mb-0.5">Last connected</div>
                  <div className="text-sm font-medium text-slate-900">{formatDateTime(detailFeed.lastConnected)}</div>
                  <div className="text-xs text-slate-400">{timeAgo(detailFeed.lastConnected)}</div>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs text-slate-400 mb-0.5">Records populated</div>
                  <div className="text-sm font-medium text-slate-900">
                    {detailFeed.recordsPopulated.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">on last run</div>
                </div>
              </div>

              {/* Error */}
              {detailFeed.error && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{detailFeed.error}</p>
                </div>
              )}

              {/* Datasets populated */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Data populated</h3>
                {detailFeed.datasets.length > 0 ? (
                  <div className="space-y-1.5">
                    {detailFeed.datasets.map((d) => (
                      <div
                        key={d.name}
                        className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm"
                      >
                        <span className="flex items-center gap-2 text-slate-700">
                          <Database className="w-3.5 h-3.5 text-slate-400" />
                          {d.name}
                        </span>
                        <span className="text-slate-500">{d.records.toLocaleString()} records</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No datasets were populated on the last run.</p>
                )}
              </div>

              {/* Recent run history */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Recent runs</h3>
                <div className="space-y-1.5">
                  {detailFeed.history.map((run, i) => {
                    const runColor =
                      run.outcome === "success"
                        ? "#15803d"
                        : run.outcome === "warning"
                          ? "#b45309"
                          : "#dc2626"
                    const RunIcon =
                      run.outcome === "success" ? CheckCircle2 : run.outcome === "warning" ? AlertTriangle : XCircle
                    return (
                      <div key={i} className="flex items-start gap-2 rounded-md border border-slate-100 px-3 py-2">
                        <RunIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: runColor }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-slate-700">{formatDateTime(run.time)}</span>
                            <span className="text-xs text-slate-400">{run.records.toLocaleString()} records</span>
                          </div>
                          <p className="text-xs text-slate-500">{run.message}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDetailFeed(null)}>
                  Close
                </Button>
                <Button className="text-white" style={{ backgroundColor: NAVY }}>
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  Sync now
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
