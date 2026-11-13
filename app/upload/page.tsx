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
          <section className="mx-auto flex max-w-3xl flex-col gap-6 rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold text-slate-900">Upload</h1>
              <p className="text-sm leading-relaxed text-slate-600">
                Select a file from your computer, then upload it to Fuze.
              </p>
            </div>
            <FileUploader />
          </section>
        </main>
      </div>
    </div>
  )
}
