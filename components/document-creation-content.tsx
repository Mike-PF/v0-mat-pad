"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronDown,
  Save,
  Search,
  Upload,
  FileText,
  Plus,
  Edit,
  Trash,
  Link,
  Sliders,
  Download,
  X,
  Check,
  Send,
} from "lucide-react"

const mats = [
  { urn: "MAT001", name: "Bright Futures Educational Trust", type: "mat" as const },
  { urn: "MAT002", name: "Catholic Diocese of Hallam", type: "mat" as const },
  { urn: "MAT003", name: "Northern Education Trust", type: "mat" as const },
]

const schools = [
  { urn: "138337", name: "All Saints' Catholic High School", type: "school" as const },
  { urn: "140826", name: "Emmaus Catholic and CofE Primary School", type: "school" as const },
  { urn: "138361", name: "Notre Dame High School", type: "school" as const },
  { urn: "140439", name: "Sacred Heart School, A Catholic Voluntary Academy", type: "school" as const },
  { urn: "138828", name: "St Thomas of Canterbury School, a Catholic Voluntary Academy", type: "school" as const },
  { urn: "138830", name: "St Wilfrid's Catholic Primary School", type: "school" as const },
  { urn: "138848", name: "St Marie's School, A Catholic Voluntary Academy", type: "school" as const },
  { urn: "140025", name: "St John Fisher Primary, A Catholic Voluntary Academy", type: "school" as const },
  { urn: "140440", name: "St Mary's Primary School, A Catholic Voluntary Academy", type: "school" as const },
  { urn: "140441", name: "St Ann's Catholic Primary School, A Voluntary Academy", type: "school" as const },
  { urn: "140588", name: "St Catherine's Catholic Primary School (Hallam)", type: "school" as const },
  { urn: "148974", name: "St Alban's Catholic Primary and Nursery School", type: "school" as const },
  { urn: "144606", name: "Holy Trinity Catholic and Church of England School", type: "school" as const },
]

const allOrganizations = [...mats, ...schools]

// Mock data for report SPs
const reportSPs = [
  "SP_AttendanceReport",
  "SP_SENDProvisionReport",
  "SP_BehaviourAnalysis",
  "SP_AcademicProgress",
  "SP_FinancialSummary",
  "SP_StaffingReport",
  "SP_SafeguardingOverview",
]

const mockSavedDocuments = [
  {
    id: "doc1",
    name: "Attendance Report Template",
    sp: "SP_AttendanceReport",
    uploadedFile: "attendance_template.docx",
    tagCount: 45,
    schoolUrn: "138337",
  },
  {
    id: "doc2",
    name: "SEND Provision Report",
    sp: "SP_SENDProvisionReport",
    uploadedFile: "send_report.docx",
    tagCount: 78,
    schoolUrn: "138337",
  },
  {
    id: "doc3",
    name: "Behaviour Analysis Template",
    sp: "SP_BehaviourAnalysis",
    uploadedFile: "behaviour_template.docx",
    tagCount: 52,
    schoolUrn: "140826",
  },
  {
    id: "doc4",
    name: "MAT-Wide Financial Summary",
    sp: "SP_FinancialSummary",
    uploadedFile: "mat_financial_summary.docx",
    tagCount: 120,
    schoolUrn: "MAT001",
  },
  {
    id: "doc5",
    name: "Trust Safeguarding Overview",
    sp: "SP_SafeguardingOverview",
    uploadedFile: "trust_safeguarding.docx",
    tagCount: 95,
    schoolUrn: "MAT001",
  },
  {
    id: "doc6",
    name: "Diocese Academic Progress Report",
    sp: "SP_AcademicProgress",
    uploadedFile: "diocese_academic.docx",
    tagCount: 156,
    schoolUrn: "MAT002",
  },
  {
    id: "doc7",
    name: "Trust Staffing Report",
    sp: "SP_StaffingReport",
    uploadedFile: "trust_staffing.docx",
    tagCount: 88,
    schoolUrn: "MAT002",
  },
  {
    id: "doc8",
    name: "Notre Dame SEND Report",
    sp: "SP_SENDProvisionReport",
    uploadedFile: "notre_dame_send.docx",
    tagCount: 64,
    schoolUrn: "138361",
  },
  {
    id: "doc9",
    name: "Sacred Heart Behaviour Analysis",
    sp: "SP_BehaviourAnalysis",
    uploadedFile: "sacred_heart_behaviour.docx",
    tagCount: 48,
    schoolUrn: "140439",
  },
  {
    id: "doc10",
    name: "Northern Trust Financial Overview",
    sp: "SP_FinancialSummary",
    uploadedFile: "northern_trust_financial.docx",
    tagCount: 132,
    schoolUrn: "MAT003",
  },
]

// Generate mock report tags (simulating thousands of tags)
const generateMockTags = (count: number) => {
  const categories = ["Attendance", "SEND", "Behaviour", "Academic", "Financial", "Staffing", "Safeguarding"]
  const types = ["Summary", "Detail", "Analysis", "Trend", "Comparison", "Forecast"]
  const periods = ["Daily", "Weekly", "Monthly", "Termly", "Annual"]

  const tags = []
  for (let i = 1; i <= count; i++) {
    const category = categories[i % categories.length]
    const type = types[Math.floor(i / categories.length) % types.length]
    const period = periods[Math.floor(i / (categories.length * types.length)) % periods.length]

    tags.push({
      id: `MAT_TAG_${i.toString().padStart(4, "0")}`, // Changed prefix to MAT_TAG_
      name: `${category}_${type}_${period}_${i}`,
      description: `${category} ${type} report for ${period} period`,
      order: 0,
      category,
      matched: false,
    })
  }
  return tags
}

// Generate mock document tags (extracted from uploaded document via fake OCR)
const generateDocumentTags = (count: number) => {
  const tags = []
  for (let i = 1; i <= count; i++) {
    tags.push({
      id: `DOC_TAG_${i}`,
      placeholder: `{{DATA_${i}}}`,
      matched: false,
      matchedSystemTagId: null,
    })
  }
  return tags
}

export function DocumentCreationContent() {
  const [selectedSchoolUrn, setSelectedSchoolUrn] = useState("")
  const [documents, setDocuments] = useState(mockSavedDocuments)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [documentName, setDocumentName] = useState("")
  const [activeTab, setActiveTab] = useState<"datapoint" | "qa">("datapoint")
  const [selectedSP, setSelectedSP] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [documentTags, setDocumentTags] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)
  const [saveConfirmationData, setSaveConfirmationData] = useState<{ matchedCount: number; totalCount: number } | null>(
    null,
  )
  const [tags, setTags] = useState<any[]>([]) // Renamed from systemTags for clarity
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50)
  const [sortBy, setSortBy] = useState<"name" | "order" | "category">("order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [tagStyles, setTagStyles] = useState<Record<string, string>>({})
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [docTagFilter, setDocTagFilter] = useState<"all" | "matched" | "notmatched">("all")
  const [showDocTagFilterDropdown, setShowDocTagFilterDropdown] = useState(false)
  const [qaDocTagFilter, setQaDocTagFilter] = useState<"all" | "assigned" | "unassigned">("all")
  const [showQaDocTagFilterDropdown, setShowQaDocTagFilterDropdown] = useState(false)

  // Q&A Functionality States
  const [questions, setQuestions] = useState<Array<{ id: string; text: string }>>([])
  const [questionAssignments, setQuestionAssignments] = useState<Record<string, string>>({}) // docTagId -> questionId
  const [newQuestionText, setNewQuestionText] = useState("")
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [editingQuestionText, setEditingQuestionText] = useState("")
  const [qaData, setQaData] = useState<Record<string, { question: string; answer: string }>>({})

  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishingDocument, setPublishingDocument] = useState<any>(null)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const filteredDocuments = useMemo(() => {
    if (!selectedSchoolUrn) return []
    return documents.filter((doc) => doc.schoolUrn === selectedSchoolUrn)
  }, [documents, selectedSchoolUrn])

  const handleCreateNew = () => {
    if (!selectedSchoolUrn) {
      alert("Please select an organization first")
      return
    }

    setIsCreatingNew(true)
    setSelectedDocument(null)
    setDocumentName("")
    setSelectedSP("")
    setUploadedFile(null)
    setDocumentTags([])
    setTags([])
    setQuestions([])
    setQuestionAssignments({})
    setQaData({})
  }

  const handleEditDocument = (doc: any) => {
    setSelectedDocument(doc)
    setIsCreatingNew(false)
    setDocumentName(doc.name)
    setSelectedSP(doc.sp)
    setUploadedFile(null)

    // Load existing configuration
    const tagCount = doc.sp === "SP_AttendanceReport" ? 1500 : doc.sp === "SP_SENDProvisionReport" ? 2000 : 500
    setTags(generateMockTags(tagCount))
    setDocumentTags(generateDocumentTags(doc.tagCount))
    // TODO: Load Q&A data if it exists for this document
    // For now, let's simulate loading some QA data if the document exists
    if (doc.id === "doc1") {
      // Example: Load QA for doc1
      setQaData({
        DOC_TAG_1: { question: "What is the attendance rate?", answer: "95.5%" },
        DOC_TAG_5: { question: "Are there any absences?", answer: "Yes, 5 students were absent." },
      })
      setQuestions([
        { id: "Q_1", text: "What is the attendance rate?" },
        { id: "Q_2", text: "Are there any absences?" },
      ])
      setQuestionAssignments({
        DOC_TAG_1: "Q_1",
        DOC_TAG_5: "Q_2",
      })
    }
  }

  const handleDeleteDocument = (docId: string) => {
    if (confirm("Are you sure you want to delete this document configuration?")) {
      setDocuments(documents.filter((d) => d.id !== docId))
      if (selectedDocument?.id === docId) {
        setSelectedDocument(null)
        setIsCreatingNew(false)
      }
    }
  }

  const handleDownloadDocument = (doc: any) => {
    // In a real application, this would download the actual file from a server
    // For now, we'll simulate a download by creating a link
    const link = document.createElement("a")
    link.href = "#" // In production, this would be the actual file URL
    link.download = doc.uploadedFile
    link.click()

    // Show notification
    setNotificationMessage(`Downloading ${doc.uploadedFile}...`)
    setShowNotification(true)
  }

  const handlePublishDocument = (doc: any) => {
    setPublishingDocument(doc)
    setShowPublishModal(true)
  }

  const handleSPChange = (sp: string) => {
    setSelectedSP(sp)
    if (sp) {
      // Generate mock tags based on selected SP (simulating different amounts)
      const tagCount = sp === "SP_AttendanceReport" ? 1500 : sp === "SP_SENDProvisionReport" ? 2000 : 500
      setTags(generateMockTags(tagCount))
      setCurrentPage(1)
      setSearchQuery("")
      setQaData({}) // Reset Q&A data when changing SP
      setQuestions([]) // Also reset questions
      setQuestionAssignments({}) // And assignments
    } else {
      setTags([])
      setDocumentTags([]) // Clear document tags as well
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[v0] handleFileUpload called")
    const file = event.target.files?.[0]
    console.log("[v0] Selected file:", file)
    if (file) {
      setUploadedFile(file)
      setIsProcessing(true)

      // Fake OCR processing - simulate delay
      setTimeout(() => {
        // Simulate extracting tags from document (random count between 30-100)
        const extractedTagCount = Math.floor(Math.random() * 70) + 30
        const docTags = generateDocumentTags(extractedTagCount)
        setDocumentTags(docTags)
        setIsProcessing(false)
        setNotificationMessage(`Document processed! Found ${extractedTagCount} tag placeholders in the document.`)
        setShowNotification(true)
        console.log("[v0] Document processed, extracted", extractedTagCount, "tags")
        setQaData({}) // Reset Q&A data on file upload
        setQuestions([]) // Reset questions and assignments
        setQuestionAssignments({})
      }, 2000)
    }
  }

  const handleMatchTag = (docTagId: string, systemTagId: string) => {
    setDocumentTags((prevTags) =>
      prevTags.map((tag) => (tag.id === docTagId ? { ...tag, matched: true, matchedSystemTagId: systemTagId } : tag)),
    )

    setTagStyles((prev) => ({ ...prev, [docTagId]: "Normal" }))
  }

  const handleUnmatchTag = (docTagId: string) => {
    const docTag = documentTags.find((t) => t.id === docTagId)

    setDocumentTags((prevTags) =>
      prevTags.map((tag) => (tag.id === docTagId ? { ...tag, matched: false, matchedSystemTagId: null } : tag)),
    )

    setTagStyles((prev) => {
      const newStyles = { ...prev }
      delete newStyles[docTagId]
      return newStyles
    })
  }

  const handleStyleChange = (docTagId: string, style: string) => {
    setTagStyles((prev) => ({ ...prev, [docTagId]: style }))
  }

  const handleOrderChange = (tagId: string, newOrder: number) => {
    setTags((prevTags) => prevTags.map((tag) => (tag.id === tagId ? { ...tag, order: newOrder } : tag)))
  }

  const moveTag = (tagId: string, direction: "up" | "down") => {
    const tagIndex = filteredAndSortedTags.findIndex((tag) => tag.id === tagId)
    if (tagIndex === -1) return

    const currentTag = filteredAndSortedTags[tagIndex]
    const swapIndex = direction === "up" ? tagIndex - 1 : tagIndex + 1

    if (swapIndex < 0 || swapIndex >= filteredAndSortedTags.length) return

    const swapTag = filteredAndSortedTags[swapIndex]

    setTags((prevTags) =>
      prevTags.map((tag) => {
        if (tag.id === currentTag.id) return { ...tag, order: swapTag.order }
        if (tag.id === swapTag.id) return { ...tag, order: currentTag.order }
        return tag
      }),
    )
  }

  // Q&A Functionality Helpers
  const generateDefaultQuestion = (tagPlaceholder: string) => {
    // Extract the tag name from placeholder like {{DATA_1}} -> DATA_1
    const tagName = tagPlaceholder.replace(/[{}]/g, "")
    return `What value should be used for ${tagName}?`
  }

  const handleAnswerChange = (docTagId: string, answer: string) => {
    setQaData((prev) => ({
      ...prev,
      [docTagId]: {
        question:
          prev[docTagId]?.question ||
          generateDefaultQuestion(documentTags.find((t) => t.id === docTagId)?.placeholder || ""),
        answer,
      },
    }))
  }

  const handleQuestionChange = (docTagId: string, question: string) => {
    setQaData((prev) => ({
      ...prev,
      [docTagId]: {
        question,
        answer: prev[docTagId]?.answer || "",
      },
    }))
  }

  const handleGenerateQuestions = () => {
    const newQaData: Record<string, { question: string; answer: string }> = {}
    documentTags.forEach((tag) => {
      newQaData[tag.id] = {
        question: qaData[tag.id]?.question || generateDefaultQuestion(tag.placeholder),
        answer: qaData[tag.id]?.answer || "",
      }
    })
    setQaData(newQaData)
    setNotificationMessage("Questions generated for all document tags!")
    setShowNotification(true)
  }

  const handleAddQuestion = () => {
    if (newQuestionText.trim() === "") return

    const newQuestion = {
      id: `Q_${Date.now()}`,
      text: newQuestionText.trim(),
    }

    setQuestions([...questions, newQuestion])
    setNewQuestionText("")
  }

  const handleEditQuestion = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (question) {
      setEditingQuestionId(questionId)
      setEditingQuestionText(question.text)
    }
  }

  const handleSaveEditQuestion = () => {
    if (editingQuestionText.trim() === "" || !editingQuestionId) return

    setQuestions(questions.map((q) => (q.id === editingQuestionId ? { ...q, text: editingQuestionText.trim() } : q)))
    setEditingQuestionId(null)
    setEditingQuestionText("")
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter((q) => q.id !== questionId))
      // Remove any assignments using this question
      const newAssignments = { ...questionAssignments }
      Object.keys(newAssignments).forEach((docTagId) => {
        if (newAssignments[docTagId] === questionId) {
          delete newAssignments[docTagId]
        }
      })
      setQuestionAssignments(newAssignments)
    }
  }

  const handleAssignQuestion = (docTagId: string, questionId: string) => {
    setQuestionAssignments({
      ...questionAssignments,
      [docTagId]: questionId,
    })
  }

  const handleUnassignQuestion = (docTagId: string) => {
    const newAssignments = { ...questionAssignments }
    delete newAssignments[docTagId]
    setQuestionAssignments(newAssignments)
  }

  // Q&A Statistics
  const answeredQuestionsCount = Object.values(qaData).filter((qa) => qa.answer.trim() !== "").length
  const unansweredQuestionsCount = documentTags.length - answeredQuestionsCount
  // Q&A Statistics
  const assignedQuestionsCount = Object.keys(questionAssignments).length
  const unassignedTagsCount = documentTags.length - assignedQuestionsCount

  const handleSave = () => {
    if (!selectedSP || !documentName) {
      alert("Please provide a document name and select a report SP")
      return
    }

    if (!uploadedFile) {
      alert("Please upload a Word document")
      return
    }

    const matchedCount = documentTags.filter((t) => t.matched).length
    if (matchedCount < documentTags.length) {
      // Show custom confirmation modal instead of browser confirm
      setSaveConfirmationData({ matchedCount, totalCount: documentTags.length })
      setShowSaveConfirmation(true)
      return
    }

    // If all tags are matched, save directly
    performSave()
  }

  const performSave = () => {
    const newDoc = {
      id: selectedDocument?.id || `doc${Date.now()}`,
      name: documentName,
      sp: selectedSP,
      uploadedFile: uploadedFile!.name,
      tagCount: documentTags.length,
      schoolUrn: selectedSchoolUrn,
      qaData: qaData, // Save QA data
    }

    if (selectedDocument) {
      setDocuments(documents.map((d) => (d.id === selectedDocument.id ? newDoc : d)))
    } else {
      setDocuments([...documents, newDoc])
    }

    console.log("Saving document configuration:", newDoc, tags, documentTags)

    // Show success notification
    setNotificationMessage("Document configuration saved successfully!")
    setShowNotification(true)

    // Reset to list view
    setIsCreatingNew(false)
    setSelectedDocument(null)
  }

  const handleSaveConfirm = () => {
    setShowSaveConfirmation(false)
    setSaveConfirmationData(null)
    performSave()
  }

  const handleSaveCancel = () => {
    setShowSaveConfirmation(false)
    setSaveConfirmationData(null)
  }

  const handleSort = (field: "name" | "order" | "category") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
    setShowFilterDropdown(false)
  }

  const handleSortByMostMatched = () => {
    setSortBy("order")
    setSortDirection("desc")
    setShowFilterDropdown(false)
  }

  const getTagMatchCount = (systemTagId: string) => {
    return documentTags.filter((dt) => dt.matchedSystemTagId === systemTagId).length
  }

  // Filter and sort tags
  const filteredAndSortedTags = useMemo(() => {
    const filtered = tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "order") {
        const aMatchCount = getTagMatchCount(a.id)
        const bMatchCount = getTagMatchCount(b.id)
        if (aMatchCount !== bMatchCount) {
          comparison = bMatchCount - aMatchCount // Higher match count first
        } else {
          comparison = a.order - b.order
        }
      } else if (sortBy === "category") {
        comparison = a.category.localeCompare(b.category)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [tags, searchQuery, sortBy, sortDirection, documentTags])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTags.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTags = filteredAndSortedTags.slice(startIndex, endIndex)

  const matchedTagsCount = documentTags.filter((t) => t.matched).length
  const unmatchedTagsCount = documentTags.length - matchedTagsCount
  const availableSystemTags = tags.filter((t) => !t.matched).length

  const selectedOrganization = allOrganizations.find((org) => org.urn === selectedSchoolUrn)

  const filteredDocumentTags = useMemo(() => {
    if (docTagFilter === "all") {
      return documentTags
    } else if (docTagFilter === "matched") {
      return documentTags.filter((tag) => tag.matched)
    } else {
      return documentTags.filter((tag) => !tag.matched)
    }
  }, [documentTags, docTagFilter])

  const filteredQaDocumentTags = useMemo(() => {
    if (qaDocTagFilter === "all") {
      return documentTags
    } else if (qaDocTagFilter === "assigned") {
      return documentTags.filter((tag) => questionAssignments[tag.id])
    } else {
      return documentTags.filter((tag) => !questionAssignments[tag.id])
    }
  }, [documentTags, qaDocTagFilter, questionAssignments])

  console.log("[v0] Component rendering, state:", {
    selectedSchoolUrn,
    isCreatingNew,
    selectedDocument: selectedDocument?.id,
    uploadedFile: uploadedFile?.name,
    documentTagsCount: documentTags.length,
    tagsCount: tags.length,
    activeTab,
  })

  return (
    <>
      {showPublishModal && publishingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Publish Document</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPublishModal(false)
                    setPublishingDocument(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-slate-600">Publish functionality coming soon...</p>
                <p className="text-sm text-slate-500 mt-2">Document: {publishingDocument.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showSaveConfirmation && saveConfirmationData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-lg">Confirm Save</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-6">
                Only {saveConfirmationData.matchedCount} of {saveConfirmationData.totalCount} document tags are matched.
                Save anyway?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveConfirm}
                  className="flex-1 text-white"
                  style={{ backgroundColor: "#0f0d42" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0a0830")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0f0d42")}
                >
                  OK
                </Button>
                <Button onClick={handleSaveCancel} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-lg">
                {notificationMessage.includes("saved")
                  ? "Success"
                  : notificationMessage.includes("generated")
                    ? "Success"
                    : "Document Processing Complete"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-6">{notificationMessage}</p>
              <Button
                onClick={() => setShowNotification(false)}
                className="w-full text-white"
                style={{ backgroundColor: "#0f0d42" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0a0830")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0f0d42")}
              >
                OK
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="h-[calc(100vh-12rem)] flex flex-col space-y-6 overflow-hidden">
        {(isCreatingNew || selectedDocument) && (
          <Card className="flex-shrink-0">
            <CardHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCreatingNew(false)
                      setSelectedDocument(null)
                    }}
                  >
                    ← Back to List
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!selectedSP || !documentName || !uploadedFile}
                    className="bg-[#121051] hover:bg-[#0f0d42] text-white disabled:opacity-50"
                    style={{ backgroundColor: selectedSP && documentName && uploadedFile ? "#121051" : undefined }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Organization</label>
                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900">
                      {selectedOrganization?.name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Document Name</label>
                    <Input
                      type="text"
                      placeholder="Enter document name..."
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Word Document</label>
                    <input
                      type="file"
                      accept=".doc,.docx"
                      onChange={handleFileUpload}
                      disabled={isProcessing}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-md transition-colors ${
                        isProcessing
                          ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                          : "border-slate-300 hover:border-[#b30089] hover:bg-[#b30089]/5 cursor-pointer"
                      }`}
                    >
                      <Upload className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-600">
                        {isProcessing ? "Processing..." : uploadedFile ? uploadedFile.name : "Choose file"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-b border-slate-200">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab("datapoint")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "datapoint"
                        ? "text-slate-900 border-primary"
                        : "text-slate-600 border-transparent hover:text-[#b30089] hover:border-[#b30089]/30"
                    }`}
                  >
                    Data Point
                  </button>
                  <button
                    onClick={() => setActiveTab("qa")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "qa"
                        ? "text-slate-900 border-primary"
                        : "text-slate-600 border-transparent hover:text-[#b30089] hover:border-[#b30089]/30"
                    }`}
                  >
                    Q&A
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isCreatingNew && !selectedDocument && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Organization</CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Choose a MAT or school to view and manage its document configurations
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md">
                <select
                  value={selectedSchoolUrn}
                  onChange={(e) => setSelectedSchoolUrn(e.target.value)}
                  className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">Please select an organization...</option>

                  <optgroup label="MATs (Multi-Academy Trusts)">
                    {mats.map((mat) => (
                      <option key={mat.urn} value={mat.urn}>
                        {mat.name}
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="Schools">
                    {schools.map((school) => (
                      <option key={school.urn} value={school.urn}>
                        {school.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedSchoolUrn && !isCreatingNew && !selectedDocument && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Document Configurations</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    Manage document templates for {selectedOrganization?.name}
                  </p>
                </div>
                <Button onClick={handleCreateNew} className="bg-[#121051] hover:bg-[#0f0d42] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-l-4 hover:border-l-[#b30089] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5" style={{ color: "#0f0d42" }} />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{doc.name}</h3>
                        <p className="text-sm text-slate-600">
                          {doc.sp} • {doc.uploadedFile} • {doc.tagCount} tags
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePublishDocument(doc)}
                        className="group hover:bg-[#b30089] hover:text-white hover:border-[#b30089] transition-colors"
                      >
                        <Send
                          className="w-4 h-4 mr-2 transition-colors group-hover:!text-white"
                          style={{ color: "#0f0d42" }}
                        />
                        <span>Publish</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDocument(doc)}
                        className="group hover:bg-[#b30089] hover:text-white hover:border-[#b30089] transition-colors"
                      >
                        <Edit
                          className="w-4 h-4 mr-2 transition-colors group-hover:!text-white"
                          style={{ color: "#0f0d42" }}
                        />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(doc)}
                        className="group hover:bg-[#b30089] hover:text-white hover:border-[#b30089] transition-colors"
                      >
                        <Download
                          className="w-4 h-4 transition-colors group-hover:!text-white"
                          style={{ color: "#0f0d42" }}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="group hover:bg-[#b30089] hover:text-white hover:border-[#b30089] transition-colors"
                      >
                        <Trash
                          className="w-4 h-4 transition-colors group-hover:!text-white"
                          style={{ color: "#0f0d42" }}
                        />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600">No document configurations yet for this organization</p>
                    <p className="text-sm text-slate-500 mt-1">Create your first document to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {(isCreatingNew || selectedDocument) && activeTab === "datapoint" && uploadedFile && (
          <>
            <Card className="flex-shrink-0">
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Report SP</label>
                  <div className="relative">
                    <select
                      value={selectedSP}
                      onChange={(e) => handleSPChange(e.target.value)}
                      className="w-full p-3 pr-10 border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Please select a report SP...</option>
                      {reportSPs.map((sp) => (
                        <option key={sp} value={sp}>
                          {sp}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {selectedSP && documentTags.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <div className="text-sm text-slate-600">Document Tags</div>
                      <div className="text-2xl font-bold text-slate-900">{documentTags.length}</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-slate-600">Matched Tags</div>
                      <div className="text-2xl font-bold text-green-600">
                        {documentTags.filter((t) => t.matched).length}
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-sm text-slate-600">Unmatched Tags</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {documentTags.length - documentTags.filter((t) => t.matched).length}
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-slate-600">Available System Tags</div>
                      <div className="text-2xl font-bold text-purple-600">{tags.filter((t) => !t.matched).length}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
              {/* Document Tags Panel */}
              <Card className="flex flex-col min-h-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Document Tags ({documentTags.length})</CardTitle>
                      <p className="text-sm text-slate-600">Tags found in uploaded document</p>
                    </div>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDocTagFilterDropdown(!showDocTagFilterDropdown)}
                        className="flex items-center gap-2"
                      >
                        <Sliders className="w-4 h-4" />
                        Filter
                      </Button>

                      {showDocTagFilterDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowDocTagFilterDropdown(false)} />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setDocTagFilter("all")
                                  setShowDocTagFilterDropdown(false)
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10 ${
                                  docTagFilter === "all" ? "bg-[#b30089]/10 font-medium" : ""
                                }`}
                              >
                                All
                              </button>
                              <button
                                onClick={() => {
                                  setDocTagFilter("matched")
                                  setShowDocTagFilterDropdown(false)
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10 ${
                                  docTagFilter === "matched" ? "bg-[#b30089]/10 font-medium" : ""
                                }`}
                              >
                                Matched
                              </button>
                              <button
                                onClick={() => {
                                  setDocTagFilter("notmatched")
                                  setShowDocTagFilterDropdown(false)
                                }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10 ${
                                  docTagFilter === "notmatched" ? "bg-[#b30089]/10 font-medium" : ""
                                }`}
                              >
                                Not Matched
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex-1 border border-slate-200 rounded-lg overflow-auto">
                    <div className="space-y-2 p-4">
                      {filteredDocumentTags.map((docTag) => (
                        <div
                          key={docTag.id}
                          className={`p-3 border rounded-lg ${
                            docTag.matched ? "bg-green-50 border-green-200" : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-mono text-sm font-medium">{docTag.placeholder}</div>
                              {docTag.matched && (
                                <div className="text-xs text-green-600 mt-1">
                                  Matched to: {tags.find((t) => t.id === docTag.matchedSystemTagId)?.name}
                                </div>
                              )}
                            </div>
                            {docTag.matched ? (
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <select
                                    value={tagStyles[docTag.id] || "Normal"}
                                    onChange={(e) => handleStyleChange(docTag.id, e.target.value)}
                                    className="px-3 py-1.5 pr-8 text-sm border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                  >
                                    <option value="Normal">Normal</option>
                                    <option value="Bold">Bold</option>
                                    <option value="Italic">Italic</option>
                                    <option value="Underline">Underline</option>
                                    <option value="Bold Italic">Bold Italic</option>
                                    <option value="Bold Underline">Bold Underline</option>
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUnmatchTag(docTag.id)}
                                  className="text-red-600"
                                >
                                  Unmatch
                                </Button>
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500">Not matched</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Tags Panel */}
              <Card className="flex flex-col min-h-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">System Tags ({tags.length})</CardTitle>
                      <p className="text-sm text-slate-600">Available tags from {selectedSP}</p>
                    </div>
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="flex items-center gap-2"
                      >
                        <Sliders className="w-4 h-4" />
                        Filter
                      </Button>

                      {showFilterDropdown && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                            <div className="py-1">
                              <button
                                onClick={() => handleSort("name")}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10 flex items-center justify-between"
                              >
                                <span>Sort by Name</span>
                                {sortBy === "name" && (
                                  <span className="text-xs text-slate-500">
                                    {sortDirection === "asc" ? "A-Z" : "Z-A"}
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={() => handleSort("order")}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10 flex items-center justify-between"
                              >
                                <span>Sort by Order</span>
                                {sortBy === "order" && (
                                  <span className="text-xs text-slate-500">{sortDirection === "asc" ? "↑" : "↓"}</span>
                                )}
                              </button>
                              <button
                                onClick={handleSortByMostMatched}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10"
                              >
                                Sort by Most Matched
                              </button>
                              <button
                                onClick={() => handleSort("category")}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10 flex items-center justify-between"
                              >
                                <span>Sort by Category</span>
                                {sortBy === "category" && (
                                  <span className="text-xs text-slate-500">
                                    {sortDirection === "asc" ? "A-Z" : "Z-A"}
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {/* Search */}
                  <div className="mb-4 flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search system tags..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Tags List */}
                  <div className="flex-1 border border-slate-200 rounded-lg overflow-auto min-h-0">
                    <div className="space-y-2 p-4">
                      {currentTags.map((tag) => {
                        const matchCount = getTagMatchCount(tag.id)

                        return (
                          <div
                            key={tag.id}
                            className="p-3 border rounded-lg bg-white border-slate-200 hover:border-[#b30089] hover:bg-[#b30089]/5 cursor-pointer"
                            onClick={() => {
                              const firstUnmatched = documentTags.find((dt) => !dt.matched)
                              if (firstUnmatched) {
                                handleMatchTag(firstUnmatched.id, tag.id)
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{tag.name}</div>
                                <div className="text-xs text-slate-500 mt-1">{tag.description}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {matchCount > 0 && (
                                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                    <Link className="w-3 h-3" />
                                    Matched ({matchCount}x)
                                  </div>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const firstUnmatched = documentTags.find((dt) => !dt.matched)
                                    if (firstUnmatched) {
                                      handleMatchTag(firstUnmatched.id, tag.id)
                                    }
                                  }}
                                >
                                  Match
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="border-t border-slate-200 bg-white p-4 flex items-center justify-between flex-shrink-0 mt-4">
                    <div className="text-sm text-slate-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {(isCreatingNew || selectedDocument) && activeTab === "datapoint" && !uploadedFile && !isProcessing && (
          <Card className="flex-1 min-h-0">
            <CardContent className="flex-1 flex items-center justify-center p-12">
              <div className="bg-white border border-slate-200 rounded-lg p-12 shadow-sm max-w-md w-full">
                <div className="text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-600 text-sm text-center">
                    Upload a Word document to extract tags and configure mappings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(isCreatingNew || selectedDocument) && activeTab === "qa" && (
          <>
            {documentTags.length > 0 && (
              <>
                <Card className="flex-shrink-0">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">Question & Answer Configuration</h3>
                      <p className="text-sm text-slate-600 mt-1">Create questions and assign them to document tags</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <div className="text-sm text-slate-600">Total Questions</div>
                        <div className="text-2xl font-bold text-slate-900">{questions.length}</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-slate-600">Assigned Tags</div>
                        <div className="text-2xl font-bold text-green-600">{assignedQuestionsCount}</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-sm text-slate-600">Unassigned Tags</div>
                        <div className="text-2xl font-bold text-orange-600">{unassignedTagsCount}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
                  {/* Question Bank Panel */}
                  <Card className="flex flex-col min-h-0">
                    <CardHeader>
                      <div>
                        <CardTitle className="text-lg">Question Bank ({questions.length})</CardTitle>
                        <p className="text-sm text-slate-600">Create and manage questions</p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
                      {/* Add New Question */}
                      <div className="mb-4 flex-shrink-0">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter a new question..."
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddQuestion()
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleAddQuestion}
                            disabled={newQuestionText.trim() === ""}
                            className="bg-[#121051] hover:bg-[#0f0d42] text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Questions List */}
                      <div className="flex-1 border border-slate-200 rounded-lg overflow-auto min-h-0">
                        <div className="space-y-2 p-4">
                          {questions.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-sm">
                              No questions yet. Create your first question above.
                            </div>
                          )}

                          {questions.map((question) => {
                            const assignedCount = Object.values(questionAssignments).filter(
                              (qId) => qId === question.id,
                            ).length

                            return (
                              <div
                                key={question.id}
                                className="p-3 border rounded-lg bg-white border-slate-200 hover:border-l-4 hover:border-l-[#b30089] transition-all"
                              >
                                {editingQuestionId === question.id ? (
                                  <div className="space-y-2">
                                    <Input
                                      type="text"
                                      value={editingQuestionText}
                                      onChange={(e) => setEditingQuestionText(e.target.value)}
                                      className="w-full"
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={handleSaveEditQuestion}
                                        className="bg-[#121051] hover:bg-[#0f0d42] text-white"
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingQuestionId(null)
                                          setEditingQuestionText("")
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="text-sm text-slate-900">{question.text}</div>
                                      {assignedCount > 0 && (
                                        <div className="flex items-center gap-1 mt-2 text-xs text-green-600 font-medium">
                                          <Link className="w-3 h-3" />
                                          Assigned to {assignedCount} tag{assignedCount > 1 ? "s" : ""}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditQuestion(question.id)}
                                        className="group hover:bg-[#b30089] hover:text-white hover:border-[#b30089] transition-colors"
                                      >
                                        <Edit
                                          className="w-3 h-3 transition-colors group-hover:!text-white"
                                          style={{ color: "#0f0d42" }}
                                        />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteQuestion(question.id)}
                                        className="group hover:bg-[#b30089] hover:text-white hover:border-[#b30089] transition-colors"
                                      >
                                        <Trash
                                          className="w-3 h-3 transition-colors group-hover:!text-white"
                                          style={{ color: "#0f0d42" }}
                                        />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Document Tags Panel */}
                  <Card className="flex flex-col min-h-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Document Tags ({documentTags.length})</CardTitle>
                          <p className="text-sm text-slate-600">Assign questions to document tags</p>
                        </div>
                        <div className="relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowQaDocTagFilterDropdown(!showQaDocTagFilterDropdown)}
                            className="flex items-center gap-2"
                          >
                            <Sliders className="w-4 h-4" />
                            Filter
                          </Button>

                          {showQaDocTagFilterDropdown && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowQaDocTagFilterDropdown(false)}
                              />
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setQaDocTagFilter("all")
                                      setShowQaDocTagFilterDropdown(false)
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10 flex items-center justify-between ${
                                      qaDocTagFilter === "all" ? "font-medium" : ""
                                    }`}
                                  >
                                    <span>All</span>
                                    {qaDocTagFilter === "all" && (
                                      <Check className="w-4 h-4" style={{ color: "#b30089" }} />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setQaDocTagFilter("assigned")
                                      setShowQaDocTagFilterDropdown(false)
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10 flex items-center justify-between ${
                                      qaDocTagFilter === "assigned" ? "font-medium" : ""
                                    }`}
                                  >
                                    <span>Assigned</span>
                                    {qaDocTagFilter === "assigned" && (
                                      <Check className="w-4 h-4" style={{ color: "#b30089" }} />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setQaDocTagFilter("unassigned")
                                      setShowQaDocTagFilterDropdown(false)
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[#b30089]/10 flex items-center justify-between ${
                                      qaDocTagFilter === "unassigned" ? "font-medium" : ""
                                    }`}
                                  >
                                    <span>Unassigned</span>
                                    {qaDocTagFilter === "unassigned" && (
                                      <Check className="w-4 h-4" style={{ color: "#b30089" }} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
                      <div className="flex-1 border border-slate-200 rounded-lg overflow-auto">
                        <div className="space-y-2 p-4">
                          {filteredQaDocumentTags.map((docTag) => {
                            const assignedQuestionId = questionAssignments[docTag.id]
                            const assignedQuestion = questions.find((q) => q.id === assignedQuestionId)

                            const displayPlaceholder = docTag.placeholder.replace(/DATA_(\d+)/, "Q&A_$1")

                            return (
                              <div
                                key={docTag.id}
                                className={`p-3 border rounded-lg ${
                                  assignedQuestion ? "bg-green-50 border-green-200" : "bg-white border-slate-200"
                                }`}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="font-mono text-sm font-medium text-slate-900">
                                      {displayPlaceholder}
                                    </div>
                                    {assignedQuestion && (
                                      <div className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 rounded">
                                        Assigned
                                      </div>
                                    )}
                                  </div>

                                  {assignedQuestion ? (
                                    <div className="space-y-2">
                                      <div className="p-2 bg-white rounded border border-green-200">
                                        <div className="text-xs text-slate-600 mb-1">Assigned Question:</div>
                                        <div className="text-sm text-slate-900">{assignedQuestion.text}</div>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUnassignQuestion(docTag.id)}
                                        className="w-full text-red-600 hover:bg-red-50"
                                      >
                                        <X className="w-3 h-3 mr-1" />
                                        Unassign
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="relative">
                                      <select
                                        value=""
                                        onChange={(e) => {
                                          if (e.target.value) {
                                            handleAssignQuestion(docTag.id, e.target.value)
                                          }
                                        }}
                                        className="w-full p-2 pr-8 text-sm border border-slate-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        disabled={questions.length === 0}
                                      >
                                        <option value="">
                                          {questions.length === 0 ? "No questions available" : "Select a question..."}
                                        </option>
                                        {questions.map((q) => (
                                          <option key={q.id} value={q.id}>
                                            {q.text}
                                          </option>
                                        ))}
                                      </select>
                                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {documentTags.length === 0 && (
              <Card className="flex-1 min-h-0">
                <CardContent className="flex-1 flex items-center justify-center p-12">
                  <div className="bg-white border border-slate-200 rounded-lg p-12 shadow-sm max-w-md w-full">
                    <div className="text-center flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-8 h-8 text-slate-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Document First</h3>
                      <p className="text-slate-600 text-sm text-center">
                        Upload a Word document to extract tags and configure Q&A
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  )
}
