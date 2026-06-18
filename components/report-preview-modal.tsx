"use client"

import { X, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Report {
  id: string
  name: string
  description: string
  category: string
  frequency: string
  lastGenerated?: string
  qnaActive?: boolean
}

interface ReportPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  report: Report | null
  onSelectReport: (report: Report) => void
}

export function ReportPreviewModal({ isOpen, onClose, report, onSelectReport }: ReportPreviewModalProps) {
  if (!isOpen || !report) return null

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "annual":
        return "bg-blue-100 text-blue-800"
      case "termly":
        return "bg-green-100 text-green-800"
      case "half-termly":
        return "bg-orange-100 text-orange-800"
      case "monthly":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Mock preview content based on report type
  const getPreviewContent = () => {
    switch (report.category) {
      case "School Improvement":
        return {
          sections: [
            "Executive Summary",
            "Self-Evaluation Overview",
            "Academic Performance Analysis",
            "Key Priorities Progress",
            "Areas for Development",
            "Action Plans",
            "Success Measures",
          ],
          dataFeeds: [
            {
              source: "Assessment Data System",
              lastRefresh: "2024-03-20 08:30",
              description: "KS1/KS2 results, progress scores, attainment data",
            },
            {
              source: "School Information Management System",
              lastRefresh: "2024-03-20 09:15",
              description: "Pupil demographics, SEND data, pupil premium eligibility",
            },
            {
              source: "Self-Evaluation Forms",
              lastRefresh: "2024-03-19 16:45",
              description: "Leadership judgements, priority ratings, evidence base",
            },
            {
              source: "Staff Performance Data",
              lastRefresh: "2024-03-18 14:20",
              description: "Teaching quality ratings, CPD records, appraisal outcomes",
            },
          ],
        }
      case "Governor Reporting":
        return {
          sections: [
            "Headteacher's Summary",
            "Academic Performance",
            "Financial Overview",
            "Safeguarding Update",
            "Staff & Governance",
            "Risk Management",
            "Strategic Priorities",
          ],
          dataFeeds: [
            {
              source: "Financial Management System",
              lastRefresh: "2024-03-20 07:00",
              description: "Budget position, expenditure, income, forecasts",
            },
            {
              source: "HR Management System",
              lastRefresh: "2024-03-19 18:30",
              description: "Staff records, recruitment, retention, absence data",
            },
            {
              source: "Safeguarding Database",
              lastRefresh: "2024-03-20 09:00",
              description: "Incident reports, training records, policy updates",
            },
            {
              source: "Governance Portal",
              lastRefresh: "2024-03-17 15:45",
              description: "Meeting minutes, action plans, compliance tracking",
            },
          ],
        }
      case "Attendance & Welfare":
        return {
          sections: [
            "Attendance Overview",
            "Persistent Absence Analysis",
            "Behaviour Incidents",
            "Intervention Strategies",
            "Welfare Support",
            "Trends & Patterns",
            "Action Plans",
          ],
          dataFeeds: [
            {
              source: "Attendance Management System",
              lastRefresh: "2024-03-20 08:45",
              description: "Daily attendance, absence codes, patterns, trends",
            },
            {
              source: "Behaviour Management System",
              lastRefresh: "2024-03-20 09:30",
              description: "Incident logs, sanctions, rewards, intervention records",
            },
            {
              source: "Pastoral Care Database",
              lastRefresh: "2024-03-19 17:15",
              description: "Welfare concerns, family support, external agency involvement",
            },
            {
              source: "Early Help System",
              lastRefresh: "2024-03-19 14:00",
              description: "Support plans, referrals, outcomes tracking",
            },
          ],
        }
      case "Statutory & Compliance":
        return {
          sections: [
            "Compliance Overview",
            "Statutory Returns",
            "Policy Updates",
            "Audit Findings",
            "Risk Assessment",
            "Action Plans",
          ],
          dataFeeds: [
            {
              source: "DfE Census System",
              lastRefresh: "2024-03-15 10:00",
              description: "Pupil census, staff census, financial returns",
            },
            {
              source: "SEND Information System",
              lastRefresh: "2024-03-18 11:30",
              description: "EHCP data, provision mapping, outcomes tracking",
            },
            {
              source: "Health & Safety Database",
              lastRefresh: "2024-03-19 13:45",
              description: "Risk assessments, incident reports, training records",
            },
            {
              source: "Data Protection System",
              lastRefresh: "2024-03-20 08:00",
              description: "GDPR compliance, data audits, breach reports",
            },
          ],
        }
      default:
        return {
          sections: [
            "Executive Summary",
            "Key Findings",
            "Data Analysis",
            "Recommendations",
            "Action Plans",
            "Appendices",
          ],
          dataFeeds: [
            {
              source: "Performance Analytics Platform",
              lastRefresh: "2024-03-20 06:00",
              description: "Cross-school comparisons, benchmark data, trend analysis",
            },
            {
              source: "Teaching & Learning System",
              lastRefresh: "2024-03-19 16:00",
              description: "Lesson observations, pupil progress, curriculum coverage",
            },
            {
              source: "External Data Sources",
              lastRefresh: "2024-03-18 12:00",
              description: "National statistics, local authority data, inspection outcomes",
            },
          ],
        }
    }
  }

  const previewContent = getPreviewContent()

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">{report.name}</h2>
            </div>
            <p className="text-slate-600 mb-3">{report.description}</p>

            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={getFrequencyColor(report.frequency)} variant="secondary">
                {report.frequency}
              </Badge>
              <Badge
                className={report.qnaActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                variant="secondary"
              >
                Q&A {report.qnaActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline">{report.category}</Badge>
              {report.lastGenerated && (
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Structure */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Structure</h3>
              <div className="space-y-2">
                {previewContent.sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <span className="text-slate-700">{section}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Front Page Preview */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Front Page</h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-white p-6 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">MAT</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-600">
                      <div>Generated: {new Date().toLocaleDateString()}</div>
                      <div className="mt-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{report.category}</div>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h1 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{report.name}</h1>
                    <p className="text-sm text-slate-600 mb-4">St Clare Catholic Multi Academy Trust</p>

                    {/* Key Info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reporting Period:</span>
                        <span className="text-slate-700">Academic Year 2024/25</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Frequency:</span>
                        <span className="text-slate-700">{report.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Q&A Status:</span>
                        <span className={report.qnaActive ? "text-green-700" : "text-slate-700"}>
                          {report.qnaActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>Confidential Report</span>
                      <span>Page 1 of 12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Data Feeds */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Live Data Feeds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previewContent.dataFeeds.map((feed, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{feed.source}</h4>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Live</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{feed.description}</p>
                  <div className="text-xs text-slate-500">
                    Last refreshed: {new Date(feed.lastRefresh).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Features */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Report Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-blue-800">Interactive charts and visualizations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-blue-800">Customizable filtering options</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-blue-800">Export to PDF and Excel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-blue-800">Historical trend analysis</span>
              </div>
              {report.qnaActive && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-green-800">Q&A functionality enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-green-800">Interactive data exploration</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            This preview shows the structure and sample content for this report type.
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button onClick={() => onSelectReport(report)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Select This Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
