"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * AI Management data model.
 *
 * Concepts:
 * - ChatTarget: a specific report or dashboard the chatbot can be configured for.
 * - AskRecord: an aggregated record of a real question users have asked the chatbot,
 *   scoped to the target it was asked on. Drives auto-surfacing and trend tracking.
 * - DemandRecord: clustered requests for reports/data that do NOT map to an existing
 *   target — i.e. things users want that we have not built yet.
 */

export type TargetKind = "dashboard" | "report"

export interface ChatTarget {
  id: string
  name: string
  kind: TargetKind
  /** Broad area used for grouping + colour. */
  area: string
  /** When true, the chatbot automatically surfaces the top-asked questions on this target. */
  autoSurface: boolean
  /** Questions an admin has explicitly pinned to this target. Always shown. */
  pinned: string[]
}

export interface AskRecord {
  id: string
  targetId: string
  question: string
  /** Keyword topic the question clusters under. */
  topic: string
  /** Total times asked (rolling 30 days). */
  count: number
  /** % change vs previous period. Positive = trending up. */
  trend: number
  lastAsked: string
}

export interface DemandRecord {
  id: string
  /** The kind of report/data users are asking for that does not exist yet. */
  request: string
  topic: string
  /** Number of distinct asks clustered into this request. */
  count: number
  trend: number
  /** Where these requests come from most. */
  topSource: string
  status: "new" | "reviewing" | "planned" | "dismissed"
}

export const AREA_COLORS: Record<string, string> = {
  Attendance: "#15803d",
  Attainment: "#1d4ed8",
  Behaviour: "#b45309",
  SEND: "#7c3aed",
  Finance: "#0e7490",
  "Ofsted & Compliance": "#dc2626",
  Assessment: "#be185d",
  General: "#475569",
}

export function getAreaColor(area: string): string {
  return AREA_COLORS[area] ?? AREA_COLORS.General
}

export const DEMAND_STATUS_LABELS: Record<DemandRecord["status"], string> = {
  new: "New",
  reviewing: "Reviewing",
  planned: "Planned",
  dismissed: "Dismissed",
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const SEED_TARGETS: ChatTarget[] = [
  {
    id: "dash-attendance",
    name: "Attendance Dashboard",
    kind: "dashboard",
    area: "Attendance",
    autoSurface: true,
    pinned: ["What is our overall attendance rate this term?"],
  },
  {
    id: "dash-attainment",
    name: "Attainment Dashboard",
    kind: "dashboard",
    area: "Attainment",
    autoSurface: true,
    pinned: ["How does our Attainment 8 compare to national average?"],
  },
  {
    id: "dash-behaviour",
    name: "Behaviour Dashboard",
    kind: "dashboard",
    area: "Behaviour",
    autoSurface: false,
    pinned: [],
  },
  {
    id: "rep-attendance-headlines",
    name: "Attendance Headlines",
    kind: "report",
    area: "Attendance",
    autoSurface: true,
    pinned: [],
  },
  {
    id: "rep-persistent-absence",
    name: "Persistent Absence Report",
    kind: "report",
    area: "Attendance",
    autoSurface: true,
    pinned: [],
  },
  {
    id: "rep-progress8",
    name: "Progress 8 Report",
    kind: "report",
    area: "Attainment",
    autoSurface: true,
    pinned: [],
  },
  {
    id: "rep-ks2",
    name: "KS2 Results Report",
    kind: "report",
    area: "Assessment",
    autoSurface: true,
    pinned: [],
  },
  {
    id: "rep-eyfs-headlines",
    name: "EYFS Headlines",
    kind: "report",
    area: "Assessment",
    autoSurface: false,
    pinned: [],
  },
  {
    id: "rep-send",
    name: "SEND Provision Report",
    kind: "report",
    area: "SEND",
    autoSurface: true,
    pinned: [],
  },
]

const SEED_ASKS: AskRecord[] = [
  // Attendance Dashboard
  { id: "a1", targetId: "dash-attendance", question: "What is our overall attendance rate this term?", topic: "Attendance", count: 412, trend: 9, lastAsked: "20 minutes ago" },
  { id: "a2", targetId: "dash-attendance", question: "Which year groups have the highest persistent absence?", topic: "Attendance", count: 298, trend: 24, lastAsked: "1 hour ago" },
  { id: "a3", targetId: "dash-attendance", question: "How many pupils have unauthorised absence?", topic: "Attendance", count: 171, trend: 15, lastAsked: "3 hours ago" },
  { id: "a4", targetId: "dash-attendance", question: "Show attendance for free school meal pupils.", topic: "Attendance", count: 88, trend: 2, lastAsked: "Yesterday" },
  // Attainment Dashboard
  { id: "a5", targetId: "dash-attainment", question: "How does our Attainment 8 compare to national average?", topic: "Attainment", count: 342, trend: 18, lastAsked: "2 hours ago" },
  { id: "a6", targetId: "dash-attainment", question: "What is our current Progress 8 score?", topic: "Attainment", count: 287, trend: 12, lastAsked: "1 hour ago" },
  { id: "a7", targetId: "dash-attainment", question: "Which pupils are below expected attainment in maths?", topic: "Attainment", count: 156, trend: -4, lastAsked: "5 hours ago" },
  // Behaviour Dashboard
  { id: "a8", targetId: "dash-behaviour", question: "How many behaviour incidents this week?", topic: "Behaviour", count: 134, trend: 31, lastAsked: "40 minutes ago" },
  { id: "a9", targetId: "dash-behaviour", question: "Which pupils have the most detentions?", topic: "Behaviour", count: 97, trend: 8, lastAsked: "2 hours ago" },
  // Attendance Headlines report
  { id: "a10", targetId: "rep-attendance-headlines", question: "What is our attendance vs last year?", topic: "Attendance", count: 203, trend: 11, lastAsked: "1 hour ago" },
  { id: "a11", targetId: "rep-attendance-headlines", question: "Break attendance down by year group.", topic: "Attendance", count: 142, trend: 6, lastAsked: "4 hours ago" },
  // Persistent Absence
  { id: "a12", targetId: "rep-persistent-absence", question: "Who are our persistently absent pupils?", topic: "Attendance", count: 188, trend: 27, lastAsked: "30 minutes ago" },
  { id: "a13", targetId: "rep-persistent-absence", question: "Show persistent absence by SEND status.", topic: "SEND", count: 76, trend: 14, lastAsked: "Yesterday" },
  // Progress 8
  { id: "a14", targetId: "rep-progress8", question: "What is our Progress 8 by subject bucket?", topic: "Attainment", count: 164, trend: 7, lastAsked: "3 hours ago" },
  { id: "a15", targetId: "rep-progress8", question: "Which subjects are dragging Progress 8 down?", topic: "Attainment", count: 129, trend: 19, lastAsked: "1 hour ago" },
  // KS2
  { id: "a16", targetId: "rep-ks2", question: "Show KS2 SATs results by subject.", topic: "Assessment", count: 134, trend: 7, lastAsked: "Yesterday" },
  { id: "a17", targetId: "rep-ks2", question: "How many pupils met the expected standard in reading?", topic: "Assessment", count: 91, trend: 5, lastAsked: "2 hours ago" },
  // SEND
  { id: "a18", targetId: "rep-send", question: "How many pupils are on the SEND register?", topic: "SEND", count: 118, trend: 13, lastAsked: "1 hour ago" },
  { id: "a19", targetId: "rep-send", question: "Show progress for pupils with an EHCP.", topic: "SEND", count: 84, trend: 22, lastAsked: "3 hours ago" },
]

const SEED_DEMAND: DemandRecord[] = [
  { id: "d1", request: "A governor-ready termly summary report", topic: "Ofsted & Compliance", count: 142, trend: 38, topSource: "Headteachers", status: "new" },
  { id: "d2", request: "Pupil Premium impact / spending report", topic: "Finance", count: 118, trend: 41, topSource: "Business Managers", status: "reviewing" },
  { id: "d3", request: "Live attendance vs target tracker", topic: "Attendance", count: 96, trend: 22, topSource: "Attendance Leads", status: "planned" },
  { id: "d4", request: "Reading age vs chronological age report", topic: "Assessment", count: 73, trend: 18, topSource: "English Leads", status: "new" },
  { id: "d5", request: "Multi-school MAT comparison dashboard", topic: "Attainment", count: 64, trend: 29, topSource: "Trust Leaders", status: "reviewing" },
  { id: "d6", request: "Suspension / exclusion trends over time", topic: "Behaviour", count: 51, trend: 12, topSource: "Pastoral Leads", status: "new" },
  { id: "d7", request: "Destinations / leavers tracking report", topic: "General", count: 33, trend: 4, topSource: "Sixth Form", status: "dismissed" },
]

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

const TARGETS_KEY = "matpad:ai-mgmt-targets-v1"
const DEMAND_KEY = "matpad:ai-mgmt-demand-v1"

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write errors
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAiManagement() {
  const [targets, setTargets] = useState<ChatTarget[]>(SEED_TARGETS)
  const [demand, setDemand] = useState<DemandRecord[]>(SEED_DEMAND)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTargets(load(TARGETS_KEY, SEED_TARGETS))
    setDemand(load(DEMAND_KEY, SEED_DEMAND))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) save(TARGETS_KEY, targets)
  }, [targets, mounted])

  useEffect(() => {
    if (mounted) save(DEMAND_KEY, demand)
  }, [demand, mounted])

  // Asks are analytics — read-only, not persisted/edited by admins.
  const asks = SEED_ASKS

  const toggleAutoSurface = useCallback((targetId: string) => {
    setTargets((prev) => prev.map((t) => (t.id === targetId ? { ...t, autoSurface: !t.autoSurface } : t)))
  }, [])

  const pinQuestion = useCallback((targetId: string, question: string) => {
    const q = question.trim()
    if (!q) return
    setTargets((prev) =>
      prev.map((t) =>
        t.id === targetId && !t.pinned.some((p) => p.toLowerCase() === q.toLowerCase())
          ? { ...t, pinned: [...t.pinned, q] }
          : t,
      ),
    )
  }, [])

  const updatePinned = useCallback((targetId: string, index: number, question: string) => {
    const q = question.trim()
    if (!q) return
    setTargets((prev) =>
      prev.map((t) =>
        t.id === targetId ? { ...t, pinned: t.pinned.map((p, i) => (i === index ? q : p)) } : t,
      ),
    )
  }, [])

  const removePinned = useCallback((targetId: string, index: number) => {
    setTargets((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, pinned: t.pinned.filter((_, i) => i !== index) } : t)),
    )
  }, [])

  const setDemandStatus = useCallback((id: string, status: DemandRecord["status"]) => {
    setDemand((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)))
  }, [])

  return {
    mounted,
    targets,
    asks,
    demand,
    toggleAutoSurface,
    pinQuestion,
    updatePinned,
    removePinned,
    setDemandStatus,
  }
}

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

/** Top-asked questions for a target, most frequent first. */
export function topAsksForTarget(asks: AskRecord[], targetId: string, limit = 4): AskRecord[] {
  return asks
    .filter((a) => a.targetId === targetId)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/**
 * The questions the chatbot actually surfaces on a target:
 * admin-pinned first, then auto top-asked (deduped) when autoSurface is on.
 */
export function surfacedQuestions(
  target: ChatTarget,
  asks: AskRecord[],
  limit = 4,
): { text: string; source: "pinned" | "auto" }[] {
  const result: { text: string; source: "pinned" | "auto" }[] = target.pinned.map((p) => ({
    text: p,
    source: "pinned",
  }))
  if (target.autoSurface) {
    for (const a of topAsksForTarget(asks, target.id, limit)) {
      if (result.length >= limit) break
      if (!result.some((r) => r.text.toLowerCase() === a.question.toLowerCase())) {
        result.push({ text: a.question, source: "auto" })
      }
    }
  }
  return result.slice(0, limit)
}

/** Aggregate ask counts by topic across all targets, for the Trends tab. */
export function asksByTopic(
  asks: AskRecord[],
): { topic: string; total: number; trend: number; questions: AskRecord[] }[] {
  const map = new Map<string, AskRecord[]>()
  for (const a of asks) {
    const arr = map.get(a.topic) ?? []
    arr.push(a)
    map.set(a.topic, arr)
  }
  return Array.from(map.entries())
    .map(([topic, questions]) => {
      const total = questions.reduce((s, q) => s + q.count, 0)
      const trend = Math.round(questions.reduce((s, q) => s + q.trend * q.count, 0) / total)
      return { topic, total, trend, questions: questions.sort((a, b) => b.count - a.count) }
    })
    .sort((a, b) => b.total - a.total)
}

export function totalAsks(asks: AskRecord[]): number {
  return asks.reduce((s, a) => s + a.count, 0)
}
