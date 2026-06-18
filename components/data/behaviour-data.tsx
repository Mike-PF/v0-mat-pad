"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const behaviourIncidents = [
  { type: "Disruption", count: 12, resolved: 11 },
  { type: "Defiance", count: 8, resolved: 7 },
  { type: "Physical", count: 3, resolved: 3 },
  { type: "Verbal", count: 15, resolved: 13 },
  { type: "Bullying", count: 2, resolved: 2 },
]

export function BehaviourData() {
  const maxCount = Math.max(...behaviourIncidents.map((item) => item.count))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Behaviour Incidents (This Term)</CardTitle>
          <CardDescription>Breakdown by incident type and resolution status</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Bar Chart Visualization */}
          <div className="space-y-4">
            {behaviourIncidents.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{item.type}</span>
                  <span className="text-xs text-slate-600">
                    {item.count} total • {item.resolved} resolved • {((item.resolved / item.count) * 100).toFixed(0)}%
                    rate
                  </span>
                </div>

                {/* Horizontal Bar Chart */}
                <div className="relative">
                  <div className="flex gap-1 h-8">
                    {/* Total Count Bar */}
                    <div
                      className="bg-blue-500 rounded-l flex items-center justify-center text-white text-xs font-medium transition-all duration-300 hover:bg-blue-600"
                      style={{ width: `${(item.count / maxCount) * 70}%`, minWidth: "40px" }}
                      title={`Total incidents: ${item.count}`}
                    >
                      {item.count}
                    </div>

                    {/* Resolved Bar */}
                    <div
                      className="bg-green-500 rounded-r flex items-center justify-center text-white text-xs font-medium transition-all duration-300 hover:bg-green-600"
                      style={{ width: `${(item.resolved / maxCount) * 70}%`, minWidth: "40px" }}
                      title={`Resolved: ${item.resolved}`}
                    >
                      {item.resolved}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="flex gap-6 text-xs text-slate-600 mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Total Incidents</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Resolved</span>
              </div>
            </div>
          </div>

          {/* Summary Table */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Incident Summary</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-2 font-medium">Type</th>
                    <th className="text-center p-2 font-medium">Total</th>
                    <th className="text-center p-2 font-medium">Resolved</th>
                    <th className="text-center p-2 font-medium">Resolution Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {behaviourIncidents.map((row, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-2 font-medium">{row.type}</td>
                      <td className="p-2 text-center text-blue-600 font-medium">{row.count}</td>
                      <td className="p-2 text-center text-green-600 font-medium">{row.resolved}</td>
                      <td className="p-2 text-center">
                        <span
                          className={`font-medium ${row.resolved === row.count ? "text-green-600" : "text-orange-600"}`}
                        >
                          {((row.resolved / row.count) * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">92%</div>
            <div className="text-sm text-slate-600">Incidents Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">2.1</div>
            <div className="text-sm text-slate-600">Days Avg Resolution</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">5</div>
            <div className="text-sm text-slate-600">Repeat Offenders</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
