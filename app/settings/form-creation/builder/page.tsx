"use client"

import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { FormBuilder } from "@/components/form-builder"

export default function FormBuilderPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-hidden">
          <FormBuilder />
        </div>
      </div>
    </div>
  )
}
