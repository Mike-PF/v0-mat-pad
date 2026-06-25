"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import {
  Search,
  Plus,
  Trash2,
  Pencil,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Sparkles,
  Lock,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { isPlatformAdmin } from "@/lib/current-org"
import {
  chatbotPages,
  getPageLabel,
  topics,
  getTopic,
  categorise,
  faqQuestions,
  useChatbotPrompts,
  type SuggestedQuestion,
} from "@/lib/ai-chatbot"

const NAVY = "#121051"

type View = "popular" | "prompts"

export default function AiChatbotPage() {
  const allowed = isPlatformAdmin()

  const { items: prompts, setItems: setPrompts, hydrated } = useChatbotPrompts()
  const { showToast } = useToast()

  const [view, setView] = useState<View>("popular")

  // Popular questions controls
  const [faqSearch, setFaqSearch] = useState("")
  const [faqTopic, setFaqTopic] = useState<string>("all")
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  // Prompt management controls
  const [promptPage, setPromptPage] = useState<string>("all")

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<SuggestedQuestion | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<SuggestedQuestion | null>(null)
  const [formText, setFormText] = useState("")
  const [formPageIds, setFormPageIds] = useState<string[]>([])
  const [formEnabled, setFormEnabled] = useState(true)

  // ---- Popular questions: filter + group by topic ----
  const filteredFaqs = useMemo(() => {
    return faqQuestions
      .filter((q) => {
        const matchesSearch = q.text.toLowerCase().includes(faqSearch.toLowerCase())
        const matchesTopic = faqTopic === "all" || categorise(q.text) === faqTopic
        return matchesSearch && matchesTopic
      })
      .sort((a, b) => b.count - a.count)
  }, [faqSearch, faqTopic])

  const groupedFaqs = useMemo(() => {
    const groups: Record<string, typeof faqQuestions> = {}
    for (const q of filteredFaqs) {
      const topicId = categorise(q.text)
      if (!groups[topicId]) groups[topicId] = []
      groups[topicId].push(q)
    }
    // Order groups by total ask volume descending
    return Object.entries(groups)
      .map(([topicId, questions]) => ({
        topicId,
        questions,
        total: questions.reduce((sum, q) => sum + q.count, 0),
      }))
      .sort((a, b) => b.total - a.total)
  }, [filteredFaqs])

  const maxCount = Math.max(...faqQuestions.map((q) => q.count), 1)
  const totalAsks = faqQuestions.reduce((sum, q) => sum + q.count, 0)

  // ---- Prompt management ----
  const filteredPrompts = useMemo(() => {
    if (promptPage === "all") return prompts
    return prompts.filter((p) => p.pageIds.includes(promptPage))
  }, [prompts, promptPage])

  const openAddDialog = (prefillText = "") => {
    setEditing(null)
    setFormText(prefillText)
    setFormPageIds([])
    setFormEnabled(true)
    setIsDialogOpen(true)
  }

  const openEditDialog = (prompt: SuggestedQuestion) => {
    setEditing(prompt)
    setFormText(prompt.text)
    setFormPageIds(prompt.pageIds)
    setFormEnabled(prompt.enabled)
    setIsDialogOpen(true)
  }

  const togglePage = (pageId: string) => {
    setFormPageIds((prev) =>
      prev.includes(pageId) ? prev.filter((p) => p !== pageId) : [...prev, pageId],
    )
  }

  const handleSavePrompt = () => {
    const missing: string[] = []
    if (!formText.trim()) missing.push("Question")
    if (formPageIds.length === 0) missing.push("At least one page")
    if (missing.length > 0) {
      showToast({
        variant: "error",
        title: "Required fields missing",
        message: `Please complete: ${missing.join(", ")}.`,
        primaryAction: { label: "Dismiss" },
      })
      return
    }

    if (editing) {
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? { ...p, text: formText.trim(), pageIds: formPageIds, enabled: formEnabled }
            : p,
        ),
      )
      showToast({
        variant: "success",
        title: "Prompt updated",
        message: "The suggested prompt has been updated.",
        primaryAction: { label: "Dismiss" },
      })
    } else {
      const newPrompt: SuggestedQuestion = {
        id: `sq-${Date.now()}`,
        text: formText.trim(),
        pageIds: formPageIds,
        enabled: formEnabled,
      }
      setPrompts((prev) => [newPrompt, ...prev])
      showToast({
        variant: "success",
        title: "Prompt added",
        message: `Attached to ${formPageIds.map(getPageLabel).join(", ")}.`,
        primaryAction: { label: "Dismiss" },
      })
    }
    setIsDialogOpen(false)
  }

  const handleDeletePrompt = (prompt: SuggestedQuestion) => {
    setPrompts((prev) => prev.filter((p) => p.id !== prompt.id))
    setDeleteConfirm(null)
    showToast({
      variant: "success",
      title: "Prompt removed",
      message: "The suggested prompt has been removed.",
      primaryAction: { label: "Dismiss" },
    })
  }

  const handleToggleEnabled = (id: string) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)))
  }

  const addFaqAsPrompt = (text: string) => {
    setView("prompts")
    openAddDialog(text)
  }

  // ---- Access gate ----
  if (!allowed) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <TopNavigation />
          </div>
          <main className="flex-1 px-4 pb-6 overflow-auto">
            <Card className="bg-white border-slate-200">
              <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-slate-400" />
                </div>
                <h1 className="text-lg font-semibold text-slate-900">Restricted page</h1>
                <p className="text-sm text-slate-500 mt-1 max-w-md">
                  AI Chatbot management is only available to the Fuze platform administration
                  organisation.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <TopNavigation />
        </div>

        <main className="flex-1 px-4 pb-6 overflow-auto">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" style={{ color: NAVY }} />
                    <h1 className="text-xl font-bold text-slate-900">AI Management</h1>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Review the most frequently asked questions, grouped by topic, and curate the
                    suggested prompts shown in the AI chatbot on each page.
                  </p>
                </div>
                {view === "prompts" && (
                  <Button
                    onClick={() => openAddDialog()}
                    className="text-white"
                    style={{ backgroundColor: NAVY }}
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add prompt
                  </Button>
                )}
              </div>

              {/* Stat tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Questions asked (30 days)
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {totalAsks.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Topic groups
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{topics.length}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Active suggested prompts
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {hydrated ? prompts.filter((p) => p.enabled).length : "—"}
                  </p>
                </div>
              </div>

              {/* View toggle */}
              <div className="inline-flex items-center rounded-lg border border-slate-200 p-1 mb-6">
                <button
                  onClick={() => setView("popular")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    view === "popular" ? "text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                  style={view === "popular" ? { backgroundColor: NAVY } : undefined}
                >
                  Popular questions
                </button>
                <button
                  onClick={() => setView("prompts")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    view === "prompts" ? "text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                  style={view === "prompts" ? { backgroundColor: NAVY } : undefined}
                >
                  Suggested prompts
                </button>
              </div>

              {/* ---------- Popular questions view ---------- */}
              {view === "popular" && (
                <>
                  <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        value={faqSearch}
                        onChange={(e) => setFaqSearch(e.target.value)}
                        placeholder="Search questions..."
                        className="pl-9"
                      />
                    </div>
                    <Select value={faqTopic} onValueChange={setFaqTopic}>
                      <SelectTrigger className="w-full sm:w-56">
                        <SelectValue placeholder="All topics" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All topics</SelectItem>
                        {topics.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {groupedFaqs.length === 0 ? (
                    <div className="py-12 text-center text-sm text-slate-400">
                      No questions match your search.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {groupedFaqs.map(({ topicId, questions, total }) => {
                        const topic = getTopic(topicId)
                        const isCollapsed = collapsed[topicId]
                        return (
                          <div
                            key={topicId}
                            className="rounded-lg border border-slate-200 overflow-hidden"
                          >
                            <button
                              onClick={() =>
                                setCollapsed((prev) => ({ ...prev, [topicId]: !prev[topicId] }))
                              }
                              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                            >
                              {isCollapsed ? (
                                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: topic.color }}
                              />
                              <span className="font-semibold text-slate-900">{topic.label}</span>
                              <span className="text-xs text-slate-500">
                                {questions.length} question{questions.length === 1 ? "" : "s"}
                              </span>
                              <span
                                className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${topic.color}18`, color: topic.color }}
                              >
                                {total.toLocaleString()} asks
                              </span>
                            </button>

                            {!isCollapsed && (
                              <div className="divide-y divide-slate-100">
                                {questions.map((q) => {
                                  const isPrompt = prompts.some(
                                    (p) => p.text.toLowerCase() === q.text.toLowerCase(),
                                  )
                                  return (
                                    <div
                                      key={q.id}
                                      className="flex items-center gap-4 px-4 py-3 group"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800">{q.text}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                          {/* Frequency bar */}
                                          <div className="w-28 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                              className="h-full rounded-full"
                                              style={{
                                                width: `${(q.count / maxCount) * 100}%`,
                                                backgroundColor: topic.color,
                                              }}
                                            />
                                          </div>
                                          <span className="text-xs font-medium text-slate-600">
                                            {q.count.toLocaleString()}
                                          </span>
                                          <span
                                            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                                              q.trend >= 0 ? "text-emerald-600" : "text-red-500"
                                            }`}
                                          >
                                            {q.trend >= 0 ? (
                                              <TrendingUp className="w-3 h-3" />
                                            ) : (
                                              <TrendingDown className="w-3 h-3" />
                                            )}
                                            {Math.abs(q.trend)}%
                                          </span>
                                          <span className="text-xs text-slate-400">
                                            · {q.lastAsked}
                                          </span>
                                        </div>
                                      </div>
                                      {isPrompt ? (
                                        <span className="text-xs font-medium text-slate-400 shrink-0">
                                          Added
                                        </span>
                                      ) : (
                                        <Button
                                          size="sm"
                                          onClick={() => addFaqAsPrompt(q.text)}
                                          className="shrink-0 text-white hover:opacity-90 opacity-0 group-hover:opacity-100 transition-opacity"
                                          style={{ backgroundColor: "#121051" }}
                                        >
                                          <Plus className="w-3.5 h-3.5 mr-1" />
                                          Add as prompt
                                        </Button>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}

              {/* ---------- Suggested prompts view ---------- */}
              {view === "prompts" && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                    <p className="text-sm text-slate-500 flex-1">
                      Prompts appear as quick-start suggestions in the chatbot on the pages they are
                      attached to.
                    </p>
                    <Select value={promptPage} onValueChange={setPromptPage}>
                      <SelectTrigger className="w-full sm:w-56">
                        <SelectValue placeholder="All pages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All pages</SelectItem>
                        {chatbotPages.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!hydrated ? (
                    <div className="py-12 text-center text-sm text-slate-400">Loading...</div>
                  ) : filteredPrompts.length === 0 ? (
                    <div className="py-12 text-center">
                      <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        No suggested prompts{promptPage !== "all" ? " for this page" : ""} yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredPrompts.map((prompt) => {
                        const topic = getTopic(categorise(prompt.text))
                        return (
                          <div
                            key={prompt.id}
                            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-colors"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: topic.color }}
                              title={topic.label}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800">{prompt.text}</p>
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span
                                  className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: `${topic.color}18`,
                                    color: topic.color,
                                  }}
                                >
                                  {topic.label}
                                </span>
                                {prompt.pageIds.map((pid) => (
                                  <span
                                    key={pid}
                                    className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-200 text-slate-600"
                                  >
                                    {getPageLabel(pid)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Switch
                                checked={prompt.enabled}
                                onCheckedChange={() => handleToggleEnabled(prompt.id)}
                                aria-label={`Toggle ${prompt.text}`}
                                className="data-[state=checked]:bg-[#121051]"
                              />
                              <button
                                onClick={() => openEditDialog(prompt)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-[#121051] hover:bg-slate-100 transition-colors"
                                aria-label={`Edit ${prompt.text}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(prompt)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                aria-label={`Delete ${prompt.text}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add / Edit prompt dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            {editing ? "Edit suggested prompt" : "Add suggested prompt"}
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt-text">
                Question<span className="text-red-500">*</span>
              </Label>
              <Input
                id="prompt-text"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder="e.g. How does our Attendance compare to last term?"
                className="mt-1.5"
              />
              {formText.trim() && (
                <p className="text-xs text-slate-500 mt-1.5">
                  Topic group:{" "}
                  <span style={{ color: getTopic(categorise(formText)).color }}>
                    {getTopic(categorise(formText)).label}
                  </span>{" "}
                  (auto-detected from keywords)
                </p>
              )}
            </div>

            <div>
              <Label>
                Show on pages<span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {chatbotPages.map((page) => (
                  <label
                    key={page.id}
                    className="flex items-center gap-2 p-2.5 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-50"
                  >
                    <Checkbox
                      checked={formPageIds.includes(page.id)}
                      onCheckedChange={() => togglePage(page.id)}
                    />
                    <span className="text-sm text-slate-700">{page.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-800">Enabled</p>
                <p className="text-xs text-slate-500">Show this prompt to users in the chatbot</p>
              </div>
              <Switch
                checked={formEnabled}
                onCheckedChange={setFormEnabled}
                className="data-[state=checked]:bg-[#121051]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePrompt} className="text-white" style={{ backgroundColor: NAVY }}>
              {editing ? "Save changes" : "Add prompt"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <h2 className="text-base font-semibold text-slate-900">Remove prompt?</h2>
          <p className="text-sm text-slate-500 mt-1">
            {deleteConfirm ? `"${deleteConfirm.text}" will no longer appear in the chatbot.` : ""}
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => deleteConfirm && handleDeletePrompt(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
