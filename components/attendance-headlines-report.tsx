"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react"

export function AttendanceHeadlinesReport() {
  const [phase, setPhase] = useState("Primary")
  const [year, setYear] = useState("2025")
  const [startDate, setStartDate] = useState("14/03/2024")
  const [endDate, setEndDate] = useState("08/01/2026")

  const metrics = [
    { label: "Total pupils", value: "31", color: "bg-teal-600" },
    { label: "Attendance", value: "97.3%", subText: "NAT. 94.8% ▼ 2.5", color: "text-teal-600", highlight: true },
    { label: "Absence", value: "2.7%", subText: "NAT. 5.2% ▼ 2.5", color: "text-orange-500", highlight: true },
    { label: "Auth. absence", value: "2.0%", subText: "NAT. 3.7% ▼ 2.5", color: "text-blue-500", highlight: true },
    { label: "Unauth. absence", value: "0.8%", subText: "NAT. 1.5% ▼ 0.8", color: "text-amber-500", highlight: true },
    { label: "Persistent absence", value: "0.0%", subText: "NAT. 15.6% ▼ 15.6", color: "text-green-600", highlight: true },
    { label: "Severe absence", value: "0.0%", subText: "NAT. 0.3% ▼ 0.3", color: "text-green-600", highlight: true },
  ]

  return (
    <div className="w-full bg-white">
      {/* Header Bar */}
      <div className="bg-teal-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Attendance headlines - 01/09/2024 to 31/08/2025</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Phase, schools</span>
              <Select value={phase} onValueChange={setPhase}>
                <SelectTrigger className="w-32 bg-white text-slate-900 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Yearend, not_form_HT</span>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-20 bg-white text-slate-900 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white text-slate-900 px-3 py-1.5 rounded text-sm h-9 w-32"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white text-slate-900 px-3 py-1.5 rounded text-sm h-9 w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Applied */}
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
        <p className="text-sm text-slate-600">
          <span className="font-medium">Filters applied:</span> SEN status- All | FSM6- | | Attendance band- 95+%
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-4 ${
                metric.label === "Total pupils"
                  ? "bg-teal-600 text-white col-span-1 md:col-span-1 lg:col-span-1"
                  : "bg-white border border-slate-200"
              }`}
            >
              {metric.label === "Total pupils" ? (
                <>
                  <p className="text-sm opacity-90 mb-2">{metric.label}</p>
                  <p className="text-4xl font-bold">{metric.value}</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-500 mb-1">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    <span>NAT.</span> {metric.subText}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attendance Trends */}
          <Card className="p-6 lg:col-span-1">
            <h3 className="font-semibold text-slate-900 mb-4">Attendance trends</h3>
            <div className="h-40 bg-slate-50 rounded flex items-center justify-center text-slate-400">
              <div className="text-center">
                <p className="text-sm">Line chart placeholder</p>
                <p className="text-xs text-slate-400 mt-1">MAT (selected pupils) • National (all pupils)</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              <p>• MAT (selected pupils) • National (all pupils)</p>
            </div>
          </Card>

          {/* Attendance Band Pie Chart */}
          <Card className="p-6 lg:col-span-1">
            <h3 className="font-semibold text-slate-900 mb-4">% pupils by attendance band</h3>
            <div className="h-40 bg-slate-50 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-purple-400 to-green-400 mx-auto flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">31 (38.27%)</span>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <p>🟢 95+%</p>
              <p>🟡 90-95%</p>
              <p>🟠 80-90%</p>
              <p>🔴 50-80%</p>
              <p>⚫ <50%</p>
            </div>
          </Card>

          {/* Persistent Absence */}
          <Card className="p-6 lg:col-span-1">
            <h3 className="font-semibold text-slate-900 mb-2">No. of persistently absent pupils</h3>
            <p className="text-sm text-slate-500 mb-4">PA</p>
            <div className="h-24 bg-slate-100 rounded mb-2" />
            <h3 className="font-semibold text-slate-900 text-sm mt-4 mb-2">No. of severely absent pupils</h3>
            <p className="text-sm text-slate-500 mb-4">SA</p>
            <div className="h-12 bg-slate-100 rounded" />
          </Card>
        </div>

        {/* Lower Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Absence by School */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">% absence by school</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">School B</span>
                <div className="h-6 w-32 bg-red-300 rounded" />
                <span className="text-sm font-medium">2.6% (26)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">School A</span>
                <div className="h-6 w-28 bg-red-200 rounded" />
                <span className="text-sm font-medium">3.5% (5)</span>
              </div>
            </div>
          </Card>

          {/* Absence by Gender */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">% absence by gender</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">0</p>
                <div className="h-6 bg-green-300 rounded" />
                <p className="text-xs text-slate-500 mt-1">2.8% (30)</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">1</p>
                <div className="h-6 bg-green-200 rounded w-12" />
                <p className="text-xs text-slate-500 mt-1">0.8% (1)</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">% absence by SEN status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-red-300 rounded" />
                <span>3.7% (2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-red-200 rounded" />
                <span>3.0% (11)</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">% absence by FSM</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-red-200 rounded" />
                <span>2.7% (31)</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">% absence by ethnicity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-red-300 rounded" />
                <span>2.1% (11)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-red-300 rounded" />
                <span>3.1% (18)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 bg-red-100 rounded" />
                <span>0.8% (1)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
