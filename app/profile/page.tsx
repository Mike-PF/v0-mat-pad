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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Building2,
  Shield,
  Star,
  Trash2,
  Plus,
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
  const [ssoLogins, setSsoLogins] = useState(userData.ssoLogins)
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
  const [showAddSSO, setShowAddSSO] = useState(false)
  const [newSSOProvider, setNewSSOProvider] = useState<"Microsoft" | "Google" | "">("")
  const [newSSOEmail, setNewSSOEmail] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const currentUserSsoId = "sso-1" // The SSO the user is currently logged in with

  const handleSsoDefaultChange = (ssoId: string, orgId: string) => {
    setSsoDefaults(prev => ({
      ...prev,
      [ssoId]: orgId
    }))
  }

  const handleDeleteSSO = (ssoId: string) => {
    setSsoLogins(prev => prev.filter(s => s.id !== ssoId))
    setSsoDefaults(prev => {
      const next = { ...prev }
      delete next[ssoId]
      return next
    })
    setDeleteTarget(null)
  }

  const handleAddSSO = () => {
    if (!newSSOProvider.trim() || !newSSOEmail.trim()) return
    const newId = `sso-${Date.now()}`
    const providerLabel = newSSOProvider === "Microsoft" ? "Microsoft Entra ID" : "Google Workspace"
    setSsoLogins(prev => [
      ...prev,
      {
        id: newId,
        provider: providerLabel,
        url: "",
        email: newSSOEmail.trim(),
        linkedAt: new Date().toISOString().split("T")[0],
      }
    ])
    setNewSSOProvider("")
    setNewSSOEmail("")
    setShowAddSSO(false)
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

            {/* SSO Logins */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">SSO Logins</h2>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowAddSSO(true)}
                  >
                    Add SSO
                  </Button>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Your linked Single Sign-On accounts.
                </p>
                <div className="space-y-3">
                  {ssoLogins.map((sso) => (
                    <div
                      key={sso.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-slate-900">{sso.provider}</span>
                        <p className="text-sm text-slate-500 truncate">{sso.email}</p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <span className="text-xs text-slate-400">
                          Linked {new Date(sso.linkedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                        {sso.id !== currentUserSsoId && (
                          <button
                            onClick={() => setDeleteTarget(sso.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Remove SSO account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add SSO Dialog */}
            <Dialog open={showAddSSO} onOpenChange={(open) => { setShowAddSSO(open); if (!open) { setNewSSOProvider(""); setNewSSOEmail("") } }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add SSO Login</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 py-2">
                  <div className="space-y-2">
                    <Label>Select Provider</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Microsoft */}
                      <button
                        type="button"
                        onClick={() => setNewSSOProvider("Microsoft")}
                        className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                          newSSOProvider === "Microsoft"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {/* Microsoft logo */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" className="w-8 h-8">
                          <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                          <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
                          <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
                          <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
                        </svg>
                        <span className="text-sm font-medium text-slate-700">Microsoft</span>
                      </button>

                      {/* Google */}
                      <button
                        type="button"
                        onClick={() => setNewSSOProvider("Google")}
                        className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                          newSSOProvider === "Google"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {/* Google logo */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-8 h-8">
                          <path fill="#4285F4" d="M46.145 24.5c0-1.64-.148-3.22-.421-4.744H24v8.981h12.435c-.536 2.89-2.167 5.338-4.617 6.983v5.805h7.476c4.374-4.03 6.851-9.967 6.851-16.025z"/>
                          <path fill="#34A853" d="M24 47c6.238 0 11.467-2.069 15.294-5.603l-7.476-5.805C29.718 37.105 27.02 38 24 38c-5.999 0-11.082-4.05-12.898-9.495H3.384v5.994C7.19 42.473 15.036 47 24 47z"/>
                          <path fill="#FBBC05" d="M11.102 28.505A14.927 14.927 0 0 1 10.5 24c0-1.566.27-3.088.602-4.505V13.5H3.384A23.01 23.01 0 0 0 1 24c0 3.71.89 7.222 2.384 10.5l7.718-5.995z"/>
                          <path fill="#EA4335" d="M24 9.5c3.379 0 6.41 1.162 8.795 3.442l6.598-6.597C35.461 2.643 30.232 0 24 0 15.036 0 7.19 4.527 3.384 11.5l7.718 5.995C12.918 13.05 18.001 9.5 24 9.5z"/>
                        </svg>
                        <span className="text-sm font-medium text-slate-700">Google</span>
                      </button>
                    </div>
                  </div>

                  {newSSOProvider && (
                    <div className="space-y-1.5">
                      <Label htmlFor="sso-email">Email Address</Label>
                      <Input
                        id="sso-email"
                        type="email"
                        placeholder="e.g. you@organisation.com"
                        value={newSSOEmail}
                        onChange={e => setNewSSOEmail(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setShowAddSSO(false); setNewSSOProvider(""); setNewSSOEmail("") }}>Cancel</Button>
                  <Button onClick={handleAddSSO} disabled={!newSSOProvider || !newSSOEmail.trim()}>
                    Add SSO
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete SSO Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Remove SSO Account</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-slate-600 py-2">
                  Are you sure you want to remove{" "}
                  <span className="font-medium text-slate-900">
                    {ssoLogins.find(s => s.id === deleteTarget)?.provider}
                  </span>{" "}
                  ({ssoLogins.find(s => s.id === deleteTarget)?.email})? This cannot be undone.
                </p>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                  <Button
                    onClick={() => deleteTarget && handleDeleteSSO(deleteTarget)}
                  >
                    Remove
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
                  {ssoLogins.map((sso) => (
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
