"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Users, Check, X } from "lucide-react"

const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all features and settings",
    users: 2,
    permissions: { forms: true, reports: true, settings: true, users: true },
  },
  {
    id: 2,
    name: "Teacher",
    description: "Can create and edit forms, view reports",
    users: 15,
    permissions: { forms: true, reports: true, settings: false, users: false },
  },
  {
    id: 3,
    name: "Viewer",
    description: "Read-only access to forms and reports",
    users: 8,
    permissions: { forms: false, reports: true, settings: false, users: false },
  },
]

export default function RolesPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

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
                  <CardTitle>Roles</CardTitle>
                  <CardDescription>Manage user roles and permissions</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Role</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Description</th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Users</th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Forms</th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Reports</th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Settings</th>
                      <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Users Mgmt</th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRoles.map((role) => (
                      <tr key={role.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-900">{role.name}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-sm">{role.description}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-600">
                            <Users className="h-4 w-4" />
                            <span>{role.users}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {role.permissions.forms ? (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-slate-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {role.permissions.reports ? (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-slate-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {role.permissions.settings ? (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-slate-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {role.permissions.users ? (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-slate-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
