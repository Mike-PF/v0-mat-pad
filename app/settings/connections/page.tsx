"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"

const mockConnections = [
  { id: 1, name: "Student Information System", type: "API", status: "Connected", lastSync: "2 hours ago" },
  { id: 2, name: "HR Database", type: "Database", status: "Connected", lastSync: "1 day ago" },
  { id: 3, name: "Email Service", type: "SMTP", status: "Error", lastSync: "Failed" },
  { id: 4, name: "Document Storage", type: "Cloud", status: "Pending", lastSync: "Never" },
]

export default function ConnectionsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Connections</CardTitle>
                  <CardDescription>Manage external system integrations and APIs</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Connection
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {mockConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(connection.status)}
                      <div>
                        <h3 className="font-medium text-slate-900">{connection.name}</h3>
                        <p className="text-sm text-slate-500">
                          {connection.type} · Last sync: {connection.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          connection.status === "Connected"
                            ? "bg-green-100 text-green-800"
                            : connection.status === "Error"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {connection.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
