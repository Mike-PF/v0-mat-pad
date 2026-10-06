"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/toast"
import { PrintQueueTray } from "@/components/print-queue-tray"

export type PrintJobStatus = "generating" | "ready"

export interface PrintJob {
  id: string
  reportName: string
  pages: string[]
  archive: boolean
  startedAt: number
  durationMs: number
  status: PrintJobStatus
}

interface PrintQueueContextValue {
  jobs: PrintJob[]
  now: number
  addJob: (job: { reportName: string; pages: string[]; archive: boolean }) => void
  removeJob: (id: string) => void
  clearFinished: () => void
  printJob: (id: string) => void
}

// Jobs live in sessionStorage so generation keeps running across full-page navigations.
const STORAGE_KEY = "fuze:print-queue"
const MIN_GENERATION_MS = 5_000
const MAX_GENERATION_MS = 10_000

const PrintQueueContext = createContext<PrintQueueContextValue | null>(null)

export function usePrintQueue() {
  const ctx = useContext(PrintQueueContext)
  if (!ctx) throw new Error("usePrintQueue must be used within a PrintQueueProvider")
  return ctx
}

function readStoredJobs(): PrintJob[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PrintJob[]) : []
  } catch {
    return []
  }
}

export function PrintQueueProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast()
  const [jobs, setJobs] = useState<PrintJob[]>([])
  const [now, setNow] = useState(() => Date.now())
  const [hydrated, setHydrated] = useState(false)
  const jobsRef = useRef(jobs)
  jobsRef.current = jobs

  useEffect(() => {
    setJobs(readStoredJobs())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  }, [jobs, hydrated])

  const printJob = useCallback((id: string) => {
    const job = jobsRef.current.find((j) => j.id === id)
    if (!job || job.status !== "ready") return
    setTimeout(() => window.print(), 100)
  }, [])

  const hasGenerating = jobs.some((j) => j.status === "generating")

  useEffect(() => {
    if (!hasGenerating) return
    const tick = () => {
      const current = Date.now()
      setNow(current)
      const finished = jobsRef.current.filter(
        (j) => j.status === "generating" && current - j.startedAt >= j.durationMs,
      )
      if (finished.length === 0) return
      const finishedIds = new Set(finished.map((j) => j.id))
      setJobs((prev) => prev.map((j) => (finishedIds.has(j.id) ? { ...j, status: "ready" } : j)))
      finished.forEach((job) => {
        showToast({
          variant: "success",
          title: "Report ready to view",
          message: `${job.reportName} has finished generating${job.archive ? " and was saved to the archive" : ""}.`,
          primaryAction: { label: "View", onClick: () => printJob(job.id) },
          duration: 0,
        })
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [hasGenerating, showToast, printJob])

  const addJob = useCallback(
    ({ reportName, pages, archive }: { reportName: string; pages: string[]; archive: boolean }) => {
      const durationMs = MIN_GENERATION_MS + Math.random() * (MAX_GENERATION_MS - MIN_GENERATION_MS)
      const startedAt = Date.now()
      setNow(startedAt)
      setJobs((prev) => [
        { id: `print-${startedAt}`, reportName, pages, archive, startedAt, durationMs, status: "generating" },
        ...prev,
      ])
    },
    [],
  )

  const removeJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }, [])

  const clearFinished = useCallback(() => {
    setJobs((prev) => prev.filter((j) => j.status !== "ready"))
  }, [])

  return (
    <PrintQueueContext.Provider value={{ jobs, now, addJob, removeJob, clearFinished, printJob }}>
      {children}
      <PrintQueueTray />
    </PrintQueueContext.Provider>
  )
}
