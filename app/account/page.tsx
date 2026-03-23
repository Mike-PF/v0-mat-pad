"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Building2, Shield, Link2, Star } from "lucide-react"

// Sample user data
const userData = {
  name: "Gareth Hutchings",
  email: "gareth.hutchings@example.com",
  initials: "GH",
}

// Sample SSO providers linked to this account
const ssoProviders = [
  { 
    id: "sso-1", 
    name: "Microsoft Azure AD", 
    loginUrl: "https://login.microsoftonline.com/matpad",
    linkedEmail: "gareth.hutchings@stjosephmat.org.uk",
    lastLogin: "2026-03-22 14:32",
    defaultOrgId: "org-1"
  },
  { 
    id: "sso-2", 
    name: "Google Workspace", 
    loginUrl: "https://accounts.google.com/o/saml2/matpad",
    linkedEmail: "g.hutchings@allsaintshigh.edu",
    lastLogin: "2026-03-20 09:15",
    defaultOrgId: "org-2"
  },
]

// Sample organisations and roles
const linkedOrganisations = [
  {
    id: "org-1",
    name: "St Joseph Catholic Multi Academy Trust",
    type: "MAT",
    roles: ["Admin", "Finance", "User Admin"],
  },
  {
    id: "org-2",
    name: "All Saints' Catholic High School",
    type: "School",
    roles: ["Admin", "User"],
  },
  {
    id: "org-3",
    name: "Emmaus Catholic and CofE Primary School",
    type: "School",
    roles: ["User", "Preview"],
  },
  {
    id: "org-4",
    name: "Notre Dame High School",
    type: "School",
    roles: ["Finance Data", "User"],
  },
]

export default function AccountPage() {
  const [ssoDefaults, setSsoDefaults] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    ssoProviders.forEach(sso => {
      defaults[sso.id] = sso.defaultOrgId
    })
    return defaults
  })

  const handleDefaultOrgChange = (ssoId: string, orgId: string) => {
    setSsoDefaults(prev => ({ ...prev, [ssoId]: orgId }))
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">My Account</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your account settings, SSO connections, and organisation access</p>
          </div>

          {/* Profile Card */}
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold"
                  style={{ backgroundColor: "hsl(314 100% 35%)" }}
                >
                  {userData.initials}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{userData.name}</h2>
                  <p className="text-sm text-slate-500">{userData.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SSO Logins Section */}
          <Card className="mb-6 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">SSO Login URLs</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">Your linked single sign-on providers and login URLs</p>
              
              <div className="space-y-4">
                {ssoProviders.map((sso) => (
                  <div key={sso.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900">{sso.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">Linked as: {sso.linkedEmail}</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-600 break-all">
                            {sso.loginUrl}
                          </code>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Last login: {sso.lastLogin}</p>
                      </div>
                      
                      <div className="min-w-[220px]">
                        <label className="text-xs text-slate-500 mb-1 block">Default Organisation</label>
                        <Select
                          value={ssoDefaults[sso.id]}
                          onValueChange={(val) => handleDefaultOrgChange(sso.id, val)}
                        >
                          <SelectTrigger className="h-9 bg-white">
                            <SelectValue placeholder="Select default..." />
                          </SelectTrigger>
                          <SelectContent>
                            {linkedOrganisations.map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="truncate">{org.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Linked Organisations Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-900">Linked Organisations</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">Organisations you have access to and your roles within each</p>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Organisation</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Roles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkedOrganisations.map((org) => (
                      <tr key={org.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                              style={{ backgroundColor: org.type === "MAT" ? "#121051" : "hsl(314 100% 35%)" }}
                            >
                              {org.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-900">{org.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            variant="outline" 
                            className={org.type === "MAT" 
                              ? "border-indigo-200 bg-indigo-50 text-indigo-700" 
                              : "border-pink-200 bg-pink-50 text-pink-700"
                            }
                          >
                            {org.type}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {org.roles.map((role) => (
                              <Badge 
                                key={role} 
                                variant="secondary"
                                className="bg-slate-100 text-slate-600 text-xs"
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {role}
                              </Badge>
                            ))}
                          </div>
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
