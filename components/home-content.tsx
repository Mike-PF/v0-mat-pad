"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  ClipboardList,
  Upload,
  FileBarChart2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  School,
  CalendarDays,
  UserCheck,
  FileText,
} from "lucide-react"
import Link from "next/link"

const ACCENT = "hsl(314 100% 35%)"

// --- Mock data ---
const statCards = [
  {
    label: "Overall Attendance",
    value: "94.2%",
    change: "+0.4%",
    trend: "up",
    sub: "vs last week",
    icon: UserCheck,
    color: "#5B9BF5",
  },
  {
    label: "Persistent Absence",
    value: "8.1%",
    change: "-0.3%",
    trend: "down-good",
    sub: "pupils below 90%",
    icon: AlertCircle,
    color: "#f59e0b",
  },
  {
    label: "Forms Completed",
    value: "3 / 20",
    change: "15%",
    trend: "neutral",
    sub: "this academic year",
    icon: ClipboardList,
    color: "#10b981",
  },
  {
    label: "Data Uploads",
    value: "12",
    change: "Last: 2d ago",
    trend: "neutral",
    sub: "this term",
    icon: Upload,
    color: "#8b5cf6",
  },
]

const schools = [
  { name: "All Saints' Catholic High School", attendance: 95.1, pa: 7.2, pupils: 1240 },
  { name: "Emmaus Catholic Primary School", attendance: 93.8, pa: 8.9, pupils: 420 },
  { name: "Notre Dame High School", attendance: 93.7, pa: 8.3, pupils: 980 },
]

const recentActivity = [
  {
    icon: Upload,
    text: "Attendance data uploaded for All Saints'",
    time: "2 hours ago",
    color: "#5B9BF5",
  },
  {
    icon: FileText,
    text: "Census form section 3 completed",
    time: "Yesterday",
    color: "#10b981",
  },
  {
    icon: FileBarChart2,
    text: "Attendance Headlines report generated",
    time: "2 days ago",
    color: ACCENT,
  },
  {
    icon: Upload,
    text: "SEN data uploaded for Notre Dame",
    time: "3 days ago",
    color: "#5B9BF5",
  },
  {
    icon: CheckCircle2,
    text: "Data mapping for SEN needs completed",
    time: "4 days ago",
    color: "#10b981",
  },
]

const quickLinks = [
  { label: "Upload Data", href: "/upload", icon: Upload, desc: "Add new school data" },
  { label: "View Reports", href: "/reports/predefined", icon: FileBarChart2, desc: "Access pre-built reports" },
  { label: "Complete Forms", href: "/forms", icon: ClipboardList, desc: "Census & statutory forms" },
  { label: "Dashboards", href: "/dashboards", icon: School, desc: "Visual analytics" },
]

const upcomingDates = [
  { label: "Spring term ends", date: "4 Apr 2025", daysLeft: 44 },
  { label: "Census deadline", date: "16 Jan 2025", daysLeft: 2 },
  { label: "Summer term starts", date: "23 Apr 2025", daysLeft: 63 },
]

export function HomeContent() {
  const [selectedSchool, setSelectedSchool] = useState<string>("all")

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

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="bg-white border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {card.trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
                      {card.trend === "down-good" && <TrendingDown className="w-3 h-3 text-green-500" />}
                      <span className={`text-xs font-medium ${card.trend !== "neutral" ? "text-green-600" : "text-slate-500"}`}>
                        {card.change}
                      </span>
                      <span className="text-xs text-slate-400">{card.sub}</span>
                    </div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${card.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Middle row: Schools breakdown + Recent activity */}
      <div className="grid grid-cols-3 gap-4">
        {/* Schools attendance breakdown */}
        <div className="col-span-2">
          <Card className="bg-white border-slate-200 h-full">
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-900">Schools Overview</CardTitle>
                <Link href="/dashboards" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View dashboards <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-medium text-slate-500 pb-2">School</th>
                    <th className="text-right text-xs font-medium text-slate-500 pb-2">Pupils</th>
                    <th className="text-right text-xs font-medium text-slate-500 pb-2">Attendance</th>
                    <th className="text-right text-xs font-medium text-slate-500 pb-2">PA Rate</th>
                    <th className="text-right text-xs font-medium text-slate-500 pb-2 w-28">vs National</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {schools.map((school) => {
                    const national = 94.5
                    const diff = school.attendance - national
                    const isAbove = diff >= 0
                    return (
                      <tr key={school.name} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-1.5 h-7 rounded-full shrink-0"
                              style={{ backgroundColor: ACCENT }}
                            />
                            <span className="text-sm text-slate-800 font-medium leading-tight">{school.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-sm text-slate-600">{school.pupils.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-semibold text-slate-900">{school.attendance}%</span>
                            <div className="w-20 bg-slate-100 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full"
                                style={{ width: `${school.attendance}%`, backgroundColor: "#10b981" }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`text-sm font-medium ${school.pa > 10 ? "text-red-500" : school.pa > 8 ? "text-amber-500" : "text-green-600"}`}>
                            {school.pa}%
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${isAbove ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                            {isAbove ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {isAbove ? "+" : ""}{diff.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="text-xs text-slate-400 mt-3">National average: 94.5% — Autumn term 2024</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3 px-5 pt-5">
            <CardTitle className="text-sm font-semibold text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-4">
              {recentActivity.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${item.color}18` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-snug">{item.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Quick links + Upcoming dates */}
      <div className="grid grid-cols-3 gap-4">
        {/* Quick links */}
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.label}
                href={link.href}
                className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-3 hover:border-primary hover:shadow-sm transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "hsl(314 100% 35% / 0.08)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">{link.label}</p>
                  <p className="text-xs text-slate-500">{link.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary ml-auto transition-colors" />
              </Link>
            )
          })}
        </div>

        {/* Upcoming key dates */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3 px-5 pt-5">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <CardTitle className="text-sm font-semibold text-slate-900">Key Dates</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            {upcomingDates.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.date}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    item.daysLeft <= 3
                      ? "bg-red-50 text-red-600"
                      : item.daysLeft <= 14
                      ? "bg-amber-50 text-amber-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.daysLeft === 0 ? "Today" : `${item.daysLeft}d`}
                </span>
              </div>
            ))}
            <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span>3 schools in your MAT</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
