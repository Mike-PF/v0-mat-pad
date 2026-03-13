"use client"

import { ChevronDown } from "lucide-react"

export function AttendanceHeadlinesReport() {
  return (
    <div className="w-full h-full bg-white overflow-auto">
      {/* Teal Header Bar */}
      <div className="bg-teal-600 text-white px-6 py-3 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Attendance headlines - 01/09/2024 to 31/08/2025</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs opacity-75">phase_school6</label>
              <div className="flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded">
                <span className="text-sm">Primary</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs opacity-75">year/not_form_HT</label>
              <input type="text" value="2025" className="bg-white text-slate-900 px-3 py-1.5 rounded w-20 text-sm" readOnly />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs opacity-75">From</label>
              <input type="date" value="2024-03-14" className="bg-white text-slate-900 px-3 py-1.5 rounded text-sm" readOnly />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs opacity-75">To</label>
              <input type="date" value="2026-01-08" className="bg-white text-slate-900 px-3 py-1.5 rounded text-sm" readOnly />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Applied Text */}
      <div className="px-6 py-2 bg-slate-50 border-b border-slate-200">
        <p className="text-xs text-slate-600">
          Filters applied: SEN status - All | FSM6 - 1 | Attendance band - 95+%
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {/* Total Pupils Card */}
          <div className="bg-teal-600 text-white rounded-lg p-4">
            <p className="text-xs opacity-90 font-medium">Total pupils</p>
            <p className="text-4xl font-bold mt-2">31</p>
          </div>

          {/* Attendance */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium">Attendance</p>
            <p className="text-2xl font-bold text-teal-600 mt-1">
              <span className="text-xs">MAT</span> 97.3%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Nat. 94.8% <span className="text-green-600">▼ 2.5</span>
            </p>
          </div>

          {/* Absence */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium">Absence</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">
              <span className="text-xs">MAT</span> 2.7%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Nat. 5.2% <span className="text-green-600">▼ 2.5</span>
            </p>
          </div>

          {/* Auth. absence */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium">Auth. absence</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              <span className="text-xs">MAT</span> 2.0%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Nat. 3.7% <span className="text-green-600">▼ 2.5</span>
            </p>
          </div>

          {/* Unauth. absence */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium">Unauth. absence</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              <span className="text-xs">MAT</span> 0.8%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Nat. 1.5% <span className="text-green-600">▼ 0.8</span>
            </p>
          </div>

          {/* Persistent absence */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium">Persistent absence</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              <span className="text-xs">MAT</span> 0.0%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Nat. 15.6% <span className="text-green-600">▼ 15.6</span>
            </p>
          </div>

          {/* Severe absence */}
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium">Severe absence</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              <span className="text-xs">MAT</span> 0.0%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Nat. 0.3% <span className="text-green-600">▼ 0.3</span>
            </p>
          </div>
        </div>

        {/* Charts Section Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Attendance Trends Chart */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Attendance trends</h3>
              <div className="h-48 bg-slate-50 rounded flex items-center justify-center text-slate-400">
                <p className="text-xs">Line chart placeholder</p>
              </div>
              <div className="mt-3 flex gap-4 text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-blue-600"></span> MAT (selected pupils)
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-slate-400"></span> National (all pupils)
                </span>
              </div>
            </div>

            {/* % Absence by School */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">% absence by school</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-20">School B</span>
                  <div className="flex-1 bg-red-300 rounded h-5"></div>
                  <span>2.6% (26)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20">School A</span>
                  <div className="flex-1 bg-red-200 rounded h-5" style={{ width: "75%" }}></div>
                  <span>3.5% (5)</span>
                </div>
              </div>
            </div>

            {/* % Absence by SEN Status */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">% absence by SEN status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-12">E</span>
                  <div className="flex-1 bg-red-300 rounded h-5"></div>
                  <span>3.7% (2)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12">K</span>
                  <div className="flex-1 bg-red-200 rounded h-5" style={{ width: "85%" }}></div>
                  <span>3.0% (11)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12">NULL</span>
                  <div className="flex-1 bg-red-200 rounded h-5" style={{ width: "70%" }}></div>
                  <span>2.4% (15)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12">N</span>
                  <div className="flex-1 bg-red-200 rounded h-5" style={{ width: "65%" }}></div>
                  <span>2.7% (3)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* % Pupils by Attendance Band */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">% pupils by attendance band</h3>
              <div className="flex items-center justify-center h-48">
                <div className="w-40 h-40 rounded-full border-8 border-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">31</p>
                    <p className="text-xs text-slate-500">(38.27%)</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> 95+%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span> 90-95%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span> 80-90%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> 50-80%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-800"></span> &lt;50%
                </span>
              </div>
            </div>

            {/* % Absence by Gender */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">% absence by gender</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-12">0</span>
                  <div className="flex-1 bg-green-400 rounded h-5"></div>
                  <span>2.8% (30)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12">1</span>
                  <div className="flex-1 bg-green-400 rounded h-5" style={{ width: "20%" }}></div>
                  <span>0.8% (1)</span>
                </div>
              </div>
            </div>

            {/* % Absence by Pupil Premium */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">% absence by pupil premium</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-12">0</span>
                  <div className="flex-1 bg-red-400 rounded h-5"></div>
                  <span>4.0% (4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12">1</span>
                  <div className="flex-1 bg-red-300 rounded h-5" style={{ width: "85%" }}></div>
                  <span>2.5% (27)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row Charts */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* No. of Persistently Absent Pupils */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">No. of persistently absent pupils</h3>
            <div className="h-32 bg-slate-50 rounded flex items-center justify-center text-slate-400">
              <p className="text-xs">PA</p>
            </div>
            <p className="text-center mt-2 font-bold text-lg">31</p>
          </div>

          {/* % Attendance by NCY */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">% attendance by NCY</h3>
            <div className="h-32 bg-slate-50 rounded flex items-center justify-center">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-4 bg-gradient-to-t from-red-500 to-green-500 rounded" style={{ height: `${20 + i * 5}px` }}></div>
                    <span className="text-xs">{i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* No. of Severely Absent Pupils */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">No. of severely absent pupils</h3>
            <div className="h-32 bg-slate-50 rounded flex items-center justify-center text-slate-400">
              <p className="text-xs">SA</p>
            </div>
            <p className="text-center mt-2 font-bold text-lg">31</p>
          </div>
        </div>
      </div>
    </div>
  )
}
