"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  X, 
  LayoutGrid,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Star
} from "lucide-react"
import { LoadingModal } from "@/components/ui/loading-modal"
import { AttendanceHeadlinesReport } from "@/components/attendance-headlines-report"
import { EyfsHeadlinesReport } from "@/components/eyfs-headlines-report"
import { EyfsPopilGroupReport } from "@/components/eyfs-pupil-group-report"
import { EyfsGoalsBySchoolReport } from "@/components/eyfs-goals-by-school-report"
import { EyfsGoalsByPupilGroupReport } from "@/components/eyfs-goals-by-pupilgroup-report"

// Report categories with reports and descriptions
const reportCategories = [
  {
    id: "attendance",
    name: "Attendance",
    color: "#5B9BF5",
    reports: [
      {
        id: "attendance-headlines",
        name: "Attendance Headlines",
        description: "A comprehensive overview of attendance metrics across your MAT, comparing current performance against national benchmarks. Includes persistent absence rates, authorised and unauthorised absence breakdowns, and trend analysis over time to identify patterns requiring intervention."
      },
      {
        id: "persistent-absence",
        name: "Persistent Absence Dashboard",
        description: "Detailed analysis of pupils with attendance below 90%, identifying those at risk of becoming persistently absent. Drill down by school, year group, and pupil characteristics to target early intervention strategies and monitor the effectiveness of attendance improvement plans."
      },
      {
        id: "pupil-summary",
        name: "Pupil Summary Dashboard",
        description: "Individual pupil-level attendance data with filters for specific cohorts. Track attendance patterns for vulnerable groups including SEN, FSM, and looked-after children. Export functionality enables sharing data with external agencies and parents for collaborative support."
      },
      {
        id: "pupil-view",
        name: "Pupil View Dashboard",
        description: "A focused view on individual pupil attendance records showing day-by-day absence patterns, reason codes, and cumulative statistics. Essential for case management meetings, parental discussions, and identifying pupils requiring targeted support from pastoral teams."
      },
      {
        id: "termly-attendance",
        name: "Termly Attendance Analysis",
        description: "Compare attendance performance across autumn, spring, and summer terms to identify seasonal patterns. Historical trend analysis helps predict periods of lower attendance and enables proactive planning of intervention strategies during challenging periods."
      },
      {
        id: "school-comparisons",
        name: "School Comparisons",
        description: "Benchmark attendance performance across all schools in your MAT using standardised metrics. Identify schools outperforming expectations and those requiring additional support, enabling targeted resource allocation and sharing of best practice across the trust."
      },
      {
        id: "attendance-heatmap",
        name: "Attendance Heatmap",
        description: "Visual representation of attendance patterns across days of the week and times of year. Quickly identify problematic patterns such as Monday absences or post-holiday dips. Interactive filters allow analysis by school, year group, and pupil characteristics."
      },
      {
        id: "absence-codes",
        name: "Absence Code Analysis",
        description: "Breakdown of absence by code type showing the proportion of illness, family holidays, exclusions, and other reasons. Monitor trends in specific absence types and ensure consistent application of absence codes across all schools in your MAT."
      },
    ]
  },
  {
    id: "attainment",
    name: "Attainment",
    color: "#715DBF",
    reports: [
      {
        id: "ks2-outcomes",
        name: "KS2 Outcomes Dashboard",
        description: "Analysis of Key Stage 2 results including reading, writing, maths, and combined scores. Compare your MAT's performance against national figures and track progress over multiple years. Breakdown by pupil characteristics identifies gaps requiring focused curriculum intervention."
      },
      {
        id: "ks4-outcomes",
        name: "KS4 Outcomes Dashboard",
        description: "GCSE and equivalent qualification results analysis including Attainment 8, Progress 8, and EBacc measures. Track performance trends and compare against national benchmarks. Identify subject areas and pupil groups requiring curriculum or pastoral intervention strategies."
      },
      {
        id: "phonics-screening",
        name: "Phonics Screening Check",
        description: "Year 1 phonics screening results with comparison to national pass rates. Track re-take performance for Year 2 pupils and analyse the effectiveness of phonics interventions. Essential for early identification of pupils requiring additional reading support."
      },
      {
        id: "multiplication-check",
        name: "Multiplication Tables Check",
        description: "Year 4 MTC results showing the proportion of pupils achieving full marks and average scores. Analyse performance by times table to identify specific gaps in multiplication knowledge and target maths interventions effectively across your MAT."
      },
      {
        id: "reading-ages",
        name: "Reading Age Analysis",
        description: "Track reading ages against chronological ages to identify pupils reading significantly below expected levels. Monitor the impact of reading interventions over time and compare performance across schools to share effective approaches to improving literacy."
      },
      {
        id: "progress-tracker",
        name: "In-Year Progress Tracker",
        description: "Monitor pupil progress against expected trajectories using your chosen assessment framework. Identify pupils falling behind expected progress and those exceeding expectations. Essential for termly pupil progress meetings and intervention planning discussions."
      },
      {
        id: "eyfs-headlines",
        name: "EYFS Headlines & Trends",
        description: "A comprehensive overview of Early Years Foundation Stage outcomes including Good Level of Development, all ELG areas, and literacy and mathematics ELGs. Track MAT performance against national figures with year-on-year and three-year trends across all seven areas of learning."
      },
      {
        id: "eyfs-pupil-group",
        name: "EYFS Pupil Group Results",
        description: "Explore EYFS outcomes broken down by pupil group including FSM eligibility, SEN provision, first language, term of birth and ethnicity. Compare school-level results against national and MAT benchmarks across all 17 Early Learning Goals."
      },
      {
        id: "eyfs-goals-by-school",
        name: "EYFS - Early Years Goals by school",
        description: "Detailed performance data for all 17 Early Learning Goals across schools within your MAT. Color-coded table showing Good Level of Development and all individual ELG outcomes with performance benchmarked against national averages."
      },
      {
        id: "eyfs-goals-by-pupilgroup",
        name: "EYFS - Early Years Goals by pupil group",
        description: "All 17 Early Learning Goals broken down by pupil group — FSM eligibility, SEN provision, first language and term of birth. Color-coded by performance relative to national averages so you can quickly identify where specific groups need support."
      },
    ]
  },
  {
    id: "behaviour",
    name: "Behaviour",
    color: "#B3008B",
    reports: [
      {
        id: "behaviour-overview",
        name: "Behaviour Overview",
        description: "Summary of behaviour incidents across your MAT including positive recognition and sanctions. Track trends over time and compare performance between schools. Identify patterns requiring policy review or additional staff training to improve behaviour culture."
      },
      {
        id: "exclusions",
        name: "Exclusions Dashboard",
        description: "Fixed-term and permanent exclusion data with breakdown by school, year group, and pupil characteristics. Monitor compliance with exclusion procedures and identify disproportionate exclusion rates for specific groups requiring alternative behaviour support strategies."
      },
      {
        id: "suspensions-analysis",
        name: "Suspensions Analysis",
        description: "Detailed analysis of suspension reasons, durations, and repeat offenders. Track the effectiveness of reintegration processes and identify pupils requiring managed moves or alternative provision placements. Essential for governing body reporting requirements."
      },
      {
        id: "positive-recognition",
        name: "Positive Recognition Tracker",
        description: "Monitor the balance of positive to negative behaviour points across your MAT. Identify schools and classes with strong positive cultures and those requiring support to increase recognition and praise. Promotes a consistent approach to celebrating pupil success."
      },
    ]
  },
  {
    id: "contextual",
    name: "Contextual",
    color: "#F79400",
    reports: [
      {
        id: "census-summary",
        name: "Census Summary",
        description: "Overview of pupil demographic data from statutory census returns including ethnicity, language, FSM eligibility, and SEN provision. Essential for understanding your pupil population and ensuring curriculum and support services meet the needs of all learners."
      },
      {
        id: "sen-overview",
        name: "SEN Overview Dashboard",
        description: "Breakdown of Special Educational Needs provision across your MAT showing pupils at SEN Support and with EHCPs. Track the effectiveness of SEN spending and compare outcomes for SEN pupils against their peers across all schools."
      },
      {
        id: "pupil-premium",
        name: "Pupil Premium Analysis",
        description: "Analysis of disadvantaged pupil data including FSM, Ever6 FSM, and service children. Track the attainment and progress gap between disadvantaged and non-disadvantaged pupils. Monitor spending and evaluate the impact of pupil premium strategies."
      },
      {
        id: "eal-analysis",
        name: "EAL Pupil Analysis",
        description: "English as an Additional Language pupil data showing proficiency levels and progress in English acquisition. Identify pupils requiring additional language support and monitor the impact of EAL interventions on academic outcomes across the curriculum."
      },
      {
        id: "mobility",
        name: "Pupil Mobility Report",
        description: "Track pupils joining and leaving your schools mid-year with analysis of the impact on cohort performance data. Identify schools with high mobility rates and plan appropriate transition support and assessment processes for new arrivals."
      },
    ]
  },
  {
    id: "safeguarding",
    name: "Safeguarding",
    color: "#5BBE80",
    reports: [
      {
        id: "cpoms-overview",
        name: "CPOMS Overview",
        description: "Summary of safeguarding concerns logged in CPOMS or equivalent systems across your MAT. Track concern categories, response times, and outcomes. Identify trends requiring policy review or additional safeguarding training for specific staff groups."
      },
      {
        id: "lac-overview",
        name: "Looked After Children Overview",
        description: "Dashboard for monitoring outcomes for looked-after children including attendance, attainment, and exclusions compared to peers. Track PEP completion rates and pupil premium plus spending to ensure LAC receive appropriate support and resources."
      },
      {
        id: "caseload-analysis",
        name: "DSL Caseload Analysis",
        description: "Analyse the distribution and complexity of safeguarding cases across designated safeguarding leads. Identify schools requiring additional DSL capacity and ensure workload is manageable to maintain high-quality responses to safeguarding concerns."
      },
    ]
  },
  {
    id: "workforce",
    name: "Workforce",
    color: "#2395A4",
    reports: [
      {
        id: "staff-absence",
        name: "Staff Absence Dashboard",
        description: "Track teacher and support staff absence rates across your MAT. Analyse absence by reason, duration, and time of year. Identify schools with high absence rates requiring HR intervention and monitor the cost of supply cover expenditure."
      },
      {
        id: "recruitment",
        name: "Recruitment Analytics",
        description: "Monitor vacancy rates, time to fill positions, and recruitment source effectiveness across your MAT. Identify hard-to-fill subject areas and schools struggling to attract quality candidates. Essential for workforce planning and retention strategies."
      },
      {
        id: "staff-turnover",
        name: "Staff Turnover Analysis",
        description: "Track staff leaving rates by school, role type, and length of service. Analyse exit interview data to identify retention issues and compare turnover against sector benchmarks. Inform strategies to improve staff retention and reduce recruitment costs."
      },
      {
        id: "cpd-tracker",
        name: "CPD Completion Tracker",
        description: "Monitor completion of mandatory and optional training across all staff. Identify compliance gaps in safeguarding, prevent, and health and safety training. Track engagement with professional development opportunities and impact on teaching quality."
      },
    ]
  },
  {
    id: "finance",
    name: "Finance",
    color: "#6AD0D5",
    reports: [
      {
        id: "budget-summary",
        name: "Budget Summary Dashboard",
        description: "Overview of income and expenditure across your MAT with comparison to budget forecasts. Track spending patterns and identify variances requiring investigation. Essential for CFO reporting to trustees and ensuring financial sustainability."
      },
      {
        id: "staffing-costs",
        name: "Staffing Cost Analysis",
        description: "Breakdown of staffing expenditure as a proportion of total budget with benchmarking against similar MATs. Analyse the balance between teaching and non-teaching staff costs and identify schools with unsustainable staffing structures requiring intervention."
      },
      {
        id: "grant-tracking",
        name: "Grant Tracking Dashboard",
        description: "Monitor allocation and spending of ring-fenced grants including pupil premium, PE and sport premium, and recovery premium. Ensure compliance with spending requirements and evaluate impact of grant-funded interventions on pupil outcomes."
      },
      {
        id: "procurement",
        name: "Procurement Analysis",
        description: "Track supplier spending patterns and contract renewals across your MAT. Identify opportunities for centralised procurement and cost savings through economies of scale. Monitor compliance with financial regulations and procurement policies."
      },
    ]
  },
  {
    id: "estates",
    name: "Estates",
    color: "#F7555A",
    reports: [
      {
        id: "capacity-planning",
        name: "Capacity Planning",
        description: "Monitor pupil numbers against Published Admission Numbers and forecast future capacity requirements. Identify schools at risk of becoming over or undersubscribed and inform decisions about expansion, reduction, or new school requirements."
      },
      {
        id: "condition-survey",
        name: "Condition Survey Summary",
        description: "Overview of building condition data from surveys with prioritisation of maintenance and capital works. Track progress against condition improvement plans and forecast future capital expenditure requirements for estate investment planning."
      },
      {
        id: "energy-consumption",
        name: "Energy Consumption Dashboard",
        description: "Monitor electricity, gas, and water consumption across your estate with comparison to benchmarks. Identify buildings with high consumption requiring energy efficiency improvements. Track progress towards net zero carbon targets and cost reduction goals."
      },
    ]
  },
]

export function ReportsContent() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["favourites", ...reportCategories.map(c => c.id)])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [favourites, setFavourites] = useState<string[]>([])

  const handleReportSelect = (reportId: string) => {
    setIsLoadingReport(true)
    setTimeout(() => {
      setSelectedReport(reportId)
      setIsLoadingReport(false)
    }, 800)
  }

  const handleBackToMenu = () => {
    setSelectedReport(null)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleFavourite = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation()
    setFavourites(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const allReports = reportCategories.flatMap(c => c.reports.map(r => ({ ...r, categoryColor: c.color, categoryName: c.name })))
  const favouriteReports = allReports.filter(r => favourites.includes(r.id))

  const filteredCategories = reportCategories.map(category => ({
    ...category,
    reports: category.reports.filter(report =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.reports.length > 0)

  const selectedReportData = reportCategories
    .flatMap(c => c.reports)
    .find(r => r.id === selectedReport)

  const selectedCategory = reportCategories.find(c => 
    c.reports.some(r => r.id === selectedReport)
  )

  // Report selected with navigation visible
  if (selectedReport) {
    return (
      <>
        <LoadingModal isOpen={isLoadingReport} message="Loading report..." />
        <div className="h-full flex flex-col bg-slate-50">
          {/* Header with report info */}
          <div 
            className="px-6 py-2 flex items-center gap-4 border-b border-white/10"
            style={{ backgroundColor: selectedCategory?.color || "#121051" }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToMenu}
              className="text-white hover:bg-white/20 h-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">{selectedReportData?.name}</h2>
              <span className="text-white/50">•</span>
              <p className="text-sm text-white/70">{selectedCategory?.name}</p>
            </div>
          </div>

          {/* Report content */}
          <div className="flex-1 overflow-auto bg-slate-50 p-4">
            {selectedReport === "attendance-headlines" ? (
              <div className="bg-white rounded-lg overflow-hidden">
                <AttendanceHeadlinesReport />
              </div>
            ) : selectedReport === "eyfs-headlines" ? (
              <div className="bg-white rounded-lg overflow-hidden">
                <EyfsHeadlinesReport />
              </div>
            ) : selectedReport === "eyfs-pupil-group" ? (
              <div className="bg-white rounded-lg overflow-hidden">
                <EyfsPopilGroupReport />
              </div>
            ) : selectedReport === "eyfs-goals-by-school" ? (
              <div className="bg-white rounded-lg overflow-hidden">
                <EyfsGoalsBySchoolReport />
              </div>
            ) : selectedReport === "eyfs-goals-by-pupilgroup" ? (
              <div className="bg-white rounded-lg overflow-hidden">
                <EyfsGoalsByPupilGroupReport />
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 h-full flex items-center justify-center p-6">
                <div className="text-center text-slate-500">
                  <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">Power BI Report: {selectedReportData?.name}</p>
                  <p className="text-sm mt-2">Embedded report will display here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  // Report selection menu
  return (
    <>
      <LoadingModal isOpen={isLoadingReport} message="Loading report..." />
      <div className="h-full bg-slate-50 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
              <p className="text-sm text-slate-500 mt-1">
                Select a report from the categories below. {reportCategories.reduce((acc, c) => acc + c.reports.length, 0)} reports available.
              </p>
            </div>
          </div>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-slate-50 border-slate-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories and Reports */}
        <div className="p-6 space-y-3 overflow-y-auto flex-1">

          {/* Favourites Section */}
          {!searchQuery && (
            <Card className="bg-white overflow-hidden">
              <button
                onClick={() => toggleCategory("favourites")}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-base font-semibold text-slate-900">Favourites</span>
                  <span className="text-sm text-slate-400">({favouriteReports.length} reports)</span>
                </div>
                {expandedCategories.includes("favourites") ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>
              {expandedCategories.includes("favourites") && (
                <div className="border-t border-slate-100">
                  {favouriteReports.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <Star className="w-8 h-8 mx-auto text-slate-200 mb-3" />
                      <p className="text-sm text-slate-400">No favourites yet.</p>
                      <p className="text-xs text-slate-400 mt-1">Click the star on any report to add it here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                      {favouriteReports.map((report) => (
                        <button
                          key={report.id}
                          onClick={() => handleReportSelect(report.id)}
                          className="text-left p-4 rounded-lg border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all bg-amber-50/40 group relative"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: report.categoryColor }} />
                            <div className="flex-1 min-w-0 pr-6">
                              <h3 className="font-medium text-slate-900 group-hover:text-[#121051] transition-colors line-clamp-1">{report.name}</h3>
                              <p className="text-xs text-slate-400 mt-0.5">{report.categoryName}</p>
                              <p className="text-sm text-slate-500 mt-2 line-clamp-3">{report.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => toggleFavourite(e, report.id)}
                            className="absolute top-3 right-3 text-amber-400 hover:text-amber-500 transition-colors"
                            aria-label="Remove from favourites"
                          >
                            <Star className="w-4 h-4 fill-amber-400" />
                          </button>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Category Sections */}
          {filteredCategories.map((category) => (
            <Card key={category.id} className="bg-white overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-base font-semibold text-slate-900">{category.name}</span>
                  <span className="text-sm text-slate-400">({category.reports.length} reports)</span>
                </div>
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Reports Grid */}
              {expandedCategories.includes(category.id) && (
                <div className="border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
                    {category.reports.map((report) => {
                      const isFavourite = favourites.includes(report.id)
                      return (
                        <button
                          key={report.id}
                          onClick={() => handleReportSelect(report.id)}
                          className="text-left p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-white group relative"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-2 h-2 rounded-full mt-2 shrink-0"
                              style={{ backgroundColor: category.color }}
                            />
                            <div className="flex-1 min-w-0 pr-6">
                              <h3 className="font-medium text-slate-900 group-hover:text-[#121051] transition-colors line-clamp-1">
                                {report.name}
                              </h3>
                              <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                                {report.description}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => toggleFavourite(e, report.id)}
                            className={`absolute top-3 right-3 transition-colors ${
                              isFavourite
                                ? "text-amber-400 hover:text-amber-500"
                                : "text-slate-200 hover:text-amber-300 opacity-0 group-hover:opacity-100"
                            }`}
                            aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
                          >
                            <Star className={`w-4 h-4 ${isFavourite ? "fill-amber-400" : ""}`} />
                          </button>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </Card>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No reports found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#121051] hover:underline mt-2 text-sm"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
