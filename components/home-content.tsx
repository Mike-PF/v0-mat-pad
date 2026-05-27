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
  Ban,
  UserMinus,
  Info,
  TrendingUp,
  TrendingDown,
  Eye,
  FileText,
  Upload,
  Clock,
  ExternalLink,
  X,
  Play,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

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

// Recent activity
const recentActivity = [
  { type: "upload", title: "Attendance data uploaded", school: "ASHS", time: "10 mins ago" },
  { type: "report", title: "PA Report generated", school: "ECPS", time: "1 hour ago" },
  { type: "view", title: "Exclusions dashboard viewed", school: "MAT", time: "2 hours ago" },
  { type: "upload", title: "Census data uploaded", school: "NDHS", time: "Yesterday" },
]

// Ofsted data
const ofstedData = [
  { name: "All Saints' Catholic High School", abbr: "ASHS", judgement: "Good", date: "Mar 2023" },
  { name: "Emmaus Catholic Primary School", abbr: "ECPS", judgement: "Outstanding", date: "Sep 2022" },
  { name: "Notre Dame High School", abbr: "NDHS", judgement: "Requires Improvement", date: "Jan 2024" },
]

// What's New / Key Dates
type WhatsNewItem = {
  type: "update" | "deadline" | "maintenance" | "issue"
  title: string
  description: string
  date: string
  daysLeft?: number
  isUrgent?: boolean
  isNew?: boolean
  isActive?: boolean
  body?: string
  video?: { url: string; title: string }
  documents?: { name: string; size: string; type: "pdf" | "xlsx" | "docx" }[]
}

const whatsNew: WhatsNewItem[] = [
  {
    type: "deadline",
    title: "Spring Census deadline",
    description: "Submit census data by 16 January 2025",
    date: "16 Jan",
    daysLeft: 2,
    isUrgent: true,
    body: "The Spring School Census is due on 16 January 2025. All schools must ensure their data has been validated and submitted via COLLECT before 11:59pm on the deadline date.\n\nKey areas to check before submission:\n• Pupil headcount and new admissions\n• Attendance codes for the reference week\n• Free school meal eligibility\n• SEN support and EHCP records\n\nContact your data manager if you encounter any COLLECT errors. DfE will not accept late submissions without prior written agreement.",
    documents: [
      { name: "Spring Census Checklist 2025.pdf", size: "142 KB", type: "pdf" },
      { name: "COLLECT Submission Guide.pdf", size: "380 KB", type: "pdf" },
    ],
  },
  {
    type: "update",
    title: "New attendance dashboard released",
    description: "Enhanced visualisations for persistent absence tracking",
    date: "Today",
    isNew: true,
    body: "We have released an updated Attendance Dashboard with several improvements based on user feedback:\n\n• Persistent Absence cohort drill-down now available at pupil level\n• Comparison against national and regional averages added to all charts\n• New 'at risk' threshold alerts for pupils approaching 90% threshold\n• Export to Excel now includes all filters applied\n\nThe dashboard is available from the Dashboards section in the left-hand navigation. Watch the short walkthrough video below for an overview of the new features.",
    video: {
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "New Attendance Dashboard Walkthrough",
    },
    documents: [
      { name: "Attendance Dashboard Release Notes.pdf", size: "98 KB", type: "pdf" },
    ],
  },
  {
    type: "maintenance",
    title: "Scheduled maintenance",
    description: "System unavailable 02:00–04:00 GMT on 18 January",
    date: "18 Jan",
    daysLeft: 4,
    body: "Planned maintenance will take place on the night of 18 January 2025 between 02:00 and 04:00 GMT. The following services will be unavailable during this window:\n\n• All data upload functionality\n• Report generation and export\n• Dashboard access\n\nUser authentication and read-only access to saved reports will remain available. No action is required — the system will resume normal operation automatically. Please ensure any time-sensitive uploads are completed before 01:30 GMT.",
  },
  {
    type: "issue",
    title: "Known issue: Export delays",
    description: "Large exports may take longer than usual",
    date: "Active",
    isActive: true,
    body: "We are aware of an issue affecting large data exports (files over 50,000 rows). Exports are completing successfully but may take up to 15 minutes longer than normal.\n\nWorkarounds:\n• Apply additional filters to reduce export size before downloading\n• Use the 'Schedule Export' option to run exports overnight\n• Exports under 10,000 rows are unaffected\n\nOur engineering team is investigating the root cause. We expect a fix to be deployed by 20 January. We apologise for the inconvenience.",
  },
  {
    type: "deadline",
    title: "Workforce Census opens",
    description: "Annual workforce census collection begins",
    date: "4 Nov",
    daysLeft: 292,
    body: "The Annual School Workforce Census opens on 4 November 2025. All maintained schools and academies are required to submit workforce data to the DfE by the deadline.\n\nData required includes:\n• Staff headcount and FTE\n• Qualifications and subject specialisms\n• Absence and vacancies\n• Salary and pay range information\n\nFull guidance and the submission portal will be available on the DfE COLLECT website from 1 October 2025.",
    documents: [
      { name: "Workforce Census Guidance 2025.xlsx", size: "1.2 MB", type: "xlsx" },
    ],
  },
]

const getOfstedColor = (judgement: string) => {
  switch (judgement) {
    case "Outstanding":
      return { bg: "bg-emerald-100", text: "text-emerald-700" }
    case "Good":
      return { bg: "bg-blue-100", text: "text-blue-700" }
    case "Requires Improvement":
      return { bg: "bg-amber-100", text: "text-amber-700" }
    case "Inadequate":
      return { bg: "bg-red-100", text: "text-red-700" }
    default:
      return { bg: "bg-slate-100", text: "text-slate-700" }
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "update": return Megaphone
    case "deadline": return CalendarDays
    case "maintenance": return Wrench
    case "issue": return AlertCircle
    default: return Info
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "update": return "#5B9BF5"
    case "deadline": return ACCENT
    case "maintenance": return "#8b5cf6"
    case "issue": return "#ef4444"
    default: return "#64748b"
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "upload": return Upload
    case "report": return FileText
    case "view": return Eye
    default: return Clock
  }
}

export function HomeContent() {
  const [selectedTab, setSelectedTab] = useState<"all" | "updates" | "deadlines" | "system">("all")
  const [selectedItem, setSelectedItem] = useState<WhatsNewItem | null>(null)

  const filteredNews = whatsNew.filter((item) => {
    if (selectedTab === "all") return true
    if (selectedTab === "updates") return item.type === "update"
    if (selectedTab === "deadlines") return item.type === "deadline"
    if (selectedTab === "system") return item.type === "maintenance" || item.type === "issue"
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
                  {selectedItem.isNew && (
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
                    const docColors: Record<string, string> = { pdf: "text-red-600 bg-red-50", xlsx: "text-emerald-600 bg-emerald-50", docx: "text-blue-600 bg-blue-50" }
                    const colors = docColors[doc.type] || "text-slate-600 bg-slate-50"
                    return (
                      <button
                        key={i}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left group"
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${colors}`}>
                          {doc.type.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.size}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
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
                          : item.isNew
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
                          {item.isNew && (
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

      {/* Recent Activity - Horizontal chips */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-500 shrink-0">Recent:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {recentActivity.map((activity, i) => {
            const Icon = getActivityIcon(activity.type)
            return (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group whitespace-nowrap"
                title={`${activity.title} - ${activity.school}`}
              >
                <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                <span className="text-slate-700">{activity.title}</span>
                <span className="text-slate-400">({activity.school})</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-400">{activity.time}</span>
              </div>
            )
          })}
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

      {/* Ofsted Section - Simplified */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3 px-5 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              <CardTitle className="text-sm font-semibold text-slate-900">Ofsted Judgements</CardTitle>
            </div>
            <span className="text-xs text-slate-400">Note: Subject to change with new framework</span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="flex items-center gap-4">
            {ofstedData.map((school) => {
              const colors = getOfstedColor(school.judgement)
              const isRI = school.judgement === "Requires Improvement"
              return (
                <div
                  key={school.name}
                  className="flex-1 flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
                      {school.abbr.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{school.name}</p>
                      <p className="text-xs text-slate-400">Last inspected: {school.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isRI && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}>
                      {school.judgement}
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
