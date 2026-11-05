export const MAX_ATTRIBUTE_DEPTH = 5

export interface Attribute {
  id: string
  name: string
  description: string
  parentId: string | null
}

export interface Datablock {
  id: string
  name: string
  section: string
}

export function childrenOf(attributes: Attribute[], parentId: string | null) {
  return attributes.filter((a) => a.parentId === parentId)
}

/** 1-based depth of an attribute in the tree (top level = 1). */
export function depthOf(attributes: Attribute[], id: string): number {
  const byId = new Map(attributes.map((a) => [a.id, a]))
  let depth = 0
  let current = byId.get(id)
  while (current) {
    depth++
    current = current.parentId ? byId.get(current.parentId) : undefined
  }
  return depth
}

/** The attribute itself plus every attribute beneath it. */
export function subtreeIds(attributes: Attribute[], id: string): Set<string> {
  const ids = new Set([id])
  let added = true
  while (added) {
    added = false
    for (const a of attributes) {
      if (a.parentId && ids.has(a.parentId) && !ids.has(a.id)) {
        ids.add(a.id)
        added = true
      }
    }
  }
  return ids
}

/** Keeps the leading part of a path that is still a valid parent → child chain. */
export function validPath(attributes: Attribute[], path: string[] = []): string[] {
  const byId = new Map(attributes.map((a) => [a.id, a]))
  const result: string[] = []
  let parentId: string | null = null
  for (const id of path.slice(0, MAX_ATTRIBUTE_DEPTH)) {
    const attr = byId.get(id)
    if (!attr || attr.parentId !== parentId) break
    result.push(id)
    parentId = id
  }
  return result
}

const node = (id: string, name: string, parentId: string | null = null, description = ""): Attribute => ({
  id,
  name,
  description,
  parentId,
})

// Mock data — replace with real attribute and datablock sources when available.
export const DEFAULT_ATTRIBUTES: Attribute[] = [
  node("qoe", "Quality of education", null, "Curriculum intent, implementation and impact."),
  node("curriculum", "Curriculum", "qoe"),
  node("intent", "Intent", "curriculum"),
  node("reading", "Reading", "intent"),
  node("early-reading", "Early reading & phonics", "reading"),
  node("implementation", "Implementation", "curriculum"),
  node("impact", "Impact", "curriculum"),
  node("outcomes", "Outcomes", "impact"),
  node("ks2-outcomes", "KS2 attainment", "outcomes"),
  node("ks4-outcomes", "KS4 attainment", "outcomes"),
  node("ba", "Behaviour and attitudes", null, "Attendance, conduct and attitudes to learning."),
  node("attendance", "Attendance", "ba"),
  node("persistent-absence-area", "Persistent absence", "attendance"),
  node("behaviour", "Behaviour", "ba"),
  node("suspensions-area", "Suspensions & exclusions", "behaviour"),
  node("pd", "Personal development", null, "Wider development, character and wellbeing."),
  node("wellbeing", "Wellbeing", "pd"),
  node("careers", "Careers", "pd"),
  node("lm", "Leadership and management", null, "Vision, governance, staff development and safeguarding."),
  node("governance", "Governance", "lm"),
  node("staff-development", "Staff development", "lm"),
  node("safeguarding", "Safeguarding", "lm"),
  node("finance", "Finance", "lm"),
  node("budget", "Budget", "finance"),
  node("reserves-area", "Reserves", "budget"),
  node("ey", "Early years provision", null, "Provision for children in the early years foundation stage."),
  node("eyfs-outcomes", "EYFS outcomes", "ey"),
]

export const DATABLOCKS: Datablock[] = [
  { id: "pupil-numbers", name: "Pupil numbers", section: "School Details" },
  { id: "pupil-premium", name: "Pupil premium %", section: "School Details" },
  { id: "send-register", name: "SEND register", section: "School Details" },
  { id: "attendance-overall", name: "Overall attendance", section: "Attendance" },
  { id: "persistent-absence", name: "Persistent absence", section: "Attendance" },
  { id: "suspensions", name: "Suspensions", section: "Behaviour" },
  { id: "exclusions", name: "Permanent exclusions", section: "Behaviour" },
  { id: "behaviour-incidents", name: "Behaviour incidents", section: "Behaviour" },
  { id: "ks2-rwm", name: "KS2 reading, writing & maths", section: "Outcomes" },
  { id: "ks4-progress8", name: "KS4 Progress 8", section: "Outcomes" },
  { id: "phonics-check", name: "Phonics screening check", section: "Outcomes" },
  { id: "eyfs-gld", name: "EYFS good level of development", section: "Outcomes" },
  { id: "staff-turnover", name: "Staff turnover", section: "Staffing" },
  { id: "cpd-hours", name: "CPD hours", section: "Staffing" },
  { id: "safeguarding-referrals", name: "Safeguarding referrals", section: "Safeguarding" },
  { id: "budget-variance", name: "Budget variance", section: "Finance" },
  { id: "reserves", name: "Reserves", section: "Finance" },
]

/** Each datablock maps to a single path through the tree, top level first. */
export function buildDefaultMappings(): Record<string, string[]> {
  return {
    "ks2-rwm": ["qoe", "curriculum", "impact", "outcomes", "ks2-outcomes"],
    "phonics-check": ["qoe", "curriculum", "intent", "reading", "early-reading"],
    "attendance-overall": ["ba", "attendance"],
    "persistent-absence": ["ba", "attendance", "persistent-absence-area"],
    "eyfs-gld": ["ey", "eyfs-outcomes"],
    reserves: ["lm", "finance", "budget", "reserves-area"],
  }
}
