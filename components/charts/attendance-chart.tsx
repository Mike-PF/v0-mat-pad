"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const attendanceData = [
  { month: "Sep", overall: 96.2, persistent: 8.1 },
  { month: "Oct", overall: 95.8, persistent: 8.5 },
  { month: "Nov", overall: 94.9, persistent: 9.2 },
  { month: "Dec", overall: 95.1, persistent: 9.0 },
  { month: "Jan", overall: 93.8, persistent: 10.1 },
  { month: "Feb", overall: 94.5, persistent: 9.8 },
  { month: "Mar", overall: 95.2, persistent: 9.3 },
  { month: "Apr", overall: 95.9, persistent: 8.7 },
  { month: "May", overall: 96.1, persistent: 8.4 },
  { month: "Jun", overall: 95.7, persistent: 8.9 },
]

export function AttendanceChart() {
  const maxOverall = Math.max(...attendanceData.map((d) => d.overall))
  const minOverall = Math.min(...attendanceData.map((d) => d.overall))
  const maxPersistent = Math.max(...attendanceData.map((d) => d.persistent))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trends</CardTitle>
        <CardDescription>Monthly attendance rates and persistent absence data</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Line Chart Visualization */}
        <div className="space-y-6">
          {/* Overall Attendance Line Chart */}
          <div>
            <h4 className="text-sm font-medium text-blue-600 mb-3">Overall Attendance %</h4>
            <div className="relative h-24 bg-slate-50 rounded-lg p-4">
              <div className="flex items-end justify-between h-full">
                {attendanceData.map((data, index) => {
                  const height = ((data.overall - minOverall) / (maxOverall - minOverall)) * 100
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="relative flex-1 flex items-end">
                        <div
                          className="w-2 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                          style={{ height: `${Math.max(height, 10)}%` }}
                          title={`${data.month}: ${data.overall}%`}
                        />
                      </div>
                      <div className="text-xs text-slate-600 mt-2">{data.month}</div>
                      <div className="text-xs font-medium text-blue-600">{data.overall}%</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Persistent Absence Line Chart */}
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-3">Persistent Absence %</h4>
            <div className="relative h-24 bg-slate-50 rounded-lg p-4">
              <div className="flex items-end justify-between h-full">
                {attendanceData.map((data, index) => {
                  const height = (data.persistent / maxPersistent) * 100
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="relative flex-1 flex items-end">
                        <div
                          className="w-2 bg-red-500 rounded-t transition-all duration-300 hover:bg-red-600"
                          style={{ height: `${Math.max(height, 10)}%` }}
                          title={`${data.month}: ${data.persistent}%`}
                        />
                      </div>
                      <div className="text-xs text-slate-600 mt-2">{data.month}</div>
                      <div className="text-xs font-medium text-red-600">{data.persistent}%</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(attendanceData.reduce((sum, d) => sum + d.overall, 0) / attendanceData.length).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-800">Average Attendance</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {(attendanceData.reduce((sum, d) => sum + d.persistent, 0) / attendanceData.length).toFixed(1)}%
              </div>
              <div className="text-sm text-red-800">Average Persistent Absence</div>
            </div>
          </div>

          {/* Data Table */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Detailed Data</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-2 font-medium">Month</th>
                    <th className="text-center p-2 font-medium text-blue-600">Overall %</th>
                    <th className="text-center p-2 font-medium text-red-600">Persistent Absence %</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((row, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-2 font-medium">{row.month}</td>
                      <td className="p-2 text-center text-blue-600">{row.overall}%</td>
                      <td className="p-2 text-center text-red-600">{row.persistent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
