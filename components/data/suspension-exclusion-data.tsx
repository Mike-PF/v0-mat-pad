"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

const suspensionData = [
  {
    behavior: "Challenging/unacceptable behaviour,Damage,Truancy/absconding from lessons",
    sessions: 15,
    avgDays: 25.0,
    events: 1,
    students: 1,
    avgSessions: 14.0,
    avgSessionDays: 10.0,
  },
  {
    behavior:
      "Challenging/unacceptable behaviour,Disobedience/disrespect to staff,Verbal abuse/threatening behaviour against an adult or staff",
    sessions: 12,
    avgDays: 7.2,
    events: 2,
    students: 2,
    avgSessions: 3.0,
    avgSessionDays: 3.0,
  },
  {
    behavior: "Challenging/unacceptable behaviour,Drug related,Refusal of punishment",
    sessions: 10,
    avgDays: 5.0,
    events: 1,
    students: 1,
    avgSessions: 10.0,
    avgSessionDays: 5.0,
  },
  {
    behavior: "Challenging/unacceptable behaviour,Persistent disruptive behaviour",
    sessions: 4,
    avgDays: 2.0,
    events: 1,
    students: 1,
    avgSessions: 4.0,
    avgSessionDays: 2.0,
  },
  {
    behavior: "Challenging/unacceptable behaviour,Persistent disruptive behaviour,Truancy/absconding from lessons",
    sessions: 8,
    avgDays: 4.0,
    events: 2,
    students: 2,
    avgSessions: 4.0,
    avgSessionDays: 2.0,
  },
  {
    behavior:
      "Challenging/unacceptable behaviour,Persistent disruptive behaviour,Verbal abuse/threatening behaviour against an adult or staff,Truancy/absconding from lessons",
    sessions: 5,
    avgDays: 2.5,
    events: 1,
    students: 1,
    avgSessions: 5.0,
    avgSessionDays: 2.5,
  },
  {
    behavior: "Challenging/unacceptable behaviour,Physical assault/violent behaviour against a pupil",
    sessions: 106,
    avgDays: 53.0,
    events: 16,
    students: 16,
    avgSessions: 6.6,
    avgSessionDays: 3.3,
  },
  {
    behavior:
      "Challenging/unacceptable behaviour,Physical assault/violent behaviour against a pupil,Truancy/absconding from lessons",
    sessions: 11,
    avgDays: 5.5,
    events: 2,
    students: 2,
    avgSessions: 5.5,
    avgSessionDays: 2.8,
  },
  {
    behavior:
      "Challenging/unacceptable behaviour,Physical assault/violent behaviour against a pupil,Verbal abuse/threatening behaviour against a pupil",
    sessions: 20,
    avgDays: 10.0,
    events: 2,
    students: 2,
    avgSessions: 10.0,
    avgSessionDays: 5.0,
  },
  {
    behavior: "Challenging/unacceptable behaviour,Physical assault/violent behaviour against an adult or staff",
    sessions: 8,
    avgDays: 4.0,
    events: 1,
    students: 1,
    avgSessions: 8.0,
    avgSessionDays: 4.0,
  },
  {
    behavior:
      "Challenging/unacceptable behaviour,Physical assault/violent behaviour against a pupil,Verbal abuse/threatening behaviour against an adult or staff",
    sessions: 8,
    avgDays: 4.0,
    events: 1,
    students: 1,
    avgSessions: 8.0,
    avgSessionDays: 4.0,
  },
  {
    behavior:
      "Challenging/unacceptable behaviour,Physical assault/violent behaviour against a pupil,Verbal abuse/threatening behaviour against an adult or staff,Truancy/absconding from lessons",
    sessions: 10,
    avgDays: 5.0,
    events: 1,
    students: 1,
    avgSessions: 10.0,
    avgSessionDays: 5.0,
  },
  {
    behavior: "Challenging/unacceptable behaviour,Physical assault/violent behaviour against an adult or staff",
    sessions: 16,
    avgDays: 8.0,
    events: 2,
    students: 2,
    avgSessions: 8.0,
    avgSessionDays: 4.0,
  },
  {
    behavior:
      "Challenging/unacceptable behaviour,Physical assault/violent behaviour against an adult or staff,Truancy/absconding from lessons",
    sessions: 14,
    avgDays: 7.0,
    events: 1,
    students: 1,
    avgSessions: 14.0,
    avgSessionDays: 7.0,
  },
  {
    behavior:
      "Challenging/unacceptable behaviour,Physical assault/violent behaviour against an adult or staff,Verbal abuse/threatening behaviour against an adult or staff",
    sessions: 45,
    avgDays: 22.5,
    events: 4,
    students: 4,
    avgSessions: 11.2,
    avgSessionDays: 5.6,
  },
  {
    behavior:
      "Challenging/unacceptable behaviour,Physical assault/violent behaviour against an adult or staff,Verbal abuse/threatening behaviour against an adult or staff,Truancy/absconding from lessons",
    sessions: 6,
    avgDays: 3.0,
    events: 1,
    students: 1,
    avgSessions: 6.0,
    avgSessionDays: 3.0,
  },
]

export function SuspensionExclusionData() {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalSessions = suspensionData.reduce((sum, item) => sum + item.sessions, 0)
  const totalEvents = suspensionData.reduce((sum, item) => sum + item.events, 0)
  const uniqueStudents = suspensionData.reduce((sum, item) => sum + item.students, 0)

  const formatBehaviorType = (behavior: string) => {
    return behavior
      .split(",")
      .map((item) => item.replace("Challenging/unacceptable behaviour,", "").trim())
      .filter((item) => item.length > 0)
      .join(", ")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Suspension and Exclusion Data</CardTitle>
            <CardDescription>Detailed breakdown of behavioral incidents and disciplinary actions</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Details
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{totalSessions}</div>
              <div className="text-sm text-slate-600">Total Sessions Lost</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{totalEvents}</div>
              <div className="text-sm text-slate-600">Total Incidents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{uniqueStudents}</div>
              <div className="text-sm text-slate-600">Students Involved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{(totalSessions / totalEvents).toFixed(1)}</div>
              <div className="text-sm text-slate-600">Avg Sessions per Incident</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Data Table - Collapsible with Fixed Height and Scroll */}
        {isExpanded && (
          <div className="border border-slate-200 rounded-lg">
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <h4 className="font-medium text-sm">Detailed Incident Breakdown</h4>
            </div>
            <div className="h-96 overflow-y-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-white border-b border-slate-200">
                  <tr>
                    <th className="text-left p-3 font-medium bg-slate-50">Behavior Type</th>
                    <th className="text-center p-3 font-medium bg-slate-50">Sessions</th>
                    <th className="text-center p-3 font-medium bg-slate-50">Avg Days</th>
                    <th className="text-center p-3 font-medium bg-slate-50">Events</th>
                    <th className="text-center p-3 font-medium bg-slate-50">Students</th>
                    <th className="text-center p-3 font-medium bg-slate-50">Avg Sessions</th>
                    <th className="text-center p-3 font-medium bg-slate-50">Avg Session Days</th>
                  </tr>
                </thead>
                <tbody>
                  {suspensionData.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">
                      <td className="p-3">
                        <div className="max-w-xs">
                          <div className="text-xs text-slate-600 mb-1">Incident Type:</div>
                          <div className="font-medium">{formatBehaviorType(row.behavior)}</div>
                        </div>
                      </td>
                      <td className="p-3 text-center font-medium">{row.sessions}</td>
                      <td className="p-3 text-center">{row.avgDays.toFixed(1)}</td>
                      <td className="p-3 text-center">{row.events}</td>
                      <td className="p-3 text-center">{row.students}</td>
                      <td className="p-3 text-center">{row.avgSessions.toFixed(1)}</td>
                      <td className="p-3 text-center">{row.avgSessionDays.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2 text-blue-900">Key Insights from the Data:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Physical assault incidents account for the highest number of sessions lost (106 sessions)</li>
            <li>• Most incidents involve multiple behavioral categories (e.g., physical assault + verbal abuse)</li>
            <li>• Average suspension length varies significantly by incident type (2-25 days)</li>
            <li>• {uniqueStudents} individual students were involved in disciplinary actions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
