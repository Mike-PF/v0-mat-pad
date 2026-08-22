"use client"

import { Suspense, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { FormsReportPanel } from "@/components/forms-report-panel"
import { QuestionSection } from "@/components/question-section"

function FormsPageInner() {
  const searchParams = useSearchParams()
  const readOnly = searchParams.get("readonly") === "1"

  // In read-only (view permissions) mode we pre-populate the selectors so the
  // full report renders immediately, exactly as it would when filled in.
  const [selectedForm, setSelectedForm] = useState(readOnly ? "Headteacher's Report - Educational" : "")
  const [selectedSchool, setSelectedSchool] = useState(readOnly ? "Holy Family Catholic Academy" : "")
  const [selectedTerm, setSelectedTerm] = useState(readOnly ? "Summer 2024/25" : "")
  const [activeSection, setActiveSection] = useState("academy-vision")
  const [formData, setFormData] = useState<Record<string, any>>({})

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(sectionId)
    }
  }

  const updateFormData = (questionId: string, value: any) => {
    if (readOnly) return
    setFormData((prev) => ({ ...prev, [questionId]: value }))
  }

  // The report sections and the form itself only appear once a form type, school
  // and term have all been selected. Until then the page stays blank.
  const isReady = Boolean(selectedForm && selectedSchool && selectedTerm)

  const clearForm = () => {
    if (readOnly) return
    if (window.confirm("Are you sure you want to clear all form data? This action cannot be undone.")) {
      // Reset dropdowns to "Please select" state
      setSelectedForm("")
      setSelectedSchool("")
      setSelectedTerm("")
      // Clear all form data
      setFormData({})
      // Return to first section
      scrollToSection("academy-vision")
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation showProgress={isReady && !readOnly} />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-hidden">
          <div className="flex h-full gap-4">
            {/* Combined Forms and Report Sections Panel */}
            <div className="w-80 flex-shrink-0">
              <FormsReportPanel
                selectedForm={selectedForm}
                selectedSchool={selectedSchool}
                selectedTerm={selectedTerm}
                onFormChange={setSelectedForm}
                onSchoolChange={setSelectedSchool}
                onTermChange={setSelectedTerm}
                activeSection={activeSection}
                onSectionClick={scrollToSection}
                onClearForm={clearForm}
                showSections={isReady}
                readOnly={readOnly}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
              {isReady ? (
                <QuestionSection
                  activeSection={activeSection}
                  formData={formData}
                  onUpdateData={updateFormData}
                  sectionRefs={sectionRefs}
                  onSectionChange={setActiveSection}
                  readOnly={readOnly}
                />
              ) : (
                <div className="h-full flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white">
                  <div className="max-w-sm px-6 text-center">
                    <p className="text-base font-medium text-slate-900">Select a form to begin</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Choose a form type, school and term to load the report sections and start filling in the report.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FormsPage() {
  return (
    <Suspense fallback={null}>
      <FormsPageInner />
    </Suspense>
  )
}
