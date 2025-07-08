"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Download, FileSpreadsheet, Users, CheckCircle, Circle, Trash2 } from "lucide-react"

interface DataField {
  id: string
  name: string
  category: string
  type: string
  description: string
}

interface SelectedPupil {
  id: string
  name: string
  year: string
  class: string
}

export function DataExportContent() {
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([])
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedPupils, setSelectedPupils] = useState<string[]>([])
  const [pupilSelectionMode, setPupilSelectionMode] = useState("")

  const dataTypes = [
    { id: "assessments", name: "Assessments", description: "Academic performance and test results" },
    { id: "behaviour", name: "Behaviour", description: "Behaviour incidents and interventions" },
    { id: "attendance", name: "Attendance", description: "Attendance records and absence data" },
    { id: "demographics", name: "Demographics", description: "Pupil personal and background information" },
    { id: "send", name: "SEND", description: "Special educational needs data" },
    { id: "pupil-premium", name: "Pupil Premium", description: "Pupil premium eligibility and impact" },
    { id: "safeguarding", name: "Safeguarding", description: "Safeguarding concerns and actions" },
    { id: "pastoral", name: "Pastoral Care", description: "Welfare and pastoral support records" },
  ]

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

  const dateRanges = [
    "Current Academic Year (2024/25)",
    "Previous Academic Year (2023/24)",
    "Current Term",
    "Previous Term",
    "Last 30 Days",
    "Last 90 Days",
    "Custom Date Range",
  ]

  const pupilSelectionModes = [
    { id: "all", name: "All Pupils", description: "Export data for all pupils in the school" },
    { id: "year-group", name: "By Year Group", description: "Select specific year groups" },
    { id: "class", name: "By Class", description: "Select specific classes" },
    { id: "individual", name: "Individual Pupils", description: "Select specific pupils" },
    {
      id: "characteristics",
      name: "By Characteristics",
      description: "Select pupils by characteristics (PP, SEND, etc.)",
    },
  ]

  const toggleDataType = (typeId: string) => {
    setSelectedDataTypes((prev) => {
      const newTypes = prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]

      // Reset fields when data types change
      setSelectedFields([])
      return newTypes
    })
  }

  const getDataFields = (): DataField[] => {
    const allFields: DataField[] = []
    const fieldMap = new Map<string, DataField>()

    selectedDataTypes.forEach((dataType) => {
      let typeFields: DataField[] = []

      switch (dataType) {
        case "assessments":
          typeFields = [
            { id: "pupil-name", name: "Pupil Name", category: "Basic", type: "text", description: "Full pupil name" },
            {
              id: "pupil-id",
              name: "Pupil ID",
              category: "Basic",
              type: "text",
              description: "Unique pupil identifier",
            },
            {
              id: "year-group",
              name: "Year Group",
              category: "Basic",
              type: "text",
              description: "Current year group",
            },
            { id: "class", name: "Class", category: "Basic", type: "text", description: "Current class/form" },
            {
              id: "ks1-reading",
              name: "KS1 Reading",
              category: "Key Stage 1",
              type: "number",
              description: "KS1 Reading assessment score",
            },
            {
              id: "ks1-writing",
              name: "KS1 Writing",
              category: "Key Stage 1",
              type: "text",
              description: "KS1 Writing assessment score",
            },
            {
              id: "ks1-maths",
              name: "KS1 Mathematics",
              category: "Key Stage 1",
              type: "number",
              description: "KS1 Mathematics assessment score",
            },
            {
              id: "ks2-reading",
              name: "KS2 Reading",
              category: "Key Stage 2",
              type: "number",
              description: "KS2 Reading scaled score",
            },
            {
              id: "ks2-writing",
              name: "KS2 Writing",
              category: "Key Stage 2",
              type: "text",
              description: "KS2 Writing teacher assessment",
            },
            {
              id: "ks2-maths",
              name: "KS2 Mathematics",
              category: "Key Stage 2",
              type: "number",
              description: "KS2 Mathematics scaled score",
            },
            {
              id: "ks2-science",
              name: "KS2 Science",
              category: "Key Stage 2",
              type: "text",
              description: "KS2 Science teacher assessment",
            },
            {
              id: "phonics-y1",
              name: "Phonics Y1",
              category: "Phonics",
              type: "number",
              description: "Year 1 phonics screening score",
            },
            {
              id: "phonics-y2",
              name: "Phonics Y2",
              category: "Phonics",
              type: "number",
              description: "Year 2 phonics screening score",
            },
            {
              id: "reading-age",
              name: "Reading Age",
              category: "Internal",
              type: "text",
              description: "Current reading age assessment",
            },
            {
              id: "spelling-age",
              name: "Spelling Age",
              category: "Internal",
              type: "text",
              description: "Current spelling age assessment",
            },
            {
              id: "progress-reading",
              name: "Reading Progress",
              category: "Progress",
              type: "number",
              description: "Reading progress score",
            },
            {
              id: "progress-writing",
              name: "Writing Progress",
              category: "Progress",
              type: "number",
              description: "Writing progress score",
            },
            {
              id: "progress-maths",
              name: "Maths Progress",
              category: "Progress",
              type: "number",
              description: "Mathematics progress score",
            },
          ]
          break
        case "behaviour":
          typeFields = [
            { id: "pupil-name", name: "Pupil Name", category: "Basic", type: "text", description: "Full pupil name" },
            {
              id: "pupil-id",
              name: "Pupil ID",
              category: "Basic",
              type: "text",
              description: "Unique pupil identifier",
            },
            {
              id: "year-group",
              name: "Year Group",
              category: "Basic",
              type: "text",
              description: "Current year group",
            },
            { id: "class", name: "Class", category: "Basic", type: "text", description: "Current class/form" },
            {
              id: "incident-date",
              name: "Incident Date",
              category: "Incident",
              type: "date",
              description: "Date of behaviour incident",
            },
            {
              id: "incident-type",
              name: "Incident Type",
              category: "Incident",
              type: "text",
              description: "Type of behaviour incident",
            },
            {
              id: "incident-severity",
              name: "Severity",
              category: "Incident",
              type: "text",
              description: "Severity level of incident",
            },
            {
              id: "incident-location",
              name: "Location",
              category: "Incident",
              type: "text",
              description: "Where incident occurred",
            },
            { id: "incident-time", name: "Time", category: "Incident", type: "time", description: "Time of incident" },
            {
              id: "staff-member",
              name: "Staff Member",
              category: "Incident",
              type: "text",
              description: "Staff member reporting",
            },
            {
              id: "action-taken",
              name: "Action Taken",
              category: "Response",
              type: "text",
              description: "Disciplinary action taken",
            },
            { id: "sanction", name: "Sanction", category: "Response", type: "text", description: "Sanction applied" },
            {
              id: "intervention",
              name: "Intervention",
              category: "Response",
              type: "text",
              description: "Support intervention provided",
            },
            {
              id: "parent-contact",
              name: "Parent Contact",
              category: "Response",
              type: "boolean",
              description: "Whether parents were contacted",
            },
            {
              id: "follow-up",
              name: "Follow-up Required",
              category: "Response",
              type: "boolean",
              description: "Whether follow-up is needed",
            },
            {
              id: "resolved",
              name: "Resolved",
              category: "Status",
              type: "boolean",
              description: "Whether incident is resolved",
            },
          ]
          break
        case "attendance":
          typeFields = [
            { id: "pupil-name", name: "Pupil Name", category: "Basic", type: "text", description: "Full pupil name" },
            {
              id: "pupil-id",
              name: "Pupil ID",
              category: "Basic",
              type: "text",
              description: "Unique pupil identifier",
            },
            {
              id: "year-group",
              name: "Year Group",
              category: "Basic",
              type: "text",
              description: "Current year group",
            },
            { id: "class", name: "Class", category: "Basic", type: "text", description: "Current class/form" },
            {
              id: "attendance-date",
              name: "Date",
              category: "Attendance",
              type: "date",
              description: "Attendance date",
            },
            {
              id: "am-session",
              name: "AM Session",
              category: "Attendance",
              type: "text",
              description: "Morning session attendance",
            },
            {
              id: "pm-session",
              name: "PM Session",
              category: "Attendance",
              type: "text",
              description: "Afternoon session attendance",
            },
            {
              id: "absence-code",
              name: "Absence Code",
              category: "Attendance",
              type: "text",
              description: "DfE absence code",
            },
            {
              id: "absence-reason",
              name: "Absence Reason",
              category: "Attendance",
              type: "text",
              description: "Reason for absence",
            },
            {
              id: "authorised",
              name: "Authorised",
              category: "Attendance",
              type: "boolean",
              description: "Whether absence is authorised",
            },
            {
              id: "late-minutes",
              name: "Late Minutes",
              category: "Attendance",
              type: "number",
              description: "Minutes late if applicable",
            },
            {
              id: "overall-attendance",
              name: "Overall Attendance %",
              category: "Summary",
              type: "number",
              description: "Overall attendance percentage",
            },
            {
              id: "authorised-absence",
              name: "Authorised Absence %",
              category: "Summary",
              type: "number",
              description: "Authorised absence percentage",
            },
            {
              id: "unauthorised-absence",
              name: "Unauthorised Absence %",
              category: "Summary",
              type: "number",
              description: "Unauthorised absence percentage",
            },
            {
              id: "persistent-absence",
              name: "Persistent Absence",
              category: "Summary",
              type: "boolean",
              description: "Whether pupil is persistently absent",
            },
            {
              id: "sessions-possible",
              name: "Sessions Possible",
              category: "Summary",
              type: "number",
              description: "Total possible sessions",
            },
            {
              id: "sessions-attended",
              name: "Sessions Attended",
              category: "Summary",
              type: "number",
              description: "Total sessions attended",
            },
          ]
          break
        case "demographics":
          typeFields = [
            { id: "pupil-name", name: "Pupil Name", category: "Basic", type: "text", description: "Full pupil name" },
            {
              id: "pupil-id",
              name: "Pupil ID",
              category: "Basic",
              type: "text",
              description: "Unique pupil identifier",
            },
            { id: "upn", name: "UPN", category: "Basic", type: "text", description: "Unique Pupil Number" },
            { id: "dob", name: "Date of Birth", category: "Basic", type: "date", description: "Pupil date of birth" },
            { id: "gender", name: "Gender", category: "Basic", type: "text", description: "Pupil gender" },
            {
              id: "ethnicity",
              name: "Ethnicity",
              category: "Demographics",
              type: "text",
              description: "Ethnic background",
            },
            {
              id: "first-language",
              name: "First Language",
              category: "Demographics",
              type: "text",
              description: "First language spoken",
            },
            {
              id: "eal",
              name: "EAL",
              category: "Demographics",
              type: "boolean",
              description: "English as Additional Language",
            },
            {
              id: "pupil-premium",
              name: "Pupil Premium",
              category: "Funding",
              type: "boolean",
              description: "Pupil Premium eligibility",
            },
            {
              id: "fsm",
              name: "Free School Meals",
              category: "Funding",
              type: "boolean",
              description: "Free School Meals eligibility",
            },
            {
              id: "looked-after",
              name: "Looked After",
              category: "Care",
              type: "boolean",
              description: "Looked After Child status",
            },
            {
              id: "service-child",
              name: "Service Child",
              category: "Care",
              type: "boolean",
              description: "Service child status",
            },
            {
              id: "young-carer",
              name: "Young Carer",
              category: "Care",
              type: "boolean",
              description: "Young carer status",
            },
            { id: "address", name: "Address", category: "Contact", type: "text", description: "Home address" },
            { id: "postcode", name: "Postcode", category: "Contact", type: "text", description: "Home postcode" },
          ]
          break
        default:
          break
      }

      // Add fields to map to avoid duplicates
      typeFields.forEach((field) => {
        if (!fieldMap.has(field.id)) {
          fieldMap.set(field.id, field)
        }
      })
    })

    // Convert map back to array
    return Array.from(fieldMap.values())
  }

  const mockPupils: SelectedPupil[] = [
    { id: "1", name: "Emma Thompson", year: "Year 6", class: "6A" },
    { id: "2", name: "James Wilson", year: "Year 6", class: "6A" },
    { id: "3", name: "Sophie Brown", year: "Year 6", class: "6B" },
    { id: "4", name: "Oliver Davis", year: "Year 5", class: "5A" },
    { id: "5", name: "Isabella Garcia", year: "Year 5", class: "5A" },
    { id: "6", name: "William Johnson", year: "Year 5", class: "5B" },
    { id: "7", name: "Charlotte Miller", year: "Year 4", class: "4A" },
    { id: "8", name: "Benjamin Anderson", year: "Year 4", class: "4A" },
    { id: "9", name: "Amelia Taylor", year: "Year 4", class: "4B" },
    { id: "10", name: "Lucas Martinez", year: "Year 3", class: "3A" },
  ]

  const dataFields = getDataFields()
  const fieldCategories = [...new Set(dataFields.map((field) => field.category))]

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) => (prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]))
  }

  const togglePupil = (pupilId: string) => {
    setSelectedPupils((prev) => (prev.includes(pupilId) ? prev.filter((id) => id !== pupilId) : [...prev, pupilId]))
  }

  const selectAllFields = () => {
    setSelectedFields(dataFields.map((field) => field.id))
  }

  const clearAllFields = () => {
    setSelectedFields([])
  }

  const selectAllPupils = () => {
    setSelectedPupils(mockPupils.map((pupil) => pupil.id))
  }

  const clearAllPupils = () => {
    setSelectedPupils([])
  }

  const canExport = () => {
    return (
      selectedDataTypes.length > 0 &&
      selectedSchool &&
      selectedDateRange &&
      selectedFields.length > 0 &&
      selectedPupils.length > 0
    )
  }

  const handleExport = () => {
    if (canExport()) {
      // Show export preview instead of actual export
      const exportSummary = `Export Configuration:
    
Data Type: ${selectedDataTypes.map((id) => dataTypes.find((t) => t.id === id)?.name).join(", ")}
School: ${selectedSchool}
Date Range: ${selectedDateRange}
Fields: ${selectedFields.length} selected
Pupils: ${selectedPupils.length} selected

This would generate an Excel file with ${selectedFields.length * selectedPupils.length} data points.`

      alert(exportSummary)
    }
  }

  const generateMockData = (field: DataField, pupil: SelectedPupil, rowIndex: number) => {
    // Generate realistic mock data based on field type and category
    const pupilIndex = Number.parseInt(pupil.id)

    switch (field.id) {
      case "pupil-name":
        return pupil.name
      case "year-group":
        return pupil.year
      case "class":
        return pupil.class
      case "pupil-id":
        return `P${pupil.id.padStart(4, "0")}`
      case "upn":
        return `A${(1000000000000 + pupilIndex * 123456789).toString().substr(0, 13)}`
      case "dob":
        const age = Number.parseInt(pupil.year.replace("Year ", "")) + 4
        const birthYear = new Date().getFullYear() - age
        const month = (pupilIndex % 12) + 1
        const day = (pupilIndex % 28) + 1
        return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${birthYear}`
      case "gender":
        return pupilIndex % 2 === 0 ? "Female" : "Male"
      case "ethnicity":
        const ethnicities = [
          "White British",
          "Asian British",
          "Black British",
          "Mixed Heritage",
          "White Other",
          "Chinese",
        ]
        return ethnicities[pupilIndex % ethnicities.length]
      case "first-language":
        const languages = ["English", "Urdu", "Polish", "Arabic", "Spanish", "French"]
        return languages[pupilIndex % languages.length]
      case "pupil-premium":
        return pupilIndex % 4 === 0 ? "Yes" : "No"
      case "fsm":
        return pupilIndex % 5 === 0 ? "Yes" : "No"
      case "eal":
        return pupilIndex % 6 === 0 ? "Yes" : "No"
      case "looked-after":
        return pupilIndex % 20 === 0 ? "Yes" : "No"
      case "service-child":
        return pupilIndex % 15 === 0 ? "Yes" : "No"
      case "young-carer":
        return pupilIndex % 25 === 0 ? "Yes" : "No"
      case "overall-attendance":
        return `${(85 + (pupilIndex % 15)).toFixed(1)}%`
      case "authorised-absence":
        return `${(pupilIndex % 8).toFixed(1)}%`
      case "unauthorised-absence":
        return `${(pupilIndex % 3).toFixed(1)}%`
      case "persistent-absence":
        return pupilIndex % 10 === 0 ? "Yes" : "No"
      case "sessions-possible":
        return 190 + (pupilIndex % 10)
      case "sessions-attended":
        const possible = 190 + (pupilIndex % 10)
        return Math.floor(possible * (0.85 + (pupilIndex % 15) / 100))
      case "ks1-reading":
      case "ks1-maths":
        const ks1Scores = ["Working Towards", "Expected", "Greater Depth"]
        return ks1Scores[pupilIndex % 3]
      case "ks1-writing":
        const ks1Writing = ["Working Towards", "Expected", "Greater Depth"]
        return ks1Writing[pupilIndex % 3]
      case "ks2-reading":
      case "ks2-maths":
        return 80 + (pupilIndex % 40)
      case "ks2-writing":
      case "ks2-science":
        const ks2Levels = ["Working Towards", "Expected", "Greater Depth"]
        return ks2Levels[pupilIndex % 3]
      case "phonics-y1":
      case "phonics-y2":
        return 20 + (pupilIndex % 20)
      case "reading-age":
      case "spelling-age":
        const baseAge = Number.parseInt(pupil.year.replace("Year ", "")) + 4
        const variance = (pupilIndex % 3) - 1 // -1, 0, or 1
        return `${baseAge + variance} years ${pupilIndex % 12} months`
      case "progress-reading":
      case "progress-writing":
      case "progress-maths":
        return (pupilIndex % 7) - 3 // Range from -3 to +3
      case "incident-date":
        const date = new Date()
        date.setDate(date.getDate() - (pupilIndex % 90))
        return date.toLocaleDateString()
      case "incident-type":
        const incidents = ["Disruption", "Defiance", "Physical Aggression", "Verbal Abuse", "Late to Class", "Uniform"]
        return incidents[pupilIndex % incidents.length]
      case "incident-severity":
        const severities = ["Low", "Medium", "High"]
        return severities[pupilIndex % 3]
      case "incident-location":
        const locations = ["Classroom", "Playground", "Corridor", "Dining Hall", "Library", "Sports Hall"]
        return locations[pupilIndex % locations.length]
      case "incident-time":
        const hour = 9 + (pupilIndex % 7) // 9 AM to 3 PM
        const minute = (pupilIndex % 6) * 10
        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
      case "staff-member":
        const staff = ["Mr. Smith", "Ms. Johnson", "Mrs. Brown", "Mr. Davis", "Ms. Wilson", "Mrs. Taylor"]
        return staff[pupilIndex % staff.length]
      case "action-taken":
        const actions = [
          "Verbal Warning",
          "Written Warning",
          "Detention",
          "Internal Exclusion",
          "Parent Meeting",
          "Behaviour Plan",
        ]
        return actions[pupilIndex % actions.length]
      case "sanction":
        const sanctions = [
          "None",
          "Lunchtime Detention",
          "After School Detention",
          "Loss of Privileges",
          "Community Service",
        ]
        return sanctions[pupilIndex % sanctions.length]
      case "intervention":
        const interventions = [
          "None",
          "Mentoring",
          "Counselling",
          "Anger Management",
          "Social Skills",
          "Academic Support",
        ]
        return interventions[pupilIndex % interventions.length]
      case "resolved":
      case "authorised":
      case "parent-contact":
      case "follow-up":
        return pupilIndex % 3 === 0 ? "No" : "Yes"
      case "address":
        return `${10 + pupilIndex} ${["Oak", "Elm", "Pine", "Maple", "Cedar"][pupilIndex % 5]} Street`
      case "postcode":
        return `S${1 + (pupilIndex % 9)} ${pupilIndex % 9}${["AA", "BB", "CC", "DD"][pupilIndex % 4]}`
      default:
        // Generate data based on field type
        switch (field.type) {
          case "number":
            return 50 + (pupilIndex % 50)
          case "boolean":
            return pupilIndex % 3 === 0 ? "No" : "Yes"
          case "date":
            const randomDate = new Date()
            randomDate.setDate(randomDate.getDate() - (pupilIndex % 365))
            return randomDate.toLocaleDateString()
          case "time":
            const h = 9 + (pupilIndex % 7)
            const m = (pupilIndex % 6) * 10
            return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
          default:
            return `Sample ${field.type} data ${pupilIndex}`
        }
    }
  }

  return (
    <div className="h-full bg-slate-50 overflow-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            Data Export
          </CardTitle>
          <p className="text-sm text-slate-600">Export pupil data to Excel spreadsheets for analysis and reporting</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* School and Pupil Selection - FIRST */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Select School and Pupils</CardTitle>
              <p className="text-sm text-slate-600">Choose the school and pupils for your data export</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* School Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  School <span className="text-red-500">*</span>
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

              {/* Pupil Selection - only show when school is selected */}
              {selectedSchool && (
                <>
                  {/* Pupil Selection Mode */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pupil Selection Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {pupilSelectionModes.map((mode) => (
                        <div
                          key={mode.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 ${
                            pupilSelectionMode === mode.id ? "border-blue-500 bg-blue-50" : "border-slate-200"
                          }`}
                          onClick={() => {
                            setPupilSelectionMode(mode.id)
                            // Reset pupil selection when mode changes
                            setSelectedPupils([])
                          }}
                        >
                          <div className="font-medium text-sm text-slate-900">{mode.name}</div>
                          <div className="text-xs text-slate-600">{mode.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Selection Options based on mode */}
                  {pupilSelectionMode === "year-group" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Select Year Groups</label>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[
                          "Reception",
                          "Year 1",
                          "Year 2",
                          "Year 3",
                          "Year 4",
                          "Year 5",
                          "Year 6",
                          "Year 7",
                          "Year 8",
                          "Year 9",
                          "Year 10",
                          "Year 11",
                        ].map((year) => (
                          <div
                            key={year}
                            className="p-2 border border-slate-200 rounded text-center text-sm cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                          >
                            {year}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pupilSelectionMode === "class" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Select Classes</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {["6A", "6B", "5A", "5B", "4A", "4B", "3A", "3B", "2A", "2B", "1A", "1B", "RA", "RB"].map(
                          (className) => (
                            <div
                              key={className}
                              className="p-2 border border-slate-200 rounded text-center text-sm cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {className}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {pupilSelectionMode === "characteristics" && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-slate-700">Filter by Characteristics</label>

                      {/* Phase Selection */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Phase</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {["Early Years", "Key Stage 1", "Key Stage 2", "Key Stage 3", "Key Stage 4"].map((phase) => (
                            <div
                              key={phase}
                              className="p-2 border border-slate-200 rounded text-center text-xs cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {phase}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gender Selection */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Gender</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {["Male", "Female", "Other/Not Specified"].map((gender) => (
                            <div
                              key={gender}
                              className="p-2 border border-slate-200 rounded text-center text-xs cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {gender}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Funding & Support */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Funding & Support</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Pupil Premium",
                            "Free School Meals (Current)",
                            "Free School Meals (Ever 6)",
                            "Service Premium",
                            "Early Years Pupil Premium",
                            "Pupil Premium Plus",
                          ].map((funding) => (
                            <div
                              key={funding}
                              className="p-2 border border-slate-200 rounded text-center text-xs cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {funding}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SEND Categories */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Special Educational Needs</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "No SEN",
                            "SEN Support",
                            "EHCP",
                            "Specific Learning Difficulty",
                            "Moderate Learning Difficulty",
                            "Severe Learning Difficulty",
                            "Profound & Multiple Learning Difficulty",
                            "Social, Emotional & Mental Health",
                            "Speech, Language & Communication",
                            "Hearing Impairment",
                            "Visual Impairment",
                            "Multi-Sensory Impairment",
                            "Physical Disability",
                            "Autistic Spectrum Disorder",
                            "Other Difficulty/Disability",
                          ].map((sen) => (
                            <div
                              key={sen}
                              className="p-2 border border-slate-200 rounded text-center text-xs cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {sen}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Language & Ethnicity */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Language & Ethnicity</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "English as Additional Language (EAL)",
                            "English First Language",
                            "White British",
                            "White Other",
                            "Mixed Heritage",
                            "Asian or Asian British",
                            "Black or Black British",
                            "Chinese",
                            "Any Other Ethnic Group",
                            "Information Not Yet Obtained",
                            "Refused to Provide",
                          ].map((ethnicity) => (
                            <div
                              key={ethnicity}
                              className="p-2 border border-slate-200 rounded text-center text-xs cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {ethnicity}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Care & Welfare */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Care & Welfare Status</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Looked After Child (LAC)",
                            "Previously Looked After",
                            "Child in Need",
                            "Child Protection Plan",
                            "Young Carer",
                            "Service Child (Armed Forces)",
                            "Traveller",
                            "Refugee/Asylum Seeker",
                            "Unaccompanied Asylum Seeker",
                          ].map((care) => (
                            <div
                              key={care}
                              className="p-2 border border-slate-200 rounded text-center text-xs cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {care}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Attendance Categories */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Attendance Categories</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Excellent Attendance (97%+)",
                            "Good Attendance (95-97%)",
                            "Concerning Attendance (90-95%)",
                            "Persistent Absence (Below 90%)",
                            "Severe Absence (Below 50%)",
                            "Chronic Absence (Below 10%)",
                          ].map((attendance) => (
                            <div
                              key={attendance}
                              className="p-2 border border-slate-200 rounded text-center text-xs cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {attendance}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Academic Performance */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Academic Performance</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Above Expected Standard",
                            "At Expected Standard",
                            "Working Towards Expected",
                            "Below Expected Standard",
                            "Significantly Below Expected",
                            "Greater Depth/Higher Standard",
                            "Gifted & Talented",
                            "More Able",
                          ].map((performance) => (
                            <div
                              key={performance}
                              className="p-2 border border-slate-200 rounded text-center text-xs cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {performance}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Behaviour Categories */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Behaviour Categories</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "No Behaviour Concerns",
                            "Minor Behaviour Issues",
                            "Moderate Behaviour Concerns",
                            "Significant Behaviour Issues",
                            "On Behaviour Support Plan",
                            "Recent Suspensions",
                            "Risk of Exclusion",
                            "Pastoral Support Programme",
                          ].map((behaviour) => (
                            <div
                              key={behaviour}
                              className="p-2 border border-slate-200 rounded text-center text-xs cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                            >
                              {behaviour}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Apply Filters Button */}
                      <div className="pt-4 border-t border-slate-200">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Apply Filters & Load Pupils
                        </Button>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                          Select your criteria above, then click to load matching pupils
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pupil List - Show for all modes except when characteristics is selected but not applied */}
                  {pupilSelectionMode && (pupilSelectionMode !== "characteristics" || selectedPupils.length > 0) && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-900 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {pupilSelectionMode === "all"
                            ? "All Pupils"
                            : pupilSelectionMode === "year-group"
                              ? "Pupils in Selected Year Groups"
                              : pupilSelectionMode === "class"
                                ? "Pupils in Selected Classes"
                                : pupilSelectionMode === "individual"
                                  ? "Available Pupils"
                                  : "Filtered Pupils"}
                          <Badge variant="outline">{mockPupils.length} pupils</Badge>
                        </h4>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={selectAllPupils}>
                            Select All
                          </Button>
                          <Button variant="outline" size="sm" onClick={clearAllPupils}>
                            Clear All
                          </Button>
                        </div>
                      </div>

                      {/* Search within pupils */}
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Search pupils by name, year, or class..."
                          className="w-full p-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
                        {mockPupils.map((pupil) => (
                          <div
                            key={pupil.id}
                            className={`p-3 border-b border-slate-100 last:border-b-0 cursor-pointer transition-all hover:bg-slate-50 ${
                              selectedPupils.includes(pupil.id) ? "bg-blue-50" : ""
                            }`}
                            onClick={() => togglePupil(pupil.id)}
                          >
                            <div className="flex items-center gap-3">
                              {selectedPupils.includes(pupil.id) ? (
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400" />
                              )}
                              <div className="flex-1">
                                <div className="font-medium text-sm text-slate-900">{pupil.name}</div>
                                <div className="text-xs text-slate-600">
                                  {pupil.year} • {pupil.class}
                                  {/* Add mock characteristics badges */}
                                  {pupil.id === "1" && (
                                    <span className="ml-2 px-1 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                                      PP
                                    </span>
                                  )}
                                  {pupil.id === "3" && (
                                    <span className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                      SEN
                                    </span>
                                  )}
                                  {pupil.id === "5" && (
                                    <span className="ml-2 px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                      EAL
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Quick info badges */}
                              <div className="flex gap-1">
                                {pupil.id === "1" && (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full" title="Pupil Premium"></div>
                                )}
                                {pupil.id === "3" && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" title="SEN Support"></div>
                                )}
                                {pupil.id === "5" && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full" title="EAL"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Selection Summary */}
                      {selectedPupils.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-900">
                            <strong>{selectedPupils.length}</strong> pupils selected for export
                          </div>
                          <div className="text-xs text-blue-700 mt-1">
                            {pupilSelectionMode === "characteristics" && "Based on applied filters • "}
                            Click pupils above to add/remove from selection
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Data Type Selection - SECOND */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Select Data Type</CardTitle>
              <p className="text-sm text-slate-600">Choose the type of data you want to export</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {dataTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedDataTypes.includes(type.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => toggleDataType(type.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {selectedDataTypes.includes(type.id) ? (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                      <h4 className="font-medium text-slate-900">{type.name}</h4>
                    </div>
                    <p className="text-sm text-slate-600">{type.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date Range Selection - THIRD */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Select Date Range</CardTitle>
              <p className="text-sm text-slate-600">Choose the time period for your export</p>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date Range <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select date range...</option>
                    {dateRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Fields Selection - FOURTH */}
          {selectedDataTypes.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">4. Select Data Fields</CardTitle>
                    <p className="text-sm text-slate-600">Choose which data fields to include in your export</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAllFields}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAllFields}>
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {fieldCategories.map((category) => (
                    <div key={category}>
                      <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                        {category}
                        <Badge variant="outline">
                          {dataFields.filter((field) => field.category === category).length} fields
                        </Badge>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {dataFields
                          .filter((field) => field.category === category)
                          .map((field) => (
                            <div
                              key={field.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 ${
                                selectedFields.includes(field.id) ? "border-blue-500 bg-blue-50" : "border-slate-200"
                              }`}
                              onClick={() => toggleField(field.id)}
                            >
                              <div className="flex items-center gap-2">
                                {selectedFields.includes(field.id) ? (
                                  <CheckCircle className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-400" />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-slate-900">{field.name}</div>
                                  <div className="text-xs text-slate-600">{field.description}</div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {field.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Preview - FIFTH */}
          {selectedDataTypes.length > 0 && selectedFields.length > 0 && selectedPupils.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">5. Data Preview</CardTitle>
                <p className="text-sm text-slate-600">
                  Complete preview of the data table that will be exported ({selectedPupils.length} pupils ×{" "}
                  {selectedFields.length} fields)
                </p>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-auto max-h-[600px]">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-slate-100 sticky top-0 z-10">
                        <tr>
                          <th className="text-left p-3 font-semibold border border-slate-300 bg-slate-100 sticky left-0 z-20 min-w-40">
                            Pupil
                          </th>
                          {selectedFields.map((fieldId) => {
                            const field = dataFields.find((f) => f.id === fieldId)
                            return field ? (
                              <th
                                key={fieldId}
                                className="text-left p-3 font-semibold border border-slate-300 bg-slate-100 min-w-32"
                              >
                                <div className="flex flex-col">
                                  <span>{field.name}</span>
                                  <span className="text-xs font-normal text-slate-500 mt-1">
                                    {field.category} • {field.type}
                                  </span>
                                </div>
                              </th>
                            ) : null
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPupils.map((pupilId, rowIndex) => {
                          const pupil = mockPupils.find((p) => p.id === pupilId)
                          return pupil ? (
                            <tr
                              key={pupilId}
                              className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-blue-50`}
                            >
                              <td className="p-3 border border-slate-300 font-medium bg-slate-50 sticky left-0 z-10">
                                <div className="flex flex-col">
                                  <span className="text-slate-900">{pupil.name}</span>
                                  <span className="text-xs text-slate-600">
                                    {pupil.year} • {pupil.class}
                                  </span>
                                  <div className="flex gap-1 mt-1">
                                    {pupil.id === "1" && (
                                      <span className="px-1 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                                        PP
                                      </span>
                                    )}
                                    {pupil.id === "3" && (
                                      <span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">SEN</span>
                                    )}
                                    {pupil.id === "5" && (
                                      <span className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                        EAL
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              {selectedFields.map((fieldId) => {
                                const field = dataFields.find((f) => f.id === fieldId)
                                if (!field) return null

                                const cellValue = generateMockData(field, pupil, rowIndex)

                                return (
                                  <td key={fieldId} className="p-3 border border-slate-300 text-slate-700">
                                    <div className="flex flex-col">
                                      <span
                                        className={`${field.type === "number" ? "font-mono" : ""} ${
                                          field.type === "boolean" && cellValue === "Yes"
                                            ? "text-green-700 font-medium"
                                            : field.type === "boolean" && cellValue === "No"
                                              ? "text-red-700"
                                              : field.category === "Progress" &&
                                                  typeof cellValue === "number" &&
                                                  cellValue > 0
                                                ? "text-green-700"
                                                : field.category === "Progress" &&
                                                    typeof cellValue === "number" &&
                                                    cellValue < 0
                                                  ? "text-red-700"
                                                  : ""
                                        }`}
                                      >
                                        {cellValue}
                                      </span>
                                      {field.type === "number" && field.category === "Progress" && (
                                        <span className="text-xs text-slate-500 mt-1">
                                          {typeof cellValue === "number" && cellValue > 0
                                            ? "Above Expected"
                                            : typeof cellValue === "number" && cellValue < 0
                                              ? "Below Expected"
                                              : "On Track"}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                )
                              })}
                            </tr>
                          ) : null
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Enhanced Export Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-2">Data Overview</div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div>• Total pupils: {selectedPupils.length}</div>
                      <div>• Total fields: {selectedFields.length}</div>
                      <div>• Data points: {selectedPupils.length * selectedFields.length}</div>
                      <div>• File format: Excel (.xlsx)</div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-900 mb-2">Data Types Included</div>
                    <div className="text-xs text-green-700 space-y-1">
                      {selectedDataTypes.map((typeId) => {
                        const type = dataTypes.find((t) => t.id === typeId)
                        const typeFields = dataFields.filter(
                          (f) =>
                            selectedFields.includes(f.id) &&
                            ((typeId === "assessments" &&
                              ["Basic", "Key Stage 1", "Key Stage 2", "Phonics", "Internal", "Progress"].includes(
                                f.category,
                              )) ||
                              (typeId === "behaviour" &&
                                ["Basic", "Incident", "Response", "Status"].includes(f.category)) ||
                              (typeId === "attendance" && ["Basic", "Attendance", "Summary"].includes(f.category)) ||
                              (typeId === "demographics" &&
                                ["Basic", "Demographics", "Funding", "Care", "Contact"].includes(f.category))),
                        )
                        return type ? (
                          <div key={typeId}>
                            • {type.name} ({typeFields.length} fields)
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-sm font-medium text-orange-900 mb-2">Export Details</div>
                    <div className="text-xs text-orange-700 space-y-1">
                      <div>• School: {selectedSchool}</div>
                      <div>• Period: {selectedDateRange}</div>
                      <div>• Generated: {new Date().toLocaleString()}</div>
                      <div>• Est. size: ~{Math.ceil((selectedFields.length * selectedPupils.length) / 100)}KB</div>
                    </div>
                  </div>
                </div>

                {/* Field Categories Breakdown */}
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm font-medium text-slate-900 mb-3">Field Categories Breakdown</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {fieldCategories.map((category) => {
                      const categoryFields = dataFields.filter(
                        (field) => field.category === category && selectedFields.includes(field.id),
                      )
                      return categoryFields.length > 0 ? (
                        <div key={category} className="text-xs">
                          <div className="font-medium text-slate-700">{category}</div>
                          <div className="text-slate-600">{categoryFields.length} fields</div>
                          <div className="mt-1 space-y-1">
                            {categoryFields.slice(0, 3).map((field) => (
                              <div key={field.id} className="text-slate-500">
                                • {field.name}
                              </div>
                            ))}
                            {categoryFields.length > 3 && (
                              <div className="text-slate-400">+{categoryFields.length - 3} more...</div>
                            )}
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Export Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                Export Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Configuration Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Data Type:</span>
                  <span className="font-medium text-slate-900">
                    {selectedDataTypes.length > 0
                      ? selectedDataTypes.map((id) => dataTypes.find((t) => t.id === id)?.name).join(", ")
                      : "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">School:</span>
                  <span className="font-medium text-slate-900 text-right">{selectedSchool || "Not selected"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Date Range:</span>
                  <span className="font-medium text-slate-900 text-right">{selectedDateRange || "Not selected"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Data Fields:</span>
                  <span className="font-medium text-slate-900">{selectedFields.length} selected</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Pupils:</span>
                  <span className="font-medium text-slate-900">{selectedPupils.length} selected</span>
                </div>
              </div>

              {/* Export Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <Button
                  onClick={handleExport}
                  disabled={!canExport()}
                  className="w-full text-white"
                  style={{ backgroundColor: canExport() ? "#121051" : undefined }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>

                {canExport() && (
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>• File format: Excel (.xlsx)</div>
                    <div>• Estimated size: ~{Math.ceil((selectedFields.length * selectedPupils.length) / 100)}KB</div>
                    <div>• Generated: {new Date().toLocaleString()}</div>
                  </div>
                )}
              </div>

              {/* Selected Fields Preview */}
              {selectedFields.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Selected Fields</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {selectedFields.map((fieldId) => {
                      const field = dataFields.find((f) => f.id === fieldId)
                      return field ? (
                        <div key={fieldId} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{field.name}</span>
                          <button onClick={() => toggleField(fieldId)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Selected Pupils Preview */}
              {selectedPupils.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Selected Pupils ({selectedPupils.length})</h4>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {selectedPupils.map((pupilId) => {
                      const pupil = mockPupils.find((p) => p.id === pupilId)
                      return pupil ? (
                        <div key={pupilId} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{pupil.name}</span>
                          <button onClick={() => togglePupil(pupilId)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
