"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  User,
  Building2,
  Shield,
  Link2,
  Star,
  ExternalLink,
} from "lucide-react"

// Sample user data
const userData = {
  name: "Gareth Hutchings",
  initials: "GH",
  email: "gareth.hutchings@stclaremat.org",
  ssoLogins: [
    {
      id: "sso-1",
      provider: "Microsoft Entra ID",
      url: "https://login.microsoftonline.com/stclaremat",
      email: "gareth.hutchings@stclaremat.onmicrosoft.com",
      linkedAt: "2023-05-15",
    },
    {
      id: "sso-2",
      provider: "Google Workspace",
      url: "https://accounts.google.com/o/saml2/stclaremat",
      email: "g.hutchings@stclaremat.org",
      linkedAt: "2023-08-22",
    },
  ],
  organisations: [
    {
      id: "org-1",
      name: "St Clare Catholic Multi Academy Trust",
      abbreviation: "SCMAT",
      type: "MAT",
      roles: ["Administrator", "Report Viewer"],
      defaultForSSO: ["sso-1"],
    },
    {
      id: "org-2",
      name: "All Saints' Catholic High School",
      abbreviation: "ASHS",
      type: "School",
      roles: ["Form Creator", "Data Manager"],
      defaultForSSO: ["sso-2"],
    },
    {
      id: "org-3",
      name: "Emmaus Catholic and CofE Primary School",
      abbreviation: "ECP",
      type: "School",
      roles: ["Report Viewer"],
      defaultForSSO: [],
    },
    {
      id: "org-4",
      name: "Notre Dame High School",
      abbreviation: "NDHS",
      type: "School",
      roles: ["Administrator", "Form Creator", "Report Viewer", "Data Manager"],
      defaultForSSO: [],
    },
  ],
}

const ACCENT = "hsl(314 100% 35%)"

export default function ProfilePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [ssoDefaults, setSsoDefaults] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    userData.ssoLogins.forEach(sso => {
      const defaultOrg = userData.organisations.find(org => 
        org.defaultForSSO.includes(sso.id)
      )
      if (defaultOrg) {
        defaults[sso.id] = defaultOrg.id
      }
    })
    return defaults
  })

  const handleSsoDefaultChange = (ssoId: string, orgId: string) => {
    setSsoDefaults(prev => ({
      ...prev,
      [ssoId]: orgId
    }))
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-red-100 text-red-700 border-red-200"
      case "Report Viewer":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Form Creator":
        return "bg-green-100 text-green-700 border-green-200"
      case "Data Manager":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {userData.initials}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{userData.name}</h1>
                    <p className="text-slate-500">{userData.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SSO Login URLs */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-900">SSO Login URLs</h2>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Your linked Single Sign-On providers and login URLs.
                </p>
                <div className="space-y-3">
                  {userData.ssoLogins.map((sso) => (
                    <div
                      key={sso.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900">{sso.provider}</span>
                        </div>
                        <p className="text-sm text-slate-500 truncate">{sso.email}</p>
                        <a
                          href={sso.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                        >
                          {sso.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-xs text-slate-400 ml-4">
                        Linked {new Date(sso.linkedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Organisations */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-900">Organisations</h2>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Organisations you are linked to and your roles within each.
                </p>
                <div className="space-y-4">
                  {userData.organisations.map((org) => (
                    <div
                      key={org.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                            style={{ backgroundColor: ACCENT }}
                          >
                            {org.abbreviation.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900">{org.name}</h3>
                            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                              {org.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Roles */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">Roles</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {org.roles.map((role) => (
                            <span
                              key={role}
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(role)}`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Default SSO indicator */}
                      {org.defaultForSSO.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-slate-500">
                            Default for: {org.defaultForSSO.map(ssoId => {
                              const sso = userData.ssoLogins.find(s => s.id === ssoId)
                              return sso?.provider
                            }).filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Default Organisation per SSO */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-900">Default Organisation per SSO</h2>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Select the default organisation to log into for each SSO provider.
                </p>
                <div className="space-y-4">
                  {userData.ssoLogins.map((sso) => (
                    <div
                      key={sso.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-slate-900">{sso.provider}</span>
                        <p className="text-sm text-slate-500">{sso.email}</p>
                      </div>
                      <div className="ml-4 w-64">
                        <Select
                          value={ssoDefaults[sso.id] || ""}
                          onValueChange={(value) => handleSsoDefaultChange(sso.id, value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select default organisation" />
                          </SelectTrigger>
                          <SelectContent>
                            {userData.organisations.map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.abbreviation} - {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
