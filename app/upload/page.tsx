import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { FileUploader } from "@/components/file-uploader"

export default function UploadPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="p-4">
          <TopNavigation />
        </div>
        <main className="flex-1 overflow-auto px-4 pb-6">
          <FileUploader />
        </main>
      </div>
    </div>
  )
}
