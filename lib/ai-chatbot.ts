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
  /** The response the chatbot gave back to the user. */
  answer: string
}

/**
 * Report areas a question can be assigned to. Mirrors the Report Area options on
 * Dashboard Settings. A question pinned to an area is surfaced by the chatbot on
 * every dashboard/report that belongs to that area.
 */
export const REPORT_AREAS = [
  "Attendance",
  "Attainment",
  "Behaviour",
  "Finance",
  "Safeguarding",
  "SEND",
  "Staffing",
  "Curriculum",
  "Pastoral",
  "Other",
] as const

// Category colours from the brand style guide (Style Guide → Colours → Category).
// Keep these in sync with `categoryColors` on app/settings/style-guide/page.tsx.
export const AREA_COLORS: Record<string, string> = {
  Attendance: "#5BBE80", // Green
  Attainment: "#5B9BF5", // Blue
  Behaviour: "#F79400", // Orange
  Finance: "#2395A4", // Teal
  Safeguarding: "#F7555A", // Red
  SEND: "#715DBF", // Purple
  Staffing: "#B3008B", // Magenta
  Curriculum: "#6AD0D5", // Light Teal
  Pastoral: "#121051", // Brand Navy
  Other: "#64748B", // slate-500 (neutral catch-all)
  // Legacy areas still present in seed data / logs.
  "Ofsted & Compliance": "#F7555A",
  Assessment: "#B3008B",
  General: "#64748B",
}

export function getAreaColor(area: string): string {
  return AREA_COLORS[area] ?? AREA_COLORS.Other
}

/** Normalise any stored area to one of the canonical REPORT_AREAS (legacy → "Other"). */
export function normaliseArea(area: string): string {
  return (REPORT_AREAS as readonly string[]).includes(area) ? area : "Other"
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
/**
 * Canned chatbot responses per known question, used to populate the question log
 * so admins can review exactly what the assistant replied. Keyed by the exact
 * question text from SEED_ASKS.
 */
const SEED_ANSWERS: Record<string, string> = {
  "What is our overall attendance rate this term?":
    "Overall attendance across the trust is 94.2% this term, which is 1.8 points below your 96% target but 0.3 points above the national average of 93.9%. Attendance has dipped 0.3 points compared with last term.",
  "Which year groups have the highest persistent absence?":
    "Year 10 (12.4%) and Year 11 (11.1%) have the highest persistent absence, both well above the trust average of 8.6%. Year 7 is lowest at 5.2%. The biggest term-on-term rise is in Year 10, up 2.4 points.",
  "How many pupils have unauthorised absence?":
    "418 pupils have at least one session of unauthorised absence this term (6.1% of the roll). Of these, 92 have unauthorised absence above 5%, concentrated in Years 9–11.",
  "Show attendance for free school meal pupils.":
    "FSM pupils are attending at 91.4%, compared with 95.1% for non-FSM pupils — a 3.7 point gap. The gap is widest in the secondary phase, where it reaches 5.2 points.",
  "How does our Attainment 8 compare to national average?":
    "Your Attainment 8 score is 47.2, just above the national average of 46.3. All Saints' is your strongest at 51.8; Notre Dame trails the national figure at 43.1.",
  "What is our current Progress 8 score?":
    "The trust-wide Progress 8 score is +0.12, indicating pupils make slightly more progress than the national average. Two of three secondaries are positive; Notre Dame sits at -0.18.",
  "Which pupils are below expected attainment in maths?":
    "I couldn't return a pupil-level maths list — individual prior-attainment data isn't connected to this dashboard yet.",
  "How many behaviour incidents this week?":
    "There have been 134 logged behaviour incidents this week, up 31% on last week. 58% relate to low-level disruption and the largest increase is in Year 9.",
  "Which pupils have the most detentions?":
    "The 10 pupils with the most detentions this term each have between 9 and 15, and 7 of the 10 are in Year 9. Six also appear on the persistent absence watchlist.",
  "What is our attendance vs last year?":
    "Attendance is 94.2% this year versus 94.5% at the same point last year — a 0.3 point decline. The drop is driven mainly by Year 10 and Year 11.",
  "Break attendance down by year group.":
    "Attendance by year group: Y7 96.1%, Y8 95.3%, Y9 94.0%, Y10 92.6%, Y11 92.9%. Primary phase year groups all sit above 95%.",
  "Who are our persistently absent pupils?":
    "There are 591 persistently absent pupils (below 90% attendance) this term, 8.6% of the roll. 64% are secondary-aged and 38% are also eligible for free school meals.",
  "Show persistent absence by SEND status.":
    "Persistent absence is 14.8% for pupils with SEND support and 17.2% for those with an EHCP, compared with 7.1% for pupils with no SEND need — roughly double the rate.",
  "What is our Progress 8 by subject bucket?":
    "Progress 8 by bucket: English +0.21, Maths +0.04, EBacc -0.08, Open +0.16. The EBacc bucket is the only negative element, dragging the headline figure down.",
  "Which subjects are dragging Progress 8 down?":
    "Within the EBacc bucket, MFL (-0.34) and Geography (-0.21) are the largest negatives. Science is broadly in line with national. Open-bucket subjects are a net positive.",
  "Show KS2 SATs results by subject.":
    "KS2 expected standard: Reading 76%, Writing 72%, Maths 79%, and 68% reaching the expected standard in all of reading, writing and maths combined — 3 points above national.",
  "How many pupils met the expected standard in reading?":
    "76% of pupils met the expected standard in reading at KS2, with 28% reaching the higher standard. This is 2 points above the national average for reading.",
  "How many pupils are on the SEND register?":
    "There are 1,043 pupils on the SEND register across the trust (15.2% of the roll): 904 at SEND support and 139 with an EHCP.",
  "Show progress for pupils with an EHCP.":
    "Pupils with an EHCP have an average Progress 8 of -0.41, below the trust average. 62% are working towards their individual targets, with attendance the most common barrier flagged.",
}

/** The standard reply used when the assistant has no connected data to answer from. */
const UNANSWERED_REPLY =
  "I couldn't answer this from the reports currently connected. There's no dashboard or dataset that covers this yet — it's been logged as a gap to investigate."

/** Resolve the response shown for a logged question. */
function answerFor(question: string, answered: boolean): string {
  if (!answered) return UNANSWERED_REPLY
  return (
    SEED_ANSWERS[question] ??
    "Here's a summary based on the latest data connected to this report. Open the report for the full breakdown."
  )
}

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
      const answered = ask.trend >= 0 ? true : i % 3 !== 0
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
        answered,
        answer: answerFor(ask.question, answered),
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
        answer: answerFor(u.q, false),
      })
  }

  return log.sort((a, b) => new Date(b.askedAt).getTime() - new Date(a.askedAt).getTime())
}

const SEED_LOG: AskLogEntry[] = buildSeedLog()

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

const TARGETS_KEY = "matpad:ai-mgmt-targets-v1"
const AREA_PINNED_KEY = "matpad:ai-mgmt-area-pinned-v1"
const REPORT_PINNED_KEY = "matpad:ai-mgmt-report-pinned-v1"

/**
 * A single admin-pinned suggested question. Its position in the list is the order
 * it appears in the AI chatbot; only `active` questions are surfaced there.
 */
export interface PinnedQuestion {
  text: string
  active: boolean
}

/** Maximum number of questions that can be active (surfaced) in a single list. */
export const MAX_ACTIVE_QUESTIONS = 5

/** Map of report area -> admin-pinned questions surfaced on every report in that area. */
export type AreaPinned = Record<string, PinnedQuestion[]>

/**
 * Map of a specific report/dashboard id (as listed on the Dashboards page) ->
 * admin-pinned questions surfaced by the chatbot ONLY when that exact report is open.
 */
export type ReportPinned = Record<string, PinnedQuestion[]>

const SEED_REPORT_PINNED: ReportPinned = {}

/**
 * Normalise a stored list into PinnedQuestion[]. Handles legacy data that was
 * persisted as a plain string[] (all treated as active), and clamps the active
 * count to MAX_ACTIVE_QUESTIONS so old data can't exceed the new cap.
 */
function normalisePinnedList(value: unknown): PinnedQuestion[] {
  if (!Array.isArray(value)) return []
  let activeSeen = 0
  const out: PinnedQuestion[] = []
  for (const item of value) {
    let q: PinnedQuestion | null = null
    if (typeof item === "string") q = { text: item, active: true }
    else if (item && typeof item === "object" && typeof (item as any).text === "string") {
      q = { text: (item as any).text, active: (item as any).active !== false }
    }
    if (!q || !q.text.trim()) continue
    if (q.active) {
      if (activeSeen >= MAX_ACTIVE_QUESTIONS) q.active = false
      else activeSeen++
    }
    out.push(q)
  }
  return out
}

/** Normalise every list in a pinned map (area or report keyed). */
function normalisePinnedMap(value: unknown): Record<string, PinnedQuestion[]> {
  const out: Record<string, PinnedQuestion[]> = {}
  if (value && typeof value === "object") {
    for (const [key, list] of Object.entries(value as Record<string, unknown>)) {
      out[key] = normalisePinnedList(list)
    }
  }
  return out
}

/** Count how many questions in a list are currently active. */
export function activeCount(list: PinnedQuestion[]): number {
  return list.filter((q) => q.active).length
}

/**
 * Seed area-level pins by rolling up the questions already pinned to seed targets,
 * grouped by their (normalised) report area. Preserves existing demo content.
 */
function buildSeedAreaPinned(): AreaPinned {
  const map: AreaPinned = {}
  for (const t of SEED_TARGETS) {
    const area = normaliseArea(t.area)
    const arr = map[area] ?? (map[area] = [])
    for (const q of t.pinned) {
      if (!arr.some((x) => x.text.toLowerCase() === q.toLowerCase())) arr.push({ text: q, active: true })
    }
  }
  return map
}

const SEED_AREA_PINNED: AreaPinned = buildSeedAreaPinned()

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/** Load a pinned map, migrating any legacy string[] shape to PinnedQuestion[]. */
function loadPinnedMap(key: string, fallback: Record<string, PinnedQuestion[]>): Record<string, PinnedQuestion[]> {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? normalisePinnedMap(JSON.parse(raw)) : fallback
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

/**
 * Read the admin-pinned questions for a given report area from the same store
 * AI Management writes to. Used by the chatbot to surface area-specific prompts
 * when it is opened from a dashboard/report belonging to that area.
 */
export function getAreaQuestions(area: string): string[] {
  const all = loadPinnedMap(AREA_PINNED_KEY, SEED_AREA_PINNED)
  return (all[normaliseArea(area)] ?? []).filter((q) => q.active).map((q) => q.text)
}

/**
 * Read the admin-pinned questions for a single specific report/dashboard.
 * These are surfaced by the chatbot only when that exact report is open.
 */
export function getReportQuestions(reportId: string): string[] {
  const all = loadPinnedMap(REPORT_PINNED_KEY, SEED_REPORT_PINNED)
  return (all[reportId] ?? []).filter((q) => q.active).map((q) => q.text)
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAiManagement() {
  const [targets, setTargets] = useState<ChatTarget[]>(SEED_TARGETS)
  const [areaPinned, setAreaPinned] = useState<AreaPinned>(SEED_AREA_PINNED)
  const [reportPinned, setReportPinned] = useState<ReportPinned>(SEED_REPORT_PINNED)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTargets(load(TARGETS_KEY, SEED_TARGETS))
    setAreaPinned(loadPinnedMap(AREA_PINNED_KEY, SEED_AREA_PINNED))
    setReportPinned(loadPinnedMap(REPORT_PINNED_KEY, SEED_REPORT_PINNED))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) save(TARGETS_KEY, targets)
  }, [targets, mounted])

  useEffect(() => {
    if (mounted) save(AREA_PINNED_KEY, areaPinned)
  }, [areaPinned, mounted])

  useEffect(() => {
    if (mounted) save(REPORT_PINNED_KEY, reportPinned)
  }, [reportPinned, mounted])

  /**
   * Pin a question to a report area so it is suggested on every report in that area.
   * New questions are active by default only while under the active cap; otherwise
   * they are added inactive so the admin can enable them by turning another off.
   */
  const pinAreaQuestion = useCallback((area: string, question: string) => {
    const q = question.trim()
    const a = normaliseArea(area)
    if (!q) return
    setAreaPinned((prev) => {
      const list = prev[a] ?? []
      if (list.some((p) => p.text.toLowerCase() === q.toLowerCase())) return prev
      const active = activeCount(list) < MAX_ACTIVE_QUESTIONS
      return { ...prev, [a]: [...list, { text: q, active }] }
    })
  }, [])

  const updateAreaPinned = useCallback((area: string, index: number, question: string) => {
    const q = question.trim()
    const a = normaliseArea(area)
    if (!q) return
    setAreaPinned((prev) => {
      const list = prev[a] ?? []
      return { ...prev, [a]: list.map((p, i) => (i === index ? { ...p, text: q } : p)) }
    })
  }, [])

  const removeAreaPinned = useCallback((area: string, index: number) => {
    const a = normaliseArea(area)
    setAreaPinned((prev) => {
      const list = prev[a] ?? []
      return { ...prev, [a]: list.filter((_, i) => i !== index) }
    })
  }, [])

  /** Toggle a question active/inactive. Turning on is blocked when the cap is reached. */
  const toggleAreaPinned = useCallback((area: string, index: number) => {
    const a = normaliseArea(area)
    setAreaPinned((prev) => {
      const list = prev[a] ?? []
      const target = list[index]
      if (!target) return prev
      if (!target.active && activeCount(list) >= MAX_ACTIVE_QUESTIONS) return prev
      return { ...prev, [a]: list.map((p, i) => (i === index ? { ...p, active: !p.active } : p)) }
    })
  }, [])

  /** Move a question from one position to another (drag-to-reorder). */
  const reorderAreaPinned = useCallback((area: string, from: number, to: number) => {
    const a = normaliseArea(area)
    setAreaPinned((prev) => {
      const list = prev[a] ?? []
      if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return prev
      const next = [...list]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return { ...prev, [a]: next }
    })
  }, [])

  /** Pin a question to a single specific report so it is suggested only on that report. */
  const pinReportQuestion = useCallback((reportId: string, question: string) => {
    const q = question.trim()
    if (!reportId || !q) return
    setReportPinned((prev) => {
      const list = prev[reportId] ?? []
      if (list.some((p) => p.text.toLowerCase() === q.toLowerCase())) return prev
      const active = activeCount(list) < MAX_ACTIVE_QUESTIONS
      return { ...prev, [reportId]: [...list, { text: q, active }] }
    })
  }, [])

  const updateReportPinned = useCallback((reportId: string, index: number, question: string) => {
    const q = question.trim()
    if (!reportId || !q) return
    setReportPinned((prev) => {
      const list = prev[reportId] ?? []
      return { ...prev, [reportId]: list.map((p, i) => (i === index ? { ...p, text: q } : p)) }
    })
  }, [])

  const removeReportPinned = useCallback((reportId: string, index: number) => {
    setReportPinned((prev) => {
      const list = prev[reportId] ?? []
      return { ...prev, [reportId]: list.filter((_, i) => i !== index) }
    })
  }, [])

  /** Toggle a report-specific question active/inactive (capped like area questions). */
  const toggleReportPinned = useCallback((reportId: string, index: number) => {
    setReportPinned((prev) => {
      const list = prev[reportId] ?? []
      const target = list[index]
      if (!target) return prev
      if (!target.active && activeCount(list) >= MAX_ACTIVE_QUESTIONS) return prev
      return { ...prev, [reportId]: list.map((p, i) => (i === index ? { ...p, active: !p.active } : p)) }
    })
  }, [])

  /** Move a report-specific question from one position to another (drag-to-reorder). */
  const reorderReportPinned = useCallback((reportId: string, from: number, to: number) => {
    setReportPinned((prev) => {
      const list = prev[reportId] ?? []
      if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return prev
      const next = [...list]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return { ...prev, [reportId]: next }
    })
  }, [])

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
    areaPinned,
    reportPinned,
    asks,
    log,
    toggleAutoSurface,
    pinQuestion,
    updatePinned,
    removePinned,
    excludeQuestion,
    pinAreaQuestion,
    updateAreaPinned,
    removeAreaPinned,
    toggleAreaPinned,
    reorderAreaPinned,
    pinReportQuestion,
    updateReportPinned,
    removeReportPinned,
    toggleReportPinned,
    reorderReportPinned,
  }
}

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

/** Reports/dashboards that belong to a given report area (matched by normalised area). */
export function targetsForArea(targets: ChatTarget[], area: string): ChatTarget[] {
  return targets.filter((t) => normaliseArea(t.area) === normaliseArea(area))
}

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
    Response: e.answer,
  }))
}

export function uniqueValues<K extends keyof AskLogEntry>(log: AskLogEntry[], key: K): string[] {
  return Array.from(new Set(log.map((e) => String(e[key])))).sort()
}
