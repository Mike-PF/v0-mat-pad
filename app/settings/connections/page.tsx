"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"

const systems = [
  {
    id: "arbor",
    name: "Arbor",
    logo: "Arbor",
    logoColor: "text-green-600",
    description: "Make informed decisions with Arbor's cloud-based MIS, providing instant access to real-time student data. Monitor attendance, track academic progress, and analyse trends across your school, all from a single, intuitive dashboard."
  },
  {
    id: "bromcom",
    name: "Bromcom",
    logo: "Bromcom",
    logoColor: "text-pink-600",
    description: "Connect to Bromcom to synchronise attendance, student, and mark records using a secure, read-only data flow."
  },
  {
    id: "cpoms",
    name: "CPOMS",
    logo: "CPOMS",
    logoColor: "text-cyan-600",
    description: "CPOMS (Child Protection Online Management System) is a safeguarding, wellbeing and pastoral case-management platform used by schools and trusts to securely record concerns, build chronologies, manage cases and support coordinated safeguarding action."
  },
  {
    id: "evolve",
    name: "Evolve",
    logo: "EVOLVE",
    logoColor: "text-slate-800",
    description: "Gain full visibility over school trips and activities with Evolve's data-driven management system. Track approvals, risk assessments, and communication logs in one centralised platform, ensuring clear oversight and compliance at every stage."
  },
  {
    id: "safesmart",
    name: "Safesmart",
    logo: "Safesmart",
    logoColor: "text-teal-600",
    description: "Manage health and safety data with ease using Safesmart. From incident reports to compliance checks, centralise safety records and access key insights to ensure your school meets regulatory standards efficiently."
  },
  {
    id: "sampeople",
    name: "SAMpeople",
    logo: "SAM people",
    logoColor: "text-green-600",
    description: "Optimise your school's HR management with SAMpeople, the dedicated platform for tracking staff data, performance, and wellbeing. From absence management to professional development, SAMpeople provides clear insights and streamlined processes to support your team and improve operational efficiency."
  },
  {
    id: "sisra",
    name: "Sisra",
    logo: "Sisra Analytics",
    logoColor: "text-purple-600",
    description: "Make time-consuming data analysis a thing of the past with Sisra Analytics, the most flexible data-driven solution for assessments in schools. Bring together student progress, performance and pastoral data across key stages 3, 4 & 5."
  },
  {
    id: "weareevery",
    name: "WeAreEvery",
    logo: "every",
    logoColor: "text-teal-600",
    description: "Empower your school with Every, the all-in-one platform for managing compliance, HR, and operational data. From tracking staff records to overseeing site management and policies, Every gives you the tools to centralise processes, streamline reporting, and make data-driven decisions with confidence."
  },
  {
    id: "wonde",
    name: "Wonde",
    logo: "wonde",
    logoColor: "text-blue-600",
    description: "Take control of your school's data with Wonde's secure integration platform. Automate data transfers, manage permissions, and connect to the digital tools you rely on while maintaining data accuracy and security."
  },
]

export default function ConnectionsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  console.log("[v0] ConnectionsPage rendering")

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {systems.map((system) => (
                  <div
                    key={system.id}
                    className="flex items-start gap-4 p-4 border-l-4 border-l-primary hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="w-20 flex-shrink-0 pt-1">
                      <span className={`text-sm font-semibold ${system.logoColor}`}>
                        {system.logo}
                      </span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
