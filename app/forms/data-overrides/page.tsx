"use client"

import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { DataOverridesContent } from "@/components/data-overrides-content"

export default function DataOverridesPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation showProgress={false} />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-hidden">
          <DataOverridesContent />
        </div>
      </div>
    </div>
  )
}
