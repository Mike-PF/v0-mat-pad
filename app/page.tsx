"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
        handleFileUpload(file)
      } else {
        alert("Please upload a Word document (.doc or .docx)")
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
        handleFileUpload(file)
      } else {
        alert("Please upload a Word document (.doc or .docx)")
      }
    }
  }

  const handleFileUpload = (file: File) => {
    setIsProcessing(true)
    setTimeout(() => {
      router.push("/forms")
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <Card className="max-w-xl w-full">
              <CardHeader>
                <CardTitle className="text-lg">Upload Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-slate-300 hover:border-primary hover:bg-primary/5"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center animate-pulse">
                        <Upload className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-slate-900 font-medium">Processing document...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-8 h-8 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-slate-900 font-medium mb-1">Drop your Word document here</p>
                        <p className="text-sm text-slate-600">or</p>
                      </div>
                      <div>
                        <input
                          type="file"
                          accept=".doc,.docx"
                          onChange={handleFileInput}
                          disabled={isProcessing}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isProcessing}
                            className="cursor-pointer bg-transparent"
                            onClick={(e) => {
                              e.preventDefault()
                              document.getElementById("file-upload")?.click()
                            }}
                          >
                            Browse Files
                          </Button>
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">Supported formats: .doc, .docx</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
