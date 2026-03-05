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

      {/* Card 3: Attendance Summary Dashboard */}
      <Card className="bg-white">
        <CardContent className="p-6">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B30089] flex items-center justify-center">
                <span className="text-white text-xs font-bold">MAT</span>
              </div>
              <h1 className="text-xl font-semibold text-[#121051]">Attendance Summary Dashboard - Whole MAT</h1>
            </div>
            <span className="text-sm text-slate-500">National Data Collected - 21 March 2025</span>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 text-center">
                <div className="text-sm text-slate-600 mb-3">{metric.title}</div>
                <div className={`text-3xl font-bold mb-1 ${metric.color}`}>{metric.value}</div>
                {metric.national && (
                  <div className="text-xs text-slate-500 mb-1">{metric.national}</div>
                )}
                <div className="text-xs text-teal-500">{metric.change}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Attendance Trends */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-center text-slate-700 mb-4">Attendance trends</h3>
              
              {/* Line Chart */}
              <div className="h-44 relative mb-4">
                <svg className="w-full h-full" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="300" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="50" x2="300" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="80" x2="300" y2="80" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="110" x2="300" y2="110" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* National line (blue) */}
                  <polyline 
                    fill="none" 
                    stroke="#121051" 
                    strokeWidth="2" 
                    points="60,90 130,85 200,85 270,75" 
                  />
                  <circle cx="60" cy="90" r="4" fill="#121051" />
                  <circle cx="130" cy="85" r="4" fill="#121051" />
                  <circle cx="200" cy="85" r="4" fill="#121051" />
                  <circle cx="270" cy="75" r="4" fill="#121051" />
                  
                  {/* Whole MAT line (teal) */}
                  <polyline 
                    fill="none" 
                    stroke="#14b8a6" 
                    strokeWidth="2" 
                    points="60,80 130,82 200,95 270,55" 
                  />
                  <circle cx="60" cy="80" r="4" fill="#14b8a6" />
                  <circle cx="130" cy="82" r="4" fill="#14b8a6" />
                  <circle cx="200" cy="95" r="4" fill="#14b8a6" />
                  <circle cx="270" cy="55" r="4" fill="#14b8a6" />
                </svg>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-[#121051]"></div>
                  <span className="text-slate-600">National</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-teal-500"></div>
                  <span className="text-slate-600">Whole MAT</span>
                </div>
              </div>

              {/* Data Table */}
              <table className="w-full text-xs border border-slate-200 rounded">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-2 text-left font-medium text-slate-600 border-r border-slate-200"></th>
                    {attendanceTrendsData.map((item, i) => (
                      <th key={i} className="p-2 text-center font-medium text-slate-600 border-r border-slate-200 last:border-r-0">
                        {item.year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="p-2 font-medium text-slate-600 bg-slate-50 border-r border-slate-200">National</td>
                    {attendanceTrendsData.map((item, i) => (
                      <td key={i} className="p-2 text-center border-r border-slate-200 last:border-r-0">{item.national}</td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="p-2 font-medium text-slate-600 bg-slate-50 border-r border-slate-200">Whole MAT</td>
                    {attendanceTrendsData.map((item, i) => (
                      <td key={i} className="p-2 text-center border-r border-slate-200 last:border-r-0">{item.wholeMat}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pupils by Attendance Band */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-center text-slate-700 mb-4">% pupils by attendance band</h3>
              
              {/* Donut Chart */}
              <div className="flex items-center justify-center h-48 mb-4">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* 95%+ (green) - 65.1% */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="12" 
                      strokeDasharray="163.4 251.2" strokeDashoffset="0" />
                    {/* 90-95% (blue) - 16% */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" 
                      strokeDasharray="40.2 374.4" strokeDashoffset="-163.4" />
                    {/* 80-90% (purple) - 8% */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="12" 
                      strokeDasharray="20.1 394.5" strokeDashoffset="-203.6" />
                    {/* 50-80% (pink) - 7% */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="12" 
                      strokeDasharray="17.6 397" strokeDashoffset="-223.7" />
                    {/* <50% (amber) - 3.9% */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" 
                      strokeDasharray="9.8 404.8" strokeDashoffset="-241.3" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">65.1%</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-600">95%+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-600">90-95%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-slate-600">80-90%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-slate-600">50-80%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-slate-600">{"<"}50%</span>
                </div>
              </div>
            </div>

            {/* Attendance by NCY - YTD */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-center text-slate-700 mb-4">Attendance by NCY - YTD</h3>
              
              {/* NCY Values */}
              <div className="flex items-end justify-center gap-8 h-48 pt-12">
                {[
                  { year: "Y7", value: "96%" },
                  { year: "Y8", value: "95.2%" },
                  { year: "Y9", value: "94.3%" },
                  { year: "Y10", value: "92.1%" },
                  { year: "Y11", value: "92.8%" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-slate-700 mb-3">{item.value}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mb-3"></div>
                    <span className="text-xs text-slate-500">{item.year}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-0 border-t-2 border-dashed border-slate-400"></div>
                  <span className="text-slate-600">Primary nat. av. - (94.9%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-0.5 bg-slate-400"></div>
                  <span className="text-slate-600">Secondary nat. av. - (91.8%)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
