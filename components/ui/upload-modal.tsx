"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onFileSelect: (file: File) => void
  isProcessing?: boolean
}

export function UploadModal({ isOpen, onClose, onFileSelect, isProcessing = false }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false)

  if (!isOpen) return null

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
        onFileSelect(file)
        onClose()
      } else {
        alert("Please upload a Word document (.doc or .docx)")
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
        onFileSelect(file)
        onClose()
      } else {
        alert("Please upload a Word document (.doc or .docx)")
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-lg w-full mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Upload Document</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isProcessing}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive
                ? "border-[#b30089] bg-[#b30089]/5"
                : "border-slate-300 hover:border-[#b30089] hover:bg-[#b30089]/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
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
                  id="modal-file-upload"
                />
                <label htmlFor="modal-file-upload">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isProcessing}
                    className="cursor-pointer bg-transparent"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById("modal-file-upload")?.click()
                    }}
                  >
                    Browse Files
                  </Button>
                </label>
              </div>
              <p className="text-xs text-slate-500">Supported formats: .doc, .docx</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
