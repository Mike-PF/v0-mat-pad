"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle2, ShieldCheck, Calendar, Clock, User, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Report {
  id: string
  name: string
  description: string
  category: string
  frequency: string
  lastGenerated?: string
  qnaActive?: boolean
}

interface SignOffRecord {
  reportId: string
  reportName: string
  user: string
  signedAt: string // ISO string
}

interface ReportSignOffModalProps {
  isOpen: boolean
  onClose: () => void
  report: Report | null
  currentUser: string
  existingSignOff?: SignOffRecord | null
  onConfirm: (record: SignOffRecord) => void
}

export function ReportSignOffModal({
  isOpen,
  onClose,
  report,
  currentUser,
  existingSignOff = null,
  onConfirm,
}: ReportSignOffModalProps) {
  const [acknowledged, setAcknowledged] = useState(false)
  // Snapshot the "now" moment when the modal opens so the displayed time is
  // stable and matches what gets recorded on confirm.
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    if (isOpen) {
      setNow(new Date())
      setAcknowledged(false)
    }
  }, [isOpen])

  if (!isOpen || !report) return null

  const isSignedOff = Boolean(existingSignOff)
  const displayDate = existingSignOff ? new Date(existingSignOff.signedAt) : now
  const signatory = existingSignOff?.user ?? currentUser

  const handleConfirm = () => {
    if (!acknowledged || isSignedOff) return
    onConfirm({
      reportId: report.id,
      reportName: report.name,
      user: currentUser,
      signedAt: now.toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Sign off report</h2>
              <p className="text-sm text-slate-600">{report.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
          {/* PDF preview */}
          <div className="flex-1 overflow-auto bg-slate-100 p-4">
            <div className="mx-auto max-w-[210mm] bg-white shadow-lg">
              <div className="p-8">
                {/* Report header */}
                <div className="mb-8 flex items-center justify-between border-b-2 border-slate-200 pb-4">
                  <div>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                        <span className="text-xs font-bold text-white">MAT</span>
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{report.name}</h1>
                    <p className="text-slate-600">St Clare Catholic Multi Academy Trust</p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <div>Generated: {new Date().toLocaleDateString()}</div>
                    <div className="mt-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                        {report.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Watermark-style sign-off banner on the document */}
                {isSignedOff && (
                  <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <p className="text-sm text-green-800">
                      Signed off by <span className="font-medium">{signatory}</span> on{" "}
                      {displayDate.toLocaleDateString()} at{" "}
                      {displayDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                )}

                {/* Executive summary */}
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">Executive Summary</h2>
                  <p className="mb-4 text-sm leading-relaxed text-slate-700">
                    {report.description} This report consolidates the latest available data across the trust to support
                    informed decision making and oversight.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-green-50 p-4">
                      <h3 className="mb-2 font-medium text-green-900">Overall Performance</h3>
                      <div className="text-2xl font-bold text-green-600">Good</div>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <h3 className="mb-2 font-medium text-blue-900">Reporting Period</h3>
                      <div className="text-lg font-semibold text-blue-700">Academic Year 2024/25</div>
                    </div>
                  </div>
                </div>

                {/* Key metrics */}
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold text-slate-900">Key Performance Indicators</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Overall Attendance", value: "94.1%" },
                      { label: "Academic Progress", value: "Good" },
                      { label: "Behaviour Rating", value: "2" },
                      { label: "Staff Retention", value: "92%" },
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-lg border border-slate-200 p-4 text-center">
                        <div className="mb-1 text-xs text-slate-600">{metric.label}</div>
                        <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-12 border-t border-slate-200 pt-4 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Confidential Report · {report.frequency}</span>
                    <span>Generated by MATpad · {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sign-off panel */}
          <div className="w-full flex-shrink-0 overflow-auto border-t border-slate-200 bg-white p-6 lg:w-80 lg:border-l lg:border-t-0">
            <h3 className="mb-1 text-base font-semibold text-slate-900">Confirm sign off</h3>
            <p className="mb-6 text-sm text-slate-600">
              Review the report on the left, then confirm your sign off. This will be recorded against your name.
            </p>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Signed off by</div>
                  <div className="text-sm font-medium text-slate-900">{signatory}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Date</div>
                  <div className="text-sm font-medium text-slate-900">
                    {displayDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Time</div>
                  <div className="text-sm font-medium text-slate-900">
                    {displayDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>

            {isSignedOff ? (
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                <span className="text-sm font-medium text-green-800">This report has been signed off.</span>
              </div>
            ) : (
              <>
                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700">
                    I confirm I have reviewed this report and approve it for sign off.
                  </span>
                </label>

                <Button
                  onClick={handleConfirm}
                  disabled={!acknowledged}
                  className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Confirm sign off
                </Button>
              </>
            )}

            <Button variant="outline" onClick={onClose} className="mt-2 w-full bg-transparent">
              {isSignedOff ? "Close" : "Cancel"}
            </Button>

            <div className="mt-4 flex items-center justify-center">
              <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                <Download className="mr-1.5 h-3 w-3" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
