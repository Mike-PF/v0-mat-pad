"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Filter,
  FileText,
  Search,
  X,
} from "lucide-react"

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
}

const baseArchivedReports: ArchivedReport[] = [
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
  },
]

// Synthesize a large archive so the layout is exercised at realistic scale
// (thousands of rows). Pagination keeps only one page mounted at a time.
const creators = ["Sarah Johnson", "Michael Brown", "David Lee", "Emma Wilson", "James Taylor", "Karen White"]
const mockArchivedReports: ArchivedReport[] = Array.from({ length: 3200 }, (_, i) => {
  const base = baseArchivedReports[i % baseArchivedReports.length]
  const year = 2018 + (i % 7)
  const month = (i % 12) + 1
  const day = (i % 27) + 1
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  return {
    ...base,
    id: `${base.id}-${i}`,
    name: `${base.section} - ${new Date(iso).toLocaleString("en-GB", { month: "long", year: "numeric" })}`,
    dateArchived: iso,
    dateCreated: iso,
    fileSize: `${(0.5 + ((i * 37) % 40) / 10).toFixed(1)} MB`,
    creator: creators[i % creators.length],
    downloadCount: (i * 13) % 60,
  }
})

type SortKey = "name" | "section" | "dateArchived" | "fileSize" | "downloadCount"
const PAGE_SIZE_OPTIONS = [25, 50, 100]

export function ArchiveContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedScope, setSelectedScope] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [sortBy, setSortBy] = useState<SortKey>("dateArchived")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [viewingReport, setViewingReport] = useState<ArchivedReport | null>(null)

  const schools = [
    "Greenfield Primary School",
    "Oakwood Academy",
    "Riverside Secondary School",
    "Hillcrest Primary School",
    "Valley View Academy",
    "Meadowbrook School",
    "Sunset Primary School",
    "Northgate Secondary School",
  ]

  const scopeOptions = ["all", "Whole MAT", "Primary Phase", "Secondary Phase", ...schools]

  const filteredReports = useMemo(() => {
    let filtered = mockArchivedReports

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(q) ||
          report.description.toLowerCase().includes(q) ||
          report.creator.toLowerCase().includes(q) ||
          report.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
    }

    if (selectedScope !== "all") {
      if (selectedScope === "Whole MAT") {
        filtered = filtered.filter((report) => report.tags.includes("whole-mat"))
      } else if (selectedScope === "Primary Phase") {
        filtered = filtered.filter((report) => report.tags.includes("primary"))
      } else if (selectedScope === "Secondary Phase") {
        filtered = filtered.filter((report) => report.tags.includes("secondary"))
      } else if (schools.includes(selectedScope)) {
        filtered = filtered.filter((report) => report.tags.includes(selectedScope.toLowerCase().replace(/\s+/g, "-")))
      }
    }

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

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0
      if (sortBy === "name" || sortBy === "section") {
        cmp = a[sortBy].localeCompare(b[sortBy])
      } else if (sortBy === "fileSize") {
        cmp = Number.parseFloat(a.fileSize) - Number.parseFloat(b.fileSize)
      } else if (sortBy === "downloadCount") {
        cmp = a.downloadCount - b.downloadCount
      } else {
        cmp = new Date(a.dateArchived).getTime() - new Date(b.dateArchived).getTime()
      }
      return sortOrder === "asc" ? cmp : -cmp
    })

    return sorted
  }, [searchTerm, selectedScope, selectedDateRange, sortBy, sortOrder])

  // Reset to first page whenever the result set or page size changes.
  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedScope, selectedDateRange, sortBy, sortOrder, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const pageReports = filteredReports.slice(pageStart, pageStart + pageSize)

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(key)
      setSortOrder(key === "name" || key === "section" ? "asc" : "desc")
    }
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

  const handleViewReport = (report: ArchivedReport) => setViewingReport(report)
  const handleDownloadReport = (reportId: string) => console.log("Downloading report:", reportId)
  const handleClosePDFViewer = () => setViewingReport(null)

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedScope("all")
    setSelectedDateRange("all")
  }

  const hasActiveFilters = searchTerm !== "" || selectedScope !== "all" || selectedDateRange !== "all"

  const SortHeader = ({ label, sortKey, className }: { label: string; sortKey: SortKey; className?: string }) => (
    <th className={className}>
      <button
        type="button"
        onClick={() => handleSort(sortKey)}
        className="flex items-center gap-1.5 text-left font-semibold text-slate-600 hover:text-slate-900"
      >
        {label}
        {sortBy === sortKey ? (
          sortOrder === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
        )}
      </button>
    </th>
  )

  // Build a compact page-number window around the current page.
  const pageNumbers = useMemo(() => {
    const windowSize = 5
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2))
    const end = Math.min(totalPages, start + windowSize - 1)
    start = Math.max(1, end - windowSize + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentPage, totalPages])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Report Archive</h1>
        <p className="text-slate-600 mt-1">Access and manage archived PDF reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by name, creator, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus-visible:ring-[#33295e]"
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
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-slate-600">
            {filteredReports.length.toLocaleString()} report{filteredReports.length !== 1 ? "s" : ""} found
          </span>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-500">
              <X className="h-3.5 w-3.5 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No archived reports found</h3>
            <p className="text-slate-600">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:text-xs [&>th]:uppercase [&>th]:tracking-wide">
                    <SortHeader label="Report" sortKey="name" />
                    <SortHeader label="Section" sortKey="section" className="hidden lg:table-cell" />
                    <th className="hidden xl:table-cell text-xs font-semibold text-slate-600">Creator</th>
                    <SortHeader label="Archived" sortKey="dateArchived" className="hidden md:table-cell" />
                    <SortHeader label="Size" sortKey="fileSize" className="hidden xl:table-cell" />
                    <SortHeader label="Downloads" sortKey="downloadCount" className="hidden lg:table-cell" />
                    <th className="text-right text-xs font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageReports.map((report) => (
                    <tr key={report.id} className="border-b last:border-b-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-5 w-5 text-[#33295e] flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 truncate max-w-[280px] xl:max-w-[360px]">
                              {report.name}
                            </div>
                            <div className="text-xs text-slate-500 truncate max-w-[280px] xl:max-w-[360px]">
                              {report.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getSectionColor(report.section)}`}
                        >
                          {report.section}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-slate-600 whitespace-nowrap">
                        {report.creator}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-600 whitespace-nowrap">
                        {new Date(report.dateArchived).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-slate-600 whitespace-nowrap">
                        {report.fileSize}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-600">{report.downloadCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id)}>
                            Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span>
                  Showing {(pageStart + 1).toLocaleString()}–
                  {Math.min(pageStart + pageSize, filteredReports.length).toLocaleString()} of{" "}
                  {filteredReports.length.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline">Rows:</span>
                  <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                    <SelectTrigger className="h-8 w-[72px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => setPage(1)}
                  disabled={currentPage === 1}
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {pageNumbers.map((num) => (
                  <Button
                    key={num}
                    variant={num === currentPage ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 ${
                      num === currentPage
                        ? "bg-[#33295e] text-white hover:bg-[#2a2150]"
                        : "bg-transparent"
                    }`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => setPage(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {viewingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">{viewingReport.name}</h2>
                <p className="text-sm text-slate-600">{viewingReport.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClosePDFViewer}>
                <X className="h-4 w-4 mr-1" />
                Close
              </Button>
            </div>
            <div className="flex-1 p-4 bg-slate-100">
              <div className="w-full h-full bg-white rounded border-2 border-dashed border-slate-300 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">PDF Preview</h3>
                  <p className="text-slate-600 mb-4">{viewingReport.name}</p>
                  <p className="text-sm text-slate-500">
                    In a real implementation, this would display the actual PDF content
                  </p>
                  <Button
                    onClick={() => handleDownloadReport(viewingReport.id)}
                    className="mt-4 bg-[#33295e] hover:bg-[#fd6d6d] text-white transition-colors"
                  >
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
