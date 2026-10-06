"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, ChevronDown, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePrintQueue, type PrintJob } from "@/lib/print-queue"

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds.toString().padStart(2, "0")}s left` : `${seconds}s left`
}

function PrintJobRow({ job, now }: { job: PrintJob; now: number }) {
  const { printJob, removeJob } = usePrintQueue()
  const isReady = job.status === "ready"
  const elapsed = now - job.startedAt
  const progress = isReady ? 100 : Math.min(99, Math.round((elapsed / job.durationMs) * 100))

  return (
    <li className="flex flex-col gap-2 px-4 py-3">
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isReady ? "bg-emerald-50 text-emerald-600" : "bg-[#33295e]/10 text-[#33295e]"
          }`}
        >
          {isReady ? (
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-slate-900">{job.reportName}</span>
          <span className="text-xs text-slate-500">
            {job.pages.length} {job.pages.length === 1 ? "page" : "pages"}
            {job.archive ? " · Archiving" : ""}
            {" · "}
            {isReady ? "Ready to view" : `Generating · ${formatRemaining(job.durationMs - elapsed)}`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeJob(job.id)}
          className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label={isReady ? `Dismiss ${job.reportName}` : `Cancel ${job.reportName}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isReady ? (
        <Button
          size="sm"
          onClick={() => printJob(job.id)}
          className="ml-11 h-8 w-fit bg-[#33295e] text-white hover:bg-[#fd6d6d]"
        >
          View
        </Button>
      ) : (
        <div
          className="ml-11 h-1.5 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label={`${job.reportName} generation progress`}
        >
          <div className="h-full rounded-full bg-[#33295e] transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      )}
    </li>
  )
}

export function PrintQueueTray() {
  const { jobs, now, clearFinished } = usePrintQueue()
  const [isOpen, setIsOpen] = useState(false)
  const previousCount = useRef(jobs.length)

  // Pop the tray open whenever a new job is queued so the user sees where it went.
  useEffect(() => {
    if (jobs.length > previousCount.current) setIsOpen(true)
    previousCount.current = jobs.length
  }, [jobs.length])

  if (jobs.length === 0) return null

  const generatingCount = jobs.filter((j) => j.status === "generating").length
  const readyCount = jobs.length - generatingCount
  const summary =
    generatingCount > 0
      ? `Generating ${generatingCount} ${generatingCount === 1 ? "report" : "reports"}`
      : `${readyCount} ${readyCount === 1 ? "report" : "reports"} ready`

  return (
    <div className="fixed bottom-6 right-6 z-40 flex w-80 flex-col items-end gap-2">
      {isOpen && (
        <section
          id="print-queue-panel"
          aria-label="Download queue"
          className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
        >
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Download queue</h2>
            <div className="flex items-center gap-1">
              {readyCount > 0 && (
                <button
                  type="button"
                  onClick={clearFinished}
                  className="rounded px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  Clear ready
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Minimise download queue"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </header>
          <ul className="flex max-h-80 flex-col divide-y divide-slate-100 overflow-y-auto">
            {jobs.map((job) => (
              <PrintJobRow key={job.id} job={job} now={now} />
            ))}
          </ul>
          <p className="border-t border-slate-100 px-4 py-2 text-xs leading-relaxed text-slate-500">
            {"You can keep working — we'll alert you when each report is ready."}
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="print-queue-panel"
        className="flex items-center gap-2 rounded-full bg-[#33295e] py-2 pl-3 pr-4 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#2a2150]"
      >
        {generatingCount > 0 ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />
        )}
        <span aria-live="polite">{summary}</span>
      </button>
    </div>
  )
}
