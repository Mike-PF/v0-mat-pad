"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, FileText, UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UploadStatus = "idle" | "uploading" | "done"

const FILE_TYPES = [
  { value: "idsr", label: "IDSR", description: "Inspection Data Summary Report" },
  { value: "national", label: "National data", description: "DfE / national comparison datasets" },
  { value: "attendance", label: "Attendance", description: "Pupil attendance and absence records" },
  { value: "census", label: "School census", description: "Termly census returns" },
  { value: "exclusions", label: "Suspensions & exclusions", description: "Behaviour sanctions data" },
  { value: "assessment", label: "Assessment", description: "KS2 / KS4 results and progress data" },
  { value: "other", label: "Other", description: "Anything not listed above" },
]

const ACCEPTED = ".csv,.xlsx,.xls,.docx,.doc,.pdf"
const MAX_SIZE_MB = 25

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState("")
  const selectedType = FILE_TYPES.find((t) => t.value === fileType)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const selectFile = (selected: File | undefined) => {
    if (!selected) return
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`${selected.name} is larger than ${MAX_SIZE_MB} MB.`)
      return
    }
    setError(null)
    setFile(selected)
    setStatus("idle")
    setProgress(0)
  }

  const clearFile = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const startUpload = () => {
    if (!file || !fileType) return
    setStatus("uploading")
    setProgress(0)
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 8 + Math.random() * 12)
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current)
          setStatus("done")
        }
        return next
      })
    }, 200)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="upload-file-type" className="text-sm font-medium text-slate-900">
          File type
        </Label>
        <Select value={fileType} onValueChange={setFileType} disabled={status === "uploading"}>
          <SelectTrigger id="upload-file-type" className="w-full justify-between text-left sm:w-80">
            <SelectValue placeholder="Select file type">
              {selectedType?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {FILE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                <span className="flex flex-col">
                  <span>{t.label}</span>
                  <span className="text-xs text-slate-500">{t.description}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <input
        ref={inputRef}
        id="file-upload-input"
        type="file"
        accept={ACCEPTED}
        className="sr-only"
        onChange={(e) => selectFile(e.target.files?.[0])}
      />

      {!file && (
        <label
          htmlFor="file-upload-input"
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            selectFile(e.dataTransfer.files?.[0])
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-14 text-center transition-colors focus-within:ring-2 focus-within:ring-[#33295e] ${
            isDragging ? "border-[#33295e] bg-[#33295e]/5" : "border-slate-300 bg-slate-50 hover:border-slate-400"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <UploadCloud className="h-6 w-6 text-[#33295e]" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium text-slate-900">
            Drag and drop a file here, or <span className="text-[#33295e] underline underline-offset-2">browse</span>
          </span>
          <span className="text-xs text-slate-500">CSV, Excel, Word or PDF up to {MAX_SIZE_MB} MB</span>
        </label>
      )}

      {file && (
        <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100">
              <FileText className="h-5 w-5 text-slate-600" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                {formatSize(file.size)}
                {selectedType && (
                  <span className="rounded-full bg-[#33295e]/10 px-2 py-0.5 font-medium text-[#33295e]">
                    {selectedType.label}
                  </span>
                )}
              </p>
            </div>
            {status !== "uploading" && (
              <button
                type="button"
                onClick={clearFile}
                aria-label={`Remove ${file.name}`}
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {status !== "idle" && (
            <div className="flex flex-col gap-1.5">
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Upload progress"
              >
                <div
                  className={`h-full rounded-full transition-all ${status === "done" ? "bg-emerald-500" : "bg-[#33295e]"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500" aria-live="polite">
                {status === "done" ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Upload complete
                  </span>
                ) : (
                  `Uploading… ${Math.round(progress)}%`
                )}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            {status === "idle" && !fileType && (
              <p className="mr-auto text-xs text-amber-600">Select a file type to enable upload.</p>
            )}
            {status === "done" ? (
              <Button onClick={clearFile} className="bg-[#33295e] text-white hover:bg-[#33295e]/90">
                Upload another file
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={status === "uploading"}>
                  Choose different file
                </Button>
                <Button
                  onClick={startUpload}
                  disabled={status === "uploading" || !fileType}
                  className="bg-[#33295e] text-white hover:bg-[#33295e]/90"
                >
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  {status === "uploading" ? "Uploading…" : "Upload file"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
