"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[140px]">
      <span className="text-[10px] text-white/70 uppercase tracking-wide">{label}</span>
      <button className="flex items-center justify-between gap-2 bg-white text-slate-700 text-xs rounded px-2.5 py-1.5 border border-white/20 transition-colors hover:bg-slate-50">
        <span>{value}</span>
        <ChevronDown className="w-3 h-3 shrink-0 text-slate-400" />
      </button>
    </div>
  )
}

type Row = {
  label: string
  isGroup?: boolean
  gld?: number; eg01?: number; eg02?: number; eg03?: number; eg04?: number
  eg05?: number; eg06?: number; eg07?: number; eg08?: number; eg09?: number
  eg10?: number; eg11?: number; eg12?: number; eg13?: number; eg14?: number
  eg15?: number; eg16?: number; eg17?: number
}

const tableData: Row[] = [
  { label: "All pupils", isGroup: true },
  { label: "All pupils",          gld: 65.5, eg01: 80.3, eg02: 80.6, eg03: 84.7, eg04: 87.3, eg05: 88.3, eg06: 92.5, eg07: 85.1, eg08: 78.4, eg09: 73.3, eg10: 69.0, eg11: 76.0, eg12: 75.7, eg13: 80.0, eg14: 80.1, eg15: 83.0, eg16: 85.7, eg17: 85.2 },

  { label: "FSM eligibility", isGroup: true },
  { label: "Eligible for FSM",    gld: 46.5, eg01: 68.2, eg02: 67.6, eg03: 74.8, eg04: 78.4, eg05: 79.5, eg06: 86.6, eg07: 73.4, eg08: 64.0, eg09: 55.7, eg10: 50.1, eg11: 59.4, eg12: 58.7, eg13: 65.4, eg14: 66.4, eg15: 70.2, eg16: 74.1, eg17: 74.3 },
  { label: "Not eligible for FSM",gld: 73.8, eg01: 85.8, eg02: 86.5, eg03: 88.9, eg04: 91.1, eg05: 91.9, eg06: 95.0, eg07: 90.0, eg08: 84.7, eg09: 81.1, eg10: 77.3, eg11: 83.1, eg12: 83.0, eg13: 86.3, eg14: 86.1, eg15: 88.8, eg16: 90.6, eg17: 90.0 },
  { label: "Unknown",             gld: 27.9, eg01: 49.5, eg02: 49.5, eg03: 69.4, eg04: 75.7, eg05: 77.5, eg06: 82.9, eg07: 70.3, eg08: 52.3, eg09: 36.0, eg10: 32.4, eg11: 47.7, eg12: 47.7, eg13: 54.1, eg14: 54.1, eg15: 55.0, eg16: 69.4, eg17: 64.0 },

  { label: "SEN provision", isGroup: true },
  { label: "All SEN",             gld: 20.6, eg01: 37.1, eg02: 36.1, eg03: 42.1, eg04: 48.9, eg05: 51.8, eg06: 66.1, eg07: 47.3, eg08: 34.6, eg09: 35.8, eg10: 27.8, eg11: 38.0, eg12: 36.6, eg13: 36.6, eg14: 36.7, eg15: 41.9, eg16: 48.4, eg17: 47.9 },
  { label: "EHCP",                gld:  3.3, eg01:  8.7, eg02:  9.3, eg03: 12.0, eg04: 14.7, eg05: 16.7, eg06: 34.0, eg07: 14.7, eg08:  8.7, eg09: 14.7, eg10:  6.7, eg11: 11.3, eg12: 10.7, eg13:  9.3, eg14:  9.3, eg15: 10.0, eg16: 12.7, eg17: 15.3 },
  { label: "No SEN",              gld: 74.1, eg01: 88.5, eg02: 89.1, eg03: 92.5, eg04: 94.4, eg05: 95.0, eg06: 97.4, eg07: 92.1, eg08: 86.6, eg09: 80.7, eg10: 77.0, eg11: 83.3, eg12: 83.2, eg13: 88.2, eg14: 88.3, eg15: 90.9, eg16: 92.6, eg17: 92.3 },
  { label: "SEN support",         gld: 24.2, eg01: 43.0, eg02: 41.7, eg03: 48.4, eg04: 56.1, eg05: 59.1, eg06: 72.7, eg07: 54.1, eg08: 40.1, eg09: 40.2, eg10: 32.3, eg11: 43.5, eg12: 42.0, eg13: 42.3, eg14: 42.4, eg15: 48.5, eg16: 55.9, eg17: 54.7 },
  { label: "Unknown",             gld: 27.8, eg01: 48.5, eg02: 48.5, eg03: 67.0, eg04: 74.2, eg05: 75.3, eg06: 80.4, eg07: 68.0, eg08: 52.6, eg09: 36.1, eg10: 33.0, eg11: 46.4, eg12: 46.4, eg13: 53.6, eg14: 53.6, eg15: 54.6, eg16: 67.0, eg17: 61.9 },

  { label: "First language", isGroup: true },
  { label: "English",             gld: 70.5, eg01: 84.7, eg02: 86.0, eg03: 86.7, eg04: 89.3, eg05: 90.2, eg06: 93.4, eg07: 86.6, eg08: 83.3, eg09: 77.2, eg10: 73.3, eg11: 80.3, eg12: 80.3, eg13: 84.7, eg14: 84.3, eg15: 87.4, eg16: 88.4, eg17: 88.8 },
  { label: "Other than English",  gld: 54.1, eg01: 70.0, eg02: 67.5, eg03: 80.2, eg04: 82.7, eg05: 83.5, eg06: 90.4, eg07: 81.7, eg08: 66.3, eg09: 64.9, eg10: 59.4, eg11: 65.9, eg12: 64.9, eg13: 68.5, eg14: 70.2, eg15: 72.6, eg16: 79.0, eg17: 76.5 },
  { label: "Unknown",             gld: 35.1, eg01: 55.0, eg02: 55.7, eg03: 71.8, eg04: 77.9, eg05: 80.2, eg06: 85.5, eg07: 74.0, eg08: 58.0, eg09: 43.5, eg10: 38.9, eg11: 52.7, eg12: 52.7, eg13: 58.8, eg14: 58.0, eg15: 61.1, eg16: 74.0, eg17: 69.5 },

  { label: "Term of birth", isGroup: true },
  { label: "Autumn",              gld: 73.1, eg01: 83.7, eg02: 83.9, eg03: 86.1, eg04: 88.5, eg05: 88.4, eg06: 93.4, eg07: 88.5, eg08: 82.8, eg09: 79.4, eg10: 76.5, eg11: 81.2, eg12: 80.9, eg13: 83.6, eg14: 84.1, eg15: 86.0, eg16: 87.3, eg17: 87.0 },
  { label: "Spring",              gld: 82.1, eg01: 82.1, eg02: 86.0, eg03: 86.0, eg04: 88.3, eg05: 89.3, eg06: 92.7, eg07: 86.6, eg08: 79.7, eg09: 74.3, eg10: 71.3, eg11: 77.6, eg12: 77.2, eg13: 81.6, eg14: 81.8, eg15: 84.7, eg16: 87.0, eg17: 86.7 },
  { label: "Summer",              gld: 57.7, eg01: 76.3, eg02: 76.9, eg03: 82.7, eg04: 85.7, eg05: 87.5, eg06: 91.5, eg07: 81.3, eg08: 73.9, eg09: 67.7, eg10: 61.3, eg11: 70.6, eg12: 70.4, eg13: 76.0, eg14: 75.7, eg15: 79.6, eg16: 83.5, eg17: 82.9 },
]

function getCellColor(value: number) {
  if (value >= 90) return "bg-green-600 text-white"
  if (value >= 80) return "bg-green-300 text-slate-900"
  if (value >= 70) return "bg-yellow-200 text-slate-900"
  if (value >= 55) return "bg-orange-300 text-slate-900"
  return "bg-red-400 text-white"
}

const cols = ["eg01","eg02","eg03","eg04","eg05","eg06","eg07","eg08","eg09","eg10","eg11","eg12","eg13","eg14","eg15","eg16","eg17"] as const

export function EyfsGoalsByPupilGroupReport() {
  const [year, setYear] = useState("2025")
  const [school, setSchool] = useState("Sheffield")
  const [sex, setSex] = useState("All pupils")

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header */}
      <div className="bg-[#2395A4] px-6 py-4">
        <div className="flex items-start justify-between gap-6">
          <h1 className="text-lg font-bold text-white whitespace-nowrap mt-1">
            EYFS - Early Years Goals by pupil group (2025)
          </h1>
          <div className="flex items-start gap-4 flex-wrap justify-end">
            <FilterSelect label="Year" value={year} />
            <FilterSelect label="School" value={school} />
            <FilterSelect label="Sex" value={sex} />
          </div>
        </div>
      </div>

      {/* Context panel */}
      <div className="bg-[#2d8c9a] px-6 py-2 text-white text-xs">
        <p className="font-semibold">ELG by pupil group</p>
        <p className="text-white/80">Year- 2025 | Schools - {school} | Sex- {sex}</p>
      </div>

      {/* Main content */}
      <div className="p-4">
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="px-3 py-2 text-left font-semibold text-slate-700 sticky left-0 bg-slate-100 z-10 min-w-[160px]">
                  ELG<br />breakdown_topic
                </th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap min-w-[60px]">% GLD</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG01<br />% List,<br />att, {'&'} und</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG02<br />% Speak</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG03<br />% Self-<br />reg</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG04<br />% Manag<br />Self</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG05<br />% Build<br />rel</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG06<br />% Gross<br />mot</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG07<br />% Fine<br />mot</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG08<br />% Comp</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG09<br />% Read</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG10<br />% Writ</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG11<br />%<br />Number</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG12<br />% Num<br />pat</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG13<br />% Past {'&'}<br />pres</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG14<br />% Peop, cult<br />{'&'} comm</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG15<br />% Nat<br />world</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG16<br />% Create<br />w. mat</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG17<br />% Imag {'&'}<br />exp</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => {
                if (row.isGroup) {
                  return (
                    <tr key={`group-${idx}`} className="bg-slate-50 border-b border-slate-200">
                      <td colSpan={19} className="px-3 py-1.5 font-semibold text-slate-700 text-xs">
                        <span className="mr-1 text-slate-400">-</span>{row.label}
                      </td>
                    </tr>
                  )
                }
                return (
                  <tr key={`${row.label}-${idx}`} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-3 py-1.5 text-slate-700 sticky left-0 bg-white z-10">{row.label}</td>
                    <td className={`px-2 py-1.5 text-center font-semibold ${getCellColor(row.gld!)}`}>{row.gld!.toFixed(1)}%</td>
                    {cols.map(col => {
                      const val = row[col]
                      return val !== undefined
                        ? <td key={col} className={`px-2 py-1.5 text-center ${getCellColor(val)}`}>{val.toFixed(1)}%</td>
                        : <td key={col} className="px-2 py-1.5 text-center text-slate-400">-</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Color key + description */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2 text-sm">This report also needs a colour key:</h3>
            <div className="space-y-1 text-xs text-slate-700">
              <p><span className="font-semibold">Red:</span> {'>'}= 5%p below national average</p>
              <p><span className="font-semibold">Orange:</span> {'>'}= 1%p and {'<'}5%p below national average</p>
              <p><span className="font-semibold">Yellow:</span> {'<'}1% below national average</p>
              <p><span className="font-semibold">Light green:</span> {'<'}2%p above national average</p>
              <p><span className="font-semibold">Dark green:</span> {'>'}= 2%p above national average</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 italic">
            This key can either appear on the report or on hover over the column headings
          </div>
          <div className="border-l border-slate-200 pl-6">
            <div className="flex gap-4 mb-1">
              <span className="font-semibold text-xs text-slate-700 w-1/2">Key</span>
              <span className="font-semibold text-xs text-slate-700 w-1/2">Description</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              {[
                ["% achieving a good level of development", "% achieving a good level of development"],
                ["% at exp. level in communication, language & literacy", "% at exp. level in communication, language & lite..."],
                ["% at exp. level in all ELGs", "% at exp. level in all ELGs"],
                ["Av. No. of ELGs at exp. level", "Av. No. of ELGs at exp. level"],
                ["All prime area ELGs", "All prime area ELGs"],
              ].map(([key, desc]) => (
                <div key={key} className="flex gap-4 border-t border-slate-100 pt-1">
                  <span className="w-1/2">{key}</span>
                  <span className="w-1/2 text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
