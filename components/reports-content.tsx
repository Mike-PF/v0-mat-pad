"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, FilterX, Download, ArrowUp, ArrowDown, ChevronDown } from "lucide-react"

export function ReportsContent() {
  const [selectedDashboard, setSelectedDashboard] = useState("")
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
          <div className="flex items-center gap-4">
            <Select value={selectedDashboard || ""} onValueChange={setSelectedDashboard}>
              <SelectTrigger className="w-60 h-9 bg-white border-slate-200 hover:border-[#121051] transition-colors">
                <SelectValue placeholder="Select dashboard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="behaviour">Behaviour</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="safeguarding">Safeguarding</SelectItem>
              </SelectContent>
            </Select>
            <button
              className="text-sm text-[#121051] hover:underline"
              onClick={() => setSelectedDashboard("")}
            >
              Clear Selection
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Buttons - Only show when dashboard is selected */}
      {selectedDashboard && (
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {dashboardButtons.map((button) => (
                <Button
                  key={button.id}
                  variant={selectedReport === button.id ? "default" : "outline"}
                  size="sm"
                  className={`h-9 px-3 text-sm ${
                    selectedReport === button.id
                      ? "bg-[#121051] text-white hover:bg-[#1a1a6c]"
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
      )}

      {/* Card 3: Attendance Headlines Dashboard - Only show when dashboard is selected */}
      {selectedDashboard && (
      <Card className="bg-white overflow-hidden">
        <CardContent className="p-0">
          {/* Teal Header */}
          <div className="bg-[#2395A4] text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Attendance headlines - 01/09/2024 to 31/08/2025</h2>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-white/70 mb-1">phase, schoolID</span>
                <div className="relative">
                  <select className="bg-white text-slate-800 text-sm px-3 py-1.5 pr-8 rounded appearance-none min-w-[120px]">
                    <option>Primary</option>
                    <option>Secondary</option>
                    <option>All</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/70 mb-1">yearend, nat_term, HT</span>
                <div className="relative">
                  <select className="bg-white text-slate-800 text-sm px-3 py-1.5 pr-8 rounded appearance-none min-w-[80px]">
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-white/70 mb-1">date</span>
                <div className="flex items-center gap-2">
                  <input type="date" defaultValue="2024-03-14" className="bg-white text-slate-800 text-sm px-3 py-1.5 rounded" />
                  <input type="date" defaultValue="2026-01-08" className="bg-white text-slate-800 text-sm px-3 py-1.5 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Applied Bar */}
          <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
            Filters applied: SEN status- All | FSM6- 1 | Attendance band- 95+%
          </div>

          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Headline Metrics Row */}
              <div className="grid grid-cols-7 gap-3 mb-6">
                {/* Total Pupils */}
                <div className="bg-[#2395A4] text-white rounded-lg p-4">
                  <div className="text-xs font-medium mb-2">Total pupils</div>
                  <div className="text-3xl font-bold">31</div>
                </div>
                {/* Attendance */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-[#2395A4] mb-2">Attendance</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-500">MAT</span>
                    <span className="text-2xl font-bold text-emerald-500">97.3%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Nat. 94.8% <span className="text-emerald-500">▲ 2.5</span>
                  </div>
                </div>
                {/* Absence */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-[#2395A4] mb-2">Absence</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-500">MAT</span>
                    <span className="text-2xl font-bold text-emerald-500">2.7%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Nat. 5.2% <span className="text-red-500">▼ -2.5</span>
                  </div>
                </div>
                {/* Auth. absence */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-[#2395A4] mb-2">Auth. absence</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-500">MAT</span>
                    <span className="text-2xl font-bold text-emerald-500">2.0%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Nat. 3.7% <span className="text-red-500">▼ -2.5</span>
                  </div>
                </div>
                {/* Unauth. absence */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-[#2395A4] mb-2">Unauth. absence</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-500">MAT</span>
                    <span className="text-2xl font-bold text-amber-500">0.8%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Nat. 1.5% <span className="text-red-500">▼ -0.8</span>
                  </div>
                </div>
                {/* Persistent absence */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-[#2395A4] mb-2">Persistent absence</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-500">MAT</span>
                    <span className="text-2xl font-bold text-emerald-500">0.0%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Nat. 15.6% <span className="text-red-500">▼ -15.6</span>
                  </div>
                </div>
                {/* Severe absence */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs font-medium text-[#2395A4] mb-2">Severe absence</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-500">MAT</span>
                    <span className="text-2xl font-bold text-emerald-500">0.0%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Nat. 0.3% <span className="text-red-500">▼ -0.3</span>
                  </div>
                </div>
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {/* Attendance Trends */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Attendance trends</h4>
                  <div className="flex items-center gap-4 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2395A4]"></div>
                      <span className="text-slate-600">MAT (selected pupils)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#121051]"></div>
                      <span className="text-slate-600">National (all pupils)</span>
                    </div>
                  </div>
                  <div className="h-28 relative">
                    <svg className="w-full h-full" viewBox="0 0 200 80">
                      <text x="5" y="12" fontSize="8" fill="#94a3b8">100%</text>
                      <text x="5" y="70" fontSize="8" fill="#94a3b8">95%</text>
                      <line x1="25" y1="10" x2="190" y2="10" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="25" y1="40" x2="190" y2="40" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="25" y1="70" x2="190" y2="70" stroke="#e5e7eb" strokeWidth="1" />
                      {/* National line */}
                      <polyline fill="none" stroke="#121051" strokeWidth="1.5" points="35,55 70,52 105,52 140,45 175,48" />
                      <circle cx="35" cy="55" r="3" fill="#121051" />
                      <circle cx="70" cy="52" r="3" fill="#121051" />
                      <circle cx="105" cy="52" r="3" fill="#121051" />
                      <circle cx="140" cy="45" r="3" fill="#121051" />
                      <circle cx="175" cy="48" r="3" fill="#121051" />
                      {/* MAT line */}
                      <polyline fill="none" stroke="#0d9488" strokeWidth="1.5" points="35,50 70,48 105,55 140,25 175,20" />
                      <circle cx="35" cy="50" r="3" fill="#0d9488" />
                      <circle cx="70" cy="48" r="3" fill="#0d9488" />
                      <circle cx="105" cy="55" r="3" fill="#0d9488" />
                      <circle cx="140" cy="25" r="3" fill="#0d9488" />
                      <circle cx="175" cy="20" r="3" fill="#0d9488" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1 px-2">
                    <span>Spr. 2024</span>
                    <span>Sum.</span>
                    <span>Aut.</span>
                    <span>Spr. 2025</span>
                    <span>Sum.</span>
                  </div>
                </div>

                {/* % pupils by attendance band */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">% pupils by attendance band</h4>
                  <div className="flex items-center justify-center h-32">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="14" strokeDasharray="96 155" strokeDashoffset="0" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="14" strokeDasharray="43 208" strokeDashoffset="-96" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="14" strokeDasharray="25 226" strokeDashoffset="-139" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="14" strokeDasharray="80 171" strokeDashoffset="-164" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
                        <span className="font-bold text-slate-800">31</span>
                        <span className="text-slate-500">(38.27%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs mt-2">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span>95+%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span>90-95%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-500 rounded-full"></span>80-90%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span>50-80%</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full"></span>{"<"}50%</span>
                  </div>
                </div>

                {/* No. of persistently/severely absent */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">No. of persistently absent pupils</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-slate-500 w-6">PA</span>
                    <div className="flex-1 bg-slate-100 rounded h-5 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-[#c4b5fd] rounded" style={{width: '40%'}}></div>
                    </div>
                    <span className="text-xs font-medium w-6">31</span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">No. of severely absent pupils</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-6">SA</span>
                    <div className="flex-1 bg-slate-100 rounded h-5 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-[#d4d4d8] rounded" style={{width: '40%'}}></div>
                    </div>
                    <span className="text-xs font-medium w-6">31</span>
                  </div>
                </div>

                {/* % attendance by NCY */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">% attendance by NCY</h4>
                  <div className="flex items-end gap-2 h-28 px-2">
                    {[
                      { ncy: "1", value: "1.5%", green: 15, red: 85 },
                      { ncy: "2", value: "1.6%", green: 16, red: 84 },
                      { ncy: "3", value: "1.9%", green: 19, red: 81 },
                      { ncy: "4", value: "2.0%", green: 20, red: 80 },
                      { ncy: "5", value: "1.8%", green: 18, red: 82 },
                      { ncy: "6", value: "2.0%", green: 20, red: 80 },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="text-xs text-slate-600 mb-1">{item.value}</div>
                        <div className="w-full flex flex-col h-16">
                          <div className="bg-red-400 rounded-t flex-1" style={{height: `${item.red}%`}}></div>
                          <div className="bg-green-500 rounded-b" style={{height: `${item.green}%`}}></div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{item.ncy}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Charts Row 2 - Breakdowns */}
              <div className="grid grid-cols-5 gap-3">
                {/* % absence by school */}
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-slate-700 mb-3">% absence by school</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 w-14 truncate">School B</span>
                      <div className="flex-1 bg-red-400 rounded h-4"></div>
                      <span className="text-xs">2.6% (26)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 w-14 truncate">School A</span>
                      <div className="flex-1 bg-red-300 rounded h-4" style={{width: '80%'}}></div>
                      <span className="text-xs">3.5% (5)</span>
                    </div>
                  </div>
                </div>

                {/* % absence by SEN status */}
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-slate-700 mb-3">% absence by SEN status</h4>
                  <div className="space-y-1.5">
                    {[
                      { label: "E", value: "3.7%", count: 2, width: "50%" },
                      { label: "K", value: "3.0%", count: 11, width: "40%" },
                      { label: "NULL", value: "2.4%", count: 15, width: "32%" },
                      { label: "N", value: "2.7%", count: 3, width: "36%" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-xs text-slate-600 w-8">{item.label}</span>
                        <div className="flex-1 bg-red-300 rounded h-3" style={{width: item.width}}></div>
                        <span className="text-xs whitespace-nowrap">{item.value} ({item.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* % absence by gender & EAL */}
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-slate-700 mb-2">% absence by gender</h4>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 w-4">0</span>
                      <div className="flex-1 bg-green-500 rounded h-3" style={{width: '70%'}}></div>
                      <span className="text-xs">2.8% (30)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 w-4">1</span>
                      <div className="flex-1 bg-green-300 rounded h-3" style={{width: '20%'}}></div>
                      <span className="text-xs">0.8% (1)</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-medium text-slate-700 mb-2">% absence by EAL</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 w-4">0</span>
                      <div className="flex-1 bg-green-500 rounded h-3" style={{width: '70%'}}></div>
                      <span className="text-xs">2.8% (30)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 w-4">1</span>
                      <div className="flex-1 bg-green-300 rounded h-3" style={{width: '20%'}}></div>
                      <span className="text-xs">0.8% (1)</span>
                    </div>
                  </div>
                </div>

                {/* % absence by pupil premium & FSM */}
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-slate-700 mb-2">% absence by pupil premium</h4>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 w-4">1</span>
                      <div className="flex-1 bg-red-400 rounded h-3" style={{width: '55%'}}></div>
                      <span className="text-xs">4.0% (4)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 w-4">0</span>
                      <div className="flex-1 bg-red-300 rounded h-3" style={{width: '40%'}}></div>
                      <span className="text-xs">2.5% (27)</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-medium text-slate-700 mb-2">% absence by FSM</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 w-4">1</span>
                      <div className="flex-1 bg-red-400 rounded h-3" style={{width: '45%'}}></div>
                      <span className="text-xs">2.7% (31)</span>
                    </div>
                  </div>
                </div>

                {/* % absence by ethnicity */}
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-slate-700 mb-3">% absence by ethnicity</h4>
                  <div className="space-y-1.5">
                    {[
                      { label: "Any oth...", value: "2.1%", count: 11, color: "bg-red-300" },
                      { label: "White a...", value: "3.1%", count: 18, color: "bg-red-400" },
                      { label: "NULL", value: "2.1%", count: 11, color: "bg-red-200" },
                      { label: "White -...", value: "3.4%", count: 1, color: "bg-red-400" },
                      { label: "Any oth...", value: "0.8%", count: 1, color: "bg-red-100" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-xs text-slate-600 w-14 truncate">{item.label}</span>
                        <div className={`flex-1 ${item.color} rounded h-3`} style={{width: `${40 + (i * 8)}%`}}></div>
                        <span className="text-xs whitespace-nowrap">{item.value} ({item.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Filters */}
            <div className="w-48 bg-slate-50 border-l border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-4">Also need gender and NCY/reg group (reg group nested in NCY)</p>
              
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
                <div key={i} className="mb-3">
                  <label className="text-xs text-slate-600 mb-1 block">{filter.label}</label>
                  <div className="relative">
                    <select className="w-full text-xs p-2 border border-slate-200 rounded bg-white appearance-none pr-6">
                      <option>{filter.value}</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  )
}
