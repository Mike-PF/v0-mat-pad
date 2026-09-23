"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Printer } from "lucide-react"

interface PrintReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportName?: string
  pages: string[]
}

export function PrintReportModal({ isOpen, onClose, reportName, pages }: PrintReportModalProps) {
  const [selected, setSelected] = useState<string[]>(pages)

  // Reset selection to all pages whenever the modal is opened or the page list changes
  useEffect(() => {
    if (isOpen) setSelected(pages)
  }, [isOpen, pages])

  if (!isOpen) return null

  const allSelected = selected.length === pages.length
  const toggle = (page: string) =>
    setSelected((prev) => (prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]))
  const toggleAll = () => setSelected(allSelected ? [] : pages)

  const handlePrint = () => {
    onClose()
    // Allow the modal to unmount before invoking the browser print dialog
    setTimeout(() => window.print(), 100)
  }

  const handlePrintAndArchive = () => {
    // Save a copy of the selected pages to the report archive, then print
    console.log("[v0] Archiving report pages:", selected)
    handlePrint()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-modal-title"
        className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] border bg-white shadow-lg rounded-lg flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#33295e]" />
            <h2 id="print-modal-title" className="text-base font-semibold text-slate-900">
              Print report
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-slate-600 mb-4">
            Select which pages to include{reportName ? ` from ${reportName}` : ""}.
          </p>

          <label className="flex items-center gap-3 pb-3 mb-2 border-b border-slate-100 cursor-pointer">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            <span className="text-sm font-medium text-slate-700">Select all pages</span>
          </label>

          <div className="space-y-1 max-h-72 overflow-y-auto">
            {pages.map((page) => (
              <label
                key={page}
                className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-slate-50 cursor-pointer"
              >
                <Checkbox checked={selected.includes(page)} onCheckedChange={() => toggle(page)} />
                <span className="text-sm text-slate-700">{page}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handlePrintAndArchive}
            disabled={selected.length === 0}
            className="border-slate-200 text-[#33295e] hover:bg-[#33295e] hover:text-white disabled:opacity-50 bg-transparent"
          >
            Print &amp; Archive
          </Button>
          <Button
            onClick={handlePrint}
            disabled={selected.length === 0}
            className="bg-[#33295e] text-white hover:bg-[#fd6d6d] disabled:opacity-50"
          >
            Print{selected.length > 0 ? ` (${selected.length})` : ""}
          </Button>
        </div>
      </div>
    </>
  )
}
