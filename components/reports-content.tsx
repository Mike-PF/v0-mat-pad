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

      {/* Card 3: Dashboard Content - Empty for rebuild */}
    </div>
  )
}
