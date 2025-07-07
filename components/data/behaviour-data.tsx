"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const behaviourIncidents = [
  { type: "Disruption", count: 12, resolved: 11 },
  { type: "Defiance", count: 8, resolved: 7 },
  { type: "Physical", count: 3, resolved: 3 },
  { type: "Verbal", count: 15, resolved: 13 },
  { type: "Bullying", count: 2, resolved: 2 },
]

export function BehaviourData() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Behaviour Incidents (This Term)</CardTitle>
          <CardDescription>Breakdown by incident type and resolution status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Total Incidents",
                color: "hsl(var(--chart-1))",
              },
              resolved: {
                label: "Resolved",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviourIncidents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" name="Total Incidents" />
                <Bar dataKey="resolved" fill="var(--color-resolved)" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
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
