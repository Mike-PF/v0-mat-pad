"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Minus } from "lucide-react"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts"

// ── Data ─────────────────────────────────────────────────────────────────────

const indicators = [
  "ELG01: Listening, attention & understanding",
  "ELG02: Speaking",
  "ELG03: Self-regulation",
  "ELG04: Managing self",
  "ELG05: Building relationships",
  "ELG06: Gross motor skills",
  "ELG07: Fine motor skills",
  "ELG08: Comprehension",
  "ELG09: Word reading",
  "ELG10: Writing",
  "ELG11: Number",
  "ELG12: Numerical patterns",
  "ELG13: Past & present",
  "ELG14: People, culture & communities",
  "ELG15: The natural world",
  "ELG16: Creating with materials",
  "ELG17: Being imaginative & expressive",
]

const radarData = [
  { subject: "FSM eli...",   MAT: 20, National: 10 },
  { subject: "SEN pro...",   MAT: 10, National: 8  },
  { subject: "First l...",   MAT: 18, National: 12 },
]

const trendData = [
  { year: "2022", MAT: 85.5, National: 85.8 },
  { year: "2023", MAT: 85.8, National: 85.7 },
  { year: "2024", MAT: 83.0, National: 85.2 },
  { year: "2025", MAT: 83.7, National: 85.0 },
]

const schoolRows = [
  { school: "East Riding of Yorkshire", pupils: 3118, result: 90.0, gapNat:  5.0, gapMat:  6.8 },
  { school: "North Yorkshire",          pupils: 5454, result: 89.6, gapNat:  4.6, gapMat:  6.4 },
  { school: "York",                     pupils: 1683, result: 86.3, gapNat:  1.3, gapMat:  3.1 },
  { school: "North East Lincolnshire",  pupils: 1627, result: 85.4, gapNat:  0.4, gapMat:  2.2 },
  { school: "Kirklees",                 pupils: 4817, result: 83.9, gapNat: -1.2, gapMat:  0.7 },
  { school: "North Lincolnshire",       pupils: 1620, result: 83.2, gapNat: -1.9, gapMat:  0.0 },
  { school: "Sheffield",                pupils: 5882, result: 83.0, gapNat: -2.0, gapMat: -0.2 },
  { school: "Rotherham",                pupils: 2990, result: 82.9, gapNat: -2.2, gapMat: -0.3 },
  { school: "Wakefield",                pupils: 4050, result: 82.9, gapNat: -2.2, gapMat: -0.3 },
  { school: "Leeds",                    pupils: 8985, result: 82.6, gapNat: -2.5, gapMat: -0.6 },
  { school: "Calderdale",               pupils: 2289, result: 82.0, gapNat: -3.1, gapMat: -1.2 },
  { school: "Barnsley",                 pupils: 2704, result: 82.0, gapNat: -3.1, gapMat: -1.2 },
  { school: "Doncaster",                pupils: 3521, result: 81.1, gapNat: -3.9, gapMat: -2.1 },
  { school: "Kingston upon Hull, City of", pupils: 3010, result: 79.6, gapNat: -5.4, gapMat: -3.6 },
  { school: "Bradford",                 pupils: 6815, result: 78.0, gapNat: -7.1, gapMat: -5.2 },
]

type PupilGroup = {
  label: string
  indent?: boolean
  pupils?: number
  result?: number
  gapNat?: number
  gapMat?: number
  isGroup?: boolean
  children?: PupilGroup[]
}

const pupilGroups: PupilGroup[] = [
  {
    label: "All pupils", isGroup: true,
    children: [
      { label: "All pupils", indent: true, pupils: 5882, result: 83.0, gapNat: -2.0, gapMat: -0.2 },
    ]
  },
  {
    label: "FSM eligibility", isGroup: true,
    children: [
      { label: "Eligible for FSM",     indent: true, pupils: 1612, result: 70.2, gapNat: -4.5, gapMat: -2.6 },
      { label: "Not eligible for FSM", indent: true, pupils: 4159, result: 88.8, gapNat:  1.1, gapMat:  2.7 },
      { label: "Unknown",              indent: true, pupils:  111, result: 55.0, gapNat:-14.7, gapMat: -1.8 },
    ]
  },
  {
    label: "SEN provision", isGroup: true,
    children: [
      { label: "All SEN",     indent: true, pupils:  869, result: 41.9, gapNat: -2.3, gapMat: -0.1 },
      { label: "EHCP",        indent: true, pupils:  150, result: 10.0, gapNat: -3.6, gapMat: -1.1 },
      { label: "No SEN",      indent: true, pupils: 4916, result: 90.9, gapNat: -1.2, gapMat:  0.1 },
      { label: "SEN support", indent: true, pupils:  719, result: 48.5, gapNat: -6.4, gapMat: -2.5 },
      { label: "Unknown",     indent: true, pupils:   97, result: 54.6, gapNat: -3.6, gapMat:  5.5 },
    ]
  },
  {
    label: "First language", isGroup: true,
    children: [
      { label: "English",             indent: true, pupils: 4239, result: 87.4, gapNat: -0.1, gapMat:  1.4 },
      { label: "Other than English",  indent: true, pupils: 1512, result: 72.6, gapNat: -5.4, gapMat: -0.5 },
      { label: "Unknown",             indent: true, pupils:  131, result: 61.1, gapNat:-13.9, gapMat: -2.3 },
    ]
  },
  {
    label: "Term of birth", isGroup: true,
    children: [
      { label: "Autumn", indent: true, pupils: 2016, result: 86.0, gapNat: -2.1, gapMat: -0.8 },
      { label: "Spring", indent: true, pupils: 1454, result: 84.7, gapNat: -1.1, gapMat:  1.0 },
      { label: "Summer", indent: true, pupils: 2412, result: 79.6, gapNat: -2.5, gapMat: -0.3 },
    ]
  },
  {
    label: "Ethnicity", isGroup: true,
    children: [
      { label: "Any other Asian background", indent: true, pupils: 155 },
      { label: "Any other Black background", indent: true, pupils:  64 },
    ]
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[120px]">
      <span className="text-[10px] text-white/70 uppercase tracking-wide">{label}</span>
      <button className="flex items-center justify-between gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs rounded px-2.5 py-1.5 border border-white/20 transition-colors">
        <span>{value}</span>
        <ChevronDown className="w-3 h-3 shrink-0 text-slate-400" />
      </button>
    </div>
  )
}

function GapIndicator({ value }: { value?: number }) {
  if (value === undefined || value === null) return <span className="text-slate-400 text-xs">—</span>
  if (Math.abs(value) < 0.05) return (
    <span className="flex items-center gap-0.5 text-amber-500 text-xs font-medium">
      <Minus className="w-3 h-3" /> {value.toFixed(1)}%
    </span>
  )
  if (value > 0) return (
    <span className="flex items-center gap-0.5 text-green-600 text-xs font-medium">
      ▲ {value.toFixed(1)}%
    </span>
  )
  return (
    <span className="flex items-center gap-0.5 text-red-500 text-xs font-medium">
      ▼ {value.toFixed(1)}%
    </span>
  )
}

function ResultBadge({ value }: { value?: number }) {
  if (value === undefined) return null
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold text-white" style={{ backgroundColor: "#2395A4" }}>
      {value.toFixed(1)}%
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function EyfsPopilGroupReport() {
  const [selectedIndicator, setSelectedIndicator] = useState("ELG15: The natural world")
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    ["All pupils", "FSM eligibility", "SEN provision", "First language", "Term of birth", "Ethnicity"]
  )

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    )
  }

  return (
    <div className="w-full bg-slate-50 min-h-full font-sans">

      {/* Header */}
      <div className="bg-[#2395A4] px-6 py-4">
        <div className="flex items-start justify-between gap-6">
          <h1 className="text-lg font-bold text-white whitespace-nowrap mt-1">
            EYFS pupil group results (2025)
          </h1>
          <div className="flex items-start gap-4 flex-wrap justify-end">
            <FilterSelect label="Year"        value="2025"       />
            <FilterSelect label="Schools"     value="Sheffield"  />
            <FilterSelect label="Pupil group" value="All pupils" />
            <FilterSelect label="Sex"         value="All pupils" />
          </div>
        </div>
      </div>

      {/* Filters applied */}
      <div className="bg-white border-b border-slate-200 px-6 py-2">
        <p className="text-xs text-slate-600 underline cursor-pointer hover:text-slate-800">
          Filters applied: Year- 2025 | Schools - Sheffield | Pupil group- All pupils | Sex- All pupils
        </p>
      </div>

      {/* Body */}
      <div className="flex gap-4 p-4">

        {/* ── Left column ─────────────────────────────────────────── */}
        <div className="w-72 shrink-0 space-y-4">

          {/* Indicator selector */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2" style={{ backgroundColor: "#2395A4" }}>
              <p className="text-xs font-semibold text-white">Select indicator to display....</p>
            </div>
            <div className="p-3">
              <div className="relative">
                <select
                  value={selectedIndicator}
                  onChange={e => setSelectedIndicator(e.target.value)}
                  className="w-full appearance-none border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-700 bg-white pr-6"
                >
                  {indicators.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Cohort context */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2" style={{ backgroundColor: "#2395A4" }}>
              <p className="text-xs font-semibold text-white">Cohort context</p>
              <p className="text-[10px] text-white/70">Year- 2025 | Schools - Sheffield | Sex- All pupils</p>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[#5B9BF5] inline-block rounded"></span> MAT
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-slate-800 inline-block rounded"></span> National
                </span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={radarData} outerRadius={55}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#64748b" }} />
                  <Radar name="MAT" dataKey="MAT" stroke="#5B9BF5" fill="#5B9BF5" fillOpacity={0.25} />
                  <Radar name="National" dataKey="National" stroke="#1e293b" fill="#1e293b" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trend line chart */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2" style={{ backgroundColor: "#2395A4" }}>
              <p className="text-xs font-semibold text-white">The natural world</p>
              <p className="text-[10px] text-white/70">Schools - Sheffield | Pupil group- All pupils | Sex- All pupils</p>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-[#5B9BF5] inline-block rounded"></span> MAT/school(s)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-slate-800 inline-block rounded"></span> National
                </span>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={trendData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#64748b" }} />
                  <YAxis domain={[82, 88]} tickFormatter={v => `${v}%`} tick={{ fontSize: 9, fill: "#64748b" }} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Line type="monotone" dataKey="MAT" stroke="#5B9BF5" strokeWidth={2} dot={{ r: 3, fill: "#5B9BF5" }} />
                  <Line type="monotone" dataKey="National" stroke="#1e293b" strokeWidth={2} dot={{ r: 3, fill: "#1e293b" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Middle column: school table ──────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2" style={{ backgroundColor: "#2395A4" }}>
              <p className="text-xs font-semibold text-white">The natural world</p>
              <p className="text-[10px] text-white/70">Year- 2025 | Pupil group- All pupils | Sex- All pupils</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-3 py-2 font-semibold text-slate-700">School</th>
                  <th className="text-right px-2 py-2 font-semibold text-slate-700 whitespace-nowrap">No. of<br/>pupils</th>
                  <th className="text-center px-2 py-2 font-semibold text-slate-700">result (%)</th>
                  <th className="text-right px-2 py-2 font-semibold text-slate-700 whitespace-nowrap">gap w.<br/>nat. (pp)</th>
                  <th className="text-right px-2 py-2 font-semibold text-slate-700 whitespace-nowrap">gap w.<br/>MAT (pp)</th>
                </tr>
              </thead>
              <tbody>
                {schoolRows.map((row, i) => (
                  <tr key={row.school} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-3 py-1.5 text-slate-700">{row.school}</td>
                    <td className="px-2 py-1.5 text-right text-slate-600">{row.pupils.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-center"><ResultBadge value={row.result} /></td>
                    <td className="px-2 py-1.5 text-right"><GapIndicator value={row.gapNat} /></td>
                    <td className="px-2 py-1.5 text-right"><GapIndicator value={row.gapMat} /></td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-semibold border-t border-slate-200">
                  <td className="px-3 py-1.5 text-slate-800">All schools</td>
                  <td className="px-2 py-1.5 text-right text-slate-700">8,985</td>
                  <td className="px-2 py-1.5 text-center"><ResultBadge value={83.2} /></td>
                  <td className="px-2 py-1.5 text-right"><GapIndicator value={-1.9} /></td>
                  <td className="px-2 py-1.5 text-right"><GapIndicator value={0.0} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right column: pupil group table ─────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-4 py-2" style={{ backgroundColor: "#2395A4" }}>
              <p className="text-xs font-semibold text-white">The natural world</p>
              <p className="text-[10px] text-white/70">Year- 2025 | Schools - Sheffield | Sex- All pupils</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-3 py-2 font-semibold text-slate-700">Pupil group</th>
                  <th className="text-right px-2 py-2 font-semibold text-slate-700 whitespace-nowrap">No. of<br/>pupils</th>
                  <th className="text-center px-2 py-2 font-semibold text-slate-700">result (%)</th>
                  <th className="text-right px-2 py-2 font-semibold text-slate-700 whitespace-nowrap">gap w.<br/>nat. (pp)</th>
                  <th className="text-right px-2 py-2 font-semibold text-slate-700 whitespace-nowrap">gap w.<br/>MAT (pp)</th>
                </tr>
              </thead>
              <tbody>
                {pupilGroups.map((group) => (
                  <>
                    <tr
                      key={group.label}
                      className="bg-slate-100 cursor-pointer hover:bg-slate-200 border-t border-slate-200"
                      onClick={() => toggleGroup(group.label)}
                    >
                      <td className="px-3 py-1.5 font-semibold text-slate-700 flex items-center gap-1">
                        {expandedGroups.includes(group.label)
                          ? <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                          : <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                        }
                        {group.label}
                      </td>
                      <td colSpan={4} />
                    </tr>
                    {expandedGroups.includes(group.label) && group.children?.map((child, ci) => (
                      <tr key={child.label} className={ci % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                        <td className="pl-6 pr-3 py-1.5 text-slate-700">{child.label}</td>
                        <td className="px-2 py-1.5 text-right text-slate-600">{child.pupils?.toLocaleString() ?? "—"}</td>
                        <td className="px-2 py-1.5 text-center">{child.result !== undefined ? <ResultBadge value={child.result} /> : null}</td>
                        <td className="px-2 py-1.5 text-right"><GapIndicator value={child.gapNat} /></td>
                        <td className="px-2 py-1.5 text-right"><GapIndicator value={child.gapMat} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
