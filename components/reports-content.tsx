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
        </CardContent>
      </Card>
    </div>
  )
}
