"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * AI Management data model.
 *
 * Concepts:
 * - ChatTarget: a specific report or dashboard the chatbot can be configured for.
 * - AskRecord: an aggregated record of a real question users have asked the chatbot,
 *   scoped to the target it was asked on. Drives auto-surfacing and trend tracking.
 * - AskLogEntry: an individual, granular question event (who asked, what page they
 *   were on, when) used for the exportable Reports tab.
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
  /** Auto-surfaced questions an admin has dismissed. Never shown, even if top-asked. */
  excluded?: string[]
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

/** A single question event — one row in the exportable Reports log. */
export interface AskLogEntry {
  id: string
  /** ISO timestamp of when the question was asked. */
  askedAt: string
  /** The exact question the user typed. */
  question: string
  topic: string
  /** Person who asked. */
  user: string
  /** Their role / job title. */
  role: string
  /** School or organisation they belong to. */
  school: string
  /** The report or dashboard they were viewing when they asked. */
  page: string
  /** The id of the target (report/dashboard) when it maps to one, else "". */
  targetId: string
  /** Whether the chatbot was able to answer from existing data. */
  answered: boolean
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

// People used to generate a realistic individual question log.
const LOG_PEOPLE: { user: string; role: string; school: string }[] = [
  { user: "Sarah Thompson", role: "Headteacher", school: "Oakfield Primary" },
  { user: "James Patel", role: "Deputy Head", school: "Oakfield Primary" },
  { user: "Emily Carter", role: "Attendance Lead", school: "St Mary's CofE" },
  { user: "David Owusu", role: "SENDCo", school: "St Mary's CofE" },
  { user: "Rachel Green", role: "Assessment Lead", school: "Greenhill Academy" },
  { user: "Mark Robinson", role: "Business Manager", school: "Greenhill Academy" },
  { user: "Priya Sharma", role: "Pastoral Lead", school: "Riverside High" },
  { user: "Tom Walker", role: "Data Manager", school: "Riverside High" },
  { user: "Laura Bennett", role: "Class Teacher", school: "Hillside Junior" },
  { user: "Daniel Foster", role: "Trust Data Lead", school: "Fuze MAT (Central)" },
]

/**
 * Build a granular question log from the aggregated asks so the Reports tab has
 * realistic per-person rows (who asked, which page, when). Each aggregated ask
 * spawns several individual events spread across people and recent days.
 */
function buildSeedLog(): AskLogEntry[] {
  const log: AskLogEntry[] = []
  let counter = 0
  const now = Date.now()
  const targetName = (id: string) => SEED_TARGETS.find((t) => t.id === id)?.name ?? "Unknown"

  for (const ask of SEED_ASKS) {
    // More popular questions appear more often in the log (capped for readability).
    const occurrences = Math.min(6, Math.max(2, Math.round(ask.count / 70)))
    for (let i = 0; i < occurrences; i++) {
      const person = LOG_PEOPLE[(counter + i) % LOG_PEOPLE.length]
      const hoursAgo = (counter * 7 + i * 13) % 96 // within last 4 days
      log.push({
        id: `log-${++counter}`,
        askedAt: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
        question: ask.question,
        topic: ask.topic,
        user: person.user,
        role: person.role,
        school: person.school,
        page: targetName(ask.targetId),
        targetId: ask.targetId,
        answered: ask.trend >= 0 ? true : i % 3 !== 0,
      })
    }
  }

  // A few "unanswered" requests for things we don't have a report for yet —
  // these surface in the export as gaps to investigate.
  const unmet: { q: string; topic: string }[] = [
    { q: "Can I get a governor-ready termly summary report?", topic: "Ofsted & Compliance" },
    { q: "Show Pupil Premium spending impact this year.", topic: "Finance" },
    { q: "Compare all schools in the trust side by side.", topic: "Attainment" },
    { q: "Reading age vs chronological age for Year 4.", topic: "Assessment" },
  ]
  for (const u of unmet) {
    const person = LOG_PEOPLE[counter % LOG_PEOPLE.length]
    const hoursAgo = (counter * 5) % 96
    log.push({
      id: `log-${++counter}`,
      askedAt: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
      question: u.q,
      topic: u.topic,
      user: person.user,
      role: person.role,
      school: person.school,
      page: "AI Assistant (no report match)",
      targetId: "",
      answered: false,
    })
  }

  return log.sort((a, b) => new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime())
}

const SEED_LOG: AskLogEntry[] = buildSeedLog()

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

const TARGETS_KEY = "matpad:ai-mgmt-targets-v1"

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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTargets(load(TARGETS_KEY, SEED_TARGETS))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) save(TARGETS_KEY, targets)
  }, [targets, mounted])

  // Asks + the question log are analytics — read-only, not persisted/edited by admins.
  const asks = SEED_ASKS
  const log = SEED_LOG

  const toggleAutoSurface = useCallback((targetId: string) => {
    setTargets((prev) => prev.map((t) => (t.id === targetId ? { ...t, autoSurface: !t.autoSurface } : t)))
  }, [])

  const pinQuestion = useCallback((targetId: string, question: string) => {
    const q = question.trim()
    if (!q) return
    setTargets((prev) =>
      prev.map((t) =>
        t.id === targetId
          ? {
              ...t,
              // Pinning a previously dismissed question un-dismisses it.
              excluded: (t.excluded ?? []).filter((e) => e.toLowerCase() !== q.toLowerCase()),
              pinned: t.pinned.some((p) => p.toLowerCase() === q.toLowerCase()) ? t.pinned : [...t.pinned, q],
            }
          : t,
      ),
    )
  }, [])

  /** Dismiss an auto-surfaced question so it is no longer suggested on this target. */
  const excludeQuestion = useCallback((targetId: string, question: string) => {
    const q = question.trim()
    if (!q) return
    setTargets((prev) =>
      prev.map((t) =>
        t.id === targetId && !(t.excluded ?? []).some((e) => e.toLowerCase() === q.toLowerCase())
          ? { ...t, excluded: [...(t.excluded ?? []), q] }
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

  return {
    mounted,
    targets,
    asks,
    log,
    toggleAutoSurface,
    pinQuestion,
    updatePinned,
    removePinned,
    excludeQuestion,
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
  const excluded = target.excluded ?? []
  if (target.autoSurface) {
    for (const a of topAsksForTarget(asks, target.id, limit)) {
      if (result.length >= limit) break
      if (excluded.some((e) => e.toLowerCase() === a.question.toLowerCase())) continue
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

// ---------------------------------------------------------------------------
// Question log helpers (Reports tab + Excel export)
// ---------------------------------------------------------------------------

export interface LogFilters {
  search: string
  school: string // "all" or a school name
  topic: string // "all" or a topic name
  answered: "all" | "answered" | "unanswered"
}

export function formatLogDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function filterLog(log: AskLogEntry[], filters: LogFilters): AskLogEntry[] {
  const q = filters.search.trim().toLowerCase()
  return log.filter((e) => {
    if (filters.school !== "all" && e.school !== filters.school) return false
    if (filters.topic !== "all" && e.topic !== filters.topic) return false
    if (filters.answered === "answered" && !e.answered) return false
    if (filters.answered === "unanswered" && e.answered) return false
    if (q) {
      return (
        e.question.toLowerCase().includes(q) ||
        e.user.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.page.toLowerCase().includes(q)
      )
    }
    return true
  })
}

/** Convert log rows into the flat, human-readable shape used for Excel export. */
export function logToExportRows(log: AskLogEntry[]) {
  return log.map((e) => ({
    "Date & time": formatLogDate(e.askedAt),
    User: e.user,
    Role: e.role,
    "School / Org": e.school,
    "Page / Report": e.page,
    Topic: e.topic,
    Question: e.question,
    Answered: e.answered ? "Yes" : "No",
  }))
}

export function uniqueValues<K extends keyof AskLogEntry>(log: AskLogEntry[], key: K): string[] {
  return Array.from(new Set(log.map((e) => String(e[key])))).sort()
}
