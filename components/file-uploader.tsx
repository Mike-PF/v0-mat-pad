"use client"

import { useEffect, useRef, useState } from "react"
import {
  CalendarCheck,
  Check,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  FileText,
  GraduationCap,
  Landmark,
  MoreHorizontal,
  ShieldAlert,
  UploadCloud,
  X,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type UploadStatus = "idle" | "uploading" | "done"

type FileTypeOption = {
  value: string
  label: string
  description: string
  icon: LucideIcon
}

const FILE_TYPES: FileTypeOption[] = [
  { value: "idsr", label: "IDSR", description: "Inspection Data Summary Report", icon: FileSearch },
  { value: "national", label: "National data", description: "DfE comparison datasets", icon: Landmark },
  { value: "attendance", label: "Attendance", description: "Attendance and absence", icon: CalendarCheck },
  { value: "census", label: "School census", description: "Termly census returns", icon: ClipboardList },
  { value: "exclusions", label: "Suspensions", description: "Suspensions and exclusions", icon: ShieldAlert },
  { value: "assessment", label: "Assessment", description: "KS2 / KS4 results", icon: GraduationCap },
  { value: "other", label: "Other", description: "Anything else", icon: MoreHorizontal },
]

type RecentUpload = { id: string; name: string; type: string; size: number; when: string }

const SEED_RECENT: RecentUpload[] = [
  { id: "r1", name: "IDSR_AllSaints_2026.pdf", type: "idsr", size: 2_480_000, when: "Yesterday, 16:42" },
  { id: "r2", name: "attendance_autumn_wk10.csv", type: "attendance", size: 412_000, when: "10 Nov, 09:15" },
  { id: "r3", name: "KS4_results_provisional.xlsx", type: "assessment", size: 1_150_000, when: "4 Nov, 14:03" },
]

const ACCEPTED = ".csv,.xlsx,.xls,.docx,.doc,.pdf"
const MAX_SIZE_MB = 25

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function typeFor(value: string) {
  return FILE_TYPES.find((t) => t.value === value)
}

function StepHeading({ step, title, done }: { step: number; title: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
          done ? "bg-[#33295e] text-white" : "border border-slate-300 text-slate-600"
        }`}
        aria-hidden="true"
      >
        {done ? <Check className="h-4 w-4" /> : step}
      </span>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
    </div>
  )
}

export function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef(0)
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [recent, setRecent] = useState<RecentUpload[]>(SEED_RECENT)

  const selectedType = typeFor(fileType)
  const isUploading = status === "uploading"

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current)
    },
    [],
  )

  const resetProgress = () => {
    progressRef.current = 0
    setProgress(0)
  }

  const selectFile = (selected: File | undefined) => {
    if (!selected) return
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`${selected.name} is larger than ${MAX_SIZE_MB} MB.`)
      return
    }
    setError(null)
    setFile(selected)
    setStatus("idle")
    resetProgress()
  }

  const clearFile = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setFile(null)
    setStatus("idle")
    resetProgress()
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const startUpload = () => {
    if (!file || !fileType) return
    const uploaded = { name: file.name, size: file.size, type: fileType }
    setStatus("uploading")
    resetProgress()
    timerRef.current = setInterval(() => {
      const next = Math.min(100, progressRef.current + 8 + Math.random() * 12)
      progressRef.current = next
      setProgress(next)
      if (next >= 100) {
        if (timerRef.current) clearInterval(timerRef.current)
        setStatus("done")
        setRecent((prev) => [{ id: crypto.randomUUID(), ...uploaded, when: "Just now" }, ...prev].slice(0, 6))
      }
    }, 200)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section
        aria-labelledby="upload-heading"
        className="flex flex-col gap-8 rounded-lg border border-slate-200 bg-white p-6"
      >
        <div className="flex flex-col gap-1">
          <h1 id="upload-heading" className="text-xl font-semibold text-slate-900">
            Upload data
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            Tell us what kind of file it is, then add it from your computer.
          </p>
        </div>

        <fieldset className="flex flex-col gap-4" disabled={isUploading}>
          <legend className="sr-only">File type</legend>
          <StepHeading step={1} title="Choose a file type" done={!!fileType} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {FILE_TYPES.map((t) => {
              const Icon = t.icon
              const active = t.value === fileType
              return (
                <label
                  key={t.value}
                  className={`group relative flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#33295e] has-[:focus-visible]:ring-offset-2 ${
                    active
                      ? "border-[#33295e] bg-[#33295e] text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="upload-file-type"
                    value={t.value}
                    checked={active}
                    onChange={() => setFileType(t.value)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-md ${
                      active ? "bg-white/15" : "bg-slate-100 group-hover:bg-white"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-white" : "text-[#33295e]"}`} aria-hidden="true" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{t.label}</span>
                    <span className={`text-xs leading-snug ${active ? "text-white/75" : "text-slate-500"}`}>
                      {t.description}
                    </span>
                  </span>
                  {active && (
                    <Check className="absolute right-3 top-3 h-4 w-4 text-white" aria-hidden="true" />
                  )}
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-4">
          <StepHeading step={2} title="Add your file" done={!!file} />

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
              className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors ${
                isDragging ? "border-[#33295e] bg-[#33295e]/5" : "border-slate-300 bg-slate-50 hover:border-[#33295e]/50"
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#33295e] text-white shadow-sm">
                <UploadCloud className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-900">
                  {isDragging ? "Drop to add your file" : "Drag and drop your file here"}
                </span>
                <span className="text-sm text-slate-600">
                  or <span className="font-medium text-[#33295e] underline underline-offset-4">browse your computer</span>
                </span>
              </span>
              <span className="flex flex-wrap justify-center gap-1.5">
                {["CSV", "XLSX", "DOCX", "PDF"].map((ext) => (
                  <span key={ext} className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-500">
                    {ext}
                  </span>
                ))}
                <span className="px-1 py-0.5 text-[11px] text-slate-500">up to {MAX_SIZE_MB} MB</span>
              </span>
            </label>
          )}

          {file && (
            <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white">
                  <FileText className="h-5 w-5 text-[#33295e]" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    {formatSize(file.size)}
                    {selectedType && (
                      <span className="rounded-full bg-[#33295e]/10 px-2 py-0.5 font-medium text-[#33295e]">
                        {selectedType.label}
                      </span>
                    )}
                  </p>
                </div>
                {!isUploading && status !== "done" && (
                  <button
                    type="button"
                    onClick={clearFile}
                    aria-label={`Remove ${file.name}`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {status !== "idle" && (
                <div className="flex flex-col gap-1.5">
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                    aria-label="Upload progress"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        status === "done" ? "bg-emerald-500" : "bg-[#33295e]"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500" aria-live="polite">
                    {status === "done" ? (
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Uploaded as {selectedType?.label}
                      </span>
                    ) : (
                      `Uploading… ${Math.round(progress)}%`
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {!fileType
              ? "Choose a file type to continue."
              : !file
                ? "Add a file to continue."
                : status === "done"
                  ? "All done. You can upload another file."
                  : "Ready to upload."}
          </p>
          <div className="flex gap-2">
            {status === "done" ? (
              <Button onClick={clearFile} className="bg-[#33295e] text-white hover:bg-[#33295e]/90">
                Upload another file
              </Button>
            ) : (
              <>
                {file && (
                  <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading}>
                    Choose different file
                  </Button>
                )}
                <Button
                  onClick={startUpload}
                  disabled={isUploading || !file || !fileType}
                  className="bg-[#33295e] text-white hover:bg-[#33295e]/90"
                >
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  {isUploading ? "Uploading…" : "Upload file"}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <aside
        aria-labelledby="recent-uploads-heading"
        className="flex h-fit flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5"
      >
        <h2 id="recent-uploads-heading" className="text-sm font-semibold text-slate-900">
          Recent uploads
        </h2>
        <ul className="flex flex-col">
          {recent.map((r) => {
            const t = typeFor(r.type)
            const Icon = t?.icon ?? FileText
            return (
              <li key={r.id} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-b-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100">
                  <Icon className="h-4 w-4 text-[#33295e]" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-slate-900">{r.name}</span>
                  <span className="text-xs text-slate-500">
                    {t?.label} · {formatSize(r.size)} · {r.when}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </aside>
    </div>
  )
}
