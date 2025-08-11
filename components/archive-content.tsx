"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronDown, ChevronUp, Download, Eye, FileText, Filter, Search, X } from "lucide-react"

interface ArchivedReport {
  id: string
  name: string
  section: string
  dateArchived: string
  dateCreated: string
  fileSize: string
  creator: string
  description: string
  tags: string[]
  downloadCount: number
  school?: string // Added school property
}

interface GroupedReports {
  [section: string]: ArchivedReport[]
}

const mockArchivedReports: ArchivedReport[] = [
  {
    id: "ar-1",
    name: "Attendance Summary Dashboard - Whole MAT - March 2024",
    section: "Attendance Summary Dashboard",
    dateArchived: "2024-03-18",
    dateCreated: "2024-03-15",
    fileSize: "2.4 MB",
    creator: "Sarah Johnson",
    description: "Comprehensive attendance analysis across all schools in the MAT",
    tags: ["attendance", "dashboard", "whole-mat"],
    downloadCount: 12,
    school: "Whole MAT", // Added school value
  },
  {
    id: "ar-1b",
    name: "Attendance Summary Dashboard - Whole MAT - February 2024",
    section: "Attendance Summary Dashboard",
    dateArchived: "2024-02-18",
    dateCreated: "2024-02-15",
    fileSize: "2.3 MB",
    creator: "Sarah Johnson",
    description: "Monthly attendance analysis across all schools in the MAT",
    tags: ["attendance", "dashboard", "whole-mat"],
    downloadCount: 8,
    school: "Whole MAT", // Added school value
  },
  {
    id: "ar-1c",
    name: "Attendance Summary Dashboard - Whole MAT - January 2024",
    section: "Attendance Summary Dashboard",
    dateArchived: "2024-01-20",
    dateCreated: "2024-01-17",
    fileSize: "2.1 MB",
    creator: "Sarah Johnson",
    description: "Monthly attendance analysis across all schools in the MAT",
    tags: ["attendance", "dashboard", "whole-mat"],
    downloadCount: 15,
    school: "Whole MAT", // Added school value
  },
  {
    id: "ar-2",
    name: "Weekly Attendance Report - Week 12",
    section: "Weekly Attendance Report",
    dateArchived: "2024-03-17",
    dateCreated: "2024-03-14",
    fileSize: "0.8 MB",
    creator: "Sarah Johnson",
    description: "Weekly attendance summary with trend analysis",
    tags: ["attendance", "weekly", "trends"],
    downloadCount: 5,
    school: "Primary Phase", // Added school value
  },
  {
    id: "ar-2b",
    name: "Weekly Attendance Report - Week 11",
    section: "Weekly Attendance Report",
    dateArchived: "2024-03-10",
    dateCreated: "2024-03-07",
    fileSize: "0.7 MB",
    creator: "Sarah Johnson",
    description: "Weekly attendance summary with trend analysis",
    tags: ["attendance", "weekly", "trends"],
    downloadCount: 3,
    school: "Primary Phase", // Added school value
  },
  {
    id: "ar-2c",
    name: "Weekly Attendance Report - Week 10",
    section: "Weekly Attendance Report",
    dateArchived: "2024-03-03",
    dateCreated: "2024-02-28",
    fileSize: "0.9 MB",
    creator: "Sarah Johnson",
    description: "Weekly attendance summary with trend analysis",
    tags: ["attendance", "weekly", "trends"],
    downloadCount: 7,
    school: "Primary Phase", // Added school value
  },
  {
    id: "ar-3",
    name: "SEND Provision Report - Q3 2024",
    section: "SEND Provision Report",
    dateArchived: "2024-03-16",
    dateCreated: "2024-03-10",
    fileSize: "1.8 MB",
    creator: "Michael Brown",
    description: "Quarterly SEND provision analysis and outcomes report",
    tags: ["send", "statutory", "quarterly"],
    downloadCount: 8,
    school: "Secondary Phase", // Added school value
  },
  {
    id: "ar-3b",
    name: "SEND Provision Report - Q2 2024",
    section: "SEND Provision Report",
    dateArchived: "2024-01-15",
    dateCreated: "2024-01-10",
    fileSize: "1.7 MB",
    creator: "Michael Brown",
    description: "Quarterly SEND provision analysis and outcomes report",
    tags: ["send", "statutory", "quarterly"],
    downloadCount: 12,
    school: "Secondary Phase", // Added school value
  },
  {
    id: "ar-3c",
    name: "SEND Provision Report - Q1 2024",
    section: "SEND Provision Report",
    dateArchived: "2023-10-20",
    dateCreated: "2023-10-15",
    fileSize: "1.9 MB",
    creator: "Michael Brown",
    description: "Quarterly SEND provision analysis and outcomes report",
    tags: ["send", "statutory", "quarterly"],
    downloadCount: 18,
    school: "Secondary Phase", // Added school value
  },
  {
    id: "ar-4",
    name: "Behaviour Incidents Analysis - March 2024",
    section: "Behaviour Incidents Analysis",
    dateArchived: "2024-03-12",
    dateCreated: "2024-03-01",
    fileSize: "1.2 MB",
    creator: "David Lee",
    description: "Monthly behaviour incidents analysis with intervention recommendations",
    tags: ["behaviour", "incidents", "monthly"],
    downloadCount: 6,
    school: "Primary Phase", // Added school value
  },
  {
    id: "ar-4b",
    name: "Behaviour Incidents Analysis - February 2024",
    section: "Behaviour Incidents Analysis",
    dateArchived: "2024-02-12",
    dateCreated: "2024-02-01",
    fileSize: "1.1 MB",
    creator: "David Lee",
    description: "Monthly behaviour incidents analysis with intervention recommendations",
    tags: ["behaviour", "incidents", "monthly"],
    downloadCount: 9,
    school: "Primary Phase", // Added school value
  },
  {
    id: "ar-4c",
    name: "Behaviour Incidents Analysis - January 2024",
    section: "Behaviour Incidents Analysis",
    dateArchived: "2024-01-12",
    dateCreated: "2024-01-01",
    fileSize: "1.3 MB",
    creator: "David Lee",
    description: "Monthly behaviour incidents analysis with intervention recommendations",
    tags: ["behaviour", "incidents", "monthly"],
    downloadCount: 11,
    school: "Primary Phase", // Added school value
  },
  {
    id: "ar-5",
    name: "Pupil Premium Impact Assessment - 2023-24",
    section: "Pupil Premium Impact Assessment",
    dateArchived: "2024-03-14",
    dateCreated: "2024-03-08",
    fileSize: "3.1 MB",
    creator: "Emma Wilson",
    description: "Annual assessment of pupil premium spending and impact on outcomes",
    tags: ["pupil-premium", "impact", "annual"],
    downloadCount: 15,
    school: "All Saints' Catholic High School", // Added school value
  },
  {
    id: "ar-5b",
    name: "Pupil Premium Impact Assessment - 2022-23",
    section: "Pupil Premium Impact Assessment",
    dateArchived: "2023-07-20",
    dateCreated: "2023-07-15",
    fileSize: "2.9 MB",
    creator: "Emma Wilson",
    description: "Annual assessment of pupil premium spending and impact on outcomes",
    tags: ["pupil-premium", "impact", "annual"],
    downloadCount: 22,
    school: "Emmaus Catholic and CofE Primary School", // Added school value
  },
  {
    id: "ar-5c",
    name: "Pupil Premium Impact Assessment - 2021-22",
    section: "Pupil Premium Impact Assessment",
    dateArchived: "2022-07-18",
    dateCreated: "2022-07-12",
    fileSize: "2.7 MB",
    creator: "Emma Wilson",
    description: "Annual assessment of pupil premium spending and impact on outcomes",
    tags: ["pupil-premium", "impact", "annual"],
    downloadCount: 28,
    school: "Notre Dame High School", // Added school value
  },
  {
    id: "ar-6",
    name: "Headteacher's Report to Governors - March 2024",
    section: "Headteacher's Report to Governors",
    dateArchived: "2024-03-08",
    dateCreated: "2024-03-05",
    fileSize: "2.7 MB",
    creator: "James Taylor",
    description: "Monthly headteacher report covering all aspects of school performance",
    tags: ["governors", "headteacher", "monthly"],
    downloadCount: 18,
    school: "Sacred Heart School, A Catholic Voluntary Academy", // Added school value
  },
  {
    id: "ar-6b",
    name: "Headteacher's Report to Governors - February 2024",
    section: "Headteacher's Report to Governors",
    dateArchived: "2024-02-08",
    dateCreated: "2024-02-05",
    fileSize: "2.5 MB",
    creator: "James Taylor",
    description: "Monthly headteacher report covering all aspects of school performance",
    tags: ["governors", "headteacher", "monthly"],
    downloadCount: 14,
    school: "St Thomas of Canterbury School, a Catholic Voluntary Academy", // Added school value
  },
  {
    id: "ar-6c",
    name: "Headteacher's Report to Governors - January 2024",
    section: "Headteacher's Report to Governors",
    dateArchived: "2024-01-08",
    dateCreated: "2024-01-05",
    fileSize: "2.8 MB",
    creator: "James Taylor",
    description: "Monthly headteacher report covering all aspects of school performance",
    tags: ["governors", "headteacher", "monthly"],
    downloadCount: 21,
    school: "St Wilfrid's Catholic Primary School", // Added school value
  },
  {
    id: "ar-7",
    name: "Safeguarding Annual Report - 2023-24",
    section: "Safeguarding Annual Report",
    dateArchived: "2024-03-04",
    dateCreated: "2024-02-20",
    fileSize: "3.8 MB",
    creator: "Karen White",
    description: "Annual safeguarding overview for governing body review",
    tags: ["safeguarding", "annual", "compliance"],
    downloadCount: 25,
    school: "St Marie's School, A Catholic Voluntary Academy", // Added school value
  },
  {
    id: "ar-7b",
    name: "Safeguarding Annual Report - 2022-23",
    section: "Safeguarding Annual Report",
    dateArchived: "2023-07-15",
    dateCreated: "2023-07-01",
    fileSize: "3.6 MB",
    creator: "Karen White",
    description: "Annual safeguarding overview for governing body review",
    tags: ["safeguarding", "annual", "compliance"],
    downloadCount: 31,
    school: "St John Fisher Primary, A Catholic Voluntary Academy", // Added school value
  },
  {
    id: "ar-7c",
    name: "Safeguarding Annual Report - 2021-22",
    section: "Safeguarding Annual Report",
    dateArchived: "2022-07-20",
    dateCreated: "2022-07-05",
    fileSize: "3.4 MB",
    creator: "Karen White",
    description: "Annual safeguarding overview for governing body review",
    tags: ["safeguarding", "annual", "compliance"],
    downloadCount: 38,
    school: "St Mary's Primary School, A Catholic Voluntary Academy", // Added school value
  },
]

export function ArchiveContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedScope, setSelectedScope] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [sortBy, setSortBy] = useState("dateArchived")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [viewingReport, setViewingReport] = useState<any>(null)

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

  const scopeOptions = ["all", "Whole MAT", "Primary Phase", "Secondary Phase", ...schools]

  const filteredReports = useMemo(() => {
    let filtered = mockArchivedReports

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedScope !== "all") {
      filtered = filtered.filter(
        (report) =>
          report.tags.includes(selectedScope) ||
          report.school === selectedScope ||
          (selectedScope === "Whole MAT" && report.school === "Whole MAT") ||
          (selectedScope === "Primary Phase" && report.tags.includes("Primary")) ||
          (selectedScope === "Secondary Phase" && report.tags.includes("Secondary")),
      )
    }

    // Filter by date range
    if (selectedDateRange !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      switch (selectedDateRange) {
        case "last-7-days":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "last-30-days":
          cutoffDate.setDate(now.getDate() - 30)
          break
        case "last-90-days":
          cutoffDate.setDate(now.getDate() - 90)
          break
        case "this-year":
          cutoffDate.setFullYear(now.getFullYear(), 0, 1)
          break
      }

      filtered = filtered.filter((report) => new Date(report.dateArchived) >= cutoffDate)
    }

    // Sort reports
    filtered.sort((a, b) => {
      const dateA = new Date(a[sortBy]).getTime()
      const dateB = new Date(b[sortBy]).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

    return filtered
  }, [searchTerm, selectedScope, selectedDateRange, sortBy, sortOrder])

  const groupReportsBySection = (reports: ArchivedReport[]): GroupedReports => {
    const grouped = reports.reduce((acc, report) => {
      if (!acc[report.section]) {
        acc[report.section] = []
      }
      acc[report.section].push(report)
      return acc
    }, {} as GroupedReports)

    // Sort reports within each section by date archived (newest first)
    Object.keys(grouped).forEach((section) => {
      grouped[section].sort((a, b) => new Date(b.dateArchived).getTime() - new Date(a.dateArchived).getTime())
    })

    return grouped
  }

  const groupedReports = groupReportsBySection(filteredReports)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const getSectionColor = (section: string) => {
    const colors = {
      "Attendance Summary Dashboard": "bg-blue-100 text-blue-800",
      "Weekly Attendance Report": "bg-green-100 text-green-800",
      "SEND Provision Report": "bg-purple-100 text-purple-800",
      "Behaviour Incidents Analysis": "bg-red-100 text-red-800",
      "Pupil Premium Impact Assessment": "bg-orange-100 text-orange-800",
      "Headteacher's Report to Governors": "bg-indigo-100 text-indigo-800",
      "Safeguarding Annual Report": "bg-pink-100 text-pink-800",
    }
    return colors[section as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleViewReport = (reportId: string) => {
    const report = mockArchivedReports.find((r) => r.id === reportId)
    if (report) {
      setViewingReport(report)
    }
  }

  const handleDownloadReport = (reportId: string) => {
    // Simulate downloading report
    console.log("Downloading report:", reportId)
  }

  const handleClosePDFViewer = () => {
    setViewingReport(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Report Archive</h1>
        <p className="text-gray-600 mt-1">Access and manage archived PDF reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedScope} onValueChange={setSelectedScope}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Report Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scopes</SelectItem>
              {scopeOptions.slice(1).map((scope) => (
                <SelectItem key={scope} value={scope}>
                  {scope}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger>
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="this-year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg border">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No archived reports found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {Object.entries(groupedReports).map(([section, reports]) => (
              <div key={section} className="border-b last:border-b-0">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleSection(section)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSectionColor(section)}`}>
                      {section}
                    </div>
                    <span className="font-medium text-gray-900">
                      {reports.length} report{reports.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Last archived:{" "}
                      {new Date(
                        Math.max(...reports.map((r) => new Date(r.dateArchived).getTime())),
                      ).toLocaleDateString()}
                    </span>
                    {expandedSections.includes(section) ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedSections.includes(section) && (
                  <div className="bg-white">
                    <div className="space-y-0">
                      {reports.map((report) => (
                        <div key={report.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{report.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{report.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>Archived: {new Date(report.dateArchived).toLocaleDateString()}</span>
                              <span>Size: {report.fileSize}</span>
                              <span>Creator: {report.creator}</span>
                              <span>Downloads: {report.downloadCount}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReport(report.id)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadReport(report.id)}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {viewingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">{viewingReport.name}</h2>
                <p className="text-sm text-gray-600">{viewingReport.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClosePDFViewer} className="flex items-center gap-1">
                <X className="h-4 w-4" />
                Close
              </Button>
            </div>
            <div className="flex-1 p-4 bg-gray-100">
              <div className="w-full h-full bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Preview</h3>
                  <p className="text-gray-600 mb-4">{viewingReport.name}</p>
                  <p className="text-sm text-gray-500">
                    In a real implementation, this would display the actual PDF content
                  </p>
                  <Button
                    onClick={() => handleDownloadReport(viewingReport.id)}
                    className="mt-4 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
