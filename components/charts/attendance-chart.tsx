"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trends</CardTitle>
        <CardDescription>Monthly attendance rates and persistent absence data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            overall: {
              label: "Overall Attendance %",
              color: "hsl(var(--chart-1))",
            },
            persistent: {
              label: "Persistent Absence %",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="var(--color-overall)"
                strokeWidth={2}
                name="Overall Attendance %"
              />
              <Line
                type="monotone"
                dataKey="persistent"
                stroke="var(--color-persistent)"
                strokeWidth={2}
                name="Persistent Absence %"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
