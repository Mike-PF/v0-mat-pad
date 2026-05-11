"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { PredefinedReportsContent } from "@/components/predefined-reports-content"

export default function PredefinedReportsPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 overflow-auto px-4 pb-6">
          <PredefinedReportsContent />
        </div>
      </div>
    </div>
  )
}
