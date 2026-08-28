"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  FileText,
  Search,
  X,
} from "lucide-react"

interface ArchivedReport {
  id: string
  name: string
  area: string
  section: string
  // "mat" = a trust-wide report; "school" = specific to one school (schoolUrn set).
  level: "mat" | "school"
  schoolUrn: string
  dateArchived: string
  dateCreated: string
  fileSize: string
  creator: string
  description: string
  tags: string[]
  downloadCount: number
}

// Report areas — matches the predefined reports categories.
const AREAS = [
  "School Improvement",
  "Governor Reporting",
  "Attendance & Welfare",
  "Statutory & Compliance",
  "Performance Analytics",
] as const

// The schools within the account's trust. The trust itself is implicit from the
// signed-in account, so reports are scoped either MAT-wide or to one school.
const SCHOOLS = [
  { urn: "138337", name: "All Saints' Catholic High School" },
  { urn: "140826", name: "Emmaus Catholic and CofE Primary School" },
  { urn: "138361", name: "Notre Dame High School" },
  { urn: "140439", name: "Sacred Heart School, A Catholic Voluntary Academy" },
  { urn: "138828", name: "St Thomas of Canterbury School, a Catholic Voluntary Academy" },
  { urn: "138830", name: "St Wilfrid's Catholic Primary School" },
  { urn: "138848", name: "St Marie's School, A Catholic Voluntary Academy" },
  { urn: "140025", name: "St John Fisher Primary, A Catholic Voluntary Academy" },
] as const

const SCHOOL_NAME_BY_URN: Record<string, string> = Object.fromEntries(SCHOOLS.map((s) => [s.urn, s.name]))

const baseArchivedReports: Omit<ArchivedReport, "area" | "schoolUrn" | "level">[] = [
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
]

// Synthesize a large archive so the layout is exercised at realistic scale
// (thousands of rows spread across the 9 areas). The master-detail layout
// keeps only the selected area's current page mounted at a time.
const creators = ["Sarah Johnson", "Michael Brown", "David Lee", "Emma Wilson", "James Taylor", "Karen White"]
const mockArchivedReports: ArchivedReport[] = Array.from({ length: 3200 }, (_, i) => {
  const base = baseArchivedReports[i % baseArchivedReports.length]
  const area = AREAS[i % AREAS.length]
  // Roughly one in four reports is a MAT-wide report; the rest belong to a school.
  const isMatWide = i % 4 === 0
  const level: "mat" | "school" = isMatWide ? "mat" : "school"
  const schoolUrn = isMatWide ? "" : SCHOOLS[i % SCHOOLS.length].urn
  const year = 2018 + (i % 7)
  const month = (i % 12) + 1
  const day = (i % 27) + 1
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  return {
    ...base,
    area,
    level,
    schoolUrn,
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
  // Scope: "all" = every report, "mat" = MAT-wide only, otherwise a school URN.
  const [scope, setScope] = useState<string>("all")
  const [selectedArea, setSelectedArea] = useState<string>(AREAS[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [sortBy, setSortBy] = useState<SortKey>("dateArchived")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [viewingReport, setViewingReport] = useState<ArchivedReport | null>(null)

  // Reports scoped to the current selection (all / MAT-wide / a single school).
  const orgScopedReports = useMemo(() => {
    if (scope === "all") return mockArchivedReports
    if (scope === "mat") return mockArchivedReports.filter((r) => r.level === "mat")
    return mockArchivedReports.filter((r) => r.schoolUrn === scope)
  }, [scope])

  // Per-area totals for the sidebar counts, respecting the scope.
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const area of AREAS) counts[area] = 0
    for (const report of orgScopedReports) counts[report.area]++
    return counts
  }, [orgScopedReports])

  const filteredReports = useMemo(() => {
    let filtered = orgScopedReports.filter((report) => report.area === selectedArea)

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(q) ||
          report.description.toLowerCase().includes(q) ||
          report.creator.toLowerCase().includes(q) ||
          report.section.toLowerCase().includes(q) ||
          report.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
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
  }, [orgScopedReports, selectedArea, searchTerm, selectedDateRange, sortBy, sortOrder])

  // Reset to first page whenever the scope, area, result set, or page size changes.
  useEffect(() => {
    setPage(1)
  }, [scope, selectedArea, searchTerm, selectedDateRange, sortBy, sortOrder, pageSize])

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

  const handleViewReport = (report: ArchivedReport) => setViewingReport(report)
  const handleDownloadReport = (reportId: string) => console.log("Downloading report:", reportId)
  const handleClosePDFViewer = () => setViewingReport(null)

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDateRange("all")
  }

  const hasActiveFilters = searchTerm !== "" || selectedDateRange !== "all"

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

  const totalInScope = orgScopedReports.length
  const scopeLabel = scope === "all" ? "all schools" : scope === "mat" ? "MAT-wide reports" : SCHOOL_NAME_BY_URN[scope]

  return (
    <div className="space-y-6">
      {/* Scope selector — MAT-wide or a specific school */}
      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-md">
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Show reports for</label>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All reports</SelectItem>
                <SelectItem value="mat">MAT-wide reports</SelectItem>
                <SelectSeparator />
                {SCHOOLS.map((school) => (
                  <SelectItem key={school.urn} value={school.urn}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-slate-500 md:text-right">
            <span className="font-medium text-slate-900">{totalInScope.toLocaleString()}</span> reports for{" "}
            <span className="font-medium text-slate-900">{scopeLabel}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Master: area list */}
        <aside className="lg:w-72 lg:flex-shrink-0">
          <div className="rounded-lg border bg-white">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Areas</h2>
            </div>
            <nav className="max-h-[70vh] overflow-y-auto p-2">
              {AREAS.map((area) => {
                const isActive = area === selectedArea
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setSelectedArea(area)}
                    aria-current={isActive ? "true" : undefined}
                    className={`mb-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                      isActive ? "bg-[#33295e]/10 text-[#33295e]" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`min-w-0 flex-1 truncate text-sm ${isActive ? "font-semibold" : "font-medium"}`}>
                      {area}
                    </span>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        isActive ? "bg-[#fd6d6d] text-white" : "bg-[#fd6d6d]/10 text-[#fd6d6d]"
                      }`}
                    >
                      {areaCounts[area].toLocaleString()}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Detail: reports within the selected area */}
        <section className="min-w-0 flex-1 space-y-4">

          {/* Filters (scoped to the selected area) */}
          <div className="rounded-lg border bg-white p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder={`Search ${selectedArea}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus-visible:ring-[#33295e]"
                />
              </div>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="sm:w-[180px]">
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
                  <X className="mr-1 h-3.5 w-3.5" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          {/* Results table */}
          <div className="overflow-hidden rounded-lg border bg-white">
            {filteredReports.length === 0 ? (
              <div className="py-16 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <h3 className="mb-2 text-lg font-medium text-slate-900">No archived reports found</h3>
                <p className="text-slate-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 [&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:text-xs [&>th]:uppercase [&>th]:tracking-wide">
                        <SortHeader label="Report" sortKey="name" />
                        {scope === "all" && (
                          <th className="hidden md:table-cell text-xs font-semibold text-slate-600">Organisation</th>
                        )}
                        <th className="hidden xl:table-cell text-xs font-semibold text-slate-600">Archived By</th>
                        <SortHeader label="Archived" sortKey="dateArchived" className="hidden md:table-cell" />
                        <th className="text-right text-xs font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageReports.map((report) => (
                        <tr key={report.id} className="border-b last:border-b-0 transition-colors hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="min-w-0">
                                <div className="max-w-[280px] truncate font-medium text-slate-900 xl:max-w-[360px]">
                                  {report.name}
                                </div>
                                <div className="max-w-[280px] truncate text-xs text-slate-500 xl:max-w-[360px]">
                                  {report.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          {scope === "all" && (
                            <td className="hidden px-4 py-3 md:table-cell">
                              {report.level === "mat" ? (
                                <span className="inline-flex items-center rounded-full bg-[#33295e]/10 px-2 py-0.5 text-xs font-medium text-[#33295e]">
                                  MAT-wide
                                </span>
                              ) : (
                                <span className="block max-w-[200px] truncate text-slate-600">
                                  {SCHOOL_NAME_BY_URN[report.schoolUrn]}
                                </span>
                              )}
                            </td>
                          )}
                          <td className="hidden whitespace-nowrap px-4 py-3 text-slate-600 xl:table-cell">
                            {report.creator}
                          </td>
                          <td className="hidden whitespace-nowrap px-4 py-3 text-slate-600 md:table-cell">
                            {new Date(report.dateArchived).toLocaleDateString("en-GB")}
                          </td>
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
                          num === currentPage ? "bg-[#33295e] text-white hover:bg-[#2a2150]" : "bg-transparent"
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
        </section>
      </div>

      {/* PDF Viewer Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="text-lg font-semibold">{viewingReport.name}</h2>
                <p className="text-sm text-slate-600">{viewingReport.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClosePDFViewer}>
                <X className="mr-1 h-4 w-4" />
                Close
              </Button>
            </div>
            <div className="flex-1 bg-slate-100 p-4">
              <div className="flex h-full w-full items-center justify-center rounded border-2 border-dashed border-slate-300 bg-white">
                <div className="text-center">
                  <FileText className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                  <h3 className="mb-2 text-lg font-medium text-slate-900">PDF Preview</h3>
                  <p className="mb-4 text-slate-600">{viewingReport.name}</p>
                  <p className="text-sm text-slate-500">
                    In a real implementation, this would display the actual PDF content
                  </p>
                  <Button
                    onClick={() => handleDownloadReport(viewingReport.id)}
                    className="mt-4 bg-[#33295e] text-white transition-colors hover:bg-[#fd6d6d]"
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
