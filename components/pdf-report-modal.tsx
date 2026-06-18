"use client"

import { useState } from "react"
import { X, Download, Printer, Share2, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PDFReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportName: string
  reportConfig: {
    scope: string
    school?: string
    attendanceCutoff?: string
    characteristics?: string
  }
}

export function PDFReportModal({ isOpen, onClose, reportName, reportConfig }: PDFReportModalProps) {
  const [zoom, setZoom] = useState(100)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 12 // Mock total pages

  if (!isOpen) return null

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200))
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50))

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">{reportName}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
              <span>Scope: {reportConfig.scope}</span>
              {reportConfig.school && <span>School: {reportConfig.school}</span>}
              {reportConfig.attendanceCutoff && <span>Cutoff: {reportConfig.attendanceCutoff}</span>}
              <span>Generated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mr-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* PDF Viewer Controls */}
        <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
              <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 min-w-[60px] text-center">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center gap-2 border-l border-slate-300 pl-4">
              <Button variant="outline" size="sm">
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Fit Options */}
          <div className="flex items-center gap-2">
            <Button variant={zoom === 100 ? "default" : "outline"} size="sm" onClick={() => setZoom(100)}>
              Fit Width
            </Button>
            <Button variant={zoom === 75 ? "default" : "outline"} size="sm" onClick={() => setZoom(75)}>
              Fit Page
            </Button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 overflow-auto bg-slate-100 p-4">
          <div className="flex justify-center">
            <div
              className="bg-white shadow-lg"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                width: "210mm", // A4 width
                minHeight: "297mm", // A4 height
              }}
            >
              {/* Mock PDF Content */}
              <div className="p-8">
                {/* Report Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-200">
                  <div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">MAT</span>
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">{reportName}</h1>
                    <p className="text-slate-600">St Clare Catholic Multi Academy Trust</p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <div>Generated: {new Date().toLocaleDateString()}</div>
                    <div>
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="mt-2">
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {reportConfig.scope}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Executive Summary</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-medium text-green-900 mb-2">Overall Performance</h3>
                        <div className="text-2xl font-bold text-green-600">Good</div>
                        <p className="text-sm text-green-700">
                          School demonstrates consistent performance across key areas with evidence of continuous
                          improvement.
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">Key Strengths</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Strong leadership and governance</li>
                          <li>• Effective curriculum implementation</li>
                          <li>• Positive pupil outcomes</li>
                          <li>• Robust safeguarding procedures</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h3 className="font-medium text-amber-900 mb-2">Areas for Development</h3>
                        <ul className="text-sm text-amber-700 space-y-1">
                          <li>• Attendance improvement strategies</li>
                          <li>• SEND provision enhancement</li>
                          <li>• Staff development programs</li>
                          <li>• Community engagement</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h3 className="font-medium text-slate-900 mb-2">Next Steps</h3>
                        <ul className="text-sm text-slate-700 space-y-1">
                          <li>• Implement attendance action plan</li>
                          <li>• Review SEND support structures</li>
                          <li>• Expand CPD opportunities</li>
                          <li>• Strengthen parent partnerships</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Key Performance Indicators</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Overall Attendance", value: "94.1%", trend: "+0.3%", color: "green" },
                      { label: "Academic Progress", value: "Good", trend: "Stable", color: "blue" },
                      { label: "Behaviour Rating", value: "2", trend: "Improved", color: "green" },
                      { label: "Staff Retention", value: "92%", trend: "+5%", color: "green" },
                    ].map((metric, index) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg text-center">
                        <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
                        <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
                        <div className={`text-xs ${metric.color === "green" ? "text-green-600" : "text-blue-600"}`}>
                          {metric.trend}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Charts and Data Visualization */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Performance Trends</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h3 className="font-medium text-slate-900 mb-3">Attendance Trends</h3>
                      <div className="h-32 bg-slate-100 rounded flex items-center justify-center">
                        <span className="text-slate-500 text-sm">📊 Attendance Chart</span>
                      </div>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-lg">
                      <h3 className="font-medium text-slate-900 mb-3">Academic Progress</h3>
                      <div className="h-32 bg-slate-100 rounded flex items-center justify-center">
                        <span className="text-slate-500 text-sm">📈 Progress Chart</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-4 border-t border-slate-200 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <div>
                      <div>Report Configuration:</div>
                      <div>Scope: {reportConfig.scope}</div>
                      {reportConfig.school && <div>School: {reportConfig.school}</div>}
                      {reportConfig.characteristics && <div>Characteristics: {reportConfig.characteristics}</div>}
                    </div>
                    <div className="text-right">
                      <div>Generated by MATpad</div>
                      <div>{new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
