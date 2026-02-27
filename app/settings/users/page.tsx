"use client"

import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, MoreHorizontal, Mail, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@school.edu",
    role: "Administrator",
    status: "Active",
    lastActive: "2 hours ago",
    avatar: null,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    role: "Teacher",
    status: "Active",
    lastActive: "5 minutes ago",
    avatar: null,
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@school.edu",
    role: "Teacher",
    status: "Active",
    lastActive: "1 day ago",
    avatar: null,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@school.edu",
    role: "Support Staff",
    status: "Inactive",
    lastActive: "1 week ago",
    avatar: null,
  },
  {
    id: 5,
    name: "James Wilson",
    email: "james.wilson@school.edu",
    role: "Teacher",
    status: "Active",
    lastActive: "3 hours ago",
    avatar: null,
  },
]

function getStatusColor(status: string) {
  return status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
}

function getRoleBadgeColor(role: string) {
  switch (role) {
    case "Administrator":
      return "bg-purple-100 text-purple-800"
    case "Teacher":
      return "bg-blue-100 text-blue-800"
    case "Support Staff":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="flex-1 p-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-semibold">User Management</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-9 w-64" />
                </div>
                <Button className="bg-[#0066cc] hover:bg-[#0055aa] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Last Active</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar || undefined} />
                              <AvatarFallback className="bg-[#0066cc] text-white text-sm">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{user.lastActive}</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Deactivate User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>Showing 5 of 5 users</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
