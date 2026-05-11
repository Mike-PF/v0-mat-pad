"use client"

import { useState, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { FormsReportPanel } from "@/components/forms-report-panel"
import { QuestionSection } from "@/components/question-section"

export default function HomePage() {
  const [selectedForm, setSelectedForm] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
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
    setFormData((prev) => ({ ...prev, [questionId]: value }))
  }

  const clearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data? This action cannot be undone.")) {
      setSelectedForm("")
      setSelectedSchool("")
      setSelectedTerm("")
      setFormData({})
      scrollToSection("academy-vision")
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <div className="flex-1 px-4 pb-6 overflow-hidden">
          <div className="flex h-full gap-4">
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
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              <QuestionSection
                activeSection={activeSection}
                formData={formData}
                onUpdateData={updateFormData}
                sectionRefs={sectionRefs}
                onSectionChange={setActiveSection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
