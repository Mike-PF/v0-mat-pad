"use client"

import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { AIChatContent } from "@/components/ai-chat-content"

export default function AIChatPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 overflow-hidden px-4 pb-6">
          <AIChatContent />
        </div>
      </div>
    </div>
  )
}
