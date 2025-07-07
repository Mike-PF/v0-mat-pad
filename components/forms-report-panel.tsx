"use client"

import { ChevronDown, CheckCircle, Circle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
  completed?: boolean
  subsections?: { id: string; title: string; completed?: boolean }[]
}

interface FormsReportPanelProps {
  selectedForm: string
  selectedSchool: string
  selectedTerm: string
  onFormChange: (value: string) => void
  onSchoolChange: (value: string) => void
  onTermChange: (value: string) => void
  activeSection: string
  onSectionClick: (sectionId: string) => void
  onClearForm: () => void
}

export function FormsReportPanel({
  selectedForm,
  selectedSchool,
  selectedTerm,
  onFormChange,
  onSchoolChange,
  onTermChange,
  activeSection,
  onSectionClick,
  onClearForm,
}: FormsReportPanelProps) {
  const forms = [
    "Headteacher's Report - Educational",
    "Headteacher's Report - Financial",
    "Annual Report",
    "Self-Evaluation Form",
  ]

  const schools = [
    "Holy Family Catholic Academy",
    "St. Mary's Primary School",
    "Sacred Heart Academy",
    "St. Joseph's School",
  ]

  const terms = ["Summer 2024/25", "Spring 2024/25", "Autumn 2024/25", "Summer 2023/24"]

  const sections: Section[] = [
    {
      id: "academy-vision",
      title: "Academy Vision",
      completed: true,
    },
    {
      id: "introduction",
      title: "Introduction to the Report",
      completed: true,
    },
    {
      id: "self-evaluation",
      title: "Self-Evaluation",
      subsections: [
        { id: "self-eval-overall", title: "Overall Effectiveness", completed: true },
        { id: "self-eval-quality", title: "Quality of Education" },
        { id: "self-eval-behaviour", title: "Behaviour and Attitudes" },
        { id: "self-eval-leadership", title: "Leadership and Management" },
      ],
    },
    {
      id: "statutory-assessments",
      title: "Statutory Assessments",
      subsections: [
        { id: "key-stage-1", title: "Key Stage 1 Results" },
        { id: "key-stage-2", title: "Key Stage 2 Results" },
        { id: "phonics-screening", title: "Phonics Screening" },
        { id: "early-years", title: "Early Years Foundation Stage" },
      ],
    },
    {
      id: "key-priorities",
      title: "Key Priorities",
      subsections: [
        { id: "priority-1", title: "Priority 1: Curriculum Development" },
        { id: "priority-2", title: "Priority 2: Staff Development" },
        { id: "priority-3", title: "Student Wellbeing" },
        { id: "priority-4", title: "Community Engagement" },
        { id: "priority-5", title: "Digital Learning" },
      ],
    },
    {
      id: "targets",
      title: "Targets",
      subsections: [
        { id: "academic-targets", title: "Academic Targets" },
        { id: "attendance-targets", title: "Attendance Targets" },
        { id: "behaviour-targets", title: "Behaviour Targets" },
      ],
    },
    {
      id: "catholic-life",
      title: "Catholic Life, Religious Education and Collective Worship",
      subsections: [
        { id: "catholic-ethos", title: "Catholic Ethos and Mission" },
        { id: "religious-education", title: "Religious Education" },
        { id: "collective-worship", title: "Collective Worship" },
        { id: "spiritual-development", title: "Spiritual Development" },
      ],
    },
    {
      id: "curriculum",
      title: "Primary Curriculum Implementation",
      subsections: [
        { id: "curriculum-design", title: "Curriculum Design and Intent" },
        { id: "curriculum-delivery", title: "Implementation and Delivery" },
        { id: "curriculum-impact", title: "Impact and Assessment" },
      ],
    },
    {
      id: "educational-visits",
      title: "Educational Visits",
    },
    {
      id: "professional-development",
      title: "Professional Development",
      subsections: [
        { id: "cpd-plan", title: "CPD Plan and Strategy" },
        { id: "teacher-training", title: "Teacher Training" },
        { id: "leadership-development", title: "Leadership Development" },
      ],
    },
    {
      id: "safeguarding",
      title: "Safeguarding",
      subsections: [
        { id: "safeguarding-policy", title: "Safeguarding Policy and Procedures" },
        { id: "safeguarding-training", title: "Staff Training" },
        { id: "safeguarding-incidents", title: "Incidents and Reporting" },
      ],
    },
    {
      id: "behaviour",
      title: "Behaviour",
      subsections: [
        { id: "behaviour-policy", title: "Behaviour Policy" },
        { id: "behaviour-incidents", title: "Incident Analysis" },
        { id: "behaviour-interventions", title: "Interventions and Support" },
      ],
    },
    {
      id: "bullying",
      title: "Bullying",
      subsections: [
        { id: "anti-bullying-policy", title: "Anti-Bullying Policy" },
        { id: "bullying-incidents", title: "Incident Reports" },
        { id: "bullying-prevention", title: "Prevention Strategies" },
      ],
    },
    {
      id: "send",
      title: "Special Educational Needs and Disabilities",
      subsections: [
        { id: "send-provision", title: "SEND Provision" },
        { id: "send-outcomes", title: "Outcomes for SEND Pupils" },
        { id: "send-support", title: "Support and Resources" },
      ],
    },
    {
      id: "protected-characteristics",
      title: "Incidents relating to Protected Characteristics",
    },
    {
      id: "suspensions",
      title: "Suspensions and Exclusions",
      subsections: [
        { id: "suspension-data", title: "Suspension Data Analysis" },
        { id: "exclusion-procedures", title: "Exclusion Procedures" },
        { id: "reintegration", title: "Reintegration Support" },
      ],
    },
    {
      id: "attendance",
      title: "Attendance",
      subsections: [
        { id: "attendance-data", title: "Attendance Data Analysis" },
        { id: "persistent-absence", title: "Persistent Absence" },
        { id: "attendance-interventions", title: "Interventions and Support" },
      ],
    },
    {
      id: "punctuality",
      title: "Punctuality",
    },
    {
      id: "additional",
      title: "Additional",
      subsections: [
        { id: "additional-1", title: "Additional Section 1" },
        { id: "additional-2", title: "Additional Section 2" },
      ],
    },
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-lg h-full flex flex-col">
      {/* Forms Selection Section */}
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-2xl">Forms</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearForm}
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear Form
          </Button>
        </div>

        <div className="space-y-4">
          {/* Form Type Selector */}
          <div className="relative">
            <select
              value={selectedForm}
              onChange={(e) => onFormChange(e.target.value)}
              className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Please select a form type...</option>
              {forms.map((form) => (
                <option key={form} value={form}>
                  {form}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          {/* School Selector */}
          <div className="relative">
            <select
              value={selectedSchool}
              onChange={(e) => onSchoolChange(e.target.value)}
              className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Term Selector */}
          <div className="relative">
            <select
              value={selectedTerm}
              onChange={(e) => onTermChange(e.target.value)}
              className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Please select a term...</option>
              {terms.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Report Sections Navigation */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
          <h3 className="font-semibold text-lg">Report Sections</h3>
          <p className="text-sm text-slate-600 mt-1">Click to navigate</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-2">
            {sections.map((section) => (
              <div key={section.id} className="mb-1">
                <button
                  onClick={() => onSectionClick(section.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 hover:bg-slate-50",
                    activeSection === section.id && "bg-blue-50 border border-blue-200",
                  )}
                >
                  {section.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "font-medium text-sm truncate",
                        activeSection === section.id ? "text-blue-900" : "text-slate-900",
                      )}
                    >
                      {section.title}
                    </div>
                  </div>
                </button>

                {section.subsections && (
                  <div className="ml-7 mt-1 space-y-1">
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => onSectionClick(subsection.id)}
                        className={cn(
                          "w-full text-left p-2 rounded text-sm transition-colors flex items-center gap-2 hover:bg-slate-50",
                          activeSection === subsection.id && "bg-blue-50 text-blue-900",
                        )}
                      >
                        {subsection.completed ? (
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        )}
                        <span className="truncate">{subsection.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
