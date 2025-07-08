"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { DataExportContent } from "@/components/data-export-content"

export default function DataExportPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 overflow-auto px-4 pb-6">
          <DataExportContent />
        </div>
      </div>
    </div>
  )
}
