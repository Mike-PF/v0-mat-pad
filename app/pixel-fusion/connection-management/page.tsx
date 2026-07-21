"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
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
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  School,
  Building2,
} from "lucide-react"
import { isPlatformAdmin, CURRENT_ORG } from "@/lib/current-org"

const NAVY = "#121051"

type ConnStatus = "healthy" | "error" | "warning" | "syncing" | "disabled"

interface FeedRun {
  time: string
  outcome: "success" | "error" | "warning"
  records: number
  message: string
}

interface SchoolConnection {
  id: string
  school: string
  urn: string
  status: ConnStatus
  enabled: boolean
  lastConnected: string // ISO timestamp
  recordsPopulated: number
  datasets: { name: string; records: number }[]
  error?: string
  history: FeedRun[]
}

interface Provider {
  id: string
  name: string
  source: string
  category: string
  frequency: string
  datasetNames: string[]
  logoImage?: string
  connections: SchoolConnection[]
}

// ---- Deterministic mock data generation ------------------------------------
// In production these connections come from the sync/orchestration service.
// A provider such as Arbor can have thousands of individual school connections,
// so we generate a representative set deterministically for the prototype.

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SCHOOL_PREFIXES = [
  "St Mary's", "Oakwood", "Greenfield", "Hillside", "Riverside", "Meadowbank",
  "Ashfield", "Brookfield", "St Peter's", "Highgate", "Elmwood", "Springfield",
  "Kingsway", "Northgate", "Fairfield", "St John's", "Woodlands", "Bramble Hill",
  "Priory", "Grange", "Beechwood", "St Thomas", "Parkside", "Cedar Grove",
  "Holy Trinity", "Sunnydale", "Millbrook", "Rosewood", "Whitehall", "Castleford",
]
const SCHOOL_TYPES = [
  "Primary School", "Academy", "High School", "Community College", "C of E Primary",
  "Junior School", "Infant School", "Secondary School", "Free School", "Sixth Form College",
]
const TOWNS = [
  "Leeds", "Bristol", "Sheffield", "Norwich", "Preston", "Exeter", "Derby",
  "Bolton", "Reading", "Ipswich", "Luton", "Chester", "Poole", "Dudley", "Wigan",
]

const providerConfigs: {
  id: string
  name: string
  source: string
  category: string
  frequency: string
  datasetNames: string[]
  schoolCount: number
  disabled?: boolean
  logoImage?: string
}[] = [
  { id: "arbor", name: "Arbor MIS", source: "Arbor", category: "MIS", frequency: "Every 6 hours", datasetNames: ["Students", "Attendance", "Behaviour", "Assessments"], schoolCount: 2437, logoImage: "/images/logos/arbor.png" },
  { id: "wonde", name: "Wonde Sync", source: "Wonde", category: "Data Broker", frequency: "Every 12 hours", datasetNames: ["Staff", "Students", "Groups"], schoolCount: 1890, logoImage: "/images/logos/wonde.png" },
  { id: "sims", name: "SIMS Connect", source: "SIMS", category: "MIS", frequency: "Every 6 hours", datasetNames: ["Students", "Attendance", "Contacts"], schoolCount: 1204 },
  { id: "sisra", name: "SISRA Analytics", source: "Sisra", category: "Assessment", frequency: "Daily at 07:00", datasetNames: ["Assessments", "Grades"], schoolCount: 642, logoImage: "/images/logos/sisra.png" },
  { id: "cpoms", name: "CPOMS Safeguarding", source: "CPOMS", category: "Safeguarding", frequency: "Daily at 04:00", datasetNames: ["Incidents", "Actions"], schoolCount: 388, logoImage: "/images/logos/cpoms.png" },
  { id: "sampeople", name: "SAMpeople HR", source: "SAMpeople", category: "HR", frequency: "Daily at 07:00", datasetNames: ["Staff records", "Absence"], schoolCount: 205, logoImage: "/images/logos/sampeople.png" },
  { id: "evolve", name: "Evolve Trips", source: "Evolve", category: "Operations", frequency: "Daily at 22:00", datasetNames: ["Trips", "Risk assessments"], schoolCount: 96, logoImage: "/images/logos/evolve.png" },
  { id: "safesmart", name: "Safesmart H&S", source: "Safesmart", category: "Compliance", frequency: "Weekly (paused)", datasetNames: ["Checks", "Assets"], schoolCount: 54, disabled: true, logoImage: "/images/logos/safesmart.png" },
]

const NOW = new Date("2026-07-21T08:00:00Z").getTime()

function buildProviders(): Provider[] {
  return providerConfigs.map((cfg, pIdx) => {
    const rand = mulberry32(pIdx * 9973 + 12345)
    const connections: SchoolConnection[] = []

    for (let i = 0; i < cfg.schoolCount; i++) {
      const prefix = SCHOOL_PREFIXES[Math.floor(rand() * SCHOOL_PREFIXES.length)]
      const type = SCHOOL_TYPES[Math.floor(rand() * SCHOOL_TYPES.length)]
      const town = TOWNS[Math.floor(rand() * TOWNS.length)]
      const school = `${prefix} ${type}, ${town}`
      const urn = String(100000 + Math.floor(rand() * 899999))

      // Status distribution — mostly healthy with a realistic tail of issues.
      let status: ConnStatus
      const roll = rand()
      if (cfg.disabled) {
        status = "disabled"
      } else if (roll < 0.9) {
        status = "healthy"
      } else if (roll < 0.955) {
        status = "warning"
      } else if (roll < 0.99) {
        status = "error"
      } else {
        status = "syncing"
      }

      const enabled = status !== "disabled"
      const hoursAgo = status === "healthy" || status === "syncing" ? rand() * 8 : 6 + rand() * 72
      const lastConnected = new Date(NOW - hoursAgo * 3600_000).toISOString()

      const hasData = status === "healthy" || status === "syncing" || status === "warning"
      const datasets = hasData
        ? cfg.datasetNames.map((name) => ({
            name,
            records: 40 + Math.floor(rand() * 4000),
          }))
        : []
      const recordsPopulated = datasets.reduce((s, d) => s + d.records, 0)

      let error: string | undefined
      if (status === "error") {
        const errs = [
          "Login details are incorrect (401 Unauthorized).",
          "Connection timed out after 30s (no response from host).",
          "API rate limit exceeded — sync deferred.",
          "Data mapping failed — unexpected field in Students feed.",
        ]
        error = errs[Math.floor(rand() * errs.length)]
      } else if (status === "warning") {
        const warns = [
          "Partial sync — Behaviour dataset skipped (permission denied).",
          "3 records rejected due to missing UPN.",
          "Attendance feed returned stale data (last updated 2 days ago).",
        ]
        error = warns[Math.floor(rand() * warns.length)]
      }

      const history: FeedRun[] = [
        {
          time: lastConnected,
          outcome: status === "error" ? "error" : status === "warning" ? "warning" : "success",
          records: recordsPopulated,
          message:
            status === "error"
              ? (error ?? "Sync failed")
              : status === "warning"
                ? (error ?? "Partial sync completed")
                : status === "syncing"
                  ? "Sync in progress"
                  : "Full sync completed",
        },
        {
          time: new Date(NOW - (hoursAgo + 12) * 3600_000).toISOString(),
          outcome: "success",
          records: Math.max(0, recordsPopulated - Math.floor(rand() * 200)),
          message: "Full sync completed",
        },
      ]

      connections.push({
        id: `${cfg.id}-${i}`,
        school,
        urn,
        status,
        enabled,
        lastConnected,
        recordsPopulated,
        datasets,
        error,
        history,
      })
    }

    return {
      id: cfg.id,
      name: cfg.name,
      source: cfg.source,
      category: cfg.category,
      frequency: cfg.frequency,
      datasetNames: cfg.datasetNames,
      logoImage: cfg.logoImage,
      connections,
    }
  })
}

const statusMeta: Record<
  ConnStatus,
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
  const diff = NOW - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

interface Summary {
  total: number
  healthy: number
  warning: number
  error: number
  syncing: number
  disabled: number
  lastConnected: string | null
  totalRecords: number
}

function summarize(connections: SchoolConnection[]): Summary {
  const s: Summary = {
    total: connections.length,
    healthy: 0,
    warning: 0,
    error: 0,
    syncing: 0,
    disabled: 0,
    lastConnected: null,
    totalRecords: 0,
  }
  for (const c of connections) {
    s[c.status]++
    s.totalRecords += c.recordsPopulated
    if (c.status !== "error" && c.status !== "disabled") {
      if (!s.lastConnected || c.lastConnected > s.lastConnected) s.lastConnected = c.lastConnected
    }
  }
  return s
}

function overallStatus(s: Summary): ConnStatus {
  if (s.total > 0 && s.disabled === s.total) return "disabled"
  if (s.error > 0) return "error"
  if (s.warning > 0) return "warning"
  if (s.syncing > 0) return "syncing"
  return "healthy"
}

function StatusBadge({ status }: { status: ConnStatus }) {
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

// Proportional health bar across a provider's connections.
function HealthBar({ s }: { s: Summary }) {
  const active = s.total - s.disabled
  if (active === 0) {
    return <div className="h-1.5 w-full rounded-full bg-slate-200" />
  }
  const seg = (n: number) => `${(n / active) * 100}%`
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div style={{ width: seg(s.healthy), backgroundColor: statusMeta.healthy.color }} />
      <div style={{ width: seg(s.syncing), backgroundColor: statusMeta.syncing.color }} />
      <div style={{ width: seg(s.warning), backgroundColor: statusMeta.warning.color }} />
      <div style={{ width: seg(s.error), backgroundColor: statusMeta.error.color }} />
    </div>
  )
}

const PAGE_SIZE = 20

export default function ConnectionManagementPage() {
  const allowed = isPlatformAdmin()

  const [providers, setProviders] = useState<Provider[]>(() => buildProviders())
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Overview filters
  const [providerSearch, setProviderSearch] = useState("")

  // Drill-in filters
  const [connSearch, setConnSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ConnStatus>("all")
  const [page, setPage] = useState(1)
  const [detailConn, setDetailConn] = useState<SchoolConnection | null>(null)

  const selected = providers.find((p) => p.id === selectedId) ?? null

  // Per-provider summaries (memoized).
  const summaries = useMemo(() => {
    const map: Record<string, Summary> = {}
    for (const p of providers) map[p.id] = summarize(p.connections)
    return map
  }, [providers])

  // Platform-wide totals.
  const totals = useMemo(() => {
    const acc: Summary = {
      total: 0, healthy: 0, warning: 0, error: 0, syncing: 0, disabled: 0,
      lastConnected: null, totalRecords: 0,
    }
    for (const p of providers) {
      const s = summaries[p.id]
      acc.total += s.total
      acc.healthy += s.healthy
      acc.warning += s.warning
      acc.error += s.error
      acc.syncing += s.syncing
      acc.disabled += s.disabled
      acc.totalRecords += s.totalRecords
    }
    return acc
  }, [providers, summaries])

  const filteredProviders = useMemo(() => {
    const q = providerSearch.toLowerCase()
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.source.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }, [providers, providerSearch])

  const filteredConns = useMemo(() => {
    if (!selected) return []
    const q = connSearch.toLowerCase()
    return selected.connections.filter((c) => {
      const matchesSearch =
        c.school.toLowerCase().includes(q) || c.urn.includes(q)
      const matchesStatus = statusFilter === "all" || c.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [selected, connSearch, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filteredConns.length / PAGE_SIZE))
  const pagedConns = filteredConns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openProvider = (id: string) => {
    setSelectedId(id)
    setConnSearch("")
    setStatusFilter("all")
    setPage(1)
  }

  const toggleConnection = (connId: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id !== selectedId
          ? p
          : {
              ...p,
              connections: p.connections.map((c) =>
                c.id === connId
                  ? { ...c, enabled: !c.enabled, status: !c.enabled ? "healthy" : "disabled" }
                  : c,
              ),
            },
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
                </div>
              </div>

              {/* Platform-wide summary chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs mb-5">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                  <Building2 className="w-3.5 h-3.5" />
                  {providers.length} providers
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                  <School className="w-3.5 h-3.5" />
                  {totals.total.toLocaleString()} connections
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50 text-green-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {totals.healthy.toLocaleString()} healthy
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {totals.warning.toLocaleString()} warnings
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 text-red-700">
                  <XCircle className="w-3.5 h-3.5" />
                  {totals.error.toLocaleString()} errors
                </span>
              </div>

              {!selected ? (
                /* ---------------- Providers overview ---------------- */
                <>
                  <div className="relative mb-5 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search providers by name, source or category..."
                      value={providerSearch}
                      onChange={(e) => setProviderSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                          <th className="px-4 py-3 font-medium">Provider</th>
                          <th className="px-4 py-3 font-medium">Overall state</th>
                          <th className="px-4 py-3 font-medium">Connections</th>
                          <th className="px-4 py-3 font-medium">Last successful sync</th>
                          <th className="px-4 py-3 font-medium">Data populated</th>
                          <th className="px-4 py-3 font-medium w-8" />
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProviders.map((p) => {
                          const s = summaries[p.id]
                          return (
                            <tr
                              key={p.id}
                              onClick={() => openProvider(p.id)}
                              className="border-b border-slate-100 last:border-0 cursor-pointer transition-colors hover:bg-slate-50"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-9 flex-shrink-0 flex items-center justify-center rounded-md bg-white">
                                    {p.logoImage ? (
                                      <Image
                                        src={p.logoImage}
                                        alt={`${p.name} logo`}
                                        width={56}
                                        height={28}
                                        className="object-contain max-h-7"
                                      />
                                    ) : (
                                      <Cable className="w-4 h-4 text-slate-400" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900">{p.name}</div>
                                    <div className="text-xs text-slate-400">
                                      {p.source} · {p.category} · {p.frequency}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 min-w-[220px]">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <StatusBadge status={overallStatus(s)} />
                                  {s.error > 0 && (
                                    <span className="text-xs text-red-600">{s.error.toLocaleString()} errors</span>
                                  )}
                                  {s.error === 0 && s.warning > 0 && (
                                    <span className="text-xs text-amber-600">
                                      {s.warning.toLocaleString()} warnings
                                    </span>
                                  )}
                                </div>
                                <HealthBar s={s} />
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-slate-700">{s.total.toLocaleString()} schools</div>
                                <div className="text-xs text-slate-400">
                                  {s.healthy.toLocaleString()} healthy · {s.disabled.toLocaleString()} off
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {s.lastConnected ? (
                                  <>
                                    <div className="flex items-center gap-1.5 text-slate-700">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      {timeAgo(s.lastConnected)}
                                    </div>
                                    <div className="text-xs text-slate-400">{formatDateTime(s.lastConnected)}</div>
                                  </>
                                ) : (
                                  <span className="text-xs text-slate-400">Never</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-slate-700">{s.totalRecords.toLocaleString()} records</div>
                                <div className="text-xs text-slate-400 truncate max-w-[200px]">
                                  {p.datasetNames.join(", ")}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* ---------------- Per-school connections ---------------- */
                <>
                  {(() => {
                    const s = summaries[selected.id]
                    return (
                      <>
                        <button
                          onClick={() => setSelectedId(null)}
                          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          All providers
                        </button>

                        {/* Provider summary header */}
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-20 h-11 flex-shrink-0 flex items-center justify-center rounded-md border border-slate-200 bg-white">
                              {selected.logoImage ? (
                                <Image
                                  src={selected.logoImage}
                                  alt={`${selected.name} logo`}
                                  width={72}
                                  height={36}
                                  className="object-contain max-h-9"
                                />
                              ) : (
                                <Cable className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h2 className="text-base font-semibold text-slate-900">{selected.name}</h2>
                                <StatusBadge status={overallStatus(s)} />
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {selected.source} · {selected.category} · {selected.frequency}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div>
                              <div className="text-xs text-slate-400">Connections</div>
                              <div className="font-semibold text-slate-900">{s.total.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400">Healthy</div>
                              <div className="font-semibold text-green-700">{s.healthy.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400">Warnings</div>
                              <div className="font-semibold text-amber-600">{s.warning.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400">Errors</div>
                              <div className="font-semibold text-red-600">{s.error.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400">Records</div>
                              <div className="font-semibold text-slate-900">{s.totalRecords.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>

                        {/* Drill-in filters */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              placeholder="Search by school name or URN..."
                              value={connSearch}
                              onChange={(e) => {
                                setConnSearch(e.target.value)
                                setPage(1)
                              }}
                              className="pl-9"
                            />
                          </div>
                          <Select
                            value={statusFilter}
                            onValueChange={(v) => {
                              setStatusFilter(v as "all" | ConnStatus)
                              setPage(1)
                            }}
                          >
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

                        {filteredConns.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
                              <School className="w-7 h-7 text-slate-400" />
                            </div>
                            <h4 className="text-base font-semibold text-slate-900 mb-1">No connections found</h4>
                            <p className="text-sm text-slate-500 max-w-sm">
                              No school connections match your current search or filter.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                              <table className="w-full text-left text-sm">
                                <thead>
                                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-4 py-3 font-medium">School</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Last connected</th>
                                    <th className="px-4 py-3 font-medium">Data populated</th>
                                    <th className="px-4 py-3 font-medium">Issues</th>
                                    <th className="px-4 py-3 font-medium text-center">Enabled</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {pagedConns.map((c) => (
                                    <tr
                                      key={c.id}
                                      onClick={() => setDetailConn(c)}
                                      className="border-b border-slate-100 last:border-0 cursor-pointer transition-colors hover:bg-slate-50"
                                    >
                                      <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900">{c.school}</div>
                                        <div className="text-xs text-slate-400">URN {c.urn}</div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <StatusBadge status={c.status} />
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 text-slate-700">
                                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                                          {timeAgo(c.lastConnected)}
                                        </div>
                                        <div className="text-xs text-slate-400">{formatDateTime(c.lastConnected)}</div>
                                      </td>
                                      <td className="px-4 py-3">
                                        {c.recordsPopulated > 0 ? (
                                          <>
                                            <div className="text-slate-700">
                                              {c.recordsPopulated.toLocaleString()} records
                                            </div>
                                            <div className="text-xs text-slate-400 truncate max-w-[200px]">
                                              {c.datasets.map((d) => d.name).join(", ")}
                                            </div>
                                          </>
                                        ) : (
                                          <span className="text-xs text-slate-400">No data on last run</span>
                                        )}
                                      </td>
                                      <td className="px-4 py-3 max-w-[240px]">
                                        {c.error ? (
                                          <span
                                            className={`text-xs line-clamp-2 ${
                                              c.status === "error" ? "text-red-600" : "text-amber-600"
                                            }`}
                                          >
                                            {c.error}
                                          </span>
                                        ) : (
                                          <span className="text-xs text-slate-400">—</span>
                                        )}
                                      </td>
                                      <td
                                        className="px-4 py-3 text-center"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Switch
                                          checked={c.enabled}
                                          onCheckedChange={() => toggleConnection(c.id)}
                                          aria-label={`Toggle ${c.school}`}
                                          className="data-[state=checked]:bg-[#121051]"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4 text-sm">
                              <span className="text-slate-500">
                                Showing {(page - 1) * PAGE_SIZE + 1}–
                                {Math.min(page * PAGE_SIZE, filteredConns.length)} of{" "}
                                {filteredConns.length.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={page <= 1}
                                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                                >
                                  <ChevronLeft className="w-4 h-4 mr-1" />
                                  Previous
                                </Button>
                                <span className="text-slate-500">
                                  Page {page} of {pageCount}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={page >= pageCount}
                                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                                >
                                  Next
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )
                  })()}
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Connection detail dialog */}
      <Dialog open={!!detailConn} onOpenChange={(open) => !open && setDetailConn(null)}>
        <DialogContent className="max-w-lg">
          {detailConn && (
            <>
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{detailConn.school}</h2>
                  <p className="text-xs text-slate-400">
                    {selected?.name} · URN {detailConn.urn}
                  </p>
                </div>
                <StatusBadge status={detailConn.status} />
              </div>

              {/* Last connection */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs text-slate-400 mb-0.5">Last connected</div>
                  <div className="text-sm font-medium text-slate-900">{formatDateTime(detailConn.lastConnected)}</div>
                  <div className="text-xs text-slate-400">{timeAgo(detailConn.lastConnected)}</div>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="text-xs text-slate-400 mb-0.5">Records populated</div>
                  <div className="text-sm font-medium text-slate-900">
                    {detailConn.recordsPopulated.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">on last run</div>
                </div>
              </div>

              {/* Error */}
              {detailConn.error && (
                <div
                  className={`mt-3 flex items-start gap-2 rounded-lg border p-3 ${
                    detailConn.status === "error"
                      ? "border-red-200 bg-red-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  {detailConn.status === "error" ? (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <p className={`text-xs ${detailConn.status === "error" ? "text-red-700" : "text-amber-700"}`}>
                    {detailConn.error}
                  </p>
                </div>
              )}

              {/* Datasets populated */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Data populated</h3>
                {detailConn.datasets.length > 0 ? (
                  <div className="space-y-1.5">
                    {detailConn.datasets.map((d) => (
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
                  {detailConn.history.map((run, i) => {
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
                <Button variant="outline" onClick={() => setDetailConn(null)}>
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
