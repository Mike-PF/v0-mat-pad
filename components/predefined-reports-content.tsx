"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, FileText, Eye, Download, Search, X } from "lucide-react"
import { PDFReportModal } from "@/components/pdf-report-modal"
import { ReportPreviewModal } from "@/components/report-preview-modal"

interface Report {
  id: string
  name: string
  description: string
  category: string
  frequency: string
  lastGenerated?: string
  qnaActive?: boolean
}

interface ReportCategory {
  id: string
  name: string
  description: string
  reports: Report[]
}

export function PredefinedReportsContent() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedScope, setSelectedScope] = useState("")
  const [attendanceCutoff, setAttendanceCutoff] = useState("")
  const [selectedCharacteristics, setSelectedCharacteristics] = useState("")
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewReport, setPreviewReport] = useState<Report | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [dateRangeType, setDateRangeType] = useState("")
  const [selectedTermDate, setSelectedTermDate] = useState("")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  const reportCategories: ReportCategory[] = [
    {
      id: "school-improvement",
      name: "School Improvement",
      description: "Reports focused on academic performance and improvement planning",
      reports: [
        {
          id: "si-1",
          name: "School Self-Evaluation Summary",
          description: "Comprehensive overview of school's self-evaluation across all key areas",
          category: "School Improvement",
          frequency: "Termly",
          lastGenerated: "2024-03-15",
          qnaActive: true,
        },
        {
          id: "si-2",
          name: "Academic Performance Analysis",
          description: "Detailed analysis of pupil outcomes and progress data",
          category: "School Improvement",
          frequency: "Annual",
          lastGenerated: "2024-02-28",
          qnaActive: false,
        },
        {
          id: "si-3",
          name: "Key Priorities Progress Report",
          description: "Progress tracking against school improvement priorities",
          category: "School Improvement",
          frequency: "Half-termly",
          lastGenerated: "2024-03-10",
          qnaActive: true,
        },
        {
          id: "si-4",
          name: "Curriculum Impact Assessment",
          description: "Evaluation of curriculum implementation and pupil outcomes",
          category: "School Improvement",
          frequency: "Annual",
          lastGenerated: "2024-01-20",
          qnaActive: false,
        },
      ],
    },
    {
      id: "governor-reporting",
      name: "Governor Reporting",
      description: "Reports specifically designed for governing body meetings and oversight",
      reports: [
        {
          id: "gr-1",
          name: "Headteacher's Report to Governors",
          description: "Comprehensive termly report covering all aspects of school performance",
          category: "Governor Reporting",
          frequency: "Termly",
          lastGenerated: "2024-03-12",
          qnaActive: true,
        },
        {
          id: "gr-2",
          name: "Safeguarding Annual Report",
          description: "Annual safeguarding overview for governing body review",
          category: "Governor Reporting",
          frequency: "Annual",
          lastGenerated: "2024-02-15",
          qnaActive: false,
        },
        {
          id: "gr-3",
          name: "Financial Performance Summary",
          description: "Budget monitoring and financial performance overview",
          category: "Governor Reporting",
          frequency: "Termly",
          lastGenerated: "2024-03-08",
          qnaActive: true,
        },
        {
          id: "gr-4",
          name: "Pupil Premium Impact Report",
          description: "Analysis of pupil premium spending and impact on outcomes",
          category: "Governor Reporting",
          frequency: "Annual",
          lastGenerated: "2024-01-25",
          qnaActive: false,
        },
      ],
    },
    {
      id: "attendance-welfare",
      name: "Attendance & Welfare",
      description: "Reports focusing on pupil attendance, behaviour, and welfare",
      reports: [
        {
          id: "aw-1",
          name: "Attendance Analysis Report",
          description: "Comprehensive attendance data analysis with trends and interventions",
          category: "Attendance & Welfare",
          frequency: "Monthly",
          lastGenerated: "2024-03-18",
          qnaActive: true,
        },
        {
          id: "aw-2",
          name: "Persistent Absence Report",
          description: "Detailed analysis of persistent absence patterns and support strategies",
          category: "Attendance & Welfare",
          frequency: "Half-termly",
          lastGenerated: "2024-03-14",
          qnaActive: false,
        },
        {
          id: "aw-3",
          name: "Behaviour Incidents Summary",
          description: "Overview of behaviour incidents, patterns, and interventions",
          category: "Attendance & Welfare",
          frequency: "Termly",
          lastGenerated: "2024-03-11",
          qnaActive: true,
        },
        {
          id: "aw-4",
          name: "Suspension and Exclusion Report",
          description: "Analysis of disciplinary actions and their effectiveness",
          category: "Attendance & Welfare",
          frequency: "Termly",
          lastGenerated: "2024-03-09",
          qnaActive: false,
        },
      ],
    },
    {
      id: "statutory-compliance",
      name: "Statutory & Compliance",
      description: "Reports required for statutory returns and compliance monitoring",
      reports: [
        {
          id: "sc-1",
          name: "Census Data Report",
          description: "School census data compilation for DfE submission",
          category: "Statutory & Compliance",
          frequency: "Termly",
          lastGenerated: "2024-03-01",
          qnaActive: true,
        },
        {
          id: "sc-2",
          name: "SEND Provision Report",
          description: "Special educational needs provision and outcomes report",
          category: "Statutory & Compliance",
          frequency: "Annual",
          lastGenerated: "2024-02-20",
          qnaActive: false,
        },
        {
          id: "sc-3",
          name: "Health & Safety Audit Report",
          description: "Comprehensive health and safety compliance overview",
          category: "Statutory & Compliance",
          frequency: "Annual",
          lastGenerated: "2024-01-30",
          qnaActive: true,
        },
        {
          id: "sc-4",
          name: "Data Protection Compliance Report",
          description: "GDPR compliance and data protection measures review",
          category: "Statutory & Compliance",
          frequency: "Annual",
          lastGenerated: "2024-01-15",
          qnaActive: false,
        },
      ],
    },
    {
      id: "performance-analytics",
      name: "Performance Analytics",
      description: "Data-driven reports for performance monitoring and analysis",
      reports: [
        {
          id: "pa-1",
          name: "Multi-Academy Trust Overview",
          description: "Cross-school performance comparison and MAT-wide analysis",
          category: "Performance Analytics",
          frequency: "Termly",
          lastGenerated: "2024-03-16",
          qnaActive: true,
        },
        {
          id: "pa-2",
          name: "Pupil Progress Tracking Report",
          description: "Individual and cohort progress tracking across subjects",
          category: "Performance Analytics",
          frequency: "Half-termly",
          lastGenerated: "2024-03-13",
          qnaActive: false,
        },
        {
          id: "pa-3",
          name: "Teaching Quality Analysis",
          description: "Analysis of teaching effectiveness and professional development needs",
          category: "Performance Analytics",
          frequency: "Annual",
          lastGenerated: "2024-02-10",
          qnaActive: true,
        },
        {
          id: "pa-4",
          name: "Benchmark Comparison Report",
          description: "Performance comparison against national and local benchmarks",
          category: "Performance Analytics",
          frequency: "Annual",
          lastGenerated: "2024-01-28",
          qnaActive: false,
        },
      ],
    },
  ]

  // Filter reports based on search query
  const filteredCategories = reportCategories
    .map((category) => ({
      ...category,
      reports: category.reports.filter(
        (report) =>
          searchQuery === "" ||
          report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.frequency.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.reports.length > 0)

  const schools = [
    "All Saints' Catholic High School",
    "Emmaus Catholic and CofE Primary School",
    "Notre Dame High School",
    "Sacred Heart School, A Catholic Voluntary Academy",
    "St Thomas of Canterbury School, a Catholic Voluntary Academy",
    "St Wilfrid's Catholic Primary School",
    "St Marie's School, A Catholic Voluntary Academy",
    "St John Fisher Primary, A Catholic Voluntary Academy",
    "St Mary's Primary School, A Catholic Voluntary Academy",
    "St Ann's Catholic Primary School, A Voluntary Academy",
    "St Catherine's Catholic Primary School (Hallam)",
    "St Alban's Catholic Primary and Nursery School",
    "Holy Trinity Catholic and Church of England School",
  ]

  const scopeOptions = [
    "Whole MAT",
    "Primary Phase",
    "Secondary Phase",
    ...schools, // Spread individual schools
  ]

  const attendanceCutoffs = ["90%", "85%", "80%", "75%", "70%", "Custom"]

  const characteristicsOptions = [
    "All Pupils",
    "Pupil Premium",
    "SEND Support",
    "EHCP",
    "EAL",
    "Looked After Children",
    "Young Carers",
    "Service Children",
  ]

  const termDates = [
    { id: "autumn1-2024", label: "Autumn Term 1 2024/25", start: "2024-09-02", end: "2024-10-25" },
    { id: "autumn2-2024", label: "Autumn Term 2 2024/25", start: "2024-11-04", end: "2024-12-20" },
    { id: "spring1-2025", label: "Spring Term 1 2024/25", start: "2025-01-06", end: "2025-02-14" },
    { id: "spring2-2025", label: "Spring Term 2 2024/25", start: "2025-02-24", end: "2025-04-04" },
    { id: "summer1-2025", label: "Summer Term 1 2024/25", start: "2025-04-22", end: "2025-05-23" },
    { id: "summer2-2025", label: "Summer Term 2 2024/25", start: "2025-06-02", end: "2025-07-18" },
    { id: "full-year-2024", label: "Full Academic Year 2024/25", start: "2024-09-02", end: "2025-07-18" },
    { id: "ytd-2024", label: "Year to Date 2024/25", start: "2024-09-02", end: new Date().toISOString().split("T")[0] },
  ]

  const dateRangeTypes = ["Term Dates", "Custom Date Range", "Academic Year", "Calendar Year"]

  const handleReportSelect = (report: Report) => {
    setSelectedReport(report)
    // Reset filters when selecting a new report
    setSelectedSchool("")
    setSelectedScope("")
    setAttendanceCutoff("")
    setSelectedCharacteristics("")
    setDateRangeType("")
    setSelectedTermDate("")
    setCustomStartDate("")
    setCustomEndDate("")
  }

  const canViewReport = () => {
    if (!selectedReport) return false

    // Basic filters that are always required
    if (!selectedScope) return false

    // If scope is individual school, school selection is required
    if (selectedScope === "Individual School" && !selectedSchool) return false

    // For attendance reports, cutoff and date range are required
    if (selectedReport.category === "Attendance & Welfare") {
      if (!attendanceCutoff) return false
      if (!dateRangeType) return false

      if (dateRangeType === "Term Dates" && !selectedTermDate) return false
      if (dateRangeType === "Custom Date Range" && (!customStartDate || !customEndDate)) return false
    }

    return true
  }

  const handleViewReport = () => {
    if (canViewReport()) {
      setShowPDFModal(true)
    }
  }

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

  const handlePreviewReport = (report: Report) => {
    setPreviewReport(report)
    setShowPreviewModal(true)
  }

  return (
    <div className="h-full bg-slate-50 overflow-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Column - Report Categories and Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Predefined Reports</CardTitle>
              <p className="text-sm text-slate-600 mb-4">
                Select from our library of pre-built reports designed for different stakeholders and purposes
              </p>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search reports by name, description, category, or frequency..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>

              {/* Search Results Summary */}
              {searchQuery && (
                <div className="mt-2 text-sm text-slate-600">
                  {filteredCategories.reduce((total, category) => total + category.reports.length, 0) === 0 ? (
                    <span className="text-red-600">No reports found matching "{searchQuery}"</span>
                  ) : (
                    <span>
                      Found {filteredCategories.reduce((total, category) => total + category.reports.length, 0)}{" "}
                      report(s) matching "{searchQuery}" across {filteredCategories.length} category(ies)
                    </span>
                  )}
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Report Categories */}
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                    </div>
                    <Badge variant="outline">{category.reports.length} reports</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {category.reports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedReport?.id === report.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => handleReportSelect(report)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-slate-600" />
                              <h4 className="font-medium text-slate-900">{report.name}</h4>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{report.description}</p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge className={getFrequencyColor(report.frequency)} variant="secondary">
                                {report.frequency}
                              </Badge>
                              <Badge
                                className={
                                  report.qnaActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }
                                variant="secondary"
                              >
                                Q&A {report.qnaActive ? "Active" : "Inactive"}
                              </Badge>
                              {report.lastGenerated && (
                                <span className="text-xs text-slate-500">
                                  Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {/* Preview Button */}
                            <div className="mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePreviewReport(report)
                                }}
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Preview
                              </Button>
                            </div>
                          </div>
                          {selectedReport?.id === report.id && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ml-4">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* No Results State */}
            {searchQuery && filteredCategories.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No reports found</h3>
                  <p className="text-slate-600 mb-4">
                    We couldn't find any reports matching "{searchQuery}". Try adjusting your search terms.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Filters and Actions */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Report Configuration</CardTitle>
              {selectedReport ? (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">{selectedReport.name}</span>
                  </div>
                  <p className="text-sm text-blue-700">{selectedReport.description}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-600">Select a report to configure filters and generate</p>
              )}
            </CardHeader>

            {selectedReport && (
              <CardContent className="space-y-4">
                {/* Scope Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Report Scope <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedScope}
                      onChange={(e) => setSelectedScope(e.target.value)}
                      className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select scope...</option>
                      {scopeOptions.map((scope) => (
                        <option key={scope} value={scope}>
                          {scope}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* School Selection - only show if Individual School is selected */}
                {selectedScope === "Individual School" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select School <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                        className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select school...</option>
                        {schools.map((school) => (
                          <option key={school} value={school}>
                            {school}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Attendance Cutoff - only show for attendance reports */}
                {selectedReport.category === "Attendance & Welfare" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Attendance Cutoff <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={attendanceCutoff}
                        onChange={(e) => setAttendanceCutoff(e.target.value)}
                        className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select cutoff...</option>
                        {attendanceCutoffs.map((cutoff) => (
                          <option key={cutoff} value={cutoff}>
                            {cutoff}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Date Range Selection - only show for attendance reports */}
                {selectedReport.category === "Attendance & Welfare" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date Range Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={dateRangeType}
                          onChange={(e) => {
                            setDateRangeType(e.target.value)
                            // Reset date selections when type changes
                            setSelectedTermDate("")
                            setCustomStartDate("")
                            setCustomEndDate("")
                          }}
                          className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select date range type...</option>
                          {dateRangeTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Term Dates Selection */}
                    {dateRangeType === "Term Dates" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Select Term <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={selectedTermDate}
                            onChange={(e) => setSelectedTermDate(e.target.value)}
                            className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select term...</option>
                            {termDates.map((term) => (
                              <option key={term.id} value={term.id}>
                                {term.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                        {selectedTermDate && (
                          <div className="mt-2 text-xs text-slate-600">
                            {(() => {
                              const term = termDates.find((t) => t.id === selectedTermDate)
                              return term
                                ? `${new Date(term.start).toLocaleDateString()} - ${new Date(term.end).toLocaleDateString()}`
                                : ""
                            })()}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Custom Date Range */}
                    {dateRangeType === "Custom Date Range" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Start Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            End Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {customStartDate && customEndDate && (
                          <div className="col-span-2 text-xs text-slate-600">
                            Duration: {(() => {
                              const start = new Date(customStartDate)
                              const end = new Date(customEndDate)
                              const diffTime = Math.abs(end.getTime() - start.getTime())
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                              return `${diffDays} days`
                            })()}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Academic Year Selection */}
                    {dateRangeType === "Academic Year" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Academic Year <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={selectedTermDate}
                            onChange={(e) => setSelectedTermDate(e.target.value)}
                            className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select academic year...</option>
                            <option value="2024-25">2024/25 Academic Year</option>
                            <option value="2023-24">2023/24 Academic Year</option>
                            <option value="2022-23">2022/23 Academic Year</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    )}

                    {/* Calendar Year Selection */}
                    {dateRangeType === "Calendar Year" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Calendar Year <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={selectedTermDate}
                            onChange={(e) => setSelectedTermDate(e.target.value)}
                            className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select calendar year...</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Pupil Characteristics */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pupil Characteristics</label>
                  <div className="relative">
                    <select
                      value={selectedCharacteristics}
                      onChange={(e) => setSelectedCharacteristics(e.target.value)}
                      className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All pupils...</option>
                      {characteristicsOptions.map((characteristic) => (
                        <option key={characteristic} value={characteristic}>
                          {characteristic}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleViewReport}
                    disabled={!canViewReport()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Report
                  </Button>

                  {canViewReport() && (
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>

                {/* Configuration Summary */}
                {selectedReport && (
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Configuration Summary</h4>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div>Report: {selectedReport.name}</div>
                      <div>Scope: {selectedScope || "Not selected"}</div>
                      {selectedScope === "Individual School" && <div>School: {selectedSchool || "Not selected"}</div>}
                      {selectedReport.category === "Attendance & Welfare" && (
                        <>
                          <div>Cutoff: {attendanceCutoff || "Not selected"}</div>
                          <div>Date Range: {dateRangeType || "Not selected"}</div>
                          {dateRangeType === "Term Dates" && selectedTermDate && (
                            <div className="ml-2">
                              Term: {termDates.find((t) => t.id === selectedTermDate)?.label || selectedTermDate}
                            </div>
                          )}
                          {dateRangeType === "Custom Date Range" && customStartDate && customEndDate && (
                            <div className="ml-2">
                              Period: {new Date(customStartDate).toLocaleDateString()} -{" "}
                              {new Date(customEndDate).toLocaleDateString()}
                            </div>
                          )}
                          {(dateRangeType === "Academic Year" || dateRangeType === "Calendar Year") &&
                            selectedTermDate && (
                              <div className="ml-2">
                                {dateRangeType}: {selectedTermDate}
                              </div>
                            )}
                        </>
                      )}
                      <div>Characteristics: {selectedCharacteristics || "All pupils"}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* PDF Report Modal */}
      <PDFReportModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        reportName={selectedReport?.name || ""}
        reportConfig={{
          scope: selectedScope,
          school: selectedSchool,
          attendanceCutoff,
          characteristics: selectedCharacteristics,
        }}
      />

      {/* Report Preview Modal */}
      <ReportPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        report={previewReport}
        onSelectReport={(report) => {
          handleReportSelect(report)
          setShowPreviewModal(false)
        }}
      />
    </div>
  )
}
