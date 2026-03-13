"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

// ── FilterSelect Component ────────────────────────────────────────────────────
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

// ── School Data ──────────────────────────────────────────────────────────────
const schoolData = [
  { school: "Barnsley",                  gld: 67.9,  eg01: 81.1, eg02: 81.8, eg03: 83.5, eg04: 84.7, eg05: 86.5, eg06: 90.6, eg07: 83.0, eg08: 77.2, eg09: 74.6, eg10: 70.0, eg11: 76.8, eg12: 76.3, eg13: 78.4, eg14: 77.8, eg15: 82.0, eg16: 82.0, eg17: 82.2 },
  { school: "Bradford",                  gld: 61.9,  eg01: 78.1, eg02: 78.8, eg03: 82.3, eg04: 84.4, eg05: 85.2, eg06: 90.4, eg07: 81.8, eg08: 74.4, eg09: 69.3, eg10: 64.0, eg11: 71.7, eg12: 71.2, eg13: 75.1, eg14: 75.4, eg15: 78.0, eg16: 81.6, eg17: 80.8 },
  { school: "Calderdale",                gld: 65.3,  eg01: 78.6, eg02: 80.5, eg03: 80.7, eg04: 82.6, eg05: 84.8, eg06: 88.6, eg07: 82.9, eg08: 76.0, eg09: 72.9, eg10: 68.0, eg11: 75.7, eg12: 74.6, eg13: 78.7, eg14: 79.0, eg15: 82.0, eg16: 83.4, eg17: 83.1 },
  { school: "Doncaster",                 gld: 67.5,  eg01: 80.4, eg02: 81.8, eg03: 82.8, eg04: 84.9, eg05: 85.1, eg06: 89.6, eg07: 83.2, eg08: 76.9, eg09: 74.0, eg10: 69.5, eg11: 76.1, eg12: 75.9, eg13: 78.5, eg14: 78.2, eg15: 81.1, eg16: 82.3, eg17: 82.7 },
  { school: "East Riding of Yorkshire",  gld: 68.5,  eg01: 84.6, eg02: 86.2, eg03: 86.0, eg04: 89.3, eg05: 91.0, eg06: 95.1, eg07: 88.0, eg08: 84.3, eg09: 78.4, eg10: 72.7, eg11: 82.1, eg12: 81.6, eg13: 85.5, eg14: 84.3, eg15: 90.0, eg16: 91.0, eg17: 91.1 },
  { school: "Kingston upon Hull, City of", gld: 65.3, eg01: 79.0, eg02: 78.5, eg03: 81.8, eg04: 84.6, eg05: 85.0, eg06: 89.3, eg07: 81.4, eg08: 76.0, eg09: 71.9, eg10: 68.1, eg11: 76.0, eg12: 75.1, eg13: 75.6, eg14: 75.7, eg15: 79.6, eg16: 82.8, eg17: 81.5 },
  { school: "Kirklees",                  gld: 66.4,  eg01: 79.9, eg02: 81.4, eg03: 85.4, eg04: 87.3, eg05: 89.0, eg06: 91.3, eg07: 84.8, eg08: 78.1, eg09: 74.0, eg10: 70.2, eg11: 77.1, eg12: 76.6, eg13: 80.0, eg14: 80.3, eg15: 83.9, eg16: 86.0, eg17: 85.2 },
  { school: "Leeds",                     gld: 63.9,  eg01: 79.5, eg02: 80.5, eg03: 82.4, eg04: 84.5, eg05: 86.3, eg06: 91.0, eg07: 83.4, eg08: 77.9, eg09: 73.1, eg10: 67.4, eg11: 76.3, eg12: 75.7, eg13: 79.2, eg14: 79.3, eg15: 82.6, eg16: 85.2, eg17: 85.7 },
  { school: "North East Lincolnshire",   gld: 66.7,  eg01: 80.6, eg02: 82.5, eg03: 86.4, eg04: 89.1, eg05: 89.9, eg06: 92.4, eg07: 83.9, eg08: 80.1, eg09: 76.0, eg10: 68.8, eg11: 77.3, eg12: 77.9, eg13: 82.9, eg14: 82.8, eg15: 85.4, eg16: 89.4, eg17: 88.8 },
  { school: "North Lincolnshire",        gld: 66.7,  eg01: 81.4, eg02: 82.0, eg03: 85.0, eg04: 86.9, eg05: 88.1, eg06: 91.4, eg07: 84.0, eg08: 80.3, eg09: 73.8, eg10: 69.4, eg11: 78.2, eg12: 76.0, eg13: 80.9, eg14: 80.4, eg15: 83.2, eg16: 86.1, eg17: 85.2 },
  { school: "North Yorkshire",           gld: 70.6,  eg01: 84.6, eg02: 86.2, eg03: 86.9, eg04: 89.1, eg05: 90.1, eg06: 93.3, eg07: 87.6, eg08: 84.5, eg09: 79.3, eg10: 74.3, eg11: 82.6, eg12: 82.2, eg13: 86.8, eg14: 86.2, eg15: 89.6, eg16: 91.0, eg17: 90.8 },
  { school: "Rotherham",                 gld: 64.9,  eg01: 79.8, eg02: 81.0, eg03: 80.8, eg04: 83.6, eg05: 84.4, eg06: 89.4, eg07: 83.0, eg08: 77.1, eg09: 72.0, eg10: 67.8, eg11: 75.4, eg12: 75.7, eg13: 78.8, eg14: 78.4, eg15: 82.9, eg16: 84.3, eg17: 83.9 },
  { school: "Sheffield",                 gld: 65.5,  eg01: 80.3, eg02: 80.6, eg03: 84.7, eg04: 87.3, eg05: 88.3, eg06: 92.5, eg07: 85.1, eg08: 78.4, eg09: 73.3, eg10: 69.0, eg11: 76.0, eg12: 75.7, eg13: 80.0, eg14: 80.1, eg15: 83.0, eg16: 85.7, eg17: 85.2 },
  { school: "Wakefield",                 gld: 69.6,  eg01: 81.8, eg02: 82.2, eg03: 84.6, eg04: 86.0, eg05: 87.0, eg06: 90.7, eg07: 84.0, eg08: 80.5, eg09: 77.8, eg10: 72.3, eg11: 79.8, eg12: 79.6, eg13: 79.5, eg14: 79.1, eg15: 82.9, eg16: 85.0, eg17: 84.1 },
  { school: "York",                      gld: 71.4,  eg01: 82.7, eg02: 86.0, eg03: 84.7, eg04: 86.9, eg05: 88.9, eg06: 92.6, eg07: 86.5, eg08: 83.0, eg09: 78.2, eg10: 75.0, eg11: 81.0, eg12: 81.3, eg13: 83.8, eg14: 83.4, eg15: 86.3, eg16: 87.9, eg17: 88.4 },
  { school: "All schools",               gld: 66.2,  eg01: 80.6, eg02: 81.7, eg03: 83.8, eg04: 86.0, eg05: 87.2, eg06: 91.2, eg07: 84.1, eg08: 78.7, eg09: 74.2, eg10: 69.3, eg11: 77.1, eg12: 76.7, eg13: 79.9, eg14: 79.8, eg15: 83.2, eg16: 85.4, eg17: 85.1, isBold: true },
]

function getCellColor(value: number) {
  if (value >= 82) return "bg-green-600 text-white"
  if (value >= 79) return "bg-green-300 text-slate-900"
  if (value >= 76) return "bg-yellow-200 text-slate-900"
  if (value >= 74) return "bg-orange-300 text-slate-900"
  return "bg-red-300 text-slate-900"
}

export function EyfsGoalsBySchoolReport() {
  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header */}
      <div className="bg-[#2395A4] px-6 py-4">
        <div className="flex items-start justify-between gap-6">
          <h1 className="text-lg font-bold text-white whitespace-nowrap mt-1">
            EYFS - Early Years Goals by school (2025)
          </h1>
          <div className="flex items-start gap-4 flex-wrap justify-end">
            <FilterSelect label="Year" value="2025" />
            <FilterSelect label="Pupil group" value="All pupils" />
            <FilterSelect label="Sex" value="All pupils" />
          </div>
        </div>
      </div>

      {/* Context panel */}
      <div className="bg-[#2395A4] px-6 py-2 text-white text-xs">
        <p className="font-semibold">ELG by school</p>
        <p className="text-white/80">Year- 2025 | Pupil group- All pupils | Sex- All pupils</p>
      </div>

      {/* Main content */}
      <div className="p-4">
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="px-3 py-2 text-left font-semibold text-slate-700 w-32">ELG<br />School</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">% GLD</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG01<br />% List, att.</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG02<br />% Speak</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG03<br />% Self-reg</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG04<br />% Manag Self</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG05<br />% Build rel</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG06<br />% Gross mot</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG07<br />% Fine mot</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG08<br />% Comp</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG09<br />% Read</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG10<br />% Writ</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG11<br />% Number</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG12<br />% Num pat</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG13<br />% Past & pres</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG14<br />% Peop, cult</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG15<br />% Nat world</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG16<br />% Create mat</th>
                <th className="px-2 py-2 text-center font-semibold text-slate-700 whitespace-nowrap">ELG17<br />% Imag & exp</th>
              </tr>
            </thead>
            <tbody>
              {schoolData.map((row) => (
                <tr key={row.school} className={row.isBold ? "bg-slate-50 border-b border-slate-200 font-bold" : "border-b border-slate-200 hover:bg-slate-50"}>
                  <td className="px-3 py-2 text-slate-700">{row.school}</td>
                  <td className={`px-2 py-2 text-center font-semibold ${getCellColor(row.gld)}`}>{row.gld.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg01)}`}>{row.eg01.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg02)}`}>{row.eg02.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg03)}`}>{row.eg03.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg04)}`}>{row.eg04.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg05)}`}>{row.eg05.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg06)}`}>{row.eg06.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg07)}`}>{row.eg07.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg08)}`}>{row.eg08.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg09)}`}>{row.eg09.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg10)}`}>{row.eg10.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg11)}`}>{row.eg11.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg12)}`}>{row.eg12.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg13)}`}>{row.eg13.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg14)}`}>{row.eg14.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg15)}`}>{row.eg15.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg16)}`}>{row.eg16.toFixed(1)}%</td>
                  <td className={`px-2 py-2 text-center ${getCellColor(row.eg17)}`}>{row.eg17.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Color key */}
        <div className="mt-6 grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">This report also needs a colour key:</h3>
            <div className="space-y-1 text-xs text-slate-700">
              <p><span className="font-semibold">Red:</span> {'>'}= 5%p below national average</p>
              <p><span className="font-semibold">Orange:</span> {'>'}= 1%p and {'<'}5%p below national average</p>
              <p><span className="font-semibold">Yellow:</span> {'<'}1% below national average</p>
              <p><span className="font-semibold">Light green:</span> {'<'}2%p above national average</p>
              <p><span className="font-semibold">Dark green:</span> {'>'}= 2%p above national average</p>
            </div>
          </div>
          <div className="border-l border-slate-300 pl-6">
            <h3 className="font-semibold text-slate-900 mb-2">Key</h3>
            <div className="space-y-1 text-xs text-slate-700">
              <p><span className="font-semibold">% achieving a good level of development</span><br />% achieving a good level of development</p>
              <p><span className="font-semibold">% at exp. level in communication, language & literacy</span><br />% at exp. level in communication, language & literacy</p>
              <p><span className="font-semibold">% at exp. level in all ELGs</span><br />Av. No. of ELGs at exp. level</p>
              <p><span className="font-semibold">All prime area ELGs</span><br />All prime area ELGs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
