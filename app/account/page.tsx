"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Building2, Shield, Link2 } from "lucide-react"

const userData = {
  name: "Gareth Hutchings",
  email: "gareth.hutchings@example.com",
  initials: "GH",
}

const ssoProviders = [
  {
    id: "sso-1",
    name: "Microsoft Azure AD",
    loginUrl: "https://login.microsoftonline.com/matpad",
    linkedEmail: "gareth.hutchings@stjosephmat.org.uk",
    lastLogin: "2026-03-22 14:32",
    defaultOrgId: "org-1",
  },
  {
    id: "sso-2",
    name: "Google Workspace",
    loginUrl: "https://accounts.google.com/o/saml2/matpad",
    linkedEmail: "g.hutchings@allsaintshigh.edu",
    lastLogin: "2026-03-20 09:15",
    defaultOrgId: "org-2",
  },
]

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
    ssoProviders.forEach((sso) => {
      defaults[sso.id] = sso.defaultOrgId
    })
    return defaults
  })

  const handleDefaultOrgChange = (ssoId: string, orgId: string) => {
    setSsoDefaults((prev) => ({ ...prev, [ssoId]: orgId }))
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
            <p className="text-slate-600">Manage your profile, SSO logins, and organisation access</p>
          </div>

          {/* Profile Card */}
          <Card className="mb-8 border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: "#121051" }}
                >
                  {userData.initials}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{userData.name}</h2>
                  <p className="text-slate-600">{userData.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SSO Login URLs */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              SSO Login URLs
            </h3>
            <div className="space-y-4">
              {ssoProviders.map((sso) => (
                <Card key={sso.id} className="border-slate-200">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900">{sso.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">Login URL</p>
                          <p className="text-sm text-slate-600 font-mono break-all">{sso.loginUrl}</p>
                          <p className="text-xs text-slate-500 mt-2">Linked Email</p>
                          <p className="text-sm text-slate-600">{sso.linkedEmail}</p>
                          <p className="text-xs text-slate-500 mt-2">Last Login</p>
                          <p className="text-sm text-slate-600">{sso.lastLogin}</p>
                        </div>
                      </div>

                      {/* Default Organisation Select */}
                      <div className="border-t pt-4">
                        <label className="text-xs text-slate-500 block mb-2">Default Organisation for this SSO</label>
                        <Select value={ssoDefaults[sso.id]} onValueChange={(val) => handleDefaultOrgChange(sso.id, val)}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {linkedOrganisations.map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Linked Organisations */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Linked Organisations
            </h3>
            <Card className="border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Organisation</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Roles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkedOrganisations.map((org) => (
                      <tr key={org.id} className="border-b border-slate-200 last:border-0">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{org.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className="text-white"
                            style={{
                              backgroundColor: org.type === "MAT" ? "#121051" : "hsl(314 100% 35%)",
                            }}
                          >
                            {org.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {org.roles.map((role) => (
                              <Badge key={role} variant="outline" className="text-slate-600">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
