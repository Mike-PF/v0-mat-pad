"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Save, RotateCcw } from "lucide-react"

export function TermDatesContent() {
  const [activeTab, setActiveTab] = useState<"termdates" | "censusdates">("termdates")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("")
  const [censusDates, setCensusDates] = useState({
    autumn: "",
    spring: "",
    summer: "",
  })
  const [termDates, setTermDates] = useState({
    autumn1: { start: "", end: "" },
    autumn2: { start: "", end: "" },
    spring1: { start: "", end: "" },
    spring2: { start: "", end: "" },
    summer1: { start: "", end: "" },
    summer2: { start: "", end: "" },
  })

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

  // Generate academic years (5 years back, current, 5 years forward)
  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    // Academic year starts in September (month 8), so if we're before September,
    // the current academic year started last year
    const currentAcademicStartYear = currentMonth >= 8 ? currentYear : currentYear - 1

    const years = []
    for (let i = -5; i <= 5; i++) {
      const startYear = currentAcademicStartYear + i
      const endYear = startYear + 1
      years.push({
        value: `${startYear}/${endYear.toString().slice(-2)}`,
        label: `${startYear}/${endYear}`,
        startYear,
        isCurrent: i === 0,
        isPast: i < 0,
        isFuture: i > 0,
      })
    }
    return years
  }

  const academicYears = generateAcademicYears()
  const currentAcademicYear = academicYears.find((year) => year.isCurrent)?.value || ""

  const getYearStatus = () => {
    if (!selectedAcademicYear) return null

    const selectedYear = academicYears.find((year) => year.value === selectedAcademicYear)
    if (!selectedYear) return null

    if (selectedYear.isCurrent) {
      return { text: "Current Active Year", color: "bg-green-100 text-green-800" }
    } else if (selectedYear.isPast) {
      return { text: "Past Academic Year", color: "bg-gray-100 text-gray-800" }
    } else if (selectedYear.isFuture) {
      return { text: "Future Academic Year", color: "bg-blue-100 text-blue-800" }
    }
    return null
  }

  const termLabels = [
    { key: "autumn1", label: "Autumn Term 1", description: "September - October" },
    { key: "autumn2", label: "Autumn Term 2", description: "November - December" },
    { key: "spring1", label: "Spring Term 1", description: "January - February" },
    { key: "spring2", label: "Spring Term 2", description: "February - March" },
    { key: "summer1", label: "Summer Term 1", description: "April - May" },
    { key: "summer2", label: "Summer Term 2", description: "June - July" },
  ]

  const handleDateChange = (term: string, type: "start" | "end", value: string) => {
    setTermDates((prev) => ({
      ...prev,
      [term]: {
        ...prev[term as keyof typeof prev],
        [type]: value,
      },
    }))
  }

  const handleCensusDateChange = (term: string, value: string) => {
    setCensusDates((prev) => ({
      ...prev,
      [term]: value,
    }))
  }

  const handleSchoolChange = (school: string) => {
    setSelectedSchool(school)
    // Reset academic year when school changes
    if (!selectedAcademicYear) {
      setSelectedAcademicYear(currentAcademicYear)
    }
  }

  const handleAcademicYearChange = (year: string) => {
    setSelectedAcademicYear(year)
    // Reset term dates when academic year changes
    setTermDates({
      autumn1: { start: "", end: "" },
      autumn2: { start: "", end: "" },
      spring1: { start: "", end: "" },
      spring2: { start: "", end: "" },
      summer1: { start: "", end: "" },
      summer2: { start: "", end: "" },
    })
    setCensusDates({
      autumn: "",
      spring: "",
      summer: "",
    })
  }

  const handleSaveCensusDate = () => {
    if (!selectedSchool) {
      alert("Please select a school first")
      return
    }
    if (!selectedAcademicYear) {
      alert("Please select an academic year")
      return
    }

    // Check if all census dates are filled
    const allDatesComplete = Object.values(censusDates).every((date) => date)
    if (!allDatesComplete) {
      alert("Please fill in all census dates")
      return
    }

    console.log("Saving census dates for:", selectedSchool, selectedAcademicYear, censusDates)
    alert(`Census dates saved successfully for ${selectedSchool} (${selectedAcademicYear})!`)
  }

  const handleSave = () => {
    if (!selectedSchool) {
      alert("Please select a school first")
      return
    }

    if (!selectedAcademicYear) {
      alert("Please select an academic year")
      return
    }

    // Check if all dates are filled
    const allDatesComplete = Object.values(termDates).every((term) => term.start && term.end)
    if (!allDatesComplete) {
      alert("Please fill in all start and end dates")
      return
    }

    console.log("Saving term dates for:", selectedSchool, selectedAcademicYear, termDates)
    alert(`Term dates saved successfully for ${selectedSchool} (${selectedAcademicYear})!`)
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all term dates? This action cannot be undone.")) {
      setTermDates({
        autumn1: { start: "", end: "" },
        autumn2: { start: "", end: "" },
        spring1: { start: "", end: "" },
        spring2: { start: "", end: "" },
        summer1: { start: "", end: "" },
        summer2: { start: "", end: "" },
      })
      setCensusDates({
        autumn1: "",
        autumn2: "",
        spring1: "",
        spring2: "",
        summer1: "",
        summer2: "",
      })
    }
  }

  const yearStatus = getYearStatus()

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* School Selection Card with Integrated Submenu */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {activeTab === "termdates" ? "Term Dates Management" : "Census Dates Management"}
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Configure {activeTab === "termdates" ? "term dates" : "census dates"} for individual schools across
                academic years
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="hover:bg-[#B30089] hover:text-white hover:border-[#B30089] bg-transparent"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={activeTab === "termdates" ? handleSave : handleSaveCensusDate}
                className="bg-[#121051] hover:bg-[#B30089] hover:text-white text-white"
                style={{ backgroundColor: "#121051" }}
              >
                <Save className="w-4 h-4 mr-2" />
                {activeTab === "termdates" ? "Save Term Dates" : "Save Census Dates"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 pt-6 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* School Selection */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Select School</label>
                <div className="relative">
                  <select
                    value={selectedSchool}
                    onChange={(e) => handleSchoolChange(e.target.value)}
                    className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Please select a school...</option>
                    {schools.map((school) => (
                      <option key={school} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Academic Year Selection */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-700 mb-2">Academic Year</label>
                <div className="relative">
                  <select
                    value={selectedAcademicYear}
                    onChange={(e) => handleAcademicYearChange(e.target.value)}
                    className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!selectedSchool}
                  >
                    <option value="">Please select academic year...</option>
                    {academicYears.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                        {year.isCurrent ? " (Current)" : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("termdates")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "termdates"
                    ? "text-slate-900 border-[#B30089]"
                    : "text-slate-600 border-transparent hover:text-slate-900"
                }`}
              >
                Term Dates
              </button>
              <button
                onClick={() => setActiveTab("censusdates")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "censusdates"
                    ? "text-slate-900 border-[#B30089]"
                    : "text-slate-600 border-transparent hover:text-slate-900"
                }`}
              >
                Census Dates
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Term Dates Configuration for Term Dates Tab */}
      {selectedSchool && selectedAcademicYear && activeTab === "termdates" && (
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Term Dates for {selectedSchool}</CardTitle>
                <p className="text-sm text-slate-600">Academic Year: {selectedAcademicYear}</p>
              </div>
              {yearStatus && (
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${yearStatus.color}`}>
                  {yearStatus.text}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {termLabels.map((term) => (
                <div key={term.key} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="mb-4">
                    <h3 className="font-medium text-slate-900">{term.label}</h3>
                    <p className="text-sm text-slate-600">{term.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                      <Input
                        type="date"
                        value={termDates[term.key as keyof typeof termDates].start}
                        onChange={(e) => handleDateChange(term.key, "start", e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                      <Input
                        type="date"
                        value={termDates[term.key as keyof typeof termDates].end}
                        onChange={(e) => handleDateChange(term.key, "end", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Duration calculation */}
                  {termDates[term.key as keyof typeof termDates].start &&
                    termDates[term.key as keyof typeof termDates].end && (
                      <div className="mt-3 text-xs text-slate-600">
                        Duration: {(() => {
                          const start = new Date(termDates[term.key as keyof typeof termDates].start)
                          const end = new Date(termDates[term.key as keyof typeof termDates].end)
                          const diffTime = Math.abs(end.getTime() - start.getTime())
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                          const weeks = Math.floor(diffDays / 7)
                          const days = diffDays % 7
                          return `${weeks} weeks${days > 0 ? ` ${days} days` : ""} (${diffDays} days total)`
                        })()}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Summary Information */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Academic Year Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Total Terms:</span>
                  <span className="ml-2 text-blue-900">6 half terms</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Academic Year:</span>
                  <span className="ml-2 text-blue-900">{selectedAcademicYear}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Year Status:</span>
                  <span className="ml-2 text-blue-900">
                    {yearStatus?.text.replace(" Academic Year", "").replace("Current Active Year", "Current")}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Completion:</span>
                  <span className="ml-2 text-blue-900">
                    {Object.values(termDates).filter((term) => term.start && term.end).length}/6 terms
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Census Dates Configuration - shows 3 census periods */}
      {selectedSchool && selectedAcademicYear && activeTab === "censusdates" && (
        <Card className="flex-1">
          <CardHeader>
            <div>
              <CardTitle className="text-lg">Census Dates for {selectedSchool}</CardTitle>
              <p className="text-sm text-slate-600">Academic Year: {selectedAcademicYear}</p>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Autumn Census */}
              <div className="border border-slate-200 rounded-lg p-5 bg-white">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900" style={{ color: "#121051" }}>Autumn Census</h3>
                  <p className="text-sm text-slate-500">September - December</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Census Date</label>
                  <Input
                    type="date"
                    value={censusDates.autumn}
                    onChange={(e) => handleCensusDateChange("autumn", e.target.value)}
                    className="w-full"
                    placeholder="day-month-year"
                  />
                </div>
              </div>

              {/* Spring Census */}
              <div className="border border-slate-200 rounded-lg p-5 bg-white">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900" style={{ color: "#121051" }}>Spring Census</h3>
                  <p className="text-sm text-slate-500">January - March</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Census Date</label>
                  <Input
                    type="date"
                    value={censusDates.spring}
                    onChange={(e) => handleCensusDateChange("spring", e.target.value)}
                    className="w-full"
                    placeholder="day-month-year"
                  />
                </div>
              </div>

              {/* Summer Census */}
              <div className="border border-slate-200 rounded-lg p-5 bg-white">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900" style={{ color: "#121051" }}>Summer Census</h3>
                  <p className="text-sm text-slate-500">April - July</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Census Date</label>
                  <Input
                    type="date"
                    value={censusDates.summer}
                    onChange={(e) => handleCensusDateChange("summer", e.target.value)}
                    className="w-full"
                    placeholder="day-month-year"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Census Dates Summary */}
      {selectedSchool && selectedAcademicYear && activeTab === "censusdates" && (
        <Card className="border-l-4" style={{ borderLeftColor: "#121051" }}>
          <CardContent className="py-4">
            <h4 className="font-semibold mb-3" style={{ color: "#121051" }}>Census Dates Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <span style={{ color: "#121051" }} className="font-medium">Total Census:</span>
                <span className="ml-2 text-slate-700">3 census dates</span>
              </div>
              <div>
                <span style={{ color: "#121051" }} className="font-medium">Academic Year:</span>
                <span className="ml-2 text-slate-700">{selectedAcademicYear}</span>
              </div>
              <div>
                <span style={{ color: "#121051" }} className="font-medium">Status:</span>
                <span className="ml-2 text-slate-700">
                  {Object.values(censusDates).filter((date) => date).length === 3 ? "Complete" : "Incomplete"}
                </span>
              </div>
              <div>
                <span style={{ color: "#121051" }} className="font-medium">Completion:</span>
                <span className="ml-2 text-slate-700">
                  {Object.values(censusDates).filter((date) => date).length} / 3 dates
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Placeholder when no school or year selected */}
      {(!selectedSchool || !selectedAcademicYear) && (
        <Card className="flex-1">
          <CardContent className="flex-1 flex items-center justify-center p-12">
            <div className="bg-white border border-slate-200 rounded-lg p-12 shadow-sm max-w-md w-full">
              <div className="text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-slate-600 text-sm text-center">
                  {!selectedSchool ? "Please select an organisation" : "Please select an academic year"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
