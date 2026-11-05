import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { AttributeCreationContent } from "@/components/attribute-creation-content"

export default function AttributeCreationPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-auto">
          <AttributeCreationContent />
        </div>
      </div>
    </div>
  )
}
