"use client"

import { useEffect, useState } from "react"
import { Megaphone, CalendarDays, Wrench, AlertCircle, Info, type LucideIcon } from "lucide-react"

export type NotificationType = "update" | "deadline" | "system"

/**
 * Who a notification is shown to.
 * - "all": every system user.
 * - "targeted": only users belonging to the selected organisations. Each target
 *   is a MAT (whole trust, including its schools) or an individual school.
 */
export type AudienceScope = "all" | "targeted"

export type AudienceTarget = {
  /** "mat" targets a whole trust and all of its schools; "school" targets a single school. */
  kind: "mat" | "school"
  id: string
  name: string
}

export type NotificationAudience = {
  scope: AudienceScope
  /** Only populated when scope is "targeted". */
  targets?: AudienceTarget[]
}

/**
 * A downloadable file attached to a notification. When `dataUrl` is present the
 * file can be downloaded directly from the homepage (it holds the encoded file
 * contents). Seed items may omit it, in which case the attachment is display-only.
 */
export type NotificationDocument = {
  name: string
  /** Human-readable size, e.g. "142 KB". */
  size: string
  /** File extension used for the badge label and colour, e.g. "pdf", "xlsx", "docx". */
  type: string
  /** Encoded file contents (data URL) used to download the file. */
  dataUrl?: string
}

/** Format a byte count as a short human-readable size (e.g. 142 KB, 1.2 MB). */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Derive a lowercase file extension (used for the badge) from a filename. */
export function fileExtension(name: string): string {
  const parts = name.split(".")
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "file"
}

/** Trigger a browser download of a document that carries a data URL. */
export function downloadDocument(doc: NotificationDocument): void {
  if (typeof window === "undefined" || !doc.dataUrl) return
  const link = document.createElement("a")
  link.href = doc.dataUrl
  link.download = doc.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export type WhatsNewItem = {
  id: string
  type: NotificationType
  title: string
  description: string
  date: string
  visible: boolean
  daysLeft?: number
  isUrgent?: boolean
  isNew?: boolean
  /** ISO timestamp recording when the item was marked as NEW. Used to expire the NEW badge after a few days. */
  newSince?: string
  isActive?: boolean
  body?: string
  video?: { url: string; title: string }
  documents?: NotificationDocument[]
  /** Audience the notification is delivered to. Defaults to all users when omitted. */
  audience?: NotificationAudience
}

/**
 * Directory of organisations available as notification targets. Mirrors the
 * organisations defined on the Organisation settings page. A MAT entry targets
 * the whole trust (and all its schools); each school can also be targeted alone.
 */
export type OrgDirectoryEntry = {
  id: string
  name: string
  kind: "mat" | "school"
  /** Schools belonging to a MAT, used to power per-school targeting. */
  schools?: { id: string; name: string }[]
}

export const ORG_DIRECTORY: OrgDirectoryEntry[] = [
  {
    id: "mat-1",
    name: "St Clare Catholic Multi Academy Trust",
    kind: "mat",
    schools: [
      { id: "school-1", name: "All Saints' Catholic High School" },
      { id: "school-2", name: "Emmaus Catholic and CofE Primary School" },
      { id: "school-3", name: "Notre Dame High School" },
    ],
  },
  {
    id: "mat-2",
    name: "Holy Family Catholic Academy Trust",
    kind: "mat",
    schools: [{ id: "school-4", name: "Sacred Heart School" }],
  },
  {
    id: "standalone-1",
    name: "St Alban's Catholic Primary and Nursery School",
    kind: "school",
  },
  {
    id: "standalone-2",
    name: "Holy Trinity Catholic and Church of England School",
    kind: "school",
  },
]

/** Human-readable summary of who a notification is delivered to. */
export function describeAudience(audience?: NotificationAudience): string {
  if (!audience || audience.scope === "all") return "All users"
  const targets = audience.targets ?? []
  if (targets.length === 0) return "No recipients selected"
  if (targets.length === 1) return targets[0].name
  return `${targets.length} organisations`
}

const ACCENT = "#B30089"

export const NOTIFICATION_TYPES: { value: NotificationType; label: string }[] = [
  { value: "update", label: "Update" },
  { value: "deadline", label: "Deadline" },
  { value: "system", label: "System" },
]

export function getTypeIcon(type: string): LucideIcon {
  switch (type) {
    case "update":
      return Megaphone
    case "deadline":
      return CalendarDays
    case "system":
    // Legacy types kept for any notifications saved before types were consolidated.
    case "maintenance":
      return Wrench
    case "issue":
      return AlertCircle
    default:
      return Info
  }
}

export function getTypeColor(type: string): string {
  switch (type) {
    case "update":
      return "#5B9BF5"
    case "deadline":
      return ACCENT
    case "system":
    case "maintenance":
      return "#64748b"
    case "issue":
      return "#ef4444"
    default:
      return "#64748b"
  }
}

export function getTypeLabel(type: string): string {
  return NOTIFICATION_TYPES.find((t) => t.value === type)?.label ?? type
}

/** How long a notification keeps showing the "NEW" badge after being marked new. */
export const NEW_DURATION_DAYS = 3

/**
 * A notification only counts as "new" when it is flagged isNew AND was marked
 * new within the last NEW_DURATION_DAYS days. Items without a timestamp are
 * treated as new for backwards compatibility.
 */
export function isCurrentlyNew(item: Pick<WhatsNewItem, "isNew" | "newSince">): boolean {
  if (!item.isNew) return false
  if (!item.newSince) return true
  const since = new Date(item.newSince).getTime()
  if (Number.isNaN(since)) return true
  return Date.now() - since <= NEW_DURATION_DAYS * 24 * 60 * 60 * 1000
}

// Seed data — the single source of truth that the homepage reads from.
export const defaultNotifications: WhatsNewItem[] = [
  {
    id: "spring-census",
    type: "deadline",
    title: "Spring Census deadline",
    description: "Submit census data by 16 January 2025",
    date: "16 Jan",
    visible: true,
    daysLeft: 2,
    isUrgent: true,
    body: "The Spring School Census is due on 16 January 2025. All schools must ensure their data has been validated and submitted via COLLECT before 11:59pm on the deadline date.\n\nKey areas to check before submission:\n• Pupil headcount and new admissions\n• Attendance codes for the reference week\n• Free school meal eligibility\n• SEN support and EHCP records\n\nContact your data manager if you encounter any COLLECT errors. DfE will not accept late submissions without prior written agreement.",
    documents: [
      { name: "Spring Census Checklist 2025.pdf", size: "142 KB", type: "pdf" },
      { name: "COLLECT Submission Guide.pdf", size: "380 KB", type: "pdf" },
    ],
  },
  {
    id: "attendance-dashboard",
    type: "update",
    title: "New attendance dashboard released",
    description: "Enhanced visualisations for persistent absence tracking",
    date: "Today",
    visible: true,
    isNew: true,
    body: "We have released an updated Attendance Dashboard with several improvements based on user feedback:\n\n• Persistent Absence cohort drill-down now available at pupil level\n• Comparison against national and regional averages added to all charts\n• New 'at risk' threshold alerts for pupils approaching 90% threshold\n• Export to Excel now includes all filters applied\n\nThe dashboard is available from the Dashboards section in the left-hand navigation. Watch the short walkthrough video below for an overview of the new features.",
    video: {
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "New Attendance Dashboard Walkthrough",
    },
    documents: [{ name: "Attendance Dashboard Release Notes.pdf", size: "98 KB", type: "pdf" }],
  },
  {
    id: "scheduled-maintenance",
    type: "system",
    title: "Scheduled maintenance",
    description: "System unavailable 02:00–04:00 GMT on 18 January",
    date: "18 Jan",
    visible: true,
    daysLeft: 4,
    body: "Planned maintenance will take place on the night of 18 January 2025 between 02:00 and 04:00 GMT. The following services will be unavailable during this window:\n\n• All data upload functionality\n• Report generation and export\n• Dashboard access\n\nUser authentication and read-only access to saved reports will remain available. No action is required — the system will resume normal operation automatically. Please ensure any time-sensitive uploads are completed before 01:30 GMT.",
  },
  {
    id: "export-delays",
    type: "system",
    title: "Known issue: Export delays",
    description: "Large exports may take longer than usual",
    date: "Active",
    visible: true,
    isActive: true,
    body: "We are aware of an issue affecting large data exports (files over 50,000 rows). Exports are completing successfully but may take up to 15 minutes longer than normal.\n\nWorkarounds:\n• Apply additional filters to reduce export size before downloading\n• Use the 'Schedule Export' option to run exports overnight\n• Exports under 10,000 rows are unaffected\n\nOur engineering team is investigating the root cause. We expect a fix to be deployed by 20 January. We apologise for the inconvenience.",
  },
  {
    id: "workforce-census",
    type: "deadline",
    title: "Workforce Census opens",
    description: "Annual workforce census collection begins",
    date: "4 Nov",
    visible: true,
    daysLeft: 292,
    body: "The Annual School Workforce Census opens on 4 November 2025. All maintained schools and academies are required to submit workforce data to the DfE by the deadline.\n\nData required includes:\n• Staff headcount and FTE\n• Qualifications and subject specialisms\n• Absence and vacancies\n• Salary and pay range information\n\nFull guidance and the submission portal will be available on the DfE COLLECT website from 1 October 2025.",
    documents: [{ name: "Workforce Census Guidance 2025.xlsx", size: "1.2 MB", type: "xlsx" }],
  },
]

const STORAGE_KEY = "matpad:system-notifications"

function loadNotifications(): WhatsNewItem[] {
  if (typeof window === "undefined") return defaultNotifications
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultNotifications
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaultNotifications
    return parsed as WhatsNewItem[]
  } catch {
    return defaultNotifications
  }
}

function saveNotifications(items: WhatsNewItem[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Ignore write errors (e.g. storage disabled)
  }
}

/**
 * Shared hook for reading and updating system notifications.
 * Backed by localStorage so changes on the System Notifications settings
 * page are reflected on the homepage's "What's New & Key Dates" widget.
 */
export function useNotifications() {
  const [items, setItems] = useState<WhatsNewItem[]>(defaultNotifications)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(loadNotifications())
    setHydrated(true)
  }, [])

  const update = (next: WhatsNewItem[] | ((prev: WhatsNewItem[]) => WhatsNewItem[])) => {
    setItems((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next
      saveNotifications(resolved)
      return resolved
    })
  }

  return { items, setItems: update, hydrated }
}
