"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  ArrowRight,
  CalendarDays,
  Megaphone,
  Wrench,
  AlertCircle,
  AlertTriangle,
  Ban,
  UserMinus,
  Info,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Download,
  X,
  Play,
  ChevronRight,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useNotifications, getTypeIcon, getTypeColor, isCurrentlyNew, downloadDocument, type WhatsNewItem } from "@/lib/notifications"

const ACCENT = "hsl(314 100% 35%)"

// --- Mock data ---

// KPI data
const kpiData = {
  attendance: {
    current: 94.2,
    target: 96.0,
    trend: -0.3,
    nationalAvg: 94.5,
  },
  persistentAbsence: {
    current: 8.1,
    target: 10.0,
    trend: +0.4,
    nationalAvg: 9.2,
  },
  suspensions: {
    current: 23,
    thisWeek: 3,
    trend: +2,
  },
  permanentExclusions: {
    current: 1,
    total: 2,
  },
}

// Schools overview data (combined)
const schoolsOverview = [
  {
    name: "All Saints' Catholic High School",
    abbr: "ASHS",
    pupils: 1240,
    attendance: 95.7,
    pa: 6.8,
    suspensions: 12,
    pex: 1,
    pp: 24.0,
    send: 15.0,
    eal: 10.0,
    idaci: 3,
  },
  {
    name: "Emmaus Catholic Primary School",
    abbr: "ECPS",
    pupils: 420,
    attendance: 93.7,
    pa: 9.2,
    suspensions: 2,
    pex: 0,
    pp: 35.0,
    send: 15.0,
    eal: 20.0,
    idaci: 2,
  },
  {
    name: "Notre Dame High School",
    abbr: "NDHS",
    pupils: 980,
    attendance: 93.2,
    pa: 8.4,
    suspensions: 9,
    pex: 1,
    pp: 20.0,
    send: 14.0,
    eal: 8.0,
    idaci: 5,
  },
]

// Ofsted judgements, ordered by concern (worst first) so "needs attention" surfaces at the top.
const OFSTED_JUDGEMENTS = ["Inadequate", "Requires Improvement", "Good", "Outstanding"] as const
type OfstedJudgement = (typeof OFSTED_JUDGEMENTS)[number]

interface OfstedSchool {
  name: string
  abbr: string
  judgement: OfstedJudgement
  date: string
}

// Build a realistic MAT-sized dataset. Deterministic so it stays stable across renders.
const SAINT_NAMES = [
  "All Saints",
  "St Aidan",
  "St Bede",
  "St Cuthbert",
  "St Dominic",
  "St Edmund",
  "St Francis",
  "St Gregory",
  "St Hilda",
  "St Ignatius",
  "St John Fisher",
  "St Katherine",
  "St Leonard",
  "St Margaret",
  "St Nicholas",
  "St Oswald",
  "St Patrick",
  "St Ralph",
  "St Teresa",
  "St Ursula",
  "St Vincent",
  "St Wilfrid",
  "Blessed Sacrament",
  "Holy Cross",
  "Holy Family",
  "Christ the King",
  "Corpus Christi",
  "Emmaus",
  "Good Shepherd",
  "Notre Dame",
  "Our Lady",
  "Sacred Heart",
]
const SCHOOL_TYPES = [
  "Catholic Primary School",
  "Catholic High School",
  "Catholic Voluntary Academy",
  "Catholic Junior School",
  "Catholic Infant School",
]

function buildOfstedData(count: number): OfstedSchool[] {
  // Weighted, realistic distribution (mostly Good, some Outstanding, fewer concerns).
  const pattern: OfstedJudgement[] = [
    "Good",
    "Good",
    "Outstanding",
    "Good",
    "Requires Improvement",
    "Good",
    "Good",
    "Outstanding",
    "Good",
    "Requires Improvement",
    "Good",
    "Good",
    "Outstanding",
    "Good",
    "Inadequate",
    "Good",
    "Good",
    "Requires Improvement",
    "Good",
    "Outstanding",
  ]
  const months = ["Jan", "Mar", "May", "Jun", "Sep", "Nov"]
  const schools: OfstedSchool[] = []
  for (let i = 0; i < count; i++) {
    const saint = SAINT_NAMES[i % SAINT_NAMES.length]
    const type = SCHOOL_TYPES[Math.floor(i / SAINT_NAMES.length) % SCHOOL_TYPES.length]
    const name = `${saint} ${type}`
    const abbr = saint
      .replace(/^St /, "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    const judgement = pattern[i % pattern.length]
    const year = 2021 + (i % 4)
    const month = months[i % months.length]
    schools.push({ name, abbr, judgement, date: `${month} ${year}` })
  }
  return schools
}

// Change this number to scale the trust size (handles 5, 10, 50, 66, ...).
const ofstedData: OfstedSchool[] = buildOfstedData(66)

const getOfstedColor = (judgement: string) => {
  switch (judgement) {
    case "Outstanding":
      return { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", bar: "bg-emerald-500" }
    case "Good":
      return { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500", bar: "bg-blue-500" }
    case "Requires Improvement":
      return { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", bar: "bg-amber-500" }
    case "Inadequate":
      return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", bar: "bg-red-500" }
    default:
      return { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400", bar: "bg-slate-400" }
  }
}

const ofstedShortLabel = (judgement: string) => {
  switch (judgement) {
    case "Requires Improvement":
      return "RI"
    default:
      return judgement
  }
}

// Ordering index used to surface concerns (Inadequate → RI) first when listing schools.
const ofstedConcernOrder: Record<OfstedJudgement, number> = {
  Inadequate: 0,
  "Requires Improvement": 1,
  Good: 2,
  Outstanding: 3,
}

const ofstedTotal = ofstedData.length
const ofstedCounts = OFSTED_JUDGEMENTS.map((judgement) => ({
  judgement,
  count: ofstedData.filter((s) => s.judgement === judgement).length,
})).filter((c) => c.count > 0)
const ofstedSorted = [...ofstedData].sort((a, b) => {
  const order = ofstedConcernOrder[a.judgement] - ofstedConcernOrder[b.judgement]
  return order !== 0 ? order : a.name.localeCompare(b.name)
})
const ofstedConcernCount = ofstedData.filter(
  (s) => s.judgement === "Inadequate" || s.judgement === "Requires Improvement",
).length

export function HomeContent() {
  const [selectedTab, setSelectedTab] = useState<"all" | "updates" | "deadlines" | "system">("all")
  const [selectedItem, setSelectedItem] = useState<WhatsNewItem | null>(null)
  const { items: notifications } = useNotifications()

  const filteredNews = notifications.filter((item) => {
    if (!item.visible) return false
    if (selectedTab === "all") return true
    if (selectedTab === "updates") return item.type === "update"
    if (selectedTab === "deadlines") return item.type === "deadline"
    if (selectedTab === "system") return item.type === "system"
    return true
  })

  return (
    <div className="space-y-6">
      {/* Slide-out detail panel */}
      {selectedItem && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setSelectedItem(null)}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-[520px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div
              className="flex items-start gap-3 px-6 py-5 border-b border-slate-200"
              style={{ borderTopColor: getTypeColor(selectedItem.type), borderTopWidth: 3 }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${getTypeColor(selectedItem.type)}18` }}
              >
                {(() => { const Icon = getTypeIcon(selectedItem.type); return <Icon className="w-4 h-4" style={{ color: getTypeColor(selectedItem.type) }} /> })()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold text-slate-900">{selectedItem.title}</h2>
                  {isCurrentlyNew(selectedItem) && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded">NEW</span>
                  )}
                  {selectedItem.isUrgent && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded">URGENT</span>
                  )}
                  {selectedItem.isActive && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500 text-white rounded">ACTIVE</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{selectedItem.date}{selectedItem.daysLeft !== undefined ? ` · ${selectedItem.daysLeft} days remaining` : ""}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Body text */}
              {selectedItem.body && (
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedItem.body}
                </div>
              )}

              {/* Embedded video */}
              {selectedItem.video && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{selectedItem.video.title}</span>
                  </div>
                  <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={selectedItem.video.url}
                      title={selectedItem.video.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Document attachments */}
              {selectedItem.documents && selectedItem.documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Attachments</p>
                  {selectedItem.documents.map((doc, i) => {
                    const docColors: Record<string, string> = { pdf: "text-red-600 bg-red-50", xlsx: "text-emerald-600 bg-emerald-50", xls: "text-emerald-600 bg-emerald-50", docx: "text-blue-600 bg-blue-50", doc: "text-blue-600 bg-blue-50" }
                    const colors = docColors[doc.type] || "text-slate-600 bg-slate-50"
                    const downloadable = Boolean(doc.dataUrl)
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={!downloadable}
                        onClick={() => downloadDocument(doc)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 transition-all text-left group ${downloadable ? "hover:border-slate-300 hover:shadow-sm" : "cursor-default"}`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-[10px] ${colors}`}>
                          {doc.type.slice(0, 4).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.size}</p>
                        </div>
                        {downloadable ? (
                          <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
                        ) : (
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 text-balance">Good morning, Gareth</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here&apos;s what&apos;s happening across your MAT today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Academic Year 2024/25 — Spring Term</span>
        </div>
      </div>

      {/* Top row: KPI Cards + What's New */}
      <div className="grid grid-cols-12 gap-4">
        {/* KPI Cards - Left side */}
        <div className="col-span-7 grid grid-cols-2 gap-4">
          {/* Attendance KPI */}
          <Link href="/dashboards" className="group">
            <Card className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-slate-600">Overall Attendance</p>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-slate-900">{kpiData.attendance.current}%</span>
                  <div className="flex items-center gap-1 mb-1.5">
                    {kpiData.attendance.trend < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    )}
                    <span className={`text-sm font-medium ${kpiData.attendance.trend < 0 ? "text-red-500" : "text-emerald-500"}`}>
                      {kpiData.attendance.trend > 0 ? "+" : ""}{kpiData.attendance.trend}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                  <div className="text-xs">
                    <span className="text-slate-400">Target: </span>
                    <span className="font-semibold text-slate-600">{kpiData.attendance.target}%</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400">National: </span>
                    <span className="font-semibold text-slate-600">{kpiData.attendance.nationalAvg}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Persistent Absence KPI */}
          <Link href="/dashboards" className="group">
            <Card className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-medium text-slate-600">Persistent Absence</p>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-slate-900">{kpiData.persistentAbsence.current}%</span>
                  <div className="flex items-center gap-1 mb-1.5">
                    {kpiData.persistentAbsence.trend > 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-emerald-500" />
                    )}
                    <span className={`text-sm font-medium ${kpiData.persistentAbsence.trend > 0 ? "text-red-500" : "text-emerald-500"}`}>
                      {kpiData.persistentAbsence.trend > 0 ? "+" : ""}{kpiData.persistentAbsence.trend}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                  <div className="text-xs">
                    <span className="text-slate-400">Target: </span>
                    <span className="font-semibold text-slate-600">&lt;{kpiData.persistentAbsence.target}%</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400">National: </span>
                    <span className="font-semibold text-slate-600">{kpiData.persistentAbsence.nationalAvg}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Suspensions KPI */}
          <Link href="/dashboards" className="group">
            <Card className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <UserMinus className="w-4 h-4 text-amber-500" />
                    <p className="text-sm font-medium text-slate-600">Suspensions (YTD)</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-slate-900">{kpiData.suspensions.current}</span>
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-sm font-medium text-amber-600">
                      +{kpiData.suspensions.thisWeek} this week
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Permanent Exclusions KPI */}
          <Link href="/dashboards" className="group">
            <Card className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Ban className="w-4 h-4 text-red-500" />
                    <p className="text-sm font-medium text-slate-600">Permanent Exclusions (YTD)</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-bold text-slate-900">{kpiData.permanentExclusions.current}</span>
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-sm text-slate-500">
                      ({kpiData.permanentExclusions.total} total)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* What's New / Key Dates - Right side */}
        <div className="col-span-5">
          <Card className="bg-white border-slate-200 h-full">
            <CardHeader className="pb-2 px-5 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-slate-400" />
                  <CardTitle className="text-sm font-semibold text-slate-900">What&apos;s New &amp; Key Dates</CardTitle>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {(["all", "updates", "deadlines", "system"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`px-2 py-1 rounded-md capitalize transition-colors ${
                        selectedTab === tab
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="space-y-2 max-h-[252px] overflow-y-auto">
                {filteredNews.map((item, i) => {
                  const Icon = getTypeIcon(item.type)
                  const color = getTypeColor(item.type)
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-lg border transition-all text-left cursor-pointer group ${
                        item.isUrgent
                          ? "border-red-200 bg-red-50/50 hover:border-red-300"
                          : isCurrentlyNew(item)
                          ? "border-blue-200 bg-blue-50/50 hover:border-blue-300"
                          : item.isActive
                          ? "border-amber-200 bg-amber-50/50 hover:border-amber-300"
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}18` }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                          {isCurrentlyNew(item) && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded shrink-0">NEW</span>
                          )}
                          {item.isUrgent && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded shrink-0">URGENT</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-slate-500">{item.date}</p>
                          {item.daysLeft !== undefined && item.daysLeft <= 7 && (
                            <p className={`text-xs font-semibold ${item.daysLeft <= 3 ? "text-red-600" : "text-amber-600"}`}>
                              {item.daysLeft}d left
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors ml-1" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schools Overview - Combined table */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3 px-5 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <CardTitle className="text-sm font-semibold text-slate-900">Schools Overview</CardTitle>
            </div>
            <Link href="/dashboards" className="text-xs text-primary hover:underline flex items-center gap-1">
              View detailed dashboards <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 pb-3 pr-4">School</th>
                  <th className="text-center text-xs font-semibold text-slate-500 pb-3 px-3">Pupils</th>
                  <th className="text-center text-xs font-semibold text-slate-500 pb-3 px-3 border-l border-slate-100">Attendance</th>
                  <th className="text-center text-xs font-semibold text-slate-500 pb-3 px-3">PA %</th>
                  <th className="text-center text-xs font-semibold text-slate-500 pb-3 px-3 border-l border-slate-100">Suspensions</th>
                  <th className="text-center text-xs font-semibold text-slate-500 pb-3 px-3">PEX</th>
                  <th className="text-center text-xs font-semibold text-slate-500 pb-3 px-3 border-l border-slate-100">PP %</th>
                  <th className="text-center text-xs font-semibold text-slate-500 pb-3 px-3">SEND %</th>
                  <th className="text-center text-xs font-semibold text-slate-500 pb-3 px-3">EAL %</th>
                  <th className="text-center text-xs font-semibold text-slate-500 pb-3 pl-3">IDACI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schoolsOverview.map((school) => {
                  const attendanceColor = school.attendance >= 95 ? "text-emerald-600" : school.attendance >= 93 ? "text-amber-600" : "text-red-600"
                  const paColor = school.pa <= 8 ? "text-emerald-600" : school.pa <= 10 ? "text-amber-600" : "text-red-600"
                  const idaciColor = school.idaci <= 2 ? "bg-red-100 text-red-700" : school.idaci <= 4 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                  
                  return (
                    <tr key={school.name} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-6 rounded-full shrink-0" style={{ backgroundColor: ACCENT }} />
                          <div>
                            <span className="text-sm text-slate-800 font-medium">{school.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-sm text-slate-700">{school.pupils.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-3 text-center border-l border-slate-100">
                        <span className={`text-sm font-semibold ${attendanceColor}`}>{school.attendance}%</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-sm font-semibold ${paColor}`}>{school.pa}%</span>
                      </td>
                      <td className="py-3 px-3 text-center border-l border-slate-100">
                        <span className="text-sm font-semibold text-slate-700">{school.suspensions}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-sm font-semibold ${school.pex > 0 ? "text-red-600" : "text-slate-400"}`}>{school.pex}</span>
                      </td>
                      <td className="py-3 px-3 text-center border-l border-slate-100">
                        <span className="text-sm text-slate-600">{school.pp}%</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-sm text-slate-600">{school.send}%</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-sm text-slate-600">{school.eal}%</span>
                      </td>
                      <td className="py-3 pl-3 text-center">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${idaciColor}`}>
                          D{school.idaci}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
            <span>PA = Persistent Absence</span>
            <span>PEX = Permanent Exclusions</span>
            <span>PP = Pupil Premium</span>
            <span>SEND = Special Educational Needs</span>
            <span>EAL = English as Additional Language</span>
            <span>IDACI = Income Deprivation Index</span>
          </div>
        </CardContent>
      </Card>

      {/* Ofsted Section - scales from a handful of schools to a full trust */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3 px-5 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              <CardTitle className="text-sm font-semibold text-slate-900">Ofsted Judgements</CardTitle>
              <span className="text-xs text-slate-400">{ofstedTotal} schools</span>
            </div>
            <span className="text-xs text-slate-400">Note: Subject to change with new framework</span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-4">
          {/* Distribution summary — a proportion bar plus per-judgement counts */}
          <div className="space-y-2">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              {ofstedCounts.map(({ judgement, count }) => (
                <div
                  key={judgement}
                  className={getOfstedColor(judgement).bar}
                  style={{ width: `${(count / ofstedTotal) * 100}%` }}
                  title={`${judgement}: ${count}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {ofstedCounts.map(({ judgement, count }) => {
                const colors = getOfstedColor(judgement)
                return (
                  <div key={judgement} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <span className="text-xs text-slate-600">{judgement}</span>
                    <span className="text-xs font-semibold text-slate-900">{count}</span>
                  </div>
                )
              })}
              {ofstedConcernCount > 0 && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-medium text-amber-700">
                    {ofstedConcernCount} need attention
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Compact, scrollable school list — concerns surface first */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
            {ofstedSorted.map((school) => {
              const colors = getOfstedColor(school.judgement)
              const isConcern =
                school.judgement === "Requires Improvement" || school.judgement === "Inadequate"
              return (
                <div
                  key={school.name}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <span className={`w-1.5 self-stretch rounded-full shrink-0 ${colors.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-800 truncate" title={school.name}>
                      {school.name}
                    </p>
                    <p className="text-[11px] text-slate-400">Inspected {school.date}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isConcern && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${colors.bg} ${colors.text}`}
                    >
                      {ofstedShortLabel(school.judgement)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
