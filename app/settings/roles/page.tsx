"use client"

import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Users, Shield, Eye, Edit, Trash2 } from "lucide-react"

const roles = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access with all permissions",
    users: 3,
    permissions: ["Create", "Read", "Update", "Delete", "Manage Users", "Settings"],
    isSystem: true,
  },
  {
    id: "2",
    name: "Teacher",
    description: "Access to teaching resources and student data",
    users: 45,
    permissions: ["Create", "Read", "Update"],
    isSystem: false,
  },
  {
    id: "3",
    name: "Support Staff",
    description: "Limited access to student information",
    users: 12,
    permissions: ["Read"],
    isSystem: false,
  },
  {
    id: "4",
    name: "Parent",
    description: "View only access to their children's data",
    users: 230,
    permissions: ["Read"],
    isSystem: false,
  },
  {
    id: "5",
    name: "Student",
    description: "Limited access to own records",
    users: 580,
    permissions: ["Read"],
    isSystem: false,
  },
]

export default function RolesPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">User Roles</h1>
                <p className="text-sm text-slate-500 mt-1">Manage user roles and permissions</p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Role
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search roles..." className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {roles.map((role) => (
                  <div key={role.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-slate-900">{role.name}</h3>
                            {role.isSystem && (
                              <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                                System
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{role.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <Users className="w-4 h-4" />
                              <span>{role.users} users</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {role.permissions.slice(0, 3).map((perm) => (
                                <span
                                  key={perm}
                                  className="px-2 py-0.5 text-xs bg-teal-50 text-teal-700 rounded"
                                >
                                  {perm}
                                </span>
                              ))}
                              {role.permissions.length > 3 && (
                                <span className="text-xs text-slate-500">
                                  +{role.permissions.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!role.isSystem && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Switch defaultChecked className="ml-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
