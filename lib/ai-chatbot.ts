"use client"

import { useEffect, useState } from "react"

// Pages where the AI chatbot widget is available to end users. Suggested
// prompts can be attached to any of these so they appear in the chatbot on
// that page.
export const chatbotPages: { id: string; label: string; path: string }[] = [
  { id: "home", label: "Home", path: "/home" },
  { id: "reports", label: "Reports", path: "/reports" },
  { id: "dashboards", label: "Dashboards", path: "/dashboards" },
  { id: "forms", label: "Forms", path: "/forms" },
  { id: "ai-chat", label: "AI Chat", path: "/ai-chat" },
]

export function getPageLabel(pageId: string): string {
  return chatbotPages.find((p) => p.id === pageId)?.label ?? pageId
}

// Topic groups. Questions asked in the chatbot are grouped automatically by
// matching keywords (e.g. "Attainment", "Attendance").
export type Topic = {
  id: string
  label: string
  color: string
  keywords: string[]
}

export const topics: Topic[] = [
  {
    id: "attainment",
    label: "Attainment",
    color: "#5B9BF5",
    keywords: ["attainment", "progress 8", "attainment 8", "sats", "gcse", "result", "grade", "exam", "ks2", "ks4"],
  },
  {
    id: "attendance",
    label: "Attendance",
    color: "#10b981",
    keywords: ["attendance", "absence", "absent", "persistent", "authorised", "unauthorised", "truancy", "late"],
  },
  {
    id: "behaviour",
    label: "Behaviour",
    color: "#f59e0b",
    keywords: ["behaviour", "exclusion", "suspension", "detention", "incident", "conduct"],
  },
  {
    id: "send",
    label: "SEND",
    color: "#8b5cf6",
    keywords: ["send", "sen ", "ehcp", "special educational", "send support", "ehc plan"],
  },
  {
    id: "finance",
    label: "Finance & Funding",
    color: "#0ea5e9",
    keywords: ["finance", "budget", "funding", "pupil premium", "cost", "spend", "income"],
  },
  {
    id: "ofsted",
    label: "Ofsted & Compliance",
    color: "#ef4444",
    keywords: ["ofsted", "inspection", "safeguarding", "compliance", "policy", "census", "statutory"],
  },
]

export const UNCATEGORISED: { id: string; label: string; color: string } = {
  id: "other",
  label: "Other",
  color: "#64748b",
}

// Assign a question to a topic by keyword match.
export function categorise(text: string): string {
  const lower = ` ${text.toLowerCase()} `
  for (const t of topics) {
    if (t.keywords.some((k) => lower.includes(k))) return t.id
  }
  return UNCATEGORISED.id
}

export function getTopic(id: string): { id: string; label: string; color: string } {
  return topics.find((t) => t.id === id) ?? UNCATEGORISED
}

// ---------------------------------------------------------------------------
// Suggested prompts — admin-curated questions attached to the chatbot per page
// ---------------------------------------------------------------------------
export type SuggestedQuestion = {
  id: string
  text: string
  pageIds: string[]
  enabled: boolean
}

export const defaultSuggestedQuestions: SuggestedQuestion[] = [
  {
    id: "sq-1",
    text: "How does our Progress 8 score compare to last year?",
    pageIds: ["dashboards", "reports"],
    enabled: true,
  },
  {
    id: "sq-2",
    text: "Which year groups have the highest persistent absence?",
    pageIds: ["dashboards", "home"],
    enabled: true,
  },
  {
    id: "sq-3",
    text: "Summarise this term's fixed-term exclusions.",
    pageIds: ["dashboards"],
    enabled: true,
  },
  {
    id: "sq-4",
    text: "How is our Pupil Premium funding being spent?",
    pageIds: ["reports"],
    enabled: false,
  },
  {
    id: "sq-5",
    text: "What should we prepare for our next Ofsted inspection?",
    pageIds: ["home"],
    enabled: true,
  },
]

// ---------------------------------------------------------------------------
// Frequently asked questions — analytics of what users actually ask. Read-only
// usage data used to surface popular questions and inform suggested prompts.
// ---------------------------------------------------------------------------
export type FaqQuestion = {
  id: string
  text: string
  /** Times asked in the last 30 days. */
  count: number
  /** Percentage change vs the previous 30-day period. */
  trend: number
  lastAsked: string
}

export const faqQuestions: FaqQuestion[] = [
  { id: "f1", text: "How does our Attainment 8 compare to national average?", count: 342, trend: 18, lastAsked: "2 hours ago" },
  { id: "f2", text: "What is our current Progress 8 score?", count: 287, trend: 12, lastAsked: "1 hour ago" },
  { id: "f3", text: "Which pupils are below expected attainment in maths?", count: 156, trend: -4, lastAsked: "5 hours ago" },
  { id: "f4", text: "Show me KS2 SATs results by subject.", count: 134, trend: 7, lastAsked: "Yesterday" },
  { id: "f5", text: "Which year groups have the highest persistent absence?", count: 298, trend: 24, lastAsked: "30 minutes ago" },
  { id: "f6", text: "What is our overall attendance rate this term?", count: 264, trend: 9, lastAsked: "3 hours ago" },
  { id: "f7", text: "How many pupils have unauthorised absence?", count: 171, trend: 15, lastAsked: "4 hours ago" },
  { id: "f8", text: "Show attendance for free school meal pupils.", count: 88, trend: 2, lastAsked: "Yesterday" },
  { id: "f9", text: "Summarise this term's fixed-term exclusions.", count: 142, trend: -8, lastAsked: "6 hours ago" },
  { id: "f10", text: "Which pupils have the most behaviour incidents?", count: 119, trend: 5, lastAsked: "Yesterday" },
  { id: "f11", text: "How many pupils have an EHCP?", count: 97, trend: 11, lastAsked: "8 hours ago" },
  { id: "f12", text: "Show me SEND support pupils by year group.", count: 73, trend: 3, lastAsked: "Yesterday" },
  { id: "f13", text: "How is our Pupil Premium funding being spent?", count: 124, trend: 19, lastAsked: "2 hours ago" },
  { id: "f14", text: "What is our remaining budget this year?", count: 81, trend: -2, lastAsked: "Yesterday" },
  { id: "f15", text: "What should we prepare for our next Ofsted inspection?", count: 203, trend: 31, lastAsked: "1 hour ago" },
  { id: "f16", text: "Are our safeguarding records up to date?", count: 92, trend: 6, lastAsked: "5 hours ago" },
  { id: "f17", text: "When is the Spring Census deadline?", count: 110, trend: 22, lastAsked: "3 hours ago" },
  { id: "f18", text: "How do I export this report to Excel?", count: 64, trend: 1, lastAsked: "Yesterday" },
]

const STORAGE_KEY = "matpad:ai-chatbot-prompts"

function loadSuggested(): SuggestedQuestion[] {
  if (typeof window === "undefined") return defaultSuggestedQuestions
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSuggestedQuestions
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaultSuggestedQuestions
    return parsed as SuggestedQuestion[]
  } catch {
    return defaultSuggestedQuestions
  }
}

function saveSuggested(items: SuggestedQuestion[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore write errors (e.g. storage disabled)
  }
}

/**
 * Shared hook for reading and updating the admin-curated suggested prompts that
 * appear in the AI chatbot on each page. Backed by localStorage.
 */
export function useChatbotPrompts() {
  const [items, setItems] = useState<SuggestedQuestion[]>(defaultSuggestedQuestions)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(loadSuggested())
    setHydrated(true)
  }, [])

  const update = (next: SuggestedQuestion[] | ((prev: SuggestedQuestion[]) => SuggestedQuestion[])) => {
    setItems((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next
      saveSuggested(resolved)
      return resolved
    })
  }

  return { items, setItems: update, hydrated }
}
