"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  ClipboardList,
  Upload,
  FileBarChart2,
  AlertTriangle,
  Clock,
  ArrowRight,
  CalendarDays,
  Star,
  Megaphone,
  Wrench,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Globe,
  MapPin,
  Ban,
  UserMinus,
  CheckCircle,
  Info,
  ChevronRight,
  Settings,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

const ACCENT = "hsl(314 100% 35%)"

// --- Mock data ---

// Exclusions & Suspensions data
const exclusionsData = {
  permanentExclusions: {
    total: 2,
    thisYear: 1,
    schools: [
      { name: "All Saints' Catholic High School", count: 1, date: "12 Nov 2024" },
      { name: "Notre Dame High School", count: 1, date: "3 Oct 2024" },
    ],
  },
  suspensions: {
    total: 47,
    thisYear: 23,
    thisWeek: 3,
    schools: [
      { name: "All Saints' Catholic High School", count: 28, sessions: 84 },
      { name: "Notre Dame High School", count: 15, sessions: 42 },
      { name: "Emmaus Catholic Primary School", count: 4, sessions: 8 },
    ],
  },
}

// Cohort context data per school
const cohortData = [
  {
    name: "All Saints' Catholic High School",
    abbr: "ASHS",
    pupils: 1240,
    pp: { count: 298, pct: 24.0 },
    send: { count: 186, pct: 15.0, ehcp: 42 },
    eal: { count: 124, pct: 10.0 },
    idaci: { decile: 3, band: "High deprivation" },
  },
  {
    name: "Emmaus Catholic Primary School",
    abbr: "ECPS",
    pupils: 420,
    pp: { count: 147, pct: 35.0 },
    send: { count: 63, pct: 15.0, ehcp: 12 },
    eal: { count: 84, pct: 20.0 },
    idaci: { decile: 2, band: "Very high deprivation" },
  },
  {
    name: "Notre Dame High School",
    abbr: "NDHS",
    pupils: 980,
    pp: { count: 196, pct: 20.0 },
    send: { count: 137, pct: 14.0, ehcp: 28 },
    eal: { count: 78, pct: 8.0 },
    idaci: { decile: 5, band: "Medium deprivation" },
  },
]

// Ofsted data
const ofstedData = [
  {
    name: "All Saints' Catholic High School",
    judgement: "Good",
    date: "15 Mar 2023",
    previousJudgement: "Good",
    nextInspectionWindow: "Mar 2027 - Mar 2028",
  },
  {
    name: "Emmaus Catholic Primary School",
    judgement: "Outstanding",
    date: "22 Sep 2022",
    previousJudgement: "Good",
    nextInspectionWindow: "Sep 2026 - Sep 2030",
  },
  {
    name: "Notre Dame High School",
    judgement: "Requires Improvement",
    date: "8 Jan 2024",
    previousJudgement: "Good",
    nextInspectionWindow: "Jan 2025 - Jul 2025",
  },
]

// Favourites
const favourites = [
  { label: "Upload Data", href: "/upload", icon: Upload },
  { label: "Reports", href: "/reports/predefined", icon: FileBarChart2 },
  { label: "Forms", href: "/forms", icon: ClipboardList },
  { label: "Dashboards", href: "/dashboards", icon: LayoutDashboard },
  { label: "AI Chat", href: "/ai-chat", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
]

// What's New / Key Dates
const whatsNew = [
  {
    type: "update",
    title: "New attendance dashboard released",
    description: "Enhanced visualisations for persistent absence tracking",
    date: "Today",
    isNew: true,
  },
  {
    type: "deadline",
    title: "Spring Census deadline",
    description: "Submit census data by 16 January 2025",
    date: "16 Jan 2025",
    daysLeft: 2,
    isUrgent: true,
  },
  {
    type: "deadline",
    title: "Workforce Census opens",
    description: "Annual school workforce census collection begins",
    date: "4 Nov 2025",
    daysLeft: 292,
  },
  {
    type: "maintenance",
    title: "Scheduled maintenance",
    description: "System will be unavailable 02:00-04:00 GMT",
    date: "18 Jan 2025",
    daysLeft: 4,
  },
  {
    type: "issue",
    title: "Known issue: Export delays",
    description: "Large data exports may take longer than usual",
    date: "Investigating",
    isActive: true,
  },
  {
    type: "update",
    title: "IDACI 2024 data now available",
    description: "Updated deprivation indices for all postcodes",
    date: "2 days ago",
  },
]

const getOfstedColor = (judgement: string) => {
  switch (judgement) {
    case "Outstanding":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" }
    case "Good":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" }
    case "Requires Improvement":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" }
    case "Inadequate":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" }
  }
}

const getIdaciColor = (decile: number) => {
  if (decile <= 2) return { bg: "bg-red-50", text: "text-red-700" }
  if (decile <= 4) return { bg: "bg-amber-50", text: "text-amber-700" }
  if (decile <= 6) return { bg: "bg-yellow-50", text: "text-yellow-700" }
  return { bg: "bg-green-50", text: "text-green-700" }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "update":
      return Megaphone
    case "deadline":
      return CalendarDays
    case "maintenance":
      return Wrench
    case "issue":
      return AlertCircle
    default:
      return Info
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "update":
      return "#5B9BF5"
    case "deadline":
      return ACCENT
    case "maintenance":
      return "#8b5cf6"
    case "issue":
      return "#ef4444"
    default:
      return "#64748b"
  }
}

export function HomeContent() {
  const [selectedTab, setSelectedTab] = useState<"all" | "updates" | "deadlines" | "system">("all")

  const filteredNews = whatsNew.filter((item) => {
    if (selectedTab === "all") return true
    if (selectedTab === "updates") return item.type === "update"
    if (selectedTab === "deadlines") return item.type === "deadline"
    if (selectedTab === "system") return item.type === "maintenance" || item.type === "issue"
    return true
  })

  return (
    <div className="space-y-6">
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

      {/* Top row: Favourites + What's New */}
      <div className="grid grid-cols-3 gap-4">
        {/* Favourites */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3 px-5 pt-5">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-sm font-semibold text-slate-900">Favourites</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid grid-cols-2 gap-2">
              {favourites.map((fav) => {
                const Icon = fav.icon
                return (
                  <Link
                    key={fav.label}
                    href={fav.href}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-100 hover:border-primary hover:bg-slate-50 transition-all group"
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "hsl(314 100% 35% / 0.08)" }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                    </div>
                    <span className="text-sm text-slate-700 group-hover:text-primary transition-colors">{fav.label}</span>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* What's New / Key Dates */}
        <div className="col-span-2">
          <Card className="bg-white border-slate-200 h-full">
            <CardHeader className="pb-3 px-5 pt-5">
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
                      className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
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
            <CardContent className="px-5 pb-5">
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {filteredNews.map((item, i) => {
                  const Icon = getTypeIcon(item.type)
                  const color = getTypeColor(item.type)
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                        item.isUrgent
                          ? "border-red-200 bg-red-50/50"
                          : item.isNew
                          ? "border-blue-200 bg-blue-50/50"
                          : item.isActive
                          ? "border-amber-200 bg-amber-50/50"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}18` }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-800">{item.title}</p>
                          {item.isNew && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500 text-white rounded">NEW</span>
                          )}
                          {item.isUrgent && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded">URGENT</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-500">{item.date}</p>
                        {item.daysLeft !== undefined && item.daysLeft <= 7 && (
                          <p className={`text-xs font-semibold mt-0.5 ${item.daysLeft <= 3 ? "text-red-600" : "text-amber-600"}`}>
                            {item.daysLeft === 0 ? "Today" : `${item.daysLeft}d left`}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Middle row: Exclusions & Suspensions */}
      <div className="grid grid-cols-2 gap-4">
        {/* Permanent Exclusions */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3 px-5 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-red-500" />
                <CardTitle className="text-sm font-semibold text-slate-900">Permanent Exclusions</CardTitle>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{exclusionsData.permanentExclusions.total}</span>
                <span className="text-xs text-slate-500">total</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              {exclusionsData.permanentExclusions.schools.map((school, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{school.name}</p>
                    <p className="text-xs text-slate-400">Last: {school.date}</p>
                  </div>
                  <span className="text-lg font-bold text-red-600">{school.count}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
              {exclusionsData.permanentExclusions.thisYear} this academic year
            </p>
          </CardContent>
        </Card>

        {/* Suspensions */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3 px-5 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserMinus className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold text-slate-900">Suspensions</CardTitle>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">{exclusionsData.suspensions.total}</span>
                  <span className="text-xs text-slate-500 ml-1">total</span>
                </div>
                <div className="text-right pl-4 border-l border-slate-200">
                  <span className="text-lg font-semibold text-amber-600">{exclusionsData.suspensions.thisWeek}</span>
                  <span className="text-xs text-slate-500 ml-1">this week</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              {exclusionsData.suspensions.schools.map((school, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{school.name}</p>
                    <p className="text-xs text-slate-400">{school.sessions} sessions lost</p>
                  </div>
                  <span className="text-lg font-bold text-amber-600">{school.count}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
              {exclusionsData.suspensions.thisYear} suspensions this academic year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Context Information */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3 px-5 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <CardTitle className="text-sm font-semibold text-slate-900">Cohort Context</CardTitle>
            </div>
            <Link href="/dashboards" className="text-xs text-primary hover:underline flex items-center gap-1">
              View detailed breakdown <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-slate-500 pb-3">School</th>
                <th className="text-center text-xs font-medium text-slate-500 pb-3">Pupils</th>
                <th className="text-center text-xs font-medium text-slate-500 pb-3">
                  <div className="flex items-center justify-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>Pupil Premium</span>
                  </div>
                </th>
                <th className="text-center text-xs font-medium text-slate-500 pb-3">
                  <div className="flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>SEND</span>
                  </div>
                </th>
                <th className="text-center text-xs font-medium text-slate-500 pb-3">
                  <div className="flex items-center justify-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>EAL</span>
                  </div>
                </th>
                <th className="text-center text-xs font-medium text-slate-500 pb-3">
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>IDACI</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cohortData.map((school) => {
                const idaciColors = getIdaciColor(school.idaci.decile)
                return (
                  <tr key={school.name} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-7 rounded-full shrink-0"
                          style={{ backgroundColor: ACCENT }}
                        />
                        <div>
                          <span className="text-sm text-slate-800 font-medium leading-tight">{school.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-sm font-semibold text-slate-900">{school.pupils.toLocaleString()}</span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-sm font-semibold text-slate-900">{school.pp.pct}%</span>
                        <span className="text-xs text-slate-400">{school.pp.count} pupils</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-sm font-semibold text-slate-900">{school.send.pct}%</span>
                        <span className="text-xs text-slate-400">{school.send.count} ({school.send.ehcp} EHCP)</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-sm font-semibold text-slate-900">{school.eal.pct}%</span>
                        <span className="text-xs text-slate-400">{school.eal.count} pupils</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${idaciColors.bg} ${idaciColors.text}`}>
                          Decile {school.idaci.decile}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5">{school.idaci.band}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">PP = Pupil Premium | SEND = Special Educational Needs | EAL = English as Additional Language | IDACI = Income Deprivation Affecting Children Index</p>
          </div>
        </CardContent>
      </Card>

      {/* Ofsted Judgements */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="pb-3 px-5 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              <CardTitle className="text-sm font-semibold text-slate-900">Ofsted Judgements</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="grid grid-cols-3 gap-4">
            {ofstedData.map((school) => {
              const colors = getOfstedColor(school.judgement)
              const isRI = school.judgement === "Requires Improvement"
              return (
                <div
                  key={school.name}
                  className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{school.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Last inspected: {school.date}</p>
                    </div>
                    {isRI && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold ${colors.text}`}>{school.judgement}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/50">
                    <p className="text-xs text-slate-500">
                      <span className="font-medium">Next inspection window:</span>
                      <br />
                      {school.nextInspectionWindow}
                    </p>
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
