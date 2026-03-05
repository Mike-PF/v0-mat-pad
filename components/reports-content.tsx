"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, FilterX, Download, ArrowUp, ArrowDown, ChevronDown } from "lucide-react"

export function ReportsContent() {
  const [selectedReport, setSelectedReport] = useState("attendanceDash")
  const [selectedScope, setSelectedScope] = useState("whole-mat")
  const [selectedCharacteristics, setSelectedCharacteristics] = useState("characteristics")

  const dashboardButtons = [
    { id: "attendanceDash", label: "Attendance Summary Dashboard", active: true },
    { id: "attendanceSummaryDash", label: "Persistent Absence Dashboard", active: false },
    { id: "pupilSummaryDash", label: "Pupil Summary Dashboard", active: false },
    { id: "AttendancePupilView", label: "Pupil View Dashboard", active: false },
    { id: "termlyAttendance", label: "Termly Attendance", active: false },
    { id: "schoolComparisons", label: "School Comparisons", active: false },
    { id: "attendanceHeatmap", label: "Attendance heatmap", active: false },
  ]

  const keyMetrics = [
    {
      title: "Overall attendance",
      value: "94.08%",
      national: "(nat. 93.39%)",
      change: "0.00% since last week",
      color: "text-green-500",
    },
    {
      title: "Authorised Absence",
      value: "4.03%",
      national: "(nat. 4.52%)",
      change: "0.00% since last week",
      color: "text-green-500",
    },
    {
      title: "Unauthorised Absence",
      value: "1.89%",
      national: "(nat. 2.10%)",
      change: "0.00% since last week",
      color: "text-green-500",
    },
    {
      title: "Persistent Absence",
      value: "13.22%",
      national: "(nat. 18.15%)",
      change: "0.00% since last week",
      color: "text-green-500",
    },
    {
      title: "Severe Absence",
      value: "2.22%",
      national: "",
      change: "0.00% since last week",
      color: "text-green-500",
    },
    {
      title: "Top absence category",
      value: "3.02%",
      national: "",
      change: "Illness Not Medical or dental",
      color: "text-red-500",
    },
  ]

  const attendanceTrendsData = [
    { year: "2021/22", national: "92.0%", wholeMat: "93.5%" },
    { year: "2022/23", national: "92.4%", wholeMat: "93.3%" },
    { year: "2023/24", national: "92.4%", wholeMat: "92.0%" },
    { year: "2024/25 (YTD)", national: "93.4%", wholeMat: "94.1%" },
  ]

  const pupilGroupData = [
    { group: "All Pupils", pupils: "5289", attendance: "94.1", change: "0.1", trend: "up", bgColor: "#fcdeb2" },
    { group: "Girls", pupils: "2716", attendance: "94.0", change: "0.2", trend: "up", bgColor: "#fcdeb2" },
    { group: "Boys", pupils: "2573", attendance: "94.2", change: "-0.0", trend: "down", bgColor: "#fcdeb2" },
    { group: "SEN support", pupils: "777", attendance: "86.5", change: "-4.4", trend: "down", bgColor: "#4faab6" },
    { group: "EHCP", pupils: "162", attendance: "88.0", change: "1.9", trend: "up", bgColor: "#7bbfc8" },
    { group: "No SEN", pupils: "4096", attendance: "95.1", change: "0.1", trend: "up", bgColor: "#fbc97f" },
  ]

  return (
    <div className="h-full bg-slate-50 overflow-auto space-y-4">
      {/* Card 1: Dashboard Selector */}
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-900 font-medium text-sm mb-2">Dashboard</div>
              <div className="relative">
                <select className="w-60 p-2 border border-slate-300 rounded bg-white appearance-none pr-8">
                  <option>Attendance</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <div className="relative">
                <select className="w-32 p-2 border border-slate-300 rounded bg-white appearance-none pr-8">
                  <option>Whole MAT</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select className="w-32 p-2 border border-slate-300 rounded bg-white appearance-none pr-8">
                  <option>Characteristics</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <Button variant="outline" size="icon" className="w-9 h-9 bg-transparent">
                <FilterX className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-9 h-9 bg-transparent">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-9 h-9 bg-transparent" disabled>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Dashboard Buttons */}
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {dashboardButtons.map((button) => (
              <Button
                key={button.id}
                variant={button.active ? "default" : "outline"}
                size="sm"
                className={`h-9 px-3 text-sm ${
                  button.active
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => setSelectedReport(button.id)}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Header, Key Metrics, Charts and Data */}
      <Card className="bg-white flex-1">
        <CardContent className="p-4">
          {/* Header with Logo and Title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MAT</span>
                </div>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Attendance Summary Dashboard - Whole MAT</h1>
            </div>
            <div className="text-sm text-slate-600">National Data Collected - 21 March 2025</div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            {keyMetrics.map((metric, index) => (
              <Card key={index} className="bg-white border-slate-200">
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-medium text-slate-700 mb-2 h-8 flex items-center justify-center">
                    {metric.title}
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${metric.color}`}>{metric.value}</div>
                  {metric.national && <div className="text-xs text-slate-600 mb-2">{metric.national}</div>}
                  <div className="text-xs text-slate-500">{metric.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Attendance Trends Chart */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-center mb-4">Attendance trends</h3>

                {/* Simple Line Chart Representation */}
                <div className="h-48 bg-slate-50 rounded mb-4 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 300 150">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* National line (blue) */}
                    <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points="30,80 90,75 150,75 210,60 270,65" />

                    {/* Whole MAT line (teal) */}
                    <polyline fill="none" stroke="#14b8a6" strokeWidth="2" points="30,70 90,72 150,85 210,50 270,45" />

                    {/* Data points */}
                    <circle cx="30" cy="80" r="3" fill="#3b82f6" />
                    <circle cx="90" cy="75" r="3" fill="#3b82f6" />
                    <circle cx="150" cy="75" r="3" fill="#3b82f6" />
                    <circle cx="210" cy="60" r="3" fill="#3b82f6" />
                    <circle cx="270" cy="65" r="3" fill="#3b82f6" />

                    <circle cx="30" cy="70" r="3" fill="#14b8a6" />
                    <circle cx="90" cy="72" r="3" fill="#14b8a6" />
                    <circle cx="150" cy="85" r="3" fill="#14b8a6" />
                    <circle cx="210" cy="50" r="3" fill="#14b8a6" />
                    <circle cx="270" cy="45" r="3" fill="#14b8a6" />
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-blue-600"></div>
                    <span className="text-xs text-slate-600">National</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-teal-600"></div>
                    <span className="text-xs text-slate-600">Whole MAT</span>
                  </div>
                </div>

                {/* Data Table */}
                <div className="border border-slate-200 rounded text-xs">
                  <div className="grid grid-cols-5 bg-slate-50">
                    <div className="p-2 font-medium"></div>
                    {attendanceTrendsData.map((item, index) => (
                      <div key={index} className="p-2 font-medium text-center border-l border-slate-200">
                        {item.year}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5">
                    <div className="p-2 font-medium bg-slate-50">National</div>
                    {attendanceTrendsData.map((item, index) => (
                      <div key={index} className="p-2 text-center border-l border-slate-200">
                        {item.national}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 border-t border-slate-200">
                    <div className="p-2 font-medium bg-slate-50">Whole MAT</div>
                    {attendanceTrendsData.map((item, index) => (
                      <div key={index} className="p-2 text-center border-l border-slate-200">
                        {item.wholeMat}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pupils by Attendance Band */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-center mb-4">% pupils by attendance band</h3>

                {/* Donut Chart Representation */}
                <div className="h-48 flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Donut segments */}
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="20"
                        strokeDasharray="145 230"
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="20"
                        strokeDasharray="49 326"
                        strokeDashoffset="-145"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="20"
                        strokeDasharray="17 358"
                        strokeDashoffset="-194"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="20"
                        strokeDasharray="7 368"
                        strokeDashoffset="-211"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="20"
                        strokeDasharray="4 371"
                        strokeDashoffset="-218"
                      />
                    </svg>

                    {/* Percentage labels */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold">65.1%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>95%+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>90-95%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>80-90%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-pink-500 rounded"></div>
                    <span>50-80%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span>&lt;50%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance by NCY */}
            <Card className="bg-white">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-center mb-4">Attendance by NCY - YTD</h3>

                {/* Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-2 mb-4 px-4">
                  {[
                    { label: "Y7", value: 96.0, height: "85%" },
                    { label: "Y8", value: 95.2, height: "80%" },
                    { label: "Y9", value: 94.3, height: "75%" },
                    { label: "Y10", value: 92.1, height: "60%" },
                    { label: "Y11", value: 92.8, height: "65%" },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="relative w-full mb-2">
                        <div className="bg-purple-600 rounded-t w-full relative" style={{ height: item.height }}>
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                            {item.value}%
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* National averages legend */}
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 border-t-2 border-dashed border-slate-400"></div>
                    <span>Primary nat. av. - (94.9%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 border-t-4 border-slate-400"></div>
                    <span>Secondary nat. av. - (91.8%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Headlines Section */}
          <Card className="bg-white border-0 shadow-none">
            <CardContent className="p-0">
              {/* Teal Header */}
              <div className="bg-[#0d9488] text-white p-4 rounded-t-lg flex items-center justify-between">
                <h2 className="text-lg font-semibold">Attendance headlines - 01/09/2024 to 31/08/2025</h2>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-white/80">phase, schoolID</span>
                    <div className="relative">
                      <select className="bg-white text-slate-900 text-sm px-3 py-1.5 rounded border-0 appearance-none pr-8 min-w-[120px]">
                        <option>Primary</option>
                        <option>Secondary</option>
                        <option>All</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/80">yearend, nat_term, HT</span>
                    <div className="relative">
                      <select className="bg-white text-slate-900 text-sm px-3 py-1.5 rounded border-0 appearance-none pr-8 min-w-[100px]">
                        <option>2025</option>
                        <option>2024</option>
                        <option>2023</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/80">date</span>
                    <div className="flex items-center gap-2">
                      <input type="date" defaultValue="2024-03-14" className="bg-white text-slate-900 text-sm px-3 py-1.5 rounded border-0" />
                      <input type="date" defaultValue="2026-01-08" className="bg-white text-slate-900 text-sm px-3 py-1.5 rounded border-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters Applied Bar */}
              <div className="px-4 py-2 bg-slate-50 border-b text-sm text-slate-600">
                Filters applied: SEN status- All | FSM6- 1 | Attendance band- 95+%
              </div>

              <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-4">
                  {/* Headline Metrics */}
                  <div className="grid grid-cols-7 gap-3 mb-6">
                    <div className="bg-[#0d9488] text-white p-3 rounded">
                      <div className="text-xs mb-1">Total pupils</div>
                      <div className="text-2xl font-bold">31</div>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded">
                      <div className="text-xs text-slate-600 mb-1">Attendance</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-500">MAT</span>
                        <span className="text-xl font-bold text-green-600">97.3%</span>
                      </div>
                      <div className="text-xs text-slate-500">Nat. 94.8% <span className="text-green-600">+2.5</span></div>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded">
                      <div className="text-xs text-slate-600 mb-1">Absence</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-500">MAT</span>
                        <span className="text-xl font-bold text-green-600">2.7%</span>
                      </div>
                      <div className="text-xs text-slate-500">Nat. 5.2% <span className="text-red-500">-2.5</span></div>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded">
                      <div className="text-xs text-slate-600 mb-1">Auth. absence</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-500">MAT</span>
                        <span className="text-xl font-bold text-green-600">2.0%</span>
                      </div>
                      <div className="text-xs text-slate-500">Nat. 3.7% <span className="text-red-500">-2.5</span></div>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded">
                      <div className="text-xs text-slate-600 mb-1">Unauth. absence</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-500">MAT</span>
                        <span className="text-xl font-bold text-amber-600">0.8%</span>
                      </div>
                      <div className="text-xs text-slate-500">Nat. 1.5% <span className="text-red-500">-0.8</span></div>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded">
                      <div className="text-xs text-slate-600 mb-1">Persistent absence</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-500">MAT</span>
                        <span className="text-xl font-bold text-green-600">0.0%</span>
                      </div>
                      <div className="text-xs text-slate-500">Nat. 15.6% <span className="text-red-500">-15.6</span></div>
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded">
                      <div className="text-xs text-slate-600 mb-1">Severe absence</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-500">MAT</span>
                        <span className="text-xl font-bold text-green-600">0.0%</span>
                      </div>
                      <div className="text-xs text-slate-500">Nat. 0.3% <span className="text-red-500">-0.3</span></div>
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* Attendance trends */}
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <h4 className="text-sm font-medium mb-3">Attendance trends</h4>
                      <div className="flex items-center gap-4 text-xs mb-2">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-[#0d9488]"></div>
                          <span>MAT (selected pupils)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-[#121051]"></div>
                          <span>National (all pupils)</span>
                        </div>
                      </div>
                      <div className="h-32 relative">
                        <svg className="w-full h-full" viewBox="0 0 200 100">
                          <line x1="20" y1="80" x2="180" y2="80" stroke="#e5e7eb" strokeWidth="1" />
                          <line x1="20" y1="50" x2="180" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                          <line x1="20" y1="20" x2="180" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                          <text x="5" y="20" fontSize="8" fill="#64748b">100%</text>
                          <text x="5" y="80" fontSize="8" fill="#64748b">95%</text>
                          <polyline fill="none" stroke="#0d9488" strokeWidth="2" points="30,25 60,30 90,28 120,22 150,20 170,18" />
                          <polyline fill="none" stroke="#121051" strokeWidth="2" points="30,60 60,58 90,55 120,50 150,48 170,50" />
                          <circle cx="30" cy="25" r="3" fill="#0d9488" />
                          <circle cx="170" cy="18" r="3" fill="#0d9488" />
                          <circle cx="30" cy="60" r="3" fill="#121051" />
                          <circle cx="170" cy="50" r="3" fill="#121051" />
                        </svg>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 px-4">
                          <span>Spr. 2024</span>
                          <span>Aut. 2025</span>
                          <span>Spr. 2026</span>
                        </div>
                      </div>
                    </div>

                    {/* Pupils by attendance band */}
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <h4 className="text-sm font-medium mb-3">% pupils by attendance band</h4>
                      <div className="flex items-center justify-center h-32">
                        <div className="relative w-28 h-28">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="15" strokeDasharray="100 151" strokeDashoffset="0" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="27 224" strokeDashoffset="-100" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="15" strokeDasharray="22 229" strokeDashoffset="-127" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="15" strokeDasharray="10 241" strokeDashoffset="-149" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs">
                            <div className="text-center">
                              <div className="font-bold">31</div>
                              <div className="text-slate-500">(38.27%)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs mt-2">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span>95+%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span>90-95%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-500 rounded-full"></span>80-90%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span>{'<'}50%</span>
                      </div>
                    </div>

                    {/* Persistent/Severe Absence */}
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <h4 className="text-sm font-medium mb-2">No. of persistently absent pupils</h4>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-slate-500">PA</span>
                        <div className="flex-1 bg-slate-100 rounded h-4 relative">
                          <div className="absolute left-0 top-0 h-full bg-[#c4b5fd] rounded" style={{width: '40%'}}></div>
                        </div>
                        <span className="text-xs font-medium">31</span>
                      </div>
                      <h4 className="text-sm font-medium mb-2">No. of severely absent pupils</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">SA</span>
                        <div className="flex-1 bg-slate-100 rounded h-4 relative">
                          <div className="absolute left-0 top-0 h-full bg-[#d4d4d8] rounded" style={{width: '40%'}}></div>
                        </div>
                        <span className="text-xs font-medium">31</span>
                      </div>
                    </div>

                    {/* Attendance by NCY */}
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <h4 className="text-sm font-medium mb-3">% attendance by NCY</h4>
                      <div className="flex items-end gap-1 h-28">
                        {[
                          { ncy: "1", green: 15, red: 85, label: "1.5%" },
                          { ncy: "2", green: 16, red: 84, label: "1.6%" },
                          { ncy: "3", green: 19, red: 81, label: "1.9%" },
                          { ncy: "4", green: 20, red: 80, label: "2.0%" },
                          { ncy: "5", green: 18, red: 82, label: "1.8%" },
                          { ncy: "6", green: 20, red: 80, label: "2.0%" },
                        ].map((item, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-slate-600 mb-1">{item.label}</div>
                            <div className="w-full flex flex-col" style={{height: '60px'}}>
                              <div className="bg-red-400 rounded-t" style={{height: `${item.red}%`}}></div>
                              <div className="bg-green-500 rounded-b" style={{height: `${item.green}%`}}></div>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{item.ncy}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Breakdown Charts Row */}
                  <div className="grid grid-cols-5 gap-3">
                    {/* % absence by school */}
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <h4 className="text-xs font-medium mb-3">% absence by school</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-16 truncate">School B</span>
                          <div className="flex-1 bg-red-300 rounded h-4" style={{width: '60%'}}></div>
                          <span className="text-xs">2.6% (26)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-16 truncate">School A</span>
                          <div className="flex-1 bg-red-200 rounded h-4" style={{width: '80%'}}></div>
                          <span className="text-xs">3.5% (5)</span>
                        </div>
                      </div>
                    </div>

                    {/* % absence by SEN status */}
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <h4 className="text-xs font-medium mb-3">% absence by SEN status</h4>
                      <div className="space-y-1">
                        {[
                          { label: "E", value: "3.7%", count: 2, width: "40%" },
                          { label: "K", value: "3.0%", count: 11, width: "35%" },
                          { label: "NULL", value: "2.4%", count: 15, width: "28%" },
                          { label: "N", value: "2.7%", count: 3, width: "32%" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-xs text-slate-600 w-8">{item.label}</span>
                            <div className="flex-1 bg-red-200 rounded h-3" style={{width: item.width}}></div>
                            <span className="text-xs">{item.value} ({item.count})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* % absence by gender */}
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <h4 className="text-xs font-medium mb-3">% absence by gender</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-4">0</span>
                          <div className="flex-1 bg-green-400 rounded h-4" style={{width: '70%'}}></div>
                          <span className="text-xs">2.8% (30)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-4">1</span>
                          <div className="flex-1 bg-green-300 rounded h-4" style={{width: '20%'}}></div>
                          <span className="text-xs">0.8% (1)</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-medium mt-4 mb-3">% absence by EAL</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-4">0</span>
                          <div className="flex-1 bg-green-400 rounded h-4" style={{width: '70%'}}></div>
                          <span className="text-xs">2.8% (30)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-4">1</span>
                          <div className="flex-1 bg-green-300 rounded h-4" style={{width: '20%'}}></div>
                          <span className="text-xs">0.8% (1)</span>
                        </div>
                      </div>
                    </div>

                    {/* % absence by pupil premium & FSM */}
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <h4 className="text-xs font-medium mb-3">% absence by pupil premium</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-4">1</span>
                          <div className="flex-1 bg-red-400 rounded h-4" style={{width: '50%'}}></div>
                          <span className="text-xs">4.0% (4)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-4">0</span>
                          <div className="flex-1 bg-red-300 rounded h-4" style={{width: '40%'}}></div>
                          <span className="text-xs">2.5% (27)</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-medium mt-4 mb-3">% absence by FSM</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600 w-4">1</span>
                          <div className="flex-1 bg-red-400 rounded h-4" style={{width: '40%'}}></div>
                          <span className="text-xs">2.7% (31)</span>
                        </div>
                      </div>
                    </div>

                    {/* % absence by ethnicity */}
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <h4 className="text-xs font-medium mb-3">% absence by ethnicity</h4>
                      <div className="space-y-1">
                        {[
                          { label: "Any oth...", value: "2.1%", count: 11, color: "bg-red-300" },
                          { label: "White a...", value: "3.1%", count: 18, color: "bg-red-400" },
                          { label: "NULL", value: "2.1%", count: 11, color: "bg-red-200" },
                          { label: "White -...", value: "3.4%", count: 1, color: "bg-red-400" },
                          { label: "Any oth...", value: "0.8%", count: 1, color: "bg-red-100" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-xs text-slate-600 w-16 truncate">{item.label}</span>
                            <div className={`flex-1 ${item.color} rounded h-3`} style={{width: `${30 + (i * 10)}%`}}></div>
                            <span className="text-xs">{item.value} ({item.count})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar Filters */}
                <div className="w-48 bg-slate-50 border-l p-3 space-y-3">
                  <p className="text-xs text-slate-500">Also need gender and NCY/reg group (reg group nested in NCY)</p>
                  
                  {[
                    { label: "ethnicity", value: "All" },
                    { label: "disadvantaged", value: "All" },
                    { label: "ppi", value: "All" },
                    { label: "fsm6", value: "1" },
                    { label: "fsm", value: "All" },
                    { label: "ever_in_care...", value: "All" },
                    { label: "sen_status, s...", value: "All" },
                    { label: "eal", value: "All" },
                  ].map((filter, i) => (
                    <div key={i}>
                      <label className="text-xs text-slate-600 mb-1 block">{filter.label}</label>
                      <div className="relative">
                        <select className="w-full text-xs p-2 border border-slate-200 rounded bg-white appearance-none pr-6">
                          <option>{filter.value}</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
