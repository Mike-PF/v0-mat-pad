import { reportCategories } from "@/components/reports-content"

export type TierId = "essentials" | "insight" | "enterprise"
export type EntitlementKind = "report" | "template" | "feed"

export interface SubscriptionTier {
  id: TierId
  name: string
  summary: string
}

export const subscriptionTiers: SubscriptionTier[] = [
  { id: "essentials", name: "Essentials", summary: "Core statutory reporting for single schools" },
  { id: "insight", name: "Insight", summary: "Deeper analysis across attainment and behaviour" },
  { id: "enterprise", name: "Enterprise", summary: "Full platform for multi-academy trusts" },
]

export interface EntitlementItem {
  key: string
  kind: EntitlementKind
  name: string
  group: string
}

export const reportItems: EntitlementItem[] = reportCategories.flatMap((category) =>
  category.reports.map((report) => ({
    key: `report:${report.id}`,
    kind: "report" as const,
    name: report.name,
    group: category.name,
  })),
)

export const templateItems: EntitlementItem[] = [
  { id: "governors-termly", name: "Governors Termly Report", group: "Governance" },
  { id: "trust-board-pack", name: "Trust Board Pack", group: "Governance" },
  { id: "headteacher-report", name: "Headteacher Report", group: "Governance" },
  { id: "ofsted-readiness", name: "Ofsted Readiness Pack", group: "Inspection" },
  { id: "sef-summary", name: "Self-Evaluation Summary", group: "Inspection" },
  { id: "pupil-premium-statement", name: "Pupil Premium Statement", group: "Statutory" },
  { id: "sports-premium", name: "PE & Sport Premium Report", group: "Statutory" },
  { id: "send-annual-review", name: "SEND Annual Review", group: "Pupil" },
  { id: "attendance-letter", name: "Attendance Concern Letter", group: "Pupil" },
  { id: "parent-report", name: "End of Year Parent Report", group: "Pupil" },
].map((t) => ({ key: `template:${t.id}`, kind: "template" as const, name: t.name, group: t.group }))

export const feedItems: EntitlementItem[] = [
  { id: "arbor", name: "Arbor MIS", group: "MIS" },
  { id: "sims", name: "SIMS Connect", group: "MIS" },
  { id: "wonde", name: "Wonde Sync", group: "Data Broker" },
  { id: "sisra", name: "SISRA Analytics", group: "Assessment" },
  { id: "cpoms", name: "CPOMS Safeguarding", group: "Safeguarding" },
  { id: "sampeople", name: "SAMpeople HR", group: "HR" },
  { id: "evolve", name: "Evolve Trips", group: "Operations" },
  { id: "safesmart", name: "Safesmart H&S", group: "Compliance" },
].map((f) => ({ key: `feed:${f.id}`, kind: "feed" as const, name: f.name, group: f.group }))

const essentialsReportGroups = ["Attendance", "Contextual"]
const insightReportGroups = [...essentialsReportGroups, "Attainment", "Behaviour"]
const essentialsTemplates = ["governors-termly", "attendance-letter", "pupil-premium-statement"]
const insightTemplates = [...essentialsTemplates, "headteacher-report", "ofsted-readiness", "sef-summary", "parent-report"]
const essentialsFeeds = ["arbor", "sims", "wonde"]
const insightFeeds = [...essentialsFeeds, "sisra", "cpoms"]

export function buildDefaultEntitlements(): Record<TierId, string[]> {
  const pick = (reportGroups: string[], templates: string[], feeds: string[]) => [
    ...reportItems.filter((r) => reportGroups.includes(r.group)).map((r) => r.key),
    ...templates.map((id) => `template:${id}`),
    ...feeds.map((id) => `feed:${id}`),
  ]
  return {
    essentials: pick(essentialsReportGroups, essentialsTemplates, essentialsFeeds),
    insight: pick(insightReportGroups, insightTemplates, insightFeeds),
    enterprise: [...reportItems, ...templateItems, ...feedItems].map((i) => i.key),
  }
}
