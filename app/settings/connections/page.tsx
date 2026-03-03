"use client"

import { useState } from "react"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

// Mock school data for each system
const schoolConnections: Record<string, Array<{
  urn: string
  schoolName: string
  status: "connected" | "no-connection"
  domain: string
  apiKey: string
  active: boolean
}>> = {
  arbor: [
    { urn: "149032", schoolName: "Blessed Carlo Acutis Catholic and Church of England Academy", status: "no-connection", domain: "https://...", apiKey: "", active: false },
    { urn: "149190", schoolName: "Holy Family Catholic Academy", status: "connected", domain: "https://holy-family.uk.arbor.sc/grap", apiKey: "**********", active: true },
    { urn: "149029", schoolName: "Holy Spirit Catholic Academy", status: "connected", domain: "https://holy-spirit-catholic-acaden", apiKey: "**********", active: true },
    { urn: "150373", schoolName: "Notre Dame Catholic Academy", status: "connected", domain: "https://notre-dame-catholic-colleg", apiKey: "**********", active: true },
    { urn: "149133", schoolName: "St Ambrose Catholic Academy", status: "connected", domain: "https://st-ambrose-catholic-acade", apiKey: "**********", active: true },
    { urn: "149031", schoolName: "St Augustine of Canterbury Catholic Academy", status: "connected", domain: "https://staugs.uk.arbor.sc/graphql/...", apiKey: "", active: true },
    { urn: "150713", schoolName: "St Francis Xavier's Catholic Academy", status: "connected", domain: "https://st-francis-xaviers-college.u", apiKey: "**********", active: true },
    { urn: "149132", schoolName: "St Nicholas Catholic Academy", status: "connected", domain: "https://st-nicholas-catholic-primar", apiKey: "**********", active: true },
    { urn: "149134", schoolName: "The Trinity Catholic Academy", status: "connected", domain: "https://the-trinity-catholic-primary", apiKey: "**********", active: true },
  ],
  bromcom: [
    { urn: "149032", schoolName: "Blessed Carlo Acutis Catholic and Church of England Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149190", schoolName: "Holy Family Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149029", schoolName: "Holy Spirit Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "150373", schoolName: "Notre Dame Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149133", schoolName: "St Ambrose Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149031", schoolName: "St Augustine of Canterbury Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "150713", schoolName: "St Francis Xavier's Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149132", schoolName: "St Nicholas Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
    { urn: "149134", schoolName: "The Trinity Catholic Academy", status: "no-connection", domain: "", apiKey: "", active: false },
  ],
  cpoms: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.cpoms.net", apiKey: "**********", active: true },
    { urn: "149002", schoolName: "Sacred Heart Academy", status: "connected", domain: "https://sacredheart.cpoms.net", apiKey: "**********", active: true },
  ],
  evolve: [
    { urn: "149032", schoolName: "Blessed Carlo Acutis Catholic and Church of England Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149190", schoolName: "Holy Family Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149029", schoolName: "Holy Spirit Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "150373", schoolName: "Notre Dame Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149133", schoolName: "St Ambrose Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149031", schoolName: "St Augustine of Canterbury Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "150713", schoolName: "St Francis Xavier's Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149132", schoolName: "St Nicholas Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
    { urn: "149134", schoolName: "The Trinity Catholic Academy", status: "connected", domain: "**********", apiKey: "", active: true },
  ],
  safesmart: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.safesmart.co.uk", apiKey: "**********", active: true },
  ],
  sampeople: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.sampeople.com", apiKey: "**********", active: true },
  ],
  sisra: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.sisra.com", apiKey: "**********", active: true },
  ],
  weareevery: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.every.education", apiKey: "**********", active: true },
  ],
  wonde: [
    { urn: "149001", schoolName: "St Mary's Primary School", status: "connected", domain: "https://stmarys.wonde.com", apiKey: "**********", active: true },
  ],
}

// System-specific configuration for modal display
const systemConfig: Record<string, {
  columns: "standard" | "simple"
  idFieldName: string
  idPlaceholder: string
  brandColor: string
}> = {
  arbor: { columns: "standard", idFieldName: "Arbor Domain", idPlaceholder: "https://...", brandColor: "#121051" },
  bromcom: { columns: "simple", idFieldName: "Bromcom School ID", idPlaceholder: "e.g. 11504", brandColor: "#121051" },
  cpoms: { columns: "standard", idFieldName: "CPOMS Domain", idPlaceholder: "https://...", brandColor: "#121051" },
  evolve: { columns: "simple", idFieldName: "API Key", idPlaceholder: "", brandColor: "#121051" },
  safesmart: { columns: "standard", idFieldName: "Safesmart Domain", idPlaceholder: "https://...", brandColor: "#121051" },
  sampeople: { columns: "standard", idFieldName: "SAMpeople Domain", idPlaceholder: "https://...", brandColor: "#121051" },
  sisra: { columns: "standard", idFieldName: "Sisra Domain", idPlaceholder: "https://...", brandColor: "#121051" },
  weareevery: { columns: "standard", idFieldName: "Every Domain", idPlaceholder: "https://...", brandColor: "#121051" },
  wonde: { columns: "standard", idFieldName: "Wonde Domain", idPlaceholder: "https://...", brandColor: "#121051" },
}

const systems = [
  {
    id: "arbor",
    name: "Arbor",
    logoImage: "/images/logos/arbor.png",
    description: "Make informed decisions with Arbor's cloud-based MIS, providing instant access to real-time student data. Monitor attendance, track academic progress, and analyse trends across your school, all from a single, intuitive dashboard."
  },
  {
    id: "bromcom",
    name: "Bromcom",
    logoImage: "/images/logos/bromcom.png",
    description: "Connect to Bromcom to synchronise attendance, student, and mark records using a secure, read-only data flow."
  },
  {
    id: "cpoms",
    name: "CPOMS",
    logoImage: "/images/logos/cpoms.png",
    description: "CPOMS (Child Protection Online Management System) is a safeguarding, wellbeing and pastoral case-management platform used by schools and trusts to securely record concerns, build chronologies, manage cases and support coordinated safeguarding action."
  },
  {
    id: "evolve",
    name: "Evolve",
    logoImage: "/images/logos/evolve.png",
    description: "Gain full visibility over school trips and activities with Evolve's data-driven management system. Track approvals, risk assessments, and communication logs in one centralised platform, ensuring clear oversight and compliance at every stage."
  },
  {
    id: "safesmart",
    name: "Safesmart",
    logoImage: "/images/logos/safesmart.png",
    description: "Manage health and safety data with ease using Safesmart. From incident reports to compliance checks, centralise safety records and access key insights to ensure your school meets regulatory standards efficiently."
  },
  {
    id: "sampeople",
    name: "SAMpeople",
    logoImage: "/images/logos/sampeople.png",
    description: "Optimise your school's HR management with SAMpeople, the dedicated platform for tracking staff data, performance, and wellbeing. From absence management to professional development, SAMpeople provides clear insights and streamlined processes to support your team and improve operational efficiency."
  },
  {
    id: "sisra",
    name: "Sisra",
    logoImage: "/images/logos/sisra.png",
    description: "Make time-consuming data analysis a thing of the past with Sisra Analytics, the most flexible data-driven solution for assessments in schools. Bring together student progress, performance and pastoral data across key stages 3, 4 & 5."
  },
  {
    id: "weareevery",
    name: "WeAreEvery",
    logoImage: "/images/logos/every.png",
    description: "Empower your school with Every, the all-in-one platform for managing compliance, HR, and operational data. From tracking staff records to overseeing site management and policies, Every gives you the tools to centralise processes, streamline reporting, and make data-driven decisions with confidence."
  },
  {
    id: "wonde",
    name: "Wonde",
    logoImage: "/images/logos/wonde.png",
    description: "Take control of your school's data with Wonde's secure integration platform. Automate data transfers, manage permissions, and connect to the digital tools you rely on while maintaining data accuracy and security."
  },
]

export default function ConnectionsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState<typeof systems[0] | null>(null)
  const [connections, setConnections] = useState(schoolConnections)
  const [originalConnections, setOriginalConnections] = useState(schoolConnections)

  const handleOpenModal = (system: typeof systems[0]) => {
    setSelectedSystem(system)
    setOriginalConnections(JSON.parse(JSON.stringify(connections)))
  }

  const handleToggleActive = (systemId: string, urn: string) => {
    setConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...school, active: !school.active } : school
      )
    }))
  }

  const handleDomainChange = (systemId: string, urn: string, value: string) => {
    setConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...school, domain: value } : school
      )
    }))
  }

  const handleApiKeyChange = (systemId: string, urn: string, value: string) => {
    setConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...school, apiKey: value } : school
      )
    }))
  }

  const getDomainColumnName = (systemName: string) => {
    return `${systemName} Domain`
  }

  const hasChanges = (systemId: string, urn: string) => {
    const current = connections[systemId]?.find(s => s.urn === urn)
    const original = originalConnections[systemId]?.find(s => s.urn === urn)
    if (!current || !original) return false
    return current.domain !== original.domain || 
           current.apiKey !== original.apiKey || 
           current.active !== original.active
  }

  const canSave = (systemId: string, urn: string) => {
    const school = connections[systemId]?.find(s => s.urn === urn)
    if (!school) return false
    
    const config = systemConfig[systemId]
    
    // For simple columns (like Bromcom), only need domain field filled
    if (config?.columns === "simple") {
      const hasValidDetails = school.domain && school.domain !== "" && school.domain !== config.idPlaceholder
      return hasChanges(systemId, urn) && hasValidDetails
    }
    
    // For standard columns, need both domain and API key
    const hasValidDetails = school.domain && school.domain !== "https://..." && school.apiKey && school.apiKey !== ""
    return hasChanges(systemId, urn) && hasValidDetails
  }

  const handleSave = (systemId: string, urn: string) => {
    // Update original to match current (simulating save)
    setOriginalConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...connections[systemId].find(s => s.urn === urn)! } : school
      )
    }))
    // Also update status to connected
    setConnections(prev => ({
      ...prev,
      [systemId]: prev[systemId].map(school => 
        school.urn === urn ? { ...school, status: "connected" as const } : school
      )
    }))
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto">
          <div className="space-y-2">
            {systems.map((system) => (
              <div
                key={system.id}
                onClick={() => handleOpenModal(system)}
                className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm cursor-pointer"
              >
                <div className="w-24 flex-shrink-0 flex items-center justify-center">
                  {system.logoImage ? (
                    <Image
                      src={system.logoImage}
                      alt={`${system.name} logo`}
                      width={80}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <span className={`text-sm font-semibold ${system.logoColor}`}>
                      {system.logoText}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{system.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {system.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connection Configuration Modal */}
      <Dialog open={!!selectedSystem} onOpenChange={(open) => !open && setSelectedSystem(null)}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedSystem?.logoImage ? (
                <Image
                  src={selectedSystem.logoImage}
                  alt={`${selectedSystem.name} logo`}
                  width={100}
                  height={50}
                  className="object-contain"
                />
              ) : (
                <span className="text-xl font-bold">{selectedSystem?.name}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">URN</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">School Name</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">
                    {selectedSystem ? systemConfig[selectedSystem.id]?.idFieldName : "Domain"}
                  </th>
                  {selectedSystem && systemConfig[selectedSystem.id]?.columns === "standard" && (
                    <th className="text-left py-3 px-2 text-sm font-semibold text-slate-700">API Key</th>
                  )}
                  <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Active</th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-slate-700">Save</th>
                </tr>
              </thead>
              <tbody>
                {selectedSystem && connections[selectedSystem.id]?.map((school) => (
                  <tr key={school.urn} className="border-b last:border-0">
                    <td className="py-3 px-2 text-sm text-slate-600">{school.urn}</td>
                    <td className="py-3 px-2 text-sm text-slate-900">{school.schoolName}</td>
                    <td className="py-3 px-2">
                      <span className={`text-sm ${school.status === "connected" ? "text-green-600" : "text-slate-400"}`}>
                        {school.status === "connected" ? "Connected" : "No connection"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        value={school.domain}
                        onChange={(e) => handleDomainChange(selectedSystem.id, school.urn, e.target.value)}
                        placeholder={systemConfig[selectedSystem.id]?.idPlaceholder || "https://..."}
                        className="h-8 text-sm w-48"
                      />
                    </td>
                    {systemConfig[selectedSystem.id]?.columns === "standard" && (
                      <td className="py-3 px-2">
                        <Input
                          type="password"
                          value={school.apiKey}
                          onChange={(e) => handleApiKeyChange(selectedSystem.id, school.urn, e.target.value)}
                          placeholder="API key"
                          className="h-8 text-sm w-32"
                        />
                      </td>
                    )}
                    <td className="py-3 px-2 text-center">
                      <Switch
                        checked={school.active}
                        onCheckedChange={() => handleToggleActive(selectedSystem.id, school.urn)}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Button 
                        size="sm" 
                        disabled={!canSave(selectedSystem.id, school.urn)}
                        onClick={() => handleSave(selectedSystem.id, school.urn)}
                        className={`px-6 ${
                          canSave(selectedSystem.id, school.urn)
                            ? "text-white"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed"
                        }`}
                        style={canSave(selectedSystem.id, school.urn) ? { backgroundColor: "#121051" } : undefined}
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
