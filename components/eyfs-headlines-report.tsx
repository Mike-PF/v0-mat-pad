"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChevronDown } from "lucide-react"

// --- Data ---
const kpiCards = [
  {
    title: "% achieving a good level of development (2025)",
    headerBg: "#2395A4",
    value: "65.5%",
    sinceLastYear: "+1.0%",
    trend3yr: "+0.3%",
    nat: "68.3%",
    natDiff: "-2.8",
    sinceUp: true,
    trendUp: true,
    natUp: false,
  },
  {
    title: "% at exp. level in all ELGs (2025)",
    headerBg: "#c0392b",
    value: "64.1%",
    sinceLastYear: "+0.4%",
    trend3yr: "+0.4%",
    nat: "66.9%",
    natDiff: "-2.8",
    sinceUp: true,
    trendUp: true,
    natUp: false,
  },
  {
    title: "Av. No. of ELGs at exp. level (2025)",
    headerBg: "#2395A4",
    value: "13.9",
    sinceLastYear: "+0.1",
    trend3yr: "-0.1",
    nat: "14.1",
    natDiff: "-0.3",
    sinceUp: true,
    trendUp: false,
    natUp: false,
  },
  {
    title: "% at exp. level in communication, language & literacy (2025)",
    headerBg: "#2395A4",
    value: "66.6%",
    sinceLastYear: "+0.6%",
    trend3yr: "+0.1%",
    nat: "69.7%",
    natDiff: "-3.1",
    sinceUp: true,
    trendUp: true,
    natUp: false,
  },
  {
    title: "All literacy ELGs (2025)",
    headerBg: "#F79400",
    value: "67.3%",
    sinceLastYear: "+0.7%",
    trend3yr: "+0.1%",
    nat: "70.5%",
    natDiff: "-3.1",
    sinceUp: true,
    trendUp: true,
    natUp: false,
  },
  {
    title: "All mathematics ELGs (2025)",
    headerBg: "#7150BF",
    value: "74.6%",
    sinceLastYear: "+1.0%",
    trend3yr: "-0.2%",
    nat: "77.6%",
    natDiff: "-3.0",
    sinceUp: true,
    trendUp: false,
    natUp: false,
  },
]

const chartSections = [
  {
    title: "% achieving a good level of development",
    headerBg: "#2395A4",
    subtitle: "Schools - Sheffield | Pupil group- All pupils | Sex- All pupils",
    matData: [63.2, 64.5, 64.8, 65.5],
    natData: [65.8, 66.5, 67.2, 68.3],
    yMin: 62,
    yMax: 70,
    yTicks: [65, 70],
  },
  {
    title: "% at exp. level in communication, language & literacy",
    headerBg: "#7150BF",
    subtitle: "Schools - Sheffield | Pupil group- All pupils | Sex- All pupils",
    matData: [64.8, 65.4, 65.9, 66.6],
    natData: [66.2, 67.5, 68.8, 69.7],
    yMin: 63,
    yMax: 71,
    yTicks: [65, 70],
  },
  {
    title: "All personal, social and emotional development ELGs",
    headerBg: "#121051",
    subtitle: "Schools - Sheffield | Pupil group- All pupils | Sex- All pupils",
    matData: [84.2, 83.5, 81.8, 83.1],
    natData: [82.8, 83.1, 83.4, 83.6],
    yMin: 80,
    yMax: 86,
    yTicks: [82, 84],
  },
  {
    title: "All physical development ELGs",
    headerBg: "#6AD0D5",
    subtitle: "Schools - Sheffield | Pupil group- All pupils | Sex- All pupils",
    matData: [86.5, 86.2, 85.8, 85.4],
    natData: [84.2, 84.5, 84.3, 84.6],
    yMin: 81,
    yMax: 89,
    yTicks: [82, 84, 86, 88],
  },
  {
    title: "All literacy ELGs",
    headerBg: "#F79400",
    subtitle: "Schools - Sheffield | Pupil group- All pupils | Sex- All pupils",
    matData: [67.8, 67.2, 66.8, 67.3],
    natData: [68.4, 69.5, 70.1, 70.5],
    yMin: 65,
    yMax: 73,
    yTicks: [66, 68, 70, 72],
  },
  {
    title: "All mathematics ELGs",
    headerBg: "#7150BF",
    subtitle: "Schools - Sheffield | Pupil group- All pupils | Sex- All pupils",
    matData: [73.6, 74.1, 74.5, 74.6],
    natData: [75.8, 76.2, 76.8, 77.6],
    yMin: 71,
    yMax: 79,
    yTicks: [72, 74, 76, 78],
  },
  {
    title: "All expressive arts and design ELGs",
    headerBg: "#5BBE80",
    subtitle: "Schools - Sheffield | Pupil group- All pupils | Sex- All pupils",
    matData: [85.8, 85.2, 82.4, 84.1],
    natData: [84.6, 84.8, 83.9, 84.5],
    yMin: 81,
    yMax: 88,
    yTicks: [82, 84, 86],
  },
  {
    title: "All understanding the world ELGs",
    headerBg: "#F7555A",
    subtitle: "Schools - Sheffield | Pupil group- All pupils | Sex- All pupils",
    matData: [79.2, 80.5, 77.8, 78.6],
    natData: [78.4, 80.2, 80.6, 80.8],
    yMin: 76,
    yMax: 82,
    yTicks: [78, 80],
  },
]

const years = ["2022", "2023", "2024", "2025"]

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[120px]">
      <span className="text-[10px] text-white/70 uppercase tracking-wide">{label}</span>
      <button className="flex items-center justify-between gap-2 bg-white/15 hover:bg-white/25 text-white text-xs rounded px-2.5 py-1.5 border border-white/20 transition-colors">
        <span>{value}</span>
        <ChevronDown className="w-3 h-3 shrink-0" />
      </button>
    </div>
  )
}

function KpiCard({ card }: { card: typeof kpiCards[0] }) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white flex-1 min-w-0">
      <div className="px-3 py-2" style={{ backgroundColor: card.headerBg }}>
        <p className="text-[11px] font-semibold text-white leading-tight">{card.title}</p>
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-500">MAT/school(s)</span>
          <span className="text-xl font-bold" style={{ color: card.headerBg }}>{card.value}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          {card.sinceUp ? (
            <span className="text-green-600">▲ {card.sinceLastYear}</span>
          ) : (
            <span className="text-red-500">▼ {card.sinceLastYear}</span>
          )}
          <span className="text-slate-400">since last year</span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          {card.trendUp ? (
            <span className="text-green-600">▲ {card.trend3yr}</span>
          ) : (
            <span className="text-red-500">▼ {card.trend3yr}</span>
          )}
          <span className="text-slate-400">3 yr trend</span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-slate-500">Nat. {card.nat}</span>
          {card.natUp ? (
            <span className="text-green-600">▲ {card.natDiff}</span>
          ) : (
            <span className="text-red-500">▼ {card.natDiff}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function TrendChart({ section }: { section: typeof chartSections[0] }) {
  const data = years.map((y, i) => ({
    year: y,
    mat: section.matData[i],
    nat: section.natData[i],
  }))

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white flex-1 min-w-0">
      <div className="px-3 py-2" style={{ backgroundColor: section.headerBg }}>
        <p className="text-[11px] font-semibold text-white leading-tight">{section.title}</p>
        <p className="text-[10px] text-white/70 mt-0.5 leading-tight">{section.subtitle}</p>
      </div>
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-1">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5B9BF5] inline-block"></span>MAT/school(s)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#121051] inline-block"></span>National</span>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[section.yMin, section.yMax]}
              ticks={section.yTicks}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid #e2e8f0", padding: "4px 8px" }}
              formatter={(value: number) => [`${value}%`]}
            />
            <Line type="monotone" dataKey="mat" stroke="#5B9BF5" strokeWidth={2} dot={{ r: 3, fill: "#5B9BF5" }} />
            <Line type="monotone" dataKey="nat" stroke="#121051" strokeWidth={2} dot={{ r: 3, fill: "#121051" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function EyfsHeadlinesReport() {
  const [year] = useState("2025")
  const [school] = useState("Sheffield")
  const [pupilGroup] = useState("All pupils")
  const [sex] = useState("All pupils")

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header */}
      <div className="bg-[#2395A4] px-6 py-4">
        <div className="flex items-start justify-between gap-6">
          <h1 className="text-lg font-bold text-white whitespace-nowrap mt-1">
            EYFS headlines &amp; trends ({year})
          </h1>
          <div className="flex items-start gap-4 flex-wrap justify-end">
            <FilterSelect label="Year" value={year} />
            <FilterSelect label="Schools" value={school} />
            <FilterSelect label="Pupil group" value={pupilGroup} />
            <FilterSelect label="Sex" value={sex} />
          </div>
        </div>
      </div>

      {/* Filters applied */}
      <div className="bg-white border-b border-slate-200 px-6 py-2">
        <p className="text-xs text-slate-600">
          Filters applied: Year- {year} | Schools - {school} | Pupil group- {pupilGroup} | Sex- {sex}
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* KPI Cards */}
        <div className="flex gap-3">
          {kpiCards.map((card, i) => (
            <KpiCard key={i} card={card} />
          ))}
        </div>

        {/* Chart rows */}
        <div className="flex gap-3">
          {chartSections.slice(0, 4).map((section, i) => (
            <TrendChart key={i} section={section} />
          ))}
        </div>

        <div className="flex gap-3">
          {chartSections.slice(4, 8).map((section, i) => (
            <TrendChart key={i} section={section} />
          ))}
        </div>
      </div>
    </div>
  )
}
