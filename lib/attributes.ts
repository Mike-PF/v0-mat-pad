export const MAX_ATTRIBUTES_PER_DATABLOCK = 5

export interface Attribute {
  id: string
  name: string
  description: string
}

export interface Datablock {
  id: string
  name: string
  section: string
}

// Mock data — replace with real attribute and datablock sources when available.
export const DEFAULT_ATTRIBUTES: Attribute[] = [
  { id: "quality-of-education", name: "Quality of education", description: "Curriculum intent, implementation and impact." },
  { id: "behaviour-and-attitudes", name: "Behaviour and attitudes", description: "Attendance, conduct and attitudes to learning." },
  { id: "personal-development", name: "Personal development", description: "Wider development, character and wellbeing." },
  { id: "leadership-and-management", name: "Leadership and management", description: "Vision, governance, staff development and safeguarding." },
  { id: "early-years-provision", name: "Early years provision", description: "Provision for children in the early years foundation stage." },
  { id: "finance", name: "Finance", description: "Budget, spend and financial sustainability." },
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

export function buildDefaultMappings(): Record<string, string[]> {
  return {
    "attendance-overall": ["behaviour-and-attitudes"],
    "persistent-absence": ["behaviour-and-attitudes", "personal-development"],
    "ks2-rwm": ["quality-of-education"],
    "eyfs-gld": ["early-years-provision", "quality-of-education"],
    "budget-variance": ["finance", "leadership-and-management"],
  }
}
