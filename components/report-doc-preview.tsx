"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const blobCache = new Map<string, Promise<Blob>>()

/** Fetches a report file once and shares the result between every preview of it. */
export function loadReportBlob(url: string): Promise<Blob> {
  let pending = blobCache.get(url)
  if (!pending) {
    pending = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`Failed to load report (${res.status})`)
      return res.blob()
    })
    pending.catch(() => blobCache.delete(url))
    blobCache.set(url, pending)
  }
  return pending
}

export async function downloadReport(report: { name: string; url: string }) {
  const blob = await loadReportBlob(report.url)
  const href = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = href
  link.download = report.name
  link.click()
  URL.revokeObjectURL(href)
}

/**
 * Renders a Word report as a scaled-down, read-only page preview. `scale` shrinks
 * the A4 page so it fits hover cards and dialogs while keeping its real layout.
 */
export function ReportDocPreview({
  url,
  scale = 0.5,
  className,
}: {
  url: string
  scale?: number
  className?: string
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    const body = bodyRef.current
    const styles = styleRef.current
    if (!body || !styles) return
    let cancelled = false
    setStatus("loading")

    Promise.all([loadReportBlob(url), import("docx-preview")])
      .then(([blob, { renderAsync }]) =>
        renderAsync(blob, body, styles, {
          className: "docx",
          inWrapper: true,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
        }),
      )
      .then(() => {
        if (!cancelled) setStatus("ready")
      })
      .catch(() => {
        if (!cancelled) setStatus("error")
      })

    return () => {
      cancelled = true
      body.innerHTML = ""
      styles.innerHTML = ""
    }
  }, [url])

  return (
    <div className={cn("relative overflow-auto bg-slate-100", className)}>
      <div ref={styleRef} />
      <div
        ref={bodyRef}
        className="report-docx-viewer origin-top-left"
        style={{ zoom: scale }}
        aria-hidden={status !== "ready"}
      />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading report...
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs text-slate-500">
          This report couldn&apos;t be previewed. You can still download it.
        </div>
      )}
    </div>
  )
}
