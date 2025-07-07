"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const assessmentData = [
  {
    subject: "Reading",
    ks1Expected: 78,
    ks1Greater: 25,
    ks2Expected: 82,
    ks2Greater: 28,
    ks2Progress: 1.2,
  },
  {
    subject: "Writing",
    ks1Expected: 72,
    ks1Greater: 18,
    ks2Expected: 79,
    ks2Greater: 22,
    ks2Progress: 0.8,
  },
  {
    subject: "Mathematics",
    ks1Expected: 81,
    ks1Greater: 32,
    ks2Expected: 85,
    ks2Greater: 35,
    ks2Progress: 1.5,
  },
  {
    subject: "Science (KS2)",
    ks1Expected: null,
    ks1Greater: null,
    ks2Expected: 88,
    ks2Greater: 31,
    ks2Progress: null,
  },
]

export function AssessmentTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statutory Assessment Results</CardTitle>
        <CardDescription>Key Stage 1 and 2 performance data (% of pupils)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Subject</th>
                <th className="text-center p-3 font-medium">KS1 Expected+</th>
                <th className="text-center p-3 font-medium">KS1 Greater Depth</th>
                <th className="text-center p-3 font-medium">KS2 Expected+</th>
                <th className="text-center p-3 font-medium">KS2 Greater Depth</th>
                <th className="text-center p-3 font-medium">KS2 Progress</th>
              </tr>
            </thead>
            <tbody>
              {assessmentData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium">{row.subject}</td>
                  <td className="p-3 text-center">{row.ks1Expected ? `${row.ks1Expected}%` : "-"}</td>
                  <td className="p-3 text-center">{row.ks1Greater ? `${row.ks1Greater}%` : "-"}</td>
                  <td className="p-3 text-center">{row.ks2Expected ? `${row.ks2Expected}%` : "-"}</td>
                  <td className="p-3 text-center">{row.ks2Greater ? `${row.ks2Greater}%` : "-"}</td>
                  <td className="p-3 text-center">
                    {row.ks2Progress ? (
                      <span className={row.ks2Progress > 0 ? "text-green-600" : "text-red-600"}>
                        {row.ks2Progress > 0 ? "+" : ""}
                        {row.ks2Progress}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <h4 className="font-medium mb-2">National Averages (for comparison)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>KS1 Reading: 76%</div>
            <div>KS1 Writing: 69%</div>
            <div>KS1 Maths: 76%</div>
            <div>KS2 Combined: 65%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
