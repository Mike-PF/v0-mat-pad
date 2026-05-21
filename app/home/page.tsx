"use client"

import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { HomeContent } from "@/components/home-content"

export default function HomePage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 overflow-auto px-4 pb-6">
          <HomeContent />
        </div>
      </div>
    </div>
  )
}
