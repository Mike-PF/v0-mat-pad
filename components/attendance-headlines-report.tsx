"use client"

import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, LabelList,
} from "recharts"
import { ChevronDown } from "lucide-react"

// --- Data ---
const trendData = [
  { term: "Spr. 2024", mat: 96.8, nat: 95.1 },
  { term: "Sum.", mat: 97.2, nat: 95.3 },
  { term: "Aut.", mat: 97.0, nat: 94.9 },
  { term: "Spr. 2025", mat: 97.5, nat: 95.0 },
  { term: "Sum.", mat: 97.1, nat: 95.2 },
  { term: "Aut.", mat: 97.4, nat: 94.8 },
  { term: "Spr. 2026", mat: 97.3, nat: 94.8 },
]

const bandData = [
  { name: "95+%",   value: 31, pct: "38.27%", color: "#4ade80" },
  { name: "90-95%", value: 14, pct: "17.28%", color: "#a78bfa" },
  { name: "80-90%", value: 26, pct: "32.1%",  color: "#c084fc" },
  { name: "50-80%", value: 8,  pct: "9.88%",  color: "#fb923c" },
  { name: "<50%",   value: 2,  pct: "2.47%",  color: "#fbbf24" },
]

const ncyData = [
  { ncy: "1", pct: "1.5%", above: 65, below: 35 },
  { ncy: "2", pct: "1.6%", above: 62, below: 38 },
  { ncy: "3", pct: "1.9%", above: 55, below: 45 },
  { ncy: "4", pct: "2.0%", above: 60, below: 40 },
  { ncy: "5", pct: "1.8%", above: 58, below: 42 },
  { ncy: "6", pct: "2.0%", above: 60, below: 40 },
]

// --- Helpers ---
function HBar({ label, items }: {
  label: string
  items: { name: string; value: number; count: number; color: string }[]
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-700 mb-2">{label}</p>
      <div className="space-y-1.5">
        {items.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-12 text-right shrink-0">{d.name}</span>
            <div className="relative h-5 flex-1 bg-slate-100 rounded-sm overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-sm"
                style={{ width: `${Math.min(d.value * 15, 100)}%`, backgroundColor: d.color }}
              />
              <span className="absolute inset-0 flex items-center pl-1 text-xs font-medium text-white drop-shadow">
                {d.value}% ({d.count})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[120px]">
      <span className="text-[10px] text-white/70 uppercase tracking-wide">{label}</span>
      <button className="flex items-center justify-between gap-2 bg-white text-slate-700 text-xs rounded px-2.5 py-1.5 border border-white/20 transition-colors hover:bg-slate-50">
        <span>{value}</span>
        <ChevronDown className="w-3 h-3 shrink-0 text-slate-400" />
      </button>
    </div>
  )
}

// --- Component ---
export function AttendanceHeadlinesReport() {
  const [dateFrom, setDateFrom] = useState("2024-03-14")
  const [dateTo, setDateTo] = useState("2026-01-08")

  return (
    <div className="w-full bg-slate-50 min-h-full">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="bg-[#2395A4] px-6 py-4">
        <div className="flex items-start justify-between gap-6">
          <h1 className="text-lg font-bold text-white whitespace-nowrap mt-1">
            Attendance headlines - 01/09/2024 to 31/08/2025
          </h1>
          <div className="flex items-start gap-4 flex-wrap justify-end">
            <FilterSelect label="Phase / School" value="Primary" />
            <FilterSelect label="Year End" value="2025" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-white/70 uppercase tracking-wide">Date Range</span>
              <div className="flex items-center gap-1 bg-white text-slate-700 text-xs rounded px-2.5 py-1.5 border border-white/20">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="border-none outline-none text-xs bg-transparent w-28"
                />
                <span className="text-slate-400">–</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="border-none outline-none text-xs bg-transparent w-28"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters applied */}
      <div className="bg-white border-b border-slate-200 px-6 py-2">
        <p className="text-xs text-slate-600">
          Filters applied: SEN status- All | FSM6- 1 | Attendance band- 95+%
        </p>
      </div>

      {/* ── Filters applied ──────────────────────────────────────── */}
      <div className="px-4 py-1.5 border-b border-slate-200 text-xs text-slate-600">
        Filters applied: SEN status- All | FSM6- 1 | Attendance band- 95+%
      </div>

      <div className="flex min-h-0">
        {/* ── Main ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 p-4 space-y-4 overflow-x-auto">

          {/* KPI row */}
          <div className="flex gap-2">
            <div className="bg-[#2395A4] text-white rounded p-3 flex flex-col min-w-[80px] shrink-0">
              <span className="text-xs font-semibold leading-tight">Total pupils</span>
              <span className="text-4xl font-bold mt-1">31</span>
            </div>
            {[
              { label: "Attendance",         mat: "97.3%", nat: "94.8%", diff: "2.5",   up: true  },
              { label: "Absence",            mat: "2.7%",  nat: "5.2%",  diff: "-2.5",  up: false },
              { label: "Auth. absence",      mat: "2.0%",  nat: "3.7%",  diff: "-2.5",  up: false },
              { label: "Unauth. absence",    mat: "0.8%",  nat: "1.5%",  diff: "-0.8",  up: false },
              { label: "Persistent absence", mat: "0.0%",  nat: "15.6%", diff: "-15.6", up: false },
              { label: "Severe absence",     mat: "0.0%",  nat: "0.3%",  diff: "-0.3",  up: false },
            ].map((m) => (
              <div key={m.label} className="border border-[#2395A4] rounded p-2 flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#2395A4] truncate">{m.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  MAT <span className="text-xl font-bold text-[#2395A4]">{m.mat}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 flex-wrap">
                  Nat. {m.nat}
                  <span className="text-green-600">{m.up ? "▲" : "▼"} {m.diff}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div className="grid grid-cols-4 gap-3">

            {/* Attendance trends */}
            <div className="border border-slate-200 rounded p-3">
              <p className="text-xs font-semibold text-slate-700 text-center mb-2">Attendance trends</p>
              <div className="flex gap-3 justify-center mb-1">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="inline-block w-4 h-0.5 bg-[#2395A4]" />MAT (selected pupils)
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="inline-block w-4 h-0.5 bg-[#121051]" />National (all pupils)
                </span>
              </div>
              <ResponsiveContainer width="100%" height={155}>
                <LineChart data={trendData} margin={{ top: 4, right: 8, bottom: 30, left: 28 }}>
                  <XAxis dataKey="term" tick={{ fontSize: 8 }} interval={0} angle={-30} textAnchor="end" />
                  <YAxis domain={[94.5, 100]} tick={{ fontSize: 8 }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Line type="monotone" dataKey="mat" stroke="#2395A4" strokeWidth={2} dot={{ r: 3, fill: "#2395A4" }} />
                  <Line type="monotone" dataKey="nat" stroke="#121051" strokeWidth={2} dot={{ r: 3, fill: "#121051" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* % pupils by attendance band */}
            <div className="border border-slate-200 rounded p-3">
              <p className="text-xs font-semibold text-slate-700 text-center mb-1">% pupils by attendance band</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={bandData}
                    cx="50%" cy="45%"
                    innerRadius={42} outerRadius={65}
                    dataKey="value"
                    label={({ cx, cy, midAngle, outerRadius, index }) => {
                      const RADIAN = Math.PI / 180
                      const d = bandData[index]
                      const x = cx + (outerRadius + 22) * Math.cos(-midAngle * RADIAN)
                      const y = cy + (outerRadius + 22) * Math.sin(-midAngle * RADIAN)
                      return (
                        <text x={x} y={y} fontSize={8} textAnchor="middle" fill="#555">
                          {d.value} ({d.pct})
                        </text>
                      )
                    }}
                    labelLine={false}
                  >
                    {bandData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight="bold" fill="#121051">31</text>
                  <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#666">(38.27%)</text>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 justify-center">
                {bandData.map((b) => (
                  <span key={b.name} className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                    {b.name}
                  </span>
                ))}
              </div>
            </div>

            {/* PA / SA counts */}
            <div className="border border-slate-200 rounded p-3 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-700 leading-tight mb-2">No. of persistently absent pupils</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-5 shrink-0">PA</span>
                    <div className="flex-1 bg-[#d8b4fe] rounded-sm h-5 flex items-center pr-1 justify-end">
                      <span className="text-xs font-medium text-slate-700">31</span>
                    </div>
                  </div>
                  <div className="bg-slate-200 rounded-sm h-5 flex items-center pr-1 justify-end ml-7">
                    <span className="text-xs text-slate-500">31</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 leading-tight mb-2">No. of severely absent pupils</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-5 shrink-0">SA</span>
                    <div className="flex-1 bg-slate-300 rounded-sm h-5 flex items-center pr-1 justify-end">
                      <span className="text-xs font-medium text-slate-700">31</span>
                    </div>
                  </div>
                  <div className="bg-slate-200 rounded-sm h-5 flex items-center pr-1 justify-end ml-7">
                    <span className="text-xs text-slate-500">31</span>
                  </div>
                </div>
              </div>
            </div>

            {/* % attendance by NCY */}
            <div className="border border-slate-200 rounded p-3">
              <p className="text-xs font-semibold text-slate-700 text-center mb-1">% attendance by NCY</p>
              <ResponsiveContainer width="100%" height={185}>
                <BarChart data={ncyData} margin={{ top: 18, right: 4, bottom: 0, left: -24 }}>
                  <XAxis dataKey="ncy" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="above" stackId="a" fill="#a78bfa" radius={[0,0,0,0]}>
                    <LabelList dataKey="pct" position="top" style={{ fontSize: 8, fill: "#555" }} />
                  </Bar>
                  <Bar dataKey="below" stackId="a" fill="#c4b5fd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts row 2 – absence breakdowns */}
          <div className="grid grid-cols-5 gap-3">
            {/* % absence by school */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">% absence by school</p>
              <p className="text-xs text-slate-400 mb-1 rotate-0">Primary</p>
              <div className="space-y-1.5">
                {[
                  { name: "School B", value: 2.6, count: 26 },
                  { name: "School A", value: 3.5, count: 5 },
                ].map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-14 text-right shrink-0">{d.name}</span>
                    <div className="relative flex-1 h-6 bg-[#fca5a5] rounded-sm overflow-hidden">
                      <div className="absolute left-0 h-full bg-[#ef4444] rounded-sm" style={{ width: `${d.value * 20}%` }} />
                      <span className="absolute inset-0 flex items-center pl-1 text-xs font-medium text-white drop-shadow">
                        {d.value}% ({d.count})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* % absence by SEN status */}
            <HBar label="% absence by SEN status" items={[
              { name: "E",    value: 3.7, count: 2,  color: "#ef4444" },
              { name: "K",    value: 3.0, count: 11, color: "#ef4444" },
              { name: "NULL", value: 2.4, count: 15, color: "#ef4444" },
              { name: "N",    value: 2.7, count: 3,  color: "#4ade80" },
            ]} />

            {/* % absence by gender + EAL */}
            <div className="space-y-4">
              <HBar label="% absence by gender" items={[
                { name: "0", value: 2.8, count: 30, color: "#ef4444" },
                { name: "1", value: 0.8, count: 1,  color: "#4ade80" },
              ]} />
              <HBar label="% absence by EAL" items={[
                { name: "0", value: 2.8, count: 30, color: "#ef4444" },
                { name: "1", value: 0.8, count: 1,  color: "#4ade80" },
              ]} />
            </div>

            {/* % absence by pupil premium + FSM */}
            <div className="space-y-4">
              <HBar label="% absence by pupil premium" items={[
                { name: "1", value: 4.0, count: 4,  color: "#ef4444" },
                { name: "0", value: 2.5, count: 27, color: "#ef4444" },
              ]} />
              <HBar label="% absence by FSM" items={[
                { name: "1", value: 2.7, count: 31, color: "#ef4444" },
              ]} />
            </div>

            {/* % absence by ethnicity */}
            <HBar label="% absence by ethnicity" items={[
              { name: "Any oth...",  value: 2.1, count: 11, color: "#fca5a5" },
              { name: "White a...",  value: 3.1, count: 18, color: "#fca5a5" },
              { name: "NULL",        value: 2.1, count: 11, color: "#ef4444" },
              { name: "White - ...", value: 3.4, count: 1,  color: "#fca5a5" },
              { name: "White a...",  value: 3.4, count: 1,  color: "#4ade80" },
              { name: "Any oth...",  value: 0.8, count: 1,  color: "#4ade80" },
            ]} />
          </div>

        </div>

        {/* ── Right sidebar ─────────────────────────────────────── */}
        <div className="w-44 shrink-0 border-l border-slate-200 p-3 space-y-3">
          <p className="text-xs text-slate-500 leading-tight">
            Also need gender and NCY/reg group (reg group nested in NCY)
          </p>
          {[
            { label: "ethnicity",       value: "All" },
            { label: "disadvantaged",   value: "All" },
            { label: "ppi",             value: "All" },
            { label: "fsm6",            value: "1"   },
            { label: "fsm",             value: "All" },
            { label: "ever_in_care....", value: "All" },
            { label: "sen_status, s...", value: "All" },
            { label: "eal",             value: "All" },
          ].map((f) => (
            <div key={f.label} className="text-xs">
              <p className="text-slate-600 font-medium mb-0.5">{f.label}</p>
              <div className="px-2 py-1 border border-slate-200 rounded bg-slate-50 text-slate-700 truncate">
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
