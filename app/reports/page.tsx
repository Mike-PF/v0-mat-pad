"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"

export default function ReportsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/reports/predefined")
  }, [router])

  // Render consistent loading UI on both server and client
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>
        <div className="flex-1 overflow-auto px-4 pb-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-400">Redirecting...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
