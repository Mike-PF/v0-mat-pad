"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Database, Cloud, Server, RefreshCw, Settings, CheckCircle2, XCircle } from "lucide-react"

const connections = [
  {
    id: 1,
    name: "Primary Database",
    type: "PostgreSQL",
    icon: Database,
    status: "connected",
    lastSync: "2 minutes ago",
    enabled: true,
  },
  {
    id: 2,
    name: "Cloud Storage",
    type: "AWS S3",
    icon: Cloud,
    status: "connected",
    lastSync: "5 minutes ago",
    enabled: true,
  },
  {
    id: 3,
    name: "Backup Server",
    type: "FTP Server",
    icon: Server,
    status: "disconnected",
    lastSync: "1 hour ago",
    enabled: false,
  },
  {
    id: 4,
    name: "API Gateway",
    type: "REST API",
    icon: Cloud,
    status: "connected",
    lastSync: "1 minute ago",
    enabled: true,
  },
]

export default function ConnectionsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">System Connections</h1>
                <p className="text-slate-500 mt-1">Manage external system integrations and data connections</p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Settings className="w-4 h-4 mr-2" />
                Add Connection
              </Button>
            </div>

            <div className="grid gap-4">
              {connections.map((connection) => (
                <Card key={connection.id} className="border border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <connection.icon className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{connection.name}</h3>
                          <p className="text-sm text-slate-500">{connection.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {connection.status === "connected" ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                <XCircle className="w-3 h-3 mr-1" />
                                Disconnected
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Last sync: {connection.lastSync}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Switch checked={connection.enabled} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
